/**
 * Canvas2D 后端。
 *
 * 这是 `Renderer2D` 的语义基准：路径、描边对齐、渐变、混合、阴影、文字
 * 都直接交给浏览器 Canvas2D 处理，因此行为与原生 canvas 完全一致。
 * WebGL2 / WebGPU 后端在这些语义上以本实现为参照。
 */
import { Matrix2D } from '../math/Matrix2D'
import { Path2D as RecordedPath2D } from '../math/Path2D'
import type { IPath2DReadable } from '../math/Path2D'
import type { Vector2Like } from '../math/Vector2'
import { Color } from '../math/Color'
import { colorToCSS } from './Paint'
import type {
    BlendMode,
    FillRule,
    ImageSource,
    PaintColor,
    PaintSource,
    PatternPaint,
} from './Paint'
import {Paint} from './Paint'
import type { Renderer2D, TextMeasurement } from './Renderer2D'

const TAU = Math.PI * 2

type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

export interface CanvasRendererOptions {
    /** 逻辑像素比，默认 1（一般用 resize 指定） */
    pixelRatio?: number
}

export class CanvasRenderer implements Renderer2D {
    readonly canvas: HTMLCanvasElement | OffscreenCanvas

    private readonly _ctx: Ctx2D
    private _width = 0
    private _height = 0
    private _pixelRatio = 1
    private readonly _matrix = Matrix2D.identity()
    private readonly _path = new RecordedPath2D()
    private readonly _stack: Matrix2D[] = []

    constructor(canvas?: HTMLCanvasElement | OffscreenCanvas, options: CanvasRendererOptions = {}) {
        this.canvas = canvas ?? createCanvas(300, 150)
        const ctx = this.canvas.getContext('2d') as Ctx2D
        if (!ctx) throw new Error('CanvasRenderer: 无法创建 2d 上下文')
        this._ctx = ctx
        this._pixelRatio = options.pixelRatio ?? 1
        this._width = this.canvas.width / this._pixelRatio
        this._height = this.canvas.height / this._pixelRatio
        this._syncTransform()
    }

    // ============================================================
    // 基础属性
    // ============================================================

    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

    get pixelRatio(): number {
        return this._pixelRatio
    }

    get currentTransform(): Readonly<Matrix2D> {
        return this._matrix
    }

    resize(width: number, height: number, pixelRatio: number = this._pixelRatio): this {
        this._width = width
        this._height = height
        this._pixelRatio = pixelRatio
        this.canvas.width = Math.max(1, Math.round(width * pixelRatio))
        this.canvas.height = Math.max(1, Math.round(height * pixelRatio))
        this._syncTransform()
        return this
    }

    // ============================================================
    // 清屏
    // ============================================================

