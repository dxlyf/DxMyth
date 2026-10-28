import { Matrix2D } from '../math/Matrix2D';
import { IPath2DReadable } from '../math/Path2D';
import { Vector2Like } from '../math/Vector2';
import { FillRule, ImageSource, PaintColor, Paint } from './Paint';
import { Renderer2D, TextMeasurement } from './Renderer2D';
export interface CanvasRendererOptions {
    /** 逻辑像素比，默认 1（一般用 resize 指定） */
    pixelRatio?: number;
}
export declare class CanvasRenderer implements Renderer2D {
    readonly canvas: HTMLCanvasElement | OffscreenCanvas;
    private readonly _ctx;
    private _width;
    private _height;
    private _pixelRatio;
    private readonly _matrix;
    private readonly _path;
    private readonly _stack;
    constructor(canvas?: HTMLCanvasElement | OffscreenCanvas, options?: CanvasRendererOptions);
    get width(): number;
    get height(): number;
    get pixelRatio(): number;
    get currentTransform(): Readonly<Matrix2D>;
    resize(width: number, height: number, pixelRatio?: number): this;
    clear(color?: PaintColor | null): void;
    clearRect(x: number, y: number, width: number, height: number): void;
    save(): void;
    restore(): void;
    resetTransform(): void;
    setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
    transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
    getTransform(out?: Matrix2D): Matrix2D;
    translate(x: number, y: number): void;
    rotate(radians: number): void;
    scale(x: number, y?: number): void;
    private _syncTransform;
    beginPath(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    closePath(): void;
    rect(x: number, y: number, w: number, h: number): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    clip(pathOrRule?: IPath2DReadable | FillRule, fillRule?: FillRule): void;
    drawImage(image: ImageSource, dx: number, dy: number, paint?: Paint): void;
    drawImage(image: ImageSource, dx: number, dy: number, dw: number, dh: number, paint?: Paint): void;
    drawImage(image: ImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, paint?: Paint): void;
    drawPath(path: IPath2DReadable, paint: Paint): void;
    drawRect(x: number, y: number, width: number, height: number, paint: Paint): void;
    drawRoundRect(x: number, y: number, width: number, height: number, radius: number | number[], paint: Paint): void;
    drawEllipse(cx: number, cy: number, radiusX: number, radiusY: number, paint: Paint): void;
    drawEllipseArc(cx: number, cy: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterClockwise: boolean, paint: Paint): void;
    drawCircle(cx: number, cy: number, radius: number, paint: Paint): void;
    drawArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, counterClockwise: boolean, paint: Paint): void;
    drawLine(x1: number, y1: number, x2: number, y2: number, paint: Paint): void;
    drawPolyline(points: Vector2Like[], paint: Paint, closed?: boolean): void;
    private _ellipsePath;
    drawText(text: string, x: number, y: number, paint: Paint): void;
    measureText(text: string, paint: Paint): TextMeasurement;
    private _applyTextState;
    private _nativePath;
    private _paintPath;
    /** 按 strokeAlign 绘制描边：inside/outside 用 clip + 双倍线宽近似 */
    private _strokePath;
    private _strokeStyle;
    private _applyPaintState;
    private _makeStyle;
    private _makeGradient;
    private _makePattern;
    /** 当前视口在用户坐标系下的包围盒，用于构造 outside 描边的补集裁剪路径 */
    private _localViewport;
    flush(): void;
    dispose(): void;
}
export declare function createCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas;
export declare function fontString(text: Paint['text']): string;
export declare function textLineHeight(paint: Paint): number;
/** 取图片源的自然尺寸（CanvasImageSource 没有统一的宽高字段） */
export declare function imageSize(image: ImageSource): {
    width: number;
    height: number;
};
