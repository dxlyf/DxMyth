// ============================================================
// Paint — 绘制样式
//
// 集中管理一个节点的全部绘制样式（填充 / 描边画笔、描边参数、文本样式，
// 以及不透明度、填充规则、描边对齐、绘制顺序、混合模式、滤镜与阴影）。
// 设计要点：
//   - 默认可直接 `new Paint()` 使用；也可传入初始样式 PaintProps
//   - fill / stroke 接受 ColorInput | Gradient | Pattern（如 '#f00'、0xff0000、
//     [r,g,b,a] 或 Color 实例）；内部会把它解析为具体画笔——颜色统一规整为
//     Color——并记录到 fillType / strokeType，同时提供 fillColor /
//     fillGradient / fillPattern 等已定型的取值器，使用时无需再做 instanceof
//     判断
//   - 任何样式被设置/更新时都会派发 'change' 事件，携带变化的
//     名称、新值与旧值，方便 DisplayObject 或外部做脏标记与联动
//   - 与渲染器无关：只描述「用什么画、怎么画」，不依赖任何后端
// ============================================================

import { EventEmitter } from '../events/EventEmitter'
import { Color, type ColorInput } from '../math/Color'
import { Gradient } from '../math/Gradient'
import { Pattern } from '../math/Pattern'
import { LineCap, LineJoin } from '../math/PathStroke'

// 复用 math 层的线条端点/连接枚举，避免重复定义
export { LineCap, LineJoin }

/** 画笔输入：颜色（字符串/数值/数组/Color 等） | 渐变 | 图案 */
export type Brush = ColorInput | Gradient | Pattern

/** 规整后的画笔：颜色已解析为 Color 实例 */
export type ResolvedBrush = Color | Gradient | Pattern

/** 画笔种类标识：使用时可据此直接分支，无需再 instanceof 判断 */
export type BrushType = 'color' | 'gradient' | 'pattern'

/** 填充规则（决定路径内部判定方式） */
export type FillRule = 'nonzero' | 'evenodd'

/** 将颜色输入规整为 Color 实例 */
export function resolveColor(input: ColorInput): Color {
    const color = Color.fromInput(input)
    return color instanceof Color ? color : Color.fromColorValue(color)
}

/** 将画笔输入规整为具体画笔：颜色输入统一解析为 Color，渐变/图案原样返回 */
export function resolveBrush(brush: Brush): ResolvedBrush {
    if (brush instanceof Gradient || brush instanceof Pattern) return brush
    return resolveColor(brush)
}

/** 解析画笔的具体种类 */
export function resolveBrushType(brush: ResolvedBrush): BrushType {
    if (brush instanceof Gradient) return 'gradient'
    if (brush instanceof Pattern) return 'pattern'
    return 'color'
}

/** 两个规整画笔是否等价（颜色按分量比较，渐变/图案按引用比较） */
function brushEquals(a: ResolvedBrush, b: ResolvedBrush): boolean {
    if (a === b) return true
    if (a instanceof Color && b instanceof Color) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3]
    }
    return false
}

/** 深拷贝画笔（Color / Gradient / Pattern 均实现 clone） */
function cloneBrush(brush: ResolvedBrush): ResolvedBrush {
    return brush.clone()
}

/** 描边对齐方式（相对路径的位置） */
export type StrokeAlign = 'center' | 'inside' | 'outside'

/** 描边样式（交给渲染器的一次性描边参数） */
export interface StrokeStyle {
    /** 描边画笔 */
    brush: ResolvedBrush
    /** 线宽 */
    width: number
    /** 描边对齐方式 */
    align?: StrokeAlign
    /** 端点样式 */
    lineCap?: LineCap
    /** 连接样式 */
    lineJoin?: LineJoin
    /** 斜接限制（lineJoin 为 miter 时生效） */
    miterLimit?: number
    /** 虚线模式（空表示实线） */
    dash?: readonly number[] | null
    /** 虚线起始偏移 */
    dashOffset?: number
}

