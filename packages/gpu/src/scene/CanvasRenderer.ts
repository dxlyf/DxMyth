// ============================================================
// CanvasRenderer — 基于 CanvasRenderingContext2D 的渲染器实现
//
// 将渲染器无关的绘制契约（RenderContext）映射到 Canvas 2D API：
//   - 状态管理：save/restore → ctx.save/restore；transform → ctx.transform；
//     setTransform/getTransform/resetTransform 在 dpr 基准上换算
//   - 裁剪与清屏：clipRect → rect + clip；setClearColor 预设色，clear → fillRect
//   - 路径原语：beginPath / moveTo / lineTo / rect / circle / arc ... 直映射
//   - 带 Paint 的绘制：drawRect / drawLine / drawCircle / drawEllipse /
//     drawPath / drawText / drawPaint
//
// 样式应用（Paint）：
//   opacity → globalAlpha；blend → globalCompositeOperation（normal 映射 source-over）
//   filter → ctx.filter；shadow* → ctx.shadow*；fillRule → ctx.fill
//   strokeStyle → lineWidth/lineCap/lineJoin/miterLimit/setLineDash
//   paintFirst 决定填充与描边的先后顺序
//
// 画笔映射：
//   Color → rgba() 字符串
//   LinearGradient / RadialGradient / ConicGradient → CanvasGradient
//   Pattern → CanvasPattern（可选 setTransform）
//
// 设备像素比：后备缓冲按 dpr 放大（canvas.width/height），
// 基准变换固定为 setTransform(dpr,0,0,dpr,0,0)，绘制坐标始终为逻辑像素。
//
// 继承链：Renderer（抽象）→ CanvasRenderer
// ============================================================

import { Color, type ColorInput } from '../math/Color'
import { ConicGradient, Gradient, LinearGradient, RadialGradient } from '../math/Gradient'
import type { Matrix2DLike } from '../math/Matrix2D'
import type { PathBuilder } from '../math/PathBuilder'
import { Pattern } from '../math/Pattern'
import { LineCap, LineJoin, type Paint, type ResolvedBrush } from './Paint'
import { Renderer, type RendererOptions } from './Renderer'

const TWO_PI = Math.PI * 2

export interface CanvasRendererOptions extends RendererOptions {
    /** 目标画布；与 context 同时提供时以 context 为准 */
    canvas?: HTMLCanvasElement | null
    /** 已有的 2D 上下文；提供后不再自行创建画布 */
    context?: CanvasRenderingContext2D | null
}

/** Canvas 画笔类型：颜色字符串 / 渐变 / 图案 */
type CanvasBrush = string | CanvasGradient | CanvasPattern

export class CanvasRenderer extends Renderer {

    /** 目标画布 */
    readonly canvas: HTMLCanvasElement
    /** 2D 绘制上下文 */
    readonly ctx: CanvasRenderingContext2D

    /** 清屏颜色（CSS 字符串），由 setClearColor 预设 */
    private _clearColor: string = 'rgba(0,0,0,0)'

    constructor(options: CanvasRendererOptions = {}) {
        super(options)

        let canvas = options.canvas ?? null
        let ctx = options.context ?? null

        if (!ctx) {
            if (!canvas) canvas = document.createElement('canvas')
            ctx = canvas.getContext('2d')
        }
        if (!canvas) {
            canvas = ctx.canvas
        }

        this.canvas = canvas
        this.ctx = ctx

        // 未显式指定逻辑尺寸时，从画布当前像素尺寸按 dpr 反推
        if (this.width <= 0) this.width = this.canvas.width / this.dpr
        if (this.height <= 0) this.height = this.canvas.height / this.dpr

        this.onResize(this.width, this.height, this.dpr)
    }

    // ==================== 后端钩子 ====================

