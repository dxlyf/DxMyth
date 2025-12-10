import { BorderSide, BorderStyle, FillRule, FontKerning, FontStretch, FontStyle, FontVariant, FontWeight, GlobalCompositeOperation, LineCap, LineJoin, TextAlign, TextBaseline, TextDirection, TextRendering } from "src/enum";
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
    fontStyle: FontStyle.Normal,
    fontFamily: 'sans-serif',
    fontWeight: FontWeight.Normal,
    fontStretch: FontStretch.Normal,
    fontVariant: FontVariant.Normal,
    fontKerning: FontKerning.Auto,
    textRendering: TextRendering.Auto,
    textAlign: TextAlign.Start,
    textBaseline: TextBaseline.Alphabetic,
    textDirection: TextDirection.LTR,
} as const

const DrawStylePropertiesMap = {
    globalAlpha: 'opacity'
} as const
type DrawStylePropertiesMapType = typeof defaultCanvasDrawStyle
const DrawStylePropertiesSet = new Set(Object.keys(defaultCanvasDrawStyle))
const FontPropertiesSet = new Set(['fontSize','fontStyle', 'fontFamily', 'fontStretch', 'fontVariant', 'fontKerning', 'textRendering'])
const HasDrawStylePropertiesMap = new Set(Object.keys(DrawStylePropertiesMap))
export {
    FontPropertiesSet,
    defaultCanvasDrawStyle,
    DrawStylePropertiesSet,
    DrawStylePropertiesMap,
    HasDrawStylePropertiesMap,
    type DrawStylePropertiesMapType,
}