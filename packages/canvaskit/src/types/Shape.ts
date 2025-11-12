import {type CanvasKit } from "src/canvaskit"
import { FillRule, LineCap, LineJoin,BorderSide } from "src/enum"
import  {Gradient} from 'src/core/Gradient'
import  {Pattern} from 'src/core/Pattern'
import  {ColorValue} from 'src/math/Color'
import {TextDrawingStyles,ShadowStyles,LineStyles,FillStrokeStyles} from './Renderer'
import {DisplayObjectStyle} from './DisplayObject'
type PaintColor=Gradient|Pattern|ColorValue|'none'|null

export interface ShapeStyleConfig extends DisplayObjectStyle,TextDrawingStyles,ShadowStyles,LineStyles,FillStrokeStyles{
    firstFill?:boolean
    fillRule?:FillRule
}
export interface ShapeConfig{
    buildPath?(path:CanvasKit.Path):void
}