/** 混合模式（语义同 Canvas globalCompositeOperation / Layer.blendMode） */
export type BlendMode =
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'color-dodge'
    | 'color-burn'
    | 'hard-light'
    | 'soft-light'
    | 'difference'
    | 'exclusion'
    | 'hue'
    | 'saturation'
    | 'color'
    | 'luminosity'

/** 填充与描边的绘制先后顺序 */
export type PaintFirst = 'fill' | 'stroke'

/** 阴影样式快照（交给渲染器的一次性阴影参数） */
export interface ShadowStyle {
    /** 阴影颜色 */
    color: Color
    /** 模糊半径 */
    blur: number
    /** 水平偏移 */
    offsetX: number
    /** 垂直偏移 */
    offsetY: number
}

/** Paint 可设置的样式键 */
export type PaintPropKey =
    | 'fill'
    | 'stroke'
    | 'strokeWidth'
    | 'lineCap'
    | 'lineJoin'
    | 'miterLimit'
    | 'dash'
    | 'dashOffset'
    | 'fontFamily'
    | 'fontSize'
    | 'fontStyle'
    | 'fontWeight'
    | 'textAlign'
    | 'textBaseline'
    | 'lineHeight'
    | 'letterSpacing'
    | 'blend'
    | 'filter'
    | 'shadowColor'
    | 'shadowBlur'
    | 'shadowOffsetX'
    | 'shadowOffsetY'
    | 'opacity'
    | 'fillRule'
    | 'strokeAlign'
    | 'paintFirst'

/** 文本水平对齐 */
export type TextAlign = 'left' | 'center' | 'right' | 'start' | 'end' | 'justify'

/** 文本垂直基线 */
export type TextBaseline = 'alphabetic' | 'top' | 'middle' | 'bottom' | 'hanging' | 'ideographic'

/** 字体样式 */
export type FontStyle = 'normal' | 'italic' | 'oblique'

/** 字体粗细（关键字或数值） */
export type FontWeight = string | number

/** 文本样式快照（交给渲染器的一次性文本参数） */
export interface TextStyle {
    /** 字体族 */
    fontFamily: string
    /** 字号（px） */
    fontSize: number
    /** 字体样式 */
    fontStyle: FontStyle
    /** 字重 */
    fontWeight: FontWeight
    /** 水平对齐 */
    textAlign: TextAlign
    /** 垂直基线 */
    textBaseline: TextBaseline
    /** 行高（字号倍数） */
    lineHeight: number
    /** 字间距（px） */
    letterSpacing: number
}

export interface PaintProps {
    /** 填充画笔（null 表示不填充） */
    fill?: Brush | null
    /** 描边画笔（null 表示不描边） */
    stroke?: Brush | null
    /** 描边线宽 */
    strokeWidth?: number
    /** 线条端点样式 */
    lineCap?: LineCap
    /** 线条连接样式 */
    lineJoin?: LineJoin
    /** 斜接限制 */
    miterLimit?: number
    /** 虚线模式（空表示实线） */
    dash?: readonly number[] | null
    /** 虚线起始偏移 */
    dashOffset?: number
    /** 字体族 */
    fontFamily?: string
    /** 字号（px） */
    fontSize?: number
    /** 字体样式 */
    fontStyle?: FontStyle
    /** 字重 */
    fontWeight?: FontWeight
    /** 文本水平对齐 */
    textAlign?: TextAlign
    /** 文本垂直基线 */
    textBaseline?: TextBaseline
    /** 行高（字号倍数） */
    lineHeight?: number
    /** 字间距（px） */
    letterSpacing?: number
    /** 混合模式 */
    blend?: BlendMode
    /** 滤镜（CSS filter 语法，如 'blur(4px)'；null 表示不滤镜） */
    filter?: string | null
    /** 阴影颜色（null 表示无阴影） */
    shadowColor?: ColorInput | null
    /** 阴影模糊半径 */
    shadowBlur?: number
    /** 阴影水平偏移 */
    shadowOffsetX?: number
    /** 阴影垂直偏移 */
    shadowOffsetY?: number
    /** 不透明度（0~1） */
    opacity?: number
    /** 填充规则 */
    fillRule?: FillRule
    /** 描边对齐方式 */
    strokeAlign?: StrokeAlign
    /** 填充与描边的绘制先后顺序 */
    paintFirst?: PaintFirst
}

