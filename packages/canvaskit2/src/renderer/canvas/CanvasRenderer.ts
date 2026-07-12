
import { Container } from "src/core/Container"
import { ElementFlag } from "src/core/ElementFlags"
import { ConicGradient, LinearGradient, RadialGradient } from "src/core/Gradient"
import { ImagePattern } from "src/core/Pattern"
import { FillRule, FillStyle, Renderer, RenderStyle, StrokeStyle, type RendererProps } from "src/core/Renderer"
import { Shape } from "src/core/Shape"
import { Color, ColorLike, ColorValue,Matrix2D } from "@dxyl/math2"
import { CKPath2D } from "src/ck"


export type CanvasRendererProps = RendererProps & {
    canvas?: HTMLCanvasElement
    backgroundColor?: ColorValue
}



export class CanvasRenderer extends Renderer<CanvasRendererProps> {

    type = "CanvasRenderer"
    declare domElement: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor(props?: Partial<CanvasRendererProps>) {
        super(props)


    }
    async init() {
        this.domElement = this.props.canvas || document.createElement('canvas')
        this.domElement.style.margin = '0'
        this.domElement.style.padding = '0'
        this.domElement.style.display = 'block'
        this.ctx = this.domElement.getContext("2d", { alpha: true })!
        if (!this.domElement.parentNode) {
            this.engine.containerDom.appendChild(this.domElement)
        }
    }
    updateViewSize(width: number, height: number) {
        this.domElement.width = this.width
        this.domElement.height = this.height
        this.domElement.style.width = `${width}px`
        this.domElement.style.height = `${height}px`

    }
    createPath(): Path2D {
        return new Path2D()
    }
    reset(): void {
        this.ctx.reset()
    }
    restore(): void {
        this.ctx.restore()
    }
    save(): void {
        this.ctx.save()
    }
    getTransform(): Matrix2D {
        const m = this.ctx.getTransform()
        return new Matrix2D(m.a, m.b, m.c, m.d, m.e, m.f)
    }
    resetTransform(): void {
        this.ctx.resetTransform()
    }
    rotate(angle: number): void {
        this.ctx.rotate(angle)
    }
    scale(x: number, y: number): void {
        this.ctx.scale(x, y)
    }
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void
    setTransform(transform?: DOMMatrix2DInit): void
    setTransform(a?: unknown, b?: unknown, c?: unknown, d?: unknown, e?: unknown, f?: unknown): void {
        if (typeof a === 'number') {
            this.ctx.setTransform(a as number, b as number, c as number, d as number, e as number, f as number)
        } else {
            this.ctx.setTransform(a as DOMMatrix2DInit)
        }
    }
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.ctx.transform(a, b, c, d, e, f)
    }
    translate(x: number, y: number): void {
        this.ctx.translate(x, y)
    }
    clearRect(x: number, y: number, w: number, h: number): void {
        this.ctx.clearRect(x, y, w, h)
    }
    fillRect(x: number, y: number, w: number, h: number): void {
        this.ctx.fillRect(x, y, w, h)
    }
    strokeRect(x: number, y: number, w: number, h: number): void {
        this.ctx.strokeRect(x, y, w, h)
    }
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this.ctx.arc(x, y, radius, startAngle, endAngle, counterclockwise)
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.ctx.arcTo(x1, y1, x2, y2, radius)
    }
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }
    closePath(): void {
        this.ctx.closePath()
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    }
    lineTo(x: number, y: number): void {
        this.ctx.lineTo(x, y)
    }
    moveTo(x: number, y: number): void {
        this.ctx.moveTo(x, y)
    }
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this.ctx.quadraticCurveTo(cpx, cpy, x, y)
    }
    rect(x: number, y: number, w: number, h: number): void {
        this.ctx.rect(x, y, w, h)
    }
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void {
        this.ctx.roundRect(x, y, w, h, radii as any)
    }
    beginPath(): void {
        this.ctx.beginPath()
    }
    clip(fillRule?: FillRule): void
    clip(path: Path2D, fillRule?: FillRule): void
    clip(path?: unknown, fillRule?: unknown): void {
        if (path === undefined || typeof path === 'string') {
            this.ctx.clip(path as FillRule)
        } else {
            this.ctx.clip((path as Path2D), fillRule as FillRule)
        }
    }
    fill(fillRule?: FillRule): void
    fill(path: Path2D, fillRule?: FillRule): void
    fill(path?: unknown, fillRule?: unknown): void {
        if (path === undefined || typeof path === 'string') {
            this.ctx.fill(path as FillRule)
        } else {
            this.ctx.fill(path as Path2D, fillRule as FillRule)
        }
    }
    isPointInPath(x: number, y: number, fillRule?: FillRule): boolean
    isPointInPath(path: Path2D, x: number, y: number, fillRule?: FillRule): boolean
    isPointInPath(path: unknown, x: unknown, y?: unknown, fillRule?: unknown): boolean {
        if (typeof path === 'number') {
            return this.ctx.isPointInPath(path as number, x as number, y as FillRule)
        }
        return this.ctx.isPointInPath(path as Path2D, x as number, y as number, fillRule as FillRule)
    }
    isPointInStroke(x: number, y: number): boolean
    isPointInStroke(path: Path2D, x: number, y: number): boolean
    isPointInStroke(path: unknown, x: unknown, y?: unknown): boolean {
        if (typeof path === 'number') {
            return this.ctx.isPointInStroke(path as number, x as number)
        }
        return this.ctx.isPointInStroke(path as Path2D, x as number, y as number)
    }
    stroke(): void
    stroke(path: Path2D): void
    stroke(path?: unknown): void {
        if (path === undefined) {
            this.ctx.stroke()
        } else {
            this.ctx.stroke(path as Path2D)
        }
    }
    fillText(text: string, x: number, y: number, maxWidth?: number): void {
        this.ctx.fillText(text, x, y, maxWidth)
    }
    measureText(text: string): TextMetrics {
        return this.ctx.measureText(text)
    }
    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        this.ctx.strokeText(text, x, y, maxWidth)
    }
    // drawImage(image: CanvasImageSource, dx: number, dy: number): void
    // drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void
    // drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void
    // drawImage(image: unknown, sx: unknown, sy: unknown, sw?: unknown, sh?: unknown, dx?: unknown, dy?: unknown, dw?: unknown, dh?: unknown): void {
    //     if (sw === undefined) {
    //         this.ctx.drawImage(image as CanvasImageSource, sx as number, sy as number)
    //     } else if (dx === undefined) {
    //         this.ctx.drawImage(image as CanvasImageSource, sx as number, sy as number, sw as number, sh as number)
    //     } else {
    //         this.ctx.drawImage(image as CanvasImageSource, sx as number, sy as number, sw as number, sh as number, dx as number, dy as number, dw as number, dh as number)
    //     }
    // }
    createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData
    createImageData(imageData: ImageData): ImageData
    createImageData(sw: unknown, sh?: unknown, settings?: unknown): ImageData {
        if (typeof sw === 'number') {
            return this.ctx.createImageData(sw, sh as number, settings as ImageDataSettings)
        }
        return this.ctx.createImageData(sw as ImageData)
    }
    getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings): ImageData {
        return this.ctx.getImageData(sx, sy, sw, sh, settings)
    }
    putImageData(imageData: ImageData, dx: number, dy: number): void
    putImageData(imageData: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void
    putImageData(imageData: unknown, dx: unknown, dy: unknown, dirtyX?: unknown, dirtyY?: unknown, dirtyWidth?: unknown, dirtyHeight?: unknown): void {
        if (dirtyX === undefined) {
            this.ctx.putImageData(imageData as ImageData, dx as number, dy as number)
        } else {
            this.ctx.putImageData(imageData as ImageData, dx as number, dy as number, dirtyX as number, dirtyY as number, dirtyWidth as number, dirtyHeight as number)
        }
    }

    private toCanvasFillStyle(style: FillStyle | StrokeStyle) {
        if (!style) {
            return null
        }
        const type = style.type
        if (type === 'color') {
            return Color.toCSS_RGBA(style.value)
        } else if (type === 'gradient') {
            const stops = style.stops
            const elementType = style.elementType
            let gradient: CanvasGradient
            if (elementType === 'linear-gradient') {
                let _gradient = style as LinearGradient
                gradient = this.ctx.createLinearGradient(_gradient.x0, _gradient.y0, _gradient.x1, _gradient.y1)
            } else if (elementType === 'radial-gradient') {
                let _gradient = style as RadialGradient
                gradient = this.ctx.createRadialGradient(_gradient.x0, _gradient.y0, _gradient.r0, _gradient.x1, _gradient.y1, _gradient.r1)
            } else if (elementType === 'conic-gradient') {
                let _gradient = style as ConicGradient
                gradient = this.ctx.createConicGradient(_gradient.startAngle, _gradient.x, _gradient.y)
            }
            stops.forEach(stop => {
                gradient.addColorStop(stop.offset, Color.toCSS_RGBA(stop.color))
            })
            return gradient
        } else if (type === 'pattern' && style.source) {
            const _pattern = style as ImagePattern
            return this.ctx.createPattern(_pattern.source, _pattern.repeat)
        }
        return null
    }

    private applyShapeStyle(shape: Shape) {
        const ctx = this.ctx
        const style = shape.style
        let fillStyle;
        if (shape.flags.has(ElementFlag.STYLE) || !shape._cache._canvasFillStyle) {
            fillStyle = shape._cache._canvasFillStyle = this.toCanvasFillStyle(style.fillStyle)
        } else {
            fillStyle = shape._cache._canvasFillStyle
        }

        const strokeStyle = this.toCanvasFillStyle(style.strokeStyle)

        const shadowColor = style.shadowColor
        const shadowBlur = style.shadowBlur
        if (shadowColor && shadowBlur > 0) {
            ctx.shadowColor = shadowColor as unknown as string
            ctx.shadowBlur = shadowBlur
            ctx.shadowOffsetX = style.shadowOffsetX
            ctx.shadowOffsetY = style.shadowOffsetY
        }
        if (fillStyle) {
            ctx.fillStyle = fillStyle
        }
        if (strokeStyle) {
            const lineDash = style.lineDash
            ctx.strokeStyle = strokeStyle
            ctx.lineWidth = style.lineWidth
            ctx.lineCap = style.lineCap
            ctx.lineJoin = style.lineJoin
            if (lineDash) {
                ctx.lineDashOffset = style.lineDashOffset
                ctx.setLineDash(lineDash)
            }
        }

    }
    renderImage(shape: Shape): void {
        throw new Error("Method not implemented.")
    }
    renderText(shape: Shape): void {
        throw new Error("Method not implemented.")
    }
    /**
     * 核心绘制：transform → 样式 → 路径 → fill/stroke
     * 被 renderShape 和 renderShapeWithBlend 共用
     */
    private _drawShape(shape: Shape): void {
        const ctx = this.ctx
        const style = shape.style
        const matrix = shape.worldMatrix

        if (!matrix.isIdentity()) {
            ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5])
        }
        if (style.opacity < 1) {
            ctx.globalAlpha = style.opacity
        }
        this.applyShapeStyle(shape)
        shape.draw(this)

        if (style.closePath) ctx.closePath()

        const hasFill = !!style.fillStyle
        const hasStroke = !!style.strokeStyle
        const needClipStroke = hasStroke && style.strokeAlign !== 'center'

        if (!style.firstStroke) {
            if (hasFill) ctx.fill(style.fillRule)
            if (needClipStroke) this._strokeWithAlign(shape)
            else if (hasStroke) ctx.stroke()
        } else {
            if (needClipStroke) this._strokeWithAlign(shape)
            else if (hasStroke) ctx.stroke()
            if (hasFill) ctx.fill(style.fillRule)
        }
    }

    /** 通过 clip 实现 inner/outer 描边（从 style 读取参数，减少传参） */
    private _strokeWithAlign(shape: Shape): void {
        const ctx = this.ctx
        const style = shape.style
        const align = style.strokeAlign as 'inner' | 'outer'|'center'
        if (align === 'center') {
            ctx.stroke()
            return
        }
        ctx.save()
        ctx.beginPath()
        shape.draw(this)
        if (style.closePath) ctx.closePath()

        if (align === 'inner') {
            ctx.clip() // 裁掉外部 → 只保留内部描边
        } else {
            ctx.rect(-1e8, -1e8, 2e8, 2e8)
            ctx.clip('evenodd') // 路径内部作为洞 → 只保留外部描边
              // outer: 擦除内部一半 → 只保留外部描边
            // 用 destination-out 比 evenodd + 大矩形更高效     
        }
        ctx.lineWidth = style.lineWidth * 2 // 双倍线宽，clip 裁掉一半
        ctx.stroke()
        ctx.restore()
    }

    private renderShapeWithBlend(shape: Shape, blend: string): void {
        const mainCtx = this.ctx
        const offCanvas = new OffscreenCanvas(this.width, this.height)
        const offCtx = offCanvas.getContext('2d')!

        offCtx.save()
        offCtx.scale(this.dpr, this.dpr)
        offCtx.beginPath()
        offCtx.globalCompositeOperation = 'source-over'

        // 临时切换 ctx 到离屏，复用 _drawShape 全部逻辑
        ;(this as any).ctx = offCtx
        this._drawShape(shape)
        ;(this as any).ctx = mainCtx

        offCtx.restore()

        mainCtx.globalCompositeOperation = blend as any
        mainCtx.drawImage(offCanvas, 0, 0, this.viewport.width, this.viewport.height)
    }
    drawPath(path: CKPath2D): void {
        
    }
    prevShape: Shape = null
    renderShape(shape: Shape): void {
        const ctx = this.ctx
        const prevShape = this.prevShape

        ctx.save()
        ctx.beginPath()

        if (prevShape && shape.style.blend !== prevShape.style.blend) {
            this.renderShapeWithBlend(shape, shape.style.blend)
        } else {
            this._drawShape(shape)
        }

        ctx.restore()
        this.prevShape = shape
    }

    renderBefore(ctx: CanvasRenderingContext2D) {
        const viewportMatrix = this.viewport.getWorldToScreenMatrix()
        const vm = Matrix2D.pool.get()
        const dpr = this.dpr

        ctx.save()
        ctx.clearRect(0, 0, this.width, this.height)
        //  ctx.scale(this.dpr, this.dpr)
        vm.fromScale(dpr, dpr)
        vm.multiply(viewportMatrix)
        if (!vm.isIdentity()) {
            ctx.transform(vm[0], vm[1], vm[2], vm[3], vm[4], vm[5])
        }
        Matrix2D.pool.release(vm)
    }
    renderAfter(ctx: CanvasRenderingContext2D) {
        ctx.restore()
        if (this.props.backgroundColor) {
            ctx.fillStyle = this.props.backgroundColor as string
            ctx.globalCompositeOperation = 'destination-atop'
            ctx.fillRect(0, 0, this.width, this.height)
            ctx.globalCompositeOperation = 'source-over'
        }
    }

    render(scene: Container): void {
        const viewport = this.viewport
        const renderList = scene.collectRenderElements()
        const ctx = this.ctx
        this.renderBefore(ctx)

        for (let i = 0, len = renderList.length; i < len; i++) {
            const shape = renderList[i]
            const shapeWorldBounds = shape.worldBounds
            shape.onUpdate()
            if (shape.shouldRender() && viewport.isVisible(shapeWorldBounds)) {
                shape.render(this)
            }
        }
        this.renderAfter(ctx)
    }

}
