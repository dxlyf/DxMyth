import { TextStyle } from './TextStyle';
import { TextRange } from './TextRange';
/** 一段共享同一套样式的字符。 */
export interface TextRun {
    length: number;
    style: TextStyle;
}
/** key 是否属于段落样式（而不是字符样式）。 */
export declare function isParagraphKey(key: string): boolean;
export declare class TextStory {
    _content: string;
    _runs: TextRun[];
    _paragraphs: TextStyle[];
    /** 该 story 流经的文本项（TextItem），本移植里类型未知。 */
    _items: unknown[];
    /** 用于排版的字符范围缓存，见 `_getLetters()`。 */
    _letters: TextRange[] | null;
    _lettersOf: string | null;
    constructor(items?: unknown[]);
    /** 该 story 流经的文本项，按顺序。 */
    get textItems(): unknown[];
    /** 为 `items` 复制内容与样式。 */
    _clone(items: unknown[]): TextStory;
    /** 把另一个 story 的内容与样式接到末尾；相接的段落保留本 story 的样式。 */
    _append(other: TextStory): void;
    /** 从 `start` 起的内容切出到为 `items` 新建的 story 里。 */
    _extract(start: number, items: unknown[]): TextStory;
    /** 内容变化时通知流经的文本项。 */
    _changed(): void;
    /** 从第一个文本项到最后一个的完整文本。 */
    get content(): string;
    set content(content: string);
    /**
     * 把 `start` 到 `end` 的内容替换为新内容，新内容继承被替换内容的样式，
     * 插入时继承前一个字符的样式。
     */
    replace(content: string, start: number | TextRange, end?: number): void;
    /** `pos` 所在段落的样式、起止位置（不含该段末尾的换行）。 */
    _getParagraph(pos: number): {
        style: TextStyle;
        start: number;
        end: number;
    };
    /** 内容里换行的数量，也就是段落的结束位置。 */
    _countBreaks(content: string): number;
    /** 在 `index` 处切开 run，返回从该位置开始的 run 下标。 */
    _split(index: number): number;
    /**
     * `start` 到 `end` 的区间所代表的样式：
     * 段落样式、它覆盖的 run 样式（设置时会先把 run 切开），或空区间的样式。
     */
    _getRangeStyles(key: string, start: number, end: number, setting?: boolean): TextStyle[];
    /** 从 `start` 到 `end` 的文本范围。 */
    range(start: number, end: number): TextRange;
    /** 文本的 run：每一段内部样式一致。 */
    get runs(): TextRange[];
    set runs(runs: any[]);
    /** 相邻且样式相同的 run 合并。 */
    _getRuns(): {
        start: number;
        end: number;
        style: TextStyle;
    }[];
    setRuns(runs: any[]): void;
    /** 文本的段落（不含换行）。 */
    get paragraphs(): TextRange[];
    set paragraphs(paragraphs: any[]);
    setParagraphs(paragraphs: any[]): void;
    /** 文本里的词：能用 Intl.Segmenter 就用它，否则按空白切分。 */
    get words(): TextRange[];
    /** 文本里的字母，按人眼看到的一个字（字素，含 emoji、带重音的字母）。 */
    get letters(): TextRange[];
    /** 排版用的字母范围，内容不变时复用。 */
    _getLetters(): TextRange[];
    _segment(granularity: string, pattern: RegExp): TextRange[];
}
