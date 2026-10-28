const DEFAULTS = {
  fontFamily: "sans-serif",
  fontWeight: "normal",
  fontStyle: "normal",
  fontSize: 12,
  fontVariations: null,
  // 单位是千分之一 em，与原文 letterTracking 一致。
  letterTracking: 0,
  letterKerning: null,
  baselineShift: 0,
  baselinePosition: "normal",
  letterScaling: 1,
  letterRotation: 0,
  capitals: "normal",
  underline: false,
  strikethrough: false,
  features: null,
  lineHeight: "auto",
  justification: "left",
  justifyLast: "left",
  justifySpacing: null,
  startIndent: 0,
  endIndent: 0,
  firstLineIndent: 0,
  spaceBefore: 0,
  spaceAfter: 0,
  hyphenation: false,
  composer: "paragraph",
  lineWrap: "normal",
  tabs: null,
  direction: null
};
const KEYS = Object.keys(DEFAULTS);
function styleValueEquals(a, b) {
  if (a === b)
    return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length)
      return false;
    for (let i = 0; i < a.length; i++) {
      if (!styleValueEquals(a[i], b[i]))
        return false;
    }
    return true;
  }
  return false;
}
function parseSize(size) {
  if (typeof size === "number")
    return size;
  const value = parseFloat(size);
  if (isNaN(value))
    return 0;
  if (/pt/i.test(size))
    return value * 4 / 3;
  if (/em/i.test(size))
    return value * 12;
  if (/%/.test(size))
    return value / 100 * 12;
  return value;
}
class TextStyle {
  /** 默认值表（供 TextStory 等按 key 遍历）。 */
  static defaults = DEFAULTS;
  /** 实例上的默认值表，对应原文的 `style._defaults`。 */
  _defaults = DEFAULTS;
  /** 上下标的基线偏移比例，对应原文 `Style#_scriptShift`（Style.js 第 444 行）。 */
  _scriptShift = 0.333;
  /** 只保存显式设置过的属性。 */
  _values = {};
  /** 归属者：TextStory / TextRange / TextItem。 */
  _owner;
  constructor(values, owner) {
    this._owner = owner || null;
    if (values)
      this.setValues(values);
  }
  // ---------------------------------------------------------------------
  // 通用读写
  /** 所有可设置属性名。 */
  keys() {
    return KEYS.slice();
  }
  /** key 是否是文本样式属性。 */
  has(key) {
    return key in DEFAULTS;
  }
  /** 读取属性，未显式设置时回退到默认值。 */
  get(key) {
    const value = this._values[key], result = value === void 0 ? DEFAULTS[key] : value;
    return result;
  }
  /** 设置属性；值有变化时通知 owner。 */
  set(key, value) {
    if (!(key in DEFAULTS))
      return;
    if (this._values[key] !== value) {
      this._values[key] = value;
      this._changed();
    }
  }
  /** 批量设置：接受另一个 TextStyle 或普通对象，只取文本样式属性。 */
  setValues(values) {
    const source = values instanceof TextStyle ? values._values : values;
    if (!source)
      return;
    for (const key in source) {
      if (key in DEFAULTS)
        this.set(key, source[key]);
    }
  }
  _changed() {
    const owner = this._owner;
    if (owner && typeof owner._changed === "function")
      owner._changed();
  }
  /** 两个样式的有效值是否完全一致。 */
  equals(style) {
    if (style === this)
      return true;
    if (!style)
      return false;
    for (let i = 0; i < KEYS.length; i++) {
      const key = KEYS[i];
      if (!styleValueEquals(this.get(key), style.get(key)))
        return false;
    }
    return true;
  }
  // ---------------------------------------------------------------------
  // 字体
  /**
   * 拼出 CSS font 字符串，对应原文 `Style#_getCanvasFont()`：
   * `fontStyle fontWeight fontSize px families`，family 需要时加引号。
   */
  _getCanvasFont() {
    const size = this.get("fontSize"), sizeText = typeof size === "number" ? size + "px" : /[a-z%]/i.test(size) ? size : size + "px", families = this.get("fontFamily").split(",").map(function(family) {
      family = family.trim();
      return /^(["'].*|[a-z-]+)$/i.test(family) ? family : '"' + family.replace(/["\\]/g, "\\$&") + '"';
    }).join(", "), style = this.get("fontStyle");
    return (style !== "normal" ? style + " " : "") + this.get("fontWeight") + " " + sizeText + " " + families;
  }
  /** {@link _getCanvasFont} 的别名。 */
  getFont() {
    return this._getCanvasFont();
  }
  /** 字号（像素）。 */
  _getFontSize() {
    return parseSize(this.get("fontSize"));
  }
  /**
   * 行高（像素）。
   * `'auto'` 取 1.2 倍字号；数字按字号的倍数；带单位的字符串按像素规则解析。
   */
  _getLineHeight() {
    const lineHeight = this.get("lineHeight");
    if (lineHeight === "auto")
      return 1.2 * this._getFontSize();
    return typeof lineHeight === "number" ? lineHeight * this._getFontSize() : parseSize(lineHeight);
  }
  /**
   * 行高，以固定长度表示，对应原文 `Style#getLeading()`（Style.js 第 481 行）。
   */
  getLeading() {
    return this._getLineHeight();
  }
  /** 设置行高：null 表示 `'auto'`，数字换算成 px。 */
  setLeading(leading) {
    this.set("lineHeight", leading == null ? "auto" : typeof leading === "number" ? leading + "px" : leading);
  }
  // ---------------------------------------------------------------------
  // 字符属性
  get fontFamily() {
    return this.get("fontFamily");
  }
  set fontFamily(value) {
    this.set("fontFamily", value);
  }
  get fontWeight() {
    return this.get("fontWeight");
  }
  set fontWeight(value) {
    this.set("fontWeight", value);
  }
  get fontStyle() {
    return this.get("fontStyle");
  }
  set fontStyle(value) {
    this.set("fontStyle", value);
  }
  get fontSize() {
    return this.get("fontSize");
  }
  set fontSize(value) {
    this.set("fontSize", value);
  }
  get fontVariations() {
    return this.get("fontVariations");
  }
  set fontVariations(value) {
    this.set("fontVariations", value);
  }
  /** 字距，单位千分之一 em。 */
  get letterTracking() {
    return this.get("letterTracking");
  }
  set letterTracking(value) {
    this.set("letterTracking", value);
  }
  /** 字距转换成 canvas 的 `letterSpacing`（em 单位）。 */
  _getCanvasLetterSpacing() {
    return this.get("letterTracking") / 1e3 + "em";
  }
  get letterKerning() {
    return this.get("letterKerning");
  }
  set letterKerning(value) {
    this.set("letterKerning", value);
  }
  get baselineShift() {
    return this.get("baselineShift");
  }
  set baselineShift(value) {
    this.set("baselineShift", value);
  }
  get baselinePosition() {
    return this.get("baselinePosition");
  }
  set baselinePosition(value) {
    this.set("baselinePosition", value);
  }
  /** 字形横向缩放，数字或 Point。 */
  get letterScaling() {
    return this.get("letterScaling");
  }
  set letterScaling(value) {
    this.set("letterScaling", value);
  }
  get letterRotation() {
    return this.get("letterRotation");
  }
  set letterRotation(value) {
    this.set("letterRotation", value);
  }
  get capitals() {
    return this.get("capitals");
  }
  set capitals(value) {
    this.set("capitals", value);
  }
  get underline() {
    return this.get("underline");
  }
  set underline(value) {
    this.set("underline", value);
  }
  get strikethrough() {
    return this.get("strikethrough");
  }
  set strikethrough(value) {
    this.set("strikethrough", value);
  }
  get features() {
    return this.get("features");
  }
  set features(value) {
    this.set("features", value);
  }
  get lineHeight() {
    return this.get("lineHeight");
  }
  set lineHeight(value) {
    this.set("lineHeight", value);
  }
  // ---------------------------------------------------------------------
  // 段落属性
  get justification() {
    return this.get("justification");
  }
  set justification(value) {
    this.set("justification", value);
  }
  get justifyLast() {
    return this.get("justifyLast");
  }
  set justifyLast(value) {
    this.set("justifyLast", value);
  }
  get justifySpacing() {
    return this.get("justifySpacing");
  }
  set justifySpacing(value) {
    this.set("justifySpacing", value);
  }
  get startIndent() {
    return this.get("startIndent");
  }
  set startIndent(value) {
    this.set("startIndent", value);
  }
  get endIndent() {
    return this.get("endIndent");
  }
  set endIndent(value) {
    this.set("endIndent", value);
  }
  get firstLineIndent() {
    return this.get("firstLineIndent");
  }
  set firstLineIndent(value) {
    this.set("firstLineIndent", value);
  }
  get spaceBefore() {
    return this.get("spaceBefore");
  }
  set spaceBefore(value) {
    this.set("spaceBefore", value);
  }
  get spaceAfter() {
    return this.get("spaceAfter");
  }
  set spaceAfter(value) {
    this.set("spaceAfter", value);
  }
  get hyphenation() {
    return this.get("hyphenation");
  }
  set hyphenation(value) {
    this.set("hyphenation", value);
  }
  get composer() {
    return this.get("composer");
  }
  set composer(value) {
    this.set("composer", value);
  }
  get lineWrap() {
    return this.get("lineWrap");
  }
  set lineWrap(value) {
    this.set("lineWrap", value);
  }
  get tabs() {
    return this.get("tabs");
  }
  set tabs(value) {
    this.set("tabs", value);
  }
  get direction() {
    return this.get("direction");
  }
  set direction(value) {
    this.set("direction", value);
  }
  // ---------------------------------------------------------------------
  // 多份样式的合并 / 应用（对应原文 Style.merge / Style.apply）
  /** 这些样式在 key 上共同的值；不一致时返回 undefined。 */
  static merge(styles, key) {
    let value;
    for (let i = 0; i < styles.length; i++) {
      const other = styles[i].get(key);
      if (!i) {
        value = other;
      } else if (!styleValueEquals(value, other)) {
        return void 0;
      }
    }
    return value;
  }
  /** 把 key 设置为 value，应用到所有样式。 */
  static apply(styles, key, value) {
    for (let i = 0; i < styles.length; i++)
      styles[i].set(key, value);
  }
}
export {
  TextStyle,
  styleValueEquals
};
