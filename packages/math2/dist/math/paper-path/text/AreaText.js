import { Point } from "../basic/Point.js";
import { Rectangle } from "../basic/Rectangle.js";
import { Path } from "../path/Path.js";
import { PathItem } from "../path/PathItem.js";
import { Numerical } from "../util/Numerical.js";
import { TextItem } from "./TextItem.js";
import { getTextMeasurer } from "./TextMeasurer.js";
class AreaText extends TextItem {
  /** 区域分成的栏数。 */
  _columns = 1;
  /** 区域分成的行数。 */
  _rows = 1;
  /** 栏与栏、行与行之间的间距。 */
  _gutter = 18;
  /** 区域边缘与文字之间的内缩。 */
  _inset = 0;
  /** 每栏里的文字如何纵向对齐：top / center / bottom。 */
  _verticalAlign = "top";
  constructor(area, orientation) {
    const isProps = area != null && typeof area === "object" && area.constructor === Object && area.width === void 0;
    super(isProps ? area : null);
    if (!isProps) {
      this.textPath = area instanceof PathItem ? area : area instanceof Rectangle ? Path.Rectangle(area) : null;
      if (orientation)
        this.orientation = orientation;
    }
  }
  // ---------------------------------------------------------------------
  // 布局参数
  get columns() {
    return this._columns;
  }
  set columns(value) {
    this._columns = value;
    this._changed();
  }
  get rows() {
    return this._rows;
  }
  set rows(value) {
    this._rows = value;
    this._changed();
  }
  get gutter() {
    return this._gutter;
  }
  set gutter(value) {
    this._gutter = value;
    this._changed();
  }
  get inset() {
    return this._inset;
  }
  set inset(value) {
    this._inset = value;
    this._changed();
  }
  get verticalAlign() {
    return this._verticalAlign;
  }
  set verticalAlign(value) {
    this._verticalAlign = value;
    this._changed();
  }
  copyContent(source) {
    super.copyContent(source);
    this._columns = source._columns;
    this._rows = source._rows;
    this._gutter = source._gutter;
    this._inset = source._inset;
    this._verticalAlign = source._verticalAlign;
  }
  // ---------------------------------------------------------------------
  // 区域与可用宽度
  /** 区域按内缩、行、列分成的矩形，按文字填充的顺序排列。 */
  _getRegions() {
    const path = this.textPath, regions = [];
    if (path) {
      const bounds = path.bounds.expand(-2 * this._inset), gutter = this._gutter, rows = Math.max(1, this._rows), columns = Math.max(1, this._columns), width = (bounds.width - gutter * (columns - 1)) / columns, height = (bounds.height - gutter * (rows - 1)) / rows;
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          regions.push(new Rectangle(
            bounds.x + column * (width + gutter),
            bounds.y + row * (height + gutter),
            width,
            height
          ));
        }
      }
    }
    return regions;
  }
  /** 该文本项周围没有文字环绕（没有 layer 层级）。 */
  _getTextWraps() {
    return [];
  }
  /**
   * 一行在 `baseline` 高度处的可用横向区间：区域在 ascent 到 descent
   * 之间每一处都必须容纳这行，再加上可选的文字环绕。
   */
  _getSpans(region, baseline, line, wraps) {
    const that = this, top = baseline - line.ascent, bottom = baseline + line.descent, middle = (top + bottom) / 2, unite = function(stretches1, stretches2) {
      const all = stretches1.concat(stretches2).sort(function(a, b) {
        return a[0] - b[0];
      }), result = [];
      for (let i = 0, l = all.length; i < l; i++) {
        const last = result[result.length - 1], stretch = all[i];
        if (last && stretch[0] <= last[1]) {
          last[1] = Math.max(last[1], stretch[1]);
        } else {
          result.push([stretch[0], stretch[1]]);
        }
      }
      return result;
    }, intersect = function(stretches1, stretches2) {
      const result = [];
      for (let i = 0, l = stretches1.length; i < l; i++) {
        for (let j = 0, m = stretches2.length; j < m; j++) {
          const left = Math.max(
            stretches1[i][0],
            stretches2[j][0]
          ), right = Math.min(
            stretches1[i][1],
            stretches2[j][1]
          );
          if (right > left)
            result.push([left, right]);
        }
      }
      return result;
    }, subtract = function(stretches1, stretches2) {
      return intersect(stretches1, stretches2.reduce(
        // 每段之外的部分，从左到右。
        function(outside, stretch) {
          const last = outside.pop();
          return outside.concat([
            [last[0], stretch[0]],
            [stretch[1], last[1]]
          ]);
        },
        [[-Infinity, Infinity]]
      ));
    }, inside = function(paths, y) {
      const stretches = [];
      for (let i = 0, l = paths.length; i < l; i++) {
        const path = paths[i], bounds = path.bounds, xs = path.getIntersections(Path.Line(
          new Point(bounds.left - 1, y),
          new Point(bounds.right + 1, y)
        )).map(function(location) {
          return location.point.x;
        }).sort(function(a, b) {
          return a - b;
        });
        for (let j = 0; j + 1 < xs.length; j += 2)
          stretches.push([xs[j], xs[j + 1]]);
      }
      return unite(stretches, []);
    };
    let spans = [top, middle, bottom].reduce(function(spans2, y) {
      return intersect(spans2, inside([that.textPath], y));
    }, [[region.left, region.right]]);
    for (let i = 0, l = wraps.length; i < l; i++) {
      const wrap = wraps[i], offset = wrap.offset, invert = wrap.invert, ys = [top - offset, top, middle, bottom, bottom + offset], covered = ys.reduce(function(covered2, y) {
        const stretches = inside(wrap.paths, y);
        return covered2 ? invert ? intersect(covered2, stretches) : unite(covered2, stretches) : stretches;
      }, null).map(function(stretch) {
        return invert ? [stretch[0] + offset, stretch[1] - offset] : [stretch[0] - offset, stretch[1] + offset];
      });
      spans = invert ? intersect(spans, covered) : subtract(spans, unite(covered, []));
    }
    return spans;
  }
  // ---------------------------------------------------------------------
  // 排版
  /**
   * 把文字填进区域：逐行断行，按段落的 justification、缩进与 `lineWrap`
   * 调整，最后按 `verticalAlign` 纵向对齐。
   */
  _layOut() {
    const that = this, story = this._story, content = story._content, regions = this._getRegions(), wraps = this._getTextWraps(), offsets = regions.map(function() {
      return 0;
    });
    let state;
    const lay = function(getCut) {
      let pos = state.pos, region = state.region, y = state.y;
      const paragraph = story._getParagraph(pos), style = paragraph.style, result = [];
      let space = pos === paragraph.start && y !== null ? Math.max(state.spaceAfter, style.spaceBefore) : 0;
      let isComplete = false;
      while (regions[region]) {
        const bounds = regions[region], next = that._measure(
          pos,
          Math.min(pos + 1, paragraph.end),
          style.direction
        ), baseline = y === null ? bounds.top + offsets[region] + next.ascent : y + next.lineHeight + space;
        if (!next.lineHeight || next.lineHeight < 0)
          break;
        if (baseline + next.descent > bounds.bottom) {
          region++;
          y = null;
          continue;
        }
        const spans = that._getSpans(bounds, baseline, next, wraps);
        if (style.direction === "rtl")
          spans.reverse();
        for (let i = 0, l = spans.length; i < l && !isComplete; i++) {
          const span = spans[i], line = that._breakLine(
            pos,
            paragraph,
            pos === paragraph.start,
            span,
            getCut ? getCut(result.length) : 0,
            // 比任何一行都宽的词独占一行。
            span[1] - span[0] >= bounds.width - Numerical.GEOMETRIC_EPSILON
          );
          if (line) {
            line.y = baseline;
            line.region = region;
            result.push(line);
            pos = line.end;
            isComplete = pos === paragraph.end;
          }
        }
        y = baseline;
        space = 0;
        if (isComplete)
          break;
      }
      return {
        lines: result,
        paragraph: style,
        isComplete,
        state: {
          pos,
          region,
          y,
          spaceAfter: style.spaceAfter
        }
      };
    };
    const search = function(high, precision, isAbove) {
      let low = 0;
      while (high - low > precision) {
        const value = (low + high) / 2;
        if (isAbove(value)) {
          high = value;
        } else {
          low = value;
        }
      }
      return [low, high];
    };
    const keeps = function(attempt, count) {
      return attempt.isComplete && attempt.lines.length === count;
    };
    const balance = function(count, from) {
      const cutFrom = function(cut2) {
        return function(index) {
          return index >= from ? cut2 : 0;
        };
      }, widest = regions.reduce(function(width, bounds) {
        return Math.max(width, bounds.width);
      }, 0), cut = search(widest, 0.5, function(cut2) {
        return !keeps(lay(cutFrom(cut2)), count);
      })[0];
      return cut > 0 && lay(cutFrom(cut));
    };
    const layAll = function() {
      const layout2 = [];
      let result, match;
      state = {
        pos: that._getStart(),
        region: 0,
        y: null,
        spaceAfter: 0
      };
      do {
        result = lay();
        const lines = result.lines, count = lines.length, wrap = result.paragraph.lineWrap;
        if (result.isComplete && count > 1) {
          if (wrap === "balance") {
            result = balance(count, 0) || result;
          } else if (wrap === "pretty" && lines[count - 1].width < lines[count - 2].width / 3) {
            result = balance(count, Math.max(0, count - 4)) || result;
          }
        }
        layout2.push.apply(layout2, result.lines);
        state = result.state;
        match = result.isComplete ? /^(\r\n|\n|\r)/.exec(content.slice(state.pos)) : null;
        if (match)
          state.pos += match[0].length;
      } while (match);
      return layout2;
    };
    const getLast = function(layout2, region) {
      for (let i = layout2.length - 1; i >= 0; i--) {
        const line = layout2[i];
        if (line.region === region) {
          return {
            line,
            free: regions[region].bottom - line.y - line.descent
          };
        }
      }
      return null;
    };
    let layout = layAll();
    const align = this._verticalAlign;
    if (align !== "top") {
      for (let r = 0, l = regions.length; r < l; r++) {
        const last = getLast(layout, r);
        if (last && last.free > 0) {
          const end = last.line.end, getExcess = function(offset) {
            offsets[r] = offset;
            const moved = getLast(layAll(), r);
            return moved && moved.line.end === end ? moved.free - (align === "center" ? offset : 0) : null;
          };
          let excess = getExcess(align === "center" ? last.free / 2 : last.free);
          if (excess === null || Math.abs(excess) > 0.01) {
            offsets[r] = search(
              last.free,
              0.01,
              function(offset) {
                const value = getExcess(offset);
                return value === null || value < 0;
              }
            )[0];
          }
          layout = layAll();
        }
      }
    }
    this._visibleEnd = state.pos;
    return layout;
  }
  /**
   * 从 `start` 起在最后一个放得下的词（或软连字符）处断行，并按段落的
   * justification 与缩进摆放。行尾空格悬挂在区间外。第一个词都放不下时，
   * 只有 `canForce` 才让它独占一行，否则不产生行。
   */
  _breakLine(start, paragraph, isFirst, room, cut, canForce) {
    const that = this, content = this._story._content, style = paragraph.style, direction = style.direction, indented = this._indent(style, isFirst, room[0], room[1]), words = /[^\s\u00ad]*\u00ad|\S+\s*|\s+/g, text = content.slice(start, paragraph.end), ends = [];
    const measure = function(end2) {
      const line2 = that._measure(start, start + content.slice(start, end2).replace(/\s+$/, "").length, direction);
      if (content[end2 - 1] === "­") {
        const last = line2.pieces[line2.pieces.length - 1], width2 = getTextMeasurer().getTextWidth(
          last.font,
          ["-"],
          last.tracking,
          direction || void 0
        ) * last.scale.x;
        line2.pieces.push(Object.assign({}, last, {
          content: "-",
          start: end2,
          end: end2,
          x: last.x + last.width,
          width: width2
        }));
        line2.width += width2;
      }
      return line2;
    };
    let match;
    while (match = words.exec(text))
      ends.push(start + match.index + match[0].length);
    const width = indented[1] - indented[0] - cut, fits = function(index) {
      return measure(ends[index]).width <= width;
    };
    let low = -1, high = 0;
    while (high < ends.length && fits(high)) {
      low = high;
      high = 2 * high + 1;
    }
    high = Math.min(high, ends.length);
    while (high - low > 1) {
      const middle = low + high >> 1;
      if (fits(middle)) {
        low = middle;
      } else {
        high = middle;
      }
    }
    let end = low >= 0 ? ends[low] : start;
    if (end === start && ends.length) {
      if (!canForce)
        return null;
      end = ends[0];
    }
    const line = measure(end);
    this._place(line, style, end === paragraph.end, indented);
    line.end = end;
    return line;
  }
  /** 各行的盒子并集；带 matrix 时变换后再取包围盒。 */
  _getBounds(matrix) {
    const lines = this._getLayout();
    let rect = null;
    for (let i = 0, l = lines.length; i < l; i++) {
      const line = lines[i], box = this._getBox(line, line.x, line.y);
      rect = rect ? rect.unite(box) : box;
    }
    if (!rect)
      rect = new Rectangle();
    return matrix ? matrix._transformBounds(rect, rect) : rect;
  }
}
export {
  AreaText
};
