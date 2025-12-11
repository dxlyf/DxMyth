import {CK,type CanvasKit} from './canvaskit'
import {TextAlign,LineJoin, LineCap} from 'src/enum'

export function toLineJoin(lineJoin:LineJoin){
    switch(lineJoin){
        case LineJoin.Miter:
            return CK.StrokeJoin.Miter
        case LineJoin.Round:
            return CK.StrokeJoin.Round
        case LineJoin.Bevel:
            return CK.StrokeJoin.Bevel
    }
}
export function toLineCap(lineCap:LineCap){
    switch(lineCap){
        case LineCap.Butt:
            return CK.StrokeCap.Butt
        case LineCap.Round:
            return CK.StrokeCap.Round
        case LineCap.Square:
            return CK.StrokeCap.Square
    }
}

export function toTextAlign(textAlign:TextAlign){
    switch(textAlign){
        case TextAlign.Start:
            return CK.TextAlign.Start
        case TextAlign.End:
            return CK.TextAlign.End
        case TextAlign.Center:
            return CK.TextAlign.Center
        case TextAlign.Left:
            return CK.TextAlign.Left
        case TextAlign.Right:
            return CK.TextAlign.Right
    }
}