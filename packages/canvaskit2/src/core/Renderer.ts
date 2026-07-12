import { merge } from "src/utils/merge"
import { Viewport } from "./Viewport"
import { Engine } from "./Engine"
import { EventEmitter } from "src/event/EventEmitter"
import { type ColorValue, ColorLike, Matrix2D, Matrix2DLike } from '@dxyl/math2'
import { ConicGradient, LinearGradient, RadialGradient } from "./Gradient"
import { ImagePattern } from "./Pattern"
import { Container } from "./Container"
import { Shape } from "./Shape"
import { CKPath2D } from "src/ck"

export type {
    ColorValue
}
export type ColorStop = {
    offset: number
    color: ColorLike
}
export type Paintolor = {
    type: 'color'
    value: ColorLike
}
export type Gradient = {
    type: 'gradient'
    elementType: 'linear-gradient' | 'radial-gradient' | 'conic-gradient'
    stops: ColorStop[]
    matrix?:Matrix2DLike
    clone(): Gradient
    copy(source: Gradient): void
}
export type Pattern = {
    type: 'pattern'
    elementType: 'image'
    repeat?: 'repeat' | 'repeat-x' | 'repeat-y'
    source: CanvasImageSource
    matrix?:Matrix2DLike
    clone(): Pattern
    copy(source: Pattern): void
}
export type FillStyle = Paintolor | Gradient | Pattern
export type StrokeStyle = Paintolor | Gradient | Pattern

export type RenderStyle = {

    fillStyle?: FillStyle
    fillRule?: FillRule
    strokeStyle?: StrokeStyle
    strokeAlign?: StrokeAlign
    firstStroke?: boolean
    lineWidth?: number
    lineCap?: LineCap
    lineJoin?: LineJoin
    lineDash?: number[]
    lineDashOffset?: number
    miterLimit?: number
    closePath?:boolean
    // 合成
    opacity?:number
    blend?:CompositeOperation
    // 阴影
    shadowBlur?: number
    shadowColor?: ColorLike
    shadowOffsetX?: number
    shadowOffsetY?: number
    // 字体
    fontSize?: number
    fontFamily?: string
    fontWeight?: FontWeight
    fontStyle?: FontStyle
    fontKerning?: FontKerning
    fontVariantCaps?: FontVariantCaps // 字体变体，all-petite-caps、all-small-caps、normal、petite-caps、small-caps、titling-caps或unicase
    fontStretch?: FontStretch
    letterSpacing?: string

    // 文本

    textAlign?: string
    textBaseline?: string
    wordSpacing?: string // 单词间距，数字或字符串
}
export type StrokeAlign='center'|'outside'|'inside'
export type FillRule = "evenodd" | "nonzero"; // 填充规则，evenodd或nonzero
export type FontKerning = "auto" | "none" | "normal"; // 字体间距，auto、none或normal
// 字体拉伸
export type FontStretch = "condensed" | "expanded" | "extra-condensed" | "extra-expanded" | "normal" | "semi-condensed" | "semi-expanded" | "ultra-condensed" | "ultra-expanded";
// 使你可以控制大写字母特殊字符的使用。
export type FontVariantCaps = "all-petite-caps" | "all-small-caps" | "normal" | "petite-caps" | "small-caps" | "titling-caps" | "unicase";
export type LineCap = "butt" | "round" | "square" // 线帽样式，butt、round或square
export type LineJoin = "miter" | "round" | "bevel" // 线连接样式，miter、round或bevel
export type FontWeight = number | string // 字体粗细，数字或字符串
export type FontStyle = "normal" | "italic" // 字体样式，正常或斜体
export type TextAlign = "center" | "end" | "left" | "right" | "start"; // 文本对齐方式，left、right或center
export type TextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top"; // 文本基线，top、bottom或middle
export type TextRendering = "auto" | "geometricPrecision" | "optimizeLegibility" | "optimizeSpeed";



