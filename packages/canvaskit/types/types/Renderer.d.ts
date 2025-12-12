import { GlobalCompositeOperation, PaintStyle, PaintMode, BorderSide, BorderStyle, LineJoin, LineCap, FillRule, TextAlign, TextBaseline, TextRendering, FontStretch, FontVariant, FontKerning, FontDirection, ClipPathUnits, FontStyle, FontWeight, TextDirection } from '../../../../../../../src/enum';
import { Color, ColorValue } from '../../../../../../../src/math/Color';
import { Gradient } from '../../../../../../../src/core/Gradient';
import { Pattern } from '../../../../../../../src/core/Pattern';
import { CanvaskitRenderer } from '../../../../../../../src/renderer/CanvaskitRenderer';
import { DisplayObject } from '../../../../../../../src/scene/DisplayObject';
import { CanvasKit } from '../../../../../../../src/canvaskit';
import { Shape } from '../../../../../../../src/scene/Shape';
import { GraphicPath } from '../../../../../../../src/scene/GraphicPath';
export type RendererOptions = {
    canvas: HTMLCanvasElement;
    dpr?: number;
    width?: number;
    height?: number;
    backgroundColor?: ColorValue;
};
export interface RendererEvents {
    resize: [width: number, height: number];
    'object:renderBefore': [{
        renderer: CanvaskitRenderer;
        object: DisplayObject;
    }];
    'object:renderAfter': [{
        renderer: CanvaskitRenderer;
        object: DisplayObject;
    }];
}
export type CanvaskitRendererOptions = RendererOptions & {};
export interface CanvaskitRendererEvents extends RendererEvents {
    mousedown: [e: any];
}
export type TextDrawingStyles = {
    fontDirection?: FontDirection;
    fontStyle?: FontStyle;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: FontWeight;
    fontStretch?: FontStretch;
    fontVariant?: FontVariant;
    fontKerning?: FontKerning;
    textRendering?: TextRendering;
    textAlign?: TextAlign;
    textBaseline?: TextBaseline;
    textDirection?: TextDirection;
    letterSpacing?: string;
    wordSpacing?: string;
};
export type ShadowStyles = {
    shadowColor?: ColorValue;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
};
export type LineStyles = {
    miterLimit?: number;
    lineJoin?: LineJoin;
    lineCap?: LineCap;
    lineWidth?: number;
    borderSide?: BorderSide;
    borderStyle?: BorderStyle;
    LineDash?: number[];
    lineDashOffset?: number;
};
export type FillStrokeValue = Gradient | Pattern | ColorValue | 'none' | null;
export type FillStrokeStyles = {
    fillStyle?: FillStrokeValue;
    strokeStyle?: FillStrokeValue;
    firstFill?: boolean;
    fillRule?: FillRule;
};
export type FillStrokeObject = Gradient | Pattern | Color;
export type CanvasCompositing = {
    globalAlpha?: number;
    globalCompositeOperation?: GlobalCompositeOperation;
};
export type PaintBrushStyle = LineStyles & ShadowStyles & TextDrawingStyles & {
    type?: PaintStyle;
    mode?: PaintMode;
    opacity?: number;
    color?: Color;
    gradient?: Gradient;
    pattern?: Pattern;
    fillRule?: FillRule;
};
export type ClipPathStyle = {
    clip?: {
        object?: Shape | GraphicPath;
        path?: CanvasKit.Path;
        fillRule?: FillRule;
        clipPathUnits?: ClipPathUnits;
    };
};
export type MaskStyle = {
    mask?: {
        image?: CanvasKit.Image;
        path?: CanvasKit.Path;
        object?: Shape | GraphicPath;
        maskFilter?: CanvasKit.MaskFilter;
    };
};
export type CanvasDrawBaseStyle = CanvasCompositing & MaskStyle & FillStrokeStyles & ClipPathStyle & LineStyles & ShadowStyles & {};
export type CanvasDrawStyle = CanvasDrawBaseStyle & TextDrawingStyles & {};
export interface ICanvasContextService extends CanvasCompositing, CanvasDrawImage, CanvasDrawPath, CanvasFillStrokeStyles, CanvasFilters, CanvasImageData, CanvasImageSmoothing, CanvasPath, CanvasPathDrawingStyles, CanvasRect, CanvasShadowStyles, CanvasState, CanvasText, CanvasTextDrawingStyles, CanvasTransform {
}
