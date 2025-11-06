import { FillRule, LineCap, LineJoin, PaintColor } from "src/core/Paint"
export interface StyleConfig{
    strokeWidth?:number
    firstFill?:boolean
    opacity?:number
    fillStyle?:PaintColor
    strokeStyle?:PaintColor
    lineWidth?:number
    miterLimit?:number;
    lineJoin?:LineJoin
    lineCap?:LineCap
    fillRule?:FillRule
    lineDashOffset?:number
    lineDash?:number[]
    fontSize?:number
    fontFamily?:string
    fontWeight?:string|number
}