export type CompositeOperation = "color" | "color-burn" | "color-dodge" | "copy" | "darken" | "destination-atop" | "destination-in" | "destination-out" | "destination-over" | "difference" | "exclusion" | "hard-light" | "hue" | "lighten" | "lighter" | "luminosity" | "multiply" | "overlay" | "saturation" | "screen" | "soft-light" | "source-atop" | "source-in" | "source-out" | "source-over" | "xor";
/** 合成操作枚举 */
export const CompositeOperationEnum: Record<CompositeOperation, CompositeOperation> = {
    'color': 'color',                  // 颜色合成，只保留色调和饱和度，不改变亮度
    'color-burn': 'color-burn',        // 颜色加深，使底层变暗以反映顶层颜色
    'color-dodge': 'color-dodge',      // 颜色减淡，使底层变亮以反映顶层颜色
    'copy': 'copy',                    // 复制，只显示顶层，底层完全被覆盖
    'darken': 'darken',                // 变暗，取两层中较暗的像素
    'destination-atop': 'destination-atop',   // 目标置顶，底层只在与顶层重叠处显示，顶层在重叠区域外透明
    'destination-in': 'destination-in',       // 目标内，只在两层重叠处显示底层，其余透明
    'destination-out': 'destination-out',     // 目标外，在顶层之外的区域显示底层
    'destination-over': 'destination-over',   // 目标之上，底层绘制在顶层之上
    'difference': 'difference',        // 差值，取两层像素值的绝对差
    'exclusion': 'exclusion',          // 排除，类似差值但对比度更低
    'hard-light': 'hard-light',        // 强光，根据顶层颜色决定乘或滤色，效果强烈
    'hue': 'hue',                      // 色调，保留底层的亮度和饱和度，使用顶层的色调
    'lighten': 'lighten',              // 变亮，取两层中较亮的像素
    'lighter': 'lighter',              // 加亮，两层像素值相加（适用于叠加发光效果）
    'luminosity': 'luminosity',        // 亮度，保留底层的色调和饱和度，使用顶层的亮度
    'multiply': 'multiply',            // 正片叠底，两层颜色相乘，结果更暗
    'overlay': 'overlay',              // 叠加，根据底层颜色决定乘或滤色
    'saturation': 'saturation',        // 饱和度，保留底层的色调和亮度，使用顶层的饱和度
    'screen': 'screen',                // 滤色，两层颜色反色相乘，结果更亮
    'soft-light': 'soft-light',        // 柔光，根据顶层颜色决定变暗或变亮，效果柔和
    'source-atop': 'source-atop',      // 源置顶，顶层只在与底层重叠处显示，底层在重叠区域外透明
    'source-in': 'source-in',          // 源内，只在两层重叠处显示顶层，其余透明
    'source-out': 'source-out',        // 源外，在底层之外的区域显示顶层
    'source-over': 'source-over',      // 源之上，顶层绘制在底层之上（默认）
    'xor': 'xor',                      // 异或，重叠区域透明，非重叠区域正常显示
}
export interface RendererProps {
    canvas?: HTMLCanvasElement | SVGElement
    width?: number
    height?: number
    dpr?: number
}

export type RendererEvents = {
    resize: [width: number, height: number]
}
export abstract class Renderer<Props extends RendererProps = RendererProps> extends EventEmitter<RendererEvents> {
    type: string
    props: Props
    viewport: Viewport
    width: number
    height: number
    engine: Engine
    declare domElement: HTMLElement
    constructor(props?: Partial<Props>) {
        super()
        this.props = merge({ dpr: window.devicePixelRatio, width: 0, height: 0 } as Props, props || {})
        this.viewport = new Viewport(this.props.width, this.props.height)
    }
    get dpr() {
        return this.props.dpr
    }
    get viewWidth() {
        return this.viewport.width
    }
    get viewHeight() {
        return this.viewport.height
    }
    setSize(width: number, height: number) {
        this.width = Math.floor(width * this.props.dpr)
        this.height = Math.floor(height * this.props.dpr)
        this.viewport.size.set(width, height)
        this.updateViewSize(width, height)
        this.emit('resize', width, height)
    }
    abstract init(): void
    abstract updateViewSize(width: number, height: number): void
    createPath(): Path2D{
        return new Path2D()
    }
  //  abstract hitTest(x:number,y:number,shape:Shape):boolean
    abstract render(root:Container): void
    abstract renderShape(shape:Shape):void
    abstract renderImage(shape:Shape):void 
    abstract renderText(shape:Shape):void 
    abstract drawPath(path:CKPath2D):void