export type PaintEvents = {
    /** 任一绘制样式被设置/更新：携带名称、新值与旧值 */
    change: [{ target: Paint; name: PaintPropKey; value: any; prev: any }]
}

export class Paint extends EventEmitter<PaintEvents> {

    private _fill: ResolvedBrush | null
    private _fillType: BrushType | null
    private _stroke: ResolvedBrush | null
    private _strokeType: BrushType | null
    private _strokeWidth: number
    private _lineCap: LineCap
    private _lineJoin: LineJoin
    private _miterLimit: number
    private _dash: readonly number[] | null
    private _dashOffset: number
    private _fontFamily: string
    private _fontSize: number
    private _fontStyle: FontStyle
    private _fontWeight: FontWeight
    private _textAlign: TextAlign
    private _textBaseline: TextBaseline
    private _lineHeight: number
    private _letterSpacing: number
    private _blend: BlendMode
    private _filter: string | null
    private _shadowColor: Color | null
    private _shadowBlur: number
    private _shadowOffsetX: number
    private _shadowOffsetY: number
    private _opacity: number
    private _fillRule: FillRule
    private _strokeAlign: StrokeAlign
    private _paintFirst: PaintFirst

    constructor(props: PaintProps = {}) {
        super()
        this._fill = props.fill == null ? null : resolveBrush(props.fill)
        this._fillType = this._fill ? resolveBrushType(this._fill) : null
        this._stroke = props.stroke == null ? null : resolveBrush(props.stroke)
        this._strokeType = this._stroke ? resolveBrushType(this._stroke) : null
        this._strokeWidth = props.strokeWidth ?? 1
        this._lineCap = props.lineCap ?? LineCap.Butt
        this._lineJoin = props.lineJoin ?? LineJoin.Miter
        this._miterLimit = props.miterLimit ?? 10
        this._dash = props.dash ?? null
        this._dashOffset = props.dashOffset ?? 0
        this._fontFamily = props.fontFamily ?? 'sans-serif'
        this._fontSize = props.fontSize ?? 16
        this._fontStyle = props.fontStyle ?? 'normal'
        this._fontWeight = props.fontWeight ?? 'normal'
        this._textAlign = props.textAlign ?? 'left'
        this._textBaseline = props.textBaseline ?? 'alphabetic'
        this._lineHeight = props.lineHeight ?? 1.2
        this._letterSpacing = props.letterSpacing ?? 0
        this._blend = props.blend ?? 'normal'
        this._filter = props.filter ?? null
        this._shadowColor = props.shadowColor == null ? null : resolveColor(props.shadowColor)
        this._shadowBlur = props.shadowBlur ?? 0
        this._shadowOffsetX = props.shadowOffsetX ?? 0
        this._shadowOffsetY = props.shadowOffsetY ?? 0
        this._opacity = props.opacity ?? 1
        this._fillRule = props.fillRule ?? 'nonzero'
        this._strokeAlign = props.strokeAlign ?? 'center'
        this._paintFirst = props.paintFirst ?? 'fill'
    }

    /** 是否有填充 */
    get hasFill(): boolean { return this._fill !== null }
    /** 是否有描边（画笔存在且线宽大于 0） */
    get hasStroke(): boolean { return this._stroke !== null && this._strokeWidth > 0 }
    /** 是否有阴影（阴影颜色已设置） */
    get hasShadow(): boolean { return this._shadowColor !== null }

    // ==================== 填充 ====================

