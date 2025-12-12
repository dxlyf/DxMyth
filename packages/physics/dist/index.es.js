const Ce = function(_, t) {
  (_ === null || typeof _ > "u") && (_ = {});
  const e = { ..._ };
  for (const s in t)
    t.hasOwnProperty(s) && typeof _[s] > "u" && (e[s] = t[s]);
  if (typeof Object.getOwnPropertySymbols == "function") {
    const s = Object.getOwnPropertySymbols(t);
    for (let i = 0; i < s.length; i++) {
      const n = s[i];
      t.propertyIsEnumerable(n) && typeof _[n] > "u" && (e[n] = t[n]);
    }
  }
  return e;
}, Tc = Math.random, qt = 1e-9, Mc = Number.isFinite;
function Ic(_) {
  return _ |= _ >> 1, _ |= _ >> 2, _ |= _ >> 4, _ |= _ >> 8, _ |= _ >> 16, _ + 1;
}
function Pc(_) {
  return _ > 0 && (_ & _ - 1) === 0;
}
function Za(_, t, e) {
  return typeof t > "u" ? (e = 1, t = 0) : typeof e > "u" && (e = t, t = 0), e > t ? (_ = (_ - t) % (e - t), _ + (_ < 0 ? e : t)) : (_ = (_ - e) % (t - e), _ + (_ <= 0 ? t : e));
}
function Qt(_, t, e) {
  return _ < t ? t : _ > e ? e : _;
}
function Vc(_, t) {
  return typeof _ > "u" ? (t = 1, _ = 0) : typeof t > "u" && (t = _, _ = 0), _ === t ? _ : Tc() * (t - _) + _;
}
const Zs = Object.create(Math);
Zs.EPSILON = qt;
Zs.isFinite = Mc;
Zs.nextPowerOfTwo = Ic;
Zs.isPowerOfTwo = Pc;
Zs.mod = Za;
Zs.clamp = Qt;
Zs.random = Vc;
const j = typeof ASSERT > "u" ? !1 : ASSERT, zc = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, Rr = Math.abs, Co = Math.sqrt, Er = Math.max, qr = Math.min;
class p {
  x;
  y;
  // tslint:disable-next-line:typedef
  constructor(t, e) {
    if (zc && !(this instanceof p))
      return new p(t, e);
    typeof t > "u" ? (this.x = 0, this.y = 0) : typeof t == "object" ? (this.x = t.x, this.y = t.y) : (this.x = t, this.y = e), j && p.assert(this);
  }
  /** @hidden */
  _serialize() {
    return {
      x: this.x,
      y: this.y
    };
  }
  /** @hidden */
  static _deserialize(t) {
    const e = Object.create(p.prototype);
    return e.x = t.x, e.y = t.y, e;
  }
  static zero() {
    const t = Object.create(p.prototype);
    return t.x = 0, t.y = 0, t;
  }
  /** @hidden */
  static neo(t, e) {
    const s = Object.create(p.prototype);
    return s.x = t, s.y = e, s;
  }
  static clone(t) {
    return j && p.assert(t), p.neo(t.x, t.y);
  }
  /** @hidden */
  toString() {
    return JSON.stringify(this);
  }
  /**
   * Does this vector contain finite coordinates?
   */
  static isValid(t) {
    return t === null || typeof t > "u" ? !1 : Number.isFinite(t.x) && Number.isFinite(t.y);
  }
  static assert(t) {
    j && console.assert(!p.isValid(t), "Invalid Vec2!", t);
  }
  clone() {
    return p.clone(this);
  }
  /**
   * Set this vector to all zeros.
   *
   * @returns this
   */
  setZero() {
    return this.x = 0, this.y = 0, this;
  }
  /**
   * Set this vector to some specified coordinates.
   *
   * @returns this
   */
  // tslint:disable-next-line:typedef
  set(t, e) {
    return typeof t == "object" ? (j && p.assert(t), this.x = t.x, this.y = t.y) : (j && console.assert(Number.isFinite(t)), j && console.assert(Number.isFinite(e)), this.x = t, this.y = e), this;
  }
  /**
   * Set this vector to some specified coordinates.
   *
   * @returns this
   */
  setNum(t, e) {
    return j && console.assert(Number.isFinite(t)), j && console.assert(Number.isFinite(e)), this.x = t, this.y = e, this;
  }
  /**
   * Set this vector to some specified coordinates.
   *
   * @returns this
   */
  setVec2(t) {
    return j && p.assert(t), this.x = t.x, this.y = t.y, this;
  }
  /** @internal @deprecated Use setCombine or setMul */
  wSet(t, e, s, i) {
    return typeof s < "u" || typeof i < "u" ? this.setCombine(t, e, s, i) : this.setMul(t, e);
  }
  /**
   * Set linear combination of v and w: `a * v + b * w`
   */
  setCombine(t, e, s, i) {
    j && console.assert(Number.isFinite(t)), j && p.assert(e), j && console.assert(Number.isFinite(s)), j && p.assert(i);
    const n = t * e.x + s * i.x, o = t * e.y + s * i.y;
    return this.x = n, this.y = o, this;
  }
  setMul(t, e) {
    j && console.assert(Number.isFinite(t)), j && p.assert(e);
    const s = t * e.x, i = t * e.y;
    return this.x = s, this.y = i, this;
  }
  /**
   * Add a vector to this vector.
   *
   * @returns this
   */
  add(t) {
    return j && p.assert(t), this.x += t.x, this.y += t.y, this;
  }
  /** @internal @deprecated Use addCombine or addMul */
  wAdd(t, e, s, i) {
    return typeof s < "u" || typeof i < "u" ? this.addCombine(t, e, s, i) : this.addMul(t, e);
  }
  /**
   * Add linear combination of v and w: `a * v + b * w`
   */
  addCombine(t, e, s, i) {
    j && console.assert(Number.isFinite(t)), j && p.assert(e), j && console.assert(Number.isFinite(s)), j && p.assert(i);
    const n = t * e.x + s * i.x, o = t * e.y + s * i.y;
    return this.x += n, this.y += o, this;
  }
  addMul(t, e) {
    j && console.assert(Number.isFinite(t)), j && p.assert(e);
    const s = t * e.x, i = t * e.y;
    return this.x += s, this.y += i, this;
  }
  /**
   * @deprecated Use subCombine or subMul
   */
  wSub(t, e, s, i) {
    return typeof s < "u" || typeof i < "u" ? this.subCombine(t, e, s, i) : this.subMul(t, e);
  }
  /**
   * Subtract linear combination of v and w: `a * v + b * w`
   */
  subCombine(t, e, s, i) {
    j && console.assert(Number.isFinite(t)), j && p.assert(e), j && console.assert(Number.isFinite(s)), j && p.assert(i);
    const n = t * e.x + s * i.x, o = t * e.y + s * i.y;
    return this.x -= n, this.y -= o, this;
  }
  subMul(t, e) {
    j && console.assert(Number.isFinite(t)), j && p.assert(e);
    const s = t * e.x, i = t * e.y;
    return this.x -= s, this.y -= i, this;
  }
  /**
   * Subtract a vector from this vector
   *
   * @returns this
   */
  sub(t) {
    return j && p.assert(t), this.x -= t.x, this.y -= t.y, this;
  }
  /**
   * Multiply this vector by a scalar.
   *
   * @returns this
   */
  mul(t) {
    return j && console.assert(Number.isFinite(t)), this.x *= t, this.y *= t, this;
  }
  /**
   * Get the length of this vector (the norm).
   *
   * For performance, use this instead of lengthSquared (if possible).
   */
  length() {
    return p.lengthOf(this);
  }
  /**
   * Get the length squared.
   */
  lengthSquared() {
    return p.lengthSquared(this);
  }
  /**
   * Convert this vector into a unit vector.
   *
   * @returns old length
   */
  normalize() {
    const t = this.length();
    if (t < qt)
      return 0;
    const e = 1 / t;
    return this.x *= e, this.y *= e, t;
  }
  /**
   * Returns a new unit vector from the provided vector.
   *
   * @returns new unit vector
   */
  static normalize(t) {
    const e = p.lengthOf(t);
    if (e < qt)
      return p.zero();
    const s = 1 / e;
    return p.neo(t.x * s, t.y * s);
  }
  /**
   * Get the length of this vector (the norm).
   *
   * For performance, use this instead of lengthSquared (if possible).
   */
  static lengthOf(t) {
    return j && p.assert(t), Co(t.x * t.x + t.y * t.y);
  }
  /**
   * Get the length squared.
   */
  static lengthSquared(t) {
    return j && p.assert(t), t.x * t.x + t.y * t.y;
  }
  static distance(t, e) {
    j && p.assert(t), j && p.assert(e);
    const s = t.x - e.x, i = t.y - e.y;
    return Co(s * s + i * i);
  }
  static distanceSquared(t, e) {
    j && p.assert(t), j && p.assert(e);
    const s = t.x - e.x, i = t.y - e.y;
    return s * s + i * i;
  }
  static areEqual(t, e) {
    return j && p.assert(t), j && p.assert(e), t === e || typeof e == "object" && e !== null && t.x === e.x && t.y === e.y;
  }
  /**
   * Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
   */
  static skew(t) {
    return j && p.assert(t), p.neo(-t.y, t.x);
  }
  /** Dot product on two vectors */
  static dot(t, e) {
    return j && p.assert(t), j && p.assert(e), t.x * e.x + t.y * e.y;
  }
  static cross(t, e) {
    return typeof e == "number" ? (j && p.assert(t), j && console.assert(Number.isFinite(e)), p.neo(e * t.y, -e * t.x)) : typeof t == "number" ? (j && console.assert(Number.isFinite(t)), j && p.assert(e), p.neo(-t * e.y, t * e.x)) : (j && p.assert(t), j && p.assert(e), t.x * e.y - t.y * e.x);
  }
  /** Cross product on two vectors */
  static crossVec2Vec2(t, e) {
    return j && p.assert(t), j && p.assert(e), t.x * e.y - t.y * e.x;
  }
  /** Cross product on a vector and a scalar */
  static crossVec2Num(t, e) {
    return j && p.assert(t), j && console.assert(Number.isFinite(e)), p.neo(e * t.y, -e * t.x);
  }
  /** Cross product on a vector and a scalar */
  static crossNumVec2(t, e) {
    return j && console.assert(Number.isFinite(t)), j && p.assert(e), p.neo(-t * e.y, t * e.x);
  }
  static addCross(t, e, s) {
    if (typeof s == "number")
      return j && p.assert(e), j && console.assert(Number.isFinite(s)), p.neo(s * e.y + t.x, -s * e.x + t.y);
    if (typeof e == "number")
      return j && console.assert(Number.isFinite(e)), j && p.assert(s), p.neo(-e * s.y + t.x, e * s.x + t.y);
    j && console.assert(!1);
  }
  /**
   * Returns `a + (v x w)`
   */
  static addCrossVec2Num(t, e, s) {
    return j && p.assert(e), j && console.assert(Number.isFinite(s)), p.neo(s * e.y + t.x, -s * e.x + t.y);
  }
  /**
   * Returns `a + (v x w)`
   */
  static addCrossNumVec2(t, e, s) {
    return j && console.assert(Number.isFinite(e)), j && p.assert(s), p.neo(-e * s.y + t.x, e * s.x + t.y);
  }
  static add(t, e) {
    return j && p.assert(t), j && p.assert(e), p.neo(t.x + e.x, t.y + e.y);
  }
  /** @hidden @deprecated */
  static wAdd(t, e, s, i) {
    return typeof s < "u" || typeof i < "u" ? p.combine(t, e, s, i) : p.mulNumVec2(t, e);
  }
  static combine(t, e, s, i) {
    return p.zero().setCombine(t, e, s, i);
  }
  static sub(t, e) {
    return j && p.assert(t), j && p.assert(e), p.neo(t.x - e.x, t.y - e.y);
  }
  static mul(t, e) {
    if (typeof t == "object")
      return j && p.assert(t), j && console.assert(Number.isFinite(e)), p.neo(t.x * e, t.y * e);
    if (typeof e == "object")
      return j && console.assert(Number.isFinite(t)), j && p.assert(e), p.neo(t * e.x, t * e.y);
  }
  static mulVec2Num(t, e) {
    return j && p.assert(t), j && console.assert(Number.isFinite(e)), p.neo(t.x * e, t.y * e);
  }
  static mulNumVec2(t, e) {
    return j && console.assert(Number.isFinite(t)), j && p.assert(e), p.neo(t * e.x, t * e.y);
  }
  neg() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  static neg(t) {
    return j && p.assert(t), p.neo(-t.x, -t.y);
  }
  static abs(t) {
    return j && p.assert(t), p.neo(Rr(t.x), Rr(t.y));
  }
  static mid(t, e) {
    return j && p.assert(t), j && p.assert(e), p.neo((t.x + e.x) * 0.5, (t.y + e.y) * 0.5);
  }
  static upper(t, e) {
    return j && p.assert(t), j && p.assert(e), p.neo(Er(t.x, e.x), Er(t.y, e.y));
  }
  static lower(t, e) {
    return j && p.assert(t), j && p.assert(e), p.neo(qr(t.x, e.x), qr(t.y, e.y));
  }
  clamp(t) {
    const e = this.x * this.x + this.y * this.y;
    if (e > t * t) {
      const s = t / Co(e);
      this.x *= s, this.y *= s;
    }
    return this;
  }
  static clamp(t, e) {
    const s = p.neo(t.x, t.y);
    return s.clamp(e), s;
  }
  /** @hidden */
  static clampVec2(t, e, s) {
    return {
      x: Qt(t.x, e?.x, s?.x),
      y: Qt(t.y, e?.y, s?.y)
    };
  }
  /**  @hidden @deprecated */
  static scaleFn(t, e) {
    return function(s) {
      return p.neo(s.x * t, s.y * e);
    };
  }
  /**  @hidden @deprecated */
  static translateFn(t, e) {
    return function(s) {
      return p.neo(s.x + t, s.y + e);
    };
  }
}
const Fc = typeof ASSERT > "u" ? !1 : ASSERT, Rc = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, Pe = Math.max, Ve = Math.min;
let Ct = class Ni {
  lowerBound;
  upperBound;
  constructor(t, e) {
    if (Rc && !(this instanceof Ni))
      return new Ni(t, e);
    this.lowerBound = p.zero(), this.upperBound = p.zero(), typeof t == "object" && this.lowerBound.setVec2(t), typeof e == "object" ? this.upperBound.setVec2(e) : typeof t == "object" && this.upperBound.setVec2(t);
  }
  /**
   * Verify that the bounds are sorted.
   */
  isValid() {
    return Ni.isValid(this);
  }
  static isValid(t) {
    return t === null || typeof t > "u" ? !1 : p.isValid(t.lowerBound) && p.isValid(t.upperBound) && p.sub(t.upperBound, t.lowerBound).lengthSquared() >= 0;
  }
  static assert(t) {
    Fc && console.assert(!Ni.isValid(t), "Invalid AABB!", t);
  }
  /**
   * Get the center of the AABB.
   */
  getCenter() {
    return p.neo((this.lowerBound.x + this.upperBound.x) * 0.5, (this.lowerBound.y + this.upperBound.y) * 0.5);
  }
  /**
   * Get the extents of the AABB (half-widths).
   */
  getExtents() {
    return p.neo((this.upperBound.x - this.lowerBound.x) * 0.5, (this.upperBound.y - this.lowerBound.y) * 0.5);
  }
  /**
   * Get the perimeter length.
   */
  getPerimeter() {
    return 2 * (this.upperBound.x - this.lowerBound.x + this.upperBound.y - this.lowerBound.y);
  }
  /**
   * Combine one or two AABB into this one.
   */
  combine(t, e) {
    e = e || this;
    const s = t.lowerBound, i = t.upperBound, n = e.lowerBound, o = e.upperBound, r = Ve(s.x, n.x), a = Ve(s.y, n.y), c = Pe(o.x, i.x), l = Pe(o.y, i.y);
    this.lowerBound.setNum(r, a), this.upperBound.setNum(c, l);
  }
  combinePoints(t, e) {
    this.lowerBound.setNum(Ve(t.x, e.x), Ve(t.y, e.y)), this.upperBound.setNum(Pe(t.x, e.x), Pe(t.y, e.y));
  }
  set(t) {
    this.lowerBound.setNum(t.lowerBound.x, t.lowerBound.y), this.upperBound.setNum(t.upperBound.x, t.upperBound.y);
  }
  contains(t) {
    let e = !0;
    return e = e && this.lowerBound.x <= t.lowerBound.x, e = e && this.lowerBound.y <= t.lowerBound.y, e = e && t.upperBound.x <= this.upperBound.x, e = e && t.upperBound.y <= this.upperBound.y, e;
  }
  extend(t) {
    return Ni.extend(this, t), this;
  }
  static extend(t, e) {
    return t.lowerBound.x -= e, t.lowerBound.y -= e, t.upperBound.x += e, t.upperBound.y += e, t;
  }
  static testOverlap(t, e) {
    const s = e.lowerBound.x - t.upperBound.x, i = t.lowerBound.x - e.upperBound.x, n = e.lowerBound.y - t.upperBound.y, o = t.lowerBound.y - e.upperBound.y;
    return !(s > 0 || n > 0 || i > 0 || o > 0);
  }
  static areEqual(t, e) {
    return p.areEqual(t.lowerBound, e.lowerBound) && p.areEqual(t.upperBound, e.upperBound);
  }
  static diff(t, e) {
    const s = Pe(0, Ve(t.upperBound.x, e.upperBound.x) - Pe(e.lowerBound.x, t.lowerBound.x)), i = Pe(0, Ve(t.upperBound.y, e.upperBound.y) - Pe(e.lowerBound.y, t.lowerBound.y)), n = t.upperBound.x - t.lowerBound.x, o = t.upperBound.y - t.lowerBound.y, r = e.upperBound.x - e.lowerBound.x, a = e.upperBound.y - e.lowerBound.y;
    return n * o + r * a - s * i;
  }
  rayCast(t, e) {
    let s = -1 / 0, i = 1 / 0;
    const n = e.p1, o = p.sub(e.p2, e.p1), r = p.abs(o), a = p.zero();
    if (r.x < qt) {
      if (n.x < this.lowerBound.x || this.upperBound.x < n.x)
        return !1;
    } else {
      const c = 1 / o.x;
      let l = (this.lowerBound.x - n.x) * c, m = (this.upperBound.x - n.x) * c, h = -1;
      if (l > m) {
        const u = l;
        l = m, m = u, h = 1;
      }
      if (l > s && (a.setZero(), a.x = h, s = l), i = Ve(i, m), s > i)
        return !1;
    }
    if (r.y < qt) {
      if (n.y < this.lowerBound.y || this.upperBound.y < n.y)
        return !1;
    } else {
      const c = 1 / o.y;
      let l = (this.lowerBound.y - n.y) * c, m = (this.upperBound.y - n.y) * c, h = -1;
      if (l > m) {
        const u = l;
        l = m, m = u, h = 1;
      }
      if (l > s && (a.setZero(), a.y = h, s = l), i = Ve(i, m), s > i)
        return !1;
    }
    return s < 0 || e.maxFraction < s ? !1 : (t.fraction = s, t.normal = a, !0);
  }
  /** @hidden */
  toString() {
    return JSON.stringify(this);
  }
  static combinePoints(t, e, s) {
    return t.lowerBound.x = Ve(e.x, s.x), t.lowerBound.y = Ve(e.y, s.y), t.upperBound.x = Pe(e.x, s.x), t.upperBound.y = Pe(e.y, s.y), t;
  }
  static combinedPerimeter(t, e) {
    const s = Ve(t.lowerBound.x, e.lowerBound.x), i = Ve(t.lowerBound.y, e.lowerBound.y), n = Pe(t.upperBound.x, e.upperBound.x), o = Pe(t.upperBound.y, e.upperBound.y);
    return 2 * (n - s + o - i);
  }
};
const vn = Math.PI;
class et {
  /**
   * You can use this to change the length scale used by your game.
   *
   * For example for inches you could use 39.4.
   */
  static lengthUnitsPerMeter = 1;
  // Collision
  /**
   * The maximum number of contact points between two convex shapes. Do not change
   * this value.
   */
  static maxManifoldPoints = 2;
  /**
   * The maximum number of vertices on a convex polygon. You cannot increase this
   * too much because BlockAllocator has a maximum object size.
   */
  static maxPolygonVertices = 12;
  /**
   * This is used to fatten AABBs in the dynamic tree. This allows proxies to move
   * by a small amount without triggering a tree adjustment. This is in meters.
   */
  static aabbExtension = 0.1;
  /**
   * This is used to fatten AABBs in the dynamic tree. This is used to predict the
   * future position based on the current displacement. This is a dimensionless
   * multiplier.
   */
  static aabbMultiplier = 2;
  /**
   * A small length used as a collision and constraint tolerance. Usually it is
   * chosen to be numerically significant, but visually insignificant.
   */
  static linearSlop = 5e-3;
  /**
   * A small angle used as a collision and constraint tolerance. Usually it is
   * chosen to be numerically significant, but visually insignificant.
   */
  static angularSlop = 2 / 180 * vn;
  /**
   * The radius of the polygon/edge shape skin. This should not be modified.
   * Making this smaller means polygons will have an insufficient buffer for
   * continuous collision. Making it larger may create artifacts for vertex
   * collision.
   */
  static get polygonRadius() {
    return 2 * et.linearSlop;
  }
  /**
   * Maximum number of sub-steps per contact in continuous physics simulation.
   */
  static maxSubSteps = 8;
  // Dynamics
  /**
   * Maximum number of contacts to be handled to solve a TOI impact.
   */
  static maxTOIContacts = 32;
  /**
   * Maximum iterations to solve a TOI.
   */
  static maxTOIIterations = 20;
  /**
   * Maximum iterations to find Distance.
   */
  static maxDistanceIterations = 20;
  /**
   * A velocity threshold for elastic collisions. Any collision with a relative
   * linear velocity below this threshold will be treated as inelastic.
   */
  static velocityThreshold = 1;
  /**
   * The maximum linear position correction used when solving constraints. This
   * helps to prevent overshoot.
   */
  static maxLinearCorrection = 0.2;
  /**
   * The maximum angular position correction used when solving constraints. This
   * helps to prevent overshoot.
   */
  static maxAngularCorrection = 8 / 180 * vn;
  /**
   * The maximum linear velocity of a body. This limit is very large and is used
   * to prevent numerical problems. You shouldn't need to adjust Settings.
   */
  static maxTranslation = 2;
  /**
   * The maximum angular velocity of a body. This limit is very large and is used
   * to prevent numerical problems. You shouldn't need to adjust Settings.
   */
  static maxRotation = 0.5 * vn;
  /**
   * This scale factor controls how fast overlap is resolved. Ideally this would
   * be 1 so that overlap is removed in one time step. However using values close
   * to 1 often lead to overshoot.
   */
  static baumgarte = 0.2;
  static toiBaugarte = 0.75;
  // Sleep
  /**
   * The time that a body must be still before it will go to sleep.
   */
  static timeToSleep = 0.5;
  /**
   * A body cannot sleep if its linear velocity is above this tolerance.
   */
  static linearSleepTolerance = 0.01;
  /**
   * A body cannot sleep if its angular velocity is above this tolerance.
   */
  static angularSleepTolerance = 2 / 180 * vn;
}
class O {
  static get maxManifoldPoints() {
    return et.maxManifoldPoints;
  }
  static get maxPolygonVertices() {
    return et.maxPolygonVertices;
  }
  static get aabbExtension() {
    return et.aabbExtension * et.lengthUnitsPerMeter;
  }
  static get aabbMultiplier() {
    return et.aabbMultiplier;
  }
  static get linearSlop() {
    return et.linearSlop * et.lengthUnitsPerMeter;
  }
  static get linearSlopSquared() {
    return et.linearSlop * et.lengthUnitsPerMeter * et.linearSlop * et.lengthUnitsPerMeter;
  }
  static get angularSlop() {
    return et.angularSlop;
  }
  static get polygonRadius() {
    return 2 * et.linearSlop;
  }
  static get maxSubSteps() {
    return et.maxSubSteps;
  }
  static get maxTOIContacts() {
    return et.maxTOIContacts;
  }
  static get maxTOIIterations() {
    return et.maxTOIIterations;
  }
  static get maxDistanceIterations() {
    return et.maxDistanceIterations;
  }
  static get velocityThreshold() {
    return et.velocityThreshold * et.lengthUnitsPerMeter;
  }
  static get maxLinearCorrection() {
    return et.maxLinearCorrection * et.lengthUnitsPerMeter;
  }
  static get maxAngularCorrection() {
    return et.maxAngularCorrection;
  }
  static get maxTranslation() {
    return et.maxTranslation * et.lengthUnitsPerMeter;
  }
  static get maxTranslationSquared() {
    return et.maxTranslation * et.lengthUnitsPerMeter * et.maxTranslation * et.lengthUnitsPerMeter;
  }
  static get maxRotation() {
    return et.maxRotation;
  }
  static get maxRotationSquared() {
    return et.maxRotation * et.maxRotation;
  }
  static get baumgarte() {
    return et.baumgarte;
  }
  static get toiBaugarte() {
    return et.toiBaugarte;
  }
  static get timeToSleep() {
    return et.timeToSleep;
  }
  static get linearSleepTolerance() {
    return et.linearSleepTolerance * et.lengthUnitsPerMeter;
  }
  static get linearSleepToleranceSqr() {
    return et.linearSleepTolerance * et.lengthUnitsPerMeter * et.linearSleepTolerance * et.lengthUnitsPerMeter;
  }
  static get angularSleepTolerance() {
    return et.angularSleepTolerance;
  }
  static get angularSleepToleranceSqr() {
    return et.angularSleepTolerance * et.angularSleepTolerance;
  }
}
let ln = class {
  _list = [];
  _max = 1 / 0;
  _createFn;
  _hasCreateFn = !1;
  _createCount = 0;
  _allocateFn;
  _hasAllocateFn = !1;
  _allocateCount = 0;
  _releaseFn;
  _hasReleaseFn = !1;
  _releaseCount = 0;
  _disposeFn;
  _hasDisposeFn = !1;
  _disposeCount = 0;
  constructor(t) {
    this._list = [], this._max = t.max || this._max, this._createFn = t.create, this._hasCreateFn = typeof this._createFn == "function", this._allocateFn = t.allocate, this._hasAllocateFn = typeof this._allocateFn == "function", this._releaseFn = t.release, this._hasReleaseFn = typeof this._releaseFn == "function", this._disposeFn = t.dispose, this._hasDisposeFn = typeof this._disposeFn == "function";
  }
  max(t) {
    return typeof t == "number" ? (this._max = t, this) : this._max;
  }
  size() {
    return this._list.length;
  }
  allocate() {
    let t;
    return this._list.length > 0 ? t = this._list.shift() : (this._createCount++, this._hasCreateFn ? t = this._createFn() : t = {}), this._allocateCount++, this._hasAllocateFn && this._allocateFn(t), t;
  }
  release(t) {
    this._list.length < this._max ? (this._releaseCount++, this._hasReleaseFn && this._releaseFn(t), this._list.push(t)) : (this._disposeCount++, this._hasDisposeFn && (t = this._disposeFn(t)));
  }
  toString() {
    return " +" + this._createCount + " >" + this._allocateCount + " <" + this._releaseCount + " -" + this._disposeCount + " =" + this._list.length + "/" + this._max;
  }
};
const _t = typeof ASSERT > "u" ? !1 : ASSERT, Lr = Math.abs, de = Math.max;
class Ja {
  id;
  /** Enlarged AABB */
  aabb = new Ct();
  userData = null;
  parent = null;
  child1 = null;
  child2 = null;
  /** 0: leaf, -1: free node */
  height = -1;
  constructor(t) {
    this.id = t;
  }
  /** @internal */
  toString() {
    return this.id + ": " + this.userData;
  }
  isLeaf() {
    return this.child1 == null;
  }
}
const Nr = new ln({
  create() {
    return new Ja();
  },
  release(_) {
    _.userData = null, _.parent = null, _.child1 = null, _.child2 = null, _.height = -1, _.id = void 0;
  }
});
class _r {
  m_root;
  m_lastProxyId;
  m_nodes;
  constructor() {
    this.m_root = null, this.m_nodes = {}, this.m_lastProxyId = 0;
  }
  /**
   * Get proxy user data.
   *
   * @return the proxy user data or 0 if the id is invalid.
   */
  getUserData(t) {
    const e = this.m_nodes[t];
    return _t && console.assert(!!e), e.userData;
  }
  /**
   * Get the fat AABB for a node id.
   *
   * @return the proxy user data or 0 if the id is invalid.
   */
  getFatAABB(t) {
    const e = this.m_nodes[t];
    return _t && console.assert(!!e), e.aabb;
  }
  allocateNode() {
    const t = Nr.allocate();
    return t.id = ++this.m_lastProxyId, this.m_nodes[t.id] = t, t;
  }
  freeNode(t) {
    delete this.m_nodes[t.id], Nr.release(t);
  }
  /**
   * Create a proxy in the tree as a leaf node. We return the index of the node
   * instead of a pointer so that we can grow the node pool.
   *
   * Create a proxy. Provide a tight fitting AABB and a userData pointer.
   */
  createProxy(t, e) {
    _t && console.assert(Ct.isValid(t));
    const s = this.allocateNode();
    return s.aabb.set(t), Ct.extend(s.aabb, O.aabbExtension), s.userData = e, s.height = 0, this.insertLeaf(s), s.id;
  }
  /**
   * Destroy a proxy. This asserts if the id is invalid.
   */
  destroyProxy(t) {
    const e = this.m_nodes[t];
    _t && console.assert(!!e), _t && console.assert(e.isLeaf()), this.removeLeaf(e), this.freeNode(e);
  }
  /**
   * Move a proxy with a swepted AABB. If the proxy has moved outside of its
   * fattened AABB, then the proxy is removed from the tree and re-inserted.
   * Otherwise the function returns immediately.
   *
   * @param d Displacement
   *
   * @return true if the proxy was re-inserted.
   */
  moveProxy(t, e, s) {
    _t && console.assert(Ct.isValid(e)), _t && console.assert(!s || p.isValid(s));
    const i = this.m_nodes[t];
    return _t && console.assert(!!i), _t && console.assert(i.isLeaf()), i.aabb.contains(e) ? !1 : (this.removeLeaf(i), i.aabb.set(e), e = i.aabb, Ct.extend(e, O.aabbExtension), s.x < 0 ? e.lowerBound.x += s.x * O.aabbMultiplier : e.upperBound.x += s.x * O.aabbMultiplier, s.y < 0 ? e.lowerBound.y += s.y * O.aabbMultiplier : e.upperBound.y += s.y * O.aabbMultiplier, this.insertLeaf(i), !0);
  }
  insertLeaf(t) {
    if (_t && console.assert(Ct.isValid(t.aabb)), this.m_root == null) {
      this.m_root = t, this.m_root.parent = null;
      return;
    }
    const e = t.aabb;
    let s = this.m_root;
    for (; !s.isLeaf(); ) {
      const r = s.child1, a = s.child2, c = s.aabb.getPerimeter(), l = Ct.combinedPerimeter(s.aabb, e), m = 2 * l, h = 2 * (l - c);
      let d = Ct.combinedPerimeter(e, r.aabb) + h;
      if (!r.isLeaf()) {
        const v = r.aabb.getPerimeter();
        d -= v;
      }
      let y = Ct.combinedPerimeter(e, a.aabb) + h;
      if (!a.isLeaf()) {
        const v = a.aabb.getPerimeter();
        y -= v;
      }
      if (m < d && m < y)
        break;
      d < y ? s = r : s = a;
    }
    const i = s, n = i.parent, o = this.allocateNode();
    for (o.parent = n, o.userData = null, o.aabb.combine(e, i.aabb), o.height = i.height + 1, n != null ? (n.child1 === i ? n.child1 = o : n.child2 = o, o.child1 = i, o.child2 = t, i.parent = o, t.parent = o) : (o.child1 = i, o.child2 = t, i.parent = o, t.parent = o, this.m_root = o), s = t.parent; s != null; ) {
      s = this.balance(s);
      const r = s.child1, a = s.child2;
      _t && console.assert(r != null), _t && console.assert(a != null), s.height = 1 + de(r.height, a.height), s.aabb.combine(r.aabb, a.aabb), s = s.parent;
    }
  }
  removeLeaf(t) {
    if (t === this.m_root) {
      this.m_root = null;
      return;
    }
    const e = t.parent, s = e.parent;
    let i;
    if (e.child1 === t ? i = e.child2 : i = e.child1, s != null) {
      s.child1 === e ? s.child1 = i : s.child2 = i, i.parent = s, this.freeNode(e);
      let n = s;
      for (; n != null; ) {
        n = this.balance(n);
        const o = n.child1, r = n.child2;
        n.aabb.combine(o.aabb, r.aabb), n.height = 1 + de(o.height, r.height), n = n.parent;
      }
    } else
      this.m_root = i, i.parent = null, this.freeNode(e);
  }
  /**
   * Perform a left or right rotation if node A is imbalanced. Returns the new
   * root index.
   */
  balance(t) {
    _t && console.assert(t != null);
    const e = t;
    if (e.isLeaf() || e.height < 2)
      return t;
    const s = e.child1, i = e.child2, n = i.height - s.height;
    if (n > 1) {
      const o = i.child1, r = i.child2;
      return i.child1 = e, i.parent = e.parent, e.parent = i, i.parent != null ? i.parent.child1 === t ? i.parent.child1 = i : i.parent.child2 = i : this.m_root = i, o.height > r.height ? (i.child2 = o, e.child2 = r, r.parent = e, e.aabb.combine(s.aabb, r.aabb), i.aabb.combine(e.aabb, o.aabb), e.height = 1 + de(s.height, r.height), i.height = 1 + de(e.height, o.height)) : (i.child2 = r, e.child2 = o, o.parent = e, e.aabb.combine(s.aabb, o.aabb), i.aabb.combine(e.aabb, r.aabb), e.height = 1 + de(s.height, o.height), i.height = 1 + de(e.height, r.height)), i;
    }
    if (n < -1) {
      const o = s.child1, r = s.child2;
      return s.child1 = e, s.parent = e.parent, e.parent = s, s.parent != null ? s.parent.child1 === e ? s.parent.child1 = s : s.parent.child2 = s : this.m_root = s, o.height > r.height ? (s.child2 = o, e.child1 = r, r.parent = e, e.aabb.combine(i.aabb, r.aabb), s.aabb.combine(e.aabb, o.aabb), e.height = 1 + de(i.height, r.height), s.height = 1 + de(e.height, o.height)) : (s.child2 = r, e.child1 = o, o.parent = e, e.aabb.combine(i.aabb, o.aabb), s.aabb.combine(e.aabb, r.aabb), e.height = 1 + de(i.height, o.height), s.height = 1 + de(e.height, r.height)), s;
    }
    return e;
  }
  /**
   * Compute the height of the binary tree in O(N) time. Should not be called
   * often.
   */
  getHeight() {
    return this.m_root == null ? 0 : this.m_root.height;
  }
  /**
   * Get the ratio of the sum of the node areas to the root area.
   */
  getAreaRatio() {
    if (this.m_root == null)
      return 0;
    const e = this.m_root.aabb.getPerimeter();
    let s = 0, i;
    const n = this.iteratorPool.allocate().preorder(this.m_root);
    for (; i = n.next(); )
      i.height < 0 || (s += i.aabb.getPerimeter());
    return this.iteratorPool.release(n), s / e;
  }
  /**
   * Compute the height of a sub-tree.
   */
  computeHeight(t) {
    let e;
    if (typeof t < "u" ? e = this.m_nodes[t] : e = this.m_root, e.isLeaf())
      return 0;
    const s = this.computeHeight(e.child1.id), i = this.computeHeight(e.child2.id);
    return 1 + de(s, i);
  }
  validateStructure(t) {
    if (t == null)
      return;
    t === this.m_root && _t && console.assert(t.parent == null);
    const e = t.child1, s = t.child2;
    if (t.isLeaf()) {
      _t && console.assert(e == null), _t && console.assert(s == null), _t && console.assert(t.height === 0);
      return;
    }
    _t && console.assert(e.parent === t), _t && console.assert(s.parent === t), this.validateStructure(e), this.validateStructure(s);
  }
  validateMetrics(t) {
    if (t == null)
      return;
    const e = t.child1, s = t.child2;
    if (t.isLeaf()) {
      _t && console.assert(e == null), _t && console.assert(s == null), _t && console.assert(t.height === 0);
      return;
    }
    if (_t) {
      const i = e.height, n = s.height, o = 1 + de(i, n);
      console.assert(t.height === o);
    }
    if (_t) {
      const i = new Ct();
      i.combine(e.aabb, s.aabb), console.assert(Ct.areEqual(i, t.aabb));
    }
    this.validateMetrics(e), this.validateMetrics(s);
  }
  /**
   * Validate this tree. For testing.
   */
  validate() {
    _t && (this.validateStructure(this.m_root), this.validateMetrics(this.m_root), console.assert(this.getHeight() === this.computeHeight()));
  }
  /**
   * Get the maximum balance of an node in the tree. The balance is the difference
   * in height of the two children of a node.
   */
  getMaxBalance() {
    let t = 0, e;
    const s = this.iteratorPool.allocate().preorder(this.m_root);
    for (; e = s.next(); ) {
      if (e.height <= 1)
        continue;
      _t && console.assert(!e.isLeaf());
      const i = Lr(e.child2.height - e.child1.height);
      t = de(t, i);
    }
    return this.iteratorPool.release(s), t;
  }
  /**
   * Build an optimal tree. Very expensive. For testing.
   */
  rebuildBottomUp() {
    const t = [];
    let e = 0, s;
    const i = this.iteratorPool.allocate().preorder(this.m_root);
    for (; s = i.next(); )
      s.height < 0 || (s.isLeaf() ? (s.parent = null, t[e] = s, ++e) : this.freeNode(s));
    for (this.iteratorPool.release(i); e > 1; ) {
      let n = 1 / 0, o = -1, r = -1;
      for (let m = 0; m < e; ++m) {
        const h = t[m].aabb;
        for (let u = m + 1; u < e; ++u) {
          const d = t[u].aabb, f = Ct.combinedPerimeter(h, d);
          f < n && (o = m, r = u, n = f);
        }
      }
      const a = t[o], c = t[r], l = this.allocateNode();
      l.child1 = a, l.child2 = c, l.height = 1 + de(a.height, c.height), l.aabb.combine(a.aabb, c.aabb), l.parent = null, a.parent = l, c.parent = l, t[r] = t[e - 1], t[o] = l, --e;
    }
    this.m_root = t[0], _t && this.validate();
  }
  /**
   * Shift the world origin. Useful for large worlds. The shift formula is:
   * position -= newOrigin
   *
   * @param newOrigin The new origin with respect to the old origin
   */
  shiftOrigin(t) {
    let e;
    const s = this.iteratorPool.allocate().preorder(this.m_root);
    for (; e = s.next(); ) {
      const i = e.aabb;
      i.lowerBound.x -= t.x, i.lowerBound.y -= t.y, i.upperBound.x -= t.x, i.upperBound.y -= t.y;
    }
    this.iteratorPool.release(s);
  }
  /**
   * Query an AABB for overlapping proxies. The callback class is called for each
   * proxy that overlaps the supplied AABB.
   */
  query(t, e) {
    _t && console.assert(typeof e == "function");
    const s = this.stackPool.allocate();
    for (s.push(this.m_root); s.length > 0; ) {
      const i = s.pop();
      if (i != null && Ct.testOverlap(i.aabb, t))
        if (i.isLeaf()) {
          if (e(i.id) === !1)
            return;
        } else
          s.push(i.child1), s.push(i.child2);
    }
    this.stackPool.release(s);
  }
  /**
   * Ray-cast against the proxies in the tree. This relies on the callback to
   * perform a exact ray-cast in the case were the proxy contains a shape. The
   * callback also performs the any collision filtering. This has performance
   * roughly equal to k * log(n), where k is the number of collisions and n is the
   * number of proxies in the tree.
   *
   * @param input The ray-cast input data. The ray extends from `p1` to `p1 + maxFraction * (p2 - p1)`.
   * @param rayCastCallback A function that is called for each proxy that is hit by the ray. If the return value is a positive number it will update the maxFraction of the ray cast input, and if it is zero it will terminate they ray cast.
   */
  rayCast(t, e) {
    _t && console.assert(typeof e == "function");
    const s = t.p1, i = t.p2, n = p.sub(i, s);
    _t && console.assert(n.lengthSquared() > 0), n.normalize();
    const o = p.crossNumVec2(1, n), r = p.abs(o);
    let a = t.maxFraction;
    const c = new Ct();
    let l = p.combine(1 - a, s, a, i);
    c.combinePoints(s, l);
    const m = this.stackPool.allocate(), h = this.inputPool.allocate();
    for (m.push(this.m_root); m.length > 0; ) {
      const u = m.pop();
      if (u == null || Ct.testOverlap(u.aabb, c) === !1)
        continue;
      const d = u.aabb.getCenter(), f = u.aabb.getExtents();
      if (!(Lr(p.dot(o, p.sub(s, d))) - p.dot(r, f) > 0))
        if (u.isLeaf()) {
          h.p1 = p.clone(t.p1), h.p2 = p.clone(t.p2), h.maxFraction = a;
          const v = e(h, u.id);
          if (v === 0)
            break;
          v > 0 && (a = v, l = p.combine(1 - a, s, a, i), c.combinePoints(s, l));
        } else
          m.push(u.child1), m.push(u.child2);
    }
    this.stackPool.release(m), this.inputPool.release(h);
  }
  inputPool = new ln({
    create() {
      return {};
    },
    release(t) {
    }
  });
  stackPool = new ln({
    create() {
      return [];
    },
    release(t) {
      t.length = 0;
    }
  });
  iteratorPool = new ln({
    create() {
      return new Ec();
    },
    release(t) {
      t.close();
    }
  });
}
class Ec {
  parents = [];
  states = [];
  preorder(t) {
    return this.parents.length = 0, this.parents.push(t), this.states.length = 0, this.states.push(0), this;
  }
  next() {
    for (; this.parents.length > 0; ) {
      const t = this.parents.length - 1, e = this.parents[t];
      if (this.states[t] === 0)
        return this.states[t] = 1, e;
      if (this.states[t] === 1 && (this.states[t] = 2, e.child1))
        return this.parents.push(e.child1), this.states.push(1), e.child1;
      if (this.states[t] === 2 && (this.states[t] = 3, e.child2))
        return this.parents.push(e.child2), this.states.push(1), e.child2;
      this.parents.pop(), this.states.pop();
    }
  }
  close() {
    this.parents.length = 0;
  }
}
const To = typeof ASSERT > "u" ? !1 : ASSERT, qc = Math.max, Lc = Math.min;
class Qa {
  m_tree = new _r();
  m_moveBuffer = [];
  m_callback;
  m_queryProxyId;
  /**
   * Get user data from a proxy. Returns null if the id is invalid.
   */
  getUserData(t) {
    return this.m_tree.getUserData(t);
  }
  /**
   * Test overlap of fat AABBs.
   */
  testOverlap(t, e) {
    const s = this.m_tree.getFatAABB(t), i = this.m_tree.getFatAABB(e);
    return Ct.testOverlap(s, i);
  }
  /**
   * Get the fat AABB for a proxy.
   */
  getFatAABB(t) {
    return this.m_tree.getFatAABB(t);
  }
  /**
   * Get the number of proxies.
   */
  getProxyCount() {
    return this.m_moveBuffer.length;
  }
  /**
   * Get the height of the embedded tree.
   */
  getTreeHeight() {
    return this.m_tree.getHeight();
  }
  /**
   * Get the balance (integer) of the embedded tree.
   */
  getTreeBalance() {
    return this.m_tree.getMaxBalance();
  }
  /**
   * Get the quality metric of the embedded tree.
   */
  getTreeQuality() {
    return this.m_tree.getAreaRatio();
  }
  /**
   * Query an AABB for overlapping proxies. The callback class is called for each
   * proxy that overlaps the supplied AABB.
   */
  query = (t, e) => {
    this.m_tree.query(t, e);
  };
  /**
   * Ray-cast against the proxies in the tree. This relies on the callback to
   * perform a exact ray-cast in the case were the proxy contains a shape. The
   * callback also performs the any collision filtering. This has performance
   * roughly equal to k * log(n), where k is the number of collisions and n is the
   * number of proxies in the tree.
   *
   * @param input The ray-cast input data. The ray extends from `p1` to `p1 + maxFraction * (p2 - p1)`.
   * @param rayCastCallback A function that is called for each proxy that is hit by the ray. If the return value is a positive number it will update the maxFraction of the ray cast input, and if it is zero it will terminate they ray cast.
   */
  rayCast(t, e) {
    this.m_tree.rayCast(t, e);
  }
  /**
   * Shift the world origin. Useful for large worlds. The shift formula is:
   * position -= newOrigin
   *
   * @param newOrigin The new origin with respect to the old origin
   */
  shiftOrigin(t) {
    this.m_tree.shiftOrigin(t);
  }
  /**
   * Create a proxy with an initial AABB. Pairs are not reported until UpdatePairs
   * is called.
   */
  createProxy(t, e) {
    To && console.assert(Ct.isValid(t));
    const s = this.m_tree.createProxy(t, e);
    return this.bufferMove(s), s;
  }
  /**
   * Destroy a proxy. It is up to the client to remove any pairs.
   */
  destroyProxy(t) {
    this.unbufferMove(t), this.m_tree.destroyProxy(t);
  }
  /**
   * Call moveProxy as many times as you like, then when you are done call
   * UpdatePairs to finalized the proxy pairs (for your time step).
   */
  moveProxy(t, e, s) {
    To && console.assert(Ct.isValid(e)), this.m_tree.moveProxy(t, e, s) && this.bufferMove(t);
  }
  /**
   * Call to trigger a re-processing of it's pairs on the next call to
   * UpdatePairs.
   */
  touchProxy(t) {
    this.bufferMove(t);
  }
  bufferMove(t) {
    this.m_moveBuffer.push(t);
  }
  unbufferMove(t) {
    for (let e = 0; e < this.m_moveBuffer.length; ++e)
      this.m_moveBuffer[e] === t && (this.m_moveBuffer[e] = null);
  }
  /**
   * Update the pairs. This results in pair callbacks. This can only add pairs.
   */
  updatePairs(t) {
    for (To && console.assert(typeof t == "function"), this.m_callback = t; this.m_moveBuffer.length > 0; ) {
      if (this.m_queryProxyId = this.m_moveBuffer.pop(), this.m_queryProxyId === null)
        continue;
      const e = this.m_tree.getFatAABB(this.m_queryProxyId);
      this.m_tree.query(e, this.queryCallback);
    }
  }
  queryCallback = (t) => {
    if (t === this.m_queryProxyId)
      return !0;
    const e = Lc(t, this.m_queryProxyId), s = qc(t, this.m_queryProxyId), i = this.m_tree.getUserData(e), n = this.m_tree.getUserData(s);
    return this.m_callback(i, n), !0;
  };
}
const tc = Math.sin, ec = Math.cos, fr = Math.sqrt;
function I(_, t) {
  return { x: _, y: t };
}
function Nc(_) {
  return { s: tc(_), c: ec(_) };
}
function Zt(_, t, e) {
  return _.x = t, _.y = e, _;
}
function S(_, t) {
  return _.x = t.x, _.y = t.y, _;
}
function K(_) {
  return _.x = 0, _.y = 0, _;
}
function mn(_) {
  return _.x = -_.x, _.y = -_.y, _;
}
function Ne(_, t) {
  return _.x += t.x, _.y += t.y, _;
}
function kc(_, t, e) {
  return _.x = t.x + e.x, _.y = t.x + e.y, _;
}
function Ms(_, t) {
  return _.x -= t.x, _.y -= t.y, _;
}
function it(_, t, e) {
  return _.x = t.x - e.x, _.y = t.y - e.y, _;
}
function kr(_, t) {
  return _.x *= t, _.y *= t, _;
}
function Z(_, t, e) {
  return _.x = t * e.x, _.y = t * e.y, _;
}
function Ze(_, t, e) {
  return _.x += t * e.x, _.y += t * e.y, _;
}
function an(_, t, e) {
  return _.x -= t * e.x, _.y -= t * e.y, _;
}
function Tt(_, t, e, s, i) {
  return _.x = t * e.x + s * i.x, _.y = t * e.y + s * i.y, _;
}
function ds(_, t, e, s, i, n, o) {
  return _.x = t * e.x + s * i.x + n * o.x, _.y = t * e.y + s * i.y + n * o.y, _;
}
function Oc(_) {
  const t = fr(_.x * _.x + _.y * _.y);
  if (t !== 0) {
    const e = 1 / t;
    _.x *= e, _.y *= e;
  }
  return t;
}
function ts(_) {
  const t = fr(_.x * _.x + _.y * _.y);
  if (t > 0) {
    const e = 1 / t;
    _.x *= e, _.y *= e;
  }
  return _;
}
function yi(_, t, e) {
  const s = e * t.y, i = -e * t.x;
  return _.x = s, _.y = i, _;
}
function we(_, t, e) {
  const s = -t * e.y, i = t * e.x;
  return _.x = s, _.y = i, _;
}
function rt(_, t) {
  return _.x * t.y - _.y * t.x;
}
function L(_, t) {
  return _.x * t.x + _.y * t.y;
}
function xi(_) {
  return _.x * _.x + _.y * _.y;
}
function sc(_, t) {
  const e = _.x - t.x, s = _.y - t.y;
  return fr(e * e + s * s);
}
function gi(_, t) {
  const e = _.x - t.x, s = _.y - t.y;
  return e * e + s * s;
}
function jc(_, t) {
  return _.c = ec(t), _.s = tc(t), _;
}
function ke(_, t, e) {
  return _.x = t.c * e.x - t.s * e.y, _.y = t.s * e.x + t.c * e.y, _;
}
function ki(_, t, e) {
  const s = t.c * e.x + t.s * e.y, i = -t.s * e.x + t.c * e.y;
  return _.x = s, _.y = i, _;
}
function Dc(_, t, e, s) {
  const i = t.c * s.x + t.s * s.y, n = -t.s * s.x + t.c * s.y, o = e.c * i - e.s * n, r = e.s * i + e.c * n;
  return _.x = o, _.y = r, _;
}
function bi(_, t, e) {
  return { p: I(_, t), q: Nc(e) };
}
function co(_, t) {
  return _.p.x = t.p.x, _.p.y = t.p.y, _.q.s = t.q.s, _.q.c = t.q.c, _;
}
function st(_, t, e) {
  const s = t.q.c * e.x - t.q.s * e.y + t.p.x, i = t.q.s * e.x + t.q.c * e.y + t.p.y;
  return _.x = s, _.y = i, _;
}
function yr(_, t, e) {
  const s = e.x - t.p.x, i = e.y - t.p.y, n = t.q.c * s + t.q.s * i, o = -t.q.s * s + t.q.c * i;
  return _.x = n, _.y = o, _;
}
function ic(_, t, e, s) {
  const i = t.q.c * s.x - t.q.s * s.y + t.p.x, n = t.q.s * s.x + t.q.c * s.y + t.p.y, o = i - e.p.x, r = n - e.p.y, a = e.q.c * o + e.q.s * r, c = -e.q.s * o + e.q.c * r;
  return _.x = a, _.y = c, _;
}
function nc(_, t, e) {
  const s = t.q.c * e.q.c + t.q.s * e.q.s, i = t.q.c * e.q.s - t.q.s * e.q.c, n = t.q.c * (e.p.x - t.p.x) + t.q.s * (e.p.y - t.p.y), o = -t.q.s * (e.p.x - t.p.x) + t.q.c * (e.p.y - t.p.y);
  return _.q.c = s, _.q.s = i, _.p.x = n, _.p.y = o, _;
}
const se = typeof ASSERT > "u" ? !1 : ASSERT, Wc = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, Or = Math.sin, jr = Math.cos, Yc = Math.atan2;
class C {
  /** sin(angle) */
  s;
  /** cos(angle) */
  c;
  /** Initialize from an angle in radians. */
  constructor(t) {
    if (Wc && !(this instanceof C))
      return new C(t);
    typeof t == "number" ? this.setAngle(t) : typeof t == "object" ? this.setRot(t) : this.setIdentity();
  }
  /** @hidden */
  static neo(t) {
    const e = Object.create(C.prototype);
    return e.setAngle(t), e;
  }
  static clone(t) {
    se && C.assert(t);
    const e = Object.create(C.prototype);
    return e.s = t.s, e.c = t.c, e;
  }
  static identity() {
    const t = Object.create(C.prototype);
    return t.s = 0, t.c = 1, t;
  }
  static isValid(t) {
    return t === null || typeof t > "u" ? !1 : Number.isFinite(t.s) && Number.isFinite(t.c);
  }
  static assert(t) {
    se && console.assert(!C.isValid(t), "Invalid Rot!", t);
  }
  /** Set to the identity rotation. */
  setIdentity() {
    this.s = 0, this.c = 1;
  }
  set(t) {
    typeof t == "object" ? (se && C.assert(t), this.s = t.s, this.c = t.c) : (se && console.assert(Number.isFinite(t)), this.s = Or(t), this.c = jr(t));
  }
  setRot(t) {
    se && C.assert(t), this.s = t.s, this.c = t.c;
  }
  /** Set using an angle in radians. */
  setAngle(t) {
    se && console.assert(Number.isFinite(t)), this.s = Or(t), this.c = jr(t);
  }
  /** Get the angle in radians. */
  getAngle() {
    return Yc(this.s, this.c);
  }
  /** Get the x-axis. */
  getXAxis() {
    return p.neo(this.c, this.s);
  }
  /** Get the y-axis. */
  getYAxis() {
    return p.neo(-this.s, this.c);
  }
  static mul(t, e) {
    if (se && C.assert(t), "c" in e && "s" in e) {
      se && C.assert(e);
      const s = C.identity();
      return s.s = t.s * e.c + t.c * e.s, s.c = t.c * e.c - t.s * e.s, s;
    } else if ("x" in e && "y" in e)
      return se && p.assert(e), p.neo(t.c * e.x - t.s * e.y, t.s * e.x + t.c * e.y);
  }
  /** Multiply two rotations: q * r */
  static mulRot(t, e) {
    se && C.assert(t), se && C.assert(e);
    const s = C.identity();
    return s.s = t.s * e.c + t.c * e.s, s.c = t.c * e.c - t.s * e.s, s;
  }
  /** Rotate a vector */
  static mulVec2(t, e) {
    return se && C.assert(t), se && p.assert(e), p.neo(t.c * e.x - t.s * e.y, t.s * e.x + t.c * e.y);
  }
  static mulSub(t, e, s) {
    const i = t.c * (e.x - s.x) - t.s * (e.y - s.y), n = t.s * (e.x - s.x) + t.c * (e.y - s.y);
    return p.neo(i, n);
  }
  static mulT(t, e) {
    if ("c" in e && "s" in e) {
      se && C.assert(e);
      const s = C.identity();
      return s.s = t.c * e.s - t.s * e.c, s.c = t.c * e.c + t.s * e.s, s;
    } else if ("x" in e && "y" in e)
      return se && p.assert(e), p.neo(t.c * e.x + t.s * e.y, -t.s * e.x + t.c * e.y);
  }
  /** Transpose multiply two rotations: qT * r */
  static mulTRot(t, e) {
    se && C.assert(e);
    const s = C.identity();
    return s.s = t.c * e.s - t.s * e.c, s.c = t.c * e.c + t.s * e.s, s;
  }
  /** Inverse rotate a vector */
  static mulTVec2(t, e) {
    return se && p.assert(e), p.neo(t.c * e.x + t.s * e.y, -t.s * e.x + t.c * e.y);
  }
}
const $c = typeof ASSERT > "u" ? !1 : ASSERT, Hc = Math.atan2, Dr = Math.PI, ti = I(0, 0);
class Xs {
  /** Local center of mass position */
  localCenter = p.zero();
  /** World center position */
  c = p.zero();
  /** World angle */
  a = 0;
  /** Fraction of the current time step in the range [0,1], c0 and a0 are c and a at alpha0. */
  alpha0 = 0;
  c0 = p.zero();
  a0 = 0;
  /** @internal */
  recycle() {
    K(this.localCenter), K(this.c), this.a = 0, this.alpha0 = 0, K(this.c0), this.a0 = 0;
  }
  setTransform(t) {
    st(ti, t, this.localCenter), S(this.c, ti), S(this.c0, ti), this.a = this.a0 = Hc(t.q.s, t.q.c);
  }
  setLocalCenter(t, e) {
    S(this.localCenter, t), st(ti, e, this.localCenter), S(this.c, ti), S(this.c0, ti);
  }
  /**
   * Get the interpolated transform at a specific time.
   *
   * @param xf
   * @param beta A factor in [0,1], where 0 indicates alpha0
   */
  getTransform(t, e = 0) {
    jc(t.q, (1 - e) * this.a0 + e * this.a), Tt(t.p, 1 - e, this.c0, e, this.c), Ms(t.p, ke(ti, t.q, this.localCenter));
  }
  /**
   * Advance the sweep forward, yielding a new initial state.
   *
   * @param alpha The new initial time
   */
  advance(t) {
    $c && console.assert(this.alpha0 < 1);
    const e = (t - this.alpha0) / (1 - this.alpha0);
    Tt(this.c0, e, this.c, 1 - e, this.c0), this.a0 = e * this.a + (1 - e) * this.a0, this.alpha0 = t;
  }
  forward() {
    this.a0 = this.a, S(this.c0, this.c);
  }
  /**
   * normalize the angles in radians to be between -pi and pi.
   */
  normalize() {
    const t = Za(this.a0, -Dr, +Dr);
    this.a -= this.a0 - t, this.a0 = t;
  }
  set(t) {
    S(this.localCenter, t.localCenter), S(this.c, t.c), this.a = t.a, this.alpha0 = t.alpha0, S(this.c0, t.c0), this.a0 = t.a0;
  }
}
const ze = typeof ASSERT > "u" ? !1 : ASSERT, Uc = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY;
let le = class St {
  /** position */
  p;
  /** rotation */
  q;
  constructor(t, e) {
    if (Uc && !(this instanceof St))
      return new St(t, e);
    this.p = p.zero(), this.q = C.identity(), typeof t < "u" && this.p.setVec2(t), typeof e < "u" && this.q.setAngle(e);
  }
  static clone(t) {
    const e = Object.create(St.prototype);
    return e.p = p.clone(t.p), e.q = C.clone(t.q), e;
  }
  /** @hidden */
  static neo(t, e) {
    const s = Object.create(St.prototype);
    return s.p = p.clone(t), s.q = C.clone(e), s;
  }
  static identity() {
    const t = Object.create(St.prototype);
    return t.p = p.zero(), t.q = C.identity(), t;
  }
  /** Set this to the identity transform */
  setIdentity() {
    this.p.setZero(), this.q.setIdentity();
  }
  set(t, e) {
    typeof e > "u" ? (this.p.set(t.p), this.q.set(t.q)) : (this.p.set(t), this.q.set(e));
  }
  /** Set position and angle */
  setNum(t, e) {
    this.p.setVec2(t), this.q.setAngle(e);
  }
  setTransform(t) {
    this.p.setVec2(t.p), this.q.setRot(t.q);
  }
  static isValid(t) {
    return t === null || typeof t > "u" ? !1 : p.isValid(t.p) && C.isValid(t.q);
  }
  static assert(t) {
    ze && console.assert(!St.isValid(t), "Invalid Transform!", t);
  }
  // static mul(a: Transform, b: Vec2Value[]): Vec2[];
  // static mul(a: Transform, b: Transform[]): Transform[];
  static mul(t, e) {
    if (Array.isArray(e)) {
      ze && St.assert(t);
      const s = [];
      for (let i = 0; i < e.length; i++)
        s[i] = St.mul(t, e[i]);
      return s;
    } else {
      if ("x" in e && "y" in e)
        return St.mulVec2(t, e);
      if ("p" in e && "q" in e)
        return St.mulXf(t, e);
    }
  }
  static mulAll(t, e) {
    ze && St.assert(t);
    const s = [];
    for (let i = 0; i < e.length; i++)
      s[i] = St.mul(t, e[i]);
    return s;
  }
  /** @hidden @deprecated */
  static mulFn(t) {
    return ze && St.assert(t), function(e) {
      return St.mul(t, e);
    };
  }
  static mulVec2(t, e) {
    ze && St.assert(t), ze && p.assert(e);
    const s = t.q.c * e.x - t.q.s * e.y + t.p.x, i = t.q.s * e.x + t.q.c * e.y + t.p.y;
    return p.neo(s, i);
  }
  static mulXf(t, e) {
    ze && St.assert(t), ze && St.assert(e);
    const s = St.identity();
    return s.q = C.mulRot(t.q, e.q), s.p = p.add(C.mulVec2(t.q, e.p), t.p), s;
  }
  static mulT(t, e) {
    if ("x" in e && "y" in e)
      return St.mulTVec2(t, e);
    if ("p" in e && "q" in e)
      return St.mulTXf(t, e);
  }
  static mulTVec2(t, e) {
    ze && St.assert(t), ze && p.assert(e);
    const s = e.x - t.p.x, i = e.y - t.p.y, n = t.q.c * s + t.q.s * i, o = -t.q.s * s + t.q.c * i;
    return p.neo(n, o);
  }
  static mulTXf(t, e) {
    ze && St.assert(t), ze && St.assert(e);
    const s = St.identity();
    return s.q.setRot(C.mulTRot(t.q, e.q)), s.p.setVec2(C.mulTVec2(t.q, p.sub(e.p, t.p))), s;
  }
};
class Gc {
  /** linear */
  v = p.zero();
  /** angular */
  w = 0;
}
const oc = Math.sin, rc = Math.cos;
class Xc {
  /** location */
  c = p.zero();
  /** angle */
  a = 0;
  // todo: cache sin/cos
  getTransform(t, e) {
    return t.q.c = rc(this.a), t.q.s = oc(this.a), t.p.x = this.c.x - (t.q.c * e.x - t.q.s * e.y), t.p.y = this.c.y - (t.q.s * e.x + t.q.c * e.y), t;
  }
}
function An(_, t, e, s) {
  return _.q.c = rc(s), _.q.s = oc(s), _.p.x = e.x - (_.q.c * t.x - _.q.s * t.y), _.p.y = e.y - (_.q.s * t.x + _.q.c * t.y), _;
}
let Js = class {
  /** @hidden */
  m_type;
  /**
   * @hidden
   * Radius of a shape. For polygonal shapes this must be b2_polygonRadius.
   * There is no support for making rounded polygons.
   */
  m_radius;
  /** Styling for dev-tools. */
  style = {};
  /** @hidden @experimental Similar to userData, but used by dev-tools or runtime environment. */
  appData = {};
  static isValid(t) {
    return t === null || typeof t > "u" ? !1 : typeof t.m_type == "string" && typeof t.m_radius == "number";
  }
};
const Mo = typeof ASSERT > "u" ? !1 : ASSERT, Wr = new Ct(), Yr = new Ct(), $r = I(0, 0), Kc = {
  userData: null,
  friction: 0.2,
  restitution: 0,
  density: 0,
  isSensor: !1,
  filterGroupIndex: 0,
  filterCategoryBits: 1,
  filterMaskBits: 65535
};
class ir {
  aabb;
  fixture;
  childIndex;
  proxyId;
  constructor(t, e) {
    this.aabb = new Ct(), this.fixture = t, this.childIndex = e;
  }
}
class Ai {
  /** @internal */
  m_body;
  /** @internal */
  m_friction;
  /** @internal */
  m_restitution;
  /** @internal */
  m_density;
  /** @internal */
  m_isSensor;
  /** @internal */
  m_filterGroupIndex;
  /** @internal */
  m_filterCategoryBits;
  /** @internal */
  m_filterMaskBits;
  /** @internal */
  m_shape;
  /** @internal */
  m_next;
  /** @internal */
  m_proxies;
  // 0 indicates inactive state, this is not the same as m_proxies.length
  /** @internal */
  m_proxyCount;
  /** @internal */
  m_userData;
  /** Styling for dev-tools. */
  style = {};
  /** @hidden @experimental Similar to userData, but used by dev-tools or runtime environment. */
  appData = {};
  /** @internal */
  constructor(t, e, s) {
    e.shape ? (s = e, e = e.shape) : typeof s == "number" && (s = { density: s }), s = Ce(s, Kc), this.m_body = t, this.m_friction = s.friction, this.m_restitution = s.restitution, this.m_density = s.density, this.m_isSensor = s.isSensor, this.m_filterGroupIndex = s.filterGroupIndex, this.m_filterCategoryBits = s.filterCategoryBits, this.m_filterMaskBits = s.filterMaskBits, this.m_shape = e, this.m_next = null, this.m_proxies = [], this.m_proxyCount = 0;
    const i = this.m_shape.getChildCount();
    for (let n = 0; n < i; ++n)
      this.m_proxies[n] = new ir(this, n);
    this.m_userData = s.userData, typeof s.style == "object" && s.style !== null && (this.style = s.style);
  }
  /** @hidden Re-setup fixture. */
  _reset() {
    const t = this.getBody(), e = t.m_world.m_broadPhase;
    this.destroyProxies(e), this.m_shape._reset && this.m_shape._reset();
    const s = this.m_shape.getChildCount();
    for (let i = 0; i < s; ++i)
      this.m_proxies[i] = new ir(this, i);
    this.createProxies(e, t.m_xf), t.resetMassData();
  }
  /** @hidden */
  _serialize() {
    return {
      friction: this.m_friction,
      restitution: this.m_restitution,
      density: this.m_density,
      isSensor: this.m_isSensor,
      filterGroupIndex: this.m_filterGroupIndex,
      filterCategoryBits: this.m_filterCategoryBits,
      filterMaskBits: this.m_filterMaskBits,
      shape: this.m_shape
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    const i = s(Js, t.shape);
    return i && new Ai(e, i, t);
  }
  /**
   * Get the type of the child shape. You can use this to down cast to the
   * concrete shape.
   */
  getType() {
    return this.m_shape.m_type;
  }
  /**
   * Get the child shape. You can modify the child shape, however you should not
   * change the number of vertices because this will crash some collision caching
   * mechanisms. Manipulating the shape may lead to non-physical behavior.
   */
  getShape() {
    return this.m_shape;
  }
  /**
   * A sensor shape collects contact information but never generates a collision
   * response.
   */
  isSensor() {
    return this.m_isSensor;
  }
  /**
   * Set if this fixture is a sensor.
   */
  setSensor(t) {
    t != this.m_isSensor && (this.m_body.setAwake(!0), this.m_isSensor = t);
  }
  // /**
  //  * Get the contact filtering data.
  //  */
  // getFilterData() {
  //   return this.m_filter;
  // }
  /**
   * Get the user data that was assigned in the fixture definition. Use this to
   * store your application specific data.
   */
  getUserData() {
    return this.m_userData;
  }
  /**
   * Set the user data. Use this to store your application specific data.
   */
  setUserData(t) {
    this.m_userData = t;
  }
  /**
   * Get the parent body of this fixture. This is null if the fixture is not
   * attached.
   */
  getBody() {
    return this.m_body;
  }
  /**
   * Get the next fixture in the parent body's fixture list.
   */
  getNext() {
    return this.m_next;
  }
  /**
   * Get the density of this fixture.
   */
  getDensity() {
    return this.m_density;
  }
  /**
   * Set the density of this fixture. This will _not_ automatically adjust the
   * mass of the body. You must call Body.resetMassData to update the body's mass.
   */
  setDensity(t) {
    Mo && console.assert(Number.isFinite(t) && t >= 0), this.m_density = t;
  }
  /**
   * Get the coefficient of friction, usually in the range [0,1].
   */
  getFriction() {
    return this.m_friction;
  }
  /**
   * Set the coefficient of friction. This will not change the friction of
   * existing contacts.
   */
  setFriction(t) {
    this.m_friction = t;
  }
  /**
   * Get the coefficient of restitution.
   */
  getRestitution() {
    return this.m_restitution;
  }
  /**
   * Set the coefficient of restitution. This will not change the restitution of
   * existing contacts.
   */
  setRestitution(t) {
    this.m_restitution = t;
  }
  /**
   * Test a point in world coordinates for containment in this fixture.
   */
  testPoint(t) {
    return this.m_shape.testPoint(this.m_body.getTransform(), t);
  }
  /**
   * Cast a ray against this shape.
   */
  rayCast(t, e, s) {
    return this.m_shape.rayCast(t, e, this.m_body.getTransform(), s);
  }
  /**
   * Get the mass data for this fixture. The mass data is based on the density and
   * the shape. The rotational inertia is about the shape's origin. This operation
   * may be expensive.
   */
  getMassData(t) {
    this.m_shape.computeMass(t, this.m_density);
  }
  /**
   * Get the fixture's AABB. This AABB may be enlarge and/or stale. If you need a
   * more accurate AABB, compute it using the shape and the body transform.
   */
  getAABB(t) {
    return Mo && console.assert(0 <= t && t < this.m_proxies.length), this.m_proxies[t].aabb;
  }
  /**
   * These support body activation/deactivation.
   */
  createProxies(t, e) {
    Mo && console.assert(this.m_proxyCount == 0), this.m_proxyCount = this.m_shape.getChildCount();
    for (let s = 0; s < this.m_proxyCount; ++s) {
      const i = this.m_proxies[s];
      this.m_shape.computeAABB(i.aabb, e, s), i.proxyId = t.createProxy(i.aabb, i);
    }
  }
  destroyProxies(t) {
    for (let e = 0; e < this.m_proxyCount; ++e) {
      const s = this.m_proxies[e];
      t.destroyProxy(s.proxyId), s.proxyId = null;
    }
    this.m_proxyCount = 0;
  }
  /**
   * Updates this fixture proxy in broad-phase (with combined AABB of current and
   * next transformation).
   */
  synchronize(t, e, s) {
    for (let i = 0; i < this.m_proxyCount; ++i) {
      const n = this.m_proxies[i];
      this.m_shape.computeAABB(Wr, e, n.childIndex), this.m_shape.computeAABB(Yr, s, n.childIndex), n.aabb.combine(Wr, Yr), it($r, s.p, e.p), t.moveProxy(n.proxyId, n.aabb, $r);
    }
  }
  /**
   * Set the contact filtering data. This will not update contacts until the next
   * time step when either parent body is active and awake. This automatically
   * calls refilter.
   */
  setFilterData(t) {
    this.m_filterGroupIndex = t.groupIndex, this.m_filterCategoryBits = t.categoryBits, this.m_filterMaskBits = t.maskBits, this.refilter();
  }
  getFilterGroupIndex() {
    return this.m_filterGroupIndex;
  }
  setFilterGroupIndex(t) {
    this.m_filterGroupIndex = t, this.refilter();
  }
  getFilterCategoryBits() {
    return this.m_filterCategoryBits;
  }
  setFilterCategoryBits(t) {
    this.m_filterCategoryBits = t, this.refilter();
  }
  getFilterMaskBits() {
    return this.m_filterMaskBits;
  }
  setFilterMaskBits(t) {
    this.m_filterMaskBits = t, this.refilter();
  }
  /**
   * Call this if you want to establish collision that was previously disabled by
   * ContactFilter.
   */
  refilter() {
    if (this.m_body == null)
      return;
    let t = this.m_body.getContactList();
    for (; t; ) {
      const i = t.contact, n = i.getFixtureA(), o = i.getFixtureB();
      (n == this || o == this) && i.flagForFiltering(), t = t.next;
    }
    const e = this.m_body.getWorld();
    if (e == null)
      return;
    const s = e.m_broadPhase;
    for (let i = 0; i < this.m_proxyCount; ++i)
      s.touchProxy(this.m_proxies[i].proxyId);
  }
  /**
   * Implement this method to provide collision filtering, if you want finer
   * control over contact creation.
   *
   * Return true if contact calculations should be performed between these two
   * fixtures.
   *
   * Warning: for performance reasons this is only called when the AABBs begin to
   * overlap.
   */
  shouldCollide(t) {
    if (t.m_filterGroupIndex === this.m_filterGroupIndex && t.m_filterGroupIndex !== 0)
      return t.m_filterGroupIndex > 0;
    const e = (t.m_filterMaskBits & this.m_filterCategoryBits) !== 0, s = (t.m_filterCategoryBits & this.m_filterMaskBits) !== 0;
    return e && s;
  }
}
const Yt = typeof ASSERT > "u" ? !1 : ASSERT, pi = "static", Io = "kinematic", Fe = "dynamic", bn = I(0, 0), ei = I(0, 0), Bn = I(0, 0), wn = I(0, 0), Hr = bi(0, 0, 0), Zc = {
  type: pi,
  position: p.zero(),
  angle: 0,
  linearVelocity: p.zero(),
  angularVelocity: 0,
  linearDamping: 0,
  angularDamping: 0,
  fixedRotation: !1,
  bullet: !1,
  gravityScale: 1,
  allowSleep: !0,
  awake: !0,
  active: !0,
  userData: null
};
let ut = class ac {
  /** @hidden */
  static STATIC = "static";
  /** @hidden */
  static KINEMATIC = "kinematic";
  /** @hidden */
  static DYNAMIC = "dynamic";
  /** @internal */
  m_world;
  /** @internal */
  m_awakeFlag;
  /** @internal */
  m_autoSleepFlag;
  /** @internal */
  m_bulletFlag;
  /** @internal */
  m_fixedRotationFlag;
  /** @internal */
  m_activeFlag;
  /** @internal */
  m_islandFlag;
  /** @internal */
  m_toiFlag;
  /** @internal */
  m_userData;
  /** @internal */
  m_type;
  /** @internal */
  m_mass;
  /** @internal */
  m_invMass;
  /** @internal Rotational inertia about the center of mass. */
  m_I;
  /** @internal */
  m_invI;
  /** @internal the body origin transform */
  m_xf;
  /** @internal the swept motion for CCD */
  m_sweep;
  // position and velocity correction
  /** @internal */
  c_velocity;
  /** @internal */
  c_position;
  /** @internal */
  m_force;
  /** @internal */
  m_torque;
  /** @internal */
  m_linearVelocity;
  /** @internal */
  m_angularVelocity;
  /** @internal */
  m_linearDamping;
  /** @internal */
  m_angularDamping;
  /** @internal */
  m_gravityScale;
  /** @internal */
  m_sleepTime;
  /** @internal */
  m_jointList;
  /** @internal */
  m_contactList;
  /** @internal */
  m_fixtureList;
  /** @internal */
  m_prev;
  /** @internal */
  m_next;
  /** @internal */
  m_destroyed;
  /** Styling for dev-tools. */
  style = {};
  /** @hidden @experimental Similar to userData, but used by dev-tools or runtime environment. */
  appData = {};
  /** @internal */
  constructor(t, e) {
    e = Ce(e, Zc), Yt && console.assert(p.isValid(e.position)), Yt && console.assert(p.isValid(e.linearVelocity)), Yt && console.assert(Number.isFinite(e.angle)), Yt && console.assert(Number.isFinite(e.angularVelocity)), Yt && console.assert(Number.isFinite(e.angularDamping) && e.angularDamping >= 0), Yt && console.assert(Number.isFinite(e.linearDamping) && e.linearDamping >= 0), this.m_world = t, this.m_awakeFlag = e.awake, this.m_autoSleepFlag = e.allowSleep, this.m_bulletFlag = e.bullet, this.m_fixedRotationFlag = e.fixedRotation, this.m_activeFlag = e.active, this.m_islandFlag = !1, this.m_toiFlag = !1, this.m_userData = e.userData, this.m_type = e.type, this.m_type == Fe ? (this.m_mass = 1, this.m_invMass = 1) : (this.m_mass = 0, this.m_invMass = 0), this.m_I = 0, this.m_invI = 0, this.m_xf = le.identity(), this.m_xf.p.setVec2(e.position), this.m_xf.q.setAngle(e.angle), this.m_sweep = new Xs(), this.m_sweep.setTransform(this.m_xf), this.c_velocity = new Gc(), this.c_position = new Xc(), this.m_force = p.zero(), this.m_torque = 0, this.m_linearVelocity = p.clone(e.linearVelocity), this.m_angularVelocity = e.angularVelocity, this.m_linearDamping = e.linearDamping, this.m_angularDamping = e.angularDamping, this.m_gravityScale = e.gravityScale, this.m_sleepTime = 0, this.m_jointList = null, this.m_contactList = null, this.m_fixtureList = null, this.m_prev = null, this.m_next = null, this.m_destroyed = !1, typeof e.style == "object" && e.style !== null && (this.style = e.style);
  }
  /** @hidden */
  _serialize() {
    const t = [];
    for (let e = this.m_fixtureList; e; e = e.m_next)
      t.push(e);
    return {
      type: this.m_type,
      bullet: this.m_bulletFlag,
      position: this.m_xf.p,
      angle: this.m_xf.q.getAngle(),
      linearVelocity: this.m_linearVelocity,
      angularVelocity: this.m_angularVelocity,
      fixtures: t
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    const i = new ac(e, t);
    if (t.fixtures)
      for (let n = t.fixtures.length - 1; n >= 0; n--) {
        const o = s(Ai, t.fixtures[n], i);
        i._addFixture(o);
      }
    return i;
  }
  isWorldLocked() {
    return !!(this.m_world && this.m_world.isLocked());
  }
  getWorld() {
    return this.m_world;
  }
  getNext() {
    return this.m_next;
  }
  setUserData(t) {
    this.m_userData = t;
  }
  getUserData() {
    return this.m_userData;
  }
  getFixtureList() {
    return this.m_fixtureList;
  }
  getJointList() {
    return this.m_jointList;
  }
  /**
   * Warning: this list changes during the time step and you may miss some
   * collisions if you don't use ContactListener.
   */
  getContactList() {
    return this.m_contactList;
  }
  isStatic() {
    return this.m_type == pi;
  }
  isDynamic() {
    return this.m_type == Fe;
  }
  isKinematic() {
    return this.m_type == Io;
  }
  /**
   * This will alter the mass and velocity.
   */
  setStatic() {
    return this.setType(pi), this;
  }
  setDynamic() {
    return this.setType(Fe), this;
  }
  setKinematic() {
    return this.setType(Io), this;
  }
  /**
   * Get the type of the body.
   */
  getType() {
    return this.m_type;
  }
  /**
   * Set the type of the body to "static", "kinematic" or "dynamic".
   * @param type The type of the body.
   *
   * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
   */
  setType(t) {
    if (Yt && console.assert(t === pi || t === Io || t === Fe), Yt && console.assert(this.isWorldLocked() == !1), this.isWorldLocked() == !0 || this.m_type == t)
      return;
    this.m_type = t, this.resetMassData(), this.m_type == pi && (this.m_linearVelocity.setZero(), this.m_angularVelocity = 0, this.m_sweep.forward(), this.synchronizeFixtures()), this.setAwake(!0), this.m_force.setZero(), this.m_torque = 0;
    let e = this.m_contactList;
    for (; e; ) {
      const i = e;
      e = e.next, this.m_world.destroyContact(i.contact);
    }
    this.m_contactList = null;
    const s = this.m_world.m_broadPhase;
    for (let i = this.m_fixtureList; i; i = i.m_next)
      for (let n = 0; n < i.m_proxyCount; ++n)
        s.touchProxy(i.m_proxies[n].proxyId);
  }
  isBullet() {
    return this.m_bulletFlag;
  }
  /**
   * Should this body be treated like a bullet for continuous collision detection?
   */
  setBullet(t) {
    this.m_bulletFlag = !!t;
  }
  isSleepingAllowed() {
    return this.m_autoSleepFlag;
  }
  setSleepingAllowed(t) {
    this.m_autoSleepFlag = !!t, this.m_autoSleepFlag == !1 && this.setAwake(!0);
  }
  isAwake() {
    return this.m_awakeFlag;
  }
  /**
   * Set the sleep state of the body. A sleeping body has very low CPU cost.
   *
   * @param flag Set to true to wake the body, false to put it to sleep.
   */
  setAwake(t) {
    t ? (this.m_awakeFlag = !0, this.m_sleepTime = 0) : (this.m_awakeFlag = !1, this.m_sleepTime = 0, this.m_linearVelocity.setZero(), this.m_angularVelocity = 0, this.m_force.setZero(), this.m_torque = 0);
  }
  isActive() {
    return this.m_activeFlag;
  }
  /**
   * Set the active state of the body. An inactive body is not simulated and
   * cannot be collided with or woken up. If you pass a flag of true, all fixtures
   * will be added to the broad-phase. If you pass a flag of false, all fixtures
   * will be removed from the broad-phase and all contacts will be destroyed.
   * Fixtures and joints are otherwise unaffected.
   *
   * You may continue to create/destroy fixtures and joints on inactive bodies.
   * Fixtures on an inactive body are implicitly inactive and will not participate
   * in collisions, ray-casts, or queries. Joints connected to an inactive body
   * are implicitly inactive. An inactive body is still owned by a World object
   * and remains
   *
   * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
   */
  setActive(t) {
    if (Yt && console.assert(this.isWorldLocked() == !1), t != this.m_activeFlag)
      if (this.m_activeFlag = !!t, this.m_activeFlag) {
        const e = this.m_world.m_broadPhase;
        for (let s = this.m_fixtureList; s; s = s.m_next)
          s.createProxies(e, this.m_xf);
        this.m_world.m_newFixture = !0;
      } else {
        const e = this.m_world.m_broadPhase;
        for (let i = this.m_fixtureList; i; i = i.m_next)
          i.destroyProxies(e);
        let s = this.m_contactList;
        for (; s; ) {
          const i = s;
          s = s.next, this.m_world.destroyContact(i.contact);
        }
        this.m_contactList = null;
      }
  }
  isFixedRotation() {
    return this.m_fixedRotationFlag;
  }
  /**
   * Set this body to have fixed rotation. This causes the mass to be reset.
   */
  setFixedRotation(t) {
    this.m_fixedRotationFlag != t && (this.m_fixedRotationFlag = !!t, this.m_angularVelocity = 0, this.resetMassData());
  }
  /**
   * Get the world transform for the body's origin.
   */
  getTransform() {
    return this.m_xf;
  }
  setTransform(t, e) {
    if (Yt && console.assert(this.isWorldLocked() == !1), this.isWorldLocked() == !0)
      return;
    typeof e == "number" ? this.m_xf.setNum(t, e) : this.m_xf.setTransform(t), this.m_sweep.setTransform(this.m_xf);
    const s = this.m_world.m_broadPhase;
    for (let i = this.m_fixtureList; i; i = i.m_next)
      i.synchronize(s, this.m_xf, this.m_xf);
    this.setAwake(!0);
  }
  synchronizeTransform() {
    this.m_sweep.getTransform(this.m_xf, 1);
  }
  /**
   * Update fixtures in broad-phase.
   */
  synchronizeFixtures() {
    this.m_sweep.getTransform(Hr, 0);
    const t = this.m_world.m_broadPhase;
    for (let e = this.m_fixtureList; e; e = e.m_next)
      e.synchronize(t, Hr, this.m_xf);
  }
  /**
   * Used in TOI.
   */
  advance(t) {
    this.m_sweep.advance(t), S(this.m_sweep.c, this.m_sweep.c0), this.m_sweep.a = this.m_sweep.a0, this.m_sweep.getTransform(this.m_xf, 1);
  }
  /**
   * Get the world position for the body's origin.
   */
  getPosition() {
    return this.m_xf.p;
  }
  setPosition(t) {
    this.setTransform(t, this.m_sweep.a);
  }
  /**
   * Get the current world rotation angle in radians.
   */
  getAngle() {
    return this.m_sweep.a;
  }
  setAngle(t) {
    this.setTransform(this.m_xf.p, t);
  }
  /**
   * Get the world position of the center of mass.
   */
  getWorldCenter() {
    return this.m_sweep.c;
  }
  /**
   * Get the local position of the center of mass.
   */
  getLocalCenter() {
    return this.m_sweep.localCenter;
  }
  /**
   * Get the linear velocity of the center of mass.
   *
   * @return the linear velocity of the center of mass.
   */
  getLinearVelocity() {
    return this.m_linearVelocity;
  }
  /**
   * Get the world linear velocity of a world point attached to this body.
   *
   * @param worldPoint A point in world coordinates.
   */
  getLinearVelocityFromWorldPoint(t) {
    const e = p.sub(t, this.m_sweep.c);
    return p.add(this.m_linearVelocity, p.crossNumVec2(this.m_angularVelocity, e));
  }
  /**
   * Get the world velocity of a local point.
   *
   * @param localPoint A point in local coordinates.
   */
  getLinearVelocityFromLocalPoint(t) {
    return this.getLinearVelocityFromWorldPoint(this.getWorldPoint(t));
  }
  /**
   * Set the linear velocity of the center of mass.
   *
   * @param v The new linear velocity of the center of mass.
   */
  setLinearVelocity(t) {
    this.m_type != pi && (p.dot(t, t) > 0 && this.setAwake(!0), this.m_linearVelocity.setVec2(t));
  }
  /**
   * Get the angular velocity.
   *
   * @returns the angular velocity in radians/second.
   */
  getAngularVelocity() {
    return this.m_angularVelocity;
  }
  /**
   * Set the angular velocity.
   *
   * @param w The new angular velocity in radians/second.
   */
  setAngularVelocity(t) {
    this.m_type != pi && (t * t > 0 && this.setAwake(!0), this.m_angularVelocity = t);
  }
  getLinearDamping() {
    return this.m_linearDamping;
  }
  setLinearDamping(t) {
    this.m_linearDamping = t;
  }
  getAngularDamping() {
    return this.m_angularDamping;
  }
  setAngularDamping(t) {
    this.m_angularDamping = t;
  }
  getGravityScale() {
    return this.m_gravityScale;
  }
  /**
   * Scale the gravity applied to this body.
   */
  setGravityScale(t) {
    this.m_gravityScale = t;
  }
  /**
   * Get the total mass of the body.
   *
   * @returns The mass, usually in kilograms (kg).
   */
  getMass() {
    return this.m_mass;
  }
  /**
   * Get the rotational inertia of the body about the local origin.
   *
   * @return the rotational inertia, usually in kg-m^2.
   */
  getInertia() {
    return this.m_I + this.m_mass * p.dot(this.m_sweep.localCenter, this.m_sweep.localCenter);
  }
  /**
   * Copy the mass data of the body to data.
   */
  getMassData(t) {
    t.mass = this.m_mass, t.I = this.getInertia(), S(t.center, this.m_sweep.localCenter);
  }
  /**
   * This resets the mass properties to the sum of the mass properties of the
   * fixtures. This normally does not need to be called unless you called
   * SetMassData to override the mass and you later want to reset the mass.
   */
  resetMassData() {
    if (this.m_mass = 0, this.m_invMass = 0, this.m_I = 0, this.m_invI = 0, K(this.m_sweep.localCenter), this.isStatic() || this.isKinematic()) {
      S(this.m_sweep.c0, this.m_xf.p), S(this.m_sweep.c, this.m_xf.p), this.m_sweep.a0 = this.m_sweep.a;
      return;
    }
    Yt && console.assert(this.isDynamic()), K(ei);
    for (let t = this.m_fixtureList; t; t = t.m_next) {
      if (t.m_density == 0)
        continue;
      const e = {
        mass: 0,
        center: I(0, 0),
        I: 0
      };
      t.getMassData(e), this.m_mass += e.mass, Ze(ei, e.mass, e.center), this.m_I += e.I;
    }
    this.m_mass > 0 ? (this.m_invMass = 1 / this.m_mass, Z(ei, this.m_invMass, ei)) : (this.m_mass = 1, this.m_invMass = 1), this.m_I > 0 && this.m_fixedRotationFlag == !1 ? (this.m_I -= this.m_mass * L(ei, ei), Yt && console.assert(this.m_I > 0), this.m_invI = 1 / this.m_I) : (this.m_I = 0, this.m_invI = 0), S(bn, this.m_sweep.c), this.m_sweep.setLocalCenter(ei, this.m_xf), it(Bn, this.m_sweep.c, bn), we(wn, this.m_angularVelocity, Bn), Ne(this.m_linearVelocity, wn);
  }
  /**
   * Set the mass properties to override the mass properties of the fixtures. Note
   * that this changes the center of mass position. Note that creating or
   * destroying fixtures can also alter the mass. This function has no effect if
   * the body isn't dynamic.
   *
   * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
   *
   * @param massData The mass properties.
   */
  setMassData(t) {
    Yt && console.assert(this.isWorldLocked() == !1), this.isWorldLocked() != !0 && this.m_type == Fe && (this.m_invMass = 0, this.m_I = 0, this.m_invI = 0, this.m_mass = t.mass, this.m_mass <= 0 && (this.m_mass = 1), this.m_invMass = 1 / this.m_mass, t.I > 0 && this.m_fixedRotationFlag == !1 && (this.m_I = t.I - this.m_mass * L(t.center, t.center), Yt && console.assert(this.m_I > 0), this.m_invI = 1 / this.m_I), S(bn, this.m_sweep.c), this.m_sweep.setLocalCenter(t.center, this.m_xf), it(Bn, this.m_sweep.c, bn), we(wn, this.m_angularVelocity, Bn), Ne(this.m_linearVelocity, wn));
  }
  /**
   * Apply a force at a world point. If the force is not applied at the center of
   * mass, it will generate a torque and affect the angular velocity. This wakes
   * up the body.
   *
   * @param force The world force vector, usually in Newtons (N).
   * @param point The world position of the point of application.
   * @param wake Also wake up the body
   */
  applyForce(t, e, s = !0) {
    this.m_type == Fe && (s && this.m_awakeFlag == !1 && this.setAwake(!0), this.m_awakeFlag && (this.m_force.add(t), this.m_torque += p.crossVec2Vec2(p.sub(e, this.m_sweep.c), t)));
  }
  /**
   * Apply a force to the center of mass. This wakes up the body.
   *
   * @param force The world force vector, usually in Newtons (N).
   * @param wake Also wake up the body
   */
  applyForceToCenter(t, e = !0) {
    this.m_type == Fe && (e && this.m_awakeFlag == !1 && this.setAwake(!0), this.m_awakeFlag && this.m_force.add(t));
  }
  /**
   * Apply a torque. This affects the angular velocity without affecting the
   * linear velocity of the center of mass. This wakes up the body.
   *
   * @param torque About the z-axis (out of the screen), usually in N-m.
   * @param wake Also wake up the body
   */
  applyTorque(t, e = !0) {
    this.m_type == Fe && (e && this.m_awakeFlag == !1 && this.setAwake(!0), this.m_awakeFlag && (this.m_torque += t));
  }
  /**
   * Apply an impulse at a point. This immediately modifies the velocity. It also
   * modifies the angular velocity if the point of application is not at the
   * center of mass. This wakes up the body.
   *
   * @param impulse The world impulse vector, usually in N-seconds or kg-m/s.
   * @param point The world position of the point of application.
   * @param wake Also wake up the body
   */
  applyLinearImpulse(t, e, s = !0) {
    this.m_type == Fe && (s && this.m_awakeFlag == !1 && this.setAwake(!0), this.m_awakeFlag && (this.m_linearVelocity.addMul(this.m_invMass, t), this.m_angularVelocity += this.m_invI * p.crossVec2Vec2(p.sub(e, this.m_sweep.c), t)));
  }
  /**
   * Apply an angular impulse.
   *
   * @param impulse The angular impulse in units of kg*m*m/s
   * @param wake Also wake up the body
   */
  applyAngularImpulse(t, e = !0) {
    this.m_type == Fe && (e && this.m_awakeFlag == !1 && this.setAwake(!0), this.m_awakeFlag && (this.m_angularVelocity += this.m_invI * t));
  }
  /**
   * This is used to test if two bodies should collide.
   *
   * Bodies do not collide when:
   * - Neither of them is dynamic
   * - They are connected by a joint with collideConnected == false
   */
  shouldCollide(t) {
    if (this.m_type != Fe && t.m_type != Fe)
      return !1;
    for (let e = this.m_jointList; e; e = e.next)
      if (e.other == t && e.joint.m_collideConnected == !1)
        return !1;
    return !0;
  }
  /** @internal Used for deserialize. */
  _addFixture(t) {
    if (Yt && console.assert(this.isWorldLocked() == !1), this.isWorldLocked() == !0)
      return null;
    if (this.m_activeFlag) {
      const e = this.m_world.m_broadPhase;
      t.createProxies(e, this.m_xf);
    }
    return t.m_next = this.m_fixtureList, this.m_fixtureList = t, t.m_density > 0 && this.resetMassData(), this.m_world.m_newFixture = !0, t;
  }
  // tslint:disable-next-line:typedef
  createFixture(t, e) {
    if (Yt && console.assert(this.isWorldLocked() == !1), this.isWorldLocked() == !0)
      return null;
    const s = new Ai(this, t, e);
    return this._addFixture(s), s;
  }
  /**
   * Destroy a fixture. This removes the fixture from the broad-phase and destroys
   * all contacts associated with this fixture. This will automatically adjust the
   * mass of the body if the body is dynamic and the fixture has positive density.
   * All fixtures attached to a body are implicitly destroyed when the body is
   * destroyed.
   *
   * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
   *
   * @param fixture The fixture to be removed.
   */
  destroyFixture(t) {
    if (Yt && console.assert(this.isWorldLocked() == !1), this.isWorldLocked() == !0)
      return;
    Yt && console.assert(t.m_body == this);
    let e = !1;
    if (this.m_fixtureList === t)
      this.m_fixtureList = t.m_next, e = !0;
    else {
      let i = this.m_fixtureList;
      for (; i != null; ) {
        if (i.m_next === t) {
          i.m_next = t.m_next, e = !0;
          break;
        }
        i = i.m_next;
      }
    }
    Yt && console.assert(e);
    let s = this.m_contactList;
    for (; s; ) {
      const i = s.contact;
      s = s.next;
      const n = i.getFixtureA(), o = i.getFixtureB();
      (t == n || t == o) && this.m_world.destroyContact(i);
    }
    if (this.m_activeFlag) {
      const i = this.m_world.m_broadPhase;
      t.destroyProxies(i);
    }
    t.m_body = null, t.m_next = null, this.m_world.publish("remove-fixture", t), this.resetMassData();
  }
  /**
   * Get the corresponding world point of a local point.
   */
  getWorldPoint(t) {
    return le.mulVec2(this.m_xf, t);
  }
  /**
   * Get the corresponding world vector of a local vector.
   */
  getWorldVector(t) {
    return C.mulVec2(this.m_xf.q, t);
  }
  /**
   * Gets the corresponding local point of a world point.
   */
  getLocalPoint(t) {
    return le.mulTVec2(this.m_xf, t);
  }
  /**
   * Gets the corresponding local vector of a world vector.
   */
  getLocalVector(t) {
    return C.mulTVec2(this.m_xf.q, t);
  }
};
const Po = typeof ASSERT > "u" ? !1 : ASSERT;
class nr {
  /**
   * provides quick access to the other body attached.
   */
  other = null;
  /**
   * the joint
   */
  joint = null;
  /**
   * prev the previous joint edge in the body's joint list
   */
  prev = null;
  /**
   * the next joint edge in the body's joint list
   */
  next = null;
}
class te {
  /** @internal */
  m_type = "unknown-joint";
  /** @internal */
  m_bodyA;
  /** @internal */
  m_bodyB;
  /** @internal */
  m_collideConnected;
  /** @internal */
  m_prev = null;
  /** @internal */
  m_next = null;
  /** @internal */
  m_edgeA = new nr();
  /** @internal */
  m_edgeB = new nr();
  /** @internal */
  m_islandFlag = !1;
  /** @internal */
  m_userData;
  /** Styling for dev-tools. */
  style = {};
  /** @hidden @experimental Similar to userData, but used by dev-tools or runtime environment. */
  appData = {};
  constructor(t, e, s) {
    e = "bodyA" in t ? t.bodyA : e, s = "bodyB" in t ? t.bodyB : s, Po && console.assert(!!e), Po && console.assert(!!s), Po && console.assert(e != s), this.m_bodyA = e, this.m_bodyB = s, this.m_collideConnected = !!t.collideConnected, this.m_userData = t.userData, typeof t.style == "object" && t.style !== null && (this.style = t.style);
  }
  /**
   * Short-cut function to determine if either body is inactive.
   */
  isActive() {
    return this.m_bodyA.isActive() && this.m_bodyB.isActive();
  }
  /**
   * Get the type of the concrete joint.
   */
  getType() {
    return this.m_type;
  }
  /**
   * Get the first body attached to this joint.
   */
  getBodyA() {
    return this.m_bodyA;
  }
  /**
   * Get the second body attached to this joint.
   */
  getBodyB() {
    return this.m_bodyB;
  }
  /**
   * Get the next joint the world joint list.
   */
  getNext() {
    return this.m_next;
  }
  getUserData() {
    return this.m_userData;
  }
  setUserData(t) {
    this.m_userData = t;
  }
  /**
   * Get collide connected. Note: modifying the collide connect flag won't work
   * correctly because the flag is only checked when fixture AABBs begin to
   * overlap.
   */
  getCollideConnected() {
    return this.m_collideConnected;
  }
  /**
   * Shift the origin for any points stored in world coordinates.
   */
  shiftOrigin(t) {
  }
  /**
   * @internal @deprecated
   * Temporary for backward compatibility, will be removed.
   */
  _resetAnchors(t) {
    return this._reset(t);
  }
}
const bt = {
  gjkCalls: 0,
  gjkIters: 0,
  gjkMaxIters: 0,
  toiTime: 0,
  toiMaxTime: 0,
  toiCalls: 0,
  toiIters: 0,
  toiMaxIters: 0,
  toiRootIters: 0,
  toiMaxRootIters: 0,
  toString(_) {
    _ = typeof _ == "string" ? _ : `
`;
    let t = "";
    for (const e in this)
      typeof this[e] != "function" && typeof this[e] != "object" && (t += e + ": " + this[e] + _);
    return t;
  }
}, Jc = function() {
  return Date.now();
}, Qc = function(_) {
  return Date.now() - _;
}, Ur = {
  now: Jc,
  diff: Qc
}, Se = typeof ASSERT > "u" ? !1 : ASSERT, no = Math.max, Sn = I(0, 0), Cn = I(0, 0), be = I(0, 0), Tn = I(0, 0), Vo = I(0, 0), tl = I(0, 0), el = I(0, 0);
bt.gjkCalls = 0;
bt.gjkIters = 0;
bt.gjkMaxIters = 0;
class mo {
  proxyA = new Ks();
  proxyB = new Ks();
  transformA = le.identity();
  transformB = le.identity();
  useRadii = !1;
  recycle() {
    this.proxyA.recycle(), this.proxyB.recycle(), this.transformA.setIdentity(), this.transformB.setIdentity(), this.useRadii = !1;
  }
}
class uo {
  /** closest point on shapeA */
  pointA = I(0, 0);
  /** closest point on shapeB */
  pointB = I(0, 0);
  distance = 0;
  /** iterations number of GJK iterations used */
  iterations = 0;
  recycle() {
    K(this.pointA), K(this.pointB), this.distance = 0, this.iterations = 0;
  }
}
class po {
  /** length or area */
  metric = 0;
  /** vertices on shape A */
  indexA = [];
  /** vertices on shape B */
  indexB = [];
  count = 0;
  recycle() {
    this.metric = 0, this.indexA.length = 0, this.indexB.length = 0, this.count = 0;
  }
}
const Vs = function(_, t, e) {
  ++bt.gjkCalls;
  const s = e.proxyA, i = e.proxyB, n = e.transformA, o = e.transformB;
  De.recycle(), De.readCache(t, s, n, i, o);
  const r = De.m_v, a = O.maxDistanceIterations, c = [], l = [];
  let m = 0, h = 0;
  for (; h < a; ) {
    m = De.m_count;
    for (let y = 0; y < m; ++y)
      c[y] = r[y].indexA, l[y] = r[y].indexB;
    if (De.solve(), De.m_count === 3)
      break;
    const u = De.getSearchDirection();
    if (xi(u) < qt * qt)
      break;
    const d = r[De.m_count];
    d.indexA = s.getSupport(ki(Sn, n.q, Z(Sn, -1, u))), st(d.wA, n, s.getVertex(d.indexA)), d.indexB = i.getSupport(ki(Sn, o.q, u)), st(d.wB, o, i.getVertex(d.indexB)), it(d.w, d.wB, d.wA), ++h, ++bt.gjkIters;
    let f = !1;
    for (let y = 0; y < m; ++y)
      if (d.indexA === c[y] && d.indexB === l[y]) {
        f = !0;
        break;
      }
    if (f)
      break;
    ++De.m_count;
  }
  if (bt.gjkMaxIters = no(bt.gjkMaxIters, h), De.getWitnessPoints(_.pointA, _.pointB), _.distance = sc(_.pointA, _.pointB), _.iterations = h, De.writeCache(t), e.useRadii) {
    const u = s.m_radius, d = i.m_radius;
    if (_.distance > u + d && _.distance > qt)
      _.distance -= u + d, it(Cn, _.pointB, _.pointA), ts(Cn), Ze(_.pointA, u, Cn), an(_.pointB, d, Cn);
    else {
      const f = it(Sn, _.pointA, _.pointB);
      S(_.pointA, f), S(_.pointB, f), _.distance = 0;
    }
  }
};
class Ks {
  /** @internal */
  m_vertices = [];
  // todo: remove this?
  /** @internal */
  m_count = 0;
  /** @internal */
  m_radius = 0;
  recycle() {
    this.m_vertices.length = 0, this.m_count = 0, this.m_radius = 0;
  }
  /**
   * Get the vertex count.
   */
  getVertexCount() {
    return this.m_count;
  }
  /**
   * Get a vertex by index. Used by Distance.
   */
  getVertex(t) {
    return Se && console.assert(0 <= t && t < this.m_count), this.m_vertices[t];
  }
  /**
   * Get the supporting vertex index in the given direction.
   */
  getSupport(t) {
    let e = -1, s = -1 / 0;
    for (let i = 0; i < this.m_count; ++i) {
      const n = L(this.m_vertices[i], t);
      n > s && (e = i, s = n);
    }
    return e;
  }
  /**
   * Get the supporting vertex in the given direction.
   */
  getSupportVertex(t) {
    return this.m_vertices[this.getSupport(t)];
  }
  /**
   * Initialize the proxy using the given shape. The shape must remain in scope
   * while the proxy is in use.
   */
  set(t, e) {
    Se && console.assert(typeof t.computeDistanceProxy == "function"), t.computeDistanceProxy(this, e);
  }
  /**
   * Initialize the proxy using a vertex cloud and radius. The vertices
   * must remain in scope while the proxy is in use.
   */
  setVertices(t, e, s) {
    this.m_vertices = t, this.m_count = e, this.m_radius = s;
  }
}
class zo {
  /** support point in proxyA */
  wA = I(0, 0);
  /** wA index */
  indexA = 0;
  /** support point in proxyB */
  wB = I(0, 0);
  /** wB index */
  indexB = 0;
  /** wB - wA; */
  w = I(0, 0);
  /** barycentric coordinate for closest point */
  a = 0;
  recycle() {
    this.indexA = 0, this.indexB = 0, K(this.wA), K(this.wB), K(this.w), this.a = 0;
  }
  set(t) {
    this.indexA = t.indexA, this.indexB = t.indexB, S(this.wA, t.wA), S(this.wB, t.wB), S(this.w, t.w), this.a = t.a;
  }
}
const Mn = I(0, 0), Yi = I(0, 0);
class cc {
  m_v1 = new zo();
  m_v2 = new zo();
  m_v3 = new zo();
  m_v = [this.m_v1, this.m_v2, this.m_v3];
  m_count;
  recycle() {
    this.m_v1.recycle(), this.m_v2.recycle(), this.m_v3.recycle(), this.m_count = 0;
  }
  /** @internal */
  toString() {
    return this.m_count === 3 ? [
      "+" + this.m_count,
      this.m_v1.a,
      this.m_v1.wA.x,
      this.m_v1.wA.y,
      this.m_v1.wB.x,
      this.m_v1.wB.y,
      this.m_v2.a,
      this.m_v2.wA.x,
      this.m_v2.wA.y,
      this.m_v2.wB.x,
      this.m_v2.wB.y,
      this.m_v3.a,
      this.m_v3.wA.x,
      this.m_v3.wA.y,
      this.m_v3.wB.x,
      this.m_v3.wB.y
    ].toString() : this.m_count === 2 ? [
      "+" + this.m_count,
      this.m_v1.a,
      this.m_v1.wA.x,
      this.m_v1.wA.y,
      this.m_v1.wB.x,
      this.m_v1.wB.y,
      this.m_v2.a,
      this.m_v2.wA.x,
      this.m_v2.wA.y,
      this.m_v2.wB.x,
      this.m_v2.wB.y
    ].toString() : this.m_count === 1 ? [
      "+" + this.m_count,
      this.m_v1.a,
      this.m_v1.wA.x,
      this.m_v1.wA.y,
      this.m_v1.wB.x,
      this.m_v1.wB.y
    ].toString() : "+" + this.m_count;
  }
  readCache(t, e, s, i, n) {
    Se && console.assert(t.count <= 3), this.m_count = t.count;
    for (let o = 0; o < this.m_count; ++o) {
      const r = this.m_v[o];
      r.indexA = t.indexA[o], r.indexB = t.indexB[o];
      const a = e.getVertex(r.indexA), c = i.getVertex(r.indexB);
      st(r.wA, s, a), st(r.wB, n, c), it(r.w, r.wB, r.wA), r.a = 0;
    }
    if (this.m_count > 1) {
      const o = t.metric, r = this.getMetric();
      (r < 0.5 * o || 2 * o < r || r < qt) && (this.m_count = 0);
    }
    if (this.m_count === 0) {
      const o = this.m_v[0];
      o.indexA = 0, o.indexB = 0;
      const r = e.getVertex(0), a = i.getVertex(0);
      st(o.wA, s, r), st(o.wB, n, a), it(o.w, o.wB, o.wA), o.a = 1, this.m_count = 1;
    }
  }
  writeCache(t) {
    t.metric = this.getMetric(), t.count = this.m_count;
    for (let e = 0; e < this.m_count; ++e)
      t.indexA[e] = this.m_v[e].indexA, t.indexB[e] = this.m_v[e].indexB;
  }
  getSearchDirection() {
    const t = this.m_v1, e = this.m_v2;
    switch (this.m_count) {
      case 1:
        return Zt(Mn, -t.w.x, -t.w.y);
      case 2:
        return it(be, e.w, t.w), -rt(be, t.w) > 0 ? Zt(Mn, -be.y, be.x) : Zt(Mn, be.y, -be.x);
      default:
        return Se && console.assert(!1), K(Mn);
    }
  }
  getClosestPoint() {
    const t = this.m_v1, e = this.m_v2;
    switch (this.m_count) {
      case 0:
        return Se && console.assert(!1), K(Yi);
      case 1:
        return S(Yi, t.w);
      case 2:
        return Tt(Yi, t.a, t.w, e.a, e.w);
      case 3:
        return K(Yi);
      default:
        return Se && console.assert(!1), K(Yi);
    }
  }
  getWitnessPoints(t, e) {
    const s = this.m_v1, i = this.m_v2, n = this.m_v3;
    switch (this.m_count) {
      case 0:
        Se && console.assert(!1);
        break;
      case 1:
        S(t, s.wA), S(e, s.wB);
        break;
      case 2:
        Tt(t, s.a, s.wA, i.a, i.wA), Tt(e, s.a, s.wB, i.a, i.wB);
        break;
      case 3:
        ds(t, s.a, s.wA, i.a, i.wA, n.a, n.wA), S(e, t);
        break;
      default:
        Se && console.assert(!1);
        break;
    }
  }
  getMetric() {
    switch (this.m_count) {
      case 0:
        return Se && console.assert(!1), 0;
      case 1:
        return 0;
      case 2:
        return sc(this.m_v1.w, this.m_v2.w);
      case 3:
        return rt(
          it(tl, this.m_v2.w, this.m_v1.w),
          it(el, this.m_v3.w, this.m_v1.w)
        );
      default:
        return Se && console.assert(!1), 0;
    }
  }
  solve() {
    switch (this.m_count) {
      case 1:
        break;
      case 2:
        this.solve2();
        break;
      case 3:
        this.solve3();
        break;
      default:
        Se && console.assert(!1);
    }
  }
  // Solve a line segment using barycentric coordinates.
  //
  // p = a1 * w1 + a2 * w2
  // a1 + a2 = 1
  //
  // The vector from the origin to the closest point on the line is
  // perpendicular to the line.
  // e12 = w2 - w1
  // dot(p, e) = 0
  // a1 * dot(w1, e) + a2 * dot(w2, e) = 0
  //
  // 2-by-2 linear system
  // [1 1 ][a1] = [1]
  // [w1.e12 w2.e12][a2] = [0]
  //
  // Define
  // d12_1 = dot(w2, e12)
  // d12_2 = -dot(w1, e12)
  // d12 = d12_1 + d12_2
  //
  // Solution
  // a1 = d12_1 / d12
  // a2 = d12_2 / d12
  solve2() {
    const t = this.m_v1.w, e = this.m_v2.w;
    it(be, e, t);
    const s = -L(t, be);
    if (s <= 0) {
      this.m_v1.a = 1, this.m_count = 1;
      return;
    }
    const i = L(e, be);
    if (i <= 0) {
      this.m_v2.a = 1, this.m_count = 1, this.m_v1.set(this.m_v2);
      return;
    }
    const n = 1 / (i + s);
    this.m_v1.a = i * n, this.m_v2.a = s * n, this.m_count = 2;
  }
  // Possible regions:
  // - points[2]
  // - edge points[0]-points[2]
  // - edge points[1]-points[2]
  // - inside the triangle
  solve3() {
    const t = this.m_v1.w, e = this.m_v2.w, s = this.m_v3.w;
    it(be, e, t);
    const i = L(t, be), o = L(e, be), r = -i;
    it(Tn, s, t);
    const a = L(t, Tn), l = L(s, Tn), m = -a;
    it(Vo, s, e);
    const h = L(e, Vo), d = L(s, Vo), f = -h, y = rt(be, Tn), v = y * rt(e, s), g = y * rt(s, t), A = y * rt(t, e);
    if (r <= 0 && m <= 0) {
      this.m_v1.a = 1, this.m_count = 1;
      return;
    }
    if (o > 0 && r > 0 && A <= 0) {
      const B = 1 / (o + r);
      this.m_v1.a = o * B, this.m_v2.a = r * B, this.m_count = 2;
      return;
    }
    if (l > 0 && m > 0 && g <= 0) {
      const B = 1 / (l + m);
      this.m_v1.a = l * B, this.m_v3.a = m * B, this.m_count = 2, this.m_v2.set(this.m_v3);
      return;
    }
    if (o <= 0 && f <= 0) {
      this.m_v2.a = 1, this.m_count = 1, this.m_v1.set(this.m_v2);
      return;
    }
    if (l <= 0 && d <= 0) {
      this.m_v3.a = 1, this.m_count = 1, this.m_v1.set(this.m_v3);
      return;
    }
    if (d > 0 && f > 0 && v <= 0) {
      const B = 1 / (d + f);
      this.m_v2.a = d * B, this.m_v3.a = f * B, this.m_count = 2, this.m_v1.set(this.m_v3);
      return;
    }
    const b = 1 / (v + g + A);
    this.m_v1.a = v * b, this.m_v2.a = g * b, this.m_v3.a = A * b, this.m_count = 3;
  }
}
const De = new cc(), si = new mo(), Gr = new po(), Fo = new uo(), xr = function(_, t, e, s, i, n) {
  return si.recycle(), si.proxyA.set(_, t), si.proxyB.set(e, s), co(si.transformA, i), co(si.transformB, n), si.useRadii = !0, Fo.recycle(), Gr.recycle(), Vs(Fo, Gr, si), Fo.distance < 10 * qt;
};
Vs.testOverlap = xr;
Vs.Input = mo;
Vs.Output = uo;
Vs.Proxy = Ks;
Vs.Cache = po;
class sl {
  proxyA = new Ks();
  proxyB = new Ks();
  transformA = le.identity();
  transformB = le.identity();
  translationB = p.zero();
  recycle() {
    this.proxyA.recycle(), this.proxyB.recycle(), this.transformA.setIdentity(), this.transformB.setIdentity(), K(this.translationB);
  }
}
class il {
  point = p.zero();
  normal = p.zero();
  lambda = 1;
  iterations = 0;
}
const nl = function(_, t) {
  _.iterations = 0, _.lambda = 1, _.normal.setZero(), _.point.setZero();
  const e = t.proxyA, s = t.proxyB, i = no(e.m_radius, O.polygonRadius), n = no(s.m_radius, O.polygonRadius), o = i + n, r = t.transformA, a = t.transformB, c = t.translationB, l = p.zero();
  let m = 0;
  const h = new cc();
  h.m_count = 0;
  const u = h.m_v;
  let d = e.getSupport(C.mulTVec2(r.q, p.neg(c))), f = le.mulVec2(r, e.getVertex(d)), y = s.getSupport(C.mulTVec2(a.q, c)), v = le.mulVec2(a, s.getVertex(y));
  const g = p.sub(f, v), A = no(O.polygonRadius, o - O.polygonRadius), b = 0.5 * O.linearSlop, B = 20;
  let w = 0;
  for (; w < B && g.length() - A > b; ) {
    Se && console.assert(h.m_count < 3), _.iterations += 1, d = e.getSupport(C.mulTVec2(r.q, p.neg(g))), f = le.mulVec2(r, e.getVertex(d)), y = s.getSupport(C.mulTVec2(a.q, g)), v = le.mulVec2(a, s.getVertex(y));
    const q = p.sub(f, v);
    g.normalize();
    const F = p.dot(g, q), E = p.dot(g, c);
    if (F - A > m * E) {
      if (E <= 0 || (m = (F - A) / E, m > 1))
        return !1;
      l.setMul(-1, g), h.m_count = 0;
    }
    const D = u[h.m_count];
    switch (D.indexA = y, D.wA = p.combine(1, v, m, c), D.indexB = d, D.wB = f, D.w = p.sub(D.wB, D.wA), D.a = 1, h.m_count += 1, h.m_count) {
      case 1:
        break;
      case 2:
        h.solve2();
        break;
      case 3:
        h.solve3();
        break;
      default:
        Se && console.assert(!1);
    }
    if (h.m_count == 3)
      return !1;
    g.setVec2(h.getClosestPoint()), ++w;
  }
  if (w == 0)
    return !1;
  const T = p.zero(), M = p.zero();
  return h.getWitnessPoints(M, T), g.lengthSquared() > 0 && (l.setMul(-1, g), l.normalize()), _.point = p.combine(1, T, i, l), _.normal = l, _.lambda = m, _.iterations = w, !0;
}, or = typeof ASSERT > "u" ? !1 : ASSERT, ol = Math.abs, In = Math.max;
class gr {
  proxyA = new Ks();
  proxyB = new Ks();
  sweepA = new Xs();
  sweepB = new Xs();
  /** defines sweep interval [0, tMax] */
  tMax;
  recycle() {
    this.proxyA.recycle(), this.proxyB.recycle(), this.sweepA.recycle(), this.sweepB.recycle(), this.tMax = -1;
  }
}
var vr = /* @__PURE__ */ ((_) => (_[_.e_unset = -1] = "e_unset", _[_.e_unknown = 0] = "e_unknown", _[_.e_failed = 1] = "e_failed", _[_.e_overlapped = 2] = "e_overlapped", _[_.e_touching = 3] = "e_touching", _[_.e_separated = 4] = "e_separated", _))(vr || {});
class Ar {
  state = -1;
  t = -1;
  recycle() {
    this.state = -1, this.t = -1;
  }
}
bt.toiTime = 0;
bt.toiMaxTime = 0;
bt.toiCalls = 0;
bt.toiIters = 0;
bt.toiMaxIters = 0;
bt.toiRootIters = 0;
bt.toiMaxRootIters = 0;
const Bi = new mo(), Ro = new uo(), Eo = new po(), fe = bi(0, 0, 0), ye = bi(0, 0, 0), $i = I(0, 0), ns = I(0, 0), Re = I(0, 0), pe = I(0, 0), Pn = I(0, 0), Vn = I(0, 0), zn = I(0, 0), Fn = I(0, 0), fn = function(_, t) {
  const e = Ur.now();
  ++bt.toiCalls, _.state = 0, _.t = t.tMax;
  const s = t.proxyA, i = t.proxyB, n = t.sweepA, o = t.sweepB;
  n.normalize(), o.normalize();
  const r = t.tMax, a = s.m_radius + i.m_radius, c = In(O.linearSlop, a - 3 * O.linearSlop), l = 0.25 * O.linearSlop;
  or && console.assert(c > l);
  let m = 0;
  const h = O.maxTOIIterations;
  let u = 0;
  for (Eo.recycle(), Bi.proxyA.setVertices(s.m_vertices, s.m_count, s.m_radius), Bi.proxyB.setVertices(i.m_vertices, i.m_count, i.m_radius), Bi.useRadii = !1; ; ) {
    if (n.getTransform(fe, m), o.getTransform(ye, m), co(Bi.transformA, fe), co(Bi.transformB, ye), Vs(Ro, Eo, Bi), Ro.distance <= 0) {
      _.state = 2, _.t = 0;
      break;
    }
    if (Ro.distance < c + l) {
      _.state = 3, _.t = m;
      break;
    }
    Hi.initialize(Eo, s, n, i, o, m);
    let f = !1, y = r, v = 0;
    for (; ; ) {
      let g = Hi.findMinSeparation(y);
      if (g > c + l) {
        _.state = 4, _.t = r, f = !0;
        break;
      }
      if (g > c - l) {
        m = y;
        break;
      }
      let A = Hi.evaluate(m);
      if (A < c - l) {
        _.state = 1, _.t = m, f = !0;
        break;
      }
      if (A <= c + l) {
        _.state = 3, _.t = m, f = !0;
        break;
      }
      let b = 0, B = m, w = y;
      for (; ; ) {
        let T;
        b & 1 ? T = B + (c - A) * (w - B) / (g - A) : T = 0.5 * (B + w), ++b, ++bt.toiRootIters;
        const M = Hi.evaluate(T);
        if (ol(M - c) < l) {
          y = T;
          break;
        }
        if (M > c ? (B = T, A = M) : (w = T, g = M), b === 50)
          break;
      }
      if (bt.toiMaxRootIters = In(bt.toiMaxRootIters, b), ++v, v === O.maxPolygonVertices)
        break;
    }
    if (++u, ++bt.toiIters, f)
      break;
    if (u === h) {
      _.state = 1, _.t = m;
      break;
    }
  }
  bt.toiMaxIters = In(bt.toiMaxIters, u);
  const d = Ur.diff(e);
  bt.toiMaxTime = In(bt.toiMaxTime, d), bt.toiTime += d, Hi.recycle();
};
class rl {
  // input cache
  // todo: maybe assign by copy instead of reference?
  m_proxyA = null;
  m_proxyB = null;
  m_sweepA = null;
  m_sweepB = null;
  // initialize cache
  m_type = -1;
  m_localPoint = I(0, 0);
  m_axis = I(0, 0);
  // compute output
  indexA = -1;
  indexB = -1;
  recycle() {
    this.m_proxyA = null, this.m_proxyB = null, this.m_sweepA = null, this.m_sweepB = null, this.m_type = -1, K(this.m_localPoint), K(this.m_axis), this.indexA = -1, this.indexB = -1;
  }
  // TODO_ERIN might not need to return the separation
  initialize(t, e, s, i, n, o) {
    const r = t.count;
    if (or && console.assert(0 < r && r < 3), this.m_proxyA = e, this.m_proxyB = i, this.m_sweepA = s, this.m_sweepB = n, this.m_sweepA.getTransform(fe, o), this.m_sweepB.getTransform(ye, o), r === 1) {
      this.m_type = 1;
      const a = this.m_proxyA.getVertex(t.indexA[0]), c = this.m_proxyB.getVertex(t.indexB[0]);
      return st(ns, fe, a), st(Re, ye, c), it(this.m_axis, Re, ns), Oc(this.m_axis);
    } else if (t.indexA[0] === t.indexA[1]) {
      this.m_type = 3;
      const a = i.getVertex(t.indexB[0]), c = i.getVertex(t.indexB[1]);
      yi(this.m_axis, it($i, c, a), 1), ts(this.m_axis), ke(pe, ye.q, this.m_axis), Tt(this.m_localPoint, 0.5, a, 0.5, c), st(Re, ye, this.m_localPoint);
      const l = e.getVertex(t.indexA[0]), m = le.mulVec2(fe, l);
      let h = L(m, pe) - L(Re, pe);
      return h < 0 && (mn(this.m_axis), h = -h), h;
    } else {
      this.m_type = 2;
      const a = this.m_proxyA.getVertex(t.indexA[0]), c = this.m_proxyA.getVertex(t.indexA[1]);
      yi(this.m_axis, it($i, c, a), 1), ts(this.m_axis), ke(pe, fe.q, this.m_axis), Tt(this.m_localPoint, 0.5, a, 0.5, c), st(ns, fe, this.m_localPoint);
      const l = this.m_proxyB.getVertex(t.indexB[0]);
      st(Re, ye, l);
      let m = L(Re, pe) - L(ns, pe);
      return m < 0 && (mn(this.m_axis), m = -m), m;
    }
  }
  compute(t, e) {
    switch (this.m_sweepA.getTransform(fe, e), this.m_sweepB.getTransform(ye, e), this.m_type) {
      case 1:
        return t && (ki(Pn, fe.q, this.m_axis), ki(Vn, ye.q, Z($i, -1, this.m_axis)), this.indexA = this.m_proxyA.getSupport(Pn), this.indexB = this.m_proxyB.getSupport(Vn)), S(zn, this.m_proxyA.getVertex(this.indexA)), S(Fn, this.m_proxyB.getVertex(this.indexB)), st(ns, fe, zn), st(Re, ye, Fn), L(Re, this.m_axis) - L(ns, this.m_axis);
      case 2:
        return ke(pe, fe.q, this.m_axis), st(ns, fe, this.m_localPoint), t && (ki(Vn, ye.q, Z($i, -1, pe)), this.indexA = -1, this.indexB = this.m_proxyB.getSupport(Vn)), S(Fn, this.m_proxyB.getVertex(this.indexB)), st(Re, ye, Fn), L(Re, pe) - L(ns, pe);
      case 3:
        return ke(pe, ye.q, this.m_axis), st(Re, ye, this.m_localPoint), t && (ki(Pn, fe.q, Z($i, -1, pe)), this.indexB = -1, this.indexA = this.m_proxyA.getSupport(Pn)), S(zn, this.m_proxyA.getVertex(this.indexA)), st(ns, fe, zn), L(ns, pe) - L(Re, pe);
      default:
        return or && console.assert(!1), t && (this.indexA = -1, this.indexB = -1), 0;
    }
  }
  findMinSeparation(t) {
    return this.compute(!0, t);
  }
  evaluate(t) {
    return this.compute(!1, t);
  }
}
const Hi = new rl();
fn.Input = gr;
fn.Output = Ar;
const Ui = typeof ASSERT > "u" ? !1 : ASSERT, Xr = Math.abs, Kr = Math.sqrt, Rn = Math.min;
class _o {
  /** time step */
  dt = 0;
  /** inverse time step (0 if dt == 0) */
  inv_dt = 0;
  velocityIterations = 0;
  positionIterations = 0;
  warmStarting = !1;
  blockSolve = !0;
  /** timestep ratio for variable timestep */
  inv_dt0 = 0;
  /** dt * inv_dt0 */
  dtRatio = 1;
  reset(t) {
    this.dt > 0 && (this.inv_dt0 = this.inv_dt), this.dt = t, this.inv_dt = t == 0 ? 0 : 1 / t, this.dtRatio = t * this.inv_dt0;
  }
}
const wi = new _o(), ys = I(0, 0), ie = I(0, 0), En = I(0, 0), Si = new gr(), qo = new Ar(), Zr = new Xs(), Jr = new Xs(), Qr = new Xs();
class lc {
  // TODO: merge with Contact class?
  contact;
  normals;
  tangents;
  constructor(t) {
    this.contact = t, this.normals = [], this.tangents = [];
  }
  recycle() {
    this.normals.length = 0, this.tangents.length = 0;
  }
  get normalImpulses() {
    const t = this.contact, e = this.normals;
    e.length = 0;
    for (let s = 0; s < t.v_points.length; ++s)
      e.push(t.v_points[s].normalImpulse);
    return e;
  }
  get tangentImpulses() {
    const t = this.contact, e = this.tangents;
    e.length = 0;
    for (let s = 0; s < t.v_points.length; ++s)
      e.push(t.v_points[s].tangentImpulse);
    return e;
  }
}
let br = class {
  m_world;
  m_stack;
  m_bodies;
  m_contacts;
  m_joints;
  constructor(t) {
    this.m_world = t, this.m_stack = [], this.m_bodies = [], this.m_contacts = [], this.m_joints = [];
  }
  clear() {
    this.m_stack.length = 0, this.m_bodies.length = 0, this.m_contacts.length = 0, this.m_joints.length = 0;
  }
  addBody(t) {
    Ui && console.assert(t instanceof ut, "Not a Body!", t), this.m_bodies.push(t);
  }
  addContact(t) {
    this.m_contacts.push(t);
  }
  addJoint(t) {
    Ui && console.assert(t instanceof te, "Not a Joint!", t), this.m_joints.push(t);
  }
  solveWorld(t) {
    const e = this.m_world;
    for (let i = e.m_bodyList; i; i = i.m_next)
      i.m_islandFlag = !1;
    for (let i = e.m_contactList; i; i = i.m_next)
      i.m_islandFlag = !1;
    for (let i = e.m_jointList; i; i = i.m_next)
      i.m_islandFlag = !1;
    const s = this.m_stack;
    for (let i = e.m_bodyList; i; i = i.m_next)
      if (!i.m_islandFlag && !(i.isAwake() == !1 || i.isActive() == !1) && !i.isStatic()) {
        for (this.clear(), s.push(i), i.m_islandFlag = !0; s.length > 0; ) {
          const n = s.pop();
          if (Ui && console.assert(n.isActive() == !0), this.addBody(n), n.m_awakeFlag = !0, !n.isStatic()) {
            for (let o = n.m_contactList; o; o = o.next) {
              const r = o.contact;
              if (r.m_islandFlag || r.isEnabled() == !1 || r.isTouching() == !1)
                continue;
              const a = r.m_fixtureA.m_isSensor, c = r.m_fixtureB.m_isSensor;
              if (a || c)
                continue;
              this.addContact(r), r.m_islandFlag = !0;
              const l = o.other;
              l.m_islandFlag || (s.push(l), l.m_islandFlag = !0);
            }
            for (let o = n.m_jointList; o; o = o.next) {
              if (o.joint.m_islandFlag == !0)
                continue;
              const r = o.other;
              r.isActive() != !1 && (this.addJoint(o.joint), o.joint.m_islandFlag = !0, !r.m_islandFlag && (s.push(r), r.m_islandFlag = !0));
            }
          }
        }
        this.solveIsland(t);
        for (let n = 0; n < this.m_bodies.length; ++n) {
          const o = this.m_bodies[n];
          o.isStatic() && (o.m_islandFlag = !1);
        }
      }
  }
  solveIsland(t) {
    const e = this.m_world, s = e.m_gravity, i = e.m_allowSleep, n = t.dt;
    for (let r = 0; r < this.m_bodies.length; ++r) {
      const a = this.m_bodies[r];
      S(ys, a.m_sweep.c);
      const c = a.m_sweep.a;
      S(ie, a.m_linearVelocity);
      let l = a.m_angularVelocity;
      S(a.m_sweep.c0, a.m_sweep.c), a.m_sweep.a0 = a.m_sweep.a, a.isDynamic() && (Ze(ie, n * a.m_gravityScale, s), Ze(ie, n * a.m_invMass, a.m_force), l += n * a.m_invI * a.m_torque, Z(ie, 1 / (1 + n * a.m_linearDamping), ie), l *= 1 / (1 + n * a.m_angularDamping)), S(a.c_position.c, ys), a.c_position.a = c, S(a.c_velocity.v, ie), a.c_velocity.w = l;
    }
    for (let r = 0; r < this.m_contacts.length; ++r)
      this.m_contacts[r].initConstraint(t);
    for (let r = 0; r < this.m_contacts.length; ++r)
      this.m_contacts[r].initVelocityConstraint(t);
    if (t.warmStarting)
      for (let r = 0; r < this.m_contacts.length; ++r)
        this.m_contacts[r].warmStartConstraint(t);
    for (let r = 0; r < this.m_joints.length; ++r)
      this.m_joints[r].initVelocityConstraints(t);
    for (let r = 0; r < t.velocityIterations; ++r) {
      for (let a = 0; a < this.m_joints.length; ++a)
        this.m_joints[a].solveVelocityConstraints(t);
      for (let a = 0; a < this.m_contacts.length; ++a)
        this.m_contacts[a].solveVelocityConstraint(t);
    }
    for (let r = 0; r < this.m_contacts.length; ++r)
      this.m_contacts[r].storeConstraintImpulses(t);
    for (let r = 0; r < this.m_bodies.length; ++r) {
      const a = this.m_bodies[r];
      S(ys, a.c_position.c);
      let c = a.c_position.a;
      S(ie, a.c_velocity.v);
      let l = a.c_velocity.w;
      Z(En, n, ie);
      const m = xi(En);
      if (m > O.maxTranslationSquared) {
        const u = O.maxTranslation / Kr(m);
        kr(ie, u);
      }
      const h = n * l;
      if (h * h > O.maxRotationSquared) {
        const u = O.maxRotation / Xr(h);
        l *= u;
      }
      Ze(ys, n, ie), c += n * l, S(a.c_position.c, ys), a.c_position.a = c, S(a.c_velocity.v, ie), a.c_velocity.w = l;
    }
    let o = !1;
    for (let r = 0; r < t.positionIterations; ++r) {
      let a = 0;
      for (let m = 0; m < this.m_contacts.length; ++m) {
        const u = this.m_contacts[m].solvePositionConstraint(t);
        a = Rn(a, u);
      }
      const c = a >= -3 * O.linearSlop;
      let l = !0;
      for (let m = 0; m < this.m_joints.length; ++m) {
        const u = this.m_joints[m].solvePositionConstraints(t);
        l = l && u;
      }
      if (c && l) {
        o = !0;
        break;
      }
    }
    for (let r = 0; r < this.m_bodies.length; ++r) {
      const a = this.m_bodies[r];
      S(a.m_sweep.c, a.c_position.c), a.m_sweep.a = a.c_position.a, S(a.m_linearVelocity, a.c_velocity.v), a.m_angularVelocity = a.c_velocity.w, a.synchronizeTransform();
    }
    if (this.postSolveIsland(), i) {
      let r = 1 / 0;
      const a = O.linearSleepToleranceSqr, c = O.angularSleepToleranceSqr;
      for (let l = 0; l < this.m_bodies.length; ++l) {
        const m = this.m_bodies[l];
        m.isStatic() || (m.m_autoSleepFlag == !1 || m.m_angularVelocity * m.m_angularVelocity > c || xi(m.m_linearVelocity) > a ? (m.m_sleepTime = 0, r = 0) : (m.m_sleepTime += n, r = Rn(r, m.m_sleepTime)));
      }
      if (r >= O.timeToSleep && o)
        for (let l = 0; l < this.m_bodies.length; ++l)
          this.m_bodies[l].setAwake(!1);
    }
  }
  /**
   * Find TOI contacts and solve them.
   */
  solveWorldTOI(t) {
    const e = this.m_world;
    if (e.m_stepComplete) {
      for (let s = e.m_bodyList; s; s = s.m_next)
        s.m_islandFlag = !1, s.m_sweep.alpha0 = 0;
      for (let s = e.m_contactList; s; s = s.m_next)
        s.m_toiFlag = !1, s.m_islandFlag = !1, s.m_toiCount = 0, s.m_toi = 1;
    }
    for (; ; ) {
      let s = null, i = 1;
      for (let l = e.m_contactList; l; l = l.m_next) {
        if (l.isEnabled() == !1 || l.m_toiCount > O.maxSubSteps)
          continue;
        let m = 1;
        if (l.m_toiFlag)
          m = l.m_toi;
        else {
          const h = l.getFixtureA(), u = l.getFixtureB();
          if (h.isSensor() || u.isSensor())
            continue;
          const d = h.getBody(), f = u.getBody();
          Ui && console.assert(d.isDynamic() || f.isDynamic());
          const y = d.isAwake() && !d.isStatic(), v = f.isAwake() && !f.isStatic();
          if (y == !1 && v == !1)
            continue;
          const g = d.isBullet() || !d.isDynamic(), A = f.isBullet() || !f.isDynamic();
          if (g == !1 && A == !1)
            continue;
          let b = d.m_sweep.alpha0;
          d.m_sweep.alpha0 < f.m_sweep.alpha0 ? (b = f.m_sweep.alpha0, d.m_sweep.advance(b)) : f.m_sweep.alpha0 < d.m_sweep.alpha0 && (b = d.m_sweep.alpha0, f.m_sweep.advance(b)), Ui && console.assert(b < 1);
          const B = l.getChildIndexA(), w = l.getChildIndexB();
          Si.proxyA.set(h.getShape(), B), Si.proxyB.set(u.getShape(), w), Si.sweepA.set(d.m_sweep), Si.sweepB.set(f.m_sweep), Si.tMax = 1, fn(qo, Si);
          const T = qo.t;
          qo.state == vr.e_touching ? m = Rn(b + (1 - b) * T, 1) : m = 1, l.m_toi = m, l.m_toiFlag = !0;
        }
        m < i && (s = l, i = m);
      }
      if (s == null || 1 - 10 * qt < i) {
        e.m_stepComplete = !0;
        break;
      }
      const n = s.getFixtureA(), o = s.getFixtureB(), r = n.getBody(), a = o.getBody();
      if (Jr.set(r.m_sweep), Qr.set(a.m_sweep), r.advance(i), a.advance(i), s.update(e), s.m_toiFlag = !1, ++s.m_toiCount, s.isEnabled() == !1 || s.isTouching() == !1) {
        s.setEnabled(!1), r.m_sweep.set(Jr), a.m_sweep.set(Qr), r.synchronizeTransform(), a.synchronizeTransform();
        continue;
      }
      r.setAwake(!0), a.setAwake(!0), this.clear(), this.addBody(r), this.addBody(a), this.addContact(s), r.m_islandFlag = !0, a.m_islandFlag = !0, s.m_islandFlag = !0;
      const c = [r, a];
      for (let l = 0; l < c.length; ++l) {
        const m = c[l];
        if (m.isDynamic())
          for (let h = m.m_contactList; h; h = h.next) {
            const u = h.contact;
            if (u.m_islandFlag)
              continue;
            const d = h.other;
            if (d.isDynamic() && !m.isBullet() && !d.isBullet())
              continue;
            const f = u.m_fixtureA.m_isSensor, y = u.m_fixtureB.m_isSensor;
            if (!(f || y)) {
              if (Zr.set(d.m_sweep), d.m_islandFlag == !1 && d.advance(i), u.update(e), u.isEnabled() == !1 || u.isTouching() == !1) {
                d.m_sweep.set(Zr), d.synchronizeTransform();
                continue;
              }
              u.m_islandFlag = !0, this.addContact(u), !d.m_islandFlag && (d.m_islandFlag = !0, d.isStatic() || d.setAwake(!0), this.addBody(d));
            }
          }
      }
      wi.reset((1 - i) * t.dt), wi.dtRatio = 1, wi.positionIterations = 20, wi.velocityIterations = t.velocityIterations, wi.warmStarting = !1, this.solveIslandTOI(wi, r, a);
      for (let l = 0; l < this.m_bodies.length; ++l) {
        const m = this.m_bodies[l];
        if (m.m_islandFlag = !1, !!m.isDynamic()) {
          m.synchronizeFixtures();
          for (let h = m.m_contactList; h; h = h.next)
            h.contact.m_toiFlag = !1, h.contact.m_islandFlag = !1;
        }
      }
      if (e.findNewContacts(), e.m_subStepping) {
        e.m_stepComplete = !1;
        break;
      }
    }
  }
  solveIslandTOI(t, e, s) {
    for (let n = 0; n < this.m_bodies.length; ++n) {
      const o = this.m_bodies[n];
      S(o.c_position.c, o.m_sweep.c), o.c_position.a = o.m_sweep.a, S(o.c_velocity.v, o.m_linearVelocity), o.c_velocity.w = o.m_angularVelocity;
    }
    for (let n = 0; n < this.m_contacts.length; ++n)
      this.m_contacts[n].initConstraint(t);
    for (let n = 0; n < t.positionIterations; ++n) {
      let o = 0;
      for (let a = 0; a < this.m_contacts.length; ++a) {
        const l = this.m_contacts[a].solvePositionConstraintTOI(t, e, s);
        o = Rn(o, l);
      }
      if (o >= -1.5 * O.linearSlop)
        break;
    }
    S(e.m_sweep.c0, e.c_position.c), e.m_sweep.a0 = e.c_position.a, S(s.m_sweep.c0, s.c_position.c), s.m_sweep.a0 = s.c_position.a;
    for (let n = 0; n < this.m_contacts.length; ++n)
      this.m_contacts[n].initVelocityConstraint(t);
    for (let n = 0; n < t.velocityIterations; ++n)
      for (let o = 0; o < this.m_contacts.length; ++o)
        this.m_contacts[o].solveVelocityConstraint(t);
    const i = t.dt;
    for (let n = 0; n < this.m_bodies.length; ++n) {
      const o = this.m_bodies[n];
      S(ys, o.c_position.c);
      let r = o.c_position.a;
      S(ie, o.c_velocity.v);
      let a = o.c_velocity.w;
      Z(En, i, ie);
      const c = xi(En);
      if (c > O.maxTranslationSquared) {
        const m = O.maxTranslation / Kr(c);
        kr(ie, m);
      }
      const l = i * a;
      if (l * l > O.maxRotationSquared) {
        const m = O.maxRotation / Xr(l);
        a *= m;
      }
      Ze(ys, i, ie), r += i * a, S(o.c_position.c, ys), o.c_position.a = r, S(o.c_velocity.v, ie), o.c_velocity.w = a, S(o.m_sweep.c, ys), o.m_sweep.a = r, S(o.m_linearVelocity, ie), o.m_angularVelocity = a, o.synchronizeTransform();
    }
    this.postSolveIsland();
  }
  /** @internal */
  postSolveIsland() {
    for (let t = 0; t < this.m_contacts.length; ++t) {
      const e = this.m_contacts[t];
      this.m_world.postSolve(e, e.m_impulse);
    }
  }
};
br.TimeStep = _o;
const $t = typeof ASSERT > "u" ? !1 : ASSERT;
class pt {
  ex;
  ey;
  constructor(t, e, s, i) {
    typeof t == "object" && t !== null ? (this.ex = p.clone(t), this.ey = p.clone(e)) : typeof t == "number" ? (this.ex = p.neo(t, s), this.ey = p.neo(e, i)) : (this.ex = p.zero(), this.ey = p.zero());
  }
  /** @hidden */
  toString() {
    return JSON.stringify(this);
  }
  static isValid(t) {
    return t === null || typeof t > "u" ? !1 : p.isValid(t.ex) && p.isValid(t.ey);
  }
  static assert(t) {
    $t && console.assert(!pt.isValid(t), "Invalid Mat22!", t);
  }
  set(t, e, s, i) {
    typeof t == "number" && typeof e == "number" && typeof s == "number" && typeof i == "number" ? (this.ex.setNum(t, s), this.ey.setNum(e, i)) : typeof t == "object" && typeof e == "object" ? (this.ex.setVec2(t), this.ey.setVec2(e)) : typeof t == "object" ? ($t && pt.assert(t), this.ex.setVec2(t.ex), this.ey.setVec2(t.ey)) : $t && console.assert(!1);
  }
  setIdentity() {
    this.ex.x = 1, this.ey.x = 0, this.ex.y = 0, this.ey.y = 1;
  }
  setZero() {
    this.ex.x = 0, this.ey.x = 0, this.ex.y = 0, this.ey.y = 0;
  }
  getInverse() {
    const t = this.ex.x, e = this.ey.x, s = this.ex.y, i = this.ey.y;
    let n = t * i - e * s;
    n !== 0 && (n = 1 / n);
    const o = new pt();
    return o.ex.x = n * i, o.ey.x = -n * e, o.ex.y = -n * s, o.ey.y = n * t, o;
  }
  /**
   * Solve A * x = b, where b is a column vector. This is more efficient than
   * computing the inverse in one-shot cases.
   */
  solve(t) {
    $t && p.assert(t);
    const e = this.ex.x, s = this.ey.x, i = this.ex.y, n = this.ey.y;
    let o = e * n - s * i;
    o !== 0 && (o = 1 / o);
    const r = p.zero();
    return r.x = o * (n * t.x - s * t.y), r.y = o * (e * t.y - i * t.x), r;
  }
  static mul(t, e) {
    if (e && "x" in e && "y" in e) {
      $t && p.assert(e);
      const s = t.ex.x * e.x + t.ey.x * e.y, i = t.ex.y * e.x + t.ey.y * e.y;
      return p.neo(s, i);
    } else if (e && "ex" in e && "ey" in e) {
      $t && pt.assert(e);
      const s = t.ex.x * e.ex.x + t.ey.x * e.ex.y, i = t.ex.x * e.ey.x + t.ey.x * e.ey.y, n = t.ex.y * e.ex.x + t.ey.y * e.ex.y, o = t.ex.y * e.ey.x + t.ey.y * e.ey.y;
      return new pt(s, i, n, o);
    }
    $t && console.assert(!1);
  }
  static mulVec2(t, e) {
    $t && p.assert(e);
    const s = t.ex.x * e.x + t.ey.x * e.y, i = t.ex.y * e.x + t.ey.y * e.y;
    return p.neo(s, i);
  }
  static mulMat22(t, e) {
    $t && pt.assert(e);
    const s = t.ex.x * e.ex.x + t.ey.x * e.ex.y, i = t.ex.x * e.ey.x + t.ey.x * e.ey.y, n = t.ex.y * e.ex.x + t.ey.y * e.ex.y, o = t.ex.y * e.ey.x + t.ey.y * e.ey.y;
    return new pt(s, i, n, o);
  }
  static mulT(t, e) {
    if (e && "x" in e && "y" in e)
      return $t && p.assert(e), p.neo(p.dot(e, t.ex), p.dot(e, t.ey));
    if (e && "ex" in e && "ey" in e) {
      $t && pt.assert(e);
      const s = p.neo(p.dot(t.ex, e.ex), p.dot(t.ey, e.ex)), i = p.neo(p.dot(t.ex, e.ey), p.dot(t.ey, e.ey));
      return new pt(s, i);
    }
    $t && console.assert(!1);
  }
  static mulTVec2(t, e) {
    return $t && pt.assert(t), $t && p.assert(e), p.neo(p.dot(e, t.ex), p.dot(e, t.ey));
  }
  static mulTMat22(t, e) {
    $t && pt.assert(t), $t && pt.assert(e);
    const s = p.neo(p.dot(t.ex, e.ex), p.dot(t.ey, e.ex)), i = p.neo(p.dot(t.ex, e.ey), p.dot(t.ey, e.ey));
    return new pt(s, i);
  }
  static abs(t) {
    return $t && pt.assert(t), new pt(p.abs(t.ex), p.abs(t.ey));
  }
  static add(t, e) {
    return $t && pt.assert(t), $t && pt.assert(e), new pt(p.add(t.ex, e.ex), p.add(t.ey, e.ey));
  }
}
const al = Math.sqrt, Lo = I(0, 0), No = I(0, 0), Gi = I(0, 0), xs = I(0, 0), gs = I(0, 0), ko = I(0, 0), qn = I(0, 0), zs = I(0, 0);
var Xt = /* @__PURE__ */ ((_) => (_[_.e_unset = -1] = "e_unset", _[_.e_circles = 0] = "e_circles", _[_.e_faceA = 1] = "e_faceA", _[_.e_faceB = 2] = "e_faceB", _))(Xt || {}), ft = /* @__PURE__ */ ((_) => (_[_.e_unset = -1] = "e_unset", _[_.e_vertex = 0] = "e_vertex", _[_.e_face = 1] = "e_face", _))(ft || {}), Br = /* @__PURE__ */ ((_) => (_[_.nullState = 0] = "nullState", _[_.addState = 1] = "addState", _[_.persistState = 2] = "persistState", _[_.removeState = 3] = "removeState", _))(Br || {});
class Ae {
  v = I(0, 0);
  id = new wr();
  set(t) {
    S(this.v, t.v), this.id.set(t.id);
  }
  recycle() {
    K(this.v), this.id.recycle();
  }
}
class fo {
  type;
  /**
   * Usage depends on manifold type:
   * - circles: not used
   * - faceA: the normal on polygonA
   * - faceB: the normal on polygonB
   */
  localNormal = I(0, 0);
  /**
   * Usage depends on manifold type:
   * - circles: the local center of circleA
   * - faceA: the center of faceA
   * - faceB: the center of faceB
   */
  localPoint = I(0, 0);
  /** The points of contact */
  points = [new rr(), new rr()];
  /** The number of manifold points */
  pointCount = 0;
  set(t) {
    this.type = t.type, S(this.localNormal, t.localNormal), S(this.localPoint, t.localPoint), this.pointCount = t.pointCount, this.points[0].set(t.points[0]), this.points[1].set(t.points[1]);
  }
  recycle() {
    this.type = -1, K(this.localNormal), K(this.localPoint), this.pointCount = 0, this.points[0].recycle(), this.points[1].recycle();
  }
  /**
   * Evaluate the manifold with supplied transforms. This assumes modest motion
   * from the original state. This does not change the point count, impulses, etc.
   * The radii must come from the shapes that generated the manifold.
   */
  getWorldManifold(t, e, s, i, n) {
    if (this.pointCount == 0)
      return t;
    t = t || new Sr(), t.pointCount = this.pointCount;
    const o = t.normal, r = t.points, a = t.separations;
    switch (this.type) {
      case 0: {
        Zt(o, 1, 0);
        const c = this.points[0];
        st(Lo, e, this.localPoint), st(No, i, c.localPoint), it(ko, No, Lo);
        const l = xi(ko);
        if (l > qt * qt) {
          const m = al(l);
          Z(o, 1 / m, ko);
        }
        Tt(xs, 1, Lo, s, o), Tt(gs, 1, No, -n, o), Tt(r[0], 0.5, xs, 0.5, gs), a[0] = L(it(Gi, gs, xs), o);
        break;
      }
      case 1: {
        ke(o, e.q, this.localNormal), st(qn, e, this.localPoint);
        for (let c = 0; c < this.pointCount; ++c) {
          const l = this.points[c];
          st(zs, i, l.localPoint), Tt(
            xs,
            1,
            zs,
            s - L(it(Gi, zs, qn), o),
            o
          ), Tt(gs, 1, zs, -n, o), Tt(r[c], 0.5, xs, 0.5, gs), a[c] = L(it(Gi, gs, xs), o);
        }
        break;
      }
      case 2: {
        ke(o, i.q, this.localNormal), st(qn, i, this.localPoint);
        for (let c = 0; c < this.pointCount; ++c) {
          const l = this.points[c];
          st(zs, e, l.localPoint), Tt(
            gs,
            1,
            zs,
            n - L(it(Gi, zs, qn), o),
            o
          ), Tt(xs, 1, zs, -s, o), Tt(r[c], 0.5, xs, 0.5, gs), a[c] = L(it(Gi, xs, gs), o);
        }
        mn(o);
        break;
      }
    }
    return t;
  }
  static clipSegmentToLine = Wi;
  static ClipVertex = Ae;
  static getPointStates = hc;
  static PointState = Br;
}
class rr {
  /**
   * Usage depends on manifold type:
   * - circles: the local center of circleB
   * - faceA: the local center of circleB or the clip point of polygonB
   * - faceB: the clip point of polygonA
   */
  localPoint = I(0, 0);
  /**
   * The non-penetration impulse
   */
  normalImpulse = 0;
  /**
   * The friction impulse
   */
  tangentImpulse = 0;
  /**
   * Uniquely identifies a contact point between two shapes to facilitate warm starting
   */
  id = new wr();
  set(t) {
    S(this.localPoint, t.localPoint), this.normalImpulse = t.normalImpulse, this.tangentImpulse = t.tangentImpulse, this.id.set(t.id);
  }
  recycle() {
    K(this.localPoint), this.normalImpulse = 0, this.tangentImpulse = 0, this.id.recycle();
  }
}
class wr {
  /**
   * Used to quickly compare contact ids.
   */
  key = -1;
  /** ContactFeature index on shapeA */
  indexA = -1;
  /** ContactFeature index on shapeB */
  indexB = -1;
  /** ContactFeature type on shapeA */
  typeA = -1;
  /** ContactFeature type on shapeB */
  typeB = -1;
  setFeatures(t, e, s, i) {
    this.indexA = t, this.indexB = s, this.typeA = e, this.typeB = i, this.key = this.indexA + this.indexB * 4 + this.typeA * 16 + this.typeB * 64;
  }
  set(t) {
    this.indexA = t.indexA, this.indexB = t.indexB, this.typeA = t.typeA, this.typeB = t.typeB, this.key = this.indexA + this.indexB * 4 + this.typeA * 16 + this.typeB * 64;
  }
  swapFeatures() {
    const t = this.indexA, e = this.indexB, s = this.typeA, i = this.typeB;
    this.indexA = e, this.indexB = t, this.typeA = i, this.typeB = s, this.key = this.indexA + this.indexB * 4 + this.typeA * 16 + this.typeB * 64;
  }
  recycle() {
    this.indexA = 0, this.indexB = 0, this.typeA = -1, this.typeB = -1, this.key = -1;
  }
}
class Sr {
  /** World vector pointing from A to B */
  normal = I(0, 0);
  /** World contact point (point of intersection) */
  points = [I(0, 0), I(0, 0)];
  // [maxManifoldPoints]
  /** A negative value indicates overlap, in meters */
  separations = [0, 0];
  // [maxManifoldPoints]
  /** The number of manifold points */
  pointCount = 0;
  recycle() {
    K(this.normal), K(this.points[0]), K(this.points[1]), this.separations[0] = 0, this.separations[1] = 0, this.pointCount = 0;
  }
}
function hc(_, t, e, s) {
  for (let i = 0; i < e.pointCount; ++i) {
    const n = e.points[i].id;
    _[i] = 3;
    for (let o = 0; o < s.pointCount; ++o)
      if (s.points[o].id.key === n.key) {
        _[i] = 2;
        break;
      }
  }
  for (let i = 0; i < s.pointCount; ++i) {
    const n = s.points[i].id;
    t[i] = 1;
    for (let o = 0; o < e.pointCount; ++o)
      if (e.points[o].id.key === n.key) {
        t[i] = 2;
        break;
      }
  }
}
function Wi(_, t, e, s, i) {
  let n = 0;
  const o = L(e, t[0].v) - s, r = L(e, t[1].v) - s;
  if (o <= 0 && _[n++].set(t[0]), r <= 0 && _[n++].set(t[1]), o * r < 0) {
    const a = o / (o - r);
    Tt(_[n].v, 1 - a, t[0].v, a, t[1].v), _[n].id.setFeatures(
      i,
      0,
      t[0].id.indexB,
      1
      /* e_face */
    ), ++n;
  }
  return n;
}
const Ln = typeof ASSERT > "u" ? !1 : ASSERT, cl = Math.sqrt, ll = Math.max, hl = Math.min, ta = new ln({
  create() {
    return new ss();
  },
  release(_) {
    _.recycle();
  }
}), Ci = new fo(), Nn = new Sr();
class ar {
  contact;
  prev = null;
  next = null;
  other = null;
  constructor(t) {
    this.contact = t;
  }
  /** @internal */
  recycle() {
    this.prev = null, this.next = null, this.other = null;
  }
}
function cr(_, t) {
  return cl(_ * t);
}
function lr(_, t) {
  return _ > t ? _ : t;
}
const ii = [];
class hr {
  rA = I(0, 0);
  rB = I(0, 0);
  normalImpulse = 0;
  tangentImpulse = 0;
  normalMass = 0;
  tangentMass = 0;
  velocityBias = 0;
  recycle() {
    K(this.rA), K(this.rB), this.normalImpulse = 0, this.tangentImpulse = 0, this.normalMass = 0, this.tangentMass = 0, this.velocityBias = 0;
  }
}
const vs = I(0, 0), zt = I(0, 0), As = I(0, 0), Ft = I(0, 0), Fs = I(0, 0), ni = bi(0, 0, 0), oi = bi(0, 0, 0), kn = I(0, 0), On = I(0, 0), Ti = I(0, 0), jn = I(0, 0), Oo = I(0, 0), jo = I(0, 0), Nt = I(0, 0), dt = I(0, 0), Xi = I(0, 0), Ee = I(0, 0), Mi = I(0, 0), Ii = I(0, 0), Be = I(0, 0), We = I(0, 0), xt = I(0, 0), qe = I(0, 0), kt = I(0, 0), Ot = I(0, 0), os = I(0, 0);
let ss = class {
  // Nodes for connecting bodies.
  /** @internal */
  m_nodeA = new ar(this);
  /** @internal */
  m_nodeB = new ar(this);
  /** @internal */
  m_fixtureA = null;
  /** @internal */
  m_fixtureB = null;
  /** @internal */
  m_indexA = -1;
  /** @internal */
  m_indexB = -1;
  /** @internal */
  m_evaluateFcn = null;
  /** @internal */
  m_manifold = new fo();
  /** @internal */
  m_prev = null;
  /** @internal */
  m_next = null;
  /** @internal */
  m_toi = 1;
  /** @internal */
  m_toiCount = 0;
  // This contact has a valid TOI in m_toi
  /** @internal */
  m_toiFlag = !1;
  /** @internal */
  m_friction = 0;
  /** @internal */
  m_restitution = 0;
  /** @internal */
  m_tangentSpeed = 0;
  /** @internal This contact can be disabled (by user) */
  m_enabledFlag = !0;
  /** @internal Used when crawling contact graph when forming islands. */
  m_islandFlag = !1;
  /** @internal Set when the shapes are touching. */
  m_touchingFlag = !1;
  /** @internal This contact needs filtering because a fixture filter was changed. */
  m_filterFlag = !1;
  /** @internal This bullet contact had a TOI event */
  m_bulletHitFlag = !1;
  /** @internal Contact reporting impulse object cache */
  m_impulse = new lc(this);
  // VelocityConstraint
  /** @internal */
  v_points = [new hr(), new hr()];
  // [maxManifoldPoints];
  /** @internal */
  v_normal = I(0, 0);
  /** @internal */
  v_normalMass = new pt();
  /** @internal */
  v_K = new pt();
  /** @internal */
  v_pointCount = 0;
  /** @internal */
  v_tangentSpeed = 0;
  /** @internal */
  v_friction = 0;
  /** @internal */
  v_restitution = 0;
  /** @internal */
  v_invMassA = 0;
  /** @internal */
  v_invMassB = 0;
  /** @internal */
  v_invIA = 0;
  /** @internal */
  v_invIB = 0;
  // PositionConstraint
  /** @internal */
  p_localPoints = [I(0, 0), I(0, 0)];
  // [maxManifoldPoints];
  /** @internal */
  p_localNormal = I(0, 0);
  /** @internal */
  p_localPoint = I(0, 0);
  /** @internal */
  p_localCenterA = I(0, 0);
  /** @internal */
  p_localCenterB = I(0, 0);
  /** @internal */
  p_type = Xt.e_unset;
  /** @internal */
  p_radiusA = 0;
  /** @internal */
  p_radiusB = 0;
  /** @internal */
  p_pointCount = 0;
  /** @internal */
  p_invMassA = 0;
  /** @internal */
  p_invMassB = 0;
  /** @internal */
  p_invIA = 0;
  /** @internal */
  p_invIB = 0;
  /** @internal */
  initialize(t, e, s, i, n) {
    this.m_fixtureA = t, this.m_fixtureB = s, this.m_indexA = e, this.m_indexB = i, this.m_evaluateFcn = n, this.m_friction = cr(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction), this.m_restitution = lr(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
  }
  /** @internal */
  recycle() {
    this.m_nodeA.recycle(), this.m_nodeB.recycle(), this.m_fixtureA = null, this.m_fixtureB = null, this.m_indexA = -1, this.m_indexB = -1, this.m_evaluateFcn = null, this.m_manifold.recycle(), this.m_prev = null, this.m_next = null, this.m_toi = 1, this.m_toiCount = 0, this.m_toiFlag = !1, this.m_friction = 0, this.m_restitution = 0, this.m_tangentSpeed = 0, this.m_enabledFlag = !0, this.m_islandFlag = !1, this.m_touchingFlag = !1, this.m_filterFlag = !1, this.m_bulletHitFlag = !1, this.m_impulse.recycle();
    for (const t of this.v_points)
      t.recycle();
    K(this.v_normal), this.v_normalMass.setZero(), this.v_K.setZero(), this.v_pointCount = 0, this.v_tangentSpeed = 0, this.v_friction = 0, this.v_restitution = 0, this.v_invMassA = 0, this.v_invMassB = 0, this.v_invIA = 0, this.v_invIB = 0;
    for (const t of this.p_localPoints)
      K(t);
    K(this.p_localNormal), K(this.p_localPoint), K(this.p_localCenterA), K(this.p_localCenterB), this.p_type = Xt.e_unset, this.p_radiusA = 0, this.p_radiusB = 0, this.p_pointCount = 0, this.p_invMassA = 0, this.p_invMassB = 0, this.p_invIA = 0, this.p_invIB = 0;
  }
  initConstraint(t) {
    const e = this.m_fixtureA, s = this.m_fixtureB;
    if (e === null || s === null) return;
    const i = e.m_body, n = s.m_body;
    if (i === null || n === null) return;
    const o = e.m_shape, r = s.m_shape;
    if (o === null || r === null) return;
    const a = this.m_manifold, c = a.pointCount;
    Ln && console.assert(c > 0), this.v_invMassA = i.m_invMass, this.v_invMassB = n.m_invMass, this.v_invIA = i.m_invI, this.v_invIB = n.m_invI, this.v_friction = this.m_friction, this.v_restitution = this.m_restitution, this.v_tangentSpeed = this.m_tangentSpeed, this.v_pointCount = c, this.v_K.setZero(), this.v_normalMass.setZero(), this.p_invMassA = i.m_invMass, this.p_invMassB = n.m_invMass, this.p_invIA = i.m_invI, this.p_invIB = n.m_invI, S(this.p_localCenterA, i.m_sweep.localCenter), S(this.p_localCenterB, n.m_sweep.localCenter), this.p_radiusA = o.m_radius, this.p_radiusB = r.m_radius, this.p_type = a.type, S(this.p_localNormal, a.localNormal), S(this.p_localPoint, a.localPoint), this.p_pointCount = c;
    for (let l = 0; l < O.maxManifoldPoints; ++l)
      this.v_points[l].recycle(), K(this.p_localPoints[l]);
    for (let l = 0; l < c; ++l) {
      const m = a.points[l], h = this.v_points[l];
      t.warmStarting && (h.normalImpulse = t.dtRatio * m.normalImpulse, h.tangentImpulse = t.dtRatio * m.tangentImpulse), S(this.p_localPoints[l], m.localPoint);
    }
  }
  /**
   * Get the contact manifold. Do not modify the manifold unless you understand
   * the internals of the library.
   */
  getManifold() {
    return this.m_manifold;
  }
  /**
   * Get the world manifold.
   */
  getWorldManifold(t) {
    const e = this.m_fixtureA, s = this.m_fixtureB;
    if (e === null || s === null) return;
    const i = e.m_body, n = s.m_body;
    if (i === null || n === null) return;
    const o = e.m_shape, r = s.m_shape;
    if (!(o === null || r === null))
      return this.m_manifold.getWorldManifold(
        t,
        i.getTransform(),
        o.m_radius,
        n.getTransform(),
        r.m_radius
      );
  }
  /**
   * Enable/disable this contact. This can be used inside the pre-solve contact
   * listener. The contact is only disabled for the current time step (or sub-step
   * in continuous collisions).
   */
  setEnabled(t) {
    this.m_enabledFlag = !!t;
  }
  /**
   * Has this contact been disabled?
   */
  isEnabled() {
    return this.m_enabledFlag;
  }
  /**
   * Is this contact touching?
   */
  isTouching() {
    return this.m_touchingFlag;
  }
  /**
   * Get the next contact in the world's contact list.
   */
  getNext() {
    return this.m_next;
  }
  /**
   * Get fixture A in this contact.
   */
  getFixtureA() {
    return this.m_fixtureA;
  }
  /**
   * Get fixture B in this contact.
   */
  getFixtureB() {
    return this.m_fixtureB;
  }
  /**
   * Get the child primitive index for fixture A.
   */
  getChildIndexA() {
    return this.m_indexA;
  }
  /**
   * Get the child primitive index for fixture B.
   */
  getChildIndexB() {
    return this.m_indexB;
  }
  /**
   * Flag this contact for filtering. Filtering will occur the next time step.
   */
  flagForFiltering() {
    this.m_filterFlag = !0;
  }
  /**
   * Override the default friction mixture. You can call this in
   * "pre-solve" callback. This value persists until set or reset.
   */
  setFriction(t) {
    this.m_friction = t;
  }
  /**
   * Get the friction.
   */
  getFriction() {
    return this.m_friction;
  }
  /**
   * Reset the friction mixture to the default value.
   */
  resetFriction() {
    const t = this.m_fixtureA, e = this.m_fixtureB;
    t === null || e === null || (this.m_friction = cr(t.m_friction, e.m_friction));
  }
  /**
   * Override the default restitution mixture. You can call this in
   * "pre-solve" callback. The value persists until you set or reset.
   */
  setRestitution(t) {
    this.m_restitution = t;
  }
  /**
   * Get the restitution.
   */
  getRestitution() {
    return this.m_restitution;
  }
  /**
   * Reset the restitution to the default value.
   */
  resetRestitution() {
    const t = this.m_fixtureA, e = this.m_fixtureB;
    t === null || e === null || (this.m_restitution = lr(t.m_restitution, e.m_restitution));
  }
  /**
   * Set the desired tangent speed for a conveyor belt behavior. In meters per
   * second.
   */
  setTangentSpeed(t) {
    this.m_tangentSpeed = t;
  }
  /**
   * Get the desired tangent speed. In meters per second.
   */
  getTangentSpeed() {
    return this.m_tangentSpeed;
  }
  /**
   * Called by Update method, and implemented by subclasses.
   */
  evaluate(t, e, s) {
    const i = this.m_fixtureA, n = this.m_fixtureB;
    i === null || n === null || this.m_evaluateFcn(t, e, i, this.m_indexA, s, n, this.m_indexB);
  }
  /**
   * Updates the contact manifold and touching status.
   *
   * Note: do not assume the fixture AABBs are overlapping or are valid.
   *
   * @param listener.beginContact
   * @param listener.endContact
   * @param listener.preSolve
   */
  update(t) {
    const e = this.m_fixtureA, s = this.m_fixtureB;
    if (e === null || s === null) return;
    const i = e.m_body, n = s.m_body;
    if (i === null || n === null) return;
    const o = e.m_shape, r = s.m_shape;
    if (o === null || r === null) return;
    this.m_enabledFlag = !0;
    let a = !1;
    const c = this.m_touchingFlag, l = e.m_isSensor, m = s.m_isSensor, h = l || m, u = i.m_xf, d = n.m_xf;
    if (h)
      a = xr(o, this.m_indexA, r, this.m_indexB, u, d), this.m_manifold.pointCount = 0;
    else {
      Ci.recycle(), Ci.set(this.m_manifold), this.m_manifold.recycle(), this.evaluate(this.m_manifold, u, d), a = this.m_manifold.pointCount > 0;
      for (let y = 0; y < this.m_manifold.pointCount; ++y) {
        const v = this.m_manifold.points[y];
        v.normalImpulse = 0, v.tangentImpulse = 0;
        for (let g = 0; g < Ci.pointCount; ++g) {
          const A = Ci.points[g];
          if (A.id.key === v.id.key) {
            v.normalImpulse = A.normalImpulse, v.tangentImpulse = A.tangentImpulse;
            break;
          }
        }
      }
      a !== c && (i.setAwake(!0), n.setAwake(!0));
    }
    this.m_touchingFlag = a;
    const f = typeof t == "object" && t !== null;
    !c && a && f && t.beginContact(this), c && !a && f && t.endContact(this), !h && a && f && Ci && t.preSolve(this, Ci);
  }
  solvePositionConstraint(t) {
    return this._solvePositionConstraint(t, null, null);
  }
  solvePositionConstraintTOI(t, e, s) {
    return this._solvePositionConstraint(t, e, s);
  }
  _solvePositionConstraint(t, e, s) {
    const i = e !== null && s !== null;
    let n = 0;
    const o = this.m_fixtureA, r = this.m_fixtureB;
    if (o === null || r === null) return n;
    const a = o.m_body, c = r.m_body;
    if (a === null || c === null) return n;
    const l = a.c_position, m = c.c_position, h = this.p_localCenterA, u = this.p_localCenterB;
    let d = 0, f = 0;
    (!i || a === e || a === s) && (d = this.p_invMassA, f = this.p_invIA);
    let y = 0, v = 0;
    (!i || c === e || c === s) && (y = this.p_invMassB, v = this.p_invIB), S(vs, l.c);
    let g = l.a;
    S(As, m.c);
    let A = m.a;
    for (let b = 0; b < this.p_pointCount; ++b) {
      An(ni, h, vs, g), An(oi, u, As, A);
      let B;
      switch (this.p_type) {
        case Xt.e_circles: {
          st(kn, ni, this.p_localPoint), st(On, oi, this.p_localPoints[0]), it(dt, On, kn), ts(dt), Tt(Xi, 0.5, kn, 0.5, On), B = L(On, dt) - L(kn, dt) - this.p_radiusA - this.p_radiusB;
          break;
        }
        case Xt.e_faceA: {
          ke(dt, ni.q, this.p_localNormal), st(jn, ni, this.p_localPoint), st(Ti, oi, this.p_localPoints[b]), B = L(Ti, dt) - L(jn, dt) - this.p_radiusA - this.p_radiusB, S(Xi, Ti);
          break;
        }
        case Xt.e_faceB: {
          ke(dt, oi.q, this.p_localNormal), st(jn, oi, this.p_localPoint), st(Ti, ni, this.p_localPoints[b]), B = L(Ti, dt) - L(jn, dt) - this.p_radiusA - this.p_radiusB, S(Xi, Ti), mn(dt);
          break;
        }
        // todo: what should we do here?
        default:
          return n;
      }
      it(Oo, Xi, vs), it(jo, Xi, As), n = hl(n, B);
      const w = i ? O.toiBaugarte : O.baumgarte, T = O.linearSlop, M = O.maxLinearCorrection, q = Qt(w * (B + T), -M, 0), F = rt(Oo, dt), E = rt(jo, dt), D = d + y + f * F * F + v * E * E, V = D > 0 ? -q / D : 0;
      Z(Nt, V, dt), an(vs, d, Nt), g -= f * rt(Oo, Nt), Ze(As, y, Nt), A += v * rt(jo, Nt);
    }
    return S(l.c, vs), l.a = g, S(m.c, As), m.a = A, n;
  }
  initVelocityConstraint(t) {
    const e = this.m_fixtureA, s = this.m_fixtureB;
    if (e === null || s === null) return;
    const i = e.m_body, n = s.m_body;
    if (i === null || n === null) return;
    const o = i.c_velocity, r = n.c_velocity, a = i.c_position, c = n.c_position, l = this.p_radiusA, m = this.p_radiusB, h = this.m_manifold, u = this.v_invMassA, d = this.v_invMassB, f = this.v_invIA, y = this.v_invIB, v = this.p_localCenterA, g = this.p_localCenterB;
    S(vs, a.c);
    const A = a.a;
    S(zt, o.v);
    const b = o.w;
    S(As, c.c);
    const B = c.a;
    S(Ft, r.v);
    const w = r.w;
    Ln && console.assert(h.pointCount > 0), An(ni, v, vs, A), An(oi, g, As, B), Nn.recycle(), h.getWorldManifold(Nn, ni, l, oi, m), S(this.v_normal, Nn.normal);
    for (let T = 0; T < this.v_pointCount; ++T) {
      const M = this.v_points[T], q = Nn.points[T];
      it(M.rA, q, vs), it(M.rB, q, As);
      const F = rt(M.rA, this.v_normal), E = rt(M.rB, this.v_normal), D = u + d + f * F * F + y * E * E;
      M.normalMass = D > 0 ? 1 / D : 0, yi(Fs, this.v_normal, 1);
      const V = rt(M.rA, Fs), k = rt(M.rB, Fs), N = u + d + f * V * V + y * k * k;
      M.tangentMass = N > 0 ? 1 / N : 0, M.velocityBias = 0;
      let z = 0;
      z += L(this.v_normal, Ft), z += L(this.v_normal, we(os, w, M.rB)), z -= L(this.v_normal, zt), z -= L(this.v_normal, we(os, b, M.rA)), z < -O.velocityThreshold && (M.velocityBias = -this.v_restitution * z);
    }
    if (this.v_pointCount == 2 && t.blockSolve) {
      const T = this.v_points[0], M = this.v_points[1], q = rt(T.rA, this.v_normal), F = rt(T.rB, this.v_normal), E = rt(M.rA, this.v_normal), D = rt(M.rB, this.v_normal), V = u + d + f * q * q + y * F * F, k = u + d + f * E * E + y * D * D, N = u + d + f * q * E + y * F * D;
      if (V * V < 1e3 * (V * k - N * N)) {
        this.v_K.ex.setNum(V, N), this.v_K.ey.setNum(N, k);
        const ct = this.v_K.ex.x, X = this.v_K.ey.x, H = this.v_K.ex.y, J = this.v_K.ey.y;
        let lt = ct * J - X * H;
        lt !== 0 && (lt = 1 / lt), this.v_normalMass.ex.x = lt * J, this.v_normalMass.ey.x = -lt * X, this.v_normalMass.ex.y = -lt * H, this.v_normalMass.ey.y = lt * ct;
      } else
        this.v_pointCount = 1;
    }
    S(a.c, vs), a.a = A, S(o.v, zt), o.w = b, S(c.c, As), c.a = B, S(r.v, Ft), r.w = w;
  }
  warmStartConstraint(t) {
    const e = this.m_fixtureA, s = this.m_fixtureB;
    if (e === null || s === null) return;
    const i = e.m_body, n = s.m_body;
    if (i === null || n === null) return;
    const o = i.c_velocity, r = n.c_velocity, a = this.v_invMassA, c = this.v_invIA, l = this.v_invMassB, m = this.v_invIB;
    S(zt, o.v);
    let h = o.w;
    S(Ft, r.v);
    let u = r.w;
    S(dt, this.v_normal), yi(Fs, dt, 1);
    for (let d = 0; d < this.v_pointCount; ++d) {
      const f = this.v_points[d];
      Tt(Nt, f.normalImpulse, dt, f.tangentImpulse, Fs), h -= c * rt(f.rA, Nt), an(zt, a, Nt), u += m * rt(f.rB, Nt), Ze(Ft, l, Nt);
    }
    S(o.v, zt), o.w = h, S(r.v, Ft), r.w = u;
  }
  storeConstraintImpulses(t) {
    const e = this.m_manifold;
    for (let s = 0; s < this.v_pointCount; ++s)
      e.points[s].normalImpulse = this.v_points[s].normalImpulse, e.points[s].tangentImpulse = this.v_points[s].tangentImpulse;
  }
  solveVelocityConstraint(t) {
    const e = this.m_fixtureA, s = this.m_fixtureB;
    if (e === null || s === null) return;
    const i = e.m_body, n = s.m_body;
    if (i === null || n === null) return;
    const o = i.c_velocity, r = n.c_velocity, a = this.v_invMassA, c = this.v_invIA, l = this.v_invMassB, m = this.v_invIB;
    S(zt, o.v);
    let h = o.w;
    S(Ft, r.v);
    let u = r.w;
    S(dt, this.v_normal), yi(Fs, dt, 1);
    const d = this.v_friction;
    Ln && console.assert(this.v_pointCount == 1 || this.v_pointCount == 2);
    for (let f = 0; f < this.v_pointCount; ++f) {
      const y = this.v_points[f];
      K(Ee), Ne(Ee, Ft), Ne(Ee, we(os, u, y.rB)), Ms(Ee, zt), Ms(Ee, we(os, h, y.rA));
      const v = L(Ee, Fs) - this.v_tangentSpeed;
      let g = y.tangentMass * -v;
      const A = d * y.normalImpulse, b = Qt(y.tangentImpulse + g, -A, A);
      g = b - y.tangentImpulse, y.tangentImpulse = b, Z(Nt, g, Fs), an(zt, a, Nt), h -= c * rt(y.rA, Nt), Ze(Ft, l, Nt), u += m * rt(y.rB, Nt);
    }
    if (this.v_pointCount == 1 || t.blockSolve == !1)
      for (let f = 0; f < this.v_pointCount; ++f) {
        const y = this.v_points[f];
        K(Ee), Ne(Ee, Ft), Ne(Ee, we(os, u, y.rB)), Ms(Ee, zt), Ms(Ee, we(os, h, y.rA));
        const v = L(Ee, dt);
        let g = -y.normalMass * (v - y.velocityBias);
        const A = ll(y.normalImpulse + g, 0);
        g = A - y.normalImpulse, y.normalImpulse = A, Z(Nt, g, dt), an(zt, a, Nt), h -= c * rt(y.rA, Nt), Ze(Ft, l, Nt), u += m * rt(y.rB, Nt);
      }
    else {
      const f = this.v_points[0], y = this.v_points[1];
      Zt(We, f.normalImpulse, y.normalImpulse), Ln && console.assert(We.x >= 0 && We.y >= 0), K(Mi), Ne(Mi, Ft), Ne(Mi, we(os, u, f.rB)), Ms(Mi, zt), Ms(Mi, we(os, h, f.rA)), K(Ii), Ne(Ii, Ft), Ne(Ii, we(os, u, y.rB)), Ms(Ii, zt), Ms(Ii, we(os, h, y.rA));
      let v = L(Mi, dt), g = L(Ii, dt);
      for (Zt(Be, v - f.velocityBias, g - y.velocityBias), Be.x -= this.v_K.ex.x * We.x + this.v_K.ey.x * We.y, Be.y -= this.v_K.ex.y * We.x + this.v_K.ey.y * We.y; ; ) {
        if (K(xt), xt.x = -(this.v_normalMass.ex.x * Be.x + this.v_normalMass.ey.x * Be.y), xt.y = -(this.v_normalMass.ex.y * Be.x + this.v_normalMass.ey.y * Be.y), xt.x >= 0 && xt.y >= 0) {
          it(qe, xt, We), Z(kt, qe.x, dt), Z(Ot, qe.y, dt), ds(zt, -a, kt, -a, Ot, 1, zt), h -= c * (rt(f.rA, kt) + rt(y.rA, Ot)), ds(Ft, l, kt, l, Ot, 1, Ft), u += m * (rt(f.rB, kt) + rt(y.rB, Ot)), f.normalImpulse = xt.x, y.normalImpulse = xt.y;
          break;
        }
        if (xt.x = -f.normalMass * Be.x, xt.y = 0, v = 0, g = this.v_K.ex.y * xt.x + Be.y, xt.x >= 0 && g >= 0) {
          it(qe, xt, We), Z(kt, qe.x, dt), Z(Ot, qe.y, dt), ds(zt, -a, kt, -a, Ot, 1, zt), h -= c * (rt(f.rA, kt) + rt(y.rA, Ot)), ds(Ft, l, kt, l, Ot, 1, Ft), u += m * (rt(f.rB, kt) + rt(y.rB, Ot)), f.normalImpulse = xt.x, y.normalImpulse = xt.y;
          break;
        }
        if (xt.x = 0, xt.y = -y.normalMass * Be.y, v = this.v_K.ey.x * xt.y + Be.x, g = 0, xt.y >= 0 && v >= 0) {
          it(qe, xt, We), Z(kt, qe.x, dt), Z(Ot, qe.y, dt), ds(zt, -a, kt, -a, Ot, 1, zt), h -= c * (rt(f.rA, kt) + rt(y.rA, Ot)), ds(Ft, l, kt, l, Ot, 1, Ft), u += m * (rt(f.rB, kt) + rt(y.rB, Ot)), f.normalImpulse = xt.x, y.normalImpulse = xt.y;
          break;
        }
        if (xt.x = 0, xt.y = 0, v = Be.x, g = Be.y, v >= 0 && g >= 0) {
          it(qe, xt, We), Z(kt, qe.x, dt), Z(Ot, qe.y, dt), ds(zt, -a, kt, -a, Ot, 1, zt), h -= c * (rt(f.rA, kt) + rt(y.rA, Ot)), ds(Ft, l, kt, l, Ot, 1, Ft), u += m * (rt(f.rB, kt) + rt(y.rB, Ot)), f.normalImpulse = xt.x, y.normalImpulse = xt.y;
          break;
        }
        break;
      }
    }
    S(o.v, zt), o.w = h, S(r.v, Ft), r.w = u;
  }
  /** @internal */
  static addType(t, e, s) {
    ii[t] = ii[t] || {}, ii[t][e] = s;
  }
  /** @internal */
  static create(t, e, s, i) {
    const n = t.m_shape.m_type, o = s.m_shape.m_type, r = ta.allocate();
    let a;
    if (a = ii[n] && ii[n][o])
      r.initialize(t, e, s, i, a);
    else if (a = ii[o] && ii[o][n])
      r.initialize(s, i, t, e, a);
    else
      return null;
    t = r.m_fixtureA, s = r.m_fixtureB, e = r.getChildIndexA(), i = r.getChildIndexB();
    const c = t.m_body, l = s.m_body;
    return r.m_nodeA.contact = r, r.m_nodeA.other = l, r.m_nodeA.prev = null, r.m_nodeA.next = c.m_contactList, c.m_contactList != null && (c.m_contactList.prev = r.m_nodeA), c.m_contactList = r.m_nodeA, r.m_nodeB.contact = r, r.m_nodeB.other = c, r.m_nodeB.prev = null, r.m_nodeB.next = l.m_contactList, l.m_contactList != null && (l.m_contactList.prev = r.m_nodeB), l.m_contactList = r.m_nodeB, t.isSensor() == !1 && s.isSensor() == !1 && (c.setAwake(!0), l.setAwake(!0)), r;
  }
  /** @internal */
  static destroy(t, e) {
    const s = t.m_fixtureA, i = t.m_fixtureB;
    if (s === null || i === null) return;
    const n = s.m_body, o = i.m_body;
    n === null || o === null || (t.isTouching() && e.endContact(t), t.m_nodeA.prev && (t.m_nodeA.prev.next = t.m_nodeA.next), t.m_nodeA.next && (t.m_nodeA.next.prev = t.m_nodeA.prev), t.m_nodeA == n.m_contactList && (n.m_contactList = t.m_nodeA.next), t.m_nodeB.prev && (t.m_nodeB.prev.next = t.m_nodeB.next), t.m_nodeB.next && (t.m_nodeB.next.prev = t.m_nodeB.prev), t.m_nodeB == o.m_contactList && (o.m_contactList = t.m_nodeB.next), t.m_manifold.pointCount > 0 && !s.m_isSensor && !i.m_isSensor && (n.setAwake(!0), o.setAwake(!0)), ta.release(t));
  }
};
const Le = typeof ASSERT > "u" ? !1 : ASSERT, ml = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, ul = {
  gravity: p.zero(),
  allowSleep: !0,
  warmStarting: !0,
  continuousPhysics: !0,
  subStepping: !1,
  blockSolve: !0,
  velocityIterations: 8,
  positionIterations: 3
};
let yn = class cn {
  /** @internal */
  m_solver;
  /** @internal */
  m_broadPhase;
  /** @internal */
  m_contactList;
  /** @internal */
  m_contactCount;
  /** @internal */
  m_bodyList;
  /** @internal */
  m_bodyCount;
  /** @internal */
  m_jointList;
  /** @internal */
  m_jointCount;
  /** @internal */
  m_stepComplete;
  /** @internal */
  m_allowSleep;
  /** @internal */
  m_gravity;
  /** @internal */
  m_clearForces;
  /** @internal */
  m_newFixture;
  /** @internal */
  m_locked;
  /** @internal */
  m_warmStarting;
  /** @internal */
  m_continuousPhysics;
  /** @internal */
  m_subStepping;
  /** @internal */
  m_blockSolve;
  /** @internal */
  m_velocityIterations;
  /** @internal */
  m_positionIterations;
  /** @internal */
  m_t;
  /** @internal */
  m_step_callback;
  // TODO
  /** @internal */
  _listeners;
  /**
   * @param def World definition or gravity vector.
   */
  constructor(t) {
    if (ml && !(this instanceof cn))
      return new cn(t);
    this.s_step = new _o(), t ? p.isValid(t) && (t = { gravity: t }) : t = {}, t = Ce(t, ul), this.m_solver = new br(this), this.m_broadPhase = new Qa(), this.m_contactList = null, this.m_contactCount = 0, this.m_bodyList = null, this.m_bodyCount = 0, this.m_jointList = null, this.m_jointCount = 0, this.m_stepComplete = !0, this.m_allowSleep = t.allowSleep, this.m_gravity = p.clone(t.gravity), this.m_clearForces = !0, this.m_newFixture = !1, this.m_locked = !1, this.m_warmStarting = t.warmStarting, this.m_continuousPhysics = t.continuousPhysics, this.m_subStepping = t.subStepping, this.m_blockSolve = t.blockSolve, this.m_velocityIterations = t.velocityIterations, this.m_positionIterations = t.positionIterations, this.m_t = 0, this.m_step_callback = [];
  }
  /** @hidden */
  _serialize() {
    const t = [], e = [];
    for (let s = this.getBodyList(); s; s = s.getNext())
      t.push(s);
    for (let s = this.getJointList(); s; s = s.getNext())
      typeof s._serialize == "function" && e.push(s);
    return {
      gravity: this.m_gravity,
      bodies: t,
      joints: e
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    if (!t)
      return new cn();
    const i = new cn(t.gravity);
    if (t.bodies)
      for (let n = t.bodies.length - 1; n >= 0; n -= 1)
        i._addBody(s(ut, t.bodies[n], i));
    if (t.joints)
      for (let n = t.joints.length - 1; n >= 0; n--)
        i.createJoint(s(te, t.joints[n], i));
    return i;
  }
  /**
   * Get the world body list. With the returned body, use Body.getNext to get the
   * next body in the world list. A null body indicates the end of the list.
   *
   * @return the head of the world body list.
   */
  getBodyList() {
    return this.m_bodyList;
  }
  /**
   * Get the world joint list. With the returned joint, use Joint.getNext to get
   * the next joint in the world list. A null joint indicates the end of the list.
   *
   * @return the head of the world joint list.
   */
  getJointList() {
    return this.m_jointList;
  }
  /**
   * Get the world contact list. With the returned contact, use Contact.getNext to
   * get the next contact in the world list. A null contact indicates the end of
   * the list.
   *
   * Warning: contacts are created and destroyed in the middle of a time step.
   * Use ContactListener to avoid missing contacts.
   *
   * @return the head of the world contact list.
   */
  getContactList() {
    return this.m_contactList;
  }
  getBodyCount() {
    return this.m_bodyCount;
  }
  getJointCount() {
    return this.m_jointCount;
  }
  /**
   * Get the number of contacts (each may have 0 or more contact points).
   */
  getContactCount() {
    return this.m_contactCount;
  }
  /**
   * Change the global gravity vector.
   */
  setGravity(t) {
    this.m_gravity.set(t);
  }
  /**
   * Get the global gravity vector.
   */
  getGravity() {
    return this.m_gravity;
  }
  /**
   * Is the world locked (in the middle of a time step).
   */
  isLocked() {
    return this.m_locked;
  }
  /**
   * Enable/disable sleep.
   */
  setAllowSleeping(t) {
    if (t != this.m_allowSleep && (this.m_allowSleep = t, this.m_allowSleep == !1))
      for (let e = this.m_bodyList; e; e = e.m_next)
        e.setAwake(!0);
  }
  getAllowSleeping() {
    return this.m_allowSleep;
  }
  /**
   * Enable/disable warm starting. For testing.
   */
  setWarmStarting(t) {
    this.m_warmStarting = t;
  }
  getWarmStarting() {
    return this.m_warmStarting;
  }
  /**
   * Enable/disable continuous physics. For testing.
   */
  setContinuousPhysics(t) {
    this.m_continuousPhysics = t;
  }
  getContinuousPhysics() {
    return this.m_continuousPhysics;
  }
  /**
   * Enable/disable single stepped continuous physics. For testing.
   */
  setSubStepping(t) {
    this.m_subStepping = t;
  }
  getSubStepping() {
    return this.m_subStepping;
  }
  /**
   * Set flag to control automatic clearing of forces after each time step.
   */
  setAutoClearForces(t) {
    this.m_clearForces = t;
  }
  /**
   * Get the flag that controls automatic clearing of forces after each time step.
   */
  getAutoClearForces() {
    return this.m_clearForces;
  }
  /**
   * Manually clear the force buffer on all bodies. By default, forces are cleared
   * automatically after each call to step. The default behavior is modified by
   * calling setAutoClearForces. The purpose of this function is to support
   * sub-stepping. Sub-stepping is often used to maintain a fixed sized time step
   * under a variable frame-rate. When you perform sub-stepping you will disable
   * auto clearing of forces and instead call clearForces after all sub-steps are
   * complete in one pass of your game loop.
   *
   * See {@link World.setAutoClearForces}
   */
  clearForces() {
    for (let t = this.m_bodyList; t; t = t.getNext())
      t.m_force.setZero(), t.m_torque = 0;
  }
  /**
   * Query the world for all fixtures that potentially overlap the provided AABB.
   *
   * @param aabb The query box.
   * @param callback Called for each fixture found in the query AABB. It may return `false` to terminate the query.
   */
  queryAABB(t, e) {
    Le && console.assert(typeof e == "function");
    const s = this.m_broadPhase;
    this.m_broadPhase.query(t, function(i) {
      const n = s.getUserData(i);
      return e(n.fixture);
    });
  }
  /**
   * Ray-cast the world for all fixtures in the path of the ray. Your callback
   * controls whether you get the closest point, any point, or n-points. The
   * ray-cast ignores shapes that contain the starting point.
   *
   * @param point1 The ray starting point
   * @param point2 The ray ending point
   * @param callback A function that is called for each fixture that is hit by the ray. You control how the ray cast proceeds by returning a numeric/float value.
   */
  rayCast(t, e, s) {
    Le && console.assert(typeof s == "function");
    const i = this.m_broadPhase;
    this.m_broadPhase.rayCast(
      {
        maxFraction: 1,
        p1: t,
        p2: e
      },
      function(n, o) {
        const r = i.getUserData(o), a = r.fixture, c = r.childIndex, l = {};
        if (a.rayCast(l, n, c)) {
          const h = l.fraction, u = p.add(p.mulNumVec2(1 - h, n.p1), p.mulNumVec2(h, n.p2));
          return s(a, u, l.normal, h);
        }
        return n.maxFraction;
      }
    );
  }
  /**
   * Get the number of broad-phase proxies.
   */
  getProxyCount() {
    return this.m_broadPhase.getProxyCount();
  }
  /**
   * Get the height of broad-phase dynamic tree.
   */
  getTreeHeight() {
    return this.m_broadPhase.getTreeHeight();
  }
  /**
   * Get the balance of broad-phase dynamic tree.
   */
  getTreeBalance() {
    return this.m_broadPhase.getTreeBalance();
  }
  /**
   * Get the quality metric of broad-phase dynamic tree. The smaller the better.
   * The minimum is 1.
   */
  getTreeQuality() {
    return this.m_broadPhase.getTreeQuality();
  }
  /**
   * Shift the world origin. Useful for large worlds. The body shift formula is:
   * position -= newOrigin
   *
   * @param newOrigin The new origin with respect to the old origin
   *
   * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
   */
  shiftOrigin(t) {
    if (Le && console.assert(this.isLocked() == !1), !this.isLocked()) {
      for (let e = this.m_bodyList; e; e = e.m_next)
        e.m_xf.p.sub(t), e.m_sweep.c0.sub(t), e.m_sweep.c.sub(t);
      for (let e = this.m_jointList; e; e = e.m_next)
        e.shiftOrigin(t);
      this.m_broadPhase.shiftOrigin(t);
    }
  }
  /** @internal Used for deserialize. */
  _addBody(t) {
    Le && console.assert(this.isLocked() === !1), !this.isLocked() && (t.m_prev = null, t.m_next = this.m_bodyList, this.m_bodyList && (this.m_bodyList.m_prev = t), this.m_bodyList = t, ++this.m_bodyCount);
  }
  // tslint:disable-next-line:typedef
  createBody(t, e) {
    if (Le && console.assert(this.isLocked() == !1), this.isLocked())
      return null;
    let s = {};
    t && (p.isValid(t) ? s = { position: t, angle: e } : typeof t == "object" && (s = t));
    const i = new ut(this, s);
    return this._addBody(i), i;
  }
  // tslint:disable-next-line:typedef
  createDynamicBody(t, e) {
    let s = {};
    return t && (p.isValid(t) ? s = { position: t, angle: e } : typeof t == "object" && (s = t)), s.type = "dynamic", this.createBody(s);
  }
  // tslint:disable-next-line:typedef
  createKinematicBody(t, e) {
    let s = {};
    return t && (p.isValid(t) ? s = { position: t, angle: e } : typeof t == "object" && (s = t)), s.type = "kinematic", this.createBody(s);
  }
  /**
   * Destroy a body from the world.
   *
   * Warning: This automatically deletes all associated shapes and joints.
   *
   * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
   */
  destroyBody(t) {
    if (Le && console.assert(this.m_bodyCount > 0), Le && console.assert(this.isLocked() == !1), this.isLocked())
      return;
    if (t.m_destroyed)
      return !1;
    let e = t.m_jointList;
    for (; e; ) {
      const n = e;
      e = e.next, this.publish("remove-joint", n.joint), this.destroyJoint(n.joint), t.m_jointList = e;
    }
    t.m_jointList = null;
    let s = t.m_contactList;
    for (; s; ) {
      const n = s;
      s = s.next, this.destroyContact(n.contact), t.m_contactList = s;
    }
    t.m_contactList = null;
    let i = t.m_fixtureList;
    for (; i; ) {
      const n = i;
      i = i.m_next, this.publish("remove-fixture", n), n.destroyProxies(this.m_broadPhase), t.m_fixtureList = i;
    }
    return t.m_fixtureList = null, t.m_prev && (t.m_prev.m_next = t.m_next), t.m_next && (t.m_next.m_prev = t.m_prev), t == this.m_bodyList && (this.m_bodyList = t.m_next), t.m_destroyed = !0, --this.m_bodyCount, this.publish("remove-body", t), !0;
  }
  /**
   * Create a joint to constrain bodies together. No reference to the definition
   * is retained. This may cause the connected bodies to cease colliding.
   *
   * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
   */
  createJoint(t) {
    if (Le && console.assert(!!t.m_bodyA), Le && console.assert(!!t.m_bodyB), Le && console.assert(this.isLocked() == !1), this.isLocked())
      return null;
    if (t.m_prev = null, t.m_next = this.m_jointList, this.m_jointList && (this.m_jointList.m_prev = t), this.m_jointList = t, ++this.m_jointCount, t.m_edgeA.joint = t, t.m_edgeA.other = t.m_bodyB, t.m_edgeA.prev = null, t.m_edgeA.next = t.m_bodyA.m_jointList, t.m_bodyA.m_jointList && (t.m_bodyA.m_jointList.prev = t.m_edgeA), t.m_bodyA.m_jointList = t.m_edgeA, t.m_edgeB.joint = t, t.m_edgeB.other = t.m_bodyA, t.m_edgeB.prev = null, t.m_edgeB.next = t.m_bodyB.m_jointList, t.m_bodyB.m_jointList && (t.m_bodyB.m_jointList.prev = t.m_edgeB), t.m_bodyB.m_jointList = t.m_edgeB, t.m_collideConnected == !1)
      for (let e = t.m_bodyB.getContactList(); e; e = e.next)
        e.other == t.m_bodyA && e.contact.flagForFiltering();
    return t;
  }
  /**
   * Destroy a joint.
   *
   * Warning: This may cause the connected bodies to begin colliding.
   *
   * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
   */
  destroyJoint(t) {
    if (Le && console.assert(this.isLocked() == !1), this.isLocked())
      return;
    t.m_prev && (t.m_prev.m_next = t.m_next), t.m_next && (t.m_next.m_prev = t.m_prev), t == this.m_jointList && (this.m_jointList = t.m_next);
    const e = t.m_bodyA, s = t.m_bodyB;
    if (e.setAwake(!0), s.setAwake(!0), t.m_edgeA.prev && (t.m_edgeA.prev.next = t.m_edgeA.next), t.m_edgeA.next && (t.m_edgeA.next.prev = t.m_edgeA.prev), t.m_edgeA == e.m_jointList && (e.m_jointList = t.m_edgeA.next), t.m_edgeA.prev = null, t.m_edgeA.next = null, t.m_edgeB.prev && (t.m_edgeB.prev.next = t.m_edgeB.next), t.m_edgeB.next && (t.m_edgeB.next.prev = t.m_edgeB.prev), t.m_edgeB == s.m_jointList && (s.m_jointList = t.m_edgeB.next), t.m_edgeB.prev = null, t.m_edgeB.next = null, Le && console.assert(this.m_jointCount > 0), --this.m_jointCount, t.m_collideConnected == !1) {
      let i = s.getContactList();
      for (; i; )
        i.other == e && i.contact.flagForFiltering(), i = i.next;
    }
    this.publish("remove-joint", t);
  }
  /** @internal */
  s_step;
  // reuse
  /**
   * Take a time step. This performs collision detection, integration, and
   * constraint solution.
   *
   * Broad-phase, narrow-phase, solve and solve time of impacts.
   *
   * @param timeStep Time step, this should not vary.
   */
  step(t, e, s) {
    if (this.publish("pre-step", t), (e | 0) !== e && (e = 0), e = e || this.m_velocityIterations, s = s || this.m_positionIterations, this.m_newFixture && (this.findNewContacts(), this.m_newFixture = !1), this.m_locked = !0, this.s_step.reset(t), this.s_step.velocityIterations = e, this.s_step.positionIterations = s, this.s_step.warmStarting = this.m_warmStarting, this.s_step.blockSolve = this.m_blockSolve, this.updateContacts(), this.m_stepComplete && t > 0) {
      this.m_solver.solveWorld(this.s_step);
      for (let n = this.m_bodyList; n; n = n.getNext())
        n.m_islandFlag != !1 && (n.isStatic() || n.synchronizeFixtures());
      this.findNewContacts();
    }
    this.m_continuousPhysics && t > 0 && this.m_solver.solveWorldTOI(this.s_step), this.m_clearForces && this.clearForces(), this.m_locked = !1;
    let i;
    for (; i = this.m_step_callback.shift(); )
      i(this);
    this.publish("post-step", t);
  }
  /**
   * Queue a function to be called after ongoing simulation step. If no simulation is in progress call it immediately.
   */
  queueUpdate(t) {
    this.isLocked() ? this.m_step_callback.push(t) : t(this);
  }
  /**
   * @internal
   * Call this method to find new contacts.
   */
  findNewContacts() {
    this.m_broadPhase.updatePairs((t, e) => this.createContact(t, e));
  }
  /**
   * @internal
   * Callback for broad-phase.
   */
  createContact(t, e) {
    const s = t.fixture, i = e.fixture, n = t.childIndex, o = e.childIndex, r = s.getBody(), a = i.getBody();
    if (r == a)
      return;
    let c = a.getContactList();
    for (; c; ) {
      if (c.other == r) {
        const m = c.contact.getFixtureA(), h = c.contact.getFixtureB(), u = c.contact.getChildIndexA(), d = c.contact.getChildIndexB();
        if (m == s && h == i && u == n && d == o || m == i && h == s && u == o && d == n)
          return;
      }
      c = c.next;
    }
    if (a.shouldCollide(r) == !1 || i.shouldCollide(s) == !1)
      return;
    const l = ss.create(s, n, i, o);
    l != null && (l.m_prev = null, this.m_contactList != null && (l.m_next = this.m_contactList, this.m_contactList.m_prev = l), this.m_contactList = l, ++this.m_contactCount);
  }
  /**
   * @internal
   * Removes old non-overlapping contacts, applies filters and updates contacts.
   */
  updateContacts() {
    let t, e = this.m_contactList;
    for (; t = e; ) {
      e = t.getNext();
      const s = t.getFixtureA(), i = t.getFixtureB(), n = t.getChildIndexA(), o = t.getChildIndexB(), r = s.getBody(), a = i.getBody();
      if (t.m_filterFlag) {
        if (a.shouldCollide(r) == !1) {
          this.destroyContact(t);
          continue;
        }
        if (i.shouldCollide(s) == !1) {
          this.destroyContact(t);
          continue;
        }
        t.m_filterFlag = !1;
      }
      const c = r.isAwake() && !r.isStatic(), l = a.isAwake() && !a.isStatic();
      if (c == !1 && l == !1)
        continue;
      const m = s.m_proxies[n].proxyId, h = i.m_proxies[o].proxyId;
      if (this.m_broadPhase.testOverlap(m, h) == !1) {
        this.destroyContact(t);
        continue;
      }
      t.update(this);
    }
  }
  /** @internal */
  destroyContact(t) {
    t.m_prev && (t.m_prev.m_next = t.m_next), t.m_next && (t.m_next.m_prev = t.m_prev), t == this.m_contactList && (this.m_contactList = t.m_next), ss.destroy(t, this), --this.m_contactCount;
  }
  /**
   * Register an event listener.
   */
  // tslint:disable-next-line:typedef
  on(t, e) {
    return typeof t != "string" || typeof e != "function" ? this : (this._listeners || (this._listeners = {}), this._listeners[t] || (this._listeners[t] = []), this._listeners[t].push(e), this);
  }
  /**
   * Remove an event listener.
   */
  // tslint:disable-next-line:typedef
  off(t, e) {
    if (typeof t != "string" || typeof e != "function")
      return this;
    const s = this._listeners && this._listeners[t];
    if (!s || !s.length)
      return this;
    const i = s.indexOf(e);
    return i >= 0 && s.splice(i, 1), this;
  }
  publish(t, e, s, i) {
    const n = this._listeners && this._listeners[t];
    if (!n || !n.length)
      return 0;
    for (let o = 0; o < n.length; o++)
      n[o].call(this, e, s, i);
    return n.length;
  }
  /** @internal */
  beginContact(t) {
    this.publish("begin-contact", t);
  }
  /** @internal */
  endContact(t) {
    this.publish("end-contact", t);
  }
  /** @internal */
  preSolve(t, e) {
    this.publish("pre-solve", t, e);
  }
  /** @internal */
  postSolve(t, e) {
    this.publish("post-solve", t, e);
  }
  /**
   * Joints and fixtures are destroyed when their associated body is destroyed.
   * Register a destruction listener so that you may nullify references to these
   * joints and shapes.
   *
   * `function(object)` is called when any joint or fixture is about to
   * be destroyed due to the destruction of one of its attached or parent bodies.
   */
  /**
   * Register a contact filter to provide specific control over collision.
   * Otherwise the default filter is used (defaultFilter). The listener is owned
   * by you and must remain in scope.
   *
   * Moved to Fixture.
   */
};
const Ki = typeof ASSERT > "u" ? !1 : ASSERT, dl = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY;
let ht = class ne {
  x;
  y;
  z;
  constructor(t, e, s) {
    if (dl && !(this instanceof ne))
      return new ne(t, e, s);
    typeof t > "u" ? (this.x = 0, this.y = 0, this.z = 0) : typeof t == "object" ? (this.x = t.x, this.y = t.y, this.z = t.z) : (this.x = t, this.y = e, this.z = s), Ki && ne.assert(this);
  }
  /** @hidden */
  _serialize() {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }
  /** @hidden */
  static _deserialize(t) {
    const e = Object.create(ne.prototype);
    return e.x = t.x, e.y = t.y, e.z = t.z, e;
  }
  /** @hidden */
  static neo(t, e, s) {
    const i = Object.create(ne.prototype);
    return i.x = t, i.y = e, i.z = s, i;
  }
  static zero() {
    const t = Object.create(ne.prototype);
    return t.x = 0, t.y = 0, t.z = 0, t;
  }
  static clone(t) {
    return Ki && ne.assert(t), ne.neo(t.x, t.y, t.z);
  }
  /** @hidden */
  toString() {
    return JSON.stringify(this);
  }
  /** Does this vector contain finite coordinates? */
  static isValid(t) {
    return t === null || typeof t > "u" ? !1 : Number.isFinite(t.x) && Number.isFinite(t.y) && Number.isFinite(t.z);
  }
  static assert(t) {
    Ki && console.assert(!ne.isValid(t), "Invalid Vec3!", t);
  }
  setZero() {
    return this.x = 0, this.y = 0, this.z = 0, this;
  }
  set(t, e, s) {
    return this.x = t, this.y = e, this.z = s, this;
  }
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this;
  }
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
  }
  mul(t) {
    return this.x *= t, this.y *= t, this.z *= t, this;
  }
  static areEqual(t, e) {
    return Ki && ne.assert(t), Ki && ne.assert(e), t === e || typeof t == "object" && t !== null && typeof e == "object" && e !== null && t.x === e.x && t.y === e.y && t.z === e.z;
  }
  /** Dot product on two vectors */
  static dot(t, e) {
    return t.x * e.x + t.y * e.y + t.z * e.z;
  }
  /** Cross product on two vectors */
  static cross(t, e) {
    return new ne(t.y * e.z - t.z * e.y, t.z * e.x - t.x * e.z, t.x * e.y - t.y * e.x);
  }
  static add(t, e) {
    return new ne(t.x + e.x, t.y + e.y, t.z + e.z);
  }
  static sub(t, e) {
    return new ne(t.x - e.x, t.y - e.y, t.z - e.z);
  }
  static mul(t, e) {
    return new ne(e * t.x, e * t.y, e * t.z);
  }
  neg() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  static neg(t) {
    return new ne(-t.x, -t.y, -t.z);
  }
};
const pl = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, ea = I(0, 0), sa = I(0, 0);
class Jt extends Js {
  static TYPE = "edge";
  /** @hidden */
  m_type;
  /** @hidden */
  m_radius;
  // These are the edge vertices
  /** @hidden */
  m_vertex1;
  /** @hidden */
  m_vertex2;
  // Optional adjacent vertices. These are used for smooth collision.
  // Used by chain shape.
  /** @hidden */
  m_vertex0;
  /** @hidden */
  m_vertex3;
  /** @hidden */
  m_hasVertex0;
  /** @hidden */
  m_hasVertex3;
  constructor(t, e) {
    if (pl && !(this instanceof Jt))
      return new Jt(t, e);
    super(), this.m_type = Jt.TYPE, this.m_radius = O.polygonRadius, this.m_vertex1 = t ? p.clone(t) : p.zero(), this.m_vertex2 = e ? p.clone(e) : p.zero(), this.m_vertex0 = p.zero(), this.m_vertex3 = p.zero(), this.m_hasVertex0 = !1, this.m_hasVertex3 = !1;
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      vertex1: this.m_vertex1,
      vertex2: this.m_vertex2,
      vertex0: this.m_vertex0,
      vertex3: this.m_vertex3,
      hasVertex0: this.m_hasVertex0,
      hasVertex3: this.m_hasVertex3
    };
  }
  /** @hidden */
  static _deserialize(t) {
    const e = new Jt(t.vertex1, t.vertex2);
    return e.m_hasVertex0 && e.setPrevVertex(t.vertex0), e.m_hasVertex3 && e.setNextVertex(t.vertex3), e;
  }
  /** @hidden */
  _reset() {
  }
  getRadius() {
    return this.m_radius;
  }
  getType() {
    return this.m_type;
  }
  /** @internal @deprecated */
  setNext(t) {
    return this.setNextVertex(t);
  }
  /**
   * Optional next vertex, used for smooth collision.
   */
  setNextVertex(t) {
    return t ? (this.m_vertex3.setVec2(t), this.m_hasVertex3 = !0) : (this.m_vertex3.setZero(), this.m_hasVertex3 = !1), this;
  }
  /**
   * Optional next vertex, used for smooth collision.
   */
  getNextVertex() {
    return this.m_vertex3;
  }
  /** @internal @deprecated */
  setPrev(t) {
    return this.setPrevVertex(t);
  }
  /**
   * Optional prev vertex, used for smooth collision.
   */
  setPrevVertex(t) {
    return t ? (this.m_vertex0.setVec2(t), this.m_hasVertex0 = !0) : (this.m_vertex0.setZero(), this.m_hasVertex0 = !1), this;
  }
  /**
   * Optional prev vertex, used for smooth collision.
   */
  getPrevVertex() {
    return this.m_vertex0;
  }
  /**
   * Set this as an isolated edge.
   */
  _set(t, e) {
    return this.m_vertex1.setVec2(t), this.m_vertex2.setVec2(e), this.m_hasVertex0 = !1, this.m_hasVertex3 = !1, this;
  }
  /**
   * @internal @deprecated Shapes should be treated as immutable.
   *
   * clone the concrete shape.
   */
  _clone() {
    const t = new Jt();
    return t.m_type = this.m_type, t.m_radius = this.m_radius, t.m_vertex1.setVec2(this.m_vertex1), t.m_vertex2.setVec2(this.m_vertex2), t.m_vertex0.setVec2(this.m_vertex0), t.m_vertex3.setVec2(this.m_vertex3), t.m_hasVertex0 = this.m_hasVertex0, t.m_hasVertex3 = this.m_hasVertex3, t;
  }
  /**
   * Get the number of child primitives.
   */
  getChildCount() {
    return 1;
  }
  /**
   * Test a point for containment in this shape. This only works for convex
   * shapes.
   *
   * @param xf The shape world transform.
   * @param p A point in world coordinates.
   */
  testPoint(t, e) {
    return !1;
  }
  /**
   * Cast a ray against a child shape.
   *
   * @param output The ray-cast results.
   * @param input The ray-cast input parameters.
   * @param xf The transform to be applied to the shape.
   * @param childIndex The child shape index
   */
  rayCast(t, e, s, i) {
    const n = C.mulTVec2(s.q, p.sub(e.p1, s.p)), o = C.mulTVec2(s.q, p.sub(e.p2, s.p)), r = p.sub(o, n), a = this.m_vertex1, c = this.m_vertex2, l = p.sub(c, a), m = p.neo(l.y, -l.x);
    m.normalize();
    const h = p.dot(m, p.sub(a, n)), u = p.dot(m, r);
    if (u == 0)
      return !1;
    const d = h / u;
    if (d < 0 || e.maxFraction < d)
      return !1;
    const f = p.add(n, p.mulNumVec2(d, r)), y = p.sub(c, a), v = p.dot(y, y);
    if (v == 0)
      return !1;
    const g = p.dot(p.sub(f, a), y) / v;
    return g < 0 || 1 < g ? !1 : (t.fraction = d, h > 0 ? t.normal = C.mulVec2(s.q, m).neg() : t.normal = C.mulVec2(s.q, m), !0);
  }
  /**
   * Given a transform, compute the associated axis aligned bounding box for a
   * child shape.
   *
   * @param aabb Returns the axis aligned box.
   * @param xf The world transform of the shape.
   * @param childIndex The child shape
   */
  computeAABB(t, e, s) {
    st(ea, e, this.m_vertex1), st(sa, e, this.m_vertex2), Ct.combinePoints(t, ea, sa), Ct.extend(t, this.m_radius);
  }
  /**
   * Compute the mass properties of this shape using its dimensions and density.
   * The inertia tensor is computed about the local origin.
   *
   * @param massData Returns the mass data for this shape.
   * @param density The density in kilograms per meter squared.
   */
  computeMass(t, e) {
    t.mass = 0, Tt(t.center, 0.5, this.m_vertex1, 0.5, this.m_vertex2), t.I = 0;
  }
  computeDistanceProxy(t) {
    t.m_vertices[0] = this.m_vertex1, t.m_vertices[1] = this.m_vertex2, t.m_vertices.length = 2, t.m_count = 2, t.m_radius = this.m_radius;
  }
}
const Ye = typeof ASSERT > "u" ? !1 : ASSERT, _l = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, ia = I(0, 0), na = I(0, 0);
class ge extends Js {
  static TYPE = "chain";
  /** @hidden */
  m_type;
  /** @hidden */
  m_radius;
  /** @hidden */
  m_vertices;
  /** @hidden */
  m_count;
  /** @hidden */
  m_prevVertex;
  /** @hidden */
  m_nextVertex;
  /** @hidden */
  m_hasPrevVertex;
  /** @hidden */
  m_hasNextVertex;
  /** @hidden */
  m_isLoop;
  constructor(t, e) {
    if (_l && !(this instanceof ge))
      return new ge(t, e);
    super(), this.m_type = ge.TYPE, this.m_radius = O.polygonRadius, this.m_vertices = [], this.m_count = 0, this.m_prevVertex = null, this.m_nextVertex = null, this.m_hasPrevVertex = !1, this.m_hasNextVertex = !1, this.m_isLoop = !!e, t && t.length && (e ? this._createLoop(t) : this._createChain(t));
  }
  /** @hidden */
  _serialize() {
    const t = {
      type: this.m_type,
      vertices: this.m_isLoop ? this.m_vertices.slice(0, this.m_vertices.length - 1) : this.m_vertices,
      isLoop: this.m_isLoop,
      hasPrevVertex: this.m_hasPrevVertex,
      hasNextVertex: this.m_hasNextVertex,
      prevVertex: null,
      nextVertex: null
    };
    return this.m_prevVertex && (t.prevVertex = this.m_prevVertex), this.m_nextVertex && (t.nextVertex = this.m_nextVertex), t;
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    const i = [];
    if (t.vertices)
      for (let o = 0; o < t.vertices.length; o++)
        i.push(s(p, t.vertices[o]));
    const n = new ge(i, t.isLoop);
    return t.prevVertex && n.setPrevVertex(t.prevVertex), t.nextVertex && n.setNextVertex(t.nextVertex), n;
  }
  // clear() {
  //   this.m_vertices.length = 0;
  //   this.m_count = 0;
  // }
  getType() {
    return this.m_type;
  }
  getRadius() {
    return this.m_radius;
  }
  /**
   * @internal
   * Create a loop. This automatically adjusts connectivity.
   *
   * @param vertices an array of vertices, these are copied
   */
  _createLoop(t) {
    if (Ye && console.assert(this.m_vertices.length == 0 && this.m_count == 0), Ye && console.assert(t.length >= 3), !(t.length < 3)) {
      if (Ye)
        for (let e = 1; e < t.length; ++e) {
          const s = t[e - 1], i = t[e];
          console.assert(p.distanceSquared(s, i) > O.linearSlopSquared);
        }
      this.m_vertices = [], this.m_count = t.length + 1;
      for (let e = 0; e < t.length; ++e)
        this.m_vertices[e] = p.clone(t[e]);
      return this.m_vertices[t.length] = p.clone(t[0]), this.m_prevVertex = this.m_vertices[this.m_count - 2], this.m_nextVertex = this.m_vertices[1], this.m_hasPrevVertex = !0, this.m_hasNextVertex = !0, this;
    }
  }
  /**
   * @internal
   * Create a chain with isolated end vertices.
   *
   * @param vertices an array of vertices, these are copied
   */
  _createChain(t) {
    if (Ye && console.assert(this.m_vertices.length == 0 && this.m_count == 0), Ye && console.assert(t.length >= 2), Ye)
      for (let e = 1; e < t.length; ++e) {
        const s = t[e - 1], i = t[e];
        console.assert(p.distanceSquared(s, i) > O.linearSlopSquared);
      }
    this.m_vertices = [], this.m_count = t.length;
    for (let e = 0; e < t.length; ++e)
      this.m_vertices[e] = p.clone(t[e]);
    return this.m_prevVertex = null, this.m_nextVertex = null, this.m_hasPrevVertex = !1, this.m_hasNextVertex = !1, this;
  }
  /** @hidden */
  _reset() {
    this.m_isLoop ? this._createLoop(this.m_vertices.slice(0, this.m_vertices.length - 1)) : this._createChain(this.m_vertices);
  }
  /**
   * Establish connectivity to a vertex that precedes the first vertex. Don't call
   * this for loops.
   */
  setPrevVertex(t) {
    this.m_prevVertex = t, this.m_hasPrevVertex = !0;
  }
  getPrevVertex() {
    return this.m_prevVertex;
  }
  /**
   * Establish connectivity to a vertex that follows the last vertex. Don't call
   * this for loops.
   */
  setNextVertex(t) {
    this.m_nextVertex = t, this.m_hasNextVertex = !0;
  }
  getNextVertex() {
    return this.m_nextVertex;
  }
  /**
   * @internal @deprecated Shapes should be treated as immutable.
   *
   * clone the concrete shape.
   */
  _clone() {
    const t = new ge();
    return t._createChain(this.m_vertices), t.m_type = this.m_type, t.m_radius = this.m_radius, t.m_prevVertex = this.m_prevVertex, t.m_nextVertex = this.m_nextVertex, t.m_hasPrevVertex = this.m_hasPrevVertex, t.m_hasNextVertex = this.m_hasNextVertex, t;
  }
  /**
   * Get the number of child primitives.
   */
  getChildCount() {
    return this.m_count - 1;
  }
  // Get a child edge.
  getChildEdge(t, e) {
    Ye && console.assert(0 <= e && e < this.m_count - 1), t.m_type = Jt.TYPE, t.m_radius = this.m_radius, t.m_vertex1 = this.m_vertices[e], t.m_vertex2 = this.m_vertices[e + 1], e > 0 ? (t.m_vertex0 = this.m_vertices[e - 1], t.m_hasVertex0 = !0) : (t.m_vertex0 = this.m_prevVertex, t.m_hasVertex0 = this.m_hasPrevVertex), e < this.m_count - 2 ? (t.m_vertex3 = this.m_vertices[e + 2], t.m_hasVertex3 = !0) : (t.m_vertex3 = this.m_nextVertex, t.m_hasVertex3 = this.m_hasNextVertex);
  }
  getVertex(t) {
    return Ye && console.assert(0 <= t && t <= this.m_count), t < this.m_count ? this.m_vertices[t] : this.m_vertices[0];
  }
  isLoop() {
    return this.m_isLoop;
  }
  /**
   * Test a point for containment in this shape. This only works for convex
   * shapes.
   *
   * This always return false.
   *
   * @param xf The shape world transform.
   * @param p A point in world coordinates.
   */
  testPoint(t, e) {
    return !1;
  }
  /**
   * Cast a ray against a child shape.
   *
   * @param output The ray-cast results.
   * @param input The ray-cast input parameters.
   * @param xf The transform to be applied to the shape.
   * @param childIndex The child shape index
   */
  rayCast(t, e, s, i) {
    return Ye && console.assert(0 <= i && i < this.m_count), new Jt(this.getVertex(i), this.getVertex(i + 1)).rayCast(t, e, s, 0);
  }
  /**
   * Given a transform, compute the associated axis aligned bounding box for a
   * child shape.
   *
   * @param aabb Returns the axis aligned box.
   * @param xf The world transform of the shape.
   * @param childIndex The child shape
   */
  computeAABB(t, e, s) {
    Ye && console.assert(0 <= s && s < this.m_count), st(ia, e, this.getVertex(s)), st(na, e, this.getVertex(s + 1)), Ct.combinePoints(t, ia, na);
  }
  /**
   * Compute the mass properties of this shape using its dimensions and density.
   * The inertia tensor is computed about the local origin.
   *
   * Chains have zero mass.
   *
   * @param massData Returns the mass data for this shape.
   * @param density The density in kilograms per meter squared.
   */
  computeMass(t, e) {
    t.mass = 0, K(t.center), t.I = 0;
  }
  computeDistanceProxy(t, e) {
    Ye && console.assert(0 <= e && e < this.m_count), t.m_vertices[0] = this.getVertex(e), t.m_vertices[1] = this.getVertex(e + 1), t.m_count = 2, t.m_radius = this.m_radius;
  }
}
const ps = typeof ASSERT > "u" ? !1 : ASSERT, fl = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, oa = Math.max, Do = Math.min, _i = I(0, 0), ra = I(0, 0), Zi = I(0, 0), Pi = I(0, 0), ri = I(0, 0), Rs = I(0, 0);
class Et extends Js {
  static TYPE = "polygon";
  /** @hidden */
  m_type;
  /** @hidden */
  m_centroid;
  /** @hidden */
  m_vertices;
  // [Settings.maxPolygonVertices]
  /** @hidden */
  m_normals;
  // [Settings.maxPolygonVertices]
  /** @hidden */
  m_count;
  /** @hidden */
  m_radius;
  constructor(t) {
    if (fl && !(this instanceof Et))
      return new Et(t);
    super(), this.m_type = Et.TYPE, this.m_radius = O.polygonRadius, this.m_centroid = p.zero(), this.m_vertices = [], this.m_normals = [], this.m_count = 0, t && t.length && this._set(t);
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      vertices: this.m_vertices
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    const i = [];
    if (t.vertices)
      for (let o = 0; o < t.vertices.length; o++)
        i.push(s(p, t.vertices[o]));
    return new Et(i);
  }
  getType() {
    return this.m_type;
  }
  getRadius() {
    return this.m_radius;
  }
  /**
   * @internal @deprecated Shapes should be treated as immutable.
   *
   * clone the concrete shape.
   */
  _clone() {
    const t = new Et();
    t.m_type = this.m_type, t.m_radius = this.m_radius, t.m_count = this.m_count, t.m_centroid.setVec2(this.m_centroid);
    for (let e = 0; e < this.m_count; e++)
      t.m_vertices.push(this.m_vertices[e].clone());
    for (let e = 0; e < this.m_normals.length; e++)
      t.m_normals.push(this.m_normals[e].clone());
    return t;
  }
  /**
   * Get the number of child primitives.
   */
  getChildCount() {
    return 1;
  }
  /** @hidden */
  _reset() {
    this._set(this.m_vertices);
  }
  /**
   * @internal
   *
   * Create a convex hull from the given array of local points. The count must be
   * in the range [3, Settings.maxPolygonVertices].
   *
   * Warning: the points may be re-ordered, even if they form a convex polygon
   * Warning: collinear points are handled but not removed. Collinear points may
   * lead to poor stacking behavior.
   */
  _set(t) {
    if (ps && console.assert(3 <= t.length && t.length <= O.maxPolygonVertices), t.length < 3) {
      this._setAsBox(1, 1);
      return;
    }
    let e = Do(t.length, O.maxPolygonVertices);
    const s = [];
    for (let c = 0; c < e; ++c) {
      const l = t[c];
      let m = !0;
      for (let h = 0; h < s.length; ++h)
        if (p.distanceSquared(l, s[h]) < 0.25 * O.linearSlopSquared) {
          m = !1;
          break;
        }
      m && s.push(p.clone(l));
    }
    if (e = s.length, e < 3) {
      ps && console.assert(!1), this._setAsBox(1, 1);
      return;
    }
    let i = 0, n = s[0].x;
    for (let c = 1; c < e; ++c) {
      const l = s[c].x;
      (l > n || l === n && s[c].y < s[i].y) && (i = c, n = l);
    }
    const o = [];
    let r = 0, a = i;
    for (; ; ) {
      ps && console.assert(r < O.maxPolygonVertices), o[r] = a;
      let c = 0;
      for (let l = 1; l < e; ++l) {
        if (c === a) {
          c = l;
          continue;
        }
        const m = p.sub(s[c], s[o[r]]), h = p.sub(s[l], s[o[r]]), u = p.crossVec2Vec2(m, h);
        u < 0 && (c = l), u === 0 && h.lengthSquared() > m.lengthSquared() && (c = l);
      }
      if (++r, a = c, c === i)
        break;
    }
    if (r < 3) {
      ps && console.assert(!1), this._setAsBox(1, 1);
      return;
    }
    this.m_count = r, this.m_vertices = [];
    for (let c = 0; c < r; ++c)
      this.m_vertices[c] = s[o[c]];
    for (let c = 0; c < r; ++c) {
      const l = c, m = c + 1 < r ? c + 1 : 0, h = p.sub(this.m_vertices[m], this.m_vertices[l]);
      ps && console.assert(h.lengthSquared() > qt * qt), this.m_normals[c] = p.crossVec2Num(h, 1), this.m_normals[c].normalize();
    }
    this.m_centroid = yl(this.m_vertices, r);
  }
  /** @internal */
  _setAsBox(t, e, s, i) {
    if (this.m_vertices[0] = p.neo(t, -e), this.m_vertices[1] = p.neo(t, e), this.m_vertices[2] = p.neo(-t, e), this.m_vertices[3] = p.neo(-t, -e), this.m_normals[0] = p.neo(1, 0), this.m_normals[1] = p.neo(0, 1), this.m_normals[2] = p.neo(-1, 0), this.m_normals[3] = p.neo(0, -1), this.m_count = 4, s && p.isValid(s)) {
      i = i || 0, S(this.m_centroid, s);
      const n = le.identity();
      n.p.setVec2(s), n.q.setAngle(i);
      for (let o = 0; o < this.m_count; ++o)
        this.m_vertices[o] = le.mulVec2(n, this.m_vertices[o]), this.m_normals[o] = C.mulVec2(n.q, this.m_normals[o]);
    }
  }
  /**
   * Test a point for containment in this shape. This only works for convex
   * shapes.
   *
   * @param xf The shape world transform.
   * @param p A point in world coordinates.
   */
  testPoint(t, e) {
    const s = yr(_i, t, e);
    for (let i = 0; i < this.m_count; ++i)
      if (L(this.m_normals[i], s) - L(this.m_normals[i], this.m_vertices[i]) > 0)
        return !1;
    return !0;
  }
  /**
   * Cast a ray against a child shape.
   *
   * @param output The ray-cast results.
   * @param input The ray-cast input parameters.
   * @param xf The transform to be applied to the shape.
   * @param childIndex The child shape index
   */
  rayCast(t, e, s, i) {
    const n = C.mulTVec2(s.q, p.sub(e.p1, s.p)), o = C.mulTVec2(s.q, p.sub(e.p2, s.p)), r = p.sub(o, n);
    let a = 0, c = e.maxFraction, l = -1;
    for (let m = 0; m < this.m_count; ++m) {
      const h = p.dot(this.m_normals[m], p.sub(this.m_vertices[m], n)), u = p.dot(this.m_normals[m], r);
      if (u == 0) {
        if (h < 0)
          return !1;
      } else
        u < 0 && h < a * u ? (a = h / u, l = m) : u > 0 && h < c * u && (c = h / u);
      if (c < a)
        return !1;
    }
    return ps && console.assert(0 <= a && a <= e.maxFraction), l >= 0 ? (t.fraction = a, t.normal = C.mulVec2(s.q, this.m_normals[l]), !0) : !1;
  }
  /**
   * Given a transform, compute the associated axis aligned bounding box for a
   * child shape.
   *
   * @param aabb Returns the axis aligned box.
   * @param xf The world transform of the shape.
   * @param childIndex The child shape
   */
  computeAABB(t, e, s) {
    let i = 1 / 0, n = 1 / 0, o = -1 / 0, r = -1 / 0;
    for (let a = 0; a < this.m_count; ++a) {
      const c = st(_i, e, this.m_vertices[a]);
      i = Do(i, c.x), o = oa(o, c.x), n = Do(n, c.y), r = oa(r, c.y);
    }
    Zt(t.lowerBound, i - this.m_radius, n - this.m_radius), Zt(t.upperBound, o + this.m_radius, r + this.m_radius);
  }
  /**
   * Compute the mass properties of this shape using its dimensions and density.
   * The inertia tensor is computed about the local origin.
   *
   * @param massData Returns the mass data for this shape.
   * @param density The density in kilograms per meter squared.
   */
  computeMass(t, e) {
    ps && console.assert(this.m_count >= 3), K(ri);
    let s = 0, i = 0;
    K(Rs);
    for (let o = 0; o < this.m_count; ++o)
      Ne(Rs, this.m_vertices[o]);
    Z(Rs, 1 / this.m_count, Rs);
    const n = 1 / 3;
    for (let o = 0; o < this.m_count; ++o) {
      it(Zi, this.m_vertices[o], Rs), o + 1 < this.m_count ? it(Pi, this.m_vertices[o + 1], Rs) : it(Pi, this.m_vertices[0], Rs);
      const r = rt(Zi, Pi), a = 0.5 * r;
      s += a, Tt(_i, a * n, Zi, a * n, Pi), Ne(ri, _i);
      const c = Zi.x, l = Zi.y, m = Pi.x, h = Pi.y, u = c * c + m * c + m * m, d = l * l + h * l + h * h;
      i += 0.25 * n * r * (u + d);
    }
    t.mass = e * s, ps && console.assert(s > qt), Z(ri, 1 / s, ri), kc(t.center, ri, Rs), t.I = e * i, t.I += t.mass * (L(t.center, t.center) - L(ri, ri));
  }
  /**
   * Validate convexity. This is a very time consuming operation.
   * @returns true if valid
   */
  validate() {
    for (let t = 0; t < this.m_count; ++t) {
      const e = t, s = t < this.m_count - 1 ? e + 1 : 0, i = this.m_vertices[e];
      it(ra, this.m_vertices[s], i);
      for (let n = 0; n < this.m_count; ++n) {
        if (n == e || n == s)
          continue;
        if (rt(ra, it(_i, this.m_vertices[n], i)) < 0)
          return !1;
      }
    }
    return !0;
  }
  computeDistanceProxy(t) {
    for (let e = 0; e < this.m_count; ++e)
      t.m_vertices[e] = this.m_vertices[e];
    t.m_vertices.length = this.m_count, t.m_count = this.m_count, t.m_radius = this.m_radius;
  }
}
function yl(_, t) {
  ps && console.assert(t >= 3);
  const e = p.zero();
  let s = 0;
  const i = p.zero(), n = 1 / 3;
  for (let o = 0; o < t; ++o) {
    const r = i, a = _[o], c = o + 1 < t ? _[o + 1] : _[0], l = p.sub(a, r), m = p.sub(c, r), u = 0.5 * p.crossVec2Vec2(l, m);
    s += u, ds(_i, 1, r, 1, a, 1, c), Ze(e, u * n, _i);
  }
  return ps && console.assert(s > qt), e.mul(1 / s), e;
}
const xl = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, gl = Math.sqrt, vl = Math.PI, aa = I(0, 0);
class Wt extends Js {
  static TYPE = "circle";
  /** @hidden */
  m_type;
  /** @hidden */
  m_p;
  /** @hidden */
  m_radius;
  constructor(t, e) {
    if (xl && !(this instanceof Wt))
      return new Wt(t, e);
    super(), this.m_type = Wt.TYPE, this.m_p = p.zero(), this.m_radius = 1, typeof t == "object" && p.isValid(t) ? (this.m_p.setVec2(t), typeof e == "number" && (this.m_radius = e)) : typeof t == "number" && (this.m_radius = t);
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      p: this.m_p,
      radius: this.m_radius
    };
  }
  /** @hidden */
  static _deserialize(t) {
    return new Wt(t.p, t.radius);
  }
  /** @hidden */
  _reset() {
  }
  getType() {
    return this.m_type;
  }
  getRadius() {
    return this.m_radius;
  }
  getCenter() {
    return this.m_p;
  }
  /**
   * @internal @deprecated Shapes should be treated as immutable.
   *
   * clone the concrete shape.
   */
  _clone() {
    const t = new Wt();
    return t.m_type = this.m_type, t.m_radius = this.m_radius, t.m_p = this.m_p.clone(), t;
  }
  /**
   * Get the number of child primitives.
   */
  getChildCount() {
    return 1;
  }
  /**
   * Test a point for containment in this shape. This only works for convex
   * shapes.
   *
   * @param xf The shape world transform.
   * @param p A point in world coordinates.
   */
  testPoint(t, e) {
    const s = st(aa, t, this.m_p);
    return gi(e, s) <= this.m_radius * this.m_radius;
  }
  /**
   * Cast a ray against a child shape.
   *
   * @param output The ray-cast results.
   * @param input The ray-cast input parameters.
   * @param xf The transform to be applied to the shape.
   * @param childIndex The child shape index
   */
  rayCast(t, e, s, i) {
    const n = p.add(s.p, C.mulVec2(s.q, this.m_p)), o = p.sub(e.p1, n), r = p.dot(o, o) - this.m_radius * this.m_radius, a = p.sub(e.p2, e.p1), c = p.dot(o, a), l = p.dot(a, a), m = c * c - l * r;
    if (m < 0 || l < qt)
      return !1;
    let h = -(c + gl(m));
    return 0 <= h && h <= e.maxFraction * l ? (h /= l, t.fraction = h, t.normal = p.add(o, p.mulNumVec2(h, a)), t.normal.normalize(), !0) : !1;
  }
  /**
   * Given a transform, compute the associated axis aligned bounding box for a
   * child shape.
   *
   * @param aabb Returns the axis aligned box.
   * @param xf The world transform of the shape.
   * @param childIndex The child shape
   */
  computeAABB(t, e, s) {
    const i = st(aa, e, this.m_p);
    Zt(t.lowerBound, i.x - this.m_radius, i.y - this.m_radius), Zt(t.upperBound, i.x + this.m_radius, i.y + this.m_radius);
  }
  /**
   * Compute the mass properties of this shape using its dimensions and density.
   * The inertia tensor is computed about the local origin.
   *
   * @param massData Returns the mass data for this shape.
   * @param density The density in kilograms per meter squared.
   */
  computeMass(t, e) {
    t.mass = e * vl * this.m_radius * this.m_radius, S(t.center, this.m_p), t.I = t.mass * (0.5 * this.m_radius * this.m_radius + xi(this.m_p));
  }
  computeDistanceProxy(t) {
    t.m_vertices[0] = this.m_p, t.m_vertices.length = 1, t.m_count = 1, t.m_radius = this.m_radius;
  }
}
const Al = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, bl = Math.abs, Bl = Math.PI, wl = {
  frequencyHz: 0,
  dampingRatio: 0
};
class Os extends te {
  static TYPE = "distance-joint";
  // Solver shared
  /** @internal */
  m_localAnchorA;
  /** @internal */
  m_localAnchorB;
  /** @internal */
  m_length;
  /** @internal */
  m_frequencyHz;
  /** @internal */
  m_dampingRatio;
  /** @internal */
  m_impulse;
  /** @internal */
  m_gamma;
  /** @internal */
  m_bias;
  // Solver temp
  /** @internal */
  m_u;
  /** @internal */
  m_rA;
  /** @internal */
  m_rB;
  /** @internal */
  m_localCenterA;
  /** @internal */
  m_localCenterB;
  /** @internal */
  m_invMassA;
  /** @internal */
  m_invMassB;
  /** @internal */
  m_invIA;
  /** @internal */
  m_invIB;
  /** @internal */
  m_mass;
  constructor(t, e, s, i, n) {
    if (Al && !(this instanceof Os))
      return new Os(t, e, s, i, n);
    if (s && i && "m_type" in i && "x" in s && "y" in s) {
      const o = s;
      s = i, i = o;
    }
    t = Ce(t, wl), super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_type = Os.TYPE, this.m_localAnchorA = p.clone(i ? e.getLocalPoint(i) : t.localAnchorA || p.zero()), this.m_localAnchorB = p.clone(n ? s.getLocalPoint(n) : t.localAnchorB || p.zero()), this.m_length = Number.isFinite(t.length) ? t.length : p.distance(e.getWorldPoint(this.m_localAnchorA), s.getWorldPoint(this.m_localAnchorB)), this.m_frequencyHz = t.frequencyHz, this.m_dampingRatio = t.dampingRatio, this.m_impulse = 0, this.m_gamma = 0, this.m_bias = 0;
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      frequencyHz: this.m_frequencyHz,
      dampingRatio: this.m_dampingRatio,
      localAnchorA: this.m_localAnchorA,
      localAnchorB: this.m_localAnchorB,
      length: this.m_length,
      impulse: this.m_impulse,
      gamma: this.m_gamma,
      bias: this.m_bias
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    return t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), new Os(t);
  }
  /** @hidden */
  _reset(t) {
    t.anchorA ? this.m_localAnchorA.setVec2(this.m_bodyA.getLocalPoint(t.anchorA)) : t.localAnchorA && this.m_localAnchorA.setVec2(t.localAnchorA), t.anchorB ? this.m_localAnchorB.setVec2(this.m_bodyB.getLocalPoint(t.anchorB)) : t.localAnchorB && this.m_localAnchorB.setVec2(t.localAnchorB), t.length > 0 ? this.m_length = +t.length : t.length < 0 || (t.anchorA || t.anchorA || t.anchorA || t.anchorA) && (this.m_length = p.distance(
      this.m_bodyA.getWorldPoint(this.m_localAnchorA),
      this.m_bodyB.getWorldPoint(this.m_localAnchorB)
    )), Number.isFinite(t.frequencyHz) && (this.m_frequencyHz = t.frequencyHz), Number.isFinite(t.dampingRatio) && (this.m_dampingRatio = t.dampingRatio);
  }
  /**
   * The local anchor point relative to bodyA's origin.
   */
  getLocalAnchorA() {
    return this.m_localAnchorA;
  }
  /**
   * The local anchor point relative to bodyB's origin.
   */
  getLocalAnchorB() {
    return this.m_localAnchorB;
  }
  /**
   * Set the natural length. Manipulating the length can lead to non-physical
   * behavior when the frequency is zero.
   */
  setLength(t) {
    this.m_length = t;
  }
  /**
   * Get the natural length.
   */
  getLength() {
    return this.m_length;
  }
  setFrequency(t) {
    this.m_frequencyHz = t;
  }
  getFrequency() {
    return this.m_frequencyHz;
  }
  setDampingRatio(t) {
    this.m_dampingRatio = t;
  }
  getDampingRatio() {
    return this.m_dampingRatio;
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  }
  /**
   * Get the reaction force on bodyB at the joint anchor in Newtons.
   */
  getReactionForce(t) {
    return p.mulNumVec2(this.m_impulse, this.m_u).mul(t);
  }
  /**
   * Get the reaction torque on bodyB in N*m.
   */
  getReactionTorque(t) {
    return 0;
  }
  initVelocityConstraints(t) {
    this.m_localCenterA = this.m_bodyA.m_sweep.localCenter, this.m_localCenterB = this.m_bodyB.m_sweep.localCenter, this.m_invMassA = this.m_bodyA.m_invMass, this.m_invMassB = this.m_bodyB.m_invMass, this.m_invIA = this.m_bodyA.m_invI, this.m_invIB = this.m_bodyB.m_invI;
    const e = this.m_bodyA.c_position.c, s = this.m_bodyA.c_position.a, i = this.m_bodyA.c_velocity.v;
    let n = this.m_bodyA.c_velocity.w;
    const o = this.m_bodyB.c_position.c, r = this.m_bodyB.c_position.a, a = this.m_bodyB.c_velocity.v;
    let c = this.m_bodyB.c_velocity.w;
    const l = C.neo(s), m = C.neo(r);
    this.m_rA = C.mulVec2(l, p.sub(this.m_localAnchorA, this.m_localCenterA)), this.m_rB = C.mulVec2(m, p.sub(this.m_localAnchorB, this.m_localCenterB)), this.m_u = p.sub(p.add(o, this.m_rB), p.add(e, this.m_rA));
    const h = this.m_u.length();
    h > O.linearSlop ? this.m_u.mul(1 / h) : this.m_u.setNum(0, 0);
    const u = p.crossVec2Vec2(this.m_rA, this.m_u), d = p.crossVec2Vec2(this.m_rB, this.m_u);
    let f = this.m_invMassA + this.m_invIA * u * u + this.m_invMassB + this.m_invIB * d * d;
    if (this.m_mass = f != 0 ? 1 / f : 0, this.m_frequencyHz > 0) {
      const y = h - this.m_length, v = 2 * Bl * this.m_frequencyHz, g = 2 * this.m_mass * this.m_dampingRatio * v, A = this.m_mass * v * v, b = t.dt;
      this.m_gamma = b * (g + b * A), this.m_gamma = this.m_gamma != 0 ? 1 / this.m_gamma : 0, this.m_bias = y * b * A * this.m_gamma, f += this.m_gamma, this.m_mass = f != 0 ? 1 / f : 0;
    } else
      this.m_gamma = 0, this.m_bias = 0;
    if (t.warmStarting) {
      this.m_impulse *= t.dtRatio;
      const y = p.mulNumVec2(this.m_impulse, this.m_u);
      i.subMul(this.m_invMassA, y), n -= this.m_invIA * p.crossVec2Vec2(this.m_rA, y), a.addMul(this.m_invMassB, y), c += this.m_invIB * p.crossVec2Vec2(this.m_rB, y);
    } else
      this.m_impulse = 0;
    this.m_bodyA.c_velocity.v.setVec2(i), this.m_bodyA.c_velocity.w = n, this.m_bodyB.c_velocity.v.setVec2(a), this.m_bodyB.c_velocity.w = c;
  }
  solveVelocityConstraints(t) {
    const e = this.m_bodyA.c_velocity.v;
    let s = this.m_bodyA.c_velocity.w;
    const i = this.m_bodyB.c_velocity.v;
    let n = this.m_bodyB.c_velocity.w;
    const o = p.add(e, p.crossNumVec2(s, this.m_rA)), r = p.add(i, p.crossNumVec2(n, this.m_rB)), a = p.dot(this.m_u, r) - p.dot(this.m_u, o), c = -this.m_mass * (a + this.m_bias + this.m_gamma * this.m_impulse);
    this.m_impulse += c;
    const l = p.mulNumVec2(c, this.m_u);
    e.subMul(this.m_invMassA, l), s -= this.m_invIA * p.crossVec2Vec2(this.m_rA, l), i.addMul(this.m_invMassB, l), n += this.m_invIB * p.crossVec2Vec2(this.m_rB, l), this.m_bodyA.c_velocity.v.setVec2(e), this.m_bodyA.c_velocity.w = s, this.m_bodyB.c_velocity.v.setVec2(i), this.m_bodyB.c_velocity.w = n;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    if (this.m_frequencyHz > 0)
      return !0;
    const e = this.m_bodyA.c_position.c;
    let s = this.m_bodyA.c_position.a;
    const i = this.m_bodyB.c_position.c;
    let n = this.m_bodyB.c_position.a;
    const o = C.neo(s), r = C.neo(n), a = C.mulSub(o, this.m_localAnchorA, this.m_localCenterA), c = C.mulSub(r, this.m_localAnchorB, this.m_localCenterB), l = p.sub(p.add(i, c), p.add(e, a)), m = l.normalize(), h = Qt(m - this.m_length, -O.maxLinearCorrection, O.maxLinearCorrection), u = -this.m_mass * h, d = p.mulNumVec2(u, l);
    return e.subMul(this.m_invMassA, d), s -= this.m_invIA * p.crossVec2Vec2(a, d), i.addMul(this.m_invMassB, d), n += this.m_invIB * p.crossVec2Vec2(c, d), this.m_bodyA.c_position.c.setVec2(e), this.m_bodyA.c_position.a = s, this.m_bodyB.c_position.c.setVec2(i), this.m_bodyB.c_position.a = n, bl(h) < O.linearSlop;
  }
}
const ca = typeof ASSERT > "u" ? !1 : ASSERT, Sl = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, Cl = {
  maxForce: 0,
  maxTorque: 0
};
class js extends te {
  static TYPE = "friction-joint";
  /** @internal */
  m_type;
  /** @internal */
  m_localAnchorA;
  /** @internal */
  m_localAnchorB;
  // Solver shared
  /** @internal */
  m_linearImpulse;
  /** @internal */
  m_angularImpulse;
  /** @internal */
  m_maxForce;
  /** @internal */
  m_maxTorque;
  // Solver temp
  /** @internal */
  m_rA;
  /** @internal */
  m_rB;
  /** @internal */
  m_localCenterA;
  /** @internal */
  m_localCenterB;
  /** @internal */
  m_invMassA;
  /** @internal */
  m_invMassB;
  /** @internal */
  m_invIA;
  /** @internal */
  m_invIB;
  /** @internal */
  m_linearMass;
  /** @internal */
  m_angularMass;
  constructor(t, e, s, i) {
    if (Sl && !(this instanceof js))
      return new js(t, e, s, i);
    t = Ce(t, Cl), super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_type = js.TYPE, this.m_localAnchorA = p.clone(i ? e.getLocalPoint(i) : t.localAnchorA || p.zero()), this.m_localAnchorB = p.clone(i ? s.getLocalPoint(i) : t.localAnchorB || p.zero()), this.m_linearImpulse = p.zero(), this.m_angularImpulse = 0, this.m_maxForce = t.maxForce, this.m_maxTorque = t.maxTorque;
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      maxForce: this.m_maxForce,
      maxTorque: this.m_maxTorque,
      localAnchorA: this.m_localAnchorA,
      localAnchorB: this.m_localAnchorB
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    return t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), new js(t);
  }
  /** @hidden */
  _reset(t) {
    t.anchorA ? this.m_localAnchorA.setVec2(this.m_bodyA.getLocalPoint(t.anchorA)) : t.localAnchorA && this.m_localAnchorA.setVec2(t.localAnchorA), t.anchorB ? this.m_localAnchorB.setVec2(this.m_bodyB.getLocalPoint(t.anchorB)) : t.localAnchorB && this.m_localAnchorB.setVec2(t.localAnchorB), Number.isFinite(t.maxForce) && (this.m_maxForce = t.maxForce), Number.isFinite(t.maxTorque) && (this.m_maxTorque = t.maxTorque);
  }
  /**
   * The local anchor point relative to bodyA's origin.
   */
  getLocalAnchorA() {
    return this.m_localAnchorA;
  }
  /**
   * The local anchor point relative to bodyB's origin.
   */
  getLocalAnchorB() {
    return this.m_localAnchorB;
  }
  /**
   * Set the maximum friction force in N.
   */
  setMaxForce(t) {
    ca && console.assert(Number.isFinite(t) && t >= 0), this.m_maxForce = t;
  }
  /**
   * Get the maximum friction force in N.
   */
  getMaxForce() {
    return this.m_maxForce;
  }
  /**
   * Set the maximum friction torque in N*m.
   */
  setMaxTorque(t) {
    ca && console.assert(Number.isFinite(t) && t >= 0), this.m_maxTorque = t;
  }
  /**
   * Get the maximum friction torque in N*m.
   */
  getMaxTorque() {
    return this.m_maxTorque;
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  }
  /**
   * Get the reaction force on bodyB at the joint anchor in Newtons.
   */
  getReactionForce(t) {
    return p.mulNumVec2(t, this.m_linearImpulse);
  }
  /**
   * Get the reaction torque on bodyB in N*m.
   */
  getReactionTorque(t) {
    return t * this.m_angularImpulse;
  }
  initVelocityConstraints(t) {
    this.m_localCenterA = this.m_bodyA.m_sweep.localCenter, this.m_localCenterB = this.m_bodyB.m_sweep.localCenter, this.m_invMassA = this.m_bodyA.m_invMass, this.m_invMassB = this.m_bodyB.m_invMass, this.m_invIA = this.m_bodyA.m_invI, this.m_invIB = this.m_bodyB.m_invI;
    const e = this.m_bodyA.c_position.a, s = this.m_bodyA.c_velocity.v;
    let i = this.m_bodyA.c_velocity.w;
    const n = this.m_bodyB.c_position.a, o = this.m_bodyB.c_velocity.v;
    let r = this.m_bodyB.c_velocity.w;
    const a = C.neo(e), c = C.neo(n);
    this.m_rA = C.mulVec2(a, p.sub(this.m_localAnchorA, this.m_localCenterA)), this.m_rB = C.mulVec2(c, p.sub(this.m_localAnchorB, this.m_localCenterB));
    const l = this.m_invMassA, m = this.m_invMassB, h = this.m_invIA, u = this.m_invIB, d = new pt();
    if (d.ex.x = l + m + h * this.m_rA.y * this.m_rA.y + u * this.m_rB.y * this.m_rB.y, d.ex.y = -h * this.m_rA.x * this.m_rA.y - u * this.m_rB.x * this.m_rB.y, d.ey.x = d.ex.y, d.ey.y = l + m + h * this.m_rA.x * this.m_rA.x + u * this.m_rB.x * this.m_rB.x, this.m_linearMass = d.getInverse(), this.m_angularMass = h + u, this.m_angularMass > 0 && (this.m_angularMass = 1 / this.m_angularMass), t.warmStarting) {
      this.m_linearImpulse.mul(t.dtRatio), this.m_angularImpulse *= t.dtRatio;
      const f = p.neo(this.m_linearImpulse.x, this.m_linearImpulse.y);
      s.subMul(l, f), i -= h * (p.crossVec2Vec2(this.m_rA, f) + this.m_angularImpulse), o.addMul(m, f), r += u * (p.crossVec2Vec2(this.m_rB, f) + this.m_angularImpulse);
    } else
      this.m_linearImpulse.setZero(), this.m_angularImpulse = 0;
    this.m_bodyA.c_velocity.v = s, this.m_bodyA.c_velocity.w = i, this.m_bodyB.c_velocity.v = o, this.m_bodyB.c_velocity.w = r;
  }
  solveVelocityConstraints(t) {
    const e = this.m_bodyA.c_velocity.v;
    let s = this.m_bodyA.c_velocity.w;
    const i = this.m_bodyB.c_velocity.v;
    let n = this.m_bodyB.c_velocity.w;
    const o = this.m_invMassA, r = this.m_invMassB, a = this.m_invIA, c = this.m_invIB, l = t.dt;
    {
      const m = n - s;
      let h = -this.m_angularMass * m;
      const u = this.m_angularImpulse, d = l * this.m_maxTorque;
      this.m_angularImpulse = Qt(this.m_angularImpulse + h, -d, d), h = this.m_angularImpulse - u, s -= a * h, n += c * h;
    }
    {
      const m = p.sub(
        p.add(i, p.crossNumVec2(n, this.m_rB)),
        p.add(e, p.crossNumVec2(s, this.m_rA))
      );
      let h = p.neg(pt.mulVec2(this.m_linearMass, m));
      const u = this.m_linearImpulse;
      this.m_linearImpulse.add(h);
      const d = l * this.m_maxForce;
      this.m_linearImpulse.lengthSquared() > d * d && (this.m_linearImpulse.normalize(), this.m_linearImpulse.mul(d)), h = p.sub(this.m_linearImpulse, u), e.subMul(o, h), s -= a * p.crossVec2Vec2(this.m_rA, h), i.addMul(r, h), n += c * p.crossVec2Vec2(this.m_rB, h);
    }
    this.m_bodyA.c_velocity.v = e, this.m_bodyA.c_velocity.w = s, this.m_bodyB.c_velocity.v = i, this.m_bodyB.c_velocity.w = n;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    return !0;
  }
}
const $e = typeof ASSERT > "u" ? !1 : ASSERT;
class re {
  ex;
  ey;
  ez;
  constructor(t, e, s) {
    typeof t == "object" && t !== null ? (this.ex = ht.clone(t), this.ey = ht.clone(e), this.ez = ht.clone(s)) : (this.ex = ht.zero(), this.ey = ht.zero(), this.ez = ht.zero());
  }
  /** @hidden */
  toString() {
    return JSON.stringify(this);
  }
  static isValid(t) {
    return t === null || typeof t > "u" ? !1 : ht.isValid(t.ex) && ht.isValid(t.ey) && ht.isValid(t.ez);
  }
  static assert(t) {
    $e && console.assert(!re.isValid(t), "Invalid Mat33!", t);
  }
  /**
   * Set this matrix to all zeros.
   */
  setZero() {
    return this.ex.setZero(), this.ey.setZero(), this.ez.setZero(), this;
  }
  /**
   * Solve A * x = b, where b is a column vector. This is more efficient than
   * computing the inverse in one-shot cases.
   */
  solve33(t) {
    let e = this.ey.y * this.ez.z - this.ey.z * this.ez.y, s = this.ey.z * this.ez.x - this.ey.x * this.ez.z, i = this.ey.x * this.ez.y - this.ey.y * this.ez.x, n = this.ex.x * e + this.ex.y * s + this.ex.z * i;
    n !== 0 && (n = 1 / n);
    const o = new ht();
    return e = this.ey.y * this.ez.z - this.ey.z * this.ez.y, s = this.ey.z * this.ez.x - this.ey.x * this.ez.z, i = this.ey.x * this.ez.y - this.ey.y * this.ez.x, o.x = n * (t.x * e + t.y * s + t.z * i), e = t.y * this.ez.z - t.z * this.ez.y, s = t.z * this.ez.x - t.x * this.ez.z, i = t.x * this.ez.y - t.y * this.ez.x, o.y = n * (this.ex.x * e + this.ex.y * s + this.ex.z * i), e = this.ey.y * t.z - this.ey.z * t.y, s = this.ey.z * t.x - this.ey.x * t.z, i = this.ey.x * t.y - this.ey.y * t.x, o.z = n * (this.ex.x * e + this.ex.y * s + this.ex.z * i), o;
  }
  /**
   * Solve A * x = b, where b is a column vector. This is more efficient than
   * computing the inverse in one-shot cases. Solve only the upper 2-by-2 matrix
   * equation.
   */
  solve22(t) {
    const e = this.ex.x, s = this.ey.x, i = this.ex.y, n = this.ey.y;
    let o = e * n - s * i;
    o !== 0 && (o = 1 / o);
    const r = p.zero();
    return r.x = o * (n * t.x - s * t.y), r.y = o * (e * t.y - i * t.x), r;
  }
  /**
   * Get the inverse of this matrix as a 2-by-2. Returns the zero matrix if
   * singular.
   */
  getInverse22(t) {
    const e = this.ex.x, s = this.ey.x, i = this.ex.y, n = this.ey.y;
    let o = e * n - s * i;
    o !== 0 && (o = 1 / o), t.ex.x = o * n, t.ey.x = -o * s, t.ex.z = 0, t.ex.y = -o * i, t.ey.y = o * e, t.ey.z = 0, t.ez.x = 0, t.ez.y = 0, t.ez.z = 0;
  }
  /**
   * Get the symmetric inverse of this matrix as a 3-by-3. Returns the zero matrix
   * if singular.
   */
  getSymInverse33(t) {
    let e = ht.dot(this.ex, ht.cross(this.ey, this.ez));
    e !== 0 && (e = 1 / e);
    const s = this.ex.x, i = this.ey.x, n = this.ez.x, o = this.ey.y, r = this.ez.y, a = this.ez.z;
    t.ex.x = e * (o * a - r * r), t.ex.y = e * (n * r - i * a), t.ex.z = e * (i * r - n * o), t.ey.x = t.ex.y, t.ey.y = e * (s * a - n * n), t.ey.z = e * (n * i - s * r), t.ez.x = t.ex.z, t.ez.y = t.ey.z, t.ez.z = e * (s * o - i * i);
  }
  static mul(t, e) {
    if ($e && re.assert(t), e && "z" in e && "y" in e && "x" in e) {
      $e && ht.assert(e);
      const s = t.ex.x * e.x + t.ey.x * e.y + t.ez.x * e.z, i = t.ex.y * e.x + t.ey.y * e.y + t.ez.y * e.z, n = t.ex.z * e.x + t.ey.z * e.y + t.ez.z * e.z;
      return new ht(s, i, n);
    } else if (e && "y" in e && "x" in e) {
      $e && p.assert(e);
      const s = t.ex.x * e.x + t.ey.x * e.y, i = t.ex.y * e.x + t.ey.y * e.y;
      return p.neo(s, i);
    }
    $e && console.assert(!1);
  }
  static mulVec3(t, e) {
    $e && re.assert(t), $e && ht.assert(e);
    const s = t.ex.x * e.x + t.ey.x * e.y + t.ez.x * e.z, i = t.ex.y * e.x + t.ey.y * e.y + t.ez.y * e.z, n = t.ex.z * e.x + t.ey.z * e.y + t.ez.z * e.z;
    return new ht(s, i, n);
  }
  static mulVec2(t, e) {
    $e && re.assert(t), $e && p.assert(e);
    const s = t.ex.x * e.x + t.ey.x * e.y, i = t.ex.y * e.x + t.ey.y * e.y;
    return p.neo(s, i);
  }
  static add(t, e) {
    return $e && re.assert(t), $e && re.assert(e), new re(ht.add(t.ex, e.ex), ht.add(t.ey, e.ey), ht.add(t.ez, e.ez));
  }
}
const Tl = typeof ASSERT > "u" ? !1 : ASSERT, Ml = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, la = Math.abs, Vi = {
  lowerAngle: 0,
  upperAngle: 0,
  maxMotorTorque: 0,
  motorSpeed: 0,
  enableLimit: !1,
  enableMotor: !1
};
class ce extends te {
  static TYPE = "revolute-joint";
  /** @internal */
  m_type;
  /** @internal */
  m_localAnchorA;
  /** @internal */
  m_localAnchorB;
  /** @internal */
  m_referenceAngle;
  /** @internal */
  m_impulse;
  /** @internal */
  m_motorImpulse;
  /** @internal */
  m_lowerAngle;
  /** @internal */
  m_upperAngle;
  /** @internal */
  m_maxMotorTorque;
  /** @internal */
  m_motorSpeed;
  /** @internal */
  m_enableLimit;
  /** @internal */
  m_enableMotor;
  // Solver temp
  /** @internal */
  m_rA;
  /** @internal */
  m_rB;
  /** @internal */
  m_localCenterA;
  /** @internal */
  m_localCenterB;
  /** @internal */
  m_invMassA;
  /** @internal */
  m_invMassB;
  /** @internal */
  m_invIA;
  /** @internal */
  m_invIB;
  // effective mass for point-to-point constraint.
  /** @internal */
  m_mass;
  // effective mass for motor/limit angular constraint.
  /** @internal */
  m_motorMass;
  /** @internal */
  m_limitState;
  constructor(t, e, s, i) {
    if (Ml && !(this instanceof ce))
      return new ce(t, e, s, i);
    t = t ?? {}, super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_mass = new re(), this.m_limitState = 0, this.m_type = ce.TYPE, p.isValid(i) ? this.m_localAnchorA = e.getLocalPoint(i) : p.isValid(t.localAnchorA) ? this.m_localAnchorA = p.clone(t.localAnchorA) : this.m_localAnchorA = p.zero(), p.isValid(i) ? this.m_localAnchorB = s.getLocalPoint(i) : p.isValid(t.localAnchorB) ? this.m_localAnchorB = p.clone(t.localAnchorB) : this.m_localAnchorB = p.zero(), Number.isFinite(t.referenceAngle) ? this.m_referenceAngle = t.referenceAngle : this.m_referenceAngle = s.getAngle() - e.getAngle(), this.m_impulse = new ht(), this.m_motorImpulse = 0, this.m_lowerAngle = t.lowerAngle ?? Vi.lowerAngle, this.m_upperAngle = t.upperAngle ?? Vi.upperAngle, this.m_maxMotorTorque = t.maxMotorTorque ?? Vi.maxMotorTorque, this.m_motorSpeed = t.motorSpeed ?? Vi.motorSpeed, this.m_enableLimit = t.enableLimit ?? Vi.enableLimit, this.m_enableMotor = t.enableMotor ?? Vi.enableMotor;
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      lowerAngle: this.m_lowerAngle,
      upperAngle: this.m_upperAngle,
      maxMotorTorque: this.m_maxMotorTorque,
      motorSpeed: this.m_motorSpeed,
      enableLimit: this.m_enableLimit,
      enableMotor: this.m_enableMotor,
      localAnchorA: this.m_localAnchorA,
      localAnchorB: this.m_localAnchorB,
      referenceAngle: this.m_referenceAngle
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    return t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), new ce(t);
  }
  /** @hidden */
  _reset(t) {
    t.anchorA ? this.m_localAnchorA.setVec2(this.m_bodyA.getLocalPoint(t.anchorA)) : t.localAnchorA && this.m_localAnchorA.setVec2(t.localAnchorA), t.anchorB ? this.m_localAnchorB.setVec2(this.m_bodyB.getLocalPoint(t.anchorB)) : t.localAnchorB && this.m_localAnchorB.setVec2(t.localAnchorB), Number.isFinite(t.referenceAngle) && (this.m_referenceAngle = t.referenceAngle), t.enableLimit !== void 0 && (this.m_enableLimit = t.enableLimit), Number.isFinite(t.lowerAngle) && (this.m_lowerAngle = t.lowerAngle), Number.isFinite(t.upperAngle) && (this.m_upperAngle = t.upperAngle), Number.isFinite(t.maxMotorTorque) && (this.m_maxMotorTorque = t.maxMotorTorque), Number.isFinite(t.motorSpeed) && (this.m_motorSpeed = t.motorSpeed), t.enableMotor !== void 0 && (this.m_enableMotor = t.enableMotor);
  }
  /**
   * The local anchor point relative to bodyA's origin.
   */
  getLocalAnchorA() {
    return this.m_localAnchorA;
  }
  /**
   * The local anchor point relative to bodyB's origin.
   */
  getLocalAnchorB() {
    return this.m_localAnchorB;
  }
  /**
   * Get the reference angle.
   */
  getReferenceAngle() {
    return this.m_referenceAngle;
  }
  /**
   * Get the current joint angle in radians.
   */
  getJointAngle() {
    const t = this.m_bodyA;
    return this.m_bodyB.m_sweep.a - t.m_sweep.a - this.m_referenceAngle;
  }
  /**
   * Get the current joint angle speed in radians per second.
   */
  getJointSpeed() {
    const t = this.m_bodyA;
    return this.m_bodyB.m_angularVelocity - t.m_angularVelocity;
  }
  /**
   * Is the joint motor enabled?
   */
  isMotorEnabled() {
    return this.m_enableMotor;
  }
  /**
   * Enable/disable the joint motor.
   */
  enableMotor(t) {
    t != this.m_enableMotor && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_enableMotor = t);
  }
  /**
   * Get the current motor torque given the inverse time step. Unit is N*m.
   */
  getMotorTorque(t) {
    return t * this.m_motorImpulse;
  }
  /**
   * Set the motor speed in radians per second.
   */
  setMotorSpeed(t) {
    t != this.m_motorSpeed && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_motorSpeed = t);
  }
  /**
   * Get the motor speed in radians per second.
   */
  getMotorSpeed() {
    return this.m_motorSpeed;
  }
  /**
   * Set the maximum motor torque, usually in N-m.
   */
  setMaxMotorTorque(t) {
    t != this.m_maxMotorTorque && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_maxMotorTorque = t);
  }
  getMaxMotorTorque() {
    return this.m_maxMotorTorque;
  }
  /**
   * Is the joint limit enabled?
   */
  isLimitEnabled() {
    return this.m_enableLimit;
  }
  /**
   * Enable/disable the joint limit.
   */
  enableLimit(t) {
    t != this.m_enableLimit && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_enableLimit = t, this.m_impulse.z = 0);
  }
  /**
   * Get the lower joint limit in radians.
   */
  getLowerLimit() {
    return this.m_lowerAngle;
  }
  /**
   * Get the upper joint limit in radians.
   */
  getUpperLimit() {
    return this.m_upperAngle;
  }
  /**
   * Set the joint limits in radians.
   */
  setLimits(t, e) {
    Tl && console.assert(t <= e), (t != this.m_lowerAngle || e != this.m_upperAngle) && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_impulse.z = 0, this.m_lowerAngle = t, this.m_upperAngle = e);
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  }
  /**
   * Get the reaction force given the inverse time step. Unit is N.
   */
  getReactionForce(t) {
    return p.neo(this.m_impulse.x, this.m_impulse.y).mul(t);
  }
  /**
   * Get the reaction torque due to the joint limit given the inverse time step.
   * Unit is N*m.
   */
  getReactionTorque(t) {
    return t * this.m_impulse.z;
  }
  initVelocityConstraints(t) {
    this.m_localCenterA = this.m_bodyA.m_sweep.localCenter, this.m_localCenterB = this.m_bodyB.m_sweep.localCenter, this.m_invMassA = this.m_bodyA.m_invMass, this.m_invMassB = this.m_bodyB.m_invMass, this.m_invIA = this.m_bodyA.m_invI, this.m_invIB = this.m_bodyB.m_invI;
    const e = this.m_bodyA.c_position.a, s = this.m_bodyA.c_velocity.v;
    let i = this.m_bodyA.c_velocity.w;
    const n = this.m_bodyB.c_position.a, o = this.m_bodyB.c_velocity.v;
    let r = this.m_bodyB.c_velocity.w;
    const a = C.neo(e), c = C.neo(n);
    this.m_rA = C.mulVec2(a, p.sub(this.m_localAnchorA, this.m_localCenterA)), this.m_rB = C.mulVec2(c, p.sub(this.m_localAnchorB, this.m_localCenterB));
    const l = this.m_invMassA, m = this.m_invMassB, h = this.m_invIA, u = this.m_invIB, d = h + u === 0;
    if (this.m_mass.ex.x = l + m + this.m_rA.y * this.m_rA.y * h + this.m_rB.y * this.m_rB.y * u, this.m_mass.ey.x = -this.m_rA.y * this.m_rA.x * h - this.m_rB.y * this.m_rB.x * u, this.m_mass.ez.x = -this.m_rA.y * h - this.m_rB.y * u, this.m_mass.ex.y = this.m_mass.ey.x, this.m_mass.ey.y = l + m + this.m_rA.x * this.m_rA.x * h + this.m_rB.x * this.m_rB.x * u, this.m_mass.ez.y = this.m_rA.x * h + this.m_rB.x * u, this.m_mass.ex.z = this.m_mass.ez.x, this.m_mass.ey.z = this.m_mass.ez.y, this.m_mass.ez.z = h + u, this.m_motorMass = h + u, this.m_motorMass > 0 && (this.m_motorMass = 1 / this.m_motorMass), (this.m_enableMotor == !1 || d) && (this.m_motorImpulse = 0), this.m_enableLimit && d == !1) {
      const f = n - e - this.m_referenceAngle;
      la(this.m_upperAngle - this.m_lowerAngle) < 2 * O.angularSlop ? this.m_limitState = 3 : f <= this.m_lowerAngle ? (this.m_limitState != 1 && (this.m_impulse.z = 0), this.m_limitState = 1) : f >= this.m_upperAngle ? (this.m_limitState != 2 && (this.m_impulse.z = 0), this.m_limitState = 2) : (this.m_limitState = 0, this.m_impulse.z = 0);
    } else
      this.m_limitState = 0;
    if (t.warmStarting) {
      this.m_impulse.mul(t.dtRatio), this.m_motorImpulse *= t.dtRatio;
      const f = p.neo(this.m_impulse.x, this.m_impulse.y);
      s.subMul(l, f), i -= h * (p.crossVec2Vec2(this.m_rA, f) + this.m_motorImpulse + this.m_impulse.z), o.addMul(m, f), r += u * (p.crossVec2Vec2(this.m_rB, f) + this.m_motorImpulse + this.m_impulse.z);
    } else
      this.m_impulse.setZero(), this.m_motorImpulse = 0;
    this.m_bodyA.c_velocity.v = s, this.m_bodyA.c_velocity.w = i, this.m_bodyB.c_velocity.v = o, this.m_bodyB.c_velocity.w = r;
  }
  solveVelocityConstraints(t) {
    const e = this.m_bodyA.c_velocity.v;
    let s = this.m_bodyA.c_velocity.w;
    const i = this.m_bodyB.c_velocity.v;
    let n = this.m_bodyB.c_velocity.w;
    const o = this.m_invMassA, r = this.m_invMassB, a = this.m_invIA, c = this.m_invIB, l = a + c === 0;
    if (this.m_enableMotor && this.m_limitState != 3 && l == !1) {
      const m = n - s - this.m_motorSpeed;
      let h = -this.m_motorMass * m;
      const u = this.m_motorImpulse, d = t.dt * this.m_maxMotorTorque;
      this.m_motorImpulse = Qt(this.m_motorImpulse + h, -d, d), h = this.m_motorImpulse - u, s -= a * h, n += c * h;
    }
    if (this.m_enableLimit && this.m_limitState != 0 && l == !1) {
      const m = p.zero();
      m.addCombine(1, i, 1, p.crossNumVec2(n, this.m_rB)), m.subCombine(1, e, 1, p.crossNumVec2(s, this.m_rA));
      const h = n - s, u = new ht(m.x, m.y, h), d = ht.neg(this.m_mass.solve33(u));
      if (this.m_limitState == 3)
        this.m_impulse.add(d);
      else if (this.m_limitState == 1)
        if (this.m_impulse.z + d.z < 0) {
          const v = p.combine(-1, m, this.m_impulse.z, p.neo(this.m_mass.ez.x, this.m_mass.ez.y)), g = this.m_mass.solve22(v);
          d.x = g.x, d.y = g.y, d.z = -this.m_impulse.z, this.m_impulse.x += g.x, this.m_impulse.y += g.y, this.m_impulse.z = 0;
        } else
          this.m_impulse.add(d);
      else if (this.m_limitState == 2)
        if (this.m_impulse.z + d.z > 0) {
          const v = p.combine(-1, m, this.m_impulse.z, p.neo(this.m_mass.ez.x, this.m_mass.ez.y)), g = this.m_mass.solve22(v);
          d.x = g.x, d.y = g.y, d.z = -this.m_impulse.z, this.m_impulse.x += g.x, this.m_impulse.y += g.y, this.m_impulse.z = 0;
        } else
          this.m_impulse.add(d);
      const f = p.neo(d.x, d.y);
      e.subMul(o, f), s -= a * (p.crossVec2Vec2(this.m_rA, f) + d.z), i.addMul(r, f), n += c * (p.crossVec2Vec2(this.m_rB, f) + d.z);
    } else {
      const m = p.zero();
      m.addCombine(1, i, 1, p.crossNumVec2(n, this.m_rB)), m.subCombine(1, e, 1, p.crossNumVec2(s, this.m_rA));
      const h = this.m_mass.solve22(p.neg(m));
      this.m_impulse.x += h.x, this.m_impulse.y += h.y, e.subMul(o, h), s -= a * p.crossVec2Vec2(this.m_rA, h), i.addMul(r, h), n += c * p.crossVec2Vec2(this.m_rB, h);
    }
    this.m_bodyA.c_velocity.v = e, this.m_bodyA.c_velocity.w = s, this.m_bodyB.c_velocity.v = i, this.m_bodyB.c_velocity.w = n;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    const e = this.m_bodyA.c_position.c;
    let s = this.m_bodyA.c_position.a;
    const i = this.m_bodyB.c_position.c;
    let n = this.m_bodyB.c_position.a;
    const o = C.neo(s), r = C.neo(n);
    let a = 0, c = 0;
    const l = this.m_invIA + this.m_invIB == 0;
    if (this.m_enableLimit && this.m_limitState != 0 && l == !1) {
      const m = n - s - this.m_referenceAngle;
      let h = 0;
      if (this.m_limitState == 3) {
        const u = Qt(m - this.m_lowerAngle, -O.maxAngularCorrection, O.maxAngularCorrection);
        h = -this.m_motorMass * u, a = la(u);
      } else if (this.m_limitState == 1) {
        let u = m - this.m_lowerAngle;
        a = -u, u = Qt(u + O.angularSlop, -O.maxAngularCorrection, 0), h = -this.m_motorMass * u;
      } else if (this.m_limitState == 2) {
        let u = m - this.m_upperAngle;
        a = u, u = Qt(u - O.angularSlop, 0, O.maxAngularCorrection), h = -this.m_motorMass * u;
      }
      s -= this.m_invIA * h, n += this.m_invIB * h;
    }
    {
      o.setAngle(s), r.setAngle(n);
      const m = C.mulVec2(o, p.sub(this.m_localAnchorA, this.m_localCenterA)), h = C.mulVec2(r, p.sub(this.m_localAnchorB, this.m_localCenterB)), u = p.zero();
      u.addCombine(1, i, 1, h), u.subCombine(1, e, 1, m), c = u.length();
      const d = this.m_invMassA, f = this.m_invMassB, y = this.m_invIA, v = this.m_invIB, g = new pt();
      g.ex.x = d + f + y * m.y * m.y + v * h.y * h.y, g.ex.y = -y * m.x * m.y - v * h.x * h.y, g.ey.x = g.ex.y, g.ey.y = d + f + y * m.x * m.x + v * h.x * h.x;
      const A = p.neg(g.solve(u));
      e.subMul(d, A), s -= y * p.crossVec2Vec2(m, A), i.addMul(f, A), n += v * p.crossVec2Vec2(h, A);
    }
    return this.m_bodyA.c_position.c.setVec2(e), this.m_bodyA.c_position.a = s, this.m_bodyB.c_position.c.setVec2(i), this.m_bodyB.c_position.a = n, c <= O.linearSlop && a <= O.angularSlop;
  }
}
const Il = typeof ASSERT > "u" ? !1 : ASSERT, Pl = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, Ji = Math.abs, ha = Math.max, Vl = Math.min, zl = {
  enableLimit: !1,
  lowerTranslation: 0,
  upperTranslation: 0,
  enableMotor: !1,
  maxMotorForce: 0,
  motorSpeed: 0
};
class fs extends te {
  static TYPE = "prismatic-joint";
  /** @internal */
  m_type;
  /** @internal */
  m_localAnchorA;
  /** @internal */
  m_localAnchorB;
  /** @internal */
  m_localXAxisA;
  /** @internal */
  m_localYAxisA;
  /** @internal */
  m_referenceAngle;
  /** @internal */
  m_impulse;
  /** @internal */
  m_motorMass;
  /** @internal */
  m_motorImpulse;
  /** @internal */
  m_lowerTranslation;
  /** @internal */
  m_upperTranslation;
  /** @internal */
  m_maxMotorForce;
  /** @internal */
  m_motorSpeed;
  /** @internal */
  m_enableLimit;
  /** @internal */
  m_enableMotor;
  /** @internal */
  m_limitState;
  // TODO enum
  /** @internal */
  m_axis;
  /** @internal */
  m_perp;
  // Solver temp
  /** @internal */
  m_localCenterA;
  /** @internal */
  m_localCenterB;
  /** @internal */
  m_invMassA;
  /** @internal */
  m_invMassB;
  /** @internal */
  m_invIA;
  /** @internal */
  m_invIB;
  /** @internal */
  m_s1;
  /** @internal */
  m_s2;
  /** @internal */
  m_a1;
  /** @internal */
  m_a2;
  /** @internal */
  m_K;
  constructor(t, e, s, i, n) {
    if (Pl && !(this instanceof fs))
      return new fs(t, e, s, i, n);
    t = Ce(t, zl), super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_type = fs.TYPE, this.m_localAnchorA = p.clone(i ? e.getLocalPoint(i) : t.localAnchorA || p.zero()), this.m_localAnchorB = p.clone(i ? s.getLocalPoint(i) : t.localAnchorB || p.zero()), this.m_localXAxisA = p.clone(n ? e.getLocalVector(n) : t.localAxisA || p.neo(1, 0)), this.m_localXAxisA.normalize(), this.m_localYAxisA = p.crossNumVec2(1, this.m_localXAxisA), this.m_referenceAngle = Number.isFinite(t.referenceAngle) ? t.referenceAngle : s.getAngle() - e.getAngle(), this.m_impulse = new ht(), this.m_motorMass = 0, this.m_motorImpulse = 0, this.m_lowerTranslation = t.lowerTranslation, this.m_upperTranslation = t.upperTranslation, this.m_maxMotorForce = t.maxMotorForce, this.m_motorSpeed = t.motorSpeed, this.m_enableLimit = t.enableLimit, this.m_enableMotor = t.enableMotor, this.m_limitState = 0, this.m_axis = p.zero(), this.m_perp = p.zero(), this.m_K = new re();
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      lowerTranslation: this.m_lowerTranslation,
      upperTranslation: this.m_upperTranslation,
      maxMotorForce: this.m_maxMotorForce,
      motorSpeed: this.m_motorSpeed,
      enableLimit: this.m_enableLimit,
      enableMotor: this.m_enableMotor,
      localAnchorA: this.m_localAnchorA,
      localAnchorB: this.m_localAnchorB,
      localAxisA: this.m_localXAxisA,
      referenceAngle: this.m_referenceAngle
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    return t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), t.localAxisA = p.clone(t.localAxisA), new fs(t);
  }
  /** @hidden */
  _reset(t) {
    t.anchorA ? this.m_localAnchorA.setVec2(this.m_bodyA.getLocalPoint(t.anchorA)) : t.localAnchorA && this.m_localAnchorA.setVec2(t.localAnchorA), t.anchorB ? this.m_localAnchorB.setVec2(this.m_bodyB.getLocalPoint(t.anchorB)) : t.localAnchorB && this.m_localAnchorB.setVec2(t.localAnchorB), t.localAxisA && (this.m_localXAxisA.setVec2(t.localAxisA), this.m_localYAxisA.setVec2(p.crossNumVec2(1, t.localAxisA))), Number.isFinite(t.referenceAngle) && (this.m_referenceAngle = t.referenceAngle), typeof t.enableLimit < "u" && (this.m_enableLimit = !!t.enableLimit), Number.isFinite(t.lowerTranslation) && (this.m_lowerTranslation = t.lowerTranslation), Number.isFinite(t.upperTranslation) && (this.m_upperTranslation = t.upperTranslation), typeof t.enableMotor < "u" && (this.m_enableMotor = !!t.enableMotor), Number.isFinite(t.maxMotorForce) && (this.m_maxMotorForce = t.maxMotorForce), Number.isFinite(t.motorSpeed) && (this.m_motorSpeed = t.motorSpeed);
  }
  /**
   * The local anchor point relative to bodyA's origin.
   */
  getLocalAnchorA() {
    return this.m_localAnchorA;
  }
  /**
   * The local anchor point relative to bodyB's origin.
   */
  getLocalAnchorB() {
    return this.m_localAnchorB;
  }
  /**
   * The local joint axis relative to bodyA.
   */
  getLocalAxisA() {
    return this.m_localXAxisA;
  }
  /**
   * Get the reference angle.
   */
  getReferenceAngle() {
    return this.m_referenceAngle;
  }
  /**
   * Get the current joint translation, usually in meters.
   */
  getJointTranslation() {
    const t = this.m_bodyA.getWorldPoint(this.m_localAnchorA), e = this.m_bodyB.getWorldPoint(this.m_localAnchorB), s = p.sub(e, t), i = this.m_bodyA.getWorldVector(this.m_localXAxisA);
    return p.dot(s, i);
  }
  /**
   * Get the current joint translation speed, usually in meters per second.
   */
  getJointSpeed() {
    const t = this.m_bodyA, e = this.m_bodyB, s = C.mulVec2(t.m_xf.q, p.sub(this.m_localAnchorA, t.m_sweep.localCenter)), i = C.mulVec2(e.m_xf.q, p.sub(this.m_localAnchorB, e.m_sweep.localCenter)), n = p.add(t.m_sweep.c, s), o = p.add(e.m_sweep.c, i), r = p.sub(o, n), a = C.mulVec2(t.m_xf.q, this.m_localXAxisA), c = t.m_linearVelocity, l = e.m_linearVelocity, m = t.m_angularVelocity, h = e.m_angularVelocity;
    return p.dot(r, p.crossNumVec2(m, a)) + p.dot(a, p.sub(p.addCrossNumVec2(l, h, i), p.addCrossNumVec2(c, m, s)));
  }
  /**
   * Is the joint limit enabled?
   */
  isLimitEnabled() {
    return this.m_enableLimit;
  }
  /**
   * Enable/disable the joint limit.
   */
  enableLimit(t) {
    t != this.m_enableLimit && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_enableLimit = t, this.m_impulse.z = 0);
  }
  /**
   * Get the lower joint limit, usually in meters.
   */
  getLowerLimit() {
    return this.m_lowerTranslation;
  }
  /**
   * Get the upper joint limit, usually in meters.
   */
  getUpperLimit() {
    return this.m_upperTranslation;
  }
  /**
   * Set the joint limits, usually in meters.
   */
  setLimits(t, e) {
    Il && console.assert(t <= e), (t != this.m_lowerTranslation || e != this.m_upperTranslation) && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_lowerTranslation = t, this.m_upperTranslation = e, this.m_impulse.z = 0);
  }
  /**
   * Is the joint motor enabled?
   */
  isMotorEnabled() {
    return this.m_enableMotor;
  }
  /**
   * Enable/disable the joint motor.
   */
  enableMotor(t) {
    t != this.m_enableMotor && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_enableMotor = t);
  }
  /**
   * Set the motor speed, usually in meters per second.
   */
  setMotorSpeed(t) {
    t != this.m_motorSpeed && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_motorSpeed = t);
  }
  /**
   * Set the maximum motor force, usually in N.
   */
  setMaxMotorForce(t) {
    t != this.m_maxMotorForce && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_maxMotorForce = t);
  }
  getMaxMotorForce() {
    return this.m_maxMotorForce;
  }
  /**
   * Get the motor speed, usually in meters per second.
   */
  getMotorSpeed() {
    return this.m_motorSpeed;
  }
  /**
   * Get the current motor force given the inverse time step, usually in N.
   */
  getMotorForce(t) {
    return t * this.m_motorImpulse;
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  }
  /**
   * Get the reaction force on bodyB at the joint anchor in Newtons.
   */
  getReactionForce(t) {
    return p.combine(this.m_impulse.x, this.m_perp, this.m_motorImpulse + this.m_impulse.z, this.m_axis).mul(t);
  }
  /**
   * Get the reaction torque on bodyB in N*m.
   */
  getReactionTorque(t) {
    return t * this.m_impulse.y;
  }
  initVelocityConstraints(t) {
    this.m_localCenterA = this.m_bodyA.m_sweep.localCenter, this.m_localCenterB = this.m_bodyB.m_sweep.localCenter, this.m_invMassA = this.m_bodyA.m_invMass, this.m_invMassB = this.m_bodyB.m_invMass, this.m_invIA = this.m_bodyA.m_invI, this.m_invIB = this.m_bodyB.m_invI;
    const e = this.m_bodyA.c_position.c, s = this.m_bodyA.c_position.a, i = this.m_bodyA.c_velocity.v;
    let n = this.m_bodyA.c_velocity.w;
    const o = this.m_bodyB.c_position.c, r = this.m_bodyB.c_position.a, a = this.m_bodyB.c_velocity.v;
    let c = this.m_bodyB.c_velocity.w;
    const l = C.neo(s), m = C.neo(r), h = C.mulVec2(l, p.sub(this.m_localAnchorA, this.m_localCenterA)), u = C.mulVec2(m, p.sub(this.m_localAnchorB, this.m_localCenterB)), d = p.zero();
    d.addCombine(1, o, 1, u), d.subCombine(1, e, 1, h);
    const f = this.m_invMassA, y = this.m_invMassB, v = this.m_invIA, g = this.m_invIB;
    this.m_axis = C.mulVec2(l, this.m_localXAxisA), this.m_a1 = p.crossVec2Vec2(p.add(d, h), this.m_axis), this.m_a2 = p.crossVec2Vec2(u, this.m_axis), this.m_motorMass = f + y + v * this.m_a1 * this.m_a1 + g * this.m_a2 * this.m_a2, this.m_motorMass > 0 && (this.m_motorMass = 1 / this.m_motorMass);
    {
      this.m_perp = C.mulVec2(l, this.m_localYAxisA), this.m_s1 = p.crossVec2Vec2(p.add(d, h), this.m_perp), this.m_s2 = p.crossVec2Vec2(u, this.m_perp), p.crossVec2Vec2(h, this.m_perp);
      const A = f + y + v * this.m_s1 * this.m_s1 + g * this.m_s2 * this.m_s2, b = v * this.m_s1 + g * this.m_s2, B = v * this.m_s1 * this.m_a1 + g * this.m_s2 * this.m_a2;
      let w = v + g;
      w == 0 && (w = 1);
      const T = v * this.m_a1 + g * this.m_a2, M = f + y + v * this.m_a1 * this.m_a1 + g * this.m_a2 * this.m_a2;
      this.m_K.ex.set(A, b, B), this.m_K.ey.set(b, w, T), this.m_K.ez.set(B, T, M);
    }
    if (this.m_enableLimit) {
      const A = p.dot(this.m_axis, d);
      Ji(this.m_upperTranslation - this.m_lowerTranslation) < 2 * O.linearSlop ? this.m_limitState = 3 : A <= this.m_lowerTranslation ? this.m_limitState != 1 && (this.m_limitState = 1, this.m_impulse.z = 0) : A >= this.m_upperTranslation ? this.m_limitState != 2 && (this.m_limitState = 2, this.m_impulse.z = 0) : (this.m_limitState = 0, this.m_impulse.z = 0);
    } else
      this.m_limitState = 0, this.m_impulse.z = 0;
    if (this.m_enableMotor == !1 && (this.m_motorImpulse = 0), t.warmStarting) {
      this.m_impulse.mul(t.dtRatio), this.m_motorImpulse *= t.dtRatio;
      const A = p.combine(this.m_impulse.x, this.m_perp, this.m_motorImpulse + this.m_impulse.z, this.m_axis), b = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1, B = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
      i.subMul(f, A), n -= v * b, a.addMul(y, A), c += g * B;
    } else
      this.m_impulse.setZero(), this.m_motorImpulse = 0;
    this.m_bodyA.c_velocity.v.setVec2(i), this.m_bodyA.c_velocity.w = n, this.m_bodyB.c_velocity.v.setVec2(a), this.m_bodyB.c_velocity.w = c;
  }
  solveVelocityConstraints(t) {
    const e = this.m_bodyA.c_velocity.v;
    let s = this.m_bodyA.c_velocity.w;
    const i = this.m_bodyB.c_velocity.v;
    let n = this.m_bodyB.c_velocity.w;
    const o = this.m_invMassA, r = this.m_invMassB, a = this.m_invIA, c = this.m_invIB;
    if (this.m_enableMotor && this.m_limitState != 3) {
      const m = p.dot(this.m_axis, p.sub(i, e)) + this.m_a2 * n - this.m_a1 * s;
      let h = this.m_motorMass * (this.m_motorSpeed - m);
      const u = this.m_motorImpulse, d = t.dt * this.m_maxMotorForce;
      this.m_motorImpulse = Qt(this.m_motorImpulse + h, -d, d), h = this.m_motorImpulse - u;
      const f = p.mulNumVec2(h, this.m_axis), y = h * this.m_a1, v = h * this.m_a2;
      e.subMul(o, f), s -= a * y, i.addMul(r, f), n += c * v;
    }
    const l = p.zero();
    if (l.x += p.dot(this.m_perp, i) + this.m_s2 * n, l.x -= p.dot(this.m_perp, e) + this.m_s1 * s, l.y = n - s, this.m_enableLimit && this.m_limitState != 0) {
      let m = 0;
      m += p.dot(this.m_axis, i) + this.m_a2 * n, m -= p.dot(this.m_axis, e) + this.m_a1 * s;
      const h = new ht(l.x, l.y, m), u = ht.clone(this.m_impulse);
      let d = this.m_K.solve33(ht.neg(h));
      this.m_impulse.add(d), this.m_limitState == 1 ? this.m_impulse.z = ha(this.m_impulse.z, 0) : this.m_limitState == 2 && (this.m_impulse.z = Vl(this.m_impulse.z, 0));
      const f = p.combine(-1, l, -(this.m_impulse.z - u.z), p.neo(this.m_K.ez.x, this.m_K.ez.y)), y = p.add(this.m_K.solve22(f), p.neo(u.x, u.y));
      this.m_impulse.x = y.x, this.m_impulse.y = y.y, d = ht.sub(this.m_impulse, u);
      const v = p.combine(d.x, this.m_perp, d.z, this.m_axis), g = d.x * this.m_s1 + d.y + d.z * this.m_a1, A = d.x * this.m_s2 + d.y + d.z * this.m_a2;
      e.subMul(o, v), s -= a * g, i.addMul(r, v), n += c * A;
    } else {
      const m = this.m_K.solve22(p.neg(l));
      this.m_impulse.x += m.x, this.m_impulse.y += m.y;
      const h = p.mulNumVec2(m.x, this.m_perp), u = m.x * this.m_s1 + m.y, d = m.x * this.m_s2 + m.y;
      e.subMul(o, h), s -= a * u, i.addMul(r, h), n += c * d;
    }
    this.m_bodyA.c_velocity.v = e, this.m_bodyA.c_velocity.w = s, this.m_bodyB.c_velocity.v = i, this.m_bodyB.c_velocity.w = n;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    const e = this.m_bodyA.c_position.c;
    let s = this.m_bodyA.c_position.a;
    const i = this.m_bodyB.c_position.c;
    let n = this.m_bodyB.c_position.a;
    const o = C.neo(s), r = C.neo(n), a = this.m_invMassA, c = this.m_invMassB, l = this.m_invIA, m = this.m_invIB, h = C.mulVec2(o, p.sub(this.m_localAnchorA, this.m_localCenterA)), u = C.mulVec2(r, p.sub(this.m_localAnchorB, this.m_localCenterB)), d = p.sub(p.add(i, u), p.add(e, h)), f = C.mulVec2(o, this.m_localXAxisA), y = p.crossVec2Vec2(p.add(d, h), f), v = p.crossVec2Vec2(u, f), g = C.mulVec2(o, this.m_localYAxisA), A = p.crossVec2Vec2(p.add(d, h), g), b = p.crossVec2Vec2(u, g);
    let B = new ht();
    const w = p.zero();
    w.x = p.dot(g, d), w.y = n - s - this.m_referenceAngle;
    let T = Ji(w.x);
    const M = Ji(w.y), q = O.linearSlop, F = O.maxLinearCorrection;
    let E = !1, D = 0;
    if (this.m_enableLimit) {
      const z = p.dot(f, d);
      Ji(this.m_upperTranslation - this.m_lowerTranslation) < 2 * q ? (D = Qt(z, -F, F), T = ha(T, Ji(z)), E = !0) : z <= this.m_lowerTranslation ? (D = Qt(z - this.m_lowerTranslation + q, -F, 0), T = Math.max(T, this.m_lowerTranslation - z), E = !0) : z >= this.m_upperTranslation && (D = Qt(z - this.m_upperTranslation - q, 0, F), T = Math.max(T, z - this.m_upperTranslation), E = !0);
    }
    if (E) {
      const z = a + c + l * A * A + m * b * b, ct = l * A + m * b, X = l * A * y + m * b * v;
      let H = l + m;
      H == 0 && (H = 1);
      const J = l * y + m * v, lt = a + c + l * y * y + m * v * v, $ = new re();
      $.ex.set(z, ct, X), $.ey.set(ct, H, J), $.ez.set(X, J, lt);
      const Bt = new ht();
      Bt.x = w.x, Bt.y = w.y, Bt.z = D, B = $.solve33(ht.neg(Bt));
    } else {
      const z = a + c + l * A * A + m * b * b, ct = l * A + m * b;
      let X = l + m;
      X == 0 && (X = 1);
      const H = new pt();
      H.ex.setNum(z, ct), H.ey.setNum(ct, X);
      const J = H.solve(p.neg(w));
      B.x = J.x, B.y = J.y, B.z = 0;
    }
    const V = p.combine(B.x, g, B.z, f), k = B.x * A + B.y + B.z * y, N = B.x * b + B.y + B.z * v;
    return e.subMul(a, V), s -= l * k, i.addMul(c, V), n += m * N, this.m_bodyA.c_position.c = e, this.m_bodyA.c_position.a = s, this.m_bodyB.c_position.c = i, this.m_bodyB.c_position.a = n, T <= O.linearSlop && M <= O.angularSlop;
  }
}
const Wo = typeof ASSERT > "u" ? !1 : ASSERT, Fl = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, Rl = {
  ratio: 1
};
class Ds extends te {
  static TYPE = "gear-joint";
  /** @internal */
  m_type;
  /** @internal */
  m_joint1;
  /** @internal */
  m_joint2;
  /** @internal */
  m_type1;
  /** @internal */
  m_type2;
  /** @internal */
  m_bodyC;
  /** @internal */
  m_localAnchorC;
  /** @internal */
  m_localAnchorA;
  /** @internal */
  m_referenceAngleA;
  /** @internal */
  m_localAxisC;
  /** @internal */
  m_bodyD;
  /** @internal */
  m_localAnchorD;
  /** @internal */
  m_localAnchorB;
  /** @internal */
  m_referenceAngleB;
  /** @internal */
  m_localAxisD;
  /** @internal */
  m_ratio;
  /** @internal */
  m_constant;
  /** @internal */
  m_impulse;
  // Solver temp
  /** @internal */
  m_lcA;
  /** @internal */
  m_lcB;
  /** @internal */
  m_lcC;
  /** @internal */
  m_lcD;
  /** @internal */
  m_mA;
  /** @internal */
  m_mB;
  /** @internal */
  m_mC;
  /** @internal */
  m_mD;
  /** @internal */
  m_iA;
  /** @internal */
  m_iB;
  /** @internal */
  m_iC;
  /** @internal */
  m_iD;
  /** @internal */
  m_JvAC;
  /** @internal */
  m_JvBD;
  /** @internal */
  m_JwA;
  /** @internal */
  m_JwB;
  /** @internal */
  m_JwC;
  /** @internal */
  m_JwD;
  /** @internal */
  m_mass;
  constructor(t, e, s, i, n, o) {
    if (Fl && !(this instanceof Ds))
      return new Ds(t, e, s, i, n, o);
    t = Ce(t, Rl), super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_type = Ds.TYPE, Wo && console.assert(i.m_type === ce.TYPE || i.m_type === fs.TYPE), Wo && console.assert(n.m_type === ce.TYPE || n.m_type === fs.TYPE), this.m_joint1 = i || t.joint1, this.m_joint2 = n || t.joint2, this.m_ratio = Number.isFinite(o) ? o : t.ratio, this.m_type1 = this.m_joint1.getType(), this.m_type2 = this.m_joint2.getType();
    let r, a;
    this.m_bodyC = this.m_joint1.getBodyA(), this.m_bodyA = this.m_joint1.getBodyB();
    const c = this.m_bodyA.m_xf, l = this.m_bodyA.m_sweep.a, m = this.m_bodyC.m_xf, h = this.m_bodyC.m_sweep.a;
    if (this.m_type1 === ce.TYPE) {
      const v = this.m_joint1;
      this.m_localAnchorC = v.m_localAnchorA, this.m_localAnchorA = v.m_localAnchorB, this.m_referenceAngleA = v.m_referenceAngle, this.m_localAxisC = p.zero(), r = l - h - this.m_referenceAngleA;
    } else {
      const v = this.m_joint1;
      this.m_localAnchorC = v.m_localAnchorA, this.m_localAnchorA = v.m_localAnchorB, this.m_referenceAngleA = v.m_referenceAngle, this.m_localAxisC = v.m_localXAxisA;
      const g = this.m_localAnchorC, A = C.mulTVec2(m.q, p.add(C.mulVec2(c.q, this.m_localAnchorA), p.sub(c.p, m.p)));
      r = p.dot(A, this.m_localAxisC) - p.dot(g, this.m_localAxisC);
    }
    this.m_bodyD = this.m_joint2.getBodyA(), this.m_bodyB = this.m_joint2.getBodyB();
    const u = this.m_bodyB.m_xf, d = this.m_bodyB.m_sweep.a, f = this.m_bodyD.m_xf, y = this.m_bodyD.m_sweep.a;
    if (this.m_type2 === ce.TYPE) {
      const v = this.m_joint2;
      this.m_localAnchorD = v.m_localAnchorA, this.m_localAnchorB = v.m_localAnchorB, this.m_referenceAngleB = v.m_referenceAngle, this.m_localAxisD = p.zero(), a = d - y - this.m_referenceAngleB;
    } else {
      const v = this.m_joint2;
      this.m_localAnchorD = v.m_localAnchorA, this.m_localAnchorB = v.m_localAnchorB, this.m_referenceAngleB = v.m_referenceAngle, this.m_localAxisD = v.m_localXAxisA;
      const g = this.m_localAnchorD, A = C.mulTVec2(f.q, p.add(C.mulVec2(u.q, this.m_localAnchorB), p.sub(u.p, f.p)));
      a = p.dot(A, this.m_localAxisD) - p.dot(g, this.m_localAxisD);
    }
    this.m_constant = r + this.m_ratio * a, this.m_impulse = 0;
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      joint1: this.m_joint1,
      joint2: this.m_joint2,
      ratio: this.m_ratio
      // _constant: this.m_constant,
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    return t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), t.joint1 = s(te, t.joint1, e), t.joint2 = s(te, t.joint2, e), new Ds(t);
  }
  /** @hidden */
  _reset(t) {
    Number.isFinite(t.ratio) && (this.m_ratio = t.ratio);
  }
  /**
   * Get the first joint.
   */
  getJoint1() {
    return this.m_joint1;
  }
  /**
   * Get the second joint.
   */
  getJoint2() {
    return this.m_joint2;
  }
  /**
   * Set the gear ratio.
   */
  setRatio(t) {
    Wo && console.assert(Number.isFinite(t)), this.m_ratio = t;
  }
  /**
   * Get the gear ratio.
   */
  getRatio() {
    return this.m_ratio;
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  }
  /**
   * Get the reaction force on bodyB at the joint anchor in Newtons.
   */
  getReactionForce(t) {
    return p.mulNumVec2(this.m_impulse, this.m_JvAC).mul(t);
  }
  /**
   * Get the reaction torque on bodyB in N*m.
   */
  getReactionTorque(t) {
    const e = this.m_impulse * this.m_JwA;
    return t * e;
  }
  initVelocityConstraints(t) {
    this.m_lcA = this.m_bodyA.m_sweep.localCenter, this.m_lcB = this.m_bodyB.m_sweep.localCenter, this.m_lcC = this.m_bodyC.m_sweep.localCenter, this.m_lcD = this.m_bodyD.m_sweep.localCenter, this.m_mA = this.m_bodyA.m_invMass, this.m_mB = this.m_bodyB.m_invMass, this.m_mC = this.m_bodyC.m_invMass, this.m_mD = this.m_bodyD.m_invMass, this.m_iA = this.m_bodyA.m_invI, this.m_iB = this.m_bodyB.m_invI, this.m_iC = this.m_bodyC.m_invI, this.m_iD = this.m_bodyD.m_invI;
    const e = this.m_bodyA.c_position.a, s = this.m_bodyA.c_velocity.v;
    let i = this.m_bodyA.c_velocity.w;
    const n = this.m_bodyB.c_position.a, o = this.m_bodyB.c_velocity.v;
    let r = this.m_bodyB.c_velocity.w;
    const a = this.m_bodyC.c_position.a, c = this.m_bodyC.c_velocity.v;
    let l = this.m_bodyC.c_velocity.w;
    const m = this.m_bodyD.c_position.a, h = this.m_bodyD.c_velocity.v;
    let u = this.m_bodyD.c_velocity.w;
    const d = C.neo(e), f = C.neo(n), y = C.neo(a), v = C.neo(m);
    if (this.m_mass = 0, this.m_type1 == ce.TYPE)
      this.m_JvAC = p.zero(), this.m_JwA = 1, this.m_JwC = 1, this.m_mass += this.m_iA + this.m_iC;
    else {
      const g = C.mulVec2(y, this.m_localAxisC), A = C.mulSub(y, this.m_localAnchorC, this.m_lcC), b = C.mulSub(d, this.m_localAnchorA, this.m_lcA);
      this.m_JvAC = g, this.m_JwC = p.crossVec2Vec2(A, g), this.m_JwA = p.crossVec2Vec2(b, g), this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA;
    }
    if (this.m_type2 == ce.TYPE)
      this.m_JvBD = p.zero(), this.m_JwB = this.m_ratio, this.m_JwD = this.m_ratio, this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
    else {
      const g = C.mulVec2(v, this.m_localAxisD), A = C.mulSub(v, this.m_localAnchorD, this.m_lcD), b = C.mulSub(f, this.m_localAnchorB, this.m_lcB);
      this.m_JvBD = p.mulNumVec2(this.m_ratio, g), this.m_JwD = this.m_ratio * p.crossVec2Vec2(A, g), this.m_JwB = this.m_ratio * p.crossVec2Vec2(b, g), this.m_mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * this.m_JwD * this.m_JwD + this.m_iB * this.m_JwB * this.m_JwB;
    }
    this.m_mass = this.m_mass > 0 ? 1 / this.m_mass : 0, t.warmStarting ? (s.addMul(this.m_mA * this.m_impulse, this.m_JvAC), i += this.m_iA * this.m_impulse * this.m_JwA, o.addMul(this.m_mB * this.m_impulse, this.m_JvBD), r += this.m_iB * this.m_impulse * this.m_JwB, c.subMul(this.m_mC * this.m_impulse, this.m_JvAC), l -= this.m_iC * this.m_impulse * this.m_JwC, h.subMul(this.m_mD * this.m_impulse, this.m_JvBD), u -= this.m_iD * this.m_impulse * this.m_JwD) : this.m_impulse = 0, this.m_bodyA.c_velocity.v.setVec2(s), this.m_bodyA.c_velocity.w = i, this.m_bodyB.c_velocity.v.setVec2(o), this.m_bodyB.c_velocity.w = r, this.m_bodyC.c_velocity.v.setVec2(c), this.m_bodyC.c_velocity.w = l, this.m_bodyD.c_velocity.v.setVec2(h), this.m_bodyD.c_velocity.w = u;
  }
  solveVelocityConstraints(t) {
    const e = this.m_bodyA.c_velocity.v;
    let s = this.m_bodyA.c_velocity.w;
    const i = this.m_bodyB.c_velocity.v;
    let n = this.m_bodyB.c_velocity.w;
    const o = this.m_bodyC.c_velocity.v;
    let r = this.m_bodyC.c_velocity.w;
    const a = this.m_bodyD.c_velocity.v;
    let c = this.m_bodyD.c_velocity.w, l = p.dot(this.m_JvAC, e) - p.dot(this.m_JvAC, o) + p.dot(this.m_JvBD, i) - p.dot(this.m_JvBD, a);
    l += this.m_JwA * s - this.m_JwC * r + (this.m_JwB * n - this.m_JwD * c);
    const m = -this.m_mass * l;
    this.m_impulse += m, e.addMul(this.m_mA * m, this.m_JvAC), s += this.m_iA * m * this.m_JwA, i.addMul(this.m_mB * m, this.m_JvBD), n += this.m_iB * m * this.m_JwB, o.subMul(this.m_mC * m, this.m_JvAC), r -= this.m_iC * m * this.m_JwC, a.subMul(this.m_mD * m, this.m_JvBD), c -= this.m_iD * m * this.m_JwD, this.m_bodyA.c_velocity.v.setVec2(e), this.m_bodyA.c_velocity.w = s, this.m_bodyB.c_velocity.v.setVec2(i), this.m_bodyB.c_velocity.w = n, this.m_bodyC.c_velocity.v.setVec2(o), this.m_bodyC.c_velocity.w = r, this.m_bodyD.c_velocity.v.setVec2(a), this.m_bodyD.c_velocity.w = c;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    const e = this.m_bodyA.c_position.c;
    let s = this.m_bodyA.c_position.a;
    const i = this.m_bodyB.c_position.c;
    let n = this.m_bodyB.c_position.a;
    const o = this.m_bodyC.c_position.c;
    let r = this.m_bodyC.c_position.a;
    const a = this.m_bodyD.c_position.c;
    let c = this.m_bodyD.c_position.a;
    const l = C.neo(s), m = C.neo(n), h = C.neo(r), u = C.neo(c), d = 0;
    let f, y, v, g, A, b, B, w, T = 0;
    if (this.m_type1 == ce.TYPE)
      v = p.zero(), A = 1, B = 1, T += this.m_iA + this.m_iC, f = s - r - this.m_referenceAngleA;
    else {
      const F = C.mulVec2(h, this.m_localAxisC), E = C.mulSub(h, this.m_localAnchorC, this.m_lcC), D = C.mulSub(l, this.m_localAnchorA, this.m_lcA);
      v = F, B = p.crossVec2Vec2(E, F), A = p.crossVec2Vec2(D, F), T += this.m_mC + this.m_mA + this.m_iC * B * B + this.m_iA * A * A;
      const V = p.sub(this.m_localAnchorC, this.m_lcC), k = C.mulTVec2(h, p.add(D, p.sub(e, o)));
      f = p.dot(p.sub(k, V), this.m_localAxisC);
    }
    if (this.m_type2 == ce.TYPE)
      g = p.zero(), b = this.m_ratio, w = this.m_ratio, T += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD), y = n - c - this.m_referenceAngleB;
    else {
      const F = C.mulVec2(u, this.m_localAxisD), E = C.mulSub(u, this.m_localAnchorD, this.m_lcD), D = C.mulSub(m, this.m_localAnchorB, this.m_lcB);
      g = p.mulNumVec2(this.m_ratio, F), w = this.m_ratio * p.crossVec2Vec2(E, F), b = this.m_ratio * p.crossVec2Vec2(D, F), T += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * w * w + this.m_iB * b * b;
      const V = p.sub(this.m_localAnchorD, this.m_lcD), k = C.mulTVec2(u, p.add(D, p.sub(i, a)));
      y = p.dot(k, this.m_localAxisD) - p.dot(V, this.m_localAxisD);
    }
    const M = f + this.m_ratio * y - this.m_constant;
    let q = 0;
    return T > 0 && (q = -M / T), e.addMul(this.m_mA * q, v), s += this.m_iA * q * A, i.addMul(this.m_mB * q, g), n += this.m_iB * q * b, o.subMul(this.m_mC * q, v), r -= this.m_iC * q * B, a.subMul(this.m_mD * q, g), c -= this.m_iD * q * w, this.m_bodyA.c_position.c.setVec2(e), this.m_bodyA.c_position.a = s, this.m_bodyB.c_position.c.setVec2(i), this.m_bodyB.c_position.a = n, this.m_bodyC.c_position.c.setVec2(o), this.m_bodyC.c_position.a = r, this.m_bodyD.c_position.c.setVec2(a), this.m_bodyD.c_position.a = c, d < O.linearSlop;
  }
}
const Yo = typeof ASSERT > "u" ? !1 : ASSERT, El = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, ql = {
  maxForce: 1,
  maxTorque: 1,
  correctionFactor: 0.3
};
class Ws extends te {
  static TYPE = "motor-joint";
  /** @internal */
  m_type;
  /** @internal */
  m_linearOffset;
  /** @internal */
  m_angularOffset;
  /** @internal */
  m_linearImpulse;
  /** @internal */
  m_angularImpulse;
  /** @internal */
  m_maxForce;
  /** @internal */
  m_maxTorque;
  /** @internal */
  m_correctionFactor;
  // Solver temp
  /** @internal */
  m_rA;
  /** @internal */
  m_rB;
  /** @internal */
  m_localCenterA;
  /** @internal */
  m_localCenterB;
  /** @internal */
  m_linearError;
  /** @internal */
  m_angularError;
  /** @internal */
  m_invMassA;
  /** @internal */
  m_invMassB;
  /** @internal */
  m_invIA;
  /** @internal */
  m_invIB;
  /** @internal */
  m_linearMass;
  /** @internal */
  m_angularMass;
  constructor(t, e, s) {
    if (El && !(this instanceof Ws))
      return new Ws(t, e, s);
    t = Ce(t, ql), super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_type = Ws.TYPE, this.m_linearOffset = p.isValid(t.linearOffset) ? p.clone(t.linearOffset) : e.getLocalPoint(s.getPosition()), this.m_angularOffset = Number.isFinite(t.angularOffset) ? t.angularOffset : s.getAngle() - e.getAngle(), this.m_linearImpulse = p.zero(), this.m_angularImpulse = 0, this.m_maxForce = t.maxForce, this.m_maxTorque = t.maxTorque, this.m_correctionFactor = t.correctionFactor;
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      maxForce: this.m_maxForce,
      maxTorque: this.m_maxTorque,
      correctionFactor: this.m_correctionFactor,
      linearOffset: this.m_linearOffset,
      angularOffset: this.m_angularOffset
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    return t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), new Ws(t);
  }
  /** @hidden */
  _reset(t) {
    Number.isFinite(t.angularOffset) && (this.m_angularOffset = t.angularOffset), Number.isFinite(t.maxForce) && (this.m_maxForce = t.maxForce), Number.isFinite(t.maxTorque) && (this.m_maxTorque = t.maxTorque), Number.isFinite(t.correctionFactor) && (this.m_correctionFactor = t.correctionFactor), p.isValid(t.linearOffset) && this.m_linearOffset.set(t.linearOffset);
  }
  /**
   * Set the maximum friction force in N.
   */
  setMaxForce(t) {
    Yo && console.assert(Number.isFinite(t) && t >= 0), this.m_maxForce = t;
  }
  /**
   * Get the maximum friction force in N.
   */
  getMaxForce() {
    return this.m_maxForce;
  }
  /**
   * Set the maximum friction torque in N*m.
   */
  setMaxTorque(t) {
    Yo && console.assert(Number.isFinite(t) && t >= 0), this.m_maxTorque = t;
  }
  /**
   * Get the maximum friction torque in N*m.
   */
  getMaxTorque() {
    return this.m_maxTorque;
  }
  /**
   * Set the position correction factor in the range [0,1].
   */
  setCorrectionFactor(t) {
    Yo && console.assert(Number.isFinite(t) && 0 <= t && t <= 1), this.m_correctionFactor = t;
  }
  /**
   * Get the position correction factor in the range [0,1].
   */
  getCorrectionFactor() {
    return this.m_correctionFactor;
  }
  /**
   * Set/get the target linear offset, in frame A, in meters.
   */
  setLinearOffset(t) {
    (t.x != this.m_linearOffset.x || t.y != this.m_linearOffset.y) && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_linearOffset.set(t));
  }
  getLinearOffset() {
    return this.m_linearOffset;
  }
  /**
   * Set/get the target angular offset, in radians.
   */
  setAngularOffset(t) {
    t != this.m_angularOffset && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_angularOffset = t);
  }
  getAngularOffset() {
    return this.m_angularOffset;
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return this.m_bodyA.getPosition();
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getPosition();
  }
  /**
   * Get the reaction force on bodyB at the joint anchor in Newtons.
   */
  getReactionForce(t) {
    return p.mulNumVec2(t, this.m_linearImpulse);
  }
  /**
   * Get the reaction torque on bodyB in N*m.
   */
  getReactionTorque(t) {
    return t * this.m_angularImpulse;
  }
  initVelocityConstraints(t) {
    this.m_localCenterA = this.m_bodyA.m_sweep.localCenter, this.m_localCenterB = this.m_bodyB.m_sweep.localCenter, this.m_invMassA = this.m_bodyA.m_invMass, this.m_invMassB = this.m_bodyB.m_invMass, this.m_invIA = this.m_bodyA.m_invI, this.m_invIB = this.m_bodyB.m_invI;
    const e = this.m_bodyA.c_position.c, s = this.m_bodyA.c_position.a, i = this.m_bodyA.c_velocity.v;
    let n = this.m_bodyA.c_velocity.w;
    const o = this.m_bodyB.c_position.c, r = this.m_bodyB.c_position.a, a = this.m_bodyB.c_velocity.v;
    let c = this.m_bodyB.c_velocity.w;
    const l = C.neo(s), m = C.neo(r);
    this.m_rA = C.mulVec2(l, p.sub(this.m_linearOffset, this.m_localCenterA)), this.m_rB = C.mulVec2(m, p.neg(this.m_localCenterB));
    const h = this.m_invMassA, u = this.m_invMassB, d = this.m_invIA, f = this.m_invIB, y = new pt();
    if (y.ex.x = h + u + d * this.m_rA.y * this.m_rA.y + f * this.m_rB.y * this.m_rB.y, y.ex.y = -d * this.m_rA.x * this.m_rA.y - f * this.m_rB.x * this.m_rB.y, y.ey.x = y.ex.y, y.ey.y = h + u + d * this.m_rA.x * this.m_rA.x + f * this.m_rB.x * this.m_rB.x, this.m_linearMass = y.getInverse(), this.m_angularMass = d + f, this.m_angularMass > 0 && (this.m_angularMass = 1 / this.m_angularMass), this.m_linearError = p.zero(), this.m_linearError.addCombine(1, o, 1, this.m_rB), this.m_linearError.subCombine(1, e, 1, this.m_rA), this.m_angularError = r - s - this.m_angularOffset, t.warmStarting) {
      this.m_linearImpulse.mul(t.dtRatio), this.m_angularImpulse *= t.dtRatio;
      const v = p.neo(this.m_linearImpulse.x, this.m_linearImpulse.y);
      i.subMul(h, v), n -= d * (p.crossVec2Vec2(this.m_rA, v) + this.m_angularImpulse), a.addMul(u, v), c += f * (p.crossVec2Vec2(this.m_rB, v) + this.m_angularImpulse);
    } else
      this.m_linearImpulse.setZero(), this.m_angularImpulse = 0;
    this.m_bodyA.c_velocity.v = i, this.m_bodyA.c_velocity.w = n, this.m_bodyB.c_velocity.v = a, this.m_bodyB.c_velocity.w = c;
  }
  solveVelocityConstraints(t) {
    const e = this.m_bodyA.c_velocity.v;
    let s = this.m_bodyA.c_velocity.w;
    const i = this.m_bodyB.c_velocity.v;
    let n = this.m_bodyB.c_velocity.w;
    const o = this.m_invMassA, r = this.m_invMassB, a = this.m_invIA, c = this.m_invIB, l = t.dt, m = t.inv_dt;
    {
      const h = n - s + m * this.m_correctionFactor * this.m_angularError;
      let u = -this.m_angularMass * h;
      const d = this.m_angularImpulse, f = l * this.m_maxTorque;
      this.m_angularImpulse = Qt(this.m_angularImpulse + u, -f, f), u = this.m_angularImpulse - d, s -= a * u, n += c * u;
    }
    {
      const h = p.zero();
      h.addCombine(1, i, 1, p.crossNumVec2(n, this.m_rB)), h.subCombine(1, e, 1, p.crossNumVec2(s, this.m_rA)), h.addMul(m * this.m_correctionFactor, this.m_linearError);
      let u = p.neg(pt.mulVec2(this.m_linearMass, h));
      const d = p.clone(this.m_linearImpulse);
      this.m_linearImpulse.add(u);
      const f = l * this.m_maxForce;
      this.m_linearImpulse.clamp(f), u = p.sub(this.m_linearImpulse, d), e.subMul(o, u), s -= a * p.crossVec2Vec2(this.m_rA, u), i.addMul(r, u), n += c * p.crossVec2Vec2(this.m_rB, u);
    }
    this.m_bodyA.c_velocity.v = e, this.m_bodyA.c_velocity.w = s, this.m_bodyB.c_velocity.v = i, this.m_bodyB.c_velocity.w = n;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    return !0;
  }
}
const Dn = typeof ASSERT > "u" ? !1 : ASSERT, Ll = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, Nl = Math.PI, kl = {
  maxForce: 0,
  frequencyHz: 5,
  dampingRatio: 0.7
};
class Ys extends te {
  static TYPE = "mouse-joint";
  /** @internal */
  m_type;
  /** @internal */
  m_targetA;
  /** @internal */
  m_localAnchorB;
  /** @internal */
  m_maxForce;
  /** @internal */
  m_impulse;
  /** @internal */
  m_frequencyHz;
  /** @internal */
  m_dampingRatio;
  /** @internal */
  m_beta;
  /** @internal */
  m_gamma;
  // Solver temp
  /** @internal */
  m_rB;
  /** @internal */
  m_localCenterB;
  /** @internal */
  m_invMassB;
  /** @internal */
  m_invIB;
  /** @internal */
  m_mass;
  /** @internal */
  m_C;
  constructor(t, e, s, i) {
    if (Ll && !(this instanceof Ys))
      return new Ys(t, e, s, i);
    t = Ce(t, kl), super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_type = Ys.TYPE, Dn && console.assert(Number.isFinite(t.maxForce) && t.maxForce >= 0), Dn && console.assert(Number.isFinite(t.frequencyHz) && t.frequencyHz >= 0), Dn && console.assert(Number.isFinite(t.dampingRatio) && t.dampingRatio >= 0), p.isValid(i) ? this.m_targetA = p.clone(i) : p.isValid(t.target) ? this.m_targetA = p.clone(t.target) : this.m_targetA = p.zero(), this.m_localAnchorB = le.mulTVec2(s.getTransform(), this.m_targetA), this.m_maxForce = t.maxForce, this.m_impulse = p.zero(), this.m_frequencyHz = t.frequencyHz, this.m_dampingRatio = t.dampingRatio, this.m_beta = 0, this.m_gamma = 0, this.m_rB = p.zero(), this.m_localCenterB = p.zero(), this.m_invMassB = 0, this.m_invIB = 0, this.m_mass = new pt(), this.m_C = p.zero();
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      target: this.m_targetA,
      maxForce: this.m_maxForce,
      frequencyHz: this.m_frequencyHz,
      dampingRatio: this.m_dampingRatio,
      _localAnchorB: this.m_localAnchorB
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), t.target = p.clone(t.target);
    const i = new Ys(t);
    return t._localAnchorB && (i.m_localAnchorB = t._localAnchorB), i;
  }
  /** @hidden */
  _reset(t) {
    Number.isFinite(t.maxForce) && (this.m_maxForce = t.maxForce), Number.isFinite(t.frequencyHz) && (this.m_frequencyHz = t.frequencyHz), Number.isFinite(t.dampingRatio) && (this.m_dampingRatio = t.dampingRatio);
  }
  /**
   * Use this to update the target point.
   */
  setTarget(t) {
    p.areEqual(t, this.m_targetA) || (this.m_bodyB.setAwake(!0), this.m_targetA.set(t));
  }
  getTarget() {
    return this.m_targetA;
  }
  /**
   * Set the maximum force in Newtons.
   */
  setMaxForce(t) {
    this.m_maxForce = t;
  }
  /**
   * Get the maximum force in Newtons.
   */
  getMaxForce() {
    return this.m_maxForce;
  }
  /**
   * Set the frequency in Hertz.
   */
  setFrequency(t) {
    this.m_frequencyHz = t;
  }
  /**
   * Get the frequency in Hertz.
   */
  getFrequency() {
    return this.m_frequencyHz;
  }
  /**
   * Set the damping ratio (dimensionless).
   */
  setDampingRatio(t) {
    this.m_dampingRatio = t;
  }
  /**
   * Get the damping ratio (dimensionless).
   */
  getDampingRatio() {
    return this.m_dampingRatio;
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return p.clone(this.m_targetA);
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  }
  /**
   * Get the reaction force on bodyB at the joint anchor in Newtons.
   */
  getReactionForce(t) {
    return p.mulNumVec2(t, this.m_impulse);
  }
  /**
   * Get the reaction torque on bodyB in N*m.
   */
  getReactionTorque(t) {
    return t * 0;
  }
  /**
   * Shift the origin for any points stored in world coordinates.
   */
  shiftOrigin(t) {
    this.m_targetA.sub(t);
  }
  initVelocityConstraints(t) {
    this.m_localCenterB = this.m_bodyB.m_sweep.localCenter, this.m_invMassB = this.m_bodyB.m_invMass, this.m_invIB = this.m_bodyB.m_invI;
    const e = this.m_bodyB.c_position, s = this.m_bodyB.c_velocity, i = e.c, n = e.a, o = s.v;
    let r = s.w;
    const a = C.neo(n), c = this.m_bodyB.getMass(), l = 2 * Nl * this.m_frequencyHz, m = 2 * c * this.m_dampingRatio * l, h = c * (l * l), u = t.dt;
    Dn && console.assert(m + u * h > qt), this.m_gamma = u * (m + u * h), this.m_gamma != 0 && (this.m_gamma = 1 / this.m_gamma), this.m_beta = u * h * this.m_gamma, this.m_rB = C.mulVec2(a, p.sub(this.m_localAnchorB, this.m_localCenterB));
    const d = new pt();
    d.ex.x = this.m_invMassB + this.m_invIB * this.m_rB.y * this.m_rB.y + this.m_gamma, d.ex.y = -this.m_invIB * this.m_rB.x * this.m_rB.y, d.ey.x = d.ex.y, d.ey.y = this.m_invMassB + this.m_invIB * this.m_rB.x * this.m_rB.x + this.m_gamma, this.m_mass = d.getInverse(), this.m_C.setVec2(i), this.m_C.addCombine(1, this.m_rB, -1, this.m_targetA), this.m_C.mul(this.m_beta), r *= 0.98, t.warmStarting ? (this.m_impulse.mul(t.dtRatio), o.addMul(this.m_invMassB, this.m_impulse), r += this.m_invIB * p.crossVec2Vec2(this.m_rB, this.m_impulse)) : this.m_impulse.setZero(), s.v.setVec2(o), s.w = r;
  }
  solveVelocityConstraints(t) {
    const e = this.m_bodyB.c_velocity, s = p.clone(e.v);
    let i = e.w;
    const n = p.crossNumVec2(i, this.m_rB);
    n.add(s), n.addCombine(1, this.m_C, this.m_gamma, this.m_impulse), n.neg();
    let o = pt.mulVec2(this.m_mass, n);
    const r = p.clone(this.m_impulse);
    this.m_impulse.add(o);
    const a = t.dt * this.m_maxForce;
    this.m_impulse.clamp(a), o = p.sub(this.m_impulse, r), s.addMul(this.m_invMassB, o), i += this.m_invIB * p.crossVec2Vec2(this.m_rB, o), e.v.setVec2(s), e.w = i;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    return !0;
  }
}
const Ol = typeof ASSERT > "u" ? !1 : ASSERT, jl = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, Dl = Math.abs, Wl = {
  collideConnected: !0
};
class $s extends te {
  static TYPE = "pulley-joint";
  // static MIN_PULLEY_LENGTH: number = 2.0; // TODO where this is used?
  /** @internal */
  m_type;
  /** @internal */
  m_groundAnchorA;
  /** @internal */
  m_groundAnchorB;
  /** @internal */
  m_localAnchorA;
  /** @internal */
  m_localAnchorB;
  /** @internal */
  m_lengthA;
  /** @internal */
  m_lengthB;
  /** @internal */
  m_ratio;
  /** @internal */
  m_constant;
  /** @internal */
  m_impulse;
  // Solver temp
  /** @internal */
  m_uA;
  /** @internal */
  m_uB;
  /** @internal */
  m_rA;
  /** @internal */
  m_rB;
  /** @internal */
  m_localCenterA;
  /** @internal */
  m_localCenterB;
  /** @internal */
  m_invMassA;
  /** @internal */
  m_invMassB;
  /** @internal */
  m_invIA;
  /** @internal */
  m_invIB;
  /** @internal */
  m_mass;
  constructor(t, e, s, i, n, o, r, a) {
    if (jl && !(this instanceof $s))
      return new $s(t, e, s, i, n, o, r, a);
    t = Ce(t, Wl), super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_type = $s.TYPE, this.m_groundAnchorA = p.clone(i || t.groundAnchorA || p.neo(-1, 1)), this.m_groundAnchorB = p.clone(n || t.groundAnchorB || p.neo(1, 1)), this.m_localAnchorA = p.clone(o ? e.getLocalPoint(o) : t.localAnchorA || p.neo(-1, 0)), this.m_localAnchorB = p.clone(r ? s.getLocalPoint(r) : t.localAnchorB || p.neo(1, 0)), this.m_lengthA = Number.isFinite(t.lengthA) ? t.lengthA : p.distance(o, i), this.m_lengthB = Number.isFinite(t.lengthB) ? t.lengthB : p.distance(r, n), this.m_ratio = Number.isFinite(a) ? a : t.ratio, Ol && console.assert(a > qt), this.m_constant = this.m_lengthA + this.m_ratio * this.m_lengthB, this.m_impulse = 0;
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      groundAnchorA: this.m_groundAnchorA,
      groundAnchorB: this.m_groundAnchorB,
      localAnchorA: this.m_localAnchorA,
      localAnchorB: this.m_localAnchorB,
      lengthA: this.m_lengthA,
      lengthB: this.m_lengthB,
      ratio: this.m_ratio
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    return t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), new $s(t);
  }
  /** @hidden */
  _reset(t) {
    p.isValid(t.groundAnchorA) && this.m_groundAnchorA.set(t.groundAnchorA), p.isValid(t.groundAnchorB) && this.m_groundAnchorB.set(t.groundAnchorB), p.isValid(t.localAnchorA) ? this.m_localAnchorA.set(t.localAnchorA) : p.isValid(t.anchorA) && this.m_localAnchorA.set(this.m_bodyA.getLocalPoint(t.anchorA)), p.isValid(t.localAnchorB) ? this.m_localAnchorB.set(t.localAnchorB) : p.isValid(t.anchorB) && this.m_localAnchorB.set(this.m_bodyB.getLocalPoint(t.anchorB)), Number.isFinite(t.lengthA) && (this.m_lengthA = t.lengthA), Number.isFinite(t.lengthB) && (this.m_lengthB = t.lengthB), Number.isFinite(t.ratio) && (this.m_ratio = t.ratio);
  }
  /**
   * Get the first ground anchor.
   */
  getGroundAnchorA() {
    return this.m_groundAnchorA;
  }
  /**
   * Get the second ground anchor.
   */
  getGroundAnchorB() {
    return this.m_groundAnchorB;
  }
  /**
   * Get the current length of the segment attached to bodyA.
   */
  getLengthA() {
    return this.m_lengthA;
  }
  /**
   * Get the current length of the segment attached to bodyB.
   */
  getLengthB() {
    return this.m_lengthB;
  }
  /**
   * Get the pulley ratio.
   */
  getRatio() {
    return this.m_ratio;
  }
  /**
   * Get the current length of the segment attached to bodyA.
   */
  getCurrentLengthA() {
    const t = this.m_bodyA.getWorldPoint(this.m_localAnchorA), e = this.m_groundAnchorA;
    return p.distance(t, e);
  }
  /**
   * Get the current length of the segment attached to bodyB.
   */
  getCurrentLengthB() {
    const t = this.m_bodyB.getWorldPoint(this.m_localAnchorB), e = this.m_groundAnchorB;
    return p.distance(t, e);
  }
  /**
   * Shift the origin for any points stored in world coordinates.
   *
   * @param newOrigin
   */
  shiftOrigin(t) {
    this.m_groundAnchorA.sub(t), this.m_groundAnchorB.sub(t);
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  }
  /**
   * Get the reaction force on bodyB at the joint anchor in Newtons.
   */
  getReactionForce(t) {
    return p.mulNumVec2(this.m_impulse, this.m_uB).mul(t);
  }
  /**
   * Get the reaction torque on bodyB in N*m.
   */
  getReactionTorque(t) {
    return 0;
  }
  initVelocityConstraints(t) {
    this.m_localCenterA = this.m_bodyA.m_sweep.localCenter, this.m_localCenterB = this.m_bodyB.m_sweep.localCenter, this.m_invMassA = this.m_bodyA.m_invMass, this.m_invMassB = this.m_bodyB.m_invMass, this.m_invIA = this.m_bodyA.m_invI, this.m_invIB = this.m_bodyB.m_invI;
    const e = this.m_bodyA.c_position.c, s = this.m_bodyA.c_position.a, i = this.m_bodyA.c_velocity.v;
    let n = this.m_bodyA.c_velocity.w;
    const o = this.m_bodyB.c_position.c, r = this.m_bodyB.c_position.a, a = this.m_bodyB.c_velocity.v;
    let c = this.m_bodyB.c_velocity.w;
    const l = C.neo(s), m = C.neo(r);
    this.m_rA = C.mulVec2(l, p.sub(this.m_localAnchorA, this.m_localCenterA)), this.m_rB = C.mulVec2(m, p.sub(this.m_localAnchorB, this.m_localCenterB)), this.m_uA = p.sub(p.add(e, this.m_rA), this.m_groundAnchorA), this.m_uB = p.sub(p.add(o, this.m_rB), this.m_groundAnchorB);
    const h = this.m_uA.length(), u = this.m_uB.length();
    h > 10 * O.linearSlop ? this.m_uA.mul(1 / h) : this.m_uA.setZero(), u > 10 * O.linearSlop ? this.m_uB.mul(1 / u) : this.m_uB.setZero();
    const d = p.crossVec2Vec2(this.m_rA, this.m_uA), f = p.crossVec2Vec2(this.m_rB, this.m_uB), y = this.m_invMassA + this.m_invIA * d * d, v = this.m_invMassB + this.m_invIB * f * f;
    if (this.m_mass = y + this.m_ratio * this.m_ratio * v, this.m_mass > 0 && (this.m_mass = 1 / this.m_mass), t.warmStarting) {
      this.m_impulse *= t.dtRatio;
      const g = p.mulNumVec2(-this.m_impulse, this.m_uA), A = p.mulNumVec2(-this.m_ratio * this.m_impulse, this.m_uB);
      i.addMul(this.m_invMassA, g), n += this.m_invIA * p.crossVec2Vec2(this.m_rA, g), a.addMul(this.m_invMassB, A), c += this.m_invIB * p.crossVec2Vec2(this.m_rB, A);
    } else
      this.m_impulse = 0;
    this.m_bodyA.c_velocity.v = i, this.m_bodyA.c_velocity.w = n, this.m_bodyB.c_velocity.v = a, this.m_bodyB.c_velocity.w = c;
  }
  solveVelocityConstraints(t) {
    const e = this.m_bodyA.c_velocity.v;
    let s = this.m_bodyA.c_velocity.w;
    const i = this.m_bodyB.c_velocity.v;
    let n = this.m_bodyB.c_velocity.w;
    const o = p.add(e, p.crossNumVec2(s, this.m_rA)), r = p.add(i, p.crossNumVec2(n, this.m_rB)), a = -p.dot(this.m_uA, o) - this.m_ratio * p.dot(this.m_uB, r), c = -this.m_mass * a;
    this.m_impulse += c;
    const l = p.mulNumVec2(-c, this.m_uA), m = p.mulNumVec2(-this.m_ratio * c, this.m_uB);
    e.addMul(this.m_invMassA, l), s += this.m_invIA * p.crossVec2Vec2(this.m_rA, l), i.addMul(this.m_invMassB, m), n += this.m_invIB * p.crossVec2Vec2(this.m_rB, m), this.m_bodyA.c_velocity.v = e, this.m_bodyA.c_velocity.w = s, this.m_bodyB.c_velocity.v = i, this.m_bodyB.c_velocity.w = n;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    const e = this.m_bodyA.c_position.c;
    let s = this.m_bodyA.c_position.a;
    const i = this.m_bodyB.c_position.c;
    let n = this.m_bodyB.c_position.a;
    const o = C.neo(s), r = C.neo(n), a = C.mulVec2(o, p.sub(this.m_localAnchorA, this.m_localCenterA)), c = C.mulVec2(r, p.sub(this.m_localAnchorB, this.m_localCenterB)), l = p.sub(p.add(e, this.m_rA), this.m_groundAnchorA), m = p.sub(p.add(i, this.m_rB), this.m_groundAnchorB), h = l.length(), u = m.length();
    h > 10 * O.linearSlop ? l.mul(1 / h) : l.setZero(), u > 10 * O.linearSlop ? m.mul(1 / u) : m.setZero();
    const d = p.crossVec2Vec2(a, l), f = p.crossVec2Vec2(c, m), y = this.m_invMassA + this.m_invIA * d * d, v = this.m_invMassB + this.m_invIB * f * f;
    let g = y + this.m_ratio * this.m_ratio * v;
    g > 0 && (g = 1 / g);
    const A = this.m_constant - h - this.m_ratio * u, b = Dl(A), B = -g * A, w = p.mulNumVec2(-B, l), T = p.mulNumVec2(-this.m_ratio * B, m);
    return e.addMul(this.m_invMassA, w), s += this.m_invIA * p.crossVec2Vec2(a, w), i.addMul(this.m_invMassB, T), n += this.m_invIB * p.crossVec2Vec2(c, T), this.m_bodyA.c_position.c = e, this.m_bodyA.c_position.a = s, this.m_bodyB.c_position.c = i, this.m_bodyB.c_position.a = n, b < O.linearSlop;
  }
}
const Yl = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, $l = Math.min, Hl = {
  maxLength: 0
};
class Hs extends te {
  static TYPE = "rope-joint";
  /** @internal */
  m_type;
  /** @internal */
  m_localAnchorA;
  /** @internal */
  m_localAnchorB;
  /** @internal */
  m_maxLength;
  /** @internal */
  m_mass;
  /** @internal */
  m_impulse;
  /** @internal */
  m_length;
  /** @internal */
  m_state;
  // TODO enum
  // Solver temp
  /** @internal */
  m_u;
  /** @internal */
  m_rA;
  /** @internal */
  m_rB;
  /** @internal */
  m_localCenterA;
  /** @internal */
  m_localCenterB;
  /** @internal */
  m_invMassA;
  /** @internal */
  m_invMassB;
  /** @internal */
  m_invIA;
  /** @internal */
  m_invIB;
  constructor(t, e, s, i) {
    if (Yl && !(this instanceof Hs))
      return new Hs(t, e, s, i);
    t = Ce(t, Hl), super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_type = Hs.TYPE, this.m_localAnchorA = p.clone(i ? e.getLocalPoint(i) : t.localAnchorA || p.neo(-1, 0)), this.m_localAnchorB = p.clone(i ? s.getLocalPoint(i) : t.localAnchorB || p.neo(1, 0)), this.m_maxLength = t.maxLength, this.m_mass = 0, this.m_impulse = 0, this.m_length = 0, this.m_state = 0;
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      localAnchorA: this.m_localAnchorA,
      localAnchorB: this.m_localAnchorB,
      maxLength: this.m_maxLength
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    return t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), new Hs(t);
  }
  /** @hidden */
  _reset(t) {
    Number.isFinite(t.maxLength) && (this.m_maxLength = t.maxLength);
  }
  /**
   * The local anchor point relative to bodyA's origin.
   */
  getLocalAnchorA() {
    return this.m_localAnchorA;
  }
  /**
   * The local anchor point relative to bodyB's origin.
   */
  getLocalAnchorB() {
    return this.m_localAnchorB;
  }
  /**
   * Set the maximum length of the rope.
   */
  setMaxLength(t) {
    this.m_maxLength = t;
  }
  /**
   * Get the maximum length of the rope.
   */
  getMaxLength() {
    return this.m_maxLength;
  }
  getLimitState() {
    return this.m_state;
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  }
  /**
   * Get the reaction force on bodyB at the joint anchor in Newtons.
   */
  getReactionForce(t) {
    return p.mulNumVec2(this.m_impulse, this.m_u).mul(t);
  }
  /**
   * Get the reaction torque on bodyB in N*m.
   */
  getReactionTorque(t) {
    return 0;
  }
  initVelocityConstraints(t) {
    this.m_localCenterA = this.m_bodyA.m_sweep.localCenter, this.m_localCenterB = this.m_bodyB.m_sweep.localCenter, this.m_invMassA = this.m_bodyA.m_invMass, this.m_invMassB = this.m_bodyB.m_invMass, this.m_invIA = this.m_bodyA.m_invI, this.m_invIB = this.m_bodyB.m_invI;
    const e = this.m_bodyA.c_position.c, s = this.m_bodyA.c_position.a, i = this.m_bodyA.c_velocity.v;
    let n = this.m_bodyA.c_velocity.w;
    const o = this.m_bodyB.c_position.c, r = this.m_bodyB.c_position.a, a = this.m_bodyB.c_velocity.v;
    let c = this.m_bodyB.c_velocity.w;
    const l = C.neo(s), m = C.neo(r);
    if (this.m_rA = C.mulSub(l, this.m_localAnchorA, this.m_localCenterA), this.m_rB = C.mulSub(m, this.m_localAnchorB, this.m_localCenterB), this.m_u = p.zero(), this.m_u.addCombine(1, o, 1, this.m_rB), this.m_u.subCombine(1, e, 1, this.m_rA), this.m_length = this.m_u.length(), this.m_length - this.m_maxLength > 0 ? this.m_state = 2 : this.m_state = 0, this.m_length > O.linearSlop)
      this.m_u.mul(1 / this.m_length);
    else {
      this.m_u.setZero(), this.m_mass = 0, this.m_impulse = 0;
      return;
    }
    const u = p.crossVec2Vec2(this.m_rA, this.m_u), d = p.crossVec2Vec2(this.m_rB, this.m_u), f = this.m_invMassA + this.m_invIA * u * u + this.m_invMassB + this.m_invIB * d * d;
    if (this.m_mass = f != 0 ? 1 / f : 0, t.warmStarting) {
      this.m_impulse *= t.dtRatio;
      const y = p.mulNumVec2(this.m_impulse, this.m_u);
      i.subMul(this.m_invMassA, y), n -= this.m_invIA * p.crossVec2Vec2(this.m_rA, y), a.addMul(this.m_invMassB, y), c += this.m_invIB * p.crossVec2Vec2(this.m_rB, y);
    } else
      this.m_impulse = 0;
    this.m_bodyA.c_velocity.v.setVec2(i), this.m_bodyA.c_velocity.w = n, this.m_bodyB.c_velocity.v.setVec2(a), this.m_bodyB.c_velocity.w = c;
  }
  solveVelocityConstraints(t) {
    const e = this.m_bodyA.c_velocity.v;
    let s = this.m_bodyA.c_velocity.w;
    const i = this.m_bodyB.c_velocity.v;
    let n = this.m_bodyB.c_velocity.w;
    const o = p.addCrossNumVec2(e, s, this.m_rA), r = p.addCrossNumVec2(i, n, this.m_rB), a = this.m_length - this.m_maxLength;
    let c = p.dot(this.m_u, p.sub(r, o));
    a < 0 && (c += t.inv_dt * a);
    let l = -this.m_mass * c;
    const m = this.m_impulse;
    this.m_impulse = $l(0, this.m_impulse + l), l = this.m_impulse - m;
    const h = p.mulNumVec2(l, this.m_u);
    e.subMul(this.m_invMassA, h), s -= this.m_invIA * p.crossVec2Vec2(this.m_rA, h), i.addMul(this.m_invMassB, h), n += this.m_invIB * p.crossVec2Vec2(this.m_rB, h), this.m_bodyA.c_velocity.v = e, this.m_bodyA.c_velocity.w = s, this.m_bodyB.c_velocity.v = i, this.m_bodyB.c_velocity.w = n;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    const e = this.m_bodyA.c_position.c;
    let s = this.m_bodyA.c_position.a;
    const i = this.m_bodyB.c_position.c;
    let n = this.m_bodyB.c_position.a;
    const o = C.neo(s), r = C.neo(n), a = C.mulSub(o, this.m_localAnchorA, this.m_localCenterA), c = C.mulSub(r, this.m_localAnchorB, this.m_localCenterB), l = p.zero();
    l.addCombine(1, i, 1, c), l.subCombine(1, e, 1, a);
    const m = l.normalize();
    let h = m - this.m_maxLength;
    h = Qt(h, 0, O.maxLinearCorrection);
    const u = -this.m_mass * h, d = p.mulNumVec2(u, l);
    return e.subMul(this.m_invMassA, d), s -= this.m_invIA * p.crossVec2Vec2(a, d), i.addMul(this.m_invMassB, d), n += this.m_invIB * p.crossVec2Vec2(c, d), this.m_bodyA.c_position.c.setVec2(e), this.m_bodyA.c_position.a = s, this.m_bodyB.c_position.c.setVec2(i), this.m_bodyB.c_position.a = n, m - this.m_maxLength < O.linearSlop;
  }
}
const Ul = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, Gl = Math.abs, Xl = Math.PI, Kl = {
  frequencyHz: 0,
  dampingRatio: 0
};
class Us extends te {
  static TYPE = "weld-joint";
  /** @internal */
  m_type;
  /** @internal */
  m_localAnchorA;
  /** @internal */
  m_localAnchorB;
  /** @internal */
  m_referenceAngle;
  /** @internal */
  m_frequencyHz;
  /** @internal */
  m_dampingRatio;
  /** @internal */
  m_impulse;
  /** @internal */
  m_bias;
  /** @internal */
  m_gamma;
  // Solver temp
  /** @internal */
  m_rA;
  /** @internal */
  m_rB;
  /** @internal */
  m_localCenterA;
  /** @internal */
  m_localCenterB;
  /** @internal */
  m_invMassA;
  /** @internal */
  m_invMassB;
  /** @internal */
  m_invIA;
  /** @internal */
  m_invIB;
  /** @internal */
  m_mass;
  constructor(t, e, s, i) {
    if (Ul && !(this instanceof Us))
      return new Us(t, e, s, i);
    t = Ce(t, Kl), super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_type = Us.TYPE, this.m_localAnchorA = p.clone(i ? e.getLocalPoint(i) : t.localAnchorA || p.zero()), this.m_localAnchorB = p.clone(i ? s.getLocalPoint(i) : t.localAnchorB || p.zero()), this.m_referenceAngle = Number.isFinite(t.referenceAngle) ? t.referenceAngle : s.getAngle() - e.getAngle(), this.m_frequencyHz = t.frequencyHz, this.m_dampingRatio = t.dampingRatio, this.m_impulse = new ht(), this.m_bias = 0, this.m_gamma = 0, this.m_mass = new re();
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      frequencyHz: this.m_frequencyHz,
      dampingRatio: this.m_dampingRatio,
      localAnchorA: this.m_localAnchorA,
      localAnchorB: this.m_localAnchorB,
      referenceAngle: this.m_referenceAngle
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    return t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), new Us(t);
  }
  /** @hidden */
  _reset(t) {
    t.anchorA ? this.m_localAnchorA.setVec2(this.m_bodyA.getLocalPoint(t.anchorA)) : t.localAnchorA && this.m_localAnchorA.setVec2(t.localAnchorA), t.anchorB ? this.m_localAnchorB.setVec2(this.m_bodyB.getLocalPoint(t.anchorB)) : t.localAnchorB && this.m_localAnchorB.setVec2(t.localAnchorB), Number.isFinite(t.frequencyHz) && (this.m_frequencyHz = t.frequencyHz), Number.isFinite(t.dampingRatio) && (this.m_dampingRatio = t.dampingRatio);
  }
  /**
   * The local anchor point relative to bodyA's origin.
   */
  getLocalAnchorA() {
    return this.m_localAnchorA;
  }
  /**
   * The local anchor point relative to bodyB's origin.
   */
  getLocalAnchorB() {
    return this.m_localAnchorB;
  }
  /**
   * Get the reference angle.
   */
  getReferenceAngle() {
    return this.m_referenceAngle;
  }
  /**
   * Set frequency in Hz.
   */
  setFrequency(t) {
    this.m_frequencyHz = t;
  }
  /**
   * Get frequency in Hz.
   */
  getFrequency() {
    return this.m_frequencyHz;
  }
  /**
   * Set damping ratio.
   */
  setDampingRatio(t) {
    this.m_dampingRatio = t;
  }
  /**
   * Get damping ratio.
   */
  getDampingRatio() {
    return this.m_dampingRatio;
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  }
  /**
   * Get the reaction force on bodyB at the joint anchor in Newtons.
   */
  getReactionForce(t) {
    return p.neo(this.m_impulse.x, this.m_impulse.y).mul(t);
  }
  /**
   * Get the reaction torque on bodyB in N*m.
   */
  getReactionTorque(t) {
    return t * this.m_impulse.z;
  }
  initVelocityConstraints(t) {
    this.m_localCenterA = this.m_bodyA.m_sweep.localCenter, this.m_localCenterB = this.m_bodyB.m_sweep.localCenter, this.m_invMassA = this.m_bodyA.m_invMass, this.m_invMassB = this.m_bodyB.m_invMass, this.m_invIA = this.m_bodyA.m_invI, this.m_invIB = this.m_bodyB.m_invI;
    const e = this.m_bodyA.c_position.a, s = this.m_bodyA.c_velocity.v;
    let i = this.m_bodyA.c_velocity.w;
    const n = this.m_bodyB.c_position.a, o = this.m_bodyB.c_velocity.v;
    let r = this.m_bodyB.c_velocity.w;
    const a = C.neo(e), c = C.neo(n);
    this.m_rA = C.mulVec2(a, p.sub(this.m_localAnchorA, this.m_localCenterA)), this.m_rB = C.mulVec2(c, p.sub(this.m_localAnchorB, this.m_localCenterB));
    const l = this.m_invMassA, m = this.m_invMassB, h = this.m_invIA, u = this.m_invIB, d = new re();
    if (d.ex.x = l + m + this.m_rA.y * this.m_rA.y * h + this.m_rB.y * this.m_rB.y * u, d.ey.x = -this.m_rA.y * this.m_rA.x * h - this.m_rB.y * this.m_rB.x * u, d.ez.x = -this.m_rA.y * h - this.m_rB.y * u, d.ex.y = d.ey.x, d.ey.y = l + m + this.m_rA.x * this.m_rA.x * h + this.m_rB.x * this.m_rB.x * u, d.ez.y = this.m_rA.x * h + this.m_rB.x * u, d.ex.z = d.ez.x, d.ey.z = d.ez.y, d.ez.z = h + u, this.m_frequencyHz > 0) {
      d.getInverse22(this.m_mass);
      let f = h + u;
      const y = f > 0 ? 1 / f : 0, v = n - e - this.m_referenceAngle, g = 2 * Xl * this.m_frequencyHz, A = 2 * y * this.m_dampingRatio * g, b = y * g * g, B = t.dt;
      this.m_gamma = B * (A + B * b), this.m_gamma = this.m_gamma != 0 ? 1 / this.m_gamma : 0, this.m_bias = v * B * b * this.m_gamma, f += this.m_gamma, this.m_mass.ez.z = f != 0 ? 1 / f : 0;
    } else d.ez.z == 0 ? (d.getInverse22(this.m_mass), this.m_gamma = 0, this.m_bias = 0) : (d.getSymInverse33(this.m_mass), this.m_gamma = 0, this.m_bias = 0);
    if (t.warmStarting) {
      this.m_impulse.mul(t.dtRatio);
      const f = p.neo(this.m_impulse.x, this.m_impulse.y);
      s.subMul(l, f), i -= h * (p.crossVec2Vec2(this.m_rA, f) + this.m_impulse.z), o.addMul(m, f), r += u * (p.crossVec2Vec2(this.m_rB, f) + this.m_impulse.z);
    } else
      this.m_impulse.setZero();
    this.m_bodyA.c_velocity.v = s, this.m_bodyA.c_velocity.w = i, this.m_bodyB.c_velocity.v = o, this.m_bodyB.c_velocity.w = r;
  }
  solveVelocityConstraints(t) {
    const e = this.m_bodyA.c_velocity.v;
    let s = this.m_bodyA.c_velocity.w;
    const i = this.m_bodyB.c_velocity.v;
    let n = this.m_bodyB.c_velocity.w;
    const o = this.m_invMassA, r = this.m_invMassB, a = this.m_invIA, c = this.m_invIB;
    if (this.m_frequencyHz > 0) {
      const l = n - s, m = -this.m_mass.ez.z * (l + this.m_bias + this.m_gamma * this.m_impulse.z);
      this.m_impulse.z += m, s -= a * m, n += c * m;
      const h = p.zero();
      h.addCombine(1, i, 1, p.crossNumVec2(n, this.m_rB)), h.subCombine(1, e, 1, p.crossNumVec2(s, this.m_rA));
      const u = p.neg(re.mulVec2(this.m_mass, h));
      this.m_impulse.x += u.x, this.m_impulse.y += u.y;
      const d = p.clone(u);
      e.subMul(o, d), s -= a * p.crossVec2Vec2(this.m_rA, d), i.addMul(r, d), n += c * p.crossVec2Vec2(this.m_rB, d);
    } else {
      const l = p.zero();
      l.addCombine(1, i, 1, p.crossNumVec2(n, this.m_rB)), l.subCombine(1, e, 1, p.crossNumVec2(s, this.m_rA));
      const m = n - s, h = new ht(l.x, l.y, m), u = ht.neg(re.mulVec3(this.m_mass, h));
      this.m_impulse.add(u);
      const d = p.neo(u.x, u.y);
      e.subMul(o, d), s -= a * (p.crossVec2Vec2(this.m_rA, d) + u.z), i.addMul(r, d), n += c * (p.crossVec2Vec2(this.m_rB, d) + u.z);
    }
    this.m_bodyA.c_velocity.v = e, this.m_bodyA.c_velocity.w = s, this.m_bodyB.c_velocity.v = i, this.m_bodyB.c_velocity.w = n;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    const e = this.m_bodyA.c_position.c;
    let s = this.m_bodyA.c_position.a;
    const i = this.m_bodyB.c_position.c;
    let n = this.m_bodyB.c_position.a;
    const o = C.neo(s), r = C.neo(n), a = this.m_invMassA, c = this.m_invMassB, l = this.m_invIA, m = this.m_invIB, h = C.mulVec2(o, p.sub(this.m_localAnchorA, this.m_localCenterA)), u = C.mulVec2(r, p.sub(this.m_localAnchorB, this.m_localCenterB));
    let d, f;
    const y = new re();
    if (y.ex.x = a + c + h.y * h.y * l + u.y * u.y * m, y.ey.x = -h.y * h.x * l - u.y * u.x * m, y.ez.x = -h.y * l - u.y * m, y.ex.y = y.ey.x, y.ey.y = a + c + h.x * h.x * l + u.x * u.x * m, y.ez.y = h.x * l + u.x * m, y.ex.z = y.ez.x, y.ey.z = y.ez.y, y.ez.z = l + m, this.m_frequencyHz > 0) {
      const v = p.zero();
      v.addCombine(1, i, 1, u), v.subCombine(1, e, 1, h), d = v.length(), f = 0;
      const g = p.neg(y.solve22(v));
      e.subMul(a, g), s -= l * p.crossVec2Vec2(h, g), i.addMul(c, g), n += m * p.crossVec2Vec2(u, g);
    } else {
      const v = p.zero();
      v.addCombine(1, i, 1, u), v.subCombine(1, e, 1, h);
      const g = n - s - this.m_referenceAngle;
      d = v.length(), f = Gl(g);
      const A = new ht(v.x, v.y, g);
      let b = new ht();
      if (y.ez.z > 0)
        b = ht.neg(y.solve33(A));
      else {
        const w = p.neg(y.solve22(v));
        b.set(w.x, w.y, 0);
      }
      const B = p.neo(b.x, b.y);
      e.subMul(a, B), s -= l * (p.crossVec2Vec2(h, B) + b.z), i.addMul(c, B), n += m * (p.crossVec2Vec2(u, B) + b.z);
    }
    return this.m_bodyA.c_position.c = e, this.m_bodyA.c_position.a = s, this.m_bodyB.c_position.c = i, this.m_bodyB.c_position.a = n, d <= O.linearSlop && f <= O.angularSlop;
  }
}
const Zl = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY, Jl = Math.abs, Ql = Math.PI, th = {
  enableMotor: !1,
  maxMotorTorque: 0,
  motorSpeed: 0,
  frequencyHz: 2,
  dampingRatio: 0.7
};
class Gs extends te {
  static TYPE = "wheel-joint";
  /** @internal */
  m_type;
  /** @internal */
  m_localAnchorA;
  /** @internal */
  m_localAnchorB;
  /** @internal */
  m_localXAxisA;
  /** @internal */
  m_localYAxisA;
  /** @internal */
  m_mass;
  /** @internal */
  m_impulse;
  /** @internal */
  m_motorMass;
  /** @internal */
  m_motorImpulse;
  /** @internal */
  m_springMass;
  /** @internal */
  m_springImpulse;
  /** @internal */
  m_maxMotorTorque;
  /** @internal */
  m_motorSpeed;
  /** @internal */
  m_enableMotor;
  /** @internal */
  m_frequencyHz;
  /** @internal */
  m_dampingRatio;
  /** @internal */
  m_bias;
  /** @internal */
  m_gamma;
  // Solver temp
  /** @internal */
  m_localCenterA;
  /** @internal */
  m_localCenterB;
  /** @internal */
  m_invMassA;
  /** @internal */
  m_invMassB;
  /** @internal */
  m_invIA;
  /** @internal */
  m_invIB;
  /** @internal */
  m_ax;
  /** @internal */
  m_ay;
  /** @internal */
  m_sAx;
  /** @internal */
  m_sBx;
  /** @internal */
  m_sAy;
  /** @internal */
  m_sBy;
  constructor(t, e, s, i, n) {
    if (Zl && !(this instanceof Gs))
      return new Gs(t, e, s, i, n);
    t = Ce(t, th), super(t, e, s), e = this.m_bodyA, s = this.m_bodyB, this.m_ax = p.zero(), this.m_ay = p.zero(), this.m_type = Gs.TYPE, this.m_localAnchorA = p.clone(i ? e.getLocalPoint(i) : t.localAnchorA || p.zero()), this.m_localAnchorB = p.clone(i ? s.getLocalPoint(i) : t.localAnchorB || p.zero()), p.isValid(n) ? this.m_localXAxisA = e.getLocalVector(n) : p.isValid(t.localAxisA) ? this.m_localXAxisA = p.clone(t.localAxisA) : p.isValid(t.localAxis) ? this.m_localXAxisA = p.clone(t.localAxis) : this.m_localXAxisA = p.neo(1, 0), this.m_localYAxisA = p.crossNumVec2(1, this.m_localXAxisA), this.m_mass = 0, this.m_impulse = 0, this.m_motorMass = 0, this.m_motorImpulse = 0, this.m_springMass = 0, this.m_springImpulse = 0, this.m_maxMotorTorque = t.maxMotorTorque, this.m_motorSpeed = t.motorSpeed, this.m_enableMotor = t.enableMotor, this.m_frequencyHz = t.frequencyHz, this.m_dampingRatio = t.dampingRatio, this.m_bias = 0, this.m_gamma = 0;
  }
  /** @hidden */
  _serialize() {
    return {
      type: this.m_type,
      bodyA: this.m_bodyA,
      bodyB: this.m_bodyB,
      collideConnected: this.m_collideConnected,
      enableMotor: this.m_enableMotor,
      maxMotorTorque: this.m_maxMotorTorque,
      motorSpeed: this.m_motorSpeed,
      frequencyHz: this.m_frequencyHz,
      dampingRatio: this.m_dampingRatio,
      localAnchorA: this.m_localAnchorA,
      localAnchorB: this.m_localAnchorB,
      localAxisA: this.m_localXAxisA
    };
  }
  /** @hidden */
  static _deserialize(t, e, s) {
    return t = { ...t }, t.bodyA = s(ut, t.bodyA, e), t.bodyB = s(ut, t.bodyB, e), new Gs(t);
  }
  /** @hidden */
  _reset(t) {
    t.anchorA ? this.m_localAnchorA.setVec2(this.m_bodyA.getLocalPoint(t.anchorA)) : t.localAnchorA && this.m_localAnchorA.setVec2(t.localAnchorA), t.anchorB ? this.m_localAnchorB.setVec2(this.m_bodyB.getLocalPoint(t.anchorB)) : t.localAnchorB && this.m_localAnchorB.setVec2(t.localAnchorB), t.localAxisA && (this.m_localXAxisA.setVec2(t.localAxisA), this.m_localYAxisA.setVec2(p.crossNumVec2(1, t.localAxisA))), t.enableMotor !== void 0 && (this.m_enableMotor = t.enableMotor), Number.isFinite(t.maxMotorTorque) && (this.m_maxMotorTorque = t.maxMotorTorque), Number.isFinite(t.motorSpeed) && (this.m_motorSpeed = t.motorSpeed), Number.isFinite(t.frequencyHz) && (this.m_frequencyHz = t.frequencyHz), Number.isFinite(t.dampingRatio) && (this.m_dampingRatio = t.dampingRatio);
  }
  /**
   * The local anchor point relative to bodyA's origin.
   */
  getLocalAnchorA() {
    return this.m_localAnchorA;
  }
  /**
   * The local anchor point relative to bodyB's origin.
   */
  getLocalAnchorB() {
    return this.m_localAnchorB;
  }
  /**
   * The local joint axis relative to bodyA.
   */
  getLocalAxisA() {
    return this.m_localXAxisA;
  }
  /**
   * Get the current joint translation, usually in meters.
   */
  getJointTranslation() {
    const t = this.m_bodyA, e = this.m_bodyB, s = t.getWorldPoint(this.m_localAnchorA), i = e.getWorldPoint(this.m_localAnchorB), n = p.sub(i, s), o = t.getWorldVector(this.m_localXAxisA);
    return p.dot(n, o);
  }
  /**
   * Get the current joint translation speed, usually in meters per second.
   */
  getJointSpeed() {
    const t = this.m_bodyA.m_angularVelocity;
    return this.m_bodyB.m_angularVelocity - t;
  }
  /**
   * Is the joint motor enabled?
   */
  isMotorEnabled() {
    return this.m_enableMotor;
  }
  /**
   * Enable/disable the joint motor.
   */
  enableMotor(t) {
    t != this.m_enableMotor && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_enableMotor = t);
  }
  /**
   * Set the motor speed, usually in radians per second.
   */
  setMotorSpeed(t) {
    t != this.m_motorSpeed && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_motorSpeed = t);
  }
  /**
   * Get the motor speed, usually in radians per second.
   */
  getMotorSpeed() {
    return this.m_motorSpeed;
  }
  /**
   * Set/Get the maximum motor force, usually in N-m.
   */
  setMaxMotorTorque(t) {
    t != this.m_maxMotorTorque && (this.m_bodyA.setAwake(!0), this.m_bodyB.setAwake(!0), this.m_maxMotorTorque = t);
  }
  getMaxMotorTorque() {
    return this.m_maxMotorTorque;
  }
  /**
   * Get the current motor torque given the inverse time step, usually in N-m.
   */
  getMotorTorque(t) {
    return t * this.m_motorImpulse;
  }
  /**
   * Set/Get the spring frequency in hertz. Setting the frequency to zero disables
   * the spring.
   */
  setSpringFrequencyHz(t) {
    this.m_frequencyHz = t;
  }
  getSpringFrequencyHz() {
    return this.m_frequencyHz;
  }
  /**
   * Set/Get the spring damping ratio
   */
  setSpringDampingRatio(t) {
    this.m_dampingRatio = t;
  }
  getSpringDampingRatio() {
    return this.m_dampingRatio;
  }
  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  getAnchorA() {
    return this.m_bodyA.getWorldPoint(this.m_localAnchorA);
  }
  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  getAnchorB() {
    return this.m_bodyB.getWorldPoint(this.m_localAnchorB);
  }
  /**
   * Get the reaction force on bodyB at the joint anchor in Newtons.
   */
  getReactionForce(t) {
    return p.combine(this.m_impulse, this.m_ay, this.m_springImpulse, this.m_ax).mul(t);
  }
  /**
   * Get the reaction torque on bodyB in N*m.
   */
  getReactionTorque(t) {
    return t * this.m_motorImpulse;
  }
  initVelocityConstraints(t) {
    this.m_localCenterA = this.m_bodyA.m_sweep.localCenter, this.m_localCenterB = this.m_bodyB.m_sweep.localCenter, this.m_invMassA = this.m_bodyA.m_invMass, this.m_invMassB = this.m_bodyB.m_invMass, this.m_invIA = this.m_bodyA.m_invI, this.m_invIB = this.m_bodyB.m_invI;
    const e = this.m_invMassA, s = this.m_invMassB, i = this.m_invIA, n = this.m_invIB, o = this.m_bodyA.c_position.c, r = this.m_bodyA.c_position.a, a = this.m_bodyA.c_velocity.v;
    let c = this.m_bodyA.c_velocity.w;
    const l = this.m_bodyB.c_position.c, m = this.m_bodyB.c_position.a, h = this.m_bodyB.c_velocity.v;
    let u = this.m_bodyB.c_velocity.w;
    const d = C.neo(r), f = C.neo(m), y = C.mulVec2(d, p.sub(this.m_localAnchorA, this.m_localCenterA)), v = C.mulVec2(f, p.sub(this.m_localAnchorB, this.m_localCenterB)), g = p.zero();
    if (g.addCombine(1, l, 1, v), g.subCombine(1, o, 1, y), this.m_ay = C.mulVec2(d, this.m_localYAxisA), this.m_sAy = p.crossVec2Vec2(p.add(g, y), this.m_ay), this.m_sBy = p.crossVec2Vec2(v, this.m_ay), this.m_mass = e + s + i * this.m_sAy * this.m_sAy + n * this.m_sBy * this.m_sBy, this.m_mass > 0 && (this.m_mass = 1 / this.m_mass), this.m_springMass = 0, this.m_bias = 0, this.m_gamma = 0, this.m_frequencyHz > 0) {
      this.m_ax = C.mulVec2(d, this.m_localXAxisA), this.m_sAx = p.crossVec2Vec2(p.add(g, y), this.m_ax), this.m_sBx = p.crossVec2Vec2(v, this.m_ax);
      const A = e + s + i * this.m_sAx * this.m_sAx + n * this.m_sBx * this.m_sBx;
      if (A > 0) {
        this.m_springMass = 1 / A;
        const b = p.dot(g, this.m_ax), B = 2 * Ql * this.m_frequencyHz, w = 2 * this.m_springMass * this.m_dampingRatio * B, T = this.m_springMass * B * B, M = t.dt;
        this.m_gamma = M * (w + M * T), this.m_gamma > 0 && (this.m_gamma = 1 / this.m_gamma), this.m_bias = b * M * T * this.m_gamma, this.m_springMass = A + this.m_gamma, this.m_springMass > 0 && (this.m_springMass = 1 / this.m_springMass);
      }
    } else
      this.m_springImpulse = 0;
    if (this.m_enableMotor ? (this.m_motorMass = i + n, this.m_motorMass > 0 && (this.m_motorMass = 1 / this.m_motorMass)) : (this.m_motorMass = 0, this.m_motorImpulse = 0), t.warmStarting) {
      this.m_impulse *= t.dtRatio, this.m_springImpulse *= t.dtRatio, this.m_motorImpulse *= t.dtRatio;
      const A = p.combine(this.m_impulse, this.m_ay, this.m_springImpulse, this.m_ax), b = this.m_impulse * this.m_sAy + this.m_springImpulse * this.m_sAx + this.m_motorImpulse, B = this.m_impulse * this.m_sBy + this.m_springImpulse * this.m_sBx + this.m_motorImpulse;
      a.subMul(this.m_invMassA, A), c -= this.m_invIA * b, h.addMul(this.m_invMassB, A), u += this.m_invIB * B;
    } else
      this.m_impulse = 0, this.m_springImpulse = 0, this.m_motorImpulse = 0;
    this.m_bodyA.c_velocity.v.setVec2(a), this.m_bodyA.c_velocity.w = c, this.m_bodyB.c_velocity.v.setVec2(h), this.m_bodyB.c_velocity.w = u;
  }
  solveVelocityConstraints(t) {
    const e = this.m_invMassA, s = this.m_invMassB, i = this.m_invIA, n = this.m_invIB, o = this.m_bodyA.c_velocity.v;
    let r = this.m_bodyA.c_velocity.w;
    const a = this.m_bodyB.c_velocity.v;
    let c = this.m_bodyB.c_velocity.w;
    {
      const l = p.dot(this.m_ax, a) - p.dot(this.m_ax, o) + this.m_sBx * c - this.m_sAx * r, m = -this.m_springMass * (l + this.m_bias + this.m_gamma * this.m_springImpulse);
      this.m_springImpulse += m;
      const h = p.mulNumVec2(m, this.m_ax), u = m * this.m_sAx, d = m * this.m_sBx;
      o.subMul(e, h), r -= i * u, a.addMul(s, h), c += n * d;
    }
    {
      const l = c - r - this.m_motorSpeed;
      let m = -this.m_motorMass * l;
      const h = this.m_motorImpulse, u = t.dt * this.m_maxMotorTorque;
      this.m_motorImpulse = Qt(this.m_motorImpulse + m, -u, u), m = this.m_motorImpulse - h, r -= i * m, c += n * m;
    }
    {
      const l = p.dot(this.m_ay, a) - p.dot(this.m_ay, o) + this.m_sBy * c - this.m_sAy * r, m = -this.m_mass * l;
      this.m_impulse += m;
      const h = p.mulNumVec2(m, this.m_ay), u = m * this.m_sAy, d = m * this.m_sBy;
      o.subMul(e, h), r -= i * u, a.addMul(s, h), c += n * d;
    }
    this.m_bodyA.c_velocity.v.setVec2(o), this.m_bodyA.c_velocity.w = r, this.m_bodyB.c_velocity.v.setVec2(a), this.m_bodyB.c_velocity.w = c;
  }
  /**
   * This returns true if the position errors are within tolerance.
   */
  solvePositionConstraints(t) {
    const e = this.m_bodyA.c_position.c;
    let s = this.m_bodyA.c_position.a;
    const i = this.m_bodyB.c_position.c;
    let n = this.m_bodyB.c_position.a;
    const o = C.neo(s), r = C.neo(n), a = C.mulVec2(o, p.sub(this.m_localAnchorA, this.m_localCenterA)), c = C.mulVec2(r, p.sub(this.m_localAnchorB, this.m_localCenterB)), l = p.zero();
    l.addCombine(1, i, 1, c), l.subCombine(1, e, 1, a);
    const m = C.mulVec2(o, this.m_localYAxisA), h = p.crossVec2Vec2(p.add(l, a), m), u = p.crossVec2Vec2(c, m), d = p.dot(l, m), f = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_sAy * this.m_sAy + this.m_invIB * this.m_sBy * this.m_sBy, y = f != 0 ? -d / f : 0, v = p.mulNumVec2(y, m), g = y * h, A = y * u;
    return e.subMul(this.m_invMassA, v), s -= this.m_invIA * g, i.addMul(this.m_invMassB, v), n += this.m_invIB * A, this.m_bodyA.c_position.c.setVec2(e), this.m_bodyA.c_position.a = s, this.m_bodyB.c_position.c.setVec2(i), this.m_bodyB.c_position.a = n, Jl(d) <= O.linearSlop;
  }
}
let eh = 0;
const ma = {
  World: yn,
  Body: ut,
  Joint: te,
  Fixture: Ai,
  Shape: Js
}, ua = {
  Vec2: p,
  Vec3: ht,
  World: yn,
  Body: ut,
  Joint: te,
  Fixture: Ai,
  Shape: Js
}, sh = {
  [ut.STATIC]: ut,
  [ut.DYNAMIC]: ut,
  [ut.KINEMATIC]: ut,
  [ge.TYPE]: ge,
  // [BoxShape.TYPE]: BoxShape,
  [Et.TYPE]: Et,
  [Jt.TYPE]: Jt,
  [Wt.TYPE]: Wt,
  [Os.TYPE]: Os,
  [js.TYPE]: js,
  [Ds.TYPE]: Ds,
  [Ws.TYPE]: Ws,
  [Ys.TYPE]: Ys,
  [fs.TYPE]: fs,
  [$s.TYPE]: $s,
  [ce.TYPE]: ce,
  [Hs.TYPE]: Hs,
  [Us.TYPE]: Us,
  [Gs.TYPE]: Gs
}, ih = {
  rootClass: yn,
  preSerialize: function(_) {
    return _;
  },
  postSerialize: function(_, t) {
    return _;
  },
  preDeserialize: function(_) {
    return _;
  },
  postDeserialize: function(_, t) {
    return _;
  }
};
class yo {
  options;
  constructor(t) {
    this.options = {
      ...ih,
      ...t
    };
  }
  toJson = (t) => {
    const e = this.options.preSerialize, s = this.options.postSerialize, i = [], n = [t], o = {};
    function r(l, m) {
      if (l.__sid = l.__sid || ++eh, !o[l.__sid]) {
        n.push(l);
        const u = {
          refIndex: i.length + n.length,
          refType: m
        };
        o[l.__sid] = u;
      }
      return o[l.__sid];
    }
    function a(l) {
      l = e(l);
      let m = l._serialize();
      return m = s(m, l), m;
    }
    function c(l, m = !1) {
      if (typeof l != "object" || l === null)
        return l;
      if (typeof l._serialize == "function") {
        if (!m) {
          for (const h in ma)
            if (l instanceof ma[h])
              return r(l, h);
        }
        l = a(l);
      }
      if (Array.isArray(l)) {
        const h = [];
        for (let u = 0; u < l.length; u++)
          h[u] = c(l[u]);
        l = h;
      } else {
        const h = {};
        for (const u in l)
          l.hasOwnProperty(u) && (h[u] = c(l[u]));
        l = h;
      }
      return l;
    }
    for (; n.length; ) {
      const l = n.shift(), m = c(l, !0);
      i.push(m);
    }
    return i;
  };
  fromJson = (t) => {
    const e = this.options.preDeserialize, s = this.options.postDeserialize, i = this.options.rootClass, n = {};
    function o(c, l, m) {
      if ((!c || !c._deserialize) && (c = sh[l.type]), !(c && c._deserialize))
        return;
      l = e(l);
      const u = c._deserialize;
      let d = u(l, m, r);
      return d = s(d, l), d;
    }
    function r(c, l, m) {
      if (!(l.refIndex && l.refType))
        return o(c, l, m);
      const u = l;
      ua[u.refType] && (c = ua[u.refType]);
      const d = u.refIndex;
      if (!n[d]) {
        const f = t[d], y = o(c, f, m);
        n[d] = y;
      }
      return n[d];
    }
    return o(i, t[0], null);
  };
  static toJson;
  static fromJson;
}
const mc = new yo({
  rootClass: yn
});
yo.fromJson = mc.fromJson;
yo.toJson = mc.toJson;
class xo {
  /**
   * Mounts testbed. Call start with a world to start simulation and rendering.
   */
  static mount(t) {
    throw new Error("Not implemented");
  }
  /**
   * Mounts testbed if needed, then starts simulation and rendering.
   *
   * If you need to customize testbed before starting, first run `const testbed = Testbed.mount()` and then `testbed.start()`.
   */
  static start(t) {
    const e = xo.mount();
    return e.start(t), e;
  }
}
function nh(_, t) {
  let e, s;
  typeof _ == "function" ? (e = _, s = t) : typeof t == "function" ? (e = t, s = _) : s = _ ?? t;
  const i = xo.mount(s);
  if (e) {
    const n = e(i) || i.world;
    i.start(n);
  } else
    return i;
}
const oh = typeof CONSTRUCTOR_FACTORY > "u" ? !1 : CONSTRUCTOR_FACTORY;
class un extends Et {
  // note that box is serialized/deserialized as polygon
  static TYPE = "polygon";
  /**
   *
   * @param halfWidth
   * @param halfHeight
   * @param center coordinate of the center of the box relative to the body
   * @param angle angle of the box relative to the body
   */
  constructor(t, e, s, i) {
    if (oh && !(this instanceof un))
      return new un(t, e, s, i);
    super(), this._setAsBox(t, e, s, i);
  }
}
const da = typeof ASSERT > "u" ? !1 : ASSERT;
ss.addType(Wt.TYPE, Wt.TYPE, rh);
function rh(_, t, e, s, i, n, o) {
  da && console.assert(e.getType() == Wt.TYPE), da && console.assert(n.getType() == Wt.TYPE), uc(_, e.getShape(), t, n.getShape(), i);
}
const pa = I(0, 0), _a = I(0, 0), uc = function(_, t, e, s, i) {
  _.pointCount = 0, st(pa, e, t.m_p), st(_a, i, s.m_p);
  const n = gi(_a, pa), o = t.m_radius, r = s.m_radius, a = o + r;
  n > a * a || (_.type = Xt.e_circles, S(_.localPoint, t.m_p), K(_.localNormal), _.pointCount = 1, S(_.points[0].localPoint, s.m_p), _.points[0].id.setFeatures(0, ft.e_vertex, 0, ft.e_vertex));
}, dn = typeof ASSERT > "u" ? !1 : ASSERT;
ss.addType(Jt.TYPE, Wt.TYPE, ah);
ss.addType(ge.TYPE, Wt.TYPE, ch);
function ah(_, t, e, s, i, n, o) {
  dn && console.assert(e.getType() == Jt.TYPE), dn && console.assert(n.getType() == Wt.TYPE);
  const r = e.getShape(), a = n.getShape();
  Cr(_, r, t, a, i);
}
function ch(_, t, e, s, i, n, o) {
  dn && console.assert(e.getType() == ge.TYPE), dn && console.assert(n.getType() == Wt.TYPE);
  const r = e.getShape(), a = new Jt();
  r.getChildEdge(a, s);
  const c = a, l = n.getShape();
  Cr(_, c, t, l, i);
}
const ai = I(0, 0), $o = I(0, 0), Ho = I(0, 0), bs = I(0, 0), ci = I(0, 0), zi = I(0, 0), Cr = function(_, t, e, s, i) {
  _.pointCount = 0, ic(bs, i, e, s.m_p);
  const n = t.m_vertex1, o = t.m_vertex2;
  it(ai, o, n);
  const r = L(ai, o) - L(ai, bs), a = L(ai, bs) - L(ai, n), c = t.m_radius + s.m_radius;
  if (a <= 0) {
    if (S(ci, n), gi(bs, n) > c * c)
      return;
    if (t.m_hasVertex0) {
      const u = t.m_vertex0, d = n;
      if (it($o, d, u), L($o, d) - L($o, bs) > 0)
        return;
    }
    _.type = Xt.e_circles, K(_.localNormal), S(_.localPoint, ci), _.pointCount = 1, S(_.points[0].localPoint, s.m_p), _.points[0].id.setFeatures(0, ft.e_vertex, 0, ft.e_vertex);
    return;
  }
  if (r <= 0) {
    if (S(ci, o), gi(bs, ci) > c * c)
      return;
    if (t.m_hasVertex3) {
      const u = t.m_vertex3, d = o;
      if (it(Ho, u, d), L(Ho, bs) - L(Ho, d) > 0)
        return;
    }
    _.type = Xt.e_circles, K(_.localNormal), S(_.localPoint, ci), _.pointCount = 1, S(_.points[0].localPoint, s.m_p), _.points[0].id.setFeatures(1, ft.e_vertex, 0, ft.e_vertex);
    return;
  }
  const l = xi(ai);
  dn && console.assert(l > 0), Tt(ci, r / l, n, a / l, o), !(gi(bs, ci) > c * c) && (we(zi, 1, ai), L(zi, bs) - L(zi, n) < 0 && mn(zi), ts(zi), _.type = Xt.e_faceA, S(_.localNormal, zi), S(_.localPoint, n), _.pointCount = 1, S(_.points[0].localPoint, s.m_p), _.points[0].id.setFeatures(0, ft.e_face, 0, ft.e_vertex));
}, mr = typeof ASSERT > "u" ? !1 : ASSERT, Wn = [new Ae(), new Ae()], Yn = [new Ae(), new Ae()], li = [new Ae(), new Ae()], $n = I(0, 0), fa = I(0, 0), Uo = I(0, 0), Go = bi(0, 0, 0), hi = I(0, 0), Fi = I(0, 0), Hn = I(0, 0), ya = I(0, 0), xa = I(0, 0), Es = I(0, 0), Xo = I(0, 0), ga = I(0, 0);
ss.addType(Et.TYPE, Et.TYPE, lh);
function lh(_, t, e, s, i, n, o) {
  mr && console.assert(e.getType() == Et.TYPE), mr && console.assert(n.getType() == Et.TYPE), Tr(_, e.getShape(), t, n.getShape(), i);
}
function va(_, t, e, s, i) {
  const n = _.m_count, o = e.m_count, r = _.m_normals, a = _.m_vertices, c = e.m_vertices;
  nc(Go, s, t);
  let l = 0, m = -1 / 0;
  for (let h = 0; h < n; ++h) {
    ke(Uo, Go.q, r[h]), st(fa, Go, a[h]);
    let u = 1 / 0;
    for (let d = 0; d < o; ++d) {
      const f = L(Uo, c[d]) - L(Uo, fa);
      f < u && (u = f);
    }
    u > m && (m = u, l = h);
  }
  i.maxSeparation = m, i.bestIndex = l;
}
function hh(_, t, e, s, i, n) {
  const o = t.m_normals, r = i.m_count, a = i.m_vertices, c = i.m_normals;
  mr && console.assert(0 <= s && s < t.m_count), Dc(ga, n.q, e.q, o[s]);
  let l = 0, m = 1 / 0;
  for (let d = 0; d < r; ++d) {
    const f = L(ga, c[d]);
    f < m && (m = f, l = d);
  }
  const h = l, u = h + 1 < r ? h + 1 : 0;
  st(_[0].v, n, a[h]), _[0].id.setFeatures(s, ft.e_face, h, ft.e_vertex), st(_[1].v, n, a[u]), _[1].id.setFeatures(s, ft.e_face, u, ft.e_vertex);
}
const Ri = {
  maxSeparation: 0,
  bestIndex: 0
}, Tr = function(_, t, e, s, i) {
  _.pointCount = 0;
  const n = t.m_radius + s.m_radius;
  va(t, e, s, i, Ri);
  const o = Ri.bestIndex, r = Ri.maxSeparation;
  if (r > n) return;
  va(s, i, t, e, Ri);
  const a = Ri.bestIndex, c = Ri.maxSeparation;
  if (c > n) return;
  let l, m, h, u, d, f;
  const y = 0.1 * O.linearSlop;
  c > r + y ? (l = s, m = t, h = i, u = e, d = a, _.type = Xt.e_faceB, f = !0) : (l = t, m = s, h = e, u = i, d = o, _.type = Xt.e_faceA, f = !1), Wn[0].recycle(), Wn[1].recycle(), hh(Wn, l, h, d, m, u);
  const v = l.m_count, g = l.m_vertices, A = d, b = d + 1 < v ? d + 1 : 0;
  S(hi, g[A]), S(Fi, g[b]), it(Hn, Fi, hi), ts(Hn), yi(ya, Hn, 1), Tt(xa, 0.5, hi, 0.5, Fi), ke(Es, h.q, Hn), yi(Xo, Es, 1), st(hi, h, hi), st(Fi, h, Fi);
  const B = L(Xo, hi), w = -L(Es, hi) + n, T = L(Es, Fi) + n;
  if (Yn[0].recycle(), Yn[1].recycle(), li[0].recycle(), li[1].recycle(), Zt($n, -Es.x, -Es.y), Wi(Yn, Wn, $n, w, A) < 2 || (Zt($n, Es.x, Es.y), Wi(li, Yn, $n, T, b) < 2))
    return;
  S(_.localNormal, ya), S(_.localPoint, xa);
  let F = 0;
  for (let E = 0; E < li.length; ++E)
    if (L(Xo, li[E].v) - B <= n) {
      const V = _.points[F];
      yr(V.localPoint, u, li[E].v), V.id.set(li[E].id), f && V.id.swapFeatures(), ++F;
    }
  _.pointCount = F;
}, Aa = typeof ASSERT > "u" ? !1 : ASSERT;
ss.addType(Et.TYPE, Wt.TYPE, mh);
function mh(_, t, e, s, i, n, o) {
  Aa && console.assert(e.getType() == Et.TYPE), Aa && console.assert(n.getType() == Wt.TYPE), dc(_, e.getShape(), t, n.getShape(), i);
}
const He = I(0, 0), Ko = I(0, 0), dc = function(_, t, e, s, i) {
  _.pointCount = 0, ic(He, i, e, s.m_p);
  let n = 0, o = -1 / 0;
  const r = t.m_radius + s.m_radius, a = t.m_count, c = t.m_vertices, l = t.m_normals;
  for (let v = 0; v < a; ++v) {
    const g = L(l[v], He) - L(l[v], c[v]);
    if (g > r)
      return;
    g > o && (o = g, n = v);
  }
  const m = n, h = m + 1 < a ? m + 1 : 0, u = c[m], d = c[h];
  if (o < qt) {
    _.pointCount = 1, _.type = Xt.e_faceA, S(_.localNormal, l[n]), Tt(_.localPoint, 0.5, u, 0.5, d), S(_.points[0].localPoint, s.m_p), _.points[0].id.setFeatures(0, ft.e_vertex, 0, ft.e_vertex);
    return;
  }
  const f = L(He, d) - L(He, u) - L(u, d) + L(u, u), y = L(He, u) - L(He, d) - L(d, u) + L(d, d);
  if (f <= 0) {
    if (gi(He, u) > r * r)
      return;
    _.pointCount = 1, _.type = Xt.e_faceA, it(_.localNormal, He, u), ts(_.localNormal), S(_.localPoint, u), S(_.points[0].localPoint, s.m_p), _.points[0].id.setFeatures(0, ft.e_vertex, 0, ft.e_vertex);
  } else if (y <= 0) {
    if (gi(He, d) > r * r)
      return;
    _.pointCount = 1, _.type = Xt.e_faceA, it(_.localNormal, He, d), ts(_.localNormal), S(_.localPoint, d), S(_.points[0].localPoint, s.m_p), _.points[0].id.setFeatures(0, ft.e_vertex, 0, ft.e_vertex);
  } else {
    if (Tt(Ko, 0.5, u, 0.5, d), L(He, l[m]) - L(Ko, l[m]) > r)
      return;
    _.pointCount = 1, _.type = Xt.e_faceA, S(_.localNormal, l[m]), S(_.localPoint, Ko), S(_.points[0].localPoint, s.m_p), _.points[0].id.setFeatures(0, ft.e_vertex, 0, ft.e_vertex);
  }
}, lo = typeof ASSERT > "u" ? !1 : ASSERT, uh = Math.min;
ss.addType(Jt.TYPE, Et.TYPE, dh);
ss.addType(ge.TYPE, Et.TYPE, ph);
function dh(_, t, e, s, i, n, o) {
  lo && console.assert(e.getType() == Jt.TYPE), lo && console.assert(n.getType() == Et.TYPE), Mr(_, e.getShape(), t, n.getShape(), i);
}
const ba = new Jt();
function ph(_, t, e, s, i, n, o) {
  lo && console.assert(e.getType() == ge.TYPE), lo && console.assert(n.getType() == Et.TYPE), e.getShape().getChildEdge(ba, s), Mr(_, ba, t, n.getShape(), i);
}
class pc {
  type;
  index;
  separation;
}
class _h {
  vertices = [];
  // [Settings.maxPolygonVertices]
  normals = [];
  // [Settings.maxPolygonVertices];
  count = 0;
  constructor() {
    for (let t = 0; t < O.maxPolygonVertices; t++)
      this.vertices.push(I(0, 0)), this.normals.push(I(0, 0));
  }
}
class fh {
  i1;
  i2;
  v1 = I(0, 0);
  v2 = I(0, 0);
  normal = I(0, 0);
  sideNormal1 = I(0, 0);
  sideOffset1;
  sideNormal2 = I(0, 0);
  sideOffset2;
  recycle() {
    K(this.v1), K(this.v2), K(this.normal), K(this.sideNormal1), K(this.sideNormal2);
  }
}
const Un = [new Ae(), new Ae()], qs = [new Ae(), new Ae()], Ue = [new Ae(), new Ae()], rs = new pc(), he = new pc(), Ht = new _h(), ot = new fh(), Gn = I(0, 0), Qi = I(0, 0), Ei = I(0, 0), tn = I(0, 0), en = bi(0, 0, 0), yt = I(0, 0), as = I(0, 0), tt = I(0, 0), cs = I(0, 0), jt = I(0, 0), Dt = I(0, 0), Ba = I(0, 0), Ls = I(0, 0), Mr = function(_, t, e, s, i) {
  nc(en, e, i), st(Gn, en, s.m_centroid);
  const n = t.m_vertex0, o = t.m_vertex1, r = t.m_vertex2, a = t.m_vertex3, c = t.m_hasVertex0, l = t.m_hasVertex3;
  it(Ei, r, o), ts(Ei), Zt(tt, Ei.y, -Ei.x);
  const m = L(tt, Gn) - L(tt, o);
  let h = 0, u = 0, d = !1, f = !1;
  K(as), K(cs), c && (it(Qi, o, n), ts(Qi), Zt(as, Qi.y, -Qi.x), d = rt(Qi, Ei) >= 0, h = p.dot(as, Gn) - p.dot(as, n)), l && (it(tn, a, r), ts(tn), Zt(cs, tn.y, -tn.x), f = p.crossVec2Vec2(Ei, tn) > 0, u = p.dot(cs, Gn) - p.dot(cs, r));
  let y;
  K(yt), K(jt), K(Dt), c && l ? d && f ? (y = h >= 0 || m >= 0 || u >= 0, y ? (S(yt, tt), S(jt, as), S(Dt, cs)) : (Z(yt, -1, tt), Z(jt, -1, tt), Z(Dt, -1, tt))) : d ? (y = h >= 0 || m >= 0 && u >= 0, y ? (S(yt, tt), S(jt, as), S(Dt, tt)) : (Z(yt, -1, tt), Z(jt, -1, cs), Z(Dt, -1, tt))) : f ? (y = u >= 0 || h >= 0 && m >= 0, y ? (S(yt, tt), S(jt, tt), S(Dt, cs)) : (Z(yt, -1, tt), Z(jt, -1, tt), Z(Dt, -1, as))) : (y = h >= 0 && m >= 0 && u >= 0, y ? (S(yt, tt), S(jt, tt), S(Dt, tt)) : (Z(yt, -1, tt), Z(jt, -1, cs), Z(Dt, -1, as))) : c ? d ? (y = h >= 0 || m >= 0, y ? (S(yt, tt), S(jt, as), Z(Dt, -1, tt)) : (Z(yt, -1, tt), S(jt, tt), Z(Dt, -1, tt))) : (y = h >= 0 && m >= 0, y ? (S(yt, tt), S(jt, tt), Z(Dt, -1, tt)) : (Z(yt, -1, tt), S(jt, tt), Z(Dt, -1, as))) : l ? f ? (y = m >= 0 || u >= 0, y ? (S(yt, tt), Z(jt, -1, tt), S(Dt, cs)) : (Z(yt, -1, tt), Z(jt, -1, tt), S(Dt, tt))) : (y = m >= 0 && u >= 0, y ? (S(yt, tt), Z(jt, -1, tt), S(Dt, tt)) : (Z(yt, -1, tt), Z(jt, -1, cs), S(Dt, tt))) : (y = m >= 0, y ? (S(yt, tt), Z(jt, -1, tt), Z(Dt, -1, tt)) : (Z(yt, -1, tt), S(jt, tt), S(Dt, tt))), Ht.count = s.m_count;
  for (let M = 0; M < s.m_count; ++M)
    st(Ht.vertices[M], en, s.m_vertices[M]), ke(Ht.normals[M], en.q, s.m_normals[M]);
  const v = s.m_radius + t.m_radius;
  _.pointCount = 0;
  {
    rs.type = 1, rs.index = y ? 0 : 1, rs.separation = 1 / 0;
    for (let M = 0; M < Ht.count; ++M) {
      const q = Ht.vertices[M], F = L(yt, q) - L(yt, o);
      F < rs.separation && (rs.separation = F);
    }
  }
  if (rs.type == -1 || rs.separation > v)
    return;
  {
    he.type = -1, he.index = -1, he.separation = -1 / 0, Zt(Ba, -yt.y, yt.x);
    for (let M = 0; M < Ht.count; ++M) {
      Z(Ls, -1, Ht.normals[M]);
      const q = L(Ls, Ht.vertices[M]) - L(Ls, o), F = L(Ls, Ht.vertices[M]) - L(Ls, r), E = uh(q, F);
      if (E > v) {
        he.type = 2, he.index = M, he.separation = E;
        break;
      }
      if (L(Ls, Ba) >= 0) {
        if (L(Ls, yt) - L(Dt, yt) < -O.angularSlop)
          continue;
      } else if (L(Ls, yt) - L(jt, yt) < -O.angularSlop)
        continue;
      E > he.separation && (he.type = 2, he.index = M, he.separation = E);
    }
  }
  if (he.type != -1 && he.separation > v)
    return;
  const g = 0.98, A = 1e-3;
  let b;
  if (he.type == -1 ? b = rs : he.separation > g * rs.separation + A ? b = he : b = rs, Ue[0].recycle(), Ue[1].recycle(), b.type == 1) {
    _.type = Xt.e_faceA;
    let M = 0, q = L(yt, Ht.normals[0]);
    for (let D = 1; D < Ht.count; ++D) {
      const V = L(yt, Ht.normals[D]);
      V < q && (q = V, M = D);
    }
    const F = M, E = F + 1 < Ht.count ? F + 1 : 0;
    S(Ue[0].v, Ht.vertices[F]), Ue[0].id.setFeatures(0, ft.e_face, F, ft.e_vertex), S(Ue[1].v, Ht.vertices[E]), Ue[1].id.setFeatures(0, ft.e_face, E, ft.e_vertex), y ? (ot.i1 = 0, ot.i2 = 1, S(ot.v1, o), S(ot.v2, r), S(ot.normal, tt)) : (ot.i1 = 1, ot.i2 = 0, S(ot.v1, r), S(ot.v2, o), Z(ot.normal, -1, tt));
  } else
    _.type = Xt.e_faceB, S(Ue[0].v, o), Ue[0].id.setFeatures(0, ft.e_vertex, b.index, ft.e_face), S(Ue[1].v, r), Ue[1].id.setFeatures(0, ft.e_vertex, b.index, ft.e_face), ot.i1 = b.index, ot.i2 = ot.i1 + 1 < Ht.count ? ot.i1 + 1 : 0, S(ot.v1, Ht.vertices[ot.i1]), S(ot.v2, Ht.vertices[ot.i2]), S(ot.normal, Ht.normals[ot.i1]);
  if (Zt(ot.sideNormal1, ot.normal.y, -ot.normal.x), Zt(ot.sideNormal2, -ot.sideNormal1.x, -ot.sideNormal1.y), ot.sideOffset1 = L(ot.sideNormal1, ot.v1), ot.sideOffset2 = L(ot.sideNormal2, ot.v2), Un[0].recycle(), Un[1].recycle(), qs[0].recycle(), qs[1].recycle(), Wi(Un, Ue, ot.sideNormal1, ot.sideOffset1, ot.i1) < O.maxManifoldPoints || Wi(qs, Un, ot.sideNormal2, ot.sideOffset2, ot.i2) < O.maxManifoldPoints)
    return;
  b.type == 1 ? (S(_.localNormal, ot.normal), S(_.localPoint, ot.v1)) : (S(_.localNormal, s.m_normals[ot.i1]), S(_.localPoint, s.m_vertices[ot.i1]));
  let T = 0;
  for (let M = 0; M < O.maxManifoldPoints; ++M)
    if (L(ot.normal, qs[M].v) - L(ot.normal, ot.v1) <= v) {
      const F = _.points[T];
      b.type == 1 ? (yr(F.localPoint, en, qs[M].v), F.id.set(qs[M].id)) : (S(F.localPoint, qs[M].v), F.id.set(qs[M].id), F.id.swapFeatures()), ++T;
    }
  _.pointCount = T;
}, yh = {
  CollidePolygons: Tr,
  Settings: et,
  Sweep: Xs,
  Manifold: fo,
  Distance: Vs,
  TimeOfImpact: fn,
  DynamicTree: _r,
  stats: bt
};
class xh {
  /** @internal */
  _refMap = {};
  /** @internal */
  _listener;
  /** @internal */
  _key;
  constructor(t, e) {
    this._key = t, this._listener = e;
  }
  /** @internal */
  _map = {};
  // just for reuse
  /** @internal */
  _xmap = {};
  /** @internal */
  _data = [];
  /** @internal */
  _entered = [];
  /** @internal */
  _exited = [];
  update(t) {
    if (!Array.isArray(t)) throw "Invalid data: " + t;
    this._entered.length = 0, this._exited.length = 0, this._data.length = t.length;
    for (let s = 0; s < t.length; s++) {
      if (typeof t[s] != "object" || t[s] === null) continue;
      const i = t[s], n = this._key(i);
      this._map[n] ? delete this._map[n] : this._entered.push(i), this._data[s] = i, this._xmap[n] = i;
    }
    for (const s in this._map)
      this._exited.push(this._map[s]), delete this._map[s];
    const e = this._map;
    this._map = this._xmap, this._xmap = e;
    for (let s = 0; s < this._exited.length; s++) {
      const i = this._exited[s], n = this._key(i), o = this._refMap[n];
      this._listener.exit(i, o), delete this._refMap[n];
    }
    for (let s = 0; s < this._entered.length; s++) {
      const i = this._entered[s], n = this._key(i), o = this._listener.enter(i);
      o && (this._refMap[n] = o);
    }
    for (let s = 0; s < this._data.length; s++) {
      if (typeof t[s] != "object" || t[s] === null) continue;
      const i = this._data[s], n = this._key(i), o = this._refMap[n];
      this._listener.update(i, o);
    }
    this._entered.length = 0, this._exited.length = 0, this._data.length = 0;
  }
  ref(t) {
    return this._refMap[this._key(t)];
  }
}
const Up = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AABB: Ct,
  Body: ut,
  Box: un,
  BoxShape: un,
  BroadPhase: Qa,
  Chain: ge,
  ChainShape: ge,
  Circle: Wt,
  CircleShape: Wt,
  ClipVertex: Ae,
  CollideCircles: uc,
  CollideEdgeCircle: Cr,
  CollideEdgePolygon: Mr,
  CollidePolygonCircle: dc,
  CollidePolygons: Tr,
  Contact: ss,
  ContactEdge: ar,
  ContactFeatureType: ft,
  ContactID: wr,
  ContactImpulse: lc,
  DataDriver: xh,
  Distance: Vs,
  DistanceInput: mo,
  DistanceJoint: Os,
  DistanceOutput: uo,
  DistanceProxy: Ks,
  DynamicTree: _r,
  Edge: Jt,
  EdgeShape: Jt,
  Fixture: Ai,
  FixtureProxy: ir,
  FrictionJoint: js,
  GearJoint: Ds,
  Joint: te,
  JointEdge: nr,
  Manifold: fo,
  ManifoldPoint: rr,
  ManifoldType: Xt,
  Mat22: pt,
  Mat33: re,
  Math: Zs,
  MotorJoint: Ws,
  MouseJoint: Ys,
  PointState: Br,
  Polygon: Et,
  PolygonShape: Et,
  PrismaticJoint: fs,
  PulleyJoint: $s,
  RevoluteJoint: ce,
  RopeJoint: Hs,
  Rot: C,
  Serializer: yo,
  Settings: et,
  SettingsInternal: O,
  Shape: Js,
  ShapeCast: nl,
  ShapeCastInput: sl,
  ShapeCastOutput: il,
  SimplexCache: po,
  Solver: br,
  Sweep: Xs,
  TOIInput: gr,
  TOIOutput: Ar,
  TOIOutputState: vr,
  Testbed: xo,
  TimeOfImpact: fn,
  TimeStep: _o,
  Transform: le,
  TreeNode: Ja,
  Vec2: p,
  Vec3: ht,
  VelocityConstraintPoint: hr,
  WeldJoint: Us,
  WheelJoint: Gs,
  World: yn,
  WorldManifold: Sr,
  clipSegmentToLine: Wi,
  getPointStates: hc,
  internal: yh,
  mixFriction: cr,
  mixRestitution: lr,
  stats: bt,
  testOverlap: xr,
  testbed: nh
}, Symbol.toStringTag, { value: "Module" }));
class R {
  /**
   * Creates a new vector.
   * @method create
   * @param x
   * @param  y
   * @return  A new vector
   */
  static create(t, e) {
    return { x: t || 0, y: e || 0 };
  }
  /**
   * Returns a new vector with `x` and `y` copied from the given `vector`.
   * @method clone
   * @param vector
   * @return A new cloned vector
   */
  static clone(t) {
    return { x: t.x, y: t.y };
  }
  /**
   * Returns the magnitude (length) of a vector.
   * @method magnitude
   * @param vector
   * @return The magnitude of the vector
   */
  static magnitude(t) {
    return Math.sqrt(R.magnitudeSquared(t));
  }
  /**
   * Returns the magnitude (length) of a vector (therefore saving a `sqrt` operation).
   * @method magnitudeSquared
   * @param vector
   * @return The squared magnitude of the vector
   */
  static magnitudeSquared(t) {
    return t.x * t.x + t.y * t.y;
  }
  /**
   * Rotates the vector about (0, 0) by specified angle.
   * @method rotate
   * @param vector
   * @param angle
   * @param output
   * @return The vector rotated about (0, 0)
   */
  static rotate(t, e, s = R.create()) {
    const i = Math.cos(e), n = Math.sin(e), o = t.x * i - t.y * n;
    return s.y = t.x * n + t.y * i, s.x = o, s;
  }
  /**
   * Rotates the vector about a specified point by specified angle.
   * @method rotateAbout
   * @param vector
   * @param angle
   * @param point
   * @param output
   * @return A new vector rotated about the point
   */
  static rotateAbout(t, e, s, i = R.create()) {
    const n = Math.cos(e), o = Math.sin(e), r = s.x + ((t.x - s.x) * n - (t.y - s.y) * o);
    return i.y = s.y + ((t.x - s.x) * o + (t.y - s.y) * n), i.x = r, i;
  }
  /**
   * Normalises a vector (such that its magnitude is `1`).
   * @method normalise
   * @param vector
   * @return A new vector normalised
   */
  static normalise(t) {
    const e = R.magnitude(t);
    return e === 0 ? { x: 0, y: 0 } : { x: t.x / e, y: t.y / e };
  }
  /**
   * Returns the dot-product of two vectors.
   * @param vectorA
   * @param vectorB
   * @return The dot product of the two vectors
   */
  static dot(t, e) {
    return t.x * e.x + t.y * e.y;
  }
  /**
   * Returns the cross-product of two vectors.
   * @param vectorA
   * @param vectorB
   * @return The cross product of the two vectors
   */
  static cross(t, e) {
    return t.x * e.y - t.y * e.x;
  }
  /**
   * Returns the cross-product of three vectors.
   * @param vectorA
   * @param vectorB
   * @param vectorC
   * @return The cross product of the three vectors
   */
  static cross3(t, e, s) {
    return (e.x - t.x) * (s.y - t.y) - (e.y - t.y) * (s.x - t.x);
  }
  /**
   * Adds the two vectors.
   * @method add
   * @param vectorA
   * @param vectorB
   * @param output
   * @return A new vector of vectorA and vectorB added
   */
  static add(t, e, s = R.create()) {
    return s.x = t.x + e.x, s.y = t.y + e.y, s;
  }
  /**
   * Subtracts the two vectors.
   * @param vectorA
   * @param vectorB
   * @param output
   * @return A new vector of vectorA and vectorB subtracted
   */
  static sub(t, e, s = R.create()) {
    return s.x = t.x - e.x, s.y = t.y - e.y, s;
  }
  /**
   * Multiplies a vector and a scalar.
   * @method mult
   * @param vector
   * @param scalar
   * @return A new vector multiplied by scalar
   */
  static mult(t, e) {
    return { x: t.x * e, y: t.y * e };
  }
  /**
   * Divides a vector and a scalar.
   * @method div
   * @param vector
   * @param scalar
   * @return A new vector divided by scalar
   */
  static div(t, e) {
    return { x: t.x / e, y: t.y / e };
  }
  /**
   * Returns the perpendicular vector. Set `negate` to true for the perpendicular in the opposite direction.
   * @method perp
   * @param vector
   * @param negate
   * @return The perpendicular vector
   */
  static perp(t, e = !1) {
    const s = e ? -1 : 1;
    return { x: s * -t.y, y: s * t.x };
  }
  /**
   * Negates both components of a vector such that it points in the opposite direction.
   * @method neg
   * @param vector
   * @return The negated vector
   */
  static neg(t) {
    return { x: -t.x, y: -t.y };
  }
  /**
   * Returns the angle between the vector `vectorB - vectorA` and the x-axis in radians.
   * @method angle
   * @param vectorA
   * @param vectorB
   * @return The angle in radians
   */
  static angle(t, e) {
    return Math.atan2(e.y - t.y, e.x - t.x);
  }
  /**
   * Temporary vector pool (not thread-safe).
   */
  _temp = [
    R.create(),
    R.create(),
    R.create(),
    R.create(),
    R.create(),
    R.create()
  ];
}
const gh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: R
}, Symbol.toStringTag, { value: "Module" }));
class It {
  /**
   * Creates a new axis-aligned bounding box (AABB) for the given vertices.
   * @method create
   * @param vertices
   * @return A new bounds object
   */
  static create(t) {
    const e = {
      min: R.create(0, 0),
      max: R.create(0, 0)
    };
    return t && It.update(e, t), e;
  }
  /**
   * Updates bounds using the given vertices and extends the bounds given a velocity.
   * @method update
   * @param bounds
   * @param vertices
   * @param velocity
   */
  static update(t, e, s) {
    t.min.x = 1 / 0, t.max.x = -1 / 0, t.min.y = 1 / 0, t.max.y = -1 / 0;
    for (const i of e)
      i.x > t.max.x && (t.max.x = i.x), i.x < t.min.x && (t.min.x = i.x), i.y > t.max.y && (t.max.y = i.y), i.y < t.min.y && (t.min.y = i.y);
    s && (s.x > 0 ? t.max.x += s.x : t.min.x += s.x, s.y > 0 ? t.max.y += s.y : t.min.y += s.y);
  }
  /**
   * Returns true if the bounds contains the given point.
   * @method contains
   * @param bounds
   * @param point
   * @return True if the bounds contain the point, otherwise false
   */
  static contains(t, e) {
    return e.x >= t.min.x && e.x <= t.max.x && e.y >= t.min.y && e.y <= t.max.y;
  }
  /**
   * Returns true if the two bounds intersect.
   * @method overlaps
   * @param boundsA
   * @param boundsB
   * @return True if the bounds overlap, otherwise false
   */
  static overlaps(t, e) {
    return t.min.x <= e.max.x && t.max.x >= e.min.x && t.max.y >= e.min.y && t.min.y <= e.max.y;
  }
  /**
   * Translates the bounds by the given vector.
   * @method translate
   * @param bounds
   * @param vector
   */
  static translate(t, e) {
    t.min.x += e.x, t.max.x += e.x, t.min.y += e.y, t.max.y += e.y;
  }
  /**
   * Shifts the bounds to the given position.
   * @method shift
   * @param bounds
   * @param position
   */
  static shift(t, e) {
    const s = t.max.x - t.min.x, i = t.max.y - t.min.y;
    t.min.x = e.x, t.max.x = e.x + s, t.min.y = e.y, t.max.y = e.y + i;
  }
}
const vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: It
}, Symbol.toStringTag, { value: "Module" }));
class ks {
  /**
   * Creates a new set of axes from the given vertices.
   * @method fromVertices
   * @param vertices
   * @return A new axes from the given vertices
   */
  static fromVertices(t) {
    const e = {};
    for (let s = 0; s < t.length; s++) {
      const i = (s + 1) % t.length, n = R.normalise({
        x: t[i].y - t[s].y,
        y: t[s].x - t[i].x
      }), r = (n.y === 0 ? 1 / 0 : n.x / n.y).toFixed(3).toString();
      e[r] = n;
    }
    return Object.values(e);
  }
  /**
   * Rotates a set of axes by the given angle.
   * @method rotate
   * @param axes
   * @param angle
   */
  static rotate(t, e) {
    if (e === 0)
      return;
    const s = Math.cos(e), i = Math.sin(e);
    for (const n of t) {
      const o = n.x * s - n.y * i;
      n.y = n.x * i + n.y * s, n.x = o;
    }
  }
}
const Ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ks
}, Symbol.toStringTag, { value: "Module" }));
class P {
  static _baseDelta = 1e3 / 60;
  static _nextId = 0;
  static _seed = 0;
  static _nowStartTime = +/* @__PURE__ */ new Date();
  static _warnedOnce = {};
  static _decomp = null;
  /**
   * The console logging level to use, where each level includes all levels above and excludes the levels below.
   * The default level is 'debug' which shows all console messages.
   */
  static logLevel = 1;
  static nextId() {
    return P._nextId++;
  }
  /**
   * Returns the current timestamp since the time origin (e.g. from page load).
   * The result is in milliseconds and will use high-resolution timing if available.
   * @method now
   * @return the current timestamp in milliseconds
   */
  static now() {
    return typeof window < "u" && window.performance && window.performance.now ? window.performance.now() : Date.now ? Date.now() : +/* @__PURE__ */ new Date() - P._nowStartTime;
  }
  static random(t = 0, e = 1) {
    return t + P._seededRandom() * (e - t);
  }
  static _seededRandom() {
    return P._seed = (P._seed * 9301 + 49297) % 233280, P._seed / 233280;
  }
  static colorToNumber(t) {
    let e = t.replace("#", "");
    return e.length == 3 && (e = e.charAt(0) + e.charAt(0) + e.charAt(1) + e.charAt(1) + e.charAt(2) + e.charAt(2)), parseInt(e, 16);
  }
  /**
   * Returns the given value clamped between a minimum and maximum value.
   * @param value
   * @param min
   * @param max
   * @return The value clamped between min and max inclusive
   */
  static clamp(t, e, s) {
    return t < e ? e : t > s ? s : t;
  }
  /**
   * Returns the sign of the given value.
   * @method sign
   * @param value
   * @return -1 if negative, +1 if 0 or positive
   */
  static sign(t) {
    return t < 0 ? -1 : 1;
  }
  /**
   * Shuffles the given array in-place.
   * The function uses a seeded random generator.
   * @param array
   * @return array shuffled randomly
   */
  static shuffle(t) {
    for (let e = t.length - 1; e > 0; e--) {
      const s = Math.floor(P.random() * (e + 1)), i = t[e];
      t[e] = t[s], t[s] = i;
    }
    return t;
  }
  /**
   * Randomly chooses a value from a list with equal probability.
   * The function uses a seeded random generator.
   * @param choices
   * @return A random choice object from the array
   */
  static choose(t) {
    return t[Math.floor(P.random() * t.length)];
  }
  /**
   * Returns true if the object is an array.
   * @method isArray
   * @param obj
   * @return True if the object is an array, otherwise false
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isArray(t) {
    return Object.prototype.toString.call(t) === "[object Array]";
  }
  /**
   * Returns true if the object is an Object.
   * @method isObject
   * @param value
   * @return True if the object is an Object, otherwise false
   */
  static isObject(t) {
    return !!t && t.constructor === Object;
  }
  /**
   * Returns true if the object is a HTMLElement, otherwise false.
   * @method isElement
   * @param obj
   * @return True if the object is a HTMLElement, otherwise false
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isElement(t) {
    return typeof HTMLElement < "u" ? t instanceof HTMLElement : !!(t && t.nodeType && t.nodeName);
  }
  /**
   * Returns the list of keys for the given object.
   * @method keys
   * @param obj
   * @return keys
   */
  static keys(t) {
    if (Object.keys)
      return Object.keys(t);
    const e = [];
    for (const s in t)
      e.push(s);
    return e;
  }
  /**
   * Returns the list of values for the given object.
   * @method values
   * @param obj
   * @return Array of the objects property values
   */
  static values(t) {
    const e = [];
    if (Object.keys) {
      const s = Object.keys(t);
      for (let i = 0; i < s.length; i++)
        e.push(t[s[i]]);
      return e;
    }
    for (const s in t)
      e.push(t[s]);
    return e;
  }
  /**
   * Gets a value from `base` relative to the `path` string.
   * @param obj The base object
   * @param path The path relative to `base`, e.g. 'Foo.Bar.baz'
   * @param begin Path slice begin
   * @param end Path slice end
   * @return The object at the given path
   */
  static get(t, e, s, i) {
    const n = e.split(".").slice(s, i);
    for (const o of n)
      t = t[o];
    return t;
  }
  /**
   * Sets a value on `base` relative to the given `path` string.
   * @param obj The base object
   * @param path The path relative to `base`, e.g. 'Foo.Bar.baz'
   * @param val The value to set
   * @param begin Path slice begin
   * @param end Path slice end
   * @return Pass through `val` for chaining
   */
  static set(t, e, s, i, n) {
    const o = e.split(".").slice(i, n);
    return P.get(t, e, 0, -1)[o[o.length - 1]] = s, s;
  }
  static extend(t, e, ...s) {
    let i, n;
    if (typeof e == "boolean" ? (i = e, n = s) : (i = !0, n = e ? [e, ...s] : s), !i)
      return Object.assign(t, ...n);
    for (let o = 0; o < n.length; o++) {
      const r = n[o];
      if (r)
        for (const a in r) {
          const c = r[a];
          P.isObject(c) ? t[a] ? P.extend(t[a], i, c) : t[a] = { ...c } : t[a] = c;
        }
    }
    return t;
  }
  /**
   * Creates a new clone of the object, if deep is true references will also be cloned.
   * @param obj
   * @param deep
   * @return obj cloned
   */
  static clone(t, e) {
    return P.extend({}, e, t);
  }
  /**
   * Shows a `console.log` message only if the current `Common.logLevel` allows it.
   * The message will be prefixed with 'matter-ts' to make it easily identifiable.
   * @param params The objects to log.
   */
  static log(...t) {
    (P.logLevel === 1 || P.logLevel === 2 || P.logLevel === 3) && console.log.apply(console, ["matter-ts:"].concat(t));
  }
  /**
   * Shows a deprecated console warning when the function on the given object is called.
   * The target function will be replaced with a new function that first shows the warning
   * and then calls the original function.
   * @param obj The object or module
   * @param name The property name of the function on obj
   * @param warning The one-time message to show if the function is called
   */
  static deprecated(t, e, s) {
    t[e] = P.chain(() => {
      P.warnOnce("🔅 deprecated 🔅", s);
    }, t[e]);
  }
  /**
   * Shows a `console.info` message only if the current `Common.logLevel` allows it.
   * The message will be prefixed with 'matter-ts' to make it easily identifiable.
   * @param params The objects to log.
   */
  static info(...t) {
    (P.logLevel === 1 || P.logLevel === 2) && console.info.apply(console, ["matter-ts:"].concat(t));
  }
  /**
   * Shows a `console.warn` message only if the current `Common.logLevel` allows it.
   * The message will be prefixed with 'matter-js' to make it easily identifiable.
   * @param params The objects to log.
   */
  static warn(...t) {
    (P.logLevel === 1 || P.logLevel === 2 || P.logLevel === 3) && console.warn.apply(console, ["matter-ts:"].concat(t));
  }
  /**
   * Uses `Common.warn` to log the given message one time only.
   * @param params The objects to log.
   */
  static warnOnce(...t) {
    const e = t.join(" ");
    P._warnedOnce[e] || (P.warn(e), P._warnedOnce[e] = !0);
  }
  /**
   * Takes a directed graph and returns the partially ordered set of vertices in topological order.
   * Circular dependencies are allowed.
   * @param graph
   * @return Partially ordered set of vertices in topological order.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static topologicalSort(t) {
    const e = [], s = {}, i = {};
    for (const n in t)
      !s[n] && !i[n] && P._topologicalSort(n, s, i, t, e);
    return e;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static _topologicalSort(t, e, s, i, n) {
    const o = i[t] || [];
    s[t] = !0;
    for (const r of o)
      s[r] || e[r] || P._topologicalSort(r, e, s, i, n);
    s[t] = !1, e[t] = !0, n.push(t);
  }
  /**
   * Takes _n_ functions as arguments and returns a new function that calls them in order.
   * The arguments applied when calling the new function will also be applied to every function passed.
   * The value of `this` refers to the last value returned in the chain that was not `undefined`.
   * Therefore if a passed function does not return a value, the previously returned value is maintained.
   * After all passed functions have been called the new function returns the last returned value (if any).
   * If any of the passed functions are a chain, then the chain will be flattened.
   * @param params The functions to chain.
   * @return A new function that calls the passed functions in order.
   */
  static chain(...t) {
    const e = [];
    for (const i of t)
      "_chained" in i ? e.push.apply(e, i._chained) : e.push(i);
    const s = function(...i) {
      let n;
      for (let o = 0; o < e.length; o += 1) {
        const r = e[o].apply(n, i);
        typeof r < "u" && (n = r);
      }
      return n;
    };
    return s._chained = e, s;
  }
  /**
   * Chains a function to excute before the original function on the given `path` relative to `base`.
   * See also docs for `Common.chain`.
   * @param base The base object
   * @param path The path relative to `base`
   * @param func The function to chain before the original
   * @return The chained function that replaced the original
   */
  static chainPathBefore(t, e, s) {
    return P.set(
      t,
      e,
      P.chain(
        s,
        P.get(t, e)
      )
    );
  }
  /**
   * Chains a function to excute after the original function on the given `path` relative to `base`.
   * See also docs for `Common.chain`.
   * @param base The base object
   * @param path The path relative to `base`
   * @param func The function to chain after the original
   * @return The chained function that replaced the original
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static chainPathAfter(t, e, s) {
    return P.set(
      t,
      e,
      P.chain(
        P.get(t, e),
        s
      )
    );
  }
  /**
   * Provide the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module to enable
   * concave vertex decomposition support when using `Bodies.fromVertices` e.g. `Common.setDecomp(require('poly-decomp'))`.
   * @param decomp The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module.
   */
  static setDecomp(t) {
    P._decomp = t;
  }
  /**
   * Returns the [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module provided through `Common.setDecomp`,
   * otherwise returns the global `decomp` if set.
   * @return The [poly-decomp](https://github.com/schteppe/poly-decomp.js) library module if provided.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getDecomp() {
    let t = P._decomp;
    try {
      !t && typeof window < "u" && (t = window.decomp), !t && typeof global < "u" && (t = global.decomp);
    } catch {
      t = null;
    }
    return t;
  }
}
const bh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: P
}, Symbol.toStringTag, { value: "Module" }));
class Q {
  /**
   * Creates a new set of `Matter.Body` compatible vertices.
   * The `points` argument accepts an array of `Matter.Vector` points orientated around the origin `(0, 0)`, for example:
   *
   *     [{ x: 0, y: 0 }, { x: 25, y: 50 }, { x: 50, y: 0 }]
   *
   * The `Vertices.create` method returns a new array of vertices, which are similar to Matter.Vector objects,
   * but with some additional references required for efficient collision detection routines.
   *
   * Vertices must be specified in clockwise order.
   *
   * Note that the `body` argument is not optional, a `Matter.Body` reference must be provided.
   *
   * @method create
   * @param points
   * @param body
   */
  static create(t, e) {
    const s = [];
    for (let i = 0; i < t.length; i++) {
      const n = t[i], o = {
        x: n.x,
        y: n.y,
        index: i,
        body: e,
        isInternal: !1
      };
      s.push(o);
    }
    return s;
  }
  /**
   * Parses a string containing ordered x y pairs separated by spaces (and optionally commas),
   * into a `Matter.Vertices` object for the given `Matter.Body`.
   * For parsing SVG paths, see `Svg.pathToVertices`.
   * @method fromPath
   * @param path
   * @param body
   * @return vertices
   */
  static fromPath(t, e) {
    const s = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/gi, i = [];
    return t.replace(s, (n, o, r) => (i.push({ x: parseFloat(o), y: parseFloat(r) }), "")), Q.create(i, e);
  }
  /**
   * Returns the centre (centroid) of the set of vertices.
   * @method centre
   * @param vertices
   * @return The centre point
   */
  static centre(t) {
    const e = Q.area(t, !0);
    let s = R.create(0, 0);
    for (let i = 0; i < t.length; i++) {
      const n = (i + 1) % t.length, o = R.cross(t[i], t[n]), r = R.mult(R.add(t[i], t[n]), o);
      s = R.add(s, r);
    }
    return R.div(s, 6 * e);
  }
  /**
   * Returns the average (mean) of the set of vertices.
   * @method mean
   * @param vertices
   * @return The average point
   */
  static mean(t) {
    const e = R.create(0, 0);
    for (const s of t)
      e.x += s.x, e.y += s.y;
    return R.div(e, t.length);
  }
  /**
   * Returns the area of the set of vertices.
   * @method area
   * @param vertices
   * @param signed
   * @return The area
   */
  static area(t, e) {
    let s = 0, i = t.length - 1;
    for (let n = 0; n < t.length; n++)
      s += (t[i].x - t[n].x) * (t[i].y + t[n].y), i = n;
    return e ? s / 2 : Math.abs(s) / 2;
  }
  /**
   * Returns the moment of inertia (second moment of area) of the set of vertices given the total mass.
   * @method inertia
   * @param vertices
   * @param mass
   * @return  The polygon's moment of inertia
   */
  static inertia(t, e) {
    let s = 0, i = 0;
    for (let n = 0; n < t.length; n++) {
      const o = (n + 1) % t.length, r = Math.abs(R.cross(t[o], t[n]));
      s += r * (R.dot(t[o], t[o]) + R.dot(t[o], t[n]) + R.dot(t[n], t[n])), i += r;
    }
    return e / 6 * (s / i);
  }
  /**
   * Translates the set of vertices in-place.
   * @method translate
   * @param vertices
   * @param vector
   * @param scalar
   */
  static translate(t, e, s = 1) {
    const i = e.x * s, n = e.y * s;
    for (let o = 0; o < t.length; o++)
      t[o].x += i, t[o].y += n;
    return t;
  }
  /**
   * Rotates the set of vertices in-place.
   * @method rotate
   * @param vertices
   * @param angle
   * @param point
   */
  static rotate(t, e, s) {
    if (e === 0)
      return;
    const i = Math.cos(e), n = Math.sin(e);
    for (const o of t) {
      const r = o.x - s.x, a = o.y - s.y;
      o.x = s.x + (r * i - a * n), o.y = s.y + (r * n + a * i);
    }
    return t;
  }
  /**
   * Returns `true` if the `point` is inside the set of `vertices`.
   * @method contains
   * @param vertices
   * @param point
   * @return True if the vertices contains point, otherwise false
   */
  static contains(t, e) {
    let s = t[t.length - 1], i;
    for (let n = 0; n < t.length; n++) {
      if (i = t[n], (e.x - s.x) * (i.y - s.y) + (e.y - s.y) * (s.x - i.x) > 0)
        return !1;
      s = i;
    }
    return !0;
  }
  /**
   * Scales the vertices from a point (default is centre) in-place.
   * @method scale
   * @param vertices
   * @param scaleX
   * @param scaleY
   * @param point
   */
  static scale(t, e, s, i = Q.centre(t)) {
    if (e === 1 && s === 1)
      return t;
    for (let n = 0; n < t.length; n++) {
      const o = t[n], r = R.sub(o, i);
      t[n].x = i.x + r.x * e, t[n].y = i.y + r.y * s;
    }
    return t;
  }
  /**
   * Chamfers a set of vertices by giving them rounded corners, returns a new set of vertices.
   * The radius parameter is a single number or an array to specify the radius for each vertex.
   * @method chamfer
   * @param vertices
   * @param radius
   * @param quality
   * @param qualityMin
   * @param qualityMax
   */
  static chamfer(t, e = [8], s = -1, i = 2, n = 14) {
    typeof e == "number" && (e = [e]);
    const o = [];
    for (let r = 0; r < t.length; r++) {
      const a = t[r - 1 >= 0 ? r - 1 : t.length - 1], c = t[r], l = t[(r + 1) % t.length], m = e[r < e.length ? r : e.length - 1];
      if (m === 0) {
        o.push(c);
        continue;
      }
      const h = R.normalise({
        x: c.y - a.y,
        y: a.x - c.x
      }), u = R.normalise({
        x: l.y - c.y,
        y: c.x - l.x
      }), d = Math.sqrt(2 * Math.pow(m, 2)), f = R.mult(P.clone(h), m), y = R.normalise(
        R.mult(R.add(h, u), 0.5)
      ), v = R.sub(
        c,
        R.mult(y, d)
      );
      let g = s;
      s === -1 && (g = Math.pow(m, 0.32) * 1.75), g = P.clamp(g, i, n), g % 2 === 1 && (g += 1);
      const b = Math.acos(R.dot(h, u)) / g;
      for (let B = 0; B < g; B++)
        o.push({
          ...c,
          ...R.add(R.rotate(f, b * B), v)
        });
    }
    return o;
  }
  /**
   * Sorts the input vertices into clockwise order in place.
   * @method clockwiseSort
   * @param vertices
   * @return vertices
   */
  static clockwiseSort(t) {
    const e = Q.mean(t);
    return t.sort(function(s, i) {
      return R.angle(e, s) - R.angle(e, i);
    }), t;
  }
  /**
   * Returns true if the vertices form a convex shape (vertices must be in clockwise order).
   * @method isConvex
   * @param vertices
   * @return `true` if the `vertices` are convex, `false` if not (or `null` if not computable).
   */
  static isConvex(t) {
    let e = 0;
    if (t.length < 3)
      return null;
    for (let s = 0; s < t.length; s++) {
      const i = (s + 1) % t.length, n = (s + 2) % t.length;
      let o = (t[i].x - t[s].x) * (t[n].y - t[i].y);
      if (o -= (t[i].y - t[s].y) * (t[n].x - t[i].x), o < 0 ? e |= 1 : o > 0 && (e |= 2), e === 3)
        return !1;
    }
    return e !== 0 ? !0 : null;
  }
  /**
   * Returns the convex hull of the input vertices as a new array of points.
   * @method hull
   * @param vertices
   * @return vertices
   */
  static hull(t) {
    const e = [], s = [];
    t = t.slice(0), t.sort((i, n) => {
      const o = i.x - n.x;
      return o !== 0 ? o : i.y - n.y;
    });
    for (const i of t) {
      for (; s.length >= 2 && R.cross3(
        s[s.length - 2],
        s[s.length - 1],
        i
      ) <= 0; )
        s.pop();
      s.push(i);
    }
    for (const i of t) {
      for (; e.length >= 2 && R.cross3(
        e[e.length - 2],
        e[e.length - 1],
        i
      ) <= 0; )
        e.pop();
      e.push(i);
    }
    return e.pop(), s.pop(), e.concat(s);
  }
}
const Bh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Q
}, Symbol.toStringTag, { value: "Module" }));
class gt {
  static on(t, e, s) {
    const i = e.split(" ");
    for (const n of i)
      t.events = t.events || {}, t.events[n] = t.events[n] || [], t.events[n].push(s);
    return s;
  }
  static off(t, e, s) {
    if (!e) {
      t.events = {};
      return;
    }
    let i;
    typeof e == "function" ? (s = e, i = P.keys(t.events)) : i = e.split(" ");
    for (let n = 0; n < i.length; n++) {
      const o = t.events[i[n]], r = [];
      if (s && o)
        for (let a = 0; a < o.length; a++)
          o[a] !== s && r.push(o[a]);
      t.events[i[n]] = r;
    }
  }
  static trigger(t, e, s = {}) {
    const i = t.events;
    if (i && P.keys(i).length > 0) {
      const n = e.split(" ");
      for (const o of n) {
        const r = i[o];
        if (r) {
          const a = P.clone(s, !1);
          a.name = o, a.source = t;
          for (let c = 0; c < r.length; c++)
            r[c].apply(t, [a]);
        }
      }
    }
  }
}
const wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gt
}, Symbol.toStringTag, { value: "Module" }));
class ae {
  static _motionWakeThreshold = 0.18;
  static _motionSleepThreshold = 0.08;
  static _minBias = 0.9;
  /**
   * Puts bodies to sleep or wakes them up depending on their motion.
   * @method update
   * @param bodies
   * @param delta
   */
  static update(t, e) {
    const s = e / P._baseDelta, i = ae._motionSleepThreshold;
    for (const n of t) {
      const o = Vt.getSpeed(n), r = Vt.getAngularSpeed(n), a = o * o + r * r;
      if (n.force.x !== 0 || n.force.y !== 0) {
        ae.set(n, !1);
        continue;
      }
      const c = Math.min(n.motion, a), l = Math.max(n.motion, a);
      n.motion = ae._minBias * c + (1 - ae._minBias) * l, n.sleepThreshold > 0 && n.motion < i ? (n.sleepCounter += 1, n.sleepCounter >= n.sleepThreshold / s && ae.set(n, !0)) : n.sleepCounter > 0 && (n.sleepCounter -= 1);
    }
  }
  /**
   * Given a set of colliding pairs, wakes the sleeping bodies involved.
   * @method afterCollisions
   * @param pairs
   */
  static afterCollisions(t) {
    const e = ae._motionSleepThreshold;
    for (const s of t) {
      if (!s.isActive)
        continue;
      const i = s.collision, n = i.bodyA.parent, o = i.bodyB.parent;
      if (!(n.isSleeping && o.isSleeping || n.isStatic || o.isStatic) && (n.isSleeping || o.isSleeping)) {
        const r = n.isSleeping && !n.isStatic ? n : o, a = r === n ? o : n;
        !r.isStatic && a.motion > e && ae.set(r, !1);
      }
    }
  }
  /**
   * Set a body as sleeping or awake.
   * @method set
   * @param body
   * @param isSleeping
   */
  static set(t, e) {
    const s = t.isSleeping;
    e ? (t.isSleeping = !0, t.sleepCounter = t.sleepThreshold, t.positionImpulse.x = 0, t.positionImpulse.y = 0, t.positionPrev.x = t.position.x, t.positionPrev.y = t.position.y, t.anglePrev = t.angle, t.speed = 0, t.angularSpeed = 0, t.motion = 0, s || gt.trigger(t, "sleepStart")) : (t.isSleeping = !1, t.sleepCounter = 0, s && gt.trigger(t, "sleepEnd"));
  }
}
const Sh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ae
}, Symbol.toStringTag, { value: "Module" }));
let Vt = class U {
  static _timeCorrection = !0;
  static _inertiaScale = 4;
  static _nextCollidingGroupId = 1;
  static _nextNonCollidingGroupId = -1;
  static _nextCategory = 1;
  static _baseDelta = 1e3 / 60;
  /**
   * Creates a new rigid body model. The options parameter is an object that specifies any properties you wish to override the defaults.
   * All properties have default values, and many are pre-calculated automatically based on other properties.
   * Vertices must be specified in clockwise order.
   * See the properties section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param options
   * @return body
   */
  static create(t = {}) {
    const e = {
      id: P.nextId(),
      type: "body",
      label: "Body",
      parts: [],
      plugin: {},
      angle: 0,
      vertices: Q.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),
      position: { x: 0, y: 0 },
      force: { x: 0, y: 0 },
      torque: 0,
      positionImpulse: { x: 0, y: 0 },
      constraintImpulse: { x: 0, y: 0, angle: 0 },
      totalContacts: 0,
      speed: 0,
      angularSpeed: 0,
      velocity: { x: 0, y: 0 },
      angularVelocity: 0,
      isSensor: !1,
      isStatic: !1,
      isSleeping: !1,
      sleepCounter: 0,
      motion: 0,
      sleepThreshold: 60,
      density: 1e-3,
      restitution: 0,
      friction: 0.1,
      frictionStatic: 0.5,
      frictionAir: 0.01,
      collisionFilter: {
        category: 1,
        mask: 4294967295,
        group: 0
      },
      slop: 0.05,
      timeScale: 1,
      render: {
        visible: !0,
        opacity: 1
      },
      events: {},
      circleRadius: 0,
      anglePrev: 0,
      area: 0,
      mass: 0,
      inertia: 0,
      deltaTime: 16.666666666666668,
      _original: null
    }, s = P.extend(e, t);
    return U._initProperties(s, t), s;
  }
  /**
   * Initialises body properties.
   * @method _initProperties
   * @param body
   * @param options
   */
  static _initProperties(t, e = {}) {
    U.set(t, {
      bounds: t.bounds || It.create(t.vertices),
      positionPrev: t.positionPrev || R.clone(t.position),
      anglePrev: t.anglePrev || t.angle,
      vertices: t.vertices,
      parts: t.parts || [t],
      isStatic: t.isStatic,
      isSleeping: t.isSleeping,
      parent: t.parent || t
    }), Q.rotate(t.vertices, t.angle, t.position), ks.rotate(t.axes, t.angle), It.update(t.bounds, t.vertices, t.velocity), U.set(t, {
      axes: e.axes || t.axes,
      area: e.area || t.area,
      mass: e.mass || t.mass,
      inertia: e.inertia || t.inertia
    });
    const s = t.render, i = t.isStatic ? "#14151f" : P.choose(["#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1"]), n = t.isStatic ? "#555" : "#ccc", o = t.isStatic && t.render.fillStyle === null ? 1 : 0;
    s.fillStyle = t.render.fillStyle || i, s.strokeStyle = t.render.strokeStyle || n, s.lineWidth = t.render.lineWidth || o, U.isSpriteRender(s) && (s.sprite.xScale = s.sprite.xScale || 1, s.sprite.yScale = s.sprite.yScale || 1, s.sprite.xOffset = s.sprite.xOffset || 0, s.sprite.yOffset = s.sprite.yOffset || 0, s.sprite.xOffset += -(t.bounds.min.x - t.position.x) / (t.bounds.max.x - t.bounds.min.x), s.sprite.yOffset += -(t.bounds.min.y - t.position.y) / (t.bounds.max.y - t.bounds.min.y)), U.isTextRender(s) && s.text.content && (s.text.font = s.text.font || "Arial", s.text.align = s.text.align || "center", s.text.color = s.text.color || "#000000", s.text.size = s.text.size || 16, s.text.isBold = s.text.isBold || !1, s.text.isStroke = s.text.isStroke || !1, s.text.paddingX = s.text.paddingX || 0, s.text.paddingY = s.text.paddingY || 0), t.render = s;
  }
  /**
   * Returns the next unique group index for which bodies will collide.
   * If `isNonColliding` is `true`, returns the next unique group index for which bodies will _not_ collide.
   * See `body.collisionFilter` for more information.
   * @method nextGroup
   * @param isNonColliding
   * @return Unique group index
   */
  static nextGroup(t = !1) {
    return t ? U._nextNonCollidingGroupId-- : U._nextCollidingGroupId++;
  }
  /**
   * Returns the next unique category bitfield (starting after the initial default category `0x0001`).
   * There are 32 available. See `body.collisionFilter` for more information.
   * @method nextCategory
   * @return Unique category bitfield
   */
  static nextCategory() {
    return U._nextCategory = U._nextCategory << 1, U._nextCategory;
  }
  static set(t, e, s) {
    if (typeof e == "string") {
      if (!s) {
        P.warn("Body.set() need 3 arguments");
        return;
      }
      U._setByKey(t, e, s);
      return;
    }
    for (const i in e) {
      if (!e.hasOwnProperty(i))
        continue;
      const n = e[i];
      U._setByKey(t, i, n);
    }
  }
  static _setByKey(t, e, s) {
    switch (e) {
      case "isStatic":
        U.setStatic(t, s);
        break;
      case "isSleeping":
        ae.set(t, s);
        break;
      case "mass":
        U.setMass(t, s);
        break;
      case "density":
        U.setDensity(t, s);
        break;
      case "inertia":
        U.setInertia(t, s);
        break;
      case "vertices":
        U.setVertices(t, s);
        break;
      case "position":
        U.setPosition(t, s);
        break;
      case "angle":
        U.setAngle(t, s);
        break;
      case "velocity":
        U.setVelocity(t, s);
        break;
      case "angularVelocity":
        U.setAngularVelocity(t, s);
        break;
      case "speed":
        U.setSpeed(t, s);
        break;
      case "angularSpeed":
        U.setAngularSpeed(t, s);
        break;
      case "parts":
        U.setParts(t, s);
        break;
      case "centre":
        U.setCentre(t, s);
        break;
      default:
        t[e] = s;
    }
  }
  /**
   * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
   * @method setStatic
   * @param body
   * @param isStatic
   */
  static setStatic(t, e) {
    for (const s of t.parts)
      e ? (s.isStatic || (s._original = {
        restitution: s.restitution,
        friction: s.friction,
        mass: s.mass,
        inertia: s.inertia,
        density: s.density,
        inverseMass: s.inverseMass,
        inverseInertia: s.inverseInertia
      }), s.restitution = 0, s.friction = 1, s.mass = s.inertia = s.density = 1 / 0, s.inverseMass = s.inverseInertia = 0, s.positionPrev.x = s.position.x, s.positionPrev.y = s.position.y, s.anglePrev = s.angle, s.angularVelocity = 0, s.speed = 0, s.angularSpeed = 0, s.motion = 0) : s._original && (s.restitution = s._original.restitution, s.friction = s._original.friction, s.mass = s._original.mass, s.inertia = s._original.inertia, s.density = s._original.density, s.inverseMass = s._original.inverseMass, s.inverseInertia = s._original.inverseInertia, s._original = null), s.isStatic = e;
  }
  /**
   * Sets the mass of the body. Inverse mass, density and inertia are automatically updated to reflect the change.
   * @method setMass
   * @param body
   * @param mass
   */
  static setMass(t, e) {
    const s = t.inertia / (t.mass / 6);
    t.inertia = s * (e / 6), t.inverseInertia = 1 / t.inertia, t.mass = e, t.inverseMass = 1 / t.mass, t.density = t.mass / t.area;
  }
  /**
   * Sets the density of the body. Mass and inertia are automatically updated to reflect the change.
   * @method setDensity
   * @param body
   * @param density
   */
  static setDensity(t, e) {
    U.setMass(t, e * t.area), t.density = e;
  }
  /**
   * Sets the moment of inertia of the body. This is the second moment of area in two dimensions.
   * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
   * @method setInertia
   * @param body
   * @param inertia
   */
  static setInertia(t, e) {
    t.inertia = e, t.inverseInertia = 1 / t.inertia;
  }
  /**
   * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
   * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
   * They are then automatically translated to world space based on `body.position`.
   *
   * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
   * Vertices must form a convex hull. Concave vertices must be decomposed into convex parts.
   *
   * @method setVertices
   * @param body
   * @param vertices
   */
  static setVertices(t, e) {
    e[0].body === t ? t.vertices = e : t.vertices = Q.create(e, t), t.axes = ks.fromVertices(t.vertices), t.area = Q.area(t.vertices), U.setMass(t, t.density * t.area);
    const s = Q.centre(t.vertices);
    Q.translate(t.vertices, s, -1), U.setInertia(
      t,
      U._inertiaScale * Q.inertia(t.vertices, t.mass)
    ), Q.translate(t.vertices, t.position), It.update(t.bounds, t.vertices, t.velocity);
  }
  /**
   * Sets the parts of the `body`.
   *
   * See `body.parts` for details and requirements on how parts are used.
   *
   * See Bodies.fromVertices for a related utility.
   *
   * This function updates `body` mass, inertia and centroid based on the parts geometry.
   * Sets each `part.parent` to be this `body`.
   *
   * The convex hull is computed and set on this `body` (unless `autoHull` is `false`).
   * Automatically ensures that the first part in `body.parts` is the `body`.
   * @method setParts
   * @param body
   * @param parts
   * @param autoHull
   */
  static setParts(t, e, s = !0) {
    e = e.slice(0), t.parts.length = 0, t.parts.push(t), t.parent = t;
    for (const n of e)
      n !== t && (n.parent = t, t.parts.push(n));
    if (t.parts.length === 1)
      return;
    if (s) {
      let n = [];
      for (const a of e)
        n = n.concat(a.vertices);
      Q.clockwiseSort(n);
      const o = Q.hull(n), r = Q.centre(o);
      U.setVertices(t, o), Q.translate(t.vertices, r);
    }
    const i = U._totalProperties(t);
    t.area = i.area, t.parent = t, t.position.x = i.centre.x, t.position.y = i.centre.y, t.positionPrev.x = i.centre.x, t.positionPrev.y = i.centre.y, U.setMass(t, i.mass), U.setInertia(t, i.inertia), U.setPosition(t, i.centre);
  }
  /**
   * Set the centre of mass of the body.
   * The `centre` is a vector in world-space unless `relative` is set, in which case it is a translation.
   * The centre of mass is the point the body rotates about and can be used to simulate non-uniform density.
   * This is equal to moving `body.position` but not the `body.vertices`.
   * Invalid if the `centre` falls outside the body's convex hull.
   * @method setCentre
   * @param body
   * @param centre
   * @param relative
   */
  static setCentre(t, e, s) {
    s ? (t.positionPrev.x += e.x, t.positionPrev.y += e.y, t.position.x += e.x, t.position.y += e.y) : (t.positionPrev.x = e.x - (t.position.x - t.positionPrev.x), t.positionPrev.y = e.y - (t.position.y - t.positionPrev.y), t.position.x = e.x, t.position.y = e.y);
  }
  /**
   * Sets the position of the body. By default velocity is unchanged.
   * If `updateVelocity` is `true` then velocity is inferred from the change in position.
   * @method setPosition
   * @param body
   * @param position
   * @param updateVelocity
   */
  static setPosition(t, e, s = !1) {
    const i = R.sub(e, t.position);
    s ? (t.positionPrev.x = t.position.x, t.positionPrev.y = t.position.y, t.velocity.x = i.x, t.velocity.y = i.y, t.speed = R.magnitude(i)) : (t.positionPrev.x += i.x, t.positionPrev.y += i.y);
    for (const n of t.parts)
      n.position.x += i.x, n.position.y += i.y, Q.translate(n.vertices, i), It.update(n.bounds, n.vertices, t.velocity);
  }
  /**
   * Sets the angle of the body. By default angular velocity is unchanged.
   * If `updateVelocity` is `true` then angular velocity is inferred from the change in angle.
   * @method setAngle
   * @param body
   * @param angle
   * @param updateVelocity
   */
  static setAngle(t, e, s = !1) {
    const i = e - t.angle;
    s ? (t.anglePrev = t.angle, t.angularVelocity = i, t.angularSpeed = Math.abs(i)) : t.anglePrev += i;
    for (let n = 0; n < t.parts.length; n++) {
      const o = t.parts[n];
      o.angle += i, Q.rotate(o.vertices, i, t.position), ks.rotate(o.axes, i), It.update(o.bounds, o.vertices, t.velocity), n > 0 && R.rotateAbout(o.position, i, t.position, o.position);
    }
  }
  /**
   * Sets the current linear velocity of the body.
   * Affects body speed.
   * @method setVelocity
   * @param body
   * @param velocity
   */
  static setVelocity(t, e) {
    const s = t.deltaTime / U._baseDelta;
    t.positionPrev.x = t.position.x - e.x * s, t.positionPrev.y = t.position.y - e.y * s, t.velocity.x = (t.position.x - t.positionPrev.x) / s, t.velocity.y = (t.position.y - t.positionPrev.y) / s, t.speed = R.magnitude(t.velocity);
  }
  /**
   * Gets the current linear velocity of the body.
   * @method getVelocity
   * @param body
   * @return velocity
   */
  static getVelocity(t) {
    const e = U._baseDelta / t.deltaTime;
    return {
      x: (t.position.x - t.positionPrev.x) * e,
      y: (t.position.y - t.positionPrev.y) * e
    };
  }
  /**
   * Gets the current linear speed of the body.
   * Equivalent to the magnitude of its velocity.
   * @method getSpeed
   * @param body
   * @return speed
   */
  static getSpeed(t) {
    return R.magnitude(U.getVelocity(t));
  }
  /**
   * Sets the current linear speed of the body.
   * Direction is maintained. Affects body velocity.
   * @method setSpeed
   * @param body
   * @param speed
   */
  static setSpeed(t, e) {
    U.setVelocity(
      t,
      R.mult(R.normalise(U.getVelocity(t)), e)
    );
  }
  /**
   * Sets the current rotational velocity of the body.
   * Affects body angular speed.
   * @method setAngularVelocity
   * @param body
   * @param velocity
   */
  static setAngularVelocity(t, e) {
    const s = t.deltaTime / U._baseDelta;
    t.anglePrev = t.angle - e * s, t.angularVelocity = (t.angle - t.anglePrev) / s, t.angularSpeed = Math.abs(t.angularVelocity);
  }
  /**
   * Gets the current rotational velocity of the body.
   * @method getAngularVelocity
   * @param body
   * @return angular velocity
   */
  static getAngularVelocity(t) {
    return (t.angle - t.anglePrev) * U._baseDelta / t.deltaTime;
  }
  /**
   * Gets the current rotational speed of the body.
   * Equivalent to the magnitude of its angular velocity.
   * @method getAngularSpeed
   * @param body
   * @return angular speed
   */
  static getAngularSpeed(t) {
    return Math.abs(U.getAngularVelocity(t));
  }
  /**
   * Sets the current rotational speed of the body.
   * Direction is maintained. Affects body angular velocity.
   * @method setAngularSpeed
   * @param body
   * @param speed
   */
  static setAngularSpeed(t, e) {
    U.setAngularVelocity(
      t,
      P.sign(U.getAngularVelocity(t)) * e
    );
  }
  /**
   * Moves a body by a given vector relative to its current position. By default velocity is unchanged.
   * If `updateVelocity` is `true` then velocity is inferred from the change in position.
   * @method translate
   * @param body
   * @param translation
   * @param updateVelocity
   */
  static translate(t, e, s = !1) {
    U.setPosition(
      t,
      R.add(t.position, e),
      s
    );
  }
  /**
   * Rotates a body by a given angle relative to its current angle. By default angular velocity is unchanged.
   * If `updateVelocity` is `true` then angular velocity is inferred from the change in angle.
   * @method rotate
   * @param body
   * @param rotation
   * @param point
   * @param updateVelocity
   */
  static rotate(t, e, s, i = !1) {
    if (!s)
      U.setAngle(t, t.angle + e, i);
    else {
      const n = Math.cos(e), o = Math.sin(e), r = t.position.x - s.x, a = t.position.y - s.y;
      U.setPosition(
        t,
        {
          x: s.x + (r * n - a * o),
          y: s.y + (r * o + a * n)
        },
        i
      ), U.setAngle(t, t.angle + e, i);
    }
  }
  /**
   * Scales the body, including updating physical properties (mass, area, axes, inertia), from a world-space point (default is body centre).
   * @method scale
   * @param body
   * @param scaleX
   * @param scaleY
   * @param point
   */
  static scale(t, e, s, i = t.position) {
    let n = 0, o = 0;
    for (let r = 0; r < t.parts.length; r++) {
      const a = t.parts[r];
      Q.scale(a.vertices, e, s, i), a.axes = ks.fromVertices(a.vertices), a.area = Q.area(a.vertices), U.setMass(a, t.density * a.area), Q.translate(a.vertices, {
        x: -a.position.x,
        y: -a.position.y
      }), U.setInertia(
        a,
        U._inertiaScale * Q.inertia(a.vertices, a.mass)
      ), Q.translate(a.vertices, {
        x: a.position.x,
        y: a.position.y
      }), r > 0 && (n += a.area, o += a.inertia), a.position.x = i.x + (a.position.x - i.x) * e, a.position.y = i.y + (a.position.y - i.y) * s, It.update(a.bounds, a.vertices, t.velocity);
    }
    t.parts.length > 1 && (t.area = n, t.isStatic || (U.setMass(t, t.density * n), U.setInertia(t, o))), t.circleRadius && (e === s ? t.circleRadius *= e : t.circleRadius = null);
  }
  /**
   * Performs an update by integrating the equations of motion on the `body`.
   * This is applied every update by `Matter.Engine` automatically.
   * @method update
   * @param body
   * @param deltaTime
   */
  static update(t, e = 1e3 / 60) {
    e = e * t.timeScale;
    const s = e * e, i = U._timeCorrection ? e / (t.deltaTime || e) : 1, n = 1 - t.frictionAir * (e / P._baseDelta), o = (t.position.x - t.positionPrev.x) * i, r = (t.position.y - t.positionPrev.y) * i;
    t.velocity.x = o * n + t.force.x / t.mass * s, t.velocity.y = r * n + t.force.y / t.mass * s, t.positionPrev.x = t.position.x, t.positionPrev.y = t.position.y, t.position.x += t.velocity.x, t.position.y += t.velocity.y, t.deltaTime = e, t.angularVelocity = (t.angle - t.anglePrev) * n * i + t.torque / t.inertia * s, t.anglePrev = t.angle, t.angle += t.angularVelocity;
    for (let a = 0; a < t.parts.length; a++) {
      const c = t.parts[a];
      Q.translate(c.vertices, t.velocity), a > 0 && (c.position.x += t.velocity.x, c.position.y += t.velocity.y), t.angularVelocity !== 0 && (Q.rotate(c.vertices, t.angularVelocity, t.position), ks.rotate(c.axes, t.angularVelocity), a > 0 && R.rotateAbout(
        c.position,
        t.angularVelocity,
        t.position,
        c.position
      )), It.update(c.bounds, c.vertices, t.velocity);
    }
  }
  /**
   * Updates properties `body.velocity`, `body.speed`, `body.angularVelocity` and `body.angularSpeed` which are normalised in relation to `Body._baseDelta`.
   * @method updateVelocities
   * @param body
   */
  static updateVelocities(t) {
    const e = U._baseDelta / t.deltaTime, s = t.velocity;
    s.x = (t.position.x - t.positionPrev.x) * e, s.y = (t.position.y - t.positionPrev.y) * e, t.speed = Math.sqrt(
      s.x * s.x + s.y * s.y
    ), t.angularVelocity = (t.angle - t.anglePrev) * e, t.angularSpeed = Math.abs(t.angularVelocity);
  }
  /**
   * Applies the `force` to the `body` from the force origin `position` in world-space, over a single timestep, including applying any resulting angular torque.
   *
   * Forces are useful for effects like gravity, wind or rocket thrust, but can be difficult in practice when precise control is needed. In these cases see `Body.setVelocity` and `Body.setPosition` as an alternative.
   *
   * The force from this function is only applied once for the duration of a single timestep, in other words the duration depends directly on the current engine update `delta` and the rate of calls to this function.
   *
   * Therefore to account for time, you should apply the force constantly over as many engine updates as equivalent to the intended duration.
   *
   * If all or part of the force duration is some fraction of a timestep, first multiply the force by `duration / timestep`.
   *
   * The force origin `position` in world-space must also be specified. Passing `body.position` will result in zero angular effect as the force origin would be at the centre of mass.
   *
   * The `body` will take time to accelerate under a force, the resulting effect depends on duration of the force, the body mass and other forces on the body including friction combined.
   * @method applyForce
   * @param body
   * @param position The force origin in world-space. Pass `body.position` to avoid angular torque.
   * @param force
   */
  static applyForce(t, e, s) {
    const i = {
      x: e.x - t.position.x,
      y: e.y - t.position.y
    };
    t.force.x += s.x, t.force.y += s.y, t.torque += i.x * s.y - i.y * s.x;
  }
  /**
   * Returns the sums of the properties of all compound parts of the parent body.
   * @method _totalProperties
   * @param body
   */
  static _totalProperties(t) {
    const e = {
      mass: 0,
      area: 0,
      inertia: 0,
      centre: { x: 0, y: 0 }
    };
    for (let s = t.parts.length === 1 ? 0 : 1; s < t.parts.length; s++) {
      const i = t.parts[s], n = i.mass !== 1 / 0 ? i.mass : 1;
      e.mass += n, e.area += i.area, e.inertia += i.inertia, e.centre = R.add(
        e.centre,
        R.mult(i.position, n)
      );
    }
    return e.centre = R.div(e.centre, e.mass), e;
  }
  /**
   * Returns true if the render is a IBodySpriteRender, otherwise false.
   * @method isSpriteRender
   * @param render
   * @return True if the render is a IBodySpriteRender, otherwise false
   */
  static isSpriteRender(t) {
    return "sprite" in t;
  }
  /**
   * Returns true if the render is a IBodyTextRender, otherwise false.
   * @method isTextRender
   * @param render
   * @return True if the render is a IBodyTextRender, otherwise false
   */
  static isTextRender(t) {
    return "text" in t;
  }
};
const Ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Vt
}, Symbol.toStringTag, { value: "Module" }));
class W {
  /**
   * Creates a new composite. The options parameter is an object that specifies any properties you wish to override the defaults.
   * See the properites section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param options
   * @return A new composite
   */
  static create(t = {}) {
    const e = {
      id: P.nextId(),
      type: "composite",
      parent: null,
      isModified: !1,
      bodies: [],
      constraints: [],
      composites: [],
      label: "Composite",
      plugin: {},
      cache: {
        allBodies: null,
        allConstraints: null,
        allComposites: null
      },
      events: {}
    };
    return P.extend(e, t);
  }
  /**
   * Sets the composite's `isModified` flag.
   * If `updateParents` is true, all parents will be set (default: false).
   * If `updateChildren` is true, all children will be set (default: false).
   * @method setModified
   * @param composite
   * @param isModified
   * @param updateParents
   * @param updateChildren
   */
  static setModified(t, e, s = !1, i = !1) {
    if (t.isModified = e, e && t.cache && (t.cache.allBodies = null, t.cache.allConstraints = null, t.cache.allComposites = null), s && t.parent && W.setModified(
      t.parent,
      e,
      s,
      i
    ), i)
      for (const n of t.composites)
        W.setModified(
          n,
          e,
          s,
          i
        );
  }
  /**
   * Generic single or multi-add function. Adds a single or an array of body(s), constraint(s) or composite(s) to the given composite.
   * Triggers `beforeAdd` and `afterAdd` events on the `composite`.
   * @method add
   * @param composite
   * @param object A single or an array of body(s), constraint(s) or composite(s)
   * @return The original composite with the objects added
   */
  static add(t, e) {
    const s = [].concat(e);
    gt.trigger(t, "beforeAdd", { object: e });
    for (const i of s)
      switch (i.type) {
        case "body":
          if (i.parent !== i) {
            P.warn(
              "Composite.add: skipped adding a compound body part (you must add its parent instead)"
            );
            break;
          }
          W.addBody(t, i);
          break;
        case "constraint":
          W.addConstraint(t, i);
          break;
        case "composite":
          W.addComposite(t, i);
          break;
        case "mouseConstraint":
          W.addConstraint(t, i.constraint);
          break;
      }
    return gt.trigger(t, "afterAdd", { object: e }), t;
  }
  /**
   * Generic remove function. Removes one or many body(s), constraint(s) or a composite(s) to the given composite.
   * Optionally searching its children recursively.
   * Triggers `beforeRemove` and `afterRemove` events on the `composite`.
   * @method remove
   * @param composite
   * @param object
   * @param deep
   * @return The original composite with the objects removed
   */
  static remove(t, e, s = !1) {
    const i = [].concat(e);
    gt.trigger(t, "beforeRemove", { object: e });
    for (const n of i)
      switch (n.type) {
        case "body":
          W.removeBody(t, n, s);
          break;
        case "constraint":
          W.removeConstraint(t, n, s);
          break;
        case "composite":
          W.removeComposite(t, n, s);
          break;
        case "mouseConstraint":
          W.removeConstraint(t, n.constraint);
          break;
      }
    return gt.trigger(t, "afterRemove", { object: e }), t;
  }
  /**
   * Adds a composite to the given composite.
   * @method addComposite
   * @param compositeA
   * @param compositeB
   * @return The original compositeA with the objects from compositeB added
   */
  static addComposite(t, e) {
    return t.composites.push(e), e.parent = t, W.setModified(t, !0, !0, !1), t;
  }
  /**
   * Removes a composite from the given composite, and optionally searching its children recursively.
   * @method removeComposite
   * @param compositeA
   * @param compositeB
   * @param deep
   * @return The original compositeA with the composite removed
   */
  static removeComposite(t, e, s = !1) {
    const i = t.composites.indexOf(e);
    if (i !== -1 && W.removeCompositeAt(t, i), s)
      for (const n of t.composites)
        W.removeComposite(n, e, !0);
    return t;
  }
  /**
   * Removes a composite from the given composite.
   * @method removeCompositeAt
   * @param composite
   * @param position
   * @return The original composite with the composite removed
   */
  static removeCompositeAt(t, e) {
    return t.composites.splice(e, 1), W.setModified(t, !0, !0, !1), t;
  }
  /**
   * Adds a body to the given composite.
   * @method addBody
   * @param composite
   * @param body
   * @return The original composite with the body added
   */
  static addBody(t, e) {
    return t.bodies.push(e), W.setModified(t, !0, !0, !1), t;
  }
  /**
   * Removes a body from the given composite, and optionally searching its children recursively.
   * @method removeBody
   * @param composite
   * @param body
   * @param deep
   * @return The original composite with the body removed
   */
  static removeBody(t, e, s = !1) {
    const i = t.bodies.indexOf(e);
    if (i !== -1 && W.removeBodyAt(t, i), s)
      for (const n of t.composites)
        W.removeBody(n, e, !0);
    return t;
  }
  /**
   * Removes a body from the given composite.
   * @method removeBodyAt
   * @param composite
   * @param position
   * @return The original composite with the body removed
   */
  static removeBodyAt(t, e) {
    return t.bodies.splice(e, 1), W.setModified(t, !0, !0, !1), t;
  }
  /**
   * Adds a constraint to the given composite.
   * @method addConstraint
   * @param composite
   * @param constraint
   * @return The original composite with the constraint added
   */
  static addConstraint(t, e) {
    return t.constraints.push(e), W.setModified(t, !0, !0, !1), t;
  }
  /**
   * Removes a constraint from the given composite, and optionally searching its children recursively.
   * @method removeConstraint
   * @param composite
   * @param constraint
   * @param deep
   * @return The original composite with the constraint removed
   */
  static removeConstraint(t, e, s = !1) {
    const i = t.constraints.indexOf(e);
    if (i !== -1 && W.removeConstraintAt(t, i), s)
      for (const n of t.composites)
        W.removeConstraint(n, e, !0);
    return t;
  }
  /**
   * Removes a body from the given composite.
   * @private
   * @method removeConstraintAt
   * @param composite
   * @param position
   * @return The original composite with the constraint removed
   */
  static removeConstraintAt(t, e) {
    return t.constraints.splice(e, 1), W.setModified(t, !0, !0, !1), t;
  }
  /**
   * Removes all bodies, constraints and composites from the given composite.
   * Optionally clearing its children recursively.
   * @method clear
   * @param composite
   * @param keepStatic
   * @param deep
   */
  static clear(t, e, s = !1) {
    if (s)
      for (const i of t.composites)
        W.clear(i, e, !0);
    return e ? t.bodies = t.bodies.filter((i) => i.isStatic) : t.bodies.length = 0, t.constraints.length = 0, t.composites.length = 0, W.setModified(t, !0, !0, !1), t;
  }
  /**
   * Returns all bodies in the given composite, including all bodies in its children, recursively.
   * @method allBodies
   * @param composite
   * @return All the bodies
   */
  static allBodies(t) {
    if (t.cache && t.cache.allBodies)
      return t.cache.allBodies;
    let e = [].concat(t.bodies);
    for (const s of t.composites)
      e = e.concat(W.allBodies(s));
    return t.cache && (t.cache.allBodies = e), e;
  }
  /**
   * Returns all constraints in the given composite, including all constraints in its children, recursively.
   * @method allConstraints
   * @param composite
   * @return All the constraints
   */
  static allConstraints(t) {
    if (t.cache && t.cache.allConstraints)
      return t.cache.allConstraints;
    let e = [].concat(t.constraints);
    for (const s of t.composites)
      e = e.concat(W.allConstraints(s));
    return t.cache && (t.cache.allConstraints = e), e;
  }
  /**
   * Returns all composites in the given composite, including all composites in its children, recursively.
   * @method allComposites
   * @param composite
   * @return All the composites
   */
  static allComposites(t) {
    if (t.cache && t.cache.allComposites)
      return t.cache.allComposites;
    let e = [].concat(t.composites);
    for (const s of t.composites)
      e = e.concat(W.allComposites(s));
    return t.cache && (t.cache.allComposites = e), e;
  }
  /**
   * Searches the composite recursively for an object matching the type and id supplied, null if not found.
   * @method get
   * @param composite
   * @param id
   * @param type
   * @return The requested object, if found
   */
  static get(t, e, s) {
    let i;
    switch (s) {
      case "body":
        i = W.allBodies(t);
        break;
      case "constraint":
        i = W.allConstraints(t);
        break;
      case "composite":
        i = W.allComposites(t).concat(t);
        break;
    }
    if (!i)
      return null;
    const n = i.filter((o) => o.id.toString() === e.toString());
    return n.length === 0 ? null : n[0];
  }
  /**
   * Moves the given object(s) from compositeA to compositeB (equal to a remove followed by an add).
   * @method move
   * @param compositeA
   * @param objects
   * @param compositeB
   * @return Returns compositeA
   */
  static move(t, e, s) {
    return W.remove(t, e), W.add(s, e), t;
  }
  /**
   * Assigns new ids for all objects in the composite, recursively.
   * @method rebase
   * @param composite
   * @return Returns composite
   */
  static rebase(t) {
    const e = [].concat(W.allBodies(t)).concat(W.allConstraints(t)).concat(W.allComposites(t));
    for (let s = 0; s < e.length; s++)
      e[s].id = P.nextId();
    return t;
  }
  /**
   * Translates all children in the composite by a given vector relative to their current positions,
   * without imparting any velocity.
   * @method translate
   * @param composite
   * @param translation
   * @param recursive
   */
  static translate(t, e, s = !0) {
    const i = s ? W.allBodies(t) : t.bodies;
    for (const n of i)
      Vt.translate(n, e);
    return t;
  }
  /**
   * Rotates all children in the composite by a given angle about the given point, without imparting any angular velocity.
   * @method rotate
   * @param composite
   * @param rotation
   * @param point
   * @param recursive
   */
  static rotate(t, e, s, i = !0) {
    const n = Math.cos(e), o = Math.sin(e), r = i ? W.allBodies(t) : t.bodies;
    for (const a of r) {
      const c = a.position.x - s.x, l = a.position.y - s.y;
      Vt.setPosition(a, {
        x: s.x + (c * n - l * o),
        y: s.y + (c * o + l * n)
      }), Vt.rotate(a, e);
    }
    return t;
  }
  /**
   * Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point.
   * @method scale
   * @param composite
   * @param scaleX
   * @param scaleY
   * @param point
   * @param recursive
   */
  static scale(t, e, s, i, n = !0) {
    const o = n ? W.allBodies(t) : t.bodies;
    for (const r of o) {
      const a = r.position.x - i.x, c = r.position.y - i.y;
      Vt.setPosition(r, {
        x: i.x + a * e,
        y: i.y + c * s
      }), Vt.scale(r, e, s);
    }
    return t;
  }
  /**
   * Returns the union of the bounds of all of the composite's bodies.
   * @method bounds
   * @param composite The composite.
   * @returns The composite bounds.
   */
  static bounds(t) {
    const e = W.allBodies(t), s = [];
    for (const i of e)
      s.push(i.bounds.min, i.bounds.max);
    return It.create(Q.create(s));
  }
}
const Th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: W
}, Symbol.toStringTag, { value: "Module" }));
let _c = class {
  /**
   * See above, aliases for back compatibility only
   */
  static create = W.create;
  static add = W.add;
  static remove = W.remove;
  static clear = W.clear;
  static addComposite = W.addComposite;
  static addBody = W.addBody;
  static addConstraint = W.addConstraint;
};
const Mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _c
}, Symbol.toStringTag, { value: "Module" }));
class Ir {
  /**
   * Creates a new contact.
   * @method create
   * @param vertex
   * @return A new contact
   */
  static create(t) {
    return {
      vertex: t,
      normalImpulse: 0,
      tangentImpulse: 0
    };
  }
}
const Ih = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ir
}, Symbol.toStringTag, { value: "Module" }));
class es {
  /**
   * Creates a pair.
   * @method create
   * @param collision
   * @param timestamp
   * @return A new pair
   */
  static create(t, e) {
    const s = t.bodyA, i = t.bodyB, n = {
      id: es.id(s, i),
      bodyA: s,
      bodyB: i,
      collision: t,
      contacts: [],
      activeContacts: [],
      separation: 0,
      isActive: !0,
      confirmedActive: !0,
      isSensor: s.isSensor || i.isSensor,
      timeCreated: e,
      timeUpdated: e,
      inverseMass: 0,
      friction: 0,
      frictionStatic: 0,
      restitution: 0,
      slop: 0
    };
    return es.update(n, t, e), n;
  }
  /**
   * Updates a pair given a collision.
   * @method update
   * @param pair
   * @param collision
   * @param timestamp
   */
  static update(t, e, s) {
    const i = t.contacts, n = e.supports, o = t.activeContacts, r = e.parentA, a = e.parentB, c = r.vertices.length;
    t.isActive = !0, t.timeUpdated = s, t.collision = e, t.separation = e.depth, t.inverseMass = r.inverseMass + a.inverseMass, t.friction = r.friction < a.friction ? r.friction : a.friction, t.frictionStatic = r.frictionStatic > a.frictionStatic ? r.frictionStatic : a.frictionStatic, t.restitution = r.restitution > a.restitution ? r.restitution : a.restitution, t.slop = r.slop > a.slop ? r.slop : a.slop, e.pair = t, o.length = 0;
    for (const l of n) {
      const m = l.body === r ? l.index : c + l.index, h = i[m];
      h ? o.push(h) : o.push(i[m] = Ir.create(l));
    }
  }
  /**
   * Set a pair as active or inactive.
   * @method setActive
   * @param pair
   * @param isActive
   * @param timestamp
   */
  static setActive(t, e, s) {
    e ? (t.isActive = !0, t.timeUpdated = s) : (t.isActive = !1, t.activeContacts.length = 0);
  }
  /**
   * Get the id for the given pair.
   * @method id
   * @param bodyA
   * @param bodyB
   * @return Unique pairId
   */
  static id(t, e) {
    return t.id < e.id ? "A" + t.id + "B" + e.id : "A" + e.id + "B" + t.id;
  }
}
const Ph = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: es
}, Symbol.toStringTag, { value: "Module" }));
class At {
  static _supports = [];
  static _overlapAB = {
    overlap: 0,
    axis: null
  };
  static _overlapBA = {
    overlap: 0,
    axis: null
  };
  /**
   * Creates a new collision record.
   * @method create
   * @param bodyA The first body part represented by the collision record
   * @param bodyB The second body part represented by the collision record
   * @return A new collision record
   */
  static create(t, e) {
    return {
      pair: null,
      collided: !1,
      bodyA: t,
      bodyB: e,
      parentA: t.parent,
      parentB: e.parent,
      depth: 0,
      normal: { x: 0, y: 0 },
      tangent: { x: 0, y: 0 },
      penetration: { x: 0, y: 0 },
      supports: []
    };
  }
  /**
   * Detect collision between two bodies.
   * @method collides
   * @param bodyA
   * @param bodyB
   * @param pairs Optionally reuse collision records from existing pairs.
   * @return A collision record if detected, otherwise null
   */
  static collides(t, e, s) {
    if (At._overlapAxes(
      At._overlapAB,
      t.vertices,
      e.vertices,
      t.axes
    ), At._overlapAB.overlap <= 0 || (At._overlapAxes(
      At._overlapBA,
      e.vertices,
      t.vertices,
      e.axes
    ), At._overlapBA.overlap <= 0))
      return null;
    const i = s && s.table[es.id(t, e)];
    let n;
    i ? n = i.collision : (n = At.create(t, e), n.collided = !0, n.bodyA = t.id < e.id ? t : e, n.bodyB = t.id < e.id ? e : t, n.parentA = n.bodyA.parent, n.parentB = n.bodyB.parent), t = n.bodyA, e = n.bodyB;
    let o;
    At._overlapAB.overlap < At._overlapBA.overlap ? o = At._overlapAB : o = At._overlapBA;
    const r = n.normal, a = n.supports, c = o.axis, l = c?.x ?? NaN, m = c?.y ?? NaN;
    l * (e.position.x - t.position.x) + m * (e.position.y - t.position.y) < 0 ? (r.x = l, r.y = m) : (r.x = -l, r.y = -m), n.tangent.x = -r.y, n.tangent.y = r.x, n.depth = o.overlap, n.penetration.x = r.x * n.depth, n.penetration.y = r.y * n.depth;
    const h = At._findSupports(t, e, r, 1);
    let u = 0;
    if (Q.contains(t.vertices, h[0]) && (a[u++] = h[0]), Q.contains(t.vertices, h[1]) && (a[u++] = h[1]), u < 2) {
      const d = At._findSupports(e, t, r, -1);
      Q.contains(e.vertices, d[0]) && (a[u++] = d[0]), u < 2 && Q.contains(e.vertices, d[1]) && (a[u++] = d[1]);
    }
    return u === 0 && (a[u++] = h[0]), a.length = u, n;
  }
  /**
   * Find the overlap between two sets of vertices.
   * @method _overlapAxes
   * @param result
   * @param verticesA
   * @param verticesB
   * @param axes
   */
  static _overlapAxes(t, e, s, i) {
    const n = e.length, o = s.length, r = e[0].x, a = e[0].y, c = s[0].x, l = s[0].y, m = i.length;
    let h = Number.MAX_VALUE, u = 0;
    for (let d = 0; d < m; d++) {
      const f = i[d], y = f.x, v = f.y;
      let g = r * y + a * v, A = c * y + l * v, b = g, B = A;
      for (let q = 1; q < n; q += 1) {
        const F = e[q].x * y + e[q].y * v;
        F > b ? b = F : F < g && (g = F);
      }
      for (let q = 1; q < o; q += 1) {
        const F = s[q].x * y + s[q].y * v;
        F > B ? B = F : F < A && (A = F);
      }
      const w = b - A, T = B - g, M = w < T ? w : T;
      if (M < h && (h = M, u = d, M <= 0))
        break;
    }
    t.axis = i[u], t.overlap = h;
  }
  /**
   * Projects vertices on an axis and returns an interval.
   * @method _projectToAxis
   * @param projection
   * @param vertices
   * @param axis
   */
  static _projectToAxis(t, e, s) {
    let i = e[0].x * s.x + e[0].y * s.y, n = i;
    for (let o = 1; o < e.length; o += 1) {
      const r = e[o].x * s.x + e[o].y * s.y;
      r > n ? n = r : r < i && (i = r);
    }
    t.min = i, t.max = n;
  }
  /**
   * Finds supporting vertices given two bodies along a given direction using hill-climbing.
   * @method _findSupports
   * @param bodyA
   * @param bodyB
   * @param normal
   * @param direction
   */
  static _findSupports(t, e, s, i) {
    const n = e.vertices, o = n.length, r = t.position.x, a = t.position.y, c = s.x * i, l = s.y * i;
    let m = Number.MAX_VALUE, h = n[0], u;
    for (let f = 0; f < o; f += 1) {
      u = n[f];
      const y = c * (r - u.x) + l * (a - u.y);
      y < m && (m = y, h = u);
    }
    const d = n[(o + h.index - 1) % o];
    return m = c * (r - d.x) + l * (a - d.y), u = n[(h.index + 1) % o], c * (r - u.x) + l * (a - u.y) < m ? (At._supports[0] = h, At._supports[1] = u, At._supports) : (At._supports[0] = h, At._supports[1] = d, At._supports);
  }
}
const Vh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: At
}, Symbol.toStringTag, { value: "Module" }));
class Pr {
  /**
   * Detect collision between two bodies using the Separating Axis Theorem.
   * @deprecated replaced by Collision.collides
   * @method collides
   * @param bodyA
   * @param bodyB
   * @return collision
   */
  static collides(t, e) {
    return At.collides(t, e);
  }
}
const zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Pr
}, Symbol.toStringTag, { value: "Module" }));
class Je {
  /**
   * Creates a new collision detector.
   * @method create
   * @param options
   * @return A new collision detector
   */
  static create(t) {
    const e = {
      bodies: [],
      pairs: null
    };
    return P.extend(e, t);
  }
  /**
   * Sets the list of bodies in the detector.
   * @method setBodies
   * @param detector
   * @param bodies
   */
  static setBodies(t, e) {
    t.bodies = e.slice(0);
  }
  /**
   * Clears the detector including its list of bodies.
   * @method clear
   * @param detector
   */
  static clear(t) {
    t.bodies = [];
  }
  /**
   * Efficiently finds all collisions among all the bodies in `detector.bodies` using a broadphase algorithm.
   *
   * _Note:_ The specific ordering of collisions returned is not guaranteed between releases and may change for performance reasons.
   * If a specific ordering is required then apply a sort to the resulting array.
   * @method collisions
   * @param detector
   * @return collisions
   */
  static collisions(t) {
    const e = [], s = t.pairs, i = t.bodies, n = i.length;
    i.sort(Je._compareBoundsX);
    for (let o = 0; o < n; o++) {
      const r = i[o], a = r.bounds.max.x, c = r.bounds.max.y, l = r.bounds.min.y, m = r.isStatic || r.isSleeping, h = r.parts.length, u = h === 1;
      for (let d = o + 1; d < n; d++) {
        const f = i[d], y = f.bounds;
        if (y.min.x > a)
          break;
        if (c < y.min.y || l > y.max.y || m && (f.isStatic || f.isSleeping) || !Je.canCollide(r.collisionFilter, f.collisionFilter))
          continue;
        const v = f.parts.length;
        if (u && v === 1) {
          const g = At.collides(r, f, s);
          g && e.push(g);
        } else {
          const g = h > 1 ? 1 : 0, A = v > 1 ? 1 : 0;
          for (let b = g; b < h; b++) {
            const B = r.parts[b], w = B.bounds;
            for (let T = A; T < v; T++) {
              const M = f.parts[T], q = M.bounds;
              if (w.min.x > q.max.x || w.max.x < q.min.x || w.max.y < q.min.y || w.min.y > q.max.y)
                continue;
              const F = At.collides(B, M, s);
              F && e.push(F);
            }
          }
        }
      }
    }
    return e;
  }
  /**
   * Returns `true` if both supplied collision filters will allow a collision to occur.
   * See `body.collisionFilter` for more information.
   * @method canCollide
   * @param filterA
   * @param filterB
   * @return `true` if collision can occur
   */
  static canCollide(t, e) {
    return t.group === e.group && t.group !== 0 ? t.group > 0 : (t.mask & e.category) !== 0 && (e.mask & t.category) !== 0;
  }
  /**
   * @method bruteForce
   * @param bodies
   * @param engine
   * @return collisions
   */
  static bruteForce(t, e) {
    const s = [], i = e.metrics;
    for (let n = 0; n < t.length; n++)
      for (let o = n + 1; o < t.length; o++) {
        const r = t[n], a = t[o];
        if (!((r.isStatic || r.isSleeping) && (a.isStatic || a.isSleeping)) && Je.canCollide(r.collisionFilter, a.collisionFilter) && (i.midphaseTests += 1, It.overlaps(r.bounds, a.bounds))) {
          const c = Pr.collides(r, a);
          if (!c)
            continue;
          i.narrowphaseTests += 1, "reused" in c && (i.narrowReuseCount += 1), c.collided && (s.push(c), i.narrowDetections += 1);
        }
      }
    return s;
  }
  /**
   * The comparison function used in the broadphase algorithm.
   * Returns the signed delta of the bodies bounds on the x-axis.
   * @method _sortCompare
   * @param bodyA
   * @param bodyB
   * @return The signed delta used for sorting
   */
  static _compareBoundsX(t, e) {
    return t.bounds.min.x - e.bounds.min.x;
  }
}
const Fh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Je
}, Symbol.toStringTag, { value: "Module" }));
class me {
  /**
   * Creates a new grid.
   * @deprecated replaced by Matter.Detector
   * @method create
   * @param options
   * @return A new grid
   */
  static create(t = {}) {
    const e = {
      buckets: {},
      pairs: {},
      pairsList: [],
      bucketWidth: 48,
      bucketHeight: 48
    };
    return P.extend(e, t);
  }
  /**
   * Updates the grid.
   * @deprecated replaced by Matter.Detector
   * @method update
   * @param grid
   * @param bodies
   * @param engine
   * @param forceUpdate
   */
  static update(t, e, s, i) {
    let n = !1;
    const o = s.world, r = t.buckets;
    for (const a of e) {
      if (a.isSleeping && !i)
        continue;
      if ("bounds" in o) {
        const l = o.bounds;
        if (a.bounds.max.x < l.min.x || a.bounds.min.x > l.max.x || a.bounds.max.y < l.min.y || a.bounds.min.y > l.max.y)
          continue;
      }
      const c = me._getRegion(t, a);
      if (!a.region || c.id !== a.region.id || i) {
        (!a.region || i) && (a.region = c);
        const l = me._regionUnion(c, a.region);
        for (let m = l.startCol; m <= l.endCol; m++)
          for (let h = l.startRow; h <= l.endRow; h++) {
            const u = me._getBucketId(m, h);
            let d = r[u];
            const f = m >= c.startCol && m <= c.endCol && h >= c.startRow && h <= c.endRow, y = m >= a.region.startCol && m <= a.region.endCol && h >= a.region.startRow && h <= a.region.endRow;
            !f && y && y && d && me._bucketRemoveBody(t, d, a), (a.region === c || f && !y || i) && (d || (d = me._createBucket(r, u)), me._bucketAddBody(t, d, a));
          }
        a.region = c, n = !0;
      }
    }
    n && (t.pairsList = me._createActivePairsList(t));
  }
  /**
   * Clears the grid.
   * @deprecated replaced by Matter.Detector
   * @method clear
   * @param grid
   */
  static clear(t) {
    t.buckets = {}, t.pairs = {}, t.pairsList = [];
  }
  /**
   * Finds the union of two regions.
   * @method _regionUnion
   * @deprecated replaced by Matter.Detector
   * @param regionA
   * @param regionB
   * @return region
   */
  static _regionUnion(t, e) {
    const s = Math.min(t.startCol, e.startCol), i = Math.max(t.endCol, e.endCol), n = Math.min(t.startRow, e.startRow), o = Math.max(t.endRow, e.endRow);
    return me._createRegion(s, i, n, o);
  }
  /**
   * Gets the region a given body falls in for a given grid.
   * @method _getRegion
   * @deprecated replaced by Matter.Detector
   * @param grid
   * @param body
   * @return region
   */
  static _getRegion(t, e) {
    const s = e.bounds, i = Math.floor(s.min.x / t.bucketWidth), n = Math.floor(s.max.x / t.bucketWidth), o = Math.floor(s.min.y / t.bucketHeight), r = Math.floor(s.max.y / t.bucketHeight);
    return me._createRegion(i, n, o, r);
  }
  /**
   * Creates a region.
   * @method _createRegion
   * @deprecated replaced by Matter.Detector
   * @param startCol
   * @param endCol
   * @param startRow
   * @param endRow
   * @return region
   */
  static _createRegion(t, e, s, i) {
    return {
      id: t + "," + e + "," + s + "," + i,
      startCol: t,
      endCol: e,
      startRow: s,
      endRow: i
    };
  }
  /**
   * Gets the bucket id at the given position.
   * @method _getBucketId
   * @deprecated replaced by Matter.Detector
   * @param column
   * @param row
   * @return bucket id
   */
  static _getBucketId(t, e) {
    return "C" + t + "R" + e;
  }
  /**
   * Creates a bucket.
   * @method _createBucket
   * @deprecated replaced by Matter.Detector
   * @param buckets
   * @param bucketId
   * @return bucket
   */
  static _createBucket(t, e) {
    return t[e] = [];
  }
  /**
   * Adds a body to a bucket.
   * @method _bucketAddBody
   * @deprecated replaced by Matter.Detector
   * @param grid
   * @param bucket
   * @param body
   */
  static _bucketAddBody(t, e, s) {
    const i = t.pairs;
    for (const n of e) {
      if (s.id === n.id || s.isStatic && n.isStatic)
        continue;
      const o = es.id(s, n), r = i[o];
      r ? r[2] += 1 : i[o] = [s, n, 1];
    }
    e.push(s);
  }
  /**
   * Removes a body from a bucket.
   * @method _bucketRemoveBody
   * @deprecated replaced by Matter.Detector
   * @param grid
   * @param bucket
   * @param body
   */
  static _bucketRemoveBody(t, e, s) {
    e.splice(e.indexOf(s), 1);
    for (let i = 0; i < e.length; i++) {
      const n = t.pairs[es.id(s, e[i])];
      n && (n[2] -= 1);
    }
  }
  /**
   * Generates a list of the active pairs in the grid.
   * @method _createActivePairsList
   * @deprecated replaced by Matter.Detector
   * @param grid
   * @return pairs
   */
  static _createActivePairsList(t) {
    const e = t.pairs, s = P.keys(e), i = s.length, n = [];
    for (let o = 0; o < i; o++) {
      const r = e[s[o]];
      r[2] > 0 ? n.push(r) : delete e[s[o]];
    }
    return n;
  }
}
P.deprecated(
  me,
  "update",
  "Grid.update ➤ replaced by Matter.Detector"
), P.deprecated(
  me,
  "clear",
  "Grid.clear ➤ replaced by Matter.Detector"
);
const Rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: me
}, Symbol.toStringTag, { value: "Module" }));
class hn {
  /**
   * Creates a new pairs structure.
   * @method create
   * @param options
   * @return A new pairs structure
   */
  static create(t) {
    const e = {
      table: {},
      list: [],
      collisionStart: [],
      collisionActive: [],
      collisionEnd: []
    };
    return P.extend(e, t);
  }
  /**
   * Updates pairs given a list of collisions.
   * @method update
   * @param pairs
   * @param collisions
   * @param timestamp
   */
  static update(t, e, s) {
    const i = t.list;
    let n = i.length;
    const o = t.table, r = t.collisionStart, a = t.collisionEnd, c = t.collisionActive;
    r.length = 0, a.length = 0, c.length = 0;
    for (let m = 0; m < n; m++)
      i[m].confirmedActive = !1;
    for (const m of e) {
      let h = m.pair;
      h ? (h.isActive ? c.push(h) : r.push(h), es.update(h, m, s), h.confirmedActive = !0) : (h = es.create(m, s), o[h.id] = h, r.push(h), i.push(h));
    }
    const l = [];
    n = i.length;
    for (let m = 0; m < n; m++) {
      const h = i[m];
      h.confirmedActive || (es.setActive(h, !1, s), a.push(h), !h.collision.bodyA.isSleeping && !h.collision.bodyB.isSleeping && l.push(m));
    }
    for (let m = 0; m < l.length; m++) {
      const h = l[m] - m, u = i[h];
      i.splice(h, 1), delete o[u.id];
    }
  }
  /**
   * Clears the given pairs structure.
   * @method clear
   * @param pairs
   * @return pairs
   */
  static clear(t) {
    return t.table = {}, t.list.length = 0, t.collisionStart.length = 0, t.collisionActive.length = 0, t.collisionEnd.length = 0, t;
  }
}
const Eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: hn
}, Symbol.toStringTag, { value: "Module" }));
class ve {
  /**
   * Creates a new rigid body model with a rectangle hull.
   * The options parameter is an object that specifies any properties you wish to override the defaults.
   * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
   * @method rectangle
   * @param x
   * @param y
   * @param width
   * @param height
   * @param options
   * @return A new rectangle body
   */
  static rectangle(t, e, s, i, n = {}) {
    const o = {
      label: "Rectangle Body",
      position: { x: t, y: e },
      vertices: Q.fromPath(
        "L 0 0 L " + s + " 0 L " + s + " " + i + " L 0 " + i
      )
    };
    if (n.chamfer) {
      const r = n.chamfer;
      o.vertices = Q.chamfer(
        o.vertices,
        r.radius,
        r.quality,
        r.qualityMin,
        r.qualityMax
      ), delete n.chamfer;
    }
    return Vt.create(
      P.extend({}, o, n)
    );
  }
  /**
   * Creates a new rigid body model with a trapezoid hull.
   * The `slope` is parameterised as a fraction of `width` and must be < 1 to form a valid trapezoid.
   * The options parameter is an object that specifies any properties you wish to override the defaults.
   * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
   * @method trapezoid
   * @param x
   * @param y
   * @param width
   * @param height
   * @param slope Must be a number < 1.
   * @param options
   * @return A new trapezoid body
   */
  static trapezoid(t, e, s, i, n, o = {}) {
    n >= 1 && P.warn("Bodies.trapezoid: slope parameter must be < 1."), n *= 0.5;
    const r = (1 - n * 2) * s, a = s * n, c = a + r, l = c + a;
    let m;
    n < 0.5 ? m = "L 0 0 L " + a + " " + -i + " L " + c + " " + -i + " L " + l + " 0" : m = "L 0 0 L " + c + " " + -i + " L " + l + " 0";
    const h = {
      label: "Trapezoid Body",
      position: { x: t, y: e },
      vertices: Q.fromPath(m)
    };
    if (o.chamfer) {
      const u = o.chamfer;
      h.vertices = Q.chamfer(
        h.vertices,
        u.radius,
        u.quality,
        u.qualityMin,
        u.qualityMax
      ), delete o.chamfer;
    }
    return Vt.create(
      P.extend({}, h, o)
    );
  }
  /**
   * Creates a new rigid body model with a circle hull.
   * The options parameter is an object that specifies any properties you wish to override the defaults.
   * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
   * @method circle
   * @param x
   * @param y
   * @param radius
   * @param options
   * @param maxSides
   * @return A new circle body
   */
  static circle(t, e, s, i = {}, n = 25) {
    const o = {
      label: "Circle Body",
      circleRadius: s
    };
    let r = Math.ceil(Math.max(10, Math.min(n, s)));
    return r % 2 === 1 && (r += 1), ve.polygon(
      t,
      e,
      r,
      s,
      P.extend({}, o, i)
    );
  }
  /**
   * Creates a new rigid body model with a regular polygon hull with the given number of sides.
   * The options parameter is an object that specifies any properties you wish to override the defaults.
   * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
   * @method polygon
   * @param x
   * @param y
   * @param sides
   * @param radius
   * @param options
   * @return A new regular polygon body
   */
  static polygon(t, e, s, i, n = {}) {
    if (s < 3)
      return ve.circle(t, e, i, n);
    const o = 2 * Math.PI / s;
    let r = "";
    const a = o * 0.5;
    for (let l = 0; l < s; l += 1) {
      const m = a + l * o, h = Math.cos(m) * i, u = Math.sin(m) * i;
      r += "L " + h.toFixed(3) + " " + u.toFixed(3) + " ";
    }
    const c = {
      label: "Polygon Body",
      position: { x: t, y: e },
      vertices: Q.fromPath(r)
    };
    if (n.chamfer) {
      const l = n.chamfer;
      c.vertices = Q.chamfer(
        c.vertices,
        l.radius,
        l.quality,
        l.qualityMin,
        l.qualityMax
      ), delete n.chamfer;
    }
    return Vt.create(P.extend({}, c, n));
  }
  /**
   * Creates a new rectangle body that fits the letters of the given text.
   * @method text
   * @param x
   * @param y
   * @param text
   * @param options
   * @return A new rectangle body with the given text
   */
  static text(t, e, s, i = {}) {
    const n = {
      content: s,
      font: "Arial",
      align: "center",
      color: "#000000",
      size: 16,
      isBold: !1,
      isStroke: !1,
      paddingX: 0,
      paddingY: 0
    }, o = P.extend(n, i.render?.text);
    o.content = s;
    const a = document.createElement("canvas").getContext("2d");
    if (!a)
      throw new Error("Failed to create canvas context");
    a.font = `${o.isBold ? "bold" : ""} ${o.size}px ${o.font}`, a.textAlign = o.align;
    const c = ve.measureMaxTextWidth(s, o.font, o.size) + o.paddingX * 2, l = s.split(`
`).length * o.size + o.paddingY * 2;
    return ve.rectangle(t, e, c, l, {
      ...i,
      render: { ...i.render, text: o }
    });
  }
  /**
   * Measure max text width for a given font.
   * @method measureMaxTextWidth
   * @param text
   * @param font
   * @param size
   */
  static measureMaxTextWidth(t, e, s) {
    const n = document.createElement("canvas").getContext("2d");
    if (!n)
      throw new Error("Failed to create canvas context");
    n.font = `${s}px ${e}`;
    const o = t.split(`
`);
    let r = 0;
    for (const a of o) {
      const c = n.measureText(a).width;
      c > r && (r = c);
    }
    return r;
  }
  /**
   * Utility to create a compound body based on set(s) of vertices.
   *
   * _Note:_ To optionally enable automatic concave vertices decomposition the [poly-decomp](https://github.com/schteppe/poly-decomp.js)
   * package must be first installed and provided see `Common.setDecomp`, otherwise the convex hull of each vertex set will be used.
   *
   * The resulting vertices are reorientated about their centre of mass,
   * and offset such that `body.position` corresponds to this point.
   *
   * The resulting offset may be found if needed by subtracting `body.bounds` from the original input bounds.
   * To later move the centre of mass see `Body.setCentre`.
   *
   * Note that automatic conconcave decomposition results are not always optimal.
   * For best results, simplify the input vertices as much as possible first.
   * By default this function applies some addtional simplification to help.
   *
   * Some outputs may also require further manual processing afterwards to be robust.
   * In particular some parts may need to be overlapped to avoid collision gaps.
   * Thin parts and sharp points should be avoided or removed where possible.
   *
   * The options parameter object specifies any `Matter.Body` properties you wish to override the defaults.
   *
   * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
   * @method fromVertices
   * @param x
   * @param y
   * @param vertexSets One or more arrays of vertex points e.g. `[[{ x: 0, y: 0 }...], ...]`.
   * @param options The body options.
   * @param flagInternal Optionally marks internal edges with `isInternal`.
   * @param removeCollinear Threshold when simplifying vertices along the same edge.
   * @param minimumArea Threshold when removing small parts.
   * @param removeDuplicatePoints Threshold when simplifying nearby vertices.
   */
  static fromVertices(t, e, s, i = {}, n = !1, o = 0.01, r = 10, a = 0.01) {
    const c = P.getDecomp(), l = !!(c && c.quickDecomp), m = [];
    P.isArray(s[0]) || (s = [s]);
    for (let u = 0; u < s.length; u += 1) {
      let d = s[u];
      const f = Q.isConvex(d);
      if (!f && !l && P.warnOnce(
        // eslint-disable-next-line quotes
        "Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."
      ), f || !l)
        f ? d = Q.clockwiseSort(d) : d = Q.hull(d), m.push({
          position: { x: t, y: e },
          vertices: d
        });
      else {
        const v = d.map(function(A) {
          return [A.x, A.y];
        });
        c.makeCCW(v), o !== !1 && c.removeCollinearPoints(v, o), a !== !1 && c.removeDuplicatePoints && c.removeDuplicatePoints(v, a);
        const g = c.quickDecomp(v);
        for (let A = 0; A < g.length; A++) {
          const B = g[A].map((w) => ({
            x: w[0],
            y: w[1]
          }));
          r > 0 && Q.area(B) < r || m.push({
            position: Q.centre(B),
            vertices: B
          });
        }
      }
    }
    const h = [];
    for (let u = 0; u < m.length; u++)
      h.push(Vt.create(P.extend(m[u], i)));
    if (n)
      for (let d = 0; d < h.length; d++) {
        const f = h[d];
        for (let y = d + 1; y < h.length; y++) {
          const v = h[y];
          if (It.overlaps(f.bounds, v.bounds)) {
            const g = f.vertices, A = v.vertices;
            for (let b = 0; b < f.vertices.length; b++)
              for (let B = 0; B < v.vertices.length; B++) {
                const w = R.magnitudeSquared(
                  R.sub(g[(b + 1) % g.length], A[B])
                ), T = R.magnitudeSquared(
                  R.sub(g[b], A[(B + 1) % A.length])
                );
                w < 5 && T < 5 && (g[b].isInternal = !0, A[B].isInternal = !0);
              }
          }
        }
      }
    if (h.length > 1) {
      const u = Vt.create(
        P.extend({ parts: h.slice(0) }, i)
      );
      return Vt.setPosition(u, { x: t, y: e }), u;
    } else
      return h[0];
  }
}
const qh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ve
}, Symbol.toStringTag, { value: "Module" }));
class go {
  /**
   * Returns a list of collisions between `body` and `bodies`.
   * @method collides
   * @param body
   * @param bodies
   * @return Collisions
   */
  static collides(t, e) {
    const s = [], i = t.bounds;
    for (const n of e) {
      const o = n.parts.length, r = o === 1 ? 0 : 1;
      if (It.overlaps(n.bounds, i))
        for (let a = r; a < o; a++) {
          const c = n.parts[a];
          if (It.overlaps(c.bounds, i)) {
            const l = At.collides(c, t);
            if (l) {
              s.push(l);
              break;
            }
          }
        }
    }
    return s;
  }
  /**
   * Casts a ray segment against a set of bodies and returns all collisions, ray width is optional. Intersection points are not provided.
   * @method ray
   * @param bodies
   * @param startPoint
   * @param endPoint
   * @param rayWidth
   * @return Collisions
   */
  static ray(t, e, s, i = 1e-100) {
    const n = R.angle(e, s), o = R.magnitude(R.sub(e, s)), r = (s.x + e.x) * 0.5, a = (s.y + e.y) * 0.5, c = ve.rectangle(r, a, o, i, {
      angle: n
    }), l = go.collides(c, t);
    for (const m of l)
      m.body = m.bodyB = m.bodyA;
    return l;
  }
  /**
   * Returns all bodies whose bounds are inside (or outside if set) the given set of bounds, from the given set of bodies.
   * @method region
   * @param bodies
   * @param bounds
   * @param outside
   * @return The bodies matching the query
   */
  static region(t, e, s = !1) {
    const i = [];
    for (const n of t) {
      const o = It.overlaps(n.bounds, e);
      (o && !s || !o && s) && i.push(n);
    }
    return i;
  }
  /**
   * Returns all bodies whose vertices contain the given point, from the given set of bodies.
   * @method point
   * @param bodies
   * @param point
   * @return The bodies matching the query
   */
  static point(t, e) {
    const s = [];
    for (const i of t)
      if (It.contains(i.bounds, e)) {
        const n = i.parts.length === 1 ? 0 : 1;
        for (let o = n; o < i.parts.length; o++) {
          const r = i.parts[o];
          if (It.contains(r.bounds, e) && Q.contains(r.vertices, e)) {
            s.push(i);
            break;
          }
        }
      }
    return s;
  }
}
const Lh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: go
}, Symbol.toStringTag, { value: "Module" }));
class xe {
  static _restingThresh = 2;
  static _restingThreshTangent = Math.sqrt(6);
  static _positionDampen = 0.9;
  static _positionWarming = 0.8;
  static _frictionNormalMultiplier = 5;
  static _frictionMaxStatic = Number.MAX_VALUE;
  /**
   * Prepare pairs for position solving.
   * @method preSolvePosition
   * @param pairs
   */
  static preSolvePosition(t) {
    for (const e of t) {
      if (!e.isActive)
        continue;
      const s = e.activeContacts.length;
      e.collision.parentA.totalContacts += s, e.collision.parentB.totalContacts += s;
    }
  }
  /**
   * Find a solution for pair positions.
   * @method solvePosition
   * @param pairs
   * @param delta
   * @param damping
   */
  static solvePosition(t, e, s = 1) {
    const i = xe._positionDampen * (s || 1), n = P.clamp(e / P._baseDelta, 0, 1);
    for (const o of t) {
      if (!o.isActive || o.isSensor)
        continue;
      const r = o.collision, a = r.parentA, c = r.parentB, l = r.normal;
      o.separation = l.x * (c.positionImpulse.x + r.penetration.x - a.positionImpulse.x) + l.y * (c.positionImpulse.y + r.penetration.y - a.positionImpulse.y);
    }
    for (const o of t) {
      if (!o.isActive || o.isSensor)
        continue;
      const r = o.collision, a = r.parentA, c = r.parentB, l = r.normal;
      let m = o.separation - o.slop * n;
      if ((a.isStatic || c.isStatic) && (m *= 2), !(a.isStatic || a.isSleeping)) {
        const h = i / a.totalContacts;
        a.positionImpulse.x += l.x * m * h, a.positionImpulse.y += l.y * m * h;
      }
      if (!(c.isStatic || c.isSleeping)) {
        const h = i / c.totalContacts;
        c.positionImpulse.x -= l.x * m * h, c.positionImpulse.y -= l.y * m * h;
      }
    }
  }
  /**
   * Apply position resolution.
   * @method postSolvePosition
   * @param bodies
   */
  static postSolvePosition(t) {
    const e = xe._positionWarming;
    for (const s of t) {
      const i = s.positionImpulse, n = i.x, o = i.y, r = s.velocity;
      if (s.totalContacts = 0, n !== 0 || o !== 0) {
        for (const a of s.parts)
          Q.translate(a.vertices, i), It.update(a.bounds, a.vertices, r), a.position.x += n, a.position.y += o;
        s.positionPrev.x += n, s.positionPrev.y += o, n * r.x + o * r.y < 0 ? (i.x = 0, i.y = 0) : (i.x *= e, i.y *= e);
      }
    }
  }
  /**
   * Prepare pairs for velocity solving.
   * @method preSolveVelocity
   * @param pairs
   */
  static preSolveVelocity(t) {
    for (const e of t) {
      if (!e.isActive || e.isSensor)
        continue;
      const s = e.collision, i = s.parentA, n = s.parentB, o = s.normal, r = s.tangent;
      for (const a of e.activeContacts) {
        const c = a.vertex, l = a.normalImpulse, m = a.tangentImpulse;
        if (l !== 0 || m !== 0) {
          const h = o.x * l + r.x * m, u = o.y * l + r.y * m;
          i.isStatic || i.isSleeping || (i.positionPrev.x += h * i.inverseMass, i.positionPrev.y += u * i.inverseMass, i.anglePrev += i.inverseInertia * ((c.x - i.position.x) * u - (c.y - i.position.y) * h)), n.isStatic || n.isSleeping || (n.positionPrev.x -= h * n.inverseMass, n.positionPrev.y -= u * n.inverseMass, n.anglePrev -= n.inverseInertia * ((c.x - n.position.x) * u - (c.y - n.position.y) * h));
        }
      }
    }
  }
  /**
   * Find a solution for pair velocities.
   * @method solveVelocity
   * @param pairs
   * @param delta
   */
  static solveVelocity(t, e) {
    const s = e / P._baseDelta, n = s * s * s, o = -xe._restingThresh * s, r = xe._restingThreshTangent, a = xe._frictionNormalMultiplier * s, c = xe._frictionMaxStatic;
    let l, m;
    for (const h of t) {
      if (!h.isActive || h.isSensor)
        continue;
      const u = h.collision, d = u.parentA, f = u.parentB, y = d.velocity, v = f.velocity, g = u.normal.x, A = u.normal.y, b = u.tangent.x, B = u.tangent.y, M = 1 / h.activeContacts.length, q = d.inverseMass + f.inverseMass, F = h.friction * h.frictionStatic * a;
      y.x = d.position.x - d.positionPrev.x, y.y = d.position.y - d.positionPrev.y, v.x = f.position.x - f.positionPrev.x, v.y = f.position.y - f.positionPrev.y, d.angularVelocity = d.angle - d.anglePrev, f.angularVelocity = f.angle - f.anglePrev;
      for (const E of h.activeContacts) {
        const D = E.vertex, V = D.x - d.position.x, k = D.y - d.position.y, N = D.x - f.position.x, z = D.y - f.position.y, ct = y.x - k * d.angularVelocity, X = y.y + V * d.angularVelocity, H = v.x - z * f.angularVelocity, J = v.y + N * f.angularVelocity, lt = ct - H, $ = X - J, Bt = g * lt + A * $, wt = b * lt + B * $, ee = h.separation + Bt;
        let Pt = Math.min(ee, 1);
        Pt = ee < 0 ? 0 : Pt;
        const Lt = Pt * F;
        wt < -Lt || wt > Lt ? (m = wt > 0 ? wt : -wt, l = h.friction * (wt > 0 ? 1 : -1) * n, l < -m ? l = -m : l > m && (l = m)) : (l = wt, m = c);
        const Te = V * A - k * g, Me = N * A - z * g, Ie = M / (q + d.inverseInertia * Te * Te + f.inverseInertia * Me * Me);
        let ue = (1 + h.restitution) * Bt * Ie;
        if (l *= Ie, Bt < o)
          E.normalImpulse = 0;
        else {
          const is = E.normalImpulse;
          E.normalImpulse += ue, E.normalImpulse > 0 && (E.normalImpulse = 0), ue = E.normalImpulse - is;
        }
        if (wt < -r || wt > r)
          E.tangentImpulse = 0;
        else {
          const is = E.tangentImpulse;
          E.tangentImpulse += l, E.tangentImpulse < -m && (E.tangentImpulse = -m), E.tangentImpulse > m && (E.tangentImpulse = m), l = E.tangentImpulse - is;
        }
        const Oe = g * ue + b * l, je = A * ue + B * l;
        d.isStatic || d.isSleeping || (d.positionPrev.x += Oe * d.inverseMass, d.positionPrev.y += je * d.inverseMass, d.anglePrev += (V * je - k * Oe) * d.inverseInertia), f.isStatic || f.isSleeping || (f.positionPrev.x -= Oe * f.inverseMass, f.positionPrev.y -= je * f.inverseMass, f.anglePrev -= (N * je - z * Oe) * f.inverseInertia);
      }
    }
  }
}
const Nh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: xe
}, Symbol.toStringTag, { value: "Module" }));
let oe = class us {
  static _warming = 0.4;
  static _torqueDampen = 1;
  static _minLength = 1e-6;
  /**
   * Creates a new constraint.
   * All properties have default values, and many are pre-calculated automatically based on other properties.
   * To simulate a revolute constraint (or pin joint) set `length: 0` and a high `stiffness` value (e.g. `0.7` or above).
   * If the constraint is unstable, try lowering the `stiffness` value and / or increasing `engine.constraintIterations`.
   * For compound bodies, constraints must be applied to the parent body (not one of its parts).
   * See the properties section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param options
   * @return constraint
   */
  static create(t) {
    const e = t;
    e.bodyA && !e.pointA && (e.pointA = { x: 0, y: 0 }), e.bodyB && !e.pointB && (e.pointB = { x: 0, y: 0 });
    const s = e.bodyA ? R.add(e.bodyA.position, e.pointA) : e.pointA, i = e.bodyB ? R.add(e.bodyB.position, e.pointB) : e.pointB, n = R.magnitude(R.sub(s, i));
    e.length = e.length ?? n, e.id = e.id || P.nextId(), e.label = e.label || "Constraint", e.type = "constraint", e.stiffness = e.stiffness || (e.length > 0 ? 1 : 0.7), e.damping = e.damping || 0, e.angularStiffness = e.angularStiffness || 0, e.angleA = e.bodyA ? e.bodyA.angle : e.angleA, e.angleB = e.bodyB ? e.bodyB.angle : e.angleB, e.plugin = {};
    const o = {
      visible: !0,
      lineWidth: 2,
      strokeStyle: "#ffffff",
      type: "line",
      anchors: !0
    };
    return e.length === 0 && e.stiffness > 0.1 ? (o.type = "pin", o.anchors = !1) : e.stiffness < 0.9 && (o.type = "spring"), e.render = P.extend(o, e.render), e;
  }
  /**
   * Prepares for solving by constraint warming.
   * @method preSolveAll
   * @param bodies
   */
  static preSolveAll(t) {
    for (const e of t) {
      const s = e.constraintImpulse;
      e.isStatic || s.x === 0 && s.y === 0 && s.angle === 0 || (e.position.x += s.x, e.position.y += s.y, e.angle += s.angle);
    }
  }
  /**
   * Solves all constraints in a list of collisions.
   * @method solveAll
   * @param constraints
   * @param delta
   */
  static solveAll(t, e) {
    const s = P.clamp(e / P._baseDelta, 0, 1);
    for (const i of t) {
      const n = !i.bodyA || i.bodyA && i.bodyA.isStatic, o = !i.bodyB || i.bodyB && i.bodyB.isStatic;
      (n || o) && us.solve(i, s);
    }
    for (const i of t) {
      const n = !i.bodyA || i.bodyA && i.bodyA.isStatic, o = !i.bodyB || i.bodyB && i.bodyB.isStatic;
      !n && !o && us.solve(i, s);
    }
  }
  /**
   * Solves a distance constraint with Gauss-Siedel method.
   * @method solve
   * @param constraint
   * @param timeScale
   */
  static solve(t, e) {
    const s = t.bodyA, i = t.bodyB, n = t.pointA, o = t.pointB;
    if (!s && !i)
      return;
    s && !s.isStatic && (R.rotate(n, s.angle - t.angleA, n), t.angleA = s.angle), i && !i.isStatic && (R.rotate(o, i.angle - t.angleB, o), t.angleB = i.angle);
    let r = n, a = o;
    if (s && (r = R.add(s.position, n)), i && (a = R.add(i.position, o)), !r || !a)
      return;
    const c = R.sub(r, a);
    let l = R.magnitude(c);
    l < us._minLength && (l = us._minLength);
    const m = (l - t.length) / l, u = t.stiffness >= 1 || t.length === 0 ? t.stiffness * e : t.stiffness * e * e, d = t.damping * e, f = R.mult(c, m * u), y = (s ? s.inverseMass : 0) + (i ? i.inverseMass : 0), v = (s ? s.inverseInertia : 0) + (i ? i.inverseInertia : 0), g = y + v;
    let A, b, B;
    if (d > 0) {
      const w = R.create();
      A = R.div(c, l), B = R.sub(
        i && R.sub(i.position, i.positionPrev) || w,
        s && R.sub(s.position, s.positionPrev) || w
      ), b = R.dot(A, B);
    }
    if (s && !s.isStatic) {
      const w = s.inverseMass / y;
      s.constraintImpulse.x -= f.x * w, s.constraintImpulse.y -= f.y * w, s.position.x -= f.x * w, s.position.y -= f.y * w, d > 0 && (s.positionPrev.x -= d * A.x * b * w, s.positionPrev.y -= d * A.y * b * w);
      const T = R.cross(n, f) / g * us._torqueDampen * s.inverseInertia * (1 - t.angularStiffness);
      s.constraintImpulse.angle -= T, s.angle -= T;
    }
    if (i && !i.isStatic) {
      const w = i.inverseMass / y;
      i.constraintImpulse.x += f.x * w, i.constraintImpulse.y += f.y * w, i.position.x += f.x * w, i.position.y += f.y * w, d > 0 && (i.positionPrev.x += d * A.x * b * w, i.positionPrev.y += d * A.y * b * w);
      const T = R.cross(o, f) / g * us._torqueDampen * i.inverseInertia * (1 - t.angularStiffness);
      i.constraintImpulse.angle += T, i.angle += T;
    }
  }
  /**
   * Performs body updates required after solving constraints.
   * @method postSolveAll
   * @param bodies
   */
  static postSolveAll(t) {
    for (let e = 0; e < t.length; e++) {
      const s = t[e], i = s.constraintImpulse;
      if (!(s.isStatic || i.x === 0 && i.y === 0 && i.angle === 0)) {
        ae.set(s, !1);
        for (let n = 0; n < s.parts.length; n++) {
          const o = s.parts[n];
          Q.translate(o.vertices, i), n > 0 && (o.position.x += i.x, o.position.y += i.y), i.angle !== 0 && (Q.rotate(o.vertices, i.angle, s.position), ks.rotate(o.axes, i.angle), n > 0 && R.rotateAbout(
            o.position,
            i.angle,
            s.position,
            o.position
          )), It.update(o.bounds, o.vertices, s.velocity);
        }
        i.angle *= us._warming, i.x *= us._warming, i.y *= us._warming;
      }
    }
  }
  /**
   * Returns the world-space position of `constraint.pointA`, accounting for `constraint.bodyA`.
   * @method pointAWorld
   * @param constraint
   * @returns the world-space position
   */
  static pointAWorld(t) {
    return {
      x: (t.bodyA ? t.bodyA.position.x : 0) + (t.pointA ? t.pointA.x : 0),
      y: (t.bodyA ? t.bodyA.position.y : 0) + (t.pointA ? t.pointA.y : 0)
    };
  }
  /**
   * Returns the world-space position of `constraint.pointB`, accounting for `constraint.bodyB`.
   * @method pointBWorld
   * @param constraint
   * @returns the world-space position
   */
  static pointBWorld(t) {
    return {
      x: (t.bodyB ? t.bodyB.position.x : 0) + (t.pointB ? t.pointB.x : 0),
      y: (t.bodyB ? t.bodyB.position.y : 0) + (t.pointB ? t.pointB.y : 0)
    };
  }
  /**
   * Returns the current length of the constraint.
   * This is the distance between both of the constraint's end points.
   * See `constraint.length` for the target rest length.
   * @method currentLength
   * @param constraint
   * @returns the current length
   */
  static currentLength(t) {
    const e = (t.bodyA ? t.bodyA.position.x : 0) + (t.pointA ? t.pointA.x : 0), s = (t.bodyA ? t.bodyA.position.y : 0) + (t.pointA ? t.pointA.y : 0), i = (t.bodyB ? t.bodyB.position.x : 0) + (t.pointB ? t.pointB.x : 0), n = (t.bodyB ? t.bodyB.position.y : 0) + (t.pointB ? t.pointB.y : 0), o = e - i, r = s - n;
    return Math.sqrt(o * o + r * r);
  }
};
const kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: oe
}, Symbol.toStringTag, { value: "Module" }));
class Gt {
  /**
   * Creates a mouse input.
   * @method create
   * @param element
   * @return A new mouse
   */
  static create(t) {
    t || P.log(
      "Mouse.create: element was undefined, defaulting to document.body",
      "warn"
    );
    const e = {
      element: t || document.body,
      absolute: R.create(0, 0),
      position: R.create(0, 0),
      mousedownPosition: R.create(0, 0),
      mouseupPosition: R.create(0, 0),
      offset: R.create(0, 0),
      scale: R.create(1, 1),
      wheelDelta: 0,
      button: -1,
      pixelRatio: parseInt(
        (t || document.body).getAttribute("data-pixel-ratio") ?? "1",
        10
      ),
      sourceEvents: {
        mousemove: null,
        mousedown: null,
        mouseup: null,
        mousewheel: null
      },
      mousemove: (s) => {
        const i = Gt._getRelativeMousePosition(
          s,
          e.element,
          e.pixelRatio
        );
        Gt.isTouchEvent(s) && (e.button = 0, s.preventDefault()), e.absolute.x = i.x, e.absolute.y = i.y, e.position.x = e.absolute.x * e.scale.x + e.offset.x, e.position.y = e.absolute.y * e.scale.y + e.offset.y, e.sourceEvents.mousemove = s;
      },
      mousedown: (s) => {
        const i = Gt._getRelativeMousePosition(
          s,
          e.element,
          e.pixelRatio
        );
        Gt.isTouchEvent(s) ? (e.button = 0, s.preventDefault()) : e.button = s.button, e.absolute.x = i.x, e.absolute.y = i.y, e.position.x = e.absolute.x * e.scale.x + e.offset.x, e.position.y = e.absolute.y * e.scale.y + e.offset.y, e.mousedownPosition.x = e.position.x, e.mousedownPosition.y = e.position.y, e.sourceEvents.mousedown = s;
      },
      mouseup: (s) => {
        const i = Gt._getRelativeMousePosition(
          s,
          e.element,
          e.pixelRatio
        );
        Gt.isTouchEvent(s) && s.preventDefault(), e.button = -1, e.absolute.x = i.x, e.absolute.y = i.y, e.position.x = e.absolute.x * e.scale.x + e.offset.x, e.position.y = e.absolute.y * e.scale.y + e.offset.y, e.mouseupPosition.x = e.position.x, e.mouseupPosition.y = e.position.y, e.sourceEvents.mouseup = s;
      },
      mousewheel: (s) => {
        e.wheelDelta = Math.max(
          -1,
          // @ts-ignore
          Math.min(1, s.wheelDelta || -s.detail)
        ), s.preventDefault(), e.sourceEvents.mousewheel = s;
      }
    };
    return Gt.setElement(e, e.element), e;
  }
  static isTouchEvent(t) {
    return "changedTouches" in t && !!t.changedTouches;
  }
  /**
   * Sets the element the mouse is bound to (and relative to).
   * @method setElement
   * @param mouse
   * @param element
   */
  static setElement(t, e) {
    t.element = e, e.addEventListener("mousemove", t.mousemove, { passive: !0 }), e.addEventListener("mousedown", t.mousedown, { passive: !0 }), e.addEventListener("mouseup", t.mouseup, { passive: !0 }), e.addEventListener("wheel", t.mousewheel, { passive: !1 }), e.addEventListener("touchmove", t.mousemove, { passive: !1 }), e.addEventListener("touchstart", t.mousedown, { passive: !1 }), e.addEventListener("touchend", t.mouseup, { passive: !1 });
  }
  /**
   * Clears all captured source events.
   * @method clearSourceEvents
   * @param mouse
   */
  static clearSourceEvents(t) {
    t.sourceEvents.mousemove = null, t.sourceEvents.mousedown = null, t.sourceEvents.mouseup = null, t.sourceEvents.mousewheel = null, t.wheelDelta = 0;
  }
  /**
   * Sets the mouse position offset.
   * @method setOffset
   * @param mouse
   * @param offset
   */
  static setOffset(t, e) {
    t.offset.x = e.x, t.offset.y = e.y, t.position.x = t.absolute.x * t.scale.x + t.offset.x, t.position.y = t.absolute.y * t.scale.y + t.offset.y;
  }
  /**
   * Sets the mouse position scale.
   * @method setScale
   * @param mouse
   * @param scale
   */
  static setScale(t, e) {
    t.scale.x = e.x, t.scale.y = e.y, t.position.x = t.absolute.x * t.scale.x + t.offset.x, t.position.y = t.absolute.y * t.scale.y + t.offset.y;
  }
  /**
   * Gets the mouse position relative to an element given a screen pixel ratio.
   * @method _getRelativeMousePosition
   * @param event
   * @param element
   * @param pixelRatio
   * @return The mouse position
   */
  static _getRelativeMousePosition(t, e, s) {
    const i = e.getBoundingClientRect(), n = document.documentElement || document.body.parentNode || document.body, o = window.scrollX ?? n.scrollLeft, r = window.scrollY ?? n.scrollTop;
    let a, c;
    if (Gt.isTouchEvent(t)) {
      const l = t.changedTouches;
      a = l[0].pageX - i.left - o, c = l[0].pageY - i.top - r;
    } else
      a = t.pageX - i.left - o, c = t.pageY - i.top - r;
    return R.create(
      a / // @ts-ignore
      (e.clientWidth / (e.width || e.clientWidth) * s),
      c / // @ts-ignore
      (e.clientHeight / (e.height || e.clientHeight) * s)
    );
  }
}
const Oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Gt
}, Symbol.toStringTag, { value: "Module" }));
class pn {
  /**
   * Creates a new mouse constraint.
   * All properties have default values, and many are pre-calculated automatically based on other properties.
   * See the properties section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param engine
   * @param options
   * @return A new MouseConstraint
   */
  static create(t, e = {}) {
    let s = (t ? t.mouse : null) || (e ? e.mouse : null);
    s || (t && t.render && t.render.canvas ? s = Gt.create(t.render.canvas) : e && e.element ? s = Gt.create(e.element) : (s = Gt.create(), P.warn(
      "MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected"
    )));
    const i = oe.create({
      label: "Mouse Constraint",
      pointA: s.position,
      pointB: { x: 0, y: 0 },
      length: 0.01,
      stiffness: 0.1,
      angularStiffness: 1,
      render: {
        strokeStyle: "#90EE90",
        lineWidth: 3
      }
    }), n = {
      type: "mouseConstraint",
      mouse: s,
      element: null,
      body: null,
      constraint: i,
      collisionFilter: {
        category: 1,
        mask: 4294967295,
        group: 0
      },
      events: {}
    }, o = P.extend(n, e);
    return gt.on(t, "beforeUpdate", () => {
      const r = W.allBodies(t.world);
      pn.update(o, r), pn._triggerEvents(o);
    }), o.events = o.events ?? {}, o;
  }
  /**
   * Updates the given mouse constraint.
   * @method update
   * @param mouseConstraint
   * @param bodies
   */
  static update(t, e) {
    const s = t.mouse, i = t.constraint;
    if (s.button === 0)
      if (i.bodyB)
        ae.set(i.bodyB, !1), i.pointA = s.position;
      else
        for (let n = 0; n < e.length; n++) {
          const o = e[n];
          if (It.contains(o.bounds, s.position) && Je.canCollide(
            o.collisionFilter,
            t.collisionFilter
          ))
            for (let r = o.parts.length > 1 ? 1 : 0; r < o.parts.length; r++) {
              const a = o.parts[r];
              if (Q.contains(a.vertices, s.position)) {
                i.pointA = s.position, i.bodyB = t.body = o, i.pointB = {
                  x: s.position.x - o.position.x,
                  y: s.position.y - o.position.y
                }, i.angleB = o.angle, ae.set(o, !1), gt.trigger(t, "startdrag", {
                  mouse: s,
                  body: o
                });
                break;
              }
            }
        }
    else {
      const n = t.body;
      i.bodyB = t.body = null, i.pointB = R.create(), n && gt.trigger(t, "enddrag", { mouse: s, body: n });
    }
  }
  /**
   * Triggers mouse constraint events.
   * @method _triggerEvents
   * @param mouseConstraint
   */
  static _triggerEvents(t) {
    const e = t.mouse, s = e.sourceEvents;
    s.mousemove && gt.trigger(t, "mousemove", { mouse: e }), s.mousedown && gt.trigger(t, "mousedown", { mouse: e }), s.mouseup && gt.trigger(t, "mouseup", { mouse: e }), Gt.clearSourceEvents(e);
  }
}
const jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pn
}, Symbol.toStringTag, { value: "Module" }));
class Xe {
  static _frameTimeout;
  static _requestAnimationFrame = window.requestAnimationFrame.bind(window) || // @ts-ignore
  window.webkitRequestAnimationFrame.bind(window) || // @ts-ignore
  window.mozRequestAnimationFrame.bind(window) || // @ts-ignore
  window.msRequestAnimationFrame.bind(window) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function(t) {
    Xe._frameTimeout = setTimeout(() => {
      t(P.now());
    }, 1e3 / 60);
  };
  static _cancelAnimationFrame = window.cancelAnimationFrame.bind(window) || // @ts-ignore
  window.mozCancelAnimationFrame.bind(window) || // @ts-ignore
  window.webkitCancelAnimationFrame.bind(window) || // @ts-ignore
  window.msCancelAnimationFrame.bind(window) || function() {
    clearTimeout(Xe._frameTimeout);
  };
  /**
   * Creates a new Runner. The options parameter is an object that specifies any properties you wish to override the defaults.
   * @method create
   * @param options
   */
  static create(t = {}) {
    const e = {
      fps: 60,
      deltaSampleSize: 60,
      counterTimestamp: 0,
      frameCounter: 0,
      deltaHistory: [],
      timePrev: null,
      frameRequestId: null,
      isFixed: !1,
      enabled: !0,
      events: {}
    }, s = P.extend(e, t);
    return s.delta = s.delta || 1e3 / s.fps, s.deltaMin = s.deltaMin || 1e3 / s.fps, s.deltaMax = s.deltaMax || 1e3 / (s.fps * 0.5), s.fps = 1e3 / s.delta, s;
  }
  /**
   * Continuously ticks a `Matter.Engine` by calling `Runner.tick` on the `requestAnimationFrame` event.
   * @method run
   * @param target
   * @param engine
   */
  static run(t, e) {
    const s = (o) => "positionIterations" in o;
    let i;
    s(t) ? (e = t, i = Xe.create()) : i = t;
    const n = function(o) {
      i.frameRequestId = Xe._requestAnimationFrame(n), o && i.enabled && Xe.tick(i, e, o);
    };
    return n(), i;
  }
  /**
   * A game loop utility that updates the engine and renderer by one step (a 'tick').
   * Features delta smoothing, time correction and fixed or dynamic timing.
   * Consider just `Engine.update(engine, delta)` if you're using your own loop.
   * @method tick
   * @param runner
   * @param engine
   * @param time
   */
  static tick(t, e, s) {
    const i = e.timing;
    let n;
    t.isFixed ? n = t.delta : (n = t.timePrev ? s - t.timePrev : t.delta, t.timePrev = s, t.deltaHistory.push(n), t.deltaHistory = t.deltaHistory.slice(-t.deltaSampleSize), n = Math.min.apply(null, t.deltaHistory), n = n < t.deltaMin ? t.deltaMin : n, n = n > t.deltaMax ? t.deltaMax : n, t.delta = n);
    const o = {
      timestamp: i.timestamp
    };
    gt.trigger(t, "beforeTick", o), t.frameCounter += 1, s - t.counterTimestamp >= 1e3 && (t.fps = t.frameCounter * ((s - t.counterTimestamp) / 1e3), t.counterTimestamp = s, t.frameCounter = 0), gt.trigger(t, "tick", o), gt.trigger(t, "beforeUpdate", o), Ke.update(e, n), gt.trigger(t, "afterUpdate", o), gt.trigger(t, "afterTick", o);
  }
  /**
   * Ends execution of `Runner.run` on the given `runner`, by canceling the animation frame request event loop.
   * If you wish to only temporarily pause the runner, see `runner.enabled` instead.
   * @method stop
   * @param runner
   */
  static stop(t) {
    t.frameRequestId && Xe._cancelAnimationFrame(t.frameRequestId);
  }
  /**
   * Alias for `Runner.run`.
   * @method start
   * @param runner
   * @param engine
   */
  static start(t, e) {
    Xe.run(t, e);
  }
}
const Dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xe
}, Symbol.toStringTag, { value: "Module" }));
class Ke {
  /**
   * Creates a new engine. The options parameter is an object that specifies any properties you wish to override the defaults.
   * All properties have default values, and many are pre-calculated automatically based on other properties.
   * See the properties section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param options
   * @return engine
   */
  static create(t = {}) {
    const e = {
      positionIterations: 6,
      velocityIterations: 4,
      constraintIterations: 2,
      enableSleeping: !1,
      events: {},
      plugin: {},
      gravity: {
        x: 0,
        y: 1,
        scale: 1e-3
      },
      timing: {
        timestamp: 0,
        timeScale: 1,
        lastDelta: 0,
        lastElapsed: 0
      }
    }, s = P.extend(e, t);
    return s.world = t.world || W.create({ label: "World" }), s.pairs = t.pairs || hn.create(), s.detector = t.detector || Je.create(), s.grid = me.create(), s.world.gravity = s.gravity, s.broadphase = s.grid, s.metrics = {}, s;
  }
  /**
   * Moves the simulation forward in time by `delta` milliseconds.
   * Triggers `beforeUpdate`, `beforeSolve` and `afterUpdate` events.
   * Triggers `collisionStart`, `collisionActive` and `collisionEnd` events.
   * @method update
   * @param engine
   * @param delta
   */
  static update(t, e = P._baseDelta) {
    const s = P.now(), i = t.world, n = t.detector, o = t.pairs, r = t.timing, a = r.timestamp;
    e *= r.timeScale, r.timestamp += e, r.lastDelta = e;
    const c = {
      timestamp: r.timestamp,
      delta: e
    };
    gt.trigger(t, "beforeUpdate", c);
    const l = W.allBodies(i), m = W.allConstraints(i);
    i.isModified && (Je.setBodies(n, l), W.setModified(i, !1, !1, !0)), t.enableSleeping && ae.update(l, e), Ke._bodiesApplyGravity(l, t.gravity), e > 0 && Ke._bodiesUpdate(l, e), gt.trigger(t, "beforeSolve", c), oe.preSolveAll(l);
    for (let d = 0; d < t.constraintIterations; d++)
      oe.solveAll(m, e);
    oe.postSolveAll(l), n.pairs = t.pairs;
    const h = Je.collisions(n);
    hn.update(o, h, a), t.enableSleeping && ae.afterCollisions(o.list), o.collisionStart.length > 0 && gt.trigger(t, "collisionStart", {
      pairs: o.collisionStart,
      timestamp: r.timestamp,
      delta: e
    });
    const u = P.clamp(20 / t.positionIterations, 0, 1);
    xe.preSolvePosition(o.list);
    for (let d = 0; d < t.positionIterations; d++)
      xe.solvePosition(o.list, e, u);
    xe.postSolvePosition(l), oe.preSolveAll(l);
    for (let d = 0; d < t.constraintIterations; d++)
      oe.solveAll(m, e);
    oe.postSolveAll(l), xe.preSolveVelocity(o.list);
    for (let d = 0; d < t.velocityIterations; d++)
      xe.solveVelocity(o.list, e);
    return Ke._bodiesUpdateVelocities(l), o.collisionActive.length > 0 && gt.trigger(t, "collisionActive", {
      pairs: o.collisionActive,
      timestamp: r.timestamp,
      delta: e
    }), o.collisionEnd.length > 0 && gt.trigger(t, "collisionEnd", {
      pairs: o.collisionEnd,
      timestamp: r.timestamp,
      delta: e
    }), Ke._bodiesClearForces(l), gt.trigger(t, "afterUpdate", c), t.timing.lastElapsed = P.now() - s, t;
  }
  /**
   * Merges two engines by keeping the configuration of `engineA` but replacing the world with the one from `engineB`.
   * @method merge
   * @param engineA
   * @param engineB
   */
  static merge(t, e) {
    if (P.extend(t, e), e.world) {
      t.world = e.world, Ke.clear(t);
      const s = W.allBodies(t.world);
      for (const i of s)
        ae.set(i, !1), i.id = P.nextId();
    }
  }
  /**
   * Clears the engine pairs and detector.
   * @method clear
   * @param engine
   */
  static clear(t) {
    hn.clear(t.pairs), Je.clear(t.detector);
  }
  /**
   * Zeroes the `body.force` and `body.torque` force buffers.
   * @method _bodiesClearForces
   * @param bodies
   */
  static _bodiesClearForces(t) {
    for (const e of t)
      e.force.x = 0, e.force.y = 0, e.torque = 0;
  }
  /**
   * Applies gravitational acceleration to all `bodies`.
   * This models a [uniform gravitational field](https://en.wikipedia.org/wiki/Gravity_of_Earth), similar to near the surface of a planet.
   *
   * @method _bodiesApplyGravity
   * @param bodies
   * @param gravity
   */
  static _bodiesApplyGravity(t, e) {
    const s = e.scale ?? 1e-3;
    if (!(e.x === 0 && e.y === 0 || s === 0))
      for (const i of t)
        i.isStatic || i.isSleeping || (i.force.y += i.mass * e.y * s, i.force.x += i.mass * e.x * s);
  }
  /**
   * Applies `Body.update` to all given `bodies`.
   * @method _bodiesUpdate
   * @param bodies
   * @param delta The amount of time elapsed between updates
   */
  static _bodiesUpdate(t, e) {
    for (const s of t)
      s.isStatic || s.isSleeping || Vt.update(s, e);
  }
  /**
   * Applies `Body.updateVelocities` to all given `bodies`.
   * @method _bodiesUpdateVelocities
   * @param bodies
   */
  static _bodiesUpdateVelocities(t) {
    for (const e of t)
      Vt.updateVelocities(e);
  }
  /**
   * @deprecated
   */
  static run = Xe.run;
}
P.deprecated(
  Ke,
  "run",
  "Engine.run ➤ use public static Runner.run(engine) instead"
);
const Wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ke
}, Symbol.toStringTag, { value: "Module" }));
class at {
  static _registry = {};
  /**
   * Registers a plugin object so it can be resolved later by name.
   * @param plugin The plugin to register.
   * @return The plugin.
   */
  static register(t) {
    if (!at.isPlugin(t))
      return P.warn(
        "Plugin.register:",
        JSON.stringify(t),
        "does not implement all required fields."
      ), t;
    if (t.name in at._registry) {
      const e = at._registry[t.name], s = at.versionParse(t.version).number, i = at.versionParse(e.version).number;
      s > i ? (P.warn(
        "Plugin.register:",
        at.toString(e),
        "was upgraded to",
        at.toString(t)
      ), at._registry[t.name] = t) : s < i ? P.warn(
        "Plugin.register:",
        at.toString(e),
        "can not be downgraded to",
        at.toString(t)
      ) : t !== e && P.warn(
        "Plugin.register:",
        at.toString(t),
        "is already registered to different plugin object"
      );
    } else
      at._registry[t.name] = t;
    return t;
  }
  /**
   * Resolves a dependency to a plugin object from the registry if it exists.
   * The `dependency` may contain a version, but only the name matters when resolving.
   * @param dependency The dependency.
   * @return The plugin if resolved, otherwise `undefined`.
   */
  static resolve(t) {
    return at._registry[at.dependencyParse(t).name];
  }
  /**
   * Returns a pretty printed plugin name and version.
   * @param plugin The plugin.
   * @return Pretty printed plugin name and version.
   */
  static toString(t) {
    return typeof t == "string" ? t : (t.name || "anonymous") + "@" + t.version;
  }
  /**
   * Returns `true` if the object meets the minimum standard to be considered a plugin.
   * This means it must define the following properties:
   * - `name`
   * - `version`
   * - `install`
   * @param obj The obj to test.
   * @return `true` if the object can be considered a plugin otherwise `false`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isPlugin(t) {
    return t && "name" in t && "version" in t && "install" in t;
  }
  /**
   * Returns `true` if a plugin with the given `name` been installed on `module`.
   * @param m The module.
   * @param name The plugin name.
   * @return `true` if a plugin with the given `name` been installed on `module`, otherwise `false`.
   */
  static isUsed(t, e) {
    return t.used.indexOf(e) > -1;
  }
  /**
   * Returns `true` if `plugin.for` is applicable to `module` by comparing against `module.name` and `module.version`.
   * If `plugin.for` is not specified then it is assumed to be applicable.
   * The value of `plugin.for` is a string of the format `'module-name'` or `'module-name@version'`.
   * @param plugin The plugin.
   * @param m The module.
   * @return `true` if `plugin.for` is applicable to `module`, otherwise `false`.
   */
  static isFor(t, e) {
    const s = at.dependencyParse(t.for);
    return !t.for || e.name === s.name && at.versionSatisfies(e.version, s.range);
  }
  /**
   * Installs the plugins by calling `plugin.install` on each plugin specified in `plugins` if passed, otherwise `module.uses`.
   * For installing plugins on `Matter` see the convenience function `Matter.use`.
   * Plugins may be specified either by their name or a reference to the plugin object.
   * Plugins themselves may specify further dependencies, but each plugin is installed only once.
   * Order is important, a topological sort is performed to find the best resulting order of installation.
   * This sorting attempts to satisfy every dependency's requested ordering, but may not be exact in all cases.
   * This function logs the resulting status of each dependency in the console, along with any warnings.
   * - A green tick ✅ indicates a dependency was resolved and installed.
   * - An orange diamond 🔶 indicates a dependency was resolved but a warning was thrown for it or one if its dependencies.
   * - A red cross ❌ indicates a dependency could not be resolved.
   * Avoid calling this function multiple times on the same module unless you intend to manually control installation order.
   * @param m The module install plugins on.
   * @param [plugins=module.uses] {} The plugins to install on module (optional, defaults to `module.uses`).
   */
  static use(t, e) {
    if (t.uses = (t.uses || []).concat(e || []), t.uses.length === 0) {
      P.warn(
        "Plugin.use:",
        JSON.stringify(t),
        "does not specify any dependencies to install."
      );
      return;
    }
    const s = at.dependencies(t), i = P.topologicalSort(s).map(
      (o) => `${o}`
    ), n = [];
    for (const o of i) {
      if (o === t.name)
        continue;
      const r = at.resolve(o);
      if (!r) {
        n.push("❌ " + o);
        continue;
      }
      "used" in t && at.isUsed(t, r.name) || (at.isFor(r, t) || (P.warn(
        "Plugin.use:",
        at.toString(r),
        "is for",
        r.for,
        "but installed on",
        JSON.stringify(t) + "."
      ), r._warned = !0), r.install ? r.install(t) : (P.warn(
        "Plugin.use:",
        at.toString(r),
        "does not specify an install function."
      ), r._warned = !0), r._warned ? (n.push("🔶 " + at.toString(r)), delete r._warned) : n.push("✅ " + at.toString(r)), t.used.push(r.name));
    }
    n.length > 0 && P.info(n.join("  "));
  }
  /**
   * Recursively finds all of a module's dependencies and returns a flat dependency graph.
   * @param m The module.
   * @return A dependency graph.
   */
  static dependencies(t, e) {
    const s = at.dependencyParse(t), i = s.name;
    if (e = e || {}, i in e)
      return e;
    const n = typeof t == "string" ? at.resolve(t) : t;
    e[i] = (n.uses || []).map((o) => {
      at.isPlugin(o) && at.register(o);
      const r = at.dependencyParse(o), a = at.resolve(o);
      return a && !at.versionSatisfies(a.version, r.range) ? (P.warn(
        "Plugin.dependencies:",
        at.toString(a),
        "does not satisfy",
        JSON.stringify(r),
        "used by",
        JSON.stringify(s) + "."
      ), a._warned = !0, n._warned = !0) : a || (P.warn(
        "Plugin.dependencies:",
        at.toString(o),
        "used by",
        JSON.stringify(s),
        "could not be resolved."
      ), n._warned = !0), r.name;
    });
    for (const o of e[i])
      at.dependencies(o, e);
    return e;
  }
  /**
   * Parses a dependency string into its components.
   * The `dependency` is a string of the format `'module-name'` or `'module-name@version'`.
   * See documentation for `Plugin.versionParse` for a description of the format.
   * This function can also handle dependencies that are already resolved (e.g. a module object).
   * @param dependency The dependency of the format `'module-name'` or `'module-name@version'`.
   * @return The dependency parsed into its components.
   */
  static dependencyParse(t) {
    if (typeof t == "string")
      return /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/.test(t) || P.warn(
        "Plugin.dependencyParse:",
        t,
        "is not a valid dependency string."
      ), {
        name: t.split("@")[0],
        range: t.split("@")[1] || "*"
      };
    let e = "";
    return "range" in t ? e = t.range : "version" in t && (e = t.version), {
      name: t.name,
      range: e
    };
  }
  /**
   * Parses a version string into its components.
   * Versions are strictly of the format `x.y.z` (as in [semver](http://semver.org/)).
   * Versions may optionally have a prerelease tag in the format `x.y.z-alpha`.
   * Ranges are a strict subset of [npm ranges](https://docs.npmjs.com/misc/semver#advanced-range-syntax).
   * Only the following range types are supported:
   * - Tilde ranges e.g. `~1.2.3`
   * - Caret ranges e.g. `^1.2.3`
   * - Greater than ranges e.g. `>1.2.3`
   * - Greater than or equal ranges e.g. `>=1.2.3`
   * - Exact version e.g. `1.2.3`
   * - Any version `*`
   * @param range The version string.
   * @return The version range parsed into its components.
   */
  static versionParse(t) {
    const e = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
    e.test(t) || P.warn(
      "Plugin.versionParse:",
      t,
      "is not a valid version or range."
    );
    const s = e.exec(t);
    if (!s)
      return {
        isRange: !1,
        version: "0",
        range: t,
        operator: "",
        major: 0,
        minor: 0,
        patch: 0,
        parts: [0, 0, 0],
        prerelease: "",
        number: 0 * 1e8 + 0 * 1e4 + 0
      };
    const i = Number(s[4]), n = Number(s[5]), o = Number(s[6]);
    return {
      isRange: !!(s[1] || s[2]),
      version: s[3],
      range: t,
      operator: s[1] || s[2] || "",
      major: i,
      minor: n,
      patch: o,
      parts: [i, n, o],
      prerelease: s[7],
      number: i * 1e8 + n * 1e4 + o
    };
  }
  /**
   * Returns `true` if `version` satisfies the given `range`.
   * See documentation for `Plugin.versionParse` for a description of the format.
   * If a version or range is not specified, then any version (`*`) is assumed to satisfy.
   * @param version The version string.
   * @param range The range string.
   * @return `true` if `version` satisfies `range`, otherwise `false`.
   */
  static versionSatisfies(t, e) {
    e = e || "*";
    const s = at.versionParse(e), i = at.versionParse(t);
    if (s.isRange) {
      if (s.operator === "*" || t === "*")
        return !0;
      if (s.operator === ">")
        return i.number > s.number;
      if (s.operator === ">=")
        return i.number >= s.number;
      if (s.operator === "~")
        return i.major === s.major && i.minor === s.minor && i.patch >= s.patch;
      if (s.operator === "^")
        return s.major > 0 ? i.major === s.major && i.number >= s.number : s.minor > 0 ? i.minor === s.minor && i.patch >= s.patch : i.patch === s.patch;
    }
    return t === e || t === "*";
  }
}
const Yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: at
}, Symbol.toStringTag, { value: "Module" }));
class ji {
  /**
   * The library name.
   */
  static libraryName = "matter-ts";
  /**
   * The library version.
   */
  static version = "undefined";
  /**
   * A list of plugin dependencies to be installed. These are normally set and installed through `Matter.use`.
   * Alternatively you may set `Matter.uses` manually and install them by calling `Plugin.use(Matter)`.
   */
  static uses = [];
  /**
   * The plugins that have been installed through `Matter.Plugin.install`. Read only.
   */
  static used = [];
  /**
   * Installs the given plugins on the `Matter` namespace.
   * This is a short-hand for `Plugin.use`, see it for more information.
   * Call this function once at the start of your code, with all of the plugins you wish to install as arguments.
   * Avoid calling this function multiple times unless you intend to manually control installation order.
   * @param params The plugin(s) to install on `base` (multi-argument).
   */
  static use(...t) {
    at.use(ji, t);
  }
  /**
   * Chains a function to excute before the original function on the given `path` relative to `Matter`.
   * See also docs for `Common.chain`.
   * @param path The path relative to `Matter`
   * @param func The function to chain before the original
   * @return The chained function that replaced the original
   */
  static before(t, e) {
    return t = t.replace(/^Matter./, ""), P.chainPathBefore(ji, t, e);
  }
  /**
   * Chains a function to excute after the original function on the given `path` relative to `Matter`.
   * See also docs for `Common.chain`.
   * @param path The path relative to `Matter`
   * @param func The function to chain after the original
   * @return The chained function that replaced the original
   */
  static after(t, e) {
    return t = t.replace(/^Matter./, ""), P.chainPathAfter(ji, t, e);
  }
}
const $h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ji
}, Symbol.toStringTag, { value: "Module" }));
class Is {
  /**
   * Create a new composite containing bodies created in the callback in a grid arrangement.
   * This function uses the body's bounds to prevent overlaps.
   * @method stack
   * @param x Starting position in X.
   * @param y Starting position in Y.
   * @param columns
   * @param rows
   * @param columnGap
   * @param rowGap
   * @param callback
   * @return A new composite containing objects created in the callback
   */
  static stack(t, e, s, i, n, o, r) {
    const a = W.create({ label: "Stack" });
    let c = t, l = e, m, h = 0;
    for (let u = 0; u < i; u++) {
      let d = 0;
      for (let f = 0; f < s; f++) {
        const y = r(c, l, f, u, m, h);
        if (y) {
          const v = y.bounds.max.y - y.bounds.min.y, g = y.bounds.max.x - y.bounds.min.x;
          v > d && (d = v), Vt.translate(y, { x: g * 0.5, y: v * 0.5 }), c = y.bounds.max.x + n, W.addBody(a, y), m = y, h += 1;
        } else
          c += n;
      }
      l += d + o, c = t;
    }
    return a;
  }
  /**
   * Chains all bodies in the given composite together using constraints.
   * @method chain
   * @param composite
   * @param xOffsetA
   * @param yOffsetA
   * @param xOffsetB
   * @param yOffsetB
   * @param options
   * @return A new composite containing objects chained together with constraints
   */
  static chain(t, e, s, i, n, o) {
    const r = t.bodies;
    for (let a = 1; a < r.length; a++) {
      const c = r[a - 1], l = r[a], m = c.bounds.max.y - c.bounds.min.y, h = c.bounds.max.x - c.bounds.min.x, u = l.bounds.max.y - l.bounds.min.y, d = l.bounds.max.x - l.bounds.min.x, f = {
        bodyA: c,
        pointA: { x: h * e, y: m * s },
        bodyB: l,
        pointB: { x: d * i, y: u * n }
      }, y = P.extend(f, o);
      W.addConstraint(t, oe.create(y));
    }
    return t.label += " Chain", t;
  }
  /**
   * Connects bodies in the composite with constraints in a grid pattern, with optional cross braces.
   * @method mesh
   * @param composite
   * @param columns
   * @param rows
   * @param crossBrace
   * @param options
   * @return The composite containing objects meshed together with constraints
   */
  static mesh(t, e, s, i, n) {
    const o = t.bodies;
    for (let r = 0; r < s; r++) {
      for (let a = 1; a < e; a++) {
        const c = o[a - 1 + r * e], l = o[a + r * e];
        W.addConstraint(
          t,
          oe.create(
            P.extend({ bodyA: c, bodyB: l }, n)
          )
        );
      }
      if (r > 0)
        for (let a = 0; a < e; a++) {
          const c = o[a + (r - 1) * e], l = o[a + r * e];
          if (W.addConstraint(
            t,
            oe.create(
              P.extend({ bodyA: c, bodyB: l }, n)
            )
          ), i && a > 0) {
            const m = o[a - 1 + (r - 1) * e];
            W.addConstraint(
              t,
              oe.create(
                P.extend({ bodyA: m, bodyB: l }, n)
              )
            );
          }
          if (i && a < e - 1) {
            const m = o[a + 1 + (r - 1) * e];
            W.addConstraint(
              t,
              oe.create(
                P.extend({ bodyA: m, bodyB: l }, n)
              )
            );
          }
        }
    }
    return t.label += " Mesh", t;
  }
  /**
   * Create a new composite containing bodies created in the callback in a pyramid arrangement.
   * This function uses the body's bounds to prevent overlaps.
   * @method pyramid
   * @param x Starting position in X.
   * @param y Starting position in Y.
   * @param columns
   * @param rows
   * @param columnGap
   * @param rowGap
   * @param callback
   * @return A new composite containing objects created in the callback
   */
  static pyramid(t, e, s, i, n, o, r) {
    return Is.stack(
      t,
      e,
      s,
      i,
      n,
      o,
      (a, c, l, m, h, u) => {
        const d = Math.min(i, Math.ceil(s / 2)), f = h ? h.bounds.max.x - h.bounds.min.x : 0;
        if (m > d)
          return;
        m = d - m;
        const y = m, v = s - 1 - m;
        if (l < y || l > v)
          return;
        u === 1 && h && Vt.translate(h, {
          x: (l + (s % 2 === 1 ? 1 : -1)) * f,
          y: 0
        });
        const g = h ? l * f : 0;
        return r(
          t + g + l * n,
          c,
          l,
          m,
          h,
          u
        );
      }
    );
  }
  /**
   * This has now moved to the [newtonsCradle example](https://github.com/liabru/matter-js/blob/master/examples/newtonsCradle.js), follow that instead as this function is deprecated here.
   * @deprecated moved to newtonsCradle example
   * @method newtonsCradle
   * @param x Starting position in X.
   * @param y Starting position in Y.
   * @param number
   * @param size
   * @param length
   * @return A new composite newtonsCradle body
   */
  static newtonsCradle(t, e, s, i, n) {
    const o = W.create({ label: "Newtons Cradle" });
    for (let r = 0; r < s; r++) {
      const c = ve.circle(
        t + r * (i * 1.9),
        e + n,
        i,
        {
          inertia: 1 / 0,
          restitution: 1,
          friction: 0,
          frictionAir: 1e-4,
          slop: 1
        }
      ), l = oe.create({
        pointA: { x: t + r * (i * 1.9), y: e },
        bodyB: c
      });
      W.addBody(o, c), W.addConstraint(o, l);
    }
    return o;
  }
  /**
   * This has now moved to the [car example](https://github.com/liabru/matter-js/blob/master/examples/car.js), follow that instead as this function is deprecated here.
   * @deprecated moved to car example
   * @method car
   * @param x Starting position in X.
   * @param y Starting position in Y.
   * @param width
   * @param height
   * @param wheelSize
   * @return A new composite car body
   */
  static car(t, e, s, i, n) {
    const o = Vt.nextGroup(!0), r = 20, a = -s * 0.5 + r, c = s * 0.5 - r, l = 0, m = W.create({ label: "Car" }), h = ve.rectangle(t, e, s, i, {
      collisionFilter: {
        group: o
      },
      chamfer: {
        radius: i * 0.5
      },
      density: 2e-4
    }), u = ve.circle(
      t + a,
      e + l,
      n,
      {
        collisionFilter: {
          group: o
        },
        friction: 0.8
      }
    ), d = ve.circle(
      t + c,
      e + l,
      n,
      {
        collisionFilter: {
          group: o
        },
        friction: 0.8
      }
    ), f = oe.create({
      bodyB: h,
      pointB: { x: a, y: l },
      bodyA: u,
      stiffness: 1,
      length: 0
    }), y = oe.create({
      bodyB: h,
      pointB: { x: c, y: l },
      bodyA: d,
      stiffness: 1,
      length: 0
    });
    return W.addBody(m, h), W.addBody(m, u), W.addBody(m, d), W.addConstraint(m, f), W.addConstraint(m, y), m;
  }
  /**
   * This has now moved to the [softBody example](https://github.com/liabru/matter-js/blob/master/examples/softBody.js)
   * and the [cloth example](https://github.com/liabru/matter-js/blob/master/examples/cloth.js), follow those instead as this function is deprecated here.
   * @deprecated moved to softBody and cloth examples
   * @method softBody
   * @param x Starting position in X.
   * @param y Starting position in Y.
   * @param columns
   * @param rows
   * @param columnGap
   * @param rowGap
   * @param crossBrace
   * @param particleRadius
   * @param particleOptions
   * @param constraintOptions
   * @return A new composite softBody
   */
  static softBody(t, e, s, i, n, o, r, a, c, l) {
    c = P.extend({ inertia: 1 / 0 }, c), l = P.extend(
      { stiffness: 0.2, render: { type: "line", anchors: !1 } },
      l
    );
    const m = Is.stack(
      t,
      e,
      s,
      i,
      n,
      o,
      (h, u) => ve.circle(h, u, a, c)
    );
    return Is.mesh(m, s, i, r, l), m.label = "Soft Body", m;
  }
}
P.deprecated(
  Is,
  "newtonsCradle",
  "Composites.newtonsCradle ➤ moved to newtonsCradle example"
), P.deprecated(
  Is,
  "car",
  "Composites.car ➤ moved to car example"
), P.deprecated(
  Is,
  "softBody",
  "Composites.softBody ➤ moved to softBody and cloth examples"
);
const Hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Is
}, Symbol.toStringTag, { value: "Module" }));
class vo {
  /**
   * Converts an SVG path into an array of vector points.
   * If the input path forms a concave shape, you must decompose the result into convex parts before use.
   * See `Bodies.fromVertices` which provides support for this.
   * Note that this function is not guaranteed to support complex paths (such as those with holes).
   * You must load the `pathseg.js` polyfill on newer browsers.
   * @method pathToVertices
   * @param path
   * @param sampleLength
   * @return points
   */
  static pathToVertices(t, e = 15) {
    typeof window < "u" && !("SVGPathSeg" in window) && P.warn(
      "Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required."
    );
    let s, i, n;
    const o = [], r = (u, d, f) => {
      const y = f % 2 === 1 && f > 1;
      let v, g;
      if (!s || u != s.x || d != s.y) {
        s && y ? (v = s.x, g = s.y) : (v = 0, g = 0);
        const A = {
          x: v + u,
          y: g + d
        };
        (y || !s) && (s = A), o.push(A), i = v + u, n = g + d;
      }
    }, a = (u) => {
      const d = u.pathSegTypeAsLetter.toUpperCase();
      if (d !== "Z") {
        switch (d) {
          case "M":
          case "L":
          case "T":
          case "C":
          case "S":
          case "Q":
            i = u.x, n = u.y;
            break;
          case "H":
            i = u.x;
            break;
          case "V":
            n = u.y;
            break;
        }
        r(i, n, u.pathSegType);
      }
    };
    vo._svgPathToAbsolute(t);
    const c = t.getTotalLength(), l = [];
    for (let u = 0; u < t.pathSegList.numberOfItems; u += 1)
      l.push(t.pathSegList.getItem(u));
    const m = l.concat();
    let h;
    for (; length < c; ) {
      const u = t.getPathSegAtLength(length), d = l[u];
      if (d != h) {
        for (; m.length && m[0] != d; )
          a(m.shift());
        h = d;
      }
      switch (d.pathSegTypeAsLetter.toUpperCase()) {
        case "C":
        case "T":
        case "S":
        case "Q":
        case "A":
          const f = t.getPointAtLength(length);
          r(f.x, f.y, 0);
          break;
      }
      length += e;
    }
    for (let u = 0, d = m.length; u < d; ++u)
      a(m[u]);
    return o;
  }
  static _svgPathToAbsolute(t) {
    let e = 0, s = 0, i = 0, n = 0, o, r, a, c;
    const l = t.pathSegList, m = l.numberOfItems;
    for (let h = 0; h < m; ++h) {
      const u = l.getItem(h), d = u.pathSegTypeAsLetter;
      if (/[MLHVCSQTA]/.test(d))
        "x" in u && (e = u.x), "y" in u && (s = u.y);
      else
        switch ("x1" in u && (o = e + u.x1), "x2" in u && (a = e + u.x2), "y1" in u && (r = s + u.y1), "y2" in u && (c = s + u.y2), "x" in u && (e += u.x), "y" in u && (s += u.y), d) {
          case "m":
            l.replaceItem(t.createSVGPathSegMovetoAbs(e, s), h);
            break;
          case "l":
            l.replaceItem(t.createSVGPathSegLinetoAbs(e, s), h);
            break;
          case "h":
            l.replaceItem(t.createSVGPathSegLinetoHorizontalAbs(e), h);
            break;
          case "v":
            l.replaceItem(t.createSVGPathSegLinetoVerticalAbs(s), h);
            break;
          case "c":
            l.replaceItem(
              // @ts-ignore
              t.createSVGPathSegCurvetoCubicAbs(e, s, o, r, a, c),
              h
            );
            break;
          case "s":
            l.replaceItem(
              // @ts-ignore
              t.createSVGPathSegCurvetoCubicSmoothAbs(e, s, a, c),
              h
            );
            break;
          case "q":
            l.replaceItem(
              // @ts-ignore
              t.createSVGPathSegCurvetoQuadraticAbs(e, s, o, r),
              h
            );
            break;
          case "t":
            l.replaceItem(
              // @ts-ignore
              t.createSVGPathSegCurvetoQuadraticSmoothAbs(e, s),
              h
            );
            break;
          case "a":
            l.replaceItem(
              // @ts-ignore
              t.createSVGPathSegArcAbs(
                e,
                s,
                u.r1,
                u.r2,
                u.angle,
                u.largeArcFlag,
                u.sweepFlag
              ),
              h
            );
            break;
          case "z":
          case "Z":
            e = i, s = n;
            break;
        }
      (d == "M" || d == "m") && (i = e, n = s);
    }
  }
}
const Uh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: vo
}, Symbol.toStringTag, { value: "Module" }));
class nt {
  static _requestAnimationFrame = window.requestAnimationFrame.bind(window) || // @ts-ignore
  window.webkitRequestAnimationFrame.bind(window) || // @ts-ignore
  window.mozRequestAnimationFrame.bind(window) || // @ts-ignore
  window.msRequestAnimationFrame.bind(window) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function(t) {
    window.setTimeout(function() {
      t(P.now());
    }, 1e3 / 60);
  };
  static _cancelAnimationFrame = window.cancelAnimationFrame.bind(window) || // @ts-ignore
  window.mozCancelAnimationFrame.bind(window) || // @ts-ignore
  window.webkitCancelAnimationFrame.bind(window) || // @ts-ignore
  window.msCancelAnimationFrame.bind(window);
  static _goodFps = 30;
  static _goodDelta = 1e3 / 60;
  /**
   * Creates a new renderer. The options parameter is an object that specifies any properties you wish to override the defaults.
   * All properties have default values, and many are pre-calculated automatically based on other properties.
   * See the properties section below for detailed information on what you can pass via the `options` object.
   * @method create
   * @param options
   * @return A new renderer
   */
  static create(t = {}) {
    const e = {
      element: null,
      mouse: null,
      frameRequestId: null,
      timing: {
        historySize: 60,
        delta: 0,
        deltaHistory: [],
        lastTime: 0,
        lastTimestamp: 0,
        lastElapsed: 0,
        timestampElapsed: 0,
        timestampElapsedHistory: [],
        engineDeltaHistory: [],
        engineElapsedHistory: [],
        elapsedHistory: []
      },
      options: {
        width: 800,
        height: 600,
        pixelRatio: 1,
        background: "#14151f",
        wireframeBackground: "#14151f",
        wireframeStrokeStyle: "#bbb",
        hasBounds: !!t.bounds,
        enabled: !0,
        wireframes: !0,
        showSleeping: !0,
        showDebug: !1,
        showStats: !1,
        showPerformance: !1,
        showBounds: !1,
        showVelocity: !1,
        showCollisions: !1,
        showSeparations: !1,
        showAxes: !1,
        showPositions: !1,
        showAngleIndicator: !1,
        showIds: !1,
        showVertexNumbers: !1,
        showConvexHulls: !1,
        showInternalEdges: !1,
        showMousePosition: !1,
        showBroadphase: !1
      },
      events: {}
    }, s = P.extend(e, t);
    return s.canvas && (s.canvas.width = s.options.width || s.canvas.width, s.canvas.height = s.options.height || s.canvas.height), s.mouse = t.mouse ?? null, s.engine = t.engine ?? Ke.create(), s.canvas = s.canvas || nt._createCanvas(s.options.width, s.options.height), s.context = s.canvas.getContext("2d"), s.textures = {}, s.bounds = s.bounds || {
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: s.canvas.width,
        y: s.canvas.height
      }
    }, s.controller = nt, s.options.showBroadphase = !1, s.options.pixelRatio !== 1 && nt.setPixelRatio(s, s.options.pixelRatio), P.isElement(s.element) && s.element.appendChild(s.canvas), s;
  }
  /**
   * Continuously updates the render canvas on the `requestAnimationFrame` event.
   * @method run
   * @param render
   */
  static run(t) {
    const e = (s) => {
      t.frameRequestId = nt._requestAnimationFrame(e), nt._updateTiming(t, s), nt.world(t, s), (t.options.showStats || t.options.showDebug) && nt.stats(t, t.context, s), (t.options.showPerformance || t.options.showDebug) && nt.performance(t, t.context);
    };
    e();
  }
  /**
   * Ends execution of `Render.run` on the given `render`, by canceling the animation frame request event loop.
   * @method stop
   * @param render
   */
  static stop(t) {
    t.frameRequestId && nt._cancelAnimationFrame(t.frameRequestId);
  }
  /**
   * Sets the pixel ratio of the renderer and updates the canvas.
   * To automatically detect the correct ratio, pass the string `'auto'` for `pixelRatio`.
   * @method setPixelRatio
   * @param render
   * @param pixelRatio
   */
  static setPixelRatio(t, e) {
    const s = t.options, i = t.canvas;
    let n;
    e === "auto" ? n = nt._getPixelRatio(i) : n = e, s.pixelRatio = n, i.setAttribute("data-pixel-ratio", String(n)), i.width = s.width * n, i.height = s.height * n, i.style.width = s.width + "px", i.style.height = s.height + "px";
  }
  /**
   * Sets the render `width` and `height`.
   *
   * Updates the canvas accounting for `render.options.pixelRatio`.
   *
   * Updates the bottom right render bound `render.bounds.max` relative to the provided `width` and `height`.
   * The top left render bound `render.bounds.min` isn't changed.
   *
   * Follow this call with `Render.lookAt` if you need to change the render bounds.
   *
   * See also `Render.setPixelRatio`.
   * @method setSize
   * @param render
   * @param width The width (in CSS pixels)
   * @param height The height (in CSS pixels)
   */
  static setSize(t, e, s) {
    t.options.width = e, t.options.height = s, t.bounds.max.x = t.bounds.min.x + e, t.bounds.max.y = t.bounds.min.y + s, t.options.pixelRatio !== 1 ? nt.setPixelRatio(t, t.options.pixelRatio) : (t.canvas.width = e, t.canvas.height = s);
  }
  /**
   * Positions and sizes the viewport around the given object bounds.
   * Objects must have at least one of the following properties:
   * - `object.bounds`
   * - `object.position`
   * - `object.min` and `object.max`
   * - `object.x` and `object.y`
   * @method lookAt
   * @param render
   * @param objects
   * @param padding
   * @param center
   */
  static lookAt(t, e, s = R.create(0, 0), i = !0) {
    e = P.isArray(e) ? e : [e];
    const n = {
      min: { x: 1 / 0, y: 1 / 0 },
      max: { x: -1 / 0, y: -1 / 0 }
    };
    for (const d of e) {
      const f = d.bounds ? d.bounds.min : d.min || d.position || d, y = d.bounds ? d.bounds.max : d.max || d.position || d;
      f && y && (f.x < n.min.x && (n.min.x = f.x), y.x > n.max.x && (n.max.x = y.x), f.y < n.min.y && (n.min.y = f.y), y.y > n.max.y && (n.max.y = y.y));
    }
    const o = n.max.x - n.min.x + 2 * s.x, r = n.max.y - n.min.y + 2 * s.y, a = t.canvas.height, l = t.canvas.width / a, m = o / r;
    let h = 1, u = 1;
    m > l ? u = m / l : h = l / m, t.options.hasBounds = !0, t.bounds.min.x = n.min.x, t.bounds.max.x = n.min.x + o * h, t.bounds.min.y = n.min.y, t.bounds.max.y = n.min.y + r * u, i && (t.bounds.min.x += o * 0.5 - o * h * 0.5, t.bounds.max.x += o * 0.5 - o * h * 0.5, t.bounds.min.y += r * 0.5 - r * u * 0.5, t.bounds.max.y += r * 0.5 - r * u * 0.5), t.bounds.min.x -= s.x, t.bounds.max.x -= s.x, t.bounds.min.y -= s.y, t.bounds.max.y -= s.y, t.mouse && (Gt.setScale(t.mouse, {
      x: (t.bounds.max.x - t.bounds.min.x) / t.canvas.width,
      y: (t.bounds.max.y - t.bounds.min.y) / t.canvas.height
    }), Gt.setOffset(t.mouse, t.bounds.min));
  }
  /**
   * Applies viewport transforms based on `render.bounds` to a render context.
   * @method startViewTransform
   * @param render
   */
  static startViewTransform(t) {
    const e = t.bounds.max.x - t.bounds.min.x, s = t.bounds.max.y - t.bounds.min.y, i = e / t.options.width, n = s / t.options.height;
    t.context.setTransform(
      t.options.pixelRatio / i,
      0,
      0,
      t.options.pixelRatio / n,
      0,
      0
    ), t.context.translate(-t.bounds.min.x, -t.bounds.min.y);
  }
  /**
   * Resets all transforms on the render context.
   * @method endViewTransform
   * @param render
   */
  static endViewTransform(t) {
    t.context.setTransform(
      t.options.pixelRatio,
      0,
      0,
      t.options.pixelRatio,
      0,
      0
    );
  }
  /**
   * Renders the given `engine`'s `Matter.World` object.
   * This is the entry point for all rendering and should be called every time the scene changes.
   * @method world
   * @param render
   * @param time
   */
  static world(t, e) {
    const s = P.now(), i = t.engine, n = i.world, o = t.canvas, r = t.context, a = t.options, c = t.timing, l = n ? W.allBodies(n) : [], m = n ? W.allConstraints(n) : [], h = a.wireframes ? a.wireframeBackground : a.background;
    let u = [], d = [];
    const f = {
      timestamp: i.timing.timestamp
    };
    if (gt.trigger(t, "beforeRender", f), t.currentBackground !== h && nt._applyBackground(t, h), r.globalCompositeOperation = "source-in", r.fillStyle = "transparent", r.fillRect(0, 0, o.width, o.height), r.globalCompositeOperation = "source-over", a.hasBounds) {
      for (const y of l)
        It.overlaps(y.bounds, t.bounds) && u.push(y);
      for (const y of m) {
        const v = y.bodyA, g = y.bodyB;
        let A = y.pointA, b = y.pointB;
        v && (A = R.add(v.position, y.pointA)), g && (b = R.add(g.position, y.pointB)), !(!A || !b) && (It.contains(t.bounds, A) || It.contains(t.bounds, b)) && d.push(y);
      }
      nt.startViewTransform(t), t.mouse && (Gt.setScale(t.mouse, {
        x: (t.bounds.max.x - t.bounds.min.x) / t.options.width,
        y: (t.bounds.max.y - t.bounds.min.y) / t.options.height
      }), Gt.setOffset(t.mouse, t.bounds.min));
    } else
      d = m, u = l, t.options.pixelRatio !== 1 && t.context.setTransform(
        t.options.pixelRatio,
        0,
        0,
        t.options.pixelRatio,
        0,
        0
      );
    !a.wireframes || i.enableSleeping && a.showSleeping ? nt.bodies(t, u, r) : (a.showConvexHulls && nt.bodyConvexHulls(t, u, r), nt.bodyWireframes(t, u, r)), a.showBounds && nt.bodyBounds(t, u, r), (a.showAxes || a.showAngleIndicator) && nt.bodyAxes(t, u, r), a.showPositions && nt.bodyPositions(t, u, r), a.showVelocity && nt.bodyVelocity(t, u, r), a.showIds && nt.bodyIds(t, u, r), a.showSeparations && nt.separations(t, i.pairs.list, r), a.showCollisions && nt.collisions(t, i.pairs.list, r), a.showVertexNumbers && nt.vertexNumbers(t, u, r), a.showMousePosition && t.mouse && nt.mousePosition(t, t.mouse, r), nt.constraints(d, r), a.hasBounds && nt.endViewTransform(t), gt.trigger(t, "afterRender", f), c.lastElapsed = P.now() - s;
  }
  /**
   * Renders statistics about the engine and world useful for debugging.
   * @method stats
   * @param render
   * @param context
   * @param time
   */
  static stats(t, e, s) {
    const i = t.engine, n = i.world, o = n ? W.allBodies(n) : [];
    let r = 0;
    const a = 55, c = 44;
    let l = 0;
    const m = 0;
    for (let u = 0; u < o.length; u += 1)
      r += o[u].parts.length;
    const h = {
      Part: r,
      Body: o.length,
      Cons: n ? W.allConstraints(n).length : void 0,
      Comp: n ? W.allComposites(n).length : void 0,
      Pair: i.pairs.list.length
    };
    e.fillStyle = "#0e0f19", e.fillRect(l, m, a * 5.5, c), e.font = "12px Arial", e.textBaseline = "top", e.textAlign = "right";
    for (const u in h) {
      const d = h[u];
      e.fillStyle = "#aaa", e.fillText(u, l + a, m + 8), e.fillStyle = "#eee", e.fillText(String(d), l + a, m + 26), l += a;
    }
  }
  /**
   * Renders engine and render performance information.
   * @method performance
   * @param render
   * @param context
   */
  static performance(t, e) {
    const s = t.engine, i = t.timing, n = i.deltaHistory, o = i.elapsedHistory, r = i.timestampElapsedHistory, a = i.engineDeltaHistory, c = i.engineElapsedHistory, l = s.timing.lastDelta, m = nt._mean(n), h = nt._mean(o), u = nt._mean(a), d = nt._mean(c), y = nt._mean(r) / m || 0, v = 1e3 / m || 0, g = 4, A = 12, b = 60, B = 34, w = 10, T = 69;
    e.fillStyle = "#0e0f19", e.fillRect(0, 50, A * 4 + b * 5 + 22, B), nt.status(
      e,
      w,
      T,
      b,
      g,
      n.length,
      Math.round(v) + " fps",
      v / nt._goodFps,
      (M) => n[M] / m - 1
    ), nt.status(
      e,
      w + A + b,
      T,
      b,
      g,
      a.length,
      l?.toFixed(2) + " dt",
      nt._goodDelta / (l ?? NaN),
      (M) => a[M] / u - 1
    ), nt.status(
      e,
      w + (A + b) * 2,
      T,
      b,
      g,
      c.length,
      d.toFixed(2) + " ut",
      1 - d / nt._goodFps,
      (M) => c[M] / d - 1
    ), nt.status(
      e,
      w + (A + b) * 3,
      T,
      b,
      g,
      o.length,
      h.toFixed(2) + " rt",
      1 - h / nt._goodFps,
      (M) => o[M] / h - 1
    ), nt.status(
      e,
      w + (A + b) * 4,
      T,
      b,
      g,
      r.length,
      y.toFixed(2) + " x",
      y * y * y,
      (M) => (r[M] / n[M] / y || 0) - 1
    );
  }
  /**
   * Renders a label, indicator and a chart.
   * @method status
   * @param context
   * @param x
   * @param y
   * @param width
   * @param height
   * @param count
   * @param label
   * @param indicator
   * @param plotY
   */
  static status(t, e, s, i, n, o, r, a, c) {
    t.strokeStyle = "#888", t.fillStyle = "#444", t.lineWidth = 1, t.fillRect(e, s + 7, i, 1), t.beginPath(), t.moveTo(e, s + 7 - n * P.clamp(0.4 * c(0), -2, 2));
    for (let l = 0; l < i; l += 1)
      t.lineTo(
        e + l,
        s + 7 - (l < o ? n * P.clamp(0.4 * c(l), -2, 2) : 0)
      );
    t.stroke(), t.fillStyle = "hsl(" + P.clamp(25 + 95 * a, 0, 120) + ",100%,60%)", t.fillRect(e, s - 7, 4, 4), t.font = "12px Arial", t.textBaseline = "middle", t.textAlign = "right", t.fillStyle = "#eee", t.fillText(r, e + i, s - 5);
  }
  /**
   * Description
   * @method constraints
   * @param constraints
   * @param context
   */
  static constraints(t, e) {
    for (const s of t) {
      if (!s.render.visible || !s.pointA || !s.pointB)
        continue;
      const i = s.bodyA, n = s.bodyB;
      let o, r;
      if (i ? o = R.add(i.position, s.pointA) : o = s.pointA, s.render.type === "pin")
        e.beginPath(), e.arc(o.x, o.y, 3, 0, 2 * Math.PI), e.closePath();
      else {
        if (n ? r = R.add(n.position, s.pointB) : r = s.pointB, e.beginPath(), e.moveTo(o.x, o.y), s.render.type === "spring") {
          const a = R.sub(r, o), c = R.perp(R.normalise(a)), l = Math.ceil(P.clamp(s.length / 5, 12, 20));
          let m;
          for (let h = 1; h < l; h += 1)
            m = h % 2 === 0 ? 1 : -1, e.lineTo(
              o.x + a.x * (h / l) + c.x * m * 4,
              o.y + a.y * (h / l) + c.y * m * 4
            );
        }
        e.lineTo(r.x, r.y);
      }
      s.render.lineWidth && (e.lineWidth = s.render.lineWidth, e.strokeStyle = s.render.strokeStyle, e.stroke()), s.render.anchors && (e.fillStyle = s.render.strokeStyle, e.beginPath(), e.arc(o.x, o.y, 3, 0, 2 * Math.PI), r && e.arc(r.x, r.y, 3, 0, 2 * Math.PI), e.closePath(), e.fill());
    }
  }
  /**
   * Description
   * @method bodies
   * @param render
   * @param bodies
   * @param context
   */
  static bodies(t, e, s) {
    const i = t.options, n = i.showInternalEdges || !i.wireframes;
    for (const o of e)
      if (o.render.visible)
        for (let r = o.parts.length > 1 ? 1 : 0; r < o.parts.length; r++) {
          const a = o.parts[r];
          if (a.render.visible) {
            if (i.showSleeping && o.isSleeping ? s.globalAlpha = 0.5 * a.render.opacity : a.render.opacity !== 1 && (s.globalAlpha = a.render.opacity), Vt.isSpriteRender(a.render) && !i.wireframes) {
              const c = a.render.sprite, l = nt._getTexture(t, c.texture);
              s.translate(a.position.x, a.position.y), s.rotate(a.angle), s.drawImage(
                l,
                l.width * -c.xOffset * c.xScale,
                l.height * -c.yOffset * c.yScale,
                l.width * c.xScale,
                l.height * c.yScale
              ), s.rotate(-a.angle), s.translate(-a.position.x, -a.position.y);
            } else {
              if (a.circleRadius)
                s.beginPath(), s.arc(
                  a.position.x,
                  a.position.y,
                  a.circleRadius,
                  0,
                  2 * Math.PI
                );
              else {
                s.beginPath(), s.moveTo(a.vertices[0].x, a.vertices[0].y);
                for (let c = 1; c < a.vertices.length; c++)
                  !a.vertices[c - 1].isInternal || n ? s.lineTo(a.vertices[c].x, a.vertices[c].y) : s.moveTo(a.vertices[c].x, a.vertices[c].y), a.vertices[c].isInternal && !n && s.moveTo(
                    a.vertices[(c + 1) % a.vertices.length].x,
                    a.vertices[(c + 1) % a.vertices.length].y
                  );
                s.lineTo(a.vertices[0].x, a.vertices[0].y), s.closePath();
              }
              if (i.wireframes ? (s.lineWidth = 1, s.strokeStyle = t.options.wireframeStrokeStyle, s.stroke()) : (s.fillStyle = a.render.fillStyle, a.render.lineWidth && (s.lineWidth = a.render.lineWidth, s.strokeStyle = a.render.strokeStyle, s.stroke()), s.fill()), Vt.isTextRender(a.render)) {
                const c = a.render.text.content.split(`
`);
                s.textBaseline = c.length % 2 === 0 ? "top" : "middle", s.font = `${a.render.text.isBold ? "bold " : ""}${a.render.text.size}px ${a.render.text.font}`, s.fillStyle = a.render.text.color, s.textAlign = a.render.text.align, s.translate(a.position.x, a.position.y), s.rotate(a.angle);
                const l = ve.measureMaxTextWidth(
                  a.render.text.content,
                  a.render.text.font,
                  a.render.text.size
                );
                let m;
                switch (a.render.text.align) {
                  case "left":
                  case "start":
                    m = -l / 2;
                    break;
                  case "end":
                  case "right":
                    m = l / 2;
                    break;
                  default:
                    m = 0;
                }
                for (let h = 0; h < c.length; h++)
                  a.render.text.isStroke ? s.strokeText(
                    c[h],
                    m,
                    (h - Math.floor(c.length / 2)) * a.render.text.size
                  ) : s.fillText(
                    c[h],
                    m,
                    (h - Math.floor(c.length / 2)) * a.render.text.size
                  );
                s.rotate(-a.angle), s.translate(-a.position.x, -a.position.y);
              }
            }
            s.globalAlpha = 1;
          }
        }
  }
  /**
   * Optimised method for drawing body wireframes in one pass
   * @method bodyWireframes
   * @param render
   * @param bodies
   * @param context
   */
  static bodyWireframes(t, e, s) {
    const i = t.options.showInternalEdges;
    s.beginPath();
    for (let n = 0; n < e.length; n++) {
      const o = e[n];
      if (o.render.visible)
        for (let r = o.parts.length > 1 ? 1 : 0; r < o.parts.length; r++) {
          const a = o.parts[r];
          s.moveTo(a.vertices[0].x, a.vertices[0].y);
          for (let c = 1; c < a.vertices.length; c++)
            !a.vertices[c - 1].isInternal || i ? s.lineTo(a.vertices[c].x, a.vertices[c].y) : s.moveTo(a.vertices[c].x, a.vertices[c].y), a.vertices[c].isInternal && !i && s.moveTo(
              a.vertices[(c + 1) % a.vertices.length].x,
              a.vertices[(c + 1) % a.vertices.length].y
            );
          s.lineTo(a.vertices[0].x, a.vertices[0].y);
        }
    }
    s.lineWidth = 1, s.strokeStyle = t.options.wireframeStrokeStyle, s.stroke();
  }
  /**
   * Optimised method for drawing body convex hull wireframes in one pass
   * @method bodyConvexHulls
   * @param render
   * @param bodies
   * @param context
   */
  static bodyConvexHulls(t, e, s) {
    s.beginPath();
    for (let i = 0; i < e.length; i++) {
      const n = e[i];
      if (!(!n.render.visible || n.parts.length === 1)) {
        s.moveTo(n.vertices[0].x, n.vertices[0].y);
        for (let o = 1; o < n.vertices.length; o++)
          s.lineTo(n.vertices[o].x, n.vertices[o].y);
        s.lineTo(n.vertices[0].x, n.vertices[0].y);
      }
    }
    s.lineWidth = 1, s.strokeStyle = "rgba(255,255,255,0.2)", s.stroke();
  }
  /**
   * Renders body vertex numbers.
   * @method vertexNumbers
   * @param render
   * @param bodies
   * @param context
   */
  static vertexNumbers(t, e, s) {
    for (let i = 0; i < e.length; i++) {
      const n = e[i].parts;
      for (let o = n.length > 1 ? 1 : 0; o < n.length; o++) {
        const r = n[o];
        for (let a = 0; a < r.vertices.length; a++)
          s.fillStyle = "rgba(255,255,255,0.2)", s.fillText(
            i + "_" + a,
            r.position.x + (r.vertices[a].x - r.position.x) * 0.8,
            r.position.y + (r.vertices[a].y - r.position.y) * 0.8
          );
      }
    }
  }
  /**
   * Renders mouse position.
   * @method mousePosition
   * @param render
   * @param mouse
   * @param context
   */
  static mousePosition(t, e, s) {
    s.fillStyle = "rgba(255,255,255,0.8)", s.fillText(
      e.position.x + "  " + e.position.y,
      e.position.x + 5,
      e.position.y - 5
    );
  }
  /**
   * Draws body bounds
   * @method bodyBounds
   * @param render
   * @param bodies
   * @param context
   */
  static bodyBounds(t, e, s) {
    const i = t.options;
    s.beginPath();
    for (let n = 0; n < e.length; n++)
      if (e[n].render.visible) {
        const r = e[n].parts;
        for (let a = r.length > 1 ? 1 : 0; a < r.length; a++) {
          const c = r[a];
          s.rect(
            c.bounds.min.x,
            c.bounds.min.y,
            c.bounds.max.x - c.bounds.min.x,
            c.bounds.max.y - c.bounds.min.y
          );
        }
      }
    i.wireframes ? s.strokeStyle = "rgba(255,255,255,0.08)" : s.strokeStyle = "rgba(0,0,0,0.1)", s.lineWidth = 1, s.stroke();
  }
  /**
   * Draws body angle indicators and axes
   * @method bodyAxes
   * @param render
   * @param bodies
   * @param context
   */
  static bodyAxes(t, e, s) {
    const i = t.options;
    s.beginPath();
    for (let n = 0; n < e.length; n++) {
      const o = e[n], r = o.parts;
      if (o.render.visible)
        if (i.showAxes)
          for (let a = r.length > 1 ? 1 : 0; a < r.length; a++) {
            const c = r[a];
            for (let l = 0; l < c.axes.length; l++) {
              const m = c.axes[l];
              s.moveTo(c.position.x, c.position.y), s.lineTo(
                c.position.x + m.x * 20,
                c.position.y + m.y * 20
              );
            }
          }
        else
          for (let a = r.length > 1 ? 1 : 0; a < r.length; a++) {
            const c = r[a];
            for (let l = 0; l < c.axes.length; l++)
              s.moveTo(c.position.x, c.position.y), s.lineTo(
                (c.vertices[0].x + c.vertices[c.vertices.length - 1].x) / 2,
                (c.vertices[0].y + c.vertices[c.vertices.length - 1].y) / 2
              );
          }
    }
    i.wireframes ? (s.strokeStyle = "indianred", s.lineWidth = 1) : (s.strokeStyle = "rgba(255, 255, 255, 0.4)", s.globalCompositeOperation = "overlay", s.lineWidth = 2), s.stroke(), s.globalCompositeOperation = "source-over";
  }
  /**
   * Draws body positions
   * @method bodyPositions
   * @param render
   * @param bodies
   * @param context
   */
  static bodyPositions(t, e, s) {
    const i = t.options;
    s.beginPath();
    for (let n = 0; n < e.length; n++) {
      const o = e[n];
      if (o.render.visible)
        for (let r = 0; r < o.parts.length; r++) {
          const a = o.parts[r];
          s.arc(a.position.x, a.position.y, 3, 0, 2 * Math.PI, !1), s.closePath();
        }
    }
    i.wireframes ? s.fillStyle = "indianred" : s.fillStyle = "rgba(0,0,0,0.5)", s.fill(), s.beginPath();
    for (let n = 0; n < e.length; n++) {
      const o = e[n];
      o.render.visible && (s.arc(
        o.positionPrev.x,
        o.positionPrev.y,
        2,
        0,
        2 * Math.PI,
        !1
      ), s.closePath());
    }
    s.fillStyle = "rgba(255,165,0,0.8)", s.fill();
  }
  /**
   * Draws body velocity
   * @method bodyVelocity
   * @param render
   * @param bodies
   * @param context
   */
  static bodyVelocity(t, e, s) {
    s.beginPath();
    for (let i = 0; i < e.length; i++) {
      const n = e[i];
      if (!n.render.visible)
        continue;
      const o = Vt.getVelocity(n);
      s.moveTo(n.position.x, n.position.y), s.lineTo(n.position.x + o.x, n.position.y + o.y);
    }
    s.lineWidth = 3, s.strokeStyle = "cornflowerblue", s.stroke();
  }
  /**
   * Draws body ids
   * @method bodyIds
   * @param render
   * @param bodies
   * @param context
   */
  static bodyIds(t, e, s) {
    for (let i = 0; i < e.length; i++) {
      if (!e[i].render.visible)
        continue;
      const n = e[i].parts;
      for (let o = n.length > 1 ? 1 : 0; o < n.length; o++) {
        const r = n[o];
        s.font = "12px Arial", s.fillStyle = "rgba(255,255,255,0.5)", s.fillText(
          String(r.id),
          r.position.x + 10,
          r.position.y - 10
        );
      }
    }
  }
  /**
   * Description
   * @method collisions
   * @param render
   * @param pairs
   * @param context
   */
  static collisions(t, e, s) {
    const i = t.options;
    s.beginPath();
    for (let n = 0; n < e.length; n++) {
      const o = e[n];
      if (o.isActive)
        for (let r = 0; r < o.activeContacts.length; r++) {
          const c = o.activeContacts[r].vertex;
          s.rect(c.x - 1.5, c.y - 1.5, 3.5, 3.5);
        }
    }
    i.wireframes ? s.fillStyle = "rgba(255,255,255,0.7)" : s.fillStyle = "orange", s.fill(), s.beginPath();
    for (let n = 0; n < e.length; n++) {
      const o = e[n];
      if (!o.isActive)
        continue;
      const r = o.collision;
      if (o.activeContacts.length > 0) {
        let a = o.activeContacts[0].vertex.x, c = o.activeContacts[0].vertex.y;
        o.activeContacts.length === 2 && (a = (o.activeContacts[0].vertex.x + o.activeContacts[1].vertex.x) / 2, c = (o.activeContacts[0].vertex.y + o.activeContacts[1].vertex.y) / 2), r.bodyB === r.supports[0].body || r.bodyA.isStatic === !0 ? s.moveTo(
          a - r.normal.x * 8,
          c - r.normal.y * 8
        ) : s.moveTo(
          a + r.normal.x * 8,
          c + r.normal.y * 8
        ), s.lineTo(a, c);
      }
    }
    i.wireframes ? s.strokeStyle = "rgba(255,165,0,0.7)" : s.strokeStyle = "orange", s.lineWidth = 1, s.stroke();
  }
  /**
   * Description
   * @method separations
   * @param render
   * @param pairs
   * @param context
   */
  static separations(t, e, s) {
    const i = t.options;
    s.beginPath();
    for (let n = 0; n < e.length; n++) {
      const o = e[n];
      if (!o.isActive)
        continue;
      const r = o.collision, a = r.bodyA, c = r.bodyB;
      let l = 1;
      !c.isStatic && !a.isStatic && (l = 0.5), c.isStatic && (l = 0), s.moveTo(c.position.x, c.position.y), s.lineTo(
        c.position.x - r.penetration.x * l,
        c.position.y - r.penetration.y * l
      ), l = 1, !c.isStatic && !a.isStatic && (l = 0.5), a.isStatic && (l = 0), s.moveTo(a.position.x, a.position.y), s.lineTo(
        a.position.x + r.penetration.x * l,
        a.position.y + r.penetration.y * l
      );
    }
    i.wireframes ? s.strokeStyle = "rgba(255,165,0,0.5)" : s.strokeStyle = "orange", s.stroke();
  }
  /**
   * Description
   * @method inspector
   * @param inspector
   * @param context
   */
  static inspector(t, e) {
    const s = t.selected, i = t.render, n = i.options;
    if (n.hasBounds) {
      const o = i.bounds.max.x - i.bounds.min.x, r = i.bounds.max.y - i.bounds.min.y, a = o / i.options.width, c = r / i.options.height;
      e.scale(1 / a, 1 / c), e.translate(-i.bounds.min.x, -i.bounds.min.y);
    }
    for (let o = 0; o < s.length; o++) {
      const r = s[o].data;
      switch (e.translate(0.5, 0.5), e.lineWidth = 1, e.strokeStyle = "rgba(255,165,0,0.9)", e.setLineDash([1, 2]), r.type) {
        case "body":
          const a = r.bounds;
          e.beginPath(), e.rect(
            Math.floor(a.min.x - 3),
            Math.floor(a.min.y - 3),
            Math.floor(a.max.x - a.min.x + 6),
            Math.floor(a.max.y - a.min.y + 6)
          ), e.closePath(), e.stroke();
          break;
        case "constraint":
          let c = r.pointA;
          r.bodyA && (c = r.pointB), e.beginPath(), e.arc(c.x, c.y, 10, 0, 2 * Math.PI), e.closePath(), e.stroke();
          break;
      }
      e.setLineDash([]), e.translate(-0.5, -0.5);
    }
    if (t.selectStart !== null) {
      e.translate(0.5, 0.5), e.lineWidth = 1, e.strokeStyle = "rgba(255,165,0,0.6)", e.fillStyle = "rgba(255,165,0,0.1)";
      const o = t.selectBounds;
      e.beginPath(), e.rect(
        Math.floor(o.min.x),
        Math.floor(o.min.y),
        Math.floor(o.max.x - o.min.x),
        Math.floor(o.max.y - o.min.y)
      ), e.closePath(), e.stroke(), e.fill(), e.translate(-0.5, -0.5);
    }
    n.hasBounds && e.setTransform(1, 0, 0, 1, 0, 0);
  }
  /**
   * Updates render timing.
   * @method _updateTiming
   * @param render
   * @param time
   */
  static _updateTiming(t, e) {
    const s = t.engine, i = t.timing, n = i.historySize, o = s.timing.timestamp;
    i.delta = i.lastTime && e ? e - i.lastTime : nt._goodDelta, i.lastTime = e, i.timestampElapsed = o && i.lastTimestamp ? o - i.lastTimestamp : 0, i.lastTimestamp = o, i.deltaHistory.unshift(i.delta), i.deltaHistory.length = Math.min(
      i.deltaHistory.length,
      n
    ), i.engineDeltaHistory.unshift(s.timing.lastDelta), i.engineDeltaHistory.length = Math.min(
      i.engineDeltaHistory.length,
      n
    ), i.timestampElapsedHistory.unshift(i.timestampElapsed), i.timestampElapsedHistory.length = Math.min(
      i.timestampElapsedHistory.length,
      n
    ), i.engineElapsedHistory.unshift(s.timing.lastElapsed), i.engineElapsedHistory.length = Math.min(
      i.engineElapsedHistory.length,
      n
    ), i.elapsedHistory.unshift(i.lastElapsed), i.elapsedHistory.length = Math.min(
      i.elapsedHistory.length,
      n
    );
  }
  /**
   * Returns the mean value of the given numbers.
   * @method _mean
   * @param values
   * @return the mean of given values
   */
  static _mean(t) {
    let e = 0;
    for (let s = 0; s < t.length; s += 1)
      e += t[s];
    return e / t.length || 0;
  }
  /**
   * @method _createCanvas
   * @param width
   * @param height
   * @return canvas
   */
  static _createCanvas(t, e) {
    const s = document.createElement("canvas");
    return s.width = t, s.height = e, s.oncontextmenu = function() {
      return !1;
    }, s.onselectstart = function() {
      return !1;
    }, s;
  }
  /**
   * Gets the pixel ratio of the canvas.
   * @method _getPixelRatio
   * @param canvas
   * @return pixel ratio
   */
  static _getPixelRatio(t) {
    return (window.devicePixelRatio || 1) / 1;
  }
  /**
   * Gets the requested texture (an Image) via its path
   * @method _getTexture
   * @param render
   * @param imagePath
   * @return texture
   */
  static _getTexture(t, e) {
    let s = t.textures[e];
    return s || (s = t.textures[e] = new Image(), s.src = e, s);
  }
  /**
   * Applies the background to the canvas using CSS.
   * @method applyBackground
   * @param render
   * @param background
   */
  static _applyBackground(t, e) {
    let s = e;
    /(jpg|gif|png)$/.test(e) && (s = "url(" + e + ")"), t.canvas.style.background = s, t.canvas.style.backgroundSize = "contain", t.currentBackground = e;
  }
}
const Gh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: nt
}, Symbol.toStringTag, { value: "Module" }));
class Xh extends ji {
  static Axes = ks;
  static Bodies = ve;
  static Body = Vt;
  static Bounds = It;
  static Collision = At;
  static Common = P;
  static Composite = W;
  static Composites = Is;
  static Constraint = oe;
  static Contact = Ir;
  static Detector = Je;
  static Engine = Ke;
  static Events = gt;
  static Grid = me;
  static Mouse = Gt;
  static MouseConstraint = pn;
  static Pair = es;
  static Pairs = hn;
  static Plugin = at;
  static Query = go;
  static Render = nt;
  static Resolver = xe;
  static Runner = Xe;
  static SAT = Pr;
  static Sleeping = ae;
  static Svg = vo;
  static Vector = R;
  static Vertices = Q;
  static World = _c;
}
const Xp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Axes: Ah,
  Bodies: qh,
  Body: Ch,
  Bounds: vh,
  Collision: Vh,
  Common: bh,
  Composite: Th,
  Composites: Hh,
  Constraint: kh,
  Contact: Ih,
  Detector: Fh,
  Engine: Wh,
  Events: wh,
  Grid: Rh,
  Matter: $h,
  Mouse: Oh,
  MouseConstraint: jh,
  Pair: Ph,
  Pairs: Eh,
  Plugin: Yh,
  Query: Lh,
  Render: Gh,
  Resolver: Nh,
  Runner: Dh,
  SAT: zh,
  Sleeping: Sh,
  Svg: Uh,
  Vector: gh,
  Vertices: Bh,
  World: Mh,
  default: Xh
}, Symbol.toStringTag, { value: "Module" }));
class Kh {
  /**
   * The matrix storage.
   */
  matrix;
  /**
   * @todo Remove useless constructor
   */
  constructor() {
    this.matrix = {};
  }
  /**
   * get
   */
  get(t, e) {
    let { id: s } = t, { id: i } = e;
    if (i > s) {
      const n = i;
      i = s, s = n;
    }
    return `${s}-${i}` in this.matrix;
  }
  /**
   * set
   */
  set(t, e, s) {
    let { id: i } = t, { id: n } = e;
    if (n > i) {
      const o = n;
      n = i, i = o;
    }
    s ? this.matrix[`${i}-${n}`] = !0 : delete this.matrix[`${i}-${n}`];
  }
  /**
   * Empty the matrix
   */
  reset() {
    this.matrix = {};
  }
  /**
   * Set max number of objects
   */
  setNumObjects(t) {
  }
}
class Qe {
  /**
   * A vector of length 9, containing all matrix elements.
   */
  elements;
  /**
   * @param elements A vector of length 9, containing all matrix elements.
   */
  constructor(t = [0, 0, 0, 0, 0, 0, 0, 0, 0]) {
    this.elements = t;
  }
  /**
   * Sets the matrix to identity
   * @todo Should perhaps be renamed to `setIdentity()` to be more clear.
   * @todo Create another function that immediately creates an identity matrix eg. `eye()`
   */
  identity() {
    const t = this.elements;
    t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1;
  }
  /**
   * Set all elements to zero
   */
  setZero() {
    const t = this.elements;
    t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 0;
  }
  /**
   * Sets the matrix diagonal elements from a Vec3
   */
  setTrace(t) {
    const e = this.elements;
    e[0] = t.x, e[4] = t.y, e[8] = t.z;
  }
  /**
   * Gets the matrix diagonal elements
   */
  getTrace(t = new x()) {
    const e = this.elements;
    return t.x = e[0], t.y = e[4], t.z = e[8], t;
  }
  /**
   * Matrix-Vector multiplication
   * @param v The vector to multiply with
   * @param target Optional, target to save the result in.
   */
  vmult(t, e = new x()) {
    const s = this.elements, i = t.x, n = t.y, o = t.z;
    return e.x = s[0] * i + s[1] * n + s[2] * o, e.y = s[3] * i + s[4] * n + s[5] * o, e.z = s[6] * i + s[7] * n + s[8] * o, e;
  }
  /**
   * Matrix-scalar multiplication
   */
  smult(t) {
    for (let e = 0; e < this.elements.length; e++)
      this.elements[e] *= t;
  }
  /**
   * Matrix multiplication
   * @param matrix Matrix to multiply with from left side.
   */
  mmult(t, e = new Qe()) {
    const s = this.elements, i = t.elements, n = e.elements, o = s[0], r = s[1], a = s[2], c = s[3], l = s[4], m = s[5], h = s[6], u = s[7], d = s[8], f = i[0], y = i[1], v = i[2], g = i[3], A = i[4], b = i[5], B = i[6], w = i[7], T = i[8];
    return n[0] = o * f + r * g + a * B, n[1] = o * y + r * A + a * w, n[2] = o * v + r * b + a * T, n[3] = c * f + l * g + m * B, n[4] = c * y + l * A + m * w, n[5] = c * v + l * b + m * T, n[6] = h * f + u * g + d * B, n[7] = h * y + u * A + d * w, n[8] = h * v + u * b + d * T, e;
  }
  /**
   * Scale each column of the matrix
   */
  scale(t, e = new Qe()) {
    const s = this.elements, i = e.elements;
    for (let n = 0; n !== 3; n++)
      i[3 * n + 0] = t.x * s[3 * n + 0], i[3 * n + 1] = t.y * s[3 * n + 1], i[3 * n + 2] = t.z * s[3 * n + 2];
    return e;
  }
  /**
   * Solve Ax=b
   * @param b The right hand side
   * @param target Optional. Target vector to save in.
   * @return The solution x
   * @todo should reuse arrays
   */
  solve(t, e = new x()) {
    const n = [];
    let o, r;
    for (o = 0; o < 12; o++)
      n.push(0);
    for (o = 0; o < 3; o++)
      for (r = 0; r < 3; r++)
        n[o + 4 * r] = this.elements[o + 3 * r];
    n[3] = t.x, n[7] = t.y, n[11] = t.z;
    let a = 3;
    const c = a;
    let l;
    const m = 4;
    let h;
    do {
      if (o = c - a, n[o + 4 * o] === 0) {
        for (r = o + 1; r < c; r++)
          if (n[o + 4 * r] !== 0) {
            l = m;
            do
              h = m - l, n[h + 4 * o] += n[h + 4 * r];
            while (--l);
            break;
          }
      }
      if (n[o + 4 * o] !== 0)
        for (r = o + 1; r < c; r++) {
          const u = n[o + 4 * r] / n[o + 4 * o];
          l = m;
          do
            h = m - l, n[h + 4 * r] = h <= o ? 0 : n[h + 4 * r] - n[h + 4 * o] * u;
          while (--l);
        }
    } while (--a);
    if (e.z = n[11] / n[10], e.y = (n[7] - n[6] * e.z) / n[5], e.x = (n[3] - n[2] * e.z - n[1] * e.y) / n[0], isNaN(e.x) || isNaN(e.y) || isNaN(e.z) || e.x === 1 / 0 || e.y === 1 / 0 || e.z === 1 / 0)
      throw `Could not solve equation! Got x=[${e.toString()}], b=[${t.toString()}], A=[${this.toString()}]`;
    return e;
  }
  e(t, e, s) {
    if (s === void 0)
      return this.elements[e + 3 * t];
    this.elements[e + 3 * t] = s;
  }
  /**
   * Copy another matrix into this matrix object.
   */
  copy(t) {
    for (let e = 0; e < t.elements.length; e++)
      this.elements[e] = t.elements[e];
    return this;
  }
  /**
   * Returns a string representation of the matrix.
   */
  toString() {
    let t = "";
    for (let s = 0; s < 9; s++)
      t += this.elements[s] + ",";
    return t;
  }
  /**
   * reverse the matrix
   * @param target Target matrix to save in.
   * @return The solution x
   */
  reverse(t = new Qe()) {
    const i = Zh;
    let n, o;
    for (n = 0; n < 3; n++)
      for (o = 0; o < 3; o++)
        i[n + 6 * o] = this.elements[n + 3 * o];
    i[3] = 1, i[9] = 0, i[15] = 0, i[4] = 0, i[10] = 1, i[16] = 0, i[5] = 0, i[11] = 0, i[17] = 1;
    let r = 3;
    const a = r;
    let c;
    const l = 6;
    let m;
    do {
      if (n = a - r, i[n + 6 * n] === 0) {
        for (o = n + 1; o < a; o++)
          if (i[n + 6 * o] !== 0) {
            c = l;
            do
              m = l - c, i[m + 6 * n] += i[m + 6 * o];
            while (--c);
            break;
          }
      }
      if (i[n + 6 * n] !== 0)
        for (o = n + 1; o < a; o++) {
          const h = i[n + 6 * o] / i[n + 6 * n];
          c = l;
          do
            m = l - c, i[m + 6 * o] = m <= n ? 0 : i[m + 6 * o] - i[m + 6 * n] * h;
          while (--c);
        }
    } while (--r);
    n = 2;
    do {
      o = n - 1;
      do {
        const h = i[n + 6 * o] / i[n + 6 * n];
        c = 6;
        do
          m = 6 - c, i[m + 6 * o] = i[m + 6 * o] - i[m + 6 * n] * h;
        while (--c);
      } while (o--);
    } while (--n);
    n = 2;
    do {
      const h = 1 / i[n + 6 * n];
      c = 6;
      do
        m = 6 - c, i[m + 6 * n] = i[m + 6 * n] * h;
      while (--c);
    } while (n--);
    n = 2;
    do {
      o = 2;
      do {
        if (m = i[3 + o + 6 * n], isNaN(m) || m === 1 / 0)
          throw `Could not reverse! A=[${this.toString()}]`;
        t.e(n, o, m);
      } while (o--);
    } while (n--);
    return t;
  }
  /**
   * Set the matrix from a quaterion
   */
  setRotationFromQuaternion(t) {
    const e = t.x, s = t.y, i = t.z, n = t.w, o = e + e, r = s + s, a = i + i, c = e * o, l = e * r, m = e * a, h = s * r, u = s * a, d = i * a, f = n * o, y = n * r, v = n * a, g = this.elements;
    return g[0] = 1 - (h + d), g[1] = l - v, g[2] = m + y, g[3] = l + v, g[4] = 1 - (c + d), g[5] = u - f, g[6] = m - y, g[7] = u + f, g[8] = 1 - (c + h), this;
  }
  /**
   * Transpose the matrix
   * @param target Optional. Where to store the result.
   * @return The target Mat3, or a new Mat3 if target was omitted.
   */
  transpose(t = new Qe()) {
    const e = this.elements, s = t.elements;
    let i;
    return s[0] = e[0], s[4] = e[4], s[8] = e[8], i = e[1], s[1] = e[3], s[3] = i, i = e[2], s[2] = e[6], s[6] = i, i = e[5], s[5] = e[7], s[7] = i, t;
  }
}
const Zh = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
class x {
  x;
  y;
  z;
  static ZERO;
  static UNIT_X;
  static UNIT_Y;
  static UNIT_Z;
  constructor(t = 0, e = 0, s = 0) {
    this.x = t, this.y = e, this.z = s;
  }
  /**
   * Vector cross product
   * @param target Optional target to save in.
   */
  cross(t, e = new x()) {
    const s = t.x, i = t.y, n = t.z, o = this.x, r = this.y, a = this.z;
    return e.x = r * n - a * i, e.y = a * s - o * n, e.z = o * i - r * s, e;
  }
  /**
   * Set the vectors' 3 elements
   */
  set(t, e, s) {
    return this.x = t, this.y = e, this.z = s, this;
  }
  /**
   * Set all components of the vector to zero.
   */
  setZero() {
    this.x = this.y = this.z = 0;
  }
  vadd(t, e) {
    if (e)
      e.x = t.x + this.x, e.y = t.y + this.y, e.z = t.z + this.z;
    else
      return new x(this.x + t.x, this.y + t.y, this.z + t.z);
  }
  vsub(t, e) {
    if (e)
      e.x = this.x - t.x, e.y = this.y - t.y, e.z = this.z - t.z;
    else
      return new x(this.x - t.x, this.y - t.y, this.z - t.z);
  }
  /**
   * Get the cross product matrix a_cross from a vector, such that a x b = a_cross * b = c
   *
   * See {@link https://www8.cs.umu.se/kurser/TDBD24/VT06/lectures/Lecture6.pdf Umeå University Lecture}
   */
  crossmat() {
    return new Qe([0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0]);
  }
  /**
     * Normalize the vector. Note that this changes the values in the vector.
  
     * @return Returns the norm of the vector
     */
  normalize() {
    const t = this.x, e = this.y, s = this.z, i = Math.sqrt(t * t + e * e + s * s);
    if (i > 0) {
      const n = 1 / i;
      this.x *= n, this.y *= n, this.z *= n;
    } else
      this.x = 0, this.y = 0, this.z = 0;
    return i;
  }
  /**
   * Get the version of this vector that is of length 1.
   * @param target Optional target to save in
   * @return Returns the unit vector
   */
  unit(t = new x()) {
    const e = this.x, s = this.y, i = this.z;
    let n = Math.sqrt(e * e + s * s + i * i);
    return n > 0 ? (n = 1 / n, t.x = e * n, t.y = s * n, t.z = i * n) : (t.x = 1, t.y = 0, t.z = 0), t;
  }
  /**
   * Get the length of the vector
   */
  length() {
    const t = this.x, e = this.y, s = this.z;
    return Math.sqrt(t * t + e * e + s * s);
  }
  /**
   * Get the squared length of the vector.
   */
  lengthSquared() {
    return this.dot(this);
  }
  /**
   * Get distance from this point to another point
   */
  distanceTo(t) {
    const e = this.x, s = this.y, i = this.z, n = t.x, o = t.y, r = t.z;
    return Math.sqrt((n - e) * (n - e) + (o - s) * (o - s) + (r - i) * (r - i));
  }
  /**
   * Get squared distance from this point to another point
   */
  distanceSquared(t) {
    const e = this.x, s = this.y, i = this.z, n = t.x, o = t.y, r = t.z;
    return (n - e) * (n - e) + (o - s) * (o - s) + (r - i) * (r - i);
  }
  /**
   * Multiply all the components of the vector with a scalar.
   * @param target The vector to save the result in.
   */
  scale(t, e = new x()) {
    const s = this.x, i = this.y, n = this.z;
    return e.x = t * s, e.y = t * i, e.z = t * n, e;
  }
  /**
   * Multiply the vector with an other vector, component-wise.
   * @param target The vector to save the result in.
   */
  vmul(t, e = new x()) {
    return e.x = t.x * this.x, e.y = t.y * this.y, e.z = t.z * this.z, e;
  }
  /**
   * Scale a vector and add it to this vector. Save the result in "target". (target = this + vector * scalar)
   * @param target The vector to save the result in.
   */
  addScaledVector(t, e, s = new x()) {
    return s.x = this.x + t * e.x, s.y = this.y + t * e.y, s.z = this.z + t * e.z, s;
  }
  /**
   * Calculate dot product
   * @param vector
   */
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  isZero() {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }
  /**
   * Make the vector point in the opposite direction.
   * @param target Optional target to save in
   */
  negate(t = new x()) {
    return t.x = -this.x, t.y = -this.y, t.z = -this.z, t;
  }
  /**
   * Compute two artificial tangents to the vector
   * @param t1 Vector object to save the first tangent in
   * @param t2 Vector object to save the second tangent in
   */
  tangents(t, e) {
    const s = this.length();
    if (s > 0) {
      const i = Jh, n = 1 / s;
      i.set(this.x * n, this.y * n, this.z * n);
      const o = Qh;
      Math.abs(i.x) < 0.9 ? (o.set(1, 0, 0), i.cross(o, t)) : (o.set(0, 1, 0), i.cross(o, t)), i.cross(t, e);
    } else
      t.set(1, 0, 0), e.set(0, 1, 0);
  }
  /**
   * Converts to a more readable format
   */
  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
  /**
   * Converts to an array
   */
  toArray() {
    return [this.x, this.y, this.z];
  }
  /**
   * Copies value of source to this vector.
   */
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  /**
   * Do a linear interpolation between two vectors
   * @param t A number between 0 and 1. 0 will make this function return u, and 1 will make it return v. Numbers in between will generate a vector in between them.
   */
  lerp(t, e, s) {
    const i = this.x, n = this.y, o = this.z;
    s.x = i + (t.x - i) * e, s.y = n + (t.y - n) * e, s.z = o + (t.z - o) * e;
  }
  /**
   * Check if a vector equals is almost equal to another one.
   */
  almostEquals(t, e = 1e-6) {
    return !(Math.abs(this.x - t.x) > e || Math.abs(this.y - t.y) > e || Math.abs(this.z - t.z) > e);
  }
  /**
   * Check if a vector is almost zero
   */
  almostZero(t = 1e-6) {
    return !(Math.abs(this.x) > t || Math.abs(this.y) > t || Math.abs(this.z) > t);
  }
  /**
   * Check if the vector is anti-parallel to another vector.
   * @param precision Set to zero for exact comparisons
   */
  isAntiparallelTo(t, e) {
    return this.negate(wa), wa.almostEquals(t, e);
  }
  /**
   * Clone the vector
   */
  clone() {
    return new x(this.x, this.y, this.z);
  }
}
x.ZERO = new x(0, 0, 0);
x.UNIT_X = new x(1, 0, 0);
x.UNIT_Y = new x(0, 1, 0);
x.UNIT_Z = new x(0, 0, 1);
const Jh = new x(), Qh = new x(), wa = new x();
class Mt {
  /**
   * The lower bound of the bounding box
   */
  lowerBound;
  /**
   * The upper bound of the bounding box
   */
  upperBound;
  constructor(t = {}) {
    this.lowerBound = new x(), this.upperBound = new x(), t.lowerBound && this.lowerBound.copy(t.lowerBound), t.upperBound && this.upperBound.copy(t.upperBound);
  }
  /**
   * Set the AABB bounds from a set of points.
   * @param points An array of Vec3's.
   * @return The self object
   */
  setFromPoints(t, e, s, i) {
    const n = this.lowerBound, o = this.upperBound, r = s;
    n.copy(t[0]), r && r.vmult(n, n), o.copy(n);
    for (let a = 1; a < t.length; a++) {
      let c = t[a];
      r && (r.vmult(c, Sa), c = Sa), c.x > o.x && (o.x = c.x), c.x < n.x && (n.x = c.x), c.y > o.y && (o.y = c.y), c.y < n.y && (n.y = c.y), c.z > o.z && (o.z = c.z), c.z < n.z && (n.z = c.z);
    }
    return e && (e.vadd(n, n), e.vadd(o, o)), i && (n.x -= i, n.y -= i, n.z -= i, o.x += i, o.y += i, o.z += i), this;
  }
  /**
   * Copy bounds from an AABB to this AABB
   * @param aabb Source to copy from
   * @return The this object, for chainability
   */
  copy(t) {
    return this.lowerBound.copy(t.lowerBound), this.upperBound.copy(t.upperBound), this;
  }
  /**
   * Clone an AABB
   */
  clone() {
    return new Mt().copy(this);
  }
  /**
   * Extend this AABB so that it covers the given AABB too.
   */
  extend(t) {
    this.lowerBound.x = Math.min(this.lowerBound.x, t.lowerBound.x), this.upperBound.x = Math.max(this.upperBound.x, t.upperBound.x), this.lowerBound.y = Math.min(this.lowerBound.y, t.lowerBound.y), this.upperBound.y = Math.max(this.upperBound.y, t.upperBound.y), this.lowerBound.z = Math.min(this.lowerBound.z, t.lowerBound.z), this.upperBound.z = Math.max(this.upperBound.z, t.upperBound.z);
  }
  /**
   * Returns true if the given AABB overlaps this AABB.
   */
  overlaps(t) {
    const e = this.lowerBound, s = this.upperBound, i = t.lowerBound, n = t.upperBound, o = i.x <= s.x && s.x <= n.x || e.x <= n.x && n.x <= s.x, r = i.y <= s.y && s.y <= n.y || e.y <= n.y && n.y <= s.y, a = i.z <= s.z && s.z <= n.z || e.z <= n.z && n.z <= s.z;
    return o && r && a;
  }
  // Mostly for debugging
  volume() {
    const t = this.lowerBound, e = this.upperBound;
    return (e.x - t.x) * (e.y - t.y) * (e.z - t.z);
  }
  /**
   * Returns true if the given AABB is fully contained in this AABB.
   */
  contains(t) {
    const e = this.lowerBound, s = this.upperBound, i = t.lowerBound, n = t.upperBound;
    return e.x <= i.x && s.x >= n.x && e.y <= i.y && s.y >= n.y && e.z <= i.z && s.z >= n.z;
  }
  getCorners(t, e, s, i, n, o, r, a) {
    const c = this.lowerBound, l = this.upperBound;
    t.copy(c), e.set(l.x, c.y, c.z), s.set(l.x, l.y, c.z), i.set(c.x, l.y, l.z), n.set(l.x, c.y, l.z), o.set(c.x, l.y, c.z), r.set(c.x, c.y, l.z), a.copy(l);
  }
  /**
   * Get the representation of an AABB in another frame.
   * @return The "target" AABB object.
   */
  toLocalFrame(t, e) {
    const s = Ca, i = s[0], n = s[1], o = s[2], r = s[3], a = s[4], c = s[5], l = s[6], m = s[7];
    this.getCorners(i, n, o, r, a, c, l, m);
    for (let h = 0; h !== 8; h++) {
      const u = s[h];
      t.pointToLocal(u, u);
    }
    return e.setFromPoints(s);
  }
  /**
   * Get the representation of an AABB in the global frame.
   * @return The "target" AABB object.
   */
  toWorldFrame(t, e) {
    const s = Ca, i = s[0], n = s[1], o = s[2], r = s[3], a = s[4], c = s[5], l = s[6], m = s[7];
    this.getCorners(i, n, o, r, a, c, l, m);
    for (let h = 0; h !== 8; h++) {
      const u = s[h];
      t.pointToWorld(u, u);
    }
    return e.setFromPoints(s);
  }
  /**
   * Check if the AABB is hit by a ray.
   */
  overlapsRay(t) {
    const { direction: e, from: s } = t, i = 1 / e.x, n = 1 / e.y, o = 1 / e.z, r = (this.lowerBound.x - s.x) * i, a = (this.upperBound.x - s.x) * i, c = (this.lowerBound.y - s.y) * n, l = (this.upperBound.y - s.y) * n, m = (this.lowerBound.z - s.z) * o, h = (this.upperBound.z - s.z) * o, u = Math.max(Math.max(Math.min(r, a), Math.min(c, l)), Math.min(m, h)), d = Math.min(Math.min(Math.max(r, a), Math.max(c, l)), Math.max(m, h));
    return !(d < 0 || u > d);
  }
}
const Sa = new x(), Ca = [
  new x(),
  new x(),
  new x(),
  new x(),
  new x(),
  new x(),
  new x(),
  new x()
];
class ur {
  /**
   * The matrix storage.
   */
  matrix;
  constructor() {
    this.matrix = [];
  }
  /**
   * Get an element
   */
  get(t, e) {
    let { index: s } = t, { index: i } = e;
    if (i > s) {
      const n = i;
      i = s, s = n;
    }
    return this.matrix[(s * (s + 1) >> 1) + i - 1];
  }
  /**
   * Set an element
   */
  set(t, e, s) {
    let { index: i } = t, { index: n } = e;
    if (n > i) {
      const o = n;
      n = i, i = o;
    }
    this.matrix[(i * (i + 1) >> 1) + n - 1] = s ? 1 : 0;
  }
  /**
   * Sets all elements to zero
   */
  reset() {
    for (let t = 0, e = this.matrix.length; t !== e; t++)
      this.matrix[t] = 0;
  }
  /**
   * Sets the max number of objects
   */
  setNumObjects(t) {
    this.matrix.length = t * (t - 1) >> 1;
  }
}
class Vr {
  _listeners;
  /**
   * Add an event listener
   * @return The self object, for chainability.
   */
  addEventListener(t, e) {
    this._listeners === void 0 && (this._listeners = {});
    const s = this._listeners;
    return s[t] === void 0 && (s[t] = []), s[t].includes(e) || s[t].push(e), this;
  }
  /**
   * Check if an event listener is added
   */
  hasEventListener(t, e) {
    if (this._listeners === void 0)
      return !1;
    const s = this._listeners;
    return !!(s[t] !== void 0 && s[t].includes(e));
  }
  /**
   * Check if any event listener of the given type is added
   */
  hasAnyEventListener(t) {
    return this._listeners === void 0 ? !1 : this._listeners[t] !== void 0;
  }
  /**
   * Remove an event listener
   * @return The self object, for chainability.
   */
  removeEventListener(t, e) {
    if (this._listeners === void 0)
      return this;
    const s = this._listeners;
    if (s[t] === void 0)
      return this;
    const i = s[t].indexOf(e);
    return i !== -1 && s[t].splice(i, 1), this;
  }
  /**
   * Emit an event.
   * @return The self object, for chainability.
   */
  dispatchEvent(t) {
    if (this._listeners === void 0)
      return this;
    const s = this._listeners[t.type];
    if (s !== void 0) {
      t.target = this;
      for (let i = 0, n = s.length; i < n; i++)
        s[i].call(this, t);
    }
    return this;
  }
}
class Rt {
  x;
  y;
  z;
  w;
  constructor(t = 0, e = 0, s = 0, i = 1) {
    this.x = t, this.y = e, this.z = s, this.w = i;
  }
  /**
   * Set the value of the quaternion.
   */
  set(t, e, s, i) {
    return this.x = t, this.y = e, this.z = s, this.w = i, this;
  }
  /**
   * Convert to a readable format
   * @return "x,y,z,w"
   */
  toString() {
    return `${this.x},${this.y},${this.z},${this.w}`;
  }
  /**
   * Convert to an Array
   * @return [x, y, z, w]
   */
  toArray() {
    return [this.x, this.y, this.z, this.w];
  }
  /**
   * Set the quaternion components given an axis and an angle in radians.
   */
  setFromAxisAngle(t, e) {
    const s = Math.sin(e * 0.5);
    return this.x = t.x * s, this.y = t.y * s, this.z = t.z * s, this.w = Math.cos(e * 0.5), this;
  }
  /**
   * Converts the quaternion to [ axis, angle ] representation.
   * @param targetAxis A vector object to reuse for storing the axis.
   * @return An array, first element is the axis and the second is the angle in radians.
   */
  toAxisAngle(t = new x()) {
    this.normalize();
    const e = 2 * Math.acos(this.w), s = Math.sqrt(1 - this.w * this.w);
    return s < 1e-3 ? (t.x = this.x, t.y = this.y, t.z = this.z) : (t.x = this.x / s, t.y = this.y / s, t.z = this.z / s), [t, e];
  }
  /**
   * Set the quaternion value given two vectors. The resulting rotation will be the needed rotation to rotate u to v.
   */
  setFromVectors(t, e) {
    if (t.isAntiparallelTo(e)) {
      const s = tm, i = em;
      t.tangents(s, i), this.setFromAxisAngle(s, Math.PI);
    } else {
      const s = t.cross(e);
      this.x = s.x, this.y = s.y, this.z = s.z, this.w = Math.sqrt(t.length() ** 2 * e.length() ** 2) + t.dot(e), this.normalize();
    }
    return this;
  }
  /**
   * Multiply the quaternion with an other quaternion.
   */
  mult(t, e = new Rt()) {
    const s = this.x, i = this.y, n = this.z, o = this.w, r = t.x, a = t.y, c = t.z, l = t.w;
    return e.x = s * l + o * r + i * c - n * a, e.y = i * l + o * a + n * r - s * c, e.z = n * l + o * c + s * a - i * r, e.w = o * l - s * r - i * a - n * c, e;
  }
  /**
   * Get the inverse quaternion rotation.
   */
  inverse(t = new Rt()) {
    const e = this.x, s = this.y, i = this.z, n = this.w;
    this.conjugate(t);
    const o = 1 / (e * e + s * s + i * i + n * n);
    return t.x *= o, t.y *= o, t.z *= o, t.w *= o, t;
  }
  /**
   * Get the quaternion conjugate
   */
  conjugate(t = new Rt()) {
    return t.x = -this.x, t.y = -this.y, t.z = -this.z, t.w = this.w, t;
  }
  /**
   * Normalize the quaternion. Note that this changes the values of the quaternion.
   */
  normalize() {
    let t = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    return t === 0 ? (this.x = 0, this.y = 0, this.z = 0, this.w = 0) : (t = 1 / t, this.x *= t, this.y *= t, this.z *= t, this.w *= t), this;
  }
  /**
   * Approximation of quaternion normalization. Works best when quat is already almost-normalized.
   * @author unphased, https://github.com/unphased
   */
  normalizeFast() {
    const t = (3 - (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)) / 2;
    return t === 0 ? (this.x = 0, this.y = 0, this.z = 0, this.w = 0) : (this.x *= t, this.y *= t, this.z *= t, this.w *= t), this;
  }
  /**
   * Multiply the quaternion by a vector
   */
  vmult(t, e = new x()) {
    const s = t.x, i = t.y, n = t.z, o = this.x, r = this.y, a = this.z, c = this.w, l = c * s + r * n - a * i, m = c * i + a * s - o * n, h = c * n + o * i - r * s, u = -o * s - r * i - a * n;
    return e.x = l * c + u * -o + m * -a - h * -r, e.y = m * c + u * -r + h * -o - l * -a, e.z = h * c + u * -a + l * -r - m * -o, e;
  }
  /**
   * Copies value of source to this quaternion.
   * @return this
   */
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this;
  }
  /**
   * Convert the quaternion to euler angle representation. Order: YZX, as this page describes: https://www.euclideanspace.com/maths/standards/index.htm
   * @param order Three-character string, defaults to "YZX"
   */
  toEuler(t, e = "YZX") {
    let s, i, n;
    const o = this.x, r = this.y, a = this.z, c = this.w;
    switch (e) {
      case "YZX":
        const l = o * r + a * c;
        if (l > 0.499 && (s = 2 * Math.atan2(o, c), i = Math.PI / 2, n = 0), l < -0.499 && (s = -2 * Math.atan2(o, c), i = -Math.PI / 2, n = 0), s === void 0) {
          const m = o * o, h = r * r, u = a * a;
          s = Math.atan2(2 * r * c - 2 * o * a, 1 - 2 * h - 2 * u), i = Math.asin(2 * l), n = Math.atan2(2 * o * c - 2 * r * a, 1 - 2 * m - 2 * u);
        }
        break;
      default:
        throw new Error(`Euler order ${e} not supported yet.`);
    }
    t.y = s, t.z = i, t.x = n;
  }
  /**
   * Set the quaternion components given Euler angle representation.
   *
   * @param order The order to apply angles: 'XYZ' or 'YXZ' or any other combination.
   *
   * See {@link https://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors MathWorks} reference
   */
  setFromEuler(t, e, s, i = "XYZ") {
    const n = Math.cos(t / 2), o = Math.cos(e / 2), r = Math.cos(s / 2), a = Math.sin(t / 2), c = Math.sin(e / 2), l = Math.sin(s / 2);
    return i === "XYZ" ? (this.x = a * o * r + n * c * l, this.y = n * c * r - a * o * l, this.z = n * o * l + a * c * r, this.w = n * o * r - a * c * l) : i === "YXZ" ? (this.x = a * o * r + n * c * l, this.y = n * c * r - a * o * l, this.z = n * o * l - a * c * r, this.w = n * o * r + a * c * l) : i === "ZXY" ? (this.x = a * o * r - n * c * l, this.y = n * c * r + a * o * l, this.z = n * o * l + a * c * r, this.w = n * o * r - a * c * l) : i === "ZYX" ? (this.x = a * o * r - n * c * l, this.y = n * c * r + a * o * l, this.z = n * o * l - a * c * r, this.w = n * o * r + a * c * l) : i === "YZX" ? (this.x = a * o * r + n * c * l, this.y = n * c * r + a * o * l, this.z = n * o * l - a * c * r, this.w = n * o * r - a * c * l) : i === "XZY" && (this.x = a * o * r - n * c * l, this.y = n * c * r - a * o * l, this.z = n * o * l + a * c * r, this.w = n * o * r + a * c * l), this;
  }
  clone() {
    return new Rt(this.x, this.y, this.z, this.w);
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param toQuat second operand
   * @param t interpolation amount between the self quaternion and toQuat
   * @param target A quaternion to store the result in. If not provided, a new one will be created.
   * @returns {Quaternion} The "target" object
   */
  slerp(t, e, s = new Rt()) {
    const i = this.x, n = this.y, o = this.z, r = this.w;
    let a = t.x, c = t.y, l = t.z, m = t.w, h, u, d, f, y;
    return u = i * a + n * c + o * l + r * m, u < 0 && (u = -u, a = -a, c = -c, l = -l, m = -m), 1 - u > 1e-6 ? (h = Math.acos(u), d = Math.sin(h), f = Math.sin((1 - e) * h) / d, y = Math.sin(e * h) / d) : (f = 1 - e, y = e), s.x = f * i + y * a, s.y = f * n + y * c, s.z = f * o + y * l, s.w = f * r + y * m, s;
  }
  /**
   * Rotate an absolute orientation quaternion given an angular velocity and a time step.
   */
  integrate(t, e, s, i = new Rt()) {
    const n = t.x * s.x, o = t.y * s.y, r = t.z * s.z, a = this.x, c = this.y, l = this.z, m = this.w, h = e * 0.5;
    return i.x += h * (n * m + o * l - r * c), i.y += h * (o * m + r * a - n * l), i.z += h * (r * m + n * c - o * a), i.w += h * (-n * a - o * c - r * l), i;
  }
}
const tm = new x(), em = new x(), fc = {
  /** SPHERE */
  SPHERE: 1,
  /** PLANE */
  PLANE: 2,
  /** BOX */
  BOX: 4,
  /** COMPOUND */
  COMPOUND: 8,
  /** CONVEXPOLYHEDRON */
  CONVEXPOLYHEDRON: 16,
  /** HEIGHTFIELD */
  HEIGHTFIELD: 32,
  /** PARTICLE */
  PARTICLE: 64,
  /** CYLINDER */
  CYLINDER: 128,
  /** TRIMESH */
  TRIMESH: 256
};
class Y {
  /**
   * Identifier of the Shape.
   */
  id;
  /**
   * The type of this shape. Must be set to an int > 0 by subclasses.
   */
  type;
  /**
   * The local bounding sphere radius of this shape.
   */
  boundingSphereRadius;
  /**
   * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled.
   * @default true
   */
  collisionResponse;
  /**
   * @default 1
   */
  collisionFilterGroup;
  /**
   * @default -1
   */
  collisionFilterMask;
  /**
   * Optional material of the shape that regulates contact properties.
   */
  material;
  /**
   * The body to which the shape is added to.
   */
  body;
  static idCounter = 0;
  /**
   * All the Shape types.
   */
  static types = fc;
  constructor(t = {}) {
    this.id = Y.idCounter++, this.type = t.type || 0, this.boundingSphereRadius = 0, this.collisionResponse = t.collisionResponse ? t.collisionResponse : !0, this.collisionFilterGroup = t.collisionFilterGroup !== void 0 ? t.collisionFilterGroup : 1, this.collisionFilterMask = t.collisionFilterMask !== void 0 ? t.collisionFilterMask : -1, this.material = t.material ? t.material : null, this.body = null;
  }
  /**
   * Computes the bounding sphere radius.
   * The result is stored in the property `.boundingSphereRadius`
   */
  updateBoundingSphereRadius() {
    throw `computeBoundingSphereRadius() not implemented for shape type ${this.type}`;
  }
  /**
   * Get the volume of this shape
   */
  volume() {
    throw `volume() not implemented for shape type ${this.type}`;
  }
  /**
   * Calculates the inertia in the local frame for this shape.
   * @see http://en.wikipedia.org/wiki/List_of_moments_of_inertia
   */
  calculateLocalInertia(t, e) {
    throw `calculateLocalInertia() not implemented for shape type ${this.type}`;
  }
  /**
   * @todo use abstract for these kind of methods
   */
  calculateWorldAABB(t, e, s, i) {
    throw `calculateWorldAABB() not implemented for shape type ${this.type}`;
  }
}
class mt {
  /**
   * position
   */
  position;
  /**
   * quaternion
   */
  quaternion;
  constructor(t = {}) {
    this.position = new x(), this.quaternion = new Rt(), t.position && this.position.copy(t.position), t.quaternion && this.quaternion.copy(t.quaternion);
  }
  /**
   * Get a global point in local transform coordinates.
   */
  pointToLocal(t, e) {
    return mt.pointToLocalFrame(this.position, this.quaternion, t, e);
  }
  /**
   * Get a local point in global transform coordinates.
   */
  pointToWorld(t, e) {
    return mt.pointToWorldFrame(this.position, this.quaternion, t, e);
  }
  /**
   * vectorToWorldFrame
   */
  vectorToWorldFrame(t, e = new x()) {
    return this.quaternion.vmult(t, e), e;
  }
  /**
   * pointToLocalFrame
   */
  static pointToLocalFrame(t, e, s, i = new x()) {
    return s.vsub(t, i), e.conjugate(Ta), Ta.vmult(i, i), i;
  }
  /**
   * pointToWorldFrame
   */
  static pointToWorldFrame(t, e, s, i = new x()) {
    return e.vmult(s, i), i.vadd(t, i), i;
  }
  /**
   * vectorToWorldFrame
   */
  static vectorToWorldFrame(t, e, s = new x()) {
    return t.vmult(e, s), s;
  }
  /**
   * vectorToLocalFrame
   */
  static vectorToLocalFrame(t, e, s, i = new x()) {
    return e.w *= -1, e.vmult(s, i), e.w *= -1, i;
  }
}
const Ta = new Rt();
class Ps extends Y {
  /** vertices */
  vertices;
  /**
   * Array of integer arrays, indicating which vertices each face consists of
   */
  faces;
  /** faceNormals */
  faceNormals;
  /** worldVertices */
  worldVertices;
  /** worldVerticesNeedsUpdate */
  worldVerticesNeedsUpdate;
  /** worldFaceNormals */
  worldFaceNormals;
  /** worldFaceNormalsNeedsUpdate */
  worldFaceNormalsNeedsUpdate;
  /**
   * If given, these locally defined, normalized axes are the only ones being checked when doing separating axis check.
   */
  uniqueAxes;
  /** uniqueEdges */
  uniqueEdges;
  /**
   * @param vertices An array of Vec3's
   * @param faces Array of integer arrays, describing which vertices that is included in each face.
   */
  constructor(t = {}) {
    const { vertices: e = [], faces: s = [], normals: i = [], axes: n, boundingSphereRadius: o } = t;
    super({ type: Y.types.CONVEXPOLYHEDRON }), this.vertices = e, this.faces = s, this.faceNormals = i, this.faceNormals.length === 0 && this.computeNormals(), o ? this.boundingSphereRadius = o : this.updateBoundingSphereRadius(), this.worldVertices = [], this.worldVerticesNeedsUpdate = !0, this.worldFaceNormals = [], this.worldFaceNormalsNeedsUpdate = !0, this.uniqueAxes = n ? n.slice() : null, this.uniqueEdges = [], this.computeEdges();
  }
  /**
   * Computes uniqueEdges
   */
  computeEdges() {
    const t = this.faces, e = this.vertices, s = this.uniqueEdges;
    s.length = 0;
    const i = new x();
    for (let n = 0; n !== t.length; n++) {
      const o = t[n], r = o.length;
      for (let a = 0; a !== r; a++) {
        const c = (a + 1) % r;
        e[o[a]].vsub(e[o[c]], i), i.normalize();
        let l = !1;
        for (let m = 0; m !== s.length; m++)
          if (s[m].almostEquals(i) || s[m].almostEquals(i)) {
            l = !0;
            break;
          }
        l || s.push(i.clone());
      }
    }
  }
  /**
   * Compute the normals of the faces.
   * Will reuse existing Vec3 objects in the `faceNormals` array if they exist.
   */
  computeNormals() {
    this.faceNormals.length = this.faces.length;
    for (let t = 0; t < this.faces.length; t++) {
      for (let i = 0; i < this.faces[t].length; i++)
        if (!this.vertices[this.faces[t][i]])
          throw new Error(`Vertex ${this.faces[t][i]} not found!`);
      const e = this.faceNormals[t] || new x();
      this.getFaceNormal(t, e), e.negate(e), this.faceNormals[t] = e;
      const s = this.vertices[this.faces[t][0]];
      if (e.dot(s) < 0) {
        console.error(
          `.faceNormals[${t}] = Vec3(${e.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`
        );
        for (let i = 0; i < this.faces[t].length; i++)
          console.warn(`.vertices[${this.faces[t][i]}] = Vec3(${this.vertices[this.faces[t][i]].toString()})`);
      }
    }
  }
  /**
   * Compute the normal of a face from its vertices
   */
  getFaceNormal(t, e) {
    const s = this.faces[t], i = this.vertices[s[0]], n = this.vertices[s[1]], o = this.vertices[s[2]];
    Ps.computeNormal(i, n, o, e);
  }
  /**
   * Get face normal given 3 vertices
   */
  static computeNormal(t, e, s, i) {
    const n = new x(), o = new x();
    e.vsub(t, o), s.vsub(e, n), n.cross(o, i), i.isZero() || i.normalize();
  }
  /**
   * @param minDist Clamp distance
   * @param result The an array of contact point objects, see clipFaceAgainstHull
   */
  clipAgainstHull(t, e, s, i, n, o, r, a, c) {
    const l = new x();
    let m = -1, h = -Number.MAX_VALUE;
    for (let d = 0; d < s.faces.length; d++) {
      l.copy(s.faceNormals[d]), n.vmult(l, l);
      const f = l.dot(o);
      f > h && (h = f, m = d);
    }
    const u = [];
    for (let d = 0; d < s.faces[m].length; d++) {
      const f = s.vertices[s.faces[m][d]], y = new x();
      y.copy(f), n.vmult(y, y), i.vadd(y, y), u.push(y);
    }
    m >= 0 && this.clipFaceAgainstHull(o, t, e, u, r, a, c);
  }
  /**
   * Find the separating axis between this hull and another
   * @param target The target vector to save the axis in
   * @return Returns false if a separation is found, else true
   */
  findSeparatingAxis(t, e, s, i, n, o, r, a) {
    const c = new x(), l = new x(), m = new x(), h = new x(), u = new x(), d = new x();
    let f = Number.MAX_VALUE;
    const y = this;
    if (y.uniqueAxes)
      for (let v = 0; v !== y.uniqueAxes.length; v++) {
        s.vmult(y.uniqueAxes[v], c);
        const g = y.testSepAxis(c, t, e, s, i, n);
        if (g === !1)
          return !1;
        g < f && (f = g, o.copy(c));
      }
    else {
      const v = r ? r.length : y.faces.length;
      for (let g = 0; g < v; g++) {
        const A = r ? r[g] : g;
        c.copy(y.faceNormals[A]), s.vmult(c, c);
        const b = y.testSepAxis(c, t, e, s, i, n);
        if (b === !1)
          return !1;
        b < f && (f = b, o.copy(c));
      }
    }
    if (t.uniqueAxes)
      for (let v = 0; v !== t.uniqueAxes.length; v++) {
        n.vmult(t.uniqueAxes[v], l);
        const g = y.testSepAxis(l, t, e, s, i, n);
        if (g === !1)
          return !1;
        g < f && (f = g, o.copy(l));
      }
    else {
      const v = a ? a.length : t.faces.length;
      for (let g = 0; g < v; g++) {
        const A = a ? a[g] : g;
        l.copy(t.faceNormals[A]), n.vmult(l, l);
        const b = y.testSepAxis(l, t, e, s, i, n);
        if (b === !1)
          return !1;
        b < f && (f = b, o.copy(l));
      }
    }
    for (let v = 0; v !== y.uniqueEdges.length; v++) {
      s.vmult(y.uniqueEdges[v], h);
      for (let g = 0; g !== t.uniqueEdges.length; g++)
        if (n.vmult(t.uniqueEdges[g], u), h.cross(u, d), !d.almostZero()) {
          d.normalize();
          const A = y.testSepAxis(d, t, e, s, i, n);
          if (A === !1)
            return !1;
          A < f && (f = A, o.copy(d));
        }
    }
    return i.vsub(e, m), m.dot(o) > 0 && o.negate(o), !0;
  }
  /**
   * Test separating axis against two hulls. Both hulls are projected onto the axis and the overlap size is returned if there is one.
   * @return The overlap depth, or FALSE if no penetration.
   */
  testSepAxis(t, e, s, i, n, o) {
    const r = this;
    Ps.project(r, t, s, i, Zo), Ps.project(e, t, n, o, Jo);
    const a = Zo[0], c = Zo[1], l = Jo[0], m = Jo[1];
    if (a < m || l < c)
      return !1;
    const h = a - m, u = l - c;
    return h < u ? h : u;
  }
  /**
   * calculateLocalInertia
   */
  calculateLocalInertia(t, e) {
    const s = new x(), i = new x();
    this.computeLocalAABB(i, s);
    const n = s.x - i.x, o = s.y - i.y, r = s.z - i.z;
    e.x = 1 / 12 * t * (2 * o * 2 * o + 2 * r * 2 * r), e.y = 1 / 12 * t * (2 * n * 2 * n + 2 * r * 2 * r), e.z = 1 / 12 * t * (2 * o * 2 * o + 2 * n * 2 * n);
  }
  /**
   * @param face_i Index of the face
   */
  getPlaneConstantOfFace(t) {
    const e = this.faces[t], s = this.faceNormals[t], i = this.vertices[e[0]];
    return -s.dot(i);
  }
  /**
   * Clip a face against a hull.
   * @param worldVertsB1 An array of Vec3 with vertices in the world frame.
   * @param minDist Distance clamping
   * @param Array result Array to store resulting contact points in. Will be objects with properties: point, depth, normal. These are represented in world coordinates.
   */
  clipFaceAgainstHull(t, e, s, i, n, o, r) {
    const a = new x(), c = new x(), l = new x(), m = new x(), h = new x(), u = new x(), d = new x(), f = new x(), y = this, v = [], g = i, A = v;
    let b = -1, B = Number.MAX_VALUE;
    for (let F = 0; F < y.faces.length; F++) {
      a.copy(y.faceNormals[F]), s.vmult(a, a);
      const E = a.dot(t);
      E < B && (B = E, b = F);
    }
    if (b < 0)
      return;
    const w = y.faces[b];
    w.connectedFaces = [];
    for (let F = 0; F < y.faces.length; F++)
      for (let E = 0; E < y.faces[F].length; E++)
        /* Sharing a vertex*/
        w.indexOf(y.faces[F][E]) !== -1 && /* Not the one we are looking for connections from */
        F !== b && /* Not already added */
        w.connectedFaces.indexOf(F) === -1 && w.connectedFaces.push(F);
    const T = w.length;
    for (let F = 0; F < T; F++) {
      const E = y.vertices[w[F]], D = y.vertices[w[(F + 1) % T]];
      E.vsub(D, c), l.copy(c), s.vmult(l, l), e.vadd(l, l), m.copy(this.faceNormals[b]), s.vmult(m, m), e.vadd(m, m), l.cross(m, h), h.negate(h), u.copy(E), s.vmult(u, u), e.vadd(u, u);
      const V = w.connectedFaces[F];
      d.copy(this.faceNormals[V]);
      const k = this.getPlaneConstantOfFace(V);
      f.copy(d), s.vmult(f, f);
      const N = k - f.dot(e);
      for (this.clipFaceAgainstPlane(g, A, f, N); g.length; )
        g.shift();
      for (; A.length; )
        g.push(A.shift());
    }
    d.copy(this.faceNormals[b]);
    const M = this.getPlaneConstantOfFace(b);
    f.copy(d), s.vmult(f, f);
    const q = M - f.dot(e);
    for (let F = 0; F < g.length; F++) {
      let E = f.dot(g[F]) + q;
      if (E <= n && (console.log(`clamped: depth=${E} to minDist=${n}`), E = n), E <= o) {
        const D = g[F];
        if (E <= 1e-6) {
          const V = {
            point: D,
            normal: f,
            depth: E
          };
          r.push(V);
        }
      }
    }
  }
  /**
   * Clip a face in a hull against the back of a plane.
   * @param planeConstant The constant in the mathematical plane equation
   */
  clipFaceAgainstPlane(t, e, s, i) {
    let n, o;
    const r = t.length;
    if (r < 2)
      return e;
    let a = t[t.length - 1], c = t[0];
    n = s.dot(a) + i;
    for (let l = 0; l < r; l++) {
      if (c = t[l], o = s.dot(c) + i, n < 0)
        if (o < 0) {
          const m = new x();
          m.copy(c), e.push(m);
        } else {
          const m = new x();
          a.lerp(c, n / (n - o), m), e.push(m);
        }
      else if (o < 0) {
        const m = new x();
        a.lerp(c, n / (n - o), m), e.push(m), e.push(c);
      }
      a = c, n = o;
    }
    return e;
  }
  /**
   * Updates `.worldVertices` and sets `.worldVerticesNeedsUpdate` to false.
   */
  computeWorldVertices(t, e) {
    for (; this.worldVertices.length < this.vertices.length; )
      this.worldVertices.push(new x());
    const s = this.vertices, i = this.worldVertices;
    for (let n = 0; n !== this.vertices.length; n++)
      e.vmult(s[n], i[n]), t.vadd(i[n], i[n]);
    this.worldVerticesNeedsUpdate = !1;
  }
  computeLocalAABB(t, e) {
    const s = this.vertices;
    t.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE), e.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    for (let i = 0; i < this.vertices.length; i++) {
      const n = s[i];
      n.x < t.x ? t.x = n.x : n.x > e.x && (e.x = n.x), n.y < t.y ? t.y = n.y : n.y > e.y && (e.y = n.y), n.z < t.z ? t.z = n.z : n.z > e.z && (e.z = n.z);
    }
  }
  /**
   * Updates `worldVertices` and sets `worldVerticesNeedsUpdate` to false.
   */
  computeWorldFaceNormals(t) {
    const e = this.faceNormals.length;
    for (; this.worldFaceNormals.length < e; )
      this.worldFaceNormals.push(new x());
    const s = this.faceNormals, i = this.worldFaceNormals;
    for (let n = 0; n !== e; n++)
      t.vmult(s[n], i[n]);
    this.worldFaceNormalsNeedsUpdate = !1;
  }
  /**
   * updateBoundingSphereRadius
   */
  updateBoundingSphereRadius() {
    let t = 0;
    const e = this.vertices;
    for (let s = 0; s !== e.length; s++) {
      const i = e[s].lengthSquared();
      i > t && (t = i);
    }
    this.boundingSphereRadius = Math.sqrt(t);
  }
  /**
   * calculateWorldAABB
   */
  calculateWorldAABB(t, e, s, i) {
    const n = this.vertices;
    let o, r, a, c, l, m, h = new x();
    for (let u = 0; u < n.length; u++) {
      h.copy(n[u]), e.vmult(h, h), t.vadd(h, h);
      const d = h;
      (o === void 0 || d.x < o) && (o = d.x), (c === void 0 || d.x > c) && (c = d.x), (r === void 0 || d.y < r) && (r = d.y), (l === void 0 || d.y > l) && (l = d.y), (a === void 0 || d.z < a) && (a = d.z), (m === void 0 || d.z > m) && (m = d.z);
    }
    s.set(o, r, a), i.set(c, l, m);
  }
  /**
   * Get approximate convex volume
   */
  volume() {
    return 4 * Math.PI * this.boundingSphereRadius / 3;
  }
  /**
   * Get an average of all the vertices positions
   */
  getAveragePointLocal(t = new x()) {
    const e = this.vertices;
    for (let s = 0; s < e.length; s++)
      t.vadd(e[s], t);
    return t.scale(1 / e.length, t), t;
  }
  /**
   * Transform all local points. Will change the .vertices
   */
  transformAllPoints(t, e) {
    const s = this.vertices.length, i = this.vertices;
    if (e) {
      for (let n = 0; n < s; n++) {
        const o = i[n];
        e.vmult(o, o);
      }
      for (let n = 0; n < this.faceNormals.length; n++) {
        const o = this.faceNormals[n];
        e.vmult(o, o);
      }
    }
    if (t)
      for (let n = 0; n < s; n++) {
        const o = i[n];
        o.vadd(t, o);
      }
  }
  /**
   * Checks whether p is inside the polyhedra. Must be in local coords.
   * The point lies outside of the convex hull of the other points if and only if the direction
   * of all the vectors from it to those other points are on less than one half of a sphere around it.
   * @param p A point given in local coordinates
   */
  pointIsInside(t) {
    const e = this.vertices, s = this.faces, i = this.faceNormals, n = null, o = new x();
    this.getAveragePointLocal(o);
    for (let r = 0; r < this.faces.length; r++) {
      let a = i[r];
      const c = e[s[r][0]], l = new x();
      t.vsub(c, l);
      const m = a.dot(l), h = new x();
      o.vsub(c, h);
      const u = a.dot(h);
      if (m < 0 && u > 0 || m > 0 && u < 0)
        return !1;
    }
    return n ? 1 : -1;
  }
  /**
   * Get max and min dot product of a convex hull at position (pos,quat) projected onto an axis.
   * Results are saved in the array maxmin.
   * @param result result[0] and result[1] will be set to maximum and minimum, respectively.
   */
  static project(t, e, s, i, n) {
    const o = t.vertices.length, r = sm;
    let a = 0, c = 0;
    const l = im, m = t.vertices;
    l.setZero(), mt.vectorToLocalFrame(s, i, e, r), mt.pointToLocalFrame(s, i, l, l);
    const h = l.dot(r);
    c = a = m[0].dot(r);
    for (let u = 1; u < o; u++) {
      const d = m[u].dot(r);
      d > a && (a = d), d < c && (c = d);
    }
    if (c -= h, a -= h, c > a) {
      const u = c;
      c = a, a = u;
    }
    n[0] = a, n[1] = c;
  }
}
const Zo = [], Jo = [], sm = new x(), im = new x();
class xn extends Y {
  /**
   * The half extents of the box.
   */
  halfExtents;
  /**
   * Used by the contact generator to make contacts with other convex polyhedra for example.
   */
  convexPolyhedronRepresentation;
  constructor(t) {
    super({ type: Y.types.BOX }), this.halfExtents = t, this.convexPolyhedronRepresentation = null, this.updateConvexPolyhedronRepresentation(), this.updateBoundingSphereRadius();
  }
  /**
   * Updates the local convex polyhedron representation used for some collisions.
   */
  updateConvexPolyhedronRepresentation() {
    const t = this.halfExtents.x, e = this.halfExtents.y, s = this.halfExtents.z, i = x, n = [
      new i(-t, -e, -s),
      new i(t, -e, -s),
      new i(t, e, -s),
      new i(-t, e, -s),
      new i(-t, -e, s),
      new i(t, -e, s),
      new i(t, e, s),
      new i(-t, e, s)
    ], o = [
      [3, 2, 1, 0],
      // -z
      [4, 5, 6, 7],
      // +z
      [5, 4, 0, 1],
      // -y
      [2, 3, 7, 6],
      // +y
      [0, 4, 7, 3],
      // -x
      [1, 2, 6, 5]
      // +x
    ], r = [new i(0, 0, 1), new i(0, 1, 0), new i(1, 0, 0)], a = new Ps({ vertices: n, faces: o, axes: r });
    this.convexPolyhedronRepresentation = a, a.material = this.material;
  }
  /**
   * Calculate the inertia of the box.
   */
  calculateLocalInertia(t, e = new x()) {
    return xn.calculateInertia(this.halfExtents, t, e), e;
  }
  static calculateInertia(t, e, s) {
    const i = t;
    s.x = 1 / 12 * e * (2 * i.y * 2 * i.y + 2 * i.z * 2 * i.z), s.y = 1 / 12 * e * (2 * i.x * 2 * i.x + 2 * i.z * 2 * i.z), s.z = 1 / 12 * e * (2 * i.y * 2 * i.y + 2 * i.x * 2 * i.x);
  }
  /**
   * Get the box 6 side normals
   * @param sixTargetVectors An array of 6 vectors, to store the resulting side normals in.
   * @param quat Orientation to apply to the normal vectors. If not provided, the vectors will be in respect to the local frame.
   */
  getSideNormals(t, e) {
    const s = t, i = this.halfExtents;
    if (s[0].set(i.x, 0, 0), s[1].set(0, i.y, 0), s[2].set(0, 0, i.z), s[3].set(-i.x, 0, 0), s[4].set(0, -i.y, 0), s[5].set(0, 0, -i.z), e !== void 0)
      for (let n = 0; n !== s.length; n++)
        e.vmult(s[n], s[n]);
    return s;
  }
  /**
   * Returns the volume of the box.
   */
  volume() {
    return 8 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z;
  }
  /**
   * updateBoundingSphereRadius
   */
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = this.halfExtents.length();
  }
  /**
   * forEachWorldCorner
   */
  forEachWorldCorner(t, e, s) {
    const i = this.halfExtents, n = [
      [i.x, i.y, i.z],
      [-i.x, i.y, i.z],
      [-i.x, -i.y, i.z],
      [-i.x, -i.y, -i.z],
      [i.x, -i.y, -i.z],
      [i.x, i.y, -i.z],
      [-i.x, i.y, -i.z],
      [i.x, -i.y, i.z]
    ];
    for (let o = 0; o < n.length; o++)
      Ns.set(n[o][0], n[o][1], n[o][2]), e.vmult(Ns, Ns), t.vadd(Ns, Ns), s(Ns.x, Ns.y, Ns.z);
  }
  /**
   * calculateWorldAABB
   */
  calculateWorldAABB(t, e, s, i) {
    const n = this.halfExtents;
    ls[0].set(n.x, n.y, n.z), ls[1].set(-n.x, n.y, n.z), ls[2].set(-n.x, -n.y, n.z), ls[3].set(-n.x, -n.y, -n.z), ls[4].set(n.x, -n.y, -n.z), ls[5].set(n.x, n.y, -n.z), ls[6].set(-n.x, n.y, -n.z), ls[7].set(n.x, -n.y, n.z);
    const o = ls[0];
    e.vmult(o, o), t.vadd(o, o), i.copy(o), s.copy(o);
    for (let r = 1; r < 8; r++) {
      const a = ls[r];
      e.vmult(a, a), t.vadd(a, a);
      const c = a.x, l = a.y, m = a.z;
      c > i.x && (i.x = c), l > i.y && (i.y = l), m > i.z && (i.z = m), c < s.x && (s.x = c), l < s.y && (s.y = l), m < s.z && (s.z = m);
    }
  }
}
const Ns = new x(), ls = [
  new x(),
  new x(),
  new x(),
  new x(),
  new x(),
  new x(),
  new x(),
  new x()
], oo = {
  /** DYNAMIC */
  DYNAMIC: 1,
  /** STATIC */
  STATIC: 2,
  /** KINEMATIC */
  KINEMATIC: 4
}, ro = {
  /** AWAKE */
  AWAKE: 0,
  /** SLEEPY */
  SLEEPY: 1,
  /** SLEEPING */
  SLEEPING: 2
};
class G extends Vr {
  static idCounter = 0;
  /**
   * Dispatched after two bodies collide. This event is dispatched on each
   * of the two bodies involved in the collision.
   * @event collide
   * @param body The body that was involved in the collision.
   * @param contact The details of the collision.
   */
  static COLLIDE_EVENT_NAME = "collide";
  /**
   * A dynamic body is fully simulated. Can be moved manually by the user, but normally they move according to forces. A dynamic body can collide with all body types. A dynamic body always has finite, non-zero mass.
   */
  static DYNAMIC = oo.DYNAMIC;
  /**
   * A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
   */
  static STATIC = oo.STATIC;
  /**
   * A kinematic body moves under simulation according to its velocity. They do not respond to forces. They can be moved manually, but normally a kinematic body is moved by setting its velocity. A kinematic body behaves as if it has infinite mass. Kinematic bodies do not collide with other static or kinematic bodies.
   */
  static KINEMATIC = oo.KINEMATIC;
  /**
   * AWAKE
   */
  static AWAKE = ro.AWAKE;
  /**
   * SLEEPY
   */
  static SLEEPY = ro.SLEEPY;
  /**
   * SLEEPING
   */
  static SLEEPING = ro.SLEEPING;
  /**
   * Dispatched after a sleeping body has woken up.
   * @event wakeup
   */
  static wakeupEvent = { type: "wakeup" };
  /**
   * Dispatched after a body has gone in to the sleepy state.
   * @event sleepy
   */
  static sleepyEvent = { type: "sleepy" };
  /**
   * Dispatched after a body has fallen asleep.
   * @event sleep
   */
  static sleepEvent = { type: "sleep" };
  /**
   * Identifier of the body.
   */
  id;
  /**
   * Position of body in World.bodies. Updated by World and used in ArrayCollisionMatrix.
   */
  index;
  /**
   * Reference to the world the body is living in.
   */
  world;
  vlambda;
  /**
   * The collision group the body belongs to.
   * @default 1
   */
  collisionFilterGroup;
  /**
   * The collision group the body can collide with.
   * @default -1
   */
  collisionFilterMask;
  /**
   * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled - i.e. "collide" events will be raised, but forces will not be altered.
   */
  collisionResponse;
  /**
   * World space position of the body.
   */
  position;
  previousPosition;
  /**
   * Interpolated position of the body.
   */
  interpolatedPosition;
  /**
   * Initial position of the body.
   */
  initPosition;
  /**
   * World space velocity of the body.
   */
  velocity;
  /**
   * Initial velocity of the body.
   */
  initVelocity;
  /**
   * Linear force on the body in world space.
   */
  force;
  /**
   * The mass of the body.
   * @default 0
   */
  mass;
  invMass;
  /**
   * The physics material of the body. It defines the body interaction with other bodies.
   */
  material;
  /**
   * How much to damp the body velocity each step. It can go from 0 to 1.
   * @default 0.01
   */
  linearDamping;
  /**
   * One of: `Body.DYNAMIC`, `Body.STATIC` and `Body.KINEMATIC`.
   */
  type;
  /**
   * If true, the body will automatically fall to sleep.
   * @default true
   */
  allowSleep;
  /**
   * Current sleep state.
   */
  sleepState;
  /**
   * If the speed (the norm of the velocity) is smaller than this value, the body is considered sleepy.
   * @default 0.1
   */
  sleepSpeedLimit;
  /**
   * If the body has been sleepy for this sleepTimeLimit seconds, it is considered sleeping.
   * @default 1
   */
  sleepTimeLimit;
  timeLastSleepy;
  wakeUpAfterNarrowphase;
  /**
   * World space rotational force on the body, around center of mass.
   */
  torque;
  /**
   * World space orientation of the body.
   */
  quaternion;
  /**
   * Initial quaternion of the body.
   */
  initQuaternion;
  previousQuaternion;
  /**
   * Interpolated orientation of the body.
   */
  interpolatedQuaternion;
  /**
   * Angular velocity of the body, in world space. Think of the angular velocity as a vector, which the body rotates around. The length of this vector determines how fast (in radians per second) the body rotates.
   */
  angularVelocity;
  /**
   * Initial angular velocity of the body.
   */
  initAngularVelocity;
  /**
   * List of Shapes that have been added to the body.
   */
  shapes;
  /**
   * Position of each Shape in the body, given in local Body space.
   */
  shapeOffsets;
  /**
   * Orientation of each Shape, given in local Body space.
   */
  shapeOrientations;
  /**
   * The inertia of the body.
   */
  inertia;
  invInertia;
  invInertiaWorld;
  invMassSolve;
  invInertiaSolve;
  invInertiaWorldSolve;
  /**
   * Set to true if you don't want the body to rotate. Make sure to run .updateMassProperties() if you change this after the body creation.
   * @default false
   */
  fixedRotation;
  /**
   * How much to damp the body angular velocity each step. It can go from 0 to 1.
   * @default 0.01
   */
  angularDamping;
  /**
   * Use this property to limit the motion along any world axis. (1,1,1) will allow motion along all axes while (0,0,0) allows none.
   */
  linearFactor;
  /**
   * Use this property to limit the rotational motion along any world axis. (1,1,1) will allow rotation along all axes while (0,0,0) allows none.
   */
  angularFactor;
  /**
   * World space bounding box of the body and its shapes.
   */
  aabb;
  /**
   * Indicates if the AABB needs to be updated before use.
   */
  aabbNeedsUpdate;
  /**
   * Total bounding radius of the Body including its shapes, relative to body.position.
   */
  boundingRadius;
  wlambda;
  /**
   * When true the body behaves like a trigger. It does not collide
   * with other bodies but collision events are still triggered.
   * @default false
   */
  isTrigger;
  constructor(t = {}) {
    super(), this.id = G.idCounter++, this.index = -1, this.world = null, this.vlambda = new x(), this.collisionFilterGroup = typeof t.collisionFilterGroup == "number" ? t.collisionFilterGroup : 1, this.collisionFilterMask = typeof t.collisionFilterMask == "number" ? t.collisionFilterMask : -1, this.collisionResponse = typeof t.collisionResponse == "boolean" ? t.collisionResponse : !0, this.position = new x(), this.previousPosition = new x(), this.interpolatedPosition = new x(), this.initPosition = new x(), t.position && (this.position.copy(t.position), this.previousPosition.copy(t.position), this.interpolatedPosition.copy(t.position), this.initPosition.copy(t.position)), this.velocity = new x(), t.velocity && this.velocity.copy(t.velocity), this.initVelocity = new x(), this.force = new x();
    const e = typeof t.mass == "number" ? t.mass : 0;
    this.mass = e, this.invMass = e > 0 ? 1 / e : 0, this.material = t.material || null, this.linearDamping = typeof t.linearDamping == "number" ? t.linearDamping : 0.01, this.type = e <= 0 ? G.STATIC : G.DYNAMIC, typeof t.type == typeof G.STATIC && (this.type = t.type), this.allowSleep = typeof t.allowSleep < "u" ? t.allowSleep : !0, this.sleepState = G.AWAKE, this.sleepSpeedLimit = typeof t.sleepSpeedLimit < "u" ? t.sleepSpeedLimit : 0.1, this.sleepTimeLimit = typeof t.sleepTimeLimit < "u" ? t.sleepTimeLimit : 1, this.timeLastSleepy = 0, this.wakeUpAfterNarrowphase = !1, this.torque = new x(), this.quaternion = new Rt(), this.initQuaternion = new Rt(), this.previousQuaternion = new Rt(), this.interpolatedQuaternion = new Rt(), t.quaternion && (this.quaternion.copy(t.quaternion), this.initQuaternion.copy(t.quaternion), this.previousQuaternion.copy(t.quaternion), this.interpolatedQuaternion.copy(t.quaternion)), this.angularVelocity = new x(), t.angularVelocity && this.angularVelocity.copy(t.angularVelocity), this.initAngularVelocity = new x(), this.shapes = [], this.shapeOffsets = [], this.shapeOrientations = [], this.inertia = new x(), this.invInertia = new x(), this.invInertiaWorld = new Qe(), this.invMassSolve = 0, this.invInertiaSolve = new x(), this.invInertiaWorldSolve = new Qe(), this.fixedRotation = typeof t.fixedRotation < "u" ? t.fixedRotation : !1, this.angularDamping = typeof t.angularDamping < "u" ? t.angularDamping : 0.01, this.linearFactor = new x(1, 1, 1), t.linearFactor && this.linearFactor.copy(t.linearFactor), this.angularFactor = new x(1, 1, 1), t.angularFactor && this.angularFactor.copy(t.angularFactor), this.aabb = new Mt(), this.aabbNeedsUpdate = !0, this.boundingRadius = 0, this.wlambda = new x(), this.isTrigger = !!t.isTrigger, t.shape && this.addShape(t.shape), this.updateMassProperties();
  }
  /**
   * Wake the body up.
   */
  wakeUp() {
    const t = this.sleepState;
    this.sleepState = G.AWAKE, this.wakeUpAfterNarrowphase = !1, t === G.SLEEPING && this.dispatchEvent(G.wakeupEvent);
  }
  /**
   * Force body sleep
   */
  sleep() {
    this.sleepState = G.SLEEPING, this.velocity.set(0, 0, 0), this.angularVelocity.set(0, 0, 0), this.wakeUpAfterNarrowphase = !1;
  }
  /**
   * Called every timestep to update internal sleep timer and change sleep state if needed.
   * @param time The world time in seconds
   */
  sleepTick(t) {
    if (this.allowSleep) {
      const e = this.sleepState, s = this.velocity.lengthSquared() + this.angularVelocity.lengthSquared(), i = this.sleepSpeedLimit ** 2;
      e === G.AWAKE && s < i ? (this.sleepState = G.SLEEPY, this.timeLastSleepy = t, this.dispatchEvent(G.sleepyEvent)) : e === G.SLEEPY && s > i ? this.wakeUp() : e === G.SLEEPY && t - this.timeLastSleepy > this.sleepTimeLimit && (this.sleep(), this.dispatchEvent(G.sleepEvent));
    }
  }
  /**
   * If the body is sleeping, it should be immovable / have infinite mass during solve. We solve it by having a separate "solve mass".
   */
  updateSolveMassProperties() {
    this.sleepState === G.SLEEPING || this.type === G.KINEMATIC ? (this.invMassSolve = 0, this.invInertiaSolve.setZero(), this.invInertiaWorldSolve.setZero()) : (this.invMassSolve = this.invMass, this.invInertiaSolve.copy(this.invInertia), this.invInertiaWorldSolve.copy(this.invInertiaWorld));
  }
  /**
   * Convert a world point to local body frame.
   */
  pointToLocalFrame(t, e = new x()) {
    return t.vsub(this.position, e), this.quaternion.conjugate().vmult(e, e), e;
  }
  /**
   * Convert a world vector to local body frame.
   */
  vectorToLocalFrame(t, e = new x()) {
    return this.quaternion.conjugate().vmult(t, e), e;
  }
  /**
   * Convert a local body point to world frame.
   */
  pointToWorldFrame(t, e = new x()) {
    return this.quaternion.vmult(t, e), e.vadd(this.position, e), e;
  }
  /**
   * Convert a local body point to world frame.
   */
  vectorToWorldFrame(t, e = new x()) {
    return this.quaternion.vmult(t, e), e;
  }
  /**
   * Add a shape to the body with a local offset and orientation.
   * @return The body object, for chainability.
   */
  addShape(t, e, s) {
    const i = new x(), n = new Rt();
    return e && i.copy(e), s && n.copy(s), this.shapes.push(t), this.shapeOffsets.push(i), this.shapeOrientations.push(n), this.updateMassProperties(), this.updateBoundingRadius(), this.aabbNeedsUpdate = !0, t.body = this, this;
  }
  /**
   * Remove a shape from the body.
   * @return The body object, for chainability.
   */
  removeShape(t) {
    const e = this.shapes.indexOf(t);
    return e === -1 ? (console.warn("Shape does not belong to the body"), this) : (this.shapes.splice(e, 1), this.shapeOffsets.splice(e, 1), this.shapeOrientations.splice(e, 1), this.updateMassProperties(), this.updateBoundingRadius(), this.aabbNeedsUpdate = !0, t.body = null, this);
  }
  /**
   * Update the bounding radius of the body. Should be done if any of the shapes are changed.
   */
  updateBoundingRadius() {
    const t = this.shapes, e = this.shapeOffsets, s = t.length;
    let i = 0;
    for (let n = 0; n !== s; n++) {
      const o = t[n];
      o.updateBoundingSphereRadius();
      const r = e[n].length(), a = o.boundingSphereRadius;
      r + a > i && (i = r + a);
    }
    this.boundingRadius = i;
  }
  /**
   * Updates the .aabb
   */
  updateAABB() {
    const t = this.shapes, e = this.shapeOffsets, s = this.shapeOrientations, i = t.length, n = nm, o = om, r = this.quaternion, a = this.aabb, c = rm;
    for (let l = 0; l !== i; l++) {
      const m = t[l];
      r.vmult(e[l], n), n.vadd(this.position, n), r.mult(s[l], o), m.calculateWorldAABB(n, o, c.lowerBound, c.upperBound), l === 0 ? a.copy(c) : a.extend(c);
    }
    this.aabbNeedsUpdate = !1;
  }
  /**
   * Update `.inertiaWorld` and `.invInertiaWorld`
   */
  updateInertiaWorld(t) {
    const e = this.invInertia;
    if (!(e.x === e.y && e.y === e.z && !t)) {
      const s = am, i = cm;
      s.setRotationFromQuaternion(this.quaternion), s.transpose(i), s.scale(e, s), s.mmult(i, this.invInertiaWorld);
    }
  }
  /**
   * Apply force to a point of the body. This could for example be a point on the Body surface.
   * Applying force this way will add to Body.force and Body.torque.
   * @param force The amount of force to add.
   * @param relativePoint A point relative to the center of mass to apply the force on.
   */
  applyForce(t, e = new x()) {
    if (this.type !== G.DYNAMIC)
      return;
    this.sleepState === G.SLEEPING && this.wakeUp();
    const s = lm;
    e.cross(t, s), this.force.vadd(t, this.force), this.torque.vadd(s, this.torque);
  }
  /**
   * Apply force to a local point in the body.
   * @param force The force vector to apply, defined locally in the body frame.
   * @param localPoint A local point in the body to apply the force on.
   */
  applyLocalForce(t, e = new x()) {
    if (this.type !== G.DYNAMIC)
      return;
    const s = hm, i = mm;
    this.vectorToWorldFrame(t, s), this.vectorToWorldFrame(e, i), this.applyForce(s, i);
  }
  /**
   * Apply torque to the body.
   * @param torque The amount of torque to add.
   */
  applyTorque(t) {
    this.type === G.DYNAMIC && (this.sleepState === G.SLEEPING && this.wakeUp(), this.torque.vadd(t, this.torque));
  }
  /**
   * Apply impulse to a point of the body. This could for example be a point on the Body surface.
   * An impulse is a force added to a body during a short period of time (impulse = force * time).
   * Impulses will be added to Body.velocity and Body.angularVelocity.
   * @param impulse The amount of impulse to add.
   * @param relativePoint A point relative to the center of mass to apply the force on.
   */
  applyImpulse(t, e = new x()) {
    if (this.type !== G.DYNAMIC)
      return;
    this.sleepState === G.SLEEPING && this.wakeUp();
    const s = e, i = um;
    i.copy(t), i.scale(this.invMass, i), this.velocity.vadd(i, this.velocity);
    const n = dm;
    s.cross(t, n), this.invInertiaWorld.vmult(n, n), this.angularVelocity.vadd(n, this.angularVelocity);
  }
  /**
   * Apply locally-defined impulse to a local point in the body.
   * @param force The force vector to apply, defined locally in the body frame.
   * @param localPoint A local point in the body to apply the force on.
   */
  applyLocalImpulse(t, e = new x()) {
    if (this.type !== G.DYNAMIC)
      return;
    const s = pm, i = _m;
    this.vectorToWorldFrame(t, s), this.vectorToWorldFrame(e, i), this.applyImpulse(s, i);
  }
  /**
   * Should be called whenever you change the body shape or mass.
   */
  updateMassProperties() {
    const t = fm;
    this.invMass = this.mass > 0 ? 1 / this.mass : 0;
    const e = this.inertia, s = this.fixedRotation;
    this.updateAABB(), t.set(
      (this.aabb.upperBound.x - this.aabb.lowerBound.x) / 2,
      (this.aabb.upperBound.y - this.aabb.lowerBound.y) / 2,
      (this.aabb.upperBound.z - this.aabb.lowerBound.z) / 2
    ), xn.calculateInertia(t, this.mass, e), this.invInertia.set(
      e.x > 0 && !s ? 1 / e.x : 0,
      e.y > 0 && !s ? 1 / e.y : 0,
      e.z > 0 && !s ? 1 / e.z : 0
    ), this.updateInertiaWorld(!0);
  }
  /**
   * Get world velocity of a point in the body.
   * @param worldPoint
   * @param result
   * @return The result vector.
   */
  getVelocityAtWorldPoint(t, e) {
    const s = new x();
    return t.vsub(this.position, s), this.angularVelocity.cross(s, e), this.velocity.vadd(e, e), e;
  }
  /**
   * Move the body forward in time.
   * @param dt Time step
   * @param quatNormalize Set to true to normalize the body quaternion
   * @param quatNormalizeFast If the quaternion should be normalized using "fast" quaternion normalization
   */
  integrate(t, e, s) {
    if (this.previousPosition.copy(this.position), this.previousQuaternion.copy(this.quaternion), !(this.type === G.DYNAMIC || this.type === G.KINEMATIC) || this.sleepState === G.SLEEPING)
      return;
    const i = this.velocity, n = this.angularVelocity, o = this.position, r = this.force, a = this.torque, c = this.quaternion, l = this.invMass, m = this.invInertiaWorld, h = this.linearFactor, u = l * t;
    i.x += r.x * u * h.x, i.y += r.y * u * h.y, i.z += r.z * u * h.z;
    const d = m.elements, f = this.angularFactor, y = a.x * f.x, v = a.y * f.y, g = a.z * f.z;
    n.x += t * (d[0] * y + d[1] * v + d[2] * g), n.y += t * (d[3] * y + d[4] * v + d[5] * g), n.z += t * (d[6] * y + d[7] * v + d[8] * g), o.x += i.x * t, o.y += i.y * t, o.z += i.z * t, c.integrate(this.angularVelocity, t, this.angularFactor, c), e && (s ? c.normalizeFast() : c.normalize()), this.aabbNeedsUpdate = !0, this.updateInertiaWorld();
  }
}
const nm = new x(), om = new Rt(), rm = new Mt(), am = new Qe(), cm = new Qe(), lm = new x(), hm = new x(), mm = new x(), um = new x(), dm = new x(), pm = new x(), _m = new x(), fm = new x();
class Ao {
  /**
   * The world to search for collisions in.
   */
  world;
  /**
   * If set to true, the broadphase uses bounding boxes for intersection tests, else it uses bounding spheres.
   */
  useBoundingBoxes;
  /**
   * Set to true if the objects in the world moved.
   */
  dirty;
  constructor() {
    this.world = null, this.useBoundingBoxes = !1, this.dirty = !0;
  }
  /**
   * Get the collision pairs from the world
   * @param world The world to search in
   * @param p1 Empty array to be filled with body objects
   * @param p2 Empty array to be filled with body objects
   */
  collisionPairs(t, e, s) {
    throw new Error("collisionPairs not implemented for this BroadPhase class!");
  }
  /**
   * Check if a body pair needs to be intersection tested at all.
   */
  needBroadphaseCollision(t, e) {
    return !((t.collisionFilterGroup & e.collisionFilterMask) === 0 || (e.collisionFilterGroup & t.collisionFilterMask) === 0 || ((t.type & G.STATIC) !== 0 || t.sleepState === G.SLEEPING) && ((e.type & G.STATIC) !== 0 || e.sleepState === G.SLEEPING));
  }
  /**
   * Check if the bounding volumes of two bodies intersect.
   */
  intersectionTest(t, e, s, i) {
    this.useBoundingBoxes ? this.doBoundingBoxBroadphase(t, e, s, i) : this.doBoundingSphereBroadphase(t, e, s, i);
  }
  /**
   * Check if the bounding spheres of two bodies are intersecting.
   * @param pairs1 bodyA is appended to this array if intersection
   * @param pairs2 bodyB is appended to this array if intersection
   */
  doBoundingSphereBroadphase(t, e, s, i) {
    const n = ym;
    e.position.vsub(t.position, n);
    const o = (t.boundingRadius + e.boundingRadius) ** 2;
    n.lengthSquared() < o && (s.push(t), i.push(e));
  }
  /**
   * Check if the bounding boxes of two bodies are intersecting.
   */
  doBoundingBoxBroadphase(t, e, s, i) {
    t.aabbNeedsUpdate && t.updateAABB(), e.aabbNeedsUpdate && e.updateAABB(), t.aabb.overlaps(e.aabb) && (s.push(t), i.push(e));
  }
  /**
   * Removes duplicate pairs from the pair arrays.
   */
  makePairsUnique(t, e) {
    const s = xm, i = gm, n = vm, o = t.length;
    for (let r = 0; r !== o; r++)
      i[r] = t[r], n[r] = e[r];
    t.length = 0, e.length = 0;
    for (let r = 0; r !== o; r++) {
      const a = i[r].id, c = n[r].id, l = a < c ? `${a},${c}` : `${c},${a}`;
      s[l] = r, s.keys.push(l);
    }
    for (let r = 0; r !== s.keys.length; r++) {
      const a = s.keys.pop(), c = s[a];
      t.push(i[c]), e.push(n[c]), delete s[a];
    }
  }
  /**
   * To be implemented by subcasses
   */
  setWorld(t) {
  }
  /**
   * Check if the bounding spheres of two bodies overlap.
   */
  static boundingSphereCheck(t, e) {
    const s = new x();
    t.position.vsub(e.position, s);
    const i = t.shapes[0], n = e.shapes[0];
    return Math.pow(i.boundingSphereRadius + n.boundingSphereRadius, 2) > s.lengthSquared();
  }
  /**
   * Returns all the bodies within the AABB.
   */
  aabbQuery(t, e, s) {
    return console.warn(".aabbQuery is not implemented in this Broadphase subclass."), [];
  }
}
const ym = new x(), xm = { keys: [] }, gm = [], vm = [];
class Am extends Ao {
  /**
   * Number of boxes along x
   */
  nx;
  /**
   * Number of boxes along y
   */
  ny;
  /**
   * Number of boxes along z
   */
  nz;
  /**
   * aabbMin
   */
  aabbMin;
  /**
   * aabbMax
   */
  aabbMax;
  /**
   * bins
   */
  bins;
  /**
   * binLengths
   */
  binLengths;
  /**
   * @param nx Number of boxes along x.
   * @param ny Number of boxes along y.
   * @param nz Number of boxes along z.
   */
  constructor(t = new x(100, 100, 100), e = new x(-100, -100, -100), s = 10, i = 10, n = 10) {
    super(), this.nx = s, this.ny = i, this.nz = n, this.aabbMin = t, this.aabbMax = e;
    const o = this.nx * this.ny * this.nz;
    if (o <= 0)
      throw "GridBroadphase: Each dimension's n must be >0";
    this.bins = [], this.binLengths = [], this.bins.length = o, this.binLengths.length = o;
    for (let r = 0; r < o; r++)
      this.bins[r] = [], this.binLengths[r] = 0;
  }
  /**
   * Get all the collision pairs in the physics world
   */
  collisionPairs(t, e, s) {
    const i = t.bodies.length, n = t.bodies, o = this.aabbMax, r = this.aabbMin, a = this.nx, c = this.ny, l = this.nz, m = c * l, h = l, u = 1, d = o.x, f = o.y, y = o.z, v = r.x, g = r.y, A = r.z, b = a / (d - v), B = c / (f - g), w = l / (y - A), T = (d - v) / a, M = (f - g) / c, q = (y - A) / l, F = Math.sqrt(T * T + M * M + q * q) * 0.5, E = Y.types, D = E.SPHERE, V = E.PLANE;
    E.BOX, E.COMPOUND, E.CONVEXPOLYHEDRON;
    const k = this.bins, N = this.binLengths, z = this.bins.length;
    for (let H = 0; H !== z; H++)
      N[H] = 0;
    const ct = Math.ceil;
    function X(H, J, lt, $, Bt, wt, ee) {
      let Pt = (H - v) * b | 0, Lt = (J - g) * B | 0, Te = (lt - A) * w | 0, Me = ct(($ - v) * b), Ie = ct((Bt - g) * B), ue = ct((wt - A) * w);
      Pt < 0 ? Pt = 0 : Pt >= a && (Pt = a - 1), Lt < 0 ? Lt = 0 : Lt >= c && (Lt = c - 1), Te < 0 ? Te = 0 : Te >= l && (Te = l - 1), Me < 0 ? Me = 0 : Me >= a && (Me = a - 1), Ie < 0 ? Ie = 0 : Ie >= c && (Ie = c - 1), ue < 0 ? ue = 0 : ue >= l && (ue = l - 1), Pt *= m, Lt *= h, Te *= u, Me *= m, Ie *= h, ue *= u;
      for (let Oe = Pt; Oe <= Me; Oe += m)
        for (let je = Lt; je <= Ie; je += h)
          for (let is = Te; is <= ue; is += u) {
            const Fr = Oe + je + is;
            k[Fr][N[Fr]++] = ee;
          }
    }
    for (let H = 0; H !== i; H++) {
      const J = n[H], lt = J.shapes[0];
      switch (lt.type) {
        case D: {
          const $ = lt, Bt = J.position.x, wt = J.position.y, ee = J.position.z, Pt = $.radius;
          X(Bt - Pt, wt - Pt, ee - Pt, Bt + Pt, wt + Pt, ee + Pt, J);
          break;
        }
        case V: {
          const $ = lt;
          $.worldNormalNeedsUpdate && $.computeWorldNormal(J.quaternion);
          const Bt = $.worldNormal, wt = v + T * 0.5 - J.position.x, ee = g + M * 0.5 - J.position.y, Pt = A + q * 0.5 - J.position.z, Lt = bm;
          Lt.set(wt, ee, Pt);
          for (let Te = 0, Me = 0; Te !== a; Te++, Me += m, Lt.y = ee, Lt.x += T)
            for (let Ie = 0, ue = 0; Ie !== c; Ie++, ue += h, Lt.z = Pt, Lt.y += M)
              for (let Oe = 0, je = 0; Oe !== l; Oe++, je += u, Lt.z += q)
                if (Lt.dot(Bt) < F) {
                  const is = Me + ue + je;
                  k[is][N[is]++] = J;
                }
          break;
        }
        default: {
          J.aabbNeedsUpdate && J.updateAABB(), X(
            J.aabb.lowerBound.x,
            J.aabb.lowerBound.y,
            J.aabb.lowerBound.z,
            J.aabb.upperBound.x,
            J.aabb.upperBound.y,
            J.aabb.upperBound.z,
            J
          );
          break;
        }
      }
    }
    for (let H = 0; H !== z; H++) {
      const J = N[H];
      if (J > 1) {
        const lt = k[H];
        for (let $ = 0; $ !== J; $++) {
          const Bt = lt[$];
          for (let wt = 0; wt !== $; wt++) {
            const ee = lt[wt];
            this.needBroadphaseCollision(Bt, ee) && this.intersectionTest(Bt, ee, e, s);
          }
        }
      }
    }
    this.makePairsUnique(e, s);
  }
}
const bm = new x();
class yc extends Ao {
  /**
   * @todo Remove useless constructor
   */
  constructor() {
    super();
  }
  /**
   * Get all the collision pairs in the physics world
   */
  collisionPairs(t, e, s) {
    const i = t.bodies, n = i.length;
    let o, r;
    for (let a = 0; a !== n; a++)
      for (let c = 0; c !== a; c++)
        o = i[a], r = i[c], this.needBroadphaseCollision(o, r) && this.intersectionTest(o, r, e, s);
  }
  /**
   * Returns all the bodies within an AABB.
   * @param result An array to store resulting bodies in.
   */
  aabbQuery(t, e, s = []) {
    for (let i = 0; i < t.bodies.length; i++) {
      const n = t.bodies[i];
      n.aabbNeedsUpdate && n.updateAABB(), n.aabb.overlaps(e) && s.push(n);
    }
    return s;
  }
}
class _n {
  /**
   * rayFromWorld
   */
  rayFromWorld;
  /**
   * rayToWorld
   */
  rayToWorld;
  /**
   * hitNormalWorld
   */
  hitNormalWorld;
  /**
   * hitPointWorld
   */
  hitPointWorld;
  /**
   * hasHit
   */
  hasHit;
  /**
   * shape
   */
  shape;
  /**
   * body
   */
  body;
  /**
   * The index of the hit triangle, if the hit shape was a trimesh
   */
  hitFaceIndex;
  /**
   * Distance to the hit. Will be set to -1 if there was no hit
   */
  distance;
  /**
   * If the ray should stop traversing the bodies
   */
  shouldStop;
  constructor() {
    this.rayFromWorld = new x(), this.rayToWorld = new x(), this.hitNormalWorld = new x(), this.hitPointWorld = new x(), this.hasHit = !1, this.shape = null, this.body = null, this.hitFaceIndex = -1, this.distance = -1, this.shouldStop = !1;
  }
  /**
   * Reset all result data.
   */
  reset() {
    this.rayFromWorld.setZero(), this.rayToWorld.setZero(), this.hitNormalWorld.setZero(), this.hitPointWorld.setZero(), this.hasHit = !1, this.shape = null, this.body = null, this.hitFaceIndex = -1, this.distance = -1, this.shouldStop = !1;
  }
  /**
   * abort
   */
  abort() {
    this.shouldStop = !0;
  }
  /**
   * Set result data.
   */
  set(t, e, s, i, n, o, r) {
    this.rayFromWorld.copy(t), this.rayToWorld.copy(e), this.hitNormalWorld.copy(s), this.hitPointWorld.copy(i), this.shape = n, this.body = o, this.distance = r;
  }
}
const ao = {
  /** CLOSEST */
  CLOSEST: 1,
  /** ANY */
  ANY: 2,
  /** ALL */
  ALL: 4
};
class Kt {
  /**
   * from
   */
  from;
  /**
   * to
   */
  to;
  /**
   * direction
   */
  direction;
  /**
   * The precision of the ray. Used when checking parallelity etc.
   * @default 0.0001
   */
  precision;
  /**
   * Set to `false` if you don't want the Ray to take `collisionResponse` flags into account on bodies and shapes.
   * @default true
   */
  checkCollisionResponse;
  /**
   * If set to `true`, the ray skips any hits with normal.dot(rayDirection) < 0.
   * @default false
   */
  skipBackfaces;
  /**
   * collisionFilterMask
   * @default -1
   */
  collisionFilterMask;
  /**
   * collisionFilterGroup
   * @default -1
   */
  collisionFilterGroup;
  /**
   * The intersection mode. Should be Ray.ANY, Ray.ALL or Ray.CLOSEST.
   * @default RAY.ANY
   */
  mode;
  /**
   * Current result object.
   */
  result;
  /**
   * Will be set to `true` during intersectWorld() if the ray hit anything.
   */
  hasHit;
  /**
   * User-provided result callback. Will be used if mode is Ray.ALL.
   */
  callback;
  /**
   * CLOSEST
   */
  static CLOSEST = ao.CLOSEST;
  /**
   * ANY
   */
  static ANY = ao.ANY;
  /**
   * ALL
   */
  static ALL = ao.ALL;
  get [Y.types.SPHERE]() {
    return this._intersectSphere;
  }
  get [Y.types.PLANE]() {
    return this._intersectPlane;
  }
  get [Y.types.BOX]() {
    return this._intersectBox;
  }
  get [Y.types.CYLINDER]() {
    return this._intersectConvex;
  }
  get [Y.types.CONVEXPOLYHEDRON]() {
    return this._intersectConvex;
  }
  get [Y.types.HEIGHTFIELD]() {
    return this._intersectHeightfield;
  }
  get [Y.types.TRIMESH]() {
    return this._intersectTrimesh;
  }
  constructor(t = new x(), e = new x()) {
    this.from = t.clone(), this.to = e.clone(), this.direction = new x(), this.precision = 1e-4, this.checkCollisionResponse = !0, this.skipBackfaces = !1, this.collisionFilterMask = -1, this.collisionFilterGroup = -1, this.mode = Kt.ANY, this.result = new _n(), this.hasHit = !1, this.callback = (s) => {
    };
  }
  /**
   * Do itersection against all bodies in the given World.
   * @return True if the ray hit anything, otherwise false.
   */
  intersectWorld(t, e) {
    return this.mode = e.mode || Kt.ANY, this.result = e.result || new _n(), this.skipBackfaces = !!e.skipBackfaces, this.collisionFilterMask = typeof e.collisionFilterMask < "u" ? e.collisionFilterMask : -1, this.collisionFilterGroup = typeof e.collisionFilterGroup < "u" ? e.collisionFilterGroup : -1, this.checkCollisionResponse = typeof e.checkCollisionResponse < "u" ? e.checkCollisionResponse : !0, e.from && this.from.copy(e.from), e.to && this.to.copy(e.to), this.callback = e.callback || (() => {
    }), this.hasHit = !1, this.result.reset(), this.updateDirection(), this.getAABB(Ma), Qo.length = 0, t.broadphase.aabbQuery(t, Ma, Qo), this.intersectBodies(Qo), this.hasHit;
  }
  /**
   * Shoot a ray at a body, get back information about the hit.
   * @deprecated @param result set the result property of the Ray instead.
   */
  intersectBody(t, e) {
    e && (this.result = e, this.updateDirection());
    const s = this.checkCollisionResponse;
    if (s && !t.collisionResponse || (this.collisionFilterGroup & t.collisionFilterMask) === 0 || (t.collisionFilterGroup & this.collisionFilterMask) === 0)
      return;
    const i = Bm, n = wm;
    for (let o = 0, r = t.shapes.length; o < r; o++) {
      const a = t.shapes[o];
      if (!(s && !a.collisionResponse) && (t.quaternion.mult(t.shapeOrientations[o], n), t.quaternion.vmult(t.shapeOffsets[o], i), i.vadd(t.position, i), this.intersectShape(a, n, i, t), this.result.shouldStop))
        break;
    }
  }
  /**
   * Shoot a ray at an array bodies, get back information about the hit.
   * @param bodies An array of Body objects.
   * @deprecated @param result set the result property of the Ray instead.
   *
   */
  intersectBodies(t, e) {
    e && (this.result = e, this.updateDirection());
    for (let s = 0, i = t.length; !this.result.shouldStop && s < i; s++)
      this.intersectBody(t[s]);
  }
  /**
   * Updates the direction vector.
   */
  updateDirection() {
    this.to.vsub(this.from, this.direction), this.direction.normalize();
  }
  intersectShape(t, e, s, i) {
    const n = this.from;
    if (Nm(n, this.direction, s) > t.boundingSphereRadius)
      return;
    const r = this[t.type];
    r && r.call(this, t, e, s, i, t);
  }
  _intersectBox(t, e, s, i, n) {
    return this._intersectConvex(t.convexPolyhedronRepresentation, e, s, i, n);
  }
  _intersectPlane(t, e, s, i, n) {
    const o = this.from, r = this.to, a = this.direction, c = new x(0, 0, 1);
    e.vmult(c, c);
    const l = new x();
    o.vsub(s, l);
    const m = l.dot(c);
    r.vsub(s, l);
    const h = l.dot(c);
    if (m * h > 0 || o.distanceTo(r) < m)
      return;
    const u = c.dot(a);
    if (Math.abs(u) < this.precision)
      return;
    const d = new x(), f = new x(), y = new x();
    o.vsub(s, d);
    const v = -c.dot(d) / u;
    a.scale(v, f), o.vadd(f, y), this.reportIntersection(c, y, n, i, -1);
  }
  /**
   * Get the world AABB of the ray.
   */
  getAABB(t) {
    const { lowerBound: e, upperBound: s } = t, i = this.to, n = this.from;
    e.x = Math.min(i.x, n.x), e.y = Math.min(i.y, n.y), e.z = Math.min(i.z, n.z), s.x = Math.max(i.x, n.x), s.y = Math.max(i.y, n.y), s.z = Math.max(i.z, n.z);
  }
  _intersectHeightfield(t, e, s, i, n) {
    t.data, t.elementSize;
    const o = Sm;
    o.from.copy(this.from), o.to.copy(this.to), mt.pointToLocalFrame(s, e, o.from, o.from), mt.pointToLocalFrame(s, e, o.to, o.to), o.updateDirection();
    const r = Cm;
    let a, c, l, m;
    a = c = 0, l = m = t.data.length - 1;
    const h = new Mt();
    o.getAABB(h), t.getIndexOfPosition(h.lowerBound.x, h.lowerBound.y, r, !0), a = Math.max(a, r[0]), c = Math.max(c, r[1]), t.getIndexOfPosition(h.upperBound.x, h.upperBound.y, r, !0), l = Math.min(l, r[0] + 1), m = Math.min(m, r[1] + 1);
    for (let u = a; u < l; u++)
      for (let d = c; d < m; d++) {
        if (this.result.shouldStop)
          return;
        if (t.getAabbAtIndex(u, d, h), !!h.overlapsRay(o)) {
          if (t.getConvexTrianglePillar(u, d, !1), mt.pointToWorldFrame(s, e, t.pillarOffset, Xn), this._intersectConvex(t.pillarConvex, e, Xn, i, n, Ia), this.result.shouldStop)
            return;
          t.getConvexTrianglePillar(u, d, !0), mt.pointToWorldFrame(s, e, t.pillarOffset, Xn), this._intersectConvex(t.pillarConvex, e, Xn, i, n, Ia);
        }
      }
  }
  _intersectSphere(t, e, s, i, n) {
    const o = this.from, r = this.to, a = t.radius, c = (r.x - o.x) ** 2 + (r.y - o.y) ** 2 + (r.z - o.z) ** 2, l = 2 * ((r.x - o.x) * (o.x - s.x) + (r.y - o.y) * (o.y - s.y) + (r.z - o.z) * (o.z - s.z)), m = (o.x - s.x) ** 2 + (o.y - s.y) ** 2 + (o.z - s.z) ** 2 - a ** 2, h = l ** 2 - 4 * c * m, u = Tm, d = Mm;
    if (!(h < 0))
      if (h === 0)
        o.lerp(r, h, u), u.vsub(s, d), d.normalize(), this.reportIntersection(d, u, n, i, -1);
      else {
        const f = (-l - Math.sqrt(h)) / (2 * c), y = (-l + Math.sqrt(h)) / (2 * c);
        if (f >= 0 && f <= 1 && (o.lerp(r, f, u), u.vsub(s, d), d.normalize(), this.reportIntersection(d, u, n, i, -1)), this.result.shouldStop)
          return;
        y >= 0 && y <= 1 && (o.lerp(r, y, u), u.vsub(s, d), d.normalize(), this.reportIntersection(d, u, n, i, -1));
      }
  }
  _intersectConvex(t, e, s, i, n, o) {
    const r = Im, a = Pa, c = o && o.faceList || null, l = t.faces, m = t.vertices, h = t.faceNormals, u = this.direction, d = this.from, f = this.to, y = d.distanceTo(f), v = c ? c.length : l.length, g = this.result;
    for (let A = 0; !g.shouldStop && A < v; A++) {
      const b = c ? c[A] : A, B = l[b], w = h[b], T = e, M = s;
      a.copy(m[B[0]]), T.vmult(a, a), a.vadd(M, a), a.vsub(d, a), T.vmult(w, r);
      const q = u.dot(r);
      if (Math.abs(q) < this.precision)
        continue;
      const F = r.dot(a) / q;
      if (!(F < 0)) {
        u.scale(F, _e), _e.vadd(d, _e), Ge.copy(m[B[0]]), T.vmult(Ge, Ge), M.vadd(Ge, Ge);
        for (let E = 1; !g.shouldStop && E < B.length - 1; E++) {
          hs.copy(m[B[E]]), ms.copy(m[B[E + 1]]), T.vmult(hs, hs), T.vmult(ms, ms), M.vadd(hs, hs), M.vadd(ms, ms);
          const D = _e.distanceTo(d);
          !(Kt.pointInTriangle(_e, Ge, hs, ms) || Kt.pointInTriangle(_e, hs, Ge, ms)) || D > y || this.reportIntersection(r, _e, n, i, b);
        }
      }
    }
  }
  /**
   * @todo Optimize by transforming the world to local space first.
   * @todo Use Octree lookup
   */
  _intersectTrimesh(t, e, s, i, n, o) {
    const r = Pm, a = qm, c = Lm, l = Pa, m = Vm, h = zm, u = Fm, d = Em, f = Rm, y = t.indices;
    t.vertices;
    const v = this.from, g = this.to, A = this.direction;
    c.position.copy(s), c.quaternion.copy(e), mt.vectorToLocalFrame(s, e, A, m), mt.pointToLocalFrame(s, e, v, h), mt.pointToLocalFrame(s, e, g, u), u.x *= t.scale.x, u.y *= t.scale.y, u.z *= t.scale.z, h.x *= t.scale.x, h.y *= t.scale.y, h.z *= t.scale.z, u.vsub(h, m), m.normalize();
    const b = h.distanceSquared(u);
    t.tree.rayQuery(this, c, a);
    for (let B = 0, w = a.length; !this.result.shouldStop && B !== w; B++) {
      const T = a[B];
      t.getNormal(T, r), t.getVertex(y[T * 3], Ge), Ge.vsub(h, l);
      const M = m.dot(r), q = r.dot(l) / M;
      if (q < 0)
        continue;
      m.scale(q, _e), _e.vadd(h, _e), t.getVertex(y[T * 3 + 1], hs), t.getVertex(y[T * 3 + 2], ms);
      const F = _e.distanceSquared(h);
      !(Kt.pointInTriangle(_e, hs, Ge, ms) || Kt.pointInTriangle(_e, Ge, hs, ms)) || F > b || (mt.vectorToWorldFrame(e, r, f), mt.pointToWorldFrame(s, e, _e, d), this.reportIntersection(f, d, n, i, T));
    }
    a.length = 0;
  }
  /**
   * @return True if the intersections should continue
   */
  reportIntersection(t, e, s, i, n) {
    const o = this.from, r = this.to, a = o.distanceTo(e), c = this.result;
    if (!(this.skipBackfaces && t.dot(this.direction) > 0))
      switch (c.hitFaceIndex = typeof n < "u" ? n : -1, this.mode) {
        case Kt.ALL:
          this.hasHit = !0, c.set(o, r, t, e, s, i, a), c.hasHit = !0, this.callback(c);
          break;
        case Kt.CLOSEST:
          (a < c.distance || !c.hasHit) && (this.hasHit = !0, c.hasHit = !0, c.set(o, r, t, e, s, i, a));
          break;
        case Kt.ANY:
          this.hasHit = !0, c.hasHit = !0, c.set(o, r, t, e, s, i, a), c.shouldStop = !0;
          break;
      }
  }
  /**
   * As per "Barycentric Technique" as named
   * {@link https://www.blackpawn.com/texts/pointinpoly/default.html here} but without the division
   */
  static pointInTriangle(t, e, s, i) {
    i.vsub(e, fi), s.vsub(e, sn), t.vsub(e, tr);
    const n = fi.dot(fi), o = fi.dot(sn), r = fi.dot(tr), a = sn.dot(sn), c = sn.dot(tr);
    let l, m;
    return (l = a * r - o * c) >= 0 && (m = n * c - o * r) >= 0 && l + m < n * a - o * o;
  }
}
const Ma = new Mt(), Qo = [], sn = new x(), tr = new x(), Bm = new x(), wm = new Rt(), _e = new x(), Ge = new x(), hs = new x(), ms = new x(), Ia = {
  faceList: [0]
}, Xn = new x(), Sm = new Kt(), Cm = [], Tm = new x(), Mm = new x(), Im = new x(), Pa = new x(), Pm = new x(), Vm = new x(), zm = new x(), Fm = new x(), Rm = new x(), Em = new x();
new Mt();
const qm = [], Lm = new mt(), fi = new x(), Kn = new x();
function Nm(_, t, e) {
  e.vsub(_, fi);
  const s = fi.dot(t);
  return t.scale(s, Kn), Kn.vadd(_, Kn), e.distanceTo(Kn);
}
class Oi extends Ao {
  /**
   * List of bodies currently in the broadphase.
   */
  axisList;
  /**
   * The world to search in.
   */
  world;
  /**
   * Axis to sort the bodies along.
   * Set to 0 for x axis, and 1 for y axis.
   * For best performance, pick the axis where bodies are most distributed.
   */
  axisIndex;
  _addBodyHandler;
  _removeBodyHandler;
  /**
   * Check if the bounds of two bodies overlap, along the given SAP axis.
   */
  static checkBounds(t, e, s) {
    let i, n;
    s === 0 ? (i = t.position.x, n = e.position.x) : s === 1 ? (i = t.position.y, n = e.position.y) : s === 2 && (i = t.position.z, n = e.position.z);
    const o = t.boundingRadius, r = e.boundingRadius, a = i + o;
    return n - r < a;
  }
  // Note: these are identical, save for x/y/z lowerbound
  /**
   * insertionSortX
   */
  static insertionSortX(t) {
    for (let e = 1, s = t.length; e < s; e++) {
      const i = t[e];
      let n;
      for (n = e - 1; n >= 0 && !(t[n].aabb.lowerBound.x <= i.aabb.lowerBound.x); n--)
        t[n + 1] = t[n];
      t[n + 1] = i;
    }
    return t;
  }
  /**
   * insertionSortY
   */
  static insertionSortY(t) {
    for (let e = 1, s = t.length; e < s; e++) {
      const i = t[e];
      let n;
      for (n = e - 1; n >= 0 && !(t[n].aabb.lowerBound.y <= i.aabb.lowerBound.y); n--)
        t[n + 1] = t[n];
      t[n + 1] = i;
    }
    return t;
  }
  /**
   * insertionSortZ
   */
  static insertionSortZ(t) {
    for (let e = 1, s = t.length; e < s; e++) {
      const i = t[e];
      let n;
      for (n = e - 1; n >= 0 && !(t[n].aabb.lowerBound.z <= i.aabb.lowerBound.z); n--)
        t[n + 1] = t[n];
      t[n + 1] = i;
    }
    return t;
  }
  constructor(t) {
    super(), this.axisList = [], this.world = null, this.axisIndex = 0;
    const e = this.axisList;
    this._addBodyHandler = (s) => {
      e.push(s.body);
    }, this._removeBodyHandler = (s) => {
      const i = e.indexOf(s.body);
      i !== -1 && e.splice(i, 1);
    }, t && this.setWorld(t);
  }
  /**
   * Change the world
   */
  setWorld(t) {
    this.axisList.length = 0;
    for (let e = 0; e < t.bodies.length; e++)
      this.axisList.push(t.bodies[e]);
    t.removeEventListener("addBody", this._addBodyHandler), t.removeEventListener("removeBody", this._removeBodyHandler), t.addEventListener("addBody", this._addBodyHandler), t.addEventListener("removeBody", this._removeBodyHandler), this.world = t, this.dirty = !0;
  }
  /**
   * Collect all collision pairs
   */
  collisionPairs(t, e, s) {
    const i = this.axisList, n = i.length, o = this.axisIndex;
    let r, a;
    for (this.dirty && (this.sortList(), this.dirty = !1), r = 0; r !== n; r++) {
      const c = i[r];
      for (a = r + 1; a < n; a++) {
        const l = i[a];
        if (this.needBroadphaseCollision(c, l)) {
          if (!Oi.checkBounds(c, l, o))
            break;
          this.intersectionTest(c, l, e, s);
        }
      }
    }
  }
  sortList() {
    const t = this.axisList, e = this.axisIndex, s = t.length;
    for (let i = 0; i !== s; i++) {
      const n = t[i];
      n.aabbNeedsUpdate && n.updateAABB();
    }
    e === 0 ? Oi.insertionSortX(t) : e === 1 ? Oi.insertionSortY(t) : e === 2 && Oi.insertionSortZ(t);
  }
  /**
   * Computes the variance of the body positions and estimates the best axis to use.
   * Will automatically set property `axisIndex`.
   */
  autoDetectAxis() {
    let t = 0, e = 0, s = 0, i = 0, n = 0, o = 0;
    const r = this.axisList, a = r.length, c = 1 / a;
    for (let u = 0; u !== a; u++) {
      const d = r[u], f = d.position.x;
      t += f, e += f * f;
      const y = d.position.y;
      s += y, i += y * y;
      const v = d.position.z;
      n += v, o += v * v;
    }
    const l = e - t * t * c, m = i - s * s * c, h = o - n * n * c;
    l > m ? l > h ? this.axisIndex = 0 : this.axisIndex = 2 : m > h ? this.axisIndex = 1 : this.axisIndex = 2;
  }
  /**
   * Returns all the bodies within an AABB.
   * @param result An array to store resulting bodies in.
   */
  aabbQuery(t, e, s = []) {
    this.dirty && (this.sortList(), this.dirty = !1);
    const i = this.axisIndex;
    let n = "x";
    i === 1 && (n = "y"), i === 2 && (n = "z");
    const o = this.axisList;
    e.lowerBound[n], e.upperBound[n];
    for (let r = 0; r < o.length; r++) {
      const a = o[r];
      a.aabbNeedsUpdate && a.updateAABB(), a.aabb.overlaps(e) && s.push(a);
    }
    return s;
  }
}
class bo {
  /**
   * Extend an options object with default values.
   * @param options The options object. May be falsy: in this case, a new object is created and returned.
   * @param defaults An object containing default values.
   * @return The modified options object.
   */
  static defaults(t = {}, e) {
    for (let s in e)
      s in t || (t[s] = e[s]);
    return t;
  }
}
class gn {
  /**
   * Equations to be solved in this constraint.
   */
  equations;
  /**
   * Body A.
   */
  bodyA;
  /**
   * Body B.
   */
  bodyB;
  id;
  /**
   * Set to false if you don't want the bodies to collide when they are connected.
   */
  collideConnected;
  static idCounter = 0;
  constructor(t, e, s = {}) {
    s = bo.defaults(s, {
      collideConnected: !0,
      wakeUpBodies: !0
    }), this.equations = [], this.bodyA = t, this.bodyB = e, this.id = gn.idCounter++, this.collideConnected = s.collideConnected, s.wakeUpBodies && (t && t.wakeUp(), e && e.wakeUp());
  }
  /**
   * Update all the equations with data.
   */
  update() {
    throw new Error("method update() not implmemented in this Constraint subclass!");
  }
  /**
   * Enables all equations in the constraint.
   */
  enable() {
    const t = this.equations;
    for (let e = 0; e < t.length; e++)
      t[e].enabled = !0;
  }
  /**
   * Disables all equations in the constraint.
   */
  disable() {
    const t = this.equations;
    for (let e = 0; e < t.length; e++)
      t[e].enabled = !1;
  }
}
class dr {
  /**
   * spatial
   */
  spatial;
  /**
   * rotational
   */
  rotational;
  constructor() {
    this.spatial = new x(), this.rotational = new x();
  }
  /**
   * Multiply with other JacobianElement
   */
  multiplyElement(t) {
    return t.spatial.dot(this.spatial) + t.rotational.dot(this.rotational);
  }
  /**
   * Multiply with two vectors
   */
  multiplyVectors(t, e) {
    return t.dot(this.spatial) + e.dot(this.rotational);
  }
}
class Qs {
  id;
  /**
   * Minimum (read: negative max) force to be applied by the constraint.
   */
  minForce;
  /**
   * Maximum (read: positive max) force to be applied by the constraint.
   */
  maxForce;
  bi;
  bj;
  si;
  sj;
  /**
   * SPOOK parameter
   */
  a;
  /**
   * SPOOK parameter
   */
  b;
  /**
   * SPOOK parameter
   */
  eps;
  jacobianElementA;
  jacobianElementB;
  enabled;
  /**
   * A number, proportional to the force added to the bodies.
   */
  multiplier;
  static idCounter = 0;
  constructor(t, e, s = -1e6, i = 1e6) {
    this.id = Qs.idCounter++, this.minForce = s, this.maxForce = i, this.bi = t, this.bj = e, this.a = 0, this.b = 0, this.eps = 0, this.jacobianElementA = new dr(), this.jacobianElementB = new dr(), this.enabled = !0, this.multiplier = 0, this.setSpookParams(1e7, 4, 1 / 60);
  }
  /**
   * Recalculates a, b, and eps.
   *
   * The Equation constructor sets typical SPOOK parameters as such:
   * * `stiffness` = 1e7
   * * `relaxation` = 4
   * * `timeStep`= 1 / 60, _note the hardcoded refresh rate._
   */
  setSpookParams(t, e, s) {
    const i = e, n = t, o = s;
    this.a = 4 / (o * (1 + 4 * i)), this.b = 4 * i / (1 + 4 * i), this.eps = 4 / (o * o * n * (1 + 4 * i));
  }
  /**
   * Computes the right hand side of the SPOOK equation
   */
  computeB(t, e, s) {
    const i = this.computeGW(), n = this.computeGq(), o = this.computeGiMf();
    return -n * t - i * e - o * s;
  }
  /**
   * Computes G*q, where q are the generalized body coordinates
   */
  computeGq() {
    const t = this.jacobianElementA, e = this.jacobianElementB, s = this.bi, i = this.bj, n = s.position, o = i.position;
    return t.spatial.dot(n) + e.spatial.dot(o);
  }
  /**
   * Computes G*W, where W are the body velocities
   */
  computeGW() {
    const t = this.jacobianElementA, e = this.jacobianElementB, s = this.bi, i = this.bj, n = s.velocity, o = i.velocity, r = s.angularVelocity, a = i.angularVelocity;
    return t.multiplyVectors(n, r) + e.multiplyVectors(o, a);
  }
  /**
   * Computes G*Wlambda, where W are the body velocities
   */
  computeGWlambda() {
    const t = this.jacobianElementA, e = this.jacobianElementB, s = this.bi, i = this.bj, n = s.vlambda, o = i.vlambda, r = s.wlambda, a = i.wlambda;
    return t.multiplyVectors(n, r) + e.multiplyVectors(o, a);
  }
  /**
   * Computes G*inv(M)*f, where M is the mass matrix with diagonal blocks for each body, and f are the forces on the bodies.
   */
  computeGiMf() {
    const t = this.jacobianElementA, e = this.jacobianElementB, s = this.bi, i = this.bj, n = s.force, o = s.torque, r = i.force, a = i.torque, c = s.invMassSolve, l = i.invMassSolve;
    return n.scale(c, Va), r.scale(l, za), s.invInertiaWorldSolve.vmult(o, Fa), i.invInertiaWorldSolve.vmult(a, Ra), t.multiplyVectors(Va, Fa) + e.multiplyVectors(za, Ra);
  }
  /**
   * Computes G*inv(M)*G'
   */
  computeGiMGt() {
    const t = this.jacobianElementA, e = this.jacobianElementB, s = this.bi, i = this.bj, n = s.invMassSolve, o = i.invMassSolve, r = s.invInertiaWorldSolve, a = i.invInertiaWorldSolve;
    let c = n + o;
    return r.vmult(t.rotational, Zn), c += Zn.dot(t.rotational), a.vmult(e.rotational, Zn), c += Zn.dot(e.rotational), c;
  }
  /**
   * Add constraint velocity to the bodies.
   */
  addToWlambda(t) {
    const e = this.jacobianElementA, s = this.jacobianElementB, i = this.bi, n = this.bj, o = km;
    i.vlambda.addScaledVector(i.invMassSolve * t, e.spatial, i.vlambda), n.vlambda.addScaledVector(n.invMassSolve * t, s.spatial, n.vlambda), i.invInertiaWorldSolve.vmult(e.rotational, o), i.wlambda.addScaledVector(t, o, i.wlambda), n.invInertiaWorldSolve.vmult(s.rotational, o), n.wlambda.addScaledVector(t, o, n.wlambda);
  }
  /**
   * Compute the denominator part of the SPOOK equation: C = G*inv(M)*G' + eps
   */
  computeC() {
    return this.computeGiMGt() + this.eps;
  }
}
const Va = new x(), za = new x(), Fa = new x(), Ra = new x(), Zn = new x(), km = new x();
class Di extends Qs {
  /**
   * "bounciness": u1 = -e*u0
   */
  restitution;
  /**
   * World-oriented vector that goes from the center of bi to the contact point.
   */
  ri;
  /**
   * World-oriented vector that starts in body j position and goes to the contact point.
   */
  rj;
  /**
   * Contact normal, pointing out of body i.
   */
  ni;
  constructor(t, e, s = 1e6) {
    super(t, e, 0, s), this.restitution = 0, this.ri = new x(), this.rj = new x(), this.ni = new x();
  }
  computeB(t) {
    const e = this.a, s = this.b, i = this.bi, n = this.bj, o = this.ri, r = this.rj, a = Om, c = jm, l = i.velocity, m = i.angularVelocity;
    i.force, i.torque;
    const h = n.velocity, u = n.angularVelocity;
    n.force, n.torque;
    const d = Dm, f = this.jacobianElementA, y = this.jacobianElementB, v = this.ni;
    o.cross(v, a), r.cross(v, c), v.negate(f.spatial), a.negate(f.rotational), y.spatial.copy(v), y.rotational.copy(c), d.copy(n.position), d.vadd(r, d), d.vsub(i.position, d), d.vsub(o, d);
    const g = v.dot(d), A = this.restitution + 1, b = A * h.dot(v) - A * l.dot(v) + u.dot(c) - m.dot(a), B = this.computeGiMf();
    return -g * e - b * s - t * B;
  }
  /**
   * Get the current relative velocity in the contact point.
   */
  getImpactVelocityAlongNormal() {
    const t = Wm, e = Ym, s = $m, i = Hm, n = Um;
    return this.bi.position.vadd(this.ri, s), this.bj.position.vadd(this.rj, i), this.bi.getVelocityAtWorldPoint(s, t), this.bj.getVelocityAtWorldPoint(i, e), t.vsub(e, n), this.ni.dot(n);
  }
}
const Om = new x(), jm = new x(), Dm = new x(), Wm = new x(), Ym = new x(), $m = new x(), Hm = new x(), Um = new x();
class Bo extends gn {
  /**
   * Pivot, defined locally in bodyA.
   */
  pivotA;
  /**
   * Pivot, defined locally in bodyB.
   */
  pivotB;
  equationX;
  equationY;
  equationZ;
  /**
   * @param pivotA The point relative to the center of mass of bodyA which bodyA is constrained to.
   * @param bodyB Body that will be constrained in a similar way to the same point as bodyA. We will therefore get a link between bodyA and bodyB. If not specified, bodyA will be constrained to a static point.
   * @param pivotB The point relative to the center of mass of bodyB which bodyB is constrained to.
   * @param maxForce The maximum force that should be applied to constrain the bodies.
   */
  constructor(t, e = new x(), s, i = new x(), n = 1e6) {
    super(t, s), this.pivotA = e.clone(), this.pivotB = i.clone();
    const o = this.equationX = new Di(t, s), r = this.equationY = new Di(t, s), a = this.equationZ = new Di(t, s);
    this.equations.push(o, r, a), o.minForce = r.minForce = a.minForce = -n, o.maxForce = r.maxForce = a.maxForce = n, o.ni.set(1, 0, 0), r.ni.set(0, 1, 0), a.ni.set(0, 0, 1);
  }
  update() {
    const t = this.bodyA, e = this.bodyB, s = this.equationX, i = this.equationY, n = this.equationZ;
    t.quaternion.vmult(this.pivotA, s.ri), e.quaternion.vmult(this.pivotB, s.rj), i.ri.copy(s.ri), i.rj.copy(s.rj), n.ri.copy(s.ri), n.rj.copy(s.rj);
  }
}
class Gm extends Qs {
  /**
   * Local axis in A
   */
  axisA;
  /**
   * Local axis in B
   */
  axisB;
  /**
   * The "cone angle" to keep
   */
  angle;
  constructor(t, e, s = {}) {
    const i = typeof s.maxForce < "u" ? s.maxForce : 1e6;
    super(t, e, -i, i), this.axisA = s.axisA ? s.axisA.clone() : new x(1, 0, 0), this.axisB = s.axisB ? s.axisB.clone() : new x(0, 1, 0), this.angle = typeof s.angle < "u" ? s.angle : 0;
  }
  computeB(t) {
    const e = this.a, s = this.b, i = this.axisA, n = this.axisB, o = Xm, r = Km, a = this.jacobianElementA, c = this.jacobianElementB;
    i.cross(n, o), n.cross(i, r), a.rotational.copy(r), c.rotational.copy(o);
    const l = Math.cos(this.angle) - i.dot(n), m = this.computeGW(), h = this.computeGiMf();
    return -l * e - m * s - t * h;
  }
}
const Xm = new x(), Km = new x();
class vi extends Qs {
  /**
   * World oriented rotational axis.
   */
  axisA;
  /**
   * World oriented rotational axis.
   */
  axisB;
  /**
   * maxAngle
   */
  maxAngle;
  constructor(t, e, s = {}) {
    const i = typeof s.maxForce < "u" ? s.maxForce : 1e6;
    super(t, e, -i, i), this.axisA = s.axisA ? s.axisA.clone() : new x(1, 0, 0), this.axisB = s.axisB ? s.axisB.clone() : new x(0, 1, 0), this.maxAngle = Math.PI / 2;
  }
  computeB(t) {
    const e = this.a, s = this.b, i = this.axisA, n = this.axisB, o = Zm, r = Jm, a = this.jacobianElementA, c = this.jacobianElementB;
    i.cross(n, o), n.cross(i, r), a.rotational.copy(r), c.rotational.copy(o);
    const l = Math.cos(this.maxAngle) - i.dot(n), m = this.computeGW(), h = this.computeGiMf();
    return -l * e - m * s - t * h;
  }
}
const Zm = new x(), Jm = new x();
class Qm extends Bo {
  /**
   * The axis direction for the constraint of the body A.
   */
  axisA;
  /**
   * The axis direction for the constraint of the body B.
   */
  axisB;
  /**
   * The aperture angle of the cone.
   */
  angle;
  /**
   * The twist angle of the joint.
   */
  twistAngle;
  coneEquation;
  twistEquation;
  constructor(t, e, s = {}) {
    const i = typeof s.maxForce < "u" ? s.maxForce : 1e6, n = s.pivotA ? s.pivotA.clone() : new x(), o = s.pivotB ? s.pivotB.clone() : new x();
    super(t, n, e, o, i), this.axisA = s.axisA ? s.axisA.clone() : new x(), this.axisB = s.axisB ? s.axisB.clone() : new x(), this.collideConnected = !!s.collideConnected, this.angle = typeof s.angle < "u" ? s.angle : 0;
    const r = this.coneEquation = new Gm(t, e, s), a = this.twistEquation = new vi(t, e, s);
    this.twistAngle = typeof s.twistAngle < "u" ? s.twistAngle : 0, r.maxForce = 0, r.minForce = -i, a.maxForce = 0, a.minForce = -i, this.equations.push(r, a);
  }
  update() {
    const t = this.bodyA, e = this.bodyB, s = this.coneEquation, i = this.twistEquation;
    super.update(), t.vectorToWorldFrame(this.axisA, s.axisA), e.vectorToWorldFrame(this.axisB, s.axisB), this.axisA.tangents(i.axisA, i.axisA), t.vectorToWorldFrame(i.axisA, i.axisA), this.axisB.tangents(i.axisB, i.axisB), e.vectorToWorldFrame(i.axisB, i.axisB), s.angle = this.angle, i.maxAngle = this.twistAngle;
  }
}
class tu extends gn {
  /**
   * The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB
   */
  distance;
  distanceEquation;
  /**
   * @param distance The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB.
   * @param maxForce The maximum force that should be applied to constrain the bodies.
   */
  constructor(t, e, s, i = 1e6) {
    super(t, e), typeof s > "u" && (s = t.position.distanceTo(e.position)), this.distance = s;
    const n = this.distanceEquation = new Di(t, e);
    this.equations.push(n), n.minForce = -i, n.maxForce = i;
  }
  /**
   * update
   */
  update() {
    const t = this.bodyA, e = this.bodyB, s = this.distanceEquation, i = this.distance * 0.5, n = s.ni;
    e.position.vsub(t.position, n), n.normalize(), n.scale(i, s.ri), n.scale(-i, s.rj);
  }
}
class eu extends Bo {
  xA;
  xB;
  yA;
  yB;
  zA;
  zB;
  rotationalEquation1;
  rotationalEquation2;
  rotationalEquation3;
  motorEquation;
  constructor(t, e, s = {}) {
    const i = typeof s.maxForce < "u" ? s.maxForce : 1e6, n = new x(), o = new x(), r = new x();
    t.position.vadd(e.position, r), r.scale(0.5, r), e.pointToLocalFrame(r, o), t.pointToLocalFrame(r, n), super(t, n, e, o, i), this.xA = t.vectorToLocalFrame(x.UNIT_X), this.xB = e.vectorToLocalFrame(x.UNIT_X), this.yA = t.vectorToLocalFrame(x.UNIT_Y), this.yB = e.vectorToLocalFrame(x.UNIT_Y), this.zA = t.vectorToLocalFrame(x.UNIT_Z), this.zB = e.vectorToLocalFrame(x.UNIT_Z);
    const a = this.rotationalEquation1 = new vi(t, e, s), c = this.rotationalEquation2 = new vi(t, e, s), l = this.rotationalEquation3 = new vi(t, e, s);
    this.equations.push(a, c, l);
  }
  /**
   * update
   */
  update() {
    const t = this.bodyA, e = this.bodyB;
    this.motorEquation;
    const s = this.rotationalEquation1, i = this.rotationalEquation2, n = this.rotationalEquation3;
    super.update(), t.vectorToWorldFrame(this.xA, s.axisA), e.vectorToWorldFrame(this.yB, s.axisB), t.vectorToWorldFrame(this.yA, i.axisA), e.vectorToWorldFrame(this.zB, i.axisB), t.vectorToWorldFrame(this.zA, n.axisA), e.vectorToWorldFrame(this.xB, n.axisB);
  }
}
class xc extends Qs {
  /**
   * World oriented rotational axis.
   */
  axisA;
  /**
   * World oriented rotational axis.
   */
  axisB;
  /**
   * Motor velocity.
   */
  targetVelocity;
  constructor(t, e, s = 1e6) {
    super(t, e, -s, s), this.axisA = new x(), this.axisB = new x(), this.targetVelocity = 0;
  }
  computeB(t) {
    this.a;
    const e = this.b;
    this.bi, this.bj;
    const s = this.axisA, i = this.axisB, n = this.jacobianElementA, o = this.jacobianElementB;
    n.rotational.copy(s), i.negate(o.rotational);
    const r = this.computeGW() - this.targetVelocity, a = this.computeGiMf();
    return -r * e - t * a;
  }
}
class gc extends Bo {
  /**
   * Rotation axis, defined locally in bodyA.
   */
  axisA;
  /**
   * Rotation axis, defined locally in bodyB.
   */
  axisB;
  rotationalEquation1;
  rotationalEquation2;
  motorEquation;
  constructor(t, e, s = {}) {
    const i = typeof s.maxForce < "u" ? s.maxForce : 1e6, n = s.pivotA ? s.pivotA.clone() : new x(), o = s.pivotB ? s.pivotB.clone() : new x();
    super(t, n, e, o, i), (this.axisA = s.axisA ? s.axisA.clone() : new x(1, 0, 0)).normalize(), (this.axisB = s.axisB ? s.axisB.clone() : new x(1, 0, 0)).normalize(), this.collideConnected = !!s.collideConnected;
    const c = this.rotationalEquation1 = new vi(t, e, s), l = this.rotationalEquation2 = new vi(t, e, s), m = this.motorEquation = new xc(t, e, i);
    m.enabled = !1, this.equations.push(c, l, m);
  }
  /**
   * enableMotor
   */
  enableMotor() {
    this.motorEquation.enabled = !0;
  }
  /**
   * disableMotor
   */
  disableMotor() {
    this.motorEquation.enabled = !1;
  }
  /**
   * setMotorSpeed
   */
  setMotorSpeed(t) {
    this.motorEquation.targetVelocity = t;
  }
  /**
   * setMotorMaxForce
   */
  setMotorMaxForce(t) {
    this.motorEquation.maxForce = t, this.motorEquation.minForce = -t;
  }
  /**
   * update
   */
  update() {
    const t = this.bodyA, e = this.bodyB, s = this.motorEquation, i = this.rotationalEquation1, n = this.rotationalEquation2, o = su, r = iu, a = this.axisA, c = this.axisB;
    super.update(), t.quaternion.vmult(a, o), e.quaternion.vmult(c, r), o.tangents(i.axisA, n.axisA), i.axisB.copy(r), n.axisB.copy(r), this.motorEquation.enabled && (t.quaternion.vmult(this.axisA, s.axisA), e.quaternion.vmult(this.axisB, s.axisB));
  }
}
const su = new x(), iu = new x();
class pr extends Qs {
  ri;
  rj;
  t;
  // Tangent
  /**
   * @param slipForce should be +-F_friction = +-mu * F_normal = +-mu * m * g
   */
  constructor(t, e, s) {
    super(t, e, -s, s), this.ri = new x(), this.rj = new x(), this.t = new x();
  }
  computeB(t) {
    this.a;
    const e = this.b;
    this.bi, this.bj;
    const s = this.ri, i = this.rj, n = nu, o = ou, r = this.t;
    s.cross(r, n), i.cross(r, o);
    const a = this.jacobianElementA, c = this.jacobianElementB;
    r.negate(a.spatial), n.negate(a.rotational), c.spatial.copy(r), c.rotational.copy(o);
    const l = this.computeGW(), m = this.computeGiMf();
    return -l * e - t * m;
  }
}
const nu = new x(), ou = new x();
class wo {
  /**
   * Identifier of this material.
   */
  id;
  /**
   * Participating materials.
   */
  materials;
  /**
   * Friction coefficient.
   * @default 0.3
   */
  friction;
  /**
   * Restitution coefficient.
   * @default 0.3
   */
  restitution;
  /**
   * Stiffness of the produced contact equations.
   * @default 1e7
   */
  contactEquationStiffness;
  /**
   * Relaxation time of the produced contact equations.
   * @default 3
   */
  contactEquationRelaxation;
  /**
   * Stiffness of the produced friction equations.
   * @default 1e7
   */
  frictionEquationStiffness;
  /**
   * Relaxation time of the produced friction equations
   * @default 3
   */
  frictionEquationRelaxation;
  static idCounter = 0;
  constructor(t, e, s) {
    s = bo.defaults(s, {
      friction: 0.3,
      restitution: 0.3,
      contactEquationStiffness: 1e7,
      contactEquationRelaxation: 3,
      frictionEquationStiffness: 1e7,
      frictionEquationRelaxation: 3
    }), this.id = wo.idCounter++, this.materials = [t, e], this.friction = s.friction, this.restitution = s.restitution, this.contactEquationStiffness = s.contactEquationStiffness, this.contactEquationRelaxation = s.contactEquationRelaxation, this.frictionEquationStiffness = s.frictionEquationStiffness, this.frictionEquationRelaxation = s.frictionEquationRelaxation;
  }
}
class So {
  /**
   * Material name.
   * If options is a string, name will be set to that string.
   * @todo Deprecate this
   */
  name;
  /** Material id. */
  id;
  /**
   * Friction for this material.
   * If non-negative, it will be used instead of the friction given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
   */
  friction;
  /**
   * Restitution for this material.
   * If non-negative, it will be used instead of the restitution given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
   */
  restitution;
  static idCounter = 0;
  constructor(t = {}) {
    let e = "";
    typeof t == "string" && (e = t, t = {}), this.name = e, this.id = So.idCounter++, this.friction = typeof t.friction < "u" ? t.friction : -1, this.restitution = typeof t.restitution < "u" ? t.restitution : -1;
  }
}
class ru {
  /**
   * Rest length of the spring. A number > 0.
   * @default 1
   */
  restLength;
  /**
   * Stiffness of the spring. A number >= 0.
   * @default 100
   */
  stiffness;
  /**
   * Damping of the spring. A number >= 0.
   * @default 1
   */
  damping;
  /**
   * First connected body.
   */
  bodyA;
  /**
   * Second connected body.
   */
  bodyB;
  /**
   * Anchor for bodyA in local bodyA coordinates.
   * Where to hook the spring to body A, in local body coordinates.
   * @default new Vec3()
   */
  localAnchorA;
  /**
   * Anchor for bodyB in local bodyB coordinates.
   * Where to hook the spring to body B, in local body coordinates.
   * @default new Vec3()
   */
  localAnchorB;
  constructor(t, e, s = {}) {
    this.restLength = typeof s.restLength == "number" ? s.restLength : 1, this.stiffness = s.stiffness || 100, this.damping = s.damping || 1, this.bodyA = t, this.bodyB = e, this.localAnchorA = new x(), this.localAnchorB = new x(), s.localAnchorA && this.localAnchorA.copy(s.localAnchorA), s.localAnchorB && this.localAnchorB.copy(s.localAnchorB), s.worldAnchorA && this.setWorldAnchorA(s.worldAnchorA), s.worldAnchorB && this.setWorldAnchorB(s.worldAnchorB);
  }
  /**
   * Set the anchor point on body A, using world coordinates.
   */
  setWorldAnchorA(t) {
    this.bodyA.pointToLocalFrame(t, this.localAnchorA);
  }
  /**
   * Set the anchor point on body B, using world coordinates.
   */
  setWorldAnchorB(t) {
    this.bodyB.pointToLocalFrame(t, this.localAnchorB);
  }
  /**
   * Get the anchor point on body A, in world coordinates.
   * @param result The vector to store the result in.
   */
  getWorldAnchorA(t) {
    this.bodyA.pointToWorldFrame(this.localAnchorA, t);
  }
  /**
   * Get the anchor point on body B, in world coordinates.
   * @param result The vector to store the result in.
   */
  getWorldAnchorB(t) {
    this.bodyB.pointToWorldFrame(this.localAnchorB, t);
  }
  /**
   * Apply the spring force to the connected bodies.
   */
  applyForce() {
    const t = this.stiffness, e = this.damping, s = this.restLength, i = this.bodyA, n = this.bodyB, o = au, r = cu, a = lu, c = hu, l = yu, m = mu, h = uu, u = du, d = pu, f = _u, y = fu;
    this.getWorldAnchorA(m), this.getWorldAnchorB(h), m.vsub(i.position, u), h.vsub(n.position, d), h.vsub(m, o);
    const v = o.length();
    r.copy(o), r.normalize(), n.velocity.vsub(i.velocity, a), n.angularVelocity.cross(d, l), a.vadd(l, a), i.angularVelocity.cross(u, l), a.vsub(l, a), r.scale(-t * (v - s) - e * a.dot(r), c), i.force.vsub(c, i.force), n.force.vadd(c, n.force), u.cross(c, f), d.cross(c, y), i.torque.vsub(f, i.torque), n.torque.vadd(y, n.torque);
  }
}
const au = new x(), cu = new x(), lu = new x(), hu = new x(), mu = new x(), uu = new x(), du = new x(), pu = new x(), _u = new x(), fu = new x(), yu = new x();
class vc {
  /**
   * Max travel distance of the suspension, in meters.
   * @default 1
   */
  maxSuspensionTravel;
  /**
   * Speed to apply to the wheel rotation when the wheel is sliding.
   * @default -0.1
   */
  customSlidingRotationalSpeed;
  /**
   * If the customSlidingRotationalSpeed should be used.
   * @default false
   */
  useCustomSlidingRotationalSpeed;
  /**
   * sliding
   */
  sliding;
  /**
   * Connection point, defined locally in the chassis body frame.
   */
  chassisConnectionPointLocal;
  /**
   * chassisConnectionPointWorld
   */
  chassisConnectionPointWorld;
  /**
   * directionLocal
   */
  directionLocal;
  /**
   * directionWorld
   */
  directionWorld;
  /**
   * axleLocal
   */
  axleLocal;
  /**
   * axleWorld
   */
  axleWorld;
  /**
   * suspensionRestLength
   * @default 1
   */
  suspensionRestLength;
  /**
   * suspensionMaxLength
   * @default 2
   */
  suspensionMaxLength;
  /**
   * radius
   * @default 1
   */
  radius;
  /**
   * suspensionStiffness
   * @default 100
   */
  suspensionStiffness;
  /**
   * dampingCompression
   * @default 10
   */
  dampingCompression;
  /**
   * dampingRelaxation
   * @default 10
   */
  dampingRelaxation;
  /**
   * frictionSlip
   * @default 10.5
   */
  frictionSlip;
  /** forwardAcceleration */
  forwardAcceleration;
  /** sideAcceleration */
  sideAcceleration;
  /**
   * steering
   * @default 0
   */
  steering;
  /**
   * Rotation value, in radians.
   * @default 0
   */
  rotation;
  /**
   * deltaRotation
   * @default 0
   */
  deltaRotation;
  /**
   * rollInfluence
   * @default 0.01
   */
  rollInfluence;
  /**
   * maxSuspensionForce
   */
  maxSuspensionForce;
  /**
   * engineForce
   */
  engineForce;
  /**
   * brake
   */
  brake;
  /**
   * isFrontWheel
   * @default true
   */
  isFrontWheel;
  /**
   * clippedInvContactDotSuspension
   * @default 1
   */
  clippedInvContactDotSuspension;
  /**
   * suspensionRelativeVelocity
   * @default 0
   */
  suspensionRelativeVelocity;
  /**
   * suspensionForce
   * @default 0
   */
  suspensionForce;
  /**
   * slipInfo
   */
  slipInfo;
  /**
   * skidInfo
   * @default 0
   */
  skidInfo;
  /**
   * suspensionLength
   * @default 0
   */
  suspensionLength;
  /**
   * sideImpulse
   */
  sideImpulse;
  /**
   * forwardImpulse
   */
  forwardImpulse;
  /**
   * The result from raycasting.
   */
  raycastResult;
  /**
   * Wheel world transform.
   */
  worldTransform;
  /**
   * isInContact
   */
  isInContact;
  constructor(t = {}) {
    t = bo.defaults(t, {
      chassisConnectionPointLocal: new x(),
      chassisConnectionPointWorld: new x(),
      directionLocal: new x(),
      directionWorld: new x(),
      axleLocal: new x(),
      axleWorld: new x(),
      suspensionRestLength: 1,
      suspensionMaxLength: 2,
      radius: 1,
      suspensionStiffness: 100,
      dampingCompression: 10,
      dampingRelaxation: 10,
      frictionSlip: 10.5,
      forwardAcceleration: 1,
      sideAcceleration: 1,
      steering: 0,
      rotation: 0,
      deltaRotation: 0,
      rollInfluence: 0.01,
      maxSuspensionForce: Number.MAX_VALUE,
      isFrontWheel: !0,
      clippedInvContactDotSuspension: 1,
      suspensionRelativeVelocity: 0,
      suspensionForce: 0,
      slipInfo: 0,
      skidInfo: 0,
      suspensionLength: 0,
      maxSuspensionTravel: 1,
      useCustomSlidingRotationalSpeed: !1,
      customSlidingRotationalSpeed: -0.1
    }), this.maxSuspensionTravel = t.maxSuspensionTravel, this.customSlidingRotationalSpeed = t.customSlidingRotationalSpeed, this.useCustomSlidingRotationalSpeed = t.useCustomSlidingRotationalSpeed, this.sliding = !1, this.chassisConnectionPointLocal = t.chassisConnectionPointLocal.clone(), this.chassisConnectionPointWorld = t.chassisConnectionPointWorld.clone(), this.directionLocal = t.directionLocal.clone(), this.directionWorld = t.directionWorld.clone(), this.axleLocal = t.axleLocal.clone(), this.axleWorld = t.axleWorld.clone(), this.suspensionRestLength = t.suspensionRestLength, this.suspensionMaxLength = t.suspensionMaxLength, this.radius = t.radius, this.suspensionStiffness = t.suspensionStiffness, this.dampingCompression = t.dampingCompression, this.dampingRelaxation = t.dampingRelaxation, this.frictionSlip = t.frictionSlip, this.forwardAcceleration = t.forwardAcceleration, this.sideAcceleration = t.sideAcceleration, this.steering = 0, this.rotation = 0, this.deltaRotation = 0, this.rollInfluence = t.rollInfluence, this.maxSuspensionForce = t.maxSuspensionForce, this.engineForce = 0, this.brake = 0, this.isFrontWheel = t.isFrontWheel, this.clippedInvContactDotSuspension = 1, this.suspensionRelativeVelocity = 0, this.suspensionForce = 0, this.slipInfo = 0, this.skidInfo = 0, this.suspensionLength = 0, this.sideImpulse = 0, this.forwardImpulse = 0, this.raycastResult = new _n(), this.worldTransform = new mt(), this.isInContact = !1;
  }
  updateWheel(t) {
    const e = this.raycastResult;
    if (this.isInContact) {
      const s = e.hitNormalWorld.dot(e.directionWorld);
      e.hitPointWorld.vsub(t.position, qa), t.getVelocityAtWorldPoint(qa, Ea);
      const i = e.hitNormalWorld.dot(Ea);
      if (s >= -0.1)
        this.suspensionRelativeVelocity = 0, this.clippedInvContactDotSuspension = 1 / 0.1;
      else {
        const n = -1 / s;
        this.suspensionRelativeVelocity = i * n, this.clippedInvContactDotSuspension = n;
      }
    } else
      e.suspensionLength = this.suspensionRestLength, this.suspensionRelativeVelocity = 0, e.directionWorld.scale(-1, e.hitNormalWorld), this.clippedInvContactDotSuspension = 1;
  }
}
const Ea = new x(), qa = new x();
class xu {
  /** The car chassis body. */
  chassisBody;
  /** The wheels. */
  wheelInfos;
  /** Will be set to true if the car is sliding. */
  sliding;
  world;
  /** Index of the right axis. x=0, y=1, z=2 */
  indexRightAxis;
  /** Index of the forward axis. x=0, y=1, z=2 */
  indexForwardAxis;
  /** Index of the up axis. x=0, y=1, z=2 */
  indexUpAxis;
  /** The constraints. */
  constraints;
  /** Optional pre-step callback. */
  preStepCallback;
  currentVehicleSpeedKmHour;
  /** Number of wheels on the ground. */
  numWheelsOnGround;
  constructor(t) {
    this.chassisBody = t.chassisBody, this.wheelInfos = [], this.sliding = !1, this.world = null, this.indexRightAxis = typeof t.indexRightAxis < "u" ? t.indexRightAxis : 2, this.indexForwardAxis = typeof t.indexForwardAxis < "u" ? t.indexForwardAxis : 0, this.indexUpAxis = typeof t.indexUpAxis < "u" ? t.indexUpAxis : 1, this.constraints = [], this.preStepCallback = () => {
    }, this.currentVehicleSpeedKmHour = 0, this.numWheelsOnGround = 0;
  }
  /**
   * Add a wheel. For information about the options, see `WheelInfo`.
   */
  addWheel(t = {}) {
    const e = new vc(t), s = this.wheelInfos.length;
    return this.wheelInfos.push(e), s;
  }
  /**
   * Set the steering value of a wheel.
   */
  setSteeringValue(t, e) {
    const s = this.wheelInfos[e];
    s.steering = t;
  }
  /**
   * Set the wheel force to apply on one of the wheels each time step
   */
  applyEngineForce(t, e) {
    this.wheelInfos[e].engineForce = t;
  }
  /**
   * Set the braking force of a wheel
   */
  setBrake(t, e) {
    this.wheelInfos[e].brake = t;
  }
  /**
   * Add the vehicle including its constraints to the world.
   */
  addToWorld(t) {
    t.addBody(this.chassisBody);
    const e = this;
    this.preStepCallback = () => {
      e.updateVehicle(t.dt);
    }, t.addEventListener("preStep", this.preStepCallback), this.world = t;
  }
  /**
   * Get one of the wheel axles, world-oriented.
   */
  getVehicleAxisWorld(t, e) {
    e.set(t === 0 ? 1 : 0, t === 1 ? 1 : 0, t === 2 ? 1 : 0), this.chassisBody.vectorToWorldFrame(e, e);
  }
  updateVehicle(t) {
    const e = this.wheelInfos, s = e.length, i = this.chassisBody;
    for (let m = 0; m < s; m++)
      this.updateWheelTransform(m);
    this.currentVehicleSpeedKmHour = 3.6 * i.velocity.length();
    const n = new x();
    this.getVehicleAxisWorld(this.indexForwardAxis, n), n.dot(i.velocity) < 0 && (this.currentVehicleSpeedKmHour *= -1);
    for (let m = 0; m < s; m++)
      this.castRay(e[m]);
    this.updateSuspension(t);
    const o = new x(), r = new x();
    for (let m = 0; m < s; m++) {
      const h = e[m];
      let u = h.suspensionForce;
      u > h.maxSuspensionForce && (u = h.maxSuspensionForce), h.raycastResult.hitNormalWorld.scale(u * t, o), h.raycastResult.hitPointWorld.vsub(i.position, r), i.applyImpulse(o, r);
    }
    this.updateFriction(t);
    const a = new x(), c = new x(), l = new x();
    for (let m = 0; m < s; m++) {
      const h = e[m];
      i.getVelocityAtWorldPoint(h.chassisConnectionPointWorld, l);
      let u = 1;
      switch (this.indexUpAxis) {
        case 1:
          u = -1;
          break;
      }
      if (h.isInContact) {
        this.getVehicleAxisWorld(this.indexForwardAxis, c);
        const d = c.dot(h.raycastResult.hitNormalWorld);
        h.raycastResult.hitNormalWorld.scale(d, a), c.vsub(a, c);
        const f = c.dot(l);
        h.deltaRotation = u * f * t / h.radius;
      }
      (h.sliding || !h.isInContact) && h.engineForce !== 0 && h.useCustomSlidingRotationalSpeed && (h.deltaRotation = (h.engineForce > 0 ? 1 : -1) * h.customSlidingRotationalSpeed * t), Math.abs(h.brake) > Math.abs(h.engineForce) && (h.deltaRotation = 0), h.rotation += h.deltaRotation, h.deltaRotation *= 0.99;
    }
  }
  updateSuspension(t) {
    const s = this.chassisBody.mass, i = this.wheelInfos, n = i.length;
    for (let o = 0; o < n; o++) {
      const r = i[o];
      if (r.isInContact) {
        let a;
        const c = r.suspensionRestLength, l = r.suspensionLength, m = c - l;
        a = r.suspensionStiffness * m * r.clippedInvContactDotSuspension;
        const h = r.suspensionRelativeVelocity;
        let u;
        h < 0 ? u = r.dampingCompression : u = r.dampingRelaxation, a -= u * h, r.suspensionForce = a * s, r.suspensionForce < 0 && (r.suspensionForce = 0);
      } else
        r.suspensionForce = 0;
    }
  }
  /**
   * Remove the vehicle including its constraints from the world.
   */
  removeFromWorld(t) {
    this.constraints, t.removeBody(this.chassisBody), t.removeEventListener("preStep", this.preStepCallback), this.world = null;
  }
  castRay(t) {
    const e = bu, s = Bu;
    this.updateWheelTransformWorld(t);
    const i = this.chassisBody;
    let n = -1;
    const o = t.suspensionRestLength + t.radius;
    t.directionWorld.scale(o, e);
    const r = t.chassisConnectionPointWorld;
    r.vadd(e, s);
    const a = t.raycastResult;
    a.reset();
    const c = i.collisionResponse;
    i.collisionResponse = !1, this.world.rayTest(r, s, a), i.collisionResponse = c;
    const l = a.body;
    if (t.raycastResult.groundObject = 0, l) {
      n = a.distance, t.raycastResult.hitNormalWorld = a.hitNormalWorld, t.isInContact = !0;
      const m = a.distance;
      t.suspensionLength = m - t.radius;
      const h = t.suspensionRestLength - t.maxSuspensionTravel, u = t.suspensionRestLength + t.maxSuspensionTravel;
      t.suspensionLength < h && (t.suspensionLength = h), t.suspensionLength > u && (t.suspensionLength = u, t.raycastResult.reset());
      const d = t.raycastResult.hitNormalWorld.dot(t.directionWorld), f = new x();
      i.getVelocityAtWorldPoint(t.raycastResult.hitPointWorld, f);
      const y = t.raycastResult.hitNormalWorld.dot(f);
      if (d >= -0.1)
        t.suspensionRelativeVelocity = 0, t.clippedInvContactDotSuspension = 1 / 0.1;
      else {
        const v = -1 / d;
        t.suspensionRelativeVelocity = y * v, t.clippedInvContactDotSuspension = v;
      }
    } else
      t.suspensionLength = t.suspensionRestLength + 0 * t.maxSuspensionTravel, t.suspensionRelativeVelocity = 0, t.directionWorld.scale(-1, t.raycastResult.hitNormalWorld), t.clippedInvContactDotSuspension = 1;
    return n;
  }
  updateWheelTransformWorld(t) {
    t.isInContact = !1;
    const e = this.chassisBody;
    e.pointToWorldFrame(t.chassisConnectionPointLocal, t.chassisConnectionPointWorld), e.vectorToWorldFrame(t.directionLocal, t.directionWorld), e.vectorToWorldFrame(t.axleLocal, t.axleWorld);
  }
  /**
   * Update one of the wheel transform.
   * Note when rendering wheels: during each step, wheel transforms are updated BEFORE the chassis; ie. their position becomes invalid after the step. Thus when you render wheels, you must update wheel transforms before rendering them. See raycastVehicle demo for an example.
   * @param wheelIndex The wheel index to update.
   */
  updateWheelTransform(t) {
    const e = gu, s = vu, i = Au, n = this.wheelInfos[t];
    this.updateWheelTransformWorld(n), n.directionLocal.scale(-1, e), s.copy(n.axleLocal), e.cross(s, i), i.normalize(), s.normalize();
    const o = n.steering, r = new Rt();
    r.setFromAxisAngle(e, o);
    const a = new Rt();
    a.setFromAxisAngle(s, n.rotation);
    const c = n.worldTransform.quaternion;
    this.chassisBody.quaternion.mult(r, c), c.mult(a, c), c.normalize();
    const l = n.worldTransform.position;
    l.copy(n.directionWorld), l.scale(n.suspensionLength, l), l.vadd(n.chassisConnectionPointWorld, l);
  }
  /**
   * Get the world transform of one of the wheels
   */
  getWheelTransformWorld(t) {
    return this.wheelInfos[t].worldTransform;
  }
  updateFriction(t) {
    const e = Su, s = this.wheelInfos, i = s.length, n = this.chassisBody, o = Tu, r = Cu;
    this.numWheelsOnGround = 0;
    for (let l = 0; l < i; l++) {
      const m = s[l];
      m.raycastResult.body && this.numWheelsOnGround++, m.sideImpulse = 0, m.forwardImpulse = 0, o[l] || (o[l] = new x()), r[l] || (r[l] = new x());
    }
    for (let l = 0; l < i; l++) {
      const m = s[l], h = m.raycastResult.body;
      if (h) {
        const u = r[l];
        this.getWheelTransformWorld(l).vectorToWorldFrame(wu[this.indexRightAxis], u);
        const f = m.raycastResult.hitNormalWorld, y = u.dot(f);
        f.scale(y, e), u.vsub(e, u), u.normalize(), f.cross(u, o[l]), o[l].normalize(), m.sideImpulse = Ou(
          n,
          m.raycastResult.hitPointWorld,
          h,
          m.raycastResult.hitPointWorld,
          u
        ), m.sideImpulse *= Mu;
      }
    }
    const a = 1, c = 0.5;
    this.sliding = !1;
    for (let l = 0; l < i; l++) {
      const m = s[l], h = m.raycastResult.body;
      let u = 0;
      if (m.slipInfo = 1, h) {
        const f = m.brake ? m.brake : 0;
        u = zu(
          n,
          h,
          m.raycastResult.hitPointWorld,
          o[l],
          f
        ), u += m.engineForce * t;
        const y = f / u;
        m.slipInfo *= y;
      }
      if (m.forwardImpulse = 0, m.skidInfo = 1, h) {
        m.skidInfo = 1;
        const d = m.suspensionForce * t * m.frictionSlip, y = d * d;
        m.forwardImpulse = u;
        const v = m.forwardImpulse * c / m.forwardAcceleration, g = m.sideImpulse * a / m.sideAcceleration, A = v * v + g * g;
        if (m.sliding = !1, A > y) {
          this.sliding = !0, m.sliding = !0;
          const b = d / Math.sqrt(A);
          m.skidInfo *= b;
        }
      }
    }
    if (this.sliding)
      for (let l = 0; l < i; l++) {
        const m = s[l];
        m.sideImpulse !== 0 && m.skidInfo < 1 && (m.forwardImpulse *= m.skidInfo, m.sideImpulse *= m.skidInfo);
      }
    for (let l = 0; l < i; l++) {
      const m = s[l], h = new x();
      if (m.raycastResult.hitPointWorld.vsub(n.position, h), m.forwardImpulse !== 0) {
        const u = new x();
        o[l].scale(m.forwardImpulse, u), n.applyImpulse(u, h);
      }
      if (m.sideImpulse !== 0) {
        const u = m.raycastResult.body, d = new x();
        m.raycastResult.hitPointWorld.vsub(u.position, d);
        const f = new x();
        r[l].scale(m.sideImpulse, f), n.vectorToLocalFrame(h, h), h["xyz"[this.indexUpAxis]] *= m.rollInfluence, n.vectorToWorldFrame(h, h), n.applyImpulse(f, h), f.scale(-1, f), u.applyImpulse(f, d);
      }
    }
  }
}
const gu = new x(), vu = new x(), Au = new x();
new Kt();
const bu = new x(), Bu = new x(), wu = [new x(1, 0, 0), new x(0, 1, 0), new x(0, 0, 1)], Su = new x(), Cu = [], Tu = [], Mu = 1, Iu = new x(), Pu = new x(), Vu = new x();
function zu(_, t, e, s, i) {
  let n = 0;
  const o = e, r = Iu, a = Pu, c = Vu;
  _.getVelocityAtWorldPoint(o, r), t.getVelocityAtWorldPoint(o, a), r.vsub(a, c);
  const l = s.dot(c), m = La(_, e, s), h = La(t, e, s), d = 1 / (m + h);
  return n = -l * d, i < n && (n = i), n < -i && (n = -i), n;
}
const Fu = new x(), Ru = new x(), Eu = new x(), qu = new x();
function La(_, t, e) {
  const s = Fu, i = Ru, n = Eu, o = qu;
  return t.vsub(_.position, s), s.cross(e, i), _.invInertiaWorld.vmult(i, o), o.cross(s, n), _.invMass + e.dot(n);
}
const Lu = new x(), Nu = new x(), ku = new x();
function Ou(_, t, e, s, i) {
  if (i.lengthSquared() > 1.1)
    return 0;
  const o = Lu, r = Nu, a = ku;
  _.getVelocityAtWorldPoint(t, o), e.getVelocityAtWorldPoint(s, r), o.vsub(r, a);
  const c = i.dot(a), l = 1 / (_.invMass + e.invMass);
  return -0.2 * c * l;
}
class Ac extends Y {
  /**
   * The radius of the sphere.
   */
  radius;
  /**
   *
   * @param radius The radius of the sphere, a non-negative number.
   */
  constructor(t) {
    if (super({ type: Y.types.SPHERE }), this.radius = t !== void 0 ? t : 1, this.radius < 0)
      throw new Error("The sphere radius cannot be negative.");
    this.updateBoundingSphereRadius();
  }
  /** calculateLocalInertia */
  calculateLocalInertia(t, e = new x()) {
    const s = 2 * t * this.radius * this.radius / 5;
    return e.x = s, e.y = s, e.z = s, e;
  }
  /** volume */
  volume() {
    return 4 * Math.PI * Math.pow(this.radius, 3) / 3;
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = this.radius;
  }
  calculateWorldAABB(t, e, s, i) {
    const n = this.radius, o = ["x", "y", "z"];
    for (let r = 0; r < o.length; r++) {
      const a = o[r];
      s[a] = t[a] - n, i[a] = t[a] + n;
    }
  }
}
class ju {
  /**
   * The bodies of the wheels.
   */
  wheelBodies;
  coordinateSystem;
  /**
   * The chassis body.
   */
  chassisBody;
  /**
   * The constraints.
   */
  constraints;
  /**
   * The wheel axes.
   */
  wheelAxes;
  /**
   * The wheel forces.
   */
  wheelForces;
  constructor(t = {}) {
    this.wheelBodies = [], this.coordinateSystem = typeof t.coordinateSystem < "u" ? t.coordinateSystem.clone() : new x(1, 2, 3), t.chassisBody ? this.chassisBody = t.chassisBody : this.chassisBody = new G({ mass: 1, shape: new xn(new x(5, 0.5, 2)) }), this.constraints = [], this.wheelAxes = [], this.wheelForces = [];
  }
  /**
   * Add a wheel
   */
  addWheel(t = {}) {
    let e;
    t.body ? e = t.body : e = new G({ mass: 1, shape: new Ac(1.2) }), this.wheelBodies.push(e), this.wheelForces.push(0);
    const s = typeof t.position < "u" ? t.position.clone() : new x(), i = new x();
    this.chassisBody.pointToWorldFrame(s, i), e.position.set(i.x, i.y, i.z);
    const n = typeof t.axis < "u" ? t.axis.clone() : new x(0, 0, 1);
    this.wheelAxes.push(n);
    const o = new gc(this.chassisBody, e, {
      pivotA: s,
      axisA: n,
      pivotB: x.ZERO,
      axisB: n,
      collideConnected: !1
    });
    return this.constraints.push(o), this.wheelBodies.length - 1;
  }
  /**
   * Set the steering value of a wheel.
   * @todo check coordinateSystem
   */
  setSteeringValue(t, e) {
    const s = this.wheelAxes[e], i = Math.cos(t), n = Math.sin(t), o = s.x, r = s.z;
    this.constraints[e].axisA.set(-i * o + n * r, 0, n * o + i * r);
  }
  /**
   * Set the target rotational speed of the hinge constraint.
   */
  setMotorSpeed(t, e) {
    const s = this.constraints[e];
    s.enableMotor(), s.motorTargetVelocity = t;
  }
  /**
   * Set the target rotational speed of the hinge constraint.
   */
  disableMotor(t) {
    this.constraints[t].disableMotor();
  }
  /**
   * Set the wheel force to apply on one of the wheels each time step
   */
  setWheelForce(t, e) {
    this.wheelForces[e] = t;
  }
  /**
   * Apply a torque on one of the wheels.
   */
  applyWheelForce(t, e) {
    const s = this.wheelAxes[e], i = this.wheelBodies[e], n = i.torque;
    s.scale(t, Jn), i.vectorToWorldFrame(Jn, Jn), n.vadd(Jn, n);
  }
  /**
   * Add the vehicle including its constraints to the world.
   */
  addToWorld(t) {
    const e = this.constraints, s = this.wheelBodies.concat([this.chassisBody]);
    for (let i = 0; i < s.length; i++)
      t.addBody(s[i]);
    for (let i = 0; i < e.length; i++)
      t.addConstraint(e[i]);
    t.addEventListener("preStep", this._update.bind(this));
  }
  _update() {
    const t = this.wheelForces;
    for (let e = 0; e < t.length; e++)
      this.applyWheelForce(t[e], e);
  }
  /**
   * Remove the vehicle including its constraints from the world.
   */
  removeFromWorld(t) {
    const e = this.constraints, s = this.wheelBodies.concat([this.chassisBody]);
    for (let i = 0; i < s.length; i++)
      t.removeBody(s[i]);
    for (let i = 0; i < e.length; i++)
      t.removeConstraint(e[i]);
  }
  /**
   * Get current rotational velocity of a wheel
   */
  getWheelSpeed(t) {
    const e = this.wheelAxes[t], i = this.wheelBodies[t].angularVelocity;
    return this.chassisBody.vectorToWorldFrame(e, Na), i.dot(Na);
  }
}
const Jn = new x(), Na = new x();
class Du {
  /**
   * The particles array.
   */
  particles;
  /**
   * Density of the system (kg/m3).
   * @default 1
   */
  density;
  /**
   * Distance below which two particles are considered to be neighbors.
   * It should be adjusted so there are about 15-20 neighbor particles within this radius.
   * @default 1
   */
  smoothingRadius;
  /**
   * @default 1
   */
  speedOfSound;
  /**
   * Viscosity of the system.
   * @default 0.01
   */
  viscosity;
  /**
   * @default 0.000001
   */
  eps;
  pressures;
  densities;
  neighbors;
  constructor() {
    this.particles = [], this.density = 1, this.smoothingRadius = 1, this.speedOfSound = 1, this.viscosity = 0.01, this.eps = 1e-6, this.pressures = [], this.densities = [], this.neighbors = [];
  }
  /**
   * Add a particle to the system.
   */
  add(t) {
    this.particles.push(t), this.neighbors.length < this.particles.length && this.neighbors.push([]);
  }
  /**
   * Remove a particle from the system.
   */
  remove(t) {
    const e = this.particles.indexOf(t);
    e !== -1 && (this.particles.splice(e, 1), this.neighbors.length > this.particles.length && this.neighbors.pop());
  }
  /**
   * Get neighbors within smoothing volume, save in the array neighbors
   */
  getNeighbors(t, e) {
    const s = this.particles.length, i = t.id, n = this.smoothingRadius * this.smoothingRadius, o = Wu;
    for (let r = 0; r !== s; r++) {
      const a = this.particles[r];
      a.position.vsub(t.position, o), i !== a.id && o.lengthSquared() < n && e.push(a);
    }
  }
  update() {
    const t = this.particles.length, e = Yu, s = this.speedOfSound, i = this.eps;
    for (let l = 0; l !== t; l++) {
      const m = this.particles[l], h = this.neighbors[l];
      h.length = 0, this.getNeighbors(m, h), h.push(this.particles[l]);
      const u = h.length;
      let d = 0;
      for (let f = 0; f !== u; f++) {
        m.position.vsub(h[f].position, e);
        const y = e.length(), v = this.w(y);
        d += h[f].mass * v;
      }
      this.densities[l] = d, this.pressures[l] = s * s * (this.densities[l] - this.density);
    }
    const n = $u, o = Hu, r = Uu, a = Gu, c = Xu;
    for (let l = 0; l !== t; l++) {
      const m = this.particles[l];
      n.set(0, 0, 0), o.set(0, 0, 0);
      let h, u;
      const d = this.neighbors[l], f = d.length;
      for (let y = 0; y !== f; y++) {
        const v = d[y];
        m.position.vsub(v.position, a);
        const g = a.length();
        h = -v.mass * (this.pressures[l] / (this.densities[l] * this.densities[l] + i) + this.pressures[y] / (this.densities[y] * this.densities[y] + i)), this.gradw(a, r), r.scale(h, r), n.vadd(r, n), v.velocity.vsub(m.velocity, c), c.scale(1 / (1e-4 + this.densities[l] * this.densities[y]) * this.viscosity * v.mass, c), u = this.nablaw(g), c.scale(u, c), o.vadd(c, o);
      }
      o.scale(m.mass, o), n.scale(m.mass, n), m.force.vadd(o, m.force), m.force.vadd(n, m.force);
    }
  }
  // Calculate the weight using the W(r) weightfunction
  w(t) {
    const e = this.smoothingRadius;
    return 315 / (64 * Math.PI * e ** 9) * (e * e - t * t) ** 3;
  }
  // calculate gradient of the weight function
  gradw(t, e) {
    const s = t.length(), i = this.smoothingRadius;
    t.scale(945 / (32 * Math.PI * i ** 9) * (i * i - s * s) ** 2, e);
  }
  // Calculate nabla(W)
  nablaw(t) {
    const e = this.smoothingRadius;
    return 945 / (32 * Math.PI * e ** 9) * (e * e - t * t) * (7 * t * t - 3 * e * e);
  }
}
const Wu = new x(), Yu = new x(), $u = new x(), Hu = new x(), Uu = new x(), Gu = new x(), Xu = new x();
class Ku extends Ps {
  /** The radius of the top of the Cylinder. */
  radiusTop;
  /** The radius of the bottom of the Cylinder. */
  radiusBottom;
  /** The height of the Cylinder. */
  height;
  /** The number of segments to build the cylinder out of. */
  numSegments;
  /**
   * @param radiusTop The radius of the top of the Cylinder.
   * @param radiusBottom The radius of the bottom of the Cylinder.
   * @param height The height of the Cylinder.
   * @param numSegments The number of segments to build the cylinder out of.
   */
  constructor(t = 1, e = 1, s = 1, i = 8) {
    if (t < 0)
      throw new Error("The cylinder radiusTop cannot be negative.");
    if (e < 0)
      throw new Error("The cylinder radiusBottom cannot be negative.");
    const n = i, o = [], r = [], a = [], c = [], l = [], m = Math.cos, h = Math.sin;
    o.push(new x(-e * h(0), -s * 0.5, e * m(0))), c.push(0), o.push(new x(-t * h(0), s * 0.5, t * m(0))), l.push(1);
    for (let d = 0; d < n; d++) {
      const f = 2 * Math.PI / n * (d + 1), y = 2 * Math.PI / n * (d + 0.5);
      d < n - 1 ? (o.push(new x(-e * h(f), -s * 0.5, e * m(f))), c.push(2 * d + 2), o.push(new x(-t * h(f), s * 0.5, t * m(f))), l.push(2 * d + 3), a.push([2 * d, 2 * d + 1, 2 * d + 3, 2 * d + 2])) : a.push([2 * d, 2 * d + 1, 1, 0]), (n % 2 === 1 || d < n / 2) && r.push(new x(-h(y), 0, m(y)));
    }
    a.push(c), r.push(new x(0, 1, 0));
    const u = [];
    for (let d = 0; d < l.length; d++)
      u.push(l[l.length - d - 1]);
    a.push(u), super({ vertices: o, faces: a, axes: r }), this.type = Y.types.CYLINDER, this.radiusTop = t, this.radiusBottom = e, this.height = s, this.numSegments = i;
  }
}
class Zu extends Y {
  constructor() {
    super({ type: Y.types.PARTICLE });
  }
  /**
   * calculateLocalInertia
   */
  calculateLocalInertia(t, e = new x()) {
    return e.set(0, 0, 0), e;
  }
  volume() {
    return 0;
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = 0;
  }
  calculateWorldAABB(t, e, s, i) {
    s.copy(t), i.copy(t);
  }
}
class Ju extends Y {
  /** worldNormal */
  worldNormal;
  /** worldNormalNeedsUpdate */
  worldNormalNeedsUpdate;
  boundingSphereRadius;
  constructor() {
    super({ type: Y.types.PLANE }), this.worldNormal = new x(), this.worldNormalNeedsUpdate = !0, this.boundingSphereRadius = Number.MAX_VALUE;
  }
  /** computeWorldNormal */
  computeWorldNormal(t) {
    const e = this.worldNormal;
    e.set(0, 0, 1), t.vmult(e, e), this.worldNormalNeedsUpdate = !1;
  }
  calculateLocalInertia(t, e = new x()) {
    return e;
  }
  volume() {
    return (
      // The plane is infinite...
      Number.MAX_VALUE
    );
  }
  calculateWorldAABB(t, e, s, i) {
    Bs.set(0, 0, 1), e.vmult(Bs, Bs);
    const n = Number.MAX_VALUE;
    s.set(-n, -n, -n), i.set(n, n, n), Bs.x === 1 ? i.x = t.x : Bs.x === -1 && (s.x = t.x), Bs.y === 1 ? i.y = t.y : Bs.y === -1 && (s.y = t.y), Bs.z === 1 ? i.z = t.z : Bs.z === -1 && (s.z = t.z);
  }
  updateBoundingSphereRadius() {
    this.boundingSphereRadius = Number.MAX_VALUE;
  }
}
const Bs = new x();
class Qu extends Y {
  /**
   * An array of numbers, or height values, that are spread out along the x axis.
   */
  data;
  /**
   * Max value of the data points in the data array.
   */
  maxValue;
  /**
   * Minimum value of the data points in the data array.
   */
  minValue;
  /**
   * World spacing between the data points in X and Y direction.
   * @todo elementSizeX and Y
   * @default 1
   */
  elementSize;
  /**
   * @default true
   */
  cacheEnabled;
  pillarConvex;
  pillarOffset;
  _cachedPillars;
  /**
   * @param data An array of numbers, or height values, that are spread out along the x axis.
   */
  constructor(t, e = {}) {
    e = bo.defaults(e, {
      maxValue: null,
      minValue: null,
      elementSize: 1
    }), super({ type: Y.types.HEIGHTFIELD }), this.data = t, this.maxValue = e.maxValue, this.minValue = e.minValue, this.elementSize = e.elementSize, e.minValue === null && this.updateMinValue(), e.maxValue === null && this.updateMaxValue(), this.cacheEnabled = !0, this.pillarConvex = new Ps(), this.pillarOffset = new x(), this.updateBoundingSphereRadius(), this._cachedPillars = {};
  }
  /**
   * Call whenever you change the data array.
   */
  update() {
    this._cachedPillars = {};
  }
  /**
   * Update the `minValue` property
   */
  updateMinValue() {
    const t = this.data;
    let e = t[0][0];
    for (let s = 0; s !== t.length; s++)
      for (let i = 0; i !== t[s].length; i++) {
        const n = t[s][i];
        n < e && (e = n);
      }
    this.minValue = e;
  }
  /**
   * Update the `maxValue` property
   */
  updateMaxValue() {
    const t = this.data;
    let e = t[0][0];
    for (let s = 0; s !== t.length; s++)
      for (let i = 0; i !== t[s].length; i++) {
        const n = t[s][i];
        n > e && (e = n);
      }
    this.maxValue = e;
  }
  /**
   * Set the height value at an index. Don't forget to update maxValue and minValue after you're done.
   */
  setHeightValueAtIndex(t, e, s) {
    const i = this.data;
    i[t][e] = s, this.clearCachedConvexTrianglePillar(t, e, !1), t > 0 && (this.clearCachedConvexTrianglePillar(t - 1, e, !0), this.clearCachedConvexTrianglePillar(t - 1, e, !1)), e > 0 && (this.clearCachedConvexTrianglePillar(t, e - 1, !0), this.clearCachedConvexTrianglePillar(t, e - 1, !1)), e > 0 && t > 0 && this.clearCachedConvexTrianglePillar(t - 1, e - 1, !0);
  }
  /**
   * Get max/min in a rectangle in the matrix data
   * @param result An array to store the results in.
   * @return The result array, if it was passed in. Minimum will be at position 0 and max at 1.
   */
  getRectMinMax(t, e, s, i, n = []) {
    const o = this.data;
    let r = this.minValue;
    for (let a = t; a <= s; a++)
      for (let c = e; c <= i; c++) {
        const l = o[a][c];
        l > r && (r = l);
      }
    n[0] = this.minValue, n[1] = r;
  }
  /**
   * Get the index of a local position on the heightfield. The indexes indicate the rectangles, so if your terrain is made of N x N height data points, you will have rectangle indexes ranging from 0 to N-1.
   * @param result Two-element array
   * @param clamp If the position should be clamped to the heightfield edge.
   */
  getIndexOfPosition(t, e, s, i) {
    const n = this.elementSize, o = this.data;
    let r = Math.floor(t / n), a = Math.floor(e / n);
    return s[0] = r, s[1] = a, i && (r < 0 && (r = 0), a < 0 && (a = 0), r >= o.length - 1 && (r = o.length - 1), a >= o[0].length - 1 && (a = o[0].length - 1)), !(r < 0 || a < 0 || r >= o.length - 1 || a >= o[0].length - 1);
  }
  getTriangleAt(t, e, s, i, n, o) {
    const r = ka;
    this.getIndexOfPosition(t, e, r, s);
    let a = r[0], c = r[1];
    const l = this.data;
    s && (a = Math.min(l.length - 2, Math.max(0, a)), c = Math.min(l[0].length - 2, Math.max(0, c)));
    const m = this.elementSize, h = (t / m - a) ** 2 + (e / m - c) ** 2, u = (t / m - (a + 1)) ** 2 + (e / m - (c + 1)) ** 2, d = h > u;
    return this.getTriangle(a, c, d, i, n, o), d;
  }
  getNormalAt(t, e, s, i) {
    const n = id, o = nd, r = od, a = rd, c = ad;
    this.getTriangleAt(t, e, s, n, o, r), o.vsub(n, a), r.vsub(n, c), a.cross(c, i), i.normalize();
  }
  /**
   * Get an AABB of a square in the heightfield
   * @param xi
   * @param yi
   * @param result
   */
  getAabbAtIndex(t, e, { lowerBound: s, upperBound: i }) {
    const n = this.data, o = this.elementSize;
    s.set(t * o, e * o, n[t][e]), i.set((t + 1) * o, (e + 1) * o, n[t + 1][e + 1]);
  }
  /**
   * Get the height in the heightfield at a given position
   */
  getHeightAt(t, e, s) {
    const i = this.data, n = td, o = ed, r = sd, a = ka;
    this.getIndexOfPosition(t, e, a, s);
    let c = a[0], l = a[1];
    s && (c = Math.min(i.length - 2, Math.max(0, c)), l = Math.min(i[0].length - 2, Math.max(0, l)));
    const m = this.getTriangleAt(t, e, s, n, o, r);
    cd(t, e, n.x, n.y, o.x, o.y, r.x, r.y, Oa);
    const h = Oa;
    return m ? i[c + 1][l + 1] * h.x + i[c][l + 1] * h.y + i[c + 1][l] * h.z : i[c][l] * h.x + i[c + 1][l] * h.y + i[c][l + 1] * h.z;
  }
  getCacheConvexTrianglePillarKey(t, e, s) {
    return `${t}_${e}_${s ? 1 : 0}`;
  }
  getCachedConvexTrianglePillar(t, e, s) {
    return this._cachedPillars[this.getCacheConvexTrianglePillarKey(t, e, s)];
  }
  setCachedConvexTrianglePillar(t, e, s, i, n) {
    this._cachedPillars[this.getCacheConvexTrianglePillarKey(t, e, s)] = {
      convex: i,
      offset: n
    };
  }
  clearCachedConvexTrianglePillar(t, e, s) {
    delete this._cachedPillars[this.getCacheConvexTrianglePillarKey(t, e, s)];
  }
  /**
   * Get a triangle from the heightfield
   */
  getTriangle(t, e, s, i, n, o) {
    const r = this.data, a = this.elementSize;
    s ? (i.set((t + 1) * a, (e + 1) * a, r[t + 1][e + 1]), n.set(t * a, (e + 1) * a, r[t][e + 1]), o.set((t + 1) * a, e * a, r[t + 1][e])) : (i.set(t * a, e * a, r[t][e]), n.set((t + 1) * a, e * a, r[t + 1][e]), o.set(t * a, (e + 1) * a, r[t][e + 1]));
  }
  /**
   * Get a triangle in the terrain in the form of a triangular convex shape.
   */
  getConvexTrianglePillar(t, e, s) {
    let i = this.pillarConvex, n = this.pillarOffset;
    if (this.cacheEnabled) {
      const m = this.getCachedConvexTrianglePillar(t, e, s);
      if (m) {
        this.pillarConvex = m.convex, this.pillarOffset = m.offset;
        return;
      }
      i = new Ps(), n = new x(), this.pillarConvex = i, this.pillarOffset = n;
    }
    const o = this.data, r = this.elementSize, a = i.faces;
    i.vertices.length = 6;
    for (let m = 0; m < 6; m++)
      i.vertices[m] || (i.vertices[m] = new x());
    a.length = 5;
    for (let m = 0; m < 5; m++)
      a[m] || (a[m] = []);
    const c = i.vertices, l = (Math.min(o[t][e], o[t + 1][e], o[t][e + 1], o[t + 1][e + 1]) - this.minValue) / 2 + this.minValue;
    s ? (n.set(
      (t + 0.75) * r,
      // sort of center of a triangle
      (e + 0.75) * r,
      l
      // vertical center
    ), c[0].set(0.25 * r, 0.25 * r, o[t + 1][e + 1] - l), c[1].set(-0.75 * r, 0.25 * r, o[t][e + 1] - l), c[2].set(0.25 * r, -0.75 * r, o[t + 1][e] - l), c[3].set(0.25 * r, 0.25 * r, -Math.abs(l) - 1), c[4].set(-0.75 * r, 0.25 * r, -Math.abs(l) - 1), c[5].set(0.25 * r, -0.75 * r, -Math.abs(l) - 1), a[0][0] = 0, a[0][1] = 1, a[0][2] = 2, a[1][0] = 5, a[1][1] = 4, a[1][2] = 3, a[2][0] = 2, a[2][1] = 5, a[2][2] = 3, a[2][3] = 0, a[3][0] = 3, a[3][1] = 4, a[3][2] = 1, a[3][3] = 0, a[4][0] = 1, a[4][1] = 4, a[4][2] = 5, a[4][3] = 2) : (n.set(
      (t + 0.25) * r,
      // sort of center of a triangle
      (e + 0.25) * r,
      l
      // vertical center
    ), c[0].set(-0.25 * r, -0.25 * r, o[t][e] - l), c[1].set(0.75 * r, -0.25 * r, o[t + 1][e] - l), c[2].set(-0.25 * r, 0.75 * r, o[t][e + 1] - l), c[3].set(-0.25 * r, -0.25 * r, -Math.abs(l) - 1), c[4].set(0.75 * r, -0.25 * r, -Math.abs(l) - 1), c[5].set(-0.25 * r, 0.75 * r, -Math.abs(l) - 1), a[0][0] = 0, a[0][1] = 1, a[0][2] = 2, a[1][0] = 5, a[1][1] = 4, a[1][2] = 3, a[2][0] = 0, a[2][1] = 2, a[2][2] = 5, a[2][3] = 3, a[3][0] = 1, a[3][1] = 0, a[3][2] = 3, a[3][3] = 4, a[4][0] = 4, a[4][1] = 5, a[4][2] = 2, a[4][3] = 1), i.computeNormals(), i.computeEdges(), i.updateBoundingSphereRadius(), this.setCachedConvexTrianglePillar(t, e, s, i, n);
  }
  calculateLocalInertia(t, e = new x()) {
    return e.set(0, 0, 0), e;
  }
  volume() {
    return (
      // The terrain is infinite
      Number.MAX_VALUE
    );
  }
  calculateWorldAABB(t, e, s, i) {
    s.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE), i.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  }
  updateBoundingSphereRadius() {
    const t = this.data, e = this.elementSize;
    this.boundingSphereRadius = new x(
      t.length * e,
      t[0].length * e,
      Math.max(Math.abs(this.maxValue), Math.abs(this.minValue))
    ).length();
  }
  /**
   * Sets the height values from an image. Currently only supported in browser.
   */
  setHeightsFromImage(t, e) {
    const { x: s, z: i, y: n } = e, o = document.createElement("canvas");
    o.width = t.width, o.height = t.height;
    const r = o.getContext("2d");
    r.drawImage(t, 0, 0);
    const a = r.getImageData(0, 0, t.width, t.height), c = this.data;
    c.length = 0, this.elementSize = Math.abs(s) / a.width;
    for (let l = 0; l < a.height; l++) {
      const m = [];
      for (let h = 0; h < a.width; h++) {
        const u = a.data[(l * a.height + h) * 4], d = a.data[(l * a.height + h) * 4 + 1], f = a.data[(l * a.height + h) * 4 + 2], y = (u + d + f) / 4 / 255 * i;
        s < 0 ? m.push(y) : m.unshift(y);
      }
      n < 0 ? c.unshift(m) : c.push(m);
    }
    this.updateMaxValue(), this.updateMinValue(), this.update();
  }
}
const ka = [], Oa = new x(), td = new x(), ed = new x(), sd = new x(), id = new x(), nd = new x(), od = new x(), rd = new x(), ad = new x();
function cd(_, t, e, s, i, n, o, r, a) {
  a.x = ((n - r) * (_ - o) + (o - i) * (t - r)) / ((n - r) * (e - o) + (o - i) * (s - r)), a.y = ((r - s) * (_ - o) + (e - o) * (t - r)) / ((n - r) * (e - o) + (o - i) * (s - r)), a.z = 1 - a.x - a.y;
}
class _s {
  /** The root node */
  root;
  /** Boundary of this node */
  aabb;
  /** Contained data at the current node level */
  data;
  /** Children to this node */
  children;
  constructor(t = {}) {
    this.root = t.root || null, this.aabb = t.aabb ? t.aabb.clone() : new Mt(), this.data = [], this.children = [];
  }
  /**
   * reset
   */
  reset() {
    this.children.length = this.data.length = 0;
  }
  /**
   * Insert data into this node
   * @return True if successful, otherwise false
   */
  insert(t, e, s = 0) {
    const i = this.data;
    if (!this.aabb.contains(t))
      return !1;
    const n = this.children, o = this.maxDepth || this.root.maxDepth;
    if (s < o) {
      let r = !1;
      n.length || (this.subdivide(), r = !0);
      for (let a = 0; a !== 8; a++)
        if (n[a].insert(t, e, s + 1))
          return !0;
      r && (n.length = 0);
    }
    return i.push(e), !0;
  }
  /**
   * Create 8 equally sized children nodes and put them in the `children` array.
   */
  subdivide() {
    const t = this.aabb, e = t.lowerBound, s = t.upperBound, i = this.children;
    i.push(
      new _s({ aabb: new Mt({ lowerBound: new x(0, 0, 0) }) }),
      new _s({ aabb: new Mt({ lowerBound: new x(1, 0, 0) }) }),
      new _s({ aabb: new Mt({ lowerBound: new x(1, 1, 0) }) }),
      new _s({ aabb: new Mt({ lowerBound: new x(1, 1, 1) }) }),
      new _s({ aabb: new Mt({ lowerBound: new x(0, 1, 1) }) }),
      new _s({ aabb: new Mt({ lowerBound: new x(0, 0, 1) }) }),
      new _s({ aabb: new Mt({ lowerBound: new x(1, 0, 1) }) }),
      new _s({ aabb: new Mt({ lowerBound: new x(0, 1, 0) }) })
    ), s.vsub(e, mi), mi.scale(0.5, mi);
    const n = this.root || this;
    for (let o = 0; o !== 8; o++) {
      const r = i[o];
      r.root = n;
      const a = r.aabb.lowerBound;
      a.x *= mi.x, a.y *= mi.y, a.z *= mi.z, a.vadd(e, a), a.vadd(mi, r.aabb.upperBound);
    }
  }
  /**
   * Get all data, potentially within an AABB
   * @return The "result" object
   */
  aabbQuery(t, e) {
    this.data, this.children;
    const s = [this];
    for (; s.length; ) {
      const i = s.pop();
      i.aabb.overlaps(t) && Array.prototype.push.apply(e, i.data), Array.prototype.push.apply(s, i.children);
    }
    return e;
  }
  /**
   * Get all data, potentially intersected by a ray.
   * @return The "result" object
   */
  rayQuery(t, e, s) {
    return t.getAABB(Qn), Qn.toLocalFrame(e, Qn), this.aabbQuery(Qn, s), s;
  }
  /**
   * removeEmptyNodes
   */
  removeEmptyNodes() {
    for (let t = this.children.length - 1; t >= 0; t--)
      this.children[t].removeEmptyNodes(), !this.children[t].children.length && !this.children[t].data.length && this.children.splice(t, 1);
  }
}
class ld extends _s {
  /**
   * Maximum subdivision depth
   * @default 8
   */
  maxDepth;
  /**
   * @param aabb The total AABB of the tree
   */
  constructor(t, e = {}) {
    super({ root: null, aabb: t }), this.maxDepth = typeof e.maxDepth < "u" ? e.maxDepth : 8;
  }
}
const mi = new x(), Qn = new Mt();
class ho extends Y {
  /**
   * vertices
   */
  vertices;
  /**
   * Array of integers, indicating which vertices each triangle consists of. The length of this array is thus 3 times the number of triangles.
   */
  indices;
  /**
   * The normals data.
   */
  normals;
  /**
   * The local AABB of the mesh.
   */
  aabb;
  /**
   * References to vertex pairs, making up all unique edges in the trimesh.
   */
  edges;
  /**
   * Local scaling of the mesh. Use .setScale() to set it.
   */
  scale;
  /**
   * The indexed triangles. Use .updateTree() to update it.
   */
  tree;
  constructor(t, e) {
    super({ type: Y.types.TRIMESH }), this.vertices = new Float32Array(t), this.indices = new Int16Array(e), this.normals = new Float32Array(e.length), this.aabb = new Mt(), this.edges = null, this.scale = new x(1, 1, 1), this.tree = new ld(), this.updateEdges(), this.updateNormals(), this.updateAABB(), this.updateBoundingSphereRadius(), this.updateTree();
  }
  /**
   * updateTree
   */
  updateTree() {
    const t = this.tree;
    t.reset(), t.aabb.copy(this.aabb);
    const e = this.scale;
    t.aabb.lowerBound.x *= 1 / e.x, t.aabb.lowerBound.y *= 1 / e.y, t.aabb.lowerBound.z *= 1 / e.z, t.aabb.upperBound.x *= 1 / e.x, t.aabb.upperBound.y *= 1 / e.y, t.aabb.upperBound.z *= 1 / e.z;
    const s = new Mt(), i = new x(), n = new x(), o = new x(), r = [i, n, o];
    for (let a = 0; a < this.indices.length / 3; a++) {
      const c = a * 3;
      this._getUnscaledVertex(this.indices[c], i), this._getUnscaledVertex(this.indices[c + 1], n), this._getUnscaledVertex(this.indices[c + 2], o), s.setFromPoints(r), t.insert(s, a);
    }
    t.removeEmptyNodes();
  }
  /**
   * Get triangles in a local AABB from the trimesh.
   * @param result An array of integers, referencing the queried triangles.
   */
  getTrianglesInAABB(t, e) {
    to.copy(t);
    const s = this.scale, i = s.x, n = s.y, o = s.z, r = to.lowerBound, a = to.upperBound;
    return r.x /= i, r.y /= n, r.z /= o, a.x /= i, a.y /= n, a.z /= o, this.tree.aabbQuery(to, e);
  }
  /**
   * setScale
   */
  setScale(t) {
    const e = this.scale.x === this.scale.y && this.scale.y === this.scale.z, s = t.x === t.y && t.y === t.z;
    e && s || this.updateNormals(), this.scale.copy(t), this.updateAABB(), this.updateBoundingSphereRadius();
  }
  /**
   * Compute the normals of the faces. Will save in the `.normals` array.
   */
  updateNormals() {
    const t = hd, e = this.normals;
    for (let s = 0; s < this.indices.length / 3; s++) {
      const i = s * 3, n = this.indices[i], o = this.indices[i + 1], r = this.indices[i + 2];
      this.getVertex(n, Wa), this.getVertex(o, Ya), this.getVertex(r, $a), ho.computeNormal(Ya, Wa, $a, t), e[i] = t.x, e[i + 1] = t.y, e[i + 2] = t.z;
    }
  }
  /**
   * Update the `.edges` property
   */
  updateEdges() {
    const t = {}, e = (i, n) => {
      const o = i < n ? `${i}_${n}` : `${n}_${i}`;
      t[o] = !0;
    };
    for (let i = 0; i < this.indices.length / 3; i++) {
      const n = i * 3, o = this.indices[n], r = this.indices[n + 1], a = this.indices[n + 2];
      e(o, r), e(r, a), e(a, o);
    }
    const s = Object.keys(t);
    this.edges = new Int16Array(s.length * 2);
    for (let i = 0; i < s.length; i++) {
      const n = s[i].split("_");
      this.edges[2 * i] = parseInt(n[0], 10), this.edges[2 * i + 1] = parseInt(n[1], 10);
    }
  }
  /**
   * Get an edge vertex
   * @param firstOrSecond 0 or 1, depending on which one of the vertices you need.
   * @param vertexStore Where to store the result
   */
  getEdgeVertex(t, e, s) {
    const i = this.edges[t * 2 + (e ? 1 : 0)];
    this.getVertex(i, s);
  }
  /**
   * Get a vector along an edge.
   */
  getEdgeVector(t, e) {
    const s = md, i = ud;
    this.getEdgeVertex(t, 0, s), this.getEdgeVertex(t, 1, i), i.vsub(s, e);
  }
  /**
   * Get face normal given 3 vertices
   */
  static computeNormal(t, e, s, i) {
    e.vsub(t, Da), s.vsub(e, ja), ja.cross(Da, i), i.isZero() || i.normalize();
  }
  /**
   * Get vertex i.
   * @return The "out" vector object
   */
  getVertex(t, e) {
    const s = this.scale;
    return this._getUnscaledVertex(t, e), e.x *= s.x, e.y *= s.y, e.z *= s.z, e;
  }
  /**
   * Get raw vertex i
   * @return The "out" vector object
   */
  _getUnscaledVertex(t, e) {
    const s = t * 3, i = this.vertices;
    return e.set(i[s], i[s + 1], i[s + 2]);
  }
  /**
   * Get a vertex from the trimesh,transformed by the given position and quaternion.
   * @return The "out" vector object
   */
  getWorldVertex(t, e, s, i) {
    return this.getVertex(t, i), mt.pointToWorldFrame(e, s, i, i), i;
  }
  /**
   * Get the three vertices for triangle i.
   */
  getTriangleVertices(t, e, s, i) {
    const n = t * 3;
    this.getVertex(this.indices[n], e), this.getVertex(this.indices[n + 1], s), this.getVertex(this.indices[n + 2], i);
  }
  /**
   * Compute the normal of triangle i.
   * @return The "target" vector object
   */
  getNormal(t, e) {
    const s = t * 3;
    return e.set(this.normals[s], this.normals[s + 1], this.normals[s + 2]);
  }
  /**
   * @return The "target" vector object
   */
  calculateLocalInertia(t, e) {
    this.computeLocalAABB(ui);
    const s = ui.upperBound.x - ui.lowerBound.x, i = ui.upperBound.y - ui.lowerBound.y, n = ui.upperBound.z - ui.lowerBound.z;
    return e.set(
      1 / 12 * t * (2 * i * 2 * i + 2 * n * 2 * n),
      1 / 12 * t * (2 * s * 2 * s + 2 * n * 2 * n),
      1 / 12 * t * (2 * i * 2 * i + 2 * s * 2 * s)
    );
  }
  /**
   * Compute the local AABB for the trimesh
   */
  computeLocalAABB(t) {
    const e = t.lowerBound, s = t.upperBound, i = this.vertices.length;
    this.vertices;
    const n = dd;
    this.getVertex(0, n), e.copy(n), s.copy(n);
    for (let o = 0; o !== i; o++)
      this.getVertex(o, n), n.x < e.x ? e.x = n.x : n.x > s.x && (s.x = n.x), n.y < e.y ? e.y = n.y : n.y > s.y && (s.y = n.y), n.z < e.z ? e.z = n.z : n.z > s.z && (s.z = n.z);
  }
  /**
   * Update the `.aabb` property
   */
  updateAABB() {
    this.computeLocalAABB(this.aabb);
  }
  /**
   * Will update the `.boundingSphereRadius` property
   */
  updateBoundingSphereRadius() {
    let t = 0;
    const e = this.vertices, s = new x();
    for (let i = 0, n = e.length / 3; i !== n; i++) {
      this.getVertex(i, s);
      const o = s.lengthSquared();
      o > t && (t = o);
    }
    this.boundingSphereRadius = Math.sqrt(t);
  }
  /**
   * calculateWorldAABB
   */
  calculateWorldAABB(t, e, s, i) {
    const n = pd, o = _d;
    n.position = t, n.quaternion = e, this.aabb.toWorldFrame(n, o), s.copy(o.lowerBound), i.copy(o.upperBound);
  }
  /**
   * Get approximate volume
   */
  volume() {
    return 4 * Math.PI * this.boundingSphereRadius / 3;
  }
  /**
   * Create a Trimesh instance, shaped as a torus.
   */
  static createTorus(t = 1, e = 0.5, s = 8, i = 6, n = Math.PI * 2) {
    const o = [], r = [];
    for (let a = 0; a <= s; a++)
      for (let c = 0; c <= i; c++) {
        const l = c / i * n, m = a / s * Math.PI * 2, h = (t + e * Math.cos(m)) * Math.cos(l), u = (t + e * Math.cos(m)) * Math.sin(l), d = e * Math.sin(m);
        o.push(h, u, d);
      }
    for (let a = 1; a <= s; a++)
      for (let c = 1; c <= i; c++) {
        const l = (i + 1) * a + c - 1, m = (i + 1) * (a - 1) + c - 1, h = (i + 1) * (a - 1) + c, u = (i + 1) * a + c;
        r.push(l, m, u), r.push(m, h, u);
      }
    return new ho(o, r);
  }
}
const hd = new x(), to = new Mt(), md = new x(), ud = new x(), ja = new x(), Da = new x(), Wa = new x(), Ya = new x(), $a = new x(), ui = new Mt(), dd = new x(), pd = new mt(), _d = new Mt();
class zr {
  /**
   * All equations to be solved
   */
  equations;
  /**
   * @todo remove useless constructor
   */
  constructor() {
    this.equations = [];
  }
  /**
   * Should be implemented in subclasses!
   * @todo use abstract
   * @return number of iterations performed
   */
  solve(t, e) {
    return (
      // Should return the number of iterations done!
      0
    );
  }
  /**
   * Add an equation
   */
  addEquation(t) {
    t.enabled && !t.bi.isTrigger && !t.bj.isTrigger && this.equations.push(t);
  }
  /**
   * Remove an equation
   */
  removeEquation(t) {
    const e = this.equations, s = e.indexOf(t);
    s !== -1 && e.splice(s, 1);
  }
  /**
   * Add all equations
   */
  removeAllEquations() {
    this.equations.length = 0;
  }
}
class bc extends zr {
  /**
   * The number of solver iterations determines quality of the constraints in the world.
   * The more iterations, the more correct simulation. More iterations need more computations though. If you have a large gravity force in your world, you will need more iterations.
   */
  iterations;
  /**
   * When tolerance is reached, the system is assumed to be converged.
   */
  tolerance;
  /**
   * @todo remove useless constructor
   */
  constructor() {
    super(), this.iterations = 10, this.tolerance = 1e-7;
  }
  /**
   * Solve
   * @return number of iterations performed
   */
  solve(t, e) {
    let s = 0;
    const i = this.iterations, n = this.tolerance * this.tolerance, o = this.equations, r = o.length, a = e.bodies, c = a.length, l = t;
    let m, h, u, d, f, y;
    if (r !== 0)
      for (let b = 0; b !== c; b++)
        a[b].updateSolveMassProperties();
    const v = yd, g = xd, A = fd;
    v.length = r, g.length = r, A.length = r;
    for (let b = 0; b !== r; b++) {
      const B = o[b];
      A[b] = 0, g[b] = B.computeB(l), v[b] = 1 / B.computeC();
    }
    if (r !== 0) {
      for (let w = 0; w !== c; w++) {
        const T = a[w], M = T.vlambda, q = T.wlambda;
        M.set(0, 0, 0), q.set(0, 0, 0);
      }
      for (s = 0; s !== i; s++) {
        d = 0;
        for (let w = 0; w !== r; w++) {
          const T = o[w];
          m = g[w], h = v[w], y = A[w], f = T.computeGWlambda(), u = h * (m - f - T.eps * y), y + u < T.minForce ? u = T.minForce - y : y + u > T.maxForce && (u = T.maxForce - y), A[w] += u, d += u > 0 ? u : -u, T.addToWlambda(u);
        }
        if (d * d < n)
          break;
      }
      for (let w = 0; w !== c; w++) {
        const T = a[w], M = T.velocity, q = T.angularVelocity;
        T.vlambda.vmul(T.linearFactor, T.vlambda), M.vadd(T.vlambda, M), T.wlambda.vmul(T.angularFactor, T.wlambda), q.vadd(T.wlambda, q);
      }
      let b = o.length;
      const B = 1 / l;
      for (; b--; )
        o[b].multiplier = A[b] * B;
    }
    return s;
  }
}
const fd = [], yd = [], xd = [];
class gd extends zr {
  /**
   * The number of solver iterations determines quality of the constraints in the world. The more iterations, the more correct simulation. More iterations need more computations though. If you have a large gravity force in your world, you will need more iterations.
   */
  iterations;
  /**
   * When tolerance is reached, the system is assumed to be converged.
   */
  tolerance;
  /** subsolver */
  subsolver;
  nodes;
  nodePool;
  constructor(t) {
    for (super(), this.iterations = 10, this.tolerance = 1e-7, this.subsolver = t, this.nodes = [], this.nodePool = []; this.nodePool.length < 128; )
      this.nodePool.push(this.createNode());
  }
  /**
   * createNode
   */
  createNode() {
    return { body: null, children: [], eqs: [], visited: !1 };
  }
  /**
   * Solve the subsystems
   * @return number of iterations performed
   */
  solve(t, e) {
    const s = vd, i = this.nodePool, n = e.bodies, o = this.equations, r = o.length, a = n.length, c = this.subsolver;
    for (; i.length < a; )
      i.push(this.createNode());
    s.length = a;
    for (let d = 0; d < a; d++)
      s[d] = i[d];
    for (let d = 0; d !== a; d++) {
      const f = s[d];
      f.body = n[d], f.children.length = 0, f.eqs.length = 0, f.visited = !1;
    }
    for (let d = 0; d !== r; d++) {
      const f = o[d], y = n.indexOf(f.bi), v = n.indexOf(f.bj), g = s[y], A = s[v];
      g.children.push(A), g.eqs.push(f), A.children.push(g), A.eqs.push(f);
    }
    let l, m = 0, h = Ad;
    c.tolerance = this.tolerance, c.iterations = this.iterations;
    const u = bd;
    for (; l = Bc(s); ) {
      h.length = 0, u.bodies.length = 0, wd(l, Sd, u.bodies, h);
      const d = h.length;
      h = h.sort(Cd);
      for (let f = 0; f !== d; f++)
        c.addEquation(h[f]);
      c.solve(t, u), c.removeAllEquations(), m++;
    }
    return m;
  }
}
const vd = [], Ad = [], bd = { bodies: [] }, Bd = G.STATIC;
function Bc(_) {
  const t = _.length;
  for (let e = 0; e !== t; e++) {
    const s = _[e];
    if (!s.visited && !(s.body.type & Bd))
      return s;
  }
  return !1;
}
const eo = [];
function wd(_, t, e, s) {
  for (eo.push(_), _.visited = !0, t(_, e, s); eo.length; ) {
    const i = eo.pop();
    let n;
    for (; n = Bc(i.children); )
      n.visited = !0, t(n, e, s), eo.push(n);
  }
}
function Sd(_, t, e) {
  t.push(_.body);
  const s = _.eqs.length;
  for (let i = 0; i !== s; i++) {
    const n = _.eqs[i];
    e.includes(n) || e.push(n);
  }
}
function Cd(_, t) {
  return t.id - _.id;
}
class wc {
  /**
   * The objects array.
   */
  objects = [];
  /**
   * The type of the objects.
   */
  type = Object;
  /**
   * Release an object after use
   */
  release(...t) {
    const e = t.length;
    for (let s = 0; s !== e; s++)
      this.objects.push(t[s]);
    return this;
  }
  /**
   * Get an object
   */
  get() {
    return this.objects.length === 0 ? this.constructObject() : this.objects.pop();
  }
  /**
   * Construct an object. Should be implemented in each subclass.
   */
  constructObject() {
    throw new Error("constructObject() not implemented in this Pool subclass yet!");
  }
  /**
   * @return Self, for chaining
   */
  resize(t) {
    const e = this.objects;
    for (; e.length > t; )
      e.pop();
    for (; e.length < t; )
      e.push(this.constructObject());
    return this;
  }
}
class Sc extends wc {
  type = x;
  /**
   * Construct a vector
   */
  constructObject() {
    return new x();
  }
}
const vt = {
  sphereSphere: Y.types.SPHERE,
  spherePlane: Y.types.SPHERE | Y.types.PLANE,
  boxBox: Y.types.BOX | Y.types.BOX,
  sphereBox: Y.types.SPHERE | Y.types.BOX,
  planeBox: Y.types.PLANE | Y.types.BOX,
  convexConvex: Y.types.CONVEXPOLYHEDRON,
  sphereConvex: Y.types.SPHERE | Y.types.CONVEXPOLYHEDRON,
  planeConvex: Y.types.PLANE | Y.types.CONVEXPOLYHEDRON,
  boxConvex: Y.types.BOX | Y.types.CONVEXPOLYHEDRON,
  sphereHeightfield: Y.types.SPHERE | Y.types.HEIGHTFIELD,
  boxHeightfield: Y.types.BOX | Y.types.HEIGHTFIELD,
  convexHeightfield: Y.types.CONVEXPOLYHEDRON | Y.types.HEIGHTFIELD,
  sphereParticle: Y.types.PARTICLE | Y.types.SPHERE,
  planeParticle: Y.types.PLANE | Y.types.PARTICLE,
  boxParticle: Y.types.BOX | Y.types.PARTICLE,
  convexParticle: Y.types.PARTICLE | Y.types.CONVEXPOLYHEDRON,
  cylinderCylinder: Y.types.CYLINDER,
  sphereCylinder: Y.types.SPHERE | Y.types.CYLINDER,
  planeCylinder: Y.types.PLANE | Y.types.CYLINDER,
  boxCylinder: Y.types.BOX | Y.types.CYLINDER,
  convexCylinder: Y.types.CONVEXPOLYHEDRON | Y.types.CYLINDER,
  heightfieldCylinder: Y.types.HEIGHTFIELD | Y.types.CYLINDER,
  particleCylinder: Y.types.PARTICLE | Y.types.CYLINDER,
  sphereTrimesh: Y.types.SPHERE | Y.types.TRIMESH,
  planeTrimesh: Y.types.PLANE | Y.types.TRIMESH
};
class Cc {
  /**
   * Internal storage of pooled contact points.
   */
  contactPointPool;
  frictionEquationPool;
  result;
  frictionResult;
  /**
   * Pooled vectors.
   */
  v3pool;
  world;
  currentContactMaterial;
  enableFrictionReduction;
  get [vt.sphereSphere]() {
    return this.sphereSphere;
  }
  get [vt.spherePlane]() {
    return this.spherePlane;
  }
  get [vt.boxBox]() {
    return this.boxBox;
  }
  get [vt.sphereBox]() {
    return this.sphereBox;
  }
  get [vt.planeBox]() {
    return this.planeBox;
  }
  get [vt.convexConvex]() {
    return this.convexConvex;
  }
  get [vt.sphereConvex]() {
    return this.sphereConvex;
  }
  get [vt.planeConvex]() {
    return this.planeConvex;
  }
  get [vt.boxConvex]() {
    return this.boxConvex;
  }
  get [vt.sphereHeightfield]() {
    return this.sphereHeightfield;
  }
  get [vt.boxHeightfield]() {
    return this.boxHeightfield;
  }
  get [vt.convexHeightfield]() {
    return this.convexHeightfield;
  }
  get [vt.sphereParticle]() {
    return this.sphereParticle;
  }
  get [vt.planeParticle]() {
    return this.planeParticle;
  }
  get [vt.boxParticle]() {
    return this.boxParticle;
  }
  get [vt.convexParticle]() {
    return this.convexParticle;
  }
  get [vt.cylinderCylinder]() {
    return this.convexConvex;
  }
  get [vt.sphereCylinder]() {
    return this.sphereConvex;
  }
  get [vt.planeCylinder]() {
    return this.planeConvex;
  }
  get [vt.boxCylinder]() {
    return this.boxConvex;
  }
  get [vt.convexCylinder]() {
    return this.convexConvex;
  }
  get [vt.heightfieldCylinder]() {
    return this.heightfieldCylinder;
  }
  get [vt.particleCylinder]() {
    return this.particleCylinder;
  }
  get [vt.sphereTrimesh]() {
    return this.sphereTrimesh;
  }
  get [vt.planeTrimesh]() {
    return this.planeTrimesh;
  }
  // get [COLLISION_TYPES.convexTrimesh]() {
  //   return this.convexTrimesh
  // }
  constructor(t) {
    this.contactPointPool = [], this.frictionEquationPool = [], this.result = [], this.frictionResult = [], this.v3pool = new Sc(), this.world = t, this.currentContactMaterial = t.defaultContactMaterial, this.enableFrictionReduction = !1;
  }
  /**
   * Make a contact object, by using the internal pool or creating a new one.
   */
  createContactEquation(t, e, s, i, n, o) {
    let r;
    this.contactPointPool.length ? (r = this.contactPointPool.pop(), r.bi = t, r.bj = e) : r = new Di(t, e), r.enabled = t.collisionResponse && e.collisionResponse && s.collisionResponse && i.collisionResponse;
    const a = this.currentContactMaterial;
    r.restitution = a.restitution, r.setSpookParams(a.contactEquationStiffness, a.contactEquationRelaxation, this.world.dt);
    const c = s.material || t.material, l = i.material || e.material;
    return c && l && c.restitution >= 0 && l.restitution >= 0 && (r.restitution = c.restitution * l.restitution), r.si = n || s, r.sj = o || i, r;
  }
  createFrictionEquationsFromContact(t, e) {
    const s = t.bi, i = t.bj, n = t.si, o = t.sj, r = this.world, a = this.currentContactMaterial;
    let c = a.friction;
    const l = n.material || s.material, m = o.material || i.material;
    if (l && m && l.friction >= 0 && m.friction >= 0 && (c = l.friction * m.friction), c > 0) {
      const h = c * (r.frictionGravity || r.gravity).length();
      let u = s.invMass + i.invMass;
      u > 0 && (u = 1 / u);
      const d = this.frictionEquationPool, f = d.length ? d.pop() : new pr(s, i, h * u), y = d.length ? d.pop() : new pr(s, i, h * u);
      return f.bi = y.bi = s, f.bj = y.bj = i, f.minForce = y.minForce = -h * u, f.maxForce = y.maxForce = h * u, f.ri.copy(t.ri), f.rj.copy(t.rj), y.ri.copy(t.ri), y.rj.copy(t.rj), t.ni.tangents(f.t, y.t), f.setSpookParams(a.frictionEquationStiffness, a.frictionEquationRelaxation, r.dt), y.setSpookParams(a.frictionEquationStiffness, a.frictionEquationRelaxation, r.dt), f.enabled = y.enabled = t.enabled, e.push(f, y), !0;
    }
    return !1;
  }
  /**
   * Take the average N latest contact point on the plane.
   */
  createFrictionFromAverage(t) {
    let e = this.result[this.result.length - 1];
    if (!this.createFrictionEquationsFromContact(e, this.frictionResult) || t === 1)
      return;
    const s = this.frictionResult[this.frictionResult.length - 2], i = this.frictionResult[this.frictionResult.length - 1];
    di.setZero(), qi.setZero(), Li.setZero();
    const n = e.bi;
    e.bj;
    for (let r = 0; r !== t; r++)
      e = this.result[this.result.length - 1 - r], e.bi !== n ? (di.vadd(e.ni, di), qi.vadd(e.ri, qi), Li.vadd(e.rj, Li)) : (di.vsub(e.ni, di), qi.vadd(e.rj, qi), Li.vadd(e.ri, Li));
    const o = 1 / t;
    qi.scale(o, s.ri), Li.scale(o, s.rj), i.ri.copy(s.ri), i.rj.copy(s.rj), di.normalize(), di.tangents(s.t, i.t);
  }
  /**
   * Generate all contacts between a list of body pairs
   * @param p1 Array of body indices
   * @param p2 Array of body indices
   * @param result Array to store generated contacts
   * @param oldcontacts Optional. Array of reusable contact objects
   */
  getContacts(t, e, s, i, n, o, r) {
    this.contactPointPool = n, this.frictionEquationPool = r, this.result = i, this.frictionResult = o;
    const a = Id, c = Pd, l = Td, m = Md;
    for (let h = 0, u = t.length; h !== u; h++) {
      const d = t[h], f = e[h];
      let y = null;
      d.material && f.material && (y = s.getContactMaterial(d.material, f.material) || null);
      const v = d.type & G.KINEMATIC && f.type & G.STATIC || d.type & G.STATIC && f.type & G.KINEMATIC || d.type & G.KINEMATIC && f.type & G.KINEMATIC;
      for (let g = 0; g < d.shapes.length; g++) {
        d.quaternion.mult(d.shapeOrientations[g], a), d.quaternion.vmult(d.shapeOffsets[g], l), l.vadd(d.position, l);
        const A = d.shapes[g];
        for (let b = 0; b < f.shapes.length; b++) {
          f.quaternion.mult(f.shapeOrientations[b], c), f.quaternion.vmult(f.shapeOffsets[b], m), m.vadd(f.position, m);
          const B = f.shapes[b];
          if (!(A.collisionFilterMask & B.collisionFilterGroup && B.collisionFilterMask & A.collisionFilterGroup) || l.distanceTo(m) > A.boundingSphereRadius + B.boundingSphereRadius)
            continue;
          let w = null;
          A.material && B.material && (w = s.getContactMaterial(A.material, B.material) || null), this.currentContactMaterial = w || y || s.defaultContactMaterial;
          const T = A.type | B.type, M = this[T];
          if (M) {
            let q = !1;
            A.type < B.type ? q = M.call(this, A, B, l, m, a, c, d, f, A, B, v) : q = M.call(this, B, A, m, l, c, a, f, d, A, B, v), q && v && (s.shapeOverlapKeeper.set(A.id, B.id), s.bodyOverlapKeeper.set(d.id, f.id));
          }
        }
      }
    }
  }
  sphereSphere(t, e, s, i, n, o, r, a, c, l, m) {
    if (m)
      return s.distanceSquared(i) < (t.radius + e.radius) ** 2;
    const h = this.createContactEquation(r, a, t, e, c, l);
    i.vsub(s, h.ni), h.ni.normalize(), h.ri.copy(h.ni), h.rj.copy(h.ni), h.ri.scale(t.radius, h.ri), h.rj.scale(-e.radius, h.rj), h.ri.vadd(s, h.ri), h.ri.vsub(r.position, h.ri), h.rj.vadd(i, h.rj), h.rj.vsub(a.position, h.rj), this.result.push(h), this.createFrictionEquationsFromContact(h, this.frictionResult);
  }
  spherePlane(t, e, s, i, n, o, r, a, c, l, m) {
    const h = this.createContactEquation(r, a, t, e, c, l);
    if (h.ni.set(0, 0, 1), o.vmult(h.ni, h.ni), h.ni.negate(h.ni), h.ni.normalize(), h.ni.scale(t.radius, h.ri), s.vsub(i, so), h.ni.scale(h.ni.dot(so), Ha), so.vsub(Ha, h.rj), -so.dot(h.ni) <= t.radius) {
      if (m)
        return !0;
      const u = h.ri, d = h.rj;
      u.vadd(s, u), u.vsub(r.position, u), d.vadd(i, d), d.vsub(a.position, d), this.result.push(h), this.createFrictionEquationsFromContact(h, this.frictionResult);
    }
  }
  boxBox(t, e, s, i, n, o, r, a, c, l, m) {
    return t.convexPolyhedronRepresentation.material = t.material, e.convexPolyhedronRepresentation.material = e.material, t.convexPolyhedronRepresentation.collisionResponse = t.collisionResponse, e.convexPolyhedronRepresentation.collisionResponse = e.collisionResponse, this.convexConvex(
      t.convexPolyhedronRepresentation,
      e.convexPolyhedronRepresentation,
      s,
      i,
      n,
      o,
      r,
      a,
      t,
      e,
      m
    );
  }
  sphereBox(t, e, s, i, n, o, r, a, c, l, m) {
    const h = this.v3pool, u = sp;
    s.vsub(i, io), e.getSideNormals(u, o);
    const d = t.radius;
    let f = !1;
    const y = np, v = op, g = rp;
    let A = null, b = 0, B = 0, w = 0, T = null;
    for (let z = 0, ct = u.length; z !== ct && f === !1; z++) {
      const X = Qd;
      X.copy(u[z]);
      const H = X.length();
      X.normalize();
      const J = io.dot(X);
      if (J < H + d && J > 0) {
        const lt = tp, $ = ep;
        lt.copy(u[(z + 1) % 3]), $.copy(u[(z + 2) % 3]);
        const Bt = lt.length(), wt = $.length();
        lt.normalize(), $.normalize();
        const ee = io.dot(lt), Pt = io.dot($);
        if (ee < Bt && ee > -Bt && Pt < wt && Pt > -wt) {
          const Lt = Math.abs(J - H - d);
          if ((T === null || Lt < T) && (T = Lt, B = ee, w = Pt, A = H, y.copy(X), v.copy(lt), g.copy($), b++, m))
            return !0;
        }
      }
    }
    if (b) {
      f = !0;
      const z = this.createContactEquation(r, a, t, e, c, l);
      y.scale(-d, z.ri), z.ni.copy(y), z.ni.negate(z.ni), y.scale(A, y), v.scale(B, v), y.vadd(v, y), g.scale(w, g), y.vadd(g, z.rj), z.ri.vadd(s, z.ri), z.ri.vsub(r.position, z.ri), z.rj.vadd(i, z.rj), z.rj.vsub(a.position, z.rj), this.result.push(z), this.createFrictionEquationsFromContact(z, this.frictionResult);
    }
    let M = h.get();
    const q = ip;
    for (let z = 0; z !== 2 && !f; z++)
      for (let ct = 0; ct !== 2 && !f; ct++)
        for (let X = 0; X !== 2 && !f; X++)
          if (M.set(0, 0, 0), z ? M.vadd(u[0], M) : M.vsub(u[0], M), ct ? M.vadd(u[1], M) : M.vsub(u[1], M), X ? M.vadd(u[2], M) : M.vsub(u[2], M), i.vadd(M, q), q.vsub(s, q), q.lengthSquared() < d * d) {
            if (m)
              return !0;
            f = !0;
            const H = this.createContactEquation(r, a, t, e, c, l);
            H.ri.copy(q), H.ri.normalize(), H.ni.copy(H.ri), H.ri.scale(d, H.ri), H.rj.copy(M), H.ri.vadd(s, H.ri), H.ri.vsub(r.position, H.ri), H.rj.vadd(i, H.rj), H.rj.vsub(a.position, H.rj), this.result.push(H), this.createFrictionEquationsFromContact(H, this.frictionResult);
          }
    h.release(M), M = null;
    const F = h.get(), E = h.get(), D = h.get(), V = h.get(), k = h.get(), N = u.length;
    for (let z = 0; z !== N && !f; z++)
      for (let ct = 0; ct !== N && !f; ct++)
        if (z % 3 !== ct % 3) {
          u[ct].cross(u[z], F), F.normalize(), u[z].vadd(u[ct], E), D.copy(s), D.vsub(E, D), D.vsub(i, D);
          const X = D.dot(F);
          F.scale(X, V);
          let H = 0;
          for (; H === z % 3 || H === ct % 3; )
            H++;
          k.copy(s), k.vsub(V, k), k.vsub(E, k), k.vsub(i, k);
          const J = Math.abs(X), lt = k.length();
          if (J < u[H].length() && lt < d) {
            if (m)
              return !0;
            f = !0;
            const $ = this.createContactEquation(r, a, t, e, c, l);
            E.vadd(V, $.rj), $.rj.copy($.rj), k.negate($.ni), $.ni.normalize(), $.ri.copy($.rj), $.ri.vadd(i, $.ri), $.ri.vsub(s, $.ri), $.ri.normalize(), $.ri.scale(d, $.ri), $.ri.vadd(s, $.ri), $.ri.vsub(r.position, $.ri), $.rj.vadd(i, $.rj), $.rj.vsub(a.position, $.rj), this.result.push($), this.createFrictionEquationsFromContact($, this.frictionResult);
          }
        }
    h.release(F, E, D, V, k);
  }
  planeBox(t, e, s, i, n, o, r, a, c, l, m) {
    return e.convexPolyhedronRepresentation.material = e.material, e.convexPolyhedronRepresentation.collisionResponse = e.collisionResponse, e.convexPolyhedronRepresentation.id = e.id, this.planeConvex(t, e.convexPolyhedronRepresentation, s, i, n, o, r, a, t, e, m);
  }
  convexConvex(t, e, s, i, n, o, r, a, c, l, m, h, u) {
    const d = Ap;
    if (!(s.distanceTo(i) > t.boundingSphereRadius + e.boundingSphereRadius) && t.findSeparatingAxis(e, s, n, i, o, d, h, u)) {
      const f = [], y = bp;
      t.clipAgainstHull(s, n, e, i, o, d, -100, 100, f);
      let v = 0;
      for (let g = 0; g !== f.length; g++) {
        if (m)
          return !0;
        const A = this.createContactEquation(r, a, t, e, c, l), b = A.ri, B = A.rj;
        d.negate(A.ni), f[g].normal.negate(y), y.scale(f[g].depth, y), f[g].point.vadd(y, b), B.copy(f[g].point), b.vsub(s, b), B.vsub(i, B), b.vadd(s, b), b.vsub(r.position, b), B.vadd(i, B), B.vsub(a.position, B), this.result.push(A), v++, this.enableFrictionReduction || this.createFrictionEquationsFromContact(A, this.frictionResult);
      }
      this.enableFrictionReduction && v && this.createFrictionFromAverage(v);
    }
  }
  sphereConvex(t, e, s, i, n, o, r, a, c, l, m) {
    const h = this.v3pool;
    s.vsub(i, ap);
    const u = e.faceNormals, d = e.faces, f = e.vertices, y = t.radius;
    let v = !1;
    for (let g = 0; g !== f.length; g++) {
      const A = f[g], b = mp;
      o.vmult(A, b), i.vadd(b, b);
      const B = hp;
      if (b.vsub(s, B), B.lengthSquared() < y * y) {
        if (m)
          return !0;
        v = !0;
        const w = this.createContactEquation(r, a, t, e, c, l);
        w.ri.copy(B), w.ri.normalize(), w.ni.copy(w.ri), w.ri.scale(y, w.ri), b.vsub(i, w.rj), w.ri.vadd(s, w.ri), w.ri.vsub(r.position, w.ri), w.rj.vadd(i, w.rj), w.rj.vsub(a.position, w.rj), this.result.push(w), this.createFrictionEquationsFromContact(w, this.frictionResult);
        return;
      }
    }
    for (let g = 0, A = d.length; g !== A && v === !1; g++) {
      const b = u[g], B = d[g], w = up;
      o.vmult(b, w);
      const T = dp;
      o.vmult(f[B[0]], T), T.vadd(i, T);
      const M = pp;
      w.scale(-y, M), s.vadd(M, M);
      const q = _p;
      M.vsub(T, q);
      const F = q.dot(w), E = fp;
      if (s.vsub(T, E), F < 0 && E.dot(w) > 0) {
        const D = [];
        for (let V = 0, k = B.length; V !== k; V++) {
          const N = h.get();
          o.vmult(f[B[V]], N), i.vadd(N, N), D.push(N);
        }
        if (Jd(D, w, s)) {
          if (m)
            return !0;
          v = !0;
          const V = this.createContactEquation(r, a, t, e, c, l);
          w.scale(-y, V.ri), w.negate(V.ni);
          const k = h.get();
          w.scale(-F, k);
          const N = h.get();
          w.scale(-y, N), s.vsub(i, V.rj), V.rj.vadd(N, V.rj), V.rj.vadd(k, V.rj), V.rj.vadd(i, V.rj), V.rj.vsub(a.position, V.rj), V.ri.vadd(s, V.ri), V.ri.vsub(r.position, V.ri), h.release(k), h.release(N), this.result.push(V), this.createFrictionEquationsFromContact(V, this.frictionResult);
          for (let z = 0, ct = D.length; z !== ct; z++)
            h.release(D[z]);
          return;
        } else
          for (let V = 0; V !== B.length; V++) {
            const k = h.get(), N = h.get();
            o.vmult(f[B[(V + 1) % B.length]], k), o.vmult(f[B[(V + 2) % B.length]], N), i.vadd(k, k), i.vadd(N, N);
            const z = cp;
            N.vsub(k, z);
            const ct = lp;
            z.unit(ct);
            const X = h.get(), H = h.get();
            s.vsub(k, H);
            const J = H.dot(ct);
            ct.scale(J, X), X.vadd(k, X);
            const lt = h.get();
            if (X.vsub(s, lt), J > 0 && J * J < z.lengthSquared() && lt.lengthSquared() < y * y) {
              if (m)
                return !0;
              const $ = this.createContactEquation(r, a, t, e, c, l);
              X.vsub(i, $.rj), X.vsub(s, $.ni), $.ni.normalize(), $.ni.scale(y, $.ri), $.rj.vadd(i, $.rj), $.rj.vsub(a.position, $.rj), $.ri.vadd(s, $.ri), $.ri.vsub(r.position, $.ri), this.result.push($), this.createFrictionEquationsFromContact($, this.frictionResult);
              for (let Bt = 0, wt = D.length; Bt !== wt; Bt++)
                h.release(D[Bt]);
              h.release(k), h.release(N), h.release(X), h.release(lt), h.release(H);
              return;
            }
            h.release(k), h.release(N), h.release(X), h.release(lt), h.release(H);
          }
        for (let V = 0, k = D.length; V !== k; V++)
          h.release(D[V]);
      }
    }
  }
  planeConvex(t, e, s, i, n, o, r, a, c, l, m) {
    const h = yp, u = xp;
    u.set(0, 0, 1), n.vmult(u, u);
    let d = 0;
    const f = gp;
    for (let y = 0; y !== e.vertices.length; y++)
      if (h.copy(e.vertices[y]), o.vmult(h, h), i.vadd(h, h), h.vsub(s, f), u.dot(f) <= 0) {
        if (m)
          return !0;
        const g = this.createContactEquation(r, a, t, e, c, l), A = vp;
        u.scale(u.dot(f), A), h.vsub(A, A), A.vsub(s, g.ri), g.ni.copy(u), h.vsub(i, g.rj), g.ri.vadd(s, g.ri), g.ri.vsub(r.position, g.ri), g.rj.vadd(i, g.rj), g.rj.vsub(a.position, g.rj), this.result.push(g), d++, this.enableFrictionReduction || this.createFrictionEquationsFromContact(g, this.frictionResult);
      }
    this.enableFrictionReduction && d && this.createFrictionFromAverage(d);
  }
  boxConvex(t, e, s, i, n, o, r, a, c, l, m) {
    return t.convexPolyhedronRepresentation.material = t.material, t.convexPolyhedronRepresentation.collisionResponse = t.collisionResponse, this.convexConvex(t.convexPolyhedronRepresentation, e, s, i, n, o, r, a, t, e, m);
  }
  sphereHeightfield(t, e, s, i, n, o, r, a, c, l, m) {
    const h = e.data, u = t.radius, d = e.elementSize, f = Rp, y = Fp;
    mt.pointToLocalFrame(i, o, s, y);
    let v = Math.floor((y.x - u) / d) - 1, g = Math.ceil((y.x + u) / d) + 1, A = Math.floor((y.y - u) / d) - 1, b = Math.ceil((y.y + u) / d) + 1;
    if (g < 0 || b < 0 || v > h.length || A > h[0].length)
      return;
    v < 0 && (v = 0), g < 0 && (g = 0), A < 0 && (A = 0), b < 0 && (b = 0), v >= h.length && (v = h.length - 1), g >= h.length && (g = h.length - 1), b >= h[0].length && (b = h[0].length - 1), A >= h[0].length && (A = h[0].length - 1);
    const B = [];
    e.getRectMinMax(v, A, g, b, B);
    const w = B[0], T = B[1];
    if (y.z - u > T || y.z + u < w)
      return;
    const M = this.result;
    for (let q = v; q < g; q++)
      for (let F = A; F < b; F++) {
        const E = M.length;
        let D = !1;
        if (e.getConvexTrianglePillar(q, F, !1), mt.pointToWorldFrame(i, o, e.pillarOffset, f), s.distanceTo(f) < e.pillarConvex.boundingSphereRadius + t.boundingSphereRadius && (D = this.sphereConvex(
          t,
          e.pillarConvex,
          s,
          f,
          n,
          o,
          r,
          a,
          t,
          e,
          m
        )), m && D || (e.getConvexTrianglePillar(q, F, !0), mt.pointToWorldFrame(i, o, e.pillarOffset, f), s.distanceTo(f) < e.pillarConvex.boundingSphereRadius + t.boundingSphereRadius && (D = this.sphereConvex(
          t,
          e.pillarConvex,
          s,
          f,
          n,
          o,
          r,
          a,
          t,
          e,
          m
        )), m && D))
          return !0;
        if (M.length - E > 2)
          return;
      }
  }
  boxHeightfield(t, e, s, i, n, o, r, a, c, l, m) {
    return t.convexPolyhedronRepresentation.material = t.material, t.convexPolyhedronRepresentation.collisionResponse = t.collisionResponse, this.convexHeightfield(t.convexPolyhedronRepresentation, e, s, i, n, o, r, a, t, e, m);
  }
  convexHeightfield(t, e, s, i, n, o, r, a, c, l, m) {
    const h = e.data, u = e.elementSize, d = t.boundingSphereRadius, f = Vp, y = zp, v = Pp;
    mt.pointToLocalFrame(i, o, s, v);
    let g = Math.floor((v.x - d) / u) - 1, A = Math.ceil((v.x + d) / u) + 1, b = Math.floor((v.y - d) / u) - 1, B = Math.ceil((v.y + d) / u) + 1;
    if (A < 0 || B < 0 || g > h.length || b > h[0].length)
      return;
    g < 0 && (g = 0), A < 0 && (A = 0), b < 0 && (b = 0), B < 0 && (B = 0), g >= h.length && (g = h.length - 1), A >= h.length && (A = h.length - 1), B >= h[0].length && (B = h[0].length - 1), b >= h[0].length && (b = h[0].length - 1);
    const w = [];
    e.getRectMinMax(g, b, A, B, w);
    const T = w[0], M = w[1];
    if (!(v.z - d > M || v.z + d < T))
      for (let q = g; q < A; q++)
        for (let F = b; F < B; F++) {
          let E = !1;
          if (e.getConvexTrianglePillar(q, F, !1), mt.pointToWorldFrame(i, o, e.pillarOffset, f), s.distanceTo(f) < e.pillarConvex.boundingSphereRadius + t.boundingSphereRadius && (E = this.convexConvex(
            t,
            e.pillarConvex,
            s,
            f,
            n,
            o,
            r,
            a,
            null,
            null,
            m,
            y,
            null
          )), m && E || (e.getConvexTrianglePillar(q, F, !0), mt.pointToWorldFrame(i, o, e.pillarOffset, f), s.distanceTo(f) < e.pillarConvex.boundingSphereRadius + t.boundingSphereRadius && (E = this.convexConvex(
            t,
            e.pillarConvex,
            s,
            f,
            n,
            o,
            r,
            a,
            null,
            null,
            m,
            y,
            null
          )), m && E))
            return !0;
        }
  }
  sphereParticle(t, e, s, i, n, o, r, a, c, l, m) {
    const h = Cp;
    if (h.set(0, 0, 1), i.vsub(s, h), h.lengthSquared() <= t.radius * t.radius) {
      if (m)
        return !0;
      const d = this.createContactEquation(a, r, e, t, c, l);
      h.normalize(), d.rj.copy(h), d.rj.scale(t.radius, d.rj), d.ni.copy(h), d.ni.negate(d.ni), d.ri.set(0, 0, 0), this.result.push(d), this.createFrictionEquationsFromContact(d, this.frictionResult);
    }
  }
  planeParticle(t, e, s, i, n, o, r, a, c, l, m) {
    const h = Bp;
    h.set(0, 0, 1), r.quaternion.vmult(h, h);
    const u = wp;
    if (i.vsub(r.position, u), h.dot(u) <= 0) {
      if (m)
        return !0;
      const f = this.createContactEquation(a, r, e, t, c, l);
      f.ni.copy(h), f.ni.negate(f.ni), f.ri.set(0, 0, 0);
      const y = Sp;
      h.scale(h.dot(i), y), i.vsub(y, y), f.rj.copy(y), this.result.push(f), this.createFrictionEquationsFromContact(f, this.frictionResult);
    }
  }
  boxParticle(t, e, s, i, n, o, r, a, c, l, m) {
    return t.convexPolyhedronRepresentation.material = t.material, t.convexPolyhedronRepresentation.collisionResponse = t.collisionResponse, this.convexParticle(t.convexPolyhedronRepresentation, e, s, i, n, o, r, a, t, e, m);
  }
  convexParticle(t, e, s, i, n, o, r, a, c, l, m) {
    let h = -1;
    const u = Mp, d = Ip;
    let f = null;
    const y = Tp;
    if (y.copy(i), y.vsub(s, y), n.conjugate(Ua), Ua.vmult(y, y), t.pointIsInside(y)) {
      t.worldVerticesNeedsUpdate && t.computeWorldVertices(s, n), t.worldFaceNormalsNeedsUpdate && t.computeWorldFaceNormals(n);
      for (let v = 0, g = t.faces.length; v !== g; v++) {
        const A = [t.worldVertices[t.faces[v][0]]], b = t.worldFaceNormals[v];
        i.vsub(A[0], Ga);
        const B = -b.dot(Ga);
        if (f === null || Math.abs(B) < Math.abs(f)) {
          if (m)
            return !0;
          f = B, h = v, u.copy(b);
        }
      }
      if (h !== -1) {
        const v = this.createContactEquation(a, r, e, t, c, l);
        u.scale(f, d), d.vadd(i, d), d.vsub(s, d), v.rj.copy(d), u.negate(v.ni), v.ri.set(0, 0, 0);
        const g = v.ri, A = v.rj;
        g.vadd(i, g), g.vsub(a.position, g), A.vadd(s, A), A.vsub(r.position, A), this.result.push(v), this.createFrictionEquationsFromContact(v, this.frictionResult);
      } else
        console.warn("Point found inside convex, but did not find penetrating face!");
    }
  }
  heightfieldCylinder(t, e, s, i, n, o, r, a, c, l, m) {
    return this.convexHeightfield(
      e,
      t,
      i,
      s,
      o,
      n,
      a,
      r,
      c,
      l,
      m
    );
  }
  particleCylinder(t, e, s, i, n, o, r, a, c, l, m) {
    return this.convexParticle(e, t, i, s, o, n, a, r, c, l, m);
  }
  sphereTrimesh(t, e, s, i, n, o, r, a, c, l, m) {
    const h = Nd, u = kd, d = Od, f = jd, y = Dd, v = Wd, g = Ud, A = Ld, b = Ed, B = Gd;
    mt.pointToLocalFrame(i, o, s, y);
    const w = t.radius;
    g.lowerBound.set(
      y.x - w,
      y.y - w,
      y.z - w
    ), g.upperBound.set(
      y.x + w,
      y.y + w,
      y.z + w
    ), e.getTrianglesInAABB(g, B);
    const T = qd, M = t.radius * t.radius;
    for (let V = 0; V < B.length; V++)
      for (let k = 0; k < 3; k++)
        if (e.getVertex(e.indices[B[V] * 3 + k], T), T.vsub(y, b), b.lengthSquared() <= M) {
          if (A.copy(T), mt.pointToWorldFrame(i, o, A, T), T.vsub(s, b), m)
            return !0;
          let N = this.createContactEquation(r, a, t, e, c, l);
          N.ni.copy(b), N.ni.normalize(), N.ri.copy(N.ni), N.ri.scale(t.radius, N.ri), N.ri.vadd(s, N.ri), N.ri.vsub(r.position, N.ri), N.rj.copy(T), N.rj.vsub(a.position, N.rj), this.result.push(N), this.createFrictionEquationsFromContact(N, this.frictionResult);
        }
    for (let V = 0; V < B.length; V++)
      for (let k = 0; k < 3; k++) {
        e.getVertex(e.indices[B[V] * 3 + k], h), e.getVertex(e.indices[B[V] * 3 + (k + 1) % 3], u), u.vsub(h, d), y.vsub(u, v);
        const N = v.dot(d);
        y.vsub(h, v);
        let z = v.dot(d);
        if (z > 0 && N < 0 && (y.vsub(h, v), f.copy(d), f.normalize(), z = v.dot(f), f.scale(z, v), v.vadd(h, v), v.distanceTo(y) < t.radius)) {
          if (m)
            return !0;
          const X = this.createContactEquation(r, a, t, e, c, l);
          v.vsub(y, X.ni), X.ni.normalize(), X.ni.scale(t.radius, X.ri), X.ri.vadd(s, X.ri), X.ri.vsub(r.position, X.ri), mt.pointToWorldFrame(i, o, v, v), v.vsub(a.position, X.rj), mt.vectorToWorldFrame(o, X.ni, X.ni), mt.vectorToWorldFrame(o, X.ri, X.ri), this.result.push(X), this.createFrictionEquationsFromContact(X, this.frictionResult);
        }
      }
    const q = Yd, F = $d, E = Hd, D = Rd;
    for (let V = 0, k = B.length; V !== k; V++) {
      e.getTriangleVertices(B[V], q, F, E), e.getNormal(B[V], D), y.vsub(q, v);
      let N = v.dot(D);
      if (D.scale(N, v), y.vsub(v, v), N = v.distanceTo(y), Kt.pointInTriangle(v, q, F, E) && N < t.radius) {
        if (m)
          return !0;
        let z = this.createContactEquation(r, a, t, e, c, l);
        v.vsub(y, z.ni), z.ni.normalize(), z.ni.scale(t.radius, z.ri), z.ri.vadd(s, z.ri), z.ri.vsub(r.position, z.ri), mt.pointToWorldFrame(i, o, v, v), v.vsub(a.position, z.rj), mt.vectorToWorldFrame(o, z.ni, z.ni), mt.vectorToWorldFrame(o, z.ri, z.ri), this.result.push(z), this.createFrictionEquationsFromContact(z, this.frictionResult);
      }
    }
    B.length = 0;
  }
  planeTrimesh(t, e, s, i, n, o, r, a, c, l, m) {
    const h = new x(), u = Vd;
    u.set(0, 0, 1), n.vmult(u, u);
    for (let d = 0; d < e.vertices.length / 3; d++) {
      e.getVertex(d, h);
      const f = new x();
      f.copy(h), mt.pointToWorldFrame(i, o, f, h);
      const y = zd;
      if (h.vsub(s, y), u.dot(y) <= 0) {
        if (m)
          return !0;
        const g = this.createContactEquation(r, a, t, e, c, l);
        g.ni.copy(u);
        const A = Fd;
        u.scale(y.dot(u), A), h.vsub(A, A), g.ri.copy(A), g.ri.vsub(r.position, g.ri), g.rj.copy(h), g.rj.vsub(a.position, g.rj), this.result.push(g), this.createFrictionEquationsFromContact(g, this.frictionResult);
      }
    }
  }
  // convexTrimesh(
  //   si: ConvexPolyhedron, sj: Trimesh, xi: Vec3, xj: Vec3, qi: Quaternion, qj: Quaternion,
  //   bi: Body, bj: Body, rsi?: Shape | null, rsj?: Shape | null,
  //   faceListA?: number[] | null, faceListB?: number[] | null,
  // ) {
  //   const sepAxis = convexConvex_sepAxis;
  //   if(xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius){
  //       return;
  //   }
  //   // Construct a temp hull for each triangle
  //   const hullB = new ConvexPolyhedron();
  //   hullB.faces = [[0,1,2]];
  //   const va = new Vec3();
  //   const vb = new Vec3();
  //   const vc = new Vec3();
  //   hullB.vertices = [
  //       va,
  //       vb,
  //       vc
  //   ];
  //   for (let i = 0; i < sj.indices.length / 3; i++) {
  //       const triangleNormal = new Vec3();
  //       sj.getNormal(i, triangleNormal);
  //       hullB.faceNormals = [triangleNormal];
  //       sj.getTriangleVertices(i, va, vb, vc);
  //       let d = si.testSepAxis(triangleNormal, hullB, xi, qi, xj, qj);
  //       if(!d){
  //           triangleNormal.scale(-1, triangleNormal);
  //           d = si.testSepAxis(triangleNormal, hullB, xi, qi, xj, qj);
  //           if(!d){
  //               continue;
  //           }
  //       }
  //       const res: ConvexPolyhedronContactPoint[] = [];
  //       const q = convexConvex_q;
  //       si.clipAgainstHull(xi,qi,hullB,xj,qj,triangleNormal,-100,100,res);
  //       for(let j = 0; j !== res.length; j++){
  //           const r = this.createContactEquation(bi,bj,si,sj,rsi,rsj),
  //               ri = r.ri,
  //               rj = r.rj;
  //           r.ni.copy(triangleNormal);
  //           r.ni.negate(r.ni);
  //           res[j].normal.negate(q);
  //           q.mult(res[j].depth, q);
  //           res[j].point.vadd(q, ri);
  //           rj.copy(res[j].point);
  //           // Contact points are in world coordinates. Transform back to relative
  //           ri.vsub(xi,ri);
  //           rj.vsub(xj,rj);
  //           // Make relative to bodies
  //           ri.vadd(xi, ri);
  //           ri.vsub(bi.position, ri);
  //           rj.vadd(xj, rj);
  //           rj.vsub(bj.position, rj);
  //           result.push(r);
  //       }
  //   }
  // }
}
const di = new x(), qi = new x(), Li = new x(), Td = new x(), Md = new x(), Id = new Rt(), Pd = new Rt(), Vd = new x(), zd = new x(), Fd = new x(), Rd = new x(), Ed = new x(), qd = new x(), Ld = new x(), Nd = new x(), kd = new x(), Od = new x(), jd = new x(), Dd = new x(), Wd = new x(), Yd = new x(), $d = new x(), Hd = new x(), Ud = new Mt(), Gd = [], so = new x(), Ha = new x(), Xd = new x(), Kd = new x(), Zd = new x();
function Jd(_, t, e) {
  let s = null;
  const i = _.length;
  for (let n = 0; n !== i; n++) {
    const o = _[n], r = Xd;
    _[(n + 1) % i].vsub(o, r);
    const a = Kd;
    r.cross(t, a);
    const c = Zd;
    e.vsub(o, c);
    const l = a.dot(c);
    if (s === null || l > 0 && s === !0 || l <= 0 && s === !1) {
      s === null && (s = l > 0);
      continue;
    } else
      return !1;
  }
  return !0;
}
const io = new x(), Qd = new x(), tp = new x(), ep = new x(), sp = [new x(), new x(), new x(), new x(), new x(), new x()], ip = new x(), np = new x(), op = new x(), rp = new x(), ap = new x(), cp = new x(), lp = new x(), hp = new x(), mp = new x(), up = new x(), dp = new x(), pp = new x(), _p = new x(), fp = new x(), yp = new x(), xp = new x(), gp = new x(), vp = new x(), Ap = new x(), bp = new x(), Bp = new x(), wp = new x(), Sp = new x(), Cp = new x(), Ua = new Rt(), Tp = new x(), Mp = new x(), Ga = new x(), Ip = new x(), Pp = new x(), Vp = new x(), zp = [0], Fp = new x(), Rp = new x();
class Xa {
  current;
  previous;
  /**
   * @todo Remove useless constructor
   */
  constructor() {
    this.current = [], this.previous = [];
  }
  /**
   * getKey
   */
  getKey(t, e) {
    if (e < t) {
      const s = e;
      e = t, t = s;
    }
    return t << 16 | e;
  }
  /**
   * set
   */
  set(t, e) {
    const s = this.getKey(t, e), i = this.current;
    let n = 0;
    for (; s > i[n]; )
      n++;
    if (s !== i[n]) {
      for (let o = i.length - 1; o >= n; o--)
        i[o + 1] = i[o];
      i[n] = s;
    }
  }
  /**
   * tick
   */
  tick() {
    const t = this.current;
    this.current = this.previous, this.previous = t, this.current.length = 0;
  }
  /**
   * getDiff
   */
  getDiff(t, e) {
    const s = this.current, i = this.previous, n = s.length, o = i.length;
    let r = 0;
    for (let a = 0; a < n; a++) {
      let c = !1;
      const l = s[a];
      for (; l > i[r]; )
        r++;
      c = l === i[r], c || Ka(t, l);
    }
    r = 0;
    for (let a = 0; a < o; a++) {
      let c = !1;
      const l = i[a];
      for (; l > s[r]; )
        r++;
      c = s[r] === l, c || Ka(e, l);
    }
  }
}
function Ka(_, t) {
  _.push((t & 4294901760) >> 16, t & 65535);
}
const er = (_, t) => _ < t ? `${_}-${t}` : `${t}-${_}`;
class Ep {
  data = { keys: [] };
  /** get */
  get(t, e) {
    const s = er(t, e);
    return this.data[s];
  }
  /** set */
  set(t, e, s) {
    const i = er(t, e);
    this.get(t, e) || this.data.keys.push(i), this.data[i] = s;
  }
  /** delete */
  delete(t, e) {
    const s = er(t, e), i = this.data.keys.indexOf(s);
    i !== -1 && this.data.keys.splice(i, 1), delete this.data[s];
  }
  /** reset */
  reset() {
    const t = this.data, e = t.keys;
    for (; e.length > 0; ) {
      const s = e.pop();
      delete t[s];
    }
  }
}
class qp extends Vr {
  /**
   * Currently / last used timestep. Is set to -1 if not available. This value is updated before each internal step, which means that it is "fresh" inside event callbacks.
   */
  dt;
  /**
   * Makes bodies go to sleep when they've been inactive.
   * @default false
   */
  allowSleep;
  /**
   * All the current contacts (instances of ContactEquation) in the world.
   */
  contacts;
  frictionEquations;
  /**
   * How often to normalize quaternions. Set to 0 for every step, 1 for every second etc.. A larger value increases performance. If bodies tend to explode, set to a smaller value (zero to be sure nothing can go wrong).
   * @default 0
   */
  quatNormalizeSkip;
  /**
   * Set to true to use fast quaternion normalization. It is often enough accurate to use.
   * If bodies tend to explode, set to false.
   * @default false
   */
  quatNormalizeFast;
  /**
   * The wall-clock time since simulation start.
   */
  time;
  /**
   * Number of timesteps taken since start.
   */
  stepnumber;
  /**
   * Default and last timestep sizes.
   */
  default_dt;
  nextId;
  /**
   * The gravity of the world.
   */
  gravity;
  /**
   * Gravity to use when approximating the friction max force (mu \* mass \* gravity).
   * If undefined, global gravity will be used.
   * Use to enable friction in a World with a null gravity vector (no gravity).
   */
  frictionGravity;
  /**
   * The broadphase algorithm to use.
   * @default NaiveBroadphase
   */
  broadphase;
  /**
   * All bodies in this world
   */
  bodies;
  /**
   * True if any bodies are not sleeping, false if every body is sleeping.
   */
  hasActiveBodies;
  /**
   * The solver algorithm to use.
   * @default GSSolver
   */
  solver;
  constraints;
  narrowphase;
  /**
   * collisionMatrix
   */
  collisionMatrix;
  /**
   * CollisionMatrix from the previous step.
   */
  collisionMatrixPrevious;
  bodyOverlapKeeper;
  shapeOverlapKeeper;
  /**
   * All added contactmaterials.
   */
  contactmaterials;
  /**
   * Used to look up a ContactMaterial given two instances of Material.
   */
  contactMaterialTable;
  /**
   * The default material of the bodies.
   */
  defaultMaterial;
  /**
   * This contact material is used if no suitable contactmaterial is found for a contact.
   */
  defaultContactMaterial;
  doProfiling;
  profile;
  /**
   * Time accumulator for interpolation.
   * @see https://gafferongames.com/game-physics/fix-your-timestep/
   */
  accumulator;
  subsystems;
  /**
   * Dispatched after a body has been added to the world.
   */
  addBodyEvent;
  /**
   * Dispatched after a body has been removed from the world.
   */
  removeBodyEvent;
  idToBodyMap;
  lastCallTime;
  constructor(t = {}) {
    super(), this.dt = -1, this.allowSleep = !!t.allowSleep, this.contacts = [], this.frictionEquations = [], this.quatNormalizeSkip = t.quatNormalizeSkip !== void 0 ? t.quatNormalizeSkip : 0, this.quatNormalizeFast = t.quatNormalizeFast !== void 0 ? t.quatNormalizeFast : !1, this.time = 0, this.stepnumber = 0, this.default_dt = 1 / 60, this.nextId = 0, this.gravity = new x(), t.gravity && this.gravity.copy(t.gravity), t.frictionGravity && (this.frictionGravity = new x(), this.frictionGravity.copy(t.frictionGravity)), this.broadphase = t.broadphase !== void 0 ? t.broadphase : new yc(), this.bodies = [], this.hasActiveBodies = !1, this.solver = t.solver !== void 0 ? t.solver : new bc(), this.constraints = [], this.narrowphase = new Cc(this), this.collisionMatrix = new ur(), this.collisionMatrixPrevious = new ur(), this.bodyOverlapKeeper = new Xa(), this.shapeOverlapKeeper = new Xa(), this.contactmaterials = [], this.contactMaterialTable = new Ep(), this.defaultMaterial = new So("default"), this.defaultContactMaterial = new wo(this.defaultMaterial, this.defaultMaterial, {
      friction: 0.3,
      restitution: 0
    }), this.doProfiling = !1, this.profile = {
      solve: 0,
      makeContactConstraints: 0,
      broadphase: 0,
      integrate: 0,
      narrowphase: 0
    }, this.accumulator = 0, this.subsystems = [], this.addBodyEvent = { type: "addBody", body: null }, this.removeBodyEvent = { type: "removeBody", body: null }, this.idToBodyMap = {}, this.broadphase.setWorld(this);
  }
  /**
   * Get the contact material between materials m1 and m2
   * @return The contact material if it was found.
   */
  getContactMaterial(t, e) {
    return this.contactMaterialTable.get(t.id, e.id);
  }
  /**
   * Store old collision state info
   */
  collisionMatrixTick() {
    const t = this.collisionMatrixPrevious;
    this.collisionMatrixPrevious = this.collisionMatrix, this.collisionMatrix = t, this.collisionMatrix.reset(), this.bodyOverlapKeeper.tick(), this.shapeOverlapKeeper.tick();
  }
  /**
   * Add a constraint to the simulation.
   */
  addConstraint(t) {
    this.constraints.push(t);
  }
  /**
   * Removes a constraint
   */
  removeConstraint(t) {
    const e = this.constraints.indexOf(t);
    e !== -1 && this.constraints.splice(e, 1);
  }
  /**
   * Raycast test
   * @deprecated Use .raycastAll, .raycastClosest or .raycastAny instead.
   */
  rayTest(t, e, s) {
    s instanceof _n ? this.raycastClosest(t, e, { skipBackfaces: !0 }, s) : this.raycastAll(t, e, { skipBackfaces: !0 }, s);
  }
  /**
   * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
   * @return True if any body was hit.
   */
  raycastAll(t, e, s = {}, i) {
    return s.mode = Kt.ALL, s.from = t, s.to = e, s.callback = i, sr.intersectWorld(this, s);
  }
  /**
   * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
   * @return True if any body was hit.
   */
  raycastAny(t, e, s = {}, i) {
    return s.mode = Kt.ANY, s.from = t, s.to = e, s.result = i, sr.intersectWorld(this, s);
  }
  /**
   * Ray cast, and return information of the closest hit.
   * @return True if any body was hit.
   */
  raycastClosest(t, e, s = {}, i) {
    return s.mode = Kt.CLOSEST, s.from = t, s.to = e, s.result = i, sr.intersectWorld(this, s);
  }
  /**
   * Add a rigid body to the simulation.
   * @todo If the simulation has not yet started, why recrete and copy arrays for each body? Accumulate in dynamic arrays in this case.
   * @todo Adding an array of bodies should be possible. This would save some loops too
   */
  addBody(t) {
    this.bodies.includes(t) || (t.index = this.bodies.length, this.bodies.push(t), t.world = this, t.initPosition.copy(t.position), t.initVelocity.copy(t.velocity), t.timeLastSleepy = this.time, t instanceof G && (t.initAngularVelocity.copy(t.angularVelocity), t.initQuaternion.copy(t.quaternion)), this.collisionMatrix.setNumObjects(this.bodies.length), this.addBodyEvent.body = t, this.idToBodyMap[t.id] = t, this.dispatchEvent(this.addBodyEvent));
  }
  /**
   * Remove a rigid body from the simulation.
   */
  removeBody(t) {
    t.world = null;
    const e = this.bodies.length - 1, s = this.bodies, i = s.indexOf(t);
    if (i !== -1) {
      s.splice(i, 1);
      for (let n = 0; n !== s.length; n++)
        s[n].index = n;
      this.collisionMatrix.setNumObjects(e), this.removeBodyEvent.body = t, delete this.idToBodyMap[t.id], this.dispatchEvent(this.removeBodyEvent);
    }
  }
  getBodyById(t) {
    return this.idToBodyMap[t];
  }
  /**
   * @todo Make a faster map
   */
  getShapeById(t) {
    const e = this.bodies;
    for (let s = 0; s < e.length; s++) {
      const i = e[s].shapes;
      for (let n = 0; n < i.length; n++) {
        const o = i[n];
        if (o.id === t)
          return o;
      }
    }
    return null;
  }
  /**
   * Adds a contact material to the World
   */
  addContactMaterial(t) {
    this.contactmaterials.push(t), this.contactMaterialTable.set(t.materials[0].id, t.materials[1].id, t);
  }
  /**
   * Removes a contact material from the World.
   */
  removeContactMaterial(t) {
    const e = this.contactmaterials.indexOf(t);
    e !== -1 && (this.contactmaterials.splice(e, 1), this.contactMaterialTable.delete(t.materials[0].id, t.materials[1].id));
  }
  /**
   * Step the simulation forward keeping track of last called time
   * to be able to step the world at a fixed rate, independently of framerate.
   *
   * @param dt The fixed time step size to use (default: 1 / 60).
   * @param maxSubSteps Maximum number of fixed steps to take per function call (default: 10).
   * @see https://gafferongames.com/post/fix_your_timestep/
   * @example
   *     // Run the simulation independently of framerate every 1 / 60 ms
   *     world.fixedStep()
   */
  fixedStep(t = 1 / 60, e = 10) {
    const s = Ut.now() / 1e3;
    if (!this.lastCallTime)
      this.step(t, void 0, e);
    else {
      const i = s - this.lastCallTime;
      this.step(t, i, e);
    }
    this.lastCallTime = s;
  }
  /**
   * Step the physics world forward in time.
   *
   * There are two modes. The simple mode is fixed timestepping without interpolation. In this case you only use the first argument. The second case uses interpolation. In that you also provide the time since the function was last used, as well as the maximum fixed timesteps to take.
   *
   * @param dt The fixed time step size to use.
   * @param timeSinceLastCalled The time elapsed since the function was last called.
   * @param maxSubSteps Maximum number of fixed steps to take per function call (default: 10).
   * @see https://web.archive.org/web/20180426154531/http://bulletphysics.org/mediawiki-1.5.8/index.php/Stepping_The_World#What_do_the_parameters_to_btDynamicsWorld::stepSimulation_mean.3F
   * @example
   *     // fixed timestepping without interpolation
   *     world.step(1 / 60)
   */
  step(t, e, s = 10) {
    if (e === void 0)
      this.internalStep(t), this.time += t;
    else {
      this.accumulator += e;
      const i = Ut.now();
      let n = 0;
      for (; this.accumulator >= t && n < s && (this.internalStep(t), this.accumulator -= t, n++, !(Ut.now() - i > t * 1e3)); )
        ;
      this.accumulator = this.accumulator % t;
      const o = this.accumulator / t;
      for (let r = 0; r !== this.bodies.length; r++) {
        const a = this.bodies[r];
        a.previousPosition.lerp(a.position, o, a.interpolatedPosition), a.previousQuaternion.slerp(a.quaternion, o, a.interpolatedQuaternion), a.previousQuaternion.normalize();
      }
      this.time += e;
    }
  }
  internalStep(t) {
    this.dt = t;
    const e = this.contacts, s = jp, i = Dp, n = this.bodies.length, o = this.bodies, r = this.solver, a = this.gravity, c = this.doProfiling, l = this.profile, m = G.DYNAMIC;
    let h = -1 / 0;
    const u = this.constraints, d = Op;
    a.length();
    const f = a.x, y = a.y, v = a.z;
    let g = 0;
    for (c && (h = Ut.now()), g = 0; g !== n; g++) {
      const V = o[g];
      if (V.type === m) {
        const k = V.force, N = V.mass;
        k.x += N * f, k.y += N * y, k.z += N * v;
      }
    }
    for (let V = 0, k = this.subsystems.length; V !== k; V++)
      this.subsystems[V].update();
    c && (h = Ut.now()), s.length = 0, i.length = 0, this.broadphase.collisionPairs(this, s, i), c && (l.broadphase = Ut.now() - h);
    let A = u.length;
    for (g = 0; g !== A; g++) {
      const V = u[g];
      if (!V.collideConnected)
        for (let k = s.length - 1; k >= 0; k -= 1)
          (V.bodyA === s[k] && V.bodyB === i[k] || V.bodyB === s[k] && V.bodyA === i[k]) && (s.splice(k, 1), i.splice(k, 1));
    }
    this.collisionMatrixTick(), c && (h = Ut.now());
    const b = kp, B = e.length;
    for (g = 0; g !== B; g++)
      b.push(e[g]);
    e.length = 0;
    const w = this.frictionEquations.length;
    for (g = 0; g !== w; g++)
      d.push(this.frictionEquations[g]);
    for (this.frictionEquations.length = 0, this.narrowphase.getContacts(
      s,
      i,
      this,
      e,
      b,
      // To be reused
      this.frictionEquations,
      d
    ), c && (l.narrowphase = Ut.now() - h), c && (h = Ut.now()), g = 0; g < this.frictionEquations.length; g++)
      r.addEquation(this.frictionEquations[g]);
    const T = e.length;
    for (let V = 0; V !== T; V++) {
      const k = e[V], N = k.bi, z = k.bj, ct = k.si, X = k.sj;
      let H;
      if (N.material && z.material ? H = this.getContactMaterial(N.material, z.material) || this.defaultContactMaterial : H = this.defaultContactMaterial, H.friction, N.material && z.material && (N.material.friction >= 0 && z.material.friction >= 0 && N.material.friction * z.material.friction, N.material.restitution >= 0 && z.material.restitution >= 0 && (k.restitution = N.material.restitution * z.material.restitution)), r.addEquation(k), N.allowSleep && N.type === G.DYNAMIC && N.sleepState === G.SLEEPING && z.sleepState === G.AWAKE && z.type !== G.STATIC) {
        const J = z.velocity.lengthSquared() + z.angularVelocity.lengthSquared(), lt = z.sleepSpeedLimit ** 2;
        J >= lt * 2 && (N.wakeUpAfterNarrowphase = !0);
      }
      if (z.allowSleep && z.type === G.DYNAMIC && z.sleepState === G.SLEEPING && N.sleepState === G.AWAKE && N.type !== G.STATIC) {
        const J = N.velocity.lengthSquared() + N.angularVelocity.lengthSquared(), lt = N.sleepSpeedLimit ** 2;
        J >= lt * 2 && (z.wakeUpAfterNarrowphase = !0);
      }
      this.collisionMatrix.set(N, z, !0), this.collisionMatrixPrevious.get(N, z) || (nn.body = z, nn.contact = k, N.dispatchEvent(nn), nn.body = N, z.dispatchEvent(nn)), this.bodyOverlapKeeper.set(N.id, z.id), this.shapeOverlapKeeper.set(ct.id, X.id);
    }
    for (this.emitContactEvents(), c && (l.makeContactConstraints = Ut.now() - h, h = Ut.now()), g = 0; g !== n; g++) {
      const V = o[g];
      V.wakeUpAfterNarrowphase && (V.wakeUp(), V.wakeUpAfterNarrowphase = !1);
    }
    for (A = u.length, g = 0; g !== A; g++) {
      const V = u[g];
      V.update();
      for (let k = 0, N = V.equations.length; k !== N; k++) {
        const z = V.equations[k];
        r.addEquation(z);
      }
    }
    r.solve(t, this), c && (l.solve = Ut.now() - h), r.removeAllEquations();
    const M = Math.pow;
    for (g = 0; g !== n; g++) {
      const V = o[g];
      if (V.type & m) {
        const k = M(1 - V.linearDamping, t), N = V.velocity;
        N.scale(k, N);
        const z = V.angularVelocity;
        if (z) {
          const ct = M(1 - V.angularDamping, t);
          z.scale(ct, z);
        }
      }
    }
    this.dispatchEvent(Np), c && (h = Ut.now());
    const F = this.stepnumber % (this.quatNormalizeSkip + 1) === 0, E = this.quatNormalizeFast;
    for (g = 0; g !== n; g++)
      o[g].integrate(t, F, E);
    this.clearForces(), this.broadphase.dirty = !0, c && (l.integrate = Ut.now() - h), this.stepnumber += 1, this.dispatchEvent(Lp);
    let D = !0;
    if (this.allowSleep)
      for (D = !1, g = 0; g !== n; g++) {
        const V = o[g];
        V.sleepTick(this.time), V.sleepState !== G.SLEEPING && (D = !0);
      }
    this.hasActiveBodies = D;
  }
  emitContactEvents() {
    const t = this.hasAnyEventListener("beginContact"), e = this.hasAnyEventListener("endContact");
    if ((t || e) && this.bodyOverlapKeeper.getDiff(ws, Ss), t) {
      for (let n = 0, o = ws.length; n < o; n += 2)
        on.bodyA = this.getBodyById(ws[n]), on.bodyB = this.getBodyById(ws[n + 1]), this.dispatchEvent(on);
      on.bodyA = on.bodyB = null;
    }
    if (e) {
      for (let n = 0, o = Ss.length; n < o; n += 2)
        rn.bodyA = this.getBodyById(Ss[n]), rn.bodyB = this.getBodyById(Ss[n + 1]), this.dispatchEvent(rn);
      rn.bodyA = rn.bodyB = null;
    }
    ws.length = Ss.length = 0;
    const s = this.hasAnyEventListener("beginShapeContact"), i = this.hasAnyEventListener("endShapeContact");
    if ((s || i) && this.shapeOverlapKeeper.getDiff(ws, Ss), s) {
      for (let n = 0, o = ws.length; n < o; n += 2) {
        const r = this.getShapeById(ws[n]), a = this.getShapeById(ws[n + 1]);
        Cs.shapeA = r, Cs.shapeB = a, r && (Cs.bodyA = r.body), a && (Cs.bodyB = a.body), this.dispatchEvent(Cs);
      }
      Cs.bodyA = Cs.bodyB = Cs.shapeA = Cs.shapeB = null;
    }
    if (i) {
      for (let n = 0, o = Ss.length; n < o; n += 2) {
        const r = this.getShapeById(Ss[n]), a = this.getShapeById(Ss[n + 1]);
        Ts.shapeA = r, Ts.shapeB = a, r && (Ts.bodyA = r.body), a && (Ts.bodyB = a.body), this.dispatchEvent(Ts);
      }
      Ts.bodyA = Ts.bodyB = Ts.shapeA = Ts.shapeB = null;
    }
  }
  /**
   * Sets all body forces in the world to zero.
   */
  clearForces() {
    const t = this.bodies, e = t.length;
    for (let s = 0; s !== e; s++) {
      const i = t[s];
      i.force, i.torque, i.force.set(0, 0, 0), i.torque.set(0, 0, 0);
    }
  }
}
new Mt();
const sr = new Kt(), Ut = globalThis.performance || {};
if (!Ut.now) {
  let _ = Date.now();
  Ut.timing && Ut.timing.navigationStart && (_ = Ut.timing.navigationStart), Ut.now = () => Date.now() - _;
}
const Lp = { type: "postStep" }, Np = { type: "preStep" }, nn = { type: G.COLLIDE_EVENT_NAME, body: null, contact: null }, kp = [], Op = [], jp = [], Dp = [], ws = [], Ss = [], on = {
  type: "beginContact",
  bodyA: null,
  bodyB: null
}, rn = {
  type: "endContact",
  bodyA: null,
  bodyB: null
}, Cs = {
  type: "beginShapeContact",
  bodyA: null,
  bodyB: null,
  shapeA: null,
  shapeB: null
}, Ts = {
  type: "endShapeContact",
  bodyA: null,
  bodyB: null,
  shapeA: null,
  shapeB: null
}, Kp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AABB: Mt,
  ArrayCollisionMatrix: ur,
  BODY_SLEEP_STATES: ro,
  BODY_TYPES: oo,
  Body: G,
  Box: xn,
  Broadphase: Ao,
  COLLISION_TYPES: vt,
  ConeTwistConstraint: Qm,
  Constraint: gn,
  ContactEquation: Di,
  ContactMaterial: wo,
  ConvexPolyhedron: Ps,
  Cylinder: Ku,
  DistanceConstraint: tu,
  Equation: Qs,
  EventTarget: Vr,
  FrictionEquation: pr,
  GSSolver: bc,
  GridBroadphase: Am,
  Heightfield: Qu,
  HingeConstraint: gc,
  JacobianElement: dr,
  LockConstraint: eu,
  Mat3: Qe,
  Material: So,
  NaiveBroadphase: yc,
  Narrowphase: Cc,
  ObjectCollisionMatrix: Kh,
  Particle: Zu,
  Plane: Ju,
  PointToPointConstraint: Bo,
  Pool: wc,
  Quaternion: Rt,
  RAY_MODES: ao,
  Ray: Kt,
  RaycastResult: _n,
  RaycastVehicle: xu,
  RigidVehicle: ju,
  RotationalEquation: vi,
  RotationalMotorEquation: xc,
  SAPBroadphase: Oi,
  SHAPE_TYPES: fc,
  SPHSystem: Du,
  Shape: Y,
  Solver: zr,
  Sphere: Ac,
  SplitSolver: gd,
  Spring: ru,
  Transform: mt,
  Trimesh: ho,
  Vec3: x,
  Vec3Pool: Sc,
  WheelInfo: vc,
  World: qp
}, Symbol.toStringTag, { value: "Module" })), Zp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
export {
  Kp as cannon,
  Xp as matter,
  Up as plank,
  Zp as popmotion
};
