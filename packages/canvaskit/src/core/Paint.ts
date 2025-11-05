import { Color } from "src/math/Color";
import { Gradient } from "./Gradient";
import { Pattern } from "./Pattern";
import { DisplayObject } from "src/scene/DisplayObject";
import { IPaint, PaintColor, PaintStyle, PaintType, RenderObject,LineJoin } from "src/types/Paint";
import { BoundingRect } from "src/math/BoundingRect";



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