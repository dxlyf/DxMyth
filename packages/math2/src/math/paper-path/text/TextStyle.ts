/**
 * 移植自 paper/src/style/Style.js 的**文本相关**部分，去掉颜色、渐变、阴影、描边。
 *
 * 与原文的差异：
 * - 没有 bean 机制，每个属性都是显式写的 `get` / `set` 访问器；
 * - `_values` 只保存显式设置过的属性，读取时回退到 `_defaults`；
 * - 没有 project / view / DPI，`em` 与 `%` 以 12px 为基准（见 `_parseSize`）。
 */

import type { Point } from '../basic/Point';

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

/**
 * 默认值表，对齐 paper 0.12 的 Style.js（第 97–127 行）。
 *
 * - 字符属性包含 letterTracking / letterKerning / baseline* / capitals /
 *   underline / strikethrough / features；
 * - `composer` 默认 `'paragraph'`（本版本里没有 `'apr'` 这个取值）。
 */
const DEFAULTS: TextStyleValueMap = {
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 12,
    fontVariations: null,
    // 单位是千分之一 em，与原文 letterTracking 一致。
    letterTracking: 0,
    letterKerning: null,
    baselineShift: 0,
    baselinePosition: 'normal',
    letterScaling: 1,
    letterRotation: 0,
    capitals: 'normal',
    underline: false,
    strikethrough: false,
    features: null,
    lineHeight: 'auto',

    justification: 'left',
    justifyLast: 'left',
    justifySpacing: null,
    startIndent: 0,
    endIndent: 0,
    firstLineIndent: 0,
    spaceBefore: 0,
    spaceAfter: 0,
    hyphenation: false,
    composer: 'paragraph',
    lineWrap: 'normal',
    tabs: null,
    direction: null
};

const KEYS = Object.keys(DEFAULTS) as TextStyleKey[];

/** 比较两个样式值（数组按元素比较）。 */
export function styleValueEquals(a: any, b: any): boolean {
    if (a === b)
        return true;
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            if (!styleValueEquals(a[i], b[i]))
                return false;
        }
        return true;
    }
    return false;
}

/**
 * 把 `12`、`'12'`、`'12px'`、`'9pt'`、`'1.5em'`、`'150%'` 解析成像素。
 *
 * 简化说明：原文通过 `view.getPixelSize()` 换算，这里没有 view 与 DPI，
 * 因此 `pt` 固定按 4/3 换算，`em` / `%` 以 12px 为基准。
 */
function parseSize(size: number | string): number {
    if (typeof size === 'number')
        return size;
    const value = parseFloat(size);
    if (isNaN(value))
        return 0;
    if (/pt/i.test(size))
        return value * 4 / 3;
    if (/em/i.test(size))
        return value * 12;
    if (/%/.test(size))
        return value / 100 * 12;
    return value;
}

export class TextStyle {
    /** 默认值表（供 TextStory 等按 key 遍历）。 */
    static readonly defaults: TextStyleValueMap = DEFAULTS;

    /** 实例上的默认值表，对应原文的 `style._defaults`。 */
    readonly _defaults: TextStyleValueMap = DEFAULTS;

    /** 上下标的基线偏移比例，对应原文 `Style#_scriptShift`（Style.js 第 444 行）。 */
    readonly _scriptShift = 0.333;

    /** 只保存显式设置过的属性。 */
    _values: Partial<TextStyleValueMap> = {};

    /** 归属者：TextStory / TextRange / TextItem。 */
    _owner: TextStyleOwner | null;

    constructor(values?: object | null, owner?: unknown) {
        this._owner = (owner as TextStyleOwner) || null;
        if (values)
            this.setValues(values);
    }

    // ---------------------------------------------------------------------
    // 通用读写

    /** 所有可设置属性名。 */
    keys(): TextStyleKey[] {
        return KEYS.slice();
    }

    /** key 是否是文本样式属性。 */
    has(key: string): key is TextStyleKey {
        return key in DEFAULTS;
    }

    /** 读取属性，未显式设置时回退到默认值。 */
    get<K extends TextStyleKey>(key: K): TextStyleValueMap[K] {
        const value = this._values[key],
            result = value === undefined ? DEFAULTS[key] : value;
        return result as TextStyleValueMap[K];
    }

