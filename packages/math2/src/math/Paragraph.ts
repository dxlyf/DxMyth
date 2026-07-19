// ---- Types ----

/** 文本排版样式 */
export interface ParagraphStyle {
    /** 字体族，默认 'sans-serif' */
    fontFamily?: string
    /** 字号（px），默认 16 */
    fontSize?: number
    /** 字体样式：normal / italic / oblique */
    fontStyle?: 'normal' | 'italic' | 'oblique'
    /** 字重  */
    fontWeight?: string | number
    /** 行高（字号倍数），默认 1.2 */
    lineHeight?: number
    /** 水平对齐 */
    textAlign?: "center" | "end" | "left" | "right" | "start";
    /** 垂直基线 */
    textBaseline?: "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
    /** 最大宽度，超出则换行，0 表示不限制 */
    maxWidth?: number
    /** 字间距（px），默认 0 */
    letterSpacing?: number
}

/** 单行度量信息 */
export interface LineMetrics {
    /** 该行文本 */
    text: string
    /** 行原点 x */
    x: number
    /** 行基线 y */
    y: number
    /** 行宽度 */
    width: number
    /** 行高度（行高） */
    height: number
}

/** 边界矩形 */
export interface RectBounds {
    left: number
    top: number
    right: number
    bottom: number
    width: number
    height: number
}

// ---- 文本测量接口 ----

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
    measureText(text: string, fontString: string, letterSpacing: number): RectBounds
}

// ---- 测量后端实现 ----

/**
 * Canvas 2D 测量后端（默认）。
 * 使用离屏 Canvas 的 measureText() API，精度高且不干扰 DOM。
 */
export class CanvasTextMeasure implements ITextMeasure {
    static alignRect = alignRect
    private _ctx: CanvasRenderingContext2D | null = null
    private _failed = false
    alignRect(
        bounds: RectBounds,
        textAlign: ParagraphStyle['textAlign'] & string = 'left',
        textBaseline: ParagraphStyle['textBaseline'] & string = 'top',
        targetX: number = 0,
        targetY: number = 0,
        /** 字号（px），用于精确计算 baseline 锚点位置。不传则用 bounds.height 估算 */
        fontSize?: number,
        /** 行高倍数，默认 1.2 */
        lineHeightMul?: number,
    ): RectBounds {
        return alignRect(bounds, textAlign, textBaseline, targetX, targetY, fontSize, lineHeightMul)
    }
    measureText(text: string, fontString: string, letterSpacing: number): RectBounds {
        const ctx = this._getCtx()
        if (!ctx) {
            const w = estimateTextWidth(text, fontString, letterSpacing)
            return { left: 0, top: 0, right: w, bottom: 0, width: w, height: 0 }
        }

        ctx.font = fontString
        const metrics = ctx.measureText(text)
        let width = metrics.width
        if (letterSpacing !== 0 && text.length > 0) {
            width += letterSpacing * (text.length - 1)
        }
        // 使用字体包围盒度量得出高度（baseline 上方 ascent + 下方 descent）
        const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent
        const descent = metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent
        const height = ascent + descent
        return { left: 0, top: -ascent, right: width, bottom: descent, width, height }
    }

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
    measureBlock(
        text: string,
        fontString: string,
        fontSize: number,
        lineHeight: number = 1.2,
        letterSpacing: number = 0,
    ): RectBounds {
        const lines = text.split('\n')
        const lineHeightPx = fontSize * lineHeight
        let maxWidth = 0

        for (const line of lines) {
            const w = this.measureText(line, fontString, letterSpacing).width
            if (w > maxWidth) maxWidth = w
        }

        const height = lines.length * lineHeightPx
        return {
            left: 0,
            top: 0,
            right: maxWidth,
            bottom: height,
            width: maxWidth,
            height,
        }
    }

