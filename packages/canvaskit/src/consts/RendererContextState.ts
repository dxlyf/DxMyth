import { BorderSide, BorderStyle, FontKerning, FontStretch, FontVariant, GlobalCompositeOperation, LineCap, LineJoin, TextAlign, TextBaseline, TextRendering } from "src/enum";
import { RendererContextState } from "src/types/Renderer";

export const defaultRendererContextState: RendererContextState = {
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
    dash: null,
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
}
