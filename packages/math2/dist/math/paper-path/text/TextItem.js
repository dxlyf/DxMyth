import { Point } from "../basic/Point.js";
import { Line } from "../basic/Line.js";
import { Rectangle } from "../basic/Rectangle.js";
import { TextStory, isParagraphKey } from "./TextStory.js";
import { TextStyle } from "./TextStyle.js";
import { TextRange } from "./TextRange.js";
import { getTextMeasurer } from "./TextMeasurer.js";
function toPoint(value) {
  return typeof value === "number" ? new Point(value, value) : value;
}
class TextItem {
  /** 该文本项显示的 story（可能与其他文本项共享）。 */
  _story;
  /** 文本项自身的样式，代表整段文本的样式。 */
  _style;
  /** 排版结果缓存。 */
  _layout;
  /** 按字体缓存的度量。 */
  _fontMetrics;
  /** 文字沿其排布的路径（本移植只保存引用）。 */
  _textPath;
  /** 行方向：'horizontal' 或 'vertical'。 */
  _orientation;
  /** 当前文本项显示到 story 的哪个位置为止。 */
  _visibleEnd;
  constructor(props, point) {
    this._story = new TextStory([this]);
    this._style = new TextStyle(null, this);
    this._layout = null;
    this._fontMetrics = null;
    this._textPath = null;
    this._orientation = "horizontal";
    this._visibleEnd = 0;
    if (props instanceof Point) {
      point = props;
      props = null;
    }
    this._initialize(props, point);
  }
  /**
   * 设置初始属性：样式先写、内容后写，避免排版中间态。
   * `point` 既可以作为第二个参数，也可以放在属性对象的 `point` 里。
   */
  _initialize(props, point) {
    if (props) {
      if (props.point)
        this._setPoint(props.point);
      const keys = this._style.keys();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key in props)
          this._setStyleValue(key, props[key]);
      }
      if (props.content != null)
        this.content = props.content;
    }
    if (point)
      this._setPoint(point);
  }
  /** 由子类实现：设置文本的起点。 */
  _setPoint(point) {
  }
  // ---------------------------------------------------------------------
  // 文本内容（委托给 story）
  /** 文本内容。 */
  get content() {
    return this._story.content;
  }
  set content(content) {
    this._story.content = content;
  }
  /** 替换 story 中 `start` 到 `end` 的内容。 */
  replace(content, start, end) {
    this._story.replace(content, start, end);
  }
  /** story 中 `start` 到 `end` 的范围。 */
  range(start, end) {
    return this._story.range(start, end);
  }
  /** 文本的 runs。 */
  get runs() {
    return this._story.runs;
  }
  set runs(value) {
    this._story.runs = value;
  }
  /** 文本的段落。 */
  get paragraphs() {
    return this._story.paragraphs;
  }
  set paragraphs(value) {
    this._story.paragraphs = value;
  }
  /** 文本里的词。 */
  get words() {
    return this._story.words;
  }
  /** 文本里的字母。 */
  get letters() {
    return this._story.letters;
  }
  /** 该文本项显示的 story。 */
  get story() {
    return this._story;
  }
  // ---------------------------------------------------------------------
  // 方向与文本路径
  /** 文本行方向：'horizontal' 或 'vertical'。 */
  get orientation() {
    return this._orientation;
  }
  set orientation(orientation) {
    if (orientation !== this._orientation) {
      this._orientation = orientation;
      this._changed();
    }
  }
  /** 文字沿其排布的路径（AreaText / PathText 用）。 */
  get textPath() {
    return this._textPath;
  }
  set textPath(path) {
    this._textPath = path;
    this._changed();
  }
  // ---------------------------------------------------------------------
  // 链接
  /**
   * 把文本项 `next` 接在本项之后，story 的内容流进它。
   */
  link(next) {
    const story = this._story, other = next._story;
    if (other === story)
      return false;
    const items = story._items, joined = other._items;
    story._append(other);
    items.splice(items.indexOf(this) + 1, 0, ...joined);
    for (let i = 0, l = joined.length; i < l; i++)
      joined[i]._story = story;
    story._changed();
    return true;
  }
  /** 本项是否与其他文本项链接。 */
  isLinked() {
    return this._story._items.length > 1;
  }
  /**
   * 断开链接：`'both'` 把本项单独取出，`'before'` / `'after'` 在它前后
   * 把 story 一分为二。
   */
  unlink(which) {
    const story = this._story, items = story._items, index = items.indexOf(this);
    which = which || "both";
    if (items.length > 1 && !(which === "before" && index === 0 || which === "after" && index === items.length - 1)) {
      if (which === "both") {
        const start = this.getVisibleRange().start, own = new TextStory([this]), style = story._getRangeStyles("fontSize", start, start)[0];
        own._runs[0].style = new TextStyle(style, own);
        items.splice(index, 1);
        this._story = own;
        story._changed();
        this._changed();
      } else {
        const at = which === "before" ? index : index + 1, start = items[at].getVisibleRange().start, moved = items.splice(at, items.length - at), rest = story._extract(start, moved);
        for (let i = 0, l = moved.length; i < l; i++)
          moved[i]._story = rest;
        story._changed();
        rest._changed();
      }
      return true;
    }
    return false;
  }
  /** story 中本项之后的文本项。 */
  get nextTextItem() {
    const items = this._story._items;
    return items[items.indexOf(this) + 1] || null;
  }
  /** story 中本项之前的文本项。 */
  get previousTextItem() {
    const items = this._story._items;
    return items[items.indexOf(this) - 1] || null;
  }
  /** 复制另一个文本项的内容与方向。 */
  copyContent(source) {
    this._story = source._story._clone([this]);
    this._orientation = source._orientation;
    this._changed();
  }
  // ---------------------------------------------------------------------
  // 可见范围
  /** 本项显示的 story 范围。 */
  get visibleRange() {
    return this.getVisibleRange();
  }
  /** 本项显示的 story 范围。 */
  getVisibleRange() {
    const range = this._getVisibleRange();
    return new TextRange(this._story, range[0], range[1]);
  }
  /** 可见范围 `[start, end]`。 */
  _getVisibleRange() {
    this._getLayout();
    return [this._getStart(), this._visibleEnd];
  }
  /** 本项从 story 的哪个位置开始：前一项的可见终点。 */
  _getStart() {
    const previous = this.previousTextItem;
    return previous ? previous._getVisibleRange()[1] : 0;
  }
  /** 文本是否为空。 */
  isEmpty() {
    return !this._story._content;
  }
  // ---------------------------------------------------------------------
  // 排版
  /** 排版结果（惰性计算）。 */
  _getLayout() {
    return this._layout || (this._layout = this._layOut());
  }
  /** 由子类实现：把 story 排成行。 */
  _layOut() {
    return [];
  }
  /** 内容或样式变化：让排版与字体度量失效，并让后一个文本项也失效。 */
  _changed() {
    this._layout = null;
    this._fontMetrics = null;
    const next = this.nextTextItem;
    if (next)
      next._changed();
  }
  /**
   * 把 `start` 到 `end` 的文本量成一行：各 run 的 piece（样式、位置、宽度）、
   * 总宽、行高、ascent / descent。
   */
  _measure(start, end, direction, byLetter) {
    const view = getTextMeasurer(), story = this._story, content = story._content, runs = story._runs, pieces = [];
    let letters = null, index = 0, total = 0, lineHeight = 0, ascent = 0, descent = 0, group = "", groupWidth = 0, previous = null;
    function advance(piece, text) {
      if (!(previous && previous.font === piece.font && previous.tracking === piece.tracking && previous.scale.equals(piece.scale) && previous.y === piece.y)) {
        group = "";
        groupWidth = 0;
      }
      const before = groupWidth;
      group += text;
      groupWidth = view.getTextWidth(
        piece.font,
        [group],
        piece.tracking,
        direction || void 0
      ) * piece.scale.x;
      return groupWidth - before;
    }
    function add(piece, text, from, to, extra) {
      const shown = piece.capitals ? text.toUpperCase() : text, width = advance(piece, shown) + extra;
      pieces.push(previous = Object.assign({}, piece, {
        content: shown,
        start: from,
        end: to,
        x: total,
        width
      }));
      total += width;
    }
    for (let i = 0, l = runs.length, pos = 0; i < l; i++) {
      const run = runs[i], next = pos + run.length, from = Math.max(pos, start), to = Math.min(next, end);
      if (from < to || start === end && from === to && !lineHeight) {
        const style = run.style, piece = this._getPiece(style), kerning = style.letterKerning;
        if (byLetter || kerning != null || piece.rotation) {
          letters = letters || story._getLetters();
          while (index < letters.length && letters[index]._start < to) {
            const letter = letters[index++];
            if (letter._start >= from) {
              if (kerning != null) {
                previous = null;
              }
              add(
                piece,
                letter.content,
                letter._start,
                letter._end,
                (kerning || 0) / 1e3 * piece.size
              );
            }
          }
        } else {
          add(piece, content.slice(from, to), from, to, 0);
        }
        lineHeight = Math.max(lineHeight, piece.lineHeight);
        ascent = Math.max(ascent, piece.ascent - piece.y);
        descent = Math.max(descent, piece.descent + piece.y);
      }
      pos = next;
    }
    return {
      pieces,
      start,
      end,
      x: 0,
      y: 0,
      width: total,
      lineHeight,
      ascent,
      descent
    };
  }
  /** 一个样式的排版参数：字体、字距、字号、度量、行高、缩放与旋转。 */
  _getPiece(style) {
    const size = style._getFontSize(), font = style._getCanvasFont(), position = style.baselinePosition, scale = toPoint(style.letterScaling), cache = this._fontMetrics || (this._fontMetrics = {}), metrics = cache[font] || (cache[font] = getTextMeasurer().getFontMetrics(font) || { ascent: 0.75 * size, descent: 0.25 * size }), shift = position === "superscript" ? 1 : position === "subscript" ? -1 : 0;
    return {
      style,
      font,
      tracking: style._getCanvasLetterSpacing(),
      size,
      ascent: metrics.ascent * scale.y,
      descent: metrics.descent * scale.y,
      lineHeight: style._getLineHeight(),
      y: -style.baselineShift - shift * size * style._scriptShift,
      scale,
      rotation: style.letterRotation,
      capitals: style.capitals === "all"
    };
  }
  /**
   * 一行或一个 piece 的包围盒：高为行高，ascent 上方与 descent 下方留出
   * 相同的 leading。
   */
  _getBox(entry, x, y) {
    const leading = (entry.lineHeight - entry.ascent - entry.descent) / 2;
    return new Rectangle(
      x,
      y - entry.ascent - leading,
      entry.width,
      entry.lineHeight
    );
  }
  /** 段落缩进后，一行可用的 [left, right]。 */
  _indent(paragraph, isFirst, left, right) {
    const isRightToLeft = paragraph.direction === "rtl", start = paragraph.startIndent + (isFirst ? paragraph.firstLineIndent : 0), end = paragraph.endIndent;
    return [
      left + (isRightToLeft ? end : start),
      right - (isRightToLeft ? start : end)
    ];
  }
  /** 按段落的 justification 把一行放进可用区间。 */
  _place(line, paragraph, isLast, room) {
    const justification = paragraph.justification, justifyLast = paragraph.justifyLast, direction = paragraph.direction, side = this._getSide(
      justification === "justify" && isLast && justifyLast !== "all" ? String(justifyLast) : justification,
      direction
    ), left = room[0], right = room[1];
    if (side === "justify" || side === "all")
      this._justify(line, right - left, direction);
    if (direction === "rtl")
      this._mirror(line.pieces, line.width);
    this._shift(line, side === "right" ? right - line.width : side === "center" ? (left + right - line.width) / 2 : left, 0);
  }
  /** 把一行多出的宽度按空格数量摊到词之间。 */
  _justify(line, width, direction) {
    const pieces = line.pieces, content = this._story._content, spaces = (content.slice(
      pieces.length ? pieces[0].start : 0,
      pieces.length ? pieces[pieces.length - 1].end : 0
    ).match(/\s+/g) || []).length;
    if (spaces && width > line.width) {
      const extra = (width - line.width) / spaces, result = [];
      let moved = 0;
      for (let i = 0, l = pieces.length; i < l; i++) {
        const piece = pieces[i], parts = (piece.content || "").split(/(\s+)/);
        let from = piece.start, x = piece.x;
        if (parts.length === 1) {
          result.push(Object.assign({}, piece, { x: x + moved }));
        } else {
          for (let j = 0, m = parts.length; j < m; j++) {
            const part = parts[j];
            if (part) {
              const advance = this._measure(
                from,
                from + part.length,
                direction
              ).width;
              if (/^\s+$/.test(part)) {
                moved += extra;
              } else {
                result.push(Object.assign({}, piece, {
                  content: part,
                  start: from,
                  end: from + part.length,
                  x: x + moved,
                  width: advance
                }));
              }
              x += advance;
              from += part.length;
            }
          }
        }
      }
      line.pieces = result;
      line.width = width;
    }
  }
  /** 把一行的 pieces 按从右到左的位置镜像。 */
  _mirror(pieces, width) {
    for (let i = 0, l = pieces.length; i < l; i++) {
      const piece = pieces[i];
      piece.x = width - piece.x - piece.width;
    }
  }
  /** 移动整行及其 pieces。 */
  _shift(line, x, y) {
    const pieces = line.pieces;
    line.x = (line.x || 0) + x;
    line.y += y;
    for (let i = 0, l = pieces.length; i < l; i++)
      pieces[i].x = pieces[i].x + x;
  }
  /** 按段落方向把 'start' / 'end' 解析成具体的对齐边。 */
  _getSide(justification, direction) {
    const isRightToLeft = direction === "rtl";
    return justification === "start" ? isRightToLeft ? "right" : "left" : justification === "end" ? isRightToLeft ? "left" : "right" : justification;
  }
  /**
   * 文本的行：每行是 story 的一段 TextRange，另带 `baseline` 与 `bounds`。
   */
  getLines() {
    const that = this, story = this._story;
    return this._getLayout().map(function(line) {
      const range = new TextRange(story, line.start, line.end);
      range.baseline = new Line(
        new Point(line.x, line.y),
        new Point(line.x + line.width, line.y)
      );
      range.bounds = that._getBox(line, line.x, line.y);
      return range;
    });
  }
  /** 文本的行。 */
  get lines() {
    return this.getLines();
  }
  /** 文本的包围盒，由子类实现（没有 Item 层与矩阵）。 */
  get bounds() {
    return this._getBounds();
  }
  _getBounds(matrix, options) {
    return new Rectangle();
  }
  // ---------------------------------------------------------------------
  // 样式读写
  /** 该属性对应的 story 样式：段落样式，或所有 run 的样式。 */
  _getTextStyles(key) {
    const story = this._story;
    return isParagraphKey(key) ? story._paragraphs : story._runs.map(function(run) {
      return run.style;
    });
  }
  /** 读取文本共享的样式值；不一致时为 undefined。 */
  _getStyleValue(key) {
    const styles = this._getTextStyles(key);
    return styles.length ? TextStyle.merge(styles, key) : this._style.get(key);
  }
  /** 写入样式值：同时写进 story 的样式与文本项自身的样式。 */
  _setStyleValue(key, value) {
    const styles = this._getTextStyles(key);
    if (styles.length)
      TextStyle.apply(styles, key, value);
    this._style.set(key, value);
  }
  // ---------------------------------------------------------------------
  // 字符属性
  get fontFamily() {
    return this._getStyleValue("fontFamily");
  }
  set fontFamily(value) {
    this._setStyleValue("fontFamily", value);
  }
  get fontWeight() {
    return this._getStyleValue("fontWeight");
  }
  set fontWeight(value) {
    this._setStyleValue("fontWeight", value);
  }
  get fontStyle() {
    return this._getStyleValue("fontStyle");
  }
  set fontStyle(value) {
    this._setStyleValue("fontStyle", value);
  }
  get fontSize() {
    return this._getStyleValue("fontSize");
  }
  set fontSize(value) {
    this._setStyleValue("fontSize", value);
  }
  get fontVariations() {
    return this._getStyleValue("fontVariations");
  }
  set fontVariations(value) {
    this._setStyleValue("fontVariations", value);
  }
  get letterTracking() {
    return this._getStyleValue("letterTracking");
  }
  set letterTracking(value) {
    this._setStyleValue("letterTracking", value);
  }
  get letterKerning() {
    return this._getStyleValue("letterKerning");
  }
  set letterKerning(value) {
    this._setStyleValue("letterKerning", value);
  }
  get baselineShift() {
    return this._getStyleValue("baselineShift");
  }
  set baselineShift(value) {
    this._setStyleValue("baselineShift", value);
  }
  get baselinePosition() {
    return this._getStyleValue("baselinePosition");
  }
  set baselinePosition(value) {
    this._setStyleValue("baselinePosition", value);
  }
  get letterScaling() {
    return this._getStyleValue("letterScaling");
  }
  set letterScaling(value) {
    this._setStyleValue("letterScaling", value);
  }
  get letterRotation() {
    return this._getStyleValue("letterRotation");
  }
  set letterRotation(value) {
    this._setStyleValue("letterRotation", value);
  }
  get capitals() {
    return this._getStyleValue("capitals");
  }
  set capitals(value) {
    this._setStyleValue("capitals", value);
  }
  get underline() {
    return this._getStyleValue("underline");
  }
  set underline(value) {
    this._setStyleValue("underline", value);
  }
  get strikethrough() {
    return this._getStyleValue("strikethrough");
  }
  set strikethrough(value) {
    this._setStyleValue("strikethrough", value);
  }
  get features() {
    return this._getStyleValue("features");
  }
  set features(value) {
    this._setStyleValue("features", value);
  }
  get lineHeight() {
    return this._getStyleValue("lineHeight");
  }
  set lineHeight(value) {
    this._setStyleValue("lineHeight", value);
  }
  // ---------------------------------------------------------------------
  // 段落属性
  get justification() {
    return this._getStyleValue("justification");
  }
  set justification(value) {
    this._setStyleValue("justification", value);
  }
  get justifyLast() {
    return this._getStyleValue("justifyLast");
  }
  set justifyLast(value) {
    this._setStyleValue("justifyLast", value);
  }
  get justifySpacing() {
    return this._getStyleValue("justifySpacing");
  }
  set justifySpacing(value) {
    this._setStyleValue("justifySpacing", value);
  }
  get startIndent() {
    return this._getStyleValue("startIndent");
  }
  set startIndent(value) {
    this._setStyleValue("startIndent", value);
  }
  get endIndent() {
    return this._getStyleValue("endIndent");
  }
  set endIndent(value) {
    this._setStyleValue("endIndent", value);
  }
  get firstLineIndent() {
    return this._getStyleValue("firstLineIndent");
  }
  set firstLineIndent(value) {
    this._setStyleValue("firstLineIndent", value);
  }
  get spaceBefore() {
    return this._getStyleValue("spaceBefore");
  }
  set spaceBefore(value) {
    this._setStyleValue("spaceBefore", value);
  }
  get spaceAfter() {
    return this._getStyleValue("spaceAfter");
  }
  set spaceAfter(value) {
    this._setStyleValue("spaceAfter", value);
  }
  get hyphenation() {
    return this._getStyleValue("hyphenation");
  }
  set hyphenation(value) {
    this._setStyleValue("hyphenation", value);
  }
  get composer() {
    return this._getStyleValue("composer");
  }
  set composer(value) {
    this._setStyleValue("composer", value);
  }
  get lineWrap() {
    return this._getStyleValue("lineWrap");
  }
  set lineWrap(value) {
    this._setStyleValue("lineWrap", value);
  }
  get tabs() {
    return this._getStyleValue("tabs");
  }
  set tabs(value) {
    this._setStyleValue("tabs", value);
  }
  get direction() {
    return this._getStyleValue("direction");
  }
  set direction(value) {
    this._setStyleValue("direction", value);
  }
}
export {
  TextItem
};
