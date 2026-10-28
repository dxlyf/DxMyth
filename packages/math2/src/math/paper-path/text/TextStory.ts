/**
 * 移植自 paper/src/text/TextStory.js。
 *
 * 一个或多个互相链接的文本项共享的文本：内容按“共享同一套样式的字符区间”
 * （run）保存，段落样式单独保存。
 *
 * 与原文的差异：
 * - `new Style(...)` 换成 `new TextStyle(...)`；
 * - 去掉序列化、文档、`Change` 标志，`_changed()` 不带参数；
 * - 没有 Item 层的样式（颜色、阴影等），因此 `_itemKeys` 为空。
 */

import { TextStyle } from './TextStyle';
import type { TextStyleKey } from './TextStyle';
import { TextRange } from './TextRange';

/** 一段共享同一套样式的字符。 */
export interface TextRun {
    length: number;
    style: TextStyle;
}

/** 属于段落的样式属性，其余都是字符属性。 */
const PARAGRAPH_KEYS: { [key: string]: true } = {
    justification: true,
    justifyLast: true,
    justifySpacing: true,
    startIndent: true,
    endIndent: true,
    firstLineIndent: true,
    spaceBefore: true,
    spaceAfter: true,
    hyphenation: true,
    composer: true,
    lineWrap: true,
    tabs: true,
    direction: true
};

/** 属于文本项（Item）的样式属性。本移植没有 Item 样式，因此为空。 */
const ITEM_KEYS: { [key: string]: true } = {};

/** key 是否属于段落样式（而不是字符样式）。 */
export function isParagraphKey(key: string): boolean {
    return key in PARAGRAPH_KEYS;
}

export class TextStory {
    _content: string;
    _runs: TextRun[];
    _paragraphs: TextStyle[];
    /** 该 story 流经的文本项（TextItem），本移植里类型未知。 */
    _items: unknown[];
    /** 用于排版的字符范围缓存，见 `_getLetters()`。 */
    _letters: TextRange[] | null = null;
    _lettersOf: string | null = null;

    constructor(items?: unknown[]) {
        this._content = '';
        this._runs = [{ length: 0, style: new TextStyle(null, this) }];
        this._paragraphs = [new TextStyle(null, this)];
        this._items = items || [];
    }

    // ---------------------------------------------------------------------
    // 文本项

    /** 该 story 流经的文本项，按顺序。 */
    get textItems(): unknown[] {
        return this._items.slice();
    }

    // ---------------------------------------------------------------------
    // 复制 / 追加 / 切出

    /** 为 `items` 复制内容与样式。 */
    _clone(items: unknown[]): TextStory {
        const story = new TextStory(items);
        story._content = this._content;
        story._runs = this._runs.map(function (run) {
            return { length: run.length, style: new TextStyle(run.style, story) };
        });
        story._paragraphs = this._paragraphs.map(function (style) {
            return new TextStyle(style, story);
        });
        return story;
    }

    /** 把另一个 story 的内容与样式接到末尾；相接的段落保留本 story 的样式。 */
    _append(other: TextStory): void {
        const that = this,
            runs = other._runs.map(function (run) {
                return {
                    length: run.length,
                    style: new TextStyle(run.style, that)
                };
            });
        this._content += other._content;
        this._runs = this._runs.concat(runs).filter(function (run) {
            return run.length > 0;
        });
        if (!this._runs.length)
            this._runs = [runs[0]];
        this._paragraphs = this._paragraphs.concat(
                other._paragraphs.slice(1).map(function (style) {
                    return new TextStyle(style, that);
                }));
    }

    /** 从 `start` 起的内容切出到为 `items` 新建的 story 里。 */
    _extract(start: number, items: unknown[]): TextStory {
        const rest = this._clone(items),
            content = this._content,
            paragraph = this._paragraphs[
                    this._countBreaks(content.slice(0, start))];
        rest.replace('', 0, start);
        rest._paragraphs[0] = new TextStyle(paragraph, rest);
        this.replace('', start, content.length);
        return rest;
    }

    /** 内容变化时通知流经的文本项。 */
    _changed(): void {
        const items = this._items;
        for (let i = 0, l = items.length; i < l; i++) {
            const item = items[i] as { _changed?: () => void };
            if (item && typeof item._changed === 'function')
                item._changed();
        }
    }

    // ---------------------------------------------------------------------
    // 内容

    /** 从第一个文本项到最后一个的完整文本。 */
    get content(): string {
        return this._content;
    }

