import { Point } from '../basic/Point';
/** 拥有样式的对象（TextStory / TextRange / TextItem），只需要变更通知。 */
export interface TextStyleOwner {
    _changed?(): void;
}
/** 文本样式的属性表。 */
export interface TextStyleValueMap {
    fontFamily: string;
    fontWeight: string | number;
    fontStyle: string;
    fontSize: number | string;
    fontVariations: string | null;
    /** 字距，单位是千分之一 em。 */
    letterTracking: number;
    letterKerning: number | null;
    baselineShift: number;
    baselinePosition: string;
    /** 字形横向缩放，数字或 Point。 */
    letterScaling: number | Point;
    letterRotation: number;
    capitals: string;
    underline: boolean;
    strikethrough: boolean;
    features: string | null;
    lineHeight: number | string;
    justification: string;
    justifyLast: string | boolean;
    justifySpacing: number | null;
    startIndent: number;
    endIndent: number;
    firstLineIndent: number;
    spaceBefore: number;
    spaceAfter: number;
    hyphenation: boolean;
    composer: string;
    lineWrap: string;
    tabs: any[] | null;
    direction: string | null;
}
export type TextStyleKey = keyof TextStyleValueMap;
/** 比较两个样式值（数组按元素比较）。 */
export declare function styleValueEquals(a: any, b: any): boolean;
export declare class TextStyle {
    /** 默认值表（供 TextStory 等按 key 遍历）。 */
    static readonly defaults: TextStyleValueMap;
    /** 实例上的默认值表，对应原文的 `style._defaults`。 */
    readonly _defaults: TextStyleValueMap;
    /** 上下标的基线偏移比例，对应原文 `Style#_scriptShift`（Style.js 第 444 行）。 */
    readonly _scriptShift = 0.333;
    /** 只保存显式设置过的属性。 */
    _values: Partial<TextStyleValueMap>;
    /** 归属者：TextStory / TextRange / TextItem。 */
    _owner: TextStyleOwner | null;
    constructor(values?: object | null, owner?: unknown);
    /** 所有可设置属性名。 */
    keys(): TextStyleKey[];
    /** key 是否是文本样式属性。 */
    has(key: string): key is TextStyleKey;
    /** 读取属性，未显式设置时回退到默认值。 */
    get<K extends TextStyleKey>(key: K): TextStyleValueMap[K];
    /** 设置属性；值有变化时通知 owner。 */
    set<K extends TextStyleKey>(key: K, value: TextStyleValueMap[K]): void;
    /** 批量设置：接受另一个 TextStyle 或普通对象，只取文本样式属性。 */
    setValues(values: object): void;
    _changed(): void;
    /** 两个样式的有效值是否完全一致。 */
    equals(style: TextStyle | null): boolean;
    /**
     * 拼出 CSS font 字符串，对应原文 `Style#_getCanvasFont()`：
     * `fontStyle fontWeight fontSize px families`，family 需要时加引号。
     */
    _getCanvasFont(): string;
    /** {@link _getCanvasFont} 的别名。 */
    getFont(): string;
    /** 字号（像素）。 */
    _getFontSize(): number;
    /**
     * 行高（像素）。
     * `'auto'` 取 1.2 倍字号；数字按字号的倍数；带单位的字符串按像素规则解析。
     */
    _getLineHeight(): number;
    /**
     * 行高，以固定长度表示，对应原文 `Style#getLeading()`（Style.js 第 481 行）。
     */
    getLeading(): number;
    /** 设置行高：null 表示 `'auto'`，数字换算成 px。 */
    setLeading(leading: number | string | null): void;
    get fontFamily(): string;
    set fontFamily(value: string);
    get fontWeight(): string | number;
    set fontWeight(value: string | number);
    get fontStyle(): string;
    set fontStyle(value: string);
    get fontSize(): number | string;
    set fontSize(value: number | string);
    get fontVariations(): string | null;
    set fontVariations(value: string | null);
    /** 字距，单位千分之一 em。 */
    get letterTracking(): number;
    set letterTracking(value: number);
    /** 字距转换成 canvas 的 `letterSpacing`（em 单位）。 */
    _getCanvasLetterSpacing(): string;
    get letterKerning(): number | null;
    set letterKerning(value: number | null);
    get baselineShift(): number;
    set baselineShift(value: number);
    get baselinePosition(): string;
    set baselinePosition(value: string);
    /** 字形横向缩放，数字或 Point。 */
    get letterScaling(): number | Point;
    set letterScaling(value: number | Point);
    get letterRotation(): number;
    set letterRotation(value: number);
    get capitals(): string;
    set capitals(value: string);
    get underline(): boolean;
    set underline(value: boolean);
    get strikethrough(): boolean;
    set strikethrough(value: boolean);
    get features(): string | null;
    set features(value: string | null);
    get lineHeight(): number | string;
    set lineHeight(value: number | string);
    get justification(): string;
    set justification(value: string);
    get justifyLast(): boolean | string;
    set justifyLast(value: boolean | string);
    get justifySpacing(): number;
    set justifySpacing(value: number);
    get startIndent(): number;
    set startIndent(value: number);
    get endIndent(): number;
    set endIndent(value: number);
    get firstLineIndent(): number;
    set firstLineIndent(value: number);
    get spaceBefore(): number;
    set spaceBefore(value: number);
    get spaceAfter(): number;
    set spaceAfter(value: number);
    get hyphenation(): boolean;
    set hyphenation(value: boolean);
    get composer(): string;
    set composer(value: string);
    get lineWrap(): string;
    set lineWrap(value: string);
    get tabs(): any[] | null;
    set tabs(value: any[] | null);
    get direction(): string;
    set direction(value: string);
    /** 这些样式在 key 上共同的值；不一致时返回 undefined。 */
    static merge(styles: TextStyle[], key: TextStyleKey): any;
    /** 把 key 设置为 value，应用到所有样式。 */
    static apply(styles: TextStyle[], key: TextStyleKey, value: any): void;
}
