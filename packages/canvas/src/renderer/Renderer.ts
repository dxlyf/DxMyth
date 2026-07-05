import { EventEmitter } from "src/core/EventEmitter";
import { ConicGradient, LinearGradient, RadialGradient } from "src/core/Gradient";
import { Pattern } from "src/core/Pattern";
import { Matrix2D } from "src/math/Matrix2D";
import { PathBuilder } from "src/math/PathBuilder";
import { FillRule, FillStrokeStyles, FillStyles, ShadowStyles, StrokeStyles, TextStyles, TextAlign, TextBaseline, Direction, GlobalCompositeOperation } from "src/types/FillStrokeStyles";
import { IRenderer, RenderEvents, IRendererOptions } from "src/types/Renderer";
import { RenderState } from "./RenderState";
import { PathStroke } from "src/math/PathStroke";
import { INode } from "src/types/Node";


export abstract class BaseRenderer<Options extends IRendererOptions> extends EventEmitter<RenderEvents> implements IRenderer<Options> {
    currentState: RenderState
    currentPath: PathBuilder
    width: number;
    height: number;
    dpr: number;
    options: Options
    constructor(options: Options) {
        super()
        this.width = options.width
        this.height = options.height
        this.dpr = options.dpr ?? 1
        this.options = options
        this.currentState = new RenderState()
        this.currentPath = new PathBuilder()
    }
    setSize(width: number, height: number, dpr: number = this.dpr) {
        this.width = width
        this.height = height
        this.dpr = dpr
        this.onResize(width, height, dpr)
        this.emit('resize', this)
    }
    abstract onResize(width: number, height: number, dpr: number): void
    abstract clear(color: string): void
    abstract clearRect(x: number, y: number, width: number, height: number): void
    abstract render(node: INode<any>): void 
    
     
    // ---- 状态管理：委托给 RenderState ----
    save(): void {
        this.currentState.save()
    }
    restore(): void {
        this.currentState.restore()
    }
    reset(): void {
        this.currentPath.reset()
        this.currentState.reset()
    }