    /** 设置属性；值有变化时通知 owner。 */
    set<K extends TextStyleKey>(key: K, value: TextStyleValueMap[K]): void {
        if (!(key in DEFAULTS))
            return;
        if (this._values[key] !== value) {
            this._values[key] = value;
            this._changed();
        }
    }

    /** 批量设置：接受另一个 TextStyle 或普通对象，只取文本样式属性。 */
    setValues(values: object): void {
        const source: any = values instanceof TextStyle
                ? values._values
                : values;
        if (!source)
            return;
        for (const key in source) {
            if (key in DEFAULTS)
                this.set(key as TextStyleKey, source[key]);
        }
    }

    _changed(): void {
        const owner = this._owner;
        if (owner && typeof owner._changed === 'function')
            owner._changed();
    }

    /** 两个样式的有效值是否完全一致。 */
    equals(style: TextStyle | null): boolean {
        if (style === this)
            return true;
        if (!style)
            return false;
        for (let i = 0; i < KEYS.length; i++) {
            const key = KEYS[i];
            if (!styleValueEquals(this.get(key), style.get(key)))
                return false;
        }
        return true;
    }

    // ---------------------------------------------------------------------
    // 字体

    /**
     * 拼出 CSS font 字符串，对应原文 `Style#_getCanvasFont()`：
     * `fontStyle fontWeight fontSize px families`，family 需要时加引号。
     */
    _getCanvasFont(): string {
        const size = this.get('fontSize'),
            sizeText = typeof size === 'number'
                ? size + 'px'
                : /[a-z%]/i.test(size) ? size : size + 'px',
            // CSS 只把标识符形式（不能以数字开头）当作字体名，
            // 因此除单个词与已加引号的之外都要加引号。
            families = this.get('fontFamily').split(',').map(function (family) {
                family = family.trim();
                return /^(["'].*|[a-z-]+)$/i.test(family) ? family
                        : '"' + family.replace(/["\\]/g, '\\$&') + '"';
            }).join(', '),
            style = this.get('fontStyle');
        return (style !== 'normal' ? style + ' ' : '')
                + this.get('fontWeight') + ' ' + sizeText + ' ' + families;
    }

    /** {@link _getCanvasFont} 的别名。 */
    getFont(): string {
        return this._getCanvasFont();
    }

    /** 字号（像素）。 */
    _getFontSize(): number {
        return parseSize(this.get('fontSize'));
    }

    /**
     * 行高（像素）。
     * `'auto'` 取 1.2 倍字号；数字按字号的倍数；带单位的字符串按像素规则解析。
     */
    _getLineHeight(): number {
        const lineHeight = this.get('lineHeight');
        if (lineHeight === 'auto')
            return 1.2 * this._getFontSize();
        return typeof lineHeight === 'number'
                ? lineHeight * this._getFontSize()
                : parseSize(lineHeight);
    }

    /**
     * 行高，以固定长度表示，对应原文 `Style#getLeading()`（Style.js 第 481 行）。
     */
    getLeading(): number {
        return this._getLineHeight();
    }

    /** 设置行高：null 表示 `'auto'`，数字换算成 px。 */
    setLeading(leading: number | string | null): void {
        this.set('lineHeight', leading == null ? 'auto'
                : typeof leading === 'number' ? leading + 'px' : leading);
    }

    // ---------------------------------------------------------------------
    // 字符属性

    get fontFamily(): string {
        return this.get('fontFamily');
    }

    set fontFamily(value: string) {
        this.set('fontFamily', value);
    }

    get fontWeight(): string | number {
        return this.get('fontWeight');
    }

    set fontWeight(value: string | number) {
        this.set('fontWeight', value);
    }

    get fontStyle(): string {
        return this.get('fontStyle');
    }

    set fontStyle(value: string) {
        this.set('fontStyle', value);
    }

    get fontSize(): number | string {
        return this.get('fontSize');
    }

    set fontSize(value: number | string) {
        this.set('fontSize', value);
    }

    get fontVariations(): string | null {
        return this.get('fontVariations');
    }

    set fontVariations(value: string | null) {
        this.set('fontVariations', value);
    }

    /** 字距，单位千分之一 em。 */
    get letterTracking(): number {
        return this.get('letterTracking');
    }

    set letterTracking(value: number) {
        this.set('letterTracking', value);
    }

    /** 字距转换成 canvas 的 `letterSpacing`（em 单位）。 */
    _getCanvasLetterSpacing(): string {
        return this.get('letterTracking') / 1000 + 'em';
    }

    get letterKerning(): number | null {
        return this.get('letterKerning');
    }

    set letterKerning(value: number | null) {
        this.set('letterKerning', value);
    }

    get baselineShift(): number {
        return this.get('baselineShift');
    }

    set baselineShift(value: number) {
        this.set('baselineShift', value);
    }

    get baselinePosition(): string {
        return this.get('baselinePosition');
    }

    set baselinePosition(value: string) {
        this.set('baselinePosition', value);
    }

    /** 字形横向缩放，数字或 Point。 */
    get letterScaling(): number | Point {
        return this.get('letterScaling');
    }

    set letterScaling(value: number | Point) {
        this.set('letterScaling', value);
    }

    get letterRotation(): number {
        return this.get('letterRotation');
    }

    set letterRotation(value: number) {
        this.set('letterRotation', value);
    }

    get capitals(): string {
        return this.get('capitals');
    }

    set capitals(value: string) {
        this.set('capitals', value);
    }

    get underline(): boolean {
        return this.get('underline');
    }

    set underline(value: boolean) {
        this.set('underline', value);
    }

    get strikethrough(): boolean {
        return this.get('strikethrough');
    }

    set strikethrough(value: boolean) {
        this.set('strikethrough', value);
    }

    get features(): string | null {
        return this.get('features');
    }

    set features(value: string | null) {
        this.set('features', value);
    }

    get lineHeight(): number | string {
        return this.get('lineHeight');
    }

    set lineHeight(value: number | string) {
        this.set('lineHeight', value);
    }

    // ---------------------------------------------------------------------
    // 段落属性

    get justification(): string {
        return this.get('justification');
    }

    set justification(value: string) {
        this.set('justification', value);
    }

    get justifyLast(): boolean | string {
        return this.get('justifyLast');
    }

    set justifyLast(value: boolean | string) {
        this.set('justifyLast', value);
    }

    get justifySpacing(): number {
        return this.get('justifySpacing');
    }

    set justifySpacing(value: number) {
        this.set('justifySpacing', value);
    }

    get startIndent(): number {
        return this.get('startIndent');
    }

    set startIndent(value: number) {
        this.set('startIndent', value);
    }

    get endIndent(): number {
        return this.get('endIndent');
    }

    set endIndent(value: number) {
        this.set('endIndent', value);
    }

    get firstLineIndent(): number {
        return this.get('firstLineIndent');
    }

    set firstLineIndent(value: number) {
        this.set('firstLineIndent', value);
    }

    get spaceBefore(): number {
        return this.get('spaceBefore');
    }

    set spaceBefore(value: number) {
        this.set('spaceBefore', value);
    }

    get spaceAfter(): number {
        return this.get('spaceAfter');
    }

    set spaceAfter(value: number) {
        this.set('spaceAfter', value);
    }

    get hyphenation(): boolean {
        return this.get('hyphenation');
    }

    set hyphenation(value: boolean) {
        this.set('hyphenation', value);
    }

    get composer(): string {
        return this.get('composer');
    }

    set composer(value: string) {
        this.set('composer', value);
    }

    get lineWrap(): string {
        return this.get('lineWrap');
    }

    set lineWrap(value: string) {
        this.set('lineWrap', value);
    }

    get tabs(): any[] | null {
        return this.get('tabs');
    }

    set tabs(value: any[] | null) {
        this.set('tabs', value);
    }

    get direction(): string {
        return this.get('direction');
    }

    set direction(value: string) {
        this.set('direction', value);
    }

    // ---------------------------------------------------------------------
    // 多份样式的合并 / 应用（对应原文 Style.merge / Style.apply）

    /** 这些样式在 key 上共同的值；不一致时返回 undefined。 */
    static merge(styles: TextStyle[], key: TextStyleKey): any {
        let value: any;
        for (let i = 0; i < styles.length; i++) {
            const other = styles[i].get(key);
            if (!i) {
                value = other;
            } else if (!styleValueEquals(value, other)) {
                return undefined;
            }
        }
        return value;
    }

    /** 把 key 设置为 value，应用到所有样式。 */
    static apply(styles: TextStyle[], key: TextStyleKey, value: any): void {
        for (let i = 0; i < styles.length; i++)
            styles[i].set(key, value);
    }
}
