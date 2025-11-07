

import type {DisplayObjectOptions,DisplayObjectEvents} from 'src/types/DisplayObject'
import type { PathShapeConfig,PathStyleConfig } from 'src/types/Path';
import { CanvaskitRenderer } from 'src/renderer/CanvaskitRenderer';
import { BoundingRect } from 'src/math/BoundingRect';
import {Path,type PathOptions } from './Path';
import { CanvasKit, CK } from 'src/canvaskit';


interface RectOptions extends PathOptions<RectShapeConfig,RectStyleConfig>{

}

interface RectShapeConfig extends PathShapeConfig{
     x?:number,
     y?:number,
     width?:number,
     height?:number,
}
interface RectStyleConfig extends PathStyleConfig{

}

class Rect extends Path<RectOptions> {
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
    buildPath(path: CanvasKit.Path): void {
         const {x,y,width,height}=this.shape
         path.addRect(CK.XYWHRect(x,y,width,height))
    }
}

export {
    Rect
}