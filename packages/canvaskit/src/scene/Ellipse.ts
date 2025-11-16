

import type {ShapeConfig } from 'src/types/Shape';
import {Shape,type ShapeOptions } from './Shape';
import { CanvasKit, CK } from 'src/canvaskit';
import { ellipse } from 'src/canvaskit/htmlcanvas/path2d';


export interface EllipseOptions extends ShapeOptions<EllipseShapeConfig>{

}
export interface EllipseShapeConfig extends ShapeConfig{
     cx?:number,
     cy?:number,
     rx?:number
     ry?:number
     xRotation?:number// 椭圆的水平旋转角度，单位弧度
     startAngle?:number,// 开始角度
     endAngle?:number,// 结束角度
     clockwise?:boolean,// 是否顺时针绘制
}

export class Ellipse extends Shape<EllipseOptions> {
     type='Ellipse'
     constructor(options?:EllipseOptions){
          super(options)
     }
     getDefaultProps(){
          return [...super.getDefaultProps(),{
               shape:{
                    cx:0,
                    cy:0,
                    rx:50,
                    ry:50,
                    xRotation:0,
                    startAngle:0,
                    endAngle:Math.PI*2,
                    clockwise:true,
               },
               style:{}}]
    }
    buildPath(path: CanvasKit.Path): void {
         const {cx,cy,rx,ry,xRotation,startAngle,endAngle,clockwise}=this.shape
         ellipse(path,cx,cy,rx,ry,xRotation,startAngle,endAngle,clockwise)
    }
}

