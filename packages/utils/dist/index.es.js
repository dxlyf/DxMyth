var qy = Object.prototype.hasOwnProperty, Ot = "~";
function Wn() {
}
Object.create && (Wn.prototype = /* @__PURE__ */ Object.create(null), new Wn().__proto__ || (Ot = !1));
function Uy(t, e, r) {
  this.fn = t, this.context = e, this.once = r || !1;
}
function Cl(t, e, r, n, i) {
  if (typeof r != "function")
    throw new TypeError("The listener must be a function");
  var o = new Uy(r, n || t, i), s = Ot ? Ot + e : e;
  return t._events[s] ? t._events[s].fn ? t._events[s] = [t._events[s], o] : t._events[s].push(o) : (t._events[s] = o, t._eventsCount++), t;
}
function no(t, e) {
  --t._eventsCount === 0 ? t._events = new Wn() : delete t._events[e];
}
function pt() {
  this._events = new Wn(), this._eventsCount = 0;
}
pt.prototype.eventNames = function() {
  var e = [], r, n;
  if (this._eventsCount === 0) return e;
  for (n in r = this._events)
    qy.call(r, n) && e.push(Ot ? n.slice(1) : n);
  return Object.getOwnPropertySymbols ? e.concat(Object.getOwnPropertySymbols(r)) : e;
};
pt.prototype.listeners = function(e) {
  var r = Ot ? Ot + e : e, n = this._events[r];
  if (!n) return [];
  if (n.fn) return [n.fn];
  for (var i = 0, o = n.length, s = new Array(o); i < o; i++)
    s[i] = n[i].fn;
  return s;
};
pt.prototype.listenerCount = function(e) {
  var r = Ot ? Ot + e : e, n = this._events[r];
  return n ? n.fn ? 1 : n.length : 0;
};
pt.prototype.emit = function(e, r, n, i, o, s) {
  var u = Ot ? Ot + e : e;
  if (!this._events[u]) return !1;
  var a = this._events[u], f = arguments.length, c, l;
  if (a.fn) {
    switch (a.once && this.removeListener(e, a.fn, void 0, !0), f) {
      case 1:
        return a.fn.call(a.context), !0;
      case 2:
        return a.fn.call(a.context, r), !0;
      case 3:
        return a.fn.call(a.context, r, n), !0;
      case 4:
        return a.fn.call(a.context, r, n, i), !0;
      case 5:
        return a.fn.call(a.context, r, n, i, o), !0;
      case 6:
        return a.fn.call(a.context, r, n, i, o, s), !0;
    }
    for (l = 1, c = new Array(f - 1); l < f; l++)
      c[l - 1] = arguments[l];
    a.fn.apply(a.context, c);
  } else {
    var p = a.length, d;
    for (l = 0; l < p; l++)
      switch (a[l].once && this.removeListener(e, a[l].fn, void 0, !0), f) {
        case 1:
          a[l].fn.call(a[l].context);
          break;
        case 2:
          a[l].fn.call(a[l].context, r);
          break;
        case 3:
          a[l].fn.call(a[l].context, r, n);
          break;
        case 4:
          a[l].fn.call(a[l].context, r, n, i);
          break;
        default:
          if (!c) for (d = 1, c = new Array(f - 1); d < f; d++)
            c[d - 1] = arguments[d];
          a[l].fn.apply(a[l].context, c);
      }
  }
  return !0;
};
pt.prototype.on = function(e, r, n) {
  return Cl(this, e, r, n, !1);
};
pt.prototype.once = function(e, r, n) {
  return Cl(this, e, r, n, !0);
};
pt.prototype.removeListener = function(e, r, n, i) {
  var o = Ot ? Ot + e : e;
  if (!this._events[o]) return this;
  if (!r)
    return no(this, o), this;
  var s = this._events[o];
  if (s.fn)
    s.fn === r && (!i || s.once) && (!n || s.context === n) && no(this, o);
  else {
    for (var u = 0, a = [], f = s.length; u < f; u++)
      (s[u].fn !== r || i && !s[u].once || n && s[u].context !== n) && a.push(s[u]);
    a.length ? this._events[o] = a.length === 1 ? a[0] : a : no(this, o);
  }
  return this;
};
pt.prototype.removeAllListeners = function(e) {
  var r;
  return e ? (r = Ot ? Ot + e : e, this._events[r] && no(this, r)) : (this._events = new Wn(), this._eventsCount = 0), this;
};
pt.prototype.off = pt.prototype.removeListener;
pt.prototype.addListener = pt.prototype.on;
pt.prefixed = Ot;
pt.EventEmitter = pt;
const Po = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
}, Fl = Po.NONE, Gy = Po.CAPTURING_PHASE, Gf = Po.AT_TARGET, ky = Po.BUBBLING_PHASE;
class c3 {
  static create(e, r, n) {
    return new this(e, r, n);
  }
  type = "none";
  parentNode = null;
  target = null;
  currentTarget = null;
  data = null;
  eventPhase = Fl;
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
  constructor(e, r, n) {
    this.initEvent(e, r, n);
  }
  setData(e) {
    return this.data = e, this;
  }
  initEvent(e, r = !0, n = !0) {
    this.type = e, this.bubbles = r, this.cancelable = n;
  }
  /**
   * 
   * @returns {EventTarget[]}
   */
  composedPath() {
    let e = this.currentTarget, r = [];
    for (; e; )
      r.push(e), e = e.parentNode;
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
function kf(t) {
  return (typeof t == "boolean" || !t) && (t = {
    capture: !!t
  }), t = { capture: !1, once: !1, ...t || {} }, t;
}
function Hf(t, e) {
  var r = t._events[e], n;
  if (!r) return [];
  if (r.fn) return [r];
  for (var i = 0, o = r.length, n = new Array(o); i < o; i++)
    n[i] = r[i];
  return n;
}
class jr {
  parentNode = null;
  _bubble_emitter = new pt();
  _capture_emitter = new pt();
  addEventListener(e, r, n) {
    n = kf(n);
    const i = n.capture ? this._capture_emitter : this._bubble_emitter;
    n && n.once ? i.once(e, r) : i.on(e, r);
  }
  removeEventListener(e, r, n) {
    n = kf(n), (n.capture ? this._capture_emitter : this._bubble_emitter).off(e, r);
  }
  /**
   * 
   * @param {Event} e 
   */
  dispatchEvent(e) {
    e.currentTarget = this;
    const r = e.type, n = e.composedPath(), i = n.length;
    for (let o = i - 1; o >= 0; o--) {
      const s = n[o]._capture_emitter;
      if (s.listenerCount(r) > 0) {
        e.target = n[o], e.eventPhase = e.target !== this ? Gy : Gf;
        const a = Hf(s, r);
        for (let f = 0, c = a.length; f < c; f++) {
          const l = a[f];
          if (l.once && s.removeListener(r, l.fn, l.context, l.once), l.fn(e), e.immediateCancelBubble)
            break;
        }
      }
      if (e.cancelBubble)
        break;
    }
    if (!e.cancelBubble)
      for (let o = 0; o < i; o++) {
        const s = n[o]._bubble_emitter;
        if (s.listenerCount(r) > 0) {
          e.target = n[o], e.eventPhase = e.target !== this ? ky : Gf;
          const a = Hf(s, r);
          for (let f = 0, c = a.length; f < c; f++) {
            const l = a[f];
            if (l.once && s.removeListener(r, l.fn, l.context, l.once), l.fn(e), e.immediateCancelBubble)
              break;
          }
        }
        if (e.cancelBubble || !e.bubbles)
          break;
      }
    return e.eventPhase = Fl, !e.defaultPrevented;
  }
  removeAllListeners() {
    this._bubble_emitter.removeAllListeners(), this._capture_emitter.removeAllListeners();
  }
}
jr.prototype.on = jr.prototype.addEventListener;
jr.prototype.off = jr.prototype.removeEventListener;
jr.prototype.emit = jr.prototype.dispatchEvent;
class l3 {
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
    return this.destroyedList || (this.memory && !this.firing && (this.firingIndex = this.list.length - 1, this.queue.push(this.memory)), e.forEach((r) => {
      typeof r == "function" ? (!this.options.unique || !this.has(r)) && this.list.push(r) : r && r.length && Array.isArray(r) && this.add(...r);
    }), this.memory && !this.firing && this._fire()), this;
  }
  // Remove a callback from the list
  remove(...e) {
    return e.forEach((r) => {
      for (var n = 0; (n = this.list.indexOf(r, n)) > -1; )
        this.list.splice(n, 1), n <= this.firingIndex && this.firingIndex--;
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
  fireWith(e, r) {
    return this.locked || (r = r || [], r = [e, r.slice ? r.slice() : r], this.queue.push(r), this.firing || this._fire()), this;
  }
  // 用给定参数调用所有回调   
  fire(...e) {
    return this.fireWith(this, e), this;
  }
}
class h3 {
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
    const e = this.heap[0], r = this.heap.pop();
    return this.isEmpty() || (this.heap[0] = r, this.siftDown(0)), e;
  }
  // 上浮操作
  siftUp(e) {
    for (; e > 0; ) {
      const r = Math.floor((e - 1) / 2);
      if (this.compare(this.heap[e], this.heap[r]) >= 0) break;
      this.swap(e, r), e = r;
    }
  }
  // 下沉操作
  siftDown(e) {
    const r = this.size;
    for (; e < r; ) {
      const n = 2 * e + 1, i = 2 * e + 2;
      let o = e;
      if (n < r && this.compare(this.heap[n], this.heap[o]) < 0 && (o = n), i < r && this.compare(this.heap[i], this.heap[o]) < 0 && (o = i), o === e) break;
      this.swap(e, o), e = o;
    }
  }
  // 交换元素
  swap(e, r) {
    [this.heap[e], this.heap[r]] = [this.heap[r], this.heap[e]];
  }
  /**
   * 清空队列
   */
  clear() {
    this.heap = [];
  }
}
const Nl = (t) => !!t && t.constructor === Symbol, qn = Array.isArray, ju = (t) => !!t && t.constructor === Object, zl = (t) => t == null || typeof t != "object" && typeof t != "function", li = (t) => !!(t && t.constructor && t.call && t.apply), Hy = (t) => typeof t == "string" || t instanceof String, Ky = (t) => Cr(t) && t % 1 === 0, Yy = (t) => Cr(t) && t % 1 !== 0, Cr = (t) => {
  try {
    return Number(t) === t;
  } catch {
    return !1;
  }
}, Dl = (t) => Object.prototype.toString.call(t) === "[object Date]", Bl = (t) => !(!t || !t.then || !li(t.then)), Zy = (t) => {
  if (t === !0 || t === !1 || t == null) return !0;
  if (Cr(t)) return t === 0;
  if (Dl(t)) return isNaN(t.getTime());
  if (li(t) || Nl(t)) return !1;
  const e = t.length;
  if (Cr(e)) return e === 0;
  const r = t.size;
  return Cr(r) ? r === 0 : Object.keys(t).length === 0;
}, jl = (t, e) => {
  if (Object.is(t, e)) return !0;
  if (t instanceof Date && e instanceof Date)
    return t.getTime() === e.getTime();
  if (t instanceof RegExp && e instanceof RegExp)
    return t.toString() === e.toString();
  if (typeof t != "object" || t === null || typeof e != "object" || e === null)
    return !1;
  const r = Reflect.ownKeys(t), n = Reflect.ownKeys(e);
  if (r.length !== n.length) return !1;
  for (let i = 0; i < r.length; i++)
    if (!Reflect.has(e, r[i]) || !jl(t[r[i]], e[r[i]])) return !1;
  return !0;
}, Xy = (t, e) => t.reduce((r, n) => {
  const i = e(n);
  return r[i] || (r[i] = []), r[i].push(n), r;
}, {});
function Vy(...t) {
  return !t || !t.length ? [] : new Array(Math.max(...t.map(({ length: e }) => e))).fill([]).map((e, r) => t.map((n) => n[r]));
}
function Jy(t, e) {
  if (!t || !t.length)
    return {};
  const r = li(e) ? e : qn(e) ? (n, i) => e[i] : (n, i) => e;
  return t.reduce((n, i, o) => (n[i] = r(i, o), n), {});
}
const Wu = (t, e) => !t || (t.length ?? 0) === 0 ? null : t.reduce(e);
function Qy(t, e) {
  return (t || []).reduce((r, n) => r + (e ? e(n) : n), 0);
}
const t1 = (t, e = void 0) => t?.length > 0 ? t[0] : e, e1 = (t, e = void 0) => t?.length > 0 ? t[t.length - 1] : e, Wl = (t, e, r = !1) => {
  if (!t) return [];
  const n = (o, s) => e(o) - e(s), i = (o, s) => e(s) - e(o);
  return t.slice().sort(r === !0 ? i : n);
}, r1 = (t, e, r = "asc") => {
  if (!t) return [];
  const n = (o, s) => `${e(o)}`.localeCompare(e(s)), i = (o, s) => `${e(s)}`.localeCompare(e(o));
  return t.slice().sort(r === "desc" ? i : n);
}, n1 = (t, e) => t ? t.reduce((r, n) => {
  const i = e(n);
  return r[i] = (r[i] ?? 0) + 1, r;
}, {}) : {}, i1 = (t, e, r) => {
  if (!t) return [];
  if (e === void 0) return [...t];
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    if (r(i, n))
      return [
        ...t.slice(0, n),
        e,
        ...t.slice(n + 1, t.length)
      ];
  }
  return [...t];
}, ql = (t, e, r = (n) => n) => t.reduce((n, i) => (n[e(i)] = r(i), n), {}), o1 = (t, e, r) => t ? t.reduce((n, i, o) => (r(i, o) && n.push(e(i, o)), n), []) : [];
function s1(t, e) {
  const r = e ?? ((n) => n);
  return Wu(t, (n, i) => r(n) > r(i) ? n : i);
}
function u1(t, e) {
  const r = e ?? ((n) => n);
  return Wu(t, (n, i) => r(n) < r(i) ? n : i);
}
const a1 = (t, e = 2) => {
  const r = Math.ceil(t.length / e);
  return new Array(r).fill(null).map((n, i) => t.slice(i * e, i * e + e));
}, f1 = (t, e) => {
  const r = t.reduce((n, i) => {
    const o = e ? e(i) : i;
    return n[o] || (n[o] = i), n;
  }, {});
  return Object.values(r);
};
function* qu(t, e, r = (i) => i, n = 1) {
  const i = li(r) ? r : () => r, o = e ? t : 0, s = e ?? t;
  for (let u = o; u <= s && (yield i(u), !(u + n > s)); u += n)
    ;
}
const Uu = (t, e, r, n) => Array.from(qu(t, e, r, n)), c1 = (t) => t.reduce((e, r) => (e.push(...r), e), []), l1 = (t, e, r) => {
  if (!t || !e) return !1;
  const n = r ?? ((o) => o), i = e.reduce((o, s) => (o[n(s)] = !0, o), {});
  return t.some((o) => i[n(o)]);
}, Ul = (t, e) => t ? t.reduce(
  (r, n) => {
    const [i, o] = r;
    return e(n) ? [[...i, n], o] : [i, [...o, n]];
  },
  [[], []]
) : [[], []], h1 = (t, e, r) => !e && !t ? [] : e ? t ? r ? t.reduce((n, i) => {
  const o = e.find((s) => r(i) === r(s));
  return o ? n.push(o) : n.push(i), n;
}, []) : t : [] : t, p1 = (t, e, r) => {
  if (!t && !e) return [];
  if (!e) return [...t];
  if (!t) return [e];
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    if (r(i, n))
      return [
        ...t.slice(0, n),
        e,
        ...t.slice(n + 1, t.length)
      ];
  }
  return [...t, e];
}, d1 = (t, e, r, n) => {
  if (!t && !e) return [];
  if (!t) return [e];
  if (!e) return [...t];
  const i = r ? (u, a) => r(u, a) === r(e, a) : (u) => u === e;
  return t.find(i) ? t.filter((u, a) => !i(u, a)) : (n?.strategy ?? "append") === "append" ? [...t, e] : [e, ...t];
}, _1 = (t) => t?.filter((e) => !!e) ?? [], Gl = (t, e, r) => {
  let n = r;
  for (let i = 1; i <= t; i++)
    n = e(n, i);
  return n;
}, g1 = (t, e, r = (n) => n) => {
  if (!t?.length && !e?.length) return [];
  if (t?.length === void 0) return [...e];
  if (!e?.length) return [...t];
  const n = e.reduce((i, o) => (i[r(o)] = !0, i), {});
  return t.filter((i) => !n[r(i)]);
};
function v1(t, e) {
  if (t.length === 0) return t;
  const r = e % t.length;
  return r === 0 ? t : [...t.slice(-r, t.length), ...t.slice(0, -r)];
}
const y1 = async (t, e, r) => {
  const n = r !== void 0;
  if (!n && t?.length < 1)
    throw new Error("Cannot reduce empty array with no init value");
  const i = n ? t : t.slice(1);
  let o = n ? r : t[0];
  for (const [s, u] of i.entries())
    o = await e(o, u, s);
  return o;
}, m1 = async (t, e) => {
  if (!t) return [];
  let r = [], n = 0;
  for (const i of t) {
    const o = await e(i, n++);
    r.push(o);
  }
  return r;
}, b1 = async (t) => {
  const e = [], r = (o, s) => e.push({
    fn: o,
    rethrow: s?.rethrow ?? !1
  }), [n, i] = await Wr(t)(r);
  for (const { fn: o, rethrow: s } of e) {
    const [u] = await Wr(o)(n);
    if (u && s) throw u;
  }
  if (n) throw n;
  return i;
};
class kl extends Error {
  errors;
  constructor(e = []) {
    super();
    const r = e.find((n) => n.name)?.name ?? "";
    this.name = `AggregateError(${r}...)`, this.message = `AggregateError with ${e.length} errors`, this.stack = e.find((n) => n.stack)?.stack ?? this.stack, this.errors = e;
  }
}
const w1 = async (t, e, r) => {
  const n = e.map((f, c) => ({
    index: c,
    item: f
  })), i = async (f) => {
    const c = [];
    for (; ; ) {
      const l = n.pop();
      if (!l) return f(c);
      const [p, d] = await Wr(r)(l.item);
      c.push({
        error: p,
        result: d,
        index: l.index
      });
    }
  }, o = Uu(1, t).map(() => new Promise(i)), s = await Promise.all(o), [u, a] = Ul(
    Wl(s.flat(), (f) => f.index),
    (f) => !!f.error
  );
  if (u.length > 0)
    throw new kl(u.map((f) => f.error));
  return a.map((f) => f.result);
};
async function A1(t) {
  const e = qn(t) ? t.map((i) => [null, i]) : Object.entries(t), r = await Promise.all(
    e.map(
      ([i, o]) => o.then((s) => ({ result: s, exc: null, key: i })).catch((s) => ({ result: null, exc: s, key: i }))
    )
  ), n = r.filter((i) => i.exc);
  if (n.length > 0)
    throw new kl(n.map((i) => i.exc));
  return qn(t) ? r.map((i) => i.result) : r.reduce(
    (i, o) => ({
      ...i,
      [o.key]: o.result
    }),
    {}
  );
}
const S1 = async (t, e) => {
  const r = t?.times ?? 3, n = t?.delay, i = t?.backoff ?? null;
  for (const o of qu(1, r)) {
    const [s, u] = await Wr(e)((a) => {
      throw { _exited: a };
    });
    if (!s) return u;
    if (s._exited) throw s._exited;
    if (o === r) throw s;
    n && await eu(n), i && await eu(i(o));
  }
}, eu = (t) => new Promise((e) => setTimeout(e, t)), Wr = (t) => (...e) => {
  try {
    const r = t(...e);
    return Bl(r) ? r.then((n) => [void 0, n]).catch((n) => [n, void 0]) : [void 0, r];
  } catch (r) {
    return [r, void 0];
  }
}, x1 = (t, e) => {
  const r = (i) => {
    if (e && !e(i)) throw i;
  }, n = (i) => i instanceof Promise;
  try {
    const i = t();
    return n(i) ? i.catch(r) : i;
  } catch (i) {
    return r(i);
  }
};
function O1(...t) {
  return (...e) => t.slice(1).reduce((r, n) => n(r), t[0](...e));
}
function E1(...t) {
  return t.reverse().reduce((e, r) => r(e));
}
const R1 = (t, ...e) => (...r) => t(...e, ...r), $1 = (t, e) => (r) => t({
  ...e,
  ...r
}), T1 = (t) => new Proxy(
  {},
  {
    get: (e, r) => t(r)
  }
), M1 = (t, e, r, n) => function(...o) {
  const s = r ? r(...o) : JSON.stringify({ args: o }), u = t[s];
  if (u !== void 0 && (!u.exp || u.exp > (/* @__PURE__ */ new Date()).getTime()))
    return u.value;
  const a = e(...o);
  return t[s] = {
    exp: n ? (/* @__PURE__ */ new Date()).getTime() + n : null,
    value: a
  }, a;
}, I1 = (t, e = {}) => M1({}, t, e.key ?? null, e.ttl ?? null), P1 = ({ delay: t }, e) => {
  let r, n = !0;
  const i = (...o) => {
    n ? (clearTimeout(r), r = setTimeout(() => {
      n && e(...o), r = void 0;
    }, t)) : e(...o);
  };
  return i.isPending = () => r !== void 0, i.cancel = () => {
    n = !1;
  }, i.flush = (...o) => e(...o), i;
}, L1 = ({ interval: t }, e) => {
  let r = !0, n;
  const i = (...o) => {
    r && (e(...o), r = !1, n = setTimeout(() => {
      r = !0, n = void 0;
    }, t));
  };
  return i.isThrottled = () => n !== void 0, i;
}, C1 = (t, e) => {
  const r = () => {
  };
  return new Proxy(Object.assign(r, t), {
    get: (n, i) => n[i],
    set: (n, i, o) => (n[i] = o, !0),
    apply: (n, i, o) => e(Object.assign({}, n))(...o)
  });
};
function F1(t, e, r) {
  return typeof t == "number" && typeof e == "number" && (typeof r > "u" || typeof r == "number") ? (typeof r > "u" && (r = e, e = 0), t >= Math.min(e, r) && t < Math.max(e, r)) : !1;
}
const N1 = (t, e) => {
  const r = e === void 0 ? 0 : e;
  if (t == null)
    return r;
  const n = parseFloat(t);
  return isNaN(n) ? r : n;
}, Hl = (t, e) => {
  const r = e === void 0 ? 0 : e;
  if (t == null)
    return r;
  const n = parseInt(t);
  return isNaN(n) ? r : n;
}, z1 = (t, e = (r) => r === void 0) => t ? Object.keys(t).reduce((n, i) => (e(t[i]) || (n[i] = t[i]), n), {}) : {}, Gu = (t, e) => Object.keys(t).reduce((n, i) => (n[e(i, t[i])] = t[i], n), {}), D1 = (t, e) => Object.keys(t).reduce((n, i) => (n[i] = e(t[i], i), n), {}), B1 = (t, e) => t ? Object.entries(t).reduce((r, [n, i]) => {
  const [o, s] = e(n, i);
  return r[o] = s, r;
}, {}) : {}, j1 = (t) => t ? Object.keys(t).reduce((r, n) => (r[t[n]] = n, r), {}) : {}, W1 = (t) => Gu(t, (e) => e.toLowerCase()), q1 = (t) => Gu(t, (e) => e.toUpperCase()), Kl = (t) => {
  if (zl(t))
    return t;
  if (typeof t == "function")
    return t.bind({});
  const e = new t.constructor();
  return Object.getOwnPropertyNames(t).forEach((r) => {
    e[r] = t[r];
  }), e;
}, U1 = (t, e) => {
  if (!t) return [];
  const r = Object.entries(t);
  return r.length === 0 ? [] : r.reduce((n, i) => (n.push(e(i[0], i[1])), n), []);
}, G1 = (t, e) => t ? e.reduce((r, n) => (Object.prototype.hasOwnProperty.call(t, n) && (r[n] = t[n]), r), {}) : {}, k1 = (t, e) => t ? !e || e.length === 0 ? t : e.reduce(
  (r, n) => (delete r[n], r),
  { ...t }
) : {}, Yl = (t, e, r) => {
  const n = e.split(/[\.\[\]]/g);
  let i = t;
  for (const o of n) {
    if (i === null || i === void 0) return r;
    const s = o.replace(/['"]/g, "");
    s.trim() !== "" && (i = i[s]);
  }
  return i === void 0 ? r : i;
}, Zl = (t, e, r) => {
  if (!t) return {};
  if (!e || r === void 0) return t;
  const n = e.split(/[\.\[\]]/g).filter((s) => !!s.trim()), i = (s) => {
    if (n.length > 1) {
      const u = n.shift(), a = Hl(n[0], null) !== null;
      s[u] = s[u] === void 0 ? a ? [] : {} : s[u], i(s[u]);
    } else
      s[n[0]] = r;
  }, o = Kl(t);
  return i(o), o;
}, Xl = (t, e) => !t || !e ? t ?? e ?? {} : Object.entries({ ...t, ...e }).reduce(
  (r, [n, i]) => ({
    ...r,
    [n]: ju(t[n]) ? Xl(t[n], i) : i
  }),
  {}
), Vl = (t) => {
  if (!t) return [];
  const e = (r, n) => ju(r) ? Object.entries(r).flatMap(
    ([i, o]) => e(o, [...n, i])
  ) : qn(r) ? r.flatMap((i, o) => e(i, [...n, `${o}`])) : [n.join(".")];
  return e(t, []);
}, H1 = (t) => t ? ql(
  Vl(t),
  (e) => e,
  (e) => Yl(t, e)
) : {}, K1 = (t) => t ? Object.keys(t).reduce((e, r) => Zl(e, r, t[r]), {}) : {}, ku = (t, e) => Math.floor(Math.random() * (e - t + 1) + t), Y1 = (t) => {
  const e = t.length;
  if (e === 0)
    return null;
  const r = ku(0, e - 1);
  return t[r];
}, Z1 = (t) => t.map((e) => ({ rand: Math.random(), value: e })).sort((e, r) => e.rand - r.rand).map((e) => e.value), X1 = (t, e = "") => {
  const r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + e;
  return Gl(
    t,
    (n) => n + r.charAt(ku(0, r.length - 1)),
    ""
  );
}, V1 = (t, e = (r) => `${r}`) => {
  const { indexesByKey: r, itemsByIndex: n } = t.reduce(
    (l, p, d) => ({
      indexesByKey: {
        ...l.indexesByKey,
        [e(p)]: d
      },
      itemsByIndex: {
        ...l.itemsByIndex,
        [d]: p
      }
    }),
    {
      indexesByKey: {},
      itemsByIndex: {}
    }
  ), i = (l, p) => r[e(l)] < r[e(p)] ? l : p, o = (l, p) => r[e(l)] > r[e(p)] ? l : p, s = () => n[0], u = () => n[t.length - 1], a = (l, p) => n[r[e(l)] + 1] ?? p ?? s(), f = (l, p) => n[r[e(l)] - 1] ?? p ?? u();
  return {
    min: i,
    max: o,
    first: s,
    last: u,
    next: a,
    previous: f,
    spin: (l, p) => {
      if (p === 0) return l;
      const d = Math.abs(p), _ = d > t.length ? d % t.length : d;
      return Uu(0, _ - 1).reduce(
        (g) => p > 0 ? a(g) : f(g),
        l
      );
    }
  };
}, hi = (t) => {
  if (!t || t.length === 0) return "";
  const e = t.toLowerCase();
  return e.substring(0, 1).toUpperCase() + e.substring(1, e.length);
}, J1 = (t) => {
  const e = t?.replace(/([A-Z])+/g, hi)?.split(/(?=[A-Z])|[\.\-\s_]/).map((r) => r.toLowerCase()) ?? [];
  return e.length === 0 ? "" : e.length === 1 ? e[0] : e.reduce((r, n) => `${r}${n.charAt(0).toUpperCase()}${n.slice(1)}`);
}, Q1 = (t, e) => {
  const r = t?.replace(/([A-Z])+/g, hi).split(/(?=[A-Z])|[\.\-\s_]/).map((i) => i.toLowerCase()) ?? [];
  if (r.length === 0) return "";
  if (r.length === 1) return r[0];
  const n = r.reduce((i, o) => `${i}_${o.toLowerCase()}`);
  return e?.splitOnNumber === !1 ? n : n.replace(/([A-Za-z]{1}[0-9]{1})/, (i) => `${i[0]}_${i[1]}`);
}, tm = (t) => {
  const e = t?.replace(/([A-Z])+/g, hi)?.split(/(?=[A-Z])|[\.\-\s_]/).map((r) => r.toLowerCase()) ?? [];
  return e.length === 0 ? "" : e.length === 1 ? e[0] : e.reduce((r, n) => `${r}-${n.toLowerCase()}`);
}, em = (t) => {
  const e = t?.split(/[\.\-\s_]/).map((r) => r.toLowerCase()) ?? [];
  return e.length === 0 ? "" : e.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join("");
}, rm = (t) => t ? t.split(/(?=[A-Z])|[\.\-\s_]/).map((e) => e.trim()).filter((e) => !!e).map((e) => hi(e.toLowerCase())).join(" ") : "", nm = (t, e, r = /\{\{(.+?)\}\}/g) => Array.from(t.matchAll(r)).reduce((n, i) => n.replace(i[0], e[i[1]]), t), im = (t, e = " ") => {
  if (!t) return "";
  const r = e.replace(/[\W]{1}/g, "\\$&"), n = new RegExp(`^[${r}]+|[${r}]+$`, "g");
  return t.replace(n, "");
}, p3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  all: A1,
  alphabetical: r1,
  assign: Xl,
  boil: Wu,
  callable: C1,
  camel: J1,
  capitalize: hi,
  chain: O1,
  clone: Kl,
  cluster: a1,
  compose: E1,
  construct: K1,
  counting: n1,
  crush: H1,
  dash: tm,
  debounce: P1,
  defer: b1,
  diff: g1,
  draw: Y1,
  first: t1,
  flat: c1,
  fork: Ul,
  get: Yl,
  group: Xy,
  guard: x1,
  inRange: F1,
  intersects: l1,
  invert: j1,
  isArray: qn,
  isDate: Dl,
  isEmpty: Zy,
  isEqual: jl,
  isFloat: Yy,
  isFunction: li,
  isInt: Ky,
  isNumber: Cr,
  isObject: ju,
  isPrimitive: zl,
  isPromise: Bl,
  isString: Hy,
  isSymbol: Nl,
  iterate: Gl,
  keys: Vl,
  last: e1,
  list: Uu,
  listify: U1,
  lowerize: W1,
  map: m1,
  mapEntries: B1,
  mapKeys: Gu,
  mapValues: D1,
  max: s1,
  memo: I1,
  merge: h1,
  min: u1,
  objectify: ql,
  omit: k1,
  parallel: w1,
  partial: R1,
  partob: $1,
  pascal: em,
  pick: G1,
  proxied: T1,
  random: ku,
  range: qu,
  reduce: y1,
  replace: i1,
  replaceOrAppend: p1,
  retry: S1,
  select: o1,
  series: V1,
  set: Zl,
  shake: z1,
  shift: v1,
  shuffle: Z1,
  sift: _1,
  sleep: eu,
  snake: Q1,
  sort: Wl,
  sum: Qy,
  template: nm,
  throttle: L1,
  title: rm,
  toFloat: N1,
  toInt: Hl,
  toggle: d1,
  trim: im,
  try: Wr,
  tryit: Wr,
  uid: X1,
  unique: f1,
  upperize: q1,
  zip: Vy,
  zipToObject: Jy
}, Symbol.toStringTag, { value: "Module" }));
var Jl = typeof global == "object" && global && global.Object === Object && global, om = typeof self == "object" && self && self.Object === Object && self, lt = Jl || om || Function("return this")(), vt = lt.Symbol, Ql = Object.prototype, sm = Ql.hasOwnProperty, um = Ql.toString, Sn = vt ? vt.toStringTag : void 0;
function am(t) {
  var e = sm.call(t, Sn), r = t[Sn];
  try {
    t[Sn] = void 0;
    var n = !0;
  } catch {
  }
  var i = um.call(t);
  return n && (e ? t[Sn] = r : delete t[Sn]), i;
}
var fm = Object.prototype, cm = fm.toString;
function lm(t) {
  return cm.call(t);
}
var hm = "[object Null]", pm = "[object Undefined]", Kf = vt ? vt.toStringTag : void 0;
function $t(t) {
  return t == null ? t === void 0 ? pm : hm : Kf && Kf in Object(t) ? am(t) : lm(t);
}
function Q(t) {
  return t != null && typeof t == "object";
}
var dm = "[object Symbol]";
function Ft(t) {
  return typeof t == "symbol" || Q(t) && $t(t) == dm;
}
var _m = NaN;
function Yf(t) {
  return typeof t == "number" ? t : Ft(t) ? _m : +t;
}
function V(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length, i = Array(n); ++r < n; )
    i[r] = e(t[r], r, t);
  return i;
}
var $ = Array.isArray, Zf = vt ? vt.prototype : void 0, Xf = Zf ? Zf.toString : void 0;
function Ut(t) {
  if (typeof t == "string")
    return t;
  if ($(t))
    return V(t, Ut) + "";
  if (Ft(t))
    return Xf ? Xf.call(t) : "";
  var e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
function Lo(t, e) {
  return function(r, n) {
    var i;
    if (r === void 0 && n === void 0)
      return e;
    if (r !== void 0 && (i = r), n !== void 0) {
      if (i === void 0)
        return n;
      typeof r == "string" || typeof n == "string" ? (r = Ut(r), n = Ut(n)) : (r = Yf(r), n = Yf(n)), i = t(r, n);
    }
    return i;
  };
}
var th = Lo(function(t, e) {
  return t + e;
}, 0), gm = /\s/;
function eh(t) {
  for (var e = t.length; e-- && gm.test(t.charAt(e)); )
    ;
  return e;
}
var vm = /^\s+/;
function rh(t) {
  return t && t.slice(0, eh(t) + 1).replace(vm, "");
}
function J(t) {
  var e = typeof t;
  return t != null && (e == "object" || e == "function");
}
var Vf = NaN, ym = /^[-+]0x[0-9a-f]+$/i, mm = /^0b[01]+$/i, bm = /^0o[0-7]+$/i, wm = parseInt;
function Wt(t) {
  if (typeof t == "number")
    return t;
  if (Ft(t))
    return Vf;
  if (J(t)) {
    var e = typeof t.valueOf == "function" ? t.valueOf() : t;
    t = J(e) ? e + "" : e;
  }
  if (typeof t != "string")
    return t === 0 ? t : +t;
  t = rh(t);
  var r = mm.test(t);
  return r || bm.test(t) ? wm(t.slice(2), r ? 2 : 8) : ym.test(t) ? Vf : +t;
}
var Jf = 1 / 0, Am = 17976931348623157e292;
function ye(t) {
  if (!t)
    return t === 0 ? t : 0;
  if (t = Wt(t), t === Jf || t === -Jf) {
    var e = t < 0 ? -1 : 1;
    return e * Am;
  }
  return t === t ? t : 0;
}
function T(t) {
  var e = ye(t), r = e % 1;
  return e === e ? r ? e - r : e : 0;
}
var Sm = "Expected a function";
function nh(t, e) {
  if (typeof e != "function")
    throw new TypeError(Sm);
  return t = T(t), function() {
    if (--t < 1)
      return e.apply(this, arguments);
  };
}
function Tt(t) {
  return t;
}
var xm = "[object AsyncFunction]", Om = "[object Function]", Em = "[object GeneratorFunction]", Rm = "[object Proxy]";
function we(t) {
  if (!J(t))
    return !1;
  var e = $t(t);
  return e == Om || e == Em || e == xm || e == Rm;
}
var io = lt["__core-js_shared__"], Qf = function() {
  var t = /[^.]+$/.exec(io && io.keys && io.keys.IE_PROTO || "");
  return t ? "Symbol(src)_1." + t : "";
}();
function $m(t) {
  return !!Qf && Qf in t;
}
var Tm = Function.prototype, Mm = Tm.toString;
function mr(t) {
  if (t != null) {
    try {
      return Mm.call(t);
    } catch {
    }
    try {
      return t + "";
    } catch {
    }
  }
  return "";
}
var Im = /[\\^$.*+?()[\]{}|]/g, Pm = /^\[object .+?Constructor\]$/, Lm = Function.prototype, Cm = Object.prototype, Fm = Lm.toString, Nm = Cm.hasOwnProperty, zm = RegExp(
  "^" + Fm.call(Nm).replace(Im, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function ih(t) {
  if (!J(t) || $m(t))
    return !1;
  var e = we(t) ? zm : Pm;
  return e.test(mr(t));
}
function Dm(t, e) {
  return t?.[e];
}
function br(t, e) {
  var r = Dm(t, e);
  return ih(r) ? r : void 0;
}
var Un = br(lt, "WeakMap"), co = Un && new Un(), oh = co ? function(t, e) {
  return co.set(t, e), t;
} : Tt, tc = Object.create, en = /* @__PURE__ */ function() {
  function t() {
  }
  return function(e) {
    if (!J(e))
      return {};
    if (tc)
      return tc(e);
    t.prototype = e;
    var r = new t();
    return t.prototype = void 0, r;
  };
}();
function Gn(t) {
  return function() {
    var e = arguments;
    switch (e.length) {
      case 0:
        return new t();
      case 1:
        return new t(e[0]);
      case 2:
        return new t(e[0], e[1]);
      case 3:
        return new t(e[0], e[1], e[2]);
      case 4:
        return new t(e[0], e[1], e[2], e[3]);
      case 5:
        return new t(e[0], e[1], e[2], e[3], e[4]);
      case 6:
        return new t(e[0], e[1], e[2], e[3], e[4], e[5]);
      case 7:
        return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6]);
    }
    var r = en(t.prototype), n = t.apply(r, e);
    return J(n) ? n : r;
  };
}
var Bm = 1;
function jm(t, e, r) {
  var n = e & Bm, i = Gn(t);
  function o() {
    var s = this && this !== lt && this instanceof o ? i : t;
    return s.apply(n ? r : this, arguments);
  }
  return o;
}
function Gt(t, e, r) {
  switch (r.length) {
    case 0:
      return t.call(e);
    case 1:
      return t.call(e, r[0]);
    case 2:
      return t.call(e, r[0], r[1]);
    case 3:
      return t.call(e, r[0], r[1], r[2]);
  }
  return t.apply(e, r);
}
var Wm = Math.max;
function sh(t, e, r, n) {
  for (var i = -1, o = t.length, s = r.length, u = -1, a = e.length, f = Wm(o - s, 0), c = Array(a + f), l = !n; ++u < a; )
    c[u] = e[u];
  for (; ++i < s; )
    (l || i < o) && (c[r[i]] = t[i]);
  for (; f--; )
    c[u++] = t[i++];
  return c;
}
var qm = Math.max;
function uh(t, e, r, n) {
  for (var i = -1, o = t.length, s = -1, u = r.length, a = -1, f = e.length, c = qm(o - u, 0), l = Array(c + f), p = !n; ++i < c; )
    l[i] = t[i];
  for (var d = i; ++a < f; )
    l[d + a] = e[a];
  for (; ++s < u; )
    (p || i < o) && (l[d + r[s]] = t[i++]);
  return l;
}
function Um(t, e) {
  for (var r = t.length, n = 0; r--; )
    t[r] === e && ++n;
  return n;
}
function Co() {
}
var Gm = 4294967295;
function P(t) {
  this.__wrapped__ = t, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = Gm, this.__views__ = [];
}
P.prototype = en(Co.prototype);
P.prototype.constructor = P;
function Fo() {
}
var Hu = co ? function(t) {
  return co.get(t);
} : Fo, Fr = {}, km = Object.prototype, Hm = km.hasOwnProperty;
function oo(t) {
  for (var e = t.name + "", r = Fr[e], n = Hm.call(Fr, e) ? r.length : 0; n--; ) {
    var i = r[n], o = i.func;
    if (o == null || o == t)
      return i.name;
  }
  return e;
}
function ee(t, e) {
  this.__wrapped__ = t, this.__actions__ = [], this.__chain__ = !!e, this.__index__ = 0, this.__values__ = void 0;
}
ee.prototype = en(Co.prototype);
ee.prototype.constructor = ee;
function Ct(t, e) {
  var r = -1, n = t.length;
  for (e || (e = Array(n)); ++r < n; )
    e[r] = t[r];
  return e;
}
function ah(t) {
  if (t instanceof P)
    return t.clone();
  var e = new ee(t.__wrapped__, t.__chain__);
  return e.__actions__ = Ct(t.__actions__), e.__index__ = t.__index__, e.__values__ = t.__values__, e;
}
var Km = Object.prototype, Ym = Km.hasOwnProperty;
function h(t) {
  if (Q(t) && !$(t) && !(t instanceof P)) {
    if (t instanceof ee)
      return t;
    if (Ym.call(t, "__wrapped__"))
      return ah(t);
  }
  return new ee(t);
}
h.prototype = Co.prototype;
h.prototype.constructor = h;
function ru(t) {
  var e = oo(t), r = h[e];
  if (typeof r != "function" || !(e in P.prototype))
    return !1;
  if (t === r)
    return !0;
  var n = Hu(r);
  return !!n && t === n[0];
}
var Zm = 800, Xm = 16, Vm = Date.now;
function fh(t) {
  var e = 0, r = 0;
  return function() {
    var n = Vm(), i = Xm - (n - r);
    if (r = n, i > 0) {
      if (++e >= Zm)
        return arguments[0];
    } else
      e = 0;
    return t.apply(void 0, arguments);
  };
}
var ch = fh(oh), Jm = /\{\n\/\* \[wrapped with (.+)\] \*/, Qm = /,? & /;
function tb(t) {
  var e = t.match(Jm);
  return e ? e[1].split(Qm) : [];
}
var eb = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function rb(t, e) {
  var r = e.length;
  if (!r)
    return t;
  var n = r - 1;
  return e[n] = (r > 1 ? "& " : "") + e[n], e = e.join(r > 2 ? ", " : " "), t.replace(eb, `{
/* [wrapped with ` + e + `] */
`);
}
function No(t) {
  return function() {
    return t;
  };
}
var lo = function() {
  try {
    var t = br(Object, "defineProperty");
    return t({}, "", {}), t;
  } catch {
  }
}(), nb = lo ? function(t, e) {
  return lo(t, "toString", {
    configurable: !0,
    enumerable: !1,
    value: No(e),
    writable: !0
  });
} : Tt, Ku = fh(nb);
function ie(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length; ++r < n && e(t[r], r, t) !== !1; )
    ;
  return t;
}
function zo(t, e, r, n) {
  for (var i = t.length, o = r + (n ? 1 : -1); n ? o-- : ++o < i; )
    if (e(t[o], o, t))
      return o;
  return -1;
}
function lh(t) {
  return t !== t;
}
function ib(t, e, r) {
  for (var n = r - 1, i = t.length; ++n < i; )
    if (t[n] === e)
      return n;
  return -1;
}
function rn(t, e, r) {
  return e === e ? ib(t, e, r) : zo(t, lh, r);
}
function Do(t, e) {
  var r = t == null ? 0 : t.length;
  return !!r && rn(t, e, 0) > -1;
}
var ob = 1, sb = 2, ub = 8, ab = 16, fb = 32, cb = 64, lb = 128, hb = 256, pb = 512, db = [
  ["ary", lb],
  ["bind", ob],
  ["bindKey", sb],
  ["curry", ub],
  ["curryRight", ab],
  ["flip", pb],
  ["partial", fb],
  ["partialRight", cb],
  ["rearg", hb]
];
function _b(t, e) {
  return ie(db, function(r) {
    var n = "_." + r[0];
    e & r[1] && !Do(t, n) && t.push(n);
  }), t.sort();
}
function hh(t, e, r) {
  var n = e + "";
  return Ku(t, rb(n, _b(tb(n), r)));
}
var gb = 4, vb = 8, ec = 32, rc = 64;
function ph(t, e, r, n, i, o, s, u, a, f) {
  var c = e & vb, l = c ? s : void 0, p = c ? void 0 : s, d = c ? o : void 0, _ = c ? void 0 : o;
  e |= c ? ec : rc, e &= ~(c ? rc : ec), e & gb || (e &= -4);
  var g = [
    t,
    e,
    i,
    d,
    l,
    _,
    p,
    u,
    a,
    f
  ], v = r.apply(void 0, g);
  return ru(t) && ch(v, g), v.placeholder = n, hh(v, t, e);
}
function nn(t) {
  var e = t;
  return e.placeholder;
}
var yb = 9007199254740991, mb = /^(?:0|[1-9]\d*)$/;
function Be(t, e) {
  var r = typeof t;
  return e = e ?? yb, !!e && (r == "number" || r != "symbol" && mb.test(t)) && t > -1 && t % 1 == 0 && t < e;
}
var bb = Math.min;
function wb(t, e) {
  for (var r = t.length, n = bb(e.length, r), i = Ct(t); n--; ) {
    var o = e[n];
    t[n] = Be(o, r) ? i[o] : void 0;
  }
  return t;
}
var nc = "__lodash_placeholder__";
function Xe(t, e) {
  for (var r = -1, n = t.length, i = 0, o = []; ++r < n; ) {
    var s = t[r];
    (s === e || s === nc) && (t[r] = nc, o[i++] = r);
  }
  return o;
}
var Ab = 1, Sb = 2, xb = 8, Ob = 16, Eb = 128, Rb = 512;
function Bo(t, e, r, n, i, o, s, u, a, f) {
  var c = e & Eb, l = e & Ab, p = e & Sb, d = e & (xb | Ob), _ = e & Rb, g = p ? void 0 : Gn(t);
  function v() {
    for (var y = arguments.length, m = Array(y), w = y; w--; )
      m[w] = arguments[w];
    if (d)
      var b = nn(v), A = Um(m, b);
    if (n && (m = sh(m, n, i, d)), o && (m = uh(m, o, s, d)), y -= A, d && y < f) {
      var x = Xe(m, b);
      return ph(
        t,
        e,
        Bo,
        v.placeholder,
        r,
        m,
        x,
        u,
        a,
        f - y
      );
    }
    var M = l ? r : this, nt = p ? M[t] : t;
    return y = m.length, u ? m = wb(m, u) : _ && y > 1 && m.reverse(), c && a < y && (m.length = a), this && this !== lt && this instanceof v && (nt = g || Gn(nt)), nt.apply(M, m);
  }
  return v;
}
function $b(t, e, r) {
  var n = Gn(t);
  function i() {
    for (var o = arguments.length, s = Array(o), u = o, a = nn(i); u--; )
      s[u] = arguments[u];
    var f = o < 3 && s[0] !== a && s[o - 1] !== a ? [] : Xe(s, a);
    if (o -= f.length, o < r)
      return ph(
        t,
        e,
        Bo,
        i.placeholder,
        void 0,
        s,
        f,
        void 0,
        void 0,
        r - o
      );
    var c = this && this !== lt && this instanceof i ? n : t;
    return Gt(c, this, s);
  }
  return i;
}
var Tb = 1;
function Mb(t, e, r, n) {
  var i = e & Tb, o = Gn(t);
  function s() {
    for (var u = -1, a = arguments.length, f = -1, c = n.length, l = Array(c + a), p = this && this !== lt && this instanceof s ? o : t; ++f < c; )
      l[f] = n[f];
    for (; a--; )
      l[f++] = arguments[++u];
    return Gt(p, i ? r : this, l);
  }
  return s;
}
var ic = "__lodash_placeholder__", Fs = 1, Ib = 2, Pb = 4, oc = 8, xn = 128, sc = 256, Lb = Math.min;
function Cb(t, e) {
  var r = t[1], n = e[1], i = r | n, o = i < (Fs | Ib | xn), s = n == xn && r == oc || n == xn && r == sc && t[7].length <= e[8] || n == (xn | sc) && e[7].length <= e[8] && r == oc;
  if (!(o || s))
    return t;
  n & Fs && (t[2] = e[2], i |= r & Fs ? 0 : Pb);
  var u = e[3];
  if (u) {
    var a = t[3];
    t[3] = a ? sh(a, u, e[4]) : u, t[4] = a ? Xe(t[3], ic) : e[4];
  }
  return u = e[5], u && (a = t[5], t[5] = a ? uh(a, u, e[6]) : u, t[6] = a ? Xe(t[5], ic) : e[6]), u = e[7], u && (t[7] = u), n & xn && (t[8] = t[8] == null ? e[8] : Lb(t[8], e[8])), t[9] == null && (t[9] = e[9]), t[0] = e[0], t[1] = i, t;
}
var Fb = "Expected a function", uc = 1, Nb = 2, ac = 8, fc = 16, cc = 32, zb = 64, lc = Math.max;
function je(t, e, r, n, i, o, s, u) {
  var a = e & Nb;
  if (!a && typeof t != "function")
    throw new TypeError(Fb);
  var f = n ? n.length : 0;
  if (f || (e &= -97, n = i = void 0), s = s === void 0 ? s : lc(T(s), 0), u = u === void 0 ? u : T(u), f -= i ? i.length : 0, e & zb) {
    var c = n, l = i;
    n = i = void 0;
  }
  var p = a ? void 0 : Hu(t), d = [
    t,
    e,
    r,
    n,
    i,
    c,
    l,
    o,
    s,
    u
  ];
  if (p && Cb(d, p), t = d[0], e = d[1], r = d[2], n = d[3], i = d[4], u = d[9] = d[9] === void 0 ? a ? 0 : t.length : lc(d[9] - f, 0), !u && e & (ac | fc) && (e &= -25), !e || e == uc)
    var _ = jm(t, e, r);
  else e == ac || e == fc ? _ = $b(t, e, u) : (e == cc || e == (uc | cc)) && !i.length ? _ = Mb(t, e, r, n) : _ = Bo.apply(void 0, d);
  var g = p ? oh : ch;
  return hh(g(_, d), t, e);
}
var Db = 128;
function Yu(t, e, r) {
  return e = r ? void 0 : e, e = t && e == null ? t.length : e, je(t, Db, void 0, void 0, void 0, void 0, e);
}
function We(t, e, r) {
  e == "__proto__" && lo ? lo(t, e, {
    configurable: !0,
    enumerable: !0,
    value: r,
    writable: !0
  }) : t[e] = r;
}
function oe(t, e) {
  return t === e || t !== t && e !== e;
}
var Bb = Object.prototype, jb = Bb.hasOwnProperty;
function pi(t, e, r) {
  var n = t[e];
  (!(jb.call(t, e) && oe(n, r)) || r === void 0 && !(e in t)) && We(t, e, r);
}
function Ae(t, e, r, n) {
  var i = !r;
  r || (r = {});
  for (var o = -1, s = e.length; ++o < s; ) {
    var u = e[o], a = n ? n(r[u], t[u], u, r, t) : void 0;
    a === void 0 && (a = t[u]), i ? We(r, u, a) : pi(r, u, a);
  }
  return r;
}
var hc = Math.max;
function dh(t, e, r) {
  return e = hc(e === void 0 ? t.length - 1 : e, 0), function() {
    for (var n = arguments, i = -1, o = hc(n.length - e, 0), s = Array(o); ++i < o; )
      s[i] = n[e + i];
    i = -1;
    for (var u = Array(e + 1); ++i < e; )
      u[i] = n[i];
    return u[e] = r(s), Gt(t, this, u);
  };
}
function I(t, e) {
  return Ku(dh(t, e, Tt), t + "");
}
var Wb = 9007199254740991;
function di(t) {
  return typeof t == "number" && t > -1 && t % 1 == 0 && t <= Wb;
}
function Mt(t) {
  return t != null && di(t.length) && !we(t);
}
function Et(t, e, r) {
  if (!J(r))
    return !1;
  var n = typeof e;
  return (n == "number" ? Mt(r) && Be(e, r.length) : n == "string" && e in r) ? oe(r[e], t) : !1;
}
function on(t) {
  return I(function(e, r) {
    var n = -1, i = r.length, o = i > 1 ? r[i - 1] : void 0, s = i > 2 ? r[2] : void 0;
    for (o = t.length > 3 && typeof o == "function" ? (i--, o) : void 0, s && Et(r[0], r[1], s) && (o = i < 3 ? void 0 : o, i = 1), e = Object(e); ++n < i; ) {
      var u = r[n];
      u && t(e, u, n, o);
    }
    return e;
  });
}
var qb = Object.prototype;
function _i(t) {
  var e = t && t.constructor, r = typeof e == "function" && e.prototype || qb;
  return t === r;
}
function Zu(t, e) {
  for (var r = -1, n = Array(t); ++r < t; )
    n[r] = e(r);
  return n;
}
var Ub = "[object Arguments]";
function pc(t) {
  return Q(t) && $t(t) == Ub;
}
var _h = Object.prototype, Gb = _h.hasOwnProperty, kb = _h.propertyIsEnumerable, Ve = pc(/* @__PURE__ */ function() {
  return arguments;
}()) ? pc : function(t) {
  return Q(t) && Gb.call(t, "callee") && !kb.call(t, "callee");
};
function jo() {
  return !1;
}
var gh = typeof exports == "object" && exports && !exports.nodeType && exports, dc = gh && typeof module == "object" && module && !module.nodeType && module, Hb = dc && dc.exports === gh, _c = Hb ? lt.Buffer : void 0, Kb = _c ? _c.isBuffer : void 0, Ne = Kb || jo, Yb = "[object Arguments]", Zb = "[object Array]", Xb = "[object Boolean]", Vb = "[object Date]", Jb = "[object Error]", Qb = "[object Function]", tw = "[object Map]", ew = "[object Number]", rw = "[object Object]", nw = "[object RegExp]", iw = "[object Set]", ow = "[object String]", sw = "[object WeakMap]", uw = "[object ArrayBuffer]", aw = "[object DataView]", fw = "[object Float32Array]", cw = "[object Float64Array]", lw = "[object Int8Array]", hw = "[object Int16Array]", pw = "[object Int32Array]", dw = "[object Uint8Array]", _w = "[object Uint8ClampedArray]", gw = "[object Uint16Array]", vw = "[object Uint32Array]", Y = {};
Y[fw] = Y[cw] = Y[lw] = Y[hw] = Y[pw] = Y[dw] = Y[_w] = Y[gw] = Y[vw] = !0;
Y[Yb] = Y[Zb] = Y[uw] = Y[Xb] = Y[aw] = Y[Vb] = Y[Jb] = Y[Qb] = Y[tw] = Y[ew] = Y[rw] = Y[nw] = Y[iw] = Y[ow] = Y[sw] = !1;
function yw(t) {
  return Q(t) && di(t.length) && !!Y[$t(t)];
}
function kt(t) {
  return function(e) {
    return t(e);
  };
}
var vh = typeof exports == "object" && exports && !exports.nodeType && exports, In = vh && typeof module == "object" && module && !module.nodeType && module, mw = In && In.exports === vh, Ns = mw && Jl.process, re = function() {
  try {
    var t = In && In.require && In.require("util").types;
    return t || Ns && Ns.binding && Ns.binding("util");
  } catch {
  }
}(), gc = re && re.isTypedArray, wr = gc ? kt(gc) : yw, bw = Object.prototype, ww = bw.hasOwnProperty;
function yh(t, e) {
  var r = $(t), n = !r && Ve(t), i = !r && !n && Ne(t), o = !r && !n && !i && wr(t), s = r || n || i || o, u = s ? Zu(t.length, String) : [], a = u.length;
  for (var f in t)
    (e || ww.call(t, f)) && !(s && // Safari 9 has enumerable `arguments.length` in strict mode.
    (f == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    i && (f == "offset" || f == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    o && (f == "buffer" || f == "byteLength" || f == "byteOffset") || // Skip index properties.
    Be(f, a))) && u.push(f);
  return u;
}
function mh(t, e) {
  return function(r) {
    return t(e(r));
  };
}
var Aw = mh(Object.keys, Object), Sw = Object.prototype, xw = Sw.hasOwnProperty;
function Xu(t) {
  if (!_i(t))
    return Aw(t);
  var e = [];
  for (var r in Object(t))
    xw.call(t, r) && r != "constructor" && e.push(r);
  return e;
}
function ot(t) {
  return Mt(t) ? yh(t) : Xu(t);
}
var Ow = Object.prototype, Ew = Ow.hasOwnProperty, bh = on(function(t, e) {
  if (_i(e) || Mt(e)) {
    Ae(e, ot(e), t);
    return;
  }
  for (var r in e)
    Ew.call(e, r) && pi(t, r, e[r]);
});
function Rw(t) {
  var e = [];
  if (t != null)
    for (var r in Object(t))
      e.push(r);
  return e;
}
var $w = Object.prototype, Tw = $w.hasOwnProperty;
function Mw(t) {
  if (!J(t))
    return Rw(t);
  var e = _i(t), r = [];
  for (var n in t)
    n == "constructor" && (e || !Tw.call(t, n)) || r.push(n);
  return r;
}
function It(t) {
  return Mt(t) ? yh(t, !0) : Mw(t);
}
var nu = on(function(t, e) {
  Ae(e, It(e), t);
}), kn = on(function(t, e, r, n) {
  Ae(e, It(e), t, n);
}), wh = on(function(t, e, r, n) {
  Ae(e, ot(e), t, n);
}), Iw = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Pw = /^\w*$/;
function Vu(t, e) {
  if ($(t))
    return !1;
  var r = typeof t;
  return r == "number" || r == "symbol" || r == "boolean" || t == null || Ft(t) ? !0 : Pw.test(t) || !Iw.test(t) || e != null && t in Object(e);
}
var Hn = br(Object, "create");
function Lw() {
  this.__data__ = Hn ? Hn(null) : {}, this.size = 0;
}
function Cw(t) {
  var e = this.has(t) && delete this.__data__[t];
  return this.size -= e ? 1 : 0, e;
}
var Fw = "__lodash_hash_undefined__", Nw = Object.prototype, zw = Nw.hasOwnProperty;
function Dw(t) {
  var e = this.__data__;
  if (Hn) {
    var r = e[t];
    return r === Fw ? void 0 : r;
  }
  return zw.call(e, t) ? e[t] : void 0;
}
var Bw = Object.prototype, jw = Bw.hasOwnProperty;
function Ww(t) {
  var e = this.__data__;
  return Hn ? e[t] !== void 0 : jw.call(e, t);
}
var qw = "__lodash_hash_undefined__";
function Uw(t, e) {
  var r = this.__data__;
  return this.size += this.has(t) ? 0 : 1, r[t] = Hn && e === void 0 ? qw : e, this;
}
function dr(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
dr.prototype.clear = Lw;
dr.prototype.delete = Cw;
dr.prototype.get = Dw;
dr.prototype.has = Ww;
dr.prototype.set = Uw;
function Gw() {
  this.__data__ = [], this.size = 0;
}
function Wo(t, e) {
  for (var r = t.length; r--; )
    if (oe(t[r][0], e))
      return r;
  return -1;
}
var kw = Array.prototype, Hw = kw.splice;
function Kw(t) {
  var e = this.__data__, r = Wo(e, t);
  if (r < 0)
    return !1;
  var n = e.length - 1;
  return r == n ? e.pop() : Hw.call(e, r, 1), --this.size, !0;
}
function Yw(t) {
  var e = this.__data__, r = Wo(e, t);
  return r < 0 ? void 0 : e[r][1];
}
function Zw(t) {
  return Wo(this.__data__, t) > -1;
}
function Xw(t, e) {
  var r = this.__data__, n = Wo(r, t);
  return n < 0 ? (++this.size, r.push([t, e])) : r[n][1] = e, this;
}
function qe(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
qe.prototype.clear = Gw;
qe.prototype.delete = Kw;
qe.prototype.get = Yw;
qe.prototype.has = Zw;
qe.prototype.set = Xw;
var Kn = br(lt, "Map");
function Vw() {
  this.size = 0, this.__data__ = {
    hash: new dr(),
    map: new (Kn || qe)(),
    string: new dr()
  };
}
function Jw(t) {
  var e = typeof t;
  return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? t !== "__proto__" : t === null;
}
function qo(t, e) {
  var r = t.__data__;
  return Jw(e) ? r[typeof e == "string" ? "string" : "hash"] : r.map;
}
function Qw(t) {
  var e = qo(this, t).delete(t);
  return this.size -= e ? 1 : 0, e;
}
function tA(t) {
  return qo(this, t).get(t);
}
function eA(t) {
  return qo(this, t).has(t);
}
function rA(t, e) {
  var r = qo(this, t), n = r.size;
  return r.set(t, e), this.size += r.size == n ? 0 : 1, this;
}
function Ue(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.clear(); ++e < r; ) {
    var n = t[e];
    this.set(n[0], n[1]);
  }
}
Ue.prototype.clear = Vw;
Ue.prototype.delete = Qw;
Ue.prototype.get = tA;
Ue.prototype.has = eA;
Ue.prototype.set = rA;
var nA = "Expected a function";
function gi(t, e) {
  if (typeof t != "function" || e != null && typeof e != "function")
    throw new TypeError(nA);
  var r = function() {
    var n = arguments, i = e ? e.apply(this, n) : n[0], o = r.cache;
    if (o.has(i))
      return o.get(i);
    var s = t.apply(this, n);
    return r.cache = o.set(i, s) || o, s;
  };
  return r.cache = new (gi.Cache || Ue)(), r;
}
gi.Cache = Ue;
var iA = 500;
function oA(t) {
  var e = gi(t, function(n) {
    return r.size === iA && r.clear(), n;
  }), r = e.cache;
  return e;
}
var sA = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, uA = /\\(\\)?/g, Ah = oA(function(t) {
  var e = [];
  return t.charCodeAt(0) === 46 && e.push(""), t.replace(sA, function(r, n, i, o) {
    e.push(i ? o.replace(uA, "$1") : n || r);
  }), e;
});
function D(t) {
  return t == null ? "" : Ut(t);
}
function nr(t, e) {
  return $(t) ? t : Vu(t, e) ? [t] : Ah(D(t));
}
function Se(t) {
  if (typeof t == "string" || Ft(t))
    return t;
  var e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
function Ar(t, e) {
  e = nr(e, t);
  for (var r = 0, n = e.length; t != null && r < n; )
    t = t[Se(e[r++])];
  return r && r == n ? t : void 0;
}
function Uo(t, e, r) {
  var n = t == null ? void 0 : Ar(t, e);
  return n === void 0 ? r : n;
}
function Ju(t, e) {
  for (var r = -1, n = e.length, i = Array(n), o = t == null; ++r < n; )
    i[r] = o ? void 0 : Uo(t, e[r]);
  return i;
}
function ir(t, e) {
  for (var r = -1, n = e.length, i = t.length; ++r < n; )
    t[i + r] = e[r];
  return t;
}
var vc = vt ? vt.isConcatSpreadable : void 0;
function aA(t) {
  return $(t) || Ve(t) || !!(vc && t && t[vc]);
}
function dt(t, e, r, n, i) {
  var o = -1, s = t.length;
  for (r || (r = aA), i || (i = []); ++o < s; ) {
    var u = t[o];
    e > 0 && r(u) ? e > 1 ? dt(u, e - 1, r, n, i) : ir(i, u) : n || (i[i.length] = u);
  }
  return i;
}
function Qu(t) {
  var e = t == null ? 0 : t.length;
  return e ? dt(t, 1) : [];
}
function Ge(t) {
  return Ku(dh(t, void 0, Qu), t + "");
}
var Sh = Ge(Ju), Go = mh(Object.getPrototypeOf, Object), fA = "[object Object]", cA = Function.prototype, lA = Object.prototype, xh = cA.toString, hA = lA.hasOwnProperty, pA = xh.call(Object);
function sn(t) {
  if (!Q(t) || $t(t) != fA)
    return !1;
  var e = Go(t);
  if (e === null)
    return !0;
  var r = hA.call(e, "constructor") && e.constructor;
  return typeof r == "function" && r instanceof r && xh.call(r) == pA;
}
var dA = "[object DOMException]", _A = "[object Error]";
function ko(t) {
  if (!Q(t))
    return !1;
  var e = $t(t);
  return e == _A || e == dA || typeof t.message == "string" && typeof t.name == "string" && !sn(t);
}
var ta = I(function(t, e) {
  try {
    return Gt(t, void 0, e);
  } catch (r) {
    return ko(r) ? r : new Error(r);
  }
}), gA = "Expected a function";
function ea(t, e) {
  var r;
  if (typeof e != "function")
    throw new TypeError(gA);
  return t = T(t), function() {
    return --t > 0 && (r = e.apply(this, arguments)), t <= 1 && (e = void 0), r;
  };
}
var vA = 1, yA = 32, vi = I(function(t, e, r) {
  var n = vA;
  if (r.length) {
    var i = Xe(r, nn(vi));
    n |= yA;
  }
  return je(t, n, e, r, i);
});
vi.placeholder = {};
var Oh = Ge(function(t, e) {
  return ie(e, function(r) {
    r = Se(r), We(t, r, vi(t[r], t));
  }), t;
}), mA = 1, bA = 2, wA = 32, Ho = I(function(t, e, r) {
  var n = mA | bA;
  if (r.length) {
    var i = Xe(r, nn(Ho));
    n |= wA;
  }
  return je(e, n, t, r, i);
});
Ho.placeholder = {};
function ne(t, e, r) {
  var n = -1, i = t.length;
  e < 0 && (e = -e > i ? 0 : i + e), r = r > i ? i : r, r < 0 && (r += i), i = e > r ? 0 : r - e >>> 0, e >>>= 0;
  for (var o = Array(i); ++n < i; )
    o[n] = t[n + e];
  return o;
}
function or(t, e, r) {
  var n = t.length;
  return r = r === void 0 ? n : r, !e && r >= n ? t : ne(t, e, r);
}
var AA = "\\ud800-\\udfff", SA = "\\u0300-\\u036f", xA = "\\ufe20-\\ufe2f", OA = "\\u20d0-\\u20ff", EA = SA + xA + OA, RA = "\\ufe0e\\ufe0f", $A = "\\u200d", TA = RegExp("[" + $A + AA + EA + RA + "]");
function un(t) {
  return TA.test(t);
}
function MA(t) {
  return t.split("");
}
var Eh = "\\ud800-\\udfff", IA = "\\u0300-\\u036f", PA = "\\ufe20-\\ufe2f", LA = "\\u20d0-\\u20ff", CA = IA + PA + LA, FA = "\\ufe0e\\ufe0f", NA = "[" + Eh + "]", iu = "[" + CA + "]", ou = "\\ud83c[\\udffb-\\udfff]", zA = "(?:" + iu + "|" + ou + ")", Rh = "[^" + Eh + "]", $h = "(?:\\ud83c[\\udde6-\\uddff]){2}", Th = "[\\ud800-\\udbff][\\udc00-\\udfff]", DA = "\\u200d", Mh = zA + "?", Ih = "[" + FA + "]?", BA = "(?:" + DA + "(?:" + [Rh, $h, Th].join("|") + ")" + Ih + Mh + ")*", jA = Ih + Mh + BA, WA = "(?:" + [Rh + iu + "?", iu, $h, Th, NA].join("|") + ")", qA = RegExp(ou + "(?=" + ou + ")|" + WA + jA, "g");
function UA(t) {
  return t.match(qA) || [];
}
function he(t) {
  return un(t) ? UA(t) : MA(t);
}
function Ph(t) {
  return function(e) {
    e = D(e);
    var r = un(e) ? he(e) : void 0, n = r ? r[0] : e.charAt(0), i = r ? or(r, 1).join("") : e.slice(1);
    return n[t]() + i;
  };
}
var Ko = Ph("toUpperCase");
function ra(t) {
  return Ko(D(t).toLowerCase());
}
function na(t, e, r, n) {
  var i = -1, o = t == null ? 0 : t.length;
  for (n && o && (r = t[++i]); ++i < o; )
    r = e(r, t[i], i, t);
  return r;
}
function ia(t) {
  return function(e) {
    return t?.[e];
  };
}
var GA = {
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
}, kA = ia(GA), HA = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, KA = "\\u0300-\\u036f", YA = "\\ufe20-\\ufe2f", ZA = "\\u20d0-\\u20ff", XA = KA + YA + ZA, VA = "[" + XA + "]", JA = RegExp(VA, "g");
function oa(t) {
  return t = D(t), t && t.replace(HA, kA).replace(JA, "");
}
var QA = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
function t2(t) {
  return t.match(QA) || [];
}
var e2 = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
function r2(t) {
  return e2.test(t);
}
var Lh = "\\ud800-\\udfff", n2 = "\\u0300-\\u036f", i2 = "\\ufe20-\\ufe2f", o2 = "\\u20d0-\\u20ff", s2 = n2 + i2 + o2, Ch = "\\u2700-\\u27bf", Fh = "a-z\\xdf-\\xf6\\xf8-\\xff", u2 = "\\xac\\xb1\\xd7\\xf7", a2 = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", f2 = "\\u2000-\\u206f", c2 = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", Nh = "A-Z\\xc0-\\xd6\\xd8-\\xde", l2 = "\\ufe0e\\ufe0f", zh = u2 + a2 + f2 + c2, Dh = "['’]", yc = "[" + zh + "]", h2 = "[" + s2 + "]", Bh = "\\d+", p2 = "[" + Ch + "]", jh = "[" + Fh + "]", Wh = "[^" + Lh + zh + Bh + Ch + Fh + Nh + "]", d2 = "\\ud83c[\\udffb-\\udfff]", _2 = "(?:" + h2 + "|" + d2 + ")", g2 = "[^" + Lh + "]", qh = "(?:\\ud83c[\\udde6-\\uddff]){2}", Uh = "[\\ud800-\\udbff][\\udc00-\\udfff]", Lr = "[" + Nh + "]", v2 = "\\u200d", mc = "(?:" + jh + "|" + Wh + ")", y2 = "(?:" + Lr + "|" + Wh + ")", bc = "(?:" + Dh + "(?:d|ll|m|re|s|t|ve))?", wc = "(?:" + Dh + "(?:D|LL|M|RE|S|T|VE))?", Gh = _2 + "?", kh = "[" + l2 + "]?", m2 = "(?:" + v2 + "(?:" + [g2, qh, Uh].join("|") + ")" + kh + Gh + ")*", b2 = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", w2 = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", A2 = kh + Gh + m2, S2 = "(?:" + [p2, qh, Uh].join("|") + ")" + A2, x2 = RegExp([
  Lr + "?" + jh + "+" + bc + "(?=" + [yc, Lr, "$"].join("|") + ")",
  y2 + "+" + wc + "(?=" + [yc, Lr + mc, "$"].join("|") + ")",
  Lr + "?" + mc + "+" + bc,
  Lr + "+" + wc,
  w2,
  b2,
  Bh,
  S2
].join("|"), "g");
function O2(t) {
  return t.match(x2) || [];
}
function sa(t, e, r) {
  return t = D(t), e = r ? void 0 : e, e === void 0 ? r2(t) ? O2(t) : t2(t) : t.match(e) || [];
}
var E2 = "['’]", R2 = RegExp(E2, "g");
function an(t) {
  return function(e) {
    return na(sa(oa(e).replace(R2, "")), t, "");
  };
}
var Hh = an(function(t, e, r) {
  return e = e.toLowerCase(), t + (r ? ra(e) : e);
});
function Kh() {
  if (!arguments.length)
    return [];
  var t = arguments[0];
  return $(t) ? t : [t];
}
var $2 = lt.isFinite, T2 = Math.min;
function ua(t) {
  var e = Math[t];
  return function(r, n) {
    if (r = Wt(r), n = n == null ? 0 : T2(T(n), 292), n && $2(r)) {
      var i = (D(r) + "e").split("e"), o = e(i[0] + "e" + (+i[1] + n));
      return i = (D(o) + "e").split("e"), +(i[0] + "e" + (+i[1] - n));
    }
    return e(r);
  };
}
var Yh = ua("ceil");
function aa(t) {
  var e = h(t);
  return e.__chain__ = !0, e;
}
var M2 = Math.ceil, I2 = Math.max;
function Zh(t, e, r) {
  (r ? Et(t, e, r) : e === void 0) ? e = 1 : e = I2(T(e), 0);
  var n = t == null ? 0 : t.length;
  if (!n || e < 1)
    return [];
  for (var i = 0, o = 0, s = Array(M2(n / e)); i < n; )
    s[o++] = ne(t, i, i += e);
  return s;
}
function Sr(t, e, r) {
  return t === t && (r !== void 0 && (t = t <= r ? t : r), e !== void 0 && (t = t >= e ? t : e)), t;
}
function Xh(t, e, r) {
  return r === void 0 && (r = e, e = void 0), r !== void 0 && (r = Wt(r), r = r === r ? r : 0), e !== void 0 && (e = Wt(e), e = e === e ? e : 0), Sr(Wt(t), e, r);
}
function P2() {
  this.__data__ = new qe(), this.size = 0;
}
function L2(t) {
  var e = this.__data__, r = e.delete(t);
  return this.size = e.size, r;
}
function C2(t) {
  return this.__data__.get(t);
}
function F2(t) {
  return this.__data__.has(t);
}
var N2 = 200;
function z2(t, e) {
  var r = this.__data__;
  if (r instanceof qe) {
    var n = r.__data__;
    if (!Kn || n.length < N2 - 1)
      return n.push([t, e]), this.size = ++r.size, this;
    r = this.__data__ = new Ue(n);
  }
  return r.set(t, e), this.size = r.size, this;
}
function ce(t) {
  var e = this.__data__ = new qe(t);
  this.size = e.size;
}
ce.prototype.clear = P2;
ce.prototype.delete = L2;
ce.prototype.get = C2;
ce.prototype.has = F2;
ce.prototype.set = z2;
function Vh(t, e) {
  return t && Ae(e, ot(e), t);
}
function D2(t, e) {
  return t && Ae(e, It(e), t);
}
var Jh = typeof exports == "object" && exports && !exports.nodeType && exports, Ac = Jh && typeof module == "object" && module && !module.nodeType && module, B2 = Ac && Ac.exports === Jh, Sc = B2 ? lt.Buffer : void 0, xc = Sc ? Sc.allocUnsafe : void 0;
function Qh(t, e) {
  if (e)
    return t.slice();
  var r = t.length, n = xc ? xc(r) : new t.constructor(r);
  return t.copy(n), n;
}
function sr(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length, i = 0, o = []; ++r < n; ) {
    var s = t[r];
    e(s, r, t) && (o[i++] = s);
  }
  return o;
}
function Yo() {
  return [];
}
var j2 = Object.prototype, W2 = j2.propertyIsEnumerable, Oc = Object.getOwnPropertySymbols, fa = Oc ? function(t) {
  return t == null ? [] : (t = Object(t), sr(Oc(t), function(e) {
    return W2.call(t, e);
  }));
} : Yo;
function q2(t, e) {
  return Ae(t, fa(t), e);
}
var U2 = Object.getOwnPropertySymbols, tp = U2 ? function(t) {
  for (var e = []; t; )
    ir(e, fa(t)), t = Go(t);
  return e;
} : Yo;
function G2(t, e) {
  return Ae(t, tp(t), e);
}
function ep(t, e, r) {
  var n = e(t);
  return $(t) ? n : ir(n, r(t));
}
function su(t) {
  return ep(t, ot, fa);
}
function ca(t) {
  return ep(t, It, tp);
}
var uu = br(lt, "DataView"), au = br(lt, "Promise"), Nr = br(lt, "Set"), Ec = "[object Map]", k2 = "[object Object]", Rc = "[object Promise]", $c = "[object Set]", Tc = "[object WeakMap]", Mc = "[object DataView]", H2 = mr(uu), K2 = mr(Kn), Y2 = mr(au), Z2 = mr(Nr), X2 = mr(Un), lr = $t;
(uu && lr(new uu(new ArrayBuffer(1))) != Mc || Kn && lr(new Kn()) != Ec || au && lr(au.resolve()) != Rc || Nr && lr(new Nr()) != $c || Un && lr(new Un()) != Tc) && (lr = function(t) {
  var e = $t(t), r = e == k2 ? t.constructor : void 0, n = r ? mr(r) : "";
  if (n)
    switch (n) {
      case H2:
        return Mc;
      case K2:
        return Ec;
      case Y2:
        return Rc;
      case Z2:
        return $c;
      case X2:
        return Tc;
    }
  return e;
});
const me = lr;
var V2 = Object.prototype, J2 = V2.hasOwnProperty;
function Q2(t) {
  var e = t.length, r = new t.constructor(e);
  return e && typeof t[0] == "string" && J2.call(t, "index") && (r.index = t.index, r.input = t.input), r;
}
var ho = lt.Uint8Array;
function la(t) {
  var e = new t.constructor(t.byteLength);
  return new ho(e).set(new ho(t)), e;
}
function tS(t, e) {
  var r = e ? la(t.buffer) : t.buffer;
  return new t.constructor(r, t.byteOffset, t.byteLength);
}
var eS = /\w*$/;
function rS(t) {
  var e = new t.constructor(t.source, eS.exec(t));
  return e.lastIndex = t.lastIndex, e;
}
var Ic = vt ? vt.prototype : void 0, Pc = Ic ? Ic.valueOf : void 0;
function nS(t) {
  return Pc ? Object(Pc.call(t)) : {};
}
function rp(t, e) {
  var r = e ? la(t.buffer) : t.buffer;
  return new t.constructor(r, t.byteOffset, t.length);
}
var iS = "[object Boolean]", oS = "[object Date]", sS = "[object Map]", uS = "[object Number]", aS = "[object RegExp]", fS = "[object Set]", cS = "[object String]", lS = "[object Symbol]", hS = "[object ArrayBuffer]", pS = "[object DataView]", dS = "[object Float32Array]", _S = "[object Float64Array]", gS = "[object Int8Array]", vS = "[object Int16Array]", yS = "[object Int32Array]", mS = "[object Uint8Array]", bS = "[object Uint8ClampedArray]", wS = "[object Uint16Array]", AS = "[object Uint32Array]";
function SS(t, e, r) {
  var n = t.constructor;
  switch (e) {
    case hS:
      return la(t);
    case iS:
    case oS:
      return new n(+t);
    case pS:
      return tS(t, r);
    case dS:
    case _S:
    case gS:
    case vS:
    case yS:
    case mS:
    case bS:
    case wS:
    case AS:
      return rp(t, r);
    case sS:
      return new n();
    case uS:
    case cS:
      return new n(t);
    case aS:
      return rS(t);
    case fS:
      return new n();
    case lS:
      return nS(t);
  }
}
function np(t) {
  return typeof t.constructor == "function" && !_i(t) ? en(Go(t)) : {};
}
var xS = "[object Map]";
function OS(t) {
  return Q(t) && me(t) == xS;
}
var Lc = re && re.isMap, ha = Lc ? kt(Lc) : OS, ES = "[object Set]";
function RS(t) {
  return Q(t) && me(t) == ES;
}
var Cc = re && re.isSet, pa = Cc ? kt(Cc) : RS, $S = 1, TS = 2, MS = 4, ip = "[object Arguments]", IS = "[object Array]", PS = "[object Boolean]", LS = "[object Date]", CS = "[object Error]", op = "[object Function]", FS = "[object GeneratorFunction]", NS = "[object Map]", zS = "[object Number]", sp = "[object Object]", DS = "[object RegExp]", BS = "[object Set]", jS = "[object String]", WS = "[object Symbol]", qS = "[object WeakMap]", US = "[object ArrayBuffer]", GS = "[object DataView]", kS = "[object Float32Array]", HS = "[object Float64Array]", KS = "[object Int8Array]", YS = "[object Int16Array]", ZS = "[object Int32Array]", XS = "[object Uint8Array]", VS = "[object Uint8ClampedArray]", JS = "[object Uint16Array]", QS = "[object Uint32Array]", k = {};
k[ip] = k[IS] = k[US] = k[GS] = k[PS] = k[LS] = k[kS] = k[HS] = k[KS] = k[YS] = k[ZS] = k[NS] = k[zS] = k[sp] = k[DS] = k[BS] = k[jS] = k[WS] = k[XS] = k[VS] = k[JS] = k[QS] = !0;
k[CS] = k[op] = k[qS] = !1;
function Qt(t, e, r, n, i, o) {
  var s, u = e & $S, a = e & TS, f = e & MS;
  if (r && (s = i ? r(t, n, i, o) : r(t)), s !== void 0)
    return s;
  if (!J(t))
    return t;
  var c = $(t);
  if (c) {
    if (s = Q2(t), !u)
      return Ct(t, s);
  } else {
    var l = me(t), p = l == op || l == FS;
    if (Ne(t))
      return Qh(t, u);
    if (l == sp || l == ip || p && !i) {
      if (s = a || p ? {} : np(t), !u)
        return a ? G2(t, D2(s, t)) : q2(t, Vh(s, t));
    } else {
      if (!k[l])
        return i ? t : {};
      s = SS(t, l, u);
    }
  }
  o || (o = new ce());
  var d = o.get(t);
  if (d)
    return d;
  o.set(t, s), pa(t) ? t.forEach(function(v) {
    s.add(Qt(v, e, r, v, t, o));
  }) : ha(t) && t.forEach(function(v, y) {
    s.set(y, Qt(v, e, r, y, t, o));
  });
  var _ = f ? a ? ca : su : a ? It : ot, g = c ? void 0 : _(t);
  return ie(g || t, function(v, y) {
    g && (y = v, v = t[y]), pi(s, y, Qt(v, e, r, y, t, o));
  }), s;
}
var tx = 4;
function up(t) {
  return Qt(t, tx);
}
var ex = 1, rx = 4;
function ap(t) {
  return Qt(t, ex | rx);
}
var nx = 1, ix = 4;
function fp(t, e) {
  return e = typeof e == "function" ? e : void 0, Qt(t, nx | ix, e);
}
var ox = 4;
function cp(t, e) {
  return e = typeof e == "function" ? e : void 0, Qt(t, ox, e);
}
function fu() {
  return new ee(this.value(), this.__chain__);
}
function lp(t) {
  for (var e = -1, r = t == null ? 0 : t.length, n = 0, i = []; ++e < r; ) {
    var o = t[e];
    o && (i[n++] = o);
  }
  return i;
}
function hp() {
  var t = arguments.length;
  if (!t)
    return [];
  for (var e = Array(t - 1), r = arguments[0], n = t; n--; )
    e[n - 1] = arguments[n];
  return ir($(r) ? Ct(r) : [r], dt(e, 1));
}
var sx = "__lodash_hash_undefined__";
function ux(t) {
  return this.__data__.set(t, sx), this;
}
function ax(t) {
  return this.__data__.has(t);
}
function _r(t) {
  var e = -1, r = t == null ? 0 : t.length;
  for (this.__data__ = new Ue(); ++e < r; )
    this.add(t[e]);
}
_r.prototype.add = _r.prototype.push = ux;
_r.prototype.has = ax;
function da(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length; ++r < n; )
    if (e(t[r], r, t))
      return !0;
  return !1;
}
function Yn(t, e) {
  return t.has(e);
}
var fx = 1, cx = 2;
function pp(t, e, r, n, i, o) {
  var s = r & fx, u = t.length, a = e.length;
  if (u != a && !(s && a > u))
    return !1;
  var f = o.get(t), c = o.get(e);
  if (f && c)
    return f == e && c == t;
  var l = -1, p = !0, d = r & cx ? new _r() : void 0;
  for (o.set(t, e), o.set(e, t); ++l < u; ) {
    var _ = t[l], g = e[l];
    if (n)
      var v = s ? n(g, _, l, e, t, o) : n(_, g, l, t, e, o);
    if (v !== void 0) {
      if (v)
        continue;
      p = !1;
      break;
    }
    if (d) {
      if (!da(e, function(y, m) {
        if (!Yn(d, m) && (_ === y || i(_, y, r, n, o)))
          return d.push(m);
      })) {
        p = !1;
        break;
      }
    } else if (!(_ === g || i(_, g, r, n, o))) {
      p = !1;
      break;
    }
  }
  return o.delete(t), o.delete(e), p;
}
function _a(t) {
  var e = -1, r = Array(t.size);
  return t.forEach(function(n, i) {
    r[++e] = [i, n];
  }), r;
}
function Zo(t) {
  var e = -1, r = Array(t.size);
  return t.forEach(function(n) {
    r[++e] = n;
  }), r;
}
var lx = 1, hx = 2, px = "[object Boolean]", dx = "[object Date]", _x = "[object Error]", gx = "[object Map]", vx = "[object Number]", yx = "[object RegExp]", mx = "[object Set]", bx = "[object String]", wx = "[object Symbol]", Ax = "[object ArrayBuffer]", Sx = "[object DataView]", Fc = vt ? vt.prototype : void 0, zs = Fc ? Fc.valueOf : void 0;
function xx(t, e, r, n, i, o, s) {
  switch (r) {
    case Sx:
      if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset)
        return !1;
      t = t.buffer, e = e.buffer;
    case Ax:
      return !(t.byteLength != e.byteLength || !o(new ho(t), new ho(e)));
    case px:
    case dx:
    case vx:
      return oe(+t, +e);
    case _x:
      return t.name == e.name && t.message == e.message;
    case yx:
    case bx:
      return t == e + "";
    case gx:
      var u = _a;
    case mx:
      var a = n & lx;
      if (u || (u = Zo), t.size != e.size && !a)
        return !1;
      var f = s.get(t);
      if (f)
        return f == e;
      n |= hx, s.set(t, e);
      var c = pp(u(t), u(e), n, i, o, s);
      return s.delete(t), c;
    case wx:
      if (zs)
        return zs.call(t) == zs.call(e);
  }
  return !1;
}
var Ox = 1, Ex = Object.prototype, Rx = Ex.hasOwnProperty;
function $x(t, e, r, n, i, o) {
  var s = r & Ox, u = su(t), a = u.length, f = su(e), c = f.length;
  if (a != c && !s)
    return !1;
  for (var l = a; l--; ) {
    var p = u[l];
    if (!(s ? p in e : Rx.call(e, p)))
      return !1;
  }
  var d = o.get(t), _ = o.get(e);
  if (d && _)
    return d == e && _ == t;
  var g = !0;
  o.set(t, e), o.set(e, t);
  for (var v = s; ++l < a; ) {
    p = u[l];
    var y = t[p], m = e[p];
    if (n)
      var w = s ? n(m, y, p, e, t, o) : n(y, m, p, t, e, o);
    if (!(w === void 0 ? y === m || i(y, m, r, n, o) : w)) {
      g = !1;
      break;
    }
    v || (v = p == "constructor");
  }
  if (g && !v) {
    var b = t.constructor, A = e.constructor;
    b != A && "constructor" in t && "constructor" in e && !(typeof b == "function" && b instanceof b && typeof A == "function" && A instanceof A) && (g = !1);
  }
  return o.delete(t), o.delete(e), g;
}
var Tx = 1, Nc = "[object Arguments]", zc = "[object Array]", Hi = "[object Object]", Mx = Object.prototype, Dc = Mx.hasOwnProperty;
function Ix(t, e, r, n, i, o) {
  var s = $(t), u = $(e), a = s ? zc : me(t), f = u ? zc : me(e);
  a = a == Nc ? Hi : a, f = f == Nc ? Hi : f;
  var c = a == Hi, l = f == Hi, p = a == f;
  if (p && Ne(t)) {
    if (!Ne(e))
      return !1;
    s = !0, c = !1;
  }
  if (p && !c)
    return o || (o = new ce()), s || wr(t) ? pp(t, e, r, n, i, o) : xx(t, e, a, r, n, i, o);
  if (!(r & Tx)) {
    var d = c && Dc.call(t, "__wrapped__"), _ = l && Dc.call(e, "__wrapped__");
    if (d || _) {
      var g = d ? t.value() : t, v = _ ? e.value() : e;
      return o || (o = new ce()), i(g, v, r, n, o);
    }
  }
  return p ? (o || (o = new ce()), $x(t, e, r, n, i, o)) : !1;
}
function yi(t, e, r, n, i) {
  return t === e ? !0 : t == null || e == null || !Q(t) && !Q(e) ? t !== t && e !== e : Ix(t, e, r, n, yi, i);
}
var Px = 1, Lx = 2;
function ga(t, e, r, n) {
  var i = r.length, o = i, s = !n;
  if (t == null)
    return !o;
  for (t = Object(t); i--; ) {
    var u = r[i];
    if (s && u[2] ? u[1] !== t[u[0]] : !(u[0] in t))
      return !1;
  }
  for (; ++i < o; ) {
    u = r[i];
    var a = u[0], f = t[a], c = u[1];
    if (s && u[2]) {
      if (f === void 0 && !(a in t))
        return !1;
    } else {
      var l = new ce();
      if (n)
        var p = n(f, c, a, t, e, l);
      if (!(p === void 0 ? yi(c, f, Px | Lx, n, l) : p))
        return !1;
    }
  }
  return !0;
}
function dp(t) {
  return t === t && !J(t);
}
function va(t) {
  for (var e = ot(t), r = e.length; r--; ) {
    var n = e[r], i = t[n];
    e[r] = [n, i, dp(i)];
  }
  return e;
}
function _p(t, e) {
  return function(r) {
    return r == null ? !1 : r[t] === e && (e !== void 0 || t in Object(r));
  };
}
function gp(t) {
  var e = va(t);
  return e.length == 1 && e[0][2] ? _p(e[0][0], e[0][1]) : function(r) {
    return r === t || ga(r, t, e);
  };
}
function Cx(t, e) {
  return t != null && e in Object(t);
}
function vp(t, e, r) {
  e = nr(e, t);
  for (var n = -1, i = e.length, o = !1; ++n < i; ) {
    var s = Se(e[n]);
    if (!(o = t != null && r(t, s)))
      break;
    t = t[s];
  }
  return o || ++n != i ? o : (i = t == null ? 0 : t.length, !!i && di(i) && Be(s, i) && ($(t) || Ve(t)));
}
function Xo(t, e) {
  return t != null && vp(t, e, Cx);
}
var Fx = 1, Nx = 2;
function yp(t, e) {
  return Vu(t) && dp(e) ? _p(Se(t), e) : function(r) {
    var n = Uo(r, t);
    return n === void 0 && n === e ? Xo(r, t) : yi(e, n, Fx | Nx);
  };
}
function ya(t) {
  return function(e) {
    return e?.[t];
  };
}
function zx(t) {
  return function(e) {
    return Ar(e, t);
  };
}
function ma(t) {
  return Vu(t) ? ya(Se(t)) : zx(t);
}
function R(t) {
  return typeof t == "function" ? t : t == null ? Tt : typeof t == "object" ? $(t) ? yp(t[0], t[1]) : gp(t) : ma(t);
}
var Dx = "Expected a function";
function mp(t) {
  var e = t == null ? 0 : t.length, r = R;
  return t = e ? V(t, function(n) {
    if (typeof n[1] != "function")
      throw new TypeError(Dx);
    return [r(n[0]), n[1]];
  }) : [], I(function(n) {
    for (var i = -1; ++i < e; ) {
      var o = t[i];
      if (Gt(o[0], this, n))
        return Gt(o[1], this, n);
    }
  });
}
function bp(t, e, r) {
  var n = r.length;
  if (t == null)
    return !n;
  for (t = Object(t); n--; ) {
    var i = r[n], o = e[i], s = t[i];
    if (s === void 0 && !(i in t) || !o(s))
      return !1;
  }
  return !0;
}
function Bx(t) {
  var e = ot(t);
  return function(r) {
    return bp(r, t, e);
  };
}
var jx = 1;
function wp(t) {
  return Bx(Qt(t, jx));
}
function Ap(t, e) {
  return e == null || bp(t, e, ot(e));
}
function Wx(t, e, r, n) {
  for (var i = -1, o = t == null ? 0 : t.length; ++i < o; ) {
    var s = t[i];
    e(n, s, r(s), t);
  }
  return n;
}
function Sp(t) {
  return function(e, r, n) {
    for (var i = -1, o = Object(e), s = n(e), u = s.length; u--; ) {
      var a = s[t ? u : ++i];
      if (r(o[a], a, o) === !1)
        break;
    }
    return e;
  };
}
var ba = Sp();
function xe(t, e) {
  return t && ba(t, e, ot);
}
function xp(t, e) {
  return function(r, n) {
    if (r == null)
      return r;
    if (!Mt(r))
      return t(r, n);
    for (var i = r.length, o = e ? i : -1, s = Object(r); (e ? o-- : ++o < i) && n(s[o], o, s) !== !1; )
      ;
    return r;
  };
}
var ur = xp(xe);
function qx(t, e, r, n) {
  return ur(t, function(i, o, s) {
    e(n, i, r(i), s);
  }), n;
}
function Vo(t, e) {
  return function(r, n) {
    var i = $(r) ? Wx : qx, o = e ? e() : {};
    return i(r, t, R(n), o);
  };
}
var Ux = Object.prototype, Gx = Ux.hasOwnProperty, Op = Vo(function(t, e, r) {
  Gx.call(t, r) ? ++t[r] : We(t, r, 1);
});
function Ep(t, e) {
  var r = en(t);
  return e == null ? r : Vh(r, e);
}
var kx = 8;
function Jo(t, e, r) {
  e = r ? void 0 : e;
  var n = je(t, kx, void 0, void 0, void 0, void 0, void 0, e);
  return n.placeholder = Jo.placeholder, n;
}
Jo.placeholder = {};
var Hx = 16;
function Qo(t, e, r) {
  e = r ? void 0 : e;
  var n = je(t, Hx, void 0, void 0, void 0, void 0, void 0, e);
  return n.placeholder = Qo.placeholder, n;
}
Qo.placeholder = {};
var Pn = function() {
  return lt.Date.now();
}, Kx = "Expected a function", Yx = Math.max, Zx = Math.min;
function wa(t, e, r) {
  var n, i, o, s, u, a, f = 0, c = !1, l = !1, p = !0;
  if (typeof t != "function")
    throw new TypeError(Kx);
  e = Wt(e) || 0, J(r) && (c = !!r.leading, l = "maxWait" in r, o = l ? Yx(Wt(r.maxWait) || 0, e) : o, p = "trailing" in r ? !!r.trailing : p);
  function d(x) {
    var M = n, nt = i;
    return n = i = void 0, f = x, s = t.apply(nt, M), s;
  }
  function _(x) {
    return f = x, u = setTimeout(y, e), c ? d(x) : s;
  }
  function g(x) {
    var M = x - a, nt = x - f, $e = e - M;
    return l ? Zx($e, o - nt) : $e;
  }
  function v(x) {
    var M = x - a, nt = x - f;
    return a === void 0 || M >= e || M < 0 || l && nt >= o;
  }
  function y() {
    var x = Pn();
    if (v(x))
      return m(x);
    u = setTimeout(y, g(x));
  }
  function m(x) {
    return u = void 0, p && n ? d(x) : (n = i = void 0, s);
  }
  function w() {
    u !== void 0 && clearTimeout(u), f = 0, n = a = i = u = void 0;
  }
  function b() {
    return u === void 0 ? s : m(Pn());
  }
  function A() {
    var x = Pn(), M = v(x);
    if (n = arguments, i = this, a = x, M) {
      if (u === void 0)
        return _(a);
      if (l)
        return clearTimeout(u), u = setTimeout(y, e), d(a);
    }
    return u === void 0 && (u = setTimeout(y, e)), s;
  }
  return A.cancel = w, A.flush = b, A;
}
function Rp(t, e) {
  return t == null || t !== t ? e : t;
}
var $p = Object.prototype, Xx = $p.hasOwnProperty, Tp = I(function(t, e) {
  t = Object(t);
  var r = -1, n = e.length, i = n > 2 ? e[2] : void 0;
  for (i && Et(e[0], e[1], i) && (n = 1); ++r < n; )
    for (var o = e[r], s = It(o), u = -1, a = s.length; ++u < a; ) {
      var f = s[u], c = t[f];
      (c === void 0 || oe(c, $p[f]) && !Xx.call(t, f)) && (t[f] = o[f]);
    }
  return t;
});
function cu(t, e, r) {
  (r !== void 0 && !oe(t[e], r) || r === void 0 && !(e in t)) && We(t, e, r);
}
function tt(t) {
  return Q(t) && Mt(t);
}
function lu(t, e) {
  if (!(e === "constructor" && typeof t[e] == "function") && e != "__proto__")
    return t[e];
}
function Aa(t) {
  return Ae(t, It(t));
}
function Vx(t, e, r, n, i, o, s) {
  var u = lu(t, r), a = lu(e, r), f = s.get(a);
  if (f) {
    cu(t, r, f);
    return;
  }
  var c = o ? o(u, a, r + "", t, e, s) : void 0, l = c === void 0;
  if (l) {
    var p = $(a), d = !p && Ne(a), _ = !p && !d && wr(a);
    c = a, p || d || _ ? $(u) ? c = u : tt(u) ? c = Ct(u) : d ? (l = !1, c = Qh(a, !0)) : _ ? (l = !1, c = rp(a, !0)) : c = [] : sn(a) || Ve(a) ? (c = u, Ve(u) ? c = Aa(u) : (!J(u) || we(u)) && (c = np(a))) : l = !1;
  }
  l && (s.set(a, c), i(c, a, n, o, s), s.delete(a)), cu(t, r, c);
}
function ts(t, e, r, n, i) {
  t !== e && ba(e, function(o, s) {
    if (i || (i = new ce()), J(o))
      Vx(t, e, s, r, ts, n, i);
    else {
      var u = n ? n(lu(t, s), o, s + "", t, e, i) : void 0;
      u === void 0 && (u = o), cu(t, s, u);
    }
  }, It);
}
function Mp(t, e, r, n, i, o) {
  return J(t) && J(e) && (o.set(e, t), ts(t, e, void 0, Mp, o), o.delete(e)), t;
}
var Sa = on(function(t, e, r, n) {
  ts(t, e, r, n);
}), Ip = I(function(t) {
  return t.push(void 0, Mp), Gt(Sa, void 0, t);
}), Jx = "Expected a function";
function Pp(t, e, r) {
  if (typeof t != "function")
    throw new TypeError(Jx);
  return setTimeout(function() {
    t.apply(void 0, r);
  }, e);
}
var Lp = I(function(t, e) {
  return Pp(t, 1, e);
}), Cp = I(function(t, e, r) {
  return Pp(t, Wt(e) || 0, r);
});
function xa(t, e, r) {
  for (var n = -1, i = t == null ? 0 : t.length; ++n < i; )
    if (r(e, t[n]))
      return !0;
  return !1;
}
var Qx = 200;
function mi(t, e, r, n) {
  var i = -1, o = Do, s = !0, u = t.length, a = [], f = e.length;
  if (!u)
    return a;
  r && (e = V(e, kt(r))), n ? (o = xa, s = !1) : e.length >= Qx && (o = Yn, s = !1, e = new _r(e));
  t:
    for (; ++i < u; ) {
      var c = t[i], l = r == null ? c : r(c);
      if (c = n || c !== 0 ? c : 0, s && l === l) {
        for (var p = f; p--; )
          if (e[p] === l)
            continue t;
        a.push(c);
      } else o(e, l, n) || a.push(c);
    }
  return a;
}
var Fp = I(function(t, e) {
  return tt(t) ? mi(t, dt(e, 1, tt, !0)) : [];
});
function Ht(t) {
  var e = t == null ? 0 : t.length;
  return e ? t[e - 1] : void 0;
}
var Np = I(function(t, e) {
  var r = Ht(e);
  return tt(r) && (r = void 0), tt(t) ? mi(t, dt(e, 1, tt, !0), R(r)) : [];
}), zp = I(function(t, e) {
  var r = Ht(e);
  return tt(r) && (r = void 0), tt(t) ? mi(t, dt(e, 1, tt, !0), void 0, r) : [];
}), Dp = Lo(function(t, e) {
  return t / e;
}, 1);
function Bp(t, e, r) {
  var n = t == null ? 0 : t.length;
  return n ? (e = r || e === void 0 ? 1 : T(e), ne(t, e < 0 ? 0 : e, n)) : [];
}
function jp(t, e, r) {
  var n = t == null ? 0 : t.length;
  return n ? (e = r || e === void 0 ? 1 : T(e), e = n - e, ne(t, 0, e < 0 ? 0 : e)) : [];
}
function es(t, e, r, n) {
  for (var i = t.length, o = n ? i : -1; (n ? o-- : ++o < i) && e(t[o], o, t); )
    ;
  return r ? ne(t, n ? 0 : o, n ? o + 1 : i) : ne(t, n ? o + 1 : 0, n ? i : o);
}
function Wp(t, e) {
  return t && t.length ? es(t, R(e), !0, !0) : [];
}
function qp(t, e) {
  return t && t.length ? es(t, R(e), !0) : [];
}
function Oe(t) {
  return typeof t == "function" ? t : Tt;
}
function hu(t, e) {
  var r = $(t) ? ie : ur;
  return r(t, Oe(e));
}
function tO(t, e) {
  for (var r = t == null ? 0 : t.length; r-- && e(t[r], r, t) !== !1; )
    ;
  return t;
}
var Up = Sp(!0);
function Oa(t, e) {
  return t && Up(t, e, ot);
}
var Gp = xp(Oa, !0);
function pu(t, e) {
  var r = $(t) ? tO : Gp;
  return r(t, Oe(e));
}
function kp(t, e, r) {
  t = D(t), e = Ut(e);
  var n = t.length;
  r = r === void 0 ? n : Sr(T(r), 0, n);
  var i = r;
  return r -= e.length, r >= 0 && t.slice(r, i) == e;
}
function eO(t, e) {
  return V(e, function(r) {
    return [r, t[r]];
  });
}
function rO(t) {
  var e = -1, r = Array(t.size);
  return t.forEach(function(n) {
    r[++e] = [n, n];
  }), r;
}
var nO = "[object Map]", iO = "[object Set]";
function Hp(t) {
  return function(e) {
    var r = me(e);
    return r == nO ? _a(e) : r == iO ? rO(e) : eO(e, t(e));
  };
}
var du = Hp(ot), _u = Hp(It), oO = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, sO = ia(oO), Kp = /[&<>"']/g, uO = RegExp(Kp.source);
function Ea(t) {
  return t = D(t), t && uO.test(t) ? t.replace(Kp, sO) : t;
}
var Yp = /[\\^$.*+?()[\]{}|]/g, aO = RegExp(Yp.source);
function Zp(t) {
  return t = D(t), t && aO.test(t) ? t.replace(Yp, "\\$&") : t;
}
function Xp(t, e) {
  for (var r = -1, n = t == null ? 0 : t.length; ++r < n; )
    if (!e(t[r], r, t))
      return !1;
  return !0;
}
function fO(t, e) {
  var r = !0;
  return ur(t, function(n, i, o) {
    return r = !!e(n, i, o), r;
  }), r;
}
function Vp(t, e, r) {
  var n = $(t) ? Xp : fO;
  return r && Et(t, e, r) && (e = void 0), n(t, R(e));
}
var cO = 4294967295;
function Ra(t) {
  return t ? Sr(T(t), 0, cO) : 0;
}
function lO(t, e, r, n) {
  var i = t.length;
  for (r = T(r), r < 0 && (r = -r > i ? 0 : i + r), n = n === void 0 || n > i ? i : T(n), n < 0 && (n += i), n = r > n ? 0 : Ra(n); r < n; )
    t[r++] = e;
  return t;
}
function Jp(t, e, r, n) {
  var i = t == null ? 0 : t.length;
  return i ? (r && typeof r != "number" && Et(t, e, r) && (r = 0, n = i), lO(t, e, r, n)) : [];
}
function Qp(t, e) {
  var r = [];
  return ur(t, function(n, i, o) {
    e(n, i, o) && r.push(n);
  }), r;
}
function td(t, e) {
  var r = $(t) ? sr : Qp;
  return r(t, R(e));
}
function ed(t) {
  return function(e, r, n) {
    var i = Object(e);
    if (!Mt(e)) {
      var o = R(r);
      e = ot(e), r = function(u) {
        return o(i[u], u, i);
      };
    }
    var s = t(e, r, n);
    return s > -1 ? i[o ? e[s] : s] : void 0;
  };
}
var hO = Math.max;
function $a(t, e, r) {
  var n = t == null ? 0 : t.length;
  if (!n)
    return -1;
  var i = r == null ? 0 : T(r);
  return i < 0 && (i = hO(n + i, 0)), zo(t, R(e), i);
}
var rd = ed($a);
function nd(t, e, r) {
  var n;
  return r(t, function(i, o, s) {
    if (e(i, o, s))
      return n = o, !1;
  }), n;
}
function id(t, e) {
  return nd(t, R(e), xe);
}
var pO = Math.max, dO = Math.min;
function Ta(t, e, r) {
  var n = t == null ? 0 : t.length;
  if (!n)
    return -1;
  var i = n - 1;
  return r !== void 0 && (i = T(r), i = r < 0 ? pO(n + i, 0) : dO(i, n - 1)), zo(t, R(e), i, !0);
}
var od = ed(Ta);
function sd(t, e) {
  return nd(t, R(e), Oa);
}
function gu(t) {
  return t && t.length ? t[0] : void 0;
}
function ud(t, e) {
  var r = -1, n = Mt(t) ? Array(t.length) : [];
  return ur(t, function(i, o, s) {
    n[++r] = e(i, o, s);
  }), n;
}
function bi(t, e) {
  var r = $(t) ? V : ud;
  return r(t, R(e));
}
function ad(t, e) {
  return dt(bi(t, e), 1);
}
var _O = 1 / 0;
function fd(t, e) {
  return dt(bi(t, e), _O);
}
function cd(t, e, r) {
  return r = r === void 0 ? 1 : T(r), dt(bi(t, e), r);
}
var gO = 1 / 0;
function ld(t) {
  var e = t == null ? 0 : t.length;
  return e ? dt(t, gO) : [];
}
function hd(t, e) {
  var r = t == null ? 0 : t.length;
  return r ? (e = e === void 0 ? 1 : T(e), dt(t, e)) : [];
}
var vO = 512;
function pd(t) {
  return je(t, vO);
}
var dd = ua("floor"), yO = "Expected a function", mO = 8, bO = 32, wO = 128, AO = 256;
function _d(t) {
  return Ge(function(e) {
    var r = e.length, n = r, i = ee.prototype.thru;
    for (t && e.reverse(); n--; ) {
      var o = e[n];
      if (typeof o != "function")
        throw new TypeError(yO);
      if (i && !s && oo(o) == "wrapper")
        var s = new ee([], !0);
    }
    for (n = s ? n : r; ++n < r; ) {
      o = e[n];
      var u = oo(o), a = u == "wrapper" ? Hu(o) : void 0;
      a && ru(a[0]) && a[1] == (wO | mO | bO | AO) && !a[4].length && a[9] == 1 ? s = s[oo(a[0])].apply(s, a[3]) : s = o.length == 1 && ru(o) ? s[u]() : s.thru(o);
    }
    return function() {
      var f = arguments, c = f[0];
      if (s && f.length == 1 && $(c))
        return s.plant(c).value();
      for (var l = 0, p = r ? e[l].apply(this, f) : c; ++l < r; )
        p = e[l].call(this, p);
      return p;
    };
  });
}
var gd = _d(), vd = _d(!0);
function yd(t, e) {
  return t == null ? t : ba(t, Oe(e), It);
}
function md(t, e) {
  return t == null ? t : Up(t, Oe(e), It);
}
function bd(t, e) {
  return t && xe(t, Oe(e));
}
function wd(t, e) {
  return t && Oa(t, Oe(e));
}
function Ad(t) {
  for (var e = -1, r = t == null ? 0 : t.length, n = {}; ++e < r; ) {
    var i = t[e];
    n[i[0]] = i[1];
  }
  return n;
}
function rs(t, e) {
  return sr(e, function(r) {
    return we(t[r]);
  });
}
function Sd(t) {
  return t == null ? [] : rs(t, ot(t));
}
function xd(t) {
  return t == null ? [] : rs(t, It(t));
}
var SO = Object.prototype, xO = SO.hasOwnProperty, Od = Vo(function(t, e, r) {
  xO.call(t, r) ? t[r].push(e) : We(t, r, [e]);
});
function Ma(t, e) {
  return t > e;
}
function ns(t) {
  return function(e, r) {
    return typeof e == "string" && typeof r == "string" || (e = Wt(e), r = Wt(r)), t(e, r);
  };
}
var Ed = ns(Ma), Rd = ns(function(t, e) {
  return t >= e;
}), OO = Object.prototype, EO = OO.hasOwnProperty;
function RO(t, e) {
  return t != null && EO.call(t, e);
}
function $d(t, e) {
  return t != null && vp(t, e, RO);
}
var $O = Math.max, TO = Math.min;
function MO(t, e, r) {
  return t >= TO(e, r) && t < $O(e, r);
}
function Td(t, e, r) {
  return e = ye(e), r === void 0 ? (r = e, e = 0) : r = ye(r), t = Wt(t), MO(t, e, r);
}
var IO = "[object String]";
function wi(t) {
  return typeof t == "string" || !$(t) && Q(t) && $t(t) == IO;
}
function Ia(t, e) {
  return V(e, function(r) {
    return t[r];
  });
}
function xr(t) {
  return t == null ? [] : Ia(t, ot(t));
}
var PO = Math.max;
function Md(t, e, r, n) {
  t = Mt(t) ? t : xr(t), r = r && !n ? T(r) : 0;
  var i = t.length;
  return r < 0 && (r = PO(i + r, 0)), wi(t) ? r <= i && t.indexOf(e, r) > -1 : !!i && rn(t, e, r) > -1;
}
var LO = Math.max;
function Id(t, e, r) {
  var n = t == null ? 0 : t.length;
  if (!n)
    return -1;
  var i = r == null ? 0 : T(r);
  return i < 0 && (i = LO(n + i, 0)), rn(t, e, i);
}
function Pd(t) {
  var e = t == null ? 0 : t.length;
  return e ? ne(t, 0, -1) : [];
}
var CO = Math.min;
function Pa(t, e, r) {
  for (var n = r ? xa : Do, i = t[0].length, o = t.length, s = o, u = Array(o), a = 1 / 0, f = []; s--; ) {
    var c = t[s];
    s && e && (c = V(c, kt(e))), a = CO(c.length, a), u[s] = !r && (e || i >= 120 && c.length >= 120) ? new _r(s && c) : void 0;
  }
  c = t[0];
  var l = -1, p = u[0];
  t:
    for (; ++l < i && f.length < a; ) {
      var d = c[l], _ = e ? e(d) : d;
      if (d = r || d !== 0 ? d : 0, !(p ? Yn(p, _) : n(f, _, r))) {
        for (s = o; --s; ) {
          var g = u[s];
          if (!(g ? Yn(g, _) : n(t[s], _, r)))
            continue t;
        }
        p && p.push(_), f.push(d);
      }
    }
  return f;
}
function La(t) {
  return tt(t) ? t : [];
}
var Ld = I(function(t) {
  var e = V(t, La);
  return e.length && e[0] === t[0] ? Pa(e) : [];
}), Cd = I(function(t) {
  var e = Ht(t), r = V(t, La);
  return e === Ht(r) ? e = void 0 : r.pop(), r.length && r[0] === t[0] ? Pa(r, R(e)) : [];
}), Fd = I(function(t) {
  var e = Ht(t), r = V(t, La);
  return e = typeof e == "function" ? e : void 0, e && r.pop(), r.length && r[0] === t[0] ? Pa(r, void 0, e) : [];
});
function FO(t, e, r, n) {
  return xe(t, function(i, o, s) {
    e(n, r(i), o, s);
  }), n;
}
function Nd(t, e) {
  return function(r, n) {
    return FO(r, t, e(n), {});
  };
}
var NO = Object.prototype, zO = NO.toString, zd = Nd(function(t, e, r) {
  e != null && typeof e.toString != "function" && (e = zO.call(e)), t[e] = r;
}, No(Tt)), Dd = Object.prototype, DO = Dd.hasOwnProperty, BO = Dd.toString, Bd = Nd(function(t, e, r) {
  e != null && typeof e.toString != "function" && (e = BO.call(e)), DO.call(t, e) ? t[e].push(r) : t[e] = [r];
}, R);
function jd(t, e) {
  return e.length < 2 ? t : Ar(t, ne(e, 0, -1));
}
function Ai(t, e, r) {
  e = nr(e, t), t = jd(t, e);
  var n = t == null ? t : t[Se(Ht(e))];
  return n == null ? void 0 : Gt(n, t, r);
}
var Wd = I(Ai), qd = I(function(t, e, r) {
  var n = -1, i = typeof e == "function", o = Mt(t) ? Array(t.length) : [];
  return ur(t, function(s) {
    o[++n] = i ? Gt(e, s, r) : Ai(s, e, r);
  }), o;
}), jO = "[object ArrayBuffer]";
function WO(t) {
  return Q(t) && $t(t) == jO;
}
var Bc = re && re.isArrayBuffer, Ud = Bc ? kt(Bc) : WO, qO = "[object Boolean]";
function Gd(t) {
  return t === !0 || t === !1 || Q(t) && $t(t) == qO;
}
var UO = "[object Date]";
function GO(t) {
  return Q(t) && $t(t) == UO;
}
var jc = re && re.isDate, kd = jc ? kt(jc) : GO;
function Hd(t) {
  return Q(t) && t.nodeType === 1 && !sn(t);
}
var kO = "[object Map]", HO = "[object Set]", KO = Object.prototype, YO = KO.hasOwnProperty;
function Kd(t) {
  if (t == null)
    return !0;
  if (Mt(t) && ($(t) || typeof t == "string" || typeof t.splice == "function" || Ne(t) || wr(t) || Ve(t)))
    return !t.length;
  var e = me(t);
  if (e == kO || e == HO)
    return !t.size;
  if (_i(t))
    return !Xu(t).length;
  for (var r in t)
    if (YO.call(t, r))
      return !1;
  return !0;
}
function Yd(t, e) {
  return yi(t, e);
}
function Zd(t, e, r) {
  r = typeof r == "function" ? r : void 0;
  var n = r ? r(t, e) : void 0;
  return n === void 0 ? yi(t, e, void 0, r) : !!n;
}
var ZO = lt.isFinite;
function Xd(t) {
  return typeof t == "number" && ZO(t);
}
function Ca(t) {
  return typeof t == "number" && t == T(t);
}
function Vd(t, e) {
  return t === e || ga(t, e, va(e));
}
function Jd(t, e, r) {
  return r = typeof r == "function" ? r : void 0, ga(t, e, va(e), r);
}
var XO = "[object Number]";
function Fa(t) {
  return typeof t == "number" || Q(t) && $t(t) == XO;
}
function Qd(t) {
  return Fa(t) && t != +t;
}
var VO = io ? we : jo, JO = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";
function t_(t) {
  if (VO(t))
    throw new Error(JO);
  return ih(t);
}
function e_(t) {
  return t == null;
}
function r_(t) {
  return t === null;
}
var QO = "[object RegExp]";
function tE(t) {
  return Q(t) && $t(t) == QO;
}
var Wc = re && re.isRegExp, is = Wc ? kt(Wc) : tE, qc = 9007199254740991;
function n_(t) {
  return Ca(t) && t >= -qc && t <= qc;
}
function i_(t) {
  return t === void 0;
}
var eE = "[object WeakMap]";
function o_(t) {
  return Q(t) && me(t) == eE;
}
var rE = "[object WeakSet]";
function s_(t) {
  return Q(t) && $t(t) == rE;
}
var nE = 1;
function u_(t) {
  return R(typeof t == "function" ? t : Qt(t, nE));
}
var iE = Array.prototype, oE = iE.join;
function a_(t, e) {
  return t == null ? "" : oE.call(t, e);
}
var f_ = an(function(t, e, r) {
  return t + (r ? "-" : "") + e.toLowerCase();
}), c_ = Vo(function(t, e, r) {
  We(t, r, e);
});
function sE(t, e, r) {
  for (var n = r + 1; n--; )
    if (t[n] === e)
      return n;
  return n;
}
var uE = Math.max, aE = Math.min;
function l_(t, e, r) {
  var n = t == null ? 0 : t.length;
  if (!n)
    return -1;
  var i = n;
  return r !== void 0 && (i = T(r), i = i < 0 ? uE(n + i, 0) : aE(i, n - 1)), e === e ? sE(t, e, i) : zo(t, lh, i, !0);
}
var h_ = an(function(t, e, r) {
  return t + (r ? " " : "") + e.toLowerCase();
}), p_ = Ph("toLowerCase");
function Na(t, e) {
  return t < e;
}
var d_ = ns(Na), __ = ns(function(t, e) {
  return t <= e;
});
function g_(t, e) {
  var r = {};
  return e = R(e), xe(t, function(n, i, o) {
    We(r, e(n, i, o), n);
  }), r;
}
function v_(t, e) {
  var r = {};
  return e = R(e), xe(t, function(n, i, o) {
    We(r, i, e(n, i, o));
  }), r;
}
var fE = 1;
function y_(t) {
  return gp(Qt(t, fE));
}
var cE = 1;
function m_(t, e) {
  return yp(t, Qt(e, cE));
}
function os(t, e, r) {
  for (var n = -1, i = t.length; ++n < i; ) {
    var o = t[n], s = e(o);
    if (s != null && (u === void 0 ? s === s && !Ft(s) : r(s, u)))
      var u = s, a = o;
  }
  return a;
}
function b_(t) {
  return t && t.length ? os(t, Tt, Ma) : void 0;
}
function w_(t, e) {
  return t && t.length ? os(t, R(e), Ma) : void 0;
}
function za(t, e) {
  for (var r, n = -1, i = t.length; ++n < i; ) {
    var o = e(t[n]);
    o !== void 0 && (r = r === void 0 ? o : r + o);
  }
  return r;
}
var lE = NaN;
function A_(t, e) {
  var r = t == null ? 0 : t.length;
  return r ? za(t, e) / r : lE;
}
function S_(t) {
  return A_(t, Tt);
}
function x_(t, e) {
  return A_(t, R(e));
}
var O_ = on(function(t, e, r) {
  ts(t, e, r);
}), E_ = I(function(t, e) {
  return function(r) {
    return Ai(r, t, e);
  };
}), R_ = I(function(t, e) {
  return function(r) {
    return Ai(t, r, e);
  };
});
function $_(t) {
  return t && t.length ? os(t, Tt, Na) : void 0;
}
function T_(t, e) {
  return t && t.length ? os(t, R(e), Na) : void 0;
}
function M_(t, e, r) {
  var n = ot(e), i = rs(e, n), o = !(J(r) && "chain" in r) || !!r.chain, s = we(t);
  return ie(i, function(u) {
    var a = e[u];
    t[u] = a, s && (t.prototype[u] = function() {
      var f = this.__chain__;
      if (o || f) {
        var c = t(this.__wrapped__), l = c.__actions__ = Ct(this.__actions__);
        return l.push({ func: a, args: arguments, thisArg: t }), c.__chain__ = f, c;
      }
      return a.apply(t, ir([this.value()], arguments));
    });
  }), t;
}
var I_ = Lo(function(t, e) {
  return t * e;
}, 1), hE = "Expected a function";
function Si(t) {
  if (typeof t != "function")
    throw new TypeError(hE);
  return function() {
    var e = arguments;
    switch (e.length) {
      case 0:
        return !t.call(this);
      case 1:
        return !t.call(this, e[0]);
      case 2:
        return !t.call(this, e[0], e[1]);
      case 3:
        return !t.call(this, e[0], e[1], e[2]);
    }
    return !t.apply(this, e);
  };
}
function pE(t) {
  for (var e, r = []; !(e = t.next()).done; )
    r.push(e.value);
  return r;
}
var dE = "[object Map]", _E = "[object Set]", Ds = vt ? vt.iterator : void 0;
function Da(t) {
  if (!t)
    return [];
  if (Mt(t))
    return wi(t) ? he(t) : Ct(t);
  if (Ds && t[Ds])
    return pE(t[Ds]());
  var e = me(t), r = e == dE ? _a : e == _E ? Zo : xr;
  return r(t);
}
function vu() {
  this.__values__ === void 0 && (this.__values__ = Da(this.value()));
  var t = this.__index__ >= this.__values__.length, e = t ? void 0 : this.__values__[this.__index__++];
  return { done: t, value: e };
}
function P_(t, e) {
  var r = t.length;
  if (r)
    return e += e < 0 ? r : 0, Be(e, r) ? t[e] : void 0;
}
function L_(t, e) {
  return t && t.length ? P_(t, T(e)) : void 0;
}
function C_(t) {
  return t = T(t), I(function(e) {
    return P_(e, t);
  });
}
function Ba(t, e) {
  return e = nr(e, t), t = jd(t, e), t == null || delete t[Se(Ht(e))];
}
function gE(t) {
  return sn(t) ? void 0 : t;
}
var vE = 1, yE = 2, mE = 4, F_ = Ge(function(t, e) {
  var r = {};
  if (t == null)
    return r;
  var n = !1;
  e = V(e, function(o) {
    return o = nr(o, t), n || (n = o.length > 1), o;
  }), Ae(t, ca(t), r), n && (r = Qt(r, vE | yE | mE, gE));
  for (var i = e.length; i--; )
    Ba(r, e[i]);
  return r;
});
function xi(t, e, r, n) {
  if (!J(t))
    return t;
  e = nr(e, t);
  for (var i = -1, o = e.length, s = o - 1, u = t; u != null && ++i < o; ) {
    var a = Se(e[i]), f = r;
    if (a === "__proto__" || a === "constructor" || a === "prototype")
      return t;
    if (i != s) {
      var c = u[a];
      f = n ? n(c, a, u) : void 0, f === void 0 && (f = J(c) ? c : Be(e[i + 1]) ? [] : {});
    }
    pi(u, a, f), u = u[a];
  }
  return t;
}
function N_(t, e, r) {
  for (var n = -1, i = e.length, o = {}; ++n < i; ) {
    var s = e[n], u = Ar(t, s);
    r(u, s) && xi(o, nr(s, t), u);
  }
  return o;
}
function ja(t, e) {
  if (t == null)
    return {};
  var r = V(ca(t), function(n) {
    return [n];
  });
  return e = R(e), N_(t, r, function(n, i) {
    return e(n, i[0]);
  });
}
function z_(t, e) {
  return ja(t, Si(R(e)));
}
function D_(t) {
  return ea(2, t);
}
function bE(t, e) {
  var r = t.length;
  for (t.sort(e); r--; )
    t[r] = t[r].value;
  return t;
}
function B_(t, e) {
  if (t !== e) {
    var r = t !== void 0, n = t === null, i = t === t, o = Ft(t), s = e !== void 0, u = e === null, a = e === e, f = Ft(e);
    if (!u && !f && !o && t > e || o && s && a && !u && !f || n && s && a || !r && a || !i)
      return 1;
    if (!n && !o && !f && t < e || f && r && i && !n && !o || u && r && i || !s && i || !a)
      return -1;
  }
  return 0;
}
function wE(t, e, r) {
  for (var n = -1, i = t.criteria, o = e.criteria, s = i.length, u = r.length; ++n < s; ) {
    var a = B_(i[n], o[n]);
    if (a) {
      if (n >= u)
        return a;
      var f = r[n];
      return a * (f == "desc" ? -1 : 1);
    }
  }
  return t.index - e.index;
}
function j_(t, e, r) {
  e.length ? e = V(e, function(o) {
    return $(o) ? function(s) {
      return Ar(s, o.length === 1 ? o[0] : o);
    } : o;
  }) : e = [Tt];
  var n = -1;
  e = V(e, kt(R));
  var i = ud(t, function(o, s, u) {
    var a = V(e, function(f) {
      return f(o);
    });
    return { criteria: a, index: ++n, value: o };
  });
  return bE(i, function(o, s) {
    return wE(o, s, r);
  });
}
function W_(t, e, r, n) {
  return t == null ? [] : ($(e) || (e = e == null ? [] : [e]), r = n ? void 0 : r, $(r) || (r = r == null ? [] : [r]), j_(t, e, r));
}
function Wa(t) {
  return Ge(function(e) {
    return e = V(e, kt(R)), I(function(r) {
      var n = this;
      return t(e, function(i) {
        return Gt(i, n, r);
      });
    });
  });
}
var q_ = Wa(V), AE = I, SE = Math.min, U_ = AE(function(t, e) {
  e = e.length == 1 && $(e[0]) ? V(e[0], kt(R)) : V(dt(e, 1), kt(R));
  var r = e.length;
  return I(function(n) {
    for (var i = -1, o = SE(n.length, r); ++i < o; )
      n[i] = e[i].call(this, n[i]);
    return Gt(t, this, n);
  });
}), G_ = Wa(Xp), k_ = Wa(da), xE = 9007199254740991, OE = Math.floor;
function yu(t, e) {
  var r = "";
  if (!t || e < 1 || e > xE)
    return r;
  do
    e % 2 && (r += t), e = OE(e / 2), e && (t += t);
  while (e);
  return r;
}
var EE = ya("length"), H_ = "\\ud800-\\udfff", RE = "\\u0300-\\u036f", $E = "\\ufe20-\\ufe2f", TE = "\\u20d0-\\u20ff", ME = RE + $E + TE, IE = "\\ufe0e\\ufe0f", PE = "[" + H_ + "]", mu = "[" + ME + "]", bu = "\\ud83c[\\udffb-\\udfff]", LE = "(?:" + mu + "|" + bu + ")", K_ = "[^" + H_ + "]", Y_ = "(?:\\ud83c[\\udde6-\\uddff]){2}", Z_ = "[\\ud800-\\udbff][\\udc00-\\udfff]", CE = "\\u200d", X_ = LE + "?", V_ = "[" + IE + "]?", FE = "(?:" + CE + "(?:" + [K_, Y_, Z_].join("|") + ")" + V_ + X_ + ")*", NE = V_ + X_ + FE, zE = "(?:" + [K_ + mu + "?", mu, Y_, Z_, PE].join("|") + ")", Uc = RegExp(bu + "(?=" + bu + ")|" + zE + NE, "g");
function DE(t) {
  for (var e = Uc.lastIndex = 0; Uc.test(t); )
    ++e;
  return e;
}
function fn(t) {
  return un(t) ? DE(t) : EE(t);
}
var BE = Math.ceil;
function po(t, e) {
  e = e === void 0 ? " " : Ut(e);
  var r = e.length;
  if (r < 2)
    return r ? yu(e, t) : e;
  var n = yu(e, BE(t / fn(e)));
  return un(e) ? or(he(n), 0, t).join("") : n.slice(0, t);
}
var jE = Math.ceil, WE = Math.floor;
function J_(t, e, r) {
  t = D(t), e = T(e);
  var n = e ? fn(t) : 0;
  if (!e || n >= e)
    return t;
  var i = (e - n) / 2;
  return po(WE(i), r) + t + po(jE(i), r);
}
function Q_(t, e, r) {
  t = D(t), e = T(e);
  var n = e ? fn(t) : 0;
  return e && n < e ? t + po(e - n, r) : t;
}
function t0(t, e, r) {
  t = D(t), e = T(e);
  var n = e ? fn(t) : 0;
  return e && n < e ? po(e - n, r) + t : t;
}
var qE = /^\s+/, UE = lt.parseInt;
function e0(t, e, r) {
  return r || e == null ? e = 0 : e && (e = +e), UE(D(t).replace(qE, ""), e || 0);
}
var GE = 32, Oi = I(function(t, e) {
  var r = Xe(e, nn(Oi));
  return je(t, GE, void 0, e, r);
});
Oi.placeholder = {};
var kE = 64, ss = I(function(t, e) {
  var r = Xe(e, nn(ss));
  return je(t, kE, void 0, e, r);
});
ss.placeholder = {};
var r0 = Vo(function(t, e, r) {
  t[r ? 0 : 1].push(e);
}, function() {
  return [[], []];
});
function HE(t, e) {
  return N_(t, e, function(r, n) {
    return Xo(t, n);
  });
}
var n0 = Ge(function(t, e) {
  return t == null ? {} : HE(t, e);
});
function wu(t) {
  for (var e, r = this; r instanceof Co; ) {
    var n = ah(r);
    n.__index__ = 0, n.__values__ = void 0, e ? i.__wrapped__ = n : e = n;
    var i = n;
    r = r.__wrapped__;
  }
  return i.__wrapped__ = t, e;
}
function i0(t) {
  return function(e) {
    return t == null ? void 0 : Ar(t, e);
  };
}
function KE(t, e, r, n) {
  for (var i = r - 1, o = t.length; ++i < o; )
    if (n(t[i], e))
      return i;
  return -1;
}
var YE = Array.prototype, Gc = YE.splice;
function qa(t, e, r, n) {
  var i = n ? KE : rn, o = -1, s = e.length, u = t;
  for (t === e && (e = Ct(e)), r && (u = V(t, kt(r))); ++o < s; )
    for (var a = 0, f = e[o], c = r ? r(f) : f; (a = i(u, c, a, n)) > -1; )
      u !== t && Gc.call(u, a, 1), Gc.call(t, a, 1);
  return t;
}
function Ua(t, e) {
  return t && t.length && e && e.length ? qa(t, e) : t;
}
var o0 = I(Ua);
function s0(t, e, r) {
  return t && t.length && e && e.length ? qa(t, e, R(r)) : t;
}
function u0(t, e, r) {
  return t && t.length && e && e.length ? qa(t, e, void 0, r) : t;
}
var ZE = Array.prototype, XE = ZE.splice;
function a0(t, e) {
  for (var r = t ? e.length : 0, n = r - 1; r--; ) {
    var i = e[r];
    if (r == n || i !== o) {
      var o = i;
      Be(i) ? XE.call(t, i, 1) : Ba(t, i);
    }
  }
  return t;
}
var f0 = Ge(function(t, e) {
  var r = t == null ? 0 : t.length, n = Ju(t, e);
  return a0(t, V(e, function(i) {
    return Be(i, r) ? +i : i;
  }).sort(B_)), n;
}), VE = Math.floor, JE = Math.random;
function Ga(t, e) {
  return t + VE(JE() * (e - t + 1));
}
var QE = parseFloat, tR = Math.min, eR = Math.random;
function c0(t, e, r) {
  if (r && typeof r != "boolean" && Et(t, e, r) && (e = r = void 0), r === void 0 && (typeof e == "boolean" ? (r = e, e = void 0) : typeof t == "boolean" && (r = t, t = void 0)), t === void 0 && e === void 0 ? (t = 0, e = 1) : (t = ye(t), e === void 0 ? (e = t, t = 0) : e = ye(e)), t > e) {
    var n = t;
    t = e, e = n;
  }
  if (r || t % 1 || e % 1) {
    var i = eR();
    return tR(t + i * (e - t + QE("1e-" + ((i + "").length - 1))), e);
  }
  return Ga(t, e);
}
var rR = Math.ceil, nR = Math.max;
function iR(t, e, r, n) {
  for (var i = -1, o = nR(rR((e - t) / (r || 1)), 0), s = Array(o); o--; )
    s[n ? o : ++i] = t, t += r;
  return s;
}
function l0(t) {
  return function(e, r, n) {
    return n && typeof n != "number" && Et(e, r, n) && (r = n = void 0), e = ye(e), r === void 0 ? (r = e, e = 0) : r = ye(r), n = n === void 0 ? e < r ? 1 : -1 : ye(n), iR(e, r, n, t);
  };
}
var h0 = l0(), p0 = l0(!0), oR = 256, d0 = Ge(function(t, e) {
  return je(t, oR, void 0, void 0, void 0, e);
});
function _0(t, e, r, n, i) {
  return i(t, function(o, s, u) {
    r = n ? (n = !1, o) : e(r, o, s, u);
  }), r;
}
function g0(t, e, r) {
  var n = $(t) ? na : _0, i = arguments.length < 3;
  return n(t, R(e), r, i, ur);
}
function sR(t, e, r, n) {
  var i = t == null ? 0 : t.length;
  for (n && i && (r = t[--i]); i--; )
    r = e(r, t[i], i, t);
  return r;
}
function v0(t, e, r) {
  var n = $(t) ? sR : _0, i = arguments.length < 3;
  return n(t, R(e), r, i, Gp);
}
function y0(t, e) {
  var r = $(t) ? sr : Qp;
  return r(t, Si(R(e)));
}
function m0(t, e) {
  var r = [];
  if (!(t && t.length))
    return r;
  var n = -1, i = [], o = t.length;
  for (e = R(e); ++n < o; ) {
    var s = t[n];
    e(s, n, t) && (r.push(s), i.push(n));
  }
  return a0(t, i), r;
}
function b0(t, e, r) {
  return (r ? Et(t, e, r) : e === void 0) ? e = 1 : e = T(e), yu(D(t), e);
}
function w0() {
  var t = arguments, e = D(t[0]);
  return t.length < 3 ? e : e.replace(t[1], t[2]);
}
var uR = "Expected a function";
function A0(t, e) {
  if (typeof t != "function")
    throw new TypeError(uR);
  return e = e === void 0 ? e : T(e), I(t, e);
}
function S0(t, e, r) {
  e = nr(e, t);
  var n = -1, i = e.length;
  for (i || (i = 1, t = void 0); ++n < i; ) {
    var o = t?.[Se(e[n])];
    o === void 0 && (n = i, o = r), t = we(o) ? o.call(t) : o;
  }
  return t;
}
var aR = Array.prototype, fR = aR.reverse;
function _o(t) {
  return t == null ? t : fR.call(t);
}
var x0 = ua("round");
function O0(t) {
  var e = t.length;
  return e ? t[Ga(0, e - 1)] : void 0;
}
function cR(t) {
  return O0(xr(t));
}
function E0(t) {
  var e = $(t) ? O0 : cR;
  return e(t);
}
function us(t, e) {
  var r = -1, n = t.length, i = n - 1;
  for (e = e === void 0 ? n : e; ++r < e; ) {
    var o = Ga(r, i), s = t[o];
    t[o] = t[r], t[r] = s;
  }
  return t.length = e, t;
}
function lR(t, e) {
  return us(Ct(t), Sr(e, 0, t.length));
}
function hR(t, e) {
  var r = xr(t);
  return us(r, Sr(e, 0, r.length));
}
function R0(t, e, r) {
  (r ? Et(t, e, r) : e === void 0) ? e = 1 : e = T(e);
  var n = $(t) ? lR : hR;
  return n(t, e);
}
function $0(t, e, r) {
  return t == null ? t : xi(t, e, r);
}
function T0(t, e, r, n) {
  return n = typeof n == "function" ? n : void 0, t == null ? t : xi(t, e, r, n);
}
function pR(t) {
  return us(Ct(t));
}
function dR(t) {
  return us(xr(t));
}
function M0(t) {
  var e = $(t) ? pR : dR;
  return e(t);
}
var _R = "[object Map]", gR = "[object Set]";
function I0(t) {
  if (t == null)
    return 0;
  if (Mt(t))
    return wi(t) ? fn(t) : t.length;
  var e = me(t);
  return e == _R || e == gR ? t.size : Xu(t).length;
}
function P0(t, e, r) {
  var n = t == null ? 0 : t.length;
  return n ? (r && typeof r != "number" && Et(t, e, r) ? (e = 0, r = n) : (e = e == null ? 0 : T(e), r = r === void 0 ? n : T(r)), ne(t, e, r)) : [];
}
var L0 = an(function(t, e, r) {
  return t + (r ? "_" : "") + e.toLowerCase();
});
function vR(t, e) {
  var r;
  return ur(t, function(n, i, o) {
    return r = e(n, i, o), !r;
  }), !!r;
}
function C0(t, e, r) {
  var n = $(t) ? da : vR;
  return r && Et(t, e, r) && (e = void 0), n(t, R(e));
}
var F0 = I(function(t, e) {
  if (t == null)
    return [];
  var r = e.length;
  return r > 1 && Et(t, e[0], e[1]) ? e = [] : r > 2 && Et(e[0], e[1], e[2]) && (e = [e[0]]), j_(t, dt(e, 1), []);
}), yR = 4294967295, mR = yR - 1, bR = Math.floor, wR = Math.min;
function ka(t, e, r, n) {
  var i = 0, o = t == null ? 0 : t.length;
  if (o === 0)
    return 0;
  e = r(e);
  for (var s = e !== e, u = e === null, a = Ft(e), f = e === void 0; i < o; ) {
    var c = bR((i + o) / 2), l = r(t[c]), p = l !== void 0, d = l === null, _ = l === l, g = Ft(l);
    if (s)
      var v = n || _;
    else f ? v = _ && (n || p) : u ? v = _ && p && (n || !d) : a ? v = _ && p && !d && (n || !g) : d || g ? v = !1 : v = n ? l <= e : l < e;
    v ? i = c + 1 : o = c;
  }
  return wR(o, mR);
}
var AR = 4294967295, SR = AR >>> 1;
function as(t, e, r) {
  var n = 0, i = t == null ? n : t.length;
  if (typeof e == "number" && e === e && i <= SR) {
    for (; n < i; ) {
      var o = n + i >>> 1, s = t[o];
      s !== null && !Ft(s) && (r ? s <= e : s < e) ? n = o + 1 : i = o;
    }
    return i;
  }
  return ka(t, e, Tt, r);
}
function N0(t, e) {
  return as(t, e);
}
function z0(t, e, r) {
  return ka(t, e, R(r));
}
function D0(t, e) {
  var r = t == null ? 0 : t.length;
  if (r) {
    var n = as(t, e);
    if (n < r && oe(t[n], e))
      return n;
  }
  return -1;
}
function B0(t, e) {
  return as(t, e, !0);
}
function j0(t, e, r) {
  return ka(t, e, R(r), !0);
}
function W0(t, e) {
  var r = t == null ? 0 : t.length;
  if (r) {
    var n = as(t, e, !0) - 1;
    if (oe(t[n], e))
      return n;
  }
  return -1;
}
function q0(t, e) {
  for (var r = -1, n = t.length, i = 0, o = []; ++r < n; ) {
    var s = t[r], u = e ? e(s) : s;
    if (!r || !oe(u, a)) {
      var a = u;
      o[i++] = s === 0 ? 0 : s;
    }
  }
  return o;
}
function U0(t) {
  return t && t.length ? q0(t) : [];
}
function G0(t, e) {
  return t && t.length ? q0(t, R(e)) : [];
}
var xR = 4294967295;
function k0(t, e, r) {
  return r && typeof r != "number" && Et(t, e, r) && (e = r = void 0), r = r === void 0 ? xR : r >>> 0, r ? (t = D(t), t && (typeof e == "string" || e != null && !is(e)) && (e = Ut(e), !e && un(t)) ? or(he(t), 0, r) : t.split(e, r)) : [];
}
var OR = "Expected a function", ER = Math.max;
function H0(t, e) {
  if (typeof t != "function")
    throw new TypeError(OR);
  return e = e == null ? 0 : ER(T(e), 0), I(function(r) {
    var n = r[e], i = or(r, 0, e);
    return n && ir(i, n), Gt(t, this, i);
  });
}
var K0 = an(function(t, e, r) {
  return t + (r ? " " : "") + Ko(e);
});
function Y0(t, e, r) {
  return t = D(t), r = r == null ? 0 : Sr(T(r), 0, t.length), e = Ut(e), t.slice(r, r + e.length) == e;
}
function Z0() {
  return {};
}
function X0() {
  return "";
}
function V0() {
  return !0;
}
var J0 = Lo(function(t, e) {
  return t - e;
}, 0);
function Q0(t) {
  return t && t.length ? za(t, Tt) : 0;
}
function tg(t, e) {
  return t && t.length ? za(t, R(e)) : 0;
}
function eg(t) {
  var e = t == null ? 0 : t.length;
  return e ? ne(t, 1, e) : [];
}
function rg(t, e, r) {
  return t && t.length ? (e = r || e === void 0 ? 1 : T(e), ne(t, 0, e < 0 ? 0 : e)) : [];
}
function ng(t, e, r) {
  var n = t == null ? 0 : t.length;
  return n ? (e = r || e === void 0 ? 1 : T(e), e = n - e, ne(t, e < 0 ? 0 : e, n)) : [];
}
function ig(t, e) {
  return t && t.length ? es(t, R(e), !1, !0) : [];
}
function og(t, e) {
  return t && t.length ? es(t, R(e)) : [];
}
function sg(t, e) {
  return e(t), t;
}
var ug = Object.prototype, RR = ug.hasOwnProperty;
function kc(t, e, r, n) {
  return t === void 0 || oe(t, ug[r]) && !RR.call(n, r) ? e : t;
}
var $R = {
  "\\": "\\",
  "'": "'",
  "\n": "n",
  "\r": "r",
  "\u2028": "u2028",
  "\u2029": "u2029"
};
function TR(t) {
  return "\\" + $R[t];
}
var ag = /<%=([\s\S]+?)%>/g, MR = /<%-([\s\S]+?)%>/g, IR = /<%([\s\S]+?)%>/g, go = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  escape: MR,
  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  evaluate: IR,
  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  interpolate: ag,
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
    _: { escape: Ea }
  }
}, PR = "Invalid `variable` option passed into `_.template`", LR = /\b__p \+= '';/g, CR = /\b(__p \+=) '' \+/g, FR = /(__e\(.*?\)|\b__t\)) \+\n'';/g, NR = /[()=,{}\[\]\/\s]/, zR = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Ki = /($^)/, DR = /['\n\r\u2028\u2029\\]/g, BR = Object.prototype, Hc = BR.hasOwnProperty;
function fg(t, e, r) {
  var n = go.imports._.templateSettings || go;
  r && Et(t, e, r) && (e = void 0), t = D(t), e = kn({}, e, n, kc);
  var i = kn({}, e.imports, n.imports, kc), o = ot(i), s = Ia(i, o), u, a, f = 0, c = e.interpolate || Ki, l = "__p += '", p = RegExp(
    (e.escape || Ki).source + "|" + c.source + "|" + (c === ag ? zR : Ki).source + "|" + (e.evaluate || Ki).source + "|$",
    "g"
  ), d = Hc.call(e, "sourceURL") ? "//# sourceURL=" + (e.sourceURL + "").replace(/\s/g, " ") + `
` : "";
  t.replace(p, function(v, y, m, w, b, A) {
    return m || (m = w), l += t.slice(f, A).replace(DR, TR), y && (u = !0, l += `' +
__e(` + y + `) +
'`), b && (a = !0, l += `';
` + b + `;
__p += '`), m && (l += `' +
((__t = (` + m + `)) == null ? '' : __t) +
'`), f = A + v.length, v;
  }), l += `';
`;
  var _ = Hc.call(e, "variable") && e.variable;
  if (!_)
    l = `with (obj) {
` + l + `
}
`;
  else if (NR.test(_))
    throw new Error(PR);
  l = (a ? l.replace(LR, "") : l).replace(CR, "$1").replace(FR, "$1;"), l = "function(" + (_ || "obj") + `) {
` + (_ ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (u ? ", __e = _.escape" : "") + (a ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + l + `return __p
}`;
  var g = ta(function() {
    return Function(o, d + "return " + l).apply(void 0, s);
  });
  if (g.source = l, ko(g))
    throw g;
  return g;
}
var jR = "Expected a function";
function cg(t, e, r) {
  var n = !0, i = !0;
  if (typeof t != "function")
    throw new TypeError(jR);
  return J(r) && (n = "leading" in r ? !!r.leading : n, i = "trailing" in r ? !!r.trailing : i), wa(t, e, {
    leading: n,
    maxWait: e,
    trailing: i
  });
}
function Ei(t, e) {
  return e(t);
}
var WR = 9007199254740991, Bs = 4294967295, qR = Math.min;
function lg(t, e) {
  if (t = T(t), t < 1 || t > WR)
    return [];
  var r = Bs, n = qR(t, Bs);
  e = Oe(e), t -= Bs;
  for (var i = Zu(n, e); ++r < t; )
    e(r);
  return i;
}
function Au() {
  return this;
}
function hg(t, e) {
  var r = t;
  return r instanceof P && (r = r.value()), na(e, function(n, i) {
    return i.func.apply(i.thisArg, ir([n], i.args));
  }, r);
}
function Rn() {
  return hg(this.__wrapped__, this.__actions__);
}
function pg(t) {
  return D(t).toLowerCase();
}
function dg(t) {
  return $(t) ? V(t, Se) : Ft(t) ? [t] : Ct(Ah(D(t)));
}
var Kc = 9007199254740991;
function _g(t) {
  return t ? Sr(T(t), -Kc, Kc) : t === 0 ? t : 0;
}
function gg(t) {
  return D(t).toUpperCase();
}
function vg(t, e, r) {
  var n = $(t), i = n || Ne(t) || wr(t);
  if (e = R(e), r == null) {
    var o = t && t.constructor;
    i ? r = n ? new o() : [] : J(t) ? r = we(o) ? en(Go(t)) : {} : r = {};
  }
  return (i ? ie : xe)(t, function(s, u, a) {
    return e(r, s, u, a);
  }), r;
}
function yg(t, e) {
  for (var r = t.length; r-- && rn(e, t[r], 0) > -1; )
    ;
  return r;
}
function mg(t, e) {
  for (var r = -1, n = t.length; ++r < n && rn(e, t[r], 0) > -1; )
    ;
  return r;
}
function bg(t, e, r) {
  if (t = D(t), t && (r || e === void 0))
    return rh(t);
  if (!t || !(e = Ut(e)))
    return t;
  var n = he(t), i = he(e), o = mg(n, i), s = yg(n, i) + 1;
  return or(n, o, s).join("");
}
function wg(t, e, r) {
  if (t = D(t), t && (r || e === void 0))
    return t.slice(0, eh(t) + 1);
  if (!t || !(e = Ut(e)))
    return t;
  var n = he(t), i = yg(n, he(e)) + 1;
  return or(n, 0, i).join("");
}
var UR = /^\s+/;
function Ag(t, e, r) {
  if (t = D(t), t && (r || e === void 0))
    return t.replace(UR, "");
  if (!t || !(e = Ut(e)))
    return t;
  var n = he(t), i = mg(n, he(e));
  return or(n, i).join("");
}
var GR = 30, kR = "...", HR = /\w*$/;
function Sg(t, e) {
  var r = GR, n = kR;
  if (J(e)) {
    var i = "separator" in e ? e.separator : i;
    r = "length" in e ? T(e.length) : r, n = "omission" in e ? Ut(e.omission) : n;
  }
  t = D(t);
  var o = t.length;
  if (un(t)) {
    var s = he(t);
    o = s.length;
  }
  if (r >= o)
    return t;
  var u = r - fn(n);
  if (u < 1)
    return n;
  var a = s ? or(s, 0, u).join("") : t.slice(0, u);
  if (i === void 0)
    return a + n;
  if (s && (u += a.length - u), is(i)) {
    if (t.slice(u).search(i)) {
      var f, c = a;
      for (i.global || (i = RegExp(i.source, D(HR.exec(i)) + "g")), i.lastIndex = 0; f = i.exec(c); )
        var l = f.index;
      a = a.slice(0, l === void 0 ? u : l);
    }
  } else if (t.indexOf(Ut(i), u) != u) {
    var p = a.lastIndexOf(i);
    p > -1 && (a = a.slice(0, p));
  }
  return a + n;
}
function xg(t) {
  return Yu(t, 1);
}
var KR = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
}, YR = ia(KR), Og = /&(?:amp|lt|gt|quot|#39);/g, ZR = RegExp(Og.source);
function Eg(t) {
  return t = D(t), t && ZR.test(t) ? t.replace(Og, YR) : t;
}
var XR = 1 / 0, VR = Nr && 1 / Zo(new Nr([, -0]))[1] == XR ? function(t) {
  return new Nr(t);
} : Fo, JR = 200;
function Je(t, e, r) {
  var n = -1, i = Do, o = t.length, s = !0, u = [], a = u;
  if (r)
    s = !1, i = xa;
  else if (o >= JR) {
    var f = e ? null : VR(t);
    if (f)
      return Zo(f);
    s = !1, i = Yn, a = new _r();
  } else
    a = e ? [] : u;
  t:
    for (; ++n < o; ) {
      var c = t[n], l = e ? e(c) : c;
      if (c = r || c !== 0 ? c : 0, s && l === l) {
        for (var p = a.length; p--; )
          if (a[p] === l)
            continue t;
        e && a.push(l), u.push(c);
      } else i(a, l, r) || (a !== u && a.push(l), u.push(c));
    }
  return u;
}
var Rg = I(function(t) {
  return Je(dt(t, 1, tt, !0));
}), $g = I(function(t) {
  var e = Ht(t);
  return tt(e) && (e = void 0), Je(dt(t, 1, tt, !0), R(e));
}), Tg = I(function(t) {
  var e = Ht(t);
  return e = typeof e == "function" ? e : void 0, Je(dt(t, 1, tt, !0), void 0, e);
});
function Mg(t) {
  return t && t.length ? Je(t) : [];
}
function Ig(t, e) {
  return t && t.length ? Je(t, R(e)) : [];
}
function Pg(t, e) {
  return e = typeof e == "function" ? e : void 0, t && t.length ? Je(t, void 0, e) : [];
}
var QR = 0;
function Lg(t) {
  var e = ++QR;
  return D(t) + e;
}
function Cg(t, e) {
  return t == null ? !0 : Ba(t, e);
}
var t$ = Math.max;
function fs(t) {
  if (!(t && t.length))
    return [];
  var e = 0;
  return t = sr(t, function(r) {
    if (tt(r))
      return e = t$(r.length, e), !0;
  }), Zu(e, function(r) {
    return V(t, ya(r));
  });
}
function Ha(t, e) {
  if (!(t && t.length))
    return [];
  var r = fs(t);
  return e == null ? r : V(r, function(n) {
    return Gt(e, void 0, n);
  });
}
function Fg(t, e, r, n) {
  return xi(t, e, r(Ar(t, e)), n);
}
function Ng(t, e, r) {
  return t == null ? t : Fg(t, e, Oe(r));
}
function zg(t, e, r, n) {
  return n = typeof n == "function" ? n : void 0, t == null ? t : Fg(t, e, Oe(r), n);
}
var Dg = an(function(t, e, r) {
  return t + (r ? " " : "") + e.toUpperCase();
});
function Bg(t) {
  return t == null ? [] : Ia(t, It(t));
}
var jg = I(function(t, e) {
  return tt(t) ? mi(t, e) : [];
});
function Wg(t, e) {
  return Oi(Oe(e), t);
}
var qg = Ge(function(t) {
  var e = t.length, r = e ? t[0] : 0, n = this.__wrapped__, i = function(o) {
    return Ju(o, t);
  };
  return e > 1 || this.__actions__.length || !(n instanceof P) || !Be(r) ? this.thru(i) : (n = n.slice(r, +r + (e ? 1 : 0)), n.__actions__.push({
    func: Ei,
    args: [i],
    thisArg: void 0
  }), new ee(n, this.__chain__).thru(function(o) {
    return e && !o.length && o.push(void 0), o;
  }));
});
function Ug() {
  return aa(this);
}
function Gg() {
  var t = this.__wrapped__;
  if (t instanceof P) {
    var e = t;
    return this.__actions__.length && (e = new P(this)), e = e.reverse(), e.__actions__.push({
      func: Ei,
      args: [_o],
      thisArg: void 0
    }), new ee(e, this.__chain__);
  }
  return this.thru(_o);
}
function Ka(t, e, r) {
  var n = t.length;
  if (n < 2)
    return n ? Je(t[0]) : [];
  for (var i = -1, o = Array(n); ++i < n; )
    for (var s = t[i], u = -1; ++u < n; )
      u != i && (o[i] = mi(o[i] || s, t[u], e, r));
  return Je(dt(o, 1), e, r);
}
var kg = I(function(t) {
  return Ka(sr(t, tt));
}), Hg = I(function(t) {
  var e = Ht(t);
  return tt(e) && (e = void 0), Ka(sr(t, tt), R(e));
}), Kg = I(function(t) {
  var e = Ht(t);
  return e = typeof e == "function" ? e : void 0, Ka(sr(t, tt), void 0, e);
}), Yg = I(fs);
function Zg(t, e, r) {
  for (var n = -1, i = t.length, o = e.length, s = {}; ++n < i; ) {
    var u = n < o ? e[n] : void 0;
    r(s, t[n], u);
  }
  return s;
}
function Xg(t, e) {
  return Zg(t || [], e || [], pi);
}
function Vg(t, e) {
  return Zg(t || [], e || [], xi);
}
var Jg = I(function(t) {
  var e = t.length, r = e > 1 ? t[e - 1] : void 0;
  return r = typeof r == "function" ? (t.pop(), r) : void 0, Ha(t, r);
});
const S = {
  chunk: Zh,
  compact: lp,
  concat: hp,
  difference: Fp,
  differenceBy: Np,
  differenceWith: zp,
  drop: Bp,
  dropRight: jp,
  dropRightWhile: Wp,
  dropWhile: qp,
  fill: Jp,
  findIndex: $a,
  findLastIndex: Ta,
  flatten: Qu,
  flattenDeep: ld,
  flattenDepth: hd,
  fromPairs: Ad,
  head: gu,
  indexOf: Id,
  initial: Pd,
  intersection: Ld,
  intersectionBy: Cd,
  intersectionWith: Fd,
  join: a_,
  lastIndexOf: l_,
  nth: L_,
  pull: o0,
  pullAll: Ua,
  pullAllBy: s0,
  pullAllWith: u0,
  pullAt: f0,
  remove: m0,
  reverse: _o,
  slice: P0,
  sortedIndex: N0,
  sortedIndexBy: z0,
  sortedIndexOf: D0,
  sortedLastIndex: B0,
  sortedLastIndexBy: j0,
  sortedLastIndexOf: W0,
  sortedUniq: U0,
  sortedUniqBy: G0,
  tail: eg,
  take: rg,
  takeRight: ng,
  takeRightWhile: ig,
  takeWhile: og,
  union: Rg,
  unionBy: $g,
  unionWith: Tg,
  uniq: Mg,
  uniqBy: Ig,
  uniqWith: Pg,
  unzip: fs,
  unzipWith: Ha,
  without: jg,
  xor: kg,
  xorBy: Hg,
  xorWith: Kg,
  zip: Yg,
  zipObject: Xg,
  zipObjectDeep: Vg,
  zipWith: Jg
}, q = {
  countBy: Op,
  every: Vp,
  filter: td,
  find: rd,
  findLast: od,
  flatMap: ad,
  flatMapDeep: fd,
  flatMapDepth: cd,
  forEach: hu,
  forEachRight: pu,
  groupBy: Od,
  includes: Md,
  invokeMap: qd,
  keyBy: c_,
  map: bi,
  orderBy: W_,
  partition: r0,
  reduce: g0,
  reduceRight: v0,
  reject: y0,
  sample: E0,
  sampleSize: R0,
  shuffle: M0,
  size: I0,
  some: C0,
  sortBy: F0
}, e$ = {
  now: Pn
}, et = {
  after: nh,
  ary: Yu,
  before: ea,
  bind: vi,
  bindKey: Ho,
  curry: Jo,
  curryRight: Qo,
  debounce: wa,
  defer: Lp,
  delay: Cp,
  flip: pd,
  memoize: gi,
  once: D_,
  overArgs: U_,
  partial: Oi,
  partialRight: ss,
  rearg: d0,
  rest: A0,
  spread: H0,
  throttle: cg,
  unary: xg,
  wrap: Wg
}, O = {
  castArray: Kh,
  clone: up,
  cloneDeep: ap,
  cloneDeepWith: fp,
  cloneWith: cp,
  conformsTo: Ap,
  eq: oe,
  gt: Ed,
  gte: Rd,
  isArguments: Ve,
  isArrayBuffer: Ud,
  isArrayLike: Mt,
  isArrayLikeObject: tt,
  isBoolean: Gd,
  isBuffer: Ne,
  isDate: kd,
  isElement: Hd,
  isEmpty: Kd,
  isEqual: Yd,
  isEqualWith: Zd,
  isError: ko,
  isFinite: Xd,
  isFunction: we,
  isInteger: Ca,
  isLength: di,
  isMap: ha,
  isMatch: Vd,
  isMatchWith: Jd,
  isNaN: Qd,
  isNative: t_,
  isNil: e_,
  isNull: r_,
  isNumber: Fa,
  isObjectLike: Q,
  isPlainObject: sn,
  isRegExp: is,
  isSafeInteger: n_,
  isSet: pa,
  isString: wi,
  isSymbol: Ft,
  isTypedArray: wr,
  isUndefined: i_,
  isWeakMap: o_,
  isWeakSet: s_,
  lt: d_,
  lte: __,
  toArray: Da,
  toFinite: ye,
  toLength: Ra,
  toNumber: Wt,
  toPlainObject: Aa,
  toSafeInteger: _g,
  toString: D
}, Pt = {
  add: th,
  ceil: Yh,
  divide: Dp,
  floor: dd,
  max: b_,
  maxBy: w_,
  mean: S_,
  meanBy: x_,
  min: $_,
  minBy: T_,
  multiply: I_,
  round: x0,
  subtract: J0,
  sum: Q0,
  sumBy: tg
}, Ya = {
  clamp: Xh,
  inRange: Td,
  random: c0
}, E = {
  assign: bh,
  assignIn: nu,
  assignInWith: kn,
  assignWith: wh,
  at: Sh,
  create: Ep,
  defaults: Tp,
  defaultsDeep: Ip,
  findKey: id,
  findLastKey: sd,
  forIn: yd,
  forInRight: md,
  forOwn: bd,
  forOwnRight: wd,
  functions: Sd,
  functionsIn: xd,
  get: Uo,
  has: $d,
  hasIn: Xo,
  invert: zd,
  invertBy: Bd,
  invoke: Wd,
  keysIn: It,
  mapKeys: g_,
  mapValues: v_,
  merge: O_,
  mergeWith: Sa,
  omit: F_,
  omitBy: z_,
  pick: n0,
  pickBy: ja,
  result: S0,
  set: $0,
  setWith: T0,
  toPairs: du,
  toPairsIn: _u,
  transform: vg,
  unset: Cg,
  update: Ng,
  updateWith: zg,
  values: xr,
  valuesIn: Bg
}, Ee = {
  at: qg,
  chain: aa,
  commit: fu,
  next: vu,
  plant: wu,
  reverse: Gg,
  tap: sg,
  toIterator: Au,
  value: Rn,
  wrapperChain: Ug
}, B = {
  camelCase: Hh,
  capitalize: ra,
  deburr: oa,
  endsWith: kp,
  escape: Ea,
  escapeRegExp: Zp,
  kebabCase: f_,
  lowerCase: h_,
  lowerFirst: p_,
  pad: J_,
  padEnd: Q_,
  padStart: t0,
  parseInt: e0,
  repeat: b0,
  replace: w0,
  snakeCase: L0,
  split: k0,
  startCase: K0,
  startsWith: Y0,
  template: fg,
  templateSettings: go,
  toLower: pg,
  toUpper: gg,
  trim: bg,
  trimEnd: wg,
  trimStart: Ag,
  truncate: Sg,
  unescape: Eg,
  upperCase: Dg,
  upperFirst: Ko,
  words: sa
}, W = {
  attempt: ta,
  bindAll: Oh,
  cond: mp,
  conforms: wp,
  constant: No,
  defaultTo: Rp,
  flow: gd,
  flowRight: vd,
  iteratee: u_,
  matches: y_,
  matchesProperty: m_,
  method: E_,
  methodOf: R_,
  noop: Fo,
  nthArg: C_,
  over: q_,
  overEvery: G_,
  overSome: k_,
  property: ma,
  propertyOf: i0,
  range: h0,
  rangeRight: p0,
  stubArray: Yo,
  stubFalse: jo,
  stubObject: Z0,
  stubString: X0,
  stubTrue: V0,
  times: lg,
  toPath: dg,
  uniqueId: Lg
};
function r$() {
  var t = new P(this.__wrapped__);
  return t.__actions__ = Ct(this.__actions__), t.__dir__ = this.__dir__, t.__filtered__ = this.__filtered__, t.__iteratees__ = Ct(this.__iteratees__), t.__takeCount__ = this.__takeCount__, t.__views__ = Ct(this.__views__), t;
}
function n$() {
  if (this.__filtered__) {
    var t = new P(this);
    t.__dir__ = -1, t.__filtered__ = !0;
  } else
    t = this.clone(), t.__dir__ *= -1;
  return t;
}
var i$ = Math.max, o$ = Math.min;
function s$(t, e, r) {
  for (var n = -1, i = r.length; ++n < i; ) {
    var o = r[n], s = o.size;
    switch (o.type) {
      case "drop":
        t += s;
        break;
      case "dropRight":
        e -= s;
        break;
      case "take":
        e = o$(e, t + s);
        break;
      case "takeRight":
        t = i$(t, e - s);
        break;
    }
  }
  return { start: t, end: e };
}
var u$ = 1, a$ = 2, f$ = Math.min;
function c$() {
  var t = this.__wrapped__.value(), e = this.__dir__, r = $(t), n = e < 0, i = r ? t.length : 0, o = s$(0, i, this.__views__), s = o.start, u = o.end, a = u - s, f = n ? u : s - 1, c = this.__iteratees__, l = c.length, p = 0, d = f$(a, this.__takeCount__);
  if (!r || !n && i == a && d == a)
    return hg(t, this.__actions__);
  var _ = [];
  t:
    for (; a-- && p < d; ) {
      f += e;
      for (var g = -1, v = t[f]; ++g < l; ) {
        var y = c[g], m = y.iteratee, w = y.type, b = m(v);
        if (w == a$)
          v = b;
        else if (!b) {
          if (w == u$)
            continue t;
          break t;
        }
      }
      _[p++] = v;
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
var l$ = "4.17.21", h$ = 2, p$ = 1, d$ = 3, Qg = 4294967295, _$ = Array.prototype, g$ = Object.prototype, tv = g$.hasOwnProperty, Yc = vt ? vt.iterator : void 0, v$ = Math.max, Zc = Math.min, Za = /* @__PURE__ */ function(t) {
  return function(e, r, n) {
    if (n == null) {
      var i = J(r), o = i && ot(r), s = o && o.length && rs(r, o);
      (s ? s.length : i) || (n = r, r = e, e = this);
    }
    return t(e, r, n);
  };
}(M_);
h.after = et.after;
h.ary = et.ary;
h.assign = E.assign;
h.assignIn = E.assignIn;
h.assignInWith = E.assignInWith;
h.assignWith = E.assignWith;
h.at = E.at;
h.before = et.before;
h.bind = et.bind;
h.bindAll = W.bindAll;
h.bindKey = et.bindKey;
h.castArray = O.castArray;
h.chain = Ee.chain;
h.chunk = S.chunk;
h.compact = S.compact;
h.concat = S.concat;
h.cond = W.cond;
h.conforms = W.conforms;
h.constant = W.constant;
h.countBy = q.countBy;
h.create = E.create;
h.curry = et.curry;
h.curryRight = et.curryRight;
h.debounce = et.debounce;
h.defaults = E.defaults;
h.defaultsDeep = E.defaultsDeep;
h.defer = et.defer;
h.delay = et.delay;
h.difference = S.difference;
h.differenceBy = S.differenceBy;
h.differenceWith = S.differenceWith;
h.drop = S.drop;
h.dropRight = S.dropRight;
h.dropRightWhile = S.dropRightWhile;
h.dropWhile = S.dropWhile;
h.fill = S.fill;
h.filter = q.filter;
h.flatMap = q.flatMap;
h.flatMapDeep = q.flatMapDeep;
h.flatMapDepth = q.flatMapDepth;
h.flatten = S.flatten;
h.flattenDeep = S.flattenDeep;
h.flattenDepth = S.flattenDepth;
h.flip = et.flip;
h.flow = W.flow;
h.flowRight = W.flowRight;
h.fromPairs = S.fromPairs;
h.functions = E.functions;
h.functionsIn = E.functionsIn;
h.groupBy = q.groupBy;
h.initial = S.initial;
h.intersection = S.intersection;
h.intersectionBy = S.intersectionBy;
h.intersectionWith = S.intersectionWith;
h.invert = E.invert;
h.invertBy = E.invertBy;
h.invokeMap = q.invokeMap;
h.iteratee = W.iteratee;
h.keyBy = q.keyBy;
h.keys = ot;
h.keysIn = E.keysIn;
h.map = q.map;
h.mapKeys = E.mapKeys;
h.mapValues = E.mapValues;
h.matches = W.matches;
h.matchesProperty = W.matchesProperty;
h.memoize = et.memoize;
h.merge = E.merge;
h.mergeWith = E.mergeWith;
h.method = W.method;
h.methodOf = W.methodOf;
h.mixin = Za;
h.negate = Si;
h.nthArg = W.nthArg;
h.omit = E.omit;
h.omitBy = E.omitBy;
h.once = et.once;
h.orderBy = q.orderBy;
h.over = W.over;
h.overArgs = et.overArgs;
h.overEvery = W.overEvery;
h.overSome = W.overSome;
h.partial = et.partial;
h.partialRight = et.partialRight;
h.partition = q.partition;
h.pick = E.pick;
h.pickBy = E.pickBy;
h.property = W.property;
h.propertyOf = W.propertyOf;
h.pull = S.pull;
h.pullAll = S.pullAll;
h.pullAllBy = S.pullAllBy;
h.pullAllWith = S.pullAllWith;
h.pullAt = S.pullAt;
h.range = W.range;
h.rangeRight = W.rangeRight;
h.rearg = et.rearg;
h.reject = q.reject;
h.remove = S.remove;
h.rest = et.rest;
h.reverse = S.reverse;
h.sampleSize = q.sampleSize;
h.set = E.set;
h.setWith = E.setWith;
h.shuffle = q.shuffle;
h.slice = S.slice;
h.sortBy = q.sortBy;
h.sortedUniq = S.sortedUniq;
h.sortedUniqBy = S.sortedUniqBy;
h.split = B.split;
h.spread = et.spread;
h.tail = S.tail;
h.take = S.take;
h.takeRight = S.takeRight;
h.takeRightWhile = S.takeRightWhile;
h.takeWhile = S.takeWhile;
h.tap = Ee.tap;
h.throttle = et.throttle;
h.thru = Ei;
h.toArray = O.toArray;
h.toPairs = E.toPairs;
h.toPairsIn = E.toPairsIn;
h.toPath = W.toPath;
h.toPlainObject = O.toPlainObject;
h.transform = E.transform;
h.unary = et.unary;
h.union = S.union;
h.unionBy = S.unionBy;
h.unionWith = S.unionWith;
h.uniq = S.uniq;
h.uniqBy = S.uniqBy;
h.uniqWith = S.uniqWith;
h.unset = E.unset;
h.unzip = S.unzip;
h.unzipWith = S.unzipWith;
h.update = E.update;
h.updateWith = E.updateWith;
h.values = E.values;
h.valuesIn = E.valuesIn;
h.without = S.without;
h.words = B.words;
h.wrap = et.wrap;
h.xor = S.xor;
h.xorBy = S.xorBy;
h.xorWith = S.xorWith;
h.zip = S.zip;
h.zipObject = S.zipObject;
h.zipObjectDeep = S.zipObjectDeep;
h.zipWith = S.zipWith;
h.entries = E.toPairs;
h.entriesIn = E.toPairsIn;
h.extend = E.assignIn;
h.extendWith = E.assignInWith;
Za(h, h);
h.add = Pt.add;
h.attempt = W.attempt;
h.camelCase = B.camelCase;
h.capitalize = B.capitalize;
h.ceil = Pt.ceil;
h.clamp = Ya.clamp;
h.clone = O.clone;
h.cloneDeep = O.cloneDeep;
h.cloneDeepWith = O.cloneDeepWith;
h.cloneWith = O.cloneWith;
h.conformsTo = O.conformsTo;
h.deburr = B.deburr;
h.defaultTo = W.defaultTo;
h.divide = Pt.divide;
h.endsWith = B.endsWith;
h.eq = O.eq;
h.escape = B.escape;
h.escapeRegExp = B.escapeRegExp;
h.every = q.every;
h.find = q.find;
h.findIndex = S.findIndex;
h.findKey = E.findKey;
h.findLast = q.findLast;
h.findLastIndex = S.findLastIndex;
h.findLastKey = E.findLastKey;
h.floor = Pt.floor;
h.forEach = q.forEach;
h.forEachRight = q.forEachRight;
h.forIn = E.forIn;
h.forInRight = E.forInRight;
h.forOwn = E.forOwn;
h.forOwnRight = E.forOwnRight;
h.get = E.get;
h.gt = O.gt;
h.gte = O.gte;
h.has = E.has;
h.hasIn = E.hasIn;
h.head = S.head;
h.identity = Tt;
h.includes = q.includes;
h.indexOf = S.indexOf;
h.inRange = Ya.inRange;
h.invoke = E.invoke;
h.isArguments = O.isArguments;
h.isArray = $;
h.isArrayBuffer = O.isArrayBuffer;
h.isArrayLike = O.isArrayLike;
h.isArrayLikeObject = O.isArrayLikeObject;
h.isBoolean = O.isBoolean;
h.isBuffer = O.isBuffer;
h.isDate = O.isDate;
h.isElement = O.isElement;
h.isEmpty = O.isEmpty;
h.isEqual = O.isEqual;
h.isEqualWith = O.isEqualWith;
h.isError = O.isError;
h.isFinite = O.isFinite;
h.isFunction = O.isFunction;
h.isInteger = O.isInteger;
h.isLength = O.isLength;
h.isMap = O.isMap;
h.isMatch = O.isMatch;
h.isMatchWith = O.isMatchWith;
h.isNaN = O.isNaN;
h.isNative = O.isNative;
h.isNil = O.isNil;
h.isNull = O.isNull;
h.isNumber = O.isNumber;
h.isObject = J;
h.isObjectLike = O.isObjectLike;
h.isPlainObject = O.isPlainObject;
h.isRegExp = O.isRegExp;
h.isSafeInteger = O.isSafeInteger;
h.isSet = O.isSet;
h.isString = O.isString;
h.isSymbol = O.isSymbol;
h.isTypedArray = O.isTypedArray;
h.isUndefined = O.isUndefined;
h.isWeakMap = O.isWeakMap;
h.isWeakSet = O.isWeakSet;
h.join = S.join;
h.kebabCase = B.kebabCase;
h.last = Ht;
h.lastIndexOf = S.lastIndexOf;
h.lowerCase = B.lowerCase;
h.lowerFirst = B.lowerFirst;
h.lt = O.lt;
h.lte = O.lte;
h.max = Pt.max;
h.maxBy = Pt.maxBy;
h.mean = Pt.mean;
h.meanBy = Pt.meanBy;
h.min = Pt.min;
h.minBy = Pt.minBy;
h.stubArray = W.stubArray;
h.stubFalse = W.stubFalse;
h.stubObject = W.stubObject;
h.stubString = W.stubString;
h.stubTrue = W.stubTrue;
h.multiply = Pt.multiply;
h.nth = S.nth;
h.noop = W.noop;
h.now = e$.now;
h.pad = B.pad;
h.padEnd = B.padEnd;
h.padStart = B.padStart;
h.parseInt = B.parseInt;
h.random = Ya.random;
h.reduce = q.reduce;
h.reduceRight = q.reduceRight;
h.repeat = B.repeat;
h.replace = B.replace;
h.result = E.result;
h.round = Pt.round;
h.sample = q.sample;
h.size = q.size;
h.snakeCase = B.snakeCase;
h.some = q.some;
h.sortedIndex = S.sortedIndex;
h.sortedIndexBy = S.sortedIndexBy;
h.sortedIndexOf = S.sortedIndexOf;
h.sortedLastIndex = S.sortedLastIndex;
h.sortedLastIndexBy = S.sortedLastIndexBy;
h.sortedLastIndexOf = S.sortedLastIndexOf;
h.startCase = B.startCase;
h.startsWith = B.startsWith;
h.subtract = Pt.subtract;
h.sum = Pt.sum;
h.sumBy = Pt.sumBy;
h.template = B.template;
h.times = W.times;
h.toFinite = O.toFinite;
h.toInteger = T;
h.toLength = O.toLength;
h.toLower = B.toLower;
h.toNumber = O.toNumber;
h.toSafeInteger = O.toSafeInteger;
h.toString = O.toString;
h.toUpper = B.toUpper;
h.trim = B.trim;
h.trimEnd = B.trimEnd;
h.trimStart = B.trimStart;
h.truncate = B.truncate;
h.unescape = B.unescape;
h.uniqueId = W.uniqueId;
h.upperCase = B.upperCase;
h.upperFirst = B.upperFirst;
h.each = q.forEach;
h.eachRight = q.forEachRight;
h.first = S.head;
Za(h, function() {
  var t = {};
  return xe(h, function(e, r) {
    tv.call(h.prototype, r) || (t[r] = e);
  }), t;
}(), { chain: !1 });
h.VERSION = l$;
(h.templateSettings = B.templateSettings).imports._ = h;
ie(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(t) {
  h[t].placeholder = h;
});
ie(["drop", "take"], function(t, e) {
  P.prototype[t] = function(r) {
    r = r === void 0 ? 1 : v$(T(r), 0);
    var n = this.__filtered__ && !e ? new P(this) : this.clone();
    return n.__filtered__ ? n.__takeCount__ = Zc(r, n.__takeCount__) : n.__views__.push({
      size: Zc(r, Qg),
      type: t + (n.__dir__ < 0 ? "Right" : "")
    }), n;
  }, P.prototype[t + "Right"] = function(r) {
    return this.reverse()[t](r).reverse();
  };
});
ie(["filter", "map", "takeWhile"], function(t, e) {
  var r = e + 1, n = r == p$ || r == d$;
  P.prototype[t] = function(i) {
    var o = this.clone();
    return o.__iteratees__.push({
      iteratee: R(i),
      type: r
    }), o.__filtered__ = o.__filtered__ || n, o;
  };
});
ie(["head", "last"], function(t, e) {
  var r = "take" + (e ? "Right" : "");
  P.prototype[t] = function() {
    return this[r](1).value()[0];
  };
});
ie(["initial", "tail"], function(t, e) {
  var r = "drop" + (e ? "" : "Right");
  P.prototype[t] = function() {
    return this.__filtered__ ? new P(this) : this[r](1);
  };
});
P.prototype.compact = function() {
  return this.filter(Tt);
};
P.prototype.find = function(t) {
  return this.filter(t).head();
};
P.prototype.findLast = function(t) {
  return this.reverse().find(t);
};
P.prototype.invokeMap = I(function(t, e) {
  return typeof t == "function" ? new P(this) : this.map(function(r) {
    return Ai(r, t, e);
  });
});
P.prototype.reject = function(t) {
  return this.filter(Si(R(t)));
};
P.prototype.slice = function(t, e) {
  t = T(t);
  var r = this;
  return r.__filtered__ && (t > 0 || e < 0) ? new P(r) : (t < 0 ? r = r.takeRight(-t) : t && (r = r.drop(t)), e !== void 0 && (e = T(e), r = e < 0 ? r.dropRight(-e) : r.take(e - t)), r);
};
P.prototype.takeRightWhile = function(t) {
  return this.reverse().takeWhile(t).reverse();
};
P.prototype.toArray = function() {
  return this.take(Qg);
};
xe(P.prototype, function(t, e) {
  var r = /^(?:filter|find|map|reject)|While$/.test(e), n = /^(?:head|last)$/.test(e), i = h[n ? "take" + (e == "last" ? "Right" : "") : e], o = n || /^find/.test(e);
  i && (h.prototype[e] = function() {
    var s = this.__wrapped__, u = n ? [1] : arguments, a = s instanceof P, f = u[0], c = a || $(s), l = function(y) {
      var m = i.apply(h, ir([y], u));
      return n && p ? m[0] : m;
    };
    c && r && typeof f == "function" && f.length != 1 && (a = c = !1);
    var p = this.__chain__, d = !!this.__actions__.length, _ = o && !p, g = a && !d;
    if (!o && c) {
      s = g ? s : new P(this);
      var v = t.apply(s, u);
      return v.__actions__.push({ func: Ei, args: [l], thisArg: void 0 }), new ee(v, p);
    }
    return _ && g ? t.apply(this, u) : (v = this.thru(l), _ ? n ? v.value()[0] : v.value() : v);
  });
});
ie(["pop", "push", "shift", "sort", "splice", "unshift"], function(t) {
  var e = _$[t], r = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru", n = /^(?:pop|shift)$/.test(t);
  h.prototype[t] = function() {
    var i = arguments;
    if (n && !this.__chain__) {
      var o = this.value();
      return e.apply($(o) ? o : [], i);
    }
    return this[r](function(s) {
      return e.apply($(s) ? s : [], i);
    });
  };
});
xe(P.prototype, function(t, e) {
  var r = h[e];
  if (r) {
    var n = r.name + "";
    tv.call(Fr, n) || (Fr[n] = []), Fr[n].push({ name: e, func: r });
  }
});
Fr[Bo(void 0, h$).name] = [{
  name: "wrapper",
  func: void 0
}];
P.prototype.clone = r$;
P.prototype.reverse = n$;
P.prototype.value = c$;
h.prototype.at = Ee.at;
h.prototype.chain = Ee.wrapperChain;
h.prototype.commit = Ee.commit;
h.prototype.next = Ee.next;
h.prototype.plant = Ee.plant;
h.prototype.reverse = Ee.reverse;
h.prototype.toJSON = h.prototype.valueOf = h.prototype.value = Ee.value;
h.prototype.first = h.prototype.head;
Yc && (h.prototype[Yc] = Ee.toIterator);
/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
const d3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  add: th,
  after: nh,
  ary: Yu,
  assign: bh,
  assignIn: nu,
  assignInWith: kn,
  assignWith: wh,
  at: Sh,
  attempt: ta,
  before: ea,
  bind: vi,
  bindAll: Oh,
  bindKey: Ho,
  camelCase: Hh,
  capitalize: ra,
  castArray: Kh,
  ceil: Yh,
  chain: aa,
  chunk: Zh,
  clamp: Xh,
  clone: up,
  cloneDeep: ap,
  cloneDeepWith: fp,
  cloneWith: cp,
  commit: fu,
  compact: lp,
  concat: hp,
  cond: mp,
  conforms: wp,
  conformsTo: Ap,
  constant: No,
  countBy: Op,
  create: Ep,
  curry: Jo,
  curryRight: Qo,
  debounce: wa,
  deburr: oa,
  default: h,
  defaultTo: Rp,
  defaults: Tp,
  defaultsDeep: Ip,
  defer: Lp,
  delay: Cp,
  difference: Fp,
  differenceBy: Np,
  differenceWith: zp,
  divide: Dp,
  drop: Bp,
  dropRight: jp,
  dropRightWhile: Wp,
  dropWhile: qp,
  each: hu,
  eachRight: pu,
  endsWith: kp,
  entries: du,
  entriesIn: _u,
  eq: oe,
  escape: Ea,
  escapeRegExp: Zp,
  every: Vp,
  extend: nu,
  extendWith: kn,
  fill: Jp,
  filter: td,
  find: rd,
  findIndex: $a,
  findKey: id,
  findLast: od,
  findLastIndex: Ta,
  findLastKey: sd,
  first: gu,
  flatMap: ad,
  flatMapDeep: fd,
  flatMapDepth: cd,
  flatten: Qu,
  flattenDeep: ld,
  flattenDepth: hd,
  flip: pd,
  floor: dd,
  flow: gd,
  flowRight: vd,
  forEach: hu,
  forEachRight: pu,
  forIn: yd,
  forInRight: md,
  forOwn: bd,
  forOwnRight: wd,
  fromPairs: Ad,
  functions: Sd,
  functionsIn: xd,
  get: Uo,
  groupBy: Od,
  gt: Ed,
  gte: Rd,
  has: $d,
  hasIn: Xo,
  head: gu,
  identity: Tt,
  inRange: Td,
  includes: Md,
  indexOf: Id,
  initial: Pd,
  intersection: Ld,
  intersectionBy: Cd,
  intersectionWith: Fd,
  invert: zd,
  invertBy: Bd,
  invoke: Wd,
  invokeMap: qd,
  isArguments: Ve,
  isArray: $,
  isArrayBuffer: Ud,
  isArrayLike: Mt,
  isArrayLikeObject: tt,
  isBoolean: Gd,
  isBuffer: Ne,
  isDate: kd,
  isElement: Hd,
  isEmpty: Kd,
  isEqual: Yd,
  isEqualWith: Zd,
  isError: ko,
  isFinite: Xd,
  isFunction: we,
  isInteger: Ca,
  isLength: di,
  isMap: ha,
  isMatch: Vd,
  isMatchWith: Jd,
  isNaN: Qd,
  isNative: t_,
  isNil: e_,
  isNull: r_,
  isNumber: Fa,
  isObject: J,
  isObjectLike: Q,
  isPlainObject: sn,
  isRegExp: is,
  isSafeInteger: n_,
  isSet: pa,
  isString: wi,
  isSymbol: Ft,
  isTypedArray: wr,
  isUndefined: i_,
  isWeakMap: o_,
  isWeakSet: s_,
  iteratee: u_,
  join: a_,
  kebabCase: f_,
  keyBy: c_,
  keys: ot,
  keysIn: It,
  last: Ht,
  lastIndexOf: l_,
  lodash: h,
  lowerCase: h_,
  lowerFirst: p_,
  lt: d_,
  lte: __,
  map: bi,
  mapKeys: g_,
  mapValues: v_,
  matches: y_,
  matchesProperty: m_,
  max: b_,
  maxBy: w_,
  mean: S_,
  meanBy: x_,
  memoize: gi,
  merge: O_,
  mergeWith: Sa,
  method: E_,
  methodOf: R_,
  min: $_,
  minBy: T_,
  mixin: M_,
  multiply: I_,
  negate: Si,
  next: vu,
  noop: Fo,
  now: Pn,
  nth: L_,
  nthArg: C_,
  omit: F_,
  omitBy: z_,
  once: D_,
  orderBy: W_,
  over: q_,
  overArgs: U_,
  overEvery: G_,
  overSome: k_,
  pad: J_,
  padEnd: Q_,
  padStart: t0,
  parseInt: e0,
  partial: Oi,
  partialRight: ss,
  partition: r0,
  pick: n0,
  pickBy: ja,
  plant: wu,
  property: ma,
  propertyOf: i0,
  pull: o0,
  pullAll: Ua,
  pullAllBy: s0,
  pullAllWith: u0,
  pullAt: f0,
  random: c0,
  range: h0,
  rangeRight: p0,
  rearg: d0,
  reduce: g0,
  reduceRight: v0,
  reject: y0,
  remove: m0,
  repeat: b0,
  replace: w0,
  rest: A0,
  result: S0,
  reverse: _o,
  round: x0,
  sample: E0,
  sampleSize: R0,
  set: $0,
  setWith: T0,
  shuffle: M0,
  size: I0,
  slice: P0,
  snakeCase: L0,
  some: C0,
  sortBy: F0,
  sortedIndex: N0,
  sortedIndexBy: z0,
  sortedIndexOf: D0,
  sortedLastIndex: B0,
  sortedLastIndexBy: j0,
  sortedLastIndexOf: W0,
  sortedUniq: U0,
  sortedUniqBy: G0,
  split: k0,
  spread: H0,
  startCase: K0,
  startsWith: Y0,
  stubArray: Yo,
  stubFalse: jo,
  stubObject: Z0,
  stubString: X0,
  stubTrue: V0,
  subtract: J0,
  sum: Q0,
  sumBy: tg,
  tail: eg,
  take: rg,
  takeRight: ng,
  takeRightWhile: ig,
  takeWhile: og,
  tap: sg,
  template: fg,
  templateSettings: go,
  throttle: cg,
  thru: Ei,
  times: lg,
  toArray: Da,
  toFinite: ye,
  toInteger: T,
  toIterator: Au,
  toJSON: Rn,
  toLength: Ra,
  toLower: pg,
  toNumber: Wt,
  toPairs: du,
  toPairsIn: _u,
  toPath: dg,
  toPlainObject: Aa,
  toSafeInteger: _g,
  toString: D,
  toUpper: gg,
  transform: vg,
  trim: bg,
  trimEnd: wg,
  trimStart: Ag,
  truncate: Sg,
  unary: xg,
  unescape: Eg,
  union: Rg,
  unionBy: $g,
  unionWith: Tg,
  uniq: Mg,
  uniqBy: Ig,
  uniqWith: Pg,
  uniqueId: Lg,
  unset: Cg,
  unzip: fs,
  unzipWith: Ha,
  update: Ng,
  updateWith: zg,
  upperCase: Dg,
  upperFirst: Ko,
  value: Rn,
  valueOf: Rn,
  values: xr,
  valuesIn: Bg,
  without: jg,
  words: sa,
  wrap: Wg,
  wrapperAt: qg,
  wrapperChain: Ug,
  wrapperCommit: fu,
  wrapperLodash: h,
  wrapperNext: vu,
  wrapperPlant: wu,
  wrapperReverse: Gg,
  wrapperToIterator: Au,
  wrapperValue: Rn,
  xor: kg,
  xorBy: Hg,
  xorWith: Kg,
  zip: Yg,
  zipObject: Xg,
  zipObjectDeep: Vg,
  zipWith: Jg
}, Symbol.toStringTag, { value: "Module" }));
function ev(t) {
  return [parseInt(t.substr(1, 2), 16), parseInt(t.substr(3, 2), 16), parseInt(t.substr(5, 2), 16)];
}
function js(t) {
  const e = Math.round(t).toString(16);
  return e.length === 1 ? `0${e}` : e;
}
function rv(t) {
  return `#${js(t[0])}${js(t[1])}${js(t[2])}`;
}
const y$ = /rgba?\(([\s.,0-9]+)\)/;
function m$() {
  const t = document.createElement("i");
  return t.title = "Web Colour Picker", t.style.display = "none", document.body.appendChild(t), t;
}
let Yi;
function nv(t) {
  if (t[0] === "#" && t.length === 7)
    return t;
  Yi || (Yi = m$()), Yi.style.color = t;
  let e = document.defaultView.getComputedStyle(Yi, "").getPropertyValue("color");
  const n = y$.exec(e)[1].split(/\s*,\s*/).map((i) => Number(i));
  return e = rv(n), e;
}
function Ws(t, e, r, n) {
  return t[n] + (e[n] - t[n]) * r;
}
function b$(t, e) {
  const r = isNaN(Number(e)) || e < 0 ? 0 : e > 1 ? 1 : Number(e), n = t.length - 1, i = Math.floor(n * r), o = n * r - i, s = t[i], u = i === n ? s : t[i + 1];
  return rv([Ws(s, u, o, 0), Ws(s, u, o, 1), Ws(s, u, o, 2)]);
}
function w$(t) {
  const r = (typeof t == "string" ? t.split("-") : t).map((n) => ev(n.indexOf("#") === -1 ? nv(n) : n));
  return (n) => b$(r, n);
}
const A$ = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i, S$ = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i, x$ = /[\d.]+:(#[^\s]+|[^)]+\))/gi;
function O$(t) {
  return /^[r,R,L,l]{1}[\s]*\(/.test(t);
}
function E$(t) {
  if (O$(t)) {
    let e = "", r;
    if (t[0] === "l") {
      const i = A$.exec(t), o = +i[1] + 90;
      r = i[2], e = `linear-gradient(${o}deg, `;
    } else t[0] === "r" && (e = "radial-gradient(", r = S$.exec(t)[4]);
    const n = r.match(x$);
    return n.forEach((i, o) => {
      const s = i.split(":");
      e += `${s[1]} ${Number(s[0]) * 100}%`, o !== n.length - 1 && (e += ", ");
    }), e += ")", e;
  }
  return t;
}
var Xc = typeof Float32Array < "u" ? Float32Array : Array;
function cs(t, e, r) {
  var n = e[0], i = e[1], o = e[2], s = e[3], u = e[4], a = e[5], f = e[6], c = e[7], l = e[8], p = r[0], d = r[1], _ = r[2], g = r[3], v = r[4], y = r[5], m = r[6], w = r[7], b = r[8];
  return t[0] = p * n + d * s + _ * f, t[1] = p * i + d * u + _ * c, t[2] = p * o + d * a + _ * l, t[3] = g * n + v * s + y * f, t[4] = g * i + v * u + y * c, t[5] = g * o + v * a + y * l, t[6] = m * n + w * s + b * f, t[7] = m * i + w * u + b * c, t[8] = m * o + w * a + b * l, t;
}
function R$(t, e) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = e[0], t[7] = e[1], t[8] = 1, t;
}
function $$(t, e) {
  var r = Math.sin(e), n = Math.cos(e);
  return t[0] = n, t[1] = r, t[2] = 0, t[3] = -r, t[4] = n, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
}
function T$(t, e) {
  return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = e[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
}
function M$() {
  var t = new Xc(2);
  return Xc != Float32Array && (t[0] = 0, t[1] = 0), t;
}
function I$(t, e) {
  var r = t[0], n = t[1], i = e[0], o = e[1];
  return Math.abs(Math.atan2(n * i - r * o, r * i + n * o));
}
(function() {
  var t = M$();
  return function(e, r, n, i, o, s) {
    var u, a;
    for (r || (r = 2), n || (n = 0), i ? a = Math.min(i * r + n, e.length) : a = e.length, u = n; u < a; u += r)
      t[0] = e[u], t[1] = e[u + 1], o(t, t, s), e[u] = t[0], e[u + 1] = t[1];
    return e;
  };
})();
function P$(t, e, r) {
  const n = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return R$(n, r), cs(t, n, e);
}
function L$(t, e, r) {
  const n = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return $$(n, r), cs(t, n, e);
}
function C$(t, e, r) {
  const n = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return T$(n, r), cs(t, n, e);
}
function F$(t, e, r) {
  return cs(t, r, e);
}
function N$(t, e) {
  const r = t ? [].concat(t) : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  for (let n = 0, i = e.length; n < i; n++) {
    const o = e[n];
    switch (o[0]) {
      case "t":
        P$(r, r, [o[1], o[2]]);
        break;
      case "s":
        C$(r, r, [o[1], o[2]]);
        break;
      case "r":
        L$(r, r, o[1]);
        break;
      case "m":
        F$(r, r, o[1]);
        break;
    }
  }
  return r;
}
function iv(t, e) {
  return t[0] * e[1] - e[0] * t[1];
}
function z$(t, e, r) {
  const n = I$(t, e), i = iv(t, e) >= 0;
  return r ? i ? Math.PI * 2 - n : n : i ? n : Math.PI * 2 - n;
}
function D$(t, e, r) {
  return r ? (t[0] = e[1], t[1] = -1 * e[0]) : (t[0] = -1 * e[1], t[1] = e[0]), t;
}
function cn(t) {
  return t.map((e) => Array.isArray(e) ? [].concat(e) : e);
}
function B$(t, e) {
  if (e === "off") return cn(t);
  const r = typeof e == "number" && e >= 1 ? 10 ** e : 1;
  return t.map((n) => {
    const i = n.slice(1).map(Number).map((o) => e ? Math.round(o * r) / r : Math.round(o));
    return [n[0]].concat(i);
  });
}
function j$(t, e = "off") {
  return B$(t, e).map((r) => r[0] + r.slice(1).join(" ")).join("");
}
const ov = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
};
function W$(t, e, r) {
  if (t[r].length > 7) {
    t[r].shift();
    const n = t[r];
    let i = r;
    for (; n.length; )
      e[r] = "A", t.splice(i += 1, 0, ["C"].concat(n.splice(0, 6)));
    t.splice(r, 1);
  }
}
const Ln = {
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
function sv(t) {
  return Array.isArray(t) && t.every((e) => {
    const r = e[0].toLowerCase();
    return Ln[r] === e.length - 1 && "achlmqstvz".includes(r);
  });
}
function uv(t) {
  return sv(t) && // @ts-ignore -- `isPathArray` also checks if it's `Array`
  t.every(([e]) => e === e.toUpperCase());
}
function av(t) {
  return uv(t) && t.every(([e]) => "ACLMQZ".includes(e));
}
function Vc(t) {
  let e = t.pathValue[t.segmentStart], r = e.toLowerCase();
  const { data: n } = t;
  for (; n.length >= Ln[r] && (r === "m" && n.length > 2 ? (t.segments.push([e].concat(n.splice(0, 2))), r = "l", e = e === "m" ? "l" : "L") : t.segments.push([e].concat(n.splice(0, Ln[r]))), !!Ln[r]); )
    ;
}
function q$(t) {
  const { index: e, pathValue: r } = t, n = r.charCodeAt(e);
  if (n === 48) {
    t.param = 0, t.index += 1;
    return;
  }
  if (n === 49) {
    t.param = 1, t.index += 1;
    return;
  }
  t.err = `[path-util]: invalid Arc flag "${r[e]}", expecting 0 or 1 at index ${e}`;
}
function U$(t) {
  return t >= 48 && t <= 57 || t === 43 || t === 45 || t === 46;
}
function Ir(t) {
  return t >= 48 && t <= 57;
}
function G$(t) {
  const { max: e, pathValue: r, index: n } = t;
  let i = n, o = !1, s = !1, u = !1, a = !1, f;
  if (i >= e) {
    t.err = `[path-util]: Invalid path value at index ${i}, "pathValue" is missing param`;
    return;
  }
  if (f = r.charCodeAt(i), (f === 43 || f === 45) && (i += 1, f = r.charCodeAt(i)), !Ir(f) && f !== 46) {
    t.err = `[path-util]: Invalid path value at index ${i}, "${r[i]}" is not a number`;
    return;
  }
  if (f !== 46) {
    if (o = f === 48, i += 1, f = r.charCodeAt(i), o && i < e && f && Ir(f)) {
      t.err = `[path-util]: Invalid path value at index ${n}, "${r[n]}" illegal number`;
      return;
    }
    for (; i < e && Ir(r.charCodeAt(i)); )
      i += 1, s = !0;
    f = r.charCodeAt(i);
  }
  if (f === 46) {
    for (a = !0, i += 1; Ir(r.charCodeAt(i)); )
      i += 1, u = !0;
    f = r.charCodeAt(i);
  }
  if (f === 101 || f === 69) {
    if (a && !s && !u) {
      t.err = `[path-util]: Invalid path value at index ${i}, "${r[i]}" invalid float exponent`;
      return;
    }
    if (i += 1, f = r.charCodeAt(i), (f === 43 || f === 45) && (i += 1), i < e && Ir(r.charCodeAt(i)))
      for (; i < e && Ir(r.charCodeAt(i)); )
        i += 1;
    else {
      t.err = `[path-util]: Invalid path value at index ${i}, "${r[i]}" invalid integer exponent`;
      return;
    }
  }
  t.index = i, t.param = +t.pathValue.slice(n, i);
}
function k$(t) {
  const e = [
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
  return t === 10 || t === 13 || t === 8232 || t === 8233 || // Line terminators
  // White spaces
  t === 32 || t === 9 || t === 11 || t === 12 || t === 160 || t >= 5760 && e.includes(t);
}
function so(t) {
  const { pathValue: e, max: r } = t;
  for (; t.index < r && k$(e.charCodeAt(t.index)); )
    t.index += 1;
}
function H$(t) {
  switch (t | 32) {
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
function K$(t) {
  return (t | 32) === 97;
}
function Y$(t) {
  const { max: e, pathValue: r, index: n } = t, i = r.charCodeAt(n), o = Ln[r[n].toLowerCase()];
  if (t.segmentStart = n, !H$(i)) {
    t.err = `[path-util]: Invalid path value "${r[n]}" is not a path command`;
    return;
  }
  if (t.index += 1, so(t), t.data = [], !o) {
    Vc(t);
    return;
  }
  for (; ; ) {
    for (let s = o; s > 0; s -= 1) {
      if (K$(i) && (s === 3 || s === 4) ? q$(t) : G$(t), t.err.length)
        return;
      t.data.push(t.param), so(t), t.index < e && r.charCodeAt(t.index) === 44 && (t.index += 1, so(t));
    }
    if (t.index >= t.max || !U$(r.charCodeAt(t.index)))
      break;
  }
  Vc(t);
}
class Z$ {
  pathValue;
  segments;
  max;
  index;
  param;
  segmentStart;
  data;
  err;
  constructor(e) {
    this.pathValue = e, this.segments = [], this.max = e.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
function Xa(t) {
  if (sv(t))
    return cn(t);
  const e = new Z$(t);
  for (so(e); e.index < e.max && !e.err.length; )
    Y$(e);
  return e.err ? e.err : e.segments;
}
function fv(t) {
  if (uv(t))
    return cn(t);
  const e = Xa(t);
  let r = 0, n = 0, i = 0, o = 0;
  return e.map((s) => {
    const u = s.slice(1).map(Number), [a] = s, f = a.toUpperCase();
    if (a === "M")
      return [r, n] = u, i = r, o = n, ["M", r, n];
    let c;
    if (a !== f)
      switch (f) {
        case "A":
          c = [
            f,
            u[0],
            u[1],
            u[2],
            u[3],
            u[4],
            u[5] + r,
            u[6] + n
          ];
          break;
        case "V":
          c = [f, u[0] + n];
          break;
        case "H":
          c = [f, u[0] + r];
          break;
        default: {
          const p = u.map((d, _) => d + (_ % 2 ? n : r));
          c = [f].concat(p);
        }
      }
    else
      c = [f].concat(u);
    const l = c.length;
    switch (f) {
      case "Z":
        r = i, n = o;
        break;
      case "H":
        [, r] = c;
        break;
      case "V":
        [, n] = c;
        break;
      default:
        r = c[l - 2], n = c[l - 1], f === "M" && (i = r, o = n);
    }
    return c;
  });
}
function X$(t, e) {
  const [r] = t, { x1: n, y1: i, x2: o, y2: s } = e, u = t.slice(1).map(Number);
  let a = t;
  if ("TQ".includes(r) || (e.qx = null, e.qy = null), r === "H")
    a = ["L", t[1], i];
  else if (r === "V")
    a = ["L", n, t[1]];
  else if (r === "S") {
    const f = n * 2 - o, c = i * 2 - s;
    e.x1 = f, e.y1 = c, a = ["C", f, c].concat(u);
  } else if (r === "T") {
    const f = n * 2 - e.qx, c = i * 2 - e.qy;
    e.qx = f, e.qy = c, a = ["Q", f, c].concat(u);
  } else if (r === "Q") {
    const [f, c] = u;
    e.qx = f, e.qy = c;
  }
  return a;
}
function ls(t) {
  if (av(t))
    return cn(t);
  const e = fv(t), r = { ...ov }, n = e.length;
  let i = "";
  for (let o = 0; o < n; o += 1) {
    [i] = e[o], e[o] = X$(e[o], r);
    const s = e[o], u = s.length;
    r.x1 = +s[u - 2], r.y1 = +s[u - 1], r.x2 = +s[u - 4] || r.x1, r.y2 = +s[u - 3] || r.y1;
  }
  return e;
}
function V$(t) {
  return av(t) && t.every(([e]) => "MC".includes(e));
}
function Zi(t, e, r) {
  const n = t * Math.cos(r) - e * Math.sin(r), i = t * Math.sin(r) + e * Math.cos(r);
  return { x: n, y: i };
}
function cv(t, e, r, n, i, o, s, u, a, f) {
  let c = t, l = e, p = r, d = n, _ = u, g = a;
  const v = Math.PI * 120 / 180, y = Math.PI / 180 * (+i || 0);
  let m = [], w, b, A, x, M;
  if (f)
    [b, A, x, M] = f;
  else {
    w = Zi(c, l, -y), c = w.x, l = w.y, w = Zi(_, g, -y), _ = w.x, g = w.y;
    const ut = (c - _) / 2, fe = (l - g) / 2;
    let cr = ut * ut / (p * p) + fe * fe / (d * d);
    cr > 1 && (cr = Math.sqrt(cr), p *= cr, d *= cr);
    const Ls = p * p, Cs = d * d, Uf = (o === s ? -1 : 1) * Math.sqrt(Math.abs((Ls * Cs - Ls * fe * fe - Cs * ut * ut) / (Ls * fe * fe + Cs * ut * ut)));
    x = Uf * p * fe / d + (c + _) / 2, M = Uf * -d * ut / p + (l + g) / 2, b = Math.asin(((l - M) / d * 10 ** 9 >> 0) / 10 ** 9), A = Math.asin(((g - M) / d * 10 ** 9 >> 0) / 10 ** 9), b = c < x ? Math.PI - b : b, A = _ < x ? Math.PI - A : A, b < 0 && (b = Math.PI * 2 + b), A < 0 && (A = Math.PI * 2 + A), s && b > A && (b -= Math.PI * 2), !s && A > b && (A -= Math.PI * 2);
  }
  let nt = A - b;
  if (Math.abs(nt) > v) {
    const ut = A, fe = _, cr = g;
    A = b + v * (s && A > b ? 1 : -1), _ = x + p * Math.cos(A), g = M + d * Math.sin(A), m = cv(_, g, p, d, i, 0, s, fe, cr, [A, ut, x, M]);
  }
  nt = A - b;
  const $e = Math.cos(b), qi = Math.sin(b), de = Math.cos(A), Ui = Math.sin(A), bn = Math.tan(nt / 4), Gi = 4 / 3 * p * bn, ki = 4 / 3 * d * bn, Te = [c, l], Me = [c + Gi * qi, l - ki * $e], wn = [_ + Gi * Ui, g - ki * de], An = [_, g];
  if (Me[0] = 2 * Te[0] - Me[0], Me[1] = 2 * Te[1] - Me[1], f)
    return Me.concat(wn, An, m);
  m = Me.concat(wn, An, m);
  const Ps = [];
  for (let ut = 0, fe = m.length; ut < fe; ut += 1)
    Ps[ut] = ut % 2 ? Zi(m[ut - 1], m[ut], y).y : Zi(m[ut], m[ut + 1], y).x;
  return Ps;
}
function J$(t, e, r, n, i, o) {
  const s = 0.3333333333333333, u = 2 / 3;
  return [
    s * t + u * r,
    // cpx1
    s * e + u * n,
    // cpy1
    s * i + u * r,
    // cpx2
    s * o + u * n,
    // cpy2
    i,
    o
    // x,y
  ];
}
function Vt(t, e, r) {
  const n = t[0], i = t[1], o = e[0], s = e[1];
  return [n + (o - n) * r, i + (s - i) * r];
}
function ln(t, e) {
  return Math.sqrt((t[0] - e[0]) * (t[0] - e[0]) + (t[1] - e[1]) * (t[1] - e[1]));
}
function Zn(t, e, r, n, i) {
  const o = ln([t, e], [r, n]);
  let s = { x: 0, y: 0 };
  if (typeof i == "number")
    if (i <= 0)
      s = { x: t, y: e };
    else if (i >= o)
      s = { x: r, y: n };
    else {
      const [u, a] = Vt([t, e], [r, n], i / o);
      s = { x: u, y: a };
    }
  return {
    length: o,
    point: s,
    min: {
      x: Math.min(t, r),
      y: Math.min(e, n)
    },
    max: {
      x: Math.max(t, r),
      y: Math.max(e, n)
    }
  };
}
function Jc(t, e, r, n) {
  const o = [t, e], s = [r, n], u = Vt(o, s, 0.5), a = Vt(s, u, 0.5), f = Vt(u, a, 0.5), c = Vt(a, f, 0.5), l = Vt(f, c, 0.5), p = Zn(o[0], o[1], u[0], u[1], f[0]).point, d = Zn(l[0], l[1], c[0], c[1], a[0]).point;
  return [p.x, p.y, d.x, d.y, r, n];
}
function Q$(t, e) {
  const [r] = t, n = t.slice(1).map(Number), [i, o] = n;
  let s;
  const { x1: u, y1: a, x: f, y: c } = e;
  switch ("TQ".includes(r) || (e.qx = null, e.qy = null), r) {
    case "M":
      return e.x = i, e.y = o, t;
    case "A":
      return s = [u, a].concat(n), ["C"].concat(
        cv(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9])
      );
    case "Q":
      return e.qx = i, e.qy = o, s = [u, a].concat(n), ["C"].concat(J$(s[0], s[1], s[2], s[3], s[4], s[5]));
    case "L":
      return ["C"].concat(Jc(u, a, i, o));
    case "Z":
      return u === f && a === c ? ["C", u, a, f, c, f, c] : ["C"].concat(Jc(u, a, f, c));
  }
  return t;
}
function lv(t, e = !1) {
  if (V$(t)) {
    const c = cn(t);
    return e ? [c, []] : c;
  }
  const r = ls(t), n = { ...ov }, i = [];
  let o = "", s = r.length, u, a;
  const f = [];
  for (let c = 0; c < s; c += 1) {
    r[c] && ([o] = r[c]), i[c] = o;
    const l = Q$(r[c], n);
    r[c] = l, W$(r, i, c), s = r.length, o === "Z" && f.push(c), u = r[c], a = u.length, n.x1 = +u[a - 2], n.y1 = +u[a - 1], n.x2 = +u[a - 4] || n.x1, n.y2 = +u[a - 3] || n.y1;
  }
  return e ? [r, f] : r;
}
function tT(t) {
  const e = t.slice(1).map(
    (r, n, i) => (
      // @ts-ignore
      n ? i[n - 1].slice(-2).concat(r.slice(1)) : t[0].slice(1).concat(r.slice(1))
    )
  ).map((r) => r.map((n, i) => r[r.length - i - 2 * (1 - i % 2)])).reverse();
  return [["M"].concat(e[0].slice(0, 2))].concat(
    e.map((r) => ["C"].concat(r.slice(2)))
  );
}
function Qc(t, e) {
  const { x: r, y: n } = t, { x: i, y: o } = e, s = r * i + n * o, u = Math.sqrt((r ** 2 + n ** 2) * (i ** 2 + o ** 2));
  return (r * o - n * i < 0 ? -1 : 1) * Math.acos(s / u);
}
function eT(t, e, r, n, i, o, s, u, a, f) {
  const { abs: c, sin: l, cos: p, sqrt: d, PI: _ } = Math;
  let g = c(r), v = c(n);
  const m = (i % 360 + 360) % 360 * (_ / 180);
  if (t === u && e === a)
    return { x: t, y: e };
  if (g === 0 || v === 0)
    return Zn(t, e, u, a, f).point;
  const w = (t - u) / 2, b = (e - a) / 2, A = {
    x: p(m) * w + l(m) * b,
    y: -l(m) * w + p(m) * b
  }, x = A.x ** 2 / g ** 2 + A.y ** 2 / v ** 2;
  x > 1 && (g *= d(x), v *= d(x));
  const M = g ** 2 * v ** 2 - g ** 2 * A.y ** 2 - v ** 2 * A.x ** 2, nt = g ** 2 * A.y ** 2 + v ** 2 * A.x ** 2;
  let $e = M / nt;
  $e = $e < 0 ? 0 : $e;
  const qi = (o !== s ? 1 : -1) * d($e), de = {
    x: qi * (g * A.y / v),
    y: qi * (-(v * A.x) / g)
  }, Ui = {
    x: p(m) * de.x - l(m) * de.y + (t + u) / 2,
    y: l(m) * de.x + p(m) * de.y + (e + a) / 2
  }, bn = {
    x: (A.x - de.x) / g,
    y: (A.y - de.y) / v
  }, Gi = Qc({ x: 1, y: 0 }, bn), ki = {
    x: (-A.x - de.x) / g,
    y: (-A.y - de.y) / v
  };
  let Te = Qc(bn, ki);
  !s && Te > 0 ? Te -= 2 * _ : s && Te < 0 && (Te += 2 * _), Te %= 2 * _;
  const Me = Gi + Te * f, wn = g * p(Me), An = v * l(Me);
  return {
    x: p(m) * wn - l(m) * An + Ui.x,
    y: l(m) * wn + p(m) * An + Ui.y
  };
}
function rT(t, e, r, n, i, o, s, u, a, f) {
  const c = typeof f == "number";
  let l = t, p = e, d = 0, _ = [l, p, d], g = [l, p], v = 0, y = { x: 0, y: 0 }, m = [{ x: l, y: p }];
  c && f <= 0 && (y = { x: l, y: p });
  const w = 100;
  for (let b = 0; b <= w; b += 1) {
    if (v = b / w, { x: l, y: p } = eT(t, e, r, n, i, o, s, u, a, v), m = m.concat({ x: l, y: p }), d += ln(g, [l, p]), g = [l, p], c && d >= f && f > _[2]) {
      const A = (d - f) / (d - _[2]);
      y = {
        x: g[0] * (1 - A) + _[0] * A,
        y: g[1] * (1 - A) + _[1] * A
      };
    }
    _ = [l, p, d];
  }
  return c && f >= d && (y = { x: u, y: a }), {
    length: d,
    point: y,
    min: {
      x: Math.min.apply(
        null,
        m.map((b) => b.x)
      ),
      y: Math.min.apply(
        null,
        m.map((b) => b.y)
      )
    },
    max: {
      x: Math.max.apply(
        null,
        m.map((b) => b.x)
      ),
      y: Math.max.apply(
        null,
        m.map((b) => b.y)
      )
    }
  };
}
function nT(t, e, r, n, i, o, s, u, a) {
  const f = 1 - a;
  return {
    x: f ** 3 * t + 3 * f ** 2 * a * r + 3 * f * a ** 2 * i + a ** 3 * s,
    y: f ** 3 * e + 3 * f ** 2 * a * n + 3 * f * a ** 2 * o + a ** 3 * u
  };
}
function hv(t, e, r, n, i, o, s, u, a) {
  const f = typeof a == "number";
  let c = t, l = e, p = 0, d = [c, l, p], _ = [c, l], g = 0, v = { x: 0, y: 0 }, y = [{ x: c, y: l }];
  f && a <= 0 && (v = { x: c, y: l });
  const m = 30;
  for (let w = 0; w <= m; w += 1) {
    if (g = w / m, { x: c, y: l } = nT(t, e, r, n, i, o, s, u, g), y = y.concat({ x: c, y: l }), p += ln(_, [c, l]), _ = [c, l], f && p >= a && a > d[2]) {
      const b = (p - a) / (p - d[2]);
      v = {
        x: _[0] * (1 - b) + d[0] * b,
        y: _[1] * (1 - b) + d[1] * b
      };
    }
    d = [c, l, p];
  }
  return f && a >= p && (v = { x: s, y: u }), {
    length: p,
    point: v,
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
function iT(t, e, r, n, i, o, s) {
  const u = 1 - s;
  return {
    x: u ** 2 * t + 2 * u * s * r + s ** 2 * i,
    y: u ** 2 * e + 2 * u * s * n + s ** 2 * o
  };
}
function oT(t, e, r, n, i, o, s) {
  const u = typeof s == "number";
  let a = t, f = e, c = 0, l = [a, f, c], p = [a, f], d = 0, _ = { x: 0, y: 0 }, g = [{ x: a, y: f }];
  u && s <= 0 && (_ = { x: a, y: f });
  const v = 30;
  for (let y = 0; y <= v; y += 1) {
    if (d = y / v, { x: a, y: f } = iT(t, e, r, n, i, o, d), g = g.concat({ x: a, y: f }), c += ln(p, [a, f]), p = [a, f], u && c >= s && s > l[2]) {
      const m = (c - s) / (c - l[2]);
      _ = {
        x: p[0] * (1 - m) + l[0] * m,
        y: p[1] * (1 - m) + l[1] * m
      };
    }
    l = [a, f, c];
  }
  return u && s >= c && (_ = { x: i, y: o }), {
    length: c,
    point: _,
    min: {
      x: Math.min.apply(
        null,
        g.map((y) => y.x)
      ),
      y: Math.min.apply(
        null,
        g.map((y) => y.y)
      )
    },
    max: {
      x: Math.max.apply(
        null,
        g.map((y) => y.x)
      ),
      y: Math.max.apply(
        null,
        g.map((y) => y.y)
      )
    }
  };
}
function hs(t, e) {
  const r = ls(t), n = typeof e == "number";
  let i, o = [], s, u = 0, a = 0, f = 0, c = 0, l, p = [], d = [], _ = 0, g = { x: 0, y: 0 }, v = g, y = g, m = g, w = 0;
  for (let b = 0, A = r.length; b < A; b += 1)
    l = r[b], [s] = l, i = s === "M", o = i ? o : [u, a].concat(l.slice(1)), i ? ([, f, c] = l, g = { x: f, y: c }, v = g, _ = 0, n && e < 1e-3 && (m = g)) : s === "L" ? { length: _, min: g, max: v, point: y } = Zn(o[0], o[1], o[2], o[3], (e || 0) - w) : s === "A" ? { length: _, min: g, max: v, point: y } = rT(
      o[0],
      o[1],
      o[2],
      o[3],
      o[4],
      o[5],
      o[6],
      o[7],
      o[8],
      (e || 0) - w
    ) : s === "C" ? { length: _, min: g, max: v, point: y } = hv(
      o[0],
      o[1],
      o[2],
      o[3],
      o[4],
      o[5],
      o[6],
      o[7],
      (e || 0) - w
    ) : s === "Q" ? { length: _, min: g, max: v, point: y } = oT(
      o[0],
      o[1],
      o[2],
      o[3],
      o[4],
      o[5],
      (e || 0) - w
    ) : s === "Z" && (o = [u, a, f, c], { length: _, min: g, max: v, point: y } = Zn(o[0], o[1], o[2], o[3], (e || 0) - w)), n && w < e && w + _ >= e && (m = y), d.push(v), p.push(g), w += _, [u, a] = s !== "Z" ? l.slice(-2) : [f, c];
  return n && e >= w && (m = { x: u, y: a }), {
    length: w,
    point: m,
    min: {
      x: Math.min.apply(
        null,
        p.map((b) => b.x)
      ),
      y: Math.min.apply(
        null,
        p.map((b) => b.y)
      )
    },
    max: {
      x: Math.max.apply(
        null,
        d.map((b) => b.x)
      ),
      y: Math.max.apply(
        null,
        d.map((b) => b.y)
      )
    }
  };
}
function sT(t) {
  if (!t)
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
    min: { x: e, y: r },
    max: { x: n, y: i }
  } = hs(t), o = n - e, s = i - r;
  return {
    width: o,
    height: s,
    x: e,
    y: r,
    x2: n,
    y2: i,
    cx: e + o / 2,
    cy: r + s / 2,
    // an estimted guess
    cz: Math.max(o, s) + Math.min(o, s) / 2
  };
}
function Cn(t) {
  return hs(t).length;
}
function uT(t) {
  if (!t)
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
    length: e,
    min: { x: r, y: n },
    max: { x: i, y: o }
  } = hs(t), s = i - r, u = o - n;
  return {
    length: e,
    width: s,
    height: u,
    x: r,
    y: n,
    x2: i,
    y2: o,
    cx: r + s / 2,
    cy: n + u / 2,
    // an estimted guess
    cz: Math.max(s, u) + Math.min(s, u) / 2
  };
}
function aT(t) {
  const e = t.length, r = e - 1;
  return t.map(
    (n, i) => t.map((o, s) => {
      let u = i + s, a;
      return s === 0 || t[u] && t[u][0] === "M" ? (a = t[u], ["M"].concat(a.slice(-2))) : (u >= e && (u -= r), t[u]);
    })
  );
}
function fT(t, e) {
  const r = t.length - 1, n = [];
  let i = 0, o = 0;
  const s = aT(t);
  return s.forEach((u, a) => {
    t.slice(1).forEach((f, c) => {
      o += ln(t[(a + c) % r].slice(-2), e[c % r].slice(-2));
    }), n[a] = o, o = 0;
  }), i = n.indexOf(Math.min.apply(null, n)), s[i];
}
function cT(t, e, r, n, i, o, s, u) {
  return 3 * ((u - e) * (r + i) - (s - t) * (n + o) + n * (t - i) - r * (e - o) + u * (i + t / 3) - s * (o + e / 3)) / 20;
}
function pv(t) {
  let e = 0, r = 0, n = 0;
  return lv(t).map((i) => {
    switch (i[0]) {
      case "M":
        return [, e, r] = i, 0;
      default:
        const [o, s, u, a, f, c] = i.slice(1);
        return n = cT(e, r, o, s, u, a, f, c), [e, r] = i.slice(-2), n;
    }
  }).reduce((i, o) => i + o, 0);
}
function lT(t) {
  return pv(t) >= 0;
}
function uo(t, e) {
  return hs(t, e).point;
}
function hT(t, e) {
  const r = Xa(t);
  if (typeof r == "string")
    throw TypeError(r);
  let n = r.slice(), i = Cn(n), o = n.length - 1, s = 0, u = 0, a = r[0];
  const [f, c] = a.slice(-2), l = { x: f, y: c };
  if (o <= 0 || !e || !Number.isFinite(e))
    return {
      segment: a,
      index: 0,
      length: u,
      point: l,
      lengthAtSegment: s
    };
  if (e >= i)
    return n = r.slice(0, -1), s = Cn(n), u = i - s, {
      segment: r[o],
      index: o,
      length: u,
      lengthAtSegment: s
    };
  const p = [];
  for (; o > 0; )
    a = n[o], n = n.slice(0, -1), s = Cn(n), u = i - s, i = s, p.push({
      segment: a,
      index: o,
      length: u,
      lengthAtSegment: s
    }), o -= 1;
  return p.find(({ lengthAtSegment: d }) => d <= e);
}
function pT(t, e) {
  const r = Xa(t), n = ls(r), i = Cn(r), o = (b) => {
    const A = b.x - e.x, x = b.y - e.y;
    return A * A + x * x;
  };
  let s = 8, u, a = 0, f = { x: 0, y: 0 }, c = 0, l = 1 / 0;
  for (let b = 0; b <= i; b += s)
    u = uo(n, b), a = o(u), a < l && (f = u, c = b, l = a);
  s /= 2;
  let p, d, _ = 0, g = 0, v = 0, y = 0;
  for (; s > 0.5; )
    _ = c - s, p = uo(n, _), v = o(p), g = c + s, d = uo(n, g), y = o(d), _ >= 0 && v < l ? (f = p, c = _, l = v) : g <= i && y < l ? (f = d, c = g, l = y) : s /= 2;
  const m = hT(r, c), w = Math.sqrt(l);
  return { closest: f, distance: w, segment: m };
}
function dT(t, e) {
  const { distance: r } = pT(t, e);
  return Math.abs(r) < 1e-3;
}
function _T(t, e = 0.5) {
  const r = t.slice(0, 2), n = t.slice(2, 4), i = t.slice(4, 6), o = t.slice(6, 8), s = Vt(r, n, e), u = Vt(n, i, e), a = Vt(i, o, e), f = Vt(s, u, e), c = Vt(u, a, e), l = Vt(f, c, e);
  return [
    // @ts-ignore
    ["C"].concat(s, f, l),
    // @ts-ignore
    ["C"].concat(c, a, o)
  ];
}
function tl(t) {
  return t.map((e, r, n) => {
    const i = r && n[r - 1].slice(-2).concat(e.slice(1)), o = r ? hv(
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
    return r ? s = o ? _T(i) : [e, e] : s = [e], {
      s: e,
      ss: s,
      l: o
    };
  });
}
function dv(t, e, r) {
  const n = tl(t), i = tl(e), o = n.length, s = i.length, u = n.filter((v) => v.l).length, a = i.filter((v) => v.l).length, f = n.filter((v) => v.l).reduce((v, { l: y }) => v + y, 0) / u || 0, c = i.filter((v) => v.l).reduce((v, { l: y }) => v + y, 0) / a || 0, l = r || Math.max(o, s), p = [f, c], d = [l - o, l - s];
  let _ = 0;
  const g = [n, i].map(
    (v, y) => (
      // @ts-ignore
      v.l === l ? v.map((m) => m.s) : v.map((m, w) => (_ = w && d[y] && m.l >= p[y], d[y] -= _ ? 1 : 0, _ ? m.ss : [m.s])).flat()
    )
  );
  return g[0].length === g[1].length ? g : dv(g[0], g[1], l);
}
const _3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleTo: z$,
  clonePath: cn,
  direction: iv,
  distanceSquareRoot: ln,
  equalizeSegments: dv,
  getDrawDirection: lT,
  getPathArea: pv,
  getPathBBox: sT,
  getPathBBoxTotalLength: uT,
  getPointAtLength: uo,
  getRotatedCurve: fT,
  getTotalLength: Cn,
  gradient: w$,
  isPointInStroke: dT,
  normalizePath: ls,
  path2Absolute: fv,
  path2Curve: lv,
  path2String: j$,
  reverseCurve: tT,
  rgb2arr: ev,
  toCSSGradient: E$,
  toRGB: nv,
  transform: N$,
  vertical: D$
}, Symbol.toStringTag, { value: "Module" }));
var ps = Symbol.for("immer-nothing"), zr = Symbol.for("immer-draftable"), N = Symbol.for("immer-state"), _v = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(t) {
    return `The plugin for '${t}' has not been loaded into Immer. To enable the plugin, import and call \`enable${t}()\` when initializing your application.`;
  },
  function(t) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${t}'`;
  },
  "This object has been frozen and should not be mutated",
  function(t) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + t;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(t) {
    return `'current' expects a draft, got: ${t}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(t) {
    return `'original' expects a draft, got: ${t}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function rt(t, ...e) {
  if (process.env.NODE_ENV !== "production") {
    const r = _v[t], n = typeof r == "function" ? r.apply(null, e) : r;
    throw new Error(`[Immer] ${n}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${t}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var gr = Object.getPrototypeOf;
function ze(t) {
  return !!t && !!t[N];
}
function pe(t) {
  return t ? gv(t) || Array.isArray(t) || !!t[zr] || !!t.constructor?.[zr] || Ri(t) || $i(t) : !1;
}
var gT = Object.prototype.constructor.toString();
function gv(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = gr(t);
  if (e === null)
    return !0;
  const r = Object.hasOwnProperty.call(e, "constructor") && e.constructor;
  return r === Object ? !0 : typeof r == "function" && Function.toString.call(r) === gT;
}
function vT(t) {
  return ze(t) || rt(15, t), t[N].base_;
}
function qr(t, e) {
  vr(t) === 0 ? Reflect.ownKeys(t).forEach((r) => {
    e(r, t[r], t);
  }) : t.forEach((r, n) => e(n, r, t));
}
function vr(t) {
  const e = t[N];
  return e ? e.type_ : Array.isArray(t) ? 1 : Ri(t) ? 2 : $i(t) ? 3 : 0;
}
function Xn(t, e) {
  return vr(t) === 2 ? t.has(e) : Object.prototype.hasOwnProperty.call(t, e);
}
function qs(t, e) {
  return vr(t) === 2 ? t.get(e) : t[e];
}
function vv(t, e, r) {
  const n = vr(t);
  n === 2 ? t.set(e, r) : n === 3 ? t.add(r) : t[e] = r;
}
function yT(t, e) {
  return t === e ? t !== 0 || 1 / t === 1 / e : t !== t && e !== e;
}
function Ri(t) {
  return t instanceof Map;
}
function $i(t) {
  return t instanceof Set;
}
function at(t) {
  return t.copy_ || t.base_;
}
function Su(t, e) {
  if (Ri(t))
    return new Map(t);
  if ($i(t))
    return new Set(t);
  if (Array.isArray(t))
    return Array.prototype.slice.call(t);
  const r = gv(t);
  if (e === !0 || e === "class_only" && !r) {
    const n = Object.getOwnPropertyDescriptors(t);
    delete n[N];
    let i = Reflect.ownKeys(n);
    for (let o = 0; o < i.length; o++) {
      const s = i[o], u = n[s];
      u.writable === !1 && (u.writable = !0, u.configurable = !0), (u.get || u.set) && (n[s] = {
        configurable: !0,
        writable: !0,
        // could live with !!desc.set as well here...
        enumerable: u.enumerable,
        value: t[s]
      });
    }
    return Object.create(gr(t), n);
  } else {
    const n = gr(t);
    if (n !== null && r)
      return { ...t };
    const i = Object.create(n);
    return Object.assign(i, t);
  }
}
function ds(t, e = !1) {
  return _s(t) || ze(t) || !pe(t) || (vr(t) > 1 && (t.set = t.add = t.clear = t.delete = mT), Object.freeze(t), e && Object.entries(t).forEach(([r, n]) => ds(n, !0))), t;
}
function mT() {
  rt(2);
}
function _s(t) {
  return Object.isFrozen(t);
}
var xu = {};
function yr(t) {
  const e = xu[t];
  return e || rt(0, t), e;
}
function yv(t, e) {
  xu[t] || (xu[t] = e);
}
var Vn;
function vo() {
  return Vn;
}
function bT(t, e) {
  return {
    drafts_: [],
    parent_: t,
    immer_: e,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: !0,
    unfinalizedDrafts_: 0
  };
}
function el(t, e) {
  e && (yr("Patches"), t.patches_ = [], t.inversePatches_ = [], t.patchListener_ = e);
}
function Ou(t) {
  Eu(t), t.drafts_.forEach(wT), t.drafts_ = null;
}
function Eu(t) {
  t === Vn && (Vn = t.parent_);
}
function rl(t) {
  return Vn = bT(Vn, t);
}
function wT(t) {
  const e = t[N];
  e.type_ === 0 || e.type_ === 1 ? e.revoke_() : e.revoked_ = !0;
}
function nl(t, e) {
  e.unfinalizedDrafts_ = e.drafts_.length;
  const r = e.drafts_[0];
  return t !== void 0 && t !== r ? (r[N].modified_ && (Ou(e), rt(4)), pe(t) && (t = yo(e, t), e.parent_ || mo(e, t)), e.patches_ && yr("Patches").generateReplacementPatches_(
    r[N].base_,
    t,
    e.patches_,
    e.inversePatches_
  )) : t = yo(e, r, []), Ou(e), e.patches_ && e.patchListener_(e.patches_, e.inversePatches_), t !== ps ? t : void 0;
}
function yo(t, e, r) {
  if (_s(e))
    return e;
  const n = e[N];
  if (!n)
    return qr(
      e,
      (i, o) => il(t, n, e, i, o, r)
    ), e;
  if (n.scope_ !== t)
    return e;
  if (!n.modified_)
    return mo(t, n.base_, !0), n.base_;
  if (!n.finalized_) {
    n.finalized_ = !0, n.scope_.unfinalizedDrafts_--;
    const i = n.copy_;
    let o = i, s = !1;
    n.type_ === 3 && (o = new Set(i), i.clear(), s = !0), qr(
      o,
      (u, a) => il(t, n, i, u, a, r, s)
    ), mo(t, i, !1), r && t.patches_ && yr("Patches").generatePatches_(
      n,
      r,
      t.patches_,
      t.inversePatches_
    );
  }
  return n.copy_;
}
function il(t, e, r, n, i, o, s) {
  if (process.env.NODE_ENV !== "production" && i === r && rt(5), ze(i)) {
    const u = o && e && e.type_ !== 3 && // Set objects are atomic since they have no keys.
    !Xn(e.assigned_, n) ? o.concat(n) : void 0, a = yo(t, i, u);
    if (vv(r, n, a), ze(a))
      t.canAutoFreeze_ = !1;
    else
      return;
  } else s && r.add(i);
  if (pe(i) && !_s(i)) {
    if (!t.immer_.autoFreeze_ && t.unfinalizedDrafts_ < 1)
      return;
    yo(t, i), (!e || !e.scope_.parent_) && typeof n != "symbol" && Object.prototype.propertyIsEnumerable.call(r, n) && mo(t, i);
  }
}
function mo(t, e, r = !1) {
  !t.parent_ && t.immer_.autoFreeze_ && t.canAutoFreeze_ && ds(e, r);
}
function AT(t, e) {
  const r = Array.isArray(t), n = {
    type_: r ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: e ? e.scope_ : vo(),
    // True for both shallow and deep changes.
    modified_: !1,
    // Used during finalization.
    finalized_: !1,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: e,
    // The base state.
    base_: t,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: !1
  };
  let i = n, o = Va;
  r && (i = [n], o = Jn);
  const { revoke: s, proxy: u } = Proxy.revocable(i, o);
  return n.draft_ = u, n.revoke_ = s, u;
}
var Va = {
  get(t, e) {
    if (e === N)
      return t;
    const r = at(t);
    if (!Xn(r, e))
      return ST(t, r, e);
    const n = r[e];
    return t.finalized_ || !pe(n) ? n : n === Us(t.base_, e) ? (Gs(t), t.copy_[e] = Qn(n, t)) : n;
  },
  has(t, e) {
    return e in at(t);
  },
  ownKeys(t) {
    return Reflect.ownKeys(at(t));
  },
  set(t, e, r) {
    const n = mv(at(t), e);
    if (n?.set)
      return n.set.call(t.draft_, r), !0;
    if (!t.modified_) {
      const i = Us(at(t), e), o = i?.[N];
      if (o && o.base_ === r)
        return t.copy_[e] = r, t.assigned_[e] = !1, !0;
      if (yT(r, i) && (r !== void 0 || Xn(t.base_, e)))
        return !0;
      Gs(t), Pe(t);
    }
    return t.copy_[e] === r && // special case: handle new props with value 'undefined'
    (r !== void 0 || e in t.copy_) || // special case: NaN
    Number.isNaN(r) && Number.isNaN(t.copy_[e]) || (t.copy_[e] = r, t.assigned_[e] = !0), !0;
  },
  deleteProperty(t, e) {
    return Us(t.base_, e) !== void 0 || e in t.base_ ? (t.assigned_[e] = !1, Gs(t), Pe(t)) : delete t.assigned_[e], t.copy_ && delete t.copy_[e], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(t, e) {
    const r = at(t), n = Reflect.getOwnPropertyDescriptor(r, e);
    return n && {
      writable: !0,
      configurable: t.type_ !== 1 || e !== "length",
      enumerable: n.enumerable,
      value: r[e]
    };
  },
  defineProperty() {
    rt(11);
  },
  getPrototypeOf(t) {
    return gr(t.base_);
  },
  setPrototypeOf() {
    rt(12);
  }
}, Jn = {};
qr(Va, (t, e) => {
  Jn[t] = function() {
    return arguments[0] = arguments[0][0], e.apply(this, arguments);
  };
});
Jn.deleteProperty = function(t, e) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(e)) && rt(13), Jn.set.call(this, t, e, void 0);
};
Jn.set = function(t, e, r) {
  return process.env.NODE_ENV !== "production" && e !== "length" && isNaN(parseInt(e)) && rt(14), Va.set.call(this, t[0], e, r, t[0]);
};
function Us(t, e) {
  const r = t[N];
  return (r ? at(r) : t)[e];
}
function ST(t, e, r) {
  const n = mv(e, r);
  return n ? "value" in n ? n.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    n.get?.call(t.draft_)
  ) : void 0;
}
function mv(t, e) {
  if (!(e in t))
    return;
  let r = gr(t);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, e);
    if (n)
      return n;
    r = gr(r);
  }
}
function Pe(t) {
  t.modified_ || (t.modified_ = !0, t.parent_ && Pe(t.parent_));
}
function Gs(t) {
  t.copy_ || (t.copy_ = Su(
    t.base_,
    t.scope_.immer_.useStrictShallowCopy_
  ));
}
var bv = class {
  constructor(t) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.produce = (e, r, n) => {
      if (typeof e == "function" && typeof r != "function") {
        const o = r;
        r = e;
        const s = this;
        return function(a = o, ...f) {
          return s.produce(a, (c) => r.call(this, c, ...f));
        };
      }
      typeof r != "function" && rt(6), n !== void 0 && typeof n != "function" && rt(7);
      let i;
      if (pe(e)) {
        const o = rl(this), s = Qn(e, void 0);
        let u = !0;
        try {
          i = r(s), u = !1;
        } finally {
          u ? Ou(o) : Eu(o);
        }
        return el(o, n), nl(i, o);
      } else if (!e || typeof e != "object") {
        if (i = r(e), i === void 0 && (i = e), i === ps && (i = void 0), this.autoFreeze_ && ds(i, !0), n) {
          const o = [], s = [];
          yr("Patches").generateReplacementPatches_(e, i, o, s), n(o, s);
        }
        return i;
      } else
        rt(1, e);
    }, this.produceWithPatches = (e, r) => {
      if (typeof e == "function")
        return (s, ...u) => this.produceWithPatches(s, (a) => e(a, ...u));
      let n, i;
      return [this.produce(e, r, (s, u) => {
        n = s, i = u;
      }), n, i];
    }, typeof t?.autoFreeze == "boolean" && this.setAutoFreeze(t.autoFreeze), typeof t?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(t.useStrictShallowCopy);
  }
  createDraft(t) {
    pe(t) || rt(8), ze(t) && (t = wv(t));
    const e = rl(this), r = Qn(t, void 0);
    return r[N].isManual_ = !0, Eu(e), r;
  }
  finishDraft(t, e) {
    const r = t && t[N];
    (!r || !r.isManual_) && rt(9);
    const { scope_: n } = r;
    return el(n, e), nl(void 0, n);
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
  applyPatches(t, e) {
    let r;
    for (r = e.length - 1; r >= 0; r--) {
      const i = e[r];
      if (i.path.length === 0 && i.op === "replace") {
        t = i.value;
        break;
      }
    }
    r > -1 && (e = e.slice(r + 1));
    const n = yr("Patches").applyPatches_;
    return ze(t) ? n(t, e) : this.produce(
      t,
      (i) => n(i, e)
    );
  }
};
function Qn(t, e) {
  const r = Ri(t) ? yr("MapSet").proxyMap_(t, e) : $i(t) ? yr("MapSet").proxySet_(t, e) : AT(t, e);
  return (e ? e.scope_ : vo()).drafts_.push(r), r;
}
function wv(t) {
  return ze(t) || rt(10, t), Av(t);
}
function Av(t) {
  if (!pe(t) || _s(t))
    return t;
  const e = t[N];
  let r;
  if (e) {
    if (!e.modified_)
      return e.base_;
    e.finalized_ = !0, r = Su(t, e.scope_.immer_.useStrictShallowCopy_);
  } else
    r = Su(t, !0);
  return qr(r, (n, i) => {
    vv(r, n, Av(i));
  }), e && (e.finalized_ = !1), r;
}
function xT() {
  process.env.NODE_ENV !== "production" && _v.push(
    'Sets cannot have "replace" patches.',
    function(p) {
      return "Unsupported patch operation: " + p;
    },
    function(p) {
      return "Cannot apply patch, path doesn't resolve: " + p;
    },
    "Patching reserved attributes like __proto__, prototype and constructor is not allowed"
  );
  const e = "replace", r = "add", n = "remove";
  function i(p, d, _, g) {
    switch (p.type_) {
      case 0:
      case 2:
        return s(
          p,
          d,
          _,
          g
        );
      case 1:
        return o(p, d, _, g);
      case 3:
        return u(
          p,
          d,
          _,
          g
        );
    }
  }
  function o(p, d, _, g) {
    let { base_: v, assigned_: y } = p, m = p.copy_;
    m.length < v.length && ([v, m] = [m, v], [_, g] = [g, _]);
    for (let w = 0; w < v.length; w++)
      if (y[w] && m[w] !== v[w]) {
        const b = d.concat([w]);
        _.push({
          op: e,
          path: b,
          // Need to maybe clone it, as it can in fact be the original value
          // due to the base/copy inversion at the start of this function
          value: l(m[w])
        }), g.push({
          op: e,
          path: b,
          value: l(v[w])
        });
      }
    for (let w = v.length; w < m.length; w++) {
      const b = d.concat([w]);
      _.push({
        op: r,
        path: b,
        // Need to maybe clone it, as it can in fact be the original value
        // due to the base/copy inversion at the start of this function
        value: l(m[w])
      });
    }
    for (let w = m.length - 1; v.length <= w; --w) {
      const b = d.concat([w]);
      g.push({
        op: n,
        path: b
      });
    }
  }
  function s(p, d, _, g) {
    const { base_: v, copy_: y } = p;
    qr(p.assigned_, (m, w) => {
      const b = qs(v, m), A = qs(y, m), x = w ? Xn(v, m) ? e : r : n;
      if (b === A && x === e)
        return;
      const M = d.concat(m);
      _.push(x === n ? { op: x, path: M } : { op: x, path: M, value: A }), g.push(
        x === r ? { op: n, path: M } : x === n ? { op: r, path: M, value: l(b) } : { op: e, path: M, value: l(b) }
      );
    });
  }
  function u(p, d, _, g) {
    let { base_: v, copy_: y } = p, m = 0;
    v.forEach((w) => {
      if (!y.has(w)) {
        const b = d.concat([m]);
        _.push({
          op: n,
          path: b,
          value: w
        }), g.unshift({
          op: r,
          path: b,
          value: w
        });
      }
      m++;
    }), m = 0, y.forEach((w) => {
      if (!v.has(w)) {
        const b = d.concat([m]);
        _.push({
          op: r,
          path: b,
          value: w
        }), g.unshift({
          op: n,
          path: b,
          value: w
        });
      }
      m++;
    });
  }
  function a(p, d, _, g) {
    _.push({
      op: e,
      path: [],
      value: d === ps ? void 0 : d
    }), g.push({
      op: e,
      path: [],
      value: p
    });
  }
  function f(p, d) {
    return d.forEach((_) => {
      const { path: g, op: v } = _;
      let y = p;
      for (let A = 0; A < g.length - 1; A++) {
        const x = vr(y);
        let M = g[A];
        typeof M != "string" && typeof M != "number" && (M = "" + M), (x === 0 || x === 1) && (M === "__proto__" || M === "constructor") && rt(19), typeof y == "function" && M === "prototype" && rt(19), y = qs(y, M), typeof y != "object" && rt(18, g.join("/"));
      }
      const m = vr(y), w = c(_.value), b = g[g.length - 1];
      switch (v) {
        case e:
          switch (m) {
            case 2:
              return y.set(b, w);
            case 3:
              rt(16);
            default:
              return y[b] = w;
          }
        case r:
          switch (m) {
            case 1:
              return b === "-" ? y.push(w) : y.splice(b, 0, w);
            case 2:
              return y.set(b, w);
            case 3:
              return y.add(w);
            default:
              return y[b] = w;
          }
        case n:
          switch (m) {
            case 1:
              return y.splice(b, 1);
            case 2:
              return y.delete(b);
            case 3:
              return y.delete(_.value);
            default:
              return delete y[b];
          }
        default:
          rt(17, v);
      }
    }), p;
  }
  function c(p) {
    if (!pe(p))
      return p;
    if (Array.isArray(p))
      return p.map(c);
    if (Ri(p))
      return new Map(
        Array.from(p.entries()).map(([_, g]) => [_, c(g)])
      );
    if ($i(p))
      return new Set(Array.from(p).map(c));
    const d = Object.create(gr(p));
    for (const _ in p)
      d[_] = c(p[_]);
    return Xn(p, zr) && (d[zr] = p[zr]), d;
  }
  function l(p) {
    return ze(p) ? c(p) : p;
  }
  yv("Patches", {
    applyPatches_: f,
    generatePatches_: i,
    generateReplacementPatches_: a
  });
}
function OT() {
  class t extends Map {
    constructor(a, f) {
      super(), this[N] = {
        type_: 2,
        parent_: f,
        scope_: f ? f.scope_ : vo(),
        modified_: !1,
        finalized_: !1,
        copy_: void 0,
        assigned_: void 0,
        base_: a,
        draft_: this,
        isManual_: !1,
        revoked_: !1
      };
    }
    get size() {
      return at(this[N]).size;
    }
    has(a) {
      return at(this[N]).has(a);
    }
    set(a, f) {
      const c = this[N];
      return s(c), (!at(c).has(a) || at(c).get(a) !== f) && (r(c), Pe(c), c.assigned_.set(a, !0), c.copy_.set(a, f), c.assigned_.set(a, !0)), this;
    }
    delete(a) {
      if (!this.has(a))
        return !1;
      const f = this[N];
      return s(f), r(f), Pe(f), f.base_.has(a) ? f.assigned_.set(a, !1) : f.assigned_.delete(a), f.copy_.delete(a), !0;
    }
    clear() {
      const a = this[N];
      s(a), at(a).size && (r(a), Pe(a), a.assigned_ = /* @__PURE__ */ new Map(), qr(a.base_, (f) => {
        a.assigned_.set(f, !1);
      }), a.copy_.clear());
    }
    forEach(a, f) {
      const c = this[N];
      at(c).forEach((l, p, d) => {
        a.call(f, this.get(p), p, this);
      });
    }
    get(a) {
      const f = this[N];
      s(f);
      const c = at(f).get(a);
      if (f.finalized_ || !pe(c) || c !== f.base_.get(a))
        return c;
      const l = Qn(c, f);
      return r(f), f.copy_.set(a, l), l;
    }
    keys() {
      return at(this[N]).keys();
    }
    values() {
      const a = this.keys();
      return {
        [Symbol.iterator]: () => this.values(),
        next: () => {
          const f = a.next();
          return f.done ? f : {
            done: !1,
            value: this.get(f.value)
          };
        }
      };
    }
    entries() {
      const a = this.keys();
      return {
        [Symbol.iterator]: () => this.entries(),
        next: () => {
          const f = a.next();
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
  function e(u, a) {
    return new t(u, a);
  }
  function r(u) {
    u.copy_ || (u.assigned_ = /* @__PURE__ */ new Map(), u.copy_ = new Map(u.base_));
  }
  class n extends Set {
    constructor(a, f) {
      super(), this[N] = {
        type_: 3,
        parent_: f,
        scope_: f ? f.scope_ : vo(),
        modified_: !1,
        finalized_: !1,
        copy_: void 0,
        base_: a,
        draft_: this,
        drafts_: /* @__PURE__ */ new Map(),
        revoked_: !1,
        isManual_: !1
      };
    }
    get size() {
      return at(this[N]).size;
    }
    has(a) {
      const f = this[N];
      return s(f), f.copy_ ? !!(f.copy_.has(a) || f.drafts_.has(a) && f.copy_.has(f.drafts_.get(a))) : f.base_.has(a);
    }
    add(a) {
      const f = this[N];
      return s(f), this.has(a) || (o(f), Pe(f), f.copy_.add(a)), this;
    }
    delete(a) {
      if (!this.has(a))
        return !1;
      const f = this[N];
      return s(f), o(f), Pe(f), f.copy_.delete(a) || (f.drafts_.has(a) ? f.copy_.delete(f.drafts_.get(a)) : (
        /* istanbul ignore next */
        !1
      ));
    }
    clear() {
      const a = this[N];
      s(a), at(a).size && (o(a), Pe(a), a.copy_.clear());
    }
    values() {
      const a = this[N];
      return s(a), o(a), a.copy_.values();
    }
    entries() {
      const a = this[N];
      return s(a), o(a), a.copy_.entries();
    }
    keys() {
      return this.values();
    }
    [Symbol.iterator]() {
      return this.values();
    }
    forEach(a, f) {
      const c = this.values();
      let l = c.next();
      for (; !l.done; )
        a.call(f, l.value, l.value, this), l = c.next();
    }
  }
  function i(u, a) {
    return new n(u, a);
  }
  function o(u) {
    u.copy_ || (u.copy_ = /* @__PURE__ */ new Set(), u.base_.forEach((a) => {
      if (pe(a)) {
        const f = Qn(a, u);
        u.drafts_.set(a, f), u.copy_.add(f);
      } else
        u.copy_.add(a);
    }));
  }
  function s(u) {
    u.revoked_ && rt(3, JSON.stringify(at(u)));
  }
  yv("MapSet", { proxyMap_: e, proxySet_: i });
}
var Kt = new bv(), ET = Kt.produce, RT = Kt.produceWithPatches.bind(
  Kt
), $T = Kt.setAutoFreeze.bind(Kt), TT = Kt.setUseStrictShallowCopy.bind(Kt), MT = Kt.applyPatches.bind(Kt), IT = Kt.createDraft.bind(Kt), PT = Kt.finishDraft.bind(Kt);
function LT(t) {
  return t;
}
function CT(t) {
  return t;
}
const g3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Immer: bv,
  applyPatches: MT,
  castDraft: LT,
  castImmutable: CT,
  createDraft: IT,
  current: wv,
  enableMapSet: OT,
  enablePatches: xT,
  finishDraft: PT,
  freeze: ds,
  immerable: zr,
  isDraft: ze,
  isDraftable: pe,
  nothing: ps,
  original: vT,
  produce: ET,
  produceWithPatches: RT,
  setAutoFreeze: $T,
  setUseStrictShallowCopy: TT
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
var Ti = "delete", G = 5, jt = 1 << G, St = jt - 1, L = {};
function Ru() {
  return { value: !1 };
}
function Jt(t) {
  t && (t.value = !0);
}
function Ja() {
}
function Ur(t) {
  return t.size === void 0 && (t.size = t.__iterate(Sv)), t.size;
}
function Qe(t, e) {
  if (typeof e != "number") {
    var r = e >>> 0;
    if ("" + r !== e || r === 4294967295)
      return NaN;
    e = r;
  }
  return e < 0 ? Ur(t) + e : e;
}
function Sv() {
  return !0;
}
function Mi(t, e, r) {
  return (t === 0 && !Ov(t) || r !== void 0 && t <= -r) && (e === void 0 || r !== void 0 && e >= r);
}
function hn(t, e) {
  return xv(t, e, 0);
}
function Ii(t, e) {
  return xv(t, e, e);
}
function xv(t, e, r) {
  return t === void 0 ? r : Ov(t) ? e === 1 / 0 ? e : Math.max(0, e + t) | 0 : e === void 0 || e === t ? t : Math.min(e, t) | 0;
}
function Ov(t) {
  return t < 0 || t === 0 && 1 / t === -1 / 0;
}
var Ev = "@@__IMMUTABLE_ITERABLE__@@";
function Nt(t) {
  return !!(t && // @ts-expect-error: maybeCollection is typed as `{}`, need to change in 6.0 to `maybeCollection && typeof maybeCollection === 'object' && IS_COLLECTION_SYMBOL in maybeCollection`
  t[Ev]);
}
var bo = "@@__IMMUTABLE_KEYED__@@";
function H(t) {
  return !!(t && // @ts-expect-error: maybeKeyed is typed as `{}`, need to change in 6.0 to `maybeKeyed && typeof maybeKeyed === 'object' && IS_KEYED_SYMBOL in maybeKeyed`
  t[bo]);
}
var wo = "@@__IMMUTABLE_INDEXED__@@";
function zt(t) {
  return !!(t && // @ts-expect-error: maybeIndexed is typed as `{}`, need to change in 6.0 to `maybeIndexed && typeof maybeIndexed === 'object' && IS_INDEXED_SYMBOL in maybeIndexed`
  t[wo]);
}
function gs(t) {
  return H(t) || zt(t);
}
var ct = function(e) {
  return Nt(e) ? e : mt(e);
}, se = /* @__PURE__ */ function(t) {
  function e(r) {
    return H(r) ? r : fr(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e;
}(ct), Or = /* @__PURE__ */ function(t) {
  function e(r) {
    return zt(r) ? r : ae(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e;
}(ct), pn = /* @__PURE__ */ function(t) {
  function e(r) {
    return Nt(r) && !gs(r) ? r : gn(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e;
}(ct);
ct.Keyed = se;
ct.Indexed = Or;
ct.Set = pn;
var Rv = "@@__IMMUTABLE_SEQ__@@";
function vs(t) {
  return !!(t && // @ts-expect-error: maybeSeq is typed as `{}`, need to change in 6.0 to `maybeSeq && typeof maybeSeq === 'object' && MAYBE_SEQ_SYMBOL in maybeSeq`
  t[Rv]);
}
var $v = "@@__IMMUTABLE_RECORD__@@";
function ar(t) {
  return !!(t && // @ts-expect-error: maybeRecord is typed as `{}`, need to change in 6.0 to `maybeRecord && typeof maybeRecord === 'object' && IS_RECORD_SYMBOL in maybeRecord`
  t[$v]);
}
function ue(t) {
  return Nt(t) || ar(t);
}
var tr = "@@__IMMUTABLE_ORDERED__@@";
function le(t) {
  return !!(t && // @ts-expect-error: maybeOrdered is typed as `{}`, need to change in 6.0 to `maybeOrdered && typeof maybeOrdered === 'object' && IS_ORDERED_SYMBOL in maybeOrdered`
  t[tr]);
}
var dn = 0, Yt = 1, Zt = 2, $u = typeof Symbol == "function" && Symbol.iterator, Tv = "@@iterator", ys = $u || Tv, C = function(e) {
  this.next = e;
};
C.prototype.toString = function() {
  return "[Iterator]";
};
C.KEYS = dn;
C.VALUES = Yt;
C.ENTRIES = Zt;
C.prototype.inspect = C.prototype.toSource = function() {
  return this.toString();
};
C.prototype[ys] = function() {
  return this;
};
function Z(t, e, r, n) {
  var i = t === dn ? e : t === Yt ? r : [e, r];
  return n ? n.value = i : n = {
    value: i,
    done: !1
  }, n;
}
function yt() {
  return { value: void 0, done: !0 };
}
function Qa(t) {
  return Array.isArray(t) ? !0 : !!ms(t);
}
function ol(t) {
  return t && typeof t.next == "function";
}
function Tu(t) {
  var e = ms(t);
  return e && e.call(t);
}
function ms(t) {
  var e = t && ($u && t[$u] || t[Tv]);
  if (typeof e == "function")
    return e;
}
function FT(t) {
  var e = ms(t);
  return e && e === t.entries;
}
function NT(t) {
  var e = ms(t);
  return e && e === t.keys;
}
var _n = Object.prototype.hasOwnProperty;
function tf(t) {
  return Array.isArray(t) || typeof t == "string" ? !0 : t && typeof t == "object" && // @ts-expect-error check that `'length' in value &&`
  Number.isInteger(t.length) && // @ts-expect-error check that `'length' in value &&`
  t.length >= 0 && // @ts-expect-error check that `'length' in value &&`
  (t.length === 0 ? (
    // Only {length: 0} is considered Array-like.
    Object.keys(t).length === 1
  ) : (
    // An object is only Array-like if it has a property where the last value
    // in the array-like may be found (which could be undefined).
    // @ts-expect-error check that `'length' in value &&`
    t.hasOwnProperty(t.length - 1)
  ));
}
var mt = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? rf() : ue(r) ? r.toSeq() : DT(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.toSeq = function() {
    return this;
  }, e.prototype.toString = function() {
    return this.__toString("Seq {", "}");
  }, e.prototype.cacheResult = function() {
    return !this._cache && this.__iterateUncached && (this._cache = this.entrySeq().toArray(), this.size = this._cache.length), this;
  }, e.prototype.__iterate = function(n, i) {
    var o = this._cache;
    if (o) {
      for (var s = o.length, u = 0; u !== s; ) {
        var a = o[i ? s - ++u : u++];
        if (n(a[1], a[0], this) === !1)
          break;
      }
      return u;
    }
    return this.__iterateUncached(n, i);
  }, e.prototype.__iterator = function(n, i) {
    var o = this._cache;
    if (o) {
      var s = o.length, u = 0;
      return new C(function() {
        if (u === s)
          return yt();
        var a = o[i ? s - ++u : u++];
        return Z(n, a[0], a[1]);
      });
    }
    return this.__iteratorUncached(n, i);
  }, e;
}(ct), fr = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? rf().toKeyedSeq() : Nt(r) ? H(r) ? r.toSeq() : r.fromEntrySeq() : ar(r) ? r.toSeq() : nf(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.toKeyedSeq = function() {
    return this;
  }, e;
}(mt), ae = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? rf() : Nt(r) ? H(r) ? r.entrySeq() : r.toIndexedSeq() : ar(r) ? r.toSeq().entrySeq() : Mv(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return e(arguments);
  }, e.prototype.toIndexedSeq = function() {
    return this;
  }, e.prototype.toString = function() {
    return this.__toString("Seq [", "]");
  }, e;
}(mt), gn = /* @__PURE__ */ function(t) {
  function e(r) {
    return (Nt(r) && !gs(r) ? r : ae(r)).toSetSeq();
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return e(arguments);
  }, e.prototype.toSetSeq = function() {
    return this;
  }, e;
}(mt);
mt.isSeq = vs;
mt.Keyed = fr;
mt.Set = gn;
mt.Indexed = ae;
mt.prototype[Rv] = !0;
var Gr = /* @__PURE__ */ function(t) {
  function e(r) {
    this._array = r, this.size = r.length;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.get = function(n, i) {
    return this.has(n) ? this._array[Qe(this, n)] : i;
  }, e.prototype.__iterate = function(n, i) {
    for (var o = this._array, s = o.length, u = 0; u !== s; ) {
      var a = i ? s - ++u : u++;
      if (n(o[a], a, this) === !1)
        break;
    }
    return u;
  }, e.prototype.__iterator = function(n, i) {
    var o = this._array, s = o.length, u = 0;
    return new C(function() {
      if (u === s)
        return yt();
      var a = i ? s - ++u : u++;
      return Z(n, a, o[a]);
    });
  }, e;
}(ae), ef = /* @__PURE__ */ function(t) {
  function e(r) {
    var n = Object.keys(r).concat(
      Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(r) : []
    );
    this._object = r, this._keys = n, this.size = n.length;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.get = function(n, i) {
    return i !== void 0 && !this.has(n) ? i : this._object[n];
  }, e.prototype.has = function(n) {
    return _n.call(this._object, n);
  }, e.prototype.__iterate = function(n, i) {
    for (var o = this._object, s = this._keys, u = s.length, a = 0; a !== u; ) {
      var f = s[i ? u - ++a : a++];
      if (n(o[f], f, this) === !1)
        break;
    }
    return a;
  }, e.prototype.__iterator = function(n, i) {
    var o = this._object, s = this._keys, u = s.length, a = 0;
    return new C(function() {
      if (a === u)
        return yt();
      var f = s[i ? u - ++a : a++];
      return Z(n, f, o[f]);
    });
  }, e;
}(fr);
ef.prototype[tr] = !0;
var zT = /* @__PURE__ */ function(t) {
  function e(r) {
    this._collection = r, this.size = r.length || r.size;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.__iterateUncached = function(n, i) {
    if (i)
      return this.cacheResult().__iterate(n, i);
    var o = this._collection, s = Tu(o), u = 0;
    if (ol(s))
      for (var a; !(a = s.next()).done && n(a.value, u++, this) !== !1; )
        ;
    return u;
  }, e.prototype.__iteratorUncached = function(n, i) {
    if (i)
      return this.cacheResult().__iterator(n, i);
    var o = this._collection, s = Tu(o);
    if (!ol(s))
      return new C(yt);
    var u = 0;
    return new C(function() {
      var a = s.next();
      return a.done ? a : Z(n, u++, a.value);
    });
  }, e;
}(ae), sl;
function rf() {
  return sl || (sl = new Gr([]));
}
function nf(t) {
  var e = of(t);
  if (e)
    return e.fromEntrySeq();
  if (typeof t == "object")
    return new ef(t);
  throw new TypeError(
    "Expected Array or collection object of [k, v] entries, or keyed object: " + t
  );
}
function Mv(t) {
  var e = of(t);
  if (e)
    return e;
  throw new TypeError(
    "Expected Array or collection object of values: " + t
  );
}
function DT(t) {
  var e = of(t);
  if (e)
    return FT(t) ? e.fromEntrySeq() : NT(t) ? e.toSetSeq() : e;
  if (typeof t == "object")
    return new ef(t);
  throw new TypeError(
    "Expected Array or collection object of values, or keyed object: " + t
  );
}
function of(t) {
  return tf(t) ? new Gr(t) : Qa(t) ? new zT(t) : void 0;
}
var Iv = "@@__IMMUTABLE_MAP__@@";
function bs(t) {
  return !!(t && // @ts-expect-error: maybeMap is typed as `{}`, need to change in 6.0 to `maybeMap && typeof maybeMap === 'object' && IS_MAP_SYMBOL in maybeMap`
  t[Iv]);
}
function sf(t) {
  return bs(t) && le(t);
}
function Mu(t) {
  return !!(t && // @ts-expect-error: maybeValue is typed as `{}`
  typeof t.equals == "function" && // @ts-expect-error: maybeValue is typed as `{}`
  typeof t.hashCode == "function");
}
function ft(t, e) {
  if (t === e || t !== t && e !== e)
    return !0;
  if (!t || !e)
    return !1;
  if (typeof t.valueOf == "function" && typeof e.valueOf == "function") {
    if (t = t.valueOf(), e = e.valueOf(), t === e || t !== t && e !== e)
      return !0;
    if (!t || !e)
      return !1;
  }
  return !!(Mu(t) && Mu(e) && t.equals(e));
}
var On = typeof Math.imul == "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function(e, r) {
  e |= 0, r |= 0;
  var n = e & 65535, i = r & 65535;
  return n * i + ((e >>> 16) * i + n * (r >>> 16) << 16 >>> 0) | 0;
};
function ws(t) {
  return t >>> 1 & 1073741824 | t & 3221225471;
}
var BT = Object.prototype.valueOf;
function Lt(t) {
  if (t == null)
    return ul(t);
  if (typeof t.hashCode == "function")
    return ws(t.hashCode(t));
  var e = kT(t);
  if (e == null)
    return ul(e);
  switch (typeof e) {
    case "boolean":
      return e ? 1108378657 : 1108378656;
    case "number":
      return jT(e);
    case "string":
      return e.length > HT ? WT(e) : Iu(e);
    case "object":
    case "function":
      return UT(e);
    case "symbol":
      return qT(e);
    default:
      if (typeof e.toString == "function")
        return Iu(e.toString());
      throw new Error("Value type " + typeof e + " cannot be hashed.");
  }
}
function ul(t) {
  return t === null ? 1108378658 : (
    /* undefined */
    1108378659
  );
}
function jT(t) {
  if (t !== t || t === 1 / 0)
    return 0;
  var e = t | 0;
  for (e !== t && (e ^= t * 4294967295); t > 4294967295; )
    t /= 4294967295, e ^= t;
  return ws(e);
}
function WT(t) {
  var e = Ks[t];
  return e === void 0 && (e = Iu(t), Hs === KT && (Hs = 0, Ks = {}), Hs++, Ks[t] = e), e;
}
function Iu(t) {
  for (var e = 0, r = 0; r < t.length; r++)
    e = 31 * e + t.charCodeAt(r) | 0;
  return ws(e);
}
function qT(t) {
  var e = cl[t];
  return e !== void 0 || (e = Pv(), cl[t] = e), e;
}
function UT(t) {
  var e;
  if (Pu && (e = Lu.get(t), e !== void 0) || (e = t[pr], e !== void 0) || !fl && (e = t.propertyIsEnumerable && t.propertyIsEnumerable[pr], e !== void 0 || (e = GT(t), e !== void 0)))
    return e;
  if (e = Pv(), Pu)
    Lu.set(t, e);
  else {
    if (al !== void 0 && al(t) === !1)
      throw new Error("Non-extensible objects are not allowed as keys.");
    if (fl)
      Object.defineProperty(t, pr, {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: e
      });
    else if (t.propertyIsEnumerable !== void 0 && t.propertyIsEnumerable === t.constructor.prototype.propertyIsEnumerable)
      t.propertyIsEnumerable = function() {
        return this.constructor.prototype.propertyIsEnumerable.apply(
          this,
          arguments
        );
      }, t.propertyIsEnumerable[pr] = e;
    else if (t.nodeType !== void 0)
      t[pr] = e;
    else
      throw new Error("Unable to set a non-enumerable property on object.");
  }
  return e;
}
var al = Object.isExtensible, fl = function() {
  try {
    return Object.defineProperty({}, "@", {}), !0;
  } catch {
    return !1;
  }
}();
function GT(t) {
  if (t && t.nodeType > 0)
    switch (t.nodeType) {
      case 1:
        return t.uniqueID;
      case 9:
        return t.documentElement && t.documentElement.uniqueID;
    }
}
function kT(t) {
  return t.valueOf !== BT && typeof t.valueOf == "function" ? t.valueOf(t) : t;
}
function Pv() {
  var t = ++ks;
  return ks & 1073741824 && (ks = 0), t;
}
var Pu = typeof WeakMap == "function", Lu;
Pu && (Lu = /* @__PURE__ */ new WeakMap());
var cl = /* @__PURE__ */ Object.create(null), ks = 0, pr = "__immutablehash__";
typeof Symbol == "function" && (pr = Symbol(pr));
var HT = 16, KT = 255, Hs = 0, Ks = {}, As = /* @__PURE__ */ function(t) {
  function e(r, n) {
    this._iter = r, this._useKeys = n, this.size = r.size;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.get = function(n, i) {
    return this._iter.get(n, i);
  }, e.prototype.has = function(n) {
    return this._iter.has(n);
  }, e.prototype.valueSeq = function() {
    return this._iter.valueSeq();
  }, e.prototype.reverse = function() {
    var n = this, i = uf(this, !0);
    return this._useKeys || (i.valueSeq = function() {
      return n._iter.toSeq().reverse();
    }), i;
  }, e.prototype.map = function(n, i) {
    var o = this, s = zv(this, n, i);
    return this._useKeys || (s.valueSeq = function() {
      return o._iter.toSeq().map(n, i);
    }), s;
  }, e.prototype.__iterate = function(n, i) {
    var o = this;
    return this._iter.__iterate(function(s, u) {
      return n(s, u, o);
    }, i);
  }, e.prototype.__iterator = function(n, i) {
    return this._iter.__iterator(n, i);
  }, e;
}(fr);
As.prototype[tr] = !0;
var Lv = /* @__PURE__ */ function(t) {
  function e(r) {
    this._iter = r, this.size = r.size;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.includes = function(n) {
    return this._iter.includes(n);
  }, e.prototype.__iterate = function(n, i) {
    var o = this, s = 0;
    return i && Ur(this), this._iter.__iterate(
      function(u) {
        return n(u, i ? o.size - ++s : s++, o);
      },
      i
    );
  }, e.prototype.__iterator = function(n, i) {
    var o = this, s = this._iter.__iterator(Yt, i), u = 0;
    return i && Ur(this), new C(function() {
      var a = s.next();
      return a.done ? a : Z(
        n,
        i ? o.size - ++u : u++,
        a.value,
        a
      );
    });
  }, e;
}(ae), Cv = /* @__PURE__ */ function(t) {
  function e(r) {
    this._iter = r, this.size = r.size;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.has = function(n) {
    return this._iter.includes(n);
  }, e.prototype.__iterate = function(n, i) {
    var o = this;
    return this._iter.__iterate(function(s) {
      return n(s, s, o);
    }, i);
  }, e.prototype.__iterator = function(n, i) {
    var o = this._iter.__iterator(Yt, i);
    return new C(function() {
      var s = o.next();
      return s.done ? s : Z(n, s.value, s.value, s);
    });
  }, e;
}(gn), Fv = /* @__PURE__ */ function(t) {
  function e(r) {
    this._iter = r, this.size = r.size;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.entrySeq = function() {
    return this._iter.toSeq();
  }, e.prototype.__iterate = function(n, i) {
    var o = this;
    return this._iter.__iterate(function(s) {
      if (s) {
        hl(s);
        var u = Nt(s);
        return n(
          u ? s.get(1) : s[1],
          u ? s.get(0) : s[0],
          o
        );
      }
    }, i);
  }, e.prototype.__iterator = function(n, i) {
    var o = this._iter.__iterator(Yt, i);
    return new C(function() {
      for (; ; ) {
        var s = o.next();
        if (s.done)
          return s;
        var u = s.value;
        if (u) {
          hl(u);
          var a = Nt(u);
          return Z(
            n,
            a ? u.get(0) : u[0],
            a ? u.get(1) : u[1],
            s
          );
        }
      }
    });
  }, e;
}(fr);
Lv.prototype.cacheResult = As.prototype.cacheResult = Cv.prototype.cacheResult = Fv.prototype.cacheResult = cf;
function Nv(t) {
  var e = Re(t);
  return e._iter = t, e.size = t.size, e.flip = function() {
    return t;
  }, e.reverse = function() {
    var r = t.reverse.apply(this);
    return r.flip = function() {
      return t.reverse();
    }, r;
  }, e.has = function(r) {
    return t.includes(r);
  }, e.includes = function(r) {
    return t.has(r);
  }, e.cacheResult = cf, e.__iterateUncached = function(r, n) {
    var i = this;
    return t.__iterate(function(o, s) {
      return r(s, o, i) !== !1;
    }, n);
  }, e.__iteratorUncached = function(r, n) {
    if (r === Zt) {
      var i = t.__iterator(r, n);
      return new C(function() {
        var o = i.next();
        if (!o.done) {
          var s = o.value[0];
          o.value[0] = o.value[1], o.value[1] = s;
        }
        return o;
      });
    }
    return t.__iterator(
      r === Yt ? dn : Yt,
      n
    );
  }, e;
}
function zv(t, e, r) {
  var n = Re(t);
  return n.size = t.size, n.has = function(i) {
    return t.has(i);
  }, n.get = function(i, o) {
    var s = t.get(i, L);
    return s === L ? o : e.call(r, s, i, t);
  }, n.__iterateUncached = function(i, o) {
    var s = this;
    return t.__iterate(
      function(u, a, f) {
        return i(e.call(r, u, a, f), a, s) !== !1;
      },
      o
    );
  }, n.__iteratorUncached = function(i, o) {
    var s = t.__iterator(Zt, o);
    return new C(function() {
      var u = s.next();
      if (u.done)
        return u;
      var a = u.value, f = a[0];
      return Z(
        i,
        f,
        e.call(r, a[1], f, t),
        u
      );
    });
  }, n;
}
function uf(t, e) {
  var r = this, n = Re(t);
  return n._iter = t, n.size = t.size, n.reverse = function() {
    return t;
  }, t.flip && (n.flip = function() {
    var i = Nv(t);
    return i.reverse = function() {
      return t.flip();
    }, i;
  }), n.get = function(i, o) {
    return t.get(e ? i : -1 - i, o);
  }, n.has = function(i) {
    return t.has(e ? i : -1 - i);
  }, n.includes = function(i) {
    return t.includes(i);
  }, n.cacheResult = cf, n.__iterate = function(i, o) {
    var s = this, u = 0;
    return o && Ur(t), t.__iterate(
      function(a, f) {
        return i(a, e ? f : o ? s.size - ++u : u++, s);
      },
      !o
    );
  }, n.__iterator = function(i, o) {
    var s = 0;
    o && Ur(t);
    var u = t.__iterator(Zt, !o);
    return new C(function() {
      var a = u.next();
      if (a.done)
        return a;
      var f = a.value;
      return Z(
        i,
        e ? f[0] : o ? r.size - ++s : s++,
        f[1],
        a
      );
    });
  }, n;
}
function Dv(t, e, r, n) {
  var i = Re(t);
  return n && (i.has = function(o) {
    var s = t.get(o, L);
    return s !== L && !!e.call(r, s, o, t);
  }, i.get = function(o, s) {
    var u = t.get(o, L);
    return u !== L && e.call(r, u, o, t) ? u : s;
  }), i.__iterateUncached = function(o, s) {
    var u = this, a = 0;
    return t.__iterate(function(f, c, l) {
      if (e.call(r, f, c, l))
        return a++, o(f, n ? c : a - 1, u);
    }, s), a;
  }, i.__iteratorUncached = function(o, s) {
    var u = t.__iterator(Zt, s), a = 0;
    return new C(function() {
      for (; ; ) {
        var f = u.next();
        if (f.done)
          return f;
        var c = f.value, l = c[0], p = c[1];
        if (e.call(r, p, l, t))
          return Z(o, n ? l : a++, p, f);
      }
    });
  }, i;
}
function YT(t, e, r) {
  var n = Rr().asMutable();
  return t.__iterate(function(i, o) {
    n.update(e.call(r, i, o, t), 0, function(s) {
      return s + 1;
    });
  }), n.asImmutable();
}
function ZT(t, e, r) {
  var n = H(t), i = (le(t) ? be() : Rr()).asMutable();
  t.__iterate(function(s, u) {
    i.update(
      e.call(r, s, u, t),
      function(a) {
        return a = a || [], a.push(n ? [u, s] : s), a;
      }
    );
  });
  var o = ff(t);
  return i.map(function(s) {
    return U(t, o(s));
  }).asImmutable();
}
function XT(t, e, r) {
  var n = H(t), i = [[], []];
  t.__iterate(function(s, u) {
    i[e.call(r, s, u, t) ? 1 : 0].push(
      n ? [u, s] : s
    );
  });
  var o = ff(t);
  return i.map(function(s) {
    return U(t, o(s));
  });
}
function af(t, e, r, n) {
  var i = t.size;
  if (Mi(e, r, i))
    return t;
  if (typeof i > "u" && (e < 0 || r < 0))
    return af(t.toSeq().cacheResult(), e, r, n);
  var o = hn(e, i), s = Ii(r, i), u = s - o, a;
  u === u && (a = u < 0 ? 0 : u);
  var f = Re(t);
  return f.size = a === 0 ? a : t.size && a || void 0, !n && vs(t) && a >= 0 && (f.get = function(c, l) {
    return c = Qe(this, c), c >= 0 && c < a ? t.get(c + o, l) : l;
  }), f.__iterateUncached = function(c, l) {
    var p = this;
    if (a === 0)
      return 0;
    if (l)
      return this.cacheResult().__iterate(c, l);
    var d = 0, _ = !0, g = 0;
    return t.__iterate(function(v, y) {
      if (!(_ && (_ = d++ < o)))
        return g++, c(v, n ? y : g - 1, p) !== !1 && g !== a;
    }), g;
  }, f.__iteratorUncached = function(c, l) {
    if (a !== 0 && l)
      return this.cacheResult().__iterator(c, l);
    if (a === 0)
      return new C(yt);
    var p = t.__iterator(c, l), d = 0, _ = 0;
    return new C(function() {
      for (; d++ < o; )
        p.next();
      if (++_ > a)
        return yt();
      var g = p.next();
      return n || c === Yt || g.done ? g : c === dn ? Z(c, _ - 1, void 0, g) : Z(c, _ - 1, g.value[1], g);
    });
  }, f;
}
function VT(t, e, r) {
  var n = Re(t);
  return n.__iterateUncached = function(i, o) {
    var s = this;
    if (o)
      return this.cacheResult().__iterate(i, o);
    var u = 0;
    return t.__iterate(
      function(a, f, c) {
        return e.call(r, a, f, c) && ++u && i(a, f, s);
      }
    ), u;
  }, n.__iteratorUncached = function(i, o) {
    var s = this;
    if (o)
      return this.cacheResult().__iterator(i, o);
    var u = t.__iterator(Zt, o), a = !0;
    return new C(function() {
      if (!a)
        return yt();
      var f = u.next();
      if (f.done)
        return f;
      var c = f.value, l = c[0], p = c[1];
      return e.call(r, p, l, s) ? i === Zt ? f : Z(i, l, p, f) : (a = !1, yt());
    });
  }, n;
}
function Bv(t, e, r, n) {
  var i = Re(t);
  return i.__iterateUncached = function(o, s) {
    var u = this;
    if (s)
      return this.cacheResult().__iterate(o, s);
    var a = !0, f = 0;
    return t.__iterate(function(c, l, p) {
      if (!(a && (a = e.call(r, c, l, p))))
        return f++, o(c, n ? l : f - 1, u);
    }), f;
  }, i.__iteratorUncached = function(o, s) {
    var u = this;
    if (s)
      return this.cacheResult().__iterator(o, s);
    var a = t.__iterator(Zt, s), f = !0, c = 0;
    return new C(function() {
      var l, p, d;
      do {
        if (l = a.next(), l.done)
          return n || o === Yt ? l : o === dn ? Z(o, c++, void 0, l) : Z(o, c++, l.value[1], l);
        var _ = l.value;
        p = _[0], d = _[1], f && (f = e.call(r, d, p, u));
      } while (f);
      return o === Zt ? l : Z(o, p, d, l);
    });
  }, i;
}
var JT = /* @__PURE__ */ function(t) {
  function e(r) {
    this._wrappedIterables = r.flatMap(function(n) {
      return n._wrappedIterables ? n._wrappedIterables : [n];
    }), this.size = this._wrappedIterables.reduce(function(n, i) {
      if (n !== void 0) {
        var o = i.size;
        if (o !== void 0)
          return n + o;
      }
    }, 0), this[bo] = this._wrappedIterables[0][bo], this[wo] = this._wrappedIterables[0][wo], this[tr] = this._wrappedIterables[0][tr];
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.__iterateUncached = function(n, i) {
    if (this._wrappedIterables.length !== 0) {
      if (i)
        return this.cacheResult().__iterate(n, i);
      for (var o = 0, s = H(this), u = s ? Zt : Yt, a = this._wrappedIterables[o].__iterator(
        u,
        i
      ), f = !0, c = 0; f; ) {
        for (var l = a.next(); l.done; ) {
          if (o++, o === this._wrappedIterables.length)
            return c;
          a = this._wrappedIterables[o].__iterator(
            u,
            i
          ), l = a.next();
        }
        var p = s ? n(l.value[1], l.value[0], this) : n(l.value, c, this);
        f = p !== !1, c++;
      }
      return c;
    }
  }, e.prototype.__iteratorUncached = function(n, i) {
    var o = this;
    if (this._wrappedIterables.length === 0)
      return new C(yt);
    if (i)
      return this.cacheResult().__iterator(n, i);
    var s = 0, u = this._wrappedIterables[s].__iterator(
      n,
      i
    );
    return new C(function() {
      for (var a = u.next(); a.done; ) {
        if (s++, s === o._wrappedIterables.length)
          return a;
        u = o._wrappedIterables[s].__iterator(
          n,
          i
        ), a = u.next();
      }
      return a;
    });
  }, e;
}(mt);
function QT(t, e) {
  var r = H(t), n = [t].concat(e).map(function(o) {
    return Nt(o) ? r && (o = se(o)) : o = r ? nf(o) : Mv(Array.isArray(o) ? o : [o]), o;
  }).filter(function(o) {
    return o.size !== 0;
  });
  if (n.length === 0)
    return t;
  if (n.length === 1) {
    var i = n[0];
    if (i === t || r && H(i) || zt(t) && zt(i))
      return i;
  }
  return new JT(n);
}
function jv(t, e, r) {
  var n = Re(t);
  return n.__iterateUncached = function(i, o) {
    if (o)
      return this.cacheResult().__iterate(i, o);
    var s = 0, u = !1;
    function a(f, c) {
      f.__iterate(function(l, p) {
        return (!e || c < e) && Nt(l) ? a(l, c + 1) : (s++, i(l, r ? p : s - 1, n) === !1 && (u = !0)), !u;
      }, o);
    }
    return a(t, 0), s;
  }, n.__iteratorUncached = function(i, o) {
    if (o)
      return this.cacheResult().__iterator(i, o);
    var s = t.__iterator(i, o), u = [], a = 0;
    return new C(function() {
      for (; s; ) {
        var f = s.next();
        if (f.done !== !1) {
          s = u.pop();
          continue;
        }
        var c = f.value;
        if (i === Zt && (c = c[1]), (!e || u.length < e) && Nt(c))
          u.push(s), s = c.__iterator(i, o);
        else
          return r ? f : Z(i, a++, c, f);
      }
      return yt();
    });
  }, n;
}
function tM(t, e, r) {
  var n = ff(t);
  return t.toSeq().map(function(i, o) {
    return n(e.call(r, i, o, t));
  }).flatten(!0);
}
function eM(t, e) {
  var r = Re(t);
  return r.size = t.size && t.size * 2 - 1, r.__iterateUncached = function(n, i) {
    var o = this, s = 0;
    return t.__iterate(
      function(u) {
        return (!s || n(e, s++, o) !== !1) && n(u, s++, o) !== !1;
      },
      i
    ), s;
  }, r.__iteratorUncached = function(n, i) {
    var o = t.__iterator(Yt, i), s = 0, u;
    return new C(function() {
      return (!u || s % 2) && (u = o.next(), u.done) ? u : s % 2 ? Z(n, s++, e) : Z(n, s++, u.value, u);
    });
  }, r;
}
function kr(t, e, r) {
  e || (e = Wv);
  var n = H(t), i = 0, o = t.toSeq().map(function(s, u) {
    return [u, s, i++, r ? r(s, u, t) : s];
  }).valueSeq().toArray();
  return o.sort(function(s, u) {
    return e(s[3], u[3]) || s[2] - u[2];
  }).forEach(
    n ? function(s, u) {
      o[u].length = 2;
    } : function(s, u) {
      o[u] = s[1];
    }
  ), n ? fr(o) : zt(t) ? ae(o) : gn(o);
}
function Xi(t, e, r) {
  if (e || (e = Wv), r) {
    var n = t.toSeq().map(function(i, o) {
      return [i, r(i, o, t)];
    }).reduce(function(i, o) {
      return ll(e, i[1], o[1]) ? o : i;
    });
    return n && n[0];
  }
  return t.reduce(function(i, o) {
    return ll(e, i, o) ? o : i;
  });
}
function ll(t, e, r) {
  var n = t(r, e);
  return n === 0 && r !== e && (r == null || r !== r) || n > 0;
}
function Vi(t, e, r, n) {
  var i = Re(t), o = new Gr(r).map(function(s) {
    return s.size;
  });
  return i.size = n ? o.max() : o.min(), i.__iterate = function(s, u) {
    for (var a = this.__iterator(Yt, u), f, c = 0; !(f = a.next()).done && s(f.value, c++, this) !== !1; )
      ;
    return c;
  }, i.__iteratorUncached = function(s, u) {
    var a = r.map(
      function(l) {
        return l = ct(l), Tu(u ? l.reverse() : l);
      }
    ), f = 0, c = !1;
    return new C(function() {
      var l;
      return c || (l = a.map(function(p) {
        return p.next();
      }), c = n ? l.every(function(p) {
        return p.done;
      }) : l.some(function(p) {
        return p.done;
      })), c ? yt() : Z(
        s,
        f++,
        e.apply(
          null,
          l.map(function(p) {
            return p.value;
          })
        )
      );
    });
  }, i;
}
function U(t, e) {
  return t === e ? t : vs(t) ? e : t.constructor(e);
}
function hl(t) {
  if (t !== Object(t))
    throw new TypeError("Expected [K, V] tuple: " + t);
}
function ff(t) {
  return H(t) ? se : zt(t) ? Or : pn;
}
function Re(t) {
  return Object.create(
    (H(t) ? fr : zt(t) ? ae : gn).prototype
  );
}
function cf() {
  return this._iter.cacheResult ? (this._iter.cacheResult(), this.size = this._iter.size, this) : mt.prototype.cacheResult.call(this);
}
function Wv(t, e) {
  return t === void 0 && e === void 0 ? 0 : t === void 0 ? 1 : e === void 0 ? -1 : t > e ? 1 : t < e ? -1 : 0;
}
function _e(t, e) {
  e = e || 0;
  for (var r = Math.max(0, t.length - e), n = new Array(r), i = 0; i < r; i++)
    n[i] = t[i + e];
  return n;
}
function Fn(t, e) {
  if (!t)
    throw new Error(e);
}
function Bt(t) {
  Fn(t !== 1 / 0, "Cannot perform this action with an infinite size.");
}
function qv(t) {
  if (tf(t) && typeof t != "string")
    return t;
  if (le(t))
    return t.toArray();
  throw new TypeError("Invalid keyPath: expected Ordered Collection or Array: " + t);
}
var rM = Object.prototype.toString;
function lf(t) {
  if (!t || typeof t != "object" || rM.call(t) !== "[object Object]")
    return !1;
  var e = Object.getPrototypeOf(t);
  if (e === null)
    return !0;
  for (var r = e, n = Object.getPrototypeOf(e); n !== null; )
    r = n, n = Object.getPrototypeOf(r);
  return r === e;
}
function er(t) {
  return typeof t == "object" && (ue(t) || Array.isArray(t) || lf(t));
}
function ti(t) {
  try {
    return typeof t == "string" ? JSON.stringify(t) : String(t);
  } catch {
    return JSON.stringify(t);
  }
}
function Uv(t, e) {
  return ue(t) ? (
    // @ts-expect-error key might be a number or symbol, which is not handled be Record key type
    t.has(e)
  ) : (
    // @ts-expect-error key might be anything else than PropertyKey, and will return false in that case but runtime is OK
    er(t) && _n.call(t, e)
  );
}
function hf(t, e, r) {
  return ue(t) ? t.get(e, r) : Uv(t, e) ? (
    // @ts-expect-error weird "get" here,
    typeof t.get == "function" ? (
      // @ts-expect-error weird "get" here,
      t.get(e)
    ) : (
      // @ts-expect-error key is unknown here,
      t[e]
    )
  ) : r;
}
function Ao(t) {
  if (Array.isArray(t))
    return _e(t);
  var e = {};
  for (var r in t)
    _n.call(t, r) && (e[r] = t[r]);
  return e;
}
function Gv(t, e) {
  if (!er(t))
    throw new TypeError("Cannot update non-data-structure value: " + t);
  if (ue(t)) {
    if (!t.remove)
      throw new TypeError("Cannot update immutable value without .remove() method: " + t);
    return t.remove(e);
  }
  if (!_n.call(t, e))
    return t;
  var r = Ao(t);
  return Array.isArray(r) ? r.splice(e, 1) : delete r[e], r;
}
function kv(t, e, r) {
  if (!er(t))
    throw new TypeError("Cannot update non-data-structure value: " + t);
  if (ue(t)) {
    if (!t.set)
      throw new TypeError("Cannot update immutable value without .set() method: " + t);
    return t.set(e, r);
  }
  if (_n.call(t, e) && r === t[e])
    return t;
  var n = Ao(t);
  return n[e] = r, n;
}
function Er(t, e, r, n) {
  n || (n = r, r = void 0);
  var i = Hv(
    ue(t),
    // @ts-expect-error type issues with Record and mixed types
    t,
    qv(e),
    0,
    r,
    n
  );
  return i === L ? r : i;
}
function Hv(t, e, r, n, i, o) {
  var s = e === L;
  if (n === r.length) {
    var u = s ? i : e, a = o(u);
    return a === u ? e : a;
  }
  if (!s && !er(e))
    throw new TypeError("Cannot update within non-data-structure value in path [" + Array.from(r).slice(0, n).map(ti) + "]: " + e);
  var f = r[n], c = s ? L : hf(e, f, L), l = Hv(
    c === L ? t : ue(c),
    // @ts-expect-error mixed type
    c,
    r,
    n + 1,
    i,
    o
  );
  return l === c ? e : l === L ? Gv(e, f) : kv(s ? t ? ge() : {} : e, f, l);
}
function Kv(t, e, r) {
  return Er(t, e, L, function() {
    return r;
  });
}
function pf(t, e) {
  return Kv(this, t, e);
}
function Yv(t, e) {
  return Er(t, e, function() {
    return L;
  });
}
function df(t) {
  return Yv(this, t);
}
function _f(t, e, r, n) {
  return Er(
    // @ts-expect-error Index signature for type string is missing in type V[]
    t,
    [e],
    r,
    n
  );
}
function gf(t, e, r) {
  return arguments.length === 1 ? t(this) : _f(this, t, e, r);
}
function vf(t, e, r) {
  return Er(this, t, e, r);
}
function Zv() {
  for (var t = [], e = arguments.length; e--; ) t[e] = arguments[e];
  return Vv(this, t);
}
function Xv(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  if (typeof t != "function")
    throw new TypeError("Invalid merger function: " + t);
  return Vv(this, e, t);
}
function Vv(t, e, r) {
  for (var n = [], i = 0; i < e.length; i++) {
    var o = se(e[i]);
    o.size !== 0 && n.push(o);
  }
  return n.length === 0 ? t : t.toSeq().size === 0 && !t.__ownerID && n.length === 1 ? ar(t) ? t : t.constructor(n[0]) : t.withMutations(function(s) {
    for (var u = r ? function(f, c) {
      _f(
        s,
        c,
        L,
        function(l) {
          return l === L ? f : r(l, f, c);
        }
      );
    } : function(f, c) {
      s.set(c, f);
    }, a = 0; a < n.length; a++)
      n[a].forEach(u);
  });
}
function nM(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  return Li(t, e);
}
function iM(t, e) {
  for (var r = [], n = arguments.length - 2; n-- > 0; ) r[n] = arguments[n + 2];
  return Li(e, r, t);
}
function oM(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  return Pi(t, e);
}
function sM(t, e) {
  for (var r = [], n = arguments.length - 2; n-- > 0; ) r[n] = arguments[n + 2];
  return Pi(e, r, t);
}
function Pi(t, e, r) {
  return Li(t, e, uM(r));
}
function Li(t, e, r) {
  if (!er(t))
    throw new TypeError(
      "Cannot merge into non-data-structure value: " + t
    );
  if (ue(t))
    return typeof r == "function" && t.mergeWith ? t.mergeWith.apply(t, [r].concat(e)) : t.merge ? t.merge.apply(t, e) : t.concat.apply(t, e);
  for (var n = Array.isArray(t), i = t, o = n ? Or : se, s = n ? function(a) {
    i === t && (i = Ao(i)), i.push(a);
  } : function(a, f) {
    var c = _n.call(i, f), l = c && r ? r(i[f], a, f) : a;
    (!c || l !== i[f]) && (i === t && (i = Ao(i)), i[f] = l);
  }, u = 0; u < e.length; u++)
    o(e[u]).forEach(s);
  return i;
}
function uM(t) {
  function e(r, n, i) {
    return er(r) && er(n) && aM(r, n) ? Li(r, [n], e) : t ? t(r, n, i) : n;
  }
  return e;
}
function aM(t, e) {
  var r = mt(t), n = mt(e);
  return zt(r) === zt(n) && H(r) === H(n);
}
function Jv() {
  for (var t = [], e = arguments.length; e--; ) t[e] = arguments[e];
  return Pi(this, t);
}
function Qv(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  return Pi(this, e, t);
}
function yf(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  return Er(this, t, ge(), function(n) {
    return Li(n, e);
  });
}
function mf(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  return Er(
    this,
    t,
    ge(),
    function(n) {
      return Pi(n, e);
    }
  );
}
function Ci(t) {
  var e = this.asMutable();
  return t(e), e.wasAltered() ? e.__ensureOwner(this.__ownerID) : this;
}
function Fi() {
  return this.__ownerID ? this : this.__ensureOwner(new Ja());
}
function Ni() {
  return this.__ensureOwner();
}
function bf() {
  return this.__altered;
}
var Rr = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? ge() : bs(r) && !le(r) ? r : ge().withMutations(function(n) {
      var i = t(r);
      Bt(i.size), i.forEach(function(o, s) {
        return n.set(s, o);
      });
    });
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.toString = function() {
    return this.__toString("Map {", "}");
  }, e.prototype.get = function(n, i) {
    return this._root ? this._root.get(0, void 0, n, i) : i;
  }, e.prototype.set = function(n, i) {
    return _l(this, n, i);
  }, e.prototype.remove = function(n) {
    return _l(this, n, L);
  }, e.prototype.deleteAll = function(n) {
    var i = ct(n);
    return i.size === 0 ? this : this.withMutations(function(o) {
      i.forEach(function(s) {
        return o.remove(s);
      });
    });
  }, e.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._root = null, this.__hash = void 0, this.__altered = !0, this) : ge();
  }, e.prototype.sort = function(n) {
    return be(kr(this, n));
  }, e.prototype.sortBy = function(n, i) {
    return be(kr(this, i, n));
  }, e.prototype.map = function(n, i) {
    var o = this;
    return this.withMutations(function(s) {
      s.forEach(function(u, a) {
        s.set(a, n.call(i, u, a, o));
      });
    });
  }, e.prototype.__iterator = function(n, i) {
    return new fM(this, n, i);
  }, e.prototype.__iterate = function(n, i) {
    var o = this, s = 0;
    return this._root && this._root.iterate(function(u) {
      return s++, n(u[1], u[0], o);
    }, i), s;
  }, e.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? wf(this.size, this._root, n, this.__hash) : this.size === 0 ? ge() : (this.__ownerID = n, this.__altered = !1, this);
  }, e;
}(se);
Rr.isMap = bs;
var X = Rr.prototype;
X[Iv] = !0;
X[Ti] = X.remove;
X.removeAll = X.deleteAll;
X.setIn = pf;
X.removeIn = X.deleteIn = df;
X.update = gf;
X.updateIn = vf;
X.merge = X.concat = Zv;
X.mergeWith = Xv;
X.mergeDeep = Jv;
X.mergeDeepWith = Qv;
X.mergeIn = yf;
X.mergeDeepIn = mf;
X.withMutations = Ci;
X.wasAltered = bf;
X.asImmutable = Ni;
X["@@transducer/init"] = X.asMutable = Fi;
X["@@transducer/step"] = function(t, e) {
  return t.set(e[0], e[1]);
};
X["@@transducer/result"] = function(t) {
  return t.asImmutable();
};
var ei = function(e, r) {
  this.ownerID = e, this.entries = r;
};
ei.prototype.get = function(e, r, n, i) {
  for (var o = this.entries, s = 0, u = o.length; s < u; s++)
    if (ft(n, o[s][0]))
      return o[s][1];
  return i;
};
ei.prototype.update = function(e, r, n, i, o, s, u) {
  for (var a = o === L, f = this.entries, c = 0, l = f.length; c < l && !ft(i, f[c][0]); c++)
    ;
  var p = c < l;
  if (p ? f[c][1] === o : a)
    return this;
  if (Jt(u), (a || !p) && Jt(s), !(a && f.length === 1)) {
    if (!p && !a && f.length >= _M)
      return cM(e, f, i, o);
    var d = e && e === this.ownerID, _ = d ? f : _e(f);
    return p ? a ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, o] : _.push([i, o]), d ? (this.entries = _, this) : new ei(e, _);
  }
};
var Hr = function(e, r, n) {
  this.ownerID = e, this.bitmap = r, this.nodes = n;
};
Hr.prototype.get = function(e, r, n, i) {
  r === void 0 && (r = Lt(n));
  var o = 1 << ((e === 0 ? r : r >>> e) & St), s = this.bitmap;
  return (s & o) === 0 ? i : this.nodes[ty(s & o - 1)].get(
    e + G,
    r,
    n,
    i
  );
};
Hr.prototype.update = function(e, r, n, i, o, s, u) {
  n === void 0 && (n = Lt(i));
  var a = (r === 0 ? n : n >>> r) & St, f = 1 << a, c = this.bitmap, l = (c & f) !== 0;
  if (!l && o === L)
    return this;
  var p = ty(c & f - 1), d = this.nodes, _ = l ? d[p] : void 0, g = Af(
    _,
    e,
    r + G,
    n,
    i,
    o,
    s,
    u
  );
  if (g === _)
    return this;
  if (!l && g && d.length >= gM)
    return hM(e, d, c, a, g);
  if (l && !g && d.length === 2 && gl(d[p ^ 1]))
    return d[p ^ 1];
  if (l && g && d.length === 1 && gl(g))
    return g;
  var v = e && e === this.ownerID, y = l ? g ? c : c ^ f : c | f, m = l ? g ? ey(d, p, g, v) : dM(d, p, v) : pM(d, p, g, v);
  return v ? (this.bitmap = y, this.nodes = m, this) : new Hr(e, y, m);
};
var ri = function(e, r, n) {
  this.ownerID = e, this.count = r, this.nodes = n;
};
ri.prototype.get = function(e, r, n, i) {
  r === void 0 && (r = Lt(n));
  var o = (e === 0 ? r : r >>> e) & St, s = this.nodes[o];
  return s ? s.get(e + G, r, n, i) : i;
};
ri.prototype.update = function(e, r, n, i, o, s, u) {
  n === void 0 && (n = Lt(i));
  var a = (r === 0 ? n : n >>> r) & St, f = o === L, c = this.nodes, l = c[a];
  if (f && !l)
    return this;
  var p = Af(
    l,
    e,
    r + G,
    n,
    i,
    o,
    s,
    u
  );
  if (p === l)
    return this;
  var d = this.count;
  if (!l)
    d++;
  else if (!p && (d--, d < vM))
    return lM(e, c, d, a);
  var _ = e && e === this.ownerID, g = ey(c, a, p, _);
  return _ ? (this.count = d, this.nodes = g, this) : new ri(e, d, g);
};
var Kr = function(e, r, n) {
  this.ownerID = e, this.keyHash = r, this.entries = n;
};
Kr.prototype.get = function(e, r, n, i) {
  for (var o = this.entries, s = 0, u = o.length; s < u; s++)
    if (ft(n, o[s][0]))
      return o[s][1];
  return i;
};
Kr.prototype.update = function(e, r, n, i, o, s, u) {
  n === void 0 && (n = Lt(i));
  var a = o === L;
  if (n !== this.keyHash)
    return a ? this : (Jt(u), Jt(s), Sf(this, e, r, n, [i, o]));
  for (var f = this.entries, c = 0, l = f.length; c < l && !ft(i, f[c][0]); c++)
    ;
  var p = c < l;
  if (p ? f[c][1] === o : a)
    return this;
  if (Jt(u), (a || !p) && Jt(s), a && l === 2)
    return new De(e, this.keyHash, f[c ^ 1]);
  var d = e && e === this.ownerID, _ = d ? f : _e(f);
  return p ? a ? c === l - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, o] : _.push([i, o]), d ? (this.entries = _, this) : new Kr(e, this.keyHash, _);
};
var De = function(e, r, n) {
  this.ownerID = e, this.keyHash = r, this.entry = n;
};
De.prototype.get = function(e, r, n, i) {
  return ft(n, this.entry[0]) ? this.entry[1] : i;
};
De.prototype.update = function(e, r, n, i, o, s, u) {
  var a = o === L, f = ft(i, this.entry[0]);
  if (f ? o === this.entry[1] : a)
    return this;
  if (Jt(u), a) {
    Jt(s);
    return;
  }
  return f ? e && e === this.ownerID ? (this.entry[1] = o, this) : new De(e, this.keyHash, [i, o]) : (Jt(s), Sf(this, e, r, Lt(i), [i, o]));
};
ei.prototype.iterate = Kr.prototype.iterate = function(t, e) {
  for (var r = this.entries, n = 0, i = r.length - 1; n <= i; n++)
    if (t(r[e ? i - n : n]) === !1)
      return !1;
};
Hr.prototype.iterate = ri.prototype.iterate = function(t, e) {
  for (var r = this.nodes, n = 0, i = r.length - 1; n <= i; n++) {
    var o = r[e ? i - n : n];
    if (o && o.iterate(t, e) === !1)
      return !1;
  }
};
De.prototype.iterate = function(t, e) {
  return t(this.entry);
};
var fM = /* @__PURE__ */ function(t) {
  function e(r, n, i) {
    this._type = n, this._reverse = i, this._stack = r._root && pl(r._root);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.next = function() {
    for (var n = this._type, i = this._stack; i; ) {
      var o = i.node, s = i.index++, u = void 0;
      if (o.entry) {
        if (s === 0)
          return Ys(n, o.entry);
      } else if (o.entries) {
        if (u = o.entries.length - 1, s <= u)
          return Ys(
            n,
            o.entries[this._reverse ? u - s : s]
          );
      } else if (u = o.nodes.length - 1, s <= u) {
        var a = o.nodes[this._reverse ? u - s : s];
        if (a) {
          if (a.entry)
            return Ys(n, a.entry);
          i = this._stack = pl(a, i);
        }
        continue;
      }
      i = this._stack = this._stack.__prev;
    }
    return yt();
  }, e;
}(C);
function Ys(t, e) {
  return Z(t, e[0], e[1]);
}
function pl(t, e) {
  return {
    node: t,
    index: 0,
    __prev: e
  };
}
function wf(t, e, r, n) {
  var i = Object.create(X);
  return i.size = t, i._root = e, i.__ownerID = r, i.__hash = n, i.__altered = !1, i;
}
var dl;
function ge() {
  return dl || (dl = wf(0));
}
function _l(t, e, r) {
  var n, i;
  if (t._root) {
    var o = Ru(), s = Ru();
    if (n = Af(
      t._root,
      t.__ownerID,
      0,
      void 0,
      e,
      r,
      o,
      s
    ), !s.value)
      return t;
    i = t.size + (o.value ? r === L ? -1 : 1 : 0);
  } else {
    if (r === L)
      return t;
    i = 1, n = new ei(t.__ownerID, [[e, r]]);
  }
  return t.__ownerID ? (t.size = i, t._root = n, t.__hash = void 0, t.__altered = !0, t) : n ? wf(i, n) : ge();
}
function Af(t, e, r, n, i, o, s, u) {
  return t ? t.update(
    e,
    r,
    n,
    i,
    o,
    s,
    u
  ) : o === L ? t : (Jt(u), Jt(s), new De(e, n, [i, o]));
}
function gl(t) {
  return t.constructor === De || t.constructor === Kr;
}
function Sf(t, e, r, n, i) {
  if (t.keyHash === n)
    return new Kr(e, n, [t.entry, i]);
  var o = (r === 0 ? t.keyHash : t.keyHash >>> r) & St, s = (r === 0 ? n : n >>> r) & St, u, a = o === s ? [Sf(t, e, r + G, n, i)] : (u = new De(e, n, i), o < s ? [t, u] : [u, t]);
  return new Hr(e, 1 << o | 1 << s, a);
}
function cM(t, e, r, n) {
  t || (t = new Ja());
  for (var i = new De(t, Lt(r), [r, n]), o = 0; o < e.length; o++) {
    var s = e[o];
    i = i.update(t, 0, void 0, s[0], s[1]);
  }
  return i;
}
function lM(t, e, r, n) {
  for (var i = 0, o = 0, s = new Array(r), u = 0, a = 1, f = e.length; u < f; u++, a <<= 1) {
    var c = e[u];
    c !== void 0 && u !== n && (i |= a, s[o++] = c);
  }
  return new Hr(t, i, s);
}
function hM(t, e, r, n, i) {
  for (var o = 0, s = new Array(jt), u = 0; r !== 0; u++, r >>>= 1)
    s[u] = r & 1 ? e[o++] : void 0;
  return s[n] = i, new ri(t, o + 1, s);
}
function ty(t) {
  return t -= t >> 1 & 1431655765, t = (t & 858993459) + (t >> 2 & 858993459), t = t + (t >> 4) & 252645135, t += t >> 8, t += t >> 16, t & 127;
}
function ey(t, e, r, n) {
  var i = n ? t : _e(t);
  return i[e] = r, i;
}
function pM(t, e, r, n) {
  var i = t.length + 1;
  if (n && e + 1 === i)
    return t[e] = r, t;
  for (var o = new Array(i), s = 0, u = 0; u < i; u++)
    u === e ? (o[u] = r, s = -1) : o[u] = t[u + s];
  return o;
}
function dM(t, e, r) {
  var n = t.length - 1;
  if (r && e === n)
    return t.pop(), t;
  for (var i = new Array(n), o = 0, s = 0; s < n; s++)
    s === e && (o = 1), i[s] = t[s + o];
  return i;
}
var _M = jt / 4, gM = jt / 2, vM = jt / 4, ry = "@@__IMMUTABLE_LIST__@@";
function xf(t) {
  return !!(t && // @ts-expect-error: maybeList is typed as `{}`, need to change in 6.0 to `maybeList && typeof maybeList === 'object' && IS_LIST_SYMBOL in maybeList`
  t[ry]);
}
var zi = /* @__PURE__ */ function(t) {
  function e(r) {
    var n = ao();
    if (r == null)
      return n;
    if (xf(r))
      return r;
    var i = t(r), o = i.size;
    return o === 0 ? n : (Bt(o), o > 0 && o < jt ? ni(0, o, G, null, new Ke(i.toArray())) : n.withMutations(function(s) {
      s.setSize(o), i.forEach(function(u, a) {
        return s.set(a, u);
      });
    }));
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return this(arguments);
  }, e.prototype.toString = function() {
    return this.__toString("List [", "]");
  }, e.prototype.get = function(n, i) {
    if (n = Qe(this, n), n >= 0 && n < this.size) {
      n += this._origin;
      var o = ny(this, n);
      return o && o.array[n & St];
    }
    return i;
  }, e.prototype.set = function(n, i) {
    return yM(this, n, i);
  }, e.prototype.remove = function(n) {
    return this.has(n) ? n === 0 ? this.shift() : n === this.size - 1 ? this.pop() : this.splice(n, 1) : this;
  }, e.prototype.insert = function(n, i) {
    return this.splice(n, 0, i);
  }, e.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = this._origin = this._capacity = 0, this._level = G, this._root = this._tail = this.__hash = void 0, this.__altered = !0, this) : ao();
  }, e.prototype.push = function() {
    var n = arguments, i = this.size;
    return this.withMutations(function(o) {
      ke(o, 0, i + n.length);
      for (var s = 0; s < n.length; s++)
        o.set(i + s, n[s]);
    });
  }, e.prototype.pop = function() {
    return ke(this, 0, -1);
  }, e.prototype.unshift = function() {
    var n = arguments;
    return this.withMutations(function(i) {
      ke(i, -n.length);
      for (var o = 0; o < n.length; o++)
        i.set(o, n[o]);
    });
  }, e.prototype.shift = function() {
    return ke(this, 1);
  }, e.prototype.shuffle = function(n) {
    return n === void 0 && (n = Math.random), this.withMutations(function(i) {
      for (var o = i.size, s, u; o; )
        s = Math.floor(n() * o--), u = i.get(s), i.set(s, i.get(o)), i.set(o, u);
    });
  }, e.prototype.concat = function() {
    for (var n = arguments, i = [], o = 0; o < arguments.length; o++) {
      var s = n[o], u = t(
        typeof s != "string" && Qa(s) ? s : [s]
      );
      u.size !== 0 && i.push(u);
    }
    return i.length === 0 ? this : this.size === 0 && !this.__ownerID && i.length === 1 ? this.constructor(i[0]) : this.withMutations(function(a) {
      i.forEach(function(f) {
        return f.forEach(function(c) {
          return a.push(c);
        });
      });
    });
  }, e.prototype.setSize = function(n) {
    return ke(this, 0, n);
  }, e.prototype.map = function(n, i) {
    var o = this;
    return this.withMutations(function(s) {
      for (var u = 0; u < o.size; u++)
        s.set(u, n.call(i, s.get(u), u, o));
    });
  }, e.prototype.slice = function(n, i) {
    var o = this.size;
    return Mi(n, i, o) ? this : ke(
      this,
      hn(n, o),
      Ii(i, o)
    );
  }, e.prototype.__iterator = function(n, i) {
    var o = i ? this.size : 0, s = vl(this, i);
    return new C(function() {
      var u = s();
      return u === Nn ? yt() : Z(n, i ? --o : o++, u);
    });
  }, e.prototype.__iterate = function(n, i) {
    for (var o = i ? this.size : 0, s = vl(this, i), u; (u = s()) !== Nn && n(u, i ? --o : o++, this) !== !1; )
      ;
    return o;
  }, e.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? ni(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      n,
      this.__hash
    ) : this.size === 0 ? ao() : (this.__ownerID = n, this.__altered = !1, this);
  }, e;
}(Or);
zi.isList = xf;
var it = zi.prototype;
it[ry] = !0;
it[Ti] = it.remove;
it.merge = it.concat;
it.setIn = pf;
it.deleteIn = it.removeIn = df;
it.update = gf;
it.updateIn = vf;
it.mergeIn = yf;
it.mergeDeepIn = mf;
it.withMutations = Ci;
it.wasAltered = bf;
it.asImmutable = Ni;
it["@@transducer/init"] = it.asMutable = Fi;
it["@@transducer/step"] = function(t, e) {
  return t.push(e);
};
it["@@transducer/result"] = function(t) {
  return t.asImmutable();
};
var Ke = function(e, r) {
  this.array = e, this.ownerID = r;
};
Ke.prototype.removeBefore = function(e, r, n) {
  if ((n & (1 << r + G) - 1) === 0 || this.array.length === 0)
    return this;
  var i = n >>> r & St;
  if (i >= this.array.length)
    return new Ke([], e);
  var o = i === 0, s;
  if (r > 0) {
    var u = this.array[i];
    if (s = u && u.removeBefore(e, r - G, n), s === u && o)
      return this;
  }
  if (o && !s)
    return this;
  var a = Yr(this, e);
  if (!o)
    for (var f = 0; f < i; f++)
      a.array[f] = void 0;
  return s && (a.array[i] = s), a;
};
Ke.prototype.removeAfter = function(e, r, n) {
  if (n === (r ? 1 << r + G : jt) || this.array.length === 0)
    return this;
  var i = n - 1 >>> r & St;
  if (i >= this.array.length)
    return this;
  var o;
  if (r > 0) {
    var s = this.array[i];
    if (o = s && s.removeAfter(e, r - G, n), o === s && i === this.array.length - 1)
      return this;
  }
  var u = Yr(this, e);
  return u.array.splice(i + 1), o && (u.array[i] = o), u;
};
var Nn = {};
function vl(t, e) {
  var r = t._origin, n = t._capacity, i = ii(n), o = t._tail;
  return s(t._root, t._level, 0);
  function s(f, c, l) {
    return c === 0 ? u(f, l) : a(f, c, l);
  }
  function u(f, c) {
    var l = c === i ? o && o.array : f && f.array, p = c > r ? 0 : r - c, d = n - c;
    return d > jt && (d = jt), function() {
      if (p === d)
        return Nn;
      var _ = e ? --d : p++;
      return l && l[_];
    };
  }
  function a(f, c, l) {
    var p, d = f && f.array, _ = l > r ? 0 : r - l >> c, g = (n - l >> c) + 1;
    return g > jt && (g = jt), function() {
      for (; ; ) {
        if (p) {
          var v = p();
          if (v !== Nn)
            return v;
          p = null;
        }
        if (_ === g)
          return Nn;
        var y = e ? --g : _++;
        p = s(
          d && d[y],
          c - G,
          l + (y << c)
        );
      }
    };
  }
}
function ni(t, e, r, n, i, o, s) {
  var u = Object.create(it);
  return u.size = e - t, u._origin = t, u._capacity = e, u._level = r, u._root = n, u._tail = i, u.__ownerID = o, u.__hash = s, u.__altered = !1, u;
}
function ao() {
  return ni(0, 0, G);
}
function yM(t, e, r) {
  if (e = Qe(t, e), e !== e)
    return t;
  if (e >= t.size || e < 0)
    return t.withMutations(function(s) {
      e < 0 ? ke(s, e).set(0, r) : ke(s, 0, e + 1).set(e, r);
    });
  e += t._origin;
  var n = t._tail, i = t._root, o = Ru();
  return e >= ii(t._capacity) ? n = Cu(n, t.__ownerID, 0, e, r, o) : i = Cu(
    i,
    t.__ownerID,
    t._level,
    e,
    r,
    o
  ), o.value ? t.__ownerID ? (t._root = i, t._tail = n, t.__hash = void 0, t.__altered = !0, t) : ni(t._origin, t._capacity, t._level, i, n) : t;
}
function Cu(t, e, r, n, i, o) {
  var s = n >>> r & St, u = t && s < t.array.length;
  if (!u && i === void 0)
    return t;
  var a;
  if (r > 0) {
    var f = t && t.array[s], c = Cu(
      f,
      e,
      r - G,
      n,
      i,
      o
    );
    return c === f ? t : (a = Yr(t, e), a.array[s] = c, a);
  }
  return u && t.array[s] === i ? t : (o && Jt(o), a = Yr(t, e), i === void 0 && s === a.array.length - 1 ? a.array.pop() : a.array[s] = i, a);
}
function Yr(t, e) {
  return e && t && e === t.ownerID ? t : new Ke(t ? t.array.slice() : [], e);
}
function ny(t, e) {
  if (e >= ii(t._capacity))
    return t._tail;
  if (e < 1 << t._level + G) {
    for (var r = t._root, n = t._level; r && n > 0; )
      r = r.array[e >>> n & St], n -= G;
    return r;
  }
}
function ke(t, e, r) {
  e !== void 0 && (e |= 0), r !== void 0 && (r |= 0);
  var n = t.__ownerID || new Ja(), i = t._origin, o = t._capacity, s = i + e, u = r === void 0 ? o : r < 0 ? o + r : i + r;
  if (s === i && u === o)
    return t;
  if (s >= u)
    return t.clear();
  for (var a = t._level, f = t._root, c = 0; s + c < 0; )
    f = new Ke(
      f && f.array.length ? [void 0, f] : [],
      n
    ), a += G, c += 1 << a;
  c && (s += c, i += c, u += c, o += c);
  for (var l = ii(o), p = ii(u); p >= 1 << a + G; )
    f = new Ke(
      f && f.array.length ? [f] : [],
      n
    ), a += G;
  var d = t._tail, _ = p < l ? ny(t, u - 1) : p > l ? new Ke([], n) : d;
  if (d && p > l && s < o && d.array.length) {
    f = Yr(f, n);
    for (var g = f, v = a; v > G; v -= G) {
      var y = l >>> v & St;
      g = g.array[y] = Yr(g.array[y], n);
    }
    g.array[l >>> G & St] = d;
  }
  if (u < o && (_ = _ && _.removeAfter(n, 0, u)), s >= p)
    s -= p, u -= p, a = G, f = null, _ = _ && _.removeBefore(n, 0, s);
  else if (s > i || p < l) {
    for (c = 0; f; ) {
      var m = s >>> a & St;
      if (m !== p >>> a & St)
        break;
      m && (c += (1 << a) * m), a -= G, f = f.array[m];
    }
    f && s > i && (f = f.removeBefore(n, a, s - c)), f && p < l && (f = f.removeAfter(
      n,
      a,
      p - c
    )), c && (s -= c, u -= c);
  }
  return t.__ownerID ? (t.size = u - s, t._origin = s, t._capacity = u, t._level = a, t._root = f, t._tail = _, t.__hash = void 0, t.__altered = !0, t) : ni(s, u, a, f, _);
}
function ii(t) {
  return t < jt ? 0 : t - 1 >>> G << G;
}
var be = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? $n() : sf(r) ? r : $n().withMutations(function(n) {
      var i = se(r);
      Bt(i.size), i.forEach(function(o, s) {
        return n.set(s, o);
      });
    });
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return this(arguments);
  }, e.prototype.toString = function() {
    return this.__toString("OrderedMap {", "}");
  }, e.prototype.get = function(n, i) {
    var o = this._map.get(n);
    return o !== void 0 ? this._list.get(o)[1] : i;
  }, e.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._map.clear(), this._list.clear(), this.__altered = !0, this) : $n();
  }, e.prototype.set = function(n, i) {
    return ml(this, n, i);
  }, e.prototype.remove = function(n) {
    return ml(this, n, L);
  }, e.prototype.__iterate = function(n, i) {
    var o = this;
    return this._list.__iterate(
      function(s) {
        return s && n(s[1], s[0], o);
      },
      i
    );
  }, e.prototype.__iterator = function(n, i) {
    return this._list.fromEntrySeq().__iterator(n, i);
  }, e.prototype.__ensureOwner = function(n) {
    if (n === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(n), o = this._list.__ensureOwner(n);
    return n ? Of(i, o, n, this.__hash) : this.size === 0 ? $n() : (this.__ownerID = n, this.__altered = !1, this._map = i, this._list = o, this);
  }, e;
}(Rr);
be.isOrderedMap = sf;
be.prototype[tr] = !0;
be.prototype[Ti] = be.prototype.remove;
function Of(t, e, r, n) {
  var i = Object.create(be.prototype);
  return i.size = t ? t.size : 0, i._map = t, i._list = e, i.__ownerID = r, i.__hash = n, i.__altered = !1, i;
}
var yl;
function $n() {
  return yl || (yl = Of(ge(), ao()));
}
function ml(t, e, r) {
  var n = t._map, i = t._list, o = n.get(e), s = o !== void 0, u, a;
  if (r === L) {
    if (!s)
      return t;
    i.size >= jt && i.size >= n.size * 2 ? (a = i.filter(function(f, c) {
      return f !== void 0 && o !== c;
    }), u = a.toKeyedSeq().map(function(f) {
      return f[0];
    }).flip().toMap(), t.__ownerID && (u.__ownerID = a.__ownerID = t.__ownerID)) : (u = n.remove(e), a = o === i.size - 1 ? i.pop() : i.set(o, void 0));
  } else if (s) {
    if (r === i.get(o)[1])
      return t;
    u = n, a = i.set(o, [e, r]);
  } else
    u = n.set(e, i.size), a = i.set(i.size, [e, r]);
  return t.__ownerID ? (t.size = u.size, t._map = u, t._list = a, t.__hash = void 0, t.__altered = !0, t) : Of(u, a);
}
var iy = "@@__IMMUTABLE_STACK__@@";
function So(t) {
  return !!(t && // @ts-expect-error: maybeStack is typed as `{}`, need to change in 6.0 to `maybeStack && typeof maybeStack === 'object' && MAYBE_STACK_SYMBOL in maybeStack`
  t[iy]);
}
var Ss = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? Ji() : So(r) ? r : Ji().pushAll(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return this(arguments);
  }, e.prototype.toString = function() {
    return this.__toString("Stack [", "]");
  }, e.prototype.get = function(n, i) {
    var o = this._head;
    for (n = Qe(this, n); o && n--; )
      o = o.next;
    return o ? o.value : i;
  }, e.prototype.peek = function() {
    return this._head && this._head.value;
  }, e.prototype.push = function() {
    var n = arguments;
    if (arguments.length === 0)
      return this;
    for (var i = this.size + arguments.length, o = this._head, s = arguments.length - 1; s >= 0; s--)
      o = {
        value: n[s],
        next: o
      };
    return this.__ownerID ? (this.size = i, this._head = o, this.__hash = void 0, this.__altered = !0, this) : Tn(i, o);
  }, e.prototype.pushAll = function(n) {
    if (n = t(n), n.size === 0)
      return this;
    if (this.size === 0 && So(n))
      return n;
    Bt(n.size);
    var i = this.size, o = this._head;
    return n.__iterate(
      function(s) {
        i++, o = {
          value: s,
          next: o
        };
      },
      /* reverse */
      !0
    ), this.__ownerID ? (this.size = i, this._head = o, this.__hash = void 0, this.__altered = !0, this) : Tn(i, o);
  }, e.prototype.pop = function() {
    return this.slice(1);
  }, e.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._head = void 0, this.__hash = void 0, this.__altered = !0, this) : Ji();
  }, e.prototype.slice = function(n, i) {
    if (Mi(n, i, this.size))
      return this;
    var o = hn(n, this.size), s = Ii(i, this.size);
    if (s !== this.size)
      return t.prototype.slice.call(this, n, i);
    for (var u = this.size - o, a = this._head; o--; )
      a = a.next;
    return this.__ownerID ? (this.size = u, this._head = a, this.__hash = void 0, this.__altered = !0, this) : Tn(u, a);
  }, e.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? Tn(this.size, this._head, n, this.__hash) : this.size === 0 ? Ji() : (this.__ownerID = n, this.__altered = !1, this);
  }, e.prototype.__iterate = function(n, i) {
    var o = this;
    if (i)
      return new Gr(this.toArray()).__iterate(
        function(a, f) {
          return n(a, f, o);
        },
        i
      );
    for (var s = 0, u = this._head; u && n(u.value, s++, this) !== !1; )
      u = u.next;
    return s;
  }, e.prototype.__iterator = function(n, i) {
    if (i)
      return new Gr(this.toArray()).__iterator(n, i);
    var o = 0, s = this._head;
    return new C(function() {
      if (s) {
        var u = s.value;
        return s = s.next, Z(n, o++, u);
      }
      return yt();
    });
  }, e;
}(Or);
Ss.isStack = So;
var Rt = Ss.prototype;
Rt[iy] = !0;
Rt.shift = Rt.pop;
Rt.unshift = Rt.push;
Rt.unshiftAll = Rt.pushAll;
Rt.withMutations = Ci;
Rt.wasAltered = bf;
Rt.asImmutable = Ni;
Rt["@@transducer/init"] = Rt.asMutable = Fi;
Rt["@@transducer/step"] = function(t, e) {
  return t.unshift(e);
};
Rt["@@transducer/result"] = function(t) {
  return t.asImmutable();
};
function Tn(t, e, r, n) {
  var i = Object.create(Rt);
  return i.size = t, i._head = e, i.__ownerID = r, i.__hash = n, i.__altered = !1, i;
}
var bl;
function Ji() {
  return bl || (bl = Tn(0));
}
var oy = "@@__IMMUTABLE_SET__@@";
function xs(t) {
  return !!(t && // @ts-expect-error: maybeSet is typed as `{}`,  need to change in 6.0 to `maybeSeq && typeof maybeSet === 'object' && MAYBE_SET_SYMBOL in maybeSet`
  t[oy]);
}
function Ef(t) {
  return xs(t) && le(t);
}
function Rf(t, e) {
  if (t === e)
    return !0;
  if (!Nt(e) || // @ts-expect-error size should exists on Collection
  t.size !== void 0 && e.size !== void 0 && t.size !== e.size || // @ts-expect-error __hash exists on Collection
  t.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  e.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  t.__hash !== e.__hash || H(t) !== H(e) || zt(t) !== zt(e) || // @ts-expect-error Range extends Collection, which implements [Symbol.iterator], so it is valid
  le(t) !== le(e))
    return !1;
  if (t.size === 0 && e.size === 0)
    return !0;
  var r = !gs(t);
  if (le(t)) {
    var n = t.entries();
    return e.every(function(a, f) {
      var c = n.next().value;
      return c && ft(c[1], a) && (r || ft(c[0], f));
    }) && n.next().done;
  }
  var i = !1;
  if (t.size === void 0)
    if (e.size === void 0)
      typeof t.cacheResult == "function" && t.cacheResult();
    else {
      i = !0;
      var o = t;
      t = e, e = o;
    }
  var s = !0, u = (
    // @ts-expect-error b is Range | Repeat | Collection<unknown, unknown> as it may have been flipped, and __iterate is valid
    e.__iterate(function(a, f) {
      if (r ? (
        // @ts-expect-error has exists on Collection
        !t.has(a)
      ) : i ? (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !ft(a, t.get(f, L))
      ) : (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !ft(t.get(f, L), a)
      ))
        return s = !1, !1;
    })
  );
  return s && // @ts-expect-error size should exists on Collection
  t.size === u;
}
function $r(t, e) {
  var r = function(n) {
    t.prototype[n] = e[n];
  };
  return Object.keys(e).forEach(r), Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(e).forEach(r), t;
}
function xo(t) {
  if (!t || typeof t != "object")
    return t;
  if (!Nt(t)) {
    if (!er(t))
      return t;
    t = mt(t);
  }
  if (H(t)) {
    var e = {};
    return t.__iterate(function(n, i) {
      e[i] = xo(n);
    }), e;
  }
  var r = [];
  return t.__iterate(function(n) {
    r.push(xo(n));
  }), r;
}
var Di = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? Mn() : xs(r) && !le(r) ? r : Mn().withMutations(function(n) {
      var i = t(r);
      Bt(i.size), i.forEach(function(o) {
        return n.add(o);
      });
    });
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return this(arguments);
  }, e.fromKeys = function(n) {
    return this(se(n).keySeq());
  }, e.intersect = function(n) {
    return n = ct(n).toArray(), n.length ? ht.intersect.apply(e(n.pop()), n) : Mn();
  }, e.union = function(n) {
    return n = ct(n).toArray(), n.length ? ht.union.apply(e(n.pop()), n) : Mn();
  }, e.prototype.toString = function() {
    return this.__toString("Set {", "}");
  }, e.prototype.has = function(n) {
    return this._map.has(n);
  }, e.prototype.add = function(n) {
    return Qi(this, this._map.set(n, n));
  }, e.prototype.remove = function(n) {
    return Qi(this, this._map.remove(n));
  }, e.prototype.clear = function() {
    return Qi(this, this._map.clear());
  }, e.prototype.map = function(n, i) {
    var o = this, s = !1, u = Qi(
      this,
      this._map.mapEntries(function(a) {
        var f = a[1], c = n.call(i, f, f, o);
        return c !== f && (s = !0), [c, c];
      }, i)
    );
    return s ? u : this;
  }, e.prototype.union = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    return n = n.filter(function(o) {
      return o.size !== 0;
    }), n.length === 0 ? this : this.size === 0 && !this.__ownerID && n.length === 1 ? this.constructor(n[0]) : this.withMutations(function(o) {
      for (var s = 0; s < n.length; s++)
        typeof n[s] == "string" ? o.add(n[s]) : t(n[s]).forEach(function(u) {
          return o.add(u);
        });
    });
  }, e.prototype.intersect = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    if (n.length === 0)
      return this;
    n = n.map(function(s) {
      return t(s);
    });
    var o = [];
    return this.forEach(function(s) {
      n.every(function(u) {
        return u.includes(s);
      }) || o.push(s);
    }), this.withMutations(function(s) {
      o.forEach(function(u) {
        s.remove(u);
      });
    });
  }, e.prototype.subtract = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    if (n.length === 0)
      return this;
    n = n.map(function(s) {
      return t(s);
    });
    var o = [];
    return this.forEach(function(s) {
      n.some(function(u) {
        return u.includes(s);
      }) && o.push(s);
    }), this.withMutations(function(s) {
      o.forEach(function(u) {
        s.remove(u);
      });
    });
  }, e.prototype.sort = function(n) {
    return Xr(kr(this, n));
  }, e.prototype.sortBy = function(n, i) {
    return Xr(kr(this, i, n));
  }, e.prototype.wasAltered = function() {
    return this._map.wasAltered();
  }, e.prototype.__iterate = function(n, i) {
    var o = this;
    return this._map.__iterate(function(s) {
      return n(s, s, o);
    }, i);
  }, e.prototype.__iterator = function(n, i) {
    return this._map.__iterator(n, i);
  }, e.prototype.__ensureOwner = function(n) {
    if (n === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(n);
    return n ? this.__make(i, n) : this.size === 0 ? this.__empty() : (this.__ownerID = n, this._map = i, this);
  }, e;
}(pn);
Di.isSet = xs;
var ht = Di.prototype;
ht[oy] = !0;
ht[Ti] = ht.remove;
ht.merge = ht.concat = ht.union;
ht.withMutations = Ci;
ht.asImmutable = Ni;
ht["@@transducer/init"] = ht.asMutable = Fi;
ht["@@transducer/step"] = function(t, e) {
  return t.add(e);
};
ht["@@transducer/result"] = function(t) {
  return t.asImmutable();
};
ht.__empty = Mn;
ht.__make = sy;
function Qi(t, e) {
  return t.__ownerID ? (t.size = e.size, t._map = e, t) : e === t._map ? t : e.size === 0 ? t.__empty() : t.__make(e);
}
function sy(t, e) {
  var r = Object.create(ht);
  return r.size = t ? t.size : 0, r._map = t, r.__ownerID = e, r;
}
var wl;
function Mn() {
  return wl || (wl = sy(ge()));
}
var uy = /* @__PURE__ */ function(t) {
  function e(r, n, i) {
    if (i === void 0 && (i = 1), !(this instanceof e))
      return new e(r, n, i);
    if (Fn(i !== 0, "Cannot step a Range by 0"), Fn(
      r !== void 0,
      "You must define a start value when using Range"
    ), Fn(
      n !== void 0,
      "You must define an end value when using Range"
    ), i = Math.abs(i), n < r && (i = -i), this._start = r, this._end = n, this._step = i, this.size = Math.max(0, Math.ceil((n - r) / i - 1) + 1), this.size === 0) {
      if (Zs)
        return Zs;
      Zs = this;
    }
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.toString = function() {
    return this.size === 0 ? "Range []" : "Range [ " + this._start + "..." + this._end + (this._step !== 1 ? " by " + this._step : "") + " ]";
  }, e.prototype.get = function(n, i) {
    return this.has(n) ? this._start + Qe(this, n) * this._step : i;
  }, e.prototype.includes = function(n) {
    var i = (n - this._start) / this._step;
    return i >= 0 && i < this.size && i === Math.floor(i);
  }, e.prototype.slice = function(n, i) {
    return Mi(n, i, this.size) ? this : (n = hn(n, this.size), i = Ii(i, this.size), i <= n ? new e(0, 0) : new e(
      this.get(n, this._end),
      this.get(i, this._end),
      this._step
    ));
  }, e.prototype.indexOf = function(n) {
    var i = n - this._start;
    if (i % this._step === 0) {
      var o = i / this._step;
      if (o >= 0 && o < this.size)
        return o;
    }
    return -1;
  }, e.prototype.lastIndexOf = function(n) {
    return this.indexOf(n);
  }, e.prototype.__iterate = function(n, i) {
    for (var o = this.size, s = this._step, u = i ? this._start + (o - 1) * s : this._start, a = 0; a !== o && n(u, i ? o - ++a : a++, this) !== !1; )
      u += i ? -s : s;
    return a;
  }, e.prototype.__iterator = function(n, i) {
    var o = this.size, s = this._step, u = i ? this._start + (o - 1) * s : this._start, a = 0;
    return new C(function() {
      if (a === o)
        return yt();
      var f = u;
      return u += i ? -s : s, Z(n, i ? o - ++a : a++, f);
    });
  }, e.prototype.equals = function(n) {
    return n instanceof e ? this._start === n._start && this._end === n._end && this._step === n._step : Rf(this, n);
  }, e;
}(ae), Zs;
function $f(t, e, r) {
  for (var n = qv(e), i = 0; i !== n.length; )
    if (t = hf(t, n[i++], L), t === L)
      return r;
  return t;
}
function ay(t, e) {
  return $f(this, t, e);
}
function fy(t, e) {
  return $f(t, e, L) !== L;
}
function mM(t) {
  return fy(this, t);
}
function cy() {
  Bt(this.size);
  var t = {};
  return this.__iterate(function(e, r) {
    t[r] = e;
  }), t;
}
ct.Iterator = C;
$r(ct, {
  // ### Conversion to other types
  toArray: function() {
    Bt(this.size);
    var e = new Array(this.size || 0), r = H(this), n = 0;
    return this.__iterate(function(i, o) {
      e[n++] = r ? [o, i] : i;
    }), e;
  },
  toIndexedSeq: function() {
    return new Lv(this);
  },
  toJS: function() {
    return xo(this);
  },
  toKeyedSeq: function() {
    return new As(this, !0);
  },
  toMap: function() {
    return Rr(this.toKeyedSeq());
  },
  toObject: cy,
  toOrderedMap: function() {
    return be(this.toKeyedSeq());
  },
  toOrderedSet: function() {
    return Xr(H(this) ? this.valueSeq() : this);
  },
  toSet: function() {
    return Di(H(this) ? this.valueSeq() : this);
  },
  toSetSeq: function() {
    return new Cv(this);
  },
  toSeq: function() {
    return zt(this) ? this.toIndexedSeq() : H(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack: function() {
    return Ss(H(this) ? this.valueSeq() : this);
  },
  toList: function() {
    return zi(H(this) ? this.valueSeq() : this);
  },
  // ### Common JavaScript methods and properties
  toString: function() {
    return "[Collection]";
  },
  __toString: function(e, r) {
    return this.size === 0 ? e + r : e + " " + this.toSeq().map(this.__toStringMapper).join(", ") + " " + r;
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  concat: function() {
    for (var e = [], r = arguments.length; r--; ) e[r] = arguments[r];
    return U(this, QT(this, e));
  },
  includes: function(e) {
    return this.some(function(r) {
      return ft(r, e);
    });
  },
  entries: function() {
    return this.__iterator(Zt);
  },
  every: function(e, r) {
    Bt(this.size);
    var n = !0;
    return this.__iterate(function(i, o, s) {
      if (!e.call(r, i, o, s))
        return n = !1, !1;
    }), n;
  },
  filter: function(e, r) {
    return U(this, Dv(this, e, r, !0));
  },
  partition: function(e, r) {
    return XT(this, e, r);
  },
  find: function(e, r, n) {
    var i = this.findEntry(e, r);
    return i ? i[1] : n;
  },
  forEach: function(e, r) {
    return Bt(this.size), this.__iterate(r ? e.bind(r) : e);
  },
  join: function(e) {
    Bt(this.size), e = e !== void 0 ? "" + e : ",";
    var r = "", n = !0;
    return this.__iterate(function(i) {
      n ? n = !1 : r += e, r += i != null ? i.toString() : "";
    }), r;
  },
  keys: function() {
    return this.__iterator(dn);
  },
  map: function(e, r) {
    return U(this, zv(this, e, r));
  },
  reduce: function(e, r, n) {
    return Al(
      this,
      e,
      r,
      n,
      arguments.length < 2,
      !1
    );
  },
  reduceRight: function(e, r, n) {
    return Al(
      this,
      e,
      r,
      n,
      arguments.length < 2,
      !0
    );
  },
  reverse: function() {
    return U(this, uf(this, !0));
  },
  slice: function(e, r) {
    return U(this, af(this, e, r, !0));
  },
  some: function(e, r) {
    Bt(this.size);
    var n = !1;
    return this.__iterate(function(i, o, s) {
      if (e.call(r, i, o, s))
        return n = !0, !1;
    }), n;
  },
  sort: function(e) {
    return U(this, kr(this, e));
  },
  values: function() {
    return this.__iterator(Yt);
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
  count: function(e, r) {
    return Ur(
      e ? this.toSeq().filter(e, r) : this
    );
  },
  countBy: function(e, r) {
    return YT(this, e, r);
  },
  equals: function(e) {
    return Rf(this, e);
  },
  entrySeq: function() {
    var e = this;
    if (e._cache)
      return new Gr(e._cache);
    var r = e.toSeq().map(wM).toIndexedSeq();
    return r.fromEntrySeq = function() {
      return e.toSeq();
    }, r;
  },
  filterNot: function(e, r) {
    return this.filter(Xs(e), r);
  },
  findEntry: function(e, r, n) {
    var i = n;
    return this.__iterate(function(o, s, u) {
      if (e.call(r, o, s, u))
        return i = [s, o], !1;
    }), i;
  },
  findKey: function(e, r) {
    var n = this.findEntry(e, r);
    return n && n[0];
  },
  findLast: function(e, r, n) {
    return this.toKeyedSeq().reverse().find(e, r, n);
  },
  findLastEntry: function(e, r, n) {
    return this.toKeyedSeq().reverse().findEntry(e, r, n);
  },
  findLastKey: function(e, r) {
    return this.toKeyedSeq().reverse().findKey(e, r);
  },
  first: function(e) {
    return this.find(Sv, null, e);
  },
  flatMap: function(e, r) {
    return U(this, tM(this, e, r));
  },
  flatten: function(e) {
    return U(this, jv(this, e, !0));
  },
  fromEntrySeq: function() {
    return new Fv(this);
  },
  get: function(e, r) {
    return this.find(function(n, i) {
      return ft(i, e);
    }, void 0, r);
  },
  getIn: ay,
  groupBy: function(e, r) {
    return ZT(this, e, r);
  },
  has: function(e) {
    return this.get(e, L) !== L;
  },
  hasIn: mM,
  isSubset: function(e) {
    return e = typeof e.includes == "function" ? e : ct(e), this.every(function(r) {
      return e.includes(r);
    });
  },
  isSuperset: function(e) {
    return e = typeof e.isSubset == "function" ? e : ct(e), e.isSubset(this);
  },
  keyOf: function(e) {
    return this.findKey(function(r) {
      return ft(r, e);
    });
  },
  keySeq: function() {
    return this.toSeq().map(bM).toIndexedSeq();
  },
  last: function(e) {
    return this.toSeq().reverse().first(e);
  },
  lastKeyOf: function(e) {
    return this.toKeyedSeq().reverse().keyOf(e);
  },
  max: function(e) {
    return Xi(this, e);
  },
  maxBy: function(e, r) {
    return Xi(this, r, e);
  },
  min: function(e) {
    return Xi(
      this,
      e ? Sl(e) : Ol
    );
  },
  minBy: function(e, r) {
    return Xi(
      this,
      r ? Sl(r) : Ol,
      e
    );
  },
  rest: function() {
    return this.slice(1);
  },
  skip: function(e) {
    return e === 0 ? this : this.slice(Math.max(0, e));
  },
  skipLast: function(e) {
    return e === 0 ? this : this.slice(0, -Math.max(0, e));
  },
  skipWhile: function(e, r) {
    return U(this, Bv(this, e, r, !0));
  },
  skipUntil: function(e, r) {
    return this.skipWhile(Xs(e), r);
  },
  sortBy: function(e, r) {
    return U(this, kr(this, r, e));
  },
  take: function(e) {
    return this.slice(0, Math.max(0, e));
  },
  takeLast: function(e) {
    return this.slice(-Math.max(0, e));
  },
  takeWhile: function(e, r) {
    return U(this, VT(this, e, r));
  },
  takeUntil: function(e, r) {
    return this.takeWhile(Xs(e), r);
  },
  update: function(e) {
    return e(this);
  },
  valueSeq: function() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode: function() {
    return this.__hash || (this.__hash = AM(this));
  }
  // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)
});
var bt = ct.prototype;
bt[Ev] = !0;
bt[ys] = bt.values;
bt.toJSON = bt.toArray;
bt.__toStringMapper = ti;
bt.inspect = bt.toSource = function() {
  return this.toString();
};
bt.chain = bt.flatMap;
bt.contains = bt.includes;
$r(se, {
  // ### More sequential methods
  flip: function() {
    return U(this, Nv(this));
  },
  mapEntries: function(e, r) {
    var n = this, i = 0;
    return U(
      this,
      this.toSeq().map(function(o, s) {
        return e.call(r, [s, o], i++, n);
      }).fromEntrySeq()
    );
  },
  mapKeys: function(e, r) {
    var n = this;
    return U(
      this,
      this.toSeq().flip().map(function(i, o) {
        return e.call(r, i, o, n);
      }).flip()
    );
  }
});
var Bi = se.prototype;
Bi[bo] = !0;
Bi[ys] = bt.entries;
Bi.toJSON = cy;
Bi.__toStringMapper = function(t, e) {
  return ti(e) + ": " + ti(t);
};
$r(Or, {
  // ### Conversion to other types
  toKeyedSeq: function() {
    return new As(this, !1);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter: function(e, r) {
    return U(this, Dv(this, e, r, !1));
  },
  findIndex: function(e, r) {
    var n = this.findEntry(e, r);
    return n ? n[0] : -1;
  },
  indexOf: function(e) {
    var r = this.keyOf(e);
    return r === void 0 ? -1 : r;
  },
  lastIndexOf: function(e) {
    var r = this.lastKeyOf(e);
    return r === void 0 ? -1 : r;
  },
  reverse: function() {
    return U(this, uf(this, !1));
  },
  slice: function(e, r) {
    return U(this, af(this, e, r, !1));
  },
  splice: function(e, r) {
    var n = arguments.length;
    if (r = Math.max(r || 0, 0), n === 0 || n === 2 && !r)
      return this;
    e = hn(e, e < 0 ? this.count() : this.size);
    var i = this.slice(0, e);
    return U(
      this,
      n === 1 ? i : i.concat(_e(arguments, 2), this.slice(e + r))
    );
  },
  // ### More collection methods
  findLastIndex: function(e, r) {
    var n = this.findLastEntry(e, r);
    return n ? n[0] : -1;
  },
  first: function(e) {
    return this.get(0, e);
  },
  flatten: function(e) {
    return U(this, jv(this, e, !1));
  },
  get: function(e, r) {
    return e = Qe(this, e), e < 0 || this.size === 1 / 0 || this.size !== void 0 && e > this.size ? r : this.find(function(n, i) {
      return i === e;
    }, void 0, r);
  },
  has: function(e) {
    return e = Qe(this, e), e >= 0 && (this.size !== void 0 ? this.size === 1 / 0 || e < this.size : this.indexOf(e) !== -1);
  },
  interpose: function(e) {
    return U(this, eM(this, e));
  },
  interleave: function() {
    var e = [this].concat(_e(arguments)), r = Vi(this.toSeq(), ae.of, e), n = r.flatten(!0);
    return r.size && (n.size = r.size * e.length), U(this, n);
  },
  keySeq: function() {
    return uy(0, this.size);
  },
  last: function(e) {
    return this.get(-1, e);
  },
  skipWhile: function(e, r) {
    return U(this, Bv(this, e, r, !1));
  },
  zip: function() {
    var e = [this].concat(_e(arguments));
    return U(this, Vi(this, xl, e));
  },
  zipAll: function() {
    var e = [this].concat(_e(arguments));
    return U(this, Vi(this, xl, e, !0));
  },
  zipWith: function(e) {
    var r = _e(arguments);
    return r[0] = this, U(this, Vi(this, e, r));
  }
});
var vn = Or.prototype;
vn[wo] = !0;
vn[tr] = !0;
$r(pn, {
  // ### ES6 Collection methods (ES6 Array and Map)
  get: function(e, r) {
    return this.has(e) ? e : r;
  },
  includes: function(e) {
    return this.has(e);
  },
  // ### More sequential methods
  keySeq: function() {
    return this.valueSeq();
  }
});
var Zr = pn.prototype;
Zr.has = bt.includes;
Zr.contains = Zr.includes;
Zr.keys = Zr.values;
$r(fr, Bi);
$r(ae, vn);
$r(gn, Zr);
function Al(t, e, r, n, i, o) {
  return Bt(t.size), t.__iterate(function(s, u, a) {
    i ? (i = !1, r = s) : r = e.call(n, r, s, u, a);
  }, o), r;
}
function bM(t, e) {
  return e;
}
function wM(t, e) {
  return [e, t];
}
function Xs(t) {
  return function() {
    return !t.apply(this, arguments);
  };
}
function Sl(t) {
  return function() {
    return -t.apply(this, arguments);
  };
}
function xl() {
  return _e(arguments);
}
function Ol(t, e) {
  return t < e ? 1 : t > e ? -1 : 0;
}
function AM(t) {
  if (t.size === 1 / 0)
    return 0;
  var e = le(t), r = H(t), n = e ? 1 : 0;
  return t.__iterate(
    r ? e ? function(i, o) {
      n = 31 * n + El(Lt(i), Lt(o)) | 0;
    } : function(i, o) {
      n = n + El(Lt(i), Lt(o)) | 0;
    } : e ? function(i) {
      n = 31 * n + Lt(i) | 0;
    } : function(i) {
      n = n + Lt(i) | 0;
    }
  ), SM(t.size, n);
}
function SM(t, e) {
  return e = On(e, 3432918353), e = On(e << 15 | e >>> -15, 461845907), e = On(e << 13 | e >>> -13, 5), e = (e + 3864292196 | 0) ^ t, e = On(e ^ e >>> 16, 2246822507), e = On(e ^ e >>> 13, 3266489909), e = ws(e ^ e >>> 16), e;
}
function El(t, e) {
  return t ^ e + 2654435769 + (t << 6) + (t >> 2) | 0;
}
var Xr = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? Fu() : Ef(r) ? r : Fu().withMutations(function(n) {
      var i = pn(r);
      Bt(i.size), i.forEach(function(o) {
        return n.add(o);
      });
    });
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return this(arguments);
  }, e.fromKeys = function(n) {
    return this(se(n).keySeq());
  }, e.prototype.toString = function() {
    return this.__toString("OrderedSet {", "}");
  }, e;
}(Di);
Xr.isOrderedSet = Ef;
var Tr = Xr.prototype;
Tr[tr] = !0;
Tr.zip = vn.zip;
Tr.zipWith = vn.zipWith;
Tr.zipAll = vn.zipAll;
Tr.__empty = Fu;
Tr.__make = ly;
function ly(t, e) {
  var r = Object.create(Tr);
  return r.size = t ? t.size : 0, r._map = t, r.__ownerID = e, r;
}
var Rl;
function Fu() {
  return Rl || (Rl = ly($n()));
}
var xM = {
  LeftThenRight: -1,
  RightThenLeft: 1
};
function OM(t) {
  if (ar(t))
    throw new Error(
      "Can not call `Record` with an immutable Record as default values. Use a plain javascript object instead."
    );
  if (ue(t))
    throw new Error(
      "Can not call `Record` with an immutable Collection as default values. Use a plain javascript object instead."
    );
  if (t === null || typeof t != "object")
    throw new Error(
      "Can not call `Record` with a non-object as default values. Use a plain javascript object instead."
    );
}
var st = function(e, r) {
  var n;
  OM(e);
  var i = function(u) {
    var a = this;
    if (u instanceof i)
      return u;
    if (!(this instanceof i))
      return new i(u);
    if (!n) {
      n = !0;
      var f = Object.keys(e), c = o._indices = {};
      o._name = r, o._keys = f, o._defaultValues = e;
      for (var l = 0; l < f.length; l++) {
        var p = f[l];
        c[p] = l, o[p] ? typeof console == "object" && console.warn && console.warn(
          "Cannot define " + Mf(this) + ' with property "' + p + '" since that property name is part of the Record API.'
        ) : EM(o, p);
      }
    }
    return this.__ownerID = void 0, this._values = zi().withMutations(function(d) {
      d.setSize(a._keys.length), se(u).forEach(function(_, g) {
        d.set(a._indices[g], _ === a._defaultValues[g] ? void 0 : _);
      });
    }), this;
  }, o = i.prototype = Object.create(K);
  return o.constructor = i, r && (i.displayName = r), i;
};
st.prototype.toString = function() {
  for (var e = Mf(this) + " { ", r = this._keys, n, i = 0, o = r.length; i !== o; i++)
    n = r[i], e += (i ? ", " : "") + n + ": " + ti(this.get(n));
  return e + " }";
};
st.prototype.equals = function(e) {
  return this === e || ar(e) && Vr(this).equals(Vr(e));
};
st.prototype.hashCode = function() {
  return Vr(this).hashCode();
};
st.prototype.has = function(e) {
  return this._indices.hasOwnProperty(e);
};
st.prototype.get = function(e, r) {
  if (!this.has(e))
    return r;
  var n = this._indices[e], i = this._values.get(n);
  return i === void 0 ? this._defaultValues[e] : i;
};
st.prototype.set = function(e, r) {
  if (this.has(e)) {
    var n = this._values.set(
      this._indices[e],
      r === this._defaultValues[e] ? void 0 : r
    );
    if (n !== this._values && !this.__ownerID)
      return Tf(this, n);
  }
  return this;
};
st.prototype.remove = function(e) {
  return this.set(e);
};
st.prototype.clear = function() {
  var e = this._values.clear().setSize(this._keys.length);
  return this.__ownerID ? this : Tf(this, e);
};
st.prototype.wasAltered = function() {
  return this._values.wasAltered();
};
st.prototype.toSeq = function() {
  return Vr(this);
};
st.prototype.toJS = function() {
  return xo(this);
};
st.prototype.entries = function() {
  return this.__iterator(Zt);
};
st.prototype.__iterator = function(e, r) {
  return Vr(this).__iterator(e, r);
};
st.prototype.__iterate = function(e, r) {
  return Vr(this).__iterate(e, r);
};
st.prototype.__ensureOwner = function(e) {
  if (e === this.__ownerID)
    return this;
  var r = this._values.__ensureOwner(e);
  return e ? Tf(this, r, e) : (this.__ownerID = e, this._values = r, this);
};
st.isRecord = ar;
st.getDescriptiveName = Mf;
var K = st.prototype;
K[$v] = !0;
K[Ti] = K.remove;
K.deleteIn = K.removeIn = df;
K.getIn = ay;
K.hasIn = bt.hasIn;
K.merge = Zv;
K.mergeWith = Xv;
K.mergeIn = yf;
K.mergeDeep = Jv;
K.mergeDeepWith = Qv;
K.mergeDeepIn = mf;
K.setIn = pf;
K.update = gf;
K.updateIn = vf;
K.withMutations = Ci;
K.asMutable = Fi;
K.asImmutable = Ni;
K[ys] = K.entries;
K.toJSON = K.toObject = bt.toObject;
K.inspect = K.toSource = function() {
  return this.toString();
};
function Tf(t, e, r) {
  var n = Object.create(Object.getPrototypeOf(t));
  return n._values = e, n.__ownerID = r, n;
}
function Mf(t) {
  return t.constructor.displayName || t.constructor.name || "Record";
}
function Vr(t) {
  return nf(t._keys.map(function(e) {
    return [e, t.get(e)];
  }));
}
function EM(t, e) {
  try {
    Object.defineProperty(t, e, {
      get: function() {
        return this.get(e);
      },
      set: function(r) {
        Fn(this.__ownerID, "Cannot set on an immutable record."), this.set(e, r);
      }
    });
  } catch {
  }
}
var RM = /* @__PURE__ */ function(t) {
  function e(r, n) {
    if (!(this instanceof e))
      return new e(r, n);
    if (this._value = r, this.size = n === void 0 ? 1 / 0 : Math.max(0, n), this.size === 0) {
      if (Vs)
        return Vs;
      Vs = this;
    }
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.toString = function() {
    return this.size === 0 ? "Repeat []" : "Repeat [ " + this._value + " " + this.size + " times ]";
  }, e.prototype.get = function(n, i) {
    return this.has(n) ? this._value : i;
  }, e.prototype.includes = function(n) {
    return ft(this._value, n);
  }, e.prototype.slice = function(n, i) {
    var o = this.size;
    return Mi(n, i, o) ? this : new e(
      this._value,
      Ii(i, o) - hn(n, o)
    );
  }, e.prototype.reverse = function() {
    return this;
  }, e.prototype.indexOf = function(n) {
    return ft(this._value, n) ? 0 : -1;
  }, e.prototype.lastIndexOf = function(n) {
    return ft(this._value, n) ? this.size : -1;
  }, e.prototype.__iterate = function(n, i) {
    for (var o = this.size, s = 0; s !== o && n(this._value, i ? o - ++s : s++, this) !== !1; )
      ;
    return s;
  }, e.prototype.__iterator = function(n, i) {
    var o = this, s = this.size, u = 0;
    return new C(
      function() {
        return u === s ? yt() : Z(n, i ? s - ++u : u++, o._value);
      }
    );
  }, e.prototype.equals = function(n) {
    return n instanceof e ? ft(this._value, n._value) : Rf(this, n);
  }, e;
}(ae), Vs;
function $M(t, e) {
  return hy(
    [],
    e || TM,
    t,
    "",
    e && e.length > 2 ? [] : void 0,
    { "": t }
  );
}
function hy(t, e, r, n, i, o) {
  if (typeof r != "string" && !ue(r) && (tf(r) || Qa(r) || lf(r))) {
    if (~t.indexOf(r))
      throw new TypeError("Cannot convert circular structure to Immutable");
    t.push(r), i && n !== "" && i.push(n);
    var s = e.call(
      o,
      n,
      mt(r).map(
        function(u, a) {
          return hy(t, e, u, a, i, r);
        }
      ),
      i && i.slice()
    );
    return t.pop(), i && i.pop(), s;
  }
  return r;
}
function TM(t, e) {
  return zt(e) ? e.toList() : H(e) ? e.toMap() : e.toSet();
}
var MM = "5.1.3", IM = ct;
const v3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Collection: ct,
  Iterable: IM,
  List: zi,
  Map: Rr,
  OrderedMap: be,
  OrderedSet: Xr,
  PairSorting: xM,
  Range: uy,
  Record: st,
  Repeat: RM,
  Seq: mt,
  Set: Di,
  Stack: Ss,
  fromJS: $M,
  get: hf,
  getIn: $f,
  has: Uv,
  hasIn: fy,
  hash: Lt,
  is: ft,
  isAssociative: gs,
  isCollection: Nt,
  isImmutable: ue,
  isIndexed: zt,
  isKeyed: H,
  isList: xf,
  isMap: bs,
  isOrdered: le,
  isOrderedMap: sf,
  isOrderedSet: Ef,
  isPlainObject: lf,
  isRecord: ar,
  isSeq: vs,
  isSet: xs,
  isStack: So,
  isValueObject: Mu,
  merge: nM,
  mergeDeep: oM,
  mergeDeepWith: sM,
  mergeWith: iM,
  remove: Gv,
  removeIn: Yv,
  set: kv,
  setIn: Kv,
  update: _f,
  updateIn: Er,
  version: MM
}, Symbol.toStringTag, { value: "Module" }));
/**
* @vue/reactivity v3.5.16
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function PM(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const r of t.split(",")) e[r] = 1;
  return (r) => r in e;
}
const LM = Object.freeze({}), CM = () => {
}, Oo = Object.assign, FM = (t, e) => {
  const r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}, NM = Object.prototype.hasOwnProperty, Eo = (t, e) => NM.call(t, e), Fe = Array.isArray, Dr = (t) => Os(t) === "[object Map]", zM = (t) => Os(t) === "[object Set]", oi = (t) => typeof t == "function", DM = (t) => typeof t == "string", ji = (t) => typeof t == "symbol", yn = (t) => t !== null && typeof t == "object", BM = Object.prototype.toString, Os = (t) => BM.call(t), py = (t) => Os(t).slice(8, -1), jM = (t) => Os(t) === "[object Object]", If = (t) => DM(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, WM = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (r) => e[r] || (e[r] = t(r));
}, qM = WM((t) => t.charAt(0).toUpperCase() + t.slice(1)), Ye = (t, e) => !Object.is(t, e), UM = (t, e, r, n = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: n,
    value: r
  });
};
function Xt(t, ...e) {
  console.warn(`[Vue warn] ${t}`, ...e);
}
let _t;
class dy {
  constructor(e = !1) {
    this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = _t, !e && _t && (this.index = (_t.scopes || (_t.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let e, r;
      if (this.scopes)
        for (e = 0, r = this.scopes.length; e < r; e++)
          this.scopes[e].pause();
      for (e = 0, r = this.effects.length; e < r; e++)
        this.effects[e].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let e, r;
      if (this.scopes)
        for (e = 0, r = this.scopes.length; e < r; e++)
          this.scopes[e].resume();
      for (e = 0, r = this.effects.length; e < r; e++)
        this.effects[e].resume();
    }
  }
  run(e) {
    if (this._active) {
      const r = _t;
      try {
        return _t = this, e();
      } finally {
        _t = r;
      }
    } else
      Xt("cannot run an inactive effect scope.");
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = _t, _t = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (_t = this.prevScope, this.prevScope = void 0);
  }
  stop(e) {
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
      if (!this.detached && this.parent && !e) {
        const i = this.parent.scopes.pop();
        i && i !== this && (this.parent.scopes[this.index] = i, i.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function GM(t) {
  return new dy(t);
}
function _y() {
  return _t;
}
function kM(t, e = !1) {
  _t ? _t.cleanups.push(t) : e || Xt(
    "onScopeDispose() is called when there is no active effect scope to be associated with."
  );
}
let F;
const HM = {
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
}, Js = /* @__PURE__ */ new WeakSet();
class si {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, _t && _t.active && _t.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Js.has(this) && (Js.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || vy(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, $l(this), yy(this);
    const e = F, r = qt;
    F = this, qt = !0;
    try {
      return this.fn();
    } finally {
      F !== this && Xt(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), my(this), F = e, qt = r, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Cf(e);
      this.deps = this.depsTail = void 0, $l(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Js.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Nu(this) && this.run();
  }
  get dirty() {
    return Nu(this);
  }
}
let gy = 0, zn, Dn;
function vy(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = Dn, Dn = t;
    return;
  }
  t.next = zn, zn = t;
}
function Pf() {
  gy++;
}
function Lf() {
  if (--gy > 0)
    return;
  if (Dn) {
    let e = Dn;
    for (Dn = void 0; e; ) {
      const r = e.next;
      e.next = void 0, e.flags &= -9, e = r;
    }
  }
  let t;
  for (; zn; ) {
    let e = zn;
    for (zn = void 0; e; ) {
      const r = e.next;
      if (e.next = void 0, e.flags &= -9, e.flags & 1)
        try {
          e.trigger();
        } catch (n) {
          t || (t = n);
        }
      e = r;
    }
  }
  if (t) throw t;
}
function yy(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function my(t) {
  let e, r = t.depsTail, n = r;
  for (; n; ) {
    const i = n.prevDep;
    n.version === -1 ? (n === r && (r = i), Cf(n), KM(n)) : e = n, n.dep.activeLink = n.prevActiveLink, n.prevActiveLink = void 0, n = i;
  }
  t.deps = e, t.depsTail = r;
}
function Nu(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (by(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function by(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === ui) || (t.globalVersion = ui, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !Nu(t))))
    return;
  t.flags |= 2;
  const e = t.dep, r = F, n = qt;
  F = t, qt = !0;
  try {
    yy(t);
    const i = t.fn(t._value);
    (e.version === 0 || Ye(i, t._value)) && (t.flags |= 128, t._value = i, e.version++);
  } catch (i) {
    throw e.version++, i;
  } finally {
    F = r, qt = n, my(t), t.flags &= -3;
  }
}
function Cf(t, e = !1) {
  const { dep: r, prevSub: n, nextSub: i } = t;
  if (n && (n.nextSub = i, t.prevSub = void 0), i && (i.prevSub = n, t.nextSub = void 0), r.subsHead === t && (r.subsHead = i), r.subs === t && (r.subs = n, !n && r.computed)) {
    r.computed.flags &= -5;
    for (let o = r.computed.deps; o; o = o.nextDep)
      Cf(o, !0);
  }
  !e && !--r.sc && r.map && r.map.delete(r.key);
}
function KM(t) {
  const { prevDep: e, nextDep: r } = t;
  e && (e.nextDep = r, t.prevDep = void 0), r && (r.prevDep = e, t.nextDep = void 0);
}
function YM(t, e) {
  t.effect instanceof si && (t = t.effect.fn);
  const r = new si(t);
  e && Oo(r, e);
  try {
    r.run();
  } catch (i) {
    throw r.stop(), i;
  }
  const n = r.run.bind(r);
  return n.effect = r, n;
}
function ZM(t) {
  t.effect.stop();
}
let qt = !0;
const Ff = [];
function Nf() {
  Ff.push(qt), qt = !1;
}
function XM() {
  Ff.push(qt), qt = !0;
}
function zf() {
  const t = Ff.pop();
  qt = t === void 0 ? !0 : t;
}
function VM(t, e = !1) {
  F instanceof si ? F.cleanup = t : e || Xt(
    "onEffectCleanup() was called when there was no active effect to associate with."
  );
}
function $l(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const r = F;
    F = void 0;
    try {
      e();
    } finally {
      F = r;
    }
  }
}
let ui = 0;
class JM {
  constructor(e, r) {
    this.sub = e, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Es {
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.subsHead = void 0;
  }
  track(e) {
    if (!F || !qt || F === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== F)
      r = this.activeLink = new JM(F, this), F.deps ? (r.prevDep = F.depsTail, F.depsTail.nextDep = r, F.depsTail = r) : F.deps = F.depsTail = r, wy(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const n = r.nextDep;
      n.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = n), r.prevDep = F.depsTail, r.nextDep = void 0, F.depsTail.nextDep = r, F.depsTail = r, F.deps === r && (F.deps = n);
    }
    return F.onTrack && F.onTrack(
      Oo(
        {
          effect: F
        },
        e
      )
    ), r;
  }
  trigger(e) {
    this.version++, ui++, this.notify(e);
  }
  notify(e) {
    Pf();
    try {
      for (let r = this.subsHead; r; r = r.nextSub)
        r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
          Oo(
            {
              effect: r.sub
            },
            e
          )
        );
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
    } finally {
      Lf();
    }
  }
}
function wy(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let n = e.deps; n; n = n.nextDep)
        wy(n);
    }
    const r = t.dep.subs;
    r !== t && (t.prevSub = r, r && (r.nextSub = t)), t.dep.subsHead === void 0 && (t.dep.subsHead = t), t.dep.subs = t;
  }
}
const Ro = /* @__PURE__ */ new WeakMap(), Ze = Symbol(
  "Object iterate"
), $o = Symbol(
  "Map keys iterate"
), Jr = Symbol(
  "Array iterate"
);
function At(t, e, r) {
  if (qt && F) {
    let n = Ro.get(t);
    n || Ro.set(t, n = /* @__PURE__ */ new Map());
    let i = n.get(r);
    i || (n.set(r, i = new Es()), i.map = n, i.key = r), i.track({
      target: t,
      type: e,
      key: r
    });
  }
}
function Le(t, e, r, n, i, o) {
  const s = Ro.get(t);
  if (!s) {
    ui++;
    return;
  }
  const u = (a) => {
    a && a.trigger({
      target: t,
      type: e,
      key: r,
      newValue: n,
      oldValue: i,
      oldTarget: o
    });
  };
  if (Pf(), e === "clear")
    s.forEach(u);
  else {
    const a = Fe(t), f = a && If(r);
    if (a && r === "length") {
      const c = Number(n);
      s.forEach((l, p) => {
        (p === "length" || p === Jr || !ji(p) && p >= c) && u(l);
      });
    } else
      switch ((r !== void 0 || s.has(void 0)) && u(s.get(r)), f && u(s.get(Jr)), e) {
        case "add":
          a ? f && u(s.get("length")) : (u(s.get(Ze)), Dr(t) && u(s.get($o)));
          break;
        case "delete":
          a || (u(s.get(Ze)), Dr(t) && u(s.get($o)));
          break;
        case "set":
          Dr(t) && u(s.get(Ze));
          break;
      }
  }
  Lf();
}
function QM(t, e) {
  const r = Ro.get(t);
  return r && r.get(e);
}
function hr(t) {
  const e = z(t);
  return e === t ? e : (At(e, "iterate", Jr), te(t) ? e : e.map(gt));
}
function Rs(t) {
  return At(t = z(t), "iterate", Jr), t;
}
const tI = {
  __proto__: null,
  [Symbol.iterator]() {
    return Qs(this, Symbol.iterator, gt);
  },
  concat(...t) {
    return hr(this).concat(
      ...t.map((e) => Fe(e) ? hr(e) : e)
    );
  },
  entries() {
    return Qs(this, "entries", (t) => (t[1] = gt(t[1]), t));
  },
  every(t, e) {
    return Ie(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return Ie(this, "filter", t, e, (r) => r.map(gt), arguments);
  },
  find(t, e) {
    return Ie(this, "find", t, e, gt, arguments);
  },
  findIndex(t, e) {
    return Ie(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return Ie(this, "findLast", t, e, gt, arguments);
  },
  findLastIndex(t, e) {
    return Ie(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return Ie(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return tu(this, "includes", t);
  },
  indexOf(...t) {
    return tu(this, "indexOf", t);
  },
  join(t) {
    return hr(this).join(t);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...t) {
    return tu(this, "lastIndexOf", t);
  },
  map(t, e) {
    return Ie(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return En(this, "pop");
  },
  push(...t) {
    return En(this, "push", t);
  },
  reduce(t, ...e) {
    return Tl(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return Tl(this, "reduceRight", t, e);
  },
  shift() {
    return En(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return Ie(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return En(this, "splice", t);
  },
  toReversed() {
    return hr(this).toReversed();
  },
  toSorted(t) {
    return hr(this).toSorted(t);
  },
  toSpliced(...t) {
    return hr(this).toSpliced(...t);
  },
  unshift(...t) {
    return En(this, "unshift", t);
  },
  values() {
    return Qs(this, "values", gt);
  }
};
function Qs(t, e, r) {
  const n = Rs(t), i = n[e]();
  return n !== t && !te(t) && (i._next = i.next, i.next = () => {
    const o = i._next();
    return o.value && (o.value = r(o.value)), o;
  }), i;
}
const eI = Array.prototype;
function Ie(t, e, r, n, i, o) {
  const s = Rs(t), u = s !== t && !te(t), a = s[e];
  if (a !== eI[e]) {
    const l = a.apply(t, o);
    return u ? gt(l) : l;
  }
  let f = r;
  s !== t && (u ? f = function(l, p) {
    return r.call(this, gt(l), p, t);
  } : r.length > 2 && (f = function(l, p) {
    return r.call(this, l, p, t);
  }));
  const c = a.call(s, f, n);
  return u && i ? i(c) : c;
}
function Tl(t, e, r, n) {
  const i = Rs(t);
  let o = r;
  return i !== t && (te(t) ? r.length > 3 && (o = function(s, u, a) {
    return r.call(this, s, u, a, t);
  }) : o = function(s, u, a) {
    return r.call(this, s, gt(u), a, t);
  }), i[e](o, ...n);
}
function tu(t, e, r) {
  const n = z(t);
  At(n, "iterate", Jr);
  const i = n[e](...r);
  return (i === -1 || i === !1) && jf(r[0]) ? (r[0] = z(r[0]), n[e](...r)) : i;
}
function En(t, e, r = []) {
  Nf(), Pf();
  const n = z(t)[e].apply(t, r);
  return Lf(), zf(), n;
}
const rI = /* @__PURE__ */ PM("__proto__,__v_isRef,__isVue"), Ay = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(ji)
);
function nI(t) {
  ji(t) || (t = String(t));
  const e = z(this);
  return At(e, "has", t), e.hasOwnProperty(t);
}
class Sy {
  constructor(e = !1, r = !1) {
    this._isReadonly = e, this._isShallow = r;
  }
  get(e, r, n) {
    if (r === "__v_skip") return e.__v_skip;
    const i = this._isReadonly, o = this._isShallow;
    if (r === "__v_isReactive")
      return !i;
    if (r === "__v_isReadonly")
      return i;
    if (r === "__v_isShallow")
      return o;
    if (r === "__v_raw")
      return n === (i ? o ? Ty : $y : o ? Ry : Ey).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const s = Fe(e);
    if (!i) {
      let a;
      if (s && (a = tI[r]))
        return a;
      if (r === "hasOwnProperty")
        return nI;
    }
    const u = Reflect.get(
      e,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      xt(e) ? e : n
    );
    return (ji(r) ? Ay.has(r) : rI(r)) || (i || At(e, "get", r), o) ? u : xt(u) ? s && If(r) ? u : u.value : yn(u) ? i ? Bf(u) : Df(u) : u;
  }
}
class xy extends Sy {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, r, n, i) {
    let o = e[r];
    if (!this._isShallow) {
      const a = rr(o);
      if (!te(n) && !rr(n) && (o = z(o), n = z(n)), !Fe(e) && xt(o) && !xt(n))
        return a ? !1 : (o.value = n, !0);
    }
    const s = Fe(e) && If(r) ? Number(r) < e.length : Eo(e, r), u = Reflect.set(
      e,
      r,
      n,
      xt(e) ? e : i
    );
    return e === z(i) && (s ? Ye(n, o) && Le(e, "set", r, n, o) : Le(e, "add", r, n)), u;
  }
  deleteProperty(e, r) {
    const n = Eo(e, r), i = e[r], o = Reflect.deleteProperty(e, r);
    return o && n && Le(e, "delete", r, void 0, i), o;
  }
  has(e, r) {
    const n = Reflect.has(e, r);
    return (!ji(r) || !Ay.has(r)) && At(e, "has", r), n;
  }
  ownKeys(e) {
    return At(
      e,
      "iterate",
      Fe(e) ? "length" : Ze
    ), Reflect.ownKeys(e);
  }
}
class Oy extends Sy {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, r) {
    return Xt(
      `Set operation on key "${String(r)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, r) {
    return Xt(
      `Delete operation on key "${String(r)}" failed: target is readonly.`,
      e
    ), !0;
  }
}
const iI = /* @__PURE__ */ new xy(), oI = /* @__PURE__ */ new Oy(), sI = /* @__PURE__ */ new xy(!0), uI = /* @__PURE__ */ new Oy(!0), zu = (t) => t, to = (t) => Reflect.getPrototypeOf(t);
function aI(t, e, r) {
  return function(...n) {
    const i = this.__v_raw, o = z(i), s = Dr(o), u = t === "entries" || t === Symbol.iterator && s, a = t === "keys" && s, f = i[t](...n), c = r ? zu : e ? To : gt;
    return !e && At(
      o,
      "iterate",
      a ? $o : Ze
    ), {
      // iterator protocol
      next() {
        const { value: l, done: p } = f.next();
        return p ? { value: l, done: p } : {
          value: u ? [c(l[0]), c(l[1])] : c(l),
          done: p
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function eo(t) {
  return function(...e) {
    {
      const r = e[0] ? `on key "${e[0]}" ` : "";
      Xt(
        `${qM(t)} operation ${r}failed: target is readonly.`,
        z(this)
      );
    }
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function fI(t, e) {
  const r = {
    get(i) {
      const o = this.__v_raw, s = z(o), u = z(i);
      t || (Ye(i, u) && At(s, "get", i), At(s, "get", u));
      const { has: a } = to(s), f = e ? zu : t ? To : gt;
      if (a.call(s, i))
        return f(o.get(i));
      if (a.call(s, u))
        return f(o.get(u));
      o !== s && o.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !t && At(z(i), "iterate", Ze), Reflect.get(i, "size", i);
    },
    has(i) {
      const o = this.__v_raw, s = z(o), u = z(i);
      return t || (Ye(i, u) && At(s, "has", i), At(s, "has", u)), i === u ? o.has(i) : o.has(i) || o.has(u);
    },
    forEach(i, o) {
      const s = this, u = s.__v_raw, a = z(u), f = e ? zu : t ? To : gt;
      return !t && At(a, "iterate", Ze), u.forEach((c, l) => i.call(o, f(c), f(l), s));
    }
  };
  return Oo(
    r,
    t ? {
      add: eo("add"),
      set: eo("set"),
      delete: eo("delete"),
      clear: eo("clear")
    } : {
      add(i) {
        !e && !te(i) && !rr(i) && (i = z(i));
        const o = z(this);
        return to(o).has.call(o, i) || (o.add(i), Le(o, "add", i, i)), this;
      },
      set(i, o) {
        !e && !te(o) && !rr(o) && (o = z(o));
        const s = z(this), { has: u, get: a } = to(s);
        let f = u.call(s, i);
        f ? Ml(s, u, i) : (i = z(i), f = u.call(s, i));
        const c = a.call(s, i);
        return s.set(i, o), f ? Ye(o, c) && Le(s, "set", i, o, c) : Le(s, "add", i, o), this;
      },
      delete(i) {
        const o = z(this), { has: s, get: u } = to(o);
        let a = s.call(o, i);
        a ? Ml(o, s, i) : (i = z(i), a = s.call(o, i));
        const f = u ? u.call(o, i) : void 0, c = o.delete(i);
        return a && Le(o, "delete", i, void 0, f), c;
      },
      clear() {
        const i = z(this), o = i.size !== 0, s = Dr(i) ? new Map(i) : new Set(i), u = i.clear();
        return o && Le(
          i,
          "clear",
          void 0,
          void 0,
          s
        ), u;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((i) => {
    r[i] = aI(i, t, e);
  }), r;
}
function $s(t, e) {
  const r = fI(t, e);
  return (n, i, o) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? n : Reflect.get(
    Eo(r, i) && i in n ? r : n,
    i,
    o
  );
}
const cI = {
  get: /* @__PURE__ */ $s(!1, !1)
}, lI = {
  get: /* @__PURE__ */ $s(!1, !0)
}, hI = {
  get: /* @__PURE__ */ $s(!0, !1)
}, pI = {
  get: /* @__PURE__ */ $s(!0, !0)
};
function Ml(t, e, r) {
  const n = z(r);
  if (n !== r && e.call(t, n)) {
    const i = py(t);
    Xt(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Ey = /* @__PURE__ */ new WeakMap(), Ry = /* @__PURE__ */ new WeakMap(), $y = /* @__PURE__ */ new WeakMap(), Ty = /* @__PURE__ */ new WeakMap();
function dI(t) {
  switch (t) {
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
function _I(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : dI(py(t));
}
function Df(t) {
  return rr(t) ? t : Ts(
    t,
    !1,
    iI,
    cI,
    Ey
  );
}
function gI(t) {
  return Ts(
    t,
    !1,
    sI,
    lI,
    Ry
  );
}
function Bf(t) {
  return Ts(
    t,
    !0,
    oI,
    hI,
    $y
  );
}
function vI(t) {
  return Ts(
    t,
    !0,
    uI,
    pI,
    Ty
  );
}
function Ts(t, e, r, n, i) {
  if (!yn(t))
    return Xt(
      `value cannot be made ${e ? "readonly" : "reactive"}: ${String(
        t
      )}`
    ), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const o = _I(t);
  if (o === 0)
    return t;
  const s = i.get(t);
  if (s)
    return s;
  const u = new Proxy(
    t,
    o === 2 ? n : r
  );
  return i.set(t, u), u;
}
function Br(t) {
  return rr(t) ? Br(t.__v_raw) : !!(t && t.__v_isReactive);
}
function rr(t) {
  return !!(t && t.__v_isReadonly);
}
function te(t) {
  return !!(t && t.__v_isShallow);
}
function jf(t) {
  return t ? !!t.__v_raw : !1;
}
function z(t) {
  const e = t && t.__v_raw;
  return e ? z(e) : t;
}
function yI(t) {
  return !Eo(t, "__v_skip") && Object.isExtensible(t) && UM(t, "__v_skip", !0), t;
}
const gt = (t) => yn(t) ? Df(t) : t, To = (t) => yn(t) ? Bf(t) : t;
function xt(t) {
  return t ? t.__v_isRef === !0 : !1;
}
function My(t) {
  return Iy(t, !1);
}
function mI(t) {
  return Iy(t, !0);
}
function Iy(t, e) {
  return xt(t) ? t : new bI(t, e);
}
class bI {
  constructor(e, r) {
    this.dep = new Es(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = r ? e : z(e), this._value = r ? e : gt(e), this.__v_isShallow = r;
  }
  get value() {
    return this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }), this._value;
  }
  set value(e) {
    const r = this._rawValue, n = this.__v_isShallow || te(e) || rr(e);
    e = n ? e : z(e), Ye(e, r) && (this._rawValue = e, this._value = n ? e : gt(e), this.dep.trigger({
      target: this,
      type: "set",
      key: "value",
      newValue: e,
      oldValue: r
    }));
  }
}
function wI(t) {
  t.dep && t.dep.trigger({
    target: t,
    type: "set",
    key: "value",
    newValue: t._value
  });
}
function Wf(t) {
  return xt(t) ? t.value : t;
}
function AI(t) {
  return oi(t) ? t() : Wf(t);
}
const SI = {
  get: (t, e, r) => e === "__v_raw" ? t : Wf(Reflect.get(t, e, r)),
  set: (t, e, r, n) => {
    const i = t[e];
    return xt(i) && !xt(r) ? (i.value = r, !0) : Reflect.set(t, e, r, n);
  }
};
function xI(t) {
  return Br(t) ? t : new Proxy(t, SI);
}
class OI {
  constructor(e) {
    this.__v_isRef = !0, this._value = void 0;
    const r = this.dep = new Es(), { get: n, set: i } = e(r.track.bind(r), r.trigger.bind(r));
    this._get = n, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(e) {
    this._set(e);
  }
}
function EI(t) {
  return new OI(t);
}
function RI(t) {
  jf(t) || Xt("toRefs() expects a reactive object but received a plain one.");
  const e = Fe(t) ? new Array(t.length) : {};
  for (const r in t)
    e[r] = Py(t, r);
  return e;
}
class $I {
  constructor(e, r, n) {
    this._object = e, this._key = r, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0;
  }
  get value() {
    const e = this._object[this._key];
    return this._value = e === void 0 ? this._defaultValue : e;
  }
  set value(e) {
    this._object[this._key] = e;
  }
  get dep() {
    return QM(z(this._object), this._key);
  }
}
class TI {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
function MI(t, e, r) {
  return xt(t) ? t : oi(t) ? new TI(t) : yn(t) && arguments.length > 1 ? Py(t, e, r) : My(t);
}
function Py(t, e, r) {
  const n = t[e];
  return xt(n) ? n : new $I(t, e, r);
}
class II {
  constructor(e, r, n) {
    this.fn = e, this.setter = r, this._value = void 0, this.dep = new Es(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ui - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !r, this.isSSR = n;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    F !== this)
      return vy(this, !0), !0;
  }
  get value() {
    const e = this.dep.track({
      target: this,
      type: "get",
      key: "value"
    });
    return by(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter ? this.setter(e) : Xt("Write operation failed: computed value is readonly");
  }
}
function PI(t, e, r = !1) {
  let n, i;
  oi(t) ? n = t : (n = t.get, i = t.set);
  const o = new II(n, i, r);
  return e && !r && (o.onTrack = e.onTrack, o.onTrigger = e.onTrigger), o;
}
const LI = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate"
}, CI = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
  CLEAR: "clear"
}, FI = {
  SKIP: "__v_skip",
  IS_REACTIVE: "__v_isReactive",
  IS_READONLY: "__v_isReadonly",
  IS_SHALLOW: "__v_isShallow",
  RAW: "__v_raw",
  IS_REF: "__v_isRef"
}, NI = {
  WATCH_GETTER: 2,
  2: "WATCH_GETTER",
  WATCH_CALLBACK: 3,
  3: "WATCH_CALLBACK",
  WATCH_CLEANUP: 4,
  4: "WATCH_CLEANUP"
}, ro = {}, Mo = /* @__PURE__ */ new WeakMap();
let He;
function zI() {
  return He;
}
function Ly(t, e = !1, r = He) {
  if (r) {
    let n = Mo.get(r);
    n || Mo.set(r, n = []), n.push(t);
  } else e || Xt(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function DI(t, e, r = LM) {
  const { immediate: n, deep: i, once: o, scheduler: s, augmentJob: u, call: a } = r, f = (A) => {
    (r.onWarn || Xt)(
      "Invalid watch source: ",
      A,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, c = (A) => i ? A : te(A) || i === !1 || i === 0 ? Ce(A, 1) : Ce(A);
  let l, p, d, _, g = !1, v = !1;
  if (xt(t) ? (p = () => t.value, g = te(t)) : Br(t) ? (p = () => c(t), g = !0) : Fe(t) ? (v = !0, g = t.some((A) => Br(A) || te(A)), p = () => t.map((A) => {
    if (xt(A))
      return A.value;
    if (Br(A))
      return c(A);
    if (oi(A))
      return a ? a(A, 2) : A();
    f(A);
  })) : oi(t) ? e ? p = a ? () => a(t, 2) : t : p = () => {
    if (d) {
      Nf();
      try {
        d();
      } finally {
        zf();
      }
    }
    const A = He;
    He = l;
    try {
      return a ? a(t, 3, [_]) : t(_);
    } finally {
      He = A;
    }
  } : (p = CM, f(t)), e && i) {
    const A = p, x = i === !0 ? 1 / 0 : i;
    p = () => Ce(A(), x);
  }
  const y = _y(), m = () => {
    l.stop(), y && y.active && FM(y.effects, l);
  };
  if (o && e) {
    const A = e;
    e = (...x) => {
      A(...x), m();
    };
  }
  let w = v ? new Array(t.length).fill(ro) : ro;
  const b = (A) => {
    if (!(!(l.flags & 1) || !l.dirty && !A))
      if (e) {
        const x = l.run();
        if (i || g || (v ? x.some((M, nt) => Ye(M, w[nt])) : Ye(x, w))) {
          d && d();
          const M = He;
          He = l;
          try {
            const nt = [
              x,
              // pass undefined as the old value when it's changed for the first time
              w === ro ? void 0 : v && w[0] === ro ? [] : w,
              _
            ];
            w = x, a ? a(e, 3, nt) : (
              // @ts-expect-error
              e(...nt)
            );
          } finally {
            He = M;
          }
        }
      } else
        l.run();
  };
  return u && u(b), l = new si(p), l.scheduler = s ? () => s(b, !1) : b, _ = (A) => Ly(A, !1, l), d = l.onStop = () => {
    const A = Mo.get(l);
    if (A) {
      if (a)
        a(A, 4);
      else
        for (const x of A) x();
      Mo.delete(l);
    }
  }, l.onTrack = r.onTrack, l.onTrigger = r.onTrigger, e ? n ? b(!0) : w = l.run() : s ? s(b.bind(null, !0), !0) : l.run(), m.pause = l.pause.bind(l), m.resume = l.resume.bind(l), m.stop = m, m;
}
function Ce(t, e = 1 / 0, r) {
  if (e <= 0 || !yn(t) || t.__v_skip || (r = r || /* @__PURE__ */ new Set(), r.has(t)))
    return t;
  if (r.add(t), e--, xt(t))
    Ce(t.value, e, r);
  else if (Fe(t))
    for (let n = 0; n < t.length; n++)
      Ce(t[n], e, r);
  else if (zM(t) || Dr(t))
    t.forEach((n) => {
      Ce(n, e, r);
    });
  else if (jM(t)) {
    for (const n in t)
      Ce(t[n], e, r);
    for (const n of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, n) && Ce(t[n], e, r);
  }
  return t;
}
const y3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ARRAY_ITERATE_KEY: Jr,
  EffectFlags: HM,
  EffectScope: dy,
  ITERATE_KEY: Ze,
  MAP_KEY_ITERATE_KEY: $o,
  ReactiveEffect: si,
  ReactiveFlags: FI,
  TrackOpTypes: LI,
  TriggerOpTypes: CI,
  WatchErrorCodes: NI,
  computed: PI,
  customRef: EI,
  effect: YM,
  effectScope: GM,
  enableTracking: XM,
  getCurrentScope: _y,
  getCurrentWatcher: zI,
  isProxy: jf,
  isReactive: Br,
  isReadonly: rr,
  isRef: xt,
  isShallow: te,
  markRaw: yI,
  onEffectCleanup: VM,
  onScopeDispose: kM,
  onWatcherCleanup: Ly,
  pauseTracking: Nf,
  proxyRefs: xI,
  reactive: Df,
  reactiveReadArray: hr,
  readonly: Bf,
  ref: My,
  resetTracking: zf,
  shallowReactive: gI,
  shallowReadArray: Rs,
  shallowReadonly: vI,
  shallowRef: mI,
  stop: ZM,
  toRaw: z,
  toReactive: gt,
  toReadonly: To,
  toRef: MI,
  toRefs: RI,
  toValue: AI,
  track: At,
  traverse: Ce,
  trigger: Le,
  triggerRef: wI,
  unref: Wf,
  watch: DI
}, Symbol.toStringTag, { value: "Module" })), BI = Symbol.for("preact-signals"), ve = 1, Qr = 2, ai = 4, mn = 8, fo = 16, tn = 32;
function Ms() {
  jn++;
}
function Is() {
  if (jn > 1) {
    jn--;
    return;
  }
  let t, e = !1;
  for (; Bn !== void 0; ) {
    let r = Bn;
    for (Bn = void 0, Du++; r !== void 0; ) {
      const n = r._nextBatchedEffect;
      if (r._nextBatchedEffect = void 0, r._flags &= ~Qr, !(r._flags & mn) && Fy(r))
        try {
          r._callback();
        } catch (i) {
          e || (t = i, e = !0);
        }
      r = n;
    }
  }
  if (Du = 0, jn--, e)
    throw t;
}
function jI(t) {
  if (jn > 0)
    return t();
  Ms();
  try {
    return t();
  } finally {
    Is();
  }
}
let j;
function WI(t) {
  const e = j;
  j = void 0;
  try {
    return t();
  } finally {
    j = e;
  }
}
let Bn, jn = 0, Du = 0, Io = 0;
function Cy(t) {
  if (j === void 0)
    return;
  let e = t._node;
  if (e === void 0 || e._target !== j)
    return e = {
      _version: 0,
      _source: t,
      _prevSource: j._sources,
      _nextSource: void 0,
      _target: j,
      _prevTarget: void 0,
      _nextTarget: void 0,
      _rollbackNode: e
    }, j._sources !== void 0 && (j._sources._nextSource = e), j._sources = e, t._node = e, j._flags & tn && t._subscribe(e), e;
  if (e._version === -1)
    return e._version = 0, e._nextSource !== void 0 && (e._nextSource._prevSource = e._prevSource, e._prevSource !== void 0 && (e._prevSource._nextSource = e._nextSource), e._prevSource = j._sources, e._nextSource = void 0, j._sources._nextSource = e, j._sources = e), e;
}
function wt(t) {
  this._value = t, this._version = 0, this._node = void 0, this._targets = void 0;
}
wt.prototype.brand = BI;
wt.prototype._refresh = function() {
  return !0;
};
wt.prototype._subscribe = function(t) {
  this._targets !== t && t._prevTarget === void 0 && (t._nextTarget = this._targets, this._targets !== void 0 && (this._targets._prevTarget = t), this._targets = t);
};
wt.prototype._unsubscribe = function(t) {
  if (this._targets !== void 0) {
    const e = t._prevTarget, r = t._nextTarget;
    e !== void 0 && (e._nextTarget = r, t._prevTarget = void 0), r !== void 0 && (r._prevTarget = e, t._nextTarget = void 0), t === this._targets && (this._targets = r);
  }
};
wt.prototype.subscribe = function(t) {
  return By(() => {
    const e = this.value, r = j;
    j = void 0;
    try {
      t(e);
    } finally {
      j = r;
    }
  });
};
wt.prototype.valueOf = function() {
  return this.value;
};
wt.prototype.toString = function() {
  return this.value + "";
};
wt.prototype.toJSON = function() {
  return this.value;
};
wt.prototype.peek = function() {
  const t = j;
  j = void 0;
  try {
    return this.value;
  } finally {
    j = t;
  }
};
Object.defineProperty(wt.prototype, "value", {
  get() {
    const t = Cy(this);
    return t !== void 0 && (t._version = this._version), this._value;
  },
  set(t) {
    if (t !== this._value) {
      if (Du > 100)
        throw new Error("Cycle detected");
      this._value = t, this._version++, Io++, Ms();
      try {
        for (let e = this._targets; e !== void 0; e = e._nextTarget)
          e._target._notify();
      } finally {
        Is();
      }
    }
  }
});
function qI(t) {
  return new wt(t);
}
function Fy(t) {
  for (let e = t._sources; e !== void 0; e = e._nextSource)
    if (e._source._version !== e._version || !e._source._refresh() || e._source._version !== e._version)
      return !0;
  return !1;
}
function Ny(t) {
  for (let e = t._sources; e !== void 0; e = e._nextSource) {
    const r = e._source._node;
    if (r !== void 0 && (e._rollbackNode = r), e._source._node = e, e._version = -1, e._nextSource === void 0) {
      t._sources = e;
      break;
    }
  }
}
function zy(t) {
  let e = t._sources, r;
  for (; e !== void 0; ) {
    const n = e._prevSource;
    e._version === -1 ? (e._source._unsubscribe(e), n !== void 0 && (n._nextSource = e._nextSource), e._nextSource !== void 0 && (e._nextSource._prevSource = n)) : r = e, e._source._node = e._rollbackNode, e._rollbackNode !== void 0 && (e._rollbackNode = void 0), e = n;
  }
  t._sources = r;
}
function Mr(t) {
  wt.call(this, void 0), this._fn = t, this._sources = void 0, this._globalVersion = Io - 1, this._flags = ai;
}
Mr.prototype = new wt();
Mr.prototype._refresh = function() {
  if (this._flags &= ~Qr, this._flags & ve)
    return !1;
  if ((this._flags & (ai | tn)) === tn || (this._flags &= ~ai, this._globalVersion === Io))
    return !0;
  if (this._globalVersion = Io, this._flags |= ve, this._version > 0 && !Fy(this))
    return this._flags &= ~ve, !0;
  const t = j;
  try {
    Ny(this), j = this;
    const e = this._fn();
    (this._flags & fo || this._value !== e || this._version === 0) && (this._value = e, this._flags &= ~fo, this._version++);
  } catch (e) {
    this._value = e, this._flags |= fo, this._version++;
  }
  return j = t, zy(this), this._flags &= ~ve, !0;
};
Mr.prototype._subscribe = function(t) {
  if (this._targets === void 0) {
    this._flags |= ai | tn;
    for (let e = this._sources; e !== void 0; e = e._nextSource)
      e._source._subscribe(e);
  }
  wt.prototype._subscribe.call(this, t);
};
Mr.prototype._unsubscribe = function(t) {
  if (this._targets !== void 0 && (wt.prototype._unsubscribe.call(this, t), this._targets === void 0)) {
    this._flags &= ~tn;
    for (let e = this._sources; e !== void 0; e = e._nextSource)
      e._source._unsubscribe(e);
  }
};
Mr.prototype._notify = function() {
  if (!(this._flags & Qr)) {
    this._flags |= ai | Qr;
    for (let t = this._targets; t !== void 0; t = t._nextTarget)
      t._target._notify();
  }
};
Object.defineProperty(Mr.prototype, "value", {
  get() {
    if (this._flags & ve)
      throw new Error("Cycle detected");
    const t = Cy(this);
    if (this._refresh(), t !== void 0 && (t._version = this._version), this._flags & fo)
      throw this._value;
    return this._value;
  }
});
function UI(t) {
  return new Mr(t);
}
function Dy(t) {
  const e = t._cleanup;
  if (t._cleanup = void 0, typeof e == "function") {
    Ms();
    const r = j;
    j = void 0;
    try {
      e();
    } catch (n) {
      throw t._flags &= ~ve, t._flags |= mn, qf(t), n;
    } finally {
      j = r, Is();
    }
  }
}
function qf(t) {
  for (let e = t._sources; e !== void 0; e = e._nextSource)
    e._source._unsubscribe(e);
  t._fn = void 0, t._sources = void 0, Dy(t);
}
function GI(t) {
  if (j !== this)
    throw new Error("Out-of-order effect");
  zy(this), j = t, this._flags &= ~ve, this._flags & mn && qf(this), Is();
}
function Wi(t) {
  this._fn = t, this._cleanup = void 0, this._sources = void 0, this._nextBatchedEffect = void 0, this._flags = tn;
}
Wi.prototype._callback = function() {
  const t = this._start();
  try {
    if (this._flags & mn || this._fn === void 0) return;
    const e = this._fn();
    typeof e == "function" && (this._cleanup = e);
  } finally {
    t();
  }
};
Wi.prototype._start = function() {
  if (this._flags & ve)
    throw new Error("Cycle detected");
  this._flags |= ve, this._flags &= ~mn, Dy(this), Ny(this), Ms();
  const t = j;
  return j = this, GI.bind(this, t);
};
Wi.prototype._notify = function() {
  this._flags & Qr || (this._flags |= Qr, this._nextBatchedEffect = Bn, Bn = this);
};
Wi.prototype._dispose = function() {
  this._flags |= mn, this._flags & ve || qf(this);
};
function By(t) {
  const e = new Wi(t);
  try {
    e._callback();
  } catch (r) {
    throw e._dispose(), r;
  }
  return e._dispose.bind(e);
}
const m3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Signal: wt,
  batch: jI,
  computed: UI,
  effect: By,
  signal: qI,
  untracked: WI
}, Symbol.toStringTag, { value: "Module" }));
function Bu(t, e) {
  if (t === e) return !0;
  if (t && e && typeof t == "object" && typeof e == "object") {
    if (t.constructor !== e.constructor) return !1;
    var r, n, i;
    if (Array.isArray(t)) {
      if (r = t.length, r != e.length) return !1;
      for (n = r; n-- !== 0; )
        if (!Bu(t[n], e[n])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === e.source && t.flags === e.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === e.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === e.toString();
    if (i = Object.keys(t), r = i.length, r !== Object.keys(e).length) return !1;
    for (n = r; n-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(e, i[n])) return !1;
    for (n = r; n-- !== 0; ) {
      var o = i[n];
      if (!Bu(t[o], e[o])) return !1;
    }
    return !0;
  }
  return t !== t && e !== e;
}
class kI {
  name;
  fields;
  parent;
  context;
  options;
  current;
  dirty;
  constructor(e, r) {
    this.context = e, this.options = r, this.current = this.default(), this.dirty = !0, r.overrideMethods && Object.assign(this, r.overrideMethods), this.options.init?.call(this);
  }
  equal(e, r) {
    return Bu(e, r);
  }
  default() {
    return typeof this.options.default == "function" ? this.options.default(this.context) : this.options.default;
  }
  reset() {
    this.set(this.default());
  }
  shouldUpdate(e) {
    return !(!this.dirty && this.equal(this.current, e));
  }
  set(e) {
    return this.shouldUpdate(e) ? (this.options.set?.call(this, e, this.context), this.current = this.options.map, this.dirty = !1, !0) : !1;
  }
  get() {
    return this.current;
  }
  dispose() {
    this.options.dispose?.call(this);
  }
}
class jy {
  static create(e, r) {
    return new jy(e, r);
  }
  context;
  options = /* @__PURE__ */ new Map();
  optionClass = /* @__PURE__ */ new Map();
  constructor(e, r) {
    return this.context = e, r && this.initOptions(r), new Proxy(this, {
      get(n, i) {
        return n.options.has(i) ? n.getOption(i) : Reflect.get(n, i);
      }
    });
  }
  register(e, r) {
    this.optionClass.set(e, r);
  }
  defineGetter(e) {
    Object.defineProperty(this, e, {
      get: () => this.getOption(e),
      enumerable: !0
    });
  }
  initOptions(e) {
    for (let r in e)
      if (this.optionClass.has(r)) {
        const n = this.optionClass.get(r), i = new n(this.context, e[r]);
        this.addOptionFromInstance(r, i);
      } else
        this.addOptionFromConfig(r, e[r]);
  }
  getOption(e) {
    return this.options.get(e);
  }
  removeOption(e) {
    this.options.has(e) && (this.options.get(e).dispose(), this.options.delete(e));
  }
  addOptionFromInstance(e, r) {
    this.options.has(e) || (r.parent = this, r.name = e, this.options.set(e, r));
  }
  addOptionFromConfig(e, r) {
    this.addOptionFromInstance(e, new kI(this.context, r));
  }
}
function HI(t) {
  return KI(t) && !YI(t);
}
function KI(t) {
  return !!t && typeof t == "object";
}
function YI(t) {
  var e = Object.prototype.toString.call(t);
  return e === "[object RegExp]" || e === "[object Date]" || VI(t);
}
var ZI = typeof Symbol == "function" && Symbol.for, XI = ZI ? Symbol.for("react.element") : 60103;
function VI(t) {
  return t.$$typeof === XI;
}
var JI = HI;
function QI(t) {
  return Array.isArray(t) ? [] : {};
}
function fi(t, e) {
  return e.clone !== !1 && e.isMergeableObject(t) ? ci(QI(t), t, e) : t;
}
function t3(t, e, r) {
  return t.concat(e).map(function(n) {
    return fi(n, r);
  });
}
function e3(t, e) {
  if (!e.customMerge)
    return ci;
  var r = e.customMerge(t);
  return typeof r == "function" ? r : ci;
}
function r3(t) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(t).filter(function(e) {
    return Object.propertyIsEnumerable.call(t, e);
  }) : [];
}
function Il(t) {
  return Object.keys(t).concat(r3(t));
}
function Wy(t, e) {
  try {
    return e in t;
  } catch {
    return !1;
  }
}
function n3(t, e) {
  return Wy(t, e) && !(Object.hasOwnProperty.call(t, e) && Object.propertyIsEnumerable.call(t, e));
}
function i3(t, e, r) {
  var n = {};
  return r.isMergeableObject(t) && Il(t).forEach(function(i) {
    n[i] = fi(t[i], r);
  }), Il(e).forEach(function(i) {
    n3(t, i) || (Wy(t, i) && r.isMergeableObject(e[i]) ? n[i] = e3(i, r)(t[i], e[i], r) : n[i] = fi(e[i], r));
  }), n;
}
function ci(t, e, r) {
  r = r || {}, r.arrayMerge = r.arrayMerge || t3, r.isMergeableObject = r.isMergeableObject || JI, r.cloneUnlessOtherwiseSpecified = fi;
  var n = Array.isArray(e), i = Array.isArray(t), o = n === i;
  return o ? n ? r.arrayMerge?.(t, e, r) : i3(t, e, r) : fi(e, r);
}
function o3(t, e) {
  if (!Array.isArray(t))
    throw new Error("first argument should be an array");
  return t.reduce(function(r, n) {
    return ci(r, n, e);
  }, {});
}
ci.all = o3;
function Pr(t, e = 0, r = 1) {
  return Math.min(Math.max(t, e), r);
}
function s3(t, e, r) {
  t /= 255, e /= 255, r /= 255;
  const n = Math.max(t, e, r), i = Math.min(t, e, r);
  let o = 0, s, u = (n + i) / 2;
  if (n == i)
    o = s = 0;
  else {
    const a = n - i;
    switch (s = u > 0.5 ? a / (2 - n - i) : a / (n + i), n) {
      case t:
        o = (e - r) / a + (e < r ? 6 : 0);
        break;
      case e:
        o = (r - t) / a + 2;
        break;
      case r:
        o = (t - e) / a + 4;
        break;
    }
    o /= 6;
  }
  return { h: o, s, l: u };
}
function Pl(t, e, r) {
  let n, i, o;
  if (e == 0)
    n = i = o = r;
  else {
    const s = (f, c, l) => (l < 0 && (l += 1), l > 1 && (l -= 1), l < 0.16666666666666666 ? f + (c - f) * 6 * l : l < 0.5 ? c : l < 0.6666666666666666 ? f + (c - f) * (0.6666666666666666 - l) * 6 : f), u = r < 0.5 ? r * (1 + e) : r + e - r * e, a = 2 * r - u;
    n = s(a, u, t + 1 / 3), i = s(a, u, t), o = s(a, u, t - 1 / 3);
  }
  return { r: n * 255, g: i * 255, b: o * 255 };
}
function b3(t, e, r) {
  t /= 255, e /= 255, r /= 255;
  const n = Math.max(t, e, r), i = Math.min(t, e, r);
  let o = 0, s, u = n;
  const a = n - i;
  if (s = n == 0 ? 0 : a / n, n == i)
    o = 0;
  else {
    switch (n) {
      case t:
        o = (e - r) / a + (e < r ? 6 : 0);
        break;
      case e:
        o = (r - t) / a + 2;
        break;
      case r:
        o = (t - e) / a + 4;
        break;
    }
    o /= 6;
  }
  return { h: o, s, v: u };
}
function u3(t, e, r) {
  let n = 0, i = 0, o = 0;
  const s = Math.floor(t * 6), u = t * 6 - s, a = r * (1 - e), f = r * (1 - u * e), c = r * (1 - (1 - u) * e);
  switch (s % 6) {
    case 0:
      n = r, i = c, o = a;
      break;
    case 1:
      n = f, i = r, o = a;
      break;
    case 2:
      n = a, i = r, o = c;
      break;
    case 3:
      n = a, i = f, o = r;
      break;
    case 4:
      n = c, i = a, o = r;
      break;
    case 5:
      n = r, i = a, o = f;
      break;
  }
  return { r: n * 255, g: i * 255, b: o * 255 };
}
function w3(t, e, r) {
  const n = r + e * Math.min(r, 1 - r), i = n === 0 ? 0 : 2 * (1 - r / n);
  return { h: t, s: i, v: n };
}
function A3(t, e, r) {
  const n = (2 - e) * r / 2, i = e === 0 ? e : n <= 1 ? e * r / (2 - e * r) : e * r / (2 - e);
  return { h: t, s: i, l: n };
}
function a3(t) {
  typeof t == "string" && (t = t.replace("#", ""), t = t.length === 3 ? t.replace(/(\w)/g, "$1$1") : t, t = parseInt("0x" + t, 16));
  const e = t, r = e >> 16 & 255, n = e >> 8 & 255, i = e & 255;
  return { r, g: n, b: i };
}
function f3(t, e, r) {
  const n = t.r + (e.r - t.r) * r, i = t.g + (e.g - t.g) * r, o = t.b + (e.b - t.b) * r;
  return { r: n, g: i, b: o };
}
const Ll = {
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
class Dt {
  static Transparent = Dt.fromRGBA(0, 0, 0, 0);
  static BLACK = Dt.fromRGB(0, 0, 0);
  static WHITE = Dt.fromRGB(255, 255, 255);
  static isColor(e) {
    return typeof e == "string" || typeof e == "number" || e instanceof Dt;
  }
  static parse(e) {
    const r = typeof e == "string";
    if (r && e.toLowerCase().startsWith("rgb")) {
      const n = e.match(/rgba?\s*\(([^)]+)\)\s*/i);
      if (n) {
        const i = n[1].split(",").map(parseInt), o = this.fromRGB(i[0], i[1], i[2]);
        return i.length === 4 && (o.alpha = i[3]), o;
      }
    } else if (r && e.startsWith("#") || typeof e == "number")
      return this.fromRGB(a3(e));
    if (r && Ll[e]) {
      const n = Ll[e];
      return this.fromRGB(n[0] * 255 >> 0, n[1] * 255 >> 0, n[2] * 255 >> 0);
    } else if (typeof e == "object" && e !== null)
      return this.fromRGB(e);
    return this.fromRGB(0, 0, 0);
  }
  static fromRGB(e, r, n) {
    return e !== null && typeof e == "object" ? new Dt(e.r, e.g, e.b) : new Dt(e, r, n);
  }
  static fromRGBA(e, r, n, i) {
    return e !== null && typeof e == "object" ? new Dt(e.r, e.g, e.b, r) : new Dt(e, r, n, i);
  }
  static fromHSL(e, r, n) {
    const { r: i, g: o, b: s } = Pl(e, r, n);
    return new Dt(i, o, s);
  }
  static fromHSV(e, r, n) {
    const { r: i, g: o, b: s } = u3(e, r, n);
    return new Dt(i, o, s);
  }
  _r = 0;
  _g = 0;
  _b = 0;
  _a = 1;
  // 构造函数，支持RGB、HSL和HSV初始化
  constructor(e = 0, r = 0, n = 0, i = 1) {
    this._r = e, this._g = r, this._b = n, this._a = i;
  }
  copy(e) {
    return this._r = e.r, this._g = e.g, this._b = e.b, this.alpha = e.alpha, this;
  }
  clone() {
    return Dt.fromRGB(0, 0, 0).copy(this);
  }
  setRGB(e, r, n) {
    return this._r = e, this._g = r, this._b = n, this;
  }
  normalize() {
    return this.r = Pr(this._r / 255, 0, 1), this.g = Pr(this._g / 255, 0, 1), this.b = Pr(this._b / 255, 0, 1), this;
  }
  set r(e) {
    this._r = e;
  }
  get r() {
    return this._r;
  }
  set g(e) {
    this._g = e;
  }
  get g() {
    return this._g;
  }
  set b(e) {
    this._b = e;
  }
  get b() {
    return this._b;
  }
  get a() {
    return this.alpha;
  }
  set a(e) {
    this.alpha = e;
  }
  set alpha(e) {
    this._a = Math.max(0, Math.min(1, e));
  }
  get alpha() {
    return this._a;
  }
  equals(e) {
    return this.r !== e.r || this.g !== e.g || this.b !== e.b || this.alpha !== e.alpha;
  }
  setOpacity(e) {
    return this.alpha = e, this;
  }
  // 颜色混合
  mix(e, r, n = 0.5) {
    const { r: i, g: o, b: s } = f3(e, r, n);
    return new Dt(i, o, s);
  }
  setRBG(e, r, n) {
    return this.r = e, this.g = r, this.b = n, this;
  }
  setRGBColor(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }
  // 变亮
  brighten(e) {
    const { h: r, s: n, l: i } = s3(this.r, this.g, this.b);
    return this.setRGBColor(Pl(r, n, i * (1 + e)));
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
  clamp(e = 0, r = 1) {
    return this.r = Pr(this.r, e, r), this.g = Pr(this.g, e, r), this.b = Pr(this.b, e, r), this;
  }
  toCssRGB() {
    return `rgb(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)})`;
  }
}
export {
  Gf as AT_TARGET,
  ky as BUBBLING_PHASE,
  Gy as CAPTURING_PHASE,
  l3 as Callbacks,
  Dt as Color,
  c3 as Event,
  pt as EventEmitter,
  Po as EventPhase,
  jr as EventPropagation,
  jr as EventTarget,
  v3 as Immutable,
  Fl as NONE,
  jy as Options,
  h3 as PriorityQueue,
  _3 as antvUtil,
  ci as deepmerge,
  Bu as fastDeepEqual,
  a3 as hexToRgb,
  w3 as hslToHsv,
  Pl as hslToRgb,
  A3 as hsvToHsl,
  u3 as hsvToRgb,
  g3 as immer,
  f3 as lerpColor,
  d3 as lodash,
  p3 as radash,
  y3 as reactivity,
  s3 as rgbToHsl,
  b3 as rgbToHsv,
  m3 as signals
};
