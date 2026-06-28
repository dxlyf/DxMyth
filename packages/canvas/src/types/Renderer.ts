import { PathBuilder } from "src/math/PathBuilder"
import { Matrix2D } from "src/math/Matrix2D"
import { FillRule,FillStrokeStyles, FillStyle, FillStyles, LineCap, LineJoin, ShadowStyles, StrokeStyle, StrokeStyles, TextStyles, TextAlign, TextBaseline, Direction, GlobalCompositeOperation } from "./FillStrokeStyles"
import { EventEmitter } from "src/core/EventEmitter"
import { ConicGradient, LinearGradient, RadialGradient } from "src/core/Gradient"
import { Pattern } from "src/core/Pattern"
import { INode } from "./Node"

export type IRendererOptions={
    width:number
    height:number
    dpr?:number
}
export type RenderEvents={
    resize:[render:IRenderer]
}
/**
 * 图形渲染器
 * 不同的渲染器实现不同的渲染逻辑
 * @interface
 */
export interface IRenderer<Options extends IRendererOptions=any> extends EventEmitter<RenderEvents> {
    options:Options
    width:number
    height:number
    dpr:number
    setSize:(width:number,height:number,dpr?:number)=>void
    onResize:(width:number,height:number,dpr:number)=>void
    // 渲染
    render(node:INode<any>):void
    // 状态管理
    clear(color: string): void
    clearRect(x: number, y: number, width: number, height: number): void
    save(): void
    restore(): void
    reset(): void

 
    // 变换
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/getTransform) */
    getTransform(): Matrix2D;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/resetTransform) */
    resetTransform(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/rotate) */
    rotate(angle: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/scale) */
    scale(x: number, y: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setTransform) */
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/transform) */
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/translate) */
    translate(x: number, y: number): void;

    // 路径操作
    beginPath(): void
    moveTo(x: number, y: number): void
    lineTo(x: number, y: number): void
    quadraticCurveTo(x1: number, y1: number, x2: number, y2: number): void
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void
    arc(x: number, y: number, r: number, startAngle: number, endAngle: number, ccw: boolean): void
    arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void
    ellipse(x: number, y: number, r: number,rotation:number, startAngle: number, endAngle: number, ccw: boolean): void
    rect(x: number, y: number, width: number, height: number): void
    roundRect(x: number, y: number, width: number, height: number, r: number): void
    closePath(): void

    // 渐变
    createConicGradient(startAngle: number, x: number, y: number): ConicGradient;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/createLinearGradient) */
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): LinearGradient;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/createPattern) */
    createPattern(image: CanvasImageSource, repetition: string | null): Pattern;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/createRadialGradient) */
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): RadialGradient;
   
    // 剪切
    clip(fillRule?: FillRule): void;
    clip(path: PathBuilder, fillRule?: FillRule): void;
    // 填充和绘制--
    setStyles(styles: Partial<FillStrokeStyles>): void 
    setFillStyle(fillStyles:Partial<FillStyles>):void // 填充样式
    setStrokeStyle(strokeStyles:Partial<StrokeStyles>):void // 绘制样式
    setShadowStyle(shadowStyle:Partial<ShadowStyles>):void // 阴影
    setTextStyle(textStyles:Partial<TextStyles>):void // 文本
  //  fillRect(x:number,y:number,width:number,height:number):void

    fill(fillRule?: FillRule): void
    fill(path: PathBuilder, fillRule?: FillRule): void
    stroke(): void
    stroke(path: PathBuilder): void
    // 填充文本
    fillText(text: string, x: number, y: number): void
    strokeText(text: string, x: number, y: number): void
    measureText(text: string): TextMetrics;

    isPointInPath(x: number, y: number, fillRule?: FillRule): boolean;
    isPointInPath(path: PathBuilder, x: number, y: number, fillRule?: FillRule): boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/isPointInStroke) */
    isPointInStroke(x: number, y: number): boolean;
    isPointInStroke(path: PathBuilder, x: number, y: number): boolean;
    // 绘制图片
    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/createImageData) */
    createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    createImageData(imageData: ImageData): ImageData;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/getImageData) */
    getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/putImageData) */
    putImageData(imageData: ImageData, dx: number, dy: number): void;
    putImageData(imageData: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
}
