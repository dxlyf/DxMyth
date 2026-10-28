/**
 * WebGL2 / WebGPU 后端的共用基类。
 *
 * 两个 GPU 后端与 Canvas2D 的差别在于：路径必须自己变成三角形。
 * 这一层负责所有与具体图形 API 无关的工作：
 *
 *   - 变换栈、clip 层级记账（真正的裁剪由后端用 stencil 实现）
 *   - 当前路径累积、路径几何缓存（按对象 + version 失效）
 *   - fill / stroke 的展开与 paintOrder、strokeAlign 处理
 *   - 渐变参数打包、混合模式映射
 *   - 文字栅格化（离屏 2D canvas → 纹理）与图片参数归一
 *
 * 子类只需要把三角形和纹理真正提交给 GPU。
 */
import { Matrix2D } from '../math/Matrix2D'
import { Path2D as RecordedPath2D } from '../math/Path2D'
import type { IPath2DReadable } from '../math/Path2D'
import type { Vector2Like } from '../math/Vector2'
import { Color } from '../math/Color'
import { EMPTY_MESH, flattenPath, isEmptyMesh, tessellateFill, tessellateStroke } from './geometry'
import type { Mesh2D, PathContour } from './geometry'
import { createCanvas, fontString, imageSize, textLineHeight } from './CanvasRenderer'
import type {
    BlendMode,
    FillRule,
    GradientStop,
    ImageSource,
    Paint,
    PaintColor,
    PaintSource,
} from './Paint'
import type { Renderer2D, TextMeasurement } from './Renderer2D'

const TAU = Math.PI * 2

/** 渐变在 shader 中最多支持的 stop 数量，超出会做线性下采样 */
export const MAX_GRADIENT_STOPS = 8

export interface Rect {
    x: number
    y: number
    width: number
    height: number
}

/** 纹理采样区域，取值 0..1 */
export interface UvRect {
    u0: number
    v0: number
    u1: number
    v1: number
}

export interface GPU2DRendererOptions {
    /** 逻辑像素比，默认 1 */
    pixelRatio?: number
}

// ============================================================
// 渐变参数
// ============================================================

/**
 * 与具体 GPU API 无关的渐变 uniform 数据。
 *
 * `kind`：0 纯色 / 1 线性 / 2 径向 / 3 锥形。
 * `params0`、`params1` 均为 vec4，含义随 kind 变化，
 * 与 `paint.fragment` 中约定的一致。
 */
export interface GradientUniforms {
    kind: number
    params0: Float32Array
    params1: Float32Array
    colors: Float32Array
    offsets: Float32Array
    count: number
}

/** 把 PaintSource 打包成 shader uniform；pattern 由纹理程序处理，返回 null */
export function resolveGradient(source: PaintSource): GradientUniforms | null {
    if (typeof source === 'string' || source instanceof Color) {
        const c = toRGBA(source)
        return {
            kind: 0,
            params0: new Float32Array([c[0], c[1], c[2], c[3]]),
            params1: new Float32Array(4),
            colors: new Float32Array(MAX_GRADIENT_STOPS * 4),
            offsets: new Float32Array(MAX_GRADIENT_STOPS),
            count: 0,
        }
    }
    if (source.type === 'pattern') return null

    if (source.type === 'linear-gradient') {
        const stops = normalizeStops(source.stops)
        return {
            kind: 1,
            params0: new Float32Array([source.x0, source.y0, source.x1, source.y1]),
            params1: new Float32Array(4),
            ...stops,
        }
    }
    if (source.type === 'radial-gradient') {
        const stops = normalizeStops(source.stops)
        return {
            kind: 2,
            params0: new Float32Array([source.x0, source.y0, Math.max(0, source.r0), 0]),
            params1: new Float32Array([source.x1, source.y1, Math.max(0, source.r1), 0]),
            ...stops,
        }
    }
    const stops = normalizeStops(source.stops)
    return {
        kind: 3,
        params0: new Float32Array([source.x, source.y, source.startAngle, 0]),
        params1: new Float32Array(4),
        ...stops,
    }
}

