import { FillRule, LineCap, LineJoin, PaintColor,PaintBorderSide } from "src/core/Paint"
export interface StyleConfig{
    strokeWidth?:number
    firstFill?:boolean
    opacity?:number
    fillStyle?:PaintColor
    strokeStyle?:PaintColor
    lineWidth?:number
    miterLimit?:number;
    borderSide?:PaintBorderSide
    lineJoin?:LineJoin
    lineCap?:LineCap
    fillRule?:FillRule
    lineDashOffset?:number
    lineDash?:number[]
    fontSize?:number
    fontFamily?:string
    fontWeight?:string|number
}