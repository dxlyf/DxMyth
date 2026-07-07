import { FillRule, LineCap, LineJoin } from "src/core/Renderer";
import { ck,type CanvasKit } from "src/ck/lib";



export const toCKFillRule=(fillRUle:FillRule)=>{
    switch(fillRUle){
        case 'nonzero':
            return ck.FillType.Winding
        case 'evenodd':
            return ck.FillType.EvenOdd
    }
}
export const toFillRule=(fillType:CanvasKit.FillType)=>{
    switch(fillType){
        case ck.FillType.Winding:
            return 'nonzero'
        case ck.FillType.EvenOdd:
            return 'evenodd'
    }
}
export const toCKLineCap=(strokeCap:LineCap)=>{
    switch(strokeCap){
        case 'butt':
            return ck.StrokeCap.Butt
        case 'round':
            return ck.StrokeCap.Round
        case 'square':
            return ck.StrokeCap.Square
    }
}
export const toLineCap=(strokeCap:CanvasKit.StrokeCap)=>{
    switch(strokeCap){
        case ck.StrokeCap.Butt:
            return 'butt'
        case ck.StrokeCap.Round:
            return 'round'
        case ck.StrokeCap.Square:
            return 'square'
    }
}
export const toCKLineJoin=(lineJoin:LineJoin)=>{
    switch(lineJoin){
        case 'miter':
            return ck.StrokeJoin.Miter
        case 'round':
            return ck.StrokeJoin.Round
        case 'bevel':
            return ck.StrokeJoin.Bevel
    }
}
export const toLineJoin=(lineJoin:CanvasKit.StrokeJoin)=>{
    switch(lineJoin){
        case ck.StrokeJoin.Miter:
            return 'miter'
        case ck.StrokeJoin.Round:
            return 'round'
        case ck.StrokeJoin.Bevel:
            return 'bevel'
    }
}
