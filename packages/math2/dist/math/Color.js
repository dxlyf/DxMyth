var ColorIndex = /* @__PURE__ */ ((ColorIndex2) => {
  ColorIndex2[ColorIndex2["R"] = 0] = "R";
  ColorIndex2[ColorIndex2["G"] = 1] = "G";
  ColorIndex2[ColorIndex2["B"] = 2] = "B";
  ColorIndex2[ColorIndex2["A"] = 3] = "A";
  return ColorIndex2;
})(ColorIndex || {});
const colorMap = {
  "aliceblue": Float32Array.of(0.941, 0.973, 1, 1),
  "antiquewhite": Float32Array.of(0.98, 0.922, 0.843, 1),
  "aqua": Float32Array.of(0, 1, 1, 1),
  "aquamarine": Float32Array.of(0.498, 1, 0.831, 1),
  "azure": Float32Array.of(0.941, 1, 1, 1),
  "beige": Float32Array.of(0.961, 0.961, 0.863, 1),
  "bisque": Float32Array.of(1, 0.894, 0.769, 1),
  "black": Float32Array.of(0, 0, 0, 1),
  "blanchedalmond": Float32Array.of(1, 0.922, 0.804, 1),
  "blue": Float32Array.of(0, 0, 1, 1),
  "blueviolet": Float32Array.of(0.541, 0.169, 0.886, 1),
  "brown": Float32Array.of(0.647, 0.165, 0.165, 1),
  "burlywood": Float32Array.of(0.871, 0.722, 0.529, 1),
  "cadetblue": Float32Array.of(0.373, 0.62, 0.627, 1),
  "chartreuse": Float32Array.of(0.498, 1, 0, 1),
  "chocolate": Float32Array.of(0.824, 0.412, 0.118, 1),
  "coral": Float32Array.of(1, 0.498, 0.314, 1),
  "cornflowerblue": Float32Array.of(0.392, 0.584, 0.929, 1),
  "cornsilk": Float32Array.of(1, 0.973, 0.863, 1),
  "crimson": Float32Array.of(0.863, 0.078, 0.235, 1),
  "cyan": Float32Array.of(0, 1, 1, 1),
  "darkblue": Float32Array.of(0, 0, 0.545, 1),
  "darkcyan": Float32Array.of(0, 0.545, 0.545, 1),
  "darkgoldenrod": Float32Array.of(0.722, 0.525, 0.043, 1),
  "darkgray": Float32Array.of(0.663, 0.663, 0.663, 1),
  "darkgreen": Float32Array.of(0, 0.392, 0, 1),
  "darkgrey": Float32Array.of(0.663, 0.663, 0.663, 1),
  "darkkhaki": Float32Array.of(0.741, 0.718, 0.42, 1),
  "darkmagenta": Float32Array.of(0.545, 0, 0.545, 1),
  "darkolivegreen": Float32Array.of(0.333, 0.42, 0.184, 1),
  "darkorange": Float32Array.of(1, 0.549, 0, 1),
  "darkorchid": Float32Array.of(0.6, 0.196, 0.8, 1),
  "darkred": Float32Array.of(0.545, 0, 0, 1),
  "darksalmon": Float32Array.of(0.914, 0.588, 0.478, 1),
  "darkseagreen": Float32Array.of(0.561, 0.737, 0.561, 1),
  "darkslateblue": Float32Array.of(0.282, 0.239, 0.545, 1),
  "darkslategray": Float32Array.of(0.184, 0.31, 0.31, 1),
  "darkslategrey": Float32Array.of(0.184, 0.31, 0.31, 1),
  "darkturquoise": Float32Array.of(0, 0.808, 0.82, 1),
  "darkviolet": Float32Array.of(0.58, 0, 0.827, 1),
  "deeppink": Float32Array.of(1, 0.078, 0.576, 1),
  "deepskyblue": Float32Array.of(0, 0.749, 1, 1),
  "dimgray": Float32Array.of(0.412, 0.412, 0.412, 1),
  "dimgrey": Float32Array.of(0.412, 0.412, 0.412, 1),
  "dodgerblue": Float32Array.of(0.118, 0.565, 1, 1),
  "firebrick": Float32Array.of(0.698, 0.133, 0.133, 1),
  "floralwhite": Float32Array.of(1, 0.98, 0.941, 1),
  "forestgreen": Float32Array.of(0.133, 0.545, 0.133, 1),
  "fuchsia": Float32Array.of(1, 0, 1, 1),
  "gainsboro": Float32Array.of(0.863, 0.863, 0.863, 1),
  "ghostwhite": Float32Array.of(0.973, 0.973, 1, 1),
  "gold": Float32Array.of(1, 0.843, 0, 1),
  "goldenrod": Float32Array.of(0.855, 0.647, 0.125, 1),
  "gray": Float32Array.of(0.502, 0.502, 0.502, 1),
  "green": Float32Array.of(0, 0.502, 0, 1),
  "greenyellow": Float32Array.of(0.678, 1, 0.184, 1),
  "grey": Float32Array.of(0.502, 0.502, 0.502, 1),
  "honeydew": Float32Array.of(0.941, 1, 0.941, 1),
  "hotpink": Float32Array.of(1, 0.412, 0.706, 1),
  "indianred": Float32Array.of(0.804, 0.361, 0.361, 1),
  "indigo": Float32Array.of(0.294, 0, 0.51, 1),
  "ivory": Float32Array.of(1, 1, 0.941, 1),
  "khaki": Float32Array.of(0.941, 0.902, 0.549, 1),
  "lavender": Float32Array.of(0.902, 0.902, 0.98, 1),
  "lavenderblush": Float32Array.of(1, 0.941, 0.961, 1),
  "lawngreen": Float32Array.of(0.486, 0.988, 0, 1),
  "lemonchiffon": Float32Array.of(1, 0.98, 0.804, 1),
  "lightblue": Float32Array.of(0.678, 0.847, 0.902, 1),
  "lightcoral": Float32Array.of(0.941, 0.502, 0.502, 1),
  "lightcyan": Float32Array.of(0.878, 1, 1, 1),
  "lightgoldenrodyellow": Float32Array.of(0.98, 0.98, 0.824, 1),
  "lightgray": Float32Array.of(0.827, 0.827, 0.827, 1),
  "lightgreen": Float32Array.of(0.565, 0.933, 0.565, 1),
  "lightgrey": Float32Array.of(0.827, 0.827, 0.827, 1),
  "lightpink": Float32Array.of(1, 0.714, 0.757, 1),
  "lightsalmon": Float32Array.of(1, 0.627, 0.478, 1),
  "lightseagreen": Float32Array.of(0.125, 0.698, 0.667, 1),
  "lightskyblue": Float32Array.of(0.529, 0.808, 0.98, 1),
  "lightslategray": Float32Array.of(0.467, 0.533, 0.6, 1),
  "lightslategrey": Float32Array.of(0.467, 0.533, 0.6, 1),
  "lightsteelblue": Float32Array.of(0.69, 0.769, 0.871, 1),
  "lightyellow": Float32Array.of(1, 1, 0.878, 1),
  "lime": Float32Array.of(0, 1, 0, 1),
  "limegreen": Float32Array.of(0.196, 0.804, 0.196, 1),
  "linen": Float32Array.of(0.98, 0.941, 0.902, 1),
  "magenta": Float32Array.of(1, 0, 1, 1),
  "maroon": Float32Array.of(0.502, 0, 0, 1),
  "mediumaquamarine": Float32Array.of(0.4, 0.804, 0.667, 1),
  "mediumblue": Float32Array.of(0, 0, 0.804, 1),
  "mediumorchid": Float32Array.of(0.729, 0.333, 0.827, 1),
  "mediumpurple": Float32Array.of(0.576, 0.439, 0.859, 1),
  "mediumseagreen": Float32Array.of(0.235, 0.702, 0.443, 1),
  "mediumslateblue": Float32Array.of(0.482, 0.408, 0.933, 1),
  "mediumspringgreen": Float32Array.of(0, 0.98, 0.604, 1),
  "mediumturquoise": Float32Array.of(0.282, 0.82, 0.8, 1),
  "mediumvioletred": Float32Array.of(0.78, 0.082, 0.522, 1),
  "midnightblue": Float32Array.of(0.098, 0.098, 0.439, 1),
  "mintcream": Float32Array.of(0.961, 1, 0.98, 1),
  "mistyrose": Float32Array.of(1, 0.894, 0.882, 1),
  "moccasin": Float32Array.of(1, 0.894, 0.71, 1),
  "navajowhite": Float32Array.of(1, 0.871, 0.678, 1),
  "navy": Float32Array.of(0, 0, 0.502, 1),
  "oldlace": Float32Array.of(0.992, 0.961, 0.902, 1),
  "olive": Float32Array.of(0.502, 0.502, 0, 1),
  "olivedrab": Float32Array.of(0.42, 0.557, 0.137, 1),
  "orange": Float32Array.of(1, 0.647, 0, 1),
  "orangered": Float32Array.of(1, 0.271, 0, 1),
  "orchid": Float32Array.of(0.855, 0.439, 0.839, 1),
  "palegoldenrod": Float32Array.of(0.933, 0.91, 0.667, 1),
  "palegreen": Float32Array.of(0.596, 0.984, 0.596, 1),
  "paleturquoise": Float32Array.of(0.686, 0.933, 0.933, 1),
  "palevioletred": Float32Array.of(0.859, 0.439, 0.576, 1),
  "papayawhip": Float32Array.of(1, 0.937, 0.835, 1),
  "peachpuff": Float32Array.of(1, 0.855, 0.725, 1),
  "peru": Float32Array.of(0.804, 0.522, 0.247, 1),
  "pink": Float32Array.of(1, 0.753, 0.796, 1),
  "plum": Float32Array.of(0.867, 0.627, 0.867, 1),
  "powderblue": Float32Array.of(0.69, 0.878, 0.902, 1),
  "purple": Float32Array.of(0.502, 0, 0.502, 1),
  "rebeccapurple": Float32Array.of(0.4, 0.2, 0.6, 1),
  "red": Float32Array.of(1, 0, 0, 1),
  "rosybrown": Float32Array.of(0.737, 0.561, 0.561, 1),
  "royalblue": Float32Array.of(0.255, 0.412, 0.882, 1),
  "saddlebrown": Float32Array.of(0.545, 0.271, 0.075, 1),
  "salmon": Float32Array.of(0.98, 0.502, 0.447, 1),
  "sandybrown": Float32Array.of(0.957, 0.643, 0.376, 1),
  "seagreen": Float32Array.of(0.18, 0.545, 0.341, 1),
  "seashell": Float32Array.of(1, 0.961, 0.933, 1),
  "sienna": Float32Array.of(0.627, 0.322, 0.176, 1),
  "silver": Float32Array.of(0.753, 0.753, 0.753, 1),
  "skyblue": Float32Array.of(0.529, 0.808, 0.922, 1),
  "slateblue": Float32Array.of(0.416, 0.353, 0.804, 1),
  "slategray": Float32Array.of(0.439, 0.502, 0.565, 1),
  "slategrey": Float32Array.of(0.439, 0.502, 0.565, 1),
  "snow": Float32Array.of(1, 0.98, 0.98, 1),
  "springgreen": Float32Array.of(0, 1, 0.498, 1),
  "steelblue": Float32Array.of(0.275, 0.51, 0.706, 1),
  "tan": Float32Array.of(0.824, 0.706, 0.549, 1),
  "teal": Float32Array.of(0, 0.502, 0.502, 1),
  "thistle": Float32Array.of(0.847, 0.749, 0.847, 1),
  "tomato": Float32Array.of(1, 0.388, 0.278, 1),
  "transparent": Float32Array.of(0, 0, 0, 0),
  "turquoise": Float32Array.of(0.251, 0.878, 0.816, 1),
  "violet": Float32Array.of(0.933, 0.51, 0.933, 1),
  "wheat": Float32Array.of(0.961, 0.871, 0.702, 1),
  "white": Float32Array.of(1, 1, 1, 1),
  "whitesmoke": Float32Array.of(0.961, 0.961, 0.961, 1),
  "yellow": Float32Array.of(1, 1, 0, 1),
  "yellowgreen": Float32Array.of(0.604, 0.804, 0.196, 1)
};
class Color extends Float32Array {
  static TRANSPARENT = new Color(0, 0, 0, 0);
  static BLACK = new Color(0, 0, 0, 1);
  static WHITE = new Color(1, 1, 1, 1);
  // ---- 静态工厂 ----
  static toCSS_RGBA(color) {
    return `rgba(${color[0] * 255},${color[1] * 255},${color[2] * 255},${color[3]})`;
  }
  static toHex(color) {
    return `#${(color[0] * 255).toString(16).padStart(2, "0")}${(color[1] * 255).toString(16).padStart(2, "0")}${(color[2] * 255).toString(16).padStart(2, "0")}`;
  }
  static fromRGBA(r, g, b, a = 1) {
    return new Color(r, g, b, a);
  }
  /** 从 0-255 字节值创建（自动归一化） */
  static fromBytes(r, g, b, a = 255) {
    return new Color(r / 255, g / 255, b / 255, a / 255);
  }
  /** 从 ColorValue 创建 */
  static fromColorValue(v) {
    return new Color(v[0], v[1], v[2], v[3] ?? 1);
  }
  static isColor(input) {
    const color = Color.tryFromInput(input);
    return color !== void 0;
  }
  /**
   * 从多种格式字符串、数值或数组解析颜色。
   *
   * 支持格式:
   *   - 0xRRGGBB / 0xRRGGBBAA  (十六进制数值)
   *   - "#RGB" / "#RRGGBB" / "#RGBA" / "#RRGGBBAA"  (hex 字符串)
   *   - "rgb(r, g, b)" / "rgba(r, g, b, a)"
   *   - "hsl(h, s%, l%)" / "hsla(h, s%, l%, a)"
   *   - "hsv(h, s%, v%)" / "hsva(h, s%, v%, a)"
   *   - [r, g, b, a?]  (归一化 0-1 数值数组，a 可选，默认 1)
   *   - 关键词 "transparent" → rgba(0,0,0,0)
   */
  static fromInput(input) {
    const color = Color.tryFromInput(input);
    if (color) {
      return color;
    }
    return new Color(0, 0, 0, 1);
  }
  static tryFromInput(input) {
    if (typeof input === "number") {
      return Color._fromHexNumber(input);
    }
    if (Array.isArray(input) && typeof input[0] === "number" || input instanceof Float32Array) {
      return new Color(input[0], input[1], input[2], input[3] ?? 1);
    }
    if (typeof input === "string") {
      const s = input.trim();
      if (s === "transparent") {
        return new Color(0, 0, 0, 0);
      }
      if (s.startsWith("#")) {
        return Color._fromHexString(s);
      }
      const lower = s.toLowerCase();
      if (lower.startsWith("rgba(") || lower.startsWith("rgb(")) {
        return Color._fromRGBString(lower);
      }
      if (lower.startsWith("hsla(") || lower.startsWith("hsl(")) {
        return Color._fromHSLString(lower);
      }
      if (lower.startsWith("hsva(") || lower.startsWith("hsv(")) {
        return Color._fromHSVString(lower);
      }
      if (colorMap[lower]) {
        const color = colorMap[lower];
        return new Color(color[0], color[1], color[2], color[3]);
      }
    }
    return null;
  }
  // ---- 内部解析 ----
  /** "0xRRGGBB" 或 "0xRRGGBBAA" 十六进制整数 */
  static _fromHexNumber(n) {
    const hasAlpha = n > 16777215;
    if (hasAlpha) {
      return new Color(
        (n >>> 24 & 255) / 255,
        (n >>> 16 & 255) / 255,
        (n >>> 8 & 255) / 255,
        (n & 255) / 255
      );
    }
    return new Color(
      (n >>> 16 & 255) / 255,
      (n >>> 8 & 255) / 255,
      (n & 255) / 255,
      1
    );
  }
  /** "#RGB" / "#RRGGBB" / "#RGBA" / "#RRGGBBAA" */
  static _fromHexString(hex) {
    let h = hex.slice(1);
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    } else if (h.length === 4) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    }
    return new Color(
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
      h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
    );
  }
  /** "rgb(r, g, b)" / "rgba(r, g, b, a)" */
  static _fromRGBString(s) {
    const match = s.match(/[\d.]+/g);
    if (!match || match.length < 3) return new Color(0, 0, 0, 1);
    return new Color(
      Math.max(0, Math.min(1, parseFloat(match[0]) / 255)),
      Math.max(0, Math.min(1, parseFloat(match[1]) / 255)),
      Math.max(0, Math.min(1, parseFloat(match[2]) / 255)),
      Math.max(0, Math.min(1, match.length >= 4 ? parseFloat(match[3]) : 1))
    );
  }
  /** "hsl(h, s%, l%)" / "hsla(h, s%, l%, a)" */
  static _fromHSLString(s) {
    const match = s.match(/[\d.]+/g);
    if (!match || match.length < 3) return new Color(0, 0, 0, 1);
    return Color._hslToRgba(
      parseFloat(match[0]) / 360,
      parseFloat(match[1]) / 100,
      parseFloat(match[2]) / 100,
      match.length >= 4 ? parseFloat(match[3]) : 1
    );
  }
  /** "hsv(h, s%, v%)" / "hsva(h, s%, v%, a)" */
  static _fromHSVString(s) {
    const match = s.match(/[\d.]+/g);
    if (!match || match.length < 3) return new Color(0, 0, 0, 1);
    return Color._hsvToRgba(
      parseFloat(match[0]) / 360,
      parseFloat(match[1]) / 100,
      parseFloat(match[2]) / 100,
      match.length >= 4 ? parseFloat(match[3]) : 1
    );
  }
  // ---- HSL / HSV → Color ----
  static _hslToRgba(h, s, l, a) {
    if (s === 0) {
      return new Color(l, l, l, a);
    }
    const hue2rgb = (p2, q2, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
      if (t < 1 / 2) return q2;
      if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
      return p2;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return new Color(
      hue2rgb(p, q, h + 1 / 3),
      hue2rgb(p, q, h),
      hue2rgb(p, q, h - 1 / 3),
      a
    );
  }
  static _hsvToRgba(h, s, v, a) {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let r, g, b;
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      default:
        r = v;
        g = p;
        b = q;
        break;
    }
    return new Color(r, g, b, a);
  }
  // ==================== 实例 API ====================
  constructor(r = 0, g = 0, b = 0, a = 1) {
    super(4);
    this[0] = r;
    this[1] = g;
    this[2] = b;
    this[3] = a;
  }
  // ---- 命名属性访问器 ----
  get r() {
    return this[0];
  }
  set r(v) {
    this[0] = v;
  }
  get g() {
    return this[1];
  }
  set g(v) {
    this[1] = v;
  }
  get b() {
    return this[2];
  }
  set b(v) {
    this[2] = v;
  }
  get a() {
    return this[3];
  }
  set a(v) {
    this[3] = v;
  }
  // ---- 写入 ----
  fromValues(r, g, b, a = 1) {
    this[0] = r;
    this[1] = g;
    this[2] = b;
    this[3] = a;
    return this;
  }
  copy(c) {
    this[0] = c[0];
    this[1] = c[1];
    this[2] = c[2];
    this[3] = c[3];
    return this;
  }
  // ---- 输出 ----
  /** 转为 CSS rgba() 字符串 */
  toRGBAString() {
    return `rgba(${Math.round(this[0] * 255)},${Math.round(this[1] * 255)},${Math.round(this[2] * 255)},${this[3]})`;
  }
  /** 转为 CSS hex 字符串 */
  toHexString() {
    const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
    const hex = `#${toHex(this[0])}${toHex(this[1])}${toHex(this[2])}`;
    return this[3] < 1 ? hex + toHex(this[3]) : hex;
  }
  clone() {
    return new Color(this[0], this[1], this[2], this[3]);
  }
  toString() {
    return this.toRGBAString();
  }
  // ==================== 颜色空间转换 ====================
  /** 获取 HSL 表示 { h:0-360, s:0-1, l:0-1 } */
  toHSL() {
    const r = this[0], g = this[1], b = this[2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
    return { h: h * 360, s, l };
  }
  /** 从 HSL 设置颜色值 */
  fromHSL(h, s, l, a = this[3]) {
    const c = Color._hslToRgba(h / 360, s, l, a);
    this[0] = c[0];
    this[1] = c[1];
    this[2] = c[2];
    this[3] = c[3];
    return this;
  }
  /** 获取 HSV 表示 { h:0-360, s:0-1, v:0-1 } */
  toHSV() {
    const r = this[0], g = this[1], b = this[2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const v = max;
    const s = max === 0 ? 0 : d / max;
    if (d === 0) return { h: 0, s, v };
    let h = 0;
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
    return { h: h * 360, s, v };
  }
  // ---- 亮度 ----
  /** 相对亮度（ITU-R BT.709，用于 WCAG 对比度计算） */
  luminance() {
    const linearize = (c) => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    return 0.2126 * linearize(this[0]) + 0.7152 * linearize(this[1]) + 0.0722 * linearize(this[2]);
  }
  /** WCAG 对比度比率 */
  contrastRatio(other) {
    const l1 = this.luminance() + 0.05;
    const l2 = other.luminance() + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
  }
  /** 感知亮度（加权灰度值） */
  get brightness() {
    return 0.299 * this[0] + 0.587 * this[1] + 0.114 * this[2];
  }
  // ---- 颜色变换（就地修改） ----
  /** 变亮 */
  brighten(amount) {
    const hsl = this.toHSL();
    hsl.l = Math.min(1, hsl.l + amount);
    return this.fromHSL(hsl.h, hsl.s, hsl.l);
  }
  /** 变暗 */
  darken(amount) {
    const hsl = this.toHSL();
    hsl.l = Math.max(0, hsl.l - amount);
    return this.fromHSL(hsl.h, hsl.s, hsl.l);
  }
  /** 增加饱和度 */
  saturate(amount) {
    const hsl = this.toHSL();
    hsl.s = Math.min(1, hsl.s + amount);
    return this.fromHSL(hsl.h, hsl.s, hsl.l);
  }
  /** 降低饱和度 */
  desaturate(amount) {
    const hsl = this.toHSL();
    hsl.s = Math.max(0, hsl.s - amount);
    return this.fromHSL(hsl.h, hsl.s, hsl.l);
  }
  /** 完全去饱和转为灰度 */
  grayscale() {
    const gray = this.brightness;
    this[0] = gray;
    this[1] = gray;
    this[2] = gray;
    return this;
  }
  /** 反转颜色 */
  invert() {
    this[0] = 1 - this[0];
    this[1] = 1 - this[1];
    this[2] = 1 - this[2];
    return this;
  }
  /** 色调旋转（角度制） */
  rotateHue(angle) {
    const hsl = this.toHSL();
    hsl.h = (hsl.h + angle) % 360;
    if (hsl.h < 0) hsl.h += 360;
    return this.fromHSL(hsl.h, hsl.s, hsl.l);
  }
  /** 设置不透明度 */
  setAlpha(a) {
    this[3] = Math.max(0, Math.min(1, a));
    return this;
  }
  /** 叠加混合（Porter-Duff over） */
  blendOver(src) {
    const sa = src[3], da = this[3];
    const ao = sa + da * (1 - sa);
    if (ao === 0) {
      this[0] = this[1] = this[2] = this[3] = 0;
      return this;
    }
    this[0] = (src[0] * sa + this[0] * da * (1 - sa)) / ao;
    this[1] = (src[1] * sa + this[1] * da * (1 - sa)) / ao;
    this[2] = (src[2] * sa + this[2] * da * (1 - sa)) / ao;
    this[3] = ao;
    return this;
  }
  /** 与另一个颜色混合 */
  mix(other, t) {
    const mt = 1 - t;
    this[0] = this[0] * mt + other[0] * t;
    this[1] = this[1] * mt + other[1] * t;
    this[2] = this[2] * mt + other[2] * t;
    this[3] = this[3] * mt + other[3] * t;
    return this;
  }
  /** 获取互补色（返回新实例） */
  complementary() {
    return this.clone().rotateHue(180);
  }
  /** 返回前乘以 alpha（预乘 alpha） */
  premultiply() {
    const a = this[3];
    this[0] *= a;
    this[1] *= a;
    this[2] *= a;
    return this;
  }
  // ==================== 静态插值器 ====================
  /** RGB 空间线性插值 */
  static lerp(a, b, t, out = []) {
    const mt = 1 - t;
    out[0] = a[0] * mt + b[0] * t;
    out[1] = a[1] * mt + b[1] * t;
    out[2] = a[2] * mt + b[2] * t;
    out[3] = a[3] * mt + b[3] * t;
    return out;
  }
  /** HSL 空间插值（色相走最短路径），更适合渐变过渡 */
  static lerpHSL(a, b, t, out = new Color()) {
    const ha = a.toHSL(), hb = b.toHSL();
    const mt = 1 - t;
    let dh = hb.h - ha.h;
    if (Math.abs(dh) > 180) {
      dh = dh > 0 ? dh - 360 : dh + 360;
    }
    const h = ha.h + dh * t;
    const s = ha.s * mt + hb.s * t;
    const l = ha.l * mt + hb.l * t;
    const alpha = a[3] * mt + b[3] * t;
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out.fromHSL(h < 0 ? h + 360 : h >= 360 ? h - 360 : h, s, l, alpha);
    return out;
  }
  /** LAB 空间插值（感知均匀），色带过渡最自然 */
  static lerpLAB(a, b, t, out = new Color()) {
    const la = Color._rgbToLAB(a), lb = Color._rgbToLAB(b);
    const mt = 1 - t;
    const lab = {
      l: la.l * mt + lb.l * t,
      a: la.a * mt + lb.a * t,
      b: la.b * mt + lb.b * t
    };
    const alpha = a[3] * mt + b[3] * t;
    Color._labToRGB(lab, out);
    out[3] = alpha;
    return out;
  }
  /** 生成随机颜色 */
  static random(alpha = 1) {
    return new Color(Math.random(), Math.random(), Math.random(), alpha);
  }
  /** 生成随机鲜艳颜色（高饱和度 HSL） */
  static randomVibrant(alpha = 1) {
    const h = Math.random() * 360;
    return new Color().fromHSL(h, 0.7 + Math.random() * 0.3, 0.5 + Math.random() * 0.15, alpha);
  }
  // ---- LAB 内部转换 ----
  static _rgbToLAB(c) {
    const linearize = (v) => {
      v = v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92;
      return v * 100;
    };
    const r = linearize(c[0]), g = linearize(c[1]), b = linearize(c[2]);
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
    const f = (v) => v > 8856e-6 ? Math.cbrt(v) : 7.787 * v + 16 / 116;
    const fx = f(x / 95.047), fy = f(y / 100), fz = f(z / 108.883);
    return {
      l: 116 * fy - 16,
      a: 500 * (fx - fy),
      b: 200 * (fy - fz)
    };
  }
  static _labToRGB(lab, out) {
    const fy = (lab.l + 16) / 116;
    const fx = lab.a / 500 + fy;
    const fz = fy - lab.b / 200;
    const finv = (v) => {
      const v3 = v * v * v;
      return v3 > 8856e-6 ? v3 : (v - 16 / 116) / 7.787;
    };
    const x = finv(fx) * 95.047;
    const y = finv(fy) * 100;
    const z = finv(fz) * 108.883;
    const delinearize = (v) => {
      v /= 100;
      return v > 31308e-7 ? 1.055 * v ** (1 / 2.4) - 0.055 : 12.92 * v;
    };
    out[0] = Math.max(0, Math.min(1, delinearize(x * 3.2404542 + y * -1.5371385 + z * -0.4985314)));
    out[1] = Math.max(0, Math.min(1, delinearize(x * -0.969266 + y * 1.8760108 + z * 0.041556)));
    out[2] = Math.max(0, Math.min(1, delinearize(x * 0.0556434 + y * -0.2040259 + z * 1.0572252)));
  }
}
export {
  Color,
  ColorIndex,
  colorMap
};