    private _getCtx(): CanvasRenderingContext2D | null {
        if (this._ctx) return this._ctx
        if (this._failed) return null
        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (ctx) {
                this._ctx = ctx
                return ctx
            }
        } catch { /* 非浏览器环境 */ }
        this._failed = true
        return null
    }
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
    // ---- 字体 ----
    /** 字体族 */
    fontFamily?: string
    /** 字号（px） */
    fontSize?: number
    /** 字体样式 */
    fontStyle?: 'normal' | 'italic' | 'oblique'
    /** 字重 */
    fontWeight?: string | number
    /** 小型大写字母 */
    fontVariant?: 'normal' | 'small-caps'
    /** 字体拉伸 */
    fontStretch?: 'normal' | 'condensed' | 'expanded' | 'extra-condensed' | 'semi-condensed' | 'semi-expanded' | 'extra-expanded' | 'ultra-condensed' | 'ultra-expanded'

    // ---- 文本排版 ----
    /** 行高（字号倍数或 CSS 值，如 1.5 或 "24px"） */
    lineHeight?: number | string
    /** 水平对齐 */
    textAlign?: 'left' | 'center' | 'right' | 'start' | 'end' | 'justify'
    /** 最大宽度（px），超出换行；不设则不限制 */
    maxWidth?: number
    /** 字间距（px） */
    letterSpacing?: number
    /** 词间距（px） */
    wordSpacing?: number
    /** 换行策略 */
    whiteSpace?: 'normal' | 'nowrap' | 'pre-line' | 'pre-wrap' | 'pre'
    /** 单词内换行规则 */
    wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word'
    /** 长单词/URL 溢出换行 */
    overflowWrap?: 'normal' | 'break-word' | 'anywhere'
    /** 首行缩进（px） */
    textIndent?: number
    /** 文本转换 */
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    /** 文本装饰（下划线、删除线等） */
    textDecoration?: 'none' | 'underline' | 'line-through' | 'overline'
    /** 书写方向 */
    direction?: 'ltr' | 'rtl'

    // ---- 盒模型 ----
    /** padding 补偿（四向统一，px），默认 0 */
    padding?: number
}

export class DOMTextMeasure implements ITextMeasure {
    private _span: HTMLSpanElement | null = null
    private _div: HTMLDivElement | null = null
    /** 挂载父节点，默认 document.body。可指定到特定容器内 */
    mountTo: HTMLElement | null = null

    /** 单行测量 */
    measureText(text: string, fontString: string, letterSpacing: number): RectBounds {
        const el = this._getSpan()
        el.style.font = fontString
        el.style.letterSpacing = letterSpacing !== 0 ? `${letterSpacing}px` : ''
        el.textContent = text

        const rect = el.getBoundingClientRect()
        return {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
        }
    }

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
    measureBlock(text: string, options: CSSMeasureOptions = {}): RectBounds {
        const el = this._getDiv()
        const s = el.style

        // 构建 font shorthand（fontStretch fontStyle fontVariant fontWeight fontSize/lineHeight fontFamily）
        const fontSize = options.fontSize ?? 16
        const fontParts: string[] = []
        if (options.fontStretch && options.fontStretch !== 'normal') fontParts.push(options.fontStretch)
        if (options.fontStyle && options.fontStyle !== 'normal') fontParts.push(options.fontStyle)
        if (options.fontVariant && options.fontVariant !== 'normal') fontParts.push(options.fontVariant)
        if (options.fontWeight && options.fontWeight !== 'normal') fontParts.push(String(options.fontWeight))
        fontParts.push(`${fontSize}px`)
        fontParts.push(options.fontFamily ?? 'sans-serif')
        s.font = fontParts.join(' ')

        // line-height（单独设，避免覆盖 font shorthand）
        if (options.lineHeight != null) {
            s.lineHeight = typeof options.lineHeight === 'number'
                ? String(options.lineHeight)
                : options.lineHeight
        } else {
            s.lineHeight = '1.2'
        }

        // 宽度限制
        if (options.maxWidth != null && options.maxWidth > 0) {
            s.maxWidth = `${options.maxWidth}px`
            s.width = ''
        } else {
            s.maxWidth = ''
            s.width = ''
        }

        // 文本排版
        s.textAlign = options.textAlign ?? 'left'
        s.whiteSpace = options.whiteSpace ?? 'pre-line'
        s.wordBreak = options.wordBreak ?? 'break-word'
        s.overflowWrap = options.overflowWrap ?? ''
        if (options.letterSpacing != null) s.letterSpacing = `${options.letterSpacing}px`
        else s.letterSpacing = ''
        if (options.wordSpacing != null) s.wordSpacing = `${options.wordSpacing}px`
        else s.wordSpacing = ''
        if (options.textIndent != null) s.textIndent = `${options.textIndent}px`
        else s.textIndent = ''
        s.textTransform = options.textTransform ?? 'none'
        s.textDecoration = options.textDecoration ?? 'none'
        s.direction = options.direction ?? 'ltr'

        // padding
        const pad = options.padding ?? 0
        s.padding = `${pad}px`

        el.textContent = text

        const rect = el.getBoundingClientRect()
        return {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
        }
    }

