import { Color } from '../math/Color';
import { Matrix2D } from '../math/Matrix2D';
export type FillRule = 'evenodd' | 'nonzero';
/** A color literal (CSS string) or a NovaGFX Color. */
export type PaintColor = Color | string;
/** Browser image sources accepted by Canvas2D.drawImage. */
export type ImageSource = CanvasImageSource;
export type LineCap = 'butt' | 'round' | 'square';
export type LineJoin = 'miter' | 'round' | 'bevel';
export type StrokeAlign = 'center' | 'inside' | 'outside';
export type ImageSmoothingQuality = 'low' | 'medium' | 'high';
export type TextAlign = 'left' | 'right' | 'center' | 'start' | 'end';
export type TextBaseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
export type TextDirection = 'ltr' | 'rtl' | 'inherit';
export type BlendMode = 'source-over' | 'source-in' | 'source-out' | 'source-atop' | 'destination-over' | 'destination-in' | 'destination-out' | 'destination-atop' | 'lighter' | 'copy' | 'xor' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
/** fill 与 stroke 的绘制顺序：先填后描（默认）或先描后填 */
export type PaintOrder = 'fill-stroke' | 'stroke-fill';
export interface GradientStop {
    offset: number;
    color: PaintColor;
}
export interface LinearGradientPaint {
    type: 'linear-gradient';
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    stops: readonly GradientStop[];
}
export interface RadialGradientPaint {
    type: 'radial-gradient';
    x0: number;
    y0: number;
    r0: number;
    x1: number;
    y1: number;
    r1: number;
    stops: readonly GradientStop[];
}
export interface ConicGradientPaint {
    type: 'conic-gradient';
    x: number;
    y: number;
    startAngle: number;
    stops: readonly GradientStop[];
}
export interface PatternPaint {
    type: 'pattern';
    image: ImageSource;
    repetition?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
    transform?: Matrix2D;
}
export type PaintSource = PaintColor | LinearGradientPaint | RadialGradientPaint | ConicGradientPaint | PatternPaint;
export interface TextPaint {
    family?: string;
    size?: number;
    weight?: number | string;
    style?: 'normal' | 'italic' | 'oblique';
    align?: TextAlign;
    baseline?: TextBaseline;
    lineHeight?: number;
    letterSpacing?: number;
    direction?: TextDirection;
    /** Optional maximum width passed to Canvas fillText/strokeText. */
    maxWidth?: number;
}
export interface ShadowPaint {
    color?: PaintColor;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
}
export interface PaintOptions {
    /** Fill source; null disables filling. Defaults to black when no stroke is set. */
    fill?: PaintSource | null;
    /** Stroke source; null disables stroking. */
    stroke?: PaintSource | null;
    opacity?: number;
    fillRule?: FillRule;
    lineWidth?: number;
    lineCap?: LineCap;
    lineJoin?: LineJoin;
    miterLimit?: number;
    /** Where the stroke sits relative to the path (Canvas2D default: center). */
    strokeAlign?: StrokeAlign;
    lineDash?: readonly number[];
    lineDashOffset?: number;
    shadow?: ShadowPaint | null;
    blend?: BlendMode;
    /** fill / stroke 的绘制顺序，默认先 fill 后 stroke */
    paintOrder?: PaintOrder;
    filter?: string | null;
    imageSmoothing?: boolean;
    imageSmoothingQuality?: ImageSmoothingQuality;
    text?: TextPaint;
}
/**
 * Backend-independent paint description used by every 2D draw call.
 *
 * A paint can fill, stroke, or both. Images and text reuse the same object:
 * natural paint fields describe fill/stroke, while `text` holds typography,
 * `imageSmoothing` affects images, and `opacity`/`blend`/`shadow`/`filter`
 * apply to every primitive.
 */
export declare class Paint {
    fill: PaintSource | null;
    stroke: PaintSource | null;
    opacity: number;
    fillRule: FillRule;
    lineWidth: number;
    lineCap: LineCap;
    lineJoin: LineJoin;
    miterLimit: number;
    strokeAlign: StrokeAlign;
    lineDash: number[];
    lineDashOffset: number;
    shadow: ShadowPaint | null;
    blend: BlendMode;
    /** fill / stroke 的绘制顺序，默认先 fill 后 stroke */
    paintOrder: PaintOrder;
    filter: string | null;
    imageSmoothing: boolean;
    imageSmoothingQuality: ImageSmoothingQuality;
    text: TextPaint;
    constructor(options?: PaintOptions);
    clone(overrides?: PaintOptions): Paint;
    withOpacity(opacity: number): Paint;
    withColor(color: PaintColor): Paint;
    /** Fill-only paint. */
    static solid(fill: PaintSource, options?: PaintOptions): Paint;
    /** Stroke-only paint. */
    static outline(stroke: PaintSource, lineWidth?: number, options?: PaintOptions): Paint;
    /** Fill + stroke paint. */
    static both(fill: PaintSource, stroke: PaintSource, lineWidth?: number, options?: PaintOptions): Paint;
    static readonly DEFAULT: Paint;
}
export declare function linearGradient(x0: number, y0: number, x1: number, y1: number, stops: readonly GradientStop[]): LinearGradientPaint;
export declare function radialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number, stops: readonly GradientStop[]): RadialGradientPaint;
export declare function conicGradient(x: number, y: number, startAngle: number, stops: readonly GradientStop[]): ConicGradientPaint;
export declare function imagePattern(image: ImageSource, options?: {
    repetition?: PatternPaint['repetition'];
    transform?: Matrix2D;
}): PatternPaint;
export declare function stop(offset: number, color: PaintColor): GradientStop;
export declare function colorToCSS(color: PaintColor): string;
export declare function isGradientPaint(source: PaintSource): source is LinearGradientPaint | RadialGradientPaint | ConicGradientPaint;
export declare function isPatternPaint(source: PaintSource): source is PatternPaint;
