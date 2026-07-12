import { ColorLike } from '../math/Color';
import { IPattern } from '../math/Pattern';
import { IGradient } from '../math/Gradient';
/** 描边端点样式 */
export declare enum StrokeCap {
    Butt = 0,
    Round = 1,
    Square = 2
}
/** 描边连接样式 */
export declare enum StrokeJoin {
    Miter = 0,
    Round = 1,
    Bevel = 2
}
/** 将 StrokeCap 转换为 CanvasLineCap */
export declare function toCanvasLineCap(cap: StrokeCap): CanvasLineCap;
/** 将 StrokeJoin 转换为 CanvasLineJoin */
export declare function toCanvasLineJoin(join: StrokeJoin): CanvasLineJoin;
/**
 * 将项目 Gradient 类型转为原生 CanvasGradient。
 * 支持 LinearGradient、RadialGradient、ConicGradient。
 */
export declare function toCanvasGradient(ctx: CanvasRenderingContext2D, gradient: IGradient): CanvasGradient;
/**
 * 将 shader（渐变/图案/颜色）转换为 Canvas fillStyle / strokeStyle 可接受的值。
 * 优先级：pattern > gradient > color。
 */
export declare function toCanvasStyle(ctx: CanvasRenderingContext2D, color: ColorLike, shader?: IGradient | IPattern | null): string | CanvasGradient | CanvasPattern;
/** 将虚线配置应用到 Canvas 上下文 */
export declare function applyCanvasDash(ctx: CanvasRenderingContext2D, intervals: number[] | null, offset?: number): void;