    private _getSpan(): HTMLSpanElement {
        if (this._span) return this._span

        const el = document.createElement('span')
        el.style.cssText =
            'position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none;top:0;left:0'
        const parent = this.mountTo || document.body
        parent.appendChild(el)
        this._span = el
        return el
    }

    private _getDiv(): HTMLDivElement {
        if (this._div) return this._div

        const el = document.createElement('div')
        el.style.cssText =
            'position:absolute;visibility:hidden;pointer-events:none;top:0;left:0;box-sizing:border-box'
        const parent = this.mountTo || document.body
        parent.appendChild(el)
        this._div = el
        return el
    }

    /** 销毁节点，释放 DOM 资源 */
    dispose(): void {
        if (this._span && this._span.parentNode) {
            this._span.parentNode.removeChild(this._span)
        }
        if (this._div && this._div.parentNode) {
            this._div.parentNode.removeChild(this._div)
        }
        this._span = null
        this._div = null
    }
}

// ---- 默认测量后端（全局单例） ----

let _defaultMeasure: ITextMeasure | null = null

/** 获取默认测量后端 */
export function getDefaultTextMeasure(): ITextMeasure {
    if (!_defaultMeasure) {
        _defaultMeasure = new CanvasTextMeasure()
    }
    return _defaultMeasure
}

/** 设置全局默认测量后端 */
export function setDefaultTextMeasure(m: ITextMeasure): void {
    _defaultMeasure = m
}

// ---- 工具函数 ----

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
export function measureTextBlock(text: string, options: CSSMeasureOptions = {}): RectBounds {
    if (!_blockMeasure) {
        _blockMeasure = new DOMTextMeasure()
    }
    return _blockMeasure.measureBlock(text, options)
}

let _blockMeasure: DOMTextMeasure | null = null

/** 构建 CSS font 字符串 */
function buildFontString(style: Required<Omit<ParagraphStyle, 'maxWidth'>>): string {
    const parts: string[] = []
    if (style.fontStyle !== 'normal') parts.push(style.fontStyle)
    if (style.fontWeight !== 'normal') parts.push(String(style.fontWeight))
    parts.push(`${style.fontSize}px`)
    parts.push(style.fontFamily)
    return parts.join(' ')
}

/** 无测量后端时的字符级宽度估算（等宽回退） */
function estimateTextWidth(text: string, fontString: string, letterSpacing: number): number {
    // 尝试从 fontString 中解析字号，如 "italic bold 16px sans-serif"
    const match = fontString.match(/(\d+(?:\.\d+)?)px/)
    const fontSize = match ? parseFloat(match[1]) : 16
    const charWidth = fontSize * 0.6
    let width = text.length * charWidth
    if (letterSpacing !== 0 && text.length > 0) {
        width += letterSpacing * (text.length - 1)
    }
    return width
}

// ---- 默认样式 ----

const DEFAULT_STYLE: Required<Omit<ParagraphStyle, 'maxWidth'>> = {
    fontFamily: 'sans-serif',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: 1.2,
    textAlign: 'left',
    textBaseline: 'top',
    letterSpacing: 0,
}

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
function alignRect(
    bounds: RectBounds,
    textAlign: ParagraphStyle['textAlign'] & string = 'left',
    textBaseline: ParagraphStyle['textBaseline'] & string = 'top',
    targetX: number = 0,
    targetY: number = 0,
    /** 字号（px），用于精确计算 baseline 锚点位置。不传则用 bounds.height 估算 */
    fontSize?: number,
    /** 行高倍数，默认 1.2 */
    lineHeightMul?: number,
): RectBounds {
    const lineH = fontSize != null ? fontSize * (lineHeightMul ?? 1.2) : bounds.height
    // 根据 textBaseline 计算垂直锚点在 bounds 中的相对位置
    let anchorY: number
    switch (textBaseline) {
        case 'top': anchorY = bounds.top; break
        case 'hanging': anchorY = bounds.top + (fontSize ?? lineH) * 0.2; break
        case 'middle': anchorY = bounds.top + lineH / 2; break
        case 'alphabetic': anchorY = bounds.top + (fontSize ?? lineH) * 0.78; break
        case 'ideographic': anchorY = bounds.top + (fontSize ?? lineH) * 0.88; break
        case 'bottom': anchorY = bounds.top + lineH; break
        default: anchorY = bounds.top
    }

    // 根据 textAlign 计算水平锚点在 bounds 中的相对位置
    let anchorX: number
    switch (textAlign) {
        case 'left':
        case 'start': anchorX = bounds.left; break
        case 'center': anchorX = bounds.left + bounds.width / 2; break
        case 'right':
        case 'end': anchorX = bounds.right; break
        default: anchorX = bounds.left
    }

    const dx = targetX - anchorX
    const dy = targetY - anchorY
    return {
        left: bounds.left + dx,
        top: bounds.top + dy,
        right: bounds.right + dx,
        bottom: bounds.bottom + dy,
        width: bounds.width,
        height: bounds.height,
    }
}