    set content(content: string) {
        this.replace(content, 0, this._content.length);
    }

    /**
     * 把 `start` 到 `end` 的内容替换为新内容，新内容继承被替换内容的样式，
     * 插入时继承前一个字符的样式。
     */
    replace(content: string, start: number | TextRange, end?: number): void {
        let from: number, to: number;
        if (typeof start === 'number') {
            from = start;
            to = end as number;
        } else {
            from = start.start;
            to = start.end;
        }

        const old = this._content,
            length = old.length,
            runs = this._runs,
            paragraphs = this._paragraphs;
        content = '' + content;
        from = Math.max(0, Math.min(from, length));
        to = Math.max(from, Math.min(to, length));

        // 1. run：新内容成为夹在被切开的 run 之间的一段。
        const i = this._split(from),
            j = this._split(to),
            source = (i < j ? runs[i] : runs[i - 1] || runs[i]).style;
        runs.splice(i, j - i, {
            length: content.length,
            style: new TextStyle(source, this)
        });
        this._runs = runs.filter(function (run) {
            return run.length > 0;
        });
        if (!this._runs.length)
            this._runs = [runs[i]];

        // 2. 段落：被替换掉的换行合并进第一段，新加的换行从它拆出来。
        const first = this._countBreaks(old.slice(0, from)),
            removed = this._countBreaks(old.slice(from, to)),
            added = this._countBreaks(content),
            style = paragraphs[first],
            inserted: TextStyle[] = [];
        for (let k = 0; k < added; k++)
            inserted.push(new TextStyle(style, this));
        paragraphs.splice(first + 1, removed, ...inserted);

        this._content = old.slice(0, from) + content + old.slice(to);
        this._changed();
    }

    /** `pos` 所在段落的样式、起止位置（不含该段末尾的换行）。 */
    _getParagraph(pos: number): { style: TextStyle; start: number; end: number } {
        const content = this._content,
            before = content.slice(0, pos),
            start = /(\r\n|\n|\r)[^\r\n]*$/.exec(before),
            end = /\r\n|\n|\r/.exec(content.slice(pos));
        return {
            style: this._paragraphs[this._countBreaks(before)],
            start: start ? start.index + start[1].length : 0,
            end: end ? pos + end.index : content.length
        };
    }

    /** 内容里换行的数量，也就是段落的结束位置。 */
    _countBreaks(content: string): number {
        const matches = content.match(/\r\n|\n|\r/g);
        return matches ? matches.length : 0;
    }

    /** 在 `index` 处切开 run，返回从该位置开始的 run 下标。 */
    _split(index: number): number {
        const runs = this._runs;
        let start = 0;
        for (let i = 0, l = runs.length; i < l; i++) {
            const run = runs[i];
            if (start === index)
                return i;
            if (index < start + run.length) {
                runs.splice(i + 1, 0, {
                    length: start + run.length - index,
                    style: new TextStyle(run.style, this)
                });
                run.length = index - start;
                return i + 1;
            }
            start += run.length;
        }
        return runs.length;
    }

    // ---------------------------------------------------------------------
    // 范围样式

    /**
     * `start` 到 `end` 的区间所代表的样式：
     * 段落样式、它覆盖的 run 样式（设置时会先把 run 切开），或空区间的样式。
     */
    _getRangeStyles(key: string, start: number, end: number,
            setting?: boolean): TextStyle[] {
        const runs = this._runs;
        if (key in ITEM_KEYS) {
            return [];
        } else if (key in PARAGRAPH_KEYS) {
            const content = this._content,
                first = this._countBreaks(content.slice(0, start)),
                last = this._countBreaks(
                        content.slice(0, Math.max(start, end - 1)));
            return this._paragraphs.slice(first, last + 1);
        } else if (setting) {
            const i = this._split(start);
            return runs.slice(i, this._split(end)).map(function (run) {
                return run.style;
            });
        } else {
            // 空区间取前一个字符的样式，就像在那里输入内容一样。
            const from = start < end ? start : Math.max(0, start - 1),
                to = start < end ? end : from + 1,
                styles: TextStyle[] = [];
            let pos = 0;
            for (let i = 0, l = runs.length; i < l; i++) {
                const run = runs[i],
                    next = pos + run.length;
                if (from < next && to > pos)
                    styles.push(run.style);
                pos = next;
            }
            // 空文本用它那一个空 run 的样式。
            return styles.length ? styles : [runs[0].style];
        }
    }