    /** 按 dpr 同步后备缓冲尺寸（逻辑尺寸不变，绘制坐标仍为逻辑像素） */
    protected onResize(width: number, height: number, dpr: number): void {
        const w = Math.max(1, Math.round(width * dpr))
        const h = Math.max(1, Math.round(height * dpr))
        if (this.canvas.width !== w) this.canvas.width = w
        if (this.canvas.height !== h) this.canvas.height = h
    }

    /** 每帧开始：重置基准变换与绘制状态，清屏 */
    protected beginFrame(): void {
        const ctx = this.ctx
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
        ctx.filter = 'none'
        this._clearShadow()

        if (this.background) {
            ctx.fillStyle = this.background.toRGBAString()
            ctx.fillRect(0, 0, this.width, this.height)
        } else {
            ctx.clearRect(0, 0, this.width, this.height)
        }
    }

    // ==================== 状态管理 ====================

    save(): void {
        this.ctx.save()
    }

    restore(): void {
        this.ctx.restore()
    }

    transform(matrix: Matrix2DLike): void {
        this.ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5])
    }

    /** 用给定矩阵替换当前变换（左乘 dpr 基准，使逻辑变换独立于设备像素比） */
    setTransform(matrix: Matrix2DLike): void {
        const d = this.dpr
        this.ctx.setTransform(
            d * matrix[0], d * matrix[1], d * matrix[2],
            d * matrix[3], d * matrix[4], d * matrix[5],
        )
    }

    /** 读取当前变换（去除 dpr 基准，返回逻辑变换） */
    getTransform(): Matrix2DLike {
        const m = this.ctx.getTransform()
        const d = this.dpr
        return [m.a / d, m.b / d, m.c / d, m.d / d, m.e / d, m.f / d]
    }

    /** 重置为基准变换（单位变换 × dpr） */
    resetTransform(): void {
        const d = this.dpr
        this.ctx.setTransform(d, 0, 0, d, 0, 0)
    }

    // ==================== 裁剪与清屏 ====================

    clipRect(x: number, y: number, width: number, height: number): void {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.rect(x, y, width, height)
        ctx.clip()
    }

    /** 预设清屏颜色（供 clear 使用） */
    setClearColor(color: ColorInput): void {
        this._clearColor = Color.toCSS_RGBA(Color.fromInput(color))
    }

    /** 用预设清屏颜色清空整个表面（忽略当前变换、保留既有裁剪） */
    clear(): void {
        const ctx = this.ctx
        ctx.save()
        const d = this.dpr
        ctx.setTransform(d, 0, 0, d, 0, 0)
        ctx.fillStyle = this._clearColor
        ctx.fillRect(0, 0, this.width, this.height)
        ctx.restore()
    }

    // ==================== 路径原语 ====================

    beginPath(): void {
        this.ctx.beginPath()
    }

    moveTo(x: number, y: number): void {
        this.ctx.moveTo(x, y)
    }

    lineTo(x: number, y: number): void {
        this.ctx.lineTo(x, y)
    }

    quadraticCurveTo(cp1: number, cp1y: number, x: number, y: number): void {
        this.ctx.quadraticCurveTo(cp1, cp1y, x, y)
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }

    rect(x: number, y: number, width: number, height: number): void {
        this.ctx.rect(x, y, width, height)
    }

    /** 追加整圆子路径（先 moveTo 到起点，避免与当前点连线） */
    circle(x: number, y: number, radius: number): void {
        const ctx = this.ctx
        ctx.moveTo(x + radius, y)
        ctx.ellipse(x, y, radius, radius, 0, 0, TWO_PI)
    }

    /** 追加整椭圆子路径 */
    ellipse(x: number, y: number, rx: number, ry: number): void {
        const ctx = this.ctx
        ctx.moveTo(x + rx, y)
        ctx.ellipse(x, y, rx, ry, 0, 0, TWO_PI)
    }

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.ctx.arcTo(x1, y1, x2, y2, radius)
    }

    ellipseArc(x: number, y: number, rx: number, ry: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
        this.ctx.ellipse(x, y, rx, ry, rotation, startAngle, endAngle, anticlockwise)
    }

    closePath(): void {
        this.ctx.closePath()
    }

    // ==================== 图像绘制 ====================

    drawImage(image: CanvasImageSource, dx: number, dy: number): void
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void
    drawImage(image: CanvasImageSource, ...args: number[]): void {
        ;(this.ctx.drawImage as (...a: unknown[]) => void)(image, ...args)
    }

    // ==================== 带 Paint 的绘制 ====================

    drawRect(x: number, y: number, width: number, height: number, paint: Paint): void {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.rect(x, y, width, height)
        this._paintPath(paint)
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, paint: Paint): void {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        this._paintPath(paint)
    }

    drawCircle(x: number, y: number, radius: number, paint: Paint): void {
        this.beginPath()
        this.circle(x, y, radius)
        this._paintPath(paint)
    }

    drawEllipse(x: number, y: number, rx: number, ry: number, paint: Paint): void {
        this.beginPath()
        this.ellipse(x, y, rx, ry)
        this._paintPath(paint)
    }

    drawPath(path: PathBuilder, paint: Paint): void {
        if (!path || path.isEmpty) return
        const ctx = this.ctx
        ctx.beginPath()
        path.applyContext(ctx)
        this._paintPath(paint)
    }

    drawText(text: string, x: number, y: number, paint: Paint): void {
        if (!text) return
        const ctx = this.ctx
        const t = paint.textStyle
        ctx.save()
        ctx.font = `${t.fontStyle} ${t.fontWeight} ${t.fontSize}px ${t.fontFamily}`
        ctx.textAlign = t.textAlign as CanvasTextAlign
        ctx.textBaseline = t.textBaseline as CanvasTextBaseline
        ;(ctx as any).letterSpacing = `${t.letterSpacing}px`

        this._applyPaint(paint)
        const fill = paint.fill
        if (fill) {
            ctx.fillStyle = this._toCanvasBrush(fill, ctx)
            ctx.fillText(text, x, y)
        }
        const style = paint.strokeStyle
        if (style) {
            this._applyStroke(style)
            ctx.strokeText(text, x, y)
        }
        ctx.restore()
    }

    /** 以 paint 处理由路径原语累积的当前路径 */
    drawPaint(paint: Paint): void {
        this._paintPath(paint)
    }

    // ==================== 内部：样式应用 ====================

    /** 应用 Paint 的通用绘制状态（透明度/混合/滤镜/阴影） */
    private _applyPaint(paint: Paint): void {
        const ctx = this.ctx
        const a = paint.opacity
        ctx.globalAlpha = a < 0 ? 0 : a > 1 ? 1 : a
        ctx.globalCompositeOperation = (paint.blend === 'normal' ? 'source-over' : paint.blend) as GlobalCompositeOperation
        ctx.filter = paint.filter ?? 'none'

        const shadow = paint.shadowStyle
        if (shadow) {
            ctx.shadowColor = Color.toCSS_RGBA(shadow.color)
            ctx.shadowBlur = shadow.blur
            ctx.shadowOffsetX = shadow.offsetX
            ctx.shadowOffsetY = shadow.offsetY
        } else {
            this._clearShadow()
        }
    }

    /** 清除阴影设置 */
    private _clearShadow(): void {
        const ctx = this.ctx
        ctx.shadowColor = 'rgba(0,0,0,0)'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
    }

    /** 按 paintFirst 对当前路径执行填充与描边 */
    private _paintPath(paint: Paint): void {
        this._applyPaint(paint)
        if (paint.paintFirst === 'stroke') {
            this._stroke(paint)
            this._fill(paint)
        } else {
            this._fill(paint)
            this._stroke(paint)
        }
    }

    /** 以 paint 的填充画笔填充当前路径 */
    private _fill(paint: Paint): void {
        const fill = paint.fill
        if (!fill) return
        const ctx = this.ctx
        ctx.fillStyle = this._toCanvasBrush(fill, ctx)
        ctx.fill(paint.fillRule)
    }

    /** 以 paint 的描边样式描边当前路径 */
    private _stroke(paint: Paint): void {
        const style = paint.strokeStyle
        if (!style) return
        this._applyStroke(style)
        this.ctx.stroke()
    }

    /** 写入描边参数（不含 stroke 调用） */
    private _applyStroke(style: { brush: ResolvedBrush; width: number; lineCap?: LineCap; lineJoin?: LineJoin; miterLimit?: number; dash?: readonly number[] | null; dashOffset?: number }): void {
        const ctx = this.ctx
        ctx.strokeStyle = this._toCanvasBrush(style.brush, ctx)
        ctx.lineWidth = style.width
        ctx.lineCap = (style.lineCap ?? LineCap.Butt) as CanvasLineCap
        ctx.lineJoin = (style.lineJoin ?? LineJoin.Miter) as CanvasLineJoin
        ctx.miterLimit = style.miterLimit ?? 10
        ctx.setLineDash(style.dash ? style.dash.slice() : [])
        ctx.lineDashOffset = style.dashOffset ?? 0
    }

    // ==================== 画笔映射 ====================

    /** ResolvedBrush → Canvas 画笔 */
    private _toCanvasBrush(brush: ResolvedBrush, ctx: CanvasRenderingContext2D): CanvasBrush {
        if (brush instanceof Color) {
            return brush.toRGBAString()
        }
        if (brush instanceof Gradient) {
            return this._toCanvasGradient(brush, ctx)
        }
        if (brush instanceof Pattern) {
            return this._toCanvasPattern(brush, ctx)
        }
        return 'rgba(0,0,0,1)'
    }

    /** Gradient → CanvasGradient（Conic 需后端支持，不支持则退化为纯色） */
    private _toCanvasGradient(gradient: Gradient, ctx: CanvasRenderingContext2D): CanvasBrush {
        let cg: CanvasGradient | null = null

        if (gradient instanceof LinearGradient) {
            cg = ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1)
        } else if (gradient instanceof RadialGradient) {
            cg = ctx.createRadialGradient(
                gradient.x0, gradient.y0, gradient.r0,
                gradient.x1, gradient.y1, gradient.r1,
            )
        } else if (gradient instanceof ConicGradient) {
            const createConic = (ctx as any).createConicGradient
            if (typeof createConic === 'function') {
                cg = ctx.createConicGradient(gradient.startAngle, gradient.x, gradient.y)
            }
        }

        if (!cg) {
            // 退化：使用首个色标的颜色
            const first = gradient.stops[0]
            return first ? Color.toCSS_RGBA(first.color) : 'rgba(0,0,0,1)'
        }

        for (let i = 0; i < gradient.stops.length; i++) {
            const stop = gradient.stops[i]
            const offset = stop.offset < 0 ? 0 : stop.offset > 1 ? 1 : stop.offset
            cg.addColorStop(offset, Color.toCSS_RGBA(stop.color))
        }
        return cg
    }

    /** Pattern → CanvasPattern（可选 matrix 变换；无源或创建失败退化为透明） */
    private _toCanvasPattern(pattern: Pattern, ctx: CanvasRenderingContext2D): CanvasBrush {
        const source = pattern.source
        if (!source) return 'rgba(0,0,0,0)'

        const cp = ctx.createPattern(source, pattern.repeat ?? 'repeat')
        if (!cp) return 'rgba(0,0,0,0)'

        const m = pattern.matrix
        if (m && typeof (cp as any).setTransform === 'function') {
            ;(cp as any).setTransform(new DOMMatrix([m[0], m[1], m[2], m[3], m[4], m[5]]))
        }
        return cp
    }
}
