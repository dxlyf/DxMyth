class Bi {
  /**
   * Browser-specific constant to adjust CanvasRenderingContext2D.shadowBlur value,
   * which is unitless and not rendered equally across browsers.
   *
   * Values that work quite well (as of October 2017) are:
   * - Chrome: 1.5
   * - Edge: 1.75
   * - Firefox: 0.9
   * - Safari: 0.95
   *
   * @since 2.0.0
   * @type Number
   * @default 1
   */
  browserShadowBlurConstant = 1;
  /**
   * Pixel per Inch as a default value set to 96. Can be changed for more realistic conversion.
   */
  DPI = 96;
  /**
   * Device Pixel Ratio
   * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
   */
  devicePixelRatio = typeof window < "u" ? window.devicePixelRatio : 1;
  // eslint-disable-line no-restricted-globals
  /**
   * Pixel limit for cache canvases. 1Mpx , 4Mpx should be fine.
   * @since 1.7.14
   * @type Number
   */
  perfLimitSizeTotal = 2097152;
  /**
   * Pixel limit for cache canvases width or height. IE fixes the maximum at 5000
   * @since 1.7.14
   * @type Number
   */
  maxCacheSideLimit = 4096;
  /**
   * Lowest pixel limit for cache canvases, set at 256PX
   * @since 1.7.14
   * @type Number
   */
  minCacheSideLimit = 256;
  /**
   * When 'true', style information is not retained when copy/pasting text, making
   * pasted text use destination style.
   * Defaults to 'false'.
   * @type Boolean
   * @deprecated
   */
  disableStyleCopyPaste = !1;
  /**
   * Enable webgl for filtering picture is available
   * A filtering backend will be initialized, this will both take memory and
   * time since a default 2048x2048 canvas will be created for the gl context
   * @since 2.0.0
   * @type Boolean
   */
  enableGLFiltering = !0;
  /**
   * if webgl is enabled and available, textureSize will determine the size
   * of the canvas backend
   *
   * In order to support old hardware set to `2048` to avoid OOM
   *
   * @since 2.0.0
   * @type Number
   */
  textureSize = 4096;
  /**
   * Skip performance testing of setupGLContext and force the use of putImageData that seems to be the one that works best on
   * Chrome + old hardware. if your users are experiencing empty images after filtering you may try to force this to true
   * this has to be set before instantiating the filtering backend ( before filtering the first image )
   * @type Boolean
   * @default false
   */
  forceGLPutImageData = !1;
  /**
   * If disabled boundsOfCurveCache is not used. For apps that make heavy usage of pencil drawing probably disabling it is better
   * With the standard behaviour of fabric to translate all curves in absolute commands and by not subtracting the starting point from
   * the curve is very hard to hit any cache.
   * Enable only if you know why it could be useful.
   * Candidate for removal/simplification
   * @default false
   */
  cachesBoundsOfCurve = !1;
  /**
   * Map of font files
   * Map<fontFamily, pathToFile> of font files
   */
  fontPaths = {};
  /**
   * Defines the number of fraction digits to use when serializing object values.
   * Used in exporting methods (`toObject`, `toJSON`, `toSVG`)
   * You can use it to increase/decrease precision of such values like left, top, scaleX, scaleY, etc.
   */
  NUM_FRACTION_DIGITS = 4;
}
class fo extends Bi {
  constructor(t) {
    super(), this.configure(t);
  }
  configure(t = {}) {
    Object.assign(this, t);
  }
  /**
   * Map<fontFamily, pathToFile> of font files
   */
  addFonts(t = {}) {
    this.fontPaths = {
      ...this.fontPaths,
      ...t
    };
  }
  removeFonts(t = []) {
    t.forEach((e) => {
      delete this.fontPaths[e];
    });
  }
  clearFonts() {
    this.fontPaths = {};
  }
  restoreDefaults(t) {
    const e = new Bi(), s = t?.reduce((i, r) => (i[r] = e[r], i), {}) || e;
    this.configure(s);
  }
}
const M = new fo(), Mt = (n, ...t) => (
  // eslint-disable-next-line no-restricted-syntax
  console[n]("fabric", ...t)
);
class pt extends Error {
  constructor(t, e) {
    super(`fabric: ${t}`, e);
  }
}
class pr extends pt {
  constructor(t) {
    super(`${t} 'options.signal' is in 'aborted' state`);
  }
}
class go {
}
class po extends go {
  /**
   * Tests if webgl supports certain precision
   * @param {WebGL} Canvas WebGL context to test on
   * @param {GLPrecision} Precision to test can be any of following
   * @returns {Boolean} Whether the user's browser WebGL supports given precision.
   */
  testPrecision(t, e) {
    const s = `precision ${e} float;
void main(){}`, i = t.createShader(t.FRAGMENT_SHADER);
    return i ? (t.shaderSource(i, s), t.compileShader(i), !!t.getShaderParameter(i, t.COMPILE_STATUS)) : !1;
  }
  /**
   * query browser for WebGL
   */
  queryWebGL(t) {
    const e = t.getContext("webgl");
    e && (this.maxTextureSize = e.getParameter(e.MAX_TEXTURE_SIZE), this.GLPrecision = ["highp", "mediump", "lowp"].find(
      (s) => this.testPrecision(e, s)
    ), e.getExtension("WEBGL_lose_context").loseContext(), Mt("log", `WebGL: max texture size ${this.maxTextureSize}`));
  }
  isSupported(t) {
    return !!this.maxTextureSize && this.maxTextureSize >= t;
  }
}
const mo = {}, _o = () => ({
  document,
  window,
  isTouchSupported: "ontouchstart" in window || "ontouchstart" in document || window && window.navigator && window.navigator.maxTouchPoints > 0,
  WebGLProbe: new po(),
  dispose() {
  },
  copyPasteData: mo
});
let Is;
const zc = (n) => {
  Is = n;
}, bt = () => Is || (Is = _o()), fe = () => bt().document, Ot = () => bt().window, mr = () => Math.max(M.devicePixelRatio ?? Ot().devicePixelRatio, 1);
class yo {
  constructor() {
    this.charWidthsCache = /* @__PURE__ */ new Map();
  }
  /**
   * @return {Object} reference to cache
   */
  getFontCache({
    fontFamily: t,
    fontStyle: e,
    fontWeight: s
  }) {
    t = t.toLowerCase();
    const i = this.charWidthsCache;
    i.has(t) || i.set(t, /* @__PURE__ */ new Map());
    const r = i.get(t), o = `${e.toLowerCase()}_${(s + "").toLowerCase()}`;
    return r.has(o) || r.set(o, /* @__PURE__ */ new Map()), r.get(o);
  }
  /**
   * Clear char widths cache for the given font family or all the cache if no
   * fontFamily is specified.
   * Use it if you know you are loading fonts in a lazy way and you are not waiting
   * for custom fonts to load properly when adding text objects to the canvas.
   * If a text object is added when its own font is not loaded yet, you will get wrong
   * measurement and so wrong bounding boxes.
   * After the font cache is cleared, either change the textObject text content or call
   * initDimensions() to trigger a recalculation
   * @param {String} [fontFamily] font family to clear
   */
  clearFontCache(t) {
    t ? this.charWidthsCache.delete((t || "").toLowerCase()) : this.charWidthsCache = /* @__PURE__ */ new Map();
  }
  /**
   * Given current aspect ratio, determines the max width and height that can
   * respect the total allowed area for the cache.
   * @param {number} ar aspect ratio
   * @return {number[]} Limited dimensions X and Y
   */
  limitDimsByArea(t) {
    const { perfLimitSizeTotal: e } = M, s = Math.sqrt(e * t);
    return [
      Math.floor(s),
      Math.floor(e / s)
    ];
  }
  /**
   * This object keeps the results of the boundsOfCurve calculation mapped by the joined arguments necessary to calculate it.
   * It does speed up calculation, if you parse and add always the same paths, but in case of heavy usage of freedrawing
   * you do not get any speed benefit and you get a big object in memory.
   * The object was a private variable before, while now is appended to the lib so that you have access to it and you
   * can eventually clear it.
   * It was an internal variable, is accessible since version 2.3.4
   */
  boundsOfCurveCache = {};
}
const ve = new yo(), vo = "7.0.0-beta1", Ys = vo;
function Be() {
}
const Bt = Math.PI / 2, Co = Math.PI / 4, yt = Math.PI * 2, ei = Math.PI / 180, J = Object.freeze([1, 0, 0, 1, 0, 0]), si = 16, Ii = 2, Lt = 1 - 0.5522847498, T = "center", P = "left", it = "top", Vs = "bottom", Y = "right", K = "none", ii = /\r?\n/, _r = "moving", cs = "scaling", yr = "rotating", ri = "rotate", vr = "skewing", be = "resizing", Cr = "modifyPoly", So = "modifyPath", $e = "changed", us = "scale", Q = "scaleX", at = "scaleY", de = "skewX", ge = "skewY", X = "fill", H = "stroke", We = "modified", te = "json", Ds = "svg";
class wo {
  constructor() {
    this[te] = /* @__PURE__ */ new Map(), this[Ds] = /* @__PURE__ */ new Map();
  }
  has(t) {
    return this[te].has(t);
  }
  getClass(t) {
    const e = this[te].get(t);
    if (!e)
      throw new pt(`No class registered for ${t}`);
    return e;
  }
  setClass(t, e) {
    e ? this[te].set(e, t) : (this[te].set(t.type, t), this[te].set(t.type.toLowerCase(), t));
  }
  getSVGClass(t) {
    return this[Ds].get(t);
  }
  setSVGClass(t, e) {
    this[Ds].set(
      e ?? t.type.toLowerCase(),
      t
    );
  }
}
const x = new wo();
class xo extends Array {
  /**
   * Remove a single animation using an animation context
   * @param {AnimationBase} context
   */
  remove(t) {
    const e = this.indexOf(t);
    e > -1 && this.splice(e, 1);
  }
  /**
   * Cancel all running animations on the next frame
   */
  cancelAll() {
    const t = this.splice(0);
    return t.forEach((e) => e.abort()), t;
  }
  /**
   * Cancel all running animations attached to a canvas on the next frame
   * @param {StaticCanvas} canvas
   */
  cancelByCanvas(t) {
    if (!t)
      return [];
    const e = this.filter(
      (s) => s.target === t || typeof s.target == "object" && s.target?.canvas === t
    );
    return e.forEach((s) => s.abort()), e;
  }
  /**
   * Cancel all running animations for target on the next frame
   * @param target
   */
  cancelByTarget(t) {
    if (!t)
      return [];
    const e = this.filter((s) => s.target === t);
    return e.forEach((s) => s.abort()), e;
  }
}
const Ge = new xo();
class bo {
  __eventListeners = {};
  on(t, e) {
    if (this.__eventListeners || (this.__eventListeners = {}), typeof t == "object")
      return Object.entries(t).forEach(([s, i]) => {
        this.on(s, i);
      }), () => this.off(t);
    if (e) {
      const s = t;
      return this.__eventListeners[s] || (this.__eventListeners[s] = []), this.__eventListeners[s].push(e), () => this.off(s, e);
    } else
      return () => !1;
  }
  once(t, e) {
    if (typeof t == "object") {
      const s = [];
      return Object.entries(t).forEach(([i, r]) => {
        s.push(this.once(i, r));
      }), () => s.forEach((i) => i());
    } else if (e) {
      const s = this.on(
        t,
        function(...r) {
          e.call(this, ...r), s();
        }
      );
      return s;
    } else
      return () => !1;
  }
  /**
   * @private
   * @param {string} eventName
   * @param {Function} [handler]
   */
  _removeEventListener(t, e) {
    if (this.__eventListeners[t])
      if (e) {
        const s = this.__eventListeners[t], i = s.indexOf(e);
        i > -1 && s.splice(i, 1);
      } else
        this.__eventListeners[t] = [];
  }
  off(t, e) {
    if (this.__eventListeners)
      if (typeof t > "u")
        for (const s in this.__eventListeners)
          this._removeEventListener(s);
      else typeof t == "object" ? Object.entries(t).forEach(([s, i]) => {
        this._removeEventListener(s, i);
      }) : this._removeEventListener(t, e);
  }
  /**
   * Fires event with an optional options object
   * @param {String} eventName Event name to fire
   * @param {Object} [options] Options object
   */
  fire(t, e) {
    if (!this.__eventListeners)
      return;
    const s = this.__eventListeners[t]?.concat();
    if (s)
      for (let i = 0; i < s.length; i++)
        s[i].call(this, e || {});
  }
}
const Vt = (n, t) => {
  const e = n.indexOf(t);
  return e !== -1 && n.splice(e, 1), n;
}, vt = (n) => {
  if (n === 0)
    return 1;
  switch (Math.abs(n) / Bt) {
    case 1:
    case 3:
      return 0;
    case 2:
      return -1;
  }
  return Math.cos(n);
}, Ct = (n) => {
  if (n === 0)
    return 0;
  const t = n / Bt, e = Math.sign(n);
  switch (t) {
    case 1:
      return e;
    case 2:
      return 0;
    case 3:
      return -e;
  }
  return Math.sin(n);
};
class m {
  constructor(t = 0, e = 0) {
    typeof t == "object" ? (this.x = t.x, this.y = t.y) : (this.x = t, this.y = e);
  }
  /**
   * Adds another point to this one and returns a new one with the sum
   * @param {XY} that
   * @return {Point} new Point instance with added values
   */
  add(t) {
    return new m(this.x + t.x, this.y + t.y);
  }
  /**
   * Adds another point to this one
   * @param {XY} that
   * @return {Point} thisArg
   * @deprecated
   */
  addEquals(t) {
    return this.x += t.x, this.y += t.y, this;
  }
  /**
   * Adds value to this point and returns a new one
   * @param {Number} scalar
   * @return {Point} new Point with added value
   */
  scalarAdd(t) {
    return new m(this.x + t, this.y + t);
  }
  /**
   * Adds value to this point
   * @param {Number} scalar
   * @return {Point} thisArg
   * @deprecated
   */
  scalarAddEquals(t) {
    return this.x += t, this.y += t, this;
  }
  /**
   * Subtracts another point from this point and returns a new one
   * @param {XY} that
   * @return {Point} new Point object with subtracted values
   */
  subtract(t) {
    return new m(this.x - t.x, this.y - t.y);
  }
  /**
   * Subtracts another point from this point
   * @param {XY} that
   * @return {Point} thisArg
   * @deprecated
   */
  subtractEquals(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }
  /**
   * Subtracts value from this point and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarSubtract(t) {
    return new m(this.x - t, this.y - t);
  }
  /**
   * Subtracts value from this point
   * @param {Number} scalar
   * @return {Point} thisArg
   * @deprecated
   */
  scalarSubtractEquals(t) {
    return this.x -= t, this.y -= t, this;
  }
  /**
   * Multiplies this point by another value and returns a new one
   * @param {XY} that
   * @return {Point}
   */
  multiply(t) {
    return new m(this.x * t.x, this.y * t.y);
  }
  /**
   * Multiplies this point by a value and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarMultiply(t) {
    return new m(this.x * t, this.y * t);
  }
  /**
   * Multiplies this point by a value
   * @param {Number} scalar
   * @return {Point} thisArg
   * @deprecated
   */
  scalarMultiplyEquals(t) {
    return this.x *= t, this.y *= t, this;
  }
  /**
   * Divides this point by another and returns a new one
   * @param {XY} that
   * @return {Point}
   */
  divide(t) {
    return new m(this.x / t.x, this.y / t.y);
  }
  /**
   * Divides this point by a value and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarDivide(t) {
    return new m(this.x / t, this.y / t);
  }
  /**
   * Divides this point by a value
   * @param {Number} scalar
   * @return {Point} thisArg
   * @deprecated
   */
  scalarDivideEquals(t) {
    return this.x /= t, this.y /= t, this;
  }
  /**
   * Returns true if this point is equal to another one
   * @param {XY} that
   * @return {Boolean}
   */
  eq(t) {
    return this.x === t.x && this.y === t.y;
  }
  /**
   * Returns true if this point is less than another one
   * @param {XY} that
   * @return {Boolean}
   */
  lt(t) {
    return this.x < t.x && this.y < t.y;
  }
  /**
   * Returns true if this point is less than or equal to another one
   * @param {XY} that
   * @return {Boolean}
   */
  lte(t) {
    return this.x <= t.x && this.y <= t.y;
  }
  /**
  
     * Returns true if this point is greater another one
     * @param {XY} that
     * @return {Boolean}
     */
  gt(t) {
    return this.x > t.x && this.y > t.y;
  }
  /**
   * Returns true if this point is greater than or equal to another one
   * @param {XY} that
   * @return {Boolean}
   */
  gte(t) {
    return this.x >= t.x && this.y >= t.y;
  }
  /**
   * Returns new point which is the result of linear interpolation with this one and another one
   * @param {XY} that
   * @param {Number} t , position of interpolation, between 0 and 1 default 0.5
   * @return {Point}
   */
  lerp(t, e = 0.5) {
    return e = Math.max(Math.min(1, e), 0), new m(
      this.x + (t.x - this.x) * e,
      this.y + (t.y - this.y) * e
    );
  }
  /**
   * Returns distance from this point and another one
   * @param {XY} that
   * @return {Number}
   */
  distanceFrom(t) {
    const e = this.x - t.x, s = this.y - t.y;
    return Math.sqrt(e * e + s * s);
  }
  /**
   * Returns the point between this point and another one
   * @param {XY} that
   * @return {Point}
   */
  midPointFrom(t) {
    return this.lerp(t);
  }
  /**
   * Returns a new point which is the min of this and another one
   * @param {XY} that
   * @return {Point}
   */
  min(t) {
    return new m(Math.min(this.x, t.x), Math.min(this.y, t.y));
  }
  /**
   * Returns a new point which is the max of this and another one
   * @param {XY} that
   * @return {Point}
   */
  max(t) {
    return new m(Math.max(this.x, t.x), Math.max(this.y, t.y));
  }
  /**
   * Returns string representation of this point
   * @return {String}
   */
  toString() {
    return `${this.x},${this.y}`;
  }
  /**
   * Sets x/y of this point
   * @param {Number} x
   * @param {Number} y
   */
  setXY(t, e) {
    return this.x = t, this.y = e, this;
  }
  /**
   * Sets x of this point
   * @param {Number} x
   */
  setX(t) {
    return this.x = t, this;
  }
  /**
   * Sets y of this point
   * @param {Number} y
   */
  setY(t) {
    return this.y = t, this;
  }
  /**
   * Sets x/y of this point from another point
   * @param {XY} that
   */
  setFromPoint(t) {
    return this.x = t.x, this.y = t.y, this;
  }
  /**
   * Swaps x/y of this point and another point
   * @param {XY} that
   */
  swap(t) {
    const e = this.x, s = this.y;
    this.x = t.x, this.y = t.y, t.x = e, t.y = s;
  }
  /**
   * return a cloned instance of the point
   * @return {Point}
   */
  clone() {
    return new m(this.x, this.y);
  }
  /**
   * Rotates `point` around `origin` with `radians`
   * @param {XY} origin The origin of the rotation
   * @param {TRadian} radians The radians of the angle for the rotation
   * @return {Point} The new rotated point
   */
  rotate(t, e = ni) {
    const s = Ct(t), i = vt(t), r = this.subtract(e);
    return new m(
      r.x * i - r.y * s,
      r.x * s + r.y * i
    ).add(e);
  }
  /**
   * Apply transform t to point p
   * @param  {TMat2D} t The transform
   * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
   * @return {Point} The transformed point
   */
  transform(t, e = !1) {
    return new m(
      t[0] * this.x + t[2] * this.y + (e ? 0 : t[4]),
      t[1] * this.x + t[3] * this.y + (e ? 0 : t[5])
    );
  }
}
const ni = new m(0, 0), Ie = (n) => !!n && Array.isArray(n._objects);
function Sr(n) {
  class t extends n {
    /**
     * @type {FabricObject[]}
     * @TODO needs to end up in the constructor too
     */
    _objects = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onObjectAdded(s) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onObjectRemoved(s) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onStackOrderChanged(s) {
    }
    /**
     * Adds objects to collection
     * Objects should be instances of (or inherit from) FabricObject
     * @param {...FabricObject[]} objects to add
     * @returns {number} new array length
     */
    add(...s) {
      const i = this._objects.push(...s);
      return s.forEach((r) => this._onObjectAdded(r)), i;
    }
    /**
     * Inserts an object into collection at specified index
     * @param {number} index Index to insert object at
     * @param {...FabricObject[]} objects Object(s) to insert
     * @returns {number} new array length
     */
    insertAt(s, ...i) {
      return this._objects.splice(s, 0, ...i), i.forEach((r) => this._onObjectAdded(r)), this._objects.length;
    }
    /**
     * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
     * @private
     * @param {...FabricObject[]} objects objects to remove
     * @returns {FabricObject[]} removed objects
     */
    remove(...s) {
      const i = this._objects, r = [];
      return s.forEach((o) => {
        const a = i.indexOf(o);
        a !== -1 && (i.splice(a, 1), r.push(o), this._onObjectRemoved(o));
      }), r;
    }
    /**
     * Executes given function for each object in this group
     * A simple shortcut for getObjects().forEach, before es6 was more complicated,
     * now is just a shortcut.
     * @param {Function} callback
     *                   Callback invoked with current object as first argument,
     *                   index - as second and an array of all objects - as third.
     */
    forEachObject(s) {
      this.getObjects().forEach(
        (i, r, o) => s(i, r, o)
      );
    }
    /**
     * Returns an array of children objects of this instance
     * @param {...String} [types] When specified, only objects of these types are returned
     * @return {Array}
     */
    getObjects(...s) {
      return s.length === 0 ? [...this._objects] : this._objects.filter((i) => i.isType(...s));
    }
    /**
     * Returns object at specified index
     * @param {Number} index
     * @return {Object} object at index
     */
    item(s) {
      return this._objects[s];
    }
    /**
     * Returns true if collection contains no objects
     * @return {Boolean} true if collection is empty
     */
    isEmpty() {
      return this._objects.length === 0;
    }
    /**
     * Returns a size of a collection (i.e: length of an array containing its objects)
     * @return {Number} Collection size
     */
    size() {
      return this._objects.length;
    }
    /**
     * Returns true if collection contains an object.\
     * **Prefer using {@link FabricObject#isDescendantOf} for performance reasons**
     * instead of `a.contains(b)` use `b.isDescendantOf(a)`
     * @param {Object} object Object to check against
     * @param {Boolean} [deep=false] `true` to check all descendants, `false` to check only `_objects`
     * @return {Boolean} `true` if collection contains an object
     */
    contains(s, i) {
      return this._objects.includes(s) ? !0 : i ? this._objects.some(
        (r) => r instanceof t && r.contains(s, !0)
      ) : !1;
    }
    /**
     * Returns number representation of a collection complexity
     * @return {Number} complexity
     */
    complexity() {
      return this._objects.reduce((s, i) => (s += i.complexity ? i.complexity() : 0, s), 0);
    }
    /**
     * Moves an object or the objects of a multiple selection
     * to the bottom of the stack of drawn objects
     * @param {fabric.Object} object Object to send to back
     * @returns {boolean} true if change occurred
     */
    sendObjectToBack(s) {
      return !s || s === this._objects[0] ? !1 : (Vt(this._objects, s), this._objects.unshift(s), this._onStackOrderChanged(s), !0);
    }
    /**
     * Moves an object or the objects of a multiple selection
     * to the top of the stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @returns {boolean} true if change occurred
     */
    bringObjectToFront(s) {
      return !s || s === this._objects[this._objects.length - 1] ? !1 : (Vt(this._objects, s), this._objects.push(s), this._onStackOrderChanged(s), !0);
    }
    /**
     * Moves an object or a selection down in stack of drawn objects
     * An optional parameter, `intersecting` allows to move the object in behind
     * the first intersecting object. Where intersection is calculated with
     * bounding box. If no intersection is found, there will not be change in the
     * stack.
     * @param {fabric.Object} object Object to send
     * @param {boolean} [intersecting] If `true`, send object behind next lower intersecting object
     * @returns {boolean} true if change occurred
     */
    sendObjectBackwards(s, i) {
      if (!s)
        return !1;
      const r = this._objects.indexOf(s);
      if (r !== 0) {
        const o = this.findNewLowerIndex(s, r, i);
        return Vt(this._objects, s), this._objects.splice(o, 0, s), this._onStackOrderChanged(s), !0;
      }
      return !1;
    }
    /**
     * Moves an object or a selection up in stack of drawn objects
     * An optional parameter, intersecting allows to move the object in front
     * of the first intersecting object. Where intersection is calculated with
     * bounding box. If no intersection is found, there will not be change in the
     * stack.
     * @param {fabric.Object} object Object to send
     * @param {boolean} [intersecting] If `true`, send object in front of next upper intersecting object
     * @returns {boolean} true if change occurred
     */
    bringObjectForward(s, i) {
      if (!s)
        return !1;
      const r = this._objects.indexOf(s);
      if (r !== this._objects.length - 1) {
        const o = this.findNewUpperIndex(s, r, i);
        return Vt(this._objects, s), this._objects.splice(o, 0, s), this._onStackOrderChanged(s), !0;
      }
      return !1;
    }
    /**
     * Moves an object to specified level in stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @param {number} index Position to move to
     * @returns {boolean} true if change occurred
     */
    moveObjectTo(s, i) {
      return s === this._objects[i] ? !1 : (Vt(this._objects, s), this._objects.splice(i, 0, s), this._onStackOrderChanged(s), !0);
    }
    findNewLowerIndex(s, i, r) {
      let o;
      if (r) {
        o = i;
        for (let a = i - 1; a >= 0; --a)
          if (s.isOverlapping(this._objects[a])) {
            o = a;
            break;
          }
      } else
        o = i - 1;
      return o;
    }
    findNewUpperIndex(s, i, r) {
      let o;
      if (r) {
        o = i;
        for (let a = i + 1; a < this._objects.length; ++a)
          if (s.isOverlapping(this._objects[a])) {
            o = a;
            break;
          }
      } else
        o = i + 1;
      return o;
    }
    /**
     * Given a bounding box, return all the objects of the collection that are contained in the bounding box.
     * If `includeIntersecting` is true, return also the objects that intersect the bounding box as well.
     * This is meant to work with selection. Is not a generic method.
     * @param {TBBox} bbox a bounding box in scene coordinates
     * @param {{ includeIntersecting?: boolean }} options an object with includeIntersecting
     * @returns array of objects contained in the bounding box, ordered from top to bottom stacking wise
     */
    collectObjects({ left: s, top: i, width: r, height: o }, { includeIntersecting: a = !0 } = {}) {
      const h = [], l = new m(s, i), c = l.add(new m(r, o));
      for (let u = this._objects.length - 1; u >= 0; u--) {
        const f = this._objects[u];
        f.selectable && f.visible && (a && f.intersectsWithRect(l, c) || f.isContainedWithinRect(l, c) || a && f.containsPoint(l) || a && f.containsPoint(c)) && h.push(f);
      }
      return h;
    }
  }
  return t;
}
class wr extends bo {
  /**
   * Sets object's properties from options, for initialization only
   * @protected
   * @param {Object} [options] Options object
   */
  _setOptions(t = {}) {
    for (const e in t)
      this.set(e, t[e]);
  }
  /**
   * @private
   */
  _setObject(t) {
    for (const e in t)
      this._set(e, t[e]);
  }
  /**
   * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
   * @param {String|Object} key Property name or object (if object, iterate over the object properties)
   * @param {Object|Function} value Property value (if function, the value is passed into it and its return value is used as a new one)
   */
  set(t, e) {
    return typeof t == "object" ? this._setObject(t) : this._set(t, e), this;
  }
  _set(t, e) {
    this[t] = e;
  }
  /**
   * Toggles specified property from `true` to `false` or from `false` to `true`
   * @param {String} property Property to toggle
   */
  toggle(t) {
    const e = this.get(t);
    return typeof e == "boolean" && this.set(t, !e), this;
  }
  /**
   * Basic getter
   * @param {String} property Property name
   * @return {*} value of a property
   */
  get(t) {
    return this[t];
  }
}
function Ce(n) {
  return Ot().requestAnimationFrame(n);
}
function xr(n) {
  return Ot().cancelAnimationFrame(n);
}
let To = 0;
const jt = () => To++, ut = () => {
  const n = fe().createElement("canvas");
  if (!n || typeof n.getContext > "u")
    throw new pt("Failed to create `canvas` element");
  return n;
}, br = () => fe().createElement("img"), Oo = (n) => {
  const t = rt(n);
  return t.getContext("2d")?.drawImage(n, 0, 0), t;
}, rt = (n) => {
  const t = ut();
  return t.width = n.width, t.height = n.height, t;
}, oi = (n, t, e) => n.toDataURL(`image/${t}`, e), Do = (n) => !!n && n.getContext !== void 0, ai = (n, t, e) => new Promise((s, i) => {
  n.toBlob(s, `image/${t}`, e);
}), I = (n) => n * ei, Pt = (n) => n / ei, Tr = (n) => n.every((t, e) => t === J[e]), G = (n, t, e) => new m(n).transform(t, e), st = (n) => {
  const t = 1 / (n[0] * n[3] - n[1] * n[2]), e = [t * n[3], -t * n[1], -t * n[2], t * n[0], 0, 0], { x: s, y: i } = new m(n[4], n[5]).transform(e, !0);
  return e[4] = -s, e[5] = -i, e;
}, B = (n, t, e) => [
  n[0] * t[0] + n[2] * t[1],
  n[1] * t[0] + n[3] * t[1],
  n[0] * t[2] + n[2] * t[3],
  n[1] * t[2] + n[3] * t[3],
  e ? 0 : n[0] * t[4] + n[2] * t[5] + n[4],
  e ? 0 : n[1] * t[4] + n[3] * t[5] + n[5]
], fs = (n, t) => n.reduceRight(
  (e, s) => s && e ? B(s, e, t) : s || e,
  void 0
) || J.concat(), Or = ([n, t]) => Math.atan2(t, n), Gt = (n) => {
  const t = Or(n), e = Math.pow(n[0], 2) + Math.pow(n[1], 2), s = Math.sqrt(e), i = (n[0] * n[3] - n[2] * n[1]) / s, r = Math.atan2(n[0] * n[2] + n[1] * n[3], e);
  return {
    angle: Pt(t),
    scaleX: s,
    scaleY: i,
    skewX: Pt(r),
    skewY: 0,
    translateX: n[4] || 0,
    translateY: n[5] || 0
  };
}, pe = (n, t = 0) => [
  1,
  0,
  0,
  1,
  n,
  t
];
function Kt({ angle: n = 0 } = {}, { x: t = 0, y: e = 0 } = {}) {
  const s = I(n), i = vt(s), r = Ct(s);
  return [
    i,
    r,
    -r,
    i,
    t ? t - (i * t - r * e) : 0,
    e ? e - (r * t + i * e) : 0
  ];
}
const ds = (n, t = n) => [
  n,
  0,
  0,
  t,
  0,
  0
], Dr = (n) => Math.tan(I(n)), hi = (n) => [
  1,
  0,
  Dr(n),
  1,
  0,
  0
], li = (n) => [
  1,
  Dr(n),
  0,
  1,
  0,
  0
], Ee = ({
  scaleX: n = 1,
  scaleY: t = 1,
  flipX: e = !1,
  flipY: s = !1,
  skewX: i = 0,
  skewY: r = 0
}) => {
  let o = ds(
    e ? -n : n,
    s ? -t : t
  );
  return i && (o = B(o, hi(i), !0)), r && (o = B(o, li(r), !0)), o;
}, kr = (n) => {
  const { translateX: t = 0, translateY: e = 0, angle: s = 0 } = n;
  let i = pe(t, e);
  s && (i = B(i, Kt({ angle: s })));
  const r = Ee(n);
  return Tr(r) || (i = B(i, r)), i;
}, Se = (n, { signal: t, crossOrigin: e = null } = {}) => new Promise(function(s, i) {
  if (t && t.aborted)
    return i(new pr("loadImage"));
  const r = br();
  let o;
  t && (o = function(h) {
    r.src = "", i(h);
  }, t.addEventListener("abort", o, { once: !0 }));
  const a = function() {
    r.onload = r.onerror = null, o && t?.removeEventListener("abort", o), s(r);
  };
  if (!n) {
    a();
    return;
  }
  r.onload = a, r.onerror = function() {
    o && t?.removeEventListener("abort", o), i(new pt(`Error loading ${r.src}`));
  }, e && (r.crossOrigin = e), r.src = n;
}), ae = (n, { signal: t, reviver: e = Be } = {}) => new Promise((s, i) => {
  const r = [];
  t && t.addEventListener("abort", i, { once: !0 }), Promise.all(
    n.map(
      (o) => x.getClass(o.type).fromObject(o, { signal: t }).then((a) => (e(o, a), r.push(a), a))
    )
  ).then(s).catch((o) => {
    r.forEach((a) => {
      a.dispose && a.dispose();
    }), i(o);
  }).finally(() => {
    t && t.removeEventListener("abort", i);
  });
}), Ae = (n, { signal: t } = {}) => new Promise((e, s) => {
  const i = [];
  t && t.addEventListener("abort", s, { once: !0 });
  const r = Object.values(n).map((a) => a && (a.type && x.has(a.type) ? ae([a], {
    signal: t
  }).then(([h]) => (i.push(h), h)) : a)), o = Object.keys(n);
  Promise.all(r).then((a) => a.reduce((h, l, c) => (h[o[c]] = l, h), {})).then(e).catch((a) => {
    i.forEach((h) => {
      h.dispose && h.dispose();
    }), s(a);
  }).finally(() => {
    t && t.removeEventListener("abort", s);
  });
}), Jt = (n, t = []) => t.reduce((e, s) => (s in n && (e[s] = n[s]), e), {}), ci = (n, t) => Object.keys(n).reduce((e, s) => (t(n[s], s, n) && (e[s] = n[s]), e), {}), F = (n, t) => parseFloat(Number(n).toFixed(t)), he = (n) => "matrix(" + n.map((t) => F(t, M.NUM_FRACTION_DIGITS)).join(" ") + ")", ct = (n) => !!n && n.toLive !== void 0, Yi = (n) => !!n && typeof n.toObject == "function", Vi = (n) => !!n && n.offsetX !== void 0 && "source" in n, ko = (n) => !!n && typeof n._renderText == "function", Mo = (n) => !!n && typeof n._renderPathCommands == "function", Xt = (n) => !!n && "multiSelectionStacking" in n;
function Mr(n) {
  const t = n && gt(n);
  let e = 0, s = 0;
  if (!n || !t)
    return { left: e, top: s };
  let i = n;
  const r = t.documentElement, o = t.body || {
    scrollLeft: 0,
    scrollTop: 0
  };
  for (; i && (i.parentNode || i.host) && (i = i.parentNode || i.host, i === t ? (e = o.scrollLeft || r.scrollLeft || 0, s = o.scrollTop || r.scrollTop || 0) : (e += i.scrollLeft || 0, s += i.scrollTop || 0), !(i.nodeType === 1 && i.style.position === "fixed")); )
    ;
  return { left: e, top: s };
}
const gt = (n) => n.ownerDocument || null, Pr = (n) => n.ownerDocument?.defaultView || null, Er = (n, t, { width: e, height: s }, i = 1) => {
  n.width = e, n.height = s, i > 1 && (n.setAttribute("width", (e * i).toString()), n.setAttribute("height", (s * i).toString()), t.scale(i, i));
}, Xs = (n, { width: t, height: e }) => {
  t && (n.style.width = typeof t == "number" ? `${t}px` : t), e && (n.style.height = typeof e == "number" ? `${e}px` : e);
};
function Po(n) {
  const t = n && gt(n), e = { left: 0, top: 0 };
  if (!t)
    return e;
  const s = Pr(n)?.getComputedStyle(n, null) || {};
  e.left += parseInt(s.borderLeftWidth, 10) || 0, e.top += parseInt(s.borderTopWidth, 10) || 0, e.left += parseInt(s.paddingLeft, 10) || 0, e.top += parseInt(s.paddingTop, 10) || 0;
  let i = { left: 0, top: 0 };
  const r = t.documentElement;
  typeof n.getBoundingClientRect < "u" && (i = n.getBoundingClientRect());
  const o = Mr(n);
  return {
    left: i.left + o.left - (r.clientLeft || 0) + e.left,
    top: i.top + o.top - (r.clientTop || 0) + e.top
  };
}
function Xi(n) {
  return typeof n.onselectstart < "u" && (n.onselectstart = () => !1), n.style.userSelect = K, n;
}
class Ar {
  /**
   * Keeps a copy of the canvas style before setting retina scaling and other potions
   * in order to return it to original state on dispose
   * @type string
   */
  _originalCanvasStyle;
  lower;
  constructor(t) {
    const e = this.createLowerCanvas(t);
    this.lower = { el: e, ctx: e.getContext("2d") };
  }
  createLowerCanvas(t) {
    const e = Do(t) ? t : t && fe().getElementById(t) || ut();
    if (e.hasAttribute("data-fabric"))
      throw new pt(
        "Trying to initialize a canvas that has already been initialized. Did you forget to dispose the canvas?"
      );
    return this._originalCanvasStyle = e.style.cssText, e.setAttribute("data-fabric", "main"), e.classList.add("lower-canvas"), e;
  }
  cleanupDOM({ width: t, height: e }) {
    const { el: s } = this.lower;
    s.classList.remove("lower-canvas"), s.removeAttribute("data-fabric"), s.setAttribute("width", `${t}`), s.setAttribute("height", `${e}`), s.style.cssText = this._originalCanvasStyle || "", this._originalCanvasStyle = void 0;
  }
  setDimensions(t, e) {
    const { el: s, ctx: i } = this.lower;
    Er(s, i, t, e);
  }
  setCSSDimensions(t) {
    Xs(this.lower.el, t);
  }
  /**
   * Calculates canvas element offset relative to the document
   */
  calcOffset() {
    return Po(this.lower.el);
  }
  dispose() {
    bt().dispose(this.lower.el), delete this.lower;
  }
}
const Eo = {
  backgroundVpt: !0,
  backgroundColor: "",
  overlayVpt: !0,
  overlayColor: "",
  includeDefaultValues: !0,
  svgViewportTransformation: !0,
  renderOnAddRemove: !0,
  skipOffscreen: !0,
  enableRetinaScaling: !0,
  imageSmoothingEnabled: !0,
  /**
   * @todo move to Canvas
   */
  controlsAboveOverlay: !1,
  /**
   * @todo move to Canvas
   */
  allowTouchScrolling: !1,
  viewportTransform: [...J]
};
class gs extends Sr(wr) {
  /**
   * A reference to the canvas actual HTMLCanvasElement.
   * Can be use to read the raw pixels, but never write or manipulate
   * @type HTMLCanvasElement
   */
  get lowerCanvasEl() {
    return this.elements.lower?.el;
  }
  get contextContainer() {
    return this.elements.lower?.ctx;
  }
  static ownDefaults = Eo;
  static getDefaults() {
    return gs.ownDefaults;
  }
  constructor(t, e = {}) {
    super(), Object.assign(
      this,
      this.constructor.getDefaults()
    ), this.set(e), this.initElements(t), this._setDimensionsImpl({
      width: this.width || this.elements.lower.el.width || 0,
      height: this.height || this.elements.lower.el.height || 0
    }), this.skipControlsDrawing = !1, this.viewportTransform = [...this.viewportTransform], this.calcViewportBoundaries();
  }
  initElements(t) {
    this.elements = new Ar(t);
  }
  add(...t) {
    const e = super.add(...t);
    return t.length > 0 && this.renderOnAddRemove && this.requestRenderAll(), e;
  }
  insertAt(t, ...e) {
    const s = super.insertAt(t, ...e);
    return e.length > 0 && this.renderOnAddRemove && this.requestRenderAll(), s;
  }
  remove(...t) {
    const e = super.remove(...t);
    return e.length > 0 && this.renderOnAddRemove && this.requestRenderAll(), e;
  }
  _onObjectAdded(t) {
    t.canvas && t.canvas !== this && (Mt(
      "warn",
      `Canvas is trying to add an object that belongs to a different canvas.
Resulting to default behavior: removing object from previous canvas and adding to new canvas`
    ), t.canvas.remove(t)), t._set("canvas", this), t.setCoords(), this.fire("object:added", { target: t }), t.fire("added", { target: this });
  }
  _onObjectRemoved(t) {
    t._set("canvas", void 0), this.fire("object:removed", { target: t }), t.fire("removed", { target: this });
  }
  _onStackOrderChanged() {
    this.renderOnAddRemove && this.requestRenderAll();
  }
  /**
   * @private
   * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
   * @return {Number} retinaScaling if applied, otherwise 1;
   */
  getRetinaScaling() {
    return this.enableRetinaScaling ? mr() : 1;
  }
  /**
   * Calculates canvas element offset relative to the document
   * This method is also attached as "resize" event handler of window
   */
  calcOffset() {
    return this._offset = this.elements.calcOffset();
  }
  /**
   * Returns canvas width (in px)
   * @return {Number}
   */
  getWidth() {
    return this.width;
  }
  /**
   * Returns canvas height (in px)
   * @return {Number}
   */
  getHeight() {
    return this.height;
  }
  /**
   * Internal use only
   * @protected
   */
  _setDimensionsImpl(t, { cssOnly: e = !1, backstoreOnly: s = !1 } = {}) {
    if (!e) {
      const i = {
        width: this.width,
        height: this.height,
        ...t
      };
      this.elements.setDimensions(i, this.getRetinaScaling()), this.hasLostContext = !0, this.width = i.width, this.height = i.height;
    }
    s || this.elements.setCSSDimensions(t), this.calcOffset();
  }
  setDimensions(t, e) {
    this._setDimensionsImpl(t, e), (!e || !e.cssOnly) && this.requestRenderAll();
  }
  /**
   * Returns canvas zoom level
   * @return {Number}
   */
  getZoom() {
    return this.viewportTransform[0];
  }
  /**
   * Sets viewport transformation of this canvas instance
   * @param {Array} vpt a Canvas 2D API transform matrix
   */
  setViewportTransform(t) {
    this.viewportTransform = t, this.calcViewportBoundaries(), this.renderOnAddRemove && this.requestRenderAll();
  }
  /**
   * Sets zoom level of this canvas instance, the zoom centered around point
   * meaning that following zoom to point with the same point will have the visual
   * effect of the zoom originating from that point. The point won't move.
   * It has nothing to do with canvas center or visual center of the viewport.
   * @param {Point} point to zoom with respect to
   * @param {Number} value to set zoom to, less than 1 zooms out
   */
  zoomToPoint(t, e) {
    const s = t, i = [...this.viewportTransform], r = G(t, st(i));
    i[0] = e, i[3] = e;
    const o = G(r, i);
    i[4] += s.x - o.x, i[5] += s.y - o.y, this.setViewportTransform(i);
  }
  /**
   * Sets zoom level of this canvas instance
   * @param {Number} value to set zoom to, less than 1 zooms out
   */
  setZoom(t) {
    this.zoomToPoint(new m(0, 0), t);
  }
  /**
   * Pan viewport so as to place point at top left corner of canvas
   * @param {Point} point to move to
   */
  absolutePan(t) {
    const e = [...this.viewportTransform];
    return e[4] = -t.x, e[5] = -t.y, this.setViewportTransform(e);
  }
  /**
   * Pans viewpoint relatively
   * @param {Point} point (position vector) to move by
   */
  relativePan(t) {
    return this.absolutePan(
      new m(
        -t.x - this.viewportTransform[4],
        -t.y - this.viewportTransform[5]
      )
    );
  }
  /**
   * Returns &lt;canvas> element corresponding to this instance
   * @return {HTMLCanvasElement}
   */
  getElement() {
    return this.elements.lower.el;
  }
  /**
   * Clears specified context of canvas element
   * @param {CanvasRenderingContext2D} ctx Context to clear
   */
  clearContext(t) {
    t.clearRect(0, 0, this.width, this.height);
  }
  /**
   * Returns context of canvas where objects are drawn
   * @return {CanvasRenderingContext2D}
   */
  getContext() {
    return this.elements.lower.ctx;
  }
  /**
   * Clears all contexts (background, main, top) of an instance
   */
  clear() {
    this.remove(...this.getObjects()), this.backgroundImage = void 0, this.overlayImage = void 0, this.backgroundColor = "", this.overlayColor = "", this.clearContext(this.getContext()), this.fire("canvas:cleared"), this.renderOnAddRemove && this.requestRenderAll();
  }
  /**
   * Renders the canvas
   */
  renderAll() {
    this.cancelRequestedRender(), !this.destroyed && this.renderCanvas(this.getContext(), this._objects);
  }
  /**
   * Function created to be instance bound at initialization
   * used in requestAnimationFrame rendering
   * Let the fabricJS call it. If you call it manually you could have more
   * animationFrame stacking on to of each other
   * for an imperative rendering, use canvas.renderAll
   * @private
   */
  renderAndReset() {
    this.nextRenderHandle = 0, this.renderAll();
  }
  /**
   * Append a renderAll request to next animation frame.
   * unless one is already in progress, in that case nothing is done
   * a boolean flag will avoid appending more.
   */
  requestRenderAll() {
    !this.nextRenderHandle && !this.disposed && !this.destroyed && (this.nextRenderHandle = Ce(() => this.renderAndReset()));
  }
  /**
   * Calculate the position of the 4 corner of canvas with current viewportTransform.
   * helps to determinate when an object is in the current rendering viewport
   */
  calcViewportBoundaries() {
    const t = this.width, e = this.height, s = st(this.viewportTransform), i = G({ x: 0, y: 0 }, s), r = G({ x: t, y: e }, s), o = i.min(r), a = i.max(r);
    return this.vptCoords = {
      tl: o,
      tr: new m(a.x, o.y),
      bl: new m(o.x, a.y),
      br: a
    };
  }
  cancelRequestedRender() {
    this.nextRenderHandle && (xr(this.nextRenderHandle), this.nextRenderHandle = 0);
  }
  drawControls(t) {
  }
  /**
   * Renders background, objects, overlay and controls.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array} objects to render
   */
  renderCanvas(t, e) {
    if (this.destroyed)
      return;
    const s = this.viewportTransform, i = this.clipPath;
    this.calcViewportBoundaries(), this.clearContext(t), t.imageSmoothingEnabled = this.imageSmoothingEnabled, t.patternQuality = "best", this.fire("before:render", { ctx: t }), this._renderBackground(t), t.save(), t.transform(s[0], s[1], s[2], s[3], s[4], s[5]), this._renderObjects(t, e), t.restore(), !this.controlsAboveOverlay && !this.skipControlsDrawing && this.drawControls(t), i && (i._set("canvas", this), i.shouldCache(), i._transformDone = !0, i.renderCache({ forClipping: !0 }), this.drawClipPathOnCanvas(t, i)), this._renderOverlay(t), this.controlsAboveOverlay && !this.skipControlsDrawing && this.drawControls(t), this.fire("after:render", { ctx: t }), this.__cleanupTask && (this.__cleanupTask(), this.__cleanupTask = void 0);
  }
  /**
   * Paint the cached clipPath on the lowerCanvasEl
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawClipPathOnCanvas(t, e) {
    const s = this.viewportTransform;
    t.save(), t.transform(...s), t.globalCompositeOperation = "destination-in", e.transform(t), t.scale(1 / e.zoomX, 1 / e.zoomY), t.drawImage(
      e._cacheCanvas,
      -e.cacheTranslationX,
      -e.cacheTranslationY
    ), t.restore();
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Array} objects to render
   */
  _renderObjects(t, e) {
    for (let s = 0, i = e.length; s < i; ++s)
      e[s] && e[s].render(t);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {string} property 'background' or 'overlay'
   */
  _renderBackgroundOrOverlay(t, e) {
    const s = this[`${e}Color`], i = this[`${e}Image`], r = this.viewportTransform, o = this[`${e}Vpt`];
    if (!s && !i)
      return;
    const a = ct(s);
    if (s) {
      if (t.save(), t.beginPath(), t.moveTo(0, 0), t.lineTo(this.width, 0), t.lineTo(this.width, this.height), t.lineTo(0, this.height), t.closePath(), t.fillStyle = a ? s.toLive(
        t
        /* this */
      ) : s, o && t.transform(...r), a) {
        t.transform(1, 0, 0, 1, s.offsetX || 0, s.offsetY || 0);
        const h = s.gradientTransform || s.patternTransform;
        h && t.transform(...h);
      }
      t.fill(), t.restore();
    }
    if (i) {
      t.save();
      const { skipOffscreen: h } = this;
      this.skipOffscreen = o, o && t.transform(...r), i.render(t), this.skipOffscreen = h, t.restore();
    }
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderBackground(t) {
    this._renderBackgroundOrOverlay(t, "background");
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderOverlay(t) {
    this._renderBackgroundOrOverlay(t, "overlay");
  }
  /**
   * Returns coordinates of a center of canvas.
   * @return {Point}
   */
  getCenterPoint() {
    return new m(this.width / 2, this.height / 2);
  }
  /**
   * Centers object horizontally in the canvas
   */
  centerObjectH(t) {
    return this._centerObject(
      t,
      new m(this.getCenterPoint().x, t.getCenterPoint().y)
    );
  }
  /**
   * Centers object vertically in the canvas
   * @param {FabricObject} object Object to center vertically
   */
  centerObjectV(t) {
    return this._centerObject(
      t,
      new m(t.getCenterPoint().x, this.getCenterPoint().y)
    );
  }
  /**
   * Centers object vertically and horizontally in the canvas
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  centerObject(t) {
    return this._centerObject(t, this.getCenterPoint());
  }
  /**
   * Centers object vertically and horizontally in the viewport
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  viewportCenterObject(t) {
    return this._centerObject(t, this.getVpCenter());
  }
  /**
   * Centers object horizontally in the viewport, object.top is unchanged
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  viewportCenterObjectH(t) {
    return this._centerObject(
      t,
      new m(this.getVpCenter().x, t.getCenterPoint().y)
    );
  }
  /**
   * Centers object Vertically in the viewport, object.top is unchanged
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  viewportCenterObjectV(t) {
    return this._centerObject(
      t,
      new m(t.getCenterPoint().x, this.getVpCenter().y)
    );
  }
  /**
   * Calculate the point in canvas that correspond to the center of actual viewport.
   * @return {Point} vpCenter, viewport center
   */
  getVpCenter() {
    return G(
      this.getCenterPoint(),
      st(this.viewportTransform)
    );
  }
  /**
   * @private
   * @param {FabricObject} object Object to center
   * @param {Point} center Center point
   */
  _centerObject(t, e) {
    t.setXY(e, T, T), t.setCoords(), this.renderOnAddRemove && this.requestRenderAll();
  }
  /**
   * Returns dataless JSON representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {String} json string
   */
  toDatalessJSON(t) {
    return this.toDatalessObject(t);
  }
  /**
   * Returns object representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(t) {
    return this._toObjectMethod("toObject", t);
  }
  /**
   * Returns Object representation of canvas
   * this alias is provided because if you call JSON.stringify on an instance,
   * the toJSON object will be invoked if it exists.
   * Having a toJSON method means you can do JSON.stringify(myCanvas)
   * JSON does not support additional properties because toJSON has its own signature
   * @return {Object} JSON compatible object
   * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-3#serialization}
   * @see {@link http://jsfiddle.net/fabricjs/pec86/|jsFiddle demo}
   * @example <caption>JSON representation of canvas </caption>
   * const json = canvas.toJSON();
   * @example <caption>JSON representation of canvas </caption>
   * const json = JSON.stringify(canvas);
   */
  toJSON() {
    return this.toObject();
  }
  /**
   * Returns dataless object representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject(t) {
    return this._toObjectMethod("toDatalessObject", t);
  }
  /**
   * @private
   */
  _toObjectMethod(t, e) {
    const s = this.clipPath, i = s && !s.excludeFromExport ? this._toObject(s, t, e) : null;
    return {
      version: Ys,
      ...Jt(this, e),
      objects: this._objects.filter((r) => !r.excludeFromExport).map(
        (r) => this._toObject(r, t, e)
      ),
      ...this.__serializeBgOverlay(t, e),
      ...i ? { clipPath: i } : null
    };
  }
  /**
   * @private
   */
  _toObject(t, e, s) {
    let i;
    this.includeDefaultValues || (i = t.includeDefaultValues, t.includeDefaultValues = !1);
    const r = t[e](s);
    return this.includeDefaultValues || (t.includeDefaultValues = !!i), r;
  }
  /**
   * @private
   */
  __serializeBgOverlay(t, e) {
    const s = {}, i = this.backgroundImage, r = this.overlayImage, o = this.backgroundColor, a = this.overlayColor;
    return ct(o) ? o.excludeFromExport || (s.background = o.toObject(e)) : o && (s.background = o), ct(a) ? a.excludeFromExport || (s.overlay = a.toObject(e)) : a && (s.overlay = a), i && !i.excludeFromExport && (s.backgroundImage = this._toObject(
      i,
      t,
      e
    )), r && !r.excludeFromExport && (s.overlayImage = this._toObject(
      r,
      t,
      e
    )), s;
  }
  /**
   * Returns SVG representation of canvas
   * @param {Object} [options] Options object for SVG output
   * @param {Boolean} [options.suppressPreamble=false] If true xml tag is not included
   * @param {Object} [options.viewBox] SVG viewbox object
   * @param {Number} [options.viewBox.x] x-coordinate of viewbox
   * @param {Number} [options.viewBox.y] y-coordinate of viewbox
   * @param {Number} [options.viewBox.width] Width of viewbox
   * @param {Number} [options.viewBox.height] Height of viewbox
   * @param {String} [options.encoding=UTF-8] Encoding of SVG output
   * @param {String} [options.width] desired width of svg with or without units
   * @param {String} [options.height] desired height of svg with or without units
   * @param {Function} [reviver] Method for further parsing of svg elements, called after each fabric object converted into svg representation.
   * @return {String} SVG string
   * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-3#serialization}
   * @see {@link http://jsfiddle.net/fabricjs/jQ3ZZ/|jsFiddle demo}
   * @example <caption>Normal SVG output</caption>
   * var svg = canvas.toSVG();
   * @example <caption>SVG output without preamble (without &lt;?xml ../>)</caption>
   * var svg = canvas.toSVG({suppressPreamble: true});
   * @example <caption>SVG output with viewBox attribute</caption>
   * var svg = canvas.toSVG({
   *   viewBox: {
   *     x: 100,
   *     y: 100,
   *     width: 200,
   *     height: 300
   *   }
   * });
   * @example <caption>SVG output with different encoding (default: UTF-8)</caption>
   * var svg = canvas.toSVG({encoding: 'ISO-8859-1'});
   * @example <caption>Modify SVG output with reviver function</caption>
   * var svg = canvas.toSVG(null, function(svg) {
   *   return svg.replace('stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; ', '');
   * });
   */
  toSVG(t = {}, e) {
    t.reviver = e;
    const s = [];
    return this._setSVGPreamble(s, t), this._setSVGHeader(s, t), this.clipPath && s.push(`<g clip-path="url(#${this.clipPath.clipPathId})" >
`), this._setSVGBgOverlayColor(s, "background"), this._setSVGBgOverlayImage(s, "backgroundImage", e), this._setSVGObjects(s, e), this.clipPath && s.push(`</g>
`), this._setSVGBgOverlayColor(s, "overlay"), this._setSVGBgOverlayImage(s, "overlayImage", e), s.push("</svg>"), s.join("");
  }
  /**
   * @private
   */
  _setSVGPreamble(t, e) {
    e.suppressPreamble || t.push(
      '<?xml version="1.0" encoding="',
      e.encoding || "UTF-8",
      `" standalone="no" ?>
`,
      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ',
      `"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
`
    );
  }
  /**
   * @private
   */
  _setSVGHeader(t, e) {
    const s = e.width || `${this.width}`, i = e.height || `${this.height}`, r = M.NUM_FRACTION_DIGITS, o = e.viewBox;
    let a;
    if (o)
      a = `viewBox="${o.x} ${o.y} ${o.width} ${o.height}" `;
    else if (this.svgViewportTransformation) {
      const h = this.viewportTransform;
      a = `viewBox="${F(
        -h[4] / h[0],
        r
      )} ${F(-h[5] / h[3], r)} ${F(
        this.width / h[0],
        r
      )} ${F(this.height / h[3], r)}" `;
    } else
      a = `viewBox="0 0 ${this.width} ${this.height}" `;
    t.push(
      "<svg ",
      'xmlns="http://www.w3.org/2000/svg" ',
      'xmlns:xlink="http://www.w3.org/1999/xlink" ',
      'version="1.1" ',
      'width="',
      s,
      '" ',
      'height="',
      i,
      '" ',
      a,
      `xml:space="preserve">
`,
      "<desc>Created with Fabric.js ",
      Ys,
      `</desc>
`,
      `<defs>
`,
      this.createSVGFontFacesMarkup(),
      this.createSVGRefElementsMarkup(),
      this.createSVGClipPathMarkup(e),
      `</defs>
`
    );
  }
  createSVGClipPathMarkup(t) {
    const e = this.clipPath;
    return e ? (e.clipPathId = `CLIPPATH_${jt()}`, `<clipPath id="${e.clipPathId}" >
${e.toClipPathSVG(
      t.reviver
    )}</clipPath>
`) : "";
  }
  /**
   * Creates markup containing SVG referenced elements like patterns, gradients etc.
   * @return {String}
   */
  createSVGRefElementsMarkup() {
    return ["background", "overlay"].map((t) => {
      const e = this[`${t}Color`];
      if (ct(e)) {
        const s = this[`${t}Vpt`], i = this.viewportTransform, r = {
          // otherwise circular dependency
          isType: () => !1,
          width: this.width / (s ? i[0] : 1),
          height: this.height / (s ? i[3] : 1)
        };
        return e.toSVG(r, {
          additionalTransform: s ? he(i) : ""
        });
      }
    }).join("");
  }
  /**
   * Creates markup containing SVG font faces,
   * font URLs for font faces must be collected by developers
   * and are not extracted from the DOM by fabricjs
   * @param {Array} objects Array of fabric objects
   * @return {String}
   */
  createSVGFontFacesMarkup() {
    const t = [], e = {}, s = M.fontPaths;
    this._objects.forEach(function r(o) {
      t.push(o), Ie(o) && o._objects.forEach(r);
    }), t.forEach((r) => {
      if (!ko(r))
        return;
      const { styles: o, fontFamily: a } = r;
      e[a] || !s[a] || (e[a] = !0, o && Object.values(o).forEach((h) => {
        Object.values(h).forEach(({ fontFamily: l = "" }) => {
          !e[l] && s[l] && (e[l] = !0);
        });
      }));
    });
    const i = Object.keys(e).map(
      (r) => `		@font-face {
			font-family: '${r}';
			src: url('${s[r]}');
		}
`
    ).join("");
    return i ? `	<style type="text/css"><![CDATA[
${i}]]></style>
` : "";
  }
  /**
   * @private
   */
  _setSVGObjects(t, e) {
    this.forEachObject((s) => {
      s.excludeFromExport || this._setSVGObject(t, s, e);
    });
  }
  /**
   * This is its own function because the Canvas ( non static ) requires extra code here
   * @private
   */
  _setSVGObject(t, e, s) {
    t.push(e.toSVG(s));
  }
  /**
   * @private
   */
  _setSVGBgOverlayImage(t, e, s) {
    const i = this[e];
    i && !i.excludeFromExport && i.toSVG && t.push(i.toSVG(s));
  }
  /**
   * @TODO this seems to handle patterns but fail at gradients.
   * @private
   */
  _setSVGBgOverlayColor(t, e) {
    const s = this[`${e}Color`];
    if (s)
      if (ct(s)) {
        const i = s.repeat || "", r = this.width, o = this.height, a = this[`${e}Vpt`], h = a ? he(st(this.viewportTransform)) : "";
        t.push(
          `<rect transform="${h} translate(${r / 2},${o / 2})" x="${s.offsetX - r / 2}" y="${s.offsetY - o / 2}" width="${(i === "repeat-y" || i === "no-repeat") && Vi(s) ? s.source.width : r}" height="${(i === "repeat-x" || i === "no-repeat") && Vi(s) ? s.source.height : o}" fill="url(#SVGID_${s.id})"></rect>
`
        );
      } else
        t.push(
          '<rect x="0" y="0" width="100%" height="100%" ',
          'fill="',
          s,
          '"',
          `></rect>
`
        );
  }
  /* _TO_SVG_END_ */
  /**
   * Populates canvas with data from the specified JSON.
   * JSON format must conform to the one of {@link fabric.Canvas#toJSON}
   *
   * **IMPORTANT**: It is recommended to abort loading tasks before calling this method to prevent race conditions and unnecessary networking
   *
   * @param {String|Object} json JSON string or object
   * @param {Function} [reviver] Method for further parsing of JSON elements, called after each fabric object created.
   * @param {Object} [options] options
   * @param {AbortSignal} [options.signal] see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @return {Promise<Canvas | StaticCanvas>} instance
   * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-3#deserialization}
   * @see {@link http://jsfiddle.net/fabricjs/fmgXt/|jsFiddle demo}
   * @example <caption>loadFromJSON</caption>
   * canvas.loadFromJSON(json).then((canvas) => canvas.requestRenderAll());
   * @example <caption>loadFromJSON with reviver</caption>
   * canvas.loadFromJSON(json, function(o, object) {
   *   // `o` = json object
   *   // `object` = fabric.Object instance
   *   // ... do some stuff ...
   * }).then((canvas) => {
   *   ... canvas is restored, add your code.
   * });
   *
   */
  loadFromJSON(t, e, { signal: s } = {}) {
    if (!t)
      return Promise.reject(new pt("`json` is undefined"));
    const { objects: i = [], ...r } = typeof t == "string" ? JSON.parse(t) : t, { backgroundImage: o, background: a, overlayImage: h, overlay: l, clipPath: c } = r, u = this.renderOnAddRemove;
    return this.renderOnAddRemove = !1, Promise.all([
      ae(i, {
        reviver: e,
        signal: s
      }),
      Ae(
        {
          backgroundImage: o,
          backgroundColor: a,
          overlayImage: h,
          overlayColor: l,
          clipPath: c
        },
        { signal: s }
      )
    ]).then(([f, d]) => (this.clear(), this.add(...f), this.set(r), this.set(d), this.renderOnAddRemove = u, this));
  }
  /**
   * Clones canvas instance
   * @param {string[]} [properties] Array of properties to include in the cloned canvas and children
   */
  clone(t) {
    const e = this.toObject(t);
    return this.cloneWithoutData().loadFromJSON(e);
  }
  /**
   * Clones canvas instance without cloning existing data.
   * This essentially copies canvas dimensions since loadFromJSON does not affect canvas size.
   */
  cloneWithoutData() {
    const t = rt(this);
    return new this.constructor(t);
  }
  /**
   * Exports canvas element to a dataurl image. Note that when multiplier is used, cropping is scaled appropriately
   * @param {Object} [options] Options object
   * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
   * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
   * @param {Number} [options.multiplier=1] Multiplier to scale by, to have consistent
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 2.0.0
   * @param {(object: fabric.Object) => boolean} [options.filter] Function to filter objects.
   * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
   * @see {@link https://jsfiddle.net/xsjua1rd/ demo}
   * @example <caption>Generate jpeg dataURL with lower quality</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'jpeg',
   *   quality: 0.8
   * });
   * @example <caption>Generate cropped png dataURL (clipping of canvas)</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'png',
   *   left: 100,
   *   top: 100,
   *   width: 200,
   *   height: 200
   * });
   * @example <caption>Generate double scaled png dataURL</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'png',
   *   multiplier: 2
   * });
   * @example <caption>Generate dataURL with objects that overlap a specified object</caption>
   * var myObject;
   * var dataURL = canvas.toDataURL({
   *   filter: (object) => object.isContainedWithinObject(myObject) || object.intersectsWithObject(myObject)
   * });
   */
  toDataURL(t = {}) {
    const {
      format: e = "png",
      quality: s = 1,
      multiplier: i = 1,
      enableRetinaScaling: r = !1
    } = t, o = i * (r ? this.getRetinaScaling() : 1);
    return oi(
      this.toCanvasElement(o, t),
      e,
      s
    );
  }
  toBlob(t = {}) {
    const {
      format: e = "png",
      quality: s = 1,
      multiplier: i = 1,
      enableRetinaScaling: r = !1
    } = t, o = i * (r ? this.getRetinaScaling() : 1);
    return ai(
      this.toCanvasElement(o, t),
      e,
      s
    );
  }
  /**
   * Create a new HTMLCanvas element painted with the current canvas content.
   * No need to resize the actual one or repaint it.
   * Will transfer object ownership to a new canvas, paint it, and set everything back.
   * This is an intermediary step used to get to a dataUrl but also it is useful to
   * create quick image copies of a canvas without passing for the dataUrl string
   * @param {Number} [multiplier] a zoom factor.
   * @param {Object} [options] Cropping informations
   * @param {Number} [options.left] Cropping left offset.
   * @param {Number} [options.top] Cropping top offset.
   * @param {Number} [options.width] Cropping width.
   * @param {Number} [options.height] Cropping height.
   * @param {(object: fabric.Object) => boolean} [options.filter] Function to filter objects.
   */
  toCanvasElement(t = 1, { width: e, height: s, left: i, top: r, filter: o } = {}) {
    const a = (e || this.width) * t, h = (s || this.height) * t, l = this.getZoom(), c = this.width, u = this.height, f = this.skipControlsDrawing, d = l * t, g = this.viewportTransform, p = (g[4] - (i || 0)) * t, _ = (g[5] - (r || 0)) * t, y = [d, 0, 0, d, p, _], v = this.enableRetinaScaling, S = rt({
      width: a,
      height: h
    }), C = o ? this._objects.filter((w) => o(w)) : this._objects;
    return this.enableRetinaScaling = !1, this.viewportTransform = y, this.width = a, this.height = h, this.skipControlsDrawing = !0, this.calcViewportBoundaries(), this.renderCanvas(S.getContext("2d"), C), this.viewportTransform = g, this.width = c, this.height = u, this.calcViewportBoundaries(), this.enableRetinaScaling = v, this.skipControlsDrawing = f, S;
  }
  /**
   * Waits until rendering has settled to destroy the canvas
   * @returns {Promise<boolean>} a promise resolving to `true` once the canvas has been destroyed or to `false` if the canvas has was already destroyed
   * @throws if aborted by a consequent call
   */
  dispose() {
    return !this.disposed && this.elements.cleanupDOM({ width: this.width, height: this.height }), Ge.cancelByCanvas(this), this.disposed = !0, new Promise((t, e) => {
      const s = () => {
        this.destroy(), t(!0);
      };
      s.kill = e, this.__cleanupTask && this.__cleanupTask.kill("aborted"), this.destroyed ? t(!1) : this.nextRenderHandle ? this.__cleanupTask = s : s();
    });
  }
  /**
   * Clears the canvas element, disposes objects and frees resources.
   *
   * Invoked as part of the **async** operation of {@link dispose}.
   *
   * **CAUTION**:
   *
   * This method is **UNSAFE**.
   * You may encounter a race condition using it if there's a requested render.
   * Call this method only if you are sure rendering has settled.
   * Consider using {@link dispose} as it is **SAFE**
   *
   * @private
   */
  destroy() {
    this.destroyed = !0, this.cancelRequestedRender(), this.forEachObject((t) => t.dispose()), this._objects = [], this.backgroundImage && this.backgroundImage.dispose(), this.backgroundImage = void 0, this.overlayImage && this.overlayImage.dispose(), this.overlayImage = void 0, this.elements.dispose();
  }
  /**
   * Returns a string representation of an instance
   * @return {String} string representation of an instance
   */
  toString() {
    return `#<Canvas (${this.complexity()}): { objects: ${this._objects.length} }>`;
  }
}
const Ao = ["touchstart", "touchmove", "touchend"];
function Fo(n) {
  const t = n.changedTouches;
  return t && t[0] ? t[0] : n;
}
const Fr = (n) => {
  const t = n.target, e = Mr(t), s = Fo(n);
  return new m(s.clientX + e.left, s.clientY + e.top);
}, He = (n) => Ao.includes(n.type) || n.pointerType === "touch", $i = (n) => {
  n.preventDefault(), n.stopPropagation();
}, wt = (n) => {
  let t = 0, e = 0, s = 0, i = 0;
  for (let r = 0, o = n.length; r < o; r++) {
    const { x: a, y: h } = n[r];
    (a > s || !r) && (s = a), (a < t || !r) && (t = a), (h > i || !r) && (i = h), (h < e || !r) && (e = h);
  }
  return {
    left: t,
    top: e,
    width: s - t,
    height: i - e
  };
}, Lo = (n, t) => {
  const e = st(t), s = B(
    e,
    n.calcOwnMatrix()
  );
  le(n, s);
}, Lr = (n, t) => le(
  n,
  B(t, n.calcOwnMatrix())
), le = (n, t) => {
  const { translateX: e, translateY: s, scaleX: i, scaleY: r, ...o } = Gt(t), a = new m(e, s);
  n.flipX = !1, n.flipY = !1, Object.assign(n, o), n.set({ scaleX: i, scaleY: r }), n.setPositionByOrigin(a, T, T);
}, Rr = (n) => {
  n.scaleX = 1, n.scaleY = 1, n.skewX = 0, n.skewY = 0, n.flipX = !1, n.flipY = !1, n.rotate(0);
}, ui = (n) => ({
  scaleX: n.scaleX,
  scaleY: n.scaleY,
  skewX: n.skewX,
  skewY: n.skewY,
  angle: n.angle,
  left: n.left,
  flipX: n.flipX,
  flipY: n.flipY,
  top: n.top
}), ps = (n, t, e) => {
  const s = n / 2, i = t / 2, r = [
    new m(-s, -i),
    new m(s, -i),
    new m(-s, i),
    new m(s, i)
  ].map((a) => a.transform(e)), o = wt(r);
  return new m(o.width, o.height);
}, Fe = (n = J, t = J) => B(st(t), n), Et = (n, t = J, e = J) => n.transform(Fe(t, e)), jr = (n, t = J, e = J) => n.transform(Fe(t, e), !0), fi = (n, t, e) => {
  const s = Fe(t, e);
  return le(
    n,
    B(s, n.calcOwnMatrix())
  ), s;
}, di = (n, t) => {
  const {
    transform: { target: e }
  } = t;
  e.canvas?.fire(`object:${n}`, {
    ...t,
    target: e
  }), e.fire(n, t);
}, Ro = {
  left: -0.5,
  top: -0.5,
  center: 0,
  bottom: 0.5,
  right: 0.5
}, V = (n) => typeof n == "string" ? Ro[n] : n - 0.5, jo = new m(1, 0), Br = new m(), gi = (n, t) => n.rotate(t), Te = (n, t) => new m(t).subtract(n), ze = (n) => n.distanceFrom(Br), Ne = (n, t) => Math.atan2(re(n, t), Ir(n, t)), pi = (n) => Ne(jo, n), ms = (n) => n.eq(Br) ? n : n.scalarDivide(ze(n)), mi = (n, t = !0) => ms(new m(-n.y, n.x).scalarMultiply(t ? 1 : -1)), re = (n, t) => n.x * t.y - n.y * t.x, Ir = (n, t) => n.x * t.x + n.y * t.y, $s = (n, t, e) => {
  if (n.eq(t) || n.eq(e)) return !0;
  const s = re(t, e), i = re(t, n), r = re(e, n);
  return s >= 0 ? i >= 0 && r <= 0 : !(i <= 0 && r >= 0);
}, Ue = "not-allowed", Bo = (n, t, e, s) => {
  if (!t || !n)
    return "drag";
  const i = s.controls[t];
  return i.getActionName(e, i, s);
};
function Yr(n) {
  return V(n.originX) === V(T) && V(n.originY) === V(T);
}
function Wi(n) {
  return -V(n) + 0.5;
}
const _t = (n, t) => n[t], _i = (n, t, e, s) => ({
  e: n,
  transform: t,
  pointer: new m(e, s)
});
function Vr(n, t, e) {
  const s = e, i = Et(
    n.getCenterPoint(),
    n.canvas.viewportTransform,
    void 0
  ), r = pi(Te(i, s)) + yt;
  return Math.round(r % yt / Co);
}
function Io(n, t, e, s) {
  const i = n.getRelativeCenterPoint(), r = typeof e < "u" && typeof s < "u" ? n.translateToGivenOrigin(
    i,
    T,
    T,
    e,
    s
  ) : new m(n.left, n.top);
  return (n.angle ? t.rotate(-I(n.angle), i) : t).subtract(r);
}
function _s({ target: n, corner: t }, e, s, i, r) {
  const o = n.controls[t], a = n.canvas?.getZoom() || 1, h = n.padding / a, l = Io(n, new m(i, r), e, s);
  return l.x >= h && (l.x -= h), l.x <= -h && (l.x += h), l.y >= h && (l.y -= h), l.y <= h && (l.y += h), l.x -= o.offsetX, l.y -= o.offsetY, l;
}
const Xr = (n, t, e, s) => {
  const { target: i, offsetX: r, offsetY: o } = t, a = e - r, h = s - o, l = !_t(i, "lockMovementX") && i.left !== a, c = !_t(i, "lockMovementY") && i.top !== h;
  return l && i.set(P, a), c && i.set(it, h), (l || c) && di(_r, _i(n, t, e, s)), l || c;
}, qe = (n) => n.replace(/\s+/g, " "), Gi = {
  aliceblue: "#F0F8FF",
  antiquewhite: "#FAEBD7",
  aqua: "#0FF",
  aquamarine: "#7FFFD4",
  azure: "#F0FFFF",
  beige: "#F5F5DC",
  bisque: "#FFE4C4",
  black: "#000",
  blanchedalmond: "#FFEBCD",
  blue: "#00F",
  blueviolet: "#8A2BE2",
  brown: "#A52A2A",
  burlywood: "#DEB887",
  cadetblue: "#5F9EA0",
  chartreuse: "#7FFF00",
  chocolate: "#D2691E",
  coral: "#FF7F50",
  cornflowerblue: "#6495ED",
  cornsilk: "#FFF8DC",
  crimson: "#DC143C",
  cyan: "#0FF",
  darkblue: "#00008B",
  darkcyan: "#008B8B",
  darkgoldenrod: "#B8860B",
  darkgray: "#A9A9A9",
  darkgrey: "#A9A9A9",
  darkgreen: "#006400",
  darkkhaki: "#BDB76B",
  darkmagenta: "#8B008B",
  darkolivegreen: "#556B2F",
  darkorange: "#FF8C00",
  darkorchid: "#9932CC",
  darkred: "#8B0000",
  darksalmon: "#E9967A",
  darkseagreen: "#8FBC8F",
  darkslateblue: "#483D8B",
  darkslategray: "#2F4F4F",
  darkslategrey: "#2F4F4F",
  darkturquoise: "#00CED1",
  darkviolet: "#9400D3",
  deeppink: "#FF1493",
  deepskyblue: "#00BFFF",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1E90FF",
  firebrick: "#B22222",
  floralwhite: "#FFFAF0",
  forestgreen: "#228B22",
  fuchsia: "#F0F",
  gainsboro: "#DCDCDC",
  ghostwhite: "#F8F8FF",
  gold: "#FFD700",
  goldenrod: "#DAA520",
  gray: "#808080",
  grey: "#808080",
  green: "#008000",
  greenyellow: "#ADFF2F",
  honeydew: "#F0FFF0",
  hotpink: "#FF69B4",
  indianred: "#CD5C5C",
  indigo: "#4B0082",
  ivory: "#FFFFF0",
  khaki: "#F0E68C",
  lavender: "#E6E6FA",
  lavenderblush: "#FFF0F5",
  lawngreen: "#7CFC00",
  lemonchiffon: "#FFFACD",
  lightblue: "#ADD8E6",
  lightcoral: "#F08080",
  lightcyan: "#E0FFFF",
  lightgoldenrodyellow: "#FAFAD2",
  lightgray: "#D3D3D3",
  lightgrey: "#D3D3D3",
  lightgreen: "#90EE90",
  lightpink: "#FFB6C1",
  lightsalmon: "#FFA07A",
  lightseagreen: "#20B2AA",
  lightskyblue: "#87CEFA",
  lightslategray: "#789",
  lightslategrey: "#789",
  lightsteelblue: "#B0C4DE",
  lightyellow: "#FFFFE0",
  lime: "#0F0",
  limegreen: "#32CD32",
  linen: "#FAF0E6",
  magenta: "#F0F",
  maroon: "#800000",
  mediumaquamarine: "#66CDAA",
  mediumblue: "#0000CD",
  mediumorchid: "#BA55D3",
  mediumpurple: "#9370DB",
  mediumseagreen: "#3CB371",
  mediumslateblue: "#7B68EE",
  mediumspringgreen: "#00FA9A",
  mediumturquoise: "#48D1CC",
  mediumvioletred: "#C71585",
  midnightblue: "#191970",
  mintcream: "#F5FFFA",
  mistyrose: "#FFE4E1",
  moccasin: "#FFE4B5",
  navajowhite: "#FFDEAD",
  navy: "#000080",
  oldlace: "#FDF5E6",
  olive: "#808000",
  olivedrab: "#6B8E23",
  orange: "#FFA500",
  orangered: "#FF4500",
  orchid: "#DA70D6",
  palegoldenrod: "#EEE8AA",
  palegreen: "#98FB98",
  paleturquoise: "#AFEEEE",
  palevioletred: "#DB7093",
  papayawhip: "#FFEFD5",
  peachpuff: "#FFDAB9",
  peru: "#CD853F",
  pink: "#FFC0CB",
  plum: "#DDA0DD",
  powderblue: "#B0E0E6",
  purple: "#800080",
  rebeccapurple: "#639",
  red: "#F00",
  rosybrown: "#BC8F8F",
  royalblue: "#4169E1",
  saddlebrown: "#8B4513",
  salmon: "#FA8072",
  sandybrown: "#F4A460",
  seagreen: "#2E8B57",
  seashell: "#FFF5EE",
  sienna: "#A0522D",
  silver: "#C0C0C0",
  skyblue: "#87CEEB",
  slateblue: "#6A5ACD",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#FFFAFA",
  springgreen: "#00FF7F",
  steelblue: "#4682B4",
  tan: "#D2B48C",
  teal: "#008080",
  thistle: "#D8BFD8",
  tomato: "#FF6347",
  turquoise: "#40E0D0",
  violet: "#EE82EE",
  wheat: "#F5DEB3",
  white: "#FFF",
  whitesmoke: "#F5F5F5",
  yellow: "#FF0",
  yellowgreen: "#9ACD32"
}, Yo = () => /^rgba?\(\s?(\d{0,3}(?:\.\d+)?%?)\s?[\s|,]\s?(\d{0,3}(?:\.\d+)?%?)\s?[\s|,]\s?(\d{0,3}(?:\.\d+)?%?)\s?(?:\s?[,/]\s?(\d{0,3}(?:\.\d+)?%?)\s?)?\)$/i, Vo = () => /^hsla?\(\s?([+-]?\d{0,3}(?:\.\d+)?(?:deg|turn|rad)?)\s?[\s|,]\s?(\d{0,3}(?:\.\d+)?%?)\s?[\s|,]\s?(\d{0,3}(?:\.\d+)?%?)\s?(?:\s?[,/]\s?(\d*(?:\.\d+)?%?)\s?)?\)$/i, Xo = () => /^#?(([0-9a-f]){3,4}|([0-9a-f]{2}){3,4})$/i, ks = (n, t, e) => (e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? n + (t - n) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? n + (t - n) * (2 / 3 - e) * 6 : n), Hi = (n, t, e, s) => {
  n /= 255, t /= 255, e /= 255;
  const i = Math.max(n, t, e), r = Math.min(n, t, e);
  let o, a;
  const h = (i + r) / 2;
  if (i === r)
    o = a = 0;
  else {
    const l = i - r;
    switch (a = h > 0.5 ? l / (2 - i - r) : l / (i + r), i) {
      case n:
        o = (t - e) / l + (t < e ? 6 : 0);
        break;
      case t:
        o = (e - n) / l + 2;
        break;
      case e:
        o = (n - t) / l + 4;
        break;
    }
    o /= 6;
  }
  return [Math.round(o * 360), Math.round(a * 100), Math.round(h * 100), s];
}, zi = (n = "1") => parseFloat(n) / (n.endsWith("%") ? 100 : 1), Re = (n) => Math.min(Math.round(n), 255).toString(16).toUpperCase().padStart(2, "0"), Ni = ([
  n,
  t,
  e,
  s = 1
]) => {
  const i = Math.round(n * 0.3 + t * 0.59 + e * 0.11);
  return [i, i, i, s];
};
class E {
  isUnrecognised = !1;
  /**
   *
   * @param {string} [color] optional in hex or rgb(a) or hsl format or from known color list
   */
  constructor(t) {
    if (!t)
      this.setSource([0, 0, 0, 1]);
    else if (t instanceof E)
      this.setSource([...t._source]);
    else if (Array.isArray(t)) {
      const [e, s, i, r = 1] = t;
      this.setSource([e, s, i, r]);
    } else
      this.setSource(this._tryParsingColor(t));
  }
  /**
   * @private
   * @param {string} [color] Color value to parse
   * @returns {TRGBAColorSource}
   */
  _tryParsingColor(t) {
    return t = t.toLowerCase(), t in Gi && (t = Gi[t]), t === "transparent" ? [255, 255, 255, 0] : E.sourceFromHex(t) || E.sourceFromRgb(t) || E.sourceFromHsl(t) || // color is not recognized
    // we default to black as canvas does
    // eslint-disable-next-line no-constant-binary-expression
    (this.isUnrecognised = !0) && [0, 0, 0, 1];
  }
  /**
   * Returns source of this color (where source is an array representation; ex: [200, 200, 100, 1])
   * @return {TRGBAColorSource}
   */
  getSource() {
    return this._source;
  }
  /**
   * Sets source of this color (where source is an array representation; ex: [200, 200, 100, 1])
   * @param {TRGBAColorSource} source
   */
  setSource(t) {
    this._source = t;
  }
  /**
   * Returns color representation in RGB format
   * @return {String} ex: rgb(0-255,0-255,0-255)
   */
  toRgb() {
    const [t, e, s] = this.getSource();
    return `rgb(${t},${e},${s})`;
  }
  /**
   * Returns color representation in RGBA format
   * @return {String} ex: rgba(0-255,0-255,0-255,0-1)
   */
  toRgba() {
    return `rgba(${this.getSource().join(",")})`;
  }
  /**
   * Returns color representation in HSL format
   * @return {String} ex: hsl(0-360,0%-100%,0%-100%)
   */
  toHsl() {
    const [t, e, s] = Hi(...this.getSource());
    return `hsl(${t},${e}%,${s}%)`;
  }
  /**
   * Returns color representation in HSLA format
   * @return {String} ex: hsla(0-360,0%-100%,0%-100%,0-1)
   */
  toHsla() {
    const [t, e, s, i] = Hi(...this.getSource());
    return `hsla(${t},${e}%,${s}%,${i})`;
  }
  /**
   * Returns color representation in HEX format
   * @return {String} ex: FF5555
   */
  toHex() {
    return this.toHexa().slice(0, 6);
  }
  /**
   * Returns color representation in HEXA format
   * @return {String} ex: FF5555CC
   */
  toHexa() {
    const [t, e, s, i] = this.getSource();
    return `${Re(t)}${Re(e)}${Re(s)}${Re(Math.round(i * 255))}`;
  }
  /**
   * Gets value of alpha channel for this color
   * @return {Number} 0-1
   */
  getAlpha() {
    return this.getSource()[3];
  }
  /**
   * Sets value of alpha channel for this color
   * @param {Number} alpha Alpha value 0-1
   * @return {Color} thisArg
   */
  setAlpha(t) {
    return this._source[3] = t, this;
  }
  /**
   * Transforms color to its grayscale representation
   * @return {Color} thisArg
   */
  toGrayscale() {
    return this.setSource(Ni(this.getSource())), this;
  }
  /**
   * Transforms color to its black and white representation
   * @param {Number} threshold
   * @return {Color} thisArg
   */
  toBlackWhite(t) {
    const [e, , , s] = Ni(this.getSource()), i = e < (t || 127) ? 0 : 255;
    return this.setSource([i, i, i, s]), this;
  }
  /**
   * Overlays color with another color
   * @param {String|Color} otherColor
   * @return {Color} thisArg
   */
  overlayWith(t) {
    t instanceof E || (t = new E(t));
    const e = this.getSource(), s = 0.5, i = t.getSource(), [r, o, a] = e.map(
      (h, l) => Math.round(h * (1 - s) + i[l] * s)
    );
    return this.setSource([r, o, a, e[3]]), this;
  }
  /**
   * Returns new color object, when given a color in RGB format
   * @param {String} color Color value ex: rgb(0-255,0-255,0-255)
   * @return {Color}
   */
  static fromRgb(t) {
    return E.fromRgba(t);
  }
  /**
   * Returns new color object, when given a color in RGBA format
   * @param {String} color
   * @return {Color}
   */
  static fromRgba(t) {
    return new E(E.sourceFromRgb(t));
  }
  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in RGB or RGBA format
   * @param {String} color Color value ex: rgb(0-255,0-255,0-255), rgb(0%-100%,0%-100%,0%-100%)
   * @return {TRGBAColorSource | undefined} source
   */
  static sourceFromRgb(t) {
    const e = qe(t).match(Yo());
    if (e) {
      const [s, i, r] = e.slice(1, 4).map((o) => {
        const a = parseFloat(o);
        return o.endsWith("%") ? Math.round(a * 2.55) : a;
      });
      return [s, i, r, zi(e[4])];
    }
  }
  /**
   * Returns new color object, when given a color in HSL format
   * @param {String} color Color value ex: hsl(0-260,0%-100%,0%-100%)
   * @return {Color}
   */
  static fromHsl(t) {
    return E.fromHsla(t);
  }
  /**
   * Returns new color object, when given a color in HSLA format
   * @param {String} color
   * @return {Color}
   */
  static fromHsla(t) {
    return new E(E.sourceFromHsl(t));
  }
  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HSL or HSLA format.
   * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
   * @param {String} color Color value ex: hsl(0-360,0%-100%,0%-100%) or hsla(0-360,0%-100%,0%-100%, 0-1)
   * @return {TRGBAColorSource | undefined} source
   * @see http://http://www.w3.org/TR/css3-color/#hsl-color
   */
  static sourceFromHsl(t) {
    const e = qe(t).match(Vo());
    if (!e)
      return;
    const i = (E.parseAngletoDegrees(e[1]) % 360 + 360) % 360 / 360, r = parseFloat(e[2]) / 100, o = parseFloat(e[3]) / 100;
    let a, h, l;
    if (r === 0)
      a = h = l = o;
    else {
      const c = o <= 0.5 ? o * (r + 1) : o + r - o * r, u = o * 2 - c;
      a = ks(u, c, i + 1 / 3), h = ks(u, c, i), l = ks(u, c, i - 1 / 3);
    }
    return [
      Math.round(a * 255),
      Math.round(h * 255),
      Math.round(l * 255),
      zi(e[4])
    ];
  }
  /**
   * Returns new color object, when given a color in HEX format
   * @param {String} color Color value ex: FF5555
   * @return {Color}
   */
  static fromHex(t) {
    return new E(E.sourceFromHex(t));
  }
  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HEX format
   * @param {String} color ex: FF5555 or FF5544CC (RGBa)
   * @return {TRGBAColorSource | undefined} source
   */
  static sourceFromHex(t) {
    if (t.match(Xo())) {
      const e = t.slice(t.indexOf("#") + 1), s = e.length <= 4;
      let i;
      s ? i = e.split("").map((l) => l + l) : i = e.match(/.{2}/g);
      const [r, o, a, h = 255] = i.map(
        (l) => parseInt(l, 16)
      );
      return [r, o, a, h / 255];
    }
  }
  /**
   * Converts a string that could be any angle notation (50deg, 0.5turn, 2rad)
   * into degrees without the 'deg' suffix
   * @param {String} value ex: 0deg, 0.5turn, 2rad
   * @return {Number} number in degrees or NaN if inputs are invalid
   */
  static parseAngletoDegrees(t) {
    const e = t.toLowerCase(), s = parseFloat(e);
    return e.includes("rad") ? Pt(s) : e.includes("turn") ? s * 360 : s;
  }
}
const $o = (n) => {
  const t = ["instantiated_by_use", "style", "id", "class"];
  switch (n) {
    case "linearGradient":
      return t.concat([
        "x1",
        "y1",
        "x2",
        "y2",
        "gradientUnits",
        "gradientTransform"
      ]);
    case "radialGradient":
      return t.concat([
        "gradientUnits",
        "gradientTransform",
        "cx",
        "cy",
        "r",
        "fx",
        "fy",
        "fr"
      ]);
    case "stop":
      return t.concat(["offset", "stop-color", "stop-opacity"]);
  }
  return t;
}, U = (n, t = si) => {
  const e = /\D{0,2}$/.exec(n), s = parseFloat(n), i = M.DPI;
  switch (e?.[0]) {
    case "mm":
      return s * i / 25.4;
    case "cm":
      return s * i / 2.54;
    case "in":
      return s * i;
    case "pt":
      return s * i / 72;
    // or * 4 / 3
    case "pc":
      return s * i / 72 * 12;
    // or * 16
    case "em":
      return s * t;
    default:
      return s;
  }
}, Wo = (n) => n && n !== K ? [n.slice(1, 4), n.slice(5, 8)] : n === K ? [n, n] : ["Mid", "Mid"], yi = (n) => {
  const [t, e] = n.trim().split(" "), [s, i] = Wo(t);
  return {
    meetOrSlice: e || "meet",
    alignX: s,
    alignY: i
  };
}, Oe = (n, t, e = !0) => {
  let s, i;
  if (!t)
    s = "none";
  else if (t.toLive)
    s = `url(#SVGID_${t.id})`;
  else {
    const r = new E(t), o = r.getAlpha();
    s = r.toRgb(), o !== 1 && (i = o.toString());
  }
  return e ? `${n}: ${s}; ${i ? `${n}-opacity: ${i}; ` : ""}` : `${n}="${s}" ${i ? `${n}-opacity="${i}" ` : ""}`;
}, Go = (n, { left: t, top: e, width: s, height: i }, r = M.NUM_FRACTION_DIGITS) => {
  const o = Oe(X, n, !1), [a, h, l, c] = [t, e, s, i].map(
    (u) => F(u, r)
  );
  return `<rect ${o} x="${a}" y="${h}" width="${l}" height="${c}"></rect>`;
};
class $r {
  /**
   * Returns styles-string for svg-export
   * @param {Boolean} skipShadow a boolean to skip shadow filter output
   * @return {String}
   */
  getSvgStyles(t) {
    const e = this.fillRule ? this.fillRule : "nonzero", s = this.strokeWidth ? this.strokeWidth : "0", i = this.strokeDashArray ? this.strokeDashArray.join(" ") : K, r = this.strokeDashOffset ? this.strokeDashOffset : "0", o = this.strokeLineCap ? this.strokeLineCap : "butt", a = this.strokeLineJoin ? this.strokeLineJoin : "miter", h = this.strokeMiterLimit ? this.strokeMiterLimit : "4", l = typeof this.opacity < "u" ? this.opacity : "1", c = this.visible ? "" : " visibility: hidden;", u = t ? "" : this.getSvgFilter(), f = Oe(X, this.fill);
    return [
      Oe(H, this.stroke),
      "stroke-width: ",
      s,
      "; ",
      "stroke-dasharray: ",
      i,
      "; ",
      "stroke-linecap: ",
      o,
      "; ",
      "stroke-dashoffset: ",
      r,
      "; ",
      "stroke-linejoin: ",
      a,
      "; ",
      "stroke-miterlimit: ",
      h,
      "; ",
      f,
      "fill-rule: ",
      e,
      "; ",
      "opacity: ",
      l,
      ";",
      u,
      c
    ].join("");
  }
  /**
   * Returns filter for svg shadow
   * @return {String}
   */
  getSvgFilter() {
    return this.shadow ? `filter: url(#SVGID_${this.shadow.id});` : "";
  }
  /**
   * Returns id attribute for svg output
   * @return {String}
   */
  getSvgCommons() {
    return [
      this.id ? `id="${this.id}" ` : "",
      this.clipPath ? `clip-path="url(#${this.clipPath.clipPathId})" ` : ""
    ].join("");
  }
  /**
   * Returns transform-string for svg-export
   * @param {Boolean} use the full transform or the single object one.
   * @return {String}
   */
  getSvgTransform(t, e = "") {
    const s = t ? this.calcTransformMatrix() : this.calcOwnMatrix();
    return `${`transform="${he(s)}`}${e}" `;
  }
  /**
   * Returns svg representation of an instance
   * This function is implemented in each subclass
   * This is just because typescript otherwise cryies all the time
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG(t) {
    return [""];
  }
  /**
   * Returns svg representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toSVG(t) {
    return this._createBaseSVGMarkup(this._toSVG(t), {
      reviver: t
    });
  }
  /**
   * Returns svg clipPath representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toClipPathSVG(t) {
    return "	" + this._createBaseClipPathSVGMarkup(this._toSVG(t), {
      reviver: t
    });
  }
  /**
   * @private
   */
  _createBaseClipPathSVGMarkup(t, {
    reviver: e,
    additionalTransform: s = ""
  } = {}) {
    const i = [
      this.getSvgTransform(!0, s),
      this.getSvgCommons()
    ].join(""), r = t.indexOf("COMMON_PARTS");
    return t[r] = i, e ? e(t.join("")) : t.join("");
  }
  /**
   * @private
   */
  _createBaseSVGMarkup(t, {
    noStyle: e,
    reviver: s,
    withShadow: i,
    additionalTransform: r
  } = {}) {
    const o = e ? "" : `style="${this.getSvgStyles()}" `, a = i ? `style="${this.getSvgFilter()}" ` : "", h = this.clipPath, l = this.strokeUniform ? 'vector-effect="non-scaling-stroke" ' : "", c = h && h.absolutePositioned, u = this.stroke, f = this.fill, d = this.shadow, g = [], p = t.indexOf("COMMON_PARTS");
    let _;
    h && (h.clipPathId = `CLIPPATH_${jt()}`, _ = `<clipPath id="${h.clipPathId}" >
${h.toClipPathSVG(s)}</clipPath>
`), c && g.push("<g ", a, this.getSvgCommons(), ` >
`), g.push(
      "<g ",
      this.getSvgTransform(!1),
      c ? "" : a + this.getSvgCommons(),
      ` >
`
    );
    const y = [
      o,
      l,
      e ? "" : this.addPaintOrder(),
      " ",
      r ? `transform="${r}" ` : ""
    ].join("");
    return t[p] = y, ct(f) && g.push(f.toSVG(this)), ct(u) && g.push(u.toSVG(this)), d && g.push(d.toSVG(this)), h && g.push(_), g.push(t.join("")), g.push(`</g>
`), c && g.push(`</g>
`), s ? s(g.join("")) : g.join("");
  }
  addPaintOrder() {
    return this.paintFirst !== X ? ` paint-order="${this.paintFirst}" ` : "";
  }
}
function ys(n) {
  return new RegExp("^(" + n.join("|") + ")\\b", "i");
}
const Ht = "textDecorationThickness", Wr = [
  "fontSize",
  "fontWeight",
  "fontFamily",
  "fontStyle"
], Gr = [
  "underline",
  "overline",
  "linethrough"
], Hr = [
  ...Wr,
  "lineHeight",
  "text",
  "charSpacing",
  "textAlign",
  "styles",
  "path",
  "pathStartOffset",
  "pathSide",
  "pathAlign"
], Ui = [
  ...Hr,
  ...Gr,
  "textBackgroundColor",
  "direction",
  Ht
], Ho = [
  ...Wr,
  ...Gr,
  H,
  "strokeWidth",
  X,
  "deltaY",
  "textBackgroundColor",
  Ht
], zo = {
  _reNewline: ii,
  _reSpacesAndTabs: /[ \t\r]/g,
  _reSpaceAndTab: /[ \t\r]/,
  _reWords: /\S+/g,
  fontSize: 40,
  fontWeight: "normal",
  fontFamily: "Times New Roman",
  underline: !1,
  overline: !1,
  linethrough: !1,
  textAlign: P,
  fontStyle: "normal",
  lineHeight: 1.16,
  textBackgroundColor: "",
  stroke: null,
  shadow: null,
  path: void 0,
  pathStartOffset: 0,
  pathSide: P,
  pathAlign: "baseline",
  charSpacing: 0,
  deltaY: 0,
  direction: "ltr",
  CACHE_FONT_SIZE: 400,
  MIN_TEXT_WIDTH: 2,
  // Text magic numbers
  superscript: {
    size: 0.6,
    // fontSize factor
    baseline: -0.35
    // baseline-shift factor (upwards)
  },
  subscript: {
    size: 0.6,
    // fontSize factor
    baseline: 0.11
    // baseline-shift factor (downwards)
  },
  _fontSizeFraction: 0.222,
  offsets: {
    underline: 0.1,
    linethrough: -0.28167,
    // added 1/30 to original number
    overline: -0.81333
    // added 1/15 to original number
  },
  _fontSizeMult: 1.13,
  [Ht]: 66.667
  // before implementation was 1/15
}, St = "justify", Ke = "justify-left", we = "justify-right", xe = "justify-center", mt = String.raw`[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?`, Ms = String.raw`(?:\s*,?\s+|\s*,\s*)`, Ws = "http://www.w3.org/2000/svg", No = new RegExp(
  "(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + mt + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + mt + "))?\\s+(.*)"
), Uo = [
  "path",
  "circle",
  "polygon",
  "polyline",
  "ellipse",
  "rect",
  "line",
  "image",
  "text"
], qo = ["symbol", "image", "marker", "pattern", "view", "svg"], Ko = [
  "pattern",
  "defs",
  "symbol",
  "metadata",
  "clipPath",
  "mask",
  "desc"
], Jo = ["symbol", "g", "a", "svg", "clipPath", "defs"], Qo = {
  cx: P,
  x: P,
  r: "radius",
  cy: it,
  y: it,
  display: "visible",
  visibility: "visible",
  transform: "transformMatrix",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-style": "fontStyle",
  "font-weight": "fontWeight",
  "letter-spacing": "charSpacing",
  "paint-order": "paintFirst",
  "stroke-dasharray": "strokeDashArray",
  "stroke-dashoffset": "strokeDashOffset",
  "stroke-linecap": "strokeLineCap",
  "stroke-linejoin": "strokeLineJoin",
  "stroke-miterlimit": "strokeMiterLimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  "text-decoration": "textDecoration",
  "text-anchor": "textAnchor",
  opacity: "opacity",
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "vector-effect": "strokeUniform",
  "image-rendering": "imageSmoothing",
  "text-decoration-thickness": Ht
}, Ps = "font-size", Es = "clip-path", Zo = ys(Uo), ta = ys(qo), qi = ys(Jo), Ki = new RegExp(
  String.raw`^\s*(${mt})${Ms}(${mt})${Ms}(${mt})${Ms}(${mt})\s*$`
), Ji = "(-?\\d+(?:\\.\\d*)?(?:px)?(?:\\s?|$))?", Qi = new RegExp(
  "(?:\\s|^)" + Ji + Ji + "(" + mt + "?(?:px)?)?(?:\\s?|$)(?:$|\\s)"
), ea = {
  color: "rgb(0,0,0)",
  blur: 0,
  offsetX: 0,
  offsetY: 0,
  affectStroke: !1,
  includeDefaultValues: !0,
  nonScaling: !1
};
class xt {
  static ownDefaults = ea;
  static type = "shadow";
  constructor(t = {}) {
    const e = typeof t == "string" ? xt.parseShadow(t) : t;
    Object.assign(this, xt.ownDefaults, e), this.id = jt();
  }
  /**
   * @param {String} value Shadow value to parse
   * @return {Object} Shadow object with color, offsetX, offsetY and blur
   */
  static parseShadow(t) {
    const e = t.trim(), [, s = 0, i = 0, r = 0] = (Qi.exec(e) || []).map((a) => parseFloat(a) || 0);
    return {
      color: (e.replace(Qi, "") || "rgb(0,0,0)").trim(),
      offsetX: s,
      offsetY: i,
      blur: r
    };
  }
  /**
   * Returns a string representation of an instance
   * @see http://www.w3.org/TR/css-text-decor-3/#text-shadow
   * @return {String} Returns CSS3 text-shadow declaration
   */
  toString() {
    return [this.offsetX, this.offsetY, this.blur, this.color].join("px ");
  }
  /**
   * Returns SVG representation of a shadow
   * @param {FabricObject} object
   * @return {String} SVG representation of a shadow
   */
  toSVG(t) {
    const e = gi(
      new m(this.offsetX, this.offsetY),
      I(-t.angle)
    ), s = 20, i = new E(this.color);
    let r = 40, o = 40;
    return t.width && t.height && (r = F(
      (Math.abs(e.x) + this.blur) / t.width,
      M.NUM_FRACTION_DIGITS
    ) * 100 + s, o = F(
      (Math.abs(e.y) + this.blur) / t.height,
      M.NUM_FRACTION_DIGITS
    ) * 100 + s), t.flipX && (e.x *= -1), t.flipY && (e.y *= -1), `<filter id="SVGID_${this.id}" y="-${o}%" height="${100 + 2 * o}%" x="-${r}%" width="${100 + 2 * r}%" >
	<feGaussianBlur in="SourceAlpha" stdDeviation="${F(
      this.blur ? this.blur / 2 : 0,
      M.NUM_FRACTION_DIGITS
    )}"></feGaussianBlur>
	<feOffset dx="${F(
      e.x,
      M.NUM_FRACTION_DIGITS
    )}" dy="${F(
      e.y,
      M.NUM_FRACTION_DIGITS
    )}" result="oBlur" ></feOffset>
	<feFlood flood-color="${i.toRgb()}" flood-opacity="${i.getAlpha()}"/>
	<feComposite in2="oBlur" operator="in" />
	<feMerge>
		<feMergeNode></feMergeNode>
		<feMergeNode in="SourceGraphic"></feMergeNode>
	</feMerge>
</filter>
`;
  }
  /**
   * Returns object representation of a shadow
   * @return {Object} Object representation of a shadow instance
   */
  toObject() {
    const t = {
      color: this.color,
      blur: this.blur,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      affectStroke: this.affectStroke,
      nonScaling: this.nonScaling,
      type: this.constructor.type
    }, e = xt.ownDefaults;
    return this.includeDefaultValues ? t : ci(t, (s, i) => s !== e[i]);
  }
  static async fromObject(t) {
    return new this(t);
  }
}
x.setClass(xt, "shadow");
const zt = (n, t, e) => Math.max(n, Math.min(t, e)), sa = [
  it,
  P,
  Q,
  at,
  "flipX",
  "flipY",
  "originX",
  "originY",
  "angle",
  "opacity",
  "globalCompositeOperation",
  "shadow",
  "visible",
  de,
  ge
], At = [
  X,
  H,
  "strokeWidth",
  "strokeDashArray",
  "width",
  "height",
  "paintFirst",
  "strokeUniform",
  "strokeLineCap",
  "strokeDashOffset",
  "strokeLineJoin",
  "strokeMiterLimit",
  "backgroundColor",
  "clipPath"
], ia = {
  // see composeMatrix() to see order of transforms. First defaults listed based on this
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  angle: 0,
  flipX: !1,
  flipY: !1,
  scaleX: 1,
  scaleY: 1,
  minScaleLimit: 0,
  skewX: 0,
  skewY: 0,
  originX: T,
  originY: T,
  strokeWidth: 1,
  strokeUniform: !1,
  padding: 0,
  opacity: 1,
  paintFirst: X,
  fill: "rgb(0,0,0)",
  fillRule: "nonzero",
  stroke: null,
  strokeDashArray: null,
  strokeDashOffset: 0,
  strokeLineCap: "butt",
  strokeLineJoin: "miter",
  strokeMiterLimit: 4,
  globalCompositeOperation: "source-over",
  backgroundColor: "",
  shadow: null,
  visible: !0,
  includeDefaultValues: !0,
  excludeFromExport: !1,
  objectCaching: !0,
  clipPath: void 0,
  inverted: !1,
  absolutePositioned: !1,
  centeredRotation: !0,
  centeredScaling: !1,
  dirty: !0
}, ra = {
  noScaleCache: !0,
  lockMovementX: !1,
  lockMovementY: !1,
  lockRotation: !1,
  lockScalingX: !1,
  lockScalingY: !1,
  lockSkewingX: !1,
  lockSkewingY: !1,
  lockScalingFlip: !1,
  cornerSize: 13,
  touchCornerSize: 24,
  transparentCorners: !0,
  cornerColor: "rgb(178,204,255)",
  cornerStrokeColor: "",
  cornerStyle: "rect",
  cornerDashArray: null,
  hasControls: !0,
  borderColor: "rgb(178,204,255)",
  borderDashArray: null,
  borderOpacityWhenMoving: 0.4,
  borderScaleFactor: 1,
  hasBorders: !0,
  selectionBackgroundColor: "",
  selectable: !0,
  evented: !0,
  perPixelTargetFind: !1,
  activeOn: "down",
  hoverCursor: null,
  moveCursor: null
}, vi = (n, t, e, s) => (n < Math.abs(t) ? (n = t, s = e / 4) : t === 0 && n === 0 ? s = e / yt * Math.asin(1) : s = e / yt * Math.asin(t / n), { a: n, c: t, p: e, s }), zr = (n, t, e, s, i) => n * Math.pow(2, 10 * (s -= 1)) * Math.sin((s * i - t) * yt / e), Nr = (n, t, e, s) => -e * Math.cos(n / s * Bt) + e + t, na = (n, t, e, s) => e * (n / s) ** 3 + t, oa = (n, t, e, s) => e * ((n / s - 1) ** 3 + 1) + t, aa = (n, t, e, s) => (n /= s / 2, n < 1 ? e / 2 * n ** 3 + t : e / 2 * ((n - 2) ** 3 + 2) + t), ha = (n, t, e, s) => e * (n /= s) * n ** 3 + t, la = (n, t, e, s) => -e * ((n = n / s - 1) * n ** 3 - 1) + t, ca = (n, t, e, s) => (n /= s / 2, n < 1 ? e / 2 * n ** 4 + t : -e / 2 * ((n -= 2) * n ** 3 - 2) + t), ua = (n, t, e, s) => e * (n / s) ** 5 + t, fa = (n, t, e, s) => e * ((n / s - 1) ** 5 + 1) + t, da = (n, t, e, s) => (n /= s / 2, n < 1 ? e / 2 * n ** 5 + t : e / 2 * ((n - 2) ** 5 + 2) + t), ga = (n, t, e, s) => -e * Math.cos(n / s * Bt) + e + t, pa = (n, t, e, s) => e * Math.sin(n / s * Bt) + t, ma = (n, t, e, s) => -e / 2 * (Math.cos(Math.PI * n / s) - 1) + t, _a = (n, t, e, s) => n === 0 ? t : e * 2 ** (10 * (n / s - 1)) + t, ya = (n, t, e, s) => n === s ? t + e : e * -(2 ** (-10 * n / s) + 1) + t, va = (n, t, e, s) => n === 0 ? t : n === s ? t + e : (n /= s / 2, n < 1 ? e / 2 * 2 ** (10 * (n - 1)) + t : e / 2 * -(2 ** (-10 * --n) + 2) + t), Ca = (n, t, e, s) => -e * (Math.sqrt(1 - (n /= s) * n) - 1) + t, Sa = (n, t, e, s) => e * Math.sqrt(1 - (n = n / s - 1) * n) + t, wa = (n, t, e, s) => (n /= s / 2, n < 1 ? -e / 2 * (Math.sqrt(1 - n ** 2) - 1) + t : e / 2 * (Math.sqrt(1 - (n -= 2) * n) + 1) + t), xa = (n, t, e, s) => {
  const r = e;
  let o = 0;
  if (n === 0)
    return t;
  if (n /= s, n === 1)
    return t + e;
  o || (o = s * 0.3);
  const { a, s: h, p: l } = vi(r, e, o, 1.70158);
  return -zr(a, h, l, n, s) + t;
}, ba = (n, t, e, s) => {
  const r = e;
  let o = 0;
  if (n === 0)
    return t;
  if (n /= s, n === 1)
    return t + e;
  o || (o = s * 0.3);
  const { a, s: h, p: l, c } = vi(r, e, o, 1.70158);
  return a * 2 ** (-10 * n) * Math.sin((n * s - h) * yt / l) + c + t;
}, Ta = (n, t, e, s) => {
  const r = e;
  let o = 0;
  if (n === 0)
    return t;
  if (n /= s / 2, n === 2)
    return t + e;
  o || (o = s * (0.3 * 1.5));
  const { a, s: h, p: l, c } = vi(r, e, o, 1.70158);
  return n < 1 ? -0.5 * zr(a, h, l, n, s) + t : a * Math.pow(2, -10 * (n -= 1)) * Math.sin((n * s - h) * yt / l) * 0.5 + c + t;
}, Oa = (n, t, e, s, i = 1.70158) => e * (n /= s) * n * ((i + 1) * n - i) + t, Da = (n, t, e, s, i = 1.70158) => e * ((n = n / s - 1) * n * ((i + 1) * n + i) + 1) + t, ka = (n, t, e, s, i = 1.70158) => (n /= s / 2, n < 1 ? e / 2 * (n * n * (((i *= 1.525) + 1) * n - i)) + t : e / 2 * ((n -= 2) * n * (((i *= 1.525) + 1) * n + i) + 2) + t), Ci = (n, t, e, s) => (n /= s) < 1 / 2.75 ? e * (7.5625 * n * n) + t : n < 2 / 2.75 ? e * (7.5625 * (n -= 1.5 / 2.75) * n + 0.75) + t : n < 2.5 / 2.75 ? e * (7.5625 * (n -= 2.25 / 2.75) * n + 0.9375) + t : e * (7.5625 * (n -= 2.625 / 2.75) * n + 0.984375) + t, Ur = (n, t, e, s) => e - Ci(s - n, 0, e, s) + t, Ma = (n, t, e, s) => n < s / 2 ? Ur(n * 2, 0, e, s) * 0.5 + t : Ci(n * 2 - s, 0, e, s) * 0.5 + e * 0.5 + t, Pa = (n, t, e, s) => e * (n /= s) * n + t, Ea = (n, t, e, s) => -e * (n /= s) * (n - 2) + t, Aa = (n, t, e, s) => (n /= s / 2, n < 1 ? e / 2 * n ** 2 + t : -e / 2 * (--n * (n - 2) - 1) + t), Fa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  defaultEasing: Nr,
  easeInBack: Oa,
  easeInBounce: Ur,
  easeInCirc: Ca,
  easeInCubic: na,
  easeInElastic: xa,
  easeInExpo: _a,
  easeInOutBack: ka,
  easeInOutBounce: Ma,
  easeInOutCirc: wa,
  easeInOutCubic: aa,
  easeInOutElastic: Ta,
  easeInOutExpo: va,
  easeInOutQuad: Aa,
  easeInOutQuart: ca,
  easeInOutQuint: da,
  easeInOutSine: ma,
  easeInQuad: Pa,
  easeInQuart: ha,
  easeInQuint: ua,
  easeInSine: ga,
  easeOutBack: Da,
  easeOutBounce: Ci,
  easeOutCirc: Sa,
  easeOutCubic: oa,
  easeOutElastic: ba,
  easeOutExpo: ya,
  easeOutQuad: Ea,
  easeOutQuart: la,
  easeOutQuint: fa,
  easeOutSine: pa
}, Symbol.toStringTag, { value: "Module" })), La = () => !1;
class Si {
  _state = "pending";
  /**
   * Time %, or the ratio of `timeElapsed / duration`
   * @see tick
   */
  durationProgress = 0;
  /**
   * Value %, or the ratio of `(currentValue - startValue) / (endValue - startValue)`
   */
  valueProgress = 0;
  constructor({
    startValue: t,
    byValue: e,
    duration: s = 500,
    delay: i = 0,
    easing: r = Nr,
    onStart: o = Be,
    onChange: a = Be,
    onComplete: h = Be,
    abort: l = La,
    target: c
  }) {
    this.tick = this.tick.bind(this), this.duration = s, this.delay = i, this.easing = r, this._onStart = o, this._onChange = a, this._onComplete = h, this._abort = l, this.target = c, this.startValue = t, this.byValue = e, this.value = this.startValue, this.endValue = Object.freeze(this.calculate(this.duration).value);
  }
  get state() {
    return this._state;
  }
  isDone() {
    return this._state === "aborted" || this._state === "completed";
  }
  start() {
    const t = (e) => {
      this._state === "pending" && (this.startTime = e || +/* @__PURE__ */ new Date(), this._state = "running", this._onStart(), this.tick(this.startTime));
    };
    this.register(), this.delay > 0 ? setTimeout(() => Ce(t), this.delay) : Ce(t);
  }
  tick(t) {
    const e = (t || +/* @__PURE__ */ new Date()) - this.startTime, s = Math.min(e, this.duration);
    this.durationProgress = s / this.duration;
    const { value: i, valueProgress: r } = this.calculate(s);
    this.value = Object.freeze(i), this.valueProgress = r, this._state !== "aborted" && (this._abort(this.value, this.valueProgress, this.durationProgress) ? (this._state = "aborted", this.unregister()) : e >= this.duration ? (this.durationProgress = this.valueProgress = 1, this._onChange(this.endValue, this.valueProgress, this.durationProgress), this._state = "completed", this._onComplete(
      this.endValue,
      this.valueProgress,
      this.durationProgress
    ), this.unregister()) : (this._onChange(this.value, this.valueProgress, this.durationProgress), Ce(this.tick)));
  }
  register() {
    Ge.push(this);
  }
  unregister() {
    Ge.remove(this);
  }
  abort() {
    this._state = "aborted", this.unregister();
  }
}
class Ra extends Si {
  constructor({
    startValue: t = 0,
    endValue: e = 100,
    ...s
  }) {
    super({
      ...s,
      startValue: t,
      byValue: e - t
    });
  }
  calculate(t) {
    const e = this.easing(
      t,
      this.startValue,
      this.byValue,
      this.duration
    );
    return {
      value: e,
      valueProgress: Math.abs((e - this.startValue) / this.byValue)
    };
  }
}
class ja extends Si {
  constructor({
    startValue: t = [0],
    endValue: e = [100],
    ...s
  }) {
    super({
      ...s,
      startValue: t,
      byValue: e.map((i, r) => i - t[r])
    });
  }
  calculate(t) {
    const e = this.startValue.map(
      (s, i) => this.easing(t, s, this.byValue[i], this.duration, i)
    );
    return {
      value: e,
      valueProgress: Math.abs(
        (e[0] - this.startValue[0]) / this.byValue[0]
      )
    };
  }
}
const Ba = (n, t, e, s) => {
  const i = 1 - Math.cos(n / s * Bt);
  return t + e * i;
}, As = (n) => n && ((t, e, s) => n(new E(t).toRgba(), e, s));
class Ia extends Si {
  constructor({
    startValue: t,
    endValue: e,
    easing: s = Ba,
    onChange: i,
    onComplete: r,
    abort: o,
    ...a
  }) {
    const h = new E(t).getSource(), l = new E(e).getSource();
    super({
      ...a,
      startValue: h,
      byValue: l.map(
        (c, u) => c - h[u]
      ),
      easing: s,
      onChange: As(i),
      onComplete: As(r),
      abort: As(o)
    });
  }
  calculate(t) {
    const [e, s, i, r] = this.startValue.map(
      (a, h) => this.easing(t, a, this.byValue[h], this.duration, h)
    ), o = [
      ...[e, s, i].map(Math.round),
      zt(0, r, 1)
    ];
    return {
      value: o,
      valueProgress: (
        // to correctly calculate the change ratio we must find a changed value
        o.map(
          (a, h) => this.byValue[h] !== 0 ? Math.abs((a - this.startValue[h]) / this.byValue[h]) : 0
        ).find((a) => a !== 0) || 0
      )
    };
  }
}
const Ya = (n) => Array.isArray(n.startValue) || Array.isArray(n.endValue);
function wi(n) {
  const t = Ya(n) ? new ja(n) : new Ra(n);
  return t.start(), t;
}
function qr(n) {
  const t = new Ia(n);
  return t.start(), t;
}
class j {
  constructor(t) {
    this.status = t, this.points = [];
  }
  /**
   * Used to verify if a point is alredy in the collection
   * @param {Point} point
   * @returns {boolean}
   */
  includes(t) {
    return this.points.some((e) => e.eq(t));
  }
  /**
   * Appends points of intersection
   * @param {...Point[]} points
   * @return {Intersection} thisArg
   */
  append(...t) {
    return this.points = this.points.concat(
      t.filter((e) => !this.includes(e))
    ), this;
  }
  /**
   * check if point T is on the segment or line defined between A and B
   *
   * @param {Point} T the point we are checking for
   * @param {Point} A one extremity of the segment
   * @param {Point} B the other extremity of the segment
   * @param [infinite] if true checks if `T` is on the line defined by `A` and `B`
   * @returns true if `T` is contained
   */
  static isPointContained(t, e, s, i = !1) {
    if (e.eq(s))
      return t.eq(e);
    if (e.x === s.x)
      return t.x === e.x && (i || t.y >= Math.min(e.y, s.y) && t.y <= Math.max(e.y, s.y));
    if (e.y === s.y)
      return t.y === e.y && (i || t.x >= Math.min(e.x, s.x) && t.x <= Math.max(e.x, s.x));
    {
      const r = Te(e, s), a = Te(e, t).divide(r);
      return i ? Math.abs(a.x) === Math.abs(a.y) : a.x === a.y && a.x >= 0 && a.x <= 1;
    }
  }
  /**
   * Use the ray casting algorithm to determine if point is in the polygon defined by points
   * @see https://en.wikipedia.org/wiki/Point_in_polygon
   * @param point
   * @param points polygon points
   * @returns
   */
  static isPointInPolygon(t, e) {
    const s = new m(t).setX(
      Math.min(t.x - 1, ...e.map((r) => r.x))
    );
    let i = 0;
    for (let r = 0; r < e.length; r++) {
      const o = this.intersectSegmentSegment(
        // polygon side
        e[r],
        e[(r + 1) % e.length],
        // ray
        t,
        s
      );
      if (o.includes(t))
        return !0;
      i += +(o.status === "Intersection");
    }
    return i % 2 === 1;
  }
  /**
   * Checks if a line intersects another
   * @see {@link https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection line intersection}
   * @see {@link https://en.wikipedia.org/wiki/Cramer%27s_rule Cramer's rule}
   * @param {Point} a1
   * @param {Point} a2
   * @param {Point} b1
   * @param {Point} b2
   * @param {boolean} [aInfinite=true] check segment intersection by passing `false`
   * @param {boolean} [bInfinite=true] check segment intersection by passing `false`
   * @return {Intersection}
   */
  static intersectLineLine(t, e, s, i, r = !0, o = !0) {
    const a = e.x - t.x, h = e.y - t.y, l = i.x - s.x, c = i.y - s.y, u = t.x - s.x, f = t.y - s.y, d = l * f - c * u, g = a * f - h * u, p = c * a - l * h;
    if (p !== 0) {
      const _ = d / p, y = g / p;
      return (r || 0 <= _ && _ <= 1) && (o || 0 <= y && y <= 1) ? new j("Intersection").append(
        new m(t.x + _ * a, t.y + _ * h)
      ) : new j();
    } else if (d === 0 || g === 0) {
      const _ = r || o || j.isPointContained(t, s, i) || j.isPointContained(e, s, i) || j.isPointContained(s, t, e) || j.isPointContained(i, t, e);
      return new j(_ ? "Coincident" : void 0);
    } else
      return new j("Parallel");
  }
  /**
   * Checks if a segment intersects a line
   * @see {@link intersectLineLine} for line intersection
   * @param {Point} s1 boundary point of segment
   * @param {Point} s2 other boundary point of segment
   * @param {Point} l1 point on line
   * @param {Point} l2 other point on line
   * @return {Intersection}
   */
  static intersectSegmentLine(t, e, s, i) {
    return j.intersectLineLine(t, e, s, i, !1, !0);
  }
  /**
   * Checks if a segment intersects another
   * @see {@link intersectLineLine} for line intersection
   * @param {Point} a1 boundary point of segment
   * @param {Point} a2 other boundary point of segment
   * @param {Point} b1 boundary point of segment
   * @param {Point} b2 other boundary point of segment
   * @return {Intersection}
   */
  static intersectSegmentSegment(t, e, s, i) {
    return j.intersectLineLine(t, e, s, i, !1, !1);
  }
  /**
   * Checks if line intersects polygon
   *
   * @todo account for stroke
   *
   * @see {@link intersectSegmentPolygon} for segment intersection
   * @param {Point} a1 point on line
   * @param {Point} a2 other point on line
   * @param {Point[]} points polygon points
   * @param {boolean} [infinite=true] check segment intersection by passing `false`
   * @return {Intersection}
   */
  static intersectLinePolygon(t, e, s, i = !0) {
    const r = new j(), o = s.length;
    for (let a = 0, h, l, c; a < o; a++) {
      if (h = s[a], l = s[(a + 1) % o], c = j.intersectLineLine(t, e, h, l, i, !1), c.status === "Coincident")
        return c;
      r.append(...c.points);
    }
    return r.points.length > 0 && (r.status = "Intersection"), r;
  }
  /**
   * Checks if segment intersects polygon
   * @see {@link intersectLinePolygon} for line intersection
   * @param {Point} a1 boundary point of segment
   * @param {Point} a2 other boundary point of segment
   * @param {Point[]} points polygon points
   * @return {Intersection}
   */
  static intersectSegmentPolygon(t, e, s) {
    return j.intersectLinePolygon(t, e, s, !1);
  }
  /**
   * Checks if polygon intersects another polygon
   *
   * @todo account for stroke
   *
   * @param {Point[]} points1
   * @param {Point[]} points2
   * @return {Intersection}
   */
  static intersectPolygonPolygon(t, e) {
    const s = new j(), i = t.length, r = [];
    for (let o = 0; o < i; o++) {
      const a = t[o], h = t[(o + 1) % i], l = j.intersectSegmentPolygon(a, h, e);
      l.status === "Coincident" ? (r.push(l), s.append(a, h)) : s.append(...l.points);
    }
    return r.length > 0 && r.length === t.length ? new j("Coincident") : (s.points.length > 0 && (s.status = "Intersection"), s);
  }
  /**
   * Checks if polygon intersects rectangle
   * @see {@link intersectPolygonPolygon} for polygon intersection
   * @param {Point[]} points polygon points
   * @param {Point} r1 top left point of rect
   * @param {Point} r2 bottom right point of rect
   * @return {Intersection}
   */
  static intersectPolygonRectangle(t, e, s) {
    const i = e.min(s), r = e.max(s), o = new m(r.x, i.y), a = new m(i.x, r.y);
    return j.intersectPolygonPolygon(t, [
      i,
      o,
      r,
      a
    ]);
  }
}
class Va extends wr {
  /**
   * @returns {number} x position according to object's originX property in canvas coordinate plane
   */
  getX() {
    return this.getXY().x;
  }
  /**
   * @param {number} value x position according to object's originX property in canvas coordinate plane
   */
  setX(t) {
    this.setXY(this.getXY().setX(t));
  }
  /**
   * @returns {number} y position according to object's originY property in canvas coordinate plane
   */
  getY() {
    return this.getXY().y;
  }
  /**
   * @param {number} value y position according to object's originY property in canvas coordinate plane
   */
  setY(t) {
    this.setXY(this.getXY().setY(t));
  }
  /**
   * @returns {number} x position according to object's originX property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link getX}
   */
  getRelativeX() {
    return this.left;
  }
  /**
   * @param {number} value x position according to object's originX property in parent's coordinate plane\
   * if parent is canvas then this method is identical to {@link setX}
   */
  setRelativeX(t) {
    this.left = t;
  }
  /**
   * @returns {number} y position according to object's originY property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link getY}
   */
  getRelativeY() {
    return this.top;
  }
  /**
   * @param {number} value y position according to object's originY property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link setY}
   */
  setRelativeY(t) {
    this.top = t;
  }
  /**
   * @returns {Point} x position according to object's originX originY properties in canvas coordinate plane
   */
  getXY() {
    const t = this.getRelativeXY();
    return this.group ? G(t, this.group.calcTransformMatrix()) : t;
  }
  /**
   * Set an object position to a particular point, the point is intended in absolute ( canvas ) coordinate.
   * You can specify originX and originY values,
   * that otherwise are the object's current values.
   * @example <caption>Set object's bottom left corner to point (5,5) on canvas</caption>
   * object.setXY(new Point(5, 5), 'left', 'bottom').
   * @param {Point} point position in scene coordinate plane
   * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
   */
  setXY(t, e, s) {
    this.group && (t = G(
      t,
      st(this.group.calcTransformMatrix())
    )), this.setRelativeXY(t, e, s);
  }
  /**
   * @returns {Point} x,y position according to object's originX originY properties in parent's coordinate plane
   */
  getRelativeXY() {
    return new m(this.left, this.top);
  }
  /**
   * As {@link setXY}, but in current parent's coordinate plane (the current group if any or the canvas)
   * @param {Point} point position according to object's originX originY properties in parent's coordinate plane
   * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
   */
  setRelativeXY(t, e = this.originX, s = this.originY) {
    this.setPositionByOrigin(t, e, s);
  }
  /**
   * @deprecated intermidiate method to be removed, do not use
   */
  isStrokeAccountedForInDimensions() {
    return !1;
  }
  /**
   * @return {Point[]} [tl, tr, br, bl] in the scene plane
   */
  getCoords() {
    const { tl: t, tr: e, br: s, bl: i } = this.aCoords || (this.aCoords = this.calcACoords()), r = [t, e, s, i];
    if (this.group) {
      const o = this.group.calcTransformMatrix();
      return r.map((a) => G(a, o));
    }
    return r;
  }
  /**
   * Checks if object intersects with the scene rect formed by tl and br
   */
  intersectsWithRect(t, e) {
    return j.intersectPolygonRectangle(
      this.getCoords(),
      t,
      e
    ).status === "Intersection";
  }
  /**
   * Checks if object intersects with another object
   * @param {Object} other Object to test
   * @return {Boolean} true if object intersects with another object
   */
  intersectsWithObject(t) {
    const e = j.intersectPolygonPolygon(
      this.getCoords(),
      t.getCoords()
    );
    return e.status === "Intersection" || e.status === "Coincident" || t.isContainedWithinObject(this) || this.isContainedWithinObject(t);
  }
  /**
   * Checks if object is fully contained within area of another object
   * @param {Object} other Object to test
   * @return {Boolean} true if object is fully contained within area of another object
   */
  isContainedWithinObject(t) {
    return this.getCoords().every((s) => t.containsPoint(s));
  }
  /**
   * Checks if object is fully contained within the scene rect formed by tl and br
   */
  isContainedWithinRect(t, e) {
    const { left: s, top: i, width: r, height: o } = this.getBoundingRect();
    return s >= t.x && s + r <= e.x && i >= t.y && i + o <= e.y;
  }
  isOverlapping(t) {
    return this.intersectsWithObject(t) || this.isContainedWithinObject(t) || t.isContainedWithinObject(this);
  }
  /**
   * Checks if point is inside the object
   * @param {Point} point Point to check against
   * @return {Boolean} true if point is inside the object
   */
  containsPoint(t) {
    return j.isPointInPolygon(t, this.getCoords());
  }
  /**
   * Checks if object is contained within the canvas with current viewportTransform
   * the check is done stopping at first point that appears on screen
   * @return {Boolean} true if object is fully or partially contained within canvas
   */
  isOnScreen() {
    if (!this.canvas)
      return !1;
    const { tl: t, br: e } = this.canvas.vptCoords;
    return this.getCoords().some(
      (i) => i.x <= e.x && i.x >= t.x && i.y <= e.y && i.y >= t.y
    ) || this.intersectsWithRect(t, e) ? !0 : this.containsPoint(t.midPointFrom(e));
  }
  /**
   * Checks if object is partially contained within the canvas with current viewportTransform
   * @return {Boolean} true if object is partially contained within canvas
   */
  isPartiallyOnScreen() {
    if (!this.canvas)
      return !1;
    const { tl: t, br: e } = this.canvas.vptCoords;
    return this.intersectsWithRect(t, e) ? !0 : this.getCoords().every(
      (i) => (i.x >= e.x || i.x <= t.x) && (i.y >= e.y || i.y <= t.y)
    ) && this.containsPoint(t.midPointFrom(e));
  }
  /**
   * Returns coordinates of object's bounding rectangle (left, top, width, height)
   * the box is intended as aligned to axis of canvas.
   * @return {Object} Object with left, top, width, height properties
   */
  getBoundingRect() {
    return wt(this.getCoords());
  }
  /**
   * Returns width of an object's bounding box counting transformations
   * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
   * @return {Number} width value
   */
  getScaledWidth() {
    return this._getTransformedDimensions().x;
  }
  /**
   * Returns height of an object bounding box counting transformations
   * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
   * @return {Number} height value
   */
  getScaledHeight() {
    return this._getTransformedDimensions().y;
  }
  /**
   * Scales an object (equally by x and y)
   * @param {Number} value Scale factor
   * @return {void}
   */
  scale(t) {
    this._set(Q, t), this._set(at, t), this.setCoords();
  }
  /**
   * Scales an object to a given width, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New width value
   * @return {void}
   */
  scaleToWidth(t) {
    const e = this.getBoundingRect().width / this.getScaledWidth();
    return this.scale(t / this.width / e);
  }
  /**
   * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New height value
   * @return {void}
   */
  scaleToHeight(t) {
    const e = this.getBoundingRect().height / this.getScaledHeight();
    return this.scale(t / this.height / e);
  }
  getCanvasRetinaScaling() {
    return this.canvas?.getRetinaScaling() || 1;
  }
  /**
   * Returns the object angle relative to canvas counting also the group property
   * @returns {TDegree}
   */
  getTotalAngle() {
    return this.group ? Pt(Or(this.calcTransformMatrix())) : this.angle;
  }
  /**
   * Retrieves viewportTransform from Object's canvas if available
   * @return {TMat2D}
   */
  getViewportTransform() {
    return this.canvas?.viewportTransform || J.concat();
  }
  /**
   * Calculates the coordinates of the 4 corner of the bbox, in absolute coordinates.
   * those never change with zoom or viewport changes.
   * @return {TCornerPoint}
   */
  calcACoords() {
    const t = Kt({ angle: this.angle }), { x: e, y: s } = this.getRelativeCenterPoint(), i = pe(e, s), r = B(i, t), o = this._getTransformedDimensions(), a = o.x / 2, h = o.y / 2;
    return {
      // corners
      tl: G({ x: -a, y: -h }, r),
      tr: G({ x: a, y: -h }, r),
      bl: G({ x: -a, y: h }, r),
      br: G({ x: a, y: h }, r)
    };
  }
  /**
   * Sets corner and controls position coordinates based on current angle, width and height, left and top.
   * aCoords are used to quickly find an object on the canvas.
   * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabric5.fabricjs.com/fabric-gotchas}
   */
  setCoords() {
    this.aCoords = this.calcACoords();
  }
  transformMatrixKey(t = !1) {
    let e = [];
    return !t && this.group && (e = this.group.transformMatrixKey(t)), e.push(
      this.top,
      this.left,
      this.width,
      this.height,
      this.scaleX,
      this.scaleY,
      this.angle,
      this.strokeWidth,
      this.skewX,
      this.skewY,
      +this.flipX,
      +this.flipY,
      V(this.originX),
      V(this.originY)
    ), e;
  }
  /**
   * calculate transform matrix that represents the current transformations from the
   * object's properties.
   * @param {Boolean} [skipGroup] return transform matrix for object not counting parent transformations
   * There are some situation in which this is useful to avoid the fake rotation.
   * @return {TMat2D} transform matrix for the object
   */
  calcTransformMatrix(t = !1) {
    let e = this.calcOwnMatrix();
    if (t || !this.group)
      return e;
    const s = this.transformMatrixKey(t), i = this.matrixCache;
    return i && i.key.every((r, o) => r === s[o]) ? i.value : (this.group && (e = B(
      this.group.calcTransformMatrix(!1),
      e
    )), this.matrixCache = {
      key: s,
      value: e
    }, e);
  }
  /**
   * calculate transform matrix that represents the current transformations from the
   * object's properties, this matrix does not include the group transformation
   * @return {TMat2D} transform matrix for the object
   */
  calcOwnMatrix() {
    const t = this.transformMatrixKey(!0), e = this.ownMatrixCache;
    if (e && e.key === t)
      return e.value;
    const s = this.getRelativeCenterPoint(), i = {
      angle: this.angle,
      translateX: s.x,
      translateY: s.y,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      skewY: this.skewY,
      flipX: this.flipX,
      flipY: this.flipY
    }, r = kr(i);
    return this.ownMatrixCache = {
      key: t,
      value: r
    }, r;
  }
  /**
   * Calculate object dimensions from its properties
   * @private
   * @returns {Point} dimensions
   */
  _getNonTransformedDimensions() {
    return new m(this.width, this.height).scalarAdd(this.strokeWidth);
  }
  /**
   * Calculate object dimensions for controls box, including padding and canvas zoom.
   * and active selection
   * @private
   * @param {object} [options] transform options
   * @returns {Point} dimensions
   */
  _calculateCurrentDimensions(t) {
    return this._getTransformedDimensions(t).transform(this.getViewportTransform(), !0).scalarAdd(2 * this.padding);
  }
  /**
   * Calculate object bounding box dimensions from its properties scale, skew.
   * This bounding box is aligned with object angle and not with canvas axis or screen.
   * @param {Object} [options]
   * @param {Number} [options.scaleX]
   * @param {Number} [options.scaleY]
   * @param {Number} [options.skewX]
   * @param {Number} [options.skewY]
   * @private
   * @returns {Point} dimensions
   */
  _getTransformedDimensions(t = {}) {
    const e = {
      // if scaleX or scaleY are negative numbers,
      // this will return dimensions that are negative.
      // and this will break assumptions around the codebase
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      skewY: this.skewY,
      width: this.width,
      height: this.height,
      strokeWidth: this.strokeWidth,
      // TODO remove this spread. is visible in the performance inspection
      ...t
    }, s = e.strokeWidth;
    let i = s, r = 0;
    this.strokeUniform && (i = 0, r = s);
    const o = e.width + i, a = e.height + i, h = e.skewX === 0 && e.skewY === 0;
    let l;
    return h ? l = new m(
      o * e.scaleX,
      a * e.scaleY
    ) : l = ps(
      o,
      a,
      Ee(e)
    ), l.scalarAdd(r);
  }
  /**
   * Translates the coordinates from a set of origin to another (based on the object's dimensions)
   * @param {Point} point The point which corresponds to the originX and originY params
   * @param {TOriginX} fromOriginX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} fromOriginY Vertical origin: 'top', 'center' or 'bottom'
   * @param {TOriginX} toOriginX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} toOriginY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  translateToGivenOrigin(t, e, s, i, r) {
    let o = t.x, a = t.y;
    const h = V(i) - V(e), l = V(r) - V(s);
    if (h || l) {
      const c = this._getTransformedDimensions();
      o += h * c.x, a += l * c.y;
    }
    return new m(o, a);
  }
  /**
   * Translates the coordinates from origin to center coordinates (based on the object's dimensions)
   * @param {Point} point The point which corresponds to the originX and originY params
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  translateToCenterPoint(t, e, s) {
    if (e === T && s === T)
      return t;
    const i = this.translateToGivenOrigin(
      t,
      e,
      s,
      T,
      T
    );
    return this.angle ? i.rotate(I(this.angle), t) : i;
  }
  /**
   * Translates the coordinates from center to origin coordinates (based on the object's dimensions)
   * @param {Point} center The point which corresponds to center of the object
   * @param {OriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {OriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  translateToOriginPoint(t, e, s) {
    const i = this.translateToGivenOrigin(
      t,
      T,
      T,
      e,
      s
    );
    return this.angle ? i.rotate(I(this.angle), t) : i;
  }
  /**
   * Returns the center coordinates of the object relative to canvas
   * @return {Point}
   */
  getCenterPoint() {
    const t = this.getRelativeCenterPoint();
    return this.group ? G(t, this.group.calcTransformMatrix()) : t;
  }
  /**
   * Returns the center coordinates of the object relative to it's parent
   * @return {Point}
   */
  getRelativeCenterPoint() {
    return this.translateToCenterPoint(
      new m(this.left, this.top),
      this.originX,
      this.originY
    );
  }
  /**
   * Returns the position of the object as if it has a different origin.
   * Take an object that has left, top set to 100, 100 with origin 'left', 'top'.
   * Return the values of left top ( wrapped in a point ) that you would need to keep
   * the same position if origin where different.
   * Alternatively you can use this to also find which point in the parent plane is a specific origin
   * ( where is the bottom right corner of my object? )
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  getPointByOrigin(t, e) {
    return this.translateToOriginPoint(
      this.getRelativeCenterPoint(),
      t,
      e
    );
  }
  /**
   * Sets the position of the object taking into consideration the object's origin
   * @param {Point} pos The new position of the object
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {void}
   */
  setPositionByOrigin(t, e, s) {
    const i = this.translateToCenterPoint(t, e, s), r = this.translateToOriginPoint(
      i,
      this.originX,
      this.originY
    );
    this.set({ left: r.x, top: r.y });
  }
  /**
   * @private
   */
  _getLeftTopCoords() {
    return this.translateToOriginPoint(
      this.getRelativeCenterPoint(),
      P,
      it
    );
  }
  /**
   * An utility method to position the object by its left top corner.
   * Useful to reposition objects since now the default origin is center/center
   * Places the left/top corner of the object bounding box in p.
   */
  positionByLeftTop(t) {
    return this.setPositionByOrigin(t, P, it);
  }
}
let xi = class Ye extends Va {
  /**
   * This list of properties is used to check if the state of an object is changed.
   * This state change now is only used for children of groups to understand if a group
   * needs its cache regenerated during a .set call
   * @type Array
   */
  static stateProperties = sa;
  /**
   * List of properties to consider when checking if cache needs refresh
   * Those properties are checked by
   * calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
   * and refreshed at the next render
   * @type Array
   */
  static cacheProperties = At;
  /**
   * Quick access for the _cacheCanvas rendering context
   * This is part of the objectCaching feature
   * since 1.7.0
   * @type boolean
   * @default undefined
   * @private
   */
  _cacheContext = null;
  static ownDefaults = ia;
  static getDefaults() {
    return Ye.ownDefaults;
  }
  /**
   * The class type.
   * This is used for serialization and deserialization purposes and internally it can be used
   * to identify classes.
   * When we transform a class in a plain JS object we need a way to recognize which class it was,
   * and the type is the way we do that. It has no other purposes and you should not give one.
   * Hard to reach on instances and please do not use to drive instance's logic (this.constructor.type).
   * To idenfity a class use instanceof class ( instanceof Rect ).
   * We do not do that in fabricJS code because we want to try to have code splitting possible.
   */
  static type = "FabricObject";
  /**
   * Legacy identifier of the class. Prefer using utils like isType or instanceOf
   * Will be removed in fabric 7 or 8.
   * The setter exists to avoid type errors in old code and possibly current deserialization code.
   * DO NOT build new code around this type value
   * @TODO add sustainable warning message
   * @type string
   * @deprecated
   */
  get type() {
    const t = this.constructor.type;
    return t === "FabricObject" ? "object" : t.toLowerCase();
  }
  set type(t) {
    Mt("warn", "Setting type has no effect", t);
  }
  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(t) {
    super(), Object.assign(this, Ye.ownDefaults), this.setOptions(t);
  }
  /**
   * Create a the canvas used to keep the cached copy of the object
   * @private
   */
  _createCacheCanvas() {
    this._cacheCanvas = ut(), this._cacheContext = this._cacheCanvas.getContext("2d"), this._updateCacheCanvas(), this.dirty = !0;
  }
  /**
   * Limit the cache dimensions so that X * Y do not cross config.perfLimitSizeTotal
   * and each side do not cross fabric.cacheSideLimit
   * those numbers are configurable so that you can get as much detail as you want
   * making bargain with performances.
   * It mutates the input object dims.
   * @param {TCacheCanvasDimensions} dims
   * @return {TCacheCanvasDimensions} dims
   */
  _limitCacheSize(t) {
    const e = t.width, s = t.height, i = M.maxCacheSideLimit, r = M.minCacheSideLimit;
    if (e <= i && s <= i && e * s <= M.perfLimitSizeTotal)
      return e < r && (t.width = r), s < r && (t.height = r), t;
    const o = e / s, [a, h] = ve.limitDimsByArea(o), l = zt(r, a, i), c = zt(r, h, i);
    return e > l && (t.zoomX /= e / l, t.width = l, t.capped = !0), s > c && (t.zoomY /= s / c, t.height = c, t.capped = !0), t;
  }
  /**
   * Return the dimension and the zoom level needed to create a cache canvas
   * big enough to host the object to be cached.
   * @private
   * @return {TCacheCanvasDimensions} Informations about the object to be cached
   */
  _getCacheCanvasDimensions() {
    const t = this.getTotalObjectScaling(), e = this._getTransformedDimensions({ skewX: 0, skewY: 0 }), s = e.x * t.x / this.scaleX, i = e.y * t.y / this.scaleY;
    return {
      // for sure this ALIASING_LIMIT is slightly creating problem
      // in situation in which the cache canvas gets an upper limit
      // also objectScale contains already scaleX and scaleY
      width: Math.ceil(s + Ii),
      height: Math.ceil(i + Ii),
      zoomX: t.x,
      zoomY: t.y,
      x: s,
      y: i
    };
  }
  /**
   * Update width and height of the canvas for cache
   * returns true or false if canvas needed resize.
   * @private
   * @return {Boolean} true if the canvas has been resized
   */
  _updateCacheCanvas() {
    const t = this._cacheCanvas, e = this._cacheContext, { width: s, height: i, zoomX: r, zoomY: o, x: a, y: h } = this._limitCacheSize(
      this._getCacheCanvasDimensions()
    ), l = s !== t.width || i !== t.height, c = this.zoomX !== r || this.zoomY !== o;
    if (!t || !e)
      return !1;
    if (l || c) {
      s !== t.width || i !== t.height ? (t.width = s, t.height = i) : (e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, t.width, t.height));
      const f = a / 2, d = h / 2;
      return this.cacheTranslationX = Math.round(t.width / 2 - f) + f, this.cacheTranslationY = Math.round(t.height / 2 - d) + d, e.translate(this.cacheTranslationX, this.cacheTranslationY), e.scale(r, o), this.zoomX = r, this.zoomY = o, !0;
    }
    return !1;
  }
  /**
   * Sets object's properties from options, for class constructor only.
   * Needs to be overridden for different defaults.
   * @protected
   * @param {Object} [options] Options object
   */
  setOptions(t = {}) {
    this._setOptions(t);
  }
  /**
   * Transforms context when rendering an object
   * @param {CanvasRenderingContext2D} ctx Context
   */
  transform(t) {
    const e = this.group && !this.group._transformDone || this.group && this.canvas && t === this.canvas.contextTop, s = this.calcTransformMatrix(!e);
    t.transform(s[0], s[1], s[2], s[3], s[4], s[5]);
  }
  /**
   * Return the object scale factor counting also the group scaling
   * @return {Point}
   */
  getObjectScaling() {
    if (!this.group)
      return new m(Math.abs(this.scaleX), Math.abs(this.scaleY));
    const t = Gt(this.calcTransformMatrix());
    return new m(Math.abs(t.scaleX), Math.abs(t.scaleY));
  }
  /**
   * Return the object scale factor counting also the group scaling, zoom and retina
   * @return {Object} object with scaleX and scaleY properties
   */
  getTotalObjectScaling() {
    const t = this.getObjectScaling();
    if (this.canvas) {
      const e = this.canvas.getZoom(), s = this.getCanvasRetinaScaling();
      return t.scalarMultiply(e * s);
    }
    return t;
  }
  /**
   * Return the object opacity counting also the group property
   * @return {Number}
   */
  getObjectOpacity() {
    let t = this.opacity;
    return this.group && (t *= this.group.getObjectOpacity()), t;
  }
  /**
   * Makes sure the scale is valid and modifies it if necessary
   * @todo: this is a control action issue, not a geometry one
   * @private
   * @param {Number} value, unconstrained
   * @return {Number} constrained value;
   */
  _constrainScale(t) {
    return Math.abs(t) < this.minScaleLimit ? t < 0 ? -this.minScaleLimit : this.minScaleLimit : t === 0 ? 1e-4 : t;
  }
  /**
   * Handles setting values on the instance and handling internal side effects
   * @protected
   * @param {String} key
   * @param {*} value
   */
  _set(t, e) {
    (t === Q || t === at) && (e = this._constrainScale(e)), t === Q && e < 0 ? (this.flipX = !this.flipX, e *= -1) : t === "scaleY" && e < 0 ? (this.flipY = !this.flipY, e *= -1) : t === "shadow" && e && !(e instanceof xt) && (e = new xt(e));
    const s = this[t] !== e;
    return this[t] = e, s && this.constructor.cacheProperties.includes(t) && (this.dirty = !0), this.parent && (this.dirty || s && this.constructor.stateProperties.includes(
      t
    )) && this.parent._set("dirty", !0), this;
  }
  /**
   * return if the object would be visible in rendering
   * @return {Boolean}
   */
  isNotVisible() {
    return this.opacity === 0 || !this.width && !this.height && this.strokeWidth === 0 || !this.visible;
  }
  /**
   * Renders an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  render(t) {
    this.isNotVisible() || this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen() || (t.save(), this._setupCompositeOperation(t), this.drawSelectionBackground(t), this.transform(t), this._setOpacity(t), this._setShadow(t), this.shouldCache() ? (this.renderCache(), this.drawCacheOnCanvas(t)) : (this._removeCacheCanvas(), this.drawObject(t, !1, {}), this.dirty = !1), t.restore());
  }
  drawSelectionBackground(t) {
  }
  renderCache(t) {
    if (t = t || {}, (!this._cacheCanvas || !this._cacheContext) && this._createCacheCanvas(), this.isCacheDirty() && this._cacheContext) {
      const { zoomX: e, zoomY: s, cacheTranslationX: i, cacheTranslationY: r } = this, { width: o, height: a } = this._cacheCanvas;
      this.drawObject(this._cacheContext, t.forClipping, {
        zoomX: e,
        zoomY: s,
        cacheTranslationX: i,
        cacheTranslationY: r,
        width: o,
        height: a,
        parentClipPaths: []
      }), this.dirty = !1;
    }
  }
  /**
   * Remove cacheCanvas and its dimensions from the objects
   */
  _removeCacheCanvas() {
    this._cacheCanvas = void 0, this._cacheContext = null;
  }
  /**
   * return true if the object will draw a stroke
   * Does not consider text styles. This is just a shortcut used at rendering time
   * We want it to be an approximation and be fast.
   * wrote to avoid extra caching, it has to return true when stroke happens,
   * can guess when it will not happen at 100% chance, does not matter if it misses
   * some use case where the stroke is invisible.
   * @since 3.0.0
   * @returns Boolean
   */
  hasStroke() {
    return !!this.stroke && this.stroke !== "transparent" && this.strokeWidth !== 0;
  }
  /**
   * return true if the object will draw a fill
   * Does not consider text styles. This is just a shortcut used at rendering time
   * We want it to be an approximation and be fast.
   * wrote to avoid extra caching, it has to return true when fill happens,
   * can guess when it will not happen at 100% chance, does not matter if it misses
   * some use case where the fill is invisible.
   * @since 3.0.0
   * @returns Boolean
   */
  hasFill() {
    return !!this.fill && this.fill !== "transparent";
  }
  /**
   * When returns `true`, force the object to have its own cache, even if it is inside a group
   * it may be needed when your object behave in a particular way on the cache and always needs
   * its own isolated canvas to render correctly.
   * Created to be overridden
   * since 1.7.12
   * @returns Boolean
   */
  needsItsOwnCache() {
    return !!(this.paintFirst === H && this.hasFill() && this.hasStroke() && this.shadow || this.clipPath);
  }
  /**
   * Decide if the object should cache or not. Create its own cache level
   * objectCaching is a global flag, wins over everything
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step.
   * Generally you do not cache objects in groups because the group outside is cached.
   * Read as: cache if is needed, or if the feature is enabled but we are not already caching.
   * @return {Boolean}
   */
  shouldCache() {
    return this.ownCaching = this.objectCaching && (!this.parent || !this.parent.isOnACache()) || this.needsItsOwnCache(), this.ownCaching;
  }
  /**
   * Check if this object will cast a shadow with an offset.
   * used by Group.shouldCache to know if child has a shadow recursively
   * @return {Boolean}
   * @deprecated
   */
  willDrawShadow() {
    return !!this.shadow && (this.shadow.offsetX !== 0 || this.shadow.offsetY !== 0);
  }
  /**
   * Execute the drawing operation for an object clipPath
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {FabricObject} clipPath
   */
  drawClipPathOnCache(t, e, s) {
    t.save(), e.inverted ? t.globalCompositeOperation = "destination-out" : t.globalCompositeOperation = "destination-in", t.setTransform(1, 0, 0, 1, 0, 0), t.drawImage(s, 0, 0), t.restore();
  }
  /**
   * Execute the drawing operation for an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {boolean} forClipping apply clipping styles
   * @param {DrawContext} context additional context for rendering
   */
  drawObject(t, e, s) {
    const i = this.fill, r = this.stroke;
    e ? (this.fill = "black", this.stroke = "", this._setClippingProperties(t)) : this._renderBackground(t), this._render(t), this._drawClipPath(t, this.clipPath, s), this.fill = i, this.stroke = r;
  }
  createClipPathLayer(t, e) {
    const s = rt(e), i = s.getContext("2d");
    if (i.translate(e.cacheTranslationX, e.cacheTranslationY), i.scale(e.zoomX, e.zoomY), t._cacheCanvas = s, e.parentClipPaths.forEach((r) => {
      r.transform(i);
    }), e.parentClipPaths.push(t), t.absolutePositioned) {
      const r = st(this.calcTransformMatrix());
      i.transform(r[0], r[1], r[2], r[3], r[4], r[5]);
    }
    return t.transform(i), t.drawObject(i, !0, e), s;
  }
  /**
   * Prepare clipPath state and cache and draw it on instance's cache
   * @param {CanvasRenderingContext2D} ctx
   * @param {FabricObject} clipPath
   */
  _drawClipPath(t, e, s) {
    if (!e)
      return;
    e._transformDone = !0;
    const i = this.createClipPathLayer(
      e,
      s
    );
    this.drawClipPathOnCache(t, e, i);
  }
  /**
   * Paint the cached copy of the object on the target context.
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawCacheOnCanvas(t) {
    t.scale(1 / this.zoomX, 1 / this.zoomY), t.drawImage(
      this._cacheCanvas,
      -this.cacheTranslationX,
      -this.cacheTranslationY
    );
  }
  /**
   * Check if cache is dirty and if is dirty clear the context.
   * This check has a big side effect, it changes the underlying cache canvas if necessary.
   * Do not call this method on your own to check if the cache is dirty, because if it is,
   * it is also going to wipe the cache. This is badly designed and needs to be fixed.
   * @param {Boolean} skipCanvas skip canvas checks because this object is painted
   * on parent canvas.
   */
  isCacheDirty(t = !1) {
    if (this.isNotVisible())
      return !1;
    const e = this._cacheCanvas, s = this._cacheContext;
    return e && s && !t && this._updateCacheCanvas() ? !0 : this.dirty || this.clipPath && this.clipPath.absolutePositioned ? (e && s && !t && (s.save(), s.setTransform(1, 0, 0, 1, 0, 0), s.clearRect(0, 0, e.width, e.height), s.restore()), !0) : !1;
  }
  /**
   * Draws a background for the object big as its untransformed dimensions
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderBackground(t) {
    if (!this.backgroundColor)
      return;
    const e = this._getNonTransformedDimensions();
    t.fillStyle = this.backgroundColor, t.fillRect(-e.x / 2, -e.y / 2, e.x, e.y), this._removeShadow(t);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _setOpacity(t) {
    this.group && !this.group._transformDone ? t.globalAlpha = this.getObjectOpacity() : t.globalAlpha *= this.opacity;
  }
  _setStrokeStyles(t, e) {
    const s = e.stroke;
    s && (t.lineWidth = e.strokeWidth, t.lineCap = e.strokeLineCap, t.lineDashOffset = e.strokeDashOffset, t.lineJoin = e.strokeLineJoin, t.miterLimit = e.strokeMiterLimit, ct(s) ? s.gradientUnits === "percentage" || s.gradientTransform || s.patternTransform ? this._applyPatternForTransformedGradient(t, s) : (t.strokeStyle = s.toLive(t), this._applyPatternGradientTransform(t, s)) : t.strokeStyle = e.stroke);
  }
  _setFillStyles(t, { fill: e }) {
    e && (ct(e) ? (t.fillStyle = e.toLive(t), this._applyPatternGradientTransform(t, e)) : t.fillStyle = e);
  }
  _setClippingProperties(t) {
    t.globalAlpha = 1, t.strokeStyle = "transparent", t.fillStyle = "#000000";
  }
  /**
   * @private
   * Sets line dash
   * @param {CanvasRenderingContext2D} ctx Context to set the dash line on
   * @param {Array} dashArray array representing dashes
   */
  _setLineDash(t, e) {
    !e || e.length === 0 || t.setLineDash(e);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _setShadow(t) {
    if (!this.shadow)
      return;
    const e = this.shadow, s = this.canvas, i = this.getCanvasRetinaScaling(), [r, , , o] = s?.viewportTransform || J, a = r * i, h = o * i, l = e.nonScaling ? new m(1, 1) : this.getObjectScaling();
    t.shadowColor = e.color, t.shadowBlur = e.blur * M.browserShadowBlurConstant * (a + h) * (l.x + l.y) / 4, t.shadowOffsetX = e.offsetX * a * l.x, t.shadowOffsetY = e.offsetY * h * l.y;
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _removeShadow(t) {
    this.shadow && (t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {TFiller} filler {@link Pattern} or {@link Gradient}
   */
  _applyPatternGradientTransform(t, e) {
    if (!ct(e))
      return { offsetX: 0, offsetY: 0 };
    const s = e.gradientTransform || e.patternTransform, i = -this.width / 2 + e.offsetX || 0, r = -this.height / 2 + e.offsetY || 0;
    return e.gradientUnits === "percentage" ? t.transform(this.width, 0, 0, this.height, i, r) : t.transform(1, 0, 0, 1, i, r), s && t.transform(s[0], s[1], s[2], s[3], s[4], s[5]), { offsetX: i, offsetY: r };
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderPaintInOrder(t) {
    this.paintFirst === H ? (this._renderStroke(t), this._renderFill(t)) : (this._renderFill(t), this._renderStroke(t));
  }
  /**
   * @private
   * function that actually render something on the context.
   * empty here to allow Obects to work on tests to benchmark fabric functionalites
   * not related to rendering
   * @param {CanvasRenderingContext2D} _ctx Context to render on
   */
  _render(t) {
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderFill(t) {
    this.fill && (t.save(), this._setFillStyles(t, this), this.fillRule === "evenodd" ? t.fill("evenodd") : t.fill(), t.restore());
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderStroke(t) {
    if (!(!this.stroke || this.strokeWidth === 0)) {
      if (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this.strokeUniform) {
        const e = this.getObjectScaling();
        t.scale(1 / e.x, 1 / e.y);
      }
      this._setLineDash(t, this.strokeDashArray), this._setStrokeStyles(t, this), t.stroke(), t.restore();
    }
  }
  /**
   * This function try to patch the missing gradientTransform on canvas gradients.
   * transforming a context to transform the gradient, is going to transform the stroke too.
   * we want to transform the gradient but not the stroke operation, so we create
   * a transformed gradient on a pattern and then we use the pattern instead of the gradient.
   * this method has drawbacks: is slow, is in low resolution, needs a patch for when the size
   * is limited.
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Gradient} filler
   */
  _applyPatternForTransformedGradient(t, e) {
    const s = this._limitCacheSize(this._getCacheCanvasDimensions()), i = this.getCanvasRetinaScaling(), r = s.x / this.scaleX / i, o = s.y / this.scaleY / i, a = rt({
      // in case width and height are less than 1px, we have to round up.
      // since the pattern is no-repeat, this is fine
      width: Math.ceil(r),
      height: Math.ceil(o)
    }), h = a.getContext("2d");
    h && (h.beginPath(), h.moveTo(0, 0), h.lineTo(r, 0), h.lineTo(r, o), h.lineTo(0, o), h.closePath(), h.translate(r / 2, o / 2), h.scale(
      s.zoomX / this.scaleX / i,
      s.zoomY / this.scaleY / i
    ), this._applyPatternGradientTransform(h, e), h.fillStyle = e.toLive(t), h.fill(), t.translate(
      -this.width / 2 - this.strokeWidth / 2,
      -this.height / 2 - this.strokeWidth / 2
    ), t.scale(
      i * this.scaleX / s.zoomX,
      i * this.scaleY / s.zoomY
    ), t.strokeStyle = h.createPattern(a, "no-repeat") ?? "");
  }
  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates
   * It doesn't matter where the objects origin are, svg has left and top in the top left corner,
   * And this method is only run once on the object after the fromElement parser.
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    return new m(this.left + this.width / 2, this.top + this.height / 2);
  }
  /**
   * Clones an instance.
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @returns {Promise<FabricObject>}
   */
  clone(t) {
    const e = this.toObject(t);
    return this.constructor.fromObject(
      e
    );
  }
  /**
   * Creates an instance of Image out of an object
   * makes use of toCanvasElement.
   * Once this method was based on toDataUrl and loadImage, so it also had a quality
   * and format option. toCanvasElement is faster and produce no loss of quality.
   * If you need to get a real Jpeg or Png from an object, using toDataURL is the right way to do it.
   * toCanvasElement and then toBlob from the obtained canvas is also a good option.
   * @todo fix the export type, it could not be Image but the type that getClass return for 'image'.
   * @param {ObjectToCanvasElementOptions} [options] for clone as image, passed to toDataURL
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
   * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
   * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
   * @return {FabricImage} Object cloned as image.
   */
  cloneAsImage(t) {
    const e = this.toCanvasElement(t), s = x.getClass("image");
    return new s(e);
  }
  /**
   * Converts an object into a HTMLCanvas element
   * @param {ObjectToCanvasElementOptions} options Options object
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
   * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
   * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
   * @param {Boolean} [options.viewportTransform] Account for canvas viewport transform
   * @param {(el?: HTMLCanvasElement) => StaticCanvas} [options.canvasProvider] Create the output canvas
   * @return {HTMLCanvasElement} Returns DOM element <canvas> with the FabricObject
   */
  toCanvasElement(t = {}) {
    const e = ui(this), s = this.group, i = this.shadow, r = Math.abs, o = t.enableRetinaScaling ? mr() : 1, a = (t.multiplier || 1) * o, h = t.canvasProvider || ((v) => new gs(v, {
      enableRetinaScaling: !1,
      renderOnAddRemove: !1,
      skipOffscreen: !1
    }));
    delete this.group, t.withoutTransform && Rr(this), t.withoutShadow && (this.shadow = null), t.viewportTransform && fi(this, this.getViewportTransform()), this.setCoords();
    const l = ut(), c = this.getBoundingRect(), u = this.shadow, f = new m();
    if (u) {
      const v = u.blur, S = u.nonScaling ? new m(1, 1) : this.getObjectScaling();
      f.x = 2 * Math.round(r(u.offsetX) + v) * r(S.x), f.y = 2 * Math.round(r(u.offsetY) + v) * r(S.y);
    }
    const d = c.width + f.x, g = c.height + f.y;
    l.width = Math.ceil(d), l.height = Math.ceil(g);
    const p = h(l);
    t.format === "jpeg" && (p.backgroundColor = "#fff"), this.setPositionByOrigin(
      new m(p.width / 2, p.height / 2),
      T,
      T
    );
    const _ = this.canvas;
    p._objects = [this], this.set("canvas", p), this.setCoords();
    const y = p.toCanvasElement(a || 1, t);
    return this.set("canvas", _), this.shadow = i, s && (this.group = s), this.set(e), this.setCoords(), p._objects = [], p.destroy(), y;
  }
  /**
   * Converts an object into a data-url-like string
   * @param {Object} options Options object
   * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
   * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
   * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
   * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
   * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
   */
  toDataURL(t = {}) {
    return oi(
      this.toCanvasElement(t),
      t.format || "png",
      t.quality || 1
    );
  }
  toBlob(t = {}) {
    return ai(
      this.toCanvasElement(t),
      t.format || "png",
      t.quality || 1
    );
  }
  /**
   * Checks if the instance is of any of the specified types.
   * We use this to filter a list of objects for the `getObjects` function.
   *
   * For detecting an instance type `instanceOf` is a better check,
   * but to avoid to make specific classes a dependency of generic code
   * internally we use this.
   *
   * This compares both the static class `type` and the instance's own `type` property
   * against the provided list of types.
   *
   * @param types - A list of type strings to check against.
   * @returns `true` if the object's type or class type matches any in the list, otherwise `false`.
   */
  isType(...t) {
    return t.includes(this.constructor.type) || t.includes(this.type);
  }
  /**
   * Returns complexity of an instance
   * @return {Number} complexity of this instance (is 1 unless subclassed)
   */
  complexity() {
    return 1;
  }
  /**
   * Returns a JSON representation of an instance
   * @return {Object} JSON
   */
  toJSON() {
    return this.toObject();
  }
  /**
   * Sets "angle" of an instance with centered rotation
   * @param {TDegree} angle Angle value (in degrees)
   */
  rotate(t) {
    const { centeredRotation: e, originX: s, originY: i } = this;
    if (e) {
      const { x: r, y: o } = this.getRelativeCenterPoint();
      this.originX = T, this.originY = T, this.left = r, this.top = o;
    }
    if (this.set("angle", t), e) {
      const { x: r, y: o } = this.translateToOriginPoint(
        this.getRelativeCenterPoint(),
        s,
        i
      );
      this.left = r, this.top = o, this.originX = s, this.originY = i;
    }
  }
  /**
   * This callback function is called by the parent group of an object every
   * time a non-delegated property changes on the group. It is passed the key
   * and value as parameters. Not adding in this function's signature to avoid
   * Travis build error about unused variables.
   */
  setOnGroup() {
  }
  /**
   * Sets canvas globalCompositeOperation for specific object
   * custom composition operation for the particular object can be specified using globalCompositeOperation property
   * @param {CanvasRenderingContext2D} ctx Rendering canvas context
   */
  _setupCompositeOperation(t) {
    this.globalCompositeOperation && (t.globalCompositeOperation = this.globalCompositeOperation);
  }
  /**
   * cancel instance's running animations
   * override if necessary to dispose artifacts such as `clipPath`
   */
  dispose() {
    Ge.cancelByTarget(this), this.off(), this._set("canvas", void 0), this._cacheCanvas && bt().dispose(this._cacheCanvas), this._cacheCanvas = void 0, this._cacheContext = null;
  }
  // #region Animation methods
  /**
   * List of properties to consider for animating colors.
   * @type String[]
   */
  static colorProperties = [X, H, "backgroundColor"];
  /**
   * Animates object's properties
   * @param {Record<string, number | number[] | TColorArg>} animatable map of keys and end values
   * @param {Partial<AnimationOptions<T>>} options
   * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-2#animation}
   * @return {Record<string, TAnimation<T>>} map of animation contexts
   *
   * As object — multiple properties
   *
   * object.animate({ left: ..., top: ... });
   * object.animate({ left: ..., top: ... }, { duration: ... });
   */
  animate(t, e) {
    return Object.entries(t).reduce(
      (s, [i, r]) => (s[i] = this._animate(i, r, e), s),
      {}
    );
  }
  /**
   * @private
   * @param {String} key Property to animate
   * @param {String} to Value to animate to
   * @param {Object} [options] Options object
   */
  _animate(t, e, s = {}) {
    const i = t.split("."), r = this.constructor.colorProperties.includes(i[i.length - 1]), { abort: o, startValue: a, onChange: h, onComplete: l } = s, c = {
      ...s,
      target: this,
      // path.reduce... is the current value in case start value isn't provided
      startValue: a ?? i.reduce((u, f) => u[f], this),
      endValue: e,
      abort: o?.bind(this),
      onChange: (u, f, d) => {
        i.reduce((g, p, _) => (_ === i.length - 1 && (g[p] = u), g[p]), this), h && // @ts-expect-error generic callback arg0 is wrong
        h(u, f, d);
      },
      onComplete: (u, f, d) => {
        this.setCoords(), l && // @ts-expect-error generic callback arg0 is wrong
        l(u, f, d);
      }
    };
    return r ? qr(c) : wi(
      c
    );
  }
  /**
   * Checks if object is descendant of target
   * Should be used instead of {@link Group.contains} or {@link StaticCanvas.contains} for performance reasons
   * @param {TAncestor} target
   * @returns {boolean}
   */
  isDescendantOf(t) {
    const { parent: e, group: s } = this;
    return e === t || s === t || // walk up
    !!e && e.isDescendantOf(t) || !!s && s !== e && s.isDescendantOf(t);
  }
  /**
   * @returns {Ancestors} ancestors (excluding `ActiveSelection`) from bottom to top
   */
  getAncestors() {
    const t = [];
    let e = this;
    do
      e = e.parent, e && t.push(e);
    while (e);
    return t;
  }
  /**
   * Compare ancestors
   *
   * @param {StackedObject} other
   * @returns {AncestryComparison} an object that represent the ancestry situation.
   */
  findCommonAncestors(t) {
    if (this === t)
      return {
        fork: [],
        otherFork: [],
        common: [this, ...this.getAncestors()]
      };
    const e = this.getAncestors(), s = t.getAncestors();
    if (e.length === 0 && s.length > 0 && this === s[s.length - 1])
      return {
        fork: [],
        otherFork: [
          t,
          ...s.slice(0, s.length - 1)
        ],
        common: [this]
      };
    for (let i = 0, r; i < e.length; i++) {
      if (r = e[i], r === t)
        return {
          fork: [this, ...e.slice(0, i)],
          otherFork: [],
          common: e.slice(i)
        };
      for (let o = 0; o < s.length; o++) {
        if (this === s[o])
          return {
            fork: [],
            otherFork: [t, ...s.slice(0, o)],
            common: [this, ...e]
          };
        if (r === s[o])
          return {
            fork: [this, ...e.slice(0, i)],
            otherFork: [t, ...s.slice(0, o)],
            common: e.slice(i)
          };
      }
    }
    return {
      fork: [this, ...e],
      otherFork: [t, ...s],
      common: []
    };
  }
  /**
   *
   * @param {StackedObject} other
   * @returns {boolean}
   */
  hasCommonAncestors(t) {
    const e = this.findCommonAncestors(t);
    return e && !!e.common.length;
  }
  /**
   *
   * @param {FabricObject} other object to compare against
   * @returns {boolean | undefined} if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`
   */
  isInFrontOf(t) {
    if (this === t)
      return;
    const e = this.findCommonAncestors(t);
    if (e.fork.includes(t))
      return !0;
    if (e.otherFork.includes(this))
      return !1;
    const s = e.common[0] || this.canvas;
    if (!s)
      return;
    const i = e.fork.pop(), r = e.otherFork.pop(), o = s._objects.indexOf(
      i
    ), a = s._objects.indexOf(
      r
    );
    return o > -1 && o > a;
  }
  // #region Serialization
  /**
   * Define a list of custom properties that will be serialized when
   * instance.toObject() gets called
   */
  static customProperties = [];
  /**
   * Returns an object representation of an instance
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject(t = []) {
    const e = t.concat(
      Ye.customProperties,
      this.constructor.customProperties || []
    );
    let s;
    const i = M.NUM_FRACTION_DIGITS, {
      clipPath: r,
      fill: o,
      stroke: a,
      shadow: h,
      strokeDashArray: l,
      left: c,
      top: u,
      originX: f,
      originY: d,
      width: g,
      height: p,
      strokeWidth: _,
      strokeLineCap: y,
      strokeDashOffset: v,
      strokeLineJoin: S,
      strokeUniform: C,
      strokeMiterLimit: w,
      scaleX: b,
      scaleY: D,
      angle: O,
      flipX: A,
      flipY: W,
      opacity: Z,
      visible: R,
      backgroundColor: N,
      fillRule: k,
      paintFirst: L,
      globalCompositeOperation: tt,
      skewX: ft,
      skewY: et
    } = this;
    r && !r.excludeFromExport && (s = r.toObject(
      e.concat("inverted", "absolutePositioned")
    ));
    const ht = (uo) => F(uo, i), ji = {
      ...Jt(this, e),
      type: this.constructor.type,
      version: Ys,
      originX: f,
      originY: d,
      left: ht(c),
      top: ht(u),
      width: ht(g),
      height: ht(p),
      fill: Yi(o) ? o.toObject() : o,
      stroke: Yi(a) ? a.toObject() : a,
      strokeWidth: ht(_),
      strokeDashArray: l && l.concat(),
      strokeLineCap: y,
      strokeDashOffset: v,
      strokeLineJoin: S,
      strokeUniform: C,
      strokeMiterLimit: ht(w),
      scaleX: ht(b),
      scaleY: ht(D),
      angle: ht(O),
      flipX: A,
      flipY: W,
      opacity: ht(Z),
      shadow: h && h.toObject(),
      visible: R,
      backgroundColor: N,
      fillRule: k,
      paintFirst: L,
      globalCompositeOperation: tt,
      skewX: ht(ft),
      skewY: ht(et),
      ...s ? { clipPath: s } : null
    };
    return this.includeDefaultValues ? ji : this._removeDefaultValues(ji);
  }
  /**
   * Returns (dataless) object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toDatalessObject(t) {
    return this.toObject(t);
  }
  /**
   * @private
   * @param {Object} object
   */
  _removeDefaultValues(t) {
    const e = this.constructor.getDefaults(), i = Object.keys(e).length > 0 ? e : Object.getPrototypeOf(this);
    return ci(t, (r, o) => {
      if (o === P || o === it || o === "type")
        return !0;
      const a = i[o];
      return r !== a && // basically a check for [] === []
      !(Array.isArray(r) && Array.isArray(a) && r.length === 0 && a.length === 0);
    });
  }
  /**
   * Returns a string representation of an instance
   * @return {String}
   */
  toString() {
    return `#<${this.constructor.type}>`;
  }
  /**
   *
   * @param {Function} klass
   * @param {object} object
   * @param {object} [options]
   * @param {string} [options.extraParam] property to pass as first argument to the constructor
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<FabricObject>}
   */
  static _fromObject({ type: t, ...e }, { extraParam: s, ...i } = {}) {
    return Ae(e, i).then(
      (r) => s ? (delete r[s], new this(
        e[s],
        // @ts-expect-error different signature
        r
      )) : new this(r)
    );
  }
  /**
   *
   * @param {object} object
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<FabricObject>}
   */
  static fromObject(t, e) {
    return this._fromObject(t, e);
  }
};
x.setClass(xi);
x.setClass(xi, "object");
const It = (n, t, e) => (s, i, r, o) => {
  const a = t(s, i, r, o);
  return a && di(n, {
    ..._i(s, i, r, o),
    ...e
  }), a;
};
function Qt(n) {
  return (t, e, s, i) => {
    const { target: r, originX: o, originY: a } = e, h = r.getRelativeCenterPoint(), l = r.translateToOriginPoint(h, o, a), c = n(t, e, s, i);
    return r.setPositionByOrigin(
      l,
      e.originX,
      e.originY
    ), c;
  };
}
const Xa = (n, t, e, s) => {
  const i = _s(
    t,
    t.originX,
    t.originY,
    e,
    s
  );
  if (V(t.originX) === V(T) || V(t.originX) === V(Y) && i.x < 0 || V(t.originX) === V(P) && i.x > 0) {
    const { target: r } = t, o = r.strokeWidth / (r.strokeUniform ? r.scaleX : 1), a = Yr(t) ? 2 : 1, h = r.width, l = Math.abs(i.x * a / r.scaleX) - o;
    return r.set("width", Math.max(l, 1)), h !== r.width;
  }
  return !1;
}, Gs = It(
  be,
  Qt(Xa)
);
function Kr(n, t, e, s, i) {
  s = s || {};
  const r = this.sizeX || s.cornerSize || i.cornerSize, o = this.sizeY || s.cornerSize || i.cornerSize, a = typeof s.transparentCorners < "u" ? s.transparentCorners : i.transparentCorners, h = a ? H : X, l = !a && (s.cornerStrokeColor || i.cornerStrokeColor);
  let c = t, u = e, f;
  n.save(), n.fillStyle = s.cornerColor || i.cornerColor || "", n.strokeStyle = s.cornerStrokeColor || i.cornerStrokeColor || "", r > o ? (f = r, n.scale(1, o / r), u = e * r / o) : o > r ? (f = o, n.scale(r / o, 1), c = t * o / r) : f = r, n.beginPath(), n.arc(c, u, f / 2, 0, yt, !1), n[h](), l && n.stroke(), n.restore();
}
function Jr(n, t, e, s, i) {
  s = s || {};
  const r = this.sizeX || s.cornerSize || i.cornerSize, o = this.sizeY || s.cornerSize || i.cornerSize, a = typeof s.transparentCorners < "u" ? s.transparentCorners : i.transparentCorners, h = a ? H : X, l = !a && (s.cornerStrokeColor || i.cornerStrokeColor), c = r / 2, u = o / 2;
  n.save(), n.fillStyle = s.cornerColor || i.cornerColor || "", n.strokeStyle = s.cornerStrokeColor || i.cornerStrokeColor || "", n.translate(t, e);
  const f = i.getTotalAngle();
  n.rotate(I(f)), n[`${h}Rect`](-c, -u, r, o), l && n.strokeRect(-c, -u, r, o), n.restore();
}
class ot {
  /**
   * keep track of control visibility.
   * mainly for backward compatibility.
   * if you do not want to see a control, you can remove it
   * from the control set.
   * @type {Boolean}
   * @default true
   */
  visible = !0;
  /**
   * Name of the action that the control will likely execute.
   * This is optional. FabricJS uses to identify what the user is doing for some
   * extra optimizations. If you are writing a custom control and you want to know
   * somewhere else in the code what is going on, you can use this string here.
   * you can also provide a custom getActionName if your control run multiple actions
   * depending on some external state.
   * default to scale since is the most common, used on 4 corners by default
   * @type {String}
   * @default 'scale'
   */
  actionName = us;
  /**
   * Drawing angle of the control.
   * NOT used for now, but name marked as needed for internal logic
   * example: to reuse the same drawing function for different rotated controls
   * @type {Number}
   * @default 0
   */
  angle = 0;
  /**
   * Relative position of the control. X
   * 0,0 is the center of the Object, while -0.5 (left) or 0.5 (right) are the extremities
   * of the bounding box.
   * @type {Number}
   * @default 0
   */
  x = 0;
  /**
   * Relative position of the control. Y
   * 0,0 is the center of the Object, while -0.5 (top) or 0.5 (bottom) are the extremities
   * of the bounding box.
   * @type {Number}
   * @default 0
   */
  y = 0;
  /**
   * Horizontal offset of the control from the defined position. In pixels
   * Positive offset moves the control to the right, negative to the left.
   * It used when you want to have position of control that does not scale with
   * the bounding box. Example: rotation control is placed at x:0, y: 0.5 on
   * the boundind box, with an offset of 30 pixels vertically. Those 30 pixels will
   * stay 30 pixels no matter how the object is big. Another example is having 2
   * controls in the corner, that stay in the same position when the object scale.
   * of the bounding box.
   * @type {Number}
   * @default 0
   */
  offsetX = 0;
  /**
   * Vertical offset of the control from the defined position. In pixels
   * Positive offset moves the control to the bottom, negative to the top.
   * @type {Number}
   * @default 0
   */
  offsetY = 0;
  /**
   * Sets the length of the control. If null, defaults to object's cornerSize.
   * Expects both sizeX and sizeY to be set when set.
   * @type {?Number}
   * @default null
   */
  sizeX = 0;
  /**
   * Sets the height of the control. If null, defaults to object's cornerSize.
   * Expects both sizeX and sizeY to be set when set.
   * @type {?Number}
   * @default null
   */
  sizeY = 0;
  /**
   * Sets the length of the touch area of the control. If null, defaults to object's touchCornerSize.
   * Expects both touchSizeX and touchSizeY to be set when set.
   * @type {?Number}
   * @default null
   */
  touchSizeX = 0;
  /**
   * Sets the height of the touch area of the control. If null, defaults to object's touchCornerSize.
   * Expects both touchSizeX and touchSizeY to be set when set.
   * @type {?Number}
   * @default null
   */
  touchSizeY = 0;
  /**
   * Css cursor style to display when the control is hovered.
   * if the method `cursorStyleHandler` is provided, this property is ignored.
   * @type {String}
   * @default 'crosshair'
   */
  cursorStyle = "crosshair";
  /**
   * If controls has an offsetY or offsetX, draw a line that connects
   * the control to the bounding box
   * @type {Boolean}
   * @default false
   */
  withConnection = !1;
  constructor(t) {
    Object.assign(this, t);
  }
  shouldActivate(t, e, s, { tl: i, tr: r, br: o, bl: a }) {
    return e.canvas?.getActiveObject() === e && e.isControlVisible(t) && j.isPointInPolygon(s, [i, r, o, a]);
  }
  /**
   * Returns control actionHandler
   * @param {Event} eventData the native mouse event
   * @param {FabricObject} fabricObject on which the control is displayed
   * @param {Control} control control for which the action handler is being asked
   * @return {Function} the action handler
   */
  getActionHandler(t, e, s) {
    return this.actionHandler;
  }
  /**
   * Returns control mouseDown handler
   * @param {Event} eventData the native mouse event
   * @param {FabricObject} fabricObject on which the control is displayed
   * @param {Control} control control for which the action handler is being asked
   * @return {Function} the action handler
   */
  getMouseDownHandler(t, e, s) {
    return this.mouseDownHandler;
  }
  /**
   * Returns control mouseUp handler.
   * During actions the fabricObject or the control can be of different obj
   * @param {Event} eventData the native mouse event
   * @param {FabricObject} fabricObject on which the control is displayed
   * @param {Control} control control for which the action handler is being asked
   * @return {Function} the action handler
   */
  getMouseUpHandler(t, e, s) {
    return this.mouseUpHandler;
  }
  /**
   * Returns control cursorStyle for css using cursorStyle. If you need a more elaborate
   * function you can pass one in the constructor
   * the cursorStyle property
   * @param {Event} eventData the native mouse event
   * @param {Control} control the current control ( likely this)
   * @param {FabricObject} object on which the control is displayed
   * @return {String}
   */
  cursorStyleHandler(t, e, s, i) {
    return e.cursorStyle;
  }
  /**
   * Returns the action name. The basic implementation just return the actionName property.
   * @param {Event} eventData the native mouse event
   * @param {Control} control the current control ( likely this)
   * @param {FabricObject} object on which the control is displayed
   * @return {String}
   */
  getActionName(t, e, s) {
    return e.actionName;
  }
  /**
   * Returns controls visibility
   * @param {FabricObject} object on which the control is displayed
   * @param {String} controlKey key where the control is memorized on the
   * @return {Boolean}
   */
  getVisibility(t, e) {
    return t._controlsVisibility?.[e] ?? this.visible;
  }
  /**
   * Sets controls visibility
   * @param {Boolean} visibility for the object
   * @return {Void}
   */
  setVisibility(t, e, s) {
    this.visible = t;
  }
  positionHandler(t, e, s, i) {
    return new m(
      this.x * t.x + this.offsetX,
      this.y * t.y + this.offsetY
    ).transform(e);
  }
  /**
   * Returns the coords for this control based on object values.
   * @param {Number} objectAngle angle from the fabric object holding the control
   * @param {Number} objectCornerSize cornerSize from the fabric object holding the control (or touchCornerSize if
   *   isTouch is true)
   * @param {Number} centerX x coordinate where the control center should be
   * @param {Number} centerY y coordinate where the control center should be
   * @param {boolean} isTouch true if touch corner, false if normal corner
   */
  calcCornerCoords(t, e, s, i, r, o) {
    const a = fs([
      pe(s, i),
      Kt({ angle: t }),
      ds(
        (r ? this.touchSizeX : this.sizeX) || e,
        (r ? this.touchSizeY : this.sizeY) || e
      )
    ]);
    return {
      tl: new m(-0.5, -0.5).transform(a),
      tr: new m(0.5, -0.5).transform(a),
      br: new m(0.5, 0.5).transform(a),
      bl: new m(-0.5, 0.5).transform(a)
    };
  }
  /**
   * Render function for the control.
   * When this function runs the context is unscaled. unrotate. Just retina scaled.
   * all the functions will have to translate to the point left,top before starting Drawing
   * if they want to draw a control where the position is detected.
   * left and top are the result of the positionHandler function
   * @param {RenderingContext2D} ctx the context where the control will be drawn
   * @param {Number} left position of the canvas where we are about to render the control.
   * @param {Number} top position of the canvas where we are about to render the control.
   * @param {Object} styleOverride
   * @param {FabricObject} fabricObject the object where the control is about to be rendered
   */
  render(t, e, s, i, r) {
    switch (i = i || {}, i.cornerStyle || r.cornerStyle) {
      case "circle":
        Kr.call(
          this,
          t,
          e,
          s,
          i,
          r
        );
        break;
      default:
        Jr.call(
          this,
          t,
          e,
          s,
          i,
          r
        );
    }
  }
}
const Qr = (n, t, e) => e.lockRotation ? Ue : t.cursorStyle, $a = (n, { target: t, ex: e, ey: s, theta: i, originX: r, originY: o }, a, h) => {
  const l = t.translateToOriginPoint(
    t.getRelativeCenterPoint(),
    r,
    o
  );
  if (_t(t, "lockRotation"))
    return !1;
  const c = Math.atan2(s - l.y, e - l.x), u = Math.atan2(h - l.y, a - l.x);
  let f = Pt(u - c + i);
  if (t.snapAngle && t.snapAngle > 0) {
    const g = t.snapAngle, p = t.snapThreshold || g, _ = Math.ceil(f / g) * g, y = Math.floor(f / g) * g;
    Math.abs(f - y) < p ? f = y : Math.abs(f - _) < p && (f = _);
  }
  f < 0 && (f = 360 + f), f %= 360;
  const d = t.angle !== f;
  return t.angle = f, d;
}, Zr = It(
  yr,
  Qt($a)
);
function tn(n, t) {
  const e = t.canvas, s = n[e.uniScaleKey];
  return e.uniformScaling && !s || !e.uniformScaling && s;
}
function en(n, t, e) {
  const s = _t(n, "lockScalingX"), i = _t(n, "lockScalingY");
  if (s && i || !t && (s || i) && e || s && t === "x" || i && t === "y")
    return !0;
  const { width: r, height: o, strokeWidth: a } = n;
  return r === 0 && a === 0 && t !== "y" || o === 0 && a === 0 && t !== "x";
}
const Wa = ["e", "se", "s", "sw", "w", "nw", "n", "ne", "e"], se = (n, t, e, s) => {
  const i = tn(n, e), r = t.x !== 0 && t.y === 0 ? "x" : t.x === 0 && t.y !== 0 ? "y" : "";
  if (en(e, r, i))
    return Ue;
  const o = Vr(e, t, s);
  return `${Wa[o]}-resize`;
};
function bi(n, t, e, s, i = {}) {
  const r = t.target, o = i.by, a = tn(n, r), h = en(r, o, a);
  let l, c, u, f, d, g;
  if (h)
    return !1;
  if (t.gestureScale)
    c = t.scaleX * t.gestureScale, u = t.scaleY * t.gestureScale;
  else {
    if (l = _s(
      t,
      t.originX,
      t.originY,
      e,
      s
    ), d = o !== "y" ? Math.sign(l.x || t.signX || 1) : 1, g = o !== "x" ? Math.sign(l.y || t.signY || 1) : 1, t.signX || (t.signX = d), t.signY || (t.signY = g), _t(r, "lockScalingFlip") && (t.signX !== d || t.signY !== g))
      return !1;
    if (f = r._getTransformedDimensions(), a && !o) {
      const y = Math.abs(l.x) + Math.abs(l.y), { original: v } = t, S = Math.abs(f.x * v.scaleX / r.scaleX) + Math.abs(f.y * v.scaleY / r.scaleY), C = y / S;
      c = v.scaleX * C, u = v.scaleY * C;
    } else
      c = Math.abs(l.x * r.scaleX / f.x), u = Math.abs(l.y * r.scaleY / f.y);
    Yr(t) && (c *= 2, u *= 2), t.signX !== d && o !== "y" && (t.originX = Wi(t.originX), c *= -1, t.signX = d), t.signY !== g && o !== "x" && (t.originY = Wi(t.originY), u *= -1, t.signY = g);
  }
  const p = r.scaleX, _ = r.scaleY;
  return o ? (o === "x" && r.set(Q, c), o === "y" && r.set(at, u)) : (!_t(r, "lockScalingX") && r.set(Q, c), !_t(r, "lockScalingY") && r.set(at, u)), p !== r.scaleX || _ !== r.scaleY;
}
const Ga = (n, t, e, s) => bi(n, t, e, s), Ha = (n, t, e, s) => bi(n, t, e, s, { by: "x" }), za = (n, t, e, s) => bi(n, t, e, s, { by: "y" }), _e = It(
  cs,
  Qt(Ga)
), sn = It(
  cs,
  Qt(Ha)
), rn = It(
  cs,
  Qt(za)
), Hs = {
  x: {
    counterAxis: "y",
    scale: Q,
    skew: de,
    lockSkewing: "lockSkewingX",
    origin: "originX",
    flip: "flipX"
  },
  y: {
    counterAxis: "x",
    scale: at,
    skew: ge,
    lockSkewing: "lockSkewingY",
    origin: "originY",
    flip: "flipY"
  }
}, Na = ["ns", "nesw", "ew", "nwse"], nn = (n, t, e, s) => {
  if (t.x !== 0 && _t(e, "lockSkewingY") || t.y !== 0 && _t(e, "lockSkewingX"))
    return Ue;
  const i = Vr(e, t, s) % 4;
  return `${Na[i]}-resize`;
};
function Ua(n, { target: t, ex: e, ey: s, skewingSide: i, ...r }, o) {
  const { skew: a } = Hs[n], h = o.subtract(new m(e, s)).divide(new m(t.scaleX, t.scaleY))[n], l = t[a], c = r[a], u = Math.tan(I(c)), f = n === "y" ? t._getTransformedDimensions({
    scaleX: 1,
    scaleY: 1,
    // since skewY is applied before skewX, b (=width) is not affected by skewX
    skewX: 0
  }).x : t._getTransformedDimensions({
    scaleX: 1,
    scaleY: 1
  }).y, d = 2 * h * i / // we max out fractions to safeguard from asymptotic behavior
  Math.max(f, 1) + // add starting state
  u, g = Pt(Math.atan(d));
  t.set(a, g);
  const p = l !== t[a];
  if (p && n === "y") {
    const { skewX: _, scaleX: y } = t, v = t._getTransformedDimensions({ skewY: l }), S = t._getTransformedDimensions(), C = _ !== 0 ? v.x / S.x : 1;
    C !== 1 && t.set(Q, C * y);
  }
  return p;
}
function on(n, t, e, s, i) {
  const { target: r } = e, {
    counterAxis: o,
    origin: a,
    lockSkewing: h,
    skew: l,
    flip: c
  } = Hs[n];
  if (_t(r, h))
    return !1;
  const { origin: u, flip: f } = Hs[o], d = V(e[u]) * (r[f] ? -1 : 1), g = -Math.sign(d) * (r[c] ? -1 : 1), p = (r[l] === 0 && // in case skewing equals 0 we use the pointer offset from target center to determine the direction of skewing
  _s(e, T, T, s, i)[n] > 0 || // in case target has skewing we use that as the direction
  r[l] > 0 ? 1 : -1) * g, _ = -p * 0.5 + 0.5;
  return It(
    vr,
    Qt(
      (v, S, C, w) => Ua(n, S, new m(C, w))
    )
  )(
    t,
    {
      ...e,
      [a]: _,
      skewingSide: g
    },
    s,
    i
  );
}
const an = (n, t, e, s) => on("x", n, t, e, s), hn = (n, t, e, s) => on("y", n, t, e, s);
function vs(n, t) {
  return n[t.canvas.altActionKey];
}
const ye = (n, t, e) => {
  const s = vs(n, e);
  return t.x === 0 ? s ? de : at : t.y === 0 ? s ? ge : Q : "";
}, $t = (n, t, e, s) => vs(n, e) ? nn(n, t, e, s) : se(n, t, e, s), zs = (n, t, e, s) => vs(n, t.target) ? hn(n, t, e, s) : sn(n, t, e, s), Ns = (n, t, e, s) => vs(n, t.target) ? an(n, t, e, s) : rn(n, t, e, s), Ti = () => ({
  ml: new ot({
    x: -0.5,
    y: 0,
    cursorStyleHandler: $t,
    actionHandler: zs,
    getActionName: ye
  }),
  mr: new ot({
    x: 0.5,
    y: 0,
    cursorStyleHandler: $t,
    actionHandler: zs,
    getActionName: ye
  }),
  mb: new ot({
    x: 0,
    y: 0.5,
    cursorStyleHandler: $t,
    actionHandler: Ns,
    getActionName: ye
  }),
  mt: new ot({
    x: 0,
    y: -0.5,
    cursorStyleHandler: $t,
    actionHandler: Ns,
    getActionName: ye
  }),
  tl: new ot({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: se,
    actionHandler: _e
  }),
  tr: new ot({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: se,
    actionHandler: _e
  }),
  bl: new ot({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: se,
    actionHandler: _e
  }),
  br: new ot({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: se,
    actionHandler: _e
  }),
  mtr: new ot({
    x: 0,
    y: -0.5,
    actionHandler: Zr,
    cursorStyleHandler: Qr,
    offsetY: -40,
    withConnection: !0,
    actionName: ri
  })
}), ln = () => ({
  mr: new ot({
    x: 0.5,
    y: 0,
    actionHandler: Gs,
    cursorStyleHandler: $t,
    actionName: be
  }),
  ml: new ot({
    x: -0.5,
    y: 0,
    actionHandler: Gs,
    cursorStyleHandler: $t,
    actionName: be
  })
}), cn = () => ({
  ...Ti(),
  ...ln()
});
class Je extends xi {
  static ownDefaults = ra;
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Je.ownDefaults
    };
  }
  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(t) {
    super(), Object.assign(
      this,
      this.constructor.createControls(),
      Je.ownDefaults
    ), this.setOptions(t);
  }
  /**
   * Creates the default control object.
   * If you prefer to have on instance of controls shared among all objects
   * make this function return an empty object and add controls to the ownDefaults
   * @param {Object} [options] Options object
   */
  static createControls() {
    return { controls: Ti() };
  }
  /**
   * Update width and height of the canvas for cache
   * returns true or false if canvas needed resize.
   * @private
   * @return {Boolean} true if the canvas has been resized
   */
  _updateCacheCanvas() {
    const t = this.canvas;
    if (this.noScaleCache && t && t._currentTransform) {
      const e = t._currentTransform, s = e.target, i = e.action;
      if (this === s && i && i.startsWith(us))
        return !1;
    }
    return super._updateCacheCanvas();
  }
  getActiveControl() {
    const t = this.__corner;
    return t ? {
      key: t,
      control: this.controls[t],
      coord: this.oCoords[t]
    } : void 0;
  }
  /**
   * Determines which corner is under the mouse cursor, represented by `pointer`.
   * This function returns a corner only if the object is the active one.
   * This is done to avoid selecting corner of non active object and activating transformations
   * rather than drag action. The default behavior of fabricJS is that if you want to transform
   * an object, first you select it to show the control set
   * @private
   * @param {Object} pointer The pointer indicating the mouse position
   * @param {boolean} forTouch indicates if we are looking for interaction area with a touch action
   * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or 0 if nothing is found.
   */
  findControl(t, e = !1) {
    if (!this.hasControls || !this.canvas)
      return;
    this.__corner = void 0;
    const s = Object.entries(this.oCoords);
    for (let i = s.length - 1; i >= 0; i--) {
      const [r, o] = s[i], a = this.controls[r];
      if (a.shouldActivate(
        r,
        this,
        t,
        e ? o.touchCorner : o.corner
      ))
        return this.__corner = r, { key: r, control: a, coord: this.oCoords[r] };
    }
  }
  /**
   * Calculates the coordinates of the center of each control plus the corners of the control itself
   * This basically just delegates to each control positionHandler
   * WARNING: changing what is passed to positionHandler is a breaking change, since position handler
   * is a public api and should be done just if extremely necessary
   * @return {Record<string, TOCoord>}
   */
  calcOCoords() {
    const t = this.getViewportTransform(), e = this.getCenterPoint(), s = pe(e.x, e.y), i = Kt({
      angle: this.getTotalAngle() - (this.group && this.flipX ? 180 : 0)
    }), r = B(s, i), o = B(t, r), a = B(o, [
      1 / t[0],
      0,
      0,
      1 / t[3],
      0,
      0
    ]), h = this.group ? Gt(this.calcTransformMatrix()) : void 0;
    h && (h.scaleX = Math.abs(h.scaleX), h.scaleY = Math.abs(h.scaleY));
    const l = this._calculateCurrentDimensions(h), c = {};
    return this.forEachControl((u, f) => {
      const d = u.positionHandler(l, a, this, u);
      c[f] = Object.assign(
        d,
        this._calcCornerCoords(u, d)
      );
    }), c;
  }
  /**
   * Sets the coordinates that determine the interaction area of each control
   * note: if we would switch to ROUND corner area, all of this would disappear.
   * everything would resolve to a single point and a pythagorean theorem for the distance
   * @todo evaluate simplification of code switching to circle interaction area at runtime
   * @private
   */
  _calcCornerCoords(t, e) {
    const s = this.getTotalAngle(), i = t.calcCornerCoords(
      s,
      this.cornerSize,
      e.x,
      e.y,
      !1,
      this
    ), r = t.calcCornerCoords(
      s,
      this.touchCornerSize,
      e.x,
      e.y,
      !0,
      this
    );
    return { corner: i, touchCorner: r };
  }
  /**
   * @override set controls' coordinates as well
   * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link https://fabric5.fabricjs.com/fabric-gotchas}
   * @return {void}
   */
  setCoords() {
    super.setCoords(), this.canvas && (this.oCoords = this.calcOCoords());
  }
  /**
   * Calls a function for each control. The function gets called,
   * with the control, the control's key and the object that is calling the iterator
   * @param {Function} fn function to iterate over the controls over
   */
  forEachControl(t) {
    for (const e in this.controls)
      t(this.controls[e], e, this);
  }
  /**
   * Draws a colored layer behind the object, inside its selection borders.
   * Requires public options: padding, selectionBackgroundColor
   * this function is called when the context is transformed
   * has checks to be skipped when the object is on a staticCanvas
   * @todo evaluate if make this disappear in favor of a pre-render hook for objects
   * this was added by Andrea Bogazzi to make possible some feature for work reasons
   * it seemed a good option, now is an edge case
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   */
  drawSelectionBackground(t) {
    if (!this.selectionBackgroundColor || this.canvas && this.canvas._activeObject !== this)
      return;
    t.save();
    const e = this.getRelativeCenterPoint(), s = this._calculateCurrentDimensions(), i = this.getViewportTransform();
    t.translate(e.x, e.y), t.scale(1 / i[0], 1 / i[3]), t.rotate(I(this.angle)), t.fillStyle = this.selectionBackgroundColor, t.fillRect(-s.x / 2, -s.y / 2, s.x, s.y), t.restore();
  }
  /**
   * @public override this function in order to customize the drawing of the control box, e.g. rounded corners, different border style.
   * @param {CanvasRenderingContext2D} ctx ctx is rotated and translated so that (0,0) is at object's center
   * @param {Point} size the control box size used
   */
  strokeBorders(t, e) {
    t.strokeRect(-e.x / 2, -e.y / 2, e.x, e.y);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {Point} size
   * @param {TStyleOverride} styleOverride object to override the object style
   */
  _drawBorders(t, e, s = {}) {
    const i = {
      hasControls: this.hasControls,
      borderColor: this.borderColor,
      borderDashArray: this.borderDashArray,
      ...s
    };
    t.save(), t.strokeStyle = i.borderColor, this._setLineDash(t, i.borderDashArray), this.strokeBorders(t, e), i.hasControls && this.drawControlsConnectingLines(t, e), t.restore();
  }
  /**
   * Renders controls and borders for the object
   * the context here is not transformed
   * @todo move to interactivity
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {TStyleOverride} [styleOverride] properties to override the object style
   */
  _renderControls(t, e = {}) {
    const { hasBorders: s, hasControls: i } = this, r = {
      hasBorders: s,
      hasControls: i,
      ...e
    }, o = this.getViewportTransform(), a = r.hasBorders, h = r.hasControls, l = B(o, this.calcTransformMatrix()), c = Gt(l);
    t.save(), t.translate(c.translateX, c.translateY), t.lineWidth = this.borderScaleFactor, this.group === this.parent && (t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1), this.flipX && (c.angle -= 180), t.rotate(I(this.group ? c.angle : this.angle)), a && this.drawBorders(t, c, e), h && this.drawControls(t, e), t.restore();
  }
  /**
   * Draws borders of an object's bounding box.
   * Requires public properties: width, height
   * Requires public options: padding, borderColor
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {object} options object representing current object parameters
   * @param {TStyleOverride} [styleOverride] object to override the object style
   */
  drawBorders(t, e, s) {
    let i;
    if (s && s.forActiveSelection || this.group) {
      const r = ps(
        this.width,
        this.height,
        Ee(e)
      ), o = this.isStrokeAccountedForInDimensions() ? ni : (this.strokeUniform ? new m().scalarAdd(this.canvas ? this.canvas.getZoom() : 1) : (
        // this is extremely confusing. options comes from the upper function
        // and is the qrDecompose of a matrix that takes in account zoom too
        new m(e.scaleX, e.scaleY)
      )).scalarMultiply(this.strokeWidth);
      i = r.add(o).scalarAdd(this.borderScaleFactor).scalarAdd(this.padding * 2);
    } else
      i = this._calculateCurrentDimensions().scalarAdd(
        this.borderScaleFactor
      );
    this._drawBorders(t, i, s);
  }
  /**
   * Draws lines from a borders of an object's bounding box to controls that have `withConnection` property set.
   * Requires public properties: width, height
   * Requires public options: padding, borderColor
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {Point} size object size x = width, y = height
   */
  drawControlsConnectingLines(t, e) {
    let s = !1;
    t.beginPath(), this.forEachControl((i, r) => {
      i.withConnection && i.getVisibility(this, r) && (s = !0, t.moveTo(i.x * e.x, i.y * e.y), t.lineTo(
        i.x * e.x + i.offsetX,
        i.y * e.y + i.offsetY
      ));
    }), s && t.stroke();
  }
  /**
   * Draws corners of an object's bounding box.
   * Requires public properties: width, height
   * Requires public options: cornerSize, padding
   * Be aware that since fabric 6.0 this function does not call setCoords anymore.
   * setCoords needs to be called manually if the object of which we are rendering controls
   * is outside the standard selection and transform process.
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {ControlRenderingStyleOverride} styleOverride object to override the object style
   */
  drawControls(t, e = {}) {
    t.save();
    const s = this.getCanvasRetinaScaling(), { cornerStrokeColor: i, cornerDashArray: r, cornerColor: o } = this, a = {
      cornerStrokeColor: i,
      cornerDashArray: r,
      cornerColor: o,
      ...e
    };
    t.setTransform(s, 0, 0, s, 0, 0), t.strokeStyle = t.fillStyle = a.cornerColor, this.transparentCorners || (t.strokeStyle = a.cornerStrokeColor), this._setLineDash(t, a.cornerDashArray), this.forEachControl((h, l) => {
      if (h.getVisibility(this, l)) {
        const c = this.oCoords[l];
        h.render(t, c.x, c.y, a, this);
      }
    }), t.restore();
  }
  /**
   * Returns true if the specified control is visible, false otherwise.
   * @param {string} controlKey The key of the control. Possible values are usually 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr',
   * but since the control api allow for any control name, can be any string.
   * @returns {boolean} true if the specified control is visible, false otherwise
   */
  isControlVisible(t) {
    return this.controls[t] && this.controls[t].getVisibility(this, t);
  }
  /**
   * Sets the visibility of the specified control.
   * please do not use.
   * @param {String} controlKey The key of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
   * but since the control api allow for any control name, can be any string.
   * @param {Boolean} visible true to set the specified control visible, false otherwise
   * @todo discuss this overlap of priority here with the team. Andrea Bogazzi for details
   */
  setControlVisible(t, e) {
    this._controlsVisibility || (this._controlsVisibility = {}), this._controlsVisibility[t] = e;
  }
  /**
   * Sets the visibility state of object controls, this is just a bulk option for setControlVisible;
   * @param {Record<string, boolean>} [options] with an optional key per control
   * example: {Boolean} [options.bl] true to enable the bottom-left control, false to disable it
   */
  setControlsVisibility(t = {}) {
    Object.entries(t).forEach(
      ([e, s]) => this.setControlVisible(e, s)
    );
  }
  /**
   * Clears the canvas.contextTop in a specific area that corresponds to the object's bounding box
   * that is in the canvas.contextContainer.
   * This function is used to clear pieces of contextTop where we render ephemeral effects on top of the object.
   * Example: blinking cursor text selection, drag effects.
   * @todo discuss swapping restoreManually with a renderCallback, but think of async issues
   * @param {Boolean} [restoreManually] When true won't restore the context after clear, in order to draw something else.
   * @return {CanvasRenderingContext2D|undefined} canvas.contextTop that is either still transformed
   * with the object transformMatrix, or restored to neutral transform
   */
  clearContextTop(t) {
    if (!this.canvas)
      return;
    const e = this.canvas.contextTop;
    if (!e)
      return;
    const s = this.canvas.viewportTransform;
    e.save(), e.transform(s[0], s[1], s[2], s[3], s[4], s[5]), this.transform(e);
    const i = this.width + 4, r = this.height + 4;
    return e.clearRect(-i / 2, -r / 2, i, r), t || e.restore(), e;
  }
  /**
   * This callback function is called every time _discardActiveObject or _setActiveObject
   * try to to deselect this object. If the function returns true, the process is cancelled
   * @param {Object} [_options] options sent from the upper functions
   * @param {TPointerEvent} [options.e] event if the process is generated by an event
   * @param {FabricObject} [options.object] next object we are setting as active, and reason why
   * this is being deselected
   */
  onDeselect(t) {
    return !1;
  }
  /**
   * This callback function is called every time _discardActiveObject or _setActiveObject
   * try to to select this object. If the function returns true, the process is cancelled
   * @param {Object} [_options] options sent from the upper functions
   * @param {Event} [_options.e] event if the process is generated by an event
   */
  onSelect(t) {
    return !1;
  }
  /**
   * Override to customize Drag behavior
   * Fired from {@link Canvas#_onMouseMove}
   * @returns true in order for the window to start a drag session
   */
  shouldStartDragging(t) {
    return !1;
  }
  /**
   * Override to customize Drag behavior\
   * Fired once a drag session has started
   * @returns true to handle the drag event
   */
  onDragStart(t) {
    return !1;
  }
  /**
   * Override to customize drag and drop behavior
   * @public
   * @param {DragEvent} _e
   * @returns {boolean} true if the object currently dragged can be dropped on the target
   */
  canDrop(t) {
    return !1;
  }
  /**
   * Override to customize drag and drop behavior
   * render a specific effect when an object is the source of a drag event
   * example: render the selection status for the part of text that is being dragged from a text object
   * @public
   * @param {DragEvent} _e
   */
  renderDragSourceEffect(t) {
  }
  /**
   * Override to customize drag and drop behavior
   * render a specific effect when an object is the target of a drag event
   * used to show that the underly object can receive a drop, or to show how the
   * object will change when dropping. example: show the cursor where the text is about to be dropped
   * @public
   * @param {DragEvent} _e
   */
  renderDropTargetEffect(t) {
  }
}
function un(n, t) {
  return t.forEach((e) => {
    Object.getOwnPropertyNames(e.prototype).forEach((s) => {
      s !== "constructor" && Object.defineProperty(
        n.prototype,
        s,
        Object.getOwnPropertyDescriptor(e.prototype, s) || /* @__PURE__ */ Object.create(null)
      );
    });
  }), n;
}
class z extends Je {
}
un(z, [$r]);
x.setClass(z);
x.setClass(z, "object");
const fn = (n, t, e, s) => {
  s = Math.round(s);
  const i = s * 2 + 1, { data: r } = n.getImageData(t - s, e - s, i, i);
  for (let o = 3; o < r.length; o += 4)
    if (r[o] > 0)
      return !1;
  return !0;
}, qa = (n, t) => {
  for (let e = n.length - 1; e >= 0; e--)
    if (t(n[e], e, n))
      return e;
  return -1;
};
class dn {
  constructor(t) {
    this.options = t, this.strokeProjectionMagnitude = this.options.strokeWidth / 2, this.scale = new m(this.options.scaleX, this.options.scaleY), this.strokeUniformScalar = this.options.strokeUniform ? new m(1 / this.options.scaleX, 1 / this.options.scaleY) : new m(1, 1);
  }
  /**
   * When the stroke is uniform, scaling affects the arrangement of points. So we must take it into account.
   */
  createSideVector(t, e) {
    const s = Te(t, e);
    return this.options.strokeUniform ? s.multiply(this.scale) : s;
  }
  projectOrthogonally(t, e, s) {
    return this.applySkew(
      t.add(this.calcOrthogonalProjection(t, e, s))
    );
  }
  isSkewed() {
    return this.options.skewX !== 0 || this.options.skewY !== 0;
  }
  applySkew(t) {
    const e = new m(t);
    return e.y += e.x * Math.tan(I(this.options.skewY)), e.x += e.y * Math.tan(I(this.options.skewX)), e;
  }
  scaleUnitVector(t, e) {
    return t.multiply(this.strokeUniformScalar).scalarMultiply(e);
  }
}
const Ka = new m();
class ne extends dn {
  /**
   * The AB vector
   */
  AB;
  /**
   * The AC vector
   */
  AC;
  /**
   * The angle of A (∠BAC)
   */
  alpha;
  /**
   * The bisector of A (∠BAC)
   */
  bisector;
  static getOrthogonalRotationFactor(t, e) {
    const s = e ? Ne(t, e) : pi(t);
    return Math.abs(s) < Bt ? -1 : 1;
  }
  constructor(t, e, s, i) {
    super(i), this.A = new m(t), this.B = new m(e), this.C = new m(s), this.AB = this.createSideVector(this.A, this.B), this.AC = this.createSideVector(this.A, this.C), this.alpha = Ne(this.AB, this.AC), this.bisector = ms(
      // if AC is also the zero vector nothing will be projected
      // in that case the next point will handle the projection
      gi(this.AB.eq(Ka) ? this.AC : this.AB, this.alpha / 2)
    );
  }
  calcOrthogonalProjection(t, e, s = this.strokeProjectionMagnitude) {
    const i = this.createSideVector(t, e), r = mi(i), o = ne.getOrthogonalRotationFactor(
      r,
      this.bisector
    );
    return this.scaleUnitVector(r, s * o);
  }
  /**
   * BEVEL
   * Calculation: the projection points are formed by the vector orthogonal to the vertex.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-2-bevel
   */
  projectBevel() {
    const t = [];
    return (this.alpha % yt === 0 ? [this.B] : [this.B, this.C]).forEach(
      (e) => {
        t.push(this.projectOrthogonally(this.A, e)), t.push(
          this.projectOrthogonally(this.A, e, -this.strokeProjectionMagnitude)
        );
      }
    ), t;
  }
  /**
   * MITER
   * Calculation: the corner is formed by extending the outer edges of the stroke
   * at the tangents of the path segments until they intersect.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-1-miter
   */
  projectMiter() {
    const t = [], e = Math.abs(this.alpha), s = 1 / Math.sin(e / 2), i = this.scaleUnitVector(
      this.bisector,
      -this.strokeProjectionMagnitude * s
    ), r = this.options.strokeUniform ? ze(
      this.scaleUnitVector(this.bisector, this.options.strokeMiterLimit)
    ) : this.options.strokeMiterLimit;
    return ze(i) / this.strokeProjectionMagnitude <= r && t.push(this.applySkew(this.A.add(i))), t.push(...this.projectBevel()), t;
  }
  /**
   * ROUND (without skew)
   * Calculation: the projections are the two vectors parallel to X and Y axes
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-1-round-without-skew
   */
  projectRoundNoSkew(t, e) {
    const s = [], i = new m(
      ne.getOrthogonalRotationFactor(this.bisector),
      ne.getOrthogonalRotationFactor(
        new m(this.bisector.y, this.bisector.x)
      )
    ), r = new m(1, 0).scalarMultiply(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar).multiply(i), o = new m(0, 1).scalarMultiply(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar).multiply(i);
    return [r, o].forEach((a) => {
      $s(a, t, e) && s.push(this.A.add(a));
    }), s;
  }
  /**
   * ROUND (with skew)
   * Calculation: the projections are the points furthest from the vertex in
   * the direction of the X and Y axes after distortion.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-2-round-skew
   */
  projectRoundWithSkew(t, e) {
    const s = [], { skewX: i, skewY: r, scaleX: o, scaleY: a, strokeUniform: h } = this.options, l = new m(
      Math.tan(I(i)),
      Math.tan(I(r))
    ), c = this.strokeProjectionMagnitude, u = h ? c / a / Math.sqrt(1 / a ** 2 + 1 / o ** 2 * l.y ** 2) : c / Math.sqrt(1 + l.y ** 2), f = new m(
      // Safe guard due to floating point precision. In some situations the square root
      // was returning NaN because of a negative number close to zero.
      Math.sqrt(Math.max(c ** 2 - u ** 2, 0)),
      u
    ), d = h ? c / Math.sqrt(
      1 + l.x ** 2 * (1 / a) ** 2 / (1 / o + 1 / o * l.x * l.y) ** 2
    ) : c / Math.sqrt(1 + l.x ** 2 / (1 + l.x * l.y) ** 2), g = new m(
      d,
      Math.sqrt(Math.max(c ** 2 - d ** 2, 0))
    );
    return [
      g,
      g.scalarMultiply(-1),
      f,
      f.scalarMultiply(-1)
    ].map(
      (p) => this.applySkew(
        h ? p.multiply(this.strokeUniformScalar) : p
      )
    ).forEach((p) => {
      $s(p, t, e) && s.push(this.applySkew(this.A).add(p));
    }), s;
  }
  projectRound() {
    const t = [];
    t.push(...this.projectBevel());
    const e = this.alpha % yt === 0, s = this.applySkew(this.A), i = t[e ? 0 : 2].subtract(s), r = t[e ? 1 : 0].subtract(s), o = e ? this.applySkew(this.AB.scalarMultiply(-1)) : this.applySkew(
      this.bisector.multiply(this.strokeUniformScalar).scalarMultiply(-1)
    ), a = re(i, o) > 0, h = a ? i : r, l = a ? r : i;
    return this.isSkewed() ? t.push(...this.projectRoundWithSkew(h, l)) : t.push(...this.projectRoundNoSkew(h, l)), t;
  }
  /**
   * Project stroke width on points returning projections for each point as follows:
   * - `miter`: 1 point corresponding to the outer boundary. If the miter limit is exceeded, it will be 2 points (becomes bevel)
   * - `bevel`: 2 points corresponding to the bevel possible boundaries, orthogonal to the stroke.
   * - `round`: same as `bevel` when it has no skew, with skew are 4 points.
   */
  projectPoints() {
    switch (this.options.strokeLineJoin) {
      case "miter":
        return this.projectMiter();
      case "round":
        return this.projectRound();
      default:
        return this.projectBevel();
    }
  }
  project() {
    return this.projectPoints().map((t) => ({
      originPoint: this.A,
      projectedPoint: t,
      angle: this.alpha,
      bisector: this.bisector
    }));
  }
}
class Zi extends dn {
  constructor(t, e, s) {
    super(s), this.A = new m(t), this.T = new m(e);
  }
  calcOrthogonalProjection(t, e, s = this.strokeProjectionMagnitude) {
    const i = this.createSideVector(t, e);
    return this.scaleUnitVector(mi(i), s);
  }
  /**
   * OPEN PATH START/END - Line cap: Butt
   * Calculation: to find the projections, just find the points orthogonal to the stroke
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#1-1-butt
   */
  projectButt() {
    return [
      this.projectOrthogonally(this.A, this.T, this.strokeProjectionMagnitude),
      this.projectOrthogonally(this.A, this.T, -this.strokeProjectionMagnitude)
    ];
  }
  /**
   * OPEN PATH START/END - Line cap: Round
   * Calculation: same as stroke line join `round`
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#1-2-round
   */
  projectRound() {
    const t = [];
    if (!this.isSkewed() && this.A.eq(this.T)) {
      const e = new m(1, 1).scalarMultiply(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar);
      t.push(
        this.applySkew(this.A.add(e)),
        this.applySkew(this.A.subtract(e))
      );
    } else
      t.push(
        ...new ne(
          this.A,
          this.T,
          this.T,
          this.options
        ).projectRound()
      );
    return t;
  }
  /**
   * OPEN PATH START/END - Line cap: Square
   * Calculation: project a rectangle of points on the stroke in the opposite direction of the vector `AT`
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#1-3-square
   */
  projectSquare() {
    const t = [];
    if (this.A.eq(this.T)) {
      const e = new m(1, 1).scalarMultiply(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar);
      t.push(this.A.add(e), this.A.subtract(e));
    } else {
      const e = this.calcOrthogonalProjection(
        this.A,
        this.T,
        this.strokeProjectionMagnitude
      ), s = this.scaleUnitVector(
        ms(this.createSideVector(this.A, this.T)),
        -this.strokeProjectionMagnitude
      ), i = this.A.add(s);
      t.push(
        i.add(e),
        i.subtract(e)
      );
    }
    return t.map((e) => this.applySkew(e));
  }
  projectPoints() {
    switch (this.options.strokeLineCap) {
      case "round":
        return this.projectRound();
      case "square":
        return this.projectSquare();
      default:
        return this.projectButt();
    }
  }
  project() {
    return this.projectPoints().map((t) => ({
      originPoint: this.A,
      projectedPoint: t
    }));
  }
}
const gn = (n, t, e = !1) => {
  const s = [];
  if (n.length === 0)
    return s;
  const i = n.reduce(
    (r, o) => (r[r.length - 1].eq(o) || r.push(new m(o)), r),
    [new m(n[0])]
  );
  if (i.length === 1)
    e = !0;
  else if (!e) {
    const r = i[0], o = qa(i, (a) => !a.eq(r));
    i.splice(o + 1);
  }
  return i.forEach((r, o, a) => {
    let h, l;
    o === 0 ? (l = a[1], h = e ? r : a[a.length - 1]) : o === a.length - 1 ? (h = a[o - 1], l = e ? r : a[0]) : (h = a[o - 1], l = a[o + 1]), e && a.length === 1 ? s.push(
      ...new Zi(r, r, t).project()
    ) : e && (o === 0 || o === a.length - 1) ? s.push(
      ...new Zi(
        r,
        o === 0 ? l : h,
        t
      ).project()
    ) : s.push(
      ...new ne(r, h, l, t).project()
    );
  }), s;
}, Oi = (n) => {
  const t = {};
  return Object.keys(n).forEach((e) => {
    t[e] = {}, Object.keys(n[e]).forEach((s) => {
      t[e][s] = { ...n[e][s] };
    });
  }), t;
}, Ja = (n, t = !1) => `${n.charAt(0).toUpperCase()}${t ? n.slice(1) : n.slice(1).toLowerCase()}`, pn = (n) => n.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
let oe;
const Qa = () => (oe || (oe = "Intl" in Ot() && "Segmenter" in Intl && new Intl.Segmenter(void 0, {
  granularity: "grapheme"
})), oe), Cs = (n) => {
  if (oe || Qa(), oe) {
    const t = oe.segment(n);
    return Array.from(t).map(({ segment: e }) => e);
  }
  return Za(n);
}, Za = (n) => {
  const t = [];
  for (let e = 0, s; e < n.length; e++)
    (s = th(n, e)) !== !1 && t.push(s);
  return t;
}, th = (n, t) => {
  const e = n.charCodeAt(t);
  if (isNaN(e))
    return "";
  if (e < 55296 || e > 57343)
    return n.charAt(t);
  if (55296 <= e && e <= 56319) {
    if (n.length <= t + 1)
      throw "High surrogate without following low surrogate";
    const i = n.charCodeAt(t + 1);
    if (56320 > i || i > 57343)
      throw "High surrogate without following low surrogate";
    return n.charAt(t) + n.charAt(t + 1);
  }
  if (t === 0)
    throw "Low surrogate without preceding high surrogate";
  const s = n.charCodeAt(t - 1);
  if (55296 > s || s > 56319)
    throw "Low surrogate without preceding high surrogate";
  return !1;
}, eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  capitalize: Ja,
  escapeXml: pn,
  graphemeSplit: Cs
}, Symbol.toStringTag, { value: "Module" })), Ss = (n, t, e = !1) => n.fill !== t.fill || n.stroke !== t.stroke || n.strokeWidth !== t.strokeWidth || n.fontSize !== t.fontSize || n.fontFamily !== t.fontFamily || n.fontWeight !== t.fontWeight || n.fontStyle !== t.fontStyle || n.textDecorationThickness !== t.textDecorationThickness || n.textBackgroundColor !== t.textBackgroundColor || n.deltaY !== t.deltaY || e && (n.overline !== t.overline || n.underline !== t.underline || n.linethrough !== t.linethrough), mn = (n, t) => {
  const e = t.split(`
`), s = [];
  let i = -1, r = {};
  n = Oi(n);
  for (let o = 0; o < e.length; o++) {
    const a = Cs(e[o]);
    if (!n[o]) {
      i += a.length, r = {};
      continue;
    }
    for (let h = 0; h < a.length; h++) {
      i++;
      const l = n[o][h];
      l && Object.keys(l).length > 0 && (Ss(r, l, !0) ? s.push({
        start: i,
        end: i + 1,
        style: l
      }) : s[s.length - 1].end++), r = l || {};
    }
  }
  return s;
}, _n = (n, t) => {
  if (!Array.isArray(n))
    return Oi(n);
  const e = t.split(ii), s = {};
  let i = -1, r = 0;
  for (let o = 0; o < e.length; o++) {
    const a = Cs(e[o]);
    for (let h = 0; h < a.length; h++)
      i++, n[r] && n[r].start <= i && i < n[r].end && (s[o] = s[o] || {}, s[o][h] = { ...n[r].style }, i === n[r].end - 1 && r++);
  }
  return s;
}, Yt = [
  "display",
  "transform",
  X,
  "fill-opacity",
  "fill-rule",
  "opacity",
  H,
  "stroke-dasharray",
  "stroke-linecap",
  "stroke-dashoffset",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "id",
  "paint-order",
  "vector-effect",
  "instantiated_by_use",
  "clip-path"
];
function yn(n, t) {
  const e = n.nodeName, s = n.getAttribute("class"), i = n.getAttribute("id"), r = "(?![a-zA-Z\\-]+)";
  let o;
  if (o = new RegExp("^" + e, "i"), t = t.replace(o, ""), i && t.length && (o = new RegExp("#" + i + r, "i"), t = t.replace(o, "")), s && t.length) {
    const a = s.split(" ");
    for (let h = a.length; h--; )
      o = new RegExp("\\." + a[h] + r, "i"), t = t.replace(o, "");
  }
  return t.length === 0;
}
function sh(n, t) {
  let e, s = !0;
  for (; n.parentElement && n.parentElement.nodeType === 1 && t.length; )
    s && (e = t.pop()), n = n.parentElement, s = yn(n, e);
  return t.length === 0;
}
function ih(n, t) {
  let e = !0;
  const s = yn(n, t.pop());
  return s && t.length && (e = sh(n, t)), s && e && t.length === 0;
}
function rh(n, t = {}) {
  let e = {};
  for (const s in t)
    ih(n, s.split(" ")) && (e = {
      ...e,
      ...t[s]
    });
  return e;
}
const nh = (n) => Qo[n] ?? n, oh = new RegExp(`(${mt})`, "gi"), ah = (n) => qe(
  n.replace(oh, " $1 ").replace(/,/gi, " ")
), q = `(${mt})`, hh = String.raw`(skewX)\(${q}\)`, lh = String.raw`(skewY)\(${q}\)`, ch = String.raw`(rotate)\(${q}(?: ${q} ${q})?\)`, uh = String.raw`(scale)\(${q}(?: ${q})?\)`, fh = String.raw`(translate)\(${q}(?: ${q})?\)`, dh = String.raw`(matrix)\(${q} ${q} ${q} ${q} ${q} ${q}\)`, Di = `(?:${dh}|${fh}|${ch}|${uh}|${hh}|${lh})`, gh = `(?:${Di}*)`, ph = String.raw`^\s*(?:${gh}?)\s*$`, mh = new RegExp(ph), _h = new RegExp(Di), yh = new RegExp(Di, "g");
function Qe(n) {
  n = ah(n).replace(/\s*([()])\s*/gi, "$1");
  const t = [];
  if (!n || n && !mh.test(n))
    return [...J];
  for (const e of n.matchAll(yh)) {
    const s = _h.exec(e[0]);
    if (!s)
      continue;
    let i = J;
    const r = s.filter((g) => !!g), [, o, ...a] = r, [h, l, c, u, f, d] = a.map(
      (g) => parseFloat(g)
    );
    switch (o) {
      case "translate":
        i = pe(h, l);
        break;
      case ri:
        i = Kt({ angle: h }, { x: l, y: c });
        break;
      case us:
        i = ds(h, l);
        break;
      case de:
        i = hi(h);
        break;
      case ge:
        i = li(h);
        break;
      case "matrix":
        i = [h, l, c, u, f, d];
        break;
    }
    t.push(i);
  }
  return fs(t);
}
function vh(n, t, e, s) {
  const i = Array.isArray(t);
  let r, o = t;
  if ((n === X || n === H) && t === K)
    o = "";
  else {
    if (n === "strokeUniform")
      return t === "non-scaling-stroke";
    if (n === "strokeDashArray")
      t === K ? o = null : o = t.replace(/,/g, " ").split(/\s+/).map(parseFloat);
    else if (n === "transformMatrix")
      e && e.transformMatrix ? o = B(
        e.transformMatrix,
        Qe(t)
      ) : o = Qe(t);
    else if (n === "visible")
      o = t !== K && t !== "hidden", e && e.visible === !1 && (o = !1);
    else if (n === "opacity")
      o = parseFloat(t), e && typeof e.opacity < "u" && (o *= e.opacity);
    else if (n === "textAnchor")
      o = t === "start" ? P : t === "end" ? Y : T;
    else if (n === "charSpacing" || n === Ht)
      r = U(t, s) / s * 1e3;
    else if (n === "paintFirst") {
      const a = t.indexOf(X), h = t.indexOf(H);
      o = X, (a > -1 && h > -1 && h < a || a === -1 && h > -1) && (o = H);
    } else {
      if (n === "href" || n === "xlink:href" || n === "font" || n === "id")
        return t;
      if (n === "imageSmoothing")
        return t === "optimizeQuality";
      r = i ? t.map(U) : U(t, s);
    }
  }
  return !i && isNaN(r) ? o : r;
}
function Ch(n, t) {
  const e = n.match(No);
  if (!e)
    return;
  const s = e[1], i = e[3], r = e[4], o = e[5], a = e[6];
  s && (t.fontStyle = s), i && (t.fontWeight = isNaN(parseFloat(i)) ? i : parseFloat(i)), r && (t.fontSize = U(r)), a && (t.fontFamily = a), o && (t.lineHeight = o === "normal" ? 1 : o);
}
function Sh(n, t) {
  Object.entries(n).forEach(([e, s]) => {
    s !== void 0 && (t[e.toLowerCase()] = s);
  });
}
function Us(n, t) {
  n.replace(/;\s*$/, "").split(";").forEach((e) => {
    if (!e) return;
    const [s, i] = e.split(":");
    t[s.trim().toLowerCase()] = i.trim();
  });
}
function wh(n) {
  const t = {}, e = n.getAttribute("style");
  return e && (typeof e == "string" ? Us(e, t) : Sh(e, t)), t;
}
const xh = {
  stroke: "strokeOpacity",
  fill: "fillOpacity"
};
function bh(n) {
  const t = z.getDefaults();
  return Object.entries(xh).forEach(([e, s]) => {
    if (typeof n[s] > "u" || n[e] === "")
      return;
    if (typeof n[e] > "u") {
      if (!t[e])
        return;
      n[e] = t[e];
    }
    if (n[e].indexOf("url(") === 0)
      return;
    const i = new E(n[e]);
    n[e] = i.setAlpha(F(i.getAlpha() * n[s], 2)).toRgba();
  }), n;
}
function Ft(n, t, e) {
  if (!n)
    return {};
  let s = {}, i, r = si;
  n.parentNode && qi.test(n.parentNode.nodeName) && (s = Ft(
    n.parentElement,
    t,
    e
  ), s.fontSize && (i = r = U(s.fontSize)));
  const o = {
    ...t.reduce((l, c) => {
      const u = n.getAttribute(c);
      return u && (l[c] = u), l;
    }, {}),
    // add values parsed from style, which take precedence over attributes
    // (see: http://www.w3.org/TR/SVG/styling.html#UsingPresentationAttributes)
    ...rh(n, e),
    ...wh(n)
  };
  o[Es] && n.setAttribute(Es, o[Es]), o[Ps] && (i = U(o[Ps], r), o[Ps] = `${i}`);
  const a = {};
  for (const l in o) {
    const c = nh(l), u = vh(
      c,
      o[l],
      s,
      i
    );
    a[c] = u;
  }
  a && a.font && Ch(a.font, a);
  const h = { ...s, ...a };
  return qi.test(n.nodeName) ? h : bh(h);
}
const Th = {
  rx: 0,
  ry: 0
}, tr = ["rx", "ry"];
class Nt extends z {
  static type = "Rect";
  static cacheProperties = [...At, ...tr];
  static ownDefaults = Th;
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Nt.ownDefaults
    };
  }
  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(t) {
    super(), Object.assign(this, Nt.ownDefaults), this.setOptions(t), this._initRxRy();
  }
  /**
   * Initializes rx/ry attributes
   * @private
   */
  _initRxRy() {
    const { rx: t, ry: e } = this;
    t && !e ? this.ry = t : e && !t && (this.rx = e);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(t) {
    const { width: e, height: s } = this, i = -e / 2, r = -s / 2, o = this.rx ? Math.min(this.rx, e / 2) : 0, a = this.ry ? Math.min(this.ry, s / 2) : 0, h = o !== 0 || a !== 0;
    t.beginPath(), t.moveTo(i + o, r), t.lineTo(i + e - o, r), h && t.bezierCurveTo(
      i + e - Lt * o,
      r,
      i + e,
      r + Lt * a,
      i + e,
      r + a
    ), t.lineTo(i + e, r + s - a), h && t.bezierCurveTo(
      i + e,
      r + s - Lt * a,
      i + e - Lt * o,
      r + s,
      i + e - o,
      r + s
    ), t.lineTo(i + o, r + s), h && t.bezierCurveTo(
      i + Lt * o,
      r + s,
      i,
      r + s - Lt * a,
      i,
      r + s - a
    ), t.lineTo(i, r + a), h && t.bezierCurveTo(i, r + Lt * a, i + Lt * o, r, i + o, r), t.closePath(), this._renderPaintInOrder(t);
  }
  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(t = []) {
    return super.toObject([...tr, ...t]);
  }
  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const { width: t, height: e, rx: s, ry: i } = this;
    return [
      "<rect ",
      "COMMON_PARTS",
      `x="${-t / 2}" y="${-e / 2}" rx="${s}" ry="${i}" width="${t}" height="${e}" />
`
    ];
  }
  /**
   * List of attribute names to account for when parsing SVG element (used by `Rect.fromElement`)
   * @see: http://www.w3.org/TR/SVG/shapes.html#RectElement
   */
  static ATTRIBUTE_NAMES = [
    ...Yt,
    "x",
    "y",
    "rx",
    "ry",
    "width",
    "height"
  ];
  /* _FROM_SVG_START_ */
  /**
   * Returns {@link Rect} instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   */
  static async fromElement(t, e, s) {
    const {
      left: i = 0,
      top: r = 0,
      width: o = 0,
      height: a = 0,
      visible: h = !0,
      ...l
    } = Ft(t, this.ATTRIBUTE_NAMES, s);
    return new this({
      ...e,
      ...l,
      left: i,
      top: r,
      width: o,
      height: a,
      visible: !!(h && o && a)
    });
  }
  /* _FROM_SVG_END_ */
}
x.setClass(Nt);
x.setSVGClass(Nt);
const Dt = "initialization", Ze = "added", ki = "removed", ts = "imperative", Oh = "object_modified", Dh = "object_modifying", vn = (n, t) => {
  const {
    strokeUniform: e,
    strokeWidth: s,
    width: i,
    height: r,
    group: o
  } = t, a = o && o !== n ? Fe(
    o.calcTransformMatrix(),
    n.calcTransformMatrix()
  ) : null, h = a ? t.getRelativeCenterPoint().transform(a) : t.getRelativeCenterPoint(), l = !t.isStrokeAccountedForInDimensions(), c = e && l ? jr(
    new m(s, s),
    void 0,
    n.calcTransformMatrix()
  ) : ni, u = !e && l ? s : 0, f = ps(
    i + u,
    r + u,
    fs([a, t.calcOwnMatrix()], !0)
  ).add(c).scalarDivide(2);
  return [h.subtract(f), h.add(f)];
};
class Mi {
  /**
   * override by subclass for persistence (TS does not support `static abstract`)
   */
  static type = "strategy";
  /**
   * Used by the `LayoutManager` to perform layout
   * @TODO/fix: if this method is calcResult, should calc unconditionally.
   * the condition to not calc should be evaluated by the layoutManager.
   * @returns layout result **OR** `undefined` to skip layout
   */
  calcLayoutResult(t, e) {
    if (this.shouldPerformLayout(t))
      return this.calcBoundingBox(e, t);
  }
  shouldPerformLayout({ type: t, prevStrategy: e, strategy: s }) {
    return t === Dt || t === ts || !!e && s !== e;
  }
  shouldLayoutClipPath({ type: t, target: { clipPath: e } }) {
    return t !== Dt && e && !e.absolutePositioned;
  }
  getInitialSize(t, e) {
    return e.size;
  }
  /**
   * Override this method to customize layout.
   */
  calcBoundingBox(t, e) {
    const { type: s, target: i } = e;
    if (s === ts && e.overrides)
      return e.overrides;
    if (t.length === 0)
      return;
    const { left: r, top: o, width: a, height: h } = wt(
      t.map((f) => vn(i, f)).reduce((f, d) => f.concat(d), [])
    ), l = new m(a, h), u = new m(r, o).add(l.scalarDivide(2));
    if (s === Dt) {
      const f = this.getInitialSize(e, {
        size: l,
        center: u
      });
      return {
        // in `initialization` we do not account for target's transformation matrix
        center: u,
        // TODO: investigate if this is still necessary
        relativeCorrection: new m(0, 0),
        size: f
      };
    } else
      return {
        center: u.transform(i.calcOwnMatrix()),
        size: l
      };
  }
}
class Cn extends Mi {
  static type = "fit-content";
  /**
   * @override layout on all triggers
   * Override at will
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldPerformLayout(t) {
    return !0;
  }
}
x.setClass(Cn);
const Sn = "layoutManager";
class De {
  strategy;
  constructor(t = new Cn()) {
    this.strategy = t, this._subscriptions = /* @__PURE__ */ new Map();
  }
  performLayout(t) {
    const e = {
      bubbles: !0,
      strategy: this.strategy,
      ...t,
      prevStrategy: this._prevLayoutStrategy,
      stopPropagation() {
        this.bubbles = !1;
      }
    };
    this.onBeforeLayout(e);
    const s = this.getLayoutResult(e);
    s && this.commitLayout(e, s), this.onAfterLayout(e, s), this._prevLayoutStrategy = e.strategy;
  }
  /**
   * Attach handlers for events that we know will invalidate the layout when
   * performed on child objects ( general transforms ).
   * Returns the disposers for later unsubscribing and cleanup
   * @param {FabricObject} object
   * @param {RegistrationContext & Partial<StrictLayoutContext>} context
   * @returns {VoidFunction[]} disposers remove the handlers
   */
  attachHandlers(t, e) {
    const { target: s } = e;
    return [
      We,
      _r,
      be,
      yr,
      cs,
      vr,
      $e,
      Cr,
      So
    ].map(
      (i) => t.on(
        i,
        (r) => this.performLayout(
          i === We ? {
            type: Oh,
            trigger: i,
            e: r,
            target: s
          } : {
            type: Dh,
            trigger: i,
            e: r,
            target: s
          }
        )
      )
    );
  }
  /**
   * Subscribe an object to transform events that will trigger a layout change on the parent
   * This is important only for interactive groups.
   * @param object
   * @param context
   */
  subscribe(t, e) {
    this.unsubscribe(t, e);
    const s = this.attachHandlers(t, e);
    this._subscriptions.set(t, s);
  }
  /**
   * unsubscribe object layout triggers
   */
  unsubscribe(t, e) {
    (this._subscriptions.get(t) || []).forEach((s) => s()), this._subscriptions.delete(t);
  }
  unsubscribeTargets(t) {
    t.targets.forEach((e) => this.unsubscribe(e, t));
  }
  subscribeTargets(t) {
    t.targets.forEach((e) => this.subscribe(e, t));
  }
  onBeforeLayout(t) {
    const { target: e, type: s } = t, { canvas: i } = e;
    if (s === Dt || s === Ze ? this.subscribeTargets(t) : s === ki && this.unsubscribeTargets(t), e.fire("layout:before", {
      context: t
    }), i && i.fire("object:layout:before", {
      target: e,
      context: t
    }), s === ts && t.deep) {
      const { strategy: r, ...o } = t;
      e.forEachObject(
        (a) => a.layoutManager && a.layoutManager.performLayout({
          ...o,
          bubbles: !1,
          target: a
        })
      );
    }
  }
  getLayoutResult(t) {
    const { target: e, strategy: s, type: i } = t, r = s.calcLayoutResult(t, e.getObjects());
    if (!r)
      return;
    const o = i === Dt ? new m() : e.getRelativeCenterPoint(), {
      center: a,
      correction: h = new m(),
      relativeCorrection: l = new m()
    } = r, c = o.subtract(a).add(h).transform(
      // in `initialization` we do not account for target's transformation matrix
      i === Dt ? J : st(e.calcOwnMatrix()),
      !0
    ).add(l);
    return {
      result: r,
      prevCenter: o,
      nextCenter: a,
      offset: c
    };
  }
  commitLayout(t, e) {
    const { target: s } = t, {
      result: { size: i },
      nextCenter: r
    } = e;
    s.set({ width: i.x, height: i.y }), this.layoutObjects(t, e), t.type === Dt ? s.set({
      left: t.x ?? r.x + i.x * V(s.originX),
      top: t.y ?? r.y + i.y * V(s.originY)
    }) : (s.setPositionByOrigin(r, T, T), s.setCoords(), s.set("dirty", !0));
  }
  layoutObjects(t, e) {
    const { target: s } = t;
    s.forEachObject((i) => {
      i.group === s && this.layoutObject(t, e, i);
    }), t.strategy.shouldLayoutClipPath(t) && this.layoutObject(t, e, s.clipPath);
  }
  /**
   * @param {FabricObject} object
   * @param {Point} offset
   */
  layoutObject(t, { offset: e }, s) {
    s.set({
      left: s.left + e.x,
      top: s.top + e.y
    });
  }
  onAfterLayout(t, e) {
    const {
      target: s,
      strategy: i,
      bubbles: r,
      prevStrategy: o,
      ...a
    } = t, { canvas: h } = s;
    s.fire("layout:after", {
      context: t,
      result: e
    }), h && h.fire("object:layout:after", {
      context: t,
      result: e,
      target: s
    });
    const l = s.parent;
    r && l?.layoutManager && ((a.path || (a.path = [])).push(s), l.layoutManager.performLayout({
      ...a,
      target: l
    })), s.set("dirty", !0);
  }
  dispose() {
    const { _subscriptions: t } = this;
    t.forEach((e) => e.forEach((s) => s())), t.clear();
  }
  toObject() {
    return {
      type: Sn,
      strategy: this.strategy.constructor.type
    };
  }
  toJSON() {
    return this.toObject();
  }
}
x.setClass(De, Sn);
class kh extends De {
  performLayout() {
  }
}
const Mh = {
  strokeWidth: 0,
  subTargetCheck: !1,
  interactive: !1
};
class Tt extends Sr(
  z
) {
  /**
   * Used internally to optimize performance
   * Once an object is selected, instance is rendered without the selected object.
   * This way instance is cached only once for the entire interaction with the selected object.
   * @private
   */
  _activeObjects = [];
  static type = "Group";
  static ownDefaults = Mh;
  __objectSelectionTracker;
  __objectSelectionDisposer;
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Tt.ownDefaults
    };
  }
  /**
   * Constructor
   *
   * @param {FabricObject[]} [objects] instance objects
   * @param {Object} [options] Options object
   */
  constructor(t = [], e = {}) {
    super(), Object.assign(this, Tt.ownDefaults), this.setOptions(e), this.groupInit(t, e);
  }
  /**
   * Shared code between group and active selection
   * Meant to be used by the constructor.
   */
  groupInit(t, e) {
    this._objects = [...t], this.__objectSelectionTracker = this.__objectSelectionMonitor.bind(
      this,
      !0
    ), this.__objectSelectionDisposer = this.__objectSelectionMonitor.bind(
      this,
      !1
    ), this.forEachObject((s) => {
      this.enterGroup(s, !1);
    }), this.layoutManager = e.layoutManager ?? new De(), this.layoutManager.performLayout({
      type: Dt,
      target: this,
      targets: [...t],
      // @TODO remove this concept from the layout manager.
      // Layout manager will calculate the correct position,
      // group options can override it later.
      x: e.left,
      y: e.top
    });
  }
  /**
   * Checks if object can enter group and logs relevant warnings
   * @private
   * @param {FabricObject} object
   * @returns
   */
  canEnterGroup(t) {
    return t === this || this.isDescendantOf(t) ? (Mt(
      "error",
      "Group: circular object trees are not supported, this call has no effect"
    ), !1) : this._objects.indexOf(t) !== -1 ? (Mt(
      "error",
      "Group: duplicate objects are not supported inside group, this call has no effect"
    ), !1) : !0;
  }
  /**
   * Override this method to enhance performance (for groups with a lot of objects).
   * If Overriding, be sure not pass illegal objects to group - it will break your app.
   * @private
   */
  _filterObjectsBeforeEnteringGroup(t) {
    return t.filter((e, s, i) => this.canEnterGroup(e) && i.indexOf(e) === s);
  }
  /**
   * Add objects
   * @param {...FabricObject[]} objects
   */
  add(...t) {
    const e = this._filterObjectsBeforeEnteringGroup(t), s = super.add(...e);
    return this._onAfterObjectsChange(Ze, e), s;
  }
  /**
   * Inserts an object into collection at specified index
   * @param {FabricObject[]} objects Object to insert
   * @param {Number} index Index to insert object at
   */
  insertAt(t, ...e) {
    const s = this._filterObjectsBeforeEnteringGroup(e), i = super.insertAt(t, ...s);
    return this._onAfterObjectsChange(Ze, s), i;
  }
  /**
   * Remove objects
   * @param {...FabricObject[]} objects
   * @returns {FabricObject[]} removed objects
   */
  remove(...t) {
    const e = super.remove(...t);
    return this._onAfterObjectsChange(ki, e), e;
  }
  _onObjectAdded(t) {
    this.enterGroup(t, !0), this.fire("object:added", { target: t }), t.fire("added", { target: this });
  }
  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  _onObjectRemoved(t, e) {
    this.exitGroup(t, e), this.fire("object:removed", { target: t }), t.fire("removed", { target: this });
  }
  /**
   * @private
   * @param {'added'|'removed'} type
   * @param {FabricObject[]} targets
   */
  _onAfterObjectsChange(t, e) {
    this.layoutManager.performLayout({
      type: t,
      targets: e,
      target: this
    });
  }
  _onStackOrderChanged() {
    this._set("dirty", !0);
  }
  /**
   * @private
   * @param {string} key
   * @param {*} value
   */
  _set(t, e) {
    const s = this[t];
    return super._set(t, e), t === "canvas" && s !== e && (this._objects || []).forEach((i) => {
      i._set(t, e);
    }), this;
  }
  /**
   * @private
   */
  _shouldSetNestedCoords() {
    return this.subTargetCheck;
  }
  /**
   * Remove all objects
   * @returns {FabricObject[]} removed objects
   */
  removeAll() {
    return this._activeObjects = [], this.remove(...this._objects);
  }
  /**
   * keeps track of the selected objects
   * @private
   */
  __objectSelectionMonitor(t, {
    target: e
  }) {
    const s = this._activeObjects;
    if (t)
      s.push(e), this._set("dirty", !0);
    else if (s.length > 0) {
      const i = s.indexOf(e);
      i > -1 && (s.splice(i, 1), this._set("dirty", !0));
    }
  }
  /**
   * @private
   * @param {boolean} watch
   * @param {FabricObject} object
   */
  _watchObject(t, e) {
    t && this._watchObject(!1, e), t ? (e.on("selected", this.__objectSelectionTracker), e.on("deselected", this.__objectSelectionDisposer)) : (e.off("selected", this.__objectSelectionTracker), e.off("deselected", this.__objectSelectionDisposer));
  }
  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   */
  enterGroup(t, e) {
    t.group && t.group.remove(t), t._set("parent", this), this._enterGroup(t, e);
  }
  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   */
  _enterGroup(t, e) {
    e && le(
      t,
      B(
        st(this.calcTransformMatrix()),
        t.calcTransformMatrix()
      )
    ), this._shouldSetNestedCoords() && t.setCoords(), t._set("group", this), t._set("canvas", this.canvas), this._watchObject(!0, t);
    const s = this.canvas && this.canvas.getActiveObject && this.canvas.getActiveObject();
    s && (s === t || t.isDescendantOf(s)) && this._activeObjects.push(t);
  }
  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  exitGroup(t, e) {
    this._exitGroup(t, e), t._set("parent", void 0), t._set("canvas", void 0);
  }
  /**
   * Executes the inner fabric logic of exiting a group.
   * - Stop watching the object
   * - Remove the object from the optimization map this._activeObjects
   * - unset the group property of the object
   * @protected
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  _exitGroup(t, e) {
    t._set("group", void 0), e || (le(
      t,
      B(
        this.calcTransformMatrix(),
        t.calcTransformMatrix()
      )
    ), t.setCoords()), this._watchObject(!1, t);
    const s = this._activeObjects.length > 0 ? this._activeObjects.indexOf(t) : -1;
    s > -1 && this._activeObjects.splice(s, 1);
  }
  /**
   * Decide if the group should cache or not. Create its own cache level
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step.
   * Generally you do not cache objects in groups because the group is already cached.
   * @return {Boolean}
   */
  shouldCache() {
    const t = z.prototype.shouldCache.call(this);
    if (t) {
      for (let e = 0; e < this._objects.length; e++)
        if (this._objects[e].willDrawShadow())
          return this.ownCaching = !1, !1;
    }
    return t;
  }
  /**
   * Check if this object or a child object will cast a shadow
   * @return {Boolean}
   */
  willDrawShadow() {
    if (super.willDrawShadow())
      return !0;
    for (let t = 0; t < this._objects.length; t++)
      if (this._objects[t].willDrawShadow())
        return !0;
    return !1;
  }
  /**
   * Check if instance or its group are caching, recursively up
   * @return {Boolean}
   */
  isOnACache() {
    return this.ownCaching || !!this.parent && this.parent.isOnACache();
  }
  /**
   * Execute the drawing operation for an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawObject(t, e, s) {
    this._renderBackground(t);
    for (let i = 0; i < this._objects.length; i++) {
      const r = this._objects[i];
      this.canvas?.preserveObjectStacking && r.group !== this ? (t.save(), t.transform(...st(this.calcTransformMatrix())), r.render(t), t.restore()) : r.group === this && r.render(t);
    }
    this._drawClipPath(t, this.clipPath, s);
  }
  /**
   * @override
   * @return {Boolean}
   */
  setCoords() {
    super.setCoords(), this._shouldSetNestedCoords() && this.forEachObject((t) => t.setCoords());
  }
  triggerLayout(t = {}) {
    this.layoutManager.performLayout({
      target: this,
      type: ts,
      ...t
    });
  }
  /**
   * Renders instance on a given context
   * @param {CanvasRenderingContext2D} ctx context to render instance on
   */
  render(t) {
    this._transformDone = !0, super.render(t), this._transformDone = !1;
  }
  /**
   *
   * @private
   * @param {'toObject'|'toDatalessObject'} [method]
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @returns {FabricObject[]} serialized objects
   */
  __serializeObjects(t, e) {
    const s = this.includeDefaultValues;
    return this._objects.filter(function(i) {
      return !i.excludeFromExport;
    }).map(function(i) {
      const r = i.includeDefaultValues;
      i.includeDefaultValues = s;
      const o = i[t || "toObject"](e);
      return i.includeDefaultValues = r, o;
    });
  }
  /**
   * Returns object representation of an instance
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(t = []) {
    const e = this.layoutManager.toObject();
    return {
      ...super.toObject([
        "subTargetCheck",
        "interactive",
        ...t
      ]),
      ...e.strategy !== "fit-content" || this.includeDefaultValues ? { layoutManager: e } : {},
      objects: this.__serializeObjects(
        "toObject",
        t
      )
    };
  }
  toString() {
    return `#<Group: (${this.complexity()})>`;
  }
  dispose() {
    this.layoutManager.unsubscribeTargets({
      targets: this.getObjects(),
      target: this
    }), this._activeObjects = [], this.forEachObject((t) => {
      this._watchObject(!1, t), t.dispose();
    }), super.dispose();
  }
  /**
   * @private
   */
  _createSVGBgRect(t) {
    if (!this.backgroundColor)
      return "";
    const e = Nt.prototype._toSVG.call(this), s = e.indexOf("COMMON_PARTS");
    e[s] = 'for="group" ';
    const i = e.join("");
    return t ? t(i) : i;
  }
  /**
   * Returns svg representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  _toSVG(t) {
    const e = ["<g ", "COMMON_PARTS", ` >
`], s = this._createSVGBgRect(t);
    s && e.push("		", s);
    for (let i = 0; i < this._objects.length; i++)
      e.push("		", this._objects[i].toSVG(t));
    return e.push(`</g>
`), e;
  }
  /**
   * Returns styles-string for svg-export, specific version for group
   * @return {String}
   */
  getSvgStyles() {
    const t = typeof this.opacity < "u" && this.opacity !== 1 ? `opacity: ${this.opacity};` : "", e = this.visible ? "" : " visibility: hidden;";
    return [t, this.getSvgFilter(), e].join("");
  }
  /**
   * Returns svg clipPath representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toClipPathSVG(t) {
    const e = [], s = this._createSVGBgRect(t);
    s && e.push("	", s);
    for (let i = 0; i < this._objects.length; i++)
      e.push("	", this._objects[i].toClipPathSVG(t));
    return this._createBaseClipPathSVGMarkup(e, {
      reviver: t
    });
  }
  /**
   * @todo support loading from svg
   * @private
   * @param {Object} object Object to create a group from
   * @returns {Promise<Group>}
   */
  static fromObject({ type: t, objects: e = [], layoutManager: s, ...i }, r) {
    return Promise.all([
      ae(e, r),
      Ae(i, r)
    ]).then(([o, a]) => {
      const h = new this(o, {
        ...i,
        ...a,
        layoutManager: new kh()
      });
      if (s) {
        const l = x.getClass(
          s.type
        ), c = x.getClass(
          s.strategy
        );
        h.layoutManager = new l(new c());
      } else
        h.layoutManager = new De();
      return h.layoutManager.subscribeTargets({
        type: Dt,
        target: h,
        targets: h.getObjects()
      }), h.setCoords(), h;
    });
  }
}
x.setClass(Tt);
const Ph = (n, t) => n && n.length === 1 ? n[0] : new Tt(n, t), wn = (n, t) => Math.min(
  t.width / n.width,
  t.height / n.height
), xn = (n, t) => Math.max(
  t.width / n.width,
  t.height / n.height
), qs = "\\s*,?\\s*", me = `${qs}(${mt})`, Eh = `${me}${me}${me}${qs}([01])${qs}([01])${me}${me}`, Ah = "[mzlhvcsqta][^mzlhvcsqta]*", Fh = {
  m: "l",
  M: "L"
}, Lh = (n, t, e, s, i, r, o, a, h, l, c) => {
  const u = vt(n), f = Ct(n), d = vt(t), g = Ct(t), p = e * i * d - s * r * g + o, _ = s * i * d + e * r * g + a, y = l + h * (-e * i * f - s * r * u), v = c + h * (-s * i * f + e * r * u), S = p + h * (e * i * g + s * r * d), C = _ + h * (s * i * g - e * r * d);
  return ["C", y, v, S, C, p, _];
}, Rh = (n, t, e, s, i, r, o) => {
  if (e === 0 || s === 0)
    return [];
  let a = 0, h = 0, l = 0;
  const c = Math.PI, u = o * ei, f = Ct(u), d = vt(u), g = 0.5 * (-d * n - f * t), p = 0.5 * (-d * t + f * n), _ = e ** 2, y = s ** 2, v = p ** 2, S = g ** 2, C = _ * y - _ * v - y * S;
  let w = Math.abs(e), b = Math.abs(s);
  if (C < 0) {
    const et = Math.sqrt(1 - C / (_ * y));
    w *= et, b *= et;
  } else
    l = (i === r ? -1 : 1) * Math.sqrt(C / (_ * v + y * S));
  const D = l * w * p / b, O = -l * b * g / w, A = d * D - f * O + n * 0.5, W = f * D + d * O + t * 0.5;
  let Z = er(1, 0, (g - D) / w, (p - O) / b), R = er(
    (g - D) / w,
    (p - O) / b,
    (-g - D) / w,
    (-p - O) / b
  );
  r === 0 && R > 0 ? R -= 2 * c : r === 1 && R < 0 && (R += 2 * c);
  const N = Math.ceil(Math.abs(R / c * 2)), k = [], L = R / N, tt = 8 / 3 * Math.sin(L / 4) * Math.sin(L / 4) / Math.sin(L / 2);
  let ft = Z + L;
  for (let et = 0; et < N; et++)
    k[et] = Lh(
      Z,
      ft,
      d,
      f,
      w,
      b,
      A,
      W,
      tt,
      a,
      h
    ), a = k[et][5], h = k[et][6], Z = ft, ft += L;
  return k;
}, er = (n, t, e, s) => {
  const i = Math.atan2(t, n), r = Math.atan2(s, e);
  return r >= i ? r - i : 2 * Math.PI - (i - r);
}, jh = (n) => n ** 3, Bh = (n) => 3 * n ** 2 * (1 - n), Ih = (n) => 3 * n * (1 - n) ** 2, Yh = (n) => (1 - n) ** 3;
function Ks(n, t, e, s, i, r, o, a) {
  let h;
  if (M.cachesBoundsOfCurve && (h = [...arguments].join(), ve.boundsOfCurveCache[h]))
    return ve.boundsOfCurveCache[h];
  const l = Math.sqrt, c = Math.abs, u = [], f = [
    [0, 0],
    [0, 0]
  ];
  let d = 6 * n - 12 * e + 6 * i, g = -3 * n + 9 * e - 9 * i + 3 * o, p = 3 * e - 3 * n;
  for (let C = 0; C < 2; ++C) {
    if (C > 0 && (d = 6 * t - 12 * s + 6 * r, g = -3 * t + 9 * s - 9 * r + 3 * a, p = 3 * s - 3 * t), c(g) < 1e-12) {
      if (c(d) < 1e-12)
        continue;
      const A = -p / d;
      0 < A && A < 1 && u.push(A);
      continue;
    }
    const w = d * d - 4 * p * g;
    if (w < 0)
      continue;
    const b = l(w), D = (-d + b) / (2 * g);
    0 < D && D < 1 && u.push(D);
    const O = (-d - b) / (2 * g);
    0 < O && O < 1 && u.push(O);
  }
  let _ = u.length;
  const y = _, v = Tn(
    n,
    t,
    e,
    s,
    i,
    r,
    o,
    a
  );
  for (; _--; ) {
    const { x: C, y: w } = v(u[_]);
    f[0][_] = C, f[1][_] = w;
  }
  f[0][y] = n, f[1][y] = t, f[0][y + 1] = o, f[1][y + 1] = a;
  const S = [
    new m(Math.min(...f[0]), Math.min(...f[1])),
    new m(Math.max(...f[0]), Math.max(...f[1]))
  ];
  return M.cachesBoundsOfCurve && (ve.boundsOfCurveCache[h] = S), S;
}
const Vh = (n, t, [e, s, i, r, o, a, h, l]) => {
  const c = Rh(h - n, l - t, s, i, o, a, r);
  for (let u = 0, f = c.length; u < f; u++)
    c[u][1] += n, c[u][2] += t, c[u][3] += n, c[u][4] += t, c[u][5] += n, c[u][6] += t;
  return c;
}, bn = (n) => {
  let t = 0, e = 0, s = 0, i = 0;
  const r = [];
  let o, a = 0, h = 0;
  for (const l of n) {
    const c = [...l];
    let u;
    switch (c[0]) {
      case "l":
        c[1] += t, c[2] += e;
      // falls through
      case "L":
        t = c[1], e = c[2], u = ["L", t, e];
        break;
      case "h":
        c[1] += t;
      // falls through
      case "H":
        t = c[1], u = ["L", t, e];
        break;
      case "v":
        c[1] += e;
      // falls through
      case "V":
        e = c[1], u = ["L", t, e];
        break;
      case "m":
        c[1] += t, c[2] += e;
      // falls through
      case "M":
        t = c[1], e = c[2], s = c[1], i = c[2], u = ["M", t, e];
        break;
      case "c":
        c[1] += t, c[2] += e, c[3] += t, c[4] += e, c[5] += t, c[6] += e;
      // falls through
      case "C":
        a = c[3], h = c[4], t = c[5], e = c[6], u = ["C", c[1], c[2], a, h, t, e];
        break;
      case "s":
        c[1] += t, c[2] += e, c[3] += t, c[4] += e;
      // falls through
      case "S":
        o === "C" ? (a = 2 * t - a, h = 2 * e - h) : (a = t, h = e), t = c[3], e = c[4], u = ["C", a, h, c[1], c[2], t, e], a = u[3], h = u[4];
        break;
      case "q":
        c[1] += t, c[2] += e, c[3] += t, c[4] += e;
      // falls through
      case "Q":
        a = c[1], h = c[2], t = c[3], e = c[4], u = ["Q", a, h, t, e];
        break;
      case "t":
        c[1] += t, c[2] += e;
      // falls through
      case "T":
        o === "Q" ? (a = 2 * t - a, h = 2 * e - h) : (a = t, h = e), t = c[1], e = c[2], u = ["Q", a, h, t, e];
        break;
      case "a":
        c[6] += t, c[7] += e;
      // falls through
      case "A":
        Vh(t, e, c).forEach((f) => r.push(f)), t = c[6], e = c[7];
        break;
      case "z":
      case "Z":
        t = s, e = i, u = ["Z"];
        break;
    }
    u ? (r.push(u), o = u[0]) : o = "";
  }
  return r;
}, es = (n, t, e, s) => Math.sqrt((e - n) ** 2 + (s - t) ** 2), Tn = (n, t, e, s, i, r, o, a) => (h) => {
  const l = jh(h), c = Bh(h), u = Ih(h), f = Yh(h);
  return new m(
    o * l + i * c + e * u + n * f,
    a * l + r * c + s * u + t * f
  );
}, On = (n) => n ** 2, Dn = (n) => 2 * n * (1 - n), kn = (n) => (1 - n) ** 2, Xh = (n, t, e, s, i, r, o, a) => (h) => {
  const l = On(h), c = Dn(h), u = kn(h), f = 3 * (u * (e - n) + c * (i - e) + l * (o - i)), d = 3 * (u * (s - t) + c * (r - s) + l * (a - r));
  return Math.atan2(d, f);
}, $h = (n, t, e, s, i, r) => (o) => {
  const a = On(o), h = Dn(o), l = kn(o);
  return new m(
    i * a + e * h + n * l,
    r * a + s * h + t * l
  );
}, Wh = (n, t, e, s, i, r) => (o) => {
  const a = 1 - o, h = 2 * (a * (e - n) + o * (i - e)), l = 2 * (a * (s - t) + o * (r - s));
  return Math.atan2(l, h);
}, sr = (n, t, e) => {
  let s = new m(t, e), i = 0;
  for (let r = 1; r <= 100; r += 1) {
    const o = n(r / 100);
    i += es(s.x, s.y, o.x, o.y), s = o;
  }
  return i;
}, ir = (n, t) => {
  let e = 0, s = 0, i = { x: n.x, y: n.y }, r = { ...i }, o, a = 0.01, h = 0;
  const l = n.iterator, c = n.angleFinder;
  for (; s < t && a > 1e-4; )
    r = l(e), h = e, o = es(i.x, i.y, r.x, r.y), o + s > t ? (e -= a, a /= 2) : (i = r, e += a, s += o);
  return { ...r, angle: c(h) };
}, Pi = (n) => {
  let t = 0, e = 0, s = 0, i = 0, r = 0, o, a;
  const h = [];
  for (const l of n) {
    const c = {
      x: e,
      y: s,
      command: l[0],
      length: 0
    };
    switch (l[0]) {
      case "M":
        a = c, a.x = i = e = l[1], a.y = r = s = l[2];
        break;
      case "L":
        a = c, a.length = es(e, s, l[1], l[2]), e = l[1], s = l[2];
        break;
      case "C":
        o = Tn(
          e,
          s,
          l[1],
          l[2],
          l[3],
          l[4],
          l[5],
          l[6]
        ), a = c, a.iterator = o, a.angleFinder = Xh(
          e,
          s,
          l[1],
          l[2],
          l[3],
          l[4],
          l[5],
          l[6]
        ), a.length = sr(o, e, s), e = l[5], s = l[6];
        break;
      case "Q":
        o = $h(
          e,
          s,
          l[1],
          l[2],
          l[3],
          l[4]
        ), a = c, a.iterator = o, a.angleFinder = Wh(
          e,
          s,
          l[1],
          l[2],
          l[3],
          l[4]
        ), a.length = sr(o, e, s), e = l[3], s = l[4];
        break;
      case "Z":
        a = c, a.destX = i, a.destY = r, a.length = es(e, s, i, r), e = i, s = r;
        break;
    }
    t += a.length, h.push(a);
  }
  return h.push({ length: t, x: e, y: s }), h;
}, Mn = (n, t, e = Pi(n)) => {
  let s = 0;
  for (; t - e[s].length > 0 && s < e.length - 2; )
    t -= e[s].length, s++;
  const i = e[s], r = t / i.length, o = n[s];
  switch (i.command) {
    case "M":
      return { x: i.x, y: i.y, angle: 0 };
    case "Z":
      return {
        ...new m(i.x, i.y).lerp(
          new m(i.destX, i.destY),
          r
        ),
        angle: Math.atan2(i.destY - i.y, i.destX - i.x)
      };
    case "L":
      return {
        ...new m(i.x, i.y).lerp(
          new m(o[1], o[2]),
          r
        ),
        angle: Math.atan2(o[2] - i.y, o[1] - i.x)
      };
    case "C":
      return ir(i, t);
    case "Q":
      return ir(i, t);
  }
}, Gh = new RegExp(Ah, "gi"), rr = new RegExp(Eh, "g"), Hh = new RegExp(mt, "gi"), zh = {
  m: 2,
  l: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  t: 2,
  a: 7
}, Pn = (n) => {
  const t = [], e = n.match(Gh) ?? [];
  for (const s of e) {
    const i = s[0];
    if (i === "z" || i === "Z") {
      t.push([i]);
      continue;
    }
    const r = zh[i.toLowerCase()];
    let o = [];
    if (i === "a" || i === "A") {
      rr.lastIndex = 0;
      for (let a = null; a = rr.exec(s); )
        o.push(...a.slice(1));
    } else
      o = s.match(Hh) || [];
    for (let a = 0; a < o.length; a += r) {
      const h = new Array(r), l = Fh[i];
      h[0] = a > 0 && l ? l : i;
      for (let c = 0; c < r; c++)
        h[c + 1] = parseFloat(o[a + c]);
      t.push(h);
    }
  }
  return t;
}, En = (n, t = 0) => {
  let e = new m(n[0]), s = new m(n[1]), i = 1, r = 0;
  const o = [], a = n.length, h = a > 2;
  h && (i = n[2].x < s.x ? -1 : n[2].x === s.x ? 0 : 1, r = n[2].y < s.y ? -1 : n[2].y === s.y ? 0 : 1), o.push([
    "M",
    e.x - i * t,
    e.y - r * t
  ]);
  let l;
  for (l = 1; l < a; l++) {
    if (!e.eq(s)) {
      const c = e.midPointFrom(s);
      o.push(["Q", e.x, e.y, c.x, c.y]);
    }
    e = n[l], l + 1 < n.length && (s = n[l + 1]);
  }
  return h && (i = e.x > n[l - 2].x ? 1 : e.x === n[l - 2].x ? 0 : -1, r = e.y > n[l - 2].y ? 1 : e.y === n[l - 2].y ? 0 : -1), o.push([
    "L",
    e.x + i * t,
    e.y + r * t
  ]), o;
}, Nh = (n, t, e) => (e && (t = B(t, [
  1,
  0,
  0,
  1,
  -e.x,
  -e.y
])), n.map((s) => {
  const i = [...s];
  for (let r = 1; r < s.length - 1; r += 2) {
    const { x: o, y: a } = G(
      {
        x: s[r],
        y: s[r + 1]
      },
      t
    );
    i[r] = o, i[r + 1] = a;
  }
  return i;
})), Uh = (n, t) => {
  const e = Math.PI * 2 / n;
  let s = -Bt;
  n % 2 === 0 && (s += e / 2);
  const i = new Array(n + 1);
  for (let r = 0; r < n; r++) {
    const o = r * e + s, { x: a, y: h } = new m(vt(o), Ct(o)).scalarMultiply(t);
    i[r] = [r === 0 ? "M" : "L", a, h];
  }
  return i[n] = ["Z"], i;
}, Ei = (n, t) => n.map((e) => e.map((s, i) => i === 0 || t === void 0 ? s : F(s, t)).join(" ")).join(" "), qh = (n, t) => {
  let e = n, s = t;
  e.inverted && !s.inverted && (e = t, s = n), fi(s, s.group?.calcTransformMatrix(), e.calcTransformMatrix());
  const i = e.inverted && s.inverted;
  return i && (e.inverted = s.inverted = !1), new Tt([e], { clipPath: s, inverted: i });
}, Wt = (n, t) => Math.floor(Math.random() * (t - n + 1)) + n, Kh = (n) => {
  if (n.transformMatrix) {
    const { scaleX: t, scaleY: e, angle: s, skewX: i } = Gt(
      n.transformMatrix
    );
    n.flipX = !1, n.flipY = !1, n.set(Q, t), n.set(at, e), n.angle = s, n.skewX = i, n.skewY = 0;
  }
}, Ve = (n, t) => {
  let e = n._findCenterFromElement();
  n.transformMatrix && (Kh(n), e = e.transform(n.transformMatrix)), delete n.transformMatrix, t && (n.scaleX *= t.scaleX, n.scaleY *= t.scaleY, n.cropX = t.cropX, n.cropY = t.cropY, e.x += t.offsetLeft, e.y += t.offsetTop, n.width = t.width, n.height = t.height), n.setPositionByOrigin(e, T, T);
}, Nc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addTransformToObject: Lr,
  animate: wi,
  animateColor: qr,
  applyTransformToObject: le,
  calcAngleBetweenVectors: Ne,
  calcDimensionsMatrix: Ee,
  calcPlaneChangeMatrix: Fe,
  calcVectorRotation: pi,
  cancelAnimFrame: xr,
  capValue: zt,
  composeMatrix: kr,
  copyCanvasElement: Oo,
  cos: vt,
  createCanvasElement: ut,
  createImage: br,
  createRotateMatrix: Kt,
  createScaleMatrix: ds,
  createSkewXMatrix: hi,
  createSkewYMatrix: li,
  createTranslateMatrix: pe,
  createVector: Te,
  crossProduct: re,
  degreesToRadians: I,
  dotProduct: Ir,
  ease: Fa,
  enlivenObjectEnlivables: Ae,
  enlivenObjects: ae,
  findScaleToCover: xn,
  findScaleToFit: wn,
  getBoundsOfCurve: Ks,
  getOrthonormalVector: mi,
  getPathSegmentsInfo: Pi,
  getPointOnPath: Mn,
  getPointer: Fr,
  getRandomInt: Wt,
  getRegularPolygonPath: Uh,
  getSmoothPathFromPoints: En,
  getSvgAttributes: $o,
  getUnitVector: ms,
  groupSVGElements: Ph,
  hasStyleChanged: Ss,
  invertTransform: st,
  isBetweenVectors: $s,
  isIdentityMatrix: Tr,
  isTouchEvent: He,
  isTransparent: fn,
  joinPath: Ei,
  loadImage: Se,
  magnitude: ze,
  makeBoundingBoxFromPoints: wt,
  makePathSimpler: bn,
  matrixToSVG: he,
  mergeClipPaths: qh,
  multiplyTransformMatrices: B,
  multiplyTransformMatrixArray: fs,
  parsePath: Pn,
  parsePreserveAspectRatioAttribute: yi,
  parseUnit: U,
  pick: Jt,
  projectStrokeOnPoints: gn,
  qrDecompose: Gt,
  radiansToDegrees: Pt,
  removeFromArray: Vt,
  removeTransformFromObject: Lo,
  removeTransformMatrixForSvgParsing: Ve,
  requestAnimFrame: Ce,
  resetObjectTransform: Rr,
  rotateVector: gi,
  saveObjectTransform: ui,
  sendObjectToPlane: fi,
  sendPointToPlane: Et,
  sendVectorToPlane: jr,
  sin: Ct,
  sizeAfterTransform: ps,
  string: eh,
  stylesFromArray: _n,
  stylesToArray: mn,
  toBlob: ai,
  toDataURL: oi,
  toFixed: F,
  transformPath: Nh,
  transformPoint: G
}, Symbol.toStringTag, { value: "Module" }));
function Js(n, t) {
  const e = n.style;
  e && Object.entries(t).forEach(
    ([s, i]) => e.setProperty(s, i)
  );
}
class Jh extends Ar {
  upper;
  container;
  constructor(t, {
    allowTouchScrolling: e = !1,
    containerClass: s = ""
  } = {}) {
    super(t);
    const { el: i } = this.lower, r = this.createUpperCanvas();
    this.upper = { el: r, ctx: r.getContext("2d") }, this.applyCanvasStyle(i, {
      allowTouchScrolling: e
    }), this.applyCanvasStyle(r, {
      allowTouchScrolling: e,
      styles: {
        position: "absolute",
        left: "0",
        top: "0"
      }
    });
    const o = this.createContainerElement();
    o.classList.add(s), i.parentNode && i.parentNode.replaceChild(o, i), o.append(i, r), this.container = o;
  }
  createUpperCanvas() {
    const { el: t } = this.lower, e = ut();
    return e.className = t.className, e.classList.remove("lower-canvas"), e.classList.add("upper-canvas"), e.setAttribute("data-fabric", "top"), e.style.cssText = t.style.cssText, e.setAttribute("draggable", "true"), e;
  }
  createContainerElement() {
    const t = fe().createElement("div");
    return t.setAttribute("data-fabric", "wrapper"), Js(t, {
      position: "relative"
    }), Xi(t), t;
  }
  /**
   * @private
   * @param {HTMLCanvasElement} element canvas element to apply styles on
   */
  applyCanvasStyle(t, e) {
    const { styles: s, allowTouchScrolling: i } = e;
    Js(t, {
      ...s,
      "touch-action": i ? "manipulation" : K
    }), Xi(t);
  }
  setDimensions(t, e) {
    super.setDimensions(t, e);
    const { el: s, ctx: i } = this.upper;
    Er(s, i, t, e);
  }
  setCSSDimensions(t) {
    super.setCSSDimensions(t), Xs(this.upper.el, t), Xs(this.container, t);
  }
  cleanupDOM(t) {
    const e = this.container, { el: s } = this.lower, { el: i } = this.upper;
    super.cleanupDOM(t), e.removeChild(i), e.removeChild(s), e.parentNode && e.parentNode.replaceChild(s, e);
  }
  dispose() {
    super.dispose(), bt().dispose(this.upper.el), delete this.upper, delete this.container;
  }
}
const Qh = {
  uniformScaling: !0,
  uniScaleKey: "shiftKey",
  centeredScaling: !1,
  centeredRotation: !1,
  centeredKey: "altKey",
  altActionKey: "shiftKey",
  selection: !0,
  selectionKey: "shiftKey",
  selectionColor: "rgba(100, 100, 255, 0.3)",
  selectionDashArray: [],
  selectionBorderColor: "rgba(255, 255, 255, 0.3)",
  selectionLineWidth: 1,
  selectionFullyContained: !1,
  hoverCursor: "move",
  moveCursor: "move",
  defaultCursor: "default",
  freeDrawingCursor: "crosshair",
  notAllowedCursor: "not-allowed",
  perPixelTargetFind: !1,
  targetFindTolerance: 0,
  skipTargetFind: !1,
  stopContextMenu: !0,
  fireRightClick: !0,
  fireMiddleClick: !0,
  enablePointerEvents: !1,
  containerClass: "canvas-container",
  preserveObjectStacking: !0
};
class Ai extends gs {
  /**
   * hold the list of nested targets hovered in the previous events
   * @type FabricObject[]
   * @private
   */
  _hoveredTargets = [];
  /**
   * hold a reference to a data structure that contains information
   * on the current on going transform
   * @type
   * @private
   */
  _currentTransform = null;
  /**
   * hold a reference to a data structure used to track the selection
   * box on canvas drag
   * on the current on going transform
   * x, y, deltaX and deltaY are in scene plane
   * @type
   * @private
   */
  _groupSelector = null;
  /**
   * internal flag used to understand if the context top requires a cleanup
   * in case this is true, the contextTop will be cleared at the next render
   * @type boolean
   * @private
   */
  contextTopDirty = !1;
  static ownDefaults = Qh;
  static getDefaults() {
    return { ...super.getDefaults(), ...Ai.ownDefaults };
  }
  get upperCanvasEl() {
    return this.elements.upper?.el;
  }
  get contextTop() {
    return this.elements.upper?.ctx;
  }
  get wrapperEl() {
    return this.elements.container;
  }
  initElements(t) {
    this.elements = new Jh(t, {
      allowTouchScrolling: this.allowTouchScrolling,
      containerClass: this.containerClass
    }), this._createCacheCanvas();
  }
  /**
   * @private
   * @param {FabricObject} obj Object that was added
   */
  _onObjectAdded(t) {
    this._objectsToRender = void 0, super._onObjectAdded(t);
  }
  /**
   * @private
   * @param {FabricObject} obj Object that was removed
   */
  _onObjectRemoved(t) {
    this._objectsToRender = void 0, t === this._activeObject && (this.fire("before:selection:cleared", { deselected: [t] }), this._discardActiveObject(), this.fire("selection:cleared", { deselected: [t] }), t.fire("deselected", {
      target: t
    })), t === this._hoveredTarget && (this._hoveredTarget = void 0, this._hoveredTargets = []), super._onObjectRemoved(t);
  }
  _onStackOrderChanged() {
    this._objectsToRender = void 0, super._onStackOrderChanged();
  }
  /**
   * Divides objects in two groups, one to render immediately
   * and one to render as activeGroup.
   * @return {Array} objects to render immediately and pushes the other in the activeGroup.
   */
  _chooseObjectsToRender() {
    const t = this._activeObject;
    return !this.preserveObjectStacking && t ? this._objects.filter((e) => !e.group && e !== t).concat(t) : this._objects;
  }
  /**
   * Renders both the top canvas and the secondary container canvas.
   */
  renderAll() {
    this.cancelRequestedRender(), !this.destroyed && (this.contextTopDirty && !this._groupSelector && !this.isDrawingMode && (this.clearContext(this.contextTop), this.contextTopDirty = !1), this.hasLostContext && (this.renderTopLayer(this.contextTop), this.hasLostContext = !1), !this._objectsToRender && (this._objectsToRender = this._chooseObjectsToRender()), this.renderCanvas(this.getContext(), this._objectsToRender));
  }
  /**
   * text selection is rendered by the active text instance during the rendering cycle
   */
  renderTopLayer(t) {
    t.save(), this.isDrawingMode && this._isCurrentlyDrawing && (this.freeDrawingBrush && this.freeDrawingBrush._render(), this.contextTopDirty = !0), this.selection && this._groupSelector && (this._drawSelection(t), this.contextTopDirty = !0), t.restore();
  }
  /**
   * Method to render only the top canvas.
   * Also used to render the group selection box.
   * Does not render text selection.
   */
  renderTop() {
    const t = this.contextTop;
    this.clearContext(t), this.renderTopLayer(t), this.fire("after:render", { ctx: t });
  }
  /**
   * Set the canvas tolerance value for pixel taret find.
   * Use only integer numbers.
   * @private
   */
  setTargetFindTolerance(t) {
    t = Math.round(t), this.targetFindTolerance = t;
    const e = this.getRetinaScaling(), s = Math.ceil((t * 2 + 1) * e);
    this.pixelFindCanvasEl.width = this.pixelFindCanvasEl.height = s, this.pixelFindContext.scale(e, e);
  }
  /**
   * Returns true if object is transparent at a certain location
   * Clarification: this is `is target transparent at location X or are controls there`
   * @TODO this seems dumb that we treat controls with transparency. we can find controls
   * programmatically without painting them, the cache canvas optimization is always valid
   * @param {FabricObject} target Object to check
   * @param {Number} x Left coordinate in viewport space
   * @param {Number} y Top coordinate in viewport space
   * @return {Boolean}
   */
  isTargetTransparent(t, e, s) {
    const i = this.targetFindTolerance, r = this.pixelFindContext;
    this.clearContext(r), r.save(), r.translate(-e + i, -s + i), r.transform(...this.viewportTransform);
    const o = t.selectionBackgroundColor;
    t.selectionBackgroundColor = "", t.render(r), t.selectionBackgroundColor = o, r.restore();
    const a = Math.round(i * this.getRetinaScaling());
    return fn(
      r,
      a,
      a,
      a
    );
  }
  /**
   * takes an event and determines if selection key has been pressed
   * @private
   * @param {TPointerEvent} e Event object
   */
  _isSelectionKeyPressed(t) {
    const e = this.selectionKey;
    return e ? Array.isArray(e) ? !!e.find((s) => !!s && t[s] === !0) : t[e] : !1;
  }
  /**
   * @private
   * @param {TPointerEvent} e Event object
   * @param {FabricObject} target
   */
  _shouldClearSelection(t, e) {
    const s = this.getActiveObjects(), i = this._activeObject;
    return !!(!e || e && i && s.length > 1 && s.indexOf(e) === -1 && i !== e && !this._isSelectionKeyPressed(t) || e && !e.evented || e && !e.selectable && i && i !== e);
  }
  /**
   * This method will take in consideration a modifier key pressed and the control we are
   * about to drag, and try to guess the anchor point ( origin ) of the transormation.
   * This should be really in the realm of controls, and we should remove specific code for legacy
   * embedded actions.
   * @TODO this probably deserve discussion/rediscovery and change/refactor
   * @private
   * @deprecated
   * @param {FabricObject} target
   * @param {string} action
   * @param {boolean} altKey
   * @returns {boolean} true if the transformation should be centered
   */
  _shouldCenterTransform(t, e, s) {
    if (!t)
      return;
    let i;
    return e === us || e === Q || e === at || e === be ? i = this.centeredScaling || t.centeredScaling : e === ri && (i = this.centeredRotation || t.centeredRotation), i ? !s : s;
  }
  /**
   * Given the control clicked, determine the origin of the transform.
   * This is bad because controls can totally have custom names
   * should disappear before release 4.0
   * @private
   * @deprecated
   */
  _getOriginFromCorner(t, e) {
    const s = {
      x: t.originX,
      y: t.originY
    };
    return e && (["ml", "tl", "bl"].includes(e) ? s.x = Y : ["mr", "tr", "br"].includes(e) && (s.x = P), ["tl", "mt", "tr"].includes(e) ? s.y = Vs : ["bl", "mb", "br"].includes(e) && (s.y = it)), s;
  }
  /**
   * @private
   * @param {Event} e Event object
   * @param {FabricObject} target
   * @param {boolean} [alreadySelected] pass true to setup the active control
   */
  _setupCurrentTransform(t, e, s) {
    const i = e.group ? (
      // transform pointer to target's containing coordinate plane
      Et(
        this.getScenePoint(t),
        void 0,
        e.group.calcTransformMatrix()
      )
    ) : this.getScenePoint(t), { key: r = "", control: o } = e.getActiveControl() || {}, a = s && o ? o.getActionHandler(t, e, o)?.bind(o) : Xr, h = Bo(s, r, t, e), l = t[this.centeredKey], c = this._shouldCenterTransform(e, h, l) ? { x: T, y: T } : this._getOriginFromCorner(e, r), u = {
      target: e,
      action: h,
      actionHandler: a,
      actionPerformed: !1,
      corner: r,
      scaleX: e.scaleX,
      scaleY: e.scaleY,
      skewX: e.skewX,
      skewY: e.skewY,
      offsetX: i.x - e.left,
      offsetY: i.y - e.top,
      originX: c.x,
      originY: c.y,
      ex: i.x,
      ey: i.y,
      lastX: i.x,
      lastY: i.y,
      theta: I(e.angle),
      width: e.width,
      height: e.height,
      shiftKey: t.shiftKey,
      altKey: l,
      original: {
        ...ui(e),
        originX: c.x,
        originY: c.y
      }
    };
    this._currentTransform = u, this.fire("before:transform", {
      e: t,
      transform: u
    });
  }
  /**
   * Set the cursor type of the canvas element
   * @param {String} value Cursor type of the canvas element.
   * @see http://www.w3.org/TR/css3-ui/#cursor
   */
  setCursor(t) {
    this.upperCanvasEl.style.cursor = t;
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx to draw the selection on
   */
  _drawSelection(t) {
    const { x: e, y: s, deltaX: i, deltaY: r } = this._groupSelector, o = new m(e, s).transform(this.viewportTransform), a = new m(e + i, s + r).transform(
      this.viewportTransform
    ), h = this.selectionLineWidth / 2;
    let l = Math.min(o.x, a.x), c = Math.min(o.y, a.y), u = Math.max(o.x, a.x), f = Math.max(o.y, a.y);
    this.selectionColor && (t.fillStyle = this.selectionColor, t.fillRect(l, c, u - l, f - c)), !(!this.selectionLineWidth || !this.selectionBorderColor) && (t.lineWidth = this.selectionLineWidth, t.strokeStyle = this.selectionBorderColor, l += h, c += h, u -= h, f -= h, z.prototype._setLineDash.call(
      this,
      t,
      this.selectionDashArray
    ), t.strokeRect(l, c, u - l, f - c));
  }
  /**
   * This function is in charge of deciding which is the object that is the current target of an interaction event.
   * For interaction event we mean a pointer related action on the canvas.
   * Which is the
   * 11/09/2018 TODO: would be cool if findTarget could discern between being a full target
   * or the outside part of the corner.
   * @param {Event} e mouse event
   * @return {TargetsInfoWithContainer} the target found
   */
  findTarget(t) {
    if (this._targetInfo)
      return this._targetInfo;
    if (this.skipTargetFind)
      return {
        subTargets: [],
        currentSubTargets: []
      };
    const e = this.getScenePoint(t), s = this._activeObject, i = this.getActiveObjects(), r = this.searchPossibleTargets(this._objects, e), {
      subTargets: o,
      container: a,
      target: h
    } = r, l = {
      ...r,
      currentSubTargets: o,
      currentContainer: a,
      currentTarget: h
    };
    if (!s)
      return l;
    const c = {
      ...this.searchPossibleTargets([s], e),
      currentSubTargets: o,
      currentContainer: a,
      currentTarget: h
    };
    return s.findControl(
      this.getViewportPoint(t),
      He(t)
    ) ? {
      ...c,
      target: s
      // we override target in case we are in the outside part of the corner.
    } : c.target && (i.length > 1 || !this.preserveObjectStacking || this.preserveObjectStacking && t[this.altSelectionKey]) ? c : l;
  }
  /**
   * Checks if the point is inside the object selection area including padding
   * @param {FabricObject} obj Object to test against
   * @param {Object} [pointer] point in scene coordinates
   * @return {Boolean} true if point is contained within an area of given object
   * @private
   */
  _pointIsInObjectSelectionArea(t, e) {
    let s = t.getCoords();
    const i = this.getZoom(), r = t.padding / i;
    if (r) {
      const [o, a, h, l] = s, c = Math.atan2(a.y - o.y, a.x - o.x), u = vt(c) * r, f = Ct(c) * r, d = u + f, g = u - f;
      s = [
        new m(o.x - g, o.y - d),
        new m(a.x + d, a.y - g),
        new m(h.x + g, h.y + d),
        new m(l.x - d, l.y + g)
      ];
    }
    return j.isPointInPolygon(e, s);
  }
  /**
   * Checks point is inside the object selection condition. Either area with padding
   * or over pixels if perPixelTargetFind is enabled
   * @param {FabricObject} obj Object to test against
   * @param {Point} pointer point from scene.
   * @return {Boolean} true if point is contained within an area of given object
   * @private
   */
  _checkTarget(t, e) {
    if (t && t.visible && t.evented && this._pointIsInObjectSelectionArea(t, e))
      if ((this.perPixelTargetFind || t.perPixelTargetFind) && !t.isEditing) {
        const s = e.transform(this.viewportTransform);
        if (!this.isTargetTransparent(t, s.x, s.y))
          return !0;
      } else
        return !0;
    return !1;
  }
  /**
   * Given an array of objects search possible targets under the pointer position
   * Returns an
   * @param {Array} objects objects array to look into
   * @param {Object} pointer x,y object of point of scene coordinates we want to check.
   * @param {Object} subTargets If passed, subtargets will be collected inside the array
   * @return {TargetsInfo} **top most object from given `objects`** that contains pointer
   * @private
   */
  _searchPossibleTargets(t, e, s) {
    let i = t.length;
    for (; i--; ) {
      const r = t[i];
      if (this._checkTarget(r, e)) {
        if (Ie(r) && r.subTargetCheck) {
          const { target: o } = this._searchPossibleTargets(
            r._objects,
            e,
            s
          );
          o && s.push(o);
        }
        return {
          target: r,
          subTargets: s
        };
      }
    }
    return {
      subTargets: []
    };
  }
  /**
   * Search inside an objects array the fiurst object that contains pointer
   * Collect subTargets of that object inside the subTargets array passed as parameter
   * @param {FabricObject[]} objects objects array to look into
   * @param {Point} pointer coordinates from viewport to check.
   * @return {FabricObject} **top most object on screen** that contains pointer
   */
  searchPossibleTargets(t, e) {
    const s = this._searchPossibleTargets(
      t,
      e,
      []
    );
    s.container = s.target;
    const { container: i, subTargets: r } = s;
    if (i && Ie(i) && i.interactive && r[0]) {
      for (let o = r.length - 1; o > 0; o--) {
        const a = r[o];
        if (!(Ie(a) && a.interactive))
          return s.target = a, s;
      }
      return s.target = r[0], s;
    }
    return s;
  }
  /**
   * @returns point existing in the same plane as the {@link HTMLCanvasElement},
   * `(0, 0)` being the top left corner of the {@link HTMLCanvasElement}.
   * This means that changes to the {@link viewportTransform} do not change the values of the point
   * and it remains unchanged from the viewer's perspective.
   *
   * @example
   * const scenePoint = sendPointToPlane(
   *  this.getViewportPoint(e),
   *  undefined,
   *  canvas.viewportTransform
   * );
   *
   */
  getViewportPoint(t) {
    return this._viewportPoint ? this._viewportPoint : this._getPointerImpl(t, !0);
  }
  /**
   * @returns point existing in the scene (the same plane as the plane {@link FabricObject#getCenterPoint} exists in).
   * This means that changes to the {@link viewportTransform} do not change the values of the point,
   * however, from the viewer's perspective, the point is changed.
   *
   * @example
   * const viewportPoint = sendPointToPlane(
   *  this.getScenePoint(e),
   *  canvas.viewportTransform
   * );
   *
   */
  getScenePoint(t) {
    return this._scenePoint ? this._scenePoint : this._getPointerImpl(t);
  }
  /**
   * Returns pointer relative to canvas.
   *
   * Use {@link getViewportPoint} or {@link getScenePoint} instead.
   *
   * @param {Event} e
   * @param {Boolean} [fromViewport] whether to return the point from the viewport or in the scene
   * @return {Point}
   */
  _getPointerImpl(t, e = !1) {
    const s = this.upperCanvasEl, i = s.getBoundingClientRect();
    let r = Fr(t), o = i.width || 0, a = i.height || 0;
    (!o || !a) && (it in i && Vs in i && (a = Math.abs(i.top - i.bottom)), Y in i && P in i && (o = Math.abs(i.right - i.left))), this.calcOffset(), r.x = r.x - this._offset.left, r.y = r.y - this._offset.top, e || (r = Et(r, void 0, this.viewportTransform));
    const h = this.getRetinaScaling();
    h !== 1 && (r.x /= h, r.y /= h);
    const l = o === 0 || a === 0 ? new m(1, 1) : new m(
      s.width / o,
      s.height / a
    );
    return r.multiply(l);
  }
  /**
   * Internal use only
   * @protected
   */
  _setDimensionsImpl(t, e) {
    this._resetTransformEventData(), super._setDimensionsImpl(t, e), this._isCurrentlyDrawing && this.freeDrawingBrush && this.freeDrawingBrush._setBrushStyles(this.contextTop);
  }
  _createCacheCanvas() {
    this.pixelFindCanvasEl = ut(), this.pixelFindContext = this.pixelFindCanvasEl.getContext("2d", {
      willReadFrequently: !0
    }), this.setTargetFindTolerance(this.targetFindTolerance);
  }
  /**
   * Returns context of top canvas where interactions are drawn
   * @returns {CanvasRenderingContext2D}
   */
  getTopContext() {
    return this.elements.upper.ctx;
  }
  /**
   * Returns context of canvas where object selection is drawn
   * @alias
   * @return {CanvasRenderingContext2D}
   */
  getSelectionContext() {
    return this.elements.upper.ctx;
  }
  /**
   * Returns &lt;canvas> element on which object selection is drawn
   * @return {HTMLCanvasElement}
   */
  getSelectionElement() {
    return this.elements.upper.el;
  }
  /**
   * Returns currently active object
   * @return {FabricObject | null} active object
   */
  getActiveObject() {
    return this._activeObject;
  }
  /**
   * Returns an array with the current selected objects
   * @return {FabricObject[]} active objects array
   */
  getActiveObjects() {
    const t = this._activeObject;
    return Xt(t) ? t.getObjects() : t ? [t] : [];
  }
  /**
   * @private
   * Compares the old activeObject with the current one and fires correct events
   * @param {FabricObject[]} oldObjects old activeObject
   * @param {TPointerEvent} e mouse event triggering the selection events
   */
  _fireSelectionEvents(t, e) {
    let s = !1, i = !1;
    const r = this.getActiveObjects(), o = [], a = [];
    t.forEach((h) => {
      r.includes(h) || (s = !0, h.fire("deselected", {
        e,
        target: h
      }), a.push(h));
    }), r.forEach((h) => {
      t.includes(h) || (s = !0, h.fire("selected", {
        e,
        target: h
      }), o.push(h));
    }), t.length > 0 && r.length > 0 ? (i = !0, s && this.fire("selection:updated", {
      e,
      selected: o,
      deselected: a
    })) : r.length > 0 ? (i = !0, this.fire("selection:created", {
      e,
      selected: o
    })) : t.length > 0 && (i = !0, this.fire("selection:cleared", {
      e,
      deselected: a
    })), i && (this._objectsToRender = void 0);
  }
  /**
   * Sets given object as the only active object on canvas
   * @param {FabricObject} object Object to set as an active one
   * @param {TPointerEvent} [e] Event (passed along when firing "object:selected")
   * @return {Boolean} true if the object has been selected
   */
  setActiveObject(t, e) {
    const s = this.getActiveObjects(), i = this._setActiveObject(t, e);
    return this._fireSelectionEvents(s, e), i;
  }
  /**
   * This is supposed to be equivalent to setActiveObject but without firing
   * any event. There is commitment to have this stay this way.
   * This is the functional part of setActiveObject.
   * @param {Object} object to set as active
   * @param {Event} [e] Event (passed along when firing "object:selected")
   * @return {Boolean} true if the object has been selected
   */
  _setActiveObject(t, e) {
    const s = this._activeObject;
    return s === t || !this._discardActiveObject(e, t) && this._activeObject || t.onSelect({ e }) ? !1 : (this._activeObject = t, Xt(t) && s !== t && t.set("canvas", this), t.setCoords(), !0);
  }
  /**
   * This is supposed to be equivalent to discardActiveObject but without firing
   * any selection events ( can still fire object transformation events ). There is commitment to have this stay this way.
   * This is the functional part of discardActiveObject.
   * @param {Event} [e] Event (passed along when firing "object:deselected")
   * @param {Object} object the next object to set as active, reason why we are discarding this
   * @return {Boolean} true if the active object has been discarded
   */
  _discardActiveObject(t, e) {
    const s = this._activeObject;
    return s ? s.onDeselect({ e: t, object: e }) ? !1 : (this._currentTransform && this._currentTransform.target === s && this.endCurrentTransform(t), Xt(s) && s === this._hoveredTarget && (this._hoveredTarget = void 0), this._activeObject = void 0, !0) : !1;
  }
  /**
   * Discards currently active object and fire events. If the function is called by fabric
   * as a consequence of a mouse event, the event is passed as a parameter and
   * sent to the fire function for the custom events. When used as a method the
   * e param does not have any application.
   * @param {event} e
   * @return {Boolean} true if the active object has been discarded
   */
  discardActiveObject(t) {
    const e = this.getActiveObjects(), s = this.getActiveObject();
    e.length && this.fire("before:selection:cleared", {
      e: t,
      deselected: [s]
    });
    const i = this._discardActiveObject(t);
    return this._fireSelectionEvents(e, t), i;
  }
  /**
   * End the current transform.
   * You don't usually need to call this method unless you are interrupting a user initiated transform
   * because of some other event ( a press of key combination, or something that block the user UX )
   * @param {Event} [e] send the mouse event that generate the finalize down, so it can be used in the event
   */
  endCurrentTransform(t) {
    const e = this._currentTransform;
    this._finalizeCurrentTransform(t), e && e.target && (e.target.isMoving = !1), this._currentTransform = null;
  }
  /**
   * @private
   * @param {Event} e send the mouse event that generate the finalize down, so it can be used in the event
   */
  _finalizeCurrentTransform(t) {
    const e = this._currentTransform, s = e.target, i = {
      e: t,
      target: s,
      transform: e,
      action: e.action
    };
    s._scaling && (s._scaling = !1), s.setCoords(), e.actionPerformed && (this.fire("object:modified", i), s.fire(We, i));
  }
  /**
   * Sets viewport transformation of this canvas instance
   * @param {Array} vpt a Canvas 2D API transform matrix
   */
  setViewportTransform(t) {
    super.setViewportTransform(t);
    const e = this._activeObject;
    e && e.setCoords();
  }
  /**
   * @override clears active selection ref and interactive canvas elements and contexts
   */
  destroy() {
    const t = this._activeObject;
    Xt(t) && (t.removeAll(), t.dispose()), delete this._activeObject, super.destroy(), this.pixelFindContext = null, this.pixelFindCanvasEl = void 0;
  }
  /**
   * Clears all contexts (background, main, top) of an instance
   */
  clear() {
    this.discardActiveObject(), this._activeObject = void 0, this.clearContext(this.contextTop), super.clear();
  }
  /**
   * Draws objects' controls (borders/controls)
   * @param {CanvasRenderingContext2D} ctx Context to render controls on
   */
  drawControls(t) {
    const e = this._activeObject;
    e && e._renderControls(t);
  }
  /**
   * @private
   */
  _toObject(t, e, s) {
    const i = this._realizeGroupTransformOnObject(t), r = super._toObject(t, e, s);
    return t.set(i), r;
  }
  /**
   * Realizes an object's group transformation on it
   * @private
   * @param {FabricObject} [instance] the object to transform (gets mutated)
   * @returns the original values of instance which were changed
   */
  _realizeGroupTransformOnObject(t) {
    const { group: e } = t;
    if (e && Xt(e) && this._activeObject === e) {
      const i = Jt(t, [
        "angle",
        "flipX",
        "flipY",
        P,
        Q,
        at,
        de,
        ge,
        it
      ]);
      return Lr(t, e.calcOwnMatrix()), i;
    } else
      return {};
  }
  /**
   * @private
   */
  _setSVGObject(t, e, s) {
    const i = this._realizeGroupTransformOnObject(e);
    super._setSVGObject(t, e, s), e.set(i);
  }
}
class Zh {
  targets = [];
  __disposer;
  constructor(t) {
    const e = () => {
      const { hiddenTextarea: i } = t.getActiveObject() || {};
      i && i.focus();
    }, s = t.upperCanvasEl;
    s.addEventListener("click", e), this.__disposer = () => s.removeEventListener("click", e);
  }
  exitTextEditing() {
    this.target = void 0, this.targets.forEach((t) => {
      t.isEditing && t.exitEditing();
    });
  }
  add(t) {
    this.targets.push(t);
  }
  remove(t) {
    this.unregister(t), Vt(this.targets, t);
  }
  register(t) {
    this.target = t;
  }
  unregister(t) {
    t === this.target && (this.target = void 0);
  }
  onMouseMove(t) {
    this.target?.isEditing && this.target.updateSelectionOnMouseMove(t);
  }
  clear() {
    this.targets = [], this.target = void 0;
  }
  dispose() {
    this.clear(), this.__disposer(), delete this.__disposer;
  }
}
const nt = { passive: !1 }, ee = (n, t) => {
  const e = n.getViewportPoint(t), s = n.getScenePoint(t);
  return {
    viewportPoint: e,
    scenePoint: s
  };
}, Rt = (n, ...t) => n.addEventListener(...t), lt = (n, ...t) => n.removeEventListener(...t), tl = {
  mouse: {
    in: "over",
    out: "out",
    targetIn: "mouseover",
    targetOut: "mouseout",
    canvasIn: "mouse:over",
    canvasOut: "mouse:out"
  },
  drag: {
    in: "enter",
    out: "leave",
    targetIn: "dragenter",
    targetOut: "dragleave",
    canvasIn: "drag:enter",
    canvasOut: "drag:leave"
  }
};
class nr extends Ai {
  /**
   * a boolean that keeps track of the click state during a cycle of mouse down/up.
   * If a mouse move occurs it becomes false.
   * Is true by default, turns false on mouse move.
   * Used to determine if a mouseUp is a click
   */
  _isClick;
  textEditingManager = new Zh(this);
  constructor(t, e = {}) {
    super(t, e), [
      "_onMouseDown",
      "_onTouchStart",
      "_onMouseMove",
      "_onMouseUp",
      "_onTouchEnd",
      "_onResize",
      // '_onGesture',
      // '_onDrag',
      // '_onShake',
      // '_onLongPress',
      // '_onOrientationChange',
      "_onMouseWheel",
      "_onMouseOut",
      "_onMouseEnter",
      "_onContextMenu",
      "_onClick",
      "_onDragStart",
      "_onDragEnd",
      "_onDragProgress",
      "_onDragOver",
      "_onDragEnter",
      "_onDragLeave",
      "_onDrop"
    ].forEach((s) => {
      this[s] = this[s].bind(this);
    }), this.addOrRemove(Rt, "add");
  }
  /**
   * return an event prefix pointer or mouse.
   * @private
   */
  _getEventPrefix() {
    return this.enablePointerEvents ? "pointer" : "mouse";
  }
  addOrRemove(t, e) {
    const s = this.upperCanvasEl, i = this._getEventPrefix();
    t(Pr(s), "resize", this._onResize), t(s, i + "down", this._onMouseDown), t(
      s,
      `${i}move`,
      this._onMouseMove,
      nt
    ), t(s, `${i}out`, this._onMouseOut), t(s, `${i}enter`, this._onMouseEnter), t(s, "wheel", this._onMouseWheel, { passive: !1 }), t(s, "contextmenu", this._onContextMenu), t(s, "click", this._onClick), t(s, "dblclick", this._onClick), t(s, "dragstart", this._onDragStart), t(s, "dragend", this._onDragEnd), t(s, "dragover", this._onDragOver), t(s, "dragenter", this._onDragEnter), t(s, "dragleave", this._onDragLeave), t(s, "drop", this._onDrop), this.enablePointerEvents || t(s, "touchstart", this._onTouchStart, nt);
  }
  /**
   * Removes all event listeners, used when disposing the instance
   */
  removeListeners() {
    this.addOrRemove(lt, "remove");
    const t = this._getEventPrefix(), e = gt(this.upperCanvasEl);
    lt(
      e,
      `${t}up`,
      this._onMouseUp
    ), lt(
      e,
      "touchend",
      this._onTouchEnd,
      nt
    ), lt(
      e,
      `${t}move`,
      this._onMouseMove,
      nt
    ), lt(
      e,
      "touchmove",
      this._onMouseMove,
      nt
    ), clearTimeout(this._willAddMouseDown);
  }
  /**
   * @private
   * @param {Event} [e] Event object fired on wheel event
   */
  _onMouseWheel(t) {
    this._cacheTransformEventData(t), this._handleEvent(t, "wheel"), this._resetTransformEventData();
  }
  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onMouseOut(t) {
    const e = this._hoveredTarget, s = {
      e: t,
      ...ee(this, t)
    };
    this.fire("mouse:out", { ...s, target: e }), this._hoveredTarget = void 0, e && e.fire("mouseout", { ...s }), this._hoveredTargets.forEach((i) => {
      this.fire("mouse:out", { ...s, target: i }), i && i.fire("mouseout", { ...s });
    }), this._hoveredTargets = [];
  }
  /**
   * @private
   * Used when the mouse cursor enter the canvas from outside
   * @param {Event} e Event object fired on mouseenter
   */
  _onMouseEnter(t) {
    const { target: e } = this.findTarget(t);
    !this._currentTransform && !e && (this.fire("mouse:over", {
      e: t,
      ...ee(this, t)
    }), this._hoveredTarget = void 0, this._hoveredTargets = []);
  }
  /**
   * supports native like text dragging
   * @private
   * @param {DragEvent} e
   */
  _onDragStart(t) {
    this._isClick = !1;
    const e = this.getActiveObject();
    if (e && e.onDragStart(t)) {
      this._dragSource = e;
      const s = { e: t, target: e };
      this.fire("dragstart", s), e.fire("dragstart", s), Rt(
        this.upperCanvasEl,
        "drag",
        this._onDragProgress
      );
      return;
    }
    $i(t);
  }
  /**
   * First we clear top context where the effects are being rendered.
   * Then we render the effects.
   * Doing so will render the correct effect for all cases including an overlap between `source` and `target`.
   * @private
   */
  _renderDragEffects(t, e, s) {
    let i = !1;
    const r = this._dropTarget;
    r && r !== e && r !== s && (r.clearContextTop(), i = !0), e?.clearContextTop(), s !== e && s?.clearContextTop();
    const o = this.contextTop;
    o.save(), o.transform(...this.viewportTransform), e && (o.save(), e.transform(o), e.renderDragSourceEffect(t), o.restore(), i = !0), s && (o.save(), s.transform(o), s.renderDropTargetEffect(t), o.restore(), i = !0), o.restore(), i && (this.contextTopDirty = !0);
  }
  /**
   * supports native like text dragging
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
   * @private
   * @param {DragEvent} e
   */
  _onDragEnd(t) {
    const { currentSubTargets: e } = this.findTarget(t), s = !!t.dataTransfer && t.dataTransfer.dropEffect !== K, i = s ? this._activeObject : void 0, r = {
      e: t,
      target: this._dragSource,
      subTargets: e,
      dragSource: this._dragSource,
      didDrop: s,
      dropTarget: i
    };
    lt(
      this.upperCanvasEl,
      "drag",
      this._onDragProgress
    ), this.fire("dragend", r), this._dragSource && this._dragSource.fire("dragend", r), delete this._dragSource, this._onMouseUp(t);
  }
  /**
   * fire `drag` event on canvas and drag source
   * @private
   * @param {DragEvent} e
   */
  _onDragProgress(t) {
    const e = {
      e: t,
      target: this._dragSource,
      dragSource: this._dragSource,
      dropTarget: this._draggedoverTarget
    };
    this.fire("drag", e), this._dragSource && this._dragSource.fire("drag", e);
  }
  /**
   * prevent default to allow drop event to be fired
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#specifying_drop_targets
   * @private
   * @param {DragEvent} [e] Event object fired on Event.js shake
   */
  _onDragOver(t) {
    const e = "dragover", { currentContainer: s, currentSubTargets: i } = this.findTarget(t), r = this._dragSource, o = {
      e: t,
      target: s,
      subTargets: i,
      dragSource: r,
      canDrop: !1,
      dropTarget: void 0
    };
    let a;
    this.fire(e, o), this._fireEnterLeaveEvents(t, s, o), s && (s.canDrop(t) && (a = s), s.fire(e, o));
    for (let h = 0; h < i.length; h++) {
      const l = i[h];
      l.canDrop(t) && (a = l), l.fire(e, o);
    }
    this._renderDragEffects(t, r, a), this._dropTarget = a;
  }
  /**
   * fire `dragleave` on `dragover` targets
   * @private
   * @param {Event} [e] Event object fired on Event.js shake
   */
  _onDragEnter(t) {
    const { currentContainer: e, currentSubTargets: s } = this.findTarget(t), i = {
      e: t,
      target: e,
      subTargets: s,
      dragSource: this._dragSource
    };
    this.fire("dragenter", i), this._fireEnterLeaveEvents(t, e, i);
  }
  /**
   * fire `dragleave` on `dragover` targets
   * @private
   * @param {Event} [e] Event object fired on Event.js shake
   */
  _onDragLeave(t) {
    const { currentSubTargets: e } = this.findTarget(t), s = {
      e: t,
      target: this._draggedoverTarget,
      subTargets: e,
      dragSource: this._dragSource
    };
    this.fire("dragleave", s), this._fireEnterLeaveEvents(t, void 0, s), this._renderDragEffects(t, this._dragSource), this._dropTarget = void 0, this._hoveredTargets = [];
  }
  /**
   * `drop:before` is a an event that allows you to schedule logic
   * before the `drop` event. Prefer `drop` event always, but if you need
   * to run some drop-disabling logic on an event, since there is no way
   * to handle event handlers ordering, use `drop:before`
   * @private
   * @param {Event} e
   */
  _onDrop(t) {
    const { currentContainer: e, currentSubTargets: s } = this.findTarget(t), i = this._basicEventHandler("drop:before", {
      e: t,
      target: e,
      subTargets: s,
      dragSource: this._dragSource,
      ...ee(this, t)
    });
    i.didDrop = !1, i.dropTarget = void 0, this._basicEventHandler("drop", i), this.fire("drop:after", i);
  }
  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onContextMenu(t) {
    const { target: e, subTargets: s } = this.findTarget(t), i = this._basicEventHandler("contextmenu:before", {
      e: t,
      target: e,
      subTargets: s
    });
    return this.stopContextMenu && $i(t), this._basicEventHandler("contextmenu", i), !1;
  }
  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onClick(t) {
    const e = t.detail;
    e > 3 || e < 2 || (this._cacheTransformEventData(t), e == 2 && t.type === "dblclick" && this._handleEvent(t, "dblclick"), e == 3 && this._handleEvent(t, "tripleclick"), this._resetTransformEventData());
  }
  /**
   * Return a the id of an event.
   * returns either the pointerId or the identifier or 0 for the mouse event
   * @private
   * @param {Event} evt Event object
   */
  getPointerId(t) {
    const e = t.changedTouches;
    return e ? e[0] && e[0].identifier : this.enablePointerEvents ? t.pointerId : -1;
  }
  /**
   * Determines if an event has the id of the event that is considered main
   * @private
   * @param {evt} event Event object
   */
  _isMainEvent(t) {
    return t.isPrimary === !0 ? !0 : t.isPrimary === !1 ? !1 : t.type === "touchend" && t.touches.length === 0 ? !0 : t.changedTouches ? t.changedTouches[0].identifier === this.mainTouchId : !0;
  }
  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onTouchStart(t) {
    this._cacheTransformEventData(t);
    let e = !this.allowTouchScrolling;
    const s = this._activeObject;
    this.mainTouchId === void 0 && (this.mainTouchId = this.getPointerId(t)), this.__onMouseDown(t);
    const { target: i } = this.findTarget(t);
    (this.isDrawingMode || s && i === s) && (e = !0), e && t.preventDefault();
    const r = this.upperCanvasEl, o = this._getEventPrefix(), a = gt(r);
    Rt(
      a,
      "touchend",
      this._onTouchEnd,
      nt
    ), e && Rt(
      a,
      "touchmove",
      this._onMouseMove,
      nt
    ), lt(
      r,
      `${o}down`,
      this._onMouseDown
    ), this._resetTransformEventData();
  }
  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onMouseDown(t) {
    this._cacheTransformEventData(t), this.__onMouseDown(t);
    const e = this.upperCanvasEl, s = this._getEventPrefix();
    lt(
      e,
      `${s}move`,
      this._onMouseMove,
      nt
    );
    const i = gt(e);
    Rt(i, `${s}up`, this._onMouseUp), Rt(
      i,
      `${s}move`,
      this._onMouseMove,
      nt
    ), this._resetTransformEventData();
  }
  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onTouchEnd(t) {
    if (t.touches.length > 0)
      return;
    this._cacheTransformEventData(t), this.__onMouseUp(t), this._resetTransformEventData(), delete this.mainTouchId;
    const e = this._getEventPrefix(), s = gt(this.upperCanvasEl);
    lt(
      s,
      "touchend",
      this._onTouchEnd,
      nt
    ), lt(
      s,
      "touchmove",
      this._onMouseMove,
      nt
    ), this._willAddMouseDown && clearTimeout(this._willAddMouseDown), this._willAddMouseDown = setTimeout(() => {
      Rt(
        this.upperCanvasEl,
        `${e}down`,
        this._onMouseDown
      ), this._willAddMouseDown = 0;
    }, 400);
  }
  /**
   * @private
   * @param {Event} e Event object fired on mouseup
   */
  _onMouseUp(t) {
    this._cacheTransformEventData(t), this.__onMouseUp(t);
    const e = this.upperCanvasEl, s = this._getEventPrefix();
    if (this._isMainEvent(t)) {
      const i = gt(this.upperCanvasEl);
      lt(
        i,
        `${s}up`,
        this._onMouseUp
      ), lt(
        i,
        `${s}move`,
        this._onMouseMove,
        nt
      ), Rt(
        e,
        `${s}move`,
        this._onMouseMove,
        nt
      );
    }
    this._resetTransformEventData();
  }
  /**
   * @private
   * @param {Event} e Event object fired on mousemove
   */
  _onMouseMove(t) {
    this._cacheTransformEventData(t);
    const e = this.getActiveObject();
    !this.allowTouchScrolling && (!e || // a drag event sequence is started by the active object flagging itself on mousedown / mousedown:before
    // we must not prevent the event's default behavior in order for the window to start dragging
    !e.shouldStartDragging(t)) && t.preventDefault && t.preventDefault(), this.__onMouseMove(t), this._resetTransformEventData();
  }
  /**
   * @private
   */
  _onResize() {
    this.calcOffset(), this._resetTransformEventData();
  }
  /**
   * Decides whether the canvas should be redrawn in mouseup and mousedown events.
   * @private
   * @param {Object} target
   */
  _shouldRender(t) {
    const e = this.getActiveObject();
    return !!e != !!t || e && t && e !== t;
  }
  /**
   * Method that defines the actions when mouse is released on canvas.
   * The method resets the currentTransform parameters, store the image corner
   * position in the image object and render the canvas on top.
   * @private
   * @param {Event} e Event object fired on mouseup
   */
  __onMouseUp(t) {
    this._handleEvent(t, "up:before");
    const e = this._currentTransform, s = this._isClick, { target: i } = this.findTarget(t), { button: r } = t;
    if (r) {
      (this.fireMiddleClick && r === 1 || this.fireRightClick && r === 2) && this._handleEvent(t, "up");
      return;
    }
    if (this.isDrawingMode && this._isCurrentlyDrawing) {
      this._onMouseUpInDrawingMode(t);
      return;
    }
    if (!this._isMainEvent(t))
      return;
    let o = !1;
    if (e && (this._finalizeCurrentTransform(t), o = e.actionPerformed), !s) {
      const l = i === this._activeObject;
      this.handleSelection(t), o || (o = this._shouldRender(i) || !l && i === this._activeObject);
    }
    let a, h;
    if (i) {
      const l = i.findControl(
        this.getViewportPoint(t),
        He(t)
      ), { key: c, control: u } = l || {};
      if (h = c, i.selectable && i !== this._activeObject && i.activeOn === "up")
        this.setActiveObject(i, t), o = !0;
      else if (u) {
        const f = u.getMouseUpHandler(t, i, u);
        f && (a = this.getScenePoint(t), f.call(u, t, e, a.x, a.y));
      }
      i.isMoving = !1;
    }
    if (e && (e.target !== i || e.corner !== h)) {
      const l = e.target && e.target.controls[e.corner], c = l && l.getMouseUpHandler(
        t,
        e.target,
        l
      );
      a = a || this.getScenePoint(t), c && c.call(
        l,
        t,
        e,
        a.x,
        a.y
      );
    }
    this._setCursorFromEvent(t, i), this._handleEvent(t, "up"), this._groupSelector = null, this._currentTransform = null, i && (i.__corner = void 0), o ? this.requestRenderAll() : !s && !this._activeObject?.isEditing && this.renderTop();
  }
  _basicEventHandler(t, e) {
    const { target: s, subTargets: i = [] } = e;
    this.fire(t, e), s && s.fire(t, e);
    for (let r = 0; r < i.length; r++)
      i[r] !== s && i[r].fire(t, e);
    return e;
  }
  /**
   * @private
   * Handle event firing for target and subtargets
   * @param {TPointerEvent} e event from mouse
   * @param {TPointerEventNames} eventType
   */
  _handleEvent(t, e, s) {
    const { target: i, subTargets: r } = this.findTarget(t), o = {
      e: t,
      target: i,
      subTargets: r,
      ...ee(this, t),
      transform: this._currentTransform,
      ...e === "down:before" || e === "down" ? s : {}
    };
    (e === "up:before" || e === "up") && (o.isClick = this._isClick), this.fire(`mouse:${e}`, o), i && i.fire(`mouse${e}`, o);
    for (let a = 0; a < r.length; a++)
      r[a] !== i && r[a].fire(`mouse${e}`, o);
  }
  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onMouseDownInDrawingMode(t) {
    this._isCurrentlyDrawing = !0, this.getActiveObject() && (this.discardActiveObject(t), this.requestRenderAll());
    const e = this.getScenePoint(t);
    this.freeDrawingBrush && this.freeDrawingBrush.onMouseDown(e, { e: t, pointer: e }), this._handleEvent(t, "down", { alreadySelected: !1 });
  }
  /**
   * @private
   * @param {Event} e Event object fired on mousemove
   */
  _onMouseMoveInDrawingMode(t) {
    if (this._isCurrentlyDrawing) {
      const e = this.getScenePoint(t);
      this.freeDrawingBrush && this.freeDrawingBrush.onMouseMove(e, {
        e: t,
        // this is an absolute pointer, the naming is wrong
        pointer: e
      });
    }
    this.setCursor(this.freeDrawingCursor), this._handleEvent(t, "move");
  }
  /**
   * @private
   * @param {Event} e Event object fired on mouseup
   */
  _onMouseUpInDrawingMode(t) {
    const e = this.getScenePoint(t);
    this.freeDrawingBrush ? this._isCurrentlyDrawing = !!this.freeDrawingBrush.onMouseUp({
      e: t,
      // this is an absolute pointer, the naming is wrong
      pointer: e
    }) : this._isCurrentlyDrawing = !1, this._handleEvent(t, "up");
  }
  /**
   * Method that defines the actions when mouse is clicked on canvas.
   * The method inits the currentTransform parameters and renders all the
   * canvas so the current image can be placed on the top canvas and the rest
   * in on the container one.
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  __onMouseDown(t) {
    this._isClick = !0, this._handleEvent(t, "down:before");
    let { target: e } = this.findTarget(t), s = !!e && e === this._activeObject;
    const { button: i } = t;
    if (i) {
      (this.fireMiddleClick && i === 1 || this.fireRightClick && i === 2) && this._handleEvent(t, "down", {
        alreadySelected: s
      });
      return;
    }
    if (this.isDrawingMode) {
      this._onMouseDownInDrawingMode(t);
      return;
    }
    if (!this._isMainEvent(t) || this._currentTransform)
      return;
    let r = this._shouldRender(e), o = !1;
    if (this.handleMultiSelection(t, e) ? (e = this._activeObject, o = !0, r = !0) : this._shouldClearSelection(t, e) && this.discardActiveObject(t), this.selection && (!e || !e.selectable && !e.isEditing && e !== this._activeObject)) {
      const a = this.getScenePoint(t);
      this._groupSelector = {
        x: a.x,
        y: a.y,
        deltaY: 0,
        deltaX: 0
      };
    }
    if (s = !!e && e === this._activeObject, e) {
      e.selectable && e.activeOn === "down" && this.setActiveObject(e, t);
      const a = e.findControl(
        this.getViewportPoint(t),
        He(t)
      );
      if (e === this._activeObject && (a || !o)) {
        this._setupCurrentTransform(t, e, s);
        const h = a ? a.control : void 0, l = this.getScenePoint(t), c = h && h.getMouseDownHandler(t, e, h);
        c && c.call(
          h,
          t,
          this._currentTransform,
          l.x,
          l.y
        );
      }
    }
    r && (this._objectsToRender = void 0), this._handleEvent(t, "down", { alreadySelected: s }), r && this.requestRenderAll();
  }
  /**
   * reset cache form common information needed during event processing
   * @private
   */
  _resetTransformEventData() {
    this._targetInfo = this._viewportPoint = this._scenePoint = void 0;
  }
  /**
   * Cache common information needed during event processing
   * @private
   * @param {Event} e Event object fired on event
   */
  _cacheTransformEventData(t) {
    this._resetTransformEventData(), this._viewportPoint = this.getViewportPoint(t), this._scenePoint = Et(
      this._viewportPoint,
      void 0,
      this.viewportTransform
    ), this._targetInfo = this.findTarget(t), this._currentTransform && (this._targetInfo.target = this._currentTransform.target);
  }
  /**
   * Method that defines the actions when mouse is hovering the canvas.
   * The currentTransform parameter will define whether the user is rotating/scaling/translating
   * an image or neither of them (only hovering). A group selection is also possible and would cancel
   * all any other type of action.
   * In case of an image transformation only the top canvas will be rendered.
   * @private
   * @param {Event} e Event object fired on mousemove
   */
  __onMouseMove(t) {
    if (this._isClick = !1, this._handleEvent(t, "move:before"), this.isDrawingMode) {
      this._onMouseMoveInDrawingMode(t);
      return;
    }
    if (!this._isMainEvent(t))
      return;
    const e = this._groupSelector;
    if (e) {
      const s = this.getScenePoint(t);
      e.deltaX = s.x - e.x, e.deltaY = s.y - e.y, this.renderTop();
    } else if (this._currentTransform)
      this._transformObject(t);
    else {
      const { target: s } = this.findTarget(t);
      this._setCursorFromEvent(t, s), this._fireOverOutEvents(t, s);
    }
    this.textEditingManager.onMouseMove(t), this._handleEvent(t, "move");
  }
  /**
   * Manage the mouseout, mouseover events for the fabric object on the canvas
   * @param {Fabric.Object} target the target where the target from the mousemove event
   * @param {Event} e Event object fired on mousemove
   * @private
   */
  _fireOverOutEvents(t, e) {
    const { _hoveredTarget: s, _hoveredTargets: i } = this, { subTargets: r } = this.findTarget(t), o = Math.max(i.length, r.length);
    this.fireSyntheticInOutEvents("mouse", {
      e: t,
      target: e,
      oldTarget: s,
      fireCanvas: !0
    });
    for (let a = 0; a < o; a++)
      r[a] === e || i[a] && i[a] === s || this.fireSyntheticInOutEvents("mouse", {
        e: t,
        target: r[a],
        oldTarget: i[a]
      });
    this._hoveredTarget = e, this._hoveredTargets = r;
  }
  /**
   * Manage the dragEnter, dragLeave events for the fabric objects on the canvas
   * @param {Fabric.Object} target the target where the target from the onDrag event
   * @param {Object} data Event object fired on dragover
   * @private
   */
  _fireEnterLeaveEvents(t, e, s) {
    const i = this._draggedoverTarget, r = this._hoveredTargets, { subTargets: o } = this.findTarget(t), a = Math.max(r.length, o.length);
    this.fireSyntheticInOutEvents("drag", {
      ...s,
      target: e,
      oldTarget: i,
      fireCanvas: !0
    });
    for (let h = 0; h < a; h++)
      this.fireSyntheticInOutEvents("drag", {
        ...s,
        target: o[h],
        oldTarget: r[h]
      });
    this._draggedoverTarget = e;
  }
  /**
   * Manage the synthetic in/out events for the fabric objects on the canvas
   * @param {Fabric.Object} target the target where the target from the supported events
   * @param {Object} data Event object fired
   * @param {Object} config configuration for the function to work
   * @param {String} config.targetName property on the canvas where the old target is stored
   * @param {String} [config.canvasEvtOut] name of the event to fire at canvas level for out
   * @param {String} config.evtOut name of the event to fire for out
   * @param {String} [config.canvasEvtIn] name of the event to fire at canvas level for in
   * @param {String} config.evtIn name of the event to fire for in
   * @private
   */
  fireSyntheticInOutEvents(t, {
    target: e,
    oldTarget: s,
    fireCanvas: i,
    e: r,
    ...o
  }) {
    const { targetIn: a, targetOut: h, canvasIn: l, canvasOut: c } = tl[t], u = s !== e;
    if (s && u) {
      const f = {
        ...o,
        e: r,
        target: s,
        nextTarget: e,
        ...ee(this, r)
      };
      i && this.fire(c, f), s.fire(h, f);
    }
    if (e && u) {
      const f = {
        ...o,
        e: r,
        target: e,
        previousTarget: s,
        ...ee(this, r)
      };
      i && this.fire(l, f), e.fire(a, f);
    }
  }
  /**
   * @private
   * @param {Event} e Event fired on mousemove
   */
  _transformObject(t) {
    const e = this.getScenePoint(t), s = this._currentTransform, i = s.target, r = i.group ? Et(
      e,
      void 0,
      i.group.calcTransformMatrix()
    ) : e;
    s.shiftKey = t.shiftKey, s.altKey = !!this.centeredKey && t[this.centeredKey], this._performTransformAction(t, s, r), s.actionPerformed && this.requestRenderAll();
  }
  /**
   * @private
   */
  _performTransformAction(t, e, s) {
    const { action: i, actionHandler: r, target: o } = e, a = !!r && r(t, e, s.x, s.y);
    a && o.setCoords(), i === "drag" && a && (e.target.isMoving = !0, this.setCursor(e.target.moveCursor || this.moveCursor)), e.actionPerformed = e.actionPerformed || a;
  }
  /**
   * Sets the cursor depending on where the canvas is being hovered.
   * Note: very buggy in Opera
   * @param {Event} e Event object
   * @param {Object} target Object that the mouse is hovering, if so.
   */
  _setCursorFromEvent(t, e) {
    if (!e) {
      this.setCursor(this.defaultCursor);
      return;
    }
    let s = e.hoverCursor || this.hoverCursor;
    const i = Xt(this._activeObject) ? this._activeObject : null, r = (!i || e.group !== i) && // here we call findTargetCorner always with undefined for the touch parameter.
    // we assume that if you are using a cursor you do not need to interact with
    // the bigger touch area.
    e.findControl(this.getViewportPoint(t));
    if (r) {
      const { control: o, coord: a } = r;
      this.setCursor(o.cursorStyleHandler(t, o, e, a));
    } else {
      if (e.subTargetCheck) {
        const { subTargets: o } = this.findTarget(t);
        o.concat().reverse().forEach((a) => {
          s = a.hoverCursor || s;
        });
      }
      this.setCursor(s);
    }
  }
  /**
   * ## Handles multiple selection
   * - toggles `target` selection (selects/deselects `target` if it isn't/is selected respectively)
   * - sets the active object in case it is not set or in case there is a single active object left under active selection.
   * ---
   * - If the active object is the active selection we add/remove `target` from it
   * - If not, add the active object and `target` to the active selection and make it the active object.
   * @TODO rewrite this after find target is refactored
   * @private
   * @param {TPointerEvent} e Event object
   * @param {FabricObject} target target of event to select/deselect
   * @returns true if grouping occurred
   */
  handleMultiSelection(t, e) {
    const s = this._activeObject, i = Xt(s);
    if (
      // check if an active object exists on canvas and if the user is pressing the `selectionKey` while canvas supports multi selection.
      s && this._isSelectionKeyPressed(t) && this.selection && e && e.selectable && // group target and active object only if they are different objects
      // else we try to find a subtarget of `ActiveSelection`
      (s !== e || i) && //  make sure `activeObject` and `target` aren't ancestors of each other in case `activeObject` is not `ActiveSelection`
      // if it is then we want to remove `target` from it
      (i || !e.isDescendantOf(s) && !s.isDescendantOf(e)) && //  target accepts selection
      !e.onSelect({ e: t }) && // make sure we are not on top of a control
      !s.getActiveControl()
    ) {
      if (i) {
        const r = s.getObjects();
        let o = [];
        if (e === s) {
          const a = this.getScenePoint(t);
          let h = this.searchPossibleTargets(
            r,
            a
          );
          if (h.target ? (e = h.target, o = h.subTargets) : (h = this.searchPossibleTargets(this._objects, a), e = h.target, o = h.subTargets), !e || !e.selectable)
            return !1;
        }
        e.group === s ? (s.remove(e), this._hoveredTarget = e, this._hoveredTargets = o, s.size() === 1 && this._setActiveObject(s.item(0), t)) : (s.multiSelectAdd(e), this._hoveredTarget = s, this._hoveredTargets = o), this._fireSelectionEvents(r, t);
      } else {
        s.isEditing && s.exitEditing();
        const r = x.getClass("ActiveSelection"), o = new r([], {
          /**
           * it is crucial to pass the canvas ref before calling {@link ActiveSelection#multiSelectAdd}
           * since it uses {@link FabricObject#isInFrontOf} which relies on the canvas ref
           */
          canvas: this
        });
        o.multiSelectAdd(s, e), this._hoveredTarget = o, this._setActiveObject(o, t), this._fireSelectionEvents([s], t);
      }
      return !0;
    }
    return !1;
  }
  /**
   * ## Handles selection
   * - selects objects that are contained in (and possibly intersecting) the selection bounding box
   * - sets the active object
   * ---
   * runs on mouse up after a mouse move
   */
  handleSelection(t) {
    if (!this.selection || !this._groupSelector)
      return !1;
    const { x: e, y: s, deltaX: i, deltaY: r } = this._groupSelector, o = new m(e, s), a = o.add(new m(i, r)), h = o.min(a), l = o.max(a), c = l.subtract(h), u = this.collectObjects(
      {
        left: h.x,
        top: h.y,
        width: c.x,
        height: c.y
      },
      { includeIntersecting: !this.selectionFullyContained }
    ), f = (
      // though this method runs only after mouse move the pointer could do a mouse up on the same position as mouse down
      // should it be handled as is?
      o.eq(a) ? u[0] ? [u[0]] : [] : u.length > 1 ? u.filter((d) => !d.onSelect({ e: t })).reverse() : (
        // `setActiveObject` will call `onSelect(collectedObjects[0])` in this case
        u
      )
    );
    if (f.length === 1)
      this.setActiveObject(f[0], t);
    else if (f.length > 1) {
      const d = x.getClass("ActiveSelection");
      this.setActiveObject(new d(f, { canvas: this }), t);
    }
    return this._groupSelector = null, !0;
  }
  /**
   * @override clear {@link textEditingManager}
   */
  clear() {
    this.textEditingManager.clear(), super.clear();
  }
  /**
   * @override clear {@link textEditingManager}
   */
  destroy() {
    this.removeListeners(), this.textEditingManager.dispose(), super.destroy();
  }
}
const An = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
}, el = {
  ...An,
  r1: 0,
  r2: 0
}, ie = (n, t) => isNaN(n) && typeof t == "number" ? t : n;
function Fn(n) {
  return n && /%$/.test(n) && Number.isFinite(parseFloat(n));
}
function Ln(n, t) {
  const e = typeof n == "number" ? n : typeof n == "string" ? parseFloat(n) / (Fn(n) ? 100 : 1) : NaN;
  return zt(0, ie(e, t), 1);
}
const sl = /\s*;\s*/, il = /\s*:\s*/;
function rl(n, t) {
  let e, s;
  const i = n.getAttribute("style");
  if (i) {
    const o = i.split(sl);
    o[o.length - 1] === "" && o.pop();
    for (let a = o.length; a--; ) {
      const [h, l] = o[a].split(il).map((c) => c.trim());
      h === "stop-color" ? e = l : h === "stop-opacity" && (s = l);
    }
  }
  e = e || n.getAttribute("stop-color") || "rgb(0,0,0)", s = ie(
    parseFloat(s || n.getAttribute("stop-opacity") || ""),
    1
  );
  const r = new E(e);
  return r.setAlpha(r.getAlpha() * s * t), {
    offset: Ln(n.getAttribute("offset"), 0),
    color: r.toRgba()
  };
}
function nl(n, t) {
  const e = [], s = n.getElementsByTagName("stop"), i = Ln(t, 1);
  for (let r = s.length; r--; )
    e.push(rl(s[r], i));
  return e;
}
function Rn(n) {
  return n.nodeName === "linearGradient" || n.nodeName === "LINEARGRADIENT" ? "linear" : "radial";
}
function jn(n) {
  return n.getAttribute("gradientUnits") === "userSpaceOnUse" ? "pixels" : "percentage";
}
function ol(n, { width: t, height: e, gradientUnits: s }) {
  let i;
  return Object.entries(n).reduce(
    (r, [o, a]) => {
      if (a === "Infinity")
        i = 1;
      else if (a === "-Infinity")
        i = 0;
      else {
        const h = typeof a == "string";
        i = h ? parseFloat(a) : a, h && Fn(a) && (i *= 0.01, s === "pixels" && ((o === "x1" || o === "x2" || o === "r2") && (i *= t), (o === "y1" || o === "y2") && (i *= e)));
      }
      return r[o] = i, r;
    },
    {}
  );
}
function dt(n, t) {
  return n.getAttribute(t);
}
function al(n) {
  return {
    x1: dt(n, "x1") || 0,
    y1: dt(n, "y1") || 0,
    x2: dt(n, "x2") || "100%",
    y2: dt(n, "y2") || 0
  };
}
function hl(n) {
  return {
    x1: dt(n, "fx") || dt(n, "cx") || "50%",
    y1: dt(n, "fy") || dt(n, "cy") || "50%",
    r1: 0,
    x2: dt(n, "cx") || "50%",
    y2: dt(n, "cy") || "50%",
    r2: dt(n, "r") || "50%"
  };
}
function ll(n, t) {
  return ol(
    Rn(n) === "linear" ? al(n) : hl(n),
    {
      ...t,
      gradientUnits: jn(n)
    }
  );
}
class ws {
  static type = "Gradient";
  constructor(t) {
    const {
      type: e = "linear",
      gradientUnits: s = "pixels",
      coords: i = {},
      colorStops: r = [],
      offsetX: o = 0,
      offsetY: a = 0,
      gradientTransform: h,
      id: l
    } = t || {};
    Object.assign(this, {
      type: e,
      gradientUnits: s,
      coords: {
        ...e === "radial" ? el : An,
        ...i
      },
      colorStops: r,
      offsetX: o,
      offsetY: a,
      gradientTransform: h,
      id: l ? `${l}_${jt()}` : jt()
    });
  }
  /**
   * Adds another colorStop
   * @param {Record<string, string>} colorStop Object with offset and color
   * @return {Gradient} thisArg
   */
  addColorStop(t) {
    for (const e in t)
      this.colorStops.push({
        offset: parseFloat(e),
        color: t[e]
      });
    return this;
  }
  /**
   * Returns object representation of a gradient
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {object}
   */
  toObject(t) {
    return {
      ...Jt(this, t),
      type: this.type,
      coords: { ...this.coords },
      colorStops: this.colorStops.map((e) => ({ ...e })),
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      gradientUnits: this.gradientUnits,
      gradientTransform: this.gradientTransform ? [...this.gradientTransform] : void 0
    };
  }
  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of an gradient
   * @param {FabricObject} object Object to create a gradient for
   * @return {String} SVG representation of an gradient (linear/radial)
   */
  toSVG(t, {
    additionalTransform: e
  } = {}) {
    const s = [], i = this.gradientTransform ? this.gradientTransform.concat() : J.concat(), r = this.gradientUnits === "pixels" ? "userSpaceOnUse" : "objectBoundingBox", o = this.colorStops.map((c) => ({ ...c })).sort((c, u) => c.offset - u.offset);
    let a = -this.offsetX, h = -this.offsetY;
    r === "objectBoundingBox" ? (a /= t.width, h /= t.height) : (a += t.width / 2, h += t.height / 2), Mo(t) && this.gradientUnits !== "percentage" && (a -= t.pathOffset.x, h -= t.pathOffset.y), i[4] -= a, i[5] -= h;
    const l = [
      `id="SVGID_${this.id}"`,
      `gradientUnits="${r}"`,
      `gradientTransform="${e ? e + " " : ""}${he(i)}"`,
      ""
    ].join(" ");
    if (this.type === "linear") {
      const { x1: c, y1: u, x2: f, y2: d } = this.coords;
      s.push(
        "<linearGradient ",
        l,
        ' x1="',
        c,
        '" y1="',
        u,
        '" x2="',
        f,
        '" y2="',
        d,
        `">
`
      );
    } else if (this.type === "radial") {
      const { x1: c, y1: u, x2: f, y2: d, r1: g, r2: p } = this.coords, _ = g > p;
      s.push(
        "<radialGradient ",
        l,
        ' cx="',
        _ ? c : f,
        '" cy="',
        _ ? u : d,
        '" r="',
        _ ? g : p,
        '" fx="',
        _ ? f : c,
        '" fy="',
        _ ? d : u,
        `">
`
      ), _ && (o.reverse(), o.forEach((v) => {
        v.offset = 1 - v.offset;
      }));
      const y = Math.min(g, p);
      if (y > 0) {
        const v = Math.max(g, p), S = y / v;
        o.forEach((C) => {
          C.offset += S * (1 - C.offset);
        });
      }
    }
    return o.forEach(({ color: c, offset: u }) => {
      s.push(
        `<stop offset="${u * 100}%" style="stop-color:${c};"/>
`
      );
    }), s.push(
      this.type === "linear" ? "</linearGradient>" : "</radialGradient>",
      `
`
    ), s.join("");
  }
  /* _TO_SVG_END_ */
  /**
   * Returns an instance of CanvasGradient
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @return {CanvasGradient}
   */
  toLive(t) {
    const { x1: e, y1: s, x2: i, y2: r, r1: o, r2: a } = this.coords, h = this.type === "linear" ? t.createLinearGradient(e, s, i, r) : t.createRadialGradient(e, s, o, i, r, a);
    return this.colorStops.forEach(({ color: l, offset: c }) => {
      h.addColorStop(c, l);
    }), h;
  }
  static async fromObject(t) {
    const { colorStops: e, gradientTransform: s } = t;
    return new this({
      ...t,
      colorStops: e ? e.map((i) => ({ ...i })) : void 0,
      gradientTransform: s ? [...s] : void 0
    });
  }
  /* _FROM_SVG_START_ */
  /**
   * Returns {@link Gradient} instance from an SVG element
   * @param {SVGGradientElement} el SVG gradient element
   * @param {FabricObject} instance
   * @param {String} opacity A fill-opacity or stroke-opacity attribute to multiply to each stop's opacity.
   * @param {SVGOptions} svgOptions an object containing the size of the SVG in order to parse correctly gradients
   * that uses gradientUnits as 'userSpaceOnUse' and percentages.
   * @return {Gradient} Gradient instance
   * @see http://www.w3.org/TR/SVG/pservers.html#LinearGradientElement
   * @see http://www.w3.org/TR/SVG/pservers.html#RadialGradientElement
   *
   *  @example
   *
   *  <linearGradient id="linearGrad1">
   *    <stop offset="0%" stop-color="white"/>
   *    <stop offset="100%" stop-color="black"/>
   *  </linearGradient>
   *
   *  OR
   *
   *  <linearGradient id="linearGrad2">
   *    <stop offset="0" style="stop-color:rgb(255,255,255)"/>
   *    <stop offset="1" style="stop-color:rgb(0,0,0)"/>
   *  </linearGradient>
   *
   *  OR
   *
   *  <radialGradient id="radialGrad1">
   *    <stop offset="0%" stop-color="white" stop-opacity="1" />
   *    <stop offset="50%" stop-color="black" stop-opacity="0.5" />
   *    <stop offset="100%" stop-color="white" stop-opacity="1" />
   *  </radialGradient>
   *
   *  OR
   *
   *  <radialGradient id="radialGrad2">
   *    <stop offset="0" stop-color="rgb(255,255,255)" />
   *    <stop offset="0.5" stop-color="rgb(0,0,0)" />
   *    <stop offset="1" stop-color="rgb(255,255,255)" />
   *  </radialGradient>
   *
   */
  static fromElement(t, e, s) {
    const i = jn(t), r = e._findCenterFromElement();
    return new this({
      id: t.getAttribute("id") || void 0,
      type: Rn(t),
      coords: ll(t, {
        width: s.viewBoxWidth || s.width,
        height: s.viewBoxHeight || s.height
      }),
      colorStops: nl(t, s.opacity),
      gradientUnits: i,
      gradientTransform: Qe(
        t.getAttribute("gradientTransform") || ""
      ),
      ...i === "pixels" ? {
        offsetX: e.width / 2 - r.x,
        offsetY: e.height / 2 - r.y
      } : {
        offsetX: 0,
        offsetY: 0
      }
    });
  }
  /* _FROM_SVG_END_ */
}
x.setClass(ws, "gradient");
x.setClass(ws, "linear");
x.setClass(ws, "radial");
class Fi {
  static type = "Pattern";
  /**
   * Legacy identifier of the class. Prefer using this.constructor.type 'Pattern'
   * or utils like isPattern, or instance of to indentify a pattern in your code.
   * Will be removed in future versiones
   * @TODO add sustainable warning message
   * @type string
   * @deprecated
   */
  get type() {
    return "pattern";
  }
  set type(t) {
    Mt("warn", "Setting type has no effect", t);
  }
  /**
   * @type PatternRepeat
   * @defaults
   */
  repeat = "repeat";
  /**
   * Pattern horizontal offset from object's left/top corner
   * @type Number
   */
  offsetX = 0;
  /**
   * Pattern vertical offset from object's left/top corner
   * @type Number
   */
  offsetY = 0;
  /**
   * @type TCrossOrigin
   */
  crossOrigin = "";
  /**
   * Constructor
   * @param {Object} [options] Options object
   * @param {option.source} [source] the pattern source, eventually empty or a drawable
   */
  constructor(t) {
    this.id = jt(), Object.assign(this, t);
  }
  /**
   * @returns true if {@link source} is an <img> element
   */
  isImageSource() {
    return !!this.source && typeof this.source.src == "string";
  }
  /**
   * @returns true if {@link source} is a <canvas> element
   */
  isCanvasSource() {
    return !!this.source && !!this.source.toDataURL;
  }
  sourceToString() {
    return this.isImageSource() ? this.source.src : this.isCanvasSource() ? this.source.toDataURL() : "";
  }
  /**
   * Returns an instance of CanvasPattern
   * @param {CanvasRenderingContext2D} ctx Context to create pattern
   * @return {CanvasPattern}
   */
  toLive(t) {
    return (
      // if the image failed to load, return, and allow rest to continue loading
      !this.source || // if an image
      this.isImageSource() && (!this.source.complete || this.source.naturalWidth === 0 || this.source.naturalHeight === 0) ? null : t.createPattern(this.source, this.repeat)
    );
  }
  /**
   * Returns object representation of a pattern
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {object} Object representation of a pattern instance
   */
  toObject(t = []) {
    const { repeat: e, crossOrigin: s } = this;
    return {
      ...Jt(this, t),
      type: "pattern",
      source: this.sourceToString(),
      repeat: e,
      crossOrigin: s,
      offsetX: F(this.offsetX, M.NUM_FRACTION_DIGITS),
      offsetY: F(this.offsetY, M.NUM_FRACTION_DIGITS),
      patternTransform: this.patternTransform ? [...this.patternTransform] : null
    };
  }
  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of a pattern
   */
  toSVG({ width: t, height: e }) {
    const { source: s, repeat: i, id: r } = this, o = ie(this.offsetX / t, 0), a = ie(this.offsetY / e, 0), h = i === "repeat-y" || i === "no-repeat" ? 1 + Math.abs(o || 0) : ie(s.width / t, 0), l = i === "repeat-x" || i === "no-repeat" ? 1 + Math.abs(a || 0) : ie(s.height / e, 0);
    return [
      `<pattern id="SVGID_${r}" x="${o}" y="${a}" width="${h}" height="${l}">`,
      `<image x="0" y="0" width="${s.width}" height="${s.height}" xlink:href="${this.sourceToString()}"></image>`,
      "</pattern>",
      ""
    ].join(`
`);
  }
  /* _TO_SVG_END_ */
  static async fromObject({
    type: t,
    source: e,
    patternTransform: s,
    ...i
  }, r) {
    const o = await Se(e, {
      ...r,
      crossOrigin: i.crossOrigin
    });
    return new this({
      ...i,
      patternTransform: s && s.slice(0),
      source: o
    });
  }
}
x.setClass(Fi);
x.setClass(Fi, "pattern");
class Li {
  /**
   * Color of a brush
   * @type String
   */
  color = "rgb(0, 0, 0)";
  /**
   * Width of a brush, has to be a Number, no string literals
   * @type Number
   */
  width = 1;
  /**
   * Shadow object representing shadow of this shape.
   * <b>Backwards incompatibility note:</b> This property replaces "shadowColor" (String), "shadowOffsetX" (Number),
   * "shadowOffsetY" (Number) and "shadowBlur" (Number) since v1.2.12
   * @type Shadow
   */
  shadow = null;
  /**
   * Line endings style of a brush (one of "butt", "round", "square")
   * @type String
   */
  strokeLineCap = "round";
  /**
   * Corner style of a brush (one of "bevel", "round", "miter")
   * @type String
   */
  strokeLineJoin = "round";
  /**
   * Maximum miter length (used for strokeLineJoin = "miter") of a brush's
   * @type Number
   */
  strokeMiterLimit = 10;
  /**
   * Stroke Dash Array.
   * @type Array
   */
  strokeDashArray = null;
  /**
   * When `true`, the free drawing is limited to the whiteboard size. Default to false.
   * @type Boolean
   * @default false
   */
  limitedToCanvasSize = !1;
  constructor(t) {
    this.canvas = t;
  }
  /**
   * Sets brush styles
   * @private
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles(t) {
    t.strokeStyle = this.color, t.lineWidth = this.width, t.lineCap = this.strokeLineCap, t.miterLimit = this.strokeMiterLimit, t.lineJoin = this.strokeLineJoin, t.setLineDash(this.strokeDashArray || []);
  }
  /**
   * Sets the transformation on given context
   * @param {CanvasRenderingContext2D} ctx context to render on
   * @private
   */
  _saveAndTransform(t) {
    const e = this.canvas.viewportTransform;
    t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
  }
  needsFullRender() {
    return new E(this.color).getAlpha() < 1 || !!this.shadow;
  }
  /**
   * Sets brush shadow styles
   * @private
   */
  _setShadow() {
    if (!this.shadow || !this.canvas)
      return;
    const t = this.canvas, e = this.shadow, s = t.contextTop, i = t.getZoom() * t.getRetinaScaling();
    s.shadowColor = e.color, s.shadowBlur = e.blur * i, s.shadowOffsetX = e.offsetX * i, s.shadowOffsetY = e.offsetY * i;
  }
  /**
   * Removes brush shadow styles
   * @private
   */
  _resetShadow() {
    const t = this.canvas.contextTop;
    t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0;
  }
  /**
   * Check is pointer is outside canvas boundaries
   * @param {Object} pointer
   * @private
   */
  _isOutSideCanvas(t) {
    return t.x < 0 || t.x > this.canvas.getWidth() || t.y < 0 || t.y > this.canvas.getHeight();
  }
}
class Le extends z {
  static type = "Path";
  static cacheProperties = [...At, "path", "fillRule"];
  /**
   * Constructor
   * @param {TComplexPathData} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {Partial<PathProps>} [options] Options object
   * @return {Path} thisArg
   */
  constructor(t, { path: e, left: s, top: i, ...r } = {}) {
    super(), Object.assign(this, Le.ownDefaults), this.setOptions(r), this._setPath(t || [], !0), typeof s == "number" && this.set(P, s), typeof i == "number" && this.set(it, i);
  }
  /**
   * @private
   * @param {TComplexPathData | string} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {boolean} [adjustPosition] pass true to reposition the object according to the bounding box
   * @returns {Point} top left position of the bounding box, useful for complementary positioning
   */
  _setPath(t, e) {
    this.path = bn(Array.isArray(t) ? t : Pn(t)), this.setBoundingBox(e);
  }
  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates, by look at the polyline/polygon points.
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    const t = this._calcBoundsFromPath();
    return new m(t.left + t.width / 2, t.top + t.height / 2);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render path on
   */
  _renderPathCommands(t) {
    const e = -this.pathOffset.x, s = -this.pathOffset.y;
    t.beginPath();
    for (const i of this.path)
      switch (i[0]) {
        case "L":
          t.lineTo(i[1] + e, i[2] + s);
          break;
        case "M":
          t.moveTo(i[1] + e, i[2] + s);
          break;
        case "C":
          t.bezierCurveTo(
            i[1] + e,
            i[2] + s,
            i[3] + e,
            i[4] + s,
            i[5] + e,
            i[6] + s
          );
          break;
        case "Q":
          t.quadraticCurveTo(
            i[1] + e,
            i[2] + s,
            i[3] + e,
            i[4] + s
          );
          break;
        case "Z":
          t.closePath();
          break;
      }
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render path on
   */
  _render(t) {
    this._renderPathCommands(t), this._renderPaintInOrder(t);
  }
  /**
   * Returns string representation of an instance
   * @return {string} string representation of an instance
   */
  toString() {
    return `#<Path (${this.complexity()}): { "top": ${this.top}, "left": ${this.left} }>`;
  }
  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(t = []) {
    return {
      ...super.toObject(t),
      path: this.path.map((e) => e.slice())
    };
  }
  /**
   * Returns dataless object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject(t = []) {
    const e = this.toObject(t);
    return this.sourcePath && (delete e.path, e.sourcePath = this.sourcePath), e;
  }
  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    return [
      "<path ",
      "COMMON_PARTS",
      `d="${Ei(this.path, M.NUM_FRACTION_DIGITS)}" stroke-linecap="round" />
`
    ];
  }
  /**
   * @private
   * @return the path command's translate transform attribute
   */
  _getOffsetTransform() {
    const t = M.NUM_FRACTION_DIGITS;
    return ` translate(${F(-this.pathOffset.x, t)}, ${F(
      -this.pathOffset.y,
      t
    )})`;
  }
  /**
   * Returns svg clipPath representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {string} svg representation of an instance
   */
  toClipPathSVG(t) {
    const e = this._getOffsetTransform();
    return "	" + this._createBaseClipPathSVGMarkup(this._toSVG(), {
      reviver: t,
      additionalTransform: e
    });
  }
  /**
   * Returns svg representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {string} svg representation of an instance
   */
  toSVG(t) {
    const e = this._getOffsetTransform();
    return this._createBaseSVGMarkup(this._toSVG(), {
      reviver: t,
      additionalTransform: e
    });
  }
  /**
   * Returns number representation of an instance complexity
   * @return {number} complexity of this instance
   */
  complexity() {
    return this.path.length;
  }
  setDimensions() {
    this.setBoundingBox();
  }
  setBoundingBox(t) {
    const { width: e, height: s, pathOffset: i } = this._calcDimensions();
    this.set({ width: e, height: s, pathOffset: i }), t && this.setPositionByOrigin(i, T, T);
  }
  _calcBoundsFromPath() {
    const t = [];
    let e = 0, s = 0, i = 0, r = 0;
    for (const o of this.path)
      switch (o[0]) {
        case "L":
          i = o[1], r = o[2], t.push({ x: e, y: s }, { x: i, y: r });
          break;
        case "M":
          i = o[1], r = o[2], e = i, s = r;
          break;
        case "C":
          t.push(
            ...Ks(
              i,
              r,
              o[1],
              o[2],
              o[3],
              o[4],
              o[5],
              o[6]
            )
          ), i = o[5], r = o[6];
          break;
        case "Q":
          t.push(
            ...Ks(
              i,
              r,
              o[1],
              o[2],
              o[1],
              o[2],
              o[3],
              o[4]
            )
          ), i = o[3], r = o[4];
          break;
        case "Z":
          i = e, r = s;
          break;
      }
    return wt(t);
  }
  /**
   * @private
   */
  _calcDimensions() {
    const t = this._calcBoundsFromPath();
    return {
      ...t,
      pathOffset: new m(
        t.left + t.width / 2,
        t.top + t.height / 2
      )
    };
  }
  /**
   * List of attribute names to account for when parsing SVG element (used by `Path.fromElement`)
   * @see http://www.w3.org/TR/SVG/paths.html#PathElement
   */
  static ATTRIBUTE_NAMES = [...Yt, "d"];
  /**
   * Creates an instance of Path from an object
   * @param {Object} object
   * @returns {Promise<Path>}
   */
  static fromObject(t) {
    return this._fromObject(t, {
      extraParam: "path"
    });
  }
  /**
   * Creates an instance of Path from an SVG <path> element
   * @param {HTMLElement} element to parse
   * @param {Partial<PathProps>} [options] Options object
   */
  static async fromElement(t, e, s) {
    const { d: i, ...r } = Ft(
      t,
      this.ATTRIBUTE_NAMES,
      s
    );
    return new this(i, {
      ...r,
      ...e,
      // we pass undefined to instruct the constructor to position the object using the bbox
      left: void 0,
      top: void 0
    });
  }
}
x.setClass(Le);
x.setSVGClass(Le);
function cl(n) {
  return Ei(n) === "M 0 0 Q 0 0 0 0 L 0 0";
}
class ss extends Li {
  /**
   * Discard points that are less than `decimate` pixel distant from each other
   * @type Number
   * @default 0.4
   */
  decimate = 0.4;
  /**
   * Draws a straight line between last recorded point to current pointer
   * Used for `shift` functionality
   *
   * @type boolean
   * @default false
   */
  drawStraightLine = !1;
  /**
   * The event modifier key that makes the brush draw a straight line.
   * If `null` or 'none' or any other string that is not a modifier key the feature is disabled.
   * @type {ModifierKey | undefined | null}
   */
  straightLineKey = "shiftKey";
  constructor(t) {
    super(t), this._points = [], this._hasStraightLine = !1;
  }
  needsFullRender() {
    return super.needsFullRender() || this._hasStraightLine;
  }
  static drawSegment(t, e, s) {
    const i = e.midPointFrom(s);
    return t.quadraticCurveTo(e.x, e.y, i.x, i.y), i;
  }
  /**
   * Invoked on mouse down
   * @param {Point} pointer
   */
  onMouseDown(t, { e }) {
    this.canvas._isMainEvent(e) && (this.drawStraightLine = !!this.straightLineKey && e[this.straightLineKey], this._prepareForDrawing(t), this._addPoint(t), this._render());
  }
  /**
   * Invoked on mouse move
   * @param {Point} pointer
   */
  onMouseMove(t, { e }) {
    if (this.canvas._isMainEvent(e) && (this.drawStraightLine = !!this.straightLineKey && e[this.straightLineKey], !(this.limitedToCanvasSize === !0 && this._isOutSideCanvas(t)) && this._addPoint(t) && this._points.length > 1))
      if (this.needsFullRender())
        this.canvas.clearContext(this.canvas.contextTop), this._render();
      else {
        const s = this._points, i = s.length, r = this.canvas.contextTop;
        this._saveAndTransform(r), this.oldEnd && (r.beginPath(), r.moveTo(this.oldEnd.x, this.oldEnd.y)), this.oldEnd = ss.drawSegment(
          r,
          s[i - 2],
          s[i - 1]
        ), r.stroke(), r.restore();
      }
  }
  /**
   * Invoked on mouse up
   */
  onMouseUp({ e: t }) {
    return this.canvas._isMainEvent(t) ? (this.drawStraightLine = !1, this.oldEnd = void 0, this._finalizeAndAddPath(), !1) : !0;
  }
  /**
   * @private
   * @param {Point} pointer Actual mouse position related to the canvas.
   */
  _prepareForDrawing(t) {
    this._reset(), this._addPoint(t), this.canvas.contextTop.moveTo(t.x, t.y);
  }
  /**
   * @private
   * @param {Point} point Point to be added to points array
   */
  _addPoint(t) {
    return this._points.length > 1 && t.eq(this._points[this._points.length - 1]) ? !1 : (this.drawStraightLine && this._points.length > 1 && (this._hasStraightLine = !0, this._points.pop()), this._points.push(t), !0);
  }
  /**
   * Clear points array and set contextTop canvas style.
   * @private
   */
  _reset() {
    this._points = [], this._setBrushStyles(this.canvas.contextTop), this._setShadow(), this._hasStraightLine = !1;
  }
  /**
   * Draw a smooth path on the topCanvas using quadraticCurveTo
   * @private
   * @param {CanvasRenderingContext2D} [ctx]
   */
  _render(t = this.canvas.contextTop) {
    let e = this._points[0], s = this._points[1];
    if (this._saveAndTransform(t), t.beginPath(), this._points.length === 2 && e.x === s.x && e.y === s.y) {
      const i = this.width / 1e3;
      e.x -= i, s.x += i;
    }
    t.moveTo(e.x, e.y);
    for (let i = 1; i < this._points.length; i++)
      ss.drawSegment(t, e, s), e = this._points[i], s = this._points[i + 1];
    t.lineTo(e.x, e.y), t.stroke(), t.restore();
  }
  /**
   * Converts points to SVG path
   * @param {Point[]} points Array of points
   * @return {TSimplePathData} SVG path commands
   */
  convertPointsToSVGPath(t) {
    const e = this.width / 1e3;
    return En(t, e);
  }
  /**
   * Creates a Path object to add on canvas
   * @param {TSimplePathData} pathData Path data
   * @return {Path} Path to add on canvas
   */
  createPath(t) {
    const e = new Le(t, {
      fill: null,
      stroke: this.color,
      strokeWidth: this.width,
      strokeLineCap: this.strokeLineCap,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeLineJoin: this.strokeLineJoin,
      strokeDashArray: this.strokeDashArray
    });
    return this.shadow && (this.shadow.affectStroke = !0, e.shadow = new xt(this.shadow)), e;
  }
  /**
   * Decimate points array with the decimate value
   */
  decimatePoints(t, e) {
    if (t.length <= 2)
      return t;
    let s = t[0], i;
    const r = this.canvas.getZoom(), o = Math.pow(e / r, 2), a = t.length - 1, h = [s];
    for (let l = 1; l < a - 1; l++)
      i = Math.pow(s.x - t[l].x, 2) + Math.pow(s.y - t[l].y, 2), i >= o && (s = t[l], h.push(s));
    return h.push(t[a]), h;
  }
  /**
   * On mouseup after drawing the path on contextTop canvas
   * we use the points captured to create an new Path object
   * and add it to the canvas.
   */
  _finalizeAndAddPath() {
    this.canvas.contextTop.closePath(), this.decimate && (this._points = this.decimatePoints(this._points, this.decimate));
    const e = this.convertPointsToSVGPath(this._points);
    if (cl(e)) {
      this.canvas.requestRenderAll();
      return;
    }
    const s = this.createPath(e);
    this.canvas.clearContext(this.canvas.contextTop), this.canvas.fire("before:path:created", { path: s }), this.canvas.add(s), this.canvas.requestRenderAll(), s.setCoords(), this._resetShadow(), this.canvas.fire("path:created", { path: s });
  }
}
const or = [
  "radius",
  "startAngle",
  "endAngle",
  "counterClockwise"
], ul = {
  radius: 0,
  startAngle: 0,
  endAngle: 360,
  counterClockwise: !1
};
class ce extends z {
  static type = "Circle";
  static cacheProperties = [...At, ...or];
  static ownDefaults = ul;
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...ce.ownDefaults
    };
  }
  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(t) {
    super(), Object.assign(this, ce.ownDefaults), this.setOptions(t);
  }
  /**
   * @private
   * @param {String} key
   * @param {*} value
   */
  _set(t, e) {
    return super._set(t, e), t === "radius" && this.setRadius(e), this;
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render(t) {
    t.beginPath(), t.arc(
      0,
      0,
      this.radius,
      I(this.startAngle),
      I(this.endAngle),
      this.counterClockwise
    ), this._renderPaintInOrder(t);
  }
  /**
   * Returns horizontal radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusX() {
    return this.get("radius") * this.get(Q);
  }
  /**
   * Returns vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusY() {
    return this.get("radius") * this.get(at);
  }
  /**
   * Sets radius of an object (and updates width accordingly)
   */
  setRadius(t) {
    this.radius = t, this.set({ width: t * 2, height: t * 2 });
  }
  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(t = []) {
    return super.toObject([...or, ...t]);
  }
  /* _TO_SVG_START_ */
  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const t = (this.endAngle - this.startAngle) % 360;
    if (t === 0)
      return [
        "<circle ",
        "COMMON_PARTS",
        'cx="0" cy="0" ',
        'r="',
        `${this.radius}`,
        `" />
`
      ];
    {
      const { radius: e } = this, s = I(this.startAngle), i = I(this.endAngle), r = vt(s) * e, o = Ct(s) * e, a = vt(i) * e, h = Ct(i) * e, l = t > 180 ? 1 : 0, c = this.counterClockwise ? 0 : 1;
      return [
        `<path d="M ${r} ${o} A ${e} ${e} 0 ${l} ${c} ${a} ${h}" `,
        "COMMON_PARTS",
        ` />
`
      ];
    }
  }
  /* _TO_SVG_END_ */
  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Circle.fromElement})
   * @see: http://www.w3.org/TR/SVG/shapes.html#CircleElement
   */
  static ATTRIBUTE_NAMES = ["cx", "cy", "r", ...Yt];
  /**
   * Returns {@link Circle} instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Partial Circle object to default missing properties on the element.
   * @throws {Error} If value of `r` attribute is missing or invalid
   */
  static async fromElement(t, e, s) {
    const {
      left: i = 0,
      top: r = 0,
      radius: o = 0,
      ...a
    } = Ft(
      t,
      this.ATTRIBUTE_NAMES,
      s
    );
    return new this({
      ...a,
      radius: o,
      left: i - o,
      top: r - o
    });
  }
  /* _FROM_SVG_END_ */
  /**
   * @todo how do we declare this??
   */
  static fromObject(t) {
    return super._fromObject(t);
  }
}
x.setClass(ce);
x.setSVGClass(ce);
class Uc extends Li {
  /**
   * Width of a brush
   * @type Number
   */
  width = 10;
  constructor(t) {
    super(t), this.points = [];
  }
  /**
   * Invoked inside on mouse down and mouse move
   * @param {Point} pointer
   */
  drawDot(t) {
    const e = this.addPoint(t), s = this.canvas.contextTop;
    this._saveAndTransform(s), this.dot(s, e), s.restore();
  }
  dot(t, e) {
    t.fillStyle = e.fill, t.beginPath(), t.arc(e.x, e.y, e.radius, 0, Math.PI * 2, !1), t.closePath(), t.fill();
  }
  /**
   * Invoked on mouse down
   */
  onMouseDown(t) {
    this.points = [], this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.drawDot(t);
  }
  /**
   * Render the full state of the brush
   * @private
   */
  _render() {
    const t = this.canvas.contextTop, e = this.points;
    this._saveAndTransform(t);
    for (let s = 0; s < e.length; s++)
      this.dot(t, e[s]);
    t.restore();
  }
  /**
   * Invoked on mouse move
   * @param {Point} pointer
   */
  onMouseMove(t) {
    this.limitedToCanvasSize === !0 && this._isOutSideCanvas(t) || (this.needsFullRender() ? (this.canvas.clearContext(this.canvas.contextTop), this.addPoint(t), this._render()) : this.drawDot(t));
  }
  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    const t = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = !1;
    const e = [];
    for (let i = 0; i < this.points.length; i++) {
      const r = this.points[i], o = new ce({
        radius: r.radius,
        left: r.x,
        top: r.y,
        originX: T,
        originY: T,
        fill: r.fill
      });
      this.shadow && (o.shadow = new xt(this.shadow)), e.push(o);
    }
    const s = new Tt(e, { canvas: this.canvas });
    this.canvas.fire("before:path:created", { path: s }), this.canvas.add(s), this.canvas.fire("path:created", { path: s }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.requestRenderAll();
  }
  /**
   * @param {Object} pointer
   * @return {Point} Just added pointer point
   */
  addPoint({ x: t, y: e }) {
    const s = {
      x: t,
      y: e,
      radius: Wt(Math.max(0, this.width - 20), this.width + 20) / 2,
      fill: new E(this.color).setAlpha(Wt(0, 100) / 100).toRgba()
    };
    return this.points.push(s), s;
  }
}
function fl(n) {
  const t = {}, e = [];
  for (let s = 0, i; s < n.length; s++)
    i = `${n[s].left}${n[s].top}`, t[i] || (t[i] = !0, e.push(n[s]));
  return e;
}
class qc extends Li {
  /**
   * Width of a spray
   * @type Number
   */
  width = 10;
  /**
   * Density of a spray (number of dots per chunk)
   * @type Number
   */
  density = 20;
  /**
   * Width of spray dots
   * @type Number
   */
  dotWidth = 1;
  /**
   * Width variance of spray dots
   * @type Number
   */
  dotWidthVariance = 1;
  /**
   * Whether opacity of a dot should be random
   * @type Boolean
   */
  randomOpacity = !1;
  /**
   * Whether overlapping dots (rectangles) should be removed (for performance reasons)
   * @type Boolean
   */
  optimizeOverlapping = !0;
  /**
   * Constructor
   * @param {Canvas} canvas
   * @return {SprayBrush} Instance of a spray brush
   */
  constructor(t) {
    super(t), this.sprayChunks = [], this.sprayChunk = [];
  }
  /**
   * Invoked on mouse down
   * @param {Point} pointer
   */
  onMouseDown(t) {
    this.sprayChunks = [], this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.addSprayChunk(t), this.renderChunck(this.sprayChunk);
  }
  /**
   * Invoked on mouse move
   * @param {Point} pointer
   */
  onMouseMove(t) {
    this.limitedToCanvasSize === !0 && this._isOutSideCanvas(t) || (this.addSprayChunk(t), this.renderChunck(this.sprayChunk));
  }
  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    const t = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = !1;
    const e = [];
    for (let i = 0; i < this.sprayChunks.length; i++) {
      const r = this.sprayChunks[i];
      for (let o = 0; o < r.length; o++) {
        const a = r[o], h = new Nt({
          width: a.width,
          height: a.width,
          left: a.x + 1,
          top: a.y + 1,
          originX: T,
          originY: T,
          fill: this.color
        });
        e.push(h);
      }
    }
    const s = new Tt(
      this.optimizeOverlapping ? fl(e) : e,
      {
        objectCaching: !0,
        subTargetCheck: !1,
        interactive: !1
      }
    );
    this.shadow && s.set("shadow", new xt(this.shadow)), this.canvas.fire("before:path:created", { path: s }), this.canvas.add(s), this.canvas.fire("path:created", { path: s }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.requestRenderAll();
  }
  renderChunck(t) {
    const e = this.canvas.contextTop;
    e.fillStyle = this.color, this._saveAndTransform(e);
    for (let s = 0; s < t.length; s++) {
      const i = t[s];
      e.globalAlpha = i.opacity, e.fillRect(i.x, i.y, i.width, i.width);
    }
    e.restore();
  }
  /**
   * Render all spray chunks
   */
  _render() {
    const t = this.canvas.contextTop;
    t.fillStyle = this.color, this._saveAndTransform(t);
    for (let e = 0; e < this.sprayChunks.length; e++)
      this.renderChunck(this.sprayChunks[e]);
    t.restore();
  }
  /**
   * @param {Point} pointer
   */
  addSprayChunk(t) {
    this.sprayChunk = [];
    const e = this.width / 2;
    for (let s = 0; s < this.density; s++)
      this.sprayChunk.push({
        x: Wt(t.x - e, t.x + e),
        y: Wt(t.y - e, t.y + e),
        width: this.dotWidthVariance ? Wt(
          // bottom clamp width to 1
          Math.max(1, this.dotWidth - this.dotWidthVariance),
          this.dotWidth + this.dotWidthVariance
        ) : this.dotWidth,
        opacity: this.randomOpacity ? Wt(0, 100) / 100 : 1
      });
    this.sprayChunks.push(this.sprayChunk);
  }
}
class Kc extends ss {
  constructor(t) {
    super(t);
  }
  getPatternSrc() {
    const s = ut(), i = s.getContext("2d");
    return s.width = s.height = 25, i && (i.fillStyle = this.color, i.beginPath(), i.arc(
      20 / 2,
      20 / 2,
      20 / 2,
      0,
      Math.PI * 2,
      !1
    ), i.closePath(), i.fill()), s;
  }
  /**
   * Creates "pattern" instance property
   * @param {CanvasRenderingContext2D} ctx
   */
  getPattern(t) {
    return t.createPattern(this.source || this.getPatternSrc(), "repeat");
  }
  /**
   * Sets brush styles
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles(t) {
    super._setBrushStyles(t);
    const e = this.getPattern(t);
    e && (t.strokeStyle = e);
  }
  /**
   * Creates path
   */
  createPath(t) {
    const e = super.createPath(t), s = e._getLeftTopCoords().scalarAdd(e.strokeWidth / 2);
    return e.stroke = new Fi({
      source: this.source || this.getPatternSrc(),
      offsetX: -s.x,
      offsetY: -s.y
    }), e;
  }
}
const Fs = ["x1", "x2", "y1", "y2"];
class xs extends z {
  static type = "Line";
  static cacheProperties = [...At, ...Fs];
  /**
   * Constructor
   * @param {Array} [points] Array of points
   * @param {Object} [options] Options object
   * @return {Line} thisArg
   */
  constructor([t, e, s, i] = [0, 0, 0, 0], r = {}) {
    super(), Object.assign(this, xs.ownDefaults), this.setOptions(r), this.x1 = t, this.x2 = s, this.y1 = e, this.y2 = i, this._setWidthHeight();
    const { left: o, top: a } = r;
    typeof o == "number" && this.set(P, o), typeof a == "number" && this.set(it, a);
  }
  /**
   * @private
   * @param {Object} [options] Options
   */
  _setWidthHeight() {
    const { x1: t, y1: e, x2: s, y2: i } = this;
    this.width = Math.abs(s - t), this.height = Math.abs(i - e);
    const { left: r, top: o, width: a, height: h } = wt([
      { x: t, y: e },
      { x: s, y: i }
    ]), l = new m(r + a / 2, o + h / 2);
    this.setPositionByOrigin(l, T, T);
  }
  /**
   * @private
   * @param {String} key
   * @param {*} value
   */
  _set(t, e) {
    return super._set(t, e), Fs.includes(t) && this._setWidthHeight(), this;
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(t) {
    t.beginPath();
    const e = this.calcLinePoints();
    t.moveTo(e.x1, e.y1), t.lineTo(e.x2, e.y2), t.lineWidth = this.strokeWidth;
    const s = t.strokeStyle;
    ct(this.stroke) ? t.strokeStyle = this.stroke.toLive(t) : t.strokeStyle = this.stroke ?? t.fillStyle, this.stroke && this._renderStroke(t), t.strokeStyle = s;
  }
  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    return new m((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
  }
  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(t = []) {
    return {
      ...super.toObject(t),
      ...this.calcLinePoints()
    };
  }
  /*
   * Calculate object dimensions from its properties
   * @private
   */
  _getNonTransformedDimensions() {
    const t = super._getNonTransformedDimensions();
    return this.strokeLineCap === "butt" && (this.width === 0 && (t.y -= this.strokeWidth), this.height === 0 && (t.x -= this.strokeWidth)), t;
  }
  /**
   * Recalculates line points given width and height
   * Those points are simply placed around the center,
   * This is not useful outside internal render functions and svg output
   * Is not meant to be for the developer.
   * @private
   */
  calcLinePoints() {
    const { x1: t, x2: e, y1: s, y2: i, width: r, height: o } = this, a = t <= e ? -1 : 1, h = s <= i ? -1 : 1, l = a * r / 2, c = h * o / 2, u = a * -r / 2, f = h * -o / 2;
    return {
      x1: l,
      x2: u,
      y1: c,
      y2: f
    };
  }
  /* _FROM_SVG_START_ */
  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const { x1: t, x2: e, y1: s, y2: i } = this.calcLinePoints();
    return [
      "<line ",
      "COMMON_PARTS",
      `x1="${t}" y1="${s}" x2="${e}" y2="${i}" />
`
    ];
  }
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Line.fromElement})
   * @see http://www.w3.org/TR/SVG/shapes.html#LineElement
   */
  static ATTRIBUTE_NAMES = Yt.concat(Fs);
  /**
   * Returns Line instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {Function} [callback] callback function invoked after parsing
   */
  static async fromElement(t, e, s) {
    const {
      x1: i = 0,
      y1: r = 0,
      x2: o = 0,
      y2: a = 0,
      ...h
    } = Ft(t, this.ATTRIBUTE_NAMES, s);
    return new this([i, r, o, a], h);
  }
  /* _FROM_SVG_END_ */
  /**
   * Returns Line instance from an object representation
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Line>}
   */
  static fromObject({
    x1: t,
    y1: e,
    x2: s,
    y2: i,
    ...r
  }) {
    return this._fromObject(
      {
        ...r,
        points: [t, e, s, i]
      },
      {
        extraParam: "points"
      }
    );
  }
}
x.setClass(xs);
x.setSVGClass(xs);
const dl = {
  width: 100,
  height: 100
};
class ke extends z {
  static type = "Triangle";
  static ownDefaults = dl;
  static getDefaults() {
    return { ...super.getDefaults(), ...ke.ownDefaults };
  }
  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(t) {
    super(), Object.assign(this, ke.ownDefaults), this.setOptions(t);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(t) {
    const e = this.width / 2, s = this.height / 2;
    t.beginPath(), t.moveTo(-e, s), t.lineTo(0, -s), t.lineTo(e, s), t.closePath(), this._renderPaintInOrder(t);
  }
  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const t = this.width / 2, e = this.height / 2;
    return ["<polygon ", "COMMON_PARTS", 'points="', `${-t} ${e},0 ${-e},${t} ${e}`, '" />'];
  }
}
x.setClass(ke);
x.setSVGClass(ke);
const gl = {
  rx: 0,
  ry: 0
}, ar = ["rx", "ry"];
class Me extends z {
  static type = "Ellipse";
  static cacheProperties = [...At, ...ar];
  static ownDefaults = gl;
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Me.ownDefaults
    };
  }
  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(t) {
    super(), Object.assign(this, Me.ownDefaults), this.setOptions(t);
  }
  /**
   * @private
   * @param {String} key
   * @param {*} value
   * @return {Ellipse} thisArg
   */
  _set(t, e) {
    switch (super._set(t, e), t) {
      case "rx":
        this.rx = e, this.set("width", e * 2);
        break;
      case "ry":
        this.ry = e, this.set("height", e * 2);
        break;
    }
    return this;
  }
  /**
   * Returns horizontal radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRx() {
    return this.get("rx") * this.get(Q);
  }
  /**
   * Returns Vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRy() {
    return this.get("ry") * this.get(at);
  }
  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(t = []) {
    return super.toObject([...ar, ...t]);
  }
  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    return [
      "<ellipse ",
      "COMMON_PARTS",
      `cx="0" cy="0" rx="${this.rx}" ry="${this.ry}" />
`
    ];
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render(t) {
    t.beginPath(), t.save(), t.transform(1, 0, 0, this.ry / this.rx, 0, 0), t.arc(0, 0, this.rx, 0, yt, !1), t.restore(), this._renderPaintInOrder(t);
  }
  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Ellipse.fromElement})
   * @see http://www.w3.org/TR/SVG/shapes.html#EllipseElement
   */
  static ATTRIBUTE_NAMES = [...Yt, "cx", "cy", "rx", "ry"];
  /**
   * Returns {@link Ellipse} instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @return {Ellipse}
   */
  static async fromElement(t, e, s) {
    const i = Ft(
      t,
      this.ATTRIBUTE_NAMES,
      s
    );
    return i.left = (i.left || 0) - i.rx, i.top = (i.top || 0) - i.ry, new this(i);
  }
  /* _FROM_SVG_END_ */
}
x.setClass(Me);
x.setSVGClass(Me);
function pl(n) {
  if (!n)
    return [];
  const t = n.replace(/,/g, " ").trim().split(/\s+/), e = [];
  for (let s = 0; s < t.length; s += 2)
    e.push({
      x: parseFloat(t[s]),
      y: parseFloat(t[s + 1])
    });
  return e;
}
const Bn = {
  /**
   * @deprecated transient option soon to be removed in favor of a different design
   */
  exactBoundingBox: !1
};
class ue extends z {
  static ownDefaults = Bn;
  static type = "Polyline";
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...ue.ownDefaults
    };
  }
  /**
   * A list of properties that if changed trigger a recalculation of dimensions
   * @todo check if you really need to recalculate for all cases
   */
  static layoutProperties = [
    de,
    ge,
    "strokeLineCap",
    "strokeLineJoin",
    "strokeMiterLimit",
    "strokeWidth",
    "strokeUniform",
    "points"
  ];
  static cacheProperties = [...At, "points"];
  strokeDiff;
  /**
   * Constructor
   * @param {Array} points Array of points (where each point is an object with x and y)
   * @param {Object} [options] Options object
   * @return {Polyline} thisArg
   * @example
   * var poly = new Polyline([
   *     { x: 10, y: 10 },
   *     { x: 50, y: 30 },
   *     { x: 40, y: 70 },
   *     { x: 60, y: 50 },
   *     { x: 100, y: 150 },
   *     { x: 40, y: 100 }
   *   ], {
   *   stroke: 'red',
   *   left: 100,
   *   top: 100
   * });
   */
  constructor(t = [], e = {}) {
    super(), Object.assign(this, ue.ownDefaults), this.setOptions(e), this.points = t;
    const { left: s, top: i } = e;
    this.initialized = !0, this.setBoundingBox(!0), typeof s == "number" && this.set(P, s), typeof i == "number" && this.set(it, i);
  }
  isOpen() {
    return !0;
  }
  _projectStrokeOnPoints(t) {
    return gn(this.points, t, this.isOpen());
  }
  /**
   * Calculate the polygon bounding box
   * @private
   */
  _calcDimensions(t) {
    t = {
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      skewY: this.skewY,
      strokeLineCap: this.strokeLineCap,
      strokeLineJoin: this.strokeLineJoin,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeUniform: this.strokeUniform,
      strokeWidth: this.strokeWidth,
      ...t || {}
    };
    const e = this.exactBoundingBox ? this._projectStrokeOnPoints(
      t
    ).map((l) => l.projectedPoint) : this.points;
    if (e.length === 0)
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        pathOffset: new m(),
        strokeOffset: new m(),
        strokeDiff: new m()
      };
    const s = wt(e), i = Ee({ ...t, scaleX: 1, scaleY: 1 }), r = wt(
      this.points.map((l) => G(l, i, !0))
    ), o = new m(this.scaleX, this.scaleY);
    let a = s.left + s.width / 2, h = s.top + s.height / 2;
    return this.exactBoundingBox && (a = a - h * Math.tan(I(this.skewX)), h = h - a * Math.tan(I(this.skewY))), {
      ...s,
      pathOffset: new m(a, h),
      strokeOffset: new m(r.left, r.top).subtract(new m(s.left, s.top)).multiply(o),
      strokeDiff: new m(s.width, s.height).subtract(new m(r.width, r.height)).multiply(o)
    };
  }
  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates, by look at the polyline/polygon points.
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    const t = wt(this.points);
    return new m(t.left + t.width / 2, t.top + t.height / 2);
  }
  setDimensions() {
    this.setBoundingBox();
  }
  setBoundingBox(t) {
    const { left: e, top: s, width: i, height: r, pathOffset: o, strokeOffset: a, strokeDiff: h } = this._calcDimensions();
    this.set({ width: i, height: r, pathOffset: o, strokeOffset: a, strokeDiff: h }), t && this.setPositionByOrigin(
      new m(e + i / 2, s + r / 2),
      T,
      T
    );
  }
  /**
   * @deprecated intermidiate method to be removed, do not use
   */
  isStrokeAccountedForInDimensions() {
    return this.exactBoundingBox;
  }
  /**
   * @override stroke is taken in account in size
   */
  _getNonTransformedDimensions() {
    return this.exactBoundingBox ? (
      // TODO: fix this
      new m(this.width, this.height)
    ) : super._getNonTransformedDimensions();
  }
  /**
   * @override stroke and skewing are taken into account when projecting stroke on points,
   * therefore we don't want the default calculation to account for skewing as well.
   * Though it is possible to pass `width` and `height` in `options`, doing so is very strange, use with discretion.
   *
   * @private
   */
  _getTransformedDimensions(t = {}) {
    if (this.exactBoundingBox) {
      let e;
      if (Object.keys(t).some(
        (s) => this.strokeUniform || this.constructor.layoutProperties.includes(
          s
        )
      )) {
        const { width: s, height: i } = this._calcDimensions(t);
        e = new m(t.width ?? s, t.height ?? i);
      } else
        e = new m(
          t.width ?? this.width,
          t.height ?? this.height
        );
      return e.multiply(
        new m(t.scaleX || this.scaleX, t.scaleY || this.scaleY)
      );
    } else
      return super._getTransformedDimensions(t);
  }
  /**
   * Recalculates dimensions when changing skew and scale
   * @private
   */
  _set(t, e) {
    const s = this.initialized && this[t] !== e, i = super._set(t, e);
    return this.exactBoundingBox && s && ((t === Q || t === at) && this.strokeUniform && this.constructor.layoutProperties.includes(
      "strokeUniform"
    ) || this.constructor.layoutProperties.includes(
      t
    )) && this.setDimensions(), i;
  }
  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject(t = []) {
    return {
      ...super.toObject(t),
      points: this.points.map(({ x: e, y: s }) => ({ x: e, y: s }))
    };
  }
  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const t = [], e = this.pathOffset.x, s = this.pathOffset.y, i = M.NUM_FRACTION_DIGITS;
    for (let r = 0, o = this.points.length; r < o; r++)
      t.push(
        F(this.points[r].x - e, i),
        ",",
        F(this.points[r].y - s, i),
        " "
      );
    return [
      `<${this.constructor.type.toLowerCase()} `,
      "COMMON_PARTS",
      `points="${t.join("")}" />
`
    ];
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(t) {
    const e = this.points.length, s = this.pathOffset.x, i = this.pathOffset.y;
    if (!(!e || isNaN(this.points[e - 1].y))) {
      t.beginPath(), t.moveTo(this.points[0].x - s, this.points[0].y - i);
      for (let r = 0; r < e; r++) {
        const o = this.points[r];
        t.lineTo(o.x - s, o.y - i);
      }
      !this.isOpen() && t.closePath(), this._renderPaintInOrder(t);
    }
  }
  /**
   * Returns complexity of an instance
   * @return {Number} complexity of this instance
   */
  complexity() {
    return this.points.length;
  }
  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Polyline.fromElement})
   * @see: http://www.w3.org/TR/SVG/shapes.html#PolylineElement
   */
  static ATTRIBUTE_NAMES = [...Yt];
  /**
   * Returns Polyline instance from an SVG element
   * @param {HTMLElement} element Element to parser
   * @param {Object} [options] Options object
   */
  static async fromElement(t, e, s) {
    const i = pl(t.getAttribute("points")), { left: r, top: o, ...a } = Ft(
      t,
      this.ATTRIBUTE_NAMES,
      s
    );
    return new this(i, {
      ...a,
      ...e
    });
  }
  /* _FROM_SVG_END_ */
  /**
   * Returns Polyline instance from an object representation
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Polyline>}
   */
  static fromObject(t) {
    return this._fromObject(t, {
      extraParam: "points"
    });
  }
}
x.setClass(ue);
x.setSVGClass(ue);
class In extends ue {
  static ownDefaults = Bn;
  static type = "Polygon";
  isOpen() {
    return !1;
  }
}
x.setClass(In);
x.setSVGClass(In);
class ml extends z {
  static _styleProperties = Ho;
  /**
   * Returns true if object has no styling or no styling in a line
   * @param {Number} lineIndex , lineIndex is on wrapped lines.
   * @return {Boolean}
   */
  isEmptyStyles(t) {
    if (!this.styles || typeof t < "u" && !this.styles[t])
      return !0;
    const e = typeof t > "u" ? this.styles : { line: this.styles[t] };
    for (const s in e)
      for (const i in e[s])
        for (const r in e[s][i])
          return !1;
    return !0;
  }
  /**
   * Returns true if object has a style property or has it ina specified line
   * This function is used to detect if a text will use a particular property or not.
   * @param {String} property to check for
   * @param {Number} lineIndex to check the style on
   * @return {Boolean}
   */
  styleHas(t, e) {
    if (!this.styles || typeof e < "u" && !this.styles[e])
      return !1;
    const s = typeof e > "u" ? this.styles : { 0: this.styles[e] };
    for (const i in s)
      for (const r in s[i])
        if (typeof s[i][r][t] < "u")
          return !0;
    return !1;
  }
  /**
   * Check if characters in a text have a value for a property
   * whose value matches the textbox's value for that property.  If so,
   * the character-level property is deleted.  If the character
   * has no other properties, then it is also deleted.  Finally,
   * if the line containing that character has no other characters
   * then it also is deleted.
   */
  cleanStyle(t) {
    if (!this.styles)
      return !1;
    const e = this.styles;
    let s = 0, i, r, o = !0, a = 0;
    for (const h in e) {
      i = 0;
      for (const l in e[h]) {
        const c = e[h][l] || {}, u = c[t] !== void 0;
        s++, u ? (r ? c[t] !== r && (o = !1) : r = c[t], c[t] === this[t] && delete c[t]) : o = !1, Object.keys(c).length !== 0 ? i++ : delete e[h][l];
      }
      i === 0 && delete e[h];
    }
    for (let h = 0; h < this._textLines.length; h++)
      a += this._textLines[h].length;
    o && s === a && (this[t] = r, this.removeStyle(t));
  }
  /**
   * Remove a style property or properties from all individual character styles
   * in a text object.  Deletes the character style object if it contains no other style
   * props.  Deletes a line style object if it contains no other character styles.
   *
   * @param {String} props The property to remove from character styles.
   */
  removeStyle(t) {
    if (!this.styles)
      return;
    const e = this.styles;
    let s, i, r;
    for (i in e) {
      s = e[i];
      for (r in s)
        delete s[r][t], Object.keys(s[r]).length === 0 && delete s[r];
      Object.keys(s).length === 0 && delete e[i];
    }
  }
  _extendStyles(t, e) {
    const { lineIndex: s, charIndex: i } = this.get2DCursorLocation(t);
    this._getLineStyle(s) || this._setLineStyle(s);
    const r = ci(
      {
        // first create a new object that is a merge of existing and new
        ...this._getStyleDeclaration(s, i),
        ...e
        // use the predicate to discard undefined values
      },
      (o) => o !== void 0
    );
    this._setStyleDeclaration(s, i, r);
  }
  /**
   * Gets style of a current selection/cursor (at the start position)
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} endIndex End index to get styles at, if not specified startIndex + 1
   * @param {Boolean} [complete] get full style or not
   * @return {Array} styles an array with one, zero or more Style objects
   */
  getSelectionStyles(t, e, s) {
    const i = [];
    for (let r = t; r < (e || t); r++)
      i.push(this.getStyleAtPosition(r, s));
    return i;
  }
  /**
   * Gets style of a current selection/cursor position
   * @param {Number} position  to get styles at
   * @param {Boolean} [complete] full style if true
   * @return {Object} style Style object at a specified index
   * @private
   */
  getStyleAtPosition(t, e) {
    const { lineIndex: s, charIndex: i } = this.get2DCursorLocation(t);
    return e ? this.getCompleteStyleDeclaration(s, i) : this._getStyleDeclaration(s, i);
  }
  /**
   * Sets style of a current selection, if no selection exist, do not set anything.
   * @param {Object} styles Styles object
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} [endIndex] End index to get styles at, if not specified startIndex + 1
   */
  setSelectionStyles(t, e, s) {
    for (let i = e; i < (s || e); i++)
      this._extendStyles(i, t);
    this._forceClearCache = !0;
  }
  /**
   * Get a reference, not a clone, to the style object for a given character,
   * if no style is set for a line or char, return a new empty object.
   * This is tricky and confusing because when you get an empty object you can't
   * determine if it is a reference or a new one.
   * @TODO this should always return a reference or always a clone or undefined when necessary.
   * @protected
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {TextStyleDeclaration} a style object reference to the existing one or a new empty object when undefined
   */
  _getStyleDeclaration(t, e) {
    const s = this.styles && this.styles[t];
    return s ? s[e] ?? {} : {};
  }
  /**
   * return a new object that contains all the style property for a character
   * the object returned is newly created
   * @param {Number} lineIndex of the line where the character is
   * @param {Number} charIndex position of the character on the line
   * @return {Object} style object
   */
  getCompleteStyleDeclaration(t, e) {
    return {
      ...Jt(
        this,
        this.constructor._styleProperties
      ),
      ...this._getStyleDeclaration(t, e)
    };
  }
  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @param {Object} style
   * @private
   */
  _setStyleDeclaration(t, e, s) {
    this.styles[t][e] = s;
  }
  /**
   *
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @private
   */
  _deleteStyleDeclaration(t, e) {
    delete this.styles[t][e];
  }
  /**
   * @param {Number} lineIndex
   * @return {Boolean} if the line exists or not
   * @private
   */
  _getLineStyle(t) {
    return !!this.styles[t];
  }
  /**
   * Set the line style to an empty object so that is initialized
   * @param {Number} lineIndex
   * @private
   */
  _setLineStyle(t) {
    this.styles[t] = {};
  }
  _deleteLineStyle(t) {
    delete this.styles[t];
  }
}
const _l = /  +/g, yl = /"/g;
function Ls(n, t, e, s, i) {
  return `		${Go(n, { left: t, top: e, width: s, height: i })}
`;
}
class vl extends $r {
  _toSVG() {
    const t = this._getSVGLeftTopOffsets(), e = this._getSVGTextAndBg(t.textTop, t.textLeft);
    return this._wrapSVGTextAndBg(e);
  }
  toSVG(t) {
    const e = this._createBaseSVGMarkup(this._toSVG(), {
      reviver: t,
      noStyle: !0,
      withShadow: !0
    }), s = this.path;
    return s ? e + s._createBaseSVGMarkup(s._toSVG(), {
      reviver: t,
      withShadow: !0,
      additionalTransform: he(this.calcOwnMatrix())
    }) : e;
  }
  _getSVGLeftTopOffsets() {
    return {
      textLeft: -this.width / 2,
      textTop: -this.height / 2,
      lineTop: this.getHeightOfLine(0)
    };
  }
  _wrapSVGTextAndBg({
    textBgRects: t,
    textSpans: e
  }) {
    const i = this.getSvgTextDecoration(this);
    return [
      t.join(""),
      '		<text xml:space="preserve" ',
      `font-family="${this.fontFamily.replace(yl, "'")}" `,
      `font-size="${this.fontSize}" `,
      this.fontStyle ? `font-style="${this.fontStyle}" ` : "",
      this.fontWeight ? `font-weight="${this.fontWeight}" ` : "",
      i ? `text-decoration="${i}" ` : "",
      this.direction === "rtl" ? `direction="${this.direction}" ` : "",
      'style="',
      this.getSvgStyles(!0),
      '"',
      this.addPaintOrder(),
      " >",
      e.join(""),
      `</text>
`
    ];
  }
  /**
   * @private
   * @param {Number} textTopOffset Text top offset
   * @param {Number} textLeftOffset Text left offset
   * @return {Object}
   */
  _getSVGTextAndBg(t, e) {
    const s = [], i = [];
    let r = t, o;
    this.backgroundColor && i.push(
      ...Ls(
        this.backgroundColor,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      )
    );
    for (let a = 0, h = this._textLines.length; a < h; a++)
      o = this._getLineLeftOffset(a), this.direction === "rtl" && (o += this.width), (this.textBackgroundColor || this.styleHas("textBackgroundColor", a)) && this._setSVGTextLineBg(
        i,
        a,
        e + o,
        r
      ), this._setSVGTextLineText(
        s,
        a,
        e + o,
        r
      ), r += this.getHeightOfLine(a);
    return {
      textSpans: s,
      textBgRects: i
    };
  }
  _createTextCharSpan(t, e, s, i, r) {
    const o = M.NUM_FRACTION_DIGITS, a = this.getSvgSpanStyles(
      e,
      t !== t.trim() || !!t.match(_l)
    ), h = a ? `style="${a}"` : "", l = e.deltaY, c = l ? ` dy="${F(l, o)}" ` : "", { angle: u, renderLeft: f, renderTop: d, width: g } = r;
    let p = "";
    if (f !== void 0) {
      const _ = g / 2;
      u && (p = ` rotate="${F(Pt(u), o)}"`);
      const y = Kt({ angle: Pt(u) });
      y[4] = f, y[5] = d;
      const v = new m(-_, 0).transform(y);
      s = v.x, i = v.y;
    }
    return `<tspan x="${F(s, o)}" y="${F(
      i,
      o
    )}" ${c}${p}${h}>${pn(t)}</tspan>`;
  }
  _setSVGTextLineText(t, e, s, i) {
    const r = this.getHeightOfLine(e), o = this.textAlign.includes(St), a = this._textLines[e];
    let h, l, c = "", u, f, d = 0, g;
    i += r * (1 - this._fontSizeFraction) / this.lineHeight;
    for (let p = 0, _ = a.length - 1; p <= _; p++)
      g = p === _ || this.charSpacing || this.path, c += a[p], u = this.__charBounds[e][p], d === 0 ? (s += u.kernedWidth - u.width, d += u.width) : d += u.kernedWidth, o && !g && this._reSpaceAndTab.test(a[p]) && (g = !0), g || (h = h || this.getCompleteStyleDeclaration(e, p), l = this.getCompleteStyleDeclaration(e, p + 1), g = Ss(h, l, !0)), g && (f = this._getStyleDeclaration(e, p), t.push(
        this._createTextCharSpan(
          c,
          f,
          s,
          i,
          u
        )
      ), c = "", h = l, this.direction === "rtl" ? s -= d : s += d, d = 0);
  }
  _setSVGTextLineBg(t, e, s, i) {
    const r = this._textLines[e], o = this.getHeightOfLine(e) / this.lineHeight;
    let a = 0, h = 0, l, c = this.getValueOfPropertyAt(e, 0, "textBackgroundColor");
    for (let u = 0; u < r.length; u++) {
      const { left: f, width: d, kernedWidth: g } = this.__charBounds[e][u];
      l = this.getValueOfPropertyAt(e, u, "textBackgroundColor"), l !== c ? (c && t.push(
        ...Ls(
          c,
          s + h,
          i,
          a,
          o
        )
      ), h = f, a = d, c = l) : a += g;
    }
    l && t.push(
      ...Ls(
        c,
        s + h,
        i,
        a,
        o
      )
    );
  }
  /**
   * Returns styles-string for svg-export
   * @param {Boolean} skipShadow a boolean to skip shadow filter output
   * @return {String}
   */
  getSvgStyles(t) {
    return `${super.getSvgStyles(t)} text-decoration-thickness: ${F(this.textDecorationThickness * this.getObjectScaling().y / 10, M.NUM_FRACTION_DIGITS)}%; white-space: pre;`;
  }
  /**
   * Returns styles-string for svg-export
   * @param {Object} style the object from which to retrieve style properties
   * @param {Boolean} useWhiteSpace a boolean to include an additional attribute in the style.
   * @return {String}
   */
  getSvgSpanStyles(t, e) {
    const {
      fontFamily: s,
      strokeWidth: i,
      stroke: r,
      fill: o,
      fontSize: a,
      fontStyle: h,
      fontWeight: l,
      deltaY: c,
      textDecorationThickness: u,
      linethrough: f,
      overline: d,
      underline: g
    } = t, p = this.getSvgTextDecoration({
      underline: g ?? this.underline,
      overline: d ?? this.overline,
      linethrough: f ?? this.linethrough
    }), _ = u || this.textDecorationThickness;
    return [
      r ? Oe(H, r) : "",
      i ? `stroke-width: ${i}; ` : "",
      s ? `font-family: ${!s.includes("'") && !s.includes('"') ? `'${s}'` : s}; ` : "",
      a ? `font-size: ${a}px; ` : "",
      h ? `font-style: ${h}; ` : "",
      l ? `font-weight: ${l}; ` : "",
      p ? `text-decoration: ${p}; text-decoration-thickness: ${F(_ * this.getObjectScaling().y / 10, M.NUM_FRACTION_DIGITS)}%; ` : "",
      o ? Oe(X, o) : "",
      c ? `baseline-shift: ${-c}; ` : "",
      e ? "white-space: pre; " : ""
    ].join("");
  }
  /**
   * Returns text-decoration property for svg-export
   * @param {Object} style the object from which to retrieve style properties
   * @return {String}
   */
  getSvgTextDecoration(t) {
    return ["overline", "underline", "line-through"].filter(
      (e) => t[e.replace("-", "")]
    ).join(" ");
  }
}
let Rs;
function Cl() {
  return Rs || (Rs = rt({
    width: 0,
    height: 0
  }).getContext("2d")), Rs;
}
class kt extends ml {
  /**
   * Properties that requires a text layout recalculation when changed
   * @type string[]
   * @protected
   */
  static textLayoutProperties = Hr;
  /**
   * contains characters bounding boxes
   * This variable is considered to be protected.
   * But for how mixins are implemented right now, we can't leave it private
   * @protected
   */
  __charBounds = [];
  static cacheProperties = [...At, ...Ui];
  static ownDefaults = zo;
  static type = "Text";
  static getDefaults() {
    return { ...super.getDefaults(), ...kt.ownDefaults };
  }
  constructor(t, e) {
    super(), Object.assign(this, kt.ownDefaults), this.setOptions(e), this.styles || (this.styles = {}), this.text = t, this.initialized = !0, this.path && this.setPathInfo(), this.initDimensions(), this.setCoords();
  }
  /**
   * If text has a path, it will add the extra information needed
   * for path and text calculations
   */
  setPathInfo() {
    const t = this.path;
    t && (t.segmentsInfo = Pi(t.path));
  }
  /**
   * @private
   * Divides text into lines of text and lines of graphemes.
   */
  _splitText() {
    const t = this._splitTextIntoLines(this.text);
    return this.textLines = t.lines, this._textLines = t.graphemeLines, this._unwrappedTextLines = t._unwrappedLines, this._text = t.graphemeText, t;
  }
  /**
   * Initialize or update text dimensions.
   * Updates this.width and this.height with the proper values.
   * Does not return dimensions.
   */
  initDimensions() {
    this._splitText(), this._clearCache(), this.dirty = !0, this.path ? (this.width = this.path.width, this.height = this.path.height) : (this.width = this.calcTextWidth() || this.cursorWidth || this.MIN_TEXT_WIDTH, this.height = this.calcTextHeight()), this.textAlign.includes(St) && this.enlargeSpaces();
  }
  /**
   * Enlarge space boxes and shift the others
   */
  enlargeSpaces() {
    let t, e, s, i, r, o, a;
    for (let h = 0, l = this._textLines.length; h < l; h++)
      if (!(this.textAlign !== St && (h === l - 1 || this.isEndOfWrapping(h))) && (i = 0, r = this._textLines[h], e = this.getLineWidth(h), e < this.width && (a = this.textLines[h].match(this._reSpacesAndTabs)))) {
        s = a.length, t = (this.width - e) / s;
        for (let c = 0; c <= r.length; c++)
          o = this.__charBounds[h][c], this._reSpaceAndTab.test(r[c]) ? (o.width += t, o.kernedWidth += t, o.left += i, i += t) : o.left += i;
      }
  }
  /**
   * Detect if the text line is ended with an hard break
   * text and itext do not have wrapping, return false
   * @return {Boolean}
   */
  isEndOfWrapping(t) {
    return t === this._textLines.length - 1;
  }
  missingNewlineOffset(t) {
    return 1;
  }
  /**
   * Returns 2d representation (lineIndex and charIndex) of cursor
   * @param {Number} selectionStart
   * @param {Boolean} [skipWrapping] consider the location for unwrapped lines. useful to manage styles.
   */
  get2DCursorLocation(t, e) {
    const s = e ? this._unwrappedTextLines : this._textLines;
    let i;
    for (i = 0; i < s.length; i++) {
      if (t <= s[i].length)
        return {
          lineIndex: i,
          charIndex: t
        };
      t -= s[i].length + this.missingNewlineOffset(i, e);
    }
    return {
      lineIndex: i - 1,
      charIndex: s[i - 1].length < t ? s[i - 1].length : t
    };
  }
  /**
   * Returns string representation of an instance
   * @return {String} String representation of text object
   */
  toString() {
    return `#<Text (${this.complexity()}): { "text": "${this.text}", "fontFamily": "${this.fontFamily}" }>`;
  }
  /**
   * Return the dimension and the zoom level needed to create a cache canvas
   * big enough to host the object to be cached.
   * @private
   * @param {Object} dim.x width of object to be cached
   * @param {Object} dim.y height of object to be cached
   * @return {Object}.width width of canvas
   * @return {Object}.height height of canvas
   * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
   * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
   */
  _getCacheCanvasDimensions() {
    const t = super._getCacheCanvasDimensions(), e = this.fontSize;
    return t.width += e * t.zoomX, t.height += e * t.zoomY, t;
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(t) {
    const e = this.path;
    e && !e.isNotVisible() && e._render(t), this._setTextStyles(t), this._renderTextLinesBackground(t), this._renderTextDecoration(t, "underline"), this._renderText(t), this._renderTextDecoration(t, "overline"), this._renderTextDecoration(t, "linethrough");
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderText(t) {
    this.paintFirst === H ? (this._renderTextStroke(t), this._renderTextFill(t)) : (this._renderTextFill(t), this._renderTextStroke(t));
  }
  /**
   * Set the font parameter of the context with the object properties or with charStyle
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Object} [charStyle] object with font style properties
   * @param {String} [charStyle.fontFamily] Font Family
   * @param {Number} [charStyle.fontSize] Font size in pixels. ( without px suffix )
   * @param {String} [charStyle.fontWeight] Font weight
   * @param {String} [charStyle.fontStyle] Font style (italic|normal)
   */
  _setTextStyles(t, e, s) {
    if (t.textBaseline = "alphabetic", this.path)
      switch (this.pathAlign) {
        case T:
          t.textBaseline = "middle";
          break;
        case "ascender":
          t.textBaseline = it;
          break;
        case "descender":
          t.textBaseline = Vs;
          break;
      }
    t.font = this._getFontDeclaration(e, s);
  }
  /**
   * calculate and return the text Width measuring each line.
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @return {Number} Maximum width of Text object
   */
  calcTextWidth() {
    let t = this.getLineWidth(0);
    for (let e = 1, s = this._textLines.length; e < s; e++) {
      const i = this.getLineWidth(e);
      i > t && (t = i);
    }
    return t;
  }
  /**
   * @private
   * @param {String} method Method name ("fillText" or "strokeText")
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {String} line Text to render
   * @param {Number} left Left position of text
   * @param {Number} top Top position of text
   * @param {Number} lineIndex Index of a line in a text
   */
  _renderTextLine(t, e, s, i, r, o) {
    this._renderChars(t, e, s, i, r, o);
  }
  /**
   * Renders the text background for lines, taking care of style
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextLinesBackground(t) {
    if (!this.textBackgroundColor && !this.styleHas("textBackgroundColor"))
      return;
    const e = t.fillStyle, s = this._getLeftOffset();
    let i = this._getTopOffset();
    for (let r = 0, o = this._textLines.length; r < o; r++) {
      const a = this.getHeightOfLine(r);
      if (!this.textBackgroundColor && !this.styleHas("textBackgroundColor", r)) {
        i += a;
        continue;
      }
      const h = this._textLines[r].length, l = this._getLineLeftOffset(r);
      let c = 0, u = 0, f, d, g = this.getValueOfPropertyAt(r, 0, "textBackgroundColor");
      const p = this.getHeightOfLineImpl(r);
      for (let _ = 0; _ < h; _++) {
        const y = this.__charBounds[r][_];
        d = this.getValueOfPropertyAt(r, _, "textBackgroundColor"), this.path ? (t.save(), t.translate(y.renderLeft, y.renderTop), t.rotate(y.angle), t.fillStyle = d, d && t.fillRect(
          -y.width / 2,
          -p * (1 - this._fontSizeFraction),
          y.width,
          p
        ), t.restore()) : d !== g ? (f = s + l + u, this.direction === "rtl" && (f = this.width - f - c), t.fillStyle = g, g && t.fillRect(f, i, c, p), u = y.left, c = y.width, g = d) : c += y.kernedWidth;
      }
      d && !this.path && (f = s + l + u, this.direction === "rtl" && (f = this.width - f - c), t.fillStyle = d, t.fillRect(f, i, c, p)), i += a;
    }
    t.fillStyle = e, this._removeShadow(t);
  }
  /**
   * measure and return the width of a single character.
   * possibly overridden to accommodate different measure logic or
   * to hook some external lib for character measurement
   * @private
   * @param {String} _char, char to be measured
   * @param {Object} charStyle style of char to be measured
   * @param {String} [previousChar] previous char
   * @param {Object} [prevCharStyle] style of previous char
   */
  _measureChar(t, e, s, i) {
    const r = ve.getFontCache(e), o = this._getFontDeclaration(e), a = s + t, h = s && o === this._getFontDeclaration(i), l = e.fontSize / this.CACHE_FONT_SIZE;
    let c, u, f, d;
    if (s && r.has(s) && (f = r.get(s)), r.has(t) && (d = c = r.get(t)), h && r.has(a) && (u = r.get(a), d = u - f), c === void 0 || f === void 0 || u === void 0) {
      const g = Cl();
      this._setTextStyles(g, e, !0), c === void 0 && (d = c = g.measureText(t).width, r.set(t, c)), f === void 0 && h && s && (f = g.measureText(s).width, r.set(s, f)), h && u === void 0 && (u = g.measureText(a).width, r.set(a, u), d = u - f);
    }
    return {
      width: c * l,
      kernedWidth: d * l
    };
  }
  /**
   * Computes height of character at given position
   * @param {Number} line the line index number
   * @param {Number} _char the character index number
   * @return {Number} fontSize of the character
   */
  getHeightOfChar(t, e) {
    return this.getValueOfPropertyAt(t, e, "fontSize");
  }
  /**
   * measure a text line measuring all characters.
   * @param {Number} lineIndex line number
   */
  measureLine(t) {
    const e = this._measureLine(t);
    return this.charSpacing !== 0 && (e.width -= this._getWidthOfCharSpacing()), e.width < 0 && (e.width = 0), e;
  }
  /**
   * measure every grapheme of a line, populating __charBounds
   * @param {Number} lineIndex
   * @return {Object} object.width total width of characters
   * @return {Object} object.numOfSpaces length of chars that match this._reSpacesAndTabs
   */
  _measureLine(t) {
    let e = 0, s, i;
    const r = this.pathSide === Y, o = this.path, a = this._textLines[t], h = a.length, l = new Array(h);
    this.__charBounds[t] = l;
    for (let c = 0; c < h; c++) {
      const u = a[c];
      i = this._getGraphemeBox(u, t, c, s), l[c] = i, e += i.kernedWidth, s = u;
    }
    if (l[h] = {
      left: i ? i.left + i.width : 0,
      width: 0,
      kernedWidth: 0,
      height: this.fontSize,
      deltaY: 0
    }, o && o.segmentsInfo) {
      let c = 0;
      const u = o.segmentsInfo[o.segmentsInfo.length - 1].length;
      switch (this.textAlign) {
        case P:
          c = r ? u - e : 0;
          break;
        case T:
          c = (u - e) / 2;
          break;
        case Y:
          c = r ? 0 : u - e;
          break;
      }
      c += this.pathStartOffset * (r ? -1 : 1);
      for (let f = r ? h - 1 : 0; r ? f >= 0 : f < h; r ? f-- : f++)
        i = l[f], c > u ? c %= u : c < 0 && (c += u), this._setGraphemeOnPath(c, i), c += i.kernedWidth;
    }
    return { width: e, numOfSpaces: 0 };
  }
  /**
   * Calculate the angle  and the left,top position of the char that follow a path.
   * It appends it to graphemeInfo to be reused later at rendering
   * @private
   * @param {Number} positionInPath to be measured
   * @param {GraphemeBBox} graphemeInfo current grapheme box information
   * @param {Object} startingPoint position of the point
   */
  _setGraphemeOnPath(t, e) {
    const s = t + e.kernedWidth / 2, i = this.path, r = Mn(i.path, s, i.segmentsInfo);
    e.renderLeft = r.x - i.pathOffset.x, e.renderTop = r.y - i.pathOffset.y, e.angle = r.angle + (this.pathSide === Y ? Math.PI : 0);
  }
  /**
   *
   * @param {String} grapheme to be measured
   * @param {Number} lineIndex index of the line where the char is
   * @param {Number} charIndex position in the line
   * @param {String} [prevGrapheme] character preceding the one to be measured
   * @returns {GraphemeBBox} grapheme bbox
   */
  _getGraphemeBox(t, e, s, i, r) {
    const o = this.getCompleteStyleDeclaration(e, s), a = i ? this.getCompleteStyleDeclaration(e, s - 1) : {}, h = this._measureChar(t, o, i, a);
    let l = h.kernedWidth, c = h.width, u;
    this.charSpacing !== 0 && (u = this._getWidthOfCharSpacing(), c += u, l += u);
    const f = {
      width: c,
      left: 0,
      height: o.fontSize,
      kernedWidth: l,
      deltaY: o.deltaY
    };
    if (s > 0 && !r) {
      const d = this.__charBounds[e][s - 1];
      f.left = d.left + d.width + h.kernedWidth - h.width;
    }
    return f;
  }
  /**
   * Calculate height of line at 'lineIndex',
   * without the lineHeigth multiplication factor
   * @private
   * @param {Number} lineIndex index of line to calculate
   * @return {Number}
   */
  getHeightOfLineImpl(t) {
    const e = this.__lineHeights;
    if (e[t])
      return e[t];
    let s = this.getHeightOfChar(t, 0);
    for (let i = 1, r = this._textLines[t].length; i < r; i++)
      s = Math.max(this.getHeightOfChar(t, i), s);
    return e[t] = s * this._fontSizeMult;
  }
  /**
   * Calculate height of line at 'lineIndex'
   * @param {Number} lineIndex index of line to calculate
   * @return {Number}
   */
  getHeightOfLine(t) {
    return this.getHeightOfLineImpl(t) * this.lineHeight;
  }
  /**
   * Calculate text box height
   */
  calcTextHeight() {
    let t = 0;
    for (let e = 0, s = this._textLines.length; e < s; e++)
      t += e === s - 1 ? this.getHeightOfLineImpl(e) : this.getHeightOfLine(e);
    return t;
  }
  /**
   * @private
   * @return {Number} Left offset
   */
  _getLeftOffset() {
    return this.direction === "ltr" ? -this.width / 2 : this.width / 2;
  }
  /**
   * @private
   * @return {Number} Top offset
   */
  _getTopOffset() {
    return -this.height / 2;
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {String} method Method name ("fillText" or "strokeText")
   */
  _renderTextCommon(t, e) {
    t.save();
    let s = 0;
    const i = this._getLeftOffset(), r = this._getTopOffset();
    for (let o = 0, a = this._textLines.length; o < a; o++)
      this._renderTextLine(
        e,
        t,
        this._textLines[o],
        i + this._getLineLeftOffset(o),
        r + s + this.getHeightOfLineImpl(o),
        o
      ), s += this.getHeightOfLine(o);
    t.restore();
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextFill(t) {
    !this.fill && !this.styleHas(X) || this._renderTextCommon(t, "fillText");
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextStroke(t) {
    (!this.stroke || this.strokeWidth === 0) && this.isEmptyStyles() || (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this._setLineDash(t, this.strokeDashArray), t.beginPath(), this._renderTextCommon(t, "strokeText"), t.closePath(), t.restore());
  }
  /**
   * @private
   * @param {String} method fillText or strokeText.
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Array} line Content of the line, splitted in an array by grapheme
   * @param {Number} left
   * @param {Number} top
   * @param {Number} lineIndex
   */
  _renderChars(t, e, s, i, r, o) {
    const a = this.textAlign.includes(St), h = this.path, l = !a && this.charSpacing === 0 && this.isEmptyStyles(o) && !h, c = this.direction === "ltr", u = this.direction === "ltr" ? 1 : -1, f = e.direction;
    let d, g, p = "", _, y = 0, v, S;
    if (e.save(), f !== this.direction && (e.canvas.setAttribute("dir", c ? "ltr" : "rtl"), e.direction = c ? "ltr" : "rtl", e.textAlign = c ? P : Y), r -= this.getHeightOfLineImpl(o) * this._fontSizeFraction, l) {
      this._renderChar(t, e, o, 0, s.join(""), i, r), e.restore();
      return;
    }
    for (let C = 0, w = s.length - 1; C <= w; C++)
      v = C === w || this.charSpacing || h, p += s[C], _ = this.__charBounds[o][C], y === 0 ? (i += u * (_.kernedWidth - _.width), y += _.width) : y += _.kernedWidth, a && !v && this._reSpaceAndTab.test(s[C]) && (v = !0), v || (d = d || this.getCompleteStyleDeclaration(o, C), g = this.getCompleteStyleDeclaration(o, C + 1), v = Ss(d, g, !1)), v && (h ? (e.save(), e.translate(_.renderLeft, _.renderTop), e.rotate(_.angle), this._renderChar(
        t,
        e,
        o,
        C,
        p,
        -y / 2,
        0
      ), e.restore()) : (S = i, this._renderChar(
        t,
        e,
        o,
        C,
        p,
        S,
        r
      )), p = "", d = g, i += u * y, y = 0);
    e.restore();
  }
  /**
   * This function try to patch the missing gradientTransform on canvas gradients.
   * transforming a context to transform the gradient, is going to transform the stroke too.
   * we want to transform the gradient but not the stroke operation, so we create
   * a transformed gradient on a pattern and then we use the pattern instead of the gradient.
   * this method has drawbacks: is slow, is in low resolution, needs a patch for when the size
   * is limited.
   * @private
   * @param {TFiller} filler a fabric gradient instance
   * @return {CanvasPattern} a pattern to use as fill/stroke style
   */
  _applyPatternGradientTransformText(t) {
    const e = this.width + this.strokeWidth, s = this.height + this.strokeWidth, i = rt({
      width: e,
      height: s
    }), r = i.getContext("2d");
    return i.width = e, i.height = s, r.beginPath(), r.moveTo(0, 0), r.lineTo(e, 0), r.lineTo(e, s), r.lineTo(0, s), r.closePath(), r.translate(e / 2, s / 2), r.fillStyle = t.toLive(r), this._applyPatternGradientTransform(r, t), r.fill(), r.createPattern(i, "no-repeat");
  }
  handleFiller(t, e, s) {
    let i, r;
    return ct(s) ? s.gradientUnits === "percentage" || s.gradientTransform || s.patternTransform ? (i = -this.width / 2, r = -this.height / 2, t.translate(i, r), t[e] = this._applyPatternGradientTransformText(s), { offsetX: i, offsetY: r }) : (t[e] = s.toLive(t), this._applyPatternGradientTransform(t, s)) : (t[e] = s, { offsetX: 0, offsetY: 0 });
  }
  /**
   * This function prepare the canvas for a stroke style, and stroke and strokeWidth
   * need to be sent in as defined
   * @param {CanvasRenderingContext2D} ctx
   * @param {CompleteTextStyleDeclaration} style with stroke and strokeWidth defined
   * @returns
   */
  _setStrokeStyles(t, {
    stroke: e,
    strokeWidth: s
  }) {
    return t.lineWidth = s, t.lineCap = this.strokeLineCap, t.lineDashOffset = this.strokeDashOffset, t.lineJoin = this.strokeLineJoin, t.miterLimit = this.strokeMiterLimit, this.handleFiller(t, "strokeStyle", e);
  }
  /**
   * This function prepare the canvas for a ill style, and fill
   * need to be sent in as defined
   * @param {CanvasRenderingContext2D} ctx
   * @param {CompleteTextStyleDeclaration} style with ill defined
   * @returns
   */
  _setFillStyles(t, { fill: e }) {
    return this.handleFiller(t, "fillStyle", e);
  }
  /**
   * @private
   * @param {String} method
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @param {String} _char
   * @param {Number} left Left coordinate
   * @param {Number} top Top coordinate
   * @param {Number} lineHeight Height of the line
   */
  _renderChar(t, e, s, i, r, o, a) {
    const h = this._getStyleDeclaration(s, i), l = this.getCompleteStyleDeclaration(s, i), c = t === "fillText" && l.fill, u = t === "strokeText" && l.stroke && l.strokeWidth;
    if (!(!u && !c)) {
      if (e.save(), e.font = this._getFontDeclaration(l), h.textBackgroundColor && this._removeShadow(e), h.deltaY && (a += h.deltaY), c) {
        const f = this._setFillStyles(e, l);
        e.fillText(
          r,
          o - f.offsetX,
          a - f.offsetY
        );
      }
      if (u) {
        const f = this._setStrokeStyles(e, l);
        e.strokeText(
          r,
          o - f.offsetX,
          a - f.offsetY
        );
      }
      e.restore();
    }
  }
  /**
   * Turns the character into a 'superior figure' (i.e. 'superscript')
   * @param {Number} start selection start
   * @param {Number} end selection end
   */
  setSuperscript(t, e) {
    this._setScript(t, e, this.superscript);
  }
  /**
   * Turns the character into an 'inferior figure' (i.e. 'subscript')
   * @param {Number} start selection start
   * @param {Number} end selection end
   */
  setSubscript(t, e) {
    this._setScript(t, e, this.subscript);
  }
  /**
   * Applies 'schema' at given position
   * @private
   * @param {Number} start selection start
   * @param {Number} end selection end
   * @param {Number} schema
   */
  _setScript(t, e, s) {
    const i = this.get2DCursorLocation(t, !0), r = this.getValueOfPropertyAt(
      i.lineIndex,
      i.charIndex,
      "fontSize"
    ), o = this.getValueOfPropertyAt(i.lineIndex, i.charIndex, "deltaY"), a = {
      fontSize: r * s.size,
      deltaY: o + r * s.baseline
    };
    this.setSelectionStyles(a, t, e);
  }
  /**
   * @private
   * @param {Number} lineIndex index text line
   * @return {Number} Line left offset
   */
  _getLineLeftOffset(t) {
    const e = this.getLineWidth(t), s = this.width - e, i = this.textAlign, r = this.direction, o = this.isEndOfWrapping(t);
    let a = 0;
    return i === St || i === xe && !o || i === we && !o || i === Ke && !o ? 0 : (i === T && (a = s / 2), i === Y && (a = s), i === xe && (a = s / 2), i === we && (a = s), r === "rtl" && (i === Y || i === St || i === we ? a = 0 : i === P || i === Ke ? a = -s : (i === T || i === xe) && (a = -s / 2)), a);
  }
  /**
   * @private
   */
  _clearCache() {
    this._forceClearCache = !1, this.__lineWidths = [], this.__lineHeights = [], this.__charBounds = [];
  }
  /**
   * Measure a single line given its index. Used to calculate the initial
   * text bounding box. The values are calculated and stored in __lineWidths cache.
   * @private
   * @param {Number} lineIndex line number
   * @return {Number} Line width
   */
  getLineWidth(t) {
    if (this.__lineWidths[t] !== void 0)
      return this.__lineWidths[t];
    const { width: e } = this.measureLine(t);
    return this.__lineWidths[t] = e, e;
  }
  _getWidthOfCharSpacing() {
    return this.charSpacing !== 0 ? this.fontSize * this.charSpacing / 1e3 : 0;
  }
  /**
   * Retrieves the value of property at given character position
   * @param {Number} lineIndex the line number
   * @param {Number} charIndex the character number
   * @param {String} property the property name
   * @returns the value of 'property'
   */
  getValueOfPropertyAt(t, e, s) {
    return this._getStyleDeclaration(t, e)[s] ?? this[s];
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextDecoration(t, e) {
    if (!this[e] && !this.styleHas(e))
      return;
    let s = this._getTopOffset();
    const i = this._getLeftOffset(), r = this.path, o = this._getWidthOfCharSpacing(), a = e === "linethrough" ? 0.5 : e === "overline" ? 1 : 0, h = this.offsets[e];
    for (let l = 0, c = this._textLines.length; l < c; l++) {
      const u = this.getHeightOfLine(l);
      if (!this[e] && !this.styleHas(e, l)) {
        s += u;
        continue;
      }
      const f = this._textLines[l], d = u / this.lineHeight, g = this._getLineLeftOffset(l);
      let p = 0, _ = 0, y = this.getValueOfPropertyAt(l, 0, e), v = this.getValueOfPropertyAt(l, 0, X), S = this.getValueOfPropertyAt(
        l,
        0,
        Ht
      ), C = y, w = v, b = S;
      const D = s + d * (1 - this._fontSizeFraction);
      let O = this.getHeightOfChar(l, 0), A = this.getValueOfPropertyAt(l, 0, "deltaY");
      for (let R = 0, N = f.length; R < N; R++) {
        const k = this.__charBounds[l][R];
        C = this.getValueOfPropertyAt(l, R, e), w = this.getValueOfPropertyAt(l, R, X), b = this.getValueOfPropertyAt(
          l,
          R,
          Ht
        );
        const L = this.getHeightOfChar(l, R), tt = this.getValueOfPropertyAt(l, R, "deltaY");
        if (r && C && w) {
          const ft = this.fontSize * b / 1e3;
          t.save(), t.fillStyle = v, t.translate(k.renderLeft, k.renderTop), t.rotate(k.angle), t.fillRect(
            -k.kernedWidth / 2,
            h * L + tt - a * ft,
            k.kernedWidth,
            ft
          ), t.restore();
        } else if ((C !== y || w !== v || L !== O || b !== S || tt !== A) && _ > 0) {
          const ft = this.fontSize * S / 1e3;
          let et = i + g + p;
          this.direction === "rtl" && (et = this.width - et - _), y && v && S && (t.fillStyle = v, t.fillRect(
            et,
            D + h * O + A - a * ft,
            _,
            ft
          )), p = k.left, _ = k.width, y = C, S = b, v = w, O = L, A = tt;
        } else
          _ += k.kernedWidth;
      }
      let W = i + g + p;
      this.direction === "rtl" && (W = this.width - W - _), t.fillStyle = w;
      const Z = this.fontSize * b / 1e3;
      C && w && b && t.fillRect(
        W,
        D + h * O + A - a * Z,
        _ - o,
        Z
      ), s += u;
    }
    this._removeShadow(t);
  }
  /**
   * return font declaration string for canvas context
   * @param {Object} [styleObject] object
   * @returns {String} font declaration formatted for canvas context.
   */
  _getFontDeclaration({
    fontFamily: t = this.fontFamily,
    fontStyle: e = this.fontStyle,
    fontWeight: s = this.fontWeight,
    fontSize: i = this.fontSize
  } = {}, r) {
    const o = t.includes("'") || t.includes('"') || t.includes(",") || kt.genericFonts.includes(t.toLowerCase()) ? t : `"${t}"`;
    return [
      e,
      s,
      `${r ? this.CACHE_FONT_SIZE : i}px`,
      o
    ].join(" ");
  }
  /**
   * Renders text instance on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  render(t) {
    this.visible && (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen() || (this._forceClearCache && this.initDimensions(), super.render(t)));
  }
  /**
   * Override this method to customize grapheme splitting
   * @todo the util `graphemeSplit` needs to be injectable in some way.
   * is more comfortable to inject the correct util rather than having to override text
   * in the middle of the prototype chain
   * @param {string} value
   * @returns {string[]} array of graphemes
   */
  graphemeSplit(t) {
    return Cs(t);
  }
  /**
   * Returns the text as an array of lines.
   * @param {String} text text to split
   * @returns  Lines in the text
   */
  _splitTextIntoLines(t) {
    const e = t.split(this._reNewline), s = new Array(e.length), i = [`
`];
    let r = [];
    for (let o = 0; o < e.length; o++)
      s[o] = this.graphemeSplit(e[o]), r = r.concat(s[o], i);
    return r.pop(), {
      _unwrappedLines: s,
      lines: e,
      graphemeText: r,
      graphemeLines: s
    };
  }
  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject(t = []) {
    return {
      ...super.toObject([...Ui, ...t]),
      styles: mn(this.styles, this.text),
      ...this.path ? { path: this.path.toObject() } : {}
    };
  }
  set(t, e) {
    const { textLayoutProperties: s } = this.constructor;
    super.set(t, e);
    let i = !1, r = !1;
    if (typeof t == "object")
      for (const o in t)
        o === "path" && this.setPathInfo(), i = i || s.includes(o), r = r || o === "path";
    else
      i = s.includes(t), r = t === "path";
    return r && this.setPathInfo(), i && this.initialized && (this.initDimensions(), this.setCoords()), this;
  }
  /**
   * Returns complexity of an instance
   * @return {Number} complexity
   */
  complexity() {
    return 1;
  }
  /**
   * List of generic font families
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#generic-name
   */
  static genericFonts = [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui",
    "ui-serif",
    "ui-sans-serif",
    "ui-monospace",
    "ui-rounded",
    "math",
    "emoji",
    "fangsong"
  ];
  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link FabricText.fromElement})
   * @see: http://www.w3.org/TR/SVG/text.html#TextElement
   */
  static ATTRIBUTE_NAMES = Yt.concat(
    "x",
    "y",
    "dx",
    "dy",
    "font-family",
    "font-style",
    "font-weight",
    "font-size",
    "letter-spacing",
    "text-decoration",
    "text-anchor"
  );
  /**
   * Returns FabricText instance from an SVG element (<b>not yet implemented</b>)
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   */
  static async fromElement(t, e, s) {
    const i = Ft(
      t,
      kt.ATTRIBUTE_NAMES,
      s
    ), {
      textAnchor: r = P,
      textDecoration: o = "",
      dx: a = 0,
      dy: h = 0,
      top: l = 0,
      left: c = 0,
      fontSize: u = si,
      strokeWidth: f = 1,
      ...d
    } = { ...e, ...i }, g = qe(t.textContent || "").trim(), p = new this(g, {
      left: c + a,
      top: l + h,
      underline: o.includes("underline"),
      overline: o.includes("overline"),
      linethrough: o.includes("line-through"),
      // we initialize this as 0
      strokeWidth: 0,
      fontSize: u,
      ...d
    }), _ = p.getScaledHeight() / p.height, y = (p.height + p.strokeWidth) * p.lineHeight - p.height, v = y * _, S = p.getScaledHeight() + v;
    let C = 0;
    return r === T && (C = p.getScaledWidth() / 2), r === Y && (C = p.getScaledWidth()), p.set({
      left: p.left - C,
      top: p.top - (S - p.fontSize * (0.07 + p._fontSizeFraction)) / p.lineHeight,
      strokeWidth: f
    }), p;
  }
  /* _FROM_SVG_END_ */
  /**
   * Returns FabricText instance from an object representation
   * @param {Object} object plain js Object to create an instance from
   * @returns {Promise<FabricText>}
   */
  static fromObject(t) {
    return this._fromObject(
      {
        ...t,
        styles: _n(t.styles || {}, t.text)
      },
      {
        extraParam: "text"
      }
    );
  }
}
un(kt, [vl]);
x.setClass(kt);
x.setSVGClass(kt);
class Sl {
  target;
  __mouseDownInPlace = !1;
  __dragStartFired = !1;
  __isDraggingOver = !1;
  __dragStartSelection;
  __dragImageDisposer;
  _dispose;
  constructor(t) {
    this.target = t;
    const e = [
      this.target.on("dragenter", this.dragEnterHandler.bind(this)),
      this.target.on("dragover", this.dragOverHandler.bind(this)),
      this.target.on("dragleave", this.dragLeaveHandler.bind(this)),
      this.target.on("dragend", this.dragEndHandler.bind(this)),
      this.target.on("drop", this.dropHandler.bind(this))
    ];
    this._dispose = () => {
      e.forEach((s) => s()), this._dispose = void 0;
    };
  }
  isPointerOverSelection(t) {
    const e = this.target, s = e.getSelectionStartFromPointer(t);
    return e.isEditing && s >= e.selectionStart && s <= e.selectionEnd && e.selectionStart < e.selectionEnd;
  }
  /**
   * @public override this method to disable dragging and default to mousedown logic
   */
  start(t) {
    return this.__mouseDownInPlace = this.isPointerOverSelection(t);
  }
  /**
   * @public override this method to disable dragging without discarding selection
   */
  isActive() {
    return this.__mouseDownInPlace;
  }
  /**
   * Ends interaction and sets cursor in case of a click
   * @returns true if was active
   */
  end(t) {
    const e = this.isActive();
    return e && !this.__dragStartFired && (this.target.setCursorByClick(t), this.target.initDelayedCursor(!0)), this.__mouseDownInPlace = !1, this.__dragStartFired = !1, this.__isDraggingOver = !1, e;
  }
  getDragStartSelection() {
    return this.__dragStartSelection;
  }
  /**
   * Override to customize the drag image
   * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setDragImage
   */
  setDragImage(t, {
    selectionStart: e,
    selectionEnd: s
  }) {
    const i = this.target, r = i.canvas, o = new m(i.flipX ? -1 : 1, i.flipY ? -1 : 1), a = i._getCursorBoundaries(e), l = new m(
      a.left + a.leftOffset,
      a.top + a.topOffset
    ).multiply(o).transform(i.calcTransformMatrix()), u = r.getScenePoint(t).subtract(l), f = i.getCanvasRetinaScaling(), d = i.getBoundingRect(), g = l.subtract(new m(d.left, d.top)), p = r.viewportTransform, _ = g.add(u).transform(p, !0), y = i.backgroundColor, v = Oi(i.styles);
    i.backgroundColor = "";
    const S = {
      stroke: "transparent",
      fill: "transparent",
      textBackgroundColor: "transparent"
    };
    i.setSelectionStyles(S, 0, e), i.setSelectionStyles(S, s, i.text.length), i.dirty = !0;
    const C = i.toCanvasElement({
      enableRetinaScaling: r.enableRetinaScaling,
      viewportTransform: !0
    });
    i.backgroundColor = y, i.styles = v, i.dirty = !0, Js(C, {
      position: "fixed",
      left: `${-C.width}px`,
      border: K,
      width: `${C.width / f}px`,
      height: `${C.height / f}px`
    }), this.__dragImageDisposer && this.__dragImageDisposer(), this.__dragImageDisposer = () => {
      C.remove();
    }, gt(
      t.target || this.target.hiddenTextarea
    ).body.appendChild(C), t.dataTransfer?.setDragImage(C, _.x, _.y);
  }
  /**
   * @returns {boolean} determines whether {@link target} should/shouldn't become a drag source
   */
  onDragStart(t) {
    this.__dragStartFired = !0;
    const e = this.target, s = this.isActive();
    if (s && t.dataTransfer) {
      const i = this.__dragStartSelection = {
        selectionStart: e.selectionStart,
        selectionEnd: e.selectionEnd
      }, r = e._text.slice(i.selectionStart, i.selectionEnd).join(""), o = { text: e.text, value: r, ...i };
      t.dataTransfer.setData("text/plain", r), t.dataTransfer.setData(
        "application/fabric",
        JSON.stringify({
          value: r,
          styles: e.getSelectionStyles(
            i.selectionStart,
            i.selectionEnd,
            !0
          )
        })
      ), t.dataTransfer.effectAllowed = "copyMove", this.setDragImage(t, o);
    }
    return e.abortCursorAnimation(), s;
  }
  /**
   * use {@link targetCanDrop} to respect overriding
   * @returns {boolean} determines whether {@link target} should/shouldn't become a drop target
   */
  canDrop(t) {
    if (this.target.editable && !this.target.getActiveControl() && !t.defaultPrevented) {
      if (this.isActive() && this.__dragStartSelection) {
        const e = this.target.getSelectionStartFromPointer(t), s = this.__dragStartSelection;
        return e < s.selectionStart || e > s.selectionEnd;
      }
      return !0;
    }
    return !1;
  }
  /**
   * in order to respect overriding {@link IText#canDrop} we call that instead of calling {@link canDrop} directly
   */
  targetCanDrop(t) {
    return this.target.canDrop(t);
  }
  dragEnterHandler({ e: t }) {
    const e = this.targetCanDrop(t);
    !this.__isDraggingOver && e && (this.__isDraggingOver = !0);
  }
  dragOverHandler(t) {
    const { e } = t, s = this.targetCanDrop(e);
    !this.__isDraggingOver && s ? this.__isDraggingOver = !0 : this.__isDraggingOver && !s && (this.__isDraggingOver = !1), this.__isDraggingOver && (e.preventDefault(), t.canDrop = !0, t.dropTarget = this.target);
  }
  dragLeaveHandler() {
    (this.__isDraggingOver || this.isActive()) && (this.__isDraggingOver = !1);
  }
  /**
   * Override the `text/plain | application/fabric` types of {@link DragEvent#dataTransfer}
   * in order to change the drop value or to customize styling respectively, by listening to the `drop:before` event
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#performing_a_drop
   */
  dropHandler(t) {
    const { e } = t, s = e.defaultPrevented;
    this.__isDraggingOver = !1, e.preventDefault();
    let i = e.dataTransfer?.getData("text/plain");
    if (i && !s) {
      const r = this.target, o = r.canvas;
      let a = r.getSelectionStartFromPointer(e);
      const { styles: h } = e.dataTransfer.types.includes("application/fabric") ? JSON.parse(e.dataTransfer.getData("application/fabric")) : {}, l = i[Math.max(0, i.length - 1)], c = 0;
      if (this.__dragStartSelection) {
        const u = this.__dragStartSelection.selectionStart, f = this.__dragStartSelection.selectionEnd;
        a > u && a <= f ? a = u : a > f && (a -= f - u), r.removeChars(u, f), delete this.__dragStartSelection;
      }
      r._reNewline.test(l) && (r._reNewline.test(r._text[a]) || a === r._text.length) && (i = i.trimEnd()), t.didDrop = !0, t.dropTarget = r, r.insertChars(i, h, a), o.setActiveObject(r), r.enterEditing(e), r.selectionStart = Math.min(
        a + c,
        r._text.length
      ), r.selectionEnd = Math.min(
        r.selectionStart + i.length,
        r._text.length
      ), r.hiddenTextarea.value = r.text, r._updateTextarea(), r.hiddenTextarea.focus(), r.fire($e, {
        index: a + c,
        action: "drop"
      }), o.fire("text:changed", { target: r }), o.contextTopDirty = !0, o.requestRenderAll();
    }
  }
  /**
   * fired only on the drag source after drop (if occurred)
   * handle changes to the drag source in case of a drop on another object or a cancellation
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
   */
  dragEndHandler({ e: t }) {
    if (this.isActive() && this.__dragStartFired && this.__dragStartSelection) {
      const e = this.target, s = this.target.canvas, { selectionStart: i, selectionEnd: r } = this.__dragStartSelection, o = t.dataTransfer?.dropEffect || K;
      o === K ? (e.selectionStart = i, e.selectionEnd = r, e._updateTextarea(), e.hiddenTextarea.focus()) : (e.clearContextTop(), o === "move" && (e.removeChars(i, r), e.selectionStart = e.selectionEnd = i, e.hiddenTextarea && (e.hiddenTextarea.value = e.text), e._updateTextarea(), e.fire($e, {
        index: i,
        action: "dragend"
      }), s.fire("text:changed", { target: e }), s.requestRenderAll()), e.exitEditing());
    }
    this.__dragImageDisposer && this.__dragImageDisposer(), delete this.__dragImageDisposer, delete this.__dragStartSelection, this.__isDraggingOver = !1;
  }
  dispose() {
    this._dispose && this._dispose();
  }
}
const hr = /[ \n\.,;!\?\-]/;
class wl extends kt {
  _currentCursorOpacity = 1;
  /**
   * Initializes all the interactive behavior of IText
   */
  initBehavior() {
    this._tick = this._tick.bind(this), this._onTickComplete = this._onTickComplete.bind(this), this.updateSelectionOnMouseMove = this.updateSelectionOnMouseMove.bind(this);
  }
  onDeselect(t) {
    return this.isEditing && this.exitEditing(), this.selected = !1, super.onDeselect(t);
  }
  /**
   * @private
   */
  _animateCursor({
    toValue: t,
    duration: e,
    delay: s,
    onComplete: i
  }) {
    return wi({
      startValue: this._currentCursorOpacity,
      endValue: t,
      duration: e,
      delay: s,
      onComplete: i,
      abort: () => !this.canvas || // we do not want to animate a selection, only cursor
      this.selectionStart !== this.selectionEnd,
      onChange: (r) => {
        this._currentCursorOpacity = r, this.renderCursorOrSelection();
      }
    });
  }
  /**
   * changes the cursor from visible to invisible
   */
  _tick(t) {
    this._currentTickState = this._animateCursor({
      toValue: 0,
      duration: this.cursorDuration / 2,
      delay: Math.max(t || 0, 100),
      onComplete: this._onTickComplete
    });
  }
  /**
   * Changes the cursor from invisible to visible
   */
  _onTickComplete() {
    this._currentTickCompleteState?.abort(), this._currentTickCompleteState = this._animateCursor({
      toValue: 1,
      duration: this.cursorDuration,
      onComplete: this._tick
    });
  }
  /**
   * Initializes delayed cursor
   */
  initDelayedCursor(t) {
    this.abortCursorAnimation(), this._tick(t ? 0 : this.cursorDelay);
  }
  /**
   * Aborts cursor animation, clears all timeouts and clear textarea context if necessary
   */
  abortCursorAnimation() {
    let t = !1;
    [this._currentTickState, this._currentTickCompleteState].forEach(
      (e) => {
        e && !e.isDone() && (t = !0, e.abort());
      }
    ), this._currentCursorOpacity = 1, t && this.clearContextTop();
  }
  /**
   * Restart tue cursor animation if either is in complete state ( between animations )
   * or if it never started before
   */
  restartCursorIfNeeded() {
    [this._currentTickState, this._currentTickCompleteState].some(
      (t) => !t || t.isDone()
    ) && this.initDelayedCursor();
  }
  /**
   * Selects entire text
   */
  selectAll() {
    return this.selectionStart = 0, this.selectionEnd = this._text.length, this._fireSelectionChanged(), this._updateTextarea(), this;
  }
  /**
   * Selects entire text and updates the visual state
   */
  cmdAll() {
    this.selectAll(), this.renderCursorOrSelection();
  }
  /**
   * Returns selected text
   * @return {String}
   */
  getSelectedText() {
    return this._text.slice(this.selectionStart, this.selectionEnd).join("");
  }
  /**
   * Find new selection index representing start of current word according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findWordBoundaryLeft(t) {
    let e = 0, s = t - 1;
    if (this._reSpace.test(this._text[s]))
      for (; this._reSpace.test(this._text[s]); )
        e++, s--;
    for (; /\S/.test(this._text[s]) && s > -1; )
      e++, s--;
    return t - e;
  }
  /**
   * Find new selection index representing end of current word according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findWordBoundaryRight(t) {
    let e = 0, s = t;
    if (this._reSpace.test(this._text[s]))
      for (; this._reSpace.test(this._text[s]); )
        e++, s++;
    for (; /\S/.test(this._text[s]) && s < this._text.length; )
      e++, s++;
    return t + e;
  }
  /**
   * Find new selection index representing start of current line according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findLineBoundaryLeft(t) {
    let e = 0, s = t - 1;
    for (; !/\n/.test(this._text[s]) && s > -1; )
      e++, s--;
    return t - e;
  }
  /**
   * Find new selection index representing end of current line according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findLineBoundaryRight(t) {
    let e = 0, s = t;
    for (; !/\n/.test(this._text[s]) && s < this._text.length; )
      e++, s++;
    return t + e;
  }
  /**
   * Finds index corresponding to beginning or end of a word
   * @param {Number} selectionStart Index of a character
   * @param {Number} direction 1 or -1
   * @return {Number} Index of the beginning or end of a word
   */
  searchWordBoundary(t, e) {
    const s = this._text;
    let i = t > 0 && this._reSpace.test(s[t]) && (e === -1 || !ii.test(s[t - 1])) ? t - 1 : t, r = s[i];
    for (; i > 0 && i < s.length && !hr.test(r); )
      i += e, r = s[i];
    return e === -1 && hr.test(r) && i++, i;
  }
  /**
   * Selects the word that contains the char at index selectionStart
   * @param {Number} selectionStart Index of a character
   */
  selectWord(t) {
    t = t ?? this.selectionStart;
    const e = this.searchWordBoundary(t, -1), s = Math.max(
      e,
      this.searchWordBoundary(t, 1)
    );
    this.selectionStart = e, this.selectionEnd = s, this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection();
  }
  /**
   * Selects the line that contains selectionStart
   * @param {Number} selectionStart Index of a character
   */
  selectLine(t) {
    t = t ?? this.selectionStart;
    const e = this.findLineBoundaryLeft(t), s = this.findLineBoundaryRight(t);
    this.selectionStart = e, this.selectionEnd = s, this._fireSelectionChanged(), this._updateTextarea();
  }
  /**
   * Enters editing state
   */
  enterEditing(t) {
    this.isEditing || !this.editable || (this.enterEditingImpl(), this.fire("editing:entered", t ? { e: t } : void 0), this._fireSelectionChanged(), this.canvas && (this.canvas.fire("text:editing:entered", {
      target: this,
      e: t
    }), this.canvas.requestRenderAll()));
  }
  /**
   * runs the actual logic that enter from editing state, see {@link enterEditing}
   */
  enterEditingImpl() {
    this.canvas && (this.canvas.calcOffset(), this.canvas.textEditingManager.exitTextEditing()), this.isEditing = !0, this.initHiddenTextarea(), this.hiddenTextarea.focus(), this.hiddenTextarea.value = this.text, this._updateTextarea(), this._saveEditingProps(), this._setEditingProps(), this._textBeforeEdit = this.text, this._tick();
  }
  /**
   * called by {@link Canvas#textEditingManager}
   */
  updateSelectionOnMouseMove(t) {
    if (this.getActiveControl())
      return;
    const e = this.hiddenTextarea;
    gt(e).activeElement !== e && e.focus();
    const s = this.getSelectionStartFromPointer(t), i = this.selectionStart, r = this.selectionEnd;
    (s !== this.__selectionStartOnMouseDown || i === r) && (i === s || r === s) || (s > this.__selectionStartOnMouseDown ? (this.selectionStart = this.__selectionStartOnMouseDown, this.selectionEnd = s) : (this.selectionStart = s, this.selectionEnd = this.__selectionStartOnMouseDown), (this.selectionStart !== i || this.selectionEnd !== r) && (this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()));
  }
  /**
   * @private
   */
  _setEditingProps() {
    this.hoverCursor = "text", this.canvas && (this.canvas.defaultCursor = this.canvas.moveCursor = "text"), this.borderColor = this.editingBorderColor, this.hasControls = this.selectable = !1, this.lockMovementX = this.lockMovementY = !0;
  }
  /**
   * convert from textarea to grapheme indexes
   */
  fromStringToGraphemeSelection(t, e, s) {
    const i = s.slice(0, t), r = this.graphemeSplit(i).length;
    if (t === e)
      return { selectionStart: r, selectionEnd: r };
    const o = s.slice(t, e), a = this.graphemeSplit(o).length;
    return {
      selectionStart: r,
      selectionEnd: r + a
    };
  }
  /**
   * convert from fabric to textarea values
   */
  fromGraphemeToStringSelection(t, e, s) {
    const i = s.slice(0, t), r = i.join("").length;
    if (t === e)
      return { selectionStart: r, selectionEnd: r };
    const o = s.slice(t, e), a = o.join("").length;
    return {
      selectionStart: r,
      selectionEnd: r + a
    };
  }
  /**
   * @private
   */
  _updateTextarea() {
    if (this.cursorOffsetCache = {}, !!this.hiddenTextarea) {
      if (!this.inCompositionMode) {
        const t = this.fromGraphemeToStringSelection(
          this.selectionStart,
          this.selectionEnd,
          this._text
        );
        this.hiddenTextarea.selectionStart = t.selectionStart, this.hiddenTextarea.selectionEnd = t.selectionEnd;
      }
      this.updateTextareaPosition();
    }
  }
  /**
   * @private
   */
  updateFromTextArea() {
    if (!this.hiddenTextarea)
      return;
    this.cursorOffsetCache = {};
    const t = this.hiddenTextarea;
    this.text = t.value, this.set("dirty", !0), this.initDimensions(), this.setCoords();
    const e = this.fromStringToGraphemeSelection(
      t.selectionStart,
      t.selectionEnd,
      t.value
    );
    this.selectionEnd = this.selectionStart = e.selectionEnd, this.inCompositionMode || (this.selectionStart = e.selectionStart), this.updateTextareaPosition();
  }
  /**
   * @private
   */
  updateTextareaPosition() {
    if (this.selectionStart === this.selectionEnd) {
      const t = this._calcTextareaPosition();
      this.hiddenTextarea.style.left = t.left, this.hiddenTextarea.style.top = t.top;
    }
  }
  /**
   * @private
   * @return {Object} style contains style for hiddenTextarea
   */
  _calcTextareaPosition() {
    if (!this.canvas)
      return { left: "1px", top: "1px" };
    const t = this.inCompositionMode ? this.compositionStart : this.selectionStart, e = this._getCursorBoundaries(t), s = this.get2DCursorLocation(t), i = s.lineIndex, r = s.charIndex, o = this.getValueOfPropertyAt(i, r, "fontSize") * this.lineHeight, a = e.leftOffset, h = this.getCanvasRetinaScaling(), l = this.canvas.upperCanvasEl, c = l.width / h, u = l.height / h, f = c - o, d = u - o, g = new m(
      e.left + a,
      e.top + e.topOffset + o
    ).transform(this.calcTransformMatrix()).transform(this.canvas.viewportTransform).multiply(
      new m(
        l.clientWidth / c,
        l.clientHeight / u
      )
    );
    return g.x < 0 && (g.x = 0), g.x > f && (g.x = f), g.y < 0 && (g.y = 0), g.y > d && (g.y = d), g.x += this.canvas._offset.left, g.y += this.canvas._offset.top, {
      left: `${g.x}px`,
      top: `${g.y}px`,
      fontSize: `${o}px`,
      charHeight: o
    };
  }
  /**
   * @private
   */
  _saveEditingProps() {
    this._savedProps = {
      hasControls: this.hasControls,
      borderColor: this.borderColor,
      lockMovementX: this.lockMovementX,
      lockMovementY: this.lockMovementY,
      hoverCursor: this.hoverCursor,
      selectable: this.selectable,
      defaultCursor: this.canvas && this.canvas.defaultCursor,
      moveCursor: this.canvas && this.canvas.moveCursor
    };
  }
  /**
   * @private
   */
  _restoreEditingProps() {
    this._savedProps && (this.hoverCursor = this._savedProps.hoverCursor, this.hasControls = this._savedProps.hasControls, this.borderColor = this._savedProps.borderColor, this.selectable = this._savedProps.selectable, this.lockMovementX = this._savedProps.lockMovementX, this.lockMovementY = this._savedProps.lockMovementY, this.canvas && (this.canvas.defaultCursor = this._savedProps.defaultCursor || this.canvas.defaultCursor, this.canvas.moveCursor = this._savedProps.moveCursor || this.canvas.moveCursor), delete this._savedProps);
  }
  /**
   * runs the actual logic that exits from editing state, see {@link exitEditing}
   * But it does not fire events
   */
  exitEditingImpl() {
    const t = this.hiddenTextarea;
    this.selected = !1, this.isEditing = !1, t && (t.blur && t.blur(), t.parentNode && t.parentNode.removeChild(t)), this.hiddenTextarea = null, this.abortCursorAnimation(), this.selectionStart !== this.selectionEnd && this.clearContextTop(), this.selectionEnd = this.selectionStart, this._restoreEditingProps(), this._forceClearCache && (this.initDimensions(), this.setCoords());
  }
  /**
   * Exits from editing state and fires relevant events
   */
  exitEditing() {
    const t = this._textBeforeEdit !== this.text;
    return this.exitEditingImpl(), this.fire("editing:exited"), t && this.fire(We), this.canvas && (this.canvas.fire("text:editing:exited", {
      target: this
    }), t && this.canvas.fire("object:modified", { target: this })), this;
  }
  /**
   * @private
   */
  _removeExtraneousStyles() {
    for (const t in this.styles)
      this._textLines[t] || delete this.styles[t];
  }
  /**
   * remove and reflow a style block from start to end.
   * @param {Number} start linear start position for removal (included in removal)
   * @param {Number} end linear end position for removal ( excluded from removal )
   */
  removeStyleFromTo(t, e) {
    const { lineIndex: s, charIndex: i } = this.get2DCursorLocation(t, !0), { lineIndex: r, charIndex: o } = this.get2DCursorLocation(
      e,
      !0
    );
    if (s !== r) {
      if (this.styles[s])
        for (let a = i; a < this._unwrappedTextLines[s].length; a++)
          delete this.styles[s][a];
      if (this.styles[r])
        for (let a = o; a < this._unwrappedTextLines[r].length; a++) {
          const h = this.styles[r][a];
          h && (this.styles[s] || (this.styles[s] = {}), this.styles[s][i + a - o] = h);
        }
      for (let a = s + 1; a <= r; a++)
        delete this.styles[a];
      this.shiftLineStyles(r, s - r);
    } else if (this.styles[s]) {
      const a = this.styles[s], h = o - i;
      for (let l = i; l < o; l++)
        delete a[l];
      for (const l in this.styles[s]) {
        const c = parseInt(l, 10);
        c >= o && (a[c - h] = a[l], delete a[l]);
      }
    }
  }
  /**
   * Shifts line styles up or down
   * @param {Number} lineIndex Index of a line
   * @param {Number} offset Can any number?
   */
  shiftLineStyles(t, e) {
    const s = Object.assign({}, this.styles);
    for (const i in this.styles) {
      const r = parseInt(i, 10);
      r > t && (this.styles[r + e] = s[r], s[r - e] || delete this.styles[r]);
    }
  }
  /**
   * Handle insertion of more consecutive style lines for when one or more
   * newlines gets added to the text. Since current style needs to be shifted
   * first we shift the current style of the number lines needed, then we add
   * new lines from the last to the first.
   * @param {Number} lineIndex Index of a line
   * @param {Number} charIndex Index of a char
   * @param {Number} qty number of lines to add
   * @param {Array} copiedStyle Array of objects styles
   */
  insertNewlineStyleObject(t, e, s, i) {
    const r = {}, o = this._unwrappedTextLines[t].length, a = o === e;
    let h = !1;
    s || (s = 1), this.shiftLineStyles(t, s);
    const l = this.styles[t] ? this.styles[t][e === 0 ? e : e - 1] : void 0;
    for (const u in this.styles[t]) {
      const f = parseInt(u, 10);
      f >= e && (h = !0, r[f - e] = this.styles[t][u], a && e === 0 || delete this.styles[t][u]);
    }
    let c = !1;
    for (h && !a && (this.styles[t + s] = r, c = !0), (c || o > e) && s--; s > 0; )
      i && i[s - 1] ? this.styles[t + s] = {
        0: { ...i[s - 1] }
      } : l ? this.styles[t + s] = {
        0: { ...l }
      } : delete this.styles[t + s], s--;
    this._forceClearCache = !0;
  }
  /**
   * Inserts style object for a given line/char index
   * @param {Number} lineIndex Index of a line
   * @param {Number} charIndex Index of a char
   * @param {Number} quantity number Style object to insert, if given
   * @param {Array} copiedStyle array of style objects
   */
  insertCharStyleObject(t, e, s, i) {
    this.styles || (this.styles = {});
    const r = this.styles[t], o = r ? { ...r } : {};
    s || (s = 1);
    for (const h in o) {
      const l = parseInt(h, 10);
      l >= e && (r[l + s] = o[l], o[l - s] || delete r[l]);
    }
    if (this._forceClearCache = !0, i) {
      for (; s--; )
        Object.keys(i[s]).length && (this.styles[t] || (this.styles[t] = {}), this.styles[t][e + s] = {
          ...i[s]
        });
      return;
    }
    if (!r)
      return;
    const a = r[e ? e - 1 : 1];
    for (; a && s--; )
      this.styles[t][e + s] = { ...a };
  }
  /**
   * Inserts style object(s)
   * @param {Array} insertedText Characters at the location where style is inserted
   * @param {Number} start cursor index for inserting style
   * @param {Array} [copiedStyle] array of style objects to insert.
   */
  insertNewStyleBlock(t, e, s) {
    const i = this.get2DCursorLocation(e, !0), r = [0];
    let o = 0;
    for (let h = 0; h < t.length; h++)
      t[h] === `
` ? (o++, r[o] = 0) : r[o]++;
    r[0] > 0 && (this.insertCharStyleObject(
      i.lineIndex,
      i.charIndex,
      r[0],
      s
    ), s = s && s.slice(r[0] + 1)), o && this.insertNewlineStyleObject(
      i.lineIndex,
      i.charIndex + r[0],
      o
    );
    let a;
    for (a = 1; a < o; a++)
      r[a] > 0 ? this.insertCharStyleObject(
        i.lineIndex + a,
        0,
        r[a],
        s
      ) : s && this.styles[i.lineIndex + a] && s[0] && (this.styles[i.lineIndex + a][0] = s[0]), s = s && s.slice(r[a] + 1);
    r[a] > 0 && this.insertCharStyleObject(
      i.lineIndex + a,
      0,
      r[a],
      s
    );
  }
  /**
   * Removes characters from start/end
   * start/end ar per grapheme position in _text array.
   *
   * @param {Number} start
   * @param {Number} end default to start + 1
   */
  removeChars(t, e = t + 1) {
    this.removeStyleFromTo(t, e), this._text.splice(t, e - t), this.text = this._text.join(""), this.set("dirty", !0), this.initDimensions(), this.setCoords(), this._removeExtraneousStyles();
  }
  /**
   * insert characters at start position, before start position.
   * start  equal 1 it means the text get inserted between actual grapheme 0 and 1
   * if style array is provided, it must be as the same length of text in graphemes
   * if end is provided and is bigger than start, old text is replaced.
   * start/end ar per grapheme position in _text array.
   *
   * @param {String} text text to insert
   * @param {Array} style array of style objects
   * @param {Number} start
   * @param {Number} end default to start + 1
   */
  insertChars(t, e, s, i = s) {
    i > s && this.removeStyleFromTo(s, i);
    const r = this.graphemeSplit(t);
    this.insertNewStyleBlock(r, s, e), this._text = [
      ...this._text.slice(0, s),
      ...r,
      ...this._text.slice(i)
    ], this.text = this._text.join(""), this.set("dirty", !0), this.initDimensions(), this.setCoords(), this._removeExtraneousStyles();
  }
  /**
   * Set the selectionStart and selectionEnd according to the new position of cursor
   * mimic the key - mouse navigation when shift is pressed.
   */
  setSelectionStartEndWithShift(t, e, s) {
    s <= t ? (e === t ? this._selectionDirection = P : this._selectionDirection === Y && (this._selectionDirection = P, this.selectionEnd = t), this.selectionStart = s) : s > t && s < e ? this._selectionDirection === Y ? this.selectionEnd = s : this.selectionStart = s : (e === t ? this._selectionDirection = Y : this._selectionDirection === P && (this._selectionDirection = Y, this.selectionStart = e), this.selectionEnd = s);
  }
}
class xl extends wl {
  /**
   * Initializes hidden textarea (needed to bring up keyboard in iOS)
   */
  initHiddenTextarea() {
    const t = this.canvas && gt(this.canvas.getElement()) || fe(), e = t.createElement("textarea");
    Object.entries({
      autocapitalize: "off",
      autocorrect: "off",
      autocomplete: "off",
      spellcheck: "false",
      "data-fabric": "textarea",
      wrap: "off",
      name: "fabricTextarea"
    }).map(([o, a]) => e.setAttribute(o, a));
    const { top: s, left: i, fontSize: r } = this._calcTextareaPosition();
    e.style.cssText = `position: absolute; top: ${s}; left: ${i}; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; padding-top: ${r};`, (this.hiddenTextareaContainer || t.body).appendChild(e), Object.entries({
      blur: "blur",
      keydown: "onKeyDown",
      keyup: "onKeyUp",
      input: "onInput",
      copy: "copy",
      cut: "copy",
      paste: "paste",
      compositionstart: "onCompositionStart",
      compositionupdate: "onCompositionUpdate",
      compositionend: "onCompositionEnd"
    }).map(
      ([o, a]) => e.addEventListener(
        o,
        this[a].bind(this)
      )
    ), this.hiddenTextarea = e;
  }
  /**
   * Override this method to customize cursor behavior on textbox blur
   */
  blur() {
    this.abortCursorAnimation();
  }
  /**
   * Handles keydown event
   * only used for arrows and combination of modifier keys.
   * @param {KeyboardEvent} e Event object
   */
  onKeyDown(t) {
    if (!this.isEditing)
      return;
    const e = this.direction === "rtl" ? this.keysMapRtl : this.keysMap;
    if (t.keyCode in e)
      this[e[t.keyCode]](
        t
      );
    else if (t.keyCode in this.ctrlKeysMapDown && (t.ctrlKey || t.metaKey))
      this[this.ctrlKeysMapDown[t.keyCode]](t);
    else
      return;
    t.stopImmediatePropagation(), t.preventDefault(), t.keyCode >= 33 && t.keyCode <= 40 ? (this.inCompositionMode = !1, this.clearContextTop(), this.renderCursorOrSelection()) : this.canvas && this.canvas.requestRenderAll();
  }
  /**
   * Handles keyup event
   * We handle KeyUp because ie11 and edge have difficulties copy/pasting
   * if a copy/cut event fired, keyup is dismissed
   * @param {KeyboardEvent} e Event object
   */
  onKeyUp(t) {
    if (!this.isEditing || this._copyDone || this.inCompositionMode) {
      this._copyDone = !1;
      return;
    }
    if (t.keyCode in this.ctrlKeysMapUp && (t.ctrlKey || t.metaKey))
      this[this.ctrlKeysMapUp[t.keyCode]](t);
    else
      return;
    t.stopImmediatePropagation(), t.preventDefault(), this.canvas && this.canvas.requestRenderAll();
  }
  /**
   * Handles onInput event
   * @param {Event} e Event object
   */
  onInput(t) {
    const e = this.fromPaste, { value: s, selectionStart: i, selectionEnd: r } = this.hiddenTextarea;
    if (this.fromPaste = !1, t && t.stopPropagation(), !this.isEditing)
      return;
    const o = () => {
      this.updateFromTextArea(), this.fire($e), this.canvas && (this.canvas.fire("text:changed", { target: this }), this.canvas.requestRenderAll());
    };
    if (this.hiddenTextarea.value === "") {
      this.styles = {}, o();
      return;
    }
    const a = this._splitTextIntoLines(s).graphemeText, h = this._text.length, l = a.length, c = this.selectionStart, u = this.selectionEnd, f = c !== u;
    let d, g, p = l - h, _, y;
    const v = this.fromStringToGraphemeSelection(
      i,
      r,
      s
    ), S = c > v.selectionStart;
    f ? (g = this._text.slice(c, u), p += u - c) : l < h && (S ? g = this._text.slice(u + p, u) : g = this._text.slice(
      c,
      c - p
    ));
    const C = a.slice(
      v.selectionEnd - p,
      v.selectionEnd
    );
    if (g && g.length && (C.length && (d = this.getSelectionStyles(
      c,
      c + 1,
      !1
    ), d = C.map(
      () => (
        // this return an array of references, but that is fine since we are
        // copying the style later.
        d[0]
      )
    )), f ? (_ = c, y = u) : S ? (_ = u - g.length, y = u) : (_ = u, y = u + g.length), this.removeStyleFromTo(_, y)), C.length) {
      const { copyPasteData: w } = bt();
      e && C.join("") === w.copiedText && !M.disableStyleCopyPaste && (d = w.copiedTextStyle), this.insertNewStyleBlock(C, c, d);
    }
    o();
  }
  /**
   * Composition start
   */
  onCompositionStart() {
    this.inCompositionMode = !0;
  }
  /**
   * Composition end
   */
  onCompositionEnd() {
    this.inCompositionMode = !1;
  }
  onCompositionUpdate({ target: t }) {
    const { selectionStart: e, selectionEnd: s } = t;
    this.compositionStart = e, this.compositionEnd = s, this.updateTextareaPosition();
  }
  /**
   * Copies selected text
   */
  copy() {
    if (this.selectionStart === this.selectionEnd)
      return;
    const { copyPasteData: t } = bt();
    t.copiedText = this.getSelectedText(), M.disableStyleCopyPaste ? t.copiedTextStyle = void 0 : t.copiedTextStyle = this.getSelectionStyles(
      this.selectionStart,
      this.selectionEnd,
      !0
    ), this._copyDone = !0;
  }
  /**
   * Pastes text
   */
  paste() {
    this.fromPaste = !0;
  }
  /**
   * Finds the width in pixels before the cursor on the same line
   * @private
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {Number} widthBeforeCursor width before cursor
   */
  _getWidthBeforeCursor(t, e) {
    let s = this._getLineLeftOffset(t), i;
    return e > 0 && (i = this.__charBounds[t][e - 1], s += i.left + i.width), s;
  }
  /**
   * Gets start offset of a selection
   * @param {KeyboardEvent} e Event object
   * @param {Boolean} isRight
   * @return {Number}
   */
  getDownCursorOffset(t, e) {
    const s = this._getSelectionForOffset(t, e), i = this.get2DCursorLocation(s), r = i.lineIndex;
    if (r === this._textLines.length - 1 || t.metaKey || t.keyCode === 34)
      return this._text.length - s;
    const o = i.charIndex, a = this._getWidthBeforeCursor(r, o), h = this._getIndexOnLine(r + 1, a);
    return this._textLines[r].slice(o).length + h + 1 + this.missingNewlineOffset(r);
  }
  /**
   * private
   * Helps finding if the offset should be counted from Start or End
   * @param {KeyboardEvent} e Event object
   * @param {Boolean} isRight
   * @return {Number}
   */
  _getSelectionForOffset(t, e) {
    return t.shiftKey && this.selectionStart !== this.selectionEnd && e ? this.selectionEnd : this.selectionStart;
  }
  /**
   * @param {KeyboardEvent} e Event object
   * @param {Boolean} isRight
   * @return {Number}
   */
  getUpCursorOffset(t, e) {
    const s = this._getSelectionForOffset(t, e), i = this.get2DCursorLocation(s), r = i.lineIndex;
    if (r === 0 || t.metaKey || t.keyCode === 33)
      return -s;
    const o = i.charIndex, a = this._getWidthBeforeCursor(r, o), h = this._getIndexOnLine(r - 1, a), l = this._textLines[r].slice(0, o), c = this.missingNewlineOffset(r - 1);
    return -this._textLines[r - 1].length + h - l.length + (1 - c);
  }
  /**
   * for a given width it founds the matching character.
   * @private
   */
  _getIndexOnLine(t, e) {
    const s = this._textLines[t];
    let r = this._getLineLeftOffset(t), o = 0, a, h;
    for (let l = 0, c = s.length; l < c; l++)
      if (a = this.__charBounds[t][l].width, r += a, r > e) {
        h = !0;
        const u = r - a, f = r, d = Math.abs(u - e);
        o = Math.abs(f - e) < d ? l : l - 1;
        break;
      }
    return h || (o = s.length - 1), o;
  }
  /**
   * Moves cursor down
   * @param {KeyboardEvent} e Event object
   */
  moveCursorDown(t) {
    this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length || this._moveCursorUpOrDown("Down", t);
  }
  /**
   * Moves cursor up
   * @param {KeyboardEvent} e Event object
   */
  moveCursorUp(t) {
    this.selectionStart === 0 && this.selectionEnd === 0 || this._moveCursorUpOrDown("Up", t);
  }
  /**
   * Moves cursor up or down, fires the events
   * @param {String} direction 'Up' or 'Down'
   * @param {KeyboardEvent} e Event object
   */
  _moveCursorUpOrDown(t, e) {
    const s = this[`get${t}CursorOffset`](
      e,
      this._selectionDirection === Y
    );
    if (e.shiftKey ? this.moveCursorWithShift(s) : this.moveCursorWithoutShift(s), s !== 0) {
      const i = this.text.length;
      this.selectionStart = zt(0, this.selectionStart, i), this.selectionEnd = zt(0, this.selectionEnd, i), this.abortCursorAnimation(), this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea();
    }
  }
  /**
   * Moves cursor with shift
   * @param {Number} offset
   */
  moveCursorWithShift(t) {
    const e = this._selectionDirection === P ? this.selectionStart + t : this.selectionEnd + t;
    return this.setSelectionStartEndWithShift(
      this.selectionStart,
      this.selectionEnd,
      e
    ), t !== 0;
  }
  /**
   * Moves cursor up without shift
   * @param {Number} offset
   */
  moveCursorWithoutShift(t) {
    return t < 0 ? (this.selectionStart += t, this.selectionEnd = this.selectionStart) : (this.selectionEnd += t, this.selectionStart = this.selectionEnd), t !== 0;
  }
  /**
   * Moves cursor left
   * @param {KeyboardEvent} e Event object
   */
  moveCursorLeft(t) {
    this.selectionStart === 0 && this.selectionEnd === 0 || this._moveCursorLeftOrRight("Left", t);
  }
  /**
   * @private
   * @return {Boolean} true if a change happened
   *
   * @todo refactor not to use method name composition
   */
  _move(t, e, s) {
    let i;
    if (t.altKey)
      i = this[`findWordBoundary${s}`](this[e]);
    else if (t.metaKey || t.keyCode === 35 || t.keyCode === 36)
      i = this[`findLineBoundary${s}`](this[e]);
    else
      return this[e] += s === "Left" ? -1 : 1, !0;
    return typeof i < "u" && this[e] !== i ? (this[e] = i, !0) : !1;
  }
  /**
   * @private
   */
  _moveLeft(t, e) {
    return this._move(t, e, "Left");
  }
  /**
   * @private
   */
  _moveRight(t, e) {
    return this._move(t, e, "Right");
  }
  /**
   * Moves cursor left without keeping selection
   * @param {KeyboardEvent} e
   */
  moveCursorLeftWithoutShift(t) {
    let e = !0;
    return this._selectionDirection = P, this.selectionEnd === this.selectionStart && this.selectionStart !== 0 && (e = this._moveLeft(t, "selectionStart")), this.selectionEnd = this.selectionStart, e;
  }
  /**
   * Moves cursor left while keeping selection
   * @param {KeyboardEvent} e
   */
  moveCursorLeftWithShift(t) {
    if (this._selectionDirection === Y && this.selectionStart !== this.selectionEnd)
      return this._moveLeft(t, "selectionEnd");
    if (this.selectionStart !== 0)
      return this._selectionDirection = P, this._moveLeft(t, "selectionStart");
  }
  /**
   * Moves cursor right
   * @param {KeyboardEvent} e Event object
   */
  moveCursorRight(t) {
    this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length || this._moveCursorLeftOrRight("Right", t);
  }
  /**
   * Moves cursor right or Left, fires event
   * @param {String} direction 'Left', 'Right'
   * @param {KeyboardEvent} e Event object
   */
  _moveCursorLeftOrRight(t, e) {
    const s = `moveCursor${t}${e.shiftKey ? "WithShift" : "WithoutShift"}`;
    this._currentCursorOpacity = 1, this[s](e) && (this.abortCursorAnimation(), this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea());
  }
  /**
   * Moves cursor right while keeping selection
   * @param {KeyboardEvent} e
   */
  moveCursorRightWithShift(t) {
    if (this._selectionDirection === P && this.selectionStart !== this.selectionEnd)
      return this._moveRight(t, "selectionStart");
    if (this.selectionEnd !== this._text.length)
      return this._selectionDirection = Y, this._moveRight(t, "selectionEnd");
  }
  /**
   * Moves cursor right without keeping selection
   * @param {KeyboardEvent} e Event object
   */
  moveCursorRightWithoutShift(t) {
    let e = !0;
    return this._selectionDirection = Y, this.selectionStart === this.selectionEnd ? (e = this._moveRight(t, "selectionStart"), this.selectionEnd = this.selectionStart) : this.selectionStart = this.selectionEnd, e;
  }
}
const lr = (n) => !!n.button;
class bl extends xl {
  draggableTextDelegate;
  initBehavior() {
    this.on("mousedown", this._mouseDownHandler), this.on("mouseup", this.mouseUpHandler), this.on("mousedblclick", this.doubleClickHandler), this.on("mousetripleclick", this.tripleClickHandler), this.draggableTextDelegate = new Sl(
      this
    ), super.initBehavior();
  }
  /**
   * If this method returns true a mouse move operation over a text selection
   * will not prevent the native mouse event allowing the browser to start a drag operation.
   * shouldStartDragging can be read 'do not prevent default for mouse move event'
   * To prevent drag and drop between objects both shouldStartDragging and onDragStart should return false
   * @returns
   */
  shouldStartDragging() {
    return this.draggableTextDelegate.isActive();
  }
  /**
   * @public override this method to control whether instance should/shouldn't become a drag source,
   * @see also {@link DraggableTextDelegate#isActive}
   * To prevent drag and drop between objects both shouldStartDragging and onDragStart should return false
   * @returns {boolean} should handle event
   */
  onDragStart(t) {
    return this.draggableTextDelegate.onDragStart(t);
  }
  /**
   * @public override this method to control whether instance should/shouldn't become a drop target
   */
  canDrop(t) {
    return this.draggableTextDelegate.canDrop(t);
  }
  /**
   * Default handler for double click, select a word
   */
  doubleClickHandler(t) {
    this.isEditing && (this.selectWord(this.getSelectionStartFromPointer(t.e)), this.renderCursorOrSelection());
  }
  /**
   * Default handler for triple click, select a line
   */
  tripleClickHandler(t) {
    this.isEditing && (this.selectLine(this.getSelectionStartFromPointer(t.e)), this.renderCursorOrSelection());
  }
  /**
   * Default event handler for the basic functionalities needed on _mouseDown
   * can be overridden to do something different.
   * Scope of this implementation is: find the click position, set selectionStart
   * find selectionEnd, initialize the drawing of either cursor or selection area
   * initializing a mousedDown on a text area will cancel fabricjs knowledge of
   * current compositionMode. It will be set to false.
   */
  _mouseDownHandler({ e: t, alreadySelected: e }) {
    !this.canvas || !this.editable || lr(t) || this.getActiveControl() || this.draggableTextDelegate.start(t) || (this.canvas.textEditingManager.register(this), e && (this.inCompositionMode = !1, this.setCursorByClick(t)), this.isEditing && (this.__selectionStartOnMouseDown = this.selectionStart, this.selectionStart === this.selectionEnd && this.abortCursorAnimation(), this.renderCursorOrSelection()), this.selected ||= e || this.isEditing);
  }
  /**
   * standard handler for mouse up, overridable
   * @private
   */
  mouseUpHandler({ e: t, transform: e }) {
    const s = this.draggableTextDelegate.end(t);
    if (this.canvas) {
      this.canvas.textEditingManager.unregister(this);
      const i = this.canvas._activeObject;
      if (i && i !== this)
        return;
    }
    !this.editable || this.group && !this.group.interactive || e && e.actionPerformed || lr(t) || s || this.selected && !this.getActiveControl() && (this.enterEditing(t), this.selectionStart === this.selectionEnd ? this.initDelayedCursor(!0) : this.renderCursorOrSelection());
  }
  /**
   * Changes cursor location in a text depending on passed pointer (x/y) object
   * @param {TPointerEvent} e Event object
   */
  setCursorByClick(t) {
    const e = this.getSelectionStartFromPointer(t), s = this.selectionStart, i = this.selectionEnd;
    t.shiftKey ? this.setSelectionStartEndWithShift(s, i, e) : (this.selectionStart = e, this.selectionEnd = e), this.isEditing && (this._fireSelectionChanged(), this._updateTextarea());
  }
  /**
   * Returns index of a character corresponding to where an object was clicked
   * @param {TPointerEvent} e Event object
   * @return {Number} Index of a character
   */
  getSelectionStartFromPointer(t) {
    const e = this.canvas.getScenePoint(t).transform(st(this.calcTransformMatrix())).add(new m(-this._getLeftOffset(), -this._getTopOffset()));
    let s = 0, i = 0, r = 0;
    for (let c = 0; c < this._textLines.length && s <= e.y; c++)
      s += this.getHeightOfLine(c), r = c, c > 0 && (i += this._textLines[c - 1].length + this.missingNewlineOffset(c - 1));
    let a = Math.abs(this._getLineLeftOffset(r));
    const h = this._textLines[r].length, l = this.__charBounds[r];
    for (let c = 0; c < h; c++) {
      const u = l[c].kernedWidth, f = a + u;
      if (e.x <= f) {
        Math.abs(e.x - f) <= Math.abs(e.x - a) && i++;
        break;
      }
      a = f, i++;
    }
    return Math.min(
      // if object is horizontally flipped, mirror cursor location from the end
      this.flipX ? h - i : i,
      this._text.length
    );
  }
}
const is = "moveCursorUp", rs = "moveCursorDown", ns = "moveCursorLeft", os = "moveCursorRight", as = "exitEditing", Tl = {
  9: as,
  27: as,
  33: is,
  34: rs,
  35: os,
  36: ns,
  37: ns,
  38: is,
  39: os,
  40: rs
}, Ol = {
  9: as,
  27: as,
  33: is,
  34: rs,
  35: ns,
  36: os,
  37: os,
  38: is,
  39: ns,
  40: rs
}, Dl = {
  67: "copy",
  // there was a reason this wasn't deleted. for now leave it here
  88: "cut"
}, kl = {
  65: "cmdAll"
}, cr = (n, t) => {
  const e = t.getRetinaScaling();
  n.setTransform(e, 0, 0, e, 0, 0);
  const s = t.viewportTransform;
  n.transform(s[0], s[1], s[2], s[3], s[4], s[5]);
}, Ml = {
  _selectionDirection: null,
  _reSpace: /\s|\r?\n/,
  inCompositionMode: !1
}, Pl = {
  selectionStart: 0,
  selectionEnd: 0,
  selectionColor: "rgba(17,119,255,0.3)",
  isEditing: !1,
  editable: !0,
  editingBorderColor: "rgba(102,153,255,0.25)",
  cursorWidth: 2,
  cursorColor: "",
  cursorDelay: 1e3,
  cursorDuration: 600,
  caching: !0,
  hiddenTextareaContainer: null,
  keysMap: Tl,
  keysMapRtl: Ol,
  ctrlKeysMapDown: kl,
  ctrlKeysMapUp: Dl,
  ...Ml
};
class Ut extends bl {
  static ownDefaults = Pl;
  static getDefaults() {
    return { ...super.getDefaults(), ...Ut.ownDefaults };
  }
  static type = "IText";
  get type() {
    const t = super.type;
    return t === "itext" ? "i-text" : t;
  }
  /**
   * Constructor
   * @param {String} text Text string
   * @param {Object} [options] Options object
   */
  constructor(t, e) {
    super(t, { ...Ut.ownDefaults, ...e }), this.initBehavior();
  }
  /**
   * While editing handle differently
   * @private
   * @param {string} key
   * @param {*} value
   */
  _set(t, e) {
    return this.isEditing && this._savedProps && t in this._savedProps ? (this._savedProps[t] = e, this) : (t === "canvas" && (this.canvas instanceof nr && this.canvas.textEditingManager.remove(this), e instanceof nr && e.textEditingManager.add(this)), super._set(t, e));
  }
  /**
   * Sets selection start (left boundary of a selection)
   * @param {Number} index Index to set selection start to
   */
  setSelectionStart(t) {
    t = Math.max(t, 0), this._updateAndFire("selectionStart", t);
  }
  /**
   * Sets selection end (right boundary of a selection)
   * @param {Number} index Index to set selection end to
   */
  setSelectionEnd(t) {
    t = Math.min(t, this.text.length), this._updateAndFire("selectionEnd", t);
  }
  /**
   * @private
   * @param {String} property 'selectionStart' or 'selectionEnd'
   * @param {Number} index new position of property
   */
  _updateAndFire(t, e) {
    this[t] !== e && (this._fireSelectionChanged(), this[t] = e), this._updateTextarea();
  }
  /**
   * Fires the even of selection changed
   * @private
   */
  _fireSelectionChanged() {
    this.fire("selection:changed"), this.canvas && this.canvas.fire("text:selection:changed", { target: this });
  }
  /**
   * Initialize text dimensions. Render all text on given context
   * or on a offscreen canvas to get the text width with measureText.
   * Updates this.width and this.height with the proper values.
   * Does not return dimensions.
   * @private
   */
  initDimensions() {
    this.isEditing && this.initDelayedCursor(), super.initDimensions();
  }
  /**
   * Gets style of a current selection/cursor (at the start position)
   * if startIndex or endIndex are not provided, selectionStart or selectionEnd will be used.
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} endIndex End index to get styles at, if not specified selectionEnd or startIndex + 1
   * @param {Boolean} [complete] get full style or not
   * @return {Array} styles an array with one, zero or more Style objects
   */
  getSelectionStyles(t = this.selectionStart || 0, e = this.selectionEnd, s) {
    return super.getSelectionStyles(t, e, s);
  }
  /**
   * Sets style of a current selection, if no selection exist, do not set anything.
   * @param {Object} [styles] Styles object
   * @param {Number} [startIndex] Start index to get styles at
   * @param {Number} [endIndex] End index to get styles at, if not specified selectionEnd or startIndex + 1
   */
  setSelectionStyles(t, e = this.selectionStart || 0, s = this.selectionEnd) {
    return super.setSelectionStyles(t, e, s);
  }
  /**
   * Returns 2d representation (lineIndex and charIndex) of cursor (or selection start)
   * @param {Number} [selectionStart] Optional index. When not given, current selectionStart is used.
   * @param {Boolean} [skipWrapping] consider the location for unwrapped lines. useful to manage styles.
   */
  get2DCursorLocation(t = this.selectionStart, e) {
    return super.get2DCursorLocation(t, e);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  render(t) {
    super.render(t), this.cursorOffsetCache = {}, this.renderCursorOrSelection();
  }
  /**
   * @override block cursor/selection logic while rendering the exported canvas
   * @todo this workaround should be replaced with a more robust solution
   */
  toCanvasElement(t) {
    const e = this.isEditing;
    this.isEditing = !1;
    const s = super.toCanvasElement(t);
    return this.isEditing = e, s;
  }
  /**
   * Renders cursor or selection (depending on what exists)
   * it does on the contextTop. If contextTop is not available, do nothing.
   */
  renderCursorOrSelection() {
    if (!this.isEditing || !this.canvas)
      return;
    const t = this.clearContextTop(!0);
    if (!t)
      return;
    const e = this._getCursorBoundaries(), s = this.findAncestorsWithClipPath(), i = s.length > 0;
    let r = t, o;
    if (i) {
      o = rt(t.canvas), r = o.getContext("2d"), cr(r, this.canvas);
      const a = this.calcTransformMatrix();
      r.transform(a[0], a[1], a[2], a[3], a[4], a[5]);
    }
    if (this.selectionStart === this.selectionEnd && !this.inCompositionMode ? this.renderCursor(r, e) : this.renderSelection(r, e), i)
      for (const a of s) {
        const h = a.clipPath, l = rt(t.canvas), c = l.getContext("2d");
        if (cr(c, this.canvas), !h.absolutePositioned) {
          const u = a.calcTransformMatrix();
          c.transform(u[0], u[1], u[2], u[3], u[4], u[5]);
        }
        h.transform(c), h.drawObject(c, !0, {}), this.drawClipPathOnCache(r, h, l);
      }
    i && (t.setTransform(1, 0, 0, 1, 0, 0), t.drawImage(o, 0, 0)), this.canvas.contextTopDirty = !0, t.restore();
  }
  /**
   * Finds and returns an array of clip paths that are applied to the parent
   * group(s) of the current FabricObject instance. The object's hierarchy is
   * traversed upwards (from the current object towards the root of the canvas),
   * checking each parent object for the presence of a `clipPath` that is not
   * absolutely positioned.
   */
  findAncestorsWithClipPath() {
    const t = [];
    let e = this;
    for (; e; )
      e.clipPath && t.push(e), e = e.parent;
    return t;
  }
  /**
   * Returns cursor boundaries (left, top, leftOffset, topOffset)
   * left/top are left/top of entire text box
   * leftOffset/topOffset are offset from that left/top point of a text box
   * @private
   * @param {number} [index] index from start
   * @param {boolean} [skipCaching]
   */
  _getCursorBoundaries(t = this.selectionStart, e) {
    const s = this._getLeftOffset(), i = this._getTopOffset(), r = this._getCursorBoundariesOffsets(t, e);
    return {
      left: s,
      top: i,
      leftOffset: r.left,
      topOffset: r.top
    };
  }
  /**
   * Caches and returns cursor left/top offset relative to instance's center point
   * @private
   * @param {number} index index from start
   * @param {boolean} [skipCaching]
   */
  _getCursorBoundariesOffsets(t, e) {
    return e ? this.__getCursorBoundariesOffsets(t) : this.cursorOffsetCache && "top" in this.cursorOffsetCache ? this.cursorOffsetCache : this.cursorOffsetCache = this.__getCursorBoundariesOffsets(t);
  }
  /**
   * Calculates cursor left/top offset relative to instance's center point
   * @private
   * @param {number} index index from start
   */
  __getCursorBoundariesOffsets(t) {
    let e = 0, s = 0;
    const { charIndex: i, lineIndex: r } = this.get2DCursorLocation(t);
    for (let l = 0; l < r; l++)
      e += this.getHeightOfLine(l);
    const o = this._getLineLeftOffset(r), a = this.__charBounds[r][i];
    a && (s = a.left), this.charSpacing !== 0 && i === this._textLines[r].length && (s -= this._getWidthOfCharSpacing());
    const h = {
      top: e,
      left: o + (s > 0 ? s : 0)
    };
    return this.direction === "rtl" && (this.textAlign === Y || this.textAlign === St || this.textAlign === we ? h.left *= -1 : (this.textAlign === P || this.textAlign === Ke || this.textAlign === T || this.textAlign === xe) && (h.left = o - (s > 0 ? s : 0))), h;
  }
  /**
   * Renders cursor on context Top, outside the animation cycle, on request
   * Used for the drag/drop effect.
   * If contextTop is not available, do nothing.
   */
  renderCursorAt(t) {
    this._renderCursor(
      this.canvas.contextTop,
      this._getCursorBoundaries(t, !0),
      t
    );
  }
  /**
   * Renders cursor
   * @param {Object} boundaries
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  renderCursor(t, e) {
    this._renderCursor(t, e, this.selectionStart);
  }
  /**
   * Return the data needed to render the cursor for given selection start
   * The left,top are relative to the object, while width and height are prescaled
   * to look think with canvas zoom and object scaling,
   * so they depend on canvas and object scaling
   */
  getCursorRenderingData(t = this.selectionStart, e = this._getCursorBoundaries(t)) {
    const s = this.get2DCursorLocation(t), i = s.lineIndex, r = s.charIndex > 0 ? s.charIndex - 1 : 0, o = this.getValueOfPropertyAt(i, r, "fontSize"), a = this.getObjectScaling().x * this.canvas.getZoom(), h = this.cursorWidth / a, l = this.getValueOfPropertyAt(i, r, "deltaY"), c = e.topOffset + (1 - this._fontSizeFraction) * this.getHeightOfLine(i) / this.lineHeight - o * (1 - this._fontSizeFraction);
    return {
      color: this.cursorColor || this.getValueOfPropertyAt(i, r, "fill"),
      opacity: this._currentCursorOpacity,
      left: e.left + e.leftOffset - h / 2,
      top: c + e.top + l,
      width: h,
      height: o
    };
  }
  /**
   * Render the cursor at the given selectionStart.
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  _renderCursor(t, e, s) {
    const { color: i, opacity: r, left: o, top: a, width: h, height: l } = this.getCursorRenderingData(s, e);
    t.fillStyle = i, t.globalAlpha = r, t.fillRect(o, a, h, l);
  }
  /**
   * Renders text selection
   * @param {Object} boundaries Object with left/top/leftOffset/topOffset
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  renderSelection(t, e) {
    const s = {
      selectionStart: this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart,
      selectionEnd: this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd
    };
    this._renderSelection(t, s, e);
  }
  /**
   * Renders drag start text selection
   */
  renderDragSourceEffect() {
    const t = this.draggableTextDelegate.getDragStartSelection();
    this._renderSelection(
      this.canvas.contextTop,
      t,
      this._getCursorBoundaries(t.selectionStart, !0)
    );
  }
  renderDropTargetEffect(t) {
    const e = this.getSelectionStartFromPointer(t);
    this.renderCursorAt(e);
  }
  /**
   * Renders text selection
   * @private
   * @param {{ selectionStart: number, selectionEnd: number }} selection
   * @param {Object} boundaries Object with left/top/leftOffset/topOffset
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  _renderSelection(t, e, s) {
    const i = e.selectionStart, r = e.selectionEnd, o = this.textAlign.includes(St), a = this.get2DCursorLocation(i), h = this.get2DCursorLocation(r), l = a.lineIndex, c = h.lineIndex, u = a.charIndex < 0 ? 0 : a.charIndex, f = h.charIndex < 0 ? 0 : h.charIndex;
    for (let d = l; d <= c; d++) {
      const g = this._getLineLeftOffset(d) || 0;
      let p = this.getHeightOfLine(d), _ = 0, y = 0, v = 0;
      if (d === l && (y = this.__charBounds[l][u].left), d >= l && d < c)
        v = o && !this.isEndOfWrapping(d) ? this.width : this.getLineWidth(d) || 5;
      else if (d === c)
        if (f === 0)
          v = this.__charBounds[c][f].left;
        else {
          const D = this._getWidthOfCharSpacing();
          v = this.__charBounds[c][f - 1].left + this.__charBounds[c][f - 1].width - D;
        }
      _ = p, (this.lineHeight < 1 || d === c && this.lineHeight > 1) && (p /= this.lineHeight);
      let S = s.left + g + y, C = p, w = 0;
      const b = v - y;
      this.inCompositionMode ? (t.fillStyle = this.compositionColor || "black", C = 1, w = p) : t.fillStyle = this.selectionColor, this.direction === "rtl" && (this.textAlign === Y || this.textAlign === St || this.textAlign === we ? S = this.width - S - b : (this.textAlign === P || this.textAlign === Ke || this.textAlign === T || this.textAlign === xe) && (S = s.left + g - v)), t.fillRect(
        S,
        s.top + s.topOffset + w,
        b,
        C
      ), s.topOffset += _;
    }
  }
  /**
   * High level function to know the height of the cursor.
   * the currentChar is the one that precedes the cursor
   * Returns fontSize of char at the current cursor
   * Unused from the library, is for the end user
   * @return {Number} Character font size
   */
  getCurrentCharFontSize() {
    const t = this._getCurrentCharIndex();
    return this.getValueOfPropertyAt(t.l, t.c, "fontSize");
  }
  /**
   * High level function to know the color of the cursor.
   * the currentChar is the one that precedes the cursor
   * Returns color (fill) of char at the current cursor
   * if the text object has a pattern or gradient for filler, it will return that.
   * Unused by the library, is for the end user
   * @return {String | TFiller} Character color (fill)
   */
  getCurrentCharColor() {
    const t = this._getCurrentCharIndex();
    return this.getValueOfPropertyAt(t.l, t.c, X);
  }
  /**
   * Returns the cursor position for the getCurrent.. functions
   * @private
   */
  _getCurrentCharIndex() {
    const t = this.get2DCursorLocation(this.selectionStart, !0), e = t.charIndex > 0 ? t.charIndex - 1 : 0;
    return { l: t.lineIndex, c: e };
  }
  dispose() {
    this.exitEditingImpl(), this.draggableTextDelegate.dispose(), super.dispose();
  }
}
x.setClass(Ut);
x.setClass(Ut, "i-text");
const El = {
  minWidth: 20,
  dynamicMinWidth: 2,
  lockScalingFlip: !0,
  noScaleCache: !1,
  _wordJoiners: /[ \t\r]/,
  splitByGrapheme: !1
};
class hs extends Ut {
  static type = "Textbox";
  static textLayoutProperties = [...Ut.textLayoutProperties, "width"];
  static ownDefaults = El;
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...hs.ownDefaults
    };
  }
  /**
   * Constructor
   * @param {String} text Text string
   * @param {Object} [options] Options object
   */
  constructor(t, e) {
    super(t, { ...hs.ownDefaults, ...e });
  }
  /**
   * Creates the default control object.
   * If you prefer to have on instance of controls shared among all objects
   * make this function return an empty object and add controls to the ownDefaults object
   */
  static createControls() {
    return { controls: cn() };
  }
  /**
   * Unlike superclass's version of this function, Textbox does not update
   * its width.
   * @private
   * @override
   */
  initDimensions() {
    this.initialized && (this.isEditing && this.initDelayedCursor(), this._clearCache(), this.dynamicMinWidth = 0, this._styleMap = this._generateStyleMap(this._splitText()), this.dynamicMinWidth > this.width && this._set("width", this.dynamicMinWidth), this.textAlign.includes(St) && this.enlargeSpaces(), this.height = this.calcTextHeight());
  }
  /**
   * Generate an object that translates the style object so that it is
   * broken up by visual lines (new lines and automatic wrapping).
   * The original text styles object is broken up by actual lines (new lines only),
   * which is only sufficient for Text / IText
   * @private
   */
  _generateStyleMap(t) {
    let e = 0, s = 0, i = 0;
    const r = {};
    for (let o = 0; o < t.graphemeLines.length; o++)
      t.graphemeText[i] === `
` && o > 0 ? (s = 0, i++, e++) : !this.splitByGrapheme && this._reSpaceAndTab.test(t.graphemeText[i]) && o > 0 && (s++, i++), r[o] = { line: e, offset: s }, i += t.graphemeLines[o].length, s += t.graphemeLines[o].length;
    return r;
  }
  /**
   * Returns true if object has a style property or has it on a specified line
   * @param {Number} lineIndex
   * @return {Boolean}
   */
  styleHas(t, e) {
    if (this._styleMap && !this.isWrapping) {
      const s = this._styleMap[e];
      s && (e = s.line);
    }
    return super.styleHas(t, e);
  }
  /**
   * Returns true if object has no styling or no styling in a line
   * @param {Number} lineIndex , lineIndex is on wrapped lines.
   * @return {Boolean}
   */
  isEmptyStyles(t) {
    if (!this.styles)
      return !0;
    let e = 0, s = t + 1, i, r = !1;
    const o = this._styleMap[t], a = this._styleMap[t + 1];
    o && (t = o.line, e = o.offset), a && (s = a.line, r = s === t, i = a.offset);
    const h = typeof t > "u" ? this.styles : { line: this.styles[t] };
    for (const l in h)
      for (const c in h[l]) {
        const u = parseInt(c, 10);
        if (u >= e && (!r || u < i))
          for (const f in h[l][c])
            return !1;
      }
    return !0;
  }
  /**
   * @protected
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {TextStyleDeclaration} a style object reference to the existing one or a new empty object when undefined
   */
  _getStyleDeclaration(t, e) {
    if (this._styleMap && !this.isWrapping) {
      const s = this._styleMap[t];
      if (!s)
        return {};
      t = s.line, e = s.offset + e;
    }
    return super._getStyleDeclaration(t, e);
  }
  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @param {Object} style
   * @private
   */
  _setStyleDeclaration(t, e, s) {
    const i = this._styleMap[t];
    super._setStyleDeclaration(i.line, i.offset + e, s);
  }
  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @private
   */
  _deleteStyleDeclaration(t, e) {
    const s = this._styleMap[t];
    super._deleteStyleDeclaration(s.line, s.offset + e);
  }
  /**
   * probably broken need a fix
   * Returns the real style line that correspond to the wrapped lineIndex line
   * Used just to verify if the line does exist or not.
   * @param {Number} lineIndex
   * @returns {Boolean} if the line exists or not
   * @private
   */
  _getLineStyle(t) {
    const e = this._styleMap[t];
    return !!this.styles[e.line];
  }
  /**
   * Set the line style to an empty object so that is initialized
   * @param {Number} lineIndex
   * @param {Object} style
   * @private
   */
  _setLineStyle(t) {
    const e = this._styleMap[t];
    super._setLineStyle(e.line);
  }
  /**
   * Wraps text using the 'width' property of Textbox. First this function
   * splits text on newlines, so we preserve newlines entered by the user.
   * Then it wraps each line using the width of the Textbox by calling
   * _wrapLine().
   * @param {Array} lines The string array of text that is split into lines
   * @param {Number} desiredWidth width you want to wrap to
   * @returns {Array} Array of lines
   */
  _wrapText(t, e) {
    this.isWrapping = !0;
    const s = this.getGraphemeDataForRender(t), i = [];
    for (let r = 0; r < s.wordsData.length; r++)
      i.push(...this._wrapLine(r, e, s));
    return this.isWrapping = !1, i;
  }
  /**
   * For each line of text terminated by an hard line stop,
   * measure each word width and extract the largest word from all.
   * The returned words here are the one that at the end will be rendered.
   * @param {string[]} lines the lines we need to measure
   *
   */
  getGraphemeDataForRender(t) {
    const e = this.splitByGrapheme, s = e ? "" : " ";
    let i = 0;
    return {
      wordsData: t.map((o, a) => {
        let h = 0;
        const l = e ? this.graphemeSplit(o) : this.wordSplit(o);
        return l.length === 0 ? [{ word: [], width: 0 }] : l.map((c) => {
          const u = e ? [c] : this.graphemeSplit(c), f = this._measureWord(u, a, h);
          return i = Math.max(f, i), h += u.length + s.length, { word: u, width: f };
        });
      }),
      largestWordWidth: i
    };
  }
  /**
   * Helper function to measure a string of text, given its lineIndex and charIndex offset
   * It gets called when charBounds are not available yet.
   * Override if necessary
   * Use with {@link Textbox#wordSplit}
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {String} text
   * @param {number} lineIndex
   * @param {number} charOffset
   * @returns {number}
   */
  _measureWord(t, e, s = 0) {
    let i = 0, r;
    const o = !0;
    for (let a = 0, h = t.length; a < h; a++) {
      const l = this._getGraphemeBox(
        t[a],
        e,
        a + s,
        r,
        o
      );
      i += l.kernedWidth, r = t[a];
    }
    return i;
  }
  /**
   * Override this method to customize word splitting
   * Use with {@link Textbox#_measureWord}
   * @param {string} value
   * @returns {string[]} array of words
   */
  wordSplit(t) {
    return t.split(this._wordJoiners);
  }
  /**
   * Wraps a line of text using the width of the Textbox as desiredWidth
   * and leveraging the known width o words from GraphemeData
   * @private
   * @param {Number} lineIndex
   * @param {Number} desiredWidth width you want to wrap the line to
   * @param {GraphemeData} graphemeData an object containing all the lines' words width.
   * @param {Number} reservedSpace space to remove from wrapping for custom functionalities
   * @returns {Array} Array of line(s) into which the given text is wrapped
   * to.
   */
  _wrapLine(t, e, { largestWordWidth: s, wordsData: i }, r = 0) {
    const o = this._getWidthOfCharSpacing(), a = this.splitByGrapheme, h = [], l = a ? "" : " ";
    let c = 0, u = [], f = 0, d = 0, g = !0;
    e -= r;
    const p = Math.max(
      e,
      s,
      this.dynamicMinWidth
    ), _ = i[t];
    f = 0;
    let y;
    for (y = 0; y < _.length; y++) {
      const { word: v, width: S } = _[y];
      f += v.length, c += d + S - o, c > p && !g ? (h.push(u), u = [], c = S, g = !0) : c += o, !g && !a && u.push(l), u = u.concat(v), d = a ? 0 : this._measureWord([l], t, f), f++, g = !1;
    }
    return y && h.push(u), s + r > this.dynamicMinWidth && (this.dynamicMinWidth = s - o + r), h;
  }
  /**
   * Detect if the text line is ended with an hard break
   * text and itext do not have wrapping, return false
   * @param {Number} lineIndex text to split
   * @return {Boolean}
   */
  isEndOfWrapping(t) {
    return !this._styleMap[t + 1] || this._styleMap[t + 1].line !== this._styleMap[t].line;
  }
  /**
   * Detect if a line has a linebreak and so we need to account for it when moving
   * and counting style.
   * This is important only for splitByGrapheme at the end of wrapping.
   * If we are not wrapping the offset is always 1
   * @return Number
   */
  missingNewlineOffset(t, e) {
    return this.splitByGrapheme && !e ? this.isEndOfWrapping(t) ? 1 : 0 : 1;
  }
  /**
   * Gets lines of text to render in the Textbox. This function calculates
   * text wrapping on the fly every time it is called.
   * @param {String} text text to split
   * @returns {Array} Array of lines in the Textbox.
   * @override
   */
  _splitTextIntoLines(t) {
    const e = super._splitTextIntoLines(t), s = this._wrapText(e.lines, this.width), i = new Array(s.length);
    for (let r = 0; r < s.length; r++)
      i[r] = s[r].join("");
    return e.lines = i, e.graphemeLines = s, e;
  }
  getMinWidth() {
    return Math.max(this.minWidth, this.dynamicMinWidth);
  }
  _removeExtraneousStyles() {
    const t = /* @__PURE__ */ new Map();
    for (const e in this._styleMap) {
      const s = parseInt(e, 10);
      if (this._textLines[s]) {
        const i = this._styleMap[e].line;
        t.set(`${i}`, !0);
      }
    }
    for (const e in this.styles)
      t.has(e) || delete this.styles[e];
  }
  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(t = []) {
    return super.toObject([
      "minWidth",
      "splitByGrapheme",
      ...t
    ]);
  }
}
x.setClass(hs);
class Al extends Mi {
  static type = "clip-path";
  shouldPerformLayout(t) {
    return !!t.target.clipPath && super.shouldPerformLayout(t);
  }
  shouldLayoutClipPath() {
    return !1;
  }
  calcLayoutResult(t, e) {
    const { target: s } = t, { clipPath: i, group: r } = s;
    if (!i || !this.shouldPerformLayout(t))
      return;
    const { width: o, height: a } = wt(
      vn(s, i)
    ), h = new m(o, a);
    if (i.absolutePositioned)
      return {
        center: Et(
          i.getRelativeCenterPoint(),
          void 0,
          r ? r.calcTransformMatrix() : void 0
        ),
        size: h
      };
    {
      const l = i.getRelativeCenterPoint().transform(s.calcOwnMatrix(), !0);
      if (this.shouldPerformLayout(t)) {
        const { center: c = new m(), correction: u = new m() } = this.calcBoundingBox(e, t) || {};
        return {
          center: c.add(l),
          correction: u.subtract(l),
          size: h
        };
      } else
        return {
          center: s.getRelativeCenterPoint().add(l),
          size: h
        };
    }
  }
}
x.setClass(Al);
class Fl extends Mi {
  static type = "fixed";
  /**
   * @override respect target's initial size
   */
  getInitialSize({ target: t }, { size: e }) {
    return new m(t.width || e.x, t.height || e.y);
  }
}
x.setClass(Fl);
class Ll extends De {
  subscribeTargets(t) {
    const e = t.target;
    t.targets.reduce((i, r) => (r.parent && i.add(r.parent), i), /* @__PURE__ */ new Set()).forEach((i) => {
      i.layoutManager.subscribeTargets({
        target: i,
        targets: [e]
      });
    });
  }
  /**
   * unsubscribe from parent only if all its children were deselected
   */
  unsubscribeTargets(t) {
    const e = t.target, s = e.getObjects();
    t.targets.reduce((r, o) => (o.parent && r.add(o.parent), r), /* @__PURE__ */ new Set()).forEach((r) => {
      !s.some((o) => o.parent === r) && r.layoutManager.unsubscribeTargets({
        target: r,
        targets: [e]
      });
    });
  }
}
const Rl = {
  multiSelectionStacking: "canvas-stacking"
};
class Pe extends Tt {
  static type = "ActiveSelection";
  static ownDefaults = Rl;
  static getDefaults() {
    return { ...super.getDefaults(), ...Pe.ownDefaults };
  }
  constructor(t = [], e = {}) {
    super(), Object.assign(this, Pe.ownDefaults), this.setOptions(e);
    const { left: s, top: i, layoutManager: r } = e;
    this.groupInit(t, {
      left: s,
      top: i,
      layoutManager: r ?? new Ll()
    });
  }
  /**
   * @private
   */
  _shouldSetNestedCoords() {
    return !0;
  }
  /**
   * @private
   * @override we don't want the selection monitor to be active
   */
  __objectSelectionMonitor() {
  }
  /**
   * Adds objects with respect to {@link multiSelectionStacking}
   * @param targets object to add to selection
   */
  multiSelectAdd(...t) {
    this.multiSelectionStacking === "selection-order" ? this.add(...t) : t.forEach((e) => {
      const s = this._objects.findIndex((r) => r.isInFrontOf(e)), i = s === -1 ? (
        //  `target` is in front of all other objects
        this.size()
      ) : s;
      this.insertAt(i, e);
    });
  }
  /**
   * @override block ancestors/descendants of selected objects from being selected to prevent a circular object tree
   */
  canEnterGroup(t) {
    return this.getObjects().some(
      (e) => e.isDescendantOf(t) || t.isDescendantOf(e)
    ) ? (Mt(
      "error",
      "ActiveSelection: circular object trees are not supported, this call has no effect"
    ), !1) : super.canEnterGroup(t);
  }
  /**
   * Change an object so that it can be part of an active selection.
   * this method is called by multiselectAdd from canvas code.
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   */
  enterGroup(t, e) {
    t.parent && t.parent === t.group ? t.parent._exitGroup(t) : t.group && t.parent !== t.group && t.group.remove(t), this._enterGroup(t, e);
  }
  /**
   * we want objects to retain their canvas ref when exiting instance
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  exitGroup(t, e) {
    this._exitGroup(t, e), t.parent && t.parent._enterGroup(t, !0);
  }
  /**
   * @private
   * @param {'added'|'removed'} type
   * @param {FabricObject[]} targets
   */
  _onAfterObjectsChange(t, e) {
    super._onAfterObjectsChange(t, e);
    const s = /* @__PURE__ */ new Set();
    e.forEach((i) => {
      const { parent: r } = i;
      r && s.add(r);
    }), t === ki ? s.forEach((i) => {
      i._onAfterObjectsChange(Ze, e);
    }) : s.forEach((i) => {
      i._set("dirty", !0);
    });
  }
  /**
   * @override remove all objects
   */
  onDeselect() {
    return this.removeAll(), !1;
  }
  /**
   * Returns string representation of a group
   * @return {String}
   */
  toString() {
    return `#<ActiveSelection: (${this.complexity()})>`;
  }
  /**
   * Decide if the object should cache or not. The Active selection never caches
   * @return {Boolean}
   */
  shouldCache() {
    return !1;
  }
  /**
   * Check if this group or its parent group are caching, recursively up
   * @return {Boolean}
   */
  isOnACache() {
    return !1;
  }
  /**
   * Renders controls and borders for the object
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Object} [styleOverride] properties to override the object style
   * @param {Object} [childrenOverride] properties to override the children overrides
   */
  _renderControls(t, e, s) {
    t.save(), t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    const i = {
      hasControls: !1,
      ...s,
      forActiveSelection: !0
    };
    for (let r = 0; r < this._objects.length; r++)
      this._objects[r]._renderControls(t, i);
    super._renderControls(t, e), t.restore();
  }
}
x.setClass(Pe);
x.setClass(Pe, "activeSelection");
class jl {
  /**
   * Experimental. This object is a sort of repository of help layers used to avoid
   * of recreating them during frequent filtering. If you are previewing a filter with
   * a slider you probably do not want to create help layers every filter step.
   * in this object there will be appended some canvases, created once, resized sometimes
   * cleared never. Clearing is left to the developer.
   **/
  resources = {};
  /**
   * Apply a set of filters against a source image and draw the filtered output
   * to the provided destination canvas.
   *
   * @param {EnhancedFilter} filters The filter to apply.
   * @param {HTMLImageElement|HTMLCanvasElement} sourceElement The source to be filtered.
   * @param {Number} sourceWidth The width of the source input.
   * @param {Number} sourceHeight The height of the source input.
   * @param {HTMLCanvasElement} targetCanvas The destination for filtered output to be drawn.
   */
  applyFilters(t, e, s, i, r) {
    const o = r.getContext("2d", {
      willReadFrequently: !0,
      desynchronized: !0
    });
    if (!o)
      return;
    o.drawImage(e, 0, 0, s, i);
    const a = o.getImageData(0, 0, s, i), h = o.getImageData(0, 0, s, i), l = {
      sourceWidth: s,
      sourceHeight: i,
      imageData: a,
      originalEl: e,
      originalImageData: h,
      canvasEl: r,
      ctx: o,
      filterBackend: this
    };
    t.forEach((u) => {
      u.applyTo(l);
    });
    const { imageData: c } = l;
    return (c.width !== s || c.height !== i) && (r.width = c.width, r.height = c.height), o.putImageData(c, 0, 0), l;
  }
}
class ls {
  /**
   * Define ...
   **/
  aPosition = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]);
  /**
   * Experimental. This object is a sort of repository of help layers used to avoid
   * of recreating them during frequent filtering. If you are previewing a filter with
   * a slider you probably do not want to create help layers every filter step.
   * in this object there will be appended some canvases, created once, resized sometimes
   * cleared never. Clearing is left to the developer.
   **/
  resources = {};
  constructor({ tileSize: t = M.textureSize } = {}) {
    this.tileSize = t, this.setupGLContext(t, t), this.captureGPUInfo();
  }
  /**
   * Setup a WebGL context suitable for filtering, and bind any needed event handlers.
   */
  setupGLContext(t, e) {
    this.dispose(), this.createWebGLCanvas(t, e);
  }
  /**
   * Create a canvas element and associated WebGL context and attaches them as
   * class properties to the GLFilterBackend class.
   */
  createWebGLCanvas(t, e) {
    const s = rt({ width: t, height: e }), i = {
      alpha: !0,
      premultipliedAlpha: !1,
      depth: !1,
      stencil: !1,
      antialias: !1
    }, r = s.getContext("webgl", i);
    r && (r.clearColor(0, 0, 0, 0), this.canvas = s, this.gl = r);
  }
  /**
   * Attempts to apply the requested filters to the source provided, drawing the filtered output
   * to the provided target canvas.
   *
   * @param {Array} filters The filters to apply.
   * @param {TexImageSource} source The source to be filtered.
   * @param {Number} width The width of the source input.
   * @param {Number} height The height of the source input.
   * @param {HTMLCanvasElement} targetCanvas The destination for filtered output to be drawn.
   * @param {String|undefined} cacheKey A key used to cache resources related to the source. If
   * omitted, caching will be skipped.
   */
  applyFilters(t, e, s, i, r, o) {
    const a = this.gl, h = r.getContext("2d");
    if (!a || !h)
      return;
    let l;
    o && (l = this.getCachedTexture(o, e));
    const c = {
      originalWidth: e.width || e.naturalWidth || 0,
      originalHeight: e.height || e.naturalHeight || 0,
      sourceWidth: s,
      sourceHeight: i,
      destinationWidth: s,
      destinationHeight: i,
      context: a,
      sourceTexture: this.createTexture(
        a,
        s,
        i,
        l ? void 0 : e
      ),
      targetTexture: this.createTexture(a, s, i),
      originalTexture: l || this.createTexture(
        a,
        s,
        i,
        l ? void 0 : e
      ),
      passes: t.length,
      webgl: !0,
      aPosition: this.aPosition,
      programCache: this.programCache,
      pass: 0,
      filterBackend: this,
      targetCanvas: r
    }, u = a.createFramebuffer();
    return a.bindFramebuffer(a.FRAMEBUFFER, u), t.forEach((f) => {
      f && f.applyTo(c);
    }), Bl(c), this.copyGLTo2D(a, c), a.bindTexture(a.TEXTURE_2D, null), a.deleteTexture(c.sourceTexture), a.deleteTexture(c.targetTexture), a.deleteFramebuffer(u), h.setTransform(1, 0, 0, 1, 0, 0), c;
  }
  /**
   * Detach event listeners, remove references, and clean up caches.
   */
  dispose() {
    this.canvas && (this.canvas = null, this.gl = null), this.clearWebGLCaches();
  }
  /**
   * Wipe out WebGL-related caches.
   */
  clearWebGLCaches() {
    this.programCache = {}, this.textureCache = {};
  }
  /**
   * Create a WebGL texture object.
   *
   * Accepts specific dimensions to initialize the texture to or a source image.
   *
   * @param {WebGLRenderingContext} gl The GL context to use for creating the texture.
   * @param {number} width The width to initialize the texture at.
   * @param {number} height The height to initialize the texture.
   * @param {TexImageSource} textureImageSource A source for the texture data.
   * @param {number} filter gl.NEAREST default or gl.LINEAR filters for the texture.
   * This filter is very useful for LUTs filters. If you need interpolation use gl.LINEAR
   * @returns {WebGLTexture}
   */
  createTexture(t, e, s, i, r) {
    const {
      NEAREST: o,
      TEXTURE_2D: a,
      RGBA: h,
      UNSIGNED_BYTE: l,
      CLAMP_TO_EDGE: c,
      TEXTURE_MAG_FILTER: u,
      TEXTURE_MIN_FILTER: f,
      TEXTURE_WRAP_S: d,
      TEXTURE_WRAP_T: g
    } = t, p = t.createTexture();
    return t.bindTexture(a, p), t.texParameteri(a, u, r || o), t.texParameteri(a, f, r || o), t.texParameteri(a, d, c), t.texParameteri(a, g, c), i ? t.texImage2D(
      a,
      0,
      h,
      h,
      l,
      i
    ) : t.texImage2D(
      a,
      0,
      h,
      e,
      s,
      0,
      h,
      l,
      null
    ), p;
  }
  /**
   * Can be optionally used to get a texture from the cache array
   *
   * If an existing texture is not found, a new texture is created and cached.
   *
   * @param {String} uniqueId A cache key to use to find an existing texture.
   * @param {HTMLImageElement|HTMLCanvasElement} textureImageSource A source to use to create the
   * texture cache entry if one does not already exist.
   */
  getCachedTexture(t, e, s) {
    const { textureCache: i } = this;
    if (i[t])
      return i[t];
    {
      const r = this.createTexture(
        this.gl,
        e.width,
        e.height,
        e,
        s
      );
      return r && (i[t] = r), r;
    }
  }
  /**
   * Clear out cached resources related to a source image that has been
   * filtered previously.
   *
   * @param {String} cacheKey The cache key provided when the source image was filtered.
   */
  evictCachesForKey(t) {
    this.textureCache[t] && (this.gl.deleteTexture(this.textureCache[t]), delete this.textureCache[t]);
  }
  /**
   * Copy an input WebGL canvas on to an output 2D canvas.
   *
   * The WebGL canvas is assumed to be upside down, with the top-left pixel of the
   * desired output image appearing in the bottom-left corner of the WebGL canvas.
   *
   * @param {WebGLRenderingContext} sourceContext The WebGL context to copy from.
   * @param {Object} pipelineState The 2D target canvas to copy on to.
   */
  copyGLTo2D(t, e) {
    const s = t.canvas, i = e.targetCanvas, r = i.getContext("2d");
    if (!r)
      return;
    r.translate(0, i.height), r.scale(1, -1);
    const o = s.height - i.height;
    r.drawImage(
      s,
      0,
      o,
      i.width,
      i.height,
      0,
      0,
      i.width,
      i.height
    );
  }
  /**
   * Copy an input WebGL canvas on to an output 2D canvas using 2d canvas' putImageData
   * API. Measurably faster than using ctx.drawImage in Firefox (version 54 on OSX Sierra).
   *
   * @param {WebGLRenderingContext} sourceContext The WebGL context to copy from.
   * @param {HTMLCanvasElement} targetCanvas The 2D target canvas to copy on to.
   * @param {Object} pipelineState The 2D target canvas to copy on to.
   */
  copyGLTo2DPutImageData(t, e) {
    const s = e.targetCanvas, i = s.getContext("2d"), r = e.destinationWidth, o = e.destinationHeight, a = r * o * 4;
    if (!i)
      return;
    const h = new Uint8Array(this.imageBuffer, 0, a), l = new Uint8ClampedArray(this.imageBuffer, 0, a);
    t.readPixels(0, 0, r, o, t.RGBA, t.UNSIGNED_BYTE, h);
    const c = new ImageData(l, r, o);
    i.putImageData(c, 0, 0);
  }
  /**
   * Attempt to extract GPU information strings from a WebGL context.
   *
   * Useful information when debugging or blacklisting specific GPUs.
   *
   * @returns {Object} A GPU info object with renderer and vendor strings.
   */
  captureGPUInfo() {
    if (this.gpuInfo)
      return this.gpuInfo;
    const t = this.gl, e = { renderer: "", vendor: "" };
    if (!t)
      return e;
    const s = t.getExtension("WEBGL_debug_renderer_info");
    if (s) {
      const i = t.getParameter(s.UNMASKED_RENDERER_WEBGL), r = t.getParameter(s.UNMASKED_VENDOR_WEBGL);
      i && (e.renderer = i.toLowerCase()), r && (e.vendor = r.toLowerCase());
    }
    return this.gpuInfo = e, e;
  }
}
function Bl(n) {
  const t = n.targetCanvas, e = t.width, s = t.height, i = n.destinationWidth, r = n.destinationHeight;
  (e !== i || s !== r) && (t.width = i, t.height = r);
}
let Xe;
function Il() {
  const { WebGLProbe: n } = bt();
  return n.queryWebGL(ut()), M.enableGLFiltering && n.isSupported(M.textureSize) ? new ls({ tileSize: M.textureSize }) : new jl();
}
function js(n = !0) {
  return !Xe && n && (Xe = Il()), Xe;
}
function Jc(n) {
  Xe = n;
}
const Yl = {
  strokeWidth: 0,
  srcFromAttribute: !1,
  minimumScaleTrigger: 0.5,
  cropX: 0,
  cropY: 0,
  imageSmoothing: !0
}, ur = ["cropX", "cropY"];
class qt extends z {
  /**
   * private
   * contains last value of scaleX to detect
   * if the Image got resized after the last Render
   * @type Number
   */
  _lastScaleX = 1;
  /**
   * private
   * contains last value of scaleY to detect
   * if the Image got resized after the last Render
   * @type Number
   */
  _lastScaleY = 1;
  /**
   * private
   * contains last value of scaling applied by the apply filter chain
   * @type Number
   */
  _filterScalingX = 1;
  /**
   * private
   * contains last value of scaling applied by the apply filter chain
   * @type Number
   */
  _filterScalingY = 1;
  static type = "Image";
  static cacheProperties = [...At, ...ur];
  static ownDefaults = Yl;
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...qt.ownDefaults
    };
  }
  constructor(t, e) {
    super(), this.filters = [], Object.assign(this, qt.ownDefaults), this.setOptions(e), this.cacheKey = `texture${jt()}`, this.setElement(
      typeof t == "string" ? (this.canvas && gt(this.canvas.getElement()) || fe()).getElementById(t) : t,
      e
    );
  }
  /**
   * Returns image element which this instance if based on
   */
  getElement() {
    return this._element;
  }
  /**
   * Sets image element for this instance to a specified one.
   * If filters defined they are applied to new image.
   * You might need to call `canvas.renderAll` and `object.setCoords` after replacing, to render new image and update controls area.
   * @param {HTMLImageElement} element
   * @param {Partial<TSize>} [size] Options object
   */
  setElement(t, e = {}) {
    this.removeTexture(this.cacheKey), this.removeTexture(`${this.cacheKey}_filtered`), this._element = t, this._originalElement = t, this._setWidthHeight(e), this.filters.length !== 0 && this.applyFilters(), this.resizeFilter && this.applyResizeFilters();
  }
  /**
   * Delete a single texture if in webgl mode
   */
  removeTexture(t) {
    const e = js(!1);
    e instanceof ls && e.evictCachesForKey(t);
  }
  /**
   * Delete textures, reference to elements and eventually JSDOM cleanup
   */
  dispose() {
    super.dispose(), this.removeTexture(this.cacheKey), this.removeTexture(`${this.cacheKey}_filtered`), this._cacheContext = null, ["_originalElement", "_element", "_filteredEl", "_cacheCanvas"].forEach((t) => {
      const e = this[t];
      e && bt().dispose(e), this[t] = void 0;
    });
  }
  /**
   * Get the crossOrigin value (of the corresponding image element)
   */
  getCrossOrigin() {
    return this._originalElement && (this._originalElement.crossOrigin || null);
  }
  /**
   * Returns original size of an image
   */
  getOriginalSize() {
    const t = this.getElement();
    return t ? {
      width: t.naturalWidth || t.width,
      height: t.naturalHeight || t.height
    } : {
      width: 0,
      height: 0
    };
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _stroke(t) {
    if (!this.stroke || this.strokeWidth === 0)
      return;
    const e = this.width / 2, s = this.height / 2;
    t.beginPath(), t.moveTo(-e, -s), t.lineTo(e, -s), t.lineTo(e, s), t.lineTo(-e, s), t.lineTo(-e, -s), t.closePath();
  }
  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject(t = []) {
    const e = [];
    return this.filters.forEach((s) => {
      s && e.push(s.toObject());
    }), {
      ...super.toObject([...ur, ...t]),
      src: this.getSrc(),
      crossOrigin: this.getCrossOrigin(),
      filters: e,
      ...this.resizeFilter ? { resizeFilter: this.resizeFilter.toObject() } : {}
    };
  }
  /**
   * Returns true if an image has crop applied, inspecting values of cropX,cropY,width,height.
   * @return {Boolean}
   */
  hasCrop() {
    return !!this.cropX || !!this.cropY || this.width < this._element.width || this.height < this._element.height;
  }
  /**
   * Returns svg representation of an instance
   * @return {string[]} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const t = [], e = this._element, s = -this.width / 2, i = -this.height / 2;
    let r = [], o = [], a = "", h = "";
    if (!e)
      return [];
    if (this.hasCrop()) {
      const l = jt();
      r.push(
        '<clipPath id="imageCrop_' + l + `">
`,
        '	<rect x="' + s + '" y="' + i + '" width="' + this.width + '" height="' + this.height + `" />
`,
        `</clipPath>
`
      ), a = ' clip-path="url(#imageCrop_' + l + ')" ';
    }
    if (this.imageSmoothing || (h = ' image-rendering="optimizeSpeed"'), t.push(
      "	<image ",
      "COMMON_PARTS",
      `xlink:href="${this.getSvgSrc(!0)}" x="${s - this.cropX}" y="${i - this.cropY}" width="${e.width || e.naturalWidth}" height="${e.height || e.naturalHeight}"${h}${a}></image>
`
    ), this.stroke || this.strokeDashArray) {
      const l = this.fill;
      this.fill = null, o = [
        `	<rect x="${s}" y="${i}" width="${this.width}" height="${this.height}" style="${this.getSvgStyles()}" />
`
      ], this.fill = l;
    }
    return this.paintFirst !== X ? r = r.concat(o, t) : r = r.concat(t, o), r;
  }
  /**
   * Returns source of an image
   * @param {Boolean} filtered indicates if the src is needed for svg
   * @return {String} Source of an image
   */
  getSrc(t) {
    const e = t ? this._element : this._originalElement;
    return e ? e.toDataURL ? e.toDataURL() : this.srcFromAttribute ? e.getAttribute("src") || "" : e.src : this.src || "";
  }
  /**
   * Alias for getSrc
   * @param filtered
   * @deprecated
   */
  getSvgSrc(t) {
    return this.getSrc(t);
  }
  /**
   * Loads and sets source of an image\
   * **IMPORTANT**: It is recommended to abort loading tasks before calling this method to prevent race conditions and unnecessary networking
   * @param {String} src Source string (URL)
   * @param {LoadImageOptions} [options] Options object
   */
  setSrc(t, { crossOrigin: e, signal: s } = {}) {
    return Se(t, { crossOrigin: e, signal: s }).then((i) => {
      typeof e < "u" && this.set({ crossOrigin: e }), this.setElement(i);
    });
  }
  /**
   * Returns string representation of an instance
   * @return {String} String representation of an instance
   */
  toString() {
    return `#<Image: { src: "${this.getSrc()}" }>`;
  }
  applyResizeFilters() {
    const t = this.resizeFilter, e = this.minimumScaleTrigger, s = this.getTotalObjectScaling(), i = s.x, r = s.y, o = this._filteredEl || this._originalElement;
    if (this.group && this.set("dirty", !0), !t || i > e && r > e) {
      this._element = o, this._filterScalingX = 1, this._filterScalingY = 1, this._lastScaleX = i, this._lastScaleY = r;
      return;
    }
    const a = rt(o), { width: h, height: l } = o;
    this._element = a, this._lastScaleX = t.scaleX = i, this._lastScaleY = t.scaleY = r, js().applyFilters(
      [t],
      o,
      h,
      l,
      this._element
    ), this._filterScalingX = a.width / this._originalElement.width, this._filterScalingY = a.height / this._originalElement.height;
  }
  /**
   * Applies filters assigned to this image (from "filters" array) or from filter param
   * @param {Array} filters to be applied
   * @param {Boolean} forResizing specify if the filter operation is a resize operation
   */
  applyFilters(t = this.filters || []) {
    if (t = t.filter((r) => r && !r.isNeutralState()), this.set("dirty", !0), this.removeTexture(`${this.cacheKey}_filtered`), t.length === 0) {
      this._element = this._originalElement, this._filteredEl = void 0, this._filterScalingX = 1, this._filterScalingY = 1;
      return;
    }
    const e = this._originalElement, s = e.naturalWidth || e.width, i = e.naturalHeight || e.height;
    if (this._element === this._originalElement) {
      const r = rt({
        width: s,
        height: i
      });
      this._element = r, this._filteredEl = r;
    } else this._filteredEl && (this._element = this._filteredEl, this._filteredEl.getContext("2d").clearRect(0, 0, s, i), this._lastScaleX = 1, this._lastScaleY = 1);
    js().applyFilters(
      t,
      this._originalElement,
      s,
      i,
      this._element,
      this.cacheKey
    ), (this._originalElement.width !== this._element.width || this._originalElement.height !== this._element.height) && (this._filterScalingX = this._element.width / this._originalElement.width, this._filterScalingY = this._element.height / this._originalElement.height);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(t) {
    t.imageSmoothingEnabled = this.imageSmoothing, this.isMoving !== !0 && this.resizeFilter && this._needsResize() && this.applyResizeFilters(), this._stroke(t), this._renderPaintInOrder(t);
  }
  /**
   * Paint the cached copy of the object on the target context.
   * it will set the imageSmoothing for the draw operation
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawCacheOnCanvas(t) {
    t.imageSmoothingEnabled = this.imageSmoothing, super.drawCacheOnCanvas(t);
  }
  /**
   * Decide if the FabricImage should cache or not. Create its own cache level
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step.
   * Generally you do not cache objects in groups because the group outside is cached.
   * This is the special Image version where we would like to avoid caching where possible.
   * Essentially images do not benefit from caching. They may require caching, and in that
   * case we do it. Also caching an image usually ends in a loss of details.
   * A full performance audit should be done.
   * @return {Boolean}
   */
  shouldCache() {
    return this.needsItsOwnCache();
  }
  _renderFill(t) {
    const e = this._element;
    if (!e)
      return;
    const s = this._filterScalingX, i = this._filterScalingY, r = this.width, o = this.height, a = Math.max(this.cropX, 0), h = Math.max(this.cropY, 0), l = e.naturalWidth || e.width, c = e.naturalHeight || e.height, u = a * s, f = h * i, d = Math.min(r * s, l - u), g = Math.min(o * i, c - f), p = -r / 2, _ = -o / 2, y = Math.min(r, l / s - a), v = Math.min(o, c / i - h);
    e && t.drawImage(e, u, f, d, g, p, _, y, v);
  }
  /**
   * needed to check if image needs resize
   * @private
   */
  _needsResize() {
    const t = this.getTotalObjectScaling();
    return t.x !== this._lastScaleX || t.y !== this._lastScaleY;
  }
  /**
   * @private
   * @deprecated unused
   */
  _resetWidthHeight() {
    this.set(this.getOriginalSize());
  }
  /**
   * @private
   * Set the width and the height of the image object, using the element or the
   * options.
   */
  _setWidthHeight({ width: t, height: e } = {}) {
    const s = this.getOriginalSize();
    this.width = t || s.width, this.height = e || s.height;
  }
  /**
   * Calculate offset for center and scale factor for the image in order to respect
   * the preserveAspectRatio attribute
   * @private
   */
  parsePreserveAspectRatioAttribute() {
    const t = yi(
      this.preserveAspectRatio || ""
    ), e = this.width, s = this.height, i = { width: e, height: s };
    let r = this._element.width, o = this._element.height, a = 1, h = 1, l = 0, c = 0, u = 0, f = 0, d;
    return t && (t.alignX !== K || t.alignY !== K) ? (t.meetOrSlice === "meet" && (a = h = wn(this._element, i), d = (e - r * a) / 2, t.alignX === "Min" && (l = -d), t.alignX === "Max" && (l = d), d = (s - o * h) / 2, t.alignY === "Min" && (c = -d), t.alignY === "Max" && (c = d)), t.meetOrSlice === "slice" && (a = h = xn(this._element, i), d = r - e / a, t.alignX === "Mid" && (u = d / 2), t.alignX === "Max" && (u = d), d = o - s / h, t.alignY === "Mid" && (f = d / 2), t.alignY === "Max" && (f = d), r = e / a, o = s / h)) : (a = e / r, h = s / o), {
      width: r,
      height: o,
      scaleX: a,
      scaleY: h,
      offsetLeft: l,
      offsetTop: c,
      cropX: u,
      cropY: f
    };
  }
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link FabricImage.fromElement})
   * @see {@link http://www.w3.org/TR/SVG/struct.html#ImageElement}
   */
  static ATTRIBUTE_NAMES = [
    ...Yt,
    "x",
    "y",
    "width",
    "height",
    "preserveAspectRatio",
    "xlink:href",
    "href",
    "crossOrigin",
    "image-rendering"
  ];
  /**
   * Creates an instance of FabricImage from its object representation
   * @param {Object} object Object to create an instance from
   * @param {object} [options] Options object
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<FabricImage>}
   */
  static fromObject({ filters: t, resizeFilter: e, src: s, crossOrigin: i, type: r, ...o }, a) {
    return Promise.all([
      Se(s, { ...a, crossOrigin: i }),
      t && ae(t, a),
      // redundant - handled by enlivenObjectEnlivables, but nicely explicit
      e ? ae([e], a) : [],
      Ae(o, a)
    ]).then(([h, l = [], [c], u = {}]) => new this(h, {
      ...o,
      // TODO: passing src creates a difference between image creation and restoring from JSON
      src: s,
      filters: l,
      resizeFilter: c,
      ...u
    }));
  }
  /**
   * Creates an instance of Image from an URL string
   * @param {String} url URL to create an image from
   * @param {LoadImageOptions} [options] Options object
   * @returns {Promise<FabricImage>}
   */
  static fromURL(t, { crossOrigin: e = null, signal: s } = {}, i) {
    return Se(t, { crossOrigin: e, signal: s }).then(
      (r) => new this(r, i)
    );
  }
  /**
   * Returns {@link FabricImage} instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @param {Function} callback Callback to execute when Image object is created
   */
  static async fromElement(t, e = {}, s) {
    const i = Ft(
      t,
      this.ATTRIBUTE_NAMES,
      s
    );
    return this.fromURL(
      i["xlink:href"] || i.href,
      e,
      i
    ).catch((r) => (Mt("log", "Unable to parse Image", r), null));
  }
}
x.setClass(qt);
x.setSVGClass(qt);
function Qs(n) {
  if (!ta.test(n.nodeName))
    return {};
  const t = n.getAttribute("viewBox");
  let e = 1, s = 1, i = 0, r = 0, o, a;
  const h = n.getAttribute("width"), l = n.getAttribute("height"), c = n.getAttribute("x") || 0, u = n.getAttribute("y") || 0, d = !(t && Ki.test(t)), g = !h || !l || h === "100%" || l === "100%";
  let p = "", _ = 0, y = 0;
  if (d && (c || u) && n.parentNode && n.parentNode.nodeName !== "#document" && (p = " translate(" + U(c || "0") + " " + U(u || "0") + ") ", o = (n.getAttribute("transform") || "") + p, n.setAttribute("transform", o), n.removeAttribute("x"), n.removeAttribute("y")), d && g)
    return {
      width: 0,
      height: 0
    };
  const v = {
    width: 0,
    height: 0
  };
  if (d)
    return v.width = U(h), v.height = U(l), v;
  const S = t.match(Ki);
  i = -parseFloat(S[1]), r = -parseFloat(S[2]);
  const C = parseFloat(S[3]), w = parseFloat(S[4]);
  v.minX = i, v.minY = r, v.viewBoxWidth = C, v.viewBoxHeight = w, g ? (v.width = C, v.height = w) : (v.width = U(h), v.height = U(l), e = v.width / C, s = v.height / w);
  const b = yi(
    n.getAttribute("preserveAspectRatio") || ""
  );
  if (b.alignX !== K && (b.meetOrSlice === "meet" && (s = e = e > s ? s : e), b.meetOrSlice === "slice" && (s = e = e > s ? e : s), _ = v.width - C * e, y = v.height - w * e, b.alignX === "Mid" && (_ /= 2), b.alignY === "Mid" && (y /= 2), b.alignX === "Min" && (_ = 0), b.alignY === "Min" && (y = 0)), e === 1 && s === 1 && i === 0 && r === 0 && c === 0 && u === 0)
    return v;
  if ((c || u) && n.parentNode.nodeName !== "#document" && (p = " translate(" + U(c || "0") + " " + U(u || "0") + ") "), o = p + " matrix(" + e + " 0 0 " + s + " " + (i * e + _) + " " + (r * s + y) + ") ", n.nodeName === "svg") {
    for (a = n.ownerDocument.createElementNS(Ws, "g"); n.firstChild; )
      a.appendChild(n.firstChild);
    n.appendChild(a);
  } else
    a = n, a.removeAttribute("x"), a.removeAttribute("y"), o = a.getAttribute("transform") + o;
  return a.setAttribute("transform", o), v;
}
const bs = (n) => n.tagName.replace("svg:", ""), Vl = ys(Ko);
function Xl(n) {
  let t = n;
  for (; t && (t = t.parentElement); )
    if (t && t.nodeName && Vl.test(bs(t)) && !t.getAttribute("instantiated_by_use"))
      return !0;
  return !1;
}
function Yn(n, t) {
  let e, s = [], i, r, o;
  for (r = 0, o = t.length; r < o; r++)
    e = t[r], i = n.getElementsByTagNameNS(
      "http://www.w3.org/2000/svg",
      e
    ), s = s.concat(Array.from(i));
  return s;
}
function $l(n) {
  const t = Yn(n, ["use", "svg:use"]), e = ["x", "y", "xlink:href", "href", "transform"];
  for (const s of t) {
    const i = s.attributes, r = {};
    for (const p of i)
      p.value && (r[p.name] = p.value);
    const o = (r["xlink:href"] || r.href || "").slice(1);
    if (o === "")
      return;
    const a = n.getElementById(o);
    if (a === null)
      return;
    let h = a.cloneNode(!0);
    const l = h.attributes, c = {};
    for (const p of l)
      p.value && (c[p.name] = p.value);
    const { x: u = 0, y: f = 0, transform: d = "" } = r, g = `${d} ${c.transform || ""} translate(${u}, ${f})`;
    if (Qs(h), /^svg$/i.test(h.nodeName)) {
      const p = h.ownerDocument.createElementNS(Ws, "g");
      Object.entries(c).forEach(
        ([_, y]) => p.setAttributeNS(Ws, _, y)
      ), p.append(...h.childNodes), h = p;
    }
    for (const p of i) {
      if (!p)
        continue;
      const { name: _, value: y } = p;
      if (!e.includes(_))
        if (_ === "style") {
          const v = {};
          Us(y, v), Object.entries(c).forEach(([C, w]) => {
            v[C] = w;
          }), Us(c.style || "", v);
          const S = Object.entries(v).map((C) => C.join(":")).join(";");
          h.setAttribute(_, S);
        } else
          !c[_] && h.setAttribute(_, y);
    }
    h.setAttribute("transform", g), h.setAttribute("instantiated_by_use", "1"), h.removeAttribute("id"), s.parentNode.replaceChild(h, s);
  }
}
const Wl = [
  "gradientTransform",
  "x1",
  "x2",
  "y1",
  "y2",
  "gradientUnits",
  "cx",
  "cy",
  "r",
  "fx",
  "fy"
], Bs = "xlink:href";
function Vn(n, t) {
  const e = t.getAttribute(Bs)?.slice(1) || "", s = n.getElementById(e);
  if (s && s.getAttribute(Bs) && Vn(n, s), s && (Wl.forEach((i) => {
    const r = s.getAttribute(i);
    !t.hasAttribute(i) && r && t.setAttribute(i, r);
  }), !t.children.length)) {
    const i = s.cloneNode(!0);
    for (; i.firstChild; )
      t.appendChild(i.firstChild);
  }
  t.removeAttribute(Bs);
}
const Gl = [
  "linearGradient",
  "radialGradient",
  "svg:linearGradient",
  "svg:radialGradient"
];
function Hl(n) {
  const t = Yn(n, Gl), e = {};
  let s = t.length;
  for (; s--; ) {
    const i = t[s];
    i.getAttribute("xlink:href") && Vn(n, i);
    const r = i.getAttribute("id");
    r && (e[r] = i);
  }
  return e;
}
function zl(n) {
  const t = n.getElementsByTagName("style"), e = {};
  for (let s = 0; s < t.length; s++) {
    const i = (t[s].textContent || "").replace(
      // remove comments
      /\/\*[\s\S]*?\*\//g,
      ""
    );
    i.trim() !== "" && i.split("}").filter((r, o, a) => a.length > 1 && r.trim()).forEach((r) => {
      if ((r.match(/{/g) || []).length > 1 && r.trim().startsWith("@"))
        return;
      const o = r.split("{"), a = {}, h = o[1].trim(), l = h.split(";").filter(function(c) {
        return c.trim();
      });
      for (let c = 0; c < l.length; c++) {
        const u = l[c].split(":"), f = u[0].trim(), d = u[1].trim();
        a[f] = d;
      }
      r = o[0].trim(), r.split(",").forEach((c) => {
        c = c.replace(/^svg/i, "").trim(), c !== "" && (e[c] = {
          ...e[c] || {},
          ...a
        });
      });
    });
  }
  return e;
}
const fr = (n) => x.getSVGClass(bs(n).toLowerCase());
class Nl {
  constructor(t, e, s, i, r) {
    this.elements = t, this.options = e, this.reviver = s, this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g, this.doc = i, this.clipPaths = r, this.gradientDefs = Hl(i), this.cssRules = zl(i);
  }
  parse() {
    return Promise.all(
      this.elements.map((t) => this.createObject(t))
    );
  }
  async createObject(t) {
    const e = fr(t);
    if (e) {
      const s = await e.fromElement(
        t,
        this.options,
        this.cssRules
      );
      return this.resolveGradient(s, t, X), this.resolveGradient(s, t, H), s instanceof qt && s._originalElement ? Ve(
        s,
        s.parsePreserveAspectRatioAttribute()
      ) : Ve(s), await this.resolveClipPath(s, t), this.reviver && this.reviver(t, s), s;
    }
    return null;
  }
  extractPropertyDefinition(t, e, s) {
    const i = t[e], r = this.regexUrl;
    if (!r.test(i))
      return;
    r.lastIndex = 0;
    const o = r.exec(i)[1];
    return r.lastIndex = 0, s[o];
  }
  resolveGradient(t, e, s) {
    const i = this.extractPropertyDefinition(
      t,
      s,
      this.gradientDefs
    );
    if (i) {
      const r = e.getAttribute(s + "-opacity"), o = ws.fromElement(i, t, {
        ...this.options,
        opacity: r
      });
      t.set(s, o);
    }
  }
  // TODO: resolveClipPath could be run once per clippath with minor work per object.
  // is a refactor that i m not sure is worth on this code
  async resolveClipPath(t, e, s) {
    const i = this.extractPropertyDefinition(
      t,
      "clipPath",
      this.clipPaths
    );
    if (i) {
      const r = st(t.calcTransformMatrix()), o = i[0].parentElement;
      let a = e;
      for (; !s && a.parentElement && a.getAttribute("clip-path") !== t.clipPath; )
        a = a.parentElement;
      a.parentElement.appendChild(o);
      const h = Qe(
        `${a.getAttribute("transform") || ""} ${o.getAttribute("originalTransform") || ""}`
      );
      o.setAttribute(
        "transform",
        `matrix(${h.join(",")})`
      );
      const l = await Promise.all(
        i.map((v) => fr(v).fromElement(v, this.options, this.cssRules).then((S) => (Ve(S), S.fillRule = S.clipRule, delete S.clipRule, S)))
      ), c = l.length === 1 ? l[0] : new Tt(l), u = B(
        r,
        c.calcTransformMatrix()
      );
      c.clipPath && await this.resolveClipPath(
        c,
        a,
        // this is tricky.
        // it tries to differentiate from when clipPaths are inherited by outside groups
        // or when are really clipPaths referencing other clipPaths
        o.getAttribute("clip-path") ? a : void 0
      );
      const { scaleX: f, scaleY: d, angle: g, skewX: p, translateX: _, translateY: y } = Gt(u);
      c.set({
        flipX: !1,
        flipY: !1
      }), c.set({
        scaleX: f,
        scaleY: d,
        angle: g,
        skewX: p,
        skewY: 0
      }), c.setPositionByOrigin(
        new m(_, y),
        T,
        T
      ), t.clipPath = c;
    } else {
      delete t.clipPath;
      return;
    }
  }
}
const dr = (n) => Zo.test(bs(n)), Zs = () => ({
  objects: [],
  elements: [],
  options: {},
  allElements: []
});
async function Ul(n, t, { crossOrigin: e, signal: s } = {}) {
  if (s && s.aborted)
    return Mt("log", new pr("parseSVGDocument")), Zs();
  const i = n.documentElement;
  $l(n);
  const r = Array.from(i.getElementsByTagName("*")), o = {
    ...Qs(i),
    crossOrigin: e,
    signal: s
  }, a = r.filter((u) => (Qs(u), dr(u) && !Xl(u)));
  if (!a || a && !a.length)
    return {
      ...Zs(),
      options: o,
      allElements: r
    };
  const h = {};
  return r.filter((u) => bs(u) === "clipPath").forEach((u) => {
    u.setAttribute("originalTransform", u.getAttribute("transform") || "");
    const f = u.getAttribute("id");
    h[f] = Array.from(u.getElementsByTagName("*")).filter(
      (d) => dr(d)
    );
  }), {
    objects: await new Nl(
      a,
      o,
      t,
      n,
      h
    ).parse(),
    elements: a,
    options: o,
    allElements: r
  };
}
function ql(n, t, e) {
  const s = new (Ot()).DOMParser(), i = s.parseFromString(n.trim(), "text/xml");
  return Ul(i, t, e);
}
function Qc(n, t, e = {}) {
  return fetch(n.replace(/^\n\s*/, "").trim(), {
    signal: e.signal
  }).then((s) => {
    if (!s.ok)
      throw new pt(`HTTP error! status: ${s.status}`);
    return s.text();
  }).then((s) => ql(s, t, e)).catch(() => Zs());
}
const Xn = Cr, $n = (n) => function(t, e, s) {
  const { points: i, pathOffset: r } = s;
  return new m(i[n]).subtract(r).transform(
    B(
      s.getViewportTransform(),
      s.calcTransformMatrix()
    )
  );
}, Wn = (n, t, e, s) => {
  const { target: i, pointIndex: r } = t, o = i, a = Et(
    new m(e, s),
    void 0,
    o.calcOwnMatrix()
  );
  return o.points[r] = a.add(o.pathOffset), o.setDimensions(), o.set("dirty", !0), !0;
}, Gn = (n, t) => function(e, s, i, r) {
  const o = s.target, a = new m(
    o.points[(n > 0 ? n : o.points.length) - 1]
  ), h = a.subtract(o.pathOffset).transform(o.calcOwnMatrix()), l = t(e, { ...s, pointIndex: n }, i, r), u = a.subtract(o.pathOffset).transform(o.calcOwnMatrix()).subtract(h);
  return o.left -= u.x, o.top -= u.y, l;
}, Hn = (n) => It(
  Xn,
  Gn(n, Wn)
);
function Kl(n, t = {}) {
  const e = {};
  for (let s = 0; s < (typeof n == "number" ? n : n.points.length); s++)
    e[`p${s}`] = new ot({
      actionName: Xn,
      positionHandler: $n(s),
      actionHandler: Hn(s),
      ...t
    });
  return e;
}
const Jl = "modifyPath", ti = (n, t, e) => {
  const { path: s, pathOffset: i } = n, r = s[t];
  return new m(
    r[e] - i.x,
    r[e + 1] - i.y
  ).transform(
    B(
      n.getViewportTransform(),
      n.calcTransformMatrix()
    )
  );
}, Ql = (n, t, e, s, i) => {
  const { path: r, pathOffset: o } = n, a = r[(s > 0 ? s : r.length) - 1], h = new m(
    a[i],
    a[i + 1]
  ), l = h.subtract(o).transform(n.calcOwnMatrix()), c = Et(
    new m(t, e),
    void 0,
    n.calcOwnMatrix()
  );
  r[s][i] = c.x + o.x, r[s][i + 1] = c.y + o.y, n.setDimensions();
  const f = h.subtract(n.pathOffset).transform(n.calcOwnMatrix()).subtract(l);
  return n.left -= f.x, n.top -= f.y, n.set("dirty", !0), !0;
};
function Zl(n, t, e) {
  const { commandIndex: s, pointIndex: i } = this;
  return ti(e, s, i);
}
function tc(n, t, e, s) {
  const { target: i } = t, { commandIndex: r, pointIndex: o } = this, a = Ql(
    i,
    e,
    s,
    r,
    o
  );
  return di(this.actionName, {
    ..._i(n, t, e, s),
    commandIndex: r,
    pointIndex: o
  }), a;
}
const ec = (n) => n === "C" ? 5 : n === "Q" ? 3 : 1;
class zn extends ot {
  constructor(t) {
    super(t);
  }
  render(t, e, s, i, r) {
    const o = {
      ...i,
      cornerColor: this.controlFill,
      cornerStrokeColor: this.controlStroke,
      transparentCorners: !this.controlFill
    };
    super.render(t, e, s, o, r);
  }
}
class sc extends zn {
  constructor(t) {
    super(t);
  }
  render(t, e, s, i, r) {
    const { path: o } = r, {
      commandIndex: a,
      pointIndex: h,
      connectToCommandIndex: l,
      connectToPointIndex: c
    } = this;
    t.save(), t.strokeStyle = this.controlStroke, this.connectionDashArray && t.setLineDash(this.connectionDashArray);
    const [u] = o[a], f = ti(
      r,
      l,
      c
    );
    if (u === "Q") {
      const d = ti(
        r,
        a,
        h + 2
      );
      t.moveTo(d.x, d.y), t.lineTo(e, s);
    } else
      t.moveTo(e, s);
    t.lineTo(f.x, f.y), t.stroke(), t.restore(), super.render(t, e, s, i, r);
  }
}
const je = (n, t, e, s, i, r) => new (e ? sc : zn)({
  commandIndex: n,
  pointIndex: t,
  actionName: Jl,
  positionHandler: Zl,
  actionHandler: tc,
  connectToCommandIndex: i,
  connectToPointIndex: r,
  ...s,
  ...e ? s.controlPointStyle : s.pointStyle
});
function ic(n, t = {}) {
  const e = {};
  let s = "M";
  return n.path.forEach((i, r) => {
    const o = i[0];
    switch (o !== "Z" && (e[`c_${r}_${o}`] = je(
      r,
      i.length - 2,
      !1,
      t
    )), o) {
      case "C":
        e[`c_${r}_C_CP_1`] = je(
          r,
          1,
          !0,
          t,
          r - 1,
          ec(s)
        ), e[`c_${r}_C_CP_2`] = je(
          r,
          3,
          !0,
          t,
          r,
          5
        );
        break;
      case "Q":
        e[`c_${r}_Q_CP_1`] = je(
          r,
          1,
          !0,
          t,
          r,
          3
        );
        break;
    }
    s = o;
  }), e;
}
const Zc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  changeWidth: Gs,
  createObjectDefaultControls: Ti,
  createPathControls: ic,
  createPolyActionHandler: Hn,
  createPolyControls: Kl,
  createPolyPositionHandler: $n,
  createResizeControls: ln,
  createTextboxDefaultControls: cn,
  dragHandler: Xr,
  factoryPolyActionHandler: Gn,
  getLocalPoint: _s,
  polyActionHandler: Wn,
  renderCircleControl: Kr,
  renderSquareControl: Jr,
  rotationStyleHandler: Qr,
  rotationWithSnapping: Zr,
  scaleCursorStyleHandler: se,
  scaleOrSkewActionName: ye,
  scaleSkewCursorStyleHandler: $t,
  scalingEqually: _e,
  scalingX: sn,
  scalingXOrSkewingY: zs,
  scalingY: rn,
  scalingYOrSkewingX: Ns,
  skewCursorStyleHandler: nn,
  skewHandlerX: an,
  skewHandlerY: hn,
  wrapWithFireEvent: It,
  wrapWithFixedAnchor: Qt
}, Symbol.toStringTag, { value: "Module" })), Ts = (n) => n.webgl !== void 0, tu = (n, t) => {
  const e = rt({ width: n, height: t }), i = ut().getContext("webgl"), o = {
    imageBuffer: new ArrayBuffer(n * t * 4)
  }, a = {
    destinationWidth: n,
    destinationHeight: t,
    targetCanvas: e
  };
  let h;
  h = Ot().performance.now(), ls.prototype.copyGLTo2D.call(
    o,
    i,
    a
  );
  const l = Ot().performance.now() - h;
  h = Ot().performance.now(), ls.prototype.copyGLTo2DPutImageData.call(
    o,
    i,
    a
  );
  const c = Ot().performance.now() - h;
  return l > c;
}, Ri = "precision highp float", rc = `
    ${Ri};
    varying vec2 vTexCoord;
    uniform sampler2D uTexture;
    void main() {
      gl_FragColor = texture2D(uTexture, vTexCoord);
    }`, nc = `
    attribute vec2 aPosition;
    varying vec2 vTexCoord;
    void main() {
      vTexCoord = aPosition;
      gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
    }`, oc = new RegExp(Ri, "g");
class $ {
  /**
   * Filter type
   */
  get type() {
    return this.constructor.type;
  }
  /**
   * The class type. Used to identify which class this is.
   * This is used for serialization purposes and internally it can be used
   * to identify classes. As a developer you could use `instance of Class`
   * but to avoid importing all the code and blocking tree shaking we try
   * to avoid doing that.
   */
  static type = "BaseFilter";
  /**
   * Contains the uniform locations for the fragment shader.
   * uStepW and uStepH are handled by the BaseFilter, each filter class
   * needs to specify all the one that are needed
   */
  static uniformLocations = [];
  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor({
    type: t,
    ...e
  } = {}) {
    Object.assign(
      this,
      this.constructor.defaults,
      e
    );
  }
  getFragmentSource() {
    return rc;
  }
  getVertexSource() {
    return nc;
  }
  /**
   * Compile this filter's shader program.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context to use for shader compilation.
   * @param {String} fragmentSource fragmentShader source for compilation
   * @param {String} vertexSource vertexShader source for compilation
   */
  createProgram(t, e = this.getFragmentSource(), s = this.getVertexSource()) {
    const {
      WebGLProbe: { GLPrecision: i = "highp" }
    } = bt();
    i !== "highp" && (e = e.replace(
      oc,
      Ri.replace("highp", i)
    ));
    const r = t.createShader(t.VERTEX_SHADER), o = t.createShader(t.FRAGMENT_SHADER), a = t.createProgram();
    if (!r || !o || !a)
      throw new pt(
        "Vertex, fragment shader or program creation error"
      );
    if (t.shaderSource(r, s), t.compileShader(r), !t.getShaderParameter(r, t.COMPILE_STATUS))
      throw new pt(
        `Vertex shader compile error for ${this.type}: ${t.getShaderInfoLog(
          r
        )}`
      );
    if (t.shaderSource(o, e), t.compileShader(o), !t.getShaderParameter(o, t.COMPILE_STATUS))
      throw new pt(
        `Fragment shader compile error for ${this.type}: ${t.getShaderInfoLog(
          o
        )}`
      );
    if (t.attachShader(a, r), t.attachShader(a, o), t.linkProgram(a), !t.getProgramParameter(a, t.LINK_STATUS))
      throw new pt(
        `Shader link error for "${this.type}" ${t.getProgramInfoLog(a)}`
      );
    const h = this.getUniformLocations(t, a) || {};
    return h.uStepW = t.getUniformLocation(a, "uStepW"), h.uStepH = t.getUniformLocation(a, "uStepH"), {
      program: a,
      attributeLocations: this.getAttributeLocations(t, a),
      uniformLocations: h
    };
  }
  /**
   * Return a map of attribute names to WebGLAttributeLocation objects.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {WebGLShaderProgram} program The shader program from which to take attribute locations.
   * @returns {Object} A map of attribute names to attribute locations.
   */
  getAttributeLocations(t, e) {
    return {
      aPosition: t.getAttribLocation(e, "aPosition")
    };
  }
  /**
   * Return a map of uniform names to WebGLUniformLocation objects.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {WebGLShaderProgram} program The shader program from which to take uniform locations.
   * @returns {Object} A map of uniform names to uniform locations.
   */
  getUniformLocations(t, e) {
    const s = this.constructor.uniformLocations, i = {};
    for (let r = 0; r < s.length; r++)
      i[s[r]] = t.getUniformLocation(
        e,
        s[r]
      );
    return i;
  }
  /**
   * Send attribute data from this filter to its shader program on the GPU.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {Object} attributeLocations A map of shader attribute names to their locations.
   */
  sendAttributeData(t, e, s) {
    const i = e.aPosition, r = t.createBuffer();
    t.bindBuffer(t.ARRAY_BUFFER, r), t.enableVertexAttribArray(i), t.vertexAttribPointer(i, 2, t.FLOAT, !1, 0, 0), t.bufferData(t.ARRAY_BUFFER, s, t.STATIC_DRAW);
  }
  _setupFrameBuffer(t) {
    const e = t.context;
    if (t.passes > 1) {
      const s = t.destinationWidth, i = t.destinationHeight;
      (t.sourceWidth !== s || t.sourceHeight !== i) && (e.deleteTexture(t.targetTexture), t.targetTexture = t.filterBackend.createTexture(
        e,
        s,
        i
      )), e.framebufferTexture2D(
        e.FRAMEBUFFER,
        e.COLOR_ATTACHMENT0,
        e.TEXTURE_2D,
        t.targetTexture,
        0
      );
    } else
      e.bindFramebuffer(e.FRAMEBUFFER, null), e.finish();
  }
  _swapTextures(t) {
    t.passes--, t.pass++;
    const e = t.targetTexture;
    t.targetTexture = t.sourceTexture, t.sourceTexture = e;
  }
  /**
   * Generic isNeutral implementation for one parameter based filters.
   * Used only in image applyFilters to discard filters that will not have an effect
   * on the image
   * Other filters may need their own version ( ColorMatrix, HueRotation, gamma, ComposedFilter )
   * @param {Object} options
   **/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isNeutralState(t) {
    return !1;
  }
  /**
   * Apply this filter to the input image data provided.
   *
   * Determines whether to use WebGL or Canvas2D based on the options.webgl flag.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be executed
   * @param {Boolean} options.webgl Whether to use webgl to render the filter.
   * @param {WebGLTexture} options.sourceTexture The texture setup as the source to be filtered.
   * @param {WebGLTexture} options.targetTexture The texture where filtered output should be drawn.
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  applyTo(t) {
    Ts(t) ? (this._setupFrameBuffer(t), this.applyToWebGL(t), this._swapTextures(t)) : this.applyTo2d(t);
  }
  applyTo2d(t) {
  }
  /**
   * Returns a string that represent the current selected shader code for the filter.
   * Used to force recompilation when parameters change or to retrieve the shader from cache
   * @type string
   **/
  getCacheKey() {
    return this.type;
  }
  /**
   * Retrieves the cached shader.
   * @param {Object} options
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   * @return {WebGLProgram} the compiled program shader
   */
  retrieveShader(t) {
    const e = this.getCacheKey();
    return t.programCache[e] || (t.programCache[e] = this.createProgram(t.context)), t.programCache[e];
  }
  /**
   * Apply this filter using webgl.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be executed
   * @param {Boolean} options.webgl Whether to use webgl to render the filter.
   * @param {WebGLTexture} options.originalTexture The texture of the original input image.
   * @param {WebGLTexture} options.sourceTexture The texture setup as the source to be filtered.
   * @param {WebGLTexture} options.targetTexture The texture where filtered output should be drawn.
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  applyToWebGL(t) {
    const e = t.context, s = this.retrieveShader(t);
    t.pass === 0 && t.originalTexture ? e.bindTexture(e.TEXTURE_2D, t.originalTexture) : e.bindTexture(e.TEXTURE_2D, t.sourceTexture), e.useProgram(s.program), this.sendAttributeData(e, s.attributeLocations, t.aPosition), e.uniform1f(s.uniformLocations.uStepW, 1 / t.sourceWidth), e.uniform1f(s.uniformLocations.uStepH, 1 / t.sourceHeight), this.sendUniformData(e, s.uniformLocations), e.viewport(0, 0, t.destinationWidth, t.destinationHeight), e.drawArrays(e.TRIANGLE_STRIP, 0, 4);
  }
  bindAdditionalTexture(t, e, s) {
    t.activeTexture(s), t.bindTexture(t.TEXTURE_2D, e), t.activeTexture(t.TEXTURE0);
  }
  unbindAdditionalTexture(t, e) {
    t.activeTexture(e), t.bindTexture(t.TEXTURE_2D, null), t.activeTexture(t.TEXTURE0);
  }
  /**
   * Send uniform data from this filter to its shader program on the GPU.
   *
   * Intended to be overridden by subclasses.
   *
   * @param {WebGLRenderingContext} _gl The canvas context used to compile the shader program.
   * @param {Object} _uniformLocations A map of shader uniform names to their locations.
   */
  sendUniformData(t, e) {
  }
  /**
   * If needed by a 2d filter, this functions can create an helper canvas to be used
   * remember that options.targetCanvas is available for use till end of chain.
   */
  createHelpLayer(t) {
    if (!t.helpLayer) {
      const { sourceWidth: e, sourceHeight: s } = t, i = rt({
        width: e,
        height: s
      });
      t.helpLayer = i;
    }
  }
  /**
   * Returns object representation of an instance
   * It will automatically export the default values of a filter,
   * stored in the static defaults property.
   * @return {Object} Object representation of an instance
   */
  toObject() {
    const t = Object.keys(
      this.constructor.defaults || {}
    );
    return {
      type: this.type,
      ...t.reduce((e, s) => (e[s] = this[s], e), {})
    };
  }
  /**
   * Returns a JSON representation of an instance
   * @return {Object} JSON
   */
  toJSON() {
    return this.toObject();
  }
  static async fromObject({ type: t, ...e }, s) {
    return new this(e);
  }
}
const ac = {
  multiply: `gl_FragColor.rgb *= uColor.rgb;
`,
  screen: `gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);
`,
  add: `gl_FragColor.rgb += uColor.rgb;
`,
  difference: `gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);
`,
  subtract: `gl_FragColor.rgb -= uColor.rgb;
`,
  lighten: `gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);
`,
  darken: `gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);
`,
  exclusion: `gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);
`,
  overlay: `
    if (uColor.r < 0.5) {
      gl_FragColor.r *= 2.0 * uColor.r;
    } else {
      gl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);
    }
    if (uColor.g < 0.5) {
      gl_FragColor.g *= 2.0 * uColor.g;
    } else {
      gl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);
    }
    if (uColor.b < 0.5) {
      gl_FragColor.b *= 2.0 * uColor.b;
    } else {
      gl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);
    }
    `,
  tint: `
    gl_FragColor.rgb *= (1.0 - uColor.a);
    gl_FragColor.rgb += uColor.rgb;
    `
}, hc = {
  color: "#F95C63",
  mode: "multiply",
  alpha: 1
};
class Nn extends $ {
  static defaults = hc;
  static type = "BlendColor";
  static uniformLocations = ["uColor"];
  getCacheKey() {
    return `${this.type}_${this.mode}`;
  }
  getFragmentSource() {
    return `
      precision highp float;
      uniform sampler2D uTexture;
      uniform vec4 uColor;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        gl_FragColor = color;
        if (color.a > 0.0) {
          ${ac[this.mode]}
        }
      }
      `;
  }
  /**
   * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data: t } }) {
    const e = new E(this.color).getSource(), s = this.alpha, i = e[0] * s, r = e[1] * s, o = e[2] * s, a = 1 - s;
    for (let h = 0; h < t.length; h += 4) {
      const l = t[h], c = t[h + 1], u = t[h + 2];
      let f, d, g;
      switch (this.mode) {
        case "multiply":
          f = l * i / 255, d = c * r / 255, g = u * o / 255;
          break;
        case "screen":
          f = 255 - (255 - l) * (255 - i) / 255, d = 255 - (255 - c) * (255 - r) / 255, g = 255 - (255 - u) * (255 - o) / 255;
          break;
        case "add":
          f = l + i, d = c + r, g = u + o;
          break;
        case "difference":
          f = Math.abs(l - i), d = Math.abs(c - r), g = Math.abs(u - o);
          break;
        case "subtract":
          f = l - i, d = c - r, g = u - o;
          break;
        case "darken":
          f = Math.min(l, i), d = Math.min(c, r), g = Math.min(u, o);
          break;
        case "lighten":
          f = Math.max(l, i), d = Math.max(c, r), g = Math.max(u, o);
          break;
        case "overlay":
          f = i < 128 ? 2 * l * i / 255 : 255 - 2 * (255 - l) * (255 - i) / 255, d = r < 128 ? 2 * c * r / 255 : 255 - 2 * (255 - c) * (255 - r) / 255, g = o < 128 ? 2 * u * o / 255 : 255 - 2 * (255 - u) * (255 - o) / 255;
          break;
        case "exclusion":
          f = i + l - 2 * i * l / 255, d = r + c - 2 * r * c / 255, g = o + u - 2 * o * u / 255;
          break;
        case "tint":
          f = i + l * a, d = r + c * a, g = o + u * a;
      }
      t[h] = f, t[h + 1] = d, t[h + 2] = g;
    }
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    const s = new E(this.color).getSource();
    s[0] = this.alpha * s[0] / 255, s[1] = this.alpha * s[1] / 255, s[2] = this.alpha * s[2] / 255, s[3] = this.alpha, t.uniform4fv(e.uColor, s);
  }
}
x.setClass(Nn);
const lc = {
  multiply: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform sampler2D uImage;
    uniform vec4 uColor;
    varying vec2 vTexCoord;
    varying vec2 vTexCoord2;
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      vec4 color2 = texture2D(uImage, vTexCoord2);
      color.rgba *= color2.rgba;
      gl_FragColor = color;
    }
    `,
  mask: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform sampler2D uImage;
    uniform vec4 uColor;
    varying vec2 vTexCoord;
    varying vec2 vTexCoord2;
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      vec4 color2 = texture2D(uImage, vTexCoord2);
      color.a = color2.a;
      gl_FragColor = color;
    }
    `
}, cc = `
    attribute vec2 aPosition;
    varying vec2 vTexCoord;
    varying vec2 vTexCoord2;
    uniform mat3 uTransformMatrix;
    void main() {
      vTexCoord = aPosition;
      vTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;
      gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
    }
    `, uc = {
  mode: "multiply",
  alpha: 1
};
class Un extends $ {
  static type = "BlendImage";
  static defaults = uc;
  static uniformLocations = ["uTransformMatrix", "uImage"];
  getCacheKey() {
    return `${this.type}_${this.mode}`;
  }
  getFragmentSource() {
    return lc[this.mode];
  }
  getVertexSource() {
    return cc;
  }
  applyToWebGL(t) {
    const e = t.context, s = this.createTexture(t.filterBackend, this.image);
    this.bindAdditionalTexture(e, s, e.TEXTURE1), super.applyToWebGL(t), this.unbindAdditionalTexture(e, e.TEXTURE1);
  }
  createTexture(t, e) {
    return t.getCachedTexture(e.cacheKey, e.getElement());
  }
  /**
   * Calculate a transformMatrix to adapt the image to blend over
   * @param {Object} options
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  calculateMatrix() {
    const t = this.image, { width: e, height: s } = t.getElement();
    return [
      1 / t.scaleX,
      0,
      0,
      0,
      1 / t.scaleY,
      0,
      -t.left / e,
      -t.top / s,
      1
    ];
  }
  /**
   * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({
    imageData: { data: t, width: e, height: s },
    filterBackend: { resources: i }
  }) {
    const r = this.image;
    i.blendImage || (i.blendImage = ut());
    const o = i.blendImage, a = o.getContext("2d");
    o.width !== e || o.height !== s ? (o.width = e, o.height = s) : a.clearRect(0, 0, e, s), a.setTransform(
      r.scaleX,
      0,
      0,
      r.scaleY,
      r.left,
      r.top
    ), a.drawImage(r.getElement(), 0, 0, e, s);
    const h = a.getImageData(0, 0, e, s).data;
    for (let l = 0; l < t.length; l += 4) {
      const c = t[l], u = t[l + 1], f = t[l + 2], d = t[l + 3], g = h[l], p = h[l + 1], _ = h[l + 2], y = h[l + 3];
      switch (this.mode) {
        case "multiply":
          t[l] = c * g / 255, t[l + 1] = u * p / 255, t[l + 2] = f * _ / 255, t[l + 3] = d * y / 255;
          break;
        case "mask":
          t[l + 3] = y;
          break;
      }
    }
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    const s = this.calculateMatrix();
    t.uniform1i(e.uImage, 1), t.uniformMatrix3fv(e.uTransformMatrix, !1, s);
  }
  /**
   * Returns object representation of an instance
   * TODO: Handle the possibility of missing image better.
   * As of now a BlendImage filter without image can't be used with fromObject
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return {
      ...super.toObject(),
      image: this.image && this.image.toObject()
    };
  }
  /**
   * Create filter instance from an object representation
   * @param {object} object Object to create an instance from
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting image loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<BlendImage>}
   */
  static async fromObject({ type: t, image: e, ...s }, i) {
    return qt.fromObject(e, i).then(
      (r) => new this({ ...s, image: r })
    );
  }
}
x.setClass(Un);
const fc = `
    precision highp float;
    uniform sampler2D uTexture;
    uniform vec2 uDelta;
    varying vec2 vTexCoord;
    const float nSamples = 15.0;
    vec3 v3offset = vec3(12.9898, 78.233, 151.7182);
    float random(vec3 scale) {
      /* use the fragment position for a different seed per-pixel */
      return fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);
    }
    void main() {
      vec4 color = vec4(0.0);
      float totalC = 0.0;
      float totalA = 0.0;
      float offset = random(v3offset);
      for (float t = -nSamples; t <= nSamples; t++) {
        float percent = (t + offset - 0.5) / nSamples;
        vec4 sample = texture2D(uTexture, vTexCoord + uDelta * percent);
        float weight = 1.0 - abs(percent);
        float alpha = weight * sample.a;
        color.rgb += sample.rgb * alpha;
        color.a += alpha;
        totalA += weight;
        totalC += alpha;
      }
      gl_FragColor.rgb = color.rgb / totalC;
      gl_FragColor.a = color.a / totalA;
    }
  `, dc = {
  blur: 0
};
class qn extends $ {
  static type = "Blur";
  static defaults = dc;
  static uniformLocations = ["uDelta"];
  getFragmentSource() {
    return fc;
  }
  applyTo(t) {
    Ts(t) ? (this.aspectRatio = t.sourceWidth / t.sourceHeight, t.passes++, this._setupFrameBuffer(t), this.horizontal = !0, this.applyToWebGL(t), this._swapTextures(t), this._setupFrameBuffer(t), this.horizontal = !1, this.applyToWebGL(t), this._swapTextures(t)) : this.applyTo2d(t);
  }
  applyTo2d({ imageData: { data: t, width: e, height: s } }) {
    this.aspectRatio = e / s, this.horizontal = !0;
    let i = this.getBlurValue() * e;
    const r = new Uint8ClampedArray(t), o = 15, a = 4 * e;
    for (let h = 0; h < t.length; h += 4) {
      let l = 0, c = 0, u = 0, f = 0, d = 0;
      const g = h - h % a, p = g + a;
      for (let _ = -o + 1; _ < o; _++) {
        const y = _ / o, v = Math.floor(i * y) * 4, S = 1 - Math.abs(y);
        let C = h + v;
        C < g ? C = g : C > p && (C = p);
        const w = t[C + 3] * S;
        l += t[C] * w, c += t[C + 1] * w, u += t[C + 2] * w, f += w, d += S;
      }
      r[h] = l / f, r[h + 1] = c / f, r[h + 2] = u / f, r[h + 3] = f / d;
    }
    this.horizontal = !1, i = this.getBlurValue() * s;
    for (let h = 0; h < r.length; h += 4) {
      let l = 0, c = 0, u = 0, f = 0, d = 0;
      const g = h % a, p = r.length - a + g;
      for (let _ = -o + 1; _ < o; _++) {
        const y = _ / o, v = Math.floor(i * y) * a, S = 1 - Math.abs(y);
        let C = h + v;
        C < g ? C = g : C > p && (C = p);
        const w = r[C + 3] * S;
        l += r[C] * w, c += r[C + 1] * w, u += r[C + 2] * w, f += w, d += S;
      }
      t[h] = l / f, t[h + 1] = c / f, t[h + 2] = u / f, t[h + 3] = f / d;
    }
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    const s = this.chooseRightDelta();
    t.uniform2fv(e.uDelta, s);
  }
  isNeutralState() {
    return this.blur === 0;
  }
  getBlurValue() {
    let t = 1;
    const { horizontal: e, aspectRatio: s } = this;
    return e ? s > 1 && (t = 1 / s) : s < 1 && (t = s), t * this.blur * 0.12;
  }
  /**
   * choose right value of image percentage to blur with
   * @returns {Array} a numeric array with delta values
   */
  chooseRightDelta() {
    const t = this.getBlurValue();
    return this.horizontal ? [t, 0] : [0, t];
  }
}
x.setClass(qn);
const gc = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uBrightness;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    color.rgb += uBrightness;
    gl_FragColor = color;
  }
`, pc = {
  brightness: 0
};
class Kn extends $ {
  static type = "Brightness";
  static defaults = pc;
  static uniformLocations = ["uBrightness"];
  getFragmentSource() {
    return gc;
  }
  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data: t } }) {
    const e = Math.round(this.brightness * 255);
    for (let s = 0; s < t.length; s += 4)
      t[s] += e, t[s + 1] += e, t[s + 2] += e;
  }
  isNeutralState() {
    return this.brightness === 0;
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform1f(e.uBrightness, this.brightness);
  }
}
x.setClass(Kn);
const mc = `
  precision highp float;
  uniform sampler2D uTexture;
  varying vec2 vTexCoord;
  uniform mat4 uColorMatrix;
  uniform vec4 uConstants;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    color *= uColorMatrix;
    color += uConstants;
    gl_FragColor = color;
  }`, Jn = {
  matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  colorsOnly: !0
};
class Os extends $ {
  static type = "ColorMatrix";
  static defaults = Jn;
  static uniformLocations = ["uColorMatrix", "uConstants"];
  getFragmentSource() {
    return mc;
  }
  /**
   * Apply the ColorMatrix operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d(t) {
    const e = t.imageData, s = e.data, i = this.matrix, r = this.colorsOnly;
    for (let o = 0; o < s.length; o += 4) {
      const a = s[o], h = s[o + 1], l = s[o + 2];
      if (s[o] = a * i[0] + h * i[1] + l * i[2] + i[4] * 255, s[o + 1] = a * i[5] + h * i[6] + l * i[7] + i[9] * 255, s[o + 2] = a * i[10] + h * i[11] + l * i[12] + i[14] * 255, !r) {
        const c = s[o + 3];
        s[o] += c * i[3], s[o + 1] += c * i[8], s[o + 2] += c * i[13], s[o + 3] = a * i[15] + h * i[16] + l * i[17] + c * i[18] + i[19] * 255;
      }
    }
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    const s = this.matrix, i = [
      s[0],
      s[1],
      s[2],
      s[3],
      s[5],
      s[6],
      s[7],
      s[8],
      s[10],
      s[11],
      s[12],
      s[13],
      s[15],
      s[16],
      s[17],
      s[18]
    ], r = [s[4], s[9], s[14], s[19]];
    t.uniformMatrix4fv(e.uColorMatrix, !1, i), t.uniform4fv(e.uConstants, r);
  }
  toObject() {
    return {
      ...super.toObject(),
      matrix: [...this.matrix]
    };
  }
}
x.setClass(Os);
function Zt(n, t) {
  const e = class extends Os {
    static type = n;
    static defaults = {
      colorsOnly: !1,
      matrix: t
    };
    toObject() {
      return { type: this.type, colorsOnly: this.colorsOnly };
    }
  };
  return x.setClass(e, n), e;
}
const _c = Zt(
  "Brownie",
  [
    0.5997,
    0.34553,
    -0.27082,
    0,
    0.186,
    -0.0377,
    0.86095,
    0.15059,
    0,
    -0.1449,
    0.24113,
    -0.07441,
    0.44972,
    0,
    -0.02965,
    0,
    0,
    0,
    1,
    0
  ]
), yc = Zt(
  "Vintage",
  [
    0.62793,
    0.32021,
    -0.03965,
    0,
    0.03784,
    0.02578,
    0.64411,
    0.03259,
    0,
    0.02926,
    0.0466,
    -0.08512,
    0.52416,
    0,
    0.02023,
    0,
    0,
    0,
    1,
    0
  ]
), vc = Zt(
  "Kodachrome",
  [
    1.12855,
    -0.39673,
    -0.03992,
    0,
    0.24991,
    -0.16404,
    1.08352,
    -0.05498,
    0,
    0.09698,
    -0.16786,
    -0.56034,
    1.60148,
    0,
    0.13972,
    0,
    0,
    0,
    1,
    0
  ]
), Cc = Zt(
  "Technicolor",
  [
    1.91252,
    -0.85453,
    -0.09155,
    0,
    0.04624,
    -0.30878,
    1.76589,
    -0.10601,
    0,
    -0.27589,
    -0.2311,
    -0.75018,
    1.84759,
    0,
    0.12137,
    0,
    0,
    0,
    1,
    0
  ]
), Sc = Zt(
  "Polaroid",
  [
    1.438,
    -0.062,
    -0.062,
    0,
    0,
    -0.122,
    1.378,
    -0.122,
    0,
    0,
    -0.016,
    -0.016,
    1.483,
    0,
    0,
    0,
    0,
    0,
    1,
    0
  ]
), wc = Zt(
  "Sepia",
  [
    0.393,
    0.769,
    0.189,
    0,
    0,
    0.349,
    0.686,
    0.168,
    0,
    0,
    0.272,
    0.534,
    0.131,
    0,
    0,
    0,
    0,
    0,
    1,
    0
  ]
), xc = Zt(
  "BlackWhite",
  [
    1.5,
    1.5,
    1.5,
    0,
    -1,
    1.5,
    1.5,
    1.5,
    0,
    -1,
    1.5,
    1.5,
    1.5,
    0,
    -1,
    0,
    0,
    0,
    1,
    0
  ]
);
class Qn extends $ {
  static type = "Composed";
  constructor(t = {}) {
    super(t), this.subFilters = t.subFilters || [];
  }
  /**
   * Apply this container's filters to the input image provided.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be applied.
   */
  applyTo(t) {
    Ts(t) && (t.passes += this.subFilters.length - 1), this.subFilters.forEach((e) => {
      e.applyTo(t);
    });
  }
  /**
   * Serialize this filter into JSON.
   * @returns {Object} A JSON representation of this filter.
   */
  toObject() {
    return {
      type: this.type,
      subFilters: this.subFilters.map((t) => t.toObject())
    };
  }
  isNeutralState() {
    return !this.subFilters.some((t) => !t.isNeutralState());
  }
  /**
   * Deserialize a JSON definition of a ComposedFilter into a concrete instance.
   * @param {oject} object Object to create an instance from
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting `BlendImage` filter loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<Composed>}
   */
  static fromObject(t, e) {
    return Promise.all(
      (t.subFilters || []).map(
        (s) => x.getClass(s.type).fromObject(s, e)
      )
    ).then((s) => new this({ subFilters: s }));
  }
}
x.setClass(Qn);
const bc = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uContrast;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    float contrastF = 1.015 * (uContrast + 1.0) / (1.0 * (1.015 - uContrast));
    color.rgb = contrastF * (color.rgb - 0.5) + 0.5;
    gl_FragColor = color;
  }`, Tc = {
  contrast: 0
};
class Zn extends $ {
  static type = "Contrast";
  static defaults = Tc;
  static uniformLocations = ["uContrast"];
  getFragmentSource() {
    return bc;
  }
  isNeutralState() {
    return this.contrast === 0;
  }
  /**
   * Apply the Contrast operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d({ imageData: { data: t } }) {
    const e = Math.floor(this.contrast * 255), s = 259 * (e + 255) / (255 * (259 - e));
    for (let i = 0; i < t.length; i += 4)
      t[i] = s * (t[i] - 128) + 128, t[i + 1] = s * (t[i + 1] - 128) + 128, t[i + 2] = s * (t[i + 2] - 128) + 128;
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform1f(e.uContrast, this.contrast);
  }
}
x.setClass(Zn);
const Oc = {
  Convolute_3_1: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[9];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 0);
      for (float h = 0.0; h < 3.0; h+=1.0) {
        for (float w = 0.0; w < 3.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 1), uStepH * (h - 1));
          color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 3.0 + w)];
        }
      }
      gl_FragColor = color;
    }
    `,
  Convolute_3_0: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[9];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 1);
      for (float h = 0.0; h < 3.0; h+=1.0) {
        for (float w = 0.0; w < 3.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 1.0), uStepH * (h - 1.0));
          color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 3.0 + w)];
        }
      }
      float alpha = texture2D(uTexture, vTexCoord).a;
      gl_FragColor = color;
      gl_FragColor.a = alpha;
    }
    `,
  Convolute_5_1: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[25];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 0);
      for (float h = 0.0; h < 5.0; h+=1.0) {
        for (float w = 0.0; w < 5.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));
          color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 5.0 + w)];
        }
      }
      gl_FragColor = color;
    }
    `,
  Convolute_5_0: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[25];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 1);
      for (float h = 0.0; h < 5.0; h+=1.0) {
        for (float w = 0.0; w < 5.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));
          color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 5.0 + w)];
        }
      }
      float alpha = texture2D(uTexture, vTexCoord).a;
      gl_FragColor = color;
      gl_FragColor.a = alpha;
    }
    `,
  Convolute_7_1: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[49];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 0);
      for (float h = 0.0; h < 7.0; h+=1.0) {
        for (float w = 0.0; w < 7.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));
          color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 7.0 + w)];
        }
      }
      gl_FragColor = color;
    }
    `,
  Convolute_7_0: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[49];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 1);
      for (float h = 0.0; h < 7.0; h+=1.0) {
        for (float w = 0.0; w < 7.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));
          color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 7.0 + w)];
        }
      }
      float alpha = texture2D(uTexture, vTexCoord).a;
      gl_FragColor = color;
      gl_FragColor.a = alpha;
    }
    `,
  Convolute_9_1: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[81];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 0);
      for (float h = 0.0; h < 9.0; h+=1.0) {
        for (float w = 0.0; w < 9.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));
          color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 9.0 + w)];
        }
      }
      gl_FragColor = color;
    }
    `,
  Convolute_9_0: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[81];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 1);
      for (float h = 0.0; h < 9.0; h+=1.0) {
        for (float w = 0.0; w < 9.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));
          color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 9.0 + w)];
        }
      }
      float alpha = texture2D(uTexture, vTexCoord).a;
      gl_FragColor = color;
      gl_FragColor.a = alpha;
    }
    `
}, Dc = {
  opaque: !1,
  matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0]
};
class to extends $ {
  static type = "Convolute";
  static defaults = Dc;
  static uniformLocations = ["uMatrix", "uOpaque", "uHalfSize", "uSize"];
  getCacheKey() {
    return `${this.type}_${Math.sqrt(this.matrix.length)}_${this.opaque ? 1 : 0}`;
  }
  getFragmentSource() {
    return Oc[this.getCacheKey()];
  }
  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(t) {
    const e = t.imageData, s = e.data, i = this.matrix, r = Math.round(Math.sqrt(i.length)), o = Math.floor(r / 2), a = e.width, h = e.height, l = t.ctx.createImageData(a, h), c = l.data, u = this.opaque ? 1 : 0;
    let f, d, g, p, _, y, v, S, C, w, b, D, O;
    for (b = 0; b < h; b++)
      for (w = 0; w < a; w++) {
        for (_ = (b * a + w) * 4, f = 0, d = 0, g = 0, p = 0, O = 0; O < r; O++)
          for (D = 0; D < r; D++)
            v = b + O - o, y = w + D - o, !(v < 0 || v >= h || y < 0 || y >= a) && (S = (v * a + y) * 4, C = i[O * r + D], f += s[S] * C, d += s[S + 1] * C, g += s[S + 2] * C, u || (p += s[S + 3] * C));
        c[_] = f, c[_ + 1] = d, c[_ + 2] = g, u ? c[_ + 3] = s[_ + 3] : c[_ + 3] = p;
      }
    t.imageData = l;
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform1fv(e.uMatrix, this.matrix);
  }
  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return {
      ...super.toObject(),
      opaque: this.opaque,
      matrix: [...this.matrix]
    };
  }
}
x.setClass(to);
const kc = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec3 uGamma;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    vec3 correction = (1.0 / uGamma);
    color.r = pow(color.r, correction.r);
    color.g = pow(color.g, correction.g);
    color.b = pow(color.b, correction.b);
    gl_FragColor = color;
    gl_FragColor.rgb *= color.a;
  }
`, gr = "Gamma", Mc = {
  gamma: [1, 1, 1]
};
class eo extends $ {
  static type = gr;
  static defaults = Mc;
  static uniformLocations = ["uGamma"];
  getFragmentSource() {
    return kc;
  }
  constructor(t = {}) {
    super(t), this.gamma = t.gamma || this.constructor.defaults.gamma.concat();
  }
  /**
   * Apply the Gamma operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d({ imageData: { data: t } }) {
    const e = this.gamma, s = 1 / e[0], i = 1 / e[1], r = 1 / e[2];
    this.rgbValues || (this.rgbValues = {
      r: new Uint8Array(256),
      g: new Uint8Array(256),
      b: new Uint8Array(256)
    });
    const o = this.rgbValues;
    for (let a = 0; a < 256; a++)
      o.r[a] = Math.pow(a / 255, s) * 255, o.g[a] = Math.pow(a / 255, i) * 255, o.b[a] = Math.pow(a / 255, r) * 255;
    for (let a = 0; a < t.length; a += 4)
      t[a] = o.r[t[a]], t[a + 1] = o.g[t[a + 1]], t[a + 2] = o.b[t[a + 2]];
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform3fv(e.uGamma, this.gamma);
  }
  isNeutralState() {
    const { gamma: t } = this;
    return t[0] === 1 && t[1] === 1 && t[2] === 1;
  }
  toObject() {
    return {
      type: gr,
      gamma: this.gamma.concat()
    };
  }
}
x.setClass(eo);
const Pc = {
  average: `
    precision highp float;
    uniform sampler2D uTexture;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      float average = (color.r + color.b + color.g) / 3.0;
      gl_FragColor = vec4(average, average, average, color.a);
    }
    `,
  lightness: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform int uMode;
    varying vec2 vTexCoord;
    void main() {
      vec4 col = texture2D(uTexture, vTexCoord);
      float average = (max(max(col.r, col.g),col.b) + min(min(col.r, col.g),col.b)) / 2.0;
      gl_FragColor = vec4(average, average, average, col.a);
    }
    `,
  luminosity: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform int uMode;
    varying vec2 vTexCoord;
    void main() {
      vec4 col = texture2D(uTexture, vTexCoord);
      float average = 0.21 * col.r + 0.72 * col.g + 0.07 * col.b;
      gl_FragColor = vec4(average, average, average, col.a);
    }
    `
}, Ec = {
  mode: "average"
};
class so extends $ {
  static type = "Grayscale";
  static defaults = Ec;
  static uniformLocations = ["uMode"];
  /**
   * Apply the Grayscale operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d({ imageData: { data: t } }) {
    for (let e = 0, s; e < t.length; e += 4) {
      const i = t[e], r = t[e + 1], o = t[e + 2];
      switch (this.mode) {
        case "average":
          s = (i + r + o) / 3;
          break;
        case "lightness":
          s = (Math.min(i, r, o) + Math.max(i, r, o)) / 2;
          break;
        case "luminosity":
          s = 0.21 * i + 0.72 * r + 0.07 * o;
          break;
      }
      t[e + 2] = t[e + 1] = t[e] = s;
    }
  }
  getCacheKey() {
    return `${this.type}_${this.mode}`;
  }
  getFragmentSource() {
    return Pc[this.mode];
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform1i(e.uMode, 1);
  }
  /**
   * Grayscale filter isNeutralState implementation
   * The filter is never neutral
   * on the image
   **/
  isNeutralState() {
    return !1;
  }
}
x.setClass(so);
const Ac = {
  ...Jn,
  rotation: 0
};
class io extends Os {
  static type = "HueRotation";
  static defaults = Ac;
  calculateMatrix() {
    const t = this.rotation * Math.PI, e = vt(t), s = Ct(t), i = 1 / 3, r = Math.sqrt(i) * s, o = 1 - e;
    this.matrix = [
      e + o / 3,
      i * o - r,
      i * o + r,
      0,
      0,
      i * o + r,
      e + i * o,
      i * o - r,
      0,
      0,
      i * o - r,
      i * o + r,
      e + i * o,
      0,
      0,
      0,
      0,
      0,
      1,
      0
    ];
  }
  isNeutralState() {
    return this.rotation === 0;
  }
  applyTo(t) {
    this.calculateMatrix(), super.applyTo(t);
  }
  toObject() {
    return {
      type: this.type,
      rotation: this.rotation
    };
  }
}
x.setClass(io);
const Fc = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform int uInvert;
  uniform int uAlpha;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    if (uInvert == 1) {
      if (uAlpha == 1) {
        gl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,1.0 -color.a);
      } else {
        gl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);
      }
    } else {
      gl_FragColor = color;
    }
  }
`, Lc = {
  alpha: !1,
  invert: !0
};
class ro extends $ {
  static type = "Invert";
  static defaults = Lc;
  static uniformLocations = ["uInvert", "uAlpha"];
  /**
   * Apply the Invert operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d({ imageData: { data: t } }) {
    for (let e = 0; e < t.length; e += 4)
      t[e] = 255 - t[e], t[e + 1] = 255 - t[e + 1], t[e + 2] = 255 - t[e + 2], this.alpha && (t[e + 3] = 255 - t[e + 3]);
  }
  getFragmentSource() {
    return Fc;
  }
  /**
   * Invert filter isNeutralState implementation
   * Used only in image applyFilters to discard filters that will not have an effect
   * on the image
   * @param {Object} options
   **/
  isNeutralState() {
    return !this.invert;
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform1i(e.uInvert, Number(this.invert)), t.uniform1i(e.uAlpha, Number(this.alpha));
  }
}
x.setClass(ro);
const Rc = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uStepH;
  uniform float uNoise;
  uniform float uSeed;
  varying vec2 vTexCoord;
  float rand(vec2 co, float seed, float vScale) {
    return fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);
  }
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    color.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;
    gl_FragColor = color;
  }
`, jc = {
  noise: 0
};
class no extends $ {
  static type = "Noise";
  static defaults = jc;
  static uniformLocations = ["uNoise", "uSeed"];
  getFragmentSource() {
    return Rc;
  }
  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data: t } }) {
    const e = this.noise;
    for (let s = 0; s < t.length; s += 4) {
      const i = (0.5 - Math.random()) * e;
      t[s] += i, t[s + 1] += i, t[s + 2] += i;
    }
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform1f(e.uNoise, this.noise / 255), t.uniform1f(e.uSeed, Math.random());
  }
  isNeutralState() {
    return this.noise === 0;
  }
}
x.setClass(no);
const Bc = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uBlocksize;
  uniform float uStepW;
  uniform float uStepH;
  varying vec2 vTexCoord;
  void main() {
    float blockW = uBlocksize * uStepW;
    float blockH = uBlocksize * uStepH;
    int posX = int(vTexCoord.x / blockW);
    int posY = int(vTexCoord.y / blockH);
    float fposX = float(posX);
    float fposY = float(posY);
    vec2 squareCoords = vec2(fposX * blockW, fposY * blockH);
    vec4 color = texture2D(uTexture, squareCoords);
    gl_FragColor = color;
  }
`, Ic = {
  blocksize: 4
};
class oo extends $ {
  static type = "Pixelate";
  static defaults = Ic;
  static uniformLocations = ["uBlocksize"];
  /**
   * Apply the Pixelate operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data: t, width: e, height: s } }) {
    for (let i = 0; i < s; i += this.blocksize)
      for (let r = 0; r < e; r += this.blocksize) {
        const o = i * 4 * e + r * 4, a = t[o], h = t[o + 1], l = t[o + 2], c = t[o + 3];
        for (let u = i; u < Math.min(i + this.blocksize, s); u++)
          for (let f = r; f < Math.min(r + this.blocksize, e); f++) {
            const d = u * 4 * e + f * 4;
            t[d] = a, t[d + 1] = h, t[d + 2] = l, t[d + 3] = c;
          }
      }
  }
  /**
   * Indicate when the filter is not gonna apply changes to the image
   **/
  isNeutralState() {
    return this.blocksize === 1;
  }
  getFragmentSource() {
    return Bc;
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform1f(e.uBlocksize, this.blocksize);
  }
}
x.setClass(oo);
const Yc = `
precision highp float;
uniform sampler2D uTexture;
uniform vec4 uLow;
uniform vec4 uHigh;
varying vec2 vTexCoord;
void main() {
  gl_FragColor = texture2D(uTexture, vTexCoord);
  if(all(greaterThan(gl_FragColor.rgb,uLow.rgb)) && all(greaterThan(uHigh.rgb,gl_FragColor.rgb))) {
    gl_FragColor.a = 0.0;
  }
}
`, Vc = {
  color: "#FFFFFF",
  distance: 0.02,
  useAlpha: !1
};
class ao extends $ {
  static type = "RemoveColor";
  static defaults = Vc;
  static uniformLocations = ["uLow", "uHigh"];
  getFragmentSource() {
    return Yc;
  }
  /**
   * Applies filter to canvas element
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo2d({ imageData: { data: t } }) {
    const e = this.distance * 255, s = new E(this.color).getSource(), i = [s[0] - e, s[1] - e, s[2] - e], r = [
      s[0] + e,
      s[1] + e,
      s[2] + e
    ];
    for (let o = 0; o < t.length; o += 4) {
      const a = t[o], h = t[o + 1], l = t[o + 2];
      a > i[0] && h > i[1] && l > i[2] && a < r[0] && h < r[1] && l < r[2] && (t[o + 3] = 0);
    }
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    const s = new E(this.color).getSource(), i = this.distance, r = [
      0 + s[0] / 255 - i,
      0 + s[1] / 255 - i,
      0 + s[2] / 255 - i,
      1
    ], o = [
      s[0] / 255 + i,
      s[1] / 255 + i,
      s[2] / 255 + i,
      1
    ];
    t.uniform4fv(e.uLow, r), t.uniform4fv(e.uHigh, o);
  }
}
x.setClass(ao);
const Xc = {
  resizeType: "hermite",
  scaleX: 1,
  scaleY: 1,
  lanczosLobes: 3
};
class ho extends $ {
  static type = "Resize";
  static defaults = Xc;
  static uniformLocations = ["uDelta", "uTaps"];
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform2fv(
      e.uDelta,
      this.horizontal ? [1 / this.width, 0] : [0, 1 / this.height]
    ), t.uniform1fv(e.uTaps, this.taps);
  }
  getFilterWindow() {
    const t = this.tempScale;
    return Math.ceil(this.lanczosLobes / t);
  }
  getCacheKey() {
    const t = this.getFilterWindow();
    return `${this.type}_${t}`;
  }
  getFragmentSource() {
    const t = this.getFilterWindow();
    return this.generateShader(t);
  }
  getTaps() {
    const t = this.lanczosCreate(this.lanczosLobes), e = this.tempScale, s = this.getFilterWindow(), i = new Array(s);
    for (let r = 1; r <= s; r++)
      i[r - 1] = t(r * e);
    return i;
  }
  /**
   * Generate vertex and shader sources from the necessary steps numbers
   * @param {Number} filterWindow
   */
  generateShader(t) {
    const e = new Array(t);
    for (let s = 1; s <= t; s++)
      e[s - 1] = `${s}.0 * uDelta`;
    return `
      precision highp float;
      uniform sampler2D uTexture;
      uniform vec2 uDelta;
      varying vec2 vTexCoord;
      uniform float uTaps[${t}];
      void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        float sum = 1.0;
        ${e.map(
      (s, i) => `
              color += texture2D(uTexture, vTexCoord + ${s}) * uTaps[${i}] + texture2D(uTexture, vTexCoord - ${s}) * uTaps[${i}];
              sum += 2.0 * uTaps[${i}];
            `
    ).join(`
`)}
        gl_FragColor = color / sum;
      }
    `;
  }
  applyToForWebgl(t) {
    t.passes++, this.width = t.sourceWidth, this.horizontal = !0, this.dW = Math.round(this.width * this.scaleX), this.dH = t.sourceHeight, this.tempScale = this.dW / this.width, this.taps = this.getTaps(), t.destinationWidth = this.dW, super.applyTo(t), t.sourceWidth = t.destinationWidth, this.height = t.sourceHeight, this.horizontal = !1, this.dH = Math.round(this.height * this.scaleY), this.tempScale = this.dH / this.height, this.taps = this.getTaps(), t.destinationHeight = this.dH, super.applyTo(t), t.sourceHeight = t.destinationHeight;
  }
  /**
   * Apply the resize filter to the image
   * Determines whether to use WebGL or Canvas2D based on the options.webgl flag.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be executed
   * @param {Boolean} options.webgl Whether to use webgl to render the filter.
   * @param {WebGLTexture} options.sourceTexture The texture setup as the source to be filtered.
   * @param {WebGLTexture} options.targetTexture The texture where filtered output should be drawn.
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  applyTo(t) {
    Ts(t) ? this.applyToForWebgl(t) : this.applyTo2d(t);
  }
  isNeutralState() {
    return this.scaleX === 1 && this.scaleY === 1;
  }
  lanczosCreate(t) {
    return (e) => {
      if (e >= t || e <= -t)
        return 0;
      if (e < 11920929e-14 && e > -11920929e-14)
        return 1;
      e *= Math.PI;
      const s = e / t;
      return Math.sin(e) / e * Math.sin(s) / s;
    };
  }
  applyTo2d(t) {
    const e = t.imageData, s = this.scaleX, i = this.scaleY;
    this.rcpScaleX = 1 / s, this.rcpScaleY = 1 / i;
    const r = e.width, o = e.height, a = Math.round(r * s), h = Math.round(o * i);
    let l;
    this.resizeType === "sliceHack" ? l = this.sliceByTwo(t, r, o, a, h) : this.resizeType === "hermite" ? l = this.hermiteFastResize(t, r, o, a, h) : this.resizeType === "bilinear" ? l = this.bilinearFiltering(t, r, o, a, h) : this.resizeType === "lanczos" ? l = this.lanczosResize(t, r, o, a, h) : l = new ImageData(a, h), t.imageData = l;
  }
  /**
   * Filter sliceByTwo
   * @param {Object} canvasEl Canvas element to apply filter to
   * @param {Number} oW Original Width
   * @param {Number} oH Original Height
   * @param {Number} dW Destination Width
   * @param {Number} dH Destination Height
   * @returns {ImageData}
   */
  sliceByTwo(t, e, s, i, r) {
    const o = t.imageData, a = 0.5;
    let h = !1, l = !1, c = e * a, u = s * a;
    const f = t.filterBackend.resources;
    let d = 0, g = 0;
    const p = e;
    let _ = 0;
    f.sliceByTwo || (f.sliceByTwo = ut());
    const y = f.sliceByTwo;
    (y.width < e * 1.5 || y.height < s) && (y.width = e * 1.5, y.height = s);
    const v = y.getContext("2d");
    for (v.clearRect(0, 0, e * 1.5, s), v.putImageData(o, 0, 0), i = Math.floor(i), r = Math.floor(r); !h || !l; )
      e = c, s = u, i < Math.floor(c * a) ? c = Math.floor(c * a) : (c = i, h = !0), r < Math.floor(u * a) ? u = Math.floor(u * a) : (u = r, l = !0), v.drawImage(y, d, g, e, s, p, _, c, u), d = p, g = _, _ += u;
    return v.getImageData(d, g, i, r);
  }
  /**
   * Filter lanczosResize
   * @param {Object} canvasEl Canvas element to apply filter to
   * @param {Number} oW Original Width
   * @param {Number} oH Original Height
   * @param {Number} dW Destination Width
   * @param {Number} dH Destination Height
   * @returns {ImageData}
   */
  lanczosResize(t, e, s, i, r) {
    function o(C) {
      let w, b, D, O, A, W, Z, R, N, k, L;
      for (v.x = (C + 0.5) * u, S.x = Math.floor(v.x), w = 0; w < r; w++) {
        for (v.y = (w + 0.5) * f, S.y = Math.floor(v.y), A = 0, W = 0, Z = 0, R = 0, N = 0, b = S.x - p; b <= S.x + p; b++)
          if (!(b < 0 || b >= e)) {
            k = Math.floor(1e3 * Math.abs(b - v.x)), y[k] || (y[k] = {});
            for (let tt = S.y - _; tt <= S.y + _; tt++)
              tt < 0 || tt >= s || (L = Math.floor(1e3 * Math.abs(tt - v.y)), y[k][L] || (y[k][L] = c(
                Math.sqrt(
                  Math.pow(k * d, 2) + Math.pow(L * g, 2)
                ) / 1e3
              )), D = y[k][L], D > 0 && (O = (tt * e + b) * 4, A += D, W += D * a[O], Z += D * a[O + 1], R += D * a[O + 2], N += D * a[O + 3]));
          }
        O = (w * i + C) * 4, l[O] = W / A, l[O + 1] = Z / A, l[O + 2] = R / A, l[O + 3] = N / A;
      }
      return ++C < i ? o(C) : h;
    }
    const a = t.imageData.data, h = t.ctx.createImageData(i, r), l = h.data, c = this.lanczosCreate(this.lanczosLobes), u = this.rcpScaleX, f = this.rcpScaleY, d = 2 / this.rcpScaleX, g = 2 / this.rcpScaleY, p = Math.ceil(u * this.lanczosLobes / 2), _ = Math.ceil(f * this.lanczosLobes / 2), y = {}, v = { x: 0, y: 0 }, S = { x: 0, y: 0 };
    return o(0);
  }
  /**
   * bilinearFiltering
   * @param {Object} canvasEl Canvas element to apply filter to
   * @param {Number} oW Original Width
   * @param {Number} oH Original Height
   * @param {Number} dW Destination Width
   * @param {Number} dH Destination Height
   * @returns {ImageData}
   */
  bilinearFiltering(t, e, s, i, r) {
    let o, a, h, l, c, u, f, d, g, p, _, y, v = 0, S;
    const C = this.rcpScaleX, w = this.rcpScaleY, b = 4 * (e - 1), O = t.imageData.data, A = t.ctx.createImageData(i, r), W = A.data;
    for (f = 0; f < r; f++)
      for (d = 0; d < i; d++)
        for (c = Math.floor(C * d), u = Math.floor(w * f), g = C * d - c, p = w * f - u, S = 4 * (u * e + c), _ = 0; _ < 4; _++)
          o = O[S + _], a = O[S + 4 + _], h = O[S + b + _], l = O[S + b + 4 + _], y = o * (1 - g) * (1 - p) + a * g * (1 - p) + h * p * (1 - g) + l * g * p, W[v++] = y;
    return A;
  }
  /**
   * hermiteFastResize
   * @param {Object} canvasEl Canvas element to apply filter to
   * @param {Number} oW Original Width
   * @param {Number} oH Original Height
   * @param {Number} dW Destination Width
   * @param {Number} dH Destination Height
   * @returns {ImageData}
   */
  hermiteFastResize(t, e, s, i, r) {
    const o = this.rcpScaleX, a = this.rcpScaleY, h = Math.ceil(o / 2), l = Math.ceil(a / 2), c = t.imageData, u = c.data, f = t.ctx.createImageData(i, r), d = f.data;
    for (let g = 0; g < r; g++)
      for (let p = 0; p < i; p++) {
        const _ = (p + g * i) * 4;
        let y = 0, v = 0, S = 0, C = 0, w = 0, b = 0, D = 0;
        const O = (g + 0.5) * a;
        for (let A = Math.floor(g * a); A < (g + 1) * a; A++) {
          const W = Math.abs(O - (A + 0.5)) / l, Z = (p + 0.5) * o, R = W * W;
          for (let N = Math.floor(p * o); N < (p + 1) * o; N++) {
            let k = Math.abs(Z - (N + 0.5)) / h;
            const L = Math.sqrt(R + k * k);
            L > 1 && L < -1 || (y = 2 * L * L * L - 3 * L * L + 1, y > 0 && (k = 4 * (N + A * e), D += y * u[k + 3], S += y, u[k + 3] < 255 && (y = y * u[k + 3] / 250), C += y * u[k], w += y * u[k + 1], b += y * u[k + 2], v += y));
          }
        }
        d[_] = C / v, d[_ + 1] = w / v, d[_ + 2] = b / v, d[_ + 3] = D / S;
      }
    return f;
  }
}
x.setClass(ho);
const $c = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uSaturation;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    float rgMax = max(color.r, color.g);
    float rgbMax = max(rgMax, color.b);
    color.r += rgbMax != color.r ? (rgbMax - color.r) * uSaturation : 0.00;
    color.g += rgbMax != color.g ? (rgbMax - color.g) * uSaturation : 0.00;
    color.b += rgbMax != color.b ? (rgbMax - color.b) * uSaturation : 0.00;
    gl_FragColor = color;
  }
`, Wc = {
  saturation: 0
};
class lo extends $ {
  static type = "Saturation";
  static defaults = Wc;
  static uniformLocations = ["uSaturation"];
  getFragmentSource() {
    return $c;
  }
  /**
   * Apply the Saturation operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data: t } }) {
    const e = -this.saturation;
    for (let s = 0; s < t.length; s += 4) {
      const i = t[s], r = t[s + 1], o = t[s + 2], a = Math.max(i, r, o);
      t[s] += a !== i ? (a - i) * e : 0, t[s + 1] += a !== r ? (a - r) * e : 0, t[s + 2] += a !== o ? (a - o) * e : 0;
    }
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform1f(e.uSaturation, -this.saturation);
  }
  isNeutralState() {
    return this.saturation === 0;
  }
}
x.setClass(lo);
const Gc = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uVibrance;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    float max = max(color.r, max(color.g, color.b));
    float avg = (color.r + color.g + color.b) / 3.0;
    float amt = (abs(max - avg) * 2.0) * uVibrance;
    color.r += max != color.r ? (max - color.r) * amt : 0.00;
    color.g += max != color.g ? (max - color.g) * amt : 0.00;
    color.b += max != color.b ? (max - color.b) * amt : 0.00;
    gl_FragColor = color;
  }
`, Hc = {
  vibrance: 0
};
class co extends $ {
  static type = "Vibrance";
  static defaults = Hc;
  static uniformLocations = ["uVibrance"];
  getFragmentSource() {
    return Gc;
  }
  /**
   * Apply the Vibrance operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d({ imageData: { data: t } }) {
    const e = -this.vibrance;
    for (let s = 0; s < t.length; s += 4) {
      const i = t[s], r = t[s + 1], o = t[s + 2], a = Math.max(i, r, o), h = (i + r + o) / 3, l = Math.abs(a - h) * 2 / 255 * e;
      t[s] += a !== i ? (a - i) * l : 0, t[s + 1] += a !== r ? (a - r) * l : 0, t[s + 2] += a !== o ? (a - o) * l : 0;
    }
  }
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {TWebGLUniformLocationMap} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(t, e) {
    t.uniform1f(e.uVibrance, -this.vibrance);
  }
  isNeutralState() {
    return this.vibrance === 0;
  }
}
x.setClass(co);
const eu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BaseFilter: $,
  BlackWhite: xc,
  BlendColor: Nn,
  BlendImage: Un,
  Blur: qn,
  Brightness: Kn,
  Brownie: _c,
  ColorMatrix: Os,
  Composed: Qn,
  Contrast: Zn,
  Convolute: to,
  Gamma: eo,
  Grayscale: so,
  HueRotation: io,
  Invert: ro,
  Kodachrome: vc,
  Noise: no,
  Pixelate: oo,
  Polaroid: Sc,
  RemoveColor: ao,
  Resize: ho,
  Saturation: lo,
  Sepia: wc,
  Technicolor: Cc,
  Vibrance: co,
  Vintage: yc
}, Symbol.toStringTag, { value: "Module" }));
export {
  Pe as ActiveSelection,
  Li as BaseBrush,
  xi as BaseFabricObject,
  nr as Canvas,
  jl as Canvas2dFilterBackend,
  Jh as CanvasDOMManager,
  ce as Circle,
  Uc as CircleBrush,
  Al as ClipPathLayout,
  E as Color,
  ot as Control,
  Me as Ellipse,
  qt as FabricImage,
  z as FabricObject,
  kt as FabricText,
  Cn as FitContentLayout,
  Fl as FixedLayout,
  ws as Gradient,
  Tt as Group,
  Ut as IText,
  qt as Image,
  Je as InteractiveFabricObject,
  j as Intersection,
  De as LayoutManager,
  Mi as LayoutStrategy,
  xs as Line,
  z as Object,
  bo as Observable,
  Le as Path,
  Fi as Pattern,
  Kc as PatternBrush,
  ss as PencilBrush,
  m as Point,
  In as Polygon,
  ue as Polyline,
  Nt as Rect,
  xt as Shadow,
  qc as SprayBrush,
  gs as StaticCanvas,
  Ar as StaticCanvasDOMManager,
  kt as Text,
  hs as Textbox,
  ke as Triangle,
  ls as WebGLFilterBackend,
  ve as cache,
  x as classRegistry,
  M as config,
  Zc as controlsUtils,
  Sr as createCollectionMixin,
  eu as filters,
  bt as getEnv,
  fe as getFabricDocument,
  Ot as getFabricWindow,
  js as getFilterBackend,
  J as iMatrix,
  Il as initFilterBackend,
  tu as isPutImageFaster,
  Ts as isWebGLPipelineState,
  ql as loadSVGFromString,
  Qc as loadSVGFromURL,
  Ul as parseSVGDocument,
  Ge as runningAnimations,
  zc as setEnv,
  Jc as setFilterBackend,
  Nc as util,
  Ys as version
};
