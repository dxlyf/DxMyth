import { Color } from '../math/Color';
import { Matrix2D } from '../math/Matrix2D';

export type FillRule='evenodd'|'nonzero'
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

export type BlendMode =
  | 'source-over'
  | 'source-in'
  | 'source-out'
  | 'source-atop'
  | 'destination-over'
  | 'destination-in'
  | 'destination-out'
  | 'destination-atop'
  | 'lighter'
  | 'copy'
  | 'xor'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

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

export type PaintSource =
  | PaintColor
  | LinearGradientPaint
  | RadialGradientPaint
  | ConicGradientPaint
  | PatternPaint;

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

const DEFAULT_FONT_FAMILY = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

/**
 * Backend-independent paint description used by every 2D draw call.
 *
 * A paint can fill, stroke, or both. Images and text reuse the same object:
 * natural paint fields describe fill/stroke, while `text` holds typography,
 * `imageSmoothing` affects images, and `opacity`/`blend`/`shadow`/`filter`
 * apply to every primitive.
 */
export class Paint {
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

  constructor(options: PaintOptions = {}) {
    const hasStroke = options.stroke !== undefined && options.stroke !== null;
    this.fill = options.fill !== undefined ? options.fill : (hasStroke ? null : Color.BLACK);
    this.stroke = options.stroke ?? null;
    this.opacity = clamp01(options.opacity ?? 1);
    this.fillRule = options.fillRule ?? 'nonzero';
    this.lineWidth = Math.max(0.0001, options.lineWidth ?? 1);
    this.lineCap = options.lineCap ?? 'butt';
    this.lineJoin = options.lineJoin ?? 'miter';
    this.miterLimit = options.miterLimit ?? 10;
    this.strokeAlign = options.strokeAlign ?? 'center';
    this.lineDash = options.lineDash ? [...options.lineDash] : [];
    this.lineDashOffset = options.lineDashOffset ?? 0;
    this.shadow = options.shadow ?? null;
    this.blend = options.blend ?? 'source-over';
    this.paintOrder = options.paintOrder ?? 'fill-stroke';
    this.filter = options.filter ?? null;
    this.imageSmoothing = options.imageSmoothing ?? true;
    this.imageSmoothingQuality = options.imageSmoothingQuality ?? 'low';
    this.text = {
      family: DEFAULT_FONT_FAMILY,
      size: 16,
      weight: 400,
      style: 'normal',
      align: 'left',
      baseline: 'alphabetic',
      letterSpacing: 0,
      direction: 'inherit',
      ...options.text,
    };
  }

  clone(overrides: PaintOptions = {}): Paint {
    return new Paint({
      fill: this.fill,
      stroke: this.stroke,
      opacity: this.opacity,
      fillRule: this.fillRule,
      lineWidth: this.lineWidth,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin,
      miterLimit: this.miterLimit,
      strokeAlign: this.strokeAlign,
      lineDash: this.lineDash,
      lineDashOffset: this.lineDashOffset,
      shadow: this.shadow,
      blend: this.blend,
      paintOrder: this.paintOrder,
      filter: this.filter,
      imageSmoothing: this.imageSmoothing,
      imageSmoothingQuality: this.imageSmoothingQuality,
      ...overrides,
      text: { ...this.text, ...overrides.text },
    });
  }

  withOpacity(opacity: number): Paint {
    return this.clone({ opacity });
  }

  withColor(color: PaintColor): Paint {
    return this.clone({ fill: color });
  }

  /** Fill-only paint. */
  static solid(fill: PaintSource, options: PaintOptions = {}): Paint {
    return new Paint({ ...options, fill, stroke: null });
  }

  /** Stroke-only paint. */
  static outline(stroke: PaintSource, lineWidth = 1, options: PaintOptions = {}): Paint {
    return new Paint({ ...options, fill: null, stroke, lineWidth });
  }

  /** Fill + stroke paint. */
  static both(fill: PaintSource, stroke: PaintSource, lineWidth = 1, options: PaintOptions = {}): Paint {
    return new Paint({ ...options, fill, stroke, lineWidth });
  }

  static readonly DEFAULT = new Paint();
}

export function linearGradient(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stops: readonly GradientStop[],
): LinearGradientPaint {
  return { type: 'linear-gradient', x0, y0, x1, y1, stops };
}

export function radialGradient(
  x0: number,
  y0: number,
  r0: number,
  x1: number,
  y1: number,
  r1: number,
  stops: readonly GradientStop[],
): RadialGradientPaint {
  return { type: 'radial-gradient', x0, y0, r0, x1, y1, r1, stops };
}

export function conicGradient(
  x: number,
  y: number,
  startAngle: number,
  stops: readonly GradientStop[],
): ConicGradientPaint {
  return { type: 'conic-gradient', x, y, startAngle, stops };
}

export function imagePattern(
  image: ImageSource,
  options: { repetition?: PatternPaint['repetition']; transform?: Matrix2D } = {},
): PatternPaint {
  return {
    type: 'pattern',
    image,
    repetition: options.repetition,
    transform: options.transform,
  };
}

export function stop(offset: number, color: PaintColor): GradientStop {
  return { offset: clamp01(offset), color };
}

export function colorToCSS(color: PaintColor): string {
  return typeof color === 'string' ? color : color.toRGBAString();
}

export function isGradientPaint(source: PaintSource): source is LinearGradientPaint | RadialGradientPaint | ConicGradientPaint {
  return typeof source === 'object' && source !== null && !(source instanceof Color) && 'type' in source && source.type !== 'pattern';
}

export function isPatternPaint(source: PaintSource): source is PatternPaint {
  return typeof source === 'object' && source !== null && !(source instanceof Color) && 'type' in source && source.type === 'pattern';
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
