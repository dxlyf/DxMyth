

import type {ShapeConfig } from 'src/types/Shape';
import {Shape,type ShapeOptions } from './Shape';
import { CanvasKit, CK } from 'src/canvaskit';
import { arc } from 'src/canvaskit/htmlcanvas/path2d';


export interface CircleOptions extends ShapeOptions<CircleShapeConfig>{

}
export interface CircleShapeConfig extends ShapeConfig{
     cx?:number,
     cy?:number,
     r?:number
     startAngle?:number,// 开始角度
     endAngle?:number,// 结束角度
     clockwise?:boolean,// 是否顺时针绘制
}

export class Circle extends Shape<CircleOptions> {
     type='Circle'
     constructor(options?:CircleOptions){
          super(options)
     }
     getDefaultProps(){
          return [...super.getDefaultProps(),{
               shape:{
                    cx:0,
                    cy:0,
                    r:50,
                    startAngle:0,
                    endAngle:Math.PI*2,
                    clockwise:true,
               },
               style:{}}]
    }
    buildPath(path: CanvasKit.Path): void {
         const {cx,cy,r,startAngle,endAngle,clockwise}=this.shape
         arc(path,cx,cy,r,startAngle,endAngle,clockwise)
    }
}

