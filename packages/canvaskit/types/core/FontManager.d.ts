import { CanvasKit } from '../../../../../../../src/canvaskit';
import { BoundingRect } from '../../../../../../../src/math';
type FontWeight = 'normal' | 'bold';
type FontStyle = 'normal' | 'italic' | 'oblique';
export type FontDescription = {
    family: string;
    weight?: string | number;
    style?: string;
};
export type FontResource = {
    family: string;
    weight?: number | FontWeight;
    style?: FontStyle;
    url: string;
};
export type FontManagerOptions = {
    /**
     * 字体-family和URL映射
     */
    fonts?: FontResource[];
    /**
     * 默认字体-family
     */
    defaultFontFamily?: string;
    defaultFontSize?: number;
    defaultSubpixel?: boolean;
};
declare class FontManager {
    fontProvider: CanvasKit.TypefaceFontProvider;
    font: CanvasKit.Font;
    enableVariant: boolean;
    options: FontManagerOptions;
    constructor(options?: FontManagerOptions);
    calc(cb: Function): any;
    countFamilies(): number;
    getFontFamily(): string;
    getTypeface(): CanvasKit.Typeface;
    getFontSize(): number;
    setFontSize(size: number): void;
    setSubpixel(subpixel: boolean): void;
    setTypeface(typeface: CanvasKit.Typeface): void;
    /**
     * 设置字体-family
     * @param family 字体-family
     * @returns 是否设置成功
     */
    setFontFamily(family: string, style?: CanvasKit.FontStyle): boolean;
    parseFontSize(fontSize: string): number;
    parseFont(font: string): {
        fontStyle: string;
        fontWeight: string;
        fontVariant: string;
        fontSize: number;
        fontFamily: string;
    };
    getFamilyCacheKey(desc: FontDescription): string;
    setCanvasFont(font: string): boolean;
    /**
    * 注册字体-family
    * @param family 字体-family
    * @param fontBuffer 字体-ArrayBuffer
    * @returns 是否注册成功
    */
    addFontFamily(family: string, fontBuffer: ArrayBuffer): boolean;
    /**
     * 移除字体-family
     * @param family 字体-family
     * @returns 是否移除成功
     */
    removeFontFamily(family: string): boolean;
    /**
     * 从URL加载多个字体-family
     * @param fonts 字体-family和URL映射
     * @returns 是否加载成功
     */
    loadFonts(fonts: FontResource[]): Promise<boolean[]>;
    /**
     * 从URL加载字体-family
     * @param family 字体-family
     * @param url 字体-URL
     * @returns 是否加载成功
     */
    loadFont(d: FontResource): Promise<boolean>;
    /**
     * 检查字体库是否包含指定字体-family
     * @param family 字体-family
     * @returns 是否包含
     */
    hasFontFamily(family: string): boolean;
    /**
     * 匹配字体-family和样式
     * @param family 字体-family
     * @param style 字体样式
     * @returns 字体-Typeface
     */
    matchFamilyStyle(family: string, style?: CanvasKit.FontStyle): CanvasKit.Typeface;
    getTextWidth(text: string, fontSize: number, paint?: CanvasKit.Paint): number;
    getTextBounds(text: string, fontSize: number, paint?: CanvasKit.Paint): BoundingRect;
    /**
     * 测量文本宽度
     * @param text 文本内容
     * @returns 文本宽度
     */
    measureText(text: string, paint?: CanvasKit.Paint): {
        width: number;
    };
    /**
     * 测量段落宽度
     * @param text 段落内容
     * @param paragraphStyle 段落样式
     * @returns 段落宽度
     */
    createParagraph(text: string, paragraphStyle: CanvasKit.ParagraphStyle): CanvasKit.Paragraph;
    dispose(): void;
}
export default FontManager;