function normalizeStops(stops: readonly GradientStop[]): {
    colors: Float32Array
    offsets: Float32Array
    count: number
} {
    const list = (stops ?? [])
        .map((s) => ({ offset: clamp01(s.offset), rgba: toRGBA(s.color) }))
        .sort((a, b) => a.offset - b.offset)
    if (list.length === 0) list.push({ offset: 0, rgba: [0, 0, 0, 0] })

    const count = Math.min(MAX_GRADIENT_STOPS, list.length)
    const colors = new Float32Array(MAX_GRADIENT_STOPS * 4)
    const offsets = new Float32Array(MAX_GRADIENT_STOPS)
    const downsample = count < list.length
    for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0 : i / (count - 1)
        const rgba = downsample ? sampleStops(list, t) : list[i].rgba
        offsets[i] = downsample ? t : list[i].offset
        colors[i * 4] = rgba[0]
        colors[i * 4 + 1] = rgba[1]
        colors[i * 4 + 2] = rgba[2]
        colors[i * 4 + 3] = rgba[3]
    }
    return { colors, offsets, count }
}

function sampleStops(
    list: readonly { offset: number; rgba: number[] }[],
    t: number,
): number[] {
    if (list.length === 0) return [0, 0, 0, 0]
    if (t <= list[0].offset) return list[0].rgba
    for (let i = 1; i < list.length; i++) {
        if (t <= list[i].offset) {
            const span = list[i].offset - list[i - 1].offset || 1e-6
            const k = (t - list[i - 1].offset) / span
            const a = list[i - 1].rgba
            const b = list[i].rgba
            return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k]
        }
    }
    return list[list.length - 1].rgba
}

function toRGBA(color: PaintColor): number[] {
    if (typeof color === 'string') {
        const parsed = Color.fromInput(color)
        return [parsed[0], parsed[1], parsed[2], parsed[3] ?? 1]
    }
    return [color[0], color[1], color[2], color[3] ?? 1]
}

/** 取 PaintSource 的代表色，文字栅格化时用于近似渐变 / pattern */
export function sourceColorCSS(source: PaintSource): string {
    if (typeof source === 'string') return source
    if (source instanceof Color) return source.toRGBAString()
    if (source.type === 'pattern') return '#000'
    return source.stops.length > 0 ? sourceColorCSS(source.stops[0].color) : 'transparent'
}

// ============================================================
// 混合模式
// ============================================================

export type BlendFactorToken =
    | 'zero'
    | 'one'
    | 'src-color'
    | 'one-minus-src-color'
    | 'src-alpha'
    | 'one-minus-src-alpha'
    | 'dst-color'
    | 'one-minus-dst-color'
    | 'dst-alpha'
    | 'one-minus-dst-alpha'

export interface BlendState {
    equation: 'add' | 'min' | 'max'
    src: BlendFactorToken
    dst: BlendFactorToken
    srcAlpha: BlendFactorToken
    dstAlpha: BlendFactorToken
}

/**
 * 把 Canvas globalCompositeOperation 映射成可分离混合。
 *
 * 可分离模式（source-over / multiply / screen / ...）是精确的，
 * 依赖 shader 的模式（hue / saturation / color / luminosity / overlay 等）
 * 退化为 source-over，保证在各后端上与 Canvas 结果大致一致。
 */