// ---- Paragraph 主类 ----

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
export class Paragraph {
    /** 原始文本 */
    text: string
    /** 段落原点 x */
    x: number
    /** 段落原点 y */
    y: number
    /** 排版样式 */
    style: Required<ParagraphStyle>
    /** 当前使用的测量后端 */
    measure: ITextMeasure

    /** 排版后的行数据（调用 layout() 后填充） */
    lines: LineMetrics[] = []

    /** 缓存的包围盒 */
    private _bounds: RectBounds | null = null

    /** 缓存的 CSS font 字符串 */
    private _fontString: string = ''

    private _resolved: Required<Omit<ParagraphStyle, 'maxWidth'>> & { maxWidth: number }

    constructor(
        text: string = '',
        x: number = 0,
        y: number = 0,
        style: ParagraphStyle = {},
        measure?: ITextMeasure,
    ) {
        this.text = text
        this.x = x
        this.y = y
        this.measure = measure ?? getDefaultTextMeasure()

        const maxWidth = style.maxWidth ?? 0
        this._resolved = { ...DEFAULT_STYLE, ...style, maxWidth }
        this.style = { ...this._resolved }
        this._fontString = buildFontString(this._resolved)
    }

    // ---- Public API ----

    /**
     * 执行文本排版布局。
     * 解析换行符、根据 maxWidth 自动换行、计算每行位置和宽度。
     * 修改 text / style 后需重新调用。
     */
    layout(): this {
        const s = this._resolved
        const lineHeightPx = s.fontSize * s.lineHeight
        this.lines = []
        this._bounds = null

        const paragraphs = this.text.split('\n')
        let currentY = this.y

        for (const para of paragraphs) {
            if (s.maxWidth > 0) {
                this._wrapParagraph(para, s, lineHeightPx, currentY)
            } else {
                const width = this._measure(para)
                const x = this._alignX(width, s)
                this.lines.push({ text: para, x, y: currentY, width, height: lineHeightPx })
                currentY += lineHeightPx
            }
        }
        return this
    }

