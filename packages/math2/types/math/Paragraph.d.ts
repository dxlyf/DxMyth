/** 文本排版样式 */
export interface ParagraphStyle {
    /** 字体族，默认 'sans-serif' */
    fontFamily?: string;
    /** 字号（px），默认 16 */
    fontSize?: number;
    /** 字体样式：normal / italic / oblique */
    fontStyle?: 'normal' | 'italic' | 'oblique';
    /** 字重  */
    fontWeight?: string | number;
    /** 行高（字号倍数），默认 1.2 */
    lineHeight?: number;
    /** 水平对齐 */
    textAlign?: "center" | "end" | "left" | "right" | "start";
    /** 垂直基线 */
    textBaseline?: "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
    /** 最大宽度，超出则换行，0 表示不限制 */
    maxWidth?: number;
    /** 字间距（px），默认 0 */
    letterSpacing?: number;
}
/** 单行度量信息 */
export interface LineMetrics {
    /** 该行文本 */
    text: string;
    /** 行原点 x */
    x: number;
    /** 行基线 y */
    y: number;
    /** 行宽度 */
    width: number;
    /** 行高度（行高） */
    height: number;
}
/** 边界矩形 */
export interface RectBounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}
/**
 * 文本宽度测量后端。
 * 将给定样式的文本映射为像素宽度。
 */
export interface ITextMeasure {
    /**
     * 测量文本尺寸。
     * @param text 待测量的文本（单行）
     * @param fontString CSS font 属性字符串（如 "16px sans-serif"）
     * @param letterSpacing 字间距（px）
     * @returns 文本包围盒（单行 top 始终为 0，height 为近似行高）
     */
    measureText(text: string, fontString: string, letterSpacing: number): RectBounds;
}
/**
 * Canvas 2D 测量后端（默认）。
 * 使用离屏 Canvas 的 measureText() API，精度高且不干扰 DOM。
 */
export declare class CanvasTextMeasure implements ITextMeasure {
    static alignRect: typeof alignRect;
    private _ctx;
    private _failed;
    alignRect(bounds: RectBounds, textAlign?: ParagraphStyle['textAlign'] & string, textBaseline?: ParagraphStyle['textBaseline'] & string, targetX?: number, targetY?: number, 
    /** 字号（px），用于精确计算 baseline 锚点位置。不传则用 bounds.height 估算 */
    fontSize?: number, 
    /** 行高倍数，默认 1.2 */
    lineHeightMul?: number): RectBounds;
    measureText(text: string, fontString: string, letterSpacing: number): RectBounds;
    /**
     * 多行块级测量。
     * 按 \n 拆分文本，逐行用 Canvas measureText 测量，返回完整包围盒。
     *
     * @param text 文本（可含 \n）
     * @param fontString CSS font 字符串
     * @param fontSize 字号（px），用于计算行高
     * @param lineHeight 行高倍数，默认 1.2
     * @param letterSpacing 字间距
     */
    measureBlock(text: string, fontString: string, fontSize: number, lineHeight?: number, letterSpacing?: number): RectBounds;
    private _getCtx;
}
/**
 * DOM 测量后端。
 * 使用隐藏的 span 元素渲染文本，通过 getBoundingClientRect/offsetWidth 获取精确宽度。
 *
 * 优点：
 * - 与浏览器实际渲染完全一致，不受 Canvas 字体度量差异影响
 * - CSS letter-spacing 原生支持，无需手动补偿
 * - 适合需要精确匹配 CSS 布局的场景
 *
 * 使用方式：
 * ```ts
 * const p = new Paragraph('hello', 0, 0, {}, new DOMTextMeasure())
 * ```
 */
/** 多行块级文本测量选项 */
export interface CSSMeasureOptions {
    /** 字体族 */
    fontFamily?: string;
    /** 字号（px） */
    fontSize?: number;
    /** 字体样式 */
    fontStyle?: 'normal' | 'italic' | 'oblique';
    /** 字重 */
    fontWeight?: string | number;
    /** 小型大写字母 */
    fontVariant?: 'normal' | 'small-caps';
    /** 字体拉伸 */
    fontStretch?: 'normal' | 'condensed' | 'expanded' | 'extra-condensed' | 'semi-condensed' | 'semi-expanded' | 'extra-expanded' | 'ultra-condensed' | 'ultra-expanded';
    /** 行高（字号倍数或 CSS 值，如 1.5 或 "24px"） */
    lineHeight?: number | string;
    /** 水平对齐 */
    textAlign?: 'left' | 'center' | 'right' | 'start' | 'end' | 'justify';
    /** 最大宽度（px），超出换行；不设则不限制 */
    maxWidth?: number;
    /** 字间距（px） */
    letterSpacing?: number;
    /** 词间距（px） */
    wordSpacing?: number;
    /** 换行策略 */
    whiteSpace?: 'normal' | 'nowrap' | 'pre-line' | 'pre-wrap' | 'pre';
    /** 单词内换行规则 */
    wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
    /** 长单词/URL 溢出换行 */
    overflowWrap?: 'normal' | 'break-word' | 'anywhere';
    /** 首行缩进（px） */
    textIndent?: number;
    /** 文本转换 */
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    /** 文本装饰（下划线、删除线等） */
    textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
    /** 书写方向 */
    direction?: 'ltr' | 'rtl';
    /** padding 补偿（四向统一，px），默认 0 */
    padding?: number;
}
export declare class DOMTextMeasure implements ITextMeasure {
    private _span;
    private _div;
    /** 挂载父节点，默认 document.body。可指定到特定容器内 */
    mountTo: HTMLElement | null;
    /** 单行测量 */
    measureText(text: string, fontString: string, letterSpacing: number): RectBounds;
    /**
     * 多行块级测量。
     * 使用隐藏 div 按真实 CSS 排版渲染文本（支持换行、对齐、line-height 等），
     * 返回完整的包围盒尺寸。
     *
     * @example
     * ```ts
     * const m = new DOMTextMeasure()
     * const size = m.measureBlock('长文本内容...', {
     *   fontSize: 16,
     *   lineHeight: 1.5,
     *   maxWidth: 300,
     *   textAlign: 'center',
     * })
     * // size = { width: 280, height: 72 }
     * ```
     */
    measureBlock(text: string, options?: CSSMeasureOptions): RectBounds;
    private _getSpan;
    private _getDiv;
    /** 销毁节点，释放 DOM 资源 */
    dispose(): void;
}
/** 获取默认测量后端 */
export declare function getDefaultTextMeasure(): ITextMeasure;
/** 设置全局默认测量后端 */
export declare function setDefaultTextMeasure(m: ITextMeasure): void;
/**
 * 便捷函数：按 CSS 排版测量多行文本的实际渲染尺寸。
 *
 * 与 DOMTextMeasure.measureBlock 相同，但不需手动创建实例。
 *
 * @example
 * ```ts
 * const size = measureTextBlock('Hello\nWorld', { fontSize: 16, maxWidth: 200 })
 * console.log(size) // { width: 200, height: 57.6 }
 * ```
 */
