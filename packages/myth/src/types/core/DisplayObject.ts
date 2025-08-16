

import { Renderer2DContext } from './BaseRenderer'
import {ElementEvents,IElement,ElementProps} from './Element'
import { IViewport } from './Viewport'
import {FillRule,LineJoin,PaintColor,LineCap} from './Paint'
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
   isInViewport(viewport:IViewport):boolean
   render(renderer:Renderer2DContext):void
    
}
