import { BorderSide, BorderStyle, FillRule, FontKerning, FontStretch, FontVariant, GlobalCompositeOperation, LineCap, LineJoin, TextAlign, TextBaseline, TextRendering } from "src/enum";
import { CanvasDrawStyle } from "src/types/Renderer";

 const defaultCanvasDrawStyle: CanvasDrawStyle = {
    fillRule: FillRule.NonZero,
    firstFill: true,
    globalAlpha: 1,
    globalCompositeOperation: GlobalCompositeOperation.SourceOver,
    fillStyle:null,
    strokeStyle:null,
    miterLimit: 10,
    lineJoin: LineJoin.Miter,
    lineCap: LineCap.Butt,
    lineWidth: 1,
    borderSide: BorderSide.Middle,
    borderStyle: BorderStyle.Solid,
    LineDash: null,
    lineDashOffset: 0,
    shadowColor: null,
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    fontSize: 12,
    fontFamily: 'sans-serif',
    fontStretch: FontStretch.Normal,
    fontVariant: FontVariant.Normal,
    fontKerning: FontKerning.Auto,
    textRendering: TextRendering.Auto,
    textAlign: TextAlign.Start,
    textBaseline: TextBaseline.Alphabetic,
} as const

const DrawStylePropertiesMap = {
    globalAlpha: 'opacity'
} as const
type DrawStylePropertiesMapType = typeof defaultCanvasDrawStyle
const DrawStylePropertiesSet = new Set(Object.keys(defaultCanvasDrawStyle))
const HasDrawStylePropertiesMap = new Set(Object.keys(DrawStylePropertiesMap))
export {
    defaultCanvasDrawStyle,
    DrawStylePropertiesSet,
    DrawStylePropertiesMap,
    HasDrawStylePropertiesMap,
    type DrawStylePropertiesMapType,
}