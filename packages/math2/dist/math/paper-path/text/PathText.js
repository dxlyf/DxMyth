import { Matrix } from "../basic/Matrix.js";
import { Rectangle } from "../basic/Rectangle.js";
import { PathFlattener } from "../path/PathFlattener.js";
import { CompoundPath } from "../path/CompoundPath.js";
import { TextItem } from "./TextItem.js";
function angleOf(point) {
  return Math.atan2(point.y, point.x) * 180 / Math.PI;
}
class PathText extends TextItem {
  /** 文字在路径上的起点偏移。 */
  _startOffset = 0;
  /** 文字在路径上的终点偏移，null 表示到路径末尾。 */
  _endOffset = null;
  /** 字母的哪一部分落在路径上。 */
  _alignment = "baseline";
  /** 字母之间额外增加的间距。 */
  _spacing = 0;
  constructor(path, orientation) {
    const hasProps = path != null && typeof path === "object" && path.constructor === Object;
    super(hasProps ? path : null);
    if (!hasProps) {
      this.textPath = path;
      if (orientation)
        this.orientation = orientation;
    }
  }
  // ---------------------------------------------------------------------
  // 布局参数
  /** 文字在路径上的起点偏移。 */
  get startOffset() {
    return this._startOffset;
  }
  set startOffset(value) {
    this._startOffset = value;
    this._changed();
  }
  /** 文字在路径上的终点偏移，null 表示到路径末尾。 */
  get endOffset() {
    return this._endOffset;
  }
  set endOffset(value) {
    this._endOffset = value;
    this._changed();
  }
  /** 字母的哪一部分落在路径上：baseline / ascender / descender / center。 */
  get alignment() {
    return this._alignment;
  }
  set alignment(value) {
    this._alignment = value;
    this._changed();
  }
  /** 字母之间额外增加的间距。 */
  get spacing() {
    return this._spacing;
  }
  set spacing(value) {
    this._spacing = value;
    this._changed();
  }
  copyContent(source) {
    super.copyContent(source);
    this._startOffset = source._startOffset;
    this._endOffset = source._endOffset;
    this._alignment = source._alignment;
    this._spacing = source._spacing;
  }
  // ---------------------------------------------------------------------
  // 排版
  /**
   * 把能放进 `startOffset`..`endOffset` 的文字排成一行，每个字母按其中点
   * 所在位置的切线旋转。
   */
  _layOut() {
    const path = this.textPath, story = this._story, start = this._getStart(), children = path ? path instanceof CompoundPath ? path.children : [path] : [], flatteners = children.map(function(child) {
      return new PathFlattener(child, 0.25, 32, false, null);
    }), lengths = flatteners.map(function(flattener) {
      return flattener.length;
    }), length = lengths.reduce(function(sum, partLength) {
      return sum + partLength;
    }, 0), from = Math.max(0, Math.min(this._startOffset, length)), to = this._endOffset == null ? length : Math.max(from, Math.min(this._endOffset, length)), spacing = this._spacing, paragraph = story._getParagraph(start).style, measured = this._measure(
      start,
      story._content.length,
      paragraph.direction,
      true
    ), letters = measured.pieces, pieces = [];
    let width = 0;
    for (let i = 0, l = letters.length; i < l; i++) {
      const piece = letters[i];
      if (width + piece.width > to - from)
        break;
      piece.x = width;
      pieces.push(piece);
      width += piece.width + spacing;
    }
    width -= pieces.length ? spacing : 0;
    if (paragraph.direction === "rtl")
      this._mirror(pieces, width);
    const side = this._getSide(
      paragraph.justification,
      paragraph.direction
    ), offset = side === "right" ? to - width : side === "center" ? from + (to - from - width) / 2 : from, alignment = this._alignment, below = alignment === "ascender" ? measured.ascent : alignment === "descender" ? -measured.descent : alignment === "center" ? (measured.ascent - measured.descent) / 2 : 0;
    for (let i = 0, l = pieces.length; i < l; i++) {
      const piece = pieces[i];
      let middle = offset + piece.x + piece.width / 2, index = 0;
      while (index < lengths.length - 1 && middle > lengths[index]) {
        middle -= lengths[index];
        index++;
      }
      const flattener = flatteners[index], tangent = flattener.getTangentAt(middle), position = flattener.getPointAt(middle);
      if (!tangent || !position)
        continue;
      const direction = tangent.normalize(), point = position.add(direction.rotate(90).multiply(below + piece.y));
      piece.x = point.x;
      piece.y = point.y;
      piece.dx = -piece.width / 2;
      piece.rotation += angleOf(direction);
    }
    const last = pieces[pieces.length - 1];
    this._visibleEnd = last ? last.end : start;
    return [Object.assign({}, measured, {
      pieces,
      end: this._visibleEnd,
      width
    })];
  }
  /** 每个字母的盒子随字母旋转后的并集。 */
  _getBounds(matrix) {
    const layout = this._getLayout();
    if (!layout.length)
      return new Rectangle();
    const pieces = layout[0].pieces;
    let bounds = null;
    for (let i = 0, l = pieces.length; i < l; i++) {
      const piece = pieces[i], rect = this._getBox(piece, piece.dx || 0, 0), local = new Matrix().translate(piece.x, piece.y).rotate(piece.rotation);
      if (matrix)
        local.prepend(matrix);
      const transformed = local._transformBounds(rect, rect);
      bounds = bounds ? bounds.unite(transformed) : transformed;
    }
    return bounds || new Rectangle();
  }
}
export {
  PathText
};