    // 绘制
    createLinearGradient(x0: number, y0: number, x1: number, y1: number) {
        return new LinearGradient(x0, y0, x1, y1)
    }
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) {
        return new RadialGradient(x0, y0, r0, x1, y1, r1)
    }
    createConicGradient(startAngle: number, x: number, y: number) {
        return new ConicGradient(startAngle, x, y)
    }
    createPattern() {
        return new ImagePattern()
    }


    // ---- 状态管理：委托给 RenderState ----
    //  isContextLost(): boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/reset) */
    // abstract reset(): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/restore) */
    // abstract restore(): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/save) */
    // abstract save(): void;

    // // ---- 变换：委托给 RenderState ----
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/getTransform) */
    // abstract getTransform(): Matrix2D;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/resetTransform) */
    // abstract resetTransform(): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rotate) */
    // abstract rotate(angle: number): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/scale) */
    // abstract scale(x: number, y: number): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setTransform) */
    // abstract setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    // abstract setTransform(transform?: DOMMatrix2DInit): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/transform) */
    // abstract transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/translate) */
    // abstract translate(x: number, y: number): void;

    // // 矩形
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/clearRect) */
    // abstract clearRect(x: number, y: number, w: number, h: number): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillRect) */
    // abstract fillRect(x: number, y: number, w: number, h: number): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/strokeRect) */
    // abstract strokeRect(x: number, y: number, w: number, h: number): void;
    // // 绘制路径
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arc) */
    abstract arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/arcTo) */
    abstract arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) */
    abstract bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/closePath) */
    abstract closePath(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/ellipse) */
    abstract ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/lineTo) */
    abstract lineTo(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/moveTo) */
    abstract moveTo(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo) */
    abstract quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rect) */
    abstract rect(x: number, y: number, w: number, h: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/roundRect) */
    abstract roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;

    // // 绘制

    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/beginPath) */
    // abstract beginPath(): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/clip) */
    // abstract clip(fillRule?: FillRule): void;
    // abstract clip(path: Path2D, fillRule?: FillRule): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fill) */
    // abstract fill(fillRule?: FillRule): void;
    // abstract fill(path: Path2D, fillRule?: FillRule): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/isPointInPath) */
     abstract isPointInPath(x: number, y: number, fillRule?: FillRule): boolean;
     abstract isPointInPath(path: Path2D, x: number, y: number, fillRule?: FillRule): boolean;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/isPointInStroke) */
     abstract isPointInStroke(x: number, y: number): boolean;
     abstract isPointInStroke(path: Path2D, x: number, y: number): boolean;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/stroke) */
    // abstract stroke(): void;
    // abstract stroke(path: Path2D): void;

    // // 文本
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillText) */
    // abstract fillText(text: string, x: number, y: number, maxWidth?: number): void;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/measureText) */
    // abstract measureText(text: string): TextMetrics;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/strokeText) */
    // abstract strokeText(text: string, x: number, y: number, maxWidth?: number): void;

    // 图像
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/drawImage) */
    // abstract drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    // abstract drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    // abstract drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;

    // abstract createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    // abstract createImageData(imageData: ImageData): ImageData;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/getImageData) */
    // abstract getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    // /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/putImageData) */
    // abstract putImageData(imageData: ImageData, dx: number, dy: number): void;
    // abstract putImageData(imageData: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    // abstract clip(fillRule?: FillRule): void;
    // abstract clip(path: PathBuilder, fillRule?: FillRule): void;
    // abstract clip(path?: unknown, fillRule?: unknown): void
    // abstract fill(fillRule?: FillRule): void;
    // abstract fill(path: PathBuilder, fillRule?: FillRule): void;
    // abstract fill(path?: unknown, fillRule?: unknown): void
    // abstract stroke(): void;
    // abstract stroke(path: PathBuilder): void;
    // abstract stroke(path?: unknown): void
    // abstract fillText(text: string, x: number, y: number): void
    // abstract strokeText(text: string, x: number, y: number): void
    // abstract measureText(text: string): TextMetrics;
    // abstract drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    // abstract drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    // abstract drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    // abstract drawImage(image: unknown, sx: unknown, sy: unknown, sw?: unknown, sh?: unknown, dx?: unknown, dy?: unknown, dw?: unknown, dh?: unknown): void
    // abstract createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    // abstract createImageData(imageData: ImageData): ImageData;
    // abstract createImageData(sw: unknown, sh?: unknown, settings?: unknown): ImageData
    // abstract getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings): ImageData
    // abstract putImageData(imageData: ImageData, dx: number, dy: number): void;
    // abstract putImageData(imageData: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    // abstract putImageData(imageData: unknown, dx: unknown, dy: unknown, dirtyX?: unknown, dirtyY?: unknown, dirtyWidth?: unknown, dirtyHeight?: unknown): void


}
