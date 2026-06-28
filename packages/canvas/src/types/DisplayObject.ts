import { PathBuilder } from 'src/math/PathBuilder'
import {FillStyles,StrokeStyles,ShadowStyles,TextStyles,FillRule,ClipStyles,GlobalCompositeOperation} from './FillStrokeStyles'
import {NodeProps} from './Node'
export type DisplayObjectStyle={
    firstStroke:boolean
    blend:GlobalCompositeOperation
    clipPath:PathBuilder
    clipRule:FillRule

}&FillStyles&StrokeStyles&ShadowStyles&TextStyles

export type DisplayObjectProps=NodeProps&{
    style:DisplayObjectStyle
}