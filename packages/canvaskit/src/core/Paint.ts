import { Color } from "src/math/Color";
import { Gradient } from "./Gradient";
import { Pattern } from "./Pattern";
import { DisplayObject } from "src/scene/DisplayObject";
import { BoundingRect } from "src/math/BoundingRect";



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

export enum PaintBorderStyle{
    Solid=0,// 实线
    Dashed=1,// 虚线模式
    Dotted=2// 点线模式
}
// 外边框，内边框，中间边框
export enum PaintBorderSide{
    Outside=0,
    Inside=1,
    Middle=2
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


export interface IPaint {
    style?:PaintStyle;
    type?:PaintType
    color?:Color;
    width?:number;
    borderSide?:PaintBorderSide;
    dash?:number[];
    dashOffset?:number;
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


// 
export function isValidStyle(style: PaintColor): boolean {
    return !(style === null || style === undefined || style === 'none')
}

export function getPaintType(style: PaintColor): Partial<IPaint> {
    if (style instanceof Gradient) {
        return {
            type: PaintType.Gradient,
            gradient: style
        }
    }
    if (style instanceof Pattern) {
        return {
            type: PaintType.Pattern,
            pattern: style
        }
    }
    if (isValidStyle(style) && Color.isColor(style)) {
        return {
            type: PaintType.Color,
            color: Color.parse(style)
        }
    }
    return {
        type: PaintType.Color,
        color: Color.BLACK
    }
}

export function getFillPaint(object: DisplayObject): IPaint | null {
    const { fillStyle, fillRule } = object.style
    if (!isValidStyle(fillStyle)) {
        return null
    }
    const paint: IPaint = {
        ...getPaintType(fillStyle),
        style: PaintStyle.Fill,
        fillRule
    }

    return paint
}
export function getStrokePaint(object: DisplayObject) {
    const { strokeStyle, lineCap, lineJoin, lineWidth, miterLimit } = object.style
    if (!isValidStyle(strokeStyle)) {
        return null
    }
    const paint: IPaint = {
        ...getPaintType(strokeStyle),
        style: PaintStyle.Stroke,
        lineCap,
        lineJoin,
        width: lineWidth,
        miterLimit,
    }

    return paint
}

export type RenderListConfig = {
    objects: DisplayObject[]
    dpr: number
    viewport: BoundingRect
}


/**
 * 获取最终需要渲染的对象列表

 * @param object 
 */
export function getRendertList(config: RenderListConfig): RenderObject[] {
    const { objects, dpr, viewport } = config
    const renderList: RenderObject[] = []
    objects.forEach(obj => {
        if (obj.isInViewport(viewport)&&obj.shouldRender()) {

            let fillPaint = getFillPaint(obj)
            let strokePaint = getStrokePaint(obj)
            let paints: IPaint[] = []
            if (obj.style.firstFill) {
                paints.push(fillPaint, strokePaint)
            } else {
                paints.push(strokePaint, fillPaint)
            }
            let renderObject: RenderObject = {
                object: obj,
                paints: paints.filter(Boolean)
            }
            renderList.push(renderObject)
        }
    })
    return renderList
}