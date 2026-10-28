import { Matrix2D } from "../math/Matrix2D.js";
import { Path2D } from "../math/Path2D.js";
import { Color } from "../math/Color.js";
import { isEmptyMesh, tessellateFill, tessellateStroke, EMPTY_MESH, flattenPath } from "./geometry.js";
import { createCanvas, imageSize, fontString, textLineHeight } from "./CanvasRenderer.js";
const TAU = Math.PI * 2;
const MAX_GRADIENT_STOPS = 8;
function resolveGradient(source) {
  if (typeof source === "string" || source instanceof Color) {
    const c = toRGBA(source);
    return {
      kind: 0,
      params0: new Float32Array([c[0], c[1], c[2], c[3]]),
      params1: new Float32Array(4),
      colors: new Float32Array(MAX_GRADIENT_STOPS * 4),
      offsets: new Float32Array(MAX_GRADIENT_STOPS),
      count: 0
    };
  }
  if (source.type === "pattern") return null;
  if (source.type === "linear-gradient") {
    const stops2 = normalizeStops(source.stops);
    return {
      kind: 1,
      params0: new Float32Array([source.x0, source.y0, source.x1, source.y1]),
      params1: new Float32Array(4),
      ...stops2
    };
  }
  if (source.type === "radial-gradient") {
    const stops2 = normalizeStops(source.stops);
    return {
      kind: 2,
      params0: new Float32Array([source.x0, source.y0, Math.max(0, source.r0), 0]),
      params1: new Float32Array([source.x1, source.y1, Math.max(0, source.r1), 0]),
      ...stops2
    };
  }
  const stops = normalizeStops(source.stops);
  return {
    kind: 3,
    params0: new Float32Array([source.x, source.y, source.startAngle, 0]),
    params1: new Float32Array(4),
    ...stops
  };
}
function normalizeStops(stops) {
  const list = (stops ?? []).map((s) => ({ offset: clamp01(s.offset), rgba: toRGBA(s.color) })).sort((a, b) => a.offset - b.offset);
  if (list.length === 0) list.push({ offset: 0, rgba: [0, 0, 0, 0] });
  const count = Math.min(MAX_GRADIENT_STOPS, list.length);
  const colors = new Float32Array(MAX_GRADIENT_STOPS * 4);
  const offsets = new Float32Array(MAX_GRADIENT_STOPS);
  const downsample = count < list.length;
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const rgba = downsample ? sampleStops(list, t) : list[i].rgba;
    offsets[i] = downsample ? t : list[i].offset;
    colors[i * 4] = rgba[0];
    colors[i * 4 + 1] = rgba[1];
    colors[i * 4 + 2] = rgba[2];
    colors[i * 4 + 3] = rgba[3];
  }
  return { colors, offsets, count };
}
function sampleStops(list, t) {
  if (list.length === 0) return [0, 0, 0, 0];
  if (t <= list[0].offset) return list[0].rgba;
  for (let i = 1; i < list.length; i++) {
    if (t <= list[i].offset) {
      const span = list[i].offset - list[i - 1].offset || 1e-6;
      const k = (t - list[i - 1].offset) / span;
      const a = list[i - 1].rgba;
      const b = list[i].rgba;
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k];
    }
  }
  return list[list.length - 1].rgba;
}
function toRGBA(color) {
  if (typeof color === "string") {
    const parsed = Color.fromInput(color);
    return [parsed[0], parsed[1], parsed[2], parsed[3] ?? 1];
  }
  return [color[0], color[1], color[2], color[3] ?? 1];
}
function sourceColorCSS(source) {
  if (typeof source === "string") return source;
  if (source instanceof Color) return source.toRGBAString();
  if (source.type === "pattern") return "#000";
  return source.stops.length > 0 ? sourceColorCSS(source.stops[0].color) : "transparent";
}
function resolveBlend(mode) {
  const state = {
    equation: "add",
    src: "src-alpha",
    dst: "one-minus-src-alpha",
    srcAlpha: "one",
    dstAlpha: "one-minus-src-alpha"
  };
  switch (mode) {
    case "source-over":
      return state;
    case "source-in":
      return { ...state, src: "dst-alpha", dst: "zero" };
    case "source-out":
      return { ...state, src: "one-minus-dst-alpha", dst: "zero" };
    case "source-atop":
      return { ...state, src: "dst-alpha", dst: "one-minus-src-alpha" };
    case "destination-over":
      return { ...state, src: "one-minus-dst-alpha", dst: "one" };
    case "destination-in":
      return { ...state, src: "zero", dst: "src-alpha" };
    case "destination-out":
      return { ...state, src: "zero", dst: "one-minus-src-alpha" };
    case "destination-atop":
      return { ...state, src: "one-minus-dst-alpha", dst: "src-alpha" };
    case "lighter":
      return { ...state, src: "one", dst: "one" };
    case "copy":
      return { ...state, src: "one", dst: "zero" };
    case "xor":
      return { ...state, src: "one-minus-dst-alpha", dst: "one-minus-src-alpha" };
    case "multiply":
      return { ...state, src: "dst-color", dst: "one-minus-src-alpha" };
    case "screen":
      return { ...state, src: "one", dst: "one-minus-src-color" };
    case "darken":
      return { ...state, equation: "min", src: "one", dst: "one" };
    case "lighten":
      return { ...state, equation: "max", src: "one", dst: "one" };
    default:
      return state;
  }
}
const TEXT_CACHE_LIMIT = 64;
class GPU2DRenderer {
  canvas;
  _width = 0;
  _height = 0;
  _pixelRatio = 1;
  _matrix = Matrix2D.identity();
  /** 当前嵌套的裁剪层数，0 表示没有裁剪 */
  _clipDepth = 0;
  _path = new Path2D();
  _scratch = new Path2D();
  _stack = [];
  _geometryCache = /* @__PURE__ */ new WeakMap();
  _shapeScratch = new Float32Array(0);
  _imageScratch = new Float32Array(16);
  _measureCanvas = null;
  _measureCtx = null;
  _textCache = /* @__PURE__ */ new Map();
  constructor(canvas, options = {}) {
    this.canvas = canvas ?? createCanvas(300, 150);
    this._pixelRatio = options.pixelRatio ?? 1;
    this._width = this.canvas.width / this._pixelRatio;
    this._height = this.canvas.height / this._pixelRatio;
  }
  /** 子类完成 GPU 初始化后调用，用于同步视口等资源 */
  initialize() {
    this.onResize();
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
    this.onResize();
    return this;
  }
  // ============================================================
  // 清屏
  // ============================================================
  clear(color) {
    this.onClear(color ?? null);
  }
  clearRect(x, y, width, height) {
    const m = this._deviceMatrix();
    const p = { x: 0, y: 0 };
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    const corners = [
      [x, y],
      [x + width, y],
      [x, y + height],
      [x + width, y + height]
    ];
    for (const [px, py] of corners) {
      p.x = px;
      p.y = py;
      m.mapPoint(p, p);
      x0 = Math.min(x0, p.x);
      y0 = Math.min(y0, p.y);
      x1 = Math.max(x1, p.x);
      y1 = Math.max(y1, p.y);
    }
    this.onClearRectDevice(
      Math.floor(x0),
      Math.floor(y0),
      Math.ceil(x1 - x0),
      Math.ceil(y1 - y0)
    );
  }
  // ============================================================
  // 变换栈
  // ============================================================
  save() {
    this._stack.push({ matrix: this._matrix.clone(), clipDepth: this._clipDepth });
  }
  restore() {
    const state = this._stack.pop();
    if (!state) return;
    this._matrix.copy(state.matrix);
    this._popClipTo(state.clipDepth);
  }
  resetTransform() {
    this._matrix.identity();
  }
  setTransform(a, b, c, d, tx, ty) {
    this._matrix.fromValues(a, b, c, d, tx, ty);
  }
  transform(a, b, c, d, tx, ty) {
    this._matrix.multiply(Matrix2D.fromValues(a, b, c, d, tx, ty));
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
  }
  rotate(radians) {
    this._matrix.rotate(radians);
  }
  scale(x, y = x) {
    this._matrix.scale(x, y);
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
    const path = typeof pathOrRule === "string" || pathOrRule === void 0 ? this._path : pathOrRule;
    const rule = typeof pathOrRule === "string" ? pathOrRule : fillRule ?? "nonzero";
    const mesh = this._fillMesh(this._entryFor(path, true), rule);
    this._pushClipMesh(mesh, this._deviceMatrix());
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
    if (!dw || !dh || !sw || !sh) return;
    const iw = size.width || 1;
    const ih = size.height || 1;
    const uv = { u0: sx / iw, v0: sy / ih, u1: (sx + sw) / iw, v1: (sy + sh) / ih };
    this.submitImage(
      image,
      this._deviceMatrix(),
      { x: dx, y: dy, width: dw, height: dh },
      uv,
      paint ? paint.opacity : 1,
      paint ? paint.blend : "source-over",
      paint ? paint.imageSmoothing : true
    );
  }
  // ============================================================
  // 路径与图元
  // ============================================================
  drawPath(path, paint) {
    this._paintEntry(this._entryFor(path, true), paint);
  }
  drawRect(x, y, width, height, paint) {
    const p = this._resetScratch();
    p.rect(x, y, width, height);
    this._paintEntry(this._entryFor(p, false), paint);
  }
  drawRoundRect(x, y, width, height, radius, paint) {
    const p = this._resetScratch();
    p.roundRect(x, y, width, height, radius);
    this._paintEntry(this._entryFor(p, false), paint);
  }
  drawEllipse(cx, cy, radiusX, radiusY, paint) {
    const p = this._resetScratch();
    p.ellipse(cx, cy, radiusX, radiusY, 0, 0, TAU, false);
    this._paintEntry(this._entryFor(p, false), paint);
  }
  drawEllipseArc(cx, cy, radiusX, radiusY, rotation, startAngle, endAngle, counterClockwise, paint) {
    const p = this._resetScratch();
    p.ellipse(cx, cy, radiusX, radiusY, rotation, startAngle, endAngle, counterClockwise);
    this._paintEntry(this._entryFor(p, false), paint);
  }
  drawCircle(cx, cy, radius, paint) {
    const p = this._resetScratch();
    p.ellipse(cx, cy, radius, radius, 0, 0, TAU, false);
    this._paintEntry(this._entryFor(p, false), paint);
  }
  drawArc(cx, cy, radius, startAngle, endAngle, counterClockwise, paint) {
    const p = this._resetScratch();
    p.arc(cx, cy, radius, startAngle, endAngle, counterClockwise);
    this._paintEntry(this._entryFor(p, false), paint);
  }
  drawLine(x1, y1, x2, y2, paint) {
    const p = this._resetScratch();
    p.moveTo(x1, y1);
    p.lineTo(x2, y2);
    this._paintEntry(this._entryFor(p, false), paint);
  }
  drawPolyline(points, paint, closed = false) {
    if (!points || points.length === 0) return;
    const p = this._resetScratch();
    p.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) p.lineTo(points[i].x, points[i].y);
    if (closed || points.length > 2) p.closePath();
    this._paintEntry(this._entryFor(p, false), paint);
  }
  // ============================================================
  // 文字
  // ============================================================
  drawText(text, x, y, paint) {
    if (!text) return;
    const texture = this._textTexture(text, x, y, paint);
    if (!texture) return;
    this.submitImage(
      texture.canvas,
      this._deviceMatrix(),
      { x: texture.left, y: texture.top, width: texture.width, height: texture.height },
      { u0: 0, v0: 0, u1: 1, v1: 1 },
      paint.opacity,
      paint.blend,
      true
    );
  }
  measureText(text, paint) {
    const ctx = this._measureContext();
    const lines = text ? text.split("\n") : [""];
    const size = paint.text.size ?? 16;
    let width = 0;
    let ascent = 0;
    let descent = 0;
    if (ctx) {
      ctx.font = fontString(paint.text);
      for (const line of lines) {
        const metrics = ctx.measureText(line || " ");
        width = Math.max(width, metrics.width);
        ascent = Math.max(ascent, metrics.actualBoundingBoxAscent ?? size * 0.8);
        descent = Math.max(descent, metrics.actualBoundingBoxDescent ?? size * 0.2);
      }
    }
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
  /**
   * 把多行文字栅格化到离屏 canvas，返回可当作纹理提交的方块。
   *
   * 对齐与基线在这里自行换算，因此纹理左上角是块的包围盒原点，
   * 提交时只需按用户坐标铺一个 quad。
   */
  _textTexture(text, x, y, paint) {
    const fillCSS = paint.fill ? sourceColorCSS(paint.fill) : null;
    const strokeCSS = paint.stroke ? sourceColorCSS(paint.stroke) : null;
    if (!fillCSS && !strokeCSS) return null;
    const size = paint.text.size ?? 16;
    const font = fontString(paint.text);
    const lineHeight = textLineHeight(paint);
    const lines = text.split("\n");
    const ctx = this._measureContext();
    if (!ctx) return null;
    ctx.font = font;
    const widths = [];
    let ascent = 0;
    let descent = 0;
    for (const line of lines) {
      const metrics = ctx.measureText(line || " ");
      widths.push(metrics.width);
      ascent = Math.max(ascent, metrics.actualBoundingBoxAscent ?? size * 0.8);
      descent = Math.max(descent, metrics.actualBoundingBoxDescent ?? size * 0.2);
    }
    const align = paint.text.align ?? "left";
    const baseline = paint.text.baseline ?? "alphabetic";
    const contentWidth = Math.max(1, ...widths);
    const contentHeight = Math.max(1, ascent + descent + (lines.length - 1) * lineHeight);
    const pad = Math.max(2, size * 0.25);
    const texWidth = contentWidth + pad * 2;
    const texHeight = contentHeight + pad * 2;
    const alignOffset = align === "center" ? contentWidth / 2 : align === "right" || align === "end" ? contentWidth : 0;
    const offsetTop = baseline === "top" || baseline === "hanging" ? 0 : baseline === "middle" ? (ascent + descent) / 2 : ascent;
    const contentLeft = x - alignOffset;
    const contentTop = y - offsetTop;
    const scale = Math.max(1, Math.min(4, this._deviceScale()));
    const key = [
      text,
      font,
      fillCSS,
      strokeCSS,
      paint.lineWidth,
      paint.lineCap,
      paint.lineJoin,
      align,
      baseline,
      paint.text.maxWidth ?? "",
      paint.text.letterSpacing ?? "",
      scale.toFixed(2)
    ].join("\0");
    const cached = this._textCache.get(key);
    if (cached) return cached;
    const canvas = createCanvas(
      Math.max(1, Math.ceil(texWidth * scale)),
      Math.max(1, Math.ceil(texHeight * scale))
    );
    const texCtx = canvas.getContext("2d");
    if (!texCtx) return null;
    texCtx.setTransform(scale, 0, 0, scale, (pad - contentLeft) * scale, (pad - contentTop) * scale);
    texCtx.font = font;
    texCtx.textAlign = "left";
    texCtx.textBaseline = "alphabetic";
    applyLetterSpacing(texCtx, paint.text.letterSpacing);
    const draw = (mode) => {
      const maxWidth = paint.text.maxWidth;
      for (let i = 0; i < lines.length; i++) {
        const w = widths[i];
        const lineX = align === "center" ? x - w / 2 : align === "right" || align === "end" ? x - w : x;
        const lineY = y + i * lineHeight;
        if (mode === "fill") texCtx.fillText(lines[i], lineX, lineY, maxWidth);
        else texCtx.strokeText(lines[i], lineX, lineY, maxWidth);
      }
    };
    if (strokeCSS) {
      texCtx.strokeStyle = strokeCSS;
      texCtx.lineWidth = paint.lineWidth;
      texCtx.lineCap = paint.lineCap;
      texCtx.lineJoin = paint.lineJoin;
    }
    if (fillCSS) texCtx.fillStyle = fillCSS;
    if (paint.paintOrder === "stroke-fill") {
      if (strokeCSS) draw("stroke");
      if (fillCSS) draw("fill");
    } else {
      if (fillCSS) draw("fill");
      if (strokeCSS) draw("stroke");
    }
    const texture = {
      canvas,
      left: contentLeft - pad,
      top: contentTop - pad,
      width: texWidth,
      height: texHeight
    };
    if (this._textCache.size >= TEXT_CACHE_LIMIT) {
      const oldest = this._textCache.keys().next();
      if (!oldest.done) this._textCache.delete(oldest.value);
    }
    this._textCache.set(key, texture);
    return texture;
  }
  _measureContext() {
    if (this._measureCtx) return this._measureCtx;
    this._measureCanvas = createCanvas(1, 1);
    this._measureCtx = this._measureCanvas.getContext("2d");
    return this._measureCtx;
  }
  // ============================================================
  // 绘制内部实现
  // ============================================================
  _paintEntry(entry, paint) {
    if (!paint.fill && !paint.stroke) return;
    const m = this._deviceMatrix();
    if (paint.paintOrder === "stroke-fill") {
      this._drawStroke(entry, paint, m);
      this._drawFill(entry, paint, m);
    } else {
      this._drawFill(entry, paint, m);
      this._drawStroke(entry, paint, m);
    }
  }
  _drawFill(entry, paint, m) {
    if (!paint.fill) return;
    const mesh = this._fillMesh(entry, paint.fillRule);
    if (isEmptyMesh(mesh)) return;
    this.submitMesh(mesh, m, paint.fill, paint.opacity, paint.blend);
  }
  _drawStroke(entry, paint, m) {
    if (!paint.stroke) return;
    if (paint.strokeAlign === "center") {
      const mesh2 = this._strokeMesh(entry, paint.lineWidth, paint);
      if (!isEmptyMesh(mesh2)) this.submitMesh(mesh2, m, paint.stroke, paint.opacity, paint.blend);
      return;
    }
    const width = paint.lineWidth * 2;
    const mesh = this._strokeMesh(entry, width, paint);
    if (isEmptyMesh(mesh)) return;
    const key = `${paint.strokeAlign}|${width}|${paint.fillRule}`;
    let clip = entry.clips.get(key);
    if (!clip) {
      clip = paint.strokeAlign === "inside" ? this._fillMesh(entry, paint.fillRule) : this._outsideMesh(entry, width);
      entry.clips.set(key, clip);
    }
    if (isEmptyMesh(clip)) return;
    const base = this._clipDepth;
    this._pushClipMesh(clip, m);
    try {
      this.submitMesh(mesh, m, paint.stroke, paint.opacity, paint.blend);
    } finally {
      this._popClipTo(base);
    }
  }
  _fillMesh(entry, rule) {
    let mesh = entry.fills.get(rule);
    if (!mesh) {
      mesh = tessellateFill(entry.contours, rule);
      entry.fills.set(rule, mesh);
    }
    return mesh;
  }
  _strokeMesh(entry, lineWidth, paint) {
    const key = `${lineWidth}|${paint.lineCap}|${paint.lineJoin}|${paint.miterLimit}|${paint.lineDash.join(",")}|${paint.lineDashOffset}`;
    let mesh = entry.strokes.get(key);
    if (!mesh) {
      mesh = tessellateStroke(entry.contours, {
        lineWidth,
        lineCap: paint.lineCap,
        lineJoin: paint.lineJoin,
        miterLimit: paint.miterLimit,
        lineDash: paint.lineDash,
        lineDashOffset: paint.lineDashOffset
      });
      entry.strokes.set(key, mesh);
    }
    return mesh;
  }
  /** 路径之外的补集（大矩形 + 路径本身，evenodd），用于 outside 描边裁剪 */
  _outsideMesh(entry, lineWidth) {
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const contour of entry.contours) {
      const points = contour.points;
      for (let i = 0; i < points.length; i += 2) {
        x0 = Math.min(x0, points[i]);
        y0 = Math.min(y0, points[i + 1]);
        x1 = Math.max(x1, points[i]);
        y1 = Math.max(y1, points[i + 1]);
      }
    }
    if (!Number.isFinite(x0)) return EMPTY_MESH;
    const pad = lineWidth + 1;
    const rect = [x0 - pad, y0 - pad, x1 + pad, y0 - pad, x1 + pad, y1 + pad, x0 - pad, y1 + pad];
    return tessellateFill([{ points: rect, closed: true }, ...entry.contours], "evenodd");
  }
  _entryFor(path, cache) {
    if (cache) {
      const hit = this._geometryCache.get(path);
      if (hit && hit.version === path.version) return hit;
    }
    const entry = {
      version: path.version,
      contours: flattenPath(path),
      fills: /* @__PURE__ */ new Map(),
      strokes: /* @__PURE__ */ new Map(),
      clips: /* @__PURE__ */ new Map()
    };
    if (cache) this._geometryCache.set(path, entry);
    return entry;
  }
  _resetScratch() {
    this._scratch.clear();
    return this._scratch;
  }
  // ============================================================
  // 裁剪层级
  // ============================================================
  _pushClipMesh(mesh, matrix) {
    this._clipDepth++;
    this.beginClip(mesh, matrix, this._clipDepth);
  }
  _popClipTo(level) {
    if (this._clipDepth <= level) return;
    const from = this._clipDepth;
    this._clipDepth = level;
    this.endClip(from, level);
  }
  // ============================================================
  // 供子类使用的工具
  // ============================================================
  /** 当前矩阵 × pixelRatio，得到从用户坐标到设备像素的变换 */
  _deviceMatrix() {
    const m = Matrix2D.from(this._matrix);
    m.scale(this._pixelRatio, this._pixelRatio);
    return m;
  }
  /** 当前用户坐标到设备像素的近似缩放量，用于文字超采样 */
  _deviceScale() {
    return Math.abs(this._matrix.getScale()) * this._pixelRatio;
  }
  /**
   * 生成 shape 程序的顶点：[x_dev, y_dev, lx, ly]。
   *
   * 设备坐标用于定位，局部坐标用于在片元里计算渐变 / pattern 的采样位置。
   * 返回的数组是复用缓冲区，调用方必须立即上传，不能跨帧持有。
   */
  shapeVertices(mesh, matrix) {
    const count = mesh.positions.length / 2;
    const needed = count * 4;
    if (this._shapeScratch.length < needed) this._shapeScratch = new Float32Array(needed);
    const out = this._shapeScratch;
    const p = mesh.positions;
    const m = matrix;
    for (let i = 0; i < count; i++) {
      const lx = p[i * 2];
      const ly = p[i * 2 + 1];
      const o = i * 4;
      out[o] = m[0] * lx + m[2] * ly + m[4];
      out[o + 1] = m[1] * lx + m[3] * ly + m[5];
      out[o + 2] = lx;
      out[o + 3] = ly;
    }
    return out.subarray(0, needed);
  }
  /**
   * 生成 image 程序的顶点：[x_dev, y_dev, u, v]，顺序为左上、右上、右下、左下。
   * 索引固定为 (0,1,2, 0,2,3)。
   */
  imageVertices(dst, uv, matrix) {
    const out = this._imageScratch;
    const x0 = dst.x;
    const y0 = dst.y;
    const x1 = dst.x + dst.width;
    const y1 = dst.y + dst.height;
    const m = matrix;
    const write = (i, x, y, u, v) => {
      const o = i * 4;
      out[o] = m[0] * x + m[2] * y + m[4];
      out[o + 1] = m[1] * x + m[3] * y + m[5];
      out[o + 2] = u;
      out[o + 3] = v;
    };
    write(0, x0, y0, uv.u0, uv.v0);
    write(1, x1, y0, uv.u1, uv.v0);
    write(2, x1, y1, uv.u1, uv.v1);
    write(3, x0, y1, uv.u0, uv.v1);
    return out;
  }
  flush() {
    this.onFlush();
  }
  dispose() {
    this._stack.length = 0;
    this._path.clear();
    this._scratch.clear();
    this._textCache.clear();
    this.onDispose();
  }
}
function clamp01(value) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}
function applyLetterSpacing(ctx, spacing) {
  if (spacing === void 0) return;
  ctx.letterSpacing = `${spacing}px`;
}
export {
  GPU2DRenderer,
  MAX_GRADIENT_STOPS,
  resolveBlend,
  resolveGradient,
  sourceColorCSS
};
