
import {Color} from 'src/image/Color'
import {Gradient} from 'src/image/Gradient'
import {Pattern} from 'src/image/Pattern'
import { IDisplayObject } from './DisplayObject';

export type PaintColor=string|Color | Gradient | Pattern|undefined|null;
export enum LineJoin {
    Miter = 'miter',
    Round = 'round',
    Bevel = 'bevel'
}
export enum LineCap {
    Butt = 'butt',
    Round = 'round',
    Square = 'square',
}
export enum FillRule {
    NonZero = 'nonzero',
    EvenOdd = 'evenodd',
}
export enum PaintType{
    Color=1,
    Gradient=2,
    Pattern=3
}
export enum PaintStyle{
    None=0,
    Fill=1,// 填充模式
    Stroke=2// 描边模式
}


export interface IPaint{
    style?:PaintStyle;
    type?:PaintType
    color?:Color;
    width?:number;
    miterLimit?:number;
    lineJoin?:LineJoin;
    lineCap?:LineCap;
    fillRule?:FillRule;
    gradient?:Gradient;
    pattern?:Pattern;
}
export type RenderObject={
    object:IDisplayObject
    paints:IPaint[]
}

// export class Paint implements IPaint{
//     style: PaintStyle=PaintStyle.None; // 默认为填充模式
//     type: PaintType=PaintType.Color; // 默认为颜色类型
//     color: Color=Color.BLACK;
//     width: number=1
//     miterLimit:number=10;
//     lineJoin:CanvasLineJoin=LineJoin.Miter
//     lineCap:CanvasLineCap=LineCap.Butt
//     gradient?: Gradient;
//     pattern?: Pattern;
//     blend?:GlobalCompositeOperation
//     constructor(){

//     }
//     equals(other: Paint): boolean {

//         if(this.style!==other.style) return false
//         if(this.type!==other.type) return false
//         if(this.width!==other.width) return false
//         if(this.lineJoin!==other.lineJoin) return false
//         if(this.miterLimit!==other.miterLimit) return false
//         if(this.blend!==other.blend) return false
//         if(this.lineCap!==other.lineCap) return false
//         if(this.gradient!==other.gradient){
//             if(this.gradient&&other.gradient){
//                  if(!this.gradient.equals(other.gradient)){
//                      return false
//                  }
//             }else{
//                 return false
//             }
//         }
//         if(this.pattern!==other.pattern){
//             if(this.pattern&&other.pattern){
//                  if(!this.pattern.equals(other.pattern)){
//                      return false
//                  }
//             }else{
//                 return false
//             }
//         }
//         return true
//     }

// }

