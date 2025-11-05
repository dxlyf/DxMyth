

import type {DisplayObjectOptions,DisplayObjectEvents} from 'src/types/DisplayObject'
import {  DisplayObject} from "src/scene/DisplayObject";
import { StyleConfig } from 'src/types/Style';
import { ShapeConfig } from 'src/types/Shape';
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { BoundingRect } from 'src/math/BoundingRect';


interface RectOptions extends DisplayObjectOptions<RectShapeConfig,RectStyleConfig>{

}

interface RectShapeConfig extends ShapeConfig{
     x?:number,
     y?:number,
     width?:number,
     height?:number,
}
interface RectStyleConfig extends StyleConfig{

}

class Rect extends DisplayObject<RectOptions> {
     type='Rect'
     constructor(options?:RectOptions){
          super(options)
     }
     getDefaultProps(){
          return [...super.getDefaultProps(),{
               shape:{
                    x:0,
                    y:0,
                    width:100,
                    height:100,
               },
               style:{}}]
    }
    innerCalcLocalBounds(): void {
         const {x,y,width,height}=this.shape
         this._localBounds.fromRect(x,y,width,height)
    }
    render(renderer:CanvaskitRenderer): void { 
        const {x,y,width,height}=this.shape
        renderer.drawRect(x,y,width,height)
    }
}

export {
    Rect
}