    /** 当前填充种类；无填充时为 null */
    get fillType(): BrushType | null { return this._fillType }
    /** 当前填充画笔（颜色已规整为 Color） */
    get fill(): ResolvedBrush | null { return this._fill }
    /** 填充为纯色时返回 Color，否则 null */
    get fillColor(): Color | null { return this._fillType === 'color' ? this._fill as Color : null }
    /** 填充为渐变时返回 Gradient，否则 null */
    get fillGradient(): Gradient | null { return this._fillType === 'gradient' ? this._fill as Gradient : null }
    /** 填充为图案时返回 Pattern，否则 null */
    get fillPattern(): Pattern | null { return this._fillType === 'pattern' ? this._fill as Pattern : null }
    set fill(v: Brush | null) {
        const prev = this._fill
        const next = v == null ? null : resolveBrush(v)
        if (next === prev || (next !== null && prev !== null && brushEquals(prev, next))) return
        this._fill = next
        this._fillType = next ? resolveBrushType(next) : null
        this.emit('change', { target: this, name: 'fill', value: next, prev })
    }

    // ==================== 描边 ====================

    /** 当前描边种类；无描边时为 null */
    get strokeType(): BrushType | null { return this._strokeType }
    /** 当前描边画笔（颜色已规整为 Color） */
    get stroke(): ResolvedBrush | null { return this._stroke }
    /** 描边为纯色时返回 Color，否则 null */
    get strokeColor(): Color | null { return this._strokeType === 'color' ? this._stroke as Color : null }
    /** 描边为渐变时返回 Gradient，否则 null */
    get strokeGradient(): Gradient | null { return this._strokeType === 'gradient' ? this._stroke as Gradient : null }
    /** 描边为图案时返回 Pattern，否则 null */
    get strokePattern(): Pattern | null { return this._strokeType === 'pattern' ? this._stroke as Pattern : null }
    set stroke(v: Brush | null) {
        const prev = this._stroke
        const next = v == null ? null : resolveBrush(v)
        if (next === prev || (next !== null && prev !== null && brushEquals(prev, next))) return
        this._stroke = next
        this._strokeType = next ? resolveBrushType(next) : null
        this.emit('change', { target: this, name: 'stroke', value: next, prev })
    }

    get strokeWidth(): number { return this._strokeWidth }
    set strokeWidth(v: number) {
        if (this._strokeWidth === v) return
        const prev = this._strokeWidth
        this._strokeWidth = v
        this.emit('change', { target: this, name: 'strokeWidth', value: v, prev })
    }

    get lineCap(): LineCap { return this._lineCap }
    set lineCap(v: LineCap) {
        if (this._lineCap === v) return
        const prev = this._lineCap
        this._lineCap = v
        this.emit('change', { target: this, name: 'lineCap', value: v, prev })
    }

    get lineJoin(): LineJoin { return this._lineJoin }
    set lineJoin(v: LineJoin) {
        if (this._lineJoin === v) return
        const prev = this._lineJoin
        this._lineJoin = v
        this.emit('change', { target: this, name: 'lineJoin', value: v, prev })
    }

    get miterLimit(): number { return this._miterLimit }
    set miterLimit(v: number) {
        if (this._miterLimit === v) return
        const prev = this._miterLimit
        this._miterLimit = v
        this.emit('change', { target: this, name: 'miterLimit', value: v, prev })
    }

    get dash(): readonly number[] | null { return this._dash }
    set dash(v: readonly number[] | null) {
        if (this._dash === v) return
        const prev = this._dash
        this._dash = v
        this.emit('change', { target: this, name: 'dash', value: v, prev })
    }

    get dashOffset(): number { return this._dashOffset }
    set dashOffset(v: number) {
        if (this._dashOffset === v) return
        const prev = this._dashOffset
        this._dashOffset = v
        this.emit('change', { target: this, name: 'dashOffset', value: v, prev })
    }

    // ==================== 文本 ====================

