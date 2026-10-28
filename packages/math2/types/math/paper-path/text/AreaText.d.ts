import { Rectangle } from '../basic/Rectangle';
import { PathItem } from '../path/PathItem';
import { Matrix } from '../basic/Matrix';
import { TextItem, TextItemProps, TextLine } from './TextItem';
import { TextStyle } from './TextStyle';
/** 构造 AreaText 时可以传入的属性对象。 */
export interface AreaTextProps extends TextItemProps {
    textPath?: PathItem | null;
    columns?: number;
    rows?: number;
    gutter?: number;
    inset?: number;
    verticalAlign?: string;
}
/** 一行可用的一段横向区间。 */
type Span = [number, number];
export declare class AreaText extends TextItem {
    /** 区域分成的栏数。 */
    _columns: number;
    /** 区域分成的行数。 */
    _rows: number;
    /** 栏与栏、行与行之间的间距。 */
    _gutter: number;
    /** 区域边缘与文字之间的内缩。 */
    _inset: number;
    /** 每栏里的文字如何纵向对齐：top / center / bottom。 */
    _verticalAlign: string;
    constructor(area?: Rectangle | PathItem | AreaTextProps | null, orientation?: string);
    get columns(): number;
    set columns(value: number);
    get rows(): number;
    set rows(value: number);
    get gutter(): number;
    set gutter(value: number);
    get inset(): number;
    set inset(value: number);
    get verticalAlign(): string;
    set verticalAlign(value: string);
    copyContent(source: AreaText): void;
    /** 区域按内缩、行、列分成的矩形，按文字填充的顺序排列。 */
    _getRegions(): Rectangle[];
    /** 该文本项周围没有文字环绕（没有 layer 层级）。 */
    _getTextWraps(): any[];
    /**
     * 一行在 `baseline` 高度处的可用横向区间：区域在 ascent 到 descent
     * 之间每一处都必须容纳这行，再加上可选的文字环绕。
     */
    _getSpans(region: Rectangle, baseline: number, line: TextLine, wraps: any[]): Span[];
    /**
     * 把文字填进区域：逐行断行，按段落的 justification、缩进与 `lineWrap`
     * 调整，最后按 `verticalAlign` 纵向对齐。
     */
    _layOut(): TextLine[];
    /**
     * 从 `start` 起在最后一个放得下的词（或软连字符）处断行，并按段落的
     * justification 与缩进摆放。行尾空格悬挂在区间外。第一个词都放不下时，
     * 只有 `canForce` 才让它独占一行，否则不产生行。
     */
    _breakLine(start: number, paragraph: {
        style: TextStyle;
        start: number;
        end: number;
    }, isFirst: boolean, room: Span, cut: number, canForce: boolean): TextLine | null;
    /** 各行的盒子并集；带 matrix 时变换后再取包围盒。 */
    _getBounds(matrix?: Matrix | null): Rectangle;
}
export {};
