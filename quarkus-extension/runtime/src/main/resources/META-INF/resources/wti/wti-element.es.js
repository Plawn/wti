const Qp = (t, e) => t === e, $r = /* @__PURE__ */ Symbol("solid-proxy"), ya = /* @__PURE__ */ Symbol("solid-track"), Ti = {
  equals: Qp
};
let Bn = null, Jd = ef;
const tr = 1, Oi = 2, Wd = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var me = null;
let Po = null, Xp = null, $e = null, Ge = null, Ct = null, Yi = 0;
function qn(t, e) {
  const r = $e, n = me, s = t.length === 0, i = e === void 0 ? n : e, o = s ? Wd : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, a = s ? t : () => t(() => yt(() => Jn(o)));
  me = o, $e = null;
  try {
    return Nr(a, !0);
  } finally {
    $e = r, me = n;
  }
}
function Q(t, e) {
  e = e ? Object.assign({}, Ti, e) : Ti;
  const r = {
    value: t,
    observers: null,
    observerSlots: null,
    comparator: e.equals || void 0
  }, n = (s) => (typeof s == "function" && (s = s(r.value)), Zd(r, s));
  return [Xd.bind(r), n];
}
function ee(t, e, r) {
  const n = Qi(t, e, !1, tr);
  es(n);
}
function tt(t, e, r) {
  Jd = im;
  const n = Qi(t, e, !1, tr);
  (!r || !r.render) && (n.user = !0), Ct ? Ct.push(n) : es(n);
}
function pe(t, e, r) {
  r = r ? Object.assign({}, Ti, r) : Ti;
  const n = Qi(t, e, !0, 0);
  return n.observers = null, n.observerSlots = null, n.comparator = r.equals || void 0, es(n), Xd.bind(n);
}
function Zp(t) {
  return Nr(t, !1);
}
function yt(t) {
  if ($e === null) return t();
  const e = $e;
  $e = null;
  try {
    return t();
  } finally {
    $e = e;
  }
}
function Ar(t) {
  tt(() => yt(t));
}
function rt(t) {
  return me === null || (me.cleanups === null ? me.cleanups = [t] : me.cleanups.push(t)), t;
}
function em(t, e) {
  Bn || (Bn = /* @__PURE__ */ Symbol("error")), me = Qi(void 0, void 0, !0), me.context = {
    ...me.context,
    [Bn]: [e]
  };
  try {
    return t();
  } catch (r) {
    ts(r);
  } finally {
    me = me.owner;
  }
}
function ba() {
  return $e;
}
function tm() {
  return me;
}
function rm(t, e) {
  const r = me, n = $e;
  me = t, $e = null;
  try {
    return Nr(e, !0);
  } catch (s) {
    ts(s);
  } finally {
    me = r, $e = n;
  }
}
function Gd(t, e) {
  const r = /* @__PURE__ */ Symbol("context");
  return {
    id: r,
    Provider: am(r),
    defaultValue: t
  };
}
function Yd(t) {
  let e;
  return me && me.context && (e = me.context[t.id]) !== void 0 ? e : t.defaultValue;
}
function Qd(t) {
  const e = pe(t), r = pe(() => va(e()));
  return r.toArray = () => {
    const n = r();
    return Array.isArray(n) ? n : n != null ? [n] : [];
  }, r;
}
function Xd() {
  if (this.sources && this.state)
    if (this.state === tr) es(this);
    else {
      const t = Ge;
      Ge = null, Nr(() => Ni(this), !1), Ge = t;
    }
  if ($e) {
    const t = this.observers ? this.observers.length : 0;
    $e.sources ? ($e.sources.push(this), $e.sourceSlots.push(t)) : ($e.sources = [this], $e.sourceSlots = [t]), this.observers ? (this.observers.push($e), this.observerSlots.push($e.sources.length - 1)) : (this.observers = [$e], this.observerSlots = [$e.sources.length - 1]);
  }
  return this.value;
}
function Zd(t, e, r) {
  let n = t.value;
  return (!t.comparator || !t.comparator(n, e)) && (t.value = e, t.observers && t.observers.length && Nr(() => {
    for (let s = 0; s < t.observers.length; s += 1) {
      const i = t.observers[s], o = Po && Po.running;
      o && Po.disposed.has(i), (o ? !i.tState : !i.state) && (i.pure ? Ge.push(i) : Ct.push(i), i.observers && tf(i)), o || (i.state = tr);
    }
    if (Ge.length > 1e6)
      throw Ge = [], new Error();
  }, !1)), e;
}
function es(t) {
  if (!t.fn) return;
  Jn(t);
  const e = Yi;
  nm(t, t.value, e);
}
function nm(t, e, r) {
  let n;
  const s = me, i = $e;
  $e = me = t;
  try {
    n = t.fn(e);
  } catch (o) {
    return t.pure && (t.state = tr, t.owned && t.owned.forEach(Jn), t.owned = null), t.updatedAt = r + 1, ts(o);
  } finally {
    $e = i, me = s;
  }
  (!t.updatedAt || t.updatedAt <= r) && (t.updatedAt != null && "observers" in t ? Zd(t, n) : t.value = n, t.updatedAt = r);
}
function Qi(t, e, r, n = tr, s) {
  const i = {
    fn: t,
    state: n,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: e,
    owner: me,
    context: me ? me.context : null,
    pure: r
  };
  return me === null || me !== Wd && (me.owned ? me.owned.push(i) : me.owned = [i]), i;
}
function Ci(t) {
  if (t.state === 0) return;
  if (t.state === Oi) return Ni(t);
  if (t.suspense && yt(t.suspense.inFallback)) return t.suspense.effects.push(t);
  const e = [t];
  for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < Yi); )
    t.state && e.push(t);
  for (let r = e.length - 1; r >= 0; r--)
    if (t = e[r], t.state === tr)
      es(t);
    else if (t.state === Oi) {
      const n = Ge;
      Ge = null, Nr(() => Ni(t, e[0]), !1), Ge = n;
    }
}
function Nr(t, e) {
  if (Ge) return t();
  let r = !1;
  e || (Ge = []), Ct ? r = !0 : Ct = [], Yi++;
  try {
    const n = t();
    return sm(r), n;
  } catch (n) {
    r || (Ct = null), Ge = null, ts(n);
  }
}
function sm(t) {
  if (Ge && (ef(Ge), Ge = null), t) return;
  const e = Ct;
  Ct = null, e.length && Nr(() => Jd(e), !1);
}
function ef(t) {
  for (let e = 0; e < t.length; e++) Ci(t[e]);
}
function im(t) {
  let e, r = 0;
  for (e = 0; e < t.length; e++) {
    const n = t[e];
    n.user ? t[r++] = n : Ci(n);
  }
  for (e = 0; e < r; e++) Ci(t[e]);
}
function Ni(t, e) {
  t.state = 0;
  for (let r = 0; r < t.sources.length; r += 1) {
    const n = t.sources[r];
    if (n.sources) {
      const s = n.state;
      s === tr ? n !== e && (!n.updatedAt || n.updatedAt < Yi) && Ci(n) : s === Oi && Ni(n, e);
    }
  }
}
function tf(t) {
  for (let e = 0; e < t.observers.length; e += 1) {
    const r = t.observers[e];
    r.state || (r.state = Oi, r.pure ? Ge.push(r) : Ct.push(r), r.observers && tf(r));
  }
}
function Jn(t) {
  let e;
  if (t.sources)
    for (; t.sources.length; ) {
      const r = t.sources.pop(), n = t.sourceSlots.pop(), s = r.observers;
      if (s && s.length) {
        const i = s.pop(), o = r.observerSlots.pop();
        n < s.length && (i.sourceSlots[o] = n, s[n] = i, r.observerSlots[n] = o);
      }
    }
  if (t.tOwned) {
    for (e = t.tOwned.length - 1; e >= 0; e--) Jn(t.tOwned[e]);
    delete t.tOwned;
  }
  if (t.owned) {
    for (e = t.owned.length - 1; e >= 0; e--) Jn(t.owned[e]);
    t.owned = null;
  }
  if (t.cleanups) {
    for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
    t.cleanups = null;
  }
  t.state = 0;
}
function om(t) {
  return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
    cause: t
  });
}
function uc(t, e, r) {
  try {
    for (const n of e) n(t);
  } catch (n) {
    ts(n, r && r.owner || null);
  }
}
function ts(t, e = me) {
  const r = Bn && e && e.context && e.context[Bn], n = om(t);
  if (!r) throw n;
  Ct ? Ct.push({
    fn() {
      uc(n, r, e);
    },
    state: tr
  }) : uc(n, r, e);
}
function va(t) {
  if (typeof t == "function" && !t.length) return va(t());
  if (Array.isArray(t)) {
    const e = [];
    for (let r = 0; r < t.length; r++) {
      const n = va(t[r]);
      Array.isArray(n) ? e.push.apply(e, n) : e.push(n);
    }
    return e;
  }
  return t;
}
function am(t, e) {
  return function(n) {
    let s;
    return ee(() => s = yt(() => (me.context = {
      ...me.context,
      [t]: n.value
    }, Qd(() => n.children))), void 0), s;
  };
}
const lm = /* @__PURE__ */ Symbol("fallback");
function dc(t) {
  for (let e = 0; e < t.length; e++) t[e]();
}
function cm(t, e, r = {}) {
  let n = [], s = [], i = [], o = 0, a = e.length > 1 ? [] : null;
  return rt(() => dc(i)), () => {
    let l = t() || [], c = l.length, d, u;
    return l[ya], yt(() => {
      let p, b, g, m, w, h, y, k, v;
      if (c === 0)
        o !== 0 && (dc(i), i = [], n = [], s = [], o = 0, a && (a = [])), r.fallback && (n = [lm], s[0] = qn((x) => (i[0] = x, r.fallback())), o = 1);
      else if (o === 0) {
        for (s = new Array(c), u = 0; u < c; u++)
          n[u] = l[u], s[u] = qn(f);
        o = c;
      } else {
        for (g = new Array(c), m = new Array(c), a && (w = new Array(c)), h = 0, y = Math.min(o, c); h < y && n[h] === l[h]; h++) ;
        for (y = o - 1, k = c - 1; y >= h && k >= h && n[y] === l[k]; y--, k--)
          g[k] = s[y], m[k] = i[y], a && (w[k] = a[y]);
        for (p = /* @__PURE__ */ new Map(), b = new Array(k + 1), u = k; u >= h; u--)
          v = l[u], d = p.get(v), b[u] = d === void 0 ? -1 : d, p.set(v, u);
        for (d = h; d <= y; d++)
          v = n[d], u = p.get(v), u !== void 0 && u !== -1 ? (g[u] = s[d], m[u] = i[d], a && (w[u] = a[d]), u = b[u], p.set(v, u)) : i[d]();
        for (u = h; u < c; u++)
          u in g ? (s[u] = g[u], i[u] = m[u], a && (a[u] = w[u], a[u](u))) : s[u] = qn(f);
        s = s.slice(0, o = c), n = l.slice(0);
      }
      return s;
    });
    function f(p) {
      if (i[u] = p, a) {
        const [b, g] = Q(u);
        return a[u] = g, e(l[u], b);
      }
      return e(l[u]);
    }
  };
}
function A(t, e) {
  return yt(() => t(e || {}));
}
const rf = (t) => `Stale read from <${t}>.`;
function Ae(t) {
  const e = "fallback" in t && {
    fallback: () => t.fallback
  };
  return pe(cm(() => t.each, t.children, e || void 0));
}
function z(t) {
  const e = t.keyed, r = pe(() => t.when, void 0, void 0), n = e ? r : pe(r, void 0, {
    equals: (s, i) => !s == !i
  });
  return pe(() => {
    const s = n();
    if (s) {
      const i = t.children;
      return typeof i == "function" && i.length > 0 ? yt(() => i(e ? s : () => {
        if (!yt(n)) throw rf("Show");
        return r();
      })) : i;
    }
    return t.fallback;
  }, void 0, void 0);
}
function nf(t) {
  const e = Qd(() => t.children), r = pe(() => {
    const n = e(), s = Array.isArray(n) ? n : [n];
    let i = () => {
    };
    for (let o = 0; o < s.length; o++) {
      const a = o, l = s[o], c = i, d = pe(() => c() ? void 0 : l.when, void 0, void 0), u = l.keyed ? d : pe(d, void 0, {
        equals: (f, p) => !f == !p
      });
      i = () => c() || (u() ? [a, d, l] : void 0);
    }
    return i;
  });
  return pe(() => {
    const n = r()();
    if (!n) return t.fallback;
    const [s, i, o] = n, a = o.children;
    return typeof a == "function" && a.length > 0 ? yt(() => a(o.keyed ? i() : () => {
      if (yt(r)()?.[0] !== s) throw rf("Match");
      return i();
    })) : a;
  }, void 0, void 0);
}
function Rt(t) {
  return t;
}
let bs;
function um(t) {
  let e;
  const [r, n] = Q(e, void 0);
  return bs || (bs = /* @__PURE__ */ new Set()), bs.add(n), rt(() => bs.delete(n)), pe(() => {
    let s;
    if (s = r()) {
      const i = t.fallback;
      return typeof i == "function" && i.length ? yt(() => i(s, () => n())) : i;
    }
    return em(() => t.children, n);
  }, void 0, void 0);
}
const Oe = (t) => pe(() => t());
function dm(t, e, r) {
  let n = r.length, s = e.length, i = n, o = 0, a = 0, l = e[s - 1].nextSibling, c = null;
  for (; o < s || a < i; ) {
    if (e[o] === r[a]) {
      o++, a++;
      continue;
    }
    for (; e[s - 1] === r[i - 1]; )
      s--, i--;
    if (s === o) {
      const d = i < n ? a ? r[a - 1].nextSibling : r[i - a] : l;
      for (; a < i; ) t.insertBefore(r[a++], d);
    } else if (i === a)
      for (; o < s; )
        (!c || !c.has(e[o])) && e[o].remove(), o++;
    else if (e[o] === r[i - 1] && r[a] === e[s - 1]) {
      const d = e[--s].nextSibling;
      t.insertBefore(r[a++], e[o++].nextSibling), t.insertBefore(r[--i], d), e[s] = r[i];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let u = a;
        for (; u < i; ) c.set(r[u], u++);
      }
      const d = c.get(e[o]);
      if (d != null)
        if (a < d && d < i) {
          let u = o, f = 1, p;
          for (; ++u < s && u < i && !((p = c.get(e[u])) == null || p !== d + f); )
            f++;
          if (f > d - a) {
            const b = e[o];
            for (; a < d; ) t.insertBefore(r[a++], b);
          } else t.replaceChild(r[a++], e[o++]);
        } else o++;
      else e[o++].remove();
    }
  }
}
const fc = "_$DX_DELEGATE";
function M(t, e, r, n) {
  let s;
  const i = () => {
    const a = document.createElement("template");
    return a.innerHTML = t, a.content.firstChild;
  }, o = () => (s || (s = i())).cloneNode(!0);
  return o.cloneNode = o, o;
}
function Ee(t, e = window.document) {
  const r = e[fc] || (e[fc] = /* @__PURE__ */ new Set());
  for (let n = 0, s = t.length; n < s; n++) {
    const i = t[n];
    r.has(i) || (r.add(i), e.addEventListener(i, fm));
  }
}
function he(t, e, r) {
  r == null ? t.removeAttribute(e) : t.setAttribute(e, r);
}
function te(t, e) {
  e == null ? t.removeAttribute("class") : t.className = e;
}
function dt(t, e, r, n) {
  if (n)
    Array.isArray(r) ? (t[`$$${e}`] = r[0], t[`$$${e}Data`] = r[1]) : t[`$$${e}`] = r;
  else if (Array.isArray(r)) {
    const s = r[0];
    t.addEventListener(e, r[0] = (i) => s.call(t, r[1], i));
  } else t.addEventListener(e, r, typeof r != "function" && r);
}
function sf(t, e, r) {
  r != null ? t.style.setProperty(e, r) : t.style.removeProperty(e);
}
function rn(t, e, r) {
  return yt(() => t(e, r));
}
function $(t, e, r, n) {
  if (r !== void 0 && !n && (n = []), typeof e != "function") return Ii(t, e, n, r);
  ee((s) => Ii(t, e(), s, r), n);
}
function fm(t) {
  let e = t.target;
  const r = `$$${t.type}`, n = t.target, s = t.currentTarget, i = (l) => Object.defineProperty(t, "target", {
    configurable: !0,
    value: l
  }), o = () => {
    const l = e[r];
    if (l && !e.disabled) {
      const c = e[`${r}Data`];
      if (c !== void 0 ? l.call(e, c, t) : l.call(e, t), t.cancelBubble) return;
    }
    return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && i(e.host), !0;
  }, a = () => {
    for (; o() && (e = e._$host || e.parentNode || e.host); ) ;
  };
  if (Object.defineProperty(t, "currentTarget", {
    configurable: !0,
    get() {
      return e || document;
    }
  }), t.composedPath) {
    const l = t.composedPath();
    i(l[0]);
    for (let c = 0; c < l.length - 2 && (e = l[c], !!o()); c++) {
      if (e._$host) {
        e = e._$host, a();
        break;
      }
      if (e.parentNode === s)
        break;
    }
  } else a();
  i(n);
}
function Ii(t, e, r, n, s) {
  for (; typeof r == "function"; ) r = r();
  if (e === r) return r;
  const i = typeof e, o = n !== void 0;
  if (t = o && r[0] && r[0].parentNode || t, i === "string" || i === "number") {
    if (i === "number" && (e = e.toString(), e === r))
      return r;
    if (o) {
      let a = r[0];
      a && a.nodeType === 3 ? a.data !== e && (a.data = e) : a = document.createTextNode(e), r = Dr(t, r, n, a);
    } else
      r !== "" && typeof r == "string" ? r = t.firstChild.data = e : r = t.textContent = e;
  } else if (e == null || i === "boolean")
    r = Dr(t, r, n);
  else {
    if (i === "function")
      return ee(() => {
        let a = e();
        for (; typeof a == "function"; ) a = a();
        r = Ii(t, a, r, n);
      }), () => r;
    if (Array.isArray(e)) {
      const a = [], l = r && Array.isArray(r);
      if (wa(a, e, r, s))
        return ee(() => r = Ii(t, a, r, n, !0)), () => r;
      if (a.length === 0) {
        if (r = Dr(t, r, n), o) return r;
      } else l ? r.length === 0 ? hc(t, a, n) : dm(t, r, a) : (r && Dr(t), hc(t, a));
      r = a;
    } else if (e.nodeType) {
      if (Array.isArray(r)) {
        if (o) return r = Dr(t, r, n, e);
        Dr(t, r, null, e);
      } else r == null || r === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
      r = e;
    }
  }
  return r;
}
function wa(t, e, r, n) {
  let s = !1;
  for (let i = 0, o = e.length; i < o; i++) {
    let a = e[i], l = r && r[t.length], c;
    if (!(a == null || a === !0 || a === !1)) if ((c = typeof a) == "object" && a.nodeType)
      t.push(a);
    else if (Array.isArray(a))
      s = wa(t, a, l) || s;
    else if (c === "function")
      if (n) {
        for (; typeof a == "function"; ) a = a();
        s = wa(t, Array.isArray(a) ? a : [a], Array.isArray(l) ? l : [l]) || s;
      } else
        t.push(a), s = !0;
    else {
      const d = String(a);
      l && l.nodeType === 3 && l.data === d ? t.push(l) : t.push(document.createTextNode(d));
    }
  }
  return s;
}
function hc(t, e, r = null) {
  for (let n = 0, s = e.length; n < s; n++) t.insertBefore(e[n], r);
}
function Dr(t, e, r, n) {
  if (r === void 0) return t.textContent = "";
  const s = n || document.createTextNode("");
  if (e.length) {
    let i = !1;
    for (let o = e.length - 1; o >= 0; o--) {
      const a = e[o];
      if (s !== a) {
        const l = a.parentNode === t;
        !i && !o ? l ? t.replaceChild(s, a) : t.insertBefore(s, r) : l && a.remove();
      } else i = !0;
    }
  } else t.insertBefore(s, r);
  return [s];
}
const hm = "http://www.w3.org/2000/svg";
function pm(t, e = !1, r = void 0) {
  return e ? document.createElementNS(hm, t) : document.createElement(t, {
    is: r
  });
}
function of(t) {
  const {
    useShadow: e
  } = t, r = document.createTextNode(""), n = () => t.mount || document.body, s = tm();
  let i;
  return tt(() => {
    i || (i = rm(s, () => pe(() => t.children)));
    const o = n();
    if (o instanceof HTMLHeadElement) {
      const [a, l] = Q(!1), c = () => l(!0);
      qn((d) => $(o, () => a() ? d() : i(), null)), rt(c);
    } else {
      const a = pm(t.isSVG ? "g" : "div", t.isSVG), l = e && a.attachShadow ? a.attachShadow({
        mode: "open"
      }) : a;
      Object.defineProperty(a, "_$host", {
        get() {
          return r.parentNode;
        },
        configurable: !0
      }), $(l, i), o.appendChild(a), t.ref && t.ref(a), rt(() => o.removeChild(a));
    }
  }, void 0, {
    render: !0
  }), r;
}
const rl = /* @__PURE__ */ Symbol.for("yaml.alias"), ka = /* @__PURE__ */ Symbol.for("yaml.document"), ir = /* @__PURE__ */ Symbol.for("yaml.map"), af = /* @__PURE__ */ Symbol.for("yaml.pair"), Dt = /* @__PURE__ */ Symbol.for("yaml.scalar"), cn = /* @__PURE__ */ Symbol.for("yaml.seq"), bt = /* @__PURE__ */ Symbol.for("yaml.node.type"), Ir = (t) => !!t && typeof t == "object" && t[bt] === rl, Xi = (t) => !!t && typeof t == "object" && t[bt] === ka, rs = (t) => !!t && typeof t == "object" && t[bt] === ir, je = (t) => !!t && typeof t == "object" && t[bt] === af, Se = (t) => !!t && typeof t == "object" && t[bt] === Dt, ns = (t) => !!t && typeof t == "object" && t[bt] === cn;
function Ie(t) {
  if (t && typeof t == "object")
    switch (t[bt]) {
      case ir:
      case cn:
        return !0;
    }
  return !1;
}
function Le(t) {
  if (t && typeof t == "object")
    switch (t[bt]) {
      case rl:
      case ir:
      case Dt:
      case cn:
        return !0;
    }
  return !1;
}
const lf = (t) => (Se(t) || Ie(t)) && !!t.anchor, yr = /* @__PURE__ */ Symbol("break visit"), mm = /* @__PURE__ */ Symbol("skip children"), Fn = /* @__PURE__ */ Symbol("remove node");
function un(t, e) {
  const r = gm(e);
  Xi(t) ? Vr(null, t.contents, r, Object.freeze([t])) === Fn && (t.contents = null) : Vr(null, t, r, Object.freeze([]));
}
un.BREAK = yr;
un.SKIP = mm;
un.REMOVE = Fn;
function Vr(t, e, r, n) {
  const s = ym(t, e, r, n);
  if (Le(s) || je(s))
    return bm(t, n, s), Vr(t, s, r, n);
  if (typeof s != "symbol") {
    if (Ie(e)) {
      n = Object.freeze(n.concat(e));
      for (let i = 0; i < e.items.length; ++i) {
        const o = Vr(i, e.items[i], r, n);
        if (typeof o == "number")
          i = o - 1;
        else {
          if (o === yr)
            return yr;
          o === Fn && (e.items.splice(i, 1), i -= 1);
        }
      }
    } else if (je(e)) {
      n = Object.freeze(n.concat(e));
      const i = Vr("key", e.key, r, n);
      if (i === yr)
        return yr;
      i === Fn && (e.key = null);
      const o = Vr("value", e.value, r, n);
      if (o === yr)
        return yr;
      o === Fn && (e.value = null);
    }
  }
  return s;
}
function gm(t) {
  return typeof t == "object" && (t.Collection || t.Node || t.Value) ? Object.assign({
    Alias: t.Node,
    Map: t.Node,
    Scalar: t.Node,
    Seq: t.Node
  }, t.Value && {
    Map: t.Value,
    Scalar: t.Value,
    Seq: t.Value
  }, t.Collection && {
    Map: t.Collection,
    Seq: t.Collection
  }, t) : t;
}
function ym(t, e, r, n) {
  if (typeof r == "function")
    return r(t, e, n);
  if (rs(e))
    return r.Map?.(t, e, n);
  if (ns(e))
    return r.Seq?.(t, e, n);
  if (je(e))
    return r.Pair?.(t, e, n);
  if (Se(e))
    return r.Scalar?.(t, e, n);
  if (Ir(e))
    return r.Alias?.(t, e, n);
}
function bm(t, e, r) {
  const n = e[e.length - 1];
  if (Ie(n))
    n.items[t] = r;
  else if (je(n))
    t === "key" ? n.key = r : n.value = r;
  else if (Xi(n))
    n.contents = r;
  else {
    const s = Ir(n) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${s} parent`);
  }
}
const vm = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
}, wm = (t) => t.replace(/[!,[\]{}]/g, (e) => vm[e]);
class Xe {
  constructor(e, r) {
    this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, Xe.defaultYaml, e), this.tags = Object.assign({}, Xe.defaultTags, r);
  }
  clone() {
    const e = new Xe(this.yaml, this.tags);
    return e.docStart = this.docStart, e;
  }
  /**
   * During parsing, get a Directives instance for the current document and
   * update the stream state according to the current version's spec.
   */
  atDocument() {
    const e = new Xe(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = !0;
        break;
      case "1.2":
        this.atNextDocument = !1, this.yaml = {
          explicit: Xe.defaultYaml.explicit,
          version: "1.2"
        }, this.tags = Object.assign({}, Xe.defaultTags);
        break;
    }
    return e;
  }
  /**
   * @param onError - May be called even if the action was successful
   * @returns `true` on success
   */
  add(e, r) {
    this.atNextDocument && (this.yaml = { explicit: Xe.defaultYaml.explicit, version: "1.1" }, this.tags = Object.assign({}, Xe.defaultTags), this.atNextDocument = !1);
    const n = e.trim().split(/[ \t]+/), s = n.shift();
    switch (s) {
      case "%TAG": {
        if (n.length !== 2 && (r(0, "%TAG directive should contain exactly two parts"), n.length < 2))
          return !1;
        const [i, o] = n;
        return this.tags[i] = o, !0;
      }
      case "%YAML": {
        if (this.yaml.explicit = !0, n.length !== 1)
          return r(0, "%YAML directive should contain exactly one part"), !1;
        const [i] = n;
        if (i === "1.1" || i === "1.2")
          return this.yaml.version = i, !0;
        {
          const o = /^\d+\.\d+$/.test(i);
          return r(6, `Unsupported YAML version ${i}`, o), !1;
        }
      }
      default:
        return r(0, `Unknown directive ${s}`, !0), !1;
    }
  }
  /**
   * Resolves a tag, matching handles to those defined in %TAG directives.
   *
   * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
   *   `'!local'` tag, or `null` if unresolvable.
   */
  tagName(e, r) {
    if (e === "!")
      return "!";
    if (e[0] !== "!")
      return r(`Not a valid tag: ${e}`), null;
    if (e[1] === "<") {
      const o = e.slice(2, -1);
      return o === "!" || o === "!!" ? (r(`Verbatim tags aren't resolved, so ${e} is invalid.`), null) : (e[e.length - 1] !== ">" && r("Verbatim tags must end with a >"), o);
    }
    const [, n, s] = e.match(/^(.*!)([^!]*)$/s);
    s || r(`The ${e} tag has no suffix`);
    const i = this.tags[n];
    if (i)
      try {
        return i + decodeURIComponent(s);
      } catch (o) {
        return r(String(o)), null;
      }
    return n === "!" ? e : (r(`Could not resolve tag: ${e}`), null);
  }
  /**
   * Given a fully resolved tag, returns its printable string form,
   * taking into account current tag prefixes and defaults.
   */
  tagString(e) {
    for (const [r, n] of Object.entries(this.tags))
      if (e.startsWith(n))
        return r + wm(e.substring(n.length));
    return e[0] === "!" ? e : `!<${e}>`;
  }
  toString(e) {
    const r = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], n = Object.entries(this.tags);
    let s;
    if (e && n.length > 0 && Le(e.contents)) {
      const i = {};
      un(e.contents, (o, a) => {
        Le(a) && a.tag && (i[a.tag] = !0);
      }), s = Object.keys(i);
    } else
      s = [];
    for (const [i, o] of n)
      i === "!!" && o === "tag:yaml.org,2002:" || (!e || s.some((a) => a.startsWith(o))) && r.push(`%TAG ${i} ${o}`);
    return r.join(`
`);
  }
}
Xe.defaultYaml = { explicit: !1, version: "1.2" };
Xe.defaultTags = { "!!": "tag:yaml.org,2002:" };
function cf(t) {
  if (/[\x00-\x19\s,[\]{}]/.test(t)) {
    const r = `Anchor must not contain whitespace or control characters: ${JSON.stringify(t)}`;
    throw new Error(r);
  }
  return !0;
}
function uf(t) {
  const e = /* @__PURE__ */ new Set();
  return un(t, {
    Value(r, n) {
      n.anchor && e.add(n.anchor);
    }
  }), e;
}
function df(t, e) {
  for (let r = 1; ; ++r) {
    const n = `${t}${r}`;
    if (!e.has(n))
      return n;
  }
}
function km(t, e) {
  const r = [], n = /* @__PURE__ */ new Map();
  let s = null;
  return {
    onAnchor: (i) => {
      r.push(i), s ?? (s = uf(t));
      const o = df(e, s);
      return s.add(o), o;
    },
    /**
     * With circular references, the source node is only resolved after all
     * of its child nodes are. This is why anchors are set only after all of
     * the nodes have been created.
     */
    setAnchors: () => {
      for (const i of r) {
        const o = n.get(i);
        if (typeof o == "object" && o.anchor && (Se(o.node) || Ie(o.node)))
          o.node.anchor = o.anchor;
        else {
          const a = new Error("Failed to resolve repeated object (this should not happen)");
          throw a.source = i, a;
        }
      }
    },
    sourceObjects: n
  };
}
function Hr(t, e, r, n) {
  if (n && typeof n == "object")
    if (Array.isArray(n))
      for (let s = 0, i = n.length; s < i; ++s) {
        const o = n[s], a = Hr(t, n, String(s), o);
        a === void 0 ? delete n[s] : a !== o && (n[s] = a);
      }
    else if (n instanceof Map)
      for (const s of Array.from(n.keys())) {
        const i = n.get(s), o = Hr(t, n, s, i);
        o === void 0 ? n.delete(s) : o !== i && n.set(s, o);
      }
    else if (n instanceof Set)
      for (const s of Array.from(n)) {
        const i = Hr(t, n, s, s);
        i === void 0 ? n.delete(s) : i !== s && (n.delete(s), n.add(i));
      }
    else
      for (const [s, i] of Object.entries(n)) {
        const o = Hr(t, n, s, i);
        o === void 0 ? delete n[s] : o !== i && (n[s] = o);
      }
  return t.call(e, r, n);
}
function mt(t, e, r) {
  if (Array.isArray(t))
    return t.map((n, s) => mt(n, String(s), r));
  if (t && typeof t.toJSON == "function") {
    if (!r || !lf(t))
      return t.toJSON(e, r);
    const n = { aliasCount: 0, count: 1, res: void 0 };
    r.anchors.set(t, n), r.onCreate = (i) => {
      n.res = i, delete r.onCreate;
    };
    const s = t.toJSON(e, r);
    return r.onCreate && r.onCreate(s), s;
  }
  return typeof t == "bigint" && !r?.keep ? Number(t) : t;
}
class nl {
  constructor(e) {
    Object.defineProperty(this, bt, { value: e });
  }
  /** Create a copy of this node.  */
  clone() {
    const e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return this.range && (e.range = this.range.slice()), e;
  }
  /** A plain JavaScript representation of this node. */
  toJS(e, { mapAsMap: r, maxAliasCount: n, onAnchor: s, reviver: i } = {}) {
    if (!Xi(e))
      throw new TypeError("A document argument is required");
    const o = {
      anchors: /* @__PURE__ */ new Map(),
      doc: e,
      keep: !0,
      mapAsMap: r === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof n == "number" ? n : 100
    }, a = mt(this, "", o);
    if (typeof s == "function")
      for (const { count: l, res: c } of o.anchors.values())
        s(c, l);
    return typeof i == "function" ? Hr(i, { "": a }, "", a) : a;
  }
}
class sl extends nl {
  constructor(e) {
    super(rl), this.source = e, Object.defineProperty(this, "tag", {
      set() {
        throw new Error("Alias nodes cannot have tags");
      }
    });
  }
  /**
   * Resolve the value of this alias within `doc`, finding the last
   * instance of the `source` anchor before this node.
   */
  resolve(e, r) {
    let n;
    r?.aliasResolveCache ? n = r.aliasResolveCache : (n = [], un(e, {
      Node: (i, o) => {
        (Ir(o) || lf(o)) && n.push(o);
      }
    }), r && (r.aliasResolveCache = n));
    let s;
    for (const i of n) {
      if (i === this)
        break;
      i.anchor === this.source && (s = i);
    }
    return s;
  }
  toJSON(e, r) {
    if (!r)
      return { source: this.source };
    const { anchors: n, doc: s, maxAliasCount: i } = r, o = this.resolve(s, r);
    if (!o) {
      const l = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(l);
    }
    let a = n.get(o);
    if (a || (mt(o, null, r), a = n.get(o)), a?.res === void 0) {
      const l = "This should not happen: Alias anchor was not resolved?";
      throw new ReferenceError(l);
    }
    if (i >= 0 && (a.count += 1, a.aliasCount === 0 && (a.aliasCount = wi(s, o, n)), a.count * a.aliasCount > i)) {
      const l = "Excessive alias count indicates a resource exhaustion attack";
      throw new ReferenceError(l);
    }
    return a.res;
  }
  toString(e, r, n) {
    const s = `*${this.source}`;
    if (e) {
      if (cf(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source)) {
        const i = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(i);
      }
      if (e.implicitKey)
        return `${s} `;
    }
    return s;
  }
}
function wi(t, e, r) {
  if (Ir(e)) {
    const n = e.resolve(t), s = r && n && r.get(n);
    return s ? s.count * s.aliasCount : 0;
  } else if (Ie(e)) {
    let n = 0;
    for (const s of e.items) {
      const i = wi(t, s, r);
      i > n && (n = i);
    }
    return n;
  } else if (je(e)) {
    const n = wi(t, e.key, r), s = wi(t, e.value, r);
    return Math.max(n, s);
  }
  return 1;
}
const ff = (t) => !t || typeof t != "function" && typeof t != "object";
class oe extends nl {
  constructor(e) {
    super(Dt), this.value = e;
  }
  toJSON(e, r) {
    return r?.keep ? this.value : mt(this.value, e, r);
  }
  toString() {
    return String(this.value);
  }
}
oe.BLOCK_FOLDED = "BLOCK_FOLDED";
oe.BLOCK_LITERAL = "BLOCK_LITERAL";
oe.PLAIN = "PLAIN";
oe.QUOTE_DOUBLE = "QUOTE_DOUBLE";
oe.QUOTE_SINGLE = "QUOTE_SINGLE";
const xm = "tag:yaml.org,2002:";
function Sm(t, e, r) {
  if (e) {
    const n = r.filter((i) => i.tag === e), s = n.find((i) => !i.format) ?? n[0];
    if (!s)
      throw new Error(`Tag ${e} not found`);
    return s;
  }
  return r.find((n) => n.identify?.(t) && !n.format);
}
function Wn(t, e, r) {
  if (Xi(t) && (t = t.contents), Le(t))
    return t;
  if (je(t)) {
    const u = r.schema[ir].createNode?.(r.schema, null, r);
    return u.items.push(t), u;
  }
  (t instanceof String || t instanceof Number || t instanceof Boolean || typeof BigInt < "u" && t instanceof BigInt) && (t = t.valueOf());
  const { aliasDuplicateObjects: n, onAnchor: s, onTagObj: i, schema: o, sourceObjects: a } = r;
  let l;
  if (n && t && typeof t == "object") {
    if (l = a.get(t), l)
      return l.anchor ?? (l.anchor = s(t)), new sl(l.anchor);
    l = { anchor: null, node: null }, a.set(t, l);
  }
  e?.startsWith("!!") && (e = xm + e.slice(2));
  let c = Sm(t, e, o.tags);
  if (!c) {
    if (t && typeof t.toJSON == "function" && (t = t.toJSON()), !t || typeof t != "object") {
      const u = new oe(t);
      return l && (l.node = u), u;
    }
    c = t instanceof Map ? o[ir] : Symbol.iterator in Object(t) ? o[cn] : o[ir];
  }
  i && (i(c), delete r.onTagObj);
  const d = c?.createNode ? c.createNode(r.schema, t, r) : typeof c?.nodeClass?.from == "function" ? c.nodeClass.from(r.schema, t, r) : new oe(t);
  return e ? d.tag = e : c.default || (d.tag = c.tag), l && (l.node = d), d;
}
function Pi(t, e, r) {
  let n = r;
  for (let s = e.length - 1; s >= 0; --s) {
    const i = e[s];
    if (typeof i == "number" && Number.isInteger(i) && i >= 0) {
      const o = [];
      o[i] = n, n = o;
    } else
      n = /* @__PURE__ */ new Map([[i, n]]);
  }
  return Wn(n, void 0, {
    aliasDuplicateObjects: !1,
    keepUndefined: !1,
    onAnchor: () => {
      throw new Error("This should not happen, please report a bug.");
    },
    schema: t,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
const In = (t) => t == null || typeof t == "object" && !!t[Symbol.iterator]().next().done;
class hf extends nl {
  constructor(e, r) {
    super(e), Object.defineProperty(this, "schema", {
      value: r,
      configurable: !0,
      enumerable: !1,
      writable: !0
    });
  }
  /**
   * Create a copy of this collection.
   *
   * @param schema - If defined, overwrites the original's schema
   */
  clone(e) {
    const r = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return e && (r.schema = e), r.items = r.items.map((n) => Le(n) || je(n) ? n.clone(e) : n), this.range && (r.range = this.range.slice()), r;
  }
  /**
   * Adds a value to the collection. For `!!map` and `!!omap` the value must
   * be a Pair instance or a `{ key, value }` object, which may not have a key
   * that already exists in the map.
   */
  addIn(e, r) {
    if (In(e))
      this.add(r);
    else {
      const [n, ...s] = e, i = this.get(n, !0);
      if (Ie(i))
        i.addIn(s, r);
      else if (i === void 0 && this.schema)
        this.set(n, Pi(this.schema, s, r));
      else
        throw new Error(`Expected YAML collection at ${n}. Remaining path: ${s}`);
    }
  }
  /**
   * Removes a value from the collection.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(e) {
    const [r, ...n] = e;
    if (n.length === 0)
      return this.delete(r);
    const s = this.get(r, !0);
    if (Ie(s))
      return s.deleteIn(n);
    throw new Error(`Expected YAML collection at ${r}. Remaining path: ${n}`);
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(e, r) {
    const [n, ...s] = e, i = this.get(n, !0);
    return s.length === 0 ? !r && Se(i) ? i.value : i : Ie(i) ? i.getIn(s, r) : void 0;
  }
  hasAllNullValues(e) {
    return this.items.every((r) => {
      if (!je(r))
        return !1;
      const n = r.value;
      return n == null || e && Se(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   */
  hasIn(e) {
    const [r, ...n] = e;
    if (n.length === 0)
      return this.has(r);
    const s = this.get(r, !0);
    return Ie(s) ? s.hasIn(n) : !1;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(e, r) {
    const [n, ...s] = e;
    if (s.length === 0)
      this.set(n, r);
    else {
      const i = this.get(n, !0);
      if (Ie(i))
        i.setIn(s, r);
      else if (i === void 0 && this.schema)
        this.set(n, Pi(this.schema, s, r));
      else
        throw new Error(`Expected YAML collection at ${n}. Remaining path: ${s}`);
    }
  }
}
const _m = (t) => t.replace(/^(?!$)(?: $)?/gm, "#");
function Yt(t, e) {
  return /^\n+$/.test(t) ? t.substring(1) : e ? t.replace(/^(?! *$)/gm, e) : t;
}
const wr = (t, e, r) => t.endsWith(`
`) ? Yt(r, e) : r.includes(`
`) ? `
` + Yt(r, e) : (t.endsWith(" ") ? "" : " ") + r, pf = "flow", xa = "block", ki = "quoted";
function Zi(t, e, r = "flow", { indentAtStart: n, lineWidth: s = 80, minContentWidth: i = 20, onFold: o, onOverflow: a } = {}) {
  if (!s || s < 0)
    return t;
  s < i && (i = 0);
  const l = Math.max(1 + i, 1 + s - e.length);
  if (t.length <= l)
    return t;
  const c = [], d = {};
  let u = s - e.length;
  typeof n == "number" && (n > s - Math.max(2, i) ? c.push(0) : u = s - n);
  let f, p, b = !1, g = -1, m = -1, w = -1;
  r === xa && (g = pc(t, g, e.length), g !== -1 && (u = g + l));
  for (let y; y = t[g += 1]; ) {
    if (r === ki && y === "\\") {
      switch (m = g, t[g + 1]) {
        case "x":
          g += 3;
          break;
        case "u":
          g += 5;
          break;
        case "U":
          g += 9;
          break;
        default:
          g += 1;
      }
      w = g;
    }
    if (y === `
`)
      r === xa && (g = pc(t, g, e.length)), u = g + e.length + l, f = void 0;
    else {
      if (y === " " && p && p !== " " && p !== `
` && p !== "	") {
        const k = t[g + 1];
        k && k !== " " && k !== `
` && k !== "	" && (f = g);
      }
      if (g >= u)
        if (f)
          c.push(f), u = f + l, f = void 0;
        else if (r === ki) {
          for (; p === " " || p === "	"; )
            p = y, y = t[g += 1], b = !0;
          const k = g > w + 1 ? g - 2 : m - 1;
          if (d[k])
            return t;
          c.push(k), d[k] = !0, u = k + l, f = void 0;
        } else
          b = !0;
    }
    p = y;
  }
  if (b && a && a(), c.length === 0)
    return t;
  o && o();
  let h = t.slice(0, c[0]);
  for (let y = 0; y < c.length; ++y) {
    const k = c[y], v = c[y + 1] || t.length;
    k === 0 ? h = `
${e}${t.slice(0, v)}` : (r === ki && d[k] && (h += `${t[k]}\\`), h += `
${e}${t.slice(k + 1, v)}`);
  }
  return h;
}
function pc(t, e, r) {
  let n = e, s = e + 1, i = t[s];
  for (; i === " " || i === "	"; )
    if (e < s + r)
      i = t[++e];
    else {
      do
        i = t[++e];
      while (i && i !== `
`);
      n = e, s = e + 1, i = t[s];
    }
  return n;
}
const eo = (t, e) => ({
  indentAtStart: e ? t.indent.length : t.indentAtStart,
  lineWidth: t.options.lineWidth,
  minContentWidth: t.options.minContentWidth
}), to = (t) => /^(%|---|\.\.\.)/m.test(t);
function Em(t, e, r) {
  if (!e || e < 0)
    return !1;
  const n = e - r, s = t.length;
  if (s <= n)
    return !1;
  for (let i = 0, o = 0; i < s; ++i)
    if (t[i] === `
`) {
      if (i - o > n)
        return !0;
      if (o = i + 1, s - o <= n)
        return !1;
    }
  return !0;
}
function Un(t, e) {
  const r = JSON.stringify(t);
  if (e.options.doubleQuotedAsJSON)
    return r;
  const { implicitKey: n } = e, s = e.options.doubleQuotedMinMultiLineLength, i = e.indent || (to(t) ? "  " : "");
  let o = "", a = 0;
  for (let l = 0, c = r[l]; c; c = r[++l])
    if (c === " " && r[l + 1] === "\\" && r[l + 2] === "n" && (o += r.slice(a, l) + "\\ ", l += 1, a = l, c = "\\"), c === "\\")
      switch (r[l + 1]) {
        case "u":
          {
            o += r.slice(a, l);
            const d = r.substr(l + 2, 4);
            switch (d) {
              case "0000":
                o += "\\0";
                break;
              case "0007":
                o += "\\a";
                break;
              case "000b":
                o += "\\v";
                break;
              case "001b":
                o += "\\e";
                break;
              case "0085":
                o += "\\N";
                break;
              case "00a0":
                o += "\\_";
                break;
              case "2028":
                o += "\\L";
                break;
              case "2029":
                o += "\\P";
                break;
              default:
                d.substr(0, 2) === "00" ? o += "\\x" + d.substr(2) : o += r.substr(l, 6);
            }
            l += 5, a = l + 1;
          }
          break;
        case "n":
          if (n || r[l + 2] === '"' || r.length < s)
            l += 1;
          else {
            for (o += r.slice(a, l) + `

`; r[l + 2] === "\\" && r[l + 3] === "n" && r[l + 4] !== '"'; )
              o += `
`, l += 2;
            o += i, r[l + 2] === " " && (o += "\\"), l += 1, a = l + 1;
          }
          break;
        default:
          l += 1;
      }
  return o = a ? o + r.slice(a) : r, n ? o : Zi(o, i, ki, eo(e, !1));
}
function Sa(t, e) {
  if (e.options.singleQuote === !1 || e.implicitKey && t.includes(`
`) || /[ \t]\n|\n[ \t]/.test(t))
    return Un(t, e);
  const r = e.indent || (to(t) ? "  " : ""), n = "'" + t.replace(/'/g, "''").replace(/\n+/g, `$&
${r}`) + "'";
  return e.implicitKey ? n : Zi(n, r, pf, eo(e, !1));
}
function Jr(t, e) {
  const { singleQuote: r } = e.options;
  let n;
  if (r === !1)
    n = Un;
  else {
    const s = t.includes('"'), i = t.includes("'");
    s && !i ? n = Sa : i && !s ? n = Un : n = r ? Sa : Un;
  }
  return n(t, e);
}
let _a;
try {
  _a = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g");
} catch {
  _a = /\n+(?!\n|$)/g;
}
function xi({ comment: t, type: e, value: r }, n, s, i) {
  const { blockQuote: o, commentString: a, lineWidth: l } = n.options;
  if (!o || /\n[\t ]+$/.test(r))
    return Jr(r, n);
  const c = n.indent || (n.forceBlockIndent || to(r) ? "  " : ""), d = o === "literal" ? !0 : o === "folded" || e === oe.BLOCK_FOLDED ? !1 : e === oe.BLOCK_LITERAL ? !0 : !Em(r, l, c.length);
  if (!r)
    return d ? `|
` : `>
`;
  let u, f;
  for (f = r.length; f > 0; --f) {
    const v = r[f - 1];
    if (v !== `
` && v !== "	" && v !== " ")
      break;
  }
  let p = r.substring(f);
  const b = p.indexOf(`
`);
  b === -1 ? u = "-" : r === p || b !== p.length - 1 ? (u = "+", i && i()) : u = "", p && (r = r.slice(0, -p.length), p[p.length - 1] === `
` && (p = p.slice(0, -1)), p = p.replace(_a, `$&${c}`));
  let g = !1, m, w = -1;
  for (m = 0; m < r.length; ++m) {
    const v = r[m];
    if (v === " ")
      g = !0;
    else if (v === `
`)
      w = m;
    else
      break;
  }
  let h = r.substring(0, w < m ? w + 1 : m);
  h && (r = r.substring(h.length), h = h.replace(/\n+/g, `$&${c}`));
  let k = (g ? c ? "2" : "1" : "") + u;
  if (t && (k += " " + a(t.replace(/ ?[\r\n]+/g, " ")), s && s()), !d) {
    const v = r.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${c}`);
    let x = !1;
    const S = eo(n, !0);
    o !== "folded" && e !== oe.BLOCK_FOLDED && (S.onOverflow = () => {
      x = !0;
    });
    const _ = Zi(`${h}${v}${p}`, c, xa, S);
    if (!x)
      return `>${k}
${c}${_}`;
  }
  return r = r.replace(/\n+/g, `$&${c}`), `|${k}
${c}${h}${r}${p}`;
}
function $m(t, e, r, n) {
  const { type: s, value: i } = t, { actualString: o, implicitKey: a, indent: l, indentStep: c, inFlow: d } = e;
  if (a && i.includes(`
`) || d && /[[\]{},]/.test(i))
    return Jr(i, e);
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(i))
    return a || d || !i.includes(`
`) ? Jr(i, e) : xi(t, e, r, n);
  if (!a && !d && s !== oe.PLAIN && i.includes(`
`))
    return xi(t, e, r, n);
  if (to(i)) {
    if (l === "")
      return e.forceBlockIndent = !0, xi(t, e, r, n);
    if (a && l === c)
      return Jr(i, e);
  }
  const u = i.replace(/\n+/g, `$&
${l}`);
  if (o) {
    const f = (g) => g.default && g.tag !== "tag:yaml.org,2002:str" && g.test?.test(u), { compat: p, tags: b } = e.doc.schema;
    if (b.some(f) || p?.some(f))
      return Jr(i, e);
  }
  return a ? u : Zi(u, l, pf, eo(e, !1));
}
function il(t, e, r, n) {
  const { implicitKey: s, inFlow: i } = e, o = typeof t.value == "string" ? t : Object.assign({}, t, { value: String(t.value) });
  let { type: a } = t;
  a !== oe.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) && (a = oe.QUOTE_DOUBLE);
  const l = (d) => {
    switch (d) {
      case oe.BLOCK_FOLDED:
      case oe.BLOCK_LITERAL:
        return s || i ? Jr(o.value, e) : xi(o, e, r, n);
      case oe.QUOTE_DOUBLE:
        return Un(o.value, e);
      case oe.QUOTE_SINGLE:
        return Sa(o.value, e);
      case oe.PLAIN:
        return $m(o, e, r, n);
      default:
        return null;
    }
  };
  let c = l(a);
  if (c === null) {
    const { defaultKeyType: d, defaultStringType: u } = e.options, f = s && d || u;
    if (c = l(f), c === null)
      throw new Error(`Unsupported default string type ${f}`);
  }
  return c;
}
function mf(t, e) {
  const r = Object.assign({
    blockQuote: !0,
    commentString: _m,
    defaultKeyType: null,
    defaultStringType: "PLAIN",
    directives: null,
    doubleQuotedAsJSON: !1,
    doubleQuotedMinMultiLineLength: 40,
    falseStr: "false",
    flowCollectionPadding: !0,
    indentSeq: !0,
    lineWidth: 80,
    minContentWidth: 20,
    nullStr: "null",
    simpleKeys: !1,
    singleQuote: null,
    trueStr: "true",
    verifyAliasOrder: !0
  }, t.schema.toStringOptions, e);
  let n;
  switch (r.collectionStyle) {
    case "block":
      n = !1;
      break;
    case "flow":
      n = !0;
      break;
    default:
      n = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc: t,
    flowCollectionPadding: r.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof r.indent == "number" ? " ".repeat(r.indent) : "  ",
    inFlow: n,
    options: r
  };
}
function Am(t, e) {
  if (e.tag) {
    const s = t.filter((i) => i.tag === e.tag);
    if (s.length > 0)
      return s.find((i) => i.format === e.format) ?? s[0];
  }
  let r, n;
  if (Se(e)) {
    n = e.value;
    let s = t.filter((i) => i.identify?.(n));
    if (s.length > 1) {
      const i = s.filter((o) => o.test);
      i.length > 0 && (s = i);
    }
    r = s.find((i) => i.format === e.format) ?? s.find((i) => !i.format);
  } else
    n = e, r = t.find((s) => s.nodeClass && n instanceof s.nodeClass);
  if (!r) {
    const s = n?.constructor?.name ?? (n === null ? "null" : typeof n);
    throw new Error(`Tag not resolved for ${s} value`);
  }
  return r;
}
function Tm(t, e, { anchors: r, doc: n }) {
  if (!n.directives)
    return "";
  const s = [], i = (Se(t) || Ie(t)) && t.anchor;
  i && cf(i) && (r.add(i), s.push(`&${i}`));
  const o = t.tag ?? (e.default ? null : e.tag);
  return o && s.push(n.directives.tagString(o)), s.join(" ");
}
function nn(t, e, r, n) {
  if (je(t))
    return t.toString(e, r, n);
  if (Ir(t)) {
    if (e.doc.directives)
      return t.toString(e);
    if (e.resolvedAliases?.has(t))
      throw new TypeError("Cannot stringify circular structure without alias nodes");
    e.resolvedAliases ? e.resolvedAliases.add(t) : e.resolvedAliases = /* @__PURE__ */ new Set([t]), t = t.resolve(e.doc);
  }
  let s;
  const i = Le(t) ? t : e.doc.createNode(t, { onTagObj: (l) => s = l });
  s ?? (s = Am(e.doc.schema.tags, i));
  const o = Tm(i, s, e);
  o.length > 0 && (e.indentAtStart = (e.indentAtStart ?? 0) + o.length + 1);
  const a = typeof s.stringify == "function" ? s.stringify(i, e, r, n) : Se(i) ? il(i, e, r, n) : i.toString(e, r, n);
  return o ? Se(i) || a[0] === "{" || a[0] === "[" ? `${o} ${a}` : `${o}
${e.indent}${a}` : a;
}
function Om({ key: t, value: e }, r, n, s) {
  const { allNullValues: i, doc: o, indent: a, indentStep: l, options: { commentString: c, indentSeq: d, simpleKeys: u } } = r;
  let f = Le(t) && t.comment || null;
  if (u) {
    if (f)
      throw new Error("With simple keys, key nodes cannot have comments");
    if (Ie(t) || !Le(t) && typeof t == "object") {
      const S = "With simple keys, collection cannot be used as a key value";
      throw new Error(S);
    }
  }
  let p = !u && (!t || f && e == null && !r.inFlow || Ie(t) || (Se(t) ? t.type === oe.BLOCK_FOLDED || t.type === oe.BLOCK_LITERAL : typeof t == "object"));
  r = Object.assign({}, r, {
    allNullValues: !1,
    implicitKey: !p && (u || !i),
    indent: a + l
  });
  let b = !1, g = !1, m = nn(t, r, () => b = !0, () => g = !0);
  if (!p && !r.inFlow && m.length > 1024) {
    if (u)
      throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    p = !0;
  }
  if (r.inFlow) {
    if (i || e == null)
      return b && n && n(), m === "" ? "?" : p ? `? ${m}` : m;
  } else if (i && !u || e == null && p)
    return m = `? ${m}`, f && !b ? m += wr(m, r.indent, c(f)) : g && s && s(), m;
  b && (f = null), p ? (f && (m += wr(m, r.indent, c(f))), m = `? ${m}
${a}:`) : (m = `${m}:`, f && (m += wr(m, r.indent, c(f))));
  let w, h, y;
  Le(e) ? (w = !!e.spaceBefore, h = e.commentBefore, y = e.comment) : (w = !1, h = null, y = null, e && typeof e == "object" && (e = o.createNode(e))), r.implicitKey = !1, !p && !f && Se(e) && (r.indentAtStart = m.length + 1), g = !1, !d && l.length >= 2 && !r.inFlow && !p && ns(e) && !e.flow && !e.tag && !e.anchor && (r.indent = r.indent.substring(2));
  let k = !1;
  const v = nn(e, r, () => k = !0, () => g = !0);
  let x = " ";
  if (f || w || h) {
    if (x = w ? `
` : "", h) {
      const S = c(h);
      x += `
${Yt(S, r.indent)}`;
    }
    v === "" && !r.inFlow ? x === `
` && y && (x = `

`) : x += `
${r.indent}`;
  } else if (!p && Ie(e)) {
    const S = v[0], _ = v.indexOf(`
`), T = _ !== -1, P = r.inFlow ?? e.flow ?? e.items.length === 0;
    if (T || !P) {
      let R = !1;
      if (T && (S === "&" || S === "!")) {
        let D = v.indexOf(" ");
        S === "&" && D !== -1 && D < _ && v[D + 1] === "!" && (D = v.indexOf(" ", D + 1)), (D === -1 || _ < D) && (R = !0);
      }
      R || (x = `
${r.indent}`);
    }
  } else (v === "" || v[0] === `
`) && (x = "");
  return m += x + v, r.inFlow ? k && n && n() : y && !k ? m += wr(m, r.indent, c(y)) : g && s && s(), m;
}
function gf(t, e) {
  (t === "debug" || t === "warn") && console.warn(e);
}
const vs = "<<", Xt = {
  identify: (t) => t === vs || typeof t == "symbol" && t.description === vs,
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: () => Object.assign(new oe(Symbol(vs)), {
    addToJSMap: yf
  }),
  stringify: () => vs
}, Cm = (t, e) => (Xt.identify(e) || Se(e) && (!e.type || e.type === oe.PLAIN) && Xt.identify(e.value)) && t?.doc.schema.tags.some((r) => r.tag === Xt.tag && r.default);
function yf(t, e, r) {
  if (r = t && Ir(r) ? r.resolve(t.doc) : r, ns(r))
    for (const n of r.items)
      Lo(t, e, n);
  else if (Array.isArray(r))
    for (const n of r)
      Lo(t, e, n);
  else
    Lo(t, e, r);
}
function Lo(t, e, r) {
  const n = t && Ir(r) ? r.resolve(t.doc) : r;
  if (!rs(n))
    throw new Error("Merge sources must be maps or map aliases");
  const s = n.toJSON(null, t, Map);
  for (const [i, o] of s)
    e instanceof Map ? e.has(i) || e.set(i, o) : e instanceof Set ? e.add(i) : Object.prototype.hasOwnProperty.call(e, i) || Object.defineProperty(e, i, {
      value: o,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  return e;
}
function bf(t, e, { key: r, value: n }) {
  if (Le(r) && r.addToJSMap)
    r.addToJSMap(t, e, n);
  else if (Cm(t, r))
    yf(t, e, n);
  else {
    const s = mt(r, "", t);
    if (e instanceof Map)
      e.set(s, mt(n, s, t));
    else if (e instanceof Set)
      e.add(s);
    else {
      const i = Nm(r, s, t), o = mt(n, i, t);
      i in e ? Object.defineProperty(e, i, {
        value: o,
        writable: !0,
        enumerable: !0,
        configurable: !0
      }) : e[i] = o;
    }
  }
  return e;
}
function Nm(t, e, r) {
  if (e === null)
    return "";
  if (typeof e != "object")
    return String(e);
  if (Le(t) && r?.doc) {
    const n = mf(r.doc, {});
    n.anchors = /* @__PURE__ */ new Set();
    for (const i of r.anchors.keys())
      n.anchors.add(i.anchor);
    n.inFlow = !0, n.inStringifyKey = !0;
    const s = t.toString(n);
    if (!r.mapKeyWarned) {
      let i = JSON.stringify(s);
      i.length > 40 && (i = i.substring(0, 36) + '..."'), gf(r.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${i}. Set mapAsMap: true to use object keys.`), r.mapKeyWarned = !0;
    }
    return s;
  }
  return JSON.stringify(e);
}
function ol(t, e, r) {
  const n = Wn(t, void 0, r), s = Wn(e, void 0, r);
  return new nt(n, s);
}
class nt {
  constructor(e, r = null) {
    Object.defineProperty(this, bt, { value: af }), this.key = e, this.value = r;
  }
  clone(e) {
    let { key: r, value: n } = this;
    return Le(r) && (r = r.clone(e)), Le(n) && (n = n.clone(e)), new nt(r, n);
  }
  toJSON(e, r) {
    const n = r?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    return bf(r, n, this);
  }
  toString(e, r, n) {
    return e?.doc ? Om(this, e, r, n) : JSON.stringify(this);
  }
}
function vf(t, e, r) {
  return (e.inFlow ?? t.flow ? Pm : Im)(t, e, r);
}
function Im({ comment: t, items: e }, r, { blockItemPrefix: n, flowChars: s, itemIndent: i, onChompKeep: o, onComment: a }) {
  const { indent: l, options: { commentString: c } } = r, d = Object.assign({}, r, { indent: i, type: null });
  let u = !1;
  const f = [];
  for (let b = 0; b < e.length; ++b) {
    const g = e[b];
    let m = null;
    if (Le(g))
      !u && g.spaceBefore && f.push(""), Li(r, f, g.commentBefore, u), g.comment && (m = g.comment);
    else if (je(g)) {
      const h = Le(g.key) ? g.key : null;
      h && (!u && h.spaceBefore && f.push(""), Li(r, f, h.commentBefore, u));
    }
    u = !1;
    let w = nn(g, d, () => m = null, () => u = !0);
    m && (w += wr(w, i, c(m))), u && m && (u = !1), f.push(n + w);
  }
  let p;
  if (f.length === 0)
    p = s.start + s.end;
  else {
    p = f[0];
    for (let b = 1; b < f.length; ++b) {
      const g = f[b];
      p += g ? `
${l}${g}` : `
`;
    }
  }
  return t ? (p += `
` + Yt(c(t), l), a && a()) : u && o && o(), p;
}
function Pm({ items: t }, e, { flowChars: r, itemIndent: n }) {
  const { indent: s, indentStep: i, flowCollectionPadding: o, options: { commentString: a } } = e;
  n += i;
  const l = Object.assign({}, e, {
    indent: n,
    inFlow: !0,
    type: null
  });
  let c = !1, d = 0;
  const u = [];
  for (let b = 0; b < t.length; ++b) {
    const g = t[b];
    let m = null;
    if (Le(g))
      g.spaceBefore && u.push(""), Li(e, u, g.commentBefore, !1), g.comment && (m = g.comment);
    else if (je(g)) {
      const h = Le(g.key) ? g.key : null;
      h && (h.spaceBefore && u.push(""), Li(e, u, h.commentBefore, !1), h.comment && (c = !0));
      const y = Le(g.value) ? g.value : null;
      y ? (y.comment && (m = y.comment), y.commentBefore && (c = !0)) : g.value == null && h?.comment && (m = h.comment);
    }
    m && (c = !0);
    let w = nn(g, l, () => m = null);
    b < t.length - 1 && (w += ","), m && (w += wr(w, n, a(m))), !c && (u.length > d || w.includes(`
`)) && (c = !0), u.push(w), d = u.length;
  }
  const { start: f, end: p } = r;
  if (u.length === 0)
    return f + p;
  if (!c) {
    const b = u.reduce((g, m) => g + m.length + 2, 2);
    c = e.options.lineWidth > 0 && b > e.options.lineWidth;
  }
  if (c) {
    let b = f;
    for (const g of u)
      b += g ? `
${i}${s}${g}` : `
`;
    return `${b}
${s}${p}`;
  } else
    return `${f}${o}${u.join(" ")}${o}${p}`;
}
function Li({ indent: t, options: { commentString: e } }, r, n, s) {
  if (n && s && (n = n.replace(/^\n+/, "")), n) {
    const i = Yt(e(n), t);
    r.push(i.trimStart());
  }
}
function kr(t, e) {
  const r = Se(e) ? e.value : e;
  for (const n of t)
    if (je(n) && (n.key === e || n.key === r || Se(n.key) && n.key.value === r))
      return n;
}
class ht extends hf {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(e) {
    super(ir, e), this.items = [];
  }
  /**
   * A generic collection parsing method that can be extended
   * to other node classes that inherit from YAMLMap
   */
  static from(e, r, n) {
    const { keepUndefined: s, replacer: i } = n, o = new this(e), a = (l, c) => {
      if (typeof i == "function")
        c = i.call(r, l, c);
      else if (Array.isArray(i) && !i.includes(l))
        return;
      (c !== void 0 || s) && o.items.push(ol(l, c, n));
    };
    if (r instanceof Map)
      for (const [l, c] of r)
        a(l, c);
    else if (r && typeof r == "object")
      for (const l of Object.keys(r))
        a(l, r[l]);
    return typeof e.sortMapEntries == "function" && o.items.sort(e.sortMapEntries), o;
  }
  /**
   * Adds a value to the collection.
   *
   * @param overwrite - If not set `true`, using a key that is already in the
   *   collection will throw. Otherwise, overwrites the previous value.
   */
  add(e, r) {
    let n;
    je(e) ? n = e : !e || typeof e != "object" || !("key" in e) ? n = new nt(e, e?.value) : n = new nt(e.key, e.value);
    const s = kr(this.items, n.key), i = this.schema?.sortMapEntries;
    if (s) {
      if (!r)
        throw new Error(`Key ${n.key} already set`);
      Se(s.value) && ff(n.value) ? s.value.value = n.value : s.value = n.value;
    } else if (i) {
      const o = this.items.findIndex((a) => i(n, a) < 0);
      o === -1 ? this.items.push(n) : this.items.splice(o, 0, n);
    } else
      this.items.push(n);
  }
  delete(e) {
    const r = kr(this.items, e);
    return r ? this.items.splice(this.items.indexOf(r), 1).length > 0 : !1;
  }
  get(e, r) {
    const s = kr(this.items, e)?.value;
    return (!r && Se(s) ? s.value : s) ?? void 0;
  }
  has(e) {
    return !!kr(this.items, e);
  }
  set(e, r) {
    this.add(new nt(e, r), !0);
  }
  /**
   * @param ctx - Conversion context, originally set in Document#toJS()
   * @param {Class} Type - If set, forces the returned collection type
   * @returns Instance of Type, Map, or Object
   */
  toJSON(e, r, n) {
    const s = n ? new n() : r?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    r?.onCreate && r.onCreate(s);
    for (const i of this.items)
      bf(r, s, i);
    return s;
  }
  toString(e, r, n) {
    if (!e)
      return JSON.stringify(this);
    for (const s of this.items)
      if (!je(s))
        throw new Error(`Map items must all be pairs; found ${JSON.stringify(s)} instead`);
    return !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })), vf(this, e, {
      blockItemPrefix: "",
      flowChars: { start: "{", end: "}" },
      itemIndent: e.indent || "",
      onChompKeep: n,
      onComment: r
    });
  }
}
const dn = {
  collection: "map",
  default: !0,
  nodeClass: ht,
  tag: "tag:yaml.org,2002:map",
  resolve(t, e) {
    return rs(t) || e("Expected a mapping for this tag"), t;
  },
  createNode: (t, e, r) => ht.from(t, e, r)
};
class Tr extends hf {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(e) {
    super(cn, e), this.items = [];
  }
  add(e) {
    this.items.push(e);
  }
  /**
   * Removes a value from the collection.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   *
   * @returns `true` if the item was found and removed.
   */
  delete(e) {
    const r = ws(e);
    return typeof r != "number" ? !1 : this.items.splice(r, 1).length > 0;
  }
  get(e, r) {
    const n = ws(e);
    if (typeof n != "number")
      return;
    const s = this.items[n];
    return !r && Se(s) ? s.value : s;
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   */
  has(e) {
    const r = ws(e);
    return typeof r == "number" && r < this.items.length;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   *
   * If `key` does not contain a representation of an integer, this will throw.
   * It may be wrapped in a `Scalar`.
   */
  set(e, r) {
    const n = ws(e);
    if (typeof n != "number")
      throw new Error(`Expected a valid index, not ${e}.`);
    const s = this.items[n];
    Se(s) && ff(r) ? s.value = r : this.items[n] = r;
  }
  toJSON(e, r) {
    const n = [];
    r?.onCreate && r.onCreate(n);
    let s = 0;
    for (const i of this.items)
      n.push(mt(i, String(s++), r));
    return n;
  }
  toString(e, r, n) {
    return e ? vf(this, e, {
      blockItemPrefix: "- ",
      flowChars: { start: "[", end: "]" },
      itemIndent: (e.indent || "") + "  ",
      onChompKeep: n,
      onComment: r
    }) : JSON.stringify(this);
  }
  static from(e, r, n) {
    const { replacer: s } = n, i = new this(e);
    if (r && Symbol.iterator in Object(r)) {
      let o = 0;
      for (let a of r) {
        if (typeof s == "function") {
          const l = r instanceof Set ? a : String(o++);
          a = s.call(r, l, a);
        }
        i.items.push(Wn(a, void 0, n));
      }
    }
    return i;
  }
}
function ws(t) {
  let e = Se(t) ? t.value : t;
  return e && typeof e == "string" && (e = Number(e)), typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : null;
}
const fn = {
  collection: "seq",
  default: !0,
  nodeClass: Tr,
  tag: "tag:yaml.org,2002:seq",
  resolve(t, e) {
    return ns(t) || e("Expected a sequence for this tag"), t;
  },
  createNode: (t, e, r) => Tr.from(t, e, r)
}, ro = {
  identify: (t) => typeof t == "string",
  default: !0,
  tag: "tag:yaml.org,2002:str",
  resolve: (t) => t,
  stringify(t, e, r, n) {
    return e = Object.assign({ actualString: !0 }, e), il(t, e, r, n);
  }
}, no = {
  identify: (t) => t == null,
  createNode: () => new oe(null),
  default: !0,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => new oe(null),
  stringify: ({ source: t }, e) => typeof t == "string" && no.test.test(t) ? t : e.options.nullStr
}, al = {
  identify: (t) => typeof t == "boolean",
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: (t) => new oe(t[0] === "t" || t[0] === "T"),
  stringify({ source: t, value: e }, r) {
    if (t && al.test.test(t)) {
      const n = t[0] === "t" || t[0] === "T";
      if (e === n)
        return t;
    }
    return e ? r.options.trueStr : r.options.falseStr;
  }
};
function Nt({ format: t, minFractionDigits: e, tag: r, value: n }) {
  if (typeof n == "bigint")
    return String(n);
  const s = typeof n == "number" ? n : Number(n);
  if (!isFinite(s))
    return isNaN(s) ? ".nan" : s < 0 ? "-.inf" : ".inf";
  let i = Object.is(n, -0) ? "-0" : JSON.stringify(n);
  if (!t && e && (!r || r === "tag:yaml.org,2002:float") && /^\d/.test(i)) {
    let o = i.indexOf(".");
    o < 0 && (o = i.length, i += ".");
    let a = e - (i.length - o - 1);
    for (; a-- > 0; )
      i += "0";
  }
  return i;
}
const wf = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (t) => t.slice(-3).toLowerCase() === "nan" ? NaN : t[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: Nt
}, kf = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: (t) => parseFloat(t),
  stringify(t) {
    const e = Number(t.value);
    return isFinite(e) ? e.toExponential() : Nt(t);
  }
}, xf = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(t) {
    const e = new oe(parseFloat(t)), r = t.indexOf(".");
    return r !== -1 && t[t.length - 1] === "0" && (e.minFractionDigits = t.length - r - 1), e;
  },
  stringify: Nt
}, so = (t) => typeof t == "bigint" || Number.isInteger(t), ll = (t, e, r, { intAsBigInt: n }) => n ? BigInt(t) : parseInt(t.substring(e), r);
function Sf(t, e, r) {
  const { value: n } = t;
  return so(n) && n >= 0 ? r + n.toString(e) : Nt(t);
}
const _f = {
  identify: (t) => so(t) && t >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: (t, e, r) => ll(t, 2, 8, r),
  stringify: (t) => Sf(t, 8, "0o")
}, Ef = {
  identify: so,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: (t, e, r) => ll(t, 0, 10, r),
  stringify: Nt
}, $f = {
  identify: (t) => so(t) && t >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: (t, e, r) => ll(t, 2, 16, r),
  stringify: (t) => Sf(t, 16, "0x")
}, Lm = [
  dn,
  fn,
  ro,
  no,
  al,
  _f,
  Ef,
  $f,
  wf,
  kf,
  xf
];
function mc(t) {
  return typeof t == "bigint" || Number.isInteger(t);
}
const ks = ({ value: t }) => JSON.stringify(t), Rm = [
  {
    identify: (t) => typeof t == "string",
    default: !0,
    tag: "tag:yaml.org,2002:str",
    resolve: (t) => t,
    stringify: ks
  },
  {
    identify: (t) => t == null,
    createNode: () => new oe(null),
    default: !0,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: ks
  },
  {
    identify: (t) => typeof t == "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: (t) => t === "true",
    stringify: ks
  },
  {
    identify: mc,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (t, e, { intAsBigInt: r }) => r ? BigInt(t) : parseInt(t, 10),
    stringify: ({ value: t }) => mc(t) ? t.toString() : JSON.stringify(t)
  },
  {
    identify: (t) => typeof t == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (t) => parseFloat(t),
    stringify: ks
  }
], jm = {
  default: !0,
  tag: "",
  test: /^/,
  resolve(t, e) {
    return e(`Unresolved plain scalar ${JSON.stringify(t)}`), t;
  }
}, Mm = [dn, fn].concat(Rm, jm), cl = {
  identify: (t) => t instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: !1,
  tag: "tag:yaml.org,2002:binary",
  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve(t, e) {
    if (typeof atob == "function") {
      const r = atob(t.replace(/[\n\r]/g, "")), n = new Uint8Array(r.length);
      for (let s = 0; s < r.length; ++s)
        n[s] = r.charCodeAt(s);
      return n;
    } else
      return e("This environment does not support reading binary tags; either Buffer or atob is required"), t;
  },
  stringify({ comment: t, type: e, value: r }, n, s, i) {
    if (!r)
      return "";
    const o = r;
    let a;
    if (typeof btoa == "function") {
      let l = "";
      for (let c = 0; c < o.length; ++c)
        l += String.fromCharCode(o[c]);
      a = btoa(l);
    } else
      throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    if (e ?? (e = oe.BLOCK_LITERAL), e !== oe.QUOTE_DOUBLE) {
      const l = Math.max(n.options.lineWidth - n.indent.length, n.options.minContentWidth), c = Math.ceil(a.length / l), d = new Array(c);
      for (let u = 0, f = 0; u < c; ++u, f += l)
        d[u] = a.substr(f, l);
      a = d.join(e === oe.BLOCK_LITERAL ? `
` : " ");
    }
    return il({ comment: t, type: e, value: a }, n, s, i);
  }
};
function Af(t, e) {
  if (ns(t))
    for (let r = 0; r < t.items.length; ++r) {
      let n = t.items[r];
      if (!je(n)) {
        if (rs(n)) {
          n.items.length > 1 && e("Each pair must have its own sequence indicator");
          const s = n.items[0] || new nt(new oe(null));
          if (n.commentBefore && (s.key.commentBefore = s.key.commentBefore ? `${n.commentBefore}
${s.key.commentBefore}` : n.commentBefore), n.comment) {
            const i = s.value ?? s.key;
            i.comment = i.comment ? `${n.comment}
${i.comment}` : n.comment;
          }
          n = s;
        }
        t.items[r] = je(n) ? n : new nt(n);
      }
    }
  else
    e("Expected a sequence for this tag");
  return t;
}
function Tf(t, e, r) {
  const { replacer: n } = r, s = new Tr(t);
  s.tag = "tag:yaml.org,2002:pairs";
  let i = 0;
  if (e && Symbol.iterator in Object(e))
    for (let o of e) {
      typeof n == "function" && (o = n.call(e, String(i++), o));
      let a, l;
      if (Array.isArray(o))
        if (o.length === 2)
          a = o[0], l = o[1];
        else
          throw new TypeError(`Expected [key, value] tuple: ${o}`);
      else if (o && o instanceof Object) {
        const c = Object.keys(o);
        if (c.length === 1)
          a = c[0], l = o[a];
        else
          throw new TypeError(`Expected tuple with one key, not ${c.length} keys`);
      } else
        a = o;
      s.items.push(ol(a, l, r));
    }
  return s;
}
const ul = {
  collection: "seq",
  default: !1,
  tag: "tag:yaml.org,2002:pairs",
  resolve: Af,
  createNode: Tf
};
class Qr extends Tr {
  constructor() {
    super(), this.add = ht.prototype.add.bind(this), this.delete = ht.prototype.delete.bind(this), this.get = ht.prototype.get.bind(this), this.has = ht.prototype.has.bind(this), this.set = ht.prototype.set.bind(this), this.tag = Qr.tag;
  }
  /**
   * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
   * but TypeScript won't allow widening the signature of a child method.
   */
  toJSON(e, r) {
    if (!r)
      return super.toJSON(e);
    const n = /* @__PURE__ */ new Map();
    r?.onCreate && r.onCreate(n);
    for (const s of this.items) {
      let i, o;
      if (je(s) ? (i = mt(s.key, "", r), o = mt(s.value, i, r)) : i = mt(s, "", r), n.has(i))
        throw new Error("Ordered maps must not include duplicate keys");
      n.set(i, o);
    }
    return n;
  }
  static from(e, r, n) {
    const s = Tf(e, r, n), i = new this();
    return i.items = s.items, i;
  }
}
Qr.tag = "tag:yaml.org,2002:omap";
const dl = {
  collection: "seq",
  identify: (t) => t instanceof Map,
  nodeClass: Qr,
  default: !1,
  tag: "tag:yaml.org,2002:omap",
  resolve(t, e) {
    const r = Af(t, e), n = [];
    for (const { key: s } of r.items)
      Se(s) && (n.includes(s.value) ? e(`Ordered maps must not include duplicate keys: ${s.value}`) : n.push(s.value));
    return Object.assign(new Qr(), r);
  },
  createNode: (t, e, r) => Qr.from(t, e, r)
};
function Of({ value: t, source: e }, r) {
  return e && (t ? Cf : Nf).test.test(e) ? e : t ? r.options.trueStr : r.options.falseStr;
}
const Cf = {
  identify: (t) => t === !0,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => new oe(!0),
  stringify: Of
}, Nf = {
  identify: (t) => t === !1,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: () => new oe(!1),
  stringify: Of
}, Dm = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (t) => t.slice(-3).toLowerCase() === "nan" ? NaN : t[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: Nt
}, Bm = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: (t) => parseFloat(t.replace(/_/g, "")),
  stringify(t) {
    const e = Number(t.value);
    return isFinite(e) ? e.toExponential() : Nt(t);
  }
}, qm = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(t) {
    const e = new oe(parseFloat(t.replace(/_/g, ""))), r = t.indexOf(".");
    if (r !== -1) {
      const n = t.substring(r + 1).replace(/_/g, "");
      n[n.length - 1] === "0" && (e.minFractionDigits = n.length);
    }
    return e;
  },
  stringify: Nt
}, ss = (t) => typeof t == "bigint" || Number.isInteger(t);
function io(t, e, r, { intAsBigInt: n }) {
  const s = t[0];
  if ((s === "-" || s === "+") && (e += 1), t = t.substring(e).replace(/_/g, ""), n) {
    switch (r) {
      case 2:
        t = `0b${t}`;
        break;
      case 8:
        t = `0o${t}`;
        break;
      case 16:
        t = `0x${t}`;
        break;
    }
    const o = BigInt(t);
    return s === "-" ? BigInt(-1) * o : o;
  }
  const i = parseInt(t, r);
  return s === "-" ? -1 * i : i;
}
function fl(t, e, r) {
  const { value: n } = t;
  if (ss(n)) {
    const s = n.toString(e);
    return n < 0 ? "-" + r + s.substr(1) : r + s;
  }
  return Nt(t);
}
const Fm = {
  identify: ss,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: (t, e, r) => io(t, 2, 2, r),
  stringify: (t) => fl(t, 2, "0b")
}, Um = {
  identify: ss,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: (t, e, r) => io(t, 1, 8, r),
  stringify: (t) => fl(t, 8, "0")
}, Km = {
  identify: ss,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: (t, e, r) => io(t, 0, 10, r),
  stringify: Nt
}, zm = {
  identify: ss,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: (t, e, r) => io(t, 2, 16, r),
  stringify: (t) => fl(t, 16, "0x")
};
class Xr extends ht {
  constructor(e) {
    super(e), this.tag = Xr.tag;
  }
  add(e) {
    let r;
    je(e) ? r = e : e && typeof e == "object" && "key" in e && "value" in e && e.value === null ? r = new nt(e.key, null) : r = new nt(e, null), kr(this.items, r.key) || this.items.push(r);
  }
  /**
   * If `keepPair` is `true`, returns the Pair matching `key`.
   * Otherwise, returns the value of that Pair's key.
   */
  get(e, r) {
    const n = kr(this.items, e);
    return !r && je(n) ? Se(n.key) ? n.key.value : n.key : n;
  }
  set(e, r) {
    if (typeof r != "boolean")
      throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof r}`);
    const n = kr(this.items, e);
    n && !r ? this.items.splice(this.items.indexOf(n), 1) : !n && r && this.items.push(new nt(e));
  }
  toJSON(e, r) {
    return super.toJSON(e, r, Set);
  }
  toString(e, r, n) {
    if (!e)
      return JSON.stringify(this);
    if (this.hasAllNullValues(!0))
      return super.toString(Object.assign({}, e, { allNullValues: !0 }), r, n);
    throw new Error("Set items must all have null values");
  }
  static from(e, r, n) {
    const { replacer: s } = n, i = new this(e);
    if (r && Symbol.iterator in Object(r))
      for (let o of r)
        typeof s == "function" && (o = s.call(r, o, o)), i.items.push(ol(o, null, n));
    return i;
  }
}
Xr.tag = "tag:yaml.org,2002:set";
const hl = {
  collection: "map",
  identify: (t) => t instanceof Set,
  nodeClass: Xr,
  default: !1,
  tag: "tag:yaml.org,2002:set",
  createNode: (t, e, r) => Xr.from(t, e, r),
  resolve(t, e) {
    if (rs(t)) {
      if (t.hasAllNullValues(!0))
        return Object.assign(new Xr(), t);
      e("Set items must all have null values");
    } else
      e("Expected a mapping for this tag");
    return t;
  }
};
function pl(t, e) {
  const r = t[0], n = r === "-" || r === "+" ? t.substring(1) : t, s = (o) => e ? BigInt(o) : Number(o), i = n.replace(/_/g, "").split(":").reduce((o, a) => o * s(60) + s(a), s(0));
  return r === "-" ? s(-1) * i : i;
}
function If(t) {
  let { value: e } = t, r = (o) => o;
  if (typeof e == "bigint")
    r = (o) => BigInt(o);
  else if (isNaN(e) || !isFinite(e))
    return Nt(t);
  let n = "";
  e < 0 && (n = "-", e *= r(-1));
  const s = r(60), i = [e % s];
  return e < 60 ? i.unshift(0) : (e = (e - i[0]) / s, i.unshift(e % s), e >= 60 && (e = (e - i[0]) / s, i.unshift(e))), n + i.map((o) => String(o).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
const Pf = {
  identify: (t) => typeof t == "bigint" || Number.isInteger(t),
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: (t, e, { intAsBigInt: r }) => pl(t, r),
  stringify: If
}, Lf = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: (t) => pl(t, !1),
  stringify: If
}, oo = {
  identify: (t) => t instanceof Date,
  default: !0,
  tag: "tag:yaml.org,2002:timestamp",
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(t) {
    const e = t.match(oo.test);
    if (!e)
      throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, r, n, s, i, o, a] = e.map(Number), l = e[7] ? Number((e[7] + "00").substr(1, 3)) : 0;
    let c = Date.UTC(r, n - 1, s, i || 0, o || 0, a || 0, l);
    const d = e[8];
    if (d && d !== "Z") {
      let u = pl(d, !1);
      Math.abs(u) < 30 && (u *= 60), c -= 6e4 * u;
    }
    return new Date(c);
  },
  stringify: ({ value: t }) => t?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
}, gc = [
  dn,
  fn,
  ro,
  no,
  Cf,
  Nf,
  Fm,
  Um,
  Km,
  zm,
  Dm,
  Bm,
  qm,
  cl,
  Xt,
  dl,
  ul,
  hl,
  Pf,
  Lf,
  oo
], yc = /* @__PURE__ */ new Map([
  ["core", Lm],
  ["failsafe", [dn, fn, ro]],
  ["json", Mm],
  ["yaml11", gc],
  ["yaml-1.1", gc]
]), bc = {
  binary: cl,
  bool: al,
  float: xf,
  floatExp: kf,
  floatNaN: wf,
  floatTime: Lf,
  int: Ef,
  intHex: $f,
  intOct: _f,
  intTime: Pf,
  map: dn,
  merge: Xt,
  null: no,
  omap: dl,
  pairs: ul,
  seq: fn,
  set: hl,
  timestamp: oo
}, Vm = {
  "tag:yaml.org,2002:binary": cl,
  "tag:yaml.org,2002:merge": Xt,
  "tag:yaml.org,2002:omap": dl,
  "tag:yaml.org,2002:pairs": ul,
  "tag:yaml.org,2002:set": hl,
  "tag:yaml.org,2002:timestamp": oo
};
function Ro(t, e, r) {
  const n = yc.get(e);
  if (n && !t)
    return r && !n.includes(Xt) ? n.concat(Xt) : n.slice();
  let s = n;
  if (!s)
    if (Array.isArray(t))
      s = [];
    else {
      const i = Array.from(yc.keys()).filter((o) => o !== "yaml11").map((o) => JSON.stringify(o)).join(", ");
      throw new Error(`Unknown schema "${e}"; use one of ${i} or define customTags array`);
    }
  if (Array.isArray(t))
    for (const i of t)
      s = s.concat(i);
  else typeof t == "function" && (s = t(s.slice()));
  return r && (s = s.concat(Xt)), s.reduce((i, o) => {
    const a = typeof o == "string" ? bc[o] : o;
    if (!a) {
      const l = JSON.stringify(o), c = Object.keys(bc).map((d) => JSON.stringify(d)).join(", ");
      throw new Error(`Unknown custom tag ${l}; use one of ${c}`);
    }
    return i.includes(a) || i.push(a), i;
  }, []);
}
const Hm = (t, e) => t.key < e.key ? -1 : t.key > e.key ? 1 : 0;
class ml {
  constructor({ compat: e, customTags: r, merge: n, resolveKnownTags: s, schema: i, sortMapEntries: o, toStringDefaults: a }) {
    this.compat = Array.isArray(e) ? Ro(e, "compat") : e ? Ro(null, e) : null, this.name = typeof i == "string" && i || "core", this.knownTags = s ? Vm : {}, this.tags = Ro(r, this.name, n), this.toStringOptions = a ?? null, Object.defineProperty(this, ir, { value: dn }), Object.defineProperty(this, Dt, { value: ro }), Object.defineProperty(this, cn, { value: fn }), this.sortMapEntries = typeof o == "function" ? o : o === !0 ? Hm : null;
  }
  clone() {
    const e = Object.create(ml.prototype, Object.getOwnPropertyDescriptors(this));
    return e.tags = this.tags.slice(), e;
  }
}
function Jm(t, e) {
  const r = [];
  let n = e.directives === !0;
  if (e.directives !== !1 && t.directives) {
    const l = t.directives.toString(t);
    l ? (r.push(l), n = !0) : t.directives.docStart && (n = !0);
  }
  n && r.push("---");
  const s = mf(t, e), { commentString: i } = s.options;
  if (t.commentBefore) {
    r.length !== 1 && r.unshift("");
    const l = i(t.commentBefore);
    r.unshift(Yt(l, ""));
  }
  let o = !1, a = null;
  if (t.contents) {
    if (Le(t.contents)) {
      if (t.contents.spaceBefore && n && r.push(""), t.contents.commentBefore) {
        const d = i(t.contents.commentBefore);
        r.push(Yt(d, ""));
      }
      s.forceBlockIndent = !!t.comment, a = t.contents.comment;
    }
    const l = a ? void 0 : () => o = !0;
    let c = nn(t.contents, s, () => a = null, l);
    a && (c += wr(c, "", i(a))), (c[0] === "|" || c[0] === ">") && r[r.length - 1] === "---" ? r[r.length - 1] = `--- ${c}` : r.push(c);
  } else
    r.push(nn(t.contents, s));
  if (t.directives?.docEnd)
    if (t.comment) {
      const l = i(t.comment);
      l.includes(`
`) ? (r.push("..."), r.push(Yt(l, ""))) : r.push(`... ${l}`);
    } else
      r.push("...");
  else {
    let l = t.comment;
    l && o && (l = l.replace(/^\n+/, "")), l && ((!o || a) && r[r.length - 1] !== "" && r.push(""), r.push(Yt(i(l), "")));
  }
  return r.join(`
`) + `
`;
}
class ao {
  constructor(e, r, n) {
    this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, bt, { value: ka });
    let s = null;
    typeof r == "function" || Array.isArray(r) ? s = r : n === void 0 && r && (n = r, r = void 0);
    const i = Object.assign({
      intAsBigInt: !1,
      keepSourceTokens: !1,
      logLevel: "warn",
      prettyErrors: !0,
      strict: !0,
      stringKeys: !1,
      uniqueKeys: !0,
      version: "1.2"
    }, n);
    this.options = i;
    let { version: o } = i;
    n?._directives ? (this.directives = n._directives.atDocument(), this.directives.yaml.explicit && (o = this.directives.yaml.version)) : this.directives = new Xe({ version: o }), this.setSchema(o, n), this.contents = e === void 0 ? null : this.createNode(e, s, n);
  }
  /**
   * Create a deep copy of this Document and its contents.
   *
   * Custom Node values that inherit from `Object` still refer to their original instances.
   */
  clone() {
    const e = Object.create(ao.prototype, {
      [bt]: { value: ka }
    });
    return e.commentBefore = this.commentBefore, e.comment = this.comment, e.errors = this.errors.slice(), e.warnings = this.warnings.slice(), e.options = Object.assign({}, this.options), this.directives && (e.directives = this.directives.clone()), e.schema = this.schema.clone(), e.contents = Le(this.contents) ? this.contents.clone(e.schema) : this.contents, this.range && (e.range = this.range.slice()), e;
  }
  /** Adds a value to the document. */
  add(e) {
    Br(this.contents) && this.contents.add(e);
  }
  /** Adds a value to the document. */
  addIn(e, r) {
    Br(this.contents) && this.contents.addIn(e, r);
  }
  /**
   * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
   *
   * If `node` already has an anchor, `name` is ignored.
   * Otherwise, the `node.anchor` value will be set to `name`,
   * or if an anchor with that name is already present in the document,
   * `name` will be used as a prefix for a new unique anchor.
   * If `name` is undefined, the generated anchor will use 'a' as a prefix.
   */
  createAlias(e, r) {
    if (!e.anchor) {
      const n = uf(this);
      e.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !r || n.has(r) ? df(r || "a", n) : r;
    }
    return new sl(e.anchor);
  }
  createNode(e, r, n) {
    let s;
    if (typeof r == "function")
      e = r.call({ "": e }, "", e), s = r;
    else if (Array.isArray(r)) {
      const m = (h) => typeof h == "number" || h instanceof String || h instanceof Number, w = r.filter(m).map(String);
      w.length > 0 && (r = r.concat(w)), s = r;
    } else n === void 0 && r && (n = r, r = void 0);
    const { aliasDuplicateObjects: i, anchorPrefix: o, flow: a, keepUndefined: l, onTagObj: c, tag: d } = n ?? {}, { onAnchor: u, setAnchors: f, sourceObjects: p } = km(
      this,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      o || "a"
    ), b = {
      aliasDuplicateObjects: i ?? !0,
      keepUndefined: l ?? !1,
      onAnchor: u,
      onTagObj: c,
      replacer: s,
      schema: this.schema,
      sourceObjects: p
    }, g = Wn(e, d, b);
    return a && Ie(g) && (g.flow = !0), f(), g;
  }
  /**
   * Convert a key and a value into a `Pair` using the current schema,
   * recursively wrapping all values as `Scalar` or `Collection` nodes.
   */
  createPair(e, r, n = {}) {
    const s = this.createNode(e, null, n), i = this.createNode(r, null, n);
    return new nt(s, i);
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  delete(e) {
    return Br(this.contents) ? this.contents.delete(e) : !1;
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(e) {
    return In(e) ? this.contents == null ? !1 : (this.contents = null, !0) : Br(this.contents) ? this.contents.deleteIn(e) : !1;
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  get(e, r) {
    return Ie(this.contents) ? this.contents.get(e, r) : void 0;
  }
  /**
   * Returns item at `path`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(e, r) {
    return In(e) ? !r && Se(this.contents) ? this.contents.value : this.contents : Ie(this.contents) ? this.contents.getIn(e, r) : void 0;
  }
  /**
   * Checks if the document includes a value with the key `key`.
   */
  has(e) {
    return Ie(this.contents) ? this.contents.has(e) : !1;
  }
  /**
   * Checks if the document includes a value at `path`.
   */
  hasIn(e) {
    return In(e) ? this.contents !== void 0 : Ie(this.contents) ? this.contents.hasIn(e) : !1;
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  set(e, r) {
    this.contents == null ? this.contents = Pi(this.schema, [e], r) : Br(this.contents) && this.contents.set(e, r);
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(e, r) {
    In(e) ? this.contents = r : this.contents == null ? this.contents = Pi(this.schema, Array.from(e), r) : Br(this.contents) && this.contents.setIn(e, r);
  }
  /**
   * Change the YAML version and schema used by the document.
   * A `null` version disables support for directives, explicit tags, anchors, and aliases.
   * It also requires the `schema` option to be given as a `Schema` instance value.
   *
   * Overrides all previously set schema options.
   */
  setSchema(e, r = {}) {
    typeof e == "number" && (e = String(e));
    let n;
    switch (e) {
      case "1.1":
        this.directives ? this.directives.yaml.version = "1.1" : this.directives = new Xe({ version: "1.1" }), n = { resolveKnownTags: !1, schema: "yaml-1.1" };
        break;
      case "1.2":
      case "next":
        this.directives ? this.directives.yaml.version = e : this.directives = new Xe({ version: e }), n = { resolveKnownTags: !0, schema: "core" };
        break;
      case null:
        this.directives && delete this.directives, n = null;
        break;
      default: {
        const s = JSON.stringify(e);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${s}`);
      }
    }
    if (r.schema instanceof Object)
      this.schema = r.schema;
    else if (n)
      this.schema = new ml(Object.assign(n, r));
    else
      throw new Error("With a null YAML version, the { schema: Schema } option is required");
  }
  // json & jsonArg are only used from toJSON()
  toJS({ json: e, jsonArg: r, mapAsMap: n, maxAliasCount: s, onAnchor: i, reviver: o } = {}) {
    const a = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !e,
      mapAsMap: n === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof s == "number" ? s : 100
    }, l = mt(this.contents, r ?? "", a);
    if (typeof i == "function")
      for (const { count: c, res: d } of a.anchors.values())
        i(d, c);
    return typeof o == "function" ? Hr(o, { "": l }, "", l) : l;
  }
  /**
   * A JSON representation of the document `contents`.
   *
   * @param jsonArg Used by `JSON.stringify` to indicate the array index or
   *   property name.
   */
  toJSON(e, r) {
    return this.toJS({ json: !0, jsonArg: e, mapAsMap: !1, onAnchor: r });
  }
  /** A YAML representation of the document. */
  toString(e = {}) {
    if (this.errors.length > 0)
      throw new Error("Document with errors cannot be stringified");
    if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
      const r = JSON.stringify(e.indent);
      throw new Error(`"indent" option must be a positive integer, not ${r}`);
    }
    return Jm(this, e);
  }
}
function Br(t) {
  if (Ie(t))
    return !0;
  throw new Error("Expected a YAML collection as document contents");
}
class Rf extends Error {
  constructor(e, r, n, s) {
    super(), this.name = e, this.code = n, this.message = s, this.pos = r;
  }
}
class Pn extends Rf {
  constructor(e, r, n) {
    super("YAMLParseError", e, r, n);
  }
}
class Wm extends Rf {
  constructor(e, r, n) {
    super("YAMLWarning", e, r, n);
  }
}
const vc = (t, e) => (r) => {
  if (r.pos[0] === -1)
    return;
  r.linePos = r.pos.map((a) => e.linePos(a));
  const { line: n, col: s } = r.linePos[0];
  r.message += ` at line ${n}, column ${s}`;
  let i = s - 1, o = t.substring(e.lineStarts[n - 1], e.lineStarts[n]).replace(/[\n\r]+$/, "");
  if (i >= 60 && o.length > 80) {
    const a = Math.min(i - 39, o.length - 79);
    o = "…" + o.substring(a), i -= a - 1;
  }
  if (o.length > 80 && (o = o.substring(0, 79) + "…"), n > 1 && /^ *$/.test(o.substring(0, i))) {
    let a = t.substring(e.lineStarts[n - 2], e.lineStarts[n - 1]);
    a.length > 80 && (a = a.substring(0, 79) + `…
`), o = a + o;
  }
  if (/[^ ]/.test(o)) {
    let a = 1;
    const l = r.linePos[1];
    l?.line === n && l.col > s && (a = Math.max(1, Math.min(l.col - s, 80 - i)));
    const c = " ".repeat(i) + "^".repeat(a);
    r.message += `:

${o}
${c}
`;
  }
};
function sn(t, { flow: e, indicator: r, next: n, offset: s, onError: i, parentIndent: o, startOnNewline: a }) {
  let l = !1, c = a, d = a, u = "", f = "", p = !1, b = !1, g = null, m = null, w = null, h = null, y = null, k = null, v = null;
  for (const _ of t)
    switch (b && (_.type !== "space" && _.type !== "newline" && _.type !== "comma" && i(_.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), b = !1), g && (c && _.type !== "comment" && _.type !== "newline" && i(g, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), g = null), _.type) {
      case "space":
        !e && (r !== "doc-start" || n?.type !== "flow-collection") && _.source.includes("	") && (g = _), d = !0;
        break;
      case "comment": {
        d || i(_, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
        const T = _.source.substring(1) || " ";
        u ? u += f + T : u = T, f = "", c = !1;
        break;
      }
      case "newline":
        c ? u ? u += _.source : (!k || r !== "seq-item-ind") && (l = !0) : f += _.source, c = !0, p = !0, (m || w) && (h = _), d = !0;
        break;
      case "anchor":
        m && i(_, "MULTIPLE_ANCHORS", "A node can have at most one anchor"), _.source.endsWith(":") && i(_.offset + _.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0), m = _, v ?? (v = _.offset), c = !1, d = !1, b = !0;
        break;
      case "tag": {
        w && i(_, "MULTIPLE_TAGS", "A node can have at most one tag"), w = _, v ?? (v = _.offset), c = !1, d = !1, b = !0;
        break;
      }
      case r:
        (m || w) && i(_, "BAD_PROP_ORDER", `Anchors and tags must be after the ${_.source} indicator`), k && i(_, "UNEXPECTED_TOKEN", `Unexpected ${_.source} in ${e ?? "collection"}`), k = _, c = r === "seq-item-ind" || r === "explicit-key-ind", d = !1;
        break;
      case "comma":
        if (e) {
          y && i(_, "UNEXPECTED_TOKEN", `Unexpected , in ${e}`), y = _, c = !1, d = !1;
          break;
        }
      // else fallthrough
      default:
        i(_, "UNEXPECTED_TOKEN", `Unexpected ${_.type} token`), c = !1, d = !1;
    }
  const x = t[t.length - 1], S = x ? x.offset + x.source.length : s;
  return b && n && n.type !== "space" && n.type !== "newline" && n.type !== "comma" && (n.type !== "scalar" || n.source !== "") && i(n.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), g && (c && g.indent <= o || n?.type === "block-map" || n?.type === "block-seq") && i(g, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), {
    comma: y,
    found: k,
    spaceBefore: l,
    comment: u,
    hasNewline: p,
    anchor: m,
    tag: w,
    newlineAfterProp: h,
    end: S,
    start: v ?? S
  };
}
function Gn(t) {
  if (!t)
    return null;
  switch (t.type) {
    case "alias":
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      if (t.source.includes(`
`))
        return !0;
      if (t.end) {
        for (const e of t.end)
          if (e.type === "newline")
            return !0;
      }
      return !1;
    case "flow-collection":
      for (const e of t.items) {
        for (const r of e.start)
          if (r.type === "newline")
            return !0;
        if (e.sep) {
          for (const r of e.sep)
            if (r.type === "newline")
              return !0;
        }
        if (Gn(e.key) || Gn(e.value))
          return !0;
      }
      return !1;
    default:
      return !0;
  }
}
function Ea(t, e, r) {
  if (e?.type === "flow-collection") {
    const n = e.end[0];
    n.indent === t && (n.source === "]" || n.source === "}") && Gn(e) && r(n, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
  }
}
function jf(t, e, r) {
  const { uniqueKeys: n } = t.options;
  if (n === !1)
    return !1;
  const s = typeof n == "function" ? n : (i, o) => i === o || Se(i) && Se(o) && i.value === o.value;
  return e.some((i) => s(i.key, r));
}
const wc = "All mapping items must start at the same column";
function Gm({ composeNode: t, composeEmptyNode: e }, r, n, s, i) {
  const o = i?.nodeClass ?? ht, a = new o(r.schema);
  r.atRoot && (r.atRoot = !1);
  let l = n.offset, c = null;
  for (const d of n.items) {
    const { start: u, key: f, sep: p, value: b } = d, g = sn(u, {
      indicator: "explicit-key-ind",
      next: f ?? p?.[0],
      offset: l,
      onError: s,
      parentIndent: n.indent,
      startOnNewline: !0
    }), m = !g.found;
    if (m) {
      if (f && (f.type === "block-seq" ? s(l, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key") : "indent" in f && f.indent !== n.indent && s(l, "BAD_INDENT", wc)), !g.anchor && !g.tag && !p) {
        c = g.end, g.comment && (a.comment ? a.comment += `
` + g.comment : a.comment = g.comment);
        continue;
      }
      (g.newlineAfterProp || Gn(f)) && s(f ?? u[u.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
    } else g.found?.indent !== n.indent && s(l, "BAD_INDENT", wc);
    r.atKey = !0;
    const w = g.end, h = f ? t(r, f, g, s) : e(r, w, u, null, g, s);
    r.schema.compat && Ea(n.indent, f, s), r.atKey = !1, jf(r, a.items, h) && s(w, "DUPLICATE_KEY", "Map keys must be unique");
    const y = sn(p ?? [], {
      indicator: "map-value-ind",
      next: b,
      offset: h.range[2],
      onError: s,
      parentIndent: n.indent,
      startOnNewline: !f || f.type === "block-scalar"
    });
    if (l = y.end, y.found) {
      m && (b?.type === "block-map" && !y.hasNewline && s(l, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"), r.options.strict && g.start < y.found.offset - 1024 && s(h.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));
      const k = b ? t(r, b, y, s) : e(r, l, p, null, y, s);
      r.schema.compat && Ea(n.indent, b, s), l = k.range[2];
      const v = new nt(h, k);
      r.options.keepSourceTokens && (v.srcToken = d), a.items.push(v);
    } else {
      m && s(h.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"), y.comment && (h.comment ? h.comment += `
` + y.comment : h.comment = y.comment);
      const k = new nt(h);
      r.options.keepSourceTokens && (k.srcToken = d), a.items.push(k);
    }
  }
  return c && c < l && s(c, "IMPOSSIBLE", "Map comment with trailing content"), a.range = [n.offset, l, c ?? l], a;
}
function Ym({ composeNode: t, composeEmptyNode: e }, r, n, s, i) {
  const o = i?.nodeClass ?? Tr, a = new o(r.schema);
  r.atRoot && (r.atRoot = !1), r.atKey && (r.atKey = !1);
  let l = n.offset, c = null;
  for (const { start: d, value: u } of n.items) {
    const f = sn(d, {
      indicator: "seq-item-ind",
      next: u,
      offset: l,
      onError: s,
      parentIndent: n.indent,
      startOnNewline: !0
    });
    if (!f.found)
      if (f.anchor || f.tag || u)
        u?.type === "block-seq" ? s(f.end, "BAD_INDENT", "All sequence items must start at the same column") : s(l, "MISSING_CHAR", "Sequence item without - indicator");
      else {
        c = f.end, f.comment && (a.comment = f.comment);
        continue;
      }
    const p = u ? t(r, u, f, s) : e(r, f.end, d, null, f, s);
    r.schema.compat && Ea(n.indent, u, s), l = p.range[2], a.items.push(p);
  }
  return a.range = [n.offset, l, c ?? l], a;
}
function is(t, e, r, n) {
  let s = "";
  if (t) {
    let i = !1, o = "";
    for (const a of t) {
      const { source: l, type: c } = a;
      switch (c) {
        case "space":
          i = !0;
          break;
        case "comment": {
          r && !i && n(a, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const d = l.substring(1) || " ";
          s ? s += o + d : s = d, o = "";
          break;
        }
        case "newline":
          s && (o += l), i = !0;
          break;
        default:
          n(a, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
      }
      e += l.length;
    }
  }
  return { comment: s, offset: e };
}
const jo = "Block collections are not allowed within flow collections", Mo = (t) => t && (t.type === "block-map" || t.type === "block-seq");
function Qm({ composeNode: t, composeEmptyNode: e }, r, n, s, i) {
  const o = n.start.source === "{", a = o ? "flow map" : "flow sequence", l = i?.nodeClass ?? (o ? ht : Tr), c = new l(r.schema);
  c.flow = !0;
  const d = r.atRoot;
  d && (r.atRoot = !1), r.atKey && (r.atKey = !1);
  let u = n.offset + n.start.source.length;
  for (let m = 0; m < n.items.length; ++m) {
    const w = n.items[m], { start: h, key: y, sep: k, value: v } = w, x = sn(h, {
      flow: a,
      indicator: "explicit-key-ind",
      next: y ?? k?.[0],
      offset: u,
      onError: s,
      parentIndent: n.indent,
      startOnNewline: !1
    });
    if (!x.found) {
      if (!x.anchor && !x.tag && !k && !v) {
        m === 0 && x.comma ? s(x.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`) : m < n.items.length - 1 && s(x.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${a}`), x.comment && (c.comment ? c.comment += `
` + x.comment : c.comment = x.comment), u = x.end;
        continue;
      }
      !o && r.options.strict && Gn(y) && s(
        y,
        // checked by containsNewline()
        "MULTILINE_IMPLICIT_KEY",
        "Implicit keys of flow sequence pairs need to be on a single line"
      );
    }
    if (m === 0)
      x.comma && s(x.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`);
    else if (x.comma || s(x.start, "MISSING_CHAR", `Missing , between ${a} items`), x.comment) {
      let S = "";
      e: for (const _ of h)
        switch (_.type) {
          case "comma":
          case "space":
            break;
          case "comment":
            S = _.source.substring(1);
            break e;
          default:
            break e;
        }
      if (S) {
        let _ = c.items[c.items.length - 1];
        je(_) && (_ = _.value ?? _.key), _.comment ? _.comment += `
` + S : _.comment = S, x.comment = x.comment.substring(S.length + 1);
      }
    }
    if (!o && !k && !x.found) {
      const S = v ? t(r, v, x, s) : e(r, x.end, k, null, x, s);
      c.items.push(S), u = S.range[2], Mo(v) && s(S.range, "BLOCK_IN_FLOW", jo);
    } else {
      r.atKey = !0;
      const S = x.end, _ = y ? t(r, y, x, s) : e(r, S, h, null, x, s);
      Mo(y) && s(_.range, "BLOCK_IN_FLOW", jo), r.atKey = !1;
      const T = sn(k ?? [], {
        flow: a,
        indicator: "map-value-ind",
        next: v,
        offset: _.range[2],
        onError: s,
        parentIndent: n.indent,
        startOnNewline: !1
      });
      if (T.found) {
        if (!o && !x.found && r.options.strict) {
          if (k)
            for (const D of k) {
              if (D === T.found)
                break;
              if (D.type === "newline") {
                s(D, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                break;
              }
            }
          x.start < T.found.offset - 1024 && s(T.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
        }
      } else v && ("source" in v && v.source?.[0] === ":" ? s(v, "MISSING_CHAR", `Missing space after : in ${a}`) : s(T.start, "MISSING_CHAR", `Missing , or : between ${a} items`));
      const P = v ? t(r, v, T, s) : T.found ? e(r, T.end, k, null, T, s) : null;
      P ? Mo(v) && s(P.range, "BLOCK_IN_FLOW", jo) : T.comment && (_.comment ? _.comment += `
` + T.comment : _.comment = T.comment);
      const R = new nt(_, P);
      if (r.options.keepSourceTokens && (R.srcToken = w), o) {
        const D = c;
        jf(r, D.items, _) && s(S, "DUPLICATE_KEY", "Map keys must be unique"), D.items.push(R);
      } else {
        const D = new ht(r.schema);
        D.flow = !0, D.items.push(R);
        const U = (P ?? _).range;
        D.range = [_.range[0], U[1], U[2]], c.items.push(D);
      }
      u = P ? P.range[2] : T.end;
    }
  }
  const f = o ? "}" : "]", [p, ...b] = n.end;
  let g = u;
  if (p?.source === f)
    g = p.offset + p.source.length;
  else {
    const m = a[0].toUpperCase() + a.substring(1), w = d ? `${m} must end with a ${f}` : `${m} in block collection must be sufficiently indented and end with a ${f}`;
    s(u, d ? "MISSING_CHAR" : "BAD_INDENT", w), p && p.source.length !== 1 && b.unshift(p);
  }
  if (b.length > 0) {
    const m = is(b, g, r.options.strict, s);
    m.comment && (c.comment ? c.comment += `
` + m.comment : c.comment = m.comment), c.range = [n.offset, g, m.offset];
  } else
    c.range = [n.offset, g, g];
  return c;
}
function Do(t, e, r, n, s, i) {
  const o = r.type === "block-map" ? Gm(t, e, r, n, i) : r.type === "block-seq" ? Ym(t, e, r, n, i) : Qm(t, e, r, n, i), a = o.constructor;
  return s === "!" || s === a.tagName ? (o.tag = a.tagName, o) : (s && (o.tag = s), o);
}
function Xm(t, e, r, n, s) {
  const i = n.tag, o = i ? e.directives.tagName(i.source, (f) => s(i, "TAG_RESOLVE_FAILED", f)) : null;
  if (r.type === "block-seq") {
    const { anchor: f, newlineAfterProp: p } = n, b = f && i ? f.offset > i.offset ? f : i : f ?? i;
    b && (!p || p.offset < b.offset) && s(b, "MISSING_CHAR", "Missing newline after block sequence props");
  }
  const a = r.type === "block-map" ? "map" : r.type === "block-seq" ? "seq" : r.start.source === "{" ? "map" : "seq";
  if (!i || !o || o === "!" || o === ht.tagName && a === "map" || o === Tr.tagName && a === "seq")
    return Do(t, e, r, s, o);
  let l = e.schema.tags.find((f) => f.tag === o && f.collection === a);
  if (!l) {
    const f = e.schema.knownTags[o];
    if (f?.collection === a)
      e.schema.tags.push(Object.assign({}, f, { default: !1 })), l = f;
    else
      return f ? s(i, "BAD_COLLECTION_TYPE", `${f.tag} used for ${a} collection, but expects ${f.collection ?? "scalar"}`, !0) : s(i, "TAG_RESOLVE_FAILED", `Unresolved tag: ${o}`, !0), Do(t, e, r, s, o);
  }
  const c = Do(t, e, r, s, o, l), d = l.resolve?.(c, (f) => s(i, "TAG_RESOLVE_FAILED", f), e.options) ?? c, u = Le(d) ? d : new oe(d);
  return u.range = c.range, u.tag = o, l?.format && (u.format = l.format), u;
}
function Zm(t, e, r) {
  const n = e.offset, s = eg(e, t.options.strict, r);
  if (!s)
    return { value: "", type: null, comment: "", range: [n, n, n] };
  const i = s.mode === ">" ? oe.BLOCK_FOLDED : oe.BLOCK_LITERAL, o = e.source ? tg(e.source) : [];
  let a = o.length;
  for (let g = o.length - 1; g >= 0; --g) {
    const m = o[g][1];
    if (m === "" || m === "\r")
      a = g;
    else
      break;
  }
  if (a === 0) {
    const g = s.chomp === "+" && o.length > 0 ? `
`.repeat(Math.max(1, o.length - 1)) : "";
    let m = n + s.length;
    return e.source && (m += e.source.length), { value: g, type: i, comment: s.comment, range: [n, m, m] };
  }
  let l = e.indent + s.indent, c = e.offset + s.length, d = 0;
  for (let g = 0; g < a; ++g) {
    const [m, w] = o[g];
    if (w === "" || w === "\r")
      s.indent === 0 && m.length > l && (l = m.length);
    else {
      m.length < l && r(c + m.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator"), s.indent === 0 && (l = m.length), d = g, l === 0 && !t.atRoot && r(c, "BAD_INDENT", "Block scalar values in collections must be indented");
      break;
    }
    c += m.length + w.length + 1;
  }
  for (let g = o.length - 1; g >= a; --g)
    o[g][0].length > l && (a = g + 1);
  let u = "", f = "", p = !1;
  for (let g = 0; g < d; ++g)
    u += o[g][0].slice(l) + `
`;
  for (let g = d; g < a; ++g) {
    let [m, w] = o[g];
    c += m.length + w.length + 1;
    const h = w[w.length - 1] === "\r";
    if (h && (w = w.slice(0, -1)), w && m.length < l) {
      const k = `Block scalar lines must not be less indented than their ${s.indent ? "explicit indentation indicator" : "first line"}`;
      r(c - w.length - (h ? 2 : 1), "BAD_INDENT", k), m = "";
    }
    i === oe.BLOCK_LITERAL ? (u += f + m.slice(l) + w, f = `
`) : m.length > l || w[0] === "	" ? (f === " " ? f = `
` : !p && f === `
` && (f = `

`), u += f + m.slice(l) + w, f = `
`, p = !0) : w === "" ? f === `
` ? u += `
` : f = `
` : (u += f + w, f = " ", p = !1);
  }
  switch (s.chomp) {
    case "-":
      break;
    case "+":
      for (let g = a; g < o.length; ++g)
        u += `
` + o[g][0].slice(l);
      u[u.length - 1] !== `
` && (u += `
`);
      break;
    default:
      u += `
`;
  }
  const b = n + s.length + e.source.length;
  return { value: u, type: i, comment: s.comment, range: [n, b, b] };
}
function eg({ offset: t, props: e }, r, n) {
  if (e[0].type !== "block-scalar-header")
    return n(e[0], "IMPOSSIBLE", "Block scalar header not found"), null;
  const { source: s } = e[0], i = s[0];
  let o = 0, a = "", l = -1;
  for (let f = 1; f < s.length; ++f) {
    const p = s[f];
    if (!a && (p === "-" || p === "+"))
      a = p;
    else {
      const b = Number(p);
      !o && b ? o = b : l === -1 && (l = t + f);
    }
  }
  l !== -1 && n(l, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${s}`);
  let c = !1, d = "", u = s.length;
  for (let f = 1; f < e.length; ++f) {
    const p = e[f];
    switch (p.type) {
      case "space":
        c = !0;
      // fallthrough
      case "newline":
        u += p.source.length;
        break;
      case "comment":
        r && !c && n(p, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"), u += p.source.length, d = p.source.substring(1);
        break;
      case "error":
        n(p, "UNEXPECTED_TOKEN", p.message), u += p.source.length;
        break;
      /* istanbul ignore next should not happen */
      default: {
        const b = `Unexpected token in block scalar header: ${p.type}`;
        n(p, "UNEXPECTED_TOKEN", b);
        const g = p.source;
        g && typeof g == "string" && (u += g.length);
      }
    }
  }
  return { mode: i, indent: o, chomp: a, comment: d, length: u };
}
function tg(t) {
  const e = t.split(/\n( *)/), r = e[0], n = r.match(/^( *)/), i = [n?.[1] ? [n[1], r.slice(n[1].length)] : ["", r]];
  for (let o = 1; o < e.length; o += 2)
    i.push([e[o], e[o + 1]]);
  return i;
}
function rg(t, e, r) {
  const { offset: n, type: s, source: i, end: o } = t;
  let a, l;
  const c = (f, p, b) => r(n + f, p, b);
  switch (s) {
    case "scalar":
      a = oe.PLAIN, l = ng(i, c);
      break;
    case "single-quoted-scalar":
      a = oe.QUOTE_SINGLE, l = sg(i, c);
      break;
    case "double-quoted-scalar":
      a = oe.QUOTE_DOUBLE, l = ig(i, c);
      break;
    /* istanbul ignore next should not happen */
    default:
      return r(t, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${s}`), {
        value: "",
        type: null,
        comment: "",
        range: [n, n + i.length, n + i.length]
      };
  }
  const d = n + i.length, u = is(o, d, e, r);
  return {
    value: l,
    type: a,
    comment: u.comment,
    range: [n, d, u.offset]
  };
}
function ng(t, e) {
  let r = "";
  switch (t[0]) {
    /* istanbul ignore next should not happen */
    case "	":
      r = "a tab character";
      break;
    case ",":
      r = "flow indicator character ,";
      break;
    case "%":
      r = "directive indicator character %";
      break;
    case "|":
    case ">": {
      r = `block scalar indicator ${t[0]}`;
      break;
    }
    case "@":
    case "`": {
      r = `reserved character ${t[0]}`;
      break;
    }
  }
  return r && e(0, "BAD_SCALAR_START", `Plain value cannot start with ${r}`), Mf(t);
}
function sg(t, e) {
  return (t[t.length - 1] !== "'" || t.length === 1) && e(t.length, "MISSING_CHAR", "Missing closing 'quote"), Mf(t.slice(1, -1)).replace(/''/g, "'");
}
function Mf(t) {
  let e, r;
  try {
    e = new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`, "sy"), r = new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`, "sy");
  } catch {
    e = /(.*?)[ \t]*\r?\n/sy, r = /[ \t]*(.*?)[ \t]*\r?\n/sy;
  }
  let n = e.exec(t);
  if (!n)
    return t;
  let s = n[1], i = " ", o = e.lastIndex;
  for (r.lastIndex = o; n = r.exec(t); )
    n[1] === "" ? i === `
` ? s += i : i = `
` : (s += i + n[1], i = " "), o = r.lastIndex;
  const a = /[ \t]*(.*)/sy;
  return a.lastIndex = o, n = a.exec(t), s + i + (n?.[1] ?? "");
}
function ig(t, e) {
  let r = "";
  for (let n = 1; n < t.length - 1; ++n) {
    const s = t[n];
    if (!(s === "\r" && t[n + 1] === `
`))
      if (s === `
`) {
        const { fold: i, offset: o } = og(t, n);
        r += i, n = o;
      } else if (s === "\\") {
        let i = t[++n];
        const o = ag[i];
        if (o)
          r += o;
        else if (i === `
`)
          for (i = t[n + 1]; i === " " || i === "	"; )
            i = t[++n + 1];
        else if (i === "\r" && t[n + 1] === `
`)
          for (i = t[++n + 1]; i === " " || i === "	"; )
            i = t[++n + 1];
        else if (i === "x" || i === "u" || i === "U") {
          const a = { x: 2, u: 4, U: 8 }[i];
          r += lg(t, n + 1, a, e), n += a;
        } else {
          const a = t.substr(n - 1, 2);
          e(n - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), r += a;
        }
      } else if (s === " " || s === "	") {
        const i = n;
        let o = t[n + 1];
        for (; o === " " || o === "	"; )
          o = t[++n + 1];
        o !== `
` && !(o === "\r" && t[n + 2] === `
`) && (r += n > i ? t.slice(i, n + 1) : s);
      } else
        r += s;
  }
  return (t[t.length - 1] !== '"' || t.length === 1) && e(t.length, "MISSING_CHAR", 'Missing closing "quote'), r;
}
function og(t, e) {
  let r = "", n = t[e + 1];
  for (; (n === " " || n === "	" || n === `
` || n === "\r") && !(n === "\r" && t[e + 2] !== `
`); )
    n === `
` && (r += `
`), e += 1, n = t[e + 1];
  return r || (r = " "), { fold: r, offset: e };
}
const ag = {
  0: "\0",
  // null character
  a: "\x07",
  // bell character
  b: "\b",
  // backspace
  e: "\x1B",
  // escape character
  f: "\f",
  // form feed
  n: `
`,
  // line feed
  r: "\r",
  // carriage return
  t: "	",
  // horizontal tab
  v: "\v",
  // vertical tab
  N: "",
  // Unicode next line
  _: " ",
  // Unicode non-breaking space
  L: "\u2028",
  // Unicode line separator
  P: "\u2029",
  // Unicode paragraph separator
  " ": " ",
  '"': '"',
  "/": "/",
  "\\": "\\",
  "	": "	"
};
function lg(t, e, r, n) {
  const s = t.substr(e, r), o = s.length === r && /^[0-9a-fA-F]+$/.test(s) ? parseInt(s, 16) : NaN;
  if (isNaN(o)) {
    const a = t.substr(e - 2, r + 2);
    return n(e - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), a;
  }
  return String.fromCodePoint(o);
}
function Df(t, e, r, n) {
  const { value: s, type: i, comment: o, range: a } = e.type === "block-scalar" ? Zm(t, e, n) : rg(e, t.options.strict, n), l = r ? t.directives.tagName(r.source, (u) => n(r, "TAG_RESOLVE_FAILED", u)) : null;
  let c;
  t.options.stringKeys && t.atKey ? c = t.schema[Dt] : l ? c = cg(t.schema, s, l, r, n) : e.type === "scalar" ? c = ug(t, s, e, n) : c = t.schema[Dt];
  let d;
  try {
    const u = c.resolve(s, (f) => n(r ?? e, "TAG_RESOLVE_FAILED", f), t.options);
    d = Se(u) ? u : new oe(u);
  } catch (u) {
    const f = u instanceof Error ? u.message : String(u);
    n(r ?? e, "TAG_RESOLVE_FAILED", f), d = new oe(s);
  }
  return d.range = a, d.source = s, i && (d.type = i), l && (d.tag = l), c.format && (d.format = c.format), o && (d.comment = o), d;
}
function cg(t, e, r, n, s) {
  if (r === "!")
    return t[Dt];
  const i = [];
  for (const a of t.tags)
    if (!a.collection && a.tag === r)
      if (a.default && a.test)
        i.push(a);
      else
        return a;
  for (const a of i)
    if (a.test?.test(e))
      return a;
  const o = t.knownTags[r];
  return o && !o.collection ? (t.tags.push(Object.assign({}, o, { default: !1, test: void 0 })), o) : (s(n, "TAG_RESOLVE_FAILED", `Unresolved tag: ${r}`, r !== "tag:yaml.org,2002:str"), t[Dt]);
}
function ug({ atKey: t, directives: e, schema: r }, n, s, i) {
  const o = r.tags.find((a) => (a.default === !0 || t && a.default === "key") && a.test?.test(n)) || r[Dt];
  if (r.compat) {
    const a = r.compat.find((l) => l.default && l.test?.test(n)) ?? r[Dt];
    if (o.tag !== a.tag) {
      const l = e.tagString(o.tag), c = e.tagString(a.tag), d = `Value may be parsed as either ${l} or ${c}`;
      i(s, "TAG_RESOLVE_FAILED", d, !0);
    }
  }
  return o;
}
function dg(t, e, r) {
  if (e) {
    r ?? (r = e.length);
    for (let n = r - 1; n >= 0; --n) {
      let s = e[n];
      switch (s.type) {
        case "space":
        case "comment":
        case "newline":
          t -= s.source.length;
          continue;
      }
      for (s = e[++n]; s?.type === "space"; )
        t += s.source.length, s = e[++n];
      break;
    }
  }
  return t;
}
const fg = { composeNode: Bf, composeEmptyNode: gl };
function Bf(t, e, r, n) {
  const s = t.atKey, { spaceBefore: i, comment: o, anchor: a, tag: l } = r;
  let c, d = !0;
  switch (e.type) {
    case "alias":
      c = hg(t, e, n), (a || l) && n(e, "ALIAS_PROPS", "An alias node must not specify any properties");
      break;
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "block-scalar":
      c = Df(t, e, l, n), a && (c.anchor = a.source.substring(1));
      break;
    case "block-map":
    case "block-seq":
    case "flow-collection":
      c = Xm(fg, t, e, r, n), a && (c.anchor = a.source.substring(1));
      break;
    default: {
      const u = e.type === "error" ? e.message : `Unsupported token (type: ${e.type})`;
      n(e, "UNEXPECTED_TOKEN", u), c = gl(t, e.offset, void 0, null, r, n), d = !1;
    }
  }
  return a && c.anchor === "" && n(a, "BAD_ALIAS", "Anchor cannot be an empty string"), s && t.options.stringKeys && (!Se(c) || typeof c.value != "string" || c.tag && c.tag !== "tag:yaml.org,2002:str") && n(l ?? e, "NON_STRING_KEY", "With stringKeys, all keys must be strings"), i && (c.spaceBefore = !0), o && (e.type === "scalar" && e.source === "" ? c.comment = o : c.commentBefore = o), t.options.keepSourceTokens && d && (c.srcToken = e), c;
}
function gl(t, e, r, n, { spaceBefore: s, comment: i, anchor: o, tag: a, end: l }, c) {
  const d = {
    type: "scalar",
    offset: dg(e, r, n),
    indent: -1,
    source: ""
  }, u = Df(t, d, a, c);
  return o && (u.anchor = o.source.substring(1), u.anchor === "" && c(o, "BAD_ALIAS", "Anchor cannot be an empty string")), s && (u.spaceBefore = !0), i && (u.comment = i, u.range[2] = l), u;
}
function hg({ options: t }, { offset: e, source: r, end: n }, s) {
  const i = new sl(r.substring(1));
  i.source === "" && s(e, "BAD_ALIAS", "Alias cannot be an empty string"), i.source.endsWith(":") && s(e + r.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
  const o = e + r.length, a = is(n, o, t.strict, s);
  return i.range = [e, o, a.offset], a.comment && (i.comment = a.comment), i;
}
function pg(t, e, { offset: r, start: n, value: s, end: i }, o) {
  const a = Object.assign({ _directives: e }, t), l = new ao(void 0, a), c = {
    atKey: !1,
    atRoot: !0,
    directives: l.directives,
    options: l.options,
    schema: l.schema
  }, d = sn(n, {
    indicator: "doc-start",
    next: s ?? i?.[0],
    offset: r,
    onError: o,
    parentIndent: 0,
    startOnNewline: !0
  });
  d.found && (l.directives.docStart = !0, s && (s.type === "block-map" || s.type === "block-seq") && !d.hasNewline && o(d.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")), l.contents = s ? Bf(c, s, d, o) : gl(c, d.end, n, null, d, o);
  const u = l.contents.range[2], f = is(i, u, !1, o);
  return f.comment && (l.comment = f.comment), l.range = [r, u, f.offset], l;
}
function wn(t) {
  if (typeof t == "number")
    return [t, t + 1];
  if (Array.isArray(t))
    return t.length === 2 ? t : [t[0], t[1]];
  const { offset: e, source: r } = t;
  return [e, e + (typeof r == "string" ? r.length : 1)];
}
function kc(t) {
  let e = "", r = !1, n = !1;
  for (let s = 0; s < t.length; ++s) {
    const i = t[s];
    switch (i[0]) {
      case "#":
        e += (e === "" ? "" : n ? `

` : `
`) + (i.substring(1) || " "), r = !0, n = !1;
        break;
      case "%":
        t[s + 1]?.[0] !== "#" && (s += 1), r = !1;
        break;
      default:
        r || (n = !0), r = !1;
    }
  }
  return { comment: e, afterEmptyLine: n };
}
class mg {
  constructor(e = {}) {
    this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (r, n, s, i) => {
      const o = wn(r);
      i ? this.warnings.push(new Wm(o, n, s)) : this.errors.push(new Pn(o, n, s));
    }, this.directives = new Xe({ version: e.version || "1.2" }), this.options = e;
  }
  decorate(e, r) {
    const { comment: n, afterEmptyLine: s } = kc(this.prelude);
    if (n) {
      const i = e.contents;
      if (r)
        e.comment = e.comment ? `${e.comment}
${n}` : n;
      else if (s || e.directives.docStart || !i)
        e.commentBefore = n;
      else if (Ie(i) && !i.flow && i.items.length > 0) {
        let o = i.items[0];
        je(o) && (o = o.key);
        const a = o.commentBefore;
        o.commentBefore = a ? `${n}
${a}` : n;
      } else {
        const o = i.commentBefore;
        i.commentBefore = o ? `${n}
${o}` : n;
      }
    }
    r ? (Array.prototype.push.apply(e.errors, this.errors), Array.prototype.push.apply(e.warnings, this.warnings)) : (e.errors = this.errors, e.warnings = this.warnings), this.prelude = [], this.errors = [], this.warnings = [];
  }
  /**
   * Current stream status information.
   *
   * Mostly useful at the end of input for an empty stream.
   */
  streamInfo() {
    return {
      comment: kc(this.prelude).comment,
      directives: this.directives,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  /**
   * Compose tokens into documents.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *compose(e, r = !1, n = -1) {
    for (const s of e)
      yield* this.next(s);
    yield* this.end(r, n);
  }
  /** Advance the composer by one CST token. */
  *next(e) {
    switch (e.type) {
      case "directive":
        this.directives.add(e.source, (r, n, s) => {
          const i = wn(e);
          i[0] += r, this.onError(i, "BAD_DIRECTIVE", n, s);
        }), this.prelude.push(e.source), this.atDirectives = !0;
        break;
      case "document": {
        const r = pg(this.options, this.directives, e, this.onError);
        this.atDirectives && !r.directives.docStart && this.onError(e, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"), this.decorate(r, !1), this.doc && (yield this.doc), this.doc = r, this.atDirectives = !1;
        break;
      }
      case "byte-order-mark":
      case "space":
        break;
      case "comment":
      case "newline":
        this.prelude.push(e.source);
        break;
      case "error": {
        const r = e.source ? `${e.message}: ${JSON.stringify(e.source)}` : e.message, n = new Pn(wn(e), "UNEXPECTED_TOKEN", r);
        this.atDirectives || !this.doc ? this.errors.push(n) : this.doc.errors.push(n);
        break;
      }
      case "doc-end": {
        if (!this.doc) {
          const n = "Unexpected doc-end without preceding document";
          this.errors.push(new Pn(wn(e), "UNEXPECTED_TOKEN", n));
          break;
        }
        this.doc.directives.docEnd = !0;
        const r = is(e.end, e.offset + e.source.length, this.doc.options.strict, this.onError);
        if (this.decorate(this.doc, !0), r.comment) {
          const n = this.doc.comment;
          this.doc.comment = n ? `${n}
${r.comment}` : r.comment;
        }
        this.doc.range[2] = r.offset;
        break;
      }
      default:
        this.errors.push(new Pn(wn(e), "UNEXPECTED_TOKEN", `Unsupported token ${e.type}`));
    }
  }
  /**
   * Call at end of input to yield any remaining document.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *end(e = !1, r = -1) {
    if (this.doc)
      this.decorate(this.doc, !0), yield this.doc, this.doc = null;
    else if (e) {
      const n = Object.assign({ _directives: this.directives }, this.options), s = new ao(void 0, n);
      this.atDirectives && this.onError(r, "MISSING_CHAR", "Missing directives-end indicator line"), s.range = [0, r, r], this.decorate(s, !1), yield s;
    }
  }
}
const qf = "\uFEFF", Ff = "", Uf = "", $a = "";
function gg(t) {
  switch (t) {
    case qf:
      return "byte-order-mark";
    case Ff:
      return "doc-mode";
    case Uf:
      return "flow-error-end";
    case $a:
      return "scalar";
    case "---":
      return "doc-start";
    case "...":
      return "doc-end";
    case "":
    case `
`:
    case `\r
`:
      return "newline";
    case "-":
      return "seq-item-ind";
    case "?":
      return "explicit-key-ind";
    case ":":
      return "map-value-ind";
    case "{":
      return "flow-map-start";
    case "}":
      return "flow-map-end";
    case "[":
      return "flow-seq-start";
    case "]":
      return "flow-seq-end";
    case ",":
      return "comma";
  }
  switch (t[0]) {
    case " ":
    case "	":
      return "space";
    case "#":
      return "comment";
    case "%":
      return "directive-line";
    case "*":
      return "alias";
    case "&":
      return "anchor";
    case "!":
      return "tag";
    case "'":
      return "single-quoted-scalar";
    case '"':
      return "double-quoted-scalar";
    case "|":
    case ">":
      return "block-scalar-header";
  }
  return null;
}
function St(t) {
  switch (t) {
    case void 0:
    case " ":
    case `
`:
    case "\r":
    case "	":
      return !0;
    default:
      return !1;
  }
}
const xc = new Set("0123456789ABCDEFabcdef"), yg = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), xs = new Set(",[]{}"), bg = new Set(` ,[]{}
\r	`), Bo = (t) => !t || bg.has(t);
class vg {
  constructor() {
    this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0;
  }
  /**
   * Generate YAML tokens from the `source` string. If `incomplete`,
   * a part of the last line may be left as a buffer for the next call.
   *
   * @returns A generator of lexical tokens
   */
  *lex(e, r = !1) {
    if (e) {
      if (typeof e != "string")
        throw TypeError("source is not a string");
      this.buffer = this.buffer ? this.buffer + e : e, this.lineEndPos = null;
    }
    this.atEnd = !r;
    let n = this.next ?? "stream";
    for (; n && (r || this.hasChars(1)); )
      n = yield* this.parseNext(n);
  }
  atLineEnd() {
    let e = this.pos, r = this.buffer[e];
    for (; r === " " || r === "	"; )
      r = this.buffer[++e];
    return !r || r === "#" || r === `
` ? !0 : r === "\r" ? this.buffer[e + 1] === `
` : !1;
  }
  charAt(e) {
    return this.buffer[this.pos + e];
  }
  continueScalar(e) {
    let r = this.buffer[e];
    if (this.indentNext > 0) {
      let n = 0;
      for (; r === " "; )
        r = this.buffer[++n + e];
      if (r === "\r") {
        const s = this.buffer[n + e + 1];
        if (s === `
` || !s && !this.atEnd)
          return e + n + 1;
      }
      return r === `
` || n >= this.indentNext || !r && !this.atEnd ? e + n : -1;
    }
    if (r === "-" || r === ".") {
      const n = this.buffer.substr(e, 3);
      if ((n === "---" || n === "...") && St(this.buffer[e + 3]))
        return -1;
    }
    return e;
  }
  getLine() {
    let e = this.lineEndPos;
    return (typeof e != "number" || e !== -1 && e < this.pos) && (e = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = e), e === -1 ? this.atEnd ? this.buffer.substring(this.pos) : null : (this.buffer[e - 1] === "\r" && (e -= 1), this.buffer.substring(this.pos, e));
  }
  hasChars(e) {
    return this.pos + e <= this.buffer.length;
  }
  setNext(e) {
    return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = e, null;
  }
  peek(e) {
    return this.buffer.substr(this.pos, e);
  }
  *parseNext(e) {
    switch (e) {
      case "stream":
        return yield* this.parseStream();
      case "line-start":
        return yield* this.parseLineStart();
      case "block-start":
        return yield* this.parseBlockStart();
      case "doc":
        return yield* this.parseDocument();
      case "flow":
        return yield* this.parseFlowCollection();
      case "quoted-scalar":
        return yield* this.parseQuotedScalar();
      case "block-scalar":
        return yield* this.parseBlockScalar();
      case "plain-scalar":
        return yield* this.parsePlainScalar();
    }
  }
  *parseStream() {
    let e = this.getLine();
    if (e === null)
      return this.setNext("stream");
    if (e[0] === qf && (yield* this.pushCount(1), e = e.substring(1)), e[0] === "%") {
      let r = e.length, n = e.indexOf("#");
      for (; n !== -1; ) {
        const i = e[n - 1];
        if (i === " " || i === "	") {
          r = n - 1;
          break;
        } else
          n = e.indexOf("#", n + 1);
      }
      for (; ; ) {
        const i = e[r - 1];
        if (i === " " || i === "	")
          r -= 1;
        else
          break;
      }
      const s = (yield* this.pushCount(r)) + (yield* this.pushSpaces(!0));
      return yield* this.pushCount(e.length - s), this.pushNewline(), "stream";
    }
    if (this.atLineEnd()) {
      const r = yield* this.pushSpaces(!0);
      return yield* this.pushCount(e.length - r), yield* this.pushNewline(), "stream";
    }
    return yield Ff, yield* this.parseLineStart();
  }
  *parseLineStart() {
    const e = this.charAt(0);
    if (!e && !this.atEnd)
      return this.setNext("line-start");
    if (e === "-" || e === ".") {
      if (!this.atEnd && !this.hasChars(4))
        return this.setNext("line-start");
      const r = this.peek(3);
      if ((r === "---" || r === "...") && St(this.charAt(3)))
        return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, r === "---" ? "doc" : "stream";
    }
    return this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !St(this.charAt(1)) && (this.indentNext = this.indentValue), yield* this.parseBlockStart();
  }
  *parseBlockStart() {
    const [e, r] = this.peek(2);
    if (!r && !this.atEnd)
      return this.setNext("block-start");
    if ((e === "-" || e === "?" || e === ":") && St(r)) {
      const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
      return this.indentNext = this.indentValue + 1, this.indentValue += n, yield* this.parseBlockStart();
    }
    return "doc";
  }
  *parseDocument() {
    yield* this.pushSpaces(!0);
    const e = this.getLine();
    if (e === null)
      return this.setNext("doc");
    let r = yield* this.pushIndicators();
    switch (e[r]) {
      case "#":
        yield* this.pushCount(e.length - r);
      // fallthrough
      case void 0:
        return yield* this.pushNewline(), yield* this.parseLineStart();
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), "doc";
      case "*":
        return yield* this.pushUntil(Bo), "doc";
      case '"':
      case "'":
        return yield* this.parseQuotedScalar();
      case "|":
      case ">":
        return r += yield* this.parseBlockScalarHeader(), r += yield* this.pushSpaces(!0), yield* this.pushCount(e.length - r), yield* this.pushNewline(), yield* this.parseBlockScalar();
      default:
        return yield* this.parsePlainScalar();
    }
  }
  *parseFlowCollection() {
    let e, r, n = -1;
    do
      e = yield* this.pushNewline(), e > 0 ? (r = yield* this.pushSpaces(!1), this.indentValue = n = r) : r = 0, r += yield* this.pushSpaces(!0);
    while (e + r > 0);
    const s = this.getLine();
    if (s === null)
      return this.setNext("flow");
    if ((n !== -1 && n < this.indentNext && s[0] !== "#" || n === 0 && (s.startsWith("---") || s.startsWith("...")) && St(s[3])) && !(n === this.indentNext - 1 && this.flowLevel === 1 && (s[0] === "]" || s[0] === "}")))
      return this.flowLevel = 0, yield Uf, yield* this.parseLineStart();
    let i = 0;
    for (; s[i] === ","; )
      i += yield* this.pushCount(1), i += yield* this.pushSpaces(!0), this.flowKey = !1;
    switch (i += yield* this.pushIndicators(), s[i]) {
      case void 0:
        return "flow";
      case "#":
        return yield* this.pushCount(s.length - i), "flow";
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
      case "*":
        return yield* this.pushUntil(Bo), "flow";
      case '"':
      case "'":
        return this.flowKey = !0, yield* this.parseQuotedScalar();
      case ":": {
        const o = this.charAt(1);
        if (this.flowKey || St(o) || o === ",")
          return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
      }
      // fallthrough
      default:
        return this.flowKey = !1, yield* this.parsePlainScalar();
    }
  }
  *parseQuotedScalar() {
    const e = this.charAt(0);
    let r = this.buffer.indexOf(e, this.pos + 1);
    if (e === "'")
      for (; r !== -1 && this.buffer[r + 1] === "'"; )
        r = this.buffer.indexOf("'", r + 2);
    else
      for (; r !== -1; ) {
        let i = 0;
        for (; this.buffer[r - 1 - i] === "\\"; )
          i += 1;
        if (i % 2 === 0)
          break;
        r = this.buffer.indexOf('"', r + 1);
      }
    const n = this.buffer.substring(0, r);
    let s = n.indexOf(`
`, this.pos);
    if (s !== -1) {
      for (; s !== -1; ) {
        const i = this.continueScalar(s + 1);
        if (i === -1)
          break;
        s = n.indexOf(`
`, i);
      }
      s !== -1 && (r = s - (n[s - 1] === "\r" ? 2 : 1));
    }
    if (r === -1) {
      if (!this.atEnd)
        return this.setNext("quoted-scalar");
      r = this.buffer.length;
    }
    return yield* this.pushToIndex(r + 1, !1), this.flowLevel ? "flow" : "doc";
  }
  *parseBlockScalarHeader() {
    this.blockScalarIndent = -1, this.blockScalarKeep = !1;
    let e = this.pos;
    for (; ; ) {
      const r = this.buffer[++e];
      if (r === "+")
        this.blockScalarKeep = !0;
      else if (r > "0" && r <= "9")
        this.blockScalarIndent = Number(r) - 1;
      else if (r !== "-")
        break;
    }
    return yield* this.pushUntil((r) => St(r) || r === "#");
  }
  *parseBlockScalar() {
    let e = this.pos - 1, r = 0, n;
    e: for (let i = this.pos; n = this.buffer[i]; ++i)
      switch (n) {
        case " ":
          r += 1;
          break;
        case `
`:
          e = i, r = 0;
          break;
        case "\r": {
          const o = this.buffer[i + 1];
          if (!o && !this.atEnd)
            return this.setNext("block-scalar");
          if (o === `
`)
            break;
        }
        // fallthrough
        default:
          break e;
      }
    if (!n && !this.atEnd)
      return this.setNext("block-scalar");
    if (r >= this.indentNext) {
      this.blockScalarIndent === -1 ? this.indentNext = r : this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
      do {
        const i = this.continueScalar(e + 1);
        if (i === -1)
          break;
        e = this.buffer.indexOf(`
`, i);
      } while (e !== -1);
      if (e === -1) {
        if (!this.atEnd)
          return this.setNext("block-scalar");
        e = this.buffer.length;
      }
    }
    let s = e + 1;
    for (n = this.buffer[s]; n === " "; )
      n = this.buffer[++s];
    if (n === "	") {
      for (; n === "	" || n === " " || n === "\r" || n === `
`; )
        n = this.buffer[++s];
      e = s - 1;
    } else if (!this.blockScalarKeep)
      do {
        let i = e - 1, o = this.buffer[i];
        o === "\r" && (o = this.buffer[--i]);
        const a = i;
        for (; o === " "; )
          o = this.buffer[--i];
        if (o === `
` && i >= this.pos && i + 1 + r > a)
          e = i;
        else
          break;
      } while (!0);
    return yield $a, yield* this.pushToIndex(e + 1, !0), yield* this.parseLineStart();
  }
  *parsePlainScalar() {
    const e = this.flowLevel > 0;
    let r = this.pos - 1, n = this.pos - 1, s;
    for (; s = this.buffer[++n]; )
      if (s === ":") {
        const i = this.buffer[n + 1];
        if (St(i) || e && xs.has(i))
          break;
        r = n;
      } else if (St(s)) {
        let i = this.buffer[n + 1];
        if (s === "\r" && (i === `
` ? (n += 1, s = `
`, i = this.buffer[n + 1]) : r = n), i === "#" || e && xs.has(i))
          break;
        if (s === `
`) {
          const o = this.continueScalar(n + 1);
          if (o === -1)
            break;
          n = Math.max(n, o - 2);
        }
      } else {
        if (e && xs.has(s))
          break;
        r = n;
      }
    return !s && !this.atEnd ? this.setNext("plain-scalar") : (yield $a, yield* this.pushToIndex(r + 1, !0), e ? "flow" : "doc");
  }
  *pushCount(e) {
    return e > 0 ? (yield this.buffer.substr(this.pos, e), this.pos += e, e) : 0;
  }
  *pushToIndex(e, r) {
    const n = this.buffer.slice(this.pos, e);
    return n ? (yield n, this.pos += n.length, n.length) : (r && (yield ""), 0);
  }
  *pushIndicators() {
    switch (this.charAt(0)) {
      case "!":
        return (yield* this.pushTag()) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
      case "&":
        return (yield* this.pushUntil(Bo)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
      case "-":
      // this is an error
      case "?":
      // this is an error outside flow collections
      case ":": {
        const e = this.flowLevel > 0, r = this.charAt(1);
        if (St(r) || e && xs.has(r))
          return e ? this.flowKey && (this.flowKey = !1) : this.indentNext = this.indentValue + 1, (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
      }
    }
    return 0;
  }
  *pushTag() {
    if (this.charAt(1) === "<") {
      let e = this.pos + 2, r = this.buffer[e];
      for (; !St(r) && r !== ">"; )
        r = this.buffer[++e];
      return yield* this.pushToIndex(r === ">" ? e + 1 : e, !1);
    } else {
      let e = this.pos + 1, r = this.buffer[e];
      for (; r; )
        if (yg.has(r))
          r = this.buffer[++e];
        else if (r === "%" && xc.has(this.buffer[e + 1]) && xc.has(this.buffer[e + 2]))
          r = this.buffer[e += 3];
        else
          break;
      return yield* this.pushToIndex(e, !1);
    }
  }
  *pushNewline() {
    const e = this.buffer[this.pos];
    return e === `
` ? yield* this.pushCount(1) : e === "\r" && this.charAt(1) === `
` ? yield* this.pushCount(2) : 0;
  }
  *pushSpaces(e) {
    let r = this.pos - 1, n;
    do
      n = this.buffer[++r];
    while (n === " " || e && n === "	");
    const s = r - this.pos;
    return s > 0 && (yield this.buffer.substr(this.pos, s), this.pos = r), s;
  }
  *pushUntil(e) {
    let r = this.pos, n = this.buffer[r];
    for (; !e(n); )
      n = this.buffer[++r];
    return yield* this.pushToIndex(r, !1);
  }
}
class wg {
  constructor() {
    this.lineStarts = [], this.addNewLine = (e) => this.lineStarts.push(e), this.linePos = (e) => {
      let r = 0, n = this.lineStarts.length;
      for (; r < n; ) {
        const i = r + n >> 1;
        this.lineStarts[i] < e ? r = i + 1 : n = i;
      }
      if (this.lineStarts[r] === e)
        return { line: r + 1, col: 1 };
      if (r === 0)
        return { line: 0, col: e };
      const s = this.lineStarts[r - 1];
      return { line: r, col: e - s + 1 };
    };
  }
}
function nr(t, e) {
  for (let r = 0; r < t.length; ++r)
    if (t[r].type === e)
      return !0;
  return !1;
}
function Sc(t) {
  for (let e = 0; e < t.length; ++e)
    switch (t[e].type) {
      case "space":
      case "comment":
      case "newline":
        break;
      default:
        return e;
    }
  return -1;
}
function Kf(t) {
  switch (t?.type) {
    case "alias":
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "flow-collection":
      return !0;
    default:
      return !1;
  }
}
function Ss(t) {
  switch (t.type) {
    case "document":
      return t.start;
    case "block-map": {
      const e = t.items[t.items.length - 1];
      return e.sep ?? e.start;
    }
    case "block-seq":
      return t.items[t.items.length - 1].start;
    /* istanbul ignore next should not happen */
    default:
      return [];
  }
}
function qr(t) {
  if (t.length === 0)
    return [];
  let e = t.length;
  e: for (; --e >= 0; )
    switch (t[e].type) {
      case "doc-start":
      case "explicit-key-ind":
      case "map-value-ind":
      case "seq-item-ind":
      case "newline":
        break e;
    }
  for (; t[++e]?.type === "space"; )
    ;
  return t.splice(e, t.length);
}
function _c(t) {
  if (t.start.type === "flow-seq-start")
    for (const e of t.items)
      e.sep && !e.value && !nr(e.start, "explicit-key-ind") && !nr(e.sep, "map-value-ind") && (e.key && (e.value = e.key), delete e.key, Kf(e.value) ? e.value.end ? Array.prototype.push.apply(e.value.end, e.sep) : e.value.end = e.sep : Array.prototype.push.apply(e.start, e.sep), delete e.sep);
}
class kg {
  /**
   * @param onNewLine - If defined, called separately with the start position of
   *   each new line (in `parse()`, including the start of input).
   */
  constructor(e) {
    this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new vg(), this.onNewLine = e;
  }
  /**
   * Parse `source` as a YAML stream.
   * If `incomplete`, a part of the last line may be left as a buffer for the next call.
   *
   * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
   *
   * @returns A generator of tokens representing each directive, document, and other structure.
   */
  *parse(e, r = !1) {
    this.onNewLine && this.offset === 0 && this.onNewLine(0);
    for (const n of this.lexer.lex(e, r))
      yield* this.next(n);
    r || (yield* this.end());
  }
  /**
   * Advance the parser by the `source` of one lexical token.
   */
  *next(e) {
    if (this.source = e, this.atScalar) {
      this.atScalar = !1, yield* this.step(), this.offset += e.length;
      return;
    }
    const r = gg(e);
    if (r)
      if (r === "scalar")
        this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
      else {
        switch (this.type = r, yield* this.step(), r) {
          case "newline":
            this.atNewLine = !0, this.indent = 0, this.onNewLine && this.onNewLine(this.offset + e.length);
            break;
          case "space":
            this.atNewLine && e[0] === " " && (this.indent += e.length);
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            this.atNewLine && (this.indent += e.length);
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = !1;
        }
        this.offset += e.length;
      }
    else {
      const n = `Not a YAML token: ${e}`;
      yield* this.pop({ type: "error", offset: this.offset, message: n, source: e }), this.offset += e.length;
    }
  }
  /** Call at end of input to push out any remaining constructions */
  *end() {
    for (; this.stack.length > 0; )
      yield* this.pop();
  }
  get sourceToken() {
    return {
      type: this.type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  *step() {
    const e = this.peek(1);
    if (this.type === "doc-end" && e?.type !== "doc-end") {
      for (; this.stack.length > 0; )
        yield* this.pop();
      this.stack.push({
        type: "doc-end",
        offset: this.offset,
        source: this.source
      });
      return;
    }
    if (!e)
      return yield* this.stream();
    switch (e.type) {
      case "document":
        return yield* this.document(e);
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return yield* this.scalar(e);
      case "block-scalar":
        return yield* this.blockScalar(e);
      case "block-map":
        return yield* this.blockMap(e);
      case "block-seq":
        return yield* this.blockSequence(e);
      case "flow-collection":
        return yield* this.flowCollection(e);
      case "doc-end":
        return yield* this.documentEnd(e);
    }
    yield* this.pop();
  }
  peek(e) {
    return this.stack[this.stack.length - e];
  }
  *pop(e) {
    const r = e ?? this.stack.pop();
    if (!r)
      yield { type: "error", offset: this.offset, source: "", message: "Tried to pop an empty stack" };
    else if (this.stack.length === 0)
      yield r;
    else {
      const n = this.peek(1);
      switch (r.type === "block-scalar" ? r.indent = "indent" in n ? n.indent : 0 : r.type === "flow-collection" && n.type === "document" && (r.indent = 0), r.type === "flow-collection" && _c(r), n.type) {
        case "document":
          n.value = r;
          break;
        case "block-scalar":
          n.props.push(r);
          break;
        case "block-map": {
          const s = n.items[n.items.length - 1];
          if (s.value) {
            n.items.push({ start: [], key: r, sep: [] }), this.onKeyLine = !0;
            return;
          } else if (s.sep)
            s.value = r;
          else {
            Object.assign(s, { key: r, sep: [] }), this.onKeyLine = !s.explicitKey;
            return;
          }
          break;
        }
        case "block-seq": {
          const s = n.items[n.items.length - 1];
          s.value ? n.items.push({ start: [], value: r }) : s.value = r;
          break;
        }
        case "flow-collection": {
          const s = n.items[n.items.length - 1];
          !s || s.value ? n.items.push({ start: [], key: r, sep: [] }) : s.sep ? s.value = r : Object.assign(s, { key: r, sep: [] });
          return;
        }
        /* istanbul ignore next should not happen */
        default:
          yield* this.pop(), yield* this.pop(r);
      }
      if ((n.type === "document" || n.type === "block-map" || n.type === "block-seq") && (r.type === "block-map" || r.type === "block-seq")) {
        const s = r.items[r.items.length - 1];
        s && !s.sep && !s.value && s.start.length > 0 && Sc(s.start) === -1 && (r.indent === 0 || s.start.every((i) => i.type !== "comment" || i.indent < r.indent)) && (n.type === "document" ? n.end = s.start : n.items.push({ start: s.start }), r.items.splice(-1, 1));
      }
    }
  }
  *stream() {
    switch (this.type) {
      case "directive-line":
        yield { type: "directive", offset: this.offset, source: this.source };
        return;
      case "byte-order-mark":
      case "space":
      case "comment":
      case "newline":
        yield this.sourceToken;
        return;
      case "doc-mode":
      case "doc-start": {
        const e = {
          type: "document",
          offset: this.offset,
          start: []
        };
        this.type === "doc-start" && e.start.push(this.sourceToken), this.stack.push(e);
        return;
      }
    }
    yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML stream`,
      source: this.source
    };
  }
  *document(e) {
    if (e.value)
      return yield* this.lineEnd(e);
    switch (this.type) {
      case "doc-start": {
        Sc(e.start) !== -1 ? (yield* this.pop(), yield* this.step()) : e.start.push(this.sourceToken);
        return;
      }
      case "anchor":
      case "tag":
      case "space":
      case "comment":
      case "newline":
        e.start.push(this.sourceToken);
        return;
    }
    const r = this.startBlockValue(e);
    r ? this.stack.push(r) : yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML document`,
      source: this.source
    };
  }
  *scalar(e) {
    if (this.type === "map-value-ind") {
      const r = Ss(this.peek(2)), n = qr(r);
      let s;
      e.end ? (s = e.end, s.push(this.sourceToken), delete e.end) : s = [this.sourceToken];
      const i = {
        type: "block-map",
        offset: e.offset,
        indent: e.indent,
        items: [{ start: n, key: e, sep: s }]
      };
      this.onKeyLine = !0, this.stack[this.stack.length - 1] = i;
    } else
      yield* this.lineEnd(e);
  }
  *blockScalar(e) {
    switch (this.type) {
      case "space":
      case "comment":
      case "newline":
        e.props.push(this.sourceToken);
        return;
      case "scalar":
        if (e.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
          let r = this.source.indexOf(`
`) + 1;
          for (; r !== 0; )
            this.onNewLine(this.offset + r), r = this.source.indexOf(`
`, r) + 1;
        }
        yield* this.pop();
        break;
      /* istanbul ignore next should not happen */
      default:
        yield* this.pop(), yield* this.step();
    }
  }
  *blockMap(e) {
    const r = e.items[e.items.length - 1];
    switch (this.type) {
      case "newline":
        if (this.onKeyLine = !1, r.value) {
          const n = "end" in r.value ? r.value.end : void 0;
          (Array.isArray(n) ? n[n.length - 1] : void 0)?.type === "comment" ? n?.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
        } else r.sep ? r.sep.push(this.sourceToken) : r.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (r.value)
          e.items.push({ start: [this.sourceToken] });
        else if (r.sep)
          r.sep.push(this.sourceToken);
        else {
          if (this.atIndentedComment(r.start, e.indent)) {
            const s = e.items[e.items.length - 2]?.value?.end;
            if (Array.isArray(s)) {
              Array.prototype.push.apply(s, r.start), s.push(this.sourceToken), e.items.pop();
              return;
            }
          }
          r.start.push(this.sourceToken);
        }
        return;
    }
    if (this.indent >= e.indent) {
      const n = !this.onKeyLine && this.indent === e.indent, s = n && (r.sep || r.explicitKey) && this.type !== "seq-item-ind";
      let i = [];
      if (s && r.sep && !r.value) {
        const o = [];
        for (let a = 0; a < r.sep.length; ++a) {
          const l = r.sep[a];
          switch (l.type) {
            case "newline":
              o.push(a);
              break;
            case "space":
              break;
            case "comment":
              l.indent > e.indent && (o.length = 0);
              break;
            default:
              o.length = 0;
          }
        }
        o.length >= 2 && (i = r.sep.splice(o[1]));
      }
      switch (this.type) {
        case "anchor":
        case "tag":
          s || r.value ? (i.push(this.sourceToken), e.items.push({ start: i }), this.onKeyLine = !0) : r.sep ? r.sep.push(this.sourceToken) : r.start.push(this.sourceToken);
          return;
        case "explicit-key-ind":
          !r.sep && !r.explicitKey ? (r.start.push(this.sourceToken), r.explicitKey = !0) : s || r.value ? (i.push(this.sourceToken), e.items.push({ start: i, explicitKey: !0 })) : this.stack.push({
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken], explicitKey: !0 }]
          }), this.onKeyLine = !0;
          return;
        case "map-value-ind":
          if (r.explicitKey)
            if (r.sep)
              if (r.value)
                e.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (nr(r.sep, "map-value-ind"))
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: i, key: null, sep: [this.sourceToken] }]
                });
              else if (Kf(r.key) && !nr(r.sep, "newline")) {
                const o = qr(r.start), a = r.key, l = r.sep;
                l.push(this.sourceToken), delete r.key, delete r.sep, this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: o, key: a, sep: l }]
                });
              } else i.length > 0 ? r.sep = r.sep.concat(i, this.sourceToken) : r.sep.push(this.sourceToken);
            else if (nr(r.start, "newline"))
              Object.assign(r, { key: null, sep: [this.sourceToken] });
            else {
              const o = qr(r.start);
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: o, key: null, sep: [this.sourceToken] }]
              });
            }
          else
            r.sep ? r.value || s ? e.items.push({ start: i, key: null, sep: [this.sourceToken] }) : nr(r.sep, "map-value-ind") ? this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [], key: null, sep: [this.sourceToken] }]
            }) : r.sep.push(this.sourceToken) : Object.assign(r, { key: null, sep: [this.sourceToken] });
          this.onKeyLine = !0;
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const o = this.flowScalar(this.type);
          s || r.value ? (e.items.push({ start: i, key: o, sep: [] }), this.onKeyLine = !0) : r.sep ? this.stack.push(o) : (Object.assign(r, { key: o, sep: [] }), this.onKeyLine = !0);
          return;
        }
        default: {
          const o = this.startBlockValue(e);
          if (o) {
            if (o.type === "block-seq") {
              if (!r.explicitKey && r.sep && !nr(r.sep, "newline")) {
                yield* this.pop({
                  type: "error",
                  offset: this.offset,
                  message: "Unexpected block-seq-ind on same line with key",
                  source: this.source
                });
                return;
              }
            } else n && e.items.push({ start: i });
            this.stack.push(o);
            return;
          }
        }
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *blockSequence(e) {
    const r = e.items[e.items.length - 1];
    switch (this.type) {
      case "newline":
        if (r.value) {
          const n = "end" in r.value ? r.value.end : void 0;
          (Array.isArray(n) ? n[n.length - 1] : void 0)?.type === "comment" ? n?.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
        } else
          r.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (r.value)
          e.items.push({ start: [this.sourceToken] });
        else {
          if (this.atIndentedComment(r.start, e.indent)) {
            const s = e.items[e.items.length - 2]?.value?.end;
            if (Array.isArray(s)) {
              Array.prototype.push.apply(s, r.start), s.push(this.sourceToken), e.items.pop();
              return;
            }
          }
          r.start.push(this.sourceToken);
        }
        return;
      case "anchor":
      case "tag":
        if (r.value || this.indent <= e.indent)
          break;
        r.start.push(this.sourceToken);
        return;
      case "seq-item-ind":
        if (this.indent !== e.indent)
          break;
        r.value || nr(r.start, "seq-item-ind") ? e.items.push({ start: [this.sourceToken] }) : r.start.push(this.sourceToken);
        return;
    }
    if (this.indent > e.indent) {
      const n = this.startBlockValue(e);
      if (n) {
        this.stack.push(n);
        return;
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *flowCollection(e) {
    const r = e.items[e.items.length - 1];
    if (this.type === "flow-error-end") {
      let n;
      do
        yield* this.pop(), n = this.peek(1);
      while (n?.type === "flow-collection");
    } else if (e.end.length === 0) {
      switch (this.type) {
        case "comma":
        case "explicit-key-ind":
          !r || r.sep ? e.items.push({ start: [this.sourceToken] }) : r.start.push(this.sourceToken);
          return;
        case "map-value-ind":
          !r || r.value ? e.items.push({ start: [], key: null, sep: [this.sourceToken] }) : r.sep ? r.sep.push(this.sourceToken) : Object.assign(r, { key: null, sep: [this.sourceToken] });
          return;
        case "space":
        case "comment":
        case "newline":
        case "anchor":
        case "tag":
          !r || r.value ? e.items.push({ start: [this.sourceToken] }) : r.sep ? r.sep.push(this.sourceToken) : r.start.push(this.sourceToken);
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const s = this.flowScalar(this.type);
          !r || r.value ? e.items.push({ start: [], key: s, sep: [] }) : r.sep ? this.stack.push(s) : Object.assign(r, { key: s, sep: [] });
          return;
        }
        case "flow-map-end":
        case "flow-seq-end":
          e.end.push(this.sourceToken);
          return;
      }
      const n = this.startBlockValue(e);
      n ? this.stack.push(n) : (yield* this.pop(), yield* this.step());
    } else {
      const n = this.peek(2);
      if (n.type === "block-map" && (this.type === "map-value-ind" && n.indent === e.indent || this.type === "newline" && !n.items[n.items.length - 1].sep))
        yield* this.pop(), yield* this.step();
      else if (this.type === "map-value-ind" && n.type !== "flow-collection") {
        const s = Ss(n), i = qr(s);
        _c(e);
        const o = e.end.splice(1, e.end.length);
        o.push(this.sourceToken);
        const a = {
          type: "block-map",
          offset: e.offset,
          indent: e.indent,
          items: [{ start: i, key: e, sep: o }]
        };
        this.onKeyLine = !0, this.stack[this.stack.length - 1] = a;
      } else
        yield* this.lineEnd(e);
    }
  }
  flowScalar(e) {
    if (this.onNewLine) {
      let r = this.source.indexOf(`
`) + 1;
      for (; r !== 0; )
        this.onNewLine(this.offset + r), r = this.source.indexOf(`
`, r) + 1;
    }
    return {
      type: e,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  startBlockValue(e) {
    switch (this.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return this.flowScalar(this.type);
      case "block-scalar-header":
        return {
          type: "block-scalar",
          offset: this.offset,
          indent: this.indent,
          props: [this.sourceToken],
          source: ""
        };
      case "flow-map-start":
      case "flow-seq-start":
        return {
          type: "flow-collection",
          offset: this.offset,
          indent: this.indent,
          start: this.sourceToken,
          items: [],
          end: []
        };
      case "seq-item-ind":
        return {
          type: "block-seq",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: [this.sourceToken] }]
        };
      case "explicit-key-ind": {
        this.onKeyLine = !0;
        const r = Ss(e), n = qr(r);
        return n.push(this.sourceToken), {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: n, explicitKey: !0 }]
        };
      }
      case "map-value-ind": {
        this.onKeyLine = !0;
        const r = Ss(e), n = qr(r);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: n, key: null, sep: [this.sourceToken] }]
        };
      }
    }
    return null;
  }
  atIndentedComment(e, r) {
    return this.type !== "comment" || this.indent <= r ? !1 : e.every((n) => n.type === "newline" || n.type === "space");
  }
  *documentEnd(e) {
    this.type !== "doc-mode" && (e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop()));
  }
  *lineEnd(e) {
    switch (this.type) {
      case "comma":
      case "doc-start":
      case "doc-end":
      case "flow-seq-end":
      case "flow-map-end":
      case "map-value-ind":
        yield* this.pop(), yield* this.step();
        break;
      case "newline":
        this.onKeyLine = !1;
      default:
        e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop());
    }
  }
}
function xg(t) {
  const e = t.prettyErrors !== !1;
  return { lineCounter: t.lineCounter || e && new wg() || null, prettyErrors: e };
}
function Sg(t, e = {}) {
  const { lineCounter: r, prettyErrors: n } = xg(e), s = new kg(r?.addNewLine), i = new mg(e);
  let o = null;
  for (const a of i.compose(s.parse(t), !0, t.length))
    if (!o)
      o = a;
    else if (o.options.logLevel !== "silent") {
      o.errors.push(new Pn(a.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
      break;
    }
  return n && r && (o.errors.forEach(vc(t, r)), o.warnings.forEach(vc(t, r))), o;
}
function _g(t, e, r) {
  let n;
  const s = Sg(t, r);
  if (!s)
    return null;
  if (s.warnings.forEach((i) => gf(s.options.logLevel, i)), s.errors.length > 0) {
    if (s.options.logLevel !== "silent")
      throw s.errors[0];
    s.errors = [];
  }
  return s.toJS(Object.assign({ reviver: n }, r));
}
const Eg = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
function $g(t) {
  return {
    type: "openapi",
    info: Ag(t.info),
    servers: Tg(t.servers),
    tags: Cg(t.tags),
    operations: Ng(t),
    schemas: Kg(t.components?.schemas),
    securitySchemes: zg(t.components?.securitySchemes)
  };
}
function Ag(t) {
  return {
    title: t.title,
    version: t.version,
    description: t.description,
    termsOfService: t.termsOfService,
    contact: t.contact ? {
      name: t.contact.name,
      url: t.contact.url,
      email: t.contact.email
    } : void 0,
    license: t.license ? {
      name: t.license.name,
      url: t.license.url
    } : void 0
  };
}
function Tg(t) {
  return !t || t.length === 0 ? [{ url: "/" }] : t.map((e) => ({
    url: e.url,
    description: e.description,
    variables: e.variables ? Object.fromEntries(Object.entries(e.variables).map(([r, n]) => [
      r,
      Og(n)
    ])) : void 0
  }));
}
function Og(t) {
  return {
    default: t.default,
    description: t.description,
    enum: t.enum
  };
}
function Cg(t) {
  return t ? t.map((e) => ({
    name: e.name,
    description: e.description,
    externalDocs: e.externalDocs ? {
      url: e.externalDocs.url,
      description: e.externalDocs.description
    } : void 0
  })) : [];
}
function Ng(t) {
  const e = [], r = t.paths || {};
  for (const [n, s] of Object.entries(r)) {
    if (!s)
      continue;
    const i = s;
    for (const o of Eg) {
      const a = o.toLowerCase(), l = i[a];
      if (l) {
        const c = (i.parameters || []).filter((d) => !ze(d));
        e.push(Ig(l, o, n, c));
      }
    }
  }
  return e;
}
function Ig(t, e, r, n) {
  const s = [...n || [], ...t.parameters || []], i = /* @__PURE__ */ new Map();
  for (const o of s)
    if (!ze(o)) {
      const a = `${o.in}:${o.name}`;
      i.set(a, o);
    }
  return {
    id: t.operationId || `${e.toLowerCase()}_${r.replace(/[^a-zA-Z0-9]/g, "_")}`,
    method: e,
    path: r,
    summary: t.summary,
    description: t.description,
    tags: t.tags || [],
    deprecated: t.deprecated,
    parameters: Array.from(i.values()).map(zf),
    requestBody: t.requestBody && !ze(t.requestBody) ? Bg(t.requestBody) : void 0,
    responses: qg(t.responses),
    security: t.security?.map(Ug),
    externalDocs: t.externalDocs ? {
      url: t.externalDocs.url,
      description: t.externalDocs.description
    } : void 0
  };
}
function zf(t) {
  return {
    name: t.name,
    in: t.in,
    description: t.description,
    required: t.required ?? t.in === "path",
    deprecated: t.deprecated,
    schema: t.schema && !ze(t.schema) ? jt(t.schema) : { type: "string" },
    example: t.example,
    examples: t.examples ? Object.fromEntries(Object.entries(t.examples).filter(([, e]) => !ze(e)).map(([e, r]) => [e, Hf(r)])) : void 0
  };
}
function Pg(t, e) {
  const r = {};
  return t.type && (r.type = Array.isArray(t.type) ? t.type[0] : t.type), t.format && (r.format = t.format), t.title && (r.title = t.title), t.description && (r.description = t.description), t.default !== void 0 && (r.default = t.default), t.enum && (r.enum = t.enum), "const" in e && e.const !== void 0 && (r.const = e.const), "nullable" in e && e.nullable && (r.nullable = e.nullable), r;
}
function Lg(t, e) {
  e.minLength !== void 0 && (t.minLength = e.minLength), e.maxLength !== void 0 && (t.maxLength = e.maxLength), e.pattern && (t.pattern = e.pattern);
}
function Rg(t, e) {
  e.minimum !== void 0 && (t.minimum = e.minimum), e.maximum !== void 0 && (t.maximum = e.maximum), e.exclusiveMinimum !== void 0 && (t.exclusiveMinimum = e.exclusiveMinimum), e.exclusiveMaximum !== void 0 && (t.exclusiveMaximum = e.exclusiveMaximum), e.multipleOf !== void 0 && (t.multipleOf = e.multipleOf);
}
function jg(t, e, r) {
  "items" in r && r.items && !ze(r.items) && (t.items = jt(r.items)), e.minItems !== void 0 && (t.minItems = e.minItems), e.maxItems !== void 0 && (t.maxItems = e.maxItems), e.uniqueItems && (t.uniqueItems = e.uniqueItems);
}
function Mg(t, e) {
  e.properties && (t.properties = Object.fromEntries(Object.entries(e.properties).filter(([, r]) => !ze(r)).map(([r, n]) => [r, jt(n)]))), e.required && (t.required = e.required), e.additionalProperties !== void 0 && (t.additionalProperties = typeof e.additionalProperties == "boolean" ? e.additionalProperties : e.additionalProperties && !ze(e.additionalProperties) ? jt(e.additionalProperties) : !0);
}
function Dg(t, e) {
  e.allOf && (t.allOf = e.allOf.filter((r) => !ze(r)).map((r) => jt(r))), e.anyOf && (t.anyOf = e.anyOf.filter((r) => !ze(r)).map((r) => jt(r))), e.oneOf && (t.oneOf = e.oneOf.filter((r) => !ze(r)).map((r) => jt(r))), e.not && !ze(e.not) && (t.not = jt(e.not));
}
function jt(t) {
  const e = t, r = Pg(t, e);
  return Lg(r, t), Rg(r, t), jg(r, t, e), Mg(r, t), Dg(r, t), r;
}
function Bg(t) {
  return {
    description: t.description,
    required: t.required ?? !1,
    content: Object.fromEntries(Object.entries(t.content).map(([e, r]) => [
      e,
      Vf(r)
    ]))
  };
}
function Vf(t) {
  return {
    schema: t.schema && !ze(t.schema) ? jt(t.schema) : void 0,
    example: t.example,
    examples: t.examples ? Object.fromEntries(Object.entries(t.examples).filter(([, e]) => !ze(e)).map(([e, r]) => [e, Hf(r)])) : void 0
  };
}
function Hf(t) {
  return {
    summary: t.summary,
    description: t.description,
    value: t.value,
    externalValue: t.externalValue
  };
}
function qg(t) {
  return t ? Object.entries(t).filter(([, e]) => !ze(e)).map(([e, r]) => Fg(e, r)) : [];
}
function Fg(t, e) {
  return {
    statusCode: t,
    description: e.description,
    headers: e.headers ? Object.fromEntries(Object.entries(e.headers).filter(([, r]) => !ze(r)).map(([r, n]) => [
      r,
      zf({
        name: r,
        in: "header",
        ...n
      })
    ])) : void 0,
    content: e.content ? Object.fromEntries(Object.entries(e.content).map(([r, n]) => [
      r,
      Vf(n)
    ])) : void 0
  };
}
function Ug(t) {
  const e = Object.entries(t), [r, n] = e[0] || ["", []];
  return {
    type: "apiKey",
    // Will be resolved later with security scheme info
    name: r,
    scopes: n
  };
}
function Kg(t) {
  return t ? Object.fromEntries(Object.entries(t).filter(([, e]) => !ze(e)).map(([e, r]) => [e, jt(r)])) : {};
}
function zg(t) {
  return t ? Object.fromEntries(Object.entries(t).filter(([, e]) => !ze(e)).map(([e, r]) => [
    e,
    Vg(e, r)
  ])) : {};
}
function Vg(t, e) {
  const r = {
    type: Hg(e.type),
    name: t
  };
  return e.type === "apiKey" && (r.in = e.in), e.type === "http" && (r.scheme = e.scheme), e.type === "oauth2" && e.flows && (r.flows = Jg(e.flows)), e.type === "openIdConnect" && (r.openIdConnectUrl = e.openIdConnectUrl), r;
}
function Hg(t) {
  switch (t) {
    case "apiKey":
      return "apiKey";
    case "http":
      return "bearer";
    // Could also be 'basic', determined by scheme
    case "oauth2":
      return "oauth2";
    case "openIdConnect":
      return "openIdConnect";
    default:
      return "apiKey";
  }
}
function Jg(t) {
  const e = {};
  return t?.implicit && (e.implicit = _s(t.implicit)), t?.password && (e.password = _s(t.password)), t?.clientCredentials && (e.clientCredentials = _s(t.clientCredentials)), t?.authorizationCode && (e.authorizationCode = _s(t.authorizationCode)), e;
}
function _s(t) {
  return {
    authorizationUrl: t.authorizationUrl,
    tokenUrl: t.tokenUrl,
    refreshUrl: t?.refreshUrl,
    scopes: t?.scopes || {}
  };
}
function ze(t) {
  return typeof t == "object" && t !== null && "$ref" in t;
}
function Wg(t) {
  return t.startsWith("#") ? !1 : (t.startsWith("http://") || t.startsWith("https://"), !0);
}
function Gg(t) {
  const e = t.indexOf("#");
  return e === -1 ? { url: t } : e === 0 ? { url: "", pointer: t } : {
    url: t.slice(0, e),
    pointer: t.slice(e)
  };
}
function Yg(t, e) {
  if (t.startsWith("http://") || t.startsWith("https://"))
    return t;
  if (e)
    try {
      return new URL(t, e).href;
    } catch {
      return;
    }
}
async function Qg(t, e, r) {
  if (e.has(t))
    return e.get(t);
  try {
    const n = await fetch(t);
    if (!n.ok) {
      r.push(`Failed to fetch external ref ${t}: ${n.status} ${n.statusText}`);
      return;
    }
    const s = await n.text(), i = Jf(s);
    return e.set(t, i), i;
  } catch (n) {
    const s = n instanceof Error ? n.message : "Unknown error";
    r.push(`Failed to fetch external ref ${t}: ${s}`);
    return;
  }
}
function Jf(t) {
  const e = t.trim();
  if (e.startsWith("{") || e.startsWith("["))
    try {
      return JSON.parse(t);
    } catch {
    }
  return _g(t);
}
async function Xg(t) {
  const e = await fetch(t);
  if (!e.ok)
    throw new Error(`Failed to fetch spec: ${e.status} ${e.statusText}`);
  const r = await e.text();
  try {
    return Jf(r);
  } catch (n) {
    const s = n instanceof Error ? n.message : "Unknown parse error";
    throw new Error(`Failed to parse spec from ${t}: ${s}`);
  }
}
function Ec(t, e) {
  if (!e || e === "#" || e === "#/")
    return t;
  if (!e.startsWith("#/"))
    return;
  const r = e.slice(2).split("/");
  let n = t;
  for (const s of r) {
    if (n == null)
      return;
    const i = s.replace(/~1/g, "/").replace(/~0/g, "~");
    n = n[i];
  }
  return n;
}
async function Ln(t, e, r) {
  if (t == null)
    return t;
  if (Array.isArray(t))
    return Promise.all(t.map((o) => Ln(o, e, r)));
  if (typeof t != "object")
    return t;
  const n = t;
  if ("$ref" in n && typeof n.$ref == "string") {
    const o = n.$ref, a = r ? `${r}::${o}` : o;
    if (e.resolving.has(a))
      return { ...n, $ref: o };
    if (o.startsWith("#")) {
      const l = Ec(e.root, o);
      if (l !== void 0) {
        e.resolving.add(a);
        const c = await Ln(l, e, r);
        return e.resolving.delete(a), c;
      }
      return n;
    }
    if (Wg(o)) {
      const { url: l, pointer: c } = Gg(o), d = r || e.baseUrl, u = Yg(l, d);
      if (!u)
        return e.warnings.push(`Cannot resolve relative external ref "${o}" without a base URL`), n;
      e.resolving.add(a);
      const f = await Qg(u, e.externalCache, e.warnings);
      if (!f)
        return e.resolving.delete(a), n;
      let p = f;
      if (c && (p = Ec(f, c), p === void 0))
        return e.warnings.push(`Could not resolve pointer "${c}" in external document ${u}`), e.resolving.delete(a), n;
      const b = await Ln(p, {
        ...e,
        root: f
        // The external doc becomes the new root for local refs
      }, u);
      return e.resolving.delete(a), b;
    }
    return n;
  }
  const s = {}, i = Object.entries(n);
  for (const [o, a] of i)
    s[o] = await Ln(a, e, r);
  return s;
}
async function Zg(t, e = {}) {
  const { dereference: r = !0, baseUrl: n } = e, s = [];
  let i, o = n;
  if (t.url)
    i = await Xg(t.url), o || (o = t.url);
  else if (t.spec)
    i = t.spec;
  else
    throw new Error("Either url or spec must be provided");
  try {
    let a;
    r ? a = await Ln(i, {
      root: i,
      externalCache: /* @__PURE__ */ new Map(),
      resolving: /* @__PURE__ */ new Set(),
      baseUrl: o,
      warnings: s
    }) : a = i;
    const l = a.openapi;
    if (!l?.startsWith("3."))
      throw new Error(`Unsupported OpenAPI version: ${l}. Only OpenAPI 3.x is supported.`);
    return { spec: $g(a), warnings: s };
  } catch (a) {
    throw a instanceof Error ? new Error(`Failed to parse OpenAPI spec: ${a.message}`) : a;
  }
}
function e0(...t) {
  const e = new AbortController();
  for (const r of t) {
    if (r.aborted) {
      e.abort();
      break;
    }
    r.addEventListener("abort", () => e.abort());
  }
  return e.signal;
}
async function t0(t, e = {}) {
  const { timeout: r = t.timeout ?? 3e4, signal: n } = e, s = r0(t.url, t.params), i = new AbortController(), o = r > 0 ? setTimeout(() => i.abort(), r) : void 0, a = n ? e0(n, i.signal) : i.signal, l = performance.now();
  try {
    const c = t.method !== "GET" && t.method !== "HEAD", d = await fetch(s, {
      method: t.method,
      headers: t.headers,
      body: c && t.body !== void 0 ? s0(t.body, t.headers) : void 0,
      signal: a
    }), u = performance.now(), f = d.headers.get("content-type") || "", p = await d.text();
    let b = p;
    if (f.includes("application/json") && p)
      try {
        b = JSON.parse(p);
      } catch {
      }
    const g = {};
    d.headers.forEach((w, h) => {
      g[h] = w;
    });
    const m = {
      startTime: l,
      endTime: u,
      duration: u - l
    };
    return {
      status: d.status,
      statusText: d.statusText,
      headers: g,
      body: b,
      bodyText: p,
      timing: m
    };
  } catch (c) {
    throw c instanceof Error ? c.name === "AbortError" ? new Error("Request timeout") : c : new Error("Request failed");
  } finally {
    o && clearTimeout(o);
  }
}
function r0(t, e) {
  if (!e || Object.keys(e).length === 0)
    return t;
  if (/^https?:\/\//i.test(t)) {
    const o = new URL(t);
    for (const [a, l] of Object.entries(e))
      l != null && l !== "" && o.searchParams.append(a, l);
    return o.toString();
  }
  if (typeof window < "u" && window.location?.origin) {
    const o = new URL(t, window.location.origin);
    for (const [a, l] of Object.entries(e))
      l != null && l !== "" && o.searchParams.append(a, l);
    return o.toString();
  }
  const n = Object.entries(e).filter(([, o]) => o != null && o !== "");
  if (n.length === 0)
    return t;
  const s = n.map(([o, a]) => `${encodeURIComponent(o)}=${encodeURIComponent(a)}`).join("&"), i = t.includes("?") ? "&" : "?";
  return `${t}${i}${s}`;
}
function n0(t, e) {
  if (!t)
    return "";
  const r = e.toLowerCase();
  for (const [n, s] of Object.entries(t))
    if (n.toLowerCase() === r)
      return s;
  return "";
}
function s0(t, e) {
  return t == null ? "" : typeof t == "string" || t instanceof FormData || t instanceof Blob || t instanceof ArrayBuffer ? t : n0(e, "Content-Type").includes("application/x-www-form-urlencoded") ? new URLSearchParams(t).toString() : JSON.stringify(t);
}
function $c(t, e, r) {
  const n = i0(r.server, r.serverVariables), s = o0(t.path, e.path), i = a0(n, s), o = {
    ...e.headers
  };
  return e.body !== void 0 && e.contentType && (o["Content-Type"] = e.contentType), r.auth && l0(o, e.query || {}, r.auth), {
    method: t.method === "GRPC" ? "POST" : t.method,
    url: i,
    headers: Object.keys(o).length > 0 ? o : void 0,
    params: e.query,
    body: e.body,
    timeout: r.timeout
  };
}
function i0(t, e) {
  let r = t.url;
  if (t.variables)
    for (const [n, s] of Object.entries(t.variables)) {
      const i = e?.[n] ?? s.default;
      r = r.replace(`{${n}}`, i);
    }
  return r;
}
function o0(t, e) {
  if (!e)
    return t;
  let r = t;
  for (const [n, s] of Object.entries(e))
    r = r.replace(`{${n}}`, encodeURIComponent(s));
  return r;
}
function a0(t, e) {
  if (t.startsWith("http://") || t.startsWith("https://")) {
    const s = t.endsWith("/") ? t.slice(0, -1) : t, i = e.startsWith("/") ? e : `/${e}`;
    return `${s}${i}`;
  }
  const r = t.endsWith("/") ? t.slice(0, -1) : t, n = e.startsWith("/") ? e : `/${e}`;
  return `${r}${n}`;
}
function l0(t, e, r) {
  switch (r.type) {
    case "apiKey":
      if (r.in === "header")
        t[r.name] = r.value;
      else if (r.in === "query")
        e[r.name] = r.value;
      else if (r.in === "cookie") {
        const n = `${r.name}=${r.value}`;
        t.Cookie = t.Cookie ? `${t.Cookie}; ${n}` : n;
      }
      break;
    case "bearer":
      t.Authorization = `${r.scheme || "Bearer"} ${r.token}`;
      break;
    case "basic": {
      const n = btoa(`${r.username}:${r.password}`);
      t.Authorization = `Basic ${n}`;
      break;
    }
    case "oauth2":
      r.accessToken && (t.Authorization = `${r.tokenType || "Bearer"} ${r.accessToken}`);
      break;
    case "openid":
      r.accessToken && (t.Authorization = `${r.tokenType || "Bearer"} ${r.accessToken}`);
      break;
  }
}
function c0(t) {
  const e = {}, r = {}, n = {};
  for (const s of t.parameters) {
    const i = u0(s);
    if (i !== void 0) {
      const o = String(i);
      switch (s.in) {
        case "path":
          e[s.name] = o;
          break;
        case "query":
          r[s.name] = o;
          break;
        case "header":
          n[s.name] = o;
          break;
      }
    }
  }
  return {
    path: Object.keys(e).length > 0 ? e : void 0,
    query: Object.keys(r).length > 0 ? r : void 0,
    headers: Object.keys(n).length > 0 ? n : void 0
  };
}
function u0(t) {
  if (t.example !== void 0)
    return t.example;
  if (t.examples) {
    const e = Object.values(t.examples)[0];
    if (e?.value !== void 0)
      return e.value;
  }
  if (t.schema.default !== void 0)
    return t.schema.default;
  if (t.schema.enum && t.schema.enum.length > 0)
    return t.schema.enum[0];
}
function d0(t) {
  if (!t.requestBody?.content)
    return;
  const e = Object.keys(t.requestBody.content);
  return e.includes("application/json") ? "application/json" : e.includes("multipart/form-data") ? "multipart/form-data" : e.includes("application/x-www-form-urlencoded") ? "application/x-www-form-urlencoded" : e[0];
}
var Ac;
(function(t) {
  t[t.OK = 0] = "OK", t[t.CANCELLED = 1] = "CANCELLED", t[t.UNKNOWN = 2] = "UNKNOWN", t[t.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", t[t.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", t[t.NOT_FOUND = 5] = "NOT_FOUND", t[t.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", t[t.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", t[t.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", t[t.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", t[t.ABORTED = 10] = "ABORTED", t[t.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", t[t.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", t[t.INTERNAL = 13] = "INTERNAL", t[t.UNAVAILABLE = 14] = "UNAVAILABLE", t[t.DATA_LOSS = 15] = "DATA_LOSS", t[t.UNAUTHENTICATED = 16] = "UNAUTHENTICATED";
})(Ac || (Ac = {}));
const f0 = {
  null: "null",
  undefined: "undefined",
  true: "true",
  false: "false",
  indentSize: 2,
  formatKey: (t) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(t) ? t : JSON.stringify(t)
}, h0 = {
  null: "None",
  undefined: "None",
  true: "True",
  false: "False",
  indentSize: 4,
  formatKey: (t) => JSON.stringify(t)
};
function Ri(t, e, r, n) {
  if (t === null)
    return n.null;
  if (t === void 0)
    return n.undefined;
  if (t === !0)
    return n.true;
  if (t === !1)
    return n.false;
  if (typeof t == "string")
    return JSON.stringify(t);
  if (typeof t == "number")
    return String(t);
  const s = e + n.indentSize;
  if (Array.isArray(t)) {
    if (t.length === 0)
      return "[]";
    const i = t.map((o) => Ri(o, s, r, n));
    if (r) {
      const o = " ".repeat(s);
      return `[
${o}${i.join(`,
${o}`)}
${" ".repeat(e)}]`;
    }
    return `[${i.join(", ")}]`;
  }
  if (typeof t == "object") {
    const i = Object.entries(t);
    if (i.length === 0)
      return "{}";
    const o = i.map(([a, l]) => `${n.formatKey(a)}: ${Ri(l, s, r, n)}`);
    if (r) {
      const a = " ".repeat(s);
      return `{
${a}${o.join(`,
${a}`)}
${" ".repeat(e)}}`;
    }
    return `{${o.join(", ")}}`;
  }
  return String(t);
}
function Tc(t, e, r) {
  return Ri(t, e, r, f0);
}
function qo(t, e, r) {
  return Ri(t, e, r, h0);
}
function Wf(t, e) {
  if (!e || Object.keys(e).length === 0)
    return t;
  const r = new URLSearchParams(e), n = t.includes("?") ? "&" : "?";
  return `${t}${n}${r.toString()}`;
}
function Fo(t) {
  return /[^a-zA-Z0-9_\-.,/:@]/.test(t) ? `'${t.replace(/'/g, "'\\''")}'` : t;
}
function p0(t, e) {
  return t == null ? "" : typeof t == "string" ? t : JSON.stringify(t, null, e ? 2 : 0);
}
function m0(t, e = {}) {
  const { prettyPrint: r = !0 } = e, n = [], s = ["curl"];
  t.method !== "GET" && s.push("-X", t.method);
  const i = Wf(t.url, t.params), o = t.headers || {};
  for (const [a, l] of Object.entries(o))
    s.push("-H", `${a}: ${l}`);
  if (t.body !== void 0 && t.body !== null) {
    const a = p0(t.body, r);
    a && ((o["Content-Type"] || o["content-type"] || "").includes("application/json") || typeof t.body == "object" ? s.push("-d", a) : s.push("--data-raw", a));
  }
  if (s.push(Fo(i)), r) {
    n.push(s[0]);
    for (let l = 1; l < s.length; l += 2)
      l + 1 < s.length && s[l].startsWith("-") ? n.push(`  ${s[l]} ${Fo(s[l + 1])} \\`) : n.push(`  ${s[l]}`);
    const a = n.length - 2;
    a > 0 && n[a].endsWith(" \\") && (n[a] = n[a].slice(0, -2));
  } else
    n.push(s.map((a, l) => l > 0 && !a.startsWith("-") ? Fo(a) : a).join(" "));
  return n.join(`
`);
}
const g0 = {
  language: "curl",
  displayName: "cURL",
  extension: "sh",
  generate: m0
};
function y0(t, e = {}) {
  const r = [];
  r.push("package main"), r.push(""), r.push("import ("), r.push('	"encoding/json"'), r.push('	"fmt"'), r.push('	"io"'), r.push('	"net/http"'), t.body !== void 0 && t.body !== null && r.push('	"bytes"'), t.params && Object.keys(t.params).length > 0 && r.push('	"net/url"'), r.push(")"), r.push(""), r.push("func main() {");
  let n = `"${t.url}"`;
  if (t.params && Object.keys(t.params).length > 0) {
    r.push(`	baseURL := "${t.url}"`), r.push("	params := url.Values{}");
    for (const [s, i] of Object.entries(t.params))
      r.push(`	params.Add("${s}", "${i}")`);
    r.push('	reqURL := baseURL + "?" + params.Encode()'), r.push(""), n = "reqURL";
  }
  if (t.body !== void 0 && t.body !== null) {
    const s = JSON.stringify(t.body, null, "		");
    r.push(`	body := []byte(\`${s}\`)`), r.push("");
  }
  if (t.body !== void 0 && t.body !== null ? r.push(`	req, err := http.NewRequest("${t.method}", ${n}, bytes.NewBuffer(body))`) : r.push(`	req, err := http.NewRequest("${t.method}", ${n}, nil)`), r.push("	if err != nil {"), r.push('		fmt.Println("Error creating request:", err)'), r.push("		return"), r.push("	}"), r.push(""), t.headers && Object.keys(t.headers).length > 0) {
    for (const [s, i] of Object.entries(t.headers))
      r.push(`	req.Header.Set("${s}", "${i}")`);
    r.push("");
  }
  return r.push("	client := &http.Client{}"), r.push("	resp, err := client.Do(req)"), r.push("	if err != nil {"), r.push('		fmt.Println("Error sending request:", err)'), r.push("		return"), r.push("	}"), r.push("	defer resp.Body.Close()"), r.push(""), r.push("	respBody, err := io.ReadAll(resp.Body)"), r.push("	if err != nil {"), r.push('		fmt.Println("Error reading response:", err)'), r.push("		return"), r.push("	}"), r.push(""), r.push("	var result map[string]interface{}"), r.push("	if err := json.Unmarshal(respBody, &result); err != nil {"), r.push('		fmt.Println("Error parsing JSON:", err)'), r.push("		return"), r.push("	}"), r.push(""), r.push('	fmt.Printf("Status: %s\\n", resp.Status)'), r.push('	fmt.Printf("Response: %+v\\n", result)'), r.push("}"), r.join(`
`);
}
const b0 = {
  language: "go",
  displayName: "Go",
  extension: "go",
  generate: y0
};
function v0(t, e = {}) {
  const { prettyPrint: r = !0 } = e, n = [], s = r ? "  " : "", i = Wf(t.url, t.params);
  t.method, t.headers && Object.keys(t.headers).length > 0 && t.headers, t.body !== void 0 && t.body !== null && (typeof t.body == "object" || t.body), n.push("async function makeRequest() {"), t.body !== void 0 && t.body !== null && typeof t.body == "object" && (n.push(`${s}const body = ${Tc(t.body, 2, r)};`), n.push(""));
  const o = [];
  o.push(`${s}${s}method: '${t.method}',`), t.headers && Object.keys(t.headers).length > 0 && o.push(`${s}${s}headers: ${Tc(t.headers, 4, r)},`), t.body !== void 0 && t.body !== null && (typeof t.body == "object" ? o.push(`${s}${s}body: JSON.stringify(body),`) : o.push(`${s}${s}body: ${JSON.stringify(t.body)},`)), n.push(`${s}const response = await fetch('${i}', {`);
  for (const a of o)
    n.push(a);
  return n.push(`${s}});`), n.push(""), n.push(`${s}if (!response.ok) {`), n.push(`${s}${s}throw new Error(\`HTTP error! status: \${response.status}\`);`), n.push(`${s}}`), n.push(""), n.push(`${s}const data = await response.json();`), n.push(`${s}return data;`), n.push("}"), n.push(""), n.push("makeRequest()"), n.push(`${s}.then(data => console.log(data))`), n.push(`${s}.catch(error => console.error('Error:', error));`), n.join(`
`);
}
const w0 = {
  language: "javascript",
  displayName: "JavaScript",
  extension: "js",
  generate: v0
};
function k0(t, e = {}) {
  const { prettyPrint: r = !0 } = e, n = [];
  n.push("import requests"), n.push(""), n.push(`url = "${t.url}"`), t.params && Object.keys(t.params).length > 0 && n.push(`params = ${qo(t.params, 0, r)}`), t.headers && Object.keys(t.headers).length > 0 && n.push(`headers = ${qo(t.headers, 0, r)}`), t.body !== void 0 && t.body !== null && (typeof t.body == "object" ? n.push(`payload = ${qo(t.body, 0, r)}`) : n.push(`payload = ${JSON.stringify(t.body)}`)), n.push("");
  const s = t.method.toLowerCase(), i = ["url"];
  if (t.params && Object.keys(t.params).length > 0 && i.push("params=params"), t.headers && Object.keys(t.headers).length > 0 && i.push("headers=headers"), t.body !== void 0 && t.body !== null && ((t.headers?.["Content-Type"] || t.headers?.["content-type"] || "").includes("application/json") || typeof t.body == "object" ? i.push("json=payload") : i.push("data=payload")), r && i.length > 2) {
    n.push(`response = requests.${s}(`);
    for (let o = 0; o < i.length; o++) {
      const a = o < i.length - 1 ? "," : "";
      n.push(`    ${i[o]}${a}`);
    }
    n.push(")");
  } else
    n.push(`response = requests.${s}(${i.join(", ")})`);
  return n.push(""), n.push("response.raise_for_status()"), n.push(""), n.push("data = response.json()"), n.push("print(data)"), n.join(`
`);
}
const x0 = {
  language: "python",
  displayName: "Python",
  extension: "py",
  generate: k0
}, Gf = {
  curl: g0,
  javascript: w0,
  python: x0,
  go: b0
};
function S0() {
  return Object.values(Gf).map((t) => ({
    language: t.language,
    displayName: t.displayName
  }));
}
function _0(t, e, r) {
  const n = Gf[t];
  if (!n)
    throw new Error(`Unknown language: ${t}`);
  return {
    language: n.language,
    displayName: n.displayName,
    code: n.generate(e, r),
    extension: n.extension
  };
}
function E0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Es = { exports: {} }, Uo = {}, Vt = {}, fr = {}, Ko = {}, zo = {}, Vo = {}, Oc;
function ji() {
  return Oc || (Oc = 1, (function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.regexpCode = t.getEsmExportName = t.getProperty = t.safeStringify = t.stringify = t.strConcat = t.addCodeArg = t.str = t._ = t.nil = t._Code = t.Name = t.IDENTIFIER = t._CodeOrName = void 0;
    class e {
    }
    t._CodeOrName = e, t.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class r extends e {
      constructor(h) {
        if (super(), !t.IDENTIFIER.test(h))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = h;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    t.Name = r;
    class n extends e {
      constructor(h) {
        super(), this._items = typeof h == "string" ? [h] : h;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const h = this._items[0];
        return h === "" || h === '""';
      }
      get str() {
        var h;
        return (h = this._str) !== null && h !== void 0 ? h : this._str = this._items.reduce((y, k) => `${y}${k}`, "");
      }
      get names() {
        var h;
        return (h = this._names) !== null && h !== void 0 ? h : this._names = this._items.reduce((y, k) => (k instanceof r && (y[k.str] = (y[k.str] || 0) + 1), y), {});
      }
    }
    t._Code = n, t.nil = new n("");
    function s(w, ...h) {
      const y = [w[0]];
      let k = 0;
      for (; k < h.length; )
        a(y, h[k]), y.push(w[++k]);
      return new n(y);
    }
    t._ = s;
    const i = new n("+");
    function o(w, ...h) {
      const y = [p(w[0])];
      let k = 0;
      for (; k < h.length; )
        y.push(i), a(y, h[k]), y.push(i, p(w[++k]));
      return l(y), new n(y);
    }
    t.str = o;
    function a(w, h) {
      h instanceof n ? w.push(...h._items) : h instanceof r ? w.push(h) : w.push(u(h));
    }
    t.addCodeArg = a;
    function l(w) {
      let h = 1;
      for (; h < w.length - 1; ) {
        if (w[h] === i) {
          const y = c(w[h - 1], w[h + 1]);
          if (y !== void 0) {
            w.splice(h - 1, 3, y);
            continue;
          }
          w[h++] = "+";
        }
        h++;
      }
    }
    function c(w, h) {
      if (h === '""')
        return w;
      if (w === '""')
        return h;
      if (typeof w == "string")
        return h instanceof r || w[w.length - 1] !== '"' ? void 0 : typeof h != "string" ? `${w.slice(0, -1)}${h}"` : h[0] === '"' ? w.slice(0, -1) + h.slice(1) : void 0;
      if (typeof h == "string" && h[0] === '"' && !(w instanceof r))
        return `"${w}${h.slice(1)}`;
    }
    function d(w, h) {
      return h.emptyStr() ? w : w.emptyStr() ? h : o`${w}${h}`;
    }
    t.strConcat = d;
    function u(w) {
      return typeof w == "number" || typeof w == "boolean" || w === null ? w : p(Array.isArray(w) ? w.join(",") : w);
    }
    function f(w) {
      return new n(p(w));
    }
    t.stringify = f;
    function p(w) {
      return JSON.stringify(w).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    t.safeStringify = p;
    function b(w) {
      return typeof w == "string" && t.IDENTIFIER.test(w) ? new n(`.${w}`) : s`[${w}]`;
    }
    t.getProperty = b;
    function g(w) {
      if (typeof w == "string" && t.IDENTIFIER.test(w))
        return new n(`${w}`);
      throw new Error(`CodeGen: invalid export name: ${w}, use explicit $id name mapping`);
    }
    t.getEsmExportName = g;
    function m(w) {
      return new n(w.toString());
    }
    t.regexpCode = m;
  })(Vo)), Vo;
}
var Ho = {}, Cc;
function Nc() {
  return Cc || (Cc = 1, (function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.ValueScope = t.ValueScopeName = t.Scope = t.varKinds = t.UsedValueState = void 0;
    const e = ji();
    class r extends Error {
      constructor(c) {
        super(`CodeGen: "code" for ${c} not defined`), this.value = c.value;
      }
    }
    var n;
    (function(l) {
      l[l.Started = 0] = "Started", l[l.Completed = 1] = "Completed";
    })(n || (t.UsedValueState = n = {})), t.varKinds = {
      const: new e.Name("const"),
      let: new e.Name("let"),
      var: new e.Name("var")
    };
    class s {
      constructor({ prefixes: c, parent: d } = {}) {
        this._names = {}, this._prefixes = c, this._parent = d;
      }
      toName(c) {
        return c instanceof e.Name ? c : this.name(c);
      }
      name(c) {
        return new e.Name(this._newName(c));
      }
      _newName(c) {
        const d = this._names[c] || this._nameGroup(c);
        return `${c}${d.index++}`;
      }
      _nameGroup(c) {
        var d, u;
        if (!((u = (d = this._parent) === null || d === void 0 ? void 0 : d._prefixes) === null || u === void 0) && u.has(c) || this._prefixes && !this._prefixes.has(c))
          throw new Error(`CodeGen: prefix "${c}" is not allowed in this scope`);
        return this._names[c] = { prefix: c, index: 0 };
      }
    }
    t.Scope = s;
    class i extends e.Name {
      constructor(c, d) {
        super(d), this.prefix = c;
      }
      setValue(c, { property: d, itemIndex: u }) {
        this.value = c, this.scopePath = (0, e._)`.${new e.Name(d)}[${u}]`;
      }
    }
    t.ValueScopeName = i;
    const o = (0, e._)`\n`;
    class a extends s {
      constructor(c) {
        super(c), this._values = {}, this._scope = c.scope, this.opts = { ...c, _n: c.lines ? o : e.nil };
      }
      get() {
        return this._scope;
      }
      name(c) {
        return new i(c, this._newName(c));
      }
      value(c, d) {
        var u;
        if (d.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const f = this.toName(c), { prefix: p } = f, b = (u = d.key) !== null && u !== void 0 ? u : d.ref;
        let g = this._values[p];
        if (g) {
          const h = g.get(b);
          if (h)
            return h;
        } else
          g = this._values[p] = /* @__PURE__ */ new Map();
        g.set(b, f);
        const m = this._scope[p] || (this._scope[p] = []), w = m.length;
        return m[w] = d.ref, f.setValue(d, { property: p, itemIndex: w }), f;
      }
      getValue(c, d) {
        const u = this._values[c];
        if (u)
          return u.get(d);
      }
      scopeRefs(c, d = this._values) {
        return this._reduceValues(d, (u) => {
          if (u.scopePath === void 0)
            throw new Error(`CodeGen: name "${u}" has no value`);
          return (0, e._)`${c}${u.scopePath}`;
        });
      }
      scopeCode(c = this._values, d, u) {
        return this._reduceValues(c, (f) => {
          if (f.value === void 0)
            throw new Error(`CodeGen: name "${f}" has no value`);
          return f.value.code;
        }, d, u);
      }
      _reduceValues(c, d, u = {}, f) {
        let p = e.nil;
        for (const b in c) {
          const g = c[b];
          if (!g)
            continue;
          const m = u[b] = u[b] || /* @__PURE__ */ new Map();
          g.forEach((w) => {
            if (m.has(w))
              return;
            m.set(w, n.Started);
            let h = d(w);
            if (h) {
              const y = this.opts.es5 ? t.varKinds.var : t.varKinds.const;
              p = (0, e._)`${p}${y} ${w} = ${h};${this.opts._n}`;
            } else if (h = f?.(w))
              p = (0, e._)`${p}${h}${this.opts._n}`;
            else
              throw new r(w);
            m.set(w, n.Completed);
          });
        }
        return p;
      }
    }
    t.ValueScope = a;
  })(Ho)), Ho;
}
var Ic;
function fe() {
  return Ic || (Ic = 1, (function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.or = t.and = t.not = t.CodeGen = t.operators = t.varKinds = t.ValueScopeName = t.ValueScope = t.Scope = t.Name = t.regexpCode = t.stringify = t.getProperty = t.nil = t.strConcat = t.str = t._ = void 0;
    const e = ji(), r = Nc();
    var n = ji();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(t, "strConcat", { enumerable: !0, get: function() {
      return n.strConcat;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(t, "getProperty", { enumerable: !0, get: function() {
      return n.getProperty;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(t, "regexpCode", { enumerable: !0, get: function() {
      return n.regexpCode;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } });
    var s = Nc();
    Object.defineProperty(t, "Scope", { enumerable: !0, get: function() {
      return s.Scope;
    } }), Object.defineProperty(t, "ValueScope", { enumerable: !0, get: function() {
      return s.ValueScope;
    } }), Object.defineProperty(t, "ValueScopeName", { enumerable: !0, get: function() {
      return s.ValueScopeName;
    } }), Object.defineProperty(t, "varKinds", { enumerable: !0, get: function() {
      return s.varKinds;
    } }), t.operators = {
      GT: new e._Code(">"),
      GTE: new e._Code(">="),
      LT: new e._Code("<"),
      LTE: new e._Code("<="),
      EQ: new e._Code("==="),
      NEQ: new e._Code("!=="),
      NOT: new e._Code("!"),
      OR: new e._Code("||"),
      AND: new e._Code("&&"),
      ADD: new e._Code("+")
    };
    class i {
      optimizeNodes() {
        return this;
      }
      optimizeNames(E, O) {
        return this;
      }
    }
    class o extends i {
      constructor(E, O, B) {
        super(), this.varKind = E, this.name = O, this.rhs = B;
      }
      render({ es5: E, _n: O }) {
        const B = E ? r.varKinds.var : this.varKind, V = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${B} ${this.name}${V};` + O;
      }
      optimizeNames(E, O) {
        if (E[this.name.str])
          return this.rhs && (this.rhs = Y(this.rhs, E, O)), this;
      }
      get names() {
        return this.rhs instanceof e._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends i {
      constructor(E, O, B) {
        super(), this.lhs = E, this.rhs = O, this.sideEffects = B;
      }
      render({ _n: E }) {
        return `${this.lhs} = ${this.rhs};` + E;
      }
      optimizeNames(E, O) {
        if (!(this.lhs instanceof e.Name && !E[this.lhs.str] && !this.sideEffects))
          return this.rhs = Y(this.rhs, E, O), this;
      }
      get names() {
        const E = this.lhs instanceof e.Name ? {} : { ...this.lhs.names };
        return U(E, this.rhs);
      }
    }
    class l extends a {
      constructor(E, O, B, V) {
        super(E, B, V), this.op = O;
      }
      render({ _n: E }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + E;
      }
    }
    class c extends i {
      constructor(E) {
        super(), this.label = E, this.names = {};
      }
      render({ _n: E }) {
        return `${this.label}:` + E;
      }
    }
    class d extends i {
      constructor(E) {
        super(), this.label = E, this.names = {};
      }
      render({ _n: E }) {
        return `break${this.label ? ` ${this.label}` : ""};` + E;
      }
    }
    class u extends i {
      constructor(E) {
        super(), this.error = E;
      }
      render({ _n: E }) {
        return `throw ${this.error};` + E;
      }
      get names() {
        return this.error.names;
      }
    }
    class f extends i {
      constructor(E) {
        super(), this.code = E;
      }
      render({ _n: E }) {
        return `${this.code};` + E;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(E, O) {
        return this.code = Y(this.code, E, O), this;
      }
      get names() {
        return this.code instanceof e._CodeOrName ? this.code.names : {};
      }
    }
    class p extends i {
      constructor(E = []) {
        super(), this.nodes = E;
      }
      render(E) {
        return this.nodes.reduce((O, B) => O + B.render(E), "");
      }
      optimizeNodes() {
        const { nodes: E } = this;
        let O = E.length;
        for (; O--; ) {
          const B = E[O].optimizeNodes();
          Array.isArray(B) ? E.splice(O, 1, ...B) : B ? E[O] = B : E.splice(O, 1);
        }
        return E.length > 0 ? this : void 0;
      }
      optimizeNames(E, O) {
        const { nodes: B } = this;
        let V = B.length;
        for (; V--; ) {
          const J = B[V];
          J.optimizeNames(E, O) || (se(E, J.names), B.splice(V, 1));
        }
        return B.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((E, O) => D(E, O.names), {});
      }
    }
    class b extends p {
      render(E) {
        return "{" + E._n + super.render(E) + "}" + E._n;
      }
    }
    class g extends p {
    }
    class m extends b {
    }
    m.kind = "else";
    class w extends b {
      constructor(E, O) {
        super(O), this.condition = E;
      }
      render(E) {
        let O = `if(${this.condition})` + super.render(E);
        return this.else && (O += "else " + this.else.render(E)), O;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const E = this.condition;
        if (E === !0)
          return this.nodes;
        let O = this.else;
        if (O) {
          const B = O.optimizeNodes();
          O = this.else = Array.isArray(B) ? new m(B) : B;
        }
        if (O)
          return E === !1 ? O instanceof w ? O : O.nodes : this.nodes.length ? this : new w(be(E), O instanceof w ? [O] : O.nodes);
        if (!(E === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(E, O) {
        var B;
        if (this.else = (B = this.else) === null || B === void 0 ? void 0 : B.optimizeNames(E, O), !!(super.optimizeNames(E, O) || this.else))
          return this.condition = Y(this.condition, E, O), this;
      }
      get names() {
        const E = super.names;
        return U(E, this.condition), this.else && D(E, this.else.names), E;
      }
    }
    w.kind = "if";
    class h extends b {
    }
    h.kind = "for";
    class y extends h {
      constructor(E) {
        super(), this.iteration = E;
      }
      render(E) {
        return `for(${this.iteration})` + super.render(E);
      }
      optimizeNames(E, O) {
        if (super.optimizeNames(E, O))
          return this.iteration = Y(this.iteration, E, O), this;
      }
      get names() {
        return D(super.names, this.iteration.names);
      }
    }
    class k extends h {
      constructor(E, O, B, V) {
        super(), this.varKind = E, this.name = O, this.from = B, this.to = V;
      }
      render(E) {
        const O = E.es5 ? r.varKinds.var : this.varKind, { name: B, from: V, to: J } = this;
        return `for(${O} ${B}=${V}; ${B}<${J}; ${B}++)` + super.render(E);
      }
      get names() {
        const E = U(super.names, this.from);
        return U(E, this.to);
      }
    }
    class v extends h {
      constructor(E, O, B, V) {
        super(), this.loop = E, this.varKind = O, this.name = B, this.iterable = V;
      }
      render(E) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(E);
      }
      optimizeNames(E, O) {
        if (super.optimizeNames(E, O))
          return this.iterable = Y(this.iterable, E, O), this;
      }
      get names() {
        return D(super.names, this.iterable.names);
      }
    }
    class x extends b {
      constructor(E, O, B) {
        super(), this.name = E, this.args = O, this.async = B;
      }
      render(E) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(E);
      }
    }
    x.kind = "func";
    class S extends p {
      render(E) {
        return "return " + super.render(E);
      }
    }
    S.kind = "return";
    class _ extends b {
      render(E) {
        let O = "try" + super.render(E);
        return this.catch && (O += this.catch.render(E)), this.finally && (O += this.finally.render(E)), O;
      }
      optimizeNodes() {
        var E, O;
        return super.optimizeNodes(), (E = this.catch) === null || E === void 0 || E.optimizeNodes(), (O = this.finally) === null || O === void 0 || O.optimizeNodes(), this;
      }
      optimizeNames(E, O) {
        var B, V;
        return super.optimizeNames(E, O), (B = this.catch) === null || B === void 0 || B.optimizeNames(E, O), (V = this.finally) === null || V === void 0 || V.optimizeNames(E, O), this;
      }
      get names() {
        const E = super.names;
        return this.catch && D(E, this.catch.names), this.finally && D(E, this.finally.names), E;
      }
    }
    class T extends b {
      constructor(E) {
        super(), this.error = E;
      }
      render(E) {
        return `catch(${this.error})` + super.render(E);
      }
    }
    T.kind = "catch";
    class P extends b {
      render(E) {
        return "finally" + super.render(E);
      }
    }
    P.kind = "finally";
    class R {
      constructor(E, O = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...O, _n: O.lines ? `
` : "" }, this._extScope = E, this._scope = new r.Scope({ parent: E }), this._nodes = [new g()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(E) {
        return this._scope.name(E);
      }
      // reserves unique name in the external scope
      scopeName(E) {
        return this._extScope.name(E);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(E, O) {
        const B = this._extScope.value(E, O);
        return (this._values[B.prefix] || (this._values[B.prefix] = /* @__PURE__ */ new Set())).add(B), B;
      }
      getScopeValue(E, O) {
        return this._extScope.getValue(E, O);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(E) {
        return this._extScope.scopeRefs(E, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(E, O, B, V) {
        const J = this._scope.toName(O);
        return B !== void 0 && V && (this._constants[J.str] = B), this._leafNode(new o(E, J, B)), J;
      }
      // `const` declaration (`var` in es5 mode)
      const(E, O, B) {
        return this._def(r.varKinds.const, E, O, B);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(E, O, B) {
        return this._def(r.varKinds.let, E, O, B);
      }
      // `var` declaration with optional assignment
      var(E, O, B) {
        return this._def(r.varKinds.var, E, O, B);
      }
      // assignment code
      assign(E, O, B) {
        return this._leafNode(new a(E, O, B));
      }
      // `+=` code
      add(E, O) {
        return this._leafNode(new l(E, t.operators.ADD, O));
      }
      // appends passed SafeExpr to code or executes Block
      code(E) {
        return typeof E == "function" ? E() : E !== e.nil && this._leafNode(new f(E)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...E) {
        const O = ["{"];
        for (const [B, V] of E)
          O.length > 1 && O.push(","), O.push(B), (B !== V || this.opts.es5) && (O.push(":"), (0, e.addCodeArg)(O, V));
        return O.push("}"), new e._Code(O);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(E, O, B) {
        if (this._blockNode(new w(E)), O && B)
          this.code(O).else().code(B).endIf();
        else if (O)
          this.code(O).endIf();
        else if (B)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(E) {
        return this._elseNode(new w(E));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new m());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(w, m);
      }
      _for(E, O) {
        return this._blockNode(E), O && this.code(O).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(E, O) {
        return this._for(new y(E), O);
      }
      // `for` statement for a range of values
      forRange(E, O, B, V, J = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
        const ie = this._scope.toName(E);
        return this._for(new k(J, ie, O, B), () => V(ie));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(E, O, B, V = r.varKinds.const) {
        const J = this._scope.toName(E);
        if (this.opts.es5) {
          const ie = O instanceof e.Name ? O : this.var("_arr", O);
          return this.forRange("_i", 0, (0, e._)`${ie}.length`, (ne) => {
            this.var(J, (0, e._)`${ie}[${ne}]`), B(J);
          });
        }
        return this._for(new v("of", V, J, O), () => B(J));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(E, O, B, V = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(E, (0, e._)`Object.keys(${O})`, B);
        const J = this._scope.toName(E);
        return this._for(new v("in", V, J, O), () => B(J));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(h);
      }
      // `label` statement
      label(E) {
        return this._leafNode(new c(E));
      }
      // `break` statement
      break(E) {
        return this._leafNode(new d(E));
      }
      // `return` statement
      return(E) {
        const O = new S();
        if (this._blockNode(O), this.code(E), O.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(S);
      }
      // `try` statement
      try(E, O, B) {
        if (!O && !B)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const V = new _();
        if (this._blockNode(V), this.code(E), O) {
          const J = this.name("e");
          this._currNode = V.catch = new T(J), O(J);
        }
        return B && (this._currNode = V.finally = new P(), this.code(B)), this._endBlockNode(T, P);
      }
      // `throw` statement
      throw(E) {
        return this._leafNode(new u(E));
      }
      // start self-balancing block
      block(E, O) {
        return this._blockStarts.push(this._nodes.length), E && this.code(E).endBlock(O), this;
      }
      // end the current self-balancing block
      endBlock(E) {
        const O = this._blockStarts.pop();
        if (O === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const B = this._nodes.length - O;
        if (B < 0 || E !== void 0 && B !== E)
          throw new Error(`CodeGen: wrong number of nodes: ${B} vs ${E} expected`);
        return this._nodes.length = O, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(E, O = e.nil, B, V) {
        return this._blockNode(new x(E, O, B)), V && this.code(V).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(x);
      }
      optimize(E = 1) {
        for (; E-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(E) {
        return this._currNode.nodes.push(E), this;
      }
      _blockNode(E) {
        this._currNode.nodes.push(E), this._nodes.push(E);
      }
      _endBlockNode(E, O) {
        const B = this._currNode;
        if (B instanceof E || O && B instanceof O)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${O ? `${E.kind}/${O.kind}` : E.kind}"`);
      }
      _elseNode(E) {
        const O = this._currNode;
        if (!(O instanceof w))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = O.else = E, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const E = this._nodes;
        return E[E.length - 1];
      }
      set _currNode(E) {
        const O = this._nodes;
        O[O.length - 1] = E;
      }
    }
    t.CodeGen = R;
    function D(L, E) {
      for (const O in E)
        L[O] = (L[O] || 0) + (E[O] || 0);
      return L;
    }
    function U(L, E) {
      return E instanceof e._CodeOrName ? D(L, E.names) : L;
    }
    function Y(L, E, O) {
      if (L instanceof e.Name)
        return B(L);
      if (!V(L))
        return L;
      return new e._Code(L._items.reduce((J, ie) => (ie instanceof e.Name && (ie = B(ie)), ie instanceof e._Code ? J.push(...ie._items) : J.push(ie), J), []));
      function B(J) {
        const ie = O[J.str];
        return ie === void 0 || E[J.str] !== 1 ? J : (delete E[J.str], ie);
      }
      function V(J) {
        return J instanceof e._Code && J._items.some((ie) => ie instanceof e.Name && E[ie.str] === 1 && O[ie.str] !== void 0);
      }
    }
    function se(L, E) {
      for (const O in E)
        L[O] = (L[O] || 0) - (E[O] || 0);
    }
    function be(L) {
      return typeof L == "boolean" || typeof L == "number" || L === null ? !L : (0, e._)`!${F(L)}`;
    }
    t.not = be;
    const xe = I(t.operators.AND);
    function W(...L) {
      return L.reduce(xe);
    }
    t.and = W;
    const ce = I(t.operators.OR);
    function K(...L) {
      return L.reduce(ce);
    }
    t.or = K;
    function I(L) {
      return (E, O) => E === e.nil ? O : O === e.nil ? E : (0, e._)`${F(E)} ${L} ${F(O)}`;
    }
    function F(L) {
      return L instanceof e.Name ? L : (0, e._)`(${L})`;
    }
  })(zo)), zo;
}
var ue = {}, Pc;
function ge() {
  if (Pc) return ue;
  Pc = 1, Object.defineProperty(ue, "__esModule", { value: !0 }), ue.checkStrictMode = ue.getErrorPath = ue.Type = ue.useFunc = ue.setEvaluated = ue.evaluatedPropsToName = ue.mergeEvaluated = ue.eachItem = ue.unescapeJsonPointer = ue.escapeJsonPointer = ue.escapeFragment = ue.unescapeFragment = ue.schemaRefOrVal = ue.schemaHasRulesButRef = ue.schemaHasRules = ue.checkUnknownRules = ue.alwaysValidSchema = ue.toHash = void 0;
  const t = fe(), e = ji();
  function r(v) {
    const x = {};
    for (const S of v)
      x[S] = !0;
    return x;
  }
  ue.toHash = r;
  function n(v, x) {
    return typeof x == "boolean" ? x : Object.keys(x).length === 0 ? !0 : (s(v, x), !i(x, v.self.RULES.all));
  }
  ue.alwaysValidSchema = n;
  function s(v, x = v.schema) {
    const { opts: S, self: _ } = v;
    if (!S.strictSchema || typeof x == "boolean")
      return;
    const T = _.RULES.keywords;
    for (const P in x)
      T[P] || k(v, `unknown keyword: "${P}"`);
  }
  ue.checkUnknownRules = s;
  function i(v, x) {
    if (typeof v == "boolean")
      return !v;
    for (const S in v)
      if (x[S])
        return !0;
    return !1;
  }
  ue.schemaHasRules = i;
  function o(v, x) {
    if (typeof v == "boolean")
      return !v;
    for (const S in v)
      if (S !== "$ref" && x.all[S])
        return !0;
    return !1;
  }
  ue.schemaHasRulesButRef = o;
  function a({ topSchemaRef: v, schemaPath: x }, S, _, T) {
    if (!T) {
      if (typeof S == "number" || typeof S == "boolean")
        return S;
      if (typeof S == "string")
        return (0, t._)`${S}`;
    }
    return (0, t._)`${v}${x}${(0, t.getProperty)(_)}`;
  }
  ue.schemaRefOrVal = a;
  function l(v) {
    return u(decodeURIComponent(v));
  }
  ue.unescapeFragment = l;
  function c(v) {
    return encodeURIComponent(d(v));
  }
  ue.escapeFragment = c;
  function d(v) {
    return typeof v == "number" ? `${v}` : v.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  ue.escapeJsonPointer = d;
  function u(v) {
    return v.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  ue.unescapeJsonPointer = u;
  function f(v, x) {
    if (Array.isArray(v))
      for (const S of v)
        x(S);
    else
      x(v);
  }
  ue.eachItem = f;
  function p({ mergeNames: v, mergeToName: x, mergeValues: S, resultToName: _ }) {
    return (T, P, R, D) => {
      const U = R === void 0 ? P : R instanceof t.Name ? (P instanceof t.Name ? v(T, P, R) : x(T, P, R), R) : P instanceof t.Name ? (x(T, R, P), P) : S(P, R);
      return D === t.Name && !(U instanceof t.Name) ? _(T, U) : U;
    };
  }
  ue.mergeEvaluated = {
    props: p({
      mergeNames: (v, x, S) => v.if((0, t._)`${S} !== true && ${x} !== undefined`, () => {
        v.if((0, t._)`${x} === true`, () => v.assign(S, !0), () => v.assign(S, (0, t._)`${S} || {}`).code((0, t._)`Object.assign(${S}, ${x})`));
      }),
      mergeToName: (v, x, S) => v.if((0, t._)`${S} !== true`, () => {
        x === !0 ? v.assign(S, !0) : (v.assign(S, (0, t._)`${S} || {}`), g(v, S, x));
      }),
      mergeValues: (v, x) => v === !0 ? !0 : { ...v, ...x },
      resultToName: b
    }),
    items: p({
      mergeNames: (v, x, S) => v.if((0, t._)`${S} !== true && ${x} !== undefined`, () => v.assign(S, (0, t._)`${x} === true ? true : ${S} > ${x} ? ${S} : ${x}`)),
      mergeToName: (v, x, S) => v.if((0, t._)`${S} !== true`, () => v.assign(S, x === !0 ? !0 : (0, t._)`${S} > ${x} ? ${S} : ${x}`)),
      mergeValues: (v, x) => v === !0 ? !0 : Math.max(v, x),
      resultToName: (v, x) => v.var("items", x)
    })
  };
  function b(v, x) {
    if (x === !0)
      return v.var("props", !0);
    const S = v.var("props", (0, t._)`{}`);
    return x !== void 0 && g(v, S, x), S;
  }
  ue.evaluatedPropsToName = b;
  function g(v, x, S) {
    Object.keys(S).forEach((_) => v.assign((0, t._)`${x}${(0, t.getProperty)(_)}`, !0));
  }
  ue.setEvaluated = g;
  const m = {};
  function w(v, x) {
    return v.scopeValue("func", {
      ref: x,
      code: m[x.code] || (m[x.code] = new e._Code(x.code))
    });
  }
  ue.useFunc = w;
  var h;
  (function(v) {
    v[v.Num = 0] = "Num", v[v.Str = 1] = "Str";
  })(h || (ue.Type = h = {}));
  function y(v, x, S) {
    if (v instanceof t.Name) {
      const _ = x === h.Num;
      return S ? _ ? (0, t._)`"[" + ${v} + "]"` : (0, t._)`"['" + ${v} + "']"` : _ ? (0, t._)`"/" + ${v}` : (0, t._)`"/" + ${v}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return S ? (0, t.getProperty)(v).toString() : "/" + d(v);
  }
  ue.getErrorPath = y;
  function k(v, x, S = v.opts.strictSchema) {
    if (S) {
      if (x = `strict mode: ${x}`, S === !0)
        throw new Error(x);
      v.self.logger.warn(x);
    }
  }
  return ue.checkStrictMode = k, ue;
}
var $s = {}, Lc;
function ar() {
  if (Lc) return $s;
  Lc = 1, Object.defineProperty($s, "__esModule", { value: !0 });
  const t = fe(), e = {
    // validation function arguments
    data: new t.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new t.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new t.Name("instancePath"),
    parentData: new t.Name("parentData"),
    parentDataProperty: new t.Name("parentDataProperty"),
    rootData: new t.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new t.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new t.Name("vErrors"),
    // null or array of validation errors
    errors: new t.Name("errors"),
    // counter of validation errors
    this: new t.Name("this"),
    // "globals"
    self: new t.Name("self"),
    scope: new t.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new t.Name("json"),
    jsonPos: new t.Name("jsonPos"),
    jsonLen: new t.Name("jsonLen"),
    jsonPart: new t.Name("jsonPart")
  };
  return $s.default = e, $s;
}
var Rc;
function lo() {
  return Rc || (Rc = 1, (function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.extendErrors = t.resetErrorsCount = t.reportExtraError = t.reportError = t.keyword$DataError = t.keywordError = void 0;
    const e = fe(), r = ge(), n = ar();
    t.keywordError = {
      message: ({ keyword: m }) => (0, e.str)`must pass "${m}" keyword validation`
    }, t.keyword$DataError = {
      message: ({ keyword: m, schemaType: w }) => w ? (0, e.str)`"${m}" keyword must be ${w} ($data)` : (0, e.str)`"${m}" keyword is invalid ($data)`
    };
    function s(m, w = t.keywordError, h, y) {
      const { it: k } = m, { gen: v, compositeRule: x, allErrors: S } = k, _ = u(m, w, h);
      y ?? (x || S) ? l(v, _) : c(k, (0, e._)`[${_}]`);
    }
    t.reportError = s;
    function i(m, w = t.keywordError, h) {
      const { it: y } = m, { gen: k, compositeRule: v, allErrors: x } = y, S = u(m, w, h);
      l(k, S), v || x || c(y, n.default.vErrors);
    }
    t.reportExtraError = i;
    function o(m, w) {
      m.assign(n.default.errors, w), m.if((0, e._)`${n.default.vErrors} !== null`, () => m.if(w, () => m.assign((0, e._)`${n.default.vErrors}.length`, w), () => m.assign(n.default.vErrors, null)));
    }
    t.resetErrorsCount = o;
    function a({ gen: m, keyword: w, schemaValue: h, data: y, errsCount: k, it: v }) {
      if (k === void 0)
        throw new Error("ajv implementation error");
      const x = m.name("err");
      m.forRange("i", k, n.default.errors, (S) => {
        m.const(x, (0, e._)`${n.default.vErrors}[${S}]`), m.if((0, e._)`${x}.instancePath === undefined`, () => m.assign((0, e._)`${x}.instancePath`, (0, e.strConcat)(n.default.instancePath, v.errorPath))), m.assign((0, e._)`${x}.schemaPath`, (0, e.str)`${v.errSchemaPath}/${w}`), v.opts.verbose && (m.assign((0, e._)`${x}.schema`, h), m.assign((0, e._)`${x}.data`, y));
      });
    }
    t.extendErrors = a;
    function l(m, w) {
      const h = m.const("err", w);
      m.if((0, e._)`${n.default.vErrors} === null`, () => m.assign(n.default.vErrors, (0, e._)`[${h}]`), (0, e._)`${n.default.vErrors}.push(${h})`), m.code((0, e._)`${n.default.errors}++`);
    }
    function c(m, w) {
      const { gen: h, validateName: y, schemaEnv: k } = m;
      k.$async ? h.throw((0, e._)`new ${m.ValidationError}(${w})`) : (h.assign((0, e._)`${y}.errors`, w), h.return(!1));
    }
    const d = {
      keyword: new e.Name("keyword"),
      schemaPath: new e.Name("schemaPath"),
      // also used in JTD errors
      params: new e.Name("params"),
      propertyName: new e.Name("propertyName"),
      message: new e.Name("message"),
      schema: new e.Name("schema"),
      parentSchema: new e.Name("parentSchema")
    };
    function u(m, w, h) {
      const { createErrors: y } = m.it;
      return y === !1 ? (0, e._)`{}` : f(m, w, h);
    }
    function f(m, w, h = {}) {
      const { gen: y, it: k } = m, v = [
        p(k, h),
        b(m, h)
      ];
      return g(m, w, v), y.object(...v);
    }
    function p({ errorPath: m }, { instancePath: w }) {
      const h = w ? (0, e.str)`${m}${(0, r.getErrorPath)(w, r.Type.Str)}` : m;
      return [n.default.instancePath, (0, e.strConcat)(n.default.instancePath, h)];
    }
    function b({ keyword: m, it: { errSchemaPath: w } }, { schemaPath: h, parentSchema: y }) {
      let k = y ? w : (0, e.str)`${w}/${m}`;
      return h && (k = (0, e.str)`${k}${(0, r.getErrorPath)(h, r.Type.Str)}`), [d.schemaPath, k];
    }
    function g(m, { params: w, message: h }, y) {
      const { keyword: k, data: v, schemaValue: x, it: S } = m, { opts: _, propertyName: T, topSchemaRef: P, schemaPath: R } = S;
      y.push([d.keyword, k], [d.params, typeof w == "function" ? w(m) : w || (0, e._)`{}`]), _.messages && y.push([d.message, typeof h == "function" ? h(m) : h]), _.verbose && y.push([d.schema, x], [d.parentSchema, (0, e._)`${P}${R}`], [n.default.data, v]), T && y.push([d.propertyName, T]);
    }
  })(Ko)), Ko;
}
var jc;
function $0() {
  if (jc) return fr;
  jc = 1, Object.defineProperty(fr, "__esModule", { value: !0 }), fr.boolOrEmptySchema = fr.topBoolOrEmptySchema = void 0;
  const t = lo(), e = fe(), r = ar(), n = {
    message: "boolean schema is false"
  };
  function s(a) {
    const { gen: l, schema: c, validateName: d } = a;
    c === !1 ? o(a, !1) : typeof c == "object" && c.$async === !0 ? l.return(r.default.data) : (l.assign((0, e._)`${d}.errors`, null), l.return(!0));
  }
  fr.topBoolOrEmptySchema = s;
  function i(a, l) {
    const { gen: c, schema: d } = a;
    d === !1 ? (c.var(l, !1), o(a)) : c.var(l, !0);
  }
  fr.boolOrEmptySchema = i;
  function o(a, l) {
    const { gen: c, data: d } = a, u = {
      gen: c,
      keyword: "false schema",
      data: d,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, t.reportError)(u, n, void 0, l);
  }
  return fr;
}
var Je = {}, hr = {}, Mc;
function Yf() {
  if (Mc) return hr;
  Mc = 1, Object.defineProperty(hr, "__esModule", { value: !0 }), hr.getRules = hr.isJSONType = void 0;
  const t = ["string", "number", "integer", "boolean", "null", "object", "array"], e = new Set(t);
  function r(s) {
    return typeof s == "string" && e.has(s);
  }
  hr.isJSONType = r;
  function n() {
    const s = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...s, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, s.number, s.string, s.array, s.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return hr.getRules = n, hr;
}
var Ht = {}, Dc;
function Qf() {
  if (Dc) return Ht;
  Dc = 1, Object.defineProperty(Ht, "__esModule", { value: !0 }), Ht.shouldUseRule = Ht.shouldUseGroup = Ht.schemaHasRulesForType = void 0;
  function t({ schema: n, self: s }, i) {
    const o = s.RULES.types[i];
    return o && o !== !0 && e(n, o);
  }
  Ht.schemaHasRulesForType = t;
  function e(n, s) {
    return s.rules.some((i) => r(n, i));
  }
  Ht.shouldUseGroup = e;
  function r(n, s) {
    var i;
    return n[s.keyword] !== void 0 || ((i = s.definition.implements) === null || i === void 0 ? void 0 : i.some((o) => n[o] !== void 0));
  }
  return Ht.shouldUseRule = r, Ht;
}
var Bc;
function Mi() {
  if (Bc) return Je;
  Bc = 1, Object.defineProperty(Je, "__esModule", { value: !0 }), Je.reportTypeError = Je.checkDataTypes = Je.checkDataType = Je.coerceAndCheckDataType = Je.getJSONTypes = Je.getSchemaTypes = Je.DataType = void 0;
  const t = Yf(), e = Qf(), r = lo(), n = fe(), s = ge();
  var i;
  (function(h) {
    h[h.Correct = 0] = "Correct", h[h.Wrong = 1] = "Wrong";
  })(i || (Je.DataType = i = {}));
  function o(h) {
    const y = a(h.type);
    if (y.includes("null")) {
      if (h.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!y.length && h.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      h.nullable === !0 && y.push("null");
    }
    return y;
  }
  Je.getSchemaTypes = o;
  function a(h) {
    const y = Array.isArray(h) ? h : h ? [h] : [];
    if (y.every(t.isJSONType))
      return y;
    throw new Error("type must be JSONType or JSONType[]: " + y.join(","));
  }
  Je.getJSONTypes = a;
  function l(h, y) {
    const { gen: k, data: v, opts: x } = h, S = d(y, x.coerceTypes), _ = y.length > 0 && !(S.length === 0 && y.length === 1 && (0, e.schemaHasRulesForType)(h, y[0]));
    if (_) {
      const T = b(y, v, x.strictNumbers, i.Wrong);
      k.if(T, () => {
        S.length ? u(h, y, S) : m(h);
      });
    }
    return _;
  }
  Je.coerceAndCheckDataType = l;
  const c = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function d(h, y) {
    return y ? h.filter((k) => c.has(k) || y === "array" && k === "array") : [];
  }
  function u(h, y, k) {
    const { gen: v, data: x, opts: S } = h, _ = v.let("dataType", (0, n._)`typeof ${x}`), T = v.let("coerced", (0, n._)`undefined`);
    S.coerceTypes === "array" && v.if((0, n._)`${_} == 'object' && Array.isArray(${x}) && ${x}.length == 1`, () => v.assign(x, (0, n._)`${x}[0]`).assign(_, (0, n._)`typeof ${x}`).if(b(y, x, S.strictNumbers), () => v.assign(T, x))), v.if((0, n._)`${T} !== undefined`);
    for (const R of k)
      (c.has(R) || R === "array" && S.coerceTypes === "array") && P(R);
    v.else(), m(h), v.endIf(), v.if((0, n._)`${T} !== undefined`, () => {
      v.assign(x, T), f(h, T);
    });
    function P(R) {
      switch (R) {
        case "string":
          v.elseIf((0, n._)`${_} == "number" || ${_} == "boolean"`).assign(T, (0, n._)`"" + ${x}`).elseIf((0, n._)`${x} === null`).assign(T, (0, n._)`""`);
          return;
        case "number":
          v.elseIf((0, n._)`${_} == "boolean" || ${x} === null
              || (${_} == "string" && ${x} && ${x} == +${x})`).assign(T, (0, n._)`+${x}`);
          return;
        case "integer":
          v.elseIf((0, n._)`${_} === "boolean" || ${x} === null
              || (${_} === "string" && ${x} && ${x} == +${x} && !(${x} % 1))`).assign(T, (0, n._)`+${x}`);
          return;
        case "boolean":
          v.elseIf((0, n._)`${x} === "false" || ${x} === 0 || ${x} === null`).assign(T, !1).elseIf((0, n._)`${x} === "true" || ${x} === 1`).assign(T, !0);
          return;
        case "null":
          v.elseIf((0, n._)`${x} === "" || ${x} === 0 || ${x} === false`), v.assign(T, null);
          return;
        case "array":
          v.elseIf((0, n._)`${_} === "string" || ${_} === "number"
              || ${_} === "boolean" || ${x} === null`).assign(T, (0, n._)`[${x}]`);
      }
    }
  }
  function f({ gen: h, parentData: y, parentDataProperty: k }, v) {
    h.if((0, n._)`${y} !== undefined`, () => h.assign((0, n._)`${y}[${k}]`, v));
  }
  function p(h, y, k, v = i.Correct) {
    const x = v === i.Correct ? n.operators.EQ : n.operators.NEQ;
    let S;
    switch (h) {
      case "null":
        return (0, n._)`${y} ${x} null`;
      case "array":
        S = (0, n._)`Array.isArray(${y})`;
        break;
      case "object":
        S = (0, n._)`${y} && typeof ${y} == "object" && !Array.isArray(${y})`;
        break;
      case "integer":
        S = _((0, n._)`!(${y} % 1) && !isNaN(${y})`);
        break;
      case "number":
        S = _();
        break;
      default:
        return (0, n._)`typeof ${y} ${x} ${h}`;
    }
    return v === i.Correct ? S : (0, n.not)(S);
    function _(T = n.nil) {
      return (0, n.and)((0, n._)`typeof ${y} == "number"`, T, k ? (0, n._)`isFinite(${y})` : n.nil);
    }
  }
  Je.checkDataType = p;
  function b(h, y, k, v) {
    if (h.length === 1)
      return p(h[0], y, k, v);
    let x;
    const S = (0, s.toHash)(h);
    if (S.array && S.object) {
      const _ = (0, n._)`typeof ${y} != "object"`;
      x = S.null ? _ : (0, n._)`!${y} || ${_}`, delete S.null, delete S.array, delete S.object;
    } else
      x = n.nil;
    S.number && delete S.integer;
    for (const _ in S)
      x = (0, n.and)(x, p(_, y, k, v));
    return x;
  }
  Je.checkDataTypes = b;
  const g = {
    message: ({ schema: h }) => `must be ${h}`,
    params: ({ schema: h, schemaValue: y }) => typeof h == "string" ? (0, n._)`{type: ${h}}` : (0, n._)`{type: ${y}}`
  };
  function m(h) {
    const y = w(h);
    (0, r.reportError)(y, g);
  }
  Je.reportTypeError = m;
  function w(h) {
    const { gen: y, data: k, schema: v } = h, x = (0, s.schemaRefOrVal)(h, v, "type");
    return {
      gen: y,
      keyword: "type",
      data: k,
      schema: v.type,
      schemaCode: x,
      schemaValue: x,
      parentSchema: v,
      params: {},
      it: h
    };
  }
  return Je;
}
var kn = {}, qc;
function A0() {
  if (qc) return kn;
  qc = 1, Object.defineProperty(kn, "__esModule", { value: !0 }), kn.assignDefaults = void 0;
  const t = fe(), e = ge();
  function r(s, i) {
    const { properties: o, items: a } = s.schema;
    if (i === "object" && o)
      for (const l in o)
        n(s, l, o[l].default);
    else i === "array" && Array.isArray(a) && a.forEach((l, c) => n(s, c, l.default));
  }
  kn.assignDefaults = r;
  function n(s, i, o) {
    const { gen: a, compositeRule: l, data: c, opts: d } = s;
    if (o === void 0)
      return;
    const u = (0, t._)`${c}${(0, t.getProperty)(i)}`;
    if (l) {
      (0, e.checkStrictMode)(s, `default is ignored for: ${u}`);
      return;
    }
    let f = (0, t._)`${u} === undefined`;
    d.useDefaults === "empty" && (f = (0, t._)`${f} || ${u} === null || ${u} === ""`), a.if(f, (0, t._)`${u} = ${(0, t.stringify)(o)}`);
  }
  return kn;
}
var _t = {}, ke = {}, Fc;
function It() {
  if (Fc) return ke;
  Fc = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.validateUnion = ke.validateArray = ke.usePattern = ke.callValidateCode = ke.schemaProperties = ke.allSchemaProperties = ke.noPropertyInData = ke.propertyInData = ke.isOwnProperty = ke.hasPropFunc = ke.reportMissingProp = ke.checkMissingProp = ke.checkReportMissingProp = void 0;
  const t = fe(), e = ge(), r = ar(), n = ge();
  function s(h, y) {
    const { gen: k, data: v, it: x } = h;
    k.if(d(k, v, y, x.opts.ownProperties), () => {
      h.setParams({ missingProperty: (0, t._)`${y}` }, !0), h.error();
    });
  }
  ke.checkReportMissingProp = s;
  function i({ gen: h, data: y, it: { opts: k } }, v, x) {
    return (0, t.or)(...v.map((S) => (0, t.and)(d(h, y, S, k.ownProperties), (0, t._)`${x} = ${S}`)));
  }
  ke.checkMissingProp = i;
  function o(h, y) {
    h.setParams({ missingProperty: y }, !0), h.error();
  }
  ke.reportMissingProp = o;
  function a(h) {
    return h.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, t._)`Object.prototype.hasOwnProperty`
    });
  }
  ke.hasPropFunc = a;
  function l(h, y, k) {
    return (0, t._)`${a(h)}.call(${y}, ${k})`;
  }
  ke.isOwnProperty = l;
  function c(h, y, k, v) {
    const x = (0, t._)`${y}${(0, t.getProperty)(k)} !== undefined`;
    return v ? (0, t._)`${x} && ${l(h, y, k)}` : x;
  }
  ke.propertyInData = c;
  function d(h, y, k, v) {
    const x = (0, t._)`${y}${(0, t.getProperty)(k)} === undefined`;
    return v ? (0, t.or)(x, (0, t.not)(l(h, y, k))) : x;
  }
  ke.noPropertyInData = d;
  function u(h) {
    return h ? Object.keys(h).filter((y) => y !== "__proto__") : [];
  }
  ke.allSchemaProperties = u;
  function f(h, y) {
    return u(y).filter((k) => !(0, e.alwaysValidSchema)(h, y[k]));
  }
  ke.schemaProperties = f;
  function p({ schemaCode: h, data: y, it: { gen: k, topSchemaRef: v, schemaPath: x, errorPath: S }, it: _ }, T, P, R) {
    const D = R ? (0, t._)`${h}, ${y}, ${v}${x}` : y, U = [
      [r.default.instancePath, (0, t.strConcat)(r.default.instancePath, S)],
      [r.default.parentData, _.parentData],
      [r.default.parentDataProperty, _.parentDataProperty],
      [r.default.rootData, r.default.rootData]
    ];
    _.opts.dynamicRef && U.push([r.default.dynamicAnchors, r.default.dynamicAnchors]);
    const Y = (0, t._)`${D}, ${k.object(...U)}`;
    return P !== t.nil ? (0, t._)`${T}.call(${P}, ${Y})` : (0, t._)`${T}(${Y})`;
  }
  ke.callValidateCode = p;
  const b = (0, t._)`new RegExp`;
  function g({ gen: h, it: { opts: y } }, k) {
    const v = y.unicodeRegExp ? "u" : "", { regExp: x } = y.code, S = x(k, v);
    return h.scopeValue("pattern", {
      key: S.toString(),
      ref: S,
      code: (0, t._)`${x.code === "new RegExp" ? b : (0, n.useFunc)(h, x)}(${k}, ${v})`
    });
  }
  ke.usePattern = g;
  function m(h) {
    const { gen: y, data: k, keyword: v, it: x } = h, S = y.name("valid");
    if (x.allErrors) {
      const T = y.let("valid", !0);
      return _(() => y.assign(T, !1)), T;
    }
    return y.var(S, !0), _(() => y.break()), S;
    function _(T) {
      const P = y.const("len", (0, t._)`${k}.length`);
      y.forRange("i", 0, P, (R) => {
        h.subschema({
          keyword: v,
          dataProp: R,
          dataPropType: e.Type.Num
        }, S), y.if((0, t.not)(S), T);
      });
    }
  }
  ke.validateArray = m;
  function w(h) {
    const { gen: y, schema: k, keyword: v, it: x } = h;
    if (!Array.isArray(k))
      throw new Error("ajv implementation error");
    if (k.some((P) => (0, e.alwaysValidSchema)(x, P)) && !x.opts.unevaluated)
      return;
    const _ = y.let("valid", !1), T = y.name("_valid");
    y.block(() => k.forEach((P, R) => {
      const D = h.subschema({
        keyword: v,
        schemaProp: R,
        compositeRule: !0
      }, T);
      y.assign(_, (0, t._)`${_} || ${T}`), h.mergeValidEvaluated(D, T) || y.if((0, t.not)(_));
    })), h.result(_, () => h.reset(), () => h.error(!0));
  }
  return ke.validateUnion = w, ke;
}
var Uc;
function T0() {
  if (Uc) return _t;
  Uc = 1, Object.defineProperty(_t, "__esModule", { value: !0 }), _t.validateKeywordUsage = _t.validSchemaType = _t.funcKeywordCode = _t.macroKeywordCode = void 0;
  const t = fe(), e = ar(), r = It(), n = lo();
  function s(f, p) {
    const { gen: b, keyword: g, schema: m, parentSchema: w, it: h } = f, y = p.macro.call(h.self, m, w, h), k = c(b, g, y);
    h.opts.validateSchema !== !1 && h.self.validateSchema(y, !0);
    const v = b.name("valid");
    f.subschema({
      schema: y,
      schemaPath: t.nil,
      errSchemaPath: `${h.errSchemaPath}/${g}`,
      topSchemaRef: k,
      compositeRule: !0
    }, v), f.pass(v, () => f.error(!0));
  }
  _t.macroKeywordCode = s;
  function i(f, p) {
    var b;
    const { gen: g, keyword: m, schema: w, parentSchema: h, $data: y, it: k } = f;
    l(k, p);
    const v = !y && p.compile ? p.compile.call(k.self, w, h, k) : p.validate, x = c(g, m, v), S = g.let("valid");
    f.block$data(S, _), f.ok((b = p.valid) !== null && b !== void 0 ? b : S);
    function _() {
      if (p.errors === !1)
        R(), p.modifying && o(f), D(() => f.error());
      else {
        const U = p.async ? T() : P();
        p.modifying && o(f), D(() => a(f, U));
      }
    }
    function T() {
      const U = g.let("ruleErrs", null);
      return g.try(() => R((0, t._)`await `), (Y) => g.assign(S, !1).if((0, t._)`${Y} instanceof ${k.ValidationError}`, () => g.assign(U, (0, t._)`${Y}.errors`), () => g.throw(Y))), U;
    }
    function P() {
      const U = (0, t._)`${x}.errors`;
      return g.assign(U, null), R(t.nil), U;
    }
    function R(U = p.async ? (0, t._)`await ` : t.nil) {
      const Y = k.opts.passContext ? e.default.this : e.default.self, se = !("compile" in p && !y || p.schema === !1);
      g.assign(S, (0, t._)`${U}${(0, r.callValidateCode)(f, x, Y, se)}`, p.modifying);
    }
    function D(U) {
      var Y;
      g.if((0, t.not)((Y = p.valid) !== null && Y !== void 0 ? Y : S), U);
    }
  }
  _t.funcKeywordCode = i;
  function o(f) {
    const { gen: p, data: b, it: g } = f;
    p.if(g.parentData, () => p.assign(b, (0, t._)`${g.parentData}[${g.parentDataProperty}]`));
  }
  function a(f, p) {
    const { gen: b } = f;
    b.if((0, t._)`Array.isArray(${p})`, () => {
      b.assign(e.default.vErrors, (0, t._)`${e.default.vErrors} === null ? ${p} : ${e.default.vErrors}.concat(${p})`).assign(e.default.errors, (0, t._)`${e.default.vErrors}.length`), (0, n.extendErrors)(f);
    }, () => f.error());
  }
  function l({ schemaEnv: f }, p) {
    if (p.async && !f.$async)
      throw new Error("async keyword in sync schema");
  }
  function c(f, p, b) {
    if (b === void 0)
      throw new Error(`keyword "${p}" failed to compile`);
    return f.scopeValue("keyword", typeof b == "function" ? { ref: b } : { ref: b, code: (0, t.stringify)(b) });
  }
  function d(f, p, b = !1) {
    return !p.length || p.some((g) => g === "array" ? Array.isArray(f) : g === "object" ? f && typeof f == "object" && !Array.isArray(f) : typeof f == g || b && typeof f > "u");
  }
  _t.validSchemaType = d;
  function u({ schema: f, opts: p, self: b, errSchemaPath: g }, m, w) {
    if (Array.isArray(m.keyword) ? !m.keyword.includes(w) : m.keyword !== w)
      throw new Error("ajv implementation error");
    const h = m.dependencies;
    if (h?.some((y) => !Object.prototype.hasOwnProperty.call(f, y)))
      throw new Error(`parent schema must have dependencies of ${w}: ${h.join(",")}`);
    if (m.validateSchema && !m.validateSchema(f[w])) {
      const k = `keyword "${w}" value is invalid at path "${g}": ` + b.errorsText(m.validateSchema.errors);
      if (p.validateSchema === "log")
        b.logger.error(k);
      else
        throw new Error(k);
    }
  }
  return _t.validateKeywordUsage = u, _t;
}
var Jt = {}, Kc;
function O0() {
  if (Kc) return Jt;
  Kc = 1, Object.defineProperty(Jt, "__esModule", { value: !0 }), Jt.extendSubschemaMode = Jt.extendSubschemaData = Jt.getSubschema = void 0;
  const t = fe(), e = ge();
  function r(i, { keyword: o, schemaProp: a, schema: l, schemaPath: c, errSchemaPath: d, topSchemaRef: u }) {
    if (o !== void 0 && l !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (o !== void 0) {
      const f = i.schema[o];
      return a === void 0 ? {
        schema: f,
        schemaPath: (0, t._)`${i.schemaPath}${(0, t.getProperty)(o)}`,
        errSchemaPath: `${i.errSchemaPath}/${o}`
      } : {
        schema: f[a],
        schemaPath: (0, t._)`${i.schemaPath}${(0, t.getProperty)(o)}${(0, t.getProperty)(a)}`,
        errSchemaPath: `${i.errSchemaPath}/${o}/${(0, e.escapeFragment)(a)}`
      };
    }
    if (l !== void 0) {
      if (c === void 0 || d === void 0 || u === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: l,
        schemaPath: c,
        topSchemaRef: u,
        errSchemaPath: d
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Jt.getSubschema = r;
  function n(i, o, { dataProp: a, dataPropType: l, data: c, dataTypes: d, propertyName: u }) {
    if (c !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: f } = o;
    if (a !== void 0) {
      const { errorPath: b, dataPathArr: g, opts: m } = o, w = f.let("data", (0, t._)`${o.data}${(0, t.getProperty)(a)}`, !0);
      p(w), i.errorPath = (0, t.str)`${b}${(0, e.getErrorPath)(a, l, m.jsPropertySyntax)}`, i.parentDataProperty = (0, t._)`${a}`, i.dataPathArr = [...g, i.parentDataProperty];
    }
    if (c !== void 0) {
      const b = c instanceof t.Name ? c : f.let("data", c, !0);
      p(b), u !== void 0 && (i.propertyName = u);
    }
    d && (i.dataTypes = d);
    function p(b) {
      i.data = b, i.dataLevel = o.dataLevel + 1, i.dataTypes = [], o.definedProperties = /* @__PURE__ */ new Set(), i.parentData = o.data, i.dataNames = [...o.dataNames, b];
    }
  }
  Jt.extendSubschemaData = n;
  function s(i, { jtdDiscriminator: o, jtdMetadata: a, compositeRule: l, createErrors: c, allErrors: d }) {
    l !== void 0 && (i.compositeRule = l), c !== void 0 && (i.createErrors = c), d !== void 0 && (i.allErrors = d), i.jtdDiscriminator = o, i.jtdMetadata = a;
  }
  return Jt.extendSubschemaMode = s, Jt;
}
var Ye = {}, Jo, zc;
function Xf() {
  return zc || (zc = 1, Jo = function t(e, r) {
    if (e === r) return !0;
    if (e && r && typeof e == "object" && typeof r == "object") {
      if (e.constructor !== r.constructor) return !1;
      var n, s, i;
      if (Array.isArray(e)) {
        if (n = e.length, n != r.length) return !1;
        for (s = n; s-- !== 0; )
          if (!t(e[s], r[s])) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === r.source && e.flags === r.flags;
      if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === r.valueOf();
      if (e.toString !== Object.prototype.toString) return e.toString() === r.toString();
      if (i = Object.keys(e), n = i.length, n !== Object.keys(r).length) return !1;
      for (s = n; s-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(r, i[s])) return !1;
      for (s = n; s-- !== 0; ) {
        var o = i[s];
        if (!t(e[o], r[o])) return !1;
      }
      return !0;
    }
    return e !== e && r !== r;
  }), Jo;
}
var Wo = { exports: {} }, Vc;
function C0() {
  if (Vc) return Wo.exports;
  Vc = 1;
  var t = Wo.exports = function(n, s, i) {
    typeof s == "function" && (i = s, s = {}), i = s.cb || i;
    var o = typeof i == "function" ? i : i.pre || function() {
    }, a = i.post || function() {
    };
    e(s, o, a, n, "", n);
  };
  t.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, t.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, t.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, t.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function e(n, s, i, o, a, l, c, d, u, f) {
    if (o && typeof o == "object" && !Array.isArray(o)) {
      s(o, a, l, c, d, u, f);
      for (var p in o) {
        var b = o[p];
        if (Array.isArray(b)) {
          if (p in t.arrayKeywords)
            for (var g = 0; g < b.length; g++)
              e(n, s, i, b[g], a + "/" + p + "/" + g, l, a, p, o, g);
        } else if (p in t.propsKeywords) {
          if (b && typeof b == "object")
            for (var m in b)
              e(n, s, i, b[m], a + "/" + p + "/" + r(m), l, a, p, o, m);
        } else (p in t.keywords || n.allKeys && !(p in t.skipKeywords)) && e(n, s, i, b, a + "/" + p, l, a, p, o);
      }
      i(o, a, l, c, d, u, f);
    }
  }
  function r(n) {
    return n.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Wo.exports;
}
var Hc;
function co() {
  if (Hc) return Ye;
  Hc = 1, Object.defineProperty(Ye, "__esModule", { value: !0 }), Ye.getSchemaRefs = Ye.resolveUrl = Ye.normalizeId = Ye._getFullPath = Ye.getFullPath = Ye.inlineRef = void 0;
  const t = ge(), e = Xf(), r = C0(), n = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function s(g, m = !0) {
    return typeof g == "boolean" ? !0 : m === !0 ? !o(g) : m ? a(g) <= m : !1;
  }
  Ye.inlineRef = s;
  const i = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function o(g) {
    for (const m in g) {
      if (i.has(m))
        return !0;
      const w = g[m];
      if (Array.isArray(w) && w.some(o) || typeof w == "object" && o(w))
        return !0;
    }
    return !1;
  }
  function a(g) {
    let m = 0;
    for (const w in g) {
      if (w === "$ref")
        return 1 / 0;
      if (m++, !n.has(w) && (typeof g[w] == "object" && (0, t.eachItem)(g[w], (h) => m += a(h)), m === 1 / 0))
        return 1 / 0;
    }
    return m;
  }
  function l(g, m = "", w) {
    w !== !1 && (m = u(m));
    const h = g.parse(m);
    return c(g, h);
  }
  Ye.getFullPath = l;
  function c(g, m) {
    return g.serialize(m).split("#")[0] + "#";
  }
  Ye._getFullPath = c;
  const d = /#\/?$/;
  function u(g) {
    return g ? g.replace(d, "") : "";
  }
  Ye.normalizeId = u;
  function f(g, m, w) {
    return w = u(w), g.resolve(m, w);
  }
  Ye.resolveUrl = f;
  const p = /^[a-z_][-a-z0-9._]*$/i;
  function b(g, m) {
    if (typeof g == "boolean")
      return {};
    const { schemaId: w, uriResolver: h } = this.opts, y = u(g[w] || m), k = { "": y }, v = l(h, y, !1), x = {}, S = /* @__PURE__ */ new Set();
    return r(g, { allKeys: !0 }, (P, R, D, U) => {
      if (U === void 0)
        return;
      const Y = v + R;
      let se = k[U];
      typeof P[w] == "string" && (se = be.call(this, P[w])), xe.call(this, P.$anchor), xe.call(this, P.$dynamicAnchor), k[R] = se;
      function be(W) {
        const ce = this.opts.uriResolver.resolve;
        if (W = u(se ? ce(se, W) : W), S.has(W))
          throw T(W);
        S.add(W);
        let K = this.refs[W];
        return typeof K == "string" && (K = this.refs[K]), typeof K == "object" ? _(P, K.schema, W) : W !== u(Y) && (W[0] === "#" ? (_(P, x[W], W), x[W] = P) : this.refs[W] = Y), W;
      }
      function xe(W) {
        if (typeof W == "string") {
          if (!p.test(W))
            throw new Error(`invalid anchor "${W}"`);
          be.call(this, `#${W}`);
        }
      }
    }), x;
    function _(P, R, D) {
      if (R !== void 0 && !e(P, R))
        throw T(D);
    }
    function T(P) {
      return new Error(`reference "${P}" resolves to more than one schema`);
    }
  }
  return Ye.getSchemaRefs = b, Ye;
}
var Jc;
function uo() {
  if (Jc) return Vt;
  Jc = 1, Object.defineProperty(Vt, "__esModule", { value: !0 }), Vt.getData = Vt.KeywordCxt = Vt.validateFunctionCode = void 0;
  const t = $0(), e = Mi(), r = Qf(), n = Mi(), s = A0(), i = T0(), o = O0(), a = fe(), l = ar(), c = co(), d = ge(), u = lo();
  function f(N) {
    if (v(N) && (S(N), k(N))) {
      m(N);
      return;
    }
    p(N, () => (0, t.topBoolOrEmptySchema)(N));
  }
  Vt.validateFunctionCode = f;
  function p({ gen: N, validateName: j, schema: q, schemaEnv: H, opts: Z }, le) {
    Z.code.es5 ? N.func(j, (0, a._)`${l.default.data}, ${l.default.valCxt}`, H.$async, () => {
      N.code((0, a._)`"use strict"; ${h(q, Z)}`), g(N, Z), N.code(le);
    }) : N.func(j, (0, a._)`${l.default.data}, ${b(Z)}`, H.$async, () => N.code(h(q, Z)).code(le));
  }
  function b(N) {
    return (0, a._)`{${l.default.instancePath}="", ${l.default.parentData}, ${l.default.parentDataProperty}, ${l.default.rootData}=${l.default.data}${N.dynamicRef ? (0, a._)`, ${l.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function g(N, j) {
    N.if(l.default.valCxt, () => {
      N.var(l.default.instancePath, (0, a._)`${l.default.valCxt}.${l.default.instancePath}`), N.var(l.default.parentData, (0, a._)`${l.default.valCxt}.${l.default.parentData}`), N.var(l.default.parentDataProperty, (0, a._)`${l.default.valCxt}.${l.default.parentDataProperty}`), N.var(l.default.rootData, (0, a._)`${l.default.valCxt}.${l.default.rootData}`), j.dynamicRef && N.var(l.default.dynamicAnchors, (0, a._)`${l.default.valCxt}.${l.default.dynamicAnchors}`);
    }, () => {
      N.var(l.default.instancePath, (0, a._)`""`), N.var(l.default.parentData, (0, a._)`undefined`), N.var(l.default.parentDataProperty, (0, a._)`undefined`), N.var(l.default.rootData, l.default.data), j.dynamicRef && N.var(l.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function m(N) {
    const { schema: j, opts: q, gen: H } = N;
    p(N, () => {
      q.$comment && j.$comment && U(N), P(N), H.let(l.default.vErrors, null), H.let(l.default.errors, 0), q.unevaluated && w(N), _(N), Y(N);
    });
  }
  function w(N) {
    const { gen: j, validateName: q } = N;
    N.evaluated = j.const("evaluated", (0, a._)`${q}.evaluated`), j.if((0, a._)`${N.evaluated}.dynamicProps`, () => j.assign((0, a._)`${N.evaluated}.props`, (0, a._)`undefined`)), j.if((0, a._)`${N.evaluated}.dynamicItems`, () => j.assign((0, a._)`${N.evaluated}.items`, (0, a._)`undefined`));
  }
  function h(N, j) {
    const q = typeof N == "object" && N[j.schemaId];
    return q && (j.code.source || j.code.process) ? (0, a._)`/*# sourceURL=${q} */` : a.nil;
  }
  function y(N, j) {
    if (v(N) && (S(N), k(N))) {
      x(N, j);
      return;
    }
    (0, t.boolOrEmptySchema)(N, j);
  }
  function k({ schema: N, self: j }) {
    if (typeof N == "boolean")
      return !N;
    for (const q in N)
      if (j.RULES.all[q])
        return !0;
    return !1;
  }
  function v(N) {
    return typeof N.schema != "boolean";
  }
  function x(N, j) {
    const { schema: q, gen: H, opts: Z } = N;
    Z.$comment && q.$comment && U(N), R(N), D(N);
    const le = H.const("_errs", l.default.errors);
    _(N, le), H.var(j, (0, a._)`${le} === ${l.default.errors}`);
  }
  function S(N) {
    (0, d.checkUnknownRules)(N), T(N);
  }
  function _(N, j) {
    if (N.opts.jtd)
      return be(N, [], !1, j);
    const q = (0, e.getSchemaTypes)(N.schema), H = (0, e.coerceAndCheckDataType)(N, q);
    be(N, q, !H, j);
  }
  function T(N) {
    const { schema: j, errSchemaPath: q, opts: H, self: Z } = N;
    j.$ref && H.ignoreKeywordsWithRef && (0, d.schemaHasRulesButRef)(j, Z.RULES) && Z.logger.warn(`$ref: keywords ignored in schema at path "${q}"`);
  }
  function P(N) {
    const { schema: j, opts: q } = N;
    j.default !== void 0 && q.useDefaults && q.strictSchema && (0, d.checkStrictMode)(N, "default is ignored in the schema root");
  }
  function R(N) {
    const j = N.schema[N.opts.schemaId];
    j && (N.baseId = (0, c.resolveUrl)(N.opts.uriResolver, N.baseId, j));
  }
  function D(N) {
    if (N.schema.$async && !N.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function U({ gen: N, schemaEnv: j, schema: q, errSchemaPath: H, opts: Z }) {
    const le = q.$comment;
    if (Z.$comment === !0)
      N.code((0, a._)`${l.default.self}.logger.log(${le})`);
    else if (typeof Z.$comment == "function") {
      const Ne = (0, a.str)`${H}/$comment`, Ue = N.scopeValue("root", { ref: j.root });
      N.code((0, a._)`${l.default.self}.opts.$comment(${le}, ${Ne}, ${Ue}.schema)`);
    }
  }
  function Y(N) {
    const { gen: j, schemaEnv: q, validateName: H, ValidationError: Z, opts: le } = N;
    q.$async ? j.if((0, a._)`${l.default.errors} === 0`, () => j.return(l.default.data), () => j.throw((0, a._)`new ${Z}(${l.default.vErrors})`)) : (j.assign((0, a._)`${H}.errors`, l.default.vErrors), le.unevaluated && se(N), j.return((0, a._)`${l.default.errors} === 0`));
  }
  function se({ gen: N, evaluated: j, props: q, items: H }) {
    q instanceof a.Name && N.assign((0, a._)`${j}.props`, q), H instanceof a.Name && N.assign((0, a._)`${j}.items`, H);
  }
  function be(N, j, q, H) {
    const { gen: Z, schema: le, data: Ne, allErrors: Ue, opts: Be, self: qe } = N, { RULES: De } = qe;
    if (le.$ref && (Be.ignoreKeywordsWithRef || !(0, d.schemaHasRulesButRef)(le, De))) {
      Z.block(() => V(N, "$ref", De.all.$ref.definition));
      return;
    }
    Be.jtd || W(N, j), Z.block(() => {
      for (const at of De.rules)
        qt(at);
      qt(De.post);
    });
    function qt(at) {
      (0, r.shouldUseGroup)(le, at) && (at.type ? (Z.if((0, n.checkDataType)(at.type, Ne, Be.strictNumbers)), xe(N, at), j.length === 1 && j[0] === at.type && q && (Z.else(), (0, n.reportTypeError)(N)), Z.endIf()) : xe(N, at), Ue || Z.if((0, a._)`${l.default.errors} === ${H || 0}`));
    }
  }
  function xe(N, j) {
    const { gen: q, schema: H, opts: { useDefaults: Z } } = N;
    Z && (0, s.assignDefaults)(N, j.type), q.block(() => {
      for (const le of j.rules)
        (0, r.shouldUseRule)(H, le) && V(N, le.keyword, le.definition, j.type);
    });
  }
  function W(N, j) {
    N.schemaEnv.meta || !N.opts.strictTypes || (ce(N, j), N.opts.allowUnionTypes || K(N, j), I(N, N.dataTypes));
  }
  function ce(N, j) {
    if (j.length) {
      if (!N.dataTypes.length) {
        N.dataTypes = j;
        return;
      }
      j.forEach((q) => {
        L(N.dataTypes, q) || O(N, `type "${q}" not allowed by context "${N.dataTypes.join(",")}"`);
      }), E(N, j);
    }
  }
  function K(N, j) {
    j.length > 1 && !(j.length === 2 && j.includes("null")) && O(N, "use allowUnionTypes to allow union type keyword");
  }
  function I(N, j) {
    const q = N.self.RULES.all;
    for (const H in q) {
      const Z = q[H];
      if (typeof Z == "object" && (0, r.shouldUseRule)(N.schema, Z)) {
        const { type: le } = Z.definition;
        le.length && !le.some((Ne) => F(j, Ne)) && O(N, `missing type "${le.join(",")}" for keyword "${H}"`);
      }
    }
  }
  function F(N, j) {
    return N.includes(j) || j === "number" && N.includes("integer");
  }
  function L(N, j) {
    return N.includes(j) || j === "integer" && N.includes("number");
  }
  function E(N, j) {
    const q = [];
    for (const H of N.dataTypes)
      L(j, H) ? q.push(H) : j.includes("integer") && H === "number" && q.push("integer");
    N.dataTypes = q;
  }
  function O(N, j) {
    const q = N.schemaEnv.baseId + N.errSchemaPath;
    j += ` at "${q}" (strictTypes)`, (0, d.checkStrictMode)(N, j, N.opts.strictTypes);
  }
  class B {
    constructor(j, q, H) {
      if ((0, i.validateKeywordUsage)(j, q, H), this.gen = j.gen, this.allErrors = j.allErrors, this.keyword = H, this.data = j.data, this.schema = j.schema[H], this.$data = q.$data && j.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, d.schemaRefOrVal)(j, this.schema, H, this.$data), this.schemaType = q.schemaType, this.parentSchema = j.schema, this.params = {}, this.it = j, this.def = q, this.$data)
        this.schemaCode = j.gen.const("vSchema", ne(this.$data, j));
      else if (this.schemaCode = this.schemaValue, !(0, i.validSchemaType)(this.schema, q.schemaType, q.allowUndefined))
        throw new Error(`${H} value must be ${JSON.stringify(q.schemaType)}`);
      ("code" in q ? q.trackErrors : q.errors !== !1) && (this.errsCount = j.gen.const("_errs", l.default.errors));
    }
    result(j, q, H) {
      this.failResult((0, a.not)(j), q, H);
    }
    failResult(j, q, H) {
      this.gen.if(j), H ? H() : this.error(), q ? (this.gen.else(), q(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(j, q) {
      this.failResult((0, a.not)(j), void 0, q);
    }
    fail(j) {
      if (j === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(j), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(j) {
      if (!this.$data)
        return this.fail(j);
      const { schemaCode: q } = this;
      this.fail((0, a._)`${q} !== undefined && (${(0, a.or)(this.invalid$data(), j)})`);
    }
    error(j, q, H) {
      if (q) {
        this.setParams(q), this._error(j, H), this.setParams({});
        return;
      }
      this._error(j, H);
    }
    _error(j, q) {
      (j ? u.reportExtraError : u.reportError)(this, this.def.error, q);
    }
    $dataError() {
      (0, u.reportError)(this, this.def.$dataError || u.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, u.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(j) {
      this.allErrors || this.gen.if(j);
    }
    setParams(j, q) {
      q ? Object.assign(this.params, j) : this.params = j;
    }
    block$data(j, q, H = a.nil) {
      this.gen.block(() => {
        this.check$data(j, H), q();
      });
    }
    check$data(j = a.nil, q = a.nil) {
      if (!this.$data)
        return;
      const { gen: H, schemaCode: Z, schemaType: le, def: Ne } = this;
      H.if((0, a.or)((0, a._)`${Z} === undefined`, q)), j !== a.nil && H.assign(j, !0), (le.length || Ne.validateSchema) && (H.elseIf(this.invalid$data()), this.$dataError(), j !== a.nil && H.assign(j, !1)), H.else();
    }
    invalid$data() {
      const { gen: j, schemaCode: q, schemaType: H, def: Z, it: le } = this;
      return (0, a.or)(Ne(), Ue());
      function Ne() {
        if (H.length) {
          if (!(q instanceof a.Name))
            throw new Error("ajv implementation error");
          const Be = Array.isArray(H) ? H : [H];
          return (0, a._)`${(0, n.checkDataTypes)(Be, q, le.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function Ue() {
        if (Z.validateSchema) {
          const Be = j.scopeValue("validate$data", { ref: Z.validateSchema });
          return (0, a._)`!${Be}(${q})`;
        }
        return a.nil;
      }
    }
    subschema(j, q) {
      const H = (0, o.getSubschema)(this.it, j);
      (0, o.extendSubschemaData)(H, this.it, j), (0, o.extendSubschemaMode)(H, j);
      const Z = { ...this.it, ...H, items: void 0, props: void 0 };
      return y(Z, q), Z;
    }
    mergeEvaluated(j, q) {
      const { it: H, gen: Z } = this;
      H.opts.unevaluated && (H.props !== !0 && j.props !== void 0 && (H.props = d.mergeEvaluated.props(Z, j.props, H.props, q)), H.items !== !0 && j.items !== void 0 && (H.items = d.mergeEvaluated.items(Z, j.items, H.items, q)));
    }
    mergeValidEvaluated(j, q) {
      const { it: H, gen: Z } = this;
      if (H.opts.unevaluated && (H.props !== !0 || H.items !== !0))
        return Z.if(q, () => this.mergeEvaluated(j, a.Name)), !0;
    }
  }
  Vt.KeywordCxt = B;
  function V(N, j, q, H) {
    const Z = new B(N, q, j);
    "code" in q ? q.code(Z, H) : Z.$data && q.validate ? (0, i.funcKeywordCode)(Z, q) : "macro" in q ? (0, i.macroKeywordCode)(Z, q) : (q.compile || q.validate) && (0, i.funcKeywordCode)(Z, q);
  }
  const J = /^\/(?:[^~]|~0|~1)*$/, ie = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function ne(N, { dataLevel: j, dataNames: q, dataPathArr: H }) {
    let Z, le;
    if (N === "")
      return l.default.rootData;
    if (N[0] === "/") {
      if (!J.test(N))
        throw new Error(`Invalid JSON-pointer: ${N}`);
      Z = N, le = l.default.rootData;
    } else {
      const qe = ie.exec(N);
      if (!qe)
        throw new Error(`Invalid JSON-pointer: ${N}`);
      const De = +qe[1];
      if (Z = qe[2], Z === "#") {
        if (De >= j)
          throw new Error(Be("property/index", De));
        return H[j - De];
      }
      if (De > j)
        throw new Error(Be("data", De));
      if (le = q[j - De], !Z)
        return le;
    }
    let Ne = le;
    const Ue = Z.split("/");
    for (const qe of Ue)
      qe && (le = (0, a._)`${le}${(0, a.getProperty)((0, d.unescapeJsonPointer)(qe))}`, Ne = (0, a._)`${Ne} && ${le}`);
    return Ne;
    function Be(qe, De) {
      return `Cannot access ${qe} ${De} levels up, current level is ${j}`;
    }
  }
  return Vt.getData = ne, Vt;
}
var As = {}, Wc;
function yl() {
  if (Wc) return As;
  Wc = 1, Object.defineProperty(As, "__esModule", { value: !0 });
  class t extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return As.default = t, As;
}
var Ts = {}, Gc;
function fo() {
  if (Gc) return Ts;
  Gc = 1, Object.defineProperty(Ts, "__esModule", { value: !0 });
  const t = co();
  class e extends Error {
    constructor(n, s, i, o) {
      super(o || `can't resolve reference ${i} from id ${s}`), this.missingRef = (0, t.resolveUrl)(n, s, i), this.missingSchema = (0, t.normalizeId)((0, t.getFullPath)(n, this.missingRef));
    }
  }
  return Ts.default = e, Ts;
}
var ct = {}, Yc;
function bl() {
  if (Yc) return ct;
  Yc = 1, Object.defineProperty(ct, "__esModule", { value: !0 }), ct.resolveSchema = ct.getCompilingSchema = ct.resolveRef = ct.compileSchema = ct.SchemaEnv = void 0;
  const t = fe(), e = yl(), r = ar(), n = co(), s = ge(), i = uo();
  class o {
    constructor(w) {
      var h;
      this.refs = {}, this.dynamicAnchors = {};
      let y;
      typeof w.schema == "object" && (y = w.schema), this.schema = w.schema, this.schemaId = w.schemaId, this.root = w.root || this, this.baseId = (h = w.baseId) !== null && h !== void 0 ? h : (0, n.normalizeId)(y?.[w.schemaId || "$id"]), this.schemaPath = w.schemaPath, this.localRefs = w.localRefs, this.meta = w.meta, this.$async = y?.$async, this.refs = {};
    }
  }
  ct.SchemaEnv = o;
  function a(m) {
    const w = d.call(this, m);
    if (w)
      return w;
    const h = (0, n.getFullPath)(this.opts.uriResolver, m.root.baseId), { es5: y, lines: k } = this.opts.code, { ownProperties: v } = this.opts, x = new t.CodeGen(this.scope, { es5: y, lines: k, ownProperties: v });
    let S;
    m.$async && (S = x.scopeValue("Error", {
      ref: e.default,
      code: (0, t._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const _ = x.scopeName("validate");
    m.validateName = _;
    const T = {
      gen: x,
      allErrors: this.opts.allErrors,
      data: r.default.data,
      parentData: r.default.parentData,
      parentDataProperty: r.default.parentDataProperty,
      dataNames: [r.default.data],
      dataPathArr: [t.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: x.scopeValue("schema", this.opts.code.source === !0 ? { ref: m.schema, code: (0, t.stringify)(m.schema) } : { ref: m.schema }),
      validateName: _,
      ValidationError: S,
      schema: m.schema,
      schemaEnv: m,
      rootId: h,
      baseId: m.baseId || h,
      schemaPath: t.nil,
      errSchemaPath: m.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, t._)`""`,
      opts: this.opts,
      self: this
    };
    let P;
    try {
      this._compilations.add(m), (0, i.validateFunctionCode)(T), x.optimize(this.opts.code.optimize);
      const R = x.toString();
      P = `${x.scopeRefs(r.default.scope)}return ${R}`, this.opts.code.process && (P = this.opts.code.process(P, m));
      const U = new Function(`${r.default.self}`, `${r.default.scope}`, P)(this, this.scope.get());
      if (this.scope.value(_, { ref: U }), U.errors = null, U.schema = m.schema, U.schemaEnv = m, m.$async && (U.$async = !0), this.opts.code.source === !0 && (U.source = { validateName: _, validateCode: R, scopeValues: x._values }), this.opts.unevaluated) {
        const { props: Y, items: se } = T;
        U.evaluated = {
          props: Y instanceof t.Name ? void 0 : Y,
          items: se instanceof t.Name ? void 0 : se,
          dynamicProps: Y instanceof t.Name,
          dynamicItems: se instanceof t.Name
        }, U.source && (U.source.evaluated = (0, t.stringify)(U.evaluated));
      }
      return m.validate = U, m;
    } catch (R) {
      throw delete m.validate, delete m.validateName, P && this.logger.error("Error compiling schema, function code:", P), R;
    } finally {
      this._compilations.delete(m);
    }
  }
  ct.compileSchema = a;
  function l(m, w, h) {
    var y;
    h = (0, n.resolveUrl)(this.opts.uriResolver, w, h);
    const k = m.refs[h];
    if (k)
      return k;
    let v = f.call(this, m, h);
    if (v === void 0) {
      const x = (y = m.localRefs) === null || y === void 0 ? void 0 : y[h], { schemaId: S } = this.opts;
      x && (v = new o({ schema: x, schemaId: S, root: m, baseId: w }));
    }
    if (v !== void 0)
      return m.refs[h] = c.call(this, v);
  }
  ct.resolveRef = l;
  function c(m) {
    return (0, n.inlineRef)(m.schema, this.opts.inlineRefs) ? m.schema : m.validate ? m : a.call(this, m);
  }
  function d(m) {
    for (const w of this._compilations)
      if (u(w, m))
        return w;
  }
  ct.getCompilingSchema = d;
  function u(m, w) {
    return m.schema === w.schema && m.root === w.root && m.baseId === w.baseId;
  }
  function f(m, w) {
    let h;
    for (; typeof (h = this.refs[w]) == "string"; )
      w = h;
    return h || this.schemas[w] || p.call(this, m, w);
  }
  function p(m, w) {
    const h = this.opts.uriResolver.parse(w), y = (0, n._getFullPath)(this.opts.uriResolver, h);
    let k = (0, n.getFullPath)(this.opts.uriResolver, m.baseId, void 0);
    if (Object.keys(m.schema).length > 0 && y === k)
      return g.call(this, h, m);
    const v = (0, n.normalizeId)(y), x = this.refs[v] || this.schemas[v];
    if (typeof x == "string") {
      const S = p.call(this, m, x);
      return typeof S?.schema != "object" ? void 0 : g.call(this, h, S);
    }
    if (typeof x?.schema == "object") {
      if (x.validate || a.call(this, x), v === (0, n.normalizeId)(w)) {
        const { schema: S } = x, { schemaId: _ } = this.opts, T = S[_];
        return T && (k = (0, n.resolveUrl)(this.opts.uriResolver, k, T)), new o({ schema: S, schemaId: _, root: m, baseId: k });
      }
      return g.call(this, h, x);
    }
  }
  ct.resolveSchema = p;
  const b = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function g(m, { baseId: w, schema: h, root: y }) {
    var k;
    if (((k = m.fragment) === null || k === void 0 ? void 0 : k[0]) !== "/")
      return;
    for (const S of m.fragment.slice(1).split("/")) {
      if (typeof h == "boolean")
        return;
      const _ = h[(0, s.unescapeFragment)(S)];
      if (_ === void 0)
        return;
      h = _;
      const T = typeof h == "object" && h[this.opts.schemaId];
      !b.has(S) && T && (w = (0, n.resolveUrl)(this.opts.uriResolver, w, T));
    }
    let v;
    if (typeof h != "boolean" && h.$ref && !(0, s.schemaHasRulesButRef)(h, this.RULES)) {
      const S = (0, n.resolveUrl)(this.opts.uriResolver, w, h.$ref);
      v = p.call(this, y, S);
    }
    const { schemaId: x } = this.opts;
    if (v = v || new o({ schema: h, schemaId: x, root: y, baseId: w }), v.schema !== v.root.schema)
      return v;
  }
  return ct;
}
const N0 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", I0 = "Meta-schema for $data reference (JSON AnySchema extension proposal)", P0 = "object", L0 = ["$data"], R0 = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, j0 = !1, M0 = {
  $id: N0,
  description: I0,
  type: P0,
  required: L0,
  properties: R0,
  additionalProperties: j0
};
var Os = {}, xn = { exports: {} }, Go, Qc;
function Zf() {
  if (Qc) return Go;
  Qc = 1;
  const t = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), e = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
  function r(f) {
    let p = "", b = 0, g = 0;
    for (g = 0; g < f.length; g++)
      if (b = f[g].charCodeAt(0), b !== 48) {
        if (!(b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102))
          return "";
        p += f[g];
        break;
      }
    for (g += 1; g < f.length; g++) {
      if (b = f[g].charCodeAt(0), !(b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102))
        return "";
      p += f[g];
    }
    return p;
  }
  const n = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function s(f) {
    return f.length = 0, !0;
  }
  function i(f, p, b) {
    if (f.length) {
      const g = r(f);
      if (g !== "")
        p.push(g);
      else
        return b.error = !0, !1;
      f.length = 0;
    }
    return !0;
  }
  function o(f) {
    let p = 0;
    const b = { error: !1, address: "", zone: "" }, g = [], m = [];
    let w = !1, h = !1, y = i;
    for (let k = 0; k < f.length; k++) {
      const v = f[k];
      if (!(v === "[" || v === "]"))
        if (v === ":") {
          if (w === !0 && (h = !0), !y(m, g, b))
            break;
          if (++p > 7) {
            b.error = !0;
            break;
          }
          k > 0 && f[k - 1] === ":" && (w = !0), g.push(":");
          continue;
        } else if (v === "%") {
          if (!y(m, g, b))
            break;
          y = s;
        } else {
          m.push(v);
          continue;
        }
    }
    return m.length && (y === s ? b.zone = m.join("") : h ? g.push(m.join("")) : g.push(r(m))), b.address = g.join(""), b;
  }
  function a(f) {
    if (l(f, ":") < 2)
      return { host: f, isIPV6: !1 };
    const p = o(f);
    if (p.error)
      return { host: f, isIPV6: !1 };
    {
      let b = p.address, g = p.address;
      return p.zone && (b += "%" + p.zone, g += "%25" + p.zone), { host: b, isIPV6: !0, escapedHost: g };
    }
  }
  function l(f, p) {
    let b = 0;
    for (let g = 0; g < f.length; g++)
      f[g] === p && b++;
    return b;
  }
  function c(f) {
    let p = f;
    const b = [];
    let g = -1, m = 0;
    for (; m = p.length; ) {
      if (m === 1) {
        if (p === ".")
          break;
        if (p === "/") {
          b.push("/");
          break;
        } else {
          b.push(p);
          break;
        }
      } else if (m === 2) {
        if (p[0] === ".") {
          if (p[1] === ".")
            break;
          if (p[1] === "/") {
            p = p.slice(2);
            continue;
          }
        } else if (p[0] === "/" && (p[1] === "." || p[1] === "/")) {
          b.push("/");
          break;
        }
      } else if (m === 3 && p === "/..") {
        b.length !== 0 && b.pop(), b.push("/");
        break;
      }
      if (p[0] === ".") {
        if (p[1] === ".") {
          if (p[2] === "/") {
            p = p.slice(3);
            continue;
          }
        } else if (p[1] === "/") {
          p = p.slice(2);
          continue;
        }
      } else if (p[0] === "/" && p[1] === ".") {
        if (p[2] === "/") {
          p = p.slice(2);
          continue;
        } else if (p[2] === "." && p[3] === "/") {
          p = p.slice(3), b.length !== 0 && b.pop();
          continue;
        }
      }
      if ((g = p.indexOf("/", 1)) === -1) {
        b.push(p);
        break;
      } else
        b.push(p.slice(0, g)), p = p.slice(g);
    }
    return b.join("");
  }
  function d(f, p) {
    const b = p !== !0 ? escape : unescape;
    return f.scheme !== void 0 && (f.scheme = b(f.scheme)), f.userinfo !== void 0 && (f.userinfo = b(f.userinfo)), f.host !== void 0 && (f.host = b(f.host)), f.path !== void 0 && (f.path = b(f.path)), f.query !== void 0 && (f.query = b(f.query)), f.fragment !== void 0 && (f.fragment = b(f.fragment)), f;
  }
  function u(f) {
    const p = [];
    if (f.userinfo !== void 0 && (p.push(f.userinfo), p.push("@")), f.host !== void 0) {
      let b = unescape(f.host);
      if (!e(b)) {
        const g = a(b);
        g.isIPV6 === !0 ? b = `[${g.escapedHost}]` : b = f.host;
      }
      p.push(b);
    }
    return (typeof f.port == "number" || typeof f.port == "string") && (p.push(":"), p.push(String(f.port))), p.length ? p.join("") : void 0;
  }
  return Go = {
    nonSimpleDomain: n,
    recomposeAuthority: u,
    normalizeComponentEncoding: d,
    removeDotSegments: c,
    isIPv4: e,
    isUUID: t,
    normalizeIPv6: a,
    stringArrayToHexStripped: r
  }, Go;
}
var Yo, Xc;
function D0() {
  if (Xc) return Yo;
  Xc = 1;
  const { isUUID: t } = Zf(), e = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu, r = (
    /** @type {const} */
    [
      "http",
      "https",
      "ws",
      "wss",
      "urn",
      "urn:uuid"
    ]
  );
  function n(v) {
    return r.indexOf(
      /** @type {*} */
      v
    ) !== -1;
  }
  function s(v) {
    return v.secure === !0 ? !0 : v.secure === !1 ? !1 : v.scheme ? v.scheme.length === 3 && (v.scheme[0] === "w" || v.scheme[0] === "W") && (v.scheme[1] === "s" || v.scheme[1] === "S") && (v.scheme[2] === "s" || v.scheme[2] === "S") : !1;
  }
  function i(v) {
    return v.host || (v.error = v.error || "HTTP URIs must have a host."), v;
  }
  function o(v) {
    const x = String(v.scheme).toLowerCase() === "https";
    return (v.port === (x ? 443 : 80) || v.port === "") && (v.port = void 0), v.path || (v.path = "/"), v;
  }
  function a(v) {
    return v.secure = s(v), v.resourceName = (v.path || "/") + (v.query ? "?" + v.query : ""), v.path = void 0, v.query = void 0, v;
  }
  function l(v) {
    if ((v.port === (s(v) ? 443 : 80) || v.port === "") && (v.port = void 0), typeof v.secure == "boolean" && (v.scheme = v.secure ? "wss" : "ws", v.secure = void 0), v.resourceName) {
      const [x, S] = v.resourceName.split("?");
      v.path = x && x !== "/" ? x : void 0, v.query = S, v.resourceName = void 0;
    }
    return v.fragment = void 0, v;
  }
  function c(v, x) {
    if (!v.path)
      return v.error = "URN can not be parsed", v;
    const S = v.path.match(e);
    if (S) {
      const _ = x.scheme || v.scheme || "urn";
      v.nid = S[1].toLowerCase(), v.nss = S[2];
      const T = `${_}:${x.nid || v.nid}`, P = k(T);
      v.path = void 0, P && (v = P.parse(v, x));
    } else
      v.error = v.error || "URN can not be parsed.";
    return v;
  }
  function d(v, x) {
    if (v.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const S = x.scheme || v.scheme || "urn", _ = v.nid.toLowerCase(), T = `${S}:${x.nid || _}`, P = k(T);
    P && (v = P.serialize(v, x));
    const R = v, D = v.nss;
    return R.path = `${_ || x.nid}:${D}`, x.skipEscape = !0, R;
  }
  function u(v, x) {
    const S = v;
    return S.uuid = S.nss, S.nss = void 0, !x.tolerant && (!S.uuid || !t(S.uuid)) && (S.error = S.error || "UUID is not valid."), S;
  }
  function f(v) {
    const x = v;
    return x.nss = (v.uuid || "").toLowerCase(), x;
  }
  const p = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: i,
      serialize: o
    }
  ), b = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: p.domainHost,
      parse: i,
      serialize: o
    }
  ), g = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: a,
      serialize: l
    }
  ), m = (
    /** @type {SchemeHandler} */
    {
      scheme: "wss",
      domainHost: g.domainHost,
      parse: g.parse,
      serialize: g.serialize
    }
  ), y = (
    /** @type {Record<SchemeName, SchemeHandler>} */
    {
      http: p,
      https: b,
      ws: g,
      wss: m,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: c,
          serialize: d,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: u,
          serialize: f,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(y, null);
  function k(v) {
    return v && (y[
      /** @type {SchemeName} */
      v
    ] || y[
      /** @type {SchemeName} */
      v.toLowerCase()
    ]) || void 0;
  }
  return Yo = {
    wsIsSecure: s,
    SCHEMES: y,
    isValidSchemeName: n,
    getSchemeHandler: k
  }, Yo;
}
var Zc;
function B0() {
  if (Zc) return xn.exports;
  Zc = 1;
  const { normalizeIPv6: t, removeDotSegments: e, recomposeAuthority: r, normalizeComponentEncoding: n, isIPv4: s, nonSimpleDomain: i } = Zf(), { SCHEMES: o, getSchemeHandler: a } = D0();
  function l(m, w) {
    return typeof m == "string" ? m = /** @type {T} */
    f(b(m, w), w) : typeof m == "object" && (m = /** @type {T} */
    b(f(m, w), w)), m;
  }
  function c(m, w, h) {
    const y = h ? Object.assign({ scheme: "null" }, h) : { scheme: "null" }, k = d(b(m, y), b(w, y), y, !0);
    return y.skipEscape = !0, f(k, y);
  }
  function d(m, w, h, y) {
    const k = {};
    return y || (m = b(f(m, h), h), w = b(f(w, h), h)), h = h || {}, !h.tolerant && w.scheme ? (k.scheme = w.scheme, k.userinfo = w.userinfo, k.host = w.host, k.port = w.port, k.path = e(w.path || ""), k.query = w.query) : (w.userinfo !== void 0 || w.host !== void 0 || w.port !== void 0 ? (k.userinfo = w.userinfo, k.host = w.host, k.port = w.port, k.path = e(w.path || ""), k.query = w.query) : (w.path ? (w.path[0] === "/" ? k.path = e(w.path) : ((m.userinfo !== void 0 || m.host !== void 0 || m.port !== void 0) && !m.path ? k.path = "/" + w.path : m.path ? k.path = m.path.slice(0, m.path.lastIndexOf("/") + 1) + w.path : k.path = w.path, k.path = e(k.path)), k.query = w.query) : (k.path = m.path, w.query !== void 0 ? k.query = w.query : k.query = m.query), k.userinfo = m.userinfo, k.host = m.host, k.port = m.port), k.scheme = m.scheme), k.fragment = w.fragment, k;
  }
  function u(m, w, h) {
    return typeof m == "string" ? (m = unescape(m), m = f(n(b(m, h), !0), { ...h, skipEscape: !0 })) : typeof m == "object" && (m = f(n(m, !0), { ...h, skipEscape: !0 })), typeof w == "string" ? (w = unescape(w), w = f(n(b(w, h), !0), { ...h, skipEscape: !0 })) : typeof w == "object" && (w = f(n(w, !0), { ...h, skipEscape: !0 })), m.toLowerCase() === w.toLowerCase();
  }
  function f(m, w) {
    const h = {
      host: m.host,
      scheme: m.scheme,
      userinfo: m.userinfo,
      port: m.port,
      path: m.path,
      query: m.query,
      nid: m.nid,
      nss: m.nss,
      uuid: m.uuid,
      fragment: m.fragment,
      reference: m.reference,
      resourceName: m.resourceName,
      secure: m.secure,
      error: ""
    }, y = Object.assign({}, w), k = [], v = a(y.scheme || h.scheme);
    v && v.serialize && v.serialize(h, y), h.path !== void 0 && (y.skipEscape ? h.path = unescape(h.path) : (h.path = escape(h.path), h.scheme !== void 0 && (h.path = h.path.split("%3A").join(":")))), y.reference !== "suffix" && h.scheme && k.push(h.scheme, ":");
    const x = r(h);
    if (x !== void 0 && (y.reference !== "suffix" && k.push("//"), k.push(x), h.path && h.path[0] !== "/" && k.push("/")), h.path !== void 0) {
      let S = h.path;
      !y.absolutePath && (!v || !v.absolutePath) && (S = e(S)), x === void 0 && S[0] === "/" && S[1] === "/" && (S = "/%2F" + S.slice(2)), k.push(S);
    }
    return h.query !== void 0 && k.push("?", h.query), h.fragment !== void 0 && k.push("#", h.fragment), k.join("");
  }
  const p = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
  function b(m, w) {
    const h = Object.assign({}, w), y = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    };
    let k = !1;
    h.reference === "suffix" && (h.scheme ? m = h.scheme + ":" + m : m = "//" + m);
    const v = m.match(p);
    if (v) {
      if (y.scheme = v[1], y.userinfo = v[3], y.host = v[4], y.port = parseInt(v[5], 10), y.path = v[6] || "", y.query = v[7], y.fragment = v[8], isNaN(y.port) && (y.port = v[5]), y.host)
        if (s(y.host) === !1) {
          const _ = t(y.host);
          y.host = _.host.toLowerCase(), k = _.isIPV6;
        } else
          k = !0;
      y.scheme === void 0 && y.userinfo === void 0 && y.host === void 0 && y.port === void 0 && y.query === void 0 && !y.path ? y.reference = "same-document" : y.scheme === void 0 ? y.reference = "relative" : y.fragment === void 0 ? y.reference = "absolute" : y.reference = "uri", h.reference && h.reference !== "suffix" && h.reference !== y.reference && (y.error = y.error || "URI is not a " + h.reference + " reference.");
      const x = a(h.scheme || y.scheme);
      if (!h.unicodeSupport && (!x || !x.unicodeSupport) && y.host && (h.domainHost || x && x.domainHost) && k === !1 && i(y.host))
        try {
          y.host = URL.domainToASCII(y.host.toLowerCase());
        } catch (S) {
          y.error = y.error || "Host's domain name can not be converted to ASCII: " + S;
        }
      (!x || x && !x.skipNormalize) && (m.indexOf("%") !== -1 && (y.scheme !== void 0 && (y.scheme = unescape(y.scheme)), y.host !== void 0 && (y.host = unescape(y.host))), y.path && (y.path = escape(unescape(y.path))), y.fragment && (y.fragment = encodeURI(decodeURIComponent(y.fragment)))), x && x.parse && x.parse(y, h);
    } else
      y.error = y.error || "URI can not be parsed.";
    return y;
  }
  const g = {
    SCHEMES: o,
    normalize: l,
    resolve: c,
    resolveComponent: d,
    equal: u,
    serialize: f,
    parse: b
  };
  return xn.exports = g, xn.exports.default = g, xn.exports.fastUri = g, xn.exports;
}
var eu;
function q0() {
  if (eu) return Os;
  eu = 1, Object.defineProperty(Os, "__esModule", { value: !0 });
  const t = B0();
  return t.code = 'require("ajv/dist/runtime/uri").default', Os.default = t, Os;
}
var tu;
function F0() {
  return tu || (tu = 1, (function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = void 0;
    var e = uo();
    Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
      return e.KeywordCxt;
    } });
    var r = fe();
    Object.defineProperty(t, "_", { enumerable: !0, get: function() {
      return r._;
    } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
      return r.str;
    } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
      return r.stringify;
    } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
      return r.nil;
    } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
      return r.Name;
    } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
      return r.CodeGen;
    } });
    const n = yl(), s = fo(), i = Yf(), o = bl(), a = fe(), l = co(), c = Mi(), d = ge(), u = M0, f = q0(), p = (K, I) => new RegExp(K, I);
    p.code = "new RegExp";
    const b = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), m = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, w = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, h = 200;
    function y(K) {
      var I, F, L, E, O, B, V, J, ie, ne, N, j, q, H, Z, le, Ne, Ue, Be, qe, De, qt, at, cr, Ft;
      const ft = K.strict, lt = (I = K.code) === null || I === void 0 ? void 0 : I.optimize, Rr = lt === !0 || lt === void 0 ? 1 : lt || 0, bn = (L = (F = K.code) === null || F === void 0 ? void 0 : F.regExp) !== null && L !== void 0 ? L : p, hs = (E = K.uriResolver) !== null && E !== void 0 ? E : f.default;
      return {
        strictSchema: (B = (O = K.strictSchema) !== null && O !== void 0 ? O : ft) !== null && B !== void 0 ? B : !0,
        strictNumbers: (J = (V = K.strictNumbers) !== null && V !== void 0 ? V : ft) !== null && J !== void 0 ? J : !0,
        strictTypes: (ne = (ie = K.strictTypes) !== null && ie !== void 0 ? ie : ft) !== null && ne !== void 0 ? ne : "log",
        strictTuples: (j = (N = K.strictTuples) !== null && N !== void 0 ? N : ft) !== null && j !== void 0 ? j : "log",
        strictRequired: (H = (q = K.strictRequired) !== null && q !== void 0 ? q : ft) !== null && H !== void 0 ? H : !1,
        code: K.code ? { ...K.code, optimize: Rr, regExp: bn } : { optimize: Rr, regExp: bn },
        loopRequired: (Z = K.loopRequired) !== null && Z !== void 0 ? Z : h,
        loopEnum: (le = K.loopEnum) !== null && le !== void 0 ? le : h,
        meta: (Ne = K.meta) !== null && Ne !== void 0 ? Ne : !0,
        messages: (Ue = K.messages) !== null && Ue !== void 0 ? Ue : !0,
        inlineRefs: (Be = K.inlineRefs) !== null && Be !== void 0 ? Be : !0,
        schemaId: (qe = K.schemaId) !== null && qe !== void 0 ? qe : "$id",
        addUsedSchema: (De = K.addUsedSchema) !== null && De !== void 0 ? De : !0,
        validateSchema: (qt = K.validateSchema) !== null && qt !== void 0 ? qt : !0,
        validateFormats: (at = K.validateFormats) !== null && at !== void 0 ? at : !0,
        unicodeRegExp: (cr = K.unicodeRegExp) !== null && cr !== void 0 ? cr : !0,
        int32range: (Ft = K.int32range) !== null && Ft !== void 0 ? Ft : !0,
        uriResolver: hs
      };
    }
    class k {
      constructor(I = {}) {
        this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), I = this.opts = { ...I, ...y(I) };
        const { es5: F, lines: L } = this.opts.code;
        this.scope = new a.ValueScope({ scope: {}, prefixes: g, es5: F, lines: L }), this.logger = D(I.logger);
        const E = I.validateFormats;
        I.validateFormats = !1, this.RULES = (0, i.getRules)(), v.call(this, m, I, "NOT SUPPORTED"), v.call(this, w, I, "DEPRECATED", "warn"), this._metaOpts = P.call(this), I.formats && _.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), I.keywords && T.call(this, I.keywords), typeof I.meta == "object" && this.addMetaSchema(I.meta), S.call(this), I.validateFormats = E;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: I, meta: F, schemaId: L } = this.opts;
        let E = u;
        L === "id" && (E = { ...u }, E.id = E.$id, delete E.$id), F && I && this.addMetaSchema(E, E[L], !1);
      }
      defaultMeta() {
        const { meta: I, schemaId: F } = this.opts;
        return this.opts.defaultMeta = typeof I == "object" ? I[F] || I : void 0;
      }
      validate(I, F) {
        let L;
        if (typeof I == "string") {
          if (L = this.getSchema(I), !L)
            throw new Error(`no schema with key or ref "${I}"`);
        } else
          L = this.compile(I);
        const E = L(F);
        return "$async" in L || (this.errors = L.errors), E;
      }
      compile(I, F) {
        const L = this._addSchema(I, F);
        return L.validate || this._compileSchemaEnv(L);
      }
      compileAsync(I, F) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: L } = this.opts;
        return E.call(this, I, F);
        async function E(ne, N) {
          await O.call(this, ne.$schema);
          const j = this._addSchema(ne, N);
          return j.validate || B.call(this, j);
        }
        async function O(ne) {
          ne && !this.getSchema(ne) && await E.call(this, { $ref: ne }, !0);
        }
        async function B(ne) {
          try {
            return this._compileSchemaEnv(ne);
          } catch (N) {
            if (!(N instanceof s.default))
              throw N;
            return V.call(this, N), await J.call(this, N.missingSchema), B.call(this, ne);
          }
        }
        function V({ missingSchema: ne, missingRef: N }) {
          if (this.refs[ne])
            throw new Error(`AnySchema ${ne} is loaded but ${N} cannot be resolved`);
        }
        async function J(ne) {
          const N = await ie.call(this, ne);
          this.refs[ne] || await O.call(this, N.$schema), this.refs[ne] || this.addSchema(N, ne, F);
        }
        async function ie(ne) {
          const N = this._loading[ne];
          if (N)
            return N;
          try {
            return await (this._loading[ne] = L(ne));
          } finally {
            delete this._loading[ne];
          }
        }
      }
      // Adds schema to the instance
      addSchema(I, F, L, E = this.opts.validateSchema) {
        if (Array.isArray(I)) {
          for (const B of I)
            this.addSchema(B, void 0, L, E);
          return this;
        }
        let O;
        if (typeof I == "object") {
          const { schemaId: B } = this.opts;
          if (O = I[B], O !== void 0 && typeof O != "string")
            throw new Error(`schema ${B} must be string`);
        }
        return F = (0, l.normalizeId)(F || O), this._checkUnique(F), this.schemas[F] = this._addSchema(I, L, F, E, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(I, F, L = this.opts.validateSchema) {
        return this.addSchema(I, F, !0, L), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(I, F) {
        if (typeof I == "boolean")
          return !0;
        let L;
        if (L = I.$schema, L !== void 0 && typeof L != "string")
          throw new Error("$schema must be a string");
        if (L = L || this.opts.defaultMeta || this.defaultMeta(), !L)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const E = this.validate(L, I);
        if (!E && F) {
          const O = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(O);
          else
            throw new Error(O);
        }
        return E;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(I) {
        let F;
        for (; typeof (F = x.call(this, I)) == "string"; )
          I = F;
        if (F === void 0) {
          const { schemaId: L } = this.opts, E = new o.SchemaEnv({ schema: {}, schemaId: L });
          if (F = o.resolveSchema.call(this, E, I), !F)
            return;
          this.refs[I] = F;
        }
        return F.validate || this._compileSchemaEnv(F);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(I) {
        if (I instanceof RegExp)
          return this._removeAllSchemas(this.schemas, I), this._removeAllSchemas(this.refs, I), this;
        switch (typeof I) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const F = x.call(this, I);
            return typeof F == "object" && this._cache.delete(F.schema), delete this.schemas[I], delete this.refs[I], this;
          }
          case "object": {
            const F = I;
            this._cache.delete(F);
            let L = I[this.opts.schemaId];
            return L && (L = (0, l.normalizeId)(L), delete this.schemas[L], delete this.refs[L]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(I) {
        for (const F of I)
          this.addKeyword(F);
        return this;
      }
      addKeyword(I, F) {
        let L;
        if (typeof I == "string")
          L = I, typeof F == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), F.keyword = L);
        else if (typeof I == "object" && F === void 0) {
          if (F = I, L = F.keyword, Array.isArray(L) && !L.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (Y.call(this, L, F), !F)
          return (0, d.eachItem)(L, (O) => se.call(this, O)), this;
        xe.call(this, F);
        const E = {
          ...F,
          type: (0, c.getJSONTypes)(F.type),
          schemaType: (0, c.getJSONTypes)(F.schemaType)
        };
        return (0, d.eachItem)(L, E.type.length === 0 ? (O) => se.call(this, O, E) : (O) => E.type.forEach((B) => se.call(this, O, E, B))), this;
      }
      getKeyword(I) {
        const F = this.RULES.all[I];
        return typeof F == "object" ? F.definition : !!F;
      }
      // Remove keyword
      removeKeyword(I) {
        const { RULES: F } = this;
        delete F.keywords[I], delete F.all[I];
        for (const L of F.rules) {
          const E = L.rules.findIndex((O) => O.keyword === I);
          E >= 0 && L.rules.splice(E, 1);
        }
        return this;
      }
      // Add format
      addFormat(I, F) {
        return typeof F == "string" && (F = new RegExp(F)), this.formats[I] = F, this;
      }
      errorsText(I = this.errors, { separator: F = ", ", dataVar: L = "data" } = {}) {
        return !I || I.length === 0 ? "No errors" : I.map((E) => `${L}${E.instancePath} ${E.message}`).reduce((E, O) => E + F + O);
      }
      $dataMetaSchema(I, F) {
        const L = this.RULES.all;
        I = JSON.parse(JSON.stringify(I));
        for (const E of F) {
          const O = E.split("/").slice(1);
          let B = I;
          for (const V of O)
            B = B[V];
          for (const V in L) {
            const J = L[V];
            if (typeof J != "object")
              continue;
            const { $data: ie } = J.definition, ne = B[V];
            ie && ne && (B[V] = ce(ne));
          }
        }
        return I;
      }
      _removeAllSchemas(I, F) {
        for (const L in I) {
          const E = I[L];
          (!F || F.test(L)) && (typeof E == "string" ? delete I[L] : E && !E.meta && (this._cache.delete(E.schema), delete I[L]));
        }
      }
      _addSchema(I, F, L, E = this.opts.validateSchema, O = this.opts.addUsedSchema) {
        let B;
        const { schemaId: V } = this.opts;
        if (typeof I == "object")
          B = I[V];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof I != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let J = this._cache.get(I);
        if (J !== void 0)
          return J;
        L = (0, l.normalizeId)(B || L);
        const ie = l.getSchemaRefs.call(this, I, L);
        return J = new o.SchemaEnv({ schema: I, schemaId: V, meta: F, baseId: L, localRefs: ie }), this._cache.set(J.schema, J), O && !L.startsWith("#") && (L && this._checkUnique(L), this.refs[L] = J), E && this.validateSchema(I, !0), J;
      }
      _checkUnique(I) {
        if (this.schemas[I] || this.refs[I])
          throw new Error(`schema with key or id "${I}" already exists`);
      }
      _compileSchemaEnv(I) {
        if (I.meta ? this._compileMetaSchema(I) : o.compileSchema.call(this, I), !I.validate)
          throw new Error("ajv implementation error");
        return I.validate;
      }
      _compileMetaSchema(I) {
        const F = this.opts;
        this.opts = this._metaOpts;
        try {
          o.compileSchema.call(this, I);
        } finally {
          this.opts = F;
        }
      }
    }
    k.ValidationError = n.default, k.MissingRefError = s.default, t.default = k;
    function v(K, I, F, L = "error") {
      for (const E in K) {
        const O = E;
        O in I && this.logger[L](`${F}: option ${E}. ${K[O]}`);
      }
    }
    function x(K) {
      return K = (0, l.normalizeId)(K), this.schemas[K] || this.refs[K];
    }
    function S() {
      const K = this.opts.schemas;
      if (K)
        if (Array.isArray(K))
          this.addSchema(K);
        else
          for (const I in K)
            this.addSchema(K[I], I);
    }
    function _() {
      for (const K in this.opts.formats) {
        const I = this.opts.formats[K];
        I && this.addFormat(K, I);
      }
    }
    function T(K) {
      if (Array.isArray(K)) {
        this.addVocabulary(K);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const I in K) {
        const F = K[I];
        F.keyword || (F.keyword = I), this.addKeyword(F);
      }
    }
    function P() {
      const K = { ...this.opts };
      for (const I of b)
        delete K[I];
      return K;
    }
    const R = { log() {
    }, warn() {
    }, error() {
    } };
    function D(K) {
      if (K === !1)
        return R;
      if (K === void 0)
        return console;
      if (K.log && K.warn && K.error)
        return K;
      throw new Error("logger must implement log, warn and error methods");
    }
    const U = /^[a-z_$][a-z0-9_$:-]*$/i;
    function Y(K, I) {
      const { RULES: F } = this;
      if ((0, d.eachItem)(K, (L) => {
        if (F.keywords[L])
          throw new Error(`Keyword ${L} is already defined`);
        if (!U.test(L))
          throw new Error(`Keyword ${L} has invalid name`);
      }), !!I && I.$data && !("code" in I || "validate" in I))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function se(K, I, F) {
      var L;
      const E = I?.post;
      if (F && E)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: O } = this;
      let B = E ? O.post : O.rules.find(({ type: J }) => J === F);
      if (B || (B = { type: F, rules: [] }, O.rules.push(B)), O.keywords[K] = !0, !I)
        return;
      const V = {
        keyword: K,
        definition: {
          ...I,
          type: (0, c.getJSONTypes)(I.type),
          schemaType: (0, c.getJSONTypes)(I.schemaType)
        }
      };
      I.before ? be.call(this, B, V, I.before) : B.rules.push(V), O.all[K] = V, (L = I.implements) === null || L === void 0 || L.forEach((J) => this.addKeyword(J));
    }
    function be(K, I, F) {
      const L = K.rules.findIndex((E) => E.keyword === F);
      L >= 0 ? K.rules.splice(L, 0, I) : (K.rules.push(I), this.logger.warn(`rule ${F} is not defined`));
    }
    function xe(K) {
      let { metaSchema: I } = K;
      I !== void 0 && (K.$data && this.opts.$data && (I = ce(I)), K.validateSchema = this.compile(I, !0));
    }
    const W = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function ce(K) {
      return { anyOf: [K, W] };
    }
  })(Uo)), Uo;
}
var Cs = {}, Ns = {}, Is = {}, ru;
function U0() {
  if (ru) return Is;
  ru = 1, Object.defineProperty(Is, "__esModule", { value: !0 });
  const t = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Is.default = t, Is;
}
var rr = {}, nu;
function K0() {
  if (nu) return rr;
  nu = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.callRef = rr.getValidate = void 0;
  const t = fo(), e = It(), r = fe(), n = ar(), s = bl(), i = ge(), o = {
    keyword: "$ref",
    schemaType: "string",
    code(c) {
      const { gen: d, schema: u, it: f } = c, { baseId: p, schemaEnv: b, validateName: g, opts: m, self: w } = f, { root: h } = b;
      if ((u === "#" || u === "#/") && p === h.baseId)
        return k();
      const y = s.resolveRef.call(w, h, p, u);
      if (y === void 0)
        throw new t.default(f.opts.uriResolver, p, u);
      if (y instanceof s.SchemaEnv)
        return v(y);
      return x(y);
      function k() {
        if (b === h)
          return l(c, g, b, b.$async);
        const S = d.scopeValue("root", { ref: h });
        return l(c, (0, r._)`${S}.validate`, h, h.$async);
      }
      function v(S) {
        const _ = a(c, S);
        l(c, _, S, S.$async);
      }
      function x(S) {
        const _ = d.scopeValue("schema", m.code.source === !0 ? { ref: S, code: (0, r.stringify)(S) } : { ref: S }), T = d.name("valid"), P = c.subschema({
          schema: S,
          dataTypes: [],
          schemaPath: r.nil,
          topSchemaRef: _,
          errSchemaPath: u
        }, T);
        c.mergeEvaluated(P), c.ok(T);
      }
    }
  };
  function a(c, d) {
    const { gen: u } = c;
    return d.validate ? u.scopeValue("validate", { ref: d.validate }) : (0, r._)`${u.scopeValue("wrapper", { ref: d })}.validate`;
  }
  rr.getValidate = a;
  function l(c, d, u, f) {
    const { gen: p, it: b } = c, { allErrors: g, schemaEnv: m, opts: w } = b, h = w.passContext ? n.default.this : r.nil;
    f ? y() : k();
    function y() {
      if (!m.$async)
        throw new Error("async schema referenced by sync schema");
      const S = p.let("valid");
      p.try(() => {
        p.code((0, r._)`await ${(0, e.callValidateCode)(c, d, h)}`), x(d), g || p.assign(S, !0);
      }, (_) => {
        p.if((0, r._)`!(${_} instanceof ${b.ValidationError})`, () => p.throw(_)), v(_), g || p.assign(S, !1);
      }), c.ok(S);
    }
    function k() {
      c.result((0, e.callValidateCode)(c, d, h), () => x(d), () => v(d));
    }
    function v(S) {
      const _ = (0, r._)`${S}.errors`;
      p.assign(n.default.vErrors, (0, r._)`${n.default.vErrors} === null ? ${_} : ${n.default.vErrors}.concat(${_})`), p.assign(n.default.errors, (0, r._)`${n.default.vErrors}.length`);
    }
    function x(S) {
      var _;
      if (!b.opts.unevaluated)
        return;
      const T = (_ = u?.validate) === null || _ === void 0 ? void 0 : _.evaluated;
      if (b.props !== !0)
        if (T && !T.dynamicProps)
          T.props !== void 0 && (b.props = i.mergeEvaluated.props(p, T.props, b.props));
        else {
          const P = p.var("props", (0, r._)`${S}.evaluated.props`);
          b.props = i.mergeEvaluated.props(p, P, b.props, r.Name);
        }
      if (b.items !== !0)
        if (T && !T.dynamicItems)
          T.items !== void 0 && (b.items = i.mergeEvaluated.items(p, T.items, b.items));
        else {
          const P = p.var("items", (0, r._)`${S}.evaluated.items`);
          b.items = i.mergeEvaluated.items(p, P, b.items, r.Name);
        }
    }
  }
  return rr.callRef = l, rr.default = o, rr;
}
var su;
function z0() {
  if (su) return Ns;
  su = 1, Object.defineProperty(Ns, "__esModule", { value: !0 });
  const t = U0(), e = K0(), r = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    t.default,
    e.default
  ];
  return Ns.default = r, Ns;
}
var Ps = {}, Ls = {}, iu;
function V0() {
  if (iu) return Ls;
  iu = 1, Object.defineProperty(Ls, "__esModule", { value: !0 });
  const t = fe(), e = t.operators, r = {
    maximum: { okStr: "<=", ok: e.LTE, fail: e.GT },
    minimum: { okStr: ">=", ok: e.GTE, fail: e.LT },
    exclusiveMaximum: { okStr: "<", ok: e.LT, fail: e.GTE },
    exclusiveMinimum: { okStr: ">", ok: e.GT, fail: e.LTE }
  }, n = {
    message: ({ keyword: i, schemaCode: o }) => (0, t.str)`must be ${r[i].okStr} ${o}`,
    params: ({ keyword: i, schemaCode: o }) => (0, t._)`{comparison: ${r[i].okStr}, limit: ${o}}`
  }, s = {
    keyword: Object.keys(r),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: n,
    code(i) {
      const { keyword: o, data: a, schemaCode: l } = i;
      i.fail$data((0, t._)`${a} ${r[o].fail} ${l} || isNaN(${a})`);
    }
  };
  return Ls.default = s, Ls;
}
var Rs = {}, ou;
function H0() {
  if (ou) return Rs;
  ou = 1, Object.defineProperty(Rs, "__esModule", { value: !0 });
  const t = fe(), r = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, t.str)`must be multiple of ${n}`,
      params: ({ schemaCode: n }) => (0, t._)`{multipleOf: ${n}}`
    },
    code(n) {
      const { gen: s, data: i, schemaCode: o, it: a } = n, l = a.opts.multipleOfPrecision, c = s.let("res"), d = l ? (0, t._)`Math.abs(Math.round(${c}) - ${c}) > 1e-${l}` : (0, t._)`${c} !== parseInt(${c})`;
      n.fail$data((0, t._)`(${o} === 0 || (${c} = ${i}/${o}, ${d}))`);
    }
  };
  return Rs.default = r, Rs;
}
var js = {}, Ms = {}, au;
function J0() {
  if (au) return Ms;
  au = 1, Object.defineProperty(Ms, "__esModule", { value: !0 });
  function t(e) {
    const r = e.length;
    let n = 0, s = 0, i;
    for (; s < r; )
      n++, i = e.charCodeAt(s++), i >= 55296 && i <= 56319 && s < r && (i = e.charCodeAt(s), (i & 64512) === 56320 && s++);
    return n;
  }
  return Ms.default = t, t.code = 'require("ajv/dist/runtime/ucs2length").default', Ms;
}
var lu;
function W0() {
  if (lu) return js;
  lu = 1, Object.defineProperty(js, "__esModule", { value: !0 });
  const t = fe(), e = ge(), r = J0(), s = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: i, schemaCode: o }) {
        const a = i === "maxLength" ? "more" : "fewer";
        return (0, t.str)`must NOT have ${a} than ${o} characters`;
      },
      params: ({ schemaCode: i }) => (0, t._)`{limit: ${i}}`
    },
    code(i) {
      const { keyword: o, data: a, schemaCode: l, it: c } = i, d = o === "maxLength" ? t.operators.GT : t.operators.LT, u = c.opts.unicode === !1 ? (0, t._)`${a}.length` : (0, t._)`${(0, e.useFunc)(i.gen, r.default)}(${a})`;
      i.fail$data((0, t._)`${u} ${d} ${l}`);
    }
  };
  return js.default = s, js;
}
var Ds = {}, cu;
function G0() {
  if (cu) return Ds;
  cu = 1, Object.defineProperty(Ds, "__esModule", { value: !0 });
  const t = It(), e = fe(), n = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: s }) => (0, e.str)`must match pattern "${s}"`,
      params: ({ schemaCode: s }) => (0, e._)`{pattern: ${s}}`
    },
    code(s) {
      const { data: i, $data: o, schema: a, schemaCode: l, it: c } = s, d = c.opts.unicodeRegExp ? "u" : "", u = o ? (0, e._)`(new RegExp(${l}, ${d}))` : (0, t.usePattern)(s, a);
      s.fail$data((0, e._)`!${u}.test(${i})`);
    }
  };
  return Ds.default = n, Ds;
}
var Bs = {}, uu;
function Y0() {
  if (uu) return Bs;
  uu = 1, Object.defineProperty(Bs, "__esModule", { value: !0 });
  const t = fe(), r = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: s }) {
        const i = n === "maxProperties" ? "more" : "fewer";
        return (0, t.str)`must NOT have ${i} than ${s} properties`;
      },
      params: ({ schemaCode: n }) => (0, t._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: s, data: i, schemaCode: o } = n, a = s === "maxProperties" ? t.operators.GT : t.operators.LT;
      n.fail$data((0, t._)`Object.keys(${i}).length ${a} ${o}`);
    }
  };
  return Bs.default = r, Bs;
}
var qs = {}, du;
function Q0() {
  if (du) return qs;
  du = 1, Object.defineProperty(qs, "__esModule", { value: !0 });
  const t = It(), e = fe(), r = ge(), s = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: i } }) => (0, e.str)`must have required property '${i}'`,
      params: ({ params: { missingProperty: i } }) => (0, e._)`{missingProperty: ${i}}`
    },
    code(i) {
      const { gen: o, schema: a, schemaCode: l, data: c, $data: d, it: u } = i, { opts: f } = u;
      if (!d && a.length === 0)
        return;
      const p = a.length >= f.loopRequired;
      if (u.allErrors ? b() : g(), f.strictRequired) {
        const h = i.parentSchema.properties, { definedProperties: y } = i.it;
        for (const k of a)
          if (h?.[k] === void 0 && !y.has(k)) {
            const v = u.schemaEnv.baseId + u.errSchemaPath, x = `required property "${k}" is not defined at "${v}" (strictRequired)`;
            (0, r.checkStrictMode)(u, x, u.opts.strictRequired);
          }
      }
      function b() {
        if (p || d)
          i.block$data(e.nil, m);
        else
          for (const h of a)
            (0, t.checkReportMissingProp)(i, h);
      }
      function g() {
        const h = o.let("missing");
        if (p || d) {
          const y = o.let("valid", !0);
          i.block$data(y, () => w(h, y)), i.ok(y);
        } else
          o.if((0, t.checkMissingProp)(i, a, h)), (0, t.reportMissingProp)(i, h), o.else();
      }
      function m() {
        o.forOf("prop", l, (h) => {
          i.setParams({ missingProperty: h }), o.if((0, t.noPropertyInData)(o, c, h, f.ownProperties), () => i.error());
        });
      }
      function w(h, y) {
        i.setParams({ missingProperty: h }), o.forOf(h, l, () => {
          o.assign(y, (0, t.propertyInData)(o, c, h, f.ownProperties)), o.if((0, e.not)(y), () => {
            i.error(), o.break();
          });
        }, e.nil);
      }
    }
  };
  return qs.default = s, qs;
}
var Fs = {}, fu;
function X0() {
  if (fu) return Fs;
  fu = 1, Object.defineProperty(Fs, "__esModule", { value: !0 });
  const t = fe(), r = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: n, schemaCode: s }) {
        const i = n === "maxItems" ? "more" : "fewer";
        return (0, t.str)`must NOT have ${i} than ${s} items`;
      },
      params: ({ schemaCode: n }) => (0, t._)`{limit: ${n}}`
    },
    code(n) {
      const { keyword: s, data: i, schemaCode: o } = n, a = s === "maxItems" ? t.operators.GT : t.operators.LT;
      n.fail$data((0, t._)`${i}.length ${a} ${o}`);
    }
  };
  return Fs.default = r, Fs;
}
var Us = {}, Ks = {}, hu;
function vl() {
  if (hu) return Ks;
  hu = 1, Object.defineProperty(Ks, "__esModule", { value: !0 });
  const t = Xf();
  return t.code = 'require("ajv/dist/runtime/equal").default', Ks.default = t, Ks;
}
var pu;
function Z0() {
  if (pu) return Us;
  pu = 1, Object.defineProperty(Us, "__esModule", { value: !0 });
  const t = Mi(), e = fe(), r = ge(), n = vl(), i = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: o, j: a } }) => (0, e.str)`must NOT have duplicate items (items ## ${a} and ${o} are identical)`,
      params: ({ params: { i: o, j: a } }) => (0, e._)`{i: ${o}, j: ${a}}`
    },
    code(o) {
      const { gen: a, data: l, $data: c, schema: d, parentSchema: u, schemaCode: f, it: p } = o;
      if (!c && !d)
        return;
      const b = a.let("valid"), g = u.items ? (0, t.getSchemaTypes)(u.items) : [];
      o.block$data(b, m, (0, e._)`${f} === false`), o.ok(b);
      function m() {
        const k = a.let("i", (0, e._)`${l}.length`), v = a.let("j");
        o.setParams({ i: k, j: v }), a.assign(b, !0), a.if((0, e._)`${k} > 1`, () => (w() ? h : y)(k, v));
      }
      function w() {
        return g.length > 0 && !g.some((k) => k === "object" || k === "array");
      }
      function h(k, v) {
        const x = a.name("item"), S = (0, t.checkDataTypes)(g, x, p.opts.strictNumbers, t.DataType.Wrong), _ = a.const("indices", (0, e._)`{}`);
        a.for((0, e._)`;${k}--;`, () => {
          a.let(x, (0, e._)`${l}[${k}]`), a.if(S, (0, e._)`continue`), g.length > 1 && a.if((0, e._)`typeof ${x} == "string"`, (0, e._)`${x} += "_"`), a.if((0, e._)`typeof ${_}[${x}] == "number"`, () => {
            a.assign(v, (0, e._)`${_}[${x}]`), o.error(), a.assign(b, !1).break();
          }).code((0, e._)`${_}[${x}] = ${k}`);
        });
      }
      function y(k, v) {
        const x = (0, r.useFunc)(a, n.default), S = a.name("outer");
        a.label(S).for((0, e._)`;${k}--;`, () => a.for((0, e._)`${v} = ${k}; ${v}--;`, () => a.if((0, e._)`${x}(${l}[${k}], ${l}[${v}])`, () => {
          o.error(), a.assign(b, !1).break(S);
        })));
      }
    }
  };
  return Us.default = i, Us;
}
var zs = {}, mu;
function ey() {
  if (mu) return zs;
  mu = 1, Object.defineProperty(zs, "__esModule", { value: !0 });
  const t = fe(), e = ge(), r = vl(), s = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: i }) => (0, t._)`{allowedValue: ${i}}`
    },
    code(i) {
      const { gen: o, data: a, $data: l, schemaCode: c, schema: d } = i;
      l || d && typeof d == "object" ? i.fail$data((0, t._)`!${(0, e.useFunc)(o, r.default)}(${a}, ${c})`) : i.fail((0, t._)`${d} !== ${a}`);
    }
  };
  return zs.default = s, zs;
}
var Vs = {}, gu;
function ty() {
  if (gu) return Vs;
  gu = 1, Object.defineProperty(Vs, "__esModule", { value: !0 });
  const t = fe(), e = ge(), r = vl(), s = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: i }) => (0, t._)`{allowedValues: ${i}}`
    },
    code(i) {
      const { gen: o, data: a, $data: l, schema: c, schemaCode: d, it: u } = i;
      if (!l && c.length === 0)
        throw new Error("enum must have non-empty array");
      const f = c.length >= u.opts.loopEnum;
      let p;
      const b = () => p ?? (p = (0, e.useFunc)(o, r.default));
      let g;
      if (f || l)
        g = o.let("valid"), i.block$data(g, m);
      else {
        if (!Array.isArray(c))
          throw new Error("ajv implementation error");
        const h = o.const("vSchema", d);
        g = (0, t.or)(...c.map((y, k) => w(h, k)));
      }
      i.pass(g);
      function m() {
        o.assign(g, !1), o.forOf("v", d, (h) => o.if((0, t._)`${b()}(${a}, ${h})`, () => o.assign(g, !0).break()));
      }
      function w(h, y) {
        const k = c[y];
        return typeof k == "object" && k !== null ? (0, t._)`${b()}(${a}, ${h}[${y}])` : (0, t._)`${a} === ${k}`;
      }
    }
  };
  return Vs.default = s, Vs;
}
var yu;
function ry() {
  if (yu) return Ps;
  yu = 1, Object.defineProperty(Ps, "__esModule", { value: !0 });
  const t = V0(), e = H0(), r = W0(), n = G0(), s = Y0(), i = Q0(), o = X0(), a = Z0(), l = ey(), c = ty(), d = [
    // number
    t.default,
    e.default,
    // string
    r.default,
    n.default,
    // object
    s.default,
    i.default,
    // array
    o.default,
    a.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    l.default,
    c.default
  ];
  return Ps.default = d, Ps;
}
var Hs = {}, Fr = {}, bu;
function eh() {
  if (bu) return Fr;
  bu = 1, Object.defineProperty(Fr, "__esModule", { value: !0 }), Fr.validateAdditionalItems = void 0;
  const t = fe(), e = ge(), n = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: i } }) => (0, t.str)`must NOT have more than ${i} items`,
      params: ({ params: { len: i } }) => (0, t._)`{limit: ${i}}`
    },
    code(i) {
      const { parentSchema: o, it: a } = i, { items: l } = o;
      if (!Array.isArray(l)) {
        (0, e.checkStrictMode)(a, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      s(i, l);
    }
  };
  function s(i, o) {
    const { gen: a, schema: l, data: c, keyword: d, it: u } = i;
    u.items = !0;
    const f = a.const("len", (0, t._)`${c}.length`);
    if (l === !1)
      i.setParams({ len: o.length }), i.pass((0, t._)`${f} <= ${o.length}`);
    else if (typeof l == "object" && !(0, e.alwaysValidSchema)(u, l)) {
      const b = a.var("valid", (0, t._)`${f} <= ${o.length}`);
      a.if((0, t.not)(b), () => p(b)), i.ok(b);
    }
    function p(b) {
      a.forRange("i", o.length, f, (g) => {
        i.subschema({ keyword: d, dataProp: g, dataPropType: e.Type.Num }, b), u.allErrors || a.if((0, t.not)(b), () => a.break());
      });
    }
  }
  return Fr.validateAdditionalItems = s, Fr.default = n, Fr;
}
var Js = {}, Ur = {}, vu;
function th() {
  if (vu) return Ur;
  vu = 1, Object.defineProperty(Ur, "__esModule", { value: !0 }), Ur.validateTuple = void 0;
  const t = fe(), e = ge(), r = It(), n = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(i) {
      const { schema: o, it: a } = i;
      if (Array.isArray(o))
        return s(i, "additionalItems", o);
      a.items = !0, !(0, e.alwaysValidSchema)(a, o) && i.ok((0, r.validateArray)(i));
    }
  };
  function s(i, o, a = i.schema) {
    const { gen: l, parentSchema: c, data: d, keyword: u, it: f } = i;
    g(c), f.opts.unevaluated && a.length && f.items !== !0 && (f.items = e.mergeEvaluated.items(l, a.length, f.items));
    const p = l.name("valid"), b = l.const("len", (0, t._)`${d}.length`);
    a.forEach((m, w) => {
      (0, e.alwaysValidSchema)(f, m) || (l.if((0, t._)`${b} > ${w}`, () => i.subschema({
        keyword: u,
        schemaProp: w,
        dataProp: w
      }, p)), i.ok(p));
    });
    function g(m) {
      const { opts: w, errSchemaPath: h } = f, y = a.length, k = y === m.minItems && (y === m.maxItems || m[o] === !1);
      if (w.strictTuples && !k) {
        const v = `"${u}" is ${y}-tuple, but minItems or maxItems/${o} are not specified or different at path "${h}"`;
        (0, e.checkStrictMode)(f, v, w.strictTuples);
      }
    }
  }
  return Ur.validateTuple = s, Ur.default = n, Ur;
}
var wu;
function ny() {
  if (wu) return Js;
  wu = 1, Object.defineProperty(Js, "__esModule", { value: !0 });
  const t = th(), e = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (r) => (0, t.validateTuple)(r, "items")
  };
  return Js.default = e, Js;
}
var Ws = {}, ku;
function sy() {
  if (ku) return Ws;
  ku = 1, Object.defineProperty(Ws, "__esModule", { value: !0 });
  const t = fe(), e = ge(), r = It(), n = eh(), i = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: o } }) => (0, t.str)`must NOT have more than ${o} items`,
      params: ({ params: { len: o } }) => (0, t._)`{limit: ${o}}`
    },
    code(o) {
      const { schema: a, parentSchema: l, it: c } = o, { prefixItems: d } = l;
      c.items = !0, !(0, e.alwaysValidSchema)(c, a) && (d ? (0, n.validateAdditionalItems)(o, d) : o.ok((0, r.validateArray)(o)));
    }
  };
  return Ws.default = i, Ws;
}
var Gs = {}, xu;
function iy() {
  if (xu) return Gs;
  xu = 1, Object.defineProperty(Gs, "__esModule", { value: !0 });
  const t = fe(), e = ge(), n = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: s, max: i } }) => i === void 0 ? (0, t.str)`must contain at least ${s} valid item(s)` : (0, t.str)`must contain at least ${s} and no more than ${i} valid item(s)`,
      params: ({ params: { min: s, max: i } }) => i === void 0 ? (0, t._)`{minContains: ${s}}` : (0, t._)`{minContains: ${s}, maxContains: ${i}}`
    },
    code(s) {
      const { gen: i, schema: o, parentSchema: a, data: l, it: c } = s;
      let d, u;
      const { minContains: f, maxContains: p } = a;
      c.opts.next ? (d = f === void 0 ? 1 : f, u = p) : d = 1;
      const b = i.const("len", (0, t._)`${l}.length`);
      if (s.setParams({ min: d, max: u }), u === void 0 && d === 0) {
        (0, e.checkStrictMode)(c, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (u !== void 0 && d > u) {
        (0, e.checkStrictMode)(c, '"minContains" > "maxContains" is always invalid'), s.fail();
        return;
      }
      if ((0, e.alwaysValidSchema)(c, o)) {
        let y = (0, t._)`${b} >= ${d}`;
        u !== void 0 && (y = (0, t._)`${y} && ${b} <= ${u}`), s.pass(y);
        return;
      }
      c.items = !0;
      const g = i.name("valid");
      u === void 0 && d === 1 ? w(g, () => i.if(g, () => i.break())) : d === 0 ? (i.let(g, !0), u !== void 0 && i.if((0, t._)`${l}.length > 0`, m)) : (i.let(g, !1), m()), s.result(g, () => s.reset());
      function m() {
        const y = i.name("_valid"), k = i.let("count", 0);
        w(y, () => i.if(y, () => h(k)));
      }
      function w(y, k) {
        i.forRange("i", 0, b, (v) => {
          s.subschema({
            keyword: "contains",
            dataProp: v,
            dataPropType: e.Type.Num,
            compositeRule: !0
          }, y), k();
        });
      }
      function h(y) {
        i.code((0, t._)`${y}++`), u === void 0 ? i.if((0, t._)`${y} >= ${d}`, () => i.assign(g, !0).break()) : (i.if((0, t._)`${y} > ${u}`, () => i.assign(g, !1).break()), d === 1 ? i.assign(g, !0) : i.if((0, t._)`${y} >= ${d}`, () => i.assign(g, !0)));
      }
    }
  };
  return Gs.default = n, Gs;
}
var Qo = {}, Su;
function oy() {
  return Su || (Su = 1, (function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.validateSchemaDeps = t.validatePropertyDeps = t.error = void 0;
    const e = fe(), r = ge(), n = It();
    t.error = {
      message: ({ params: { property: l, depsCount: c, deps: d } }) => {
        const u = c === 1 ? "property" : "properties";
        return (0, e.str)`must have ${u} ${d} when property ${l} is present`;
      },
      params: ({ params: { property: l, depsCount: c, deps: d, missingProperty: u } }) => (0, e._)`{property: ${l},
    missingProperty: ${u},
    depsCount: ${c},
    deps: ${d}}`
      // TODO change to reference
    };
    const s = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: t.error,
      code(l) {
        const [c, d] = i(l);
        o(l, c), a(l, d);
      }
    };
    function i({ schema: l }) {
      const c = {}, d = {};
      for (const u in l) {
        if (u === "__proto__")
          continue;
        const f = Array.isArray(l[u]) ? c : d;
        f[u] = l[u];
      }
      return [c, d];
    }
    function o(l, c = l.schema) {
      const { gen: d, data: u, it: f } = l;
      if (Object.keys(c).length === 0)
        return;
      const p = d.let("missing");
      for (const b in c) {
        const g = c[b];
        if (g.length === 0)
          continue;
        const m = (0, n.propertyInData)(d, u, b, f.opts.ownProperties);
        l.setParams({
          property: b,
          depsCount: g.length,
          deps: g.join(", ")
        }), f.allErrors ? d.if(m, () => {
          for (const w of g)
            (0, n.checkReportMissingProp)(l, w);
        }) : (d.if((0, e._)`${m} && (${(0, n.checkMissingProp)(l, g, p)})`), (0, n.reportMissingProp)(l, p), d.else());
      }
    }
    t.validatePropertyDeps = o;
    function a(l, c = l.schema) {
      const { gen: d, data: u, keyword: f, it: p } = l, b = d.name("valid");
      for (const g in c)
        (0, r.alwaysValidSchema)(p, c[g]) || (d.if(
          (0, n.propertyInData)(d, u, g, p.opts.ownProperties),
          () => {
            const m = l.subschema({ keyword: f, schemaProp: g }, b);
            l.mergeValidEvaluated(m, b);
          },
          () => d.var(b, !0)
          // TODO var
        ), l.ok(b));
    }
    t.validateSchemaDeps = a, t.default = s;
  })(Qo)), Qo;
}
var Ys = {}, _u;
function ay() {
  if (_u) return Ys;
  _u = 1, Object.defineProperty(Ys, "__esModule", { value: !0 });
  const t = fe(), e = ge(), n = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: s }) => (0, t._)`{propertyName: ${s.propertyName}}`
    },
    code(s) {
      const { gen: i, schema: o, data: a, it: l } = s;
      if ((0, e.alwaysValidSchema)(l, o))
        return;
      const c = i.name("valid");
      i.forIn("key", a, (d) => {
        s.setParams({ propertyName: d }), s.subschema({
          keyword: "propertyNames",
          data: d,
          dataTypes: ["string"],
          propertyName: d,
          compositeRule: !0
        }, c), i.if((0, t.not)(c), () => {
          s.error(!0), l.allErrors || i.break();
        });
      }), s.ok(c);
    }
  };
  return Ys.default = n, Ys;
}
var Qs = {}, Eu;
function rh() {
  if (Eu) return Qs;
  Eu = 1, Object.defineProperty(Qs, "__esModule", { value: !0 });
  const t = It(), e = fe(), r = ar(), n = ge(), i = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: o }) => (0, e._)`{additionalProperty: ${o.additionalProperty}}`
    },
    code(o) {
      const { gen: a, schema: l, parentSchema: c, data: d, errsCount: u, it: f } = o;
      if (!u)
        throw new Error("ajv implementation error");
      const { allErrors: p, opts: b } = f;
      if (f.props = !0, b.removeAdditional !== "all" && (0, n.alwaysValidSchema)(f, l))
        return;
      const g = (0, t.allSchemaProperties)(c.properties), m = (0, t.allSchemaProperties)(c.patternProperties);
      w(), o.ok((0, e._)`${u} === ${r.default.errors}`);
      function w() {
        a.forIn("key", d, (x) => {
          !g.length && !m.length ? k(x) : a.if(h(x), () => k(x));
        });
      }
      function h(x) {
        let S;
        if (g.length > 8) {
          const _ = (0, n.schemaRefOrVal)(f, c.properties, "properties");
          S = (0, t.isOwnProperty)(a, _, x);
        } else g.length ? S = (0, e.or)(...g.map((_) => (0, e._)`${x} === ${_}`)) : S = e.nil;
        return m.length && (S = (0, e.or)(S, ...m.map((_) => (0, e._)`${(0, t.usePattern)(o, _)}.test(${x})`))), (0, e.not)(S);
      }
      function y(x) {
        a.code((0, e._)`delete ${d}[${x}]`);
      }
      function k(x) {
        if (b.removeAdditional === "all" || b.removeAdditional && l === !1) {
          y(x);
          return;
        }
        if (l === !1) {
          o.setParams({ additionalProperty: x }), o.error(), p || a.break();
          return;
        }
        if (typeof l == "object" && !(0, n.alwaysValidSchema)(f, l)) {
          const S = a.name("valid");
          b.removeAdditional === "failing" ? (v(x, S, !1), a.if((0, e.not)(S), () => {
            o.reset(), y(x);
          })) : (v(x, S), p || a.if((0, e.not)(S), () => a.break()));
        }
      }
      function v(x, S, _) {
        const T = {
          keyword: "additionalProperties",
          dataProp: x,
          dataPropType: n.Type.Str
        };
        _ === !1 && Object.assign(T, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), o.subschema(T, S);
      }
    }
  };
  return Qs.default = i, Qs;
}
var Xs = {}, $u;
function ly() {
  if ($u) return Xs;
  $u = 1, Object.defineProperty(Xs, "__esModule", { value: !0 });
  const t = uo(), e = It(), r = ge(), n = rh(), s = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: o, schema: a, parentSchema: l, data: c, it: d } = i;
      d.opts.removeAdditional === "all" && l.additionalProperties === void 0 && n.default.code(new t.KeywordCxt(d, n.default, "additionalProperties"));
      const u = (0, e.allSchemaProperties)(a);
      for (const m of u)
        d.definedProperties.add(m);
      d.opts.unevaluated && u.length && d.props !== !0 && (d.props = r.mergeEvaluated.props(o, (0, r.toHash)(u), d.props));
      const f = u.filter((m) => !(0, r.alwaysValidSchema)(d, a[m]));
      if (f.length === 0)
        return;
      const p = o.name("valid");
      for (const m of f)
        b(m) ? g(m) : (o.if((0, e.propertyInData)(o, c, m, d.opts.ownProperties)), g(m), d.allErrors || o.else().var(p, !0), o.endIf()), i.it.definedProperties.add(m), i.ok(p);
      function b(m) {
        return d.opts.useDefaults && !d.compositeRule && a[m].default !== void 0;
      }
      function g(m) {
        i.subschema({
          keyword: "properties",
          schemaProp: m,
          dataProp: m
        }, p);
      }
    }
  };
  return Xs.default = s, Xs;
}
var Zs = {}, Au;
function cy() {
  if (Au) return Zs;
  Au = 1, Object.defineProperty(Zs, "__esModule", { value: !0 });
  const t = It(), e = fe(), r = ge(), n = ge(), s = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(i) {
      const { gen: o, schema: a, data: l, parentSchema: c, it: d } = i, { opts: u } = d, f = (0, t.allSchemaProperties)(a), p = f.filter((k) => (0, r.alwaysValidSchema)(d, a[k]));
      if (f.length === 0 || p.length === f.length && (!d.opts.unevaluated || d.props === !0))
        return;
      const b = u.strictSchema && !u.allowMatchingProperties && c.properties, g = o.name("valid");
      d.props !== !0 && !(d.props instanceof e.Name) && (d.props = (0, n.evaluatedPropsToName)(o, d.props));
      const { props: m } = d;
      w();
      function w() {
        for (const k of f)
          b && h(k), d.allErrors ? y(k) : (o.var(g, !0), y(k), o.if(g));
      }
      function h(k) {
        for (const v in b)
          new RegExp(k).test(v) && (0, r.checkStrictMode)(d, `property ${v} matches pattern ${k} (use allowMatchingProperties)`);
      }
      function y(k) {
        o.forIn("key", l, (v) => {
          o.if((0, e._)`${(0, t.usePattern)(i, k)}.test(${v})`, () => {
            const x = p.includes(k);
            x || i.subschema({
              keyword: "patternProperties",
              schemaProp: k,
              dataProp: v,
              dataPropType: n.Type.Str
            }, g), d.opts.unevaluated && m !== !0 ? o.assign((0, e._)`${m}[${v}]`, !0) : !x && !d.allErrors && o.if((0, e.not)(g), () => o.break());
          });
        });
      }
    }
  };
  return Zs.default = s, Zs;
}
var ei = {}, Tu;
function uy() {
  if (Tu) return ei;
  Tu = 1, Object.defineProperty(ei, "__esModule", { value: !0 });
  const t = ge(), e = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(r) {
      const { gen: n, schema: s, it: i } = r;
      if ((0, t.alwaysValidSchema)(i, s)) {
        r.fail();
        return;
      }
      const o = n.name("valid");
      r.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, o), r.failResult(o, () => r.reset(), () => r.error());
    },
    error: { message: "must NOT be valid" }
  };
  return ei.default = e, ei;
}
var ti = {}, Ou;
function dy() {
  if (Ou) return ti;
  Ou = 1, Object.defineProperty(ti, "__esModule", { value: !0 });
  const e = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: It().validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return ti.default = e, ti;
}
var ri = {}, Cu;
function fy() {
  if (Cu) return ri;
  Cu = 1, Object.defineProperty(ri, "__esModule", { value: !0 });
  const t = fe(), e = ge(), n = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: s }) => (0, t._)`{passingSchemas: ${s.passing}}`
    },
    code(s) {
      const { gen: i, schema: o, parentSchema: a, it: l } = s;
      if (!Array.isArray(o))
        throw new Error("ajv implementation error");
      if (l.opts.discriminator && a.discriminator)
        return;
      const c = o, d = i.let("valid", !1), u = i.let("passing", null), f = i.name("_valid");
      s.setParams({ passing: u }), i.block(p), s.result(d, () => s.reset(), () => s.error(!0));
      function p() {
        c.forEach((b, g) => {
          let m;
          (0, e.alwaysValidSchema)(l, b) ? i.var(f, !0) : m = s.subschema({
            keyword: "oneOf",
            schemaProp: g,
            compositeRule: !0
          }, f), g > 0 && i.if((0, t._)`${f} && ${d}`).assign(d, !1).assign(u, (0, t._)`[${u}, ${g}]`).else(), i.if(f, () => {
            i.assign(d, !0), i.assign(u, g), m && s.mergeEvaluated(m, t.Name);
          });
        });
      }
    }
  };
  return ri.default = n, ri;
}
var ni = {}, Nu;
function hy() {
  if (Nu) return ni;
  Nu = 1, Object.defineProperty(ni, "__esModule", { value: !0 });
  const t = ge(), e = {
    keyword: "allOf",
    schemaType: "array",
    code(r) {
      const { gen: n, schema: s, it: i } = r;
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const o = n.name("valid");
      s.forEach((a, l) => {
        if ((0, t.alwaysValidSchema)(i, a))
          return;
        const c = r.subschema({ keyword: "allOf", schemaProp: l }, o);
        r.ok(o), r.mergeEvaluated(c);
      });
    }
  };
  return ni.default = e, ni;
}
var si = {}, Iu;
function py() {
  if (Iu) return si;
  Iu = 1, Object.defineProperty(si, "__esModule", { value: !0 });
  const t = fe(), e = ge(), n = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: i }) => (0, t.str)`must match "${i.ifClause}" schema`,
      params: ({ params: i }) => (0, t._)`{failingKeyword: ${i.ifClause}}`
    },
    code(i) {
      const { gen: o, parentSchema: a, it: l } = i;
      a.then === void 0 && a.else === void 0 && (0, e.checkStrictMode)(l, '"if" without "then" and "else" is ignored');
      const c = s(l, "then"), d = s(l, "else");
      if (!c && !d)
        return;
      const u = o.let("valid", !0), f = o.name("_valid");
      if (p(), i.reset(), c && d) {
        const g = o.let("ifClause");
        i.setParams({ ifClause: g }), o.if(f, b("then", g), b("else", g));
      } else c ? o.if(f, b("then")) : o.if((0, t.not)(f), b("else"));
      i.pass(u, () => i.error(!0));
      function p() {
        const g = i.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, f);
        i.mergeEvaluated(g);
      }
      function b(g, m) {
        return () => {
          const w = i.subschema({ keyword: g }, f);
          o.assign(u, f), i.mergeValidEvaluated(w, u), m ? o.assign(m, (0, t._)`${g}`) : i.setParams({ ifClause: g });
        };
      }
    }
  };
  function s(i, o) {
    const a = i.schema[o];
    return a !== void 0 && !(0, e.alwaysValidSchema)(i, a);
  }
  return si.default = n, si;
}
var ii = {}, Pu;
function my() {
  if (Pu) return ii;
  Pu = 1, Object.defineProperty(ii, "__esModule", { value: !0 });
  const t = ge(), e = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: r, parentSchema: n, it: s }) {
      n.if === void 0 && (0, t.checkStrictMode)(s, `"${r}" without "if" is ignored`);
    }
  };
  return ii.default = e, ii;
}
var Lu;
function gy() {
  if (Lu) return Hs;
  Lu = 1, Object.defineProperty(Hs, "__esModule", { value: !0 });
  const t = eh(), e = ny(), r = th(), n = sy(), s = iy(), i = oy(), o = ay(), a = rh(), l = ly(), c = cy(), d = uy(), u = dy(), f = fy(), p = hy(), b = py(), g = my();
  function m(w = !1) {
    const h = [
      // any
      d.default,
      u.default,
      f.default,
      p.default,
      b.default,
      g.default,
      // object
      o.default,
      a.default,
      i.default,
      l.default,
      c.default
    ];
    return w ? h.push(e.default, n.default) : h.push(t.default, r.default), h.push(s.default), h;
  }
  return Hs.default = m, Hs;
}
var oi = {}, ai = {}, Ru;
function yy() {
  if (Ru) return ai;
  Ru = 1, Object.defineProperty(ai, "__esModule", { value: !0 });
  const t = fe(), r = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: n }) => (0, t.str)`must match format "${n}"`,
      params: ({ schemaCode: n }) => (0, t._)`{format: ${n}}`
    },
    code(n, s) {
      const { gen: i, data: o, $data: a, schema: l, schemaCode: c, it: d } = n, { opts: u, errSchemaPath: f, schemaEnv: p, self: b } = d;
      if (!u.validateFormats)
        return;
      a ? g() : m();
      function g() {
        const w = i.scopeValue("formats", {
          ref: b.formats,
          code: u.code.formats
        }), h = i.const("fDef", (0, t._)`${w}[${c}]`), y = i.let("fType"), k = i.let("format");
        i.if((0, t._)`typeof ${h} == "object" && !(${h} instanceof RegExp)`, () => i.assign(y, (0, t._)`${h}.type || "string"`).assign(k, (0, t._)`${h}.validate`), () => i.assign(y, (0, t._)`"string"`).assign(k, h)), n.fail$data((0, t.or)(v(), x()));
        function v() {
          return u.strictSchema === !1 ? t.nil : (0, t._)`${c} && !${k}`;
        }
        function x() {
          const S = p.$async ? (0, t._)`(${h}.async ? await ${k}(${o}) : ${k}(${o}))` : (0, t._)`${k}(${o})`, _ = (0, t._)`(typeof ${k} == "function" ? ${S} : ${k}.test(${o}))`;
          return (0, t._)`${k} && ${k} !== true && ${y} === ${s} && !${_}`;
        }
      }
      function m() {
        const w = b.formats[l];
        if (!w) {
          v();
          return;
        }
        if (w === !0)
          return;
        const [h, y, k] = x(w);
        h === s && n.pass(S());
        function v() {
          if (u.strictSchema === !1) {
            b.logger.warn(_());
            return;
          }
          throw new Error(_());
          function _() {
            return `unknown format "${l}" ignored in schema at path "${f}"`;
          }
        }
        function x(_) {
          const T = _ instanceof RegExp ? (0, t.regexpCode)(_) : u.code.formats ? (0, t._)`${u.code.formats}${(0, t.getProperty)(l)}` : void 0, P = i.scopeValue("formats", { key: l, ref: _, code: T });
          return typeof _ == "object" && !(_ instanceof RegExp) ? [_.type || "string", _.validate, (0, t._)`${P}.validate`] : ["string", _, P];
        }
        function S() {
          if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
            if (!p.$async)
              throw new Error("async format in sync schema");
            return (0, t._)`await ${k}(${o})`;
          }
          return typeof y == "function" ? (0, t._)`${k}(${o})` : (0, t._)`${k}.test(${o})`;
        }
      }
    }
  };
  return ai.default = r, ai;
}
var ju;
function by() {
  if (ju) return oi;
  ju = 1, Object.defineProperty(oi, "__esModule", { value: !0 });
  const e = [yy().default];
  return oi.default = e, oi;
}
var pr = {}, Mu;
function vy() {
  return Mu || (Mu = 1, Object.defineProperty(pr, "__esModule", { value: !0 }), pr.contentVocabulary = pr.metadataVocabulary = void 0, pr.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], pr.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), pr;
}
var Du;
function wy() {
  if (Du) return Cs;
  Du = 1, Object.defineProperty(Cs, "__esModule", { value: !0 });
  const t = z0(), e = ry(), r = gy(), n = by(), s = vy(), i = [
    t.default,
    e.default,
    (0, r.default)(),
    n.default,
    s.metadataVocabulary,
    s.contentVocabulary
  ];
  return Cs.default = i, Cs;
}
var li = {}, Sn = {}, Bu;
function ky() {
  if (Bu) return Sn;
  Bu = 1, Object.defineProperty(Sn, "__esModule", { value: !0 }), Sn.DiscrError = void 0;
  var t;
  return (function(e) {
    e.Tag = "tag", e.Mapping = "mapping";
  })(t || (Sn.DiscrError = t = {})), Sn;
}
var qu;
function xy() {
  if (qu) return li;
  qu = 1, Object.defineProperty(li, "__esModule", { value: !0 });
  const t = fe(), e = ky(), r = bl(), n = fo(), s = ge(), o = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: a, tagName: l } }) => a === e.DiscrError.Tag ? `tag "${l}" must be string` : `value of tag "${l}" must be in oneOf`,
      params: ({ params: { discrError: a, tag: l, tagName: c } }) => (0, t._)`{error: ${a}, tag: ${c}, tagValue: ${l}}`
    },
    code(a) {
      const { gen: l, data: c, schema: d, parentSchema: u, it: f } = a, { oneOf: p } = u;
      if (!f.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const b = d.propertyName;
      if (typeof b != "string")
        throw new Error("discriminator: requires propertyName");
      if (d.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!p)
        throw new Error("discriminator: requires oneOf keyword");
      const g = l.let("valid", !1), m = l.const("tag", (0, t._)`${c}${(0, t.getProperty)(b)}`);
      l.if((0, t._)`typeof ${m} == "string"`, () => w(), () => a.error(!1, { discrError: e.DiscrError.Tag, tag: m, tagName: b })), a.ok(g);
      function w() {
        const k = y();
        l.if(!1);
        for (const v in k)
          l.elseIf((0, t._)`${m} === ${v}`), l.assign(g, h(k[v]));
        l.else(), a.error(!1, { discrError: e.DiscrError.Mapping, tag: m, tagName: b }), l.endIf();
      }
      function h(k) {
        const v = l.name("valid"), x = a.subschema({ keyword: "oneOf", schemaProp: k }, v);
        return a.mergeEvaluated(x, t.Name), v;
      }
      function y() {
        var k;
        const v = {}, x = _(u);
        let S = !0;
        for (let R = 0; R < p.length; R++) {
          let D = p[R];
          if (D?.$ref && !(0, s.schemaHasRulesButRef)(D, f.self.RULES)) {
            const Y = D.$ref;
            if (D = r.resolveRef.call(f.self, f.schemaEnv.root, f.baseId, Y), D instanceof r.SchemaEnv && (D = D.schema), D === void 0)
              throw new n.default(f.opts.uriResolver, f.baseId, Y);
          }
          const U = (k = D?.properties) === null || k === void 0 ? void 0 : k[b];
          if (typeof U != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${b}"`);
          S = S && (x || _(D)), T(U, R);
        }
        if (!S)
          throw new Error(`discriminator: "${b}" must be required`);
        return v;
        function _({ required: R }) {
          return Array.isArray(R) && R.includes(b);
        }
        function T(R, D) {
          if (R.const)
            P(R.const, D);
          else if (R.enum)
            for (const U of R.enum)
              P(U, D);
          else
            throw new Error(`discriminator: "properties/${b}" must have "const" or "enum"`);
        }
        function P(R, D) {
          if (typeof R != "string" || R in v)
            throw new Error(`discriminator: "${b}" values must be unique strings`);
          v[R] = D;
        }
      }
    }
  };
  return li.default = o, li;
}
const Sy = "http://json-schema.org/draft-07/schema#", _y = "http://json-schema.org/draft-07/schema#", Ey = "Core schema meta-schema", $y = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, Ay = ["object", "boolean"], Ty = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, Oy = {
  $schema: Sy,
  $id: _y,
  title: Ey,
  definitions: $y,
  type: Ay,
  properties: Ty,
  default: !0
};
var Fu;
function Cy() {
  return Fu || (Fu = 1, (function(t, e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.MissingRefError = e.ValidationError = e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = e.Ajv = void 0;
    const r = F0(), n = wy(), s = xy(), i = Oy, o = ["/properties"], a = "http://json-schema.org/draft-07/schema";
    class l extends r.default {
      _addVocabularies() {
        super._addVocabularies(), n.default.forEach((b) => this.addVocabulary(b)), this.opts.discriminator && this.addKeyword(s.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const b = this.opts.$data ? this.$dataMetaSchema(i, o) : i;
        this.addMetaSchema(b, a, !1), this.refs["http://json-schema.org/schema"] = a;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
      }
    }
    e.Ajv = l, t.exports = e = l, t.exports.Ajv = l, Object.defineProperty(e, "__esModule", { value: !0 }), e.default = l;
    var c = uo();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return c.KeywordCxt;
    } });
    var d = fe();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return d._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return d.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return d.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return d.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return d.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return d.CodeGen;
    } });
    var u = yl();
    Object.defineProperty(e, "ValidationError", { enumerable: !0, get: function() {
      return u.default;
    } });
    var f = fo();
    Object.defineProperty(e, "MissingRefError", { enumerable: !0, get: function() {
      return f.default;
    } });
  })(Es, Es.exports)), Es.exports;
}
var Ny = Cy();
const Iy = /* @__PURE__ */ E0(Ny);
let Xo = null;
function Py() {
  return Xo || (Xo = new Iy({
    allErrors: !0,
    strict: !1,
    validateFormats: !0
  })), Xo;
}
function Ly(t) {
  const e = t.instancePath || "/", r = t.keyword, n = t.params;
  let s = t.message || "Invalid value";
  switch (r) {
    case "type":
      s = `must be ${n.type}`;
      break;
    case "minLength":
      s = `must be at least ${n.limit} characters`;
      break;
    case "maxLength":
      s = `must be at most ${n.limit} characters`;
      break;
    case "minimum":
      s = `must be >= ${n.limit}`;
      break;
    case "maximum":
      s = `must be <= ${n.limit}`;
      break;
    case "exclusiveMinimum":
      s = `must be > ${n.limit}`;
      break;
    case "exclusiveMaximum":
      s = `must be < ${n.limit}`;
      break;
    case "multipleOf":
      s = `must be a multiple of ${n.multipleOf}`;
      break;
    case "pattern":
      s = `must match pattern ${n.pattern}`;
      break;
    case "enum":
      s = `must be one of: ${n.allowedValues.join(", ")}`;
      break;
    case "const":
      s = `must be equal to ${JSON.stringify(n.allowedValue)}`;
      break;
    case "minItems":
      s = `must have at least ${n.limit} items`;
      break;
    case "maxItems":
      s = `must have at most ${n.limit} items`;
      break;
    case "uniqueItems":
      s = "must have unique items";
      break;
    case "required":
      s = `missing required property: ${n.missingProperty}`;
      break;
    case "format":
      s = `must be a valid ${n.format}`;
      break;
  }
  return {
    path: e,
    message: s,
    keyword: r,
    params: n
  };
}
function Ry(t, e) {
  const n = Py().compile(e);
  return n(t) ? { valid: !0, errors: [] } : { valid: !1, errors: (n.errors || []).map(Ly) };
}
function jy(t, e) {
  if (t === "")
    return;
  switch (e.type || "string") {
    case "number":
      return Number(t);
    case "integer":
      return Number.parseInt(t, 10);
    case "boolean":
      return t === "true";
    case "array":
      try {
        return JSON.parse(t);
      } catch {
        return t;
      }
    case "object":
      try {
        return JSON.parse(t);
      } catch {
        return t;
      }
    case "null":
      return null;
    default:
      return t;
  }
}
function My(t, e, r) {
  if (t === "" || t === void 0 || t === null)
    return r ? {
      valid: !1,
      errors: [
        {
          path: "/",
          message: "this field is required",
          keyword: "required",
          params: {}
        }
      ]
    } : { valid: !0, errors: [] };
  const n = jy(t, e);
  return (e.type === "number" || e.type === "integer") && Number.isNaN(n) ? {
    valid: !1,
    errors: [
      {
        path: "/",
        message: "must be a valid number",
        keyword: "type",
        params: { type: e.type }
      }
    ]
  } : Ry(n, e);
}
const Aa = /* @__PURE__ */ Symbol("store-raw"), Zr = /* @__PURE__ */ Symbol("store-node"), Gt = /* @__PURE__ */ Symbol("store-has"), nh = /* @__PURE__ */ Symbol("store-self");
function sh(t) {
  let e = t[$r];
  if (!e && (Object.defineProperty(t, $r, {
    value: e = new Proxy(t, qy)
  }), !Array.isArray(t))) {
    const r = Object.keys(t), n = Object.getOwnPropertyDescriptors(t);
    for (let s = 0, i = r.length; s < i; s++) {
      const o = r[s];
      n[o].get && Object.defineProperty(t, o, {
        enumerable: n[o].enumerable,
        get: n[o].get.bind(e)
      });
    }
  }
  return e;
}
function Di(t) {
  let e;
  return t != null && typeof t == "object" && (t[$r] || !(e = Object.getPrototypeOf(t)) || e === Object.prototype || Array.isArray(t));
}
function on(t, e = /* @__PURE__ */ new Set()) {
  let r, n, s, i;
  if (r = t != null && t[Aa]) return r;
  if (!Di(t) || e.has(t)) return t;
  if (Array.isArray(t)) {
    Object.isFrozen(t) ? t = t.slice(0) : e.add(t);
    for (let o = 0, a = t.length; o < a; o++)
      s = t[o], (n = on(s, e)) !== s && (t[o] = n);
  } else {
    Object.isFrozen(t) ? t = Object.assign({}, t) : e.add(t);
    const o = Object.keys(t), a = Object.getOwnPropertyDescriptors(t);
    for (let l = 0, c = o.length; l < c; l++)
      i = o[l], !a[i].get && (s = t[i], (n = on(s, e)) !== s && (t[i] = n));
  }
  return t;
}
function Bi(t, e) {
  let r = t[e];
  return r || Object.defineProperty(t, e, {
    value: r = /* @__PURE__ */ Object.create(null)
  }), r;
}
function Yn(t, e, r) {
  if (t[e]) return t[e];
  const [n, s] = Q(r, {
    equals: !1,
    internal: !0
  });
  return n.$ = s, t[e] = n;
}
function Dy(t, e) {
  const r = Reflect.getOwnPropertyDescriptor(t, e);
  return !r || r.get || !r.configurable || e === $r || e === Zr || (delete r.value, delete r.writable, r.get = () => t[$r][e]), r;
}
function ih(t) {
  ba() && Yn(Bi(t, Zr), nh)();
}
function By(t) {
  return ih(t), Reflect.ownKeys(t);
}
const qy = {
  get(t, e, r) {
    if (e === Aa) return t;
    if (e === $r) return r;
    if (e === ya)
      return ih(t), r;
    const n = Bi(t, Zr), s = n[e];
    let i = s ? s() : t[e];
    if (e === Zr || e === Gt || e === "__proto__") return i;
    if (!s) {
      const o = Object.getOwnPropertyDescriptor(t, e);
      ba() && (typeof i != "function" || t.hasOwnProperty(e)) && !(o && o.get) && (i = Yn(n, e, i)());
    }
    return Di(i) ? sh(i) : i;
  },
  has(t, e) {
    return e === Aa || e === $r || e === ya || e === Zr || e === Gt || e === "__proto__" ? !0 : (ba() && Yn(Bi(t, Gt), e)(), e in t);
  },
  set() {
    return !0;
  },
  deleteProperty() {
    return !0;
  },
  ownKeys: By,
  getOwnPropertyDescriptor: Dy
};
function qi(t, e, r, n = !1) {
  if (!n && t[e] === r) return;
  const s = t[e], i = t.length;
  r === void 0 ? (delete t[e], t[Gt] && t[Gt][e] && s !== void 0 && t[Gt][e].$()) : (t[e] = r, t[Gt] && t[Gt][e] && s === void 0 && t[Gt][e].$());
  let o = Bi(t, Zr), a;
  if ((a = Yn(o, e, s)) && a.$(() => r), Array.isArray(t) && t.length !== i) {
    for (let l = t.length; l < i; l++) (a = o[l]) && a.$();
    (a = Yn(o, "length", i)) && a.$(t.length);
  }
  (a = o[nh]) && a.$();
}
function oh(t, e) {
  const r = Object.keys(e);
  for (let n = 0; n < r.length; n += 1) {
    const s = r[n];
    qi(t, s, e[s]);
  }
}
function Fy(t, e) {
  if (typeof e == "function" && (e = e(t)), e = on(e), Array.isArray(e)) {
    if (t === e) return;
    let r = 0, n = e.length;
    for (; r < n; r++) {
      const s = e[r];
      t[r] !== s && qi(t, r, s);
    }
    qi(t, "length", n);
  } else oh(t, e);
}
function Rn(t, e, r = []) {
  let n, s = t;
  if (e.length > 1) {
    n = e.shift();
    const o = typeof n, a = Array.isArray(t);
    if (Array.isArray(n)) {
      for (let l = 0; l < n.length; l++)
        Rn(t, [n[l]].concat(e), r);
      return;
    } else if (a && o === "function") {
      for (let l = 0; l < t.length; l++)
        n(t[l], l) && Rn(t, [l].concat(e), r);
      return;
    } else if (a && o === "object") {
      const {
        from: l = 0,
        to: c = t.length - 1,
        by: d = 1
      } = n;
      for (let u = l; u <= c; u += d)
        Rn(t, [u].concat(e), r);
      return;
    } else if (e.length > 1) {
      Rn(t[n], e, [n].concat(r));
      return;
    }
    s = t[n], r = [n].concat(r);
  }
  let i = e[0];
  typeof i == "function" && (i = i(s, r), i === s) || n === void 0 && i == null || (i = on(i), n === void 0 || Di(s) && Di(i) && !Array.isArray(i) ? oh(s, i) : qi(t, n, i));
}
function wl(...[t, e]) {
  const r = on(t || {}), n = Array.isArray(r), s = sh(r);
  function i(...o) {
    Zp(() => {
      n && o.length === 1 ? Fy(r, o[0]) : Rn(r, o);
    });
  }
  return [s, i];
}
function ah() {
  return () => document.documentElement.classList.contains("dark") || document.querySelector(".dark") !== null;
}
const Ta = (t, e) => e.some((r) => t instanceof r);
let Uu, Ku;
function Uy() {
  return Uu || (Uu = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function Ky() {
  return Ku || (Ku = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const Oa = /* @__PURE__ */ new WeakMap(), Zo = /* @__PURE__ */ new WeakMap(), ho = /* @__PURE__ */ new WeakMap();
function zy(t) {
  const e = new Promise((r, n) => {
    const s = () => {
      t.removeEventListener("success", i), t.removeEventListener("error", o);
    }, i = () => {
      r(_r(t.result)), s();
    }, o = () => {
      n(t.error), s();
    };
    t.addEventListener("success", i), t.addEventListener("error", o);
  });
  return ho.set(e, t), e;
}
function Vy(t) {
  if (Oa.has(t))
    return;
  const e = new Promise((r, n) => {
    const s = () => {
      t.removeEventListener("complete", i), t.removeEventListener("error", o), t.removeEventListener("abort", o);
    }, i = () => {
      r(), s();
    }, o = () => {
      n(t.error || new DOMException("AbortError", "AbortError")), s();
    };
    t.addEventListener("complete", i), t.addEventListener("error", o), t.addEventListener("abort", o);
  });
  Oa.set(t, e);
}
let Ca = {
  get(t, e, r) {
    if (t instanceof IDBTransaction) {
      if (e === "done")
        return Oa.get(t);
      if (e === "store")
        return r.objectStoreNames[1] ? void 0 : r.objectStore(r.objectStoreNames[0]);
    }
    return _r(t[e]);
  },
  set(t, e, r) {
    return t[e] = r, !0;
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in t;
  }
};
function lh(t) {
  Ca = t(Ca);
}
function Hy(t) {
  return Ky().includes(t) ? function(...e) {
    return t.apply(Na(this), e), _r(this.request);
  } : function(...e) {
    return _r(t.apply(Na(this), e));
  };
}
function Jy(t) {
  return typeof t == "function" ? Hy(t) : (t instanceof IDBTransaction && Vy(t), Ta(t, Uy()) ? new Proxy(t, Ca) : t);
}
function _r(t) {
  if (t instanceof IDBRequest)
    return zy(t);
  if (Zo.has(t))
    return Zo.get(t);
  const e = Jy(t);
  return e !== t && (Zo.set(t, e), ho.set(e, t)), e;
}
const Na = (t) => ho.get(t);
function Wy(t, e, { blocked: r, upgrade: n, blocking: s, terminated: i } = {}) {
  const o = indexedDB.open(t, e), a = _r(o);
  return n && o.addEventListener("upgradeneeded", (l) => {
    n(_r(o.result), l.oldVersion, l.newVersion, _r(o.transaction), l);
  }), r && o.addEventListener("blocked", (l) => r(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    l.oldVersion,
    l.newVersion,
    l
  )), a.then((l) => {
    i && l.addEventListener("close", () => i()), s && l.addEventListener("versionchange", (c) => s(c.oldVersion, c.newVersion, c));
  }).catch(() => {
  }), a;
}
const Gy = ["get", "getKey", "getAll", "getAllKeys", "count"], Yy = ["put", "add", "delete", "clear"], ea = /* @__PURE__ */ new Map();
function zu(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == "string"))
    return;
  if (ea.get(e))
    return ea.get(e);
  const r = e.replace(/FromIndex$/, ""), n = e !== r, s = Yy.includes(r);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(r in (n ? IDBIndex : IDBObjectStore).prototype) || !(s || Gy.includes(r))
  )
    return;
  const i = async function(o, ...a) {
    const l = this.transaction(o, s ? "readwrite" : "readonly");
    let c = l.store;
    return n && (c = c.index(a.shift())), (await Promise.all([
      c[r](...a),
      s && l.done
    ]))[0];
  };
  return ea.set(e, i), i;
}
lh((t) => ({
  ...t,
  get: (e, r, n) => zu(e, r) || t.get(e, r, n),
  has: (e, r) => !!zu(e, r) || t.has(e, r)
}));
const Qy = ["continue", "continuePrimaryKey", "advance"], Vu = {}, Ia = /* @__PURE__ */ new WeakMap(), ch = /* @__PURE__ */ new WeakMap(), Xy = {
  get(t, e) {
    if (!Qy.includes(e))
      return t[e];
    let r = Vu[e];
    return r || (r = Vu[e] = function(...n) {
      Ia.set(this, ch.get(this)[e](...n));
    }), r;
  }
};
async function* Zy(...t) {
  let e = this;
  if (e instanceof IDBCursor || (e = await e.openCursor(...t)), !e)
    return;
  e = e;
  const r = new Proxy(e, Xy);
  for (ch.set(r, e), ho.set(r, Na(e)); e; )
    yield r, e = await (Ia.get(r) || e.continue()), Ia.delete(r);
}
function Hu(t, e) {
  return e === Symbol.asyncIterator && Ta(t, [IDBIndex, IDBObjectStore, IDBCursor]) || e === "iterate" && Ta(t, [IDBIndex, IDBObjectStore]);
}
lh((t) => ({
  ...t,
  get(e, r, n) {
    return Hu(e, r) ? Zy : t.get(e, r, n);
  },
  has(e, r) {
    return Hu(e, r) || t.has(e, r);
  }
}));
const eb = "wti-storage", tb = 1, rb = typeof window < "u" && typeof indexedDB < "u";
async function nb() {
  return Wy(eb, tb, {
    upgrade(t) {
      t.objectStoreNames.contains("auth") || t.createObjectStore("auth", { keyPath: "id" }), t.objectStoreNames.contains("history") || t.createObjectStore("history", { keyPath: "id" }).createIndex("by-timestamp", "timestamp");
    }
  });
}
let ci = null;
function mr() {
  return rb ? (ci || (ci = nb().catch((t) => {
    throw ci = null, t;
  })), ci) : Promise.reject(new Error("IndexedDB is not available"));
}
let Ju = !1;
function gr(t, e) {
  Ju || (console.warn(
    `[WTI Storage] IndexedDB ${t} failed. App will continue without persistence.`,
    e
  ), Ju = !0);
}
const sb = {
  async get(t, e) {
    try {
      return await (await mr()).get(t, e) ?? null;
    } catch (r) {
      return gr("get", r), null;
    }
  },
  async set(t, e, r) {
    try {
      const n = await mr(), s = { ...r, id: e };
      await n.put(t, s);
    } catch (n) {
      gr("set", n);
    }
  },
  async remove(t, e) {
    try {
      await (await mr()).delete(t, e);
    } catch (r) {
      gr("remove", r);
    }
  },
  async clear(t) {
    try {
      await (await mr()).clear(t);
    } catch (e) {
      gr("clear", e);
    }
  },
  async getPage(t, e) {
    try {
      const r = await mr(), { limit: n, offset: s = 0, index: i, direction: o = "prev" } = e, a = r.transaction(t, "readonly"), l = a.objectStore(t), c = i ? l.index(i) : l, d = [];
      let u = 0, f = await c.openCursor(null, o);
      for (; f && d.length < n; )
        u < s ? u++ : d.push(f.value), f = await f.continue();
      return await a.done, d;
    } catch (r) {
      return gr("getPage", r), [];
    }
  },
  async count(t) {
    try {
      return (await mr()).count(t);
    } catch (e) {
      return gr("count", e), 0;
    }
  },
  async getAll(t) {
    try {
      return await (await mr()).getAll(t);
    } catch (e) {
      return gr("getAll", e), [];
    }
  }
}, uh = typeof window < "u" && typeof localStorage < "u";
function kl(t, e) {
  if (!uh)
    return e;
  try {
    const r = localStorage.getItem(t);
    return r === null ? e : JSON.parse(r);
  } catch {
    return e;
  }
}
function xl(t, e) {
  if (!uh)
    return !1;
  try {
    return localStorage.setItem(t, JSON.stringify(e)), !0;
  } catch {
    return !1;
  }
}
const Ke = sb, ib = {
  common: {
    send: "Send",
    cancel: "Cancel",
    copy: "Copy",
    copied: "Copied!",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    close: "Close",
    search: "Search...",
    loading: "Loading...",
    error: "Error",
    noResults: "No results found",
    required: "required",
    optional: "optional",
    deprecated: "deprecated",
    tryIt: "Try it out",
    clear: "Clear"
  },
  operations: {
    parameters: "Parameters",
    requestBody: "Request Body",
    responses: "Responses",
    headers: "Header",
    query: "Query",
    path: "Path",
    cookie: "Cookie",
    noParameters: "No parameters",
    noRequestBody: "No request body",
    jsonMode: "JSON",
    formMode: "Form"
  },
  response: {
    status: "Status",
    time: "Time",
    size: "Size",
    body: "Body",
    headers: "Headers",
    noResponse: 'No response yet. Click "Send" to execute the request.'
  },
  auth: {
    title: "Authorization",
    apiKey: "API Key",
    bearer: "Bearer Token",
    basic: "Basic Auth",
    oauth2: "OAuth 2.0",
    openid: "OpenID",
    username: "Username",
    password: "Password",
    token: "Token",
    authorize: "Authorize",
    logout: "Logout",
    configured: "Configured",
    notConfigured: "Not configured",
    issuerUrl: "Issuer URL",
    clientId: "Client ID",
    clientSecret: "Client Secret",
    clientSecretPlaceholder: "Optional - for confidential clients",
    scopes: "Scopes",
    accessToken: "Access Token",
    accessTokenPlaceholder: "Paste access token from OIDC flow",
    idToken: "ID Token",
    idTokenPlaceholder: "Paste ID token from OIDC flow",
    configure: "Configure",
    setTokens: "Set Tokens",
    editConfig: "Edit",
    openidConfigured: "OpenID Connect configured",
    openidTokenHint: "Paste tokens obtained from your identity provider after completing the OIDC flow",
    tokensSet: "Tokens are configured and will be used for requests",
    refreshToken: "Refresh Token",
    refreshTokenPlaceholder: "Paste refresh token for auto-refresh",
    refreshTokenHint: "Optional - enables automatic token refresh",
    expiresIn: "Expires In (seconds)",
    expiresInHint: "Token lifetime in seconds from now",
    tokenExpired: "Token has expired",
    tokenExpiringSoon: "Token expires in {minutes} minutes",
    tokenExpiresIn: "Token expires in {minutes} minutes",
    tokenExpiresInHours: "Token expires in {hours} hours",
    refreshNow: "Refresh Now",
    refreshing: "Refreshing...",
    loginWithOpenId: "Login with OpenID",
    loggingIn: "Redirecting...",
    loggedIn: "Logged in",
    loggedInAs: "Logged in as {username}",
    missingConfig: "Issuer URL and Client ID are required",
    refreshFailed: "Token refresh failed"
  },
  codegen: {
    title: "Code Snippets",
    curl: "cURL",
    curlPreview: "cURL Preview",
    javascript: "JavaScript",
    python: "Python",
    go: "Go"
  },
  history: {
    title: "Request History",
    empty: "No requests yet",
    clearAll: "Clear all",
    confirmClear: "Confirm?",
    replay: "Replay",
    delete: "Delete",
    success: "Success",
    failed: "Failed",
    export: "Export",
    import: "Import",
    navigate: "Navigate",
    justNow: "Just now",
    minutesAgo: "{minutes}m ago",
    hoursAgo: "{hours}h ago",
    daysAgo: "{days}d ago"
  },
  sidebar: {
    allOperations: "All Operations",
    servers: "Servers",
    serverVariables: "Server Variables",
    toggleThemeLight: "Switch to light mode",
    toggleThemeDark: "Switch to dark mode"
  },
  specLoader: {
    title: "Load API Specification",
    subtitle: "Load an OpenAPI specification to explore and test",
    uploadFile: "Upload a file",
    loadFromUrl: "Load from URL",
    load: "Load",
    loading: "Loading...",
    or: "or",
    clickToUpload: "Click to upload",
    orDragDrop: "or drag and drop",
    supportedFormats: "JSON or YAML files (.json, .yaml, .yml)",
    urlRequired: "Please enter a URL",
    loadFailed: "Failed to load specification",
    invalidFileType: "Invalid file type. Please upload a JSON or YAML file.",
    jsonOnly: "Only JSON and YAML files are supported",
    tryExample: "Try an example:"
  },
  commandPalette: {
    placeholder: "Search operations...",
    noResults: "No operations found",
    navigate: "to navigate",
    select: "to select"
  },
  validation: {
    required: "This field is required",
    type: "Must be {type}",
    minLength: "Must be at least {limit} characters",
    maxLength: "Must be at most {limit} characters",
    minimum: "Must be >= {limit}",
    maximum: "Must be <= {limit}",
    exclusiveMinimum: "Must be > {limit}",
    exclusiveMaximum: "Must be < {limit}",
    multipleOf: "Must be a multiple of {value}",
    pattern: "Must match pattern: {pattern}",
    enum: "Must be one of: {values}",
    const: "Must be equal to {value}",
    minItems: "Must have at least {limit} items",
    maxItems: "Must have at most {limit} items",
    uniqueItems: "Must have unique items",
    missingProperty: "Missing required property: {property}",
    format: "Must be a valid {format}",
    invalidNumber: "Must be a valid number"
  }
}, ob = {
  common: {
    send: "Envoyer",
    cancel: "Annuler",
    copy: "Copier",
    copied: "Copie!",
    copyLink: "Copier le lien",
    linkCopied: "Lien copie!",
    close: "Fermer",
    search: "Rechercher...",
    loading: "Chargement...",
    error: "Erreur",
    noResults: "Aucun resultat",
    required: "requis",
    optional: "optionnel",
    deprecated: "obsolete",
    tryIt: "Essayer",
    clear: "Effacer"
  },
  operations: {
    parameters: "Parametres",
    requestBody: "Corps de la requete",
    responses: "Reponses",
    headers: "En-tete",
    query: "Requete",
    path: "Chemin",
    cookie: "Cookie",
    noParameters: "Aucun parametre",
    noRequestBody: "Pas de corps de requete",
    jsonMode: "JSON",
    formMode: "Formulaire"
  },
  response: {
    status: "Statut",
    time: "Temps",
    size: "Taille",
    body: "Corps",
    headers: "En-tetes",
    noResponse: 'Pas encore de reponse. Cliquez sur "Envoyer" pour executer la requete.'
  },
  auth: {
    title: "Autorisation",
    apiKey: "Cle API",
    bearer: "Jeton Bearer",
    basic: "Auth Basique",
    oauth2: "OAuth 2.0",
    openid: "OpenID",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    token: "Jeton",
    authorize: "Autoriser",
    logout: "Deconnexion",
    configured: "Configure",
    notConfigured: "Non configure",
    issuerUrl: "URL Emetteur",
    clientId: "ID Client",
    clientSecret: "Secret Client",
    clientSecretPlaceholder: "Optionnel - pour clients confidentiels",
    scopes: "Portees",
    accessToken: "Jeton d'acces",
    accessTokenPlaceholder: "Collez le jeton d'acces du flux OIDC",
    idToken: "Jeton d'identite",
    idTokenPlaceholder: "Collez le jeton d'identite du flux OIDC",
    configure: "Configurer",
    setTokens: "Definir les jetons",
    editConfig: "Modifier",
    openidConfigured: "OpenID Connect configure",
    openidTokenHint: "Collez les jetons obtenus de votre fournisseur d'identite apres avoir complete le flux OIDC",
    tokensSet: "Les jetons sont configures et seront utilises pour les requetes",
    refreshToken: "Jeton de rafraichissement",
    refreshTokenPlaceholder: "Collez le jeton de rafraichissement",
    refreshTokenHint: "Optionnel - permet le rafraichissement automatique",
    expiresIn: "Expire dans (secondes)",
    expiresInHint: "Duree de vie du jeton en secondes",
    tokenExpired: "Le jeton a expire",
    tokenExpiringSoon: "Le jeton expire dans {minutes} minutes",
    tokenExpiresIn: "Le jeton expire dans {minutes} minutes",
    tokenExpiresInHours: "Le jeton expire dans {hours} heures",
    refreshNow: "Rafraichir maintenant",
    refreshing: "Rafraichissement...",
    loginWithOpenId: "Se connecter avec OpenID",
    loggingIn: "Redirection...",
    loggedIn: "Connecte",
    loggedInAs: "Connecte en tant que {username}",
    missingConfig: "L'URL de l'emetteur et l'ID client sont requis",
    refreshFailed: "Echec du rafraichissement du jeton"
  },
  codegen: {
    title: "Extraits de code",
    curl: "cURL",
    curlPreview: "Aperçu cURL",
    javascript: "JavaScript",
    python: "Python",
    go: "Go"
  },
  history: {
    title: "Historique des requetes",
    empty: "Aucune requete",
    clearAll: "Tout effacer",
    confirmClear: "Confirmer?",
    replay: "Rejouer",
    delete: "Supprimer",
    success: "Succes",
    failed: "Echec",
    export: "Exporter",
    import: "Importer",
    navigate: "Naviguer",
    justNow: "A l'instant",
    minutesAgo: "Il y a {minutes}m",
    hoursAgo: "Il y a {hours}h",
    daysAgo: "Il y a {days}j"
  },
  sidebar: {
    allOperations: "Toutes les operations",
    servers: "Serveurs",
    serverVariables: "Variables du serveur",
    toggleThemeLight: "Passer au mode clair",
    toggleThemeDark: "Passer au mode sombre"
  },
  specLoader: {
    title: "Charger une specification API",
    subtitle: "Chargez une specification OpenAPI pour explorer et tester",
    uploadFile: "Importer un fichier",
    loadFromUrl: "Charger depuis une URL",
    load: "Charger",
    loading: "Chargement...",
    or: "ou",
    clickToUpload: "Cliquez pour importer",
    orDragDrop: "ou glissez-deposez",
    supportedFormats: "Fichiers JSON ou YAML (.json, .yaml, .yml)",
    urlRequired: "Veuillez entrer une URL",
    loadFailed: "Echec du chargement de la specification",
    invalidFileType: "Type de fichier invalide. Veuillez importer un fichier JSON ou YAML.",
    jsonOnly: "Seuls les fichiers JSON et YAML sont pris en charge",
    tryExample: "Essayez un exemple:"
  },
  commandPalette: {
    placeholder: "Rechercher des operations...",
    noResults: "Aucune operation trouvee",
    navigate: "pour naviguer",
    select: "pour selectionner"
  },
  validation: {
    required: "Ce champ est requis",
    type: "Doit etre de type {type}",
    minLength: "Doit contenir au moins {limit} caracteres",
    maxLength: "Doit contenir au plus {limit} caracteres",
    minimum: "Doit etre >= {limit}",
    maximum: "Doit etre <= {limit}",
    exclusiveMinimum: "Doit etre > {limit}",
    exclusiveMaximum: "Doit etre < {limit}",
    multipleOf: "Doit etre un multiple de {value}",
    pattern: "Doit correspondre au motif : {pattern}",
    enum: "Doit etre parmi : {values}",
    const: "Doit etre egal a {value}",
    minItems: "Doit contenir au moins {limit} elements",
    maxItems: "Doit contenir au plus {limit} elements",
    uniqueItems: "Les elements doivent etre uniques",
    missingProperty: "Propriete requise manquante : {property}",
    format: "Doit etre un {format} valide",
    invalidNumber: "Doit etre un nombre valide"
  }
}, dh = "wti:locale", Wu = {
  en: ib,
  fr: ob
}, Fi = ["en", "fr"];
function ab() {
  if (typeof navigator > "u")
    return "en";
  const t = navigator.language.split("-")[0];
  return Fi.includes(t) ? t : "en";
}
function lb(t) {
  if (t)
    return t;
  const e = kl(dh, null);
  return e && Fi.includes(e) ? e : ab();
}
function cb(t, e) {
  return e.split(".").reduce((r, n) => r && typeof r == "object" && n in r ? r[n] : e, t);
}
function ub(t, e) {
  return e ? t.replace(/\{(\w+)\}/g, (r, n) => n in e ? String(e[n]) : `{${n}}`) : t;
}
const fh = Gd();
function db(t) {
  const [e, r] = Q(lb(t.locale)), n = {
    t: (s, i) => {
      const o = Wu[e()] || Wu.en, a = cb(o, s);
      return ub(a, i);
    },
    locale: e,
    setLocale: (s) => {
      Fi.includes(s) && (r(s), xl(dh, s));
    },
    supportedLocales: Fi
  };
  return A(fh.Provider, {
    value: n,
    get children() {
      return t.children;
    }
  });
}
function Ce() {
  const t = Yd(fh);
  if (!t)
    throw new Error("useI18n must be used within an I18nProvider");
  return t;
}
function er(t) {
  return Array.isArray ? Array.isArray(t) : mh(t) === "[object Array]";
}
function fb(t) {
  if (typeof t == "string")
    return t;
  let e = t + "";
  return e == "0" && 1 / t == -1 / 0 ? "-0" : e;
}
function hb(t) {
  return t == null ? "" : fb(t);
}
function Mt(t) {
  return typeof t == "string";
}
function hh(t) {
  return typeof t == "number";
}
function pb(t) {
  return t === !0 || t === !1 || mb(t) && mh(t) == "[object Boolean]";
}
function ph(t) {
  return typeof t == "object";
}
function mb(t) {
  return ph(t) && t !== null;
}
function ut(t) {
  return t != null;
}
function ta(t) {
  return !t.trim().length;
}
function mh(t) {
  return t == null ? t === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(t);
}
const gb = "Incorrect 'index' type", yb = (t) => `Invalid value for key ${t}`, bb = (t) => `Pattern length exceeds max of ${t}.`, vb = (t) => `Missing ${t} property in key`, wb = (t) => `Property 'weight' in key '${t}' must be a positive integer`, Gu = Object.prototype.hasOwnProperty;
class kb {
  constructor(e) {
    this._keys = [], this._keyMap = {};
    let r = 0;
    e.forEach((n) => {
      let s = gh(n);
      this._keys.push(s), this._keyMap[s.id] = s, r += s.weight;
    }), this._keys.forEach((n) => {
      n.weight /= r;
    });
  }
  get(e) {
    return this._keyMap[e];
  }
  keys() {
    return this._keys;
  }
  toJSON() {
    return JSON.stringify(this._keys);
  }
}
function gh(t) {
  let e = null, r = null, n = null, s = 1, i = null;
  if (Mt(t) || er(t))
    n = t, e = Yu(t), r = Pa(t);
  else {
    if (!Gu.call(t, "name"))
      throw new Error(vb("name"));
    const o = t.name;
    if (n = o, Gu.call(t, "weight") && (s = t.weight, s <= 0))
      throw new Error(wb(o));
    e = Yu(o), r = Pa(o), i = t.getFn;
  }
  return { path: e, id: r, weight: s, src: n, getFn: i };
}
function Yu(t) {
  return er(t) ? t : t.split(".");
}
function Pa(t) {
  return er(t) ? t.join(".") : t;
}
function xb(t, e) {
  let r = [], n = !1;
  const s = (i, o, a) => {
    if (ut(i))
      if (!o[a])
        r.push(i);
      else {
        let l = o[a];
        const c = i[l];
        if (!ut(c))
          return;
        if (a === o.length - 1 && (Mt(c) || hh(c) || pb(c)))
          r.push(hb(c));
        else if (er(c)) {
          n = !0;
          for (let d = 0, u = c.length; d < u; d += 1)
            s(c[d], o, a + 1);
        } else o.length && s(c, o, a + 1);
      }
  };
  return s(t, Mt(e) ? e.split(".") : e, 0), n ? r : r[0];
}
const Sb = {
  // Whether the matches should be included in the result set. When `true`, each record in the result
  // set will include the indices of the matched characters.
  // These can consequently be used for highlighting purposes.
  includeMatches: !1,
  // When `true`, the matching function will continue to the end of a search pattern even if
  // a perfect match has already been located in the string.
  findAllMatches: !1,
  // Minimum number of characters that must be matched before a result is considered a match
  minMatchCharLength: 1
}, _b = {
  // When `true`, the algorithm continues searching to the end of the input even if a perfect
  // match is found before the end of the same input.
  isCaseSensitive: !1,
  // When `true`, the algorithm will ignore diacritics (accents) in comparisons
  ignoreDiacritics: !1,
  // When true, the matching function will continue to the end of a search pattern even if
  includeScore: !1,
  // List of properties that will be searched. This also supports nested properties.
  keys: [],
  // Whether to sort the result list, by score
  shouldSort: !0,
  // Default sort function: sort by ascending score, ascending index
  sortFn: (t, e) => t.score === e.score ? t.idx < e.idx ? -1 : 1 : t.score < e.score ? -1 : 1
}, Eb = {
  // Approximately where in the text is the pattern expected to be found?
  location: 0,
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Determines how close the match must be to the fuzzy location (specified above).
  // An exact letter match which is 'distance' characters away from the fuzzy location
  // would score as a complete mismatch. A distance of '0' requires the match be at
  // the exact location specified, a threshold of '1000' would require a perfect match
  // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  distance: 100
}, $b = {
  // When `true`, it enables the use of unix-like search commands
  useExtendedSearch: !1,
  // The get function to use when fetching an object's properties.
  // The default will search nested paths *ie foo.bar.baz*
  getFn: xb,
  // When `true`, search will ignore `location` and `distance`, so it won't matter
  // where in the string the pattern appears.
  // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
  ignoreLocation: !1,
  // When `true`, the calculation for the relevance score (used for sorting) will
  // ignore the field-length norm.
  // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
  ignoreFieldNorm: !1,
  // The weight to determine how much field length norm effects scoring.
  fieldNormWeight: 1
};
var re = {
  ..._b,
  ...Sb,
  ...Eb,
  ...$b
};
const Ab = /[^ ]+/g;
function Tb(t = 1, e = 3) {
  const r = /* @__PURE__ */ new Map(), n = Math.pow(10, e);
  return {
    get(s) {
      const i = s.match(Ab).length;
      if (r.has(i))
        return r.get(i);
      const o = 1 / Math.pow(i, 0.5 * t), a = parseFloat(Math.round(o * n) / n);
      return r.set(i, a), a;
    },
    clear() {
      r.clear();
    }
  };
}
class Sl {
  constructor({
    getFn: e = re.getFn,
    fieldNormWeight: r = re.fieldNormWeight
  } = {}) {
    this.norm = Tb(r, 3), this.getFn = e, this.isCreated = !1, this.setIndexRecords();
  }
  setSources(e = []) {
    this.docs = e;
  }
  setIndexRecords(e = []) {
    this.records = e;
  }
  setKeys(e = []) {
    this.keys = e, this._keysMap = {}, e.forEach((r, n) => {
      this._keysMap[r.id] = n;
    });
  }
  create() {
    this.isCreated || !this.docs.length || (this.isCreated = !0, Mt(this.docs[0]) ? this.docs.forEach((e, r) => {
      this._addString(e, r);
    }) : this.docs.forEach((e, r) => {
      this._addObject(e, r);
    }), this.norm.clear());
  }
  // Adds a doc to the end of the index
  add(e) {
    const r = this.size();
    Mt(e) ? this._addString(e, r) : this._addObject(e, r);
  }
  // Removes the doc at the specified index of the index
  removeAt(e) {
    this.records.splice(e, 1);
    for (let r = e, n = this.size(); r < n; r += 1)
      this.records[r].i -= 1;
  }
  getValueForItemAtKeyId(e, r) {
    return e[this._keysMap[r]];
  }
  size() {
    return this.records.length;
  }
  _addString(e, r) {
    if (!ut(e) || ta(e))
      return;
    let n = {
      v: e,
      i: r,
      n: this.norm.get(e)
    };
    this.records.push(n);
  }
  _addObject(e, r) {
    let n = { i: r, $: {} };
    this.keys.forEach((s, i) => {
      let o = s.getFn ? s.getFn(e) : this.getFn(e, s.path);
      if (ut(o)) {
        if (er(o)) {
          let a = [];
          const l = [{ nestedArrIndex: -1, value: o }];
          for (; l.length; ) {
            const { nestedArrIndex: c, value: d } = l.pop();
            if (ut(d))
              if (Mt(d) && !ta(d)) {
                let u = {
                  v: d,
                  i: c,
                  n: this.norm.get(d)
                };
                a.push(u);
              } else er(d) && d.forEach((u, f) => {
                l.push({
                  nestedArrIndex: f,
                  value: u
                });
              });
          }
          n.$[i] = a;
        } else if (Mt(o) && !ta(o)) {
          let a = {
            v: o,
            n: this.norm.get(o)
          };
          n.$[i] = a;
        }
      }
    }), this.records.push(n);
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
    };
  }
}
function yh(t, e, { getFn: r = re.getFn, fieldNormWeight: n = re.fieldNormWeight } = {}) {
  const s = new Sl({ getFn: r, fieldNormWeight: n });
  return s.setKeys(t.map(gh)), s.setSources(e), s.create(), s;
}
function Ob(t, { getFn: e = re.getFn, fieldNormWeight: r = re.fieldNormWeight } = {}) {
  const { keys: n, records: s } = t, i = new Sl({ getFn: e, fieldNormWeight: r });
  return i.setKeys(n), i.setIndexRecords(s), i;
}
function ui(t, {
  errors: e = 0,
  currentLocation: r = 0,
  expectedLocation: n = 0,
  distance: s = re.distance,
  ignoreLocation: i = re.ignoreLocation
} = {}) {
  const o = e / t.length;
  if (i)
    return o;
  const a = Math.abs(n - r);
  return s ? o + a / s : a ? 1 : o;
}
function Cb(t = [], e = re.minMatchCharLength) {
  let r = [], n = -1, s = -1, i = 0;
  for (let o = t.length; i < o; i += 1) {
    let a = t[i];
    a && n === -1 ? n = i : !a && n !== -1 && (s = i - 1, s - n + 1 >= e && r.push([n, s]), n = -1);
  }
  return t[i - 1] && i - n >= e && r.push([n, i - 1]), r;
}
const vr = 32;
function Nb(t, e, r, {
  location: n = re.location,
  distance: s = re.distance,
  threshold: i = re.threshold,
  findAllMatches: o = re.findAllMatches,
  minMatchCharLength: a = re.minMatchCharLength,
  includeMatches: l = re.includeMatches,
  ignoreLocation: c = re.ignoreLocation
} = {}) {
  if (e.length > vr)
    throw new Error(bb(vr));
  const d = e.length, u = t.length, f = Math.max(0, Math.min(n, u));
  let p = i, b = f;
  const g = a > 1 || l, m = g ? Array(u) : [];
  let w;
  for (; (w = t.indexOf(e, b)) > -1; ) {
    let S = ui(e, {
      currentLocation: w,
      expectedLocation: f,
      distance: s,
      ignoreLocation: c
    });
    if (p = Math.min(S, p), b = w + d, g) {
      let _ = 0;
      for (; _ < d; )
        m[w + _] = 1, _ += 1;
    }
  }
  b = -1;
  let h = [], y = 1, k = d + u;
  const v = 1 << d - 1;
  for (let S = 0; S < d; S += 1) {
    let _ = 0, T = k;
    for (; _ < T; )
      ui(e, {
        errors: S,
        currentLocation: f + T,
        expectedLocation: f,
        distance: s,
        ignoreLocation: c
      }) <= p ? _ = T : k = T, T = Math.floor((k - _) / 2 + _);
    k = T;
    let P = Math.max(1, f - T + 1), R = o ? u : Math.min(f + T, u) + d, D = Array(R + 2);
    D[R + 1] = (1 << S) - 1;
    for (let U = R; U >= P; U -= 1) {
      let Y = U - 1, se = r[t.charAt(Y)];
      if (g && (m[Y] = +!!se), D[U] = (D[U + 1] << 1 | 1) & se, S && (D[U] |= (h[U + 1] | h[U]) << 1 | 1 | h[U + 1]), D[U] & v && (y = ui(e, {
        errors: S,
        currentLocation: Y,
        expectedLocation: f,
        distance: s,
        ignoreLocation: c
      }), y <= p)) {
        if (p = y, b = Y, b <= f)
          break;
        P = Math.max(1, 2 * f - b);
      }
    }
    if (ui(e, {
      errors: S + 1,
      currentLocation: f,
      expectedLocation: f,
      distance: s,
      ignoreLocation: c
    }) > p)
      break;
    h = D;
  }
  const x = {
    isMatch: b >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: Math.max(1e-3, y)
  };
  if (g) {
    const S = Cb(m, a);
    S.length ? l && (x.indices = S) : x.isMatch = !1;
  }
  return x;
}
function Ib(t) {
  let e = {};
  for (let r = 0, n = t.length; r < n; r += 1) {
    const s = t.charAt(r);
    e[s] = (e[s] || 0) | 1 << n - r - 1;
  }
  return e;
}
const Ui = String.prototype.normalize ? ((t) => t.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g, "")) : ((t) => t);
class bh {
  constructor(e, {
    location: r = re.location,
    threshold: n = re.threshold,
    distance: s = re.distance,
    includeMatches: i = re.includeMatches,
    findAllMatches: o = re.findAllMatches,
    minMatchCharLength: a = re.minMatchCharLength,
    isCaseSensitive: l = re.isCaseSensitive,
    ignoreDiacritics: c = re.ignoreDiacritics,
    ignoreLocation: d = re.ignoreLocation
  } = {}) {
    if (this.options = {
      location: r,
      threshold: n,
      distance: s,
      includeMatches: i,
      findAllMatches: o,
      minMatchCharLength: a,
      isCaseSensitive: l,
      ignoreDiacritics: c,
      ignoreLocation: d
    }, e = l ? e : e.toLowerCase(), e = c ? Ui(e) : e, this.pattern = e, this.chunks = [], !this.pattern.length)
      return;
    const u = (p, b) => {
      this.chunks.push({
        pattern: p,
        alphabet: Ib(p),
        startIndex: b
      });
    }, f = this.pattern.length;
    if (f > vr) {
      let p = 0;
      const b = f % vr, g = f - b;
      for (; p < g; )
        u(this.pattern.substr(p, vr), p), p += vr;
      if (b) {
        const m = f - vr;
        u(this.pattern.substr(m), m);
      }
    } else
      u(this.pattern, 0);
  }
  searchIn(e) {
    const { isCaseSensitive: r, ignoreDiacritics: n, includeMatches: s } = this.options;
    if (e = r ? e : e.toLowerCase(), e = n ? Ui(e) : e, this.pattern === e) {
      let g = {
        isMatch: !0,
        score: 0
      };
      return s && (g.indices = [[0, e.length - 1]]), g;
    }
    const {
      location: i,
      distance: o,
      threshold: a,
      findAllMatches: l,
      minMatchCharLength: c,
      ignoreLocation: d
    } = this.options;
    let u = [], f = 0, p = !1;
    this.chunks.forEach(({ pattern: g, alphabet: m, startIndex: w }) => {
      const { isMatch: h, score: y, indices: k } = Nb(e, g, m, {
        location: i + w,
        distance: o,
        threshold: a,
        findAllMatches: l,
        minMatchCharLength: c,
        includeMatches: s,
        ignoreLocation: d
      });
      h && (p = !0), f += y, h && k && (u = [...u, ...k]);
    });
    let b = {
      isMatch: p,
      score: p ? f / this.chunks.length : 1
    };
    return p && s && (b.indices = u), b;
  }
}
class lr {
  constructor(e) {
    this.pattern = e;
  }
  static isMultiMatch(e) {
    return Qu(e, this.multiRegex);
  }
  static isSingleMatch(e) {
    return Qu(e, this.singleRegex);
  }
  search() {
  }
}
function Qu(t, e) {
  const r = t.match(e);
  return r ? r[1] : null;
}
class Pb extends lr {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "exact";
  }
  static get multiRegex() {
    return /^="(.*)"$/;
  }
  static get singleRegex() {
    return /^=(.*)$/;
  }
  search(e) {
    const r = e === this.pattern;
    return {
      isMatch: r,
      score: r ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    };
  }
}
class Lb extends lr {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "inverse-exact";
  }
  static get multiRegex() {
    return /^!"(.*)"$/;
  }
  static get singleRegex() {
    return /^!(.*)$/;
  }
  search(e) {
    const r = e.indexOf(this.pattern) === -1;
    return {
      isMatch: r,
      score: r ? 0 : 1,
      indices: [0, e.length - 1]
    };
  }
}
class Rb extends lr {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "prefix-exact";
  }
  static get multiRegex() {
    return /^\^"(.*)"$/;
  }
  static get singleRegex() {
    return /^\^(.*)$/;
  }
  search(e) {
    const r = e.startsWith(this.pattern);
    return {
      isMatch: r,
      score: r ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    };
  }
}
class jb extends lr {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "inverse-prefix-exact";
  }
  static get multiRegex() {
    return /^!\^"(.*)"$/;
  }
  static get singleRegex() {
    return /^!\^(.*)$/;
  }
  search(e) {
    const r = !e.startsWith(this.pattern);
    return {
      isMatch: r,
      score: r ? 0 : 1,
      indices: [0, e.length - 1]
    };
  }
}
class Mb extends lr {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "suffix-exact";
  }
  static get multiRegex() {
    return /^"(.*)"\$$/;
  }
  static get singleRegex() {
    return /^(.*)\$$/;
  }
  search(e) {
    const r = e.endsWith(this.pattern);
    return {
      isMatch: r,
      score: r ? 0 : 1,
      indices: [e.length - this.pattern.length, e.length - 1]
    };
  }
}
class Db extends lr {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "inverse-suffix-exact";
  }
  static get multiRegex() {
    return /^!"(.*)"\$$/;
  }
  static get singleRegex() {
    return /^!(.*)\$$/;
  }
  search(e) {
    const r = !e.endsWith(this.pattern);
    return {
      isMatch: r,
      score: r ? 0 : 1,
      indices: [0, e.length - 1]
    };
  }
}
class vh extends lr {
  constructor(e, {
    location: r = re.location,
    threshold: n = re.threshold,
    distance: s = re.distance,
    includeMatches: i = re.includeMatches,
    findAllMatches: o = re.findAllMatches,
    minMatchCharLength: a = re.minMatchCharLength,
    isCaseSensitive: l = re.isCaseSensitive,
    ignoreDiacritics: c = re.ignoreDiacritics,
    ignoreLocation: d = re.ignoreLocation
  } = {}) {
    super(e), this._bitapSearch = new bh(e, {
      location: r,
      threshold: n,
      distance: s,
      includeMatches: i,
      findAllMatches: o,
      minMatchCharLength: a,
      isCaseSensitive: l,
      ignoreDiacritics: c,
      ignoreLocation: d
    });
  }
  static get type() {
    return "fuzzy";
  }
  static get multiRegex() {
    return /^"(.*)"$/;
  }
  static get singleRegex() {
    return /^(.*)$/;
  }
  search(e) {
    return this._bitapSearch.searchIn(e);
  }
}
class wh extends lr {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "include";
  }
  static get multiRegex() {
    return /^'"(.*)"$/;
  }
  static get singleRegex() {
    return /^'(.*)$/;
  }
  search(e) {
    let r = 0, n;
    const s = [], i = this.pattern.length;
    for (; (n = e.indexOf(this.pattern, r)) > -1; )
      r = n + i, s.push([n, r - 1]);
    const o = !!s.length;
    return {
      isMatch: o,
      score: o ? 0 : 1,
      indices: s
    };
  }
}
const La = [
  Pb,
  wh,
  Rb,
  jb,
  Db,
  Mb,
  Lb,
  vh
], Xu = La.length, Bb = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/, qb = "|";
function Fb(t, e = {}) {
  return t.split(qb).map((r) => {
    let n = r.trim().split(Bb).filter((i) => i && !!i.trim()), s = [];
    for (let i = 0, o = n.length; i < o; i += 1) {
      const a = n[i];
      let l = !1, c = -1;
      for (; !l && ++c < Xu; ) {
        const d = La[c];
        let u = d.isMultiMatch(a);
        u && (s.push(new d(u, e)), l = !0);
      }
      if (!l)
        for (c = -1; ++c < Xu; ) {
          const d = La[c];
          let u = d.isSingleMatch(a);
          if (u) {
            s.push(new d(u, e));
            break;
          }
        }
    }
    return s;
  });
}
const Ub = /* @__PURE__ */ new Set([vh.type, wh.type]);
class Kb {
  constructor(e, {
    isCaseSensitive: r = re.isCaseSensitive,
    ignoreDiacritics: n = re.ignoreDiacritics,
    includeMatches: s = re.includeMatches,
    minMatchCharLength: i = re.minMatchCharLength,
    ignoreLocation: o = re.ignoreLocation,
    findAllMatches: a = re.findAllMatches,
    location: l = re.location,
    threshold: c = re.threshold,
    distance: d = re.distance
  } = {}) {
    this.query = null, this.options = {
      isCaseSensitive: r,
      ignoreDiacritics: n,
      includeMatches: s,
      minMatchCharLength: i,
      findAllMatches: a,
      ignoreLocation: o,
      location: l,
      threshold: c,
      distance: d
    }, e = r ? e : e.toLowerCase(), e = n ? Ui(e) : e, this.pattern = e, this.query = Fb(this.pattern, this.options);
  }
  static condition(e, r) {
    return r.useExtendedSearch;
  }
  searchIn(e) {
    const r = this.query;
    if (!r)
      return {
        isMatch: !1,
        score: 1
      };
    const { includeMatches: n, isCaseSensitive: s, ignoreDiacritics: i } = this.options;
    e = s ? e : e.toLowerCase(), e = i ? Ui(e) : e;
    let o = 0, a = [], l = 0;
    for (let c = 0, d = r.length; c < d; c += 1) {
      const u = r[c];
      a.length = 0, o = 0;
      for (let f = 0, p = u.length; f < p; f += 1) {
        const b = u[f], { isMatch: g, indices: m, score: w } = b.search(e);
        if (g) {
          if (o += 1, l += w, n) {
            const h = b.constructor.type;
            Ub.has(h) ? a = [...a, ...m] : a.push(m);
          }
        } else {
          l = 0, o = 0, a.length = 0;
          break;
        }
      }
      if (o) {
        let f = {
          isMatch: !0,
          score: l / o
        };
        return n && (f.indices = a), f;
      }
    }
    return {
      isMatch: !1,
      score: 1
    };
  }
}
const Ra = [];
function zb(...t) {
  Ra.push(...t);
}
function ja(t, e) {
  for (let r = 0, n = Ra.length; r < n; r += 1) {
    let s = Ra[r];
    if (s.condition(t, e))
      return new s(t, e);
  }
  return new bh(t, e);
}
const Ki = {
  AND: "$and",
  OR: "$or"
}, Ma = {
  PATH: "$path",
  PATTERN: "$val"
}, Da = (t) => !!(t[Ki.AND] || t[Ki.OR]), Vb = (t) => !!t[Ma.PATH], Hb = (t) => !er(t) && ph(t) && !Da(t), Zu = (t) => ({
  [Ki.AND]: Object.keys(t).map((e) => ({
    [e]: t[e]
  }))
});
function kh(t, e, { auto: r = !0 } = {}) {
  const n = (s) => {
    let i = Object.keys(s);
    const o = Vb(s);
    if (!o && i.length > 1 && !Da(s))
      return n(Zu(s));
    if (Hb(s)) {
      const l = o ? s[Ma.PATH] : i[0], c = o ? s[Ma.PATTERN] : s[l];
      if (!Mt(c))
        throw new Error(yb(l));
      const d = {
        keyId: Pa(l),
        pattern: c
      };
      return r && (d.searcher = ja(c, e)), d;
    }
    let a = {
      children: [],
      operator: i[0]
    };
    return i.forEach((l) => {
      const c = s[l];
      er(c) && c.forEach((d) => {
        a.children.push(n(d));
      });
    }), a;
  };
  return Da(t) || (t = Zu(t)), n(t);
}
function Jb(t, { ignoreFieldNorm: e = re.ignoreFieldNorm }) {
  t.forEach((r) => {
    let n = 1;
    r.matches.forEach(({ key: s, norm: i, score: o }) => {
      const a = s ? s.weight : null;
      n *= Math.pow(
        o === 0 && a ? Number.EPSILON : o,
        (a || 1) * (e ? 1 : i)
      );
    }), r.score = n;
  });
}
function Wb(t, e) {
  const r = t.matches;
  e.matches = [], ut(r) && r.forEach((n) => {
    if (!ut(n.indices) || !n.indices.length)
      return;
    const { indices: s, value: i } = n;
    let o = {
      indices: s,
      value: i
    };
    n.key && (o.key = n.key.src), n.idx > -1 && (o.refIndex = n.idx), e.matches.push(o);
  });
}
function Gb(t, e) {
  e.score = t.score;
}
function Yb(t, e, {
  includeMatches: r = re.includeMatches,
  includeScore: n = re.includeScore
} = {}) {
  const s = [];
  return r && s.push(Wb), n && s.push(Gb), t.map((i) => {
    const { idx: o } = i, a = {
      item: e[o],
      refIndex: o
    };
    return s.length && s.forEach((l) => {
      l(i, a);
    }), a;
  });
}
class hn {
  constructor(e, r = {}, n) {
    this.options = { ...re, ...r }, this.options.useExtendedSearch, this._keyStore = new kb(this.options.keys), this.setCollection(e, n);
  }
  setCollection(e, r) {
    if (this._docs = e, r && !(r instanceof Sl))
      throw new Error(gb);
    this._myIndex = r || yh(this.options.keys, this._docs, {
      getFn: this.options.getFn,
      fieldNormWeight: this.options.fieldNormWeight
    });
  }
  add(e) {
    ut(e) && (this._docs.push(e), this._myIndex.add(e));
  }
  remove(e = () => !1) {
    const r = [];
    for (let n = 0, s = this._docs.length; n < s; n += 1) {
      const i = this._docs[n];
      e(i, n) && (this.removeAt(n), n -= 1, s -= 1, r.push(i));
    }
    return r;
  }
  removeAt(e) {
    this._docs.splice(e, 1), this._myIndex.removeAt(e);
  }
  getIndex() {
    return this._myIndex;
  }
  search(e, { limit: r = -1 } = {}) {
    const {
      includeMatches: n,
      includeScore: s,
      shouldSort: i,
      sortFn: o,
      ignoreFieldNorm: a
    } = this.options;
    let l = Mt(e) ? Mt(this._docs[0]) ? this._searchStringList(e) : this._searchObjectList(e) : this._searchLogical(e);
    return Jb(l, { ignoreFieldNorm: a }), i && l.sort(o), hh(r) && r > -1 && (l = l.slice(0, r)), Yb(l, this._docs, {
      includeMatches: n,
      includeScore: s
    });
  }
  _searchStringList(e) {
    const r = ja(e, this.options), { records: n } = this._myIndex, s = [];
    return n.forEach(({ v: i, i: o, n: a }) => {
      if (!ut(i))
        return;
      const { isMatch: l, score: c, indices: d } = r.searchIn(i);
      l && s.push({
        item: i,
        idx: o,
        matches: [{ score: c, value: i, norm: a, indices: d }]
      });
    }), s;
  }
  _searchLogical(e) {
    const r = kh(e, this.options), n = (a, l, c) => {
      if (!a.children) {
        const { keyId: u, searcher: f } = a, p = this._findMatches({
          key: this._keyStore.get(u),
          value: this._myIndex.getValueForItemAtKeyId(l, u),
          searcher: f
        });
        return p && p.length ? [
          {
            idx: c,
            item: l,
            matches: p
          }
        ] : [];
      }
      const d = [];
      for (let u = 0, f = a.children.length; u < f; u += 1) {
        const p = a.children[u], b = n(p, l, c);
        if (b.length)
          d.push(...b);
        else if (a.operator === Ki.AND)
          return [];
      }
      return d;
    }, s = this._myIndex.records, i = {}, o = [];
    return s.forEach(({ $: a, i: l }) => {
      if (ut(a)) {
        let c = n(r, a, l);
        c.length && (i[l] || (i[l] = { idx: l, item: a, matches: [] }, o.push(i[l])), c.forEach(({ matches: d }) => {
          i[l].matches.push(...d);
        }));
      }
    }), o;
  }
  _searchObjectList(e) {
    const r = ja(e, this.options), { keys: n, records: s } = this._myIndex, i = [];
    return s.forEach(({ $: o, i: a }) => {
      if (!ut(o))
        return;
      let l = [];
      n.forEach((c, d) => {
        l.push(
          ...this._findMatches({
            key: c,
            value: o[d],
            searcher: r
          })
        );
      }), l.length && i.push({
        idx: a,
        item: o,
        matches: l
      });
    }), i;
  }
  _findMatches({ key: e, value: r, searcher: n }) {
    if (!ut(r))
      return [];
    let s = [];
    if (er(r))
      r.forEach(({ v: i, i: o, n: a }) => {
        if (!ut(i))
          return;
        const { isMatch: l, score: c, indices: d } = n.searchIn(i);
        l && s.push({
          score: c,
          key: e,
          value: i,
          idx: o,
          norm: a,
          indices: d
        });
      });
    else {
      const { v: i, n: o } = r, { isMatch: a, score: l, indices: c } = n.searchIn(i);
      a && s.push({ score: l, key: e, value: i, norm: o, indices: c });
    }
    return s;
  }
}
hn.version = "7.1.0";
hn.createIndex = yh;
hn.parseIndex = Ob;
hn.config = re;
hn.parseQuery = kh;
zb(Kb);
const Qb = {
  keys: [
    { name: "path", weight: 2 },
    { name: "id", weight: 2 },
    { name: "summary", weight: 1 },
    { name: "method", weight: 0.5 },
    { name: "tags", weight: 0.5 }
  ],
  threshold: 0.4,
  includeScore: !0,
  includeMatches: !0,
  ignoreLocation: !0
};
function xh(t) {
  return new hn(t, Qb);
}
function Sh(t, e, r = 50) {
  return t.search(e).slice(0, r).map((n) => ({
    operation: n.item,
    matches: n.matches,
    score: n.score
  }));
}
var Xb = /* @__PURE__ */ M('<span class="text-accent-500 font-semibold">'), Zb = /* @__PURE__ */ M('<svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor role=img aria-label="Recently used"><title>Recently used</title><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">'), ev = /* @__PURE__ */ M('<button type=button style="width:calc(100% - 8px)"><span></span><div class="flex-1 min-w-0 overflow-hidden"><span>'), tv = /* @__PURE__ */ M('<span class="block text-[0.6875rem] text-gray-600 dark:text-gray-400 truncate mt-0.5">');
const ed = (t) => {
  const e = () => {
    const r = t.matches?.find((i) => i.key === t.fieldKey);
    if (!r?.indices?.length)
      return [{
        text: t.text,
        highlight: !1
      }];
    const n = [];
    let s = 0;
    for (const [i, o] of r.indices)
      i > s && n.push({
        text: t.text.slice(s, i),
        highlight: !1
      }), n.push({
        text: t.text.slice(i, o + 1),
        highlight: !0
      }), s = o + 1;
    return s < t.text.length && n.push({
      text: t.text.slice(s),
      highlight: !1
    }), n;
  };
  return A(Ae, {
    get each() {
      return e();
    },
    children: (r) => A(z, {
      get when() {
        return r.highlight;
      },
      get fallback() {
        return r.text;
      },
      get children() {
        var n = Xb();
        return $(n, () => r.text), n;
      }
    })
  });
}, rv = {
  get: {
    bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/20"
  },
  post: {
    bg: "bg-gradient-to-r from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/20"
  },
  put: {
    bg: "bg-gradient-to-r from-amber-500 to-amber-600",
    shadow: "shadow-amber-500/20"
  },
  patch: {
    bg: "bg-gradient-to-r from-violet-500 to-violet-600",
    shadow: "shadow-violet-500/20"
  },
  delete: {
    bg: "bg-gradient-to-r from-rose-500 to-rose-600",
    shadow: "shadow-rose-500/20"
  },
  head: {
    bg: "bg-gradient-to-r from-cyan-500 to-cyan-600",
    shadow: "shadow-cyan-500/20"
  },
  options: {
    bg: "bg-gradient-to-r from-gray-500 to-gray-600",
    shadow: "shadow-gray-500/20"
  },
  grpc: {
    bg: "bg-gradient-to-r from-indigo-500 to-purple-600",
    shadow: "shadow-indigo-500/20"
  }
}, nv = {
  bg: "bg-gradient-to-r from-gray-500 to-gray-600",
  shadow: "shadow-gray-500/20"
}, sv = (t) => {
  const e = () => rv[t.operation.method.toLowerCase()] || nv;
  return (() => {
    var r = ev(), n = r.firstChild, s = n.nextSibling, i = s.firstChild;
    return dt(r, "mouseenter", t.onMouseEnter), dt(r, "click", t.onClick, !0), $(r, A(z, {
      get when() {
        return t.isRecent;
      },
      get children() {
        return Zb();
      }
    }), n), $(n, () => t.operation.method), $(i, A(ed, {
      get text() {
        return t.operation.path;
      },
      get matches() {
        return t.matches;
      },
      fieldKey: "path"
    })), $(s, A(z, {
      get when() {
        return t.operation.summary;
      },
      keyed: !0,
      children: (o) => (() => {
        var a = tv();
        return $(a, A(ed, {
          text: o,
          get matches() {
            return t.matches;
          },
          fieldKey: "summary"
        })), a;
      })()
    }), null), ee((o) => {
      var a = `w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 rounded-lg mx-1 my-0.5 ${t.selected ? "bg-accent-500/15 dark:bg-accent-500/20" : "hover:bg-black/5 dark:hover:bg-white/5"}`, l = `${e().bg} text-white text-[0.625rem] font-bold uppercase w-12 py-1 rounded-md shadow-sm ${e().shadow} flex-shrink-0 text-center`, c = `block font-mono text-xs truncate text-gray-700 dark:text-gray-200 ${t.operation.deprecated ? "line-through opacity-50" : ""}`;
      return a !== o.e && te(r, o.e = a), l !== o.t && te(n, o.t = l), c !== o.a && te(i, o.a = c), o;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), r;
  })();
};
Ee(["click"]);
var iv = /* @__PURE__ */ M('<div><div class="w-full max-w-xl mx-4 glass-thick rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200"><div class="flex items-center gap-3 px-4 py-3 border-b border-black/5 dark:border-white/5"><svg class="w-5 h-5 text-gray-400"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg><input type=text class="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-sm"><kbd class="hidden sm:inline-flex px-2 py-1 text-[0.625rem] font-mono text-gray-400 glass-button rounded">esc</kbd></div><div class="max-h-[50vh] overflow-y-auto scrollbar-thin py-1"></div><div class="px-4 py-2 border-t border-black/5 dark:border-white/5 flex items-center gap-4 text-xs text-gray-400"><span class="flex items-center gap-1"><kbd class="px-1.5 py-0.5 glass-button rounded text-[0.625rem]"><span class=font-mono>↑↓</span></kbd></span><span class="flex items-center gap-1"><kbd class="px-1.5 py-0.5 glass-button rounded text-[0.625rem]"><span class=font-mono>↵'), ov = /* @__PURE__ */ M('<div class="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">');
const _h = "wti:recent-operations", av = 8, Ba = (t) => `${t.method}:${t.path}`, Si = () => kl(_h, []), lv = (t) => {
  xl(_h, t.slice(0, av));
}, cv = (t) => {
  const e = Ba(t), r = Si().filter((n) => n !== e);
  lv([e, ...r]);
}, uv = (t) => {
  const {
    t: e
  } = Ce(), r = ah(), [n, s] = Q(!1), [i, o] = Q(""), [a, l] = Q(0), [c, d] = Q(Si()), [u, f] = Q(!1);
  let p, b;
  const g = {
    open: () => s(!0),
    close: () => s(!1),
    toggle: () => s((S) => !S),
    isOpen: n
  };
  Ar(() => {
    t.ref?.(g);
  }), Ar(() => {
    if (t.disableShortcut)
      return;
    const S = t.shortcutKey ?? "p", _ = (T) => {
      (T.metaKey || T.ctrlKey) && T.key.toLowerCase() === S.toLowerCase() && (T.preventDefault(), t.operations.length > 0 && s((P) => !P));
    };
    window.addEventListener("keydown", _), rt(() => window.removeEventListener("keydown", _));
  });
  const m = pe(() => {
    const S = /* @__PURE__ */ new Map();
    for (const _ of t.operations)
      S.set(Ba(_), _);
    return S;
  }), w = pe(() => t.searchFn || t.operations.length === 0 ? null : xh(t.operations)), h = pe(() => {
    const S = i().trim();
    if (!S) {
      const T = c(), P = m(), R = [], D = /* @__PURE__ */ new Set();
      for (const Y of T) {
        const se = P.get(Y);
        se && (R.push({
          operation: se,
          isRecent: !0
        }), D.add(Y));
      }
      const U = t.operations.filter((Y) => !D.has(Ba(Y))).slice(0, 50 - R.length).map((Y) => ({
        operation: Y
      }));
      return [...R, ...U];
    }
    if (t.searchFn)
      return t.searchFn(S);
    const _ = w();
    return _ ? Sh(_, S) : [];
  });
  tt(() => {
    h(), l(0);
  }), tt(() => {
    n() && (o(""), l(0), f(!1), d(Si()), requestAnimationFrame(() => {
      p?.focus();
    }));
  }), tt(() => {
    const S = a();
    b && n() && b.children[S]?.scrollIntoView({
      block: "nearest"
    });
  });
  const y = () => s(!1), k = (S) => {
    cv(S.operation), d(Si()), t.onSelectOperation(S.operation), y();
  }, v = (S) => {
    switch (S.key) {
      case "ArrowDown":
        S.preventDefault(), l((_) => Math.min(_ + 1, h().length - 1));
        break;
      case "ArrowUp":
        S.preventDefault(), l((_) => Math.max(_ - 1, 0));
        break;
      case "Enter": {
        S.preventDefault();
        const _ = h()[a()];
        _ && k(_);
        break;
      }
      case "Escape":
        S.preventDefault(), y();
        break;
    }
  }, x = (S) => {
    S.target === S.currentTarget && y();
  };
  return A(z, {
    get when() {
      return n();
    },
    get children() {
      return A(of, {
        get children() {
          var S = iv(), _ = S.firstChild, T = _.firstChild, P = T.firstChild, R = P.nextSibling, D = T.nextSibling, U = D.nextSibling, Y = U.firstChild;
          Y.firstChild;
          var se = Y.nextSibling;
          se.firstChild, S.$$click = x, _.$$click = (W) => W.stopPropagation(), R.$$keydown = v, R.$$input = (W) => o(W.currentTarget.value);
          var be = p;
          typeof be == "function" ? rn(be, R) : p = R, D.$$mousemove = () => f(!0);
          var xe = b;
          return typeof xe == "function" ? rn(xe, D) : b = D, $(D, A(z, {
            get when() {
              return h().length > 0;
            },
            get fallback() {
              return (() => {
                var W = ov();
                return $(W, () => e("commandPalette.noResults")), W;
              })();
            },
            get children() {
              return A(Ae, {
                get each() {
                  return h();
                },
                children: (W, ce) => A(sv, {
                  get operation() {
                    return W.operation;
                  },
                  get selected() {
                    return ce() === a();
                  },
                  get matches() {
                    return W.matches;
                  },
                  get isRecent() {
                    return W.isRecent;
                  },
                  onClick: () => k(W),
                  onMouseEnter: () => u() && l(ce())
                })
              });
            }
          })), $(Y, () => e("commandPalette.navigate"), null), $(se, () => e("commandPalette.select"), null), ee((W) => {
            var ce = `fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/20 dark:bg-black/40 backdrop-blur-md animate-in fade-in duration-200 ${r() ? "dark" : ""}`, K = e("commandPalette.placeholder");
            return ce !== W.e && te(S, W.e = ce), K !== W.t && he(R, "placeholder", W.t = K), W;
          }, {
            e: void 0,
            t: void 0
          }), ee(() => R.value = i()), S;
        }
      });
    }
  });
};
Ee(["click", "input", "keydown", "mousemove"]);
function dv() {
  const t = window.location.hash.slice(1);
  if (!t)
    return {};
  const e = new URLSearchParams(t), r = e.get("op") || void 0, n = e.get("server"), s = n ? Number.parseInt(n, 10) : void 0;
  return {
    operationId: r,
    serverIndex: Number.isNaN(s) ? void 0 : s
  };
}
function td(t) {
  const e = new URLSearchParams();
  t.operationId && e.set("op", t.operationId), t.serverIndex !== void 0 && t.serverIndex > 0 && e.set("server", t.serverIndex.toString());
  const r = e.toString(), n = r ? `${window.location.pathname}${window.location.search}#${r}` : window.location.pathname + window.location.search;
  window.history.replaceState(null, "", n);
}
function fv() {
  const t = window.location.pathname + window.location.search;
  window.history.replaceState(null, "", t);
}
function hv(t, e) {
  const r = new URL(window.location.href);
  r.hash = "";
  const n = new URLSearchParams();
  return n.set("op", t), r.hash = n.toString(), r.toString();
}
async function pv(t, e) {
  const r = hv(t);
  try {
    return await navigator.clipboard.writeText(r), !0;
  } catch {
    return !1;
  }
}
function mv(t, e = 2) {
  try {
    return JSON.stringify(t, null, e);
  } catch {
    return String(t);
  }
}
function rd(t) {
  if (t)
    try {
      return JSON.parse(t);
    } catch {
      return;
    }
}
function _l(t) {
  return t == null ? "" : String(t);
}
function gv(t, e = 2) {
  return t == null ? "" : typeof t == "object" ? JSON.stringify(t, null, e) : String(t);
}
function yv(t) {
  return t >= 200 && t < 300 ? {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300"
  } : t >= 400 && t < 500 ? {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300"
  } : {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-700 dark:text-rose-300"
  };
}
function bv(t, e) {
  return e ? "bg-rose-500" : t === void 0 ? "bg-gray-400" : t >= 200 && t < 300 ? "bg-emerald-500" : t >= 400 && t < 500 ? "bg-amber-500" : t >= 500 ? "bg-rose-500" : "bg-gray-400";
}
function vv(t) {
  return t >= 400 ? "text-rose-500" : "text-emerald-500";
}
var wv = /* @__PURE__ */ M("<input>"), kv = /* @__PURE__ */ M("<textarea>"), xv = /* @__PURE__ */ M('<div class="relative overflow-hidden"><select style=text-overflow:ellipsis></select><div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><svg class="w-4 h-4 text-gray-400 dark:text-gray-500"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M19 9l-7 7-7-7">'), Sv = /* @__PURE__ */ M('<label><div><input type=checkbox class=sr-only><svg fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=3 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M5 13l4 4L19 7">'), _v = /* @__PURE__ */ M('<span class="text-sm text-gray-700 dark:text-gray-300">');
const Ot = (t) => (() => {
  var e = wv();
  return dt(e, "keydown", t.onKeyDown, !0), e.$$input = (r) => t.onInput(r.currentTarget.value), ee((r) => {
    var n = t.type ?? "text", s = t.id, i = `w-full px-3 sm:px-4 py-2 sm:py-2.5 glass-input text-sm text-surface-900 dark:text-surface-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${t.class ?? ""}`, o = t.placeholder, a = t.disabled;
    return n !== r.e && he(e, "type", r.e = n), s !== r.t && he(e, "id", r.t = s), i !== r.a && te(e, r.a = i), o !== r.o && he(e, "placeholder", r.o = o), a !== r.i && (e.disabled = r.i = a), r;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0,
    i: void 0
  }), ee(() => e.value = t.value), e;
})(), El = (t) => (() => {
  var e = kv();
  return e.$$input = (r) => t.onInput(r.currentTarget.value), ee((r) => {
    var n = `w-full px-3 py-2 glass-input text-sm text-surface-800 dark:text-surface-200 resize-y focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${t.class ?? ""}`, s = t.placeholder, i = t.rows, o = t.disabled;
    return n !== r.e && te(e, r.e = n), s !== r.t && he(e, "placeholder", r.t = s), i !== r.a && he(e, "rows", r.a = i), o !== r.o && (e.disabled = r.o = o), r;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0
  }), ee(() => e.value = t.value), e;
})(), os = (t) => (() => {
  var e = xv(), r = e.firstChild;
  return r.addEventListener("change", (n) => t.onChange(n.currentTarget.value)), $(r, () => t.children), ee((n) => {
    var s = t.id, i = `w-full px-3 py-2 sm:py-2.5 glass-input text-sm text-surface-800 dark:text-surface-200 font-medium focus:outline-none cursor-pointer appearance-none pr-9 disabled:opacity-50 disabled:cursor-not-allowed truncate ${t.class ?? ""}`, o = t.disabled;
    return s !== n.e && he(r, "id", n.e = s), i !== n.t && te(r, n.t = i), o !== n.a && (r.disabled = n.a = o), n;
  }, {
    e: void 0,
    t: void 0,
    a: void 0
  }), ee(() => r.value = t.value), e;
})(), Eh = (t) => (() => {
  var e = Sv(), r = e.firstChild, n = r.firstChild, s = n.nextSibling;
  return n.addEventListener("change", (i) => t.onChange(i.currentTarget.checked)), $(e, (() => {
    var i = Oe(() => !!t.label);
    return () => i() && (() => {
      var o = _v();
      return $(o, () => t.label), o;
    })();
  })(), null), ee((i) => {
    var o = `inline-flex items-center gap-3 cursor-pointer ${t.disabled ? "opacity-50 cursor-not-allowed" : ""} ${t.class ?? ""}`, a = `w-5 h-5 flex items-center justify-center ${t.checked ? "glass-checkbox-checked" : "glass-checkbox"}`, l = t.id, c = t.disabled, d = `w-3 h-3 text-white transition-all duration-200 ${t.checked ? "opacity-100 scale-100" : "opacity-0 scale-75"}`;
    return o !== i.e && te(e, i.e = o), a !== i.t && te(r, i.t = a), l !== i.a && he(n, "id", i.a = l), c !== i.o && (n.disabled = i.o = c), d !== i.i && he(s, "class", i.i = d), i;
  }, {
    e: void 0,
    t: void 0,
    a: void 0,
    o: void 0,
    i: void 0
  }), ee(() => n.checked = t.checked), e;
})();
Ee(["input", "keydown"]);
var Ev = /* @__PURE__ */ M("<button>"), $v = /* @__PURE__ */ M('<svg class="animate-spin h-[1.125rem] w-[1.125rem]"xmlns=http://www.w3.org/2000/svg fill=none viewBox="0 0 24 24"aria-hidden=true><circle class=opacity-25 cx=12 cy=12 r=10 stroke=currentColor stroke-width=4></circle><path class=opacity-75 fill=currentColor d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">');
const Av = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  tertiary: "btn-tertiary"
}, Er = (t) => {
  const e = () => t.variant ?? "primary";
  return (() => {
    var r = Ev();
    return dt(r, "click", t.onClick, !0), $(r, (() => {
      var n = Oe(() => !!t.loading);
      return () => n() && A(Tv, {});
    })(), null), $(r, () => t.children, null), ee((n) => {
      var s = t.type ?? "button", i = `${Av[e()]} inline-flex items-center justify-center gap-2.5 focus:outline-none focus-ring ${t.class ?? ""}`, o = t.disabled || t.loading;
      return s !== n.e && he(r, "type", n.e = s), i !== n.t && te(r, n.t = i), o !== n.a && (r.disabled = n.a = o), n;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), r;
  })();
}, Tv = () => $v();
Ee(["click"]);
const {
  entries: $h,
  setPrototypeOf: nd,
  isFrozen: Ov,
  getPrototypeOf: Cv,
  getOwnPropertyDescriptor: Nv
} = Object;
let {
  freeze: it,
  seal: vt,
  create: qa
} = Object, {
  apply: Fa,
  construct: Ua
} = typeof Reflect < "u" && Reflect;
it || (it = function(t) {
  return t;
});
vt || (vt = function(t) {
  return t;
});
Fa || (Fa = function(t, e) {
  for (var r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), s = 2; s < r; s++)
    n[s - 2] = arguments[s];
  return t.apply(e, n);
});
Ua || (Ua = function(t) {
  for (var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++)
    r[n - 1] = arguments[n];
  return new t(...r);
});
const di = ot(Array.prototype.forEach), Iv = ot(Array.prototype.lastIndexOf), sd = ot(Array.prototype.pop), _n = ot(Array.prototype.push), Pv = ot(Array.prototype.splice), _i = ot(String.prototype.toLowerCase), ra = ot(String.prototype.toString), na = ot(String.prototype.match), En = ot(String.prototype.replace), Lv = ot(String.prototype.indexOf), Rv = ot(String.prototype.trim), $t = ot(Object.prototype.hasOwnProperty), Qe = ot(RegExp.prototype.test), $n = jv(TypeError);
function ot(t) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), s = 1; s < r; s++)
      n[s - 1] = arguments[s];
    return Fa(t, e, n);
  };
}
function jv(t) {
  return function() {
    for (var e = arguments.length, r = new Array(e), n = 0; n < e; n++)
      r[n] = arguments[n];
    return Ua(t, r);
  };
}
function de(t, e) {
  let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : _i;
  nd && nd(t, null);
  let n = e.length;
  for (; n--; ) {
    let s = e[n];
    if (typeof s == "string") {
      const i = r(s);
      i !== s && (Ov(e) || (e[n] = i), s = i);
    }
    t[s] = !0;
  }
  return t;
}
function Mv(t) {
  for (let e = 0; e < t.length; e++)
    $t(t, e) || (t[e] = null);
  return t;
}
function Lt(t) {
  const e = qa(null);
  for (const [r, n] of $h(t))
    $t(t, r) && (Array.isArray(n) ? e[r] = Mv(n) : n && typeof n == "object" && n.constructor === Object ? e[r] = Lt(n) : e[r] = n);
  return e;
}
function An(t, e) {
  for (; t !== null; ) {
    const n = Nv(t, e);
    if (n) {
      if (n.get)
        return ot(n.get);
      if (typeof n.value == "function")
        return ot(n.value);
    }
    t = Cv(t);
  }
  function r() {
    return null;
  }
  return r;
}
const id = it(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), sa = it(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), ia = it(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Dv = it(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), oa = it(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Bv = it(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), od = it(["#text"]), ad = it(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), aa = it(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), ld = it(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), fi = it(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), qv = vt(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Fv = vt(/<%[\w\W]*|[\w\W]*%>/gm), Uv = vt(/\$\{[\w\W]*/gm), Kv = vt(/^data-[\-\w.\u00B7-\uFFFF]+$/), zv = vt(/^aria-[\-\w]+$/), Ah = vt(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Vv = vt(/^(?:\w+script|data):/i), Hv = vt(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Th = vt(/^html$/i), Jv = vt(/^[a-z][.\w]*(-[.\w]+)+$/i);
var cd = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: zv,
  ATTR_WHITESPACE: Hv,
  CUSTOM_ELEMENT: Jv,
  DATA_ATTR: Kv,
  DOCTYPE_NAME: Th,
  ERB_EXPR: Fv,
  IS_ALLOWED_URI: Ah,
  IS_SCRIPT_OR_DATA: Vv,
  MUSTACHE_EXPR: qv,
  TMPLIT_EXPR: Uv
});
const Tn = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Wv = function() {
  return typeof window > "u" ? null : window;
}, Gv = function(t, e) {
  if (typeof t != "object" || typeof t.createPolicy != "function")
    return null;
  let r = null;
  const n = "data-tt-policy-suffix";
  e && e.hasAttribute(n) && (r = e.getAttribute(n));
  const s = "dompurify" + (r ? "#" + r : "");
  try {
    return t.createPolicy(s, {
      createHTML(i) {
        return i;
      },
      createScriptURL(i) {
        return i;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + s + " could not be created."), null;
  }
}, ud = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function Oh() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Wv();
  const e = (C) => Oh(C);
  if (e.version = "3.3.1", e.removed = [], !t || !t.document || t.document.nodeType !== Tn.document || !t.Element)
    return e.isSupported = !1, e;
  let {
    document: r
  } = t;
  const n = r, s = n.currentScript, {
    DocumentFragment: i,
    HTMLTemplateElement: o,
    Node: a,
    Element: l,
    NodeFilter: c,
    NamedNodeMap: d = t.NamedNodeMap || t.MozNamedAttrMap,
    HTMLFormElement: u,
    DOMParser: f,
    trustedTypes: p
  } = t, b = l.prototype, g = An(b, "cloneNode"), m = An(b, "remove"), w = An(b, "nextSibling"), h = An(b, "childNodes"), y = An(b, "parentNode");
  if (typeof o == "function") {
    const C = r.createElement("template");
    C.content && C.content.ownerDocument && (r = C.content.ownerDocument);
  }
  let k, v = "";
  const {
    implementation: x,
    createNodeIterator: S,
    createDocumentFragment: _,
    getElementsByTagName: T
  } = r, {
    importNode: P
  } = n;
  let R = ud();
  e.isSupported = typeof $h == "function" && typeof y == "function" && x && x.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: D,
    ERB_EXPR: U,
    TMPLIT_EXPR: Y,
    DATA_ATTR: se,
    ARIA_ATTR: be,
    IS_SCRIPT_OR_DATA: xe,
    ATTR_WHITESPACE: W,
    CUSTOM_ELEMENT: ce
  } = cd;
  let {
    IS_ALLOWED_URI: K
  } = cd, I = null;
  const F = de({}, [...id, ...sa, ...ia, ...oa, ...od]);
  let L = null;
  const E = de({}, [...ad, ...aa, ...ld, ...fi]);
  let O = Object.seal(qa(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), B = null, V = null;
  const J = Object.seal(qa(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let ie = !0, ne = !0, N = !1, j = !0, q = !1, H = !0, Z = !1, le = !1, Ne = !1, Ue = !1, Be = !1, qe = !1, De = !0, qt = !1;
  const at = "user-content-";
  let cr = !0, Ft = !1, ft = {}, lt = null;
  const Rr = de({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let bn = null;
  const hs = de({}, ["audio", "video", "img", "source", "image", "track"]);
  let Ao = null;
  const Xl = de({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), ps = "http://www.w3.org/1998/Math/MathML", ms = "http://www.w3.org/2000/svg", Ut = "http://www.w3.org/1999/xhtml";
  let jr = Ut, To = !1, Oo = null;
  const Kp = de({}, [ps, ms, Ut], ra);
  let gs = de({}, ["mi", "mo", "mn", "ms", "mtext"]), ys = de({}, ["annotation-xml"]);
  const zp = de({}, ["title", "style", "font", "a", "script"]);
  let vn = null;
  const Vp = ["application/xhtml+xml", "text/html"], Hp = "text/html";
  let Fe = null, Mr = null;
  const Jp = r.createElement("form"), Zl = function(C) {
    return C instanceof RegExp || C instanceof Function;
  }, Co = function() {
    let C = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(Mr && Mr === C)) {
      if ((!C || typeof C != "object") && (C = {}), C = Lt(C), vn = // eslint-disable-next-line unicorn/prefer-includes
      Vp.indexOf(C.PARSER_MEDIA_TYPE) === -1 ? Hp : C.PARSER_MEDIA_TYPE, Fe = vn === "application/xhtml+xml" ? ra : _i, I = $t(C, "ALLOWED_TAGS") ? de({}, C.ALLOWED_TAGS, Fe) : F, L = $t(C, "ALLOWED_ATTR") ? de({}, C.ALLOWED_ATTR, Fe) : E, Oo = $t(C, "ALLOWED_NAMESPACES") ? de({}, C.ALLOWED_NAMESPACES, ra) : Kp, Ao = $t(C, "ADD_URI_SAFE_ATTR") ? de(Lt(Xl), C.ADD_URI_SAFE_ATTR, Fe) : Xl, bn = $t(C, "ADD_DATA_URI_TAGS") ? de(Lt(hs), C.ADD_DATA_URI_TAGS, Fe) : hs, lt = $t(C, "FORBID_CONTENTS") ? de({}, C.FORBID_CONTENTS, Fe) : Rr, B = $t(C, "FORBID_TAGS") ? de({}, C.FORBID_TAGS, Fe) : Lt({}), V = $t(C, "FORBID_ATTR") ? de({}, C.FORBID_ATTR, Fe) : Lt({}), ft = $t(C, "USE_PROFILES") ? C.USE_PROFILES : !1, ie = C.ALLOW_ARIA_ATTR !== !1, ne = C.ALLOW_DATA_ATTR !== !1, N = C.ALLOW_UNKNOWN_PROTOCOLS || !1, j = C.ALLOW_SELF_CLOSE_IN_ATTR !== !1, q = C.SAFE_FOR_TEMPLATES || !1, H = C.SAFE_FOR_XML !== !1, Z = C.WHOLE_DOCUMENT || !1, Ue = C.RETURN_DOM || !1, Be = C.RETURN_DOM_FRAGMENT || !1, qe = C.RETURN_TRUSTED_TYPE || !1, Ne = C.FORCE_BODY || !1, De = C.SANITIZE_DOM !== !1, qt = C.SANITIZE_NAMED_PROPS || !1, cr = C.KEEP_CONTENT !== !1, Ft = C.IN_PLACE || !1, K = C.ALLOWED_URI_REGEXP || Ah, jr = C.NAMESPACE || Ut, gs = C.MATHML_TEXT_INTEGRATION_POINTS || gs, ys = C.HTML_INTEGRATION_POINTS || ys, O = C.CUSTOM_ELEMENT_HANDLING || {}, C.CUSTOM_ELEMENT_HANDLING && Zl(C.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (O.tagNameCheck = C.CUSTOM_ELEMENT_HANDLING.tagNameCheck), C.CUSTOM_ELEMENT_HANDLING && Zl(C.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (O.attributeNameCheck = C.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), C.CUSTOM_ELEMENT_HANDLING && typeof C.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (O.allowCustomizedBuiltInElements = C.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), q && (ne = !1), Be && (Ue = !0), ft && (I = de({}, od), L = [], ft.html === !0 && (de(I, id), de(L, ad)), ft.svg === !0 && (de(I, sa), de(L, aa), de(L, fi)), ft.svgFilters === !0 && (de(I, ia), de(L, aa), de(L, fi)), ft.mathMl === !0 && (de(I, oa), de(L, ld), de(L, fi))), C.ADD_TAGS && (typeof C.ADD_TAGS == "function" ? J.tagCheck = C.ADD_TAGS : (I === F && (I = Lt(I)), de(I, C.ADD_TAGS, Fe))), C.ADD_ATTR && (typeof C.ADD_ATTR == "function" ? J.attributeCheck = C.ADD_ATTR : (L === E && (L = Lt(L)), de(L, C.ADD_ATTR, Fe))), C.ADD_URI_SAFE_ATTR && de(Ao, C.ADD_URI_SAFE_ATTR, Fe), C.FORBID_CONTENTS && (lt === Rr && (lt = Lt(lt)), de(lt, C.FORBID_CONTENTS, Fe)), C.ADD_FORBID_CONTENTS && (lt === Rr && (lt = Lt(lt)), de(lt, C.ADD_FORBID_CONTENTS, Fe)), cr && (I["#text"] = !0), Z && de(I, ["html", "head", "body"]), I.table && (de(I, ["tbody"]), delete B.tbody), C.TRUSTED_TYPES_POLICY) {
        if (typeof C.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw $n('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof C.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw $n('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        k = C.TRUSTED_TYPES_POLICY, v = k.createHTML("");
      } else
        k === void 0 && (k = Gv(p, s)), k !== null && typeof v == "string" && (v = k.createHTML(""));
      it && it(C), Mr = C;
    }
  }, ec = de({}, [...sa, ...ia, ...Dv]), tc = de({}, [...oa, ...Bv]), Wp = function(C) {
    let X = y(C);
    (!X || !X.tagName) && (X = {
      namespaceURI: jr,
      tagName: "template"
    });
    const G = _i(C.tagName), we = _i(X.tagName);
    return Oo[C.namespaceURI] ? C.namespaceURI === ms ? X.namespaceURI === Ut ? G === "svg" : X.namespaceURI === ps ? G === "svg" && (we === "annotation-xml" || gs[we]) : !!ec[G] : C.namespaceURI === ps ? X.namespaceURI === Ut ? G === "math" : X.namespaceURI === ms ? G === "math" && ys[we] : !!tc[G] : C.namespaceURI === Ut ? X.namespaceURI === ms && !ys[we] || X.namespaceURI === ps && !gs[we] ? !1 : !tc[G] && (zp[G] || !ec[G]) : !!(vn === "application/xhtml+xml" && Oo[C.namespaceURI]) : !1;
  }, ur = function(C) {
    _n(e.removed, {
      element: C
    });
    try {
      y(C).removeChild(C);
    } catch {
      m(C);
    }
  }, dr = function(C, X) {
    try {
      _n(e.removed, {
        attribute: X.getAttributeNode(C),
        from: X
      });
    } catch {
      _n(e.removed, {
        attribute: null,
        from: X
      });
    }
    if (X.removeAttribute(C), C === "is")
      if (Ue || Be)
        try {
          ur(X);
        } catch {
        }
      else
        try {
          X.setAttribute(C, "");
        } catch {
        }
  }, rc = function(C) {
    let X = null, G = null;
    if (Ne)
      C = "<remove></remove>" + C;
    else {
      const Te = na(C, /^[\r\n\t ]+/);
      G = Te && Te[0];
    }
    vn === "application/xhtml+xml" && jr === Ut && (C = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + C + "</body></html>");
    const we = k ? k.createHTML(C) : C;
    if (jr === Ut)
      try {
        X = new f().parseFromString(we, vn);
      } catch {
      }
    if (!X || !X.documentElement) {
      X = x.createDocument(jr, "template", null);
      try {
        X.documentElement.innerHTML = To ? v : we;
      } catch {
      }
    }
    const Ve = X.body || X.documentElement;
    return C && G && Ve.insertBefore(r.createTextNode(G), Ve.childNodes[0] || null), jr === Ut ? T.call(X, Z ? "html" : "body")[0] : Z ? X.documentElement : Ve;
  }, nc = function(C) {
    return S.call(
      C.ownerDocument || C,
      C,
      // eslint-disable-next-line no-bitwise
      c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION,
      null
    );
  }, No = function(C) {
    return C instanceof u && (typeof C.nodeName != "string" || typeof C.textContent != "string" || typeof C.removeChild != "function" || !(C.attributes instanceof d) || typeof C.removeAttribute != "function" || typeof C.setAttribute != "function" || typeof C.namespaceURI != "string" || typeof C.insertBefore != "function" || typeof C.hasChildNodes != "function");
  }, sc = function(C) {
    return typeof a == "function" && C instanceof a;
  };
  function Kt(C, X, G) {
    di(C, (we) => {
      we.call(e, X, G, Mr);
    });
  }
  const ic = function(C) {
    let X = null;
    if (Kt(R.beforeSanitizeElements, C, null), No(C))
      return ur(C), !0;
    const G = Fe(C.nodeName);
    if (Kt(R.uponSanitizeElement, C, {
      tagName: G,
      allowedTags: I
    }), H && C.hasChildNodes() && !sc(C.firstElementChild) && Qe(/<[/\w!]/g, C.innerHTML) && Qe(/<[/\w!]/g, C.textContent) || C.nodeType === Tn.progressingInstruction || H && C.nodeType === Tn.comment && Qe(/<[/\w]/g, C.data))
      return ur(C), !0;
    if (!(J.tagCheck instanceof Function && J.tagCheck(G)) && (!I[G] || B[G])) {
      if (!B[G] && ac(G) && (O.tagNameCheck instanceof RegExp && Qe(O.tagNameCheck, G) || O.tagNameCheck instanceof Function && O.tagNameCheck(G)))
        return !1;
      if (cr && !lt[G]) {
        const we = y(C) || C.parentNode, Ve = h(C) || C.childNodes;
        if (Ve && we) {
          const Te = Ve.length;
          for (let zt = Te - 1; zt >= 0; --zt) {
            const kt = g(Ve[zt], !0);
            kt.__removalCount = (C.__removalCount || 0) + 1, we.insertBefore(kt, w(C));
          }
        }
      }
      return ur(C), !0;
    }
    return C instanceof l && !Wp(C) || (G === "noscript" || G === "noembed" || G === "noframes") && Qe(/<\/no(script|embed|frames)/i, C.innerHTML) ? (ur(C), !0) : (q && C.nodeType === Tn.text && (X = C.textContent, di([D, U, Y], (we) => {
      X = En(X, we, " ");
    }), C.textContent !== X && (_n(e.removed, {
      element: C.cloneNode()
    }), C.textContent = X)), Kt(R.afterSanitizeElements, C, null), !1);
  }, oc = function(C, X, G) {
    if (De && (X === "id" || X === "name") && (G in r || G in Jp))
      return !1;
    if (!(ne && !V[X] && Qe(se, X)) && !(ie && Qe(be, X)) && !(J.attributeCheck instanceof Function && J.attributeCheck(X, C))) {
      if (!L[X] || V[X]) {
        if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          !(ac(C) && (O.tagNameCheck instanceof RegExp && Qe(O.tagNameCheck, C) || O.tagNameCheck instanceof Function && O.tagNameCheck(C)) && (O.attributeNameCheck instanceof RegExp && Qe(O.attributeNameCheck, X) || O.attributeNameCheck instanceof Function && O.attributeNameCheck(X, C)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          X === "is" && O.allowCustomizedBuiltInElements && (O.tagNameCheck instanceof RegExp && Qe(O.tagNameCheck, G) || O.tagNameCheck instanceof Function && O.tagNameCheck(G)))
        ) return !1;
      } else if (!Ao[X] && !Qe(K, En(G, W, "")) && !((X === "src" || X === "xlink:href" || X === "href") && C !== "script" && Lv(G, "data:") === 0 && bn[C]) && !(N && !Qe(xe, En(G, W, ""))) && G)
        return !1;
    }
    return !0;
  }, ac = function(C) {
    return C !== "annotation-xml" && na(C, ce);
  }, lc = function(C) {
    Kt(R.beforeSanitizeAttributes, C, null);
    const {
      attributes: X
    } = C;
    if (!X || No(C))
      return;
    const G = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: L,
      forceKeepAttr: void 0
    };
    let we = X.length;
    for (; we--; ) {
      const Ve = X[we], {
        name: Te,
        namespaceURI: zt,
        value: kt
      } = Ve, xt = Fe(Te), Io = kt;
      let He = Te === "value" ? Io : Rv(Io);
      if (G.attrName = xt, G.attrValue = He, G.keepAttr = !0, G.forceKeepAttr = void 0, Kt(R.uponSanitizeAttribute, C, G), He = G.attrValue, qt && (xt === "id" || xt === "name") && (dr(Te, C), He = at + He), H && Qe(/((--!?|])>)|<\/(style|title|textarea)/i, He)) {
        dr(Te, C);
        continue;
      }
      if (xt === "attributename" && na(He, "href")) {
        dr(Te, C);
        continue;
      }
      if (G.forceKeepAttr)
        continue;
      if (!G.keepAttr) {
        dr(Te, C);
        continue;
      }
      if (!j && Qe(/\/>/i, He)) {
        dr(Te, C);
        continue;
      }
      q && di([D, U, Y], (Yp) => {
        He = En(He, Yp, " ");
      });
      const cc = Fe(C.nodeName);
      if (!oc(cc, xt, He)) {
        dr(Te, C);
        continue;
      }
      if (k && typeof p == "object" && typeof p.getAttributeType == "function" && !zt)
        switch (p.getAttributeType(cc, xt)) {
          case "TrustedHTML": {
            He = k.createHTML(He);
            break;
          }
          case "TrustedScriptURL": {
            He = k.createScriptURL(He);
            break;
          }
        }
      if (He !== Io)
        try {
          zt ? C.setAttributeNS(zt, Te, He) : C.setAttribute(Te, He), No(C) ? ur(C) : sd(e.removed);
        } catch {
          dr(Te, C);
        }
    }
    Kt(R.afterSanitizeAttributes, C, null);
  }, Gp = function C(X) {
    let G = null;
    const we = nc(X);
    for (Kt(R.beforeSanitizeShadowDOM, X, null); G = we.nextNode(); )
      Kt(R.uponSanitizeShadowNode, G, null), ic(G), lc(G), G.content instanceof i && C(G.content);
    Kt(R.afterSanitizeShadowDOM, X, null);
  };
  return e.sanitize = function(C) {
    let X = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, G = null, we = null, Ve = null, Te = null;
    if (To = !C, To && (C = "<!-->"), typeof C != "string" && !sc(C))
      if (typeof C.toString == "function") {
        if (C = C.toString(), typeof C != "string")
          throw $n("dirty is not a string, aborting");
      } else
        throw $n("toString is not a function");
    if (!e.isSupported)
      return C;
    if (le || Co(X), e.removed = [], typeof C == "string" && (Ft = !1), Ft) {
      if (C.nodeName) {
        const xt = Fe(C.nodeName);
        if (!I[xt] || B[xt])
          throw $n("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (C instanceof a)
      G = rc("<!---->"), we = G.ownerDocument.importNode(C, !0), we.nodeType === Tn.element && we.nodeName === "BODY" || we.nodeName === "HTML" ? G = we : G.appendChild(we);
    else {
      if (!Ue && !q && !Z && // eslint-disable-next-line unicorn/prefer-includes
      C.indexOf("<") === -1)
        return k && qe ? k.createHTML(C) : C;
      if (G = rc(C), !G)
        return Ue ? null : qe ? v : "";
    }
    G && Ne && ur(G.firstChild);
    const zt = nc(Ft ? C : G);
    for (; Ve = zt.nextNode(); )
      ic(Ve), lc(Ve), Ve.content instanceof i && Gp(Ve.content);
    if (Ft)
      return C;
    if (Ue) {
      if (Be)
        for (Te = _.call(G.ownerDocument); G.firstChild; )
          Te.appendChild(G.firstChild);
      else
        Te = G;
      return (L.shadowroot || L.shadowrootmode) && (Te = P.call(n, Te, !0)), Te;
    }
    let kt = Z ? G.outerHTML : G.innerHTML;
    return Z && I["!doctype"] && G.ownerDocument && G.ownerDocument.doctype && G.ownerDocument.doctype.name && Qe(Th, G.ownerDocument.doctype.name) && (kt = "<!DOCTYPE " + G.ownerDocument.doctype.name + `>
` + kt), q && di([D, U, Y], (xt) => {
      kt = En(kt, xt, " ");
    }), k && qe ? k.createHTML(kt) : kt;
  }, e.setConfig = function() {
    let C = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Co(C), le = !0;
  }, e.clearConfig = function() {
    Mr = null, le = !1;
  }, e.isValidAttribute = function(C, X, G) {
    Mr || Co({});
    const we = Fe(C), Ve = Fe(X);
    return oc(we, Ve, G);
  }, e.addHook = function(C, X) {
    typeof X == "function" && _n(R[C], X);
  }, e.removeHook = function(C, X) {
    if (X !== void 0) {
      const G = Iv(R[C], X);
      return G === -1 ? void 0 : Pv(R[C], G, 1)[0];
    }
    return sd(R[C]);
  }, e.removeHooks = function(C) {
    R[C] = [];
  }, e.removeAllHooks = function() {
    R = ud();
  }, e;
}
var Ka = Oh();
function $l() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Pr = $l();
function Ch(t) {
  Pr = t;
}
var Kn = { exec: () => null };
function ye(t, e = "") {
  let r = typeof t == "string" ? t : t.source, n = { replace: (s, i) => {
    let o = typeof i == "string" ? i : i.source;
    return o = o.replace(et.caret, "$1"), r = r.replace(s, o), n;
  }, getRegex: () => new RegExp(r, e) };
  return n;
}
var Yv = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), et = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i") }, Qv = /^(?:[ \t]*(?:\n|$))+/, Xv = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Zv = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, as = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ew = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Al = /(?:[*+-]|\d{1,9}[.)])/, Nh = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Ih = ye(Nh).replace(/bull/g, Al).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), tw = ye(Nh).replace(/bull/g, Al).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Tl = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, rw = /^[^\n]+/, Ol = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, nw = ye(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ol).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), sw = ye(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Al).getRegex(), po = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Cl = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, iw = ye("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Cl).replace("tag", po).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ph = ye(Tl).replace("hr", as).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", po).getRegex(), ow = ye(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ph).getRegex(), Nl = { blockquote: ow, code: Xv, def: nw, fences: Zv, heading: ew, hr: as, html: iw, lheading: Ih, list: sw, newline: Qv, paragraph: Ph, table: Kn, text: rw }, dd = ye("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", as).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", po).getRegex(), aw = { ...Nl, lheading: tw, table: dd, paragraph: ye(Tl).replace("hr", as).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", dd).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", po).getRegex() }, lw = { ...Nl, html: ye(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Cl).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Kn, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: ye(Tl).replace("hr", as).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ih).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, cw = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, uw = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Lh = /^( {2,}|\\)\n(?!\s*$)/, dw = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, mo = /[\p{P}\p{S}]/u, Il = /[\s\p{P}\p{S}]/u, Rh = /[^\s\p{P}\p{S}]/u, fw = ye(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Il).getRegex(), jh = /(?!~)[\p{P}\p{S}]/u, hw = /(?!~)[\s\p{P}\p{S}]/u, pw = /(?:[^\s\p{P}\p{S}]|~)/u, mw = ye(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Yv ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Mh = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, gw = ye(Mh, "u").replace(/punct/g, mo).getRegex(), yw = ye(Mh, "u").replace(/punct/g, jh).getRegex(), Dh = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", bw = ye(Dh, "gu").replace(/notPunctSpace/g, Rh).replace(/punctSpace/g, Il).replace(/punct/g, mo).getRegex(), vw = ye(Dh, "gu").replace(/notPunctSpace/g, pw).replace(/punctSpace/g, hw).replace(/punct/g, jh).getRegex(), ww = ye("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Rh).replace(/punctSpace/g, Il).replace(/punct/g, mo).getRegex(), kw = ye(/\\(punct)/, "gu").replace(/punct/g, mo).getRegex(), xw = ye(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Sw = ye(Cl).replace("(?:-->|$)", "-->").getRegex(), _w = ye("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Sw).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), zi = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Ew = ye(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", zi).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Bh = ye(/^!?\[(label)\]\[(ref)\]/).replace("label", zi).replace("ref", Ol).getRegex(), qh = ye(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ol).getRegex(), $w = ye("reflink|nolink(?!\\()", "g").replace("reflink", Bh).replace("nolink", qh).getRegex(), fd = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Pl = { _backpedal: Kn, anyPunctuation: kw, autolink: xw, blockSkip: mw, br: Lh, code: uw, del: Kn, emStrongLDelim: gw, emStrongRDelimAst: bw, emStrongRDelimUnd: ww, escape: cw, link: Ew, nolink: qh, punctuation: fw, reflink: Bh, reflinkSearch: $w, tag: _w, text: dw, url: Kn }, Aw = { ...Pl, link: ye(/^!?\[(label)\]\((.*?)\)/).replace("label", zi).getRegex(), reflink: ye(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", zi).getRegex() }, za = { ...Pl, emStrongRDelimAst: vw, emStrongLDelim: yw, url: ye(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", fd).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: ye(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", fd).getRegex() }, Tw = { ...za, br: ye(Lh).replace("{2,}", "*").getRegex(), text: ye(za.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, hi = { normal: Nl, gfm: aw, pedantic: lw }, On = { normal: Pl, gfm: za, breaks: Tw, pedantic: Aw }, Ow = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, hd = (t) => Ow[t];
function Wt(t, e) {
  if (e) {
    if (et.escapeTest.test(t)) return t.replace(et.escapeReplace, hd);
  } else if (et.escapeTestNoEncode.test(t)) return t.replace(et.escapeReplaceNoEncode, hd);
  return t;
}
function pd(t) {
  try {
    t = encodeURI(t).replace(et.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function md(t, e) {
  let r = t.replace(et.findPipe, (i, o, a) => {
    let l = !1, c = o;
    for (; --c >= 0 && a[c] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), n = r.split(et.splitPipe), s = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; s < n.length; s++) n[s] = n[s].trim().replace(et.slashPipe, "|");
  return n;
}
function Cn(t, e, r) {
  let n = t.length;
  if (n === 0) return "";
  let s = 0;
  for (; s < n && t.charAt(n - s - 1) === e; )
    s++;
  return t.slice(0, n - s);
}
function Cw(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let n = 0; n < t.length; n++) if (t[n] === "\\") n++;
  else if (t[n] === e[0]) r++;
  else if (t[n] === e[1] && (r--, r < 0)) return n;
  return r > 0 ? -2 : -1;
}
function gd(t, e, r, n, s) {
  let i = e.href, o = e.title || null, a = t[1].replace(s.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let l = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: r, href: i, title: o, text: a, tokens: n.inlineTokens(a) };
  return n.state.inLink = !1, l;
}
function Nw(t, e, r) {
  let n = t.match(r.other.indentCodeCompensation);
  if (n === null) return e;
  let s = n[1];
  return e.split(`
`).map((i) => {
    let o = i.match(r.other.beginningSpace);
    if (o === null) return i;
    let [a] = o;
    return a.length >= s.length ? i.slice(s.length) : i;
  }).join(`
`);
}
var Vi = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || Pr;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let r = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : Cn(r, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let r = e[0], n = Nw(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let n = Cn(r, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (r = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: Cn(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let r = Cn(e[0], `
`).split(`
`), n = "", s = "", i = [];
      for (; r.length > 0; ) {
        let o = !1, a = [], l;
        for (l = 0; l < r.length; l++) if (this.rules.other.blockquoteStart.test(r[l])) a.push(r[l]), o = !0;
        else if (!o) a.push(r[l]);
        else break;
        r = r.slice(l);
        let c = a.join(`
`), d = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? `${n}
${c}` : c, s = s ? `${s}
${d}` : d;
        let u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(d, i, !0), this.lexer.state.top = u, r.length === 0) break;
        let f = i.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let p = f, b = p.raw + `
` + r.join(`
`), g = this.blockquote(b);
          i[i.length - 1] = g, n = n.substring(0, n.length - p.raw.length) + g.raw, s = s.substring(0, s.length - p.text.length) + g.text;
          break;
        } else if (f?.type === "list") {
          let p = f, b = p.raw + `
` + r.join(`
`), g = this.list(b);
          i[i.length - 1] = g, n = n.substring(0, n.length - f.raw.length) + g.raw, s = s.substring(0, s.length - p.raw.length) + g.raw, r = b.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: n, tokens: i, text: s };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let r = e[1].trim(), n = r.length > 1, s = { type: "list", raw: "", ordered: n, start: n ? +r.slice(0, -1) : "", loose: !1, items: [] };
      r = n ? `\\d{1,9}\\${r.slice(-1)}` : `\\${r}`, this.options.pedantic && (r = n ? r : "[*+-]");
      let i = this.rules.other.listItemRegex(r), o = !1;
      for (; t; ) {
        let l = !1, c = "", d = "";
        if (!(e = i.exec(t)) || this.rules.block.hr.test(t)) break;
        c = e[0], t = t.substring(c.length);
        let u = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (g) => " ".repeat(3 * g.length)), f = t.split(`
`, 1)[0], p = !u.trim(), b = 0;
        if (this.options.pedantic ? (b = 2, d = u.trimStart()) : p ? b = e[1].length + 1 : (b = e[2].search(this.rules.other.nonSpaceChar), b = b > 4 ? 1 : b, d = u.slice(b), b += e[1].length), p && this.rules.other.blankLine.test(f) && (c += f + `
`, t = t.substring(f.length + 1), l = !0), !l) {
          let g = this.rules.other.nextBulletRegex(b), m = this.rules.other.hrRegex(b), w = this.rules.other.fencesBeginRegex(b), h = this.rules.other.headingBeginRegex(b), y = this.rules.other.htmlBeginRegex(b);
          for (; t; ) {
            let k = t.split(`
`, 1)[0], v;
            if (f = k, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), v = f) : v = f.replace(this.rules.other.tabCharGlobal, "    "), w.test(f) || h.test(f) || y.test(f) || g.test(f) || m.test(f)) break;
            if (v.search(this.rules.other.nonSpaceChar) >= b || !f.trim()) d += `
` + v.slice(b);
            else {
              if (p || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || w.test(u) || h.test(u) || m.test(u)) break;
              d += `
` + f;
            }
            !p && !f.trim() && (p = !0), c += k + `
`, t = t.substring(k.length + 1), u = v.slice(b);
          }
        }
        s.loose || (o ? s.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (o = !0)), s.items.push({ type: "list_item", raw: c, task: !!this.options.gfm && this.rules.other.listIsTask.test(d), loose: !1, text: d, tokens: [] }), s.raw += c;
      }
      let a = s.items.at(-1);
      if (a) a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else return;
      s.raw = s.raw.trimEnd();
      for (let l of s.items) {
        if (this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
          if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
            l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let d = this.lexer.inlineQueue.length - 1; d >= 0; d--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[d].src)) {
              this.lexer.inlineQueue[d].src = this.lexer.inlineQueue[d].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let c = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (c) {
            let d = { type: "checkbox", raw: c[0] + " ", checked: c[0] !== "[ ]" };
            l.checked = d.checked, s.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = d.raw + l.tokens[0].raw, l.tokens[0].text = d.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(d)) : l.tokens.unshift({ type: "paragraph", raw: d.raw, text: d.raw, tokens: [d] }) : l.tokens.unshift(d);
          }
        }
        if (!s.loose) {
          let c = l.tokens.filter((u) => u.type === "space"), d = c.length > 0 && c.some((u) => this.rules.other.anyLine.test(u.raw));
          s.loose = d;
        }
      }
      if (s.loose) for (let l of s.items) {
        l.loose = !0;
        for (let c of l.tokens) c.type === "text" && (c.type = "paragraph");
      }
      return s;
    }
  }
  html(t) {
    let e = this.rules.block.html.exec(t);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      let r = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: r, raw: e[0], href: n, title: s };
    }
  }
  table(t) {
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let r = md(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === n.length) {
      for (let o of n) this.rules.other.tableAlignRight.test(o) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? i.align.push("left") : i.align.push(null);
      for (let o = 0; o < r.length; o++) i.header.push({ text: r[o], tokens: this.lexer.inline(r[o]), header: !0, align: i.align[o] });
      for (let o of s) i.rows.push(md(o, i.header.length).map((a, l) => ({ text: a, tokens: this.lexer.inline(a), header: !1, align: i.align[l] })));
      return i;
    }
  }
  lheading(t) {
    let e = this.rules.block.lheading.exec(t);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(t) {
    let e = this.rules.block.paragraph.exec(t);
    if (e) {
      let r = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: r, tokens: this.lexer.inline(r) };
    }
  }
  text(t) {
    let e = this.rules.block.text.exec(t);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(t) {
    let e = this.rules.inline.escape.exec(t);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(t) {
    let e = this.rules.inline.tag.exec(t);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(t) {
    let e = this.rules.inline.link.exec(t);
    if (e) {
      let r = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let i = Cn(r.slice(0, -1), "\\");
        if ((r.length - i.length) % 2 === 0) return;
      } else {
        let i = Cw(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let o = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, o).trim(), e[3] = "";
        }
      }
      let n = e[2], s = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(n);
        i && (n = i[1], s = i[3]);
      } else s = e[3] ? e[3].slice(1, -1) : "";
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? n = n.slice(1) : n = n.slice(1, -1)), gd(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: s && s.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let r;
    if ((r = this.rules.inline.reflink.exec(t)) || (r = this.rules.inline.nolink.exec(t))) {
      let n = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = e[n.toLowerCase()];
      if (!s) {
        let i = r[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return gd(r, s, r[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, r = "") {
    let n = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!n || n[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(n[1] || n[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let s = [...n[0]].length - 1, i, o, a = s, l = 0, c = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c.lastIndex = 0, e = e.slice(-1 * t.length + s); (n = c.exec(e)) != null; ) {
        if (i = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !i) continue;
        if (o = [...i].length, n[3] || n[4]) {
          a += o;
          continue;
        } else if ((n[5] || n[6]) && s % 3 && !((s + o) % 3)) {
          l += o;
          continue;
        }
        if (a -= o, a > 0) continue;
        o = Math.min(o, o + a + l);
        let d = [...n[0]][0].length, u = t.slice(0, s + n.index + d + o);
        if (Math.min(s, o) % 2) {
          let p = u.slice(1, -1);
          return { type: "em", raw: u, text: p, tokens: this.lexer.inlineTokens(p) };
        }
        let f = u.slice(2, -2);
        return { type: "strong", raw: u, text: f, tokens: this.lexer.inlineTokens(f) };
      }
    }
  }
  codespan(t) {
    let e = this.rules.inline.code.exec(t);
    if (e) {
      let r = e[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(r), s = this.rules.other.startingSpaceChar.test(r) && this.rules.other.endingSpaceChar.test(r);
      return n && s && (r = r.substring(1, r.length - 1)), { type: "codespan", raw: e[0], text: r };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t) {
    let e = this.rules.inline.del.exec(t);
    if (e) return { type: "del", raw: e[0], text: e[2], tokens: this.lexer.inlineTokens(e[2]) };
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let r, n;
      return e[2] === "@" ? (r = e[1], n = "mailto:" + r) : (r = e[1], n = r), { type: "link", raw: e[0], text: r, href: n, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  url(t) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let r, n;
      if (e[2] === "@") r = e[0], n = "mailto:" + r;
      else {
        let s;
        do
          s = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (s !== e[0]);
        r = e[0], e[1] === "www." ? n = "http://" + e[0] : n = e[0];
      }
      return { type: "link", raw: e[0], text: r, href: n, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let r = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: r };
    }
  }
}, At = class Va {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Pr, this.options.tokenizer = this.options.tokenizer || new Vi(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: et, block: hi.normal, inline: On.normal };
    this.options.pedantic ? (r.block = hi.pedantic, r.inline = On.pedantic) : this.options.gfm && (r.block = hi.gfm, this.options.breaks ? r.inline = On.breaks : r.inline = On.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: hi, inline: On };
  }
  static lex(e, r) {
    return new Va(r).lex(e);
  }
  static lexInline(e, r) {
    return new Va(r).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(et.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let n = this.inlineQueue[r];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, r = [], n = !1) {
    for (this.options.pedantic && (e = e.replace(et.tabCharGlobal, "    ").replace(et.spaceLine, "")); e; ) {
      let s;
      if (this.options.extensions?.block?.some((o) => (s = o.call({ lexer: this }, e, r)) ? (e = e.substring(s.raw.length), r.push(s), !0) : !1)) continue;
      if (s = this.tokenizer.space(e)) {
        e = e.substring(s.raw.length);
        let o = r.at(-1);
        s.raw.length === 1 && o !== void 0 ? o.raw += `
` : r.push(s);
        continue;
      }
      if (s = this.tokenizer.code(e)) {
        e = e.substring(s.raw.length);
        let o = r.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + s.raw, o.text += `
` + s.text, this.inlineQueue.at(-1).src = o.text) : r.push(s);
        continue;
      }
      if (s = this.tokenizer.fences(e)) {
        e = e.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.heading(e)) {
        e = e.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.hr(e)) {
        e = e.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.blockquote(e)) {
        e = e.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.list(e)) {
        e = e.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.html(e)) {
        e = e.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.def(e)) {
        e = e.substring(s.raw.length);
        let o = r.at(-1);
        o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + s.raw, o.text += `
` + s.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = { href: s.href, title: s.title }, r.push(s));
        continue;
      }
      if (s = this.tokenizer.table(e)) {
        e = e.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.lheading(e)) {
        e = e.substring(s.raw.length), r.push(s);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let o = 1 / 0, a = e.slice(1), l;
        this.options.extensions.startBlock.forEach((c) => {
          l = c.call({ lexer: this }, a), typeof l == "number" && l >= 0 && (o = Math.min(o, l));
        }), o < 1 / 0 && o >= 0 && (i = e.substring(0, o + 1));
      }
      if (this.state.top && (s = this.tokenizer.paragraph(i))) {
        let o = r.at(-1);
        n && o?.type === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + s.raw, o.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : r.push(s), n = i.length !== e.length, e = e.substring(s.raw.length);
        continue;
      }
      if (s = this.tokenizer.text(e)) {
        e = e.substring(s.raw.length);
        let o = r.at(-1);
        o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + s.raw, o.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : r.push(s);
        continue;
      }
      if (e) {
        let o = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(o);
          break;
        } else throw new Error(o);
      }
    }
    return this.state.top = !0, r;
  }
  inline(e, r = []) {
    return this.inlineQueue.push({ src: e, tokens: r }), r;
  }
  inlineTokens(e, r = []) {
    let n = e, s = null;
    if (this.tokens.links) {
      let l = Object.keys(this.tokens.links);
      if (l.length > 0) for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) l.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, s.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) i = s[2] ? s[2].length : 0, n = n.slice(0, s.index + i) + "[" + "a".repeat(s[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let o = !1, a = "";
    for (; e; ) {
      o || (a = ""), o = !1;
      let l;
      if (this.options.extensions?.inline?.some((d) => (l = d.call({ lexer: this }, e, r)) ? (e = e.substring(l.raw.length), r.push(l), !0) : !1)) continue;
      if (l = this.tokenizer.escape(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.tag(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.link(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(l.raw.length);
        let d = r.at(-1);
        l.type === "text" && d?.type === "text" ? (d.raw += l.raw, d.text += l.text) : r.push(l);
        continue;
      }
      if (l = this.tokenizer.emStrong(e, n, a)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.codespan(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.br(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.del(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.autolink(e)) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      if (!this.state.inLink && (l = this.tokenizer.url(e))) {
        e = e.substring(l.raw.length), r.push(l);
        continue;
      }
      let c = e;
      if (this.options.extensions?.startInline) {
        let d = 1 / 0, u = e.slice(1), f;
        this.options.extensions.startInline.forEach((p) => {
          f = p.call({ lexer: this }, u), typeof f == "number" && f >= 0 && (d = Math.min(d, f));
        }), d < 1 / 0 && d >= 0 && (c = e.substring(0, d + 1));
      }
      if (l = this.tokenizer.inlineText(c)) {
        e = e.substring(l.raw.length), l.raw.slice(-1) !== "_" && (a = l.raw.slice(-1)), o = !0;
        let d = r.at(-1);
        d?.type === "text" ? (d.raw += l.raw, d.text += l.text) : r.push(l);
        continue;
      }
      if (e) {
        let d = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(d);
          break;
        } else throw new Error(d);
      }
    }
    return r;
  }
}, Hi = class {
  options;
  parser;
  constructor(t) {
    this.options = t || Pr;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: r }) {
    let n = (e || "").match(et.notSpaceStart)?.[0], s = t.replace(et.endingNewline, "") + `
`;
    return n ? '<pre><code class="language-' + Wt(n) + '">' + (r ? s : Wt(s, !0)) + `</code></pre>
` : "<pre><code>" + (r ? s : Wt(s, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  def(t) {
    return "";
  }
  heading({ tokens: t, depth: e }) {
    return `<h${e}>${this.parser.parseInline(t)}</h${e}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    let e = t.ordered, r = t.start, n = "";
    for (let o = 0; o < t.items.length; o++) {
      let a = t.items[o];
      n += this.listitem(a);
    }
    let s = e ? "ol" : "ul", i = e && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + s + i + `>
` + n + "</" + s + `>
`;
  }
  listitem(t) {
    return `<li>${this.parser.parse(t.tokens)}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let e = "", r = "";
    for (let s = 0; s < t.header.length; s++) r += this.tablecell(t.header[s]);
    e += this.tablerow({ text: r });
    let n = "";
    for (let s = 0; s < t.rows.length; s++) {
      let i = t.rows[s];
      r = "";
      for (let o = 0; o < i.length; o++) r += this.tablecell(i[o]);
      n += this.tablerow({ text: r });
    }
    return n && (n = `<tbody>${n}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + n + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    let e = this.parser.parseInline(t.tokens), r = t.header ? "th" : "td";
    return (t.align ? `<${r} align="${t.align}">` : `<${r}>`) + e + `</${r}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${Wt(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: r }) {
    let n = this.parser.parseInline(r), s = pd(t);
    if (s === null) return n;
    t = s;
    let i = '<a href="' + t + '"';
    return e && (i += ' title="' + Wt(e) + '"'), i += ">" + n + "</a>", i;
  }
  image({ href: t, title: e, text: r, tokens: n }) {
    n && (r = this.parser.parseInline(n, this.parser.textRenderer));
    let s = pd(t);
    if (s === null) return Wt(r);
    t = s;
    let i = `<img src="${t}" alt="${r}"`;
    return e && (i += ` title="${Wt(e)}"`), i += ">", i;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Wt(t.text);
  }
}, Ll = class {
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
  checkbox({ raw: t }) {
    return t;
  }
}, Tt = class Ha {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Pr, this.options.renderer = this.options.renderer || new Hi(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Ll();
  }
  static parse(e, r) {
    return new Ha(r).parse(e);
  }
  static parseInline(e, r) {
    return new Ha(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let n = 0; n < e.length; n++) {
      let s = e[n];
      if (this.options.extensions?.renderers?.[s.type]) {
        let o = s, a = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (a !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(o.type)) {
          r += a || "";
          continue;
        }
      }
      let i = s;
      switch (i.type) {
        case "space": {
          r += this.renderer.space(i);
          break;
        }
        case "hr": {
          r += this.renderer.hr(i);
          break;
        }
        case "heading": {
          r += this.renderer.heading(i);
          break;
        }
        case "code": {
          r += this.renderer.code(i);
          break;
        }
        case "table": {
          r += this.renderer.table(i);
          break;
        }
        case "blockquote": {
          r += this.renderer.blockquote(i);
          break;
        }
        case "list": {
          r += this.renderer.list(i);
          break;
        }
        case "checkbox": {
          r += this.renderer.checkbox(i);
          break;
        }
        case "html": {
          r += this.renderer.html(i);
          break;
        }
        case "def": {
          r += this.renderer.def(i);
          break;
        }
        case "paragraph": {
          r += this.renderer.paragraph(i);
          break;
        }
        case "text": {
          r += this.renderer.text(i);
          break;
        }
        default: {
          let o = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return r;
  }
  parseInline(e, r = this.renderer) {
    let n = "";
    for (let s = 0; s < e.length; s++) {
      let i = e[s];
      if (this.options.extensions?.renderers?.[i.type]) {
        let a = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (a !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += a || "";
          continue;
        }
      }
      let o = i;
      switch (o.type) {
        case "escape": {
          n += r.text(o);
          break;
        }
        case "html": {
          n += r.html(o);
          break;
        }
        case "link": {
          n += r.link(o);
          break;
        }
        case "image": {
          n += r.image(o);
          break;
        }
        case "checkbox": {
          n += r.checkbox(o);
          break;
        }
        case "strong": {
          n += r.strong(o);
          break;
        }
        case "em": {
          n += r.em(o);
          break;
        }
        case "codespan": {
          n += r.codespan(o);
          break;
        }
        case "br": {
          n += r.br(o);
          break;
        }
        case "del": {
          n += r.del(o);
          break;
        }
        case "text": {
          n += r.text(o);
          break;
        }
        default: {
          let a = 'Token with "' + o.type + '" type was not found.';
          if (this.options.silent) return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return n;
  }
}, jn = class {
  options;
  block;
  constructor(t) {
    this.options = t || Pr;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
  processAllTokens(t) {
    return t;
  }
  emStrongMask(t) {
    return t;
  }
  provideLexer() {
    return this.block ? At.lex : At.lexInline;
  }
  provideParser() {
    return this.block ? Tt.parse : Tt.parseInline;
  }
}, Iw = class {
  defaults = $l();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = Tt;
  Renderer = Hi;
  TextRenderer = Ll;
  Lexer = At;
  Tokenizer = Vi;
  Hooks = jn;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, e) {
    let r = [];
    for (let n of t) switch (r = r.concat(e.call(this, n)), n.type) {
      case "table": {
        let s = n;
        for (let i of s.header) r = r.concat(this.walkTokens(i.tokens, e));
        for (let i of s.rows) for (let o of i) r = r.concat(this.walkTokens(o.tokens, e));
        break;
      }
      case "list": {
        let s = n;
        r = r.concat(this.walkTokens(s.items, e));
        break;
      }
      default: {
        let s = n;
        this.defaults.extensions?.childTokens?.[s.type] ? this.defaults.extensions.childTokens[s.type].forEach((i) => {
          let o = s[i].flat(1 / 0);
          r = r.concat(this.walkTokens(o, e));
        }) : s.tokens && (r = r.concat(this.walkTokens(s.tokens, e)));
      }
    }
    return r;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((r) => {
      let n = { ...r };
      if (n.async = this.defaults.async || n.async || !1, r.extensions && (r.extensions.forEach((s) => {
        if (!s.name) throw new Error("extension name required");
        if ("renderer" in s) {
          let i = e.renderers[s.name];
          i ? e.renderers[s.name] = function(...o) {
            let a = s.renderer.apply(this, o);
            return a === !1 && (a = i.apply(this, o)), a;
          } : e.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[s.level];
          i ? i.unshift(s.tokenizer) : e[s.level] = [s.tokenizer], s.start && (s.level === "block" ? e.startBlock ? e.startBlock.push(s.start) : e.startBlock = [s.start] : s.level === "inline" && (e.startInline ? e.startInline.push(s.start) : e.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (e.childTokens[s.name] = s.childTokens);
      }), n.extensions = e), r.renderer) {
        let s = this.defaults.renderer || new Hi(this.defaults);
        for (let i in r.renderer) {
          if (!(i in s)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let o = i, a = r.renderer[o], l = s[o];
          s[o] = (...c) => {
            let d = a.apply(s, c);
            return d === !1 && (d = l.apply(s, c)), d || "";
          };
        }
        n.renderer = s;
      }
      if (r.tokenizer) {
        let s = this.defaults.tokenizer || new Vi(this.defaults);
        for (let i in r.tokenizer) {
          if (!(i in s)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let o = i, a = r.tokenizer[o], l = s[o];
          s[o] = (...c) => {
            let d = a.apply(s, c);
            return d === !1 && (d = l.apply(s, c)), d;
          };
        }
        n.tokenizer = s;
      }
      if (r.hooks) {
        let s = this.defaults.hooks || new jn();
        for (let i in r.hooks) {
          if (!(i in s)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let o = i, a = r.hooks[o], l = s[o];
          jn.passThroughHooks.has(i) ? s[o] = (c) => {
            if (this.defaults.async && jn.passThroughHooksRespectAsync.has(i)) return (async () => {
              let u = await a.call(s, c);
              return l.call(s, u);
            })();
            let d = a.call(s, c);
            return l.call(s, d);
          } : s[o] = (...c) => {
            if (this.defaults.async) return (async () => {
              let u = await a.apply(s, c);
              return u === !1 && (u = await l.apply(s, c)), u;
            })();
            let d = a.apply(s, c);
            return d === !1 && (d = l.apply(s, c)), d;
          };
        }
        n.hooks = s;
      }
      if (r.walkTokens) {
        let s = this.defaults.walkTokens, i = r.walkTokens;
        n.walkTokens = function(o) {
          let a = [];
          return a.push(i.call(this, o)), s && (a = a.concat(s.call(this, o))), a;
        };
      }
      this.defaults = { ...this.defaults, ...n };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return At.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return Tt.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, r) => {
      let n = { ...r }, s = { ...this.defaults, ...n }, i = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && n.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = t), s.async) return (async () => {
        let o = s.hooks ? await s.hooks.preprocess(e) : e, a = await (s.hooks ? await s.hooks.provideLexer() : t ? At.lex : At.lexInline)(o, s), l = s.hooks ? await s.hooks.processAllTokens(a) : a;
        s.walkTokens && await Promise.all(this.walkTokens(l, s.walkTokens));
        let c = await (s.hooks ? await s.hooks.provideParser() : t ? Tt.parse : Tt.parseInline)(l, s);
        return s.hooks ? await s.hooks.postprocess(c) : c;
      })().catch(i);
      try {
        s.hooks && (e = s.hooks.preprocess(e));
        let o = (s.hooks ? s.hooks.provideLexer() : t ? At.lex : At.lexInline)(e, s);
        s.hooks && (o = s.hooks.processAllTokens(o)), s.walkTokens && this.walkTokens(o, s.walkTokens);
        let a = (s.hooks ? s.hooks.provideParser() : t ? Tt.parse : Tt.parseInline)(o, s);
        return s.hooks && (a = s.hooks.postprocess(a)), a;
      } catch (o) {
        return i(o);
      }
    };
  }
  onError(t, e) {
    return (r) => {
      if (r.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let n = "<p>An error occurred:</p><pre>" + Wt(r.message + "", !0) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e) return Promise.reject(r);
      throw r;
    };
  }
}, Or = new Iw();
function ve(t, e) {
  return Or.parse(t, e);
}
ve.options = ve.setOptions = function(t) {
  return Or.setOptions(t), ve.defaults = Or.defaults, Ch(ve.defaults), ve;
};
ve.getDefaults = $l;
ve.defaults = Pr;
ve.use = function(...t) {
  return Or.use(...t), ve.defaults = Or.defaults, Ch(ve.defaults), ve;
};
ve.walkTokens = function(t, e) {
  return Or.walkTokens(t, e);
};
ve.parseInline = Or.parseInline;
ve.Parser = Tt;
ve.parser = Tt.parse;
ve.Renderer = Hi;
ve.TextRenderer = Ll;
ve.Lexer = At;
ve.lexer = At.lex;
ve.Tokenizer = Vi;
ve.Hooks = jn;
ve.parse = ve;
ve.options;
ve.setOptions;
ve.use;
ve.walkTokens;
ve.parseInline;
Tt.parse;
At.lex;
var Pw = /* @__PURE__ */ M("<div>");
ve.setOptions({
  breaks: !0,
  gfm: !0
});
const Fh = (t) => {
  const e = pe(() => {
    if (!t.content)
      return "";
    try {
      const r = ve.parse(t.content, {
        async: !1
      });
      return Ka.sanitize(r);
    } catch {
      return Ka.sanitize(t.content);
    }
  });
  return A(z, {
    get when() {
      return t.content;
    },
    get children() {
      var r = Pw();
      return ee((n) => {
        var s = `markdown-content prose prose-sm max-w-none
          prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-headings:font-semibold prose-headings:leading-tight
          prose-h1:text-xl prose-h1:mt-6 prose-h1:mb-3
          prose-h2:text-lg prose-h2:mt-5 prose-h2:mb-2
          prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
          prose-p:text-gray-600 dark:prose-p:text-gray-400
          prose-p:leading-relaxed prose-p:my-2
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-800 dark:prose-strong:text-gray-200
          prose-strong:font-semibold
          prose-code:text-sm prose-code:font-mono
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800
          prose-code:text-gray-800 dark:prose-code:text-gray-200
          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
          prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950
          prose-pre:text-gray-100 prose-pre:rounded-xl
          prose-pre:p-4 prose-pre:my-3 prose-pre:overflow-x-auto
          prose-ul:my-2 prose-ul:pl-5 prose-ul:list-disc
          prose-ol:my-2 prose-ol:pl-5 prose-ol:list-decimal
          prose-li:text-gray-600 dark:prose-li:text-gray-400
          prose-li:my-0.5
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300
          dark:prose-blockquote:border-gray-600
          prose-blockquote:pl-4 prose-blockquote:my-3
          prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
          prose-blockquote:italic
          prose-hr:border-gray-200 dark:prose-hr:border-gray-700
          prose-hr:my-4
          prose-table:my-3
          prose-th:text-left prose-th:text-gray-800 dark:prose-th:text-gray-200
          prose-th:font-semibold prose-th:p-2
          prose-th:border-b prose-th:border-gray-200 dark:prose-th:border-gray-700
          prose-td:p-2 prose-td:text-gray-600 dark:prose-td:text-gray-400
          prose-td:border-b prose-td:border-gray-100 dark:prose-td:border-gray-800
          ${t.class ?? ""}`, i = e();
        return s !== n.e && te(r, n.e = s), i !== n.t && (r.innerHTML = n.t = i), n;
      }, {
        e: void 0,
        t: void 0
      }), r;
    }
  });
};
var yd = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Lw(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var bd = { exports: {} }, vd;
function Rw() {
  return vd || (vd = 1, (function(t) {
    var e = typeof window < "u" ? window : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? self : {}, r = (function(n) {
      var s = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, i = 0, o = {}, a = {
        /**
         * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
         * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
         * additional languages or plugins yourself.
         *
         * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
         *
         * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.manual = true;
         * // add a new <script> to load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        manual: n.Prism && n.Prism.manual,
        /**
         * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
         * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
         * own worker, you don't want it to do this.
         *
         * By setting this value to `true`, Prism will not add its own listeners to the worker.
         *
         * You obviously have to change this value before Prism executes. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.disableWorkerMessageHandler = true;
         * // Load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        disableWorkerMessageHandler: n.Prism && n.Prism.disableWorkerMessageHandler,
        /**
         * A namespace for utility methods.
         *
         * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
         * change or disappear at any time.
         *
         * @namespace
         * @memberof Prism
         */
        util: {
          encode: function h(y) {
            return y instanceof l ? new l(y.type, h(y.content), y.alias) : Array.isArray(y) ? y.map(h) : y.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
          },
          /**
           * Returns the name of the type of the given value.
           *
           * @param {any} o
           * @returns {string}
           * @example
           * type(null)      === 'Null'
           * type(undefined) === 'Undefined'
           * type(123)       === 'Number'
           * type('foo')     === 'String'
           * type(true)      === 'Boolean'
           * type([1, 2])    === 'Array'
           * type({})        === 'Object'
           * type(String)    === 'Function'
           * type(/abc+/)    === 'RegExp'
           */
          type: function(h) {
            return Object.prototype.toString.call(h).slice(8, -1);
          },
          /**
           * Returns a unique number for the given object. Later calls will still return the same number.
           *
           * @param {Object} obj
           * @returns {number}
           */
          objId: function(h) {
            return h.__id || Object.defineProperty(h, "__id", { value: ++i }), h.__id;
          },
          /**
           * Creates a deep clone of the given object.
           *
           * The main intended use of this function is to clone language definitions.
           *
           * @param {T} o
           * @param {Record<number, any>} [visited]
           * @returns {T}
           * @template T
           */
          clone: function h(y, k) {
            k = k || {};
            var v, x;
            switch (a.util.type(y)) {
              case "Object":
                if (x = a.util.objId(y), k[x])
                  return k[x];
                v = /** @type {Record<string, any>} */
                {}, k[x] = v;
                for (var S in y)
                  y.hasOwnProperty(S) && (v[S] = h(y[S], k));
                return (
                  /** @type {any} */
                  v
                );
              case "Array":
                return x = a.util.objId(y), k[x] ? k[x] : (v = [], k[x] = v, /** @type {Array} */
                /** @type {any} */
                y.forEach(function(_, T) {
                  v[T] = h(_, k);
                }), /** @type {any} */
                v);
              default:
                return y;
            }
          },
          /**
           * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
           *
           * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
           *
           * @param {Element} element
           * @returns {string}
           */
          getLanguage: function(h) {
            for (; h; ) {
              var y = s.exec(h.className);
              if (y)
                return y[1].toLowerCase();
              h = h.parentElement;
            }
            return "none";
          },
          /**
           * Sets the Prism `language-xxxx` class of the given element.
           *
           * @param {Element} element
           * @param {string} language
           * @returns {void}
           */
          setLanguage: function(h, y) {
            h.className = h.className.replace(RegExp(s, "gi"), ""), h.classList.add("language-" + y);
          },
          /**
           * Returns the script element that is currently executing.
           *
           * This does __not__ work for line script element.
           *
           * @returns {HTMLScriptElement | null}
           */
          currentScript: function() {
            if (typeof document > "u")
              return null;
            if (document.currentScript && document.currentScript.tagName === "SCRIPT")
              return (
                /** @type {any} */
                document.currentScript
              );
            try {
              throw new Error();
            } catch (v) {
              var h = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(v.stack) || [])[1];
              if (h) {
                var y = document.getElementsByTagName("script");
                for (var k in y)
                  if (y[k].src == h)
                    return y[k];
              }
              return null;
            }
          },
          /**
           * Returns whether a given class is active for `element`.
           *
           * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
           * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
           * given class is just the given class with a `no-` prefix.
           *
           * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
           * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
           * ancestors have the given class or the negated version of it, then the default activation will be returned.
           *
           * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
           * version of it, the class is considered active.
           *
           * @param {Element} element
           * @param {string} className
           * @param {boolean} [defaultActivation=false]
           * @returns {boolean}
           */
          isActive: function(h, y, k) {
            for (var v = "no-" + y; h; ) {
              var x = h.classList;
              if (x.contains(y))
                return !0;
              if (x.contains(v))
                return !1;
              h = h.parentElement;
            }
            return !!k;
          }
        },
        /**
         * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
         *
         * @namespace
         * @memberof Prism
         * @public
         */
        languages: {
          /**
           * The grammar for plain, unformatted text.
           */
          plain: o,
          plaintext: o,
          text: o,
          txt: o,
          /**
           * Creates a deep copy of the language with the given id and appends the given tokens.
           *
           * If a token in `redef` also appears in the copied language, then the existing token in the copied language
           * will be overwritten at its original position.
           *
           * ## Best practices
           *
           * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
           * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
           * understand the language definition because, normally, the order of tokens matters in Prism grammars.
           *
           * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
           * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
           *
           * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
           * @param {Grammar} redef The new tokens to append.
           * @returns {Grammar} The new language created.
           * @public
           * @example
           * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
           *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
           *     // at its original position
           *     'comment': { ... },
           *     // CSS doesn't have a 'color' token, so this token will be appended
           *     'color': /\b(?:red|green|blue)\b/
           * });
           */
          extend: function(h, y) {
            var k = a.util.clone(a.languages[h]);
            for (var v in y)
              k[v] = y[v];
            return k;
          },
          /**
           * Inserts tokens _before_ another token in a language definition or any other grammar.
           *
           * ## Usage
           *
           * This helper method makes it easy to modify existing languages. For example, the CSS language definition
           * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
           * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
           * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
           * this:
           *
           * ```js
           * Prism.languages.markup.style = {
           *     // token
           * };
           * ```
           *
           * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
           * before existing tokens. For the CSS example above, you would use it like this:
           *
           * ```js
           * Prism.languages.insertBefore('markup', 'cdata', {
           *     'style': {
           *         // token
           *     }
           * });
           * ```
           *
           * ## Special cases
           *
           * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
           * will be ignored.
           *
           * This behavior can be used to insert tokens after `before`:
           *
           * ```js
           * Prism.languages.insertBefore('markup', 'comment', {
           *     'comment': Prism.languages.markup.comment,
           *     // tokens after 'comment'
           * });
           * ```
           *
           * ## Limitations
           *
           * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
           * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
           * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
           * deleting properties which is necessary to insert at arbitrary positions.
           *
           * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
           * Instead, it will create a new object and replace all references to the target object with the new one. This
           * can be done without temporarily deleting properties, so the iteration order is well-defined.
           *
           * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
           * you hold the target object in a variable, then the value of the variable will not change.
           *
           * ```js
           * var oldMarkup = Prism.languages.markup;
           * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
           *
           * assert(oldMarkup !== Prism.languages.markup);
           * assert(newMarkup === Prism.languages.markup);
           * ```
           *
           * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
           * object to be modified.
           * @param {string} before The key to insert before.
           * @param {Grammar} insert An object containing the key-value pairs to be inserted.
           * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
           * object to be modified.
           *
           * Defaults to `Prism.languages`.
           * @returns {Grammar} The new grammar object.
           * @public
           */
          insertBefore: function(h, y, k, v) {
            v = v || /** @type {any} */
            a.languages;
            var x = v[h], S = {};
            for (var _ in x)
              if (x.hasOwnProperty(_)) {
                if (_ == y)
                  for (var T in k)
                    k.hasOwnProperty(T) && (S[T] = k[T]);
                k.hasOwnProperty(_) || (S[_] = x[_]);
              }
            var P = v[h];
            return v[h] = S, a.languages.DFS(a.languages, function(R, D) {
              D === P && R != h && (this[R] = S);
            }), S;
          },
          // Traverse a language definition with Depth First Search
          DFS: function h(y, k, v, x) {
            x = x || {};
            var S = a.util.objId;
            for (var _ in y)
              if (y.hasOwnProperty(_)) {
                k.call(y, _, y[_], v || _);
                var T = y[_], P = a.util.type(T);
                P === "Object" && !x[S(T)] ? (x[S(T)] = !0, h(T, k, null, x)) : P === "Array" && !x[S(T)] && (x[S(T)] = !0, h(T, k, _, x));
              }
          }
        },
        plugins: {},
        /**
         * This is the most high-level function in Prism’s API.
         * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
         * each one of them.
         *
         * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
         *
         * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
         * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
         * @memberof Prism
         * @public
         */
        highlightAll: function(h, y) {
          a.highlightAllUnder(document, h, y);
        },
        /**
         * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
         * {@link Prism.highlightElement} on each one of them.
         *
         * The following hooks will be run:
         * 1. `before-highlightall`
         * 2. `before-all-elements-highlight`
         * 3. All hooks of {@link Prism.highlightElement} for each element.
         *
         * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
         * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
         * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
         * @memberof Prism
         * @public
         */
        highlightAllUnder: function(h, y, k) {
          var v = {
            callback: k,
            container: h,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          };
          a.hooks.run("before-highlightall", v), v.elements = Array.prototype.slice.apply(v.container.querySelectorAll(v.selector)), a.hooks.run("before-all-elements-highlight", v);
          for (var x = 0, S; S = v.elements[x++]; )
            a.highlightElement(S, y === !0, v.callback);
        },
        /**
         * Highlights the code inside a single element.
         *
         * The following hooks will be run:
         * 1. `before-sanity-check`
         * 2. `before-highlight`
         * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
         * 4. `before-insert`
         * 5. `after-highlight`
         * 6. `complete`
         *
         * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
         * the element's language.
         *
         * @param {Element} element The element containing the code.
         * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
         * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
         * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
         * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
         *
         * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
         * asynchronous highlighting to work. You can build your own bundle on the
         * [Download page](https://prismjs.com/download.html).
         * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
         * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
         * @memberof Prism
         * @public
         */
        highlightElement: function(h, y, k) {
          var v = a.util.getLanguage(h), x = a.languages[v];
          a.util.setLanguage(h, v);
          var S = h.parentElement;
          S && S.nodeName.toLowerCase() === "pre" && a.util.setLanguage(S, v);
          var _ = h.textContent, T = {
            element: h,
            language: v,
            grammar: x,
            code: _
          };
          function P(D) {
            T.highlightedCode = D, a.hooks.run("before-insert", T), T.element.innerHTML = T.highlightedCode, a.hooks.run("after-highlight", T), a.hooks.run("complete", T), k && k.call(T.element);
          }
          if (a.hooks.run("before-sanity-check", T), S = T.element.parentElement, S && S.nodeName.toLowerCase() === "pre" && !S.hasAttribute("tabindex") && S.setAttribute("tabindex", "0"), !T.code) {
            a.hooks.run("complete", T), k && k.call(T.element);
            return;
          }
          if (a.hooks.run("before-highlight", T), !T.grammar) {
            P(a.util.encode(T.code));
            return;
          }
          if (y && n.Worker) {
            var R = new Worker(a.filename);
            R.onmessage = function(D) {
              P(D.data);
            }, R.postMessage(JSON.stringify({
              language: T.language,
              code: T.code,
              immediateClose: !0
            }));
          } else
            P(a.highlight(T.code, T.grammar, T.language));
        },
        /**
         * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
         * and the language definitions to use, and returns a string with the HTML produced.
         *
         * The following hooks will be run:
         * 1. `before-tokenize`
         * 2. `after-tokenize`
         * 3. `wrap`: On each {@link Token}.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @param {string} language The name of the language definition passed to `grammar`.
         * @returns {string} The highlighted HTML.
         * @memberof Prism
         * @public
         * @example
         * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
         */
        highlight: function(h, y, k) {
          var v = {
            code: h,
            grammar: y,
            language: k
          };
          if (a.hooks.run("before-tokenize", v), !v.grammar)
            throw new Error('The language "' + v.language + '" has no grammar.');
          return v.tokens = a.tokenize(v.code, v.grammar), a.hooks.run("after-tokenize", v), l.stringify(a.util.encode(v.tokens), v.language);
        },
        /**
         * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
         * and the language definitions to use, and returns an array with the tokenized code.
         *
         * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
         *
         * This method could be useful in other contexts as well, as a very crude parser.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @returns {TokenStream} An array of strings and tokens, a token stream.
         * @memberof Prism
         * @public
         * @example
         * let code = `var foo = 0;`;
         * let tokens = Prism.tokenize(code, Prism.languages.javascript);
         * tokens.forEach(token => {
         *     if (token instanceof Prism.Token && token.type === 'number') {
         *         console.log(`Found numeric literal: ${token.content}`);
         *     }
         * });
         */
        tokenize: function(h, y) {
          var k = y.rest;
          if (k) {
            for (var v in k)
              y[v] = k[v];
            delete y.rest;
          }
          var x = new u();
          return f(x, x.head, h), d(h, x, y, x.head, 0), b(x);
        },
        /**
         * @namespace
         * @memberof Prism
         * @public
         */
        hooks: {
          all: {},
          /**
           * Adds the given callback to the list of callbacks for the given hook.
           *
           * The callback will be invoked when the hook it is registered for is run.
           * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
           *
           * One callback function can be registered to multiple hooks and the same hook multiple times.
           *
           * @param {string} name The name of the hook.
           * @param {HookCallback} callback The callback function which is given environment variables.
           * @public
           */
          add: function(h, y) {
            var k = a.hooks.all;
            k[h] = k[h] || [], k[h].push(y);
          },
          /**
           * Runs a hook invoking all registered callbacks with the given environment variables.
           *
           * Callbacks will be invoked synchronously and in the order in which they were registered.
           *
           * @param {string} name The name of the hook.
           * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
           * @public
           */
          run: function(h, y) {
            var k = a.hooks.all[h];
            if (!(!k || !k.length))
              for (var v = 0, x; x = k[v++]; )
                x(y);
          }
        },
        Token: l
      };
      n.Prism = a;
      function l(h, y, k, v) {
        this.type = h, this.content = y, this.alias = k, this.length = (v || "").length | 0;
      }
      l.stringify = function h(y, k) {
        if (typeof y == "string")
          return y;
        if (Array.isArray(y)) {
          var v = "";
          return y.forEach(function(P) {
            v += h(P, k);
          }), v;
        }
        var x = {
          type: y.type,
          content: h(y.content, k),
          tag: "span",
          classes: ["token", y.type],
          attributes: {},
          language: k
        }, S = y.alias;
        S && (Array.isArray(S) ? Array.prototype.push.apply(x.classes, S) : x.classes.push(S)), a.hooks.run("wrap", x);
        var _ = "";
        for (var T in x.attributes)
          _ += " " + T + '="' + (x.attributes[T] || "").replace(/"/g, "&quot;") + '"';
        return "<" + x.tag + ' class="' + x.classes.join(" ") + '"' + _ + ">" + x.content + "</" + x.tag + ">";
      };
      function c(h, y, k, v) {
        h.lastIndex = y;
        var x = h.exec(k);
        if (x && v && x[1]) {
          var S = x[1].length;
          x.index += S, x[0] = x[0].slice(S);
        }
        return x;
      }
      function d(h, y, k, v, x, S) {
        for (var _ in k)
          if (!(!k.hasOwnProperty(_) || !k[_])) {
            var T = k[_];
            T = Array.isArray(T) ? T : [T];
            for (var P = 0; P < T.length; ++P) {
              if (S && S.cause == _ + "," + P)
                return;
              var R = T[P], D = R.inside, U = !!R.lookbehind, Y = !!R.greedy, se = R.alias;
              if (Y && !R.pattern.global) {
                var be = R.pattern.toString().match(/[imsuy]*$/)[0];
                R.pattern = RegExp(R.pattern.source, be + "g");
              }
              for (var xe = R.pattern || R, W = v.next, ce = x; W !== y.tail && !(S && ce >= S.reach); ce += W.value.length, W = W.next) {
                var K = W.value;
                if (y.length > h.length)
                  return;
                if (!(K instanceof l)) {
                  var I = 1, F;
                  if (Y) {
                    if (F = c(xe, ce, h, U), !F || F.index >= h.length)
                      break;
                    var B = F.index, L = F.index + F[0].length, E = ce;
                    for (E += W.value.length; B >= E; )
                      W = W.next, E += W.value.length;
                    if (E -= W.value.length, ce = E, W.value instanceof l)
                      continue;
                    for (var O = W; O !== y.tail && (E < L || typeof O.value == "string"); O = O.next)
                      I++, E += O.value.length;
                    I--, K = h.slice(ce, E), F.index -= ce;
                  } else if (F = c(xe, 0, K, U), !F)
                    continue;
                  var B = F.index, V = F[0], J = K.slice(0, B), ie = K.slice(B + V.length), ne = ce + K.length;
                  S && ne > S.reach && (S.reach = ne);
                  var N = W.prev;
                  J && (N = f(y, N, J), ce += J.length), p(y, N, I);
                  var j = new l(_, D ? a.tokenize(V, D) : V, se, V);
                  if (W = f(y, N, j), ie && f(y, W, ie), I > 1) {
                    var q = {
                      cause: _ + "," + P,
                      reach: ne
                    };
                    d(h, y, k, W.prev, ce, q), S && q.reach > S.reach && (S.reach = q.reach);
                  }
                }
              }
            }
          }
      }
      function u() {
        var h = { value: null, prev: null, next: null }, y = { value: null, prev: h, next: null };
        h.next = y, this.head = h, this.tail = y, this.length = 0;
      }
      function f(h, y, k) {
        var v = y.next, x = { value: k, prev: y, next: v };
        return y.next = x, v.prev = x, h.length++, x;
      }
      function p(h, y, k) {
        for (var v = y.next, x = 0; x < k && v !== h.tail; x++)
          v = v.next;
        y.next = v, v.prev = y, h.length -= x;
      }
      function b(h) {
        for (var y = [], k = h.head.next; k !== h.tail; )
          y.push(k.value), k = k.next;
        return y;
      }
      if (!n.document)
        return n.addEventListener && (a.disableWorkerMessageHandler || n.addEventListener("message", function(h) {
          var y = JSON.parse(h.data), k = y.language, v = y.code, x = y.immediateClose;
          n.postMessage(a.highlight(v, a.languages[k], k)), x && n.close();
        }, !1)), a;
      var g = a.util.currentScript();
      g && (a.filename = g.src, g.hasAttribute("data-manual") && (a.manual = !0));
      function m() {
        a.manual || a.highlightAll();
      }
      if (!a.manual) {
        var w = document.readyState;
        w === "loading" || w === "interactive" && g && g.defer ? document.addEventListener("DOMContentLoaded", m) : window.requestAnimationFrame ? window.requestAnimationFrame(m) : window.setTimeout(m, 16);
      }
      return a;
    })(e);
    t.exports && (t.exports = r), typeof yd < "u" && (yd.Prism = r), r.languages.markup = {
      comment: {
        pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
        greedy: !0
      },
      prolog: {
        pattern: /<\?[\s\S]+?\?>/,
        greedy: !0
      },
      doctype: {
        // https://www.w3.org/TR/xml/#NT-doctypedecl
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
          "internal-subset": {
            pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
            lookbehind: !0,
            greedy: !0,
            inside: null
            // see below
          },
          string: {
            pattern: /"[^"]*"|'[^']*'/,
            greedy: !0
          },
          punctuation: /^<!|>$|[[\]]/,
          "doctype-tag": /^DOCTYPE/i,
          name: /[^\s<>'"]+/
        }
      },
      cdata: {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        greedy: !0
      },
      tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
          tag: {
            pattern: /^<\/?[^\s>\/]+/,
            inside: {
              punctuation: /^<\/?/,
              namespace: /^[^\s>\/:]+:/
            }
          },
          "special-attr": [],
          "attr-value": {
            pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
            inside: {
              punctuation: [
                {
                  pattern: /^=/,
                  alias: "attr-equals"
                },
                {
                  pattern: /^(\s*)["']|["']$/,
                  lookbehind: !0
                }
              ]
            }
          },
          punctuation: /\/?>/,
          "attr-name": {
            pattern: /[^\s>\/]+/,
            inside: {
              namespace: /^[^\s>\/:]+:/
            }
          }
        }
      },
      entity: [
        {
          pattern: /&[\da-z]{1,8};/i,
          alias: "named-entity"
        },
        /&#x?[\da-f]{1,8};/i
      ]
    }, r.languages.markup.tag.inside["attr-value"].inside.entity = r.languages.markup.entity, r.languages.markup.doctype.inside["internal-subset"].inside = r.languages.markup, r.hooks.add("wrap", function(n) {
      n.type === "entity" && (n.attributes.title = n.content.replace(/&amp;/, "&"));
    }), Object.defineProperty(r.languages.markup.tag, "addInlined", {
      /**
       * Adds an inlined language to markup.
       *
       * An example of an inlined language is CSS with `<style>` tags.
       *
       * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
       * case insensitive.
       * @param {string} lang The language key.
       * @example
       * addInlined('style', 'css');
       */
      value: function(n, s) {
        var i = {};
        i["language-" + s] = {
          pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
          lookbehind: !0,
          inside: r.languages[s]
        }, i.cdata = /^<!\[CDATA\[|\]\]>$/i;
        var o = {
          "included-cdata": {
            pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
            inside: i
          }
        };
        o["language-" + s] = {
          pattern: /[\s\S]+/,
          inside: r.languages[s]
        };
        var a = {};
        a[n] = {
          pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
            return n;
          }), "i"),
          lookbehind: !0,
          greedy: !0,
          inside: o
        }, r.languages.insertBefore("markup", "cdata", a);
      }
    }), Object.defineProperty(r.languages.markup.tag, "addAttribute", {
      /**
       * Adds an pattern to highlight languages embedded in HTML attributes.
       *
       * An example of an inlined language is CSS with `style` attributes.
       *
       * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
       * case insensitive.
       * @param {string} lang The language key.
       * @example
       * addAttribute('style', 'css');
       */
      value: function(n, s) {
        r.languages.markup.tag.inside["special-attr"].push({
          pattern: RegExp(
            /(^|["'\s])/.source + "(?:" + n + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
            "i"
          ),
          lookbehind: !0,
          inside: {
            "attr-name": /^[^\s=]+/,
            "attr-value": {
              pattern: /=[\s\S]+/,
              inside: {
                value: {
                  pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                  lookbehind: !0,
                  alias: [s, "language-" + s],
                  inside: r.languages[s]
                },
                punctuation: [
                  {
                    pattern: /^=/,
                    alias: "attr-equals"
                  },
                  /"|'/
                ]
              }
            }
          }
        });
      }
    }), r.languages.html = r.languages.markup, r.languages.mathml = r.languages.markup, r.languages.svg = r.languages.markup, r.languages.xml = r.languages.extend("markup", {}), r.languages.ssml = r.languages.xml, r.languages.atom = r.languages.xml, r.languages.rss = r.languages.xml, (function(n) {
      var s = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
      n.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
          pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + s.source + ")*?" + /(?:;|(?=\s*\{))/.source),
          inside: {
            rule: /^@[\w-]+/,
            "selector-function-argument": {
              pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
              lookbehind: !0,
              alias: "selector"
            },
            keyword: {
              pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
              lookbehind: !0
            }
            // See rest below
          }
        },
        url: {
          // https://drafts.csswg.org/css-values-3/#urls
          pattern: RegExp("\\burl\\((?:" + s.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
          greedy: !0,
          inside: {
            function: /^url/i,
            punctuation: /^\(|\)$/,
            string: {
              pattern: RegExp("^" + s.source + "$"),
              alias: "url"
            }
          }
        },
        selector: {
          pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + s.source + ")*(?=\\s*\\{)"),
          lookbehind: !0
        },
        string: {
          pattern: s,
          greedy: !0
        },
        property: {
          pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
          lookbehind: !0
        },
        important: /!important\b/i,
        function: {
          pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
          lookbehind: !0
        },
        punctuation: /[(){};:,]/
      }, n.languages.css.atrule.inside.rest = n.languages.css;
      var i = n.languages.markup;
      i && (i.tag.addInlined("style", "css"), i.tag.addAttribute("style", "css"));
    })(r), r.languages.clike = {
      comment: [
        {
          pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
          lookbehind: !0,
          greedy: !0
        },
        {
          pattern: /(^|[^\\:])\/\/.*/,
          lookbehind: !0,
          greedy: !0
        }
      ],
      string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
      },
      "class-name": {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: !0,
        inside: {
          punctuation: /[.\\]/
        }
      },
      keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
      boolean: /\b(?:false|true)\b/,
      function: /\b\w+(?=\()/,
      number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
      operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
      punctuation: /[{}[\];(),.:]/
    }, r.languages.javascript = r.languages.extend("clike", {
      "class-name": [
        r.languages.clike["class-name"],
        {
          pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
          lookbehind: !0
        }
      ],
      keyword: [
        {
          pattern: /((?:^|\})\s*)catch\b/,
          lookbehind: !0
        },
        {
          pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
          lookbehind: !0
        }
      ],
      // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
      function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
      number: {
        pattern: RegExp(
          /(^|[^\w$])/.source + "(?:" + // constant
          (/NaN|Infinity/.source + "|" + // binary integer
          /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
          /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
          /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
          /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
          /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
        ),
        lookbehind: !0
      },
      operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    }), r.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, r.languages.insertBefore("javascript", "keyword", {
      regex: {
        pattern: RegExp(
          // lookbehind
          // eslint-disable-next-line regexp/no-dupe-characters-character-class
          /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
          // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
          // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
          // with the only syntax, so we have to define 2 different regex patterns.
          /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
          /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
          /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          "regex-source": {
            pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
            lookbehind: !0,
            alias: "language-regex",
            inside: r.languages.regex
          },
          "regex-delimiter": /^\/|\/$/,
          "regex-flags": /^[a-z]+$/
        }
      },
      // This must be declared before keyword because we use "function" inside the look-forward
      "function-variable": {
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
        alias: "function"
      },
      parameter: [
        {
          pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
          lookbehind: !0,
          inside: r.languages.javascript
        },
        {
          pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
          lookbehind: !0,
          inside: r.languages.javascript
        },
        {
          pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
          lookbehind: !0,
          inside: r.languages.javascript
        },
        {
          pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
          lookbehind: !0,
          inside: r.languages.javascript
        }
      ],
      constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    }), r.languages.insertBefore("javascript", "string", {
      hashbang: {
        pattern: /^#!.*/,
        greedy: !0,
        alias: "comment"
      },
      "template-string": {
        pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
        greedy: !0,
        inside: {
          "template-punctuation": {
            pattern: /^`|`$/,
            alias: "string"
          },
          interpolation: {
            pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
            lookbehind: !0,
            inside: {
              "interpolation-punctuation": {
                pattern: /^\$\{|\}$/,
                alias: "punctuation"
              },
              rest: r.languages.javascript
            }
          },
          string: /[\s\S]+/
        }
      },
      "string-property": {
        pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
        lookbehind: !0,
        greedy: !0,
        alias: "property"
      }
    }), r.languages.insertBefore("javascript", "operator", {
      "literal-property": {
        pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
        lookbehind: !0,
        alias: "property"
      }
    }), r.languages.markup && (r.languages.markup.tag.addInlined("script", "javascript"), r.languages.markup.tag.addAttribute(
      /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
      "javascript"
    )), r.languages.js = r.languages.javascript, (function() {
      if (typeof r > "u" || typeof document > "u")
        return;
      Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
      var n = "Loading…", s = function(g, m) {
        return "✖ Error " + g + " while fetching file: " + m;
      }, i = "✖ Error: File does not exist or is empty", o = {
        js: "javascript",
        py: "python",
        rb: "ruby",
        ps1: "powershell",
        psm1: "powershell",
        sh: "bash",
        bat: "batch",
        h: "c",
        tex: "latex"
      }, a = "data-src-status", l = "loading", c = "loaded", d = "failed", u = "pre[data-src]:not([" + a + '="' + c + '"]):not([' + a + '="' + l + '"])';
      function f(g, m, w) {
        var h = new XMLHttpRequest();
        h.open("GET", g, !0), h.onreadystatechange = function() {
          h.readyState == 4 && (h.status < 400 && h.responseText ? m(h.responseText) : h.status >= 400 ? w(s(h.status, h.statusText)) : w(i));
        }, h.send(null);
      }
      function p(g) {
        var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(g || "");
        if (m) {
          var w = Number(m[1]), h = m[2], y = m[3];
          return h ? y ? [w, Number(y)] : [w, void 0] : [w, w];
        }
      }
      r.hooks.add("before-highlightall", function(g) {
        g.selector += ", " + u;
      }), r.hooks.add("before-sanity-check", function(g) {
        var m = (
          /** @type {HTMLPreElement} */
          g.element
        );
        if (m.matches(u)) {
          g.code = "", m.setAttribute(a, l);
          var w = m.appendChild(document.createElement("CODE"));
          w.textContent = n;
          var h = m.getAttribute("data-src"), y = g.language;
          if (y === "none") {
            var k = (/\.(\w+)$/.exec(h) || [, "none"])[1];
            y = o[k] || k;
          }
          r.util.setLanguage(w, y), r.util.setLanguage(m, y);
          var v = r.plugins.autoloader;
          v && v.loadLanguages(y), f(
            h,
            function(x) {
              m.setAttribute(a, c);
              var S = p(m.getAttribute("data-range"));
              if (S) {
                var _ = x.split(/\r\n?|\n/g), T = S[0], P = S[1] == null ? _.length : S[1];
                T < 0 && (T += _.length), T = Math.max(0, Math.min(T - 1, _.length)), P < 0 && (P += _.length), P = Math.max(0, Math.min(P, _.length)), x = _.slice(T, P).join(`
`), m.hasAttribute("data-start") || m.setAttribute("data-start", String(T + 1));
              }
              w.textContent = x, r.highlightElement(w);
            },
            function(x) {
              m.setAttribute(a, d), w.textContent = x;
            }
          );
        }
      }), r.plugins.fileHighlight = {
        /**
         * Executes the File Highlight plugin for all matching `pre` elements under the given container.
         *
         * Note: Elements which are already loaded or currently loading will not be touched by this method.
         *
         * @param {ParentNode} [container=document]
         */
        highlight: function(g) {
          for (var m = (g || document).querySelectorAll(u), w = 0, h; h = m[w++]; )
            r.highlightElement(h);
        }
      };
      var b = !1;
      r.fileHighlight = function() {
        b || (console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."), b = !0), r.plugins.fileHighlight.highlight.apply(this, arguments);
      };
    })();
  })(bd)), bd.exports;
}
var jw = Rw();
const wd = /* @__PURE__ */ Lw(jw);
(function(t) {
  var e = "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b", r = {
    pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
    lookbehind: !0,
    alias: "punctuation",
    // this looks reasonably well in all themes
    inside: null
    // see below
  }, n = {
    bash: r,
    environment: {
      pattern: RegExp("\\$" + e),
      alias: "constant"
    },
    variable: [
      // [0]: Arithmetic Environment
      {
        pattern: /\$?\(\([\s\S]+?\)\)/,
        greedy: !0,
        inside: {
          // If there is a $ sign at the beginning highlight $(( and )) as variable
          variable: [
            {
              pattern: /(^\$\(\([\s\S]+)\)\)/,
              lookbehind: !0
            },
            /^\$\(\(/
          ],
          number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
          // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
          operator: /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
          // If there is no $ sign at the beginning highlight (( and )) as punctuation
          punctuation: /\(\(?|\)\)?|,|;/
        }
      },
      // [1]: Command Substitution
      {
        pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
        greedy: !0,
        inside: {
          variable: /^\$\(|^`|\)$|`$/
        }
      },
      // [2]: Brace expansion
      {
        pattern: /\$\{[^}]+\}/,
        greedy: !0,
        inside: {
          operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
          punctuation: /[\[\]]/,
          environment: {
            pattern: RegExp("(\\{)" + e),
            lookbehind: !0,
            alias: "constant"
          }
        }
      },
      /\$(?:\w+|[#?*!@$])/
    ],
    // Escape sequences from echo and printf's manuals, and escaped quotes.
    entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/
  };
  t.languages.bash = {
    shebang: {
      pattern: /^#!\s*\/.*/,
      alias: "important"
    },
    comment: {
      pattern: /(^|[^"{\\$])#.*/,
      lookbehind: !0
    },
    "function-name": [
      // a) function foo {
      // b) foo() {
      // c) function foo() {
      // but not “foo {”
      {
        // a) and c)
        pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
        lookbehind: !0,
        alias: "function"
      },
      {
        // b)
        pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/,
        alias: "function"
      }
    ],
    // Highlight variable names as variables in for and select beginnings.
    "for-or-select": {
      pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
      alias: "variable",
      lookbehind: !0
    },
    // Highlight variable names as variables in the left-hand part
    // of assignments (“=” and “+=”).
    "assign-left": {
      pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
      inside: {
        environment: {
          pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + e),
          lookbehind: !0,
          alias: "constant"
        }
      },
      alias: "variable",
      lookbehind: !0
    },
    // Highlight parameter names as variables
    parameter: {
      pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
      alias: "variable",
      lookbehind: !0
    },
    string: [
      // Support for Here-documents https://en.wikipedia.org/wiki/Here_document
      {
        pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
        lookbehind: !0,
        greedy: !0,
        inside: n
      },
      // Here-document with quotes around the tag
      // → No expansion (so no “inside”).
      {
        pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
        lookbehind: !0,
        greedy: !0,
        inside: {
          bash: r
        }
      },
      // “Normal” string
      {
        // https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html
        pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
        lookbehind: !0,
        greedy: !0,
        inside: n
      },
      {
        // https://www.gnu.org/software/bash/manual/html_node/Single-Quotes.html
        pattern: /(^|[^$\\])'[^']*'/,
        lookbehind: !0,
        greedy: !0
      },
      {
        // https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html
        pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
        greedy: !0,
        inside: {
          entity: n.entity
        }
      }
    ],
    environment: {
      pattern: RegExp("\\$?" + e),
      alias: "constant"
    },
    variable: n.variable,
    function: {
      pattern: /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
      lookbehind: !0
    },
    keyword: {
      pattern: /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
      lookbehind: !0
    },
    // https://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
    builtin: {
      pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
      lookbehind: !0,
      // Alias added to make those easier to distinguish from strings.
      alias: "class-name"
    },
    boolean: {
      pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
      lookbehind: !0
    },
    "file-descriptor": {
      pattern: /\B&\d\b/,
      alias: "important"
    },
    operator: {
      // Lots of redirections here, but not just that.
      pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
      inside: {
        "file-descriptor": {
          pattern: /^\d/,
          alias: "important"
        }
      }
    },
    punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
    number: {
      pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
      lookbehind: !0
    }
  }, r.inside = t.languages.bash;
  for (var s = [
    "comment",
    "function-name",
    "for-or-select",
    "assign-left",
    "parameter",
    "string",
    "environment",
    "function",
    "keyword",
    "builtin",
    "boolean",
    "file-descriptor",
    "operator",
    "punctuation",
    "number"
  ], i = n.variable[1].inside, o = 0; o < s.length; o++)
    i[s[o]] = t.languages.bash[s[o]];
  t.languages.sh = t.languages.bash, t.languages.shell = t.languages.bash;
})(Prism);
Prism.languages.json = {
  property: {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
    lookbehind: !0,
    greedy: !0
  },
  string: {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    lookbehind: !0,
    greedy: !0
  },
  comment: {
    pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: !0
  },
  number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  punctuation: /[{}[\],]/,
  operator: /:/,
  boolean: /\b(?:false|true)\b/,
  null: {
    pattern: /\bnull\b/,
    alias: "keyword"
  }
};
Prism.languages.webmanifest = Prism.languages.json;
function Rl(t = 2e3) {
  const [e, r] = Q(!1);
  let n;
  return { copied: e, copy: async (s) => {
    try {
      return await navigator.clipboard.writeText(s), r(!0), n && clearTimeout(n), n = setTimeout(() => {
        r(!1), n = void 0;
      }, t), !0;
    } catch {
      return !1;
    }
  } };
}
function ls(t, e) {
  return () => {
    const r = t.actions.getAuthByType(e);
    return r?.type === e ? r : void 0;
  };
}
function Ja(t) {
  if (!t.type)
    return {};
  switch (t.type) {
    case "object":
      if (t.properties) {
        const e = {};
        for (const [r, n] of Object.entries(t.properties))
          e[r] = Ja(
            n
          );
        return e;
      }
      return {};
    case "array":
      return t.items ? [Ja(t.items)] : [];
    case "string":
      return "string";
    case "number":
    case "integer":
      return 0;
    case "boolean":
      return !0;
    default:
      return null;
  }
}
function Mw(t) {
  const { operation: e, initialValues: r, onInitialValuesConsumed: n } = t, [s, i] = Q({}), [o, a] = Q({}), [l, c] = Q({}), [d, u] = Q(""), [f, p] = Q("form"), [b, g] = Q({}), m = pe(() => d0(e())), w = pe(() => {
    const _ = e().requestBody;
    return !!_ && Object.keys(_.content).length > 0;
  }), h = pe(() => {
    const _ = m(), T = e();
    return !_ || !T.requestBody?.content[_]?.schema ? null : T.requestBody.content[_].schema;
  }), y = pe(() => {
    const _ = h();
    return _ ? !!(_.properties && Object.keys(_.properties).length > 0 || _.type === "object" || _.type === "array" && _.items) : !1;
  }), k = () => f() === "form" ? b() : rd(d()), v = () => ({
    path: s(),
    query: o(),
    headers: l(),
    body: k(),
    contentType: m()
  }), x = () => {
    f() === "form" && u(JSON.stringify(b(), null, 2)), p("json");
  }, S = () => {
    if (f() === "json") {
      const _ = rd(d());
      g(_ ?? {});
    }
    p("form");
  };
  return ((_) => {
    const T = e();
    if (_) {
      if (_.path && i(_.path), _.query && a(_.query), _.headers && c(_.headers), _.body !== void 0) {
        const D = _.body;
        typeof D == "object" && D !== null ? (u(JSON.stringify(D, null, 2)), g(D)) : typeof D == "string" && u(D);
      }
      return;
    }
    const P = c0(T);
    P.path && i(P.path), P.query && a(P.query), P.headers && c(P.headers);
    const R = m();
    if (w() && R) {
      const D = T.requestBody?.content[R];
      let U = null;
      D?.example ? U = D.example : D?.schema && (U = Ja(D.schema)), U && (u(JSON.stringify(U, null, 2)), typeof U == "object" && U !== null && g(U));
    }
  })(r), r && n?.(), {
    // State accessors
    pathParams: s,
    queryParams: o,
    headerParams: l,
    body: d,
    bodyMode: f,
    bodyFormData: b,
    // State setters
    setPathParams: i,
    setQueryParams: a,
    setHeaderParams: c,
    setBody: u,
    setBodyFormData: g,
    // Computed values
    contentType: m,
    bodySchema: h,
    canUseFormMode: y,
    hasRequestBody: w,
    // Actions
    getRequestValues: v,
    switchToJsonMode: x,
    switchToFormMode: S
  };
}
function Dw(t) {
  const { open: e, onClose: r, closeOnEscape: n, closeOnBackdrop: s } = t, i = () => n?.() ?? !0, o = () => s?.() ?? !0;
  return tt(() => {
    if (!e() || !i())
      return;
    const a = (l) => {
      l.key === "Escape" && r();
    };
    document.addEventListener("keydown", a), rt(() => document.removeEventListener("keydown", a));
  }), tt(() => {
    e() ? document.body.style.overflow = "hidden" : document.body.style.overflow = "", rt(() => {
      document.body.style.overflow = "";
    });
  }), {
    shouldCloseOnBackdrop: o,
    handleBackdropClick: (a, l = (c) => c.target === c.currentTarget) => {
      o() && l(a) && r();
    }
  };
}
var Bw = /* @__PURE__ */ M('<svg class="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-500"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M5 13l4 4L19 7">'), qw = /* @__PURE__ */ M('<span class="hidden sm:inline text-emerald-500 dark:text-emerald-400">'), Fw = /* @__PURE__ */ M('<button type=button class="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 glass-button rounded-lg transition-all">'), Uw = /* @__PURE__ */ M('<div class="relative group rounded-xl overflow-hidden"><div class="absolute top-3 left-3 z-10"><span class="text-[0.625rem] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider"></span></div><pre><code>'), Kw = /* @__PURE__ */ M('<svg class="w-4 h-4 sm:w-3.5 sm:h-3.5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">'), zw = /* @__PURE__ */ M('<span class="hidden sm:inline">');
const Uh = (t) => {
  const {
    t: e
  } = Ce(), {
    copied: r,
    copy: n
  } = Rl();
  let s;
  const i = () => t.language || "json", o = () => t.maxHeight || "31.25rem", a = pe(() => {
    const l = t.code, c = i(), d = wd.languages[c];
    return d ? Ka.sanitize(wd.highlight(l, d, c), {
      ALLOWED_TAGS: ["span"],
      ALLOWED_ATTR: ["class"]
    }) : Vw(l);
  });
  return (() => {
    var l = Uw(), c = l.firstChild, d = c.firstChild, u = c.nextSibling, f = u.firstChild;
    $(l, A(z, {
      get when() {
        return !t.hideCopyButton;
      },
      get children() {
        var b = Fw();
        return b.$$click = () => n(t.code), $(b, A(z, {
          get when() {
            return r();
          },
          get fallback() {
            return [Kw(), (() => {
              var g = zw();
              return $(g, () => e("common.copy")), g;
            })()];
          },
          get children() {
            return [Bw(), (() => {
              var g = qw();
              return $(g, () => e("common.copied")), g;
            })()];
          }
        })), ee(() => he(b, "aria-label", r() ? e("common.copied") : e("common.copy"))), b;
      }
    }), c), $(d, i);
    var p = s;
    return typeof p == "function" ? rn(p, f) : s = f, ee((b) => {
      var g = `p-6 pt-10 text-sm font-mono overflow-auto scrollbar-thin glass-thin ${t.wrap ? "whitespace-pre-wrap break-all" : ""}`, m = o(), w = `language-${i()}`, h = a();
      return g !== b.e && te(u, b.e = g), m !== b.t && sf(u, "max-height", b.t = m), w !== b.a && te(f, b.a = w), h !== b.o && (f.innerHTML = b.o = h), b;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), l;
  })();
};
function Vw(t) {
  const e = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return t.replace(/[&<>"']/g, (r) => e[r]);
}
Ee(["click"]);
var Hw = /* @__PURE__ */ M("<option value>-- Select --"), Jw = /* @__PURE__ */ M("<option>"), Ww = /* @__PURE__ */ M("<div class=space-y-4>"), Gw = /* @__PURE__ */ M('<div class="glass-card rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">'), Yw = /* @__PURE__ */ M('<div class="text-xs text-gray-400 dark:text-gray-500">'), Qw = /* @__PURE__ */ M('<div class=space-y-3><button type=button class="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"><svg class="w-4 h-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M12 4v16m8-8H4"></path></svg>Add item'), Kh = /* @__PURE__ */ M('<span class="text-xs text-gray-400 dark:text-gray-500">(<!>)'), Xw = /* @__PURE__ */ M('<div class="glass-card rounded-xl p-3 sm:p-4"><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3"><div class="flex items-center gap-2"><span class="text-xs font-medium text-gray-500 dark:text-gray-400">Item </span></div><div class="flex items-center gap-1 self-end sm:self-auto"><button type=button class=glass-icon-btn title="Move up"><svg class="w-4 h-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M5 15l7-7 7 7"></path></svg></button><button type=button class=glass-icon-btn title="Move down"><svg class="w-4 h-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M19 9l-7 7-7-7"></path></svg></button><button type=button class="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"title="Remove item"><svg class="w-4 h-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">'), Zw = /* @__PURE__ */ M('<span class="text-rose-500 text-xs font-semibold">required'), ek = /* @__PURE__ */ M('<p class="text-xs text-gray-400 dark:text-gray-500">'), tk = /* @__PURE__ */ M('<div class=space-y-2><div class="flex items-center gap-2"><span class="font-mono text-sm font-medium text-gray-900 dark:text-white"></span><span class="text-xs text-gray-400 dark:text-gray-500">'), rk = /* @__PURE__ */ M("<div class=sm:max-w-xs>");
const Ji = (t) => {
  const e = pe(() => {
    const r = t.schema;
    return r.enum && r.enum.length > 0 ? "enum" : r.oneOf && r.oneOf.length > 0 ? "oneOf" : r.anyOf && r.anyOf.length > 0 ? "anyOf" : r.type || "string";
  });
  return A(nf, {
    get fallback() {
      return A(Wa, {
        get schema() {
          return t.schema;
        },
        get value() {
          return t.value;
        },
        get onChange() {
          return t.onChange;
        }
      });
    },
    get children() {
      return [A(Rt, {
        get when() {
          return e() === "object";
        },
        get children() {
          return A(sk, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            },
            get path() {
              return t.path || [];
            }
          });
        }
      }), A(Rt, {
        get when() {
          return e() === "array";
        },
        get children() {
          return A(ik, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            },
            get path() {
              return t.path || [];
            }
          });
        }
      }), A(Rt, {
        get when() {
          return e() === "enum";
        },
        get children() {
          return A(Hh, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            }
          });
        }
      }), A(Rt, {
        get when() {
          return e() === "boolean";
        },
        get children() {
          return A(Vh, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            }
          });
        }
      }), A(Rt, {
        get when() {
          return e() === "number" || e() === "integer";
        },
        get children() {
          return A(zh, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            }
          });
        }
      }), A(Rt, {
        get when() {
          return e() === "string";
        },
        get children() {
          return A(Wa, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            }
          });
        }
      }), A(Rt, {
        get when() {
          return e() === "oneOf" || e() === "anyOf";
        },
        get children() {
          return A(nk, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            }
          });
        }
      })];
    }
  });
}, Wa = (t) => {
  const e = () => _l(t.value), r = () => t.schema.format === "textarea" || t.schema.maxLength && t.schema.maxLength > 200;
  return A(z, {
    get when() {
      return r();
    },
    get fallback() {
      return A(Ot, {
        get value() {
          return e();
        },
        onInput: (n) => t.onChange(n || void 0),
        get placeholder() {
          return t.schema.default?.toString() || "";
        }
      });
    },
    get children() {
      return A(El, {
        get value() {
          return e();
        },
        onInput: (n) => t.onChange(n || void 0),
        get placeholder() {
          return t.schema.default?.toString() || "";
        },
        class: "h-24"
      });
    }
  });
}, zh = (t) => {
  const e = () => _l(t.value);
  return A(Ot, {
    type: "number",
    get value() {
      return e();
    },
    onInput: (r) => {
      if (r === "") {
        t.onChange(void 0);
        return;
      }
      const n = Number(r);
      Number.isNaN(n) || t.onChange(n);
    },
    get placeholder() {
      return t.schema.default?.toString() || "0";
    }
  });
}, Vh = (t) => A(Eh, {
  get checked() {
    return t.value === !0;
  },
  onChange: (e) => t.onChange(e),
  get label() {
    return t.value === !0 ? "true" : "false";
  }
}), Hh = (t) => {
  const e = () => _l(t.value);
  return A(os, {
    get value() {
      return e();
    },
    onChange: (r) => {
      if (r === "") {
        t.onChange(void 0);
        return;
      }
      const n = (t.schema.enum || []).find((s) => String(s) === r);
      t.onChange(n !== void 0 ? n : r);
    },
    get children() {
      return [Hw(), A(Ae, {
        get each() {
          return t.schema.enum;
        },
        children: (r) => (() => {
          var n = Jw();
          return $(n, () => String(r)), ee(() => n.value = String(r)), n;
        })()
      })];
    }
  });
}, nk = (t) => {
  const e = () => gv(t.value);
  return A(El, {
    get value() {
      return e();
    },
    onInput: (r) => {
      if (r === "") {
        t.onChange(void 0);
        return;
      }
      try {
        t.onChange(JSON.parse(r));
      } catch {
        t.onChange(r);
      }
    },
    placeholder: "{}",
    class: "h-24 font-mono text-sm"
  });
}, sk = (t) => {
  const e = () => t.value || {}, r = () => t.schema.properties || {}, n = () => t.schema.required || [], s = (o, a) => {
    const l = {
      ...e()
    };
    a === void 0 ? delete l[o] : l[o] = a, t.onChange(Object.keys(l).length > 0 ? l : void 0);
  }, i = () => t.path.length === 0;
  return A(z, {
    get when() {
      return i();
    },
    get fallback() {
      return (() => {
        var o = Gw();
        return $(o, A(Ae, {
          get each() {
            return Object.entries(r());
          },
          children: ([a, l]) => A(kd, {
            name: a,
            schema: l,
            get value() {
              return e()[a];
            },
            get required() {
              return n().includes(a);
            },
            onChange: (c) => s(a, c),
            get path() {
              return [...t.path, a];
            }
          })
        })), o;
      })();
    },
    get children() {
      var o = Ww();
      return $(o, A(Ae, {
        get each() {
          return Object.entries(r());
        },
        children: ([a, l]) => A(kd, {
          name: a,
          schema: l,
          get value() {
            return e()[a];
          },
          get required() {
            return n().includes(a);
          },
          onChange: (c) => s(a, c),
          get path() {
            return [...t.path, a];
          }
        })
      })), o;
    }
  });
}, ik = (t) => {
  const e = () => t.value || [], r = () => t.schema.items || {
    type: "string"
  }, n = () => {
    const l = Jh(r());
    t.onChange([...e(), l]);
  }, s = (l) => {
    const c = e().filter((d, u) => u !== l);
    t.onChange(c.length > 0 ? c : void 0);
  }, i = (l, c) => {
    const d = [...e()];
    d[l] = c, t.onChange(d);
  }, o = (l, c) => {
    if (c < 0 || c >= e().length)
      return;
    const d = [...e()], [u] = d.splice(l, 1);
    d.splice(c, 0, u), t.onChange(d);
  }, a = () => {
    const l = r().type;
    return l === "string" || l === "number" || l === "integer" || l === "boolean";
  };
  return (() => {
    var l = Qw(), c = l.firstChild;
    return $(l, A(Ae, {
      get each() {
        return e();
      },
      children: (d, u) => (() => {
        var f = Xw(), p = f.firstChild, b = p.firstChild, g = b.firstChild;
        g.firstChild;
        var m = b.nextSibling, w = m.firstChild, h = w.nextSibling, y = h.nextSibling;
        return $(g, () => u() + 1, null), $(b, A(z, {
          get when() {
            return r().type;
          },
          get children() {
            var k = Kh(), v = k.firstChild, x = v.nextSibling;
            return x.nextSibling, $(k, () => r().type, x), k;
          }
        }), null), w.$$click = () => o(u(), u() - 1), h.$$click = () => o(u(), u() + 1), y.$$click = () => s(u()), $(f, A(z, {
          get when() {
            return a();
          },
          get fallback() {
            return A(Ji, {
              get schema() {
                return r();
              },
              value: d,
              onChange: (k) => i(u(), k),
              get path() {
                return [...t.path, String(u())];
              }
            });
          },
          get children() {
            return A(ok, {
              get schema() {
                return r();
              },
              value: d,
              onChange: (k) => i(u(), k)
            });
          }
        }), null), ee((k) => {
          var v = u() === 0, x = u() === e().length - 1;
          return v !== k.e && (w.disabled = k.e = v), x !== k.t && (h.disabled = k.t = x), k;
        }, {
          e: void 0,
          t: void 0
        }), f;
      })()
    }), c), c.$$click = n, $(l, A(z, {
      get when() {
        return t.schema.minItems !== void 0 || t.schema.maxItems !== void 0;
      },
      get children() {
        var d = Yw();
        return $(d, A(z, {
          get when() {
            return t.schema.minItems !== void 0;
          },
          get children() {
            return ["Min items: ", Oe(() => t.schema.minItems)];
          }
        }), null), $(d, A(z, {
          get when() {
            return Oe(() => t.schema.minItems !== void 0)() && t.schema.maxItems !== void 0;
          },
          children: " | "
        }), null), $(d, A(z, {
          get when() {
            return t.schema.maxItems !== void 0;
          },
          get children() {
            return ["Max items: ", Oe(() => t.schema.maxItems)];
          }
        }), null), d;
      }
    }), null), l;
  })();
}, ok = (t) => {
  const e = () => t.schema.type || "string";
  return A(nf, {
    get fallback() {
      return A(Wa, {
        get schema() {
          return t.schema;
        },
        get value() {
          return t.value;
        },
        get onChange() {
          return t.onChange;
        }
      });
    },
    get children() {
      return [A(Rt, {
        get when() {
          return Oe(() => !!t.schema.enum)() && t.schema.enum.length > 0;
        },
        get children() {
          return A(Hh, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            }
          });
        }
      }), A(Rt, {
        get when() {
          return e() === "boolean";
        },
        get children() {
          return A(Vh, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            }
          });
        }
      }), A(Rt, {
        get when() {
          return e() === "number" || e() === "integer";
        },
        get children() {
          return A(zh, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            }
          });
        }
      })];
    }
  });
}, kd = (t) => {
  const e = () => t.schema.type || "string", r = () => e() === "object" || e() === "array";
  return (() => {
    var n = tk(), s = n.firstChild, i = s.firstChild, o = i.nextSibling;
    return $(i, () => t.name), $(s, A(z, {
      get when() {
        return t.required;
      },
      get children() {
        return Zw();
      }
    }), o), $(o, e), $(s, A(z, {
      get when() {
        return t.schema.format;
      },
      get children() {
        var a = Kh(), l = a.firstChild, c = l.nextSibling;
        return c.nextSibling, $(a, () => t.schema.format, c), a;
      }
    }), null), $(n, A(z, {
      get when() {
        return t.schema.description;
      },
      get children() {
        var a = ek();
        return $(a, () => t.schema.description), a;
      }
    }), null), $(n, A(z, {
      get when() {
        return r();
      },
      get fallback() {
        return (() => {
          var a = rk();
          return $(a, A(Ji, {
            get schema() {
              return t.schema;
            },
            get value() {
              return t.value;
            },
            get onChange() {
              return t.onChange;
            },
            get path() {
              return t.path;
            }
          })), a;
        })();
      },
      get children() {
        return A(Ji, {
          get schema() {
            return t.schema;
          },
          get value() {
            return t.value;
          },
          get onChange() {
            return t.onChange;
          },
          get path() {
            return t.path;
          }
        });
      }
    }), null), n;
  })();
};
function Jh(t) {
  if (t.default !== void 0)
    return t.default;
  switch (t.type || "string") {
    case "string":
      return "";
    case "number":
    case "integer":
      return 0;
    case "boolean":
      return !1;
    case "array":
      return [];
    case "object":
      if (t.properties) {
        const e = {}, r = t.required || [];
        for (const [n, s] of Object.entries(t.properties))
          r.includes(n) && (e[n] = Jh(s));
        return e;
      }
      return {};
    default:
      return;
  }
}
Ee(["click"]);
var ak = /* @__PURE__ */ M('<div><div class="flex items-center gap-1 p-1 rounded-xl glass-input overflow-x-auto scrollbar-thin"></div><div class=mt-4>'), xd = /* @__PURE__ */ M("<span>"), lk = /* @__PURE__ */ M("<button type=button role=tab>"), ck = /* @__PURE__ */ M('<div role=tabpanel class="animate-in fade-in slide-in-from-bottom-2 duration-200">');
const uk = (t) => {
  const [e, r] = Q(t.defaultTab || t.items[0]?.id);
  return (() => {
    var n = ak(), s = n.firstChild, i = s.nextSibling;
    return $(s, A(Ae, {
      get each() {
        return t.items;
      },
      children: (o) => (() => {
        var a = lk();
        return a.$$click = () => r(o.id), $(a, A(z, {
          get when() {
            return o.icon;
          },
          get children() {
            var l = xd();
            return $(l, () => o.icon), ee(() => te(l, e() === o.id ? "text-accent-500 dark:text-accent-500" : "")), l;
          }
        }), null), $(a, () => o.label, null), $(a, A(z, {
          get when() {
            return o.badge;
          },
          get children() {
            var l = xd();
            return $(l, () => o.badge), ee(() => te(l, `ml-1 px-1.5 py-0.5 text-[0.625rem] rounded-md ${e() === o.id ? "glass-button text-gray-700 dark:text-gray-200" : "glass-button text-gray-500 dark:text-gray-400"}`)), l;
          }
        }), null), ee((l) => {
          var c = `flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap outline-none focus-ring ${e() === o.id ? "glass-active text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"}`, d = e() === o.id;
          return c !== l.e && te(a, l.e = c), d !== l.t && he(a, "aria-selected", l.t = d), l;
        }, {
          e: void 0,
          t: void 0
        }), a;
      })()
    })), $(i, A(Ae, {
      get each() {
        return t.items;
      },
      children: (o) => A(z, {
        get when() {
          return e() === o.id;
        },
        get children() {
          var a = ck();
          return $(a, () => o.content), a;
        }
      })
    })), ee(() => te(n, `w-full ${t.class ?? ""}`)), n;
  })();
};
Ee(["click"]);
var dk = /* @__PURE__ */ M('<h2 id=drawer-title class="text-lg font-semibold text-gray-900 dark:text-white">'), fk = /* @__PURE__ */ M('<button type=button class="ml-auto p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"aria-label=Close><svg class="w-5 h-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M6 18L18 6M6 6l12 12">'), hk = /* @__PURE__ */ M('<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/5">'), pk = /* @__PURE__ */ M('<div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-white/5">'), mk = /* @__PURE__ */ M('<div aria-modal=true><div><div class="flex flex-col h-full overflow-hidden"><div>');
const gk = {
  sm: "max-w-xs",
  md: "max-w-sm",
  lg: "max-w-md",
  xl: "max-w-lg"
}, yk = {
  left: {
    panel: "left-0",
    enter: "animate-in slide-in-from-left",
    exit: "animate-out slide-out-to-left"
  },
  right: {
    panel: "right-0",
    enter: "animate-in slide-in-from-right",
    exit: "animate-out slide-out-to-right"
  }
}, bk = 200, Wh = (t) => {
  const e = () => t.position ?? "right", r = () => t.size ?? "md", n = () => t.showClose ?? !0, [s, i] = Q(!1), [o, a] = Q(!1), {
    handleBackdropClick: l
  } = Dw({
    open: s,
    onClose: t.onClose,
    closeOnEscape: () => t.closeOnEscape ?? !0,
    closeOnBackdrop: () => t.closeOnBackdrop ?? !0
  });
  tt(() => {
    if (t.open)
      a(!1), i(!0);
    else if (s()) {
      a(!0);
      const p = setTimeout(() => {
        i(!1), a(!1);
      }, bk);
      rt(() => clearTimeout(p));
    }
  });
  const c = () => yk[e()], d = ah(), u = () => o() ? "animate-out fade-out duration-200" : "animate-in fade-in duration-200", f = () => o() ? `${c().exit} duration-200` : `${c().enter} duration-300`;
  return A(z, {
    get when() {
      return s();
    },
    get children() {
      return A(of, {
        get children() {
          var p = mk(), b = p.firstChild, g = b.firstChild, m = g.firstChild;
          return p.$$click = (w) => l(w), $(g, A(z, {
            get when() {
              return t.title || n();
            },
            get children() {
              var w = hk();
              return $(w, A(z, {
                get when() {
                  return t.title;
                },
                get children() {
                  var h = dk();
                  return $(h, () => t.title), h;
                }
              }), null), $(w, A(z, {
                get when() {
                  return n();
                },
                get children() {
                  var h = fk();
                  return dt(h, "click", t.onClose, !0), h;
                }
              }), null), w;
            }
          }), m), $(m, () => t.children), $(g, A(z, {
            get when() {
              return t.footer;
            },
            get children() {
              var w = pk();
              return $(w, () => t.footer), w;
            }
          }), null), ee((w) => {
            var h = `fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${u()} ${d() ? "dark" : ""}`, y = t.title ? "drawer-title" : void 0, k = `absolute inset-y-0 ${c().panel} w-full ${gk[r()]} glass-thick shadow-2xl overflow-hidden ${f()}`, v = `flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col scrollbar-thin ${t.noPadding ? "" : "p-6"}`;
            return h !== w.e && te(p, w.e = h), y !== w.t && he(p, "aria-labelledby", w.t = y), k !== w.a && te(b, w.a = k), v !== w.o && te(m, w.o = v), w;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          }), p;
        }
      });
    }
  });
};
Ee(["click"]);
var vk = /* @__PURE__ */ M('<div role=tooltip><div class="px-3 py-1.5 text-xs font-medium glass-tooltip rounded-lg whitespace-nowrap"></div><div aria-hidden=true>'), wk = /* @__PURE__ */ M("<div>");
const kk = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2"
}, xk = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-surface-900 dark:border-t-surface-800 border-x-transparent border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-surface-900 dark:border-b-surface-800 border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-surface-900 dark:border-l-surface-800 border-y-transparent border-r-transparent",
  right: "right-full top-1/2 -translate-y-1/2 border-r-surface-900 dark:border-r-surface-800 border-y-transparent border-l-transparent"
}, Sk = (t) => {
  const [e, r] = Q(!1);
  let n;
  const s = () => t.position ?? "top", i = () => t.delay ?? 200, o = () => {
    n = setTimeout(() => r(!0), i());
  }, a = () => {
    n && (clearTimeout(n), n = void 0), r(!1);
  };
  return rt(() => {
    n && clearTimeout(n);
  }), (() => {
    var l = wk();
    return l.$$focusout = a, l.$$focusin = o, l.addEventListener("mouseleave", a), l.addEventListener("mouseenter", o), $(l, () => t.children, null), $(l, A(z, {
      get when() {
        return e();
      },
      get children() {
        var c = vk(), d = c.firstChild, u = d.nextSibling;
        return $(d, () => t.content), ee((f) => {
          var p = `absolute z-50 ${kk[s()]} animate-in fade-in zoom-in-95 duration-150`, b = `absolute w-0 h-0 border-4 ${xk[s()]}`;
          return p !== f.e && te(c, f.e = p), b !== f.t && te(u, f.t = b), f;
        }, {
          e: void 0,
          t: void 0
        }), c;
      }
    }), null), ee(() => te(l, `relative inline-flex ${t.class ?? ""}`)), l;
  })();
};
Ee(["focusin", "focusout"]);
var _k = /* @__PURE__ */ M('<span>"<!>"'), Ek = /* @__PURE__ */ M("<span>null"), Sd = /* @__PURE__ */ M("<span>"), $k = /* @__PURE__ */ M('<button type=button class="w-4 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 -ml-4"><svg fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M9 5l7 7-7 7">'), Ak = /* @__PURE__ */ M('<span class="w-4 flex-shrink-0">'), Tk = /* @__PURE__ */ M('<span class="text-violet-600 dark:text-violet-400">"<!>"'), Ok = /* @__PURE__ */ M('<span class="text-gray-500 dark:text-gray-400 mx-1">:'), Ck = /* @__PURE__ */ M('<span class="text-gray-500 dark:text-gray-400">'), Nk = /* @__PURE__ */ M('<div class="ml-4 border-l border-gray-200 dark:border-gray-700 pl-2">'), la = /* @__PURE__ */ M('<span class="text-gray-500 dark:text-gray-400">,'), Ik = /* @__PURE__ */ M('<div class="flex items-center"><span class="w-4 flex-shrink-0"></span><span class="text-gray-500 dark:text-gray-400">'), Pk = /* @__PURE__ */ M('<div class="font-mono text-sm leading-relaxed"><div class="flex items-start">'), Lk = /* @__PURE__ */ M('<button type=button class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><span class="mx-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs"> '), Rk = /* @__PURE__ */ M('<svg class="w-3.5 h-3.5 text-emerald-500"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M5 13l4 4L19 7">'), jk = /* @__PURE__ */ M('<span class="text-emerald-600 dark:text-emerald-400">'), Mk = /* @__PURE__ */ M('<div><div class="absolute top-3 right-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button type=button class="px-2 py-1 text-xs font-medium text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 bg-surface-100/80 dark:bg-surface-800/80 hover:bg-surface-200/80 dark:hover:bg-surface-700/80 backdrop-blur-sm rounded-lg transition-all"title="Expand all"><svg class="w-3.5 h-3.5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg></button><button type=button class="px-2 py-1 text-xs font-medium text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 bg-surface-100/80 dark:bg-surface-800/80 hover:bg-surface-200/80 dark:hover:bg-surface-700/80 backdrop-blur-sm rounded-lg transition-all"title="Collapse all"><svg class="w-3.5 h-3.5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"></path></svg></button><button type=button class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 bg-surface-100/80 dark:bg-surface-800/80 hover:bg-surface-200/80 dark:hover:bg-surface-700/80 backdrop-blur-sm rounded-lg transition-all"></button></div><div class="p-6 pt-10 overflow-auto scrollbar-thin bg-surface-50/50 dark:bg-surface-900/50">'), Dk = /* @__PURE__ */ M('<svg class="w-3.5 h-3.5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">'), Bk = /* @__PURE__ */ M("<div class=pl-4>");
const qk = (t) => t === null ? "null" : Array.isArray(t) ? "array" : typeof t, Fk = (t) => {
  switch (t) {
    case "string":
      return "text-emerald-600 dark:text-emerald-400";
    case "number":
      return "text-blue-600 dark:text-blue-400";
    case "boolean":
      return "text-amber-600 dark:text-amber-400";
    case "null":
      return "text-gray-500 dark:text-gray-500";
    default:
      return "text-gray-800 dark:text-gray-200";
  }
}, Gh = (t) => {
  const e = () => qk(t.value), r = () => e() === "object" || e() === "array", [n, s] = Q(t.depth < t.initialExpandDepth), i = pe(() => e() === "array" ? t.value.map((c, d) => [String(d), c]) : e() === "object" && t.value !== null ? Object.entries(t.value) : []), o = () => i().length, a = () => e() === "array" ? ["[", "]"] : ["{", "}"], l = () => {
    const c = e(), d = Fk(c);
    return c === "string" ? (() => {
      var u = _k(), f = u.firstChild, p = f.nextSibling;
      return p.nextSibling, te(u, d), $(u, () => String(t.value), p), u;
    })() : c === "null" ? (() => {
      var u = Ek();
      return te(u, d), u;
    })() : c === "boolean" ? (() => {
      var u = Sd();
      return te(u, d), $(u, () => t.value ? "true" : "false"), u;
    })() : (() => {
      var u = Sd();
      return te(u, d), $(u, () => String(t.value)), u;
    })();
  };
  return (() => {
    var c = Pk(), d = c.firstChild;
    return $(d, A(z, {
      get when() {
        return r();
      },
      get children() {
        var u = $k(), f = u.firstChild;
        return u.$$click = () => s(!n()), ee((p) => {
          var b = n() ? "Collapse" : "Expand", g = `w-3 h-3 transition-transform duration-150 ${n() ? "rotate-90" : ""}`;
          return b !== p.e && he(u, "aria-label", p.e = b), g !== p.t && he(f, "class", p.t = g), p;
        }, {
          e: void 0,
          t: void 0
        }), u;
      }
    }), null), $(d, A(z, {
      get when() {
        return !r();
      },
      get children() {
        return Ak();
      }
    }), null), $(d, A(z, {
      get when() {
        return t.keyName !== void 0;
      },
      get children() {
        return [(() => {
          var u = Tk(), f = u.firstChild, p = f.nextSibling;
          return p.nextSibling, $(u, () => t.keyName, p), u;
        })(), Ok()];
      }
    }), null), $(d, A(z, {
      get when() {
        return r();
      },
      get fallback() {
        return [Oe(l), A(z, {
          get when() {
            return !t.isLast;
          },
          get children() {
            return la();
          }
        })];
      },
      get children() {
        return A(z, {
          get when() {
            return n();
          },
          get fallback() {
            return [(() => {
              var u = Lk(), f = u.firstChild, p = f.firstChild;
              return u.$$click = () => s(!0), $(u, () => a()[0], f), $(f, o, p), $(f, () => o() === 1 ? "item" : "items", null), $(u, () => a()[1], null), u;
            })(), A(z, {
              get when() {
                return !t.isLast;
              },
              get children() {
                return la();
              }
            })];
          },
          get children() {
            var u = Ck();
            return $(u, () => a()[0]), u;
          }
        });
      }
    }), null), $(c, A(z, {
      get when() {
        return Oe(() => !!r())() && n();
      },
      get children() {
        return [(() => {
          var u = Nk();
          return $(u, A(Ae, {
            get each() {
              return i();
            },
            children: ([f, p], b) => A(Gh, {
              get keyName() {
                return e() === "object" ? f : void 0;
              },
              value: p,
              get depth() {
                return t.depth + 1;
              },
              get initialExpandDepth() {
                return t.initialExpandDepth;
              },
              get isLast() {
                return b() === o() - 1;
              }
            })
          })), u;
        })(), (() => {
          var u = Ik(), f = u.firstChild, p = f.nextSibling;
          return $(p, () => a()[1]), $(u, A(z, {
            get when() {
              return !t.isLast;
            },
            get children() {
              return la();
            }
          }), null), u;
        })()];
      }
    }), null), c;
  })();
}, Uk = (t) => {
  const {
    t: e
  } = Ce(), {
    copied: r,
    copy: n
  } = Rl(), s = () => t.maxHeight ?? "31.25rem", i = () => t.initialExpandDepth ?? 2, o = pe(() => mv(t.data)), [a, l] = Q(!1), [c, d] = Q(0), u = () => {
    l(!0), d((p) => p + 1);
  }, f = () => {
    l(!1), d((p) => p + 1);
  };
  return (() => {
    var p = Mk(), b = p.firstChild, g = b.firstChild, m = g.nextSibling, w = m.nextSibling, h = b.nextSibling;
    return g.$$click = u, m.$$click = f, w.$$click = () => n(o()), $(w, A(z, {
      get when() {
        return r();
      },
      get fallback() {
        return [Dk(), Oe(() => e("common.copy"))];
      },
      get children() {
        return [Rk(), (() => {
          var y = jk();
          return $(y, () => e("common.copied")), y;
        })()];
      }
    })), $(h, A(z, {
      get when() {
        return c() >= 0;
      },
      keyed: !0,
      children: (y) => (() => {
        var k = Bk();
        return $(k, A(Gh, {
          get value() {
            return t.data;
          },
          depth: 0,
          get initialExpandDepth() {
            return Oe(() => !!a())() ? 100 : i();
          },
          isLast: !0
        })), k;
      })()
    })), ee((y) => {
      var k = `relative group rounded-xl overflow-hidden ${t.class ?? ""}`, v = s();
      return k !== y.e && te(p, y.e = k), v !== y.t && sf(h, "max-height", y.t = v), y;
    }, {
      e: void 0,
      t: void 0
    }), p;
  })();
};
Ee(["click"]);
var Kk = /* @__PURE__ */ M("<div role=group>"), zk = /* @__PURE__ */ M("<button type=button>");
function jl(t) {
  const e = () => t.size === "sm" ? "px-2 py-1 text-[0.625rem]" : "px-3 py-1.5 text-xs";
  return (
    // biome-ignore lint/a11y/useSemanticElements: fieldset has browser styling that breaks the design
    (() => {
      var r = Kk();
      return $(r, A(Ae, {
        get each() {
          return t.options;
        },
        children: (n) => (() => {
          var s = zk();
          return s.$$click = () => !n.disabled && t.onChange(n.value), $(s, () => n.label), ee((i) => {
            var o = n.disabled, a = `${e()} font-bold rounded-lg transition-all ${t.value === n.value ? "bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm" : "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"} ${n.disabled ? "opacity-50 cursor-not-allowed" : ""}`;
            return o !== i.e && (s.disabled = i.e = o), a !== i.t && te(s, i.t = a), i;
          }, {
            e: void 0,
            t: void 0
          }), s;
        })()
      })), ee((n) => {
        var s = t["aria-label"], i = `flex items-center gap-1 p-1 bg-surface-200/80 dark:bg-surface-800/80 rounded-xl w-fit ${t.className ?? ""}`;
        return s !== n.e && he(r, "aria-label", n.e = s), i !== n.t && te(r, n.t = i), n;
      }, {
        e: void 0,
        t: void 0
      }), r;
    })()
  );
}
Ee(["click"]);
var Vk = /* @__PURE__ */ M('<div class="mt-4 md:mt-6 p-3 md:p-4 glass-card rounded-xl border-red-200/30 dark:border-red-800/20 shadow-lg shadow-red-500/5"><div class="flex items-start gap-3"><div class="flex-shrink-0 w-9 h-9 rounded-xl bg-red-500/15 dark:bg-red-500/20 flex items-center justify-center"><svg class="w-5 h-5 text-red-600 dark:text-red-400"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M6 18L18 6M6 6l12 12"></path></svg></div><div><h4 class="text-base font-bold text-red-800 dark:text-red-200">Request Failed</h4><p class="text-sm text-red-600 dark:text-red-400 mt-1 leading-relaxed">');
const Hk = (t) => (() => {
  var e = Vk(), r = e.firstChild, n = r.firstChild, s = n.nextSibling, i = s.firstChild, o = i.nextSibling;
  return $(o, () => t.message), e;
})();
var Jk = /* @__PURE__ */ M('<div class="mt-4 md:mt-6 first:mt-1 first:md:mt-2"><h3 class="text-xs font-bold text-surface-700 dark:text-surface-400 uppercase tracking-wider mb-2 md:mb-3 px-1"></h3><div class="space-y-2 md:space-y-3">');
const _d = (t) => (() => {
  var e = Jk(), r = e.firstChild, n = r.nextSibling;
  return $(r, () => t.title), $(n, () => t.children), e;
})();
var Wk = /* @__PURE__ */ M('<div class="divide-y divide-black/5 dark:divide-white/5">'), Gk = /* @__PURE__ */ M('<div class="px-4 py-2 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5"><div class="flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500"><span class="flex items-center gap-1"><kbd class="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">↑↓</kbd><span></span></span><span class="flex items-center gap-1"><kbd class="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">↵</kbd><span></span></span><span class="flex items-center gap-1"><kbd class="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">⌫</kbd><span>'), Yk = /* @__PURE__ */ M('<div class="flex flex-col h-full"><div class="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5"><div class="flex items-center gap-2"><button type=button class="px-3 py-1.5 text-xs font-bold glass-button rounded-lg text-surface-700 dark:text-surface-400 hover:text-surface-950 dark:hover:text-white"></button><button type=button class="px-3 py-1.5 text-xs font-bold glass-button rounded-lg text-surface-700 dark:text-surface-400 hover:text-surface-950 dark:hover:text-white"></button></div><button type=button></button></div><div class="flex-1 overflow-y-auto scrollbar-thin">'), Qk = /* @__PURE__ */ M('<div class="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500"><svg class="w-12 h-12 mb-3 opacity-50"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=1.5 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p class=text-sm>'), Xk = /* @__PURE__ */ M('<p class="text-xs text-rose-500 dark:text-rose-400 mt-1 truncate">'), Zk = /* @__PURE__ */ M('<button type=button class="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"><svg class="w-4 h-4"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">'), ex = /* @__PURE__ */ M('<div><div class="flex items-start gap-3"><div></div><span></span><div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1"><p class="text-sm font-mono font-bold text-surface-800 dark:text-surface-300 truncate"></p></div><div class="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-500 font-bold"><span></span></div></div><div class="flex items-center gap-1 flex-shrink-0"><button type=button class="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"><svg class="w-4 h-4"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">'), Ed = /* @__PURE__ */ M("<span>·"), tx = /* @__PURE__ */ M("<span>"), rx = /* @__PURE__ */ M("<span>ms");
const nx = (t) => {
  const {
    t: e
  } = Ce(), [r, n] = Q(!1), [s, i] = Q(0), [o, a] = Q(!1);
  let l, c;
  rt(() => {
    c && clearTimeout(c);
  }), tt(() => {
    t.open && (i(0), a(!1));
  }), Ar(() => {
    const y = (k) => {
      (k.metaKey || k.ctrlKey) && k.key.toLowerCase() === "h" && (k.preventDefault(), t.open ? t.onClose() : t.onOpen());
    };
    window.addEventListener("keydown", y), rt(() => window.removeEventListener("keydown", y));
  });
  const d = (y) => {
    if (!t.open)
      return;
    const k = t.store.state.entries;
    if (k.length !== 0)
      switch (y.key) {
        case "ArrowDown":
          y.preventDefault(), a(!0), i((v) => Math.min(v + 1, k.length - 1)), u();
          break;
        case "ArrowUp":
          y.preventDefault(), a(!0), i((v) => Math.max(v - 1, 0)), u();
          break;
        case "Enter": {
          y.preventDefault();
          const v = k[s()];
          v && t.onReplay && t.onReplay(v);
          break;
        }
        case "Backspace":
        case "Delete": {
          y.preventDefault();
          const v = k[s()];
          v && (t.store.actions.removeEntry(v.id), s() >= k.length - 1 && i((x) => Math.max(x - 1, 0)));
          break;
        }
      }
  };
  tt(() => {
    t.open ? window.addEventListener("keydown", d) : window.removeEventListener("keydown", d), rt(() => window.removeEventListener("keydown", d));
  });
  const u = () => {
    requestAnimationFrame(() => {
      l?.querySelector('[data-selected="true"]')?.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    });
  }, f = () => {
    a(!1);
  }, p = (y) => {
    const k = new Date(y), v = (/* @__PURE__ */ new Date()).getTime() - k.getTime(), x = Math.floor(v / 6e4), S = Math.floor(v / 36e5), _ = Math.floor(v / 864e5);
    return x < 1 ? e("history.justNow") : x < 60 ? e("history.minutesAgo", {
      minutes: x
    }) : S < 24 ? e("history.hoursAgo", {
      hours: S
    }) : _ < 7 ? e("history.daysAgo", {
      days: _
    }) : k.toLocaleDateString();
  }, b = (y) => bv(y.response?.status, !!y.error), g = (y) => ({
    get: {
      bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20"
    },
    post: {
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20"
    },
    put: {
      bg: "bg-gradient-to-r from-amber-500 to-amber-600",
      shadow: "shadow-amber-500/20"
    },
    patch: {
      bg: "bg-gradient-to-r from-violet-500 to-violet-600",
      shadow: "shadow-violet-500/20"
    },
    delete: {
      bg: "bg-gradient-to-r from-rose-500 to-rose-600",
      shadow: "shadow-rose-500/20"
    },
    grpc: {
      bg: "bg-gradient-to-r from-indigo-500 to-purple-600",
      shadow: "shadow-indigo-500/20"
    }
  })[y.toLowerCase()] || {
    bg: "bg-gradient-to-r from-gray-500 to-gray-600",
    shadow: "shadow-gray-500/20"
  }, m = async () => {
    r() ? (await t.store.actions.clearHistory(), n(!1), i(0), c && (clearTimeout(c), c = void 0)) : (n(!0), c && clearTimeout(c), c = setTimeout(() => {
      n(!1), c = void 0;
    }, 3e3));
  }, w = async () => {
    const y = await t.store.actions.exportHistory(), k = new Blob([y], {
      type: "application/json"
    }), v = URL.createObjectURL(k), x = document.createElement("a");
    x.href = v, x.download = `wti-history-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`, x.click(), URL.revokeObjectURL(v);
  }, h = () => {
    const y = document.createElement("input");
    y.type = "file", y.accept = ".json", y.onchange = async (k) => {
      const v = k.target;
      if (!(v instanceof HTMLInputElement))
        return;
      const x = v.files?.[0];
      if (x) {
        const S = await x.text();
        t.store.actions.importHistory(S);
      }
    }, y.click();
  };
  return A(Wh, {
    get open() {
      return t.open;
    },
    get onClose() {
      return t.onClose;
    },
    get title() {
      return e("history.title");
    },
    position: "right",
    size: "lg",
    noPadding: !0,
    get children() {
      var y = Yk(), k = y.firstChild, v = k.firstChild, x = v.firstChild, S = x.nextSibling, _ = v.nextSibling, T = k.nextSibling;
      x.$$click = w, $(x, () => e("history.export")), S.$$click = h, $(S, () => e("history.import")), _.$$click = m, $(_, (() => {
        var R = Oe(() => !!r());
        return () => R() ? e("history.confirmClear") : e("history.clearAll");
      })()), T.$$mousemove = f;
      var P = l;
      return typeof P == "function" ? rn(P, T) : l = T, $(T, A(z, {
        get when() {
          return t.store.state.entries.length > 0;
        },
        get fallback() {
          return (() => {
            var R = Qk(), D = R.firstChild, U = D.nextSibling;
            return $(U, () => e("history.empty")), R;
          })();
        },
        get children() {
          var R = Wk();
          return $(R, A(Ae, {
            get each() {
              return t.store.state.entries;
            },
            children: (D, U) => {
              const Y = g(D.operationMethod), se = () => o() && s() === U();
              return (() => {
                var be = ex(), xe = be.firstChild, W = xe.firstChild, ce = W.nextSibling, K = ce.nextSibling, I = K.firstChild, F = I.firstChild, L = I.nextSibling, E = L.firstChild, O = K.nextSibling, B = O.firstChild;
                return be.addEventListener("mouseenter", () => {
                  o() || i(U());
                }), $(ce, () => D.operationMethod.toUpperCase()), $(F, () => D.operationPath), $(E, () => p(D.timestamp)), $(L, A(z, {
                  get when() {
                    return D.response;
                  },
                  keyed: !0,
                  children: (V) => [Ed(), (() => {
                    var J = tx();
                    return $(J, () => V.status), ee(() => te(J, `font-bold ${vv(V.status)}`)), J;
                  })(), Ed(), (() => {
                    var J = rx(), ie = J.firstChild;
                    return $(J, () => Math.round(V.timing.duration), ie), J;
                  })()]
                }), null), $(K, A(z, {
                  get when() {
                    return D.error;
                  },
                  get children() {
                    var V = Xk();
                    return $(V, () => D.error), V;
                  }
                }), null), $(O, A(z, {
                  get when() {
                    return t.onReplay;
                  },
                  get children() {
                    var V = Zk();
                    return V.$$click = (J) => {
                      J.stopPropagation(), t.onReplay?.(D);
                    }, ee(() => he(V, "title", e("history.replay"))), V;
                  }
                }), B), B.$$click = (V) => {
                  V.stopPropagation(), t.store.actions.removeEntry(D.id);
                }, ee((V) => {
                  var J = se(), ie = `px-4 py-3 transition-all duration-200 ${se() ? "glass-active scale-[1.01]" : "hover:bg-white/40 dark:hover:bg-white/5 hover:shadow-sm"}`, ne = `w-2 h-2 rounded-full mt-2 flex-shrink-0 ${b(D)}`, N = `${Y.bg} text-white text-[0.625rem] font-bold uppercase w-12 py-1 rounded-md shadow-sm ${Y.shadow} flex-shrink-0 text-center`, j = e("history.delete");
                  return J !== V.e && he(be, "data-selected", V.e = J), ie !== V.t && te(be, V.t = ie), ne !== V.a && te(W, V.a = ne), N !== V.o && te(ce, V.o = N), j !== V.i && he(B, "title", V.i = j), V;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0,
                  o: void 0,
                  i: void 0
                }), be;
              })();
            }
          })), R;
        }
      })), $(y, A(z, {
        get when() {
          return t.store.state.entries.length > 0;
        },
        get children() {
          var R = Gk(), D = R.firstChild, U = D.firstChild, Y = U.firstChild, se = Y.nextSibling, be = U.nextSibling, xe = be.firstChild, W = xe.nextSibling, ce = be.nextSibling, K = ce.firstChild, I = K.nextSibling;
          return $(se, () => e("history.navigate")), $(W, () => e("history.replay")), $(I, () => e("history.delete")), R;
        }
      }), null), ee(() => te(_, `px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${r() ? "bg-red-500 text-white" : "glass-button text-surface-700 dark:text-surface-400 hover:text-red-600 dark:hover:text-red-400"}`)), y;
    }
  });
};
Ee(["click", "mousemove"]);
var sx = /* @__PURE__ */ M('<svg class="w-4 h-4 text-emerald-500"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M5 13l4 4L19 7">'), ix = /* @__PURE__ */ M('<div class="glass-card rounded-2xl overflow-hidden"><div class="flex items-center justify-between p-4 border-b border-surface-200/50 dark:border-surface-700/50"><button type=button class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-50 glass-button rounded-lg transition-all">'), ox = /* @__PURE__ */ M('<svg class="w-4 h-4"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">'), ax = /* @__PURE__ */ M('<div class="p-4 text-surface-500">Failed to generate code');
const lx = S0(), cx = (t) => {
  switch (t) {
    case "curl":
      return "bash";
    case "javascript":
      return "javascript";
    case "python":
      return "python";
    case "go":
      return "go";
    default:
      return "plaintext";
  }
}, ux = (t) => {
  const {
    t: e
  } = Ce(), [r, n] = Q("curl"), {
    copied: s,
    copy: i
  } = Rl(), o = pe(() => {
    try {
      return _0(r(), t.request);
    } catch {
      return null;
    }
  });
  return (() => {
    var a = ix(), l = a.firstChild, c = l.firstChild;
    return $(l, A(jl, {
      get value() {
        return r();
      },
      onChange: (d) => n(d),
      get options() {
        return lx.map((d) => ({
          value: d.language,
          label: d.displayName
        }));
      }
    }), c), c.$$click = () => {
      const d = o();
      d && i(d.code);
    }, $(c, A(z, {
      get when() {
        return s();
      },
      get fallback() {
        return [ox(), Oe(() => e("common.copy"))];
      },
      get children() {
        return [sx(), Oe(() => e("common.copied"))];
      }
    })), $(a, A(z, {
      get when() {
        return o();
      },
      get fallback() {
        return ax();
      },
      children: (d) => A(Uh, {
        get code() {
          return d().code;
        },
        get language() {
          return cx(d().language);
        },
        hideCopyButton: !0,
        maxHeight: "25rem"
      })
    }), null), a;
  })();
};
Ee(["click"]);
var dx = /* @__PURE__ */ M('<div class="mt-3 md:mt-4"><button type=button class="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><svg fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M9 5l7 7-7 7">'), fx = /* @__PURE__ */ M("<div class=mt-3>");
const hx = (t) => {
  const {
    t: e
  } = Ce();
  return (() => {
    var r = dx(), n = r.firstChild, s = n.firstChild;
    return dt(n, "click", t.onToggle, !0), $(n, () => e("codegen.title"), null), $(r, A(z, {
      get when() {
        return Oe(() => !!t.show)() && t.config;
      },
      keyed: !0,
      children: (i) => (() => {
        var o = fx();
        return $(o, A(ux, {
          request: i
        })), o;
      })()
    }), null), ee(() => he(s, "class", `w-3.5 h-3.5 transition-transform ${t.show ? "rotate-90" : ""}`)), r;
  })();
};
Ee(["click"]);
var px = /* @__PURE__ */ M('<svg class="w-4 h-4"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1">'), mx = /* @__PURE__ */ M('<h2 class="text-lg font-bold text-surface-900 dark:text-surface-50 mb-2 leading-snug">'), gx = /* @__PURE__ */ M('<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full"><svg class="w-3.5 h-3.5"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">'), yx = /* @__PURE__ */ M('<div class="mb-4 md:mb-5"><div class="flex items-start gap-3 mb-2"><span></span><div class="flex-1 min-w-0 pt-0.5 flex items-center gap-2"><code class="text-base font-mono text-surface-900 dark:text-surface-100 break-all leading-normal font-bold"></code><button type=button class="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"></button></div></div><div class="flex flex-wrap items-center gap-1.5 mt-2">'), bx = /* @__PURE__ */ M('<svg class="w-4 h-4 text-emerald-500"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M5 13l4 4L19 7">'), vx = /* @__PURE__ */ M('<span class="px-2.5 py-1 glass-button text-surface-800 dark:text-surface-300 text-xs font-bold rounded-full capitalize">');
const wx = {
  get: {
    bg: "from-emerald-500 to-green-600",
    glow: "shadow-emerald-500/20"
  },
  post: {
    bg: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20"
  },
  put: {
    bg: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20"
  },
  patch: {
    bg: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20"
  },
  delete: {
    bg: "from-rose-500 to-red-600",
    glow: "shadow-rose-500/20"
  },
  head: {
    bg: "from-cyan-500 to-teal-600",
    glow: "shadow-cyan-500/20"
  },
  options: {
    bg: "from-gray-500 to-slate-600",
    glow: "shadow-gray-500/20"
  },
  grpc: {
    bg: "from-indigo-500 to-purple-600",
    glow: "shadow-indigo-500/20"
  }
}, kx = {
  bg: "from-gray-500 to-slate-600",
  glow: "shadow-gray-500/20"
}, xx = (t) => {
  const {
    t: e
  } = Ce(), r = () => wx[t.operation.method.toLowerCase()] || kx, [n, s] = Q(!1), i = async () => {
    await pv(t.operation.id) && (s(!0), setTimeout(() => s(!1), 2e3));
  };
  return (() => {
    var o = yx(), a = o.firstChild, l = a.firstChild, c = l.nextSibling, d = c.firstChild, u = d.nextSibling, f = a.nextSibling;
    return $(l, () => t.operation.method), $(d, () => t.operation.path), u.$$click = i, $(u, A(z, {
      get when() {
        return !n();
      },
      get fallback() {
        return bx();
      },
      get children() {
        return px();
      }
    })), $(o, A(z, {
      get when() {
        return t.operation.summary;
      },
      get children() {
        var p = mx();
        return $(p, () => t.operation.summary), p;
      }
    }), f), $(o, A(z, {
      get when() {
        return t.operation.description;
      },
      get children() {
        return A(Fh, {
          get content() {
            return t.operation.description;
          },
          class: "max-w-3xl"
        });
      }
    }), f), $(f, A(z, {
      get when() {
        return t.operation.deprecated;
      },
      get children() {
        var p = gx();
        return p.firstChild, $(p, () => e("common.deprecated"), null), p;
      }
    }), null), $(f, A(z, {
      get when() {
        return t.operation.tags.length > 0;
      },
      get children() {
        return A(Ae, {
          get each() {
            return t.operation.tags;
          },
          children: (p) => (() => {
            var b = vx();
            return $(b, p), b;
          })()
        });
      }
    }), null), ee((p) => {
      var b = `bg-gradient-to-r ${r().bg} text-white text-xs font-bold uppercase min-w-[4.375rem] py-1.5 rounded-xl shadow-md ${r().glow} flex items-center justify-center`, g = e("common.copyLink");
      return b !== p.e && te(l, p.e = b), g !== p.t && he(u, "title", p.t = g), p;
    }, {
      e: void 0,
      t: void 0
    }), o;
  })();
};
Ee(["click"]);
var Sx = /* @__PURE__ */ M("<option value>-- Select --"), _x = /* @__PURE__ */ M("<option>"), Ex = /* @__PURE__ */ M('<div class="flex items-center">'), $x = /* @__PURE__ */ M('<span class="text-rose-600 dark:text-rose-500 text-xs font-bold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-900/20">req'), Ax = /* @__PURE__ */ M('<span class="text-surface-500 dark:text-surface-500 italic font-medium">enum'), Tx = /* @__PURE__ */ M('<div class="mt-2 text-[0.625rem] font-mono font-medium text-surface-600 dark:text-surface-500 bg-surface-50 dark:bg-surface-800/50 px-2 py-1 rounded w-fit">'), Ox = /* @__PURE__ */ M('<div class="mt-2 flex items-start gap-1.5 text-rose-500 dark:text-rose-400"><svg class="w-3.5 h-3.5 mt-0.5 flex-shrink-0"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><div class="text-xs space-y-0.5">'), Cx = /* @__PURE__ */ M('<div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-6 lg:gap-8 p-3 sm:p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"><div class="sm:w-2/5 md:w-1/3 min-w-0"><div class="flex items-center gap-2 mb-1"><span class="font-mono text-sm font-bold text-gray-900 dark:text-white break-all"></span></div><div class="flex items-center gap-2 text-xs mb-2"><span></span><span class="text-surface-600 dark:text-surface-400 font-mono font-medium"></span></div></div><div class="flex-1 w-full sm:w-auto">'), Nx = /* @__PURE__ */ M("<p>");
const ca = (t) => {
  const {
    t: e
  } = Ce(), r = {
    path: {
      label: e("operations.path"),
      color: "text-violet-700 dark:text-violet-400"
    },
    query: {
      label: e("operations.query"),
      color: "text-blue-700 dark:text-blue-400"
    },
    header: {
      label: e("operations.headers"),
      color: "text-amber-700 dark:text-amber-400"
    },
    cookie: {
      label: e("operations.cookie"),
      color: "text-surface-700 dark:text-surface-400"
    }
  }, n = () => r[t.param.in] || r.cookie, s = () => t.param.schema.type || "string", i = () => t.param.schema.enum && t.param.schema.enum.length > 0, o = (p) => {
    const b = p.params;
    switch (p.keyword) {
      case "required":
        return e("validation.required");
      case "type":
        return e("validation.type", {
          type: String(b.type ?? "")
        });
      case "minLength":
        return e("validation.minLength", {
          limit: String(b.limit ?? "")
        });
      case "maxLength":
        return e("validation.maxLength", {
          limit: String(b.limit ?? "")
        });
      case "minimum":
        return e("validation.minimum", {
          limit: String(b.limit ?? "")
        });
      case "maximum":
        return e("validation.maximum", {
          limit: String(b.limit ?? "")
        });
      case "exclusiveMinimum":
        return e("validation.exclusiveMinimum", {
          limit: String(b.limit ?? "")
        });
      case "exclusiveMaximum":
        return e("validation.exclusiveMaximum", {
          limit: String(b.limit ?? "")
        });
      case "multipleOf":
        return e("validation.multipleOf", {
          value: String(b.multipleOf ?? "")
        });
      case "pattern":
        return e("validation.pattern", {
          pattern: String(b.pattern ?? "")
        });
      case "enum":
        return e("validation.enum", {
          values: b.allowedValues?.join(", ") || ""
        });
      case "const":
        return e("validation.const", {
          value: JSON.stringify(b.allowedValue)
        });
      case "minItems":
        return e("validation.minItems", {
          limit: String(b.limit ?? "")
        });
      case "maxItems":
        return e("validation.maxItems", {
          limit: String(b.limit ?? "")
        });
      case "uniqueItems":
        return e("validation.uniqueItems");
      case "format":
        return e("validation.format", {
          format: String(b.format ?? "")
        });
      default:
        return p.message;
    }
  }, a = pe(() => My(t.value, t.param.schema, t.param.required)), l = pe(() => a().errors.map(o)), c = () => a().errors.length > 0, d = () => c() ? "border-rose-400 dark:border-rose-500" : "", u = () => i() ? A(os, {
    get value() {
      return t.value;
    },
    get onChange() {
      return t.onChange;
    },
    get class() {
      return d();
    },
    get children() {
      return [Sx(), A(Ae, {
        get each() {
          return t.param.schema.enum;
        },
        children: (p) => (() => {
          var b = _x();
          return $(b, () => String(p)), ee(() => b.value = String(p)), b;
        })()
      })];
    }
  }) : s() === "boolean" ? (() => {
    var p = Ex();
    return $(p, A(Eh, {
      get checked() {
        return t.value === "true";
      },
      onChange: (b) => t.onChange(b ? "true" : "false"),
      get label() {
        return t.value === "true" ? "true" : "false";
      }
    })), p;
  })() : s() === "number" || s() === "integer" ? A(Ot, {
    type: "number",
    get value() {
      return t.value;
    },
    get onInput() {
      return t.onChange;
    },
    get placeholder() {
      return t.param.schema.default?.toString() || "0";
    },
    get class() {
      return d();
    }
  }) : A(Ot, {
    get value() {
      return t.value;
    },
    get onInput() {
      return t.onChange;
    },
    get placeholder() {
      return t.param.schema.default?.toString() || t.param.name;
    },
    get class() {
      return d();
    }
  }), f = pe(() => {
    const p = [], b = t.param.schema;
    return b.minLength !== void 0 && p.push(`min: ${b.minLength}`), b.maxLength !== void 0 && p.push(`max: ${b.maxLength}`), b.minimum !== void 0 && p.push(`>= ${b.minimum}`), b.maximum !== void 0 && p.push(`<= ${b.maximum}`), b.pattern && p.push("pattern"), p.length > 0 ? p.join(", ") : null;
  });
  return (() => {
    var p = Cx(), b = p.firstChild, g = b.firstChild, m = g.firstChild, w = g.nextSibling, h = w.firstChild, y = h.nextSibling, k = b.nextSibling;
    return $(m, () => t.param.name), $(g, A(z, {
      get when() {
        return t.param.required;
      },
      get children() {
        return $x();
      }
    }), null), $(h, () => n().label), $(y, s), $(w, A(z, {
      get when() {
        return i();
      },
      get children() {
        return Ax();
      }
    }), null), $(b, A(z, {
      get when() {
        return t.param.description;
      },
      get children() {
        return A(Fh, {
          get content() {
            return t.param.description;
          },
          class: "text-xs text-surface-700 dark:text-surface-400 leading-relaxed font-medium"
        });
      }
    }), null), $(b, A(z, {
      get when() {
        return f();
      },
      get children() {
        var v = Tx();
        return $(v, f), v;
      }
    }), null), $(k, u, null), $(k, A(z, {
      get when() {
        return c();
      },
      get children() {
        var v = Ox(), x = v.firstChild, S = x.nextSibling;
        return $(S, A(Ae, {
          get each() {
            return l();
          },
          children: (_) => (() => {
            var T = Nx();
            return $(T, _), T;
          })()
        })), v;
      }
    }), null), ee(() => te(h, `font-bold px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 ${n().color}`)), p;
  })();
};
var Ix = /* @__PURE__ */ M('<div class="border-t border-gray-200 dark:border-white/5 overflow-x-auto"><table class="w-full text-sm min-w-[25rem]"><thead><tr class="bg-surface-50/50 dark:bg-white/[0.02]"><th class="px-3 sm:px-5 py-2 sm:py-2.5 text-left text-[0.625rem] sm:text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider w-1/3">Name</th><th class="px-3 sm:px-5 py-2 sm:py-2.5 text-left text-[0.625rem] sm:text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider">Value</th></tr></thead><tbody class="divide-y divide-surface-100/80 dark:divide-white/5">'), Px = /* @__PURE__ */ M('<div class="mt-4 glass-card rounded-xl overflow-hidden"><button type=button class="w-full flex items-center justify-between px-5 py-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"><div class="flex items-center gap-2.5"><svg fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M9 5l7 7-7 7"></path></svg><span class="text-sm font-bold text-surface-800 dark:text-surface-200"></span><span class="px-2 py-0.5 text-xs font-bold text-surface-700 dark:text-surface-400 bg-surface-100/80 dark:bg-white/5 rounded-md"></span></div><svg fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M19 9l-7 7-7-7">'), Lx = /* @__PURE__ */ M('<tr class="hover:bg-surface-50/50 dark:hover:bg-white/[0.02] transition-colors"><td class="px-3 sm:px-5 py-2.5 sm:py-3 font-mono text-[0.6875rem] sm:text-xs font-bold text-surface-800 dark:text-surface-300 break-all"></td><td class="px-3 sm:px-5 py-2.5 sm:py-3 font-mono text-[0.6875rem] sm:text-xs font-medium text-surface-700 dark:text-surface-400 break-all">');
const Rx = (t) => {
  const {
    t: e
  } = Ce(), [r, n] = Q(!0), s = () => Object.entries(t.headers), i = () => s().length, o = () => i() > 0;
  return A(z, {
    get when() {
      return o();
    },
    get children() {
      var a = Px(), l = a.firstChild, c = l.firstChild, d = c.firstChild, u = d.nextSibling, f = u.nextSibling, p = c.nextSibling;
      return l.$$click = () => n(!r()), $(u, () => e("response.headers")), $(f, i), $(a, A(z, {
        get when() {
          return r();
        },
        get children() {
          var b = Ix(), g = b.firstChild, m = g.firstChild, w = m.nextSibling;
          return $(w, A(Ae, {
            get each() {
              return s();
            },
            children: ([h, y]) => (() => {
              var k = Lx(), v = k.firstChild, x = v.nextSibling;
              return $(v, h), $(x, y), k;
            })()
          })), b;
        }
      }), null), ee((b) => {
        var g = `w-4 h-4 text-surface-600 dark:text-surface-400 transition-transform duration-200 ${r() ? "rotate-90" : ""}`, m = `w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${r() ? "rotate-180" : ""}`;
        return g !== b.e && he(d, "class", b.e = g), m !== b.t && he(p, "class", b.t = m), b;
      }, {
        e: void 0,
        t: void 0
      }), a;
    }
  });
};
Ee(["click"]);
var jx = /* @__PURE__ */ M('<div class="glass-card rounded-2xl overflow-hidden mt-2">'), Mx = /* @__PURE__ */ M("<div class=mt-2>"), Dx = /* @__PURE__ */ M('<svg class="w-5 h-5 sm:w-4 sm:h-4 text-emerald-500"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M5 13l4 4L19 7">'), Bx = /* @__PURE__ */ M('<span class="hidden sm:inline text-emerald-600 dark:text-emerald-400">'), qx = /* @__PURE__ */ M('<div class="mt-4 md:mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500"><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3"><div class="flex flex-wrap items-center gap-2 sm:gap-4"><span> </span><div class="flex items-center gap-2 text-xs sm:text-sm text-surface-700 dark:text-surface-400 font-bold glass-button px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl"><svg class="w-3.5 h-3.5 sm:w-4 sm:h-4"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>ms</div></div><button type=button class="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-bold text-surface-800 dark:text-surface-300 hover:text-surface-950 dark:hover:text-white glass-button rounded-xl transition-all">'), Fx = /* @__PURE__ */ M('<svg class="w-5 h-5 sm:w-4 sm:h-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">'), Ux = /* @__PURE__ */ M('<span class="hidden sm:inline">');
const Kx = 2e3, zx = (t) => {
  const {
    t: e
  } = Ce(), [r, n] = Q(!1), s = async () => {
    const l = typeof t.response.body == "object" ? JSON.stringify(t.response.body, null, 2) : t.response.bodyText;
    try {
      await navigator.clipboard.writeText(l), n(!0), setTimeout(() => n(!1), Kx);
    } catch {
    }
  }, i = () => yv(t.response.status), o = () => typeof t.response.body == "object" && t.response.body !== null, a = () => [{
    id: "body",
    label: "Response Body",
    content: (() => {
      var l = jx();
      return $(l, (() => {
        var c = Oe(() => !!o());
        return () => c() ? A(Uk, {
          get data() {
            return t.response.body;
          },
          initialExpandDepth: 3,
          maxHeight: "none"
        }) : A(Uh, {
          get code() {
            return t.response.bodyText;
          },
          language: "json"
        });
      })()), l;
    })()
  }, {
    id: "headers",
    label: "Headers",
    badge: Object.keys(t.response.headers).length,
    content: (() => {
      var l = Mx();
      return $(l, A(Rx, {
        get headers() {
          return t.response.headers;
        }
      })), l;
    })()
  }];
  return (() => {
    var l = qx(), c = l.firstChild, d = c.firstChild, u = d.firstChild, f = u.firstChild, p = u.nextSibling, b = p.firstChild, g = b.nextSibling, m = d.nextSibling;
    return $(u, () => t.response.status, f), $(u, () => t.response.statusText, null), $(p, () => Math.round(t.response.timing.duration), g), m.$$click = s, $(m, A(z, {
      get when() {
        return r();
      },
      get fallback() {
        return [Fx(), (() => {
          var w = Ux();
          return $(w, () => e("common.copy")), w;
        })()];
      },
      get children() {
        return [Dx(), (() => {
          var w = Bx();
          return $(w, () => e("common.copied")), w;
        })()];
      }
    })), $(l, A(uk, {
      get items() {
        return a();
      }
    }), null), ee((w) => {
      var h = `px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-sm ${i().bg} ${i().text}`, y = r() ? e("common.copied") : e("common.copy");
      return h !== w.e && te(u, w.e = h), y !== w.t && he(m, "aria-label", w.t = y), w;
    }, {
      e: void 0,
      t: void 0
    }), l;
  })();
};
Ee(["click"]);
var Vx = /* @__PURE__ */ M("<div class=space-y-4>"), Hx = /* @__PURE__ */ M("<div class=mb-4>"), Jx = /* @__PURE__ */ M('<div class=relative><div class="absolute top-3 right-3"><span class="text-[0.625rem] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">JSON'), Wx = /* @__PURE__ */ M('<svg class="w-5 h-5"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2.5 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3">'), Gx = /* @__PURE__ */ M('<div class="p-3 sm:p-4 md:p-5 lg:p-6 w-full lg:max-w-5xl mx-auto"><div class="mt-4 md:mt-6 lg:mt-8">');
const Yx = (t) => {
  const {
    t: e
  } = Ce(), r = Mw({
    operation: () => t.operation,
    initialValues: t.initialValues,
    onInitialValuesConsumed: t.onInitialValuesConsumed
  }), [n, s] = Q(!1), [i, o] = Q(null), [a, l] = Q(null), [c, d] = Q(!0), u = pe(() => {
    const b = {
      path: [],
      query: [],
      header: [],
      cookie: []
    };
    for (const g of t.operation.parameters)
      b[g.in].push(g);
    return b;
  }), f = pe(() => {
    try {
      return $c(t.operation, r.getRequestValues(), {
        server: t.server,
        serverVariables: t.serverVariables
      });
    } catch {
      return null;
    }
  }), p = async () => {
    s(!0), l(null), o(null);
    let b = null;
    try {
      const g = await t.authStore?.actions.getActiveAuthWithAutoRefresh();
      b = $c(t.operation, r.getRequestValues(), {
        server: t.server,
        serverVariables: t.serverVariables,
        auth: g
      });
      const m = await t0(b);
      o(m), t.historyStore?.actions.addEntry({
        operationId: t.operation.id,
        operationPath: t.operation.path,
        operationMethod: t.operation.method,
        request: b,
        requestValues: r.getRequestValues(),
        response: m
      });
    } catch (g) {
      const m = g instanceof Error ? g.message : "Request failed";
      l(m), b && t.historyStore?.actions.addEntry({
        operationId: t.operation.id,
        operationPath: t.operation.path,
        operationMethod: t.operation.method,
        request: b,
        requestValues: r.getRequestValues(),
        error: m
      });
    } finally {
      s(!1);
    }
  };
  return (() => {
    var b = Gx(), g = b.firstChild;
    return $(b, A(xx, {
      get operation() {
        return t.operation;
      }
    }), g), $(b, A(z, {
      get when() {
        return t.operation.parameters.length > 0;
      },
      get children() {
        return A(_d, {
          get title() {
            return e("operations.parameters");
          },
          get children() {
            var m = Vx();
            return $(m, A(Ae, {
              get each() {
                return u().path;
              },
              children: (w) => A(ca, {
                param: w,
                get value() {
                  return r.pathParams()[w.name] || "";
                },
                onChange: (h) => r.setPathParams((y) => ({
                  ...y,
                  [w.name]: h
                }))
              })
            }), null), $(m, A(Ae, {
              get each() {
                return u().query;
              },
              children: (w) => A(ca, {
                param: w,
                get value() {
                  return r.queryParams()[w.name] || "";
                },
                onChange: (h) => r.setQueryParams((y) => ({
                  ...y,
                  [w.name]: h
                }))
              })
            }), null), $(m, A(Ae, {
              get each() {
                return u().header;
              },
              children: (w) => A(ca, {
                param: w,
                get value() {
                  return r.headerParams()[w.name] || "";
                },
                onChange: (h) => r.setHeaderParams((y) => ({
                  ...y,
                  [w.name]: h
                }))
              })
            }), null), m;
          }
        });
      }
    }), g), $(b, A(z, {
      get when() {
        return r.hasRequestBody();
      },
      get children() {
        return A(_d, {
          get title() {
            return e("operations.requestBody");
          },
          get children() {
            return [A(z, {
              get when() {
                return r.canUseFormMode();
              },
              get children() {
                var m = Hx();
                return $(m, A(jl, {
                  get value() {
                    return r.bodyMode();
                  },
                  onChange: (w) => w === "json" ? r.switchToJsonMode() : r.switchToFormMode(),
                  get options() {
                    return [{
                      value: "json",
                      label: e("operations.jsonMode")
                    }, {
                      value: "form",
                      label: e("operations.formMode")
                    }];
                  }
                })), m;
              }
            }), A(z, {
              get when() {
                return r.bodyMode() === "json";
              },
              get children() {
                var m = Jx(), w = m.firstChild;
                return $(m, A(El, {
                  get value() {
                    return r.body();
                  },
                  get onInput() {
                    return r.setBody;
                  },
                  placeholder: "{}",
                  class: "h-64 font-mono"
                }), w), m;
              }
            }), A(z, {
              get when() {
                return Oe(() => r.bodyMode() === "form")() && r.bodySchema();
              },
              keyed: !0,
              children: (m) => A(Ji, {
                schema: m,
                get value() {
                  return r.bodyFormData();
                },
                onChange: (w) => {
                  Array.isArray(w) ? r.setBodyFormData(w) : r.setBodyFormData(w || {});
                }
              })
            })];
          }
        });
      }
    }), g), $(b, A(hx, {
      get show() {
        return c();
      },
      onToggle: () => d(!c()),
      get config() {
        return f();
      }
    }), g), $(g, A(Er, {
      onClick: p,
      get loading() {
        return n();
      },
      class: "w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-base",
      get children() {
        return [Oe(() => e("common.send")), Wx()];
      }
    })), $(b, A(z, {
      get when() {
        return a();
      },
      keyed: !0,
      children: (m) => A(Hk, {
        message: m
      })
    }), null), $(b, A(z, {
      get when() {
        return i();
      },
      keyed: !0,
      children: (m) => A(zx, {
        response: m
      })
    }), null), b;
  })();
};
var Qx = /* @__PURE__ */ M('<div class="flex gap-1.5">');
const go = (t) => {
  const {
    t: e
  } = Ce();
  return (() => {
    var r = Qx();
    return $(r, A(Er, {
      get onClick() {
        return t.onAuthorize;
      },
      class: "flex-1 px-3 py-1.5 text-xs",
      get children() {
        return e("auth.authorize");
      }
    }), null), $(r, A(z, {
      get when() {
        return t.isAuthorized();
      },
      get children() {
        return A(Er, {
          get onClick() {
            return t.onLogout;
          },
          variant: "secondary",
          class: "px-3 py-1.5 text-xs",
          get children() {
            return e("auth.logout");
          }
        });
      }
    }), null), r;
  })();
};
var Xx = /* @__PURE__ */ M('<div><label class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">');
const Qn = (t) => (() => {
  var e = Xx(), r = e.firstChild;
  return $(r, () => t.label), $(e, A(Ot, {
    get id() {
      return t.id;
    },
    get type() {
      return t.type ?? "text";
    },
    get value() {
      return t.value;
    },
    get onInput() {
      return t.onInput;
    },
    get placeholder() {
      return t.placeholder;
    }
  }), null), $(e, () => t.hint, null), ee(() => he(r, "for", t.id)), e;
})();
var Zx = /* @__PURE__ */ M('<div><label for=auth-apikey-scheme class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">Scheme'), eS = /* @__PURE__ */ M("<div class=space-y-3>"), tS = /* @__PURE__ */ M("<option> (<!>)");
const rS = (t) => {
  const {
    t: e
  } = Ce(), r = ls(t.authStore, "apiKey"), n = () => {
    const d = [];
    for (const [u, f] of Object.entries(t.securitySchemes))
      f.type === "apiKey" && f.in && d.push({
        name: f.name || u,
        in: f.in
      });
    return d.length === 0 && d.push({
      name: "X-API-Key",
      in: "header"
    }), d;
  }, [s, i] = Q(n()[0]?.name || "X-API-Key"), [o, a] = Q(""), l = () => {
    const d = n().find((u) => u.name === s());
    d && o() && t.authStore.actions.setApiKey(d.name, o(), d.in);
  }, c = () => {
    t.authStore.actions.clearAuth(s()), a("");
  };
  return (() => {
    var d = eS();
    return $(d, A(z, {
      get when() {
        return n().length > 1;
      },
      get children() {
        var u = Zx();
        return u.firstChild, $(u, A(os, {
          id: "auth-apikey-scheme",
          get value() {
            return s();
          },
          onChange: i,
          get children() {
            return A(Ae, {
              get each() {
                return n();
              },
              children: (f) => (() => {
                var p = tS(), b = p.firstChild, g = b.nextSibling;
                return g.nextSibling, $(p, () => f.name, b), $(p, () => f.in, g), ee(() => p.value = f.name), p;
              })()
            });
          }
        }), null), u;
      }
    }), null), $(d, A(Qn, {
      id: "auth-apikey-value",
      get label() {
        return e("auth.apiKey");
      },
      type: "password",
      get value() {
        return r()?.value || o();
      },
      onInput: a,
      placeholder: "Enter API key..."
    }), null), $(d, A(go, {
      onAuthorize: l,
      onLogout: c,
      isAuthorized: () => !!r()
    }), null), d;
  })();
};
var nS = /* @__PURE__ */ M("<div class=space-y-3>");
const sS = (t) => {
  const {
    t: e
  } = Ce(), r = ls(t.authStore, "basic"), [n, s] = Q(""), [i, o] = Q(""), a = () => {
    n() && t.authStore.actions.setBasicAuth(n(), i());
  }, l = () => {
    t.authStore.actions.clearAuth("basic"), s(""), o("");
  };
  return (() => {
    var c = nS();
    return $(c, A(Qn, {
      id: "auth-basic-username",
      get label() {
        return e("auth.username");
      },
      type: "text",
      get value() {
        return r()?.username || n();
      },
      onInput: s,
      placeholder: "Enter username..."
    }), null), $(c, A(Qn, {
      id: "auth-basic-password",
      get label() {
        return e("auth.password");
      },
      type: "password",
      get value() {
        return r()?.password || i();
      },
      onInput: o,
      placeholder: "Enter password..."
    }), null), $(c, A(go, {
      onAuthorize: a,
      onLogout: l,
      isAuthorized: () => !!r()
    }), null), c;
  })();
};
var iS = /* @__PURE__ */ M("<div class=space-y-3>");
const oS = (t) => {
  const {
    t: e
  } = Ce(), r = ls(t.authStore, "bearer"), [n, s] = Q(""), i = () => {
    n() && t.authStore.actions.setBearerToken(n());
  }, o = () => {
    t.authStore.actions.clearAuth("bearer"), s("");
  };
  return (() => {
    var a = iS();
    return $(a, A(Qn, {
      id: "auth-bearer-token",
      get label() {
        return e("auth.token");
      },
      type: "password",
      get value() {
        return r()?.token || n();
      },
      onInput: s,
      placeholder: "Enter bearer token..."
    }), null), $(a, A(go, {
      onAuthorize: i,
      onLogout: o,
      isAuthorized: () => !!r()
    }), null), a;
  })();
};
var aS = /* @__PURE__ */ M("<div class=space-y-3>"), lS = /* @__PURE__ */ M('<p class="text-xs text-surface-400 dark:text-surface-500 mt-1">Paste your OAuth2 access token obtained from your identity provider');
const cS = (t) => {
  const {
    t: e
  } = Ce(), r = ls(t.authStore, "oauth2"), [n, s] = Q(""), i = () => {
    n() && t.authStore.actions.setOAuth2Token(n());
  }, o = () => {
    t.authStore.actions.clearAuth("oauth2"), s("");
  };
  return (() => {
    var a = aS();
    return $(a, A(Qn, {
      id: "auth-oauth2-token",
      get label() {
        return e("auth.token");
      },
      type: "password",
      get value() {
        return r()?.accessToken || n();
      },
      onInput: s,
      placeholder: "Enter access token...",
      get hint() {
        return lS();
      }
    }), null), $(a, A(go, {
      onAuthorize: i,
      onLogout: o,
      isAuthorized: () => !!r()
    }), null), a;
  })();
};
var uS = /* @__PURE__ */ M('<div><label for=auth-openid-issuer class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">'), dS = /* @__PURE__ */ M('<div><label for=auth-openid-client-id class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">'), fS = /* @__PURE__ */ M('<div><label for=auth-openid-client-secret class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">'), hS = /* @__PURE__ */ M('<div><label for=auth-openid-scopes class="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-1.5">'), $d = /* @__PURE__ */ M('<div class="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"><p class="text-xs text-red-600 dark:text-red-400">'), pS = /* @__PURE__ */ M('<div class="p-3 glass-card rounded-lg"><div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 rounded-full bg-emerald-500"></span><p class="text-xs font-medium text-emerald-600 dark:text-emerald-400"></p></div><p class="text-xs text-surface-600 dark:text-surface-300 truncate"><span class=font-medium>:</span> </p><p class="text-xs text-surface-600 dark:text-surface-300 truncate mt-1"><span class=font-medium>:</span> '), mS = /* @__PURE__ */ M('<div class="flex gap-2">'), gS = /* @__PURE__ */ M("<div class=space-y-3>"), yS = /* @__PURE__ */ M("<div><p>");
function bS(t) {
  if (!t)
    return null;
  try {
    const e = t.split(".");
    if (e.length !== 3)
      return null;
    const r = JSON.parse(atob(e[1].replace(/-/g, "+").replace(/_/g, "/")));
    return r.name || r.preferred_username || r.email || r.sub || null;
  } catch {
    return null;
  }
}
const vS = (t) => {
  const {
    t: e
  } = Ce(), r = ls(t.authStore, "openid"), [n, s] = Q(""), [i, o] = Q(""), [a, l] = Q(""), [c, d] = Q("openid profile email"), [u, f] = Q(!1), [p, b] = Q(!1), [g, m] = Q(null), [w, h] = Q(Date.now()), y = setInterval(() => h(Date.now()), 1e4);
  rt(() => clearInterval(y)), tt(() => {
    const T = r(), P = w();
    !T?.accessToken || !T?.refreshToken || !T?.expiresAt || T.expiresAt - P <= 6e4 && !p() && !t.authStore.actions.isRefreshInCooldown() && (b(!0), t.authStore.actions.refreshOpenIdAuth().then((R) => {
      m(R ? null : e("auth.refreshFailed"));
    }).catch(() => {
      m(e("auth.refreshFailed"));
    }).finally(() => {
      b(!1);
    }));
  });
  const k = () => {
    const T = r();
    return T?.accessToken || T?.idToken;
  }, v = () => {
    const T = r();
    if (!T?.expiresAt)
      return null;
    const P = w(), R = T.expiresAt;
    if (P >= R)
      return {
        status: "expired",
        text: e("auth.tokenExpired")
      };
    const D = R - P, U = Math.floor(D / 6e4);
    if (U < 5)
      return {
        status: "expiring",
        text: e("auth.tokenExpiringSoon", {
          minutes: U
        })
      };
    if (U < 60)
      return {
        status: "valid",
        text: e("auth.tokenExpiresIn", {
          minutes: U
        })
      };
    const Y = Math.floor(U / 60);
    return {
      status: "valid",
      text: e("auth.tokenExpiresInHours", {
        hours: Y
      })
    };
  }, x = async () => {
    const T = n() || r()?.issuerUrl, P = i() || r()?.clientId, R = a() || r()?.clientSecret, D = c() || r()?.scopes?.join(" ") || "openid profile email";
    if (!T || !P) {
      m(e("auth.missingConfig"));
      return;
    }
    f(!0), m(null);
    try {
      await t.authStore.actions.startOpenIdLogin(T, P, {
        clientSecret: R || void 0,
        scopes: D.split(" ").filter(Boolean)
      });
    } catch (U) {
      m(U instanceof Error ? U.message : "Login failed"), f(!1);
    }
  }, S = async () => {
    b(!0);
    try {
      await t.authStore.actions.refreshOpenIdAuth() || m(e("auth.refreshFailed"));
    } catch (T) {
      m(T instanceof Error ? T.message : "Refresh failed");
    } finally {
      b(!1);
    }
  }, _ = () => {
    t.authStore.actions.clearOpenIdAuth(), s(""), o(""), l(""), d("openid profile email"), m(null);
  };
  return (() => {
    var T = gS();
    return $(T, A(z, {
      get when() {
        return !k();
      },
      get children() {
        return [(() => {
          var P = uS(), R = P.firstChild;
          return $(R, () => e("auth.issuerUrl")), $(P, A(Ot, {
            id: "auth-openid-issuer",
            type: "text",
            get value() {
              return r()?.issuerUrl || n();
            },
            onInput: s,
            placeholder: "https://accounts.example.com"
          }), null), P;
        })(), (() => {
          var P = dS(), R = P.firstChild;
          return $(R, () => e("auth.clientId")), $(P, A(Ot, {
            id: "auth-openid-client-id",
            type: "text",
            get value() {
              return r()?.clientId || i();
            },
            onInput: o,
            placeholder: "your-client-id"
          }), null), P;
        })(), (() => {
          var P = fS(), R = P.firstChild;
          return $(R, () => e("auth.clientSecret")), $(P, A(Ot, {
            id: "auth-openid-client-secret",
            type: "password",
            get value() {
              return r()?.clientSecret || a();
            },
            onInput: l,
            get placeholder() {
              return e("auth.clientSecretPlaceholder");
            }
          }), null), P;
        })(), (() => {
          var P = hS(), R = P.firstChild;
          return $(R, () => e("auth.scopes")), $(P, A(Ot, {
            id: "auth-openid-scopes",
            type: "text",
            get value() {
              return r()?.scopes?.join(" ") || c();
            },
            onInput: d,
            placeholder: "openid profile email"
          }), null), P;
        })(), A(z, {
          get when() {
            return g();
          },
          get children() {
            var P = $d(), R = P.firstChild;
            return $(R, g), P;
          }
        }), A(Er, {
          onClick: x,
          class: "w-full py-2 text-sm",
          get disabled() {
            return u();
          },
          get children() {
            return Oe(() => !!u())() ? e("auth.loggingIn") : e("auth.loginWithOpenId");
          }
        })];
      }
    }), null), $(T, A(z, {
      get when() {
        return k();
      },
      get children() {
        return [(() => {
          var P = pS(), R = P.firstChild, D = R.firstChild, U = D.nextSibling, Y = R.nextSibling, se = Y.firstChild, be = se.firstChild;
          se.nextSibling;
          var xe = Y.nextSibling, W = xe.firstChild, ce = W.firstChild;
          return W.nextSibling, $(U, A(z, {
            get when() {
              return bS(r()?.idToken);
            },
            get fallback() {
              return e("auth.loggedIn");
            },
            children: (K) => e("auth.loggedInAs", {
              username: K()
            })
          })), $(se, () => e("auth.issuerUrl"), be), $(Y, () => r()?.issuerUrl, null), $(W, () => e("auth.clientId"), ce), $(xe, () => r()?.clientId, null), P;
        })(), A(z, {
          get when() {
            return v();
          },
          children: (P) => (() => {
            var R = yS(), D = R.firstChild;
            return $(D, () => P().text), ee((U) => {
              var Y = `p-2 rounded-lg ${P().status === "expired" ? "bg-red-50 dark:bg-red-900/20" : P().status === "expiring" ? "bg-amber-50 dark:bg-amber-900/20" : "bg-surface-50 dark:bg-surface-800/50"}`, se = `text-xs ${P().status === "expired" ? "text-red-600 dark:text-red-400" : P().status === "expiring" ? "text-amber-600 dark:text-amber-400" : "text-surface-600 dark:text-surface-400"}`;
              return Y !== U.e && te(R, U.e = Y), se !== U.t && te(D, U.t = se), U;
            }, {
              e: void 0,
              t: void 0
            }), R;
          })()
        }), A(z, {
          get when() {
            return g();
          },
          get children() {
            var P = $d(), R = P.firstChild;
            return $(R, g), P;
          }
        }), (() => {
          var P = mS();
          return $(P, A(z, {
            get when() {
              return r()?.refreshToken;
            },
            get children() {
              return A(Er, {
                onClick: S,
                variant: "secondary",
                class: "flex-1 py-2 text-sm",
                get disabled() {
                  return p();
                },
                get children() {
                  return Oe(() => !!p())() ? e("auth.refreshing") : e("auth.refreshNow");
                }
              });
            }
          }), null), $(P, A(Er, {
            onClick: _,
            variant: "secondary",
            class: "flex-1 py-2 text-sm",
            get children() {
              return e("auth.logout");
            }
          }), null), P;
        })()];
      }
    }), null), T;
  })();
};
var wS = /* @__PURE__ */ M('<div class="mt-2 space-y-3">'), kS = /* @__PURE__ */ M('<div class="px-3 md:px-4 py-1.5 md:py-2"><button type=button class="w-full flex items-center justify-between py-1 group"><div class="flex items-center gap-2"><h3 class="text-sm font-bold text-surface-700 dark:text-surface-400 uppercase tracking-wider"></h3><span></span></div><svg fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2.5 d="M19 9l-7 7-7-7">');
const xS = (t) => {
  const {
    t: e
  } = Ce(), r = () => {
    const d = /* @__PURE__ */ new Set();
    for (const u of Object.values(t.securitySchemes))
      u.type === "apiKey" && d.add("apiKey"), u.type === "bearer" && d.add("bearer"), u.type === "basic" && d.add("basic"), u.type === "oauth2" && d.add("oauth2"), u.type === "openIdConnect" && d.add("openid");
    return d.size === 0 ? ["apiKey", "bearer", "basic", "oauth2", "openid"] : Array.from(d);
  }, [n, s] = Q(r()[0] || "apiKey"), [i, o] = Q(!1), a = () => {
    const d = t.authStore.state.configs;
    return Object.keys(d).some((u) => d[u] !== void 0);
  }, l = () => a() ? {
    text: e("auth.configured"),
    class: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500"
  } : {
    text: e("auth.notConfigured"),
    class: "text-surface-700 dark:text-surface-400",
    dot: "bg-surface-600 dark:bg-surface-500"
  }, c = (d) => ({
    apiKey: e("auth.apiKey"),
    bearer: e("auth.bearer"),
    basic: e("auth.basic"),
    oauth2: e("auth.oauth2"),
    openid: e("auth.openid")
  })[d];
  return (() => {
    var d = kS(), u = d.firstChild, f = u.firstChild, p = f.firstChild, b = p.nextSibling, g = f.nextSibling;
    return u.$$click = () => o(!i()), $(p, () => e("auth.title")), $(d, A(z, {
      get when() {
        return i();
      },
      get children() {
        var m = wS();
        return $(m, A(jl, {
          get value() {
            return n();
          },
          onChange: (w) => s(w),
          get options() {
            return r().map((w) => ({
              value: w,
              label: c(w)
            }));
          },
          className: "w-full",
          size: "sm"
        }), null), $(m, A(z, {
          get when() {
            return n() === "apiKey";
          },
          get children() {
            return A(rS, {
              get authStore() {
                return t.authStore;
              },
              get securitySchemes() {
                return t.securitySchemes;
              }
            });
          }
        }), null), $(m, A(z, {
          get when() {
            return n() === "bearer";
          },
          get children() {
            return A(oS, {
              get authStore() {
                return t.authStore;
              }
            });
          }
        }), null), $(m, A(z, {
          get when() {
            return n() === "basic";
          },
          get children() {
            return A(sS, {
              get authStore() {
                return t.authStore;
              }
            });
          }
        }), null), $(m, A(z, {
          get when() {
            return n() === "oauth2";
          },
          get children() {
            return A(cS, {
              get authStore() {
                return t.authStore;
              }
            });
          }
        }), null), $(m, A(z, {
          get when() {
            return n() === "openid";
          },
          get children() {
            return A(vS, {
              get authStore() {
                return t.authStore;
              }
            });
          }
        }), null), m;
      }
    }), null), ee((m) => {
      var w = `w-1.5 h-1.5 rounded-full ${l().dot}`, h = `w-3.5 h-3.5 text-surface-600 transition-transform ${i() ? "rotate-180" : ""}`;
      return w !== m.e && te(b, m.e = w), h !== m.t && he(g, "class", m.t = h), m;
    }, {
      e: void 0,
      t: void 0
    }), d;
  })();
};
Ee(["click"]);
var SS = /* @__PURE__ */ M('<button type=button><span></span><div class="flex-1 min-w-0 overflow-hidden"><span>'), _S = /* @__PURE__ */ M('<span class="block text-[0.6875rem] text-surface-700 dark:text-surface-400 truncate mt-0.5 font-medium">');
const ES = {
  get: {
    bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    shadow: "shadow-emerald-500/20"
  },
  post: {
    bg: "bg-gradient-to-r from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/20"
  },
  put: {
    bg: "bg-gradient-to-r from-amber-500 to-amber-600",
    shadow: "shadow-amber-500/20"
  },
  patch: {
    bg: "bg-gradient-to-r from-violet-500 to-violet-600",
    shadow: "shadow-violet-500/20"
  },
  delete: {
    bg: "bg-gradient-to-r from-rose-500 to-rose-600",
    shadow: "shadow-rose-500/20"
  },
  head: {
    bg: "bg-gradient-to-r from-cyan-500 to-cyan-600",
    shadow: "shadow-cyan-500/20"
  },
  options: {
    bg: "bg-gradient-to-r from-surface-500 to-surface-600",
    shadow: "shadow-surface-500/20"
  },
  grpc: {
    bg: "bg-gradient-to-r from-indigo-500 to-purple-600",
    shadow: "shadow-indigo-500/20"
  }
}, $S = {
  bg: "bg-gradient-to-r from-surface-500 to-surface-600",
  shadow: "shadow-surface-500/20"
}, AS = (t) => {
  const e = () => ES[t.operation.method.toLowerCase()] || $S, r = () => {
    const s = "w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-lg transition-all duration-200 cursor-pointer group border border-transparent";
    return t.selected ? `${s} glass-active scale-[1.01]` : `${s} hover:bg-white/40 dark:hover:bg-white/5 hover:shadow-sm`;
  }, n = () => t.operation.deprecated ? "opacity-50" : "";
  return (() => {
    var s = SS(), i = s.firstChild, o = i.nextSibling, a = o.firstChild;
    return dt(s, "click", t.onClick, !0), $(i, () => t.operation.method), $(a, () => t.operation.path), $(o, (() => {
      var l = Oe(() => !!t.operation.summary);
      return () => l() && (() => {
        var c = _S();
        return $(c, () => t.operation.summary), c;
      })();
    })(), null), ee((l) => {
      var c = `${r()} ${n()}`, d = `${e().bg} text-white text-[0.625rem] font-bold uppercase w-12 py-1 rounded-md shadow-sm ${e().shadow} flex-shrink-0 text-center flex items-center justify-center`, u = `block font-mono text-xs truncate ${t.selected ? "text-surface-950 dark:text-white font-semibold" : "text-surface-800 dark:text-surface-300 font-medium"} ${t.operation.deprecated ? "line-through" : ""}`;
      return c !== l.e && te(s, l.e = c), d !== l.t && te(i, l.t = d), u !== l.a && te(a, l.a = u), l;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), s;
  })();
};
Ee(["click"]);
var TS = /* @__PURE__ */ M("<div class=space-y-1.5>"), OS = /* @__PURE__ */ M('<div class="py-2 px-3">'), CS = /* @__PURE__ */ M('<div class="flex flex-col items-center justify-center py-6 text-center"><div class="w-12 h-12 rounded-xl glass-button flex items-center justify-center mb-3"><svg class="w-7 h-7 text-surface-400"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><p class="text-sm text-surface-500 dark:text-surface-400 font-medium">'), NS = /* @__PURE__ */ M('<div class="mt-1 ml-2.5 pl-2.5 border-l border-surface-200/50 dark:border-surface-700/30 space-y-1">'), IS = /* @__PURE__ */ M('<div><button type=button class="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/40 dark:hover:bg-white/5 transition-smooth group"><div></div><span class="flex-1 text-left text-sm font-bold text-gray-900 dark:text-surface-200 capitalize"></span><span class="text-[0.6875rem] font-bold text-surface-700 dark:text-surface-500 tabular-nums px-1.5 py-0.5 rounded-md glass-button">'), PS = /* @__PURE__ */ M('<svg viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2.5 aria-hidden=true><path d="M9 18l6-6-6-6">');
const LS = (t) => {
  const {
    t: e
  } = Ce(), r = pe(() => {
    const s = t.searchQuery.trim();
    return s && t.searchFn ? t.searchFn(s).map((i) => i.operation) : t.operations;
  }), n = pe(() => {
    const s = /* @__PURE__ */ new Map(), i = "default";
    for (const l of r()) {
      const c = l.tags.length > 0 ? l.tags : [i];
      for (const d of c)
        s.has(d) || s.set(d, []), s.get(d)?.push(l);
    }
    const o = [], a = Array.from(s.keys()).sort((l, c) => l === i ? 1 : c === i ? -1 : l.localeCompare(c));
    for (const l of a) {
      const c = s.get(l);
      c && o.push({
        name: l,
        operations: c
      });
    }
    return o;
  });
  return (() => {
    var s = OS();
    return $(s, A(z, {
      get when() {
        return r().length > 0;
      },
      get fallback() {
        return (() => {
          var i = CS(), o = i.firstChild, a = o.nextSibling;
          return $(a, () => e("common.noResults")), i;
        })();
      },
      get children() {
        var i = TS();
        return $(i, A(Ae, {
          get each() {
            return n();
          },
          children: (o) => A(RS, {
            group: o,
            get expanded() {
              return t.expandedTags.has(o.name);
            },
            get selectedOperationId() {
              return t.selectedOperationId;
            },
            onToggle: () => t.onToggleTag(o.name),
            get onSelectOperation() {
              return t.onSelectOperation;
            }
          })
        })), i;
      }
    })), s;
  })();
}, RS = (t) => (() => {
  var e = IS(), r = e.firstChild, n = r.firstChild, s = n.nextSibling, i = s.nextSibling;
  return dt(r, "click", t.onToggle, !0), $(n, A(jS, {
    get expanded() {
      return t.expanded;
    }
  })), $(s, () => t.group.name), $(i, () => t.group.operations.length), $(e, A(z, {
    get when() {
      return t.expanded;
    },
    get children() {
      var o = NS();
      return $(o, A(Ae, {
        get each() {
          return t.group.operations;
        },
        children: (a) => A(AS, {
          operation: a,
          get selected() {
            return a.id === t.selectedOperationId;
          },
          onClick: () => t.onSelectOperation(a)
        })
      })), o;
    }
  }), null), ee(() => te(n, `w-5 h-5 rounded-md flex items-center justify-center transition-smooth ${t.expanded ? "bg-accent-500/15 dark:bg-accent-500/20" : "glass-button"}`)), e;
})(), jS = (t) => (() => {
  var e = PS();
  return ee(() => he(e, "class", `w-3 h-3 transition-transform duration-200 ${t.expanded ? "rotate-90 text-accent-500" : "text-surface-500"}`)), e;
})();
Ee(["click"]);
var MS = /* @__PURE__ */ M('<button type=button class="p-1 rounded-md text-surface-600 hover:text-surface-800 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/40"aria-label="Clear search"><svg class="w-4 h-4"fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M6 18L18 6M6 6l12 12">'), DS = /* @__PURE__ */ M('<div class="relative group"><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200"><svg fill=none viewBox="0 0 24 24"stroke=currentColor stroke-width=2 aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><input type=text style="padding-left:44px !important;padding-right:40px !important"><div class="absolute inset-y-0 right-0 pr-3 flex items-center">'), BS = /* @__PURE__ */ M('<div><kbd class="hidden sm:inline-flex items-center justify-center h-5 px-1.5 text-[0.625rem] font-sans font-bold text-surface-700 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 rounded border border-surface-200 dark:border-surface-700">/');
const qS = (t) => {
  const {
    t: e
  } = Ce();
  let r;
  const [n, s] = Q(!1), i = (a) => {
    if (a.metaKey && a.key === "k" || a.ctrlKey && a.key === "k" || a.key === "/") {
      if (a.key === "/" && (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement))
        return;
      a.preventDefault(), r?.focus();
    }
    a.key === "Escape" && document.activeElement === r && r?.blur();
  };
  Ar(() => {
    window.addEventListener("keydown", i), rt(() => {
      window.removeEventListener("keydown", i);
    });
  });
  const o = () => {
    t.onInput(""), r?.focus();
  };
  return (() => {
    var a = DS(), l = a.firstChild, c = l.firstChild, d = l.nextSibling, u = d.nextSibling;
    d.addEventListener("blur", () => s(!1)), d.addEventListener("focus", () => s(!0)), d.$$input = (p) => t.onInput(p.currentTarget.value);
    var f = r;
    return typeof f == "function" ? rn(f, d) : r = d, $(u, A(z, {
      get when() {
        return t.value;
      },
      get fallback() {
        return (() => {
          var p = BS();
          return ee(() => te(p, `flex items-center gap-1 transition-opacity duration-200 ${n() ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`)), p;
        })();
      },
      get children() {
        var p = MS();
        return p.$$click = o, p;
      }
    })), ee((p) => {
      var b = `w-[1.125rem] h-[1.125rem] ${n() ? "text-accent-500 dark:text-accent-400" : "text-surface-600 dark:text-surface-500"}`, g = `w-full px-3 py-2 sm:py-2.5 glass-input text-base sm:text-sm text-surface-950 dark:text-surface-100 placeholder-surface-700 dark:placeholder-surface-500 font-medium outline-none transition-all duration-200 ${n() ? "shadow-lg shadow-accent-500/10" : ""}`, m = e("common.search");
      return b !== p.e && he(c, "class", p.e = b), g !== p.t && te(d, p.t = g), m !== p.a && he(d, "placeholder", p.a = m), p;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), ee(() => d.value = t.value), a;
  })();
};
Ee(["input", "click"]);
var FS = /* @__PURE__ */ M('<label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2"for=server-selector>'), US = /* @__PURE__ */ M('<div class=space-y-2><span class="block text-xs font-medium text-gray-500 dark:text-gray-400"></span><div class=space-y-2>'), KS = /* @__PURE__ */ M("<div><div>"), Yh = /* @__PURE__ */ M("<option>"), zS = /* @__PURE__ */ M('<div class="flex items-center gap-2"><div class=flex-1>'), VS = /* @__PURE__ */ M('<label class="text-xs font-mono text-gray-600 dark:text-gray-400 min-w-[3.75rem] shrink-0">'), HS = /* @__PURE__ */ M('<label class="text-xs font-mono text-gray-600 dark:text-gray-400 min-w-[3.75rem] shrink-0 cursor-help border-b border-dotted border-gray-400 dark:border-gray-500">');
const JS = (t) => {
  const {
    t: e
  } = Ce(), r = (o) => {
    const a = t.servers.find((l) => l.url === o);
    a && t.onChange(a);
  }, n = () => t.servers.find((o) => o.url === t.selectedUrl), s = () => {
    const o = n();
    return o?.variables && Object.keys(o.variables).length > 0;
  }, i = () => {
    const o = n();
    return o?.variables ? Object.entries(o.variables).map(([a, l]) => ({
      name: a,
      ...l
    })) : [];
  };
  return A(z, {
    get when() {
      return t.servers.length > 0;
    },
    get children() {
      var o = KS(), a = o.firstChild;
      return $(a, A(z, {
        get when() {
          return !t.hideLabel;
        },
        get children() {
          var l = FS();
          return $(l, () => e("sidebar.servers")), l;
        }
      }), null), $(a, A(os, {
        id: "server-selector",
        get value() {
          return t.selectedUrl || "";
        },
        onChange: r,
        get children() {
          return A(Ae, {
            get each() {
              return t.servers;
            },
            children: (l) => (() => {
              var c = Yh();
              return $(c, () => l.description || l.url), ee(() => c.value = l.url), c;
            })()
          });
        }
      }), null), $(o, A(z, {
        get when() {
          return s();
        },
        get children() {
          var l = US(), c = l.firstChild, d = c.nextSibling;
          return $(c, () => e("sidebar.serverVariables")), $(d, A(Ae, {
            get each() {
              return i();
            },
            children: (u) => A(WS, {
              get name() {
                return u.name;
              },
              variable: u,
              get value() {
                return t.serverVariables[u.name] ?? u.default;
              },
              onChange: (f) => t.onVariableChange(u.name, f)
            })
          })), l;
        }
      }), null), ee(() => te(o, `space-y-3 ${t.className ?? ""}`)), o;
    }
  });
}, WS = (t) => {
  const e = () => t.variable.enum && t.variable.enum.length > 0, r = () => `server-var-${t.name}`, n = () => e() ? A(os, {
    get id() {
      return r();
    },
    get value() {
      return t.value;
    },
    get onChange() {
      return t.onChange;
    },
    class: "text-xs",
    get children() {
      return A(Ae, {
        get each() {
          return t.variable.enum;
        },
        children: (i) => (() => {
          var o = Yh();
          return o.value = i, $(o, i), o;
        })()
      });
    }
  }) : A(Ot, {
    get id() {
      return r();
    },
    get value() {
      return t.value;
    },
    get onInput() {
      return t.onChange;
    },
    get placeholder() {
      return t.variable.default;
    },
    class: "text-xs"
  }), s = () => ["{", Oe(() => t.name), "}"];
  return (() => {
    var i = zS(), o = i.firstChild;
    return $(i, A(z, {
      get when() {
        return t.variable.description;
      },
      get fallback() {
        return (() => {
          var a = VS();
          return $(a, s), ee(() => he(a, "for", r())), a;
        })();
      },
      children: (a) => A(Sk, {
        get content() {
          return a();
        },
        get children() {
          var l = HS();
          return $(l, s), ee(() => he(l, "for", r())), l;
        }
      })
    }), o), $(o, n), i;
  })();
}, Qh = "wti-theme", Xh = Gd();
function Ad() {
  const t = kl(Qh, null);
  return t === "light" || t === "dark" ? t : null;
}
function GS() {
  return typeof window < "u" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function YS(t) {
  xl(Qh, t);
}
function QS(t) {
  const e = Ad() ?? t.initialTheme ?? GS(), [r, n] = Q(e);
  tt(() => {
    YS(r());
  });
  const s = () => {
    const i = r() === "dark" ? "light" : "dark";
    n(i);
  };
  return Ar(() => {
    const i = window.matchMedia("(prefers-color-scheme: dark)"), o = (a) => {
      Ad() || n(a.matches ? "dark" : "light");
    };
    return i.addEventListener("change", o), () => i.removeEventListener("change", o);
  }), A(Xh.Provider, {
    value: {
      theme: r,
      setTheme: n,
      toggleTheme: s
    },
    get children() {
      return t.children;
    }
  });
}
function Zh() {
  const t = Yd(Xh);
  if (!t)
    throw new Error("useTheme must be used within a ThemeProvider");
  return t;
}
var XS = /* @__PURE__ */ M('<button type=button class="w-8 h-8 shrink-0 rounded-lg glass-button flex items-center justify-center text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 transition-colors md:hidden"><svg class="w-4 h-4"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M6 18L18 6M6 6l12 12">'), ZS = /* @__PURE__ */ M('<header class="flex-shrink-0 z-10 px-3 md:px-4 py-2 md:py-3 overflow-hidden border-t md:border-t-0 border-surface-200 dark:border-white/5 glass-surface"><div class="flex items-center gap-2 md:gap-2.5 flex-nowrap"><div class="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg md:rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-md shadow-accent-500/20"><svg class="w-5 h-5 md:w-6 md:h-6 text-white"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M4 6h16M4 12h16M4 18h16"></path></svg></div><div class="flex-1 min-w-0"><h1 class="font-semibold text-gray-900 dark:text-white truncate leading-tight text-sm md:text-base"></h1><span class="text-xs text-surface-700 dark:text-surface-400 font-semibold">v</span></div><button type=button class="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg md:rounded-xl glass-button flex items-center justify-center text-surface-700 dark:text-surface-400 hover:text-surface-950 dark:hover:text-surface-200 transition-colors overflow-hidden"><div class="relative w-4 h-4 md:w-5 md:h-5"><svg fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg><svg fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg></div></button><button type=button class="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-lg md:rounded-xl glass-button flex items-center justify-center text-surface-700 dark:text-surface-400 hover:text-surface-950 dark:hover:text-surface-200 transition-colors"title="Request History"><svg class="w-4 h-4 md:w-5 md:h-5"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">');
const e1 = (t) => {
  const {
    theme: e,
    toggleTheme: r
  } = Zh(), {
    t: n
  } = Ce();
  return (() => {
    var s = ZS(), i = s.firstChild, o = i.firstChild, a = o.nextSibling, l = a.firstChild, c = l.nextSibling;
    c.firstChild;
    var d = a.nextSibling, u = d.firstChild, f = u.firstChild, p = f.nextSibling, b = d.nextSibling;
    return $(l, () => t.spec.info.title), $(c, () => t.spec.info.version, null), dt(d, "click", r, !0), b.$$click = () => t.onOpenHistory?.(), $(i, A(z, {
      get when() {
        return t.onClose;
      },
      get children() {
        var g = XS();
        return g.$$click = () => t.onClose?.(), ee(() => he(g, "title", n("common.close"))), g;
      }
    }), null), ee((g) => {
      var m = e() === "dark" ? n("sidebar.toggleThemeLight") : n("sidebar.toggleThemeDark"), w = e() === "dark" ? n("sidebar.toggleThemeLight") : n("sidebar.toggleThemeDark"), h = `absolute inset-0 w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${e() === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"}`, y = `absolute inset-0 w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${e() === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`;
      return m !== g.e && he(d, "aria-label", g.e = m), w !== g.t && he(d, "title", g.t = w), h !== g.a && he(f, "class", g.a = h), y !== g.o && he(p, "class", g.o = y), g;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), s;
  })();
};
Ee(["click"]);
var t1 = /* @__PURE__ */ M('<div class="flex flex-col-reverse md:flex-col flex-1 min-h-0"><div class="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin"><div class="hidden md:block mx-4 divider-glass"></div><div class="sticky top-0 z-10 glass-surface flex-shrink-0 px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2"><div class=flex-1></div></div><div class="mx-3 md:mx-4 divider-glass"></div><div class=px-0.5></div><div class="mx-3 md:mx-4 divider-glass"></div><div class="flex-1 min-h-0">');
const Td = (t) => {
  const e = () => {
    const r = t.store.state.spec;
    if (!r)
      throw new Error("Sidebar rendered without spec");
    return r;
  };
  return (() => {
    var r = t1(), n = r.firstChild, s = n.firstChild, i = s.nextSibling, o = i.firstChild, a = i.nextSibling, l = a.nextSibling, c = l.nextSibling, d = c.nextSibling;
    return $(r, A(e1, {
      get spec() {
        return e();
      },
      get onOpenHistory() {
        return t.onOpenHistory;
      },
      get onClose() {
        return t.onClose;
      }
    }), n), $(i, A(JS, {
      get servers() {
        return e().servers;
      },
      get selectedUrl() {
        return t.store.state.selectedServer?.url || null;
      },
      get serverVariables() {
        return t.store.state.serverVariables;
      },
      get onChange() {
        return t.store.actions.selectServer;
      },
      get onVariableChange() {
        return t.store.actions.setServerVariable;
      },
      hideLabel: !0,
      className: "w-1/3 min-w-[7.5rem]"
    }), o), $(o, A(qS, {
      get value() {
        return t.store.state.searchQuery;
      },
      get onInput() {
        return t.store.actions.setSearchQuery;
      }
    })), $(l, A(xS, {
      get authStore() {
        return t.authStore;
      },
      get securitySchemes() {
        return e().securitySchemes;
      }
    })), $(d, A(LS, {
      get operations() {
        return e().operations;
      },
      get expandedTags() {
        return t.store.state.expandedTags;
      },
      get selectedOperationId() {
        return t.store.state.selectedOperation?.id || null;
      },
      get searchQuery() {
        return t.store.state.searchQuery;
      },
      get onToggleTag() {
        return t.store.actions.toggleTag;
      },
      get onSelectOperation() {
        return t.store.actions.selectOperation;
      },
      get searchFn() {
        return t.store.search.searchOperations;
      }
    })), r;
  })();
};
var r1 = /* @__PURE__ */ M('<div class="flex items-center justify-center h-screen"><div class="glass-card rounded-3xl p-8 flex flex-col items-center gap-5"><div class=relative><div class="w-14 h-14 rounded-full border-4 border-blue-200/50 dark:border-blue-800/30"></div><div class="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div></div><p class="text-surface-600 dark:text-surface-300 font-medium">Loading API specification...'), n1 = /* @__PURE__ */ M('<button type=button class="mt-4 px-4 py-2 text-sm font-medium rounded-xl glass-button text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">Try again'), s1 = /* @__PURE__ */ M('<div class="flex items-center justify-center h-screen p-6"><div class="glass-card rounded-3xl p-8 max-w-lg border-red-200/30 dark:border-red-800/20"><div class="flex items-start gap-4"><div class="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20"><svg class="w-7 h-7 text-white"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="flex-1 min-w-0"><h3 class="font-semibold text-lg text-surface-900 dark:text-surface-50">Failed to load API</h3><p class="text-surface-600 dark:text-surface-400 mt-2 leading-relaxed">'), i1 = /* @__PURE__ */ M('<div class="flex flex-col items-center justify-center h-full min-h-screen text-center p-8"><div class="glass-card rounded-[2rem] p-10 max-w-md"><div class="relative inline-flex mb-8"><div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/25 transform hover:scale-105 transition-spring"><svg class="w-12 h-12 text-white"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=1.5 d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div><div class="absolute -inset-2 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-15 blur-2xl -z-10"></div></div><h1 class="text-4xl font-bold bg-gradient-to-r from-surface-900 via-surface-700 to-surface-900 dark:from-white dark:via-surface-200 dark:to-white bg-clip-text text-transparent mb-3">WTI</h1><p class="text-lg text-surface-600 dark:text-surface-400 mb-6 font-medium">What The Interface</p><div class="divider-glass my-8"></div><p class="text-surface-600 dark:text-surface-400 leading-relaxed">Select an operation from the sidebar to explore and test API endpoints</p><div class="mt-8 flex flex-col items-center gap-2 text-xs text-surface-500 dark:text-surface-500"><div class="inline-flex items-center gap-2.5"><kbd class="px-2.5 py-1.5 rounded-lg glass-button font-mono text-surface-700 dark:text-surface-300">/</kbd><span>to search</span></div><div class="inline-flex items-center gap-2.5"><kbd class="px-2.5 py-1.5 rounded-lg glass-button font-mono text-surface-700 dark:text-surface-300"><span class=text-[10px]>Cmd</span>+P</kbd><span>command palette'), o1 = /* @__PURE__ */ M('<div class="fixed top-4 right-4 z-50 glass-card rounded-xl p-4 border border-red-200/30 dark:border-red-800/20 shadow-lg max-w-md animate-slide-in"><div class="flex items-start gap-3"><div class="shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><svg class="w-4 h-4 text-red-600 dark:text-red-400"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="flex-1 min-w-0"><p class="text-sm font-medium text-surface-900 dark:text-surface-50"></p><p class="text-xs text-surface-600 dark:text-surface-400 mt-1">'), a1 = /* @__PURE__ */ M('<div class="flex items-center justify-center h-screen p-6"><div class="glass-card rounded-3xl p-8 max-w-lg border-red-200/30 dark:border-red-800/20"><div class="flex items-start gap-4"><div class="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20"><svg class="w-7 h-7 text-white"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="flex-1 min-w-0"><h3 class="font-semibold text-lg text-surface-900 dark:text-surface-50">Something went wrong</h3><p class="text-surface-600 dark:text-surface-400 mt-2 leading-relaxed font-mono text-xs"></p><button type=button class="mt-4 px-4 py-2 text-sm font-medium rounded-xl glass-button text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">Try again');
const l1 = () => r1(), c1 = (t) => (() => {
  var e = s1(), r = e.firstChild, n = r.firstChild, s = n.firstChild, i = s.nextSibling, o = i.firstChild, a = o.nextSibling;
  return $(a, () => t.error), $(i, A(z, {
    get when() {
      return t.onRetry;
    },
    get children() {
      var l = n1();
      return dt(l, "click", t.onRetry, !0), l;
    }
  }), null), e;
})(), u1 = () => i1(), d1 = (t) => A(z, {
  get when() {
    return t.message;
  },
  get children() {
    var e = o1(), r = e.firstChild, n = r.firstChild, s = n.nextSibling, i = s.firstChild, o = i.nextSibling;
    return $(i, () => t.title ?? "Error"), $(o, () => t.message), e;
  }
}), f1 = (t) => A(um, {
  fallback: (e, r) => (() => {
    var n = a1(), s = n.firstChild, i = s.firstChild, o = i.firstChild, a = o.nextSibling, l = a.firstChild, c = l.nextSibling, d = c.nextSibling;
    return $(c, () => e instanceof Error ? e.message : String(e)), dt(d, "click", r, !0), n;
  })(),
  get children() {
    return t.children;
  }
});
Ee(["click"]);
var h1 = /* @__PURE__ */ M('<aside class="w-80 flex-shrink-0 glass-sidebar border-r border-black/5 dark:border-white/5 h-screen sticky top-0 flex flex-col">'), p1 = /* @__PURE__ */ M('<div class="flex min-h-screen"><main class="flex-1 overflow-y-auto pt-14 md:pt-0">'), m1 = /* @__PURE__ */ M('<div class="flex-1 text-center min-w-0 px-4"><h1 class="font-semibold text-gray-900 dark:text-white truncate text-sm">'), g1 = /* @__PURE__ */ M('<div class="fixed top-0 left-0 right-0 z-40 md:hidden"><div class="flex items-center justify-between px-4 py-3 glass-sidebar border-b border-black/5 dark:border-white/5"><button type=button class="p-2 -ml-2 rounded-xl glass-button text-gray-600 dark:text-gray-300"aria-label="Open navigation menu"><svg class="w-6 h-6"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M4 6h16M4 12h16M4 18h16"></path></svg></button><button type=button class="p-2 -mr-2 rounded-xl glass-button text-gray-500 dark:text-gray-400"aria-label="Open history"><svg class="w-5 h-5"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">');
const y1 = (t) => {
  const [e, r] = Q(!1), [n, s] = Q(!1), i = () => {
    const a = t.store.state.selectedOperation, l = t.store.state.selectedServer, c = t.store.state.serverVariables;
    return a && l ? {
      operation: a,
      server: l,
      serverVariables: c
    } : null;
  };
  tt(() => {
    t.store.state.selectedOperation && r(!1);
  }), Ar(() => {
    const a = window.matchMedia("(max-width: 47.9375rem)"), l = (c) => {
      s(c.matches), c.matches || r(!1);
    };
    l(a), a.addEventListener("change", l), rt(() => a.removeEventListener("change", l));
  });
  const o = () => t.store.state.spec;
  return (() => {
    var a = p1(), l = a.firstChild;
    return $(a, A(b1, {
      get title() {
        return o()?.info.title;
      },
      onMenuOpen: () => r(!0),
      get onHistoryOpen() {
        return t.onOpenHistory;
      }
    }), l), $(a, A(Wh, {
      get open() {
        return e();
      },
      onClose: () => r(!1),
      position: "left",
      size: "lg",
      showClose: !1,
      noPadding: !0,
      get children() {
        return A(Td, {
          get store() {
            return t.store;
          },
          get authStore() {
            return t.authStore;
          },
          onOpenHistory: () => {
            r(!1), t.onOpenHistory();
          },
          onClose: () => r(!1)
        });
      }
    }), l), $(a, A(z, {
      get when() {
        return !n();
      },
      get children() {
        var c = h1();
        return $(c, A(Td, {
          get store() {
            return t.store;
          },
          get authStore() {
            return t.authStore;
          },
          get onOpenHistory() {
            return t.onOpenHistory;
          }
        })), c;
      }
    }), l), $(l, A(z, {
      get when() {
        return i();
      },
      get fallback() {
        return A(u1, {});
      },
      keyed: !0,
      children: (c) => A(Yx, {
        get operation() {
          return c.operation;
        },
        get server() {
          return c.server;
        },
        get serverVariables() {
          return c.serverVariables;
        },
        get authStore() {
          return t.authStore;
        },
        get historyStore() {
          return t.historyStore;
        },
        get initialValues() {
          return t.replayValues;
        },
        get onInitialValuesConsumed() {
          return t.onReplayValuesConsumed;
        }
      })
    })), a;
  })();
}, b1 = (t) => (() => {
  var e = g1(), r = e.firstChild, n = r.firstChild, s = n.nextSibling;
  return dt(n, "click", t.onMenuOpen, !0), $(r, A(z, {
    get when() {
      return t.title;
    },
    get children() {
      var i = m1(), o = i.firstChild;
      return $(o, () => t.title), i;
    }
  }), s), dt(s, "click", t.onHistoryOpen, !0), e;
})();
Ee(["click"]);
const Ml = /* @__PURE__ */ Symbol.for("yaml.alias"), Ga = /* @__PURE__ */ Symbol.for("yaml.document"), or = /* @__PURE__ */ Symbol.for("yaml.map"), ep = /* @__PURE__ */ Symbol.for("yaml.pair"), Bt = /* @__PURE__ */ Symbol.for("yaml.scalar"), pn = /* @__PURE__ */ Symbol.for("yaml.seq"), wt = /* @__PURE__ */ Symbol.for("yaml.node.type"), Lr = (t) => !!t && typeof t == "object" && t[wt] === Ml, yo = (t) => !!t && typeof t == "object" && t[wt] === Ga, cs = (t) => !!t && typeof t == "object" && t[wt] === or, Me = (t) => !!t && typeof t == "object" && t[wt] === ep, _e = (t) => !!t && typeof t == "object" && t[wt] === Bt, us = (t) => !!t && typeof t == "object" && t[wt] === pn;
function Pe(t) {
  if (t && typeof t == "object")
    switch (t[wt]) {
      case or:
      case pn:
        return !0;
    }
  return !1;
}
function Re(t) {
  if (t && typeof t == "object")
    switch (t[wt]) {
      case Ml:
      case or:
      case Bt:
      case pn:
        return !0;
    }
  return !1;
}
const tp = (t) => (_e(t) || Pe(t)) && !!t.anchor, br = /* @__PURE__ */ Symbol("break visit"), v1 = /* @__PURE__ */ Symbol("skip children"), zn = /* @__PURE__ */ Symbol("remove node");
function mn(t, e) {
  const r = w1(e);
  yo(t) ? Wr(null, t.contents, r, Object.freeze([t])) === zn && (t.contents = null) : Wr(null, t, r, Object.freeze([]));
}
mn.BREAK = br;
mn.SKIP = v1;
mn.REMOVE = zn;
function Wr(t, e, r, n) {
  const s = k1(t, e, r, n);
  if (Re(s) || Me(s))
    return x1(t, n, s), Wr(t, s, r, n);
  if (typeof s != "symbol") {
    if (Pe(e)) {
      n = Object.freeze(n.concat(e));
      for (let i = 0; i < e.items.length; ++i) {
        const o = Wr(i, e.items[i], r, n);
        if (typeof o == "number")
          i = o - 1;
        else {
          if (o === br)
            return br;
          o === zn && (e.items.splice(i, 1), i -= 1);
        }
      }
    } else if (Me(e)) {
      n = Object.freeze(n.concat(e));
      const i = Wr("key", e.key, r, n);
      if (i === br)
        return br;
      i === zn && (e.key = null);
      const o = Wr("value", e.value, r, n);
      if (o === br)
        return br;
      o === zn && (e.value = null);
    }
  }
  return s;
}
function w1(t) {
  return typeof t == "object" && (t.Collection || t.Node || t.Value) ? Object.assign({
    Alias: t.Node,
    Map: t.Node,
    Scalar: t.Node,
    Seq: t.Node
  }, t.Value && {
    Map: t.Value,
    Scalar: t.Value,
    Seq: t.Value
  }, t.Collection && {
    Map: t.Collection,
    Seq: t.Collection
  }, t) : t;
}
function k1(t, e, r, n) {
  if (typeof r == "function")
    return r(t, e, n);
  if (cs(e))
    return r.Map?.(t, e, n);
  if (us(e))
    return r.Seq?.(t, e, n);
  if (Me(e))
    return r.Pair?.(t, e, n);
  if (_e(e))
    return r.Scalar?.(t, e, n);
  if (Lr(e))
    return r.Alias?.(t, e, n);
}
function x1(t, e, r) {
  const n = e[e.length - 1];
  if (Pe(n))
    n.items[t] = r;
  else if (Me(n))
    t === "key" ? n.key = r : n.value = r;
  else if (yo(n))
    n.contents = r;
  else {
    const s = Lr(n) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${s} parent`);
  }
}
const S1 = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
}, _1 = (t) => t.replace(/[!,[\]{}]/g, (e) => S1[e]);
class Ze {
  constructor(e, r) {
    this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, Ze.defaultYaml, e), this.tags = Object.assign({}, Ze.defaultTags, r);
  }
  clone() {
    const e = new Ze(this.yaml, this.tags);
    return e.docStart = this.docStart, e;
  }
  /**
   * During parsing, get a Directives instance for the current document and
   * update the stream state according to the current version's spec.
   */
  atDocument() {
    const e = new Ze(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = !0;
        break;
      case "1.2":
        this.atNextDocument = !1, this.yaml = {
          explicit: Ze.defaultYaml.explicit,
          version: "1.2"
        }, this.tags = Object.assign({}, Ze.defaultTags);
        break;
    }
    return e;
  }
  /**
   * @param onError - May be called even if the action was successful
   * @returns `true` on success
   */
  add(e, r) {
    this.atNextDocument && (this.yaml = { explicit: Ze.defaultYaml.explicit, version: "1.1" }, this.tags = Object.assign({}, Ze.defaultTags), this.atNextDocument = !1);
    const n = e.trim().split(/[ \t]+/), s = n.shift();
    switch (s) {
      case "%TAG": {
        if (n.length !== 2 && (r(0, "%TAG directive should contain exactly two parts"), n.length < 2))
          return !1;
        const [i, o] = n;
        return this.tags[i] = o, !0;
      }
      case "%YAML": {
        if (this.yaml.explicit = !0, n.length !== 1)
          return r(0, "%YAML directive should contain exactly one part"), !1;
        const [i] = n;
        if (i === "1.1" || i === "1.2")
          return this.yaml.version = i, !0;
        {
          const o = /^\d+\.\d+$/.test(i);
          return r(6, `Unsupported YAML version ${i}`, o), !1;
        }
      }
      default:
        return r(0, `Unknown directive ${s}`, !0), !1;
    }
  }
  /**
   * Resolves a tag, matching handles to those defined in %TAG directives.
   *
   * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
   *   `'!local'` tag, or `null` if unresolvable.
   */
  tagName(e, r) {
    if (e === "!")
      return "!";
    if (e[0] !== "!")
      return r(`Not a valid tag: ${e}`), null;
    if (e[1] === "<") {
      const o = e.slice(2, -1);
      return o === "!" || o === "!!" ? (r(`Verbatim tags aren't resolved, so ${e} is invalid.`), null) : (e[e.length - 1] !== ">" && r("Verbatim tags must end with a >"), o);
    }
    const [, n, s] = e.match(/^(.*!)([^!]*)$/s);
    s || r(`The ${e} tag has no suffix`);
    const i = this.tags[n];
    if (i)
      try {
        return i + decodeURIComponent(s);
      } catch (o) {
        return r(String(o)), null;
      }
    return n === "!" ? e : (r(`Could not resolve tag: ${e}`), null);
  }
  /**
   * Given a fully resolved tag, returns its printable string form,
   * taking into account current tag prefixes and defaults.
   */
  tagString(e) {
    for (const [r, n] of Object.entries(this.tags))
      if (e.startsWith(n))
        return r + _1(e.substring(n.length));
    return e[0] === "!" ? e : `!<${e}>`;
  }
  toString(e) {
    const r = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], n = Object.entries(this.tags);
    let s;
    if (e && n.length > 0 && Re(e.contents)) {
      const i = {};
      mn(e.contents, (o, a) => {
        Re(a) && a.tag && (i[a.tag] = !0);
      }), s = Object.keys(i);
    } else
      s = [];
    for (const [i, o] of n)
      i === "!!" && o === "tag:yaml.org,2002:" || (!e || s.some((a) => a.startsWith(o))) && r.push(`%TAG ${i} ${o}`);
    return r.join(`
`);
  }
}
Ze.defaultYaml = { explicit: !1, version: "1.2" };
Ze.defaultTags = { "!!": "tag:yaml.org,2002:" };
function rp(t) {
  if (/[\x00-\x19\s,[\]{}]/.test(t)) {
    const e = `Anchor must not contain whitespace or control characters: ${JSON.stringify(t)}`;
    throw new Error(e);
  }
  return !0;
}
function np(t) {
  const e = /* @__PURE__ */ new Set();
  return mn(t, {
    Value(r, n) {
      n.anchor && e.add(n.anchor);
    }
  }), e;
}
function sp(t, e) {
  for (let r = 1; ; ++r) {
    const n = `${t}${r}`;
    if (!e.has(n))
      return n;
  }
}
function E1(t, e) {
  const r = [], n = /* @__PURE__ */ new Map();
  let s = null;
  return {
    onAnchor: (i) => {
      r.push(i), s ?? (s = np(t));
      const o = sp(e, s);
      return s.add(o), o;
    },
    /**
     * With circular references, the source node is only resolved after all
     * of its child nodes are. This is why anchors are set only after all of
     * the nodes have been created.
     */
    setAnchors: () => {
      for (const i of r) {
        const o = n.get(i);
        if (typeof o == "object" && o.anchor && (_e(o.node) || Pe(o.node)))
          o.node.anchor = o.anchor;
        else {
          const a = new Error("Failed to resolve repeated object (this should not happen)");
          throw a.source = i, a;
        }
      }
    },
    sourceObjects: n
  };
}
function Gr(t, e, r, n) {
  if (n && typeof n == "object")
    if (Array.isArray(n))
      for (let s = 0, i = n.length; s < i; ++s) {
        const o = n[s], a = Gr(t, n, String(s), o);
        a === void 0 ? delete n[s] : a !== o && (n[s] = a);
      }
    else if (n instanceof Map)
      for (const s of Array.from(n.keys())) {
        const i = n.get(s), o = Gr(t, n, s, i);
        o === void 0 ? n.delete(s) : o !== i && n.set(s, o);
      }
    else if (n instanceof Set)
      for (const s of Array.from(n)) {
        const i = Gr(t, n, s, s);
        i === void 0 ? n.delete(s) : i !== s && (n.delete(s), n.add(i));
      }
    else
      for (const [s, i] of Object.entries(n)) {
        const o = Gr(t, n, s, i);
        o === void 0 ? delete n[s] : o !== i && (n[s] = o);
      }
  return t.call(e, r, n);
}
function gt(t, e, r) {
  if (Array.isArray(t))
    return t.map((n, s) => gt(n, String(s), r));
  if (t && typeof t.toJSON == "function") {
    if (!r || !tp(t))
      return t.toJSON(e, r);
    const n = { aliasCount: 0, count: 1, res: void 0 };
    r.anchors.set(t, n), r.onCreate = (i) => {
      n.res = i, delete r.onCreate;
    };
    const s = t.toJSON(e, r);
    return r.onCreate && r.onCreate(s), s;
  }
  return typeof t == "bigint" && !r?.keep ? Number(t) : t;
}
class Dl {
  constructor(e) {
    Object.defineProperty(this, wt, { value: e });
  }
  /** Create a copy of this node.  */
  clone() {
    const e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return this.range && (e.range = this.range.slice()), e;
  }
  /** A plain JavaScript representation of this node. */
  toJS(e, { mapAsMap: r, maxAliasCount: n, onAnchor: s, reviver: i } = {}) {
    if (!yo(e))
      throw new TypeError("A document argument is required");
    const o = {
      anchors: /* @__PURE__ */ new Map(),
      doc: e,
      keep: !0,
      mapAsMap: r === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof n == "number" ? n : 100
    }, a = gt(this, "", o);
    if (typeof s == "function")
      for (const { count: l, res: c } of o.anchors.values())
        s(c, l);
    return typeof i == "function" ? Gr(i, { "": a }, "", a) : a;
  }
}
class Bl extends Dl {
  constructor(e) {
    super(Ml), this.source = e, Object.defineProperty(this, "tag", {
      set() {
        throw new Error("Alias nodes cannot have tags");
      }
    });
  }
  /**
   * Resolve the value of this alias within `doc`, finding the last
   * instance of the `source` anchor before this node.
   */
  resolve(e, r) {
    let n;
    r?.aliasResolveCache ? n = r.aliasResolveCache : (n = [], mn(e, {
      Node: (i, o) => {
        (Lr(o) || tp(o)) && n.push(o);
      }
    }), r && (r.aliasResolveCache = n));
    let s;
    for (const i of n) {
      if (i === this)
        break;
      i.anchor === this.source && (s = i);
    }
    return s;
  }
  toJSON(e, r) {
    if (!r)
      return { source: this.source };
    const { anchors: n, doc: s, maxAliasCount: i } = r, o = this.resolve(s, r);
    if (!o) {
      const l = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(l);
    }
    let a = n.get(o);
    if (a || (gt(o, null, r), a = n.get(o)), a?.res === void 0) {
      const l = "This should not happen: Alias anchor was not resolved?";
      throw new ReferenceError(l);
    }
    if (i >= 0 && (a.count += 1, a.aliasCount === 0 && (a.aliasCount = Ei(s, o, n)), a.count * a.aliasCount > i)) {
      const l = "Excessive alias count indicates a resource exhaustion attack";
      throw new ReferenceError(l);
    }
    return a.res;
  }
  toString(e, r, n) {
    const s = `*${this.source}`;
    if (e) {
      if (rp(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source)) {
        const i = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(i);
      }
      if (e.implicitKey)
        return `${s} `;
    }
    return s;
  }
}
function Ei(t, e, r) {
  if (Lr(e)) {
    const n = e.resolve(t), s = r && n && r.get(n);
    return s ? s.count * s.aliasCount : 0;
  } else if (Pe(e)) {
    let n = 0;
    for (const s of e.items) {
      const i = Ei(t, s, r);
      i > n && (n = i);
    }
    return n;
  } else if (Me(e)) {
    const n = Ei(t, e.key, r), s = Ei(t, e.value, r);
    return Math.max(n, s);
  }
  return 1;
}
const ip = (t) => !t || typeof t != "function" && typeof t != "object";
class ae extends Dl {
  constructor(e) {
    super(Bt), this.value = e;
  }
  toJSON(e, r) {
    return r?.keep ? this.value : gt(this.value, e, r);
  }
  toString() {
    return String(this.value);
  }
}
ae.BLOCK_FOLDED = "BLOCK_FOLDED";
ae.BLOCK_LITERAL = "BLOCK_LITERAL";
ae.PLAIN = "PLAIN";
ae.QUOTE_DOUBLE = "QUOTE_DOUBLE";
ae.QUOTE_SINGLE = "QUOTE_SINGLE";
const $1 = "tag:yaml.org,2002:";
function A1(t, e, r) {
  if (e) {
    const n = r.filter((i) => i.tag === e), s = n.find((i) => !i.format) ?? n[0];
    if (!s)
      throw new Error(`Tag ${e} not found`);
    return s;
  }
  return r.find((n) => n.identify?.(t) && !n.format);
}
function Xn(t, e, r) {
  if (yo(t) && (t = t.contents), Re(t))
    return t;
  if (Me(t)) {
    const u = r.schema[or].createNode?.(r.schema, null, r);
    return u.items.push(t), u;
  }
  (t instanceof String || t instanceof Number || t instanceof Boolean || typeof BigInt < "u" && t instanceof BigInt) && (t = t.valueOf());
  const { aliasDuplicateObjects: n, onAnchor: s, onTagObj: i, schema: o, sourceObjects: a } = r;
  let l;
  if (n && t && typeof t == "object") {
    if (l = a.get(t), l)
      return l.anchor ?? (l.anchor = s(t)), new Bl(l.anchor);
    l = { anchor: null, node: null }, a.set(t, l);
  }
  e?.startsWith("!!") && (e = $1 + e.slice(2));
  let c = A1(t, e, o.tags);
  if (!c) {
    if (t && typeof t.toJSON == "function" && (t = t.toJSON()), !t || typeof t != "object") {
      const u = new ae(t);
      return l && (l.node = u), u;
    }
    c = t instanceof Map ? o[or] : Symbol.iterator in Object(t) ? o[pn] : o[or];
  }
  i && (i(c), delete r.onTagObj);
  const d = c?.createNode ? c.createNode(r.schema, t, r) : typeof c?.nodeClass?.from == "function" ? c.nodeClass.from(r.schema, t, r) : new ae(t);
  return e ? d.tag = e : c.default || (d.tag = c.tag), l && (l.node = d), d;
}
function Wi(t, e, r) {
  let n = r;
  for (let s = e.length - 1; s >= 0; --s) {
    const i = e[s];
    if (typeof i == "number" && Number.isInteger(i) && i >= 0) {
      const o = [];
      o[i] = n, n = o;
    } else
      n = /* @__PURE__ */ new Map([[i, n]]);
  }
  return Xn(n, void 0, {
    aliasDuplicateObjects: !1,
    keepUndefined: !1,
    onAnchor: () => {
      throw new Error("This should not happen, please report a bug.");
    },
    schema: t,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
const Mn = (t) => t == null || typeof t == "object" && !!t[Symbol.iterator]().next().done;
class op extends Dl {
  constructor(e, r) {
    super(e), Object.defineProperty(this, "schema", {
      value: r,
      configurable: !0,
      enumerable: !1,
      writable: !0
    });
  }
  /**
   * Create a copy of this collection.
   *
   * @param schema - If defined, overwrites the original's schema
   */
  clone(e) {
    const r = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return e && (r.schema = e), r.items = r.items.map((n) => Re(n) || Me(n) ? n.clone(e) : n), this.range && (r.range = this.range.slice()), r;
  }
  /**
   * Adds a value to the collection. For `!!map` and `!!omap` the value must
   * be a Pair instance or a `{ key, value }` object, which may not have a key
   * that already exists in the map.
   */
  addIn(e, r) {
    if (Mn(e))
      this.add(r);
    else {
      const [n, ...s] = e, i = this.get(n, !0);
      if (Pe(i))
        i.addIn(s, r);
      else if (i === void 0 && this.schema)
        this.set(n, Wi(this.schema, s, r));
      else
        throw new Error(`Expected YAML collection at ${n}. Remaining path: ${s}`);
    }
  }
  /**
   * Removes a value from the collection.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(e) {
    const [r, ...n] = e;
    if (n.length === 0)
      return this.delete(r);
    const s = this.get(r, !0);
    if (Pe(s))
      return s.deleteIn(n);
    throw new Error(`Expected YAML collection at ${r}. Remaining path: ${n}`);
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(e, r) {
    const [n, ...s] = e, i = this.get(n, !0);
    return s.length === 0 ? !r && _e(i) ? i.value : i : Pe(i) ? i.getIn(s, r) : void 0;
  }
  hasAllNullValues(e) {
    return this.items.every((r) => {
      if (!Me(r))
        return !1;
      const n = r.value;
      return n == null || e && _e(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   */
  hasIn(e) {
    const [r, ...n] = e;
    if (n.length === 0)
      return this.has(r);
    const s = this.get(r, !0);
    return Pe(s) ? s.hasIn(n) : !1;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(e, r) {
    const [n, ...s] = e;
    if (s.length === 0)
      this.set(n, r);
    else {
      const i = this.get(n, !0);
      if (Pe(i))
        i.setIn(s, r);
      else if (i === void 0 && this.schema)
        this.set(n, Wi(this.schema, s, r));
      else
        throw new Error(`Expected YAML collection at ${n}. Remaining path: ${s}`);
    }
  }
}
const T1 = (t) => t.replace(/^(?!$)(?: $)?/gm, "#");
function Qt(t, e) {
  return /^\n+$/.test(t) ? t.substring(1) : e ? t.replace(/^(?! *$)/gm, e) : t;
}
const xr = (t, e, r) => t.endsWith(`
`) ? Qt(r, e) : r.includes(`
`) ? `
` + Qt(r, e) : (t.endsWith(" ") ? "" : " ") + r, ap = "flow", Ya = "block", $i = "quoted";
function bo(t, e, r = "flow", { indentAtStart: n, lineWidth: s = 80, minContentWidth: i = 20, onFold: o, onOverflow: a } = {}) {
  if (!s || s < 0)
    return t;
  s < i && (i = 0);
  const l = Math.max(1 + i, 1 + s - e.length);
  if (t.length <= l)
    return t;
  const c = [], d = {};
  let u = s - e.length;
  typeof n == "number" && (n > s - Math.max(2, i) ? c.push(0) : u = s - n);
  let f, p, b = !1, g = -1, m = -1, w = -1;
  r === Ya && (g = Od(t, g, e.length), g !== -1 && (u = g + l));
  for (let y; y = t[g += 1]; ) {
    if (r === $i && y === "\\") {
      switch (m = g, t[g + 1]) {
        case "x":
          g += 3;
          break;
        case "u":
          g += 5;
          break;
        case "U":
          g += 9;
          break;
        default:
          g += 1;
      }
      w = g;
    }
    if (y === `
`)
      r === Ya && (g = Od(t, g, e.length)), u = g + e.length + l, f = void 0;
    else {
      if (y === " " && p && p !== " " && p !== `
` && p !== "	") {
        const k = t[g + 1];
        k && k !== " " && k !== `
` && k !== "	" && (f = g);
      }
      if (g >= u)
        if (f)
          c.push(f), u = f + l, f = void 0;
        else if (r === $i) {
          for (; p === " " || p === "	"; )
            p = y, y = t[g += 1], b = !0;
          const k = g > w + 1 ? g - 2 : m - 1;
          if (d[k])
            return t;
          c.push(k), d[k] = !0, u = k + l, f = void 0;
        } else
          b = !0;
    }
    p = y;
  }
  if (b && a && a(), c.length === 0)
    return t;
  o && o();
  let h = t.slice(0, c[0]);
  for (let y = 0; y < c.length; ++y) {
    const k = c[y], v = c[y + 1] || t.length;
    k === 0 ? h = `
${e}${t.slice(0, v)}` : (r === $i && d[k] && (h += `${t[k]}\\`), h += `
${e}${t.slice(k + 1, v)}`);
  }
  return h;
}
function Od(t, e, r) {
  let n = e, s = e + 1, i = t[s];
  for (; i === " " || i === "	"; )
    if (e < s + r)
      i = t[++e];
    else {
      do
        i = t[++e];
      while (i && i !== `
`);
      n = e, s = e + 1, i = t[s];
    }
  return n;
}
const vo = (t, e) => ({
  indentAtStart: e ? t.indent.length : t.indentAtStart,
  lineWidth: t.options.lineWidth,
  minContentWidth: t.options.minContentWidth
}), wo = (t) => /^(%|---|\.\.\.)/m.test(t);
function O1(t, e, r) {
  if (!e || e < 0)
    return !1;
  const n = e - r, s = t.length;
  if (s <= n)
    return !1;
  for (let i = 0, o = 0; i < s; ++i)
    if (t[i] === `
`) {
      if (i - o > n)
        return !0;
      if (o = i + 1, s - o <= n)
        return !1;
    }
  return !0;
}
function Vn(t, e) {
  const r = JSON.stringify(t);
  if (e.options.doubleQuotedAsJSON)
    return r;
  const { implicitKey: n } = e, s = e.options.doubleQuotedMinMultiLineLength, i = e.indent || (wo(t) ? "  " : "");
  let o = "", a = 0;
  for (let l = 0, c = r[l]; c; c = r[++l])
    if (c === " " && r[l + 1] === "\\" && r[l + 2] === "n" && (o += r.slice(a, l) + "\\ ", l += 1, a = l, c = "\\"), c === "\\")
      switch (r[l + 1]) {
        case "u":
          {
            o += r.slice(a, l);
            const d = r.substr(l + 2, 4);
            switch (d) {
              case "0000":
                o += "\\0";
                break;
              case "0007":
                o += "\\a";
                break;
              case "000b":
                o += "\\v";
                break;
              case "001b":
                o += "\\e";
                break;
              case "0085":
                o += "\\N";
                break;
              case "00a0":
                o += "\\_";
                break;
              case "2028":
                o += "\\L";
                break;
              case "2029":
                o += "\\P";
                break;
              default:
                d.substr(0, 2) === "00" ? o += "\\x" + d.substr(2) : o += r.substr(l, 6);
            }
            l += 5, a = l + 1;
          }
          break;
        case "n":
          if (n || r[l + 2] === '"' || r.length < s)
            l += 1;
          else {
            for (o += r.slice(a, l) + `

`; r[l + 2] === "\\" && r[l + 3] === "n" && r[l + 4] !== '"'; )
              o += `
`, l += 2;
            o += i, r[l + 2] === " " && (o += "\\"), l += 1, a = l + 1;
          }
          break;
        default:
          l += 1;
      }
  return o = a ? o + r.slice(a) : r, n ? o : bo(o, i, $i, vo(e, !1));
}
function Qa(t, e) {
  if (e.options.singleQuote === !1 || e.implicitKey && t.includes(`
`) || /[ \t]\n|\n[ \t]/.test(t))
    return Vn(t, e);
  const r = e.indent || (wo(t) ? "  " : ""), n = "'" + t.replace(/'/g, "''").replace(/\n+/g, `$&
${r}`) + "'";
  return e.implicitKey ? n : bo(n, r, ap, vo(e, !1));
}
function Yr(t, e) {
  const { singleQuote: r } = e.options;
  let n;
  if (r === !1)
    n = Vn;
  else {
    const s = t.includes('"'), i = t.includes("'");
    s && !i ? n = Qa : i && !s ? n = Vn : n = r ? Qa : Vn;
  }
  return n(t, e);
}
let Xa;
try {
  Xa = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g");
} catch {
  Xa = /\n+(?!\n|$)/g;
}
function Ai({ comment: t, type: e, value: r }, n, s, i) {
  const { blockQuote: o, commentString: a, lineWidth: l } = n.options;
  if (!o || /\n[\t ]+$/.test(r))
    return Yr(r, n);
  const c = n.indent || (n.forceBlockIndent || wo(r) ? "  " : ""), d = o === "literal" ? !0 : o === "folded" || e === ae.BLOCK_FOLDED ? !1 : e === ae.BLOCK_LITERAL ? !0 : !O1(r, l, c.length);
  if (!r)
    return d ? `|
` : `>
`;
  let u, f;
  for (f = r.length; f > 0; --f) {
    const k = r[f - 1];
    if (k !== `
` && k !== "	" && k !== " ")
      break;
  }
  let p = r.substring(f);
  const b = p.indexOf(`
`);
  b === -1 ? u = "-" : r === p || b !== p.length - 1 ? (u = "+", i && i()) : u = "", p && (r = r.slice(0, -p.length), p[p.length - 1] === `
` && (p = p.slice(0, -1)), p = p.replace(Xa, `$&${c}`));
  let g = !1, m, w = -1;
  for (m = 0; m < r.length; ++m) {
    const k = r[m];
    if (k === " ")
      g = !0;
    else if (k === `
`)
      w = m;
    else
      break;
  }
  let h = r.substring(0, w < m ? w + 1 : m);
  h && (r = r.substring(h.length), h = h.replace(/\n+/g, `$&${c}`));
  let y = (g ? c ? "2" : "1" : "") + u;
  if (t && (y += " " + a(t.replace(/ ?[\r\n]+/g, " ")), s && s()), !d) {
    const k = r.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${c}`);
    let v = !1;
    const x = vo(n, !0);
    o !== "folded" && e !== ae.BLOCK_FOLDED && (x.onOverflow = () => {
      v = !0;
    });
    const S = bo(`${h}${k}${p}`, c, Ya, x);
    if (!v)
      return `>${y}
${c}${S}`;
  }
  return r = r.replace(/\n+/g, `$&${c}`), `|${y}
${c}${h}${r}${p}`;
}
function C1(t, e, r, n) {
  const { type: s, value: i } = t, { actualString: o, implicitKey: a, indent: l, indentStep: c, inFlow: d } = e;
  if (a && i.includes(`
`) || d && /[[\]{},]/.test(i))
    return Yr(i, e);
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(i))
    return a || d || !i.includes(`
`) ? Yr(i, e) : Ai(t, e, r, n);
  if (!a && !d && s !== ae.PLAIN && i.includes(`
`))
    return Ai(t, e, r, n);
  if (wo(i)) {
    if (l === "")
      return e.forceBlockIndent = !0, Ai(t, e, r, n);
    if (a && l === c)
      return Yr(i, e);
  }
  const u = i.replace(/\n+/g, `$&
${l}`);
  if (o) {
    const f = (g) => g.default && g.tag !== "tag:yaml.org,2002:str" && g.test?.test(u), { compat: p, tags: b } = e.doc.schema;
    if (b.some(f) || p?.some(f))
      return Yr(i, e);
  }
  return a ? u : bo(u, l, ap, vo(e, !1));
}
function ql(t, e, r, n) {
  const { implicitKey: s, inFlow: i } = e, o = typeof t.value == "string" ? t : Object.assign({}, t, { value: String(t.value) });
  let { type: a } = t;
  a !== ae.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) && (a = ae.QUOTE_DOUBLE);
  const l = (d) => {
    switch (d) {
      case ae.BLOCK_FOLDED:
      case ae.BLOCK_LITERAL:
        return s || i ? Yr(o.value, e) : Ai(o, e, r, n);
      case ae.QUOTE_DOUBLE:
        return Vn(o.value, e);
      case ae.QUOTE_SINGLE:
        return Qa(o.value, e);
      case ae.PLAIN:
        return C1(o, e, r, n);
      default:
        return null;
    }
  };
  let c = l(a);
  if (c === null) {
    const { defaultKeyType: d, defaultStringType: u } = e.options, f = s && d || u;
    if (c = l(f), c === null)
      throw new Error(`Unsupported default string type ${f}`);
  }
  return c;
}
function lp(t, e) {
  const r = Object.assign({
    blockQuote: !0,
    commentString: T1,
    defaultKeyType: null,
    defaultStringType: "PLAIN",
    directives: null,
    doubleQuotedAsJSON: !1,
    doubleQuotedMinMultiLineLength: 40,
    falseStr: "false",
    flowCollectionPadding: !0,
    indentSeq: !0,
    lineWidth: 80,
    minContentWidth: 20,
    nullStr: "null",
    simpleKeys: !1,
    singleQuote: null,
    trueStr: "true",
    verifyAliasOrder: !0
  }, t.schema.toStringOptions, e);
  let n;
  switch (r.collectionStyle) {
    case "block":
      n = !1;
      break;
    case "flow":
      n = !0;
      break;
    default:
      n = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc: t,
    flowCollectionPadding: r.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof r.indent == "number" ? " ".repeat(r.indent) : "  ",
    inFlow: n,
    options: r
  };
}
function N1(t, e) {
  if (e.tag) {
    const s = t.filter((i) => i.tag === e.tag);
    if (s.length > 0)
      return s.find((i) => i.format === e.format) ?? s[0];
  }
  let r, n;
  if (_e(e)) {
    n = e.value;
    let s = t.filter((i) => i.identify?.(n));
    if (s.length > 1) {
      const i = s.filter((o) => o.test);
      i.length > 0 && (s = i);
    }
    r = s.find((i) => i.format === e.format) ?? s.find((i) => !i.format);
  } else
    n = e, r = t.find((s) => s.nodeClass && n instanceof s.nodeClass);
  if (!r) {
    const s = n?.constructor?.name ?? (n === null ? "null" : typeof n);
    throw new Error(`Tag not resolved for ${s} value`);
  }
  return r;
}
function I1(t, e, { anchors: r, doc: n }) {
  if (!n.directives)
    return "";
  const s = [], i = (_e(t) || Pe(t)) && t.anchor;
  i && rp(i) && (r.add(i), s.push(`&${i}`));
  const o = t.tag ?? (e.default ? null : e.tag);
  return o && s.push(n.directives.tagString(o)), s.join(" ");
}
function an(t, e, r, n) {
  if (Me(t))
    return t.toString(e, r, n);
  if (Lr(t)) {
    if (e.doc.directives)
      return t.toString(e);
    if (e.resolvedAliases?.has(t))
      throw new TypeError("Cannot stringify circular structure without alias nodes");
    e.resolvedAliases ? e.resolvedAliases.add(t) : e.resolvedAliases = /* @__PURE__ */ new Set([t]), t = t.resolve(e.doc);
  }
  let s;
  const i = Re(t) ? t : e.doc.createNode(t, { onTagObj: (l) => s = l });
  s ?? (s = N1(e.doc.schema.tags, i));
  const o = I1(i, s, e);
  o.length > 0 && (e.indentAtStart = (e.indentAtStart ?? 0) + o.length + 1);
  const a = typeof s.stringify == "function" ? s.stringify(i, e, r, n) : _e(i) ? ql(i, e, r, n) : i.toString(e, r, n);
  return o ? _e(i) || a[0] === "{" || a[0] === "[" ? `${o} ${a}` : `${o}
${e.indent}${a}` : a;
}
function P1({ key: t, value: e }, r, n, s) {
  const { allNullValues: i, doc: o, indent: a, indentStep: l, options: { commentString: c, indentSeq: d, simpleKeys: u } } = r;
  let f = Re(t) && t.comment || null;
  if (u) {
    if (f)
      throw new Error("With simple keys, key nodes cannot have comments");
    if (Pe(t) || !Re(t) && typeof t == "object") {
      const S = "With simple keys, collection cannot be used as a key value";
      throw new Error(S);
    }
  }
  let p = !u && (!t || f && e == null && !r.inFlow || Pe(t) || (_e(t) ? t.type === ae.BLOCK_FOLDED || t.type === ae.BLOCK_LITERAL : typeof t == "object"));
  r = Object.assign({}, r, {
    allNullValues: !1,
    implicitKey: !p && (u || !i),
    indent: a + l
  });
  let b = !1, g = !1, m = an(t, r, () => b = !0, () => g = !0);
  if (!p && !r.inFlow && m.length > 1024) {
    if (u)
      throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    p = !0;
  }
  if (r.inFlow) {
    if (i || e == null)
      return b && n && n(), m === "" ? "?" : p ? `? ${m}` : m;
  } else if (i && !u || e == null && p)
    return m = `? ${m}`, f && !b ? m += xr(m, r.indent, c(f)) : g && s && s(), m;
  b && (f = null), p ? (f && (m += xr(m, r.indent, c(f))), m = `? ${m}
${a}:`) : (m = `${m}:`, f && (m += xr(m, r.indent, c(f))));
  let w, h, y;
  Re(e) ? (w = !!e.spaceBefore, h = e.commentBefore, y = e.comment) : (w = !1, h = null, y = null, e && typeof e == "object" && (e = o.createNode(e))), r.implicitKey = !1, !p && !f && _e(e) && (r.indentAtStart = m.length + 1), g = !1, !d && l.length >= 2 && !r.inFlow && !p && us(e) && !e.flow && !e.tag && !e.anchor && (r.indent = r.indent.substring(2));
  let k = !1;
  const v = an(e, r, () => k = !0, () => g = !0);
  let x = " ";
  if (f || w || h) {
    if (x = w ? `
` : "", h) {
      const S = c(h);
      x += `
${Qt(S, r.indent)}`;
    }
    v === "" && !r.inFlow ? x === `
` && y && (x = `

`) : x += `
${r.indent}`;
  } else if (!p && Pe(e)) {
    const S = v[0], _ = v.indexOf(`
`), T = _ !== -1, P = r.inFlow ?? e.flow ?? e.items.length === 0;
    if (T || !P) {
      let R = !1;
      if (T && (S === "&" || S === "!")) {
        let D = v.indexOf(" ");
        S === "&" && D !== -1 && D < _ && v[D + 1] === "!" && (D = v.indexOf(" ", D + 1)), (D === -1 || _ < D) && (R = !0);
      }
      R || (x = `
${r.indent}`);
    }
  } else (v === "" || v[0] === `
`) && (x = "");
  return m += x + v, r.inFlow ? k && n && n() : y && !k ? m += xr(m, r.indent, c(y)) : g && s && s(), m;
}
function cp(t, e) {
  (t === "debug" || t === "warn") && console.warn(e);
}
const pi = "<<", Zt = {
  identify: (t) => t === pi || typeof t == "symbol" && t.description === pi,
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: () => Object.assign(new ae(Symbol(pi)), {
    addToJSMap: up
  }),
  stringify: () => pi
}, L1 = (t, e) => (Zt.identify(e) || _e(e) && (!e.type || e.type === ae.PLAIN) && Zt.identify(e.value)) && t?.doc.schema.tags.some((r) => r.tag === Zt.tag && r.default);
function up(t, e, r) {
  if (r = t && Lr(r) ? r.resolve(t.doc) : r, us(r))
    for (const n of r.items)
      ua(t, e, n);
  else if (Array.isArray(r))
    for (const n of r)
      ua(t, e, n);
  else
    ua(t, e, r);
}
function ua(t, e, r) {
  const n = t && Lr(r) ? r.resolve(t.doc) : r;
  if (!cs(n))
    throw new Error("Merge sources must be maps or map aliases");
  const s = n.toJSON(null, t, Map);
  for (const [i, o] of s)
    e instanceof Map ? e.has(i) || e.set(i, o) : e instanceof Set ? e.add(i) : Object.prototype.hasOwnProperty.call(e, i) || Object.defineProperty(e, i, {
      value: o,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  return e;
}
function dp(t, e, { key: r, value: n }) {
  if (Re(r) && r.addToJSMap)
    r.addToJSMap(t, e, n);
  else if (L1(t, r))
    up(t, e, n);
  else {
    const s = gt(r, "", t);
    if (e instanceof Map)
      e.set(s, gt(n, s, t));
    else if (e instanceof Set)
      e.add(s);
    else {
      const i = R1(r, s, t), o = gt(n, i, t);
      i in e ? Object.defineProperty(e, i, {
        value: o,
        writable: !0,
        enumerable: !0,
        configurable: !0
      }) : e[i] = o;
    }
  }
  return e;
}
function R1(t, e, r) {
  if (e === null)
    return "";
  if (typeof e != "object")
    return String(e);
  if (Re(t) && r?.doc) {
    const n = lp(r.doc, {});
    n.anchors = /* @__PURE__ */ new Set();
    for (const i of r.anchors.keys())
      n.anchors.add(i.anchor);
    n.inFlow = !0, n.inStringifyKey = !0;
    const s = t.toString(n);
    if (!r.mapKeyWarned) {
      let i = JSON.stringify(s);
      i.length > 40 && (i = i.substring(0, 36) + '..."'), cp(r.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${i}. Set mapAsMap: true to use object keys.`), r.mapKeyWarned = !0;
    }
    return s;
  }
  return JSON.stringify(e);
}
function Fl(t, e, r) {
  const n = Xn(t, void 0, r), s = Xn(e, void 0, r);
  return new st(n, s);
}
class st {
  constructor(e, r = null) {
    Object.defineProperty(this, wt, { value: ep }), this.key = e, this.value = r;
  }
  clone(e) {
    let { key: r, value: n } = this;
    return Re(r) && (r = r.clone(e)), Re(n) && (n = n.clone(e)), new st(r, n);
  }
  toJSON(e, r) {
    const n = r?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    return dp(r, n, this);
  }
  toString(e, r, n) {
    return e?.doc ? P1(this, e, r, n) : JSON.stringify(this);
  }
}
function fp(t, e, r) {
  return (e.inFlow ?? t.flow ? M1 : j1)(t, e, r);
}
function j1({ comment: t, items: e }, r, { blockItemPrefix: n, flowChars: s, itemIndent: i, onChompKeep: o, onComment: a }) {
  const { indent: l, options: { commentString: c } } = r, d = Object.assign({}, r, { indent: i, type: null });
  let u = !1;
  const f = [];
  for (let b = 0; b < e.length; ++b) {
    const g = e[b];
    let m = null;
    if (Re(g))
      !u && g.spaceBefore && f.push(""), Gi(r, f, g.commentBefore, u), g.comment && (m = g.comment);
    else if (Me(g)) {
      const h = Re(g.key) ? g.key : null;
      h && (!u && h.spaceBefore && f.push(""), Gi(r, f, h.commentBefore, u));
    }
    u = !1;
    let w = an(g, d, () => m = null, () => u = !0);
    m && (w += xr(w, i, c(m))), u && m && (u = !1), f.push(n + w);
  }
  let p;
  if (f.length === 0)
    p = s.start + s.end;
  else {
    p = f[0];
    for (let b = 1; b < f.length; ++b) {
      const g = f[b];
      p += g ? `
${l}${g}` : `
`;
    }
  }
  return t ? (p += `
` + Qt(c(t), l), a && a()) : u && o && o(), p;
}
function M1({ items: t }, e, { flowChars: r, itemIndent: n }) {
  const { indent: s, indentStep: i, flowCollectionPadding: o, options: { commentString: a } } = e;
  n += i;
  const l = Object.assign({}, e, {
    indent: n,
    inFlow: !0,
    type: null
  });
  let c = !1, d = 0;
  const u = [];
  for (let b = 0; b < t.length; ++b) {
    const g = t[b];
    let m = null;
    if (Re(g))
      g.spaceBefore && u.push(""), Gi(e, u, g.commentBefore, !1), g.comment && (m = g.comment);
    else if (Me(g)) {
      const h = Re(g.key) ? g.key : null;
      h && (h.spaceBefore && u.push(""), Gi(e, u, h.commentBefore, !1), h.comment && (c = !0));
      const y = Re(g.value) ? g.value : null;
      y ? (y.comment && (m = y.comment), y.commentBefore && (c = !0)) : g.value == null && h?.comment && (m = h.comment);
    }
    m && (c = !0);
    let w = an(g, l, () => m = null);
    b < t.length - 1 && (w += ","), m && (w += xr(w, n, a(m))), !c && (u.length > d || w.includes(`
`)) && (c = !0), u.push(w), d = u.length;
  }
  const { start: f, end: p } = r;
  if (u.length === 0)
    return f + p;
  if (!c) {
    const b = u.reduce((g, m) => g + m.length + 2, 2);
    c = e.options.lineWidth > 0 && b > e.options.lineWidth;
  }
  if (c) {
    let b = f;
    for (const g of u)
      b += g ? `
${i}${s}${g}` : `
`;
    return `${b}
${s}${p}`;
  } else
    return `${f}${o}${u.join(" ")}${o}${p}`;
}
function Gi({ indent: t, options: { commentString: e } }, r, n, s) {
  if (n && s && (n = n.replace(/^\n+/, "")), n) {
    const i = Qt(e(n), t);
    r.push(i.trimStart());
  }
}
function Sr(t, e) {
  const r = _e(e) ? e.value : e;
  for (const n of t)
    if (Me(n) && (n.key === e || n.key === r || _e(n.key) && n.key.value === r))
      return n;
}
class pt extends op {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(e) {
    super(or, e), this.items = [];
  }
  /**
   * A generic collection parsing method that can be extended
   * to other node classes that inherit from YAMLMap
   */
  static from(e, r, n) {
    const { keepUndefined: s, replacer: i } = n, o = new this(e), a = (l, c) => {
      if (typeof i == "function")
        c = i.call(r, l, c);
      else if (Array.isArray(i) && !i.includes(l))
        return;
      (c !== void 0 || s) && o.items.push(Fl(l, c, n));
    };
    if (r instanceof Map)
      for (const [l, c] of r)
        a(l, c);
    else if (r && typeof r == "object")
      for (const l of Object.keys(r))
        a(l, r[l]);
    return typeof e.sortMapEntries == "function" && o.items.sort(e.sortMapEntries), o;
  }
  /**
   * Adds a value to the collection.
   *
   * @param overwrite - If not set `true`, using a key that is already in the
   *   collection will throw. Otherwise, overwrites the previous value.
   */
  add(e, r) {
    let n;
    Me(e) ? n = e : !e || typeof e != "object" || !("key" in e) ? n = new st(e, e?.value) : n = new st(e.key, e.value);
    const s = Sr(this.items, n.key), i = this.schema?.sortMapEntries;
    if (s) {
      if (!r)
        throw new Error(`Key ${n.key} already set`);
      _e(s.value) && ip(n.value) ? s.value.value = n.value : s.value = n.value;
    } else if (i) {
      const o = this.items.findIndex((a) => i(n, a) < 0);
      o === -1 ? this.items.push(n) : this.items.splice(o, 0, n);
    } else
      this.items.push(n);
  }
  delete(e) {
    const r = Sr(this.items, e);
    return r ? this.items.splice(this.items.indexOf(r), 1).length > 0 : !1;
  }
  get(e, r) {
    const n = Sr(this.items, e)?.value;
    return (!r && _e(n) ? n.value : n) ?? void 0;
  }
  has(e) {
    return !!Sr(this.items, e);
  }
  set(e, r) {
    this.add(new st(e, r), !0);
  }
  /**
   * @param ctx - Conversion context, originally set in Document#toJS()
   * @param {Class} Type - If set, forces the returned collection type
   * @returns Instance of Type, Map, or Object
   */
  toJSON(e, r, n) {
    const s = n ? new n() : r?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    r?.onCreate && r.onCreate(s);
    for (const i of this.items)
      dp(r, s, i);
    return s;
  }
  toString(e, r, n) {
    if (!e)
      return JSON.stringify(this);
    for (const s of this.items)
      if (!Me(s))
        throw new Error(`Map items must all be pairs; found ${JSON.stringify(s)} instead`);
    return !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })), fp(this, e, {
      blockItemPrefix: "",
      flowChars: { start: "{", end: "}" },
      itemIndent: e.indent || "",
      onChompKeep: n,
      onComment: r
    });
  }
}
const gn = {
  collection: "map",
  default: !0,
  nodeClass: pt,
  tag: "tag:yaml.org,2002:map",
  resolve(t, e) {
    return cs(t) || e("Expected a mapping for this tag"), t;
  },
  createNode: (t, e, r) => pt.from(t, e, r)
};
class Cr extends op {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(e) {
    super(pn, e), this.items = [];
  }
  add(e) {
    this.items.push(e);
  }
  /**
   * Removes a value from the collection.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   *
   * @returns `true` if the item was found and removed.
   */
  delete(e) {
    const r = mi(e);
    return typeof r != "number" ? !1 : this.items.splice(r, 1).length > 0;
  }
  get(e, r) {
    const n = mi(e);
    if (typeof n != "number")
      return;
    const s = this.items[n];
    return !r && _e(s) ? s.value : s;
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   */
  has(e) {
    const r = mi(e);
    return typeof r == "number" && r < this.items.length;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   *
   * If `key` does not contain a representation of an integer, this will throw.
   * It may be wrapped in a `Scalar`.
   */
  set(e, r) {
    const n = mi(e);
    if (typeof n != "number")
      throw new Error(`Expected a valid index, not ${e}.`);
    const s = this.items[n];
    _e(s) && ip(r) ? s.value = r : this.items[n] = r;
  }
  toJSON(e, r) {
    const n = [];
    r?.onCreate && r.onCreate(n);
    let s = 0;
    for (const i of this.items)
      n.push(gt(i, String(s++), r));
    return n;
  }
  toString(e, r, n) {
    return e ? fp(this, e, {
      blockItemPrefix: "- ",
      flowChars: { start: "[", end: "]" },
      itemIndent: (e.indent || "") + "  ",
      onChompKeep: n,
      onComment: r
    }) : JSON.stringify(this);
  }
  static from(e, r, n) {
    const { replacer: s } = n, i = new this(e);
    if (r && Symbol.iterator in Object(r)) {
      let o = 0;
      for (let a of r) {
        if (typeof s == "function") {
          const l = r instanceof Set ? a : String(o++);
          a = s.call(r, l, a);
        }
        i.items.push(Xn(a, void 0, n));
      }
    }
    return i;
  }
}
function mi(t) {
  let e = _e(t) ? t.value : t;
  return e && typeof e == "string" && (e = Number(e)), typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : null;
}
const yn = {
  collection: "seq",
  default: !0,
  nodeClass: Cr,
  tag: "tag:yaml.org,2002:seq",
  resolve(t, e) {
    return us(t) || e("Expected a sequence for this tag"), t;
  },
  createNode: (t, e, r) => Cr.from(t, e, r)
}, ko = {
  identify: (t) => typeof t == "string",
  default: !0,
  tag: "tag:yaml.org,2002:str",
  resolve: (t) => t,
  stringify(t, e, r, n) {
    return e = Object.assign({ actualString: !0 }, e), ql(t, e, r, n);
  }
}, xo = {
  identify: (t) => t == null,
  createNode: () => new ae(null),
  default: !0,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => new ae(null),
  stringify: ({ source: t }, e) => typeof t == "string" && xo.test.test(t) ? t : e.options.nullStr
}, Ul = {
  identify: (t) => typeof t == "boolean",
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: (t) => new ae(t[0] === "t" || t[0] === "T"),
  stringify({ source: t, value: e }, r) {
    if (t && Ul.test.test(t)) {
      const n = t[0] === "t" || t[0] === "T";
      if (e === n)
        return t;
    }
    return e ? r.options.trueStr : r.options.falseStr;
  }
};
function Pt({ format: t, minFractionDigits: e, tag: r, value: n }) {
  if (typeof n == "bigint")
    return String(n);
  const s = typeof n == "number" ? n : Number(n);
  if (!isFinite(s))
    return isNaN(s) ? ".nan" : s < 0 ? "-.inf" : ".inf";
  let i = Object.is(n, -0) ? "-0" : JSON.stringify(n);
  if (!t && e && (!r || r === "tag:yaml.org,2002:float") && /^\d/.test(i)) {
    let o = i.indexOf(".");
    o < 0 && (o = i.length, i += ".");
    let a = e - (i.length - o - 1);
    for (; a-- > 0; )
      i += "0";
  }
  return i;
}
const hp = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (t) => t.slice(-3).toLowerCase() === "nan" ? NaN : t[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: Pt
}, pp = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: (t) => parseFloat(t),
  stringify(t) {
    const e = Number(t.value);
    return isFinite(e) ? e.toExponential() : Pt(t);
  }
}, mp = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(t) {
    const e = new ae(parseFloat(t)), r = t.indexOf(".");
    return r !== -1 && t[t.length - 1] === "0" && (e.minFractionDigits = t.length - r - 1), e;
  },
  stringify: Pt
}, So = (t) => typeof t == "bigint" || Number.isInteger(t), Kl = (t, e, r, { intAsBigInt: n }) => n ? BigInt(t) : parseInt(t.substring(e), r);
function gp(t, e, r) {
  const { value: n } = t;
  return So(n) && n >= 0 ? r + n.toString(e) : Pt(t);
}
const yp = {
  identify: (t) => So(t) && t >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: (t, e, r) => Kl(t, 2, 8, r),
  stringify: (t) => gp(t, 8, "0o")
}, bp = {
  identify: So,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: (t, e, r) => Kl(t, 0, 10, r),
  stringify: Pt
}, vp = {
  identify: (t) => So(t) && t >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: (t, e, r) => Kl(t, 2, 16, r),
  stringify: (t) => gp(t, 16, "0x")
}, D1 = [
  gn,
  yn,
  ko,
  xo,
  Ul,
  yp,
  bp,
  vp,
  hp,
  pp,
  mp
];
function Cd(t) {
  return typeof t == "bigint" || Number.isInteger(t);
}
const gi = ({ value: t }) => JSON.stringify(t), B1 = [
  {
    identify: (t) => typeof t == "string",
    default: !0,
    tag: "tag:yaml.org,2002:str",
    resolve: (t) => t,
    stringify: gi
  },
  {
    identify: (t) => t == null,
    createNode: () => new ae(null),
    default: !0,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: gi
  },
  {
    identify: (t) => typeof t == "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: (t) => t === "true",
    stringify: gi
  },
  {
    identify: Cd,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (t, e, { intAsBigInt: r }) => r ? BigInt(t) : parseInt(t, 10),
    stringify: ({ value: t }) => Cd(t) ? t.toString() : JSON.stringify(t)
  },
  {
    identify: (t) => typeof t == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (t) => parseFloat(t),
    stringify: gi
  }
], q1 = {
  default: !0,
  tag: "",
  test: /^/,
  resolve(t, e) {
    return e(`Unresolved plain scalar ${JSON.stringify(t)}`), t;
  }
}, F1 = [gn, yn].concat(B1, q1), zl = {
  identify: (t) => t instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: !1,
  tag: "tag:yaml.org,2002:binary",
  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve(t, e) {
    if (typeof atob == "function") {
      const r = atob(t.replace(/[\n\r]/g, "")), n = new Uint8Array(r.length);
      for (let s = 0; s < r.length; ++s)
        n[s] = r.charCodeAt(s);
      return n;
    } else
      return e("This environment does not support reading binary tags; either Buffer or atob is required"), t;
  },
  stringify({ comment: t, type: e, value: r }, n, s, i) {
    if (!r)
      return "";
    const o = r;
    let a;
    if (typeof btoa == "function") {
      let l = "";
      for (let c = 0; c < o.length; ++c)
        l += String.fromCharCode(o[c]);
      a = btoa(l);
    } else
      throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    if (e ?? (e = ae.BLOCK_LITERAL), e !== ae.QUOTE_DOUBLE) {
      const l = Math.max(n.options.lineWidth - n.indent.length, n.options.minContentWidth), c = Math.ceil(a.length / l), d = new Array(c);
      for (let u = 0, f = 0; u < c; ++u, f += l)
        d[u] = a.substr(f, l);
      a = d.join(e === ae.BLOCK_LITERAL ? `
` : " ");
    }
    return ql({ comment: t, type: e, value: a }, n, s, i);
  }
};
function wp(t, e) {
  if (us(t))
    for (let r = 0; r < t.items.length; ++r) {
      let n = t.items[r];
      if (!Me(n)) {
        if (cs(n)) {
          n.items.length > 1 && e("Each pair must have its own sequence indicator");
          const s = n.items[0] || new st(new ae(null));
          if (n.commentBefore && (s.key.commentBefore = s.key.commentBefore ? `${n.commentBefore}
${s.key.commentBefore}` : n.commentBefore), n.comment) {
            const i = s.value ?? s.key;
            i.comment = i.comment ? `${n.comment}
${i.comment}` : n.comment;
          }
          n = s;
        }
        t.items[r] = Me(n) ? n : new st(n);
      }
    }
  else
    e("Expected a sequence for this tag");
  return t;
}
function kp(t, e, r) {
  const { replacer: n } = r, s = new Cr(t);
  s.tag = "tag:yaml.org,2002:pairs";
  let i = 0;
  if (e && Symbol.iterator in Object(e))
    for (let o of e) {
      typeof n == "function" && (o = n.call(e, String(i++), o));
      let a, l;
      if (Array.isArray(o))
        if (o.length === 2)
          a = o[0], l = o[1];
        else
          throw new TypeError(`Expected [key, value] tuple: ${o}`);
      else if (o && o instanceof Object) {
        const c = Object.keys(o);
        if (c.length === 1)
          a = c[0], l = o[a];
        else
          throw new TypeError(`Expected tuple with one key, not ${c.length} keys`);
      } else
        a = o;
      s.items.push(Fl(a, l, r));
    }
  return s;
}
const Vl = {
  collection: "seq",
  default: !1,
  tag: "tag:yaml.org,2002:pairs",
  resolve: wp,
  createNode: kp
};
class en extends Cr {
  constructor() {
    super(), this.add = pt.prototype.add.bind(this), this.delete = pt.prototype.delete.bind(this), this.get = pt.prototype.get.bind(this), this.has = pt.prototype.has.bind(this), this.set = pt.prototype.set.bind(this), this.tag = en.tag;
  }
  /**
   * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
   * but TypeScript won't allow widening the signature of a child method.
   */
  toJSON(e, r) {
    if (!r)
      return super.toJSON(e);
    const n = /* @__PURE__ */ new Map();
    r?.onCreate && r.onCreate(n);
    for (const s of this.items) {
      let i, o;
      if (Me(s) ? (i = gt(s.key, "", r), o = gt(s.value, i, r)) : i = gt(s, "", r), n.has(i))
        throw new Error("Ordered maps must not include duplicate keys");
      n.set(i, o);
    }
    return n;
  }
  static from(e, r, n) {
    const s = kp(e, r, n), i = new this();
    return i.items = s.items, i;
  }
}
en.tag = "tag:yaml.org,2002:omap";
const Hl = {
  collection: "seq",
  identify: (t) => t instanceof Map,
  nodeClass: en,
  default: !1,
  tag: "tag:yaml.org,2002:omap",
  resolve(t, e) {
    const r = wp(t, e), n = [];
    for (const { key: s } of r.items)
      _e(s) && (n.includes(s.value) ? e(`Ordered maps must not include duplicate keys: ${s.value}`) : n.push(s.value));
    return Object.assign(new en(), r);
  },
  createNode: (t, e, r) => en.from(t, e, r)
};
function xp({ value: t, source: e }, r) {
  return e && (t ? Sp : _p).test.test(e) ? e : t ? r.options.trueStr : r.options.falseStr;
}
const Sp = {
  identify: (t) => t === !0,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => new ae(!0),
  stringify: xp
}, _p = {
  identify: (t) => t === !1,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: () => new ae(!1),
  stringify: xp
}, U1 = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (t) => t.slice(-3).toLowerCase() === "nan" ? NaN : t[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: Pt
}, K1 = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: (t) => parseFloat(t.replace(/_/g, "")),
  stringify(t) {
    const e = Number(t.value);
    return isFinite(e) ? e.toExponential() : Pt(t);
  }
}, z1 = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(t) {
    const e = new ae(parseFloat(t.replace(/_/g, ""))), r = t.indexOf(".");
    if (r !== -1) {
      const n = t.substring(r + 1).replace(/_/g, "");
      n[n.length - 1] === "0" && (e.minFractionDigits = n.length);
    }
    return e;
  },
  stringify: Pt
}, ds = (t) => typeof t == "bigint" || Number.isInteger(t);
function _o(t, e, r, { intAsBigInt: n }) {
  const s = t[0];
  if ((s === "-" || s === "+") && (e += 1), t = t.substring(e).replace(/_/g, ""), n) {
    switch (r) {
      case 2:
        t = `0b${t}`;
        break;
      case 8:
        t = `0o${t}`;
        break;
      case 16:
        t = `0x${t}`;
        break;
    }
    const o = BigInt(t);
    return s === "-" ? BigInt(-1) * o : o;
  }
  const i = parseInt(t, r);
  return s === "-" ? -1 * i : i;
}
function Jl(t, e, r) {
  const { value: n } = t;
  if (ds(n)) {
    const s = n.toString(e);
    return n < 0 ? "-" + r + s.substr(1) : r + s;
  }
  return Pt(t);
}
const V1 = {
  identify: ds,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: (t, e, r) => _o(t, 2, 2, r),
  stringify: (t) => Jl(t, 2, "0b")
}, H1 = {
  identify: ds,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: (t, e, r) => _o(t, 1, 8, r),
  stringify: (t) => Jl(t, 8, "0")
}, J1 = {
  identify: ds,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: (t, e, r) => _o(t, 0, 10, r),
  stringify: Pt
}, W1 = {
  identify: ds,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: (t, e, r) => _o(t, 2, 16, r),
  stringify: (t) => Jl(t, 16, "0x")
};
class tn extends pt {
  constructor(e) {
    super(e), this.tag = tn.tag;
  }
  add(e) {
    let r;
    Me(e) ? r = e : e && typeof e == "object" && "key" in e && "value" in e && e.value === null ? r = new st(e.key, null) : r = new st(e, null), Sr(this.items, r.key) || this.items.push(r);
  }
  /**
   * If `keepPair` is `true`, returns the Pair matching `key`.
   * Otherwise, returns the value of that Pair's key.
   */
  get(e, r) {
    const n = Sr(this.items, e);
    return !r && Me(n) ? _e(n.key) ? n.key.value : n.key : n;
  }
  set(e, r) {
    if (typeof r != "boolean")
      throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof r}`);
    const n = Sr(this.items, e);
    n && !r ? this.items.splice(this.items.indexOf(n), 1) : !n && r && this.items.push(new st(e));
  }
  toJSON(e, r) {
    return super.toJSON(e, r, Set);
  }
  toString(e, r, n) {
    if (!e)
      return JSON.stringify(this);
    if (this.hasAllNullValues(!0))
      return super.toString(Object.assign({}, e, { allNullValues: !0 }), r, n);
    throw new Error("Set items must all have null values");
  }
  static from(e, r, n) {
    const { replacer: s } = n, i = new this(e);
    if (r && Symbol.iterator in Object(r))
      for (let o of r)
        typeof s == "function" && (o = s.call(r, o, o)), i.items.push(Fl(o, null, n));
    return i;
  }
}
tn.tag = "tag:yaml.org,2002:set";
const Wl = {
  collection: "map",
  identify: (t) => t instanceof Set,
  nodeClass: tn,
  default: !1,
  tag: "tag:yaml.org,2002:set",
  createNode: (t, e, r) => tn.from(t, e, r),
  resolve(t, e) {
    if (cs(t)) {
      if (t.hasAllNullValues(!0))
        return Object.assign(new tn(), t);
      e("Set items must all have null values");
    } else
      e("Expected a mapping for this tag");
    return t;
  }
};
function Gl(t, e) {
  const r = t[0], n = r === "-" || r === "+" ? t.substring(1) : t, s = (o) => e ? BigInt(o) : Number(o), i = n.replace(/_/g, "").split(":").reduce((o, a) => o * s(60) + s(a), s(0));
  return r === "-" ? s(-1) * i : i;
}
function Ep(t) {
  let { value: e } = t, r = (o) => o;
  if (typeof e == "bigint")
    r = (o) => BigInt(o);
  else if (isNaN(e) || !isFinite(e))
    return Pt(t);
  let n = "";
  e < 0 && (n = "-", e *= r(-1));
  const s = r(60), i = [e % s];
  return e < 60 ? i.unshift(0) : (e = (e - i[0]) / s, i.unshift(e % s), e >= 60 && (e = (e - i[0]) / s, i.unshift(e))), n + i.map((o) => String(o).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
const $p = {
  identify: (t) => typeof t == "bigint" || Number.isInteger(t),
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: (t, e, { intAsBigInt: r }) => Gl(t, r),
  stringify: Ep
}, Ap = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: (t) => Gl(t, !1),
  stringify: Ep
}, Eo = {
  identify: (t) => t instanceof Date,
  default: !0,
  tag: "tag:yaml.org,2002:timestamp",
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(t) {
    const e = t.match(Eo.test);
    if (!e)
      throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, r, n, s, i, o, a] = e.map(Number), l = e[7] ? Number((e[7] + "00").substr(1, 3)) : 0;
    let c = Date.UTC(r, n - 1, s, i || 0, o || 0, a || 0, l);
    const d = e[8];
    if (d && d !== "Z") {
      let u = Gl(d, !1);
      Math.abs(u) < 30 && (u *= 60), c -= 6e4 * u;
    }
    return new Date(c);
  },
  stringify: ({ value: t }) => t?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
}, Nd = [
  gn,
  yn,
  ko,
  xo,
  Sp,
  _p,
  V1,
  H1,
  J1,
  W1,
  U1,
  K1,
  z1,
  zl,
  Zt,
  Hl,
  Vl,
  Wl,
  $p,
  Ap,
  Eo
], Id = /* @__PURE__ */ new Map([
  ["core", D1],
  ["failsafe", [gn, yn, ko]],
  ["json", F1],
  ["yaml11", Nd],
  ["yaml-1.1", Nd]
]), Pd = {
  binary: zl,
  bool: Ul,
  float: mp,
  floatExp: pp,
  floatNaN: hp,
  floatTime: Ap,
  int: bp,
  intHex: vp,
  intOct: yp,
  intTime: $p,
  map: gn,
  merge: Zt,
  null: xo,
  omap: Hl,
  pairs: Vl,
  seq: yn,
  set: Wl,
  timestamp: Eo
}, G1 = {
  "tag:yaml.org,2002:binary": zl,
  "tag:yaml.org,2002:merge": Zt,
  "tag:yaml.org,2002:omap": Hl,
  "tag:yaml.org,2002:pairs": Vl,
  "tag:yaml.org,2002:set": Wl,
  "tag:yaml.org,2002:timestamp": Eo
};
function da(t, e, r) {
  const n = Id.get(e);
  if (n && !t)
    return r && !n.includes(Zt) ? n.concat(Zt) : n.slice();
  let s = n;
  if (!s)
    if (Array.isArray(t))
      s = [];
    else {
      const i = Array.from(Id.keys()).filter((o) => o !== "yaml11").map((o) => JSON.stringify(o)).join(", ");
      throw new Error(`Unknown schema "${e}"; use one of ${i} or define customTags array`);
    }
  if (Array.isArray(t))
    for (const i of t)
      s = s.concat(i);
  else typeof t == "function" && (s = t(s.slice()));
  return r && (s = s.concat(Zt)), s.reduce((i, o) => {
    const a = typeof o == "string" ? Pd[o] : o;
    if (!a) {
      const l = JSON.stringify(o), c = Object.keys(Pd).map((d) => JSON.stringify(d)).join(", ");
      throw new Error(`Unknown custom tag ${l}; use one of ${c}`);
    }
    return i.includes(a) || i.push(a), i;
  }, []);
}
const Y1 = (t, e) => t.key < e.key ? -1 : t.key > e.key ? 1 : 0;
class Yl {
  constructor({ compat: e, customTags: r, merge: n, resolveKnownTags: s, schema: i, sortMapEntries: o, toStringDefaults: a }) {
    this.compat = Array.isArray(e) ? da(e, "compat") : e ? da(null, e) : null, this.name = typeof i == "string" && i || "core", this.knownTags = s ? G1 : {}, this.tags = da(r, this.name, n), this.toStringOptions = a ?? null, Object.defineProperty(this, or, { value: gn }), Object.defineProperty(this, Bt, { value: ko }), Object.defineProperty(this, pn, { value: yn }), this.sortMapEntries = typeof o == "function" ? o : o === !0 ? Y1 : null;
  }
  clone() {
    const e = Object.create(Yl.prototype, Object.getOwnPropertyDescriptors(this));
    return e.tags = this.tags.slice(), e;
  }
}
function Q1(t, e) {
  const r = [];
  let n = e.directives === !0;
  if (e.directives !== !1 && t.directives) {
    const l = t.directives.toString(t);
    l ? (r.push(l), n = !0) : t.directives.docStart && (n = !0);
  }
  n && r.push("---");
  const s = lp(t, e), { commentString: i } = s.options;
  if (t.commentBefore) {
    r.length !== 1 && r.unshift("");
    const l = i(t.commentBefore);
    r.unshift(Qt(l, ""));
  }
  let o = !1, a = null;
  if (t.contents) {
    if (Re(t.contents)) {
      if (t.contents.spaceBefore && n && r.push(""), t.contents.commentBefore) {
        const d = i(t.contents.commentBefore);
        r.push(Qt(d, ""));
      }
      s.forceBlockIndent = !!t.comment, a = t.contents.comment;
    }
    const l = a ? void 0 : () => o = !0;
    let c = an(t.contents, s, () => a = null, l);
    a && (c += xr(c, "", i(a))), (c[0] === "|" || c[0] === ">") && r[r.length - 1] === "---" ? r[r.length - 1] = `--- ${c}` : r.push(c);
  } else
    r.push(an(t.contents, s));
  if (t.directives?.docEnd)
    if (t.comment) {
      const l = i(t.comment);
      l.includes(`
`) ? (r.push("..."), r.push(Qt(l, ""))) : r.push(`... ${l}`);
    } else
      r.push("...");
  else {
    let l = t.comment;
    l && o && (l = l.replace(/^\n+/, "")), l && ((!o || a) && r[r.length - 1] !== "" && r.push(""), r.push(Qt(i(l), "")));
  }
  return r.join(`
`) + `
`;
}
class $o {
  constructor(e, r, n) {
    this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, wt, { value: Ga });
    let s = null;
    typeof r == "function" || Array.isArray(r) ? s = r : n === void 0 && r && (n = r, r = void 0);
    const i = Object.assign({
      intAsBigInt: !1,
      keepSourceTokens: !1,
      logLevel: "warn",
      prettyErrors: !0,
      strict: !0,
      stringKeys: !1,
      uniqueKeys: !0,
      version: "1.2"
    }, n);
    this.options = i;
    let { version: o } = i;
    n?._directives ? (this.directives = n._directives.atDocument(), this.directives.yaml.explicit && (o = this.directives.yaml.version)) : this.directives = new Ze({ version: o }), this.setSchema(o, n), this.contents = e === void 0 ? null : this.createNode(e, s, n);
  }
  /**
   * Create a deep copy of this Document and its contents.
   *
   * Custom Node values that inherit from `Object` still refer to their original instances.
   */
  clone() {
    const e = Object.create($o.prototype, {
      [wt]: { value: Ga }
    });
    return e.commentBefore = this.commentBefore, e.comment = this.comment, e.errors = this.errors.slice(), e.warnings = this.warnings.slice(), e.options = Object.assign({}, this.options), this.directives && (e.directives = this.directives.clone()), e.schema = this.schema.clone(), e.contents = Re(this.contents) ? this.contents.clone(e.schema) : this.contents, this.range && (e.range = this.range.slice()), e;
  }
  /** Adds a value to the document. */
  add(e) {
    Kr(this.contents) && this.contents.add(e);
  }
  /** Adds a value to the document. */
  addIn(e, r) {
    Kr(this.contents) && this.contents.addIn(e, r);
  }
  /**
   * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
   *
   * If `node` already has an anchor, `name` is ignored.
   * Otherwise, the `node.anchor` value will be set to `name`,
   * or if an anchor with that name is already present in the document,
   * `name` will be used as a prefix for a new unique anchor.
   * If `name` is undefined, the generated anchor will use 'a' as a prefix.
   */
  createAlias(e, r) {
    if (!e.anchor) {
      const n = np(this);
      e.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !r || n.has(r) ? sp(r || "a", n) : r;
    }
    return new Bl(e.anchor);
  }
  createNode(e, r, n) {
    let s;
    if (typeof r == "function")
      e = r.call({ "": e }, "", e), s = r;
    else if (Array.isArray(r)) {
      const m = (h) => typeof h == "number" || h instanceof String || h instanceof Number, w = r.filter(m).map(String);
      w.length > 0 && (r = r.concat(w)), s = r;
    } else n === void 0 && r && (n = r, r = void 0);
    const { aliasDuplicateObjects: i, anchorPrefix: o, flow: a, keepUndefined: l, onTagObj: c, tag: d } = n ?? {}, { onAnchor: u, setAnchors: f, sourceObjects: p } = E1(
      this,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      o || "a"
    ), b = {
      aliasDuplicateObjects: i ?? !0,
      keepUndefined: l ?? !1,
      onAnchor: u,
      onTagObj: c,
      replacer: s,
      schema: this.schema,
      sourceObjects: p
    }, g = Xn(e, d, b);
    return a && Pe(g) && (g.flow = !0), f(), g;
  }
  /**
   * Convert a key and a value into a `Pair` using the current schema,
   * recursively wrapping all values as `Scalar` or `Collection` nodes.
   */
  createPair(e, r, n = {}) {
    const s = this.createNode(e, null, n), i = this.createNode(r, null, n);
    return new st(s, i);
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  delete(e) {
    return Kr(this.contents) ? this.contents.delete(e) : !1;
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(e) {
    return Mn(e) ? this.contents == null ? !1 : (this.contents = null, !0) : Kr(this.contents) ? this.contents.deleteIn(e) : !1;
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  get(e, r) {
    return Pe(this.contents) ? this.contents.get(e, r) : void 0;
  }
  /**
   * Returns item at `path`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(e, r) {
    return Mn(e) ? !r && _e(this.contents) ? this.contents.value : this.contents : Pe(this.contents) ? this.contents.getIn(e, r) : void 0;
  }
  /**
   * Checks if the document includes a value with the key `key`.
   */
  has(e) {
    return Pe(this.contents) ? this.contents.has(e) : !1;
  }
  /**
   * Checks if the document includes a value at `path`.
   */
  hasIn(e) {
    return Mn(e) ? this.contents !== void 0 : Pe(this.contents) ? this.contents.hasIn(e) : !1;
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  set(e, r) {
    this.contents == null ? this.contents = Wi(this.schema, [e], r) : Kr(this.contents) && this.contents.set(e, r);
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(e, r) {
    Mn(e) ? this.contents = r : this.contents == null ? this.contents = Wi(this.schema, Array.from(e), r) : Kr(this.contents) && this.contents.setIn(e, r);
  }
  /**
   * Change the YAML version and schema used by the document.
   * A `null` version disables support for directives, explicit tags, anchors, and aliases.
   * It also requires the `schema` option to be given as a `Schema` instance value.
   *
   * Overrides all previously set schema options.
   */
  setSchema(e, r = {}) {
    typeof e == "number" && (e = String(e));
    let n;
    switch (e) {
      case "1.1":
        this.directives ? this.directives.yaml.version = "1.1" : this.directives = new Ze({ version: "1.1" }), n = { resolveKnownTags: !1, schema: "yaml-1.1" };
        break;
      case "1.2":
      case "next":
        this.directives ? this.directives.yaml.version = e : this.directives = new Ze({ version: e }), n = { resolveKnownTags: !0, schema: "core" };
        break;
      case null:
        this.directives && delete this.directives, n = null;
        break;
      default: {
        const s = JSON.stringify(e);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${s}`);
      }
    }
    if (r.schema instanceof Object)
      this.schema = r.schema;
    else if (n)
      this.schema = new Yl(Object.assign(n, r));
    else
      throw new Error("With a null YAML version, the { schema: Schema } option is required");
  }
  // json & jsonArg are only used from toJSON()
  toJS({ json: e, jsonArg: r, mapAsMap: n, maxAliasCount: s, onAnchor: i, reviver: o } = {}) {
    const a = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !e,
      mapAsMap: n === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof s == "number" ? s : 100
    }, l = gt(this.contents, r ?? "", a);
    if (typeof i == "function")
      for (const { count: c, res: d } of a.anchors.values())
        i(d, c);
    return typeof o == "function" ? Gr(o, { "": l }, "", l) : l;
  }
  /**
   * A JSON representation of the document `contents`.
   *
   * @param jsonArg Used by `JSON.stringify` to indicate the array index or
   *   property name.
   */
  toJSON(e, r) {
    return this.toJS({ json: !0, jsonArg: e, mapAsMap: !1, onAnchor: r });
  }
  /** A YAML representation of the document. */
  toString(e = {}) {
    if (this.errors.length > 0)
      throw new Error("Document with errors cannot be stringified");
    if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
      const r = JSON.stringify(e.indent);
      throw new Error(`"indent" option must be a positive integer, not ${r}`);
    }
    return Q1(this, e);
  }
}
function Kr(t) {
  if (Pe(t))
    return !0;
  throw new Error("Expected a YAML collection as document contents");
}
class Tp extends Error {
  constructor(e, r, n, s) {
    super(), this.name = e, this.code = n, this.message = s, this.pos = r;
  }
}
class Dn extends Tp {
  constructor(e, r, n) {
    super("YAMLParseError", e, r, n);
  }
}
class X1 extends Tp {
  constructor(e, r, n) {
    super("YAMLWarning", e, r, n);
  }
}
const Ld = (t, e) => (r) => {
  if (r.pos[0] === -1)
    return;
  r.linePos = r.pos.map((a) => e.linePos(a));
  const { line: n, col: s } = r.linePos[0];
  r.message += ` at line ${n}, column ${s}`;
  let i = s - 1, o = t.substring(e.lineStarts[n - 1], e.lineStarts[n]).replace(/[\n\r]+$/, "");
  if (i >= 60 && o.length > 80) {
    const a = Math.min(i - 39, o.length - 79);
    o = "…" + o.substring(a), i -= a - 1;
  }
  if (o.length > 80 && (o = o.substring(0, 79) + "…"), n > 1 && /^ *$/.test(o.substring(0, i))) {
    let a = t.substring(e.lineStarts[n - 2], e.lineStarts[n - 1]);
    a.length > 80 && (a = a.substring(0, 79) + `…
`), o = a + o;
  }
  if (/[^ ]/.test(o)) {
    let a = 1;
    const l = r.linePos[1];
    l?.line === n && l.col > s && (a = Math.max(1, Math.min(l.col - s, 80 - i)));
    const c = " ".repeat(i) + "^".repeat(a);
    r.message += `:

${o}
${c}
`;
  }
};
function ln(t, { flow: e, indicator: r, next: n, offset: s, onError: i, parentIndent: o, startOnNewline: a }) {
  let l = !1, c = a, d = a, u = "", f = "", p = !1, b = !1, g = null, m = null, w = null, h = null, y = null, k = null, v = null;
  for (const _ of t)
    switch (b && (_.type !== "space" && _.type !== "newline" && _.type !== "comma" && i(_.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), b = !1), g && (c && _.type !== "comment" && _.type !== "newline" && i(g, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), g = null), _.type) {
      case "space":
        !e && (r !== "doc-start" || n?.type !== "flow-collection") && _.source.includes("	") && (g = _), d = !0;
        break;
      case "comment": {
        d || i(_, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
        const T = _.source.substring(1) || " ";
        u ? u += f + T : u = T, f = "", c = !1;
        break;
      }
      case "newline":
        c ? u ? u += _.source : (!k || r !== "seq-item-ind") && (l = !0) : f += _.source, c = !0, p = !0, (m || w) && (h = _), d = !0;
        break;
      case "anchor":
        m && i(_, "MULTIPLE_ANCHORS", "A node can have at most one anchor"), _.source.endsWith(":") && i(_.offset + _.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0), m = _, v ?? (v = _.offset), c = !1, d = !1, b = !0;
        break;
      case "tag": {
        w && i(_, "MULTIPLE_TAGS", "A node can have at most one tag"), w = _, v ?? (v = _.offset), c = !1, d = !1, b = !0;
        break;
      }
      case r:
        (m || w) && i(_, "BAD_PROP_ORDER", `Anchors and tags must be after the ${_.source} indicator`), k && i(_, "UNEXPECTED_TOKEN", `Unexpected ${_.source} in ${e ?? "collection"}`), k = _, c = r === "seq-item-ind" || r === "explicit-key-ind", d = !1;
        break;
      case "comma":
        if (e) {
          y && i(_, "UNEXPECTED_TOKEN", `Unexpected , in ${e}`), y = _, c = !1, d = !1;
          break;
        }
      // else fallthrough
      default:
        i(_, "UNEXPECTED_TOKEN", `Unexpected ${_.type} token`), c = !1, d = !1;
    }
  const x = t[t.length - 1], S = x ? x.offset + x.source.length : s;
  return b && n && n.type !== "space" && n.type !== "newline" && n.type !== "comma" && (n.type !== "scalar" || n.source !== "") && i(n.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), g && (c && g.indent <= o || n?.type === "block-map" || n?.type === "block-seq") && i(g, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), {
    comma: y,
    found: k,
    spaceBefore: l,
    comment: u,
    hasNewline: p,
    anchor: m,
    tag: w,
    newlineAfterProp: h,
    end: S,
    start: v ?? S
  };
}
function Zn(t) {
  if (!t)
    return null;
  switch (t.type) {
    case "alias":
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      if (t.source.includes(`
`))
        return !0;
      if (t.end) {
        for (const e of t.end)
          if (e.type === "newline")
            return !0;
      }
      return !1;
    case "flow-collection":
      for (const e of t.items) {
        for (const r of e.start)
          if (r.type === "newline")
            return !0;
        if (e.sep) {
          for (const r of e.sep)
            if (r.type === "newline")
              return !0;
        }
        if (Zn(e.key) || Zn(e.value))
          return !0;
      }
      return !1;
    default:
      return !0;
  }
}
function Za(t, e, r) {
  if (e?.type === "flow-collection") {
    const n = e.end[0];
    n.indent === t && (n.source === "]" || n.source === "}") && Zn(e) && r(n, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
  }
}
function Op(t, e, r) {
  const { uniqueKeys: n } = t.options;
  if (n === !1)
    return !1;
  const s = typeof n == "function" ? n : (i, o) => i === o || _e(i) && _e(o) && i.value === o.value;
  return e.some((i) => s(i.key, r));
}
const Rd = "All mapping items must start at the same column";
function Z1({ composeNode: t, composeEmptyNode: e }, r, n, s, i) {
  const o = i?.nodeClass ?? pt, a = new o(r.schema);
  r.atRoot && (r.atRoot = !1);
  let l = n.offset, c = null;
  for (const d of n.items) {
    const { start: u, key: f, sep: p, value: b } = d, g = ln(u, {
      indicator: "explicit-key-ind",
      next: f ?? p?.[0],
      offset: l,
      onError: s,
      parentIndent: n.indent,
      startOnNewline: !0
    }), m = !g.found;
    if (m) {
      if (f && (f.type === "block-seq" ? s(l, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key") : "indent" in f && f.indent !== n.indent && s(l, "BAD_INDENT", Rd)), !g.anchor && !g.tag && !p) {
        c = g.end, g.comment && (a.comment ? a.comment += `
` + g.comment : a.comment = g.comment);
        continue;
      }
      (g.newlineAfterProp || Zn(f)) && s(f ?? u[u.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
    } else g.found?.indent !== n.indent && s(l, "BAD_INDENT", Rd);
    r.atKey = !0;
    const w = g.end, h = f ? t(r, f, g, s) : e(r, w, u, null, g, s);
    r.schema.compat && Za(n.indent, f, s), r.atKey = !1, Op(r, a.items, h) && s(w, "DUPLICATE_KEY", "Map keys must be unique");
    const y = ln(p ?? [], {
      indicator: "map-value-ind",
      next: b,
      offset: h.range[2],
      onError: s,
      parentIndent: n.indent,
      startOnNewline: !f || f.type === "block-scalar"
    });
    if (l = y.end, y.found) {
      m && (b?.type === "block-map" && !y.hasNewline && s(l, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"), r.options.strict && g.start < y.found.offset - 1024 && s(h.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));
      const k = b ? t(r, b, y, s) : e(r, l, p, null, y, s);
      r.schema.compat && Za(n.indent, b, s), l = k.range[2];
      const v = new st(h, k);
      r.options.keepSourceTokens && (v.srcToken = d), a.items.push(v);
    } else {
      m && s(h.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"), y.comment && (h.comment ? h.comment += `
` + y.comment : h.comment = y.comment);
      const k = new st(h);
      r.options.keepSourceTokens && (k.srcToken = d), a.items.push(k);
    }
  }
  return c && c < l && s(c, "IMPOSSIBLE", "Map comment with trailing content"), a.range = [n.offset, l, c ?? l], a;
}
function e_({ composeNode: t, composeEmptyNode: e }, r, n, s, i) {
  const o = i?.nodeClass ?? Cr, a = new o(r.schema);
  r.atRoot && (r.atRoot = !1), r.atKey && (r.atKey = !1);
  let l = n.offset, c = null;
  for (const { start: d, value: u } of n.items) {
    const f = ln(d, {
      indicator: "seq-item-ind",
      next: u,
      offset: l,
      onError: s,
      parentIndent: n.indent,
      startOnNewline: !0
    });
    if (!f.found)
      if (f.anchor || f.tag || u)
        u?.type === "block-seq" ? s(f.end, "BAD_INDENT", "All sequence items must start at the same column") : s(l, "MISSING_CHAR", "Sequence item without - indicator");
      else {
        c = f.end, f.comment && (a.comment = f.comment);
        continue;
      }
    const p = u ? t(r, u, f, s) : e(r, f.end, d, null, f, s);
    r.schema.compat && Za(n.indent, u, s), l = p.range[2], a.items.push(p);
  }
  return a.range = [n.offset, l, c ?? l], a;
}
function fs(t, e, r, n) {
  let s = "";
  if (t) {
    let i = !1, o = "";
    for (const a of t) {
      const { source: l, type: c } = a;
      switch (c) {
        case "space":
          i = !0;
          break;
        case "comment": {
          r && !i && n(a, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const d = l.substring(1) || " ";
          s ? s += o + d : s = d, o = "";
          break;
        }
        case "newline":
          s && (o += l), i = !0;
          break;
        default:
          n(a, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
      }
      e += l.length;
    }
  }
  return { comment: s, offset: e };
}
const fa = "Block collections are not allowed within flow collections", ha = (t) => t && (t.type === "block-map" || t.type === "block-seq");
function t_({ composeNode: t, composeEmptyNode: e }, r, n, s, i) {
  const o = n.start.source === "{", a = o ? "flow map" : "flow sequence", l = i?.nodeClass ?? (o ? pt : Cr), c = new l(r.schema);
  c.flow = !0;
  const d = r.atRoot;
  d && (r.atRoot = !1), r.atKey && (r.atKey = !1);
  let u = n.offset + n.start.source.length;
  for (let m = 0; m < n.items.length; ++m) {
    const w = n.items[m], { start: h, key: y, sep: k, value: v } = w, x = ln(h, {
      flow: a,
      indicator: "explicit-key-ind",
      next: y ?? k?.[0],
      offset: u,
      onError: s,
      parentIndent: n.indent,
      startOnNewline: !1
    });
    if (!x.found) {
      if (!x.anchor && !x.tag && !k && !v) {
        m === 0 && x.comma ? s(x.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`) : m < n.items.length - 1 && s(x.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${a}`), x.comment && (c.comment ? c.comment += `
` + x.comment : c.comment = x.comment), u = x.end;
        continue;
      }
      !o && r.options.strict && Zn(y) && s(
        y,
        // checked by containsNewline()
        "MULTILINE_IMPLICIT_KEY",
        "Implicit keys of flow sequence pairs need to be on a single line"
      );
    }
    if (m === 0)
      x.comma && s(x.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`);
    else if (x.comma || s(x.start, "MISSING_CHAR", `Missing , between ${a} items`), x.comment) {
      let S = "";
      e: for (const _ of h)
        switch (_.type) {
          case "comma":
          case "space":
            break;
          case "comment":
            S = _.source.substring(1);
            break e;
          default:
            break e;
        }
      if (S) {
        let _ = c.items[c.items.length - 1];
        Me(_) && (_ = _.value ?? _.key), _.comment ? _.comment += `
` + S : _.comment = S, x.comment = x.comment.substring(S.length + 1);
      }
    }
    if (!o && !k && !x.found) {
      const S = v ? t(r, v, x, s) : e(r, x.end, k, null, x, s);
      c.items.push(S), u = S.range[2], ha(v) && s(S.range, "BLOCK_IN_FLOW", fa);
    } else {
      r.atKey = !0;
      const S = x.end, _ = y ? t(r, y, x, s) : e(r, S, h, null, x, s);
      ha(y) && s(_.range, "BLOCK_IN_FLOW", fa), r.atKey = !1;
      const T = ln(k ?? [], {
        flow: a,
        indicator: "map-value-ind",
        next: v,
        offset: _.range[2],
        onError: s,
        parentIndent: n.indent,
        startOnNewline: !1
      });
      if (T.found) {
        if (!o && !x.found && r.options.strict) {
          if (k)
            for (const D of k) {
              if (D === T.found)
                break;
              if (D.type === "newline") {
                s(D, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                break;
              }
            }
          x.start < T.found.offset - 1024 && s(T.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
        }
      } else v && ("source" in v && v.source?.[0] === ":" ? s(v, "MISSING_CHAR", `Missing space after : in ${a}`) : s(T.start, "MISSING_CHAR", `Missing , or : between ${a} items`));
      const P = v ? t(r, v, T, s) : T.found ? e(r, T.end, k, null, T, s) : null;
      P ? ha(v) && s(P.range, "BLOCK_IN_FLOW", fa) : T.comment && (_.comment ? _.comment += `
` + T.comment : _.comment = T.comment);
      const R = new st(_, P);
      if (r.options.keepSourceTokens && (R.srcToken = w), o) {
        const D = c;
        Op(r, D.items, _) && s(S, "DUPLICATE_KEY", "Map keys must be unique"), D.items.push(R);
      } else {
        const D = new pt(r.schema);
        D.flow = !0, D.items.push(R);
        const U = (P ?? _).range;
        D.range = [_.range[0], U[1], U[2]], c.items.push(D);
      }
      u = P ? P.range[2] : T.end;
    }
  }
  const f = o ? "}" : "]", [p, ...b] = n.end;
  let g = u;
  if (p?.source === f)
    g = p.offset + p.source.length;
  else {
    const m = a[0].toUpperCase() + a.substring(1), w = d ? `${m} must end with a ${f}` : `${m} in block collection must be sufficiently indented and end with a ${f}`;
    s(u, d ? "MISSING_CHAR" : "BAD_INDENT", w), p && p.source.length !== 1 && b.unshift(p);
  }
  if (b.length > 0) {
    const m = fs(b, g, r.options.strict, s);
    m.comment && (c.comment ? c.comment += `
` + m.comment : c.comment = m.comment), c.range = [n.offset, g, m.offset];
  } else
    c.range = [n.offset, g, g];
  return c;
}
function pa(t, e, r, n, s, i) {
  const o = r.type === "block-map" ? Z1(t, e, r, n, i) : r.type === "block-seq" ? e_(t, e, r, n, i) : t_(t, e, r, n, i), a = o.constructor;
  return s === "!" || s === a.tagName ? (o.tag = a.tagName, o) : (s && (o.tag = s), o);
}
function r_(t, e, r, n, s) {
  const i = n.tag, o = i ? e.directives.tagName(i.source, (f) => s(i, "TAG_RESOLVE_FAILED", f)) : null;
  if (r.type === "block-seq") {
    const { anchor: f, newlineAfterProp: p } = n, b = f && i ? f.offset > i.offset ? f : i : f ?? i;
    b && (!p || p.offset < b.offset) && s(b, "MISSING_CHAR", "Missing newline after block sequence props");
  }
  const a = r.type === "block-map" ? "map" : r.type === "block-seq" ? "seq" : r.start.source === "{" ? "map" : "seq";
  if (!i || !o || o === "!" || o === pt.tagName && a === "map" || o === Cr.tagName && a === "seq")
    return pa(t, e, r, s, o);
  let l = e.schema.tags.find((f) => f.tag === o && f.collection === a);
  if (!l) {
    const f = e.schema.knownTags[o];
    if (f?.collection === a)
      e.schema.tags.push(Object.assign({}, f, { default: !1 })), l = f;
    else
      return f ? s(i, "BAD_COLLECTION_TYPE", `${f.tag} used for ${a} collection, but expects ${f.collection ?? "scalar"}`, !0) : s(i, "TAG_RESOLVE_FAILED", `Unresolved tag: ${o}`, !0), pa(t, e, r, s, o);
  }
  const c = pa(t, e, r, s, o, l), d = l.resolve?.(c, (f) => s(i, "TAG_RESOLVE_FAILED", f), e.options) ?? c, u = Re(d) ? d : new ae(d);
  return u.range = c.range, u.tag = o, l?.format && (u.format = l.format), u;
}
function n_(t, e, r) {
  const n = e.offset, s = s_(e, t.options.strict, r);
  if (!s)
    return { value: "", type: null, comment: "", range: [n, n, n] };
  const i = s.mode === ">" ? ae.BLOCK_FOLDED : ae.BLOCK_LITERAL, o = e.source ? i_(e.source) : [];
  let a = o.length;
  for (let g = o.length - 1; g >= 0; --g) {
    const m = o[g][1];
    if (m === "" || m === "\r")
      a = g;
    else
      break;
  }
  if (a === 0) {
    const g = s.chomp === "+" && o.length > 0 ? `
`.repeat(Math.max(1, o.length - 1)) : "";
    let m = n + s.length;
    return e.source && (m += e.source.length), { value: g, type: i, comment: s.comment, range: [n, m, m] };
  }
  let l = e.indent + s.indent, c = e.offset + s.length, d = 0;
  for (let g = 0; g < a; ++g) {
    const [m, w] = o[g];
    if (w === "" || w === "\r")
      s.indent === 0 && m.length > l && (l = m.length);
    else {
      m.length < l && r(c + m.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator"), s.indent === 0 && (l = m.length), d = g, l === 0 && !t.atRoot && r(c, "BAD_INDENT", "Block scalar values in collections must be indented");
      break;
    }
    c += m.length + w.length + 1;
  }
  for (let g = o.length - 1; g >= a; --g)
    o[g][0].length > l && (a = g + 1);
  let u = "", f = "", p = !1;
  for (let g = 0; g < d; ++g)
    u += o[g][0].slice(l) + `
`;
  for (let g = d; g < a; ++g) {
    let [m, w] = o[g];
    c += m.length + w.length + 1;
    const h = w[w.length - 1] === "\r";
    if (h && (w = w.slice(0, -1)), w && m.length < l) {
      const y = `Block scalar lines must not be less indented than their ${s.indent ? "explicit indentation indicator" : "first line"}`;
      r(c - w.length - (h ? 2 : 1), "BAD_INDENT", y), m = "";
    }
    i === ae.BLOCK_LITERAL ? (u += f + m.slice(l) + w, f = `
`) : m.length > l || w[0] === "	" ? (f === " " ? f = `
` : !p && f === `
` && (f = `

`), u += f + m.slice(l) + w, f = `
`, p = !0) : w === "" ? f === `
` ? u += `
` : f = `
` : (u += f + w, f = " ", p = !1);
  }
  switch (s.chomp) {
    case "-":
      break;
    case "+":
      for (let g = a; g < o.length; ++g)
        u += `
` + o[g][0].slice(l);
      u[u.length - 1] !== `
` && (u += `
`);
      break;
    default:
      u += `
`;
  }
  const b = n + s.length + e.source.length;
  return { value: u, type: i, comment: s.comment, range: [n, b, b] };
}
function s_({ offset: t, props: e }, r, n) {
  if (e[0].type !== "block-scalar-header")
    return n(e[0], "IMPOSSIBLE", "Block scalar header not found"), null;
  const { source: s } = e[0], i = s[0];
  let o = 0, a = "", l = -1;
  for (let f = 1; f < s.length; ++f) {
    const p = s[f];
    if (!a && (p === "-" || p === "+"))
      a = p;
    else {
      const b = Number(p);
      !o && b ? o = b : l === -1 && (l = t + f);
    }
  }
  l !== -1 && n(l, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${s}`);
  let c = !1, d = "", u = s.length;
  for (let f = 1; f < e.length; ++f) {
    const p = e[f];
    switch (p.type) {
      case "space":
        c = !0;
      // fallthrough
      case "newline":
        u += p.source.length;
        break;
      case "comment":
        r && !c && n(p, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"), u += p.source.length, d = p.source.substring(1);
        break;
      case "error":
        n(p, "UNEXPECTED_TOKEN", p.message), u += p.source.length;
        break;
      /* istanbul ignore next should not happen */
      default: {
        const b = `Unexpected token in block scalar header: ${p.type}`;
        n(p, "UNEXPECTED_TOKEN", b);
        const g = p.source;
        g && typeof g == "string" && (u += g.length);
      }
    }
  }
  return { mode: i, indent: o, chomp: a, comment: d, length: u };
}
function i_(t) {
  const e = t.split(/\n( *)/), r = e[0], n = r.match(/^( *)/), s = [n?.[1] ? [n[1], r.slice(n[1].length)] : ["", r]];
  for (let i = 1; i < e.length; i += 2)
    s.push([e[i], e[i + 1]]);
  return s;
}
function o_(t, e, r) {
  const { offset: n, type: s, source: i, end: o } = t;
  let a, l;
  const c = (f, p, b) => r(n + f, p, b);
  switch (s) {
    case "scalar":
      a = ae.PLAIN, l = a_(i, c);
      break;
    case "single-quoted-scalar":
      a = ae.QUOTE_SINGLE, l = l_(i, c);
      break;
    case "double-quoted-scalar":
      a = ae.QUOTE_DOUBLE, l = c_(i, c);
      break;
    /* istanbul ignore next should not happen */
    default:
      return r(t, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${s}`), {
        value: "",
        type: null,
        comment: "",
        range: [n, n + i.length, n + i.length]
      };
  }
  const d = n + i.length, u = fs(o, d, e, r);
  return {
    value: l,
    type: a,
    comment: u.comment,
    range: [n, d, u.offset]
  };
}
function a_(t, e) {
  let r = "";
  switch (t[0]) {
    /* istanbul ignore next should not happen */
    case "	":
      r = "a tab character";
      break;
    case ",":
      r = "flow indicator character ,";
      break;
    case "%":
      r = "directive indicator character %";
      break;
    case "|":
    case ">": {
      r = `block scalar indicator ${t[0]}`;
      break;
    }
    case "@":
    case "`": {
      r = `reserved character ${t[0]}`;
      break;
    }
  }
  return r && e(0, "BAD_SCALAR_START", `Plain value cannot start with ${r}`), Cp(t);
}
function l_(t, e) {
  return (t[t.length - 1] !== "'" || t.length === 1) && e(t.length, "MISSING_CHAR", "Missing closing 'quote"), Cp(t.slice(1, -1)).replace(/''/g, "'");
}
function Cp(t) {
  let e, r;
  try {
    e = new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`, "sy"), r = new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`, "sy");
  } catch {
    e = /(.*?)[ \t]*\r?\n/sy, r = /[ \t]*(.*?)[ \t]*\r?\n/sy;
  }
  let n = e.exec(t);
  if (!n)
    return t;
  let s = n[1], i = " ", o = e.lastIndex;
  for (r.lastIndex = o; n = r.exec(t); )
    n[1] === "" ? i === `
` ? s += i : i = `
` : (s += i + n[1], i = " "), o = r.lastIndex;
  const a = /[ \t]*(.*)/sy;
  return a.lastIndex = o, n = a.exec(t), s + i + (n?.[1] ?? "");
}
function c_(t, e) {
  let r = "";
  for (let n = 1; n < t.length - 1; ++n) {
    const s = t[n];
    if (!(s === "\r" && t[n + 1] === `
`))
      if (s === `
`) {
        const { fold: i, offset: o } = u_(t, n);
        r += i, n = o;
      } else if (s === "\\") {
        let i = t[++n];
        const o = d_[i];
        if (o)
          r += o;
        else if (i === `
`)
          for (i = t[n + 1]; i === " " || i === "	"; )
            i = t[++n + 1];
        else if (i === "\r" && t[n + 1] === `
`)
          for (i = t[++n + 1]; i === " " || i === "	"; )
            i = t[++n + 1];
        else if (i === "x" || i === "u" || i === "U") {
          const a = { x: 2, u: 4, U: 8 }[i];
          r += f_(t, n + 1, a, e), n += a;
        } else {
          const a = t.substr(n - 1, 2);
          e(n - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), r += a;
        }
      } else if (s === " " || s === "	") {
        const i = n;
        let o = t[n + 1];
        for (; o === " " || o === "	"; )
          o = t[++n + 1];
        o !== `
` && !(o === "\r" && t[n + 2] === `
`) && (r += n > i ? t.slice(i, n + 1) : s);
      } else
        r += s;
  }
  return (t[t.length - 1] !== '"' || t.length === 1) && e(t.length, "MISSING_CHAR", 'Missing closing "quote'), r;
}
function u_(t, e) {
  let r = "", n = t[e + 1];
  for (; (n === " " || n === "	" || n === `
` || n === "\r") && !(n === "\r" && t[e + 2] !== `
`); )
    n === `
` && (r += `
`), e += 1, n = t[e + 1];
  return r || (r = " "), { fold: r, offset: e };
}
const d_ = {
  0: "\0",
  // null character
  a: "\x07",
  // bell character
  b: "\b",
  // backspace
  e: "\x1B",
  // escape character
  f: "\f",
  // form feed
  n: `
`,
  // line feed
  r: "\r",
  // carriage return
  t: "	",
  // horizontal tab
  v: "\v",
  // vertical tab
  N: "",
  // Unicode next line
  _: " ",
  // Unicode non-breaking space
  L: "\u2028",
  // Unicode line separator
  P: "\u2029",
  // Unicode paragraph separator
  " ": " ",
  '"': '"',
  "/": "/",
  "\\": "\\",
  "	": "	"
};
function f_(t, e, r, n) {
  const s = t.substr(e, r), i = s.length === r && /^[0-9a-fA-F]+$/.test(s) ? parseInt(s, 16) : NaN;
  if (isNaN(i)) {
    const o = t.substr(e - 2, r + 2);
    return n(e - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${o}`), o;
  }
  return String.fromCodePoint(i);
}
function Np(t, e, r, n) {
  const { value: s, type: i, comment: o, range: a } = e.type === "block-scalar" ? n_(t, e, n) : o_(e, t.options.strict, n), l = r ? t.directives.tagName(r.source, (u) => n(r, "TAG_RESOLVE_FAILED", u)) : null;
  let c;
  t.options.stringKeys && t.atKey ? c = t.schema[Bt] : l ? c = h_(t.schema, s, l, r, n) : e.type === "scalar" ? c = p_(t, s, e, n) : c = t.schema[Bt];
  let d;
  try {
    const u = c.resolve(s, (f) => n(r ?? e, "TAG_RESOLVE_FAILED", f), t.options);
    d = _e(u) ? u : new ae(u);
  } catch (u) {
    const f = u instanceof Error ? u.message : String(u);
    n(r ?? e, "TAG_RESOLVE_FAILED", f), d = new ae(s);
  }
  return d.range = a, d.source = s, i && (d.type = i), l && (d.tag = l), c.format && (d.format = c.format), o && (d.comment = o), d;
}
function h_(t, e, r, n, s) {
  if (r === "!")
    return t[Bt];
  const i = [];
  for (const a of t.tags)
    if (!a.collection && a.tag === r)
      if (a.default && a.test)
        i.push(a);
      else
        return a;
  for (const a of i)
    if (a.test?.test(e))
      return a;
  const o = t.knownTags[r];
  return o && !o.collection ? (t.tags.push(Object.assign({}, o, { default: !1, test: void 0 })), o) : (s(n, "TAG_RESOLVE_FAILED", `Unresolved tag: ${r}`, r !== "tag:yaml.org,2002:str"), t[Bt]);
}
function p_({ atKey: t, directives: e, schema: r }, n, s, i) {
  const o = r.tags.find((a) => (a.default === !0 || t && a.default === "key") && a.test?.test(n)) || r[Bt];
  if (r.compat) {
    const a = r.compat.find((l) => l.default && l.test?.test(n)) ?? r[Bt];
    if (o.tag !== a.tag) {
      const l = e.tagString(o.tag), c = e.tagString(a.tag), d = `Value may be parsed as either ${l} or ${c}`;
      i(s, "TAG_RESOLVE_FAILED", d, !0);
    }
  }
  return o;
}
function m_(t, e, r) {
  if (e) {
    r ?? (r = e.length);
    for (let n = r - 1; n >= 0; --n) {
      let s = e[n];
      switch (s.type) {
        case "space":
        case "comment":
        case "newline":
          t -= s.source.length;
          continue;
      }
      for (s = e[++n]; s?.type === "space"; )
        t += s.source.length, s = e[++n];
      break;
    }
  }
  return t;
}
const g_ = { composeNode: Ip, composeEmptyNode: Ql };
function Ip(t, e, r, n) {
  const s = t.atKey, { spaceBefore: i, comment: o, anchor: a, tag: l } = r;
  let c, d = !0;
  switch (e.type) {
    case "alias":
      c = y_(t, e, n), (a || l) && n(e, "ALIAS_PROPS", "An alias node must not specify any properties");
      break;
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "block-scalar":
      c = Np(t, e, l, n), a && (c.anchor = a.source.substring(1));
      break;
    case "block-map":
    case "block-seq":
    case "flow-collection":
      c = r_(g_, t, e, r, n), a && (c.anchor = a.source.substring(1));
      break;
    default: {
      const u = e.type === "error" ? e.message : `Unsupported token (type: ${e.type})`;
      n(e, "UNEXPECTED_TOKEN", u), c = Ql(t, e.offset, void 0, null, r, n), d = !1;
    }
  }
  return a && c.anchor === "" && n(a, "BAD_ALIAS", "Anchor cannot be an empty string"), s && t.options.stringKeys && (!_e(c) || typeof c.value != "string" || c.tag && c.tag !== "tag:yaml.org,2002:str") && n(l ?? e, "NON_STRING_KEY", "With stringKeys, all keys must be strings"), i && (c.spaceBefore = !0), o && (e.type === "scalar" && e.source === "" ? c.comment = o : c.commentBefore = o), t.options.keepSourceTokens && d && (c.srcToken = e), c;
}
function Ql(t, e, r, n, { spaceBefore: s, comment: i, anchor: o, tag: a, end: l }, c) {
  const d = {
    type: "scalar",
    offset: m_(e, r, n),
    indent: -1,
    source: ""
  }, u = Np(t, d, a, c);
  return o && (u.anchor = o.source.substring(1), u.anchor === "" && c(o, "BAD_ALIAS", "Anchor cannot be an empty string")), s && (u.spaceBefore = !0), i && (u.comment = i, u.range[2] = l), u;
}
function y_({ options: t }, { offset: e, source: r, end: n }, s) {
  const i = new Bl(r.substring(1));
  i.source === "" && s(e, "BAD_ALIAS", "Alias cannot be an empty string"), i.source.endsWith(":") && s(e + r.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
  const o = e + r.length, a = fs(n, o, t.strict, s);
  return i.range = [e, o, a.offset], a.comment && (i.comment = a.comment), i;
}
function b_(t, e, { offset: r, start: n, value: s, end: i }, o) {
  const a = Object.assign({ _directives: e }, t), l = new $o(void 0, a), c = {
    atKey: !1,
    atRoot: !0,
    directives: l.directives,
    options: l.options,
    schema: l.schema
  }, d = ln(n, {
    indicator: "doc-start",
    next: s ?? i?.[0],
    offset: r,
    onError: o,
    parentIndent: 0,
    startOnNewline: !0
  });
  d.found && (l.directives.docStart = !0, s && (s.type === "block-map" || s.type === "block-seq") && !d.hasNewline && o(d.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")), l.contents = s ? Ip(c, s, d, o) : Ql(c, d.end, n, null, d, o);
  const u = l.contents.range[2], f = fs(i, u, !1, o);
  return f.comment && (l.comment = f.comment), l.range = [r, u, f.offset], l;
}
function Nn(t) {
  if (typeof t == "number")
    return [t, t + 1];
  if (Array.isArray(t))
    return t.length === 2 ? t : [t[0], t[1]];
  const { offset: e, source: r } = t;
  return [e, e + (typeof r == "string" ? r.length : 1)];
}
function jd(t) {
  let e = "", r = !1, n = !1;
  for (let s = 0; s < t.length; ++s) {
    const i = t[s];
    switch (i[0]) {
      case "#":
        e += (e === "" ? "" : n ? `

` : `
`) + (i.substring(1) || " "), r = !0, n = !1;
        break;
      case "%":
        t[s + 1]?.[0] !== "#" && (s += 1), r = !1;
        break;
      default:
        r || (n = !0), r = !1;
    }
  }
  return { comment: e, afterEmptyLine: n };
}
class v_ {
  constructor(e = {}) {
    this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (r, n, s, i) => {
      const o = Nn(r);
      i ? this.warnings.push(new X1(o, n, s)) : this.errors.push(new Dn(o, n, s));
    }, this.directives = new Ze({ version: e.version || "1.2" }), this.options = e;
  }
  decorate(e, r) {
    const { comment: n, afterEmptyLine: s } = jd(this.prelude);
    if (n) {
      const i = e.contents;
      if (r)
        e.comment = e.comment ? `${e.comment}
${n}` : n;
      else if (s || e.directives.docStart || !i)
        e.commentBefore = n;
      else if (Pe(i) && !i.flow && i.items.length > 0) {
        let o = i.items[0];
        Me(o) && (o = o.key);
        const a = o.commentBefore;
        o.commentBefore = a ? `${n}
${a}` : n;
      } else {
        const o = i.commentBefore;
        i.commentBefore = o ? `${n}
${o}` : n;
      }
    }
    r ? (Array.prototype.push.apply(e.errors, this.errors), Array.prototype.push.apply(e.warnings, this.warnings)) : (e.errors = this.errors, e.warnings = this.warnings), this.prelude = [], this.errors = [], this.warnings = [];
  }
  /**
   * Current stream status information.
   *
   * Mostly useful at the end of input for an empty stream.
   */
  streamInfo() {
    return {
      comment: jd(this.prelude).comment,
      directives: this.directives,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  /**
   * Compose tokens into documents.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *compose(e, r = !1, n = -1) {
    for (const s of e)
      yield* this.next(s);
    yield* this.end(r, n);
  }
  /** Advance the composer by one CST token. */
  *next(e) {
    switch (e.type) {
      case "directive":
        this.directives.add(e.source, (r, n, s) => {
          const i = Nn(e);
          i[0] += r, this.onError(i, "BAD_DIRECTIVE", n, s);
        }), this.prelude.push(e.source), this.atDirectives = !0;
        break;
      case "document": {
        const r = b_(this.options, this.directives, e, this.onError);
        this.atDirectives && !r.directives.docStart && this.onError(e, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"), this.decorate(r, !1), this.doc && (yield this.doc), this.doc = r, this.atDirectives = !1;
        break;
      }
      case "byte-order-mark":
      case "space":
        break;
      case "comment":
      case "newline":
        this.prelude.push(e.source);
        break;
      case "error": {
        const r = e.source ? `${e.message}: ${JSON.stringify(e.source)}` : e.message, n = new Dn(Nn(e), "UNEXPECTED_TOKEN", r);
        this.atDirectives || !this.doc ? this.errors.push(n) : this.doc.errors.push(n);
        break;
      }
      case "doc-end": {
        if (!this.doc) {
          const n = "Unexpected doc-end without preceding document";
          this.errors.push(new Dn(Nn(e), "UNEXPECTED_TOKEN", n));
          break;
        }
        this.doc.directives.docEnd = !0;
        const r = fs(e.end, e.offset + e.source.length, this.doc.options.strict, this.onError);
        if (this.decorate(this.doc, !0), r.comment) {
          const n = this.doc.comment;
          this.doc.comment = n ? `${n}
${r.comment}` : r.comment;
        }
        this.doc.range[2] = r.offset;
        break;
      }
      default:
        this.errors.push(new Dn(Nn(e), "UNEXPECTED_TOKEN", `Unsupported token ${e.type}`));
    }
  }
  /**
   * Call at end of input to yield any remaining document.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *end(e = !1, r = -1) {
    if (this.doc)
      this.decorate(this.doc, !0), yield this.doc, this.doc = null;
    else if (e) {
      const n = Object.assign({ _directives: this.directives }, this.options), s = new $o(void 0, n);
      this.atDirectives && this.onError(r, "MISSING_CHAR", "Missing directives-end indicator line"), s.range = [0, r, r], this.decorate(s, !1), yield s;
    }
  }
}
const Pp = "\uFEFF", Lp = "", Rp = "", el = "";
function w_(t) {
  switch (t) {
    case Pp:
      return "byte-order-mark";
    case Lp:
      return "doc-mode";
    case Rp:
      return "flow-error-end";
    case el:
      return "scalar";
    case "---":
      return "doc-start";
    case "...":
      return "doc-end";
    case "":
    case `
`:
    case `\r
`:
      return "newline";
    case "-":
      return "seq-item-ind";
    case "?":
      return "explicit-key-ind";
    case ":":
      return "map-value-ind";
    case "{":
      return "flow-map-start";
    case "}":
      return "flow-map-end";
    case "[":
      return "flow-seq-start";
    case "]":
      return "flow-seq-end";
    case ",":
      return "comma";
  }
  switch (t[0]) {
    case " ":
    case "	":
      return "space";
    case "#":
      return "comment";
    case "%":
      return "directive-line";
    case "*":
      return "alias";
    case "&":
      return "anchor";
    case "!":
      return "tag";
    case "'":
      return "single-quoted-scalar";
    case '"':
      return "double-quoted-scalar";
    case "|":
    case ">":
      return "block-scalar-header";
  }
  return null;
}
function Et(t) {
  switch (t) {
    case void 0:
    case " ":
    case `
`:
    case "\r":
    case "	":
      return !0;
    default:
      return !1;
  }
}
const Md = new Set("0123456789ABCDEFabcdef"), k_ = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), yi = new Set(",[]{}"), x_ = new Set(` ,[]{}
\r	`), ma = (t) => !t || x_.has(t);
class S_ {
  constructor() {
    this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0;
  }
  /**
   * Generate YAML tokens from the `source` string. If `incomplete`,
   * a part of the last line may be left as a buffer for the next call.
   *
   * @returns A generator of lexical tokens
   */
  *lex(e, r = !1) {
    if (e) {
      if (typeof e != "string")
        throw TypeError("source is not a string");
      this.buffer = this.buffer ? this.buffer + e : e, this.lineEndPos = null;
    }
    this.atEnd = !r;
    let n = this.next ?? "stream";
    for (; n && (r || this.hasChars(1)); )
      n = yield* this.parseNext(n);
  }
  atLineEnd() {
    let e = this.pos, r = this.buffer[e];
    for (; r === " " || r === "	"; )
      r = this.buffer[++e];
    return !r || r === "#" || r === `
` ? !0 : r === "\r" ? this.buffer[e + 1] === `
` : !1;
  }
  charAt(e) {
    return this.buffer[this.pos + e];
  }
  continueScalar(e) {
    let r = this.buffer[e];
    if (this.indentNext > 0) {
      let n = 0;
      for (; r === " "; )
        r = this.buffer[++n + e];
      if (r === "\r") {
        const s = this.buffer[n + e + 1];
        if (s === `
` || !s && !this.atEnd)
          return e + n + 1;
      }
      return r === `
` || n >= this.indentNext || !r && !this.atEnd ? e + n : -1;
    }
    if (r === "-" || r === ".") {
      const n = this.buffer.substr(e, 3);
      if ((n === "---" || n === "...") && Et(this.buffer[e + 3]))
        return -1;
    }
    return e;
  }
  getLine() {
    let e = this.lineEndPos;
    return (typeof e != "number" || e !== -1 && e < this.pos) && (e = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = e), e === -1 ? this.atEnd ? this.buffer.substring(this.pos) : null : (this.buffer[e - 1] === "\r" && (e -= 1), this.buffer.substring(this.pos, e));
  }
  hasChars(e) {
    return this.pos + e <= this.buffer.length;
  }
  setNext(e) {
    return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = e, null;
  }
  peek(e) {
    return this.buffer.substr(this.pos, e);
  }
  *parseNext(e) {
    switch (e) {
      case "stream":
        return yield* this.parseStream();
      case "line-start":
        return yield* this.parseLineStart();
      case "block-start":
        return yield* this.parseBlockStart();
      case "doc":
        return yield* this.parseDocument();
      case "flow":
        return yield* this.parseFlowCollection();
      case "quoted-scalar":
        return yield* this.parseQuotedScalar();
      case "block-scalar":
        return yield* this.parseBlockScalar();
      case "plain-scalar":
        return yield* this.parsePlainScalar();
    }
  }
  *parseStream() {
    let e = this.getLine();
    if (e === null)
      return this.setNext("stream");
    if (e[0] === Pp && (yield* this.pushCount(1), e = e.substring(1)), e[0] === "%") {
      let r = e.length, n = e.indexOf("#");
      for (; n !== -1; ) {
        const i = e[n - 1];
        if (i === " " || i === "	") {
          r = n - 1;
          break;
        } else
          n = e.indexOf("#", n + 1);
      }
      for (; ; ) {
        const i = e[r - 1];
        if (i === " " || i === "	")
          r -= 1;
        else
          break;
      }
      const s = (yield* this.pushCount(r)) + (yield* this.pushSpaces(!0));
      return yield* this.pushCount(e.length - s), this.pushNewline(), "stream";
    }
    if (this.atLineEnd()) {
      const r = yield* this.pushSpaces(!0);
      return yield* this.pushCount(e.length - r), yield* this.pushNewline(), "stream";
    }
    return yield Lp, yield* this.parseLineStart();
  }
  *parseLineStart() {
    const e = this.charAt(0);
    if (!e && !this.atEnd)
      return this.setNext("line-start");
    if (e === "-" || e === ".") {
      if (!this.atEnd && !this.hasChars(4))
        return this.setNext("line-start");
      const r = this.peek(3);
      if ((r === "---" || r === "...") && Et(this.charAt(3)))
        return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, r === "---" ? "doc" : "stream";
    }
    return this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !Et(this.charAt(1)) && (this.indentNext = this.indentValue), yield* this.parseBlockStart();
  }
  *parseBlockStart() {
    const [e, r] = this.peek(2);
    if (!r && !this.atEnd)
      return this.setNext("block-start");
    if ((e === "-" || e === "?" || e === ":") && Et(r)) {
      const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
      return this.indentNext = this.indentValue + 1, this.indentValue += n, yield* this.parseBlockStart();
    }
    return "doc";
  }
  *parseDocument() {
    yield* this.pushSpaces(!0);
    const e = this.getLine();
    if (e === null)
      return this.setNext("doc");
    let r = yield* this.pushIndicators();
    switch (e[r]) {
      case "#":
        yield* this.pushCount(e.length - r);
      // fallthrough
      case void 0:
        return yield* this.pushNewline(), yield* this.parseLineStart();
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), "doc";
      case "*":
        return yield* this.pushUntil(ma), "doc";
      case '"':
      case "'":
        return yield* this.parseQuotedScalar();
      case "|":
      case ">":
        return r += yield* this.parseBlockScalarHeader(), r += yield* this.pushSpaces(!0), yield* this.pushCount(e.length - r), yield* this.pushNewline(), yield* this.parseBlockScalar();
      default:
        return yield* this.parsePlainScalar();
    }
  }
  *parseFlowCollection() {
    let e, r, n = -1;
    do
      e = yield* this.pushNewline(), e > 0 ? (r = yield* this.pushSpaces(!1), this.indentValue = n = r) : r = 0, r += yield* this.pushSpaces(!0);
    while (e + r > 0);
    const s = this.getLine();
    if (s === null)
      return this.setNext("flow");
    if ((n !== -1 && n < this.indentNext && s[0] !== "#" || n === 0 && (s.startsWith("---") || s.startsWith("...")) && Et(s[3])) && !(n === this.indentNext - 1 && this.flowLevel === 1 && (s[0] === "]" || s[0] === "}")))
      return this.flowLevel = 0, yield Rp, yield* this.parseLineStart();
    let i = 0;
    for (; s[i] === ","; )
      i += yield* this.pushCount(1), i += yield* this.pushSpaces(!0), this.flowKey = !1;
    switch (i += yield* this.pushIndicators(), s[i]) {
      case void 0:
        return "flow";
      case "#":
        return yield* this.pushCount(s.length - i), "flow";
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
      case "*":
        return yield* this.pushUntil(ma), "flow";
      case '"':
      case "'":
        return this.flowKey = !0, yield* this.parseQuotedScalar();
      case ":": {
        const o = this.charAt(1);
        if (this.flowKey || Et(o) || o === ",")
          return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
      }
      // fallthrough
      default:
        return this.flowKey = !1, yield* this.parsePlainScalar();
    }
  }
  *parseQuotedScalar() {
    const e = this.charAt(0);
    let r = this.buffer.indexOf(e, this.pos + 1);
    if (e === "'")
      for (; r !== -1 && this.buffer[r + 1] === "'"; )
        r = this.buffer.indexOf("'", r + 2);
    else
      for (; r !== -1; ) {
        let i = 0;
        for (; this.buffer[r - 1 - i] === "\\"; )
          i += 1;
        if (i % 2 === 0)
          break;
        r = this.buffer.indexOf('"', r + 1);
      }
    const n = this.buffer.substring(0, r);
    let s = n.indexOf(`
`, this.pos);
    if (s !== -1) {
      for (; s !== -1; ) {
        const i = this.continueScalar(s + 1);
        if (i === -1)
          break;
        s = n.indexOf(`
`, i);
      }
      s !== -1 && (r = s - (n[s - 1] === "\r" ? 2 : 1));
    }
    if (r === -1) {
      if (!this.atEnd)
        return this.setNext("quoted-scalar");
      r = this.buffer.length;
    }
    return yield* this.pushToIndex(r + 1, !1), this.flowLevel ? "flow" : "doc";
  }
  *parseBlockScalarHeader() {
    this.blockScalarIndent = -1, this.blockScalarKeep = !1;
    let e = this.pos;
    for (; ; ) {
      const r = this.buffer[++e];
      if (r === "+")
        this.blockScalarKeep = !0;
      else if (r > "0" && r <= "9")
        this.blockScalarIndent = Number(r) - 1;
      else if (r !== "-")
        break;
    }
    return yield* this.pushUntil((r) => Et(r) || r === "#");
  }
  *parseBlockScalar() {
    let e = this.pos - 1, r = 0, n;
    e: for (let i = this.pos; n = this.buffer[i]; ++i)
      switch (n) {
        case " ":
          r += 1;
          break;
        case `
`:
          e = i, r = 0;
          break;
        case "\r": {
          const o = this.buffer[i + 1];
          if (!o && !this.atEnd)
            return this.setNext("block-scalar");
          if (o === `
`)
            break;
        }
        // fallthrough
        default:
          break e;
      }
    if (!n && !this.atEnd)
      return this.setNext("block-scalar");
    if (r >= this.indentNext) {
      this.blockScalarIndent === -1 ? this.indentNext = r : this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
      do {
        const i = this.continueScalar(e + 1);
        if (i === -1)
          break;
        e = this.buffer.indexOf(`
`, i);
      } while (e !== -1);
      if (e === -1) {
        if (!this.atEnd)
          return this.setNext("block-scalar");
        e = this.buffer.length;
      }
    }
    let s = e + 1;
    for (n = this.buffer[s]; n === " "; )
      n = this.buffer[++s];
    if (n === "	") {
      for (; n === "	" || n === " " || n === "\r" || n === `
`; )
        n = this.buffer[++s];
      e = s - 1;
    } else if (!this.blockScalarKeep)
      do {
        let i = e - 1, o = this.buffer[i];
        o === "\r" && (o = this.buffer[--i]);
        const a = i;
        for (; o === " "; )
          o = this.buffer[--i];
        if (o === `
` && i >= this.pos && i + 1 + r > a)
          e = i;
        else
          break;
      } while (!0);
    return yield el, yield* this.pushToIndex(e + 1, !0), yield* this.parseLineStart();
  }
  *parsePlainScalar() {
    const e = this.flowLevel > 0;
    let r = this.pos - 1, n = this.pos - 1, s;
    for (; s = this.buffer[++n]; )
      if (s === ":") {
        const i = this.buffer[n + 1];
        if (Et(i) || e && yi.has(i))
          break;
        r = n;
      } else if (Et(s)) {
        let i = this.buffer[n + 1];
        if (s === "\r" && (i === `
` ? (n += 1, s = `
`, i = this.buffer[n + 1]) : r = n), i === "#" || e && yi.has(i))
          break;
        if (s === `
`) {
          const o = this.continueScalar(n + 1);
          if (o === -1)
            break;
          n = Math.max(n, o - 2);
        }
      } else {
        if (e && yi.has(s))
          break;
        r = n;
      }
    return !s && !this.atEnd ? this.setNext("plain-scalar") : (yield el, yield* this.pushToIndex(r + 1, !0), e ? "flow" : "doc");
  }
  *pushCount(e) {
    return e > 0 ? (yield this.buffer.substr(this.pos, e), this.pos += e, e) : 0;
  }
  *pushToIndex(e, r) {
    const n = this.buffer.slice(this.pos, e);
    return n ? (yield n, this.pos += n.length, n.length) : (r && (yield ""), 0);
  }
  *pushIndicators() {
    switch (this.charAt(0)) {
      case "!":
        return (yield* this.pushTag()) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
      case "&":
        return (yield* this.pushUntil(ma)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
      case "-":
      // this is an error
      case "?":
      // this is an error outside flow collections
      case ":": {
        const e = this.flowLevel > 0, r = this.charAt(1);
        if (Et(r) || e && yi.has(r))
          return e ? this.flowKey && (this.flowKey = !1) : this.indentNext = this.indentValue + 1, (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0)) + (yield* this.pushIndicators());
      }
    }
    return 0;
  }
  *pushTag() {
    if (this.charAt(1) === "<") {
      let e = this.pos + 2, r = this.buffer[e];
      for (; !Et(r) && r !== ">"; )
        r = this.buffer[++e];
      return yield* this.pushToIndex(r === ">" ? e + 1 : e, !1);
    } else {
      let e = this.pos + 1, r = this.buffer[e];
      for (; r; )
        if (k_.has(r))
          r = this.buffer[++e];
        else if (r === "%" && Md.has(this.buffer[e + 1]) && Md.has(this.buffer[e + 2]))
          r = this.buffer[e += 3];
        else
          break;
      return yield* this.pushToIndex(e, !1);
    }
  }
  *pushNewline() {
    const e = this.buffer[this.pos];
    return e === `
` ? yield* this.pushCount(1) : e === "\r" && this.charAt(1) === `
` ? yield* this.pushCount(2) : 0;
  }
  *pushSpaces(e) {
    let r = this.pos - 1, n;
    do
      n = this.buffer[++r];
    while (n === " " || e && n === "	");
    const s = r - this.pos;
    return s > 0 && (yield this.buffer.substr(this.pos, s), this.pos = r), s;
  }
  *pushUntil(e) {
    let r = this.pos, n = this.buffer[r];
    for (; !e(n); )
      n = this.buffer[++r];
    return yield* this.pushToIndex(r, !1);
  }
}
class __ {
  constructor() {
    this.lineStarts = [], this.addNewLine = (e) => this.lineStarts.push(e), this.linePos = (e) => {
      let r = 0, n = this.lineStarts.length;
      for (; r < n; ) {
        const i = r + n >> 1;
        this.lineStarts[i] < e ? r = i + 1 : n = i;
      }
      if (this.lineStarts[r] === e)
        return { line: r + 1, col: 1 };
      if (r === 0)
        return { line: 0, col: e };
      const s = this.lineStarts[r - 1];
      return { line: r, col: e - s + 1 };
    };
  }
}
function sr(t, e) {
  for (let r = 0; r < t.length; ++r)
    if (t[r].type === e)
      return !0;
  return !1;
}
function Dd(t) {
  for (let e = 0; e < t.length; ++e)
    switch (t[e].type) {
      case "space":
      case "comment":
      case "newline":
        break;
      default:
        return e;
    }
  return -1;
}
function jp(t) {
  switch (t?.type) {
    case "alias":
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "flow-collection":
      return !0;
    default:
      return !1;
  }
}
function bi(t) {
  switch (t.type) {
    case "document":
      return t.start;
    case "block-map": {
      const e = t.items[t.items.length - 1];
      return e.sep ?? e.start;
    }
    case "block-seq":
      return t.items[t.items.length - 1].start;
    /* istanbul ignore next should not happen */
    default:
      return [];
  }
}
function zr(t) {
  if (t.length === 0)
    return [];
  let e = t.length;
  e: for (; --e >= 0; )
    switch (t[e].type) {
      case "doc-start":
      case "explicit-key-ind":
      case "map-value-ind":
      case "seq-item-ind":
      case "newline":
        break e;
    }
  for (; t[++e]?.type === "space"; )
    ;
  return t.splice(e, t.length);
}
function Bd(t) {
  if (t.start.type === "flow-seq-start")
    for (const e of t.items)
      e.sep && !e.value && !sr(e.start, "explicit-key-ind") && !sr(e.sep, "map-value-ind") && (e.key && (e.value = e.key), delete e.key, jp(e.value) ? e.value.end ? Array.prototype.push.apply(e.value.end, e.sep) : e.value.end = e.sep : Array.prototype.push.apply(e.start, e.sep), delete e.sep);
}
class E_ {
  /**
   * @param onNewLine - If defined, called separately with the start position of
   *   each new line (in `parse()`, including the start of input).
   */
  constructor(e) {
    this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new S_(), this.onNewLine = e;
  }
  /**
   * Parse `source` as a YAML stream.
   * If `incomplete`, a part of the last line may be left as a buffer for the next call.
   *
   * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
   *
   * @returns A generator of tokens representing each directive, document, and other structure.
   */
  *parse(e, r = !1) {
    this.onNewLine && this.offset === 0 && this.onNewLine(0);
    for (const n of this.lexer.lex(e, r))
      yield* this.next(n);
    r || (yield* this.end());
  }
  /**
   * Advance the parser by the `source` of one lexical token.
   */
  *next(e) {
    if (this.source = e, this.atScalar) {
      this.atScalar = !1, yield* this.step(), this.offset += e.length;
      return;
    }
    const r = w_(e);
    if (r)
      if (r === "scalar")
        this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
      else {
        switch (this.type = r, yield* this.step(), r) {
          case "newline":
            this.atNewLine = !0, this.indent = 0, this.onNewLine && this.onNewLine(this.offset + e.length);
            break;
          case "space":
            this.atNewLine && e[0] === " " && (this.indent += e.length);
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            this.atNewLine && (this.indent += e.length);
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = !1;
        }
        this.offset += e.length;
      }
    else {
      const n = `Not a YAML token: ${e}`;
      yield* this.pop({ type: "error", offset: this.offset, message: n, source: e }), this.offset += e.length;
    }
  }
  /** Call at end of input to push out any remaining constructions */
  *end() {
    for (; this.stack.length > 0; )
      yield* this.pop();
  }
  get sourceToken() {
    return {
      type: this.type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  *step() {
    const e = this.peek(1);
    if (this.type === "doc-end" && e?.type !== "doc-end") {
      for (; this.stack.length > 0; )
        yield* this.pop();
      this.stack.push({
        type: "doc-end",
        offset: this.offset,
        source: this.source
      });
      return;
    }
    if (!e)
      return yield* this.stream();
    switch (e.type) {
      case "document":
        return yield* this.document(e);
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return yield* this.scalar(e);
      case "block-scalar":
        return yield* this.blockScalar(e);
      case "block-map":
        return yield* this.blockMap(e);
      case "block-seq":
        return yield* this.blockSequence(e);
      case "flow-collection":
        return yield* this.flowCollection(e);
      case "doc-end":
        return yield* this.documentEnd(e);
    }
    yield* this.pop();
  }
  peek(e) {
    return this.stack[this.stack.length - e];
  }
  *pop(e) {
    const r = e ?? this.stack.pop();
    if (!r)
      yield { type: "error", offset: this.offset, source: "", message: "Tried to pop an empty stack" };
    else if (this.stack.length === 0)
      yield r;
    else {
      const n = this.peek(1);
      switch (r.type === "block-scalar" ? r.indent = "indent" in n ? n.indent : 0 : r.type === "flow-collection" && n.type === "document" && (r.indent = 0), r.type === "flow-collection" && Bd(r), n.type) {
        case "document":
          n.value = r;
          break;
        case "block-scalar":
          n.props.push(r);
          break;
        case "block-map": {
          const s = n.items[n.items.length - 1];
          if (s.value) {
            n.items.push({ start: [], key: r, sep: [] }), this.onKeyLine = !0;
            return;
          } else if (s.sep)
            s.value = r;
          else {
            Object.assign(s, { key: r, sep: [] }), this.onKeyLine = !s.explicitKey;
            return;
          }
          break;
        }
        case "block-seq": {
          const s = n.items[n.items.length - 1];
          s.value ? n.items.push({ start: [], value: r }) : s.value = r;
          break;
        }
        case "flow-collection": {
          const s = n.items[n.items.length - 1];
          !s || s.value ? n.items.push({ start: [], key: r, sep: [] }) : s.sep ? s.value = r : Object.assign(s, { key: r, sep: [] });
          return;
        }
        /* istanbul ignore next should not happen */
        default:
          yield* this.pop(), yield* this.pop(r);
      }
      if ((n.type === "document" || n.type === "block-map" || n.type === "block-seq") && (r.type === "block-map" || r.type === "block-seq")) {
        const s = r.items[r.items.length - 1];
        s && !s.sep && !s.value && s.start.length > 0 && Dd(s.start) === -1 && (r.indent === 0 || s.start.every((i) => i.type !== "comment" || i.indent < r.indent)) && (n.type === "document" ? n.end = s.start : n.items.push({ start: s.start }), r.items.splice(-1, 1));
      }
    }
  }
  *stream() {
    switch (this.type) {
      case "directive-line":
        yield { type: "directive", offset: this.offset, source: this.source };
        return;
      case "byte-order-mark":
      case "space":
      case "comment":
      case "newline":
        yield this.sourceToken;
        return;
      case "doc-mode":
      case "doc-start": {
        const e = {
          type: "document",
          offset: this.offset,
          start: []
        };
        this.type === "doc-start" && e.start.push(this.sourceToken), this.stack.push(e);
        return;
      }
    }
    yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML stream`,
      source: this.source
    };
  }
  *document(e) {
    if (e.value)
      return yield* this.lineEnd(e);
    switch (this.type) {
      case "doc-start": {
        Dd(e.start) !== -1 ? (yield* this.pop(), yield* this.step()) : e.start.push(this.sourceToken);
        return;
      }
      case "anchor":
      case "tag":
      case "space":
      case "comment":
      case "newline":
        e.start.push(this.sourceToken);
        return;
    }
    const r = this.startBlockValue(e);
    r ? this.stack.push(r) : yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML document`,
      source: this.source
    };
  }
  *scalar(e) {
    if (this.type === "map-value-ind") {
      const r = bi(this.peek(2)), n = zr(r);
      let s;
      e.end ? (s = e.end, s.push(this.sourceToken), delete e.end) : s = [this.sourceToken];
      const i = {
        type: "block-map",
        offset: e.offset,
        indent: e.indent,
        items: [{ start: n, key: e, sep: s }]
      };
      this.onKeyLine = !0, this.stack[this.stack.length - 1] = i;
    } else
      yield* this.lineEnd(e);
  }
  *blockScalar(e) {
    switch (this.type) {
      case "space":
      case "comment":
      case "newline":
        e.props.push(this.sourceToken);
        return;
      case "scalar":
        if (e.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
          let r = this.source.indexOf(`
`) + 1;
          for (; r !== 0; )
            this.onNewLine(this.offset + r), r = this.source.indexOf(`
`, r) + 1;
        }
        yield* this.pop();
        break;
      /* istanbul ignore next should not happen */
      default:
        yield* this.pop(), yield* this.step();
    }
  }
  *blockMap(e) {
    const r = e.items[e.items.length - 1];
    switch (this.type) {
      case "newline":
        if (this.onKeyLine = !1, r.value) {
          const n = "end" in r.value ? r.value.end : void 0;
          (Array.isArray(n) ? n[n.length - 1] : void 0)?.type === "comment" ? n?.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
        } else r.sep ? r.sep.push(this.sourceToken) : r.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (r.value)
          e.items.push({ start: [this.sourceToken] });
        else if (r.sep)
          r.sep.push(this.sourceToken);
        else {
          if (this.atIndentedComment(r.start, e.indent)) {
            const n = e.items[e.items.length - 2]?.value?.end;
            if (Array.isArray(n)) {
              Array.prototype.push.apply(n, r.start), n.push(this.sourceToken), e.items.pop();
              return;
            }
          }
          r.start.push(this.sourceToken);
        }
        return;
    }
    if (this.indent >= e.indent) {
      const n = !this.onKeyLine && this.indent === e.indent, s = n && (r.sep || r.explicitKey) && this.type !== "seq-item-ind";
      let i = [];
      if (s && r.sep && !r.value) {
        const o = [];
        for (let a = 0; a < r.sep.length; ++a) {
          const l = r.sep[a];
          switch (l.type) {
            case "newline":
              o.push(a);
              break;
            case "space":
              break;
            case "comment":
              l.indent > e.indent && (o.length = 0);
              break;
            default:
              o.length = 0;
          }
        }
        o.length >= 2 && (i = r.sep.splice(o[1]));
      }
      switch (this.type) {
        case "anchor":
        case "tag":
          s || r.value ? (i.push(this.sourceToken), e.items.push({ start: i }), this.onKeyLine = !0) : r.sep ? r.sep.push(this.sourceToken) : r.start.push(this.sourceToken);
          return;
        case "explicit-key-ind":
          !r.sep && !r.explicitKey ? (r.start.push(this.sourceToken), r.explicitKey = !0) : s || r.value ? (i.push(this.sourceToken), e.items.push({ start: i, explicitKey: !0 })) : this.stack.push({
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken], explicitKey: !0 }]
          }), this.onKeyLine = !0;
          return;
        case "map-value-ind":
          if (r.explicitKey)
            if (r.sep)
              if (r.value)
                e.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (sr(r.sep, "map-value-ind"))
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: i, key: null, sep: [this.sourceToken] }]
                });
              else if (jp(r.key) && !sr(r.sep, "newline")) {
                const o = zr(r.start), a = r.key, l = r.sep;
                l.push(this.sourceToken), delete r.key, delete r.sep, this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: o, key: a, sep: l }]
                });
              } else i.length > 0 ? r.sep = r.sep.concat(i, this.sourceToken) : r.sep.push(this.sourceToken);
            else if (sr(r.start, "newline"))
              Object.assign(r, { key: null, sep: [this.sourceToken] });
            else {
              const o = zr(r.start);
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: o, key: null, sep: [this.sourceToken] }]
              });
            }
          else
            r.sep ? r.value || s ? e.items.push({ start: i, key: null, sep: [this.sourceToken] }) : sr(r.sep, "map-value-ind") ? this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [], key: null, sep: [this.sourceToken] }]
            }) : r.sep.push(this.sourceToken) : Object.assign(r, { key: null, sep: [this.sourceToken] });
          this.onKeyLine = !0;
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const o = this.flowScalar(this.type);
          s || r.value ? (e.items.push({ start: i, key: o, sep: [] }), this.onKeyLine = !0) : r.sep ? this.stack.push(o) : (Object.assign(r, { key: o, sep: [] }), this.onKeyLine = !0);
          return;
        }
        default: {
          const o = this.startBlockValue(e);
          if (o) {
            if (o.type === "block-seq") {
              if (!r.explicitKey && r.sep && !sr(r.sep, "newline")) {
                yield* this.pop({
                  type: "error",
                  offset: this.offset,
                  message: "Unexpected block-seq-ind on same line with key",
                  source: this.source
                });
                return;
              }
            } else n && e.items.push({ start: i });
            this.stack.push(o);
            return;
          }
        }
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *blockSequence(e) {
    const r = e.items[e.items.length - 1];
    switch (this.type) {
      case "newline":
        if (r.value) {
          const n = "end" in r.value ? r.value.end : void 0;
          (Array.isArray(n) ? n[n.length - 1] : void 0)?.type === "comment" ? n?.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
        } else
          r.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (r.value)
          e.items.push({ start: [this.sourceToken] });
        else {
          if (this.atIndentedComment(r.start, e.indent)) {
            const n = e.items[e.items.length - 2]?.value?.end;
            if (Array.isArray(n)) {
              Array.prototype.push.apply(n, r.start), n.push(this.sourceToken), e.items.pop();
              return;
            }
          }
          r.start.push(this.sourceToken);
        }
        return;
      case "anchor":
      case "tag":
        if (r.value || this.indent <= e.indent)
          break;
        r.start.push(this.sourceToken);
        return;
      case "seq-item-ind":
        if (this.indent !== e.indent)
          break;
        r.value || sr(r.start, "seq-item-ind") ? e.items.push({ start: [this.sourceToken] }) : r.start.push(this.sourceToken);
        return;
    }
    if (this.indent > e.indent) {
      const n = this.startBlockValue(e);
      if (n) {
        this.stack.push(n);
        return;
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *flowCollection(e) {
    const r = e.items[e.items.length - 1];
    if (this.type === "flow-error-end") {
      let n;
      do
        yield* this.pop(), n = this.peek(1);
      while (n?.type === "flow-collection");
    } else if (e.end.length === 0) {
      switch (this.type) {
        case "comma":
        case "explicit-key-ind":
          !r || r.sep ? e.items.push({ start: [this.sourceToken] }) : r.start.push(this.sourceToken);
          return;
        case "map-value-ind":
          !r || r.value ? e.items.push({ start: [], key: null, sep: [this.sourceToken] }) : r.sep ? r.sep.push(this.sourceToken) : Object.assign(r, { key: null, sep: [this.sourceToken] });
          return;
        case "space":
        case "comment":
        case "newline":
        case "anchor":
        case "tag":
          !r || r.value ? e.items.push({ start: [this.sourceToken] }) : r.sep ? r.sep.push(this.sourceToken) : r.start.push(this.sourceToken);
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const s = this.flowScalar(this.type);
          !r || r.value ? e.items.push({ start: [], key: s, sep: [] }) : r.sep ? this.stack.push(s) : Object.assign(r, { key: s, sep: [] });
          return;
        }
        case "flow-map-end":
        case "flow-seq-end":
          e.end.push(this.sourceToken);
          return;
      }
      const n = this.startBlockValue(e);
      n ? this.stack.push(n) : (yield* this.pop(), yield* this.step());
    } else {
      const n = this.peek(2);
      if (n.type === "block-map" && (this.type === "map-value-ind" && n.indent === e.indent || this.type === "newline" && !n.items[n.items.length - 1].sep))
        yield* this.pop(), yield* this.step();
      else if (this.type === "map-value-ind" && n.type !== "flow-collection") {
        const s = bi(n), i = zr(s);
        Bd(e);
        const o = e.end.splice(1, e.end.length);
        o.push(this.sourceToken);
        const a = {
          type: "block-map",
          offset: e.offset,
          indent: e.indent,
          items: [{ start: i, key: e, sep: o }]
        };
        this.onKeyLine = !0, this.stack[this.stack.length - 1] = a;
      } else
        yield* this.lineEnd(e);
    }
  }
  flowScalar(e) {
    if (this.onNewLine) {
      let r = this.source.indexOf(`
`) + 1;
      for (; r !== 0; )
        this.onNewLine(this.offset + r), r = this.source.indexOf(`
`, r) + 1;
    }
    return {
      type: e,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  startBlockValue(e) {
    switch (this.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return this.flowScalar(this.type);
      case "block-scalar-header":
        return {
          type: "block-scalar",
          offset: this.offset,
          indent: this.indent,
          props: [this.sourceToken],
          source: ""
        };
      case "flow-map-start":
      case "flow-seq-start":
        return {
          type: "flow-collection",
          offset: this.offset,
          indent: this.indent,
          start: this.sourceToken,
          items: [],
          end: []
        };
      case "seq-item-ind":
        return {
          type: "block-seq",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: [this.sourceToken] }]
        };
      case "explicit-key-ind": {
        this.onKeyLine = !0;
        const r = bi(e), n = zr(r);
        return n.push(this.sourceToken), {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: n, explicitKey: !0 }]
        };
      }
      case "map-value-ind": {
        this.onKeyLine = !0;
        const r = bi(e), n = zr(r);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: n, key: null, sep: [this.sourceToken] }]
        };
      }
    }
    return null;
  }
  atIndentedComment(e, r) {
    return this.type !== "comment" || this.indent <= r ? !1 : e.every((n) => n.type === "newline" || n.type === "space");
  }
  *documentEnd(e) {
    this.type !== "doc-mode" && (e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop()));
  }
  *lineEnd(e) {
    switch (this.type) {
      case "comma":
      case "doc-start":
      case "doc-end":
      case "flow-seq-end":
      case "flow-map-end":
      case "map-value-ind":
        yield* this.pop(), yield* this.step();
        break;
      case "newline":
        this.onKeyLine = !1;
      default:
        e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop());
    }
  }
}
function $_(t) {
  const e = t.prettyErrors !== !1;
  return { lineCounter: t.lineCounter || e && new __() || null, prettyErrors: e };
}
function A_(t, e = {}) {
  const { lineCounter: r, prettyErrors: n } = $_(e), s = new E_(r?.addNewLine), i = new v_(e);
  let o = null;
  for (const a of i.compose(s.parse(t), !0, t.length))
    if (!o)
      o = a;
    else if (o.options.logLevel !== "silent") {
      o.errors.push(new Dn(a.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
      break;
    }
  return n && r && (o.errors.forEach(Ld(t, r)), o.warnings.forEach(Ld(t, r))), o;
}
function qd(t, e, r) {
  let n;
  const s = A_(t, r);
  if (!s)
    return null;
  if (s.warnings.forEach((i) => cp(s.options.logLevel, i)), s.errors.length > 0) {
    if (s.options.logLevel !== "silent")
      throw s.errors[0];
    s.errors = [];
  }
  return s.toJS(Object.assign({ reviver: n }, r));
}
var T_ = /* @__PURE__ */ M('<div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-800/30"><p class="text-sm text-red-600 dark:text-red-400">'), O_ = /* @__PURE__ */ M('<div class="flex flex-col items-center justify-center min-h-screen p-8"><div class="glass-card rounded-4xl p-10 max-w-lg w-full"><div class="flex flex-col items-center mb-8"><div class="relative inline-flex mb-6"><div class="w-20 h-20 rounded-3xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/25"><svg class="w-10 h-10 text-white"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=1.5 d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div><div class="absolute -inset-2 rounded-3xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-15 blur-2xl -z-10"></div></div><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">WTI</h1><p class="text-gray-500 dark:text-gray-400"></p></div><div class="divider-glass my-6"></div><div class=space-y-4><div><label for=spec-url class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"></label><div class="flex gap-2"></div></div><div class="flex items-center gap-4 my-6"><div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div><span class="text-sm text-gray-400 dark:text-gray-500"></span><div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div></div><div><span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"></span><label><input type=file accept=.json,.yaml,.yml class=sr-only><div class="flex flex-col items-center gap-4 relative z-10"><div><svg class="w-8 h-8"fill=none viewBox="0 0 24 24"stroke=currentColor aria-hidden=true><path stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg></div><div><p class="text-base font-medium text-gray-700 dark:text-gray-200"><span class="text-blue-600 dark:text-blue-400 font-bold hover:underline"></span> </p><p class="text-sm text-gray-500 dark:text-gray-400 mt-2"></p></div></div><div class="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div></label></div></div><div class="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"><p class="text-xs text-gray-400 dark:text-gray-500 mb-3"></p><div class="flex flex-wrap gap-2"><button type=button class="px-3 py-1.5 text-xs rounded-lg glass-button text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Petstore API</button><button type=button class="px-3 py-1.5 text-xs rounded-lg glass-button text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">APIs.guru');
const C_ = (t) => {
  const {
    t: e
  } = Ce(), [r, n] = Q(""), [s, i] = Q(!1), [o, a] = Q(null), [l, c] = Q(!1);
  let d;
  const u = async () => {
    const h = r().trim();
    if (!h) {
      a(e("specLoader.urlRequired"));
      return;
    }
    i(!0), a(null);
    try {
      await t.store.actions.loadSpec({
        type: "openapi",
        url: h
      });
    } catch (y) {
      a(y instanceof Error ? y.message : e("specLoader.loadFailed"));
    } finally {
      i(!1);
    }
  }, f = async (h) => {
    if (!h)
      return;
    const y = ["application/json", "application/x-yaml", "text/yaml", "text/plain"], k = [".json", ".yaml", ".yml"].some((v) => h.name.toLowerCase().endsWith(v));
    if (!y.includes(h.type) && !k) {
      a(e("specLoader.invalidFileType"));
      return;
    }
    i(!0), a(null);
    try {
      const v = await h.text(), x = v.trim();
      let S;
      if (x.startsWith("{") || x.startsWith("["))
        try {
          S = JSON.parse(v);
        } catch {
          S = qd(v);
        }
      else
        S = qd(v);
      await t.store.actions.loadSpec({
        type: "openapi",
        spec: S
      });
    } catch (v) {
      a(v instanceof Error ? v.message : e("specLoader.loadFailed"));
    } finally {
      i(!1);
    }
  }, p = (h) => {
    const y = h.target;
    if (!(y instanceof HTMLInputElement))
      return;
    const k = y.files?.[0];
    k && f(k), y.value = "";
  }, b = (h) => {
    h.preventDefault(), h.stopPropagation(), c(!0);
  }, g = (h) => {
    h.preventDefault(), h.stopPropagation(), c(!1);
  }, m = (h) => {
    h.preventDefault(), h.stopPropagation(), c(!1);
    const y = h.dataTransfer?.files[0];
    y && f(y);
  }, w = (h) => {
    h.key === "Enter" && u();
  };
  return (() => {
    var h = O_(), y = h.firstChild, k = y.firstChild, v = k.firstChild, x = v.nextSibling, S = x.nextSibling, _ = k.nextSibling, T = _.nextSibling, P = T.firstChild, R = P.firstChild, D = R.nextSibling, U = P.nextSibling, Y = U.firstChild, se = Y.nextSibling, be = U.nextSibling, xe = be.firstChild, W = xe.nextSibling, ce = W.firstChild, K = ce.nextSibling, I = K.firstChild, F = I.nextSibling, L = F.firstChild, E = L.firstChild;
    E.nextSibling;
    var O = L.nextSibling, B = T.nextSibling, V = B.firstChild, J = V.nextSibling, ie = J.firstChild, ne = ie.nextSibling;
    $(S, () => e("specLoader.subtitle")), $(R, () => e("specLoader.loadFromUrl")), $(D, A(Ot, {
      id: "spec-url",
      get value() {
        return r();
      },
      onInput: n,
      onKeyDown: w,
      placeholder: "https://api.example.com/openapi.json",
      class: "flex-1"
    }), null), $(D, A(Er, {
      onClick: u,
      get disabled() {
        return s();
      },
      get children() {
        return Oe(() => !!s())() ? e("specLoader.loading") : e("specLoader.load");
      }
    }), null), $(se, () => e("specLoader.or")), $(xe, () => e("specLoader.uploadFile")), W.addEventListener("drop", m), W.addEventListener("dragleave", g), W.addEventListener("dragover", b), ce.addEventListener("change", p);
    var N = d;
    return typeof N == "function" ? rn(N, ce) : d = ce, $(E, () => e("specLoader.clickToUpload")), $(L, () => e("specLoader.orDragDrop"), null), $(O, () => e("specLoader.supportedFormats")), $(y, A(z, {
      get when() {
        return o();
      },
      get children() {
        var j = T_(), q = j.firstChild;
        return $(q, o), j;
      }
    }), B), $(V, () => e("specLoader.tryExample")), ie.$$click = () => n("https://petstore3.swagger.io/api/v3/openapi.json"), ne.$$click = () => n("https://api.apis.guru/v2/openapi.yaml"), ee((j) => {
      var q = `relative rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer overflow-hidden group border-2 block ${l() ? "border-blue-500 bg-blue-500/10 scale-[1.02] shadow-xl shadow-blue-500/20" : "border-dashed border-gray-300/50 dark:border-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50/50 dark:hover:bg-white/5"}`, H = `w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${l() ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110" : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-gray-700 shadow-sm"}`;
      return q !== j.e && te(W, j.e = q), H !== j.t && te(I, j.t = H), j;
    }, {
      e: void 0,
      t: void 0
    }), h;
  })();
};
Ee(["click"]);
const N_ = {
  spec: null,
  loading: !1,
  error: null,
  selectedOperation: null,
  selectedServer: null,
  serverVariables: {},
  searchQuery: "",
  expandedTags: /* @__PURE__ */ new Set()
};
function Fd(t) {
  if (!t?.variables)
    return {};
  const e = {};
  for (const [r, n] of Object.entries(t.variables))
    e[r] = n.default;
  return e;
}
function I_() {
  const [t, e] = wl(N_), r = pe(() => t.spec ? xh(t.spec.operations) : null), n = {
    setSpec(s) {
      const i = s.servers[0] || null;
      e({
        spec: s,
        loading: !1,
        error: null,
        selectedServer: i,
        serverVariables: Fd(i)
      }), n.expandAllTags();
    },
    setLoading(s) {
      e({ loading: s });
    },
    setError(s) {
      e({ error: s, loading: !1 });
    },
    clearError() {
      e({ error: null });
    },
    selectOperation(s) {
      if (e({ selectedOperation: s }), s) {
        const i = t.selectedServer && t.spec?.servers ? t.spec.servers.indexOf(t.selectedServer) : 0;
        td({ operationId: s.id, serverIndex: i });
      } else
        fv();
    },
    /**
     * Select an operation by its ID
     * Returns true if operation was found and selected
     */
    selectOperationById(s) {
      const i = t.spec?.operations.find((o) => o.id === s);
      return i ? (this.selectOperation(i), !0) : !1;
    },
    selectServer(s) {
      if (e({
        selectedServer: s,
        serverVariables: Fd(s)
      }), t.selectedOperation) {
        const i = t.spec?.servers.indexOf(s) ?? 0;
        td({ operationId: t.selectedOperation.id, serverIndex: i });
      }
    },
    /**
     * Set a server variable value
     */
    setServerVariable(s, i) {
      e("serverVariables", s, i);
    },
    /**
     * Select a server by its index
     */
    selectServerByIndex(s) {
      const i = t.spec?.servers[s];
      return i ? (this.selectServer(i), !0) : !1;
    },
    setSearchQuery(s) {
      e({ searchQuery: s });
    },
    toggleTag(s) {
      const i = new Set(t.expandedTags);
      i.has(s) ? i.delete(s) : i.add(s), e({ expandedTags: i });
    },
    expandAllTags() {
      if (t.spec) {
        const s = /* @__PURE__ */ new Set();
        for (const i of t.spec.tags)
          s.add(i.name);
        for (const i of t.spec.operations)
          for (const o of i.tags)
            s.add(o);
        e({ expandedTags: s });
      }
    },
    collapseAllTags() {
      e({ expandedTags: /* @__PURE__ */ new Set() });
    },
    async loadSpec(s) {
      e({ loading: !0, error: null });
      try {
        if (s.type === "openapi") {
          const i = await Zg(s);
          n.setSpec(i.spec);
        } else if (s.type === "grpc")
          throw new Error("gRPC support not yet implemented");
      } catch (i) {
        e({
          error: i instanceof Error ? i.message : "Failed to load spec",
          loading: !1
        });
      }
    }
  };
  return { state: t, actions: n, search: {
    /** Get the memoized Fuse instance (for advanced use cases) */
    getFuse: () => r(),
    /** Search operations with the given query */
    searchOperations: (s, i = 50) => {
      const o = r();
      return o ? Sh(o, s, i) : [];
    }
  } };
}
const Ud = /* @__PURE__ */ new Map(), P_ = 300 * 1e3, tl = "wti-oidc-state";
function Mp(t) {
  const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", r = crypto.getRandomValues(new Uint8Array(t));
  return Array.from(r).map((n) => e[n % e.length]).join("");
}
function L_() {
  return Mp(64);
}
async function R_(t) {
  const e = new TextEncoder().encode(t), r = await crypto.subtle.digest("SHA-256", e);
  return btoa(String.fromCharCode(...new Uint8Array(r))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function Dp(t) {
  const e = Ud.get(t);
  if (e && Date.now() - e.fetchedAt < P_)
    return e;
  const r = `${t.replace(/\/$/, "")}/.well-known/openid-configuration`, n = await fetch(r);
  if (!n.ok)
    throw new Error(`Failed to fetch OIDC discovery document: ${n.status}`);
  const s = await n.json();
  if (!s.authorization_endpoint || !s.token_endpoint)
    throw new Error("OIDC discovery document missing required endpoints");
  const i = {
    authorizationEndpoint: s.authorization_endpoint,
    tokenEndpoint: s.token_endpoint,
    fetchedAt: Date.now()
  };
  return Ud.set(t, i), i;
}
async function Bp(t) {
  return (await Dp(t)).tokenEndpoint;
}
function j_(t) {
  sessionStorage.setItem(tl, JSON.stringify(t));
}
function M_() {
  const t = sessionStorage.getItem(tl);
  if (!t)
    return null;
  sessionStorage.removeItem(tl);
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}
function qp(t, e) {
  if (!t || typeof t != "object")
    throw new Error(`${e}: Invalid response - expected object`);
  const r = t;
  if (typeof r.access_token != "string" || !r.access_token)
    throw new Error(`${e}: Missing or invalid access_token in response`);
  if (r.refresh_token !== void 0 && typeof r.refresh_token != "string")
    throw new Error(`${e}: Invalid refresh_token type in response`);
  if (r.id_token !== void 0 && typeof r.id_token != "string")
    throw new Error(`${e}: Invalid id_token type in response`);
  if (r.expires_in !== void 0 && typeof r.expires_in != "number")
    throw new Error(`${e}: Invalid expires_in type in response`);
}
async function D_(t) {
  if (!t.refreshToken)
    throw new Error("No refresh token available");
  const e = await Bp(t.issuerUrl), r = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: t.refreshToken,
    client_id: t.clientId
  });
  t.clientSecret && r.set("client_secret", t.clientSecret);
  const n = await fetch(e, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: r.toString()
  });
  if (!n.ok) {
    const i = await n.text();
    throw new Error(`Token refresh failed: ${n.status} - ${i}`);
  }
  const s = await n.json();
  return qp(s, "Token refresh"), {
    accessToken: s.access_token,
    refreshToken: s.refresh_token || t.refreshToken,
    // Keep old refresh token if not rotated
    expiresAt: s.expires_in ? Date.now() + s.expires_in * 1e3 : void 0,
    idToken: s.id_token
  };
}
async function B_(t) {
  const e = await Bp(t.issuerUrl), r = new URLSearchParams({
    grant_type: "authorization_code",
    code: t.code,
    redirect_uri: t.redirectUri,
    client_id: t.clientId,
    code_verifier: t.codeVerifier
  });
  t.clientSecret && r.set("client_secret", t.clientSecret);
  const n = await fetch(e, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: r.toString()
  });
  if (!n.ok) {
    const i = await n.text();
    throw new Error(`Token exchange failed: ${i}`);
  }
  const s = await n.json();
  return qp(s, "Token exchange"), {
    accessToken: s.access_token,
    refreshToken: s.refresh_token,
    idToken: s.id_token,
    expiresAt: s.expires_in ? Date.now() + s.expires_in * 1e3 : void 0,
    tokenType: s.token_type || "Bearer"
  };
}
function q_(t) {
  const e = new URL(t.authorizationEndpoint);
  return e.searchParams.set("response_type", "code"), e.searchParams.set("client_id", t.clientId), e.searchParams.set("redirect_uri", t.redirectUri), e.searchParams.set("scope", t.scopes.join(" ")), e.searchParams.set("state", t.state), e.searchParams.set("code_challenge", t.codeChallenge), e.searchParams.set("code_challenge_method", "S256"), e.toString();
}
const Kd = "auth", zd = "state", Vd = 60 * 1e3, F_ = 30 * 1e3, U_ = {
  configs: {},
  activeScheme: null
};
function K_() {
  const [t, e] = wl(U_), [r, n] = Q(!1), [s, i] = Q(!1), [o, a] = Q(null), [l, c] = Q(null), d = async () => {
    const u = on(t);
    await Ke.set(Kd, zd, {
      configs: u.configs,
      activeScheme: u.activeScheme
    });
  };
  return { state: t, actions: {
    /**
     * Initialize store by loading from IndexedDB
     */
    async init() {
      if (!s()) {
        n(!0);
        try {
          const u = await Ke.get(Kd, zd);
          u && e({
            configs: u.configs || {},
            activeScheme: u.activeScheme || null
          });
        } catch (u) {
          console.warn("Failed to load auth state from storage:", u);
        } finally {
          n(!1), i(!0);
        }
      }
    },
    /**
     * Check if store is loading
     */
    isLoading() {
      return r();
    },
    /**
     * Check if store is initialized
     */
    isInitialized() {
      return s();
    },
    /**
     * Get the current error
     */
    getError() {
      return o();
    },
    /**
     * Clear the current error
     */
    clearError() {
      a(null);
    },
    /**
     * Check if refresh is in cooldown period after a failed attempt
     */
    isRefreshInCooldown() {
      const u = l();
      return u ? Date.now() - u < F_ : !1;
    },
    /**
     * Set API Key authentication
     */
    async setApiKey(u, f, p = "header") {
      e("configs", u, {
        type: "apiKey",
        name: u,
        in: p,
        value: f
      }), e("activeScheme", u), await d();
    },
    /**
     * Set Bearer token authentication
     */
    async setBearerToken(u, f = "Bearer") {
      const p = {
        type: "bearer",
        token: u,
        scheme: f
      }, b = "bearer";
      e("configs", b, p), e("activeScheme", b), await d();
    },
    /**
     * Set Basic authentication
     */
    async setBasicAuth(u, f) {
      const p = {
        type: "basic",
        username: u,
        password: f
      }, b = "basic";
      e("configs", b, p), e("activeScheme", b), await d();
    },
    /**
     * Set OAuth2 token authentication
     */
    async setOAuth2Token(u, f) {
      const p = {
        type: "oauth2",
        accessToken: u,
        refreshToken: f?.refreshToken,
        expiresAt: f?.expiresAt,
        tokenType: f?.tokenType || "Bearer",
        scopes: f?.scopes
      }, b = "oauth2";
      e("configs", b, p), e("activeScheme", b), await d();
    },
    /**
     * Set OpenID Connect authentication
     */
    async setOpenIdAuth(u, f, p) {
      const b = {
        type: "openid",
        issuerUrl: u,
        clientId: f,
        clientSecret: p?.clientSecret,
        scopes: p?.scopes,
        accessToken: p?.accessToken,
        refreshToken: p?.refreshToken,
        idToken: p?.idToken,
        expiresAt: p?.expiresAt,
        tokenType: p?.tokenType || "Bearer"
      }, g = "openid";
      e("configs", g, b), e("activeScheme", g), await d();
    },
    /**
     * Clear OpenID Connect authentication
     */
    async clearOpenIdAuth() {
      e("configs", "openid", void 0), t.activeScheme === "openid" && e("activeScheme", null), await d();
    },
    /**
     * Clear authentication for a specific scheme
     */
    async clearAuth(u) {
      u ? (e("configs", u, void 0), t.activeScheme === u && e("activeScheme", null)) : e({
        configs: {},
        activeScheme: null
      }), await d();
    },
    /**
     * Set the active auth scheme
     */
    async setActiveScheme(u) {
      e("activeScheme", u), await d();
    },
    /**
     * Get the currently active auth config
     */
    getActiveAuth() {
      if (t.activeScheme)
        return t.configs[t.activeScheme];
    },
    /**
     * Check if a specific auth type is configured
     */
    isConfigured(u) {
      return Object.values(t.configs).some((f) => f?.type === u);
    },
    /**
     * Get auth config by type
     */
    getAuthByType(u) {
      return Object.values(t.configs).find((f) => f?.type === u);
    },
    /**
     * Check if OpenID token is expiring soon or already expired
     */
    isOpenIdTokenExpiringSoon() {
      const u = t.configs.openid;
      return u?.expiresAt ? Date.now() >= u.expiresAt - Vd : !1;
    },
    /**
     * Refresh OpenID Connect tokens
     * @returns true if refresh was successful, false otherwise
     */
    async refreshOpenIdAuth() {
      const u = t.configs.openid;
      if (!u || u.type !== "openid" || !u.refreshToken)
        return !1;
      try {
        const f = await D_(u);
        return e("configs", "openid", {
          ...u,
          accessToken: f.accessToken,
          refreshToken: f.refreshToken,
          expiresAt: f.expiresAt,
          idToken: f.idToken || u.idToken
        }), await d(), c(null), !0;
      } catch (f) {
        return console.error("Failed to refresh OpenID tokens:", f), c(Date.now()), !1;
      }
    },
    /**
     * Get active auth config, automatically refreshing OpenID tokens if needed
     * Use this before making API requests to ensure valid tokens
     * @returns AuthConfig if valid, undefined if no auth or token is expired and refresh failed
     */
    async getActiveAuthWithAutoRefresh() {
      if (!t.activeScheme)
        return;
      const u = t.configs[t.activeScheme];
      if (u) {
        if (u.type === "openid" && u.refreshToken && u.expiresAt) {
          const f = Date.now(), p = f >= u.expiresAt - Vd, b = f >= u.expiresAt;
          if (p && !this.isRefreshInCooldown()) {
            if (await this.refreshOpenIdAuth())
              return t.configs[t.activeScheme];
            if (b) {
              console.warn("OpenID token expired and refresh failed. Authentication invalid.");
              return;
            }
            console.warn(
              "OpenID token refresh failed but token not yet expired. Using existing token."
            );
          } else if (b)
            return;
        }
        return u;
      }
    },
    /**
     * Start OpenID Connect authorization flow with PKCE
     * Redirects the user to the OIDC provider's login page
     */
    async startOpenIdLogin(u, f, p) {
      const b = await Dp(u), g = L_(), m = await R_(g), w = Mp(32), h = p?.redirectUri || window.location.origin + window.location.pathname, y = {
        issuerUrl: u,
        clientId: f,
        clientSecret: p?.clientSecret,
        scopes: p?.scopes || ["openid", "profile", "email"],
        codeVerifier: g,
        redirectUri: h,
        state: w
      };
      j_(y);
      const k = q_({
        authorizationEndpoint: b.authorizationEndpoint,
        clientId: f,
        redirectUri: h,
        scopes: y.scopes,
        state: w,
        codeChallenge: m
      });
      window.location.href = k;
    },
    /**
     * Handle OpenID Connect callback after authorization
     * Call this when the page loads with authorization code in URL
     * Sets error state internally and auto-clears after 5 seconds
     * @returns true if callback was handled successfully
     */
    async handleOpenIdCallback() {
      const u = new URL(window.location.href), f = u.searchParams.get("code"), p = u.searchParams.get("state"), b = u.searchParams.get("error"), g = u.searchParams.get("error_description");
      let m;
      const w = (y) => {
        m && clearTimeout(m), a(y), m = setTimeout(() => a(null), 5e3);
      };
      if (!f && !b)
        return !1;
      if (b)
        return w(g || b), !1;
      const h = M_();
      if (!h)
        return w("Missing PKCE state - authorization flow may have expired"), !1;
      if (p !== h.state)
        return w("Invalid state parameter - possible CSRF attack"), !1;
      if (!f)
        return w("Missing authorization code"), !1;
      try {
        const y = await B_({
          issuerUrl: h.issuerUrl,
          clientId: h.clientId,
          clientSecret: h.clientSecret,
          code: f,
          redirectUri: h.redirectUri,
          codeVerifier: h.codeVerifier
        });
        return await this.setOpenIdAuth(h.issuerUrl, h.clientId, {
          clientSecret: h.clientSecret,
          scopes: h.scopes,
          accessToken: y.accessToken,
          refreshToken: y.refreshToken,
          idToken: y.idToken,
          expiresAt: y.expiresAt,
          tokenType: y.tokenType
        }), u.searchParams.delete("code"), u.searchParams.delete("state"), window.history.replaceState({}, "", u.toString()), !0;
      } catch (y) {
        return w(y instanceof Error ? y.message : "Token exchange failed"), !1;
      }
    },
    /**
     * Check if there's a pending OIDC callback to handle
     */
    hasPendingOidcCallback() {
      const u = new URL(window.location.href);
      return u.searchParams.has("code") || u.searchParams.has("error");
    }
  }, loading: r, initialized: s, error: o };
}
const We = "history", ga = 20, vi = 500;
function z_() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
function V_() {
  const [t, e] = wl({
    entries: []
  }), [r, n] = Q(!1), [s, i] = Q(!0), [o, a] = Q(0), [l, c] = Q(!1), d = async () => {
    if (!l()) {
      n(!0);
      try {
        const u = await Ke.count(We);
        a(u);
        const f = await Ke.getPage(We, {
          limit: ga,
          index: "by-timestamp",
          direction: "prev"
          // Most recent first
        });
        e("entries", f), i(f.length >= ga && f.length < u);
      } catch (u) {
        console.warn("Failed to load history from storage:", u);
      } finally {
        n(!1), c(!0);
      }
    }
  };
  return {
    state: t,
    actions: {
      init: d,
      loadMore: async () => {
        if (!(r() || !s())) {
          n(!0);
          try {
            const u = t.entries.length, f = await Ke.getPage(We, {
              limit: ga,
              offset: u,
              index: "by-timestamp",
              direction: "prev"
            });
            f.length > 0 && e("entries", (b) => [...b, ...f]);
            const p = await Ke.count(We);
            a(p), i(t.entries.length + f.length < p);
          } catch (u) {
            console.warn("Failed to load more history:", u);
          } finally {
            n(!1);
          }
        }
      },
      addEntry: async (u) => {
        const f = z_(), p = {
          ...u,
          id: f,
          timestamp: Date.now()
        };
        await Ke.set(We, f, p), e("entries", (g) => [p, ...g]), a((g) => g + 1);
        const b = await Ke.count(We);
        if (b > vi) {
          const g = await Ke.getPage(We, {
            limit: b - vi,
            index: "by-timestamp",
            direction: "next"
            // Oldest first
          });
          for (const m of g)
            await Ke.remove(We, m.id);
          a(vi);
        }
        return f;
      },
      updateEntry: async (u, f) => {
        const p = t.entries.findIndex((b) => b.id === u);
        if (p !== -1) {
          const b = { ...t.entries[p], ...f };
          e("entries", p, b), await Ke.set(We, u, b);
        } else {
          const b = await Ke.get(We, u);
          if (b) {
            const g = { ...b, ...f };
            await Ke.set(We, u, g);
          }
        }
      },
      removeEntry: async (u) => {
        e("entries", (f) => f.filter((p) => p.id !== u)), await Ke.remove(We, u), a((f) => Math.max(0, f - 1));
      },
      clearHistory: async () => {
        e("entries", []), await Ke.clear(We), a(0), i(!1);
      },
      getEntry: (u) => t.entries.find((f) => f.id === u),
      exportHistory: async () => {
        const u = await Ke.getAll(We);
        return u.sort((f, p) => p.timestamp - f.timestamp), JSON.stringify(u, null, 2);
      },
      importHistory: async (u) => {
        try {
          const f = JSON.parse(u);
          if (!Array.isArray(f) || !f.every(
            (b) => typeof b.id == "string" && typeof b.timestamp == "number" && typeof b.operationId == "string" && b.request
          ))
            return !1;
          await Ke.clear(We);
          const p = f.slice(0, vi);
          for (const b of p)
            await Ke.set(We, b.id, b);
          return c(!1), await d(), !0;
        } catch {
          return !1;
        }
      },
      isLoading: r,
      hasMore: s,
      getTotalCount: o
    },
    loading: r,
    hasMore: s,
    totalCount: o
  };
}
var H_ = /* @__PURE__ */ M('<div><div class="fixed inset-0 bg-mesh -z-10"></div><div class="fixed inset-0 pattern-dots -z-10">');
function J_(t) {
  return A(QS, {
    get initialTheme() {
      return t.theme;
    },
    get children() {
      return A(db, {
        get locale() {
          return t.locale ?? "en";
        },
        get children() {
          return A(f1, {
            get children() {
              return A(W_, {
                get className() {
                  return t.className;
                },
                get spec() {
                  return t.spec;
                }
              });
            }
          });
        }
      });
    }
  });
}
function W_(t) {
  const {
    theme: e
  } = Zh(), r = I_(), n = K_(), s = V_(), [i, o] = Q(!1), [a, l] = Q(void 0), c = () => e() === "dark" ? "dark" : "";
  Ar(async () => {
    await Promise.all([n.actions.init(), s.actions.init()]), n.actions.hasPendingOidcCallback() && await n.actions.handleOpenIdCallback();
  }), tt(() => {
    t.spec && r.actions.loadSpec(t.spec);
  }), tt(() => {
    if (r.state.spec && !r.state.selectedOperation) {
      const {
        operationId: u,
        serverIndex: f
      } = dv();
      u && (f !== void 0 && r.actions.selectServerByIndex(f), r.actions.selectOperationById(u));
    }
  });
  const d = (u) => {
    const f = r.state.spec?.operations.find((p) => p.id === u.operationId);
    f && u.requestValues && (l(u.requestValues), r.actions.selectOperation(f), o(!1));
  };
  return (() => {
    var u = H_(), f = u.firstChild;
    return f.nextSibling, $(u, A(d1, {
      get message() {
        return n.error();
      },
      title: "OpenID Login Failed"
    }), null), $(u, A(z, {
      get when() {
        return r.state.loading;
      },
      get children() {
        return A(l1, {});
      }
    }), null), $(u, A(z, {
      get when() {
        return r.state.error;
      },
      get children() {
        return A(c1, {
          get error() {
            return r.state.error;
          },
          onRetry: () => r.actions.clearError()
        });
      }
    }), null), $(u, A(z, {
      get when() {
        return r.state.spec;
      },
      get children() {
        return A(y1, {
          store: r,
          authStore: n,
          historyStore: s,
          onOpenHistory: () => o(!0),
          get replayValues() {
            return a();
          },
          onReplayValuesConsumed: () => l(void 0)
        });
      }
    }), null), $(u, A(nx, {
      store: s,
      get open() {
        return i();
      },
      onClose: () => o(!1),
      onOpen: () => o(!0),
      onReplay: d
    }), null), $(u, A(uv, {
      get operations() {
        return r.state.spec?.operations ?? [];
      },
      onSelectOperation: (p) => r.actions.selectOperation(p),
      get searchFn() {
        return r.search.searchOperations;
      }
    }), null), $(u, A(z, {
      get when() {
        return Oe(() => !r.state.spec && !r.state.loading)() && !r.state.error;
      },
      get children() {
        return A(C_, {
          store: r
        });
      }
    }), null), ee(() => te(u, `${c()} font-sans text-sm text-surface-900 dark:text-surface-50 min-h-screen w-full ${t.className ?? ""}`)), u;
  })();
}
function G_(t) {
  return Object.keys(t).reduce((r, n) => {
    const s = t[n];
    return r[n] = Object.assign({}, s), Up(s.value) && !eE(s.value) && !Array.isArray(s.value) && (r[n].value = Object.assign({}, s.value)), Array.isArray(s.value) && (r[n].value = s.value.slice(0)), r;
  }, {});
}
function Y_(t) {
  return t ? Object.keys(t).reduce((r, n) => {
    const s = t[n];
    return r[n] = Up(s) && "value" in s ? s : {
      value: s
    }, r[n].attribute || (r[n].attribute = Z_(n)), r[n].parse = "parse" in r[n] ? r[n].parse : typeof r[n].value != "string", r;
  }, {}) : {};
}
function Q_(t) {
  return Object.keys(t).reduce((r, n) => (r[n] = t[n].value, r), {});
}
function X_(t, e) {
  const r = G_(e);
  return Object.keys(e).forEach((s) => {
    const i = r[s], o = t.getAttribute(i.attribute), a = t[s];
    o != null && (i.value = i.parse ? Fp(o) : o), a != null && (i.value = Array.isArray(a) ? a.slice(0) : a), i.reflect && Hd(t, i.attribute, i.value, !!i.parse), Object.defineProperty(t, s, {
      get() {
        return i.value;
      },
      set(l) {
        const c = i.value;
        i.value = l, i.reflect && Hd(this, i.attribute, i.value, !!i.parse);
        for (let d = 0, u = this.__propertyChangedCallbacks.length; d < u; d++)
          this.__propertyChangedCallbacks[d](s, l, c);
      },
      enumerable: !0,
      configurable: !0
    });
  }), r;
}
function Fp(t) {
  if (t)
    try {
      return JSON.parse(t);
    } catch {
      return t;
    }
}
function Hd(t, e, r, n) {
  if (r == null || r === !1) return t.removeAttribute(e);
  let s = n ? JSON.stringify(r) : r;
  t.__updating[e] = !0, s === "true" && (s = ""), t.setAttribute(e, s), Promise.resolve().then(() => delete t.__updating[e]);
}
function Z_(t) {
  return t.replace(/\.?([A-Z]+)/g, (e, r) => "-" + r.toLowerCase()).replace("_", "-").replace(/^-/, "");
}
function Up(t) {
  return t != null && (typeof t == "object" || typeof t == "function");
}
function eE(t) {
  return Object.prototype.toString.call(t) === "[object Function]";
}
function tE(t) {
  return typeof t == "function" && t.toString().indexOf("class") === 0;
}
let Hn;
function rE() {
  Object.defineProperty(Hn, "renderRoot", {
    value: Hn
  });
}
function nE(t, e) {
  const r = Object.keys(e);
  return class extends t {
    static get observedAttributes() {
      return r.map((s) => e[s].attribute);
    }
    constructor() {
      super(), this.__initialized = !1, this.__released = !1, this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = {};
      for (let s of r)
        this[s] = void 0;
    }
    connectedCallback() {
      if (this.__initialized) return;
      this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = X_(this, e);
      const s = Q_(this.props), i = this.Component, o = Hn;
      try {
        Hn = this, this.__initialized = !0, tE(i) ? new i(s, {
          element: this
        }) : i(s, {
          element: this
        });
      } finally {
        Hn = o;
      }
    }
    async disconnectedCallback() {
      if (await Promise.resolve(), this.isConnected) return;
      this.__propertyChangedCallbacks.length = 0;
      let s = null;
      for (; s = this.__releaseCallbacks.pop(); ) s(this);
      delete this.__initialized, this.__released = !0;
    }
    attributeChangedCallback(s, i, o) {
      if (this.__initialized && !this.__updating[s] && (s = this.lookupProp(s), s in e)) {
        if (o == null && !this[s]) return;
        this[s] = e[s].parse ? Fp(o) : o;
      }
    }
    lookupProp(s) {
      if (e)
        return r.find((i) => s === i || s === e[i].attribute);
    }
    get renderRoot() {
      return this.shadowRoot || this.attachShadow({
        mode: "open"
      });
    }
    addReleaseCallback(s) {
      this.__releaseCallbacks.push(s);
    }
    addPropertyChangedCallback(s) {
      this.__propertyChangedCallbacks.push(s);
    }
  };
}
function sE(t, e = {}, r = {}) {
  const {
    BaseElement: n = HTMLElement,
    extension: s,
    customElements: i = window.customElements
  } = r;
  return (o) => {
    let a = i.get(t);
    return a ? (a.prototype.Component = o, a) : (a = nE(n, Y_(e)), a.prototype.Component = o, a.prototype.registeredTag = t, i.define(t, a, s), a);
  };
}
function iE(t) {
  const e = Object.keys(t), r = {};
  for (let n = 0; n < e.length; n++) {
    const [s, i] = Q(t[e[n]]);
    Object.defineProperty(r, e[n], {
      get: s,
      set(o) {
        i(() => o);
      }
    });
  }
  return r;
}
function oE(t) {
  if (t.assignedSlot && t.assignedSlot._$owner) return t.assignedSlot._$owner;
  let e = t.parentNode;
  for (; e && !e._$owner && !(e.assignedSlot && e.assignedSlot._$owner); )
    e = e.parentNode;
  return e && e.assignedSlot ? e.assignedSlot._$owner : t._$owner;
}
function aE(t) {
  return (e, r) => {
    const { element: n } = r;
    return qn((s) => {
      const i = iE(e);
      n.addPropertyChangedCallback((a, l) => i[a] = l), n.addReleaseCallback(() => {
        n.renderRoot.textContent = "", s();
      });
      const o = t(i, r);
      return $(n.renderRoot, o);
    }, oE(n));
  };
}
function lE(t, e, r) {
  return arguments.length === 2 && (r = e, e = {}), sE(t, e)(aE(r));
}
lE(
  "wti-element",
  {
    "spec-url": "",
    "spec-type": "openapi",
    theme: "light",
    locale: "en"
  },
  (t) => (rE(), J_({
    spec: (() => {
      if (t["spec-url"])
        return t["spec-type"] === "grpc" ? {
          type: "grpc",
          endpoint: t["spec-url"]
        } : {
          type: "openapi",
          url: t["spec-url"]
        };
    })(),
    theme: t.theme,
    locale: t.locale
  }))
);
export {
  J_ as WTI
};
//# sourceMappingURL=wti-element.es.js.map
