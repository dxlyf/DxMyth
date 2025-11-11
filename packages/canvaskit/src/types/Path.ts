import {type CanvasKit } from "src/canvaskit"
import { FillRule, LineCap, LineJoin,BorderSide } from "src/enum"
import  {Gradient} from 'src/core/Gradient'
import  {Pattern} from 'src/core/Pattern'
import  {ColorValue} from 'src/math/Color'
import {TextStyle,ShadowStyle,LineStyle,FillStyle, StrokeStyle} from './Renderer'
import {DisplayObjectStyle} from './DisplayObject'
type PaintColor=Gradient|Pattern|ColorValue|'none'|null

export interface PathStyleConfig extends DisplayObjectStyle,TextStyle,ShadowStyle,LineStyle,StrokeStyle,FillStyle{
    firstFill?:boolean
}
export interface PathShapeConfig{
    buildPath?(path:CanvasKit.Path):void
}