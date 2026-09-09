import { Pattern } from 'src/math/Pattern'
import { Color, ColorInput, ColorValue } from '../math/Color'
import { Gradient } from 'src/math/Gradient'
import { Matrix2D } from 'src/math/Matrix2D'


export type FillRule = "evenodd" | "nonzero";

export type FontStretch = "condensed" | "expanded" | "extra-condensed" | "extra-expanded" | "normal" | "semi-condensed" | "semi-expanded" | "ultra-condensed" | "ultra-expanded";
export type FontVariantCaps = "all-petite-caps" | "all-small-caps" | "normal" | "petite-caps" | "small-caps" | "titling-caps" | "unicase";
export type FontWeight = "normal" | "bold" | number;
export type FontKerning = "auto" | "none" | "normal";
export type FontStyle = "normal" | "italic" | "oblique";
export type TextDirection = "ltr" | "rtl";
export type TextAlign = "center" | "end" | "left" | "right" | "start";
export type TextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
export type TextRendering = "auto" | "geometricPrecision" | "optimizeLegibility" | "optimizeSpeed";

export type FillStyle = ColorValue | Pattern | Gradient
export type LineJoin = 'miter' | 'round' | 'bevel'
export type LineCap = 'butt' | 'round' | 'square'
export type StrokeAlign = 'outside' | 'inside' | 'center'
export type BlendOperation = "color" | "color-burn" | "color-dodge" | "copy" | "darken" | "destination-atop" | "destination-in" | "destination-out" | "destination-over" | "difference" | "exclusion" | "hard-light" | "hue" | "lighten" | "lighter" | "luminosity" | "multiply" | "overlay" | "saturation" | "screen" | "soft-light" | "source-atop" | "source-in" | "source-out" | "source-over" | "xor";

export enum PaintStyle {
    Fill = 'fill',
    Stroke = 'stroke',
    FillAndStroke = 'fillAndStroke',
}

export type FillStyles = {
    fillStyle: FillStyle
    globalAlpha: number
    blend: BlendOperation
}
export type StrokeStyles = {
    strokeStyle: FillStyle
    strokeAlign: StrokeAlign
    lineWidth: number
    lineJoin: LineJoin
    lineCap: LineCap
    miterLimit: number
    lineDash: number[]
    lineDashOffset: number

}

export type ShaowStyles = {
    shadowColor: ColorValue
    shadowOffsetX: number
    shadowOffsetY: number
    shadowBlur: number
}
export type FontStyles = {
    fontFamily: string // 字体
    lineHeight: number // 行高
    fontSize: number // 字体大小
    fontStyle: FontStyle // 字体样式
    fontKerning: FontKerning; // 自动调整字间距
    fontStretch: FontStretch; // 字体拉伸
    fontWeight: FontWeight; // 字体粗细
    fontVariantCaps: FontVariantCaps;
}
export type TextStyles = {
    letterSpacing: number; //px 字间距
    textDirection: TextDirection // 文本方向
    textAlign: TextAlign; // 文本对齐方式
    textBaseline: TextBaseline; // 文本基线
    textRendering: TextRendering; // 文本渲染模式
    wordSpacing: number; //px 单词间距
}

export interface Paint extends FillStyles, StrokeStyles, ShaowStyles, TextStyles, FontStyles {


}

export const createPaint = (): Paint => {
    return {
        fillStyle: Color.fromInput([0, 0, 0, 1]),
        globalAlpha: 1,
        blend: 'source-over',
        strokeStyle: null,
        strokeAlign: 'center',
        lineWidth: 1,
        lineJoin: 'miter',
        lineCap: 'butt',
        miterLimit: 10,
        lineDash: null,
        lineDashOffset: 0,
        //
        shadowColor: null,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,

        textAlign: 'left',
        textBaseline: 'middle',
        wordSpacing: 0,
        letterSpacing: 0,
        textDirection: 'ltr',
        textRendering: 'auto',

        fontFamily: 'sans-serif',
        fontSize: 12,
        lineHeight: 1.5,
        fontStyle: 'normal',
        fontKerning: 'auto',
        fontStretch: 'normal',
        fontWeight: 'normal',
        fontVariantCaps: 'normal',
    }
}
export const hasOwnProperty = (obj: Paint, key: string): boolean => {
    return obj.hasOwnProperty(key) as boolean
}

function cloneFill(fill: FillStyle) {
    if (fill instanceof Pattern) {
        return fill.clone()
    }
    if (fill instanceof Gradient) {
        return fill.clone()
    }
    return Color.fromInput(fill)
}
export const clonePaint = (paint: Paint): Paint => {
    const newPaint = {
        ...paint
    }
    if (paint.fillStyle) {
        paint.fillStyle = cloneFill(paint.fillStyle)
    }
    if (paint.strokeStyle) {
        paint.strokeStyle = cloneFill(paint.strokeStyle)
    }
    if (paint.shadowColor) {
        paint.shadowColor = Color.fromInput(paint.shadowColor)
    }
    if (paint.lineDash) {
        newPaint.lineDash = paint.lineDash.slice()
    }
    if (paint.shadowColor) {
        newPaint.shadowColor = paint.shadowColor.slice()
    }

    return newPaint
}
/**
 * 必须包含以下值：

<font-size>
<font-family>
可以选择性包含以下值：

<font-style>
<font-variant>
<font-weight>
<font-stretch>
<line-height>
font = 
  [ [ <'font-style'> || <font-variant-css2> || <'font-weight'> || <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] 
*/
export const getCanvasFont = (style: FontStyles) => {
    return `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px/${style.lineHeight}px ${style.fontFamily}`
}