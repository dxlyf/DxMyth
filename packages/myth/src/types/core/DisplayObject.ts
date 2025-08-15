

import { RendererContext } from './BaseRenderer'
import {ElementEvents,IElement,ElementProps} from './Element'

export  type DisplayObjectStyleProps={
    opacity:number
}

export type DisplayObjectProps<ShapeProps extends {}={},StyleProps extends DisplayObjectStyleProps=DisplayObjectStyleProps>={
    style?:StyleProps
    shape?:ShapeProps
}&ElementProps

export interface DisplayObjectEvents extends ElementEvents{
 
}
export interface IDisplayObject<Props extends DisplayObjectProps> extends IElement<Props>{
   readonly style:Props['style']
   readonly shape:Props['shape']

   render(renderer:RendererContext):void
    
}