    get fontFamily(): string { return this._fontFamily }
    set fontFamily(v: string) {
        if (this._fontFamily === v) return
        const prev = this._fontFamily
        this._fontFamily = v
        this.emit('change', { target: this, name: 'fontFamily', value: v, prev })
    }

    get fontSize(): number { return this._fontSize }
    set fontSize(v: number) {
        if (this._fontSize === v) return
        const prev = this._fontSize
        this._fontSize = v
        this.emit('change', { target: this, name: 'fontSize', value: v, prev })
    }

    get fontStyle(): FontStyle { return this._fontStyle }
    set fontStyle(v: FontStyle) {
        if (this._fontStyle === v) return
        const prev = this._fontStyle
        this._fontStyle = v
        this.emit('change', { target: this, name: 'fontStyle', value: v, prev })
    }

    get fontWeight(): FontWeight { return this._fontWeight }
    set fontWeight(v: FontWeight) {
        if (this._fontWeight === v) return
        const prev = this._fontWeight
        this._fontWeight = v
        this.emit('change', { target: this, name: 'fontWeight', value: v, prev })
    }

    get textAlign(): TextAlign { return this._textAlign }
    set textAlign(v: TextAlign) {
        if (this._textAlign === v) return
        const prev = this._textAlign
        this._textAlign = v
        this.emit('change', { target: this, name: 'textAlign', value: v, prev })
    }

    get textBaseline(): TextBaseline { return this._textBaseline }
    set textBaseline(v: TextBaseline) {
        if (this._textBaseline === v) return
        const prev = this._textBaseline
        this._textBaseline = v
        this.emit('change', { target: this, name: 'textBaseline', value: v, prev })
    }

    get lineHeight(): number { return this._lineHeight }
    set lineHeight(v: number) {
        if (this._lineHeight === v) return
        const prev = this._lineHeight
        this._lineHeight = v
        this.emit('change', { target: this, name: 'lineHeight', value: v, prev })
    }

    get letterSpacing(): number { return this._letterSpacing }
    set letterSpacing(v: number) {
        if (this._letterSpacing === v) return
        const prev = this._letterSpacing
        this._letterSpacing = v
        this.emit('change', { target: this, name: 'letterSpacing', value: v, prev })
    }

    // ==================== 混合 / 滤镜 / 阴影 ====================

    get blend(): BlendMode { return this._blend }
    set blend(v: BlendMode) {
        if (this._blend === v) return
        const prev = this._blend
        this._blend = v
        this.emit('change', { target: this, name: 'blend', value: v, prev })
    }

    /** 滤镜字符串（CSS filter 语法）；null 表示不滤镜 */
    get filter(): string | null { return this._filter }
    set filter(v: string | null) {
        if (this._filter === v) return
        const prev = this._filter
        this._filter = v
        this.emit('change', { target: this, name: 'filter', value: v, prev })
    }

    /** 阴影颜色；null 表示无阴影 */
    get shadowColor(): Color | null { return this._shadowColor }
    set shadowColor(v: ColorInput | null) {
        const prev = this._shadowColor
        const next = v == null ? null : resolveColor(v)
        if (next === prev || (next !== null && prev !== null && brushEquals(prev, next))) return
        this._shadowColor = next
        this.emit('change', { target: this, name: 'shadowColor', value: next, prev })
    }

    get shadowBlur(): number { return this._shadowBlur }
    set shadowBlur(v: number) {
        if (this._shadowBlur === v) return
        const prev = this._shadowBlur
        this._shadowBlur = v
        this.emit('change', { target: this, name: 'shadowBlur', value: v, prev })
    }

    get shadowOffsetX(): number { return this._shadowOffsetX }
    set shadowOffsetX(v: number) {
        if (this._shadowOffsetX === v) return
        const prev = this._shadowOffsetX
        this._shadowOffsetX = v
        this.emit('change', { target: this, name: 'shadowOffsetX', value: v, prev })
    }

