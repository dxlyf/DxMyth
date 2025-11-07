import {type CanvasKit } from "src/canvaskit"
import { FillRule, LineCap, LineJoin, PaintColor,PaintBorderSide } from "src/core/Paint"
import { ProxyPath } from "src/core/ProxyPath"
export interface PathStyleConfig{
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
export interface PathShapeConfig{
    buildPath?(path:CanvasKit.Path):void
}