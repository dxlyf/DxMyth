
import {Color} from 'src/math/Color'
import {Gradient} from 'src/core/Gradient'
import {Pattern} from 'src/core/Pattern'
import type { DisplayObject } from 'src/scene/DisplayObject';

export type PaintColor=string|Color | Gradient | Pattern|undefined|null|'none';
export enum LineJoin {
    Miter = 'miter', //  miter 线连接
    Round = 'round',    //  round 线连接
    Bevel = 'bevel' //  bevel 线连接
}
export enum LineCap {
    Butt = 'butt',  //  butt 线帽
    Round = 'round', //  round 线帽
    Square = 'square', //  square 线帽
}
export enum FillRule {
    NonZero = 'nonzero', // 非零环绕规则
    EvenOdd = 'evenodd', // 奇偶环绕规则
}
export enum PaintType{
    Color=1, // 颜色
    Gradient=2, // 渐变模式
    Pattern=3  // 图案
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
    object:DisplayObject
    paints:IPaint[]
}



