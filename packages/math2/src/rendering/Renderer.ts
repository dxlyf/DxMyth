import { EventEmitter } from "src/events/EventEmitter"
import { PathBuilder } from "src/math/PathBuilder"
import { BlendOperation, FillRule, FillStyle, FontStyle, FontStyles, FontWeight, LineCap, LineJoin, Paint, TextAlign, TextBaseline } from "./Paint"
import { Viewport } from "src/math/Viewport"
import { Matrix2D } from "src/math/Matrix2D"
import { Color, ColorInput, ColorValue } from "src/math/Color"
import { ConicGradient, LinearGradient, RadialGradient } from "src/math/Gradient"
import { Pattern } from "src/math/Pattern"

export type RendererEvents = {
    resize: [renderer: Renderer]
}
export interface RendererConstructor {
    new(): Renderer
}
export type RendererProps = {
    canvas?: HTMLCanvasElement | SVGElement
    width: number
    height: number
    dpr: number
}
export type RenderOptions = {
    //viewport:Viewport
}
export abstract class Renderer extends EventEmitter<RendererEvents> {
    renderType: string
    width: number = 0
    height: number = 0
    deviceWidth: number = 0
    deviceHeight: number = 0
    dpr: number = 1
    clearColorValue: ColorValue = null
    _matrix = Matrix2D.identity()
    abstract domElement: HTMLElement
    constructor() {
        super()
    }
    async init(options: Partial<RendererProps>): Promise<void> {
        await this.initContext(options)
        this.setSize(options.width, options.height, options.dpr)
    }
    abstract initContext(options:Partial<RendererProps>): Promise<void>
    setDpr(dpr: number) {
        this.dpr = dpr
        this.updateSize(false)
    }
    updateSize(updateStyle: boolean = true) {
        (this.domElement as HTMLCanvasElement).width = this.deviceWidth;
        (this.domElement as HTMLCanvasElement).height = this.deviceHeight
        if (updateStyle) {
            this.domElement.style.width = `${this.width}px`
            this.domElement.style.height = `${this.height}px`
        }
        this.emit('resize', this)
    }
    setSize(width: number, height: number, dpr: number = this.dpr) {
        this.width = width
        this.height = height
        this.deviceWidth = Math.floor(width * dpr)
        this.deviceHeight = Math.floor(height * dpr)
        this.dpr = dpr
        this.updateSize(true)
    }

    // 绘制路径
    clearColor(color: ColorInput) {
        this.clearColorValue = Color.fromInput(color)
    }
    createLinearGradient(x1: number, y1: number, x2: number, y2: number): LinearGradient {
        return new LinearGradient(x1, y1, x2, y2)
    }
    createRadialGradient(x: number, y: number, r: number, xCenter: number, yCenter: number, rCenter: number): RadialGradient {
        return new RadialGradient(x, y, r, xCenter, yCenter, rCenter)
    }
    createConicGradient(startAngle:number,x: number, y: number): ConicGradient {
        return new ConicGradient(startAngle,x, y)
    }
    createPattern() {
        return new Pattern()
    }
    // 变换
    abstract transform(a: number, b: number, c: number, d: number, e: number, f: number): void
    abstract setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void
    abstract getTransform(): Matrix2D
    abstract resetTransform(): void
    abstract translate(x: number, y: number): void
    abstract scale(sx: number, sy: number): void
    abstract rotate(angle: number): void


    abstract clear(): void // 清除画布
    abstract save(): void // 保存上下文
    abstract restore(): void // 恢复上下文
    // 矢量路径
    abstract beginPath(): void // 开始绘制路径
    abstract closePath(): void
    abstract moveTo(x: number, y: number): void // 移动到指定位置
    abstract lineTo(x: number, y: number): void // 绘制到指定位置
    abstract arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void
    abstract quadraticCurveTo(x1: number, y1: number, x2: number, y2: number): void
    abstract bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void
    abstract rect(x: number, y: number, width: number, height: number): void
    abstract roundRect(x: number, y: number, width: number, height: number, radius: number|number[]): void
    abstract arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, ccw: boolean): void
    abstract ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, ccw: boolean): void

    // 样式
    // 全局
    abstract setGlobalAlpha(alpha: number): void
    abstract setBlend(operation: BlendOperation): void
    // 描边
    abstract setLineWidth(width:number):void
    abstract setLineJoin(lineJoin:LineJoin):void
    abstract setLineCap(lineCap:LineCap):void
    abstract setLineDash(lineDash:number[]):void
    abstract setLineDashOffset(lineDashOffset:number):void
    abstract setMiterLimit(miterLimit:number):void

    // 填充
    abstract setFillStyle(fillStyle:FillStyle):void
    abstract setStrokeStyle(fillStyle:FillStyle):void
    // 阴影
    abstract setShadowColor(shadowColor: ColorInput): void
    abstract setShadowOffsetX(shadowOffsetX: number): void
    abstract setShadowOffsetY(shadowOffsetY: number): void
    abstract setShadowBlur(shadowBlur: number): void
    // 文本
    abstract setTextBaseline(textBaseline: TextBaseline): void
    abstract setTextAlign(textAlign: TextAlign): void
    abstract setWordSpacing(wordSpacing: number): void
    abstract setLetterSpacing(letterSpacing: number): void
    abstract setFont(style:Partial<FontStyles>): void

    // 绘制
    abstract fill(fillRule:FillRule): void
    abstract stroke(): void
    abstract fillText(text: string, x: number, y: number): void
    abstract drawRect(x: number, y: number, width: number, height: number, paint: Paint): void
    abstract drawCircle(x: number, y: number, radius: number, paint: Paint): void
    abstract drawRoundRect(x: number, y: number, width: number, height: number, radius: number|number[], paint: Paint): void
    abstract drawEllipse(x: number, y: number, radiusX: number, radiusY: number, paint: Paint): void
    abstract drawPath(path: PathBuilder, paint: Paint): void
    abstract drawImage(image: CanvasImageSource, x: number, y: number, w: number, h: number): void

    // 
    
    //
    abstract render(renderOptions: RenderOptions): void
}