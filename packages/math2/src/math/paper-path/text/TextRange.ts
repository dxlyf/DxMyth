/**
 * 移植自 paper/src/text/TextRange.js。
 *
 * story 内容中的一段（从 `start` 到 `end`），样式取自它覆盖的字符与段落：
 * 读取时是它们共同的值（不一致则为 `undefined`），写入时同时改掉它们。
 *
 * 与原文的差异：
 * - `new Style(null, this)` 换成 `new TextStyle(null, this)`；
 * - 原文由 Style 注入的访问器，这里显式写成 `get` / `set`；
 * - 去掉序列化，`toJSON()` 只导出纯数据（不再经过 `Base.serialize`）。
 */

import { TextStyle } from './TextStyle';
import { styleValueEquals } from './TextStyle';
import type { TextStyleKey, TextStyleValueMap } from './TextStyle';
import type { TextStory } from './TextStory';

export class TextRange {
    _story: TextStory;
    _start: number;
    _end: number;
    /** 区间自己的样式，用于 story 没有提供样式的情况。 */
    _style: TextStyle;

    /** 排版时附加的基线（由 TextItem#getLines() 设置）。 */
    baseline?: any;
    /** 排版时附加的包围盒（由 TextItem#getLines() 设置）。 */
    bounds?: any;

    constructor(story: TextStory, start: number, end: number) {
        const length = story._content.length;
        this._story = story;
        this._start = Math.max(0, Math.min(start, length));
        this._end = Math.max(this._start, Math.min(end, length));
        this._style = new TextStyle(null, this);
    }

    // ---------------------------------------------------------------------

    /** 区间所属的 story。 */
    get story(): TextStory {
        return this._story;
    }

    /** 区间第一个字符的下标。 */
    get start(): number {
        return this._start;
    }

    /** 区间最后一个字符之后的下标。 */
    get end(): number {
        return this._end;
    }

    /** 区间的内容。 */
    get content(): string {
        return this._story._content.slice(this._start, this._end);
    }

    /** 区间自己的样式对象。 */
    get style(): TextStyle {
        return this._style;
    }

    set style(style: TextStyle | object) {
        this._style.setValues(style as object);
    }

    // ---------------------------------------------------------------------
    // 样式读写

    /** 区间覆盖的 story 样式（段落样式或 run 样式）。 */
    _getStyles(key: string, setting?: boolean): TextStyle[] {
        return this._story._getRangeStyles(key, this._start, this._end,
                setting);
    }

    /** 读取区间共享的样式值；不一致时为 undefined。 */
    _getValue<K extends TextStyleKey>(key: K): TextStyleValueMap[K] | undefined {
        const styles = this._getStyles(key, false);
        return styles.length
                ? TextStyle.merge(styles, key)
                : this._style.get(key);
    }

    /** 写入样式值：story 里的样式优先，否则写进区间自己的样式。 */
    _setValue<K extends TextStyleKey>(key: K, value: TextStyleValueMap[K]):
            void {
        const styles = this._getStyles(key, true);
        if (styles.length) {
            TextStyle.apply(styles, key, value);
        } else {
            this._style.set(key, value);
        }
    }

    _changed(): void {
        this._story._changed();
    }

    // ---------------------------------------------------------------------
    // 子范围

    /** story 的 runs 中与本区间相交的部分，裁剪到区间内。 */
    getRuns(): TextRange[] {
        return this._clip(this._story.runs);
    }

    getParagraphs(): TextRange[] {
        return this._clip(this._story.paragraphs);
    }

    getWords(): TextRange[] {
        return this._clip(this._story.words);
    }

    getLetters(): TextRange[] {
        return this._clip(this._story.letters);
    }

    _clip(ranges: TextRange[]): TextRange[] {
        const story = this._story,
            start = this._start,
            end = this._end;
        return ranges.filter(function (range) {
            return range._start < end && range._end > start
                    || range._start === range._end
                        && range._start >= start && range._start <= end;
        }).map(function (range) {
            return new TextRange(story, Math.max(range._start, start),
                    Math.min(range._end, end));
        });
    }

    // ---------------------------------------------------------------------

