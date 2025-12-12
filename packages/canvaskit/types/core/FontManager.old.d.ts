import { CanvasKit } from '../../../../../../../src/canvaskit';
export declare enum FontStyle {
    NORMAL = "normal",
    ITALIC = "italic",
    OBLIQUE = "oblique"
}
export declare enum FontWeight {
    THIN = 100,
    EXTRA_LIGHT = 200,
    LIGHT = 300,
    NORMAL = 400,
    MEDIUM = 500,
    SEMI_BOLD = 600,
    BOLD = 700,
    EXTRA_BOLD = 800,
    BLACK = 900
}
export declare enum FontVariant {
    NORMAL = "normal",// 正常字体
    SMALL_CAPS = "small-caps"
}
export interface CacheFontDescription {
    family: string;
    style?: FontStyle;
    weight?: number;
    variant?: FontVariant;
}
export interface FontDescription extends CacheFontDescription {
    size: number;
}
export interface FontResource extends CacheFontDescription {
    url: string;
}
export interface FontCacheItem extends CacheFontDescription {
    data: ArrayBuffer;
    typeface: CanvasKit.Typeface;
}
type FontManagerOptions = {
    defaultFontFamily?: string;
    defaultFontSize?: number;
    maxCacheSize?: number;
};
export type TextMetrics = {
    width: number;
    height: number;
};
/**
 * 字体管理器类
 * 负责字体资源的加载、缓存、查找和管理
 */
export declare class FontManager {
    private fontFamilies;
    font: CanvasKit.Font;
    private defaultFontSize;
    private defaultFontFamily;
    private maxCacheSize;
    private fontLoader;
    private totalCacheSize;
    /**
     * 构造函数
     * @param canvasKit CanvasKit实例
     * @param options 配置选项
     */
    constructor(options?: FontManagerOptions);
    parseFont(font: string): FontDescription;
    setFontFamily(fontDescription: FontDescription): boolean;
    getKey(fontDescription: CacheFontDescription): string;
    removeFontFamily(family: string): void;
    loadFonts(fontResources: FontResource[]): Promise<boolean[]>;
    loadFont(fontDescription: FontResource): Promise<boolean>;
    addFontFamily(data: ArrayBuffer, fontDescription: CacheFontDescription): boolean;
    switchDefaultFont(): void;
    switchFont(font: string): boolean;
    matchFontFmaily(fontDescription: FontDescription): CanvasKit.Typeface;
    getFontFamily(fontDescription: CacheFontDescription): CanvasKit.Typeface;
    /**
     * TextMetrics.width 只读
      double 类型，使用 CSS 像素计算的内联字符串的宽度。基于当前上下文字体考虑。
  
      TextMetrics.actualBoundingBoxLeft 只读
      double 类型，平行于基线，从CanvasRenderingContext2D.textAlign 属性确定的对齐点到文本矩形边界左侧的距离，使用 CSS 像素计算；正值表示文本矩形边界左侧在该对齐点的左侧。
  
      TextMetrics.actualBoundingBoxRight 只读
      double 类型，平行于基线，从CanvasRenderingContext2D.textAlign 属性确定的对齐点到文本矩形边界右侧的距离，使用 CSS 像素计算。
  
      TextMetrics.fontBoundingBoxAscent 只读
      double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到渲染文本的所有字体的矩形最高边界顶部的距离，使用 CSS 像素计算。
  
      TextMetrics.fontBoundingBoxDescent 只读
      double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到渲染文本的所有字体的矩形边界最底部的距离，使用 CSS 像素计算。
  
      TextMetrics.actualBoundingBoxAscent 只读
      double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到渲染文本的矩形边界顶部的距离，使用 CSS 像素计算。
  
      TextMetrics.actualBoundingBoxDescent 只读
      double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到渲染文本的矩形边界底部的距离，使用 CSS 像素计算。
  
      TextMetrics.emHeightAscent 只读
      double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到线框中 em 方块顶部的距离，使用 CSS 像素计算。
  
      TextMetrics.emHeightDescent 只读
      double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到线框中 em 方块底部的距离，使用 CSS 像素计算。
  
      TextMetrics.hangingBaseline 只读
      double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到线框的 hanging 基线的距离，使用 CSS 像素计算。
  
      TextMetrics.alphabeticBaseline 只读
      double 类型，从CanvasRenderingContext2D.textBaseline 属性标明的水平线到线框的 alphabetic 基线的距离，使用 CSS 像素计算。
  
      TextMetrics.ideographicBaseline 只读
      double 类型，从 CanvasRenderingContext2D.textBaseline 属性标明的水平线到线框的 ideographic 基线的距离，使用 CSS 像素计算。
        * @param text
     * @returns
     */
    measureText(text: string, paint?: CanvasKit.Paint): TextMetrics;
    getTextBounds(text: string, paint?: CanvasKit.Paint): TextMetrics;
    dispose(): void;
}
export default FontManager;
