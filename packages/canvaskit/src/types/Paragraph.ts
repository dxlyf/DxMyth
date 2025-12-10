import { DisplayObjectStyle } from "./DisplayObject";
import type { CanvasKit } from 'src/canvaskit'
import { CanvasBaseDrawStyle, TextDrawingStyles } from "./Renderer";
import { ColorValue } from "src/math/Color";



type DecorationStyle = ''
export type TextStyle = {
    backgroundColor?: ColorValue; // 背景颜色
    color?: ColorValue; // 文本颜色
    decoration?: number; // 装饰
    decorationColor?: ColorValue; // 装饰颜色
    decorationThickness?: number; // 装饰厚度
    decorationStyle?: DecorationStyle; // 装饰样式
    fontFamilies?: string[]; // 字体家族
    fontFeatures?: CanvasKit.TextFontFeatures[]; // 字体特征
    fontSize?: number; // 字体大小
    fontStyle?: CanvasKit.FontStyle; // 字体样式
    fontVariations?: CanvasKit.TextFontVariations[]; // 字体变体
    foregroundColor?: ColorValue; // 前景颜色
    heightMultiplier?: number; // 高度乘数
    halfLeading?: boolean; // 是否半行高
    letterSpacing?: number; // 字母间距
    locale?: string; // 区域设置
    shadows?: CanvasKit.TextShadow[]; // 阴影
    textBaseline?: CanvasKit.TextBaseline; // 文本基线
    wordSpacing?: number; // 单词间距
}
export type ParagraphStyle = {
    disableHinting?: boolean; // 是否禁用提示
    ellipsis?: string; // 省略号
    heightMultiplier?: number; // 高度乘数
    maxLines?: number; // 最大行数
    replaceTabCharacters?: boolean; // 是否替换制表符
    strutStyle?: CanvasKit.StrutStyle; // 行高样式
    textAlign?: CanvasKit.TextAlign; // 文本对齐
    textDirection?: CanvasKit.TextDirection; // 文本方向
    textHeightBehavior?: CanvasKit.TextHeightBehavior; // 文本高度行为
    textStyle?: CanvasKit.TextStyle; // 文本样式
    applyRoundingHack?: boolean; // 是否应用四舍五入 hack
}
export type ParagraphText = {
    placeholder?:{
        width:number
        height:number
        align:CanvasKit.PlaceholderAlignment
    }
    text?: string
    textStyle?: CanvasKit.TextStyle
}
export interface ParagraphStyleConfig extends DisplayObjectStyle, CanvasBaseDrawStyle, ParagraphStyle {
    
    content?: ParagraphText[]
}