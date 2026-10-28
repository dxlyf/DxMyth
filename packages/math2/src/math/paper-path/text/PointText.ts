/**
 * 移植自 paper/src/text/PointText.js。
 *
 * 从某个起点开始、按内容自然排开的文本。
 *
 * 与原文的差异：没有 Item 矩阵，`_point` 就是文本的起点；`_getBounds()` 在
 * 局部排版结果上平移 `_point`，带 `matrix` 时再按四个角变换。
 */

import { Point } from '../basic/Point';
import { Rectangle } from '../basic/Rectangle';
import type { Matrix } from '../basic/Matrix';
import { TextItem } from './TextItem';
import type { TextItemProps, TextLine } from './TextItem';
import { TextRange } from './TextRange';

export class PointText extends TextItem {
    /** 文本的起点。 */
    _point!: Point;

    constructor(props?: TextItemProps | Point | null, point?: Point) {
        super(props, point);
        // 构造期间 _initialize() 可能已经通过 _setPoint() 写入了起点。
        if (!this._point)
            this._point = new Point();
    }

    /** 文本的起点（返回副本）。 */
    get point(): Point {
        return this._point.clone();
    }

    set point(point: Point) {
        this._point = point;
        this._changed();
    }

    _setPoint(point: Point): void {
        this._point = point;
    }

    /**
     * 按段落排版：每段一行或多行，行基线从 0 开始逐行下移自身的行高，
     * 段与段之间再加上 `spaceBefore` / `spaceAfter` 中较大的那个。
     */
    _layOut(): TextLine[] {
        const story = this._story,
            length = story._content.length,
            // 只排本项可见的部分（链接时从前一项的终点开始）。
            paragraphs = new TextRange(story, this._getStart(), length)
                    .getParagraphs(),
            lines: TextLine[] = [];
        let y = 0,
            spaceAfter = 0;
        for (let i = 0, l = paragraphs.length; i < l; i++) {
            const range = paragraphs[i],
                paragraph = story._getParagraph(range._start).style,
                line = this._measure(range._start, range._end,
                        paragraph.direction);
            if (i > 0) {
                y += line.lineHeight + Math.max(spaceAfter,
                        paragraph.spaceBefore);
            }
            spaceAfter = paragraph.spaceAfter;
            line.y = y;
            this._place(line, paragraph, true,
                    this._indent(paragraph, true, 0, 0));
            lines.push(line);
        }
        this._visibleEnd = length;
        return lines;
    }

    /**
     * 所有行的包围盒并集，平移到 `_point`；带 `matrix` 时用四个角变换后再
     * 求包围盒（没有 Item 矩阵，`_point` 即位置）。
     */
    _getBounds(matrix?: Matrix | null, options?: any): Rectangle {
        const lines = this._getLayout();
        let rect: Rectangle | null = null;
        for (let i = 0, l = lines.length; i < l; i++) {
            const line = lines[i],
                box = this._getBox(line, line.x, line.y);
            rect = i ? rect!.unite(box) : box;
        }
        if (!rect)
            rect = new Rectangle();
        const point = this._point || new Point();
        rect = rect.translate(point.x, point.y);
        return matrix ? rect.transform(matrix) : rect;
    }
}