    /**
     * 获取文本包围盒。
     * 如果未调用 layout()，将自动调用。
     */
    getBounds(): RectBounds {
        if (this.lines.length === 0) this.layout()
        if (this._bounds) return this._bounds

        if (this.lines.length === 0) {
            this._bounds = { left: this.x, top: this.y, right: this.x, bottom: this.y, width: 0, height: 0 }
            return this._bounds
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
        for (const line of this.lines) {
            minX = Math.min(minX, line.x)
            minY = Math.min(minY, line.y)
            maxX = Math.max(maxX, line.x + line.width)
            maxY = Math.max(maxY, line.y + line.height)
        }
        this._bounds = {
            left: minX,
            top: minY,
            right: maxX,
            bottom: maxY,
            width: maxX - minX,
            height: maxY - minY,
        }
        return this._bounds
    }

    /**
     * 判断点 (px, py) 是否位于文本包围盒内。
     */
    isPointInBounds(px: number, py: number): boolean {
        const b = this.getBounds()
        return px >= b.left && px <= b.right && py >= b.top && py <= b.bottom
    }

    /**
     * 遍历所有排版后的行。
     */
    forEachLine(fn: (line: LineMetrics, index: number) => void): void {
        if (this.lines.length === 0) this.layout()
        for (let i = 0; i < this.lines.length; i++) {
            fn(this.lines[i], i)
        }
    }

    /** 获取行数 */
    get lineCount(): number {
        if (this.lines.length === 0) this.layout()
        return this.lines.length
    }

    /**
     * 更新文本内容。不清空样式，但会清除布局缓存。
     */
    setText(text: string): this {
        this.text = text
        this.lines = []
        this._bounds = null
        return this
    }

    /**
     * 更新样式。合并到现有样式，清除布局缓存。
     */
    setStyle(style: Partial<ParagraphStyle>): this {
        Object.assign(this._resolved, style)
        if (style.maxWidth !== undefined) this._resolved.maxWidth = style.maxWidth
        this.style = { ...this._resolved }
        this._fontString = buildFontString(this._resolved)
        this.lines = []
        this._bounds = null
        return this
    }

    /**
     * 替换测量后端。清除布局缓存。
     */
    setMeasure(m: ITextMeasure): this {
        this.measure = m
        this.lines = []
        this._bounds = null
        return this
    }

    /**
     * 将段落绘制到 Canvas 上下文。
     * 使用 fillText，自动应用对齐和 font。
     */
    draw(ctx: CanvasRenderingContext2D, fillStyle?: string): void {
        if (this.lines.length === 0) this.layout()
        const s = this._resolved
        ctx.save()
        ctx.font = this._fontString
        ctx.textAlign = 'left'
        ctx.textBaseline = s.textBaseline

        if (fillStyle) ctx.fillStyle = fillStyle

        // line.y 始终为行顶部坐标，根据 textBaseline 计算 fillText 需要的偏移
        const baselineOffset = this._baselineOffset(s.textBaseline, s.fontSize * s.lineHeight)

        for (const line of this.lines) {
            ctx.fillText(line.text, line.x, line.y + baselineOffset)
        }
        ctx.restore()
    }

    // ---- Private ----

    /** 委托给测量后端，返回文本宽度 */
    private _measure(text: string): number {
        return this.measure.measureText(text, this._fontString, this._resolved.letterSpacing).width
    }

    /**
     * 根据 Canvas textBaseline 计算从行顶部到 fillText 绘制 y 的偏移。
     * line.y 始终代表行顶部坐标（用于包围盒计算），draw() 时通过此偏移调整。
     */
    private _baselineOffset(baseline: ParagraphStyle['textBaseline'] & string, lineHeightPx: number): number {
        switch (baseline) {
            case 'top': return 0
            case 'hanging': return this._resolved.fontSize * 0.2
            case 'middle': return lineHeightPx / 2
            case 'alphabetic': return this._resolved.fontSize * 0.78
            case 'ideographic': return this._resolved.fontSize * 0.88
            case 'bottom': return lineHeightPx
            default: return 0
        }
    }

    /** 自动换行处理 */
    private _wrapParagraph(
        text: string,
        s: Required<Omit<ParagraphStyle, 'maxWidth'>> & { maxWidth: number },
        lineHeightPx: number,
        startY: number,
    ): void {
        const maxWidth = s.maxWidth
        const words = text.split(/(?<=\s)/)
        let currentLine = ''
        let currentY = startY

        for (const word of words) {
            const testLine = currentLine + word
            const testWidth = this._measure(testLine)

            if (testWidth > maxWidth && currentLine.length > 0) {
                this._pushLine(currentLine.trimEnd(), lineHeightPx, currentY)
                currentY += lineHeightPx
                currentLine = word
            } else {
                currentLine = testLine
            }
        }

        if (currentLine.length > 0) {
            this._pushLine(currentLine.trimEnd(), lineHeightPx, currentY)
        }
    }

    /** 提交一行到 lines */
    private _pushLine(text: string, lineHeightPx: number, y: number): void {
        const width = this._measure(text)
        const x = this._alignX(width, this._resolved)
        this.lines.push({ text, x, y, width, height: lineHeightPx })
    }

    /** 根据 textAlign 计算水平偏移 */
    private _alignX(lineWidth: number, s: Required<Omit<ParagraphStyle, 'maxWidth'>>): number {
        switch (s.textAlign) {
            case 'left':
            case 'start': return this.x
            case 'center': return this.x - lineWidth / 2
            case 'right':
            case 'end': return this.x - lineWidth
            default: return this.x
        }
    }
}