    // ---- 变换：委托给 RenderState ----
    getTransform(): Matrix2D {
        return this.currentState.currentTransform
    }
    resetTransform(): void {
        this.currentState.resetTransform()
    }
    rotate(angle: number): void {
        this.currentState.rotate(angle)
    }
    scale(x: number, y: number): void {
        this.currentState.scale(x, y)
    }
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.currentState.setTransform(a, b, c, d, e, f)
    }
    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.currentState.transform(a, b, c, d, e, f)
    }
    translate(x: number, y: number): void {
        this.currentState.translate(x, y)
    }

    // ---- 路径操作：委托给 PathBuilder ----
    beginPath(): void {
        this.currentPath.reset()
    }
    moveTo(x: number, y: number): void {
        this.currentPath.moveTo(x, y)
    }
    lineTo(x: number, y: number): void {
        this.currentPath.lineTo(x, y)
    }
    quadraticCurveTo(x1: number, y1: number, x2: number, y2: number): void {
        this.currentPath.quadraticCurveTo(x1, y1, x2, y2)
    }
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this.currentPath.bezierCurveTo(x1, y1, x2, y2, x3, y3)
    }
    arc(x: number, y: number, r: number, startAngle: number, endAngle: number, ccw: boolean): void {
        this.currentPath.arc(x, y, r, startAngle, endAngle, ccw)
    }
    arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void {
        this.currentPath.arcTo(x1, y1, x2, y2, r)
    }
    ellipse(x: number, y: number, r: number, rotation: number, startAngle: number, endAngle: number, ccw: boolean): void {
        this.currentPath.ellipse(x, y, r, r, rotation, startAngle, endAngle, ccw)
    }
    rect(x: number, y: number, width: number, height: number): void {
        this.currentPath.rect(x, y, width, height)
    }
    roundRect(x: number, y: number, width: number, height: number, r: number): void {
        this.currentPath.roundRect(x, y, width, height, r)
    }
    closePath(): void {
        this.currentPath.closePath()
    }


    // ---- 渐变与图案：返回项目自定义类型，结构上兼容 CanvasGradient/CanvasPattern ----
    createConicGradient(startAngle: number, x: number, y: number) {
        const g = new ConicGradient()
        g.startAngle = startAngle
        g.x = x
        g.y = y
        return g
    }
    createLinearGradient(x0: number, y0: number, x1: number, y1: number) {
        const g = new LinearGradient()
        g.x0 = x0
        g.y0 = y0
        g.x1 = x1
        g.y1 = y1
        return g
    }
    createPattern(image: CanvasImageSource, repetition: string | null) {
        const p = new Pattern()
        p.image = image
        p.repetition = repetition ?? 'repeat'
        return p
    }
    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) {
        const g = new RadialGradient()
        g.x0 = x0
        g.y0 = y0
        g.r0 = r0
        g.x1 = x1
        g.y1 = y1
        g.r1 = r1
        return g
    }

    // ---- 样式：写入 RenderState ----
    setStyles(styles: Partial<FillStrokeStyles>): void {
        const state = this.currentState
        const keys = Object.keys(styles) as (keyof FillStrokeStyles)[]
        for (const key of keys) {
            const value = styles[key]
            if (value === undefined) continue
                ; (state as any)[key] = value
        }
    }
    setFillStyle(fillStyles: Partial<FillStyles>): void {
        this.setStyles(fillStyles)
    }
    setStrokeStyle(strokeStyles: Partial<StrokeStyles>): void {
        this.setStyles(strokeStyles)
    }
    setShadowStyle(shadowStyle: Partial<ShadowStyles>): void {
        this.setStyles(shadowStyle)
    }
    setTextStyle(textStyles: Partial<TextStyles>): void {
        this.setStyles(textStyles)
    }
    isPointInPath(x: number, y: number, fillRule?: FillRule): boolean;
    isPointInPath(path: PathBuilder, x: number, y: number, fillRule?: FillRule): boolean;
    isPointInPath(path: unknown, x: unknown, y?: unknown, fillRule?: unknown): boolean {
        let curPath = this.currentPath
        if (path instanceof PathBuilder) {
            curPath = path
        } else {
            fillRule = y
            y = x
            x = path
        }
        return curPath.isPointInPath(x as number, y as number, fillRule as FillRule)
    }
    isPointInStroke(x: number, y: number): boolean;
    isPointInStroke(path: PathBuilder, x: number, y: number): boolean;
    isPointInStroke(path: unknown, x: unknown, y?: unknown): boolean {
        let curPath = this.currentPath
        if (path instanceof PathBuilder) {
            curPath = path
        } else {
            y = x
            x = path
        }
        return PathStroke.default().stroke(curPath, {
            lineCap: this.currentState.lineCap as any,
            lineJoin: this.currentState.lineJoin as any,
            lineWidth: this.currentState.lineWidth,
        }).isPointInPath(x as number, y as number)

    }

    // ---- 绘制：由子类覆盖 ----
    abstract clip(fillRule?: FillRule): void;
    abstract clip(path: PathBuilder, fillRule?: FillRule): void;
    abstract clip(path?: unknown, fillRule?: unknown): void
    abstract fill(fillRule?: FillRule): void;
    abstract fill(path: PathBuilder, fillRule?: FillRule): void;
    abstract fill(path?: unknown, fillRule?: unknown): void
    abstract stroke(): void;
    abstract stroke(path: PathBuilder): void;
    abstract stroke(path?: unknown): void
    abstract fillText(text: string, x: number, y: number): void
    abstract strokeText(text: string, x: number, y: number): void
    abstract measureText(text: string): TextMetrics;
    abstract drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    abstract drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    abstract drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    abstract drawImage(image: unknown, sx: unknown, sy: unknown, sw?: unknown, sh?: unknown, dx?: unknown, dy?: unknown, dw?: unknown, dh?: unknown): void
    abstract createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    abstract createImageData(imageData: ImageData): ImageData;
    abstract createImageData(sw: unknown, sh?: unknown, settings?: unknown): ImageData
    abstract getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings): ImageData
    abstract putImageData(imageData: ImageData, dx: number, dy: number): void;
    abstract putImageData(imageData: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    abstract putImageData(imageData: unknown, dx: unknown, dy: unknown, dirtyX?: unknown, dirtyY?: unknown, dirtyWidth?: unknown, dirtyHeight?: unknown): void

}
