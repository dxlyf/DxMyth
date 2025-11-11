import { PaintStyle, PaintMode, BorderSide, BorderStyle, LineJoin, LineCap, FillRule, TextAlign, TextBaseline, TextRendering, FontStretch, FontVariant, FontKerning } from "src/enum";
import { Color, ColorValue } from 'src/math/Color'
import { Gradient } from "src/core/Gradient";
import { Pattern } from "src/core/Pattern";

export type RendererOptions={
    canvas:HTMLCanvasElement
    dpr?:number // 设备像素比
    width?:number
    height?:number
}
export interface RendererEvents{
    resize:[width:number,height:number]
}
export type CanvaskitRendererOptions=RendererOptions & {

}
export interface CanvaskitRendererEvents extends RendererEvents{
    mousedown:[e:any]
}
export type TextStyle={
    fontSize?: number // 字体大小
    fontFamily?: string // 字体
    fontStretch?: FontStretch // 字体拉伸
    fontVariant?: FontVariant // 字体变体
    fontKerning?: FontKerning // 字体间距
    textRendering?: TextRendering; // 文本渲染方式
    textAlign?: TextAlign; // 文本对齐方式
    textBaseline?: TextBaseline; // 文本基线
    letterSpacing?: string // 字母间距
    wordSpacing?: string // 单词间距
}
export type ShadowStyle={
    shadowColor?: Color;// 阴影颜色
    shadowBlur?: number;// 阴影模糊半径
    shadowOffsetX?: number; // 阴影水平偏移
    shadowOffsetY?: number;// 阴影垂直偏移
}
export type LineStyle={
    miterLimit?: number;// 斜接限制
    lineJoin?: LineJoin;// 线连接样式
    lineCap?: LineCap; // 线帽样式
    lineWidth?: number;// 线宽
    borderSide?: BorderSide;// 边框边
    borderStyle?: BorderStyle // 边框样式
    dash?: number[];// 虚线模式
    lineDashOffset?: number// 虚线偏移量
}

export type FillStyle={
   fillStyle:Gradient|Pattern|ColorValue|'none'|null
   fillRule?:FillRule
}
export type StrokeStyle={
   strokeStyle:Gradient|Pattern|ColorValue|'none'|null
}
//PaintBrush
export type PaintBrushStyle = LineStyle&ShadowStyle&TextStyle&{
    type?: PaintStyle;
    mode?: PaintMode
    opacity?: number;
    color?: Color;
    gradient?: Gradient
    pattern?: Pattern;
    fillRule?: FillRule;
}