    /** 从 `start` 到 `end` 的文本范围。 */
    range(start: number, end: number): TextRange {
        return new TextRange(this, start, end);
    }

    // ---------------------------------------------------------------------
    // runs

    /** 文本的 run：每一段内部样式一致。 */
    get runs(): TextRange[] {
        const that = this;
        return this._getRuns().map(function (run) {
            return new TextRange(that, run.start, run.end);
        });
    }

    set runs(runs: any[]) {
        this.setRuns(runs);
    }

    /** 相邻且样式相同的 run 合并。 */
    _getRuns(): { start: number; end: number; style: TextStyle }[] {
        const runs = this._runs,
            joined: { start: number; end: number; style: TextStyle }[] = [];
        let start = 0,
            end = 0;
        for (let i = 0, l = runs.length; i < l; i++) {
            const run = runs[i],
                next = runs[i + 1];
            end += run.length;
            if (!next || !run.style.equals(next.style)) {
                joined.push({ start: start, end: end, style: run.style });
                start = end;
            }
        }
        return joined;
    }

    setRuns(runs: any[]): void {
        const that = this;
        const plain = runs.map(function (run) {
            return run instanceof TextRange ? run.toJSON() : run;
        });
        const content = plain.map(function (run) {
            return run.content || '';
        }).join('');
        this.content = content;
        const baseStyle = this._runs[0].style;
        this._runs = plain.map(function (run) {
            // setValues() 只取样式属性，忽略 content。
            const style = new TextStyle(baseStyle, that);
            style.setValues(run);
            return { length: (run.content || '').length, style: style };
        }).filter(function (run) {
            return run.length > 0;
        });
        if (!this._runs.length)
            this._runs = [{ length: 0, style: new TextStyle(null, this) }];
        this._changed();
    }

    // ---------------------------------------------------------------------
    // 段落

    /** 文本的段落（不含换行）。 */
    get paragraphs(): TextRange[] {
        const ranges: TextRange[] = [],
            breaks = /\r\n|\n|\r/g,
            content = this._content;
        let start = 0,
            match: RegExpExecArray | null;
        while ((match = breaks.exec(content))) {
            ranges.push(new TextRange(this, start, match.index));
            start = match.index + match[0].length;
        }
        ranges.push(new TextRange(this, start, content.length));
        return ranges;
    }

    set paragraphs(paragraphs: any[]) {
        this.setParagraphs(paragraphs);
    }

    setParagraphs(paragraphs: any[]): void {
        const styles = this._paragraphs,
            keys = PARAGRAPH_KEYS;
        for (let i = 0, l = Math.min(paragraphs.length, styles.length); i < l;
                i++) {
            const paragraph = paragraphs[i],
                style = styles[i];
            for (const key in keys) {
                const value = paragraph[key];
                if (value !== undefined)
                    style.set(key as TextStyleKey, value);
            }
        }
    }

    // ---------------------------------------------------------------------
    // 词 / 字母

    /** 文本里的词：能用 Intl.Segmenter 就用它，否则按空白切分。 */
    get words(): TextRange[] {
        return this._segment('word', /\S+/g);
    }

    /** 文本里的字母，按人眼看到的一个字（字素，含 emoji、带重音的字母）。 */
    get letters(): TextRange[] {
        return this._segment('grapheme', /[\s\S]/g);
    }

    /** 排版用的字母范围，内容不变时复用。 */
    _getLetters(): TextRange[] {
        if (this._lettersOf !== this._content) {
            this._letters = this.letters;
            this._lettersOf = this._content;
        }
        return this._letters as TextRange[];
    }

    _segment(granularity: string, pattern: RegExp): TextRange[] {
        const content = this._content,
            ranges: TextRange[] = [],
            Segmenter = typeof Intl !== 'undefined' ? (Intl as any).Segmenter
                : undefined;
        if (Segmenter) {
            const segments = new Segmenter(undefined, {
                    granularity: granularity
                }).segment(content),
                iterator = segments[Symbol.iterator]();
            let step;
            while (!(step = iterator.next()).done) {
                const segment = step.value;
                if (granularity !== 'word' || segment.isWordLike) {
                    ranges.push(new TextRange(this, segment.index,
                            segment.index + segment.segment.length));
                }
            }
        } else {
            let match: RegExpExecArray | null;
            while ((match = pattern.exec(content))) {
                ranges.push(new TextRange(this, match.index,
                        match.index + match[0].length));
            }
        }
        return ranges;
    }
}
