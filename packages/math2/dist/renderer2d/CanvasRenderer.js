import { Matrix2D } from "../math/Matrix2D.js";
import { Path2D } from "../math/Path2D.js";
import { Color } from "../math/Color.js";
import { colorToCSS, Paint } from "./Paint.js";
const TAU = Math.PI * 2;
class CanvasRenderer {
  canvas;
  _ctx;
  _width = 0;
  _height = 0;
  _pixelRatio = 1;
  _matrix = Matrix2D.identity();
  _path = new Path2D();
  _stack = [];
  constructor(canvas, options = {}) {
    this.canvas = canvas ?? createCanvas(300, 150);
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("CanvasRenderer: 无法创建 2d 上下文");
    this._ctx = ctx;
    this._pixelRatio = options.pixelRatio ?? 1;
    this._width = this.canvas.width / this._pixelRatio;
    this._height = this.canvas.height / this._pixelRatio;
    this._syncTransform();
  }
  // ============================================================
  // 基础属性
  // ============================================================
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get pixelRatio() {
    return this._pixelRatio;
  }
  get currentTransform() {
    return this._matrix;
  }
  resize(width, height, pixelRatio = this._pixelRatio) {
    this._width = width;
    this._height = height;
    this._pixelRatio = pixelRatio;
    this.canvas.width = Math.max(1, Math.round(width * pixelRatio));
    this.canvas.height = Math.max(1, Math.round(height * pixelRatio));
    this._syncTransform();
    return this;
  }
  // ============================================================
  // 清屏
  // ============================================================
  clear(color) {
    const ctx = this._ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "copy";
    ctx.shadowColor = "transparent";
    ctx.filter = "none";
    if (color == null) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      ctx.fillStyle = colorToCSS(color);
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    ctx.restore();
  }
  clearRect(x, y, width, height) {
    this._ctx.clearRect(x, y, width, height);
  }
  // ============================================================
  // 变换栈
  // ============================================================
  save() {
    this._ctx.save();
    this._stack.push(this._matrix.clone());
  }
  restore() {
    if (this._stack.length === 0) return;
    this._ctx.restore();
    const saved = this._stack.pop();
    this._matrix.copy(saved);
    this._syncTransform();
  }
  resetTransform() {
    this._matrix.identity();
    this._syncTransform();
  }
  setTransform(a, b, c, d, tx, ty) {
    this._matrix.fromValues(a, b, c, d, tx, ty);
    this._syncTransform();
  }
  transform(a, b, c, d, tx, ty) {
    this._matrix.multiply(Matrix2D.fromValues(a, b, c, d, tx, ty));
    this._syncTransform();
  }
  getTransform(out) {
    if (out) {
      out.copy(this._matrix);
      return out;
    }
    return this._matrix.clone();
  }
  translate(x, y) {
    this._matrix.translate(x, y);
    this._syncTransform();
  }
  rotate(radians) {
    this._matrix.rotate(radians);
    this._syncTransform();
  }
  scale(x, y = x) {
    this._matrix.scale(x, y);
    this._syncTransform();
  }
  _syncTransform() {
    const dpr = this._pixelRatio;
    const m = this._matrix;
    this._ctx.setTransform(
      m[0] * dpr,
      m[1] * dpr,
      m[2] * dpr,
      m[3] * dpr,
      m[4] * dpr,
      m[5] * dpr
    );
  }
  // ============================================================
  // 当前路径（IPath2D）
  // ============================================================
  beginPath() {
    this._path.clear();
  }
  moveTo(x, y) {
    this._path.moveTo(x, y);
  }
  lineTo(x, y) {
    this._path.lineTo(x, y);
  }
  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }
  quadraticCurveTo(cpx, cpy, x, y) {
    this._path.quadraticCurveTo(cpx, cpy, x, y);
  }
  closePath() {
    this._path.closePath();
  }
  rect(x, y, w, h) {
    this._path.rect(x, y, w, h);
  }
  roundRect(x, y, w, h, radii) {
    this._path.roundRect(x, y, w, h, radii);
  }
  arc(x, y, radius, startAngle, endAngle, counterclockwise) {
    this._path.arc(x, y, radius, startAngle, endAngle, !!counterclockwise);
  }
  arcTo(x1, y1, x2, y2, radius) {
    this._path.arcTo(x1, y1, x2, y2, radius);
  }
  ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise) {
    this._path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, !!counterclockwise);
  }
  clip(pathOrRule, fillRule) {
    const path = typeof pathOrRule === "string" ? this._path : pathOrRule ?? this._path;
    const rule = typeof pathOrRule === "string" ? pathOrRule : fillRule ?? "nonzero";
    this._ctx.clip(this._nativePath(path), rule);
  }
  drawImage(image, ...args) {
    const tail = args[args.length - 1];
    let paint;
    if (tail && typeof tail === "object") {
      paint = args.pop();
    }
    const nums = args;
    const size = imageSize(image);
    let sx = 0;
    let sy = 0;
    let sw = size.width;
    let sh = size.height;
    let dx = 0;
    let dy = 0;
    let dw = sw;
    let dh = sh;
    if (nums.length <= 2) {
      dx = nums[0] ?? 0;
      dy = nums[1] ?? 0;
    } else if (nums.length <= 4) {
      dx = nums[0] ?? 0;
      dy = nums[1] ?? 0;
      dw = nums[2] ?? sw;
      dh = nums[3] ?? sh;
    } else {
      sx = nums[0] ?? 0;
      sy = nums[1] ?? 0;
      sw = nums[2] ?? 0;
      sh = nums[3] ?? 0;
      dx = nums[4] ?? 0;
      dy = nums[5] ?? 0;
      dw = nums[6] ?? 0;
      dh = nums[7] ?? 0;
    }
    if (!dw || !dh) return;
    const ctx = this._ctx;
    ctx.save();
    this._applyPaintState(ctx, paint ?? Paint.DEFAULT);
    ctx.imageSmoothingEnabled = paint ? paint.imageSmoothing : true;
    ctx.imageSmoothingQuality = paint ? paint.imageSmoothingQuality : "low";
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.restore();
  }
  // ============================================================
  // 路径与图元
  // ============================================================
  drawPath(path, paint) {
    this._paintPath(this._nativePath(path), paint);
  }
  drawRect(x, y, width, height, paint) {
    const np = new globalThis.Path2D();
    np.rect(x, y, width, height);
    this._paintPath(np, paint);
  }
  drawRoundRect(x, y, width, height, radius, paint) {
    const np = new globalThis.Path2D();
    np.roundRect(x, y, width, height, radius);
    this._paintPath(np, paint);
  }
  drawEllipse(cx, cy, radiusX, radiusY, paint) {
    this._paintPath(this._ellipsePath(cx, cy, radiusX, radiusY, 0, 0, TAU, false), paint);
  }
  drawEllipseArc(cx, cy, radiusX, radiusY, rotation, startAngle, endAngle, counterClockwise, paint) {
    this._paintPath(
      this._ellipsePath(cx, cy, radiusX, radiusY, rotation, startAngle, endAngle, counterClockwise),
      paint
    );
  }
  drawCircle(cx, cy, radius, paint) {
    this._paintPath(this._ellipsePath(cx, cy, radius, radius, 0, 0, TAU, false), paint);
  }
  drawArc(cx, cy, radius, startAngle, endAngle, counterClockwise, paint) {
    const np = new globalThis.Path2D();
    np.arc(cx, cy, radius, startAngle, endAngle, counterClockwise);
    this._paintPath(np, paint);
  }
  drawLine(x1, y1, x2, y2, paint) {
    const np = new globalThis.Path2D();
    np.moveTo(x1, y1);
    np.lineTo(x2, y2);
    this._paintPath(np, paint);
  }
  drawPolyline(points, paint, closed = false) {
    if (!points || points.length === 0) return;
    const np = new globalThis.Path2D();
    np.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) np.lineTo(points[i].x, points[i].y);
    if (closed || points.length > 2) np.closePath();
    this._paintPath(np, paint);
  }
  _ellipsePath(cx, cy, rx, ry, rotation, startAngle, endAngle, counterClockwise) {
    const np = new globalThis.Path2D();
    np.ellipse(cx, cy, rx, ry, rotation, startAngle, endAngle, counterClockwise);
    return np;
  }
  // ============================================================
  // 文字
  // ============================================================
  drawText(text, x, y, paint) {
    if (!text) return;
    const ctx = this._ctx;
    ctx.save();
    this._applyPaintState(ctx, paint);
    this._applyTextState(ctx, paint);
    const lines = text.split("\n");
    const lineHeight = textLineHeight(paint);
    const maxWidth = paint.text.maxWidth;
    const fill = () => {
      if (!paint.fill) return;
      ctx.fillStyle = this._makeStyle(paint.fill);
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + i * lineHeight, maxWidth);
      }
    };
    const stroke = () => {
      if (!paint.stroke) return;
      ctx.strokeStyle = this._makeStyle(paint.stroke);
      ctx.lineWidth = paint.lineWidth;
      ctx.lineCap = paint.lineCap;
      ctx.lineJoin = paint.lineJoin;
      ctx.miterLimit = paint.miterLimit;
      ctx.setLineDash(paint.lineDash);
      ctx.lineDashOffset = paint.lineDashOffset;
      for (let i = 0; i < lines.length; i++) {
        ctx.strokeText(lines[i], x, y + i * lineHeight, maxWidth);
      }
    };
    if (paint.paintOrder === "stroke-fill") {
      stroke();
      fill();
    } else {
      fill();
      stroke();
    }
    ctx.restore();
  }
  measureText(text, paint) {
    const ctx = this._ctx;
    ctx.save();
    this._applyTextState(ctx, paint);
    const lines = text ? text.split("\n") : [""];
    const size = paint.text.size ?? 16;
    let width = 0;
    let ascent = 0;
    let descent = 0;
    for (const line of lines) {
      const metrics = ctx.measureText(line || " ");
      width = Math.max(width, metrics.width);
      ascent = Math.max(ascent, metrics.actualBoundingBoxAscent ?? size * 0.8);
      descent = Math.max(descent, metrics.actualBoundingBoxDescent ?? size * 0.2);
    }
    ctx.restore();
    const lineHeight = textLineHeight(paint);
    return {
      width,
      height: lineHeight * lines.length,
      ascent,
      descent,
      lineHeight,
      lines: lines.length
    };
  }
  _applyTextState(ctx, paint) {
    const t = paint.text;
    ctx.font = fontString(t);
    ctx.textAlign = t.align ?? "left";
    ctx.textBaseline = t.baseline ?? "alphabetic";
    ctx.direction = t.direction ?? "inherit";
    if (t.letterSpacing !== void 0) {
      ctx.letterSpacing = `${t.letterSpacing}px`;
    }
  }
  // ============================================================
  // 绘制内部实现
  // ============================================================
  _nativePath(path) {
    const np = new globalThis.Path2D();
    path.visit({
      moveTo: (c) => np.moveTo(c.x, c.y),
      lineTo: (c) => np.lineTo(c.x, c.y),
      bezierCurveTo: (c) => np.bezierCurveTo(c.cp1x, c.cp1y, c.cp2x, c.cp2y, c.x, c.y),
      quadraticCurveTo: (c) => np.quadraticCurveTo(c.cpx, c.cpy, c.x, c.y),
      closePath: () => np.closePath(),
      rect: (c) => np.rect(c.x, c.y, c.w, c.h),
      roundRect: (c) => np.roundRect(c.x, c.y, c.w, c.h, c.radii),
      arc: (c) => np.arc(c.x, c.y, c.radius, c.startAngle, c.endAngle, c.counterclockwise),
      arcTo: (c) => np.arcTo(c.x1, c.y1, c.x2, c.y2, c.radius),
      ellipse: (c) => np.ellipse(c.x, c.y, c.radiusX, c.radiusY, c.rotation, c.startAngle, c.endAngle, c.counterclockwise)
    });
    return np;
  }
  _paintPath(np, paint) {
    const ctx = this._ctx;
    ctx.save();
    this._applyPaintState(ctx, paint);
    const drawFill = () => {
      if (!paint.fill) return;
      ctx.fillStyle = this._makeStyle(paint.fill);
      ctx.fill(np, paint.fillRule);
    };
    const drawStroke = () => {
      if (!paint.stroke) return;
      this._strokePath(np, paint);
    };
    if (paint.paintOrder === "stroke-fill") {
      drawStroke();
      drawFill();
    } else {
      drawFill();
      drawStroke();
    }
    ctx.restore();
  }
  /** 按 strokeAlign 绘制描边：inside/outside 用 clip + 双倍线宽近似 */
  _strokePath(np, paint) {
    const ctx = this._ctx;
    const align = paint.strokeAlign;
    if (align === "center") {
      this._strokeStyle(ctx, paint);
      ctx.stroke(np);
      return;
    }
    ctx.save();
    if (align === "inside") {
      ctx.clip(np, paint.fillRule);
    } else {
      const b = this._localViewport();
      const complement = new globalThis.Path2D();
      complement.rect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
      complement.addPath(np);
      ctx.clip(complement, "evenodd");
    }
    this._strokeStyle(ctx, paint);
    ctx.stroke(np);
    ctx.restore();
  }
  _strokeStyle(ctx, paint) {
    ctx.strokeStyle = this._makeStyle(paint.stroke);
    ctx.lineWidth = paint.strokeAlign === "center" ? paint.lineWidth : paint.lineWidth * 2;
    ctx.lineCap = paint.lineCap;
    ctx.lineJoin = paint.lineJoin;
    ctx.miterLimit = paint.miterLimit;
    ctx.setLineDash(paint.lineDash);
    ctx.lineDashOffset = paint.lineDashOffset;
  }
  _applyPaintState(ctx, paint) {
    ctx.globalAlpha = paint.opacity;
    ctx.globalCompositeOperation = paint.blend;
    ctx.filter = paint.filter ?? "none";
    const shadow = paint.shadow;
    if (shadow) {
      ctx.shadowColor = colorToCSS(shadow.color ?? Color.BLACK);
      ctx.shadowBlur = shadow.blur ?? 0;
      ctx.shadowOffsetX = shadow.offsetX ?? 0;
      ctx.shadowOffsetY = shadow.offsetY ?? 0;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  }
  _makeStyle(source) {
    if (typeof source === "string") return source;
    if (source instanceof Color) return source.toRGBAString();
    if (source.type === "pattern") return this._makePattern(source);
    return this._makeGradient(source);
  }
  _makeGradient(source) {
    const ctx = this._ctx;
    const stops = [...source.stops].sort((a, b) => a.offset - b.offset);
    let gradient;
    if (source.type === "linear-gradient") {
      gradient = ctx.createLinearGradient(source.x0, source.y0, source.x1, source.y1);
    } else if (source.type === "radial-gradient") {
      gradient = ctx.createRadialGradient(source.x0, source.y0, Math.max(0, source.r0), source.x1, source.y1, Math.max(0, source.r1));
    } else {
      const createConic = ctx.createConicGradient;
      if (typeof createConic !== "function") {
        return stops.length > 0 ? colorToCSS(stops[0].color) : "transparent";
      }
      gradient = createConic.call(ctx, source.startAngle, source.x, source.y);
    }
    for (const s of stops) {
      gradient.addColorStop(clamp01(s.offset), colorToCSS(s.color));
    }
    return gradient;
  }
  _makePattern(source) {
    const pattern = this._ctx.createPattern(source.image, source.repetition ?? "repeat");
    if (!pattern) {
      return typeof source.image === "string" ? source.image : "transparent";
    }
    const transform = source.transform;
    if (transform && typeof pattern.setTransform === "function" && typeof DOMMatrix !== "undefined") {
      pattern.setTransform(new DOMMatrix([transform[0], transform[1], transform[2], transform[3], transform[4], transform[5]]));
    }
    return pattern;
  }
  /** 当前视口在用户坐标系下的包围盒，用于构造 outside 描边的补集裁剪路径 */
  _localViewport() {
    const dpr = this._pixelRatio;
    const device = Matrix2D.from(this._matrix);
    device.scale(dpr, dpr);
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (Math.abs(device.determinant()) < 1e-12) {
      return { x0: -1e6, y0: -1e6, x1: 1e6, y1: 1e6 };
    }
    const inverse = Matrix2D.identity();
    Matrix2D.invert(inverse, device);
    const out = { x: 0, y: 0 };
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    const corners = [
      [0, 0],
      [w, 0],
      [0, h],
      [w, h]
    ];
    for (const [px, py] of corners) {
      out.x = px;
      out.y = py;
      Matrix2D.mapPoint(out, inverse, out);
      x0 = Math.min(x0, out.x);
      y0 = Math.min(y0, out.y);
      x1 = Math.max(x1, out.x);
      y1 = Math.max(y1, out.y);
    }
    return { x0, y0, x1, y1 };
  }
  flush() {
  }
  dispose() {
    this._stack.length = 0;
    this._path.clear();
  }
}
function createCanvas(width, height) {
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }
  throw new Error("CanvasRenderer: 当前环境没有可用的 canvas 实现");
}
function fontString(text) {
  const style = text.style ?? "normal";
  const weight = text.weight ?? 400;
  const size = text.size ?? 16;
  const family = text.family ?? "sans-serif";
  return `${style} ${weight} ${size}px ${family}`;
}
function textLineHeight(paint) {
  return paint.text.lineHeight ?? (paint.text.size ?? 16) * 1.2;
}
function imageSize(image) {
  const anyImage = image;
  const width = anyImage.naturalWidth ?? anyImage.videoWidth ?? anyImage.displayWidth ?? anyImage.codedWidth ?? anyImage.width ?? 0;
  const height = anyImage.naturalHeight ?? anyImage.videoHeight ?? anyImage.displayHeight ?? anyImage.codedHeight ?? anyImage.height ?? 0;
  return { width, height };
}
function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
export {
  CanvasRenderer,
  createCanvas,
  fontString,
  imageSize,
  textLineHeight
};
