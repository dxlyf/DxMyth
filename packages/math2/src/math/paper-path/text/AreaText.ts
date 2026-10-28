/**
 * 移植自 paper/src/text/AreaText.js。
 *
 * 在一个区域（任意路径，可以带孔洞）里排布的文本：区域按 `columns` / `rows`
 * 与 `gutter` 分成若干块，文字逐块填入，每行在所在高度上按区域的宽度断行。
 *
 * 与原文的差异：
 * - 没有 layer / Item 层级，`_getTextWraps()` 恒返回空数组；
 * - 没有矩阵，`_getBounds()` 直接并集各行的盒子；
 * - **不移植 `fitHeight()`**（它依赖 layer、`getTopCenter()` 与二分缩放）；
 * - `new Path.Line({ from, to })` → `Path.Line(from, to)`；
 * - `Base.set()` → `Object.assign()`，`_changed()` 无参。
 */

import { Point } from '../basic/Point';
import { Rectangle } from '../basic/Rectangle';
import { Path } from '../path/Path';
import { PathItem } from '../path/PathItem';
import type { Matrix } from '../basic/Matrix';
import { Numerical } from '../util/Numerical';
import { TextItem } from './TextItem';
import type { TextItemProps, TextLine } from './TextItem';
import type { TextStyle } from './TextStyle';
import { getTextMeasurer } from './TextMeasurer';

/** 构造 AreaText 时可以传入的属性对象。 */
export interface AreaTextProps extends TextItemProps {
    textPath?: PathItem | null;
    columns?: number;
    rows?: number;
    gutter?: number;
    inset?: number;
    verticalAlign?: string;
}

/** 排版过程中的游标。 */
interface AreaState {
    pos: number;
    region: number;
    y: number | null;
    spaceAfter: number;
}

/** 一行可用的一段横向区间。 */
type Span = [number, number];

export class AreaText extends TextItem {
    /** 区域分成的栏数。 */
    _columns = 1;
    /** 区域分成的行数。 */
    _rows = 1;
    /** 栏与栏、行与行之间的间距。 */
    _gutter = 18;
    /** 区域边缘与文字之间的内缩。 */
    _inset = 0;
    /** 每栏里的文字如何纵向对齐：top / center / bottom。 */
    _verticalAlign = 'top';

    constructor(area?: Rectangle | PathItem | AreaTextProps | null,
            orientation?: string) {
        // 普通对象字面量且没有 width 时当属性用；有 width 的当成矩形。
        const isProps = area != null && typeof area === 'object'
                && (area as any).constructor === Object
                && (area as any).width === undefined;
        super(isProps ? area as AreaTextProps : null);
        if (!isProps) {
            this.textPath = area instanceof PathItem ? area
                    : area instanceof Rectangle ? Path.Rectangle(area)
                    : null;
            if (orientation)
                this.orientation = orientation;
        }
    }

    // ---------------------------------------------------------------------
    // 布局参数

    get columns(): number {
        return this._columns;
    }

    set columns(value: number) {
        this._columns = value;
        this._changed();
    }

    get rows(): number {
        return this._rows;
    }

    set rows(value: number) {
        this._rows = value;
        this._changed();
    }

    get gutter(): number {
        return this._gutter;
    }

    set gutter(value: number) {
        this._gutter = value;
        this._changed();
    }

    get inset(): number {
        return this._inset;
    }

    set inset(value: number) {
        this._inset = value;
        this._changed();
    }

    get verticalAlign(): string {
        return this._verticalAlign;
    }

    set verticalAlign(value: string) {
        this._verticalAlign = value;
        this._changed();
    }

