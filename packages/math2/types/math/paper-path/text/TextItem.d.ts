import { Point } from '../basic/Point';
import { Rectangle } from '../basic/Rectangle';
import { Matrix } from '../basic/Matrix';
import { TextStory } from './TextStory';
import { TextStyle, TextStyleKey, TextStyleValueMap } from './TextStyle';
import { TextRange } from './TextRange';
import { FontMetrics } from './TextMeasurer';
/** 构造 PointText 时可以传入的属性对象。 */
export interface TextItemProps {
    content?: string;
    point?: Point;
    /** 其余键当作文本样式属性。 */
    [key: string]: any;
}
/** 一段共享同一套样式的文本片段，及其排版位置。 */
export interface TextPiece {
    style: TextStyle;
    font: string;
    tracking: string;
    size: number;
    ascent: number;
    descent: number;
    lineHeight: number;
    /** 相对基线的纵向偏移。 */
    y: number;
    scale: Point;
    rotation: number;
    capitals: boolean;
    content?: string;
    start?: number;
    end?: number;
    x?: number;
    width?: number;
    dx?: number;
}
/** 排版后的一行。 */
export interface TextLine {
    pieces: TextPiece[];
    start: number;
    end: number;
    x: number;
    y: number;
    width: number;
    lineHeight: number;
    ascent: number;
    descent: number;
    /** 该行所在的区域（AreaText 用）。 */
    region?: number;
}
export declare class TextItem {
    /** 该文本项显示的 story（可能与其他文本项共享）。 */
    _story: TextStory;
    /** 文本项自身的样式，代表整段文本的样式。 */
    _style: TextStyle;
    /** 排版结果缓存。 */
    _layout: TextLine[] | null;
    /** 按字体缓存的度量。 */
    _fontMetrics: Record<string, FontMetrics> | null;
    /** 文字沿其排布的路径（本移植只保存引用）。 */
    _textPath: any | null;
    /** 行方向：'horizontal' 或 'vertical'。 */
    _orientation: string;
    /** 当前文本项显示到 story 的哪个位置为止。 */
    _visibleEnd: number;
    constructor(props?: TextItemProps | Point | null, point?: Point);
    /**
     * 设置初始属性：样式先写、内容后写，避免排版中间态。
     * `point` 既可以作为第二个参数，也可以放在属性对象的 `point` 里。
     */
    _initialize(props?: TextItemProps | null, point?: Point): void;
    /** 由子类实现：设置文本的起点。 */
    _setPoint(point: Point): void;
    /** 文本内容。 */
    get content(): string;
    set content(content: string);
    /** 替换 story 中 `start` 到 `end` 的内容。 */
    replace(content: string, start: number | TextRange, end?: number): void;
    /** story 中 `start` 到 `end` 的范围。 */
    range(start: number, end: number): TextRange;
    /** 文本的 runs。 */
    get runs(): TextRange[];
    set runs(value: any[]);
    /** 文本的段落。 */
    get paragraphs(): TextRange[];
    set paragraphs(value: any[]);
    /** 文本里的词。 */
    get words(): TextRange[];
    /** 文本里的字母。 */
    get letters(): TextRange[];
    /** 该文本项显示的 story。 */
    get story(): TextStory;
    /** 文本行方向：'horizontal' 或 'vertical'。 */
    get orientation(): string;
    set orientation(orientation: string);
    /** 文字沿其排布的路径（AreaText / PathText 用）。 */
    get textPath(): any | null;
    set textPath(path: any | null);
    /**
     * 把文本项 `next` 接在本项之后，story 的内容流进它。
     */
    link(next: TextItem): boolean;
    /** 本项是否与其他文本项链接。 */
    isLinked(): boolean;
    /**
     * 断开链接：`'both'` 把本项单独取出，`'before'` / `'after'` 在它前后
     * 把 story 一分为二。
     */
    unlink(which?: string): boolean;
    /** story 中本项之后的文本项。 */
    get nextTextItem(): TextItem | null;
    /** story 中本项之前的文本项。 */
    get previousTextItem(): TextItem | null;
    /** 复制另一个文本项的内容与方向。 */
    copyContent(source: TextItem): void;
    /** 本项显示的 story 范围。 */
    get visibleRange(): TextRange;
    /** 本项显示的 story 范围。 */
    getVisibleRange(): TextRange;
    /** 可见范围 `[start, end]`。 */
    _getVisibleRange(): [number, number];
    /** 本项从 story 的哪个位置开始：前一项的可见终点。 */
    _getStart(): number;
    /** 文本是否为空。 */
    isEmpty(): boolean;
    /** 排版结果（惰性计算）。 */
    _getLayout(): TextLine[];
    /** 由子类实现：把 story 排成行。 */
    _layOut(): TextLine[];
    /** 内容或样式变化：让排版与字体度量失效，并让后一个文本项也失效。 */
    _changed(): void;
    /**
     * 把 `start` 到 `end` 的文本量成一行：各 run 的 piece（样式、位置、宽度）、
     * 总宽、行高、ascent / descent。
     */
    _measure(start: number, end: number, direction?: string | null, byLetter?: boolean): TextLine;
    /** 一个样式的排版参数：字体、字距、字号、度量、行高、缩放与旋转。 */
    _getPiece(style: TextStyle): TextPiece;
    /**
     * 一行或一个 piece 的包围盒：高为行高，ascent 上方与 descent 下方留出
     * 相同的 leading。
     */
    _getBox(entry: {
        lineHeight: number;
        ascent: number;
        descent: number;
        width: number;
    }, x: number, y: number): Rectangle;
    /** 段落缩进后，一行可用的 [left, right]。 */
    _indent(paragraph: TextStyle, isFirst: boolean, left: number, right: number): [number, number];
    /** 按段落的 justification 把一行放进可用区间。 */
    _place(line: TextLine, paragraph: TextStyle, isLast: boolean, room: [number, number]): void;
    /** 把一行多出的宽度按空格数量摊到词之间。 */
    _justify(line: TextLine, width: number, direction?: string | null): void;
    /** 把一行的 pieces 按从右到左的位置镜像。 */
    _mirror(pieces: TextPiece[], width: number): void;
    /** 移动整行及其 pieces。 */
    _shift(line: TextLine, x: number, y: number): void;
    /** 按段落方向把 'start' / 'end' 解析成具体的对齐边。 */
    _getSide(justification: string, direction: string | null): string;
    /**
     * 文本的行：每行是 story 的一段 TextRange，另带 `baseline` 与 `bounds`。
     */
    getLines(): TextRange[];
    /** 文本的行。 */
    get lines(): TextRange[];
    /** 文本的包围盒，由子类实现（没有 Item 层与矩阵）。 */
    get bounds(): Rectangle;
    _getBounds(matrix?: Matrix | null, options?: any): Rectangle;
    /** 该属性对应的 story 样式：段落样式，或所有 run 的样式。 */
    _getTextStyles(key: TextStyleKey): TextStyle[];
    /** 读取文本共享的样式值；不一致时为 undefined。 */
    _getStyleValue<K extends TextStyleKey>(key: K): TextStyleValueMap[K] | undefined;
    /** 写入样式值：同时写进 story 的样式与文本项自身的样式。 */
    _setStyleValue<K extends TextStyleKey>(key: K, value: TextStyleValueMap[K]): void;
    get fontFamily(): string | undefined;
    set fontFamily(value: string);
    get fontWeight(): string | number | undefined;
    set fontWeight(value: string | number);
    get fontStyle(): string | undefined;
    set fontStyle(value: string);
    get fontSize(): number | string | undefined;
    set fontSize(value: number | string);
    get fontVariations(): string | null | undefined;
    set fontVariations(value: string | null);
    get letterTracking(): number | undefined;
    set letterTracking(value: number);
    get letterKerning(): number | null | undefined;
    set letterKerning(value: number | null);
    get baselineShift(): number | undefined;
    set baselineShift(value: number);
    get baselinePosition(): string | undefined;
    set baselinePosition(value: string);
    get letterScaling(): number | Point | undefined;
    set letterScaling(value: number | Point);
    get letterRotation(): number | undefined;
    set letterRotation(value: number);
    get capitals(): string | undefined;
    set capitals(value: string);
    get underline(): boolean | undefined;
    set underline(value: boolean);
    get strikethrough(): boolean | undefined;
    set strikethrough(value: boolean);
    get features(): string | null | undefined;
    set features(value: string | null);
    get lineHeight(): number | string | undefined;
    set lineHeight(value: number | string);
    get justification(): string | undefined;
    set justification(value: string);
    get justifyLast(): string | boolean | undefined;
    set justifyLast(value: string | boolean);
    get justifySpacing(): number | null | undefined;
    set justifySpacing(value: number | null);
    get startIndent(): number | undefined;
    set startIndent(value: number);
    get endIndent(): number | undefined;
    set endIndent(value: number);
    get firstLineIndent(): number | undefined;
    set firstLineIndent(value: number);
    get spaceBefore(): number | undefined;
    set spaceBefore(value: number);
    get spaceAfter(): number | undefined;
    set spaceAfter(value: number);
    get hyphenation(): boolean | undefined;
    set hyphenation(value: boolean);
    get composer(): string | undefined;
    set composer(value: string);
    get lineWrap(): string | undefined;
    set lineWrap(value: string);
    get tabs(): any[] | null | undefined;
    set tabs(value: any[] | null);
    get direction(): string | null | undefined;
    set direction(value: string | null);
}