export function resolveBlend(mode: BlendMode): BlendState {
    const state: BlendState = {
        equation: 'add',
        src: 'src-alpha',
        dst: 'one-minus-src-alpha',
        srcAlpha: 'one',
        dstAlpha: 'one-minus-src-alpha',
    }
    switch (mode) {
        case 'source-over':
            return state
        case 'source-in':
            return { ...state, src: 'dst-alpha', dst: 'zero' }
        case 'source-out':
            return { ...state, src: 'one-minus-dst-alpha', dst: 'zero' }
        case 'source-atop':
            return { ...state, src: 'dst-alpha', dst: 'one-minus-src-alpha' }
        case 'destination-over':
            return { ...state, src: 'one-minus-dst-alpha', dst: 'one' }
        case 'destination-in':
            return { ...state, src: 'zero', dst: 'src-alpha' }
        case 'destination-out':
            return { ...state, src: 'zero', dst: 'one-minus-src-alpha' }
        case 'destination-atop':
            return { ...state, src: 'one-minus-dst-alpha', dst: 'src-alpha' }
        case 'lighter':
            return { ...state, src: 'one', dst: 'one' }
        case 'copy':
            return { ...state, src: 'one', dst: 'zero' }
        case 'xor':
            return { ...state, src: 'one-minus-dst-alpha', dst: 'one-minus-src-alpha' }
        case 'multiply':
            return { ...state, src: 'dst-color', dst: 'one-minus-src-alpha' }
        case 'screen':
            return { ...state, src: 'one', dst: 'one-minus-src-color' }
        case 'darken':
            return { ...state, equation: 'min', src: 'one', dst: 'one' }
        case 'lighten':
            return { ...state, equation: 'max', src: 'one', dst: 'one' }
        default:
            return state
    }
}

// ============================================================
// 几何缓存
// ============================================================

interface GeometryEntry {
    version: number
    contours: PathContour[]
    fills: Map<FillRule, Mesh2D>
    strokes: Map<string, Mesh2D>
    /** strokeAlign 需要的裁剪几何（路径本身或补集） */
    clips: Map<string, Mesh2D>
}

interface SavedState {
    matrix: Matrix2D
    clipDepth: number
}

interface TextTexture {
    canvas: HTMLCanvasElement | OffscreenCanvas
    left: number
    top: number
    width: number
    height: number
}

const TEXT_CACHE_LIMIT = 64

// ============================================================
// 基类
// ============================================================

export abstract class GPU2DRenderer implements Renderer2D {
    readonly canvas: HTMLCanvasElement | OffscreenCanvas

    protected _width = 0
    protected _height = 0
    protected _pixelRatio = 1

    protected readonly _matrix = Matrix2D.identity()
    /** 当前嵌套的裁剪层数，0 表示没有裁剪 */
    protected _clipDepth = 0

    private readonly _path = new RecordedPath2D()
    private readonly _scratch = new RecordedPath2D()
    private readonly _stack: SavedState[] = []
    private readonly _geometryCache = new WeakMap<IPath2DReadable, GeometryEntry>()

    private _shapeScratch = new Float32Array(0)
    private readonly _imageScratch = new Float32Array(16)
    private _measureCanvas: HTMLCanvasElement | OffscreenCanvas | null = null
    private _measureCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null
    private readonly _textCache = new Map<string, TextTexture>()

    protected constructor(canvas?: HTMLCanvasElement | OffscreenCanvas, options: GPU2DRendererOptions = {}) {
        this.canvas = canvas ?? createCanvas(300, 150)
        this._pixelRatio = options.pixelRatio ?? 1
        this._width = this.canvas.width / this._pixelRatio
        this._height = this.canvas.height / this._pixelRatio
    }

    /** 子类完成 GPU 初始化后调用，用于同步视口等资源 */
    protected initialize(): void {
        this.onResize()
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
        this.onResize()
        return this
    }

    // ============================================================
    // 清屏
    // ============================================================

    clear(color?: PaintColor | null): void {
        this.onClear(color ?? null)
    }

    clearRect(x: number, y: number, width: number, height: number): void {
        const m = this._deviceMatrix()
        const p = { x: 0, y: 0 }
        let x0 = Infinity
        let y0 = Infinity
        let x1 = -Infinity
        let y1 = -Infinity
        const corners = [
            [x, y],
            [x + width, y],
            [x, y + height],
            [x + width, y + height],
        ]
        for (const [px, py] of corners) {
            p.x = px
            p.y = py
            m.mapPoint(p, p)
            x0 = Math.min(x0, p.x)
            y0 = Math.min(y0, p.y)
            x1 = Math.max(x1, p.x)
            y1 = Math.max(y1, p.y)
        }
        this.onClearRectDevice(
            Math.floor(x0),
            Math.floor(y0),
            Math.ceil(x1 - x0),
            Math.ceil(y1 - y0),
        )
    }

