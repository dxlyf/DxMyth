function Vp(e, t) {
  return document.createElement(e, t);
}
function Gp(e, t, n) {
  return document.createElementNS(e, t, n);
}
function Zp() {
  return Rt(document.createDocumentFragment());
}
function Jp(e) {
  return document.createTextNode(e);
}
function eh(e) {
  return document.createComment(e);
}
function th(e, t, n) {
  if (je(e)) {
    let l = e;
    for (; l && je(l); )
      l = Rt(l).parent;
    e = l ?? e;
  }
  je(t) && (t = Rt(t, e)), n && je(n) && (n = Rt(n).firstChildNode), e.insertBefore(t, n);
}
function nh(e, t) {
  e.removeChild(t);
}
function lh(e, t) {
  je(t) && (t = Rt(t, e)), e.appendChild(t);
}
function xu(e) {
  if (je(e)) {
    for (; e && je(e); )
      e = Rt(e).parent;
    return e ?? null;
  }
  return e.parentNode;
}
function ih(e) {
  if (je(e)) {
    const t = Rt(e), n = xu(t);
    if (n && t.lastChildNode) {
      const l = Array.from(n.childNodes), i = l.indexOf(t.lastChildNode);
      return l[i + 1] ?? null;
    }
    return null;
  }
  return e.nextSibling;
}
function oh(e) {
  return e.tagName;
}
function ah(e, t) {
  e.textContent = t;
}
function ch(e) {
  return e.textContent;
}
function sh(e) {
  return e.nodeType === 1;
}
function uh(e) {
  return e.nodeType === 3;
}
function rh(e) {
  return e.nodeType === 8;
}
function je(e) {
  return e.nodeType === 11;
}
function Rt(e, t) {
  const n = e;
  return n.parent ??= t ?? null, n.firstChildNode ??= e.firstChild, n.lastChildNode ??= e.lastChild, n;
}
const Va = {
  createElement: Vp,
  createElementNS: Gp,
  createTextNode: Jp,
  createDocumentFragment: Zp,
  createComment: eh,
  insertBefore: th,
  removeChild: nh,
  appendChild: lh,
  parentNode: xu,
  nextSibling: ih,
  tagName: oh,
  setTextContent: ah,
  getTextContent: ch,
  isElement: sh,
  isText: uh,
  isComment: rh,
  isDocumentFragment: je
};
function ee(e, t, n, l, i) {
  const o = t === void 0 ? void 0 : t.key;
  return { sel: e, data: t, children: n, text: l, elm: i, key: o };
}
const hn = Array.isArray;
function Ot(e) {
  return typeof e == "string" || typeof e == "number" || e instanceof String || e instanceof Number;
}
const Yo = ee("", {}, [], void 0, void 0);
function In(e, t) {
  const n = e.key === t.key, l = e.data?.is === t.data?.is, i = e.sel === t.sel, o = !e.sel && e.sel === t.sel ? typeof e.text == typeof t.text : !0;
  return i && n && l && o;
}
function fh() {
  throw new Error("The document fragment is not supported on this platform.");
}
function dh(e, t) {
  return e.isElement(t);
}
function ph(e, t) {
  return e.isDocumentFragment(t);
}
function hh(e, t, n) {
  const l = {};
  for (let i = t; i <= n; ++i) {
    const o = e[i]?.key;
    o !== void 0 && (l[o] = i);
  }
  return l;
}
const mh = [
  "create",
  "update",
  "remove",
  "destroy",
  "pre",
  "post"
];
function yh(e, t, n) {
  const l = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: []
  }, i = t !== void 0 ? t : Va;
  for (const h of mh)
    for (const y of e) {
      const E = y[h];
      E !== void 0 && l[h].push(E);
    }
  function o(h) {
    const y = h.id ? "#" + h.id : "", E = h.getAttribute("class"), S = E ? "." + E.split(" ").join(".") : "";
    return ee(
      i.tagName(h).toLowerCase() + y + S,
      {},
      [],
      void 0,
      h
    );
  }
  function a(h) {
    return ee(void 0, {}, [], void 0, h);
  }
  function c(h, y) {
    return function() {
      if (--y === 0) {
        const S = i.parentNode(h);
        S !== null && i.removeChild(S, h);
      }
    };
  }
  function s(h, y) {
    let E;
    const S = h.data, k = S?.hook;
    k?.init?.(h);
    const U = h.children, p = h.sel;
    if (p === "!")
      h.text ??= "", h.elm = i.createComment(h.text);
    else if (p === "")
      h.elm = i.createTextNode(h.text);
    else if (p !== void 0) {
      const C = p.indexOf("#"), m = p.indexOf(".", C), T = C > 0 ? C : p.length, _ = m > 0 ? m : p.length, v = C !== -1 || m !== -1 ? p.slice(0, Math.min(T, _)) : p, A = S?.ns, F = A === void 0 ? i.createElement(v, S) : i.createElementNS(A, v, S);
      for (h.elm = F, T < _ && F.setAttribute("id", p.slice(T + 1, _)), m > 0 && F.setAttribute("class", p.slice(_ + 1).replace(/\./g, " ")), E = 0; E < l.create.length; ++E) l.create[E](Yo, h);
      if (Ot(h.text) && (!hn(U) || U.length === 0) && i.appendChild(F, i.createTextNode(h.text)), hn(U))
        for (E = 0; E < U.length; ++E) {
          const N = U[E];
          N != null && i.appendChild(F, s(N, y));
        }
      k !== void 0 && (k.create?.(Yo, h), k.insert !== void 0 && y.push(h));
    } else if (n?.experimental?.fragments && h.children) {
      for (h.elm = (i.createDocumentFragment ?? fh)(), E = 0; E < l.create.length; ++E) l.create[E](Yo, h);
      for (E = 0; E < h.children.length; ++E) {
        const C = h.children[E];
        C != null && i.appendChild(
          h.elm,
          s(C, y)
        );
      }
    } else
      h.elm = i.createTextNode(h.text);
    return h.elm;
  }
  function r(h, y, E, S, k, U) {
    for (; S <= k; ++S) {
      const p = E[S];
      p != null && i.insertBefore(h, s(p, U), y);
    }
  }
  function u(h) {
    const y = h.data;
    if (y !== void 0) {
      y?.hook?.destroy?.(h);
      for (let E = 0; E < l.destroy.length; ++E) l.destroy[E](h);
      if (h.children !== void 0)
        for (let E = 0; E < h.children.length; ++E) {
          const S = h.children[E];
          S != null && typeof S != "string" && u(S);
        }
    }
  }
  function f(h, y, E, S) {
    for (; E <= S; ++E) {
      let k;
      const U = y[E];
      if (U != null)
        if (U.sel !== void 0) {
          u(U), k = l.remove.length + 1;
          const p = c(U.elm, k);
          for (let m = 0; m < l.remove.length; ++m) l.remove[m](U, p);
          const C = U?.data?.hook?.remove;
          C !== void 0 ? C(U, p) : p();
        } else U.children ? (u(U), f(
          h,
          U.children,
          0,
          U.children.length - 1
        )) : i.removeChild(h, U.elm);
    }
  }
  function d(h, y, E, S) {
    let k = 0, U = 0, p = y.length - 1, C = y[0], m = y[p], T = E.length - 1, _ = E[0], v = E[T], A, F, N, le;
    for (; k <= p && U <= T; )
      C == null ? C = y[++k] : m == null ? m = y[--p] : _ == null ? _ = E[++U] : v == null ? v = E[--T] : In(C, _) ? (g(C, _, S), C = y[++k], _ = E[++U]) : In(m, v) ? (g(m, v, S), m = y[--p], v = E[--T]) : In(C, v) ? (g(C, v, S), i.insertBefore(
        h,
        C.elm,
        i.nextSibling(m.elm)
      ), C = y[++k], v = E[--T]) : In(m, _) ? (g(m, _, S), i.insertBefore(h, m.elm, C.elm), m = y[--p], _ = E[++U]) : (A === void 0 && (A = hh(y, k, p)), F = A[_.key], F === void 0 ? (i.insertBefore(
        h,
        s(_, S),
        C.elm
      ), _ = E[++U]) : A[v.key] === void 0 ? (i.insertBefore(
        h,
        s(v, S),
        i.nextSibling(m.elm)
      ), v = E[--T]) : (N = y[F], N.sel !== _.sel ? i.insertBefore(
        h,
        s(_, S),
        C.elm
      ) : (g(N, _, S), y[F] = void 0, i.insertBefore(h, N.elm, C.elm)), _ = E[++U]));
    U <= T && (le = E[T + 1] == null ? null : E[T + 1].elm, r(
      h,
      le,
      E,
      U,
      T,
      S
    )), k <= p && f(h, y, k, p);
  }
  function g(h, y, E) {
    const S = y.data?.hook;
    S?.prepatch?.(h, y);
    const k = y.elm = h.elm;
    if (h === y) return;
    if (y.data !== void 0 || y.text !== void 0 && y.text !== h.text) {
      y.data ??= {}, h.data ??= {};
      for (let C = 0; C < l.update.length; ++C)
        l.update[C](h, y);
      y.data?.hook?.update?.(h, y);
    }
    const U = h.children, p = y.children;
    y.text === void 0 ? U !== void 0 && p !== void 0 ? U !== p && d(k, U, p, E) : p !== void 0 ? (h.text !== void 0 && i.setTextContent(k, ""), r(k, null, p, 0, p.length - 1, E)) : U !== void 0 ? f(k, U, 0, U.length - 1) : h.text !== void 0 && i.setTextContent(k, "") : h.text !== y.text && (U !== void 0 && f(k, U, 0, U.length - 1), i.setTextContent(k, y.text)), S?.postpatch?.(h, y);
  }
  return function(y, E) {
    let S, k, U;
    const p = [];
    for (S = 0; S < l.pre.length; ++S) l.pre[S]();
    for (dh(i, y) ? y = o(y) : ph(i, y) && (y = a(y)), In(y, E) ? g(y, E, p) : (k = y.elm, U = i.parentNode(k), s(E, p), U !== null && (i.insertBefore(U, E.elm, i.nextSibling(k)), f(U, [y], 0, 0))), S = 0; S < p.length; ++S)
      p[S].data.hook.insert(p[S]);
    for (S = 0; S < l.post.length; ++S) l.post[S]();
    return E;
  };
}
function uo(e, t, n) {
  if (e.ns = "http://www.w3.org/2000/svg", n !== "foreignObject" && t !== void 0)
    for (let l = 0; l < t.length; ++l) {
      const i = t[l];
      if (typeof i == "string") continue;
      const o = i.data;
      o !== void 0 && uo(o, i.children, i.sel);
    }
}
function ki(e, t, n) {
  let l = {}, i, o, a;
  if (n !== void 0 ? (t !== null && (l = t), hn(n) ? i = n : Ot(n) ? o = n.toString() : n && n.sel && (i = [n])) : t != null && (hn(t) ? i = t : Ot(t) ? o = t.toString() : t && t.sel ? i = [t] : l = t), i !== void 0)
    for (a = 0; a < i.length; ++a)
      Ot(i[a]) && (i[a] = ee(
        void 0,
        void 0,
        void 0,
        i[a],
        void 0
      ));
  return e.startsWith("svg") && (e.length === 3 || e[3] === "." || e[3] === "#") && uo(l, i, e), ee(e, l, i, o, void 0);
}
function gh(e) {
  let t, n;
  if (hn(e) ? t = e : Ot(t) ? n = e : t && t.sel && (t = [e]), t !== void 0)
    for (let l = 0; l < t.length; ++l)
      Ot(t[l]) && (t[l] = ee(void 0, void 0, void 0, t[l], void 0));
  return ee(void 0, {}, t, n, void 0);
}
function pi(e, t) {
  const n = t.data?.ns;
  e.data.fn = t.data.fn, e.data.args = t.data.args, t.data = e.data, t.children = e.children, t.text = e.text, t.elm = e.elm, n && uo(t.data, t.children, t.sel);
}
function Ch(e) {
  const t = e.data, n = t.fn(...t.args);
  pi(n, e);
}
function Th(e, t) {
  let n;
  const l = e.data, i = t.data, o = l.args, a = i.args;
  if (l.fn !== i.fn || o.length !== a.length) {
    pi(i.fn(...a), t);
    return;
  }
  for (n = 0; n < a.length; ++n)
    if (o[n] !== a[n]) {
      pi(i.fn(...a), t);
      return;
    }
  pi(e, t);
}
const bh = function(t, n, l, i) {
  return i === void 0 && (i = l, l = n, n = void 0), ki(t, {
    key: n,
    hook: { init: Ch, prepatch: Th },
    fn: l,
    args: i
  });
};
function Eh(e, t) {
  const n = e.data.attachData;
  t.data.attachData.placeholder = n.placeholder, t.data.attachData.real = n.real, e.elm = e.data.attachData.real;
}
function Sh(e, t) {
  t.elm = t.data.attachData.placeholder;
}
function vh(e) {
  e.elm !== void 0 && e.elm.parentNode.removeChild(e.elm), e.elm = e.data.attachData.real;
}
function xh(e, t) {
  const n = t.elm, l = t.data.attachData, i = document.createElement("span");
  t.elm = i, l.target.appendChild(n), l.real = n, l.placeholder = i;
}
function _h(e, t) {
  t.data === void 0 && (t.data = {}), t.data.hook === void 0 && (t.data.hook = {});
  const n = t.data, l = t.data.hook;
  return n.attachData = { target: e, placeholder: void 0, real: void 0 }, l.create = xh, l.prepatch = Eh, l.postpatch = Sh, l.destroy = vh, t;
}
function Rh(e) {
  return e.slice(5).replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function _u(e, t) {
  const n = t !== void 0 ? t : Va;
  let l;
  if (n.isElement(e)) {
    const i = e.id ? "#" + e.id : "", o = e.getAttribute("class")?.match(/[^\t\r\n\f ]+/g), a = o ? "." + o.join(".") : "", c = n.tagName(e).toLowerCase() + i + a, s = {}, r = {}, u = {}, f = [];
    let d, g, h;
    const y = e.attributes, E = e.childNodes;
    for (g = 0, h = y.length; g < h; g++)
      d = y[g].nodeName, d.startsWith("data-") ? r[Rh(d)] = y[g].nodeValue || "" : d !== "id" && d !== "class" && (s[d] = y[g].nodeValue);
    for (g = 0, h = E.length; g < h; g++)
      f.push(_u(E[g], t));
    return Object.keys(s).length > 0 && (u.attrs = s), Object.keys(r).length > 0 && (u.dataset = r), c.startsWith("svg") && (c.length === 3 || c[3] === "." || c[3] === "#") && uo(u, f, c), ee(c, u, f, void 0, e);
  } else return n.isText(e) ? (l = n.getTextContent(e), ee(void 0, void 0, void 0, l, e)) : n.isComment(e) ? (l = n.getTextContent(e), ee("!", {}, [], l, e)) : ee("", {}, [], void 0, e);
}
const Oh = "http://www.w3.org/1999/xlink", Uh = "http://www.w3.org/2000/xmlns/", Ah = "http://www.w3.org/XML/1998/namespace", ys = 58, Dh = 120, kh = 109;
function gs(e, t) {
  let n;
  const l = t.elm;
  let i = e.data.attrs, o = t.data.attrs;
  if (!(!i && !o) && i !== o) {
    i = i || {}, o = o || {};
    for (n in o) {
      const a = o[n];
      i[n] !== a && (a === !0 ? l.setAttribute(n, "") : a === !1 ? l.removeAttribute(n) : n.charCodeAt(0) !== Dh ? l.setAttribute(n, a) : n.charCodeAt(3) === ys ? l.setAttributeNS(Ah, n, a) : n.charCodeAt(5) === ys ? n.charCodeAt(1) === kh ? l.setAttributeNS(Uh, n, a) : l.setAttributeNS(Oh, n, a) : l.setAttribute(n, a));
    }
    for (n in i)
      n in o || l.removeAttribute(n);
  }
}
const Ph = {
  create: gs,
  update: gs
};
function Cs(e, t) {
  let n, l;
  const i = t.elm;
  let o = e.data.class, a = t.data.class;
  if (!(!o && !a) && o !== a) {
    o = o || {}, a = a || {};
    for (l in o)
      o[l] && !Object.prototype.hasOwnProperty.call(a, l) && i.classList.remove(l);
    for (l in a)
      n = a[l], n !== o[l] && i.classList[n ? "add" : "remove"](l);
  }
}
const Mh = { create: Cs, update: Cs }, Ts = /[A-Z]/g;
function bs(e, t) {
  const n = t.elm;
  let l = e.data.dataset, i = t.data.dataset, o;
  if (!l && !i || l === i) return;
  l = l || {}, i = i || {};
  const a = n.dataset;
  for (o in l)
    o in i || (a ? o in a && delete a[o] : n.removeAttribute(
      "data-" + o.replace(Ts, "-$&").toLowerCase()
    ));
  for (o in i)
    l[o] !== i[o] && (a ? a[o] = i[o] : n.setAttribute(
      "data-" + o.replace(Ts, "-$&").toLowerCase(),
      i[o]
    ));
}
const Nh = {
  create: bs,
  update: bs
};
function Ru(e, t, n) {
  if (typeof e == "function")
    e.call(t, n, t);
  else if (typeof e == "object")
    for (let l = 0; l < e.length; l++)
      Ru(e[l], t, n);
}
function Lh(e, t) {
  const n = e.type, l = t.data.on;
  l && l[n] && Ru(l[n], t, e);
}
function Fh() {
  return function e(t) {
    Lh(t, e.vnode);
  };
}
function Qo(e, t) {
  const n = e.data.on, l = e.listener, i = e.elm, o = t && t.data.on, a = t && t.elm;
  let c;
  if (n !== o) {
    if (n && l)
      if (o)
        for (c in n)
          o[c] || i.removeEventListener(c, l, !1);
      else
        for (c in n)
          i.removeEventListener(c, l, !1);
    if (o) {
      const s = t.listener = e.listener || Fh();
      if (s.vnode = t, n)
        for (c in o)
          n[c] || a.addEventListener(c, s, !1);
      else
        for (c in o)
          a.addEventListener(c, s, !1);
    }
  }
}
const Hh = {
  create: Qo,
  update: Qo,
  destroy: Qo
};
function Es(e, t) {
  let n, l, i;
  const o = t.elm;
  let a = e.data.props, c = t.data.props;
  if (!(!a && !c) && a !== c) {
    a = a || {}, c = c || {};
    for (n in c)
      l = c[n], i = a[n], i !== l && (n !== "value" || o[n] !== l) && (o[n] = l);
  }
}
const $h = { create: Es, update: Es }, Ss = typeof window?.requestAnimationFrame == "function" ? window.requestAnimationFrame.bind(window) : setTimeout, wh = (e) => {
  Ss(() => {
    Ss(e);
  });
};
let ra = !1;
function zh(e, t, n) {
  wh(() => {
    e[t] = n;
  });
}
function vs(e, t) {
  let n, l;
  const i = t.elm;
  let o = e.data.style, a = t.data.style;
  if (!o && !a || o === a) return;
  o = o || {}, a = a || {};
  const c = "delayed" in o;
  for (l in o)
    l in a || (l[0] === "-" && l[1] === "-" ? i.style.removeProperty(l) : i.style[l] = "");
  for (l in a)
    if (n = a[l], l === "delayed" && a.delayed)
      for (const s in a.delayed)
        n = a.delayed[s], (!c || n !== o.delayed[s]) && zh(i.style, s, n);
    else l !== "remove" && n !== o[l] && (l[0] === "-" && l[1] === "-" ? i.style.setProperty(l, n) : i.style[l] = n);
}
function Wh(e) {
  let t, n;
  const l = e.elm, i = e.data.style;
  if (!(!i || !(t = i.destroy)))
    for (n in t)
      l.style[n] = t[n];
}
function Bh(e, t) {
  const n = e.data.style;
  if (!n || !n.remove) {
    t();
    return;
  }
  ra || (e.elm.offsetLeft, ra = !0);
  let l;
  const i = e.elm;
  let o = 0;
  const a = n.remove;
  let c = 0;
  const s = [];
  for (l in a)
    s.push(l), i.style[l] = a[l];
  const u = getComputedStyle(i)["transition-property"].split(", ");
  for (; o < u.length; ++o)
    s.indexOf(u[o]) !== -1 && c++;
  i.addEventListener("transitionend", (f) => {
    f.target === i && --c, c === 0 && t();
  });
}
function Ih() {
  ra = !1;
}
const jh = {
  pre: Ih,
  create: vs,
  update: vs,
  destroy: Wh,
  remove: Bh
};
function Kh(e, ...t) {
  const n = Ga(t, []);
  return n.length === 1 && !n[0].sel && n[0].text ? ee(
    void 0,
    void 0,
    void 0,
    n[0].text,
    void 0
  ) : ee(void 0, e ?? {}, n, void 0, void 0);
}
function Ga(e, t) {
  for (const n of e)
    n != null && n !== !1 && n !== "" && (Array.isArray(n) ? Ga(n, t) : typeof n == "string" || typeof n == "number" || typeof n == "boolean" ? t.push(
      ee(void 0, void 0, void 0, String(n), void 0)
    ) : t.push(n));
  return t;
}
function Yh(e, t, ...n) {
  const l = Ga(n, []);
  return typeof e == "function" ? e(t, l) : l.length === 1 && !l[0].sel && l[0].text ? ki(e, t, l[0].text) : ki(e, t, l);
}
const xS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Fragment: Kh,
  array: hn,
  attachTo: _h,
  attributesModule: Ph,
  classModule: Mh,
  datasetModule: Nh,
  eventListenersModule: Hh,
  fragment: gh,
  h: ki,
  htmlDomApi: Va,
  init: yh,
  jsx: Yh,
  primitive: Ot,
  propsModule: $h,
  styleModule: jh,
  thunk: bh,
  toVNode: _u,
  vnode: ee
}, Symbol.toStringTag, { value: "Module" }));
var b = /* @__PURE__ */ ((e) => (e[e.Unknown = 0] = "Unknown", e[e.HtmlElement = 1] = "HtmlElement", e[e.ComponentUnknown = 2] = "ComponentUnknown", e[e.ComponentClass = 4] = "ComponentClass", e[e.ComponentFunction = 8] = "ComponentFunction", e[e.Text = 16] = "Text", e[e.SvgElement = 32] = "SvgElement", e[e.InputElement = 64] = "InputElement", e[e.TextareaElement = 128] = "TextareaElement", e[e.SelectElement = 256] = "SelectElement", e[e.Portal = 1024] = "Portal", e[e.ReCreate = 2048] = "ReCreate", e[e.ContentEditable = 4096] = "ContentEditable", e[e.Fragment = 8192] = "Fragment", e[e.InUse = 16384] = "InUse", e[e.ForwardRef = 32768] = "ForwardRef", e[e.Normalized = 65536] = "Normalized", e[e.ForwardRefComponent = 32776] = "ForwardRefComponent", e[e.FormElement = 448] = "FormElement", e[e.Element = 481] = "Element", e[e.Component = 14] = "Component", e[e.DOMRef = 1521] = "DOMRef", e[e.InUseOrNormalized = 81920] = "InUseOrNormalized", e[e.ClearInUse = -16385] = "ClearInUse", e[e.ComponentKnown = 12] = "ComponentKnown", e))(b || {}), R = /* @__PURE__ */ ((e) => (e[e.UnknownChildren = 0] = "UnknownChildren", e[e.HasInvalidChildren = 1] = "HasInvalidChildren", e[e.HasVNodeChildren = 2] = "HasVNodeChildren", e[e.HasNonKeyedChildren = 4] = "HasNonKeyedChildren", e[e.HasKeyedChildren = 8] = "HasKeyedChildren", e[e.HasTextChildren = 16] = "HasTextChildren", e[e.MultipleChildren = 12] = "MultipleChildren", e))(R || {});
const Qh = "a runtime error occured! Use Inferno in development environment to find the error.", Pt = Array.isArray;
function Mt(e) {
  const t = typeof e;
  return t === "string" || t === "number";
}
function D(e) {
  return e == null;
}
function nt(e) {
  return e === null || e === !1 || e === !0 || e === void 0;
}
function M(e) {
  return typeof e == "function";
}
function Nt(e) {
  return typeof e == "string";
}
function Ou(e) {
  return typeof e == "number";
}
function te(e) {
  return e === null;
}
function Xh(e) {
  return e === void 0;
}
function G(e) {
  throw e || (e = Qh), new Error(`Inferno Error: ${e}`);
}
function Nn(e) {
  console.error(e);
}
function qh(e, t) {
  return M(t) ? { data: e, event: t } : null;
}
function Za(e) {
  return !te(e) && typeof e == "object";
}
const I = {}, Uu = "$F";
class Lt {
  componentDidAppear = [];
  componentWillDisappear = [];
  componentWillMove = [];
}
process.env.NODE_ENV !== "production" && Object.freeze(I);
function Ja(e) {
  return e.substring(2).toLowerCase();
}
function Au(e, t) {
  e.appendChild(t);
}
function ro(e, t, n) {
  te(n) ? Au(e, t) : e.insertBefore(t, n);
}
function Vh(e, t) {
  return t ? document.createElementNS("http://www.w3.org/2000/svg", e) : document.createElement(e);
}
function Gh(e, t, n) {
  e.replaceChild(t, n);
}
function Du(e, t) {
  e.removeChild(t);
}
function ku(e) {
  for (let t = 0; t < e.length; t++)
    e[t]();
}
function Zh(e, t, n) {
  const l = e.children;
  return (n & b.ComponentClass) !== 0 ? l.$LI : (n & b.Fragment) !== 0 ? e.childFlags === R.HasVNodeChildren ? l : l[t ? 0 : l.length - 1] : l;
}
function ue(e, t) {
  let n, l = e;
  for (; !D(l); ) {
    if (n = l.flags, (n & b.DOMRef) !== 0)
      return l.dom;
    l = Zh(l, t, n);
  }
  return null;
}
function fo(e, t) {
  let n = e.length, l;
  for (; (l = e.pop()) !== void 0; )
    l(() => {
      --n <= 0 && M(t) && t();
    });
}
function Jh(e) {
  for (let t = 0; t < e.length; t++)
    e[t].fn();
  for (let t = 0; t < e.length; t++) {
    const n = e[t];
    ro(n.parent, n.dom, n.next);
  }
  e.splice(0, e.length);
}
function po(e, t, n) {
  for (; !D(e); ) {
    const l = e.flags;
    if ((l & b.DOMRef) !== 0) {
      (!n || e.dom.parentNode === t) && Du(t, e.dom);
      return;
    }
    const i = e.children;
    if ((l & b.ComponentClass) !== 0 && (e = i.$LI), (l & b.ComponentFunction) !== 0 && (e = i), (l & b.Fragment) !== 0)
      if (e.childFlags === R.HasVNodeChildren)
        e = i;
      else {
        for (let o = 0, a = i.length; o < a; ++o)
          po(i[o], t, !1);
        return;
      }
  }
}
function em(e, t) {
  return function() {
    po(e, t, !0);
  };
}
function ho(e, t, n) {
  n.componentWillDisappear.length > 0 ? fo(
    n.componentWillDisappear,
    em(e, t)
  ) : po(e, t, !1);
}
function tm(e, t, n, l, i, o, a, c) {
  e.componentWillMove.push({
    dom: l,
    fn: () => {
      (a & b.ComponentClass) !== 0 ? n.componentWillMove(t, i, l) : (a & b.ComponentFunction) !== 0 && n.onComponentWillMove(t, i, l, c);
    },
    next: o,
    parent: i
  });
}
function Pu(e, t, n, l, i) {
  let o, a;
  const c = t.flags;
  for (; !D(t); ) {
    const s = t.flags;
    if ((s & b.DOMRef) !== 0) {
      !D(o) && (M(o.componentWillMove) || M(o.onComponentWillMove)) ? tm(
        i,
        e,
        o,
        t.dom,
        n,
        l,
        c,
        a
      ) : ro(n, t.dom, l);
      return;
    }
    const r = t.children;
    if ((s & b.ComponentClass) !== 0)
      o = t.children, a = t.props, t = r.$LI;
    else if ((s & b.ComponentFunction) !== 0)
      o = t.ref, a = t.props, t = r;
    else if ((s & b.Fragment) !== 0)
      if (t.childFlags === R.HasVNodeChildren)
        t = r;
      else {
        for (let u = 0, f = r.length; u < f; ++u)
          Pu(
            e,
            r[u],
            n,
            l,
            i
          );
        return;
      }
  }
}
function ec(e) {
  return e.name ?? e.displayName ?? e.constructor.name ?? (e.toString().match(/^function\s*([^\s(]+)/) || [])[1];
}
function Mu(e, t, n) {
  return M(e.constructor.getDerivedStateFromProps) ? {
    ...n,
    ...e.constructor.getDerivedStateFromProps(t, n)
  } : n;
}
const gl = {
  v: !1
}, Cl = {
  createVNode: null
};
function el(e, t) {
  e.textContent = t;
}
function Nu(e, t) {
  return Za(e) && e.event === t.event && e.data === t.data;
}
function Lu(e, t) {
  for (const n in t)
    Xh(e[n]) && (e[n] = t[n]);
  return e;
}
function tc(e, t) {
  return M(e) && (e(t), !0);
}
function ze(e) {
  let t;
  if (Pt(e))
    t = "Array(" + (e.length > 3 ? e.slice(0, 3).toString() + ",..." : e.toString()) + ")";
  else if (Mt(e))
    t = "Text(" + e + ")";
  else if (nt(e))
    t = "InvalidVNode(" + e + ")";
  else {
    const n = e.flags;
    n & b.Element ? t = `<${e.type}${e.className ? ' class="' + e.className + '"' : ""}>` : n & b.Text ? t = `Text(${e.children})` : n & b.Portal ? t = "Portal*" : t = `<${ec(e.type)} />`;
  }
  return ">> " + t + `
`;
}
function fa(e, t) {
  const n = {};
  for (let l = 0, i = e.length; l < i; ++l) {
    const o = e[l];
    if (Pt(o))
      return `Encountered ARRAY in mount, array must be flattened, or normalize used. Location: 
` + ze(o);
    if (nt(o)) {
      if (t)
        return `Encountered invalid node when preparing to keyed algorithm. Location: 
` + ze(o);
      if (Object.keys(n).length !== 0)
        return `Encountered invalid node with mixed keys. Location: 
` + ze(o);
      continue;
    }
    if (typeof o == "object") {
      if (o.isValidated)
        continue;
      o.isValidated = !0;
    }
    const a = o.key;
    if (!D(a) && !Mt(a))
      return `Encountered child vNode where key property is not string or number. Location: 
` + ze(o);
    const c = o.children, s = o.childFlags;
    if (!nt(c)) {
      let r;
      if (s & R.MultipleChildren ? r = fa(
        c,
        (s & R.HasKeyedChildren) !== 0
      ) : s === R.HasVNodeChildren && (r = fa([c], !1)), r)
        return r += ze(o), r;
    }
    if (t && D(a))
      return `Encountered child without key during keyed algorithm. If this error points to Array make sure children is flat list. Location: 
` + ze(o);
    if (!t && D(a)) {
      if (Object.keys(n).length !== 0)
        return `Encountered children with key missing. Location: 
` + ze(o);
      continue;
    }
    if (n[a])
      return "Encountered two children with same key: {" + a + `}. Location: 
` + ze(o);
    n[a] = !0;
  }
  return null;
}
function nm(e) {
  if (process.env.NODE_ENV !== "production") {
    if (e.childFlags === R.HasInvalidChildren)
      return;
    if (e.flags & b.InputElement && G("input elements can't have children."), e.flags & b.TextareaElement && G("textarea elements can't have children."), e.flags & b.Element) {
      const t = {
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        command: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0
      }, n = e.type.toLowerCase();
      n === "media" && G("media elements can't have children."), t[n] && G(`${n} elements can't have children.`);
    }
  }
}
function Fu(e) {
  if (process.env.NODE_ENV !== "production") {
    if (!e.isValidated && e.children && e.flags & b.Element) {
      const t = fa(
        Array.isArray(e.children) ? e.children : [e.children],
        (e.childFlags & R.HasKeyedChildren) > 0
      );
      t && G(t + ze(e));
    }
    e.isValidated = !0;
  }
}
function Hu(e) {
  Ou(e.flags) || G(
    `normalization received an object that's not a valid VNode, you should stringify it first or fix createVNode flags. Object: "${JSON.stringify(
      e
    )}".`
  );
}
const tl = "$";
function mo(e, t, n, l, i, o, a, c) {
  process.env.NODE_ENV !== "production" && (this.isValidated = !1), this.childFlags = e, this.children = t, this.className = n, this.dom = null, this.flags = l, this.key = i === void 0 ? null : i, this.props = o === void 0 ? null : o, this.ref = a === void 0 ? null : a, this.type = c;
}
function nc(e, t, n, l, i, o, a, c) {
  process.env.NODE_ENV !== "production" && e & b.Component && G(
    "Creating Component vNodes using createVNode is not allowed. Use Inferno.createComponentVNode method."
  );
  const s = i === void 0 ? R.HasInvalidChildren : i, r = new mo(
    s,
    l,
    n,
    e,
    a,
    o,
    c,
    t
  );
  return Cl.createVNode && Cl.createVNode(r), s === R.UnknownChildren && wu(r, r.children), process.env.NODE_ENV !== "production" && nm(r), r;
}
function lm(e, t, n) {
  if (e & b.ComponentClass)
    return n;
  const l = (e & b.ForwardRef ? t.render : t).defaultHooks;
  return D(l) ? n : D(n) ? l : Lu(n, l);
}
function im(e, t, n) {
  const l = (e & b.ForwardRef ? t.render : t).defaultProps;
  return D(l) ? n : D(n) ? { ...l } : Lu(n, l);
}
function om(e, t) {
  return e & b.ComponentKnown ? e : t.prototype?.render ? b.ComponentClass : t.render ? b.ForwardRefComponent : b.ComponentFunction;
}
function am(e, t, n, l, i) {
  process.env.NODE_ENV !== "production" && (e & b.HtmlElement) !== 0 && G(
    "Creating element vNodes using createComponentVNode is not allowed. Use Inferno.createVNode method."
  ), e = om(e, t);
  const o = new mo(
    R.HasInvalidChildren,
    null,
    null,
    e,
    l,
    im(e, t, n),
    lm(e, t, i),
    t
  );
  return M(Cl.createVNode) && Cl.createVNode(o), o;
}
function Ln(e, t) {
  return new mo(
    R.HasInvalidChildren,
    D(e) || e === !0 || e === !1 ? "" : e,
    null,
    b.Text,
    t,
    null,
    null,
    null
  );
}
function lc(e, t, n) {
  const l = nc(
    b.Fragment,
    b.Fragment,
    null,
    e,
    t,
    null,
    n,
    null
  );
  switch (l.childFlags) {
    case R.HasInvalidChildren:
      l.children = yo(), l.childFlags = R.HasVNodeChildren;
      break;
    case R.HasTextChildren:
      l.children = [Ln(e)], l.childFlags = R.HasNonKeyedChildren;
      break;
  }
  return l;
}
function cm(e) {
  const t = e.props;
  if (t) {
    const n = e.flags;
    n & b.Element && (t.children !== void 0 && D(e.children) && wu(e, t.children), t.className !== void 0 && (D(e.className) && (e.className = t.className || null), t.className = void 0)), t.key !== void 0 && (e.key = t.key, t.key = void 0), t.ref !== void 0 && (n & b.ComponentFunction ? e.ref = { ...e.ref, ...t.ref } : e.ref = t.ref, t.ref = void 0);
  }
  return e;
}
function sm(e) {
  const t = e.children, n = e.childFlags;
  return lc(
    n === R.HasVNodeChildren ? j(t) : t.map(j),
    n,
    e.key
  );
}
function j(e) {
  const t = e.flags & b.ClearInUse;
  let n = e.props;
  if (t & b.Component && !te(n)) {
    const l = n;
    n = {};
    for (const i in l)
      n[i] = l[i];
  }
  return (t & b.Fragment) === 0 ? new mo(
    e.childFlags,
    e.children,
    e.className,
    t,
    e.key,
    n,
    e.ref,
    e.type
  ) : sm(e);
}
function yo() {
  return Ln("", null);
}
function um(e, t) {
  const n = Nl(e);
  return nc(
    b.Portal,
    b.Portal,
    null,
    n,
    R.UnknownChildren,
    null,
    n.key,
    t
    // Should there be own prop for this?
  );
}
function $u(e, t, n, l) {
  for (const i = e.length; n < i; n++) {
    let o = e[n];
    if (!nt(o)) {
      const a = l + tl + n;
      if (Pt(o))
        $u(o, t, 0, a);
      else {
        if (Mt(o))
          o = Ln(o, a);
        else {
          process.env.NODE_ENV !== "production" && Hu(o);
          const c = o.key, s = Nt(c) && c[0] === tl;
          (o.flags & b.InUseOrNormalized || s) && (o = j(o)), o.flags |= b.Normalized, s ? c.substring(0, l.length) !== l && (o.key = l + c) : te(c) ? o.key = a : o.key = l + c;
        }
        t.push(o);
      }
    }
  }
}
function rm(e) {
  switch (e) {
    case "svg":
      return b.SvgElement;
    case "input":
      return b.InputElement;
    case "select":
      return b.SelectElement;
    case "textarea":
      return b.TextareaElement;
    // @ts-expect-error Fragment is special case
    case Uu:
      return b.Fragment;
    default:
      return b.HtmlElement;
  }
}
function wu(e, t) {
  let n, l = R.HasInvalidChildren;
  if (nt(t))
    n = t;
  else if (Mt(t))
    l = R.HasTextChildren, n = t;
  else if (Pt(t)) {
    const i = t.length;
    for (let o = 0; o < i; ++o) {
      let a = t[o];
      if (nt(a) || Pt(a)) {
        n = n || t.slice(0, o), $u(t, n, o, "");
        break;
      } else if (Mt(a))
        n = n || t.slice(0, o), n.push(Ln(a, tl + o));
      else {
        process.env.NODE_ENV !== "production" && Hu(a);
        const c = a.key, s = (a.flags & b.InUseOrNormalized) > 0, r = te(c), u = Nt(c) && c[0] === tl;
        s || r || u ? (n = n || t.slice(0, o), (s || u) && (a = j(a)), (r || u) && (a.key = tl + o), n.push(a)) : n && n.push(a), a.flags |= b.Normalized;
      }
    }
    n = n || t, n.length === 0 ? l = R.HasInvalidChildren : l = R.HasKeyedChildren;
  } else
    n = t, n.flags |= b.Normalized, t.flags & b.InUseOrNormalized && (n = j(t)), l = R.HasVNodeChildren;
  return e.children = n, e.childFlags = l, e;
}
function Nl(e) {
  return nt(e) || Mt(e) ? Ln(e, null) : Pt(e) ? lc(e, R.UnknownChildren, null) : e.flags & b.InUse ? j(e) : e;
}
const St = "http://www.w3.org/1999/xlink", Xo = "http://www.w3.org/XML/1998/namespace", xs = {
  "xlink:actuate": St,
  "xlink:arcrole": St,
  "xlink:href": St,
  "xlink:role": St,
  "xlink:show": St,
  "xlink:title": St,
  "xlink:type": St,
  "xml:base": Xo,
  "xml:lang": Xo,
  "xml:space": Xo
};
function go(e) {
  return {
    onClick: e,
    onDblClick: e,
    onFocusIn: e,
    onFocusOut: e,
    onKeyDown: e,
    onKeyPress: e,
    onKeyUp: e,
    onMouseDown: e,
    onMouseMove: e,
    onMouseUp: e,
    onTouchEnd: e,
    onTouchMove: e,
    onTouchStart: e
  };
}
const zu = go(0), da = go(null), Wu = go(!0);
function _s(e, t) {
  let n = t.$EV;
  return n || (n = t.$EV = go(null)), n[e] || ++zu[e] === 1 && (da[e] = Tm(e)), n;
}
function Bu(e, t) {
  const n = t.$EV;
  n?.[e] && (--zu[e] === 0 && (document.removeEventListener(
    Ja(e),
    da[e]
  ), da[e] = null), n[e] = null);
}
function fm(e, t, n, l) {
  if (M(n))
    _s(e, l)[e] = n;
  else if (Za(n)) {
    if (Nu(t, n))
      return;
    _s(e, l)[e] = n;
  } else
    Bu(e, l);
}
function dm(e) {
  return M(e.composedPath) ? e.composedPath()[0] : e.target;
}
function pm(e, t, n, l) {
  let i = dm(e);
  do {
    if (t && i.disabled)
      return;
    const o = i.$EV;
    if (!D(o)) {
      const a = o[n];
      if (a && (l.dom = i, a.event ? a.event(a.data, e) : a(e), e.cancelBubble))
        return;
    }
    i = i.parentNode;
  } while (!te(i));
}
function hm() {
  this.cancelBubble = !0, this.immediatePropagationStopped || this.stopImmediatePropagation();
}
function mm() {
  return this.defaultPrevented;
}
function ym() {
  return this.cancelBubble;
}
function gm(e) {
  const t = {
    dom: document
  };
  return e.isDefaultPrevented = mm, e.isPropagationStopped = ym, e.stopPropagation = hm, Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get: function() {
      return t.dom;
    }
  }), t;
}
function Cm(e) {
  const t = e === "onClick" || e === "onDblClick";
  return function(n) {
    pm(n, t, e, gm(n));
  };
}
function Tm(e) {
  const t = Cm(e);
  return document.addEventListener(Ja(e), t), t;
}
function bm(e, t) {
  const n = document.createElement("i");
  return n.innerHTML = t, n.innerHTML === e.innerHTML;
}
function Rs(e, t, n) {
  const l = e[t];
  if (l)
    l.event ? l.event(l.data, n) : l(n);
  else {
    const i = t.toLowerCase();
    M(e[i]) && e[i](n);
  }
}
function Ll(e, t) {
  const n = function(i) {
    const o = this.$V;
    if (D(o))
      return;
    const a = o.props ?? I, c = o.dom;
    if (Nt(e))
      Rs(a, e, i);
    else
      for (let s = 0; s < e.length; ++s)
        Rs(a, e[s], i);
    if (M(t)) {
      const s = this.$V, r = s.props ?? I;
      t(r, c, !1, s);
    }
  };
  return Object.defineProperty(n, "wrapped", {
    configurable: !1,
    enumerable: !1,
    value: !0,
    writable: !1
  }), n;
}
function Ut(e, t, n) {
  const l = `$${t}`, i = e[l];
  if (i) {
    if (i[1].wrapped)
      return;
    e.removeEventListener(i[0], i[1]), e[l] = null;
  }
  M(n) && (e.addEventListener(t, n), e[l] = [t, n]);
}
function ic(e) {
  return e === "checkbox" || e === "radio";
}
const Em = Ll("onInput", oc), Sm = Ll(
  ["onClick", "onChange"],
  oc
);
function Iu(e) {
  e.stopPropagation();
}
Iu.wrapped = !0;
function vm(e, t) {
  ic(t.type) ? (Ut(e, "change", Sm), Ut(e, "click", Iu)) : Ut(e, "input", Em);
}
function oc(e, t) {
  const n = e.type, l = e.value, i = e.checked, o = e.multiple, a = e.defaultValue, c = !D(l);
  n != null && n !== t.type && t.setAttribute("type", n), !D(o) && o !== t.multiple && (t.multiple = o), !D(a) && !c && (t.defaultValue = a + ""), ic(n) ? (c && (t.value = l), D(i) || (t.checked = i)) : c && t.value !== l ? (t.defaultValue = l, t.value = l) : D(i) || (t.checked = i);
}
function Vn(e, t) {
  if (e.type === "option")
    xm(e, t);
  else {
    const n = e.children, l = e.flags;
    if ((l & b.ComponentClass) !== 0)
      Vn(n.$LI, t);
    else if ((l & b.ComponentFunction) !== 0)
      Vn(n, t);
    else if (e.childFlags === R.HasVNodeChildren)
      Vn(n, t);
    else if ((e.childFlags & R.MultipleChildren) !== 0)
      for (let i = 0, o = n.length; i < o; ++i)
        Vn(n[i], t);
  }
}
function xm(e, t) {
  const n = e.props ?? I, l = n.value, i = e.dom;
  i.value = l, l === t || Pt(t) && t.includes(l) ? i.selected = !0 : (!D(t) || !D(n.selected)) && (i.selected = !!n.selected);
}
const _m = Ll("onChange", ju);
function Rm(e) {
  Ut(e, "change", _m);
}
function ju(e, t, n, l) {
  const i = !!e.multiple;
  !D(e.multiple) && i !== t.multiple && (t.multiple = i);
  const o = e.selectedIndex;
  if (o === -1 && (t.selectedIndex = -1), l.childFlags !== R.HasInvalidChildren) {
    let c = e.value;
    Ou(o) && o > -1 && !D(t.options[o]) && (c = t.options[o].value), n && D(c) && (c = e.defaultValue), Vn(l, c);
  }
}
const Om = Ll(
  "onInput",
  Ku
), Um = Ll("onChange");
function Am(e, t) {
  Ut(e, "input", Om), M(t.onChange) && Ut(e, "change", Um);
}
function Ku(e, t, n) {
  const l = e.value, i = t.value;
  if (D(l)) {
    if (n) {
      const o = e.defaultValue;
      !D(o) && o !== i && (t.defaultValue = o, t.value = o);
    }
  } else i !== l && (t.defaultValue = l, t.value = l);
}
function Yu(e, t, n, l, i, o) {
  (e & b.InputElement) !== 0 ? oc(l, n) : (e & b.SelectElement) !== 0 ? ju(l, n, i, t) : (e & b.TextareaElement) !== 0 && Ku(l, n, i), o && (n.$V = t);
}
function Dm(e, t, n) {
  (e & b.InputElement) !== 0 ? vm(t, n) : (e & b.SelectElement) !== 0 ? Rm(t) : (e & b.TextareaElement) !== 0 && Am(t, n);
}
function Qu(e) {
  return ic(e.type) ? !D(e.checked) : !D(e.value);
}
function km() {
  return {
    current: null
  };
}
function Pm(e) {
  if (process.env.NODE_ENV !== "production" && !M(e)) {
    Nn(
      `forwardRef requires a render function but was given ${e === null ? "null" : typeof e}.`
    );
    return;
  }
  return {
    render: e
  };
}
function Pi(e) {
  D(e) || !tc(e, null) && e.current && (e.current = null);
}
function Fl(e, t, n) {
  !D(e) && (M(e) || e.current !== void 0) && n.push(() => {
    !tc(e, t) && e.current !== void 0 && (e.current = t);
  });
}
function Se(e, t, n) {
  qe(e, n), ho(e, t, n);
}
function qe(e, t) {
  const n = e.flags, l = e.children;
  let i;
  if ((n & b.Element) !== 0) {
    i = e.ref;
    const o = e.props;
    Pi(i);
    const a = e.childFlags;
    if (!te(o)) {
      const c = Object.keys(o);
      for (let s = 0, r = c.length; s < r; s++) {
        const u = c[s];
        Wu[u] && Bu(u, e.dom);
      }
    }
    a & R.MultipleChildren ? Tl(l, t) : a === R.HasVNodeChildren && qe(l, t);
  } else if (l)
    if (n & b.ComponentClass) {
      M(l.componentWillUnmount) && l.componentWillUnmount();
      let o = t;
      M(l.componentWillDisappear) && (o = new Lt(), Os(
        t,
        l,
        l.$LI.dom,
        n,
        void 0
      )), Pi(e.ref), l.$UN = !0, qe(l.$LI, o);
    } else if (n & b.ComponentFunction) {
      let o = t;
      if (i = e.ref, !D(i)) {
        let a = null;
        M(i.onComponentWillUnmount) && (a = ue(e, !0), i.onComponentWillUnmount(a, e.props || I)), M(i.onComponentWillDisappear) && (o = new Lt(), a = a || ue(e, !0), Os(
          t,
          i,
          a,
          n,
          e.props
        ));
      }
      qe(l, o);
    } else n & b.Portal ? Se(l, e.ref, t) : n & b.Fragment && e.childFlags & R.MultipleChildren && Tl(l, t);
}
function Tl(e, t) {
  for (let n = 0, l = e.length; n < l; ++n)
    qe(e[n], t);
}
function Mm(e, t) {
  return function() {
    if (t)
      for (let n = 0; n < e.length; n++) {
        const l = e[n];
        po(l, t, !1);
      }
  };
}
function hi(e, t, n) {
  n.componentWillDisappear.length > 0 ? fo(
    n.componentWillDisappear,
    Mm(t, e)
  ) : e.textContent = "";
}
function Mi(e, t, n, l) {
  Tl(n, l), t.flags & b.Fragment ? ho(t, e, l) : hi(e, n, l);
}
function Os(e, t, n, l, i) {
  e.componentWillDisappear.push((o) => {
    l & b.ComponentClass ? t.componentWillDisappear(n, o) : l & b.ComponentFunction && t.onComponentWillDisappear(n, i, o);
  });
}
function Nm(e) {
  const t = e.event;
  return function(n) {
    t(e.data, n);
  };
}
function Lm(e, t, n, l) {
  if (Za(n)) {
    if (Nu(t, n))
      return;
    n = Nm(n);
  }
  Ut(l, Ja(e), n);
}
function Fm(e, t, n) {
  if (D(t)) {
    n.removeAttribute("style");
    return;
  }
  const l = n.style;
  let i, o;
  if (Nt(t)) {
    l.cssText = t;
    return;
  }
  if (!D(e) && !Nt(e)) {
    for (i in t)
      o = t[i], o !== e[i] && l.setProperty(i, o);
    for (i in e)
      D(t[i]) && l.removeProperty(i);
  } else
    for (i in t)
      o = t[i], l.setProperty(i, o);
}
function Hm(e, t, n, l, i) {
  const o = e?.__html || "", a = t?.__html || "";
  o !== a && !D(a) && !bm(l, a) && (te(n) || (n.childFlags & R.MultipleChildren ? Tl(n.children, i) : n.childFlags === R.HasVNodeChildren && qe(n.children, i), n.children = null, n.childFlags = R.HasInvalidChildren), l.innerHTML = a);
}
function $m(e, t, n) {
  const l = D(e) ? "" : e;
  t[n] !== l && (t[n] = l);
}
function pa(e, t, n, l, i, o, a, c) {
  switch (e) {
    case "children":
    case "childrenType":
    case "className":
    case "defaultValue":
    case "key":
    case "multiple":
    case "ref":
    case "selectedIndex":
      break;
    case "autoFocus":
      l.autofocus = !!n;
      break;
    case "allowfullscreen":
    case "autoplay":
    case "capture":
    case "checked":
    case "controls":
    case "default":
    case "disabled":
    case "hidden":
    case "indeterminate":
    case "loop":
    case "muted":
    case "novalidate":
    case "open":
    case "readOnly":
    case "required":
    case "reversed":
    case "scoped":
    case "seamless":
    case "selected":
      l[e] = !!n;
      break;
    case "defaultChecked":
    case "value":
    case "volume":
      if (o && e === "value")
        break;
      $m(n, l, e);
      break;
    case "style":
      Fm(t, n, l);
      break;
    case "dangerouslySetInnerHTML":
      Hm(t, n, a, l, c);
      break;
    default:
      Wu[e] ? fm(e, t, n, l) : e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 ? Lm(e, t, n, l) : D(n) ? l.removeAttribute(e) : i && xs[e] ? l.setAttributeNS(xs[e], e, n) : (process.env.NODE_ENV !== "production" && e === "href" && Nt(n) && n.startsWith("javascript:") && Nn(
        'Rendering links with javascript: URLs is not recommended. Use event handlers instead if you can. Inferno was passed "' + n + '".'
      ), l.setAttribute(e, n));
      break;
  }
}
function Xu(e, t, n, l, i, o) {
  let a = !1;
  const c = (t & b.FormElement) > 0;
  c && (a = Qu(n), a && Dm(t, l, n));
  for (const s in n)
    pa(
      s,
      null,
      n[s],
      l,
      i,
      a,
      null,
      o
    );
  c && Yu(t, e, l, n, !0, a);
}
function wm(e) {
  const t = [];
  e.componentWillMount && e.componentWillMount.__suppressDeprecationWarning !== !0 && t.push("componentWillMount"), e.componentWillReceiveProps && e.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && t.push("componentWillReceiveProps"), e.componentWillUpdate && e.componentWillUpdate.__suppressDeprecationWarning !== !0 && t.push("componentWillUpdate"), t.length > 0 && Nn(`
      Warning: Unsafe legacy lifecycles will not be called for components using new component APIs.
      ${ec(e)} contains the following legacy lifecycles:
      ${t.join(`
`)}
      The above lifecycles should be removed.
    `);
}
function qu(e, t, n) {
  const l = Nl(
    e.render(t, e.state, n)
  );
  let i = n;
  return M(e.getChildContext) && (i = { ...n, ...e.getChildContext() }), e.$CX = i, l;
}
function Vu(e, t, n, l, i, o) {
  const a = new t(n, l), c = a.$N = !!(t.getDerivedStateFromProps || a.getSnapshotBeforeUpdate);
  if (a.$SVG = i, a.$L = o, process.env.NODE_ENV !== "production" && (a.getDerivedStateFromProps && Nn(
    `${ec(
      a
    )} getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.`
  ), c && wm(a)), e.children = a, a.$BS = !1, a.context = l, a.props === I && (a.props = n), c)
    a.state = Mu(a, n, a.state);
  else if (M(a.componentWillMount)) {
    a.$BR = !0, a.componentWillMount();
    const s = a.$PS;
    if (!te(s)) {
      const r = a.state;
      if (te(r))
        a.state = s;
      else
        for (const u in s)
          r[u] = s[u];
      a.$PS = null;
    }
    a.$BR = !1;
  }
  return a.$LI = qu(a, n, l), a;
}
function ac(e, t) {
  const n = e.props || I;
  return e.flags & b.ForwardRef ? e.type.render(n, e.ref, t) : e.type(n, t);
}
function Q(e, t, n, l, i, o, a) {
  const c = e.flags |= b.InUse;
  (c & b.Element) !== 0 ? Zu(
    e,
    t,
    n,
    l,
    i,
    o,
    a
  ) : (c & b.ComponentClass) !== 0 ? Bm(
    e,
    t,
    n,
    l,
    i,
    o,
    a
  ) : c & b.ComponentFunction ? Im(
    e,
    t,
    n,
    l,
    i,
    o,
    a
  ) : c & b.Text ? Gu(e, t, i) : c & b.Fragment ? Wm(
    e,
    n,
    t,
    l,
    i,
    o,
    a
  ) : c & b.Portal ? zm(e, n, t, i, o, a) : process.env.NODE_ENV !== "production" && G(
    typeof e == "object" ? `mount() received an object that's not a valid VNode, you should stringify it first, fix createVNode flags or call normalizeChildren. Object: "${JSON.stringify(
      e
    )}".` : `mount() expects a valid VNode, instead it received an object with the type "${typeof e}".`
  );
}
function zm(e, t, n, l, i, o) {
  Q(
    e.children,
    e.ref,
    t,
    !1,
    null,
    i,
    o
  );
  const a = yo();
  Gu(a, n, l), e.dom = a.dom;
}
function Wm(e, t, n, l, i, o, a) {
  let c = e.children, s = e.childFlags;
  s & R.MultipleChildren && c.length === 0 && (s = e.childFlags = R.HasVNodeChildren, c = e.children = yo()), s === R.HasVNodeChildren ? Q(
    c,
    n,
    t,
    l,
    i,
    o,
    a
  ) : Ft(
    c,
    n,
    t,
    l,
    i,
    o,
    a
  );
}
function Gu(e, t, n) {
  const l = e.dom = document.createTextNode(
    e.children
  );
  te(t) || ro(t, l, n);
}
function Zu(e, t, n, l, i, o, a) {
  const c = e.flags, s = e.props, r = e.className, u = e.childFlags, f = e.dom = Vh(
    e.type,
    l = l || (c & b.SvgElement) > 0
  );
  let d = e.children;
  if (!D(r) && r !== "" && (l ? f.setAttribute("class", r) : f.className = r), process.env.NODE_ENV !== "production" && Fu(e), u === R.HasTextChildren)
    el(f, d);
  else if (u !== R.HasInvalidChildren) {
    const g = l && e.type !== "foreignObject";
    u === R.HasVNodeChildren ? (d.flags & b.InUse && (e.children = d = j(d)), Q(
      d,
      f,
      n,
      g,
      null,
      o,
      a
    )) : (u === R.HasKeyedChildren || u === R.HasNonKeyedChildren) && Ft(
      d,
      f,
      n,
      g,
      null,
      o,
      a
    );
  }
  te(t) || ro(t, f, i), te(s) || Xu(e, c, s, f, l, a), process.env.NODE_ENV !== "production" && Nt(e.ref) && G(
    'string "refs" are not supported in Inferno 1.0. Use callback ref or Inferno.createRef() API instead.'
  ), Fl(e.ref, f, o);
}
function Ft(e, t, n, l, i, o, a) {
  for (let c = 0; c < e.length; ++c) {
    let s = e[c];
    s.flags & b.InUse && (e[c] = s = j(s)), Q(s, t, n, l, i, o, a);
  }
}
function Bm(e, t, n, l, i, o, a) {
  const c = Vu(
    e,
    e.type,
    e.props || I,
    n,
    l,
    o
  );
  let s = a;
  M(c.componentDidAppear) && (s = new Lt()), Q(
    c.$LI,
    t,
    c.$CX,
    l,
    i,
    o,
    s
  ), Ju(e.ref, c, o, a);
}
function Im(e, t, n, l, i, o, a) {
  const c = e.ref;
  let s = a;
  !D(c) && M(c.onComponentDidAppear) && (s = new Lt()), Q(
    e.children = Nl(ac(e, n)),
    t,
    n,
    l,
    i,
    o,
    s
  ), er(e, o, a);
}
function jm(e) {
  return () => {
    e.componentDidMount();
  };
}
function Km(e, t, n) {
  e.componentDidAppear.push(() => {
    t.componentDidAppear(n);
  });
}
function Ym(e, t, n, l) {
  e.componentDidAppear.push(() => {
    t.onComponentDidAppear(n, l);
  });
}
function Ju(e, t, n, l) {
  Fl(e, t, n), process.env.NODE_ENV !== "production" && (Mt(e) ? G(
    'string "refs" are not supported in Inferno 1.0. Use callback ref or Inferno.createRef() API instead.'
  ) : !D(e) && typeof e == "object" && e.current === void 0 && G(
    "functional component lifecycle events are not supported on ES2015 class components."
  )), M(t.componentDidMount) && n.push(jm(t)), M(t.componentDidAppear) && Km(l, t, t.$LI.dom);
}
function Qm(e, t) {
  return () => {
    e.onComponentDidMount(
      ue(t, !0),
      t.props || I
    );
  };
}
function er(e, t, n) {
  const l = e.ref;
  D(l) || (tc(l.onComponentWillMount, e.props || I), M(l.onComponentDidMount) && t.push(Qm(l, e)), M(l.onComponentDidAppear) && Ym(
    n,
    l,
    ue(e, !0),
    e.props
  ));
}
function Xm(e, t, n, l, i, o, a) {
  qe(e, a), (t.flags & e.flags & b.DOMRef) !== 0 ? (Q(t, null, l, i, null, o, a), Gh(n, t.dom, e.dom)) : (Q(
    t,
    n,
    l,
    i,
    ue(e, !0),
    o,
    a
  ), ho(e, n, a));
}
function lt(e, t, n, l, i, o, a, c) {
  const s = t.flags |= b.InUse;
  e.flags !== s || e.type !== t.type || e.key !== t.key || s & b.ReCreate ? e.flags & b.InUse ? Xm(
    e,
    t,
    n,
    l,
    i,
    a,
    c
  ) : Q(
    t,
    n,
    l,
    i,
    o,
    a,
    c
  ) : s & b.Element ? Jm(e, t, l, i, a, c) : s & b.ComponentClass ? ly(
    e,
    t,
    n,
    l,
    i,
    o,
    a,
    c
  ) : s & b.ComponentFunction ? iy(
    e,
    t,
    n,
    l,
    i,
    o,
    a,
    c
  ) : s & b.Text ? oy(e, t) : s & b.Fragment ? Gm(
    e,
    t,
    n,
    l,
    i,
    a,
    c
  ) : Zm(e, t, l, a, c);
}
function qm(e, t, n) {
  e !== t && (e !== "" ? n.firstChild.nodeValue = t : el(n, t));
}
function Vm(e, t) {
  e.textContent !== t && (e.textContent = t);
}
function Gm(e, t, n, l, i, o, a) {
  const c = e.children;
  let s = t.children;
  const r = e.childFlags;
  let u = t.childFlags, f = null;
  u & R.MultipleChildren && s.length === 0 && (u = t.childFlags = R.HasVNodeChildren, s = t.children = yo());
  const d = (u & R.HasVNodeChildren) !== 0;
  if (r & R.MultipleChildren) {
    const g = c.length;
    // It uses keyed algorithm
    (r & R.HasKeyedChildren && u & R.HasKeyedChildren || // It transforms from many to single
    d || // It will append more nodes
    !d && s.length > g) && (f = ue(c[g - 1], !1).nextSibling);
  }
  cc(
    r,
    u,
    c,
    s,
    n,
    l,
    i,
    f,
    e,
    o,
    a
  );
}
function Zm(e, t, n, l, i) {
  const o = e.ref, a = t.ref, c = t.children;
  if (cc(
    e.childFlags,
    t.childFlags,
    e.children,
    c,
    o,
    n,
    !1,
    null,
    e,
    l,
    i
  ), t.dom = e.dom, o !== a && !nt(c)) {
    const s = c.dom;
    Du(o, s), Au(a, s);
  }
}
function Jm(e, t, n, l, i, o) {
  const a = t.dom = e.dom, c = e.props, s = t.props, r = t.flags;
  let u = !1, f = !1, d;
  if (l = l || (r & b.SvgElement) > 0, c !== s) {
    const S = c || I;
    if (d = s || I, d !== I) {
      u = (r & b.FormElement) > 0, u && (f = Qu(d));
      for (const k in d) {
        const U = S[k], p = d[k];
        U !== p && pa(
          k,
          U,
          p,
          a,
          l,
          f,
          e,
          o
        );
      }
    }
    if (S !== I)
      for (const k in S)
        D(d[k]) && !D(S[k]) && pa(
          k,
          S[k],
          null,
          a,
          l,
          f,
          e,
          o
        );
  }
  const g = t.children, h = t.className;
  e.className !== h && (D(h) ? a.removeAttribute("class") : l ? a.setAttribute("class", h) : a.className = h), process.env.NODE_ENV !== "production" && Fu(t), r & b.ContentEditable ? Vm(a, g) : cc(
    e.childFlags,
    t.childFlags,
    e.children,
    g,
    a,
    n,
    l && t.type !== "foreignObject",
    null,
    e,
    i,
    o
  ), u && Yu(
    r,
    t,
    a,
    d,
    !1,
    f
  );
  const y = t.ref, E = e.ref;
  E !== y && (Pi(E), Fl(y, a, i));
}
function ey(e, t, n, l, i, o, a) {
  qe(e, a), Ft(
    t,
    n,
    l,
    i,
    ue(e, !0),
    o,
    a
  ), ho(e, n, a);
}
function ty(e, t, n, l, i, o, a, c, s, r, u) {
  const f = e.length | 0, d = t.length | 0;
  f === 0 ? d > 0 && Ft(
    t,
    n,
    l,
    i,
    o,
    a,
    c
  ) : d === 0 ? Mi(n, s, e, c) : r === R.HasKeyedChildren && u === R.HasKeyedChildren ? cy(
    e,
    t,
    n,
    l,
    i,
    f,
    d,
    o,
    s,
    a,
    c
  ) : ay(
    e,
    t,
    n,
    l,
    i,
    f,
    d,
    o,
    a,
    c
  );
}
function cc(e, t, n, l, i, o, a, c, s, r, u) {
  switch (e) {
    case R.HasVNodeChildren:
      switch (t) {
        case R.HasVNodeChildren:
          lt(
            n,
            l,
            i,
            o,
            a,
            c,
            r,
            u
          );
          break;
        case R.HasInvalidChildren:
          Se(n, i, u);
          break;
        case R.HasTextChildren:
          qe(n, u), el(i, l);
          break;
        default:
          ey(
            n,
            l,
            i,
            o,
            a,
            r,
            u
          );
          break;
      }
      break;
    case R.HasInvalidChildren:
      switch (t) {
        case R.HasVNodeChildren:
          Q(
            l,
            i,
            o,
            a,
            c,
            r,
            u
          );
          break;
        case R.HasInvalidChildren:
          break;
        case R.HasTextChildren:
          el(i, l);
          break;
        default:
          Ft(
            l,
            i,
            o,
            a,
            c,
            r,
            u
          );
          break;
      }
      break;
    case R.HasTextChildren:
      switch (t) {
        case R.HasTextChildren:
          qm(n, l, i);
          break;
        case R.HasVNodeChildren:
          hi(i, n, u), Q(
            l,
            i,
            o,
            a,
            c,
            r,
            u
          );
          break;
        case R.HasInvalidChildren:
          hi(i, n, u);
          break;
        default:
          hi(i, n, u), Ft(
            l,
            i,
            o,
            a,
            c,
            r,
            u
          );
          break;
      }
      break;
    default:
      switch (t) {
        case R.HasTextChildren:
          Tl(n, u), el(i, l);
          break;
        case R.HasVNodeChildren:
          Mi(i, s, n, u), Q(
            l,
            i,
            o,
            a,
            c,
            r,
            u
          );
          break;
        case R.HasInvalidChildren:
          Mi(i, s, n, u);
          break;
        default:
          ty(
            n,
            l,
            i,
            o,
            a,
            c,
            r,
            u,
            s,
            t,
            e
          );
          break;
      }
      break;
  }
}
function ny(e, t, n, l, i) {
  i.push(() => {
    e.componentDidUpdate(t, n, l);
  });
}
function tr(e, t, n, l, i, o, a, c, s, r) {
  const u = e.state, f = e.props, d = !!e.$N, g = M(e.shouldComponentUpdate);
  if (d && (t = Mu(
    e,
    n,
    t !== u ? { ...u, ...t } : t
  )), a || !g || g && e.shouldComponentUpdate(n, t, i)) {
    !d && M(e.componentWillUpdate) && e.componentWillUpdate(n, t, i), e.props = n, e.state = t, e.context = i;
    let h = null;
    const y = qu(e, n, i);
    d && M(e.getSnapshotBeforeUpdate) && (h = e.getSnapshotBeforeUpdate(f, u)), lt(
      e.$LI,
      y,
      l,
      e.$CX,
      o,
      c,
      s,
      r
    ), e.$LI = y, M(e.componentDidUpdate) && ny(e, f, u, h, s);
  } else
    e.props = n, e.state = t, e.context = i;
}
function ly(e, t, n, l, i, o, a, c) {
  const s = t.children = e.children;
  if (te(s))
    return;
  s.$L = a;
  const r = t.props || I, u = t.ref, f = e.ref;
  let d = s.state;
  if (!s.$N) {
    if (M(s.componentWillReceiveProps)) {
      if (s.$BR = !0, s.componentWillReceiveProps(r, l), s.$UN)
        return;
      s.$BR = !1;
    }
    te(s.$PS) || (d = { ...d, ...s.$PS }, s.$PS = null);
  }
  tr(
    s,
    d,
    r,
    n,
    l,
    i,
    !1,
    o,
    a,
    c
  ), f !== u && (Pi(f), Fl(u, s, a));
}
function iy(e, t, n, l, i, o, a, c) {
  let s = !0;
  const r = t.props || I, u = t.ref, f = e.props, d = !D(u), g = e.children;
  if (d && M(u.onComponentShouldUpdate) && (s = u.onComponentShouldUpdate(f, r)), s) {
    d && M(u.onComponentWillUpdate) && u.onComponentWillUpdate(f, r);
    const h = Nl(
      ac(t, l)
    );
    lt(
      g,
      h,
      n,
      l,
      i,
      o,
      a,
      c
    ), t.children = h, d && M(u.onComponentDidUpdate) && u.onComponentDidUpdate(f, r);
  } else
    t.children = g;
}
function oy(e, t) {
  const n = t.children, l = t.dom = e.dom;
  n !== e.children && (l.nodeValue = n);
}
function ay(e, t, n, l, i, o, a, c, s, r) {
  const u = o > a ? a : o;
  let f = 0, d, g;
  for (; f < u; ++f)
    d = t[f], g = e[f], d.flags & b.InUse && (d = t[f] = j(d)), lt(
      g,
      d,
      n,
      l,
      i,
      c,
      s,
      r
    ), e[f] = d;
  if (o < a)
    for (f = u; f < a; ++f)
      d = t[f], d.flags & b.InUse && (d = t[f] = j(d)), Q(d, n, l, i, c, s, r);
  else if (o > a)
    for (f = u; f < o; ++f)
      Se(e[f], n, r);
}
function cy(e, t, n, l, i, o, a, c, s, r, u) {
  let f = o - 1, d = a - 1, g = 0, h = e[g], y = t[g], E, S;
  e: {
    for (; h.key === y.key; ) {
      if (y.flags & b.InUse && (t[g] = y = j(y)), lt(
        h,
        y,
        n,
        l,
        i,
        c,
        r,
        u
      ), e[g] = y, ++g, g > f || g > d)
        break e;
      h = e[g], y = t[g];
    }
    for (h = e[f], y = t[d]; h.key === y.key; ) {
      if (y.flags & b.InUse && (t[d] = y = j(y)), lt(
        h,
        y,
        n,
        l,
        i,
        c,
        r,
        u
      ), e[f] = y, f--, d--, g > f || g > d)
        break e;
      h = e[f], y = t[d];
    }
  }
  if (g > f) {
    if (g <= d)
      for (E = d + 1, S = E < a ? ue(t[E], !0) : c; g <= d; )
        y = t[g], y.flags & b.InUse && (t[g] = y = j(y)), ++g, Q(y, n, l, i, S, r, u);
  } else if (g > d)
    for (; g <= f; )
      Se(e[g++], n, u);
  else
    sy(
      e,
      t,
      l,
      o,
      a,
      f,
      d,
      g,
      n,
      i,
      c,
      s,
      r,
      u
    );
}
function sy(e, t, n, l, i, o, a, c, s, r, u, f, d, g) {
  let h, y, E = 0, S = 0, k = c;
  const U = c, p = o - c + 1, C = a - c + 1, m = new Int32Array(C + 1);
  let T = p === l, _ = !1, v = 0, A = 0;
  if (i < 4 || (p | C) < 32)
    for (S = k; S <= o; ++S)
      if (h = e[S], A < C) {
        for (c = U; c <= a; c++)
          if (y = t[c], h.key === y.key) {
            if (m[c - U] = S + 1, T)
              for (T = !1; k < S; )
                Se(e[k++], s, g);
            v > c ? _ = !0 : v = c, y.flags & b.InUse && (t[c] = y = j(y)), lt(
              h,
              y,
              s,
              n,
              r,
              u,
              d,
              g
            ), ++A;
            break;
          }
        !T && c > a && Se(h, s, g);
      } else T || Se(h, s, g);
  else {
    const F = {};
    for (S = U; S <= a; ++S)
      F[t[S].key] = S;
    for (S = k; S <= o; ++S)
      if (h = e[S], A < C)
        if (c = F[h.key], c !== void 0) {
          if (T)
            for (T = !1; S > k; )
              Se(e[k++], s, g);
          m[c - U] = S + 1, v > c ? _ = !0 : v = c, y = t[c], y.flags & b.InUse && (t[c] = y = j(y)), lt(
            h,
            y,
            s,
            n,
            r,
            u,
            d,
            g
          ), ++A;
        } else T || Se(h, s, g);
      else T || Se(h, s, g);
  }
  if (T)
    Mi(s, f, e, g), Ft(
      t,
      s,
      n,
      r,
      u,
      d,
      g
    );
  else if (_) {
    const F = uy(m);
    for (c = F.length - 1, S = C - 1; S >= 0; S--)
      m[S] === 0 ? (v = S + U, y = t[v], y.flags & b.InUse && (t[v] = y = j(y)), E = v + 1, Q(
        y,
        s,
        n,
        r,
        E < i ? ue(t[E], !0) : u,
        d,
        g
      )) : c < 0 || S !== F[c] ? (v = S + U, y = t[v], E = v + 1, Pu(
        f,
        y,
        s,
        E < i ? ue(t[E], !0) : u,
        g
      )) : c--;
    g.componentWillMove.length > 0 && Jh(g.componentWillMove);
  } else if (A !== C)
    for (S = C - 1; S >= 0; S--)
      m[S] === 0 && (v = S + U, y = t[v], y.flags & b.InUse && (t[v] = y = j(y)), E = v + 1, Q(
        y,
        s,
        n,
        r,
        E < i ? ue(t[E], !0) : u,
        d,
        g
      ));
}
let we, Zl, Us = 0;
function uy(e) {
  let t = 0, n = 0, l = 0, i = 0, o = 0, a = 0, c = 0;
  const s = e.length;
  for (s > Us && (Us = s, we = new Int32Array(s), Zl = new Int32Array(s)); n < s; ++n)
    if (t = e[n], t !== 0) {
      if (l = we[i], e[l] < t) {
        Zl[n] = l, we[++i] = n;
        continue;
      }
      for (o = 0, a = i; o < a; )
        c = o + a >> 1, e[we[c]] < t ? o = c + 1 : a = c;
      t < e[we[o]] && (o > 0 && (Zl[n] = we[o - 1]), we[o] = n);
    }
  o = i + 1;
  const r = new Int32Array(o);
  for (a = we[o - 1]; o-- > 0; )
    r[o] = a, a = Zl[a], we[o] = 0;
  return r;
}
const nr = typeof document < "u";
process.env.NODE_ENV !== "production" && nr && !document.body && Nn(
  'Inferno warning: you cannot initialize inferno without "document.body". Wait on "DOMContentLoaded" event, add script to bottom of body, or use async/defer attributes on script tag.'
);
let lr = null;
nr && (lr = document.body, window.Node && (Node.prototype.$EV = null, Node.prototype.$V = null));
function ir(e, t, n, l) {
  process.env.NODE_ENV !== "production" && (lr === t && G(
    'you cannot render() to the "document.body". Use an empty element as a container instead.'
  ), nt(t) && G(
    `render target ( DOM ) is mandatory, received ${t === null ? "null" : typeof t}`
  ));
  const i = [], o = new Lt();
  let a = t.$V;
  gl.v = !0, D(a) ? D(e) || ((e.flags & b.InUse) !== 0 && (e = j(e)), Q(
    e,
    t,
    l,
    !1,
    null,
    i,
    o
  ), t.$V = e, a = e) : D(e) ? (Se(a, t, o), t.$V = null) : (e.flags & b.InUse && (e = j(e)), lt(
    a,
    e,
    t,
    l,
    !1,
    null,
    i,
    o
  ), a = t.$V = e), ku(i), fo(o.componentDidAppear), gl.v = !1, M(n) && n();
}
function or(e, t, n = null, l = I) {
  ir(e, t, n, l);
}
function ry(e) {
  return function(n, l, i, o) {
    e || (e = n), or(l, e, i, o);
  };
}
const mi = [], fy = Promise.resolve().then.bind(Promise.resolve());
let ha = !1;
function As(e, t, n, l) {
  const i = e.$PS;
  if (M(t) && (t = t(
    i ? { ...e.state, ...i } : e.state,
    e.props,
    e.context
  )), D(i))
    e.$PS = t;
  else
    for (const o in t)
      i[o] = t[o];
  if (e.$BR)
    M(n) && e.$L.push(n.bind(e));
  else {
    if (!gl.v && mi.length === 0) {
      cr(e, l), M(n) && n.call(e);
      return;
    }
    if (mi.includes(e) || mi.push(e), l && (e.$F = !0), ha || (ha = !0, fy(ar)), M(n)) {
      let o = e.$QU;
      o || (o = e.$QU = []), o.push(n);
    }
  }
}
function dy(e) {
  const t = e.$QU;
  for (let n = 0; n < t.length; ++n)
    t[n].call(e);
  e.$QU = null;
}
function ar() {
  let e;
  for (ha = !1; e = mi.shift(); )
    if (!e.$UN) {
      const t = e.$F;
      e.$F = !1, cr(e, t), e.$QU && dy(e);
    }
}
function cr(e, t) {
  if (t || !e.$BR) {
    const n = e.$PS;
    e.$PS = null;
    const l = [], i = new Lt();
    gl.v = !0, tr(
      e,
      { ...e.state, ...n },
      e.props,
      ue(e.$LI, !0).parentNode,
      e.context,
      e.$SVG,
      t,
      null,
      l,
      i
    ), ku(l), fo(i.componentDidAppear), gl.v = !1;
  } else
    e.state = e.$PS, e.$PS = null;
}
let py = class {
  // Public
  state = null;
  props;
  context;
  displayName;
  // Internal properties
  $BR = !1;
  // BLOCK RENDER
  $BS = !0;
  // BLOCK STATE
  $PS = null;
  // PENDING STATE (PARTIAL or FULL)
  $LI = null;
  // LAST INPUT
  $UN = !1;
  // UNMOUNTED
  $CX = null;
  // CHILDCONTEXT
  $QU = null;
  // QUEUE
  $N = !1;
  // Uses new lifecycle API Flag
  $SSR;
  // Server side rendering flag, true when rendering on server, non existent on client
  $L = null;
  // Current lifecycle of this component
  $SVG = !1;
  // Flag to keep track if component is inside SVG tree
  $F = !1;
  // Force update flag
  constructor(t, n) {
    this.props = t || I, this.context = n || I;
  }
  forceUpdate(t) {
    this.$UN || As(this, {}, t, !0);
  }
  setState(t, n) {
    this.$UN || (this.$BS ? process.env.NODE_ENV !== "production" && G(
      "cannot update state via setState() in constructor. Instead, assign to `this.state` directly or define a `state = {};`"
    ) : As(this, t, n, !1));
  }
  static defaultProps = null;
  /* eslint-disable */
  // @ts-ignore
  render(t, n, l) {
    return null;
  }
};
if (process.env.NODE_ENV !== "production" && !(typeof SKIP_INFERNO_WARNINGS < "u" || typeof process == "object" && (process.env?.SKIP_INFERNO_WARNINGS !== void 0 || process.env?.JEST_WORKER_ID !== void 0))) {
  const t = function() {
  };
  (t.name || t.toString()).includes("testFn") || Nn(
    "It looks like you're using a minified copy of the development build of Inferno. When deploying Inferno apps to production, make sure to use the production build which skips development warnings and is faster. See https://infernojs.org for more details."
  );
}
const hy = process.env.INFERNO_VERSION, RS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnimationQueues: Lt,
  Component: py,
  EMPTY_OBJ: I,
  Fragment: Uu,
  _CI: Vu,
  _HI: Nl,
  _M: Q,
  _MCCC: Ju,
  _ME: Zu,
  _MFCC: er,
  _MP: Xu,
  _MR: Fl,
  _RFC: ac,
  createComponentVNode: am,
  createFragment: lc,
  createPortal: um,
  createRef: km,
  createRenderer: ry,
  createTextVNode: Ln,
  createVNode: nc,
  directClone: j,
  findDOMFromVNode: ue,
  forwardRef: Pm,
  getFlagsForElementVnode: rm,
  linkEvent: qh,
  normalizeProps: cm,
  options: Cl,
  render: or,
  renderInternal: ir,
  rerender: ar,
  version: hy
}, Symbol.toStringTag, { value: "Module" })), be = typeof Symbol == "function" && Symbol.for, vt = be ? Symbol.for("react.element") : 60103, Qt = be ? Symbol.for("react.portal") : 60106, Ue = be ? Symbol.for("react.fragment") : 60107, Hl = be ? Symbol.for("react.strict_mode") : 60108, mn = be ? Symbol.for("react.profiler") : 60114, sc = be ? Symbol.for("react.provider") : 60109, uc = be ? Symbol.for("react.context") : 60110, $l = be ? Symbol.for("react.concurrent_mode") : 60111, Co = be ? Symbol.for("react.forward_ref") : 60112, wl = be ? Symbol.for("react.suspense") : 60113, To = be ? Symbol.for("react.memo") : 60115, rc = be ? Symbol.for("react.lazy") : 60116, Ds = typeof Symbol == "function" && Symbol.iterator, my = "@@iterator";
function Yt(e) {
  if (e === null || typeof e != "object")
    return null;
  const t = Ds && e[Ds] || e[my];
  return typeof t == "function" ? t : null;
}
let sr = () => {
};
sr = function(e) {
  if (e === void 0)
    throw new Error("invariant requires an error message argument");
};
function O(e, t, n, l, i, o, a, c) {
  if (sr(t), !e) {
    let s;
    if (t === void 0)
      s = new Error(
        "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
      );
    else {
      const r = [n, l, i, o, a, c];
      let u = 0;
      s = new Error(
        t.replace(/%s/g, function() {
          return r[u++];
        })
      ), s.name = "Invariant Violation";
    }
    throw s.framesToPop = 1, s;
  }
}
const ur = {};
function zt(e = {}, t, n) {
  this.props = e, this.context = t, this.refs = ur, this.updater = n;
}
zt.prototype.isReactComponent = {};
zt.prototype.setState = function(e, t) {
  O(
    typeof e == "object" || typeof e == "function" || e == null,
    "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
  ), this.updater.enqueueSetState(this, e, t, "setState");
};
zt.prototype.forceUpdate = function(e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function rr() {
}
rr.prototype = zt.prototype;
function bo(e, t, n) {
  this.props = e, this.context = t, this.refs = ur, this.updater = n;
}
const fc = bo.prototype = new rr();
fc.constructor = bo;
Object.assign(fc, zt.prototype);
fc.isPureReactComponent = !0;
function fr() {
  return {
    current: null
  };
}
let yy = function(e, t, ...n) {
  if (n.length > 8)
    throw new Error(
      "warningWithoutStack() currently supports at most 8 arguments."
    );
  if (!e) {
    if (typeof console < "u") {
      const l = n.map((i) => "" + i);
      l.unshift("Warning: " + t), Function.prototype.apply.call(console.error, console, l);
    }
    try {
      let l = 0;
      const i = "Warning: " + t.replace(/%s/g, () => n[l++]);
      throw new Error(i);
    } catch {
    }
  }
};
const dc = {
  current: null
}, dr = Object.prototype.hasOwnProperty, pr = {
  key: !0,
  ref: !0,
  __self: !0,
  __source: !0
};
function hr(e) {
  return e.ref !== void 0;
}
function mr(e) {
  return e.key !== void 0;
}
const pc = function(e, t, n, l, i, o, a) {
  return {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: vt,
    // Built-in properties that belong on the element
    type: e,
    key: t,
    ref: n,
    props: a,
    // Record the component responsible for creating this element.
    _owner: o
  };
};
function hc(e, t, n) {
  let l;
  const i = {};
  let o = null, a = null, c = null, s = null;
  if (t != null) {
    hr(t) && (a = t.ref), mr(t) && (o = "" + t.key), c = t.__self === void 0 ? null : t.__self, s = t.__source === void 0 ? null : t.__source;
    for (l in t)
      dr.call(t, l) && !pr.hasOwnProperty(l) && (i[l] = t[l]);
  }
  const r = arguments.length - 2;
  if (r === 1)
    i.children = n;
  else if (r > 1) {
    const u = Array(r);
    for (let f = 0; f < r; f++)
      u[f] = arguments[f + 2];
    i.children = u;
  }
  if (e && e.defaultProps) {
    const u = e.defaultProps;
    for (l in u)
      i[l] === void 0 && (i[l] = u[l]);
  }
  return pc(
    e,
    o,
    a,
    c,
    s,
    dc.current,
    i
  );
}
function yr(e) {
  const t = hc.bind(null, e);
  return t.type = e, t;
}
function gy(e, t) {
  return pc(
    e.type,
    t,
    e.ref,
    e._self,
    e._source,
    e._owner,
    e.props
  );
}
function gr(e, t, n) {
  O(
    e != null,
    "React.cloneElement(...): The argument must be a React element, but you passed %s.",
    e
  );
  let l;
  const i = Object.assign({}, e.props);
  let o = e.key, a = e.ref;
  const c = e._self, s = e._source;
  let r = e._owner;
  if (t != null) {
    hr(t) && (a = t.ref, r = dc.current), mr(t) && (o = "" + t.key);
    let f;
    e.type && e.type.defaultProps && (f = e.type.defaultProps);
    for (l in t)
      dr.call(t, l) && !pr.hasOwnProperty(l) && (t[l] === void 0 && f !== void 0 ? i[l] = f[l] : i[l] = t[l]);
  }
  const u = arguments.length - 2;
  if (u === 1)
    i.children = n;
  else if (u > 1) {
    const f = Array(u);
    for (let d = 0; d < u; d++)
      f[d] = arguments[d + 2];
    i.children = f;
  }
  return pc(e.type, o, a, c, s, r, i);
}
function Eo(e) {
  return typeof e == "object" && e !== null && e.$$typeof === vt;
}
const ks = ".", Cy = ":";
function Ty(e) {
  const t = /[=:]/g, n = {
    "=": "=0",
    ":": "=2"
  };
  return "$" + ("" + e).replace(t, function(i) {
    return n[i];
  });
}
const by = /\/+/g;
function Cr(e) {
  return ("" + e).replace(by, "$&/");
}
const Ey = 10, Ni = [];
function Tr(e, t, n, l) {
  if (Ni.length) {
    const i = Ni.pop();
    return i.result = e, i.keyPrefix = t, i.func = n, i.context = l, i.count = 0, i;
  } else
    return {
      result: e,
      keyPrefix: t,
      func: n,
      context: l,
      count: 0
    };
}
function br(e) {
  e.result = null, e.keyPrefix = null, e.func = null, e.context = null, e.count = 0, Ni.length < Ey && Ni.push(e);
}
function ma(e, t, n, l) {
  const i = typeof e;
  (i === "undefined" || i === "boolean") && (e = null);
  let o = !1;
  if (e === null)
    o = !0;
  else
    switch (i) {
      case "string":
      case "number":
        o = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case vt:
          case Qt:
            o = !0;
        }
    }
  if (o)
    return n(
      l,
      e,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      t === "" ? ks + qo(e, 0) : t
    ), 1;
  let a, c, s = 0;
  const r = t === "" ? ks : t + Cy;
  if (Array.isArray(e))
    for (let u = 0; u < e.length; u++)
      a = e[u], c = r + qo(a, u), s += ma(
        a,
        c,
        n,
        l
      );
  else {
    const u = Yt(e);
    if (typeof u == "function") {
      const f = u.call(e);
      let d, g = 0;
      for (; !(d = f.next()).done; )
        a = d.value, c = r + qo(a, g++), s += ma(
          a,
          c,
          n,
          l
        );
    } else if (i === "object") {
      let f = "";
      const d = "" + e;
      O(
        !1,
        "Objects are not valid as a React child (found: %s).%s",
        d === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : d,
        f
      );
    }
  }
  return s;
}
function mc(e, t, n) {
  return e == null ? 0 : ma(e, "", t, n);
}
function qo(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? Ty(e.key) : t.toString(36);
}
function Sy(e, t, n) {
  const { func: l, context: i } = e;
  l.call(i, t, e.count++);
}
function vy(e, t, n) {
  if (e == null)
    return e;
  const l = Tr(
    null,
    null,
    t,
    n
  );
  mc(e, Sy, l), br(l);
}
function xy(e, t, n) {
  const { result: l, keyPrefix: i, func: o, context: a } = e;
  let c = o.call(a, t, e.count++);
  Array.isArray(c) ? yc(c, l, n, (s) => s) : c != null && (Eo(c) && (c = gy(
    c,
    // Keep both the (mapped) and old keys if they differ, just as
    // traverseAllChildren used to do for objects as children
    i + (c.key && (!t || t.key !== c.key) ? Cr(c.key) + "/" : "") + n
  )), l.push(c));
}
function yc(e, t, n, l, i) {
  let o = "";
  n != null && (o = Cr(n) + "/");
  const a = Tr(
    t,
    o,
    l,
    i
  );
  mc(e, xy, a), br(a);
}
function _y(e, t, n) {
  if (e == null)
    return e;
  const l = [];
  return yc(e, l, null, t, n), l;
}
function Ry(e) {
  return mc(e, () => null, null);
}
function Oy(e) {
  const t = [];
  return yc(e, t, null, (n) => n), t;
}
function Uy(e) {
  return O(
    Eo(e),
    "React.Children.only expected to receive a single React element child."
  ), e;
}
function Er(e, t) {
  t === void 0 && (t = null);
  const n = {
    $$typeof: uc,
    _calculateChangedBits: t,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: e,
    _currentValue2: e,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null
  };
  return n.Provider = {
    $$typeof: sc,
    _context: n
  }, n.Consumer = n, n;
}
function Sr(e) {
  return {
    $$typeof: rc,
    _ctor: e,
    // React uses these fields to store the result.
    _status: -1,
    _result: null
  };
}
function vr(e) {
  return {
    $$typeof: Co,
    render: e
  };
}
function xr(e, t) {
  return {
    $$typeof: To,
    type: e,
    compare: t === void 0 ? null : t
  };
}
const _r = {
  current: null
};
function at() {
  const e = _r.current;
  return O(
    e !== null,
    `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.`
  ), e;
}
function Rr(e, t) {
  return at().useContext(e, t);
}
function Or(e) {
  return at().useState(e);
}
function Ur(e, t, n) {
  return at().useReducer(e, t, n);
}
function Ar(e) {
  return at().useRef(e);
}
function Dr(e, t) {
  return at().useEffect(e, t);
}
function kr(e, t) {
  return at().useLayoutEffect(e, t);
}
function Pr(e, t) {
  return at().useCallback(e, t);
}
function Mr(e, t) {
  return at().useMemo(e, t);
}
function Nr(e, t, n) {
  return at().useImperativeHandle(e, t, n);
}
function Lr(e, t) {
}
const Vo = !1;
var yn = 1, bl = 2, gn = 3, gc = 4, Cc = 5, Ay = 1073741823, Dy = -1, ky = 250, Py = 5e3, My = 1e4, Ny = Ay, L = null, yi = !1, Go = !1, Ve = gn, nn = -1, gi = -1, El = !1, Li = !1, Ly = typeof performance == "object" && typeof performance.now == "function";
function Sl() {
  if (!El) {
    var e = L.expirationTime;
    Li ? Ci() : Li = !0, Gn(Fy, e);
  }
}
function ya() {
  var e = L, t = L.next;
  if (L === t)
    L = null, t = null;
  else {
    var n = L.previous;
    L = n.next = t, t.previous = n;
  }
  e.next = e.previous = null;
  var l = e.callback, i = e.expirationTime, o = e.priorityLevel, a = Ve, c = gi;
  Ve = o, gi = i;
  var s;
  try {
    s = l();
  } finally {
    Ve = a, gi = c;
  }
  if (typeof s == "function") {
    var r = {
      callback: s,
      priorityLevel: o,
      expirationTime: i,
      next: null,
      previous: null
    };
    if (L === null)
      L = r.next = r.previous = r;
    else {
      var u = null, f = L;
      do {
        if (f.expirationTime >= i) {
          u = f;
          break;
        }
        f = f.next;
      } while (f !== L);
      u === null ? u = L : u === L && (L = r, Sl());
      var d = u.previous;
      d.next = u.previous = r, r.next = u, r.previous = d;
    }
  }
}
function Fr() {
  if (
    // Confirm we've exited the outer most event handler
    nn === -1 && L !== null && L.priorityLevel === yn
  ) {
    El = !0;
    try {
      do
        ya();
      while (
        // Keep flushing until there are no more immediate callbacks
        L !== null && L.priorityLevel === yn
      );
    } finally {
      El = !1, L !== null ? Sl() : Li = !1;
    }
  }
}
function Fy(e) {
  El = !0;
  const t = yi;
  yi = e;
  try {
    if (e)
      for (; L !== null && !(Vo && Go); ) {
        var n = me();
        if (L.expirationTime <= n) {
          do
            ya();
          while (L !== null && L.expirationTime <= n && !(Vo && Go));
          continue;
        }
        break;
      }
    else if (L !== null)
      do
        ya();
      while (L !== null && !nl());
  } finally {
    El = !1, yi = t, L !== null ? Sl() : Li = !1, Fr();
  }
}
function Tc(e, t) {
  switch (e) {
    case yn:
    case bl:
    case gn:
    case gc:
    case Cc:
      break;
    default:
      e = gn;
  }
  var n = Ve, l = nn;
  Ve = e, nn = me();
  try {
    return t();
  } finally {
    Ve = n, nn = l, Fr();
  }
}
function Hr(e, t) {
  var n = nn !== -1 ? nn : me(), l;
  if (typeof t == "object" && t !== null && typeof t.timeout == "number")
    l = n + t.timeout;
  else
    switch (Ve) {
      case yn:
        l = n + Dy;
        break;
      case bl:
        l = n + ky;
        break;
      case Cc:
        l = n + Ny;
        break;
      case gc:
        l = n + My;
        break;
      case gn:
      default:
        l = n + Py;
    }
  var i = {
    callback: e,
    priorityLevel: Ve,
    expirationTime: l,
    next: null,
    previous: null
  };
  if (L === null)
    L = i.next = i.previous = i, Sl();
  else {
    var o = null, a = L;
    do {
      if (a.expirationTime > l) {
        o = a;
        break;
      }
      a = a.next;
    } while (a !== L);
    o === null ? o = L : o === L && (L = i, Sl());
    var c = o.previous;
    c.next = o.previous = i, i.next = o, i.previous = c;
  }
  return i;
}
function $r(e) {
  var t = e.next;
  if (t !== null) {
    if (t === e)
      L = null;
    else {
      e === L && (L = t);
      var n = e.previous;
      n.next = t, t.previous = n;
    }
    e.next = e.previous = null;
  }
}
function Hy() {
  return Ve;
}
function $y() {
  return !yi && (L !== null && L.expirationTime < gi || nl());
}
var wy = Date, zy = typeof setTimeout == "function" ? setTimeout : void 0, Wy = typeof clearTimeout == "function" ? clearTimeout : void 0, wr = typeof requestAnimationFrame == "function" ? requestAnimationFrame : void 0, zr = typeof cancelAnimationFrame == "function" ? cancelAnimationFrame : void 0, me, By = 100, Ps, Ms, Zo = function(e) {
  Ps = wr(function(t) {
    Wy(Ms), e(t);
  }), Ms = zy(function() {
    zr(Ps), e(me());
  }, By);
};
if (Ly) {
  var Iy = performance;
  me = function() {
    return Iy.now();
  };
} else
  me = function() {
    return wy.now();
  };
