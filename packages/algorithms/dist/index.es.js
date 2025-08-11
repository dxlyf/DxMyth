var u = /* @__PURE__ */ ((s) => (s[s.LESS_THAN = -1] = "LESS_THAN", s[s.BIGGER_THAN = 1] = "BIGGER_THAN", s[s.EQUALS = 0] = "EQUALS", s))(u || {});
function z(s, t, e) {
  const i = e(s, t);
  return i === -1 || i === 0;
}
function V(s, t, e) {
  const i = e(s, t);
  return i === 1 || i === 0;
}
function c(s, t) {
  return s === t ? 0 : s < t ? -1 : 1;
}
function d(s, t) {
  return s === t;
}
function m(s) {
  return s === null ? "NULL" : s === void 0 ? "UNDEFINED" : typeof s == "string" || s instanceof String ? `${s}` : s.toString();
}
function b(s, t, e) {
  [s[t], s[e]] = [s[e], s[t]];
}
function q(s) {
  return (t, e) => s(e, t);
}
function P(s, t) {
  return Number(s) - Number(t);
}
const et = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Compare: u,
  DOES_NOT_EXIST: -1,
  biggerEquals: V,
  defaultCompare: c,
  defaultDiff: P,
  defaultEquals: d,
  defaultToString: m,
  lesserEquals: z,
  reverseCompare: q,
  swap: b
}, Symbol.toStringTag, { value: "Module" }));
class wt {
  count;
  items;
  constructor() {
    this.count = 0, this.items = {};
  }
  push(t) {
    this.items[this.count] = t, this.count++;
  }
  pop() {
    if (this.isEmpty())
      return;
    this.count--;
    const t = this.items[this.count];
    return delete this.items[this.count], t;
  }
  peek() {
    if (!this.isEmpty())
      return this.items[this.count - 1];
  }
  isEmpty() {
    return this.count === 0;
  }
  size() {
    return this.count;
  }
  clear() {
    this.items = {}, this.count = 0;
  }
  toString() {
    if (this.isEmpty())
      return "";
    let t = `${this.items[0]}`;
    for (let e = 1; e < this.count; e++)
      t = `${t},${this.items[e]}`;
    return t;
  }
}
let v = class {
  constructor(t, e) {
    this.element = t, this.next = e;
  }
};
class j extends v {
  constructor(t, e, i) {
    super(t, e), this.element = t, this.next = e, this.prev = i;
  }
}
class A {
  constructor(t = d) {
    this.equalsFn = t;
  }
  count = 0;
  head;
  push(t) {
    const e = new v(t);
    let i;
    if (this.head == null)
      this.head = e;
    else {
      for (i = this.head; i.next != null; )
        i = i.next;
      i.next = e;
    }
    this.count++;
  }
  getElementAt(t) {
    if (t >= 0 && t <= this.count) {
      let e = this.head;
      for (let i = 0; i < t && e != null; i++)
        e = e.next;
      return e;
    }
  }
  insert(t, e) {
    if (e >= 0 && e <= this.count) {
      const i = new v(t);
      if (e === 0) {
        const r = this.head;
        i.next = r, this.head = i;
      } else {
        const r = this.getElementAt(e - 1);
        i.next = r.next, r.next = i;
      }
      return this.count++, !0;
    }
    return !1;
  }
  removeAt(t) {
    if (t >= 0 && t < this.count) {
      let e = this.head;
      if (t === 0)
        this.head = e.next;
      else {
        const i = this.getElementAt(t - 1);
        e = i.next, i.next = e.next;
      }
      return this.count--, e.element;
    }
  }
  remove(t) {
    const e = this.indexOf(t);
    return this.removeAt(e);
  }
  indexOf(t) {
    let e = this.head;
    for (let i = 0; i < this.size() && e != null; i++) {
      if (this.equalsFn(t, e.element))
        return i;
      e = e.next;
    }
    return -1;
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return this.count;
  }
  getHead() {
    return this.head;
  }
  clear() {
    this.head = void 0, this.count = 0;
  }
  toString() {
    if (this.head == null)
      return "";
    let t = `${this.head.element}`, e = this.head.next;
    for (let i = 1; i < this.size() && e != null; i++)
      t = `${t},${e.element}`, e = e.next;
    return t;
  }
}
class it extends A {
  constructor(t = d) {
    super(t), this.equalsFn = t;
  }
  head;
  tail;
  push(t) {
    const e = new j(t);
    this.head == null ? (this.head = e, this.tail = e) : (this.tail.next = e, e.prev = this.tail, this.tail = e), this.count++;
  }
  insert(t, e) {
    if (e >= 0 && e <= this.count) {
      const i = new j(t);
      let r = this.head;
      if (e === 0)
        this.head == null ? (this.head = i, this.tail = i) : (i.next = this.head, this.head.prev = i, this.head = i);
      else if (e === this.count)
        r = this.tail, r.next = i, i.prev = r, this.tail = i;
      else {
        const n = this.getElementAt(e - 1);
        r = n.next, i.next = r, n.next = i, r.prev = i, i.prev = n;
      }
      return this.count++, !0;
    }
    return !1;
  }
  removeAt(t) {
    if (t >= 0 && t < this.count) {
      let e = this.head;
      if (t === 0)
        this.head = this.head.next, this.count === 1 ? this.tail = void 0 : this.head.prev = void 0;
      else if (t === this.count - 1)
        e = this.tail, this.tail = e.prev, this.tail.next = void 0;
      else {
        e = this.getElementAt(t);
        const i = e.prev;
        i.next = e.next, e.next.prev = i;
      }
      return this.count--, e.element;
    }
  }
  indexOf(t) {
    let e = this.head, i = 0;
    for (; e != null; ) {
      if (this.equalsFn(t, e.element))
        return i;
      i++, e = e.next;
    }
    return -1;
  }
  getHead() {
    return this.head;
  }
  getTail() {
    return this.tail;
  }
  clear() {
    super.clear(), this.tail = void 0;
  }
  toString() {
    if (this.head == null)
      return "";
    let t = `${this.head.element}`, e = this.head.next;
    for (; e != null; )
      t = `${t},${e.element}`, e = e.next;
    return t;
  }
  inverseToString() {
    if (this.tail == null)
      return "";
    let t = `${this.tail.element}`, e = this.tail.prev;
    for (; e != null; )
      t = `${t},${e.element}`, e = e.prev;
    return t;
  }
}
class Rt extends A {
  constructor(t = d) {
    super(t), this.equalsFn = t;
  }
  push(t) {
    const e = new v(t);
    let i;
    this.head == null ? this.head = e : (i = this.getElementAt(this.size() - 1), i.next = e), e.next = this.head, this.count++;
  }
  insert(t, e) {
    if (e >= 0 && e <= this.count) {
      const i = new v(t);
      let r = this.head;
      if (e === 0)
        this.head == null ? (this.head = i, i.next = this.head) : (i.next = r, r = this.getElementAt(this.size() - 1), this.head = i, r.next = this.head);
      else {
        const n = this.getElementAt(e - 1);
        i.next = n.next, n.next = i;
      }
      return this.count++, !0;
    }
    return !1;
  }
  removeAt(t) {
    if (t >= 0 && t < this.count) {
      let e = this.head;
      if (t === 0)
        if (this.size() === 1)
          this.head = void 0;
        else {
          const i = this.head;
          e = this.getElementAt(this.size() - 1), this.head = this.head.next, e.next = this.head, e = i;
        }
      else {
        const i = this.getElementAt(t - 1);
        e = i.next, i.next = e.next;
      }
      return this.count--, e.element;
    }
  }
}
class Ct extends A {
  constructor(t = d, e = c) {
    super(t), this.equalsFn = t, this.compareFn = e;
  }
  push(t) {
    if (this.isEmpty())
      super.push(t);
    else {
      const e = this.getIndexNextSortedElement(t);
      super.insert(t, e);
    }
  }
  insert(t, e = 0) {
    return this.isEmpty() ? super.insert(t, 0) : (e = this.getIndexNextSortedElement(t), super.insert(t, e));
  }
  getIndexNextSortedElement(t) {
    let e = this.head, i = 0;
    for (; i < this.size() && e; i++) {
      if (this.compareFn(t, e.element) === u.LESS_THAN)
        return i;
      e = e.next;
    }
    return i;
  }
}
class Ht {
  items;
  constructor() {
    this.items = new it();
  }
  push(t) {
    this.items.push(t);
  }
  pop() {
    return this.isEmpty() ? void 0 : this.items.removeAt(this.size() - 1);
  }
  peek() {
    if (!this.isEmpty())
      return this.items.getElementAt(this.size() - 1).element;
  }
  isEmpty() {
    return this.items.isEmpty();
  }
  size() {
    return this.items.size();
  }
  clear() {
    this.items.clear();
  }
  toString() {
    return this.items.toString();
  }
}
class N {
  items;
  constructor() {
    this.items = {};
  }
  add(t) {
    return this.has(t) ? !1 : (this.items[t] = t, !0);
  }
  delete(t) {
    return this.has(t) ? (delete this.items[t], !0) : !1;
  }
  has(t) {
    return Object.prototype.hasOwnProperty.call(this.items, t);
  }
  values() {
    return Object.values(this.items);
  }
  union(t) {
    const e = new N();
    return this.values().forEach((i) => e.add(i)), t.values().forEach((i) => e.add(i)), e;
  }
  intersection(t) {
    const e = new N(), i = this.values(), r = t.values();
    let n = i, l = r;
    return r.length - i.length > 0 && (n = r, l = i), l.forEach((h) => {
      n.includes(h) && e.add(h);
    }), e;
  }
  difference(t) {
    const e = new N();
    return this.values().forEach((i) => {
      t.has(i) || e.add(i);
    }), e;
  }
  isSubsetOf(t) {
    return this.values().every((i) => t.has(i));
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return Object.keys(this.items).length;
  }
  clear() {
    this.items = {};
  }
  toString() {
    if (this.isEmpty())
      return "";
    const t = this.values();
    let e = `${t[0]}`;
    for (let i = 1; i < t.length; i++)
      e = `${e},${t[i].toString()}`;
    return e;
  }
}
class S {
  constructor(t, e) {
    this.key = t, this.value = e;
  }
  toString() {
    return `[#${this.key}: ${this.value}]`;
  }
}
class st {
  constructor(t = m) {
    this.toStrFn = t, this.table = {};
  }
  table;
  set(t, e) {
    if (t != null && e != null) {
      const i = this.toStrFn(t);
      return this.table[i] = new S(t, e), !0;
    }
    return !1;
  }
  get(t) {
    const e = this.table[this.toStrFn(t)];
    return e?.value;
  }
  hasKey(t) {
    return this.table[this.toStrFn(t)] != null;
  }
  remove(t) {
    return this.hasKey(t) ? (delete this.table[this.toStrFn(t)], !0) : !1;
  }
  values() {
    return this.keyValues().map(
      (t) => t.value
    );
  }
  keys() {
    return this.keyValues().map(
      (t) => t.key
    );
  }
  keyValues() {
    return Object.values(this.table);
  }
  forEach(t) {
    const e = this.keyValues();
    for (let i = 0; i < e.length && t(e[i].key, e[i].value) !== !1; i++)
      ;
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return Object.keys(this.table).length;
  }
  clear() {
    this.table = {};
  }
  toString() {
    if (this.isEmpty())
      return "";
    const t = this.keyValues();
    let e = `${t[0].toString()}`;
    for (let i = 1; i < t.length; i++)
      e = `${e},${t[i].toString()}`;
    return e;
  }
}
class It {
  constructor(t = m) {
    this.toStrFn = t, this.table = {};
  }
  table;
  loseloseHashCode(t) {
    if (typeof t == "number")
      return t;
    const e = this.toStrFn(t);
    let i = 0;
    for (let r = 0; r < e.length; r++)
      i += e.charCodeAt(r);
    return i % 37;
  }
  /* private djb2HashCode(key: K) {
    const tableKey = this.toStrFn(key);
    let hash = 5381;
    for (let i = 0; i < tableKey.length; i++) {
      hash = (hash * 33) + tableKey.charCodeAt(i);
    }
    return hash % 1013;
  } */
  hashCode(t) {
    return this.loseloseHashCode(t);
  }
  put(t, e) {
    if (t != null && e != null) {
      const i = this.hashCode(t);
      return this.table[i] = new S(t, e), !0;
    }
    return !1;
  }
  get(t) {
    const e = this.table[this.hashCode(t)];
    return e?.value;
  }
  remove(t) {
    const e = this.hashCode(t);
    return this.table[e] != null ? (delete this.table[e], !0) : !1;
  }
  getTable() {
    return this.table;
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return Object.keys(this.table).length;
  }
  clear() {
    this.table = {};
  }
  toString() {
    if (this.isEmpty())
      return "";
    const t = Object.keys(this.table);
    let e = `{${t[0]} => ${this.table[t[0]].toString()}}`;
    for (let i = 1; i < t.length; i++)
      e = `${e},{${t[i]} => ${this.table[t[i]].toString()}}`;
    return e;
  }
}
class Ot {
  constructor(t = m) {
    this.toStrFn = t, this.table = {};
  }
  table;
  loseloseHashCode(t) {
    if (typeof t == "number")
      return t;
    const e = this.toStrFn(t);
    let i = 0;
    for (let r = 0; r < e.length; r++)
      i += e.charCodeAt(r);
    return i % 37;
  }
  hashCode(t) {
    return this.loseloseHashCode(t);
  }
  put(t, e) {
    if (t != null && e != null) {
      const i = this.hashCode(t);
      return this.table[i] == null && (this.table[i] = new A()), this.table[i].push(new S(t, e)), !0;
    }
    return !1;
  }
  get(t) {
    const e = this.hashCode(t), i = this.table[e];
    if (i != null && !i.isEmpty()) {
      let r = i.getHead();
      for (; r != null; ) {
        if (r.element.key === t)
          return r.element.value;
        r = r.next;
      }
    }
  }
  remove(t) {
    const e = this.hashCode(t), i = this.table[e];
    if (i != null && !i.isEmpty()) {
      let r = i.getHead();
      for (; r != null; ) {
        if (r.element.key === t)
          return i.remove(r.element), i.isEmpty() && delete this.table[e], !0;
        r = r.next;
      }
    }
    return !1;
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    let t = 0;
    return Object.values(this.table).forEach((e) => t += e.size()), t;
  }
  clear() {
    this.table = {};
  }
  getTable() {
    return this.table;
  }
  toString() {
    if (this.isEmpty())
      return "";
    const t = Object.keys(this.table);
    let e = `{${t[0]} => ${this.table[t[0]].toString()}}`;
    for (let i = 1; i < t.length; i++)
      e = `${e},{${t[i]} => ${this.table[t[i]].toString()}}`;
    return e;
  }
}
class _t {
  constructor(t = m) {
    this.toStrFn = t, this.table = {};
  }
  table;
  loseloseHashCode(t) {
    if (typeof t == "number")
      return t;
    const e = this.toStrFn(t);
    let i = 0;
    for (let r = 0; r < e.length; r++)
      i += e.charCodeAt(r);
    return i % 37;
  }
  hashCode(t) {
    return this.loseloseHashCode(t);
  }
  put(t, e) {
    if (t != null && e != null) {
      const i = this.hashCode(t);
      if (this.table[i] == null)
        this.table[i] = new S(t, e);
      else {
        let r = i + 1;
        for (; this.table[r] != null; )
          r++;
        this.table[r] = new S(t, e);
      }
      return !0;
    }
    return !1;
  }
  get(t) {
    const e = this.hashCode(t);
    if (this.table[e] != null) {
      if (this.table[e].key === t)
        return this.table[e].value;
      let i = e + 1;
      for (; this.table[i] != null && this.table[i].key !== t; )
        i++;
      if (this.table[i] != null && this.table[i].key === t)
        return this.table[e].value;
    }
  }
  remove(t) {
    const e = this.hashCode(t);
    if (this.table[e] != null) {
      if (this.table[e].key === t)
        return delete this.table[e], this.verifyRemoveSideEffect(t, e), !0;
      let i = e + 1;
      for (; this.table[i] != null && this.table[i].key !== t; )
        i++;
      if (this.table[i] != null && this.table[i].key === t)
        return delete this.table[i], this.verifyRemoveSideEffect(t, i), !0;
    }
    return !1;
  }
  verifyRemoveSideEffect(t, e) {
    const i = this.hashCode(t);
    let r = e + 1;
    for (; this.table[r] != null; ) {
      const n = this.hashCode(this.table[r].key);
      (n <= i || n <= e) && (this.table[e] = this.table[r], delete this.table[r], e = r), r++;
    }
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    return Object.keys(this.table).length;
  }
  clear() {
    this.table = {};
  }
  getTable() {
    return this.table;
  }
  toString() {
    if (this.isEmpty())
      return "";
    const t = Object.keys(this.table);
    let e = `{${t[0]} => ${this.table[t[0]].toString()}}`;
    for (let i = 1; i < t.length; i++)
      e = `${e},{${t[i]} => ${this.table[t[i]].toString()}}`;
    return e;
  }
}
class D extends S {
  constructor(t, e, i = !1) {
    super(t, e), this.key = t, this.value = e, this.isDeleted = i;
  }
}
class $t {
  constructor(t = m) {
    this.toStrFn = t, this.table = {};
  }
  table;
  loseloseHashCode(t) {
    if (typeof t == "number")
      return t;
    const e = this.toStrFn(t);
    let i = 0;
    for (let r = 0; r < e.length; r++)
      i += e.charCodeAt(r);
    return i % 37;
  }
  hashCode(t) {
    return this.loseloseHashCode(t);
  }
  put(t, e) {
    if (t != null && e != null) {
      const i = this.hashCode(t);
      if (this.table[i] == null || this.table[i] != null && this.table[i].isDeleted)
        this.table[i] = new D(t, e);
      else {
        let r = i + 1;
        for (; this.table[r] != null && !this.table[i].isDeleted; )
          r++;
        this.table[r] = new D(t, e);
      }
      return !0;
    }
    return !1;
  }
  get(t) {
    const e = this.hashCode(t);
    if (this.table[e] != null) {
      if (this.table[e].key === t && !this.table[e].isDeleted)
        return this.table[e].value;
      let i = e + 1;
      for (; this.table[i] != null && (this.table[i].key !== t || this.table[i].isDeleted); ) {
        if (this.table[i].key === t && this.table[i].isDeleted)
          return;
        i++;
      }
      if (this.table[i] != null && this.table[i].key === t && !this.table[i].isDeleted)
        return this.table[e].value;
    }
  }
  remove(t) {
    const e = this.hashCode(t);
    if (this.table[e] != null) {
      if (this.table[e].key === t && !this.table[e].isDeleted)
        return this.table[e].isDeleted = !0, !0;
      let i = e + 1;
      for (; this.table[i] != null && (this.table[i].key !== t || this.table[i].isDeleted); )
        i++;
      if (this.table[i] != null && this.table[i].key === t && !this.table[i].isDeleted)
        return this.table[i].isDeleted = !0, !0;
    }
    return !1;
  }
  isEmpty() {
    return this.size() === 0;
  }
  size() {
    let t = 0;
    return Object.values(this.table).forEach((e) => {
      t += e.isDeleted === !0 ? 0 : 1;
    }), t;
  }
  clear() {
    this.table = {};
  }
  getTable() {
    return this.table;
  }
  toString() {
    if (this.isEmpty())
      return "";
    const t = Object.keys(this.table);
    let e = `{${t[0]} => ${this.table[t[0]].toString()}}`;
    for (let i = 1; i < t.length; i++)
      e = `${e},{${t[i]} => ${this.table[t[i]].toString()}}`;
    return e;
  }
}
function jt(s) {
  if (s < 0)
    return;
  let t = 1;
  for (let e = s; e > 1; e--)
    t *= e;
  return t;
}
function rt(s) {
  if (!(s < 0))
    return s === 1 || s === 0 ? 1 : s * rt(s - 1);
}
function G(s) {
  return s < 1 ? 0 : s <= 2 ? 1 : G(s - 1) + G(s - 2);
}
function Dt(s) {
  if (s < 1)
    return 0;
  let t = 0, e = 1, i = s;
  for (let r = 2; r <= s; r++)
    i = e + t, t = e, e = i;
  return i;
}
function Gt(s) {
  if (s < 1)
    return 0;
  const t = [0, 1], e = (i) => t[i] != null ? t[i] : t[i] = e(i - 1) + e(i - 2);
  return e(s);
}
class E {
  constructor(t) {
    this.key = t;
  }
  left;
  right;
  toString() {
    return `${this.key}`;
  }
}
class K {
  constructor(t = c) {
    this.compareFn = t;
  }
  root;
  insert(t) {
    this.root == null ? this.root = new E(t) : this.insertNode(this.root, t);
  }
  insertNode(t, e) {
    this.compareFn(e, t.key) === u.LESS_THAN ? t.left == null ? t.left = new E(e) : this.insertNode(t.left, e) : t.right == null ? t.right = new E(e) : this.insertNode(t.right, e);
  }
  getRoot() {
    return this.root;
  }
  search(t) {
    return this.searchNode(this.root, t);
  }
  searchNode(t, e) {
    return t == null ? !1 : this.compareFn(e, t.key) === u.LESS_THAN ? this.searchNode(t.left, e) : this.compareFn(e, t.key) === u.BIGGER_THAN ? this.searchNode(t.right, e) : !0;
  }
  inOrderTraverse(t) {
    this.inOrderTraverseNode(this.root, t);
  }
  inOrderTraverseNode(t, e) {
    t != null && (this.inOrderTraverseNode(t.left, e), e(t.key), this.inOrderTraverseNode(t.right, e));
  }
  preOrderTraverse(t) {
    this.preOrderTraverseNode(this.root, t);
  }
  preOrderTraverseNode(t, e) {
    t != null && (e(t.key), this.preOrderTraverseNode(t.left, e), this.preOrderTraverseNode(t.right, e));
  }
  postOrderTraverse(t) {
    this.postOrderTraverseNode(this.root, t);
  }
  postOrderTraverseNode(t, e) {
    t != null && (this.postOrderTraverseNode(t.left, e), this.postOrderTraverseNode(t.right, e), e(t.key));
  }
  min() {
    return this.minNode(this.root);
  }
  minNode(t) {
    let e = t;
    for (; e != null && e.left != null; )
      e = e.left;
    return e;
  }
  max() {
    return this.maxNode(this.root);
  }
  maxNode(t) {
    let e = t;
    for (; e != null && e.right != null; )
      e = e.right;
    return e;
  }
  remove(t) {
    this.root = this.removeNode(this.root, t);
  }
  removeNode(t, e) {
    if (t == null)
      return null;
    if (this.compareFn(e, t.key) === u.LESS_THAN)
      return t.left = this.removeNode(t.left, e), t;
    if (this.compareFn(e, t.key) === u.BIGGER_THAN)
      return t.right = this.removeNode(t.right, e), t;
    {
      if (t.left == null && t.right == null)
        return t = null, t;
      if (t.left == null)
        return t = t.right, t;
      if (t.right == null)
        return t = t.left, t;
      const i = this.minNode(t.right);
      return t.key = i.key, t.right = this.removeNode(t.right, i.key), t;
    }
  }
}
class Mt extends K {
  constructor(t = c) {
    super(t), this.compareFn = t;
  }
  getNodeHeight(t) {
    return t == null ? -1 : Math.max(this.getNodeHeight(t.left), this.getNodeHeight(t.right)) + 1;
  }
  /**
   * Left left case: rotate right
   *
   *       b                           a
   *      / \                         / \
   *     a   e -> rotationLL(b) ->   c   b
   *    / \                             / \
   *   c   d                           d   e
   *
   * @param node Node<T>
   */
  rotationLL(t) {
    const e = t.left;
    return t.left = e.right, e.right = t, e;
  }
  /**
   * Right right case: rotate left
   *
   *     a                              b
   *    / \                            / \
   *   c   b   -> rotationRR(a) ->    a   e
   *      / \                        / \
   *     d   e                      c   d
   *
   * @param node Node<T>
   */
  rotationRR(t) {
    const e = t.right;
    return t.right = e.left, e.left = t, e;
  }
  /**
   * Left right case: rotate left then right
   * @param node Node<T>
   */
  rotationLR(t) {
    return t.left = this.rotationRR(t.left), this.rotationLL(t);
  }
  /**
   * Right left case: rotate right then left
   * @param node Node<T>
   */
  rotationRL(t) {
    return t.right = this.rotationLL(t.right), this.rotationRR(t);
  }
  getBalanceFactor(t) {
    switch (this.getNodeHeight(t.left) - this.getNodeHeight(t.right)) {
      case -2:
        return 1;
      case -1:
        return 2;
      case 1:
        return 4;
      case 2:
        return 5;
      default:
        return 3;
    }
  }
  insert(t) {
    this.root = this.insertNode(this.root, t);
  }
  insertNode(t, e) {
    if (t == null)
      return new E(e);
    this.compareFn(e, t.key) === u.LESS_THAN ? t.left = this.insertNode(t.left, e) : t.right = this.insertNode(t.right, e);
    const i = this.getBalanceFactor(t);
    return i === 5 && (this.compareFn(e, t.left.key) === u.LESS_THAN ? t = this.rotationLL(t) : t = this.rotationLR(t)), i === 1 && (this.compareFn(e, t.right.key) === u.BIGGER_THAN ? t = this.rotationRR(t) : t = this.rotationRL(t)), t;
  }
  removeNode(t, e) {
    if (t = super.removeNode(t, e), t == null)
      return t;
    const i = this.getBalanceFactor(t);
    return i === 5 && (this.compareFn(e, t.left.key) === u.LESS_THAN ? t = this.rotationLL(t) : t = this.rotationLR(t)), i === 1 && (this.compareFn(e, t.right.key) === u.BIGGER_THAN ? t = this.rotationRR(t) : t = this.rotationRL(t)), t;
  }
}
var a = /* @__PURE__ */ ((s) => (s[s.RED = 0] = "RED", s[s.BLACK = 1] = "BLACK", s))(a || {});
class L extends E {
  constructor(t) {
    super(t), this.key = t, this.color = 0;
  }
  left;
  right;
  parent;
  color;
  isRed() {
    return this.color === 0;
  }
}
class Ft extends K {
  constructor(t = c) {
    super(t), this.compareFn = t;
  }
  root;
  /**
   * Left left case: rotate right
   *
   *       b                           a
   *      / \                         / \
   *     a   e -> rotationLL(b) ->   c   b
   *    / \                             / \
   *   c   d                           d   e
   *
   * @param node Node<T>
   */
  rotationLL(t) {
    const e = t.left;
    t.left = e.right, e.right && e.right.key && (e.right.parent = t), e.parent = t.parent, t.parent ? t === t.parent.left ? t.parent.left = e : t.parent.right = e : this.root = e, e.right = t, t.parent = e;
  }
  /**
   * Right right case: rotate left
   *
   *     a                              b
   *    / \                            / \
   *   c   b   -> rotationRR(a) ->    a   e
   *      / \                        / \
   *     d   e                      c   d
   *
   * @param node Node<T>
   */
  rotationRR(t) {
    const e = t.right;
    t.right = e.left, e.left && e.left.key && (e.left.parent = t), e.parent = t.parent, t.parent ? t === t.parent.left ? t.parent.left = e : t.parent.right = e : this.root = e, e.left = t, t.parent = e;
  }
  insert(t) {
    if (this.root == null)
      this.root = new L(t), this.root.color = a.BLACK;
    else {
      const e = this.insertNode(this.root, t);
      this.fixTreeProperties(e);
    }
  }
  insertNode(t, e) {
    return this.compareFn(e, t.key) === u.LESS_THAN ? t.left == null ? (t.left = new L(e), t.left.parent = t, t.left) : this.insertNode(t.left, e) : t.right == null ? (t.right = new L(e), t.right.parent = t, t.right) : this.insertNode(t.right, e);
  }
  fixTreeProperties(t) {
    for (; t && t.parent && t.parent.color === a.RED && t.color !== a.BLACK; ) {
      let e = t.parent;
      const i = e.parent;
      if (i && i.left === e) {
        const r = i.right;
        r && r.isRed() ? (i.color = a.RED, e.color = a.BLACK, r.color = a.BLACK, t = i) : (t === e.right && (this.rotationRR(e), t = e, e = t.parent), this.rotationLL(i), e.color = a.BLACK, i.color = a.RED, t = e);
      } else {
        const r = i.left;
        r && r.isRed() ? (i.color = a.RED, e.color = a.BLACK, r.color = a.BLACK, t = i) : (t === e.left && (this.rotationLL(e), t = e, e = t.parent), this.rotationRR(i), e.color = a.BLACK, i.color = a.RED, t = e);
      }
    }
    this.root.color = a.BLACK;
  }
  getRoot() {
    return this.root;
  }
  /* private flipColors(node: RedBlackNode<T>) {
      node.left.flipColor();
      node.right.flipColor();
    }
  
    private isRed(node: RedBlackNode<T>) {
      if (!node) {
        return false;
      }
      return node.isRed();
    }*/
}
class nt {
  constructor(t = c) {
    this.compareFn = t;
  }
  heap = [];
  getLeftIndex(t) {
    return 2 * t + 1;
  }
  getRightIndex(t) {
    return 2 * t + 2;
  }
  getParentIndex(t) {
    if (t !== 0)
      return Math.floor((t - 1) / 2);
  }
  size() {
    return this.heap.length;
  }
  isEmpty() {
    return this.size() <= 0;
  }
  clear() {
    this.heap = [];
  }
  findMinimum() {
    return this.isEmpty() ? void 0 : this.heap[0];
  }
  insert(t) {
    if (t != null) {
      const e = this.heap.length;
      return this.heap.push(t), this.siftUp(e), !0;
    }
    return !1;
  }
  siftDown(t) {
    let e = t;
    const i = this.getLeftIndex(t), r = this.getRightIndex(t), n = this.size();
    i < n && this.compareFn(this.heap[e], this.heap[i]) === u.BIGGER_THAN && (e = i), r < n && this.compareFn(this.heap[e], this.heap[r]) === u.BIGGER_THAN && (e = r), t !== e && (b(this.heap, t, e), this.siftDown(e));
  }
  siftUp(t) {
    let e = this.getParentIndex(t);
    for (; t > 0 && this.compareFn(this.heap[e], this.heap[t]) === u.BIGGER_THAN; )
      b(this.heap, e, t), t = e, e = this.getParentIndex(t);
  }
  extract() {
    if (this.isEmpty())
      return;
    if (this.size() === 1)
      return this.heap.shift();
    const t = this.heap[0];
    return this.heap[0] = this.heap.pop(), this.siftDown(0), t;
  }
  heapify(t) {
    t && (this.heap = t);
    const e = Math.floor(this.size() / 2) - 1;
    for (let i = 0; i <= e; i++)
      this.siftDown(i);
    return this.heap;
  }
  getAsArray() {
    return this.heap;
  }
}
class Bt extends nt {
  constructor(t = c) {
    super(t), this.compareFn = t, this.compareFn = q(t);
  }
}
function $(s, t, e, i) {
  let r = t;
  const n = 2 * t + 1, l = 2 * t + 2;
  n < e && i(s[n], s[t]) > 0 && (r = n), l < e && i(s[l], s[r]) > 0 && (r = l), r !== t && (b(s, t, r), $(s, r, e, i));
}
function lt(s, t) {
  for (let e = Math.floor(s.length / 2); e >= 0; e -= 1)
    $(s, e, s.length, t);
  return s;
}
function kt(s, t = c) {
  let e = s.length;
  for (lt(s, t); e > 1; )
    b(s, 0, --e), $(s, 0, e, t);
  return s;
}
class zt {
  constructor(t = !1) {
    this.isDirected = t;
  }
  vertices = [];
  adjList = new st();
  addVertex(t) {
    this.vertices.includes(t) || (this.vertices.push(t), this.adjList.set(t, []));
  }
  addEdge(t, e) {
    this.adjList.get(t) || this.addVertex(t), this.adjList.get(e) || this.addVertex(e), this.adjList.get(t).push(e), this.isDirected !== !0 && this.adjList.get(e).push(t);
  }
  getVertices() {
    return this.vertices;
  }
  getAdjList() {
    return this.adjList;
  }
  toString() {
    let t = "";
    for (let e = 0; e < this.vertices.length; e++) {
      t += this.vertices[e] + " -> ";
      const i = this.adjList.get(this.vertices[e]);
      for (let r = 0; r < i.length; r++)
        t += i[r] + " ";
      t += `
`;
    }
    return t;
  }
}
class U {
  count;
  lowestCount;
  items;
  constructor() {
    this.count = 0, this.lowestCount = 0, this.items = {};
  }
  enqueue(t) {
    this.items[this.count] = t, this.count++;
  }
  dequeue() {
    if (this.isEmpty())
      return;
    const t = this.items[this.lowestCount];
    return delete this.items[this.lowestCount], this.lowestCount++, t;
  }
  peek() {
    if (!this.isEmpty())
      return this.items[this.lowestCount];
  }
  isEmpty() {
    return this.size() === 0;
  }
  clear() {
    this.items = {}, this.count = 0, this.lowestCount = 0;
  }
  size() {
    return this.count - this.lowestCount;
  }
  toString() {
    if (this.isEmpty())
      return "";
    let t = `${this.items[this.lowestCount]}`;
    for (let e = this.lowestCount + 1; e < this.count; e++)
      t = `${t},${this.items[e]}`;
    return t;
  }
}
const X = (s) => {
  const t = {};
  for (let e = 0; e < s.length; e++)
    t[s[e]] = 0;
  return t;
}, Vt = (s, t, e) => {
  const i = s.getVertices(), r = s.getAdjList(), n = X(i), l = new U();
  for (l.enqueue(t); !l.isEmpty(); ) {
    const h = l.dequeue(), o = r.get(h);
    n[h] = 1;
    for (let f = 0; f < o.length; f++) {
      const p = o[f];
      n[p] === 0 && (n[p] = 1, l.enqueue(p));
    }
    n[h] = 2, e && e(h);
  }
}, qt = (s, t) => {
  const e = s.getVertices(), i = s.getAdjList(), r = X(e), n = new U(), l = {}, h = {};
  n.enqueue(t);
  for (let o = 0; o < e.length; o++)
    l[e[o]] = 0, h[e[o]] = null;
  for (; !n.isEmpty(); ) {
    const o = n.dequeue(), f = i.get(o);
    r[o] = 1;
    for (let p = 0; p < f.length; p++) {
      const g = f[p];
      r[g] === 0 && (r[g] = 1, l[g] = l[o] + 1, h[g] = o, n.enqueue(g));
    }
    r[o] = 2;
  }
  return {
    distances: l,
    predecessors: h
  };
}, Q = (s) => {
  const t = {};
  for (let e = 0; e < s.length; e++)
    t[s[e]] = 0;
  return t;
}, W = (s, t, e, i) => {
  t[s] = "grey", i && i(s);
  const r = e.get(s);
  for (let n = 0; n < r.length; n++) {
    const l = r[n];
    t[l] === 0 && W(l, t, e, i);
  }
  t[s] = 2;
}, Pt = (s, t) => {
  const e = s.getVertices(), i = s.getAdjList(), r = Q(e);
  for (let n = 0; n < e.length; n++)
    r[e[n]] === 0 && W(e[n], r, i, t);
}, J = (s, t, e, i, r, n, l) => {
  t[s] = 1, e[s] = ++n.count;
  const h = l.get(s);
  for (let o = 0; o < h.length; o++) {
    const f = h[o];
    t[f] === 0 && (r[f] = s, J(f, t, e, i, r, n, l));
  }
  t[s] = 2, i[s] = ++n.count;
}, Kt = (s) => {
  const t = s.getVertices(), e = s.getAdjList(), i = Q(t), r = {}, n = {}, l = {}, h = { count: 0 };
  for (let o = 0; o < t.length; o++)
    n[t[o]] = 0, r[t[o]] = 0, l[t[o]] = null;
  for (let o = 0; o < t.length; o++)
    i[t[o]] === 0 && J(t[o], i, r, n, l, h, e);
  return {
    discovery: r,
    finished: n,
    predecessors: l
  };
}, x = Number.MAX_SAFE_INTEGER, ht = (s, t) => {
  let e = x, i = -1;
  for (let r = 0; r < s.length; r++)
    t[r] === !1 && s[r] <= e && (e = s[r], i = r);
  return i;
}, Ut = (s, t) => {
  const e = [], i = [], r = s.length;
  for (let n = 0; n < r; n++)
    e[n] = x, i[n] = !1;
  e[t] = 0;
  for (let n = 0; n < r - 1; n++) {
    const l = ht(e, i);
    i[l] = !0;
    for (let h = 0; h < r; h++)
      !i[h] && s[l][h] !== 0 && e[l] !== x && e[l] + s[l][h] < e[h] && (e[h] = e[l] + s[l][h]);
  }
  return e;
}, Xt = (s) => {
  const t = [], e = s.length;
  for (let i = 0; i < e; i++) {
    t[i] = [];
    for (let r = 0; r < e; r++)
      i === r ? t[i][r] = 0 : isFinite(s[i][r]) ? t[i][r] = s[i][r] : t[i][r] = 1 / 0;
  }
  for (let i = 0; i < e; i++)
    for (let r = 0; r < e; r++)
      for (let n = 0; n < e; n++)
        t[r][i] + t[i][n] < t[r][n] && (t[r][n] = t[r][i] + t[i][n]);
  return t;
}, Z = Number.MAX_SAFE_INTEGER, ot = (s, t, e) => {
  let i = Z, r = 0;
  for (let n = 0; n < s.length; n++)
    e[n] === !1 && t[n] < i && (i = t[n], r = n);
  return r;
}, Qt = (s) => {
  const t = [], e = [], i = [], r = s.length;
  for (let n = 0; n < r; n++)
    e[n] = Z, i[n] = !1;
  e[0] = 0, t[0] = -1;
  for (let n = 0; n < r - 1; n++) {
    const l = ot(s, e, i);
    i[l] = !0;
    for (let h = 0; h < r; h++)
      s[l][h] && i[h] === !1 && s[l][h] < e[h] && (t[h] = l, e[h] = s[l][h]);
  }
  return t;
}, R = Number.MAX_SAFE_INTEGER, M = (s, t) => {
  for (; t[s]; )
    s = t[s];
  return s;
}, ut = (s, t, e) => s !== t ? (e[t] = s, !0) : !1, ft = (s) => {
  const t = [], e = s.length;
  for (let i = 0; i < e; i++) {
    t[i] = [];
    for (let r = 0; r < e; r++)
      s[i][r] === 0 ? t[i][r] = R : t[i][r] = s[i][r];
  }
  return t;
}, Wt = (s) => {
  const t = s.length, e = [];
  let i = 0, r, n, l, h;
  const o = ft(s);
  for (; i < t - 1; ) {
    for (let f = 0, p = R; f < t; f++)
      for (let g = 0; g < t; g++)
        o[f][g] < p && (p = o[f][g], r = l = f, n = h = g);
    l = M(l, e), h = M(h, e), ut(l, h, e) && i++, o[r][n] = o[n][r] = R;
  }
  return e;
};
function Jt(s) {
  for (let t = s.length - 1; t > 0; t--) {
    const e = Math.floor(Math.random() * (t + 1));
    b(s, t, e);
  }
  return s;
}
function Zt(s, t = c) {
  const { length: e } = s;
  for (let i = 0; i < e; i++)
    for (let r = 0; r < e - 1; r++)
      t(s[r], s[r + 1]) === u.BIGGER_THAN && b(s, r, r + 1);
  return s;
}
function Yt(s, t = c) {
  const { length: e } = s;
  for (let i = 0; i < e; i++)
    for (let r = 0; r < e - 1 - i; r++)
      t(s[r], s[r + 1]) === u.BIGGER_THAN && b(s, r, r + 1);
  return s;
}
const ct = (s, t = c) => {
  const { length: e } = s;
  let i;
  for (let r = 1; r < e; r++) {
    let n = r;
    for (i = s[r]; n > 0 && t(s[n - 1], i) === u.BIGGER_THAN; )
      s[n] = s[n - 1], n--;
    s[n] = i;
  }
  return s;
};
function at(s, t) {
  let e = s[0], i = s[0];
  for (let l = 1; l < s.length; l++)
    s[l] < e ? e = s[l] : s[l] > i && (i = s[l]);
  const r = Math.floor((i - e) / t) + 1, n = [];
  for (let l = 0; l < r; l++)
    n[l] = [];
  for (let l = 0; l < s.length; l++)
    n[Math.floor((s[l] - e) / t)].push(s[l]);
  return n;
}
function gt(s) {
  const t = [];
  for (let e = 0; e < s.length; e++)
    s[e] != null && (ct(s[e]), t.push(...s[e]));
  return t;
}
function yt(s, t = 5) {
  if (s.length < 2)
    return s;
  const e = at(s, t);
  return gt(e);
}
function Y(s, t = c) {
  if (s && s.length > 0) {
    let e = s[0];
    for (let i = 1; i < s.length; i++)
      t(e, s[i]) === u.LESS_THAN && (e = s[i]);
    return e;
  }
}
function pt(s, t = c) {
  if (s && s.length > 0) {
    let e = s[0];
    for (let i = 1; i < s.length; i++)
      t(e, s[i]) === u.BIGGER_THAN && (e = s[i]);
    return e;
  }
}
function te(s) {
  if (s.length < 2)
    return s;
  const t = Y(s);
  let e = 0;
  const i = new Array(t + 1);
  return s.forEach((r) => {
    i[r] || (i[r] = 0), i[r]++;
  }), i.forEach((r, n) => {
    for (; r > 0; )
      s[e++] = n, r--;
  }), s;
}
function bt(s, t, e) {
  let i = 0, r = 0;
  const n = [];
  for (; i < s.length && r < t.length; )
    n.push(e(s[i], t[r]) === u.LESS_THAN ? s[i++] : t[r++]);
  return n.concat(i < s.length ? s.slice(i) : t.slice(r));
}
function F(s, t = c) {
  if (s.length > 1) {
    const { length: e } = s, i = Math.floor(e / 2), r = F(s.slice(0, i), t), n = F(s.slice(i, e), t);
    s = bt(r, n, t);
  }
  return s;
}
const dt = function(s, t, e, i) {
  const r = s[Math.floor((e + t) / 2)];
  let n = t, l = e;
  for (; n <= l; ) {
    for (; i(s[n], r) === u.LESS_THAN; )
      n++;
    for (; i(s[l], r) === u.BIGGER_THAN; )
      l--;
    n <= l && (b(s, n, l), n++, l--);
  }
  return n;
}, C = function(s, t, e, i) {
  let r;
  return s.length > 1 && (r = dt(s, t, e, i), t < r - 1 && C(s, t, r - 1, i), r < e && C(s, r, e, i)), s;
}, y = (s, t = c) => C(s, 0, s.length - 1, t), St = (s, t, e, i) => {
  let r;
  const n = [], l = [];
  for (let h = 0; h < t; h++)
    n[h] = 0;
  for (let h = 0; h < s.length; h++)
    r = Math.floor((s[h] - i) / e % t), n[r]++;
  for (let h = 1; h < t; h++)
    n[h] += n[h - 1];
  for (let h = s.length - 1; h >= 0; h--)
    r = Math.floor((s[h] - i) / e % t), l[--n[r]] = s[h];
  for (let h = 0; h < s.length; h++)
    s[h] = l[h];
  return s;
};
function ee(s, t = 10) {
  if (s.length < 2)
    return s;
  const e = pt(s), i = Y(s);
  let r = 1;
  for (; (i - e) / r >= 1; )
    s = St(s, t, r, e), r *= t;
  return s;
}
const ie = (s, t = c) => {
  const { length: e } = s;
  let i;
  for (let r = 0; r < e - 1; r++) {
    i = r;
    for (let n = r; n < e; n++)
      t(s[i], s[n]) === u.BIGGER_THAN && (i = n);
    r !== i && b(s, r, i);
  }
  return s;
};
function se(s, t = c) {
  let e = s.length / 2;
  for (; e > 0; ) {
    for (let i = e; i < s.length; i++) {
      let r = i;
      const n = s[i];
      for (; r >= e && t(s[r - e], n) === u.BIGGER_THAN; )
        s[r] = s[r - e], r = r - e;
      s[r] = n;
    }
    e === 2 ? e = 1 : e = Math.floor(e * 5 / 11);
  }
  return s;
}
function re(s, t, e = c) {
  const i = y(s);
  let r = 0, n = i.length - 1;
  for (; r <= n; ) {
    const l = Math.floor((r + n) / 2), h = i[l];
    if (e(h, t) === u.LESS_THAN)
      r = l + 1;
    else if (e(h, t) === u.BIGGER_THAN)
      n = l - 1;
    else
      return l;
  }
  return -1;
}
function ne(s, t, e = c, i = d, r = P) {
  const { length: n } = s;
  let l = 0, h = n - 1, o = -1, f = -1;
  for (; l <= h && V(t, s[l], e) && z(t, s[h], e); ) {
    if (f = r(t, s[l]) / r(s[h], s[l]), o = l + Math.floor((h - l) * f), i(s[o], t))
      return o;
    e(s[o], t) === u.LESS_THAN ? l = o + 1 : h = o - 1;
  }
  return -1;
}
function le(s, t, e = d) {
  for (let i = 0; i < s.length; i++)
    if (e(t, s[i]))
      return i;
  return -1;
}
function H(s, t, e, i, r = c) {
  if (e <= i) {
    const n = Math.floor((e + i) / 2), l = s[n];
    return r(l, t) === u.LESS_THAN ? H(s, t, n + 1, i, r) : r(l, t) === u.BIGGER_THAN ? H(s, t, e, n - 1, r) : n;
  }
  return -1;
}
function he(s, t, e = c) {
  const i = y(s), r = 0, n = i.length - 1;
  return H(s, t, r, n, e);
}
function oe(s, t) {
  const e = [], i = function(r) {
    if (!r)
      return [];
    if (e[r])
      return e[r];
    let n = [], l, h;
    for (let o = 0; o < s.length; o++) {
      const f = s[o];
      h = r - f, h >= 0 && (l = i(h)), h >= 0 && (l.length < n.length - 1 || !n.length) && (l.length || !h) && (n = [f].concat(l));
    }
    return e[r] = n;
  };
  return i(t);
}
function ue(s, t) {
  const e = [];
  let i = 0;
  for (let r = s.length; r >= 0; r--) {
    const n = s[r];
    for (; i + n <= t; )
      e.push(n), i += n;
  }
  return e;
}
function fe(s, t, e, i) {
  const r = [];
  for (let n = 0; n <= i; n++)
    r[n] = [];
  for (let n = 0; n <= i; n++)
    for (let l = 0; l <= s; l++)
      if (n === 0 || l === 0)
        r[n][l] = 0;
      else if (t[n - 1] <= l) {
        const h = e[n - 1] + r[n - 1][l - t[n - 1]], o = r[n - 1][l];
        r[n][l] = h > o ? h : o;
      } else
        r[n][l] = r[n - 1][l];
  return mt(i, s, r), r[i][s];
}
function mt(s, t, e) {
  let i = s, r = t;
  for (; i > 0 && r > 0; )
    e[i][r] !== e[i - 1][r] ? (i--, r = r - e[i][r]) : i--;
}
function T(s, t, e, i) {
  if (i === 0 || s === 0)
    return 0;
  if (t[i - 1] > s)
    return T(s, t, e, i - 1);
  {
    const r = e[i - 1] + T(s - t[i - 1], t, e, i - 1), n = T(s, t, e, i - 1);
    return r > n ? r : n;
  }
}
function ce(s, t, e) {
  const i = e.length;
  let r = 0, n = 0;
  for (let l = 0; l < i && r < s; l++)
    if (t[l] <= s - r)
      n += e[l], r += t[l];
    else {
      const h = (s - r) / t[l];
      n += h * e[l], r += t[l];
    }
  return n;
}
function ae(s, t) {
  const e = s.length, i = t.length, r = [];
  for (let n = 0; n <= e; n++) {
    r[n] = [];
    for (let l = 0; l <= i; l++)
      r[n][l] = 0;
  }
  for (let n = 0; n <= e; n++)
    for (let l = 0; l <= i; l++)
      if (n === 0 || l === 0)
        r[n][l] = 0;
      else if (s[n - 1] === t[l - 1])
        r[n][l] = r[n - 1][l - 1] + 1;
      else {
        const h = r[n - 1][l], o = r[n][l - 1];
        r[n][l] = h > o ? h : o;
      }
  return r[e][i];
}
function ge(s, t) {
  const e = s.length, i = t.length, r = [], n = [];
  for (let l = 0; l <= e; l++) {
    r[l] = [], n[l] = [];
    for (let h = 0; h <= i; h++)
      r[l][h] = 0, n[l][h] = "0";
  }
  for (let l = 0; l <= e; l++)
    for (let h = 0; h <= i; h++)
      if (l === 0 || h === 0)
        r[l][h] = 0;
      else if (s[l - 1] === t[h - 1])
        r[l][h] = r[l - 1][h - 1] + 1, n[l][h] = "diagonal";
      else {
        const o = r[l - 1][h], f = r[l][h - 1];
        r[l][h] = o > f ? o : f, n[l][h] = r[l][h] === r[l - 1][h] ? "top" : "left";
      }
  return Et(n, s, e, i);
}
function Et(s, t, e, i) {
  let r = e, n = i, l = s[r][n], h = "";
  for (; l !== "0"; )
    s[r][n] === "diagonal" ? (h = t[r - 1] + h, r--, n--) : s[r][n] === "left" ? n-- : s[r][n] === "top" && r--, l = s[r][n];
  return h;
}
function w(s, t, e = s.length, i = t.length) {
  if (e === 0 || i === 0)
    return 0;
  if (s[e - 1] === t[i - 1])
    return 1 + w(s, t, e - 1, i - 1);
  {
    const r = w(s, t, e, i - 1), n = w(s, t, e - 1, i);
    return r > n ? r : n;
  }
}
function pe(s) {
  const t = s.length, e = [], i = [];
  for (let r = 1; r <= t; r++)
    e[r] = [], e[r][r] = 0;
  for (let r = 0; r <= t; r++) {
    i[r] = [];
    for (let n = 0; n <= t; n++)
      i[r][n] = 0;
  }
  for (let r = 2; r < t; r++)
    for (let n = 1; n <= t - r + 1; n++) {
      const l = n + r - 1;
      e[n][l] = Number.MAX_SAFE_INTEGER;
      for (let h = n; h <= l - 1; h++) {
        const o = e[n][h] + e[h + 1][l] + s[n - 1] * s[h] * s[l];
        o < e[n][l] && (e[n][l] = o, i[n][l] = h);
      }
    }
  return I(i, 1, t - 1), e[1][t - 1];
}
function I(s, t, e) {
  t === e || (I(s, t, s[t][e]), I(s, s[t][e] + 1, e));
}
function B(s, t = 1, e = s.length - 1) {
  if (t === e)
    return 0;
  let i = Number.MAX_SAFE_INTEGER;
  for (let r = t; r < e; r++) {
    const n = B(s, t, r) + B(s, r + 1, e) + s[t - 1] * s[r] * s[e];
    n < i && (i = n);
  }
  return i;
}
function be(s) {
  const t = [];
  for (let e = 0; e < s.length; e++) {
    t[e] = [];
    for (let i = 0; i < s[e].length; i++)
      t[e][i] = 0;
  }
  return O(s, 0, 0, t) === !0 ? t : "NO PATH FOUND";
}
function O(s, t, e, i) {
  const r = s.length;
  return t === r - 1 && e === r - 1 ? (i[t][e] = 1, !0) : vt(s, t, e) === !0 ? (i[t][e] = 1, O(s, t + 1, e, i) || O(s, t, e + 1, i) ? !0 : (i[t][e] = 0, !1)) : !1;
}
function vt(s, t, e) {
  const i = s.length;
  return t >= 0 && e >= 0 && t < i && e < i && s[t][e] !== 0;
}
const k = 0;
function de(s) {
  return tt(s) === !0 ? s : "NO SOLUTION EXISTS!";
}
function tt(s) {
  let t = 0, e = 0, i = !1;
  for (t = 0; t < s.length; t++) {
    for (e = 0; e < s[t].length; e++)
      if (s[t][e] === k) {
        i = !0;
        break;
      }
    if (i === !0)
      break;
  }
  if (i === !1)
    return !0;
  for (let r = 1; r <= 9; r++)
    if (Tt(s, t, e, r)) {
      if (s[t][e] = r, tt(s))
        return !0;
      s[t][e] = k;
    }
  return !1;
}
function Nt(s, t, e) {
  for (let i = 0; i < s.length; i++)
    if (s[t][i] === e)
      return !0;
  return !1;
}
function At(s, t, e) {
  for (let i = 0; i < s.length; i++)
    if (s[i][t] === e)
      return !0;
  return !1;
}
function Lt(s, t, e, i) {
  for (let r = 0; r < 3; r++)
    for (let n = 0; n < 3; n++)
      if (s[r + t][n + e] === i)
        return !0;
  return !1;
}
function Tt(s, t, e, i) {
  return !Nt(s, t, i) && !At(s, e, i) && !Lt(s, t - t % 3, e - e % 3, i);
}
const Se = (s) => {
  const t = [], e = Math.floor(Math.sqrt(s));
  for (let i = 1; i <= e; i++)
    s % i === 0 && (t.push(i), i !== e && t.push(Math.floor(s / i)));
  return s >= 2 && !t.includes(s) && t.push(s), t.sort((i, r) => i - r), t;
}, _ = (s, t) => s === 0 || t === 0 ? 0 : s === t ? s : s > t ? _(s - t, t) : _(s, t - s), me = (s, t) => s === 0 || t === 0 ? 0 : (s = Math.abs(s), t = Math.abs(t), s * t / _(s, t)), Ee = (s) => {
  let t = 0, e = s[0];
  const i = s.length;
  let r, n = s[0];
  for (t; t < i; t++)
    r = s[t], r > e && (e = r), r < n && (n = r);
  return e - n;
}, ve = (s) => {
  if (s <= 1)
    return !1;
  const t = Math.floor(Math.sqrt(s));
  for (let e = 2; e <= t; e++)
    if (s % e === 0)
      return !1;
  return !0;
}, Ne = (s) => {
  if (s <= 1)
    return !1;
  if (s === 2 || s === 3)
    return !0;
  if (s % 2 === 0)
    return !1;
  {
    const t = Math.floor(Math.sqrt(s));
    for (let e = 3; e <= t; e += 2)
      if (s % e === 0)
        return !1;
  }
  return !0;
}, Ae = (s) => s >= 2 ? ![...Array(s).keys()].slice(2).map((t) => !(s % t)).includes(!0) && ![0, 1].includes(s) : !1, Le = (s) => {
  const t = [], e = [];
  t[1] = !1;
  for (let i = 2; i <= s; i++)
    t[i] = !0;
  for (let i = 2; i * i <= s; i++)
    if (t[i])
      for (let r = i * 2; r <= s; r += i)
        t[r] = !1;
  return t.forEach((i, r) => {
    i && e.push(r);
  }, e), e;
}, Te = et;
export {
  Mt as AVLTree,
  qt as BFS,
  K as BinarySearchTree,
  Rt as CircularLinkedList,
  Kt as DFS,
  st as Dictionary,
  it as DoublyLinkedList,
  zt as Graph,
  It as HashTable,
  _t as HashTableLinearProbing,
  $t as HashTableLinearProbingLazy,
  Ot as HashTableSeparateChaining,
  A as LinkedList,
  Bt as MaxHeap,
  nt as MinHeap,
  Ft as RedBlackTree,
  N as Set,
  Ct as SortedLinkedList,
  wt as Stack,
  Ht as StackLinkedList,
  re as binarySearch,
  he as binarySearchRecursive,
  Vt as breadthFirstSearch,
  Zt as bubbleSort,
  yt as bucketSort,
  te as countingSort,
  Pt as depthFirstSearch,
  Ut as dijkstra,
  rt as factorial,
  jt as factorialIterative,
  G as fibonacci,
  Dt as fibonacciIterative,
  Gt as fibonacciMemoization,
  Se as findDivisors,
  Y as findMaxValue,
  pt as findMinValue,
  Xt as floydWarshall,
  _ as gcd,
  Ee as greatestDifference,
  kt as heapSort,
  ct as insertionSort,
  ne as interpolationSearch,
  ve as isPrime,
  Ae as isPrime2,
  fe as knapSack,
  ce as knapSackGreedy,
  T as knapSackRecursive,
  Wt as kruskal,
  me as lcm,
  ae as lcs,
  ge as lcsPrint,
  w as lcsRecursive,
  pe as matrixChainOrder,
  B as matrixChainOrderGreedy,
  F as mergeSort,
  oe as minCoinChange,
  ue as minCoinChangeGreedy,
  Yt as modifiedBubbleSort,
  Qt as prim,
  y as quickSort,
  ee as radixSort,
  be as ratInAMaze,
  ie as selectionSort,
  le as sequentialSearch,
  se as shellSort,
  Jt as shuffle,
  Le as sieveOfEratosthenes,
  de as sudokuSolver,
  Ne as testPrime,
  Te as util
};
