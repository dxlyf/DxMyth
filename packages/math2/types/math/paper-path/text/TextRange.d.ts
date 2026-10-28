import { TextStyle, TextStyleKey, TextStyleValueMap } from './TextStyle';
import { TextStory } from './TextStory';
export declare class TextRange {
    _story: TextStory;
    _start: number;
    _end: number;
    /** 区间自己的样式，用于 story 没有提供样式的情况。 */
    _style: TextStyle;
    /** 排版时附加的基线（由 TextItem#getLines() 设置）。 */
    baseline?: any;
    /** 排版时附加的包围盒（由 TextItem#getLines() 设置）。 */
    bounds?: any;
    constructor(story: TextStory, start: number, end: number);
    /** 区间所属的 story。 */
    get story(): TextStory;
    /** 区间第一个字符的下标。 */
    get start(): number;
    /** 区间最后一个字符之后的下标。 */
    get end(): number;
    /** 区间的内容。 */
    get content(): string;
    /** 区间自己的样式对象。 */
    get style(): TextStyle;
    set style(style: TextStyle | object);
    /** 区间覆盖的 story 样式（段落样式或 run 样式）。 */
    _getStyles(key: string, setting?: boolean): TextStyle[];
    /** 读取区间共享的样式值；不一致时为 undefined。 */
    _getValue<K extends TextStyleKey>(key: K): TextStyleValueMap[K] | undefined;
    /** 写入样式值：story 里的样式优先，否则写进区间自己的样式。 */
    _setValue<K extends TextStyleKey>(key: K, value: TextStyleValueMap[K]): void;
    _changed(): void;
    /** story 的 runs 中与本区间相交的部分，裁剪到区间内。 */
    getRuns(): TextRange[];
    getParagraphs(): TextRange[];
    getWords(): TextRange[];
    getLetters(): TextRange[];
    _clip(ranges: TextRange[]): TextRange[];
    /** 导出内容与偏离默认值的样式属性（纯数据）。 */
    toJSON(): any;
    toString(): string;
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
    get letterScaling(): number | import('../basic/Point').Point | undefined;
    set letterScaling(value: number | import('../basic/Point').Point);
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
