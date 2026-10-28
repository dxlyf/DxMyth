import { Matrix2D } from '../math/Matrix2D';
import { IPath2DReadable } from '../math/Path2D';
import { Vector2Like } from '../math/Vector2';
import { Mesh2D } from './geometry';
import { BlendMode, FillRule, ImageSource, Paint, PaintColor, PaintSource } from './Paint';
import { Renderer2D, TextMeasurement } from './Renderer2D';
/** 渐变在 shader 中最多支持的 stop 数量，超出会做线性下采样 */
export declare const MAX_GRADIENT_STOPS = 8;
export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
/** 纹理采样区域，取值 0..1 */
export interface UvRect {
    u0: number;
    v0: number;
    u1: number;
    v1: number;
}
export interface GPU2DRendererOptions {
    /** 逻辑像素比，默认 1 */
    pixelRatio?: number;
}
/**
 * 与具体 GPU API 无关的渐变 uniform 数据。
 *
 * `kind`：0 纯色 / 1 线性 / 2 径向 / 3 锥形。
 * `params0`、`params1` 均为 vec4，含义随 kind 变化，
 * 与 `paint.fragment` 中约定的一致。
 */
export interface GradientUniforms {
    kind: number;
    params0: Float32Array;
    params1: Float32Array;
    colors: Float32Array;
    offsets: Float32Array;
    count: number;
}
/** 把 PaintSource 打包成 shader uniform；pattern 由纹理程序处理，返回 null */
export declare function resolveGradient(source: PaintSource): GradientUniforms | null;
/** 取 PaintSource 的代表色，文字栅格化时用于近似渐变 / pattern */
export declare function sourceColorCSS(source: PaintSource): string;
export type BlendFactorToken = 'zero' | 'one' | 'src-color' | 'one-minus-src-color' | 'src-alpha' | 'one-minus-src-alpha' | 'dst-color' | 'one-minus-dst-color' | 'dst-alpha' | 'one-minus-dst-alpha';
export interface BlendState {
    equation: 'add' | 'min' | 'max';
    src: BlendFactorToken;
    dst: BlendFactorToken;
    srcAlpha: BlendFactorToken;
    dstAlpha: BlendFactorToken;
}
/**
 * 把 Canvas globalCompositeOperation 映射成可分离混合。
 *
 * 可分离模式（source-over / multiply / screen / ...）是精确的，
 * 依赖 shader 的模式（hue / saturation / color / luminosity / overlay 等）
 * 退化为 source-over，保证在各后端上与 Canvas 结果大致一致。
 */
export declare function resolveBlend(mode: BlendMode): BlendState;
export declare abstract class GPU2DRenderer implements Renderer2D {
    readonly canvas: HTMLCanvasElement | OffscreenCanvas;
    protected _width: number;
    protected _height: number;
    protected _pixelRatio: number;
    protected readonly _matrix: Matrix2D;
    /** 当前嵌套的裁剪层数，0 表示没有裁剪 */
    protected _clipDepth: number;
    private readonly _path;
    private readonly _scratch;
    private readonly _stack;
    private readonly _geometryCache;
    private _shapeScratch;
    private readonly _imageScratch;
    private _measureCanvas;
    private _measureCtx;
    private readonly _textCache;
    protected constructor(canvas?: HTMLCanvasElement | OffscreenCanvas, options?: GPU2DRendererOptions);
    /** 子类完成 GPU 初始化后调用，用于同步视口等资源 */
    protected initialize(): void;
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
    drawText(text: string, x: number, y: number, paint: Paint): void;
    measureText(text: string, paint: Paint): TextMeasurement;
    /**
     * 把多行文字栅格化到离屏 canvas，返回可当作纹理提交的方块。
     *
     * 对齐与基线在这里自行换算，因此纹理左上角是块的包围盒原点，
     * 提交时只需按用户坐标铺一个 quad。
     */
    private _textTexture;
    private _measureContext;
    private _paintEntry;
    private _drawFill;
    private _drawStroke;
    private _fillMesh;
    private _strokeMesh;
    /** 路径之外的补集（大矩形 + 路径本身，evenodd），用于 outside 描边裁剪 */
    private _outsideMesh;
    private _entryFor;
    private _resetScratch;
    private _pushClipMesh;
    private _popClipTo;
    /** 当前矩阵 × pixelRatio，得到从用户坐标到设备像素的变换 */
    protected _deviceMatrix(): Matrix2D;
    /** 当前用户坐标到设备像素的近似缩放量，用于文字超采样 */
    protected _deviceScale(): number;
    /**
     * 生成 shape 程序的顶点：[x_dev, y_dev, lx, ly]。
     *
     * 设备坐标用于定位，局部坐标用于在片元里计算渐变 / pattern 的采样位置。
     * 返回的数组是复用缓冲区，调用方必须立即上传，不能跨帧持有。
     */
    protected shapeVertices(mesh: Mesh2D, matrix: Matrix2D): Float32Array;
    /**
     * 生成 image 程序的顶点：[x_dev, y_dev, u, v]，顺序为左上、右上、右下、左下。
     * 索引固定为 (0,1,2, 0,2,3)。
     */
    protected imageVertices(dst: Rect, uv: UvRect, matrix: Matrix2D): Float32Array;
    flush(): void;
    dispose(): void;
    /** canvas 尺寸变化（含首次初始化）时重建视口相关资源 */
    protected abstract onResize(): void;
    protected abstract onClear(color: PaintColor | null): void;
    protected abstract onClearRectDevice(x: number, y: number, width: number, height: number): void;
    /** 提交一个填充 / 描边三角形网格；source 为 pattern 时由子类切换到纹理程序 */
    protected abstract submitMesh(mesh: Mesh2D, matrix: Matrix2D, source: PaintSource, opacity: number, blend: BlendMode): void;
    protected abstract submitImage(image: ImageSource, matrix: Matrix2D, dst: Rect, uv: UvRect, opacity: number, blend: BlendMode, smoothing: boolean): void;
    /** 进入一层裁剪：只在 stencil == level - 1 处写 stencil，把结果写成 level */
    protected abstract beginClip(mesh: Mesh2D, matrix: Matrix2D, level: number): void;
    /** 退出裁剪：把 stencil 从 from 逐级回退到 to */
    protected abstract endClip(from: number, to: number): void;
    protected abstract onFlush(): void;
    protected abstract onDispose(): void;
}