    /** 导出内容与偏离默认值的样式属性（纯数据）。 */
    toJSON(): any {
        const style = this._style,
            defaults = style._defaults,
            json: any = {
                start: this._start,
                end: this._end,
                content: this.content
            },
            keys = style.keys();
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i],
                value = style.get(key);
            if (value !== undefined && !styleValueEquals(value, defaults[key]))
                json[key] = value;
        }
        return json;
    }

    toString(): string {
        return this.content;
    }

    // ---------------------------------------------------------------------
    // 字符属性

    get fontFamily(): string | undefined {
        return this._getValue('fontFamily');
    }

    set fontFamily(value: string) {
        this._setValue('fontFamily', value);
    }

    get fontWeight(): string | number | undefined {
        return this._getValue('fontWeight');
    }

    set fontWeight(value: string | number) {
        this._setValue('fontWeight', value);
    }

    get fontStyle(): string | undefined {
        return this._getValue('fontStyle');
    }

    set fontStyle(value: string) {
        this._setValue('fontStyle', value);
    }

    get fontSize(): number | string | undefined {
        return this._getValue('fontSize');
    }

    set fontSize(value: number | string) {
        this._setValue('fontSize', value);
    }

    get fontVariations(): string | null | undefined {
        return this._getValue('fontVariations');
    }

    set fontVariations(value: string | null) {
        this._setValue('fontVariations', value);
    }

    get letterTracking(): number | undefined {
        return this._getValue('letterTracking');
    }

    set letterTracking(value: number) {
        this._setValue('letterTracking', value);
    }

    get letterKerning(): number | null | undefined {
        return this._getValue('letterKerning');
    }

    set letterKerning(value: number | null) {
        this._setValue('letterKerning', value);
    }

    get baselineShift(): number | undefined {
        return this._getValue('baselineShift');
    }

    set baselineShift(value: number) {
        this._setValue('baselineShift', value);
    }

    get baselinePosition(): string | undefined {
        return this._getValue('baselinePosition');
    }

    set baselinePosition(value: string) {
        this._setValue('baselinePosition', value);
    }

    get letterScaling(): number | import('../basic/Point').Point | undefined {
        return this._getValue('letterScaling');
    }

    set letterScaling(value: number | import('../basic/Point').Point) {
        this._setValue('letterScaling', value);
    }

    get letterRotation(): number | undefined {
        return this._getValue('letterRotation');
    }

    set letterRotation(value: number) {
        this._setValue('letterRotation', value);
    }

    get capitals(): string | undefined {
        return this._getValue('capitals');
    }

    set capitals(value: string) {
        this._setValue('capitals', value);
    }

    get underline(): boolean | undefined {
        return this._getValue('underline');
    }

    set underline(value: boolean) {
        this._setValue('underline', value);
    }

    get strikethrough(): boolean | undefined {
        return this._getValue('strikethrough');
    }

    set strikethrough(value: boolean) {
        this._setValue('strikethrough', value);
    }

    get features(): string | null | undefined {
        return this._getValue('features');
    }

    set features(value: string | null) {
        this._setValue('features', value);
    }

    get lineHeight(): number | string | undefined {
        return this._getValue('lineHeight');
    }

    set lineHeight(value: number | string) {
        this._setValue('lineHeight', value);
    }

    // ---------------------------------------------------------------------
    // 段落属性

    get justification(): string | undefined {
        return this._getValue('justification');
    }

    set justification(value: string) {
        this._setValue('justification', value);
    }

    get justifyLast(): string | boolean | undefined {
        return this._getValue('justifyLast');
    }

    set justifyLast(value: string | boolean) {
        this._setValue('justifyLast', value);
    }

    get justifySpacing(): number | null | undefined {
        return this._getValue('justifySpacing');
    }

    set justifySpacing(value: number | null) {
        this._setValue('justifySpacing', value);
    }

    get startIndent(): number | undefined {
        return this._getValue('startIndent');
    }

    set startIndent(value: number) {
        this._setValue('startIndent', value);
    }

    get endIndent(): number | undefined {
        return this._getValue('endIndent');
    }

    set endIndent(value: number) {
        this._setValue('endIndent', value);
    }

    get firstLineIndent(): number | undefined {
        return this._getValue('firstLineIndent');
    }

    set firstLineIndent(value: number) {
        this._setValue('firstLineIndent', value);
    }

    get spaceBefore(): number | undefined {
        return this._getValue('spaceBefore');
    }

    set spaceBefore(value: number) {
        this._setValue('spaceBefore', value);
    }

    get spaceAfter(): number | undefined {
        return this._getValue('spaceAfter');
    }

    set spaceAfter(value: number) {
        this._setValue('spaceAfter', value);
    }

    get hyphenation(): boolean | undefined {
        return this._getValue('hyphenation');
    }

    set hyphenation(value: boolean) {
        this._setValue('hyphenation', value);
    }

    get composer(): string | undefined {
        return this._getValue('composer');
    }

    set composer(value: string) {
        this._setValue('composer', value);
    }

    get lineWrap(): string | undefined {
        return this._getValue('lineWrap');
    }

    set lineWrap(value: string) {
        this._setValue('lineWrap', value);
    }

    get tabs(): any[] | null | undefined {
        return this._getValue('tabs');
    }

    set tabs(value: any[] | null) {
        this._setValue('tabs', value);
    }

    get direction(): string | null | undefined {
        return this._getValue('direction');
    }

    set direction(value: string | null) {
        this._setValue('direction', value);
    }
}
