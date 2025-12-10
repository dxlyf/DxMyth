import {CK,type CanvasKit} from './canvaskit'
import {TextAlign} from 'src/enum'

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