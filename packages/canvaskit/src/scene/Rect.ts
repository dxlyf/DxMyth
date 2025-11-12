

import type {ShapeConfig } from 'src/types/Shape';
import {Shape,type ShapeOptions } from './Shape';
import { CanvasKit, CK } from 'src/canvaskit';


export interface RectOptions extends ShapeOptions<RectShapeConfig>{

}
export interface RectShapeConfig extends ShapeConfig{
     x?:number,
     y?:number,
     width?:number,
     height?:number,
}

export class Rect extends Shape<RectOptions> {
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

