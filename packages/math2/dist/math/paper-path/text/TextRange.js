import { TextStyle, styleValueEquals } from "./TextStyle.js";
class TextRange {
  _story;
  _start;
  _end;
  /** 区间自己的样式，用于 story 没有提供样式的情况。 */
  _style;
  /** 排版时附加的基线（由 TextItem#getLines() 设置）。 */
  baseline;
  /** 排版时附加的包围盒（由 TextItem#getLines() 设置）。 */
  bounds;
  constructor(story, start, end) {
    const length = story._content.length;
    this._story = story;
    this._start = Math.max(0, Math.min(start, length));
    this._end = Math.max(this._start, Math.min(end, length));
    this._style = new TextStyle(null, this);
  }
  // ---------------------------------------------------------------------
  /** 区间所属的 story。 */
  get story() {
    return this._story;
  }
  /** 区间第一个字符的下标。 */
  get start() {
    return this._start;
  }
  /** 区间最后一个字符之后的下标。 */
  get end() {
    return this._end;
  }
  /** 区间的内容。 */
  get content() {
    return this._story._content.slice(this._start, this._end);
  }
  /** 区间自己的样式对象。 */
  get style() {
    return this._style;
  }
  set style(style) {
    this._style.setValues(style);
  }
  // ---------------------------------------------------------------------
  // 样式读写
  /** 区间覆盖的 story 样式（段落样式或 run 样式）。 */
  _getStyles(key, setting) {
    return this._story._getRangeStyles(
      key,
      this._start,
      this._end,
      setting
    );
  }
  /** 读取区间共享的样式值；不一致时为 undefined。 */
  _getValue(key) {
    const styles = this._getStyles(key, false);
    return styles.length ? TextStyle.merge(styles, key) : this._style.get(key);
  }
  /** 写入样式值：story 里的样式优先，否则写进区间自己的样式。 */
  _setValue(key, value) {
    const styles = this._getStyles(key, true);
    if (styles.length) {
      TextStyle.apply(styles, key, value);
    } else {
      this._style.set(key, value);
    }
  }
  _changed() {
    this._story._changed();
  }
  // ---------------------------------------------------------------------
  // 子范围
  /** story 的 runs 中与本区间相交的部分，裁剪到区间内。 */
  getRuns() {
    return this._clip(this._story.runs);
  }
  getParagraphs() {
    return this._clip(this._story.paragraphs);
  }
  getWords() {
    return this._clip(this._story.words);
  }
  getLetters() {
    return this._clip(this._story.letters);
  }
  _clip(ranges) {
    const story = this._story, start = this._start, end = this._end;
    return ranges.filter(function(range) {
      return range._start < end && range._end > start || range._start === range._end && range._start >= start && range._start <= end;
    }).map(function(range) {
      return new TextRange(
        story,
        Math.max(range._start, start),
        Math.min(range._end, end)
      );
    });
  }
  // ---------------------------------------------------------------------
  /** 导出内容与偏离默认值的样式属性（纯数据）。 */
  toJSON() {
    const style = this._style, defaults = style._defaults, json = {
      start: this._start,
      end: this._end,
      content: this.content
    }, keys = style.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i], value = style.get(key);
      if (value !== void 0 && !styleValueEquals(value, defaults[key]))
        json[key] = value;
    }
    return json;
  }
  toString() {
    return this.content;
  }
  // ---------------------------------------------------------------------
  // 字符属性
  get fontFamily() {
    return this._getValue("fontFamily");
  }
  set fontFamily(value) {
    this._setValue("fontFamily", value);
  }
  get fontWeight() {
    return this._getValue("fontWeight");
  }
  set fontWeight(value) {
    this._setValue("fontWeight", value);
  }
  get fontStyle() {
    return this._getValue("fontStyle");
  }
  set fontStyle(value) {
    this._setValue("fontStyle", value);
  }
  get fontSize() {
    return this._getValue("fontSize");
  }
  set fontSize(value) {
    this._setValue("fontSize", value);
  }
  get fontVariations() {
    return this._getValue("fontVariations");
  }
  set fontVariations(value) {
    this._setValue("fontVariations", value);
  }
  get letterTracking() {
    return this._getValue("letterTracking");
  }
  set letterTracking(value) {
    this._setValue("letterTracking", value);
  }
  get letterKerning() {
    return this._getValue("letterKerning");
  }
  set letterKerning(value) {
    this._setValue("letterKerning", value);
  }
  get baselineShift() {
    return this._getValue("baselineShift");
  }
  set baselineShift(value) {
    this._setValue("baselineShift", value);
  }
  get baselinePosition() {
    return this._getValue("baselinePosition");
  }
  set baselinePosition(value) {
    this._setValue("baselinePosition", value);
  }
  get letterScaling() {
    return this._getValue("letterScaling");
  }
  set letterScaling(value) {
    this._setValue("letterScaling", value);
  }
  get letterRotation() {
    return this._getValue("letterRotation");
  }
  set letterRotation(value) {
    this._setValue("letterRotation", value);
  }
  get capitals() {
    return this._getValue("capitals");
  }
  set capitals(value) {
    this._setValue("capitals", value);
  }
  get underline() {
    return this._getValue("underline");
  }
  set underline(value) {
    this._setValue("underline", value);
  }
  get strikethrough() {
    return this._getValue("strikethrough");
  }
  set strikethrough(value) {
    this._setValue("strikethrough", value);
  }
  get features() {
    return this._getValue("features");
  }
  set features(value) {
    this._setValue("features", value);
  }
  get lineHeight() {
    return this._getValue("lineHeight");
  }
  set lineHeight(value) {
    this._setValue("lineHeight", value);
  }
  // ---------------------------------------------------------------------
  // 段落属性
  get justification() {
    return this._getValue("justification");
  }
  set justification(value) {
    this._setValue("justification", value);
  }
  get justifyLast() {
    return this._getValue("justifyLast");
  }
  set justifyLast(value) {
    this._setValue("justifyLast", value);
  }
  get justifySpacing() {
    return this._getValue("justifySpacing");
  }
  set justifySpacing(value) {
    this._setValue("justifySpacing", value);
  }
  get startIndent() {
    return this._getValue("startIndent");
  }
  set startIndent(value) {
    this._setValue("startIndent", value);
  }
  get endIndent() {
    return this._getValue("endIndent");
  }
  set endIndent(value) {
    this._setValue("endIndent", value);
  }
  get firstLineIndent() {
    return this._getValue("firstLineIndent");
  }
  set firstLineIndent(value) {
    this._setValue("firstLineIndent", value);
  }
  get spaceBefore() {
    return this._getValue("spaceBefore");
  }
  set spaceBefore(value) {
    this._setValue("spaceBefore", value);
  }
  get spaceAfter() {
    return this._getValue("spaceAfter");
  }
  set spaceAfter(value) {
    this._setValue("spaceAfter", value);
  }
  get hyphenation() {
    return this._getValue("hyphenation");
  }
  set hyphenation(value) {
    this._setValue("hyphenation", value);
  }
  get composer() {
    return this._getValue("composer");
  }
  set composer(value) {
    this._setValue("composer", value);
  }
  get lineWrap() {
    return this._getValue("lineWrap");
  }
  set lineWrap(value) {
    this._setValue("lineWrap", value);
  }
  get tabs() {
    return this._getValue("tabs");
  }
  set tabs(value) {
    this._setValue("tabs", value);
  }
  get direction() {
    return this._getValue("direction");
  }
  set direction(value) {
    this._setValue("direction", value);
  }
}
export {
  TextRange
};
