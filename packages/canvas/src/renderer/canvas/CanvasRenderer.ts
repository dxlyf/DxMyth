import { BaseRenderer } from "src/renderer/Renderer";
import { IRendererOptions } from "src/types/Renderer";
import { FillRule, FillStrokeStyles, FillStyle, StrokeStyle, FontStyle, FontVariantCaps, FontWeight, FontStretch } from "src/types/FillStrokeStyles";
import { PathBuilder } from "src/math/PathBuilder";
import { ConicGradient, Gradient, LinearGradient, RadialGradient } from "src/core/Gradient";
import { Pattern } from "src/core/Pattern";
import { INode, NodeProps } from "src/types/Node";

export type CanvasRendererOptions = IRendererOptions & {
    canvas: HTMLCanvasElement
}

const CanvasContextProperties = new Set(['canvas',
    'lang', 'font',
    'textAlign',
    'textBaseline',
    'direction',
    'fontKerning',
    'fontStretch',
    'fontVariantCaps',
    'letterSpacing',
    'textRendering',
    'wordSpacing',
    'globalCompositeOperation',
    'filter',
    'imageSmoothingQuality',
    'strokeStyle',
    'fillStyle',
    'shadowColor',
    'lineCap',
    'lineJoin',
    'globalAlpha',
    'imageSmoothingEnabled',
    'shadowOffsetX',
    'shadowOffsetY',
    'shadowBlur',
    'lineWidth',
    'miterLimit',
    'lineDashOffset',
    'clip',
    'createConicGradient',
    'createImageData',
    'createLinearGradient',
    'createPattern',
    'createRadialGradient',
    'drawFocusIfNeeded', 'drawImage',
    'fill', 'fillText',
    'getContextAttributes',
    'getImageData',
    'getLineDash',
    'getTransform',
    'isContextLost',
    'isPointInPath',
    'isPointInStroke',
    'measureText',
    'reset', 'roundRect',
    'setLineDash',
    'strokeText',
    'arc',
    'arcTo',
    'beginPath',
    'bezierCurveTo',
    'clearRect', 'closePath',
    'ellipse', 'fillRect', 'lineTo',
    'moveTo', 'putImageData',
    'quadraticCurveTo', 'rect',
    'resetTransform', 'restore', 'rotate',
    'save', 'scale', 'setTransform',
    'stroke', 'strokeRect',
    'transform', 'translate'])
/**
 * Canvas2D 后端渲染器。
 *
 * 性能策略：ctx 作为主状态存储，所有操作直接转发到 ctx；
 * RenderState 仅作为逻辑镜像（供非 Canvas 后端逻辑或外部读取），
 * 绘制方法不再做状态同步。
 */
export class CanvasRenderer extends BaseRenderer<CanvasRendererOptions> {

    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    constructor(options: CanvasRendererOptions) {
        super(options)
        this.canvas = options.canvas
        this.ctx = options.canvas.getContext('2d')! as CanvasRenderingContext2D
        this.setSize(this.width, this.height, this.dpr)

    }
    onResize(width: number, height: number, dpr: number) {
        this.canvas.width = Math.floor(width * dpr)
        this.canvas.height = Math.floor(height * dpr)
        this.canvas.style.width = `${width}px`
        this.canvas.style.height = `${height}px`

    }