    copyContent(source: AreaText): void {
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
    _getRegions(): Rectangle[] {
        const path = this.textPath as any,
            regions: Rectangle[] = [];
        if (path) {
            const bounds = (path.bounds as Rectangle).expand(-2 * this._inset),
                gutter = this._gutter,
                rows = Math.max(1, this._rows),
                columns = Math.max(1, this._columns),
                width = (bounds.width - gutter * (columns - 1)) / columns,
                height = (bounds.height - gutter * (rows - 1)) / rows;
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    regions.push(new Rectangle(
                            bounds.x + column * (width + gutter),
                            bounds.y + row * (height + gutter),
                            width, height));
                }
            }
        }
        return regions;
    }

    /** 该文本项周围没有文字环绕（没有 layer 层级）。 */
    _getTextWraps(): any[] {
        return [];
    }

    /**
     * 一行在 `baseline` 高度处的可用横向区间：区域在 ascent 到 descent
     * 之间每一处都必须容纳这行，再加上可选的文字环绕。
     */
    _getSpans(region: Rectangle, baseline: number, line: TextLine,
            wraps: any[]): Span[] {
        const that = this,
            top = baseline - line.ascent,
            bottom = baseline + line.descent,
            middle = (top + bottom) / 2,
            unite = function (stretches1: Span[], stretches2: Span[]): Span[] {
                const all = stretches1.concat(stretches2).sort(function (a, b) {
                        return a[0] - b[0];
                    }),
                    result: Span[] = [];
                for (let i = 0, l = all.length; i < l; i++) {
                    const last = result[result.length - 1],
                        stretch = all[i];
                    if (last && stretch[0] <= last[1]) {
                        last[1] = Math.max(last[1], stretch[1]);
                    } else {
                        result.push([stretch[0], stretch[1]]);
                    }
                }
                return result;
            },
            intersect = function (stretches1: Span[],
                    stretches2: Span[]): Span[] {
                const result: Span[] = [];
                for (let i = 0, l = stretches1.length; i < l; i++) {
                    for (let j = 0, m = stretches2.length; j < m; j++) {
                        const left = Math.max(stretches1[i][0],
                                stretches2[j][0]),
                            right = Math.min(stretches1[i][1],
                                    stretches2[j][1]);
                        if (right > left)
                            result.push([left, right]);
                    }
                }
                return result;
            },
            subtract = function (stretches1: Span[],
                    stretches2: Span[]): Span[] {
                return intersect(stretches1, stretches2.reduce(
                    // 每段之外的部分，从左到右。
                    function (outside: Span[], stretch: Span): Span[] {
                        const last = outside.pop() as Span;
                        return outside.concat([[last[0], stretch[0]],
                                [stretch[1], last[1]]]);
                    }, [[-Infinity, Infinity]] as Span[]));
            },
            // 沿 y 高度与路径的交叉点，两两配对得到内部区间。
            inside = function (paths: any[], y: number): Span[] {
                const stretches: Span[] = [];
                for (let i = 0, l = paths.length; i < l; i++) {
                    const path = paths[i],
                        bounds = path.bounds as Rectangle,
                        xs = path.getIntersections(Path.Line(
                                new Point(bounds.left - 1, y),
                                new Point(bounds.right + 1, y)))
                            .map(function (location: any) {
                                return location.point.x;
                            }).sort(function (a: number, b: number) {
                                return a - b;
                            });
                    for (let j = 0; j + 1 < xs.length; j += 2)
                        stretches.push([xs[j], xs[j + 1]]);
                }
                return unite(stretches, []);
            };
        // 区域必须完整容纳这行的 band。
        let spans = [top, middle, bottom].reduce(function (spans: Span[],
                y: number) {
            return intersect(spans, inside([that.textPath], y));
        }, [[region.left, region.right]] as Span[]);
        for (let i = 0, l = wraps.length; i < l; i++) {
            // 环绕物四周都保留 offset，所以在 band 上下更远处各看一次。
            const wrap = wraps[i],
                offset = wrap.offset,
                invert = wrap.invert,
                ys = [top - offset, top, middle, bottom, bottom + offset],
                covered = ys.reduce(function (covered: Span[] | null,
                        y: number): Span[] | null {
                    const stretches = inside(wrap.paths, y);
                    return covered ? invert
                            ? intersect(covered, stretches)
                            : unite(covered, stretches)
                        : stretches;
                }, null as Span[] | null)!.map(function (stretch) {
                    return invert
                            ? [stretch[0] + offset, stretch[1] - offset] as Span
                            : [stretch[0] - offset, stretch[1] + offset] as Span;
                });
            spans = invert ? intersect(spans, covered)
                    : subtract(spans, unite(covered, []));
        }
        return spans;
    }

    // ---------------------------------------------------------------------
    // 排版

    /**
     * 把文字填进区域：逐行断行，按段落的 justification、缩进与 `lineWrap`
     * 调整，最后按 `verticalAlign` 纵向对齐。
     */
    _layOut(): TextLine[] {
        const that = this,
            story = this._story,
            content = story._content,
            regions = this._getRegions(),
            wraps = this._getTextWraps(),
            // 每个区域第一行向下移动多少，用来纵向对齐。
            offsets = regions.map(function () {
                return 0;
            });
        let state: AreaState;

        // 从 state 开始排一段，每行的空间被 getCut(index) 收窄，见 _breakLine。
        const lay = function (getCut?: ((index: number) => number) | null) {
            let pos = state.pos,
                region = state.region,
                y = state.y;
            const paragraph = story._getParagraph(pos),
                style = paragraph.style,
                // 段间距只加一次，且不在第一行之前。
                result: TextLine[] = [];
            let space = pos === paragraph.start && y !== null
                    ? Math.max(state.spaceAfter, style.spaceBefore)
                    : 0;
            let isComplete = false;
            while (regions[region]) {
                const bounds = regions[region],
                    // 下一行首字符的度量，用来找位置。
                    next = that._measure(pos,
                            Math.min(pos + 1, paragraph.end), style.direction),
                    baseline = y === null
                        ? bounds.top + offsets[region] + next.ascent
                        : y + next.lineHeight + space;
                // 没有高度的行放不进去。
                if (!next.lineHeight || next.lineHeight < 0)
                    break;
                if (baseline + next.descent > bounds.bottom) {
                    // 本区域满了，换下一个。
                    region++;
                    y = null;
                    continue;
                }
                // 在这个高度上按阅读顺序填满各段，再往下走。
                const spans = that._getSpans(bounds, baseline, next, wraps);
                if (style.direction === 'rtl')
                    spans.reverse();
                for (let i = 0, l = spans.length; i < l && !isComplete; i++) {
                    const span = spans[i],
                        line = that._breakLine(pos, paragraph,
                            pos === paragraph.start, span,
                            getCut ? getCut(result.length) : 0,
                            // 比任何一行都宽的词独占一行。
                            span[1] - span[0] >= bounds.width
                                - Numerical.GEOMETRIC_EPSILON);
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
                isComplete: isComplete,
                state: {
                    pos: pos,
                    region: region,
                    y: y,
                    spaceAfter: style.spaceAfter
                } as AreaState
            };
        };

        // 在 0..high 之间找 isAbove(value) 变真的分界，精度 precision。
        const search = function (high: number, precision: number,
                isAbove: (value: number) => boolean): [number, number] {
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

        // 只要段落完整、行数不变，收窄就没有影响。
        const keeps = function (attempt: any, count: number): boolean {
            return attempt.isComplete && attempt.lines.length === count;
        };

        // 从第 from 行起尽量收窄，让各行长度平均。
        const balance = function (count: number, from: number): any {
            const cutFrom = function (cut: number) {
                    return function (index: number) {
                        return index >= from ? cut : 0;
                    };
                },
                widest = regions.reduce(function (width, bounds) {
                    return Math.max(width, bounds.width);
                }, 0),
                cut = search(widest, 0.5, function (cut) {
                    return !keeps(lay(cutFrom(cut)), count);
                })[0];
            return cut > 0 && lay(cutFrom(cut));
        };

        // 从头开始逐段排版。
        const layAll = function (): TextLine[] {
            const layout: TextLine[] = [];
            let result: any,
                match: RegExpExecArray | null;
            state = {
                pos: that._getStart(),
                region: 0,
                y: null,
                spaceAfter: 0
            };
            do {
                result = lay();
                const lines = result.lines,
                    count = lines.length,
                    wrap = result.paragraph.lineWrap;
                if (result.isComplete && count > 1) {
                    if (wrap === 'balance') {
                        result = balance(count, 0) || result;
                    } else if (wrap === 'pretty' && lines[count - 1].width
                            < lines[count - 2].width / 3) {
                        // 最后一行太短时，平衡最后四行。
                        result = balance(count, Math.max(0, count - 4))
                                || result;
                    }
                }
                layout.push.apply(layout, result.lines);
                state = result.state;
                // 跳过段落之间的换行，进入下一段。
                match = result.isComplete
                        ? /^(\r\n|\n|\r)/.exec(content.slice(state.pos))
                        : null;
                if (match)
                    state.pos += match[0].length;
            } while (match);
            return layout;
        };

        // 某区域最后一行，以及它下面的剩余空间。
        const getLast = function (layout: TextLine[], region: number): any {
            for (let i = layout.length - 1; i >= 0; i--) {
                const line = layout[i];
                if (line.region === region) {
                    return {
                        line: line,
                        free: regions[region].bottom - line.y
                                - line.descent
                    };
                }
            }
            return null;
        };

        let layout = layAll();
        const align = this._verticalAlign;
        if (align !== 'top') {
            // 从更低的位置重新排版，保持区域显示的内容不变，从而纵向对齐。
            for (let r = 0, l = regions.length; r < l; r++) {
                const last = getLast(layout, r);
                if (last && last.free > 0) {
                    const end = last.line.end,
                        getExcess = function (offset: number): number | null {
                            offsets[r] = offset;
                            const moved = getLast(layAll(), r);
                            return moved && moved.line.end === end
                                    ? moved.free - (align === 'center'
                                        ? offset : 0)
                                    : null;
                        };
                    let excess = getExcess(align === 'center'
                            ? last.free / 2 : last.free);
                    if (excess === null || Math.abs(excess) > 0.01) {
                        offsets[r] = search(last.free, 0.01,
                            function (offset) {
                                const value = getExcess(offset);
                                return value === null || value < 0;
                            })[0];
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
    _breakLine(start: number, paragraph: { style: TextStyle; start: number;
            end: number }, isFirst: boolean, room: Span, cut: number,
            canForce: boolean): TextLine | null {
        const that = this,
            content = this._story._content,
            style = paragraph.style,
            direction = style.direction,
            indented = this._indent(style, isFirst, room[0], room[1]),
            words = /[^\s\u00ad]*\u00ad|\S+\s*|\s+/g,
            text = content.slice(start, paragraph.end),
            ends: number[] = [];

        // 量出到 `end` 为止的行（去掉行尾空格；在软连字符处补一个“-”）。
        const measure = function (end: number): TextLine {
            const line = that._measure(start, start + content.slice(start, end)
                    .replace(/\s+$/, '').length, direction);
            if (content[end - 1] === '\u00ad') {
                const last = line.pieces[line.pieces.length - 1],
                    width = getTextMeasurer().getTextWidth(last.font, ['-'],
                        last.tracking, direction || undefined) * last.scale.x;
                line.pieces.push(Object.assign({}, last, {
                    content: '-',
                    start: end,
                    end: end,
                    x: (last.x as number) + (last.width as number),
                    width: width
                }));
                line.width += width;
            }
            return line;
        };

        let match: RegExpExecArray | null;
        while ((match = words.exec(text)))
            ends.push(start + match.index + match[0].length);
        // 行只会越来越宽：先按 2 倍步长找，再在上界内二分。
        const width = indented[1] - indented[0] - cut,
            fits = function (index: number): boolean {
                return measure(ends[index]).width <= width;
            };
        let low = -1,
            high = 0;
        while (high < ends.length && fits(high)) {
            low = high;
            high = 2 * high + 1;
        }
        high = Math.min(high, ends.length);
        while (high - low > 1) {
            const middle = (low + high) >> 1;
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
    _getBounds(matrix?: Matrix | null): Rectangle {
        const lines = this._getLayout();
        let rect: Rectangle | null = null;
        for (let i = 0, l = lines.length; i < l; i++) {
            const line = lines[i],
                box = this._getBox(line, line.x, line.y);
            rect = rect ? rect.unite(box) : box;
        }
        if (!rect)
            rect = new Rectangle();
        return matrix ? matrix._transformBounds(rect, rect) : rect;
    }
}
