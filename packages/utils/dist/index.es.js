class Fd {
  NONE = 0;
  // 无事件阶段
  CAPTURING_PHASE = 1;
  // 捕获阶段
  AT_TARGET = 2;
  // 目标阶段
  BUBBLING_PHASE = 3;
  // 冒泡阶段
  data = null;
  /** 事件类型 */
  type;
  /** 事件是否冒泡 */
  bubbles;
  /** 阻止事件冒泡的标志 */
  cancelBubble = !1;
  /** 事件是否可以取消 */
  cancelable;
  /** 事件是否支持跨文档冒泡 */
  composed;
  /** 事件是否被默认行为阻止 */
  defaultPrevented;
  /** 事件是否由用户操作生成 */
  isTrusted;
  /** 事件的目标对象 */
  target;
  /** 当前正在处理事件的对象 */
  currentTarget;
  /** 事件阶段 */
  eventPhase;
  /** 事件的时间戳 */
  timeStamp;
  /**
   * 标记事件是否应该立即停止传播
   */
  stopImmediatePropagationInternal = !1;
  /**
   * 构造函数
   * @param type 事件类型
   * @param eventInitDict 可选的事件初始化字典
   */
  constructor(e, r) {
    this.type = e, this.bubbles = r?.bubbles ?? !1, this.cancelable = r?.cancelable ?? !1, this.composed = r?.composed ?? !1, this.defaultPrevented = !1, this.isTrusted = !1, this.target = null, this.currentTarget = null, this.eventPhase = 0, this.timeStamp = Date.now();
  }
  setData(e) {
    return this.data = e, this;
  }
  /**
    * 初始化事件对象的属性
    * @param type 事件类型
    * @param bubbles 是否冒泡
    * @param cancelable 是否可以取消
    */
  initEvent(e, r, n) {
    this.type = e, this.bubbles = r ?? !1, this.cancelable = n ?? !1, this.defaultPrevented = !1;
  }
  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    this.cancelBubble = !0;
  }
  /**
   * 阻止事件的默认行为
   */
  preventDefault() {
    this.cancelable && (this.defaultPrevented = !0);
  }
  /**
   * 阻止事件冒泡并停止调用事件监听器
   */
  stopImmediatePropagation() {
    this.stopPropagation(), this.stopImmediatePropagationInternal = !0;
  }
  /**
   * 返回事件的目标对象及其祖先对象的路径
   * @returns 事件路径的数组
   */
  composedPath() {
    const e = [];
    let r = this.target;
    for (; r; )
      e.push(r), r = r.parentNode;
    return e;
  }
}
class Pd {
  listeners = /* @__PURE__ */ new Map();
  parentNode = null;
  constructor() {
  }
  addEventListener(e, r, n) {
    const i = {
      once: !1,
      passive: !1,
      capture: !1
    };
    typeof n != "object" && n !== null ? i.capture = !!n : Object.assign(i, n), this.listeners.has(e) || this.listeners.set(e, { capture: [], bubble: [] });
    const s = this.listeners.get(e), o = {
      ...i,
      handle: r
    };
    i.capture ? s.capture.push(o) : s.bubble.push(o);
  }
  dispatchEvent(e) {
    e.currentTarget = this, e.target = this;
    const r = e.composedPath(), n = [], i = [], s = [];
    for (const a of r) {
      const u = a.listeners?.get(e.type);
      u && (s.push(a), n.unshift(u.capture), i.push(u.bubble));
    }
    let o = s.length - 1;
    t:
      for (const a of n) {
        const u = s[o--];
        e.target = u, e.eventPhase = u === this ? e.AT_TARGET : e.CAPTURING_PHASE;
        for (const f of a)
          if (typeof f.handle == "function" ? f.handle.call(this, e) : f.handle && typeof f.handle.handleEvent == "function" && f.handle.handleEvent(e), f.once && u.removeEventListener(e.type, f.handle), e.stopImmediatePropagationInternal)
            break;
        if (e.cancelBubble)
          break t;
      }
    if (!e.cancelBubble) {
      let a = 0;
      for (const u of i) {
        const f = s[a++];
        e.target = f, e.eventPhase = f === this ? e.AT_TARGET : e.BUBBLING_PHASE;
        for (const c of u)
          if (typeof c.handle == "function" ? c.handle.call(this, e) : c.handle && typeof c.handle.handleEvent == "function" && c.handle.handleEvent(e), c.once && f.removeEventListener(e.type, c.handle), e.stopImmediatePropagationInternal)
            break;
        if (e.cancelBubble || !e.bubbles)
          break;
      }
    }
    return e.eventPhase = e.NONE, !e.defaultPrevented;
  }
  removeEventListener(e, r, n) {
    if (!r || !this.listeners.has(e)) return;
    const i = typeof n == "boolean" ? n : n?.capture ?? !1, s = this.listeners.get(e);
    i ? s.capture = s.capture.filter((o) => o.handle !== r) : s.bubble = s.bubble.filter((o) => o.handle !== r), s.capture.length === 0 && s.bubble.length === 0 && this.listeners.delete(e);
  }
}
var Uu = Object.prototype.hasOwnProperty, tt = "~";
function cr() {
}
Object.create && (cr.prototype = /* @__PURE__ */ Object.create(null), new cr().__proto__ || (tt = !1));
function Wu(t, e, r) {
  this.fn = t, this.context = e, this.once = r || !1;
}
function Ao(t, e, r, n, i) {
  if (typeof r != "function")
    throw new TypeError("The listener must be a function");
  var s = new Wu(r, n || t, i), o = tt ? tt + e : e;
  return t._events[o] ? t._events[o].fn ? t._events[o] = [t._events[o], s] : t._events[o].push(s) : (t._events[o] = s, t._eventsCount++), t;
}
function an(t, e) {
  --t._eventsCount === 0 ? t._events = new cr() : delete t._events[e];
}
function et() {
  this._events = new cr(), this._eventsCount = 0;
}
et.prototype.eventNames = function() {
  var e = [], r, n;
  if (this._eventsCount === 0) return e;
  for (n in r = this._events)
    Uu.call(r, n) && e.push(tt ? n.slice(1) : n);
  return Object.getOwnPropertySymbols ? e.concat(Object.getOwnPropertySymbols(r)) : e;
};
et.prototype.listeners = function(e) {
  var r = tt ? tt + e : e, n = this._events[r];
  if (!n) return [];
  if (n.fn) return [n.fn];
  for (var i = 0, s = n.length, o = new Array(s); i < s; i++)
    o[i] = n[i].fn;
  return o;
};
et.prototype.listenerCount = function(e) {
  var r = tt ? tt + e : e, n = this._events[r];
  return n ? n.fn ? 1 : n.length : 0;
};
et.prototype.emit = function(e, r, n, i, s, o) {
  var a = tt ? tt + e : e;
  if (!this._events[a]) return !1;
  var u = this._events[a], f = arguments.length, c, h;
  if (u.fn) {
    switch (u.once && this.removeListener(e, u.fn, void 0, !0), f) {
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
    for (h = 1, c = new Array(f - 1); h < f; h++)
      c[h - 1] = arguments[h];
    u.fn.apply(u.context, c);
  } else {
    var l = u.length, p;
    for (h = 0; h < l; h++)
      switch (u[h].once && this.removeListener(e, u[h].fn, void 0, !0), f) {
        case 1:
          u[h].fn.call(u[h].context);
          break;
        case 2:
          u[h].fn.call(u[h].context, r);
          break;
        case 3:
          u[h].fn.call(u[h].context, r, n);
          break;
        case 4:
          u[h].fn.call(u[h].context, r, n, i);
          break;
        default:
          if (!c) for (p = 1, c = new Array(f - 1); p < f; p++)
            c[p - 1] = arguments[p];
          u[h].fn.apply(u[h].context, c);
      }
  }
  return !0;
};
et.prototype.on = function(e, r, n) {
  return Ao(this, e, r, n, !1);
};
et.prototype.once = function(e, r, n) {
  return Ao(this, e, r, n, !0);
};
et.prototype.removeListener = function(e, r, n, i) {
  var s = tt ? tt + e : e;
  if (!this._events[s]) return this;
  if (!r)
    return an(this, s), this;
  var o = this._events[s];
  if (o.fn)
    o.fn === r && (!i || o.once) && (!n || o.context === n) && an(this, s);
  else {
    for (var a = 0, u = [], f = o.length; a < f; a++)
      (o[a].fn !== r || i && !o[a].once || n && o[a].context !== n) && u.push(o[a]);
    u.length ? this._events[s] = u.length === 1 ? u[0] : u : an(this, s);
  }
  return this;
};
et.prototype.removeAllListeners = function(e) {
  var r;
  return e ? (r = tt ? tt + e : e, this._events[r] && an(this, r)) : (this._events = new cr(), this._eventsCount = 0), this;
};
et.prototype.off = et.prototype.removeListener;
et.prototype.addListener = et.prototype.on;
et.prefixed = tt;
et.EventEmitter = et;
class Cd {
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
class $d {
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
      let s = e;
      if (n < r && this.compare(this.heap[n], this.heap[s]) < 0 && (s = n), i < r && this.compare(this.heap[i], this.heap[s]) < 0 && (s = i), s === e) break;
      this.swap(e, s), e = s;
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
const Oo = (t) => !!t && t.constructor === Symbol, hr = Array.isArray, Ni = (t) => !!t && t.constructor === Object, Eo = (t) => t == null || typeof t != "object" && typeof t != "function", Ir = (t) => !!(t && t.constructor && t.call && t.apply), Ku = (t) => typeof t == "string" || t instanceof String, Hu = (t) => ge(t) && t % 1 === 0, Gu = (t) => ge(t) && t % 1 !== 0, ge = (t) => {
  try {
    return Number(t) === t;
  } catch {
    return !1;
  }
}, xo = (t) => Object.prototype.toString.call(t) === "[object Date]", Mo = (t) => !(!t || !t.then || !Ir(t.then)), Vu = (t) => {
  if (t === !0 || t === !1 || t == null) return !0;
  if (ge(t)) return t === 0;
  if (xo(t)) return isNaN(t.getTime());
  if (Ir(t) || Oo(t)) return !1;
  const e = t.length;
  if (ge(e)) return e === 0;
  const r = t.size;
  return ge(r) ? r === 0 : Object.keys(t).length === 0;
}, Io = (t, e) => {
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
    if (!Reflect.has(e, r[i]) || !Io(t[r[i]], e[r[i]])) return !1;
  return !0;
}, Yu = (t, e) => t.reduce((r, n) => {
  const i = e(n);
  return r[i] || (r[i] = []), r[i].push(n), r;
}, {});
function Zu(...t) {
  return !t || !t.length ? [] : new Array(Math.max(...t.map(({ length: e }) => e))).fill([]).map((e, r) => t.map((n) => n[r]));
}
function Ju(t, e) {
  if (!t || !t.length)
    return {};
  const r = Ir(e) ? e : hr(e) ? (n, i) => e[i] : (n, i) => e;
  return t.reduce((n, i, s) => (n[i] = r(i, s), n), {});
}
const Li = (t, e) => !t || (t.length ?? 0) === 0 ? null : t.reduce(e);
function Qu(t, e) {
  return (t || []).reduce((r, n) => r + (e ? e(n) : n), 0);
}
const Xu = (t, e = void 0) => t?.length > 0 ? t[0] : e, tf = (t, e = void 0) => t?.length > 0 ? t[t.length - 1] : e, To = (t, e, r = !1) => {
  if (!t) return [];
  const n = (s, o) => e(s) - e(o), i = (s, o) => e(o) - e(s);
  return t.slice().sort(r === !0 ? i : n);
}, ef = (t, e, r = "asc") => {
  if (!t) return [];
  const n = (s, o) => `${e(s)}`.localeCompare(e(o)), i = (s, o) => `${e(o)}`.localeCompare(e(s));
  return t.slice().sort(r === "desc" ? i : n);
}, rf = (t, e) => t ? t.reduce((r, n) => {
  const i = e(n);
  return r[i] = (r[i] ?? 0) + 1, r;
}, {}) : {}, nf = (t, e, r) => {
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
}, zo = (t, e, r = (n) => n) => t.reduce((n, i) => (n[e(i)] = r(i), n), {}), sf = (t, e, r) => t ? t.reduce((n, i, s) => (r(i, s) && n.push(e(i, s)), n), []) : [];
function of(t, e) {
  const r = e ?? ((n) => n);
  return Li(t, (n, i) => r(n) > r(i) ? n : i);
}
function af(t, e) {
  const r = e ?? ((n) => n);
  return Li(t, (n, i) => r(n) < r(i) ? n : i);
}
const uf = (t, e = 2) => {
  const r = Math.ceil(t.length / e);
  return new Array(r).fill(null).map((n, i) => t.slice(i * e, i * e + e));
}, ff = (t, e) => {
  const r = t.reduce((n, i) => {
    const s = e ? e(i) : i;
    return n[s] || (n[s] = i), n;
  }, {});
  return Object.values(r);
};
function* ji(t, e, r = (i) => i, n = 1) {
  const i = Ir(r) ? r : () => r, s = e ? t : 0, o = e ?? t;
  for (let a = s; a <= o && (yield i(a), !(a + n > o)); a += n)
    ;
}
const Di = (t, e, r, n) => Array.from(ji(t, e, r, n)), cf = (t) => t.reduce((e, r) => (e.push(...r), e), []), hf = (t, e, r) => {
  if (!t || !e) return !1;
  const n = r ?? ((s) => s), i = e.reduce((s, o) => (s[n(o)] = !0, s), {});
  return t.some((s) => i[n(s)]);
}, Ro = (t, e) => t ? t.reduce(
  (r, n) => {
    const [i, s] = r;
    return e(n) ? [[...i, n], s] : [i, [...s, n]];
  },
  [[], []]
) : [[], []], lf = (t, e, r) => !e && !t ? [] : e ? t ? r ? t.reduce((n, i) => {
  const s = e.find((o) => r(i) === r(o));
  return s ? n.push(s) : n.push(i), n;
}, []) : t : [] : t, pf = (t, e, r) => {
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
}, _f = (t, e, r, n) => {
  if (!t && !e) return [];
  if (!t) return [e];
  if (!e) return [...t];
  const i = r ? (a, u) => r(a, u) === r(e, u) : (a) => a === e;
  return t.find(i) ? t.filter((a, u) => !i(a, u)) : (n?.strategy ?? "append") === "append" ? [...t, e] : [e, ...t];
}, df = (t) => t?.filter((e) => !!e) ?? [], Fo = (t, e, r) => {
  let n = r;
  for (let i = 1; i <= t; i++)
    n = e(n, i);
  return n;
}, yf = (t, e, r = (n) => n) => {
  if (!t?.length && !e?.length) return [];
  if (t?.length === void 0) return [...e];
  if (!e?.length) return [...t];
  const n = e.reduce((i, s) => (i[r(s)] = !0, i), {});
  return t.filter((i) => !n[r(i)]);
};
function gf(t, e) {
  if (t.length === 0) return t;
  const r = e % t.length;
  return r === 0 ? t : [...t.slice(-r, t.length), ...t.slice(0, -r)];
}
const vf = async (t, e, r) => {
  const n = r !== void 0;
  if (!n && t?.length < 1)
    throw new Error("Cannot reduce empty array with no init value");
  const i = n ? t : t.slice(1);
  let s = n ? r : t[0];
  for (const [o, a] of i.entries())
    s = await e(s, a, o);
  return s;
}, mf = async (t, e) => {
  if (!t) return [];
  let r = [], n = 0;
  for (const i of t) {
    const s = await e(i, n++);
    r.push(s);
  }
  return r;
}, wf = async (t) => {
  const e = [], r = (s, o) => e.push({
    fn: s,
    rethrow: o?.rethrow ?? !1
  }), [n, i] = await Se(t)(r);
  for (const { fn: s, rethrow: o } of e) {
    const [a] = await Se(s)(n);
    if (a && o) throw a;
  }
  if (n) throw n;
  return i;
};
class Po extends Error {
  errors;
  constructor(e = []) {
    super();
    const r = e.find((n) => n.name)?.name ?? "";
    this.name = `AggregateError(${r}...)`, this.message = `AggregateError with ${e.length} errors`, this.stack = e.find((n) => n.stack)?.stack ?? this.stack, this.errors = e;
  }
}
const bf = async (t, e, r) => {
  const n = e.map((f, c) => ({
    index: c,
    item: f
  })), i = async (f) => {
    const c = [];
    for (; ; ) {
      const h = n.pop();
      if (!h) return f(c);
      const [l, p] = await Se(r)(h.item);
      c.push({
        error: l,
        result: p,
        index: h.index
      });
    }
  }, s = Di(1, t).map(() => new Promise(i)), o = await Promise.all(s), [a, u] = Ro(
    To(o.flat(), (f) => f.index),
    (f) => !!f.error
  );
  if (a.length > 0)
    throw new Po(a.map((f) => f.error));
  return u.map((f) => f.result);
};
async function Sf(t) {
  const e = hr(t) ? t.map((i) => [null, i]) : Object.entries(t), r = await Promise.all(
    e.map(
      ([i, s]) => s.then((o) => ({ result: o, exc: null, key: i })).catch((o) => ({ result: null, exc: o, key: i }))
    )
  ), n = r.filter((i) => i.exc);
  if (n.length > 0)
    throw new Po(n.map((i) => i.exc));
  return hr(t) ? r.map((i) => i.result) : r.reduce(
    (i, s) => ({
      ...i,
      [s.key]: s.result
    }),
    {}
  );
}
const Af = async (t, e) => {
  const r = t?.times ?? 3, n = t?.delay, i = t?.backoff ?? null;
  for (const s of ji(1, r)) {
    const [o, a] = await Se(e)((u) => {
      throw { _exited: u };
    });
    if (!o) return a;
    if (o._exited) throw o._exited;
    if (s === r) throw o;
    n && await vi(n), i && await vi(i(s));
  }
}, vi = (t) => new Promise((e) => setTimeout(e, t)), Se = (t) => (...e) => {
  try {
    const r = t(...e);
    return Mo(r) ? r.then((n) => [void 0, n]).catch((n) => [n, void 0]) : [void 0, r];
  } catch (r) {
    return [r, void 0];
  }
}, Of = (t, e) => {
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
function Ef(...t) {
  return (...e) => t.slice(1).reduce((r, n) => n(r), t[0](...e));
}
function xf(...t) {
  return t.reverse().reduce((e, r) => r(e));
}
const Mf = (t, ...e) => (...r) => t(...e, ...r), If = (t, e) => (r) => t({
  ...e,
  ...r
}), Tf = (t) => new Proxy(
  {},
  {
    get: (e, r) => t(r)
  }
), zf = (t, e, r, n) => function(...s) {
  const o = r ? r(...s) : JSON.stringify({ args: s }), a = t[o];
  if (a !== void 0 && (!a.exp || a.exp > (/* @__PURE__ */ new Date()).getTime()))
    return a.value;
  const u = e(...s);
  return t[o] = {
    exp: n ? (/* @__PURE__ */ new Date()).getTime() + n : null,
    value: u
  }, u;
}, Rf = (t, e = {}) => zf({}, t, e.key ?? null, e.ttl ?? null), Ff = ({ delay: t }, e) => {
  let r, n = !0;
  const i = (...s) => {
    n ? (clearTimeout(r), r = setTimeout(() => {
      n && e(...s), r = void 0;
    }, t)) : e(...s);
  };
  return i.isPending = () => r !== void 0, i.cancel = () => {
    n = !1;
  }, i.flush = (...s) => e(...s), i;
}, Pf = ({ interval: t }, e) => {
  let r = !0, n;
  const i = (...s) => {
    r && (e(...s), r = !1, n = setTimeout(() => {
      r = !0, n = void 0;
    }, t));
  };
  return i.isThrottled = () => n !== void 0, i;
}, Cf = (t, e) => {
  const r = () => {
  };
  return new Proxy(Object.assign(r, t), {
    get: (n, i) => n[i],
    set: (n, i, s) => (n[i] = s, !0),
    apply: (n, i, s) => e(Object.assign({}, n))(...s)
  });
};
function $f(t, e, r) {
  return typeof t == "number" && typeof e == "number" && (typeof r > "u" || typeof r == "number") ? (typeof r > "u" && (r = e, e = 0), t >= Math.min(e, r) && t < Math.max(e, r)) : !1;
}
const qf = (t, e) => {
  const r = e === void 0 ? 0 : e;
  if (t == null)
    return r;
  const n = parseFloat(t);
  return isNaN(n) ? r : n;
}, Co = (t, e) => {
  const r = e === void 0 ? 0 : e;
  if (t == null)
    return r;
  const n = parseInt(t);
  return isNaN(n) ? r : n;
}, Nf = (t, e = (r) => r === void 0) => t ? Object.keys(t).reduce((n, i) => (e(t[i]) || (n[i] = t[i]), n), {}) : {}, ki = (t, e) => Object.keys(t).reduce((n, i) => (n[e(i, t[i])] = t[i], n), {}), Lf = (t, e) => Object.keys(t).reduce((n, i) => (n[i] = e(t[i], i), n), {}), jf = (t, e) => t ? Object.entries(t).reduce((r, [n, i]) => {
  const [s, o] = e(n, i);
  return r[s] = o, r;
}, {}) : {}, Df = (t) => t ? Object.keys(t).reduce((r, n) => (r[t[n]] = n, r), {}) : {}, kf = (t) => ki(t, (e) => e.toLowerCase()), Bf = (t) => ki(t, (e) => e.toUpperCase()), $o = (t) => {
  if (Eo(t))
    return t;
  if (typeof t == "function")
    return t.bind({});
  const e = new t.constructor();
  return Object.getOwnPropertyNames(t).forEach((r) => {
    e[r] = t[r];
  }), e;
}, Uf = (t, e) => {
  if (!t) return [];
  const r = Object.entries(t);
  return r.length === 0 ? [] : r.reduce((n, i) => (n.push(e(i[0], i[1])), n), []);
}, Wf = (t, e) => t ? e.reduce((r, n) => (Object.prototype.hasOwnProperty.call(t, n) && (r[n] = t[n]), r), {}) : {}, Kf = (t, e) => t ? !e || e.length === 0 ? t : e.reduce(
  (r, n) => (delete r[n], r),
  { ...t }
) : {}, qo = (t, e, r) => {
  const n = e.split(/[\.\[\]]/g);
  let i = t;
  for (const s of n) {
    if (i === null || i === void 0) return r;
    const o = s.replace(/['"]/g, "");
    o.trim() !== "" && (i = i[o]);
  }
  return i === void 0 ? r : i;
}, No = (t, e, r) => {
  if (!t) return {};
  if (!e || r === void 0) return t;
  const n = e.split(/[\.\[\]]/g).filter((o) => !!o.trim()), i = (o) => {
    if (n.length > 1) {
      const a = n.shift(), u = Co(n[0], null) !== null;
      o[a] = o[a] === void 0 ? u ? [] : {} : o[a], i(o[a]);
    } else
      o[n[0]] = r;
  }, s = $o(t);
  return i(s), s;
}, Lo = (t, e) => !t || !e ? t ?? e ?? {} : Object.entries({ ...t, ...e }).reduce(
  (r, [n, i]) => ({
    ...r,
    [n]: Ni(t[n]) ? Lo(t[n], i) : i
  }),
  {}
), jo = (t) => {
  if (!t) return [];
  const e = (r, n) => Ni(r) ? Object.entries(r).flatMap(
    ([i, s]) => e(s, [...n, i])
  ) : hr(r) ? r.flatMap((i, s) => e(i, [...n, `${s}`])) : [n.join(".")];
  return e(t, []);
}, Hf = (t) => t ? zo(
  jo(t),
  (e) => e,
  (e) => qo(t, e)
) : {}, Gf = (t) => t ? Object.keys(t).reduce((e, r) => No(e, r, t[r]), {}) : {}, Bi = (t, e) => Math.floor(Math.random() * (e - t + 1) + t), Vf = (t) => {
  const e = t.length;
  if (e === 0)
    return null;
  const r = Bi(0, e - 1);
  return t[r];
}, Yf = (t) => t.map((e) => ({ rand: Math.random(), value: e })).sort((e, r) => e.rand - r.rand).map((e) => e.value), Zf = (t, e = "") => {
  const r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + e;
  return Fo(
    t,
    (n) => n + r.charAt(Bi(0, r.length - 1)),
    ""
  );
}, Jf = (t, e = (r) => `${r}`) => {
  const { indexesByKey: r, itemsByIndex: n } = t.reduce(
    (h, l, p) => ({
      indexesByKey: {
        ...h.indexesByKey,
        [e(l)]: p
      },
      itemsByIndex: {
        ...h.itemsByIndex,
        [p]: l
      }
    }),
    {
      indexesByKey: {},
      itemsByIndex: {}
    }
  ), i = (h, l) => r[e(h)] < r[e(l)] ? h : l, s = (h, l) => r[e(h)] > r[e(l)] ? h : l, o = () => n[0], a = () => n[t.length - 1], u = (h, l) => n[r[e(h)] + 1] ?? l ?? o(), f = (h, l) => n[r[e(h)] - 1] ?? l ?? a();
  return {
    min: i,
    max: s,
    first: o,
    last: a,
    next: u,
    previous: f,
    spin: (h, l) => {
      if (l === 0) return h;
      const p = Math.abs(l), _ = p > t.length ? p % t.length : p;
      return Di(0, _ - 1).reduce(
        (d) => l > 0 ? u(d) : f(d),
        h
      );
    }
  };
}, Tr = (t) => {
  if (!t || t.length === 0) return "";
  const e = t.toLowerCase();
  return e.substring(0, 1).toUpperCase() + e.substring(1, e.length);
}, Qf = (t) => {
  const e = t?.replace(/([A-Z])+/g, Tr)?.split(/(?=[A-Z])|[\.\-\s_]/).map((r) => r.toLowerCase()) ?? [];
  return e.length === 0 ? "" : e.length === 1 ? e[0] : e.reduce((r, n) => `${r}${n.charAt(0).toUpperCase()}${n.slice(1)}`);
}, Xf = (t, e) => {
  const r = t?.replace(/([A-Z])+/g, Tr).split(/(?=[A-Z])|[\.\-\s_]/).map((i) => i.toLowerCase()) ?? [];
  if (r.length === 0) return "";
  if (r.length === 1) return r[0];
  const n = r.reduce((i, s) => `${i}_${s.toLowerCase()}`);
  return e?.splitOnNumber === !1 ? n : n.replace(/([A-Za-z]{1}[0-9]{1})/, (i) => `${i[0]}_${i[1]}`);
}, tc = (t) => {
  const e = t?.replace(/([A-Z])+/g, Tr)?.split(/(?=[A-Z])|[\.\-\s_]/).map((r) => r.toLowerCase()) ?? [];
  return e.length === 0 ? "" : e.length === 1 ? e[0] : e.reduce((r, n) => `${r}-${n.toLowerCase()}`);
}, ec = (t) => {
  const e = t?.split(/[\.\-\s_]/).map((r) => r.toLowerCase()) ?? [];
  return e.length === 0 ? "" : e.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join("");
}, rc = (t) => t ? t.split(/(?=[A-Z])|[\.\-\s_]/).map((e) => e.trim()).filter((e) => !!e).map((e) => Tr(e.toLowerCase())).join(" ") : "", nc = (t, e, r = /\{\{(.+?)\}\}/g) => Array.from(t.matchAll(r)).reduce((n, i) => n.replace(i[0], e[i[1]]), t), ic = (t, e = " ") => {
  if (!t) return "";
  const r = e.replace(/[\W]{1}/g, "\\$&"), n = new RegExp(`^[${r}]+|[${r}]+$`, "g");
  return t.replace(n, "");
}, qd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  all: Sf,
  alphabetical: ef,
  assign: Lo,
  boil: Li,
  callable: Cf,
  camel: Qf,
  capitalize: Tr,
  chain: Ef,
  clone: $o,
  cluster: uf,
  compose: xf,
  construct: Gf,
  counting: rf,
  crush: Hf,
  dash: tc,
  debounce: Ff,
  defer: wf,
  diff: yf,
  draw: Vf,
  first: Xu,
  flat: cf,
  fork: Ro,
  get: qo,
  group: Yu,
  guard: Of,
  inRange: $f,
  intersects: hf,
  invert: Df,
  isArray: hr,
  isDate: xo,
  isEmpty: Vu,
  isEqual: Io,
  isFloat: Gu,
  isFunction: Ir,
  isInt: Hu,
  isNumber: ge,
  isObject: Ni,
  isPrimitive: Eo,
  isPromise: Mo,
  isString: Ku,
  isSymbol: Oo,
  iterate: Fo,
  keys: jo,
  last: tf,
  list: Di,
  listify: Uf,
  lowerize: kf,
  map: mf,
  mapEntries: jf,
  mapKeys: ki,
  mapValues: Lf,
  max: of,
  memo: Rf,
  merge: lf,
  min: af,
  objectify: zo,
  omit: Kf,
  parallel: bf,
  partial: Mf,
  partob: If,
  pascal: ec,
  pick: Wf,
  proxied: Tf,
  random: Bi,
  range: ji,
  reduce: vf,
  replace: nf,
  replaceOrAppend: pf,
  retry: Af,
  select: sf,
  series: Jf,
  set: No,
  shake: Nf,
  shift: gf,
  shuffle: Yf,
  sift: df,
  sleep: vi,
  snake: Xf,
  sort: To,
  sum: Qu,
  template: nc,
  throttle: Pf,
  title: rc,
  toFloat: qf,
  toInt: Co,
  toggle: _f,
  trim: ic,
  try: Se,
  tryit: Se,
  uid: Zf,
  unique: ff,
  upperize: Bf,
  zip: Zu,
  zipToObject: Ju
}, Symbol.toStringTag, { value: "Module" })), it = function(t) {
  return t !== null && typeof t != "function" && isFinite(t.length);
}, ln = function(t, e) {
  return it(t) ? t.indexOf(e) > -1 : !1;
}, Do = function(t, e) {
  if (!it(t))
    return t;
  const r = [];
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    e(i, n) && r.push(i);
  }
  return r;
}, sc = function(t, e = []) {
  return Do(t, (r) => !ln(e, r));
}, oc = {}.toString, Et = (t, e) => oc.call(t) === "[object " + e + "]", dt = (t) => Et(t, "Function"), Xt = function(t) {
  return t == null;
}, N = (t) => Array.isArray ? Array.isArray(t) : Et(t, "Array"), zn = (t) => {
  const e = typeof t;
  return t !== null && e === "object" || e === "function";
};
function Ae(t, e) {
  if (!t)
    return;
  let r;
  if (N(t))
    for (let n = 0, i = t.length; n < i && (r = e(t[n], n), r !== !1); n++)
      ;
  else if (zn(t)) {
    for (const n in t)
      if (t.hasOwnProperty(n) && (r = e(t[n], n), r === !1))
        break;
  }
}
const ko = Object.keys ? (t) => Object.keys(t) : (t) => {
  const e = [];
  return Ae(t, (r, n) => {
    dt(t) && n === "prototype" || e.push(n);
  }), e;
};
function Bo(t, e) {
  const r = ko(e), n = r.length;
  if (Xt(t)) return !n;
  for (let i = 0; i < n; i += 1) {
    const s = r[i];
    if (e[s] !== t[s] || !(s in t))
      return !1;
  }
  return !0;
}
const pn = function(t) {
  return typeof t == "object" && t !== null;
}, Oe = function(t) {
  if (!pn(t) || !Et(t, "Object"))
    return !1;
  if (Object.getPrototypeOf(t) === null)
    return !0;
  let e = t;
  for (; Object.getPrototypeOf(e) !== null; )
    e = Object.getPrototypeOf(e);
  return Object.getPrototypeOf(t) === e;
};
function ac(t, e) {
  if (!N(t)) return null;
  let r;
  if (dt(e) && (r = e), Oe(e) && (r = (n) => Bo(n, e)), r) {
    for (let n = 0; n < t.length; n += 1)
      if (r(t[n]))
        return t[n];
  }
  return null;
}
function uc(t, e, r = 0) {
  for (let n = r; n < t.length; n++)
    if (e(t[n], n))
      return n;
  return -1;
}
const fc = function(t, e) {
  let r = null;
  for (let n = 0; n < t.length; n++) {
    const s = t[n][e];
    if (!Xt(s)) {
      N(s) ? r = s[0] : r = s;
      break;
    }
  }
  return r;
}, cc = function(t) {
  if (!N(t))
    return [];
  let e = [];
  for (let r = 0; r < t.length; r++)
    e = e.concat(t[r]);
  return e;
}, Uo = function(t, e = []) {
  if (!N(t))
    e.push(t);
  else
    for (let r = 0; r < t.length; r += 1)
      Uo(t[r], e);
  return e;
}, Wo = (t) => {
  if (N(t))
    return t.reduce((e, r) => Math.max(e, r), t[0]);
}, Ko = (t) => {
  if (N(t))
    return t.reduce((e, r) => Math.min(e, r), t[0]);
}, hc = function(t) {
  let e = t.filter((i) => !isNaN(i));
  if (!e.length)
    return {
      min: 0,
      max: 0
    };
  if (N(t[0])) {
    let i = [];
    for (let s = 0; s < t.length; s++)
      i = i.concat(t[s]);
    e = i;
  }
  const r = Wo(e);
  return {
    min: Ko(e),
    max: r
  };
}, Ho = Array.prototype, lc = Ho.splice, pc = Ho.indexOf, _c = function(t, ...e) {
  for (let r = 0; r < e.length; r++) {
    const n = e[r];
    let i = -1;
    for (; (i = pc.call(t, n)) > -1; )
      lc.call(t, i, 1);
  }
  return t;
}, dc = Array.prototype.splice, Go = function(e, r) {
  if (!it(e))
    return [];
  let n = e ? r.length : 0;
  const i = n - 1;
  for (; n--; ) {
    let s;
    const o = r[n];
    (n === i || o !== s) && (s = o, dc.call(e, o, 1));
  }
  return e;
}, Vo = function(t, e, r) {
  if (!N(t) && !Oe(t))
    return t;
  let n = r;
  return Ae(t, (i, s) => {
    n = e(n, i, s);
  }), n;
}, yc = function(t, e) {
  const r = [];
  if (!it(t))
    return r;
  let n = -1;
  const i = [], s = t.length;
  for (; ++n < s; ) {
    const o = t[n];
    e(o, n, t) && (r.push(o), i.push(n));
  }
  return Go(t, i), r;
}, Vt = (t) => Et(t, "String");
function gc(t, e) {
  let r;
  if (dt(e))
    r = (n, i) => e(n) - e(i);
  else {
    let n = [];
    Vt(e) ? n.push(e) : N(e) && (n = e), r = (i, s) => {
      for (let o = 0; o < n.length; o += 1) {
        const a = n[o];
        if (i[a] > s[a])
          return 1;
        if (i[a] < s[a])
          return -1;
      }
      return 0;
    };
  }
  return t.sort(r), t;
}
function Yo(t, e = /* @__PURE__ */ new Map()) {
  const r = [];
  if (Array.isArray(t))
    for (let n = 0, i = t.length; n < i; n++) {
      const s = t[n];
      e.has(s) || (r.push(s), e.set(s, !0));
    }
  return r;
}
const vc = function(...t) {
  return Yo([].concat(...t));
}, mc = (t, e) => {
  const r = [], n = {};
  for (let i = 0; i < t.length; i++) {
    let o = t[i][e];
    if (!Xt(o)) {
      N(o) || (o = [o]);
      for (let a = 0; a < o.length; a++) {
        const u = o[a];
        n[u] || (r.push(u), n[u] = !0);
      }
    }
  }
  return r;
};
function wc(t) {
  if (it(t))
    return t[0];
}
function bc(t) {
  if (it(t)) {
    const e = t;
    return e[e.length - 1];
  }
}
function Sc(t, e) {
  return N(t) || Vt(t) ? t[0] === e : !1;
}
function Ac(t, e) {
  return N(t) || Vt(t) ? t[t.length - 1] === e : !1;
}
const Oc = function(t, e) {
  for (let r = 0; r < t.length; r++)
    if (!e(t[r], r)) return !1;
  return !0;
}, Ec = function(t, e) {
  for (let r = 0; r < t.length; r++)
    if (e(t[r], r)) return !0;
  return !1;
}, xc = Object.prototype.hasOwnProperty;
function Zo(t, e) {
  if (!e || !N(t))
    return {};
  const r = {}, n = dt(e) ? e : (s) => s[e];
  let i;
  for (let s = 0; s < t.length; s++) {
    const o = t[s];
    i = n(o), xc.call(r, i) ? r[i].push(o) : r[i] = [o];
  }
  return r;
}
function Jo(t, e) {
  if (!e)
    return {
      0: t
    };
  if (!dt(e)) {
    const r = N(e) ? e : e.replace(/\s+/g, "").split("*");
    e = function(n) {
      let i = "_";
      for (let s = 0, o = r.length; s < o; s++)
        i += n[r[s]] && n[r[s]].toString();
      return i;
    };
  }
  return Zo(t, e);
}
const Mc = (t, e) => {
  if (!e)
    return [t];
  const r = Jo(t, e), n = [];
  for (const i in r)
    n.push(r[i]);
  return n;
};
function Ic(t, e) {
  return t["_wrap_" + e];
}
function Tc(t, e) {
  if (t["_wrap_" + e])
    return t["_wrap_" + e];
  const r = (n) => {
    t[e](n);
  };
  return t["_wrap_" + e] = r, r;
}
const qs = {};
function zc(t) {
  let e = qs[t];
  if (!e) {
    let r = t.toString(16);
    for (let n = r.length; n < 6; n++)
      r = "0" + r;
    e = "#" + r, qs[t] = e;
  }
  return e;
}
function Rc(t) {
  let e = 0, r = 0, n = 0, i = 0;
  return N(t) ? t.length === 1 ? e = r = n = i = t[0] : t.length === 2 ? (e = n = t[0], r = i = t[1]) : t.length === 3 ? (e = t[0], r = i = t[1], n = t[2]) : (e = t[0], r = t[1], n = t[2], i = t[3]) : e = r = n = i = t, {
    r1: e,
    r2: r,
    r3: n,
    r4: i
  };
}
const Fc = function(t, e, r) {
  return t < e ? e : t > r ? r : t;
}, Pc = function(t, e) {
  const r = e.toString(), n = r.indexOf(".");
  if (n === -1)
    return Math.round(t);
  let i = r.substr(n + 1).length;
  return i > 20 && (i = 20), parseFloat(t.toFixed(i));
}, Bt = function(t) {
  return Et(t, "Number");
}, Cc = function(t) {
  return Bt(t) && t % 1 !== 0;
}, $c = function(t) {
  return Bt(t) && t % 2 === 0;
}, qc = Number.isInteger ? Number.isInteger : function(t) {
  return Bt(t) && t % 1 === 0;
}, Nc = function(t) {
  return Bt(t) && t < 0;
}, Lc = 1e-5;
function jc(t, e, r = Lc) {
  return Math.abs(t - e) < r;
}
const Dc = function(t) {
  return Bt(t) && t % 2 !== 0;
}, kc = function(t) {
  return Bt(t) && t > 0;
}, Bc = (t, e) => {
  if (!N(t))
    return;
  let r, n = -1 / 0;
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = dt(e) ? e(s) : s[e];
    o > n && (r = s, n = o);
  }
  return r;
}, Uc = (t, e) => {
  if (!N(t))
    return;
  let r, n = 1 / 0;
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = dt(e) ? e(s) : s[e];
    o < n && (r = s, n = o);
  }
  return r;
}, Wc = function(t, e) {
  return (t % e + e) % e;
}, Kc = 180 / Math.PI, Hc = function(t) {
  return Kc * t;
}, Gc = parseInt, Vc = Math.PI / 180, Yc = function(t) {
  return Vc * t;
}, Ns = (t, e) => t.hasOwnProperty(e), Qo = Object.values ? (t) => Object.values(t) : (t) => {
  const e = [];
  return Ae(t, (r, n) => {
    dt(t) && n === "prototype" || e.push(r);
  }), e;
}, Zc = (t, e) => ln(Qo(t), e), zr = (t) => Xt(t) ? "" : t.toString(), Jc = function(t) {
  return zr(t).toLowerCase();
}, Qc = function(t) {
  const e = zr(t);
  return e.charAt(0).toLowerCase() + e.substring(1);
};
function Xc(t, e) {
  return !t || !e ? t : t.replace(/\\?\{([^{}]+)\}/g, (r, n) => r.charAt(0) === "\\" ? r.slice(1) : e[n] === void 0 ? "" : e[n]);
}
const th = function(t) {
  return zr(t).toUpperCase();
}, eh = function(t) {
  const e = zr(t);
  return e.charAt(0).toUpperCase() + e.substring(1);
}, rh = {}.toString, Xo = function(t) {
  return rh.call(t).replace(/^\[object /, "").replace(/]$/, "");
}, nh = function(t) {
  return Et(t, "Arguments");
}, ih = function(t) {
  return Et(t, "Boolean");
}, sh = function(t) {
  return Et(t, "Date");
}, oh = function(t) {
  return Et(t, "Error");
};
function ah(t) {
  return Bt(t) && isFinite(t);
}
const uh = function(t) {
  return t === null;
}, fh = Object.prototype, ta = function(t) {
  const e = t && t.constructor, r = typeof e == "function" && e.prototype || fh;
  return t === r;
}, ch = function(t) {
  return Et(t, "RegExp");
}, hh = function(t) {
  return t === void 0;
}, lh = function(t) {
  return t instanceof Element || t instanceof HTMLDocument;
};
function ph(t) {
  return (window.requestAnimationFrame || // @ts-ignore
  window.webkitRequestAnimationFrame || // @ts-ignore
  window.mozRequestAnimationFrame || // @ts-ignore
  window.msRequestAnimationFrame || function(r) {
    return setTimeout(r, 16);
  })(t);
}
function _h(t) {
  (window.cancelAnimationFrame || // @ts-ignore
  window.webkitCancelAnimationFrame || // @ts-ignore
  window.mozCancelAnimationFrame || // @ts-ignore
  window.msCancelAnimationFrame || clearTimeout)(t);
}
function ri(t, e) {
  for (const r in e)
    e.hasOwnProperty(r) && r !== "constructor" && e[r] !== void 0 && (t[r] = e[r]);
}
function ve(t, e, r, n) {
  return e && ri(t, e), r && ri(t, r), n && ri(t, n), t;
}
const dh = function(...t) {
  const e = t[0];
  for (let r = 1; r < t.length; r++) {
    let n = t[r];
    dt(n) && (n = n.prototype), ve(e.prototype, n);
  }
}, mi = function(t) {
  if (typeof t != "object" || t === null)
    return t;
  let e;
  if (N(t)) {
    e = [];
    for (let r = 0, n = t.length; r < n; r++)
      typeof t[r] == "object" && t[r] != null ? e[r] = mi(t[r]) : e[r] = t[r];
  } else {
    e = {};
    for (const r in t)
      typeof t[r] == "object" && t[r] != null ? e[r] = mi(t[r]) : e[r] = t[r];
  }
  return e;
};
function yh(t, e, r) {
  let n;
  return function() {
    const i = this, s = arguments, o = function() {
      n = null, r || t.apply(i, s);
    }, a = r && !n;
    clearTimeout(n), n = setTimeout(o, e), a && t.apply(i, s);
  };
}
const gh = (t, e) => {
  if (!dt(t))
    throw new TypeError("Expected a function");
  const r = function(...n) {
    const i = e ? e.apply(this, n) : n[0], s = r.cache;
    if (s.has(i))
      return s.get(i);
    const o = t.apply(this, n);
    return s.set(i, o), o;
  };
  return r.cache = /* @__PURE__ */ new Map(), r;
}, vh = 5;
function ea(t, e, r, n) {
  r = r || 0, n = n || vh;
  for (const i in e)
    if (e.hasOwnProperty(i)) {
      const s = e[i];
      s !== null && Oe(s) ? (Oe(t[i]) || (t[i] = {}), r < n ? ea(t[i], s, r + 1, n) : t[i] = e[i]) : N(s) ? (t[i] = [], t[i] = t[i].concat(s)) : s !== void 0 && (t[i] = s);
    }
}
const mh = function(t, ...e) {
  for (let r = 0; r < e.length; r += 1)
    ea(t, e[r]);
  return t;
}, wh = function(t, e, r, n) {
  dt(e) || (r = e, e = t, t = function() {
  });
  const i = Object.create ? function(o, a) {
    return Object.create(o, {
      constructor: {
        value: a
      }
    });
  } : function(o, a) {
    function u() {
    }
    u.prototype = o;
    const f = new u();
    return f.constructor = a, f;
  }, s = i(e.prototype, t);
  return t.prototype = ve(s, t.prototype), t.superclass = i(e.prototype, e), ve(s, r), ve(t, n), t;
}, bh = function(t, e) {
  if (!it(t))
    return -1;
  const r = Array.prototype.indexOf;
  if (r)
    return r.call(t, e);
  let n = -1;
  for (let i = 0; i < t.length; i++)
    if (t[i] === e) {
      n = i;
      break;
    }
  return n;
}, Sh = Object.prototype.hasOwnProperty;
function Ah(t) {
  if (Xt(t))
    return !0;
  if (it(t))
    return !t.length;
  const e = Xo(t);
  if (e === "Map" || e === "Set")
    return !t.size;
  if (ta(t))
    return !Object.keys(t).length;
  for (const r in t)
    if (Sh.call(t, r))
      return !1;
  return !0;
}
const _n = (t, e) => {
  if (t === e)
    return !0;
  if (!t || !e || Vt(t) || Vt(e))
    return !1;
  if (it(t) || it(e)) {
    if (t.length !== e.length)
      return !1;
    let r = !0;
    for (let n = 0; n < t.length && (r = _n(t[n], e[n]), !!r); n++)
      ;
    return r;
  }
  if (pn(t) || pn(e)) {
    const r = Object.keys(t), n = Object.keys(e);
    if (r.length !== n.length)
      return !1;
    let i = !0;
    for (let s = 0; s < r.length && (i = _n(t[r[s]], e[r[s]]), !!i); s++)
      ;
    return i;
  }
  return !1;
}, Oh = (t, e, r) => dt(r) ? !!r(t, e) : _n(t, e), Eh = (t, e) => {
  if (!it(t))
    return t;
  const r = [];
  for (let n = 0; n < t.length; n++) {
    const i = t[n];
    r.push(e(i, n));
  }
  return r;
}, xh = (t) => t, Mh = (t, e = xh) => {
  const r = {};
  return zn(t) && !Xt(t) && Object.keys(t).forEach((n) => {
    r[n] = e(t[n], n);
  }), r;
}, Ih = (t, e, r) => {
  let n = 0;
  const i = Vt(e) ? e.split(".") : e;
  for (; t && n < i.length; )
    t = t[i[n++]];
  return t === void 0 || n < i.length ? r : t;
}, Th = (t, e, r) => {
  let n = t;
  const i = Vt(e) ? e.split(".") : e;
  return i.forEach((s, o) => {
    o < i.length - 1 ? (zn(n[s]) || (n[s] = Bt(i[o + 1]) ? [] : {}), n = n[s]) : n[s] = r;
  }), t;
}, zh = Object.prototype.hasOwnProperty, Rh = (t, e) => {
  if (t === null || !Oe(t))
    return {};
  const r = {};
  return Ae(e, (n) => {
    zh.call(t, n) && (r[n] = t[n]);
  }), r;
}, Fh = (t, e) => Vo(
  t,
  (r, n, i) => (e.includes(i) || (r[i] = n), r),
  {}
), Ph = (t, e, r) => {
  let n, i, s, o, a = 0;
  r || (r = {});
  const u = function() {
    a = r.leading === !1 ? 0 : Date.now(), n = null, o = t.apply(i, s), n || (i = s = null);
  }, f = function() {
    const c = Date.now();
    !a && r.leading === !1 && (a = c);
    const h = e - (c - a);
    return i = this, s = arguments, h <= 0 || h > e ? (n && (clearTimeout(n), n = null), a = c, o = t.apply(i, s), n || (i = s = null)) : !n && r.trailing !== !1 && (n = setTimeout(u, h)), o;
  };
  return f.cancel = function() {
    clearTimeout(n), a = 0, n = i = s = null;
  }, f;
}, Ch = (t) => it(t) ? Array.prototype.slice.call(t) : [], Zr = {}, $h = (t) => (t = t || "g", Zr[t] ? Zr[t] += 1 : Zr[t] = 1, t + Zr[t]), qh = () => {
}, Nh = (t) => t;
function Lh(t) {
  return Xt(t) ? 0 : it(t) ? t.length : Object.keys(t).length;
}
class jh {
  map = {};
  has(e) {
    return this.map[e] !== void 0;
  }
  get(e, r) {
    const n = this.map[e];
    return n === void 0 ? r : n;
  }
  set(e, r) {
    this.map[e] = r;
  }
  clear() {
    this.map = {};
  }
  delete(e) {
    delete this.map[e];
  }
  size() {
    return Object.keys(this.map).length;
  }
}
const Nd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Cache: jh,
  assign: ve,
  augment: dh,
  clamp: Fc,
  clearAnimationFrame: _h,
  clone: mi,
  contains: ln,
  debounce: yh,
  deepMix: mh,
  difference: sc,
  each: Ae,
  endsWith: Ac,
  every: Oc,
  extend: wh,
  filter: Do,
  find: ac,
  findIndex: uc,
  firstValue: fc,
  fixedBase: Pc,
  flatten: cc,
  flattenDeep: Uo,
  forIn: Ae,
  get: Ih,
  getRange: hc,
  getType: Xo,
  getWrapBehavior: Ic,
  group: Mc,
  groupBy: Zo,
  groupToMap: Jo,
  has: Ns,
  hasKey: Ns,
  hasValue: Zc,
  head: wc,
  identity: Nh,
  includes: ln,
  indexOf: bh,
  isArguments: nh,
  isArray: N,
  isArrayLike: it,
  isBoolean: ih,
  isDate: sh,
  isDecimal: Cc,
  isElement: lh,
  isEmpty: Ah,
  isEqual: _n,
  isEqualWith: Oh,
  isError: oh,
  isEven: $c,
  isFinite: ah,
  isFunction: dt,
  isInteger: qc,
  isMatch: Bo,
  isNegative: Nc,
  isNil: Xt,
  isNull: uh,
  isNumber: Bt,
  isNumberEqual: jc,
  isObject: zn,
  isObjectLike: pn,
  isOdd: Dc,
  isPlainObject: Oe,
  isPositive: kc,
  isPrototype: ta,
  isRegExp: ch,
  isString: Vt,
  isType: Et,
  isUndefined: hh,
  keys: ko,
  last: bc,
  lowerCase: Jc,
  lowerFirst: Qc,
  map: Eh,
  mapValues: Mh,
  max: Wo,
  maxBy: Bc,
  memoize: gh,
  min: Ko,
  minBy: Uc,
  mix: ve,
  mod: Wc,
  noop: qh,
  number2color: zc,
  omit: Fh,
  parseRadius: Rc,
  pick: Rh,
  pull: _c,
  pullAt: Go,
  reduce: Vo,
  remove: yc,
  requestAnimationFrame: ph,
  set: Th,
  size: Lh,
  some: Ec,
  sortBy: gc,
  startsWith: Sc,
  substitute: Xc,
  throttle: Ph,
  toArray: Ch,
  toDegree: Hc,
  toInteger: Gc,
  toRadian: Yc,
  toString: zr,
  union: vc,
  uniq: Yo,
  uniqueId: $h,
  upperCase: th,
  upperFirst: eh,
  values: Qo,
  valuesOfKey: mc,
  wrapBehavior: Tc
}, Symbol.toStringTag, { value: "Module" }));
function ra(t) {
  return [parseInt(t.substr(1, 2), 16), parseInt(t.substr(3, 2), 16), parseInt(t.substr(5, 2), 16)];
}
function ni(t) {
  const e = Math.round(t).toString(16);
  return e.length === 1 ? `0${e}` : e;
}
function na(t) {
  return `#${ni(t[0])}${ni(t[1])}${ni(t[2])}`;
}
const Dh = /rgba?\(([\s.,0-9]+)\)/;
function kh() {
  const t = document.createElement("i");
  return t.title = "Web Colour Picker", t.style.display = "none", document.body.appendChild(t), t;
}
let Jr;
function ia(t) {
  if (t[0] === "#" && t.length === 7)
    return t;
  Jr || (Jr = kh()), Jr.style.color = t;
  let e = document.defaultView.getComputedStyle(Jr, "").getPropertyValue("color");
  const n = Dh.exec(e)[1].split(/\s*,\s*/).map((i) => Number(i));
  return e = na(n), e;
}
function ii(t, e, r, n) {
  return t[n] + (e[n] - t[n]) * r;
}
function Bh(t, e) {
  const r = isNaN(Number(e)) || e < 0 ? 0 : e > 1 ? 1 : Number(e), n = t.length - 1, i = Math.floor(n * r), s = n * r - i, o = t[i], a = i === n ? o : t[i + 1];
  return na([ii(o, a, s, 0), ii(o, a, s, 1), ii(o, a, s, 2)]);
}
function Uh(t) {
  const r = (typeof t == "string" ? t.split("-") : t).map((n) => ra(n.indexOf("#") === -1 ? ia(n) : n));
  return (n) => Bh(r, n);
}
const Wh = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i, Kh = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i, Hh = /[\d.]+:(#[^\s]+|[^)]+\))/gi;
function Gh(t) {
  return /^[r,R,L,l]{1}[\s]*\(/.test(t);
}
function Vh(t) {
  if (Gh(t)) {
    let e = "", r;
    if (t[0] === "l") {
      const i = Wh.exec(t), s = +i[1] + 90;
      r = i[2], e = `linear-gradient(${s}deg, `;
    } else t[0] === "r" && (e = "radial-gradient(", r = Kh.exec(t)[4]);
    const n = r.match(Hh);
    return n.forEach((i, s) => {
      const o = i.split(":");
      e += `${o[1]} ${Number(o[0]) * 100}%`, s !== n.length - 1 && (e += ", ");
    }), e += ")", e;
  }
  return t;
}
var Ls = typeof Float32Array < "u" ? Float32Array : Array;
function Rn(t, e, r) {
  var n = e[0], i = e[1], s = e[2], o = e[3], a = e[4], u = e[5], f = e[6], c = e[7], h = e[8], l = r[0], p = r[1], _ = r[2], d = r[3], y = r[4], m = r[5], v = r[6], w = r[7], g = r[8];
  return t[0] = l * n + p * o + _ * f, t[1] = l * i + p * a + _ * c, t[2] = l * s + p * u + _ * h, t[3] = d * n + y * o + m * f, t[4] = d * i + y * a + m * c, t[5] = d * s + y * u + m * h, t[6] = v * n + w * o + g * f, t[7] = v * i + w * a + g * c, t[8] = v * s + w * u + g * h, t;
}
function Yh(t, e) {
  return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = e[0], t[7] = e[1], t[8] = 1, t;
}
function Zh(t, e) {
  var r = Math.sin(e), n = Math.cos(e);
  return t[0] = n, t[1] = r, t[2] = 0, t[3] = -r, t[4] = n, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
}
function Jh(t, e) {
  return t[0] = e[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = e[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t;
}
function Qh() {
  var t = new Ls(2);
  return Ls != Float32Array && (t[0] = 0, t[1] = 0), t;
}
function Xh(t, e) {
  var r = t[0], n = t[1], i = e[0], s = e[1];
  return Math.abs(Math.atan2(n * i - r * s, r * i + n * s));
}
(function() {
  var t = Qh();
  return function(e, r, n, i, s, o) {
    var a, u;
    for (r || (r = 2), n || (n = 0), i ? u = Math.min(i * r + n, e.length) : u = e.length, a = n; a < u; a += r)
      t[0] = e[a], t[1] = e[a + 1], s(t, t, o), e[a] = t[0], e[a + 1] = t[1];
    return e;
  };
})();
function tl(t, e, r) {
  const n = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return Yh(n, r), Rn(t, n, e);
}
function el(t, e, r) {
  const n = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return Zh(n, r), Rn(t, n, e);
}
function rl(t, e, r) {
  const n = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  return Jh(n, r), Rn(t, n, e);
}
function nl(t, e, r) {
  return Rn(t, r, e);
}
function il(t, e) {
  const r = t ? [].concat(t) : [1, 0, 0, 0, 1, 0, 0, 0, 1];
  for (let n = 0, i = e.length; n < i; n++) {
    const s = e[n];
    switch (s[0]) {
      case "t":
        tl(r, r, [s[1], s[2]]);
        break;
      case "s":
        rl(r, r, [s[1], s[2]]);
        break;
      case "r":
        el(r, r, s[1]);
        break;
      case "m":
        nl(r, r, s[1]);
        break;
    }
  }
  return r;
}
function sa(t, e) {
  return t[0] * e[1] - e[0] * t[1];
}
function sl(t, e, r) {
  const n = Xh(t, e), i = sa(t, e) >= 0;
  return r ? i ? Math.PI * 2 - n : n : i ? n : Math.PI * 2 - n;
}
function ol(t, e, r) {
  return r ? (t[0] = e[1], t[1] = -1 * e[0]) : (t[0] = -1 * e[1], t[1] = e[0]), t;
}
function Le(t) {
  return t.map((e) => Array.isArray(e) ? [].concat(e) : e);
}
function al(t, e) {
  if (e === "off") return Le(t);
  const r = typeof e == "number" && e >= 1 ? 10 ** e : 1;
  return t.map((n) => {
    const i = n.slice(1).map(Number).map((s) => e ? Math.round(s * r) / r : Math.round(s));
    return [n[0]].concat(i);
  });
}
function ul(t, e = "off") {
  return al(t, e).map((r) => r[0] + r.slice(1).join(" ")).join("");
}
const oa = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
};
function fl(t, e, r) {
  if (t[r].length > 7) {
    t[r].shift();
    const n = t[r];
    let i = r;
    for (; n.length; )
      e[r] = "A", t.splice(i += 1, 0, ["C"].concat(n.splice(0, 6)));
    t.splice(r, 1);
  }
}
const rr = {
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
function aa(t) {
  return Array.isArray(t) && t.every((e) => {
    const r = e[0].toLowerCase();
    return rr[r] === e.length - 1 && "achlmqstvz".includes(r);
  });
}
function ua(t) {
  return aa(t) && // @ts-ignore -- `isPathArray` also checks if it's `Array`
  t.every(([e]) => e === e.toUpperCase());
}
function fa(t) {
  return ua(t) && t.every(([e]) => "ACLMQZ".includes(e));
}
function js(t) {
  let e = t.pathValue[t.segmentStart], r = e.toLowerCase();
  const { data: n } = t;
  for (; n.length >= rr[r] && (r === "m" && n.length > 2 ? (t.segments.push([e].concat(n.splice(0, 2))), r = "l", e = e === "m" ? "l" : "L") : t.segments.push([e].concat(n.splice(0, rr[r]))), !!rr[r]); )
    ;
}
function cl(t) {
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
function hl(t) {
  return t >= 48 && t <= 57 || t === 43 || t === 45 || t === 46;
}
function de(t) {
  return t >= 48 && t <= 57;
}
function ll(t) {
  const { max: e, pathValue: r, index: n } = t;
  let i = n, s = !1, o = !1, a = !1, u = !1, f;
  if (i >= e) {
    t.err = `[path-util]: Invalid path value at index ${i}, "pathValue" is missing param`;
    return;
  }
  if (f = r.charCodeAt(i), (f === 43 || f === 45) && (i += 1, f = r.charCodeAt(i)), !de(f) && f !== 46) {
    t.err = `[path-util]: Invalid path value at index ${i}, "${r[i]}" is not a number`;
    return;
  }
  if (f !== 46) {
    if (s = f === 48, i += 1, f = r.charCodeAt(i), s && i < e && f && de(f)) {
      t.err = `[path-util]: Invalid path value at index ${n}, "${r[n]}" illegal number`;
      return;
    }
    for (; i < e && de(r.charCodeAt(i)); )
      i += 1, o = !0;
    f = r.charCodeAt(i);
  }
  if (f === 46) {
    for (u = !0, i += 1; de(r.charCodeAt(i)); )
      i += 1, a = !0;
    f = r.charCodeAt(i);
  }
  if (f === 101 || f === 69) {
    if (u && !o && !a) {
      t.err = `[path-util]: Invalid path value at index ${i}, "${r[i]}" invalid float exponent`;
      return;
    }
    if (i += 1, f = r.charCodeAt(i), (f === 43 || f === 45) && (i += 1), i < e && de(r.charCodeAt(i)))
      for (; i < e && de(r.charCodeAt(i)); )
        i += 1;
    else {
      t.err = `[path-util]: Invalid path value at index ${i}, "${r[i]}" invalid integer exponent`;
      return;
    }
  }
  t.index = i, t.param = +t.pathValue.slice(n, i);
}
function pl(t) {
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
function un(t) {
  const { pathValue: e, max: r } = t;
  for (; t.index < r && pl(e.charCodeAt(t.index)); )
    t.index += 1;
}
function _l(t) {
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
function dl(t) {
  return (t | 32) === 97;
}
function yl(t) {
  const { max: e, pathValue: r, index: n } = t, i = r.charCodeAt(n), s = rr[r[n].toLowerCase()];
  if (t.segmentStart = n, !_l(i)) {
    t.err = `[path-util]: Invalid path value "${r[n]}" is not a path command`;
    return;
  }
  if (t.index += 1, un(t), t.data = [], !s) {
    js(t);
    return;
  }
  for (; ; ) {
    for (let o = s; o > 0; o -= 1) {
      if (dl(i) && (o === 3 || o === 4) ? cl(t) : ll(t), t.err.length)
        return;
      t.data.push(t.param), un(t), t.index < e && r.charCodeAt(t.index) === 44 && (t.index += 1, un(t));
    }
    if (t.index >= t.max || !hl(r.charCodeAt(t.index)))
      break;
  }
  js(t);
}
class gl {
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
function Ui(t) {
  if (aa(t))
    return Le(t);
  const e = new gl(t);
  for (un(e); e.index < e.max && !e.err.length; )
    yl(e);
  return e.err ? e.err : e.segments;
}
function ca(t) {
  if (ua(t))
    return Le(t);
  const e = Ui(t);
  let r = 0, n = 0, i = 0, s = 0;
  return e.map((o) => {
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
          const l = a.map((p, _) => p + (_ % 2 ? n : r));
          c = [f].concat(l);
        }
      }
    else
      c = [f].concat(a);
    const h = c.length;
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
        r = c[h - 2], n = c[h - 1], f === "M" && (i = r, s = n);
    }
    return c;
  });
}
function vl(t, e) {
  const [r] = t, { x1: n, y1: i, x2: s, y2: o } = e, a = t.slice(1).map(Number);
  let u = t;
  if ("TQ".includes(r) || (e.qx = null, e.qy = null), r === "H")
    u = ["L", t[1], i];
  else if (r === "V")
    u = ["L", n, t[1]];
  else if (r === "S") {
    const f = n * 2 - s, c = i * 2 - o;
    e.x1 = f, e.y1 = c, u = ["C", f, c].concat(a);
  } else if (r === "T") {
    const f = n * 2 - e.qx, c = i * 2 - e.qy;
    e.qx = f, e.qy = c, u = ["Q", f, c].concat(a);
  } else if (r === "Q") {
    const [f, c] = a;
    e.qx = f, e.qy = c;
  }
  return u;
}
function Fn(t) {
  if (fa(t))
    return Le(t);
  const e = ca(t), r = { ...oa }, n = e.length;
  let i = "";
  for (let s = 0; s < n; s += 1) {
    [i] = e[s], e[s] = vl(e[s], r);
    const o = e[s], a = o.length;
    r.x1 = +o[a - 2], r.y1 = +o[a - 1], r.x2 = +o[a - 4] || r.x1, r.y2 = +o[a - 3] || r.y1;
  }
  return e;
}
function ml(t) {
  return fa(t) && t.every(([e]) => "MC".includes(e));
}
function Qr(t, e, r) {
  const n = t * Math.cos(r) - e * Math.sin(r), i = t * Math.sin(r) + e * Math.cos(r);
  return { x: n, y: i };
}
function ha(t, e, r, n, i, s, o, a, u, f) {
  let c = t, h = e, l = r, p = n, _ = a, d = u;
  const y = Math.PI * 120 / 180, m = Math.PI / 180 * (+i || 0);
  let v = [], w, g, b, A, T;
  if (f)
    [g, b, A, T] = f;
  else {
    w = Qr(c, h, -m), c = w.x, h = w.y, w = Qr(_, d, -m), _ = w.x, d = w.y;
    const D = (c - _) / 2, St = (h - d) / 2;
    let re = D * D / (l * l) + St * St / (p * p);
    re > 1 && (re = Math.sqrt(re), l *= re, p *= re);
    const ti = l * l, ei = p * p, $s = (s === o ? -1 : 1) * Math.sqrt(Math.abs((ti * ei - ti * St * St - ei * D * D) / (ti * St * St + ei * D * D)));
    A = $s * l * St / p + (c + _) / 2, T = $s * -p * D / l + (h + d) / 2, g = Math.asin(((h - T) / p * 10 ** 9 >> 0) / 10 ** 9), b = Math.asin(((d - T) / p * 10 ** 9 >> 0) / 10 ** 9), g = c < A ? Math.PI - g : g, b = _ < A ? Math.PI - b : b, g < 0 && (g = Math.PI * 2 + g), b < 0 && (b = Math.PI * 2 + b), o && g > b && (g -= Math.PI * 2), !o && b > g && (b -= Math.PI * 2);
  }
  let xt = b - g;
  if (Math.abs(xt) > y) {
    const D = b, St = _, re = d;
    b = g + y * (o && b > g ? 1 : -1), _ = A + l * Math.cos(b), d = T + p * Math.sin(b), v = ha(_, d, l, p, i, 0, o, St, re, [b, D, A, T]);
  }
  xt = b - g;
  const _e = Math.cos(g), Hr = Math.sin(g), Mt = Math.cos(b), Gr = Math.sin(b), Ve = Math.tan(xt / 4), Vr = 4 / 3 * l * Ve, Yr = 4 / 3 * p * Ve, Pt = [c, h], Ct = [c + Vr * Hr, h - Yr * _e], Ye = [_ + Vr * Gr, d - Yr * Mt], Ze = [_, d];
  if (Ct[0] = 2 * Pt[0] - Ct[0], Ct[1] = 2 * Pt[1] - Ct[1], f)
    return Ct.concat(Ye, Ze, v);
  v = Ct.concat(Ye, Ze, v);
  const Xn = [];
  for (let D = 0, St = v.length; D < St; D += 1)
    Xn[D] = D % 2 ? Qr(v[D - 1], v[D], m).y : Qr(v[D], v[D + 1], m).x;
  return Xn;
}
function wl(t, e, r, n, i, s) {
  const o = 0.3333333333333333, a = 2 / 3;
  return [
    o * t + a * r,
    // cpx1
    o * e + a * n,
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
function yt(t, e, r) {
  const n = t[0], i = t[1], s = e[0], o = e[1];
  return [n + (s - n) * r, i + (o - i) * r];
}
function je(t, e) {
  return Math.sqrt((t[0] - e[0]) * (t[0] - e[0]) + (t[1] - e[1]) * (t[1] - e[1]));
}
function lr(t, e, r, n, i) {
  const s = je([t, e], [r, n]);
  let o = { x: 0, y: 0 };
  if (typeof i == "number")
    if (i <= 0)
      o = { x: t, y: e };
    else if (i >= s)
      o = { x: r, y: n };
    else {
      const [a, u] = yt([t, e], [r, n], i / s);
      o = { x: a, y: u };
    }
  return {
    length: s,
    point: o,
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
function Ds(t, e, r, n) {
  const s = [t, e], o = [r, n], a = yt(s, o, 0.5), u = yt(o, a, 0.5), f = yt(a, u, 0.5), c = yt(u, f, 0.5), h = yt(f, c, 0.5), l = lr(s[0], s[1], a[0], a[1], f[0]).point, p = lr(h[0], h[1], c[0], c[1], u[0]).point;
  return [l.x, l.y, p.x, p.y, r, n];
}
function bl(t, e) {
  const [r] = t, n = t.slice(1).map(Number), [i, s] = n;
  let o;
  const { x1: a, y1: u, x: f, y: c } = e;
  switch ("TQ".includes(r) || (e.qx = null, e.qy = null), r) {
    case "M":
      return e.x = i, e.y = s, t;
    case "A":
      return o = [a, u].concat(n), ["C"].concat(
        ha(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9])
      );
    case "Q":
      return e.qx = i, e.qy = s, o = [a, u].concat(n), ["C"].concat(wl(o[0], o[1], o[2], o[3], o[4], o[5]));
    case "L":
      return ["C"].concat(Ds(a, u, i, s));
    case "Z":
      return a === f && u === c ? ["C", a, u, f, c, f, c] : ["C"].concat(Ds(a, u, f, c));
  }
  return t;
}
function la(t, e = !1) {
  if (ml(t)) {
    const c = Le(t);
    return e ? [c, []] : c;
  }
  const r = Fn(t), n = { ...oa }, i = [];
  let s = "", o = r.length, a, u;
  const f = [];
  for (let c = 0; c < o; c += 1) {
    r[c] && ([s] = r[c]), i[c] = s;
    const h = bl(r[c], n);
    r[c] = h, fl(r, i, c), o = r.length, s === "Z" && f.push(c), a = r[c], u = a.length, n.x1 = +a[u - 2], n.y1 = +a[u - 1], n.x2 = +a[u - 4] || n.x1, n.y2 = +a[u - 3] || n.y1;
  }
  return e ? [r, f] : r;
}
function Sl(t) {
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
function ks(t, e) {
  const { x: r, y: n } = t, { x: i, y: s } = e, o = r * i + n * s, a = Math.sqrt((r ** 2 + n ** 2) * (i ** 2 + s ** 2));
  return (r * s - n * i < 0 ? -1 : 1) * Math.acos(o / a);
}
function Al(t, e, r, n, i, s, o, a, u, f) {
  const { abs: c, sin: h, cos: l, sqrt: p, PI: _ } = Math;
  let d = c(r), y = c(n);
  const v = (i % 360 + 360) % 360 * (_ / 180);
  if (t === a && e === u)
    return { x: t, y: e };
  if (d === 0 || y === 0)
    return lr(t, e, a, u, f).point;
  const w = (t - a) / 2, g = (e - u) / 2, b = {
    x: l(v) * w + h(v) * g,
    y: -h(v) * w + l(v) * g
  }, A = b.x ** 2 / d ** 2 + b.y ** 2 / y ** 2;
  A > 1 && (d *= p(A), y *= p(A));
  const T = d ** 2 * y ** 2 - d ** 2 * b.y ** 2 - y ** 2 * b.x ** 2, xt = d ** 2 * b.y ** 2 + y ** 2 * b.x ** 2;
  let _e = T / xt;
  _e = _e < 0 ? 0 : _e;
  const Hr = (s !== o ? 1 : -1) * p(_e), Mt = {
    x: Hr * (d * b.y / y),
    y: Hr * (-(y * b.x) / d)
  }, Gr = {
    x: l(v) * Mt.x - h(v) * Mt.y + (t + a) / 2,
    y: h(v) * Mt.x + l(v) * Mt.y + (e + u) / 2
  }, Ve = {
    x: (b.x - Mt.x) / d,
    y: (b.y - Mt.y) / y
  }, Vr = ks({ x: 1, y: 0 }, Ve), Yr = {
    x: (-b.x - Mt.x) / d,
    y: (-b.y - Mt.y) / y
  };
  let Pt = ks(Ve, Yr);
  !o && Pt > 0 ? Pt -= 2 * _ : o && Pt < 0 && (Pt += 2 * _), Pt %= 2 * _;
  const Ct = Vr + Pt * f, Ye = d * l(Ct), Ze = y * h(Ct);
  return {
    x: l(v) * Ye - h(v) * Ze + Gr.x,
    y: h(v) * Ye + l(v) * Ze + Gr.y
  };
}
function Ol(t, e, r, n, i, s, o, a, u, f) {
  const c = typeof f == "number";
  let h = t, l = e, p = 0, _ = [h, l, p], d = [h, l], y = 0, m = { x: 0, y: 0 }, v = [{ x: h, y: l }];
  c && f <= 0 && (m = { x: h, y: l });
  const w = 100;
  for (let g = 0; g <= w; g += 1) {
    if (y = g / w, { x: h, y: l } = Al(t, e, r, n, i, s, o, a, u, y), v = v.concat({ x: h, y: l }), p += je(d, [h, l]), d = [h, l], c && p >= f && f > _[2]) {
      const b = (p - f) / (p - _[2]);
      m = {
        x: d[0] * (1 - b) + _[0] * b,
        y: d[1] * (1 - b) + _[1] * b
      };
    }
    _ = [h, l, p];
  }
  return c && f >= p && (m = { x: a, y: u }), {
    length: p,
    point: m,
    min: {
      x: Math.min.apply(
        null,
        v.map((g) => g.x)
      ),
      y: Math.min.apply(
        null,
        v.map((g) => g.y)
      )
    },
    max: {
      x: Math.max.apply(
        null,
        v.map((g) => g.x)
      ),
      y: Math.max.apply(
        null,
        v.map((g) => g.y)
      )
    }
  };
}
function El(t, e, r, n, i, s, o, a, u) {
  const f = 1 - u;
  return {
    x: f ** 3 * t + 3 * f ** 2 * u * r + 3 * f * u ** 2 * i + u ** 3 * o,
    y: f ** 3 * e + 3 * f ** 2 * u * n + 3 * f * u ** 2 * s + u ** 3 * a
  };
}
function pa(t, e, r, n, i, s, o, a, u) {
  const f = typeof u == "number";
  let c = t, h = e, l = 0, p = [c, h, l], _ = [c, h], d = 0, y = { x: 0, y: 0 }, m = [{ x: c, y: h }];
  f && u <= 0 && (y = { x: c, y: h });
  const v = 30;
  for (let w = 0; w <= v; w += 1) {
    if (d = w / v, { x: c, y: h } = El(t, e, r, n, i, s, o, a, d), m = m.concat({ x: c, y: h }), l += je(_, [c, h]), _ = [c, h], f && l >= u && u > p[2]) {
      const g = (l - u) / (l - p[2]);
      y = {
        x: _[0] * (1 - g) + p[0] * g,
        y: _[1] * (1 - g) + p[1] * g
      };
    }
    p = [c, h, l];
  }
  return f && u >= l && (y = { x: o, y: a }), {
    length: l,
    point: y,
    min: {
      x: Math.min.apply(
        null,
        m.map((w) => w.x)
      ),
      y: Math.min.apply(
        null,
        m.map((w) => w.y)
      )
    },
    max: {
      x: Math.max.apply(
        null,
        m.map((w) => w.x)
      ),
      y: Math.max.apply(
        null,
        m.map((w) => w.y)
      )
    }
  };
}
function xl(t, e, r, n, i, s, o) {
  const a = 1 - o;
  return {
    x: a ** 2 * t + 2 * a * o * r + o ** 2 * i,
    y: a ** 2 * e + 2 * a * o * n + o ** 2 * s
  };
}
function Ml(t, e, r, n, i, s, o) {
  const a = typeof o == "number";
  let u = t, f = e, c = 0, h = [u, f, c], l = [u, f], p = 0, _ = { x: 0, y: 0 }, d = [{ x: u, y: f }];
  a && o <= 0 && (_ = { x: u, y: f });
  const y = 30;
  for (let m = 0; m <= y; m += 1) {
    if (p = m / y, { x: u, y: f } = xl(t, e, r, n, i, s, p), d = d.concat({ x: u, y: f }), c += je(l, [u, f]), l = [u, f], a && c >= o && o > h[2]) {
      const v = (c - o) / (c - h[2]);
      _ = {
        x: l[0] * (1 - v) + h[0] * v,
        y: l[1] * (1 - v) + h[1] * v
      };
    }
    h = [u, f, c];
  }
  return a && o >= c && (_ = { x: i, y: s }), {
    length: c,
    point: _,
    min: {
      x: Math.min.apply(
        null,
        d.map((m) => m.x)
      ),
      y: Math.min.apply(
        null,
        d.map((m) => m.y)
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
function Pn(t, e) {
  const r = Fn(t), n = typeof e == "number";
  let i, s = [], o, a = 0, u = 0, f = 0, c = 0, h, l = [], p = [], _ = 0, d = { x: 0, y: 0 }, y = d, m = d, v = d, w = 0;
  for (let g = 0, b = r.length; g < b; g += 1)
    h = r[g], [o] = h, i = o === "M", s = i ? s : [a, u].concat(h.slice(1)), i ? ([, f, c] = h, d = { x: f, y: c }, y = d, _ = 0, n && e < 1e-3 && (v = d)) : o === "L" ? { length: _, min: d, max: y, point: m } = lr(s[0], s[1], s[2], s[3], (e || 0) - w) : o === "A" ? { length: _, min: d, max: y, point: m } = Ol(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      s[6],
      s[7],
      s[8],
      (e || 0) - w
    ) : o === "C" ? { length: _, min: d, max: y, point: m } = pa(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      s[6],
      s[7],
      (e || 0) - w
    ) : o === "Q" ? { length: _, min: d, max: y, point: m } = Ml(
      s[0],
      s[1],
      s[2],
      s[3],
      s[4],
      s[5],
      (e || 0) - w
    ) : o === "Z" && (s = [a, u, f, c], { length: _, min: d, max: y, point: m } = lr(s[0], s[1], s[2], s[3], (e || 0) - w)), n && w < e && w + _ >= e && (v = m), p.push(y), l.push(d), w += _, [a, u] = o !== "Z" ? h.slice(-2) : [f, c];
  return n && e >= w && (v = { x: a, y: u }), {
    length: w,
    point: v,
    min: {
      x: Math.min.apply(
        null,
        l.map((g) => g.x)
      ),
      y: Math.min.apply(
        null,
        l.map((g) => g.y)
      )
    },
    max: {
      x: Math.max.apply(
        null,
        p.map((g) => g.x)
      ),
      y: Math.max.apply(
        null,
        p.map((g) => g.y)
      )
    }
  };
}
function Il(t) {
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
  } = Pn(t), s = n - e, o = i - r;
  return {
    width: s,
    height: o,
    x: e,
    y: r,
    x2: n,
    y2: i,
    cx: e + s / 2,
    cy: r + o / 2,
    // an estimted guess
    cz: Math.max(s, o) + Math.min(s, o) / 2
  };
}
function nr(t) {
  return Pn(t).length;
}
function Tl(t) {
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
    max: { x: i, y: s }
  } = Pn(t), o = i - r, a = s - n;
  return {
    length: e,
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
function zl(t) {
  const e = t.length, r = e - 1;
  return t.map(
    (n, i) => t.map((s, o) => {
      let a = i + o, u;
      return o === 0 || t[a] && t[a][0] === "M" ? (u = t[a], ["M"].concat(u.slice(-2))) : (a >= e && (a -= r), t[a]);
    })
  );
}
function Rl(t, e) {
  const r = t.length - 1, n = [];
  let i = 0, s = 0;
  const o = zl(t);
  return o.forEach((a, u) => {
    t.slice(1).forEach((f, c) => {
      s += je(t[(u + c) % r].slice(-2), e[c % r].slice(-2));
    }), n[u] = s, s = 0;
  }), i = n.indexOf(Math.min.apply(null, n)), o[i];
}
function Fl(t, e, r, n, i, s, o, a) {
  return 3 * ((a - e) * (r + i) - (o - t) * (n + s) + n * (t - i) - r * (e - s) + a * (i + t / 3) - o * (s + e / 3)) / 20;
}
function _a(t) {
  let e = 0, r = 0, n = 0;
  return la(t).map((i) => {
    switch (i[0]) {
      case "M":
        return [, e, r] = i, 0;
      default:
        const [s, o, a, u, f, c] = i.slice(1);
        return n = Fl(e, r, s, o, a, u, f, c), [e, r] = i.slice(-2), n;
    }
  }).reduce((i, s) => i + s, 0);
}
function Pl(t) {
  return _a(t) >= 0;
}
function fn(t, e) {
  return Pn(t, e).point;
}
function Cl(t, e) {
  const r = Ui(t);
  if (typeof r == "string")
    throw TypeError(r);
  let n = r.slice(), i = nr(n), s = n.length - 1, o = 0, a = 0, u = r[0];
  const [f, c] = u.slice(-2), h = { x: f, y: c };
  if (s <= 0 || !e || !Number.isFinite(e))
    return {
      segment: u,
      index: 0,
      length: a,
      point: h,
      lengthAtSegment: o
    };
  if (e >= i)
    return n = r.slice(0, -1), o = nr(n), a = i - o, {
      segment: r[s],
      index: s,
      length: a,
      lengthAtSegment: o
    };
  const l = [];
  for (; s > 0; )
    u = n[s], n = n.slice(0, -1), o = nr(n), a = i - o, i = o, l.push({
      segment: u,
      index: s,
      length: a,
      lengthAtSegment: o
    }), s -= 1;
  return l.find(({ lengthAtSegment: p }) => p <= e);
}
function $l(t, e) {
  const r = Ui(t), n = Fn(r), i = nr(r), s = (g) => {
    const b = g.x - e.x, A = g.y - e.y;
    return b * b + A * A;
  };
  let o = 8, a, u = 0, f = { x: 0, y: 0 }, c = 0, h = 1 / 0;
  for (let g = 0; g <= i; g += o)
    a = fn(n, g), u = s(a), u < h && (f = a, c = g, h = u);
  o /= 2;
  let l, p, _ = 0, d = 0, y = 0, m = 0;
  for (; o > 0.5; )
    _ = c - o, l = fn(n, _), y = s(l), d = c + o, p = fn(n, d), m = s(p), _ >= 0 && y < h ? (f = l, c = _, h = y) : d <= i && m < h ? (f = p, c = d, h = m) : o /= 2;
  const v = Cl(r, c), w = Math.sqrt(h);
  return { closest: f, distance: w, segment: v };
}
function ql(t, e) {
  const { distance: r } = $l(t, e);
  return Math.abs(r) < 1e-3;
}
function Nl(t, e = 0.5) {
  const r = t.slice(0, 2), n = t.slice(2, 4), i = t.slice(4, 6), s = t.slice(6, 8), o = yt(r, n, e), a = yt(n, i, e), u = yt(i, s, e), f = yt(o, a, e), c = yt(a, u, e), h = yt(f, c, e);
  return [
    // @ts-ignore
    ["C"].concat(o, f, h),
    // @ts-ignore
    ["C"].concat(c, u, s)
  ];
}
function Bs(t) {
  return t.map((e, r, n) => {
    const i = r && n[r - 1].slice(-2).concat(e.slice(1)), s = r ? pa(
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
    return r ? o = s ? Nl(i) : [e, e] : o = [e], {
      s: e,
      ss: o,
      l: s
    };
  });
}
function da(t, e, r) {
  const n = Bs(t), i = Bs(e), s = n.length, o = i.length, a = n.filter((y) => y.l).length, u = i.filter((y) => y.l).length, f = n.filter((y) => y.l).reduce((y, { l: m }) => y + m, 0) / a || 0, c = i.filter((y) => y.l).reduce((y, { l: m }) => y + m, 0) / u || 0, h = r || Math.max(s, o), l = [f, c], p = [h - s, h - o];
  let _ = 0;
  const d = [n, i].map(
    (y, m) => (
      // @ts-ignore
      y.l === h ? y.map((v) => v.s) : y.map((v, w) => (_ = w && p[m] && v.l >= l[m], p[m] -= _ ? 1 : 0, _ ? v.ss : [v.s])).flat()
    )
  );
  return d[0].length === d[1].length ? d : da(d[0], d[1], h);
}
const Ld = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angleTo: sl,
  clonePath: Le,
  direction: sa,
  distanceSquareRoot: je,
  equalizeSegments: da,
  getDrawDirection: Pl,
  getPathArea: _a,
  getPathBBox: Il,
  getPathBBoxTotalLength: Tl,
  getPointAtLength: fn,
  getRotatedCurve: Rl,
  getTotalLength: nr,
  gradient: Uh,
  isPointInStroke: ql,
  normalizePath: Fn,
  path2Absolute: ca,
  path2Curve: la,
  path2String: ul,
  reverseCurve: Sl,
  rgb2arr: ra,
  toCSSGradient: Vh,
  toRGB: ia,
  transform: il,
  vertical: ol
}, Symbol.toStringTag, { value: "Module" }));
var Cn = Symbol.for("immer-nothing"), me = Symbol.for("immer-draftable"), x = Symbol.for("immer-state"), ya = process.env.NODE_ENV !== "production" ? [
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
function q(t, ...e) {
  if (process.env.NODE_ENV !== "production") {
    const r = ya[t], n = typeof r == "function" ? r.apply(null, e) : r;
    throw new Error(`[Immer] ${n}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${t}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var se = Object.getPrototypeOf;
function Dt(t) {
  return !!t && !!t[x];
}
function Ot(t) {
  return t ? ga(t) || Array.isArray(t) || !!t[me] || !!t.constructor?.[me] || Rr(t) || Fr(t) : !1;
}
var Ll = Object.prototype.constructor.toString();
function ga(t) {
  if (!t || typeof t != "object")
    return !1;
  const e = se(t);
  if (e === null)
    return !0;
  const r = Object.hasOwnProperty.call(e, "constructor") && e.constructor;
  return r === Object ? !0 : typeof r == "function" && Function.toString.call(r) === Ll;
}
function jl(t) {
  return Dt(t) || q(15, t), t[x].base_;
}
function Ee(t, e) {
  oe(t) === 0 ? Reflect.ownKeys(t).forEach((r) => {
    e(r, t[r], t);
  }) : t.forEach((r, n) => e(n, r, t));
}
function oe(t) {
  const e = t[x];
  return e ? e.type_ : Array.isArray(t) ? 1 : Rr(t) ? 2 : Fr(t) ? 3 : 0;
}
function pr(t, e) {
  return oe(t) === 2 ? t.has(e) : Object.prototype.hasOwnProperty.call(t, e);
}
function si(t, e) {
  return oe(t) === 2 ? t.get(e) : t[e];
}
function va(t, e, r) {
  const n = oe(t);
  n === 2 ? t.set(e, r) : n === 3 ? t.add(r) : t[e] = r;
}
function Dl(t, e) {
  return t === e ? t !== 0 || 1 / t === 1 / e : t !== t && e !== e;
}
function Rr(t) {
  return t instanceof Map;
}
function Fr(t) {
  return t instanceof Set;
}
function k(t) {
  return t.copy_ || t.base_;
}
function wi(t, e) {
  if (Rr(t))
    return new Map(t);
  if (Fr(t))
    return new Set(t);
  if (Array.isArray(t))
    return Array.prototype.slice.call(t);
  const r = ga(t);
  if (e === !0 || e === "class_only" && !r) {
    const n = Object.getOwnPropertyDescriptors(t);
    delete n[x];
    let i = Reflect.ownKeys(n);
    for (let s = 0; s < i.length; s++) {
      const o = i[s], a = n[o];
      a.writable === !1 && (a.writable = !0, a.configurable = !0), (a.get || a.set) && (n[o] = {
        configurable: !0,
        writable: !0,
        // could live with !!desc.set as well here...
        enumerable: a.enumerable,
        value: t[o]
      });
    }
    return Object.create(se(t), n);
  } else {
    const n = se(t);
    if (n !== null && r)
      return { ...t };
    const i = Object.create(n);
    return Object.assign(i, t);
  }
}
function $n(t, e = !1) {
  return qn(t) || Dt(t) || !Ot(t) || (oe(t) > 1 && (t.set = t.add = t.clear = t.delete = kl), Object.freeze(t), e && Object.entries(t).forEach(([r, n]) => $n(n, !0))), t;
}
function kl() {
  q(2);
}
function qn(t) {
  return Object.isFrozen(t);
}
var bi = {};
function ae(t) {
  const e = bi[t];
  return e || q(0, t), e;
}
function ma(t, e) {
  bi[t] || (bi[t] = e);
}
var _r;
function dn() {
  return _r;
}
function Bl(t, e) {
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
function Us(t, e) {
  e && (ae("Patches"), t.patches_ = [], t.inversePatches_ = [], t.patchListener_ = e);
}
function Si(t) {
  Ai(t), t.drafts_.forEach(Ul), t.drafts_ = null;
}
function Ai(t) {
  t === _r && (_r = t.parent_);
}
function Ws(t) {
  return _r = Bl(_r, t);
}
function Ul(t) {
  const e = t[x];
  e.type_ === 0 || e.type_ === 1 ? e.revoke_() : e.revoked_ = !0;
}
function Ks(t, e) {
  e.unfinalizedDrafts_ = e.drafts_.length;
  const r = e.drafts_[0];
  return t !== void 0 && t !== r ? (r[x].modified_ && (Si(e), q(4)), Ot(t) && (t = yn(e, t), e.parent_ || gn(e, t)), e.patches_ && ae("Patches").generateReplacementPatches_(
    r[x].base_,
    t,
    e.patches_,
    e.inversePatches_
  )) : t = yn(e, r, []), Si(e), e.patches_ && e.patchListener_(e.patches_, e.inversePatches_), t !== Cn ? t : void 0;
}
function yn(t, e, r) {
  if (qn(e))
    return e;
  const n = e[x];
  if (!n)
    return Ee(
      e,
      (i, s) => Hs(t, n, e, i, s, r)
    ), e;
  if (n.scope_ !== t)
    return e;
  if (!n.modified_)
    return gn(t, n.base_, !0), n.base_;
  if (!n.finalized_) {
    n.finalized_ = !0, n.scope_.unfinalizedDrafts_--;
    const i = n.copy_;
    let s = i, o = !1;
    n.type_ === 3 && (s = new Set(i), i.clear(), o = !0), Ee(
      s,
      (a, u) => Hs(t, n, i, a, u, r, o)
    ), gn(t, i, !1), r && t.patches_ && ae("Patches").generatePatches_(
      n,
      r,
      t.patches_,
      t.inversePatches_
    );
  }
  return n.copy_;
}
function Hs(t, e, r, n, i, s, o) {
  if (process.env.NODE_ENV !== "production" && i === r && q(5), Dt(i)) {
    const a = s && e && e.type_ !== 3 && // Set objects are atomic since they have no keys.
    !pr(e.assigned_, n) ? s.concat(n) : void 0, u = yn(t, i, a);
    if (va(r, n, u), Dt(u))
      t.canAutoFreeze_ = !1;
    else
      return;
  } else o && r.add(i);
  if (Ot(i) && !qn(i)) {
    if (!t.immer_.autoFreeze_ && t.unfinalizedDrafts_ < 1)
      return;
    yn(t, i), (!e || !e.scope_.parent_) && typeof n != "symbol" && Object.prototype.propertyIsEnumerable.call(r, n) && gn(t, i);
  }
}
function gn(t, e, r = !1) {
  !t.parent_ && t.immer_.autoFreeze_ && t.canAutoFreeze_ && $n(e, r);
}
function Wl(t, e) {
  const r = Array.isArray(t), n = {
    type_: r ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: e ? e.scope_ : dn(),
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
  let i = n, s = Wi;
  r && (i = [n], s = dr);
  const { revoke: o, proxy: a } = Proxy.revocable(i, s);
  return n.draft_ = a, n.revoke_ = o, a;
}
var Wi = {
  get(t, e) {
    if (e === x)
      return t;
    const r = k(t);
    if (!pr(r, e))
      return Kl(t, r, e);
    const n = r[e];
    return t.finalized_ || !Ot(n) ? n : n === oi(t.base_, e) ? (ai(t), t.copy_[e] = yr(n, t)) : n;
  },
  has(t, e) {
    return e in k(t);
  },
  ownKeys(t) {
    return Reflect.ownKeys(k(t));
  },
  set(t, e, r) {
    const n = wa(k(t), e);
    if (n?.set)
      return n.set.call(t.draft_, r), !0;
    if (!t.modified_) {
      const i = oi(k(t), e), s = i?.[x];
      if (s && s.base_ === r)
        return t.copy_[e] = r, t.assigned_[e] = !1, !0;
      if (Dl(r, i) && (r !== void 0 || pr(t.base_, e)))
        return !0;
      ai(t), qt(t);
    }
    return t.copy_[e] === r && // special case: handle new props with value 'undefined'
    (r !== void 0 || e in t.copy_) || // special case: NaN
    Number.isNaN(r) && Number.isNaN(t.copy_[e]) || (t.copy_[e] = r, t.assigned_[e] = !0), !0;
  },
  deleteProperty(t, e) {
    return oi(t.base_, e) !== void 0 || e in t.base_ ? (t.assigned_[e] = !1, ai(t), qt(t)) : delete t.assigned_[e], t.copy_ && delete t.copy_[e], !0;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(t, e) {
    const r = k(t), n = Reflect.getOwnPropertyDescriptor(r, e);
    return n && {
      writable: !0,
      configurable: t.type_ !== 1 || e !== "length",
      enumerable: n.enumerable,
      value: r[e]
    };
  },
  defineProperty() {
    q(11);
  },
  getPrototypeOf(t) {
    return se(t.base_);
  },
  setPrototypeOf() {
    q(12);
  }
}, dr = {};
Ee(Wi, (t, e) => {
  dr[t] = function() {
    return arguments[0] = arguments[0][0], e.apply(this, arguments);
  };
});
dr.deleteProperty = function(t, e) {
  return process.env.NODE_ENV !== "production" && isNaN(parseInt(e)) && q(13), dr.set.call(this, t, e, void 0);
};
dr.set = function(t, e, r) {
  return process.env.NODE_ENV !== "production" && e !== "length" && isNaN(parseInt(e)) && q(14), Wi.set.call(this, t[0], e, r, t[0]);
};
function oi(t, e) {
  const r = t[x];
  return (r ? k(r) : t)[e];
}
function Kl(t, e, r) {
  const n = wa(e, r);
  return n ? "value" in n ? n.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    n.get?.call(t.draft_)
  ) : void 0;
}
function wa(t, e) {
  if (!(e in t))
    return;
  let r = se(t);
  for (; r; ) {
    const n = Object.getOwnPropertyDescriptor(r, e);
    if (n)
      return n;
    r = se(r);
  }
}
function qt(t) {
  t.modified_ || (t.modified_ = !0, t.parent_ && qt(t.parent_));
}
function ai(t) {
  t.copy_ || (t.copy_ = wi(
    t.base_,
    t.scope_.immer_.useStrictShallowCopy_
  ));
}
var ba = class {
  constructor(t) {
    this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.produce = (e, r, n) => {
      if (typeof e == "function" && typeof r != "function") {
        const s = r;
        r = e;
        const o = this;
        return function(u = s, ...f) {
          return o.produce(u, (c) => r.call(this, c, ...f));
        };
      }
      typeof r != "function" && q(6), n !== void 0 && typeof n != "function" && q(7);
      let i;
      if (Ot(e)) {
        const s = Ws(this), o = yr(e, void 0);
        let a = !0;
        try {
          i = r(o), a = !1;
        } finally {
          a ? Si(s) : Ai(s);
        }
        return Us(s, n), Ks(i, s);
      } else if (!e || typeof e != "object") {
        if (i = r(e), i === void 0 && (i = e), i === Cn && (i = void 0), this.autoFreeze_ && $n(i, !0), n) {
          const s = [], o = [];
          ae("Patches").generateReplacementPatches_(e, i, s, o), n(s, o);
        }
        return i;
      } else
        q(1, e);
    }, this.produceWithPatches = (e, r) => {
      if (typeof e == "function")
        return (o, ...a) => this.produceWithPatches(o, (u) => e(u, ...a));
      let n, i;
      return [this.produce(e, r, (o, a) => {
        n = o, i = a;
      }), n, i];
    }, typeof t?.autoFreeze == "boolean" && this.setAutoFreeze(t.autoFreeze), typeof t?.useStrictShallowCopy == "boolean" && this.setUseStrictShallowCopy(t.useStrictShallowCopy);
  }
  createDraft(t) {
    Ot(t) || q(8), Dt(t) && (t = Sa(t));
    const e = Ws(this), r = yr(t, void 0);
    return r[x].isManual_ = !0, Ai(e), r;
  }
  finishDraft(t, e) {
    const r = t && t[x];
    (!r || !r.isManual_) && q(9);
    const { scope_: n } = r;
    return Us(n, e), Ks(void 0, n);
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
    const n = ae("Patches").applyPatches_;
    return Dt(t) ? n(t, e) : this.produce(
      t,
      (i) => n(i, e)
    );
  }
};
function yr(t, e) {
  const r = Rr(t) ? ae("MapSet").proxyMap_(t, e) : Fr(t) ? ae("MapSet").proxySet_(t, e) : Wl(t, e);
  return (e ? e.scope_ : dn()).drafts_.push(r), r;
}
function Sa(t) {
  return Dt(t) || q(10, t), Aa(t);
}
function Aa(t) {
  if (!Ot(t) || qn(t))
    return t;
  const e = t[x];
  let r;
  if (e) {
    if (!e.modified_)
      return e.base_;
    e.finalized_ = !0, r = wi(t, e.scope_.immer_.useStrictShallowCopy_);
  } else
    r = wi(t, !0);
  return Ee(r, (n, i) => {
    va(r, n, Aa(i));
  }), e && (e.finalized_ = !1), r;
}
function Hl() {
  process.env.NODE_ENV !== "production" && ya.push(
    'Sets cannot have "replace" patches.',
    function(l) {
      return "Unsupported patch operation: " + l;
    },
    function(l) {
      return "Cannot apply patch, path doesn't resolve: " + l;
    },
    "Patching reserved attributes like __proto__, prototype and constructor is not allowed"
  );
  const e = "replace", r = "add", n = "remove";
  function i(l, p, _, d) {
    switch (l.type_) {
      case 0:
      case 2:
        return o(
          l,
          p,
          _,
          d
        );
      case 1:
        return s(l, p, _, d);
      case 3:
        return a(
          l,
          p,
          _,
          d
        );
    }
  }
  function s(l, p, _, d) {
    let { base_: y, assigned_: m } = l, v = l.copy_;
    v.length < y.length && ([y, v] = [v, y], [_, d] = [d, _]);
    for (let w = 0; w < y.length; w++)
      if (m[w] && v[w] !== y[w]) {
        const g = p.concat([w]);
        _.push({
          op: e,
          path: g,
          // Need to maybe clone it, as it can in fact be the original value
          // due to the base/copy inversion at the start of this function
          value: h(v[w])
        }), d.push({
          op: e,
          path: g,
          value: h(y[w])
        });
      }
    for (let w = y.length; w < v.length; w++) {
      const g = p.concat([w]);
      _.push({
        op: r,
        path: g,
        // Need to maybe clone it, as it can in fact be the original value
        // due to the base/copy inversion at the start of this function
        value: h(v[w])
      });
    }
    for (let w = v.length - 1; y.length <= w; --w) {
      const g = p.concat([w]);
      d.push({
        op: n,
        path: g
      });
    }
  }
  function o(l, p, _, d) {
    const { base_: y, copy_: m } = l;
    Ee(l.assigned_, (v, w) => {
      const g = si(y, v), b = si(m, v), A = w ? pr(y, v) ? e : r : n;
      if (g === b && A === e)
        return;
      const T = p.concat(v);
      _.push(A === n ? { op: A, path: T } : { op: A, path: T, value: b }), d.push(
        A === r ? { op: n, path: T } : A === n ? { op: r, path: T, value: h(g) } : { op: e, path: T, value: h(g) }
      );
    });
  }
  function a(l, p, _, d) {
    let { base_: y, copy_: m } = l, v = 0;
    y.forEach((w) => {
      if (!m.has(w)) {
        const g = p.concat([v]);
        _.push({
          op: n,
          path: g,
          value: w
        }), d.unshift({
          op: r,
          path: g,
          value: w
        });
      }
      v++;
    }), v = 0, m.forEach((w) => {
      if (!y.has(w)) {
        const g = p.concat([v]);
        _.push({
          op: r,
          path: g,
          value: w
        }), d.unshift({
          op: n,
          path: g,
          value: w
        });
      }
      v++;
    });
  }
  function u(l, p, _, d) {
    _.push({
      op: e,
      path: [],
      value: p === Cn ? void 0 : p
    }), d.push({
      op: e,
      path: [],
      value: l
    });
  }
  function f(l, p) {
    return p.forEach((_) => {
      const { path: d, op: y } = _;
      let m = l;
      for (let b = 0; b < d.length - 1; b++) {
        const A = oe(m);
        let T = d[b];
        typeof T != "string" && typeof T != "number" && (T = "" + T), (A === 0 || A === 1) && (T === "__proto__" || T === "constructor") && q(19), typeof m == "function" && T === "prototype" && q(19), m = si(m, T), typeof m != "object" && q(18, d.join("/"));
      }
      const v = oe(m), w = c(_.value), g = d[d.length - 1];
      switch (y) {
        case e:
          switch (v) {
            case 2:
              return m.set(g, w);
            case 3:
              q(16);
            default:
              return m[g] = w;
          }
        case r:
          switch (v) {
            case 1:
              return g === "-" ? m.push(w) : m.splice(g, 0, w);
            case 2:
              return m.set(g, w);
            case 3:
              return m.add(w);
            default:
              return m[g] = w;
          }
        case n:
          switch (v) {
            case 1:
              return m.splice(g, 1);
            case 2:
              return m.delete(g);
            case 3:
              return m.delete(_.value);
            default:
              return delete m[g];
          }
        default:
          q(17, y);
      }
    }), l;
  }
  function c(l) {
    if (!Ot(l))
      return l;
    if (Array.isArray(l))
      return l.map(c);
    if (Rr(l))
      return new Map(
        Array.from(l.entries()).map(([_, d]) => [_, c(d)])
      );
    if (Fr(l))
      return new Set(Array.from(l).map(c));
    const p = Object.create(se(l));
    for (const _ in l)
      p[_] = c(l[_]);
    return pr(l, me) && (p[me] = l[me]), p;
  }
  function h(l) {
    return Dt(l) ? c(l) : l;
  }
  ma("Patches", {
    applyPatches_: f,
    generatePatches_: i,
    generateReplacementPatches_: u
  });
}
function Gl() {
  class t extends Map {
    constructor(u, f) {
      super(), this[x] = {
        type_: 2,
        parent_: f,
        scope_: f ? f.scope_ : dn(),
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
      return k(this[x]).size;
    }
    has(u) {
      return k(this[x]).has(u);
    }
    set(u, f) {
      const c = this[x];
      return o(c), (!k(c).has(u) || k(c).get(u) !== f) && (r(c), qt(c), c.assigned_.set(u, !0), c.copy_.set(u, f), c.assigned_.set(u, !0)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[x];
      return o(f), r(f), qt(f), f.base_.has(u) ? f.assigned_.set(u, !1) : f.assigned_.delete(u), f.copy_.delete(u), !0;
    }
    clear() {
      const u = this[x];
      o(u), k(u).size && (r(u), qt(u), u.assigned_ = /* @__PURE__ */ new Map(), Ee(u.base_, (f) => {
        u.assigned_.set(f, !1);
      }), u.copy_.clear());
    }
    forEach(u, f) {
      const c = this[x];
      k(c).forEach((h, l, p) => {
        u.call(f, this.get(l), l, this);
      });
    }
    get(u) {
      const f = this[x];
      o(f);
      const c = k(f).get(u);
      if (f.finalized_ || !Ot(c) || c !== f.base_.get(u))
        return c;
      const h = yr(c, f);
      return r(f), f.copy_.set(u, h), h;
    }
    keys() {
      return k(this[x]).keys();
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
  function e(a, u) {
    return new t(a, u);
  }
  function r(a) {
    a.copy_ || (a.assigned_ = /* @__PURE__ */ new Map(), a.copy_ = new Map(a.base_));
  }
  class n extends Set {
    constructor(u, f) {
      super(), this[x] = {
        type_: 3,
        parent_: f,
        scope_: f ? f.scope_ : dn(),
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
      return k(this[x]).size;
    }
    has(u) {
      const f = this[x];
      return o(f), f.copy_ ? !!(f.copy_.has(u) || f.drafts_.has(u) && f.copy_.has(f.drafts_.get(u))) : f.base_.has(u);
    }
    add(u) {
      const f = this[x];
      return o(f), this.has(u) || (s(f), qt(f), f.copy_.add(u)), this;
    }
    delete(u) {
      if (!this.has(u))
        return !1;
      const f = this[x];
      return o(f), s(f), qt(f), f.copy_.delete(u) || (f.drafts_.has(u) ? f.copy_.delete(f.drafts_.get(u)) : (
        /* istanbul ignore next */
        !1
      ));
    }
    clear() {
      const u = this[x];
      o(u), k(u).size && (s(u), qt(u), u.copy_.clear());
    }
    values() {
      const u = this[x];
      return o(u), s(u), u.copy_.values();
    }
    entries() {
      const u = this[x];
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
      let h = c.next();
      for (; !h.done; )
        u.call(f, h.value, h.value, this), h = c.next();
    }
  }
  function i(a, u) {
    return new n(a, u);
  }
  function s(a) {
    a.copy_ || (a.copy_ = /* @__PURE__ */ new Set(), a.base_.forEach((u) => {
      if (Ot(u)) {
        const f = yr(u, a);
        a.drafts_.set(u, f), a.copy_.add(f);
      } else
        a.copy_.add(u);
    }));
  }
  function o(a) {
    a.revoked_ && q(3, JSON.stringify(k(a)));
  }
  ma("MapSet", { proxyMap_: e, proxySet_: i });
}
var ht = new ba(), Vl = ht.produce, Yl = ht.produceWithPatches.bind(
  ht
), Zl = ht.setAutoFreeze.bind(ht), Jl = ht.setUseStrictShallowCopy.bind(ht), Ql = ht.applyPatches.bind(ht), Xl = ht.createDraft.bind(ht), tp = ht.finishDraft.bind(ht);
function ep(t) {
  return t;
}
function rp(t) {
  return t;
}
const jd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Immer: ba,
  applyPatches: Ql,
  castDraft: ep,
  castImmutable: rp,
  createDraft: Xl,
  current: Sa,
  enableMapSet: Gl,
  enablePatches: Hl,
  finishDraft: tp,
  freeze: $n,
  immerable: me,
  isDraft: Dt,
  isDraftable: Ot,
  nothing: Cn,
  original: jl,
  produce: Vl,
  produceWithPatches: Yl,
  setAutoFreeze: Zl,
  setUseStrictShallowCopy: Jl
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
var Pr = "delete", R = 5, ft = 1 << R, Q = ft - 1, S = {};
function Oi() {
  return { value: !1 };
}
function gt(t) {
  t && (t.value = !0);
}
function Ki() {
}
function xe(t) {
  return t.size === void 0 && (t.size = t.__iterate(Oa)), t.size;
}
function Yt(t, e) {
  if (typeof e != "number") {
    var r = e >>> 0;
    if ("" + r !== e || r === 4294967295)
      return NaN;
    e = r;
  }
  return e < 0 ? xe(t) + e : e;
}
function Oa() {
  return !0;
}
function Cr(t, e, r) {
  return (t === 0 && !xa(t) || r !== void 0 && t <= -r) && (e === void 0 || r !== void 0 && e >= r);
}
function De(t, e) {
  return Ea(t, e, 0);
}
function $r(t, e) {
  return Ea(t, e, e);
}
function Ea(t, e, r) {
  return t === void 0 ? r : xa(t) ? e === 1 / 0 ? e : Math.max(0, e + t) | 0 : e === void 0 || e === t ? t : Math.min(e, t) | 0;
}
function xa(t) {
  return t < 0 || t === 0 && 1 / t === -1 / 0;
}
var Ma = "@@__IMMUTABLE_ITERABLE__@@";
function st(t) {
  return !!(t && // @ts-expect-error: maybeCollection is typed as `{}`, need to change in 6.0 to `maybeCollection && typeof maybeCollection === 'object' && IS_COLLECTION_SYMBOL in maybeCollection`
  t[Ma]);
}
var vn = "@@__IMMUTABLE_KEYED__@@";
function F(t) {
  return !!(t && // @ts-expect-error: maybeKeyed is typed as `{}`, need to change in 6.0 to `maybeKeyed && typeof maybeKeyed === 'object' && IS_KEYED_SYMBOL in maybeKeyed`
  t[vn]);
}
var mn = "@@__IMMUTABLE_INDEXED__@@";
function ot(t) {
  return !!(t && // @ts-expect-error: maybeIndexed is typed as `{}`, need to change in 6.0 to `maybeIndexed && typeof maybeIndexed === 'object' && IS_INDEXED_SYMBOL in maybeIndexed`
  t[mn]);
}
function Nn(t) {
  return F(t) || ot(t);
}
var U = function(e) {
  return st(e) ? e : V(e);
}, mt = /* @__PURE__ */ function(t) {
  function e(r) {
    return F(r) ? r : ee(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e;
}(U), ue = /* @__PURE__ */ function(t) {
  function e(r) {
    return ot(r) ? r : bt(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e;
}(U), ke = /* @__PURE__ */ function(t) {
  function e(r) {
    return st(r) && !Nn(r) ? r : We(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e;
}(U);
U.Keyed = mt;
U.Indexed = ue;
U.Set = ke;
var Ia = "@@__IMMUTABLE_SEQ__@@";
function Ln(t) {
  return !!(t && // @ts-expect-error: maybeSeq is typed as `{}`, need to change in 6.0 to `maybeSeq && typeof maybeSeq === 'object' && MAYBE_SEQ_SYMBOL in maybeSeq`
  t[Ia]);
}
var Ta = "@@__IMMUTABLE_RECORD__@@";
function te(t) {
  return !!(t && // @ts-expect-error: maybeRecord is typed as `{}`, need to change in 6.0 to `maybeRecord && typeof maybeRecord === 'object' && IS_RECORD_SYMBOL in maybeRecord`
  t[Ta]);
}
function wt(t) {
  return st(t) || te(t);
}
var Zt = "@@__IMMUTABLE_ORDERED__@@";
function At(t) {
  return !!(t && // @ts-expect-error: maybeOrdered is typed as `{}`, need to change in 6.0 to `maybeOrdered && typeof maybeOrdered === 'object' && IS_ORDERED_SYMBOL in maybeOrdered`
  t[Zt]);
}
var Be = 0, lt = 1, pt = 2, Ei = typeof Symbol == "function" && Symbol.iterator, za = "@@iterator", jn = Ei || za, O = function(e) {
  this.next = e;
};
O.prototype.toString = function() {
  return "[Iterator]";
};
O.KEYS = Be;
O.VALUES = lt;
O.ENTRIES = pt;
O.prototype.inspect = O.prototype.toSource = function() {
  return this.toString();
};
O.prototype[jn] = function() {
  return this;
};
function C(t, e, r, n) {
  var i = t === Be ? e : t === lt ? r : [e, r];
  return n ? n.value = i : n = {
    value: i,
    done: !1
  }, n;
}
function G() {
  return { value: void 0, done: !0 };
}
function Hi(t) {
  return Array.isArray(t) ? !0 : !!Dn(t);
}
function Gs(t) {
  return t && typeof t.next == "function";
}
function xi(t) {
  var e = Dn(t);
  return e && e.call(t);
}
function Dn(t) {
  var e = t && (Ei && t[Ei] || t[za]);
  if (typeof e == "function")
    return e;
}
function np(t) {
  var e = Dn(t);
  return e && e === t.entries;
}
function ip(t) {
  var e = Dn(t);
  return e && e === t.keys;
}
var Ue = Object.prototype.hasOwnProperty;
function Gi(t) {
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
var V = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? Yi() : wt(r) ? r.toSeq() : op(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.toSeq = function() {
    return this;
  }, e.prototype.toString = function() {
    return this.__toString("Seq {", "}");
  }, e.prototype.cacheResult = function() {
    return !this._cache && this.__iterateUncached && (this._cache = this.entrySeq().toArray(), this.size = this._cache.length), this;
  }, e.prototype.__iterate = function(n, i) {
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
  }, e.prototype.__iterator = function(n, i) {
    var s = this._cache;
    if (s) {
      var o = s.length, a = 0;
      return new O(function() {
        if (a === o)
          return G();
        var u = s[i ? o - ++a : a++];
        return C(n, u[0], u[1]);
      });
    }
    return this.__iteratorUncached(n, i);
  }, e;
}(U), ee = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? Yi().toKeyedSeq() : st(r) ? F(r) ? r.toSeq() : r.fromEntrySeq() : te(r) ? r.toSeq() : Zi(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.toKeyedSeq = function() {
    return this;
  }, e;
}(V), bt = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? Yi() : st(r) ? F(r) ? r.entrySeq() : r.toIndexedSeq() : te(r) ? r.toSeq().entrySeq() : Ra(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return e(arguments);
  }, e.prototype.toIndexedSeq = function() {
    return this;
  }, e.prototype.toString = function() {
    return this.__toString("Seq [", "]");
  }, e;
}(V), We = /* @__PURE__ */ function(t) {
  function e(r) {
    return (st(r) && !Nn(r) ? r : bt(r)).toSetSeq();
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return e(arguments);
  }, e.prototype.toSetSeq = function() {
    return this;
  }, e;
}(V);
V.isSeq = Ln;
V.Keyed = ee;
V.Set = We;
V.Indexed = bt;
V.prototype[Ia] = !0;
var Me = /* @__PURE__ */ function(t) {
  function e(r) {
    this._array = r, this.size = r.length;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.get = function(n, i) {
    return this.has(n) ? this._array[Yt(this, n)] : i;
  }, e.prototype.__iterate = function(n, i) {
    for (var s = this._array, o = s.length, a = 0; a !== o; ) {
      var u = i ? o - ++a : a++;
      if (n(s[u], u, this) === !1)
        break;
    }
    return a;
  }, e.prototype.__iterator = function(n, i) {
    var s = this._array, o = s.length, a = 0;
    return new O(function() {
      if (a === o)
        return G();
      var u = i ? o - ++a : a++;
      return C(n, u, s[u]);
    });
  }, e;
}(bt), Vi = /* @__PURE__ */ function(t) {
  function e(r) {
    var n = Object.keys(r).concat(
      Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(r) : []
    );
    this._object = r, this._keys = n, this.size = n.length;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.get = function(n, i) {
    return i !== void 0 && !this.has(n) ? i : this._object[n];
  }, e.prototype.has = function(n) {
    return Ue.call(this._object, n);
  }, e.prototype.__iterate = function(n, i) {
    for (var s = this._object, o = this._keys, a = o.length, u = 0; u !== a; ) {
      var f = o[i ? a - ++u : u++];
      if (n(s[f], f, this) === !1)
        break;
    }
    return u;
  }, e.prototype.__iterator = function(n, i) {
    var s = this._object, o = this._keys, a = o.length, u = 0;
    return new O(function() {
      if (u === a)
        return G();
      var f = o[i ? a - ++u : u++];
      return C(n, f, s[f]);
    });
  }, e;
}(ee);
Vi.prototype[Zt] = !0;
var sp = /* @__PURE__ */ function(t) {
  function e(r) {
    this._collection = r, this.size = r.length || r.size;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.__iterateUncached = function(n, i) {
    if (i)
      return this.cacheResult().__iterate(n, i);
    var s = this._collection, o = xi(s), a = 0;
    if (Gs(o))
      for (var u; !(u = o.next()).done && n(u.value, a++, this) !== !1; )
        ;
    return a;
  }, e.prototype.__iteratorUncached = function(n, i) {
    if (i)
      return this.cacheResult().__iterator(n, i);
    var s = this._collection, o = xi(s);
    if (!Gs(o))
      return new O(G);
    var a = 0;
    return new O(function() {
      var u = o.next();
      return u.done ? u : C(n, a++, u.value);
    });
  }, e;
}(bt), Vs;
function Yi() {
  return Vs || (Vs = new Me([]));
}
function Zi(t) {
  var e = Ji(t);
  if (e)
    return e.fromEntrySeq();
  if (typeof t == "object")
    return new Vi(t);
  throw new TypeError(
    "Expected Array or collection object of [k, v] entries, or keyed object: " + t
  );
}
function Ra(t) {
  var e = Ji(t);
  if (e)
    return e;
  throw new TypeError(
    "Expected Array or collection object of values: " + t
  );
}
function op(t) {
  var e = Ji(t);
  if (e)
    return np(t) ? e.fromEntrySeq() : ip(t) ? e.toSetSeq() : e;
  if (typeof t == "object")
    return new Vi(t);
  throw new TypeError(
    "Expected Array or collection object of values, or keyed object: " + t
  );
}
function Ji(t) {
  return Gi(t) ? new Me(t) : Hi(t) ? new sp(t) : void 0;
}
var Fa = "@@__IMMUTABLE_MAP__@@";
function kn(t) {
  return !!(t && // @ts-expect-error: maybeMap is typed as `{}`, need to change in 6.0 to `maybeMap && typeof maybeMap === 'object' && IS_MAP_SYMBOL in maybeMap`
  t[Fa]);
}
function Qi(t) {
  return kn(t) && At(t);
}
function Mi(t) {
  return !!(t && // @ts-expect-error: maybeValue is typed as `{}`
  typeof t.equals == "function" && // @ts-expect-error: maybeValue is typed as `{}`
  typeof t.hashCode == "function");
}
function B(t, e) {
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
  return !!(Mi(t) && Mi(e) && t.equals(e));
}
var Je = typeof Math.imul == "function" && Math.imul(4294967295, 2) === -2 ? Math.imul : function(e, r) {
  e |= 0, r |= 0;
  var n = e & 65535, i = r & 65535;
  return n * i + ((e >>> 16) * i + n * (r >>> 16) << 16 >>> 0) | 0;
};
function Bn(t) {
  return t >>> 1 & 1073741824 | t & 3221225471;
}
var ap = Object.prototype.valueOf;
function nt(t) {
  if (t == null)
    return Ys(t);
  if (typeof t.hashCode == "function")
    return Bn(t.hashCode(t));
  var e = pp(t);
  if (e == null)
    return Ys(e);
  switch (typeof e) {
    case "boolean":
      return e ? 1108378657 : 1108378656;
    case "number":
      return up(e);
    case "string":
      return e.length > _p ? fp(e) : Ii(e);
    case "object":
    case "function":
      return hp(e);
    case "symbol":
      return cp(e);
    default:
      if (typeof e.toString == "function")
        return Ii(e.toString());
      throw new Error("Value type " + typeof e + " cannot be hashed.");
  }
}
function Ys(t) {
  return t === null ? 1108378658 : (
    /* undefined */
    1108378659
  );
}
function up(t) {
  if (t !== t || t === 1 / 0)
    return 0;
  var e = t | 0;
  for (e !== t && (e ^= t * 4294967295); t > 4294967295; )
    t /= 4294967295, e ^= t;
  return Bn(e);
}
function fp(t) {
  var e = ci[t];
  return e === void 0 && (e = Ii(t), fi === dp && (fi = 0, ci = {}), fi++, ci[t] = e), e;
}
function Ii(t) {
  for (var e = 0, r = 0; r < t.length; r++)
    e = 31 * e + t.charCodeAt(r) | 0;
  return Bn(e);
}
function cp(t) {
  var e = Qs[t];
  return e !== void 0 || (e = Pa(), Qs[t] = e), e;
}
function hp(t) {
  var e;
  if (Ti && (e = zi.get(t), e !== void 0) || (e = t[ie], e !== void 0) || !Js && (e = t.propertyIsEnumerable && t.propertyIsEnumerable[ie], e !== void 0 || (e = lp(t), e !== void 0)))
    return e;
  if (e = Pa(), Ti)
    zi.set(t, e);
  else {
    if (Zs !== void 0 && Zs(t) === !1)
      throw new Error("Non-extensible objects are not allowed as keys.");
    if (Js)
      Object.defineProperty(t, ie, {
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
      }, t.propertyIsEnumerable[ie] = e;
    else if (t.nodeType !== void 0)
      t[ie] = e;
    else
      throw new Error("Unable to set a non-enumerable property on object.");
  }
  return e;
}
var Zs = Object.isExtensible, Js = function() {
  try {
    return Object.defineProperty({}, "@", {}), !0;
  } catch {
    return !1;
  }
}();
function lp(t) {
  if (t && t.nodeType > 0)
    switch (t.nodeType) {
      case 1:
        return t.uniqueID;
      case 9:
        return t.documentElement && t.documentElement.uniqueID;
    }
}
function pp(t) {
  return t.valueOf !== ap && typeof t.valueOf == "function" ? t.valueOf(t) : t;
}
function Pa() {
  var t = ++ui;
  return ui & 1073741824 && (ui = 0), t;
}
var Ti = typeof WeakMap == "function", zi;
Ti && (zi = /* @__PURE__ */ new WeakMap());
var Qs = /* @__PURE__ */ Object.create(null), ui = 0, ie = "__immutablehash__";
typeof Symbol == "function" && (ie = Symbol(ie));
var _p = 16, dp = 255, fi = 0, ci = {}, Un = /* @__PURE__ */ function(t) {
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
    var n = this, i = Xi(this, !0);
    return this._useKeys || (i.valueSeq = function() {
      return n._iter.toSeq().reverse();
    }), i;
  }, e.prototype.map = function(n, i) {
    var s = this, o = La(this, n, i);
    return this._useKeys || (o.valueSeq = function() {
      return s._iter.toSeq().map(n, i);
    }), o;
  }, e.prototype.__iterate = function(n, i) {
    var s = this;
    return this._iter.__iterate(function(o, a) {
      return n(o, a, s);
    }, i);
  }, e.prototype.__iterator = function(n, i) {
    return this._iter.__iterator(n, i);
  }, e;
}(ee);
Un.prototype[Zt] = !0;
var Ca = /* @__PURE__ */ function(t) {
  function e(r) {
    this._iter = r, this.size = r.size;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.includes = function(n) {
    return this._iter.includes(n);
  }, e.prototype.__iterate = function(n, i) {
    var s = this, o = 0;
    return i && xe(this), this._iter.__iterate(
      function(a) {
        return n(a, i ? s.size - ++o : o++, s);
      },
      i
    );
  }, e.prototype.__iterator = function(n, i) {
    var s = this, o = this._iter.__iterator(lt, i), a = 0;
    return i && xe(this), new O(function() {
      var u = o.next();
      return u.done ? u : C(
        n,
        i ? s.size - ++a : a++,
        u.value,
        u
      );
    });
  }, e;
}(bt), $a = /* @__PURE__ */ function(t) {
  function e(r) {
    this._iter = r, this.size = r.size;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.has = function(n) {
    return this._iter.includes(n);
  }, e.prototype.__iterate = function(n, i) {
    var s = this;
    return this._iter.__iterate(function(o) {
      return n(o, o, s);
    }, i);
  }, e.prototype.__iterator = function(n, i) {
    var s = this._iter.__iterator(lt, i);
    return new O(function() {
      var o = s.next();
      return o.done ? o : C(n, o.value, o.value, o);
    });
  }, e;
}(We), qa = /* @__PURE__ */ function(t) {
  function e(r) {
    this._iter = r, this.size = r.size;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.entrySeq = function() {
    return this._iter.toSeq();
  }, e.prototype.__iterate = function(n, i) {
    var s = this;
    return this._iter.__iterate(function(o) {
      if (o) {
        to(o);
        var a = st(o);
        return n(
          a ? o.get(1) : o[1],
          a ? o.get(0) : o[0],
          s
        );
      }
    }, i);
  }, e.prototype.__iterator = function(n, i) {
    var s = this._iter.__iterator(lt, i);
    return new O(function() {
      for (; ; ) {
        var o = s.next();
        if (o.done)
          return o;
        var a = o.value;
        if (a) {
          to(a);
          var u = st(a);
          return C(
            n,
            u ? a.get(0) : a[0],
            u ? a.get(1) : a[1],
            o
          );
        }
      }
    });
  }, e;
}(ee);
Ca.prototype.cacheResult = Un.prototype.cacheResult = $a.prototype.cacheResult = qa.prototype.cacheResult = rs;
function Na(t) {
  var e = Ft(t);
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
  }, e.cacheResult = rs, e.__iterateUncached = function(r, n) {
    var i = this;
    return t.__iterate(function(s, o) {
      return r(o, s, i) !== !1;
    }, n);
  }, e.__iteratorUncached = function(r, n) {
    if (r === pt) {
      var i = t.__iterator(r, n);
      return new O(function() {
        var s = i.next();
        if (!s.done) {
          var o = s.value[0];
          s.value[0] = s.value[1], s.value[1] = o;
        }
        return s;
      });
    }
    return t.__iterator(
      r === lt ? Be : lt,
      n
    );
  }, e;
}
function La(t, e, r) {
  var n = Ft(t);
  return n.size = t.size, n.has = function(i) {
    return t.has(i);
  }, n.get = function(i, s) {
    var o = t.get(i, S);
    return o === S ? s : e.call(r, o, i, t);
  }, n.__iterateUncached = function(i, s) {
    var o = this;
    return t.__iterate(
      function(a, u, f) {
        return i(e.call(r, a, u, f), u, o) !== !1;
      },
      s
    );
  }, n.__iteratorUncached = function(i, s) {
    var o = t.__iterator(pt, s);
    return new O(function() {
      var a = o.next();
      if (a.done)
        return a;
      var u = a.value, f = u[0];
      return C(
        i,
        f,
        e.call(r, u[1], f, t),
        a
      );
    });
  }, n;
}
function Xi(t, e) {
  var r = this, n = Ft(t);
  return n._iter = t, n.size = t.size, n.reverse = function() {
    return t;
  }, t.flip && (n.flip = function() {
    var i = Na(t);
    return i.reverse = function() {
      return t.flip();
    }, i;
  }), n.get = function(i, s) {
    return t.get(e ? i : -1 - i, s);
  }, n.has = function(i) {
    return t.has(e ? i : -1 - i);
  }, n.includes = function(i) {
    return t.includes(i);
  }, n.cacheResult = rs, n.__iterate = function(i, s) {
    var o = this, a = 0;
    return s && xe(t), t.__iterate(
      function(u, f) {
        return i(u, e ? f : s ? o.size - ++a : a++, o);
      },
      !s
    );
  }, n.__iterator = function(i, s) {
    var o = 0;
    s && xe(t);
    var a = t.__iterator(pt, !s);
    return new O(function() {
      var u = a.next();
      if (u.done)
        return u;
      var f = u.value;
      return C(
        i,
        e ? f[0] : s ? r.size - ++o : o++,
        f[1],
        u
      );
    });
  }, n;
}
function ja(t, e, r, n) {
  var i = Ft(t);
  return n && (i.has = function(s) {
    var o = t.get(s, S);
    return o !== S && !!e.call(r, o, s, t);
  }, i.get = function(s, o) {
    var a = t.get(s, S);
    return a !== S && e.call(r, a, s, t) ? a : o;
  }), i.__iterateUncached = function(s, o) {
    var a = this, u = 0;
    return t.__iterate(function(f, c, h) {
      if (e.call(r, f, c, h))
        return u++, s(f, n ? c : u - 1, a);
    }, o), u;
  }, i.__iteratorUncached = function(s, o) {
    var a = t.__iterator(pt, o), u = 0;
    return new O(function() {
      for (; ; ) {
        var f = a.next();
        if (f.done)
          return f;
        var c = f.value, h = c[0], l = c[1];
        if (e.call(r, l, h, t))
          return C(s, n ? h : u++, l, f);
      }
    });
  }, i;
}
function yp(t, e, r) {
  var n = ce().asMutable();
  return t.__iterate(function(i, s) {
    n.update(e.call(r, i, s, t), 0, function(o) {
      return o + 1;
    });
  }), n.asImmutable();
}
function gp(t, e, r) {
  var n = F(t), i = (At(t) ? Rt() : ce()).asMutable();
  t.__iterate(function(o, a) {
    i.update(
      e.call(r, o, a, t),
      function(u) {
        return u = u || [], u.push(n ? [a, o] : o), u;
      }
    );
  });
  var s = es(t);
  return i.map(function(o) {
    return z(t, s(o));
  }).asImmutable();
}
function vp(t, e, r) {
  var n = F(t), i = [[], []];
  t.__iterate(function(o, a) {
    i[e.call(r, o, a, t) ? 1 : 0].push(
      n ? [a, o] : o
    );
  });
  var s = es(t);
  return i.map(function(o) {
    return z(t, s(o));
  });
}
function ts(t, e, r, n) {
  var i = t.size;
  if (Cr(e, r, i))
    return t;
  if (typeof i > "u" && (e < 0 || r < 0))
    return ts(t.toSeq().cacheResult(), e, r, n);
  var s = De(e, i), o = $r(r, i), a = o - s, u;
  a === a && (u = a < 0 ? 0 : a);
  var f = Ft(t);
  return f.size = u === 0 ? u : t.size && u || void 0, !n && Ln(t) && u >= 0 && (f.get = function(c, h) {
    return c = Yt(this, c), c >= 0 && c < u ? t.get(c + s, h) : h;
  }), f.__iterateUncached = function(c, h) {
    var l = this;
    if (u === 0)
      return 0;
    if (h)
      return this.cacheResult().__iterate(c, h);
    var p = 0, _ = !0, d = 0;
    return t.__iterate(function(y, m) {
      if (!(_ && (_ = p++ < s)))
        return d++, c(y, n ? m : d - 1, l) !== !1 && d !== u;
    }), d;
  }, f.__iteratorUncached = function(c, h) {
    if (u !== 0 && h)
      return this.cacheResult().__iterator(c, h);
    if (u === 0)
      return new O(G);
    var l = t.__iterator(c, h), p = 0, _ = 0;
    return new O(function() {
      for (; p++ < s; )
        l.next();
      if (++_ > u)
        return G();
      var d = l.next();
      return n || c === lt || d.done ? d : c === Be ? C(c, _ - 1, void 0, d) : C(c, _ - 1, d.value[1], d);
    });
  }, f;
}
function mp(t, e, r) {
  var n = Ft(t);
  return n.__iterateUncached = function(i, s) {
    var o = this;
    if (s)
      return this.cacheResult().__iterate(i, s);
    var a = 0;
    return t.__iterate(
      function(u, f, c) {
        return e.call(r, u, f, c) && ++a && i(u, f, o);
      }
    ), a;
  }, n.__iteratorUncached = function(i, s) {
    var o = this;
    if (s)
      return this.cacheResult().__iterator(i, s);
    var a = t.__iterator(pt, s), u = !0;
    return new O(function() {
      if (!u)
        return G();
      var f = a.next();
      if (f.done)
        return f;
      var c = f.value, h = c[0], l = c[1];
      return e.call(r, l, h, o) ? i === pt ? f : C(i, h, l, f) : (u = !1, G());
    });
  }, n;
}
function Da(t, e, r, n) {
  var i = Ft(t);
  return i.__iterateUncached = function(s, o) {
    var a = this;
    if (o)
      return this.cacheResult().__iterate(s, o);
    var u = !0, f = 0;
    return t.__iterate(function(c, h, l) {
      if (!(u && (u = e.call(r, c, h, l))))
        return f++, s(c, n ? h : f - 1, a);
    }), f;
  }, i.__iteratorUncached = function(s, o) {
    var a = this;
    if (o)
      return this.cacheResult().__iterator(s, o);
    var u = t.__iterator(pt, o), f = !0, c = 0;
    return new O(function() {
      var h, l, p;
      do {
        if (h = u.next(), h.done)
          return n || s === lt ? h : s === Be ? C(s, c++, void 0, h) : C(s, c++, h.value[1], h);
        var _ = h.value;
        l = _[0], p = _[1], f && (f = e.call(r, p, l, a));
      } while (f);
      return s === pt ? h : C(s, l, p, h);
    });
  }, i;
}
var wp = /* @__PURE__ */ function(t) {
  function e(r) {
    this._wrappedIterables = r.flatMap(function(n) {
      return n._wrappedIterables ? n._wrappedIterables : [n];
    }), this.size = this._wrappedIterables.reduce(function(n, i) {
      if (n !== void 0) {
        var s = i.size;
        if (s !== void 0)
          return n + s;
      }
    }, 0), this[vn] = this._wrappedIterables[0][vn], this[mn] = this._wrappedIterables[0][mn], this[Zt] = this._wrappedIterables[0][Zt];
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.__iterateUncached = function(n, i) {
    if (this._wrappedIterables.length !== 0) {
      if (i)
        return this.cacheResult().__iterate(n, i);
      for (var s = 0, o = F(this), a = o ? pt : lt, u = this._wrappedIterables[s].__iterator(
        a,
        i
      ), f = !0, c = 0; f; ) {
        for (var h = u.next(); h.done; ) {
          if (s++, s === this._wrappedIterables.length)
            return c;
          u = this._wrappedIterables[s].__iterator(
            a,
            i
          ), h = u.next();
        }
        var l = o ? n(h.value[1], h.value[0], this) : n(h.value, c, this);
        f = l !== !1, c++;
      }
      return c;
    }
  }, e.prototype.__iteratorUncached = function(n, i) {
    var s = this;
    if (this._wrappedIterables.length === 0)
      return new O(G);
    if (i)
      return this.cacheResult().__iterator(n, i);
    var o = 0, a = this._wrappedIterables[o].__iterator(
      n,
      i
    );
    return new O(function() {
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
  }, e;
}(V);
function bp(t, e) {
  var r = F(t), n = [t].concat(e).map(function(s) {
    return st(s) ? r && (s = mt(s)) : s = r ? Zi(s) : Ra(Array.isArray(s) ? s : [s]), s;
  }).filter(function(s) {
    return s.size !== 0;
  });
  if (n.length === 0)
    return t;
  if (n.length === 1) {
    var i = n[0];
    if (i === t || r && F(i) || ot(t) && ot(i))
      return i;
  }
  return new wp(n);
}
function ka(t, e, r) {
  var n = Ft(t);
  return n.__iterateUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterate(i, s);
    var o = 0, a = !1;
    function u(f, c) {
      f.__iterate(function(h, l) {
        return (!e || c < e) && st(h) ? u(h, c + 1) : (o++, i(h, r ? l : o - 1, n) === !1 && (a = !0)), !a;
      }, s);
    }
    return u(t, 0), o;
  }, n.__iteratorUncached = function(i, s) {
    if (s)
      return this.cacheResult().__iterator(i, s);
    var o = t.__iterator(i, s), a = [], u = 0;
    return new O(function() {
      for (; o; ) {
        var f = o.next();
        if (f.done !== !1) {
          o = a.pop();
          continue;
        }
        var c = f.value;
        if (i === pt && (c = c[1]), (!e || a.length < e) && st(c))
          a.push(o), o = c.__iterator(i, s);
        else
          return r ? f : C(i, u++, c, f);
      }
      return G();
    });
  }, n;
}
function Sp(t, e, r) {
  var n = es(t);
  return t.toSeq().map(function(i, s) {
    return n(e.call(r, i, s, t));
  }).flatten(!0);
}
function Ap(t, e) {
  var r = Ft(t);
  return r.size = t.size && t.size * 2 - 1, r.__iterateUncached = function(n, i) {
    var s = this, o = 0;
    return t.__iterate(
      function(a) {
        return (!o || n(e, o++, s) !== !1) && n(a, o++, s) !== !1;
      },
      i
    ), o;
  }, r.__iteratorUncached = function(n, i) {
    var s = t.__iterator(lt, i), o = 0, a;
    return new O(function() {
      return (!a || o % 2) && (a = s.next(), a.done) ? a : o % 2 ? C(n, o++, e) : C(n, o++, a.value, a);
    });
  }, r;
}
function Ie(t, e, r) {
  e || (e = Ba);
  var n = F(t), i = 0, s = t.toSeq().map(function(o, a) {
    return [a, o, i++, r ? r(o, a, t) : o];
  }).valueSeq().toArray();
  return s.sort(function(o, a) {
    return e(o[3], a[3]) || o[2] - a[2];
  }).forEach(
    n ? function(o, a) {
      s[a].length = 2;
    } : function(o, a) {
      s[a] = o[1];
    }
  ), n ? ee(s) : ot(t) ? bt(s) : We(s);
}
function Xr(t, e, r) {
  if (e || (e = Ba), r) {
    var n = t.toSeq().map(function(i, s) {
      return [i, r(i, s, t)];
    }).reduce(function(i, s) {
      return Xs(e, i[1], s[1]) ? s : i;
    });
    return n && n[0];
  }
  return t.reduce(function(i, s) {
    return Xs(e, i, s) ? s : i;
  });
}
function Xs(t, e, r) {
  var n = t(r, e);
  return n === 0 && r !== e && (r == null || r !== r) || n > 0;
}
function tn(t, e, r, n) {
  var i = Ft(t), s = new Me(r).map(function(o) {
    return o.size;
  });
  return i.size = n ? s.max() : s.min(), i.__iterate = function(o, a) {
    for (var u = this.__iterator(lt, a), f, c = 0; !(f = u.next()).done && o(f.value, c++, this) !== !1; )
      ;
    return c;
  }, i.__iteratorUncached = function(o, a) {
    var u = r.map(
      function(h) {
        return h = U(h), xi(a ? h.reverse() : h);
      }
    ), f = 0, c = !1;
    return new O(function() {
      var h;
      return c || (h = u.map(function(l) {
        return l.next();
      }), c = n ? h.every(function(l) {
        return l.done;
      }) : h.some(function(l) {
        return l.done;
      })), c ? G() : C(
        o,
        f++,
        e.apply(
          null,
          h.map(function(l) {
            return l.value;
          })
        )
      );
    });
  }, i;
}
function z(t, e) {
  return t === e ? t : Ln(t) ? e : t.constructor(e);
}
function to(t) {
  if (t !== Object(t))
    throw new TypeError("Expected [K, V] tuple: " + t);
}
function es(t) {
  return F(t) ? mt : ot(t) ? ue : ke;
}
function Ft(t) {
  return Object.create(
    (F(t) ? ee : ot(t) ? bt : We).prototype
  );
}
function rs() {
  return this._iter.cacheResult ? (this._iter.cacheResult(), this.size = this._iter.size, this) : V.prototype.cacheResult.call(this);
}
function Ba(t, e) {
  return t === void 0 && e === void 0 ? 0 : t === void 0 ? 1 : e === void 0 ? -1 : t > e ? 1 : t < e ? -1 : 0;
}
function It(t, e) {
  e = e || 0;
  for (var r = Math.max(0, t.length - e), n = new Array(r), i = 0; i < r; i++)
    n[i] = t[i + e];
  return n;
}
function ir(t, e) {
  if (!t)
    throw new Error(e);
}
function ut(t) {
  ir(t !== 1 / 0, "Cannot perform this action with an infinite size.");
}
function Ua(t) {
  if (Gi(t) && typeof t != "string")
    return t;
  if (At(t))
    return t.toArray();
  throw new TypeError("Invalid keyPath: expected Ordered Collection or Array: " + t);
}
var Op = Object.prototype.toString;
function ns(t) {
  if (!t || typeof t != "object" || Op.call(t) !== "[object Object]")
    return !1;
  var e = Object.getPrototypeOf(t);
  if (e === null)
    return !0;
  for (var r = e, n = Object.getPrototypeOf(e); n !== null; )
    r = n, n = Object.getPrototypeOf(r);
  return r === e;
}
function Jt(t) {
  return typeof t == "object" && (wt(t) || Array.isArray(t) || ns(t));
}
function gr(t) {
  try {
    return typeof t == "string" ? JSON.stringify(t) : String(t);
  } catch {
    return JSON.stringify(t);
  }
}
function Wa(t, e) {
  return wt(t) ? (
    // @ts-expect-error key might be a number or symbol, which is not handled be Record key type
    t.has(e)
  ) : (
    // @ts-expect-error key might be anything else than PropertyKey, and will return false in that case but runtime is OK
    Jt(t) && Ue.call(t, e)
  );
}
function is(t, e, r) {
  return wt(t) ? t.get(e, r) : Wa(t, e) ? (
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
function wn(t) {
  if (Array.isArray(t))
    return It(t);
  var e = {};
  for (var r in t)
    Ue.call(t, r) && (e[r] = t[r]);
  return e;
}
function Ka(t, e) {
  if (!Jt(t))
    throw new TypeError("Cannot update non-data-structure value: " + t);
  if (wt(t)) {
    if (!t.remove)
      throw new TypeError("Cannot update immutable value without .remove() method: " + t);
    return t.remove(e);
  }
  if (!Ue.call(t, e))
    return t;
  var r = wn(t);
  return Array.isArray(r) ? r.splice(e, 1) : delete r[e], r;
}
function Ha(t, e, r) {
  if (!Jt(t))
    throw new TypeError("Cannot update non-data-structure value: " + t);
  if (wt(t)) {
    if (!t.set)
      throw new TypeError("Cannot update immutable value without .set() method: " + t);
    return t.set(e, r);
  }
  if (Ue.call(t, e) && r === t[e])
    return t;
  var n = wn(t);
  return n[e] = r, n;
}
function fe(t, e, r, n) {
  n || (n = r, r = void 0);
  var i = Ga(
    wt(t),
    // @ts-expect-error type issues with Record and mixed types
    t,
    Ua(e),
    0,
    r,
    n
  );
  return i === S ? r : i;
}
function Ga(t, e, r, n, i, s) {
  var o = e === S;
  if (n === r.length) {
    var a = o ? i : e, u = s(a);
    return u === a ? e : u;
  }
  if (!o && !Jt(e))
    throw new TypeError("Cannot update within non-data-structure value in path [" + Array.from(r).slice(0, n).map(gr) + "]: " + e);
  var f = r[n], c = o ? S : is(e, f, S), h = Ga(
    c === S ? t : wt(c),
    // @ts-expect-error mixed type
    c,
    r,
    n + 1,
    i,
    s
  );
  return h === c ? e : h === S ? Ka(e, f) : Ha(o ? t ? Tt() : {} : e, f, h);
}
function Va(t, e, r) {
  return fe(t, e, S, function() {
    return r;
  });
}
function ss(t, e) {
  return Va(this, t, e);
}
function Ya(t, e) {
  return fe(t, e, function() {
    return S;
  });
}
function os(t) {
  return Ya(this, t);
}
function as(t, e, r, n) {
  return fe(
    // @ts-expect-error Index signature for type string is missing in type V[]
    t,
    [e],
    r,
    n
  );
}
function us(t, e, r) {
  return arguments.length === 1 ? t(this) : as(this, t, e, r);
}
function fs(t, e, r) {
  return fe(this, t, e, r);
}
function Za() {
  for (var t = [], e = arguments.length; e--; ) t[e] = arguments[e];
  return Qa(this, t);
}
function Ja(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  if (typeof t != "function")
    throw new TypeError("Invalid merger function: " + t);
  return Qa(this, e, t);
}
function Qa(t, e, r) {
  for (var n = [], i = 0; i < e.length; i++) {
    var s = mt(e[i]);
    s.size !== 0 && n.push(s);
  }
  return n.length === 0 ? t : t.toSeq().size === 0 && !t.__ownerID && n.length === 1 ? te(t) ? t : t.constructor(n[0]) : t.withMutations(function(o) {
    for (var a = r ? function(f, c) {
      as(
        o,
        c,
        S,
        function(h) {
          return h === S ? f : r(h, f, c);
        }
      );
    } : function(f, c) {
      o.set(c, f);
    }, u = 0; u < n.length; u++)
      n[u].forEach(a);
  });
}
function Ep(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  return Nr(t, e);
}
function xp(t, e) {
  for (var r = [], n = arguments.length - 2; n-- > 0; ) r[n] = arguments[n + 2];
  return Nr(e, r, t);
}
function Mp(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  return qr(t, e);
}
function Ip(t, e) {
  for (var r = [], n = arguments.length - 2; n-- > 0; ) r[n] = arguments[n + 2];
  return qr(e, r, t);
}
function qr(t, e, r) {
  return Nr(t, e, Tp(r));
}
function Nr(t, e, r) {
  if (!Jt(t))
    throw new TypeError(
      "Cannot merge into non-data-structure value: " + t
    );
  if (wt(t))
    return typeof r == "function" && t.mergeWith ? t.mergeWith.apply(t, [r].concat(e)) : t.merge ? t.merge.apply(t, e) : t.concat.apply(t, e);
  for (var n = Array.isArray(t), i = t, s = n ? ue : mt, o = n ? function(u) {
    i === t && (i = wn(i)), i.push(u);
  } : function(u, f) {
    var c = Ue.call(i, f), h = c && r ? r(i[f], u, f) : u;
    (!c || h !== i[f]) && (i === t && (i = wn(i)), i[f] = h);
  }, a = 0; a < e.length; a++)
    s(e[a]).forEach(o);
  return i;
}
function Tp(t) {
  function e(r, n, i) {
    return Jt(r) && Jt(n) && zp(r, n) ? Nr(r, [n], e) : t ? t(r, n, i) : n;
  }
  return e;
}
function zp(t, e) {
  var r = V(t), n = V(e);
  return ot(r) === ot(n) && F(r) === F(n);
}
function Xa() {
  for (var t = [], e = arguments.length; e--; ) t[e] = arguments[e];
  return qr(this, t);
}
function tu(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  return qr(this, e, t);
}
function cs(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  return fe(this, t, Tt(), function(n) {
    return Nr(n, e);
  });
}
function hs(t) {
  for (var e = [], r = arguments.length - 1; r-- > 0; ) e[r] = arguments[r + 1];
  return fe(
    this,
    t,
    Tt(),
    function(n) {
      return qr(n, e);
    }
  );
}
function Lr(t) {
  var e = this.asMutable();
  return t(e), e.wasAltered() ? e.__ensureOwner(this.__ownerID) : this;
}
function jr() {
  return this.__ownerID ? this : this.__ensureOwner(new Ki());
}
function Dr() {
  return this.__ensureOwner();
}
function ls() {
  return this.__altered;
}
var ce = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? Tt() : kn(r) && !At(r) ? r : Tt().withMutations(function(n) {
      var i = t(r);
      ut(i.size), i.forEach(function(s, o) {
        return n.set(o, s);
      });
    });
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.toString = function() {
    return this.__toString("Map {", "}");
  }, e.prototype.get = function(n, i) {
    return this._root ? this._root.get(0, void 0, n, i) : i;
  }, e.prototype.set = function(n, i) {
    return no(this, n, i);
  }, e.prototype.remove = function(n) {
    return no(this, n, S);
  }, e.prototype.deleteAll = function(n) {
    var i = U(n);
    return i.size === 0 ? this : this.withMutations(function(s) {
      i.forEach(function(o) {
        return s.remove(o);
      });
    });
  }, e.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._root = null, this.__hash = void 0, this.__altered = !0, this) : Tt();
  }, e.prototype.sort = function(n) {
    return Rt(Ie(this, n));
  }, e.prototype.sortBy = function(n, i) {
    return Rt(Ie(this, i, n));
  }, e.prototype.map = function(n, i) {
    var s = this;
    return this.withMutations(function(o) {
      o.forEach(function(a, u) {
        o.set(u, n.call(i, a, u, s));
      });
    });
  }, e.prototype.__iterator = function(n, i) {
    return new Rp(this, n, i);
  }, e.prototype.__iterate = function(n, i) {
    var s = this, o = 0;
    return this._root && this._root.iterate(function(a) {
      return o++, n(a[1], a[0], s);
    }, i), o;
  }, e.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? ps(this.size, this._root, n, this.__hash) : this.size === 0 ? Tt() : (this.__ownerID = n, this.__altered = !1, this);
  }, e;
}(mt);
ce.isMap = kn;
var $ = ce.prototype;
$[Fa] = !0;
$[Pr] = $.remove;
$.removeAll = $.deleteAll;
$.setIn = ss;
$.removeIn = $.deleteIn = os;
$.update = us;
$.updateIn = fs;
$.merge = $.concat = Za;
$.mergeWith = Ja;
$.mergeDeep = Xa;
$.mergeDeepWith = tu;
$.mergeIn = cs;
$.mergeDeepIn = hs;
$.withMutations = Lr;
$.wasAltered = ls;
$.asImmutable = Dr;
$["@@transducer/init"] = $.asMutable = jr;
$["@@transducer/step"] = function(t, e) {
  return t.set(e[0], e[1]);
};
$["@@transducer/result"] = function(t) {
  return t.asImmutable();
};
var vr = function(e, r) {
  this.ownerID = e, this.entries = r;
};
vr.prototype.get = function(e, r, n, i) {
  for (var s = this.entries, o = 0, a = s.length; o < a; o++)
    if (B(n, s[o][0]))
      return s[o][1];
  return i;
};
vr.prototype.update = function(e, r, n, i, s, o, a) {
  for (var u = s === S, f = this.entries, c = 0, h = f.length; c < h && !B(i, f[c][0]); c++)
    ;
  var l = c < h;
  if (l ? f[c][1] === s : u)
    return this;
  if (gt(a), (u || !l) && gt(o), !(u && f.length === 1)) {
    if (!l && !u && f.length >= Np)
      return Fp(e, f, i, s);
    var p = e && e === this.ownerID, _ = p ? f : It(f);
    return l ? u ? c === h - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, s] : _.push([i, s]), p ? (this.entries = _, this) : new vr(e, _);
  }
};
var Te = function(e, r, n) {
  this.ownerID = e, this.bitmap = r, this.nodes = n;
};
Te.prototype.get = function(e, r, n, i) {
  r === void 0 && (r = nt(n));
  var s = 1 << ((e === 0 ? r : r >>> e) & Q), o = this.bitmap;
  return (o & s) === 0 ? i : this.nodes[eu(o & s - 1)].get(
    e + R,
    r,
    n,
    i
  );
};
Te.prototype.update = function(e, r, n, i, s, o, a) {
  n === void 0 && (n = nt(i));
  var u = (r === 0 ? n : n >>> r) & Q, f = 1 << u, c = this.bitmap, h = (c & f) !== 0;
  if (!h && s === S)
    return this;
  var l = eu(c & f - 1), p = this.nodes, _ = h ? p[l] : void 0, d = _s(
    _,
    e,
    r + R,
    n,
    i,
    s,
    o,
    a
  );
  if (d === _)
    return this;
  if (!h && d && p.length >= Lp)
    return Cp(e, p, c, u, d);
  if (h && !d && p.length === 2 && io(p[l ^ 1]))
    return p[l ^ 1];
  if (h && d && p.length === 1 && io(d))
    return d;
  var y = e && e === this.ownerID, m = h ? d ? c : c ^ f : c | f, v = h ? d ? ru(p, l, d, y) : qp(p, l, y) : $p(p, l, d, y);
  return y ? (this.bitmap = m, this.nodes = v, this) : new Te(e, m, v);
};
var mr = function(e, r, n) {
  this.ownerID = e, this.count = r, this.nodes = n;
};
mr.prototype.get = function(e, r, n, i) {
  r === void 0 && (r = nt(n));
  var s = (e === 0 ? r : r >>> e) & Q, o = this.nodes[s];
  return o ? o.get(e + R, r, n, i) : i;
};
mr.prototype.update = function(e, r, n, i, s, o, a) {
  n === void 0 && (n = nt(i));
  var u = (r === 0 ? n : n >>> r) & Q, f = s === S, c = this.nodes, h = c[u];
  if (f && !h)
    return this;
  var l = _s(
    h,
    e,
    r + R,
    n,
    i,
    s,
    o,
    a
  );
  if (l === h)
    return this;
  var p = this.count;
  if (!h)
    p++;
  else if (!l && (p--, p < jp))
    return Pp(e, c, p, u);
  var _ = e && e === this.ownerID, d = ru(c, u, l, _);
  return _ ? (this.count = p, this.nodes = d, this) : new mr(e, p, d);
};
var ze = function(e, r, n) {
  this.ownerID = e, this.keyHash = r, this.entries = n;
};
ze.prototype.get = function(e, r, n, i) {
  for (var s = this.entries, o = 0, a = s.length; o < a; o++)
    if (B(n, s[o][0]))
      return s[o][1];
  return i;
};
ze.prototype.update = function(e, r, n, i, s, o, a) {
  n === void 0 && (n = nt(i));
  var u = s === S;
  if (n !== this.keyHash)
    return u ? this : (gt(a), gt(o), ds(this, e, r, n, [i, s]));
  for (var f = this.entries, c = 0, h = f.length; c < h && !B(i, f[c][0]); c++)
    ;
  var l = c < h;
  if (l ? f[c][1] === s : u)
    return this;
  if (gt(a), (u || !l) && gt(o), u && h === 2)
    return new kt(e, this.keyHash, f[c ^ 1]);
  var p = e && e === this.ownerID, _ = p ? f : It(f);
  return l ? u ? c === h - 1 ? _.pop() : _[c] = _.pop() : _[c] = [i, s] : _.push([i, s]), p ? (this.entries = _, this) : new ze(e, this.keyHash, _);
};
var kt = function(e, r, n) {
  this.ownerID = e, this.keyHash = r, this.entry = n;
};
kt.prototype.get = function(e, r, n, i) {
  return B(n, this.entry[0]) ? this.entry[1] : i;
};
kt.prototype.update = function(e, r, n, i, s, o, a) {
  var u = s === S, f = B(i, this.entry[0]);
  if (f ? s === this.entry[1] : u)
    return this;
  if (gt(a), u) {
    gt(o);
    return;
  }
  return f ? e && e === this.ownerID ? (this.entry[1] = s, this) : new kt(e, this.keyHash, [i, s]) : (gt(o), ds(this, e, r, nt(i), [i, s]));
};
vr.prototype.iterate = ze.prototype.iterate = function(t, e) {
  for (var r = this.entries, n = 0, i = r.length - 1; n <= i; n++)
    if (t(r[e ? i - n : n]) === !1)
      return !1;
};
Te.prototype.iterate = mr.prototype.iterate = function(t, e) {
  for (var r = this.nodes, n = 0, i = r.length - 1; n <= i; n++) {
    var s = r[e ? i - n : n];
    if (s && s.iterate(t, e) === !1)
      return !1;
  }
};
kt.prototype.iterate = function(t, e) {
  return t(this.entry);
};
var Rp = /* @__PURE__ */ function(t) {
  function e(r, n, i) {
    this._type = n, this._reverse = i, this._stack = r._root && eo(r._root);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.next = function() {
    for (var n = this._type, i = this._stack; i; ) {
      var s = i.node, o = i.index++, a = void 0;
      if (s.entry) {
        if (o === 0)
          return hi(n, s.entry);
      } else if (s.entries) {
        if (a = s.entries.length - 1, o <= a)
          return hi(
            n,
            s.entries[this._reverse ? a - o : o]
          );
      } else if (a = s.nodes.length - 1, o <= a) {
        var u = s.nodes[this._reverse ? a - o : o];
        if (u) {
          if (u.entry)
            return hi(n, u.entry);
          i = this._stack = eo(u, i);
        }
        continue;
      }
      i = this._stack = this._stack.__prev;
    }
    return G();
  }, e;
}(O);
function hi(t, e) {
  return C(t, e[0], e[1]);
}
function eo(t, e) {
  return {
    node: t,
    index: 0,
    __prev: e
  };
}
function ps(t, e, r, n) {
  var i = Object.create($);
  return i.size = t, i._root = e, i.__ownerID = r, i.__hash = n, i.__altered = !1, i;
}
var ro;
function Tt() {
  return ro || (ro = ps(0));
}
function no(t, e, r) {
  var n, i;
  if (t._root) {
    var s = Oi(), o = Oi();
    if (n = _s(
      t._root,
      t.__ownerID,
      0,
      void 0,
      e,
      r,
      s,
      o
    ), !o.value)
      return t;
    i = t.size + (s.value ? r === S ? -1 : 1 : 0);
  } else {
    if (r === S)
      return t;
    i = 1, n = new vr(t.__ownerID, [[e, r]]);
  }
  return t.__ownerID ? (t.size = i, t._root = n, t.__hash = void 0, t.__altered = !0, t) : n ? ps(i, n) : Tt();
}
function _s(t, e, r, n, i, s, o, a) {
  return t ? t.update(
    e,
    r,
    n,
    i,
    s,
    o,
    a
  ) : s === S ? t : (gt(a), gt(o), new kt(e, n, [i, s]));
}
function io(t) {
  return t.constructor === kt || t.constructor === ze;
}
function ds(t, e, r, n, i) {
  if (t.keyHash === n)
    return new ze(e, n, [t.entry, i]);
  var s = (r === 0 ? t.keyHash : t.keyHash >>> r) & Q, o = (r === 0 ? n : n >>> r) & Q, a, u = s === o ? [ds(t, e, r + R, n, i)] : (a = new kt(e, n, i), s < o ? [t, a] : [a, t]);
  return new Te(e, 1 << s | 1 << o, u);
}
function Fp(t, e, r, n) {
  t || (t = new Ki());
  for (var i = new kt(t, nt(r), [r, n]), s = 0; s < e.length; s++) {
    var o = e[s];
    i = i.update(t, 0, void 0, o[0], o[1]);
  }
  return i;
}
function Pp(t, e, r, n) {
  for (var i = 0, s = 0, o = new Array(r), a = 0, u = 1, f = e.length; a < f; a++, u <<= 1) {
    var c = e[a];
    c !== void 0 && a !== n && (i |= u, o[s++] = c);
  }
  return new Te(t, i, o);
}
function Cp(t, e, r, n, i) {
  for (var s = 0, o = new Array(ft), a = 0; r !== 0; a++, r >>>= 1)
    o[a] = r & 1 ? e[s++] : void 0;
  return o[n] = i, new mr(t, s + 1, o);
}
function eu(t) {
  return t -= t >> 1 & 1431655765, t = (t & 858993459) + (t >> 2 & 858993459), t = t + (t >> 4) & 252645135, t += t >> 8, t += t >> 16, t & 127;
}
function ru(t, e, r, n) {
  var i = n ? t : It(t);
  return i[e] = r, i;
}
function $p(t, e, r, n) {
  var i = t.length + 1;
  if (n && e + 1 === i)
    return t[e] = r, t;
  for (var s = new Array(i), o = 0, a = 0; a < i; a++)
    a === e ? (s[a] = r, o = -1) : s[a] = t[a + o];
  return s;
}
function qp(t, e, r) {
  var n = t.length - 1;
  if (r && e === n)
    return t.pop(), t;
  for (var i = new Array(n), s = 0, o = 0; o < n; o++)
    o === e && (s = 1), i[o] = t[o + s];
  return i;
}
var Np = ft / 4, Lp = ft / 2, jp = ft / 4, nu = "@@__IMMUTABLE_LIST__@@";
function ys(t) {
  return !!(t && // @ts-expect-error: maybeList is typed as `{}`, need to change in 6.0 to `maybeList && typeof maybeList === 'object' && IS_LIST_SYMBOL in maybeList`
  t[nu]);
}
var kr = /* @__PURE__ */ function(t) {
  function e(r) {
    var n = cn();
    if (r == null)
      return n;
    if (ys(r))
      return r;
    var i = t(r), s = i.size;
    return s === 0 ? n : (ut(s), s > 0 && s < ft ? wr(0, s, R, null, new Kt(i.toArray())) : n.withMutations(function(o) {
      o.setSize(s), i.forEach(function(a, u) {
        return o.set(u, a);
      });
    }));
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return this(arguments);
  }, e.prototype.toString = function() {
    return this.__toString("List [", "]");
  }, e.prototype.get = function(n, i) {
    if (n = Yt(this, n), n >= 0 && n < this.size) {
      n += this._origin;
      var s = iu(this, n);
      return s && s.array[n & Q];
    }
    return i;
  }, e.prototype.set = function(n, i) {
    return Dp(this, n, i);
  }, e.prototype.remove = function(n) {
    return this.has(n) ? n === 0 ? this.shift() : n === this.size - 1 ? this.pop() : this.splice(n, 1) : this;
  }, e.prototype.insert = function(n, i) {
    return this.splice(n, 0, i);
  }, e.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = this._origin = this._capacity = 0, this._level = R, this._root = this._tail = this.__hash = void 0, this.__altered = !0, this) : cn();
  }, e.prototype.push = function() {
    var n = arguments, i = this.size;
    return this.withMutations(function(s) {
      Ut(s, 0, i + n.length);
      for (var o = 0; o < n.length; o++)
        s.set(i + o, n[o]);
    });
  }, e.prototype.pop = function() {
    return Ut(this, 0, -1);
  }, e.prototype.unshift = function() {
    var n = arguments;
    return this.withMutations(function(i) {
      Ut(i, -n.length);
      for (var s = 0; s < n.length; s++)
        i.set(s, n[s]);
    });
  }, e.prototype.shift = function() {
    return Ut(this, 1);
  }, e.prototype.shuffle = function(n) {
    return n === void 0 && (n = Math.random), this.withMutations(function(i) {
      for (var s = i.size, o, a; s; )
        o = Math.floor(n() * s--), a = i.get(o), i.set(o, i.get(s)), i.set(s, a);
    });
  }, e.prototype.concat = function() {
    for (var n = arguments, i = [], s = 0; s < arguments.length; s++) {
      var o = n[s], a = t(
        typeof o != "string" && Hi(o) ? o : [o]
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
  }, e.prototype.setSize = function(n) {
    return Ut(this, 0, n);
  }, e.prototype.map = function(n, i) {
    var s = this;
    return this.withMutations(function(o) {
      for (var a = 0; a < s.size; a++)
        o.set(a, n.call(i, o.get(a), a, s));
    });
  }, e.prototype.slice = function(n, i) {
    var s = this.size;
    return Cr(n, i, s) ? this : Ut(
      this,
      De(n, s),
      $r(i, s)
    );
  }, e.prototype.__iterator = function(n, i) {
    var s = i ? this.size : 0, o = so(this, i);
    return new O(function() {
      var a = o();
      return a === sr ? G() : C(n, i ? --s : s++, a);
    });
  }, e.prototype.__iterate = function(n, i) {
    for (var s = i ? this.size : 0, o = so(this, i), a; (a = o()) !== sr && n(a, i ? --s : s++, this) !== !1; )
      ;
    return s;
  }, e.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? wr(
      this._origin,
      this._capacity,
      this._level,
      this._root,
      this._tail,
      n,
      this.__hash
    ) : this.size === 0 ? cn() : (this.__ownerID = n, this.__altered = !1, this);
  }, e;
}(ue);
kr.isList = ys;
var L = kr.prototype;
L[nu] = !0;
L[Pr] = L.remove;
L.merge = L.concat;
L.setIn = ss;
L.deleteIn = L.removeIn = os;
L.update = us;
L.updateIn = fs;
L.mergeIn = cs;
L.mergeDeepIn = hs;
L.withMutations = Lr;
L.wasAltered = ls;
L.asImmutable = Dr;
L["@@transducer/init"] = L.asMutable = jr;
L["@@transducer/step"] = function(t, e) {
  return t.push(e);
};
L["@@transducer/result"] = function(t) {
  return t.asImmutable();
};
var Kt = function(e, r) {
  this.array = e, this.ownerID = r;
};
Kt.prototype.removeBefore = function(e, r, n) {
  if ((n & (1 << r + R) - 1) === 0 || this.array.length === 0)
    return this;
  var i = n >>> r & Q;
  if (i >= this.array.length)
    return new Kt([], e);
  var s = i === 0, o;
  if (r > 0) {
    var a = this.array[i];
    if (o = a && a.removeBefore(e, r - R, n), o === a && s)
      return this;
  }
  if (s && !o)
    return this;
  var u = Re(this, e);
  if (!s)
    for (var f = 0; f < i; f++)
      u.array[f] = void 0;
  return o && (u.array[i] = o), u;
};
Kt.prototype.removeAfter = function(e, r, n) {
  if (n === (r ? 1 << r + R : ft) || this.array.length === 0)
    return this;
  var i = n - 1 >>> r & Q;
  if (i >= this.array.length)
    return this;
  var s;
  if (r > 0) {
    var o = this.array[i];
    if (s = o && o.removeAfter(e, r - R, n), s === o && i === this.array.length - 1)
      return this;
  }
  var a = Re(this, e);
  return a.array.splice(i + 1), s && (a.array[i] = s), a;
};
var sr = {};
function so(t, e) {
  var r = t._origin, n = t._capacity, i = br(n), s = t._tail;
  return o(t._root, t._level, 0);
  function o(f, c, h) {
    return c === 0 ? a(f, h) : u(f, c, h);
  }
  function a(f, c) {
    var h = c === i ? s && s.array : f && f.array, l = c > r ? 0 : r - c, p = n - c;
    return p > ft && (p = ft), function() {
      if (l === p)
        return sr;
      var _ = e ? --p : l++;
      return h && h[_];
    };
  }
  function u(f, c, h) {
    var l, p = f && f.array, _ = h > r ? 0 : r - h >> c, d = (n - h >> c) + 1;
    return d > ft && (d = ft), function() {
      for (; ; ) {
        if (l) {
          var y = l();
          if (y !== sr)
            return y;
          l = null;
        }
        if (_ === d)
          return sr;
        var m = e ? --d : _++;
        l = o(
          p && p[m],
          c - R,
          h + (m << c)
        );
      }
    };
  }
}
function wr(t, e, r, n, i, s, o) {
  var a = Object.create(L);
  return a.size = e - t, a._origin = t, a._capacity = e, a._level = r, a._root = n, a._tail = i, a.__ownerID = s, a.__hash = o, a.__altered = !1, a;
}
function cn() {
  return wr(0, 0, R);
}
function Dp(t, e, r) {
  if (e = Yt(t, e), e !== e)
    return t;
  if (e >= t.size || e < 0)
    return t.withMutations(function(o) {
      e < 0 ? Ut(o, e).set(0, r) : Ut(o, 0, e + 1).set(e, r);
    });
  e += t._origin;
  var n = t._tail, i = t._root, s = Oi();
  return e >= br(t._capacity) ? n = Ri(n, t.__ownerID, 0, e, r, s) : i = Ri(
    i,
    t.__ownerID,
    t._level,
    e,
    r,
    s
  ), s.value ? t.__ownerID ? (t._root = i, t._tail = n, t.__hash = void 0, t.__altered = !0, t) : wr(t._origin, t._capacity, t._level, i, n) : t;
}
function Ri(t, e, r, n, i, s) {
  var o = n >>> r & Q, a = t && o < t.array.length;
  if (!a && i === void 0)
    return t;
  var u;
  if (r > 0) {
    var f = t && t.array[o], c = Ri(
      f,
      e,
      r - R,
      n,
      i,
      s
    );
    return c === f ? t : (u = Re(t, e), u.array[o] = c, u);
  }
  return a && t.array[o] === i ? t : (s && gt(s), u = Re(t, e), i === void 0 && o === u.array.length - 1 ? u.array.pop() : u.array[o] = i, u);
}
function Re(t, e) {
  return e && t && e === t.ownerID ? t : new Kt(t ? t.array.slice() : [], e);
}
function iu(t, e) {
  if (e >= br(t._capacity))
    return t._tail;
  if (e < 1 << t._level + R) {
    for (var r = t._root, n = t._level; r && n > 0; )
      r = r.array[e >>> n & Q], n -= R;
    return r;
  }
}
function Ut(t, e, r) {
  e !== void 0 && (e |= 0), r !== void 0 && (r |= 0);
  var n = t.__ownerID || new Ki(), i = t._origin, s = t._capacity, o = i + e, a = r === void 0 ? s : r < 0 ? s + r : i + r;
  if (o === i && a === s)
    return t;
  if (o >= a)
    return t.clear();
  for (var u = t._level, f = t._root, c = 0; o + c < 0; )
    f = new Kt(
      f && f.array.length ? [void 0, f] : [],
      n
    ), u += R, c += 1 << u;
  c && (o += c, i += c, a += c, s += c);
  for (var h = br(s), l = br(a); l >= 1 << u + R; )
    f = new Kt(
      f && f.array.length ? [f] : [],
      n
    ), u += R;
  var p = t._tail, _ = l < h ? iu(t, a - 1) : l > h ? new Kt([], n) : p;
  if (p && l > h && o < s && p.array.length) {
    f = Re(f, n);
    for (var d = f, y = u; y > R; y -= R) {
      var m = h >>> y & Q;
      d = d.array[m] = Re(d.array[m], n);
    }
    d.array[h >>> R & Q] = p;
  }
  if (a < s && (_ = _ && _.removeAfter(n, 0, a)), o >= l)
    o -= l, a -= l, u = R, f = null, _ = _ && _.removeBefore(n, 0, o);
  else if (o > i || l < h) {
    for (c = 0; f; ) {
      var v = o >>> u & Q;
      if (v !== l >>> u & Q)
        break;
      v && (c += (1 << u) * v), u -= R, f = f.array[v];
    }
    f && o > i && (f = f.removeBefore(n, u, o - c)), f && l < h && (f = f.removeAfter(
      n,
      u,
      l - c
    )), c && (o -= c, a -= c);
  }
  return t.__ownerID ? (t.size = a - o, t._origin = o, t._capacity = a, t._level = u, t._root = f, t._tail = _, t.__hash = void 0, t.__altered = !0, t) : wr(o, a, u, f, _);
}
function br(t) {
  return t < ft ? 0 : t - 1 >>> R << R;
}
var Rt = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? Xe() : Qi(r) ? r : Xe().withMutations(function(n) {
      var i = mt(r);
      ut(i.size), i.forEach(function(s, o) {
        return n.set(o, s);
      });
    });
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return this(arguments);
  }, e.prototype.toString = function() {
    return this.__toString("OrderedMap {", "}");
  }, e.prototype.get = function(n, i) {
    var s = this._map.get(n);
    return s !== void 0 ? this._list.get(s)[1] : i;
  }, e.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._map.clear(), this._list.clear(), this.__altered = !0, this) : Xe();
  }, e.prototype.set = function(n, i) {
    return ao(this, n, i);
  }, e.prototype.remove = function(n) {
    return ao(this, n, S);
  }, e.prototype.__iterate = function(n, i) {
    var s = this;
    return this._list.__iterate(
      function(o) {
        return o && n(o[1], o[0], s);
      },
      i
    );
  }, e.prototype.__iterator = function(n, i) {
    return this._list.fromEntrySeq().__iterator(n, i);
  }, e.prototype.__ensureOwner = function(n) {
    if (n === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(n), s = this._list.__ensureOwner(n);
    return n ? gs(i, s, n, this.__hash) : this.size === 0 ? Xe() : (this.__ownerID = n, this.__altered = !1, this._map = i, this._list = s, this);
  }, e;
}(ce);
Rt.isOrderedMap = Qi;
Rt.prototype[Zt] = !0;
Rt.prototype[Pr] = Rt.prototype.remove;
function gs(t, e, r, n) {
  var i = Object.create(Rt.prototype);
  return i.size = t ? t.size : 0, i._map = t, i._list = e, i.__ownerID = r, i.__hash = n, i.__altered = !1, i;
}
var oo;
function Xe() {
  return oo || (oo = gs(Tt(), cn()));
}
function ao(t, e, r) {
  var n = t._map, i = t._list, s = n.get(e), o = s !== void 0, a, u;
  if (r === S) {
    if (!o)
      return t;
    i.size >= ft && i.size >= n.size * 2 ? (u = i.filter(function(f, c) {
      return f !== void 0 && s !== c;
    }), a = u.toKeyedSeq().map(function(f) {
      return f[0];
    }).flip().toMap(), t.__ownerID && (a.__ownerID = u.__ownerID = t.__ownerID)) : (a = n.remove(e), u = s === i.size - 1 ? i.pop() : i.set(s, void 0));
  } else if (o) {
    if (r === i.get(s)[1])
      return t;
    a = n, u = i.set(s, [e, r]);
  } else
    a = n.set(e, i.size), u = i.set(i.size, [e, r]);
  return t.__ownerID ? (t.size = a.size, t._map = a, t._list = u, t.__hash = void 0, t.__altered = !0, t) : gs(a, u);
}
var su = "@@__IMMUTABLE_STACK__@@";
function bn(t) {
  return !!(t && // @ts-expect-error: maybeStack is typed as `{}`, need to change in 6.0 to `maybeStack && typeof maybeStack === 'object' && MAYBE_STACK_SYMBOL in maybeStack`
  t[su]);
}
var Wn = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? en() : bn(r) ? r : en().pushAll(r);
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return this(arguments);
  }, e.prototype.toString = function() {
    return this.__toString("Stack [", "]");
  }, e.prototype.get = function(n, i) {
    var s = this._head;
    for (n = Yt(this, n); s && n--; )
      s = s.next;
    return s ? s.value : i;
  }, e.prototype.peek = function() {
    return this._head && this._head.value;
  }, e.prototype.push = function() {
    var n = arguments;
    if (arguments.length === 0)
      return this;
    for (var i = this.size + arguments.length, s = this._head, o = arguments.length - 1; o >= 0; o--)
      s = {
        value: n[o],
        next: s
      };
    return this.__ownerID ? (this.size = i, this._head = s, this.__hash = void 0, this.__altered = !0, this) : tr(i, s);
  }, e.prototype.pushAll = function(n) {
    if (n = t(n), n.size === 0)
      return this;
    if (this.size === 0 && bn(n))
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
    ), this.__ownerID ? (this.size = i, this._head = s, this.__hash = void 0, this.__altered = !0, this) : tr(i, s);
  }, e.prototype.pop = function() {
    return this.slice(1);
  }, e.prototype.clear = function() {
    return this.size === 0 ? this : this.__ownerID ? (this.size = 0, this._head = void 0, this.__hash = void 0, this.__altered = !0, this) : en();
  }, e.prototype.slice = function(n, i) {
    if (Cr(n, i, this.size))
      return this;
    var s = De(n, this.size), o = $r(i, this.size);
    if (o !== this.size)
      return t.prototype.slice.call(this, n, i);
    for (var a = this.size - s, u = this._head; s--; )
      u = u.next;
    return this.__ownerID ? (this.size = a, this._head = u, this.__hash = void 0, this.__altered = !0, this) : tr(a, u);
  }, e.prototype.__ensureOwner = function(n) {
    return n === this.__ownerID ? this : n ? tr(this.size, this._head, n, this.__hash) : this.size === 0 ? en() : (this.__ownerID = n, this.__altered = !1, this);
  }, e.prototype.__iterate = function(n, i) {
    var s = this;
    if (i)
      return new Me(this.toArray()).__iterate(
        function(u, f) {
          return n(u, f, s);
        },
        i
      );
    for (var o = 0, a = this._head; a && n(a.value, o++, this) !== !1; )
      a = a.next;
    return o;
  }, e.prototype.__iterator = function(n, i) {
    if (i)
      return new Me(this.toArray()).__iterator(n, i);
    var s = 0, o = this._head;
    return new O(function() {
      if (o) {
        var a = o.value;
        return o = o.next, C(n, s++, a);
      }
      return G();
    });
  }, e;
}(ue);
Wn.isStack = bn;
var rt = Wn.prototype;
rt[su] = !0;
rt.shift = rt.pop;
rt.unshift = rt.push;
rt.unshiftAll = rt.pushAll;
rt.withMutations = Lr;
rt.wasAltered = ls;
rt.asImmutable = Dr;
rt["@@transducer/init"] = rt.asMutable = jr;
rt["@@transducer/step"] = function(t, e) {
  return t.unshift(e);
};
rt["@@transducer/result"] = function(t) {
  return t.asImmutable();
};
function tr(t, e, r, n) {
  var i = Object.create(rt);
  return i.size = t, i._head = e, i.__ownerID = r, i.__hash = n, i.__altered = !1, i;
}
var uo;
function en() {
  return uo || (uo = tr(0));
}
var ou = "@@__IMMUTABLE_SET__@@";
function Kn(t) {
  return !!(t && // @ts-expect-error: maybeSet is typed as `{}`,  need to change in 6.0 to `maybeSeq && typeof maybeSet === 'object' && MAYBE_SET_SYMBOL in maybeSet`
  t[ou]);
}
function vs(t) {
  return Kn(t) && At(t);
}
function ms(t, e) {
  if (t === e)
    return !0;
  if (!st(e) || // @ts-expect-error size should exists on Collection
  t.size !== void 0 && e.size !== void 0 && t.size !== e.size || // @ts-expect-error __hash exists on Collection
  t.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  e.__hash !== void 0 && // @ts-expect-error __hash exists on Collection
  t.__hash !== e.__hash || F(t) !== F(e) || ot(t) !== ot(e) || // @ts-expect-error Range extends Collection, which implements [Symbol.iterator], so it is valid
  At(t) !== At(e))
    return !1;
  if (t.size === 0 && e.size === 0)
    return !0;
  var r = !Nn(t);
  if (At(t)) {
    var n = t.entries();
    return e.every(function(u, f) {
      var c = n.next().value;
      return c && B(c[1], u) && (r || B(c[0], f));
    }) && n.next().done;
  }
  var i = !1;
  if (t.size === void 0)
    if (e.size === void 0)
      typeof t.cacheResult == "function" && t.cacheResult();
    else {
      i = !0;
      var s = t;
      t = e, e = s;
    }
  var o = !0, a = (
    // @ts-expect-error b is Range | Repeat | Collection<unknown, unknown> as it may have been flipped, and __iterate is valid
    e.__iterate(function(u, f) {
      if (r ? (
        // @ts-expect-error has exists on Collection
        !t.has(u)
      ) : i ? (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !B(u, t.get(f, S))
      ) : (
        // @ts-expect-error type of `get` does not "catch" the version with `notSetValue`
        !B(t.get(f, S), u)
      ))
        return o = !1, !1;
    })
  );
  return o && // @ts-expect-error size should exists on Collection
  t.size === a;
}
function he(t, e) {
  var r = function(n) {
    t.prototype[n] = e[n];
  };
  return Object.keys(e).forEach(r), Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(e).forEach(r), t;
}
function Sn(t) {
  if (!t || typeof t != "object")
    return t;
  if (!st(t)) {
    if (!Jt(t))
      return t;
    t = V(t);
  }
  if (F(t)) {
    var e = {};
    return t.__iterate(function(n, i) {
      e[i] = Sn(n);
    }), e;
  }
  var r = [];
  return t.__iterate(function(n) {
    r.push(Sn(n));
  }), r;
}
var Br = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? er() : Kn(r) && !At(r) ? r : er().withMutations(function(n) {
      var i = t(r);
      ut(i.size), i.forEach(function(s) {
        return n.add(s);
      });
    });
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return this(arguments);
  }, e.fromKeys = function(n) {
    return this(mt(n).keySeq());
  }, e.intersect = function(n) {
    return n = U(n).toArray(), n.length ? W.intersect.apply(e(n.pop()), n) : er();
  }, e.union = function(n) {
    return n = U(n).toArray(), n.length ? W.union.apply(e(n.pop()), n) : er();
  }, e.prototype.toString = function() {
    return this.__toString("Set {", "}");
  }, e.prototype.has = function(n) {
    return this._map.has(n);
  }, e.prototype.add = function(n) {
    return rn(this, this._map.set(n, n));
  }, e.prototype.remove = function(n) {
    return rn(this, this._map.remove(n));
  }, e.prototype.clear = function() {
    return rn(this, this._map.clear());
  }, e.prototype.map = function(n, i) {
    var s = this, o = !1, a = rn(
      this,
      this._map.mapEntries(function(u) {
        var f = u[1], c = n.call(i, f, f, s);
        return c !== f && (o = !0), [c, c];
      }, i)
    );
    return o ? a : this;
  }, e.prototype.union = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    return n = n.filter(function(s) {
      return s.size !== 0;
    }), n.length === 0 ? this : this.size === 0 && !this.__ownerID && n.length === 1 ? this.constructor(n[0]) : this.withMutations(function(s) {
      for (var o = 0; o < n.length; o++)
        typeof n[o] == "string" ? s.add(n[o]) : t(n[o]).forEach(function(a) {
          return s.add(a);
        });
    });
  }, e.prototype.intersect = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    if (n.length === 0)
      return this;
    n = n.map(function(o) {
      return t(o);
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
  }, e.prototype.subtract = function() {
    for (var n = [], i = arguments.length; i--; ) n[i] = arguments[i];
    if (n.length === 0)
      return this;
    n = n.map(function(o) {
      return t(o);
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
  }, e.prototype.sort = function(n) {
    return Pe(Ie(this, n));
  }, e.prototype.sortBy = function(n, i) {
    return Pe(Ie(this, i, n));
  }, e.prototype.wasAltered = function() {
    return this._map.wasAltered();
  }, e.prototype.__iterate = function(n, i) {
    var s = this;
    return this._map.__iterate(function(o) {
      return n(o, o, s);
    }, i);
  }, e.prototype.__iterator = function(n, i) {
    return this._map.__iterator(n, i);
  }, e.prototype.__ensureOwner = function(n) {
    if (n === this.__ownerID)
      return this;
    var i = this._map.__ensureOwner(n);
    return n ? this.__make(i, n) : this.size === 0 ? this.__empty() : (this.__ownerID = n, this._map = i, this);
  }, e;
}(ke);
Br.isSet = Kn;
var W = Br.prototype;
W[ou] = !0;
W[Pr] = W.remove;
W.merge = W.concat = W.union;
W.withMutations = Lr;
W.asImmutable = Dr;
W["@@transducer/init"] = W.asMutable = jr;
W["@@transducer/step"] = function(t, e) {
  return t.add(e);
};
W["@@transducer/result"] = function(t) {
  return t.asImmutable();
};
W.__empty = er;
W.__make = au;
function rn(t, e) {
  return t.__ownerID ? (t.size = e.size, t._map = e, t) : e === t._map ? t : e.size === 0 ? t.__empty() : t.__make(e);
}
function au(t, e) {
  var r = Object.create(W);
  return r.size = t ? t.size : 0, r._map = t, r.__ownerID = e, r;
}
var fo;
function er() {
  return fo || (fo = au(Tt()));
}
var uu = /* @__PURE__ */ function(t) {
  function e(r, n, i) {
    if (i === void 0 && (i = 1), !(this instanceof e))
      return new e(r, n, i);
    if (ir(i !== 0, "Cannot step a Range by 0"), ir(
      r !== void 0,
      "You must define a start value when using Range"
    ), ir(
      n !== void 0,
      "You must define an end value when using Range"
    ), i = Math.abs(i), n < r && (i = -i), this._start = r, this._end = n, this._step = i, this.size = Math.max(0, Math.ceil((n - r) / i - 1) + 1), this.size === 0) {
      if (li)
        return li;
      li = this;
    }
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.toString = function() {
    return this.size === 0 ? "Range []" : "Range [ " + this._start + "..." + this._end + (this._step !== 1 ? " by " + this._step : "") + " ]";
  }, e.prototype.get = function(n, i) {
    return this.has(n) ? this._start + Yt(this, n) * this._step : i;
  }, e.prototype.includes = function(n) {
    var i = (n - this._start) / this._step;
    return i >= 0 && i < this.size && i === Math.floor(i);
  }, e.prototype.slice = function(n, i) {
    return Cr(n, i, this.size) ? this : (n = De(n, this.size), i = $r(i, this.size), i <= n ? new e(0, 0) : new e(
      this.get(n, this._end),
      this.get(i, this._end),
      this._step
    ));
  }, e.prototype.indexOf = function(n) {
    var i = n - this._start;
    if (i % this._step === 0) {
      var s = i / this._step;
      if (s >= 0 && s < this.size)
        return s;
    }
    return -1;
  }, e.prototype.lastIndexOf = function(n) {
    return this.indexOf(n);
  }, e.prototype.__iterate = function(n, i) {
    for (var s = this.size, o = this._step, a = i ? this._start + (s - 1) * o : this._start, u = 0; u !== s && n(a, i ? s - ++u : u++, this) !== !1; )
      a += i ? -o : o;
    return u;
  }, e.prototype.__iterator = function(n, i) {
    var s = this.size, o = this._step, a = i ? this._start + (s - 1) * o : this._start, u = 0;
    return new O(function() {
      if (u === s)
        return G();
      var f = a;
      return a += i ? -o : o, C(n, i ? s - ++u : u++, f);
    });
  }, e.prototype.equals = function(n) {
    return n instanceof e ? this._start === n._start && this._end === n._end && this._step === n._step : ms(this, n);
  }, e;
}(bt), li;
function ws(t, e, r) {
  for (var n = Ua(e), i = 0; i !== n.length; )
    if (t = is(t, n[i++], S), t === S)
      return r;
  return t;
}
function fu(t, e) {
  return ws(this, t, e);
}
function cu(t, e) {
  return ws(t, e, S) !== S;
}
function kp(t) {
  return cu(this, t);
}
function hu() {
  ut(this.size);
  var t = {};
  return this.__iterate(function(e, r) {
    t[r] = e;
  }), t;
}
U.Iterator = O;
he(U, {
  // ### Conversion to other types
  toArray: function() {
    ut(this.size);
    var e = new Array(this.size || 0), r = F(this), n = 0;
    return this.__iterate(function(i, s) {
      e[n++] = r ? [s, i] : i;
    }), e;
  },
  toIndexedSeq: function() {
    return new Ca(this);
  },
  toJS: function() {
    return Sn(this);
  },
  toKeyedSeq: function() {
    return new Un(this, !0);
  },
  toMap: function() {
    return ce(this.toKeyedSeq());
  },
  toObject: hu,
  toOrderedMap: function() {
    return Rt(this.toKeyedSeq());
  },
  toOrderedSet: function() {
    return Pe(F(this) ? this.valueSeq() : this);
  },
  toSet: function() {
    return Br(F(this) ? this.valueSeq() : this);
  },
  toSetSeq: function() {
    return new $a(this);
  },
  toSeq: function() {
    return ot(this) ? this.toIndexedSeq() : F(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack: function() {
    return Wn(F(this) ? this.valueSeq() : this);
  },
  toList: function() {
    return kr(F(this) ? this.valueSeq() : this);
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
    return z(this, bp(this, e));
  },
  includes: function(e) {
    return this.some(function(r) {
      return B(r, e);
    });
  },
  entries: function() {
    return this.__iterator(pt);
  },
  every: function(e, r) {
    ut(this.size);
    var n = !0;
    return this.__iterate(function(i, s, o) {
      if (!e.call(r, i, s, o))
        return n = !1, !1;
    }), n;
  },
  filter: function(e, r) {
    return z(this, ja(this, e, r, !0));
  },
  partition: function(e, r) {
    return vp(this, e, r);
  },
  find: function(e, r, n) {
    var i = this.findEntry(e, r);
    return i ? i[1] : n;
  },
  forEach: function(e, r) {
    return ut(this.size), this.__iterate(r ? e.bind(r) : e);
  },
  join: function(e) {
    ut(this.size), e = e !== void 0 ? "" + e : ",";
    var r = "", n = !0;
    return this.__iterate(function(i) {
      n ? n = !1 : r += e, r += i != null ? i.toString() : "";
    }), r;
  },
  keys: function() {
    return this.__iterator(Be);
  },
  map: function(e, r) {
    return z(this, La(this, e, r));
  },
  reduce: function(e, r, n) {
    return co(
      this,
      e,
      r,
      n,
      arguments.length < 2,
      !1
    );
  },
  reduceRight: function(e, r, n) {
    return co(
      this,
      e,
      r,
      n,
      arguments.length < 2,
      !0
    );
  },
  reverse: function() {
    return z(this, Xi(this, !0));
  },
  slice: function(e, r) {
    return z(this, ts(this, e, r, !0));
  },
  some: function(e, r) {
    ut(this.size);
    var n = !1;
    return this.__iterate(function(i, s, o) {
      if (e.call(r, i, s, o))
        return n = !0, !1;
    }), n;
  },
  sort: function(e) {
    return z(this, Ie(this, e));
  },
  values: function() {
    return this.__iterator(lt);
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
    return xe(
      e ? this.toSeq().filter(e, r) : this
    );
  },
  countBy: function(e, r) {
    return yp(this, e, r);
  },
  equals: function(e) {
    return ms(this, e);
  },
  entrySeq: function() {
    var e = this;
    if (e._cache)
      return new Me(e._cache);
    var r = e.toSeq().map(Up).toIndexedSeq();
    return r.fromEntrySeq = function() {
      return e.toSeq();
    }, r;
  },
  filterNot: function(e, r) {
    return this.filter(pi(e), r);
  },
  findEntry: function(e, r, n) {
    var i = n;
    return this.__iterate(function(s, o, a) {
      if (e.call(r, s, o, a))
        return i = [o, s], !1;
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
    return this.find(Oa, null, e);
  },
  flatMap: function(e, r) {
    return z(this, Sp(this, e, r));
  },
  flatten: function(e) {
    return z(this, ka(this, e, !0));
  },
  fromEntrySeq: function() {
    return new qa(this);
  },
  get: function(e, r) {
    return this.find(function(n, i) {
      return B(i, e);
    }, void 0, r);
  },
  getIn: fu,
  groupBy: function(e, r) {
    return gp(this, e, r);
  },
  has: function(e) {
    return this.get(e, S) !== S;
  },
  hasIn: kp,
  isSubset: function(e) {
    return e = typeof e.includes == "function" ? e : U(e), this.every(function(r) {
      return e.includes(r);
    });
  },
  isSuperset: function(e) {
    return e = typeof e.isSubset == "function" ? e : U(e), e.isSubset(this);
  },
  keyOf: function(e) {
    return this.findKey(function(r) {
      return B(r, e);
    });
  },
  keySeq: function() {
    return this.toSeq().map(Bp).toIndexedSeq();
  },
  last: function(e) {
    return this.toSeq().reverse().first(e);
  },
  lastKeyOf: function(e) {
    return this.toKeyedSeq().reverse().keyOf(e);
  },
  max: function(e) {
    return Xr(this, e);
  },
  maxBy: function(e, r) {
    return Xr(this, r, e);
  },
  min: function(e) {
    return Xr(
      this,
      e ? ho(e) : po
    );
  },
  minBy: function(e, r) {
    return Xr(
      this,
      r ? ho(r) : po,
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
    return z(this, Da(this, e, r, !0));
  },
  skipUntil: function(e, r) {
    return this.skipWhile(pi(e), r);
  },
  sortBy: function(e, r) {
    return z(this, Ie(this, r, e));
  },
  take: function(e) {
    return this.slice(0, Math.max(0, e));
  },
  takeLast: function(e) {
    return this.slice(-Math.max(0, e));
  },
  takeWhile: function(e, r) {
    return z(this, mp(this, e, r));
  },
  takeUntil: function(e, r) {
    return this.takeWhile(pi(e), r);
  },
  update: function(e) {
    return e(this);
  },
  valueSeq: function() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode: function() {
    return this.__hash || (this.__hash = Wp(this));
  }
  // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)
});
var Y = U.prototype;
Y[Ma] = !0;
Y[jn] = Y.values;
Y.toJSON = Y.toArray;
Y.__toStringMapper = gr;
Y.inspect = Y.toSource = function() {
  return this.toString();
};
Y.chain = Y.flatMap;
Y.contains = Y.includes;
he(mt, {
  // ### More sequential methods
  flip: function() {
    return z(this, Na(this));
  },
  mapEntries: function(e, r) {
    var n = this, i = 0;
    return z(
      this,
      this.toSeq().map(function(s, o) {
        return e.call(r, [o, s], i++, n);
      }).fromEntrySeq()
    );
  },
  mapKeys: function(e, r) {
    var n = this;
    return z(
      this,
      this.toSeq().flip().map(function(i, s) {
        return e.call(r, i, s, n);
      }).flip()
    );
  }
});
var Ur = mt.prototype;
Ur[vn] = !0;
Ur[jn] = Y.entries;
Ur.toJSON = hu;
Ur.__toStringMapper = function(t, e) {
  return gr(e) + ": " + gr(t);
};
he(ue, {
  // ### Conversion to other types
  toKeyedSeq: function() {
    return new Un(this, !1);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter: function(e, r) {
    return z(this, ja(this, e, r, !1));
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
    return z(this, Xi(this, !1));
  },
  slice: function(e, r) {
    return z(this, ts(this, e, r, !1));
  },
  splice: function(e, r) {
    var n = arguments.length;
    if (r = Math.max(r || 0, 0), n === 0 || n === 2 && !r)
      return this;
    e = De(e, e < 0 ? this.count() : this.size);
    var i = this.slice(0, e);
    return z(
      this,
      n === 1 ? i : i.concat(It(arguments, 2), this.slice(e + r))
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
    return z(this, ka(this, e, !1));
  },
  get: function(e, r) {
    return e = Yt(this, e), e < 0 || this.size === 1 / 0 || this.size !== void 0 && e > this.size ? r : this.find(function(n, i) {
      return i === e;
    }, void 0, r);
  },
  has: function(e) {
    return e = Yt(this, e), e >= 0 && (this.size !== void 0 ? this.size === 1 / 0 || e < this.size : this.indexOf(e) !== -1);
  },
  interpose: function(e) {
    return z(this, Ap(this, e));
  },
  interleave: function() {
    var e = [this].concat(It(arguments)), r = tn(this.toSeq(), bt.of, e), n = r.flatten(!0);
    return r.size && (n.size = r.size * e.length), z(this, n);
  },
  keySeq: function() {
    return uu(0, this.size);
  },
  last: function(e) {
    return this.get(-1, e);
  },
  skipWhile: function(e, r) {
    return z(this, Da(this, e, r, !1));
  },
  zip: function() {
    var e = [this].concat(It(arguments));
    return z(this, tn(this, lo, e));
  },
  zipAll: function() {
    var e = [this].concat(It(arguments));
    return z(this, tn(this, lo, e, !0));
  },
  zipWith: function(e) {
    var r = It(arguments);
    return r[0] = this, z(this, tn(this, e, r));
  }
});
var Ke = ue.prototype;
Ke[mn] = !0;
Ke[Zt] = !0;
he(ke, {
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
var Fe = ke.prototype;
Fe.has = Y.includes;
Fe.contains = Fe.includes;
Fe.keys = Fe.values;
he(ee, Ur);
he(bt, Ke);
he(We, Fe);
function co(t, e, r, n, i, s) {
  return ut(t.size), t.__iterate(function(o, a, u) {
    i ? (i = !1, r = o) : r = e.call(n, r, o, a, u);
  }, s), r;
}
function Bp(t, e) {
  return e;
}
function Up(t, e) {
  return [e, t];
}
function pi(t) {
  return function() {
    return !t.apply(this, arguments);
  };
}
function ho(t) {
  return function() {
    return -t.apply(this, arguments);
  };
}
function lo() {
  return It(arguments);
}
function po(t, e) {
  return t < e ? 1 : t > e ? -1 : 0;
}
function Wp(t) {
  if (t.size === 1 / 0)
    return 0;
  var e = At(t), r = F(t), n = e ? 1 : 0;
  return t.__iterate(
    r ? e ? function(i, s) {
      n = 31 * n + _o(nt(i), nt(s)) | 0;
    } : function(i, s) {
      n = n + _o(nt(i), nt(s)) | 0;
    } : e ? function(i) {
      n = 31 * n + nt(i) | 0;
    } : function(i) {
      n = n + nt(i) | 0;
    }
  ), Kp(t.size, n);
}
function Kp(t, e) {
  return e = Je(e, 3432918353), e = Je(e << 15 | e >>> -15, 461845907), e = Je(e << 13 | e >>> -13, 5), e = (e + 3864292196 | 0) ^ t, e = Je(e ^ e >>> 16, 2246822507), e = Je(e ^ e >>> 13, 3266489909), e = Bn(e ^ e >>> 16), e;
}
function _o(t, e) {
  return t ^ e + 2654435769 + (t << 6) + (t >> 2) | 0;
}
var Pe = /* @__PURE__ */ function(t) {
  function e(r) {
    return r == null ? Fi() : vs(r) ? r : Fi().withMutations(function(n) {
      var i = ke(r);
      ut(i.size), i.forEach(function(s) {
        return n.add(s);
      });
    });
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.of = function() {
    return this(arguments);
  }, e.fromKeys = function(n) {
    return this(mt(n).keySeq());
  }, e.prototype.toString = function() {
    return this.__toString("OrderedSet {", "}");
  }, e;
}(Br);
Pe.isOrderedSet = vs;
var le = Pe.prototype;
le[Zt] = !0;
le.zip = Ke.zip;
le.zipWith = Ke.zipWith;
le.zipAll = Ke.zipAll;
le.__empty = Fi;
le.__make = lu;
function lu(t, e) {
  var r = Object.create(le);
  return r.size = t ? t.size : 0, r._map = t, r.__ownerID = e, r;
}
var yo;
function Fi() {
  return yo || (yo = lu(Xe()));
}
var Hp = {
  LeftThenRight: -1,
  RightThenLeft: 1
};
function Gp(t) {
  if (te(t))
    throw new Error(
      "Can not call `Record` with an immutable Record as default values. Use a plain javascript object instead."
    );
  if (wt(t))
    throw new Error(
      "Can not call `Record` with an immutable Collection as default values. Use a plain javascript object instead."
    );
  if (t === null || typeof t != "object")
    throw new Error(
      "Can not call `Record` with a non-object as default values. Use a plain javascript object instead."
    );
}
var j = function(e, r) {
  var n;
  Gp(e);
  var i = function(a) {
    var u = this;
    if (a instanceof i)
      return a;
    if (!(this instanceof i))
      return new i(a);
    if (!n) {
      n = !0;
      var f = Object.keys(e), c = s._indices = {};
      s._name = r, s._keys = f, s._defaultValues = e;
      for (var h = 0; h < f.length; h++) {
        var l = f[h];
        c[l] = h, s[l] ? typeof console == "object" && console.warn && console.warn(
          "Cannot define " + Ss(this) + ' with property "' + l + '" since that property name is part of the Record API.'
        ) : Vp(s, l);
      }
    }
    return this.__ownerID = void 0, this._values = kr().withMutations(function(p) {
      p.setSize(u._keys.length), mt(a).forEach(function(_, d) {
        p.set(u._indices[d], _ === u._defaultValues[d] ? void 0 : _);
      });
    }), this;
  }, s = i.prototype = Object.create(P);
  return s.constructor = i, r && (i.displayName = r), i;
};
j.prototype.toString = function() {
  for (var e = Ss(this) + " { ", r = this._keys, n, i = 0, s = r.length; i !== s; i++)
    n = r[i], e += (i ? ", " : "") + n + ": " + gr(this.get(n));
  return e + " }";
};
j.prototype.equals = function(e) {
  return this === e || te(e) && Ce(this).equals(Ce(e));
};
j.prototype.hashCode = function() {
  return Ce(this).hashCode();
};
j.prototype.has = function(e) {
  return this._indices.hasOwnProperty(e);
};
j.prototype.get = function(e, r) {
  if (!this.has(e))
    return r;
  var n = this._indices[e], i = this._values.get(n);
  return i === void 0 ? this._defaultValues[e] : i;
};
j.prototype.set = function(e, r) {
  if (this.has(e)) {
    var n = this._values.set(
      this._indices[e],
      r === this._defaultValues[e] ? void 0 : r
    );
    if (n !== this._values && !this.__ownerID)
      return bs(this, n);
  }
  return this;
};
j.prototype.remove = function(e) {
  return this.set(e);
};
j.prototype.clear = function() {
  var e = this._values.clear().setSize(this._keys.length);
  return this.__ownerID ? this : bs(this, e);
};
j.prototype.wasAltered = function() {
  return this._values.wasAltered();
};
j.prototype.toSeq = function() {
  return Ce(this);
};
j.prototype.toJS = function() {
  return Sn(this);
};
j.prototype.entries = function() {
  return this.__iterator(pt);
};
j.prototype.__iterator = function(e, r) {
  return Ce(this).__iterator(e, r);
};
j.prototype.__iterate = function(e, r) {
  return Ce(this).__iterate(e, r);
};
j.prototype.__ensureOwner = function(e) {
  if (e === this.__ownerID)
    return this;
  var r = this._values.__ensureOwner(e);
  return e ? bs(this, r, e) : (this.__ownerID = e, this._values = r, this);
};
j.isRecord = te;
j.getDescriptiveName = Ss;
var P = j.prototype;
P[Ta] = !0;
P[Pr] = P.remove;
P.deleteIn = P.removeIn = os;
P.getIn = fu;
P.hasIn = Y.hasIn;
P.merge = Za;
P.mergeWith = Ja;
P.mergeIn = cs;
P.mergeDeep = Xa;
P.mergeDeepWith = tu;
P.mergeDeepIn = hs;
P.setIn = ss;
P.update = us;
P.updateIn = fs;
P.withMutations = Lr;
P.asMutable = jr;
P.asImmutable = Dr;
P[jn] = P.entries;
P.toJSON = P.toObject = Y.toObject;
P.inspect = P.toSource = function() {
  return this.toString();
};
function bs(t, e, r) {
  var n = Object.create(Object.getPrototypeOf(t));
  return n._values = e, n.__ownerID = r, n;
}
function Ss(t) {
  return t.constructor.displayName || t.constructor.name || "Record";
}
function Ce(t) {
  return Zi(t._keys.map(function(e) {
    return [e, t.get(e)];
  }));
}
function Vp(t, e) {
  try {
    Object.defineProperty(t, e, {
      get: function() {
        return this.get(e);
      },
      set: function(r) {
        ir(this.__ownerID, "Cannot set on an immutable record."), this.set(e, r);
      }
    });
  } catch {
  }
}
var Yp = /* @__PURE__ */ function(t) {
  function e(r, n) {
    if (!(this instanceof e))
      return new e(r, n);
    if (this._value = r, this.size = n === void 0 ? 1 / 0 : Math.max(0, n), this.size === 0) {
      if (_i)
        return _i;
      _i = this;
    }
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.toString = function() {
    return this.size === 0 ? "Repeat []" : "Repeat [ " + this._value + " " + this.size + " times ]";
  }, e.prototype.get = function(n, i) {
    return this.has(n) ? this._value : i;
  }, e.prototype.includes = function(n) {
    return B(this._value, n);
  }, e.prototype.slice = function(n, i) {
    var s = this.size;
    return Cr(n, i, s) ? this : new e(
      this._value,
      $r(i, s) - De(n, s)
    );
  }, e.prototype.reverse = function() {
    return this;
  }, e.prototype.indexOf = function(n) {
    return B(this._value, n) ? 0 : -1;
  }, e.prototype.lastIndexOf = function(n) {
    return B(this._value, n) ? this.size : -1;
  }, e.prototype.__iterate = function(n, i) {
    for (var s = this.size, o = 0; o !== s && n(this._value, i ? s - ++o : o++, this) !== !1; )
      ;
    return o;
  }, e.prototype.__iterator = function(n, i) {
    var s = this, o = this.size, a = 0;
    return new O(
      function() {
        return a === o ? G() : C(n, i ? o - ++a : a++, s._value);
      }
    );
  }, e.prototype.equals = function(n) {
    return n instanceof e ? B(this._value, n._value) : ms(this, n);
  }, e;
}(bt), _i;
function Zp(t, e) {
  return pu(
    [],
    e || Jp,
    t,
    "",
    e && e.length > 2 ? [] : void 0,
    { "": t }
  );
}
function pu(t, e, r, n, i, s) {
  if (typeof r != "string" && !wt(r) && (Gi(r) || Hi(r) || ns(r))) {
    if (~t.indexOf(r))
      throw new TypeError("Cannot convert circular structure to Immutable");
    t.push(r), i && n !== "" && i.push(n);
    var o = e.call(
      s,
      n,
      V(r).map(
        function(a, u) {
          return pu(t, e, a, u, i, r);
        }
      ),
      i && i.slice()
    );
    return t.pop(), i && i.pop(), o;
  }
  return r;
}
function Jp(t, e) {
  return ot(e) ? e.toList() : F(e) ? e.toMap() : e.toSet();
}
var Qp = "5.1.3", Xp = U;
const Dd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Collection: U,
  Iterable: Xp,
  List: kr,
  Map: ce,
  OrderedMap: Rt,
  OrderedSet: Pe,
  PairSorting: Hp,
  Range: uu,
  Record: j,
  Repeat: Yp,
  Seq: V,
  Set: Br,
  Stack: Wn,
  fromJS: Zp,
  get: is,
  getIn: ws,
  has: Wa,
  hasIn: cu,
  hash: nt,
  is: B,
  isAssociative: Nn,
  isCollection: st,
  isImmutable: wt,
  isIndexed: ot,
  isKeyed: F,
  isList: ys,
  isMap: kn,
  isOrdered: At,
  isOrderedMap: Qi,
  isOrderedSet: vs,
  isPlainObject: ns,
  isRecord: te,
  isSeq: Ln,
  isSet: Kn,
  isStack: bn,
  isValueObject: Mi,
  merge: Ep,
  mergeDeep: Mp,
  mergeDeepWith: Ip,
  mergeWith: xp,
  remove: Ka,
  removeIn: Ya,
  set: Ha,
  setIn: Va,
  update: as,
  updateIn: fe,
  version: Qp
}, Symbol.toStringTag, { value: "Module" }));
/**
* @vue/reactivity v3.5.16
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function t_(t) {
  const e = /* @__PURE__ */ Object.create(null);
  for (const r of t.split(",")) e[r] = 1;
  return (r) => r in e;
}
const e_ = Object.freeze({}), r_ = () => {
}, An = Object.assign, n_ = (t, e) => {
  const r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}, i_ = Object.prototype.hasOwnProperty, On = (t, e) => i_.call(t, e), jt = Array.isArray, we = (t) => Hn(t) === "[object Map]", s_ = (t) => Hn(t) === "[object Set]", Sr = (t) => typeof t == "function", o_ = (t) => typeof t == "string", Wr = (t) => typeof t == "symbol", He = (t) => t !== null && typeof t == "object", a_ = Object.prototype.toString, Hn = (t) => a_.call(t), _u = (t) => Hn(t).slice(8, -1), u_ = (t) => Hn(t) === "[object Object]", As = (t) => o_(t) && t !== "NaN" && t[0] !== "-" && "" + parseInt(t, 10) === t, f_ = (t) => {
  const e = /* @__PURE__ */ Object.create(null);
  return (r) => e[r] || (e[r] = t(r));
}, c_ = f_((t) => t.charAt(0).toUpperCase() + t.slice(1)), Ht = (t, e) => !Object.is(t, e), h_ = (t, e, r, n = !1) => {
  Object.defineProperty(t, e, {
    configurable: !0,
    enumerable: !1,
    writable: n,
    value: r
  });
};
function _t(t, ...e) {
  console.warn(`[Vue warn] ${t}`, ...e);
}
let K;
class du {
  constructor(e = !1) {
    this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = K, !e && K && (this.index = (K.scopes || (K.scopes = [])).push(
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
      const r = K;
      try {
        return K = this, e();
      } finally {
        K = r;
      }
    } else
      _t("cannot run an inactive effect scope.");
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = K, K = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (K = this.prevScope, this.prevScope = void 0);
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
function l_(t) {
  return new du(t);
}
function yu() {
  return K;
}
function p_(t, e = !1) {
  K ? K.cleanups.push(t) : e || _t(
    "onScopeDispose() is called when there is no active effect scope to be associated with."
  );
}
let E;
const __ = {
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
}, di = /* @__PURE__ */ new WeakSet();
class Ar {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, K && K.active && K.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, di.has(this) && (di.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || vu(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, go(this), mu(this);
    const e = E, r = ct;
    E = this, ct = !0;
    try {
      return this.fn();
    } finally {
      E !== this && _t(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), wu(this), E = e, ct = r, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        xs(e);
      this.deps = this.depsTail = void 0, go(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? di.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Pi(this) && this.run();
  }
  get dirty() {
    return Pi(this);
  }
}
let gu = 0, or, ar;
function vu(t, e = !1) {
  if (t.flags |= 8, e) {
    t.next = ar, ar = t;
    return;
  }
  t.next = or, or = t;
}
function Os() {
  gu++;
}
function Es() {
  if (--gu > 0)
    return;
  if (ar) {
    let e = ar;
    for (ar = void 0; e; ) {
      const r = e.next;
      e.next = void 0, e.flags &= -9, e = r;
    }
  }
  let t;
  for (; or; ) {
    let e = or;
    for (or = void 0; e; ) {
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
function mu(t) {
  for (let e = t.deps; e; e = e.nextDep)
    e.version = -1, e.prevActiveLink = e.dep.activeLink, e.dep.activeLink = e;
}
function wu(t) {
  let e, r = t.depsTail, n = r;
  for (; n; ) {
    const i = n.prevDep;
    n.version === -1 ? (n === r && (r = i), xs(n), d_(n)) : e = n, n.dep.activeLink = n.prevActiveLink, n.prevActiveLink = void 0, n = i;
  }
  t.deps = e, t.depsTail = r;
}
function Pi(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (e.dep.version !== e.version || e.dep.computed && (bu(e.dep.computed) || e.dep.version !== e.version))
      return !0;
  return !!t._dirty;
}
function bu(t) {
  if (t.flags & 4 && !(t.flags & 16) || (t.flags &= -17, t.globalVersion === Or) || (t.globalVersion = Or, !t.isSSR && t.flags & 128 && (!t.deps && !t._dirty || !Pi(t))))
    return;
  t.flags |= 2;
  const e = t.dep, r = E, n = ct;
  E = t, ct = !0;
  try {
    mu(t);
    const i = t.fn(t._value);
    (e.version === 0 || Ht(i, t._value)) && (t.flags |= 128, t._value = i, e.version++);
  } catch (i) {
    throw e.version++, i;
  } finally {
    E = r, ct = n, wu(t), t.flags &= -3;
  }
}
function xs(t, e = !1) {
  const { dep: r, prevSub: n, nextSub: i } = t;
  if (n && (n.nextSub = i, t.prevSub = void 0), i && (i.prevSub = n, t.nextSub = void 0), r.subsHead === t && (r.subsHead = i), r.subs === t && (r.subs = n, !n && r.computed)) {
    r.computed.flags &= -5;
    for (let s = r.computed.deps; s; s = s.nextDep)
      xs(s, !0);
  }
  !e && !--r.sc && r.map && r.map.delete(r.key);
}
function d_(t) {
  const { prevDep: e, nextDep: r } = t;
  e && (e.nextDep = r, t.prevDep = void 0), r && (r.prevDep = e, t.nextDep = void 0);
}
function y_(t, e) {
  t.effect instanceof Ar && (t = t.effect.fn);
  const r = new Ar(t);
  e && An(r, e);
  try {
    r.run();
  } catch (i) {
    throw r.stop(), i;
  }
  const n = r.run.bind(r);
  return n.effect = r, n;
}
function g_(t) {
  t.effect.stop();
}
let ct = !0;
const Ms = [];
function Is() {
  Ms.push(ct), ct = !1;
}
function v_() {
  Ms.push(ct), ct = !0;
}
function Ts() {
  const t = Ms.pop();
  ct = t === void 0 ? !0 : t;
}
function m_(t, e = !1) {
  E instanceof Ar ? E.cleanup = t : e || _t(
    "onEffectCleanup() was called when there was no active effect to associate with."
  );
}
function go(t) {
  const { cleanup: e } = t;
  if (t.cleanup = void 0, e) {
    const r = E;
    E = void 0;
    try {
      e();
    } finally {
      E = r;
    }
  }
}
let Or = 0;
class w_ {
  constructor(e, r) {
    this.sub = e, this.dep = r, this.version = r.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Gn {
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.subsHead = void 0;
  }
  track(e) {
    if (!E || !ct || E === this.computed)
      return;
    let r = this.activeLink;
    if (r === void 0 || r.sub !== E)
      r = this.activeLink = new w_(E, this), E.deps ? (r.prevDep = E.depsTail, E.depsTail.nextDep = r, E.depsTail = r) : E.deps = E.depsTail = r, Su(r);
    else if (r.version === -1 && (r.version = this.version, r.nextDep)) {
      const n = r.nextDep;
      n.prevDep = r.prevDep, r.prevDep && (r.prevDep.nextDep = n), r.prevDep = E.depsTail, r.nextDep = void 0, E.depsTail.nextDep = r, E.depsTail = r, E.deps === r && (E.deps = n);
    }
    return E.onTrack && E.onTrack(
      An(
        {
          effect: E
        },
        e
      )
    ), r;
  }
  trigger(e) {
    this.version++, Or++, this.notify(e);
  }
  notify(e) {
    Os();
    try {
      for (let r = this.subsHead; r; r = r.nextSub)
        r.sub.onTrigger && !(r.sub.flags & 8) && r.sub.onTrigger(
          An(
            {
              effect: r.sub
            },
            e
          )
        );
      for (let r = this.subs; r; r = r.prevSub)
        r.sub.notify() && r.sub.dep.notify();
    } finally {
      Es();
    }
  }
}
function Su(t) {
  if (t.dep.sc++, t.sub.flags & 4) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let n = e.deps; n; n = n.nextDep)
        Su(n);
    }
    const r = t.dep.subs;
    r !== t && (t.prevSub = r, r && (r.nextSub = t)), t.dep.subsHead === void 0 && (t.dep.subsHead = t), t.dep.subs = t;
  }
}
const En = /* @__PURE__ */ new WeakMap(), Gt = Symbol(
  "Object iterate"
), xn = Symbol(
  "Map keys iterate"
), $e = Symbol(
  "Array iterate"
);
function J(t, e, r) {
  if (ct && E) {
    let n = En.get(t);
    n || En.set(t, n = /* @__PURE__ */ new Map());
    let i = n.get(r);
    i || (n.set(r, i = new Gn()), i.map = n, i.key = r), i.track({
      target: t,
      type: e,
      key: r
    });
  }
}
function Nt(t, e, r, n, i, s) {
  const o = En.get(t);
  if (!o) {
    Or++;
    return;
  }
  const a = (u) => {
    u && u.trigger({
      target: t,
      type: e,
      key: r,
      newValue: n,
      oldValue: i,
      oldTarget: s
    });
  };
  if (Os(), e === "clear")
    o.forEach(a);
  else {
    const u = jt(t), f = u && As(r);
    if (u && r === "length") {
      const c = Number(n);
      o.forEach((h, l) => {
        (l === "length" || l === $e || !Wr(l) && l >= c) && a(h);
      });
    } else
      switch ((r !== void 0 || o.has(void 0)) && a(o.get(r)), f && a(o.get($e)), e) {
        case "add":
          u ? f && a(o.get("length")) : (a(o.get(Gt)), we(t) && a(o.get(xn)));
          break;
        case "delete":
          u || (a(o.get(Gt)), we(t) && a(o.get(xn)));
          break;
        case "set":
          we(t) && a(o.get(Gt));
          break;
      }
  }
  Es();
}
function b_(t, e) {
  const r = En.get(t);
  return r && r.get(e);
}
function ne(t) {
  const e = M(t);
  return e === t ? e : (J(e, "iterate", $e), vt(t) ? e : e.map(H));
}
function Vn(t) {
  return J(t = M(t), "iterate", $e), t;
}
const S_ = {
  __proto__: null,
  [Symbol.iterator]() {
    return yi(this, Symbol.iterator, H);
  },
  concat(...t) {
    return ne(this).concat(
      ...t.map((e) => jt(e) ? ne(e) : e)
    );
  },
  entries() {
    return yi(this, "entries", (t) => (t[1] = H(t[1]), t));
  },
  every(t, e) {
    return $t(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return $t(this, "filter", t, e, (r) => r.map(H), arguments);
  },
  find(t, e) {
    return $t(this, "find", t, e, H, arguments);
  },
  findIndex(t, e) {
    return $t(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return $t(this, "findLast", t, e, H, arguments);
  },
  findLastIndex(t, e) {
    return $t(this, "findLastIndex", t, e, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(t, e) {
    return $t(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return gi(this, "includes", t);
  },
  indexOf(...t) {
    return gi(this, "indexOf", t);
  },
  join(t) {
    return ne(this).join(t);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...t) {
    return gi(this, "lastIndexOf", t);
  },
  map(t, e) {
    return $t(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return Qe(this, "pop");
  },
  push(...t) {
    return Qe(this, "push", t);
  },
  reduce(t, ...e) {
    return vo(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return vo(this, "reduceRight", t, e);
  },
  shift() {
    return Qe(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(t, e) {
    return $t(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return Qe(this, "splice", t);
  },
  toReversed() {
    return ne(this).toReversed();
  },
  toSorted(t) {
    return ne(this).toSorted(t);
  },
  toSpliced(...t) {
    return ne(this).toSpliced(...t);
  },
  unshift(...t) {
    return Qe(this, "unshift", t);
  },
  values() {
    return yi(this, "values", H);
  }
};
function yi(t, e, r) {
  const n = Vn(t), i = n[e]();
  return n !== t && !vt(t) && (i._next = i.next, i.next = () => {
    const s = i._next();
    return s.value && (s.value = r(s.value)), s;
  }), i;
}
const A_ = Array.prototype;
function $t(t, e, r, n, i, s) {
  const o = Vn(t), a = o !== t && !vt(t), u = o[e];
  if (u !== A_[e]) {
    const h = u.apply(t, s);
    return a ? H(h) : h;
  }
  let f = r;
  o !== t && (a ? f = function(h, l) {
    return r.call(this, H(h), l, t);
  } : r.length > 2 && (f = function(h, l) {
    return r.call(this, h, l, t);
  }));
  const c = u.call(o, f, n);
  return a && i ? i(c) : c;
}
function vo(t, e, r, n) {
  const i = Vn(t);
  let s = r;
  return i !== t && (vt(t) ? r.length > 3 && (s = function(o, a, u) {
    return r.call(this, o, a, u, t);
  }) : s = function(o, a, u) {
    return r.call(this, o, H(a), u, t);
  }), i[e](s, ...n);
}
function gi(t, e, r) {
  const n = M(t);
  J(n, "iterate", $e);
  const i = n[e](...r);
  return (i === -1 || i === !1) && Fs(r[0]) ? (r[0] = M(r[0]), n[e](...r)) : i;
}
function Qe(t, e, r = []) {
  Is(), Os();
  const n = M(t)[e].apply(t, r);
  return Es(), Ts(), n;
}
const O_ = /* @__PURE__ */ t_("__proto__,__v_isRef,__isVue"), Au = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((t) => t !== "arguments" && t !== "caller").map((t) => Symbol[t]).filter(Wr)
);
function E_(t) {
  Wr(t) || (t = String(t));
  const e = M(this);
  return J(e, "has", t), e.hasOwnProperty(t);
}
class Ou {
  constructor(e = !1, r = !1) {
    this._isReadonly = e, this._isShallow = r;
  }
  get(e, r, n) {
    if (r === "__v_skip") return e.__v_skip;
    const i = this._isReadonly, s = this._isShallow;
    if (r === "__v_isReactive")
      return !i;
    if (r === "__v_isReadonly")
      return i;
    if (r === "__v_isShallow")
      return s;
    if (r === "__v_raw")
      return n === (i ? s ? zu : Tu : s ? Iu : Mu).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const o = jt(e);
    if (!i) {
      let u;
      if (o && (u = S_[r]))
        return u;
      if (r === "hasOwnProperty")
        return E_;
    }
    const a = Reflect.get(
      e,
      r,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      X(e) ? e : n
    );
    return (Wr(r) ? Au.has(r) : O_(r)) || (i || J(e, "get", r), s) ? a : X(a) ? o && As(r) ? a : a.value : He(a) ? i ? Rs(a) : zs(a) : a;
  }
}
class Eu extends Ou {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, r, n, i) {
    let s = e[r];
    if (!this._isShallow) {
      const u = Qt(s);
      if (!vt(n) && !Qt(n) && (s = M(s), n = M(n)), !jt(e) && X(s) && !X(n))
        return u ? !1 : (s.value = n, !0);
    }
    const o = jt(e) && As(r) ? Number(r) < e.length : On(e, r), a = Reflect.set(
      e,
      r,
      n,
      X(e) ? e : i
    );
    return e === M(i) && (o ? Ht(n, s) && Nt(e, "set", r, n, s) : Nt(e, "add", r, n)), a;
  }
  deleteProperty(e, r) {
    const n = On(e, r), i = e[r], s = Reflect.deleteProperty(e, r);
    return s && n && Nt(e, "delete", r, void 0, i), s;
  }
  has(e, r) {
    const n = Reflect.has(e, r);
    return (!Wr(r) || !Au.has(r)) && J(e, "has", r), n;
  }
  ownKeys(e) {
    return J(
      e,
      "iterate",
      jt(e) ? "length" : Gt
    ), Reflect.ownKeys(e);
  }
}
class xu extends Ou {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, r) {
    return _t(
      `Set operation on key "${String(r)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, r) {
    return _t(
      `Delete operation on key "${String(r)}" failed: target is readonly.`,
      e
    ), !0;
  }
}
const x_ = /* @__PURE__ */ new Eu(), M_ = /* @__PURE__ */ new xu(), I_ = /* @__PURE__ */ new Eu(!0), T_ = /* @__PURE__ */ new xu(!0), Ci = (t) => t, nn = (t) => Reflect.getPrototypeOf(t);
function z_(t, e, r) {
  return function(...n) {
    const i = this.__v_raw, s = M(i), o = we(s), a = t === "entries" || t === Symbol.iterator && o, u = t === "keys" && o, f = i[t](...n), c = r ? Ci : e ? Mn : H;
    return !e && J(
      s,
      "iterate",
      u ? xn : Gt
    ), {
      // iterator protocol
      next() {
        const { value: h, done: l } = f.next();
        return l ? { value: h, done: l } : {
          value: a ? [c(h[0]), c(h[1])] : c(h),
          done: l
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function sn(t) {
  return function(...e) {
    {
      const r = e[0] ? `on key "${e[0]}" ` : "";
      _t(
        `${c_(t)} operation ${r}failed: target is readonly.`,
        M(this)
      );
    }
    return t === "delete" ? !1 : t === "clear" ? void 0 : this;
  };
}
function R_(t, e) {
  const r = {
    get(i) {
      const s = this.__v_raw, o = M(s), a = M(i);
      t || (Ht(i, a) && J(o, "get", i), J(o, "get", a));
      const { has: u } = nn(o), f = e ? Ci : t ? Mn : H;
      if (u.call(o, i))
        return f(s.get(i));
      if (u.call(o, a))
        return f(s.get(a));
      s !== o && s.get(i);
    },
    get size() {
      const i = this.__v_raw;
      return !t && J(M(i), "iterate", Gt), Reflect.get(i, "size", i);
    },
    has(i) {
      const s = this.__v_raw, o = M(s), a = M(i);
      return t || (Ht(i, a) && J(o, "has", i), J(o, "has", a)), i === a ? s.has(i) : s.has(i) || s.has(a);
    },
    forEach(i, s) {
      const o = this, a = o.__v_raw, u = M(a), f = e ? Ci : t ? Mn : H;
      return !t && J(u, "iterate", Gt), a.forEach((c, h) => i.call(s, f(c), f(h), o));
    }
  };
  return An(
    r,
    t ? {
      add: sn("add"),
      set: sn("set"),
      delete: sn("delete"),
      clear: sn("clear")
    } : {
      add(i) {
        !e && !vt(i) && !Qt(i) && (i = M(i));
        const s = M(this);
        return nn(s).has.call(s, i) || (s.add(i), Nt(s, "add", i, i)), this;
      },
      set(i, s) {
        !e && !vt(s) && !Qt(s) && (s = M(s));
        const o = M(this), { has: a, get: u } = nn(o);
        let f = a.call(o, i);
        f ? mo(o, a, i) : (i = M(i), f = a.call(o, i));
        const c = u.call(o, i);
        return o.set(i, s), f ? Ht(s, c) && Nt(o, "set", i, s, c) : Nt(o, "add", i, s), this;
      },
      delete(i) {
        const s = M(this), { has: o, get: a } = nn(s);
        let u = o.call(s, i);
        u ? mo(s, o, i) : (i = M(i), u = o.call(s, i));
        const f = a ? a.call(s, i) : void 0, c = s.delete(i);
        return u && Nt(s, "delete", i, void 0, f), c;
      },
      clear() {
        const i = M(this), s = i.size !== 0, o = we(i) ? new Map(i) : new Set(i), a = i.clear();
        return s && Nt(
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
    r[i] = z_(i, t, e);
  }), r;
}
function Yn(t, e) {
  const r = R_(t, e);
  return (n, i, s) => i === "__v_isReactive" ? !t : i === "__v_isReadonly" ? t : i === "__v_raw" ? n : Reflect.get(
    On(r, i) && i in n ? r : n,
    i,
    s
  );
}
const F_ = {
  get: /* @__PURE__ */ Yn(!1, !1)
}, P_ = {
  get: /* @__PURE__ */ Yn(!1, !0)
}, C_ = {
  get: /* @__PURE__ */ Yn(!0, !1)
}, $_ = {
  get: /* @__PURE__ */ Yn(!0, !0)
};
function mo(t, e, r) {
  const n = M(r);
  if (n !== r && e.call(t, n)) {
    const i = _u(t);
    _t(
      `Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const Mu = /* @__PURE__ */ new WeakMap(), Iu = /* @__PURE__ */ new WeakMap(), Tu = /* @__PURE__ */ new WeakMap(), zu = /* @__PURE__ */ new WeakMap();
function q_(t) {
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
function N_(t) {
  return t.__v_skip || !Object.isExtensible(t) ? 0 : q_(_u(t));
}
function zs(t) {
  return Qt(t) ? t : Zn(
    t,
    !1,
    x_,
    F_,
    Mu
  );
}
function L_(t) {
  return Zn(
    t,
    !1,
    I_,
    P_,
    Iu
  );
}
function Rs(t) {
  return Zn(
    t,
    !0,
    M_,
    C_,
    Tu
  );
}
function j_(t) {
  return Zn(
    t,
    !0,
    T_,
    $_,
    zu
  );
}
function Zn(t, e, r, n, i) {
  if (!He(t))
    return _t(
      `value cannot be made ${e ? "readonly" : "reactive"}: ${String(
        t
      )}`
    ), t;
  if (t.__v_raw && !(e && t.__v_isReactive))
    return t;
  const s = N_(t);
  if (s === 0)
    return t;
  const o = i.get(t);
  if (o)
    return o;
  const a = new Proxy(
    t,
    s === 2 ? n : r
  );
  return i.set(t, a), a;
}
function be(t) {
  return Qt(t) ? be(t.__v_raw) : !!(t && t.__v_isReactive);
}
function Qt(t) {
  return !!(t && t.__v_isReadonly);
}
function vt(t) {
  return !!(t && t.__v_isShallow);
}
function Fs(t) {
  return t ? !!t.__v_raw : !1;
}
function M(t) {
  const e = t && t.__v_raw;
  return e ? M(e) : t;
}
function D_(t) {
  return !On(t, "__v_skip") && Object.isExtensible(t) && h_(t, "__v_skip", !0), t;
}
const H = (t) => He(t) ? zs(t) : t, Mn = (t) => He(t) ? Rs(t) : t;
function X(t) {
  return t ? t.__v_isRef === !0 : !1;
}
function Ru(t) {
  return Fu(t, !1);
}
function k_(t) {
  return Fu(t, !0);
}
function Fu(t, e) {
  return X(t) ? t : new B_(t, e);
}
class B_ {
  constructor(e, r) {
    this.dep = new Gn(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = r ? e : M(e), this._value = r ? e : H(e), this.__v_isShallow = r;
  }
  get value() {
    return this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }), this._value;
  }
  set value(e) {
    const r = this._rawValue, n = this.__v_isShallow || vt(e) || Qt(e);
    e = n ? e : M(e), Ht(e, r) && (this._rawValue = e, this._value = n ? e : H(e), this.dep.trigger({
      target: this,
      type: "set",
      key: "value",
      newValue: e,
      oldValue: r
    }));
  }
}
function U_(t) {
  t.dep && t.dep.trigger({
    target: t,
    type: "set",
    key: "value",
    newValue: t._value
  });
}
function Ps(t) {
  return X(t) ? t.value : t;
}
function W_(t) {
  return Sr(t) ? t() : Ps(t);
}
const K_ = {
  get: (t, e, r) => e === "__v_raw" ? t : Ps(Reflect.get(t, e, r)),
  set: (t, e, r, n) => {
    const i = t[e];
    return X(i) && !X(r) ? (i.value = r, !0) : Reflect.set(t, e, r, n);
  }
};
function H_(t) {
  return be(t) ? t : new Proxy(t, K_);
}
class G_ {
  constructor(e) {
    this.__v_isRef = !0, this._value = void 0;
    const r = this.dep = new Gn(), { get: n, set: i } = e(r.track.bind(r), r.trigger.bind(r));
    this._get = n, this._set = i;
  }
  get value() {
    return this._value = this._get();
  }
  set value(e) {
    this._set(e);
  }
}
function V_(t) {
  return new G_(t);
}
function Y_(t) {
  Fs(t) || _t("toRefs() expects a reactive object but received a plain one.");
  const e = jt(t) ? new Array(t.length) : {};
  for (const r in t)
    e[r] = Pu(t, r);
  return e;
}
class Z_ {
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
    return b_(M(this._object), this._key);
  }
}
class J_ {
  constructor(e) {
    this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
  }
  get value() {
    return this._value = this._getter();
  }
}
function Q_(t, e, r) {
  return X(t) ? t : Sr(t) ? new J_(t) : He(t) && arguments.length > 1 ? Pu(t, e, r) : Ru(t);
}
function Pu(t, e, r) {
  const n = t[e];
  return X(n) ? n : new Z_(t, e, r);
}
class X_ {
  constructor(e, r, n) {
    this.fn = e, this.setter = r, this._value = void 0, this.dep = new Gn(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Or - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !r, this.isSSR = n;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    E !== this)
      return vu(this, !0), !0;
  }
  get value() {
    const e = this.dep.track({
      target: this,
      type: "get",
      key: "value"
    });
    return bu(this), e && (e.version = this.dep.version), this._value;
  }
  set value(e) {
    this.setter ? this.setter(e) : _t("Write operation failed: computed value is readonly");
  }
}
function td(t, e, r = !1) {
  let n, i;
  Sr(t) ? n = t : (n = t.get, i = t.set);
  const s = new X_(n, i, r);
  return e && !r && (s.onTrack = e.onTrack, s.onTrigger = e.onTrigger), s;
}
const ed = {
  GET: "get",
  HAS: "has",
  ITERATE: "iterate"
}, rd = {
  SET: "set",
  ADD: "add",
  DELETE: "delete",
  CLEAR: "clear"
}, nd = {
  SKIP: "__v_skip",
  IS_REACTIVE: "__v_isReactive",
  IS_READONLY: "__v_isReadonly",
  IS_SHALLOW: "__v_isShallow",
  RAW: "__v_raw",
  IS_REF: "__v_isRef"
}, id = {
  WATCH_GETTER: 2,
  2: "WATCH_GETTER",
  WATCH_CALLBACK: 3,
  3: "WATCH_CALLBACK",
  WATCH_CLEANUP: 4,
  4: "WATCH_CLEANUP"
}, on = {}, In = /* @__PURE__ */ new WeakMap();
let Wt;
function sd() {
  return Wt;
}
function Cu(t, e = !1, r = Wt) {
  if (r) {
    let n = In.get(r);
    n || In.set(r, n = []), n.push(t);
  } else e || _t(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function od(t, e, r = e_) {
  const { immediate: n, deep: i, once: s, scheduler: o, augmentJob: a, call: u } = r, f = (b) => {
    (r.onWarn || _t)(
      "Invalid watch source: ",
      b,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, c = (b) => i ? b : vt(b) || i === !1 || i === 0 ? Lt(b, 1) : Lt(b);
  let h, l, p, _, d = !1, y = !1;
  if (X(t) ? (l = () => t.value, d = vt(t)) : be(t) ? (l = () => c(t), d = !0) : jt(t) ? (y = !0, d = t.some((b) => be(b) || vt(b)), l = () => t.map((b) => {
    if (X(b))
      return b.value;
    if (be(b))
      return c(b);
    if (Sr(b))
      return u ? u(b, 2) : b();
    f(b);
  })) : Sr(t) ? e ? l = u ? () => u(t, 2) : t : l = () => {
    if (p) {
      Is();
      try {
        p();
      } finally {
        Ts();
      }
    }
    const b = Wt;
    Wt = h;
    try {
      return u ? u(t, 3, [_]) : t(_);
    } finally {
      Wt = b;
    }
  } : (l = r_, f(t)), e && i) {
    const b = l, A = i === !0 ? 1 / 0 : i;
    l = () => Lt(b(), A);
  }
  const m = yu(), v = () => {
    h.stop(), m && m.active && n_(m.effects, h);
  };
  if (s && e) {
    const b = e;
    e = (...A) => {
      b(...A), v();
    };
  }
  let w = y ? new Array(t.length).fill(on) : on;
  const g = (b) => {
    if (!(!(h.flags & 1) || !h.dirty && !b))
      if (e) {
        const A = h.run();
        if (i || d || (y ? A.some((T, xt) => Ht(T, w[xt])) : Ht(A, w))) {
          p && p();
          const T = Wt;
          Wt = h;
          try {
            const xt = [
              A,
              // pass undefined as the old value when it's changed for the first time
              w === on ? void 0 : y && w[0] === on ? [] : w,
              _
            ];
            w = A, u ? u(e, 3, xt) : (
              // @ts-expect-error
              e(...xt)
            );
          } finally {
            Wt = T;
          }
        }
      } else
        h.run();
  };
  return a && a(g), h = new Ar(l), h.scheduler = o ? () => o(g, !1) : g, _ = (b) => Cu(b, !1, h), p = h.onStop = () => {
    const b = In.get(h);
    if (b) {
      if (u)
        u(b, 4);
      else
        for (const A of b) A();
      In.delete(h);
    }
  }, h.onTrack = r.onTrack, h.onTrigger = r.onTrigger, e ? n ? g(!0) : w = h.run() : o ? o(g.bind(null, !0), !0) : h.run(), v.pause = h.pause.bind(h), v.resume = h.resume.bind(h), v.stop = v, v;
}
function Lt(t, e = 1 / 0, r) {
  if (e <= 0 || !He(t) || t.__v_skip || (r = r || /* @__PURE__ */ new Set(), r.has(t)))
    return t;
  if (r.add(t), e--, X(t))
    Lt(t.value, e, r);
  else if (jt(t))
    for (let n = 0; n < t.length; n++)
      Lt(t[n], e, r);
  else if (s_(t) || we(t))
    t.forEach((n) => {
      Lt(n, e, r);
    });
  else if (u_(t)) {
    for (const n in t)
      Lt(t[n], e, r);
    for (const n of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, n) && Lt(t[n], e, r);
  }
  return t;
}
const kd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ARRAY_ITERATE_KEY: $e,
  EffectFlags: __,
  EffectScope: du,
  ITERATE_KEY: Gt,
  MAP_KEY_ITERATE_KEY: xn,
  ReactiveEffect: Ar,
  ReactiveFlags: nd,
  TrackOpTypes: ed,
  TriggerOpTypes: rd,
  WatchErrorCodes: id,
  computed: td,
  customRef: V_,
  effect: y_,
  effectScope: l_,
  enableTracking: v_,
  getCurrentScope: yu,
  getCurrentWatcher: sd,
  isProxy: Fs,
  isReactive: be,
  isReadonly: Qt,
  isRef: X,
  isShallow: vt,
  markRaw: D_,
  onEffectCleanup: m_,
  onScopeDispose: p_,
  onWatcherCleanup: Cu,
  pauseTracking: Is,
  proxyRefs: H_,
  reactive: zs,
  reactiveReadArray: ne,
  readonly: Rs,
  ref: Ru,
  resetTracking: Ts,
  shallowReactive: L_,
  shallowReadArray: Vn,
  shallowReadonly: j_,
  shallowRef: k_,
  stop: g_,
  toRaw: M,
  toReactive: H,
  toReadonly: Mn,
  toRef: Q_,
  toRefs: Y_,
  toValue: W_,
  track: J,
  traverse: Lt,
  trigger: Nt,
  triggerRef: U_,
  unref: Ps,
  watch: od
}, Symbol.toStringTag, { value: "Module" })), ad = Symbol.for("preact-signals"), zt = 1, qe = 2, Er = 4, Ge = 8, hn = 16, Ne = 32;
function Jn() {
  fr++;
}
function Qn() {
  if (fr > 1) {
    fr--;
    return;
  }
  let t, e = !1;
  for (; ur !== void 0; ) {
    let r = ur;
    for (ur = void 0, $i++; r !== void 0; ) {
      const n = r._nextBatchedEffect;
      if (r._nextBatchedEffect = void 0, r._flags &= ~qe, !(r._flags & Ge) && qu(r))
        try {
          r._callback();
        } catch (i) {
          e || (t = i, e = !0);
        }
      r = n;
    }
  }
  if ($i = 0, fr--, e)
    throw t;
}
function ud(t) {
  if (fr > 0)
    return t();
  Jn();
  try {
    return t();
  } finally {
    Qn();
  }
}
let I;
function fd(t) {
  const e = I;
  I = void 0;
  try {
    return t();
  } finally {
    I = e;
  }
}
let ur, fr = 0, $i = 0, Tn = 0;
function $u(t) {
  if (I === void 0)
    return;
  let e = t._node;
  if (e === void 0 || e._target !== I)
    return e = {
      _version: 0,
      _source: t,
      _prevSource: I._sources,
      _nextSource: void 0,
      _target: I,
      _prevTarget: void 0,
      _nextTarget: void 0,
      _rollbackNode: e
    }, I._sources !== void 0 && (I._sources._nextSource = e), I._sources = e, t._node = e, I._flags & Ne && t._subscribe(e), e;
  if (e._version === -1)
    return e._version = 0, e._nextSource !== void 0 && (e._nextSource._prevSource = e._prevSource, e._prevSource !== void 0 && (e._prevSource._nextSource = e._nextSource), e._prevSource = I._sources, e._nextSource = void 0, I._sources._nextSource = e, I._sources = e), e;
}
function Z(t) {
  this._value = t, this._version = 0, this._node = void 0, this._targets = void 0;
}
Z.prototype.brand = ad;
Z.prototype._refresh = function() {
  return !0;
};
Z.prototype._subscribe = function(t) {
  this._targets !== t && t._prevTarget === void 0 && (t._nextTarget = this._targets, this._targets !== void 0 && (this._targets._prevTarget = t), this._targets = t);
};
Z.prototype._unsubscribe = function(t) {
  if (this._targets !== void 0) {
    const e = t._prevTarget, r = t._nextTarget;
    e !== void 0 && (e._nextTarget = r, t._prevTarget = void 0), r !== void 0 && (r._prevTarget = e, t._nextTarget = void 0), t === this._targets && (this._targets = r);
  }
};
Z.prototype.subscribe = function(t) {
  return Du(() => {
    const e = this.value, r = I;
    I = void 0;
    try {
      t(e);
    } finally {
      I = r;
    }
  });
};
Z.prototype.valueOf = function() {
  return this.value;
};
Z.prototype.toString = function() {
  return this.value + "";
};
Z.prototype.toJSON = function() {
  return this.value;
};
Z.prototype.peek = function() {
  const t = I;
  I = void 0;
  try {
    return this.value;
  } finally {
    I = t;
  }
};
Object.defineProperty(Z.prototype, "value", {
  get() {
    const t = $u(this);
    return t !== void 0 && (t._version = this._version), this._value;
  },
  set(t) {
    if (t !== this._value) {
      if ($i > 100)
        throw new Error("Cycle detected");
      this._value = t, this._version++, Tn++, Jn();
      try {
        for (let e = this._targets; e !== void 0; e = e._nextTarget)
          e._target._notify();
      } finally {
        Qn();
      }
    }
  }
});
function cd(t) {
  return new Z(t);
}
function qu(t) {
  for (let e = t._sources; e !== void 0; e = e._nextSource)
    if (e._source._version !== e._version || !e._source._refresh() || e._source._version !== e._version)
      return !0;
  return !1;
}
function Nu(t) {
  for (let e = t._sources; e !== void 0; e = e._nextSource) {
    const r = e._source._node;
    if (r !== void 0 && (e._rollbackNode = r), e._source._node = e, e._version = -1, e._nextSource === void 0) {
      t._sources = e;
      break;
    }
  }
}
function Lu(t) {
  let e = t._sources, r;
  for (; e !== void 0; ) {
    const n = e._prevSource;
    e._version === -1 ? (e._source._unsubscribe(e), n !== void 0 && (n._nextSource = e._nextSource), e._nextSource !== void 0 && (e._nextSource._prevSource = n)) : r = e, e._source._node = e._rollbackNode, e._rollbackNode !== void 0 && (e._rollbackNode = void 0), e = n;
  }
  t._sources = r;
}
function pe(t) {
  Z.call(this, void 0), this._fn = t, this._sources = void 0, this._globalVersion = Tn - 1, this._flags = Er;
}
pe.prototype = new Z();
pe.prototype._refresh = function() {
  if (this._flags &= ~qe, this._flags & zt)
    return !1;
  if ((this._flags & (Er | Ne)) === Ne || (this._flags &= ~Er, this._globalVersion === Tn))
    return !0;
  if (this._globalVersion = Tn, this._flags |= zt, this._version > 0 && !qu(this))
    return this._flags &= ~zt, !0;
  const t = I;
  try {
    Nu(this), I = this;
    const e = this._fn();
    (this._flags & hn || this._value !== e || this._version === 0) && (this._value = e, this._flags &= ~hn, this._version++);
  } catch (e) {
    this._value = e, this._flags |= hn, this._version++;
  }
  return I = t, Lu(this), this._flags &= ~zt, !0;
};
pe.prototype._subscribe = function(t) {
  if (this._targets === void 0) {
    this._flags |= Er | Ne;
    for (let e = this._sources; e !== void 0; e = e._nextSource)
      e._source._subscribe(e);
  }
  Z.prototype._subscribe.call(this, t);
};
pe.prototype._unsubscribe = function(t) {
  if (this._targets !== void 0 && (Z.prototype._unsubscribe.call(this, t), this._targets === void 0)) {
    this._flags &= ~Ne;
    for (let e = this._sources; e !== void 0; e = e._nextSource)
      e._source._unsubscribe(e);
  }
};
pe.prototype._notify = function() {
  if (!(this._flags & qe)) {
    this._flags |= Er | qe;
    for (let t = this._targets; t !== void 0; t = t._nextTarget)
      t._target._notify();
  }
};
Object.defineProperty(pe.prototype, "value", {
  get() {
    if (this._flags & zt)
      throw new Error("Cycle detected");
    const t = $u(this);
    if (this._refresh(), t !== void 0 && (t._version = this._version), this._flags & hn)
      throw this._value;
    return this._value;
  }
});
function hd(t) {
  return new pe(t);
}
function ju(t) {
  const e = t._cleanup;
  if (t._cleanup = void 0, typeof e == "function") {
    Jn();
    const r = I;
    I = void 0;
    try {
      e();
    } catch (n) {
      throw t._flags &= ~zt, t._flags |= Ge, Cs(t), n;
    } finally {
      I = r, Qn();
    }
  }
}
function Cs(t) {
  for (let e = t._sources; e !== void 0; e = e._nextSource)
    e._source._unsubscribe(e);
  t._fn = void 0, t._sources = void 0, ju(t);
}
function ld(t) {
  if (I !== this)
    throw new Error("Out-of-order effect");
  Lu(this), I = t, this._flags &= ~zt, this._flags & Ge && Cs(this), Qn();
}
function Kr(t) {
  this._fn = t, this._cleanup = void 0, this._sources = void 0, this._nextBatchedEffect = void 0, this._flags = Ne;
}
Kr.prototype._callback = function() {
  const t = this._start();
  try {
    if (this._flags & Ge || this._fn === void 0) return;
    const e = this._fn();
    typeof e == "function" && (this._cleanup = e);
  } finally {
    t();
  }
};
Kr.prototype._start = function() {
  if (this._flags & zt)
    throw new Error("Cycle detected");
  this._flags |= zt, this._flags &= ~Ge, ju(this), Nu(this), Jn();
  const t = I;
  return I = this, ld.bind(this, t);
};
Kr.prototype._notify = function() {
  this._flags & qe || (this._flags |= qe, this._nextBatchedEffect = ur, ur = this);
};
Kr.prototype._dispose = function() {
  this._flags |= Ge, this._flags & zt || Cs(this);
};
function Du(t) {
  const e = new Kr(t);
  try {
    e._callback();
  } catch (r) {
    throw e._dispose(), r;
  }
  return e._dispose.bind(e);
}
const Bd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Signal: Z,
  batch: ud,
  computed: hd,
  effect: Du,
  signal: cd,
  untracked: fd
}, Symbol.toStringTag, { value: "Module" }));
function qi(t, e) {
  if (t === e) return !0;
  if (t && e && typeof t == "object" && typeof e == "object") {
    if (t.constructor !== e.constructor) return !1;
    var r, n, i;
    if (Array.isArray(t)) {
      if (r = t.length, r != e.length) return !1;
      for (n = r; n-- !== 0; )
        if (!qi(t[n], e[n])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === e.source && t.flags === e.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === e.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === e.toString();
    if (i = Object.keys(t), r = i.length, r !== Object.keys(e).length) return !1;
    for (n = r; n-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(e, i[n])) return !1;
    for (n = r; n-- !== 0; ) {
      var s = i[n];
      if (!qi(t[s], e[s])) return !1;
    }
    return !0;
  }
  return t !== t && e !== e;
}
class pd {
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
    return qi(e, r);
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
class ku {
  static create(e, r) {
    return new ku(e, r);
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
    this.addOptionFromInstance(e, new pd(this.context, r));
  }
}
function _d(t) {
  return dd(t) && !yd(t);
}
function dd(t) {
  return !!t && typeof t == "object";
}
function yd(t) {
  var e = Object.prototype.toString.call(t);
  return e === "[object RegExp]" || e === "[object Date]" || md(t);
}
var gd = typeof Symbol == "function" && Symbol.for, vd = gd ? Symbol.for("react.element") : 60103;
function md(t) {
  return t.$$typeof === vd;
}
var wd = _d;
function bd(t) {
  return Array.isArray(t) ? [] : {};
}
function xr(t, e) {
  return e.clone !== !1 && e.isMergeableObject(t) ? Mr(bd(t), t, e) : t;
}
function Sd(t, e, r) {
  return t.concat(e).map(function(n) {
    return xr(n, r);
  });
}
function Ad(t, e) {
  if (!e.customMerge)
    return Mr;
  var r = e.customMerge(t);
  return typeof r == "function" ? r : Mr;
}
function Od(t) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(t).filter(function(e) {
    return Object.propertyIsEnumerable.call(t, e);
  }) : [];
}
function wo(t) {
  return Object.keys(t).concat(Od(t));
}
function Bu(t, e) {
  try {
    return e in t;
  } catch {
    return !1;
  }
}
function Ed(t, e) {
  return Bu(t, e) && !(Object.hasOwnProperty.call(t, e) && Object.propertyIsEnumerable.call(t, e));
}
function xd(t, e, r) {
  var n = {};
  return r.isMergeableObject(t) && wo(t).forEach(function(i) {
    n[i] = xr(t[i], r);
  }), wo(e).forEach(function(i) {
    Ed(t, i) || (Bu(t, i) && r.isMergeableObject(e[i]) ? n[i] = Ad(i, r)(t[i], e[i], r) : n[i] = xr(e[i], r));
  }), n;
}
function Mr(t, e, r) {
  r = r || {}, r.arrayMerge = r.arrayMerge || Sd, r.isMergeableObject = r.isMergeableObject || wd, r.cloneUnlessOtherwiseSpecified = xr;
  var n = Array.isArray(e), i = Array.isArray(t), s = n === i;
  return s ? n ? r.arrayMerge?.(t, e, r) : xd(t, e, r) : xr(e, r);
}
function Md(t, e) {
  if (!Array.isArray(t))
    throw new Error("first argument should be an array");
  return t.reduce(function(r, n) {
    return Mr(r, n, e);
  }, {});
}
Mr.all = Md;
function ye(t, e = 0, r = 1) {
  return Math.min(Math.max(t, e), r);
}
function Id(t, e, r) {
  t /= 255, e /= 255, r /= 255;
  const n = Math.max(t, e, r), i = Math.min(t, e, r);
  let s = 0, o, a = (n + i) / 2;
  if (n == i)
    s = o = 0;
  else {
    const u = n - i;
    switch (o = a > 0.5 ? u / (2 - n - i) : u / (n + i), n) {
      case t:
        s = (e - r) / u + (e < r ? 6 : 0);
        break;
      case e:
        s = (r - t) / u + 2;
        break;
      case r:
        s = (t - e) / u + 4;
        break;
    }
    s /= 6;
  }
  return { h: s, s: o, l: a };
}
function bo(t, e, r) {
  let n, i, s;
  if (e == 0)
    n = i = s = r;
  else {
    const o = (f, c, h) => (h < 0 && (h += 1), h > 1 && (h -= 1), h < 0.16666666666666666 ? f + (c - f) * 6 * h : h < 0.5 ? c : h < 0.6666666666666666 ? f + (c - f) * (0.6666666666666666 - h) * 6 : f), a = r < 0.5 ? r * (1 + e) : r + e - r * e, u = 2 * r - a;
    n = o(u, a, t + 1 / 3), i = o(u, a, t), s = o(u, a, t - 1 / 3);
  }
  return { r: n * 255, g: i * 255, b: s * 255 };
}
function Ud(t, e, r) {
  t /= 255, e /= 255, r /= 255;
  const n = Math.max(t, e, r), i = Math.min(t, e, r);
  let s = 0, o, a = n;
  const u = n - i;
  if (o = n == 0 ? 0 : u / n, n == i)
    s = 0;
  else {
    switch (n) {
      case t:
        s = (e - r) / u + (e < r ? 6 : 0);
        break;
      case e:
        s = (r - t) / u + 2;
        break;
      case r:
        s = (t - e) / u + 4;
        break;
    }
    s /= 6;
  }
  return { h: s, s: o, v: a };
}
function Td(t, e, r) {
  let n = 0, i = 0, s = 0;
  const o = Math.floor(t * 6), a = t * 6 - o, u = r * (1 - e), f = r * (1 - a * e), c = r * (1 - (1 - a) * e);
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
function Wd(t, e, r) {
  const n = r + e * Math.min(r, 1 - r), i = n === 0 ? 0 : 2 * (1 - r / n);
  return { h: t, s: i, v: n };
}
function Kd(t, e, r) {
  const n = (2 - e) * r / 2, i = e === 0 ? e : n <= 1 ? e * r / (2 - e * r) : e * r / (2 - e);
  return { h: t, s: i, l: n };
}
function zd(t) {
  typeof t == "string" && (t = t.replace("#", ""), t = t.length === 3 ? t.replace(/(\w)/g, "$1$1") : t, t = parseInt("0x" + t, 16));
  const e = t, r = e >> 16 & 255, n = e >> 8 & 255, i = e & 255;
  return { r, g: n, b: i };
}
function Rd(t, e, r) {
  const n = t.r + (e.r - t.r) * r, i = t.g + (e.g - t.g) * r, s = t.b + (e.b - t.b) * r;
  return { r: n, g: i, b: s };
}
const So = {
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
  static isColor(e) {
    return typeof e == "string" || typeof e == "number" || e instanceof at;
  }
  static parse(e) {
    const r = typeof e == "string";
    if (r && e.toLowerCase().startsWith("rgb")) {
      const n = e.match(/rgba?\s*\(([^)]+)\)\s*/i);
      if (n) {
        const i = n[1].split(",").map(parseInt), s = this.fromRGB(i[0], i[1], i[2]);
        return i.length === 4 && (s.alpha = i[3]), s;
      }
    } else if (r && e.startsWith("#") || typeof e == "number")
      return this.fromRGB(zd(e));
    if (r && So[e]) {
      const n = So[e];
      return this.fromRGB(n[0] * 255 >> 0, n[1] * 255 >> 0, n[2] * 255 >> 0);
    } else if (typeof e == "object" && e !== null)
      return this.fromRGB(e);
    return this.fromRGB(0, 0, 0);
  }
  static fromRGB(e, r, n) {
    return e !== null && typeof e == "object" ? new at(e.r, e.g, e.b) : new at(e, r, n);
  }
  static fromRGBA(e, r, n, i) {
    return e !== null && typeof e == "object" ? new at(e.r, e.g, e.b, r) : new at(e, r, n, i);
  }
  static fromHSL(e, r, n) {
    const { r: i, g: s, b: o } = bo(e, r, n);
    return new at(i, s, o);
  }
  static fromHSV(e, r, n) {
    const { r: i, g: s, b: o } = Td(e, r, n);
    return new at(i, s, o);
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
    return at.fromRGB(0, 0, 0).copy(this);
  }
  setRGB(e, r, n) {
    return this._r = e, this._g = r, this._b = n, this;
  }
  normalize() {
    return this.r = ye(this._r / 255, 0, 1), this.g = ye(this._g / 255, 0, 1), this.b = ye(this._b / 255, 0, 1), this;
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
    const { r: i, g: s, b: o } = Rd(e, r, n);
    return new at(i, s, o);
  }
  setRBG(e, r, n) {
    return this.r = e, this.g = r, this.b = n, this;
  }
  setRGBColor(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }
  // 变亮
  brighten(e) {
    const { h: r, s: n, l: i } = Id(this.r, this.g, this.b);
    return this.setRGBColor(bo(r, n, i * (1 + e)));
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
    return this.r = ye(this.r, e, r), this.g = ye(this.g, e, r), this.b = ye(this.b, e, r), this;
  }
  toCssRGB() {
    return `rgb(${Math.round(this.r)},${Math.round(this.g)},${Math.round(this.b)})`;
  }
}
export {
  Cd as Callbacks,
  at as Color,
  Fd as Event,
  et as EventEmitter,
  Pd as EventTarget,
  Dd as Immutable,
  ku as Options,
  $d as PriorityQueue,
  Ld as antvUtil,
  Mr as deepmerge,
  qi as fastDeepEqual,
  zd as hexToRgb,
  Wd as hslToHsv,
  bo as hslToRgb,
  Kd as hsvToHsl,
  Td as hsvToRgb,
  jd as immer,
  Rd as lerpColor,
  Nd as lodash,
  qd as radash,
  kd as reactivity,
  Id as rgbToHsl,
  Ud as rgbToHsv,
  Bd as signals
};
