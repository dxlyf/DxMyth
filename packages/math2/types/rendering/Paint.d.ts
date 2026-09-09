import { Pattern } from '../math/Pattern';
import { ColorValue } from '../math/Color';
import { Gradient } from '../math/Gradient';
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
export type FillStyle = ColorValue | Pattern | Gradient;
export type LineJoin = 'miter' | 'round' | 'bevel';
export type LineCap = 'butt' | 'round' | 'square';
export type StrokeAlign = 'outside' | 'inside' | 'center';
export type BlendOperation = "color" | "color-burn" | "color-dodge" | "copy" | "darken" | "destination-atop" | "destination-in" | "destination-out" | "destination-over" | "difference" | "exclusion" | "hard-light" | "hue" | "lighten" | "lighter" | "luminosity" | "multiply" | "overlay" | "saturation" | "screen" | "soft-light" | "source-atop" | "source-in" | "source-out" | "source-over" | "xor";
export declare enum PaintStyle {
    Fill = "fill",
    Stroke = "stroke",
    FillAndStroke = "fillAndStroke"
}
export type FillStyles = {
    fillStyle: FillStyle;
    globalAlpha: number;
    blend: BlendOperation;
};
export type StrokeStyles = {
    strokeStyle: FillStyle;
    strokeAlign: StrokeAlign;
    lineWidth: number;
    lineJoin: LineJoin;
    lineCap: LineCap;
    miterLimit: number;
    lineDash: number[];
    lineDashOffset: number;
};
export type ShaowStyles = {
    shadowColor: ColorValue;
    shadowOffsetX: number;
    shadowOffsetY: number;
    shadowBlur: number;
};
export type FontStyles = {
    fontFamily: string;
    lineHeight: number;
    fontSize: number;
    fontStyle: FontStyle;
    fontKerning: FontKerning;
    fontStretch: FontStretch;
    fontWeight: FontWeight;
    fontVariantCaps: FontVariantCaps;
};
export type TextStyles = {
    letterSpacing: number;
    textDirection: TextDirection;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    textRendering: TextRendering;
    wordSpacing: number;
};
export interface Paint extends FillStyles, StrokeStyles, ShaowStyles, TextStyles, FontStyles {
}
export declare const createPaint: () => Paint;
export declare const hasOwnProperty: (obj: Paint, key: string) => boolean;
export declare const clonePaint: (paint: Paint) => Paint;
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
export declare const getCanvasFont: (style: FontStyles) => string;
