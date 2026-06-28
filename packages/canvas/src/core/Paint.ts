import { FillRule, FillStyle, LineCap, LineJoin, StrokeStyle,ShadowStyles,TextStyles } from "src/types/FillStrokeStyles"
import { Gradient } from "./Gradient"
import { Color } from "src/math/Color"
import { Pattern } from "./Pattern"
import {DisplayObjectStyle} from 'src/types/DisplayObject'

export enum PaintStyle {
    None=0,
    Fill,
    Stroke,
    FillStroke,
    StrokeFill
}
export enum PaintType {
    None=0,
    Color = 1,
    Gradient = 2,
    Pattern = 3
}
export class Paint {
    style: PaintStyle = PaintStyle.Fill
    type: PaintType = PaintType.None
    color?: { r: number, g: number, b: number, a: number }
    gradient?: Gradient
    pattern?: Pattern
    lineWidth?: number
    lineCap?: LineCap
    lineJoin?: LineJoin
    lineDash?: number[]
    miterLimit?: number
    fillRule?: FillRule
    shadowStyle?: ShadowStyles
    textStyle?: TextStyles
    setStyle(style: PaintStyle) {
        this.style = style
    }
    setFillRule(rule: FillRule) {
        this.fillRule = rule
    }
    setWidth(width: number) {
        this.lineWidth = width
    }
    setLineCap(cap: LineCap) {
        this.lineCap = cap
    }
    setJoin(join: LineJoin) {
        this.lineJoin = join
    }
    setCap(cap: LineCap) {
        this.lineCap = cap
    }
    setDash(dash: number[]) {
        this.lineDash = dash
    }
    setMiterLimit(limit: number) {
        this.miterLimit = limit
    }
}

