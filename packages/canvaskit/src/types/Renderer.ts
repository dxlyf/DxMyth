import { GlobalCompositeOperation,PaintStyle, PaintMode, BorderSide, BorderStyle, LineJoin, LineCap, FillRule, TextAlign, TextBaseline, TextRendering, FontStretch, FontVariant, FontKerning, FontDirection, ClipPathUnits, FontStyle, FontWeight, TextDirection } from "src/enum";
import { Color, ColorValue } from 'src/math/Color'
import { Gradient } from "src/core/Gradient";
import { Pattern } from "src/core/Pattern";
import type { CanvaskitRenderer } from "src/renderer/CanvaskitRenderer";
import type { DisplayObject } from "src/scene/DisplayObject";
import type { CanvasKit } from "src/canvaskit";
import type { Shape } from "src/scene/Shape";
import type { GraphicPath } from "src/scene/GraphicPath";

export type RendererOptions={
    canvas:HTMLCanvasElement
    dpr?:number // 设备像素比
    width?:number
    height?:number
    backgroundColor?:ColorValue
}
export interface RendererEvents{
    resize:[width:number,height:number]
    'object:renderBefore':[{renderer:CanvaskitRenderer,object:DisplayObject}] // 对象渲染前
    'object:renderAfter':[{renderer:CanvaskitRenderer,object:DisplayObject}] // 对象渲染完
}
export type CanvaskitRendererOptions=RendererOptions & {
}
export interface CanvaskitRendererEvents extends RendererEvents{
    mousedown:[e:any]
}
export type TextDrawingStyles={
    fontDirection?: FontDirection; // 字体方向
    fontStyle?: FontStyle // 字体样式
    fontSize?: number // 字体大小
    fontFamily?: string // 字体
    fontWeight?: FontWeight // 字体粗细
    fontStretch?: FontStretch // 字体拉伸
    fontVariant?: FontVariant // 字体变体
    fontKerning?: FontKerning // 字体间距
    textRendering?: TextRendering; // 文本渲染方式
    textAlign?: TextAlign; // 文本对齐方式
    textBaseline?: TextBaseline; // 文本基线
    textDirection?: TextDirection; // 文本方向
    letterSpacing?: string // 字母间距
    wordSpacing?: string // 单词间距
}
export type ShadowStyles={
    shadowColor?: ColorValue;// 阴影颜色
    shadowBlur?: number;// 阴影模糊半径
    shadowOffsetX?: number; // 阴影水平偏移
    shadowOffsetY?: number;// 阴影垂直偏移
}
export type LineStyles={
    miterLimit?: number;// 斜接限制
    lineJoin?: LineJoin;// 线连接样式
    lineCap?: LineCap; // 线帽样式
    lineWidth?: number;// 线宽
    borderSide?: BorderSide;// 边框边
    borderStyle?: BorderStyle // 边框样式
    LineDash?: number[];// 虚线模式
    lineDashOffset?: number// 虚线偏移量
}
export type FillStrokeValue=Gradient|Pattern|ColorValue|'none'|null
export type FillStrokeStyles={
   fillStyle?:FillStrokeValue // 填充样式
   strokeStyle?:FillStrokeValue // 描边样式
   firstFill?:boolean // 是否先填充
   fillRule?:FillRule // 填充规则
}
export type FillStrokeObject=Gradient|Pattern|Color

export type CanvasCompositing={
    globalAlpha?: number; // 全局透明度
    globalCompositeOperation?: GlobalCompositeOperation; // 全局合成操作
}
//PaintBrush
export type PaintBrushStyle = LineStyles&ShadowStyles&TextDrawingStyles&{
    type?: PaintStyle; // 画笔类型
    mode?: PaintMode // 画笔模式
    opacity?: number; // 不透明度
    color?: Color; // 颜色
    gradient?: Gradient // 渐变
    pattern?: Pattern; // 模式
    fillRule?: FillRule; // 填充规则
}
// 裁剪路径样式
export type ClipPathStyle={
    clip?:{
        object?:Shape|GraphicPath // 裁剪对象
        path?:CanvasKit.Path // 裁剪路径
        fillRule?:FillRule // 填充规则
        clipPathUnits?:ClipPathUnits // 裁剪路径单位
    }
}
// 遮罩样式
export type MaskStyle={
    mask?:{
        image?:CanvasKit.Image
        path?:CanvasKit.Path
        object?:Shape|GraphicPath
        maskFilter?:CanvasKit.MaskFilter
    }
}
export type CanvasDrawBaseStyle= CanvasCompositing&MaskStyle&FillStrokeStyles&ClipPathStyle&LineStyles&ShadowStyles&{

}

export type CanvasDrawStyle= CanvasDrawBaseStyle&TextDrawingStyles&{

}

export interface ICanvasContextService extends CanvasCompositing, CanvasDrawImage, CanvasDrawPath, CanvasFillStrokeStyles, CanvasFilters, CanvasImageData, CanvasImageSmoothing, CanvasPath, CanvasPathDrawingStyles, CanvasRect, CanvasShadowStyles, CanvasState, CanvasText, CanvasTextDrawingStyles, CanvasTransform   {
    


}