    clear(color?: PaintColor | null): void {
        const ctx = this._ctx
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'copy'
        ctx.shadowColor = 'transparent'
        ctx.filter = 'none'
        if (color == null) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        } else {
            ctx.fillStyle = colorToCSS(color)
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        }
        ctx.restore()
    }

    clearRect(x: number, y: number, width: number, height: number): void {
        this._ctx.clearRect(x, y, width, height)
    }

    // ============================================================
    // 变换栈
    // ============================================================

    save(): void {
        this._ctx.save()
        this._stack.push(this._matrix.clone())
    }

    restore(): void {
        if (this._stack.length === 0) return
        this._ctx.restore()
        const saved = this._stack.pop()!
        this._matrix.copy(saved)
        this._syncTransform()
    }

    resetTransform(): void {
        this._matrix.identity()
        this._syncTransform()
    }

    setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        this._matrix.fromValues(a, b, c, d, tx, ty)
        this._syncTransform()
    }

    transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        this._matrix.multiply(Matrix2D.fromValues(a, b, c, d, tx, ty))
        this._syncTransform()
    }

    getTransform(out?: Matrix2D): Matrix2D {
        if (out) {
            out.copy(this._matrix)
            return out
        }
        return this._matrix.clone()
    }

    translate(x: number, y: number): void {
        this._matrix.translate(x, y)
        this._syncTransform()
    }

    rotate(radians: number): void {
        this._matrix.rotate(radians)
        this._syncTransform()
    }

    scale(x: number, y: number = x): void {
        this._matrix.scale(x, y)
        this._syncTransform()
    }

    private _syncTransform(): void {
        const dpr = this._pixelRatio
        const m = this._matrix
        this._ctx.setTransform(
            m[0] * dpr,
            m[1] * dpr,
            m[2] * dpr,
            m[3] * dpr,
            m[4] * dpr,
            m[5] * dpr,
        )
    }

    // ============================================================
    // 当前路径（IPath2D）
    // ============================================================

    beginPath(): void {
        this._path.clear()
    }

    moveTo(x: number, y: number): void {
        this._path.moveTo(x, y)
    }

    lineTo(x: number, y: number): void {
        this._path.lineTo(x, y)
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this._path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this._path.quadraticCurveTo(cpx, cpy, x, y)
    }

    closePath(): void {
        this._path.closePath()
    }

    rect(x: number, y: number, w: number, h: number): void {
        this._path.rect(x, y, w, h)
    }

    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void {
        this._path.roundRect(x, y, w, h, radii)
    }

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this._path.arc(x, y, radius, startAngle, endAngle, !!counterclockwise)
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this._path.arcTo(x1, y1, x2, y2, radius)
    }

    ellipse(
        x: number,
        y: number,
        radiusX: number,
        radiusY: number,
        rotation: number,
        startAngle: number,
        endAngle: number,
        counterclockwise?: boolean,
    ): void {
        this._path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, !!counterclockwise)
    }

    clip(pathOrRule?: IPath2DReadable | FillRule, fillRule?: FillRule): void {
        const path = typeof pathOrRule === 'string' ? this._path : (pathOrRule ?? this._path)
        const rule: FillRule = typeof pathOrRule === 'string' ? pathOrRule : (fillRule ?? 'nonzero')
        this._ctx.clip(this._nativePath(path), rule)
    }

    // ============================================================
    // 图片
    // ============================================================

    drawImage(image: ImageSource, dx: number, dy: number, paint?: Paint): void
    drawImage(image: ImageSource, dx: number, dy: number, dw: number, dh: number, paint?: Paint): void
    drawImage(
        image: ImageSource,
        sx: number,
        sy: number,
        sw: number,
        sh: number,
        dx: number,
        dy: number,
        dw: number,
        dh: number,
        paint?: Paint,
    ): void
    drawImage(image: ImageSource, ...args: (number | Paint | undefined)[]): void {
        const tail = args[args.length - 1]
        let paint: Paint | undefined
        if (tail && typeof tail === 'object') {
            paint = args.pop() as Paint
        }
        const nums = args as number[]
        const size = imageSize(image)
        let sx = 0
        let sy = 0
        let sw = size.width
        let sh = size.height
        let dx = 0
        let dy = 0
        let dw = sw
        let dh = sh
        if (nums.length <= 2) {
            dx = nums[0] ?? 0
            dy = nums[1] ?? 0
        } else if (nums.length <= 4) {
            dx = nums[0] ?? 0
            dy = nums[1] ?? 0
            dw = nums[2] ?? sw
            dh = nums[3] ?? sh
        } else {
            sx = nums[0] ?? 0
            sy = nums[1] ?? 0
            sw = nums[2] ?? 0
            sh = nums[3] ?? 0
            dx = nums[4] ?? 0
            dy = nums[5] ?? 0
            dw = nums[6] ?? 0
            dh = nums[7] ?? 0
        }
        if (!dw || !dh) return

        const ctx = this._ctx
        ctx.save()
        this._applyPaintState(ctx, paint ?? Paint.DEFAULT)
        ctx.imageSmoothingEnabled = paint ? paint.imageSmoothing : true
        ctx.imageSmoothingQuality = paint ? paint.imageSmoothingQuality : 'low'
        ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
        ctx.restore()
    }

    // ============================================================
    // 路径与图元
    // ============================================================

    drawPath(path: IPath2DReadable, paint: Paint): void {
        this._paintPath(this._nativePath(path), paint)
    }

    drawRect(x: number, y: number, width: number, height: number, paint: Paint): void {
        const np = new globalThis.Path2D()
        np.rect(x, y, width, height)
        this._paintPath(np, paint)
    }

    drawRoundRect(x: number, y: number, width: number, height: number, radius: number | number[], paint: Paint): void {
        const np = new globalThis.Path2D()
        np.roundRect(x, y, width, height, radius)
        this._paintPath(np, paint)
    }

    drawEllipse(cx: number, cy: number, radiusX: number, radiusY: number, paint: Paint): void {
        this._paintPath(this._ellipsePath(cx, cy, radiusX, radiusY, 0, 0, TAU, false), paint)
    }

    drawEllipseArc(
        cx: number,
        cy: number,
        radiusX: number,
        radiusY: number,
        rotation: number,
        startAngle: number,
        endAngle: number,
        counterClockwise: boolean,
        paint: Paint,
    ): void {
        this._paintPath(
            this._ellipsePath(cx, cy, radiusX, radiusY, rotation, startAngle, endAngle, counterClockwise),
            paint,
        )
    }

    drawCircle(cx: number, cy: number, radius: number, paint: Paint): void {
        this._paintPath(this._ellipsePath(cx, cy, radius, radius, 0, 0, TAU, false), paint)
    }

    drawArc(
        cx: number,
        cy: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        counterClockwise: boolean,
        paint: Paint,
    ): void {
        const np = new globalThis.Path2D()
        np.arc(cx, cy, radius, startAngle, endAngle, counterClockwise)
        this._paintPath(np, paint)
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, paint: Paint): void {
        const np = new globalThis.Path2D()
        np.moveTo(x1, y1)
        np.lineTo(x2, y2)
        this._paintPath(np, paint)
    }

    drawPolyline(points: Vector2Like[], paint: Paint, closed = false): void {
        if (!points || points.length === 0) return
        const np = new globalThis.Path2D()
        np.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) np.lineTo(points[i].x, points[i].y)
        if (closed || points.length > 2) np.closePath()
        this._paintPath(np, paint)
    }

    private _ellipsePath(
        cx: number,
        cy: number,
        rx: number,
        ry: number,
        rotation: number,
        startAngle: number,
        endAngle: number,
        counterClockwise: boolean,
    ): Path2D {
        const np = new globalThis.Path2D()
        np.ellipse(cx, cy, rx, ry, rotation, startAngle, endAngle, counterClockwise)
        return np
    }

    // ============================================================
    // 文字
    // ============================================================

    drawText(text: string, x: number, y: number, paint: Paint): void {
        if (!text) return
        const ctx = this._ctx
        ctx.save()
        this._applyPaintState(ctx, paint)
        this._applyTextState(ctx, paint)
        const lines = text.split('\n')
        const lineHeight = textLineHeight(paint)
        const maxWidth = paint.text.maxWidth

        const fill = () => {
            if (!paint.fill) return
            ctx.fillStyle = this._makeStyle(paint.fill)
            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], x, y + i * lineHeight, maxWidth)
            }
        }
        const stroke = () => {
            if (!paint.stroke) return
            ctx.strokeStyle = this._makeStyle(paint.stroke)
            ctx.lineWidth = paint.lineWidth
            ctx.lineCap = paint.lineCap
            ctx.lineJoin = paint.lineJoin
            ctx.miterLimit = paint.miterLimit
            ctx.setLineDash(paint.lineDash)
            ctx.lineDashOffset = paint.lineDashOffset
            for (let i = 0; i < lines.length; i++) {
                ctx.strokeText(lines[i], x, y + i * lineHeight, maxWidth)
            }
        }

        if (paint.paintOrder === 'stroke-fill') {
            stroke()
            fill()
        } else {
            fill()
            stroke()
        }
        ctx.restore()
    }

    measureText(text: string, paint: Paint): TextMeasurement {
        const ctx = this._ctx
        ctx.save()
        this._applyTextState(ctx, paint)
        const lines = text ? text.split('\n') : ['']
        const size = paint.text.size ?? 16
        let width = 0
        let ascent = 0
        let descent = 0
        for (const line of lines) {
            const metrics = ctx.measureText(line || ' ')
            width = Math.max(width, metrics.width)
            ascent = Math.max(ascent, metrics.actualBoundingBoxAscent ?? size * 0.8)
            descent = Math.max(descent, metrics.actualBoundingBoxDescent ?? size * 0.2)
        }
        ctx.restore()
        const lineHeight = textLineHeight(paint)
        return {
            width,
            height: lineHeight * lines.length,
            ascent,
            descent,
            lineHeight,
            lines: lines.length,
        }
    }

    private _applyTextState(ctx: Ctx2D, paint: Paint): void {
        const t = paint.text
        ctx.font = fontString(t)
        ctx.textAlign = t.align ?? 'left'
        ctx.textBaseline = t.baseline ?? 'alphabetic'
        ctx.direction = t.direction ?? 'inherit'
        if (t.letterSpacing !== undefined) {
            // letterSpacing 属于较新的 CanvasTextDrawingStyles 成员
            ;(ctx as unknown as { letterSpacing?: string }).letterSpacing = `${t.letterSpacing}px`
        }
    }

    // ============================================================
    // 绘制内部实现
    // ============================================================

    private _nativePath(path: IPath2DReadable): Path2D {
        const np = new globalThis.Path2D()
        path.visit({
            moveTo: (c) => np.moveTo(c.x, c.y),
            lineTo: (c) => np.lineTo(c.x, c.y),
            bezierCurveTo: (c) => np.bezierCurveTo(c.cp1x, c.cp1y, c.cp2x, c.cp2y, c.x, c.y),
            quadraticCurveTo: (c) => np.quadraticCurveTo(c.cpx, c.cpy, c.x, c.y),
            closePath: () => np.closePath(),
            rect: (c) => np.rect(c.x, c.y, c.w, c.h),
            roundRect: (c) => np.roundRect(c.x, c.y, c.w, c.h, c.radii),
            arc: (c) => np.arc(c.x, c.y, c.radius, c.startAngle, c.endAngle, c.counterclockwise),
            arcTo: (c) => np.arcTo(c.x1, c.y1, c.x2, c.y2, c.radius),
            ellipse: (c) =>
                np.ellipse(c.x, c.y, c.radiusX, c.radiusY, c.rotation, c.startAngle, c.endAngle, c.counterclockwise),
        })
        return np
    }

    private _paintPath(np: Path2D, paint: Paint): void {
        const ctx = this._ctx
        ctx.save()
        this._applyPaintState(ctx, paint)

        const drawFill = () => {
            if (!paint.fill) return
            ctx.fillStyle = this._makeStyle(paint.fill)
            ctx.fill(np, paint.fillRule)
        }
        const drawStroke = () => {
            if (!paint.stroke) return
            this._strokePath(np, paint)
        }

        if (paint.paintOrder === 'stroke-fill') {
            drawStroke()
            drawFill()
        } else {
            drawFill()
            drawStroke()
        }
        ctx.restore()
    }

    /** 按 strokeAlign 绘制描边：inside/outside 用 clip + 双倍线宽近似 */
    private _strokePath(np: Path2D, paint: Paint): void {
        const ctx = this._ctx
        const align = paint.strokeAlign
        if (align === 'center') {
            this._strokeStyle(ctx, paint)
            ctx.stroke(np)
            return
        }

        ctx.save()
        if (align === 'inside') {
            ctx.clip(np, paint.fillRule)
        } else {
            const b = this._localViewport()
            const complement = new globalThis.Path2D()
            complement.rect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0)
            complement.addPath(np)
            ctx.clip(complement, 'evenodd')
        }
        this._strokeStyle(ctx, paint)
        ctx.stroke(np)
        ctx.restore()
    }

    private _strokeStyle(ctx: Ctx2D, paint: Paint): void {
        ctx.strokeStyle = this._makeStyle(paint.stroke)
        ctx.lineWidth = paint.strokeAlign === 'center' ? paint.lineWidth : paint.lineWidth * 2
        ctx.lineCap = paint.lineCap
        ctx.lineJoin = paint.lineJoin
        ctx.miterLimit = paint.miterLimit
        ctx.setLineDash(paint.lineDash)
        ctx.lineDashOffset = paint.lineDashOffset
    }

    private _applyPaintState(ctx: Ctx2D, paint: Paint): void {
        ctx.globalAlpha = paint.opacity
        ctx.globalCompositeOperation = paint.blend as GlobalCompositeOperation
        ctx.filter = paint.filter ?? 'none'
        const shadow = paint.shadow
        if (shadow) {
            ctx.shadowColor = colorToCSS(shadow.color ?? Color.BLACK)
            ctx.shadowBlur = shadow.blur ?? 0
            ctx.shadowOffsetX = shadow.offsetX ?? 0
            ctx.shadowOffsetY = shadow.offsetY ?? 0
        } else {
            ctx.shadowColor = 'transparent'
            ctx.shadowBlur = 0
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0
        }
    }

    private _makeStyle(source: PaintSource): string | CanvasGradient | CanvasPattern {
        if (typeof source === 'string') return source
        if (source instanceof Color) return source.toRGBAString()
        if (source.type === 'pattern') return this._makePattern(source)
        return this._makeGradient(source)
    }

    private _makeGradient(
        source: Exclude<PaintSource, string | Color | PatternPaint>,
    ): string | CanvasGradient {
        const ctx = this._ctx
        const stops = [...source.stops].sort((a, b) => a.offset - b.offset)
        let gradient: CanvasGradient
        if (source.type === 'linear-gradient') {
            gradient = ctx.createLinearGradient(source.x0, source.y0, source.x1, source.y1)
        } else if (source.type === 'radial-gradient') {
            gradient = ctx.createRadialGradient(source.x0, source.y0, Math.max(0, source.r0), source.x1, source.y1, Math.max(0, source.r1))
        } else {
            const createConic = (ctx as unknown as {
                createConicGradient?: (angle: number, x: number, y: number) => CanvasGradient
            }).createConicGradient
            if (typeof createConic !== 'function') {
                return stops.length > 0 ? colorToCSS(stops[0].color) : 'transparent'
            }
            gradient = createConic.call(ctx, source.startAngle, source.x, source.y)
        }
        for (const s of stops) {
            gradient.addColorStop(clamp01(s.offset), colorToCSS(s.color))
        }
        return gradient
    }

    private _makePattern(source: PatternPaint): CanvasPattern | string {
        const pattern = this._ctx.createPattern(source.image, source.repetition ?? 'repeat')
        if (!pattern) {
            return typeof source.image === 'string' ? source.image : 'transparent'
        }
        const transform = source.transform
        if (transform && typeof pattern.setTransform === 'function' && typeof DOMMatrix !== 'undefined') {
            pattern.setTransform(new DOMMatrix([transform[0], transform[1], transform[2], transform[3], transform[4], transform[5]]))
        }
        return pattern
    }

    /** 当前视口在用户坐标系下的包围盒，用于构造 outside 描边的补集裁剪路径 */
    private _localViewport(): { x0: number; y0: number; x1: number; y1: number } {
        const dpr = this._pixelRatio
        const device = Matrix2D.from(this._matrix)
        device.scale(dpr, dpr)
        const w = this.canvas.width
        const h = this.canvas.height
        if (Math.abs(device.determinant()) < 1e-12) {
            return { x0: -1e6, y0: -1e6, x1: 1e6, y1: 1e6 }
        }
        const inverse = Matrix2D.identity()
        Matrix2D.invert(inverse, device)
        const out = { x: 0, y: 0 }
        let x0 = Infinity
        let y0 = Infinity
        let x1 = -Infinity
        let y1 = -Infinity
        const corners = [
            [0, 0],
            [w, 0],
            [0, h],
            [w, h],
        ]
        for (const [px, py] of corners) {
            out.x = px
            out.y = py
            Matrix2D.mapPoint(out, inverse, out)
            x0 = Math.min(x0, out.x)
            y0 = Math.min(y0, out.y)
            x1 = Math.max(x1, out.x)
            y1 = Math.max(y1, out.y)
        }
        return { x0, y0, x1, y1 }
    }

    flush(): void {
        // Canvas2D 提交是隐式的，这里无需处理
    }

    dispose(): void {
        this._stack.length = 0
        this._path.clear()
    }
}

