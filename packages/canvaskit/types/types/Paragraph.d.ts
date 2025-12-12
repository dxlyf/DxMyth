import { DisplayObjectStyle } from './DisplayObject';
import { CanvasKit } from '../../../../../../../src/canvaskit';
import { CanvasDrawBaseStyle } from './Renderer';
import { ColorValue } from '../../../../../../../src/math/Color';
type DecorationStyle = '';
export type TextStyle = {
    backgroundColor?: ColorValue;
    color?: ColorValue;
    decoration?: number;
    decorationColor?: ColorValue;
    decorationThickness?: number;
    decorationStyle?: DecorationStyle;
    fontFamilies?: string[];
    fontFeatures?: CanvasKit.TextFontFeatures[];
    fontSize?: number;
    fontStyle?: CanvasKit.FontStyle;
    fontVariations?: CanvasKit.TextFontVariations[];
    foregroundColor?: ColorValue;
    heightMultiplier?: number;
    halfLeading?: boolean;
    letterSpacing?: number;
    locale?: string;
    shadows?: CanvasKit.TextShadow[];
    textBaseline?: CanvasKit.TextBaseline;
    wordSpacing?: number;
};
export type ParagraphStyle = {
    disableHinting?: boolean;
    ellipsis?: string;
    heightMultiplier?: number;
    maxLines?: number;
    replaceTabCharacters?: boolean;
    strutStyle?: CanvasKit.StrutStyle;
    textAlign?: CanvasKit.TextAlign;
    textDirection?: CanvasKit.TextDirection;
    textHeightBehavior?: CanvasKit.TextHeightBehavior;
    textStyle?: CanvasKit.TextStyle;
    applyRoundingHack?: boolean;
};
export type ParagraphText = {
    placeholder?: {
        width: number;
        height: number;
        align: CanvasKit.PlaceholderAlignment;
    };
    text?: string;
    textStyle?: CanvasKit.TextStyle;
};
export interface ParagraphStyleConfig extends DisplayObjectStyle, CanvasDrawBaseStyle, ParagraphStyle {
    content?: ParagraphText[];
}
export {};
