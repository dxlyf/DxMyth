/**
 * 移植自 paper/src/text/PathText.js。
 *
 * 沿一条路径排布的文本：每个字母单独测量、单独旋转到它所在位置的路径方向上。
 * 复合路径上，文本沿着其中一条子路径排到另一条。
 *
 * 与原文的差异：
 * - 没有 Item 矩阵：`PathFlattener` 的第五个参数传 `null`（见 `_layOut`）；
 * - `path._children || [path]` 改成 `path instanceof CompoundPath ? ...`；
 * - `flattener.getPointAt()/getTangentAt()` 可能返回 `null`，加了空值保护；
 * - `tangent.getAngle()` 用 `Math.atan2()` 实现（我们的 Point 没有无参 getAngle）；
 * - `Base.set()` → `Object.assign()`；`_changed()` 无参。
 */

import { Point } from '../basic/Point';
import { Matrix } from '../basic/Matrix';
import { Rectangle } from '../basic/Rectangle';
import { PathFlattener } from '../path/PathFlattener';
import { CompoundPath } from '../path/CompoundPath';
import type { PathItem } from '../path/PathItem';
import { TextItem } from './TextItem';
import type { TextItemProps, TextLine, TextPiece } from './TextItem';

/** 构造 PathText 时可以传入的属性对象。 */
export interface PathTextProps extends TextItemProps {
    textPath?: PathItem | null;
    startOffset?: number;
    endOffset?: number | null;
    alignment?: string;
    spacing?: number;
}

/** 向量的方向角（度）。 */
function angleOf(point: Point): number {
    return Math.atan2(point.y, point.x) * 180 / Math.PI;
}

export class PathText extends TextItem {
    /** 文字在路径上的起点偏移。 */
    _startOffset = 0;
    /** 文字在路径上的终点偏移，null 表示到路径末尾。 */
    _endOffset: number | null = null;
    /** 字母的哪一部分落在路径上。 */
    _alignment = 'baseline';
    /** 字母之间额外增加的间距。 */
    _spacing = 0;

    constructor(path?: PathItem | PathTextProps | null, orientation?: string) {
        // 普通对象字面量当属性用，否则当成文本路径。
        const hasProps = path != null && typeof path === 'object'
                && (path as any).constructor === Object;
        super(hasProps ? path as PathTextProps : null);
        if (!hasProps) {
            this.textPath = path as PathItem | null;
            if (orientation)
                this.orientation = orientation;
        }
    }

    // ---------------------------------------------------------------------
    // 布局参数

    /** 文字在路径上的起点偏移。 */
    get startOffset(): number {
        return this._startOffset;
    }

    set startOffset(value: number) {
        this._startOffset = value;
        this._changed();
    }

    /** 文字在路径上的终点偏移，null 表示到路径末尾。 */
    get endOffset(): number | null {
        return this._endOffset;
    }

    set endOffset(value: number | null) {
        this._endOffset = value;
        this._changed();
    }

    /** 字母的哪一部分落在路径上：baseline / ascender / descender / center。 */
    get alignment(): string {
        return this._alignment;
    }

    set alignment(value: string) {
        this._alignment = value;
        this._changed();
    }

    /** 字母之间额外增加的间距。 */
    get spacing(): number {
        return this._spacing;
    }

    set spacing(value: number) {
        this._spacing = value;
        this._changed();
    }

    copyContent(source: PathText): void {
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
    _layOut(): TextLine[] {
        const path: any = this.textPath,
            story = this._story,
            start = this._getStart(),
            children: any[] = path
                ? path instanceof CompoundPath ? path.children : [path]
                : [],
            // 没有 Item 矩阵，第五个参数传 null（原文传 child._matrix）。
            flatteners = children.map(function (child) {
                return new PathFlattener(child, 0.25, 32, false, null);
            }),
            lengths = flatteners.map(function (flattener) {
                return flattener.length;
            }),
            length = lengths.reduce(function (sum, partLength) {
                return sum + partLength;
            }, 0),
            from = Math.max(0, Math.min(this._startOffset, length)),
            to = this._endOffset == null ? length
                    : Math.max(from, Math.min(this._endOffset, length)),
            spacing = this._spacing,
            paragraph = story._getParagraph(start).style,
            // 逐字测量，才能知道每个字母的宽度。
            measured = this._measure(start, story._content.length,
                    paragraph.direction, true),
            letters = measured.pieces,
            pieces: TextPiece[] = [];
        let width = 0;

        // 1. 放得下的字母，按顺序累加；从右到左的第一段则镜像。
        for (let i = 0, l = letters.length; i < l; i++) {
            const piece = letters[i];
            if (width + piece.width > to - from)
                break;
            piece.x = width;
            pieces.push(piece);
            width += piece.width + spacing;
        }
        width -= pieces.length ? spacing : 0;
        if (paragraph.direction === 'rtl')
            this._mirror(pieces, width);

        // 2. 按第一段的对齐方式沿路径摆放。
        const side = this._getSide(paragraph.justification,
                paragraph.direction),
            offset = side === 'right' ? to - width
                    : side === 'center' ? from + (to - from - width) / 2
                    : from,
            alignment = this._alignment,
            below = alignment === 'ascender' ? measured.ascent
                    : alignment === 'descender' ? -measured.descent
                    : alignment === 'center'
                        ? (measured.ascent - measured.descent) / 2
                    : 0;
        for (let i = 0, l = pieces.length; i < l; i++) {
            const piece = pieces[i];
            let middle = offset + piece.x + piece.width / 2,
                index = 0;
            while (index < lengths.length - 1 && middle > lengths[index]) {
                middle -= lengths[index];
                index++;
            }
            const flattener = flatteners[index],
                tangent = flattener.getTangentAt(middle),
                position = flattener.getPointAt(middle);
            // 空路径或取不到点时，把字母留在原处。
            if (!tangent || !position)
                continue;
            const direction = tangent.normalize(),
                point = position.add(direction.rotate(90)
                        .multiply(below + piece.y));
            piece.x = point.x;
            piece.y = point.y;
            piece.dx = -piece.width / 2;
            piece.rotation += angleOf(direction);
        }
        const last = pieces[pieces.length - 1];
        this._visibleEnd = last ? last.end : start;
        return [Object.assign({}, measured, {
            pieces: pieces,
            end: this._visibleEnd,
            width: width
        })];
    }

    /** 每个字母的盒子随字母旋转后的并集。 */
    _getBounds(matrix?: Matrix | null): Rectangle {
        const layout = this._getLayout();
        if (!layout.length)
            return new Rectangle();
        const pieces = layout[0].pieces;
        let bounds: Rectangle | null = null;
        for (let i = 0, l = pieces.length; i < l; i++) {
            const piece = pieces[i],
                rect = this._getBox(piece as any, piece.dx || 0, 0),
                local = new Matrix().translate(piece.x, piece.y)
                        .rotate(piece.rotation);
            if (matrix)
                local.prepend(matrix);
            const transformed = local._transformBounds(rect, rect);
            bounds = bounds ? bounds.unite(transformed) : transformed;
        }
        return bounds || new Rectangle();
    }
}