    // ============================================================
    // 变换栈
    // ============================================================

    save(): void {
        this._stack.push({ matrix: this._matrix.clone(), clipDepth: this._clipDepth })
    }

    restore(): void {
        const state = this._stack.pop()
        if (!state) return
        this._matrix.copy(state.matrix)
        this._popClipTo(state.clipDepth)
    }

    resetTransform(): void {
        this._matrix.identity()
    }

    setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        this._matrix.fromValues(a, b, c, d, tx, ty)
    }

    transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
        this._matrix.multiply(Matrix2D.fromValues(a, b, c, d, tx, ty))
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
    }

    rotate(radians: number): void {
        this._matrix.rotate(radians)
    }

    scale(x: number, y: number = x): void {
        this._matrix.scale(x, y)
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
        const path = typeof pathOrRule === 'string' || pathOrRule === undefined ? this._path : pathOrRule
        const rule: FillRule = typeof pathOrRule === 'string' ? pathOrRule : (fillRule ?? 'nonzero')
        const mesh = this._fillMesh(this._entryFor(path, true), rule)
        // 空路径作为裁剪区域时，stencil 永远无法增长，等价于全部裁剪掉
        this._pushClipMesh(mesh, this._deviceMatrix())
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
        if (!dw || !dh || !sw || !sh) return

        const iw = size.width || 1
        const ih = size.height || 1
        const uv: UvRect = { u0: sx / iw, v0: sy / ih, u1: (sx + sw) / iw, v1: (sy + sh) / ih }
        this.submitImage(
            image,
            this._deviceMatrix(),
            { x: dx, y: dy, width: dw, height: dh },
            uv,
            paint ? paint.opacity : 1,
            paint ? paint.blend : 'source-over',
            paint ? paint.imageSmoothing : true,
        )
    }

    // ============================================================
    // 路径与图元
    // ============================================================

    drawPath(path: IPath2DReadable, paint: Paint): void {
        this._paintEntry(this._entryFor(path, true), paint)
    }

    drawRect(x: number, y: number, width: number, height: number, paint: Paint): void {
        const p = this._resetScratch()
        p.rect(x, y, width, height)
        this._paintEntry(this._entryFor(p, false), paint)
    }

    drawRoundRect(x: number, y: number, width: number, height: number, radius: number | number[], paint: Paint): void {
        const p = this._resetScratch()
        p.roundRect(x, y, width, height, radius)
        this._paintEntry(this._entryFor(p, false), paint)
    }

    drawEllipse(cx: number, cy: number, radiusX: number, radiusY: number, paint: Paint): void {
        const p = this._resetScratch()
        p.ellipse(cx, cy, radiusX, radiusY, 0, 0, TAU, false)
        this._paintEntry(this._entryFor(p, false), paint)
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
        const p = this._resetScratch()
        p.ellipse(cx, cy, radiusX, radiusY, rotation, startAngle, endAngle, counterClockwise)
        this._paintEntry(this._entryFor(p, false), paint)
    }

    drawCircle(cx: number, cy: number, radius: number, paint: Paint): void {
        const p = this._resetScratch()
        p.ellipse(cx, cy, radius, radius, 0, 0, TAU, false)
        this._paintEntry(this._entryFor(p, false), paint)
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
        const p = this._resetScratch()
        p.arc(cx, cy, radius, startAngle, endAngle, counterClockwise)
        this._paintEntry(this._entryFor(p, false), paint)
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, paint: Paint): void {
        const p = this._resetScratch()
        p.moveTo(x1, y1)
        p.lineTo(x2, y2)
        this._paintEntry(this._entryFor(p, false), paint)
    }

    drawPolyline(points: Vector2Like[], paint: Paint, closed = false): void {
        if (!points || points.length === 0) return
        const p = this._resetScratch()
        p.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) p.lineTo(points[i].x, points[i].y)
        if (closed || points.length > 2) p.closePath()
        this._paintEntry(this._entryFor(p, false), paint)
    }

    // ============================================================
    // 文字
    // ============================================================

    drawText(text: string, x: number, y: number, paint: Paint): void {
        if (!text) return
        const texture = this._textTexture(text, x, y, paint)
        if (!texture) return
        this.submitImage(
            texture.canvas as ImageSource,
            this._deviceMatrix(),
            { x: texture.left, y: texture.top, width: texture.width, height: texture.height },
            { u0: 0, v0: 0, u1: 1, v1: 1 },
            paint.opacity,
            paint.blend,
            true,
        )
    }

    measureText(text: string, paint: Paint): TextMeasurement {
        const ctx = this._measureContext()
        const lines = text ? text.split('\n') : ['']
        const size = paint.text.size ?? 16
        let width = 0
        let ascent = 0
        let descent = 0
        if (ctx) {
            ctx.font = fontString(paint.text)
            for (const line of lines) {
                const metrics = ctx.measureText(line || ' ')
                width = Math.max(width, metrics.width)
                ascent = Math.max(ascent, metrics.actualBoundingBoxAscent ?? size * 0.8)
                descent = Math.max(descent, metrics.actualBoundingBoxDescent ?? size * 0.2)
            }
        }
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

    /**
     * 把多行文字栅格化到离屏 canvas，返回可当作纹理提交的方块。
     *
     * 对齐与基线在这里自行换算，因此纹理左上角是块的包围盒原点，
     * 提交时只需按用户坐标铺一个 quad。
     */
    private _textTexture(text: string, x: number, y: number, paint: Paint): TextTexture | null {
        const fillCSS = paint.fill ? sourceColorCSS(paint.fill) : null
        const strokeCSS = paint.stroke ? sourceColorCSS(paint.stroke) : null
        if (!fillCSS && !strokeCSS) return null

        const size = paint.text.size ?? 16
        const font = fontString(paint.text)
        const lineHeight = textLineHeight(paint)
        const lines = text.split('\n')
        const ctx = this._measureContext()
        if (!ctx) return null

        ctx.font = font
        const widths: number[] = []
        let ascent = 0
        let descent = 0
        for (const line of lines) {
            const metrics = ctx.measureText(line || ' ')
            widths.push(metrics.width)
            ascent = Math.max(ascent, metrics.actualBoundingBoxAscent ?? size * 0.8)
            descent = Math.max(descent, metrics.actualBoundingBoxDescent ?? size * 0.2)
        }

        const align = paint.text.align ?? 'left'
        const baseline = paint.text.baseline ?? 'alphabetic'
        const contentWidth = Math.max(1, ...widths)
        const contentHeight = Math.max(1, ascent + descent + (lines.length - 1) * lineHeight)
        const pad = Math.max(2, size * 0.25)
        const texWidth = contentWidth + pad * 2
        const texHeight = contentHeight + pad * 2

        const alignOffset = align === 'center' ? contentWidth / 2 : align === 'right' || align === 'end' ? contentWidth : 0
        const offsetTop =
            baseline === 'top' || baseline === 'hanging'
                ? 0
                : baseline === 'middle'
                  ? (ascent + descent) / 2
                  : ascent
        const contentLeft = x - alignOffset
        const contentTop = y - offsetTop

        const scale = Math.max(1, Math.min(4, this._deviceScale()))
        const key = [
            text,
            font,
            fillCSS,
            strokeCSS,
            paint.lineWidth,
            paint.lineCap,
            paint.lineJoin,
            align,
            baseline,
            paint.text.maxWidth ?? '',
            paint.text.letterSpacing ?? '',
            scale.toFixed(2),
        ].join('\u0000')

        const cached = this._textCache.get(key)
        if (cached) return cached

        const canvas = createCanvas(
            Math.max(1, Math.ceil(texWidth * scale)),
            Math.max(1, Math.ceil(texHeight * scale)),
        )
        const texCtx = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
        if (!texCtx) return null
        // 让用户坐标中的 (contentLeft, contentTop) 落到纹理的 (pad, pad)
        texCtx.setTransform(scale, 0, 0, scale, (pad - contentLeft) * scale, (pad - contentTop) * scale)
        texCtx.font = font
        texCtx.textAlign = 'left'
        texCtx.textBaseline = 'alphabetic'
        applyLetterSpacing(texCtx, paint.text.letterSpacing)

        const draw = (mode: 'fill' | 'stroke') => {
            const maxWidth = paint.text.maxWidth
            for (let i = 0; i < lines.length; i++) {
                const w = widths[i]
                const lineX =
                    align === 'center' ? x - w / 2 : align === 'right' || align === 'end' ? x - w : x
                const lineY = y + i * lineHeight
                if (mode === 'fill') texCtx.fillText(lines[i], lineX, lineY, maxWidth)
                else texCtx.strokeText(lines[i], lineX, lineY, maxWidth)
            }
        }

        if (strokeCSS) {
            texCtx.strokeStyle = strokeCSS
            texCtx.lineWidth = paint.lineWidth
            texCtx.lineCap = paint.lineCap
            texCtx.lineJoin = paint.lineJoin
        }
        if (fillCSS) texCtx.fillStyle = fillCSS

        if (paint.paintOrder === 'stroke-fill') {
            if (strokeCSS) draw('stroke')
            if (fillCSS) draw('fill')
        } else {
            if (fillCSS) draw('fill')
            if (strokeCSS) draw('stroke')
        }

        const texture: TextTexture = {
            canvas,
            left: contentLeft - pad,
            top: contentTop - pad,
            width: texWidth,
            height: texHeight,
        }
        if (this._textCache.size >= TEXT_CACHE_LIMIT) {
            const oldest = this._textCache.keys().next()
            if (!oldest.done) this._textCache.delete(oldest.value)
        }
        this._textCache.set(key, texture)
        return texture
    }

    private _measureContext(): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null {
        if (this._measureCtx) return this._measureCtx
        this._measureCanvas = createCanvas(1, 1)
        this._measureCtx = this._measureCanvas.getContext('2d') as
            | CanvasRenderingContext2D
            | OffscreenCanvasRenderingContext2D
            | null
        return this._measureCtx
    }

    // ============================================================
    // 绘制内部实现
    // ============================================================

    private _paintEntry(entry: GeometryEntry, paint: Paint): void {
        if (!paint.fill && !paint.stroke) return
        const m = this._deviceMatrix()
        if (paint.paintOrder === 'stroke-fill') {
            this._drawStroke(entry, paint, m)
            this._drawFill(entry, paint, m)
        } else {
            this._drawFill(entry, paint, m)
            this._drawStroke(entry, paint, m)
        }
    }

    private _drawFill(entry: GeometryEntry, paint: Paint, m: Matrix2D): void {
        if (!paint.fill) return
        const mesh = this._fillMesh(entry, paint.fillRule)
        if (isEmptyMesh(mesh)) return
        this.submitMesh(mesh, m, paint.fill, paint.opacity, paint.blend)
    }

    private _drawStroke(entry: GeometryEntry, paint: Paint, m: Matrix2D): void {
        if (!paint.stroke) return
        if (paint.strokeAlign === 'center') {
            const mesh = this._strokeMesh(entry, paint.lineWidth, paint)
            if (!isEmptyMesh(mesh)) this.submitMesh(mesh, m, paint.stroke, paint.opacity, paint.blend)
            return
        }

        // inside / outside：用双倍线宽描边，再用路径本身（或补集）裁剪掉外侧 / 内侧
        const width = paint.lineWidth * 2
        const mesh = this._strokeMesh(entry, width, paint)
        if (isEmptyMesh(mesh)) return
        const key = `${paint.strokeAlign}|${width}|${paint.fillRule}`
        let clip = entry.clips.get(key)
        if (!clip) {
            clip =
                paint.strokeAlign === 'inside'
                    ? this._fillMesh(entry, paint.fillRule)
                    : this._outsideMesh(entry, width)
            entry.clips.set(key, clip)
        }
        if (isEmptyMesh(clip)) return

        const base = this._clipDepth
        this._pushClipMesh(clip, m)
        try {
            this.submitMesh(mesh, m, paint.stroke, paint.opacity, paint.blend)
        } finally {
            this._popClipTo(base)
        }
    }

    private _fillMesh(entry: GeometryEntry, rule: FillRule): Mesh2D {
        let mesh = entry.fills.get(rule)
        if (!mesh) {
            mesh = tessellateFill(entry.contours, rule)
            entry.fills.set(rule, mesh)
        }
        return mesh
    }

    private _strokeMesh(entry: GeometryEntry, lineWidth: number, paint: Paint): Mesh2D {
        const key = `${lineWidth}|${paint.lineCap}|${paint.lineJoin}|${paint.miterLimit}|${paint.lineDash.join(',')}|${paint.lineDashOffset}`
        let mesh = entry.strokes.get(key)
        if (!mesh) {
            mesh = tessellateStroke(entry.contours, {
                lineWidth,
                lineCap: paint.lineCap,
                lineJoin: paint.lineJoin,
                miterLimit: paint.miterLimit,
                lineDash: paint.lineDash,
                lineDashOffset: paint.lineDashOffset,
            })
            entry.strokes.set(key, mesh)
        }
        return mesh
    }

    /** 路径之外的补集（大矩形 + 路径本身，evenodd），用于 outside 描边裁剪 */
    private _outsideMesh(entry: GeometryEntry, lineWidth: number): Mesh2D {
        let x0 = Infinity
        let y0 = Infinity
        let x1 = -Infinity
        let y1 = -Infinity
        for (const contour of entry.contours) {
            const points = contour.points
            for (let i = 0; i < points.length; i += 2) {
                x0 = Math.min(x0, points[i])
                y0 = Math.min(y0, points[i + 1])
                x1 = Math.max(x1, points[i])
                y1 = Math.max(y1, points[i + 1])
            }
        }
        if (!Number.isFinite(x0)) return EMPTY_MESH
        const pad = lineWidth + 1
        const rect = [x0 - pad, y0 - pad, x1 + pad, y0 - pad, x1 + pad, y1 + pad, x0 - pad, y1 + pad]
        return tessellateFill([{ points: rect, closed: true }, ...entry.contours], 'evenodd')
    }

    private _entryFor(path: IPath2DReadable, cache: boolean): GeometryEntry {
        if (cache) {
            const hit = this._geometryCache.get(path)
            if (hit && hit.version === path.version) return hit
        }
        const entry: GeometryEntry = {
            version: path.version,
            contours: flattenPath(path),
            fills: new Map(),
            strokes: new Map(),
            clips: new Map(),
        }
        if (cache) this._geometryCache.set(path, entry)
        return entry
    }

    private _resetScratch(): RecordedPath2D {
        this._scratch.clear()
        return this._scratch
    }

    // ============================================================
    // 裁剪层级
    // ============================================================

    private _pushClipMesh(mesh: Mesh2D, matrix: Matrix2D): void {
        this._clipDepth++
        this.beginClip(mesh, matrix, this._clipDepth)
    }

    private _popClipTo(level: number): void {
        if (this._clipDepth <= level) return
        const from = this._clipDepth
        // 先更新层级，后端的 endClip 里读到的就是回退后的状态
        this._clipDepth = level
        this.endClip(from, level)
    }

    // ============================================================
    // 供子类使用的工具
    // ============================================================

    /** 当前矩阵 × pixelRatio，得到从用户坐标到设备像素的变换 */
    protected _deviceMatrix(): Matrix2D {
        const m = Matrix2D.from(this._matrix)
        m.scale(this._pixelRatio, this._pixelRatio)
        return m
    }

    /** 当前用户坐标到设备像素的近似缩放量，用于文字超采样 */
    protected _deviceScale(): number {
        return Math.abs(this._matrix.getScale()) * this._pixelRatio
    }

    /**
     * 生成 shape 程序的顶点：[x_dev, y_dev, lx, ly]。
     *
     * 设备坐标用于定位，局部坐标用于在片元里计算渐变 / pattern 的采样位置。
     * 返回的数组是复用缓冲区，调用方必须立即上传，不能跨帧持有。
     */
    protected shapeVertices(mesh: Mesh2D, matrix: Matrix2D): Float32Array {
        const count = mesh.positions.length / 2
        const needed = count * 4
        if (this._shapeScratch.length < needed) this._shapeScratch = new Float32Array(needed)
        const out = this._shapeScratch
        const p = mesh.positions
        const m = matrix
        for (let i = 0; i < count; i++) {
            const lx = p[i * 2]
            const ly = p[i * 2 + 1]
            const o = i * 4
            out[o] = m[0] * lx + m[2] * ly + m[4]
            out[o + 1] = m[1] * lx + m[3] * ly + m[5]
            out[o + 2] = lx
            out[o + 3] = ly
        }
        return out.subarray(0, needed)
    }

    /**
     * 生成 image 程序的顶点：[x_dev, y_dev, u, v]，顺序为左上、右上、右下、左下。
     * 索引固定为 (0,1,2, 0,2,3)。
     */
    protected imageVertices(dst: Rect, uv: UvRect, matrix: Matrix2D): Float32Array {
        const out = this._imageScratch
        const x0 = dst.x
        const y0 = dst.y
        const x1 = dst.x + dst.width
        const y1 = dst.y + dst.height
        const m = matrix
        const write = (i: number, x: number, y: number, u: number, v: number) => {
            const o = i * 4
            out[o] = m[0] * x + m[2] * y + m[4]
            out[o + 1] = m[1] * x + m[3] * y + m[5]
            out[o + 2] = u
            out[o + 3] = v
        }
        write(0, x0, y0, uv.u0, uv.v0)
        write(1, x1, y0, uv.u1, uv.v0)
        write(2, x1, y1, uv.u1, uv.v1)
        write(3, x0, y1, uv.u0, uv.v1)
        return out
    }

    flush(): void {
        this.onFlush()
    }

    dispose(): void {
        this._stack.length = 0
        this._path.clear()
        this._scratch.clear()
        this._textCache.clear()
        this.onDispose()
    }

    // ============================================================
    // 后端挂钩
    // ============================================================

    /** canvas 尺寸变化（含首次初始化）时重建视口相关资源 */
    protected abstract onResize(): void
    protected abstract onClear(color: PaintColor | null): void
    protected abstract onClearRectDevice(x: number, y: number, width: number, height: number): void

    /** 提交一个填充 / 描边三角形网格；source 为 pattern 时由子类切换到纹理程序 */
    protected abstract submitMesh(
        mesh: Mesh2D,
        matrix: Matrix2D,
        source: PaintSource,
        opacity: number,
        blend: BlendMode,
    ): void

    protected abstract submitImage(
        image: ImageSource,
        matrix: Matrix2D,
        dst: Rect,
        uv: UvRect,
        opacity: number,
        blend: BlendMode,
        smoothing: boolean,
    ): void

    /** 进入一层裁剪：只在 stencil == level - 1 处写 stencil，把结果写成 level */
    protected abstract beginClip(mesh: Mesh2D, matrix: Matrix2D, level: number): void
    /** 退出裁剪：把 stencil 从 from 逐级回退到 to */
    protected abstract endClip(from: number, to: number): void

    protected abstract onFlush(): void
    protected abstract onDispose(): void
}

// ============================================================
// 工具
// ============================================================

function clamp01(value: number): number {
    return value < 0 ? 0 : value > 1 ? 1 : value
}

function applyLetterSpacing(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, spacing?: number): void {
    if (spacing === undefined) return
    // letterSpacing 属于较新的 CanvasTextDrawingStyles 成员
    ;(ctx as unknown as { letterSpacing?: string }).letterSpacing = `${spacing}px`
}