// ============================================================
// 工具
// ============================================================

export function createCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas {
    if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        return canvas
    }
    if (typeof OffscreenCanvas !== 'undefined') {
        return new OffscreenCanvas(width, height)
    }
    throw new Error('CanvasRenderer: 当前环境没有可用的 canvas 实现')
}

export function fontString(text: Paint['text']): string {
    const style = text.style ?? 'normal'
    const weight = text.weight ?? 400
    const size = text.size ?? 16
    const family = text.family ?? 'sans-serif'
    return `${style} ${weight} ${size}px ${family}`
}

export function textLineHeight(paint: Paint): number {
    return paint.text.lineHeight ?? (paint.text.size ?? 16) * 1.2
}

/** 取图片源的自然尺寸（CanvasImageSource 没有统一的宽高字段） */
export function imageSize(image: ImageSource): { width: number; height: number } {
    const anyImage = image as unknown as {
        naturalWidth?: number
        naturalHeight?: number
        videoWidth?: number
        videoHeight?: number
        displayWidth?: number
        displayHeight?: number
        width?: number
        height?: number
        codedWidth?: number
        codedHeight?: number
    }
    const width =
        anyImage.naturalWidth ??
        anyImage.videoWidth ??
        anyImage.displayWidth ??
        anyImage.codedWidth ??
        anyImage.width ??
        0
    const height =
        anyImage.naturalHeight ??
        anyImage.videoHeight ??
        anyImage.displayHeight ??
        anyImage.codedHeight ??
        anyImage.height ??
        0
    return { width, height }
}

function clamp01(value: number): number {
    return value < 0 ? 0 : value > 1 ? 1 : value
}