    // ---- Paint 转换 ----
    private gradientToCanvas(g: Gradient): CanvasGradient {
        let cg: CanvasGradient
        if (g instanceof LinearGradient) {
            cg = this.ctx.createLinearGradient(g.x0, g.y0, g.x1, g.y1)
        } else if (g instanceof RadialGradient) {
            cg = this.ctx.createRadialGradient(g.x0, g.y0, g.r0, g.x1, g.y1, g.r1)
        } else if (g instanceof ConicGradient) {
            cg = (this.ctx as any).createConicGradient(g.startAngle, g.x, g.y)
        } else {
            cg = this.ctx.createLinearGradient(0, 0, 0, 0)
        }
        for (const stop of g.colorStops) {
            cg.addColorStop(stop.offset, stop.color)
        }
        return cg
    }
    private patternToCanvas(p: Pattern): CanvasPattern | null {
        if (!p.image) return null
        return this.ctx.createPattern(p.image, p.type)
    }
    /** 把填充/描边样式归一化为 ctx 可用值 */
    private toCanvasPaint(style: FillStyle | StrokeStyle): string | CanvasGradient | CanvasPattern {
        if (typeof style === 'string') {
            return style === 'none' ? 'rgba(0,0,0,0)' : style
        }
        if (style instanceof Gradient) {
            return this.gradientToCanvas(style)
        }
        if (style instanceof Pattern) {
            return this.patternToCanvas(style) ?? 'rgba(0,0,0,0)'
        }
        return style as any
    }
    private composeFont(
        style: FontStyle,
        variant: FontVariantCaps,
        weight: FontWeight,
        stretch: FontStretch,
        size: number,
        lineHeight: number,
        family: string,
    ): string {
        const parts: string[] = []
        if (style && style !== 'normal') parts.push(style)
        if (variant && variant !== 'normal') parts.push(variant)
        if (weight && weight !== 'normal') parts.push(String(weight))
        if (stretch && stretch !== 'normal') parts.push(stretch)
        parts.push(`${size}px/${lineHeight}`)
        parts.push(family)
        return parts.join(' ')
    }


