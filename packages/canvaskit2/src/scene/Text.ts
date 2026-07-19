import { BoundingRect } from '@dxyl/math2'
import { CKPath2D } from 'src/ck'
import { Renderer } from 'src/core/Renderer'
import { Shape, type ShapeProps } from 'src/core/Shape'

export type TextProps = ShapeProps<{
    /** 文本内容 */
    text?: string
    /** 文本左上角 x（基线/对齐受 textAlign、textBaseline 影响） */
    x?: number
    /** 文本左上角 y */
    y?: number
}>

/**
 * 文本元素。
 *
 * 字体/排版相关属性（fontSize、fontFamily、fontWeight、fontStyle、letterSpacing、
 * textAlign、textBaseline、lineHeight、lineSpacing、wrap、wrapWidth、maxWidth）
 * 统一放在 `style` 中，与 RenderStyle 保持一致；`shape` 只保留纯几何/内容字段
 * （text、x、y）。
 *
 * 本元素只通过 Renderer 的抽象接口（applyTextStyle / fillText / strokeText /
 * measureText）与渲染器交互，不直接引用底层 ctx，便于后续接入 CanvasKit 等其它渲染器。
 *
 * 用法:
 *   const t = new Text({
 *       shape: { text: 'Hello', x: 100, y: 100 },
 *       style: { fillStyle: '#000', fontSize: 24, fontFamily: 'sans-serif' }
 *   })
 *   scene.add(t)
 *
 * 支持:
 *   - 单行 / 自动换行（style.wrap + style.wrapWidth）
 *   - 行间距（style.lineSpacing）
 *   - 完整的字体属性（fontSize / fontFamily / fontWeight / fontStyle / letterSpacing）
 *   - 文本对齐（textAlign / textBaseline）
 *   - fill / stroke（取决于 fillStyle / strokeStyle）
 */
export class Text extends Shape<TextProps> {
    type = "Text"

    /** 缓存的测量结果，避免每帧重复 measureText */
    _measuredBounds: BoundingRect | null = null

    getDefaultProps(): Partial<TextProps>[] {
        return [...super.getDefaultProps(), {
            shape: {
                text: '',
                x: 0,
                y: 0,
            },
            style: {
                fillStyle: '#000',
                strokeStyle: 'none',
                // 字体/排版默认值
                fontSize: 16,
                fontFamily: 'sans-serif',
                fontWeight: 'normal',
                fontStyle: 'normal',
                textAlign: 'left',
                textBaseline: 'alphabetic',
                lineHeight: 1,
                lineSpacing: 0,
                wrap: false,
                wrapWidth: 0,
                maxWidth: 0,
            }
        }]
    }

    constructor(props?: Partial<TextProps>) {
        super(props as TextProps)
    }

    get text(): string {
        return this.props.shape.text
    }
    set text(value: string) {
        this.setShape('text', value)
        this._measuredBounds = null
    }

    /**
     * 将文本拆分为多行。
     * - 未开启自动换行（style.wrap=false 或 style.wrapWidth=0）：仅按显式换行符拆分
     * - 开启自动换行：先按显式换行符分段，再对每段按 wrapWidth 测量截断
     *
     * 注意: 调用前需确保渲染器已应用当前字体样式（renderText 会先调用 applyTextStyle）。
     */
    private _splitLines(renderer: Renderer): string[] {
        const st = this.style
        const text = this.props.shape.text || ''
        // 未开启自动换行：仅按显式换行符拆分
        if (!st.wrap || !st.wrapWidth) {
            return text.split('\n')
        }
        const lines: string[] = []
        const paragraphs = text.split('\n')
        for (const para of paragraphs) {
            if (para === '') { lines.push(''); continue }
            let current = ''
            for (const ch of para) {
                const test = current + ch
                const w = renderer.measureText(test).width
                if (w > st.wrapWidth && current) {
                    lines.push(current)
                    current = ch
                } else {
                    current = test
                }
            }
            if (current) lines.push(current)
        }
        return lines
    }

    draw(renderer: Renderer): void {
        const sh = this.props.shape
        const st = this.style
        if (!sh.text) return
        // 字体样式由 renderText 通过 applyTextStyle 预先应用到渲染器
        const lines = this._splitLines(renderer)
        const lineHeight = (st.lineHeight || 1) * st.fontSize
        const lineSpacing = st.lineSpacing || 0
        const hasFill = !!st.fillStyle
        const hasStroke = !!st.strokeStyle && st.lineWidth > 0

        // textBaseline 决定第一行的 y 坐标含义；后续行按 lineHeight 递增
        for (let i = 0; i < lines.length; i++) {
            const y = sh.y + i * (lineHeight + lineSpacing)
            const maxW = st.maxWidth > 0 ? st.maxWidth : undefined
            if (hasFill) renderer.fillText(lines[i], sh.x, y, maxW)
            if (hasStroke) renderer.strokeText(lines[i], sh.x, y, maxW)
        }
    }

    /**
     * 计算文本本地包围盒。
     * 通过渲染器的 measureText 测量每行宽度，结合 fontSize/lineHeight 计算高度。
     * 测量前会调用 applyTextStyle 以确保使用当前元素的字体。
     */
    calcLocalBounds(out: BoundingRect): BoundingRect {
        const sh = this.props.shape
        const st = this.style
        if (!sh.text) {
            out.fromXYWH(sh.x, sh.y, 0, 0)
            return out
        }
        const renderer = this.owner?.renderer
        const canMeasure = !!renderer
        // 测量前应用字体样式，保证 measureText 使用当前元素字体
        if (canMeasure) renderer.applyTextStyle(this)

        const lines = sh.text.split('\n')
        const fontSize = st.fontSize || 16
        const lineHeight = (st.lineHeight || 1) * fontSize
        const lineSpacing = st.lineSpacing || 0

        let maxW = 0
        for (const line of lines) {
            let w: number
            if (canMeasure) {
                w = renderer.measureText(line).width
            } else {
                // 无渲染器时用粗略估算
                w = line.length * fontSize * 0.6
            }
            if (w > maxW) maxW = w
        }
        const totalH = lines.length * lineHeight + (lines.length - 1) * lineSpacing

        // 根据 textAlign 调整 x 起点
        let x0 = sh.x
        if (st.textAlign === 'center') x0 = sh.x - maxW / 2
        else if (st.textAlign === 'right' || st.textAlign === 'end') x0 = sh.x - maxW

        // 根据 textBaseline 调整 y 起点
        let y0 = sh.y
        if (st.textBaseline === 'top') y0 = sh.y
        else if (st.textBaseline === 'middle') y0 = sh.y - totalH / 2
        else if (st.textBaseline === 'bottom') y0 = sh.y - totalH
        else y0 = sh.y - fontSize * 0.8  // alphabetic / ideographic 近似

        out.fromXYWH(x0, y0, maxW, totalH)
        return out
    }

    /** 文本元素不需要生成路径，但保留实现以满足抽象类契约 */
    buildPath(path: CKPath2D): void {
        if (!this.props.shape.text) return
        // 用包围盒作为粗略路径，用于命中测试
        const bounds = this.calcLocalBounds(BoundingRect.default())
        path.rect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY)
    }

    /** 文本命中测试：基于包围盒 */
    hitTest(x: number, y: number): boolean {
        if (this.props.pointerEvents === 'none') return false
        const bounds = this.calcLocalBounds(BoundingRect.default())
        return bounds.contains(x, y)
    }

    render(renderer: Renderer): void {
        renderer.renderText(this)
    }
}
