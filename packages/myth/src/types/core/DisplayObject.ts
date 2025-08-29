

import { Renderer2DContext } from './BaseRenderer'
import {ElementEvents,IElement,ElementProps} from './Element'
import { IViewport } from './Viewport'
import {FillRule,LineJoin,PaintColor,LineCap} from './Paint'
import {Path2D} from 'skia-path2d'
export  type DisplayObjectStyleProps={
    firstFill?:boolean
    opacity?:number
    fillStyle?:PaintColor
    strokeStyle?:PaintColor
    lineWidth?:number
    miterLimit?:number;
    lineJoin?:LineJoin
    lineCap?:LineCap
    fillRule?:FillRule
    lineDashOffset?:number
    lineDash?:number[]


}

export type DisplayObjectProps<ShapeProps extends {}={},StyleProps extends DisplayObjectStyleProps=DisplayObjectStyleProps>={
    style?:StyleProps
    shape?:ShapeProps
}&ElementProps

export interface DisplayObjectEvents extends ElementEvents{
 
}
export interface IDisplayObject<Props extends DisplayObjectProps=DisplayObjectProps> extends IElement<Props>{
   readonly style:Props['style']
   readonly shape:Props['shape']
   _fillPath:Path2D
   _strokePath:Path2D
   setShape(shape:Props['shape']):void // 设置几何属性
   setStyle(styles:Props['style']):void // 设置样式
   isInViewport(viewport:IViewport):boolean // 是否在视口内，用于渲染优化
   contains(x:number,y:number):boolean; // 是否包含点(x,y)
   buildPath(path:Path2D):void; // 构建路径，子类重写此方法
   buildRenderPath():void; // 构建渲染路径,比如stroke dash
   render(renderer:Renderer2DContext):void // 渲染方法，传入渲染器上下文
   
    
}
