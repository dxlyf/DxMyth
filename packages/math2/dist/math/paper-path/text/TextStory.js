import { TextStyle } from "./TextStyle.js";
import { TextRange } from "./TextRange.js";
const PARAGRAPH_KEYS = {
  justification: true,
  justifyLast: true,
  justifySpacing: true,
  startIndent: true,
  endIndent: true,
  firstLineIndent: true,
  spaceBefore: true,
  spaceAfter: true,
  hyphenation: true,
  composer: true,
  lineWrap: true,
  tabs: true,
  direction: true
};
const ITEM_KEYS = {};
function isParagraphKey(key) {
  return key in PARAGRAPH_KEYS;
}
class TextStory {
  _content;
  _runs;
  _paragraphs;
  /** 该 story 流经的文本项（TextItem），本移植里类型未知。 */
  _items;
  /** 用于排版的字符范围缓存，见 `_getLetters()`。 */
  _letters = null;
  _lettersOf = null;
  constructor(items) {
    this._content = "";
    this._runs = [{ length: 0, style: new TextStyle(null, this) }];
    this._paragraphs = [new TextStyle(null, this)];
    this._items = items || [];
  }
  // ---------------------------------------------------------------------
  // 文本项
  /** 该 story 流经的文本项，按顺序。 */
  get textItems() {
    return this._items.slice();
  }
  // ---------------------------------------------------------------------
  // 复制 / 追加 / 切出
  /** 为 `items` 复制内容与样式。 */
  _clone(items) {
    const story = new TextStory(items);
    story._content = this._content;
    story._runs = this._runs.map(function(run) {
      return { length: run.length, style: new TextStyle(run.style, story) };
    });
    story._paragraphs = this._paragraphs.map(function(style) {
      return new TextStyle(style, story);
    });
    return story;
  }
  /** 把另一个 story 的内容与样式接到末尾；相接的段落保留本 story 的样式。 */
  _append(other) {
    const that = this, runs = other._runs.map(function(run) {
      return {
        length: run.length,
        style: new TextStyle(run.style, that)
      };
    });
    this._content += other._content;
    this._runs = this._runs.concat(runs).filter(function(run) {
      return run.length > 0;
    });
    if (!this._runs.length)
      this._runs = [runs[0]];
    this._paragraphs = this._paragraphs.concat(
      other._paragraphs.slice(1).map(function(style) {
        return new TextStyle(style, that);
      })
    );
  }
  /** 从 `start` 起的内容切出到为 `items` 新建的 story 里。 */
  _extract(start, items) {
    const rest = this._clone(items), content = this._content, paragraph = this._paragraphs[this._countBreaks(content.slice(0, start))];
    rest.replace("", 0, start);
    rest._paragraphs[0] = new TextStyle(paragraph, rest);
    this.replace("", start, content.length);
    return rest;
  }
  /** 内容变化时通知流经的文本项。 */
  _changed() {
    const items = this._items;
    for (let i = 0, l = items.length; i < l; i++) {
      const item = items[i];
      if (item && typeof item._changed === "function")
        item._changed();
    }
  }
  // ---------------------------------------------------------------------
  // 内容
  /** 从第一个文本项到最后一个的完整文本。 */
  get content() {
    return this._content;
  }
  set content(content) {
    this.replace(content, 0, this._content.length);
  }
  /**
   * 把 `start` 到 `end` 的内容替换为新内容，新内容继承被替换内容的样式，
   * 插入时继承前一个字符的样式。
   */
  replace(content, start, end) {
    let from, to;
    if (typeof start === "number") {
      from = start;
      to = end;
    } else {
      from = start.start;
      to = start.end;
    }
    const old = this._content, length = old.length, runs = this._runs, paragraphs = this._paragraphs;
    content = "" + content;
    from = Math.max(0, Math.min(from, length));
    to = Math.max(from, Math.min(to, length));
    const i = this._split(from), j = this._split(to), source = (i < j ? runs[i] : runs[i - 1] || runs[i]).style;
    runs.splice(i, j - i, {
      length: content.length,
      style: new TextStyle(source, this)
    });
    this._runs = runs.filter(function(run) {
      return run.length > 0;
    });
    if (!this._runs.length)
      this._runs = [runs[i]];
    const first = this._countBreaks(old.slice(0, from)), removed = this._countBreaks(old.slice(from, to)), added = this._countBreaks(content), style = paragraphs[first], inserted = [];
    for (let k = 0; k < added; k++)
      inserted.push(new TextStyle(style, this));
    paragraphs.splice(first + 1, removed, ...inserted);
    this._content = old.slice(0, from) + content + old.slice(to);
    this._changed();
  }
  /** `pos` 所在段落的样式、起止位置（不含该段末尾的换行）。 */
  _getParagraph(pos) {
    const content = this._content, before = content.slice(0, pos), start = /(\r\n|\n|\r)[^\r\n]*$/.exec(before), end = /\r\n|\n|\r/.exec(content.slice(pos));
    return {
      style: this._paragraphs[this._countBreaks(before)],
      start: start ? start.index + start[1].length : 0,
      end: end ? pos + end.index : content.length
    };
  }
  /** 内容里换行的数量，也就是段落的结束位置。 */
  _countBreaks(content) {
    const matches = content.match(/\r\n|\n|\r/g);
    return matches ? matches.length : 0;
  }
  /** 在 `index` 处切开 run，返回从该位置开始的 run 下标。 */
  _split(index) {
    const runs = this._runs;
    let start = 0;
    for (let i = 0, l = runs.length; i < l; i++) {
      const run = runs[i];
      if (start === index)
        return i;
      if (index < start + run.length) {
        runs.splice(i + 1, 0, {
          length: start + run.length - index,
          style: new TextStyle(run.style, this)
        });
        run.length = index - start;
        return i + 1;
      }
      start += run.length;
    }
    return runs.length;
  }
  // ---------------------------------------------------------------------
  // 范围样式
  /**
   * `start` 到 `end` 的区间所代表的样式：
   * 段落样式、它覆盖的 run 样式（设置时会先把 run 切开），或空区间的样式。
   */
  _getRangeStyles(key, start, end, setting) {
    const runs = this._runs;
    if (key in ITEM_KEYS) {
      return [];
    } else if (key in PARAGRAPH_KEYS) {
      const content = this._content, first = this._countBreaks(content.slice(0, start)), last = this._countBreaks(
        content.slice(0, Math.max(start, end - 1))
      );
      return this._paragraphs.slice(first, last + 1);
    } else if (setting) {
      const i = this._split(start);
      return runs.slice(i, this._split(end)).map(function(run) {
        return run.style;
      });
    } else {
      const from = start < end ? start : Math.max(0, start - 1), to = start < end ? end : from + 1, styles = [];
      let pos = 0;
      for (let i = 0, l = runs.length; i < l; i++) {
        const run = runs[i], next = pos + run.length;
        if (from < next && to > pos)
          styles.push(run.style);
        pos = next;
      }
      return styles.length ? styles : [runs[0].style];
    }
  }
  /** 从 `start` 到 `end` 的文本范围。 */
  range(start, end) {
    return new TextRange(this, start, end);
  }
  // ---------------------------------------------------------------------
  // runs
  /** 文本的 run：每一段内部样式一致。 */
  get runs() {
    const that = this;
    return this._getRuns().map(function(run) {
      return new TextRange(that, run.start, run.end);
    });
  }
  set runs(runs) {
    this.setRuns(runs);
  }
  /** 相邻且样式相同的 run 合并。 */
  _getRuns() {
    const runs = this._runs, joined = [];
    let start = 0, end = 0;
    for (let i = 0, l = runs.length; i < l; i++) {
      const run = runs[i], next = runs[i + 1];
      end += run.length;
      if (!next || !run.style.equals(next.style)) {
        joined.push({ start, end, style: run.style });
        start = end;
      }
    }
    return joined;
  }
  setRuns(runs) {
    const that = this;
    const plain = runs.map(function(run) {
      return run instanceof TextRange ? run.toJSON() : run;
    });
    const content = plain.map(function(run) {
      return run.content || "";
    }).join("");
    this.content = content;
    const baseStyle = this._runs[0].style;
    this._runs = plain.map(function(run) {
      const style = new TextStyle(baseStyle, that);
      style.setValues(run);
      return { length: (run.content || "").length, style };
    }).filter(function(run) {
      return run.length > 0;
    });
    if (!this._runs.length)
      this._runs = [{ length: 0, style: new TextStyle(null, this) }];
    this._changed();
  }
  // ---------------------------------------------------------------------
  // 段落
  /** 文本的段落（不含换行）。 */
  get paragraphs() {
    const ranges = [], breaks = /\r\n|\n|\r/g, content = this._content;
    let start = 0, match;
    while (match = breaks.exec(content)) {
      ranges.push(new TextRange(this, start, match.index));
      start = match.index + match[0].length;
    }
    ranges.push(new TextRange(this, start, content.length));
    return ranges;
  }
  set paragraphs(paragraphs) {
    this.setParagraphs(paragraphs);
  }
  setParagraphs(paragraphs) {
    const styles = this._paragraphs, keys = PARAGRAPH_KEYS;
    for (let i = 0, l = Math.min(paragraphs.length, styles.length); i < l; i++) {
      const paragraph = paragraphs[i], style = styles[i];
      for (const key in keys) {
        const value = paragraph[key];
        if (value !== void 0)
          style.set(key, value);
      }
    }
  }
  // ---------------------------------------------------------------------
  // 词 / 字母
  /** 文本里的词：能用 Intl.Segmenter 就用它，否则按空白切分。 */
  get words() {
    return this._segment("word", /\S+/g);
  }
  /** 文本里的字母，按人眼看到的一个字（字素，含 emoji、带重音的字母）。 */
  get letters() {
    return this._segment("grapheme", /[\s\S]/g);
  }
  /** 排版用的字母范围，内容不变时复用。 */
  _getLetters() {
    if (this._lettersOf !== this._content) {
      this._letters = this.letters;
      this._lettersOf = this._content;
    }
    return this._letters;
  }
  _segment(granularity, pattern) {
    const content = this._content, ranges = [], Segmenter = typeof Intl !== "undefined" ? Intl.Segmenter : void 0;
    if (Segmenter) {
      const segments = new Segmenter(void 0, {
        granularity
      }).segment(content), iterator = segments[Symbol.iterator]();
      let step;
      while (!(step = iterator.next()).done) {
        const segment = step.value;
        if (granularity !== "word" || segment.isWordLike) {
          ranges.push(new TextRange(
            this,
            segment.index,
            segment.index + segment.segment.length
          ));
        }
      }
    } else {
      let match;
      while (match = pattern.exec(content)) {
        ranges.push(new TextRange(
          this,
          match.index,
          match.index + match[0].length
        ));
      }
    }
    return ranges;
  }
}
export {
  TextStory,
  isParagraphKey
};