    get shadowOffsetY(): number { return this._shadowOffsetY }
    set shadowOffsetY(v: number) {
        if (this._shadowOffsetY === v) return
        const prev = this._shadowOffsetY
        this._shadowOffsetY = v
        this.emit('change', { target: this, name: 'shadowOffsetY', value: v, prev })
    }

    // ==================== 不透明度 / 填充规则 / 描边对齐 / 绘制顺序 ====================

    /** 不透明度（0~1） */
    get opacity(): number { return this._opacity }
    set opacity(v: number) {
        if (this._opacity === v) return
        const prev = this._opacity
        this._opacity = v
        this.emit('change', { target: this, name: 'opacity', value: v, prev })
    }

    /** 填充规则 */
    get fillRule(): FillRule { return this._fillRule }
    set fillRule(v: FillRule) {
        if (this._fillRule === v) return
        const prev = this._fillRule
        this._fillRule = v
        this.emit('change', { target: this, name: 'fillRule', value: v, prev })
    }

    /** 描边对齐方式 */
    get strokeAlign(): StrokeAlign { return this._strokeAlign }
    set strokeAlign(v: StrokeAlign) {
        if (this._strokeAlign === v) return
        const prev = this._strokeAlign
        this._strokeAlign = v
        this.emit('change', { target: this, name: 'strokeAlign', value: v, prev })
    }

    /** 填充与描边的绘制先后顺序 */
    get paintFirst(): PaintFirst { return this._paintFirst }
    set paintFirst(v: PaintFirst) {
        if (this._paintFirst === v) return
        const prev = this._paintFirst
        this._paintFirst = v
        this.emit('change', { target: this, name: 'paintFirst', value: v, prev })
    }

    // ==================== 批量操作 ====================

    /** 批量设置样式：逐项写入并通过 change 事件通知（仅写入提供且发生变化的项） */
    set(props: PaintProps): this {
        if (props.fill !== undefined) this.fill = props.fill
        if (props.stroke !== undefined) this.stroke = props.stroke
        if (props.strokeWidth !== undefined) this.strokeWidth = props.strokeWidth
        if (props.lineCap !== undefined) this.lineCap = props.lineCap
        if (props.lineJoin !== undefined) this.lineJoin = props.lineJoin
        if (props.miterLimit !== undefined) this.miterLimit = props.miterLimit
        if (props.dash !== undefined) this.dash = props.dash
        if (props.dashOffset !== undefined) this.dashOffset = props.dashOffset
        if (props.fontFamily !== undefined) this.fontFamily = props.fontFamily
        if (props.fontSize !== undefined) this.fontSize = props.fontSize
        if (props.fontStyle !== undefined) this.fontStyle = props.fontStyle
        if (props.fontWeight !== undefined) this.fontWeight = props.fontWeight
        if (props.textAlign !== undefined) this.textAlign = props.textAlign
        if (props.textBaseline !== undefined) this.textBaseline = props.textBaseline
        if (props.lineHeight !== undefined) this.lineHeight = props.lineHeight
        if (props.letterSpacing !== undefined) this.letterSpacing = props.letterSpacing
        if (props.blend !== undefined) this.blend = props.blend
        if (props.filter !== undefined) this.filter = props.filter
        if (props.shadowColor !== undefined) this.shadowColor = props.shadowColor
        if (props.shadowBlur !== undefined) this.shadowBlur = props.shadowBlur
        if (props.shadowOffsetX !== undefined) this.shadowOffsetX = props.shadowOffsetX
        if (props.shadowOffsetY !== undefined) this.shadowOffsetY = props.shadowOffsetY
        if (props.opacity !== undefined) this.opacity = props.opacity
        if (props.fillRule !== undefined) this.fillRule = props.fillRule
        if (props.strokeAlign !== undefined) this.strokeAlign = props.strokeAlign
        if (props.paintFirst !== undefined) this.paintFirst = props.paintFirst
        return this
    }