export declare function measureTextBlock(text: string, options?: CSSMeasureOptions): RectBounds;
/**
 * 根据 textAlign 和 textBaseline 调整 RectBounds 的位置。
 *
 * 将原始包围盒（通常以左上角为原点）的锚点映射到指定坐标 (targetX, targetY)，
 * 使得使用对应对齐方式在 Canvas 上绘制时，文字恰好位于目标位置。
 *
 * @example
 * ```ts
 * const bounds = { left: 0, top: -11, right: 50, bottom: 3, width: 50, height: 14 }
 * const aligned = alignRect(bounds, 'center', 'alphabetic', 200, 300)
 * // aligned.left = 175, aligned.top = 289, aligned.right = 225, aligned.bottom = 303
 * ```
 */
declare function alignRect(bounds: RectBounds, textAlign?: ParagraphStyle['textAlign'] & string, textBaseline?: ParagraphStyle['textBaseline'] & string, targetX?: number, targetY?: number, 
/** 字号（px），用于精确计算 baseline 锚点位置。不传则用 bounds.height 估算 */
fontSize?: number, 
/** 行高倍数，默认 1.2 */
lineHeightMul?: number): RectBounds;
/**
 * 文本排版与几何检测类。
 *
 * 管理文本的自动换行、对齐布局，提供包围盒计算和点命中检测。
 * 默认使用 Canvas 测量后端，可通过注入 ITextMeasure 切换为 DOM 测量。
 *
 * @example
 * ```ts
 * // Canvas 测量（默认）
 * const p1 = new Paragraph('Hello\nWorld', 0, 0, { fontSize: 24 })
 *
 * // DOM 测量
 * const domMeasure = new DOMTextMeasure()
 * const p2 = new Paragraph('Hello', 100, 200, {}, domMeasure)
 *
 * // 全局切换
 * setDefaultTextMeasure(new DOMTextMeasure())
 * ```
 */
export declare class Paragraph {
    /** 原始文本 */
    text: string;
    /** 段落原点 x */
    x: number;
    /** 段落原点 y */
    y: number;
    /** 排版样式 */
    style: Required<ParagraphStyle>;
    /** 当前使用的测量后端 */
    measure: ITextMeasure;
    /** 排版后的行数据（调用 layout() 后填充） */
    lines: LineMetrics[];
    /** 缓存的包围盒 */
    private _bounds;
    /** 缓存的 CSS font 字符串 */
    private _fontString;
    private _resolved;
    constructor(text?: string, x?: number, y?: number, style?: ParagraphStyle, measure?: ITextMeasure);
    /**
     * 执行文本排版布局。
     * 解析换行符、根据 maxWidth 自动换行、计算每行位置和宽度。
     * 修改 text / style 后需重新调用。
     */
    layout(): this;
    /**
     * 获取文本包围盒。
     * 如果未调用 layout()，将自动调用。
     */
    getBounds(): RectBounds;
    /**
     * 判断点 (px, py) 是否位于文本包围盒内。
     */
    isPointInBounds(px: number, py: number): boolean;
    /**
     * 遍历所有排版后的行。
     */
    forEachLine(fn: (line: LineMetrics, index: number) => void): void;
    /** 获取行数 */
    get lineCount(): number;
    /**
     * 更新文本内容。不清空样式，但会清除布局缓存。
     */
    setText(text: string): this;
    /**
     * 更新样式。合并到现有样式，清除布局缓存。
     */
    setStyle(style: Partial<ParagraphStyle>): this;
    /**
     * 替换测量后端。清除布局缓存。
     */
    setMeasure(m: ITextMeasure): this;
    /**
     * 将段落绘制到 Canvas 上下文。
     * 使用 fillText，自动应用对齐和 font。
     */
    draw(ctx: CanvasRenderingContext2D, fillStyle?: string): void;
    /** 委托给测量后端，返回文本宽度 */
    private _measure;
    /**
     * 根据 Canvas textBaseline 计算从行顶部到 fillText 绘制 y 的偏移。
     * line.y 始终代表行顶部坐标（用于包围盒计算），draw() 时通过此偏移调整。
     */
    private _baselineOffset;
    /** 自动换行处理 */
    private _wrapParagraph;
    /** 提交一行到 lines */
    private _pushLine;
    /** 根据 textAlign 计算水平偏移 */
    private _alignX;
}
export {};
