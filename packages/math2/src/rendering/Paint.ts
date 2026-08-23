import { Pattern } from 'src/math/Pattern'
import { Color, ColorInput, ColorValue } from '../math/Color'
import { Gradient } from 'src/math/Gradient'
import { Matrix2D } from 'src/math/Matrix2D'



export type FontStretch = "condensed" | "expanded" | "extra-condensed" | "extra-expanded" | "normal" | "semi-condensed" | "semi-expanded" | "ultra-condensed" | "ultra-expanded";
export type FontVariantCaps = "all-petite-caps" | "all-small-caps" | "normal" | "petite-caps" | "small-caps" | "titling-caps" | "unicase";
export type FontWeight = "normal" | "bold" | number;
export type FontKerning = "auto" | "none" | "normal";
export type FontStyle = "normal" | "italic" | "oblique";
export type TextDirection = "ltr" | "rtl";
export type TextAlign = "center" | "end" | "left" | "right" | "start";
export type TextBaseline = "alphabetic" | "bottom" | "hanging" | "ideographic" | "middle" | "top";
export type TextRendering = "auto" | "geometricPrecision" | "optimizeLegibility" | "optimizeSpeed";

export type FillAndStrokeStyles = {
    type: 'color' | 'pattern' | 'graddient',
    color?: ColorValue
    pattern?: Pattern
    graddient?: Gradient
}
export enum PaintStyle{
    Fill='fill',
    Stroke='stroke',
    FillAndStroke='fillAndStroke',
}
export type RenderFillStyles = {
    fill:FillAndStrokeStyles
    stroke: FillAndStrokeStyles
    
    globalAlpha: number
    blend: GlobalCompositeOperation

}
export type RenderStrokeStyles = {
    lineWidth: number
    lineJoin: 'miter' | 'round' | 'miter'
    lineCap: 'butt' | 'round' | 'square'
    miterLimit: number
    lineDash: number[]
    lineDashOffset: number
}

export type RenderShaowStyles = {
    shadowColor: ColorValue
    shadowOffsetX: number
    shadowOffsetY: number
    showdownBlur: number
}

export type RenderTextStyles = {
    fontFamily: string // 字体
    lineHeight: number // 行高
    fontSize: number // 字体大小
    fontStyle: FontStyle // 字体样式
    fontKerning: FontKerning; // 自动调整字间距
    fontStretch: FontStretch; // 字体拉伸
    fontWeight: FontWeight; // 字体粗细
    fontVariantCaps: FontVariantCaps;
    letterSpacing: number; //px 字间距
    textDirection: TextDirection // 文本方向
    textAlign: TextAlign; // 文本对齐方式
    textBaseline: TextBaseline; // 文本基线
    textRendering: TextRendering; // 文本渲染模式
    wordSpacing: number; //px 单词间距
}

export interface Paint extends RenderFillStyles,RenderStrokeStyles, RenderShaowStyles,RenderTextStyles {


}


export type Drawable={
    type:string
    id:number
    worldMatrix: Matrix2D
}
export type DrawableRect=Drawable&{
    x: number
    y: number
    width: number
    height: number
}
export type DrawableCircle=Drawable&{
    cx: number
    cy: number
    radius: number
    startAngle: number
    endAngle: number
    ccw: boolean //counterclockwise
}
export type RenderElement = Drawable&{
   

}


/**
 * font-family
font-size
font-stretch
font-style
font-variant
font-weight
line-height
*/
export const createColorFIllStyle=(input:ColorInput|Pattern|Gradient):FillAndStrokeStyles=>{
 
    if(input instanceof Pattern){
        return {
            type:'pattern',
            pattern:input,
        }
    }
    if(input instanceof Gradient){
        return {
            type:'graddient',
            graddient:input,
        }
    }
    if(Color.isColor(input)){
        return {
            type:'color',
            color:Color.fromInput(input),
        }
    }
    return {
        type:'color',
        color:Color.fromRGBA(0,0,0,0)
    }
}

export const createPaint = (): Partial<Paint> => {
    return {
        fill:createColorFIllStyle([0,0,0]),
        stroke:null,
        lineWidth: 1,
        lineJoin: 'miter',
        lineCap: 'butt',
        miterLimit: 10,
        lineDash:null,
        lineDashOffset: 0,
        //
        shadowColor:null,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        showdownBlur: 0,

        textAlign:'left',
        textBaseline:'middle',
        wordSpacing:0,
        letterSpacing:0,
        textDirection:'ltr',
        textRendering:'auto',

        fontFamily:'sans-serif',
        fontSize:12,
        lineHeight:1.5,
        fontStyle:'normal',
        fontKerning:'auto',
        fontStretch:'normal',
        fontWeight:'normal',
        fontVariantCaps:'normal',



    }
}
export const hasOwnProperty = (obj:Paint,key:string):boolean=>{
    return obj.hasOwnProperty(key) as boolean
}
export const extendPaint = (target: Paint, source:Paint): Paint => {
    for(const key in Object.keys(source)){
        target[key as keyof Paint]=source[key as keyof Paint]
    }
    return target
}
export const clonePaint = (paint: Paint): Paint => {
    const newPaint= {
        ...paint
    }
    if(paint.lineDash){
        newPaint.lineDash=paint.lineDash.slice()
    }
    if(paint.shadowColor){
        newPaint.shadowColor=paint.shadowColor.slice()
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
export const getCanvasFont=(style:RenderTextStyles)=>{
    return `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px/${style.lineHeight}px ${style.fontFamily}`
}