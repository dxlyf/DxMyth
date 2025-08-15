const ai = {
  grad: 0.9,
  turn: 360,
  rad: 360 / (Math.PI * 2)
}, it = (i) => typeof i == "string" ? i.length > 0 : typeof i == "number", D = (i, t = 0, e = Math.pow(10, t)) => Math.round(e * i) / e + 0, Z = (i, t = 0, e = 1) => i > e ? e : i > t ? i : t, ks = (i) => (i = isFinite(i) ? i % 360 : 0, i > 0 ? i : i + 360), hi = (i, t = "deg") => Number(i) * (ai[t] || 1), Is = (i) => ({
  r: Z(i.r, 0, 255),
  g: Z(i.g, 0, 255),
  b: Z(i.b, 0, 255),
  a: Z(i.a)
}), Ye = (i) => ({
  r: D(i.r),
  g: D(i.g),
  b: D(i.b),
  a: D(i.a, 3)
}), li = ({ r: i, g: t, b: e, a: s = 1 }) => !it(i) || !it(t) || !it(e) ? null : Is({
  r: Number(i),
  g: Number(t),
  b: Number(e),
  a: Number(s)
}), ci = /^#([0-9a-f]{3,8})$/i, ui = (i) => {
  const t = ci.exec(i);
  return t ? (i = t[1], i.length <= 4 ? {
    r: parseInt(i[0] + i[0], 16),
    g: parseInt(i[1] + i[1], 16),
    b: parseInt(i[2] + i[2], 16),
    a: i.length === 4 ? D(parseInt(i[3] + i[3], 16) / 255, 2) : 1
  } : i.length === 6 || i.length === 8 ? {
    r: parseInt(i.substr(0, 2), 16),
    g: parseInt(i.substr(2, 2), 16),
    b: parseInt(i.substr(4, 2), 16),
    a: i.length === 8 ? D(parseInt(i.substr(6, 2), 16) / 255, 2) : 1
  } : null) : null;
}, jt = (i) => {
  const t = i.toString(16);
  return t.length < 2 ? "0" + t : t;
}, di = (i) => {
  const { r: t, g: e, b: s, a: n } = Ye(i), r = n < 1 ? jt(D(n * 255)) : "";
  return "#" + jt(t) + jt(e) + jt(s) + r;
}, fi = (i) => ({
  h: ks(i.h),
  s: Z(i.s, 0, 100),
  v: Z(i.v, 0, 100),
  a: Z(i.a)
}), pi = (i) => ({
  h: D(i.h),
  s: D(i.s),
  v: D(i.v),
  a: D(i.a, 3)
}), mi = ({ h: i, s: t, v: e, a: s = 1 }) => {
  if (!it(i) || !it(t) || !it(e)) return null;
  const n = fi({
    h: Number(i),
    s: Number(t),
    v: Number(e),
    a: Number(s)
  });
  return Rs(n);
}, Fs = ({ r: i, g: t, b: e, a: s }) => {
  const n = Math.max(i, t, e), r = n - Math.min(i, t, e), o = r ? n === i ? (t - e) / r : n === t ? 2 + (e - i) / r : 4 + (i - t) / r : 0;
  return {
    h: 60 * (o < 0 ? o + 6 : o),
    s: n ? r / n * 100 : 0,
    v: n / 255 * 100,
    a: s
  };
}, Rs = ({ h: i, s: t, v: e, a: s }) => {
  i = i / 360 * 6, t = t / 100, e = e / 100;
  const n = Math.floor(i), r = e * (1 - t), o = e * (1 - (i - n) * t), a = e * (1 - (1 - i + n) * t), h = n % 6;
  return {
    r: [e, o, r, r, a, e][h] * 255,
    g: [a, e, e, o, r, r][h] * 255,
    b: [r, r, a, e, e, o][h] * 255,
    a: s
  };
}, Ls = (i) => ({
  h: ks(i.h),
  s: Z(i.s, 0, 100),
  l: Z(i.l, 0, 100),
  a: Z(i.a)
}), Bs = (i) => ({
  h: D(i.h),
  s: D(i.s),
  l: D(i.l),
  a: D(i.a, 3)
}), yi = ({ h: i, s: t, l: e, a: s = 1 }) => {
  if (!it(i) || !it(t) || !it(e)) return null;
  const n = Ls({
    h: Number(i),
    s: Number(t),
    l: Number(e),
    a: Number(s)
  });
  return Xs(n);
}, gi = ({ h: i, s: t, l: e, a: s }) => (t *= (e < 50 ? e : 100 - e) / 100, {
  h: i,
  s: t > 0 ? 2 * t / (e + t) * 100 : 0,
  v: e + t,
  a: s
}), xi = ({ h: i, s: t, v: e, a: s }) => {
  const n = (200 - t) * e / 100;
  return {
    h: i,
    s: n > 0 && n < 200 ? t * e / 100 / (n <= 100 ? n : 200 - n) * 100 : 0,
    l: n / 2,
    a: s
  };
}, Xs = (i) => Rs(gi(i)), Ot = (i) => xi(Fs(i)), _i = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, bi = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Ai = (i) => {
  const t = _i.exec(i) || bi.exec(i);
  if (!t) return null;
  const e = Ls({
    h: hi(t[1], t[2]),
    s: Number(t[3]),
    l: Number(t[4]),
    a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1)
  });
  return Xs(e);
}, vi = (i) => {
  const { h: t, s: e, l: s, a: n } = Bs(Ot(i));
  return n < 1 ? `hsla(${t}, ${e}%, ${s}%, ${n})` : `hsl(${t}, ${e}%, ${s}%)`;
}, wi = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Pi = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Mi = (i) => {
  const t = wi.exec(i) || Pi.exec(i);
  return !t || t[2] !== t[4] || t[4] !== t[6] ? null : Is({
    r: Number(t[1]) / (t[2] ? 100 / 255 : 1),
    g: Number(t[3]) / (t[4] ? 100 / 255 : 1),
    b: Number(t[5]) / (t[6] ? 100 / 255 : 1),
    a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1)
  });
}, Ei = (i) => {
  const { r: t, g: e, b: s, a: n } = Ye(i);
  return n < 1 ? `rgba(${t}, ${e}, ${s}, ${n})` : `rgb(${t}, ${e}, ${s})`;
}, Pe = {
  string: [
    [ui, "hex"],
    [Mi, "rgb"],
    [Ai, "hsl"]
  ],
  object: [
    [li, "rgb"],
    [yi, "hsl"],
    [mi, "hsv"]
  ]
}, je = (i, t) => {
  for (let e = 0; e < t.length; e++) {
    const s = t[e][0](i);
    if (s) return [s, t[e][1]];
  }
  return [null, void 0];
}, Ys = (i) => typeof i == "string" ? je(i.trim(), Pe.string) : typeof i == "object" && i !== null ? je(i, Pe.object) : [null, void 0], br = (i) => Ys(i)[1], Ti = (i, t) => ({
  r: i.r,
  g: i.g,
  b: i.b,
  a: t
}), ye = (i, t) => {
  const e = Ot(i);
  return {
    h: e.h,
    s: Z(e.s + t * 100, 0, 100),
    l: e.l,
    a: e.a
  };
}, ge = (i) => (i.r * 299 + i.g * 587 + i.b * 114) / 1e3 / 255, ze = (i, t) => {
  const e = Ot(i);
  return {
    h: e.h,
    s: e.s,
    l: Z(e.l + t * 100, 0, 100),
    a: e.a
  };
}, Si = (i) => ({
  r: 255 - i.r,
  g: 255 - i.g,
  b: 255 - i.b,
  a: i.a
});
class ae {
  parsed;
  rgba;
  constructor(t) {
    this.parsed = Ys(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
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
    return D(ge(this.rgba), 2);
  }
  /**
   * Same as calling `brightness() < 0.5`.
   */
  isDark() {
    return ge(this.rgba) < 0.5;
  }
  /**
   * Same as calling `brightness() >= 0.5`.
   * */
  isLight() {
    return ge(this.rgba) >= 0.5;
  }
  /**
   * Returns the hexadecimal representation of a color.
   * When the alpha channel value of the color is less than 1,
   * it outputs #rrggbbaa format instead of #rrggbb.
   */
  toHex() {
    return di(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toRgb() {
    return Ye(this.rgba);
  }
  /**
   * Converts a color to RGB color space and returns a string representation.
   * Outputs an alpha value only if it is less than 1.
   */
  toRgbString() {
    return Ei(this.rgba);
  }
  /**
   * Converts a color to HSL color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsl() {
    return Bs(Ot(this.rgba));
  }
  /**
   * Converts a color to HSL color space and returns a string representation.
   * Always includes an alpha value from 0 to 1.
   */
  toHslString() {
    return vi(this.rgba);
  }
  /**
   * Converts a color to HSV color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsv() {
    return pi(Fs(this.rgba));
  }
  /**
   * Creates a new instance containing an inverted (opposite) version of the color.
   */
  invert() {
    return tt(Si(this.rgba));
  }
  /**
   * Increases the HSL saturation of a color by the given amount.
   */
  saturate(t = 0.1) {
    return tt(ye(this.rgba, t));
  }
  /**
   * Decreases the HSL saturation of a color by the given amount.
   */
  desaturate(t = 0.1) {
    return tt(ye(this.rgba, -t));
  }
  /**
   * Makes a gray color with the same lightness as a source color.
   */
  grayscale() {
    return tt(ye(this.rgba, -1));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  lighten(t = 0.1) {
    return tt(ze(this.rgba, t));
  }
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  darken(t = 0.1) {
    return tt(ze(this.rgba, -t));
  }
  /**
   * Changes the HSL hue of a color by the given amount.
   */
  rotate(t = 15) {
    return this.hue(this.hue() + t);
  }
  alpha(t) {
    return typeof t == "number" ? tt(Ti(this.rgba, t)) : D(this.rgba.a, 3);
  }
  hue(t) {
    const e = Ot(this.rgba);
    return typeof t == "number" ? tt({ h: t, s: e.s, l: e.l, a: e.a }) : D(e.h);
  }
  /**
   * Determines whether two values are the same color.
   */
  isEqual(t) {
    return this.toHex() === tt(t).toHex();
  }
}
const tt = (i) => i instanceof ae ? i : new ae(i), Ze = [], Ci = (i) => {
  i.forEach((t) => {
    Ze.indexOf(t) < 0 && (t(ae, Pe), Ze.push(t));
  });
}, Ar = () => new ae({
  r: Math.random() * 255,
  g: Math.random() * 255,
  b: Math.random() * 255
}), ki = (i, t) => {
  const e = {
    white: "#ffffff",
    bisque: "#ffe4c4",
    blue: "#0000ff",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    azure: "#f0ffff",
    whitesmoke: "#f5f5f5",
    papayawhip: "#ffefd5",
    plum: "#dda0dd",
    blanchedalmond: "#ffebcd",
    black: "#000000",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gainsboro: "#dcdcdc",
    cornsilk: "#fff8dc",
    cornflowerblue: "#6495ed",
    burlywood: "#deb887",
    aquamarine: "#7fffd4",
    beige: "#f5f5dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkkhaki: "#bdb76b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    peachpuff: "#ffdab9",
    darkmagenta: "#8b008b",
    darkred: "#8b0000",
    darkorchid: "#9932cc",
    darkorange: "#ff8c00",
    darkslateblue: "#483d8b",
    gray: "#808080",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    wheat: "#f5deb3",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    ghostwhite: "#f8f8ff",
    darkviolet: "#9400d3",
    magenta: "#ff00ff",
    green: "#008000",
    dodgerblue: "#1e90ff",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    blueviolet: "#8a2be2",
    forestgreen: "#228b22",
    lawngreen: "#7cfc00",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    fuchsia: "#ff00ff",
    brown: "#a52a2a",
    maroon: "#800000",
    mediumblue: "#0000cd",
    lightcoral: "#f08080",
    darkturquoise: "#00ced1",
    lightcyan: "#e0ffff",
    ivory: "#fffff0",
    lightyellow: "#ffffe0",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    linen: "#faf0e6",
    mediumaquamarine: "#66cdaa",
    lemonchiffon: "#fffacd",
    lime: "#00ff00",
    khaki: "#f0e68c",
    mediumseagreen: "#3cb371",
    limegreen: "#32cd32",
    mediumspringgreen: "#00fa9a",
    lightskyblue: "#87cefa",
    lightblue: "#add8e6",
    midnightblue: "#191970",
    lightpink: "#ffb6c1",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    mintcream: "#f5fffa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    navajowhite: "#ffdead",
    navy: "#000080",
    mediumvioletred: "#c71585",
    powderblue: "#b0e0e6",
    palegoldenrod: "#eee8aa",
    oldlace: "#fdf5e6",
    paleturquoise: "#afeeee",
    mediumturquoise: "#48d1cc",
    mediumorchid: "#ba55d3",
    rebeccapurple: "#663399",
    lightsteelblue: "#b0c4de",
    mediumslateblue: "#7b68ee",
    thistle: "#d8bfd8",
    tan: "#d2b48c",
    orchid: "#da70d6",
    mediumpurple: "#9370db",
    purple: "#800080",
    pink: "#ffc0cb",
    skyblue: "#87ceeb",
    springgreen: "#00ff7f",
    palegreen: "#98fb98",
    red: "#ff0000",
    yellow: "#ffff00",
    slateblue: "#6a5acd",
    lavenderblush: "#fff0f5",
    peru: "#cd853f",
    palevioletred: "#db7093",
    violet: "#ee82ee",
    teal: "#008080",
    slategray: "#708090",
    slategrey: "#708090",
    aliceblue: "#f0f8ff",
    darkseagreen: "#8fbc8f",
    darkolivegreen: "#556b2f",
    greenyellow: "#adff2f",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    tomato: "#ff6347",
    silver: "#c0c0c0",
    sienna: "#a0522d",
    lavender: "#e6e6fa",
    lightgreen: "#90ee90",
    orange: "#ffa500",
    orangered: "#ff4500",
    steelblue: "#4682b4",
    royalblue: "#4169e1",
    turquoise: "#40e0d0",
    yellowgreen: "#9acd32",
    salmon: "#fa8072",
    saddlebrown: "#8b4513",
    sandybrown: "#f4a460",
    rosybrown: "#bc8f8f",
    darksalmon: "#e9967a",
    lightgoldenrodyellow: "#fafad2",
    snow: "#fffafa",
    lightgrey: "#d3d3d3",
    lightgray: "#d3d3d3",
    dimgray: "#696969",
    dimgrey: "#696969",
    olivedrab: "#6b8e23",
    olive: "#808000"
  }, s = {};
  for (const a in e) s[e[a]] = a;
  const n = {}, r = (a, h) => (a.r - h.r) ** 2 + (a.g - h.g) ** 2 + (a.b - h.b) ** 2;
  i.prototype.toName = function(a) {
    if (!this.rgba.a && !this.rgba.r && !this.rgba.g && !this.rgba.b) return "transparent";
    const h = s[this.toHex()];
    if (h) return h;
    if (a?.closest) {
      const c = this.toRgb();
      let l = 1 / 0, u = "black";
      if (!n.length)
        for (const f in e)
          n[f] = new i(e[f]).toRgb();
      for (const f in e) {
        const d = r(c, n[f]);
        d < l && (l = d, u = f);
      }
      return u;
    }
  };
  const o = (a) => {
    const h = a.toLowerCase(), c = h === "transparent" ? "#0000" : e[h];
    return c ? new i(c).toRgb() : null;
  };
  t.string.push([o, "name"]);
};
Ci([ki]);
class W {
  /**
   * Static shared Color instance used for utility operations. This is a singleton color object
   * that can be reused to avoid creating unnecessary Color instances.
   * > [!IMPORTANT] You should be careful when using this shared instance, as it is mutable and can be
   * > changed by any code that uses it.
   * >
   * > It is best used for one-off color operations or temporary transformations.
   * > For persistent colors, create your own Color instance instead.
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Use shared instance for one-off color operations
   * Color.shared.setValue(0xff0000);
   * const redHex = Color.shared.toHex();     // "#ff0000"
   * const redRgb = Color.shared.toRgbArray(); // [1, 0, 0]
   *
   * // Temporary color transformations
   * const colorNumber = Color.shared
   *     .setValue('#ff0000')     // Set to red
   *     .setAlpha(0.5)          // Make semi-transparent
   *     .premultiply(0.8)       // Apply premultiplication
   *     .toNumber();            // Convert to number
   *
   * // Chain multiple operations
   * const result = Color.shared
   *     .setValue(someColor)
   *     .multiply(tintColor)
   *     .toPremultiplied(alpha);
   * ```
   * @remarks
   * - This is a shared instance - be careful about multiple code paths using it simultaneously
   * - Use for temporary color operations to avoid allocating new Color instances
   * - The value is preserved between operations, so reset if needed
   * - For persistent colors, create your own Color instance instead
   */
  static shared = new W();
  /**
   * Temporary Color object for static uses internally.
   * As to not conflict with Color.shared.
   * @ignore
   */
  static _temp = new W();
  /** Pattern for hex strings */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
  /** Internal color source, from constructor or set value */
  _value;
  /** Normalized rgba component, floats from 0-1 */
  _components;
  /** Cache color as number */
  _int;
  /** An array of the current Color. Only populated when `toArray` functions are called */
  _arrayRgba;
  _arrayRgb;
  /**
   * @param {ColorSource} value - Optional value to use, if not provided, white is used.
   */
  constructor(t = 16777215) {
    this._value = null, this._components = new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = t;
  }
  /**
   * Get the red component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('red');
   * console.log(color.red); // 1
   *
   * const green = new Color('#00ff00');
   * console.log(green.red); // 0
   * ```
   */
  get red() {
    return this._components[0];
  }
  /**
   * Get the green component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('lime');
   * console.log(color.green); // 1
   *
   * const red = new Color('#ff0000');
   * console.log(red.green); // 0
   * ```
   */
  get green() {
    return this._components[1];
  }
  /**
   * Get the blue component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('blue');
   * console.log(color.blue); // 1
   *
   * const yellow = new Color('#ffff00');
   * console.log(yellow.blue); // 0
   * ```
   */
  get blue() {
    return this._components[2];
  }
  /**
   * Get the alpha component of the color, normalized between 0 and 1.
   * @example
   * ```ts
   * const color = new Color('red');
   * console.log(color.alpha); // 1 (fully opaque)
   *
   * const transparent = new Color('rgba(255, 0, 0, 0.5)');
   * console.log(transparent.alpha); // 0.5 (semi-transparent)
   * ```
   */
  get alpha() {
    return this._components[3];
  }
  /**
   * Sets the color value and returns the instance for chaining.
   *
   * This is a chainable version of setting the `value` property.
   * @param value - The color to set. Accepts various formats:
   * - Hex strings/numbers (e.g., '#ff0000', 0xff0000)
   * - RGB/RGBA values (arrays, objects)
   * - CSS color names
   * - HSL/HSLA values
   * - HSV/HSVA values
   * @returns The Color instance for chaining
   * @example
   * ```ts
   * // Basic usage
   * const color = new Color();
   * color.setValue('#ff0000')
   *     .setAlpha(0.5)
   *     .premultiply(0.8);
   *
   * // Different formats
   * color.setValue(0xff0000);          // Hex number
   * color.setValue('#ff0000');         // Hex string
   * color.setValue([1, 0, 0]);         // RGB array
   * color.setValue([1, 0, 0, 0.5]);    // RGBA array
   * color.setValue({ r: 1, g: 0, b: 0 }); // RGB object
   *
   * // Copy from another color
   * const red = new Color('red');
   * color.setValue(red);
   * ```
   * @throws {Error} If the color value is invalid or null
   * @see {@link Color.value} For the underlying value property
   */
  setValue(t) {
    return this.value = t, this;
  }
  /**
   * The current color source. This property allows getting and setting the color value
   * while preserving the original format where possible.
   * @remarks
   * When setting:
   * - Setting to a `Color` instance copies its source and components
   * - Setting to other valid sources normalizes and stores the value
   * - Setting to `null` throws an Error
   * - The color remains unchanged if normalization fails
   *
   * When getting:
   * - Returns `null` if color was modified by {@link Color.multiply} or {@link Color.premultiply}
   * - Otherwise returns the original color source
   * @example
   * ```ts
   * // Setting different color formats
   * const color = new Color();
   *
   * color.value = 0xff0000;         // Hex number
   * color.value = '#ff0000';        // Hex string
   * color.value = [1, 0, 0];        // RGB array
   * color.value = [1, 0, 0, 0.5];   // RGBA array
   * color.value = { r: 1, g: 0, b: 0 }; // RGB object
   *
   * // Copying from another color
   * const red = new Color('red');
   * color.value = red;  // Copies red's components
   *
   * // Getting the value
   * console.log(color.value);  // Returns original format
   *
   * // After modifications
   * color.multiply([0.5, 0.5, 0.5]);
   * console.log(color.value);  // Returns null
   * ```
   * @throws {Error} When attempting to set `null`
   */
  set value(t) {
    if (t instanceof W)
      this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
    else {
      if (t === null)
        throw new Error("Cannot set Color#value to null");
      (this._value === null || !this._isSourceEqual(this._value, t)) && (this._value = this._cloneSource(t), this._normalize(this._value));
    }
  }
  get value() {
    return this._value;
  }
  /**
   * Copy a color source internally.
   * @param value - Color source
   */
  _cloneSource(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof Number || t === null ? t : Array.isArray(t) || ArrayBuffer.isView(t) ? t.slice(0) : typeof t == "object" && t !== null ? { ...t } : t;
  }
  /**
   * Equality check for color sources.
   * @param value1 - First color source
   * @param value2 - Second color source
   * @returns `true` if the color sources are equal, `false` otherwise.
   */
  _isSourceEqual(t, e) {
    const s = typeof t;
    if (s !== typeof e)
      return !1;
    if (s === "number" || s === "string" || t instanceof Number)
      return t === e;
    if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e))
      return t.length !== e.length ? !1 : t.every((r, o) => r === e[o]);
    if (t !== null && e !== null) {
      const r = Object.keys(t), o = Object.keys(e);
      return r.length !== o.length ? !1 : r.every((a) => t[a] === e[a]);
    }
    return t === e;
  }
  /**
   * Convert to a RGBA color object with normalized components (0-1).
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert colors to RGBA objects
   * new Color('white').toRgba();     // returns { r: 1, g: 1, b: 1, a: 1 }
   * new Color('#ff0000').toRgba();   // returns { r: 1, g: 0, b: 0, a: 1 }
   *
   * // With transparency
   * new Color('rgba(255,0,0,0.5)').toRgba(); // returns { r: 1, g: 0, b: 0, a: 0.5 }
   * ```
   * @returns An RGBA object with normalized components
   */
  toRgba() {
    const [t, e, s, n] = this._components;
    return { r: t, g: e, b: s, a: n };
  }
  /**
   * Convert to a RGB color object with normalized components (0-1).
   *
   * Alpha component is omitted in the output.
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert colors to RGB objects
   * new Color('white').toRgb();     // returns { r: 1, g: 1, b: 1 }
   * new Color('#ff0000').toRgb();   // returns { r: 1, g: 0, b: 0 }
   *
   * // Alpha is ignored
   * new Color('rgba(255,0,0,0.5)').toRgb(); // returns { r: 1, g: 0, b: 0 }
   * ```
   * @returns An RGB object with normalized components
   */
  toRgb() {
    const [t, e, s] = this._components;
    return { r: t, g: e, b: s };
  }
  /**
   * Convert to a CSS-style rgba string representation.
   *
   * RGB components are scaled to 0-255 range, alpha remains 0-1.
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert colors to RGBA strings
   * new Color('white').toRgbaString();     // returns "rgba(255,255,255,1)"
   * new Color('#ff0000').toRgbaString();   // returns "rgba(255,0,0,1)"
   *
   * // With transparency
   * new Color([1, 0, 0, 0.5]).toRgbaString(); // returns "rgba(255,0,0,0.5)"
   * ```
   * @returns A CSS-compatible rgba string
   */
  toRgbaString() {
    const [t, e, s] = this.toUint8RgbArray();
    return `rgba(${t},${e},${s},${this.alpha})`;
  }
  /**
   * Convert to an [R, G, B] array of clamped uint8 values (0 to 255).
   * @param {number[]|Uint8Array|Uint8ClampedArray} [out] - Optional output array. If not provided,
   * a cached array will be used and returned.
   * @returns Array containing RGB components as integers between 0-255
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toUint8RgbArray(); // returns [255, 255, 255]
   * new Color('#ff0000').toUint8RgbArray(); // returns [255, 0, 0]
   *
   * // Using custom output array
   * const rgb = new Uint8Array(3);
   * new Color('blue').toUint8RgbArray(rgb); // rgb is now [0, 0, 255]
   *
   * // Using different array types
   * new Color('red').toUint8RgbArray(new Uint8ClampedArray(3)); // [255, 0, 0]
   * new Color('red').toUint8RgbArray([]); // [255, 0, 0]
   * ```
   * @remarks
   * - Output values are always clamped between 0-255
   * - Alpha component is not included in output
   * - Reuses internal cache array if no output array provided
   */
  toUint8RgbArray(t) {
    const [e, s, n] = this._components;
    return this._arrayRgb || (this._arrayRgb = []), t ||= this._arrayRgb, t[0] = Math.round(e * 255), t[1] = Math.round(s * 255), t[2] = Math.round(n * 255), t;
  }
  /**
   * Convert to an [R, G, B, A] array of normalized floats (numbers from 0.0 to 1.0).
   * @param {number[]|Float32Array} [out] - Optional output array. If not provided,
   * a cached array will be used and returned.
   * @returns Array containing RGBA components as floats between 0-1
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toArray();  // returns [1, 1, 1, 1]
   * new Color('red').toArray();    // returns [1, 0, 0, 1]
   *
   * // With alpha
   * new Color('rgba(255,0,0,0.5)').toArray(); // returns [1, 0, 0, 0.5]
   *
   * // Using custom output array
   * const rgba = new Float32Array(4);
   * new Color('blue').toArray(rgba); // rgba is now [0, 0, 1, 1]
   * ```
   * @remarks
   * - Output values are normalized between 0-1
   * - Includes alpha component as the fourth value
   * - Reuses internal cache array if no output array provided
   */
  toArray(t) {
    this._arrayRgba || (this._arrayRgba = []), t ||= this._arrayRgba;
    const [e, s, n, r] = this._components;
    return t[0] = e, t[1] = s, t[2] = n, t[3] = r, t;
  }
  /**
   * Convert to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
   * @param {number[]|Float32Array} [out] - Optional output array. If not provided,
   * a cached array will be used and returned.
   * @returns Array containing RGB components as floats between 0-1
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toRgbArray(); // returns [1, 1, 1]
   * new Color('red').toRgbArray();   // returns [1, 0, 0]
   *
   * // Using custom output array
   * const rgb = new Float32Array(3);
   * new Color('blue').toRgbArray(rgb); // rgb is now [0, 0, 1]
   * ```
   * @remarks
   * - Output values are normalized between 0-1
   * - Alpha component is omitted from output
   * - Reuses internal cache array if no output array provided
   */
  toRgbArray(t) {
    this._arrayRgb || (this._arrayRgb = []), t ||= this._arrayRgb;
    const [e, s, n] = this._components;
    return t[0] = e, t[1] = s, t[2] = n, t;
  }
  /**
   * Convert to a hexadecimal number.
   * @returns The color as a 24-bit RGB integer
   * @example
   * ```ts
   * // Basic usage
   * new Color('white').toNumber(); // returns 0xffffff
   * new Color('red').toNumber();   // returns 0xff0000
   *
   * // Store as hex
   * const color = new Color('blue');
   * const hex = color.toNumber(); // 0x0000ff
   * ```
   */
  toNumber() {
    return this._int;
  }
  /**
   * Convert to a BGR number.
   *
   * Useful for platforms that expect colors in BGR format.
   * @returns The color as a 24-bit BGR integer
   * @example
   * ```ts
   * // Convert RGB to BGR
   * new Color(0xffcc99).toBgrNumber(); // returns 0x99ccff
   *
   * // Common use case: platform-specific color format
   * const color = new Color('orange');
   * const bgrColor = color.toBgrNumber(); // Color with swapped R/B channels
   * ```
   * @remarks
   * This swaps the red and blue channels compared to the normal RGB format:
   * - RGB 0xRRGGBB becomes BGR 0xBBGGRR
   */
  toBgrNumber() {
    const [t, e, s] = this.toUint8RgbArray();
    return (s << 16) + (e << 8) + t;
  }
  /**
   * Convert to a hexadecimal number in little endian format (e.g., BBGGRR).
   *
   * Useful for platforms that expect colors in little endian byte order.
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Convert RGB color to little endian format
   * new Color(0xffcc99).toLittleEndianNumber(); // returns 0x99ccff
   *
   * // Common use cases:
   * const color = new Color('orange');
   * const leColor = color.toLittleEndianNumber(); // Swaps byte order for LE systems
   *
   * // Multiple conversions
   * const colors = {
   *     normal: 0xffcc99,
   *     littleEndian: new Color(0xffcc99).toLittleEndianNumber(), // 0x99ccff
   *     backToNormal: new Color(0x99ccff).toLittleEndianNumber()  // 0xffcc99
   * };
   * ```
   * @remarks
   * - Swaps R and B channels in the color value
   * - RGB 0xRRGGBB becomes 0xBBGGRR
   * - Useful for systems that use little endian byte order
   * - Can be used to convert back and forth between formats
   * @returns The color as a number in little endian format (BBGGRR)
   * @see {@link Color.toBgrNumber} For BGR format without byte swapping
   */
  toLittleEndianNumber() {
    const t = this._int;
    return (t >> 16) + (t & 65280) + ((t & 255) << 16);
  }
  /**
   * Multiply with another color.
   *
   * This action is destructive and modifies the original color.
   * @param {ColorSource} value - The color to multiply by. Accepts any valid color format:
   * - Hex strings/numbers (e.g., '#ff0000', 0xff0000)
   * - RGB/RGBA arrays ([1, 0, 0], [1, 0, 0, 1])
   * - Color objects ({ r: 1, g: 0, b: 0 })
   * - CSS color names ('red', 'blue')
   * @returns this - The Color instance for chaining
   * @example
   * ```ts
   * // Basic multiplication
   * const color = new Color('#ff0000');
   * color.multiply(0x808080); // 50% darker red
   *
   * // With transparency
   * color.multiply([1, 1, 1, 0.5]); // 50% transparent
   *
   * // Chain operations
   * color
   *     .multiply('#808080')
   *     .multiply({ r: 1, g: 1, b: 1, a: 0.5 });
   * ```
   * @remarks
   * - Multiplies each RGB component and alpha separately
   * - Values are clamped between 0-1
   * - Original color format is lost (value becomes null)
   * - Operation cannot be undone
   */
  multiply(t) {
    const [e, s, n, r] = W._temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= s, this._components[2] *= n, this._components[3] *= r, this._refreshInt(), this._value = null, this;
  }
  /**
   * Converts color to a premultiplied alpha format.
   *
   * This action is destructive and modifies the original color.
   * @param alpha - The alpha value to multiply by (0-1)
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels
   * @returns {Color} The Color instance for chaining
   * @example
   * ```ts
   * // Basic premultiplication
   * const color = new Color('red');
   * color.premultiply(0.5); // 50% transparent red with premultiplied RGB
   *
   * // Alpha only (RGB unchanged)
   * color.premultiply(0.5, false); // 50% transparent, original RGB
   *
   * // Chain with other operations
   * color
   *     .multiply(0x808080)
   *     .premultiply(0.5)
   *     .toNumber();
   * ```
   * @remarks
   * - RGB channels are multiplied by alpha when applyToRGB is true
   * - Alpha is always set to the provided value
   * - Values are clamped between 0-1
   * - Original color format is lost (value becomes null)
   * - Operation cannot be undone
   */
  premultiply(t, e = !0) {
    return e && (this._components[0] *= t, this._components[1] *= t, this._components[2] *= t), this._components[3] = t, this._refreshInt(), this._value = null, this;
  }
  /**
   * Returns the color as a 32-bit premultiplied alpha integer.
   *
   * Format: 0xAARRGGBB
   * @param {number} alpha - The alpha value to multiply by (0-1)
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels
   * @returns {number} The premultiplied color as a 32-bit integer
   * @example
   * ```ts
   * // Convert to premultiplied format
   * const color = new Color('red');
   *
   * // Full opacity (0xFFRRGGBB)
   * color.toPremultiplied(1.0); // 0xFFFF0000
   *
   * // 50% transparency with premultiplied RGB
   * color.toPremultiplied(0.5); // 0x7F7F0000
   *
   * // 50% transparency without RGB premultiplication
   * color.toPremultiplied(0.5, false); // 0x7FFF0000
   * ```
   * @remarks
   * - Returns full opacity (0xFF000000) when alpha is 1.0
   * - Returns 0 when alpha is 0.0 and applyToRGB is true
   * - RGB values are rounded during premultiplication
   */
  toPremultiplied(t, e = !0) {
    if (t === 1)
      return (255 << 24) + this._int;
    if (t === 0)
      return e ? 0 : this._int;
    let s = this._int >> 16 & 255, n = this._int >> 8 & 255, r = this._int & 255;
    return e && (s = s * t + 0.5 | 0, n = n * t + 0.5 | 0, r = r * t + 0.5 | 0), (t * 255 << 24) + (s << 16) + (n << 8) + r;
  }
  /**
   * Convert to a hexadecimal string (6 characters).
   * @returns A CSS-compatible hex color string (e.g., "#ff0000")
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Basic colors
   * new Color('red').toHex();    // returns "#ff0000"
   * new Color('white').toHex();  // returns "#ffffff"
   * new Color('black').toHex();  // returns "#000000"
   *
   * // From different formats
   * new Color(0xff0000).toHex(); // returns "#ff0000"
   * new Color([1, 0, 0]).toHex(); // returns "#ff0000"
   * new Color({ r: 1, g: 0, b: 0 }).toHex(); // returns "#ff0000"
   * ```
   * @remarks
   * - Always returns a 6-character hex string
   * - Includes leading "#" character
   * - Alpha channel is ignored
   * - Values are rounded to nearest hex value
   */
  toHex() {
    const t = this._int.toString(16);
    return `#${"000000".substring(0, 6 - t.length) + t}`;
  }
  /**
   * Convert to a hexadecimal string with alpha (8 characters).
   * @returns A CSS-compatible hex color string with alpha (e.g., "#ff0000ff")
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // Fully opaque colors
   * new Color('red').toHexa();   // returns "#ff0000ff"
   * new Color('white').toHexa(); // returns "#ffffffff"
   *
   * // With transparency
   * new Color('rgba(255, 0, 0, 0.5)').toHexa(); // returns "#ff00007f"
   * new Color([1, 0, 0, 0]).toHexa(); // returns "#ff000000"
   * ```
   * @remarks
   * - Returns an 8-character hex string
   * - Includes leading "#" character
   * - Alpha is encoded in last two characters
   * - Values are rounded to nearest hex value
   */
  toHexa() {
    const e = Math.round(this._components[3] * 255).toString(16);
    return this.toHex() + "00".substring(0, 2 - e.length) + e;
  }
  /**
   * Set alpha (transparency) value while preserving color components.
   *
   * Provides a chainable interface for setting alpha.
   * @param alpha - Alpha value between 0 (fully transparent) and 1 (fully opaque)
   * @returns The Color instance for chaining
   * @example
   * ```ts
   * // Basic alpha setting
   * const color = new Color('red');
   * color.setAlpha(0.5);  // 50% transparent red
   *
   * // Chain with other operations
   * color
   *     .setValue('#ff0000')
   *     .setAlpha(0.8)    // 80% opaque
   *     .premultiply(0.5); // Further modify alpha
   *
   * // Reset to fully opaque
   * color.setAlpha(1);
   * ```
   * @remarks
   * - Alpha value is clamped between 0-1
   * - Can be chained with other color operations
   */
  setAlpha(t) {
    return this._components[3] = this._clamp(t), this;
  }
  /**
   * Normalize the input value into rgba
   * @param value - Input value
   */
  _normalize(t) {
    let e, s, n, r;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const o = t;
      e = (o >> 16 & 255) / 255, s = (o >> 8 & 255) / 255, n = (o & 255) / 255, r = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t), [e, s, n, r = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t, 0, 255), [e, s, n, r = 255] = t, e /= 255, s /= 255, n /= 255, r /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const a = W.HEX_PATTERN.exec(t);
        a && (t = `#${a[2]}`);
      }
      const o = tt(t);
      o.isValid() && ({ r: e, g: s, b: n, a: r } = o.rgba, e /= 255, s /= 255, n /= 255);
    }
    if (e !== void 0)
      this._components[0] = e, this._components[1] = s, this._components[2] = n, this._components[3] = r, this._refreshInt();
    else
      throw new Error(`Unable to convert color ${t}`);
  }
  /** Refresh the internal color rgb number */
  _refreshInt() {
    this._clamp(this._components);
    const [t, e, s] = this._components;
    this._int = (t * 255 << 16) + (e * 255 << 8) + (s * 255 | 0);
  }
  /**
   * Clamps values to a range. Will override original values
   * @param value - Value(s) to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   */
  _clamp(t, e = 0, s = 1) {
    return typeof t == "number" ? Math.min(Math.max(t, e), s) : (t.forEach((n, r) => {
      t[r] = Math.min(Math.max(n, e), s);
    }), t);
  }
  /**
   * Check if a value can be interpreted as a valid color format.
   * Supports all color formats that can be used with the Color class.
   * @param value - Value to check
   * @returns True if the value can be used as a color
   * @example
   * ```ts
   * import { Color } from 'pixi.js';
   *
   * // CSS colors and hex values
   * Color.isColorLike('red');          // true
   * Color.isColorLike('#ff0000');      // true
   * Color.isColorLike(0xff0000);       // true
   *
   * // Arrays (RGB/RGBA)
   * Color.isColorLike([1, 0, 0]);      // true
   * Color.isColorLike([1, 0, 0, 0.5]); // true
   *
   * // TypedArrays
   * Color.isColorLike(new Float32Array([1, 0, 0]));          // true
   * Color.isColorLike(new Uint8Array([255, 0, 0]));          // true
   * Color.isColorLike(new Uint8ClampedArray([255, 0, 0]));   // true
   *
   * // Object formats
   * Color.isColorLike({ r: 1, g: 0, b: 0 });            // true (RGB)
   * Color.isColorLike({ r: 1, g: 0, b: 0, a: 0.5 });    // true (RGBA)
   * Color.isColorLike({ h: 0, s: 100, l: 50 });         // true (HSL)
   * Color.isColorLike({ h: 0, s: 100, l: 50, a: 0.5 }); // true (HSLA)
   * Color.isColorLike({ h: 0, s: 100, v: 100 });        // true (HSV)
   * Color.isColorLike({ h: 0, s: 100, v: 100, a: 0.5 });// true (HSVA)
   *
   * // Color instances
   * Color.isColorLike(new Color('red')); // true
   *
   * // Invalid values
   * Color.isColorLike(null);           // false
   * Color.isColorLike(undefined);      // false
   * Color.isColorLike({});             // false
   * Color.isColorLike([]);             // false
   * Color.isColorLike('not-a-color');  // false
   * ```
   * @remarks
   * Checks for the following formats:
   * - Numbers (0x000000 to 0xffffff)
   * - CSS color strings
   * - RGB/RGBA arrays and objects
   * - HSL/HSLA objects
   * - HSV/HSVA objects
   * - TypedArrays (Float32Array, Uint8Array, Uint8ClampedArray)
   * - Color instances
   * @see {@link ColorSource} For supported color format types
   * @see {@link Color.setValue} For setting color values
   * @category utility
   */
  static isColorLike(t) {
    return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof W || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
  }
}
let Ke = null;
const J = {
  /**
   * Returns the current adapter.
   * @returns {environment.Adapter} The current adapter.
   */
  get() {
    return Ke;
  },
  /**
   * Sets the current adapter.
   * @param adapter - The new adapter.
   */
  set(i) {
    Ke = i;
  }
}, Me = (i) => {
  if (typeof i == "function" || typeof i == "object" && i.extension) {
    if (!i.extension)
      throw new Error("Extension class must have an extension object");
    i = { ...typeof i.extension != "object" ? { type: i.extension } : i.extension, ref: i };
  }
  if (typeof i == "object")
    i = { ...i };
  else
    throw new Error("Invalid extension type");
  return typeof i.type == "string" && (i.type = [i.type]), i;
}, zt = (i, t) => Me(i).priority ?? t, Us = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed. Can be:
   * - Extension class with static `extension` property
   * - Extension format object with `type` and `ref`
   * - Multiple extensions as separate arguments
   * @returns {extensions} this for chaining
   * @example
   * ```ts
   * // Remove a single extension
   * extensions.remove(MyRendererPlugin);
   *
   * // Remove multiple extensions
   * extensions.remove(
   *     MyRendererPlugin,
   *     MySystemPlugin
   * );
   * ```
   * @see {@link ExtensionType} For available extension types
   * @see {@link ExtensionFormat} For extension format details
   */
  remove(...i) {
    return i.map(Me).forEach((t) => {
      t.type.forEach((e) => this._removeHandlers[e]?.(t));
    }), this;
  },
  /**
   * Register new extensions with PixiJS. Extensions can be registered in multiple formats:
   * - As a class with a static `extension` property
   * - As an extension format object
   * - As multiple extensions passed as separate arguments
   * @param extensions - Extensions to add to PixiJS. Each can be:
   * - A class with static `extension` property
   * - An extension format object with `type` and `ref`
   * - Multiple extensions as separate arguments
   * @returns This extensions instance for chaining
   * @example
   * ```ts
   * // Register a simple extension
   * extensions.add(MyRendererPlugin);
   *
   * // Register multiple extensions
   * extensions.add(
   *     MyRendererPlugin,
   *     MySystemPlugin,
   * });
   * ```
   * @see {@link ExtensionType} For available extension types
   * @see {@link ExtensionFormat} For extension format details
   * @see {@link extensions.remove} For removing registered extensions
   */
  add(...i) {
    return i.map(Me).forEach((t) => {
      t.type.forEach((e) => {
        const s = this._addHandlers, n = this._queue;
        s[e] ? s[e]?.(t) : (n[e] = n[e] || [], n[e]?.push(t));
      });
    }), this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
   * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
   * @returns this for chaining.
   * @internal
   * @ignore
   */
  handle(i, t, e) {
    const s = this._addHandlers, n = this._removeHandlers;
    if (s[i] || n[i])
      throw new Error(`Extension type ${i} already has a handler`);
    s[i] = t, n[i] = e;
    const r = this._queue;
    return r[i] && (r[i]?.forEach((o) => t(o)), delete r[i]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns this for chaining.
   * @ignore
   */
  handleByMap(i, t) {
    return this.handle(
      i,
      (e) => {
        e.name && (t[e.name] = e.ref);
      },
      (e) => {
        e.name && delete t[e.name];
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions with a `name` property.
   * @param type - Type of extension to handle.
   * @param map - The array of named extensions.
   * @param defaultPriority - Fallback priority if none is defined.
   * @returns this for chaining.
   * @ignore
   */
  handleByNamedList(i, t, e = -1) {
    return this.handle(
      i,
      (s) => {
        t.findIndex((r) => r.name === s.name) >= 0 || (t.push({ name: s.name, value: s.ref }), t.sort((r, o) => zt(o.value, e) - zt(r.value, e)));
      },
      (s) => {
        const n = t.findIndex((r) => r.name === s.name);
        n !== -1 && t.splice(n, 1);
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns this for chaining.
   * @ignore
   */
  handleByList(i, t, e = -1) {
    return this.handle(
      i,
      (s) => {
        t.includes(s.ref) || (t.push(s.ref), t.sort((n, r) => zt(r, e) - zt(n, e)));
      },
      (s) => {
        const n = t.indexOf(s.ref);
        n !== -1 && t.splice(n, 1);
      }
    );
  },
  /**
   * Mixin the source object(s) properties into the target class's prototype.
   * Copies all property descriptors from source objects to the target's prototype.
   * @param Target - The target class to mix properties into
   * @param sources - One or more source objects containing properties to mix in
   * @example
   * ```ts
   * // Create a mixin with shared properties
   * const moveable = {
   *     x: 0,
   *     y: 0,
   *     move(x: number, y: number) {
   *         this.x += x;
   *         this.y += y;
   *     }
   * };
   *
   * // Create a mixin with computed properties
   * const scalable = {
   *     scale: 1,
   *     get scaled() {
   *         return this.scale > 1;
   *     }
   * };
   *
   * // Apply mixins to a class
   * extensions.mixin(Sprite, moveable, scalable);
   *
   * // Use mixed-in properties
   * const sprite = new Sprite();
   * sprite.move(10, 20);
   * console.log(sprite.x, sprite.y); // 10, 20
   * ```
   * @remarks
   * - Copies all properties including getters/setters
   * - Does not modify source objects
   * - Preserves property descriptors
   * @see {@link Object.defineProperties} For details on property descriptors
   * @see {@link Object.getOwnPropertyDescriptors} For details on property copying
   */
  mixin(i, ...t) {
    for (const e of t)
      Object.defineProperties(i.prototype, Object.getOwnPropertyDescriptors(e));
  }
}, Ee = [];
Us.handleByNamedList("Environment", Ee);
async function Ii(i) {
  if (!i)
    for (let t = 0; t < Ee.length; t++) {
      const e = Ee[t];
      if (e.value.test()) {
        await e.value.load();
        return;
      }
    }
}
async function vr(i) {
  return Ii(!i);
}
var Fi = Object.prototype.hasOwnProperty, V = "~";
function Nt() {
}
Object.create && (Nt.prototype = /* @__PURE__ */ Object.create(null), new Nt().__proto__ || (V = !1));
function Ri(i, t, e) {
  this.fn = i, this.context = t, this.once = e || !1;
}
function Ds(i, t, e, s, n) {
  if (typeof e != "function")
    throw new TypeError("The listener must be a function");
  var r = new Ri(e, s || i, n), o = V ? V + t : t;
  return i._events[o] ? i._events[o].fn ? i._events[o] = [i._events[o], r] : i._events[o].push(r) : (i._events[o] = r, i._eventsCount++), i;
}
function re(i, t) {
  --i._eventsCount === 0 ? i._events = new Nt() : delete i._events[t];
}
function Y() {
  this._events = new Nt(), this._eventsCount = 0;
}
Y.prototype.eventNames = function() {
  var t = [], e, s;
  if (this._eventsCount === 0) return t;
  for (s in e = this._events)
    Fi.call(e, s) && t.push(V ? s.slice(1) : s);
  return Object.getOwnPropertySymbols ? t.concat(Object.getOwnPropertySymbols(e)) : t;
};
Y.prototype.listeners = function(t) {
  var e = V ? V + t : t, s = this._events[e];
  if (!s) return [];
  if (s.fn) return [s.fn];
  for (var n = 0, r = s.length, o = new Array(r); n < r; n++)
    o[n] = s[n].fn;
  return o;
};
Y.prototype.listenerCount = function(t) {
  var e = V ? V + t : t, s = this._events[e];
  return s ? s.fn ? 1 : s.length : 0;
};
Y.prototype.emit = function(t, e, s, n, r, o) {
  var a = V ? V + t : t;
  if (!this._events[a]) return !1;
  var h = this._events[a], c = arguments.length, l, u;
  if (h.fn) {
    switch (h.once && this.removeListener(t, h.fn, void 0, !0), c) {
      case 1:
        return h.fn.call(h.context), !0;
      case 2:
        return h.fn.call(h.context, e), !0;
      case 3:
        return h.fn.call(h.context, e, s), !0;
      case 4:
        return h.fn.call(h.context, e, s, n), !0;
      case 5:
        return h.fn.call(h.context, e, s, n, r), !0;
      case 6:
        return h.fn.call(h.context, e, s, n, r, o), !0;
    }
    for (u = 1, l = new Array(c - 1); u < c; u++)
      l[u - 1] = arguments[u];
    h.fn.apply(h.context, l);
  } else {
    var f = h.length, d;
    for (u = 0; u < f; u++)
      switch (h[u].once && this.removeListener(t, h[u].fn, void 0, !0), c) {
        case 1:
          h[u].fn.call(h[u].context);
          break;
        case 2:
          h[u].fn.call(h[u].context, e);
          break;
        case 3:
          h[u].fn.call(h[u].context, e, s);
          break;
        case 4:
          h[u].fn.call(h[u].context, e, s, n);
          break;
        default:
          if (!l) for (d = 1, l = new Array(c - 1); d < c; d++)
            l[d - 1] = arguments[d];
          h[u].fn.apply(h[u].context, l);
      }
  }
  return !0;
};
Y.prototype.on = function(t, e, s) {
  return Ds(this, t, e, s, !1);
};
Y.prototype.once = function(t, e, s) {
  return Ds(this, t, e, s, !0);
};
Y.prototype.removeListener = function(t, e, s, n) {
  var r = V ? V + t : t;
  if (!this._events[r]) return this;
  if (!e)
    return re(this, r), this;
  var o = this._events[r];
  if (o.fn)
    o.fn === e && (!n || o.once) && (!s || o.context === s) && re(this, r);
  else {
    for (var a = 0, h = [], c = o.length; a < c; a++)
      (o[a].fn !== e || n && !o[a].once || s && o[a].context !== s) && h.push(o[a]);
    h.length ? this._events[r] = h.length === 1 ? h[0] : h : re(this, r);
  }
  return this;
};
Y.prototype.removeAllListeners = function(t) {
  var e;
  return t ? (e = V ? V + t : t, this._events[e] && re(this, e)) : (this._events = new Nt(), this._eventsCount = 0), this;
};
Y.prototype.off = Y.prototype.removeListener;
Y.prototype.addListener = Y.prototype.on;
Y.prefixed = V;
Y.EventEmitter = Y;
class F {
  /**
   * Position of the point on the x axis
   * @example
   * ```ts
   * // Set x position
   * const point = new Point();
   * point.x = 100;
   *
   * // Use in calculations
   * const width = rightPoint.x - leftPoint.x;
   * ```
   */
  x = 0;
  /**
   * Position of the point on the y axis
   * @example
   * ```ts
   * // Set y position
   * const point = new Point();
   * point.y = 200;
   *
   * // Use in calculations
   * const height = bottomPoint.y - topPoint.y;
   * ```
   */
  y = 0;
  /**
   * Creates a new `Point`
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t = 0, e = 0) {
    this.x = t, this.y = e;
  }
  /**
   * Creates a clone of this point, which is a new instance with the same `x` and `y` values.
   * @example
   * ```ts
   * // Basic point cloning
   * const original = new Point(100, 200);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.set(300, 400);
   *
   * // Verify independence
   * console.log(original); // Point(100, 200)
   * console.log(modified); // Point(300, 400)
   * ```
   * @remarks
   * - Creates new Point instance
   * - Deep copies x and y values
   * - Independent from original
   * - Useful for preserving values
   * @returns A clone of this point
   * @see {@link Point.copyFrom} For copying into existing point
   * @see {@link Point.copyTo} For copying to existing point
   */
  clone() {
    return new F(this.x, this.y);
  }
  /**
   * Copies x and y from the given point into this point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Point(100, 200);
   * const target = new Point();
   * target.copyFrom(source);
   *
   * // Copy and chain operations
   * const point = new Point()
   *     .copyFrom(source)
   *     .set(x + 50, y + 50);
   *
   * // Copy from any PointData
   * const data = { x: 10, y: 20 };
   * point.copyFrom(data);
   * ```
   * @param p - The point to copy from
   * @returns The point instance itself
   * @see {@link Point.copyTo} For copying to another point
   * @see {@link Point.clone} For creating new point copy
   */
  copyFrom(t) {
    return this.set(t.x, t.y), this;
  }
  /**
   * Copies this point's x and y into the given point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Point(100, 200);
   * const target = new Point();
   * source.copyTo(target);
   * ```
   * @param p - The point to copy to. Can be any type that is or extends `PointLike`
   * @returns The point (`p`) with values updated
   * @see {@link Point.copyFrom} For copying from another point
   * @see {@link Point.clone} For creating new point copy
   */
  copyTo(t) {
    return t.set(this.x, this.y), t;
  }
  /**
   * Checks if another point is equal to this point.
   *
   * Compares x and y values using strict equality.
   * @example
   * ```ts
   * // Basic equality check
   * const p1 = new Point(100, 200);
   * const p2 = new Point(100, 200);
   * console.log(p1.equals(p2)); // true
   *
   * // Compare with PointData
   * const data = { x: 100, y: 200 };
   * console.log(p1.equals(data)); // true
   *
   * // Check different points
   * const p3 = new Point(200, 300);
   * console.log(p1.equals(p3)); // false
   * ```
   * @param p - The point to check
   * @returns `true` if both `x` and `y` are equal
   * @see {@link Point.copyFrom} For making points equal
   * @see {@link PointData} For point data interface
   */
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  /**
   * Sets the point to a new x and y position.
   *
   * If y is omitted, both x and y will be set to x.
   * @example
   * ```ts
   * // Basic position setting
   * const point = new Point();
   * point.set(100, 200);
   *
   * // Set both x and y to same value
   * point.set(50); // x=50, y=50
   *
   * // Chain with other operations
   * point
   *     .set(10, 20)
   *     .copyTo(otherPoint);
   * ```
   * @param x - Position on the x axis
   * @param y - Position on the y axis, defaults to x
   * @returns The point instance itself
   * @see {@link Point.copyFrom} For copying from another point
   * @see {@link Point.equals} For comparing positions
   */
  set(t = 0, e = t) {
    return this.x = t, this.y = e, this;
  }
  // #if _DEBUG
  toString() {
    return `[pixi.js/math:Point x=${this.x} y=${this.y}]`;
  }
  // #endif
  /**
   * A static Point object with `x` and `y` values of `0`.
   *
   * This shared instance is reset to zero values when accessed.
   *
   * > [!IMPORTANT] This point is shared and temporary. Do not store references to it.
   * @example
   * ```ts
   * // Use for temporary calculations
   * const tempPoint = Point.shared;
   * tempPoint.set(100, 200);
   * matrix.apply(tempPoint);
   *
   * // Will be reset to (0,0) on next access
   * const fresh = Point.shared; // x=0, y=0
   * ```
   * @readonly
   * @returns A fresh zeroed point for temporary use
   * @see {@link Point.constructor} For creating new points
   * @see {@link PointData} For basic point interface
   */
  static get shared() {
    return xe.x = 0, xe.y = 0, xe;
  }
}
const xe = new F();
var he = /* @__PURE__ */ ((i) => (i[i.INTERACTION = 50] = "INTERACTION", i[i.HIGH = 25] = "HIGH", i[i.NORMAL = 0] = "NORMAL", i[i.LOW = -25] = "LOW", i[i.UTILITY = -50] = "UTILITY", i))(he || {});
class _e {
  /** The current priority. */
  priority;
  /** The next item in chain. */
  next = null;
  /** The previous item in chain. */
  previous = null;
  /** The handler function to execute. */
  _fn;
  /** The calling to execute. */
  _context;
  /** If this should only execute once. */
  _once;
  /** `true` if this listener has been destroyed already. */
  _destroyed = !1;
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(t, e = null, s = 0, n = !1) {
    this._fn = t, this._context = e, this.priority = s, this._once = n;
  }
  /**
   * Simple compare function to figure out if a function and context match.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @returns `true` if the listener match the arguments
   */
  match(t, e = null) {
    return this._fn === t && this._context === e;
  }
  /**
   * Emit by calling the current function.
   * @param ticker - The ticker emitting.
   * @returns Next ticker
   */
  emit(t) {
    this._fn && (this._context ? this._fn.call(this._context, t) : this._fn(t));
    const e = this.next;
    return this._once && this.destroy(!0), this._destroyed && (this.next = null), e;
  }
  /**
   * Connect to the list.
   * @param previous - Input node, previous listener
   */
  connect(t) {
    this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this;
  }
  /**
   * Destroy and don't use after this.
   * @param hard - `true` to remove the `next` reference, this
   *        is considered a hard destroy. Soft destroy maintains the next reference.
   * @returns The listener to redirect while emitting or removing.
   */
  destroy(t = !1) {
    this._destroyed = !0, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
    const e = this.next;
    return this.next = t ? null : e, this.previous = null, e;
  }
}
class U {
  /**
   * Target frame rate in frames per millisecond.
   * Used for converting deltaTime to a scalar time delta.
   * @example
   * ```ts
   * // Default is 0.06 (60 FPS)
   * console.log(Ticker.targetFPMS); // 0.06
   *
   * // Calculate target frame duration
   * const frameDuration = 1 / Ticker.targetFPMS; // ≈ 16.67ms
   *
   * // Use in custom timing calculations
   * const deltaTime = elapsedMS * Ticker.targetFPMS;
   * ```
   * @remarks
   * - Default is 0.06 (equivalent to 60 FPS)
   * - Used in deltaTime calculations
   * - Affects all ticker instances
   * @default 0.06
   * @see {@link Ticker#deltaTime} For time scaling
   * @see {@link Ticker#FPS} For actual frame rate
   */
  static targetFPMS = 0.06;
  /** The private shared ticker instance */
  static _shared;
  /** The private system ticker instance  */
  static _system;
  /**
   * Whether or not this ticker should invoke the method {@link Ticker#start|start}
   * automatically when a listener is added.
   * @example
   * ```ts
   * // Default behavior (manual start)
   * const ticker = new Ticker();
   * ticker.autoStart = false;
   * ticker.add(() => {
   *     // Won't run until ticker.start() is called
   * });
   *
   * // Auto-start behavior
   * const autoTicker = new Ticker();
   * autoTicker.autoStart = true;
   * autoTicker.add(() => {
   *     // Runs immediately when added
   * });
   * ```
   * @default false
   * @see {@link Ticker#start} For manually starting the ticker
   * @see {@link Ticker#stop} For manually stopping the ticker
   */
  autoStart = !1;
  /**
   * Scalar time value from last frame to this frame.
   * Used for frame-based animations and updates.
   *
   * This value is capped by setting {@link Ticker#minFPS|minFPS}
   * and is scaled with {@link Ticker#speed|speed}.
   * > [!NOTE] The cap may be exceeded by scaling.
   * @example
   * ```ts
   * // Basic animation
   * ticker.add((ticker) => {
   *     // Rotate sprite by 0.1 radians per frame, scaled by deltaTime
   *     sprite.rotation += 0.1 * ticker.deltaTime;
   * });
   * ```
   */
  deltaTime = 1;
  /**
   * Scalar time elapsed in milliseconds from last frame to this frame.
   * Provides precise timing for animations and updates.
   *
   * This value is capped by setting {@link Ticker#minFPS|minFPS}
   * and is scaled with {@link Ticker#speed|speed}.
   *
   * If the platform supports DOMHighResTimeStamp,
   * this value will have a precision of 1 µs.
   *
   * Defaults to target frame time
   *
   * > [!NOTE] The cap may be exceeded by scaling.
   * @example
   * ```ts
   * // Animation timing
   * ticker.add((ticker) => {
   *     // Use millisecond timing for precise animations
   *     const progress = (ticker.deltaMS / animationDuration);
   *     sprite.alpha = Math.min(1, progress);
   * });
   * ```
   * @default 16.66
   */
  deltaMS;
  /**
   * Time elapsed in milliseconds from last frame to this frame.
   * Provides raw timing information without modifications.
   *
   * Opposed to what the scalar {@link Ticker#deltaTime|deltaTime}
   * is based, this value is neither capped nor scaled.
   *
   * If the platform supports DOMHighResTimeStamp,
   * this value will have a precision of 1 µs.
   *
   * Defaults to target frame time
   * @example
   * ```ts
   * // Basic timing information
   * ticker.add((ticker) => {
   *     console.log(`Raw frame time: ${ticker.elapsedMS}ms`);
   * });
   * ```
   * @default 16.66
   */
  elapsedMS;
  /**
   * The last time {@link Ticker#update|update} was invoked.
   * Used for calculating time deltas between frames.
   *
   * This value is also reset internally outside of invoking
   * update, but only when a new animation frame is requested.
   *
   * If the platform supports DOMHighResTimeStamp,
   * this value will have a precision of 1 µs.
   * @example
   * ```ts
   * // Basic timing check
   * ticker.add(() => {
   *     const timeSinceStart = performance.now() - ticker.lastTime;
   *     console.log(`Time running: ${timeSinceStart}ms`);
   * });
   * ```
   */
  lastTime = -1;
  /**
   * Factor of current {@link Ticker#deltaTime|deltaTime}.
   * Used to scale time for slow motion or fast-forward effects.
   * @example
   * ```ts
   * // Basic speed adjustment
   * ticker.speed = 0.5; // Half speed (slow motion)
   * ticker.speed = 2.0; // Double speed (fast forward)
   *
   * // Temporary speed changes
   * function slowMotion() {
   *     const normalSpeed = ticker.speed;
   *     ticker.speed = 0.2;
   *     setTimeout(() => {
   *         ticker.speed = normalSpeed;
   *     }, 1000);
   * }
   * ```
   */
  speed = 1;
  /**
   * Whether or not this ticker has been started.
   *
   * `true` if {@link Ticker#start|start} has been called.
   * `false` if {@link Ticker#stop|Stop} has been called.
   *
   * While `false`, this value may change to `true` in the
   * event of {@link Ticker#autoStart|autoStart} being `true`
   * and a listener is added.
   * @example
   * ```ts
   * // Check ticker state
   * const ticker = new Ticker();
   * console.log(ticker.started); // false
   *
   * // Start and verify
   * ticker.start();
   * console.log(ticker.started); // true
   * ```
   */
  started = !1;
  /** The first listener. All new listeners added are chained on this. */
  _head;
  /** Internal current frame request ID */
  _requestId = null;
  /**
   * Internal value managed by minFPS property setter and getter.
   * This is the maximum allowed milliseconds between updates.
   */
  _maxElapsedMS = 100;
  /**
   * Internal value managed by minFPS property setter and getter.
   * This is the minimum allowed milliseconds between updates.
   */
  _minElapsedMS = 0;
  /** If enabled, deleting is disabled.*/
  _protected = !1;
  /** The last time keyframe was executed. Maintains a relatively fixed interval with the previous value. */
  _lastFrame = -1;
  /**
   * Internal tick method bound to ticker instance.
   * This is because in early 2015, Function.bind
   * is still 60% slower in high performance scenarios.
   * Also separating frame requests from update method
   * so listeners may be called at any time and with
   * any animation API, just invoke ticker.update(time).
   * @param time - Time since last tick.
   */
  _tick;
  constructor() {
    this._head = new _e(null, null, 1 / 0), this.deltaMS = 1 / U.targetFPMS, this.elapsedMS = 1 / U.targetFPMS, this._tick = (t) => {
      this._requestId = null, this.started && (this.update(t), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
    };
  }
  /**
   * Conditionally requests a new animation frame.
   * If a frame has not already been requested, and if the internal
   * emitter has listeners, a new frame is requested.
   */
  _requestIfNeeded() {
    this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
  }
  /** Conditionally cancels a pending animation frame. */
  _cancelIfNeeded() {
    this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
  }
  /**
   * Conditionally requests a new animation frame.
   * If the ticker has been started it checks if a frame has not already
   * been requested, and if the internal emitter has listeners. If these
   * conditions are met, a new frame is requested. If the ticker has not
   * been started, but autoStart is `true`, then the ticker starts now,
   * and continues with the previous conditions to request a new frame.
   */
  _startIfPossible() {
    this.started ? this._requestIfNeeded() : this.autoStart && this.start();
  }
  /**
   * Register a handler for tick events. Calls continuously unless
   * it is removed or the ticker is stopped.
   * @example
   * ```ts
   * // Basic update handler
   * ticker.add((ticker) => {
   *     // Update every frame
   *     sprite.rotation += 0.1 * ticker.deltaTime;
   * });
   *
   * // With specific context
   * const game = {
   *     update(ticker) {
   *         this.physics.update(ticker.deltaTime);
   *     }
   * };
   * ticker.add(game.update, game);
   *
   * // With priority
   * ticker.add(
   *     (ticker) => {
   *         // Runs before normal priority updates
   *         physics.update(ticker.deltaTime);
   *     },
   *     undefined,
   *     UPDATE_PRIORITY.HIGH
   * );
   * ```
   * @param fn - The listener function to be added for updates
   * @param context - The listener context
   * @param priority - The priority for emitting (default: UPDATE_PRIORITY.NORMAL)
   * @returns This instance of a ticker
   * @see {@link Ticker#addOnce} For one-time handlers
   * @see {@link Ticker#remove} For removing handlers
   */
  add(t, e, s = he.NORMAL) {
    return this._addListener(new _e(t, e, s));
  }
  /**
   * Add a handler for the tick event which is only executed once on the next frame.
   * @example
   * ```ts
   * // Basic one-time update
   * ticker.addOnce(() => {
   *     console.log('Runs next frame only');
   * });
   *
   * // With specific context
   * const game = {
   *     init(ticker) {
   *         this.loadResources();
   *         console.log('Game initialized');
   *     }
   * };
   * ticker.addOnce(game.init, game);
   *
   * // With priority
   * ticker.addOnce(
   *     () => {
   *         // High priority one-time setup
   *         physics.init();
   *     },
   *     undefined,
   *     UPDATE_PRIORITY.HIGH
   * );
   * ```
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting (default: UPDATE_PRIORITY.NORMAL)
   * @returns This instance of a ticker
   * @see {@link Ticker#add} For continuous updates
   * @see {@link Ticker#remove} For removing handlers
   */
  addOnce(t, e, s = he.NORMAL) {
    return this._addListener(new _e(t, e, s, !0));
  }
  /**
   * Internally adds the event handler so that it can be sorted by priority.
   * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
   * before the rendering.
   * @private
   * @param listener - Current listener being added.
   * @returns This instance of a ticker
   */
  _addListener(t) {
    let e = this._head.next, s = this._head;
    if (!e)
      t.connect(s);
    else {
      for (; e; ) {
        if (t.priority > e.priority) {
          t.connect(s);
          break;
        }
        s = e, e = e.next;
      }
      t.previous || t.connect(s);
    }
    return this._startIfPossible(), this;
  }
  /**
   * Removes any handlers matching the function and context parameters.
   * If no handlers are left after removing, then it cancels the animation frame.
   * @example
   * ```ts
   * // Basic removal
   * const onTick = () => {
   *     sprite.rotation += 0.1;
   * };
   * ticker.add(onTick);
   * ticker.remove(onTick);
   *
   * // Remove with context
   * const game = {
   *     update(ticker) {
   *         this.physics.update(ticker.deltaTime);
   *     }
   * };
   * ticker.add(game.update, game);
   * ticker.remove(game.update, game);
   *
   * // Remove all matching handlers
   * // (if same function was added multiple times)
   * ticker.add(onTick);
   * ticker.add(onTick);
   * ticker.remove(onTick); // Removes all instances
   * ```
   * @param fn - The listener function to be removed
   * @param context - The listener context to be removed
   * @returns This instance of a ticker
   * @see {@link Ticker#add} For adding handlers
   * @see {@link Ticker#addOnce} For one-time handlers
   */
  remove(t, e) {
    let s = this._head.next;
    for (; s; )
      s.match(t, e) ? s = s.destroy() : s = s.next;
    return this._head.next || this._cancelIfNeeded(), this;
  }
  /**
   * The number of listeners on this ticker, calculated by walking through linked list.
   * @example
   * ```ts
   * // Check number of active listeners
   * const ticker = new Ticker();
   * console.log(ticker.count); // 0
   *
   * // Add some listeners
   * ticker.add(() => {});
   * ticker.add(() => {});
   * console.log(ticker.count); // 2
   *
   * // Check after cleanup
   * ticker.destroy();
   * console.log(ticker.count); // 0
   * ```
   * @readonly
   * @see {@link Ticker#add} For adding listeners
   * @see {@link Ticker#remove} For removing listeners
   */
  get count() {
    if (!this._head)
      return 0;
    let t = 0, e = this._head;
    for (; e = e.next; )
      t++;
    return t;
  }
  /**
   * Starts the ticker. If the ticker has listeners a new animation frame is requested at this point.
   * @example
   * ```ts
   * // Basic manual start
   * const ticker = new Ticker();
   * ticker.add(() => {
   *     // Animation code here
   * });
   * ticker.start();
   * ```
   * @see {@link Ticker#stop} For stopping the ticker
   * @see {@link Ticker#autoStart} For automatic starting
   * @see {@link Ticker#started} For checking ticker state
   */
  start() {
    this.started || (this.started = !0, this._requestIfNeeded());
  }
  /**
   * Stops the ticker. If the ticker has requested an animation frame it is canceled at this point.
   * @example
   * ```ts
   * // Basic stop
   * const ticker = new Ticker();
   * ticker.stop();
   * ```
   * @see {@link Ticker#start} For starting the ticker
   * @see {@link Ticker#started} For checking ticker state
   * @see {@link Ticker#destroy} For cleaning up the ticker
   */
  stop() {
    this.started && (this.started = !1, this._cancelIfNeeded());
  }
  /**
   * Destroy the ticker and don't use after this. Calling this method removes all references to internal events.
   * @example
   * ```ts
   * // Clean up with active listeners
   * const ticker = new Ticker();
   * ticker.add(() => {});
   * ticker.destroy(); // Removes all listeners
   * ```
   * @see {@link Ticker#stop} For stopping without destroying
   * @see {@link Ticker#remove} For removing specific listeners
   */
  destroy() {
    if (!this._protected) {
      this.stop();
      let t = this._head.next;
      for (; t; )
        t = t.destroy(!0);
      this._head.destroy(), this._head = null;
    }
  }
  /**
   * Triggers an update.
   *
   * An update entails setting the
   * current {@link Ticker#elapsedMS|elapsedMS},
   * the current {@link Ticker#deltaTime|deltaTime},
   * invoking all listeners with current deltaTime,
   * and then finally setting {@link Ticker#lastTime|lastTime}
   * with the value of currentTime that was provided.
   *
   * This method will be called automatically by animation
   * frame callbacks if the ticker instance has been started
   * and listeners are added.
   * @example
   * ```ts
   * // Basic manual update
   * const ticker = new Ticker();
   * ticker.update(performance.now());
   * ```
   * @param currentTime - The current time of execution (defaults to performance.now())
   * @see {@link Ticker#deltaTime} For frame delta value
   * @see {@link Ticker#elapsedMS} For raw elapsed time
   */
  update(t = performance.now()) {
    let e;
    if (t > this.lastTime) {
      if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
        const r = t - this._lastFrame | 0;
        if (r < this._minElapsedMS)
          return;
        this._lastFrame = t - r % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * U.targetFPMS;
      const s = this._head;
      let n = s.next;
      for (; n; )
        n = n.emit(this);
      s.next || this._cancelIfNeeded();
    } else
      this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    this.lastTime = t;
  }
  /**
   * The frames per second at which this ticker is running.
   * The default is approximately 60 in most modern browsers.
   * > [!NOTE] This does not factor in the value of
   * > {@link Ticker#speed|speed}, which is specific
   * > to scaling {@link Ticker#deltaTime|deltaTime}.
   * @example
   * ```ts
   * // Basic FPS monitoring
   * ticker.add(() => {
   *     console.log(`Current FPS: ${Math.round(ticker.FPS)}`);
   * });
   * ```
   * @readonly
   */
  get FPS() {
    return 1e3 / this.elapsedMS;
  }
  /**
   * Manages the maximum amount of milliseconds allowed to
   * elapse between invoking {@link Ticker#update|update}.
   *
   * This value is used to cap {@link Ticker#deltaTime|deltaTime},
   * but does not effect the measured value of {@link Ticker#FPS|FPS}.
   *
   * When setting this property it is clamped to a value between
   * `0` and `Ticker.targetFPMS * 1000`.
   * @example
   * ```ts
   * // Set minimum acceptable frame rate
   * const ticker = new Ticker();
   * ticker.minFPS = 30; // Never go below 30 FPS
   *
   * // Use with maxFPS for frame rate clamping
   * ticker.minFPS = 30;
   * ticker.maxFPS = 60;
   *
   * // Monitor delta capping
   * ticker.add(() => {
   *     // Delta time will be capped based on minFPS
   *     console.log(`Delta time: ${ticker.deltaTime}`);
   * });
   * ```
   * @default 10
   */
  get minFPS() {
    return 1e3 / this._maxElapsedMS;
  }
  set minFPS(t) {
    const e = Math.min(this.maxFPS, t), s = Math.min(Math.max(0, e) / 1e3, U.targetFPMS);
    this._maxElapsedMS = 1 / s;
  }
  /**
   * Manages the minimum amount of milliseconds required to
   * elapse between invoking {@link Ticker#update|update}.
   *
   * This will effect the measured value of {@link Ticker#FPS|FPS}.
   *
   * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
   * Otherwise it will be at least `minFPS`
   * @example
   * ```ts
   * // Set minimum acceptable frame rate
   * const ticker = new Ticker();
   * ticker.maxFPS = 60; // Never go above 60 FPS
   *
   * // Use with maxFPS for frame rate clamping
   * ticker.minFPS = 30;
   * ticker.maxFPS = 60;
   *
   * // Monitor delta capping
   * ticker.add(() => {
   *     // Delta time will be capped based on maxFPS
   *     console.log(`Delta time: ${ticker.deltaTime}`);
   * });
   * ```
   * @default 0
   */
  get maxFPS() {
    return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
  }
  set maxFPS(t) {
    if (t === 0)
      this._minElapsedMS = 0;
    else {
      const e = Math.max(this.minFPS, t);
      this._minElapsedMS = 1 / (e / 1e3);
    }
  }
  /**
   * The shared ticker instance used by {@link AnimatedSprite} and by
   * {@link VideoSource} to update animation frames / video textures.
   *
   * It may also be used by {@link Application} if created with the `sharedTicker` option property set to true.
   *
   * The property {@link Ticker#autoStart|autoStart} is set to `true` for this instance.
   * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
   * @example
   * import { Ticker } from 'pixi.js';
   *
   * const ticker = Ticker.shared;
   * // Set this to prevent starting this ticker when listeners are added.
   * // By default this is true only for the Ticker.shared instance.
   * ticker.autoStart = false;
   *
   * // FYI, call this to ensure the ticker is stopped. It should be stopped
   * // if you have not attempted to render anything yet.
   * ticker.stop();
   *
   * // Call this when you are ready for a running shared ticker.
   * ticker.start();
   * @example
   * import { autoDetectRenderer, Container } from 'pixi.js';
   *
   * // You may use the shared ticker to render...
   * const renderer = autoDetectRenderer();
   * const stage = new Container();
   * document.body.appendChild(renderer.view);
   * ticker.add((time) => renderer.render(stage));
   *
   * // Or you can just update it manually.
   * ticker.autoStart = false;
   * ticker.stop();
   * const animate = (time) => {
   *     ticker.update(time);
   *     renderer.render(stage);
   *     requestAnimationFrame(animate);
   * };
   * animate(performance.now());
   * @type {Ticker}
   * @readonly
   */
  static get shared() {
    if (!U._shared) {
      const t = U._shared = new U();
      t.autoStart = !0, t._protected = !0;
    }
    return U._shared;
  }
  /**
   * The system ticker instance used by {@link PrepareBase} for core timing
   * functionality that shouldn't usually need to be paused, unlike the `shared`
   * ticker which drives visual animations and rendering which may want to be paused.
   *
   * The property {@link Ticker#autoStart|autoStart} is set to `true` for this instance.
   * @type {Ticker}
   * @readonly
   * @advanced
   */
  static get system() {
    if (!U._system) {
      const t = U._system = new U();
      t.autoStart = !0, t._protected = !0;
    }
    return U._system;
  }
}
class Li {
  /** The event system. */
  events;
  /** The DOM element to listen to events on. */
  domElement;
  /** The frequency that fake events will be fired. */
  interactionFrequency = 10;
  _deltaTime = 0;
  _didMove = !1;
  _tickerAdded = !1;
  _pauseUpdate = !0;
  /**
   * Initializes the event ticker.
   * @param events - The event system.
   */
  init(t) {
    this.removeTickerListener(), this.events = t, this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
  }
  /** Whether to pause the update checks or not. */
  get pauseUpdate() {
    return this._pauseUpdate;
  }
  set pauseUpdate(t) {
    this._pauseUpdate = t;
  }
  /** Adds the ticker listener. */
  addTickerListener() {
    this._tickerAdded || !this.domElement || (U.system.add(this._tickerUpdate, this, he.INTERACTION), this._tickerAdded = !0);
  }
  /** Removes the ticker listener. */
  removeTickerListener() {
    this._tickerAdded && (U.system.remove(this._tickerUpdate, this), this._tickerAdded = !1);
  }
  /** Sets flag to not fire extra events when the user has already moved there mouse */
  pointerMoved() {
    this._didMove = !0;
  }
  /** Updates the state of interactive objects. */
  _update() {
    if (!this.domElement || this._pauseUpdate)
      return;
    if (this._didMove) {
      this._didMove = !1;
      return;
    }
    const t = this.events._rootPointerEvent;
    this.events.supportsTouchEvents && t.pointerType === "touch" || globalThis.document.dispatchEvent(this.events.supportsPointerEvents ? new PointerEvent("pointermove", {
      clientX: t.clientX,
      clientY: t.clientY,
      pointerType: t.pointerType,
      pointerId: t.pointerId
    }) : new MouseEvent("mousemove", {
      clientX: t.clientX,
      clientY: t.clientY
    }));
  }
  /**
   * Updates the state of interactive objects if at least {@link interactionFrequency}
   * milliseconds have passed since the last invocation.
   *
   * Invoked by a throttled ticker update from {@link Ticker.system}.
   * @param ticker - The throttled ticker.
   */
  _tickerUpdate(t) {
    this._deltaTime += t.deltaTime, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this._update());
  }
}
const rt = new Li();
class de {
  /** Flags whether this event bubbles. This will take effect only if it is set before propagation. */
  bubbles = !0;
  /** @deprecated since 7.0.0 */
  cancelBubble = !0;
  /**
   * Flags whether this event can be canceled using {@link FederatedEvent.preventDefault}. This is always
   * false (for now).
   */
  cancelable = !1;
  /**
   * Flag added for compatibility with DOM `Event`. It is not used in the Federated Events
   * API.
   * @see https://dom.spec.whatwg.org/#dom-event-composed
   * @ignore
   */
  composed = !1;
  /** The listeners of the event target that are being notified. */
  currentTarget;
  /** Flags whether the default response of the user agent was prevent through this event. */
  defaultPrevented = !1;
  /**
   * The propagation phase.
   * @default {@link FederatedEvent.NONE}
   */
  eventPhase = de.prototype.NONE;
  /** Flags whether this is a user-trusted event */
  isTrusted;
  /** @deprecated since 7.0.0 */
  returnValue;
  /** @deprecated since 7.0.0 */
  srcElement;
  /** The event target that this will be dispatched to. */
  target;
  /** The timestamp of when the event was created. */
  timeStamp;
  /** The type of event, e.g. `"mouseup"`. */
  type;
  /** The native event that caused the foremost original event. */
  nativeEvent;
  /** The original event that caused this event, if any. */
  originalEvent;
  /** Flags whether propagation was stopped. */
  propagationStopped = !1;
  /** Flags whether propagation was immediately stopped. */
  propagationImmediatelyStopped = !1;
  /** The composed path of the event's propagation. The `target` is at the end. */
  path;
  /** The {@link EventBoundary} that manages this event. Null for root events. */
  manager;
  /** Event-specific detail */
  detail;
  /** The global Window object. */
  view;
  /**
   * Not supported.
   * @deprecated since 7.0.0
   * @ignore
   */
  which;
  /** The coordinates of the event relative to the nearest DOM layer. This is a non-standard property. */
  layer = new F();
  /** @readonly */
  get layerX() {
    return this.layer.x;
  }
  /** @readonly */
  get layerY() {
    return this.layer.y;
  }
  /** The coordinates of the event relative to the DOM document. This is a non-standard property. */
  page = new F();
  /** @readonly */
  get pageX() {
    return this.page.x;
  }
  /** @readonly */
  get pageY() {
    return this.page.y;
  }
  /**
   * @param manager - The event boundary which manages this event. Propagation can only occur
   *  within the boundary's jurisdiction.
   */
  constructor(t) {
    this.manager = t;
  }
  /**
   * Fallback for the deprecated `InteractionEvent.data`.
   * @deprecated since 7.0.0
   */
  get data() {
    return this;
  }
  /**
   * The propagation path for this event. Alias for {@link EventBoundary.propagationPath}.
   * @advanced
   */
  composedPath() {
    return this.manager && (!this.path || this.path[this.path.length - 1] !== this.target) && (this.path = this.target ? this.manager.propagationPath(this.target) : []), this.path;
  }
  /**
   * Unimplemented method included for implementing the DOM interface `Event`. It will throw an `Error`.
   * @deprecated
   * @ignore
   * @param _type
   * @param _bubbles
   * @param _cancelable
   */
  initEvent(t, e, s) {
    throw new Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  /**
   * Unimplemented method included for implementing the DOM interface `UIEvent`. It will throw an `Error`.
   * @ignore
   * @deprecated
   * @param _typeArg
   * @param _bubblesArg
   * @param _cancelableArg
   * @param _viewArg
   * @param _detailArg
   */
  initUIEvent(t, e, s, n, r) {
    throw new Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  /**
   * Prevent default behavior of both PixiJS and the user agent.
   * @example
   * ```ts
   * sprite.on('click', (event) => {
   *     // Prevent both browser's default click behavior
   *     // and PixiJS's default handling
   *     event.preventDefault();
   *
   *     // Custom handling
   *     customClickHandler();
   * });
   * ```
   * @remarks
   * - Only works if the native event is cancelable
   * - Does not stop event propagation
   */
  preventDefault() {
    this.nativeEvent instanceof Event && this.nativeEvent.cancelable && this.nativeEvent.preventDefault(), this.defaultPrevented = !0;
  }
  /**
   * Stop this event from propagating to any additional listeners, including those
   * on the current target and any following targets in the propagation path.
   * @example
   * ```ts
   * container.on('pointerdown', (event) => {
   *     // Stop all further event handling
   *     event.stopImmediatePropagation();
   *
   *     // These handlers won't be called:
   *     // - Other pointerdown listeners on this container
   *     // - Any pointerdown listeners on parent containers
   * });
   * ```
   * @remarks
   * - Immediately stops all event propagation
   * - Prevents other listeners on same target from being called
   * - More aggressive than stopPropagation()
   */
  stopImmediatePropagation() {
    this.propagationImmediatelyStopped = !0;
  }
  /**
   * Stop this event from propagating to the next target in the propagation path.
   * The rest of the listeners on the current target will still be notified.
   * @example
   * ```ts
   * child.on('pointermove', (event) => {
   *     // Handle event on child
   *     updateChild();
   *
   *     // Prevent parent handlers from being called
   *     event.stopPropagation();
   * });
   *
   * // This won't be called if child handles the event
   * parent.on('pointermove', (event) => {
   *     updateParent();
   * });
   * ```
   * @remarks
   * - Stops event bubbling to parent containers
   * - Does not prevent other listeners on same target
   * - Less aggressive than stopImmediatePropagation()
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
  /**
   * The event propagation phase NONE that indicates that the event is not in any phase.
   * @default 0
   * @advanced
   */
  NONE = 0;
  /**
   * The event propagation phase CAPTURING_PHASE that indicates that the event is in the capturing phase.
   * @default 1
   * @advanced
   */
  CAPTURING_PHASE = 1;
  /**
   * The event propagation phase AT_TARGET that indicates that the event is at the target.
   * @default 2
   * @advanced
   */
  AT_TARGET = 2;
  /**
   * The event propagation phase BUBBLING_PHASE that indicates that the event is in the bubbling phase.
   * @default 3
   * @advanced
   */
  BUBBLING_PHASE = 3;
}
class le extends de {
  /** Whether the "alt" key was pressed when this mouse event occurred. */
  altKey;
  /** The specific button that was pressed in this mouse event. */
  button;
  /** The button depressed when this event occurred. */
  buttons;
  /** Whether the "control" key was pressed when this mouse event occurred. */
  ctrlKey;
  /** Whether the "meta" key was pressed when this mouse event occurred. */
  metaKey;
  /** This is currently not implemented in the Federated Events API. */
  relatedTarget;
  /** Whether the "shift" key was pressed when this mouse event occurred. */
  shiftKey;
  /** The coordinates of the mouse event relative to the canvas. */
  client = new F();
  /** @readonly */
  get clientX() {
    return this.client.x;
  }
  /** @readonly */
  get clientY() {
    return this.client.y;
  }
  /**
   * Alias for {@link FederatedMouseEvent.clientX this.clientX}.
   * @readonly
   */
  get x() {
    return this.clientX;
  }
  /**
   * Alias for {@link FederatedMouseEvent.clientY this.clientY}.
   * @readonly
   */
  get y() {
    return this.clientY;
  }
  /** This is the number of clicks that occurs in 200ms/click of each other. */
  detail = 0;
  /** The movement in this pointer relative to the last `mousemove` event. */
  movement = new F();
  /** @readonly */
  get movementX() {
    return this.movement.x;
  }
  /** @readonly */
  get movementY() {
    return this.movement.y;
  }
  /** The offset of the pointer coordinates w.r.t. target Container in world space. This is not supported at the moment. */
  offset = new F();
  /** @readonly */
  get offsetX() {
    return this.offset.x;
  }
  /** @readonly */
  get offsetY() {
    return this.offset.y;
  }
  /** The pointer coordinates in world space. */
  global = new F();
  /** @readonly */
  get globalX() {
    return this.global.x;
  }
  /** @readonly */
  get globalY() {
    return this.global.y;
  }
  /**
   * The pointer coordinates in the renderer's {@link AbstractRenderer.screen screen}. This has slightly
   * different semantics than native PointerEvent screenX/screenY.
   */
  screen = new F();
  /**
   * The pointer coordinates in the renderer's screen. Alias for `screen.x`.
   * @readonly
   */
  get screenX() {
    return this.screen.x;
  }
  /**
   * The pointer coordinates in the renderer's screen. Alias for `screen.y`.
   * @readonly
   */
  get screenY() {
    return this.screen.y;
  }
  /**
   * Converts global coordinates into container-local coordinates.
   *
   * This method transforms coordinates from world space to a container's local space,
   * useful for precise positioning and hit testing.
   * @param container - The Container to get local coordinates for
   * @param point - Optional Point object to store the result. If not provided, a new Point will be created
   * @param globalPos - Optional custom global coordinates. If not provided, the event's global position is used
   * @returns The local coordinates as a Point object
   * @example
   * ```ts
   * // Basic usage - get local coordinates relative to a container
   * sprite.on('pointermove', (event: FederatedMouseEvent) => {
   *     // Get position relative to the sprite
   *     const localPos = event.getLocalPosition(sprite);
   *     console.log('Local position:', localPos.x, localPos.y);
   * });
   * // Using custom global coordinates
   * const customGlobal = new Point(100, 100);
   * sprite.on('pointermove', (event: FederatedMouseEvent) => {
   *     // Transform custom coordinates
   *     const localPos = event.getLocalPosition(sprite, undefined, customGlobal);
   *     console.log('Custom local position:', localPos.x, localPos.y);
   * });
   * ```
   * @see {@link Container.worldTransform} For the transformation matrix
   * @see {@link Point} For the point class used to store coordinates
   */
  getLocalPosition(t, e, s) {
    return t.worldTransform.applyInverse(s || this.global, e);
  }
  /**
   * Whether the modifier key was pressed when this event natively occurred.
   * @param key - The modifier key.
   */
  getModifierState(t) {
    return "getModifierState" in this.nativeEvent && this.nativeEvent.getModifierState(t);
  }
  /**
   * Not supported.
   * @param _typeArg
   * @param _canBubbleArg
   * @param _cancelableArg
   * @param _viewArg
   * @param _detailArg
   * @param _screenXArg
   * @param _screenYArg
   * @param _clientXArg
   * @param _clientYArg
   * @param _ctrlKeyArg
   * @param _altKeyArg
   * @param _shiftKeyArg
   * @param _metaKeyArg
   * @param _buttonArg
   * @param _relatedTargetArg
   * @deprecated since 7.0.0
   * @ignore
   */
  // eslint-disable-next-line max-params
  initMouseEvent(t, e, s, n, r, o, a, h, c, l, u, f, d, p, m) {
    throw new Error("Method not implemented.");
  }
}
class Q extends le {
  /**
   * The unique identifier of the pointer.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId}
   */
  pointerId;
  /**
   * The width of the pointer's contact along the x-axis, measured in CSS pixels.
   * radiusX of TouchEvents will be represented by this value.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width
   */
  width = 0;
  /**
   * The angle in radians of a pointer or stylus measuring the vertical angle between
   * the device's surface to the pointer or stylus.
   * A stylus at 0 degrees would be directly parallel whereas at π/2 degrees it would be perpendicular.
   * @see https://developer.mozilla.org/docs/Web/API/PointerEvent/altitudeAngle)
   */
  altitudeAngle;
  /**
   * The angle in radians of a pointer or stylus measuring an arc from the X axis of the device to
   * the pointer or stylus projected onto the screen's plane.
   * A stylus at 0 degrees would be pointing to the "0 o'clock" whereas at π/2 degrees it would be pointing at "6 o'clock".
   * @see https://developer.mozilla.org/docs/Web/API/PointerEvent/azimuthAngle)
   */
  azimuthAngle;
  /**
   * The height of the pointer's contact along the y-axis, measured in CSS pixels.
   * radiusY of TouchEvents will be represented by this value.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height
   */
  height = 0;
  /**
   * Indicates whether or not the pointer device that created the event is the primary pointer.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary
   */
  isPrimary = !1;
  /**
   * The type of pointer that triggered the event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType
   */
  pointerType;
  /**
   * Pressure applied by the pointing device during the event.
   *s
   * A Touch's force property will be represented by this value.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure
   */
  pressure;
  /**
   * Barrel pressure on a stylus pointer.
   * @see https://w3c.github.io/pointerevents/#pointerevent-interface
   */
  tangentialPressure;
  /**
   * The angle, in degrees, between the pointer device and the screen.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX
   */
  tiltX;
  /**
   * The angle, in degrees, between the pointer device and the screen.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY
   */
  tiltY;
  /**
   * Twist of a stylus pointer.
   * @see https://w3c.github.io/pointerevents/#pointerevent-interface
   */
  twist;
  /** This is the number of clicks that occurs in 200ms/click of each other. */
  detail = 0;
  /**
   * Only included for completeness for now
   * @ignore
   */
  getCoalescedEvents() {
    return this.type === "pointermove" || this.type === "mousemove" || this.type === "touchmove" ? [this] : [];
  }
  /**
   * Only included for completeness for now
   * @ignore
   */
  getPredictedEvents() {
    throw new Error("getPredictedEvents is not supported!");
  }
}
class Te extends le {
  /**
   * The units of `deltaX`, `deltaY`, and `deltaZ`. This is one of `DOM_DELTA_LINE`,
   * `DOM_DELTA_PAGE`, `DOM_DELTA_PIXEL`.
   */
  deltaMode;
  /** Horizontal scroll amount */
  deltaX;
  /** Vertical scroll amount */
  deltaY;
  /** z-axis scroll amount. */
  deltaZ;
  /**
   * Units specified in pixels.
   * @ignore
   */
  static DOM_DELTA_PIXEL = 0;
  /**
   * Units specified in pixels.
   * @ignore
   */
  DOM_DELTA_PIXEL = 0;
  /**
   * Units specified in lines.
   * @ignore
   */
  static DOM_DELTA_LINE = 1;
  /**
   * Units specified in lines.
   * @ignore
   */
  DOM_DELTA_LINE = 1;
  /**
   * Units specified in pages.
   * @ignore
   */
  static DOM_DELTA_PAGE = 2;
  /**
   * Units specified in pages.
   * @ignore
   */
  DOM_DELTA_PAGE = 2;
}
const Bi = 2048, Xi = new F(), It = new F();
function Yi(...i) {
}
class Ui {
  /**
   * The root event-target residing below the event boundary.
   * All events are dispatched trickling down and bubbling up to this `rootTarget`.
   */
  rootTarget;
  /**
   * Emits events after they were dispatched into the scene graph.
   *
   * This can be used for global events listening, regardless of the scene graph being used. It should
   * not be used by interactive libraries for normal use.
   *
   * Special events that do not bubble all the way to the root target are not emitted from here,
   * e.g. pointerenter, pointerleave, click.
   */
  dispatch = new Y();
  /** The cursor preferred by the event targets underneath this boundary. */
  cursor;
  /**
   * This flag would emit `pointermove`, `touchmove`, and `mousemove` events on all Containers.
   *
   * The `moveOnAll` semantics mirror those of earlier versions of PixiJS. This was disabled in favor of
   * the Pointer Event API's approach.
   */
  moveOnAll = !1;
  /** Enables the global move events. `globalpointermove`, `globaltouchmove`, and `globalmousemove` */
  enableGlobalMoveEvents = !0;
  /**
   * Maps event types to forwarding handles for them.
   *
   * {@link EventBoundary EventBoundary} provides mapping for "pointerdown", "pointermove",
   * "pointerout", "pointerleave", "pointerover", "pointerup", and "pointerupoutside" by default.
   * @see EventBoundary#addEventMapping
   */
  mappingTable;
  /**
   * State object for mapping methods.
   * @see EventBoundary#trackingData
   */
  mappingState = {
    trackingData: {}
  };
  /**
   * The event pool maps event constructors to an free pool of instances of those specific events.
   * @see EventBoundary#allocateEvent
   * @see EventBoundary#freeEvent
   */
  eventPool = /* @__PURE__ */ new Map();
  /** Every interactive element gathered from the scene. Only used in `pointermove` */
  _allInteractiveElements = [];
  /** Every element that passed the hit test. Only used in `pointermove` */
  _hitElements = [];
  /** Whether or not to collect all the interactive elements from the scene. Enabled in `pointermove` */
  _isPointerMoveEvent = !1;
  /**
   * @param rootTarget - The holder of the event boundary.
   */
  constructor(t) {
    this.rootTarget = t, this.hitPruneFn = this.hitPruneFn.bind(this), this.hitTestFn = this.hitTestFn.bind(this), this.mapPointerDown = this.mapPointerDown.bind(this), this.mapPointerMove = this.mapPointerMove.bind(this), this.mapPointerOut = this.mapPointerOut.bind(this), this.mapPointerOver = this.mapPointerOver.bind(this), this.mapPointerUp = this.mapPointerUp.bind(this), this.mapPointerUpOutside = this.mapPointerUpOutside.bind(this), this.mapWheel = this.mapWheel.bind(this), this.mappingTable = {}, this.addEventMapping("pointerdown", this.mapPointerDown), this.addEventMapping("pointermove", this.mapPointerMove), this.addEventMapping("pointerout", this.mapPointerOut), this.addEventMapping("pointerleave", this.mapPointerOut), this.addEventMapping("pointerover", this.mapPointerOver), this.addEventMapping("pointerup", this.mapPointerUp), this.addEventMapping("pointerupoutside", this.mapPointerUpOutside), this.addEventMapping("wheel", this.mapWheel);
  }
  /**
   * Adds an event mapping for the event `type` handled by `fn`.
   *
   * Event mappings can be used to implement additional or custom events. They take an event
   * coming from the upstream scene (or directly from the {@link EventSystem}) and dispatch new downstream events
   * generally trickling down and bubbling up to {@link EventBoundary.rootTarget this.rootTarget}.
   *
   * To modify the semantics of existing events, the built-in mapping methods of EventBoundary should be overridden
   * instead.
   * @param type - The type of upstream event to map.
   * @param fn - The mapping method. The context of this function must be bound manually, if desired.
   */
  addEventMapping(t, e) {
    this.mappingTable[t] || (this.mappingTable[t] = []), this.mappingTable[t].push({
      fn: e,
      priority: 0
    }), this.mappingTable[t].sort((s, n) => s.priority - n.priority);
  }
  /**
   * Dispatches the given event
   * @param e - The event to dispatch.
   * @param type - The type of event to dispatch. Defaults to `e.type`.
   */
  dispatchEvent(t, e) {
    t.propagationStopped = !1, t.propagationImmediatelyStopped = !1, this.propagate(t, e), this.dispatch.emit(e || t.type, t);
  }
  /**
   * Maps the given upstream event through the event boundary and propagates it downstream.
   * @param e - The event to map.
   */
  mapEvent(t) {
    if (!this.rootTarget)
      return;
    const e = this.mappingTable[t.type];
    if (e)
      for (let s = 0, n = e.length; s < n; s++)
        e[s].fn(t);
    else
      Yi(`[EventBoundary]: Event mapping not defined for ${t.type}`);
  }
  /**
   * Finds the Container that is the target of a event at the given coordinates.
   *
   * The passed (x,y) coordinates are in the world space above this event boundary.
   * @param x - The x coordinate of the event.
   * @param y - The y coordinate of the event.
   */
  hitTest(t, e) {
    rt.pauseUpdate = !0;
    const n = this._isPointerMoveEvent && this.enableGlobalMoveEvents ? "hitTestMoveRecursive" : "hitTestRecursive", r = this[n](
      this.rootTarget,
      this.rootTarget.eventMode,
      Xi.set(t, e),
      this.hitTestFn,
      this.hitPruneFn
    );
    return r && r[0];
  }
  /**
   * Propagate the passed event from from {@link EventBoundary.rootTarget this.rootTarget} to its
   * target `e.target`.
   * @param e - The event to propagate.
   * @param type - The type of event to propagate. Defaults to `e.type`.
   */
  propagate(t, e) {
    if (!t.target)
      return;
    const s = t.composedPath();
    t.eventPhase = t.CAPTURING_PHASE;
    for (let n = 0, r = s.length - 1; n < r; n++)
      if (t.currentTarget = s[n], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped) return;
    if (t.eventPhase = t.AT_TARGET, t.currentTarget = t.target, this.notifyTarget(t, e), !(t.propagationStopped || t.propagationImmediatelyStopped)) {
      t.eventPhase = t.BUBBLING_PHASE;
      for (let n = s.length - 2; n >= 0; n--)
        if (t.currentTarget = s[n], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped) return;
    }
  }
  /**
   * Emits the event `e` to all interactive containers. The event is propagated in the bubbling phase always.
   *
   * This is used in the `globalpointermove` event.
   * @param e - The emitted event.
   * @param type - The listeners to notify.
   * @param targets - The targets to notify.
   */
  all(t, e, s = this._allInteractiveElements) {
    if (s.length === 0) return;
    t.eventPhase = t.BUBBLING_PHASE;
    const n = Array.isArray(e) ? e : [e];
    for (let r = s.length - 1; r >= 0; r--)
      n.forEach((o) => {
        t.currentTarget = s[r], this.notifyTarget(t, o);
      });
  }
  /**
   * Finds the propagation path from {@link EventBoundary.rootTarget rootTarget} to the passed
   * `target`. The last element in the path is `target`.
   * @param target - The target to find the propagation path to.
   */
  propagationPath(t) {
    const e = [t];
    for (let s = 0; s < Bi && t !== this.rootTarget && t.parent; s++) {
      if (!t.parent)
        throw new Error("Cannot find propagation path to disconnected target");
      e.push(t.parent), t = t.parent;
    }
    return e.reverse(), e;
  }
  hitTestMoveRecursive(t, e, s, n, r, o = !1) {
    let a = !1;
    if (this._interactivePrune(t)) return null;
    if ((t.eventMode === "dynamic" || e === "dynamic") && (rt.pauseUpdate = !1), t.interactiveChildren && t.children) {
      const l = t.children;
      for (let u = l.length - 1; u >= 0; u--) {
        const f = l[u], d = this.hitTestMoveRecursive(
          f,
          this._isInteractive(e) ? e : f.eventMode,
          s,
          n,
          r,
          o || r(t, s)
        );
        if (d) {
          if (d.length > 0 && !d[d.length - 1].parent)
            continue;
          const p = t.isInteractive();
          (d.length > 0 || p) && (p && this._allInteractiveElements.push(t), d.push(t)), this._hitElements.length === 0 && (this._hitElements = d), a = !0;
        }
      }
    }
    const h = this._isInteractive(e), c = t.isInteractive();
    return c && c && this._allInteractiveElements.push(t), o || this._hitElements.length > 0 ? null : a ? this._hitElements : h && !r(t, s) && n(t, s) ? c ? [t] : [] : null;
  }
  /**
   * Recursive implementation for {@link EventBoundary.hitTest hitTest}.
   * @param currentTarget - The Container that is to be hit tested.
   * @param eventMode - The event mode for the `currentTarget` or one of its parents.
   * @param location - The location that is being tested for overlap.
   * @param testFn - Callback that determines whether the target passes hit testing. This callback
   *  can assume that `pruneFn` failed to prune the container.
   * @param pruneFn - Callback that determiness whether the target and all of its children
   *  cannot pass the hit test. It is used as a preliminary optimization to prune entire subtrees
   *  of the scene graph.
   * @returns An array holding the hit testing target and all its ancestors in order. The first element
   *  is the target itself and the last is {@link EventBoundary.rootTarget rootTarget}. This is the opposite
   *  order w.r.t. the propagation path. If no hit testing target is found, null is returned.
   */
  hitTestRecursive(t, e, s, n, r) {
    if (this._interactivePrune(t) || r(t, s))
      return null;
    if ((t.eventMode === "dynamic" || e === "dynamic") && (rt.pauseUpdate = !1), t.interactiveChildren && t.children) {
      const h = t.children, c = s;
      for (let l = h.length - 1; l >= 0; l--) {
        const u = h[l], f = this.hitTestRecursive(
          u,
          this._isInteractive(e) ? e : u.eventMode,
          c,
          n,
          r
        );
        if (f) {
          if (f.length > 0 && !f[f.length - 1].parent)
            continue;
          const d = t.isInteractive();
          return (f.length > 0 || d) && f.push(t), f;
        }
      }
    }
    const o = this._isInteractive(e), a = t.isInteractive();
    return o && n(t, s) ? a ? [t] : [] : null;
  }
  _isInteractive(t) {
    return t === "static" || t === "dynamic";
  }
  _interactivePrune(t) {
    return !t || !t.visible || !t.renderable || !t.measurable || t.eventMode === "none" || t.eventMode === "passive" && !t.interactiveChildren;
  }
  /**
   * Checks whether the container or any of its children cannot pass the hit test at all.
   *
   * {@link EventBoundary}'s implementation uses the {@link Container.hitArea hitArea}
   * and {@link Container._maskEffect} for pruning.
   * @param container - The container to prune.
   * @param location - The location to test for overlap.
   */
  hitPruneFn(t, e) {
    if (t.hitArea && (t.worldTransform.applyInverse(e, It), !t.hitArea.contains(It.x, It.y)))
      return !0;
    if (t.effects && t.effects.length)
      for (let s = 0; s < t.effects.length; s++) {
        const n = t.effects[s];
        if (n.containsPoint && !n.containsPoint(e, this.hitTestFn))
          return !0;
      }
    return !1;
  }
  /**
   * Checks whether the container passes hit testing for the given location.
   * @param container - The container to test.
   * @param location - The location to test for overlap.
   * @returns - Whether `container` passes hit testing for `location`.
   */
  hitTestFn(t, e) {
    return t.hitArea ? !0 : t?.containsPoint ? (t.worldTransform.applyInverse(e, It), t.containsPoint(It)) : !1;
  }
  /**
   * Notify all the listeners to the event's `currentTarget`.
   *
   * If the `currentTarget` contains the property `on<type>`, then it is called here,
   * simulating the behavior from version 6.x and prior.
   * @param e - The event passed to the target.
   * @param type - The type of event to notify. Defaults to `e.type`.
   */
  notifyTarget(t, e) {
    if (!t.currentTarget.isInteractive())
      return;
    e ??= t.type;
    const s = `on${e}`;
    t.currentTarget[s]?.(t);
    const n = t.eventPhase === t.CAPTURING_PHASE || t.eventPhase === t.AT_TARGET ? `${e}capture` : e;
    this._notifyListeners(t, n), t.eventPhase === t.AT_TARGET && this._notifyListeners(t, e);
  }
  /**
   * Maps the upstream `pointerdown` events to a downstream `pointerdown` event.
   *
   * `touchstart`, `rightdown`, `mousedown` events are also dispatched for specific pointer types.
   * @param from - The upstream `pointerdown` event.
   */
  mapPointerDown(t) {
    if (!(t instanceof Q))
      return;
    const e = this.createPointerEvent(t);
    if (this.dispatchEvent(e, "pointerdown"), e.pointerType === "touch")
      this.dispatchEvent(e, "touchstart");
    else if (e.pointerType === "mouse" || e.pointerType === "pen") {
      const n = e.button === 2;
      this.dispatchEvent(e, n ? "rightdown" : "mousedown");
    }
    const s = this.trackingData(t.pointerId);
    s.pressTargetsByButton[t.button] = e.composedPath(), this.freeEvent(e);
  }
  /**
   * Maps the upstream `pointermove` to downstream `pointerout`, `pointerover`, and `pointermove` events, in that order.
   *
   * The tracking data for the specific pointer has an updated `overTarget`. `mouseout`, `mouseover`,
   * `mousemove`, and `touchmove` events are fired as well for specific pointer types.
   * @param from - The upstream `pointermove` event.
   */
  mapPointerMove(t) {
    if (!(t instanceof Q))
      return;
    this._allInteractiveElements.length = 0, this._hitElements.length = 0, this._isPointerMoveEvent = !0;
    const e = this.createPointerEvent(t);
    this._isPointerMoveEvent = !1;
    const s = e.pointerType === "mouse" || e.pointerType === "pen", n = this.trackingData(t.pointerId), r = this.findMountedTarget(n.overTargets);
    if (n.overTargets?.length > 0 && r !== e.target) {
      const h = t.type === "mousemove" ? "mouseout" : "pointerout", c = this.createPointerEvent(t, h, r);
      if (this.dispatchEvent(c, "pointerout"), s && this.dispatchEvent(c, "mouseout"), !e.composedPath().includes(r)) {
        const l = this.createPointerEvent(t, "pointerleave", r);
        for (l.eventPhase = l.AT_TARGET; l.target && !e.composedPath().includes(l.target); )
          l.currentTarget = l.target, this.notifyTarget(l), s && this.notifyTarget(l, "mouseleave"), l.target = l.target.parent;
        this.freeEvent(l);
      }
      this.freeEvent(c);
    }
    if (r !== e.target) {
      const h = t.type === "mousemove" ? "mouseover" : "pointerover", c = this.clonePointerEvent(e, h);
      this.dispatchEvent(c, "pointerover"), s && this.dispatchEvent(c, "mouseover");
      let l = r?.parent;
      for (; l && l !== this.rootTarget.parent && l !== e.target; )
        l = l.parent;
      if (!l || l === this.rootTarget.parent) {
        const f = this.clonePointerEvent(e, "pointerenter");
        for (f.eventPhase = f.AT_TARGET; f.target && f.target !== r && f.target !== this.rootTarget.parent; )
          f.currentTarget = f.target, this.notifyTarget(f), s && this.notifyTarget(f, "mouseenter"), f.target = f.target.parent;
        this.freeEvent(f);
      }
      this.freeEvent(c);
    }
    const o = [], a = this.enableGlobalMoveEvents ?? !0;
    this.moveOnAll ? o.push("pointermove") : this.dispatchEvent(e, "pointermove"), a && o.push("globalpointermove"), e.pointerType === "touch" && (this.moveOnAll ? o.splice(1, 0, "touchmove") : this.dispatchEvent(e, "touchmove"), a && o.push("globaltouchmove")), s && (this.moveOnAll ? o.splice(1, 0, "mousemove") : this.dispatchEvent(e, "mousemove"), a && o.push("globalmousemove"), this.cursor = e.target?.cursor), o.length > 0 && this.all(e, o), this._allInteractiveElements.length = 0, this._hitElements.length = 0, n.overTargets = e.composedPath(), this.freeEvent(e);
  }
  /**
   * Maps the upstream `pointerover` to downstream `pointerover` and `pointerenter` events, in that order.
   *
   * The tracking data for the specific pointer gets a new `overTarget`.
   * @param from - The upstream `pointerover` event.
   */
  mapPointerOver(t) {
    if (!(t instanceof Q))
      return;
    const e = this.trackingData(t.pointerId), s = this.createPointerEvent(t), n = s.pointerType === "mouse" || s.pointerType === "pen";
    this.dispatchEvent(s, "pointerover"), n && this.dispatchEvent(s, "mouseover"), s.pointerType === "mouse" && (this.cursor = s.target?.cursor);
    const r = this.clonePointerEvent(s, "pointerenter");
    for (r.eventPhase = r.AT_TARGET; r.target && r.target !== this.rootTarget.parent; )
      r.currentTarget = r.target, this.notifyTarget(r), n && this.notifyTarget(r, "mouseenter"), r.target = r.target.parent;
    e.overTargets = s.composedPath(), this.freeEvent(s), this.freeEvent(r);
  }
  /**
   * Maps the upstream `pointerout` to downstream `pointerout`, `pointerleave` events, in that order.
   *
   * The tracking data for the specific pointer is cleared of a `overTarget`.
   * @param from - The upstream `pointerout` event.
   */
  mapPointerOut(t) {
    if (!(t instanceof Q))
      return;
    const e = this.trackingData(t.pointerId);
    if (e.overTargets) {
      const s = t.pointerType === "mouse" || t.pointerType === "pen", n = this.findMountedTarget(e.overTargets), r = this.createPointerEvent(t, "pointerout", n);
      this.dispatchEvent(r), s && this.dispatchEvent(r, "mouseout");
      const o = this.createPointerEvent(t, "pointerleave", n);
      for (o.eventPhase = o.AT_TARGET; o.target && o.target !== this.rootTarget.parent; )
        o.currentTarget = o.target, this.notifyTarget(o), s && this.notifyTarget(o, "mouseleave"), o.target = o.target.parent;
      e.overTargets = null, this.freeEvent(r), this.freeEvent(o);
    }
    this.cursor = null;
  }
  /**
   * Maps the upstream `pointerup` event to downstream `pointerup`, `pointerupoutside`,
   * and `click`/`rightclick`/`pointertap` events, in that order.
   *
   * The `pointerupoutside` event bubbles from the original `pointerdown` target to the most specific
   * ancestor of the `pointerdown` and `pointerup` targets, which is also the `click` event's target. `touchend`,
   * `rightup`, `mouseup`, `touchendoutside`, `rightupoutside`, `mouseupoutside`, and `tap` are fired as well for
   * specific pointer types.
   * @param from - The upstream `pointerup` event.
   */
  mapPointerUp(t) {
    if (!(t instanceof Q))
      return;
    const e = performance.now(), s = this.createPointerEvent(t);
    if (this.dispatchEvent(s, "pointerup"), s.pointerType === "touch")
      this.dispatchEvent(s, "touchend");
    else if (s.pointerType === "mouse" || s.pointerType === "pen") {
      const a = s.button === 2;
      this.dispatchEvent(s, a ? "rightup" : "mouseup");
    }
    const n = this.trackingData(t.pointerId), r = this.findMountedTarget(n.pressTargetsByButton[t.button]);
    let o = r;
    if (r && !s.composedPath().includes(r)) {
      let a = r;
      for (; a && !s.composedPath().includes(a); ) {
        if (s.currentTarget = a, this.notifyTarget(s, "pointerupoutside"), s.pointerType === "touch")
          this.notifyTarget(s, "touchendoutside");
        else if (s.pointerType === "mouse" || s.pointerType === "pen") {
          const h = s.button === 2;
          this.notifyTarget(s, h ? "rightupoutside" : "mouseupoutside");
        }
        a = a.parent;
      }
      delete n.pressTargetsByButton[t.button], o = a;
    }
    if (o) {
      const a = this.clonePointerEvent(s, "click");
      a.target = o, a.path = null, n.clicksByButton[t.button] || (n.clicksByButton[t.button] = {
        clickCount: 0,
        target: a.target,
        timeStamp: e
      });
      const h = n.clicksByButton[t.button];
      if (h.target === a.target && e - h.timeStamp < 200 ? ++h.clickCount : h.clickCount = 1, h.target = a.target, h.timeStamp = e, a.detail = h.clickCount, a.pointerType === "mouse") {
        const c = a.button === 2;
        this.dispatchEvent(a, c ? "rightclick" : "click");
      } else a.pointerType === "touch" && this.dispatchEvent(a, "tap");
      this.dispatchEvent(a, "pointertap"), this.freeEvent(a);
    }
    this.freeEvent(s);
  }
  /**
   * Maps the upstream `pointerupoutside` event to a downstream `pointerupoutside` event, bubbling from the original
   * `pointerdown` target to `rootTarget`.
   *
   * (The most specific ancestor of the `pointerdown` event and the `pointerup` event must the
   * `{@link EventBoundary}'s root because the `pointerup` event occurred outside of the boundary.)
   *
   * `touchendoutside`, `mouseupoutside`, and `rightupoutside` events are fired as well for specific pointer
   * types. The tracking data for the specific pointer is cleared of a `pressTarget`.
   * @param from - The upstream `pointerupoutside` event.
   */
  mapPointerUpOutside(t) {
    if (!(t instanceof Q))
      return;
    const e = this.trackingData(t.pointerId), s = this.findMountedTarget(e.pressTargetsByButton[t.button]), n = this.createPointerEvent(t);
    if (s) {
      let r = s;
      for (; r; )
        n.currentTarget = r, this.notifyTarget(n, "pointerupoutside"), n.pointerType === "touch" ? this.notifyTarget(n, "touchendoutside") : (n.pointerType === "mouse" || n.pointerType === "pen") && this.notifyTarget(n, n.button === 2 ? "rightupoutside" : "mouseupoutside"), r = r.parent;
      delete e.pressTargetsByButton[t.button];
    }
    this.freeEvent(n);
  }
  /**
   * Maps the upstream `wheel` event to a downstream `wheel` event.
   * @param from - The upstream `wheel` event.
   */
  mapWheel(t) {
    if (!(t instanceof Te))
      return;
    const e = this.createWheelEvent(t);
    this.dispatchEvent(e), this.freeEvent(e);
  }
  /**
   * Finds the most specific event-target in the given propagation path that is still mounted in the scene graph.
   *
   * This is used to find the correct `pointerup` and `pointerout` target in the case that the original `pointerdown`
   * or `pointerover` target was unmounted from the scene graph.
   * @param propagationPath - The propagation path was valid in the past.
   * @returns - The most specific event-target still mounted at the same location in the scene graph.
   */
  findMountedTarget(t) {
    if (!t)
      return null;
    let e = t[0];
    for (let s = 1; s < t.length && t[s].parent === e; s++)
      e = t[s];
    return e;
  }
  /**
   * Creates an event whose `originalEvent` is `from`, with an optional `type` and `target` override.
   *
   * The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The `originalEvent` for the returned event.
   * @param [type=from.type] - The type of the returned event.
   * @param target - The target of the returned event.
   */
  createPointerEvent(t, e, s) {
    const n = this.allocateEvent(Q);
    return this.copyPointerData(t, n), this.copyMouseData(t, n), this.copyData(t, n), n.nativeEvent = t.nativeEvent, n.originalEvent = t, n.target = s ?? this.hitTest(n.global.x, n.global.y) ?? this._hitElements[0], typeof e == "string" && (n.type = e), n;
  }
  /**
   * Creates a wheel event whose `originalEvent` is `from`.
   *
   * The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The upstream wheel event.
   */
  createWheelEvent(t) {
    const e = this.allocateEvent(Te);
    return this.copyWheelData(t, e), this.copyMouseData(t, e), this.copyData(t, e), e.nativeEvent = t.nativeEvent, e.originalEvent = t, e.target = this.hitTest(e.global.x, e.global.y), e;
  }
  /**
   * Clones the event `from`, with an optional `type` override.
   *
   * The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The event to clone.
   * @param [type=from.type] - The type of the returned event.
   */
  clonePointerEvent(t, e) {
    const s = this.allocateEvent(Q);
    return s.nativeEvent = t.nativeEvent, s.originalEvent = t.originalEvent, this.copyPointerData(t, s), this.copyMouseData(t, s), this.copyData(t, s), s.target = t.target, s.path = t.composedPath().slice(), s.type = e ?? s.type, s;
  }
  /**
   * Copies wheel {@link FederatedWheelEvent} data from `from` into `to`.
   *
   * The following properties are copied:
   * + deltaMode
   * + deltaX
   * + deltaY
   * + deltaZ
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyWheelData(t, e) {
    e.deltaMode = t.deltaMode, e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ;
  }
  /**
   * Copies pointer {@link FederatedPointerEvent} data from `from` into `to`.
   *
   * The following properties are copied:
   * + pointerId
   * + width
   * + height
   * + isPrimary
   * + pointerType
   * + pressure
   * + tangentialPressure
   * + tiltX
   * + tiltY
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyPointerData(t, e) {
    t instanceof Q && e instanceof Q && (e.pointerId = t.pointerId, e.width = t.width, e.height = t.height, e.isPrimary = t.isPrimary, e.pointerType = t.pointerType, e.pressure = t.pressure, e.tangentialPressure = t.tangentialPressure, e.tiltX = t.tiltX, e.tiltY = t.tiltY, e.twist = t.twist);
  }
  /**
   * Copies mouse {@link FederatedMouseEvent} data from `from` to `to`.
   *
   * The following properties are copied:
   * + altKey
   * + button
   * + buttons
   * + clientX
   * + clientY
   * + metaKey
   * + movementX
   * + movementY
   * + pageX
   * + pageY
   * + x
   * + y
   * + screen
   * + shiftKey
   * + global
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyMouseData(t, e) {
    t instanceof le && e instanceof le && (e.altKey = t.altKey, e.button = t.button, e.buttons = t.buttons, e.client.copyFrom(t.client), e.ctrlKey = t.ctrlKey, e.metaKey = t.metaKey, e.movement.copyFrom(t.movement), e.screen.copyFrom(t.screen), e.shiftKey = t.shiftKey, e.global.copyFrom(t.global));
  }
  /**
   * Copies base {@link FederatedEvent} data from `from` into `to`.
   *
   * The following properties are copied:
   * + isTrusted
   * + srcElement
   * + timeStamp
   * + type
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyData(t, e) {
    e.isTrusted = t.isTrusted, e.srcElement = t.srcElement, e.timeStamp = performance.now(), e.type = t.type, e.detail = t.detail, e.view = t.view, e.which = t.which, e.layer.copyFrom(t.layer), e.page.copyFrom(t.page);
  }
  /**
   * @param id - The pointer ID.
   * @returns The tracking data stored for the given pointer. If no data exists, a blank
   *  state will be created.
   */
  trackingData(t) {
    return this.mappingState.trackingData[t] || (this.mappingState.trackingData[t] = {
      pressTargetsByButton: {},
      clicksByButton: {},
      overTarget: null
    }), this.mappingState.trackingData[t];
  }
  /**
   * Allocate a specific type of event from {@link EventBoundary#eventPool this.eventPool}.
   *
   * This allocation is constructor-agnostic, as long as it only takes one argument - this event
   * boundary.
   * @param constructor - The event's constructor.
   * @returns An event of the given type.
   */
  allocateEvent(t) {
    this.eventPool.has(t) || this.eventPool.set(t, []);
    const e = this.eventPool.get(t).pop() || new t(this);
    return e.eventPhase = e.NONE, e.currentTarget = null, e.defaultPrevented = !1, e.path = null, e.target = null, e;
  }
  /**
   * Frees the event and puts it back into the event pool.
   *
   * It is illegal to reuse the event until it is allocated again, using `this.allocateEvent`.
   *
   * It is also advised that events not allocated from {@link EventBoundary#allocateEvent this.allocateEvent}
   * not be freed. This is because of the possibility that the same event is freed twice, which can cause
   * it to be allocated twice & result in overwriting.
   * @param event - The event to be freed.
   * @throws Error if the event is managed by another event boundary.
   */
  freeEvent(t) {
    if (t.manager !== this) throw new Error("It is illegal to free an event not managed by this EventBoundary!");
    const e = t.constructor;
    this.eventPool.has(e) || this.eventPool.set(e, []), this.eventPool.get(e).push(t);
  }
  /**
   * Similar to {@link EventEmitter.emit}, except it stops if the `propagationImmediatelyStopped` flag
   * is set on the event.
   * @param e - The event to call each listener with.
   * @param type - The event key.
   */
  _notifyListeners(t, e) {
    const s = t.currentTarget._events[e];
    if (s)
      if ("fn" in s)
        s.once && t.currentTarget.removeListener(e, s.fn, void 0, !0), s.fn.call(s.context, t);
      else
        for (let n = 0, r = s.length; n < r && !t.propagationImmediatelyStopped; n++)
          s[n].once && t.currentTarget.removeListener(e, s[n].fn, void 0, !0), s[n].fn.call(s[n].context, t);
  }
}
const Di = 1, Oi = {
  touchstart: "pointerdown",
  touchend: "pointerup",
  touchendoutside: "pointerupoutside",
  touchmove: "pointermove",
  touchcancel: "pointercancel"
};
class ce {
  /** @ignore */
  static extension = {
    name: "events",
    type: [
      "ExtensionType.WebGLSystem",
      "ExtensionType.CanvasSystem",
      "ExtensionType.WebGPUSystem"
    ],
    priority: -1
  };
  /**
   * The event features that are enabled by the EventSystem
   * @since 7.2.0
   * @example
   * ```ts
   * import { EventSystem, EventSystemFeatures } from 'pixi.js';
   * // Access the default event features
   * EventSystem.defaultEventFeatures = {
   *     // Enable pointer movement events
   *     move: true,
   *     // Enable global pointer move events
   *     globalMove: true,
   *     // Enable click events
   *     click: true,
   *     // Enable wheel events
   *     wheel: true,
   * };
   * ```
   */
  static defaultEventFeatures = {
    /** Enables pointer events associated with pointer movement. */
    move: !0,
    /** Enables global pointer move events. */
    globalMove: !0,
    /** Enables pointer events associated with clicking. */
    click: !0,
    /** Enables wheel events. */
    wheel: !0
  };
  static _defaultEventMode;
  /**
   * The default interaction mode for all display objects.
   * @see Container.eventMode
   * @type {EventMode}
   * @readonly
   * @since 7.2.0
   */
  static get defaultEventMode() {
    return this._defaultEventMode;
  }
  /**
   * The {@link EventBoundary} for the stage.
   *
   * The {@link EventBoundary#rootTarget rootTarget} of this root boundary is automatically set to
   * the last rendered object before any event processing is initiated. This means the main scene
   * needs to be rendered atleast once before UI events will start propagating.
   *
   * The root boundary should only be changed during initialization. Otherwise, any state held by the
   * event boundary may be lost (like hovered & pressed Containers).
   * @advanced
   */
  rootBoundary;
  /**
   * Indicates whether the current device supports touch events according to the W3C Touch Events spec.
   * This is used to determine the appropriate event handling strategy.
   * @see {@link https://www.w3.org/TR/touch-events/} W3C Touch Events Specification
   * @readonly
   * @default 'ontouchstart' in globalThis
   */
  supportsTouchEvents = "ontouchstart" in globalThis;
  /**
   * Indicates whether the current device supports pointer events according to the W3C Pointer Events spec.
   * Used to optimize event handling and provide more consistent cross-device interaction.
   * @see {@link https://www.w3.org/TR/pointerevents/} W3C Pointer Events Specification
   * @readonly
   * @default !!globalThis.PointerEvent
   */
  supportsPointerEvents = !!globalThis.PointerEvent;
  /**
   * Controls whether default browser actions are automatically prevented on pointer events.
   * When true, prevents default browser actions from occurring on pointer events.
   * @remarks
   * - Does not apply to pointer events for backwards compatibility
   * - preventDefault on pointer events stops mouse events from firing
   * - For every pointer event, there will always be either a mouse or touch event alongside it
   * - Setting this to false allows default browser actions (text selection, dragging images, etc.)
   * @example
   * ```ts
   * // Allow default browser actions
   * app.renderer.events.autoPreventDefault = false;
   *
   * // Block default actions (default)
   * app.renderer.events.autoPreventDefault = true;
   *
   * // Example with text selection
   * const text = new Text('Selectable text');
   * text.eventMode = 'static';
   * app.renderer.events.autoPreventDefault = false; // Allow text selection
   * ```
   * @default true
   */
  autoPreventDefault;
  /**
   * Dictionary of custom cursor styles that can be used across the application.
   * Used to define how different cursor modes are handled when interacting with display objects.
   * @example
   * ```ts
   * // Access event system through renderer
   * const eventSystem = app.renderer.events;
   *
   * // Set string-based cursor styles
   * eventSystem.cursorStyles.default = 'pointer';
   * eventSystem.cursorStyles.hover = 'grab';
   * eventSystem.cursorStyles.drag = 'grabbing';
   *
   * // Use CSS object for complex styling
   * eventSystem.cursorStyles.custom = {
   *     cursor: 'url("custom.png") 2 2, auto',
   *     userSelect: 'none'
   * };
   *
   * // Use a url for custom cursors
   * const defaultIcon = 'url(\'https://pixijs.com/assets/bunny.png\'),auto';
   * eventSystem.cursorStyles.icon = defaultIcon;
   *
   * // Use callback function for dynamic cursors
   * eventSystem.cursorStyles.dynamic = (mode) => {
   *     // Update cursor based on mode
   *     document.body.style.cursor = mode === 'hover'
   *         ? 'pointer'
   *         : 'default';
   * };
   *
   * // Apply cursor style to a sprite
   * sprite.cursor = 'hover'; // Will use the hover style defined above
   * sprite.cursor = 'icon'; // Will apply the icon cursor
   * sprite.cursor = 'custom'; // Will apply the custom CSS styles
   * sprite.cursor = 'drag'; // Will apply the grabbing cursor
   * sprite.cursor = 'default'; // Will apply the default pointer cursor
   * sprite.cursor = 'dynamic'; // Will call the dynamic function
   * ```
   * @remarks
   * - Strings are treated as CSS cursor values
   * - Objects are applied as CSS styles to the DOM element
   * - Functions are called directly for custom cursor handling
   * - Default styles for 'default' and 'pointer' are provided
   * @default
   * ```ts
   * {
   *     default: 'inherit',
   *     pointer: 'pointer' // Default cursor styles
   * }
   * ```
   */
  cursorStyles;
  /**
   * The DOM element to which the root event listeners are bound. This is automatically set to
   * the renderer's {@link Renderer#view view}.
   */
  domElement = null;
  /** The resolution used to convert between the DOM client space into world space. */
  resolution = 1;
  /** The renderer managing this {@link EventSystem}. */
  renderer;
  /**
   * The event features that are enabled by the EventSystem
   * @since 7.2.0
   * @example
   * const app = new Application()
   * app.renderer.events.features.globalMove = false
   *
   * // to override all features use Object.assign
   * Object.assign(app.renderer.events.features, {
   *  move: false,
   *  globalMove: false,
   *  click: false,
   *  wheel: false,
   * })
   */
  features;
  _currentCursor;
  _rootPointerEvent;
  _rootWheelEvent;
  _eventsAdded;
  /**
   * @param {Renderer} renderer
   */
  constructor(t) {
    this.renderer = t, this.rootBoundary = new Ui(null), rt.init(this), this.autoPreventDefault = !0, this._eventsAdded = !1, this._rootPointerEvent = new Q(null), this._rootWheelEvent = new Te(null), this.cursorStyles = {
      default: "inherit",
      pointer: "pointer"
    }, this.features = new Proxy({ ...ce.defaultEventFeatures }, {
      set: (e, s, n) => (s === "globalMove" && (this.rootBoundary.enableGlobalMoveEvents = n), e[s] = n, !0)
    }), this._onPointerDown = this._onPointerDown.bind(this), this._onPointerMove = this._onPointerMove.bind(this), this._onPointerUp = this._onPointerUp.bind(this), this._onPointerOverOut = this._onPointerOverOut.bind(this), this.onWheel = this.onWheel.bind(this);
  }
  /**
   * Runner init called, view is available at this point.
   * @ignore
   */
  init(t) {
    const { canvas: e, resolution: s } = this.renderer;
    this.setTargetElement(e), this.resolution = s, ce._defaultEventMode = t.eventMode ?? "passive", Object.assign(this.features, t.eventFeatures ?? {}), this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove;
  }
  /**
   * Handle changing resolution.
   * @ignore
   */
  resolutionChange(t) {
    this.resolution = t;
  }
  /** Destroys all event listeners and detaches the renderer. */
  destroy() {
    this.setTargetElement(null), this.renderer = null, this._currentCursor = null;
  }
  /**
   * Sets the current cursor mode, handling any callbacks or CSS style changes.
   * The cursor can be a CSS cursor string, a custom callback function, or a key from the cursorStyles dictionary.
   * @param mode - Cursor mode to set. Can be:
   * - A CSS cursor string (e.g., 'pointer', 'grab')
   * - A key from the cursorStyles dictionary
   * - null/undefined to reset to default
   * @example
   * ```ts
   * // Using predefined cursor styles
   * app.renderer.events.setCursor('pointer');    // Set standard pointer cursor
   * app.renderer.events.setCursor('grab');       // Set grab cursor
   * app.renderer.events.setCursor(null);         // Reset to default
   *
   * // Using custom cursor styles
   * app.renderer.events.cursorStyles.custom = 'url("cursor.png"), auto';
   * app.renderer.events.setCursor('custom');     // Apply custom cursor
   *
   * // Using callback-based cursor
   * app.renderer.events.cursorStyles.dynamic = (mode) => {
   *     document.body.style.cursor = mode === 'hover' ? 'pointer' : 'default';
   * };
   * app.renderer.events.setCursor('dynamic');    // Trigger cursor callback
   * ```
   * @remarks
   * - Has no effect on OffscreenCanvas except for callback-based cursors
   * - Caches current cursor to avoid unnecessary DOM updates
   * - Supports CSS cursor values, style objects, and callback functions
   * @see {@link EventSystem.cursorStyles} For defining custom cursor styles
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor} MDN Cursor Reference
   */
  setCursor(t) {
    t ||= "default";
    let e = !0;
    if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas && (e = !1), this._currentCursor === t)
      return;
    this._currentCursor = t;
    const s = this.cursorStyles[t];
    if (s)
      switch (typeof s) {
        case "string":
          e && (this.domElement.style.cursor = s);
          break;
        case "function":
          s(t);
          break;
        case "object":
          e && Object.assign(this.domElement.style, s);
          break;
      }
    else e && typeof t == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, t) && (this.domElement.style.cursor = t);
  }
  /**
   * The global pointer event instance containing the most recent pointer state.
   * This is useful for accessing pointer information without listening to events.
   * @example
   * ```ts
   * // Access current pointer position at any time
   * const eventSystem = app.renderer.events;
   * const pointer = eventSystem.pointer;
   *
   * // Get global coordinates
   * console.log('Position:', pointer.global.x, pointer.global.y);
   *
   * // Check button state
   * console.log('Buttons pressed:', pointer.buttons);
   *
   * // Get pointer type and pressure
   * console.log('Type:', pointer.pointerType);
   * console.log('Pressure:', pointer.pressure);
   * ```
   * @readonly
   * @since 7.2.0
   * @see {@link FederatedPointerEvent} For all available pointer properties
   */
  get pointer() {
    return this._rootPointerEvent;
  }
  /**
   * Event handler for pointer down events on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  _onPointerDown(t) {
    if (!this.features.click) return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const e = this._normalizeToPointerData(t);
    this.autoPreventDefault && e[0].isNormalized && (t.cancelable || !("cancelable" in t)) && t.preventDefault();
    for (let s = 0, n = e.length; s < n; s++) {
      const r = e[s], o = this._bootstrapEvent(this._rootPointerEvent, r);
      this.rootBoundary.mapEvent(o);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer move events on on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch events.
   */
  _onPointerMove(t) {
    if (!this.features.move) return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, rt.pointerMoved();
    const e = this._normalizeToPointerData(t);
    for (let s = 0, n = e.length; s < n; s++) {
      const r = this._bootstrapEvent(this._rootPointerEvent, e[s]);
      this.rootBoundary.mapEvent(r);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer up events on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  _onPointerUp(t) {
    if (!this.features.click) return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    let e = t.target;
    t.composedPath && t.composedPath().length > 0 && (e = t.composedPath()[0]);
    const s = e !== this.domElement ? "outside" : "", n = this._normalizeToPointerData(t);
    for (let r = 0, o = n.length; r < o; r++) {
      const a = this._bootstrapEvent(this._rootPointerEvent, n[r]);
      a.type += s, this.rootBoundary.mapEvent(a);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer over & out events on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  _onPointerOverOut(t) {
    if (!this.features.click) return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const e = this._normalizeToPointerData(t);
    for (let s = 0, n = e.length; s < n; s++) {
      const r = this._bootstrapEvent(this._rootPointerEvent, e[s]);
      this.rootBoundary.mapEvent(r);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Passive handler for `wheel` events on {@link EventSystem.domElement this.domElement}.
   * @param nativeEvent - The native wheel event.
   */
  onWheel(t) {
    if (!this.features.wheel) return;
    const e = this.normalizeWheelEvent(t);
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, this.rootBoundary.mapEvent(e);
  }
  /**
   * Sets the {@link EventSystem#domElement domElement} and binds event listeners.
   * This method manages the DOM event bindings for the event system, allowing you to
   * change or remove the target element that receives input events.
   * > [!IMPORTANT] This will default to the canvas element of the renderer, so you
   * > should not need to call this unless you are using a custom element.
   * @param element - The new DOM element to bind events to, or null to remove all event bindings
   * @example
   * ```ts
   * // Set a new canvas element as the target
   * const canvas = document.createElement('canvas');
   * app.renderer.events.setTargetElement(canvas);
   *
   * // Remove all event bindings
   * app.renderer.events.setTargetElement(null);
   *
   * // Switch to a different canvas
   * const newCanvas = document.querySelector('#game-canvas');
   * app.renderer.events.setTargetElement(newCanvas);
   * ```
   * @remarks
   * - Automatically removes event listeners from previous element
   * - Required for the event system to function
   * - Safe to call multiple times
   * @see {@link EventSystem#domElement} The current DOM element
   * @see {@link EventsTicker} For the ticker system that tracks pointer movement
   */
  setTargetElement(t) {
    this._removeEvents(), this.domElement = t, rt.domElement = t, this._addEvents();
  }
  /** Register event listeners on {@link Renderer#domElement this.domElement}. */
  _addEvents() {
    if (this._eventsAdded || !this.domElement)
      return;
    rt.addTickerListener();
    const t = this.domElement.style;
    t && (globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "none", t.msTouchAction = "none") : this.supportsPointerEvents && (t.touchAction = "none")), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this._onPointerMove, !0), this.domElement.addEventListener("pointerdown", this._onPointerDown, !0), this.domElement.addEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.addEventListener("pointerover", this._onPointerOverOut, !0), globalThis.addEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.addEventListener("mousemove", this._onPointerMove, !0), this.domElement.addEventListener("mousedown", this._onPointerDown, !0), this.domElement.addEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.addEventListener("mouseover", this._onPointerOverOut, !0), globalThis.addEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.addEventListener("touchstart", this._onPointerDown, !0), this.domElement.addEventListener("touchend", this._onPointerUp, !0), this.domElement.addEventListener("touchmove", this._onPointerMove, !0))), this.domElement.addEventListener("wheel", this.onWheel, {
      passive: !0,
      capture: !0
    }), this._eventsAdded = !0;
  }
  /** Unregister event listeners on {@link EventSystem#domElement this.domElement}. */
  _removeEvents() {
    if (!this._eventsAdded || !this.domElement)
      return;
    rt.removeTickerListener();
    const t = this.domElement.style;
    t && (globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "", t.msTouchAction = "") : this.supportsPointerEvents && (t.touchAction = "")), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this._onPointerMove, !0), this.domElement.removeEventListener("pointerdown", this._onPointerDown, !0), this.domElement.removeEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.removeEventListener("pointerover", this._onPointerOverOut, !0), globalThis.removeEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.removeEventListener("mousemove", this._onPointerMove, !0), this.domElement.removeEventListener("mousedown", this._onPointerDown, !0), this.domElement.removeEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.removeEventListener("mouseover", this._onPointerOverOut, !0), globalThis.removeEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.removeEventListener("touchstart", this._onPointerDown, !0), this.domElement.removeEventListener("touchend", this._onPointerUp, !0), this.domElement.removeEventListener("touchmove", this._onPointerMove, !0))), this.domElement.removeEventListener("wheel", this.onWheel, !0), this.domElement = null, this._eventsAdded = !1;
  }
  /**
   * Maps coordinates from DOM/screen space into PixiJS normalized coordinates.
   * This takes into account the current scale, position, and resolution of the DOM element.
   * @param point - The point to store the mapped coordinates in
   * @param x - The x coordinate in DOM/client space
   * @param y - The y coordinate in DOM/client space
   * @example
   * ```ts
   * // Map mouse coordinates to PixiJS space
   * const point = new Point();
   * app.renderer.events.mapPositionToPoint(
   *     point,
   *     event.clientX,
   *     event.clientY
   * );
   * console.log('Mapped position:', point.x, point.y);
   *
   * // Using with pointer events
   * sprite.on('pointermove', (event) => {
   *     // event.global already contains mapped coordinates
   *     console.log('Global:', event.global.x, event.global.y);
   *
   *     // Map to local coordinates
   *     const local = event.getLocalPosition(sprite);
   *     console.log('Local:', local.x, local.y);
   * });
   * ```
   * @remarks
   * - Accounts for element scaling and positioning
   * - Adjusts for device pixel ratio/resolution
   */
  mapPositionToPoint(t, e, s) {
    const n = this.domElement.isConnected ? this.domElement.getBoundingClientRect() : {
      width: this.domElement.width,
      height: this.domElement.height,
      left: 0,
      top: 0
    }, r = 1 / this.resolution;
    t.x = (e - n.left) * (this.domElement.width / n.width) * r, t.y = (s - n.top) * (this.domElement.height / n.height) * r;
  }
  /**
   * Ensures that the original event object contains all data that a regular pointer event would have
   * @param event - The original event data from a touch or mouse event
   * @returns An array containing a single normalized pointer event, in the case of a pointer
   *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
   */
  _normalizeToPointerData(t) {
    const e = [];
    if (this.supportsTouchEvents && t instanceof TouchEvent)
      for (let s = 0, n = t.changedTouches.length; s < n; s++) {
        const r = t.changedTouches[s];
        typeof r.button > "u" && (r.button = 0), typeof r.buttons > "u" && (r.buttons = 1), typeof r.isPrimary > "u" && (r.isPrimary = t.touches.length === 1 && t.type === "touchstart"), typeof r.width > "u" && (r.width = r.radiusX || 1), typeof r.height > "u" && (r.height = r.radiusY || 1), typeof r.tiltX > "u" && (r.tiltX = 0), typeof r.tiltY > "u" && (r.tiltY = 0), typeof r.pointerType > "u" && (r.pointerType = "touch"), typeof r.pointerId > "u" && (r.pointerId = r.identifier || 0), typeof r.pressure > "u" && (r.pressure = r.force || 0.5), typeof r.twist > "u" && (r.twist = 0), typeof r.tangentialPressure > "u" && (r.tangentialPressure = 0), typeof r.layerX > "u" && (r.layerX = r.offsetX = r.clientX), typeof r.layerY > "u" && (r.layerY = r.offsetY = r.clientY), r.isNormalized = !0, r.type = t.type, e.push(r);
      }
    else if (!globalThis.MouseEvent || t instanceof MouseEvent && (!this.supportsPointerEvents || !(t instanceof globalThis.PointerEvent))) {
      const s = t;
      typeof s.isPrimary > "u" && (s.isPrimary = !0), typeof s.width > "u" && (s.width = 1), typeof s.height > "u" && (s.height = 1), typeof s.tiltX > "u" && (s.tiltX = 0), typeof s.tiltY > "u" && (s.tiltY = 0), typeof s.pointerType > "u" && (s.pointerType = "mouse"), typeof s.pointerId > "u" && (s.pointerId = Di), typeof s.pressure > "u" && (s.pressure = 0.5), typeof s.twist > "u" && (s.twist = 0), typeof s.tangentialPressure > "u" && (s.tangentialPressure = 0), s.isNormalized = !0, e.push(s);
    } else
      e.push(t);
    return e;
  }
  /**
   * Normalizes the native {@link https://w3c.github.io/uievents/#interface-wheelevent WheelEvent}.
   *
   * The returned {@link FederatedWheelEvent} is a shared instance. It will not persist across
   * multiple native wheel events.
   * @param nativeEvent - The native wheel event that occurred on the canvas.
   * @returns A federated wheel event.
   */
  normalizeWheelEvent(t) {
    const e = this._rootWheelEvent;
    return this._transferMouseData(e, t), e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ, e.deltaMode = t.deltaMode, this.mapPositionToPoint(e.screen, t.clientX, t.clientY), e.global.copyFrom(e.screen), e.offset.copyFrom(e.screen), e.nativeEvent = t, e.type = t.type, e;
  }
  /**
   * Normalizes the `nativeEvent` into a federateed {@link FederatedPointerEvent}.
   * @param event
   * @param nativeEvent
   */
  _bootstrapEvent(t, e) {
    return t.originalEvent = null, t.nativeEvent = e, t.pointerId = e.pointerId, t.width = e.width, t.height = e.height, t.isPrimary = e.isPrimary, t.pointerType = e.pointerType, t.pressure = e.pressure, t.tangentialPressure = e.tangentialPressure, t.tiltX = e.tiltX, t.tiltY = e.tiltY, t.twist = e.twist, this._transferMouseData(t, e), this.mapPositionToPoint(t.screen, e.clientX, e.clientY), t.global.copyFrom(t.screen), t.offset.copyFrom(t.screen), t.isTrusted = e.isTrusted, t.type === "pointerleave" && (t.type = "pointerout"), t.type.startsWith("mouse") && (t.type = t.type.replace("mouse", "pointer")), t.type.startsWith("touch") && (t.type = Oi[t.type] || t.type), t;
  }
  /**
   * Transfers base & mouse event data from the `nativeEvent` to the federated event.
   * @param event
   * @param nativeEvent
   */
  _transferMouseData(t, e) {
    t.isTrusted = e.isTrusted, t.srcElement = e.srcElement, t.timeStamp = performance.now(), t.type = e.type, t.altKey = e.altKey, t.button = e.button, t.buttons = e.buttons, t.client.x = e.clientX, t.client.y = e.clientY, t.ctrlKey = e.ctrlKey, t.metaKey = e.metaKey, t.movement.x = e.movementX, t.movement.y = e.movementY, t.page.x = e.pageX, t.page.y = e.pageY, t.relatedTarget = null, t.shiftKey = e.shiftKey;
  }
}
const wr = {
  onclick: null,
  onmousedown: null,
  onmouseenter: null,
  onmouseleave: null,
  onmousemove: null,
  onglobalmousemove: null,
  onmouseout: null,
  onmouseover: null,
  onmouseup: null,
  onmouseupoutside: null,
  onpointercancel: null,
  onpointerdown: null,
  onpointerenter: null,
  onpointerleave: null,
  onpointermove: null,
  onglobalpointermove: null,
  onpointerout: null,
  onpointerover: null,
  onpointertap: null,
  onpointerup: null,
  onpointerupoutside: null,
  onrightclick: null,
  onrightdown: null,
  onrightup: null,
  onrightupoutside: null,
  ontap: null,
  ontouchcancel: null,
  ontouchend: null,
  ontouchendoutside: null,
  ontouchmove: null,
  onglobaltouchmove: null,
  ontouchstart: null,
  onwheel: null,
  get interactive() {
    return this.eventMode === "dynamic" || this.eventMode === "static";
  },
  set interactive(i) {
    this.eventMode = i ? "static" : "passive";
  },
  _internalEventMode: void 0,
  get eventMode() {
    return this._internalEventMode ?? ce.defaultEventMode;
  },
  set eventMode(i) {
    this._internalEventMode = i;
  },
  isInteractive() {
    return this.eventMode === "static" || this.eventMode === "dynamic";
  },
  interactiveChildren: !0,
  hitArea: null,
  addEventListener(i, t, e) {
    const s = typeof e == "boolean" && e || typeof e == "object" && e.capture, n = typeof e == "object" ? e.signal : void 0, r = typeof e == "object" ? e.once === !0 : !1, o = typeof t == "function" ? void 0 : t;
    i = s ? `${i}capture` : i;
    const a = typeof t == "function" ? t : t.handleEvent, h = this;
    n && n.addEventListener("abort", () => {
      h.off(i, a, o);
    }), r ? h.once(i, a, o) : h.on(i, a, o);
  },
  removeEventListener(i, t, e) {
    const s = typeof e == "boolean" && e || typeof e == "object" && e.capture, n = typeof t == "function" ? void 0 : t;
    i = s ? `${i}capture` : i, t = typeof t == "function" ? t : t.handleEvent, this.off(i, t, n);
  },
  dispatchEvent(i) {
    if (!(i instanceof de))
      throw new Error("Container cannot propagate events outside of the Federated Events API");
    return i.defaultPrevented = !1, i.path = null, i.target = this, i.manager.dispatchEvent(i), !i.defaultPrevented;
  }
}, Ni = Math.PI * 2, Pr = 180 / Math.PI, Mr = Math.PI / 180;
class N {
  /**
   * Scale on the x axis.
   * @default 1
   */
  a;
  /**
   * Shear on the y axis.
   * @default 0
   */
  b;
  /**
   * Shear on the x axis.
   * @default 0
   */
  c;
  /**
   * Scale on the y axis.
   * @default 1
   */
  d;
  /**
   * Translation on the x axis.
   * @default 0
   */
  tx;
  /**
   * Translation on the y axis.
   * @default 0
   */
  ty;
  /**
   * Array representation of the matrix.
   * Only populated when `toArray()` is called.
   * @default null
   * @see {@link Matrix.toArray} For filling this array
   */
  array = null;
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(t = 1, e = 0, s = 0, n = 1, r = 0, o = 0) {
    this.a = t, this.b = e, this.c = s, this.d = n, this.tx = r, this.ty = o;
  }
  /**
   * Creates a Matrix object based on the given array.
   * Populates matrix components from a flat array in column-major order.
   *
   * > [!NOTE] Array mapping order:
   * > ```
   * > array[0] = a  (x scale)
   * > array[1] = b  (y skew)
   * > array[2] = tx (x translation)
   * > array[3] = c  (x skew)
   * > array[4] = d  (y scale)
   * > array[5] = ty (y translation)
   * > ```
   * @example
   * ```ts
   * // Create matrix from array
   * const matrix = new Matrix();
   * matrix.fromArray([
   *     2, 0,  100,  // a, b, tx
   *     0, 2,  100   // c, d, ty
   * ]);
   *
   * // Create matrix from typed array
   * const float32Array = new Float32Array([
   *     1, 0, 0,     // Scale x1, no skew
   *     0, 1, 0      // No skew, scale x1
   * ]);
   * matrix.fromArray(float32Array);
   * ```
   * @param array - The array to populate the matrix from
   * @see {@link Matrix.toArray} For converting matrix to array
   * @see {@link Matrix.set} For setting values directly
   */
  fromArray(t) {
    this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5];
  }
  /**
   * Sets the matrix properties directly.
   * All matrix components can be set in one call.
   * @example
   * ```ts
   * // Set to identity matrix
   * matrix.set(1, 0, 0, 1, 0, 0);
   *
   * // Set to scale matrix
   * matrix.set(2, 0, 0, 2, 0, 0); // Scale 2x
   *
   * // Set to translation matrix
   * matrix.set(1, 0, 0, 1, 100, 50); // Move 100,50
   * ```
   * @param a - Scale on x axis
   * @param b - Shear on y axis
   * @param c - Shear on x axis
   * @param d - Scale on y axis
   * @param tx - Translation on x axis
   * @param ty - Translation on y axis
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.identity} For resetting to identity
   * @see {@link Matrix.fromArray} For setting from array
   */
  set(t, e, s, n, r, o) {
    return this.a = t, this.b = e, this.c = s, this.d = n, this.tx = r, this.ty = o, this;
  }
  /**
   * Creates an array from the current Matrix object.
   *
   * > [!NOTE] The array format is:
   * > ```
   * > Non-transposed:
   * > [a, c, tx,
   * > b, d, ty,
   * > 0, 0, 1]
   * >
   * > Transposed:
   * > [a, b, 0,
   * > c, d, 0,
   * > tx,ty,1]
   * > ```
   * @example
   * ```ts
   * // Basic array conversion
   * const matrix = new Matrix(2, 0, 0, 2, 100, 100);
   * const array = matrix.toArray();
   *
   * // Using existing array
   * const float32Array = new Float32Array(9);
   * matrix.toArray(false, float32Array);
   *
   * // Get transposed array
   * const transposed = matrix.toArray(true);
   * ```
   * @param transpose - Whether to transpose the matrix
   * @param out - Optional Float32Array to store the result
   * @returns The array containing the matrix values
   * @see {@link Matrix.fromArray} For creating matrix from array
   * @see {@link Matrix.array} For cached array storage
   */
  toArray(t, e) {
    this.array || (this.array = new Float32Array(9));
    const s = e || this.array;
    return t ? (s[0] = this.a, s[1] = this.b, s[2] = 0, s[3] = this.c, s[4] = this.d, s[5] = 0, s[6] = this.tx, s[7] = this.ty, s[8] = 1) : (s[0] = this.a, s[1] = this.c, s[2] = this.tx, s[3] = this.b, s[4] = this.d, s[5] = this.ty, s[6] = 0, s[7] = 0, s[8] = 1), s;
  }
  /**
   * Get a new position with the current transformation applied.
   *
   * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
   * @example
   * ```ts
   * // Basic point transformation
   * const matrix = new Matrix().translate(100, 50).rotate(Math.PI / 4);
   * const point = new Point(10, 20);
   * const transformed = matrix.apply(point);
   *
   * // Reuse existing point
   * const output = new Point();
   * matrix.apply(point, output);
   * ```
   * @param pos - The origin point to transform
   * @param newPos - Optional point to store the result
   * @returns The transformed point
   * @see {@link Matrix.applyInverse} For inverse transformation
   * @see {@link Point} For point operations
   */
  apply(t, e) {
    e = e || new F();
    const s = t.x, n = t.y;
    return e.x = this.a * s + this.c * n + this.tx, e.y = this.b * s + this.d * n + this.ty, e;
  }
  /**
   * Get a new position with the inverse of the current transformation applied.
   *
   * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
   * @example
   * ```ts
   * // Basic inverse transformation
   * const matrix = new Matrix().translate(100, 50).rotate(Math.PI / 4);
   * const worldPoint = new Point(150, 100);
   * const localPoint = matrix.applyInverse(worldPoint);
   *
   * // Reuse existing point
   * const output = new Point();
   * matrix.applyInverse(worldPoint, output);
   *
   * // Convert mouse position to local space
   * const mousePoint = new Point(mouseX, mouseY);
   * const localMouse = matrix.applyInverse(mousePoint);
   * ```
   * @param pos - The origin point to inverse-transform
   * @param newPos - Optional point to store the result
   * @returns The inverse-transformed point
   * @see {@link Matrix.apply} For forward transformation
   * @see {@link Matrix.invert} For getting inverse matrix
   */
  applyInverse(t, e) {
    e = e || new F();
    const s = this.a, n = this.b, r = this.c, o = this.d, a = this.tx, h = this.ty, c = 1 / (s * o + r * -n), l = t.x, u = t.y;
    return e.x = o * c * l + -r * c * u + (h * r - a * o) * c, e.y = s * c * u + -n * c * l + (-h * s + a * n) * c, e;
  }
  /**
   * Translates the matrix on the x and y axes.
   * Adds to the position values while preserving scale, rotation and skew.
   * @example
   * ```ts
   * // Basic translation
   * const matrix = new Matrix();
   * matrix.translate(100, 50); // Move right 100, down 50
   *
   * // Chain with other transformations
   * matrix
   *     .scale(2, 2)
   *     .translate(100, 0)
   *     .rotate(Math.PI / 4);
   * ```
   * @param x - How much to translate on the x axis
   * @param y - How much to translate on the y axis
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.set} For setting position directly
   * @see {@link Matrix.setTransform} For complete transform setup
   */
  translate(t, e) {
    return this.tx += t, this.ty += e, this;
  }
  /**
   * Applies a scale transformation to the matrix.
   * Multiplies the scale values with existing matrix components.
   * @example
   * ```ts
   * // Basic scaling
   * const matrix = new Matrix();
   * matrix.scale(2, 3); // Scale 2x horizontally, 3x vertically
   *
   * // Chain with other transformations
   * matrix
   *     .translate(100, 100)
   *     .scale(2, 2)     // Scales after translation
   *     .rotate(Math.PI / 4);
   * ```
   * @param x - The amount to scale horizontally
   * @param y - The amount to scale vertically
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.setTransform} For setting scale directly
   * @see {@link Matrix.append} For combining transformations
   */
  scale(t, e) {
    return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this;
  }
  /**
   * Applies a rotation transformation to the matrix.
   *
   * Rotates around the origin (0,0) by the given angle in radians.
   * @example
   * ```ts
   * // Basic rotation
   * const matrix = new Matrix();
   * matrix.rotate(Math.PI / 4); // Rotate 45 degrees
   *
   * // Chain with other transformations
   * matrix
   *     .translate(100, 100) // Move to rotation center
   *     .rotate(Math.PI)     // Rotate 180 degrees
   *     .scale(2, 2);        // Scale after rotation
   *
   * // Common angles
   * matrix.rotate(Math.PI / 2);  // 90 degrees
   * matrix.rotate(Math.PI);      // 180 degrees
   * matrix.rotate(Math.PI * 2);  // 360 degrees
   * ```
   * @remarks
   * - Rotates around origin point (0,0)
   * - Affects position if translation was set
   * - Uses counter-clockwise rotation
   * - Order of operations matters when chaining
   * @param angle - The angle in radians
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.setTransform} For setting rotation directly
   * @see {@link Matrix.append} For combining transformations
   */
  rotate(t) {
    const e = Math.cos(t), s = Math.sin(t), n = this.a, r = this.c, o = this.tx;
    return this.a = n * e - this.b * s, this.b = n * s + this.b * e, this.c = r * e - this.d * s, this.d = r * s + this.d * e, this.tx = o * e - this.ty * s, this.ty = o * s + this.ty * e, this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * Combines two matrices by multiplying them together: this = this * matrix
   * @example
   * ```ts
   * // Basic matrix combination
   * const matrix = new Matrix();
   * const other = new Matrix().translate(100, 0).rotate(Math.PI / 4);
   * matrix.append(other);
   * ```
   * @remarks
   * - Order matters: A.append(B) !== B.append(A)
   * - Modifies current matrix
   * - Preserves transformation order
   * - Commonly used for combining transforms
   * @param matrix - The matrix to append
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.prepend} For prepending transformations
   * @see {@link Matrix.appendFrom} For appending two external matrices
   */
  append(t) {
    const e = this.a, s = this.b, n = this.c, r = this.d;
    return this.a = t.a * e + t.b * n, this.b = t.a * s + t.b * r, this.c = t.c * e + t.d * n, this.d = t.c * s + t.d * r, this.tx = t.tx * e + t.ty * n + this.tx, this.ty = t.tx * s + t.ty * r + this.ty, this;
  }
  /**
   * Appends two matrices and sets the result to this matrix.
   * Performs matrix multiplication: this = A * B
   * @example
   * ```ts
   * // Basic matrix multiplication
   * const result = new Matrix();
   * const matrixA = new Matrix().scale(2, 2);
   * const matrixB = new Matrix().rotate(Math.PI / 4);
   * result.appendFrom(matrixA, matrixB);
   * ```
   * @remarks
   * - Order matters: A * B !== B * A
   * - Creates a new transformation from two others
   * - More efficient than append() for multiple operations
   * - Does not modify input matrices
   * @param a - The first matrix to multiply
   * @param b - The second matrix to multiply
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.append} For single matrix combination
   * @see {@link Matrix.prepend} For reverse order multiplication
   */
  appendFrom(t, e) {
    const s = t.a, n = t.b, r = t.c, o = t.d, a = t.tx, h = t.ty, c = e.a, l = e.b, u = e.c, f = e.d;
    return this.a = s * c + n * u, this.b = s * l + n * f, this.c = r * c + o * u, this.d = r * l + o * f, this.tx = a * c + h * u + e.tx, this.ty = a * l + h * f + e.ty, this;
  }
  /**
   * Sets the matrix based on all the available properties.
   * Combines position, scale, rotation, skew and pivot in a single operation.
   * @example
   * ```ts
   * // Basic transform setup
   * const matrix = new Matrix();
   * matrix.setTransform(
   *     100, 100,    // position
   *     0, 0,        // pivot
   *     2, 2,        // scale
   *     Math.PI / 4, // rotation (45 degrees)
   *     0, 0         // skew
   * );
   * ```
   * @remarks
   * - Updates all matrix components at once
   * - More efficient than separate transform calls
   * - Uses radians for rotation and skew
   * - Pivot affects rotation center
   * @param x - Position on the x axis
   * @param y - Position on the y axis
   * @param pivotX - Pivot on the x axis
   * @param pivotY - Pivot on the y axis
   * @param scaleX - Scale on the x axis
   * @param scaleY - Scale on the y axis
   * @param rotation - Rotation in radians
   * @param skewX - Skew on the x axis
   * @param skewY - Skew on the y axis
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.decompose} For extracting transform properties
   * @see {@link TransformableObject} For transform data structure
   */
  setTransform(t, e, s, n, r, o, a, h, c) {
    return this.a = Math.cos(a + c) * r, this.b = Math.sin(a + c) * r, this.c = -Math.sin(a - h) * o, this.d = Math.cos(a - h) * o, this.tx = t - (s * this.a + n * this.c), this.ty = e - (s * this.b + n * this.d), this;
  }
  /**
   * Prepends the given Matrix to this Matrix.
   * Combines two matrices by multiplying them together: this = matrix * this
   * @example
   * ```ts
   * // Basic matrix prepend
   * const matrix = new Matrix().scale(2, 2);
   * const other = new Matrix().translate(100, 0);
   * matrix.prepend(other); // Translation happens before scaling
   * ```
   * @remarks
   * - Order matters: A.prepend(B) !== B.prepend(A)
   * - Modifies current matrix
   * - Reverses transformation order compared to append()
   * @param matrix - The matrix to prepend
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.append} For appending transformations
   * @see {@link Matrix.appendFrom} For combining external matrices
   */
  prepend(t) {
    const e = this.tx;
    if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
      const s = this.a, n = this.c;
      this.a = s * t.a + this.b * t.c, this.b = s * t.b + this.b * t.d, this.c = n * t.a + this.d * t.c, this.d = n * t.b + this.d * t.d;
    }
    return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
  }
  /**
   * Decomposes the matrix into its individual transform components.
   * Extracts position, scale, rotation and skew values from the matrix.
   * @example
   * ```ts
   * // Basic decomposition
   * const matrix = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4)
   *     .scale(2, 2);
   *
   * const transform = {
   *     position: new Point(),
   *     scale: new Point(),
   *     pivot: new Point(),
   *     skew: new Point(),
   *     rotation: 0
   * };
   *
   * matrix.decompose(transform);
   * console.log(transform.position); // Point(100, 100)
   * console.log(transform.rotation); // ~0.785 (PI/4)
   * console.log(transform.scale); // Point(2, 2)
   * ```
   * @remarks
   * - Handles combined transformations
   * - Accounts for pivot points
   * - Chooses between rotation/skew based on transform type
   * - Uses radians for rotation and skew
   * @param transform - The transform object to store the decomposed values
   * @returns The transform with the newly applied properties
   * @see {@link Matrix.setTransform} For composing from components
   * @see {@link TransformableObject} For transform structure
   */
  decompose(t) {
    const e = this.a, s = this.b, n = this.c, r = this.d, o = t.pivot, a = -Math.atan2(-n, r), h = Math.atan2(s, e), c = Math.abs(a + h);
    return c < 1e-5 || Math.abs(Ni - c) < 1e-5 ? (t.rotation = h, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = h), t.scale.x = Math.sqrt(e * e + s * s), t.scale.y = Math.sqrt(n * n + r * r), t.position.x = this.tx + (o.x * e + o.y * n), t.position.y = this.ty + (o.x * s + o.y * r), t;
  }
  /**
   * Inverts this matrix.
   * Creates the matrix that when multiplied with this matrix results in an identity matrix.
   * @example
   * ```ts
   * // Basic matrix inversion
   * const matrix = new Matrix()
   *     .translate(100, 50)
   *     .scale(2, 2);
   *
   * matrix.invert(); // Now transforms in opposite direction
   *
   * // Verify inversion
   * const point = new Point(50, 50);
   * const transformed = matrix.apply(point);
   * const original = matrix.invert().apply(transformed);
   * // original ≈ point
   * ```
   * @remarks
   * - Modifies the current matrix
   * - Useful for reversing transformations
   * - Cannot invert matrices with zero determinant
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.identity} For resetting to identity
   * @see {@link Matrix.applyInverse} For inverse transformations
   */
  invert() {
    const t = this.a, e = this.b, s = this.c, n = this.d, r = this.tx, o = t * n - e * s;
    return this.a = n / o, this.b = -e / o, this.c = -s / o, this.d = t / o, this.tx = (s * this.ty - n * r) / o, this.ty = -(t * this.ty - e * r) / o, this;
  }
  /**
   * Checks if this matrix is an identity matrix.
   *
   * An identity matrix has no transformations applied (default state).
   * @example
   * ```ts
   * // Check if matrix is identity
   * const matrix = new Matrix();
   * console.log(matrix.isIdentity()); // true
   *
   * // Check after transformations
   * matrix.translate(100, 0);
   * console.log(matrix.isIdentity()); // false
   *
   * // Reset and verify
   * matrix.identity();
   * console.log(matrix.isIdentity()); // true
   * ```
   * @remarks
   * - Verifies a = 1, d = 1 (no scale)
   * - Verifies b = 0, c = 0 (no skew)
   * - Verifies tx = 0, ty = 0 (no translation)
   * @returns True if matrix has no transformations
   * @see {@link Matrix.identity} For resetting to identity
   * @see {@link Matrix.IDENTITY} For constant identity matrix
   */
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
  }
  /**
   * Resets this Matrix to an identity (default) matrix.
   * Sets all components to their default values: scale=1, no skew, no translation.
   * @example
   * ```ts
   * // Reset transformed matrix
   * const matrix = new Matrix()
   *     .scale(2, 2)
   *     .rotate(Math.PI / 4);
   * matrix.identity(); // Back to default state
   *
   * // Chain after reset
   * matrix
   *     .identity()
   *     .translate(100, 100)
   *     .scale(2, 2);
   *
   * // Compare with identity constant
   * const isDefault = matrix.equals(Matrix.IDENTITY);
   * ```
   * @remarks
   * - Sets a=1, d=1 (default scale)
   * - Sets b=0, c=0 (no skew)
   * - Sets tx=0, ty=0 (no translation)
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.IDENTITY} For constant identity matrix
   * @see {@link Matrix.isIdentity} For checking identity state
   */
  identity() {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @returns A copy of this matrix. Good for chaining method calls.
   */
  clone() {
    const t = new N();
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @param matrix
   * @example
   * ```ts
   * // Basic matrix cloning
   * const matrix = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4);
   * const copy = matrix.clone();
   *
   * // Clone and modify
   * const modified = matrix.clone()
   *     .scale(2, 2);
   *
   * // Compare matrices
   * console.log(matrix.equals(copy));     // true
   * console.log(matrix.equals(modified)); // false
   * ```
   * @returns A copy of this matrix. Good for chaining method calls.
   * @see {@link Matrix.copyTo} For copying to existing matrix
   * @see {@link Matrix.copyFrom} For copying from another matrix
   */
  copyTo(t) {
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the matrix to be the same as the ones in given matrix.
   * @example
   * ```ts
   * // Basic matrix copying
   * const source = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4);
   * const target = new Matrix();
   * target.copyFrom(source);
   * ```
   * @param matrix - The matrix to copy from
   * @returns This matrix. Good for chaining method calls.
   * @see {@link Matrix.clone} For creating new matrix copy
   * @see {@link Matrix.copyTo} For copying to another matrix
   */
  copyFrom(t) {
    return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this;
  }
  /**
   * Checks if this matrix equals another matrix.
   * Compares all components for exact equality.
   * @example
   * ```ts
   * // Basic equality check
   * const m1 = new Matrix();
   * const m2 = new Matrix();
   * console.log(m1.equals(m2)); // true
   *
   * // Compare transformed matrices
   * const transform = new Matrix()
   *     .translate(100, 100)
   * const clone = new Matrix()
   *     .scale(2, 2);
   * console.log(transform.equals(clone)); // false
   * ```
   * @param matrix - The matrix to compare to
   * @returns True if matrices are identical
   * @see {@link Matrix.copyFrom} For copying matrix values
   * @see {@link Matrix.isIdentity} For identity comparison
   */
  equals(t) {
    return t.a === this.a && t.b === this.b && t.c === this.c && t.d === this.d && t.tx === this.tx && t.ty === this.ty;
  }
  // #if _DEBUG
  toString() {
    return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
  }
  // #endif
  /**
   * A default (identity) matrix with no transformations applied.
   *
   * > [!IMPORTANT] This is a shared read-only object. Create a new Matrix if you need to modify it.
   * @example
   * ```ts
   * // Get identity matrix reference
   * const identity = Matrix.IDENTITY;
   * console.log(identity.isIdentity()); // true
   *
   * // Compare with identity
   * const matrix = new Matrix();
   * console.log(matrix.equals(Matrix.IDENTITY)); // true
   *
   * // Create new matrix instead of modifying IDENTITY
   * const transform = new Matrix()
   *     .copyFrom(Matrix.IDENTITY)
   *     .translate(100, 100);
   * ```
   * @readonly
   * @returns A read-only identity matrix
   * @see {@link Matrix.shared} For temporary calculations
   * @see {@link Matrix.identity} For resetting matrices
   */
  static get IDENTITY() {
    return $i.identity();
  }
  /**
   * A static Matrix that can be used to avoid creating new objects.
   * Will always ensure the matrix is reset to identity when requested.
   *
   * > [!IMPORTANT] This matrix is shared and temporary. Do not store references to it.
   * @example
   * ```ts
   * // Use for temporary calculations
   * const tempMatrix = Matrix.shared;
   * tempMatrix.translate(100, 100).rotate(Math.PI / 4);
   * const point = tempMatrix.apply({ x: 10, y: 20 });
   *
   * // Will be reset to identity on next access
   * const fresh = Matrix.shared; // Back to identity
   * ```
   * @remarks
   * - Always returns identity matrix
   * - Safe to modify temporarily
   * - Not safe to store references
   * - Useful for one-off calculations
   * @readonly
   * @returns A fresh identity matrix for temporary use
   * @see {@link Matrix.IDENTITY} For immutable identity matrix
   * @see {@link Matrix.identity} For resetting matrices
   */
  static get shared() {
    return Hi.identity();
  }
}
const Hi = new N(), $i = new N(), ft = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], pt = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], mt = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], yt = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], Se = [], Os = [], Zt = Math.sign;
function Wi() {
  for (let i = 0; i < 16; i++) {
    const t = [];
    Se.push(t);
    for (let e = 0; e < 16; e++) {
      const s = Zt(ft[i] * ft[e] + mt[i] * pt[e]), n = Zt(pt[i] * ft[e] + yt[i] * pt[e]), r = Zt(ft[i] * mt[e] + mt[i] * yt[e]), o = Zt(pt[i] * mt[e] + yt[i] * yt[e]);
      for (let a = 0; a < 16; a++)
        if (ft[a] === s && pt[a] === n && mt[a] === r && yt[a] === o) {
          t.push(a);
          break;
        }
    }
  }
  for (let i = 0; i < 16; i++) {
    const t = new N();
    t.set(ft[i], pt[i], mt[i], yt[i], 0, 0), Os.push(t);
  }
}
Wi();
const S = {
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 0°       | East      |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  E: 0,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 45°↻     | Southeast |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  SE: 1,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 90°↻     | South     |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  S: 2,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 135°↻    | Southwest |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  SW: 3,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 180°     | West      |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  W: 4,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -135°/225°↻ | Northwest    |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  NW: 5,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -90°/270°↻  | North        |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  N: 6,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -45°/315°↻  | Northeast    |
   * @group groupD8
   * @type {GD8Symmetry}
   */
  NE: 7,
  /**
   * Reflection about Y-axis.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  MIRROR_VERTICAL: 8,
  /**
   * Reflection about the main diagonal.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  MAIN_DIAGONAL: 10,
  /**
   * Reflection about X-axis.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  MIRROR_HORIZONTAL: 12,
  /**
   * Reflection about reverse diagonal.
   * @group groupD8
   * @type {GD8Symmetry}
   */
  REVERSE_DIAGONAL: 14,
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the U-axis
   *    after rotating the axes.
   */
  uX: (i) => ft[i],
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (i) => pt[i],
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (i) => mt[i],
  /**
   * @group groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (i) => yt[i],
  /**
   * @group groupD8
   * @param {GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: (i) => i & 8 ? i & 15 : -i & 7,
  /**
   * Composes the two D8 operations.
   *
   * Taking `^` as reflection:
   *
   * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
   * |-------|-----|-----|-----|-----|------|-------|-------|-------|
   * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
   * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
   * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
   * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
   * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
   * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
   * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
   * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
   *
   * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
   * @group groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation, which
   *   is the row in the above cayley table.
   * @param {GD8Symmetry} rotationFirst - First operation, which
   *   is the column in the above cayley table.
   * @returns {GD8Symmetry} Composed operation
   */
  add: (i, t) => Se[i][t],
  /**
   * Reverse of `add`.
   * @group groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation
   * @param {GD8Symmetry} rotationFirst - First operation
   * @returns {GD8Symmetry} Result
   */
  sub: (i, t) => Se[i][S.inv(t)],
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @group groupD8
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: (i) => i ^ 4,
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @group groupD8
   * @param {GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: (i) => (i & 3) === 2,
  // rotation % 4 === 2
  /**
   * Approximates the vector `V(dx,dy)` into one of the
   * eight directions provided by `groupD8`.
   * @group groupD8
   * @param {number} dx - X-component of the vector
   * @param {number} dy - Y-component of the vector
   * @returns {GD8Symmetry} Approximation of the vector into
   *  one of the eight symmetries.
   */
  byDirection: (i, t) => Math.abs(i) * 2 <= Math.abs(t) ? t >= 0 ? S.S : S.N : Math.abs(t) * 2 <= Math.abs(i) ? i > 0 ? S.E : S.W : t > 0 ? i > 0 ? S.SE : S.SW : i > 0 ? S.NE : S.NW,
  /**
   * Helps sprite to compensate texture packer rotation.
   * @group groupD8
   * @param {Matrix} matrix - sprite world matrix
   * @param {GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: (i, t, e = 0, s = 0) => {
    const n = Os[S.inv(t)];
    n.tx = e, n.ty = s, i.append(n);
  },
  /**
   * Transforms rectangle coordinates based on texture packer rotation.
   * Used when texture atlas pages are rotated and coordinates need to be adjusted.
   * @group groupD8
   * @param {RectangleLike} rect - Rectangle with original coordinates to transform
   * @param {RectangleLike} sourceFrame - Source texture frame (includes offset and dimensions)
   * @param {GD8Symmetry} rotation - The groupD8 rotation value
   * @param {Rectangle} out - Rectangle to store the result
   * @returns {Rectangle} Transformed coordinates (includes source frame offset)
   */
  transformRectCoords: (i, t, e, s) => {
    const { x: n, y: r, width: o, height: a } = i, { x: h, y: c, width: l, height: u } = t;
    return e === S.E ? (s.set(n + h, r + c, o, a), s) : e === S.S ? s.set(
      l - r - a + h,
      n + c,
      a,
      o
    ) : e === S.W ? s.set(
      l - n - o + h,
      u - r - a + c,
      o,
      a
    ) : e === S.N ? s.set(
      r + h,
      u - n - o + c,
      a,
      o
    ) : s.set(n + h, r + c, o, a);
  }
};
function wt(i) {
  return i += i === 0 ? 1 : 0, --i, i |= i >>> 1, i |= i >>> 2, i |= i >>> 4, i |= i >>> 8, i |= i >>> 16, i + 1;
}
function Qe(i) {
  return !(i & i - 1) && !!i;
}
function Er(i) {
  let t = (i > 65535 ? 1 : 0) << 4;
  i >>>= t;
  let e = (i > 255 ? 1 : 0) << 3;
  return i >>>= e, t |= e, e = (i > 15 ? 1 : 0) << 2, i >>>= e, t |= e, e = (i > 3 ? 1 : 0) << 1, i >>>= e, t |= e, t | i >> 1;
}
function oe(i, t, e, s, n, r) {
  const o = i - e, a = t - s, h = n - e, c = r - s, l = o * h + a * c, u = h * h + c * c;
  let f = -1;
  u !== 0 && (f = l / u);
  let d, p;
  f < 0 ? (d = e, p = s) : f > 1 ? (d = n, p = r) : (d = e + f * h, p = s + f * c);
  const m = i - d, y = t - p;
  return m * m + y * y;
}
class At {
  /** @ignore */
  _x;
  /** @ignore */
  _y;
  /** This object used to call the `onUpdate` callback when the point changes. */
  _observer;
  /**
   * Creates a new `ObservablePoint`
   * @param observer - Observer to pass to listen for change events.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t, e, s) {
    this._x = e || 0, this._y = s || 0, this._observer = t;
  }
  /**
   * Creates a clone of this point.
   * @example
   * ```ts
   * // Basic cloning
   * const point = new ObservablePoint(observer, 100, 200);
   * const copy = point.clone();
   *
   * // Clone with new observer
   * const newObserver = {
   *     _onUpdate: (p) => console.log(`Clone updated: (${p.x}, ${p.y})`)
   * };
   * const watched = point.clone(newObserver);
   *
   * // Verify independence
   * watched.set(300, 400); // Only triggers new observer
   * ```
   * @param observer - Optional observer to pass to the new observable point
   * @returns A copy of this observable point
   * @see {@link ObservablePoint.copyFrom} For copying into existing point
   * @see {@link Observer} For observer interface details
   */
  clone(t) {
    return new At(t ?? this._observer, this._x, this._y);
  }
  /**
   * Sets the point to a new x and y position.
   *
   * If y is omitted, both x and y will be set to x.
   * @example
   * ```ts
   * // Basic position setting
   * const point = new ObservablePoint(observer);
   * point.set(100, 200);
   *
   * // Set both x and y to same value
   * point.set(50); // x=50, y=50
   * ```
   * @param x - Position on the x axis
   * @param y - Position on the y axis, defaults to x
   * @returns The point instance itself
   * @see {@link ObservablePoint.copyFrom} For copying from another point
   * @see {@link ObservablePoint.equals} For comparing positions
   */
  set(t = 0, e = t) {
    return (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies x and y from the given point into this point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new ObservablePoint(observer, 100, 200);
   * const target = new ObservablePoint();
   * target.copyFrom(source);
   *
   * // Copy and chain operations
   * const point = new ObservablePoint()
   *     .copyFrom(source)
   *     .set(x + 50, y + 50);
   *
   * // Copy from any PointData
   * const data = { x: 10, y: 20 };
   * point.copyFrom(data);
   * ```
   * @param p - The point to copy from
   * @returns The point instance itself
   * @see {@link ObservablePoint.copyTo} For copying to another point
   * @see {@link ObservablePoint.clone} For creating new point copy
   */
  copyFrom(t) {
    return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies this point's x and y into the given point.
   * @example
   * ```ts
   * // Basic copying
   * const source = new ObservablePoint(100, 200);
   * const target = new ObservablePoint();
   * source.copyTo(target);
   * ```
   * @param p - The point to copy to. Can be any type that is or extends `PointLike`
   * @returns The point (`p`) with values updated
   * @see {@link ObservablePoint.copyFrom} For copying from another point
   * @see {@link ObservablePoint.clone} For creating new point copy
   */
  copyTo(t) {
    return t.set(this._x, this._y), t;
  }
  /**
   * Checks if another point is equal to this point.
   *
   * Compares x and y values using strict equality.
   * @example
   * ```ts
   * // Basic equality check
   * const p1 = new ObservablePoint(100, 200);
   * const p2 = new ObservablePoint(100, 200);
   * console.log(p1.equals(p2)); // true
   *
   * // Compare with PointData
   * const data = { x: 100, y: 200 };
   * console.log(p1.equals(data)); // true
   *
   * // Check different points
   * const p3 = new ObservablePoint(200, 300);
   * console.log(p1.equals(p3)); // false
   * ```
   * @param p - The point to check
   * @returns `true` if both `x` and `y` are equal
   * @see {@link ObservablePoint.copyFrom} For making points equal
   * @see {@link PointData} For point data interface
   */
  equals(t) {
    return t.x === this._x && t.y === this._y;
  }
  // #if _DEBUG
  toString() {
    return `[pixi.js/math:ObservablePoint x=${this._x} y=${this._y} scope=${this._observer}]`;
  }
  // #endif
  /**
   * Position of the observable point on the x axis.
   * Triggers observer callback when value changes.
   * @example
   * ```ts
   * // Basic x position
   * const point = new ObservablePoint(observer);
   * point.x = 100; // Triggers observer
   *
   * // Use in calculations
   * const width = rightPoint.x - leftPoint.x;
   * ```
   * @default 0
   */
  get x() {
    return this._x;
  }
  set x(t) {
    this._x !== t && (this._x = t, this._observer._onUpdate(this));
  }
  /**
   * Position of the observable point on the y axis.
   * Triggers observer callback when value changes.
   * @example
   * ```ts
   * // Basic y position
   * const point = new ObservablePoint(observer);
   * point.y = 200; // Triggers observer
   *
   * // Use in calculations
   * const height = bottomPoint.y - topPoint.y;
   * ```
   * @default 0
   */
  get y() {
    return this._y;
  }
  set y(t) {
    this._y !== t && (this._y = t, this._observer._onUpdate(this));
  }
}
function Tr(i, t, e, s, n, r, o, a) {
  const h = o - e, c = a - s, l = n - e, u = r - s, f = i - e, d = t - s, p = h * h + c * c, m = h * l + c * u, y = h * f + c * d, g = l * l + u * u, x = l * f + u * d, A = 1 / (p * g - m * m), _ = (g * y - m * x) * A, M = (p * x - m * y) * A;
  return _ >= 0 && M >= 0 && _ + M < 1;
}
const Kt = [new F(), new F(), new F(), new F()];
class H {
  /**
   * The type of the object, mainly used to avoid `instanceof` checks
   * @example
   * ```ts
   * // Check shape type
   * const shape = new Rectangle(0, 0, 100, 100);
   * console.log(shape.type); // 'rectangle'
   *
   * // Use in type guards
   * if (shape.type === 'rectangle') {
   *     console.log(shape.width, shape.height);
   * }
   * ```
   * @readonly
   * @default 'rectangle'
   * @see {@link SHAPE_PRIMITIVE} For all shape types
   */
  type = "rectangle";
  /**
   * The X coordinate of the upper-left corner of the rectangle
   * @example
   * ```ts
   * // Basic x position
   * const rect = new Rectangle();
   * rect.x = 100;
   * ```
   * @default 0
   */
  x;
  /**
   * The Y coordinate of the upper-left corner of the rectangle
   * @example
   * ```ts
   * // Basic y position
   * const rect = new Rectangle();
   * rect.y = 100;
   * ```
   * @default 0
   */
  y;
  /**
   * The overall width of this rectangle
   * @example
   * ```ts
   * // Basic width setting
   * const rect = new Rectangle();
   * rect.width = 200;
   * ```
   * @default 0
   */
  width;
  /**
   * The overall height of this rectangle
   * @example
   * ```ts
   * // Basic height setting
   * const rect = new Rectangle();
   * rect.height = 150;
   * ```
   * @default 0
   */
  height;
  /**
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   */
  constructor(t = 0, e = 0, s = 0, n = 0) {
    this.x = Number(t), this.y = Number(e), this.width = Number(s), this.height = Number(n);
  }
  /**
   * Returns the left edge (x-coordinate) of the rectangle.
   * @example
   * ```ts
   * // Get left edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.left); // 100
   *
   * // Use in alignment calculations
   * sprite.x = rect.left + padding;
   *
   * // Compare positions
   * if (point.x > rect.left) {
   *     console.log('Point is right of rectangle');
   * }
   * ```
   * @readonly
   * @returns The x-coordinate of the left edge
   * @see {@link Rectangle.right} For right edge position
   * @see {@link Rectangle.x} For direct x-coordinate access
   */
  get left() {
    return this.x;
  }
  /**
   * Returns the right edge (x + width) of the rectangle.
   * @example
   * ```ts
   * // Get right edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.right); // 300
   *
   * // Align to right edge
   * sprite.x = rect.right - sprite.width;
   *
   * // Check boundaries
   * if (point.x < rect.right) {
   *     console.log('Point is inside right bound');
   * }
   * ```
   * @readonly
   * @returns The x-coordinate of the right edge
   * @see {@link Rectangle.left} For left edge position
   * @see {@link Rectangle.width} For width value
   */
  get right() {
    return this.x + this.width;
  }
  /**
   * Returns the top edge (y-coordinate) of the rectangle.
   * @example
   * ```ts
   * // Get top edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.top); // 100
   *
   * // Position above rectangle
   * sprite.y = rect.top - sprite.height;
   *
   * // Check vertical position
   * if (point.y > rect.top) {
   *     console.log('Point is below top edge');
   * }
   * ```
   * @readonly
   * @returns The y-coordinate of the top edge
   * @see {@link Rectangle.bottom} For bottom edge position
   * @see {@link Rectangle.y} For direct y-coordinate access
   */
  get top() {
    return this.y;
  }
  /**
   * Returns the bottom edge (y + height) of the rectangle.
   * @example
   * ```ts
   * // Get bottom edge position
   * const rect = new Rectangle(100, 100, 200, 150);
   * console.log(rect.bottom); // 250
   *
   * // Stack below rectangle
   * sprite.y = rect.bottom + margin;
   *
   * // Check vertical bounds
   * if (point.y < rect.bottom) {
   *     console.log('Point is above bottom edge');
   * }
   * ```
   * @readonly
   * @returns The y-coordinate of the bottom edge
   * @see {@link Rectangle.top} For top edge position
   * @see {@link Rectangle.height} For height value
   */
  get bottom() {
    return this.y + this.height;
  }
  /**
   * Determines whether the Rectangle is empty (has no area).
   * @example
   * ```ts
   * // Check zero dimensions
   * const rect = new Rectangle(100, 100, 0, 50);
   * console.log(rect.isEmpty()); // true
   * ```
   * @returns True if the rectangle has no area
   * @see {@link Rectangle.width} For width value
   * @see {@link Rectangle.height} For height value
   */
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
  /**
   * A constant empty rectangle. This is a new object every time the property is accessed.
   * @example
   * ```ts
   * // Get fresh empty rectangle
   * const empty = Rectangle.EMPTY;
   * console.log(empty.isEmpty()); // true
   * ```
   * @returns A new empty rectangle instance
   * @see {@link Rectangle.isEmpty} For empty state testing
   */
  static get EMPTY() {
    return new H(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @example
   * ```ts
   * // Basic cloning
   * const original = new Rectangle(100, 100, 200, 150);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.width *= 2;
   * modified.height += 50;
   *
   * // Verify independence
   * console.log(original.width);  // 200
   * console.log(modified.width);  // 400
   * ```
   * @returns A copy of the rectangle
   * @see {@link Rectangle.copyFrom} For copying into existing rectangle
   * @see {@link Rectangle.copyTo} For copying to another rectangle
   */
  clone() {
    return new H(this.x, this.y, this.width, this.height);
  }
  /**
   * Converts a Bounds object to a Rectangle object.
   * @example
   * ```ts
   * // Convert bounds to rectangle
   * const bounds = container.getBounds();
   * const rect = new Rectangle().copyFromBounds(bounds);
   * ```
   * @param bounds - The bounds to copy and convert to a rectangle
   * @returns Returns itself
   * @see {@link Bounds} For bounds object structure
   * @see {@link Rectangle.getBounds} For getting rectangle bounds
   */
  copyFromBounds(t) {
    return this.x = t.minX, this.y = t.minY, this.width = t.maxX - t.minX, this.height = t.maxY - t.minY, this;
  }
  /**
   * Copies another rectangle to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Rectangle(100, 100, 200, 150);
   * const target = new Rectangle();
   * target.copyFrom(source);
   *
   * // Chain with other operations
   * const rect = new Rectangle()
   *     .copyFrom(source)
   *     .pad(10);
   * ```
   * @param rectangle - The rectangle to copy from
   * @returns Returns itself
   * @see {@link Rectangle.copyTo} For copying to another rectangle
   * @see {@link Rectangle.clone} For creating new rectangle copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Rectangle(100, 100, 200, 150);
   * const target = new Rectangle();
   * source.copyTo(target);
   *
   * // Chain with other operations
   * const result = source
   *     .copyTo(new Rectangle())
   *     .getBounds();
   * ```
   * @param rectangle - The rectangle to copy to
   * @returns Returns given parameter
   * @see {@link Rectangle.copyFrom} For copying from another rectangle
   * @see {@link Rectangle.clone} For creating new rectangle copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rectangle
   * @example
   * ```ts
   * // Basic containment check
   * const rect = new Rectangle(100, 100, 200, 150);
   * const isInside = rect.contains(150, 125); // true
   * // Check edge cases
   * console.log(rect.contains(100, 100)); // true (on edge)
   * console.log(rect.contains(300, 250)); // false (outside)
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rectangle
   * @see {@link Rectangle.containsRect} For rectangle containment
   * @see {@link Rectangle.strokeContains} For checking stroke intersection
   */
  contains(t, e) {
    return this.width <= 0 || this.height <= 0 ? !1 : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const rect = new Rectangle(100, 100, 200, 150);
   * const isOnStroke = rect.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = rect.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = rect.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = rect.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coordinates are within this rectangle's stroke
   * @see {@link Rectangle.contains} For checking fill containment
   * @see {@link Rectangle.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, s, n = 0.5) {
    const { width: r, height: o } = this;
    if (r <= 0 || o <= 0) return !1;
    const a = this.x, h = this.y, c = s * (1 - n), l = s - c, u = a - c, f = a + r + c, d = h - c, p = h + o + c, m = a + l, y = a + r - l, g = h + l, x = h + o - l;
    return t >= u && t <= f && e >= d && e <= p && !(t > m && t < y && e > g && e < x);
  }
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   * Returns true only if the area of the intersection is >0, this means that Rectangles
   * sharing a side are not overlapping. Another side effect is that an arealess rectangle
   * (width or height equal to zero) can't intersect any other rectangle.
   * @param {Rectangle} other - The Rectangle to intersect with `this`.
   * @param {Matrix} transform - The transformation matrix of `other`.
   * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
   */
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   *
   * Returns true only if the area of the intersection is greater than 0.
   * This means that rectangles sharing only a side are not considered intersecting.
   * @example
   * ```ts
   * // Basic intersection check
   * const rect1 = new Rectangle(0, 0, 100, 100);
   * const rect2 = new Rectangle(50, 50, 100, 100);
   * console.log(rect1.intersects(rect2)); // true
   *
   * // With transformation matrix
   * const matrix = new Matrix();
   * matrix.rotate(Math.PI / 4); // 45 degrees
   * console.log(rect1.intersects(rect2, matrix)); // Checks with rotation
   *
   * // Edge cases
   * const zeroWidth = new Rectangle(0, 0, 0, 100);
   * console.log(rect1.intersects(zeroWidth)); // false (no area)
   * ```
   * @remarks
   * - Returns true only if intersection area is > 0
   * - Rectangles sharing only a side are not intersecting
   * - Zero-area rectangles cannot intersect anything
   * - Supports optional transformation matrix
   * @param other - The Rectangle to intersect with `this`
   * @param transform - Optional transformation matrix of `other`
   * @returns True if the transformed `other` Rectangle intersects with `this`
   * @see {@link Rectangle.containsRect} For containment testing
   * @see {@link Rectangle.contains} For point testing
   */
  intersects(t, e) {
    if (!e) {
      const C = this.x < t.x ? t.x : this.x;
      if ((this.right > t.right ? t.right : this.right) <= C)
        return !1;
      const w = this.y < t.y ? t.y : this.y;
      return (this.bottom > t.bottom ? t.bottom : this.bottom) > w;
    }
    const s = this.left, n = this.right, r = this.top, o = this.bottom;
    if (n <= s || o <= r)
      return !1;
    const a = Kt[0].set(t.left, t.top), h = Kt[1].set(t.left, t.bottom), c = Kt[2].set(t.right, t.top), l = Kt[3].set(t.right, t.bottom);
    if (c.x <= a.x || h.y <= a.y)
      return !1;
    const u = Math.sign(e.a * e.d - e.b * e.c);
    if (u === 0 || (e.apply(a, a), e.apply(h, h), e.apply(c, c), e.apply(l, l), Math.max(a.x, h.x, c.x, l.x) <= s || Math.min(a.x, h.x, c.x, l.x) >= n || Math.max(a.y, h.y, c.y, l.y) <= r || Math.min(a.y, h.y, c.y, l.y) >= o))
      return !1;
    const f = u * (h.y - a.y), d = u * (a.x - h.x), p = f * s + d * r, m = f * n + d * r, y = f * s + d * o, g = f * n + d * o;
    if (Math.max(p, m, y, g) <= f * a.x + d * a.y || Math.min(p, m, y, g) >= f * l.x + d * l.y)
      return !1;
    const x = u * (a.y - c.y), A = u * (c.x - a.x), _ = x * s + A * r, M = x * n + A * r, v = x * s + A * o, b = x * n + A * o;
    return !(Math.max(_, M, v, b) <= x * a.x + A * a.y || Math.min(_, M, v, b) >= x * l.x + A * l.y);
  }
  /**
   * Pads the rectangle making it grow in all directions.
   *
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @example
   * ```ts
   * // Basic padding
   * const rect = new Rectangle(100, 100, 200, 150);
   * rect.pad(10); // Adds 10px padding on all sides
   *
   * // Different horizontal and vertical padding
   * const uiRect = new Rectangle(0, 0, 100, 50);
   * uiRect.pad(20, 10); // 20px horizontal, 10px vertical
   * ```
   * @remarks
   * - Adjusts x/y by subtracting padding
   * - Increases width/height by padding * 2
   * - Common in UI layout calculations
   * - Chainable with other methods
   * @param paddingX - The horizontal padding amount
   * @param paddingY - The vertical padding amount
   * @returns Returns itself
   * @see {@link Rectangle.enlarge} For growing to include another rectangle
   * @see {@link Rectangle.fit} For shrinking to fit within another rectangle
   */
  pad(t = 0, e = t) {
    return this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this;
  }
  /**
   * Fits this rectangle around the passed one.
   * @example
   * ```ts
   * // Basic fitting
   * const container = new Rectangle(0, 0, 100, 100);
   * const content = new Rectangle(25, 25, 200, 200);
   * content.fit(container); // Clips to container bounds
   * ```
   * @param rectangle - The rectangle to fit around
   * @returns Returns itself
   * @see {@link Rectangle.enlarge} For growing to include another rectangle
   * @see {@link Rectangle.pad} For adding padding around the rectangle
   */
  fit(t) {
    const e = Math.max(this.x, t.x), s = Math.min(this.x + this.width, t.x + t.width), n = Math.max(this.y, t.y), r = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(s - e, 0), this.y = n, this.height = Math.max(r - n, 0), this;
  }
  /**
   * Enlarges rectangle so that its corners lie on a grid defined by resolution.
   * @example
   * ```ts
   * // Basic grid alignment
   * const rect = new Rectangle(10.2, 10.6, 100.8, 100.4);
   * rect.ceil(); // Aligns to whole pixels
   *
   * // Custom resolution grid
   * const uiRect = new Rectangle(5.3, 5.7, 50.2, 50.8);
   * uiRect.ceil(0.5); // Aligns to half pixels
   *
   * // Use with precision value
   * const preciseRect = new Rectangle(20.001, 20.999, 100.001, 100.999);
   * preciseRect.ceil(1, 0.01); // Handles small decimal variations
   * ```
   * @param resolution - The grid size to align to (1 = whole pixels)
   * @param eps - Small number to prevent floating point errors
   * @returns Returns itself
   * @see {@link Rectangle.fit} For constraining to bounds
   * @see {@link Rectangle.enlarge} For growing dimensions
   */
  ceil(t = 1, e = 1e-3) {
    const s = Math.ceil((this.x + this.width - e) * t) / t, n = Math.ceil((this.y + this.height - e) * t) / t;
    return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = s - this.x, this.height = n - this.y, this;
  }
  /**
   * Scales the rectangle's dimensions and position by the specified factors.
   * @example
   * ```ts
   * const rect = new Rectangle(50, 50, 100, 100);
   *
   * // Scale uniformly
   * rect.scale(0.5, 0.5);
   * // rect is now: x=25, y=25, width=50, height=50
   *
   * // non-uniformly
   * rect.scale(0.5, 1);
   * // rect is now: x=25, y=50, width=50, height=100
   * ```
   * @param x - The factor by which to scale the horizontal properties (x, width).
   * @param y - The factor by which to scale the vertical properties (y, height).
   * @returns Returns itself
   */
  scale(t, e = t) {
    return this.x *= t, this.y *= e, this.width *= t, this.height *= e, this;
  }
  /**
   * Enlarges this rectangle to include the passed rectangle.
   * @example
   * ```ts
   * // Basic enlargement
   * const rect = new Rectangle(50, 50, 100, 100);
   * const other = new Rectangle(0, 0, 200, 75);
   * rect.enlarge(other);
   * // rect is now: x=0, y=0, width=200, height=150
   *
   * // Use for bounding box calculation
   * const bounds = new Rectangle();
   * objects.forEach((obj) => {
   *     bounds.enlarge(obj.getBounds());
   * });
   * ```
   * @param rectangle - The rectangle to include
   * @returns Returns itself
   * @see {@link Rectangle.fit} For shrinking to fit within another rectangle
   * @see {@link Rectangle.pad} For adding padding around the rectangle
   */
  enlarge(t) {
    const e = Math.min(this.x, t.x), s = Math.max(this.x + this.width, t.x + t.width), n = Math.min(this.y, t.y), r = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = s - e, this.y = n, this.height = r - n, this;
  }
  /**
   * Returns the framing rectangle of the rectangle as a Rectangle object
   * @example
   * ```ts
   * // Basic bounds retrieval
   * const rect = new Rectangle(100, 100, 200, 150);
   * const bounds = rect.getBounds();
   *
   * // Reuse existing rectangle
   * const out = new Rectangle();
   * rect.getBounds(out);
   * ```
   * @param out - Optional rectangle to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle.copyFrom} For direct copying
   * @see {@link Rectangle.clone} For creating new copy
   */
  getBounds(t) {
    return t ||= new H(), t.copyFrom(this), t;
  }
  /**
   * Determines whether another Rectangle is fully contained within this Rectangle.
   *
   * Rectangles that occupy the same space are considered to be containing each other.
   *
   * Rectangles without area (width or height equal to zero) can't contain anything,
   * not even other arealess rectangles.
   * @example
   * ```ts
   * // Check if one rectangle contains another
   * const container = new Rectangle(0, 0, 100, 100);
   * const inner = new Rectangle(25, 25, 50, 50);
   *
   * console.log(container.containsRect(inner)); // true
   *
   * // Check overlapping rectangles
   * const partial = new Rectangle(75, 75, 50, 50);
   * console.log(container.containsRect(partial)); // false
   *
   * // Zero-area rectangles
   * const empty = new Rectangle(0, 0, 0, 100);
   * console.log(container.containsRect(empty)); // false
   * ```
   * @param other - The Rectangle to check for containment
   * @returns True if other is fully contained within this Rectangle
   * @see {@link Rectangle.contains} For point containment
   * @see {@link Rectangle.intersects} For overlap testing
   */
  containsRect(t) {
    if (this.width <= 0 || this.height <= 0) return !1;
    const e = t.x, s = t.y, n = t.x + t.width, r = t.y + t.height;
    return e >= this.x && e < this.x + this.width && s >= this.y && s < this.y + this.height && n >= this.x && n < this.x + this.width && r >= this.y && r < this.y + this.height;
  }
  /**
   * Sets the position and dimensions of the rectangle.
   * @example
   * ```ts
   * // Basic usage
   * const rect = new Rectangle();
   * rect.set(100, 100, 200, 150);
   *
   * // Chain with other operations
   * const bounds = new Rectangle()
   *     .set(0, 0, 100, 100)
   *     .pad(10);
   * ```
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   * @returns Returns itself for method chaining
   * @see {@link Rectangle.copyFrom} For copying from another rectangle
   * @see {@link Rectangle.clone} For creating a new copy
   */
  set(t, e, s, n) {
    return this.x = t, this.y = e, this.width = s, this.height = n, this;
  }
  // #if _DEBUG
  toString() {
    return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
  // #endif
}
class Ue {
  /**
   * The X coordinate of the center of this circle
   * @example
   * ```ts
   * // Basic x position
   * const circle = new Circle();
   * circle.x = 100;
   *
   * // Center circle on point
   * circle.x = point.x;
   * ```
   * @default 0
   */
  x;
  /**
   * The Y coordinate of the center of this circle
   * @example
   * ```ts
   * // Basic y position
   * const circle = new Circle();
   * circle.y = 200;
   *
   * // Center circle on point
   * circle.y = point.y;
   * ```
   * @default 0
   */
  y;
  /**
   * The radius of the circle
   * @example
   * ```ts
   * // Basic radius setting
   * const circle = new Circle(100, 100);
   * circle.radius = 50;
   *
   * // Calculate area
   * const area = Math.PI * circle.radius * circle.radius;
   * ```
   * @default 0
   */
  radius;
  /**
   * The type of the object, mainly used to avoid `instanceof` checks.
   * @example
   * ```ts
   * // Check shape type
   * const shape = new Circle(0, 0, 50);
   * console.log(shape.type); // 'circle'
   *
   * // Use in type guards
   * if (shape.type === 'circle') {
   *     console.log(shape.radius);
   * }
   * ```
   * @remarks
   * - Used for shape type checking
   * - More efficient than instanceof
   * - Read-only property
   * @readonly
   * @default 'circle'
   * @see {@link SHAPE_PRIMITIVE} For all shape types
   * @see {@link ShapePrimitive} For shape interface
   */
  type = "circle";
  /**
   * @param x - The X coordinate of the center of this circle
   * @param y - The Y coordinate of the center of this circle
   * @param radius - The radius of the circle
   */
  constructor(t = 0, e = 0, s = 0) {
    this.x = t, this.y = e, this.radius = s;
  }
  /**
   * Creates a clone of this Circle instance.
   * @example
   * ```ts
   * // Basic circle cloning
   * const original = new Circle(100, 100, 50);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.radius = 75;
   *
   * // Verify independence
   * console.log(original.radius); // 50
   * console.log(modified.radius); // 75
   * ```
   * @returns A copy of the Circle
   * @see {@link Circle.copyFrom} For copying into existing circle
   * @see {@link Circle.copyTo} For copying to another circle
   */
  clone() {
    return new Ue(this.x, this.y, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle.
   *
   * Uses the distance formula to determine if a point is inside the circle's radius.
   *
   * Commonly used for hit testing in PixiJS events and graphics.
   * @example
   * ```ts
   * // Basic containment check
   * const circle = new Circle(100, 100, 50);
   * const isInside = circle.contains(120, 120);
   *
   * // Check mouse position
   * const circle = new Circle(0, 0, 100);
   * container.hitArea = circle;
   * container.on('pointermove', (e) => {
   *     // only called if pointer is within circle
   * });
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Circle
   * @see {@link Circle.strokeContains} For checking stroke intersection
   * @see {@link Circle.getBounds} For getting bounding box
   */
  contains(t, e) {
    if (this.radius <= 0) return !1;
    const s = this.radius * this.radius;
    let n = this.x - t, r = this.y - e;
    return n *= n, r *= r, n + r <= s;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const circle = new Circle(100, 100, 50);
   * const isOnStroke = circle.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = circle.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = circle.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = circle.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width - The width of the line to check
   * @param alignment - The alignment of the stroke, 0.5 by default
   * @returns Whether the x/y coordinates are within this Circle's stroke
   * @see {@link Circle.contains} For checking fill containment
   * @see {@link Circle.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, s, n = 0.5) {
    if (this.radius === 0) return !1;
    const r = this.x - t, o = this.y - e, a = this.radius, h = (1 - n) * s, c = Math.sqrt(r * r + o * o);
    return c <= a + h && c > a - (s - h);
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object.
   * @example
   * ```ts
   * // Basic bounds calculation
   * const circle = new Circle(100, 100, 50);
   * const bounds = circle.getBounds();
   * // bounds: x=50, y=50, width=100, height=100
   *
   * // Reuse existing rectangle
   * const rect = new Rectangle();
   * circle.getBounds(rect);
   * ```
   * @param out - Optional Rectangle object to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link Circle.contains} For point containment
   */
  getBounds(t) {
    return t ||= new H(), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
  }
  /**
   * Copies another circle to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Circle(100, 100, 50);
   * const target = new Circle();
   * target.copyFrom(source);
   * ```
   * @param circle - The circle to copy from
   * @returns Returns itself
   * @see {@link Circle.copyTo} For copying to another circle
   * @see {@link Circle.clone} For creating new circle copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.radius = t.radius, this;
  }
  /**
   * Copies this circle to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Circle(100, 100, 50);
   * const target = new Circle();
   * source.copyTo(target);
   * ```
   * @param circle - The circle to copy to
   * @returns Returns given parameter
   * @see {@link Circle.copyFrom} For copying from another circle
   * @see {@link Circle.clone} For creating new circle copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  // #if _DEBUG
  toString() {
    return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
  }
  // #endif
}
class De {
  /**
   * The X coordinate of the center of this ellipse
   * @example
   * ```ts
   * // Basic x position
   * const ellipse = new Ellipse();
   * ellipse.x = 100;
   * ```
   * @default 0
   */
  x;
  /**
   * The Y coordinate of the center of this ellipse
   * @example
   * ```ts
   * // Basic y position
   * const ellipse = new Ellipse();
   * ellipse.y = 200;
   * ```
   * @default 0
   */
  y;
  /**
   * The half width of this ellipse
   * @example
   * ```ts
   * // Set half width
   * const ellipse = new Ellipse(100, 100);
   * ellipse.halfWidth = 50; // Total width will be 100
   * ```
   * @default 0
   */
  halfWidth;
  /**
   * The half height of this ellipse
   * @example
   * ```ts
   * // Set half height
   * const ellipse = new Ellipse(100, 100);
   * ellipse.halfHeight = 25; // Total height will be 50
   * ```
   * @default 0
   */
  halfHeight;
  /**
   * The type of the object, mainly used to avoid `instanceof` checks
   * @example
   * ```ts
   * // Check shape type
   * const shape = new Ellipse(0, 0, 50, 25);
   * console.log(shape.type); // 'ellipse'
   *
   * // Use in type guards
   * if (shape.type === 'ellipse') {
   *     console.log(shape.halfWidth, shape.halfHeight);
   * }
   * ```
   * @readonly
   * @default 'ellipse'
   * @see {@link SHAPE_PRIMITIVE} For all shape types
   */
  type = "ellipse";
  /**
   * @param x - The X coordinate of the center of this ellipse
   * @param y - The Y coordinate of the center of this ellipse
   * @param halfWidth - The half width of this ellipse
   * @param halfHeight - The half height of this ellipse
   */
  constructor(t = 0, e = 0, s = 0, n = 0) {
    this.x = t, this.y = e, this.halfWidth = s, this.halfHeight = n;
  }
  /**
   * Creates a clone of this Ellipse instance.
   * @example
   * ```ts
   * // Basic cloning
   * const original = new Ellipse(100, 100, 50, 25);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.halfWidth *= 2;
   * modified.halfHeight *= 2;
   *
   * // Verify independence
   * console.log(original.halfWidth);  // 50
   * console.log(modified.halfWidth);  // 100
   * ```
   * @returns A copy of the ellipse
   * @see {@link Ellipse.copyFrom} For copying into existing ellipse
   * @see {@link Ellipse.copyTo} For copying to another ellipse
   */
  clone() {
    return new De(this.x, this.y, this.halfWidth, this.halfHeight);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse.
   * Uses normalized coordinates and the ellipse equation to determine containment.
   * @example
   * ```ts
   * // Basic containment check
   * const ellipse = new Ellipse(100, 100, 50, 25);
   * const isInside = ellipse.contains(120, 110);
   * ```
   * @remarks
   * - Uses ellipse equation (x²/a² + y²/b² ≤ 1)
   * - Returns false if dimensions are 0 or negative
   * - Normalized to center (0,0) for calculation
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coords are within this ellipse
   * @see {@link Ellipse.strokeContains} For checking stroke intersection
   * @see {@link Ellipse.getBounds} For getting containing rectangle
   */
  contains(t, e) {
    if (this.halfWidth <= 0 || this.halfHeight <= 0)
      return !1;
    let s = (t - this.x) / this.halfWidth, n = (e - this.y) / this.halfHeight;
    return s *= s, n *= n, s + n <= 1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse including stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const ellipse = new Ellipse(100, 100, 50, 25);
   * const isOnStroke = ellipse.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = ellipse.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = ellipse.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = ellipse.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @remarks
   * - Uses normalized ellipse equations
   * - Considers stroke alignment
   * - Returns false if dimensions are 0
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coords are within this ellipse's stroke
   * @see {@link Ellipse.contains} For checking fill containment
   * @see {@link Ellipse.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, s, n = 0.5) {
    const { halfWidth: r, halfHeight: o } = this;
    if (r <= 0 || o <= 0)
      return !1;
    const a = s * (1 - n), h = s - a, c = r - h, l = o - h, u = r + a, f = o + a, d = t - this.x, p = e - this.y, m = d * d / (c * c) + p * p / (l * l), y = d * d / (u * u) + p * p / (f * f);
    return m > 1 && y <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object.
   * @example
   * ```ts
   * // Basic bounds calculation
   * const ellipse = new Ellipse(100, 100, 50, 25);
   * const bounds = ellipse.getBounds();
   * // bounds: x=50, y=75, width=100, height=50
   *
   * // Reuse existing rectangle
   * const rect = new Rectangle();
   * ellipse.getBounds(rect);
   * ```
   * @remarks
   * - Creates Rectangle if none provided
   * - Top-left is (x-halfWidth, y-halfHeight)
   * - Width is halfWidth * 2
   * - Height is halfHeight * 2
   * @param out - Optional Rectangle object to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link Ellipse.contains} For checking if a point is inside
   */
  getBounds(t) {
    return t ||= new H(), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
  }
  /**
   * Copies another ellipse to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Ellipse(100, 100, 50, 25);
   * const target = new Ellipse();
   * target.copyFrom(source);
   * ```
   * @param ellipse - The ellipse to copy from
   * @returns Returns itself
   * @see {@link Ellipse.copyTo} For copying to another ellipse
   * @see {@link Ellipse.clone} For creating new ellipse copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.halfWidth = t.halfWidth, this.halfHeight = t.halfHeight, this;
  }
  /**
   * Copies this ellipse to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Ellipse(100, 100, 50, 25);
   * const target = new Ellipse();
   * source.copyTo(target);
   * ```
   * @param ellipse - The ellipse to copy to
   * @returns Returns given parameter
   * @see {@link Ellipse.copyFrom} For copying from another ellipse
   * @see {@link Ellipse.clone} For creating new ellipse copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  // #if _DEBUG
  toString() {
    return `[pixi.js/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`;
  }
  // #endif
}
let Vi, Gi;
class Yt {
  /**
   * An array of the points of this polygon stored as a flat array of numbers.
   * @example
   * ```ts
   * // Access points directly
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * console.log(polygon.points); // [0, 0, 100, 0, 50, 100]
   *
   * // Modify points
   * polygon.points[0] = 10; // Move first x coordinate
   * polygon.points[1] = 10; // Move first y coordinate
   * ```
   * @remarks
   * - Stored as [x1, y1, x2, y2, ...]
   * - Each pair represents a vertex
   * - Length is always even
   * - Can be modified directly
   */
  points;
  /**
   * Indicates if the polygon path is closed.
   * @example
   * ```ts
   * // Create open polygon
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * polygon.closePath = false;
   *
   * // Check path state
   * if (polygon.closePath) {
   *     // Last point connects to first
   * }
   * ```
   * @remarks
   * - True by default
   * - False after moveTo
   * - True after closePath
   * @default true
   */
  closePath;
  /**
   * The type of the object, mainly used to avoid `instanceof` checks
   * @example
   * ```ts
   * // Check shape type
   * const shape = new Polygon([0, 0, 100, 0, 50, 100]);
   * console.log(shape.type); // 'polygon'
   *
   * // Use in type guards
   * if (shape.type === 'polygon') {
   *     // TypeScript knows this is a Polygon
   *     console.log(shape.points.length);
   * }
   * ```
   * @readonly
   * @default 'polygon'
   * @see {@link SHAPE_PRIMITIVE} For all shape types
   */
  type = "polygon";
  /**
   * @param points - This can be an array of Points
   *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
   *  the arguments passed can be all the points of the polygon e.g.
   *  `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat
   *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
   */
  constructor(...t) {
    let e = Array.isArray(t[0]) ? t[0] : t;
    if (typeof e[0] != "number") {
      const s = [];
      for (let n = 0, r = e.length; n < r; n++)
        s.push(e[n].x, e[n].y);
      e = s;
    }
    this.points = e, this.closePath = !0;
  }
  /**
   * Determines whether the polygon's points are arranged in a clockwise direction.
   * Uses the shoelace formula (surveyor's formula) to calculate the signed area.
   *
   * A positive area indicates clockwise winding, while negative indicates counter-clockwise.
   *
   * The formula sums up the cross products of adjacent vertices:
   * For each pair of adjacent points (x1,y1) and (x2,y2), we calculate (x1*y2 - x2*y1)
   * The final sum divided by 2 gives the signed area - positive for clockwise.
   * @example
   * ```ts
   * // Check polygon winding
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * console.log(polygon.isClockwise()); // Check direction
   *
   * // Use in path construction
   * const hole = new Polygon([25, 25, 75, 25, 75, 75, 25, 75]);
   * if (hole.isClockwise() === shape.isClockwise()) {
   *     hole.points.reverse(); // Reverse for proper hole winding
   * }
   * ```
   * @returns `true` if the polygon's points are arranged clockwise, `false` if counter-clockwise
   */
  isClockwise() {
    let t = 0;
    const e = this.points, s = e.length;
    for (let n = 0; n < s; n += 2) {
      const r = e[n], o = e[n + 1], a = e[(n + 2) % s], h = e[(n + 3) % s];
      t += (a - r) * (h + o);
    }
    return t < 0;
  }
  /**
   * Checks if this polygon completely contains another polygon.
   * Used for detecting holes in shapes, like when parsing SVG paths.
   * @example
   * ```ts
   * // Basic containment check
   * const outerSquare = new Polygon([0,0, 100,0, 100,100, 0,100]); // A square
   * const innerSquare = new Polygon([25,25, 75,25, 75,75, 25,75]); // A smaller square inside
   *
   * outerSquare.containsPolygon(innerSquare); // Returns true
   * innerSquare.containsPolygon(outerSquare); // Returns false
   * ```
   * @remarks
   * - Uses bounds check for quick rejection
   * - Tests all points for containment
   * @param polygon - The polygon to test for containment
   * @returns True if this polygon completely contains the other polygon
   * @see {@link Polygon.contains} For single point testing
   * @see {@link Polygon.getBounds} For bounds calculation
   */
  containsPolygon(t) {
    const e = this.getBounds(Vi), s = t.getBounds(Gi);
    if (!e.containsRect(s))
      return !1;
    const n = t.points;
    for (let r = 0; r < n.length; r += 2) {
      const o = n[r], a = n[r + 1];
      if (!this.contains(o, a))
        return !1;
    }
    return !0;
  }
  /**
   * Creates a clone of this polygon.
   * @example
   * ```ts
   * // Basic cloning
   * const original = new Polygon([0, 0, 100, 0, 50, 100]);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.points[0] = 10; // Modify first x coordinate
   * ```
   * @returns A copy of the polygon
   * @see {@link Polygon.copyFrom} For copying into existing polygon
   * @see {@link Polygon.copyTo} For copying to another polygon
   */
  clone() {
    const t = this.points.slice(), e = new Yt(t);
    return e.closePath = this.closePath, e;
  }
  /**
   * Checks whether the x and y coordinates passed to this function are contained within this polygon.
   * Uses raycasting algorithm for point-in-polygon testing.
   * @example
   * ```ts
   * // Basic containment check
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * const isInside = polygon.contains(25, 25); // true
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this polygon
   * @see {@link Polygon.strokeContains} For checking stroke intersection
   * @see {@link Polygon.containsPolygon} For polygon-in-polygon testing
   */
  contains(t, e) {
    let s = !1;
    const n = this.points.length / 2;
    for (let r = 0, o = n - 1; r < n; o = r++) {
      const a = this.points[r * 2], h = this.points[r * 2 + 1], c = this.points[o * 2], l = this.points[o * 2 + 1];
      h > e != l > e && t < (c - a) * ((e - h) / (l - h)) + a && (s = !s);
    }
    return s;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this polygon including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * const isOnStroke = polygon.strokeContains(25, 25, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = polygon.strokeContains(25, 25, 4, 1);   // Inside
   * const centerStroke = polygon.strokeContains(25, 25, 4, 0.5); // Centered
   * const outerStroke = polygon.strokeContains(25, 25, 4, 0);   // Outside
   * ```
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coordinates are within this polygon's stroke
   * @see {@link Polygon.contains} For checking fill containment
   * @see {@link Polygon.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, s, n = 0.5) {
    const r = s * s, o = r * (1 - n), a = r - o, { points: h } = this, c = h.length - (this.closePath ? 0 : 2);
    for (let l = 0; l < c; l += 2) {
      const u = h[l], f = h[l + 1], d = h[(l + 2) % h.length], p = h[(l + 3) % h.length], m = oe(t, e, u, f, d, p), y = Math.sign((d - u) * (e - f) - (p - f) * (t - u));
      if (m <= (y < 0 ? a : o))
        return !0;
    }
    return !1;
  }
  /**
   * Returns the framing rectangle of the polygon as a Rectangle object.
   * @example
   * ```ts
   * // Basic bounds calculation
   * const polygon = new Polygon([0, 0, 100, 0, 50, 100]);
   * const bounds = polygon.getBounds();
   * // bounds: x=0, y=0, width=100, height=100
   *
   * // Reuse existing rectangle
   * const rect = new Rectangle();
   * polygon.getBounds(rect);
   * ```
   * @param out - Optional rectangle to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link Polygon.contains} For checking if a point is inside
   */
  getBounds(t) {
    t ||= new H();
    const e = this.points;
    let s = 1 / 0, n = -1 / 0, r = 1 / 0, o = -1 / 0;
    for (let a = 0, h = e.length; a < h; a += 2) {
      const c = e[a], l = e[a + 1];
      s = c < s ? c : s, n = c > n ? c : n, r = l < r ? l : r, o = l > o ? l : o;
    }
    return t.x = s, t.width = n - s, t.y = r, t.height = o - r, t;
  }
  /**
   * Copies another polygon to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Polygon([0, 0, 100, 0, 50, 100]);
   * const target = new Polygon();
   * target.copyFrom(source);
   * ```
   * @param polygon - The polygon to copy from
   * @returns Returns itself
   * @see {@link Polygon.copyTo} For copying to another polygon
   * @see {@link Polygon.clone} For creating new polygon copy
   */
  copyFrom(t) {
    return this.points = t.points.slice(), this.closePath = t.closePath, this;
  }
  /**
   * Copies this polygon to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Polygon([0, 0, 100, 0, 50, 100]);
   * const target = new Polygon();
   * source.copyTo(target);
   * ```
   * @param polygon - The polygon to copy to
   * @returns Returns given parameter
   * @see {@link Polygon.copyFrom} For copying from another polygon
   * @see {@link Polygon.clone} For creating new polygon copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  // #if _DEBUG
  toString() {
    return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((t, e) => `${t}, ${e}`, "")}]`;
  }
  // #endif
  /**
   * Get the last X coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.lastX); // 300
   * ```
   * @readonly
   * @returns The x-coordinate of the last vertex
   * @see {@link Polygon.lastY} For last Y coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get lastX() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the last Y coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.lastY); // 400
   * ```
   * @readonly
   * @returns The y-coordinate of the last vertex
   * @see {@link Polygon.lastX} For last X coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get lastY() {
    return this.points[this.points.length - 1];
  }
  /**
   * Get the last X coordinate of the polygon.
   * @readonly
   * @deprecated since 8.11.0, use {@link Polygon.lastX} instead.
   */
  get x() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the last Y coordinate of the polygon.
   * @readonly
   * @deprecated since 8.11.0, use {@link Polygon.lastY} instead.
   */
  get y() {
    return this.points[this.points.length - 1];
  }
  /**
   * Get the first X coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.x); // 0
   * ```
   * @readonly
   * @returns The x-coordinate of the first vertex
   * @see {@link Polygon.startY} For first Y coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get startX() {
    return this.points[0];
  }
  /**
   * Get the first Y coordinate of the polygon.
   * @example
   * ```ts
   * // Basic coordinate access
   * const polygon = new Polygon([0, 0, 100, 200, 300, 400]);
   * console.log(polygon.y); // 0
   * ```
   * @readonly
   * @returns The y-coordinate of the first vertex
   * @see {@link Polygon.startX} For first X coordinate
   * @see {@link Polygon.points} For raw points array
   */
  get startY() {
    return this.points[1];
  }
}
const Qt = (i, t, e, s, n, r, o) => {
  const a = i - e, h = t - s, c = Math.sqrt(a * a + h * h);
  return c >= n - r && c <= n + o;
};
class Oe {
  /**
   * The X coordinate of the upper-left corner of the rounded rectangle
   * @example
   * ```ts
   * // Basic x position
   * const rect = new RoundedRectangle();
   * rect.x = 100;
   * ```
   * @default 0
   */
  x;
  /**
   * The Y coordinate of the upper-left corner of the rounded rectangle
   * @example
   * ```ts
   * // Basic y position
   * const rect = new RoundedRectangle();
   * rect.y = 100;
   * ```
   * @default 0
   */
  y;
  /**
   * The overall width of this rounded rectangle
   * @example
   * ```ts
   * // Basic width setting
   * const rect = new RoundedRectangle();
   * rect.width = 200; // Total width will be 200
   * ```
   * @default 0
   */
  width;
  /**
   * The overall height of this rounded rectangle
   * @example
   * ```ts
   * // Basic height setting
   * const rect = new RoundedRectangle();
   * rect.height = 150; // Total height will be 150
   * ```
   * @default 0
   */
  height;
  /**
   * Controls the radius of the rounded corners
   * @example
   * ```ts
   * // Basic radius setting
   * const rect = new RoundedRectangle(0, 0, 200, 150);
   * rect.radius = 20;
   *
   * // Clamp to maximum safe radius
   * rect.radius = Math.min(rect.width, rect.height) / 2;
   *
   * // Create pill shape
   * rect.radius = rect.height / 2;
   * ```
   * @remarks
   * - Automatically clamped to half of smallest dimension
   * - Common values: 0-20 for UI elements
   * - Higher values create more rounded corners
   * @default 20
   */
  radius;
  /**
   * The type of the object, mainly used to avoid `instanceof` checks
   * @example
   * ```ts
   * // Check shape type
   * const shape = new RoundedRectangle(0, 0, 100, 100, 20);
   * console.log(shape.type); // 'roundedRectangle'
   *
   * // Use in type guards
   * if (shape.type === 'roundedRectangle') {
   *     console.log(shape.radius);
   * }
   * ```
   * @readonly
   * @default 'roundedRectangle'
   * @see {@link SHAPE_PRIMITIVE} For all shape types
   */
  type = "roundedRectangle";
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(t = 0, e = 0, s = 0, n = 0, r = 20) {
    this.x = t, this.y = e, this.width = s, this.height = n, this.radius = r;
  }
  /**
   * Returns the framing rectangle of the rounded rectangle as a Rectangle object
   * @example
   * ```ts
   * // Basic bounds calculation
   * const rect = new RoundedRectangle(100, 100, 200, 150, 20);
   * const bounds = rect.getBounds();
   * // bounds: x=100, y=100, width=200, height=150
   *
   * // Reuse existing rectangle
   * const out = new Rectangle();
   * rect.getBounds(out);
   * ```
   * @remarks
   * - Rectangle matches outer dimensions
   * - Ignores corner radius
   * @param out - Optional rectangle to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link RoundedRectangle.contains} For checking if a point is inside
   */
  getBounds(t) {
    return t ||= new H(), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @example
   * ```ts
   * // Basic cloning
   * const original = new RoundedRectangle(100, 100, 200, 150, 20);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.radius = 30;
   * modified.width *= 2;
   *
   * // Verify independence
   * console.log(original.radius);  // 20
   * console.log(modified.radius);  // 30
   * ```
   * @returns A copy of the rounded rectangle
   * @see {@link RoundedRectangle.copyFrom} For copying into existing rectangle
   * @see {@link RoundedRectangle.copyTo} For copying to another rectangle
   */
  clone() {
    return new Oe(this.x, this.y, this.width, this.height, this.radius);
  }
  /**
   * Copies another rectangle to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new RoundedRectangle(100, 100, 200, 150, 20);
   * const target = new RoundedRectangle();
   * target.copyFrom(source);
   *
   * // Chain with other operations
   * const rect = new RoundedRectangle()
   *     .copyFrom(source)
   *     .getBounds(rect);
   * ```
   * @param rectangle - The rectangle to copy from
   * @returns Returns itself
   * @see {@link RoundedRectangle.copyTo} For copying to another rectangle
   * @see {@link RoundedRectangle.clone} For creating new rectangle copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new RoundedRectangle(100, 100, 200, 150, 20);
   * const target = new RoundedRectangle();
   * source.copyTo(target);
   *
   * // Chain with other operations
   * const result = source
   *     .copyTo(new RoundedRectangle())
   *     .getBounds();
   * ```
   * @param rectangle - The rectangle to copy to
   * @returns Returns given parameter
   * @see {@link RoundedRectangle.copyFrom} For copying from another rectangle
   * @see {@link RoundedRectangle.clone} For creating new rectangle copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
   * @example
   * ```ts
   * // Basic containment check
   * const rect = new RoundedRectangle(100, 100, 200, 150, 20);
   * const isInside = rect.contains(150, 125); // true
   * // Check corner radius
   * const corner = rect.contains(100, 100); // false if within corner curve
   * ```
   * @remarks
   * - Returns false if width/height is 0 or negative
   * - Handles rounded corners with radius check
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rounded Rectangle
   * @see {@link RoundedRectangle.strokeContains} For checking stroke intersection
   * @see {@link RoundedRectangle.getBounds} For getting containing rectangle
   */
  contains(t, e) {
    if (this.width <= 0 || this.height <= 0)
      return !1;
    if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
      const s = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
      if (e >= this.y + s && e <= this.y + this.height - s || t >= this.x + s && t <= this.x + this.width - s)
        return !0;
      let n = t - (this.x + s), r = e - (this.y + s);
      const o = s * s;
      if (n * n + r * r <= o || (n = t - (this.x + this.width - s), n * n + r * r <= o) || (r = e - (this.y + this.height - s), n * n + r * r <= o) || (n = t - (this.x + s), n * n + r * r <= o))
        return !0;
    }
    return !1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const rect = new RoundedRectangle(100, 100, 200, 150, 20);
   * const isOnStroke = rect.strokeContains(150, 100, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = rect.strokeContains(150, 100, 4, 1);   // Inside
   * const centerStroke = rect.strokeContains(150, 100, 4, 0.5); // Centered
   * const outerStroke = rect.strokeContains(150, 100, 4, 0);   // Outside
   * ```
   * @param pX - The X coordinate of the point to test
   * @param pY - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coordinates are within this rectangle's stroke
   * @see {@link RoundedRectangle.contains} For checking fill containment
   * @see {@link RoundedRectangle.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, s, n = 0.5) {
    const { x: r, y: o, width: a, height: h, radius: c } = this, l = s * (1 - n), u = s - l, f = r + c, d = o + c, p = a - c * 2, m = h - c * 2, y = r + a, g = o + h;
    return (t >= r - l && t <= r + u || t >= y - u && t <= y + l) && e >= d && e <= d + m || (e >= o - l && e <= o + u || e >= g - u && e <= g + l) && t >= f && t <= f + p ? !0 : (
      // Top-left
      t < f && e < d && Qt(
        t,
        e,
        f,
        d,
        c,
        u,
        l
      ) || t > y - c && e < d && Qt(
        t,
        e,
        y - c,
        d,
        c,
        u,
        l
      ) || t > y - c && e > g - c && Qt(
        t,
        e,
        y - c,
        g - c,
        c,
        u,
        l
      ) || t < f && e > g - c && Qt(
        t,
        e,
        f,
        g - c,
        c,
        u,
        l
      )
    );
  }
  // #if _DEBUG
  toString() {
    return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
  }
  // #endif
}
class Ns {
  /**
   * The type of the object, mainly used to avoid `instanceof` checks
   * @example
   * ```ts
   * // Check shape type
   * const shape = new Triangle(0, 0, 100, 0, 50, 100);
   * console.log(shape.type); // 'triangle'
   *
   * // Use in type guards
   * if (shape.type === 'triangle') {
   *     console.log(shape.x2, shape.y2);
   * }
   * ```
   * @readonly
   * @default 'triangle'
   * @see {@link SHAPE_PRIMITIVE} For all shape types
   */
  type = "triangle";
  /**
   * The X coordinate of the first point of the triangle.
   * @example
   * ```ts
   * // Set first point x position
   * const triangle = new Triangle();
   * triangle.x = 100;
   * ```
   * @default 0
   */
  x;
  /**
   * The Y coordinate of the first point of the triangle.
   * @example
   * ```ts
   * // Set first point y position
   * const triangle = new Triangle();
   * triangle.y = 100;
   * ```
   * @default 0
   */
  y;
  /**
   * The X coordinate of the second point of the triangle.
   * @example
   * ```ts
   * // Create horizontal line for second point
   * const triangle = new Triangle(0, 0);
   * triangle.x2 = triangle.x + 100; // 100 units to the right
   * ```
   * @default 0
   */
  x2;
  /**
   * The Y coordinate of the second point of the triangle.
   * @example
   * ```ts
   * // Create vertical line for second point
   * const triangle = new Triangle(0, 0);
   * triangle.y2 = triangle.y + 100; // 100 units down
   * ```
   * @default 0
   */
  y2;
  /**
   * The X coordinate of the third point of the triangle.
   * @example
   * ```ts
   * // Create equilateral triangle
   * const triangle = new Triangle(0, 0, 100, 0);
   * triangle.x3 = 50;  // Middle point x
   * triangle.y3 = 86.6; // Height using sin(60°)
   * ```
   * @default 0
   */
  x3;
  /**
   * The Y coordinate of the third point of the triangle.
   * @example
   * ```ts
   * // Create right triangle
   * const triangle = new Triangle(0, 0, 100, 0);
   * triangle.x3 = 0;   // Align with first point
   * triangle.y3 = 100; // 100 units down
   * ```
   * @default 0
   */
  y3;
  /**
   * @param x - The X coord of the first point.
   * @param y - The Y coord of the first point.
   * @param x2 - The X coord of the second point.
   * @param y2 - The Y coord of the second point.
   * @param x3 - The X coord of the third point.
   * @param y3 - The Y coord of the third point.
   */
  constructor(t = 0, e = 0, s = 0, n = 0, r = 0, o = 0) {
    this.x = t, this.y = e, this.x2 = s, this.y2 = n, this.x3 = r, this.y3 = o;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this triangle
   * @example
   * ```ts
   * // Basic containment check
   * const triangle = new Triangle(0, 0, 100, 0, 50, 100);
   * const isInside = triangle.contains(25, 25); // true
   * ```
   * @remarks
   * - Uses barycentric coordinate system
   * - Works with any triangle shape
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Triangle
   * @see {@link Triangle.strokeContains} For checking stroke intersection
   * @see {@link Triangle.getBounds} For getting containing rectangle
   */
  contains(t, e) {
    const s = (this.x - this.x3) * (e - this.y3) - (this.y - this.y3) * (t - this.x3), n = (this.x2 - this.x) * (e - this.y) - (this.y2 - this.y) * (t - this.x);
    if (s < 0 != n < 0 && s !== 0 && n !== 0)
      return !1;
    const r = (this.x3 - this.x2) * (e - this.y2) - (this.y3 - this.y2) * (t - this.x2);
    return r === 0 || r < 0 == s + n <= 0;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this triangle including the stroke.
   * @example
   * ```ts
   * // Basic stroke check
   * const triangle = new Triangle(0, 0, 100, 0, 50, 100);
   * const isOnStroke = triangle.strokeContains(25, 25, 4); // 4px line width
   *
   * // Check with different alignments
   * const innerStroke = triangle.strokeContains(25, 25, 4, 1);   // Inside
   * const centerStroke = triangle.strokeContains(25, 25, 4, 0.5); // Centered
   * const outerStroke = triangle.strokeContains(25, 25, 4, 0);   // Outside
   * ```
   * @param pointX - The X coordinate of the point to test
   * @param pointY - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @param _alignment - The alignment of the stroke (1 = inner, 0.5 = centered, 0 = outer)
   * @returns Whether the x/y coordinates are within this triangle's stroke
   * @see {@link Triangle.contains} For checking fill containment
   * @see {@link Triangle.getBounds} For getting stroke bounds
   */
  strokeContains(t, e, s, n = 0.5) {
    const r = s / 2, o = r * r, { x: a, x2: h, x3: c, y: l, y2: u, y3: f } = this;
    return oe(t, e, a, l, h, f) <= o || oe(t, e, h, u, c, f) <= o || oe(t, e, c, f, a, l) <= o;
  }
  /**
   * Creates a clone of this Triangle
   * @example
   * ```ts
   * // Basic cloning
   * const original = new Triangle(0, 0, 100, 0, 50, 100);
   * const copy = original.clone();
   *
   * // Clone and modify
   * const modified = original.clone();
   * modified.x3 = 75;
   * modified.y3 = 150;
   *
   * // Verify independence
   * console.log(original.y3);  // 100
   * console.log(modified.y3);  // 150
   * ```
   * @returns A copy of the triangle
   * @see {@link Triangle.copyFrom} For copying into existing triangle
   * @see {@link Triangle.copyTo} For copying to another triangle
   */
  clone() {
    return new Ns(
      this.x,
      this.y,
      this.x2,
      this.y2,
      this.x3,
      this.y3
    );
  }
  /**
   * Copies another triangle to this one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Triangle(0, 0, 100, 0, 50, 100);
   * const target = new Triangle();
   * target.copyFrom(source);
   *
   * // Chain with other operations
   * const triangle = new Triangle()
   *     .copyFrom(source)
   *     .getBounds(rect);
   * ```
   * @param triangle - The triangle to copy from
   * @returns Returns itself
   * @see {@link Triangle.copyTo} For copying to another triangle
   * @see {@link Triangle.clone} For creating new triangle copy
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.x2 = t.x2, this.y2 = t.y2, this.x3 = t.x3, this.y3 = t.y3, this;
  }
  /**
   * Copies this triangle to another one.
   * @example
   * ```ts
   * // Basic copying
   * const source = new Triangle(0, 0, 100, 0, 50, 100);
   * const target = new Triangle();
   * source.copyTo(target);
   *
   * // Chain with other operations
   * const result = source
   *     .copyTo(new Triangle())
   *     .getBounds();
   * ```
   * @remarks
   * - Updates target triangle values
   * - Copies all point coordinates
   * - Returns target for chaining
   * - More efficient than clone()
   * @param triangle - The triangle to copy to
   * @returns Returns given parameter
   * @see {@link Triangle.copyFrom} For copying from another triangle
   * @see {@link Triangle.clone} For creating new triangle copy
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Returns the framing rectangle of the triangle as a Rectangle object
   * @example
   * ```ts
   * // Basic bounds calculation
   * const triangle = new Triangle(0, 0, 100, 0, 50, 100);
   * const bounds = triangle.getBounds();
   * // bounds: x=0, y=0, width=100, height=100
   *
   * // Reuse existing rectangle
   * const rect = new Rectangle();
   * triangle.getBounds(rect);
   * ```
   * @param out - Optional rectangle to store the result
   * @returns The framing rectangle
   * @see {@link Rectangle} For rectangle properties
   * @see {@link Triangle.contains} For checking if a point is inside
   */
  getBounds(t) {
    t ||= new H();
    const e = Math.min(this.x, this.x2, this.x3), s = Math.max(this.x, this.x2, this.x3), n = Math.min(this.y, this.y2, this.y3), r = Math.max(this.y, this.y2, this.y3);
    return t.x = e, t.y = n, t.width = s - e, t.height = r - n, t;
  }
}
const qi = 8, Jt = 11920929e-14, ji = 1;
function Hs(i, t, e, s, n, r, o, a, h, c) {
  const u = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, c ?? 0.5)
  );
  let f = (ji - u) / 1;
  return f *= f, zi(t, e, s, n, r, o, a, h, i, f), i;
}
function zi(i, t, e, s, n, r, o, a, h, c) {
  Ce(i, t, e, s, n, r, o, a, h, c, 0), h.push(o, a);
}
function Ce(i, t, e, s, n, r, o, a, h, c, l) {
  if (l > qi)
    return;
  const u = (i + e) / 2, f = (t + s) / 2, d = (e + n) / 2, p = (s + r) / 2, m = (n + o) / 2, y = (r + a) / 2, g = (u + d) / 2, x = (f + p) / 2, A = (d + m) / 2, _ = (p + y) / 2, M = (g + A) / 2, v = (x + _) / 2;
  if (l > 0) {
    let b = o - i, C = a - t;
    const k = Math.abs((e - o) * C - (s - a) * b), w = Math.abs((n - o) * C - (r - a) * b);
    if (k > Jt && w > Jt) {
      if ((k + w) * (k + w) <= c * (b * b + C * C)) {
        h.push(M, v);
        return;
      }
    } else if (k > Jt) {
      if (k * k <= c * (b * b + C * C)) {
        h.push(M, v);
        return;
      }
    } else if (w > Jt) {
      if (w * w <= c * (b * b + C * C)) {
        h.push(M, v);
        return;
      }
    } else if (b = M - (i + o) / 2, C = v - (t + a) / 2, b * b + C * C <= c) {
      h.push(M, v);
      return;
    }
  }
  Ce(i, t, u, f, g, x, M, v, h, c, l + 1), Ce(M, v, A, _, m, y, o, a, h, c, l + 1);
}
const Zi = 8, Ki = 11920929e-14, Qi = 1;
function Ji(i, t, e, s, n, r, o, a) {
  const c = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, a ?? 0.5)
  );
  let l = (Qi - c) / 1;
  return l *= l, tn(t, e, s, n, r, o, i, l), i;
}
function tn(i, t, e, s, n, r, o, a) {
  ke(o, i, t, e, s, n, r, a, 0), o.push(n, r);
}
function ke(i, t, e, s, n, r, o, a, h) {
  if (h > Zi)
    return;
  const c = (t + s) / 2, l = (e + n) / 2, u = (s + r) / 2, f = (n + o) / 2, d = (c + u) / 2, p = (l + f) / 2;
  let m = r - t, y = o - e;
  const g = Math.abs((s - r) * y - (n - o) * m);
  if (g > Ki) {
    if (g * g <= a * (m * m + y * y)) {
      i.push(d, p);
      return;
    }
  } else if (m = d - (t + r) / 2, y = p - (e + o) / 2, m * m + y * y <= a) {
    i.push(d, p);
    return;
  }
  ke(i, t, e, c, l, d, p, a, h + 1), ke(i, d, p, u, f, r, o, a, h + 1);
}
function $s(i, t, e, s, n, r, o, a) {
  let h = Math.abs(n - r);
  (!o && n > r || o && r > n) && (h = 2 * Math.PI - h), a ||= Math.max(6, Math.floor(6 * Math.pow(s, 1 / 3) * (h / Math.PI))), a = Math.max(a, 3);
  let c = h / a, l = n;
  c *= o ? -1 : 1;
  for (let u = 0; u < a + 1; u++) {
    const f = Math.cos(l), d = Math.sin(l), p = t + f * s, m = e + d * s;
    i.push(p, m), l += c;
  }
}
function en(i, t, e, s, n, r) {
  const o = i[i.length - 2], h = i[i.length - 1] - e, c = o - t, l = n - e, u = s - t, f = Math.abs(h * u - c * l);
  if (f < 1e-8 || r === 0) {
    (i[i.length - 2] !== t || i[i.length - 1] !== e) && i.push(t, e);
    return;
  }
  const d = h * h + c * c, p = l * l + u * u, m = h * l + c * u, y = r * Math.sqrt(d) / f, g = r * Math.sqrt(p) / f, x = y * m / d, A = g * m / p, _ = y * u + g * c, M = y * l + g * h, v = c * (g + x), b = h * (g + x), C = u * (y + A), k = l * (y + A), w = Math.atan2(b - M, v - _), P = Math.atan2(k - M, C - _);
  $s(
    i,
    _ + t,
    M + e,
    r,
    w,
    P,
    c * l > u * h
  );
}
const Ut = Math.PI * 2, be = {
  centerX: 0,
  centerY: 0,
  ang1: 0,
  ang2: 0
}, Ae = ({ x: i, y: t }, e, s, n, r, o, a, h) => {
  i *= e, t *= s;
  const c = n * i - r * t, l = r * i + n * t;
  return h.x = c + o, h.y = l + a, h;
};
function sn(i, t) {
  const e = t === -1.5707963267948966 ? -0.551915024494 : 1.3333333333333333 * Math.tan(t / 4), s = t === 1.5707963267948966 ? 0.551915024494 : e, n = Math.cos(i), r = Math.sin(i), o = Math.cos(i + t), a = Math.sin(i + t);
  return [
    {
      x: n - r * s,
      y: r + n * s
    },
    {
      x: o + a * s,
      y: a - o * s
    },
    {
      x: o,
      y: a
    }
  ];
}
const Je = (i, t, e, s) => {
  const n = i * s - t * e < 0 ? -1 : 1;
  let r = i * e + t * s;
  return r > 1 && (r = 1), r < -1 && (r = -1), n * Math.acos(r);
}, nn = (i, t, e, s, n, r, o, a, h, c, l, u, f) => {
  const d = Math.pow(n, 2), p = Math.pow(r, 2), m = Math.pow(l, 2), y = Math.pow(u, 2);
  let g = d * p - d * y - p * m;
  g < 0 && (g = 0), g /= d * y + p * m, g = Math.sqrt(g) * (o === a ? -1 : 1);
  const x = g * n / r * u, A = g * -r / n * l, _ = c * x - h * A + (i + e) / 2, M = h * x + c * A + (t + s) / 2, v = (l - x) / n, b = (u - A) / r, C = (-l - x) / n, k = (-u - A) / r, w = Je(1, 0, v, b);
  let P = Je(v, b, C, k);
  a === 0 && P > 0 && (P -= Ut), a === 1 && P < 0 && (P += Ut), f.centerX = _, f.centerY = M, f.ang1 = w, f.ang2 = P;
};
function rn(i, t, e, s, n, r, o, a = 0, h = 0, c = 0) {
  if (r === 0 || o === 0)
    return;
  const l = Math.sin(a * Ut / 360), u = Math.cos(a * Ut / 360), f = u * (t - s) / 2 + l * (e - n) / 2, d = -l * (t - s) / 2 + u * (e - n) / 2;
  if (f === 0 && d === 0)
    return;
  r = Math.abs(r), o = Math.abs(o);
  const p = Math.pow(f, 2) / Math.pow(r, 2) + Math.pow(d, 2) / Math.pow(o, 2);
  p > 1 && (r *= Math.sqrt(p), o *= Math.sqrt(p)), nn(
    t,
    e,
    s,
    n,
    r,
    o,
    h,
    c,
    l,
    u,
    f,
    d,
    be
  );
  let { ang1: m, ang2: y } = be;
  const { centerX: g, centerY: x } = be;
  let A = Math.abs(y) / (Ut / 4);
  Math.abs(1 - A) < 1e-7 && (A = 1);
  const _ = Math.max(Math.ceil(A), 1);
  y /= _;
  let M = i[i.length - 2], v = i[i.length - 1];
  const b = { x: 0, y: 0 };
  for (let C = 0; C < _; C++) {
    const k = sn(m, y), { x: w, y: P } = Ae(k[0], r, o, u, l, g, x, b), { x: L, y: B } = Ae(k[1], r, o, u, l, g, x, b), { x: G, y: Et } = Ae(k[2], r, o, u, l, g, x, b);
    Hs(
      i,
      M,
      v,
      w,
      P,
      L,
      B,
      G,
      Et
    ), M = G, v = Et, m += y;
  }
}
const ue = {
  extension: {
    type: "ExtensionType.ShapeBuilder",
    name: "circle"
  },
  build(i, t) {
    let e, s, n, r, o, a;
    if (i.type === "circle") {
      const _ = i;
      if (o = a = _.radius, o <= 0)
        return !1;
      e = _.x, s = _.y, n = r = 0;
    } else if (i.type === "ellipse") {
      const _ = i;
      if (o = _.halfWidth, a = _.halfHeight, o <= 0 || a <= 0)
        return !1;
      e = _.x, s = _.y, n = r = 0;
    } else {
      const _ = i, M = _.width / 2, v = _.height / 2;
      e = _.x + M, s = _.y + v, o = a = Math.max(0, Math.min(_.radius, Math.min(M, v))), n = M - o, r = v - a;
    }
    if (n < 0 || r < 0)
      return !1;
    const h = Math.ceil(2.3 * Math.sqrt(o + a)), c = h * 8 + (n ? 4 : 0) + (r ? 4 : 0);
    if (c === 0)
      return !1;
    if (h === 0)
      return t[0] = t[6] = e + n, t[1] = t[3] = s + r, t[2] = t[4] = e - n, t[5] = t[7] = s - r, !0;
    let l = 0, u = h * 4 + (n ? 2 : 0) + 2, f = u, d = c, p = n + o, m = r, y = e + p, g = e - p, x = s + m;
    if (t[l++] = y, t[l++] = x, t[--u] = x, t[--u] = g, r) {
      const _ = s - m;
      t[f++] = g, t[f++] = _, t[--d] = _, t[--d] = y;
    }
    for (let _ = 1; _ < h; _++) {
      const M = Math.PI / 2 * (_ / h), v = n + Math.cos(M) * o, b = r + Math.sin(M) * a, C = e + v, k = e - v, w = s + b, P = s - b;
      t[l++] = C, t[l++] = w, t[--u] = w, t[--u] = k, t[f++] = k, t[f++] = P, t[--d] = P, t[--d] = C;
    }
    p = n, m = r + a, y = e + p, g = e - p, x = s + m;
    const A = s - m;
    return t[l++] = y, t[l++] = x, t[--d] = A, t[--d] = y, n && (t[l++] = g, t[l++] = x, t[--d] = A, t[--d] = g), !0;
  },
  triangulate(i, t, e, s, n, r) {
    if (i.length === 0)
      return;
    let o = 0, a = 0;
    for (let l = 0; l < i.length; l += 2)
      o += i[l], a += i[l + 1];
    o /= i.length / 2, a /= i.length / 2;
    let h = s;
    t[h * e] = o, t[h * e + 1] = a;
    const c = h++;
    for (let l = 0; l < i.length; l += 2)
      t[h * e] = i[l], t[h * e + 1] = i[l + 1], l > 0 && (n[r++] = h, n[r++] = c, n[r++] = h - 1), h++;
    n[r++] = c + 1, n[r++] = c, n[r++] = h - 1;
  }
}, Sr = { ...ue, extension: { ...ue.extension, name: "ellipse" } }, Cr = { ...ue, extension: { ...ue.extension, name: "roundedRectangle" } }, Ws = 1e-4, ts = 1e-4;
function on(i) {
  const t = i.length;
  if (t < 6)
    return 1;
  let e = 0;
  for (let s = 0, n = i[t - 2], r = i[t - 1]; s < t; s += 2) {
    const o = i[s], a = i[s + 1];
    e += (o - n) * (a + r), n = o, r = a;
  }
  return e < 0 ? -1 : 1;
}
function es(i, t, e, s, n, r, o, a) {
  const h = i - e * n, c = t - s * n, l = i + e * r, u = t + s * r;
  let f, d;
  o ? (f = s, d = -e) : (f = -s, d = e);
  const p = h + f, m = c + d, y = l + f, g = u + d;
  return a.push(p, m), a.push(y, g), 2;
}
function ut(i, t, e, s, n, r, o, a) {
  const h = e - i, c = s - t;
  let l = Math.atan2(h, c), u = Math.atan2(n - i, r - t);
  a && l < u ? l += Math.PI * 2 : !a && l > u && (u += Math.PI * 2);
  let f = l;
  const d = u - l, p = Math.abs(d), m = Math.sqrt(h * h + c * c), y = (15 * p * Math.sqrt(m) / Math.PI >> 0) + 1, g = d / y;
  if (f += g, a) {
    o.push(i, t), o.push(e, s);
    for (let x = 1, A = f; x < y; x++, A += g)
      o.push(i, t), o.push(
        i + Math.sin(A) * m,
        t + Math.cos(A) * m
      );
    o.push(i, t), o.push(n, r);
  } else {
    o.push(e, s), o.push(i, t);
    for (let x = 1, A = f; x < y; x++, A += g)
      o.push(
        i + Math.sin(A) * m,
        t + Math.cos(A) * m
      ), o.push(i, t);
    o.push(n, r), o.push(i, t);
  }
  return y * 2;
}
function kr(i, t, e, s, n, r) {
  const o = Ws;
  if (i.length === 0)
    return;
  const a = t;
  let h = a.alignment;
  if (t.alignment !== 0.5) {
    let I = on(i);
    e && (I *= -1), h = (h - 0.5) * I + 0.5;
  }
  const c = new F(i[0], i[1]), l = new F(i[i.length - 2], i[i.length - 1]), u = s, f = Math.abs(c.x - l.x) < o && Math.abs(c.y - l.y) < o;
  if (u) {
    i = i.slice(), f && (i.pop(), i.pop(), l.set(i[i.length - 2], i[i.length - 1]));
    const I = (c.x + l.x) * 0.5, nt = (l.y + c.y) * 0.5;
    i.unshift(I, nt), i.push(I, nt);
  }
  const d = n, p = i.length / 2;
  let m = i.length;
  const y = d.length / 2, g = a.width / 2, x = g * g, A = a.miterLimit * a.miterLimit;
  let _ = i[0], M = i[1], v = i[2], b = i[3], C = 0, k = 0, w = -(M - b), P = _ - v, L = 0, B = 0, G = Math.sqrt(w * w + P * P);
  w /= G, P /= G, w *= g, P *= g;
  const Et = h, E = (1 - Et) * 2, T = Et * 2;
  u || (a.cap === "round" ? m += ut(
    _ - w * (E - T) * 0.5,
    M - P * (E - T) * 0.5,
    _ - w * E,
    M - P * E,
    _ + w * T,
    M + P * T,
    d,
    !0
  ) + 2 : a.cap === "square" && (m += es(_, M, w, P, E, T, !0, d))), d.push(
    _ - w * E,
    M - P * E
  ), d.push(
    _ + w * T,
    M + P * T
  );
  for (let I = 1; I < p - 1; ++I) {
    _ = i[(I - 1) * 2], M = i[(I - 1) * 2 + 1], v = i[I * 2], b = i[I * 2 + 1], C = i[(I + 1) * 2], k = i[(I + 1) * 2 + 1], w = -(M - b), P = _ - v, G = Math.sqrt(w * w + P * P), w /= G, P /= G, w *= g, P *= g, L = -(b - k), B = v - C, G = Math.sqrt(L * L + B * B), L /= G, B /= G, L *= g, B *= g;
    const nt = v - _, Tt = M - b, St = v - C, Ct = k - b, We = nt * St + Tt * Ct, Vt = Tt * St - Ct * nt, kt = Vt < 0;
    if (Math.abs(Vt) < 1e-3 * Math.abs(We)) {
      d.push(
        v - w * E,
        b - P * E
      ), d.push(
        v + w * T,
        b + P * T
      ), We >= 0 && (a.join === "round" ? m += ut(
        v,
        b,
        v - w * E,
        b - P * E,
        v - L * E,
        b - B * E,
        d,
        !1
      ) + 4 : m += 2, d.push(
        v - L * T,
        b - B * T
      ), d.push(
        v + L * E,
        b + B * E
      ));
      continue;
    }
    const Ve = (-w + _) * (-P + b) - (-w + v) * (-P + M), Ge = (-L + C) * (-B + b) - (-L + v) * (-B + k), Gt = (nt * Ge - St * Ve) / Vt, qt = (Ct * Ve - Tt * Ge) / Vt, me = (Gt - v) * (Gt - v) + (qt - b) * (qt - b), at = v + (Gt - v) * E, ht = b + (qt - b) * E, lt = v - (Gt - v) * T, ct = b - (qt - b) * T, ri = Math.min(nt * nt + Tt * Tt, St * St + Ct * Ct), qe = kt ? E : T, oi = ri + qe * qe * x;
    me <= oi ? a.join === "bevel" || me / x > A ? (kt ? (d.push(at, ht), d.push(v + w * T, b + P * T), d.push(at, ht), d.push(v + L * T, b + B * T)) : (d.push(v - w * E, b - P * E), d.push(lt, ct), d.push(v - L * E, b - B * E), d.push(lt, ct)), m += 2) : a.join === "round" ? kt ? (d.push(at, ht), d.push(v + w * T, b + P * T), m += ut(
      v,
      b,
      v + w * T,
      b + P * T,
      v + L * T,
      b + B * T,
      d,
      !0
    ) + 4, d.push(at, ht), d.push(v + L * T, b + B * T)) : (d.push(v - w * E, b - P * E), d.push(lt, ct), m += ut(
      v,
      b,
      v - w * E,
      b - P * E,
      v - L * E,
      b - B * E,
      d,
      !1
    ) + 4, d.push(v - L * E, b - B * E), d.push(lt, ct)) : (d.push(at, ht), d.push(lt, ct)) : (d.push(v - w * E, b - P * E), d.push(v + w * T, b + P * T), a.join === "round" ? kt ? m += ut(
      v,
      b,
      v + w * T,
      b + P * T,
      v + L * T,
      b + B * T,
      d,
      !0
    ) + 2 : m += ut(
      v,
      b,
      v - w * E,
      b - P * E,
      v - L * E,
      b - B * E,
      d,
      !1
    ) + 2 : a.join === "miter" && me / x <= A && (kt ? (d.push(lt, ct), d.push(lt, ct)) : (d.push(at, ht), d.push(at, ht)), m += 2), d.push(v - L * E, b - B * E), d.push(v + L * T, b + B * T), m += 2);
  }
  _ = i[(p - 2) * 2], M = i[(p - 2) * 2 + 1], v = i[(p - 1) * 2], b = i[(p - 1) * 2 + 1], w = -(M - b), P = _ - v, G = Math.sqrt(w * w + P * P), w /= G, P /= G, w *= g, P *= g, d.push(v - w * E, b - P * E), d.push(v + w * T, b + P * T), u || (a.cap === "round" ? m += ut(
    v - w * (E - T) * 0.5,
    b - P * (E - T) * 0.5,
    v - w * E,
    b - P * E,
    v + w * T,
    b + P * T,
    d,
    !1
  ) + 2 : a.cap === "square" && (m += es(v, b, w, P, E, T, !1, d)));
  const ni = ts * ts;
  for (let I = y; I < m + y - 2; ++I)
    _ = d[I * 2], M = d[I * 2 + 1], v = d[(I + 1) * 2], b = d[(I + 1) * 2 + 1], C = d[(I + 2) * 2], k = d[(I + 2) * 2 + 1], !(Math.abs(_ * (b - k) + v * (k - M) + C * (M - b)) < ni) && r.push(I, I + 1, I + 2);
}
function Ir(i, t, e, s) {
  const n = Ws;
  if (i.length === 0)
    return;
  const r = i[0], o = i[1], a = i[i.length - 2], h = i[i.length - 1], c = t || Math.abs(r - a) < n && Math.abs(o - h) < n, l = e, u = i.length / 2, f = l.length / 2;
  for (let d = 0; d < u; d++)
    l.push(i[d * 2]), l.push(i[d * 2 + 1]);
  for (let d = 0; d < u - 1; d++)
    s.push(f + d, f + d + 1);
  c && s.push(f + u - 1, f);
}
function ss(i, t, e = 2) {
  const s = t && t.length, n = s ? t[0] * e : i.length;
  let r = Vs(i, 0, n, e, !0);
  const o = [];
  if (!r || r.next === r.prev) return o;
  let a, h, c;
  if (s && (r = un(i, t, r, e)), i.length > 80 * e) {
    a = 1 / 0, h = 1 / 0;
    let l = -1 / 0, u = -1 / 0;
    for (let f = e; f < n; f += e) {
      const d = i[f], p = i[f + 1];
      d < a && (a = d), p < h && (h = p), d > l && (l = d), p > u && (u = p);
    }
    c = Math.max(l - a, u - h), c = c !== 0 ? 32767 / c : 0;
  }
  return Ht(r, o, e, a, h, c, 0), o;
}
function Vs(i, t, e, s, n) {
  let r;
  if (n === vn(i, t, e, s) > 0)
    for (let o = t; o < e; o += s) r = is(o / s | 0, i[o], i[o + 1], r);
  else
    for (let o = e - s; o >= t; o -= s) r = is(o / s | 0, i[o], i[o + 1], r);
  return r && Pt(r, r.next) && (Wt(r), r = r.next), r;
}
function gt(i, t) {
  if (!i) return i;
  t || (t = i);
  let e = i, s;
  do
    if (s = !1, !e.steiner && (Pt(e, e.next) || R(e.prev, e, e.next) === 0)) {
      if (Wt(e), e = t = e.prev, e === e.next) break;
      s = !0;
    } else
      e = e.next;
  while (s || e !== t);
  return t;
}
function Ht(i, t, e, s, n, r, o) {
  if (!i) return;
  !o && r && yn(i, s, n, r);
  let a = i;
  for (; i.prev !== i.next; ) {
    const h = i.prev, c = i.next;
    if (r ? hn(i, s, n, r) : an(i)) {
      t.push(h.i, i.i, c.i), Wt(i), i = c.next, a = c.next;
      continue;
    }
    if (i = c, i === a) {
      o ? o === 1 ? (i = ln(gt(i), t), Ht(i, t, e, s, n, r, 2)) : o === 2 && cn(i, t, e, s, n, r) : Ht(gt(i), t, e, s, n, r, 1);
      break;
    }
  }
}
function an(i) {
  const t = i.prev, e = i, s = i.next;
  if (R(t, e, s) >= 0) return !1;
  const n = t.x, r = e.x, o = s.x, a = t.y, h = e.y, c = s.y, l = Math.min(n, r, o), u = Math.min(a, h, c), f = Math.max(n, r, o), d = Math.max(a, h, c);
  let p = s.next;
  for (; p !== t; ) {
    if (p.x >= l && p.x <= f && p.y >= u && p.y <= d && Bt(n, a, r, h, o, c, p.x, p.y) && R(p.prev, p, p.next) >= 0) return !1;
    p = p.next;
  }
  return !0;
}
function hn(i, t, e, s) {
  const n = i.prev, r = i, o = i.next;
  if (R(n, r, o) >= 0) return !1;
  const a = n.x, h = r.x, c = o.x, l = n.y, u = r.y, f = o.y, d = Math.min(a, h, c), p = Math.min(l, u, f), m = Math.max(a, h, c), y = Math.max(l, u, f), g = Ie(d, p, t, e, s), x = Ie(m, y, t, e, s);
  let A = i.prevZ, _ = i.nextZ;
  for (; A && A.z >= g && _ && _.z <= x; ) {
    if (A.x >= d && A.x <= m && A.y >= p && A.y <= y && A !== n && A !== o && Bt(a, l, h, u, c, f, A.x, A.y) && R(A.prev, A, A.next) >= 0 || (A = A.prevZ, _.x >= d && _.x <= m && _.y >= p && _.y <= y && _ !== n && _ !== o && Bt(a, l, h, u, c, f, _.x, _.y) && R(_.prev, _, _.next) >= 0)) return !1;
    _ = _.nextZ;
  }
  for (; A && A.z >= g; ) {
    if (A.x >= d && A.x <= m && A.y >= p && A.y <= y && A !== n && A !== o && Bt(a, l, h, u, c, f, A.x, A.y) && R(A.prev, A, A.next) >= 0) return !1;
    A = A.prevZ;
  }
  for (; _ && _.z <= x; ) {
    if (_.x >= d && _.x <= m && _.y >= p && _.y <= y && _ !== n && _ !== o && Bt(a, l, h, u, c, f, _.x, _.y) && R(_.prev, _, _.next) >= 0) return !1;
    _ = _.nextZ;
  }
  return !0;
}
function ln(i, t) {
  let e = i;
  do {
    const s = e.prev, n = e.next.next;
    !Pt(s, n) && qs(s, e, e.next, n) && $t(s, n) && $t(n, s) && (t.push(s.i, e.i, n.i), Wt(e), Wt(e.next), e = i = n), e = e.next;
  } while (e !== i);
  return gt(e);
}
function cn(i, t, e, s, n, r) {
  let o = i;
  do {
    let a = o.next.next;
    for (; a !== o.prev; ) {
      if (o.i !== a.i && _n(o, a)) {
        let h = js(o, a);
        o = gt(o, o.next), h = gt(h, h.next), Ht(o, t, e, s, n, r, 0), Ht(h, t, e, s, n, r, 0);
        return;
      }
      a = a.next;
    }
    o = o.next;
  } while (o !== i);
}
function un(i, t, e, s) {
  const n = [];
  for (let r = 0, o = t.length; r < o; r++) {
    const a = t[r] * s, h = r < o - 1 ? t[r + 1] * s : i.length, c = Vs(i, a, h, s, !1);
    c === c.next && (c.steiner = !0), n.push(xn(c));
  }
  n.sort(dn);
  for (let r = 0; r < n.length; r++)
    e = fn(n[r], e);
  return e;
}
function dn(i, t) {
  let e = i.x - t.x;
  if (e === 0 && (e = i.y - t.y, e === 0)) {
    const s = (i.next.y - i.y) / (i.next.x - i.x), n = (t.next.y - t.y) / (t.next.x - t.x);
    e = s - n;
  }
  return e;
}
function fn(i, t) {
  const e = pn(i, t);
  if (!e)
    return t;
  const s = js(e, i);
  return gt(s, s.next), gt(e, e.next);
}
function pn(i, t) {
  let e = t;
  const s = i.x, n = i.y;
  let r = -1 / 0, o;
  if (Pt(i, e)) return e;
  do {
    if (Pt(i, e.next)) return e.next;
    if (n <= e.y && n >= e.next.y && e.next.y !== e.y) {
      const u = e.x + (n - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (u <= s && u > r && (r = u, o = e.x < e.next.x ? e : e.next, u === s))
        return o;
    }
    e = e.next;
  } while (e !== t);
  if (!o) return null;
  const a = o, h = o.x, c = o.y;
  let l = 1 / 0;
  e = o;
  do {
    if (s >= e.x && e.x >= h && s !== e.x && Gs(n < c ? s : r, n, h, c, n < c ? r : s, n, e.x, e.y)) {
      const u = Math.abs(n - e.y) / (s - e.x);
      $t(e, i) && (u < l || u === l && (e.x > o.x || e.x === o.x && mn(o, e))) && (o = e, l = u);
    }
    e = e.next;
  } while (e !== a);
  return o;
}
function mn(i, t) {
  return R(i.prev, i, t.prev) < 0 && R(t.next, i, i.next) < 0;
}
function yn(i, t, e, s) {
  let n = i;
  do
    n.z === 0 && (n.z = Ie(n.x, n.y, t, e, s)), n.prevZ = n.prev, n.nextZ = n.next, n = n.next;
  while (n !== i);
  n.prevZ.nextZ = null, n.prevZ = null, gn(n);
}
function gn(i) {
  let t, e = 1;
  do {
    let s = i, n;
    i = null;
    let r = null;
    for (t = 0; s; ) {
      t++;
      let o = s, a = 0;
      for (let c = 0; c < e && (a++, o = o.nextZ, !!o); c++)
        ;
      let h = e;
      for (; a > 0 || h > 0 && o; )
        a !== 0 && (h === 0 || !o || s.z <= o.z) ? (n = s, s = s.nextZ, a--) : (n = o, o = o.nextZ, h--), r ? r.nextZ = n : i = n, n.prevZ = r, r = n;
      s = o;
    }
    r.nextZ = null, e *= 2;
  } while (t > 1);
  return i;
}
function Ie(i, t, e, s, n) {
  return i = (i - e) * n | 0, t = (t - s) * n | 0, i = (i | i << 8) & 16711935, i = (i | i << 4) & 252645135, i = (i | i << 2) & 858993459, i = (i | i << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, i | t << 1;
}
function xn(i) {
  let t = i, e = i;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== i);
  return e;
}
function Gs(i, t, e, s, n, r, o, a) {
  return (n - o) * (t - a) >= (i - o) * (r - a) && (i - o) * (s - a) >= (e - o) * (t - a) && (e - o) * (r - a) >= (n - o) * (s - a);
}
function Bt(i, t, e, s, n, r, o, a) {
  return !(i === o && t === a) && Gs(i, t, e, s, n, r, o, a);
}
function _n(i, t) {
  return i.next.i !== t.i && i.prev.i !== t.i && !bn(i, t) && // doesn't intersect other edges
  ($t(i, t) && $t(t, i) && An(i, t) && // locally visible
  (R(i.prev, i, t.prev) || R(i, t.prev, t)) || // does not create opposite-facing sectors
  Pt(i, t) && R(i.prev, i, i.next) > 0 && R(t.prev, t, t.next) > 0);
}
function R(i, t, e) {
  return (t.y - i.y) * (e.x - t.x) - (t.x - i.x) * (e.y - t.y);
}
function Pt(i, t) {
  return i.x === t.x && i.y === t.y;
}
function qs(i, t, e, s) {
  const n = ee(R(i, t, e)), r = ee(R(i, t, s)), o = ee(R(e, s, i)), a = ee(R(e, s, t));
  return !!(n !== r && o !== a || n === 0 && te(i, e, t) || r === 0 && te(i, s, t) || o === 0 && te(e, i, s) || a === 0 && te(e, t, s));
}
function te(i, t, e) {
  return t.x <= Math.max(i.x, e.x) && t.x >= Math.min(i.x, e.x) && t.y <= Math.max(i.y, e.y) && t.y >= Math.min(i.y, e.y);
}
function ee(i) {
  return i > 0 ? 1 : i < 0 ? -1 : 0;
}
function bn(i, t) {
  let e = i;
  do {
    if (e.i !== i.i && e.next.i !== i.i && e.i !== t.i && e.next.i !== t.i && qs(e, e.next, i, t)) return !0;
    e = e.next;
  } while (e !== i);
  return !1;
}
function $t(i, t) {
  return R(i.prev, i, i.next) < 0 ? R(i, t, i.next) >= 0 && R(i, i.prev, t) >= 0 : R(i, t, i.prev) < 0 || R(i, i.next, t) < 0;
}
function An(i, t) {
  let e = i, s = !1;
  const n = (i.x + t.x) / 2, r = (i.y + t.y) / 2;
  do
    e.y > r != e.next.y > r && e.next.y !== e.y && n < (e.next.x - e.x) * (r - e.y) / (e.next.y - e.y) + e.x && (s = !s), e = e.next;
  while (e !== i);
  return s;
}
function js(i, t) {
  const e = Fe(i.i, i.x, i.y), s = Fe(t.i, t.x, t.y), n = i.next, r = t.prev;
  return i.next = t, t.prev = i, e.next = n, n.prev = e, s.next = e, e.prev = s, r.next = s, s.prev = r, s;
}
function is(i, t, e, s) {
  const n = Fe(i, t, e);
  return s ? (n.next = s.next, n.prev = s, s.next.prev = n, s.next = n) : (n.prev = n, n.next = n), n;
}
function Wt(i) {
  i.next.prev = i.prev, i.prev.next = i.next, i.prevZ && (i.prevZ.nextZ = i.nextZ), i.nextZ && (i.nextZ.prevZ = i.prevZ);
}
function Fe(i, t, e) {
  return {
    i,
    // vertex index in coordinates array
    x: t,
    y: e,
    // vertex coordinates
    prev: null,
    // previous and next vertex nodes in a polygon ring
    next: null,
    z: 0,
    // z-order curve value
    prevZ: null,
    // previous and next nodes in z-order
    nextZ: null,
    steiner: !1
    // indicates whether this is a steiner point
  };
}
function vn(i, t, e, s) {
  let n = 0;
  for (let r = t, o = e - s; r < e; r += s)
    n += (i[o] - i[r]) * (i[r + 1] + i[o + 1]), o = r;
  return n;
}
const wn = ss.default || ss;
function Pn(i, t, e, s, n, r, o) {
  const a = wn(i, t, 2);
  if (!a)
    return;
  for (let c = 0; c < a.length; c += 3)
    r[o++] = a[c] + n, r[o++] = a[c + 1] + n, r[o++] = a[c + 2] + n;
  let h = n * s;
  for (let c = 0; c < i.length; c += 2)
    e[h] = i[c], e[h + 1] = i[c + 1], h += s;
}
const Mn = [], Fr = {
  extension: {
    type: "ExtensionType.ShapeBuilder",
    name: "polygon"
  },
  build(i, t) {
    for (let e = 0; e < i.points.length; e++)
      t[e] = i.points[e];
    return !0;
  },
  triangulate(i, t, e, s, n, r) {
    Pn(i, Mn, t, e, s, n, r);
  }
}, Rr = {
  extension: {
    type: "ExtensionType.ShapeBuilder",
    name: "rectangle"
  },
  build(i, t) {
    const e = i, s = e.x, n = e.y, r = e.width, o = e.height;
    return r > 0 && o > 0 ? (t[0] = s, t[1] = n, t[2] = s + r, t[3] = n, t[4] = s + r, t[5] = n + o, t[6] = s, t[7] = n + o, !0) : !1;
  },
  triangulate(i, t, e, s, n, r) {
    let o = 0;
    s *= e, t[s + o] = i[0], t[s + o + 1] = i[1], o += e, t[s + o] = i[2], t[s + o + 1] = i[3], o += e, t[s + o] = i[6], t[s + o + 1] = i[7], o += e, t[s + o] = i[4], t[s + o + 1] = i[5], o += e;
    const a = s / e;
    n[r++] = a, n[r++] = a + 1, n[r++] = a + 2, n[r++] = a + 1, n[r++] = a + 3, n[r++] = a + 2;
  }
}, Lr = {
  extension: {
    type: "ExtensionType.ShapeBuilder",
    name: "triangle"
  },
  build(i, t) {
    return t[0] = i.x, t[1] = i.y, t[2] = i.x2, t[3] = i.y2, t[4] = i.x3, t[5] = i.y3, !0;
  },
  triangulate(i, t, e, s, n, r) {
    let o = 0;
    s *= e, t[s + o] = i[0], t[s + o + 1] = i[1], o += e, t[s + o] = i[2], t[s + o + 1] = i[3], o += e, t[s + o] = i[4], t[s + o + 1] = i[5];
    const a = s / e;
    n[r++] = a, n[r++] = a + 1, n[r++] = a + 2;
  }
}, Dt = {
  default: -1
};
function et(i = "default") {
  return Dt[i] === void 0 && (Dt[i] = -1), ++Dt[i];
}
function Br() {
  for (const i in Dt)
    delete Dt[i];
}
const ns = {}, z = "8.0.0";
function q(i, t, e = 3) {
  if (ns[t])
    return;
  let s = new Error().stack;
  typeof s > "u" ? console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${i}`) : (s = s.split(`
`).splice(e).join(`
`), console.groupCollapsed ? (console.groupCollapsed(
    "%cPixiJS Deprecation Warning: %c%s",
    "color:#614108;background:#fffbe6",
    "font-weight:normal;color:#614108;background:#fffbe6",
    `${t}
Deprecated since v${i}`
  ), console.warn(s), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${i}`), console.warn(s))), ns[t] = !0;
}
function zs(i) {
  const t = {};
  for (const e in i)
    i[e] !== void 0 && (t[e] = i[e]);
  return t;
}
const Zs = () => {
}, rs = /* @__PURE__ */ Object.create(null);
function En(i) {
  const t = rs[i];
  return t === void 0 && (rs[i] = et("resource")), t;
}
class fe extends Y {
  /** @internal */
  _resourceType = "textureSampler";
  /** @internal */
  _touched = 0;
  _sharedResourceId;
  /** default options for the style */
  static defaultOptions = {
    addressMode: "clamp-to-edge",
    scaleMode: "linear"
  };
  /** */
  addressModeU;
  /** */
  addressModeV;
  /** Specifies the {{GPUAddressMode|address modes}} for the texture width, height, and depth coordinates, respectively. */
  addressModeW;
  /** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
  magFilter;
  /** Specifies the sampling behavior when the sample footprint is larger than one texel. */
  minFilter;
  /** Specifies behavior for sampling between mipmap levels. */
  mipmapFilter;
  /** */
  lodMinClamp;
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  lodMaxClamp;
  /**
   * When provided the sampler will be a comparison sampler with the specified
   * {@link COMPARE_FUNCTION}.
   * Note: Comparison samplers may use filtering, but the sampling results will be
   * implementation-dependent and may differ from the normal filtering rules.
   */
  compare;
  /**
   * Specifies the maximum anisotropy value clamp used by the sampler.
   * Note: Most implementations support {@link TextureStyle#maxAnisotropy} values in range
   * between 1 and 16, inclusive. The used value of {@link TextureStyle#maxAnisotropy} will
   * be clamped to the maximum value that the platform supports.
   * @internal
   */
  _maxAnisotropy = 1;
  /**
   * Has the style been destroyed?
   * @readonly
   */
  destroyed = !1;
  /**
   * @param options - options for the style
   */
  constructor(t = {}) {
    super(), t = { ...fe.defaultOptions, ...t }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
  }
  set addressMode(t) {
    this.addressModeU = t, this.addressModeV = t, this.addressModeW = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(t) {
    q(z, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = t;
  }
  get wrapMode() {
    return this.addressMode;
  }
  set scaleMode(t) {
    this.magFilter = t, this.minFilter = t, this.mipmapFilter = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this.magFilter;
  }
  /** Specifies the maximum anisotropy value clamp used by the sampler. */
  set maxAnisotropy(t) {
    this._maxAnisotropy = Math.min(t, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear");
  }
  get maxAnisotropy() {
    return this._maxAnisotropy;
  }
  // TODO - move this to WebGL?
  get _resourceId() {
    return this._sharedResourceId || this._generateResourceId();
  }
  update() {
    this.emit("change", this), this._sharedResourceId = null;
  }
  _generateResourceId() {
    const t = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
    return this._sharedResourceId = En(t), this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
  }
}
class j extends Y {
  /**
   * @param options - options for creating a new TextureSource
   */
  constructor(t = {}) {
    super(), this.options = t, t = { ...j.defaultOptions, ...t }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new fe(zs(t)), this.destroyed = !1, this._refreshPOT();
  }
  /** The default options used when creating a new TextureSource. override these to add your own defaults */
  static defaultOptions = {
    resolution: 1,
    format: "bgra8unorm",
    alphaMode: "premultiply-alpha-on-upload",
    dimensions: "2d",
    mipLevelCount: 1,
    autoGenerateMipmaps: !1,
    sampleCount: 1,
    antialias: !1,
    autoGarbageCollect: !1
  };
  /** unique id for this Texture source */
  uid = et("textureSource");
  /** optional label, can be used for debugging */
  label;
  /**
   * The resource type used by this TextureSource. This is used by the bind groups to determine
   * how to handle this resource.
   * @internal
   */
  _resourceType = "textureSource";
  /**
   * i unique resource id, used by the bind group systems.
   * This can change if the texture is resized or its resource changes
   * @internal
   */
  _resourceId = et("resource");
  /**
   * this is how the backends know how to upload this texture to the GPU
   * It changes depending on the resource type. Classes that extend TextureSource
   * should override this property.
   * @internal
   */
  uploadMethodId = "unknown";
  /** @internal */
  _resolution = 1;
  /** the pixel width of this texture source. This is the REAL pure number, not accounting resolution */
  pixelWidth = 1;
  /** the pixel height of this texture source. This is the REAL pure number, not accounting resolution */
  pixelHeight = 1;
  /**
   * the width of this texture source, accounting for resolution
   * eg pixelWidth 200, resolution 2, then width will be 100
   */
  width = 1;
  /**
   * the height of this texture source, accounting for resolution
   * eg pixelHeight 200, resolution 2, then height will be 100
   */
  height = 1;
  /**
   * the resource that will be uploaded to the GPU. This is where we get our pixels from
   * eg an ImageBimt / Canvas / Video etc
   */
  resource;
  /**
   * The number of samples of a multisample texture. This is always 1 for non-multisample textures.
   * To enable multisample for a texture, set antialias to true
   * @internal
   */
  sampleCount = 1;
  /** The number of mip levels to generate for this texture. this is  overridden if autoGenerateMipmaps is true */
  mipLevelCount = 1;
  /**
   * Should we auto generate mipmaps for this texture? This will automatically generate mipmaps
   * for this texture when uploading to the GPU. Mipmapped textures take up more memory, but
   * can look better when scaled down.
   *
   * For performance reasons, it is recommended to NOT use this with RenderTextures, as they are often updated every frame.
   * If you do, make sure to call `updateMipmaps` after you update the texture.
   */
  autoGenerateMipmaps = !1;
  /** the format that the texture data has */
  format = "rgba8unorm";
  /** how many dimensions does this texture have? currently v8 only supports 2d */
  dimension = "2d";
  /** the alpha mode of the texture */
  alphaMode;
  _style;
  /**
   * Only really affects RenderTextures.
   * Should we use antialiasing for this texture. It will look better, but may impact performance as a
   * Blit operation will be required to resolve the texture.
   */
  antialias = !1;
  /**
   * Has the source been destroyed?
   * @readonly
   */
  destroyed;
  /**
   * Used by automatic texture Garbage Collection, stores last GC tick when it was bound
   * @protected
   */
  _touched = 0;
  /**
   * Used by the batcher to build texture batches. faster to have the variable here!
   * @protected
   */
  _batchTick = -1;
  /**
   * A temporary batch location for the texture batching. Here for performance reasons only!
   * @protected
   */
  _textureBindLocation = -1;
  isPowerOfTwo;
  /** If true, the Garbage Collector will unload this texture if it is not used after a period of time */
  autoGarbageCollect;
  /**
   * used internally to know where a texture came from. Usually assigned by the asset loader!
   * @ignore
   */
  _sourceOrigin;
  /** returns itself */
  get source() {
    return this;
  }
  /** the style of the texture */
  get style() {
    return this._style;
  }
  set style(t) {
    this.style !== t && (this._style?.off("change", this._onStyleChange, this), this._style = t, this._style?.on("change", this._onStyleChange, this), this._onStyleChange());
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this._style.addressMode;
  }
  set addressMode(t) {
    this._style.addressMode = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get repeatMode() {
    return this._style.addressMode;
  }
  set repeatMode(t) {
    this._style.addressMode = t;
  }
  /** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
  get magFilter() {
    return this._style.magFilter;
  }
  set magFilter(t) {
    this._style.magFilter = t;
  }
  /** Specifies the sampling behavior when the sample footprint is larger than one texel. */
  get minFilter() {
    return this._style.minFilter;
  }
  set minFilter(t) {
    this._style.minFilter = t;
  }
  /** Specifies behavior for sampling between mipmap levels. */
  get mipmapFilter() {
    return this._style.mipmapFilter;
  }
  set mipmapFilter(t) {
    this._style.mipmapFilter = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMinClamp() {
    return this._style.lodMinClamp;
  }
  set lodMinClamp(t) {
    this._style.lodMinClamp = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMaxClamp() {
    return this._style.lodMaxClamp;
  }
  set lodMaxClamp(t) {
    this._style.lodMaxClamp = t;
  }
  _onStyleChange() {
    this.emit("styleChange", this);
  }
  /** call this if you have modified the texture outside of the constructor */
  update() {
    if (this.resource) {
      const t = this._resolution;
      if (this.resize(this.resourceWidth / t, this.resourceHeight / t)) return;
    }
    this.emit("update", this);
  }
  /** Destroys this texture source */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this._style && (this._style.destroy(), this._style = null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners();
  }
  /**
   * This will unload the Texture source from the GPU. This will free up the GPU memory
   * As soon as it is required fore rendering, it will be re-uploaded.
   */
  unload() {
    this._resourceId = et("resource"), this.emit("change", this), this.emit("unload", this);
  }
  /** the width of the resource. This is the REAL pure number, not accounting resolution   */
  get resourceWidth() {
    const { resource: t } = this;
    return t.naturalWidth || t.videoWidth || t.displayWidth || t.width;
  }
  /** the height of the resource. This is the REAL pure number, not accounting resolution */
  get resourceHeight() {
    const { resource: t } = this;
    return t.naturalHeight || t.videoHeight || t.displayHeight || t.height;
  }
  /**
   * the resolution of the texture. Changing this number, will not change the number of pixels in the actual texture
   * but will the size of the texture when rendered.
   *
   * changing the resolution of this texture to 2 for example will make it appear twice as small when rendered (as pixel
   * density will have increased)
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._resolution !== t && (this._resolution = t, this.width = this.pixelWidth / t, this.height = this.pixelHeight / t);
  }
  /**
   * Resize the texture, this is handy if you want to use the texture as a render texture
   * @param width - the new width of the texture
   * @param height - the new height of the texture
   * @param resolution - the new resolution of the texture
   * @returns - if the texture was resized
   */
  resize(t, e, s) {
    s ||= this._resolution, t ||= this.width, e ||= this.height;
    const n = Math.round(t * s), r = Math.round(e * s);
    return this.width = n / s, this.height = r / s, this._resolution = s, this.pixelWidth === n && this.pixelHeight === r ? !1 : (this._refreshPOT(), this.pixelWidth = n, this.pixelHeight = r, this.emit("resize", this), this._resourceId = et("resource"), this.emit("change", this), !0);
  }
  /**
   * Lets the renderer know that this texture has been updated and its mipmaps should be re-generated.
   * This is only important for RenderTexture instances, as standard Texture instances will have their
   * mipmaps generated on upload. You should call this method after you make any change to the texture
   *
   * The reason for this is is can be quite expensive to update mipmaps for a texture. So by default,
   * We want you, the developer to specify when this action should happen.
   *
   * Generally you don't want to have mipmaps generated on Render targets that are changed every frame,
   */
  updateMipmaps() {
    this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this);
  }
  set wrapMode(t) {
    this._style.wrapMode = t;
  }
  get wrapMode() {
    return this._style.wrapMode;
  }
  set scaleMode(t) {
    this._style.scaleMode = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this._style.scaleMode;
  }
  /**
   * Refresh check for isPowerOfTwo texture based on size
   * @private
   */
  _refreshPOT() {
    this.isPowerOfTwo = Qe(this.pixelWidth) && Qe(this.pixelHeight);
  }
  static test(t) {
    throw new Error("Unimplemented");
  }
  /**
   * A helper function that creates a new TextureSource based on the resource you provide.
   * @param resource - The resource to create the texture source from.
   */
  static from;
}
class Tn extends j {
  static extension = "ExtensionType.TextureSource";
  uploadMethodId = "buffer";
  constructor(t) {
    const e = t.resource || new Float32Array(t.width * t.height * 4);
    let s = t.format;
    s || (e instanceof Float32Array ? s = "rgba32float" : e instanceof Int32Array || e instanceof Uint32Array ? s = "rgba32uint" : e instanceof Int16Array || e instanceof Uint16Array ? s = "rgba16uint" : (e instanceof Int8Array, s = "bgra8unorm")), super({
      ...t,
      resource: e,
      format: s
    });
  }
  static test(t) {
    return t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array;
  }
}
const os = new N();
class Sn {
  /**
   * Matrix operation that converts texture region coords to texture coords
   * @readonly
   */
  mapCoord;
  /**
   * Changes frame clamping
   * Works with TilingSprite and Mesh
   * Change to 1.5 if you texture has repeated right and bottom lines, that leads to smoother borders
   * @default 0
   */
  clampOffset;
  /**
   * Changes frame clamping
   * Works with TilingSprite and Mesh
   * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
   * @default 0.5
   */
  clampMargin;
  /**
   * Clamp region for normalized coords, left-top pixel center in xy , bottom-right in zw.
   * Calculated based on clampOffset.
   */
  uClampFrame;
  /** Normalized clamp offset. Calculated based on clampOffset. */
  uClampOffset;
  /**
   * Tracks Texture frame changes.
   * @ignore
   */
  _updateID;
  /**
   * Tracks Texture frame changes.
   * @protected
   */
  _textureID;
  _texture;
  /**
   * If texture size is the same as baseTexture.
   * @default false
   * @readonly
   */
  isSimple;
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(t, e) {
    this.mapCoord = new N(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, typeof e > "u" ? this.clampMargin = t.width < 10 ? 0 : 0.5 : this.clampMargin = e, this.isSimple = !1, this.texture = t;
  }
  /** Texture property. */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    this.texture !== t && (this._texture?.removeListener("update", this.update, this), this._texture = t, this._texture.addListener("update", this.update, this), this.update());
  }
  /**
   * Multiplies uvs array to transform
   * @param uvs - mesh uvs
   * @param [out=uvs] - output
   * @returns - output
   */
  multiplyUvs(t, e) {
    e === void 0 && (e = t);
    const s = this.mapCoord;
    for (let n = 0; n < t.length; n += 2) {
      const r = t[n], o = t[n + 1];
      e[n] = r * s.a + o * s.c + s.tx, e[n + 1] = r * s.b + o * s.d + s.ty;
    }
    return e;
  }
  /**
   * Updates matrices if texture was changed
   * @returns - whether or not it was updated
   */
  update() {
    const t = this._texture;
    this._updateID++;
    const e = t.uvs;
    this.mapCoord.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0);
    const s = t.orig, n = t.trim;
    n && (os.set(
      s.width / n.width,
      0,
      0,
      s.height / n.height,
      -n.x / n.width,
      -n.y / n.height
    ), this.mapCoord.append(os));
    const r = t.source, o = this.uClampFrame, a = this.clampMargin / r._resolution, h = this.clampOffset / r._resolution;
    return o[0] = (t.frame.x + a + h) / r.width, o[1] = (t.frame.y + a + h) / r.height, o[2] = (t.frame.x + t.frame.width - a + h) / r.width, o[3] = (t.frame.y + t.frame.height - a + h) / r.height, this.uClampOffset[0] = this.clampOffset / r.pixelWidth, this.uClampOffset[1] = this.clampOffset / r.pixelHeight, this.isSimple = t.frame.width === r.width && t.frame.height === r.height && t.rotate === 0, !0;
  }
}
class O extends Y {
  /**
   * Helper function that creates a returns Texture based on the source you provide.
   * The source should be loaded and ready to go. If not its best to grab the asset using Assets.
   * @param id - String or Source to create texture from
   * @param skipCache - Skip adding the texture to the cache
   * @returns The texture based on the Id provided
   */
  static from;
  /** label used for debugging */
  label;
  /** unique id for this texture */
  uid = et("texture");
  /**
   * Has the texture been destroyed?
   * @readonly
   */
  destroyed;
  /** @internal */
  _source;
  /**
   * Indicates whether the texture is rotated inside the atlas
   * set to 2 to compensate for texture packer rotation
   * set to 6 to compensate for spine packer rotation
   * can be used to rotate or mirror sprites
   * See {@link groupD8} for explanation
   */
  rotate;
  /** A uvs object based on the given frame and the texture source */
  uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
  /**
   * Anchor point that is used as default if sprite is created with this texture.
   * Changing the `defaultAnchor` at a later point of time will not update Sprite's anchor point.
   * @default {0,0}
   */
  defaultAnchor;
  /**
   * Default width of the non-scalable border that is used if 9-slice plane is created with this texture.
   * @since 7.2.0
   * @see NineSliceSprite
   */
  defaultBorders;
  /**
   * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,
   * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)
   */
  frame = new H();
  /** This is the area of original texture, before it was put in atlas. */
  orig;
  /**
   * This is the trimmed area of original texture, before it was put in atlas
   * Please call `updateUvs()` after you change coordinates of `trim` manually.
   */
  trim;
  /**
   * Does this Texture have any frame data assigned to it?
   *
   * This mode is enabled automatically if no frame was passed inside constructor.
   *
   * In this mode texture is subscribed to baseTexture events, and fires `update` on any change.
   *
   * Beware, after loading or resize of baseTexture event can fired two times!
   * If you want more control, subscribe on baseTexture itself.
   * @example
   * texture.on('update', () => {});
   */
  noFrame = !1;
  /**
   * Set to true if you plan on modifying the uvs of this texture.
   * When this is the case, sprites and other objects using the texture will
   * make sure to listen for changes to the uvs and update their vertices accordingly.
   */
  dynamic = !1;
  _textureMatrix;
  /** is it a texture? yes! used for type checking */
  isTexture = !0;
  /**
   * @param {TextureOptions} options - Options for the texture
   */
  constructor({
    source: t,
    label: e,
    frame: s,
    orig: n,
    trim: r,
    defaultAnchor: o,
    defaultBorders: a,
    rotate: h,
    dynamic: c
  } = {}) {
    if (super(), this.label = e, this.source = t?.source ?? new j(), this.noFrame = !s, s)
      this.frame.copyFrom(s);
    else {
      const { width: l, height: u } = this._source;
      this.frame.width = l, this.frame.height = u;
    }
    this.orig = n || this.frame, this.trim = r, this.rotate = h ?? 0, this.defaultAnchor = o, this.defaultBorders = a, this.destroyed = !1, this.dynamic = c || !1, this.updateUvs();
  }
  set source(t) {
    this._source && this._source.off("resize", this.update, this), this._source = t, t.on("resize", this.update, this), this.emit("update", this);
  }
  /** the underlying source of the texture (equivalent of baseTexture in v7) */
  get source() {
    return this._source;
  }
  /** returns a TextureMatrix instance for this texture. By default, that object is not created because its heavy. */
  get textureMatrix() {
    return this._textureMatrix || (this._textureMatrix = new Sn(this)), this._textureMatrix;
  }
  /** The width of the Texture in pixels. */
  get width() {
    return this.orig.width;
  }
  /** The height of the Texture in pixels. */
  get height() {
    return this.orig.height;
  }
  /** Call this function when you have modified the frame of this texture. */
  updateUvs() {
    const { uvs: t, frame: e } = this, { width: s, height: n } = this._source, r = e.x / s, o = e.y / n, a = e.width / s, h = e.height / n;
    let c = this.rotate;
    if (c) {
      const l = a / 2, u = h / 2, f = r + l, d = o + u;
      c = S.add(c, S.NW), t.x0 = f + l * S.uX(c), t.y0 = d + u * S.uY(c), c = S.add(c, 2), t.x1 = f + l * S.uX(c), t.y1 = d + u * S.uY(c), c = S.add(c, 2), t.x2 = f + l * S.uX(c), t.y2 = d + u * S.uY(c), c = S.add(c, 2), t.x3 = f + l * S.uX(c), t.y3 = d + u * S.uY(c);
    } else
      t.x0 = r, t.y0 = o, t.x1 = r + a, t.y1 = o, t.x2 = r + a, t.y2 = o + h, t.x3 = r, t.y3 = o + h;
  }
  /**
   * Destroys this texture
   * @param destroySource - Destroy the source when the texture is destroyed.
   */
  destroy(t = !1) {
    this._source && t && (this._source.destroy(), this._source = null), this._textureMatrix = null, this.destroyed = !0, this.emit("destroy", this), this.removeAllListeners();
  }
  /**
   * Call this if you have modified the `texture outside` of the constructor.
   *
   * If you have modified this texture's source, you must separately call `texture.source.update()` to see those changes.
   */
  update() {
    this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this);
  }
  /** @deprecated since 8.0.0 */
  get baseTexture() {
    return q(z, "Texture.baseTexture is now Texture.source"), this._source;
  }
  /** an Empty Texture used internally by the engine */
  static EMPTY;
  /** a White texture used internally by the engine */
  static WHITE;
}
O.EMPTY = new O({
  label: "EMPTY",
  source: new j({
    label: "EMPTY"
  })
});
O.EMPTY.destroy = Zs;
O.WHITE = new O({
  source: new Tn({
    resource: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    alphaMode: "premultiply-alpha-on-upload",
    label: "WHITE"
  }),
  label: "WHITE"
});
O.WHITE.destroy = Zs;
class as extends j {
  static extension = "ExtensionType.TextureSource";
  uploadMethodId = "image";
  constructor(t) {
    super(t), this.autoGarbageCollect = !0;
  }
  static test(t) {
    return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame;
  }
}
const hs = [{ offset: 0, color: "white" }, { offset: 1, color: "black" }];
class ot {
  /** Default options for creating a gradient fill */
  static defaultLinearOptions = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    colorStops: [],
    textureSpace: "local",
    type: "linear",
    textureSize: 256,
    wrapMode: "clamp-to-edge"
  };
  /** Default options for creating a radial gradient fill */
  static defaultRadialOptions = {
    center: { x: 0.5, y: 0.5 },
    innerRadius: 0,
    outerRadius: 0.5,
    colorStops: [],
    scale: 1,
    textureSpace: "local",
    type: "radial",
    textureSize: 256,
    wrapMode: "clamp-to-edge"
  };
  /**
   * Unique identifier for this gradient instance
   * @internal
   */
  uid = et("fillGradient");
  /** Type of gradient - currently only supports 'linear' */
  type = "linear";
  /** Internal texture used to render the gradient */
  texture;
  /** Transform matrix for positioning the gradient */
  transform;
  /** Array of color stops defining the gradient */
  colorStops = [];
  /** Whether gradient coordinates are in local or global space */
  textureSpace;
  _textureSize;
  /** The start point of the linear gradient */
  start;
  /** The end point of the linear gradient */
  end;
  /** The wrap mode of the gradient texture */
  _wrapMode;
  /** The center point of the inner circle of the radial gradient */
  center;
  /** The center point of the outer circle of the radial gradient */
  outerCenter;
  /** The radius of the inner circle of the radial gradient */
  innerRadius;
  /** The radius of the outer circle of the radial gradient */
  outerRadius;
  /** The scale of the radial gradient */
  scale;
  /** The rotation of the radial gradient */
  rotation;
  constructor(...t) {
    let e = Cn(t);
    e = { ...e.type === "radial" ? ot.defaultRadialOptions : ot.defaultLinearOptions, ...zs(e) }, this._textureSize = e.textureSize, this._wrapMode = e.wrapMode, e.type === "radial" ? (this.center = e.center, this.outerCenter = e.outerCenter ?? this.center, this.innerRadius = e.innerRadius, this.outerRadius = e.outerRadius, this.scale = e.scale, this.rotation = e.rotation) : (this.start = e.start, this.end = e.end), this.textureSpace = e.textureSpace, this.type = e.type, e.colorStops.forEach((n) => {
      this.addColorStop(n.offset, n.color);
    });
  }
  /**
   * Adds a color stop to the gradient
   * @param offset - Position of the stop (0-1)
   * @param color - Color of the stop
   * @returns This gradient instance for chaining
   */
  addColorStop(t, e) {
    return this.colorStops.push({ offset: t, color: W.shared.setValue(e).toHexa() }), this;
  }
  /**
   * Builds the internal texture and transform for the gradient.
   * Called automatically when the gradient is first used.
   * @internal
   */
  buildLinearGradient() {
    if (this.texture) return;
    let { x: t, y: e } = this.start, { x: s, y: n } = this.end, r = s - t, o = n - e;
    const a = r < 0 || o < 0;
    if (this._wrapMode === "clamp-to-edge") {
      if (r < 0) {
        const y = t;
        t = s, s = y, r *= -1;
      }
      if (o < 0) {
        const y = e;
        e = n, n = y, o *= -1;
      }
    }
    const h = this.colorStops.length ? this.colorStops : hs, c = this._textureSize, { canvas: l, context: u } = cs(c, 1), f = a ? u.createLinearGradient(this._textureSize, 0, 0, 0) : u.createLinearGradient(0, 0, this._textureSize, 0);
    ls(f, h), u.fillStyle = f, u.fillRect(0, 0, c, 1), this.texture = new O({
      source: new as({
        resource: l,
        addressMode: this._wrapMode
      })
    });
    const d = Math.sqrt(r * r + o * o), p = Math.atan2(o, r), m = new N();
    m.scale(d / c, 1), m.rotate(p), m.translate(t, e), this.textureSpace === "local" && m.scale(c, c), this.transform = m;
  }
  /**
   * Builds the internal texture and transform for the gradient.
   * Called automatically when the gradient is first used.
   * @internal
   */
  buildGradient() {
    this.type === "linear" ? this.buildLinearGradient() : this.buildRadialGradient();
  }
  /**
   * Builds the internal texture and transform for the radial gradient.
   * Called automatically when the gradient is first used.
   * @internal
   */
  buildRadialGradient() {
    if (this.texture) return;
    const t = this.colorStops.length ? this.colorStops : hs, e = this._textureSize, { canvas: s, context: n } = cs(e, e), { x: r, y: o } = this.center, { x: a, y: h } = this.outerCenter, c = this.innerRadius, l = this.outerRadius, u = a - l, f = h - l, d = e / (l * 2), p = (r - u) * d, m = (o - f) * d, y = n.createRadialGradient(
      p,
      m,
      c * d,
      (a - u) * d,
      (h - f) * d,
      l * d
    );
    ls(y, t), n.fillStyle = t[t.length - 1].color, n.fillRect(0, 0, e, e), n.fillStyle = y, n.translate(p, m), n.rotate(this.rotation), n.scale(1, this.scale), n.translate(-p, -m), n.fillRect(0, 0, e, e), this.texture = new O({
      source: new as({
        resource: s,
        addressMode: this._wrapMode
      })
    });
    const g = new N();
    g.scale(1 / d, 1 / d), g.translate(u, f), this.textureSpace === "local" && g.scale(e, e), this.transform = g;
  }
  /**
   * Gets a unique key representing the current state of the gradient.
   * Used internally for caching.
   * @returns Unique string key
   */
  get styleKey() {
    return this.uid;
  }
  destroy() {
    this.texture?.destroy(!0), this.texture = null;
  }
}
function ls(i, t) {
  for (let e = 0; e < t.length; e++) {
    const s = t[e];
    i.addColorStop(s.offset, s.color);
  }
}
function cs(i, t) {
  const e = J.get().createCanvas(i, t), s = e.getContext("2d");
  return { canvas: e, context: s };
}
function Cn(i) {
  let t = i[0] ?? {};
  return (typeof t == "number" || i[1]) && (q("8.5.2", "use options object instead"), t = {
    type: "linear",
    start: { x: i[0], y: i[1] },
    end: { x: i[2], y: i[3] },
    textureSpace: i[4],
    textureSize: i[5] ?? ot.defaultLinearOptions.textureSize
  }), t;
}
const us = {
  repeat: {
    addressModeU: "repeat",
    addressModeV: "repeat"
  },
  "repeat-x": {
    addressModeU: "repeat",
    addressModeV: "clamp-to-edge"
  },
  "repeat-y": {
    addressModeU: "clamp-to-edge",
    addressModeV: "repeat"
  },
  "no-repeat": {
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge"
  }
};
class kn {
  /**
   * unique id for this fill pattern
   * @internal
   */
  uid = et("fillPattern");
  /** Internal texture used to render the gradient */
  texture;
  /** The transform matrix applied to the pattern */
  transform = new N();
  _styleKey = null;
  constructor(t, e) {
    this.texture = t, this.transform.scale(
      1 / t.frame.width,
      1 / t.frame.height
    ), e && (t.source.style.addressModeU = us[e].addressModeU, t.source.style.addressModeV = us[e].addressModeV);
  }
  /**
   * Sets the transform for the pattern
   * @param transform - The transform matrix to apply to the pattern.
   * If not provided, the pattern will use the default transform.
   */
  setTransform(t) {
    const e = this.texture;
    this.transform.copyFrom(t), this.transform.invert(), this.transform.scale(
      1 / e.frame.width,
      1 / e.frame.height
    ), this._styleKey = null;
  }
  /**
   * Gets a unique key representing the current state of the pattern.
   * Used internally for caching.
   * @returns Unique string key
   */
  get styleKey() {
    return this._styleKey ? this._styleKey : (this._styleKey = `fill-pattern-${this.uid}-${this.texture.uid}-${this.transform.toArray().join("-")}`, this._styleKey);
  }
}
let ve = 0;
const ds = 500;
function vt(...i) {
  ve !== ds && (ve++, ve === ds ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...i));
}
const we = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, In = /([astvzqmhlc])([^astvzqmhlc]*)/ig, Fn = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function Rn(i) {
  const t = [];
  return i.replace(In, function(e, s, n) {
    let r = s.toLowerCase(), o = Ln(n);
    for (r == "m" && o.length > 2 && (t.push([s].concat(o.splice(0, 2))), r = "l", s = s == "m" ? "l" : "L"); ; ) {
      if (o.length == we[r])
        return o.unshift(s), t.push(o);
      if (o.length < we[r]) throw new Error("malformed path data");
      t.push([s].concat(o.splice(0, we[r])));
    }
  }), t;
}
function Ln(i) {
  var t = i.match(Fn);
  return t ? t.map(Number) : [];
}
function Bn(i, t) {
  const e = Rn(i), s = [];
  let n = null, r = 0, o = 0;
  for (let a = 0; a < e.length; a++) {
    const h = e[a], c = h[0], l = h;
    switch (c) {
      case "M":
        r = l[1], o = l[2], t.moveTo(r, o);
        break;
      case "m":
        r += l[1], o += l[2], t.moveTo(r, o);
        break;
      case "H":
        r = l[1], t.lineTo(r, o);
        break;
      case "h":
        r += l[1], t.lineTo(r, o);
        break;
      case "V":
        o = l[1], t.lineTo(r, o);
        break;
      case "v":
        o += l[1], t.lineTo(r, o);
        break;
      case "L":
        r = l[1], o = l[2], t.lineTo(r, o);
        break;
      case "l":
        r += l[1], o += l[2], t.lineTo(r, o);
        break;
      case "C":
        r = l[5], o = l[6], t.bezierCurveTo(
          l[1],
          l[2],
          // First control point
          l[3],
          l[4],
          // Second control point
          r,
          o
          // End point
        );
        break;
      case "c":
        t.bezierCurveTo(
          r + l[1],
          o + l[2],
          // First control point
          r + l[3],
          o + l[4],
          // Second control point
          r + l[5],
          o + l[6]
          // End point
        ), r += l[5], o += l[6];
        break;
      case "S":
        r = l[3], o = l[4], t.bezierCurveToShort(
          l[1],
          l[2],
          // Control point
          r,
          o
          // End point
        );
        break;
      case "s":
        t.bezierCurveToShort(
          r + l[1],
          o + l[2],
          // Control point
          r + l[3],
          o + l[4]
          // End point
        ), r += l[3], o += l[4];
        break;
      case "Q":
        r = l[3], o = l[4], t.quadraticCurveTo(
          l[1],
          l[2],
          // Control point
          r,
          o
          // End point
        );
        break;
      case "q":
        t.quadraticCurveTo(
          r + l[1],
          o + l[2],
          // Control point
          r + l[3],
          o + l[4]
          // End point
        ), r += l[3], o += l[4];
        break;
      case "T":
        r = l[1], o = l[2], t.quadraticCurveToShort(
          r,
          o
          // End point
        );
        break;
      case "t":
        r += l[1], o += l[2], t.quadraticCurveToShort(
          r,
          o
          // End point
        );
        break;
      case "A":
        r = l[6], o = l[7], t.arcToSvg(
          l[1],
          // rx
          l[2],
          // ry
          l[3],
          // x-axis-rotation
          l[4],
          // large-arc-flag
          l[5],
          // sweep-flag
          r,
          o
          // End point
        );
        break;
      case "a":
        r += l[6], o += l[7], t.arcToSvg(
          l[1],
          // rx
          l[2],
          // ry
          l[3],
          // x-axis-rotation
          l[4],
          // large-arc-flag
          l[5],
          // sweep-flag
          r,
          o
          // End point
        );
        break;
      case "Z":
      // Close Path
      case "z":
        t.closePath(), s.length > 0 && (n = s.pop(), n ? (r = n.startX, o = n.startY) : (r = 0, o = 0)), n = null;
        break;
    }
    c !== "Z" && c !== "z" && n === null && (n = { startX: r, startY: o }, s.push(n));
  }
  return t;
}
const fs = new N();
class pe {
  /**
   * The minimum X coordinate of the bounds.
   * Represents the leftmost edge of the bounding box.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * // Set left edge
   * bounds.minX = 100;
   * ```
   * @default Infinity
   */
  minX = 1 / 0;
  /**
   * The minimum Y coordinate of the bounds.
   * Represents the topmost edge of the bounding box.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * // Set top edge
   * bounds.minY = 100;
   * ```
   * @default Infinity
   */
  minY = 1 / 0;
  /**
   * The maximum X coordinate of the bounds.
   * Represents the rightmost edge of the bounding box.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * // Set right edge
   * bounds.maxX = 200;
   * // Get width
   * const width = bounds.maxX - bounds.minX;
   * ```
   * @default -Infinity
   */
  maxX = -1 / 0;
  /**
   * The maximum Y coordinate of the bounds.
   * Represents the bottommost edge of the bounding box.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * // Set bottom edge
   * bounds.maxY = 200;
   * // Get height
   * const height = bounds.maxY - bounds.minY;
   * ```
   * @default -Infinity
   */
  maxY = -1 / 0;
  /**
   * The transformation matrix applied to this bounds object.
   * Used when calculating bounds with transforms.
   * @example
   * ```ts
   * const bounds = new Bounds();
   *
   * // Apply translation matrix
   * bounds.matrix = new Matrix()
   *     .translate(100, 100);
   *
   * // Combine transformations
   * bounds.matrix = new Matrix()
   *     .translate(50, 50)
   *     .rotate(Math.PI / 4)
   *     .scale(2, 2);
   *
   * // Use in bounds calculations
   * bounds.addFrame(0, 0, 100, 100); // Uses current matrix
   * bounds.addFrame(0, 0, 100, 100, customMatrix); // Override matrix
   * ```
   * @advanced
   */
  matrix = fs;
  _rectangle;
  /**
   * Creates a new Bounds object.
   * @param minX - The minimum X coordinate of the bounds.
   * @param minY - The minimum Y coordinate of the bounds.
   * @param maxX - The maximum X coordinate of the bounds.
   * @param maxY - The maximum Y coordinate of the bounds.
   */
  constructor(t = 1 / 0, e = 1 / 0, s = -1 / 0, n = -1 / 0) {
    this.minX = t, this.minY = e, this.maxX = s, this.maxY = n;
  }
  /**
   * Checks if bounds are empty, meaning either width or height is zero or negative.
   * Empty bounds occur when min values exceed max values on either axis.
   * @example
   * ```ts
   * const bounds = new Bounds();
   *
   * // Check if newly created bounds are empty
   * console.log(bounds.isEmpty()); // true, default bounds are empty
   *
   * // Add frame and check again
   * bounds.addFrame(0, 0, 100, 100);
   * console.log(bounds.isEmpty()); // false, bounds now have area
   *
   * // Clear bounds
   * bounds.clear();
   * console.log(bounds.isEmpty()); // true, bounds are empty again
   * ```
   * @returns True if bounds are empty (have no area)
   * @see {@link Bounds#clear} For resetting bounds
   * @see {@link Bounds#isValid} For checking validity
   */
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  /**
   * The bounding rectangle representation of these bounds.
   * Lazily creates and updates a Rectangle instance based on the current bounds.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Get rectangle representation
   * const rect = bounds.rectangle;
   * console.log(rect.x, rect.y, rect.width, rect.height);
   *
   * // Use for hit testing
   * if (bounds.rectangle.contains(mouseX, mouseY)) {
   *     console.log('Mouse is inside bounds!');
   * }
   * ```
   * @see {@link Rectangle} For rectangle methods
   * @see {@link Bounds.isEmpty} For bounds validation
   */
  get rectangle() {
    this._rectangle || (this._rectangle = new H());
    const t = this._rectangle;
    return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
  }
  /**
   * Clears the bounds and resets all coordinates to their default values.
   * Resets the transformation matrix back to identity.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * console.log(bounds.isEmpty()); // false
   * // Clear the bounds
   * bounds.clear();
   * console.log(bounds.isEmpty()); // true
   * ```
   * @returns This bounds object for chaining
   */
  clear() {
    return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = fs, this;
  }
  /**
   * Sets the bounds directly using coordinate values.
   * Provides a way to set all bounds values at once.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * bounds.set(0, 0, 100, 100);
   * ```
   * @param x0 - Left X coordinate of frame
   * @param y0 - Top Y coordinate of frame
   * @param x1 - Right X coordinate of frame
   * @param y1 - Bottom Y coordinate of frame
   * @see {@link Bounds#addFrame} For matrix-aware bounds setting
   * @see {@link Bounds#clear} For resetting bounds
   */
  set(t, e, s, n) {
    this.minX = t, this.minY = e, this.maxX = s, this.maxY = n;
  }
  /**
   * Adds a rectangular frame to the bounds, optionally transformed by a matrix.
   * Updates the bounds to encompass the new frame coordinates.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * bounds.addFrame(0, 0, 100, 100);
   *
   * // Add transformed frame
   * const matrix = new Matrix()
   *     .translate(50, 50)
   *     .rotate(Math.PI / 4);
   * bounds.addFrame(0, 0, 100, 100, matrix);
   * ```
   * @param x0 - Left X coordinate of frame
   * @param y0 - Top Y coordinate of frame
   * @param x1 - Right X coordinate of frame
   * @param y1 - Bottom Y coordinate of frame
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addRect} For adding Rectangle objects
   * @see {@link Bounds#addBounds} For adding other Bounds
   */
  addFrame(t, e, s, n, r) {
    r ||= this.matrix;
    const o = r.a, a = r.b, h = r.c, c = r.d, l = r.tx, u = r.ty;
    let f = this.minX, d = this.minY, p = this.maxX, m = this.maxY, y = o * t + h * e + l, g = a * t + c * e + u;
    y < f && (f = y), g < d && (d = g), y > p && (p = y), g > m && (m = g), y = o * s + h * e + l, g = a * s + c * e + u, y < f && (f = y), g < d && (d = g), y > p && (p = y), g > m && (m = g), y = o * t + h * n + l, g = a * t + c * n + u, y < f && (f = y), g < d && (d = g), y > p && (p = y), g > m && (m = g), y = o * s + h * n + l, g = a * s + c * n + u, y < f && (f = y), g < d && (d = g), y > p && (p = y), g > m && (m = g), this.minX = f, this.minY = d, this.maxX = p, this.maxY = m;
  }
  /**
   * Adds a rectangle to the bounds, optionally transformed by a matrix.
   * Updates the bounds to encompass the given rectangle.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * // Add simple rectangle
   * const rect = new Rectangle(0, 0, 100, 100);
   * bounds.addRect(rect);
   *
   * // Add transformed rectangle
   * const matrix = new Matrix()
   *     .translate(50, 50)
   *     .rotate(Math.PI / 4);
   * bounds.addRect(rect, matrix);
   * ```
   * @param rect - The rectangle to be added
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addFrame} For adding raw coordinates
   * @see {@link Bounds#addBounds} For adding other bounds
   */
  addRect(t, e) {
    this.addFrame(t.x, t.y, t.x + t.width, t.y + t.height, e);
  }
  /**
   * Adds another bounds object to this one, optionally transformed by a matrix.
   * Expands the bounds to include the given bounds' area.
   * @example
   * ```ts
   * const bounds = new Bounds();
   *
   * // Add child bounds
   * const childBounds = sprite.getBounds();
   * bounds.addBounds(childBounds);
   *
   * // Add transformed bounds
   * const matrix = new Matrix()
   *     .scale(2, 2);
   * bounds.addBounds(childBounds, matrix);
   * ```
   * @param bounds - The bounds to be added
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addFrame} For adding raw coordinates
   * @see {@link Bounds#addRect} For adding rectangles
   */
  addBounds(t, e) {
    this.addFrame(t.minX, t.minY, t.maxX, t.maxY, e);
  }
  /**
   * Adds other Bounds as a mask, creating an intersection of the two bounds.
   * Only keeps the overlapping region between current bounds and mask bounds.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Create mask bounds
   * const mask = new Bounds();
   * mask.addFrame(50, 50, 150, 150);
   * // Apply mask - results in bounds of (50,50,100,100)
   * bounds.addBoundsMask(mask);
   * ```
   * @param mask - The Bounds to use as a mask
   * @see {@link Bounds#addBounds} For union operation
   * @see {@link Bounds#fit} For fitting to rectangle
   */
  addBoundsMask(t) {
    this.minX = this.minX > t.minX ? this.minX : t.minX, this.minY = this.minY > t.minY ? this.minY : t.minY, this.maxX = this.maxX < t.maxX ? this.maxX : t.maxX, this.maxY = this.maxY < t.maxY ? this.maxY : t.maxY;
  }
  /**
   * Applies a transformation matrix to the bounds, updating its coordinates.
   * Transforms all corners of the bounds using the given matrix.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Apply translation
   * const translateMatrix = new Matrix()
   *     .translate(50, 50);
   * bounds.applyMatrix(translateMatrix);
   * ```
   * @param matrix - The matrix to apply to the bounds
   * @see {@link Matrix} For matrix operations
   * @see {@link Bounds#addFrame} For adding transformed frames
   */
  applyMatrix(t) {
    const e = this.minX, s = this.minY, n = this.maxX, r = this.maxY, { a: o, b: a, c: h, d: c, tx: l, ty: u } = t;
    let f = o * e + h * s + l, d = a * e + c * s + u;
    this.minX = f, this.minY = d, this.maxX = f, this.maxY = d, f = o * n + h * s + l, d = a * n + c * s + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY, f = o * e + h * r + l, d = a * e + c * r + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY, f = o * n + h * r + l, d = a * n + c * r + u, this.minX = f < this.minX ? f : this.minX, this.minY = d < this.minY ? d : this.minY, this.maxX = f > this.maxX ? f : this.maxX, this.maxY = d > this.maxY ? d : this.maxY;
  }
  /**
   * Resizes the bounds object to fit within the given rectangle.
   * Clips the bounds if they extend beyond the rectangle's edges.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 200, 200);
   * // Fit within viewport
   * const viewport = new Rectangle(50, 50, 100, 100);
   * bounds.fit(viewport);
   * // bounds are now (50, 50, 150, 150)
   * ```
   * @param rect - The rectangle to fit within
   * @returns This bounds object for chaining
   * @see {@link Bounds#addBoundsMask} For intersection
   * @see {@link Bounds#pad} For expanding bounds
   */
  fit(t) {
    return this.minX < t.left && (this.minX = t.left), this.maxX > t.right && (this.maxX = t.right), this.minY < t.top && (this.minY = t.top), this.maxY > t.bottom && (this.maxY = t.bottom), this;
  }
  /**
   * Resizes the bounds object to include the given bounds.
   * Similar to fit() but works with raw coordinate values instead of a Rectangle.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 200, 200);
   * // Fit to specific coordinates
   * bounds.fitBounds(50, 150, 50, 150);
   * // bounds are now (50, 50, 150, 150)
   * ```
   * @param left - The left value of the bounds
   * @param right - The right value of the bounds
   * @param top - The top value of the bounds
   * @param bottom - The bottom value of the bounds
   * @returns This bounds object for chaining
   * @see {@link Bounds#fit} For fitting to Rectangle
   * @see {@link Bounds#addBoundsMask} For intersection
   */
  fitBounds(t, e, s, n) {
    return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < s && (this.minY = s), this.maxY > n && (this.maxY = n), this;
  }
  /**
   * Pads bounds object, making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Add equal padding
   * bounds.pad(10);
   * // bounds are now (-10, -10, 110, 110)
   *
   * // Add different padding for x and y
   * bounds.pad(20, 10);
   * // bounds are now (-30, -20, 130, 120)
   * ```
   * @param paddingX - The horizontal padding amount
   * @param paddingY - The vertical padding amount
   * @returns This bounds object for chaining
   * @see {@link Bounds#fit} For constraining bounds
   * @see {@link Bounds#scale} For uniform scaling
   */
  pad(t, e = t) {
    return this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e, this;
  }
  /**
   * Ceils the bounds by rounding up max values and rounding down min values.
   * Useful for pixel-perfect calculations and avoiding fractional pixels.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * bounds.set(10.2, 10.9, 50.1, 50.8);
   *
   * // Round to whole pixels
   * bounds.ceil();
   * // bounds are now (10, 10, 51, 51)
   * ```
   * @returns This bounds object for chaining
   * @see {@link Bounds#scale} For size adjustments
   * @see {@link Bounds#fit} For constraining bounds
   */
  ceil() {
    return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this;
  }
  /**
   * Creates a new Bounds instance with the same values.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Create a copy
   * const copy = bounds.clone();
   *
   * // Original and copy are independent
   * bounds.pad(10);
   * console.log(copy.width === bounds.width); // false
   * ```
   * @returns A new Bounds instance with the same values
   * @see {@link Bounds#copyFrom} For reusing existing bounds
   */
  clone() {
    return new pe(this.minX, this.minY, this.maxX, this.maxY);
  }
  /**
   * Scales the bounds by the given values, adjusting all edges proportionally.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   *
   * // Scale uniformly
   * bounds.scale(2);
   * // bounds are now (0, 0, 200, 200)
   *
   * // Scale non-uniformly
   * bounds.scale(0.5, 2);
   * // bounds are now (0, 0, 100, 400)
   * ```
   * @param x - The X value to scale by
   * @param y - The Y value to scale by (defaults to x)
   * @returns This bounds object for chaining
   * @see {@link Bounds#pad} For adding padding
   * @see {@link Bounds#fit} For constraining size
   */
  scale(t, e = t) {
    return this.minX *= t, this.minY *= e, this.maxX *= t, this.maxY *= e, this;
  }
  /**
   * The x position of the bounds in local space.
   * Setting this value will move the bounds while maintaining its width.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get x position
   * console.log(bounds.x); // 0
   *
   * // Move bounds horizontally
   * bounds.x = 50;
   * console.log(bounds.minX, bounds.maxX); // 50, 150
   *
   * // Width stays the same
   * console.log(bounds.width); // Still 100
   * ```
   */
  get x() {
    return this.minX;
  }
  set x(t) {
    const e = this.maxX - this.minX;
    this.minX = t, this.maxX = t + e;
  }
  /**
   * The y position of the bounds in local space.
   * Setting this value will move the bounds while maintaining its height.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get y position
   * console.log(bounds.y); // 0
   *
   * // Move bounds vertically
   * bounds.y = 50;
   * console.log(bounds.minY, bounds.maxY); // 50, 150
   *
   * // Height stays the same
   * console.log(bounds.height); // Still 100
   * ```
   */
  get y() {
    return this.minY;
  }
  set y(t) {
    const e = this.maxY - this.minY;
    this.minY = t, this.maxY = t + e;
  }
  /**
   * The width value of the bounds.
   * Represents the distance between minX and maxX coordinates.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get width
   * console.log(bounds.width); // 100
   * // Resize width
   * bounds.width = 200;
   * console.log(bounds.maxX - bounds.minX); // 200
   * ```
   */
  get width() {
    return this.maxX - this.minX;
  }
  set width(t) {
    this.maxX = this.minX + t;
  }
  /**
   * The height value of the bounds.
   * Represents the distance between minY and maxY coordinates.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Get height
   * console.log(bounds.height); // 100
   * // Resize height
   * bounds.height = 150;
   * console.log(bounds.maxY - bounds.minY); // 150
   * ```
   */
  get height() {
    return this.maxY - this.minY;
  }
  set height(t) {
    this.maxY = this.minY + t;
  }
  /**
   * The left edge coordinate of the bounds.
   * Alias for minX.
   * @example
   * ```ts
   * const bounds = new Bounds(50, 0, 150, 100);
   * console.log(bounds.left); // 50
   * console.log(bounds.left === bounds.minX); // true
   * ```
   * @readonly
   */
  get left() {
    return this.minX;
  }
  /**
   * The right edge coordinate of the bounds.
   * Alias for maxX.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * console.log(bounds.right); // 100
   * console.log(bounds.right === bounds.maxX); // true
   * ```
   * @readonly
   */
  get right() {
    return this.maxX;
  }
  /**
   * The top edge coordinate of the bounds.
   * Alias for minY.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 25, 100, 125);
   * console.log(bounds.top); // 25
   * console.log(bounds.top === bounds.minY); // true
   * ```
   * @readonly
   */
  get top() {
    return this.minY;
  }
  /**
   * The bottom edge coordinate of the bounds.
   * Alias for maxY.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 200);
   * console.log(bounds.bottom); // 200
   * console.log(bounds.bottom === bounds.maxY); // true
   * ```
   * @readonly
   */
  get bottom() {
    return this.maxY;
  }
  /**
   * Whether the bounds has positive width and height.
   * Checks if both dimensions are greater than zero.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Check if bounds are positive
   * console.log(bounds.isPositive); // true
   *
   * // Negative bounds
   * bounds.maxX = bounds.minX;
   * console.log(bounds.isPositive); // false, width is 0
   * ```
   * @readonly
   * @see {@link Bounds#isEmpty} For checking empty state
   * @see {@link Bounds#isValid} For checking validity
   */
  get isPositive() {
    return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
  }
  /**
   * Whether the bounds has valid coordinates.
   * Checks if the bounds has been initialized with real values.
   * @example
   * ```ts
   * const bounds = new Bounds();
   * console.log(bounds.isValid); // false, default state
   *
   * // Set valid bounds
   * bounds.addFrame(0, 0, 100, 100);
   * console.log(bounds.isValid); // true
   * ```
   * @readonly
   * @see {@link Bounds#isEmpty} For checking empty state
   * @see {@link Bounds#isPositive} For checking dimensions
   */
  get isValid() {
    return this.minX + this.minY !== 1 / 0;
  }
  /**
   * Adds vertices from a Float32Array to the bounds, optionally transformed by a matrix.
   * Used for efficiently updating bounds from raw vertex data.
   * @example
   * ```ts
   * const bounds = new Bounds();
   *
   * // Add vertices from geometry
   * const vertices = new Float32Array([
   *     0, 0,    // Vertex 1
   *     100, 0,  // Vertex 2
   *     100, 100 // Vertex 3
   * ]);
   * bounds.addVertexData(vertices, 0, 6);
   *
   * // Add transformed vertices
   * const matrix = new Matrix()
   *     .translate(50, 50)
   *     .rotate(Math.PI / 4);
   * bounds.addVertexData(vertices, 0, 6, matrix);
   *
   * // Add subset of vertices
   * bounds.addVertexData(vertices, 2, 4); // Only second vertex
   * ```
   * @param vertexData - The array of vertices to add
   * @param beginOffset - Starting index in the vertex array
   * @param endOffset - Ending index in the vertex array (excluded)
   * @param matrix - Optional transformation matrix
   * @see {@link Bounds#addFrame} For adding rectangular frames
   * @see {@link Matrix} For transformation details
   */
  addVertexData(t, e, s, n) {
    let r = this.minX, o = this.minY, a = this.maxX, h = this.maxY;
    n ||= this.matrix;
    const c = n.a, l = n.b, u = n.c, f = n.d, d = n.tx, p = n.ty;
    for (let m = e; m < s; m += 2) {
      const y = t[m], g = t[m + 1], x = c * y + u * g + d, A = l * y + f * g + p;
      r = x < r ? x : r, o = A < o ? A : o, a = x > a ? x : a, h = A > h ? A : h;
    }
    this.minX = r, this.minY = o, this.maxX = a, this.maxY = h;
  }
  /**
   * Checks if a point is contained within the bounds.
   * Returns true if the point's coordinates fall within the bounds' area.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * // Basic point check
   * console.log(bounds.containsPoint(50, 50)); // true
   * console.log(bounds.containsPoint(150, 150)); // false
   *
   * // Check edges
   * console.log(bounds.containsPoint(0, 0));   // true, includes edges
   * console.log(bounds.containsPoint(100, 100)); // true, includes edges
   * ```
   * @param x - x coordinate to check
   * @param y - y coordinate to check
   * @returns True if the point is inside the bounds
   * @see {@link Bounds#isPositive} For valid bounds check
   * @see {@link Bounds#rectangle} For Rectangle representation
   */
  containsPoint(t, e) {
    return this.minX <= t && this.minY <= e && this.maxX >= t && this.maxY >= e;
  }
  /**
   * Returns a string representation of the bounds.
   * Useful for debugging and logging bounds information.
   * @example
   * ```ts
   * const bounds = new Bounds(0, 0, 100, 100);
   * console.log(bounds.toString()); // "[pixi.js:Bounds minX=0 minY=0 maxX=100 maxY=100 width=100 height=100]"
   * ```
   * @returns A string describing the bounds
   * @see {@link Bounds#copyFrom} For copying bounds
   * @see {@link Bounds#clone} For creating a new instance
   */
  toString() {
    return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
  }
  /**
   * Copies the bounds from another bounds object.
   * Useful for reusing bounds objects and avoiding allocations.
   * @example
   * ```ts
   * const sourceBounds = new Bounds(0, 0, 100, 100);
   * // Copy bounds
   * const targetBounds = new Bounds();
   * targetBounds.copyFrom(sourceBounds);
   * ```
   * @param bounds - The bounds to copy from
   * @returns This bounds object for chaining
   * @see {@link Bounds#clone} For creating new instances
   */
  copyFrom(t) {
    return this.minX = t.minX, this.minY = t.minY, this.maxX = t.maxX, this.maxY = t.maxY, this;
  }
}
function Xn(i, t, e) {
  const s = (o, a) => {
    const h = a.x - o.x, c = a.y - o.y, l = Math.sqrt(h * h + c * c), u = h / l, f = c / l;
    return { len: l, nx: u, ny: f };
  }, n = (o, a) => {
    o === 0 ? i.moveTo(a.x, a.y) : i.lineTo(a.x, a.y);
  };
  let r = t[t.length - 1];
  for (let o = 0; o < t.length; o++) {
    const a = t[o % t.length], h = a.radius ?? e;
    if (h <= 0) {
      n(o, a), r = a;
      continue;
    }
    const c = t[(o + 1) % t.length], l = s(a, r), u = s(a, c);
    if (l.len < 1e-4 || u.len < 1e-4) {
      n(o, a), r = a;
      continue;
    }
    let f = Math.asin(l.nx * u.ny - l.ny * u.nx), d = 1, p = !1;
    l.nx * u.nx - l.ny * -u.ny < 0 ? f < 0 ? f = Math.PI + f : (f = Math.PI - f, d = -1, p = !0) : f > 0 && (d = -1, p = !0);
    const m = f / 2;
    let y, g = Math.abs(
      Math.cos(m) * h / Math.sin(m)
    );
    g > Math.min(l.len / 2, u.len / 2) ? (g = Math.min(l.len / 2, u.len / 2), y = Math.abs(g * Math.sin(m) / Math.cos(m))) : y = h;
    const x = a.x + u.nx * g + -u.ny * y * d, A = a.y + u.ny * g + u.nx * y * d, _ = Math.atan2(l.ny, l.nx) + Math.PI / 2 * d, M = Math.atan2(u.ny, u.nx) - Math.PI / 2 * d;
    o === 0 && i.moveTo(
      x + Math.cos(_) * y,
      A + Math.sin(_) * y
    ), i.arc(x, A, y, _, M, p), r = a;
  }
}
function Yn(i, t, e, s) {
  const n = (a, h) => Math.sqrt((a.x - h.x) ** 2 + (a.y - h.y) ** 2), r = (a, h, c) => ({
    x: a.x + (h.x - a.x) * c,
    y: a.y + (h.y - a.y) * c
  }), o = t.length;
  for (let a = 0; a < o; a++) {
    const h = t[(a + 1) % o], c = h.radius ?? e;
    if (c <= 0) {
      a === 0 ? i.moveTo(h.x, h.y) : i.lineTo(h.x, h.y);
      continue;
    }
    const l = t[a], u = t[(a + 2) % o], f = n(l, h);
    let d;
    if (f < 1e-4)
      d = h;
    else {
      const y = Math.min(f / 2, c);
      d = r(
        h,
        l,
        y / f
      );
    }
    const p = n(u, h);
    let m;
    if (p < 1e-4)
      m = h;
    else {
      const y = Math.min(p / 2, c);
      m = r(
        h,
        u,
        y / p
      );
    }
    a === 0 ? i.moveTo(d.x, d.y) : i.lineTo(d.x, d.y), i.quadraticCurveTo(h.x, h.y, m.x, m.y, s);
  }
}
const Un = new H();
class Dn {
  /** The list of shape primitives that make up the path. */
  shapePrimitives = [];
  _currentPoly = null;
  _graphicsPath2D;
  _bounds = new pe();
  signed;
  constructor(t) {
    this._graphicsPath2D = t, this.signed = t.checkForHoles;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    return this.startPoly(t, e), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._ensurePoly();
    const s = this._currentPoly.points, n = s[s.length - 2], r = s[s.length - 1];
    return (n !== t || r !== e) && s.push(t, e), this;
  }
  /**
   * Adds an arc to the path. The arc is centered at (x, y)
   *  position with radius `radius` starting at `startAngle` and ending at `endAngle`.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The radius of the arc.
   * @param startAngle - The starting angle of the arc, in radians.
   * @param endAngle - The ending angle of the arc, in radians.
   * @param counterclockwise - Specifies whether the arc should be drawn in the anticlockwise direction. False by default.
   * @returns The instance of the current object for chaining.
   */
  arc(t, e, s, n, r, o) {
    this._ensurePoly(!1);
    const a = this._currentPoly.points;
    return $s(a, t, e, s, n, r, o), this;
  }
  /**
   * Adds an arc to the path with the arc tangent to the line joining two specified points.
   * The arc radius is specified by `radius`.
   * @param x1 - The x-coordinate of the first point.
   * @param y1 - The y-coordinate of the first point.
   * @param x2 - The x-coordinate of the second point.
   * @param y2 - The y-coordinate of the second point.
   * @param radius - The radius of the arc.
   * @returns The instance of the current object for chaining.
   */
  arcTo(t, e, s, n, r) {
    this._ensurePoly();
    const o = this._currentPoly.points;
    return en(o, t, e, s, n, r), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, s, n, r, o, a) {
    const h = this._currentPoly.points;
    return rn(
      h,
      this._currentPoly.lastX,
      this._currentPoly.lastY,
      o,
      a,
      t,
      e,
      s,
      n,
      r
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, s, n, r, o, a) {
    this._ensurePoly();
    const h = this._currentPoly;
    return Hs(
      this._currentPoly.points,
      h.lastX,
      h.lastY,
      t,
      e,
      s,
      n,
      r,
      o,
      a
    ), this;
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the control point.
   * @param cp1y - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothing - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, s, n, r) {
    this._ensurePoly();
    const o = this._currentPoly;
    return Ji(
      this._currentPoly.points,
      o.lastX,
      o.lastY,
      t,
      e,
      s,
      n,
      r
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.endPoly(!0), this;
  }
  /**
   * Adds another path to the current path. This method allows for the combination of multiple paths into one.
   * @param path - The `GraphicsPath` object representing the path to add.
   * @param transform - An optional `Matrix` object to apply a transformation to the path before adding it.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    this.endPoly(), e && !e.isIdentity() && (t = t.clone(!0), t.transform(e));
    const s = this.shapePrimitives, n = s.length;
    for (let r = 0; r < t.instructions.length; r++) {
      const o = t.instructions[r];
      this[o.action](...o.data);
    }
    if (t.checkForHoles && s.length - n > 1) {
      let r = null;
      for (let o = n; o < s.length; o++) {
        const a = s[o];
        if (a.shape.type === "polygon") {
          const h = a.shape, c = r?.shape;
          c && c.containsPolygon(h) ? (r.holes ||= [], r.holes.push(a), s.copyWithin(o, o + 1), s.length--, o--) : r = a;
        }
      }
    }
    return this;
  }
  /**
   * Finalizes the drawing of the current path. Optionally, it can close the path.
   * @param closePath - A boolean indicating whether to close the path after finishing. False by default.
   */
  finish(t = !1) {
    this.endPoly(t);
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, s, n, r) {
    return this.drawShape(new H(t, e, s, n), r), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, s, n) {
    return this.drawShape(new Ue(t, e, s), n), this;
  }
  /**
   * Draws a polygon shape. This method allows for the creation of complex polygons by specifying a sequence of points.
   * @param points - An array of numbers, or or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  poly(t, e, s) {
    const n = new Yt(t);
    return n.closePath = e, this.drawShape(n, s), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, s, n, r = 0, o) {
    n = Math.max(n | 0, 3);
    const a = -1 * Math.PI / 2 + r, h = Math.PI * 2 / n, c = [];
    for (let l = 0; l < n; l++) {
      const u = a - l * h;
      c.push(
        t + s * Math.cos(u),
        e + s * Math.sin(u)
      );
    }
    return this.poly(c, !0, o), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param smoothness - Optional parameter to adjust the smoothness of the rounding.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, s, n, r, o = 0, a) {
    if (n = Math.max(n | 0, 3), r <= 0)
      return this.regularPoly(t, e, s, n, o);
    const h = s * Math.sin(Math.PI / n) - 1e-3;
    r = Math.min(r, h);
    const c = -1 * Math.PI / 2 + o, l = Math.PI * 2 / n, u = (n - 2) * Math.PI / n / 2;
    for (let f = 0; f < n; f++) {
      const d = f * l + c, p = t + s * Math.cos(d), m = e + s * Math.sin(d), y = d + Math.PI + u, g = d - Math.PI - u, x = p + r * Math.cos(y), A = m + r * Math.sin(y), _ = p + r * Math.cos(g), M = m + r * Math.sin(g);
      f === 0 ? this.moveTo(x, A) : this.lineTo(x, A), this.quadraticCurveTo(p, m, _, M, a);
    }
    return this.closePath();
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, s = !1, n) {
    return t.length < 3 ? this : (s ? Yn(this, t, e, n) : Xn(this, t, e), this.closePath());
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, s, n, r) {
    if (r === 0)
      return this.rect(t, e, s, n);
    const o = Math.min(s, n) / 2, a = Math.min(o, Math.max(-o, r)), h = t + s, c = e + n, l = a < 0 ? -a : 0, u = Math.abs(a);
    return this.moveTo(t, e + u).arcTo(t + l, e + l, t + u, e, u).lineTo(h - u, e).arcTo(h - l, e + l, h, e + u, u).lineTo(h, c - u).arcTo(h - l, c - l, t + s - u, c, u).lineTo(t + u, c).arcTo(t + l, c - l, t, c - u, u).closePath();
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, s, n, r, o) {
    if (r <= 0)
      return this.rect(t, e, s, n);
    const a = Math.min(r, Math.min(s, n) / 2), h = t + s, c = e + n, l = [
      t + a,
      e,
      h - a,
      e,
      h,
      e + a,
      h,
      c - a,
      h - a,
      c,
      t + a,
      c,
      t,
      c - a,
      t,
      e + a
    ];
    for (let u = l.length - 1; u >= 2; u -= 2)
      l[u] === l[u - 2] && l[u - 1] === l[u - 3] && l.splice(u - 1, 2);
    return this.poly(l, !0, o);
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @param transform - An optional `Matrix` object to apply a transformation to the ellipse. This can include rotations.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, s, n, r) {
    return this.drawShape(new De(t, e, s, n), r), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, s, n, r, o) {
    return this.drawShape(new Oe(t, e, s, n, r), o), this;
  }
  /**
   * Draws a given shape on the canvas.
   * This is a generic method that can draw any type of shape specified by the `ShapePrimitive` parameter.
   * An optional transformation matrix can be applied to the shape, allowing for complex transformations.
   * @param shape - The shape to draw, defined as a `ShapePrimitive` object.
   * @param matrix - An optional `Matrix` for transforming the shape. This can include rotations,
   * scaling, and translations.
   * @returns The instance of the current object for chaining.
   */
  drawShape(t, e) {
    return this.endPoly(), this.shapePrimitives.push({ shape: t, transform: e }), this;
  }
  /**
   * Starts a new polygon path from the specified starting point.
   * This method initializes a new polygon or ends the current one if it exists.
   * @param x - The x-coordinate of the starting point of the new polygon.
   * @param y - The y-coordinate of the starting point of the new polygon.
   * @returns The instance of the current object for chaining.
   */
  startPoly(t, e) {
    let s = this._currentPoly;
    return s && this.endPoly(), s = new Yt(), s.points.push(t, e), this._currentPoly = s, this;
  }
  /**
   * Ends the current polygon path. If `closePath` is set to true,
   * the path is closed by connecting the last point to the first one.
   * This method finalizes the current polygon and prepares it for drawing or adding to the shape primitives.
   * @param closePath - A boolean indicating whether to close the polygon by connecting the last point
   *  back to the starting point. False by default.
   * @returns The instance of the current object for chaining.
   */
  endPoly(t = !1) {
    const e = this._currentPoly;
    return e && e.points.length > 2 && (e.closePath = t, this.shapePrimitives.push({ shape: e })), this._currentPoly = null, this;
  }
  _ensurePoly(t = !0) {
    if (!this._currentPoly && (this._currentPoly = new Yt(), t)) {
      const e = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (e) {
        let s = e.shape.x, n = e.shape.y;
        if (e.transform && !e.transform.isIdentity()) {
          const r = e.transform, o = s;
          s = r.a * s + r.c * n + r.tx, n = r.b * o + r.d * n + r.ty;
        }
        this._currentPoly.points.push(s, n);
      } else
        this._currentPoly.points.push(0, 0);
    }
  }
  /** Builds the path. */
  buildPath() {
    const t = this._graphicsPath2D;
    this.shapePrimitives.length = 0, this._currentPoly = null;
    for (let e = 0; e < t.instructions.length; e++) {
      const s = t.instructions[e];
      this[s.action](...s.data);
    }
    this.finish();
  }
  /** Gets the bounds of the path. */
  get bounds() {
    const t = this._bounds;
    t.clear();
    const e = this.shapePrimitives;
    for (let s = 0; s < e.length; s++) {
      const n = e[s], r = n.shape.getBounds(Un);
      n.transform ? t.addRect(r, n.transform) : t.addRect(r);
    }
    return t;
  }
}
class Mt {
  instructions = [];
  /** unique id for this graphics path */
  uid = et("graphicsPath");
  _dirty = !0;
  // needed for hit testing and bounds calculations
  _shapePath;
  /**
   * Controls whether shapes in this path should be checked for holes using the non-zero fill rule.
   * When true, any closed shape that is fully contained within another shape will become
   * a hole in that shape during filling operations.
   *
   * This follows SVG's non-zero fill rule where:
   * 1. Shapes are analyzed to find containment relationships
   * 2. If Shape B is fully contained within Shape A, Shape B becomes a hole in Shape A
   * 3. Multiple nested holes are supported
   *
   * Mainly used internally by the SVG parser to correctly handle holes in complex paths.
   * When false, all shapes are filled independently without checking for holes.
   */
  checkForHoles;
  /**
   * Provides access to the internal shape path, ensuring it is up-to-date with the current instructions.
   * @returns The `ShapePath` instance associated with this `GraphicsPath`.
   */
  get shapePath() {
    return this._shapePath || (this._shapePath = new Dn(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
  }
  /**
   * Creates a `GraphicsPath` instance optionally from an SVG path string or an array of `PathInstruction`.
   * @param instructions - An SVG path string or an array of `PathInstruction` objects.
   * @param signed
   */
  constructor(t, e = !1) {
    this.checkForHoles = e, typeof t == "string" ? Bn(t, this) : this.instructions = t?.slice() ?? [];
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @param transform - An optional transformation to apply to the added path.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    return t = t.clone(), this.instructions.push({ action: "addPath", data: [t, e] }), this._dirty = !0, this;
  }
  arc(...t) {
    return this.instructions.push({ action: "arc", data: t }), this._dirty = !0, this;
  }
  arcTo(...t) {
    return this.instructions.push({ action: "arcTo", data: t }), this._dirty = !0, this;
  }
  arcToSvg(...t) {
    return this.instructions.push({ action: "arcToSvg", data: t }), this._dirty = !0, this;
  }
  bezierCurveTo(...t) {
    return this.instructions.push({ action: "bezierCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires two points: the second control point and the end point. The first control point is assumed to be
   * The starting point is the last point in the current path.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveToShort(t, e, s, n, r) {
    const o = this.instructions[this.instructions.length - 1], a = this.getLastPoint(F.shared);
    let h = 0, c = 0;
    if (!o || o.action !== "bezierCurveTo")
      h = a.x, c = a.y;
    else {
      h = o.data[2], c = o.data[3];
      const l = a.x, u = a.y;
      h = l + (l - h), c = u + (u - c);
    }
    return this.instructions.push({ action: "bezierCurveTo", data: [h, c, t, e, s, n, r] }), this._dirty = !0, this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.instructions.push({ action: "closePath", data: [] }), this._dirty = !0, this;
  }
  ellipse(...t) {
    return this.instructions.push({ action: "ellipse", data: t }), this._dirty = !0, this;
  }
  lineTo(...t) {
    return this.instructions.push({ action: "lineTo", data: t }), this._dirty = !0, this;
  }
  moveTo(...t) {
    return this.instructions.push({ action: "moveTo", data: t }), this;
  }
  quadraticCurveTo(...t) {
    return this.instructions.push({ action: "quadraticCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a quadratic curve to the path. It uses the previous point as the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveToShort(t, e, s) {
    const n = this.instructions[this.instructions.length - 1], r = this.getLastPoint(F.shared);
    let o = 0, a = 0;
    if (!n || n.action !== "quadraticCurveTo")
      o = r.x, a = r.y;
    else {
      o = n.data[0], a = n.data[1];
      const h = r.x, c = r.y;
      o = h + (h - o), a = c + (c - a);
    }
    return this.instructions.push({ action: "quadraticCurveTo", data: [o, a, t, e, s] }), this._dirty = !0, this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, s, n, r) {
    return this.instructions.push({ action: "rect", data: [t, e, s, n, r] }), this._dirty = !0, this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, s, n) {
    return this.instructions.push({ action: "circle", data: [t, e, s, n] }), this._dirty = !0, this;
  }
  roundRect(...t) {
    return this.instructions.push({ action: "roundRect", data: t }), this._dirty = !0, this;
  }
  poly(...t) {
    return this.instructions.push({ action: "poly", data: t }), this._dirty = !0, this;
  }
  regularPoly(...t) {
    return this.instructions.push({ action: "regularPoly", data: t }), this._dirty = !0, this;
  }
  roundPoly(...t) {
    return this.instructions.push({ action: "roundPoly", data: t }), this._dirty = !0, this;
  }
  roundShape(...t) {
    return this.instructions.push({ action: "roundShape", data: t }), this._dirty = !0, this;
  }
  filletRect(...t) {
    return this.instructions.push({ action: "filletRect", data: t }), this._dirty = !0, this;
  }
  chamferRect(...t) {
    return this.instructions.push({ action: "chamferRect", data: t }), this._dirty = !0, this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @param transform - An optional `Matrix` object to apply a transformation to the star.
   * This can include rotations, scaling, and translations.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  // eslint-disable-next-line max-len
  star(t, e, s, n, r, o, a) {
    r ||= n / 2;
    const h = -1 * Math.PI / 2 + o, c = s * 2, l = Math.PI * 2 / c, u = [];
    for (let f = 0; f < c; f++) {
      const d = f % 2 ? r : n, p = f * l + h;
      u.push(
        t + d * Math.cos(p),
        e + d * Math.sin(p)
      );
    }
    return this.poly(u, !0, a), this;
  }
  /**
   * Creates a copy of the current `GraphicsPath` instance. This method supports both shallow and deep cloning.
   * A shallow clone copies the reference of the instructions array, while a deep clone creates a new array and
   * copies each instruction individually, ensuring that modifications to the instructions of the cloned `GraphicsPath`
   * do not affect the original `GraphicsPath` and vice versa.
   * @param deep - A boolean flag indicating whether the clone should be deep.
   * @returns A new `GraphicsPath` instance that is a clone of the current instance.
   */
  clone(t = !1) {
    const e = new Mt();
    if (e.checkForHoles = this.checkForHoles, !t)
      e.instructions = this.instructions.slice();
    else
      for (let s = 0; s < this.instructions.length; s++) {
        const n = this.instructions[s];
        e.instructions.push({ action: n.action, data: n.data.slice() });
      }
    return e;
  }
  clear() {
    return this.instructions.length = 0, this._dirty = !0, this;
  }
  /**
   * Applies a transformation matrix to all drawing instructions within the `GraphicsPath`.
   * This method enables the modification of the path's geometry according to the provided
   * transformation matrix, which can include translations, rotations, scaling, and skewing.
   *
   * Each drawing instruction in the path is updated to reflect the transformation,
   * ensuring the visual representation of the path is consistent with the applied matrix.
   *
   * Note: The transformation is applied directly to the coordinates and control points of the drawing instructions,
   * not to the path as a whole. This means the transformation's effects are baked into the individual instructions,
   * allowing for fine-grained control over the path's appearance.
   * @param matrix - A `Matrix` object representing the transformation to apply.
   * @returns The instance of the current object for chaining further operations.
   */
  transform(t) {
    if (t.isIdentity()) return this;
    const e = t.a, s = t.b, n = t.c, r = t.d, o = t.tx, a = t.ty;
    let h = 0, c = 0, l = 0, u = 0, f = 0, d = 0, p = 0, m = 0;
    for (let y = 0; y < this.instructions.length; y++) {
      const g = this.instructions[y], x = g.data;
      switch (g.action) {
        case "moveTo":
        case "lineTo":
          h = x[0], c = x[1], x[0] = e * h + n * c + o, x[1] = s * h + r * c + a;
          break;
        case "bezierCurveTo":
          l = x[0], u = x[1], f = x[2], d = x[3], h = x[4], c = x[5], x[0] = e * l + n * u + o, x[1] = s * l + r * u + a, x[2] = e * f + n * d + o, x[3] = s * f + r * d + a, x[4] = e * h + n * c + o, x[5] = s * h + r * c + a;
          break;
        case "quadraticCurveTo":
          l = x[0], u = x[1], h = x[2], c = x[3], x[0] = e * l + n * u + o, x[1] = s * l + r * u + a, x[2] = e * h + n * c + o, x[3] = s * h + r * c + a;
          break;
        case "arcToSvg":
          h = x[5], c = x[6], p = x[0], m = x[1], x[0] = e * p + n * m, x[1] = s * p + r * m, x[5] = e * h + n * c + o, x[6] = s * h + r * c + a;
          break;
        case "circle":
          x[4] = Ft(x[3], t);
          break;
        case "rect":
          x[4] = Ft(x[4], t);
          break;
        case "ellipse":
          x[8] = Ft(x[8], t);
          break;
        case "roundRect":
          x[5] = Ft(x[5], t);
          break;
        case "addPath":
          x[0].transform(t);
          break;
        case "poly":
          x[2] = Ft(x[2], t);
          break;
        default:
          vt("unknown transform action", g.action);
          break;
      }
    }
    return this._dirty = !0, this;
  }
  get bounds() {
    return this.shapePath.bounds;
  }
  /**
   * Retrieves the last point from the current drawing instructions in the `GraphicsPath`.
   * This method is useful for operations that depend on the path's current endpoint,
   * such as connecting subsequent shapes or paths. It supports various drawing instructions,
   * ensuring the last point's position is accurately determined regardless of the path's complexity.
   *
   * If the last instruction is a `closePath`, the method iterates backward through the instructions
   *  until it finds an actionable instruction that defines a point (e.g., `moveTo`, `lineTo`,
   * `quadraticCurveTo`, etc.). For compound paths added via `addPath`, it recursively retrieves
   * the last point from the nested path.
   * @param out - A `Point` object where the last point's coordinates will be stored.
   * This object is modified directly to contain the result.
   * @returns The `Point` object containing the last point's coordinates.
   */
  getLastPoint(t) {
    let e = this.instructions.length - 1, s = this.instructions[e];
    if (!s)
      return t.x = 0, t.y = 0, t;
    for (; s.action === "closePath"; ) {
      if (e--, e < 0)
        return t.x = 0, t.y = 0, t;
      s = this.instructions[e];
    }
    switch (s.action) {
      case "moveTo":
      case "lineTo":
        t.x = s.data[0], t.y = s.data[1];
        break;
      case "quadraticCurveTo":
        t.x = s.data[2], t.y = s.data[3];
        break;
      case "bezierCurveTo":
        t.x = s.data[4], t.y = s.data[5];
        break;
      case "arc":
      case "arcToSvg":
        t.x = s.data[5], t.y = s.data[6];
        break;
      case "addPath":
        s.data[0].getLastPoint(t);
        break;
    }
    return t;
  }
}
function Ft(i, t) {
  return i ? i.prepend(t) : t.clone();
}
function X(i, t, e) {
  const s = i.getAttribute(t);
  return s ? Number(s) : e;
}
function On(i, t) {
  const e = i.querySelectorAll("defs");
  for (let s = 0; s < e.length; s++) {
    const n = e[s];
    for (let r = 0; r < n.children.length; r++) {
      const o = n.children[r];
      switch (o.nodeName.toLowerCase()) {
        case "lineargradient":
          t.defs[o.id] = Nn(o);
          break;
        case "radialgradient":
          t.defs[o.id] = Hn();
          break;
      }
    }
  }
}
function Nn(i) {
  const t = X(i, "x1", 0), e = X(i, "y1", 0), s = X(i, "x2", 1), n = X(i, "y2", 0), r = i.getAttribute("gradientUnits") || "objectBoundingBox", o = new ot(
    t,
    e,
    s,
    n,
    r === "objectBoundingBox" ? "local" : "global"
  );
  for (let a = 0; a < i.children.length; a++) {
    const h = i.children[a], c = X(h, "offset", 0), l = W.shared.setValue(h.getAttribute("stop-color")).toNumber();
    o.addColorStop(c, l);
  }
  return o;
}
function Hn(i) {
  return new ot(0, 0, 1, 0);
}
function ps(i) {
  const t = i.match(/url\s*\(\s*['"]?\s*#([^'"\s)]+)\s*['"]?\s*\)/i);
  return t ? t[1] : "";
}
const ms = {
  // Fill properties
  fill: { type: "paint", default: 0 },
  // Fill color/gradient
  "fill-opacity": { type: "number", default: 1 },
  // Fill transparency
  // Stroke properties
  stroke: { type: "paint", default: 0 },
  // Stroke color/gradient
  "stroke-width": { type: "number", default: 1 },
  // Width of stroke
  "stroke-opacity": { type: "number", default: 1 },
  // Stroke transparency
  "stroke-linecap": { type: "string", default: "butt" },
  // End cap style: butt, round, square
  "stroke-linejoin": { type: "string", default: "miter" },
  // Join style: miter, round, bevel
  "stroke-miterlimit": { type: "number", default: 10 },
  // Limit on miter join sharpness
  "stroke-dasharray": { type: "string", default: "none" },
  // Dash pattern
  "stroke-dashoffset": { type: "number", default: 0 },
  // Offset for dash pattern
  // Global properties
  opacity: { type: "number", default: 1 }
  // Overall opacity
};
function Ks(i, t) {
  const e = i.getAttribute("style"), s = {}, n = {}, r = {
    strokeStyle: s,
    fillStyle: n,
    useFill: !1,
    useStroke: !1
  };
  for (const o in ms) {
    const a = i.getAttribute(o);
    a && ys(t, r, o, a.trim());
  }
  if (e) {
    const o = e.split(";");
    for (let a = 0; a < o.length; a++) {
      const h = o[a].trim(), [c, l] = h.split(":");
      ms[c] && ys(t, r, c, l.trim());
    }
  }
  return {
    strokeStyle: r.useStroke ? s : null,
    fillStyle: r.useFill ? n : null,
    useFill: r.useFill,
    useStroke: r.useStroke
  };
}
function ys(i, t, e, s) {
  switch (e) {
    case "stroke":
      if (s !== "none") {
        if (s.startsWith("url(")) {
          const n = ps(s);
          t.strokeStyle.fill = i.defs[n];
        } else
          t.strokeStyle.color = W.shared.setValue(s).toNumber();
        t.useStroke = !0;
      }
      break;
    case "stroke-width":
      t.strokeStyle.width = Number(s);
      break;
    case "fill":
      if (s !== "none") {
        if (s.startsWith("url(")) {
          const n = ps(s);
          t.fillStyle.fill = i.defs[n];
        } else
          t.fillStyle.color = W.shared.setValue(s).toNumber();
        t.useFill = !0;
      }
      break;
    case "fill-opacity":
      t.fillStyle.alpha = Number(s);
      break;
    case "stroke-opacity":
      t.strokeStyle.alpha = Number(s);
      break;
    case "opacity":
      t.fillStyle.alpha = Number(s), t.strokeStyle.alpha = Number(s);
      break;
  }
}
function $n(...i) {
}
function Wn(i, t) {
  if (typeof i == "string") {
    const o = document.createElement("div");
    o.innerHTML = i.trim(), i = o.querySelector("svg");
  }
  const e = {
    context: t,
    defs: {},
    path: new Mt()
  };
  On(i, e);
  const s = i.children, { fillStyle: n, strokeStyle: r } = Ks(i, e);
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    a.nodeName.toLowerCase() !== "defs" && Qs(a, e, n, r);
  }
  return t;
}
function Qs(i, t, e, s) {
  const n = i.children, { fillStyle: r, strokeStyle: o } = Ks(i, t);
  r && e ? e = { ...e, ...r } : r && (e = r), o && s ? s = { ...s, ...o } : o && (s = o);
  const a = !e && !s;
  a && (e = { color: 0 });
  let h, c, l, u, f, d, p, m, y, g, x, A, _, M, v, b, C;
  switch (i.nodeName.toLowerCase()) {
    case "path":
      M = i.getAttribute("d"), i.getAttribute("fill-rule"), v = new Mt(M, !0), t.context.path(v), e && t.context.fill(e), s && t.context.stroke(s);
      break;
    case "circle":
      p = X(i, "cx", 0), m = X(i, "cy", 0), y = X(i, "r", 0), t.context.ellipse(p, m, y, y), e && t.context.fill(e), s && t.context.stroke(s);
      break;
    case "rect":
      h = X(i, "x", 0), c = X(i, "y", 0), b = X(i, "width", 0), C = X(i, "height", 0), g = X(i, "rx", 0), x = X(i, "ry", 0), g || x ? t.context.roundRect(h, c, b, C, g || x) : t.context.rect(h, c, b, C), e && t.context.fill(e), s && t.context.stroke(s);
      break;
    case "ellipse":
      p = X(i, "cx", 0), m = X(i, "cy", 0), g = X(i, "rx", 0), x = X(i, "ry", 0), t.context.beginPath(), t.context.ellipse(p, m, g, x), e && t.context.fill(e), s && t.context.stroke(s);
      break;
    case "line":
      l = X(i, "x1", 0), u = X(i, "y1", 0), f = X(i, "x2", 0), d = X(i, "y2", 0), t.context.beginPath(), t.context.moveTo(l, u), t.context.lineTo(f, d), s && t.context.stroke(s);
      break;
    case "polygon":
      _ = i.getAttribute("points"), A = _.match(/\d+/g).map((k) => parseInt(k, 10)), t.context.poly(A, !0), e && t.context.fill(e), s && t.context.stroke(s);
      break;
    case "polyline":
      _ = i.getAttribute("points"), A = _.match(/\d+/g).map((k) => parseInt(k, 10)), t.context.poly(A, !1), s && t.context.stroke(s);
      break;
    // Group elements - just process children
    case "g":
    case "svg":
      break;
    default: {
      $n(`[SVG parser] <${i.nodeName}> elements unsupported`);
      break;
    }
  }
  a && (e = null);
  for (let k = 0; k < n.length; k++)
    Qs(n[k], t, e, s);
}
function Vn(i) {
  return W.isColorLike(i);
}
function gs(i) {
  return i instanceof kn;
}
function xs(i) {
  return i instanceof ot;
}
function Gn(i) {
  return i instanceof O;
}
function qn(i, t, e) {
  const s = W.shared.setValue(t ?? 0);
  return i.color = s.toNumber(), i.alpha = s.alpha === 1 ? e.alpha : s.alpha, i.texture = O.WHITE, { ...e, ...i };
}
function jn(i, t, e) {
  return i.texture = t, { ...e, ...i };
}
function _s(i, t, e) {
  return i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, { ...e, ...i };
}
function bs(i, t, e) {
  return t.buildGradient(), i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, i.textureSpace = t.textureSpace, { ...e, ...i };
}
function zn(i, t) {
  const e = { ...t, ...i }, s = W.shared.setValue(e.color);
  return e.alpha *= s.alpha, e.color = s.toNumber(), e;
}
function Xt(i, t) {
  if (i == null)
    return null;
  const e = {}, s = i;
  return Vn(i) ? qn(e, i, t) : Gn(i) ? jn(e, i, t) : gs(i) ? _s(e, i, t) : xs(i) ? bs(e, i, t) : s.fill && gs(s.fill) ? _s(s, s.fill, t) : s.fill && xs(s.fill) ? bs(s, s.fill, t) : zn(s, t);
}
function As(i, t) {
  const { width: e, alignment: s, miterLimit: n, cap: r, join: o, pixelLine: a, ...h } = t, c = Xt(i, h);
  return c ? {
    width: e,
    alignment: s,
    miterLimit: n,
    cap: r,
    join: o,
    pixelLine: a,
    ...c
  } : null;
}
const Zn = new F(), vs = new N();
class $ extends Y {
  /** The default fill style to use when none is provided. */
  static defaultFillStyle = {
    /** The color to use for the fill. */
    color: 16777215,
    /** The alpha value to use for the fill. */
    alpha: 1,
    /** The texture to use for the fill. */
    texture: O.WHITE,
    /** The matrix to apply. */
    matrix: null,
    /** The fill pattern to use. */
    fill: null,
    /** Whether coordinates are 'global' or 'local' */
    textureSpace: "local"
  };
  /** The default stroke style to use when none is provided. */
  static defaultStrokeStyle = {
    /** The width of the stroke. */
    width: 1,
    /** The color to use for the stroke. */
    color: 16777215,
    /** The alpha value to use for the stroke. */
    alpha: 1,
    /** The alignment of the stroke. */
    alignment: 0.5,
    /** The miter limit to use. */
    miterLimit: 10,
    /** The line cap style to use. */
    cap: "butt",
    /** The line join style to use. */
    join: "miter",
    /** The texture to use for the fill. */
    texture: O.WHITE,
    /** The matrix to apply. */
    matrix: null,
    /** The fill pattern to use. */
    fill: null,
    /** Whether coordinates are 'global' or 'local' */
    textureSpace: "local",
    /** If the stroke is a pixel line. */
    pixelLine: !1
  };
  /**
   * unique id for this graphics context
   * @internal
   */
  uid = et("graphicsContext");
  /** @internal */
  dirty = !0;
  /** The batch mode for this graphics context. It can be 'auto', 'batch', or 'no-batch'. */
  batchMode = "auto";
  /** @internal */
  instructions = [];
  /**
   * Custom shader to apply to the graphics when rendering.
   * @advanced
   */
  customShader;
  _activePath = new Mt();
  _transform = new N();
  _fillStyle = { ...$.defaultFillStyle };
  _strokeStyle = { ...$.defaultStrokeStyle };
  _stateStack = [];
  _tick = 0;
  _bounds = new pe();
  _boundsDirty = !0;
  /**
   * Creates a new GraphicsContext object that is a clone of this instance, copying all properties,
   * including the current drawing state, transformations, styles, and instructions.
   * @returns A new GraphicsContext instance with the same properties and state as this one.
   */
  clone() {
    const t = new $();
    return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = { ...this._fillStyle }, t._strokeStyle = { ...this._strokeStyle }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t;
  }
  /**
   * The current fill style of the graphics context. This can be a color, gradient, pattern, or a more complex style defined by a FillStyle object.
   */
  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(t) {
    this._fillStyle = Xt(t, $.defaultFillStyle);
  }
  /**
   * The current stroke style of the graphics context. Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   */
  get strokeStyle() {
    return this._strokeStyle;
  }
  set strokeStyle(t) {
    this._strokeStyle = As(t, $.defaultStrokeStyle);
  }
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param style - The fill style to apply. This can be a simple color, a gradient or pattern object,
   *                or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(t) {
    return this._fillStyle = Xt(t, $.defaultFillStyle), this;
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param style - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   *                or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(t) {
    return this._strokeStyle = Xt(t, $.defaultStrokeStyle), this;
  }
  texture(t, e, s, n, r, o) {
    return this.instructions.push({
      action: "texture",
      data: {
        image: t,
        dx: s || 0,
        dy: n || 0,
        dw: r || t.frame.width,
        dh: o || t.frame.height,
        transform: this._transform.clone(),
        alpha: this._fillStyle.alpha,
        style: e ? W.shared.setValue(e).toNumber() : 16777215
      }
    }), this.onUpdate(), this;
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._activePath = new Mt(), this;
  }
  fill(t, e) {
    let s;
    const n = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && n && n.action === "stroke" ? s = n.data.path : s = this._activePath.clone(), s ? (t != null && (e !== void 0 && typeof t == "number" && (t = { color: t, alpha: e }), this._fillStyle = Xt(t, $.defaultFillStyle)), this.instructions.push({
      action: "fill",
      // TODO copy fill style!
      data: { style: this.fillStyle, path: s }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  _initNextPathLocation() {
    const { x: t, y: e } = this._activePath.getLastPoint(F.shared);
    this._activePath.clear(), this._activePath.moveTo(t, e);
  }
  /**
   * Strokes the current path with the current stroke style. This method can take an optional
   * FillInput parameter to define the stroke's appearance, including its color, width, and other properties.
   * @param style - (Optional) The stroke style to apply. Can be defined as a simple color or a more complex style object. If omitted, uses the current stroke style.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  stroke(t) {
    let e;
    const s = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && s && s.action === "fill" ? e = s.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = As(t, $.defaultStrokeStyle)), this.instructions.push({
      action: "stroke",
      // TODO copy fill style!
      data: { style: this.strokeStyle, path: e }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path. If a hole is not completely in a shape, it will
   * fail to cut correctly!
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  cut() {
    for (let t = 0; t < 2; t++) {
      const e = this.instructions[this.instructions.length - 1 - t], s = this._activePath.clone();
      if (e && (e.action === "stroke" || e.action === "fill"))
        if (e.data.hole)
          e.data.hole.addPath(s);
        else {
          e.data.hole = s;
          break;
        }
    }
    return this._initNextPathLocation(), this;
  }
  /**
   * Adds an arc to the current path, which is centered at (x, y) with the specified radius,
   * starting and ending angles, and direction.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The arc's radius.
   * @param startAngle - The starting angle, in radians.
   * @param endAngle - The ending angle, in radians.
   * @param counterclockwise - (Optional) Specifies whether the arc is drawn counterclockwise (true) or clockwise (false). Defaults to false.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arc(t, e, s, n, r, o) {
    this._tick++;
    const a = this._transform;
    return this._activePath.arc(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      s,
      n,
      r,
      o
    ), this;
  }
  /**
   * Adds an arc to the current path with the given control points and radius, connected to the previous point
   * by a straight line if necessary.
   * @param x1 - The x-coordinate of the first control point.
   * @param y1 - The y-coordinate of the first control point.
   * @param x2 - The x-coordinate of the second control point.
   * @param y2 - The y-coordinate of the second control point.
   * @param radius - The arc's radius.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arcTo(t, e, s, n, r) {
    this._tick++;
    const o = this._transform;
    return this._activePath.arcTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * s + o.c * n + o.tx,
      o.b * s + o.d * n + o.ty,
      r
    ), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, s, n, r, o, a) {
    this._tick++;
    const h = this._transform;
    return this._activePath.arcToSvg(
      t,
      e,
      s,
      // should we rotate this with transform??
      n,
      r,
      h.a * o + h.c * a + h.tx,
      h.b * o + h.d * a + h.ty
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, s, n, r, o, a) {
    this._tick++;
    const h = this._transform;
    return this._activePath.bezierCurveTo(
      h.a * t + h.c * e + h.tx,
      h.b * t + h.d * e + h.ty,
      h.a * s + h.c * n + h.tx,
      h.b * s + h.d * n + h.ty,
      h.a * r + h.c * o + h.tx,
      h.b * r + h.d * o + h.ty,
      a
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this._tick++, this._activePath?.closePath(), this;
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, s, n) {
    return this._tick++, this._activePath.ellipse(t, e, s, n, this._transform.clone()), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, s) {
    return this._tick++, this._activePath.circle(t, e, s, this._transform.clone()), this;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @returns The instance of the current object for chaining.
   */
  path(t) {
    return this._tick++, this._activePath.addPath(t, this._transform.clone()), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._tick++;
    const s = this._transform;
    return this._activePath.lineTo(
      s.a * t + s.c * e + s.tx,
      s.b * t + s.d * e + s.ty
    ), this;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    this._tick++;
    const s = this._transform, n = this._activePath.instructions, r = s.a * t + s.c * e + s.tx, o = s.b * t + s.d * e + s.ty;
    return n.length === 1 && n[0].action === "moveTo" ? (n[0].data[0] = r, n[0].data[1] = o, this) : (this._activePath.moveTo(
      r,
      o
    ), this);
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cpx - The x-coordinate of the control point.
   * @param cpy - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, s, n, r) {
    this._tick++;
    const o = this._transform;
    return this._activePath.quadraticCurveTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * s + o.c * n + o.tx,
      o.b * s + o.d * n + o.ty,
      r
    ), this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, s, n) {
    return this._tick++, this._activePath.rect(t, e, s, n, this._transform.clone()), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, s, n, r) {
    return this._tick++, this._activePath.roundRect(t, e, s, n, r, this._transform.clone()), this;
  }
  /**
   * Draws a polygon shape by specifying a sequence of points. This method allows for the creation of complex polygons,
   * which can be both open and closed. An optional transformation can be applied, enabling the polygon to be scaled,
   * rotated, or translated as needed.
   * @param points - An array of numbers, or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates, of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   */
  poly(t, e) {
    return this._tick++, this._activePath.poly(t, e, this._transform.clone()), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, s, n, r = 0, o) {
    return this._tick++, this._activePath.regularPoly(t, e, s, n, r, o), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, s, n, r, o) {
    return this._tick++, this._activePath.roundPoly(t, e, s, n, r, o), this;
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, s, n) {
    return this._tick++, this._activePath.roundShape(t, e, s, n), this;
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, s, n, r) {
    return this._tick++, this._activePath.filletRect(t, e, s, n, r), this;
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, s, n, r, o) {
    return this._tick++, this._activePath.chamferRect(t, e, s, n, r, o), this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  star(t, e, s, n, r = 0, o = 0) {
    return this._tick++, this._activePath.star(t, e, s, n, r, o, this._transform.clone()), this;
  }
  /**
   * Parses and renders an SVG string into the graphics context. This allows for complex shapes and paths
   * defined in SVG format to be drawn within the graphics context.
   * @param svg - The SVG string to be parsed and rendered.
   */
  svg(t) {
    return this._tick++, Wn(t, this), this;
  }
  /**
   * Restores the most recently saved graphics state by popping the top of the graphics state stack.
   * This includes transformations, fill styles, and stroke styles.
   */
  restore() {
    const t = this._stateStack.pop();
    return t && (this._transform = t.transform, this._fillStyle = t.fillStyle, this._strokeStyle = t.strokeStyle), this;
  }
  /** Saves the current graphics state, including transformations, fill styles, and stroke styles, onto a stack. */
  save() {
    return this._stateStack.push({
      transform: this._transform.clone(),
      fillStyle: { ...this._fillStyle },
      strokeStyle: { ...this._strokeStyle }
    }), this;
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * @returns The current transformation matrix.
   */
  getTransform() {
    return this._transform;
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing any transformations (rotation, scaling, translation) previously applied.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  resetTransform() {
    return this._transform.identity(), this;
  }
  /**
   * Applies a rotation transformation to the graphics context around the current origin.
   * @param angle - The angle of rotation in radians.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  rotate(t) {
    return this._transform.rotate(t), this;
  }
  /**
   * Applies a scaling transformation to the graphics context, scaling drawings by x horizontally and by y vertically.
   * @param x - The scale factor in the horizontal direction.
   * @param y - (Optional) The scale factor in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  scale(t, e = t) {
    return this._transform.scale(t, e), this;
  }
  setTransform(t, e, s, n, r, o) {
    return t instanceof N ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, s, n, r, o), this);
  }
  transform(t, e, s, n, r, o) {
    return t instanceof N ? (this._transform.append(t), this) : (vs.set(t, e, s, n, r, o), this._transform.append(vs), this);
  }
  /**
   * Applies a translation transformation to the graphics context, moving the origin by the specified amounts.
   * @param x - The amount to translate in the horizontal direction.
   * @param y - (Optional) The amount to translate in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  translate(t, e = t) {
    return this._transform.translate(t, e), this;
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it. This includes clearing the path,
   * and optionally resetting transformations to the identity matrix.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  clear() {
    return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this;
  }
  onUpdate() {
    this.dirty || (this.emit("update", this, 16), this.dirty = !0, this._boundsDirty = !0);
  }
  /** The bounds of the graphic shape. */
  get bounds() {
    if (!this._boundsDirty) return this._bounds;
    const t = this._bounds;
    t.clear();
    for (let e = 0; e < this.instructions.length; e++) {
      const s = this.instructions[e], n = s.action;
      if (n === "fill") {
        const r = s.data;
        t.addBounds(r.path.bounds);
      } else if (n === "texture") {
        const r = s.data;
        t.addFrame(r.dx, r.dy, r.dx + r.dw, r.dy + r.dh, r.transform);
      }
      if (n === "stroke") {
        const r = s.data, o = r.style.alignment, a = r.style.width * (1 - o), h = r.path.bounds;
        t.addFrame(
          h.minX - a,
          h.minY - a,
          h.maxX + a,
          h.maxY + a
        );
      }
    }
    return t;
  }
  /**
   * Check to see if a point is contained within this geometry.
   * @param point - Point to check if it's contained.
   * @returns {boolean} `true` if the point is contained within geometry.
   */
  containsPoint(t) {
    if (!this.bounds.containsPoint(t.x, t.y)) return !1;
    const e = this.instructions;
    let s = !1;
    for (let n = 0; n < e.length; n++) {
      const r = e[n], o = r.data, a = o.path;
      if (!r.action || !a) continue;
      const h = o.style, c = a.shapePath.shapePrimitives;
      for (let l = 0; l < c.length; l++) {
        const u = c[l].shape;
        if (!h || !u) continue;
        const f = c[l].transform, d = f ? f.applyInverse(t, Zn) : t;
        if (r.action === "fill")
          s = u.contains(d.x, d.y);
        else {
          const m = h;
          s = u.strokeContains(d.x, d.y, m.width, m.alignment);
        }
        const p = o.hole;
        if (p) {
          const m = p.shapePath?.shapePrimitives;
          if (m)
            for (let y = 0; y < m.length; y++)
              m[y].shape.contains(d.x, d.y) && (s = !1);
        }
        if (s)
          return !0;
      }
    }
    return s;
  }
  /**
   * Destroys the GraphicsData object.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @example
   * context.destroy();
   * context.destroy(true);
   * context.destroy({ texture: true, textureSource: true });
   */
  destroy(t = !1) {
    if (this._stateStack.length = 0, this._transform = null, this.emit("destroy", this), this.removeAllListeners(), typeof t == "boolean" ? t : t?.texture) {
      const s = typeof t == "boolean" ? t : t?.textureSource;
      this._fillStyle.texture && (this._fillStyle.fill && "uid" in this._fillStyle.fill ? this._fillStyle.fill.destroy() : this._fillStyle.texture.destroy(s)), this._strokeStyle.texture && (this._strokeStyle.fill && "uid" in this._strokeStyle.fill ? this._strokeStyle.fill.destroy() : this._strokeStyle.texture.destroy(s));
    }
    this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null;
  }
}
class Re {
  /** @internal */
  batched;
  _context;
  _ownedContext;
  /**
   * Creates a new Graphics object.
   * @param options - Options for the Graphics.
   */
  constructor(t) {
    t instanceof $ && (t = { context: t });
    const { context: e, roundPixels: s, ...n } = t || {};
    e ? this._context = e : this._context = this._ownedContext = new $(), this._context.on("update", this.onViewUpdate, this);
  }
  onViewUpdate() {
  }
  set context(t) {
    t !== this._context && (this._context.off("update", this.onViewUpdate, this), this._context = t, this._context.on("update", this.onViewUpdate, this), this.onViewUpdate());
  }
  /**
   * The underlying graphics context used for drawing operations.
   * Controls how shapes and paths are rendered.
   * @example
   * ```ts
   * // Create a shared context
   * const sharedContext = new GraphicsContext();
   *
   * // Create graphics objects sharing the same context
   * const graphics1 = new Graphics();
   * const graphics2 = new Graphics();
   *
   * // Assign shared context
   * graphics1.context = sharedContext;
   * graphics2.context = sharedContext;
   *
   * // Both graphics will show the same shapes
   * sharedContext
   *     .rect(0, 0, 100, 100)
   *     .fill({ color: 0xff0000 });
   * ```
   * @see {@link GraphicsContext} For drawing operations
   * @see {@link GraphicsOptions} For context configuration
   */
  get context() {
    return this._context;
  }
  /**
   * The local bounds of the graphics object.
   * Returns the boundaries after all graphical operations but before any transforms.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw a shape
   * graphics
   *     .rect(0, 0, 100, 100)
   *     .fill({ color: 0xff0000 });
   *
   * // Get bounds information
   * const bounds = graphics.bounds;
   * console.log(bounds.width);  // 100
   * console.log(bounds.height); // 100
   * ```
   * @readonly
   * @see {@link Bounds} For bounds operations
   * @see {@link Container#getBounds} For transformed bounds
   */
  get bounds() {
    return this._context.bounds;
  }
  /**
   * Graphics objects do not need to update their bounds as the context handles this.
   * @private
   */
  updateBounds() {
  }
  /**
   * Checks if the object contains the given point.
   * Returns true if the point lies within the Graphics object's rendered area.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw a shape
   * graphics
   *     .rect(0, 0, 100, 100)
   *     .fill({ color: 0xff0000 });
   *
   * // Check point intersection
   * if (graphics.containsPoint({ x: 50, y: 50 })) {
   *     console.log('Point is inside rectangle!');
   * }
   * ```
   * @param point - The point to check in local coordinates
   * @returns True if the point is inside the Graphics object
   * @see {@link Graphics#bounds} For bounding box checks
   * @see {@link PointData} For point data structure
   */
  containsPoint(t) {
    return this._context.containsPoint(t);
  }
  /**
   * Destroys this graphics renderable and optionally its context.
   * @param options - Options parameter. A boolean will act as if all options
   *
   * If the context was created by this graphics and `destroy(false)` or `destroy()` is called
   * then the context will still be destroyed.
   *
   * If you want to explicitly not destroy this context that this graphics created,
   * then you should pass destroy({ context: false })
   *
   * If the context was passed in as an argument to the constructor then it will not be destroyed
   * @example
   * ```ts
   * // Destroy the graphics and its context
   * graphics.destroy();
   * graphics.destroy(true);
   * graphics.destroy({ context: true, texture: true, textureSource: true });
   * ```
   */
  destroy(t) {
    this._ownedContext && !t ? this._ownedContext.destroy(t) : (t === !0 || t?.context === !0) && this._context.destroy(t), this._ownedContext = null, this._context = null;
  }
  _callContextMethod(t, e) {
    return this.context[t](...e), this;
  }
  // --------------------------------------- GraphicsContext methods ---------------------------------------
  /**
   * Sets the current fill style of the graphics context.
   * The fill style can be a color, gradient, pattern, or a complex style object.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic color fill
   * graphics
   *     .setFillStyle({ color: 0xff0000 }) // Red fill
   *     .rect(0, 0, 100, 100)
   *     .fill();
   *
   * // Gradient fill
   * const gradient = new FillGradient({
   *    end: { x: 1, y: 0 },
   *    colorStops: [
   *         { offset: 0, color: 0xff0000 }, // Red at start
   *         { offset: 0.5, color: 0x00ff00 }, // Green at middle
   *         { offset: 1, color: 0x0000ff }, // Blue at end
   *    ],
   * });
   *
   * graphics
   *     .setFillStyle(gradient)
   *     .circle(100, 100, 50)
   *     .fill();
   *
   * // Pattern fill
   * const pattern = new FillPattern(texture);
   * graphics
   *     .setFillStyle({
   *         fill: pattern,
   *         alpha: 0.5
   *     })
   *     .rect(0, 0, 200, 200)
   *     .fill();
   * ```
   * @param {FillInput} args - The fill style to apply
   * @returns The Graphics instance for chaining
   * @see {@link FillStyle} For fill style options
   * @see {@link FillGradient} For gradient fills
   * @see {@link FillPattern} For pattern fills
   */
  setFillStyle(...t) {
    return this._callContextMethod("setFillStyle", t);
  }
  /**
   * Sets the current stroke style of the graphics context.
   * Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic color stroke
   * graphics
   *     .setStrokeStyle({
   *         width: 2,
   *         color: 0x000000
   *     })
   *     .rect(0, 0, 100, 100)
   *     .stroke();
   *
   * // Complex stroke style
   * graphics
   *     .setStrokeStyle({
   *         width: 4,
   *         color: 0xff0000,
   *         alpha: 0.5,
   *         join: 'round',
   *         cap: 'round',
   *         alignment: 0.5
   *     })
   *     .circle(100, 100, 50)
   *     .stroke();
   *
   * // Gradient stroke
   * const gradient = new FillGradient({
   *    end: { x: 1, y: 0 },
   *    colorStops: [
   *         { offset: 0, color: 0xff0000 }, // Red at start
   *         { offset: 0.5, color: 0x00ff00 }, // Green at middle
   *         { offset: 1, color: 0x0000ff }, // Blue at end
   *    ],
   * });
   *
   * graphics
   *     .setStrokeStyle({
   *         width: 10,
   *         fill: gradient
   *     })
   *     .poly([0,0, 100,50, 0,100])
   *     .stroke();
   * ```
   * @param {StrokeInput} args - The stroke style to apply
   * @returns The Graphics instance for chaining
   * @see {@link StrokeStyle} For stroke style options
   * @see {@link FillGradient} For gradient strokes
   * @see {@link FillPattern} For pattern strokes
   */
  setStrokeStyle(...t) {
    return this._callContextMethod("setStrokeStyle", t);
  }
  fill(...t) {
    return this._callContextMethod("fill", t);
  }
  /**
   * Strokes the current path with the current stroke style or specified style.
   * Outlines the shape using the stroke settings.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Stroke with direct color
   * graphics
   *     .circle(50, 50, 25)
   *     .stroke({
   *         width: 2,
   *         color: 0xff0000
   *     }); // 2px red stroke
   *
   * // Fill with texture
   * graphics
   *    .rect(0, 0, 100, 100)
   *    .stroke(myTexture); // Fill with texture
   *
   * // Stroke with gradient
   * const gradient = new FillGradient({
   *     end: { x: 1, y: 0 },
   *     colorStops: [
   *         { offset: 0, color: 0xff0000 },
   *         { offset: 0.5, color: 0x00ff00 },
   *         { offset: 1, color: 0x0000ff },
   *     ],
   * });
   *
   * graphics
   *     .rect(0, 0, 100, 100)
   *     .stroke({
   *         width: 4,
   *         fill: gradient,
   *         alignment: 0.5,
   *         join: 'round'
   *     });
   * ```
   * @param {StrokeStyle} args - Optional stroke style to apply. Can be:
   * - A stroke style object with width, color, etc.
   * - A gradient
   * - A pattern
   * If omitted, uses current stroke style.
   * @returns The Graphics instance for chaining
   * @see {@link StrokeStyle} For stroke style options
   * @see {@link FillGradient} For gradient strokes
   * @see {@link setStrokeStyle} For setting default stroke style
   */
  stroke(...t) {
    return this._callContextMethod("stroke", t);
  }
  texture(...t) {
    return this._callContextMethod("texture", t);
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @example
   * ```ts
   * const graphics = new Graphics();
   * graphics
   *     .circle(150, 150, 50)
   *     .fill({ color: 0x00ff00 })
   *     .beginPath() // Starts a new path
   *     .circle(250, 150, 50)
   *     .fill({ color: 0x0000ff });
   * ```
   * @returns The Graphics instance for chaining
   * @see {@link Graphics#moveTo} For starting a new subpath
   * @see {@link Graphics#closePath} For closing the current path
   */
  beginPath() {
    return this._callContextMethod("beginPath", []);
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path.
   *
   * If a hole is not completely in a shape, it will fail to cut correctly.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw outer circle
   * graphics
   *     .circle(100, 100, 50)
   *     .fill({ color: 0xff0000 });
   *     .circle(100, 100, 25) // Inner circle
   *     .cut() // Cuts out the inner circle from the outer circle
   * ```
   */
  cut() {
    return this._callContextMethod("cut", []);
  }
  arc(...t) {
    return this._callContextMethod("arc", t);
  }
  arcTo(...t) {
    return this._callContextMethod("arcTo", t);
  }
  arcToSvg(...t) {
    return this._callContextMethod("arcToSvg", t);
  }
  bezierCurveTo(...t) {
    return this._callContextMethod("bezierCurveTo", t);
  }
  /**
   * Closes the current path by drawing a straight line back to the start point.
   *
   * This is useful for completing shapes and ensuring they are properly closed for fills.
   * @example
   * ```ts
   * // Create a triangle with closed path
   * const graphics = new Graphics();
   * graphics
   *     .moveTo(50, 50)
   *     .lineTo(100, 100)
   *     .lineTo(0, 100)
   *     .closePath()
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#beginPath} For starting a new path
   * @see {@link Graphics#fill} For filling closed paths
   * @see {@link Graphics#stroke} For stroking paths
   */
  closePath() {
    return this._callContextMethod("closePath", []);
  }
  ellipse(...t) {
    return this._callContextMethod("ellipse", t);
  }
  circle(...t) {
    return this._callContextMethod("circle", t);
  }
  path(...t) {
    return this._callContextMethod("path", t);
  }
  lineTo(...t) {
    return this._callContextMethod("lineTo", t);
  }
  moveTo(...t) {
    return this._callContextMethod("moveTo", t);
  }
  quadraticCurveTo(...t) {
    return this._callContextMethod("quadraticCurveTo", t);
  }
  rect(...t) {
    return this._callContextMethod("rect", t);
  }
  roundRect(...t) {
    return this._callContextMethod("roundRect", t);
  }
  poly(...t) {
    return this._callContextMethod("poly", t);
  }
  regularPoly(...t) {
    return this._callContextMethod("regularPoly", t);
  }
  roundPoly(...t) {
    return this._callContextMethod("roundPoly", t);
  }
  roundShape(...t) {
    return this._callContextMethod("roundShape", t);
  }
  filletRect(...t) {
    return this._callContextMethod("filletRect", t);
  }
  chamferRect(...t) {
    return this._callContextMethod("chamferRect", t);
  }
  star(...t) {
    return this._callContextMethod("star", t);
  }
  svg(...t) {
    return this._callContextMethod("svg", t);
  }
  restore(...t) {
    return this._callContextMethod("restore", t);
  }
  /**
   * Saves the current graphics state onto a stack. The state includes:
   * - Current transformation matrix
   * - Current fill style
   * - Current stroke style
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Save state before complex operations
   * graphics.save();
   *
   * // Create transformed and styled shape
   * graphics
   *     .translateTransform(100, 100)
   *     .rotateTransform(Math.PI / 4)
   *     .setFillStyle({
   *         color: 0xff0000,
   *         alpha: 0.5
   *     })
   *     .rect(-25, -25, 50, 50)
   *     .fill();
   *
   * // Restore to original state
   * graphics.restore();
   *
   * // Continue drawing with previous state
   * graphics
   *     .circle(50, 50, 25)
   *     .fill();
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#restore} For restoring the saved state
   * @see {@link Graphics#setTransform} For setting transformations
   */
  save() {
    return this._callContextMethod("save", []);
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * This matrix represents all accumulated transformations including translate, scale, and rotate.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Apply some transformations
   * graphics
   *     .translateTransform(100, 100)
   *     .rotateTransform(Math.PI / 4);
   *
   * // Get the current transform matrix
   * const matrix = graphics.getTransform();
   * console.log(matrix.tx, matrix.ty); // 100, 100
   *
   * // Use the matrix for other operations
   * graphics
   *     .setTransform(matrix)
   *     .circle(0, 0, 50)
   *     .fill({ color: 0xff0000 });
   * ```
   * @returns The current transformation matrix.
   * @see {@link Graphics#setTransform} For setting the transform matrix
   * @see {@link Matrix} For matrix operations
   */
  getTransform() {
    return this.context.getTransform();
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing
   * any transformations (rotation, scaling, translation) previously applied.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Apply transformations
   * graphics
   *     .translateTransform(100, 100)
   *     .scaleTransform(2, 2)
   *     .circle(0, 0, 25)
   *     .fill({ color: 0xff0000 });
   * // Reset transform to default state
   * graphics
   *     .resetTransform()
   *     .circle(50, 50, 25) // Will draw at actual coordinates
   *     .fill({ color: 0x00ff00 });
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#getTransform} For getting the current transform
   * @see {@link Graphics#setTransform} For setting a specific transform
   * @see {@link Graphics#save} For saving the current transform state
   * @see {@link Graphics#restore} For restoring a previous transform state
   */
  resetTransform() {
    return this._callContextMethod("resetTransform", []);
  }
  rotateTransform(...t) {
    return this._callContextMethod("rotate", t);
  }
  scaleTransform(...t) {
    return this._callContextMethod("scale", t);
  }
  setTransform(...t) {
    return this._callContextMethod("setTransform", t);
  }
  transform(...t) {
    return this._callContextMethod("transform", t);
  }
  translateTransform(...t) {
    return this._callContextMethod("translate", t);
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it.
   * This includes clearing the current path, fill style, stroke style, and transformations.
   *
   * > [!NOTE] Graphics objects are not designed to be continuously cleared and redrawn.
   * > Instead, they are intended to be used for static or semi-static graphics that
   * > can be redrawn as needed. Frequent clearing and redrawing may lead to performance issues.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Draw some shapes
   * graphics
   *     .circle(100, 100, 50)
   *     .fill({ color: 0xff0000 })
   *     .rect(200, 100, 100, 50)
   *     .fill({ color: 0x00ff00 });
   *
   * // Clear all graphics
   * graphics.clear();
   *
   * // Start fresh with new shapes
   * graphics
   *     .circle(150, 150, 30)
   *     .fill({ color: 0x0000ff });
   * ```
   * @returns The Graphics instance for method chaining
   * @see {@link Graphics#beginPath} For starting a new path without clearing styles
   * @see {@link Graphics#save} For saving the current state
   * @see {@link Graphics#restore} For restoring a previous state
   */
  clear() {
    return this._callContextMethod("clear", []);
  }
  /**
   * Gets or sets the current fill style for the graphics context. The fill style determines
   * how shapes are filled when using the fill() method.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic color fill
   * graphics.fillStyle = {
   *     color: 0xff0000,  // Red
   *     alpha: 1
   * };
   *
   * // Using gradients
   * const gradient = new FillGradient({
   *     end: { x: 0, y: 1 }, // Vertical gradient
   *     stops: [
   *         { offset: 0, color: 0xff0000, alpha: 1 }, // Start color
   *         { offset: 1, color: 0x0000ff, alpha: 1 }  // End color
   *     ]
   * });
   *
   * graphics.fillStyle = {
   *     fill: gradient,
   *     alpha: 0.8
   * };
   *
   * // Using patterns
   * graphics.fillStyle = {
   *     texture: myTexture,
   *     alpha: 1,
   *     matrix: new Matrix()
   *         .scale(0.5, 0.5)
   *         .rotate(Math.PI / 4)
   * };
   * ```
   * @type {ConvertedFillStyle}
   * @see {@link FillStyle} For all available fill style options
   * @see {@link FillGradient} For creating gradient fills
   * @see {@link Graphics#fill} For applying the fill to paths
   */
  get fillStyle() {
    return this._context.fillStyle;
  }
  set fillStyle(t) {
    this._context.fillStyle = t;
  }
  /**
   * Gets or sets the current stroke style for the graphics context. The stroke style determines
   * how paths are outlined when using the stroke() method.
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Basic stroke style
   * graphics.strokeStyle = {
   *     width: 2,
   *     color: 0xff0000,
   *     alpha: 1
   * };
   *
   * // Using with gradients
   * const gradient = new FillGradient({
   *   end: { x: 0, y: 1 },
   *   stops: [
   *       { offset: 0, color: 0xff0000, alpha: 1 },
   *       { offset: 1, color: 0x0000ff, alpha: 1 }
   *   ]
   * });
   *
   * graphics.strokeStyle = {
   *     width: 4,
   *     fill: gradient,
   *     alignment: 0.5,
   *     join: 'round',
   *     cap: 'round'
   * };
   *
   * // Complex stroke settings
   * graphics.strokeStyle = {
   *     width: 6,
   *     color: 0x00ff00,
   *     alpha: 0.5,
   *     join: 'miter',
   *     miterLimit: 10,
   * };
   * ```
   * @see {@link StrokeStyle} For all available stroke style options
   * @see {@link Graphics#stroke} For applying the stroke to paths
   */
  get strokeStyle() {
    return this._context.strokeStyle;
  }
  set strokeStyle(t) {
    this._context.strokeStyle = t;
  }
  /**
   * Creates a new Graphics object that copies the current graphics content.
   * The clone can either share the same context (shallow clone) or have its own independent
   * context (deep clone).
   * @example
   * ```ts
   * const graphics = new Graphics();
   *
   * // Create original graphics content
   * graphics
   *     .circle(100, 100, 50)
   *     .fill({ color: 0xff0000 });
   *
   * // Create a shallow clone (shared context)
   * const shallowClone = graphics.clone();
   *
   * // Changes to original affect the clone
   * graphics
   *     .circle(200, 100, 30)
   *     .fill({ color: 0x00ff00 });
   *
   * // Create a deep clone (independent context)
   * const deepClone = graphics.clone(true);
   *
   * // Modify deep clone independently
   * deepClone
   *     .translateTransform(100, 100)
   *     .circle(0, 0, 40)
   *     .fill({ color: 0x0000ff });
   * ```
   * @param deep - Whether to create a deep clone of the graphics object.
   *              If false (default), the context will be shared between objects.
   *              If true, creates an independent copy of the context.
   * @returns A new Graphics instance with either shared or copied context
   * @see {@link Graphics#context} For accessing the underlying graphics context
   * @see {@link GraphicsContext} For understanding the shared context behavior
   */
  clone(t = !1) {
    return t ? new Re(this._context.clone()) : (this._ownedContext = null, new Re(this._context));
  }
  // -------- v7 deprecations ---------
  /**
   * @param width
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#setStrokeStyle} instead
   */
  lineStyle(t, e, s) {
    q(z, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
    const n = {};
    return t && (n.width = t), e && (n.color = e), s && (n.alpha = s), this.context.strokeStyle = n, this;
  }
  /**
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  beginFill(t, e) {
    q(z, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
    const s = {};
    return t !== void 0 && (s.color = t), e !== void 0 && (s.alpha = e), this.context.fillStyle = s, this;
  }
  /**
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  endFill() {
    q(z, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
    const t = this.context.strokeStyle;
    return (t.width !== $.defaultStrokeStyle.width || t.color !== $.defaultStrokeStyle.color || t.alpha !== $.defaultStrokeStyle.alpha) && this.context.stroke(), this;
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#circle} instead
   */
  drawCircle(...t) {
    return q(z, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#ellipse} instead
   */
  drawEllipse(...t) {
    return q(z, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#poly} instead
   */
  drawPolygon(...t) {
    return q(z, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#rect} instead
   */
  drawRect(...t) {
    return q(z, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#roundRect} instead
   */
  drawRoundedRect(...t) {
    return q(z, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#star} instead
   */
  drawStar(...t) {
    return q(z, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", t);
  }
}
const Kn = new N(), Qn = new H();
function Xr(i, t, e, s) {
  const n = t.matrix ? i.copyFrom(t.matrix).invert() : i.identity();
  if (t.textureSpace === "local") {
    const o = e.getBounds(Qn);
    t.width && o.pad(t.width);
    const { x: a, y: h } = o, c = 1 / o.width, l = 1 / o.height, u = -a * c, f = -h * l, d = n.a, p = n.b, m = n.c, y = n.d;
    n.a *= c, n.b *= c, n.c *= l, n.d *= l, n.tx = u * d + f * m + n.tx, n.ty = u * p + f * y + n.ty;
  } else
    n.translate(t.texture.frame.x, t.texture.frame.y), n.scale(1 / t.texture.source.width, 1 / t.texture.source.height);
  const r = t.texture.source.style;
  return !(t.fill instanceof ot) && r.addressMode === "clamp-to-edge" && (r.addressMode = "repeat", r.update()), s && n.append(Kn.copyFrom(s).invert()), n;
}
class Jn {
  canvasOptions;
  /**
   * Allow renderTextures of the same size as screen, not just pow2
   *
   * Automatically sets to true after `setScreenSize`
   * @default false
   */
  enableFullScreen;
  _canvasPool;
  constructor(t) {
    this._canvasPool = /* @__PURE__ */ Object.create(null), this.canvasOptions = t || {}, this.enableFullScreen = !1;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   */
  _createCanvasAndContext(t, e) {
    const s = J.get().createCanvas();
    s.width = t, s.height = e;
    const n = s.getContext("2d");
    return { canvas: s, context: n };
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture.
   * @param minHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @returns The new render texture.
   */
  getOptimalCanvasAndContext(t, e, s = 1) {
    t = Math.ceil(t * s - 1e-6), e = Math.ceil(e * s - 1e-6), t = wt(t), e = wt(e);
    const n = (t << 17) + (e << 1);
    this._canvasPool[n] || (this._canvasPool[n] = []);
    let r = this._canvasPool[n].pop();
    return r || (r = this._createCanvasAndContext(t, e)), r;
  }
  /**
   * Place a render texture back into the pool.
   * @param canvasAndContext
   */
  returnCanvasAndContext(t) {
    const e = t.canvas, { width: s, height: n } = e, r = (s << 17) + (n << 1);
    t.context.resetTransform(), t.context.clearRect(0, 0, s, n), this._canvasPool[r].push(t);
  }
  clear() {
    this._canvasPool = {};
  }
}
const Yr = new Jn();
var Le = /* @__PURE__ */ ((i) => (i.CLAMP = "clamp-to-edge", i.REPEAT = "repeat", i.MIRRORED_REPEAT = "mirror-repeat", i))(Le || {});
const Ur = new Proxy(Le, {
  get(i, t) {
    return q(z, `DRAW_MODES.${t} is deprecated, use '${Le[t]}' instead`), i[t];
  }
});
var Be = /* @__PURE__ */ ((i) => (i.NEAREST = "nearest", i.LINEAR = "linear", i))(Be || {});
const Dr = new Proxy(Be, {
  get(i, t) {
    return q(z, `DRAW_MODES.${t} is deprecated, use '${Be[t]}' instead`), i[t];
  }
});
class Js extends O {
  static create(t) {
    return new Js({
      source: new j(t)
    });
  }
  /**
   * Resizes the render texture.
   * @param width - The new width of the render texture.
   * @param height - The new height of the render texture.
   * @param resolution - The new resolution of the render texture.
   * @returns This texture.
   */
  resize(t, e, s) {
    return this.source.resize(t, e, s), this;
  }
}
class tr extends j {
  static extension = "ExtensionType.TextureSource";
  uploadMethodId = "image";
  autoDensity;
  transparent;
  _context2D;
  constructor(t) {
    t.resource || (t.resource = J.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.autoDensity = t.autoDensity, this.resizeCanvas(), this.transparent = !!t.transparent;
  }
  resizeCanvas() {
    this.autoDensity && "style" in this.resource && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
  }
  resize(t = this.width, e = this.height, s = this._resolution) {
    const n = super.resize(t, e, s);
    return n && this.resizeCanvas(), n;
  }
  static test(t) {
    return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && t instanceof OffscreenCanvas;
  }
  /**
   * Returns the 2D rendering context for the canvas.
   * Caches the context after creating it.
   * @returns The 2D rendering context of the canvas.
   */
  get context2D() {
    return this._context2D || (this._context2D = this.resource.getContext("2d"));
  }
}
class Or extends j {
  uploadMethodId = "compressed";
  constructor(t) {
    super(t), this.resource = t.resource, this.mipLevelCount = this.resource.length;
  }
}
let ws;
async function er() {
  return ws ??= (async () => {
    const t = J.get().createCanvas(1, 1).getContext("webgl");
    if (!t)
      return "premultiply-alpha-on-upload";
    const e = await new Promise((o) => {
      const a = document.createElement("video");
      a.onloadeddata = () => o(a), a.onerror = () => o(null), a.autoplay = !1, a.crossOrigin = "anonymous", a.preload = "auto", a.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", a.load();
    });
    if (!e)
      return "premultiply-alpha-on-upload";
    const s = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, s);
    const n = t.createFramebuffer();
    t.bindFramebuffer(t.FRAMEBUFFER, n), t.framebufferTexture2D(
      t.FRAMEBUFFER,
      t.COLOR_ATTACHMENT0,
      t.TEXTURE_2D,
      s,
      0
    ), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
    const r = new Uint8Array(4);
    return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, r), t.deleteFramebuffer(n), t.deleteTexture(s), t.getExtension("WEBGL_lose_context")?.loseContext(), r[0] <= r[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })(), ws;
}
class ti extends j {
  static extension = "ExtensionType.TextureSource";
  /** The default options for video sources. */
  static defaultOptions = {
    ...j.defaultOptions,
    /** If true, the video will start loading immediately. */
    autoLoad: !0,
    /** If true, the video will start playing as soon as it is loaded. */
    autoPlay: !0,
    /** The number of times a second to update the texture from the video. Leave at 0 to update at every render. */
    updateFPS: 0,
    /** If true, the video will be loaded with the `crossorigin` attribute. */
    crossorigin: !0,
    /** If true, the video will loop when it ends. */
    loop: !1,
    /** If true, the video will be muted. */
    muted: !0,
    /** If true, the video will play inline. */
    playsinline: !0,
    /** If true, the video will be preloaded. */
    preload: !1
  };
  // Public
  /** Whether or not the video is ready to play. */
  isReady = !1;
  /** The upload method for this texture. */
  uploadMethodId = "video";
  // Protected
  /**
   * When set to true will automatically play videos used by this texture once
   * they are loaded. If false, it will not modify the playing state.
   * @default true
   */
  autoPlay;
  // Private
  /**
   * `true` to use Ticker.shared to auto update the base texture.
   * @default true
   */
  _autoUpdate;
  /**
   * `true` if the instance is currently connected to Ticker.shared to auto update the base texture.
   * @default false
   */
  _isConnectedToTicker;
  /**
   * Promise when loading.
   * @default null
   */
  _load;
  _msToNextUpdate;
  _preloadTimeout;
  /** Callback when completed with load. */
  _resolve;
  _reject;
  _updateFPS;
  _videoFrameRequestCallbackHandle;
  constructor(t) {
    super(t), t = {
      ...ti.defaultOptions,
      ...t
    }, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), t.autoLoad !== !1 && this.load();
  }
  /** Update the video frame if the source is not destroyed and meets certain conditions. */
  updateFrame() {
    if (!this.destroyed) {
      if (this._updateFPS) {
        const t = U.shared.elapsedMS * this.resource.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - t);
      }
      (!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update();
    }
  }
  /** Callback to update the video frame and potentially request the next frame update. */
  _videoFrameRequestCallback() {
    this.updateFrame(), this.destroyed ? this._videoFrameRequestCallbackHandle = null : this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    );
  }
  /**
   * Checks if the resource has valid dimensions.
   * @returns {boolean} True if width and height are set, otherwise false.
   */
  get isValid() {
    return !!this.resource.videoWidth && !!this.resource.videoHeight;
  }
  /**
   * Start preloading the video resource.
   * @returns {Promise<this>} Handle the validate event
   */
  async load() {
    if (this._load)
      return this._load;
    const t = this.resource, e = this.options;
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.alphaMode = await er(), this._load = new Promise((s, n) => {
      this.isValid ? s(this) : (this._resolve = s, this._reject = n, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
        this._onError(new ErrorEvent(`Preload exceeded timeout of ${e.preloadTimeoutMs}ms`));
      })), t.load());
    }), this._load;
  }
  /**
   * Handle video error events.
   * @param event - The error event
   */
  _onError(t) {
    this.resource.removeEventListener("error", this._onError, !0), this.emit("error", t), this._reject && (this._reject(t), this._reject = null, this._resolve = null);
  }
  /**
   * Checks if the underlying source is playing.
   * @returns True if playing.
   */
  _isSourcePlaying() {
    const t = this.resource;
    return !t.paused && !t.ended;
  }
  /**
   * Checks if the underlying source is ready for playing.
   * @returns True if ready.
   */
  _isSourceReady() {
    return this.resource.readyState > 2;
  }
  /** Runs the update loop when the video is ready to play. */
  _onPlayStart() {
    this.isValid || this._mediaReady(), this._configureAutoUpdate();
  }
  /** Stops the update loop when a pause event is triggered. */
  _onPlayStop() {
    this._configureAutoUpdate();
  }
  /** Handles behavior when the video completes seeking to the current playback position. */
  _onSeeked() {
    this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0);
  }
  _onCanPlay() {
    this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady();
  }
  _onCanPlayThrough() {
    this.resource.removeEventListener("canplaythrough", this._onCanPlay), this._preloadTimeout && (clearTimeout(this._preloadTimeout), this._preloadTimeout = void 0), this._mediaReady();
  }
  /** Fired when the video is loaded and ready to play. */
  _mediaReady() {
    const t = this.resource;
    this.isValid && (this.isReady = !0, this.resize(t.videoWidth, t.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play();
  }
  /** Cleans up resources and event listeners associated with this texture. */
  destroy() {
    this._configureAutoUpdate();
    const t = this.resource;
    t && (t.removeEventListener("play", this._onPlayStart), t.removeEventListener("pause", this._onPlayStop), t.removeEventListener("seeked", this._onSeeked), t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlayThrough), t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), super.destroy();
  }
  /** Should the base texture automatically update itself, set to true by default. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(t) {
    t !== this._autoUpdate && (this._autoUpdate = t, this._configureAutoUpdate());
  }
  /**
   * How many times a second to update the texture from the video.
   * Leave at 0 to update at every render.
   * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
   */
  get updateFPS() {
    return this._updateFPS;
  }
  set updateFPS(t) {
    t !== this._updateFPS && (this._updateFPS = t, this._configureAutoUpdate());
  }
  /**
   * Configures the updating mechanism based on the current state and settings.
   *
   * This method decides between using the browser's native video frame callback or a custom ticker
   * for updating the video frame. It ensures optimal performance and responsiveness
   * based on the video's state, playback status, and the desired frames-per-second setting.
   *
   * - If `_autoUpdate` is enabled and the video source is playing:
   *   - It will prefer the native video frame callback if available and no specific FPS is set.
   *   - Otherwise, it will use a custom ticker for manual updates.
   * - If `_autoUpdate` is disabled or the video isn't playing, any active update mechanisms are halted.
   */
  _configureAutoUpdate() {
    this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (U.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    ))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (U.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (U.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
  }
  /**
   * Map of video MIME types that can't be directly derived from file extensions.
   * @readonly
   */
  static MIME_TYPES = {
    ogv: "video/ogg",
    mov: "video/quicktime",
    m4v: "video/mp4"
  };
  static test(t) {
    return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement;
  }
}
class ei {
  /** @ignore */
  static extension = {
    type: [
      "ExtensionType.WebGLSystem",
      "ExtensionType.WebGPUSystem"
    ],
    name: "textureGC"
  };
  /** default options for the TextureGCSystem */
  static defaultOptions = {
    /**
     * If set to true, this will enable the garbage collector on the GPU.
     * @default true
     */
    textureGCActive: !0,
    /**
     * @deprecated since 8.3.0
     * @see {@link TextureGCSystemOptions.textureGCMaxIdle}
     */
    textureGCAMaxIdle: null,
    /**
     * The maximum idle frames before a texture is destroyed by garbage collection.
     * @default 60 * 60
     */
    textureGCMaxIdle: 3600,
    /**
     * Frames between two garbage collections.
     * @default 600
     */
    textureGCCheckCountMax: 600
  };
  /**
   * Frame count since started.
   * @readonly
   */
  count;
  /**
   * Frame count since last garbage collection.
   * @readonly
   */
  checkCount;
  /**
   * Maximum idle frames before a texture is destroyed by garbage collection.
   * @see TextureGCSystem.defaultMaxIdle
   */
  maxIdle;
  /**
   * Frames between two garbage collections.
   * @see TextureGCSystem.defaultCheckCountMax
   */
  checkCountMax;
  /**
   * Current garbage collection mode.
   * @see TextureGCSystem.defaultMode
   */
  active;
  _renderer;
  /** @param renderer - The renderer this System works for. */
  constructor(t) {
    this._renderer = t, this.count = 0, this.checkCount = 0;
  }
  init(t) {
    t = { ...ei.defaultOptions, ...t }, this.checkCountMax = t.textureGCCheckCountMax, this.maxIdle = t.textureGCAMaxIdle ?? t.textureGCMaxIdle, this.active = t.textureGCActive;
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  postrender() {
    this._renderer.renderingToScreen && (this.count++, this.active && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  run() {
    const t = this._renderer.texture.managedTextures;
    for (let e = 0; e < t.length; e++) {
      const s = t[e];
      s.autoGarbageCollect && s.resource && s._touched > -1 && this.count - s._touched > this.maxIdle && (s._touched = -1, s.unload());
    }
  }
  destroy() {
    this._renderer = null;
  }
}
let sr = 0;
class ir {
  /** The default options for texture pool */
  textureOptions;
  /** The default texture style for the pool */
  textureStyle;
  /**
   * Allow renderTextures of the same size as screen, not just pow2
   *
   * Automatically sets to true after `setScreenSize`
   * @default false
   */
  enableFullScreen;
  _texturePool;
  _poolKeyHash = /* @__PURE__ */ Object.create(null);
  /**
   * @param textureOptions - options that will be passed to BaseRenderTexture constructor
   * @param {SCALE_MODE} [textureOptions.scaleMode] - See {@link SCALE_MODE} for possible values.
   */
  constructor(t) {
    this._texturePool = {}, this.textureOptions = t || {}, this.enableFullScreen = !1, this.textureStyle = new fe(this.textureOptions);
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   * @param antialias
   */
  createTexture(t, e, s) {
    const n = new j({
      ...this.textureOptions,
      width: t,
      height: e,
      resolution: 1,
      antialias: s,
      autoGarbageCollect: !1
    });
    return new O({
      source: n,
      label: `texturePool_${sr++}`
    });
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param frameWidth - The minimum width of the render texture.
   * @param frameHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @param antialias
   * @returns The new render texture.
   */
  getOptimalTexture(t, e, s = 1, n) {
    let r = Math.ceil(t * s - 1e-6), o = Math.ceil(e * s - 1e-6);
    r = wt(r), o = wt(o);
    const a = (r << 17) + (o << 1) + (n ? 1 : 0);
    this._texturePool[a] || (this._texturePool[a] = []);
    let h = this._texturePool[a].pop();
    return h || (h = this.createTexture(r, o, n)), h.source._resolution = s, h.source.width = r / s, h.source.height = o / s, h.source.pixelWidth = r, h.source.pixelHeight = o, h.frame.x = 0, h.frame.y = 0, h.frame.width = t, h.frame.height = e, h.updateUvs(), this._poolKeyHash[h.uid] = a, h;
  }
  /**
   * Gets extra texture of the same size as input renderTexture
   * @param texture - The texture to check what size it is.
   * @param antialias - Whether to use antialias.
   * @returns A texture that is a power of two
   */
  getSameSizeTexture(t, e = !1) {
    const s = t.source;
    return this.getOptimalTexture(t.width, t.height, s._resolution, e);
  }
  /**
   * Place a render texture back into the pool. Optionally reset the style of the texture to the default texture style.
   * useful if you modified the style of the texture after getting it from the pool.
   * @param renderTexture - The renderTexture to free
   * @param resetStyle - Whether to reset the style of the texture to the default texture style
   */
  returnTexture(t, e = !1) {
    const s = this._poolKeyHash[t.uid];
    e && (t.source.style = this.textureStyle), this._texturePool[s].push(t);
  }
  /**
   * Clears the pool.
   * @param destroyTextures - Destroy all stored textures.
   */
  clear(t) {
    if (t = t !== !1, t)
      for (const e in this._texturePool) {
        const s = this._texturePool[e];
        if (s)
          for (let n = 0; n < s.length; n++)
            s[n].destroy(!0);
      }
    this._texturePool = {};
  }
}
const Nr = new ir();
class Hr {
  /** X-component of top-left corner `(x0,y0)`. */
  x0;
  /** Y-component of top-left corner `(x0,y0)`. */
  y0;
  /** X-component of top-right corner `(x1,y1)`. */
  x1;
  /** Y-component of top-right corner `(x1,y1)`. */
  y1;
  /** X-component of bottom-right corner `(x2,y2)`. */
  x2;
  /** Y-component of bottom-right corner `(x2,y2)`. */
  y2;
  /** X-component of bottom-left corner `(x3,y3)`. */
  x3;
  /** Y-component of bottom-right corner `(x3,y3)`. */
  y3;
  uvsFloat32;
  constructor() {
    this.x0 = 0, this.y0 = 0, this.x1 = 1, this.y1 = 0, this.x2 = 1, this.y2 = 1, this.x3 = 0, this.y3 = 1, this.uvsFloat32 = new Float32Array(8);
  }
  /**
   * Sets the texture Uvs based on the given frame information.
   * @protected
   * @param frame - The frame of the texture
   * @param baseFrame - The base frame of the texture
   * @param rotate - Rotation of frame, see {@link groupD8}
   */
  set(t, e, s) {
    const n = e.width, r = e.height;
    if (s) {
      const o = t.width / 2 / n, a = t.height / 2 / r, h = t.x / n + o, c = t.y / r + a;
      s = S.add(s, S.NW), this.x0 = h + o * S.uX(s), this.y0 = c + a * S.uY(s), s = S.add(s, 2), this.x1 = h + o * S.uX(s), this.y1 = c + a * S.uY(s), s = S.add(s, 2), this.x2 = h + o * S.uX(s), this.y2 = c + a * S.uY(s), s = S.add(s, 2), this.x3 = h + o * S.uX(s), this.y3 = c + a * S.uY(s);
    } else
      this.x0 = t.x / n, this.y0 = t.y / r, this.x1 = (t.x + t.width) / n, this.y1 = t.y / r, this.x2 = (t.x + t.width) / n, this.y2 = (t.y + t.height) / r, this.x3 = t.x / n, this.y3 = (t.y + t.height) / r;
    this.uvsFloat32[0] = this.x0, this.uvsFloat32[1] = this.y0, this.uvsFloat32[2] = this.x1, this.uvsFloat32[3] = this.y1, this.uvsFloat32[4] = this.x2, this.uvsFloat32[5] = this.y2, this.uvsFloat32[6] = this.x3, this.uvsFloat32[7] = this.y3;
  }
  // #if _DEBUG
  toString() {
    return `[pixi.js/core:TextureUvs x0=${this.x0} y0=${this.y0} x1=${this.x1} y1=${this.y1} x2=${this.x2} y2=${this.y2} x3=${this.x3} y3=${this.y3}]`;
  }
  // #endif
}
const xt = /* @__PURE__ */ new Map();
function $r(i, t) {
  if (!xt.has(i)) {
    const e = new O({
      source: new tr({
        resource: i,
        ...t
      })
    }), s = () => {
      xt.get(i) === e && xt.delete(i);
    };
    e.once("destroy", s), e.source.once("destroy", s), xt.set(i, e);
  }
  return xt.get(i);
}
function Wr(i) {
  return xt.has(i);
}
async function nr() {
  return [];
}
const rr = [
  // 8-bit formats
  "r8unorm",
  "r8snorm",
  "r8uint",
  "r8sint",
  // 16-bit formats
  "r16uint",
  "r16sint",
  "r16float",
  "rg8unorm",
  "rg8snorm",
  "rg8uint",
  "rg8sint",
  // 32-bit formats
  "r32uint",
  "r32sint",
  "r32float",
  "rg16uint",
  "rg16sint",
  "rg16float",
  "rgba8unorm",
  "rgba8unorm-srgb",
  "rgba8snorm",
  "rgba8uint",
  "rgba8sint",
  "bgra8unorm",
  "bgra8unorm-srgb",
  // Packed 32-bit formats
  "rgb9e5ufloat",
  "rgb10a2unorm",
  "rg11b10ufloat",
  // 64-bit formats
  "rg32uint",
  "rg32sint",
  "rg32float",
  "rgba16uint",
  "rgba16sint",
  "rgba16float",
  // 128-bit formats
  "rgba32uint",
  "rgba32sint",
  "rgba32float",
  // Depth/stencil formats
  "stencil8",
  "depth16unorm",
  "depth24plus",
  "depth24plus-stencil8",
  "depth32float",
  // "depth32float-stencil8" feature
  "depth32float-stencil8"
];
let se;
async function Vr() {
  if (se !== void 0) return se;
  const i = await nr();
  return se = [
    ...rr,
    ...i
  ], se;
}
const _t = (i, t, e = !1) => (Array.isArray(i) || (i = [i]), t ? i.map((s) => typeof s == "string" || e ? t(s) : s) : i);
class or {
  _parsers = [];
  _cache = /* @__PURE__ */ new Map();
  _cacheMap = /* @__PURE__ */ new Map();
  /** Clear all entries. */
  reset() {
    this._cacheMap.clear(), this._cache.clear();
  }
  /**
   * Check if the key exists
   * @param key - The key to check
   */
  has(t) {
    return this._cache.has(t);
  }
  /**
   * Fetch entry by key
   * @param key - The key of the entry to get
   */
  get(t) {
    const e = this._cache.get(t);
    return e || vt(`[Assets] Asset id ${t} was not found in the Cache`), e;
  }
  /**
   * Set a value by key or keys name
   * @param key - The key or keys to set
   * @param value - The value to store in the cache or from which cacheable assets will be derived.
   */
  set(t, e) {
    const s = _t(t);
    let n;
    for (let h = 0; h < this.parsers.length; h++) {
      const c = this.parsers[h];
      if (c.test(e)) {
        n = c.getCacheableAssets(s, e);
        break;
      }
    }
    const r = new Map(Object.entries(n || {}));
    n || s.forEach((h) => {
      r.set(h, e);
    });
    const o = [...r.keys()], a = {
      cacheKeys: o,
      keys: s
    };
    s.forEach((h) => {
      this._cacheMap.set(h, a);
    }), o.forEach((h) => {
      const c = n ? n[h] : e;
      this._cache.has(h) && this._cache.get(h) !== c && vt("[Cache] already has key:", h), this._cache.set(h, r.get(h));
    });
  }
  /**
   * Remove entry by key
   *
   * This function will also remove any associated alias from the cache also.
   * @param key - The key of the entry to remove
   */
  remove(t) {
    if (!this._cacheMap.has(t)) {
      vt(`[Assets] Asset id ${t} was not found in the Cache`);
      return;
    }
    const e = this._cacheMap.get(t);
    e.cacheKeys.forEach((n) => {
      this._cache.delete(n);
    }), e.keys.forEach((n) => {
      this._cacheMap.delete(n);
    });
  }
  /**
   * All loader parsers registered
   * @advanced
   */
  get parsers() {
    return this._parsers;
  }
}
const bt = new or(), Xe = [];
Us.handleByList("ExtensionType.TextureSource", Xe);
function Gr(i = {}) {
  return Ne(i);
}
function Ne(i = {}) {
  const t = i && i.resource, e = t ? i.resource : i, s = t ? i : { resource: i };
  for (let n = 0; n < Xe.length; n++) {
    const r = Xe[n];
    if (r.test(e))
      return new r(s);
  }
  throw new Error(`Could not find a source type for resource: ${s.resource}`);
}
function ar(i = {}, t = !1) {
  const e = i && i.resource, s = e ? i.resource : i, n = e ? i : { resource: i };
  if (!t && bt.has(s))
    return bt.get(s);
  const r = new O({ source: Ne(n) });
  return r.on("destroy", () => {
    bt.has(s) && bt.remove(s);
  }), t || bt.set(s, r), r;
}
function hr(i, t = !1) {
  return typeof i == "string" ? bt.get(i) : i instanceof j ? new O({ source: i }) : ar(i, t);
}
O.from = hr;
j.from = Ne;
function qr() {
  const { userAgent: i } = J.get().getNavigator();
  return /^((?!chrome|android).)*safari/i.test(i);
}
let ie;
function jr(i) {
  return ie !== void 0 || (ie = (() => {
    const t = {
      stencil: !0,
      failIfMajorPerformanceCaveat: i
    };
    try {
      if (!J.get().getWebGLRenderingContext())
        return !1;
      let s = J.get().createCanvas().getContext("webgl", t);
      const n = !!s?.getContextAttributes()?.stencil;
      if (s) {
        const r = s.getExtension("WEBGL_lose_context");
        r && r.loseContext();
      }
      return s = null, n;
    } catch {
      return !1;
    }
  })()), ie;
}
let ne;
async function zr(i = {}) {
  return ne !== void 0 || (ne = await (async () => {
    const t = J.get().getNavigator().gpu;
    if (!t)
      return !1;
    try {
      return await (await t.requestAdapter(i)).requestDevice(), !0;
    } catch {
      return !1;
    }
  })()), ne;
}
let Rt;
function Zr() {
  if (typeof Rt == "boolean")
    return Rt;
  try {
    Rt = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
  } catch {
    Rt = !1;
  }
  return Rt;
}
let dt = null, st = null;
function lr(i, t) {
  dt || (dt = J.get().createCanvas(256, 128), st = dt.getContext("2d", { willReadFrequently: !0 }), st.globalCompositeOperation = "copy", st.globalAlpha = 1), (dt.width < i || dt.height < t) && (dt.width = wt(i), dt.height = wt(t));
}
function Ps(i, t, e) {
  for (let s = 0, n = 4 * e * t; s < t; ++s, n += 4)
    if (i[n + 3] !== 0) return !1;
  return !0;
}
function Ms(i, t, e, s, n) {
  const r = 4 * t;
  for (let o = s, a = s * r + 4 * e; o <= n; ++o, a += r)
    if (i[a + 3] !== 0) return !1;
  return !0;
}
function Kr(...i) {
  let t = i[0];
  t.canvas || (t = { canvas: i[0], resolution: i[1] });
  const { canvas: e } = t, s = Math.min(t.resolution ?? 1, 1), n = t.width ?? e.width, r = t.height ?? e.height;
  let o = t.output;
  if (lr(n, r), !st)
    throw new TypeError("Failed to get canvas 2D context");
  st.drawImage(
    e,
    0,
    0,
    n,
    r,
    0,
    0,
    n * s,
    r * s
  );
  const h = st.getImageData(0, 0, n, r).data;
  let c = 0, l = 0, u = n - 1, f = r - 1;
  for (; l < r && Ps(h, n, l); ) ++l;
  if (l === r) return H.EMPTY;
  for (; Ps(h, n, f); ) --f;
  for (; Ms(h, n, c, l, f); ) ++c;
  for (; Ms(h, n, u, l, f); ) --u;
  return ++u, ++f, st.globalCompositeOperation = "source-over", st.strokeRect(c, l, u - c, f - l), st.globalCompositeOperation = "copy", o ??= new H(), o.set(c / s, l / s, (u - c) / s, (f - l) / s), o;
}
const Qr = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i, Es = "$_VERSION";
function Jr(i) {
  let t = !1;
  for (const s in i)
    if (i[s] == null) {
      t = !0;
      break;
    }
  if (!t) return i;
  const e = /* @__PURE__ */ Object.create(null);
  for (const s in i) {
    const n = i[s];
    n && (e[s] = n);
  }
  return e;
}
function to(i) {
  let t = 0;
  for (let e = 0; e < i.length; e++)
    i[e] == null ? t++ : i[e - t] = i[e];
  return i.length -= t, i;
}
function eo(i, t, e) {
  const s = i.length;
  let n;
  if (t >= s || e === 0)
    return;
  e = t + e > s ? s - t : e;
  const r = s - e;
  for (n = t; n < r; ++n)
    i[n] = i[n + e];
  i.length = r;
}
function so(i, t, e) {
  const { width: s, height: n } = e.orig, r = e.trim;
  if (r) {
    const o = r.width, a = r.height;
    i.minX = r.x - t._x * s, i.maxX = i.minX + o, i.minY = r.y - t._y * n, i.maxY = i.minY + a;
  } else
    i.minX = -t._x * s, i.maxX = i.minX + s, i.minY = -t._y * n, i.maxY = i.minY + n;
}
class io {
  /** The size of the buffer in bytes. */
  size;
  /** Underlying `ArrayBuffer` that holds all the data and is of capacity `this.size`. */
  rawBinaryData;
  /** View on the raw binary data as a `Uint32Array`. */
  uint32View;
  /** View on the raw binary data as a `Float32Array`. */
  float32View;
  /** View on the raw binary data as a `Uint16Array`. */
  uint16View;
  _int8View;
  _uint8View;
  _int16View;
  _int32View;
  _float64Array;
  _bigUint64Array;
  constructor(t) {
    typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength;
  }
  /** View on the raw binary data as a `Int8Array`. */
  get int8View() {
    return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
  }
  /** View on the raw binary data as a `Uint8Array`. */
  get uint8View() {
    return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
  }
  /**  View on the raw binary data as a `Int16Array`. */
  get int16View() {
    return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
  }
  /** View on the raw binary data as a `Int32Array`. */
  get int32View() {
    return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
  }
  /** View on the raw binary data as a `Float64Array`. */
  get float64View() {
    return this._float64Array || (this._float64Array = new Float64Array(this.rawBinaryData)), this._float64Array;
  }
  /** View on the raw binary data as a `BigUint64Array`. */
  get bigUint64View() {
    return this._bigUint64Array || (this._bigUint64Array = new BigUint64Array(this.rawBinaryData)), this._bigUint64Array;
  }
  /**
   * Returns the view of the given type.
   * @param type - One of `int8`, `uint8`, `int16`,
   *    `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - typed array of given type
   */
  view(t) {
    return this[`${t}View`];
  }
  /** Destroys all buffer references. Do not use after calling this. */
  destroy() {
    this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this.uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
  }
  /**
   * Returns the size of the given type in bytes.
   * @param type - One of `int8`, `uint8`, `int16`,
   *   `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - size of the type in bytes
   */
  static sizeOf(t) {
    switch (t) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
      case "float32":
        return 4;
      default:
        throw new Error(`${t} isn't a valid view type`);
    }
  }
}
class no {
  /**
   * The local transformation matrix.
   * @internal
   */
  _matrix;
  /**
   * The coordinate of the object relative to the local coordinates of the parent.
   * @example
   * ```ts
   * // Basic position setting
   * transform.position.set(100, 100);
   *
   * // Individual coordinate access
   * transform.position.x = 50;
   * transform.position.y = 75;
   * ```
   */
  position;
  /**
   * The scale factor of the object.
   * @example
   * ```ts
   * // Uniform scaling
   * transform.scale.set(2, 2);
   *
   * // Non-uniform scaling
   * transform.scale.x = 2; // Stretch horizontally
   * transform.scale.y = 0.5; // Compress vertically
   * ```
   */
  scale;
  /**
   * The pivot point of the container that it rotates around.
   * @example
   * ```ts
   * // Center pivot
   * transform.pivot.set(sprite.width / 2, sprite.height / 2);
   *
   * // Corner rotation
   * transform.pivot.set(0, 0);
   * transform.rotation = Math.PI / 4; // 45 degrees
   * ```
   */
  pivot;
  /**
   * The skew amount, on the x and y axis.
   * @example
   * ```ts
   * // Apply horizontal skew
   * transform.skew.x = Math.PI / 6; // 30 degrees
   *
   * // Apply both skews
   * transform.skew.set(Math.PI / 6, Math.PI / 8);
   * ```
   */
  skew;
  /** The rotation amount. */
  _rotation;
  /**
   * The X-coordinate value of the normalized local X axis,
   * the first column of the local transformation matrix without a scale.
   */
  _cx;
  /**
   * The Y-coordinate value of the normalized local X axis,
   * the first column of the local transformation matrix without a scale.
   */
  _sx;
  /**
   * The X-coordinate value of the normalized local Y axis,
   * the second column of the local transformation matrix without a scale.
   */
  _cy;
  /**
   * The Y-coordinate value of the normalized local Y axis,
   * the second column of the local transformation matrix without a scale.
   */
  _sy;
  dirty = !0;
  observer;
  /**
   * @param options - Options for the transform.
   * @param options.matrix - The matrix to use.
   * @param options.observer - The observer to use.
   */
  constructor({ matrix: t, observer: e } = {}) {
    this._matrix = t ?? new N(), this.observer = e, this.position = new At(this, 0, 0), this.scale = new At(this, 1, 1), this.pivot = new At(this, 0, 0), this.skew = new At(this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1;
  }
  /**
   * The transformation matrix computed from the transform's properties.
   * Combines position, scale, rotation, skew, and pivot into a single matrix.
   * @example
   * ```ts
   * // Get current matrix
   * const matrix = transform.matrix;
   * console.log(matrix.toString());
   * ```
   * @readonly
   * @see {@link Matrix} For matrix operations
   * @see {@link Transform.setFromMatrix} For setting transform from matrix
   */
  get matrix() {
    const t = this._matrix;
    return this.dirty && (t.a = this._cx * this.scale.x, t.b = this._sx * this.scale.x, t.c = this._cy * this.scale.y, t.d = this._sy * this.scale.y, t.tx = this.position.x - (this.pivot.x * t.a + this.pivot.y * t.c), t.ty = this.position.y - (this.pivot.x * t.b + this.pivot.y * t.d), this.dirty = !1), t;
  }
  /**
   * Called when a value changes.
   * @param point
   * @internal
   */
  _onUpdate(t) {
    this.dirty = !0, t === this.skew && this.updateSkew(), this.observer?._onUpdate(this);
  }
  /** Called when the skew or the rotation changes. */
  updateSkew() {
    this._cx = Math.cos(this._rotation + this.skew.y), this._sx = Math.sin(this._rotation + this.skew.y), this._cy = -Math.sin(this._rotation - this.skew.x), this._sy = Math.cos(this._rotation - this.skew.x), this.dirty = !0;
  }
  // #if _DEBUG
  toString() {
    return `[pixi.js/math:Transform position=(${this.position.x}, ${this.position.y}) rotation=${this.rotation} scale=(${this.scale.x}, ${this.scale.y}) skew=(${this.skew.x}, ${this.skew.y}) ]`;
  }
  // #endif
  /**
   * Decomposes a matrix and sets the transforms properties based on it.
   * @example
   * ```ts
   * // Basic matrix decomposition
   * const transform = new Transform();
   * const matrix = new Matrix()
   *     .translate(100, 100)
   *     .rotate(Math.PI / 4)
   *     .scale(2, 2);
   *
   * transform.setFromMatrix(matrix);
   * console.log(transform.position.x); // 100
   * console.log(transform.rotation); // ~0.785 (π/4)
   * ```
   * @param matrix - The matrix to decompose
   * @see {@link Matrix#decompose} For the decomposition logic
   * @see {@link Transform#matrix} For getting the current matrix
   */
  setFromMatrix(t) {
    t.decompose(this), this.dirty = !0;
  }
  /**
   * The rotation of the object in radians.
   * @example
   * ```ts
   * // Basic rotation
   * transform.rotation = Math.PI / 4; // 45 degrees
   *
   * // Rotate around pivot point
   * transform.pivot.set(50, 50);
   * transform.rotation = Math.PI; // 180 degrees around pivot
   *
   * // Animate rotation
   * app.ticker.add(() => {
   *     transform.rotation += 0.1;
   * });
   * ```
   * @see {@link Transform#pivot} For rotation point
   * @see {@link Transform#skew} For skew effects
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(t) {
    this._rotation !== t && (this._rotation = t, this._onUpdate(this.skew));
  }
}
function K(i) {
  if (typeof i != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(i)}`);
}
function Lt(i) {
  return i.split("?")[0].split("#")[0];
}
function cr(i) {
  return i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ur(i, t, e) {
  return i.replace(new RegExp(cr(t), "g"), e);
}
function dr(i, t) {
  let e = "", s = 0, n = -1, r = 0, o = -1;
  for (let a = 0; a <= i.length; ++a) {
    if (a < i.length)
      o = i.charCodeAt(a);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(n === a - 1 || r === 1)) if (n !== a - 1 && r === 2) {
        if (e.length < 2 || s !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
          if (e.length > 2) {
            const h = e.lastIndexOf("/");
            if (h !== e.length - 1) {
              h === -1 ? (e = "", s = 0) : (e = e.slice(0, h), s = e.length - 1 - e.lastIndexOf("/")), n = a, r = 0;
              continue;
            }
          } else if (e.length === 2 || e.length === 1) {
            e = "", s = 0, n = a, r = 0;
            continue;
          }
        }
      } else
        e.length > 0 ? e += `/${i.slice(n + 1, a)}` : e = i.slice(n + 1, a), s = a - n - 1;
      n = a, r = 0;
    } else o === 46 && r !== -1 ? ++r : r = -1;
  }
  return e;
}
const He = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   * @example
   * ```ts
   * // Convert a Windows path to POSIX format
   * path.toPosix('C:\\Users\\User\\Documents\\file.txt');
   * // -> 'C:/Users/User/Documents/file.txt'
   * ```
   */
  toPosix(i) {
    return ur(i, "\\", "/");
  },
  /**
   * Checks if the path is a URL e.g. http://, https://
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path is a URL
   * path.isUrl('http://www.example.com');
   * // -> true
   * path.isUrl('C:/Users/User/Documents/file.txt');
   * // -> false
   * ```
   */
  isUrl(i) {
    return /^https?:/.test(this.toPosix(i));
  },
  /**
   * Checks if the path is a data URL
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path is a data URL
   * path.isDataUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
   * // -> true
   * ```
   */
  isDataUrl(i) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(i);
  },
  /**
   * Checks if the path is a blob URL
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path is a blob URL
   * path.isBlobUrl('blob:http://www.example.com/12345678-1234-1234-1234-123456789012');
   * // -> true
   * ```
   */
  isBlobUrl(i) {
    return i.startsWith("blob:");
  },
  /**
   * Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
   * This will return true for windows file paths
   * @param path - The path to check
   * @example
   * ```ts
   * // Check if a path has a protocol
   * path.hasProtocol('http://www.example.com');
   * // -> true
   * path.hasProtocol('C:/Users/User/Documents/file.txt');
   * // -> true
   * ```
   */
  hasProtocol(i) {
    return /^[^/:]+:/.test(this.toPosix(i));
  },
  /**
   * Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
   * @param path - The path to get the protocol from
   * @example
   * ```ts
   * // Get the protocol from a URL
   * path.getProtocol('http://www.example.com/path/to/resource');
   * // -> 'http://'
   * // Get the protocol from a file path
   * path.getProtocol('C:/Users/User/Documents/file.txt');
   * // -> 'C:/'
   * ```
   */
  getProtocol(i) {
    K(i), i = this.toPosix(i);
    const t = /^file:\/\/\//.exec(i);
    if (t)
      return t[0];
    const e = /^[^/:]+:\/{0,2}/.exec(i);
    return e ? e[0] : "";
  },
  /**
   * Converts URL to an absolute path.
   * When loading from a Web Worker, we must use absolute paths.
   * If the URL is already absolute we return it as is
   * If it's not, we convert it
   * @param url - The URL to test
   * @param customBaseUrl - The base URL to use
   * @param customRootUrl - The root URL to use
   * @example
   * ```ts
   * // Convert a relative URL to an absolute path
   * path.toAbsolute('images/texture.png', 'http://example.com/assets/');
   * // -> 'http://example.com/assets/images/texture.png'
   * ```
   */
  toAbsolute(i, t, e) {
    if (K(i), this.isDataUrl(i) || this.isBlobUrl(i)) return i;
    const s = Lt(this.toPosix(t ?? J.get().getBaseUrl())), n = Lt(this.toPosix(e ?? this.rootname(s)));
    return i = this.toPosix(i), i.startsWith("/") ? He.join(n, i.slice(1)) : this.isAbsolute(i) ? i : this.join(s, i);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   * @example
   * ```ts
   * // Normalize a path with relative segments
   * path.normalize('http://www.example.com/foo/bar/../baz');
   * // -> 'http://www.example.com/foo/baz'
   * // Normalize a file path with relative segments
   * path.normalize('C:\\Users\\User\\Documents\\..\\file.txt');
   * // -> 'C:/Users/User/file.txt'
   * ```
   */
  normalize(i) {
    if (K(i), i.length === 0) return ".";
    if (this.isDataUrl(i) || this.isBlobUrl(i)) return i;
    i = this.toPosix(i);
    let t = "";
    const e = i.startsWith("/");
    this.hasProtocol(i) && (t = this.rootname(i), i = i.slice(t.length));
    const s = i.endsWith("/");
    return i = dr(i), i.length > 0 && s && (i += "/"), e ? `/${i}` : t + i;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   * @example
   * ```ts
   * // Check if a path is absolute
   * path.isAbsolute('http://www.example.com/foo/bar');
   * // -> true
   * path.isAbsolute('C:/Users/User/Documents/file.txt');
   * // -> true
   * ```
   */
  isAbsolute(i) {
    return K(i), i = this.toPosix(i), this.hasProtocol(i) ? !0 : i.startsWith("/");
  },
  /**
   * Joins all given path segments together using the platform-specific separator as a delimiter,
   * then normalizes the resulting path
   * @param segments - The segments of the path to join
   * @example
   * ```ts
   * // Join multiple path segments
   * path.join('assets', 'images', 'sprite.png');
   * // -> 'assets/images/sprite.png'
   * // Join with relative segments
   * path.join('assets', 'images', '../textures', 'sprite.png');
   * // -> 'assets/textures/sprite.png'
   * ```
   */
  join(...i) {
    if (i.length === 0)
      return ".";
    let t;
    for (let e = 0; e < i.length; ++e) {
      const s = i[e];
      if (K(s), s.length > 0)
        if (t === void 0) t = s;
        else {
          const n = i[e - 1] ?? "";
          this.joinExtensions.includes(this.extname(n).toLowerCase()) ? t += `/../${s}` : t += `/${s}`;
        }
    }
    return t === void 0 ? "." : this.normalize(t);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   * @example
   * ```ts
   * // Get the directory name of a path
   * path.dirname('http://www.example.com/foo/bar/baz.png');
   * // -> 'http://www.example.com/foo/bar'
   * // Get the directory name of a file path
   * path.dirname('C:/Users/User/Documents/file.txt');
   * // -> 'C:/Users/User/Documents'
   * ```
   */
  dirname(i) {
    if (K(i), i.length === 0) return ".";
    i = this.toPosix(i);
    let t = i.charCodeAt(0);
    const e = t === 47;
    let s = -1, n = !0;
    const r = this.getProtocol(i), o = i;
    i = i.slice(r.length);
    for (let a = i.length - 1; a >= 1; --a)
      if (t = i.charCodeAt(a), t === 47) {
        if (!n) {
          s = a;
          break;
        }
      } else
        n = !1;
    return s === -1 ? e ? "/" : this.isUrl(o) ? r + i : r : e && s === 1 ? "//" : r + i.slice(0, s);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   * @example
   * ```ts
   * // Get the root of a URL
   * path.rootname('http://www.example.com/foo/bar/baz.png');
   * // -> 'http://www.example.com/'
   * // Get the root of a file path
   * path.rootname('C:/Users/User/Documents/file.txt');
   * // -> 'C:/'
   * ```
   */
  rootname(i) {
    K(i), i = this.toPosix(i);
    let t = "";
    if (i.startsWith("/") ? t = "/" : t = this.getProtocol(i), this.isUrl(i)) {
      const e = i.indexOf("/", t.length);
      e !== -1 ? t = i.slice(0, e) : t = i, t.endsWith("/") || (t += "/");
    }
    return t;
  },
  /**
   * Returns the last portion of a path
   * @param path - The path to test
   * @param ext - Optional extension to remove
   * @example
   * ```ts
   * // Get the basename of a URL
   * path.basename('http://www.example.com/foo/bar/baz.png');
   * // -> 'baz.png'
   * // Get the basename of a file path
   * path.basename('C:/Users/User/Documents/file.txt');
   * // -> 'file.txt'
   * ```
   */
  basename(i, t) {
    K(i), t && K(t), i = Lt(this.toPosix(i));
    let e = 0, s = -1, n = !0, r;
    if (t !== void 0 && t.length > 0 && t.length <= i.length) {
      if (t.length === i.length && t === i) return "";
      let o = t.length - 1, a = -1;
      for (r = i.length - 1; r >= 0; --r) {
        const h = i.charCodeAt(r);
        if (h === 47) {
          if (!n) {
            e = r + 1;
            break;
          }
        } else
          a === -1 && (n = !1, a = r + 1), o >= 0 && (h === t.charCodeAt(o) ? --o === -1 && (s = r) : (o = -1, s = a));
      }
      return e === s ? s = a : s === -1 && (s = i.length), i.slice(e, s);
    }
    for (r = i.length - 1; r >= 0; --r)
      if (i.charCodeAt(r) === 47) {
        if (!n) {
          e = r + 1;
          break;
        }
      } else s === -1 && (n = !1, s = r + 1);
    return s === -1 ? "" : i.slice(e, s);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   * @example
   * ```ts
   * // Get the extension of a URL
   * path.extname('http://www.example.com/foo/bar/baz.png');
   * // -> '.png'
   * // Get the extension of a file path
   * path.extname('C:/Users/User/Documents/file.txt');
   * // -> '.txt'
   * ```
   */
  extname(i) {
    K(i), i = Lt(this.toPosix(i));
    let t = -1, e = 0, s = -1, n = !0, r = 0;
    for (let o = i.length - 1; o >= 0; --o) {
      const a = i.charCodeAt(o);
      if (a === 47) {
        if (!n) {
          e = o + 1;
          break;
        }
        continue;
      }
      s === -1 && (n = !1, s = o + 1), a === 46 ? t === -1 ? t = o : r !== 1 && (r = 1) : t !== -1 && (r = -1);
    }
    return t === -1 || s === -1 || r === 0 || r === 1 && t === s - 1 && t === e + 1 ? "" : i.slice(t, s);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   * @example
   * ```ts
   * // Parse a URL
   * const parsed = path.parse('http://www.example.com/foo/bar/baz.png');
   * // -> {
   * //   root: 'http://www.example.com/',
   * //   dir: 'http://www.example.com/foo/bar',
   * //   base: 'baz.png',
   * //   ext: '.png',
   * //   name: 'baz'
   * // }
   * // Parse a file path
   * const parsedFile = path.parse('C:/Users/User/Documents/file.txt');
   * // -> {
   * //   root: 'C:/',
   * //   dir: 'C:/Users/User/Documents',
   * //   base: 'file.txt',
   * //   ext: '.txt',
   * //   name: 'file'
   * // }
   * ```
   */
  parse(i) {
    K(i);
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (i.length === 0) return t;
    i = Lt(this.toPosix(i));
    let e = i.charCodeAt(0);
    const s = this.isAbsolute(i);
    let n;
    t.root = this.rootname(i), s || this.hasProtocol(i) ? n = 1 : n = 0;
    let r = -1, o = 0, a = -1, h = !0, c = i.length - 1, l = 0;
    for (; c >= n; --c) {
      if (e = i.charCodeAt(c), e === 47) {
        if (!h) {
          o = c + 1;
          break;
        }
        continue;
      }
      a === -1 && (h = !1, a = c + 1), e === 46 ? r === -1 ? r = c : l !== 1 && (l = 1) : r !== -1 && (l = -1);
    }
    return r === -1 || a === -1 || l === 0 || l === 1 && r === a - 1 && r === o + 1 ? a !== -1 && (o === 0 && s ? t.base = t.name = i.slice(1, a) : t.base = t.name = i.slice(o, a)) : (o === 0 && s ? (t.name = i.slice(1, r), t.base = i.slice(1, a)) : (t.name = i.slice(o, r), t.base = i.slice(o, a)), t.ext = i.slice(r, a)), t.dir = this.dirname(i), t;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
function si(i, t, e, s, n) {
  const r = t[e];
  for (let o = 0; o < r.length; o++) {
    const a = r[o];
    e < t.length - 1 ? si(i.replace(s[e], a), t, e + 1, s, n) : n.push(i.replace(s[e], a));
  }
}
function fr(i) {
  const t = /\{(.*?)\}/g, e = i.match(t), s = [];
  if (e) {
    const n = [];
    e.forEach((r) => {
      const o = r.substring(1, r.length - 1).split(",");
      n.push(o);
    }), si(i, n, 0, e, s);
  } else
    s.push(i);
  return s;
}
const Ts = (i) => !Array.isArray(i);
class pr {
  /**
   * The prefix that denotes a URL is for a retina asset.
   * @default /@([0-9\.]+)x/
   * @example `@2x`
   */
  static RETINA_PREFIX = /@([0-9\.]+)x/;
  _defaultBundleIdentifierOptions = {
    connector: "-",
    createBundleAssetId: (t, e) => `${t}${this._bundleIdConnector}${e}`,
    extractAssetIdFromBundle: (t, e) => e.replace(`${t}${this._bundleIdConnector}`, "")
  };
  /** The character that is used to connect the bundleId and the assetId when generating a bundle asset id key */
  _bundleIdConnector = this._defaultBundleIdentifierOptions.connector;
  /**
   * A function that generates a bundle asset id key from a bundleId and an assetId
   * @param bundleId - the bundleId
   * @param assetId  - the assetId
   * @returns the bundle asset id key
   */
  _createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId;
  /**
   * A function that generates an assetId from a bundle asset id key. This is the reverse of generateBundleAssetId
   * @param bundleId - the bundleId
   * @param assetBundleId - the bundle asset id key
   * @returns the assetId
   */
  _extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle;
  _assetMap = {};
  _preferredOrder = [];
  _parsers = [];
  _resolverHash = {};
  _rootPath;
  _basePath;
  _manifest;
  _bundles = {};
  _defaultSearchParams;
  /**
   * Override how the resolver deals with generating bundle ids.
   * must be called before any bundles are added
   * @param bundleIdentifier - the bundle identifier options
   */
  setBundleIdentifier(t) {
    if (this._bundleIdConnector = t.connector ?? this._bundleIdConnector, this._createBundleAssetId = t.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = t.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar")
      throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
  }
  /**
   * Let the resolver know which assets you prefer to use when resolving assets.
   * Multiple prefer user defined rules can be added.
   * @example
   * resolver.prefer({
   *     // first look for something with the correct format, and then then correct resolution
   *     priority: ['format', 'resolution'],
   *     params:{
   *         format:'webp', // prefer webp images
   *         resolution: 2, // prefer a resolution of 2
   *     }
   * })
   * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
   * resolver.resolveUrl('foo') // => 'bar@2x.webp'
   * @param preferOrders - the prefer options
   */
  prefer(...t) {
    t.forEach((e) => {
      this._preferredOrder.push(e), e.priority || (e.priority = Object.keys(e.params));
    }), this._resolverHash = {};
  }
  /**
   * Set the base path to prepend to all urls when resolving
   * @example
   * resolver.basePath = 'https://home.com/';
   * resolver.add('foo', 'bar.ong');
   * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
   * @param basePath - the base path to use
   */
  set basePath(t) {
    this._basePath = t;
  }
  get basePath() {
    return this._basePath;
  }
  /**
   * Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
   * default value for browsers is `window.location.origin`
   * @example
   * // Application hosted on https://home.com/some-path/index.html
   * resolver.basePath = 'https://home.com/some-path/';
   * resolver.rootPath = 'https://home.com/';
   * resolver.add('foo', '/bar.png');
   * resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
   * @param rootPath - the root path to use
   */
  set rootPath(t) {
    this._rootPath = t;
  }
  get rootPath() {
    return this._rootPath;
  }
  /**
   * All the active URL parsers that help the parser to extract information and create
   * an asset object-based on parsing the URL itself.
   *
   * Can be added using the extensions API
   * @example
   * resolver.add('foo', [
   *     {
   *         resolution: 2,
   *         format: 'png',
   *         src: 'image@2x.png',
   *     },
   *     {
   *         resolution:1,
   *         format:'png',
   *         src: 'image.png',
   *     },
   * ]);
   *
   * // With a url parser the information such as resolution and file format could extracted from the url itself:
   * extensions.add({
   *     extension: ExtensionType.ResolveParser,
   *     test: loadTextures.test, // test if url ends in an image
   *     parse: (value: string) =>
   *     ({
   *         resolution: parseFloat(Resolver.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
   *         format: value.split('.').pop(),
   *         src: value,
   *     }),
   * });
   *
   * // Now resolution and format can be extracted from the url
   * resolver.add('foo', [
   *     'image@2x.png',
   *     'image.png',
   * ]);
   */
  get parsers() {
    return this._parsers;
  }
  /** Used for testing, this resets the resolver to its initial state */
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
  }
  /**
   * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
   * @param searchParams - the default url parameters to append when resolving urls
   */
  setDefaultSearchParams(t) {
    if (typeof t == "string")
      this._defaultSearchParams = t;
    else {
      const e = t;
      this._defaultSearchParams = Object.keys(e).map((s) => `${encodeURIComponent(s)}=${encodeURIComponent(e[s])}`).join("&");
    }
  }
  /**
   * Returns the aliases for a given asset
   * @param asset - the asset to get the aliases for
   */
  getAlias(t) {
    const { alias: e, src: s } = t;
    return _t(
      e || s,
      (r) => typeof r == "string" ? r : Array.isArray(r) ? r.map((o) => o?.src ?? o) : r?.src ? r.src : r,
      !0
    );
  }
  /**
   * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
   * generally a manifest would be built using a tool.
   * @param manifest - the manifest to add to the resolver
   */
  addManifest(t) {
    this._manifest && vt("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = t, t.bundles.forEach((e) => {
      this.addBundle(e.name, e.assets);
    });
  }
  /**
   * This adds a bundle of assets in one go so that you can resolve them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * resolver.addBundle('animals', [
   *  { alias: 'bunny', src: 'bunny.png' },
   *  { alias: 'chicken', src: 'chicken.png' },
   *  { alias: 'thumper', src: 'thumper.png' },
   * ]);
   * // or
   * resolver.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const resolvedAssets = await resolver.resolveBundle('animals');
   * @param bundleId - The id of the bundle to add
   * @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    const s = [];
    let n = e;
    Array.isArray(e) || (n = Object.entries(e).map(([r, o]) => typeof o == "string" || Array.isArray(o) ? { alias: r, src: o } : { alias: r, ...o })), n.forEach((r) => {
      const o = r.src, a = r.alias;
      let h;
      if (typeof a == "string") {
        const c = this._createBundleAssetId(t, a);
        s.push(c), h = [a, c];
      } else {
        const c = a.map((l) => this._createBundleAssetId(t, l));
        s.push(...c), h = [...a, ...c];
      }
      this.add({
        ...r,
        alias: h,
        src: o
      });
    }), this._bundles[t] = s;
  }
  /**
   * Tells the resolver what keys are associated with witch asset.
   * The most important thing the resolver does
   * @example
   * // Single key, single asset:
   * resolver.add({alias: 'foo', src: 'bar.png');
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Multiple keys, single asset:
   * resolver.add({alias: ['foo', 'boo'], src: 'bar.png'});
   * resolver.resolveUrl('foo') // => 'bar.png'
   * resolver.resolveUrl('boo') // => 'bar.png'
   *
   * // Multiple keys, multiple assets:
   * resolver.add({alias: ['foo', 'boo'], src: ['bar.png', 'bar.webp']});
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Add custom data attached to the resolver
   * Resolver.add({
   *     alias: 'bunnyBooBooSmooth',
   *     src: 'bunny{png,webp}',
   *     data: { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
   * });
   *
   * resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
   * @param aliases - the UnresolvedAsset or array of UnresolvedAssets to add to the resolver
   */
  add(t) {
    const e = [];
    Array.isArray(t) ? e.push(...t) : e.push(t);
    let s;
    s = (r) => {
      this.hasKey(r) && vt(`[Resolver] already has key: ${r} overwriting`);
    }, _t(e).forEach((r) => {
      const { src: o } = r;
      let { data: a, format: h, loadParser: c } = r;
      const l = _t(o).map((d) => typeof d == "string" ? fr(d) : Array.isArray(d) ? d : [d]), u = this.getAlias(r);
      Array.isArray(u) ? u.forEach(s) : s(u);
      const f = [];
      l.forEach((d) => {
        d.forEach((p) => {
          let m = {};
          if (typeof p != "object") {
            m.src = p;
            for (let y = 0; y < this._parsers.length; y++) {
              const g = this._parsers[y];
              if (g.test(p)) {
                m = g.parse(p);
                break;
              }
            }
          } else
            a = p.data ?? a, h = p.format ?? h, c = p.loadParser ?? c, m = {
              ...m,
              ...p
            };
          if (!u)
            throw new Error(`[Resolver] alias is undefined for this asset: ${m.src}`);
          m = this._buildResolvedAsset(m, {
            aliases: u,
            data: a,
            format: h,
            loadParser: c
          }), f.push(m);
        });
      }), u.forEach((d) => {
        this._assetMap[d] = f;
      });
    });
  }
  // TODO: this needs an overload like load did in Assets
  /**
   * If the resolver has had a manifest set via setManifest, this will return the assets urls for
   * a given bundleId or bundleIds.
   * @example
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * resolver.setManifest(manifest);
   * const resolved = resolver.resolveBundle('load-screen');
   * @param bundleIds - The bundle ids to resolve
   * @returns All the bundles assets or a hash of assets for each bundle specified
   */
  resolveBundle(t) {
    const e = Ts(t);
    t = _t(t);
    const s = {};
    return t.forEach((n) => {
      const r = this._bundles[n];
      if (r) {
        const o = this.resolve(r), a = {};
        for (const h in o) {
          const c = o[h];
          a[this._extractAssetIdFromBundle(n, h)] = c;
        }
        s[n] = a;
      }
    }), e ? s[t[0]] : s;
  }
  /**
   * Does exactly what resolve does, but returns just the URL rather than the whole asset object
   * @param key - The key or keys to resolve
   * @returns - The URLs associated with the key(s)
   */
  resolveUrl(t) {
    const e = this.resolve(t);
    if (typeof t != "string") {
      const s = {};
      for (const n in e)
        s[n] = e[n].src;
      return s;
    }
    return e.src;
  }
  resolve(t) {
    const e = Ts(t);
    t = _t(t);
    const s = {};
    return t.forEach((n) => {
      if (!this._resolverHash[n])
        if (this._assetMap[n]) {
          let r = this._assetMap[n];
          const o = this._getPreferredOrder(r);
          o?.priority.forEach((a) => {
            o.params[a].forEach((h) => {
              const c = r.filter((l) => l[a] ? l[a] === h : !1);
              c.length && (r = c);
            });
          }), this._resolverHash[n] = r[0];
        } else
          this._resolverHash[n] = this._buildResolvedAsset({
            alias: [n],
            src: n
          }, {});
      s[n] = this._resolverHash[n];
    }), e ? s[t[0]] : s;
  }
  /**
   * Checks if an asset with a given key exists in the resolver
   * @param key - The key of the asset
   */
  hasKey(t) {
    return !!this._assetMap[t];
  }
  /**
   * Checks if a bundle with the given key exists in the resolver
   * @param key - The key of the bundle
   */
  hasBundle(t) {
    return !!this._bundles[t];
  }
  /**
   * Internal function for figuring out what prefer criteria an asset should use.
   * @param assets
   */
  _getPreferredOrder(t) {
    for (let e = 0; e < t.length; e++) {
      const s = t[e], n = this._preferredOrder.find((r) => r.params.format.includes(s.format));
      if (n)
        return n;
    }
    return this._preferredOrder[0];
  }
  /**
   * Appends the default url parameters to the url
   * @param url - The url to append the default parameters to
   * @returns - The url with the default parameters appended
   */
  _appendDefaultSearchParams(t) {
    if (!this._defaultSearchParams) return t;
    const e = /\?/.test(t) ? "&" : "?";
    return `${t}${e}${this._defaultSearchParams}`;
  }
  _buildResolvedAsset(t, e) {
    const { aliases: s, data: n, loadParser: r, format: o } = e;
    return (this._basePath || this._rootPath) && (t.src = He.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = s ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = { ...n || {}, ...t.data }, t.loadParser = r ?? t.loadParser, t.format = o ?? t.format ?? mr(t.src), t;
  }
}
function mr(i) {
  return i.split(".").pop().split("?").shift().split("#").shift();
}
function ro(i, t = 1) {
  const e = pr.RETINA_PREFIX?.exec(i);
  return e ? parseFloat(e[1]) : t;
}
class yr {
  /** @internal */
  _classType;
  _pool = [];
  _count = 0;
  _index = 0;
  /**
   * Constructs a new Pool.
   * @param ClassType - The constructor of the items in the pool.
   * @param {number} [initialSize] - The initial size of the pool.
   */
  constructor(t, e) {
    this._classType = t, e && this.prepopulate(e);
  }
  /**
   * Prepopulates the pool with a given number of items.
   * @param total - The number of items to add to the pool.
   */
  prepopulate(t) {
    for (let e = 0; e < t; e++)
      this._pool[this._index++] = new this._classType();
    this._count += t;
  }
  /**
   * Gets an item from the pool. Calls the item's `init` method if it exists.
   * If there are no items left in the pool, a new one will be created.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t) {
    let e;
    return this._index > 0 ? e = this._pool[--this._index] : e = new this._classType(), e.init?.(t), e;
  }
  /**
   * Returns an item to the pool. Calls the item's `reset` method if it exists.
   * @param {T} item - The item to return to the pool.
   */
  return(t) {
    t.reset?.(), this._pool[this._index++] = t;
  }
  /**
   * Gets the number of items in the pool.
   * @readonly
   */
  get totalSize() {
    return this._count;
  }
  /**
   * Gets the number of items in the pool that are free to use without needing to create more.
   * @readonly
   */
  get totalFree() {
    return this._index;
  }
  /**
   * Gets the number of items in the pool that are currently in use.
   * @readonly
   */
  get totalUsed() {
    return this._count - this._index;
  }
  /** clears the pool - mainly used for debugging! */
  clear() {
    this._pool.length = 0, this._index = 0;
  }
}
class gr {
  /**
   * A map to store the pools by their class type.
   * @private
   */
  _poolsByClass = /* @__PURE__ */ new Map();
  /**
   * Prepopulates a specific pool with a given number of items.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {number} total - The number of items to add to the pool.
   */
  prepopulate(t, e) {
    this.getPool(t).prepopulate(e);
  }
  /**
   * Gets an item from a specific pool.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t, e) {
    return this.getPool(t).get(e);
  }
  /**
   * Returns an item to its respective pool.
   * @param {PoolItem} item - The item to return to the pool.
   */
  return(t) {
    this.getPool(t.constructor).return(t);
  }
  /**
   * Gets a specific pool based on the class type.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} ClassType - The constructor of the items in the pool.
   * @returns {Pool<T>} The pool of the given class type.
   */
  getPool(t) {
    return this._poolsByClass.has(t) || this._poolsByClass.set(t, new yr(t)), this._poolsByClass.get(t);
  }
  /** gets the usage stats of each pool in the system */
  stats() {
    const t = {};
    return this._poolsByClass.forEach((e) => {
      const s = t[e._classType.name] ? e._classType.name + e._classType.ID : e._classType.name;
      t[s] = {
        free: e.totalFree,
        used: e.totalUsed,
        size: e.totalSize
      };
    }), t;
  }
}
const oo = new gr();
let Ss = !1;
function ao(i) {
  if (!Ss) {
    if (J.get().getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
      const t = [
        `%c  %c  %c  %c  %c PixiJS %c v${Es} (${i}) http://www.pixijs.com/

`,
        "background: #E72264; padding:5px 0;",
        "background: #6CA2EA; padding:5px 0;",
        "background: #B5D33D; padding:5px 0;",
        "background: #FED23F; padding:5px 0;",
        "color: #FFFFFF; background: #E72264; padding:5px 0;",
        "color: #E72264; background: #FFFFFF; padding:5px 0;"
      ];
      globalThis.console.log(...t);
    } else globalThis.console && globalThis.console.log(`PixiJS ${Es} - ${i} - http://www.pixijs.com/`);
    Ss = !0;
  }
}
class ho {
  items;
  _name;
  /**
   * @param name - The function name that will be executed on the listeners added to this Runner.
   */
  constructor(t) {
    this.items = [], this._name = t;
  }
  /* jsdoc/check-param-names */
  /**
   * Dispatch/Broadcast Runner to all listeners added to the queue.
   * @param {...any} params - (optional) parameters to pass to each listener
   */
  /* jsdoc/check-param-names */
  emit(t, e, s, n, r, o, a, h) {
    const { name: c, items: l } = this;
    for (let u = 0, f = l.length; u < f; u++)
      l[u][c](t, e, s, n, r, o, a, h);
    return this;
  }
  /**
   * Add a listener to the Runner
   *
   * Runners do not need to have scope or functions passed to them.
   * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
   * as the name provided to the Runner when it was created.
   *
   * Eg A listener passed to this Runner will require a 'complete' function.
   *
   * ```ts
   * import { Runner } from 'pixi.js';
   *
   * const complete = new Runner('complete');
   * ```
   *
   * The scope used will be the object itself.
   * @param {any} item - The object that will be listening.
   */
  add(t) {
    return t[this._name] && (this.remove(t), this.items.push(t)), this;
  }
  /**
   * Remove a single listener from the dispatch queue.
   * @param {any} item - The listener that you would like to remove.
   */
  remove(t) {
    const e = this.items.indexOf(t);
    return e !== -1 && this.items.splice(e, 1), this;
  }
  /**
   * Check to see if the listener is already in the Runner
   * @param {any} item - The listener that you would like to check.
   */
  contains(t) {
    return this.items.indexOf(t) !== -1;
  }
  /** Remove all listeners from the Runner */
  removeAll() {
    return this.items.length = 0, this;
  }
  /** Remove all references, don't use after this. */
  destroy() {
    this.removeAll(), this.items = null, this._name = null;
  }
  /**
   * `true` if there are no this Runner contains no listeners
   * @readonly
   */
  get empty() {
    return this.items.length === 0;
  }
  /**
   * The name of the runner.
   * @readonly
   */
  get name() {
    return this._name;
  }
}
class lo {
  /** Whether or not the loader should continue loading. */
  _isActive;
  /** Assets to load. */
  _assetList;
  /** Whether or not the loader is loading. */
  _isLoading;
  /** Number of assets to load at a time. */
  _maxConcurrent;
  /**
   * Should the loader log to the console.
   * @advanced
   */
  verbose;
  _loader;
  /**
   * @param loader
   * @param verbose - should the loader log to the console
   */
  constructor(t, e = !1) {
    this._loader = t, this._assetList = [], this._isLoading = !1, this._maxConcurrent = 1, this.verbose = e;
  }
  /**
   * Adds assets to the background loading queue. Assets are loaded one at a time to minimize
   * performance impact.
   * @param assetUrls - Array of resolved assets to load in the background
   * @example
   * ```ts
   * // Add assets to background load queue
   * backgroundLoader.add([
   *     { src: 'images/level1/bg.png' },
   *     { src: 'images/level1/characters.json' }
   * ]);
   *
   * // Assets will load sequentially in the background
   * // The loader automatically pauses when high-priority loads occur
   * // e.g. Assets.load() is called
   * ```
   * @remarks
   * - Assets are loaded one at a time to minimize performance impact
   * - Loading automatically pauses when Assets.load() is called
   * - No progress tracking is available for background loading
   * - Assets are cached as they complete loading
   * @internal
   */
  add(t) {
    t.forEach((e) => {
      this._assetList.push(e);
    }), this.verbose && console.log("[BackgroundLoader] assets: ", this._assetList), this._isActive && !this._isLoading && this._next();
  }
  /**
   * Loads the next set of assets. Will try to load as many assets as it can at the same time.
   *
   * The max assets it will try to load at one time will be 4.
   */
  async _next() {
    if (this._assetList.length && this._isActive) {
      this._isLoading = !0;
      const t = [], e = Math.min(this._assetList.length, this._maxConcurrent);
      for (let s = 0; s < e; s++)
        t.push(this._assetList.pop());
      await this._loader.load(t), this._isLoading = !1, this._next();
    }
  }
  /**
   * Controls the active state of the background loader. When active, the loader will
   * continue processing its queue. When inactive, loading is paused.
   * @returns Whether the background loader is currently active
   * @example
   * ```ts
   * // Pause background loading
   * backgroundLoader.active = false;
   *
   * // Resume background loading
   * backgroundLoader.active = true;
   *
   * // Check current state
   * console.log(backgroundLoader.active); // true/false
   *
   * // Common use case: Pause during intensive operations
   * backgroundLoader.active = false;  // Pause background loading
   * ... // Perform high-priority tasks
   * backgroundLoader.active = true;   // Resume background loading
   * ```
   * @remarks
   * - Setting to true resumes loading immediately
   * - Setting to false pauses after current asset completes
   * - Background loading is automatically paused during `Assets.load()`
   * - Assets already being loaded will complete even when set to false
   */
  get active() {
    return this._isActive;
  }
  set active(t) {
    this._isActive !== t && (this._isActive = t, t && !this._isLoading && this._next());
  }
}
async function ii(i) {
  if ("Image" in globalThis)
    return new Promise((t) => {
      const e = new Image();
      e.onload = () => {
        t(!0);
      }, e.onerror = () => {
        t(!1);
      }, e.src = i;
    });
  if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
    try {
      const t = await (await fetch(i)).blob();
      await createImageBitmap(t);
    } catch {
      return !1;
    }
    return !0;
  }
  return !1;
}
const co = {
  extension: {
    type: "ExtensionType.DetectionParser",
    priority: 1
  },
  test: async () => ii(
    // eslint-disable-next-line max-len
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  ),
  add: async (i) => [...i, "avif"],
  remove: async (i) => i.filter((t) => t !== "avif")
}, Cs = ["png", "jpg", "jpeg"], uo = {
  extension: {
    type: "ExtensionType.DetectionParser",
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (i) => [...i, ...Cs],
  remove: async (i) => i.filter((t) => !Cs.includes(t))
}, xr = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function $e(i) {
  return xr ? !1 : document.createElement("video").canPlayType(i) !== "";
}
const fo = {
  extension: {
    type: "ExtensionType.DetectionParser",
    priority: 0
  },
  test: async () => $e("video/mp4"),
  add: async (i) => [...i, "mp4", "m4v"],
  remove: async (i) => i.filter((t) => t !== "mp4" && t !== "m4v")
}, po = {
  extension: {
    type: "ExtensionType.DetectionParser",
    priority: 0
  },
  test: async () => $e("video/ogg"),
  add: async (i) => [...i, "ogv"],
  remove: async (i) => i.filter((t) => t !== "ogv")
}, mo = {
  extension: {
    type: "ExtensionType.DetectionParser",
    priority: 0
  },
  test: async () => $e("video/webm"),
  add: async (i) => [...i, "webm"],
  remove: async (i) => i.filter((t) => t !== "webm")
}, yo = {
  extension: {
    type: "ExtensionType.DetectionParser",
    priority: 0
  },
  test: async () => ii(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (i) => [...i, "webp"],
  remove: async (i) => i.filter((t) => t !== "webp")
};
function go(i, t) {
  if (Array.isArray(t)) {
    for (const e of t)
      if (i.startsWith(`data:${e}`)) return !0;
    return !1;
  }
  return i.startsWith(`data:${t}`);
}
function xo(i, t) {
  const e = i.split("?")[0], s = He.extname(e).toLowerCase();
  return Array.isArray(t) ? t.includes(s) : s === t;
}
const _o = (i, t) => {
  const e = t.split("?")[1];
  return e && (i += `?${e}`), i;
};
export {
  lo as BackgroundLoader,
  oo as BigPool,
  Tn as BufferImageSource,
  bt as Cache,
  Yr as CanvasPool,
  Jn as CanvasPoolClass,
  tr as CanvasSource,
  Ue as Circle,
  W as Color,
  Or as CompressedSource,
  Qr as DATA_URI,
  Mr as DEG_TO_RAD,
  Be as DEPRECATED_SCALE_MODES,
  Le as DEPRECATED_WRAP_MODES,
  J as DOMAdapter,
  De as Ellipse,
  Ui as EventBoundary,
  Y as EventEmitter,
  ce as EventSystem,
  rt as EventsTicker,
  wr as FederatedContainer,
  de as FederatedEvent,
  le as FederatedMouseEvent,
  Q as FederatedPointerEvent,
  Te as FederatedWheelEvent,
  ot as FillGradient,
  kn as FillPattern,
  Re as Graphics,
  $ as GraphicsContext,
  Mt as GraphicsPath,
  as as ImageSource,
  N as Matrix,
  Zs as NOOP,
  At as ObservablePoint,
  Ni as PI_2,
  F as Point,
  Yt as Polygon,
  yr as Pool,
  gr as PoolGroupClass,
  Pr as RAD_TO_DEG,
  H as Rectangle,
  Js as RenderTexture,
  pr as Resolver,
  Oe as RoundedRectangle,
  Dr as SCALE_MODES,
  Wn as SVGParser,
  Dn as ShapePath,
  ho as SystemRunner,
  O as Texture,
  ei as TextureGCSystem,
  Sn as TextureMatrix,
  Nr as TexturePool,
  ir as TexturePoolClass,
  j as TextureSource,
  fe as TextureStyle,
  Hr as TextureUvs,
  U as Ticker,
  _e as TickerListener,
  no as Transform,
  Ns as Triangle,
  he as UPDATE_PRIORITY,
  Es as VERSION,
  ti as VideoSource,
  io as ViewableBuffer,
  Ur as WRAP_MODES,
  vr as autoDetectEnvironment,
  Gr as autoDetectSource,
  Hs as buildAdaptiveBezier,
  Ji as buildAdaptiveQuadratic,
  $s as buildArc,
  en as buildArcTo,
  rn as buildArcToSvg,
  ue as buildCircle,
  Sr as buildEllipse,
  kr as buildLine,
  Ir as buildPixelLine,
  Fr as buildPolygon,
  Rr as buildRectangle,
  Cr as buildRoundedRectangle,
  Lr as buildTriangle,
  go as checkDataUrl,
  xo as checkExtension,
  to as cleanArray,
  Jr as cleanHash,
  Ws as closePointEps,
  tt as colord,
  _t as convertToList,
  _o as copySearchParams,
  fr as createStringVariations,
  ts as curveEps,
  co as detectAvif,
  uo as detectDefaults,
  fo as detectMp4,
  po as detectOgv,
  er as detectVideoAlphaMode,
  mo as detectWebm,
  yo as detectWebp,
  wn as earcut,
  Ci as extend,
  Us as extensions,
  ps as extractSvgUrlId,
  Xr as generateTextureMatrix,
  Kr as getCanvasBoundingBox,
  $r as getCanvasTexture,
  br as getFormat,
  on as getOrientationOfPoints,
  ro as getResolutionOfUrl,
  nr as getSupportedCompressedTextureFormats,
  Vr as getSupportedTextureFormats,
  mr as getUrlExtension,
  S as groupD8,
  Wr as hasCachedCanvasTexture,
  Qe as isPow2,
  qr as isSafari,
  Ts as isSingleItem,
  jr as isWebGLSupported,
  zr as isWebGPUSupported,
  Ii as loadEnvironmentExtensions,
  Er as log2,
  wt as nextPow2,
  rr as nonCompressedFormats,
  zt as normalizeExtensionPriority,
  On as parseSVGDefinitions,
  X as parseSVGFloatAttribute,
  Bn as parseSVGPath,
  Ks as parseSVGStyle,
  He as path,
  Tr as pointInTriangle,
  Ar as random,
  eo as removeItems,
  Br as resetUids,
  ar as resourceToTexture,
  Xn as roundedShapeArc,
  Yn as roundedShapeQuadraticCurve,
  ao as sayHello,
  oe as squaredDistanceToLineSegment,
  ms as styleAttributes,
  ii as testImageFormat,
  $e as testVideoFormat,
  hr as textureFrom,
  Xt as toFillStyle,
  As as toStrokeStyle,
  Pn as triangulateWithHoles,
  et as uid,
  Zr as unsafeEvalSupported,
  so as updateQuadBounds
};