var Gn, Ci, nl, ll = null;
typeof window < "u" ? ll = window : typeof global < "u" && (ll = global);
if (ll && ll._schedMock) {
  var Jl = ll._schedMock;
  Gn = Jl[0], Ci = Jl[1], nl = Jl[2], me = Jl[3];
} else if (
  // If Scheduler runs in a non-DOM environment, it falls back to a naive
  // implementation using setTimeout.
  typeof window > "u" || // Check if MessageChannel is supported, too.
  typeof MessageChannel != "function"
) {
  var jt = null, jy = function(e) {
    if (jt !== null)
      try {
        jt(e);
      } finally {
        jt = null;
      }
  };
  Gn = function(e, t) {
    jt !== null ? setTimeout(Gn, 0, e) : (jt = e, setTimeout(jy, 0, !1));
  }, Ci = function() {
    jt = null;
  }, nl = function() {
    return !1;
  };
} else {
  typeof console < "u" && (typeof wr != "function" && console.error(
    "This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"
  ), typeof zr != "function" && console.error(
    "This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"
  ));
  var Kt = null, ei = !1, jn = -1, Kn = !1, Jo = !1, ti = 0, ni = 33, Yn = 33;
  nl = function() {
    return ti <= me();
  };
  var Ns = new MessageChannel(), Ls = Ns.port2;
  Ns.port1.onmessage = function(e) {
    ei = !1;
    var t = Kt, n = jn;
    Kt = null, jn = -1;
    var l = me(), i = !1;
    if (ti - l <= 0)
      if (n !== -1 && n <= l)
        i = !0;
      else {
        Kn || (Kn = !0, Zo(ea)), Kt = t, jn = n;
        return;
      }
    if (t !== null) {
      Jo = !0;
      try {
        t(i);
      } finally {
        Jo = !1;
      }
    }
  };
  var ea = function(e) {
    if (Kt !== null)
      Zo(ea);
    else {
      Kn = !1;
      return;
    }
    var t = e - ti + Yn;
    t < Yn && ni < Yn ? (t < 8 && (t = 8), Yn = t < ni ? ni : t) : ni = t, ti = e + Yn, ei || (ei = !0, Ls.postMessage(void 0));
  };
  Gn = function(e, t) {
    Kt = e, jn = t, Jo || t < 0 ? Ls.postMessage(void 0) : Kn || (Kn = !0, Zo(ea));
  }, Ci = function() {
    Kt = null, ei = !1, jn = -1;
  };
}
const Ky = Object.assign, Wt = {
  ReactCurrentDispatcher: _r,
  ReactCurrentOwner: dc,
  // Used by renderers to avoid bundling object-assign twice in UMD bundles:
  assign: Ky
}, Wr = {
  map: _y,
  forEach: vy,
  count: Ry,
  toArray: Oy,
  only: Uy
}, Br = "16.8.6", bc = {
  Children: Wr,
  createRef: fr,
  Component: zt,
  PureComponent: bo,
  createContext: Er,
  forwardRef: vr,
  lazy: Sr,
  memo: xr,
  useCallback: Pr,
  useContext: Rr,
  useEffect: Dr,
  useImperativeHandle: Nr,
  useDebugValue: Lr,
  useLayoutEffect: kr,
  useMemo: Mr,
  useReducer: Ur,
  useRef: Ar,
  useState: Or,
  Fragment: Ue,
  StrictMode: Hl,
  Suspense: wl,
  createElement: hc,
  cloneElement: gr,
  createFactory: yr,
  isValidElement: Eo,
  version: Br,
  unstable_ConcurrentMode: $l,
  unstable_Profiler: mn,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Wt
}, OS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: Wr,
  Component: zt,
  Fragment: Ue,
  PureComponent: bo,
  StrictMode: Hl,
  Suspense: wl,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Wt,
  cloneElement: gr,
  createContext: Er,
  createElement: hc,
  createFactory: yr,
  createRef: fr,
  default: bc,
  forwardRef: vr,
  isValidElement: Eo,
  lazy: Sr,
  memo: xr,
  unstable_ConcurrentMode: $l,
  unstable_Profiler: mn,
  useCallback: Pr,
  useContext: Rr,
  useDebugValue: Lr,
  useEffect: Dr,
  useImperativeHandle: Nr,
  useLayoutEffect: kr,
  useMemo: Mr,
  useReducer: Ur,
  useRef: Ar,
  useState: Or,
  version: Br
}, Symbol.toStringTag, { value: "Module" }));
function il(e) {
  return e._reactInternalFiber;
}
function Yy(e, t) {
  e._reactInternalFiber = t;
}
const $e = 0, w = 1, So = 2, B = 3, W = 4, $ = 5, q = 6, Cn = 7, Ec = 8, vo = 9, yt = 10, ct = 11, Tn = 12, Le = 13, Bt = 14, It = 15, Sc = 16, Fn = 17, vc = 18, Te = (
  /*              */
  0
), bt = (
  /*         */
  1
), X = (
  /*             */
  2
), K = (
  /*                */
  4
), Qy = (
  /*    */
  6
), Fi = (
  /*              */
  8
), Hi = (
  /*          */
  16
), Ti = (
  /*              */
  32
), xe = (
  /*            */
  64
), xo = (
  /*                   */
  128
), ol = (
  /*              */
  256
), _o = (
  /*               */
  512
), Xy = (
  /*        */
  1023
), bi = (
  /*            */
  1024
), Be = (
  /*         */
  2048
);
Wt.ReactCurrentOwner;
const Fs = 1, xc = 2, qy = 3;
function Ir(e) {
  let t = e;
  if (e.alternate)
    for (; t.return; )
      t = t.return;
  else {
    if ((t.effectTag & X) !== Te)
      return Fs;
    for (; t.return; )
      if (t = t.return, (t.effectTag & X) !== Te)
        return Fs;
  }
  return t.tag === B ? xc : qy;
}
function jr(e) {
  return Ir(e) === xc;
}
function Vy(e) {
  const t = il(e);
  return t ? Ir(t) === xc : !1;
}
const Kr = Math.random().toString(36).slice(2), Xt = "__reactInternalInstance$" + Kr, Yr = "__reactEventHandlers$" + Kr;
function Qr(e, t) {
  t[Xt] = e;
}
function _c(e) {
  if (e[Xt])
    return e[Xt];
  for (; !e[Xt]; )
    if (e.parentNode)
      e = e.parentNode;
    else
      return null;
  let t = e[Xt];
  return t.tag === $ || t.tag === q ? t : null;
}
function Gy(e) {
  const t = e[Xt];
  return t && (t.tag === $ || t.tag === q) ? t : null;
}
function bn(e) {
  if (e.tag === $ || e.tag === q)
    return e.stateNode;
  O(!1, "getNodeFromInstance: Invalid argument.");
}
function Xr(e) {
  return e[Yr] || null;
}
function qr(e, t) {
  e[Yr] = t;
}
let $i = null;
const qt = {};
function Vr() {
  if ($i)
    for (const e in qt) {
      const t = qt[e], n = $i.indexOf(e);
      if (O(
        n > -1,
        "EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.",
        e
      ), wi[n])
        continue;
      O(
        t.extractEvents,
        "EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.",
        e
      ), wi[n] = t;
      const l = t.eventTypes;
      for (const i in l)
        O(
          Zy(
            l[i],
            t,
            i
          ),
          "EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.",
          i,
          e
        );
    }
}
function Zy(e, t, n) {
  O(
    !$s.hasOwnProperty(n),
    "EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.",
    n
  ), $s[n] = e;
  const l = e.phasedRegistrationNames;
  if (l) {
    for (const i in l)
      if (l.hasOwnProperty(i)) {
        const o = l[i];
        Hs(
          o,
          t,
          n
        );
      }
    return !0;
  } else if (e.registrationName)
    return Hs(
      e.registrationName,
      t,
      n
    ), !0;
  return !1;
}
function Hs(e, t, n) {
  O(
    !vl[e],
    "EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.",
    e
  ), vl[e] = t, Rc[e] = t.eventTypes[n].dependencies;
}
const wi = [], $s = {}, vl = {}, Rc = {};
function Jy(e) {
  O(
    !$i,
    "EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React."
  ), $i = Array.prototype.slice.call(e), Vr();
}
function eg(e) {
  let t = !1;
  for (const n in e) {
    if (!e.hasOwnProperty(n))
      continue;
    const l = e[n];
    (!qt.hasOwnProperty(n) || qt[n] !== l) && (O(
      !qt[n],
      "EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.",
      n
    ), qt[n] = l, t = !0);
  }
  t && Vr();
}
const Oc = 0, zl = 1, Uc = 2, En = 3, Ro = 4, Gr = 5, Zr = 6, Jr = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", tg = Jr + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", ng = "data-reactroot", lg = new RegExp(
  "^[" + Jr + "][" + tg + "]*$"
), ws = Object.prototype.hasOwnProperty, zs = {}, Ws = {};
function ig(e) {
  return ws.call(Ws, e) ? !0 : ws.call(zs, e) ? !1 : lg.test(e) ? (Ws[e] = !0, !0) : (zs[e] = !0, !1);
}
function og(e, t, n) {
  return t !== null ? t.type === Oc : n ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
}
function ag(e, t, n, l) {
  if (n !== null && n.type === Oc)
    return !1;
  switch (typeof t) {
    case "function":
    // $FlowIssue symbol is perfectly valid here
    case "symbol":
      return !0;
    case "boolean": {
      if (l)
        return !1;
      if (n !== null)
        return !n.acceptsBooleans;
      {
        const i = e.toLowerCase().slice(0, 5);
        return i !== "data-" && i !== "aria-";
      }
    }
    default:
      return !1;
  }
}
function cg(e, t, n, l) {
  if (t === null || typeof t > "u" || ag(
    e,
    t,
    n,
    l
  ))
    return !0;
  if (l)
    return !1;
  if (n !== null)
    switch (n.type) {
      case En:
        return !t;
      case Ro:
        return t === !1;
      case Gr:
        return isNaN(t);
      case Zr:
        return isNaN(t) || t < 1;
    }
  return !1;
}
function sg(e) {
  return ne.hasOwnProperty(e) ? ne[e] : null;
}
function re(e, t, n, l, i) {
  this.acceptsBooleans = t === Uc || t === En || t === Ro, this.attributeName = l, this.attributeNamespace = i, this.mustUseProperty = n, this.propertyName = e, this.type = t;
}
const ne = {};
[
  "children",
  "dangerouslySetInnerHTML",
  // TODO: This prevents the assignment of defaultValue to regular
  // elements (not just inputs). Now that ReactDOMInput assigns to the
  // defaultValue property -- do we need this?
  "defaultValue",
  "defaultChecked",
  "innerHTML",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
  "style"
].forEach((e) => {
  ne[e] = new re(
    e,
    Oc,
    !1,
    // mustUseProperty
    e,
    // attributeName
    null
    // attributeNamespace
  );
});
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"]
].forEach(([e, t]) => {
  ne[e] = new re(
    e,
    zl,
    !1,
    // mustUseProperty
    t,
    // attributeName
    null
    // attributeNamespace
  );
});
["contentEditable", "draggable", "spellCheck", "value"].forEach((e) => {
  ne[e] = new re(
    e,
    Uc,
    !1,
    // mustUseProperty
    e.toLowerCase(),
    // attributeName
    null
    // attributeNamespace
  );
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha"
].forEach((e) => {
  ne[e] = new re(
    e,
    Uc,
    !1,
    // mustUseProperty
    e,
    // attributeName
    null
    // attributeNamespace
  );
});
[
  "allowFullScreen",
  "async",
  // Note: there is a special case that prevents it from being written to the DOM
  // on the client side because the browsers are inconsistent. Instead we call focus().
  "autoFocus",
  "autoPlay",
  "controls",
  "default",
  "defer",
  "disabled",
  "formNoValidate",
  "hidden",
  "loop",
  "noModule",
  "noValidate",
  "open",
  "playsInline",
  "readOnly",
  "required",
  "reversed",
  "scoped",
  "seamless",
  // Microdata
  "itemScope"
].forEach((e) => {
  ne[e] = new re(
    e,
    En,
    !1,
    // mustUseProperty
    e.toLowerCase(),
    // attributeName
    null
    // attributeNamespace
  );
});
[
  "checked",
  // Note: `option.selected` is not updated if `select.multiple` is
  // disabled with `removeAttribute`. We have special logic for handling this.
  "multiple",
  "muted",
  "selected"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((e) => {
  ne[e] = new re(
    e,
    En,
    !0,
    // mustUseProperty
    e,
    // attributeName
    null
    // attributeNamespace
  );
});
[
  "capture",
  "download"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((e) => {
  ne[e] = new re(
    e,
    Ro,
    !1,
    // mustUseProperty
    e,
    // attributeName
    null
    // attributeNamespace
  );
});
[
  "cols",
  "rows",
  "size",
  "span"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((e) => {
  ne[e] = new re(
    e,
    Zr,
    !1,
    // mustUseProperty
    e,
    // attributeName
    null
    // attributeNamespace
  );
});
["rowSpan", "start"].forEach((e) => {
  ne[e] = new re(
    e,
    Gr,
    !1,
    // mustUseProperty
    e.toLowerCase(),
    // attributeName
    null
    // attributeNamespace
  );
});
const Ac = /[\-\:]([a-z])/g, Dc = (e) => e[1].toUpperCase();
[
  "accent-height",
  "alignment-baseline",
  "arabic-form",
  "baseline-shift",
  "cap-height",
  "clip-path",
  "clip-rule",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "dominant-baseline",
  "enable-background",
  "fill-opacity",
  "fill-rule",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "glyph-name",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "horiz-adv-x",
  "horiz-origin-x",
  "image-rendering",
  "letter-spacing",
  "lighting-color",
  "marker-end",
  "marker-mid",
  "marker-start",
  "overline-position",
  "overline-thickness",
  "paint-order",
  "panose-1",
  "pointer-events",
  "rendering-intent",
  "shape-rendering",
  "stop-color",
  "stop-opacity",
  "strikethrough-position",
  "strikethrough-thickness",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "text-anchor",
  "text-decoration",
  "text-rendering",
  "underline-position",
  "underline-thickness",
  "unicode-bidi",
  "unicode-range",
  "units-per-em",
  "v-alphabetic",
  "v-hanging",
  "v-ideographic",
  "v-mathematical",
  "vector-effect",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "word-spacing",
  "writing-mode",
  "xmlns:xlink",
  "x-height"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((e) => {
  const t = e.replace(Ac, Dc);
  ne[t] = new re(
    t,
    zl,
    !1,
    // mustUseProperty
    e,
    null
    // attributeNamespace
  );
});
[
  "xlink:actuate",
  "xlink:arcrole",
  "xlink:href",
  "xlink:role",
  "xlink:show",
  "xlink:title",
  "xlink:type"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((e) => {
  const t = e.replace(Ac, Dc);
  ne[t] = new re(
    t,
    zl,
    !1,
    // mustUseProperty
    e,
    "http://www.w3.org/1999/xlink"
  );
});
[
  "xml:base",
  "xml:lang",
  "xml:space"
  // NOTE: if you add a camelCased prop to this list,
  // you'll need to set attributeName to name.toLowerCase()
  // instead in the assignment below.
].forEach((e) => {
  const t = e.replace(Ac, Dc);
  ne[t] = new re(
    t,
    zl,
    !1,
    // mustUseProperty
    e,
    "http://www.w3.org/XML/1998/namespace"
  );
});
["tabIndex", "crossOrigin"].forEach((e) => {
  ne[e] = new re(
    e,
    zl,
    !1,
    // mustUseProperty
    e.toLowerCase(),
    // attributeName
    null
    // attributeNamespace
  );
});
function kc(e, t, n, l) {
  const i = sg(t);
  if (og(t, i, l))
    return;
  if (cg(t, n, i, l) && (n = null), l || i === null) {
    if (ig(t)) {
      const s = t;
      n === null ? e.removeAttribute(s) : e.setAttribute(s, "" + n);
    }
    return;
  }
  const { mustUseProperty: o } = i;
  if (o) {
    const { propertyName: s } = i;
    if (n === null) {
      const { type: r } = i;
      e[s] = r === En ? !1 : "";
    } else
      e[s] = n;
    return;
  }
  const { attributeName: a, attributeNamespace: c } = i;
  if (n === null)
    e.removeAttribute(a);
  else {
    const { type: s } = i;
    let r;
    s === En || s === Ro && n === !0 ? r = "" : r = "" + n, c ? e.setAttributeNS(c, a, r) : e.setAttribute(a, r);
  }
}
function ye(e) {
  return "" + e;
}
function gt(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "object":
    case "string":
    case "undefined":
      return e;
    default:
      return "";
  }
}
function ef(e) {
  const t = e.type, n = e.nodeName;
  return n && n.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function tf(e) {
  return e._valueTracker;
}
function ug(e) {
  e._valueTracker = null;
}
function rg(e) {
  let t = "";
  return e && (ef(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
}
function fg(e) {
  const t = ef(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(
    e.constructor.prototype,
    t
  );
  let l = "" + e[t];
  if (e.hasOwnProperty(t) || typeof n > "u" || typeof n.get != "function" || typeof n.set != "function")
    return;
  const { get: i, set: o } = n;
  return Object.defineProperty(e, t, {
    configurable: !0,
    get: function() {
      return i.call(this);
    },
    set: function(c) {
      l = "" + c, o.call(this, c);
    }
  }), Object.defineProperty(e, t, {
    enumerable: n.enumerable
  }), {
    getValue() {
      return l;
    },
    setValue(c) {
      l = "" + c;
    },
    stopTracking() {
      ug(e), delete e[t];
    }
  };
}
function Bs(e) {
  tf(e) || (e._valueTracker = fg(e));
}
function nf(e) {
  if (!e)
    return !1;
  const t = tf(e);
  if (!t)
    return !0;
  const n = t.getValue(), l = rg(e);
  return l !== n ? (t.setValue(l), !0) : !1;
}
function dg(e) {
  return e.type === "checkbox" || e.type === "radio" ? e.checked != null : e.value != null;
}
function ga(e, t) {
  const n = e, l = t.checked;
  return Object.assign({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: l ?? n._wrapperState.initialChecked
  });
}
function pg(e, t) {
  const n = e, l = t.defaultValue == null ? "" : t.defaultValue;
  n._wrapperState = {
    initialChecked: t.checked != null ? t.checked : t.defaultChecked,
    initialValue: gt(
      t.value != null ? t.value : l
    ),
    controlled: dg(t)
  };
}
function lf(e, t) {
  const n = e, l = t.checked;
  l != null && kc(n, "checked", l, !1);
}
function Pc(e, t) {
  const n = e;
  lf(e, t);
  const l = gt(t.value), i = t.type;
  if (l != null)
    i === "number" ? (l === 0 && n.value === "" || // We explicitly want to coerce to number here if possible.
    // eslint-disable-next-line
    n.value != l) && (n.value = ye(l)) : n.value !== ye(l) && (n.value = ye(l));
  else if (i === "submit" || i === "reset") {
    n.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? Ca(n, t.type, l) : t.hasOwnProperty("defaultValue") && Ca(n, t.type, gt(t.defaultValue)), t.checked == null && t.defaultChecked != null && (n.defaultChecked = !!t.defaultChecked);
}
function hg(e, t, n) {
  const l = e;
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    const o = t.type;
    if ((o === "submit" || o === "reset") && (t.value === void 0 || t.value === null))
      return;
    const c = ye(l._wrapperState.initialValue);
    c !== l.value && (l.value = c), l.defaultValue = c;
  }
  const i = l.name;
  i !== "" && (l.name = ""), l.defaultChecked = !l.defaultChecked, l.defaultChecked = !!l._wrapperState.initialChecked, i !== "" && (l.name = i);
}
function mg(e, t) {
  const n = e;
  Pc(n, t), yg(n, t);
}
function yg(e, t) {
  const n = t.name;
  if (t.type === "radio" && n != null) {
    let l = e;
    for (; l.parentNode; )
      l = l.parentNode;
    const i = l.querySelectorAll(
      "input[name=" + JSON.stringify("" + n) + '][type="radio"]'
    );
    for (let o = 0; o < i.length; o++) {
      const a = i[o];
      if (a === e || a.form !== e.form)
        continue;
      const c = Xr(a);
      O(
        c,
        "ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported."
      ), nf(a), Pc(a, c);
    }
  }
}
function Ca(e, t, n) {
  // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
  (t !== "number" || e.ownerDocument.activeElement !== e) && (n == null ? e.defaultValue = ye(e._wrapperState.initialValue) : e.defaultValue !== ye(n) && (e.defaultValue = ye(n)));
}
function gg(e) {
  let t = "";
  return bc.Children.forEach(e, function(n) {
    n != null && (t += n);
  }), t;
}
function Cg(e, t) {
  t.value != null && e.setAttribute("value", ye(gt(t.value)));
}
function Ta(e, t) {
  const n = { children: void 0, ...t }, l = gg(t.children);
  return l && (n.children = l), n;
}
function ln(e, t, n, l) {
  const i = e.options;
  if (t) {
    let o = n, a = {};
    for (let c = 0; c < o.length; c++)
      a["$" + o[c]] = !0;
    for (let c = 0; c < i.length; c++) {
      const s = a.hasOwnProperty("$" + i[c].value);
      i[c].selected !== s && (i[c].selected = s), s && l && (i[c].defaultSelected = !0);
    }
  } else {
    let o = ye(gt(n)), a = null;
    for (let c = 0; c < i.length; c++) {
      if (i[c].value === o) {
        i[c].selected = !0, l && (i[c].defaultSelected = !0);
        return;
      }
      a === null && !i[c].disabled && (a = i[c]);
    }
    a !== null && (a.selected = !0);
  }
}
function ba(e, t) {
  return Object.assign({}, t, {
    value: void 0
  });
}
function Tg(e, t) {
  const n = e;
  n._wrapperState = {
    wasMultiple: !!t.multiple
  };
}
function bg(e, t) {
  const n = e;
  n.multiple = !!t.multiple;
  const l = t.value;
  l != null ? ln(n, !!t.multiple, l, !1) : t.defaultValue != null && ln(n, !!t.multiple, t.defaultValue, !0);
}
function Eg(e, t) {
  const n = e, l = n._wrapperState.wasMultiple !== !!t.multiple;
  n._wrapperState.wasMultiple = !!t.multiple;
  const i = t.value;
  i != null ? ln(n, !!t.multiple, i, !1) : l !== !!t.multiple && (t.defaultValue != null ? ln(n, !!t.multiple, t.defaultValue, !0) : ln(n, !!t.multiple, t.multiple ? [] : "", !1));
}
function Sg(e, t) {
  const n = e, l = t.value;
  l != null && ln(n, !!t.multiple, l, !1);
}
function Ea(e, t) {
  const n = e;
  return O(
    t.dangerouslySetInnerHTML == null,
    "`dangerouslySetInnerHTML` does not make sense on <textarea>."
  ), {
    ...t,
    value: void 0,
    defaultValue: void 0,
    children: ye(n._wrapperState.initialValue)
  };
}
function vg(e, t) {
  const n = e;
  let l = t.value;
  if (l == null) {
    let i = t.defaultValue, o = t.children;
    o != null && (O(
      i == null,
      "If you supply `defaultValue` on a <textarea>, do not pass children."
    ), Array.isArray(o) && (O(
      o.length <= 1,
      "<textarea> can only have at most one child."
    ), o = o[0]), i = o), i == null && (i = ""), l = i;
  }
  n._wrapperState = {
    initialValue: gt(l)
  };
}
function of(e, t) {
  const n = e, l = gt(t.value), i = gt(t.defaultValue);
  if (l != null) {
    const o = ye(l);
    o !== n.value && (n.value = o), t.defaultValue == null && n.defaultValue !== o && (n.defaultValue = o);
  }
  i != null && (n.defaultValue = ye(i));
}
function xg(e, t) {
  const n = e, l = n.textContent;
  l === n._wrapperState.initialValue && (n.value = l);
}
function _g(e, t) {
  of(e, t);
}
const zi = "http://www.w3.org/1999/xhtml", Rg = "http://www.w3.org/1998/Math/MathML", Mc = "http://www.w3.org/2000/svg", af = {
  html: zi,
  svg: Mc
};
function cf(e) {
  switch (e) {
    case "svg":
      return Mc;
    case "math":
      return Rg;
    default:
      return zi;
  }
}
function Sa(e, t) {
  return e == null || e === zi ? cf(t) : e === Mc && t === "foreignObject" ? zi : e;
}
const Og = function(e) {
  return e;
};
let li;
const sf = Og(function(e, t) {
  if (e.namespaceURI === af.svg && !("innerHTML" in e)) {
    li = li || document.createElement("div"), li.innerHTML = "<svg>" + t + "</svg>";
    const n = li.firstChild;
    for (; e.firstChild; )
      e.removeChild(e.firstChild);
    for (; n.firstChild; )
      e.appendChild(n.firstChild);
  } else
    e.innerHTML = t;
}), uf = 1, At = 3, Oo = 8, Sn = 9, rf = 11;
let Wi = function(e, t) {
  if (t) {
    let n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === At) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
};
const Et = !!(typeof window < "u" && window.document && window.document.createElement);
function ii(e, t) {
  const n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
const Vt = {
  animationend: ii("Animation", "AnimationEnd"),
  animationiteration: ii("Animation", "AnimationIteration"),
  animationstart: ii("Animation", "AnimationStart"),
  transitionend: ii("Transition", "TransitionEnd")
}, ta = {};
let ff = {};
Et && (ff = document.createElement("div").style, "AnimationEvent" in window || (delete Vt.animationend.animation, delete Vt.animationiteration.animation, delete Vt.animationstart.animation), "TransitionEvent" in window || delete Vt.transitionend.transition);
function Uo(e) {
  if (ta[e])
    return ta[e];
  if (!Vt[e])
    return e;
  const t = Vt[e];
  for (const n in t)
    if (t.hasOwnProperty(n) && n in ff)
      return ta[e] = t[n];
  return e;
}
const df = "abort", pf = Uo("animationend"), hf = Uo("animationiteration"), mf = Uo("animationstart"), oe = "blur", yf = "canplay", gf = "canplaythrough", Cf = "cancel", Nc = "change", Ao = "click", Tf = "close", vn = "compositionend", bf = "compositionstart", Ef = "compositionupdate", Do = "contextmenu", Sf = "copy", vf = "cut", xf = "dblclick", _f = "auxclick", Rf = "drag", ko = "dragend", Of = "dragenter", Uf = "dragexit", Af = "dragleave", Df = "dragover", kf = "dragstart", Pf = "drop", Mf = "durationchange", Nf = "emptied", Lf = "encrypted", Ff = "ended", Bi = "error", Ge = "focus", Hf = "gotpointercapture", Lc = "input", al = "invalid", _e = "keydown", Ke = "keypress", Ne = "keyup", va = "load", $f = "loadstart", wf = "loadeddata", zf = "loadedmetadata", Wf = "lostpointercapture", ft = "mousedown", Bf = "mousemove", xn = "mouseout", _n = "mouseover", Po = "mouseup", Mo = "paste", If = "pause", jf = "play", Kf = "playing", Yf = "pointercancel", Qf = "pointerdown", Xf = "pointermove", Rn = "pointerout", On = "pointerover", qf = "pointerup", Vf = "progress", Gf = "ratechange", Fc = "reset", Ii = "scroll", Zf = "seeked", Jf = "seeking", No = "selectionchange", ed = "stalled", Hc = "submit", td = "suspend", nd = "textInput", ld = "timeupdate", id = "toggle", od = "touchcancel", ad = "touchend", cd = "touchmove", sd = "touchstart", ud = Uo("transitionend"), rd = "volumechange", fd = "waiting", dd = "wheel", xa = [
  df,
  yf,
  gf,
  Mf,
  Nf,
  Lf,
  Ff,
  Bi,
  wf,
  zf,
  $f,
  If,
  jf,
  Kf,
  Vf,
  Gf,
  Zf,
  Jf,
  ed,
  td,
  ld,
  rd,
  fd
];
function $c(e) {
  return e;
}
let Ug = function(e, t, n, l, i, o, a, c, s) {
  const r = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, r);
  } catch (u) {
    this.onError(u);
  }
}, xl = !1, ji = null, Ki = !1, _a = null;
const Ag = {
  onError(e) {
    xl = !0, ji = e;
  }
};
function Dg(e, t, n, l, i, o, a, c, s) {
  xl = !1, ji = null, Ug.apply(Ag, arguments);
}
function kg(e, t, n, l, i, o, a, c, s) {
  if (Dg.apply(this, arguments), xl) {
    const r = Mg();
    Ki || (Ki = !0, _a = r);
  }
}
function Pg() {
  if (Ki) {
    const e = _a;
    throw Ki = !1, _a = null, e;
  }
}
function Mg() {
  if (xl) {
    const e = ji;
    return xl = !1, ji = null, e;
  } else
    O(
      !1,
      "clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue."
    );
}
let wc = null, pd = null, hd = null;
function Ng(e, t, n) {
  wc = e, pd = t, hd = n;
}
function Is(e, t, n) {
  const l = e.type || "unknown-event";
  e.currentTarget = hd(n), kg(l, t, void 0, e), e.currentTarget = null;
}
function Lg(e) {
  const t = e._dispatchListeners, n = e._dispatchInstances;
  if (Array.isArray(t))
    for (let l = 0; l < t.length && !e.isPropagationStopped(); l++)
      Is(e, t[l], n[l]);
  else t && Is(e, t, n);
  e._dispatchListeners = null, e._dispatchInstances = null;
}
let Ra = null, on = null, an = null;
function js(e) {
  const t = pd(e);
  if (!t)
    return;
  O(
    typeof Ra == "function",
    "setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue."
  );
  const n = wc(t.stateNode);
  Ra(t.stateNode, t.type, n);
}
function Fg(e) {
  Ra = e;
}
function Hg(e) {
  on ? an ? an.push(e) : an = [e] : on = e;
}
function $g() {
  return on !== null || an !== null;
}
function wg() {
  if (!on)
    return;
  const e = on, t = an;
  if (on = null, an = null, js(e), t)
    for (let n = 0; n < t.length; n++)
      js(t[n]);
}
let md = function(e, t) {
  return e(t);
}, yd = function(e, t, n) {
  return e(t, n);
}, gd = function() {
}, na = !1;
function Cd(e, t) {
  if (na)
    return e(t);
  na = !0;
  try {
    return md(e, t);
  } finally {
    na = !1, $g() && (gd(), wg());
  }
}
function zg(e, t, n) {
  return yd(e, t, n);
}
function Wg(e, t, n) {
  md = e, yd = t, gd = n;
}
function Un(e, t) {
  return O(
    t != null,
    "accumulateInto(...): Accumulated items must not be null or undefined."
  ), e == null ? t : Array.isArray(e) ? Array.isArray(t) ? (e.push.apply(e, t), e) : (e.push(t), e) : Array.isArray(t) ? [e].concat(t) : [e, t];
}
function Td(e, t, n) {
  Array.isArray(e) ? e.forEach(t, n) : e && t.call(n, e);
}
let Qn = null;
const Bg = function(e) {
  e && (Lg(e), e.isPersistent() || e.constructor.release(e));
}, Ig = function(e) {
  return Bg(e);
};
function jg(e) {
  return e === "button" || e === "input" || e === "select" || e === "textarea";
}
function Kg(e, t, n) {
  switch (e) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
      return !!(n.disabled && jg(t));
    default:
      return !1;
  }
}
const bd = {
  /**
   * @param {array} InjectedEventPluginOrder
   * @public
   */
  injectEventPluginOrder: Jy,
  /**
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   */
  injectEventPluginsByName: eg
};
function Ed(e, t) {
  let n;
  const l = e.stateNode;
  if (!l)
    return null;
  const i = wc(l);
  return !i || (n = i[t], Kg(t, e.type, i)) ? null : (O(
    !n || typeof n == "function",
    "Expected `%s` listener to be a function, instead got a value of `%s` type.",
    t,
    typeof n
  ), n);
}
function Yg(e, t, n, l) {
  let i = null;
  for (let o = 0; o < wi.length; o++) {
    const a = wi[o];
    if (a) {
      const c = a.extractEvents(
        e,
        t,
        n,
        l
      );
      c && (i = Un(i, c));
    }
  }
  return i;
}
function Sd(e) {
  e !== null && (Qn = Un(Qn, e));
  const t = Qn;
  Qn = null, t && (Td(t, Ig), O(
    !Qn,
    "processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented."
  ), Pg());
}
function Qg(e, t, n, l) {
  const i = Yg(
    e,
    t,
    n,
    l
  );
  Sd(i);
}
function Xg(e, t, n) {
  e.addEventListener(t, n, !1);
}
function qg(e, t, n) {
  e.addEventListener(t, n, !0);
}
function zc(e) {
  let t = e.target || e.srcElement || window;
  return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === At ? t.parentNode : t;
}
function We(e) {
  do
    e = e.return;
  while (e && e.tag !== $);
  return e || null;
}
function Vg(e, t) {
  let n = 0;
  for (let o = e; o; o = We(o))
    n++;
  let l = 0;
  for (let o = t; o; o = We(o))
    l++;
  for (; n - l > 0; )
    e = We(e), n--;
  for (; l - n > 0; )
    t = We(t), l--;
  let i = n;
  for (; i--; ) {
    if (e === t || e === t.alternate)
      return e;
    e = We(e), t = We(t);
  }
  return null;
}
function Gg(e, t, n) {
  const l = [];
  for (; e; )
    l.push(e), e = We(e);
  let i;
  for (i = l.length; i-- > 0; )
    t(l[i], "captured", n);
  for (i = 0; i < l.length; i++)
    t(l[i], "bubbled", n);
}
function Zg(e, t, n, l, i) {
  const o = e && t ? Vg(e, t) : null, a = [];
  for (; !(!e || e === o); ) {
    const s = e.alternate;
    if (s !== null && s === o)
      break;
    a.push(e), e = We(e);
  }
  const c = [];
  for (; !(!t || t === o); ) {
    const s = t.alternate;
    if (s !== null && s === o)
      break;
    c.push(t), t = We(t);
  }
  for (let s = 0; s < a.length; s++)
    n(a[s], "bubbled", l);
  for (let s = c.length; s-- > 0; )
    n(c[s], "captured", i);
}
function Jg(e, t, n) {
  const l = t.dispatchConfig.phasedRegistrationNames[n];
  return Ed(e, l);
}
function eC(e, t, n) {
  const l = Jg(e, n, t);
  l && (n._dispatchListeners = Un(
    n._dispatchListeners,
    l
  ), n._dispatchInstances = Un(n._dispatchInstances, e));
}
function tC(e) {
  e && e.dispatchConfig.phasedRegistrationNames && Gg(e._targetInst, eC, e);
}
function nC(e, t, n) {
  if (e && n && n.dispatchConfig.registrationName) {
    const l = n.dispatchConfig.registrationName, i = Ed(e, l);
    i && (n._dispatchListeners = Un(
      n._dispatchListeners,
      i
    ), n._dispatchInstances = Un(n._dispatchInstances, e));
  }
}
function Wl(e) {
  Td(e, tC);
}
function lC(e, t, n, l) {
  Zg(n, l, nC, e, t);
}
const iC = 10, oC = {
  type: null,
  target: null,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: function() {
    return null;
  },
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function(e) {
    return e.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};
function Ei() {
  return !0;
}
function cl() {
  return !1;
}
function fe(e, t, n, l) {
  this.dispatchConfig = e, this._targetInst = t, this.nativeEvent = n;
  const i = this.constructor.Interface;
  for (const a in i) {
    if (!i.hasOwnProperty(a))
      continue;
    const c = i[a];
    c ? this[a] = c(n) : a === "target" ? this.target = l : this[a] = n[a];
  }
  return (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? this.isDefaultPrevented = Ei : this.isDefaultPrevented = cl, this.isPropagationStopped = cl, this;
}
Object.assign(fe.prototype, {
  preventDefault: function() {
    this.defaultPrevented = !0;
    const e = this.nativeEvent;
    e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Ei);
  },
  stopPropagation: function() {
    const e = this.nativeEvent;
    e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Ei);
  },
  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function() {
    this.isPersistent = Ei;
  },
  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: cl,
  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function() {
    const e = this.constructor.Interface;
    for (const t in e)
      this[t] = null;
    this.dispatchConfig = null, this._targetInst = null, this.nativeEvent = null, this.isDefaultPrevented = cl, this.isPropagationStopped = cl, this._dispatchListeners = null, this._dispatchInstances = null;
  }
});
fe.Interface = oC;
fe.extend = function(e) {
  const t = this, n = function() {
  };
  n.prototype = t.prototype;
  const l = new n();
  function i() {
    return t.apply(this, arguments);
  }
  return Object.assign(l, i.prototype), i.prototype = l, i.prototype.constructor = i, i.Interface = Object.assign({}, t.Interface, e), i.extend = t.extend, vd(i), i;
};
vd(fe);
function aC(e, t, n, l) {
  const i = this;
  if (i.eventPool.length) {
    const o = i.eventPool.pop();
    return i.call(
      o,
      e,
      t,
      n,
      l
    ), o;
  }
  return new i(
    e,
    t,
    n,
    l
  );
}
function cC(e) {
  const t = this;
  O(
    e instanceof t,
    "Trying to release an event instance into a pool of a different type."
  ), e.destructor(), t.eventPool.length < iC && t.eventPool.push(e);
}
function vd(e) {
  e.eventPool = [], e.getPooled = aC, e.release = cC;
}
const sC = fe.extend({
  animationName: null,
  elapsedTime: null,
  pseudoElement: null
}), uC = fe.extend({
  clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  }
}), Bl = fe.extend({
  view: null,
  detail: null
}), rC = Bl.extend({
  relatedTarget: null
});
function Yi(e) {
  let t;
  const n = e.keyCode;
  return "charCode" in e ? (t = e.charCode, t === 0 && n === 13 && (t = 13)) : t = n, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
}
const fC = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, dC = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
};
function pC(e) {
  if (e.key) {
    const t = fC[e.key] || e.key;
    if (t !== "Unidentified")
      return t;
  }
  if (e.type === "keypress") {
    const t = Yi(e);
    return t === 13 ? "Enter" : String.fromCharCode(t);
  }
  return e.type === "keydown" || e.type === "keyup" ? dC[e.keyCode] || "Unidentified" : "";
}
const hC = {
  Alt: "altKey",
  Control: "ctrlKey",
  Meta: "metaKey",
  Shift: "shiftKey"
};
function mC(e) {
  const n = this.nativeEvent;
  if (n.getModifierState)
    return n.getModifierState(e);
  const l = hC[e];
  return l ? !!n[l] : !1;
}
function Wc(e) {
  return mC;
}
const yC = Bl.extend({
  key: pC,
  location: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  repeat: null,
  locale: null,
  getModifierState: Wc,
  // Legacy Interface
  charCode: function(e) {
    return e.type === "keypress" ? Yi(e) : 0;
  },
  keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  },
  which: function(e) {
    return e.type === "keypress" ? Yi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }
});
let Ks = 0, Ys = 0, Qs = !1, Xs = !1;
const Il = Bl.extend({
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  pageX: null,
  pageY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  getModifierState: Wc,
  button: null,
  buttons: null,
  relatedTarget: function(e) {
    return e.relatedTarget || (e.fromElement === e.srcElement ? e.toElement : e.fromElement);
  },
  movementX: function(e) {
    if ("movementX" in e)
      return e.movementX;
    const t = Ks;
    return Ks = e.screenX, Qs ? e.type === "mousemove" ? e.screenX - t : 0 : (Qs = !0, 0);
  },
  movementY: function(e) {
    if ("movementY" in e)
      return e.movementY;
    const t = Ys;
    return Ys = e.screenY, Xs ? e.type === "mousemove" ? e.screenY - t : 0 : (Xs = !0, 0);
  }
}), xd = Il.extend({
  pointerId: null,
  width: null,
  height: null,
  pressure: null,
  tangentialPressure: null,
  tiltX: null,
  tiltY: null,
  twist: null,
  pointerType: null,
  isPrimary: null
}), gC = Il.extend({
  dataTransfer: null
}), CC = Bl.extend({
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null,
  getModifierState: Wc
}), TC = fe.extend({
  propertyName: null,
  elapsedTime: null,
  pseudoElement: null
}), bC = Il.extend({
  deltaX(e) {
    return "deltaX" in e ? e.deltaX : (
      // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
      "wheelDeltaX" in e ? -e.wheelDeltaX : 0
    );
  },
  deltaY(e) {
    return "deltaY" in e ? e.deltaY : (
      // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
      "wheelDeltaY" in e ? -e.wheelDeltaY : (
        // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
        "wheelDelta" in e ? -e.wheelDelta : 0
      )
    );
  },
  deltaZ: null,
  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: null
}), EC = [
  [oe, "blur"],
  [Cf, "cancel"],
  [Ao, "click"],
  [Tf, "close"],
  [Do, "contextMenu"],
  [Sf, "copy"],
  [vf, "cut"],
  [_f, "auxClick"],
  [xf, "doubleClick"],
  [ko, "dragEnd"],
  [kf, "dragStart"],
  [Pf, "drop"],
  [Ge, "focus"],
  [Lc, "input"],
  [al, "invalid"],
  [_e, "keyDown"],
  [Ke, "keyPress"],
  [Ne, "keyUp"],
  [ft, "mouseDown"],
  [Po, "mouseUp"],
  [Mo, "paste"],
  [If, "pause"],
  [jf, "play"],
  [Yf, "pointerCancel"],
  [Qf, "pointerDown"],
  [qf, "pointerUp"],
  [Gf, "rateChange"],
  [Fc, "reset"],
  [Zf, "seeked"],
  [Hc, "submit"],
  [od, "touchCancel"],
  [ad, "touchEnd"],
  [sd, "touchStart"],
  [rd, "volumeChange"]
], SC = [
  [df, "abort"],
  [pf, "animationEnd"],
  [hf, "animationIteration"],
  [mf, "animationStart"],
  [yf, "canPlay"],
  [gf, "canPlayThrough"],
  [Rf, "drag"],
  [Of, "dragEnter"],
  [Uf, "dragExit"],
  [Af, "dragLeave"],
  [Df, "dragOver"],
  [Mf, "durationChange"],
  [Nf, "emptied"],
  [Lf, "encrypted"],
  [Ff, "ended"],
  [Bi, "error"],
  [Hf, "gotPointerCapture"],
  [va, "load"],
  [wf, "loadedData"],
  [zf, "loadedMetadata"],
  [$f, "loadStart"],
  [Wf, "lostPointerCapture"],
  [Bf, "mouseMove"],
  [xn, "mouseOut"],
  [_n, "mouseOver"],
  [Kf, "playing"],
  [Xf, "pointerMove"],
  [Rn, "pointerOut"],
  [On, "pointerOver"],
  [Vf, "progress"],
  [Ii, "scroll"],
  [Jf, "seeking"],
  [ed, "stalled"],
  [td, "suspend"],
  [ld, "timeUpdate"],
  [id, "toggle"],
  [cd, "touchMove"],
  [ud, "transitionEnd"],
  [fd, "waiting"],
  [dd, "wheel"]
], _d = {}, Oa = {};
function Rd([e, t], n) {
  const i = "on" + (t[0].toUpperCase() + t.slice(1)), o = {
    phasedRegistrationNames: {
      bubbled: i,
      captured: i + "Capture"
    },
    dependencies: [e],
    isInteractive: n
  };
  _d[t] = o, Oa[e] = o;
}
EC.forEach((e) => {
  Rd(e, !0);
});
SC.forEach((e) => {
  Rd(e, !1);
});
const Od = {
  eventTypes: _d,
  isInteractiveTopLevelEventType(e) {
    const t = Oa[e];
    return t !== void 0 && t.isInteractive === !0;
  },
  extractEvents: function(e, t, n, l) {
    const i = Oa[e];
    if (!i)
      return null;
    let o;
    switch (e) {
      case Ke:
        if (Yi(n) === 0)
          return null;
      /* falls through */
      case _e:
      case Ne:
        o = yC;
        break;
      case oe:
      case Ge:
        o = rC;
        break;
      case Ao:
        if (n.button === 2)
          return null;
      /* falls through */
      case _f:
      case xf:
      case ft:
      case Bf:
      case Po:
      // TODO: Disabled elements should not respond to mouse events
      /* falls through */
      case xn:
      case _n:
      case Do:
        o = Il;
        break;
      case Rf:
      case ko:
      case Of:
      case Uf:
      case Af:
      case Df:
      case kf:
      case Pf:
        o = gC;
        break;
      case od:
      case ad:
      case cd:
      case sd:
        o = CC;
        break;
      case pf:
      case hf:
      case mf:
        o = sC;
        break;
      case ud:
        o = TC;
        break;
      case Ii:
        o = Bl;
        break;
      case dd:
        o = bC;
        break;
      case Sf:
      case vf:
      case Mo:
        o = uC;
        break;
      case Hf:
      case Wf:
      case Yf:
      case Qf:
      case Xf:
      case Rn:
      case On:
      case qf:
        o = xd;
        break;
      default:
        o = fe;
        break;
    }
    const a = o.getPooled(
      i,
      t,
      n,
      l
    );
    return Wl(a), a;
  }
}, { isInteractiveTopLevelEventType: Ud } = Od, vC = 10, Qi = [];
function xC(e) {
  for (; e.return; )
    e = e.return;
  return e.tag !== B ? null : e.stateNode.containerInfo;
}
function _C(e, t, n) {
  if (Qi.length) {
    const l = Qi.pop();
    return l.topLevelType = e, l.nativeEvent = t, l.targetInst = n, l;
  }
  return {
    topLevelType: e,
    nativeEvent: t,
    targetInst: n,
    ancestors: []
  };
}
function RC(e) {
  e.topLevelType = null, e.nativeEvent = null, e.targetInst = null, e.ancestors.length = 0, Qi.length < vC && Qi.push(e);
}
function OC(e) {
  let t = e.targetInst, n = t;
  do {
    if (!n) {
      e.ancestors.push(n);
      break;
    }
    const l = xC(n);
    if (!l)
      break;
    e.ancestors.push(n), n = _c(l);
  } while (n);
  for (let l = 0; l < e.ancestors.length; l++)
    t = e.ancestors[l], Qg(
      e.topLevelType,
      t,
      e.nativeEvent,
      zc(e.nativeEvent)
    );
}
let Bc = !0;
function Ad(e) {
  Bc = !!e;
}
function UC() {
  return Bc;
}
function de(e, t) {
  if (!t)
    return null;
  const n = Ud(e) ? Dd : Ic;
  Xg(
    t,
    $c(e),
    // Check if interactive and wrap in interactiveUpdates
    n.bind(null, e)
  );
}
function oi(e, t) {
  if (!t)
    return null;
  const n = Ud(e) ? Dd : Ic;
  qg(
    t,
    $c(e),
    // Check if interactive and wrap in interactiveUpdates
    n.bind(null, e)
  );
}
function Dd(e, t) {
  zg(Ic, e, t);
}
function Ic(e, t) {
  if (!Bc)
    return;
  const n = zc(t);
  let l = _c(n);
  l !== null && typeof l.tag == "number" && !jr(l) && (l = null);
  const i = _C(
    e,
    t,
    l
  );
  try {
    Cd(OC, i);
  } finally {
    RC(i);
  }
}
function kd(e) {
  if (!Et)
    return !1;
  const t = "on" + e;
  let n = t in document;
  if (!n) {
    const l = document.createElement("div");
    l.setAttribute(t, "return;"), n = typeof l[t] == "function";
  }
  return n;
}
const qs = {};
let AC = 0;
const ai = "_reactListenersID" + ("" + Math.random()).slice(2);
function Pd(e) {
  return Object.prototype.hasOwnProperty.call(e, ai) || (e[ai] = AC++, qs[e[ai]] = {}), qs[e[ai]];
}
function DC(e, t) {
  const n = Pd(t), l = Rc[e];
  for (let i = 0; i < l.length; i++) {
    const o = l[i];
    if (!(n.hasOwnProperty(o) && n[o])) {
      switch (o) {
        case Ii:
          oi(Ii, t);
          break;
        case Ge:
        case oe:
          oi(Ge, t), oi(oe, t), n[oe] = !0, n[Ge] = !0;
          break;
        case Cf:
        case Tf:
          kd($c(o)) && oi(o, t);
          break;
        case al:
        case Hc:
        case Fc:
          break;
        default:
          xa.indexOf(o) !== -1 || de(o, t);
          break;
      }
      n[o] = !0;
    }
  }
}
function kC(e, t) {
  const n = Pd(t), l = Rc[e];
  for (let i = 0; i < l.length; i++) {
    const o = l[i];
    if (!(n.hasOwnProperty(o) && n[o]))
      return !1;
  }
  return !0;
}
const sl = {
  animationIterationCount: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  // SVG-related properties
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
};
function PC(e, t) {
  return e + t.charAt(0).toUpperCase() + t.substring(1);
}
const MC = ["Webkit", "ms", "Moz", "O"];
Object.keys(sl).forEach(function(e) {
  MC.forEach(function(t) {
    sl[PC(t, e)] = sl[e];
  });
});
function Md(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : !n && typeof t == "number" && t !== 0 && !(sl.hasOwnProperty(e) && sl[e]) ? t + "px" : ("" + t).trim();
}
function Nd(e, t) {
  const n = e.style;
  for (let l in t) {
    if (!t.hasOwnProperty(l))
      continue;
    const i = l.indexOf("--") === 0, o = Md(
      l,
      t[l],
      i
    );
    l === "float" && (l = "cssFloat"), i ? n.setProperty(l, o) : n[l] = o;
  }
}
function Ua(e, t) {
  if (e.indexOf("-") === -1)
    return typeof t.is == "string";
  switch (e) {
    // These are reserved SVG and MathML elements.
    // We don't mind this whitelist too much because we expect it to never grow.
    // The alternative is to track the namespace in a few places which is convoluted.
    // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
const Xi = "dangerouslySetInnerHTML", Aa = "suppressContentEditableWarning", Da = "suppressHydrationWarning", Ld = "autoFocus", qi = "children", ul = "style", ka = "__html", { html: Vs } = af;
function rl(e, t) {
  const l = e.nodeType === Sn || e.nodeType === rf ? e : e.ownerDocument;
  DC(t, l);
}
function Fd(e) {
  return e.nodeType === Sn ? e : e.ownerDocument;
}
function NC() {
}
function Hd(e) {
  e.onclick = NC;
}
function LC(e, t, n, l, i) {
  for (const o in l) {
    if (!l.hasOwnProperty(o))
      continue;
    const a = l[o];
    if (o === ul)
      Nd(t, a);
    else if (o === Xi) {
      const c = a ? a[ka] : void 0;
      c != null && sf(t, c);
    } else o === qi ? typeof a == "string" ? (e !== "textarea" || a !== "") && Wi(t, a) : typeof a == "number" && Wi(t, "" + a) : o === Aa || o === Da || o === Ld || (vl.hasOwnProperty(o) ? a != null && rl(n, o) : a != null && kc(t, o, a, i));
  }
}
function FC(e, t, n, l) {
  for (let i = 0; i < t.length; i += 2) {
    const o = t[i], a = t[i + 1];
    o === ul ? Nd(e, a) : o === Xi ? sf(e, a) : o === qi ? Wi(e, a) : kc(e, o, a, l);
  }
}
function HC(e, t, n, l) {
  const i = Fd(
    n
  );
  let o, a = l;
  if (a === Vs && (a = cf(e)), a === Vs) {
    if (e === "script") {
      const c = i.createElement("div");
      c.innerHTML = "<script><\/script>";
      const s = c.firstChild;
      o = c.removeChild(s);
    } else if (typeof t.is == "string")
      o = i.createElement(e, { is: t.is });
    else if (o = i.createElement(e), e === "select") {
      const c = o;
      t.multiple ? c.multiple = !0 : t.size && (c.size = t.size);
    }
  } else
    o = i.createElementNS(a, e);
  return o;
}
function $C(e, t) {
  return Fd(t).createTextNode(
    e
  );
}
function wC(e, t, n, l) {
  const i = Ua(t, n);
  let o;
  switch (t) {
    case "iframe":
    case "object":
      de(va, e), o = n;
      break;
    case "video":
    case "audio":
      for (let a = 0; a < xa.length; a++)
        de(xa[a], e);
      o = n;
      break;
    case "source":
      de(Bi, e), o = n;
      break;
    case "img":
    case "image":
    case "link":
      de(Bi, e), de(va, e), o = n;
      break;
    case "form":
      de(Fc, e), de(Hc, e), o = n;
      break;
    case "details":
      de(id, e), o = n;
      break;
    case "input":
      pg(e, n), o = ga(e, n), de(al, e), rl(l, "onChange");
      break;
    case "option":
      o = Ta(e, n);
      break;
    case "select":
      Tg(e, n), o = ba(e, n), de(al, e), rl(l, "onChange");
      break;
    case "textarea":
      vg(e, n), o = Ea(e, n), de(al, e), rl(l, "onChange");
      break;
    default:
      o = n;
  }
  switch (LC(
    t,
    e,
    l,
    o,
    i
  ), t) {
    case "input":
      Bs(e), hg(e, n);
      break;
    case "textarea":
      Bs(e), xg(e);
      break;
    case "option":
      Cg(e, n);
      break;
    case "select":
      bg(e, n);
      break;
    default:
      typeof o.onClick == "function" && Hd(e);
      break;
  }
}
function zC(e, t, n, l, i) {
  let o = null, a, c;
  switch (t) {
    case "input":
      a = ga(e, n), c = ga(e, l), o = [];
      break;
    case "option":
      a = Ta(e, n), c = Ta(e, l), o = [];
      break;
    case "select":
      a = ba(e, n), c = ba(e, l), o = [];
      break;
    case "textarea":
      a = Ea(e, n), c = Ea(e, l), o = [];
      break;
    default:
      a = n, c = l, typeof a.onClick != "function" && typeof c.onClick == "function" && Hd(e);
      break;
  }
  let s, r, u = null;
  for (s in a)
    if (!(c.hasOwnProperty(s) || !a.hasOwnProperty(s) || a[s] == null))
      if (s === ul) {
        const f = a[s];
        for (r in f)
          f.hasOwnProperty(r) && (u || (u = {}), u[r] = "");
      } else s === Xi || s === qi || s === Aa || s === Da || s === Ld || (vl.hasOwnProperty(s) ? o || (o = []) : (o = o || []).push(s, null));
  for (s in c) {
    const f = c[s], d = a?.[s];
    if (!(!c.hasOwnProperty(s) || f === d || f == null && d == null))
      if (s === ul)
        if (d) {
          for (r in d)
            d.hasOwnProperty(r) && (!f || !f.hasOwnProperty(r)) && (u || (u = {}), u[r] = "");
          for (r in f)
            f.hasOwnProperty(r) && d[r] !== f[r] && (u || (u = {}), u[r] = f[r]);
        } else
          u || (o || (o = []), o.push(s, u)), u = f;
      else if (s === Xi) {
        const g = f ? f[ka] : void 0, h = d ? d[ka] : void 0;
        g != null && h !== g && (o = o || []).push(s, "" + g);
      } else s === qi ? d !== f && (typeof f == "string" || typeof f == "number") && (o = o || []).push(s, "" + f) : s === Aa || s === Da || (vl.hasOwnProperty(s) ? (f != null && rl(i, s), !o && d !== f && (o = [])) : (o = o || []).push(s, f));
  }
  return u && (o = o || []).push(ul, u), o;
}
function WC(e, t, n, l, i) {
  n === "input" && i.type === "radio" && i.name != null && lf(e, i);
  const o = Ua(n, l), a = Ua(n, i);
  switch (FC(
    e,
    t,
    o,
    a
  ), n) {
    case "input":
      Pc(e, i);
      break;
    case "textarea":
      of(e, i);
      break;
    case "select":
      Eg(e, i);
      break;
  }
}
function BC(e, t, n) {
  switch (t) {
    case "input":
      mg(e, n);
      return;
    case "textarea":
      _g(e, n);
      return;
    case "select":
      Sg(e, n);
      return;
  }
}
function Pa(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Gs(e) {
  for (; e && e.firstChild; )
    e = e.firstChild;
  return e;
}
function IC(e) {
  for (; e; ) {
    if (e.nextSibling)
      return e.nextSibling;
    e = e.parentNode;
  }
}
function Zs(e, t) {
  let n = Gs(e), l = 0, i = 0;
  for (; n; ) {
    if (n.nodeType === At) {
      if (i = l + n.textContent.length, l <= t && i >= t)
        return {
          node: n,
          offset: t - l
        };
      l = i;
    }
    n = Gs(IC(n));
  }
}
function jC(e) {
  const { ownerDocument: t } = e, n = t && t.defaultView || window, l = n.getSelection && n.getSelection();
  if (!l || l.rangeCount === 0)
    return null;
  const { anchorNode: i, anchorOffset: o, focusNode: a, focusOffset: c } = l;
  try {
    i.nodeType, a.nodeType;
  } catch {
    return null;
  }
  return KC(
    e,
    i,
    o,
    a,
    c
  );
}
function KC(e, t, n, l, i) {
  let o = 0, a = -1, c = -1, s = 0, r = 0, u = e, f = null;
  e: for (; ; ) {
    let d = null;
    for (; u === t && (n === 0 || u.nodeType === At) && (a = o + n), u === l && (i === 0 || u.nodeType === At) && (c = o + i), u.nodeType === At && (o += u.nodeValue.length), (d = u.firstChild) !== null; )
      f = u, u = d;
    for (; ; ) {
      if (u === e)
        break e;
      if (f === t && ++s === n && (a = o), f === l && ++r === i && (c = o), (d = u.nextSibling) !== null)
        break;
      u = f, f = u.parentNode;
    }
    u = d;
  }
  return a === -1 || c === -1 ? null : {
    start: a,
    end: c
  };
}
function YC(e, t) {
  const n = e.ownerDocument || document, l = n && n.defaultView || window;
  if (!l.getSelection)
    return;
  const i = l.getSelection(), o = e.textContent.length;
  let a = Math.min(t.start, o), c = t.end === void 0 ? a : Math.min(t.end, o);
  if (!i.extend && a > c) {
    let u = c;
    c = a, a = u;
  }
  const s = Zs(e, a), r = Zs(e, c);
  if (s && r) {
    if (i.rangeCount === 1 && i.anchorNode === s.node && i.anchorOffset === s.offset && i.focusNode === r.node && i.focusOffset === r.offset)
      return;
    const u = n.createRange();
    u.setStart(s.node, s.offset), i.removeAllRanges(), a > c ? (i.addRange(u), i.extend(r.node, r.offset)) : (u.setEnd(r.node, r.offset), i.addRange(u));
  }
}
function Js(e) {
  return e && e.nodeType === At;
}
function $d(e, t) {
  return !e || !t ? !1 : e === t ? !0 : Js(e) ? !1 : Js(t) ? $d(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
}
function QC(e) {
  return e && e.ownerDocument && $d(e.ownerDocument.documentElement, e);
}
function XC(e) {
  try {
    return typeof e.contentWindow.location.href == "string";
  } catch {
    return !1;
  }
}
function wd() {
  let e = window, t = Pa();
  for (; t instanceof e.HTMLIFrameElement; ) {
    if (XC(t))
      e = t.contentWindow;
    else
      return t;
    t = Pa(e.document);
  }
  return t;
}
function jc(e) {
  const t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
function qC() {
  const e = wd();
  return {
    focusedElem: e,
    selectionRange: jc(e) ? GC(e) : null
  };
}
function VC(e) {
  const t = wd(), n = e.focusedElem, l = e.selectionRange;
  if (t !== n && QC(n)) {
    l !== null && jc(n) && ZC(n, l);
    const i = [];
    let o = n;
    for (; o = o.parentNode; )
      o.nodeType === uf && i.push({
        element: o,
        left: o.scrollLeft,
        top: o.scrollTop
      });
    typeof n.focus == "function" && n.focus();
    for (let a = 0; a < i.length; a++) {
      const c = i[a];
      c.element.scrollLeft = c.left, c.element.scrollTop = c.top;
    }
  }
}
function GC(e) {
  let t;
  return "selectionStart" in e ? t = {
    start: e.selectionStart,
    end: e.selectionEnd
  } : t = jC(e), t || { start: 0, end: 0 };
}
function ZC(e, t) {
  let { start: n, end: l } = t;
  l === void 0 && (l = n), "selectionStart" in e ? (e.selectionStart = n, e.selectionEnd = Math.min(l, e.value.length)) : YC(e, t);
}
const JC = "style";
let Ma = null, Na = null;
function eT(e, t) {
  switch (e) {
    case "button":
    case "input":
    case "select":
    case "textarea":
      return !!t.autoFocus;
  }
  return !1;
}
function tT(e) {
  let t, n;
  const l = e.nodeType;
  switch (l) {
    case Sn:
    case rf: {
      t = l === Sn ? "#document" : "#fragment";
      let i = e.documentElement;
      n = i ? i.namespaceURI : Sa(null, "");
      break;
    }
    default: {
      const i = l === Oo ? e.parentNode : e, o = i.namespaceURI || null;
      t = i.tagName, n = Sa(o, t);
      break;
    }
  }
  return n;
}
function nT(e, t, n) {
  return Sa(e, t);
}
function lT(e) {
  Ma = UC(), Na = qC(), Ad(!1);
}
function iT(e) {
  VC(Na), Na = null, Ad(Ma), Ma = null;
}
function oT(e, t, n, l, i) {
  let o;
  o = l;
  const a = HC(
    e,
    t,
    n,
    o
  );
  return Qr(i, a), qr(a, t), a;
}
function aT(e, t) {
  e.appendChild(t);
}
function cT(e, t, n, l, i) {
  return wC(e, t, n, l), eT(t, n);
}
function sT(e, t, n, l, i, o) {
  return zC(
    e,
    t,
    n,
    l,
    i
  );
}
function eu(e, t) {
  return e === "textarea" || e === "option" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
function uT(e, t) {
  return !!t.hidden;
}
function rT(e, t, n, l) {
  const i = $C(e, t);
  return Qr(l, i), i;
}
const fT = typeof setTimeout == "function" ? setTimeout : void 0, tu = typeof clearTimeout == "function" ? clearTimeout : void 0, Zn = -1, dT = Hr, pT = $r;
function hT(e, t, n, l, i, o) {
  qr(e, i), WC(e, t, n, l, i);
}
function zd(e) {
  Wi(e, "");
}
function mT(e, t, n) {
  e.nodeValue = n;
}
function yT(e, t) {
  e.appendChild(t);
}
function gT(e, t) {
  let n;
  e.nodeType === Oo ? (n = e.parentNode, n.insertBefore(t, e)) : (n = e, n.appendChild(t));
  const l = e._reactRootContainer;
  l == null && n.onclick;
}
function CT(e, t, n) {
  e.insertBefore(t, n);
}
function TT(e, t, n) {
  e.nodeType === Oo ? e.parentNode.insertBefore(t, n) : e.insertBefore(t, n);
}
function bT(e, t) {
  e.removeChild(t);
}
function ET(e, t) {
  e.nodeType === Oo ? e.parentNode.removeChild(t) : e.removeChild(t);
}
function ST(e) {
  e = e, e.style.display = "none";
}
function vT(e) {
  e.nodeValue = "";
}
function xT(e, t) {
  e = e;
  const n = t[JC], l = n != null && n.hasOwnProperty("display") ? n.display : null;
  e.style.display = Md("display", l);
}
function _T(e, t) {
  e.nodeValue = t;
}
const ci = 0, Si = 1, la = 2;
function RT(e) {
  return e._status === Si ? e._result : null;
}
function OT(e, t, n) {
  const l = t.displayName || t.name || "";
  return e.displayName || (l !== "" ? `${n}(${l})` : n);
}
function Ct(e) {
  if (e == null)
    return null;
  if (typeof e == "function")
    return e.displayName || e.name || null;
  if (typeof e == "string")
    return e;
  switch (e) {
    case $l:
      return "ConcurrentMode";
    case Ue:
      return "Fragment";
    case Qt:
      return "Portal";
    case mn:
      return "Profiler";
    case Hl:
      return "StrictMode";
    case wl:
      return "Suspense";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case uc:
        return "Context.Consumer";
      case sc:
        return "Context.Provider";
      case Co:
        return OT(e, e.render, "ForwardRef");
      case To:
        return Ct(e.type);
      case rc: {
        const n = RT(e);
        if (n)
          return Ct(n);
      }
    }
  return null;
}
const La = [];
let Gt = -1;
function Hn(e) {
  return {
    current: e
  };
}
function ae(e, t) {
  Gt < 0 || (e.current = La[Gt], La[Gt] = null, Gt--);
}
function ie(e, t, n) {
  Gt++, La[Gt] = e.current, e.current = t;
}
const Tt = {};
let it = Hn(Tt), Me = Hn(!1), Kc = Tt;
function $n(e, t, n) {
  return n && Fe(t) ? Kc : it.current;
}
function Wd(e, t, n) {
  const l = e.stateNode;
  l.__reactInternalMemoizedUnmaskedChildContext = t, l.__reactInternalMemoizedMaskedChildContext = n;
}
function wn(e, t) {
  const l = e.type.contextTypes;
  if (!l)
    return Tt;
  const i = e.stateNode;
  if (i && i.__reactInternalMemoizedUnmaskedChildContext === t)
    return i.__reactInternalMemoizedMaskedChildContext;
  const o = {};
  for (let a in l)
    o[a] = t[a];
  return i && Wd(e, t, o), o;
}
function Lo() {
  return Me.current;
}
function Fe(e) {
  const t = e.childContextTypes;
  return t != null;
}
function Vi(e) {
  ae(Me), ae(it);
}
function Yc(e) {
  ae(Me), ae(it);
}
function nu(e, t, n) {
  O(
    it.current === Tt,
    "Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue."
  ), ie(it, t), ie(Me, n);
}
function Bd(e, t, n) {
  const l = e.stateNode, i = t.childContextTypes;
  if (typeof l.getChildContext != "function")
    return n;
  let o;
  o = l.getChildContext();
  for (let a in o)
    O(
      a in i,
      '%s.getChildContext(): key "%s" is not defined in childContextTypes.',
      Ct(t) || "Unknown",
      a
    );
  return { ...n, ...o };
}
function Fo(e) {
  const t = e.stateNode, n = t && t.__reactInternalMemoizedMergedChildContext || Tt;
  return Kc = it.current, ie(it, n), ie(
    Me,
    Me.current
  ), !0;
}
function lu(e, t, n) {
  const l = e.stateNode;
  if (O(
    l,
    "Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue."
  ), n) {
    const i = Bd(
      e,
      t,
      Kc
    );
    l.__reactInternalMemoizedMergedChildContext = i, ae(Me), ae(it), ie(it, i), ie(Me, n);
  } else
    ae(Me), ie(Me, n);
}
function UT(e) {
  O(
    jr(e) && e.tag === w,
    "Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue."
  );
  let t = e;
  do {
    switch (t.tag) {
      case B:
        return t.stateNode.context;
      case w: {
        const n = t.type;
        if (Fe(n))
          return t.stateNode.__reactInternalMemoizedMergedChildContext;
        break;
      }
    }
    t = t.return;
  } while (t !== null);
  O(
    !1,
    "Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue."
  );
}
const An = 1073741823, x = 0, Dn = 1, ge = An, Gi = 10, Zi = An - 1;
function Id(e) {
  return Zi - (e / Gi | 0);
}
function _l(e) {
  return (Zi - e) * Gi;
}
function AT(e, t) {
  return ((e / t | 0) + 1) * t;
}
function jd(e, t, n) {
  return Zi - AT(
    Zi - e + t / Gi,
    n / Gi
  );
}
const Kd = 5e3, DT = 250;
function Yd(e) {
  return jd(
    e,
    Kd,
    DT
  );
}
const kT = 150, PT = 100;
function MT(e) {
  return jd(
    e,
    kT,
    PT
  );
}
const cn = 0, Ze = 1, Fa = 2, NT = 4;
function LT(e, t, n, l) {
  this.tag = e, this.key = n, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.contextDependencies = null, this.mode = l, this.effectTag = Te, this.nextEffect = null, this.firstEffect = null, this.lastEffect = null, this.expirationTime = x, this.childExpirationTime = x, this.alternate = null;
}
const st = function(e, t, n, l) {
  return new LT(e, t, n, l);
};
function Qc(e) {
  const t = e.prototype;
  return !!(t && t.isReactComponent);
}
function FT(e) {
  return typeof e == "function" && !Qc(e) && e.defaultProps === void 0;
}
function HT(e) {
  if (typeof e == "function")
    return Qc(e) ? w : $e;
  if (e != null) {
    const t = e.$$typeof;
    if (t === Co)
      return ct;
    if (t === To)
      return Bt;
  }
  return So;
}
function Ht(e, t, n) {
  let l = e.alternate;
  return l === null ? (l = st(
    e.tag,
    t,
    e.key,
    e.mode
  ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.effectTag = Te, l.nextEffect = null, l.firstEffect = null, l.lastEffect = null), l.childExpirationTime = e.childExpirationTime, l.expirationTime = e.expirationTime, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, l.contextDependencies = e.contextDependencies, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l;
}
function $T(e) {
  let t = e ? Ze | Fa : cn;
  return st(B, null, null, t);
}
function Qd(e, t, n, l, i, o) {
  let a, c = So, s = e;
  if (typeof e == "function")
    Qc(e) && (c = w);
  else if (typeof e == "string")
    c = $;
  else
    e: switch (e) {
      case Ue:
        return rt(
          n.children,
          i,
          o,
          t
        );
      case $l:
        return iu(
          n,
          i | Ze | Fa,
          o,
          t
        );
      case Hl:
        return iu(
          n,
          i | Fa,
          o,
          t
        );
      case mn:
        return wT(n, i, o, t);
      case wl:
        return zT(n, i, o, t);
      default: {
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case sc:
              c = yt;
              break e;
            case uc:
              c = vo;
              break e;
            case Co:
              c = ct;
              break e;
            case To:
              c = Bt;
              break e;
            case rc:
              c = Sc, s = null;
              break e;
          }
        O(
          !1,
          "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          e == null ? e : typeof e,
          ""
        );
      }
    }
  return a = st(c, n, t, i), a.elementType = e, a.type = s, a.expirationTime = o, a;
}
function ia(e, t, n) {
  let l = null;
  const i = e.type, o = e.key, a = e.props;
  return Qd(
    i,
    o,
    a,
    l,
    t,
    n
  );
}
function rt(e, t, n, l) {
  const i = st(Cn, e, l, t);
  return i.expirationTime = n, i;
}
function wT(e, t, n, l) {
  const i = st(Tn, e, l, t | NT);
  return i.elementType = mn, i.type = mn, i.expirationTime = n, i;
}
function iu(e, t, n, l) {
  const i = st(Ec, e, l, t), o = (t & Ze) === cn ? Hl : $l;
  return i.elementType = o, i.type = o, i.expirationTime = n, i;
}
function zT(e, t, n, l) {
  const i = st(Le, e, l, t), o = wl;
  return i.elementType = o, i.type = o, i.expirationTime = n, i;
}
function oa(e, t, n) {
  const l = st(q, e, null, t);
  return l.expirationTime = n, l;
}
function aa(e, t, n) {
  const l = e.children !== null ? e.children : [], i = st(W, l, e.key, t);
  return i.expirationTime = n, i.stateNode = {
    containerInfo: e.containerInfo,
    pendingChildren: null,
    // Used by persistent updates
    implementation: e.implementation
  }, i;
}
function WT(e, t, n) {
  const l = $T(t);
  let i;
  return i = {
    current: l,
    containerInfo: e,
    pendingChildren: null,
    pingCache: null,
    earliestPendingTime: x,
    latestPendingTime: x,
    earliestSuspendedTime: x,
    latestSuspendedTime: x,
    latestPingedTime: x,
    didError: !1,
    pendingCommitExpirationTime: x,
    finishedWork: null,
    timeoutHandle: Zn,
    context: null,
    pendingContext: null,
    hydrate: n,
    nextExpirationTimeToWorkOn: x,
    expirationTime: x,
    firstBatch: null,
    nextScheduledRoot: null
  }, l.stateNode = i, i;
}
function fl(e, t) {
  e.didError = !1;
  const n = e.earliestPendingTime;
  n === x ? e.earliestPendingTime = e.latestPendingTime = t : n < t ? e.earliestPendingTime = t : e.latestPendingTime > t && (e.latestPendingTime = t), ut(t, e);
}
function BT(e, t) {
  if (e.didError = !1, t === x) {
    e.earliestPendingTime = x, e.latestPendingTime = x, e.earliestSuspendedTime = x, e.latestSuspendedTime = x, e.latestPingedTime = x, ut(x, e);
    return;
  }
  t < e.latestPingedTime && (e.latestPingedTime = x);
  const n = e.latestPendingTime;
  n !== x && (n > t ? e.earliestPendingTime = e.latestPendingTime = x : e.earliestPendingTime > t && (e.earliestPendingTime = e.latestPendingTime));
  const l = e.earliestSuspendedTime;
  if (l === x) {
    fl(e, t), ut(x, e);
    return;
  }
  const i = e.latestSuspendedTime;
  if (t < i) {
    e.earliestSuspendedTime = x, e.latestSuspendedTime = x, e.latestPingedTime = x, fl(e, t), ut(x, e);
    return;
  }
  if (t > l) {
    fl(e, t), ut(x, e);
    return;
  }
  ut(x, e);
}
function IT(e, t) {
  const n = e.latestPendingTime, l = e.latestSuspendedTime, i = e.latestPingedTime;
  return n !== x && n < t || l !== x && l < t || i !== x && i < t;
}
function jT(e, t) {
  const n = e.earliestSuspendedTime, l = e.latestSuspendedTime;
  return n !== x && t <= n && t >= l;
}
function ou(e, t) {
  e.didError = !1, YT(e, t);
  const n = e.earliestPendingTime, l = e.latestPendingTime;
  n === t ? l === t ? e.earliestPendingTime = e.latestPendingTime = x : e.earliestPendingTime = l : l === t && (e.latestPendingTime = n);
  const i = e.earliestSuspendedTime, o = e.latestSuspendedTime;
  i === x ? e.earliestSuspendedTime = e.latestSuspendedTime = t : i < t ? e.earliestSuspendedTime = t : o > t && (e.latestSuspendedTime = t), ut(t, e);
}
function KT(e, t) {
  e.didError = !1;
  const n = e.latestPingedTime;
  (n === x || n > t) && (e.latestPingedTime = t), ut(t, e);
}
function YT(e, t) {
  e.latestPingedTime >= t && (e.latestPingedTime = x);
}
function Xd(e, t) {
  let n = t;
  const l = e.earliestPendingTime, i = e.earliestSuspendedTime;
  return l > n && (n = l), i > n && (n = i), n;
}
function QT(e, t) {
  const n = e.expirationTime;
  n !== x && t <= n && (e.nextExpirationTimeToWorkOn = t);
}
function ut(e, t) {
  const n = t.earliestSuspendedTime, l = t.latestSuspendedTime, i = t.earliestPendingTime, o = t.latestPingedTime;
  let a = i !== x ? i : o;
  a === x && (e === x || l < e) && (a = l);
  let c = a;
  c !== x && n > c && (c = n), t.nextExpirationTimeToWorkOn = a, t.expirationTime = c;
}
const qd = 0, Vd = 1, Ho = 2, Xc = 3;
let $o = !1;
function vi(e) {
  return {
    baseState: e,
    firstUpdate: null,
    lastUpdate: null,
    firstCapturedUpdate: null,
    lastCapturedUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCapturedEffect: null,
    lastCapturedEffect: null
  };
}
function Ha(e) {
  return {
    baseState: e.baseState,
    firstUpdate: e.firstUpdate,
    lastUpdate: e.lastUpdate,
    // TODO: With resuming, if we bail out and resuse the child tree, we should
    // keep these effects.
    firstCapturedUpdate: null,
    lastCapturedUpdate: null,
    firstEffect: null,
    lastEffect: null,
    firstCapturedEffect: null,
    lastCapturedEffect: null
  };
}
function dt(e) {
  return {
    expirationTime: e,
    tag: qd,
    payload: null,
    callback: null,
    next: null,
    nextEffect: null
  };
}
function si(e, t) {
  e.lastUpdate === null ? e.firstUpdate = e.lastUpdate = t : (e.lastUpdate.next = t, e.lastUpdate = t);
}
function Je(e, t) {
  const n = e.alternate;
  let l, i;
  n === null ? (l = e.updateQueue, i = null, l === null && (l = e.updateQueue = vi(e.memoizedState))) : (l = e.updateQueue, i = n.updateQueue, l === null ? i === null ? (l = e.updateQueue = vi(e.memoizedState), i = n.updateQueue = vi(
    n.memoizedState
  )) : l = e.updateQueue = Ha(i) : i === null && (i = n.updateQueue = Ha(l))), i === null || l === i ? si(l, t) : l.lastUpdate === null || i.lastUpdate === null ? (si(l, t), si(i, t)) : (si(l, t), i.lastUpdate = t);
}
function au(e, t) {
  let n = e.updateQueue;
  n === null ? n = e.updateQueue = vi(
    e.memoizedState
  ) : n = Gd(
    e,
    n
  ), n.lastCapturedUpdate === null ? n.firstCapturedUpdate = n.lastCapturedUpdate = t : (n.lastCapturedUpdate.next = t, n.lastCapturedUpdate = t);
}
function Gd(e, t) {
  const n = e.alternate;
  return n !== null && t === n.updateQueue && (t = e.updateQueue = Ha(t)), t;
}
function cu(e, t, n, l, i, o) {
  switch (n.tag) {
    case Vd: {
      const a = n.payload;
      return typeof a == "function" ? a.call(o, l, i) : a;
    }
    case Xc:
      e.effectTag = e.effectTag & ~Be | xe;
    // Intentional fallthrough
    case qd: {
      const a = n.payload;
      let c;
      return typeof a == "function" ? c = a.call(o, l, i) : c = a, c == null ? l : Object.assign({}, l, c);
    }
    case Ho:
      return $o = !0, l;
  }
  return l;
}
function Rl(e, t, n, l, i) {
  $o = !1, t = Gd(e, t);
  let o = t.baseState, a = null, c = x, s = t.firstUpdate, r = o;
  for (; s !== null; ) {
    const f = s.expirationTime;
    f < i ? (a === null && (a = s, o = r), c < f && (c = f)) : (r = cu(
      e,
      t,
      s,
      r,
      n,
      l
    ), s.callback !== null && (e.effectTag |= Ti, s.nextEffect = null, t.lastEffect === null ? t.firstEffect = t.lastEffect = s : (t.lastEffect.nextEffect = s, t.lastEffect = s))), s = s.next;
  }
  let u = null;
  for (s = t.firstCapturedUpdate; s !== null; ) {
    const f = s.expirationTime;
    f < i ? (u === null && (u = s, a === null && (o = r)), c < f && (c = f)) : (r = cu(
      e,
      t,
      s,
      r,
      n,
      l
    ), s.callback !== null && (e.effectTag |= Ti, s.nextEffect = null, t.lastCapturedEffect === null ? t.firstCapturedEffect = t.lastCapturedEffect = s : (t.lastCapturedEffect.nextEffect = s, t.lastCapturedEffect = s))), s = s.next;
  }
  a === null && (t.lastUpdate = null), u === null ? t.lastCapturedUpdate = null : e.effectTag |= Ti, a === null && u === null && (o = r), t.baseState = o, t.firstUpdate = a, t.firstCapturedUpdate = u, e.expirationTime = c, e.memoizedState = r;
}
function XT(e, t) {
  O(
    typeof e == "function",
    "Invalid argument passed as callback. Expected a function. Instead received: %s",
    e
  ), e.call(t);
}
function Zd() {
  $o = !1;
}
function Ji() {
  return $o;
}
function su(e, t, n, l) {
  t.firstCapturedUpdate !== null && (t.lastUpdate !== null && (t.lastUpdate.next = t.firstCapturedUpdate, t.lastUpdate = t.lastCapturedUpdate), t.firstCapturedUpdate = t.lastCapturedUpdate = null), uu(t.firstEffect, n), t.firstEffect = t.lastEffect = null, uu(t.firstCapturedEffect, n), t.firstCapturedEffect = t.lastCapturedEffect = null;
}
function uu(e, t) {
  for (; e !== null; ) {
    const n = e.callback;
    n !== null && (e.callback = null, XT(n, t)), e = e.nextEffect;
  }
}
const qT = /^(.*)[\\\/]/;
function VT(e, t, n) {
  let l = "";
  return t ? l = " (at " + t.fileName.replace(qT, "") + ":" + t.lineNumber + ")" : n && (l = " (created by " + n + ")"), `
    in ` + (e || "Unknown") + l;
}
Wt.ReactDebugCurrentFrame;
function GT(e) {
  switch (e.tag) {
    case B:
    case W:
    case q:
    case Cn:
    case yt:
    case vo:
      return "";
    default:
      const t = e._debugOwner, n = e._debugSource, l = Ct(e.type);
      let i = null;
      return t && (i = Ct(t.type)), VT(l, n, i);
  }
}
function qc(e) {
  let t = "", n = e;
  do
    t += GT(n), n = n.return;
  while (n);
  return t;
}
function xi(e, t) {
  return {
    value: e,
    source: t,
    stack: qc(t)
  };
}
function $t(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
const ZT = Object.prototype.hasOwnProperty;
function Ol(e, t) {
  if ($t(e, t))
    return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const n = Object.keys(e), l = Object.keys(t);
  if (n.length !== l.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!ZT.call(t, n[i]) || !$t(e[n[i]], t[n[i]]))
      return !1;
  return !0;
}
function ve(e, t) {
  if (e && e.defaultProps) {
    const n = Object.assign({}, t), l = e.defaultProps;
    for (let i in l)
      n[i] === void 0 && (n[i] = l[i]);
    return n;
  }
  return t;
}
function JT(e) {
  const t = e._status, n = e._result;
  switch (t) {
    case Si:
      return n;
    case la:
      throw n;
    case ci:
      throw n;
    default: {
      e._status = ci;
      const l = e._ctor, i = l();
      switch (i.then(
        (o) => {
          if (e._status === ci) {
            const a = o.default;
            e._status = Si, e._result = a;
          }
        },
        (o) => {
          e._status === ci && (e._status = la, e._result = o);
        }
      ), e._status) {
        case Si:
          return e._result;
        case la:
          throw e._result;
      }
      throw e._result = i, i;
    }
  }
}
const Jd = new bc.Component().refs;
function wo(e, t, n, l) {
  const i = e.memoizedState, o = n(l, i), a = o == null ? i : Object.assign({}, i, o);
  e.memoizedState = a;
  const c = e.updateQueue;
  c !== null && e.expirationTime === x && (c.baseState = a);
}
const Vc = {
  isMounted: Vy,
  enqueueSetState(e, t, n) {
    const l = il(e), i = tt(), o = dn(i, l), a = dt(o);
    a.payload = t, n != null && (a.callback = n), fn(), Je(l, a), mt(l, o);
  },
  enqueueReplaceState(e, t, n) {
    const l = il(e), i = tt(), o = dn(i, l), a = dt(o);
    a.tag = Vd, a.payload = t, n != null && (a.callback = n), fn(), Je(l, a), mt(l, o);
  },
  enqueueForceUpdate(e, t) {
    const n = il(e), l = tt(), i = dn(l, n), o = dt(i);
    o.tag = Ho, t != null && (o.callback = t), fn(), Je(n, o), mt(n, i);
  }
};
function ep(e, t, n, l, i, o, a) {
  const c = e.stateNode;
  return typeof c.shouldComponentUpdate == "function" ? c.shouldComponentUpdate(
    l,
    o,
    a
  ) : t.prototype && t.prototype.isPureReactComponent ? !Ol(n, l) || !Ol(i, o) : !0;
}
function tp(e, t) {
  t.updater = Vc, e.stateNode = t, Yy(t, e);
}
function np(e, t, n, l) {
  let i = !1, o = Tt, a = null;
  const c = t.contextType;
  if (typeof c == "object" && c !== null)
    a = He(c);
  else {
    o = $n(e, t, !0);
    const r = t.contextTypes;
    i = r != null, a = i ? wn(e, o) : Tt;
  }
  const s = new t(n, a);
  return e.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, tp(e, s), i && Wd(e, o, a), s;
}
function eb(e, t) {
  const n = t.state;
  typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), n !== t.state && Vc.enqueueReplaceState(t, t.state, null);
}
function lp(e, t, n, l) {
  const i = t.state;
  typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, l), t.state !== i && Vc.enqueueReplaceState(t, t.state, null);
}
function Gc(e, t, n, l) {
  const i = e.stateNode;
  i.props = n, i.state = e.memoizedState, i.refs = Jd;
  const o = t.contextType;
  if (typeof o == "object" && o !== null)
    i.context = He(o);
  else {
    const s = $n(e, t, !0);
    i.context = wn(e, s);
  }
  let a = e.updateQueue;
  a !== null && (Rl(
    e,
    a,
    n,
    i,
    l
  ), i.state = e.memoizedState);
  const c = t.getDerivedStateFromProps;
  typeof c == "function" && (wo(
    e,
    t,
    c,
    n
  ), i.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof i.getSnapshotBeforeUpdate != "function" && (typeof i.UNSAFE_componentWillMount == "function" || typeof i.componentWillMount == "function") && (eb(e, i), a = e.updateQueue, a !== null && (Rl(
    e,
    a,
    n,
    i,
    l
  ), i.state = e.memoizedState)), typeof i.componentDidMount == "function" && (e.effectTag |= K);
}
function tb(e, t, n, l) {
  const i = e.stateNode, o = e.memoizedProps;
  i.props = o;
  const a = i.context, c = t.contextType;
  let s;
  if (typeof c == "object" && c !== null)
    s = He(c);
  else {
    const y = $n(
      e,
      t,
      !0
    );
    s = wn(e, y);
  }
  const r = t.getDerivedStateFromProps, u = typeof r == "function" || typeof i.getSnapshotBeforeUpdate == "function";
  !u && (typeof i.UNSAFE_componentWillReceiveProps == "function" || typeof i.componentWillReceiveProps == "function") && (o !== n || a !== s) && lp(
    e,
    i,
    n,
    s
  ), Zd();
  const f = e.memoizedState;
  let d = i.state = f, g = e.updateQueue;
  if (g !== null && (Rl(
    e,
    g,
    n,
    i,
    l
  ), d = e.memoizedState), o === n && f === d && !Lo() && !Ji())
    return typeof i.componentDidMount == "function" && (e.effectTag |= K), !1;
  typeof r == "function" && (wo(
    e,
    t,
    r,
    n
  ), d = e.memoizedState);
  const h = Ji() || ep(
    e,
    t,
    o,
    n,
    f,
    d,
    s
  );
  return h ? (!u && (typeof i.UNSAFE_componentWillMount == "function" || typeof i.componentWillMount == "function") && (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (e.effectTag |= K)) : (typeof i.componentDidMount == "function" && (e.effectTag |= K), e.memoizedProps = n, e.memoizedState = d), i.props = n, i.state = d, i.context = s, h;
}
function nb(e, t, n, l, i) {
  const o = t.stateNode, a = t.memoizedProps;
  o.props = t.type === t.elementType ? a : ve(t.type, a);
  const c = o.context, s = n.contextType;
  let r;
  if (typeof s == "object" && s !== null)
    r = He(s);
  else {
    const E = $n(t, n, !0);
    r = wn(t, E);
  }
  const u = n.getDerivedStateFromProps, f = typeof u == "function" || typeof o.getSnapshotBeforeUpdate == "function";
  !f && (typeof o.UNSAFE_componentWillReceiveProps == "function" || typeof o.componentWillReceiveProps == "function") && (a !== l || c !== r) && lp(
    t,
    o,
    l,
    r
  ), Zd();
  const d = t.memoizedState;
  let g = o.state = d, h = t.updateQueue;
  if (h !== null && (Rl(
    t,
    h,
    l,
    o,
    i
  ), g = t.memoizedState), a === l && d === g && !Lo() && !Ji())
    return typeof o.componentDidUpdate == "function" && (a !== e.memoizedProps || d !== e.memoizedState) && (t.effectTag |= K), typeof o.getSnapshotBeforeUpdate == "function" && (a !== e.memoizedProps || d !== e.memoizedState) && (t.effectTag |= ol), !1;
  typeof u == "function" && (wo(
    t,
    n,
    u,
    l
  ), g = t.memoizedState);
  const y = Ji() || ep(
    t,
    n,
    a,
    l,
    d,
    g,
    r
  );
  return y ? (!f && (typeof o.UNSAFE_componentWillUpdate == "function" || typeof o.componentWillUpdate == "function") && (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(l, g, r), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(l, g, r)), typeof o.componentDidUpdate == "function" && (t.effectTag |= K), typeof o.getSnapshotBeforeUpdate == "function" && (t.effectTag |= ol)) : (typeof o.componentDidUpdate == "function" && (a !== e.memoizedProps || d !== e.memoizedState) && (t.effectTag |= K), typeof o.getSnapshotBeforeUpdate == "function" && (a !== e.memoizedProps || d !== e.memoizedState) && (t.effectTag |= ol), t.memoizedProps = l, t.memoizedState = g), o.props = l, o.state = g, o.context = r, y;
}
const ui = Array.isArray;
function Xn(e, t, n) {
  let l = n.ref;
  if (l !== null && typeof l != "function" && typeof l != "object")
    if (n._owner) {
      const i = n._owner;
      let o;
      i && (o = i.stateNode), O(
        o,
        "Missing owner for string ref %s. This error is likely caused by a bug in React. Please file an issue.",
        l
      );
      const a = "" + l;
      if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === a)
        return t.ref;
      const c = function(s) {
        let r = o.refs;
        r === Jd && (r = o.refs = {}), s === null ? delete r[a] : r[a] = s;
      };
      return c._stringRef = a, c;
    } else
      O(
        typeof l == "string",
        "Expected ref to be a function, a string, an object returned by React.createRef(), or null."
      ), O(
        n._owner,
        `Element ref was specified as a string (%s) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://fb.me/react-refs-must-have-owner for more information.`,
        l
      );
  return l;
}
function ri(e, t) {
  e.type !== "textarea" && O(
    !1,
    "Objects are not valid as a React child (found: %s).%s",
    Object.prototype.toString.call(t) === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : t,
    ""
  );
}
function ip(e) {
  function t(p, C) {
    if (!e)
      return;
    const m = p.lastEffect;
    m !== null ? (m.nextEffect = C, p.lastEffect = C) : p.firstEffect = p.lastEffect = C, C.nextEffect = null, C.effectTag = Fi;
  }
  function n(p, C) {
    if (!e)
      return null;
    let m = C;
    for (; m !== null; )
      t(p, m), m = m.sibling;
    return null;
  }
  function l(p, C) {
    const m = /* @__PURE__ */ new Map();
    let T = C;
    for (; T !== null; )
      T.key !== null ? m.set(T.key, T) : m.set(T.index, T), T = T.sibling;
    return m;
  }
  function i(p, C, m) {
    const T = Ht(p, C);
    return T.index = 0, T.sibling = null, T;
  }
  function o(p, C, m) {
    if (p.index = m, !e)
      return C;
    const T = p.alternate;
    if (T !== null) {
      const _ = T.index;
      return _ < C ? (p.effectTag = X, C) : _;
    } else
      return p.effectTag = X, C;
  }
  function a(p) {
    return e && p.alternate === null && (p.effectTag = X), p;
  }
  function c(p, C, m, T) {
    if (C === null || C.tag !== q) {
      const _ = oa(
        m,
        p.mode,
        T
      );
      return _.return = p, _;
    } else {
      const _ = i(C, m);
      return _.return = p, _;
    }
  }
  function s(p, C, m, T) {
    if (C !== null && C.elementType === m.type) {
      const _ = i(C, m.props);
      return _.ref = Xn(p, C, m), _.return = p, _;
    } else {
      const _ = ia(
        m,
        p.mode,
        T
      );
      return _.ref = Xn(p, C, m), _.return = p, _;
    }
  }
  function r(p, C, m, T) {
    if (C === null || C.tag !== W || C.stateNode.containerInfo !== m.containerInfo || C.stateNode.implementation !== m.implementation) {
      const _ = aa(
        m,
        p.mode,
        T
      );
      return _.return = p, _;
    } else {
      const _ = i(C, m.children || []);
      return _.return = p, _;
    }
  }
  function u(p, C, m, T, _) {
    if (C === null || C.tag !== Cn) {
      const v = rt(
        m,
        p.mode,
        T,
        _
      );
      return v.return = p, v;
    } else {
      const v = i(C, m);
      return v.return = p, v;
    }
  }
  function f(p, C, m) {
    if (typeof C == "string" || typeof C == "number") {
      const T = oa(
        "" + C,
        p.mode,
        m
      );
      return T.return = p, T;
    }
    if (typeof C == "object" && C !== null) {
      switch (C.$$typeof) {
        case vt: {
          const T = ia(
            C,
            p.mode,
            m
          );
          return T.ref = Xn(p, null, C), T.return = p, T;
        }
        case Qt: {
          const T = aa(
            C,
            p.mode,
            m
          );
          return T.return = p, T;
        }
      }
      if (ui(C) || Yt(C)) {
        const T = rt(
          C,
          p.mode,
          m,
          null
        );
        return T.return = p, T;
      }
      ri(p, C);
    }
    return null;
  }
  function d(p, C, m, T) {
    const _ = C !== null ? C.key : null;
    if (typeof m == "string" || typeof m == "number")
      return _ !== null ? null : c(
        p,
        C,
        "" + m,
        T
      );
    if (typeof m == "object" && m !== null) {
      switch (m.$$typeof) {
        case vt:
          return m.key === _ ? m.type === Ue ? u(
            p,
            C,
            m.props.children,
            T,
            _
          ) : s(
            p,
            C,
            m,
            T
          ) : null;
        case Qt:
          return m.key === _ ? r(
            p,
            C,
            m,
            T
          ) : null;
      }
      if (ui(m) || Yt(m))
        return _ !== null ? null : u(
          p,
          C,
          m,
          T,
          null
        );
      ri(p, m);
    }
    return null;
  }
  function g(p, C, m, T, _) {
    if (typeof T == "string" || typeof T == "number") {
      const v = p.get(m) || null;
      return c(
        C,
        v,
        "" + T,
        _
      );
    }
    if (typeof T == "object" && T !== null) {
      switch (T.$$typeof) {
        case vt: {
          const v = p.get(
            T.key === null ? m : T.key
          ) || null;
          return T.type === Ue ? u(
            C,
            v,
            T.props.children,
            _,
            T.key
          ) : s(
            C,
            v,
            T,
            _
          );
        }
        case Qt: {
          const v = p.get(
            T.key === null ? m : T.key
          ) || null;
          return r(
            C,
            v,
            T,
            _
          );
        }
      }
      if (ui(T) || Yt(T)) {
        const v = p.get(m) || null;
        return u(
          C,
          v,
          T,
          _,
          null
        );
      }
      ri(C, T);
    }
    return null;
  }
  function h(p, C, m, T) {
    let _ = null, v = null, A = C, F = 0, N = 0, le = null;
    for (; A !== null && N < m.length; N++) {
      A.index > N ? (le = A, A = null) : le = A.sibling;
      const H = d(
        p,
        A,
        m[N],
        T
      );
      if (H === null) {
        A === null && (A = le);
        break;
      }
      e && A && H.alternate === null && t(p, A), F = o(H, F, N), v === null ? _ = H : v.sibling = H, v = H, A = le;
    }
    if (N === m.length)
      return n(p, A), _;
    if (A === null) {
      for (; N < m.length; N++) {
        const H = f(
          p,
          m[N],
          T
        );
        H && (F = o(H, F, N), v === null ? _ = H : v.sibling = H, v = H);
      }
      return _;
    }
    const ce = l(p, A);
    for (; N < m.length; N++) {
      const H = g(
        ce,
        p,
        N,
        m[N],
        T
      );
      H && (e && H.alternate !== null && ce.delete(
        H.key === null ? N : H.key
      ), F = o(H, F, N), v === null ? _ = H : v.sibling = H, v = H);
    }
    return e && ce.forEach((H) => t(p, H)), _;
  }
  function y(p, C, m, T) {
    const _ = Yt(m);
    O(
      typeof _ == "function",
      "An object is not an iterable. This error is likely caused by a bug in React. Please file an issue."
    );
    const v = _.call(m);
    O(v != null, "An iterable object provided no iterator.");
    let A = null, F = null, N = C, le = 0, ce = 0, H = null, Re = v.next();
    for (; N !== null && !Re.done; ce++, Re = v.next()) {
      N.index > ce ? (H = N, N = null) : H = N.sibling;
      const z = d(
        p,
        N,
        Re.value,
        T
      );
      if (z === null) {
        N || (N = H);
        break;
      }
      e && N && z.alternate === null && t(p, N), le = o(z, le, ce), F === null ? A = z : F.sibling = z, F = z, N = H;
    }
    if (Re.done)
      return n(p, N), A;
    if (N === null) {
      for (; !Re.done; ce++, Re = v.next()) {
        const z = f(p, Re.value, T);
        z !== null && (le = o(z, le, ce), F === null ? A = z : F.sibling = z, F = z);
      }
      return A;
    }
    const Ko = l(p, N);
    for (; !Re.done; ce++, Re = v.next()) {
      const z = g(
        Ko,
        p,
        ce,
        Re.value,
        T
      );
      z !== null && (e && z.alternate !== null && Ko.delete(
        z.key === null ? ce : z.key
      ), le = o(z, le, ce), F === null ? A = z : F.sibling = z, F = z);
    }
    return e && Ko.forEach((z) => t(p, z)), A;
  }
  function E(p, C, m, T) {
    if (C !== null && C.tag === q) {
      n(p, C.sibling);
      const v = i(C, m);
      return v.return = p, v;
    }
    n(p, C);
    const _ = oa(
      m,
      p.mode,
      T
    );
    return _.return = p, _;
  }
  function S(p, C, m, T) {
    const _ = m.key;
    let v = C;
    for (; v !== null; ) {
      if (v.key === _)
        if (v.tag === Cn ? m.type === Ue : v.elementType === m.type) {
          n(p, v.sibling);
          const A = i(
            v,
            m.type === Ue ? m.props.children : m.props
          );
          return A.ref = Xn(p, v, m), A.return = p, A;
        } else {
          n(p, v);
          break;
        }
      else
        t(p, v);
      v = v.sibling;
    }
    if (m.type === Ue) {
      const A = rt(
        m.props.children,
        p.mode,
        T,
        m.key
      );
      return A.return = p, A;
    } else {
      const A = ia(
        m,
        p.mode,
        T
      );
      return A.ref = Xn(p, C, m), A.return = p, A;
    }
  }
  function k(p, C, m, T) {
    const _ = m.key;
    let v = C;
    for (; v !== null; ) {
      if (v.key === _)
        if (v.tag === W && v.stateNode.containerInfo === m.containerInfo && v.stateNode.implementation === m.implementation) {
          n(p, v.sibling);
          const F = i(
            v,
            m.children || []
          );
          return F.return = p, F;
        } else {
          n(p, v);
          break;
        }
      else
        t(p, v);
      v = v.sibling;
    }
    const A = aa(
      m,
      p.mode,
      T
    );
    return A.return = p, A;
  }
  function U(p, C, m, T) {
    const _ = typeof m == "object" && m !== null && m.type === Ue && m.key === null;
    _ && (m = m.props.children);
    const v = typeof m == "object" && m !== null;
    if (v)
      switch (m.$$typeof) {
        case vt:
          return a(
            S(
              p,
              C,
              m,
              T
            )
          );
        case Qt:
          return a(
            k(
              p,
              C,
              m,
              T
            )
          );
      }
    if (typeof m == "string" || typeof m == "number")
      return a(
        E(
          p,
          C,
          "" + m,
          T
        )
      );
    if (ui(m))
      return h(
        p,
        C,
        m,
        T
      );
    if (Yt(m))
      return y(
        p,
        C,
        m,
        T
      );
    if (v && ri(p, m), typeof m > "u" && !_)
      switch (p.tag) {
        case w:
        // Intentionally fall through to the next case, which handles both
        // functions and classes
        // eslint-disable-next-lined no-fallthrough
        case $e: {
          const A = p.type;
          O(
            !1,
            "%s(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.",
            A.displayName || A.name || "Component"
          );
        }
      }
    return n(p, C);
  }
  return U;
}
const kn = ip(!0), op = ip(!1);
function lb(e, t) {
  if (O(
    e === null || t.child === e.child,
    "Resuming work not yet implemented."
  ), t.child === null)
    return;
  let n = t.child, l = Ht(
    n,
    n.pendingProps,
    n.expirationTime
  );
  for (t.child = l, l.return = t; n.sibling !== null; )
    n = n.sibling, l = l.sibling = Ht(
      n,
      n.pendingProps,
      n.expirationTime
    ), l.return = t;
  l.sibling = null;
}
const jl = {};
let pt = Hn(
  jl
), Ul = Hn(
  jl
), zo = Hn(
  jl
);
function eo(e) {
  return O(
    e !== jl,
    "Expected host context to exist. This error is likely caused by a bug in React. Please file an issue."
  ), e;
}
function ru() {
  return eo(zo.current);
}
function Zc(e, t) {
  ie(zo, t), ie(Ul, e), ie(pt, jl);
  const n = tT(t);
  ae(pt), ie(pt, n);
}
function Pn(e) {
  ae(pt), ae(Ul), ae(zo);
}
function $a() {
  return eo(pt.current);
}
function ap(e) {
  eo(
    zo.current
  );
  const t = eo(pt.current), n = nT(t, e.type);
  t !== n && (ie(Ul, e), ie(pt, n));
}
function Jc(e) {
  Ul.current === e && (ae(pt), ae(Ul));
}
const ib = Wt.ReactCurrentOwner;
let Dt = !1;
function Ee(e, t, n, l) {
  e === null ? t.child = op(
    t,
    null,
    n,
    l
  ) : t.child = kn(
    t,
    e.child,
    n,
    l
  );
}
function ob(e, t, n, l) {
  t.child = kn(
    t,
    e.child,
    null,
    l
  ), t.child = kn(
    t,
    null,
    n,
    l
  );
}
function cp(e, t, n, l, i) {
  const o = n.render, a = t.ref;
  let c;
  return zn(t, i), c = as(
    e,
    t,
    o,
    l,
    a,
    i
  ), e !== null && !Dt ? (hp(e, t, i), ot(
    e,
    t,
    i
  )) : (t.effectTag |= bt, Ee(
    e,
    t,
    c,
    i
  ), t.child);
}
function sp(e, t, n, l, i, o) {
  if (e === null) {
    let s = n.type;
    if (FT(s) && n.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
    n.defaultProps === void 0)
      return t.tag = It, t.type = s, up(
        e,
        t,
        s,
        l,
        i,
        o
      );
    let r = Qd(
      n.type,
      null,
      l,
      null,
      t.mode,
      o
    );
    return r.ref = t.ref, r.return = t, t.child = r, r;
  }
  let a = e.child;
  if (i < o) {
    const s = a.memoizedProps;
    let r = n.compare;
    if (r = r !== null ? r : Ol, r(s, l) && e.ref === t.ref)
      return ot(
        e,
        t,
        o
      );
  }
  t.effectTag |= bt;
  let c = Ht(
    a,
    l
  );
  return c.ref = t.ref, c.return = t, t.child = c, c;
}
function up(e, t, n, l, i, o) {
  if (e !== null) {
    const a = e.memoizedProps;
    if (Ol(a, l) && e.ref === t.ref && (Dt = !1, i < o))
      return ot(
        e,
        t,
        o
      );
  }
  return es(
    e,
    t,
    n,
    l,
    o
  );
}
function ab(e, t, n) {
  const l = t.pendingProps;
  return Ee(
    e,
    t,
    l,
    n
  ), t.child;
}
function cb(e, t, n) {
  const l = t.pendingProps.children;
  return Ee(
    e,
    t,
    l,
    n
  ), t.child;
}
function sb(e, t, n) {
  const i = t.pendingProps.children;
  return Ee(
    e,
    t,
    i,
    n
  ), t.child;
}
function rp(e, t) {
  const n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.effectTag |= xo);
}
function es(e, t, n, l, i) {
  const o = $n(t, n, !0), a = wn(t, o);
  let c;
  return zn(t, i), c = as(
    e,
    t,
    n,
    l,
    a,
    i
  ), e !== null && !Dt ? (hp(e, t, i), ot(
    e,
    t,
    i
  )) : (t.effectTag |= bt, Ee(
    e,
    t,
    c,
    i
  ), t.child);
}
function fp(e, t, n, l, i) {
  let o;
  Fe(n) ? (o = !0, Fo(t)) : o = !1, zn(t, i);
  const a = t.stateNode;
  let c;
  return a === null ? (e !== null && (e.alternate = null, t.alternate = null, t.effectTag |= X), np(
    t,
    n,
    l
  ), Gc(
    t,
    n,
    l,
    i
  ), c = !0) : e === null ? c = tb(
    t,
    n,
    l,
    i
  ) : c = nb(
    e,
    t,
    n,
    l,
    i
  ), ts(
    e,
    t,
    n,
    c,
    o,
    i
  );
}
function ts(e, t, n, l, i, o) {
  rp(e, t);
  const a = (t.effectTag & xe) !== Te;
  if (!l && !a)
    return i && lu(t, n, !1), ot(
      e,
      t,
      o
    );
  const c = t.stateNode;
  ib.current = t;
  let s;
  return a && typeof n.getDerivedStateFromError != "function" ? s = null : s = c.render(), t.effectTag |= bt, e !== null && a ? ob(
    e,
    t,
    s,
    o
  ) : Ee(
    e,
    t,
    s,
    o
  ), t.memoizedState = c.state, i && lu(t, n, !0), t.child;
}
function dp(e) {
  const t = e.stateNode;
  t.pendingContext ? nu(
    e,
    t.pendingContext,
    t.pendingContext !== t.context
  ) : t.context && nu(e, t.context, !1), Zc(e, t.containerInfo);
}
function ub(e, t, n) {
  dp(t);
  const l = t.updateQueue;
  O(
    l !== null,
    "If the root does not have an updateQueue, we should have already bailed out. This error is likely caused by a bug in React. Please file an issue."
  );
  const i = t.pendingProps, o = t.memoizedState, a = o !== null ? o.element : null;
  Rl(
    t,
    l,
    i,
    null,
    n
  );
  const s = t.memoizedState.element;
  return s === a ? ot(
    e,
    t,
    n
  ) : (t.stateNode, Ee(
    e,
    t,
    s,
    n
  ), t.child);
}
function rb(e, t, n) {
  ap(t);
  const l = t.type, i = t.pendingProps, o = e !== null ? e.memoizedProps : null;
  let a = i.children;
  return eu(l, i) ? a = null : o !== null && eu(l, o) && (t.effectTag |= Hi), rp(e, t), n !== Dn && t.mode & Ze && uT(l, i) ? (t.expirationTime = t.childExpirationTime = Dn, null) : (Ee(
    e,
    t,
    a,
    n
  ), t.child);
}
function fb(e, t) {
  return null;
}
function db(e, t, n, l, i) {
  e !== null && (e.alternate = null, t.alternate = null, t.effectTag |= X);
  const o = t.pendingProps;
  let a = JT(n);
  t.type = a;
  const c = t.tag = HT(a), s = ve(a, o);
  let r;
  switch (c) {
    case $e: {
      r = es(
        null,
        t,
        a,
        s,
        i
      );
      break;
    }
    case w: {
      r = fp(
        null,
        t,
        a,
        s,
        i
      );
      break;
    }
    case ct: {
      r = cp(
        null,
        t,
        a,
        s,
        i
      );
      break;
    }
    case Bt: {
      r = sp(
        null,
        t,
        a,
        ve(a.type, s),
        // The inner type can have defaults too
        l,
        i
      );
      break;
    }
    default:
      O(
        !1,
        "Element type is invalid. Received a promise that resolves to: %s. Lazy element type must resolve to a class or function.%s",
        a,
        ""
      );
  }
  return r;
}
function pb(e, t, n, l, i) {
  e !== null && (e.alternate = null, t.alternate = null, t.effectTag |= X), t.tag = w;
  let o;
  return Fe(n) ? (o = !0, Fo(t)) : o = !1, zn(t, i), np(
    t,
    n,
    l
  ), Gc(
    t,
    n,
    l,
    i
  ), ts(
    null,
    t,
    n,
    !0,
    o,
    i
  );
}
function hb(e, t, n, l) {
  e !== null && (e.alternate = null, t.alternate = null, t.effectTag |= X);
  const i = t.pendingProps, o = $n(t, n, !1), a = wn(t, o);
  zn(t, l);
  let c;
  if (c = as(
    null,
    t,
    n,
    i,
    a,
    l
  ), t.effectTag |= bt, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0) {
    t.tag = w, Wa();
    let s = !1;
    Fe(n) ? (s = !0, Fo(t)) : s = !1, t.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null;
    const r = n.getDerivedStateFromProps;
    return typeof r == "function" && wo(
      t,
      n,
      r,
      i
    ), tp(t, c), Gc(t, n, i, l), ts(
      null,
      t,
      n,
      !0,
      s,
      l
    );
  } else
    return t.tag = $e, Ee(null, t, c, l), t.child;
}
function fu(e, t, n) {
  const l = t.mode, i = t.pendingProps;
  let o = t.memoizedState, a;
  (t.effectTag & xe) === Te ? (o = null, a = !1) : (o = {
    timedOutAt: o !== null ? o.timedOutAt : x
  }, a = !0, t.effectTag &= ~xe);
  let c, s;
  if (e === null)
    if (a) {
      const r = i.fallback, u = rt(
        null,
        l,
        x,
        null
      );
      if ((t.mode & Ze) === cn) {
        const g = t.memoizedState !== null ? t.child.child : t.child;
        u.child = g;
      }
      const f = rt(
        r,
        l,
        n,
        null
      );
      u.sibling = f, c = u, s = f, c.return = s.return = t;
    } else {
      const r = i.children;
      c = s = op(
        t,
        null,
        r,
        n
      );
    }
  else {
    if (e.memoizedState !== null) {
      const f = e.child, d = f.sibling;
      if (a) {
        const g = i.fallback, h = Ht(
          f,
          f.pendingProps
        );
        if ((t.mode & Ze) === cn) {
          const S = t.memoizedState !== null ? t.child.child : t.child;
          S !== f.child && (h.child = S);
        }
        const y = h.sibling = Ht(
          d,
          g,
          d.expirationTime
        );
        c = h, h.childExpirationTime = x, s = y, c.return = s.return = t;
      } else {
        const g = i.children, h = f.child;
        c = s = kn(
          t,
          h,
          g,
          n
        );
      }
    } else {
      const f = e.child;
      if (a) {
        const d = i.fallback, g = rt(
          // It shouldn't matter what the pending props are because we aren't
          // going to render this fragment.
          null,
          l,
          x,
          null
        );
        if (g.child = f, (t.mode & Ze) === cn) {
          const E = t.memoizedState !== null ? t.child.child : t.child;
          g.child = E;
        }
        const h = g.sibling = rt(
          d,
          l,
          n,
          null
        );
        h.effectTag |= X, c = g, g.childExpirationTime = x, s = h, c.return = s.return = t;
      } else {
        const d = i.children;
        s = c = kn(
          t,
          f,
          d,
          n
        );
      }
    }
    t.stateNode = e.stateNode;
  }
  return t.memoizedState = o, t.child = c, s;
}
function mb(e, t, n) {
  Zc(t, t.stateNode.containerInfo);
  const l = t.pendingProps;
  return e === null ? t.child = kn(
    t,
    null,
    l,
    n
  ) : Ee(
    e,
    t,
    l,
    n
  ), t.child;
}
function yb(e, t, n) {
  const i = t.type._context, o = t.pendingProps, a = t.memoizedProps, c = o.value;
  if (pp(t, c), a !== null) {
    const r = a.value, u = Tb(i, c, r);
    if (u === 0) {
      if (a.children === o.children && !Lo())
        return ot(
          e,
          t,
          n
        );
    } else
      Eb(
        t,
        i,
        u,
        n
      );
  }
  const s = o.children;
  return Ee(e, t, s, n), t.child;
}
function gb(e, t, n) {
  let l = t.type;
  const i = t.pendingProps, o = i.children;
  zn(t, n);
  const a = He(l, i.unstable_observedBits);
  let c;
  return c = o(a), t.effectTag |= bt, Ee(e, t, c, n), t.child;
}
function wa() {
  Dt = !0;
}
function ot(e, t, n) {
  return e !== null && (t.contextDependencies = e.contextDependencies), t.childExpirationTime < n ? null : (lb(e, t), t.child);
}
function Cb(e, t, n) {
  const l = t.expirationTime;
  if (e !== null) {
    const i = e.memoizedProps, o = t.pendingProps;
    if (i !== o || Lo())
      Dt = !0;
    else if (l < n) {
      switch (Dt = !1, t.tag) {
        case B:
          dp(t);
          break;
        case $:
          ap(t);
          break;
        case w: {
          const a = t.type;
          Fe(a) && Fo(t);
          break;
        }
        case W:
          Zc(
            t,
            t.stateNode.containerInfo
          );
          break;
        case yt: {
          const a = t.memoizedProps.value;
          pp(t, a);
          break;
        }
        case Tn:
          break;
        case Le: {
          if (t.memoizedState !== null) {
            const r = t.child.childExpirationTime;
            if (r !== x && r >= n)
              return fu(
                e,
                t,
                n
              );
            {
              const u = ot(
                e,
                t,
                n
              );
              return u !== null ? u.sibling : null;
            }
          }
          break;
        }
      }
      return ot(
        e,
        t,
        n
      );
    }
  } else
    Dt = !1;
  switch (t.expirationTime = x, t.tag) {
    case So: {
      const i = t.elementType;
      return hb(
        e,
        t,
        i,
        n
      );
    }
    case Sc: {
      const i = t.elementType;
      return db(
        e,
        t,
        i,
        l,
        n
      );
    }
    case $e: {
      const i = t.type, o = t.pendingProps, a = t.elementType === i ? o : ve(i, o);
      return es(
        e,
        t,
        i,
        a,
        n
      );
    }
    case w: {
      const i = t.type, o = t.pendingProps, a = t.elementType === i ? o : ve(i, o);
      return fp(
        e,
        t,
        i,
        a,
        n
      );
    }
    case B:
      return ub(e, t, n);
    case $:
      return rb(e, t, n);
    case q:
      return fb();
    case Le:
      return fu(
        e,
        t,
        n
      );
    case W:
      return mb(
        e,
        t,
        n
      );
    case ct: {
      const i = t.type, o = t.pendingProps, a = t.elementType === i ? o : ve(i, o);
      return cp(
        e,
        t,
        i,
        a,
        n
      );
    }
    case Cn:
      return ab(e, t, n);
    case Ec:
      return cb(e, t, n);
    case Tn:
      return sb(e, t, n);
    case yt:
      return yb(
        e,
        t,
        n
      );
    case vo:
      return gb(
        e,
        t,
        n
      );
    case Bt: {
      const i = t.type, o = t.pendingProps;
      let a = ve(i, o);
      return a = ve(i.type, a), sp(
        e,
        t,
        i,
        a,
        l,
        n
      );
    }
    case It:
      return up(
        e,
        t,
        t.type,
        t.pendingProps,
        l,
        n
      );
    case Fn: {
      const i = t.type, o = t.pendingProps, a = t.elementType === i ? o : ve(i, o);
      return pb(
        e,
        t,
        i,
        a,
        n
      );
    }
  }
  O(
    !1,
    "Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue."
  );
}
const za = Hn(null);
let to = null, Zt = null, no = null;
function du() {
  to = null, Zt = null, no = null;
}
function pp(e, t) {
  const n = e.type._context;
  ie(za, n._currentValue), n._currentValue = t;
}
function ns(e) {
  const t = za.current;
  ae(za);
  const n = e.type._context;
  n._currentValue = t;
}
function Tb(e, t, n) {
  return $t(n, t) ? 0 : (typeof e._calculateChangedBits == "function" ? e._calculateChangedBits(n, t) : An) | 0;
}
function bb(e, t) {
  let n = e;
  for (; n !== null; ) {
    let l = n.alternate;
    if (n.childExpirationTime < t)
      n.childExpirationTime = t, l !== null && l.childExpirationTime < t && (l.childExpirationTime = t);
    else if (l !== null && l.childExpirationTime < t)
      l.childExpirationTime = t;
    else
      break;
    n = n.return;
  }
}
function Eb(e, t, n, l) {
  let i = e.child;
  for (i !== null && (i.return = e); i !== null; ) {
    let o;
    const a = i.contextDependencies;
    if (a !== null) {
      o = i.child;
      let c = a.first;
      for (; c !== null; ) {
        if (c.context === t && (c.observedBits & n) !== 0) {
          if (i.tag === w) {
            const r = dt(l);
            r.tag = Ho, Je(i, r);
          }
          i.expirationTime < l && (i.expirationTime = l);
          let s = i.alternate;
          s !== null && s.expirationTime < l && (s.expirationTime = l), bb(i.return, l), a.expirationTime < l && (a.expirationTime = l);
          break;
        }
        c = c.next;
      }
    } else i.tag === yt ? o = i.type === e.type ? null : i.child : o = i.child;
    if (o !== null)
      o.return = i;
    else
      for (o = i; o !== null; ) {
        if (o === e) {
          o = null;
          break;
        }
        let c = o.sibling;
        if (c !== null) {
          c.return = o.return, o = c;
          break;
        }
        o = o.return;
      }
    i = o;
  }
}
function zn(e, t) {
  to = e, Zt = null, no = null;
  const n = e.contextDependencies;
  n !== null && n.expirationTime >= t && wa(), e.contextDependencies = null;
}
function He(e, t) {
  if (no !== e) {
    if (!(t === !1 || t === 0)) {
      let n;
      typeof t != "number" || t === An ? (no = e, n = An) : n = t;
      let l = {
        context: e,
        observedBits: n,
        next: null
      };
      Zt === null ? (O(
        to !== null,
        "Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."
      ), Zt = l, to.contextDependencies = {
        first: l,
        expirationTime: x
      }) : Zt = Zt.next = l;
    }
  }
  return e._currentValue;
}
const Mn = (
  /*             */
  0
), Sb = (
  /*      */
  2
), Kl = (
  /*      */
  4
), vb = (
  /*        */
  8
), xb = (
  /*        */
  16
), Yl = (
  /*          */
  32
), ls = (
  /*         */
  64
), is = (
  /*       */
  128
), { ReactCurrentDispatcher: _i } = Wt;
let Al = x, ht = null, V = null, De = null, sn = null, J = null, un = null, Dl = x, Ae = null, kl = 0, dl = !1, Ye = null, lo = 0;
function Oe() {
  O(
    !1,
    `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.`
  );
}
function os(e, t) {
  if (t === null)
    return !1;
  for (let n = 0; n < t.length && n < e.length; n++)
    if (!$t(e[n], t[n]))
      return !1;
  return !0;
}
function as(e, t, n, l, i, o) {
  Al = o, ht = t, De = e !== null ? e.memoizedState : null, _i.current = De === null ? Bb : pu;
  let a = n(l, i);
  if (dl) {
    do
      dl = !1, lo += 1, De = e !== null ? e.memoizedState : null, un = sn, V = null, J = null, Ae = null, _i.current = pu, a = n(l, i);
    while (dl);
    Ye = null, lo = 0;
  }
  _i.current = us;
  const c = ht;
  c.memoizedState = sn, c.expirationTime = Dl, c.updateQueue = Ae, c.effectTag |= kl;
  const s = V !== null && V.next !== null;
  return Al = x, ht = null, V = null, De = null, sn = null, J = null, un = null, Dl = x, Ae = null, kl = 0, O(
    !s,
    "Rendered fewer hooks than expected. This may be caused by an accidental early return statement."
  ), a;
}
function hp(e, t, n) {
  t.updateQueue = e.updateQueue, t.effectTag &= -517, e.expirationTime <= n && (e.expirationTime = x);
}
function Wa() {
  _i.current = us, Al = x, ht = null, V = null, De = null, sn = null, J = null, un = null, Dl = x, Ae = null, kl = 0, dl = !1, Ye = null, lo = 0;
}
function Wn() {
  const e = {
    memoizedState: null,
    baseState: null,
    queue: null,
    baseUpdate: null,
    next: null
  };
  return J === null ? sn = J = e : J = J.next = e, J;
}
function Ql() {
  if (un !== null)
    J = un, un = J.next, V = De, De = V !== null ? V.next : null;
  else {
    O(
      De !== null,
      "Rendered more hooks than during the previous render."
    ), V = De;
    const e = {
      memoizedState: V.memoizedState,
      baseState: V.baseState,
      queue: V.queue,
      baseUpdate: V.baseUpdate,
      next: null
    };
    J === null ? J = sn = e : J = J.next = e, De = V.next;
  }
  return J;
}
function _b() {
  return {
    lastEffect: null
  };
}
function mp(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Rb(e, t, n) {
  const l = Wn();
  let i;
  n !== void 0 ? i = n(t) : i = t, l.memoizedState = l.baseState = i;
  const o = l.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: e,
    lastRenderedState: i
  }, a = o.dispatch = Tp.bind(
    null,
    // Flow doesn't know this is non-null, but we do.
    ht,
    o
  );
  return [l.memoizedState, a];
}
function yp(e, t, n) {
  const l = Ql(), i = l.queue;
  if (O(
    i !== null,
    "Should have a queue. This is likely a bug in React. Please file an issue."
  ), i.lastRenderedReducer = e, lo > 0) {
    const u = i.dispatch;
    if (Ye !== null) {
      const f = Ye.get(i);
      if (f !== void 0) {
        Ye.delete(i);
        let d = l.memoizedState, g = f;
        do {
          const h = g.action;
          d = e(d, h), g = g.next;
        } while (g !== null);
        return $t(d, l.memoizedState) || wa(), l.memoizedState = d, l.baseUpdate === i.last && (l.baseState = d), i.lastRenderedState = d, [d, u];
      }
    }
    return [l.memoizedState, u];
  }
  const o = i.last, a = l.baseUpdate, c = l.baseState;
  let s;
  if (a !== null ? (o !== null && (o.next = null), s = a.next) : s = o !== null ? o.next : null, s !== null) {
    let u = c, f = null, d = null, g = a, h = s, y = !1;
    do {
      const E = h.expirationTime;
      if (E < Al)
        y || (y = !0, d = g, f = u), E > Dl && (Dl = E);
      else if (h.eagerReducer === e)
        u = h.eagerState;
      else {
        const S = h.action;
        u = e(u, S);
      }
      g = h, h = h.next;
    } while (h !== null && h !== s);
    y || (d = g, f = u), $t(u, l.memoizedState) || wa(), l.memoizedState = u, l.baseUpdate = d, l.baseState = f, i.lastRenderedState = u;
  }
  const r = i.dispatch;
  return [l.memoizedState, r];
}
function Ob(e) {
  const t = Wn();
  typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
  const n = t.queue = {
    last: null,
    dispatch: null,
    lastRenderedReducer: mp,
    lastRenderedState: e
  }, l = n.dispatch = Tp.bind(
    null,
    // Flow doesn't know this is non-null, but we do.
    ht,
    n
  );
  return [t.memoizedState, l];
}
function Ub(e) {
  return yp(mp);
}
function Ba(e, t, n, l) {
  const i = {
    tag: e,
    create: t,
    destroy: n,
    deps: l,
    // Circular
    next: null
  };
  if (Ae === null)
    Ae = _b(), Ae.lastEffect = i.next = i;
  else {
    const o = Ae.lastEffect;
    if (o === null)
      Ae.lastEffect = i.next = i;
    else {
      const a = o.next;
      o.next = i, i.next = a, Ae.lastEffect = i;
    }
  }
  return i;
}
function Ab(e) {
  const t = Wn(), n = { current: e };
  return t.memoizedState = n, n;
}
function Db(e) {
  return Ql().memoizedState;
}
function cs(e, t, n, l) {
  const i = Wn(), o = l === void 0 ? null : l;
  kl |= e, i.memoizedState = Ba(t, n, void 0, o);
}
function ss(e, t, n, l) {
  const i = Ql(), o = l === void 0 ? null : l;
  let a;
  if (V !== null) {
    const c = V.memoizedState;
    if (a = c.destroy, o !== null) {
      const s = c.deps;
      if (os(o, s)) {
        Ba(Mn, n, a, o);
        return;
      }
    }
  }
  kl |= e, i.memoizedState = Ba(t, n, a, o);
}
function kb(e, t) {
  return cs(
    K | _o,
    is | ls,
    e,
    t
  );
}
function Pb(e, t) {
  return ss(
    K | _o,
    is | ls,
    e,
    t
  );
}
function Mb(e, t) {
  return cs(
    K,
    Kl | Yl,
    e,
    t
  );
}
function Nb(e, t) {
  return ss(
    K,
    Kl | Yl,
    e,
    t
  );
}
function gp(e, t) {
  if (typeof t == "function") {
    const n = t, l = e();
    return n(l), () => {
      n(null);
    };
  } else if (t != null) {
    const n = t, l = e();
    return n.current = l, () => {
      n.current = null;
    };
  }
}
function Lb(e, t, n) {
  const l = n != null ? n.concat([e]) : null;
  return cs(
    K,
    Kl | Yl,
    gp.bind(null, t, e),
    l
  );
}
function Fb(e, t, n) {
  const l = n != null ? n.concat([e]) : null;
  return ss(
    K,
    Kl | Yl,
    gp.bind(null, t, e),
    l
  );
}
function Cp(e, t) {
}
const Hb = Cp;
function $b(e, t) {
  const n = Wn(), l = t === void 0 ? null : t;
  return n.memoizedState = [e, l], e;
}
function wb(e, t) {
  const n = Ql(), l = t === void 0 ? null : t, i = n.memoizedState;
  if (i !== null && l !== null) {
    const o = i[1];
    if (os(l, o))
      return i[0];
  }
  return n.memoizedState = [e, l], e;
}
function zb(e, t) {
  const n = Wn(), l = t === void 0 ? null : t, i = e();
  return n.memoizedState = [i, l], i;
}
function Wb(e, t) {
  const n = Ql(), l = t === void 0 ? null : t, i = n.memoizedState;
  if (i !== null && l !== null) {
    const a = i[1];
    if (os(l, a))
      return i[0];
  }
  const o = e();
  return n.memoizedState = [o, l], o;
}
function Tp(e, t, n) {
  const l = e.alternate;
  if (e === ht || l !== null && l === ht) {
    dl = !0;
    const i = {
      expirationTime: Al,
      action: n,
      eagerReducer: null,
      eagerState: null,
      next: null
    };
    Ye === null && (Ye = /* @__PURE__ */ new Map());
    const o = Ye.get(t);
    if (o === void 0)
      Ye.set(t, i);
    else {
      let a = o;
      for (; a.next !== null; )
        a = a.next;
      a.next = i;
    }
  } else {
    fn();
    const i = tt(), o = dn(i, e), a = {
      expirationTime: o,
      action: n,
      eagerReducer: null,
      eagerState: null,
      next: null
    }, c = t.last;
    if (c === null)
      a.next = a;
    else {
      const s = c.next;
      s !== null && (a.next = s), c.next = a;
    }
    if (t.last = a, e.expirationTime === x && (l === null || l.expirationTime === x)) {
      const s = t.lastRenderedReducer;
      if (s !== null)
        try {
          const r = t.lastRenderedState, u = s(r, n);
          if (a.eagerReducer = s, a.eagerState = u, $t(u, r))
            return;
        } catch {
        } finally {
        }
    }
    mt(e, o);
  }
}
const us = {
  readContext: He,
  useCallback: Oe,
  useContext: Oe,
  useEffect: Oe,
  useImperativeHandle: Oe,
  useLayoutEffect: Oe,
  useMemo: Oe,
  useReducer: Oe,
  useRef: Oe,
  useState: Oe,
  useDebugValue: Oe
}, Bb = {
  readContext: He,
  useCallback: $b,
  useContext: He,
  useEffect: kb,
  useImperativeHandle: Lb,
  useLayoutEffect: Mb,
  useMemo: zb,
  useReducer: Rb,
  useRef: Ab,
  useState: Ob,
  useDebugValue: Cp
}, pu = {
  readContext: He,
  useCallback: wb,
  useContext: He,
  useEffect: Pb,
  useImperativeHandle: Fb,
  useLayoutEffect: Nb,
  useMemo: Wb,
  useReducer: yp,
  useRef: Db,
  useState: Ub,
  useDebugValue: Hb
};
function Ia(e) {
  e.effectTag |= K;
}
function hu(e) {
  e.effectTag |= xo;
}
let bp, ja, Ep, Sp;
bp = function(e, t, n, l) {
  let i = t.child;
  for (; i !== null; ) {
    if (i.tag === $ || i.tag === q)
      aT(e, i.stateNode);
    else if (i.tag !== W) {
      if (i.child !== null) {
        i.child.return = i, i = i.child;
        continue;
      }
    }
    if (i === t)
      return;
    for (; i.sibling === null; ) {
      if (i.return === null || i.return === t)
        return;
      i = i.return;
    }
    i.sibling.return = i.return, i = i.sibling;
  }
}, ja = function(e) {
}, Ep = function(e, t, n, l, i) {
  const o = e.memoizedProps;
  if (o === l)
    return;
  const a = t.stateNode;
  $a();
  const c = sT(
    a,
    n,
    o,
    l,
    i
  );
  t.updateQueue = c, c && Ia(t);
}, Sp = function(e, t, n, l) {
  n !== l && Ia(t);
};
function Ib(e, t, n) {
  const l = t.pendingProps;
  switch (t.tag) {
    case So:
      break;
    case Sc:
      break;
    case It:
    case $e:
      break;
    case w: {
      const i = t.type;
      Fe(i) && Vi();
      break;
    }
    case B: {
      Pn(), Yc();
      const i = t.stateNode;
      i.pendingContext && (i.context = i.pendingContext, i.pendingContext = null), (e === null || e.child === null) && (t.effectTag &= ~X), ja(t);
      break;
    }
    case $: {
      Jc(t);
      const i = ru(), o = t.type;
      if (e !== null && t.stateNode != null)
        Ep(
          e,
          t,
          o,
          l,
          i
        ), e.ref !== t.ref && hu(t);
      else {
        if (!l) {
          O(
            t.stateNode !== null,
            "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
          );
          break;
        }
        const a = $a();
        let c = oT(
          o,
          l,
          i,
          a,
          t
        );
        bp(c, t, !1, !1), cT(
          c,
          o,
          l,
          i
        ) && Ia(t), t.stateNode = c, t.ref !== null && hu(t);
      }
      break;
    }
    case q: {
      let i = l;
      if (e && t.stateNode != null) {
        const o = e.memoizedProps;
        Sp(e, t, o, i);
      } else {
        typeof i != "string" && O(
          t.stateNode !== null,
          "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
        );
        const o = ru(), a = $a();
        t.stateNode = rT(
          i,
          o,
          a,
          t
        );
      }
      break;
    }
    case ct:
      break;
    case Le: {
      const i = t.memoizedState;
      if ((t.effectTag & xe) !== Te)
        return t.expirationTime = n, t;
      const o = i !== null, a = e !== null && e.memoizedState !== null;
      if (e !== null && !o && a) {
        const c = e.child.sibling;
        if (c !== null) {
          const s = t.firstEffect;
          s !== null ? (t.firstEffect = c, c.nextEffect = s) : (t.firstEffect = t.lastEffect = c, c.nextEffect = null), c.effectTag = Fi;
        }
      }
      (o || a) && (t.effectTag |= K);
      break;
    }
    case Cn:
      break;
    case Ec:
      break;
    case Tn:
      break;
    case W:
      Pn(), ja(t);
      break;
    case yt:
      ns(t);
      break;
    case vo:
      break;
    case Bt:
      break;
    case Fn: {
      const i = t.type;
      Fe(i) && Vi();
      break;
    }
    case vc:
      break;
    default:
      O(
        !1,
        "Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue."
      );
  }
  return null;
}
function jb(e) {
  return e.memoizedProps.fallback === void 0 ? !1 : e.memoizedState === null;
}
function Kb(e) {
  const t = e.error;
  console.error(t);
}
const Yb = typeof WeakSet == "function" ? WeakSet : Set;
function vp(e, t) {
  const n = t.source;
  let l = t.stack;
  l === null && n !== null && (l = qc(n));
  const i = {
    componentName: n !== null ? Ct(n.type) : null,
    componentStack: l !== null ? l : "",
    error: t.value,
    errorBoundary: null,
    errorBoundaryName: null,
    errorBoundaryFound: !1,
    willRetry: !1
  };
  e !== null && e.tag === w && (i.errorBoundary = e.stateNode, i.errorBoundaryName = Ct(e.type), i.errorBoundaryFound = !0, i.willRetry = !0);
  try {
    Kb(i);
  } catch (o) {
    setTimeout(() => {
      throw o;
    });
  }
}
const Qb = function(e, t) {
  t.props = e.memoizedProps, t.state = e.memoizedState, t.componentWillUnmount();
};
function Xb(e, t) {
  try {
    Qb(e, t);
  } catch (n) {
    kt(e, n);
  }
}
function mu(e) {
  const t = e.ref;
  if (t !== null)
    if (typeof t == "function")
      try {
        t(null);
      } catch (n) {
        kt(e, n);
      }
    else
      t.current = null;
}
function qb(e, t) {
  try {
    t();
  } catch (n) {
    kt(e, n);
  }
}
function Vb(e, t) {
  switch (t.tag) {
    case $e:
    case ct:
    case It: {
      Pl(Sb, Mn, t);
      return;
    }
    case w: {
      if (t.effectTag & ol && e !== null) {
        const n = e.memoizedProps, l = e.memoizedState, i = t.stateNode, o = i.getSnapshotBeforeUpdate(
          t.elementType === t.type ? n : ve(t.type, n),
          l
        );
        i.__reactInternalSnapshotBeforeUpdate = o;
      }
      return;
    }
    case B:
    case $:
    case q:
    case W:
    case Fn:
      return;
    default:
      O(
        !1,
        "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
      );
  }
}
function Pl(e, t, n) {
  const l = n.updateQueue;
  let i = l !== null ? l.lastEffect : null;
  if (i !== null) {
    const o = i.next;
    let a = o;
    do {
      if ((a.tag & e) !== Mn) {
        const c = a.destroy;
        a.destroy = void 0, c !== void 0 && c();
      }
      if ((a.tag & t) !== Mn) {
        const c = a.create;
        a.destroy = c();
      }
      a = a.next;
    } while (a !== o);
  }
}
function Gb(e) {
  Pl(is, Mn, e), Pl(Mn, ls, e);
}
function Zb(e, t, n, l) {
  switch (n.tag) {
    case $e:
    case ct:
    case It: {
      Pl(xb, Yl, n);
      break;
    }
    case w: {
      const i = n.stateNode;
      if (n.effectTag & K)
        if (t === null)
          i.componentDidMount();
        else {
          const a = n.elementType === n.type ? t.memoizedProps : ve(n.type, t.memoizedProps), c = t.memoizedState;
          i.componentDidUpdate(
            a,
            c,
            i.__reactInternalSnapshotBeforeUpdate
          );
        }
      const o = n.updateQueue;
      o !== null && su(
        n,
        o,
        i
      );
      return;
    }
    case B: {
      const i = n.updateQueue;
      if (i !== null) {
        let o = null;
        if (n.child !== null)
          switch (n.child.tag) {
            case $:
              o = n.child.stateNode;
              break;
            case w:
              o = n.child.stateNode;
              break;
          }
        su(
          n,
          i,
          o
        );
      }
      return;
    }
    case $: {
      n.stateNode, t === null && n.effectTag & K && (n.type, n.memoizedProps);
      return;
    }
    case q:
      return;
    case W:
      return;
    case Tn:
      return;
    case Le:
      break;
    case Fn:
      break;
    default:
      O(
        !1,
        "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
      );
  }
}
function Jb(e, t) {
  {
    let n = e;
    for (; ; ) {
      if (n.tag === $) {
        const l = n.stateNode;
        t ? ST(l) : xT(n.stateNode, n.memoizedProps);
      } else if (n.tag === q) {
        const l = n.stateNode;
        t ? vT(l) : _T(l, n.memoizedProps);
      } else if (n.tag === Le && n.memoizedState !== null) {
        const l = n.child.sibling;
        l.return = n, n = l;
        continue;
      } else if (n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === e)
        return;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === e)
          return;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
  }
}
function eE(e) {
  const t = e.ref;
  if (t !== null) {
    const n = e.stateNode;
    let l;
    switch (e.tag) {
      case $:
        l = n;
        break;
      default:
        l = n;
    }
    typeof t == "function" ? t(l) : t.current = l;
  }
}
function tE(e) {
  const t = e.ref;
  t !== null && (typeof t == "function" ? t(null) : t.current = null);
}
function xp(e) {
  switch (e.tag) {
    case $e:
    case ct:
    case Bt:
    case It: {
      const t = e.updateQueue;
      if (t !== null) {
        const n = t.lastEffect;
        if (n !== null) {
          const l = n.next;
          let i = l;
          do {
            const o = i.destroy;
            o !== void 0 && qb(e, o), i = i.next;
          } while (i !== l);
        }
      }
      break;
    }
    case w: {
      mu(e);
      const t = e.stateNode;
      typeof t.componentWillUnmount == "function" && Xb(e, t);
      return;
    }
    case $: {
      mu(e);
      return;
    }
    case W: {
      Rp(e);
      return;
    }
  }
}
function nE(e) {
  let t = e;
  for (; ; ) {
    if (xp(t), t.child !== null && // If we use mutation we drill down into portals using commitUnmount above.
    // If we don't use mutation we drill down into portals here instead.
    t.tag !== W) {
      t.child.return = t, t = t.child;
      continue;
    }
    if (t === e)
      return;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e)
        return;
      t = t.return;
    }
    t.sibling.return = t.return, t = t.sibling;
  }
}
function lE(e) {
  e.return = null, e.child = null, e.memoizedState = null, e.updateQueue = null;
  const t = e.alternate;
  t !== null && (t.return = null, t.child = null, t.memoizedState = null, t.updateQueue = null);
}
function iE(e) {
  let t = e.return;
  for (; t !== null; ) {
    if (_p(t))
      return t;
    t = t.return;
  }
  O(
    !1,
    "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue."
  );
}
function _p(e) {
  return e.tag === $ || e.tag === B || e.tag === W;
}
function oE(e) {
  let t = e;
  e: for (; ; ) {
    for (; t.sibling === null; ) {
      if (t.return === null || _p(t.return))
        return null;
      t = t.return;
    }
    for (t.sibling.return = t.return, t = t.sibling; t.tag !== $ && t.tag !== q && t.tag !== vc; ) {
      if (t.effectTag & X || t.child === null || t.tag === W)
        continue e;
      t.child.return = t, t = t.child;
    }
    if (!(t.effectTag & X))
      return t.stateNode;
  }
}
function yu(e) {
  const t = iE(e);
  let n, l;
  switch (t.tag) {
    case $:
      n = t.stateNode, l = !1;
      break;
    case B:
      n = t.stateNode.containerInfo, l = !0;
      break;
    case W:
      n = t.stateNode.containerInfo, l = !0;
      break;
    default:
      O(
        !1,
        "Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue."
      );
  }
  t.effectTag & Hi && (zd(n), t.effectTag &= ~Hi);
  const i = oE(e);
  let o = e;
  for (; ; ) {
    if (o.tag === $ || o.tag === q)
      i ? l ? TT(n, o.stateNode, i) : CT(n, o.stateNode, i) : l ? gT(n, o.stateNode) : yT(n, o.stateNode);
    else if (o.tag !== W) {
      if (o.child !== null) {
        o.child.return = o, o = o.child;
        continue;
      }
    }
    if (o === e)
      return;
    for (; o.sibling === null; ) {
      if (o.return === null || o.return === e)
        return;
      o = o.return;
    }
    o.sibling.return = o.return, o = o.sibling;
  }
}
function Rp(e) {
  let t = e, n = !1, l, i;
  for (; ; ) {
    if (!n) {
      let o = t.return;
      e: for (; ; ) {
        switch (O(
          o !== null,
          "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue."
        ), o.tag) {
          case $:
            l = o.stateNode, i = !1;
            break e;
          case B:
            l = o.stateNode.containerInfo, i = !0;
            break e;
          case W:
            l = o.stateNode.containerInfo, i = !0;
            break e;
        }
        o = o.return;
      }
      n = !0;
    }
    if (t.tag === $ || t.tag === q)
      nE(t), i ? ET(
        l,
        t.stateNode
      ) : bT(
        l,
        t.stateNode
      );
    else if (t.tag === W) {
      if (t.child !== null) {
        l = t.stateNode.containerInfo, i = !0, t.child.return = t, t = t.child;
        continue;
      }
    } else if (xp(t), t.child !== null) {
      t.child.return = t, t = t.child;
      continue;
    }
    if (t === e)
      return;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e)
        return;
      t = t.return, t.tag === W && (n = !1);
    }
    t.sibling.return = t.return, t = t.sibling;
  }
}
function aE(e) {
  Rp(e), lE(e);
}
function gu(e, t) {
  switch (t.tag) {
    case $e:
    case ct:
    case Bt:
    case It: {
      Pl(Kl, vb, t);
      return;
    }
    case w:
      return;
    case $: {
      const n = t.stateNode;
      if (n != null) {
        const l = t.memoizedProps, i = e !== null ? e.memoizedProps : l, o = t.type, a = t.updateQueue;
        t.updateQueue = null, a !== null && hT(
          n,
          a,
          o,
          i,
          l
        );
      }
      return;
    }
    case q: {
      O(
        t.stateNode !== null,
        "This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue."
      );
      const n = t.stateNode, l = t.memoizedProps, i = e !== null ? e.memoizedProps : l;
      mT(n, i, l);
      return;
    }
    case B:
      return;
    case Tn:
      return;
    case Le: {
      let n = t.memoizedState, l, i = t;
      n === null ? l = !1 : (l = !0, i = t.child, n.timedOutAt === x && (n.timedOutAt = tt())), i !== null && Jb(i, l);
      const o = t.updateQueue;
      if (o !== null) {
        t.updateQueue = null;
        let a = t.stateNode;
        a === null && (a = t.stateNode = new Yb()), o.forEach((c) => {
          let s = _E.bind(null, t, c);
          a.has(c) || (a.add(c), c.then(s, s));
        });
      }
      return;
    }
    case Fn:
      return;
    default:
      O(
        !1,
        "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
      );
  }
}
function cE(e) {
  zd(e.stateNode);
}
const sE = typeof WeakMap == "function" ? WeakMap : Map;
function Ka(e, t, n) {
  const l = dt(n);
  l.tag = Xc, l.payload = { element: null };
  const i = t.value;
  return l.callback = () => {
    Ya(i), vp(e, t);
  }, l;
}
function Op(e, t, n) {
  const l = dt(n);
  l.tag = Xc;
  const i = e.type.getDerivedStateFromError;
  if (typeof i == "function") {
    const a = t.value;
    l.payload = () => i(a);
  }
  const o = e.stateNode;
  return o !== null && typeof o.componentDidCatch == "function" && (l.callback = function() {
    typeof i != "function" && gE(this);
    const c = t.value, s = t.stack;
    vp(e, t), this.componentDidCatch(c, {
      componentStack: s !== null ? s : ""
    });
  }), l;
}
function uE(e, t, n) {
  let l = e.pingCache, i;
  if (l === null ? (l = e.pingCache = new sE(), i = /* @__PURE__ */ new Set(), l.set(n, i)) : (i = l.get(n), i === void 0 && (i = /* @__PURE__ */ new Set(), l.set(n, i))), !i.has(t)) {
    i.add(t);
    let o = xE.bind(
      null,
      e,
      n,
      t
    );
    n.then(o, o);
  }
}
function rE(e, t, n, l, i) {
  if (n.effectTag |= bi, n.firstEffect = n.lastEffect = null, l !== null && typeof l == "object" && typeof l.then == "function") {
    const a = l;
    let c = t, s = -1, r = -1;
    do {
      if (c.tag === Le) {
        const u = c.alternate;
        if (u !== null) {
          const d = u.memoizedState;
          if (d !== null) {
            const g = d.timedOutAt;
            r = _l(g);
            break;
          }
        }
        let f = c.pendingProps.maxDuration;
        typeof f == "number" && (f <= 0 ? s = 0 : (s === -1 || f < s) && (s = f));
      }
      c = c.return;
    } while (c !== null);
    c = t;
    do {
      if (c.tag === Le && jb(c)) {
        const u = c.updateQueue;
        if (u === null) {
          const d = /* @__PURE__ */ new Set();
          d.add(a), c.updateQueue = d;
        } else
          u.add(a);
        if ((c.mode & Ze) === Te) {
          if (c.effectTag |= xe, n.effectTag &= -1957, n.tag === w)
            if (n.alternate === null)
              n.tag = Fn;
            else {
              const g = dt(ge);
              g.tag = Ho, Je(n, g);
            }
          n.expirationTime = ge;
          return;
        }
        uE(e, i, a);
        let f;
        if (s === -1)
          f = An;
        else {
          if (r === -1) {
            const d = Xd(
              e,
              i
            );
            r = _l(
              d
            ) - Kd;
          }
          f = r + s;
        }
        SE(e, f), c.effectTag |= Be, c.expirationTime = i;
        return;
      }
      c = c.return;
    } while (c !== null);
    l = new Error(
      (Ct(n.type) || "A React component") + ` suspended while rendering, but no fallback UI was specified.

Add a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.` + qc(n)
    );
  }
  vE(), l = xi(l, n);
  let o = t;
  do {
    switch (o.tag) {
      case B: {
        const r = l;
        o.effectTag |= Be, o.expirationTime = i;
        const u = Ka(
          o,
          r,
          i
        );
        au(o, u);
        return;
      }
      case w:
        const a = l, c = o.type, s = o.stateNode;
        if ((o.effectTag & xe) === Te && (typeof c.getDerivedStateFromError == "function" || s !== null && typeof s.componentDidCatch == "function" && !Dp(s))) {
          o.effectTag |= Be, o.expirationTime = i;
          const r = Op(
            o,
            a,
            i
          );
          au(o, r);
          return;
        }
        break;
    }
    o = o.return;
  } while (o !== null);
}
function fE(e, t) {
  switch (e.tag) {
    case w: {
      const n = e.type;
      Fe(n) && Vi();
      const l = e.effectTag;
      return l & Be ? (e.effectTag = l & ~Be | xe, e) : null;
    }
    case B: {
      Pn(), Yc();
      const n = e.effectTag;
      return O(
        (n & xe) === Te,
        "The root failed to unmount after an error. This is likely a bug in React. Please file an issue."
      ), e.effectTag = n & ~Be | xe, e;
    }
    case $:
      return Jc(e), null;
    case Le: {
      const n = e.effectTag;
      return n & Be ? (e.effectTag = n & ~Be | xe, e) : null;
    }
    case vc:
      return null;
    case W:
      return Pn(), null;
    case yt:
      return ns(e), null;
    default:
      return null;
  }
}
function dE(e) {
  switch (e.tag) {
    case w: {
      const t = e.type.childContextTypes;
      t != null && Vi();
      break;
    }
    case B: {
      Pn(), Yc();
      break;
    }
    case $: {
      Jc(e);
      break;
    }
    case W:
      Pn();
      break;
    case yt:
      ns(e);
      break;
  }
}
const { ReactCurrentDispatcher: ca, ReactCurrentOwner: Up } = Wt;
let fi = ge - 1, wt = !1, Y = null, ke = null, Ce = x, xt = -1, rs = !1, P = null, io = !1, fs = null, oo = null, ao = null, rn = null;
function Ap() {
  if (Y !== null) {
    let e = Y.return;
    for (; e !== null; )
      dE(e), e = e.return;
  }
  ke = null, Ce = x, xt = -1, rs = !1, Y = null;
}
function pE() {
  for (; P !== null; ) {
    const e = P.effectTag;
    if (e & Hi && cE(P), e & xo) {
      const n = P.alternate;
      n !== null && tE(n);
    }
    switch (e & (X | K | Fi)) {
      case X: {
        yu(P), P.effectTag &= ~X;
        break;
      }
      case Qy: {
        yu(P), P.effectTag &= ~X;
        const n = P.alternate;
        gu(n, P);
        break;
      }
      case K: {
        const n = P.alternate;
        gu(n, P);
        break;
      }
      case Fi: {
        aE(P);
        break;
      }
    }
    P = P.nextEffect;
  }
}
function hE() {
  for (; P !== null; ) {
    if (P.effectTag & ol) {
      const t = P.alternate;
      Vb(t, P);
    }
    P = P.nextEffect;
  }
}
function mE(e, t) {
  for (; P !== null; ) {
    const n = P.effectTag;
    if (n & (K | Ti)) {
      const l = P.alternate;
      Zb(
        e,
        l,
        P
      );
    }
    n & xo && eE(P), n & _o && (fs = e), P = P.nextEffect;
  }
}
function yE(e, t) {
  fs = null, oo = null, ao = null;
  const n = he;
  he = !0;
  let l = t;
  do {
    if (l.effectTag & _o) {
      let o = !1, a;
      try {
        Gb(l);
      } catch (c) {
        o = !0, a = c;
      }
      o && kt(l, a);
    }
    l = l.nextEffect;
  } while (l !== null);
  he = n;
  const i = e.expirationTime;
  i !== x && Wo(e, i), !pe && !he && Xl();
}
function Dp(e) {
  return rn !== null && rn.has(e);
}
function gE(e) {
  rn === null ? rn = /* @__PURE__ */ new Set([e]) : rn.add(e);
}
function fn() {
  oo !== null && pT(oo), ao !== null && ao();
}
function CE(e, t) {
  wt = !0, io = !0;
  const n = e.pendingCommitExpirationTime;
  e.pendingCommitExpirationTime = x;
  const l = t.expirationTime, i = t.childExpirationTime, o = i > l ? i : l;
  BT(e, o), Up.current = null;
  let a;
  for (t.effectTag > bt ? t.lastEffect !== null ? (t.lastEffect.nextEffect = t, a = t.firstEffect) : a = t : a = t.firstEffect, lT(e.containerInfo), P = a; P !== null; ) {
    let u = !1, f;
    try {
      hE();
    } catch (d) {
      u = !0, f = d;
    }
    u && (kt(P, f), P !== null && (P = P.nextEffect));
  }
  for (P = a; P !== null; ) {
    let u = !1, f;
    try {
      pE();
    } catch (d) {
      u = !0, f = d;
    }
    u && (kt(P, f), P !== null && (P = P.nextEffect));
  }
  for (iT(e.containerInfo), e.current = t, P = a; P !== null; ) {
    let u = !1, f;
    try {
      mE(e, n);
    } catch (d) {
      u = !0, f = d;
    }
    u && (kt(P, f), P !== null && (P = P.nextEffect));
  }
  if (a !== null && fs !== null) {
    let u = yE.bind(null, e, a);
    oo = Tc(gn, () => dT(u)), ao = u;
  }
  io = !1, wt = !1;
  const c = t.expirationTime, s = t.childExpirationTime, r = s > c ? s : c;
  r === x && (rn = null), DE(e, r);
}
function TE(e, t) {
  if (t !== Dn && e.childExpirationTime === Dn)
    return;
  let n = x, l = e.child;
  for (; l !== null; ) {
    const i = l.expirationTime, o = l.childExpirationTime;
    i > n && (n = i), o > n && (n = o), l = l.sibling;
  }
  e.childExpirationTime = n;
}
function kp(e) {
  for (; ; ) {
    const t = e.alternate, n = e.return, l = e.sibling;
    if ((e.effectTag & bi) === Te) {
      if (Y = e, Y = Ib(
        t,
        e,
        Ce
      ), TE(e, Ce), Y !== null)
        return Y;
      if (n !== null && // Do not append effects to parents if a sibling failed to complete
      (n.effectTag & bi) === Te && (n.firstEffect === null && (n.firstEffect = e.firstEffect), e.lastEffect !== null && (n.lastEffect !== null && (n.lastEffect.nextEffect = e.firstEffect), n.lastEffect = e.lastEffect), e.effectTag > bt && (n.lastEffect !== null ? n.lastEffect.nextEffect = e : n.firstEffect = e, n.lastEffect = e)), l !== null)
        return l;
      if (n !== null) {
        e = n;
        continue;
      } else
        return null;
    } else {
      const i = fE(e);
      if (i !== null)
        return i.effectTag &= Xy, i;
      if (n !== null && (n.firstEffect = n.lastEffect = null, n.effectTag |= bi), l !== null)
        return l;
      if (n !== null) {
        e = n;
        continue;
      } else
        return null;
    }
  }
  return null;
}
function Cu(e) {
  const t = e.alternate;
  let n;
  return n = Cb(t, e, Ce), e.memoizedProps = e.pendingProps, n === null && (n = kp(e)), Up.current = null, n;
}
function bE(e) {
  if (e)
    for (; Y !== null && !Bo(); )
      Y = Cu(Y);
  else
    for (; Y !== null; )
      Y = Cu(Y);
}
function Tu(e, t) {
  fn(), wt = !0;
  const n = ca.current;
  ca.current = us;
  const l = e.nextExpirationTimeToWorkOn;
  (l !== Ce || e !== ke || Y === null) && (Ap(), ke = e, Ce = l, Y = Ht(
    ke.current,
    null
  ), e.pendingCommitExpirationTime = x);
  let i = !1;
  do {
    try {
      bE(t);
    } catch (a) {
      if (du(), Wa(), Y === null)
        i = !0, Ya(a);
      else {
        const c = Y;
        let s = c.return;
        if (s === null)
          i = !0, Ya(a);
        else {
          rE(
            e,
            s,
            c,
            a,
            Ce
          ), Y = kp(c);
          continue;
        }
      }
    }
    break;
  } while (!0);
  if (wt = !1, ca.current = n, du(), Wa(), i) {
    ke = null, RE(e);
    return;
  }
  if (Y !== null) {
    UE(e);
    return;
  }
  const o = e.current.alternate;
  if (ke = null, rs) {
    if (IT(e, l)) {
      ou(e, l);
      const a = l, c = e.expirationTime;
      sa(
        e,
        o,
        a,
        c,
        -1
        // Indicates no timeout
      );
      return;
    } else if (
      // There's no lower priority work, but we're rendering asynchronously.
      // Synchronously attempt to render the same level one more time. This is
      // similar to a suspend, but without a timeout because we're not waiting
      // for a promise to resolve.
      !e.didError && t
    ) {
      e.didError = !0;
      const a = e.nextExpirationTimeToWorkOn = l, c = e.expirationTime = ge;
      sa(
        e,
        o,
        a,
        c,
        -1
        // Indicates no timeout
      );
      return;
    }
  }
  if (t && xt !== -1) {
    const a = l;
    ou(e, a);
    const c = Xd(
      e,
      l
    ), s = _l(c);
    s < xt && (xt = s);
    const r = _l(tt());
    let u = xt - r;
    u = u < 0 ? 0 : u;
    const f = e.expirationTime;
    sa(
      e,
      o,
      a,
      f,
      u
    );
    return;
  }
  OE(e, o, l);
}
function kt(e, t) {
  const n = ge;
  let l = e.return;
  for (; l !== null; ) {
    switch (l.tag) {
      case w:
        const i = l.type, o = l.stateNode;
        if (typeof i.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && !Dp(o)) {
          const a = xi(t, e), c = Op(
            l,
            a,
            n
          );
          Je(l, c), mt(l, n);
          return;
        }
        break;
      case B: {
        const a = xi(t, e), c = Ka(l, a, n);
        Je(l, c), mt(l, n);
        return;
      }
    }
    l = l.return;
  }
  if (e.tag === B) {
    const i = e, o = xi(t, i), a = Ka(i, o, n);
    Je(i, a), mt(i, n);
  }
}
function EE() {
  const e = tt();
  let t = Yd(e);
  return t >= fi && (t = fi - 1), fi = t, fi;
}
function dn(e, t) {
  const n = Hy();
  let l;
  if ((t.mode & Ze) === cn)
    l = ge;
  else if (wt && !io)
    l = Ce;
  else {
    switch (n) {
      case yn:
        l = ge;
        break;
      case bl:
        l = MT(e);
        break;
      case gn:
        l = Yd(e);
        break;
      case gc:
      case Cc:
        l = Dn;
        break;
    }
    ke !== null && l === Ce && (l -= 1);
  }
  return n === bl && (et === x || l < et) && (et = l), l;
}
function SE(e, t, n) {
  t >= 0 && xt < t && (xt = t);
}
function vE() {
  rs = !0;
}
function xE(e, t, n) {
  const l = e.pingCache;
  if (l !== null && l.delete(t), ke !== null && Ce === n)
    ke = null;
  else if (jT(e, n)) {
    KT(e, n);
    const i = e.expirationTime;
    i !== x && Wo(e, i);
  }
}
function _E(e, t) {
  let n;
  n = e.stateNode, n !== null && n.delete(t);
  const l = tt(), i = dn(l, e), o = Pp(e, i);
  if (o !== null) {
    fl(o, i);
    const a = o.expirationTime;
    a !== x && Wo(o, a);
  }
}
function Pp(e, t) {
  e.expirationTime < t && (e.expirationTime = t);
  let n = e.alternate;
  n !== null && n.expirationTime < t && (n.expirationTime = t);
  let l = e.return, i = null;
  if (l === null && e.tag === B)
    i = e.stateNode;
  else
    for (; l !== null; ) {
      if (n = l.alternate, l.childExpirationTime < t && (l.childExpirationTime = t), n !== null && n.childExpirationTime < t && (n.childExpirationTime = t), l.return === null && l.tag === B) {
        i = l.stateNode;
        break;
      }
      l = l.return;
    }
  return i;
}
function mt(e, t) {
  const n = Pp(e, t);
  if (n !== null && (!wt && Ce !== x && t > Ce && Ap(), fl(n, t), // If we're in the render phase, we don't need to schedule this root
  // for an update, because we'll do it before we exit...
  !wt || io || // ...unless this is a different root than the one we're rendering.
  ke !== n)) {
    const l = n.expirationTime;
    Wo(n, l);
  }
}
let Pe = null, se = null, Ri = x, Oi, he = !1, Ie = null, Z = x, et = x, Jt = !1, Ui = null, pe = !1, Ai = !1, pn = null, ds = me(), Qe = Id(
  ds
), _t = Qe;
function Ml() {
  const e = me() - ds;
  Qe = Id(e);
}
function Mp(e, t) {
  if (Ri !== x) {
    if (t < Ri)
      return;
    Oi !== null && $r(Oi);
  }
  Ri = t;
  const n = me() - ds, i = _l(t) - n;
  Oi = Hr(PE, { timeout: i });
}
function RE(e) {
  e.finishedWork = null;
}
function OE(e, t, n) {
  e.pendingCommitExpirationTime = n, e.finishedWork = t;
}
function sa(e, t, n, l, i) {
  e.expirationTime = l, i === 0 && !Bo() ? (e.pendingCommitExpirationTime = n, e.finishedWork = t) : i > 0 && (e.timeoutHandle = fT(
    AE.bind(null, e, t, n),
    i
  ));
}
function UE(e) {
  e.finishedWork = null;
}
function AE(e, t, n) {
  e.pendingCommitExpirationTime = n, e.finishedWork = t, Ml(), _t = Qe, Np(e, n);
}
function DE(e, t) {
  e.expirationTime = t, e.finishedWork = null;
}
function tt() {
  return he ? _t : (Di(), (Z === x || Z === Dn) && (Ml(), _t = Qe), _t);
}
function Wo(e, t) {
  if (kE(e, t), !he) {
    if (pe) {
      Ai && (Ie = e, Z = ge, so(e, ge, !1));
      return;
    }
    t === ge ? Xl() : Mp(e, t);
  }
}
function kE(e, t) {
  if (e.nextScheduledRoot === null)
    e.expirationTime = t, se === null ? (Pe = se = e, e.nextScheduledRoot = e) : (se.nextScheduledRoot = e, se = e, se.nextScheduledRoot = Pe);
  else {
    const n = e.expirationTime;
    t > n && (e.expirationTime = t);
  }
}
function Di() {
  let e = x, t = null;
  if (se !== null) {
    let n = se, l = Pe;
    for (; l !== null; ) {
      const i = l.expirationTime;
      if (i === x) {
        if (l === l.nextScheduledRoot) {
          l.nextScheduledRoot = null, Pe = se = null;
          break;
        } else if (l === Pe) {
          const o = l.nextScheduledRoot;
          Pe = o, se.nextScheduledRoot = o, l.nextScheduledRoot = null;
        } else if (l === se) {
          se = n, se.nextScheduledRoot = Pe, l.nextScheduledRoot = null;
          break;
        } else
          n.nextScheduledRoot = l.nextScheduledRoot, l.nextScheduledRoot = null;
        l = n.nextScheduledRoot;
      } else {
        if (i > e && (e = i, t = l), l === se || e === ge)
          break;
        n = l, l = l.nextScheduledRoot;
      }
    }
  }
  Ie = t, Z = e;
}
let co = !1;
function Bo() {
  return co ? !0 : $y() ? (co = !0, !0) : !1;
}
function PE() {
  try {
    if (!Bo() && Pe !== null) {
      Ml();
      let e = Pe;
      do
        QT(e, Qe), e = e.nextScheduledRoot;
      while (e !== Pe);
    }
    Io(x, !0);
  } finally {
    co = !1;
  }
}
function Xl() {
  Io(ge, !1);
}
function Io(e, t) {
  if (Di(), t)
    for (Ml(), _t = Qe; Ie !== null && Z !== x && e <= Z && !(co && Qe > Z); )
      so(
        Ie,
        Z,
        Qe > Z
      ), Di(), Ml(), _t = Qe;
  else
    for (; Ie !== null && Z !== x && e <= Z; )
      so(Ie, Z, !1), Di();
  t && (Ri = x, Oi = null), Z !== x && Mp(
    Ie,
    Z
  ), ME();
}
function Np(e, t) {
  Ie = e, Z = t, so(e, t, !1), Xl();
}
function ME() {
  if (pn !== null) {
    const e = pn;
    pn = null;
    for (let t = 0; t < e.length; t++) {
      const n = e[t];
      try {
        n._onComplete();
      } catch (l) {
        Jt || (Jt = !0, Ui = l);
      }
    }
  }
  if (Jt) {
    const e = Ui;
    throw Ui = null, Jt = !1, e;
  }
}
function so(e, t, n) {
  if (he = !0, n) {
    let l = e.finishedWork;
    if (l !== null)
      di(e, l, t);
    else {
      e.finishedWork = null;
      const i = e.timeoutHandle;
      i !== Zn && (e.timeoutHandle = Zn, tu(i)), Tu(e, n), l = e.finishedWork, l !== null && (Bo() ? e.finishedWork = l : di(e, l, t));
    }
  } else {
    let l = e.finishedWork;
    if (l !== null)
      di(e, l, t);
    else {
      e.finishedWork = null;
      const i = e.timeoutHandle;
      i !== Zn && (e.timeoutHandle = Zn, tu(i)), Tu(e, n), l = e.finishedWork, l !== null && di(e, l, t);
    }
  }
  he = !1;
}
function di(e, t, n) {
  const l = e.firstBatch;
  if (l !== null && l._expirationTime >= n && (pn === null ? pn = [l] : pn.push(l), l._defer)) {
    e.finishedWork = t, e.expirationTime = x;
    return;
  }
  e.finishedWork = null, Tc(yn, () => {
    CE(e, t);
  });
}
function Ya(e) {
  Ie.expirationTime = x, Jt || (Jt = !0, Ui = e);
}
function NE(e, t) {
  const n = pe;
  pe = !0;
  try {
    return e(t);
  } finally {
    pe = n, !pe && !he && Xl();
  }
}
function LE(e, t) {
  if (pe && !Ai) {
    Ai = !0;
    try {
      return e(t);
    } finally {
      Ai = !1;
    }
  }
  return e(t);
}
function FE(e, t, n) {
  !pe && !he && et !== x && (Io(et, !1), et = x);
  const l = pe;
  pe = !0;
  try {
    return Tc(bl, () => e(t, n));
  } finally {
    pe = l, !pe && !he && Xl();
  }
}
function HE() {
  !he && et !== x && (Io(et, !1), et = x);
}
function $E(e) {
  if (!e)
    return Tt;
  const t = il(e), n = UT(t);
  if (t.tag === w) {
    const l = t.type;
    if (Fe(l))
      return Bd(t, l, n);
  }
  return n;
}
function wE(e, t, n, l) {
  const i = dt(n);
  return i.payload = { element: t }, l = l === void 0 ? null : l, l !== null && (yy(
    typeof l == "function",
    "render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.",
    l
  ), i.callback = l), fn(), Je(e, i), mt(e, n), n;
}
function Lp(e, t, n, l, i) {
  const o = t.current, a = $E(n);
  return t.context === null ? t.context = a : t.pendingContext = a, wE(o, e, l, i);
}
function zE(e, t, n) {
  return WT(e, t, n);
}
function ps(e, t, n, l) {
  const i = t.current, o = tt(), a = dn(o, i);
  return Lp(
    e,
    t,
    n,
    a,
    l
  );
}
function ua(e) {
  const t = e.current;
  if (!t.child)
    return null;
  switch (t.child.tag) {
    case $:
      return t.child.stateNode;
    default:
      return t.child.stateNode;
  }
}
let pl = null, hs = null, Jn = null;
function WE(e) {
  return pl = e, hs = Hp(), !0;
}
function BE() {
  pl = null, hs = null, Jn = null;
}
function Fp() {
  if (Jn)
    return Jn;
  let e;
  const t = hs, n = t.length;
  let l;
  const i = Hp(), o = i.length;
  for (e = 0; e < n && t[e] === i[e]; e++)
    ;
  const a = n - e;
  for (l = 1; l <= a && t[n - l] === i[o - l]; l++)
    ;
  const c = l > 1 ? 1 - l : void 0;
  return Jn = i.slice(e, c), Jn;
}
function Hp() {
  return "value" in pl ? pl.value : pl.textContent;
}
const IE = fe.extend({
  data: null
}), jE = fe.extend({
  data: null
}), KE = [9, 13, 27, 32], $p = 229, ms = Et && "CompositionEvent" in window;
let hl = null;
Et && "documentMode" in document && (hl = document.documentMode);
const YE = Et && "TextEvent" in window && !hl, wp = Et && (!ms || hl && hl > 8 && hl <= 11), zp = 32, bu = String.fromCharCode(zp), Xe = {
  beforeInput: {
    phasedRegistrationNames: {
      bubbled: "onBeforeInput",
      captured: "onBeforeInputCapture"
    },
    dependencies: [
      vn,
      Ke,
      nd,
      Mo
    ]
  },
  compositionEnd: {
    phasedRegistrationNames: {
      bubbled: "onCompositionEnd",
      captured: "onCompositionEndCapture"
    },
    dependencies: [
      oe,
      vn,
      _e,
      Ke,
      Ne,
      ft
    ]
  },
  compositionStart: {
    phasedRegistrationNames: {
      bubbled: "onCompositionStart",
      captured: "onCompositionStartCapture"
    },
    dependencies: [
      oe,
      bf,
      _e,
      Ke,
      Ne,
      ft
    ]
  },
  compositionUpdate: {
    phasedRegistrationNames: {
      bubbled: "onCompositionUpdate",
      captured: "onCompositionUpdateCapture"
    },
    dependencies: [
      oe,
      Ef,
      _e,
      Ke,
      Ne,
      ft
    ]
  }
};
let Eu = !1;
function QE(e) {
  return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
  !(e.ctrlKey && e.altKey);
}
function XE(e) {
  switch (e) {
    case bf:
      return Xe.compositionStart;
    case vn:
      return Xe.compositionEnd;
    case Ef:
      return Xe.compositionUpdate;
  }
}
function qE(e, t) {
  return e === _e && t.keyCode === $p;
}
function Wp(e, t) {
  switch (e) {
    case Ne:
      return KE.indexOf(t.keyCode) !== -1;
    case _e:
      return t.keyCode !== $p;
    case Ke:
    case ft:
    case oe:
      return !0;
    default:
      return !1;
  }
}
function Bp(e) {
  const t = e.detail;
  return typeof t == "object" && "data" in t ? t.data : null;
}
function Ip(e) {
  return e.locale === "ko";
}
let en = !1;
function VE(e, t, n, l) {
  let i, o;
  if (ms ? i = XE(e) : en ? Wp(e, n) && (i = Xe.compositionEnd) : qE(e, n) && (i = Xe.compositionStart), !i)
    return null;
  wp && !Ip(n) && (!en && i === Xe.compositionStart ? en = WE(l) : i === Xe.compositionEnd && en && (o = Fp()));
  const a = IE.getPooled(
    i,
    t,
    n,
    l
  );
  if (o)
    a.data = o;
  else {
    const c = Bp(n);
    c !== null && (a.data = c);
  }
  return Wl(a), a;
}
function GE(e, t) {
  switch (e) {
    case vn:
      return Bp(t);
    case Ke:
      return t.which !== zp ? null : (Eu = !0, bu);
    case nd:
      const l = t.data;
      return l === bu && Eu ? null : l;
    default:
      return null;
  }
}
function ZE(e, t) {
  if (en) {
    if (e === vn || !ms && Wp(e, t)) {
      const n = Fp();
      return BE(), en = !1, n;
    }
    return null;
  }
  switch (e) {
    case Mo:
      return null;
    case Ke:
      if (!QE(t)) {
        if (t.char && t.char.length > 1)
          return t.char;
        if (t.which)
          return String.fromCharCode(t.which);
      }
      return null;
    case vn:
      return wp && !Ip(t) ? null : t.data;
    default:
      return null;
  }
}
function JE(e, t, n, l) {
  let i;
  if (YE ? i = GE(e, n) : i = ZE(e, n), !i)
    return null;
  const o = jE.getPooled(
    Xe.beforeInput,
    t,
    n,
    l
  );
  return o.data = i, Wl(o), o;
}
const eS = {
  eventTypes: Xe,
  extractEvents: function(e, t, n, l) {
    const i = VE(
      e,
      t,
      n,
      l
    ), o = JE(
      e,
      t,
      n,
      l
    );
    return i === null ? o : o === null ? i : [i, o];
  }
}, tS = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0
};
function jp(e) {
  const t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!tS[e.type] : t === "textarea";
}
const Kp = {
  change: {
    phasedRegistrationNames: {
      bubbled: "onChange",
      captured: "onChangeCapture"
    },
    dependencies: [
      oe,
      Nc,
      Ao,
      Ge,
      Lc,
      _e,
      Ne,
      No
    ]
  }
};
function Yp(e, t, n) {
  const l = fe.getPooled(
    Kp.change,
    e,
    t,
    n
  );
  return l.type = "change", Hg(n), Wl(l), l;
}
let ml = null, ql = null;
function nS(e) {
  const t = e.nodeName && e.nodeName.toLowerCase();
  return t === "select" || t === "input" && e.type === "file";
}
function lS(e) {
  const t = Yp(
    ql,
    e,
    zc(e)
  );
  Cd(iS, t);
}
function iS(e) {
  Sd(e);
}
function jo(e) {
  const t = bn(e);
  if (nf(t))
    return e;
}
function oS(e, t) {
  if (e === Nc)
    return t;
}
let Qa = !1;
Et && (Qa = kd("input") && (!document.documentMode || document.documentMode > 9));
function aS(e, t) {
  ml = e, ql = t, ml.attachEvent("onpropertychange", Qp);
}
function Su() {
  ml && (ml.detachEvent("onpropertychange", Qp), ml = null, ql = null);
}
function Qp(e) {
  e.propertyName === "value" && jo(ql) && lS(e);
}
function cS(e, t, n) {
  e === Ge ? (Su(), aS(t, n)) : e === oe && Su();
}
function sS(e, t) {
  if (e === No || e === Ne || e === _e)
    return jo(ql);
}
function uS(e) {
  const t = e.nodeName;
  return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
}
function rS(e, t) {
  if (e === Ao)
    return jo(t);
}
function fS(e, t) {
  if (e === Lc || e === Nc)
    return jo(t);
}
function dS(e) {
  let t = e._wrapperState;
  !t || !t.controlled || e.type !== "number" || Ca(e, "number", e.value);
}
const pS = {
  eventTypes: Kp,
  _isInputEventSupported: Qa,
  extractEvents: function(e, t, n, l) {
    const i = t ? bn(t) : window;
    let o, a;
    if (nS(i) ? o = oS : jp(i) ? Qa ? o = fS : (o = sS, a = cS) : uS(i) && (o = rS), o) {
      const c = o(e, t);
      if (c)
        return Yp(
          c,
          n,
          l
        );
    }
    a && a(e, i, t), e === oe && dS(i);
  }
}, hS = [
  "ResponderEventPlugin",
  "SimpleEventPlugin",
  "EnterLeaveEventPlugin",
  "ChangeEventPlugin",
  "SelectEventPlugin",
  "BeforeInputEventPlugin"
], qn = {
  mouseEnter: {
    registrationName: "onMouseEnter",
    dependencies: [xn, _n]
  },
  mouseLeave: {
    registrationName: "onMouseLeave",
    dependencies: [xn, _n]
  },
  pointerEnter: {
    registrationName: "onPointerEnter",
    dependencies: [Rn, On]
  },
  pointerLeave: {
    registrationName: "onPointerLeave",
    dependencies: [Rn, On]
  }
}, mS = {
  eventTypes: qn,
  /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   */
  extractEvents: function(e, t, n, l) {
    const i = e === _n || e === On, o = e === xn || e === Rn;
    if (i && (n.relatedTarget || n.fromElement) || !o && !i)
      return null;
    let a;
    if (l.window === l)
      a = l;
    else {
      const S = l.ownerDocument;
      S ? a = S.defaultView || S.parentWindow : a = window;
    }
    let c, s;
    if (o) {
      c = t;
      const S = n.relatedTarget || n.toElement;
      s = S ? _c(S) : null;
    } else
      c = null, s = t;
    if (c === s)
      return null;
    let r, u, f, d;
    e === xn || e === _n ? (r = Il, u = qn.mouseLeave, f = qn.mouseEnter, d = "mouse") : (e === Rn || e === On) && (r = xd, u = qn.pointerLeave, f = qn.pointerEnter, d = "pointer");
    const g = c == null ? a : bn(c), h = s == null ? a : bn(s), y = r.getPooled(
      u,
      c,
      n,
      l
    );
    y.type = d + "leave", y.target = g, y.relatedTarget = h;
    const E = r.getPooled(
      f,
      s,
      n,
      l
    );
    return E.type = d + "enter", E.target = h, E.relatedTarget = g, lC(y, E, c, s), [y, E];
  }
}, yS = Et && "documentMode" in document && document.documentMode <= 11, Xp = {
  select: {
    phasedRegistrationNames: {
      bubbled: "onSelect",
      captured: "onSelectCapture"
    },
    dependencies: [
      oe,
      Do,
      ko,
      Ge,
      _e,
      Ne,
      ft,
      Po,
      No
    ]
  }
};
let tn = null, Xa = null, yl = null, qa = !1;
function gS(e) {
  if ("selectionStart" in e && jc(e))
    return {
      start: e.selectionStart,
      end: e.selectionEnd
    };
  {
    const n = (e.ownerDocument && e.ownerDocument.defaultView || window).getSelection();
    return {
      anchorNode: n.anchorNode,
      anchorOffset: n.anchorOffset,
      focusNode: n.focusNode,
      focusOffset: n.focusOffset
    };
  }
}
function qp(e) {
  return e.window === e ? e.document : e.nodeType === Sn ? e : e.ownerDocument;
}
function vu(e, t) {
  const n = qp(t);
  if (qa || tn == null || tn !== Pa(n))
    return null;
  const l = gS(tn);
  if (!yl || !Ol(yl, l)) {
    yl = l;
    const i = fe.getPooled(
      Xp.select,
      Xa,
      e,
      t
    );
    return i.type = "select", i.target = tn, Wl(i), i;
  }
  return null;
}
const CS = {
  eventTypes: Xp,
  extractEvents: function(e, t, n, l) {
    const i = qp(l);
    if (!i || !kC("onSelect", i))
      return null;
    const o = t ? bn(t) : window;
    switch (e) {
      // Track the input node that has focus.
      case Ge:
        (jp(o) || o.contentEditable === "true") && (tn = o, Xa = t, yl = null);
        break;
      case oe:
        tn = null, Xa = null, yl = null;
        break;
      // Don't fire the event while the user is dragging. This matches the
      // semantics of the native select event.
      case ft:
        qa = !0;
        break;
      case Do:
      case Po:
      case ko:
        return qa = !1, vu(n, l);
      // Chrome and IE fire non-standard event when selection is changed (and
      // sometimes when it hasn't). IE's event fires out of order with respect
      // to key and input events on deletion, so we discard it.
      //
      // Firefox doesn't support selectionchange, so check selection status
      // after each key entry. The selection changes after keydown and before
      // keyup, but we check on keydown as well in the case of holding down a
      // key, when multiple keydown events are fired but only one keyup is.
      // This is also our approach for IE handling, for the reason above.
      case No:
        if (yS)
          break;
      // falls through
      case _e:
      case Ne:
        return vu(n, l);
    }
    return null;
  }
};
bd.injectEventPluginOrder(hS);
Ng(
  Xr,
  Gy,
  bn
);
bd.injectEventPluginsByName({
  SimpleEventPlugin: Od,
  EnterLeaveEventPlugin: mS,
  ChangeEventPlugin: pS,
  SelectEventPlugin: CS,
  BeforeInputEventPlugin: eS
});
Fg(BC);
Wg(
  NE,
  FE,
  HE
);
function Vl(e, t, n) {
  const l = zE(e, t, n);
  this._internalRoot = l;
}
Vl.prototype.render = function(e, t) {
  const n = this._internalRoot, l = new Bn();
  return t = t === void 0 ? null : t, t !== null && l.then(t), ps(e, n, null, l._onCommit), l;
};
Vl.prototype.unmount = function(e) {
  const t = this._internalRoot, n = new Bn();
  return e = e === void 0 ? null : e, e !== null && n.then(e), ps(null, t, null, n._onCommit), n;
};
Vl.prototype.legacy_renderSubtreeIntoContainer = function(e, t, n) {
  const l = this._internalRoot, i = new Bn();
  return n = n === void 0 ? null : n, n !== null && i.then(n), ps(t, l, e, i._onCommit), i;
};
Vl.prototype.createBatch = function() {
  const e = new Gl(this), t = e._expirationTime, n = this._internalRoot, l = n.firstBatch;
  if (l === null)
    n.firstBatch = e, e._next = null;
  else {
    let i = null, o = l;
    for (; o !== null && o._expirationTime >= t; )
      i = o, o = o._next;
    e._next = o, i !== null && (i._next = e);
  }
  return e;
};
function Gl(e) {
  const t = EE();
  this._expirationTime = t, this._root = e, this._next = null, this._callbacks = null, this._didComplete = !1, this._hasChildren = !1, this._children = null, this._defer = !0;
}
Gl.prototype.render = function(e) {
  O(
    this._defer,
    "batch.render: Cannot render a batch that already committed."
  ), this._hasChildren = !0, this._children = e;
  const t = this._root._internalRoot, n = this._expirationTime, l = new Bn();
  return Lp(
    e,
    t,
    null,
    n,
    l._onCommit
  ), l;
};
Gl.prototype.then = function(e) {
  if (this._didComplete) {
    e();
    return;
  }
  let t = this._callbacks;
  t === null && (t = this._callbacks = []), t.push(e);
};
Gl.prototype.commit = function() {
  const e = this._root._internalRoot;
  let t = e.firstBatch;
  if (O(
    this._defer && t !== null,
    "batch.commit: Cannot commit a batch multiple times."
  ), !this._hasChildren) {
    this._next = null, this._defer = !1;
    return;
  }
  let n = this._expirationTime;
  if (t !== this) {
    this._hasChildren && (n = this._expirationTime = t._expirationTime, this.render(this._children));
    let i = null, o = t;
    for (; o !== this; )
      i = o, o = o._next;
    O(
      i !== null,
      "batch.commit: Cannot commit a batch multiple times."
    ), i._next = o._next, this._next = t, t = e.firstBatch = this;
  }
  this._defer = !1, Np(e, n);
  const l = this._next;
  this._next = null, t = e.firstBatch = l, t !== null && t._hasChildren && t.render(t._children);
};
Gl.prototype._onComplete = function() {
  if (this._didComplete)
    return;
  this._didComplete = !0;
  const e = this._callbacks;
  if (e !== null)
    for (let t = 0; t < e.length; t++) {
      const n = e[t];
      n();
    }
};
function Bn() {
  this._callbacks = null, this._didCommit = !1, this._onCommit = this._onCommit.bind(this);
}
Bn.prototype.then = function(e) {
  if (this._didCommit) {
    e();
    return;
  }
  let t = this._callbacks;
  t === null && (t = this._callbacks = []), t.push(e);
};
Bn.prototype._onCommit = function() {
  if (this._didCommit)
    return;
  this._didCommit = !0;
  const e = this._callbacks;
  if (e !== null)
    for (let t = 0; t < e.length; t++) {
      const n = e[t];
      O(
        typeof n == "function",
        "Invalid argument passed as callback. Expected a function. Instead received: %s",
        n
      ), n();
    }
};
function TS(e) {
  return e ? e.nodeType === Sn ? e.documentElement : e.firstChild : null;
}
function bS(e) {
  const t = TS(e);
  return !!(t && t.nodeType === uf && t.hasAttribute(ng));
}
function ES(e, t) {
  const n = bS(e);
  if (!n) {
    let i;
    for (; i = e.lastChild; )
      e.removeChild(i);
  }
  const l = !1;
  return new Vl(e, l, n);
}
function SS(e, t, n, l, i) {
  let o = n._reactRootContainer;
  if (o) {
    if (typeof i == "function") {
      const a = i;
      i = function() {
        const c = ua(o._internalRoot);
        a.call(c);
      };
    }
    o.render(t, i);
  } else {
    if (o = n._reactRootContainer = ES(
      n
    ), typeof i == "function") {
      const a = i;
      i = function() {
        const c = ua(o._internalRoot);
        a.call(c);
      };
    }
    LE(() => {
      e != null || o.render(t, i);
    });
  }
  return ua(o._internalRoot);
}
function vS(e, t, n) {
  return SS(
    null,
    e,
    t,
    !1,
    n
  );
}
const US = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  render: vS
}, Symbol.toStringTag, { value: "Module" }));
export {
  OS as React,
  US as ReactDom,
  RS as inferno,
  xS as snabbdom
};
