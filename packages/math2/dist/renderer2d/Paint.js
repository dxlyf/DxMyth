import { Color } from "../math/Color.js";
const DEFAULT_FONT_FAMILY = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
class Paint {
  fill;
  stroke;
  opacity;
  fillRule;
  lineWidth;
  lineCap;
  lineJoin;
  miterLimit;
  strokeAlign;
  lineDash;
  lineDashOffset;
  shadow;
  blend;
  /** fill / stroke 的绘制顺序，默认先 fill 后 stroke */
  paintOrder;
  filter;
  imageSmoothing;
  imageSmoothingQuality;
  text;
  constructor(options = {}) {
    const hasStroke = options.stroke !== void 0 && options.stroke !== null;
    this.fill = options.fill !== void 0 ? options.fill : hasStroke ? null : Color.BLACK;
    this.stroke = options.stroke ?? null;
    this.opacity = clamp01(options.opacity ?? 1);
    this.fillRule = options.fillRule ?? "nonzero";
    this.lineWidth = Math.max(1e-4, options.lineWidth ?? 1);
    this.lineCap = options.lineCap ?? "butt";
    this.lineJoin = options.lineJoin ?? "miter";
    this.miterLimit = options.miterLimit ?? 10;
    this.strokeAlign = options.strokeAlign ?? "center";
    this.lineDash = options.lineDash ? [...options.lineDash] : [];
    this.lineDashOffset = options.lineDashOffset ?? 0;
    this.shadow = options.shadow ?? null;
    this.blend = options.blend ?? "source-over";
    this.paintOrder = options.paintOrder ?? "fill-stroke";
    this.filter = options.filter ?? null;
    this.imageSmoothing = options.imageSmoothing ?? true;
    this.imageSmoothingQuality = options.imageSmoothingQuality ?? "low";
    this.text = {
      family: DEFAULT_FONT_FAMILY,
      size: 16,
      weight: 400,
      style: "normal",
      align: "left",
      baseline: "alphabetic",
      letterSpacing: 0,
      direction: "inherit",
      ...options.text
    };
  }
  clone(overrides = {}) {
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
      text: { ...this.text, ...overrides.text }
    });
  }
  withOpacity(opacity) {
    return this.clone({ opacity });
  }
  withColor(color) {
    return this.clone({ fill: color });
  }
  /** Fill-only paint. */
  static solid(fill, options = {}) {
    return new Paint({ ...options, fill, stroke: null });
  }
  /** Stroke-only paint. */
  static outline(stroke, lineWidth = 1, options = {}) {
    return new Paint({ ...options, fill: null, stroke, lineWidth });
  }
  /** Fill + stroke paint. */
  static both(fill, stroke, lineWidth = 1, options = {}) {
    return new Paint({ ...options, fill, stroke, lineWidth });
  }
  static DEFAULT = new Paint();
}
function linearGradient(x0, y0, x1, y1, stops) {
  return { type: "linear-gradient", x0, y0, x1, y1, stops };
}
function radialGradient(x0, y0, r0, x1, y1, r1, stops) {
  return { type: "radial-gradient", x0, y0, r0, x1, y1, r1, stops };
}
function conicGradient(x, y, startAngle, stops) {
  return { type: "conic-gradient", x, y, startAngle, stops };
}
function imagePattern(image, options = {}) {
  return {
    type: "pattern",
    image,
    repetition: options.repetition,
    transform: options.transform
  };
}
function stop(offset, color) {
  return { offset: clamp01(offset), color };
}
function colorToCSS(color) {
  return typeof color === "string" ? color : color.toRGBAString();
}
function isGradientPaint(source) {
  return typeof source === "object" && source !== null && !(source instanceof Color) && "type" in source && source.type !== "pattern";
}
function isPatternPaint(source) {
  return typeof source === "object" && source !== null && !(source instanceof Color) && "type" in source && source.type === "pattern";
}
function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
export {
  Paint,
  colorToCSS,
  conicGradient,
  imagePattern,
  isGradientPaint,
  isPatternPaint,
  linearGradient,
  radialGradient,
  stop
};
