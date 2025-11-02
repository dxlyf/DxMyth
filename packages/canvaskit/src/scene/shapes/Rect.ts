

import type {DisplayObjectOptions,DisplayObjectEvents} from 'src/interface/DisplayObject'
import {  DisplayObject} from "src/scene/DisplayObject";
import { ICanvaskitRenderer } from "src/interface/Renderer";
import { StyleConfig } from 'src/interface/Style';
import { ShapeConfig } from 'src/interface/Shape';


interface RectOptions extends DisplayObjectOptions<RectShapeConfig,RectStyleConfig>{

}
interface RectShapeConfig extends ShapeConfig{
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
                    width:100,
                    height:100,
               },
               style:{}}]
    }
    onDraw(renderer: ICanvaskitRenderer): void {
        
    }
}

export {
    Rect
}