    // ---- 变换：直接转发 ctx + 维护镜像 ----
    translate(x: number, y: number): void {
        this.ctx.translate(x, y)
    }
    rotate(angle: number): void {
        this.ctx.rotate(angle)
    }
    scale(x: number, y: number): void {
        this.ctx.scale(x, y)
    }
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.ctx.transform(a, b, c, d, e, f)
    }
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.ctx.setTransform(a, b, c, d, e, f)
    }
    resetTransform(): void {
        this.ctx.resetTransform()
    }

    // ---- 路径：直接转发 ctx + 维护 currentPath（供显式 path 参数与读取） ----
    beginPath(): void {
        this.ctx.beginPath()
    }
    moveTo(x: number, y: number): void {
        this.ctx.moveTo(x, y)
    }
    lineTo(x: number, y: number): void {
        this.ctx.lineTo(x, y)
    }
    quadraticCurveTo(x1: number, y1: number, x2: number, y2: number): void {
        this.ctx.quadraticCurveTo(x1, y1, x2, y2)
    }
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this.ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
    }
    arc(x: number, y: number, r: number, startAngle: number, endAngle: number, ccw: boolean): void {
        this.ctx.arc(x, y, r, startAngle, endAngle, !!ccw)
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void {
        this.currentPath.arcTo(x1, y1, x2, y2, r)
        this.ctx.arcTo(x1, y1, x2, y2, r)
    }
    ellipse(x: number, y: number, r: number, rotation: number, startAngle: number, endAngle: number, ccw: boolean): void {
        this.ctx.ellipse(x, y, r, r, rotation, startAngle, endAngle, ccw)
    }
    rect(x: number, y: number, width: number, height: number): void {
        this.currentPath.rect(x, y, width, height)
        this.ctx.rect(x, y, width, height)
    }
    roundRect(x: number, y: number, width: number, height: number, r: number): void {
        this.ctx.roundRect(x, y, width, height, r)
    }
    closePath(): void {
        this.ctx.closePath()
    }

    // ---- 状态栈：RenderState 栈 + ctx 栈 ----
    save(): void {
        this.ctx.save()
    }
    restore(): void {
        this.ctx.restore()
    }

    // ---- 画布清理 ----
    clear(color: string): void {
        const { width, height, dpr } = this
        this.ctx.save()
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.fillStyle = color
        this.ctx.fillRect(0, 0, width * dpr, height * dpr)
        this.ctx.restore()
    }
    clearRect(x: number, y: number, width: number, height: number): void {
        this.ctx.clearRect(x, y, width, height)
    }
    setStyles(styles: Partial<FillStrokeStyles>) {
        const ctx = this.ctx
        for (let key of Object.keys(styles)) {
            if (CanvasContextProperties.has(key)) {
                (ctx as any)[key] = (styles as any)[key]
            }
        }
    }
    isPointInPath(x: number, y: number, fillRule?: FillRule): boolean;
    isPointInPath(path: PathBuilder, x: number, y: number, fillRule?: FillRule): boolean;
    isPointInPath(path: unknown, x: unknown, y?: unknown, fillRule?: unknown): boolean {
        if (path instanceof PathBuilder) {
            return this.ctx.isPointInPath(path.toCanvasPath2D() as Path2D, x as number, y as number,fillRule as FillRule)
        } else {
            fillRule = y
            y = x
            x = path
            return this.ctx.isPointInPath(x as number, y as number,fillRule as FillRule)
        }
    }
    isPointInStroke(x: number, y: number): boolean;
    isPointInStroke(path: PathBuilder, x: number, y: number): boolean;
    isPointInStroke(path: unknown, x: unknown, y?: unknown): boolean {
        if (path instanceof PathBuilder) {
          return this.ctx.isPointInStroke(path.toCanvasPath2D() as Path2D, x as number, y as number)
        } else {
            y = x
            x = path
        }
        return this.ctx.isPointInStroke(x as number, y as number)

    }
    // ---- 绘制：直接调 ctx，不做状态同步 ----
    clip(fillRule?: FillRule): void;
    clip(path: PathBuilder, fillRule?: FillRule): void;
    clip(path?: unknown, fillRule?: unknown): void {
        const ctx = this.ctx
        if (path instanceof PathBuilder) {
            const p2d = new Path2D()
            path.toCanvasPath2D(p2d)
            ctx.clip(p2d, (fillRule as FillRule) ?? 'nonzero')
        } else {
            ctx.clip((path as FillRule) ?? 'nonzero')
        }
    }
    fill(fillRule?: FillRule): void;
    fill(path: PathBuilder, fillRule?: FillRule): void;
    fill(path?: unknown, fillRule?: unknown): void {
        const ctx = this.ctx
        if (path instanceof PathBuilder) {
            const p2d = new Path2D()
            path.toCanvasPath2D(p2d)
            ctx.fill(p2d, (fillRule as FillRule) ?? 'nonzero')
        } else {
            ctx.fill((path as FillRule) ?? 'nonzero')
        }
    }
    stroke(): void;
    stroke(path: PathBuilder): void;
    stroke(path?: unknown): void {
        const ctx = this.ctx
        if (path instanceof PathBuilder) {
            const p2d = new Path2D()
            path.toCanvasPath2D(p2d)
            ctx.stroke(p2d)
        } else {
            ctx.stroke()
        }
    }

    // ---- 文本 ----
    fillText(text: string, x: number, y: number): void {
        this.ctx.fillText(text, x, y)
    }
    strokeText(text: string, x: number, y: number): void {
        this.ctx.strokeText(text, x, y)
    }
    measureText(text: string): TextMetrics {
        return this.ctx.measureText(text)
    }

    // ---- 图像 ----
    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: unknown, sx: unknown, sy: unknown, sw?: unknown, sh?: unknown, dx?: unknown, dy?: unknown, dw?: unknown, dh?: unknown): void {
        const img = image as CanvasImageSource
        if (sw === undefined) {
            this.ctx.drawImage(img, sx as number, sy as number)
        } else if (dx === undefined) {
            this.ctx.drawImage(img, sx as number, sy as number, sw as number, sh as number)
        } else {
            this.ctx.drawImage(img, sx as number, sy as number, sw as number, sh as number, dx as number, dy as number, dw as number, dh as number)
        }
    }

    // ---- ImageData ----
    createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    createImageData(imageData: ImageData): ImageData;
    createImageData(sw: unknown, sh?: unknown, settings?: unknown): ImageData {
        if (sw instanceof ImageData) {
            return this.ctx.createImageData(sw)
        }
        return this.ctx.createImageData(sw as number, sh as number, settings as ImageDataSettings | undefined)
    }
    getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings): ImageData {
        return this.ctx.getImageData(sx, sy, sw, sh, settings)
    }
    putImageData(imageData: ImageData, dx: number, dy: number): void;
    putImageData(imageData: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    putImageData(imageData: unknown, dx: unknown, dy: unknown, dirtyX?: unknown, dirtyY?: unknown, dirtyWidth?: unknown, dirtyHeight?: unknown): void {
        if (dirtyX !== undefined) {
            this.ctx.putImageData(
                imageData as ImageData,
                dx as number, dy as number,
                dirtyX as number, dirtyY as number,
                dirtyWidth as number, dirtyHeight as number,
            )
        } else {
            this.ctx.putImageData(imageData as ImageData, dx as number, dy as number)
        }
    }
    render(node:INode){
        
        node.render(this)
    }
}
