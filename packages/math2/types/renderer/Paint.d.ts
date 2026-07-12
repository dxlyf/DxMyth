import { Color, ColorLike } from '../math/Color';
import { PaintShader } from './PaintShader';
import { StrokeCap, StrokeJoin, toCanvasLineCap, toCanvasLineJoin, toCanvasStyle, toCanvasGradient, applyCanvasDash } from './canvasPaint';
export { StrokeCap, StrokeJoin, toCanvasLineCap, toCanvasLineJoin, toCanvasStyle, toCanvasGradient, applyCanvasDash, };
/** 绘制样式：填充 / 描边 / 两者 */
export declare enum PaintStyle {
    Fill = 0,
    Stroke = 1,
    FillAndStroke = 2
}
/** 混合模式（与 Canvas globalCompositeOperation 对齐） */
export declare const enum BlendMode {
    SourceOver = "source-over",
    SourceIn = "source-in",
    SourceOut = "source-out",
    SourceAtop = "source-atop",
    DestinationOver = "destination-over",
    DestinationIn = "destination-in",
    DestinationOut = "destination-out",
    DestinationAtop = "destination-atop",
    Lighter = "lighter",
    Copy = "copy",
    Xor = "xor",
    Multiply = "multiply",
    Screen = "screen",
    Overlay = "overlay",
    Darken = "darken",
    Lighten = "lighten",
    ColorDodge = "color-dodge",
    ColorBurn = "color-burn",
    HardLight = "hard-light",
    SoftLight = "soft-light",
    Difference = "difference",
    Exclusion = "exclusion",
    Hue = "hue",
    Saturation = "saturation",
    Color = "color",
    Luminosity = "luminosity"
}
/**
 * Paint — 存储绘制样式的通用属性类。
 *
 * 直接对应 Canvas 2D 的绘制属性集，使用时通过 applyTo(ctx) 一键应用到上下文。
 *
 * @example
 * ```ts
 * const paint = new Paint()
 * paint.setColor(Color.fromBytes(255, 0, 0))
 * paint.style = PaintStyle.Fill
 *
 * const paint2 = paint.clone()
 * paint2.setStrokeWidth(2)
 * paint2.style = PaintStyle.Stroke
 * ```
 */
export declare class Paint {
    /** 填充/描边颜色 */
    color: Color;
    /** 绘制样式 */
    style: PaintStyle;
    /** 描边宽度（像素） */
    strokeWidth: number;
    /** 描边端点样式 */
    strokeCap: StrokeCap;
    /** 描边连接样式 */
    strokeJoin: StrokeJoin;
    /** 斜接限制（仅 StrokeJoin.Miter 时生效） */
    strokeMiter: number;
    /** 全局透明度 (0-1) */
    alpha: number;
    /** 是否开启抗锯齿 */
    antiAlias: boolean;
    /** 混合模式 */
    blendMode: BlendMode;
    /** shader（渐变/图案/纯色），优先级高于 color。类似 Skia 的 setShader */
    shader: PaintShader | null;
    /** 虚线间隔数组（如 [5, 3] 表示 5px 实线 + 3px 空白），null 表示实线 */
    dashIntervals: number[] | null;
    /** 虚线偏移（相位） */
    dashOffset: number;
    constructor();
    /** 设置颜色 */
    setColor(color: ColorLike): this;
    /** 设置描边宽度 */
    setStrokeWidth(width: number): this;
    /** 设置透明度 */
    setAlpha(alpha: number): this;
    /** 设置抗锯齿 */
    setAntiAlias(aa: boolean): this;
    /** 设置混合模式 */
    setBlendMode(mode: BlendMode): this;
    /** 设置 shader，替代纯色 */
    setShader(shader: PaintShader | null): this;
    /** 设置虚线 */
    setDash(intervals: number[], offset?: number): this;
    /**
     * 将 Paint 的填充属性应用到 Canvas 2D 上下文。
     */
    applyFillTo(ctx: CanvasRenderingContext2D): void;
    /**
     * 将 Paint 的描边属性应用到 Canvas 2D 上下文。
     */
    applyStrokeTo(ctx: CanvasRenderingContext2D): void;
    /**
     * 根据当前 style 应用全部绘制属性。
     * - PaintStyle.Fill → 仅填充
     * - PaintStyle.Stroke → 仅描边
     * - PaintStyle.FillAndStroke → 两者
     */
    applyTo(ctx: CanvasRenderingContext2D): void;
    /** 深拷贝到目标 Paint */
    copy(target: Paint): void;
    /** 创建副本 */
    clone(): Paint;
}
