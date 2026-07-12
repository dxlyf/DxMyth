import { ColorLike } from '../math/Color';
import { Matrix2D, Matrix2DLike } from '../math/Matrix2D';
import { ColorStop } from '../math/Gradient';
/** 平铺模式（对应 Skia SkTileMode） */
export declare enum TileMode {
    Clamp = "clamp",
    Repeat = "repeat",
    Mirror = "mirror",
    Decal = "decal"
}
/** shader 类型判别 */
export declare const enum ShaderKind {
    Color = 0,
    LinearGradient = 1,
    RadialGradient = 2,
    SweepGradient = 3,
    Image = 4
}
interface ColorShaderData {
    kind: ShaderKind.Color;
    color: ColorLike;
}
interface LinearGradientData {
    kind: ShaderKind.LinearGradient;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    stops: ColorStop[];
}
interface RadialGradientData {
    kind: ShaderKind.RadialGradient;
    centerX: number;
    centerY: number;
    radius: number;
    stops: ColorStop[];
}
interface SweepGradientData {
    kind: ShaderKind.SweepGradient;
    centerX: number;
    centerY: number;
    startAngle: number;
    stops: ColorStop[];
}
interface ImageShaderData {
    kind: ShaderKind.Image;
    image: CanvasImageSource;
    tileModeX: TileMode;
    tileModeY: TileMode;
}
type ShaderData = ColorShaderData | LinearGradientData | RadialGradientData | SweepGradientData | ImageShaderData;
/**
 * PaintShader — 着色器。
 *
 * 不可变设计：所有修改方法返回新的 PaintShader 实例。
 * 通过静态工厂创建，不直接使用 constructor。
 *
 * @example
 * ```ts
 * // 纯色 shader
 * const red = PaintShader.makeColor([1, 0, 0, 1])
 *
 * // 线性渐变
 * const grad = PaintShader.makeLinearGradient(0, 0, 100, 100, [
 *     { offset: 0, color: [1, 0, 0, 1] },
 *     { offset: 1, color: [0, 0, 1, 1] },
 * ])
 *
 * // 带矩阵变换
 * const scaled = grad.withLocalMatrix(Matrix2D.scale(0.5, 0.5))
 *
 * // 应用到 Paint
 * paint.setShader(scaled)
 * ```
 */
export declare class PaintShader {
    _data: ShaderData;
    _localMatrix: Matrix2D | null;
    /** 纯色着色器 */
    static makeColor(color: ColorLike): PaintShader;
    /** 线性渐变着色器 */
    static makeLinearGradient(startX: number, startY: number, endX: number, endY: number, stops: ColorStop[]): PaintShader;
    /** 径向渐变着色器（圆心 + 半径） */
    static makeRadialGradient(centerX: number, centerY: number, radius: number, stops: ColorStop[]): PaintShader;
    /** 扫描渐变（锥形渐变）着色器 */
    static makeSweepGradient(centerX: number, centerY: number, startAngle: number, stops: ColorStop[]): PaintShader;
    /** 图片着色器 */
    static makeImage(image: CanvasImageSource, tileModeX?: TileMode, tileModeY?: TileMode): PaintShader;
    private constructor();
    /** 着色器类型 */
    get kind(): ShaderKind;
    /** 本地变换矩阵（没有则为 null） */
    get localMatrix(): Matrix2D | null;
    setMatrix(matrix: Matrix2DLike): void;
    /**
     * 返回一个新的 shader，将给定矩阵作为其本地变换。
     * 本地矩阵在 shader 生成的坐标空间中生效。
     */
    withLocalMatrix(matrix: Matrix2DLike): PaintShader;
    /**
     * 返回一个新的 shader，重置本地矩阵为单位矩阵。
     */
    resetLocalMatrix(): PaintShader;
    /**
     * 将 shader 转换为 Canvas fillStyle / strokeStyle 可接受的值。
     * 如果 shader 无法应用（如图片未加载），回退到 fallbackColor。
     */
    toCanvasStyle(ctx: CanvasRenderingContext2D, fallbackColor: ColorLike): string | CanvasGradient | CanvasPattern;
    /** 深拷贝 */
    clone(): PaintShader;
    private _cloneData;
}
export {};