    /** 导出当前样式快照 */
    toProps(): Required<PaintProps> {
        return {
            fill: this._fill,
            stroke: this._stroke,
            strokeWidth: this._strokeWidth,
            lineCap: this._lineCap,
            lineJoin: this._lineJoin,
            miterLimit: this._miterLimit,
            dash: this._dash,
            dashOffset: this._dashOffset,
            fontFamily: this._fontFamily,
            fontSize: this._fontSize,
            fontStyle: this._fontStyle,
            fontWeight: this._fontWeight,
            textAlign: this._textAlign,
            textBaseline: this._textBaseline,
            lineHeight: this._lineHeight,
            letterSpacing: this._letterSpacing,
            blend: this._blend,
            filter: this._filter,
            shadowColor: this._shadowColor,
            shadowBlur: this._shadowBlur,
            shadowOffsetX: this._shadowOffsetX,
            shadowOffsetY: this._shadowOffsetY,
            opacity: this._opacity,
            fillRule: this._fillRule,
            strokeAlign: this._strokeAlign,
            paintFirst: this._paintFirst,
        }
    }

    /** 以当前样式构造一次性描边参数；无描边时返回 null */
    get strokeStyle(): StrokeStyle | null {
        if (!this._stroke || this._strokeWidth <= 0) return null
        return {
            brush: this._stroke,
            width: this._strokeWidth,
            align: this._strokeAlign,
            lineCap: this._lineCap,
            lineJoin: this._lineJoin,
            miterLimit: this._miterLimit,
            dash: this._dash,
            dashOffset: this._dashOffset,
        }
    }

    /** 以当前样式构造一次性文本参数 */
    get textStyle(): TextStyle {
        return {
            fontFamily: this._fontFamily,
            fontSize: this._fontSize,
            fontStyle: this._fontStyle,
            fontWeight: this._fontWeight,
            textAlign: this._textAlign,
            textBaseline: this._textBaseline,
            lineHeight: this._lineHeight,
            letterSpacing: this._letterSpacing,
        }
    }

    /** 以当前样式构造一次性阴影参数；无阴影时返回 null */
    get shadowStyle(): ShadowStyle | null {
        if (this._shadowColor === null) return null
        return {
            color: this._shadowColor,
            blur: this._shadowBlur,
            offsetX: this._shadowOffsetX,
            offsetY: this._shadowOffsetY,
        }
    }

    // ==================== 复制 / 重置 ====================

    /**
     * 从另一 Paint 拷贝全部样式（画笔深拷贝，二者互不影响）。
     * 通过逐项赋值触发 change 事件，返回自身以便链式调用。
     */
    copy(other: Paint): this {
        return this.set({
            fill: other._fill ? cloneBrush(other._fill) : null,
            stroke: other._stroke ? cloneBrush(other._stroke) : null,
            strokeWidth: other._strokeWidth,
            lineCap: other._lineCap,
            lineJoin: other._lineJoin,
            miterLimit: other._miterLimit,
            dash: other._dash ? other._dash.slice() : null,
            dashOffset: other._dashOffset,
            fontFamily: other._fontFamily,
            fontSize: other._fontSize,
            fontStyle: other._fontStyle,
            fontWeight: other._fontWeight,
            textAlign: other._textAlign,
            textBaseline: other._textBaseline,
            lineHeight: other._lineHeight,
            letterSpacing: other._letterSpacing,
            blend: other._blend,
            filter: other._filter,
            shadowColor: other._shadowColor ? other._shadowColor.clone() : null,
            shadowBlur: other._shadowBlur,
            shadowOffsetX: other._shadowOffsetX,
            shadowOffsetY: other._shadowOffsetY,
            opacity: other._opacity,
            fillRule: other._fillRule,
            strokeAlign: other._strokeAlign,
            paintFirst: other._paintFirst,
        })
    }

    /** 克隆出一个独立的新 Paint */
    clone(): Paint {
        return new Paint().copy(this)
    }

    /** 恢复为默认样式（与 new Paint() 一致） */
    reset(): this {
        return this.copy(new Paint())
    }
}
