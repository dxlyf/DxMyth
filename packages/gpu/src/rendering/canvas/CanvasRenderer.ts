import { Color, ColorInput, ColorValue } from "src/math/Color";
import { ConicGradient, Gradient, LinearGradient, RadialGradient } from "src/math/Gradient";
import { Matrix2D } from "src/math/Matrix2D";
import { PathBuilder } from "src/math/PathBuilder";
import { Pattern } from "src/math/Pattern";
import { BlendOperation, FillRule, FillStyle, FontStyle, FontStyles, FontWeight, LineCap, LineJoin, Paint, TextAlign, TextBaseline } from "src/rendering/Paint";
import { Renderer, RendererProps, RenderOptions } from "src/rendering/Renderer";


export class CanvasRenderer extends Renderer {

    renderType = 'canvas'
    domElement: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor() {
        super()
    }
    async initContext(options: RendererProps) {
        if (options.canvas) {
            this.domElement = options.canvas as HTMLCanvasElement
        } else {
            this.domElement = document.createElement('canvas')
        }
        this.ctx = this.domElement.getContext('2d')!

    }
    clear(): void {
        if (this.clearColorValue) {
            this.ctx.fillStyle = Color.toCSS_RGBA(this.clearColorValue)
            this.ctx.fillRect(0, 0, this.domElement.width, this.domElement.height)
        } else {
            this.ctx.clearRect(0, 0, this.domElement.width, this.domElement.height)
        }
    }
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.ctx.transform(a, b, c, d, e, f)
    }
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.ctx.setTransform(a, b, c, d, e, f)
    }
    getTransform(): Matrix2D {
        const m = this.ctx.getTransform()
        return Matrix2D.fromValues(m.a, m.b, m.c, m.d, m.e, m.f)
    }
    resetTransform(): void {
        this.ctx.resetTransform()
    }
    translate(x: number, y: number): void {
        this.ctx.translate(x, y)
    }
    scale(sx: number, sy: number): void {
        this.ctx.scale(sx, sy)
    }
    rotate(angle: number): void {
        this.ctx.rotate(angle)
    }
    roundRect(x: number, y: number, width: number, height: number, radius: number | number[]): void {
        this.ctx.roundRect(x, y, width, height, radius)
    }
    setGlobalAlpha(alpha: number): void {
        this.ctx.globalAlpha = alpha
    }
    setBlend(operation: BlendOperation): void {
        this.ctx.globalCompositeOperation = operation
    }
    setLineWidth(width: number): void {
        this.ctx.lineWidth = width
    }
    setLineJoin(lineJoin: LineJoin): void {
        this.ctx.lineJoin = lineJoin
    }
    setLineCap(lineCap: LineCap): void {
        this.ctx.lineCap = lineCap
    }
    setLineDash(lineDash: number[]): void {
        this.ctx.setLineDash(lineDash)
    }
    setLineDashOffset(lineDashOffset: number): void {
        this.ctx.lineDashOffset = lineDashOffset
    }
    setMiterLimit(miterLimit: number): void {
        this.ctx.miterLimit = miterLimit
    }
    getCanvasFillStyle(fillStyle: FillStyle): string | CanvasGradient | CanvasPattern {

        if (fillStyle instanceof Gradient) {
            let canvasGredient: CanvasGradient
            if (!fillStyle.ref || fillStyle.ref.type !== fillStyle.elementType) {
                switch (fillStyle.elementType) {
                    case 'linear-gradient':
                        {
                            const gradient = fillStyle as LinearGradient
                            canvasGredient = this.ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1)
                        }
                        break
                    case 'radial-gradient':
                        {
                            const gradient = fillStyle as RadialGradient
                            canvasGredient = this.ctx.createRadialGradient(gradient.x0, gradient.y0, gradient.r0, gradient.x1, gradient.y1, gradient.r1)
                        }
                        break
                    case 'conic-gradient':
                        const gradient = fillStyle as ConicGradient
                        canvasGredient = this.ctx.createConicGradient(gradient.startAngle, gradient.x, gradient.y)
                }
                if (canvasGredient) {
                    for (let i = 0; i < fillStyle.stops.length; i++) {
                        canvasGredient.addColorStop(fillStyle.stops[i].offset, Color.toCSS_RGBA(fillStyle.stops[i].color))
                    }
                }
                fillStyle.ref = { type: fillStyle.elementType, gradient: canvasGredient }
            }
            return fillStyle.ref.gradient
        }
        if (fillStyle instanceof Pattern) {
            if (!fillStyle.ref) {
                fillStyle.ref = this.ctx.createPattern(fillStyle.source, fillStyle.repeat)
            }
            return fillStyle.ref
        }
        if (fillStyle instanceof Color) {
            return Color.toCSS_RGBA(fillStyle)
        }
        return '#000'

    }
    setFillStyle(fillStyle: FillStyle): void {
        this.ctx.fillStyle = this.getCanvasFillStyle(fillStyle)
    }
    setStrokeStyle(fillStyle: FillStyle): void {
        this.ctx.strokeStyle = this.getCanvasFillStyle(fillStyle)
    }
    setShadowColor(shadowColor: ColorInput): void {
        this.ctx.shadowColor = Color.toCSS_RGBA(Color.fromInput(shadowColor))
    }
    setShadowOffsetX(shadowOffsetX: number): void {
        this.ctx.shadowOffsetX = shadowOffsetX
    }
    setShadowOffsetY(shadowOffsetY: number): void {
        this.ctx.shadowOffsetY = shadowOffsetY
    }
    setShadowBlur(shadowBlur: number): void {
        this.ctx.shadowBlur = shadowBlur
    }
    setTextBaseline(textBaseline: TextBaseline): void {
        this.ctx.textBaseline = textBaseline
    }
    setTextAlign(textAlign: TextAlign): void {
        this.ctx.textAlign = textAlign
    }
    setWordSpacing(wordSpacing: number): void {
        this.ctx.wordSpacing = wordSpacing + 'px'
    }
    setLetterSpacing(letterSpacing: number): void {
        this.ctx.letterSpacing = letterSpacing + 'px'
    }
    setFont(style: Partial<FontStyles>): void {
        const { fontStyle = 'normal', fontFamily = 'sans-serif', fontWeight = 'normal', fontSize = 12, lineHeight } = style
        if (lineHeight) {
            this.ctx.font=`${fontStyle} ${fontWeight} ${fontSize}px/${lineHeight}px ${fontFamily}`
        } else {
            this.ctx.font=`${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
        }
    }

    fill(fillRule: FillRule): void {
        this.ctx.fill(fillRule)
    }
    stroke(): void {
        this.ctx.stroke()
    }
    fillText(text: string, x: number, y: number): void {
        this.ctx.fillText(text, x, y)
    }
    drawRect(x: number, y: number, width: number, height: number, paint: Paint): void {
        this.ctx.fillRect(x, y, width, height)
    }
    drawCircle(x: number, y: number, radius: number, paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawRoundRect(x: number, y: number, width: number, height: number, radius: number | number[], paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawEllipse(x: number, y: number, radiusX: number, radiusY: number, paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawPath(path: PathBuilder, paint: Paint): void {
        throw new Error("Method not implemented.");
    }
    drawImage(image: CanvasImageSource, x: number, y: number, w: number, h: number): void {
        throw new Error("Method not implemented.");
    }
    render(renderOptions: RenderOptions): void {
        throw new Error("Method not implemented.");
    }
    save(): void {
        this.ctx.save()
    }
    restore(): void {
        this.ctx.restore()
    }
    beginPath(): void {
        this.ctx.beginPath()
    }
    closePath(): void {
        this.ctx.closePath()
    }
    moveTo(x: number, y: number): void {
        this.ctx.moveTo(x, y)
    }
    lineTo(x: number, y: number): void {
        this.ctx.lineTo(x, y)
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.ctx.arcTo(x1, y1, x2, y2, radius)
    }
    quadraticCurveTo(x1: number, y1: number, x2: number, y2: number): void {
        this.ctx.quadraticCurveTo(x1, y1, x2, y2)
    }
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this.ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3)
    }
    rect(x: number, y: number, width: number, height: number): void {
        this.ctx.rect(x, y, width, height)
    }
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, ccw: boolean): void {
        this.ctx.arc(x, y, radius, startAngle, endAngle, ccw)
    }
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, ccw: boolean): void {
        this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, ccw)
    }

}