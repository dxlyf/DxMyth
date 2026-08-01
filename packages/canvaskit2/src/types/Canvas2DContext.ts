/**
 * CanvasRenderingContext2D 接口定义
 * 完全对齐浏览器标准 CanvasRenderingContext2D
 */

export interface Canvas2DContext {
  // ---- canvas ----
  readonly canvas: HTMLCanvasElement | OffscreenCanvas

  // ---- 状态 ----
  save(): void
  restore(): void

  // ---- 变换 ----
  translate(x: number, y: number): void
  rotate(angle: number): void
  scale(x: number, y: number): void
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void
  getTransform(): DOMMatrix
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void
  setTransform(transform?: DOMMatrix2DInit): void
  resetTransform(): void

  // ---- 合成 ----
  globalAlpha: number
  globalCompositeOperation: GlobalCompositeOperation

  // ---- 线条样式 ----
  lineWidth: number
  lineCap: CanvasLineCap
  lineJoin: CanvasLineJoin
  miterLimit: number
  lineDashOffset: number
  getLineDash(): number[]
  setLineDash(segments: number[]): void

  // ---- 描边 / 填充样式 ----
  strokeStyle: string | CanvasGradient | CanvasPattern
  fillStyle: string | CanvasGradient | CanvasPattern

  // ---- 阴影 ----
  shadowBlur: number
  shadowColor: string
  shadowOffsetX: number
  shadowOffsetY: number

  // ---- 滤镜 ----
  filter: string

  // ---- 矩形 ----
  clearRect(x: number, y: number, w: number, h: number): void
  fillRect(x: number, y: number, w: number, h: number): void
  strokeRect(x: number, y: number, w: number, h: number): void

  // ---- 路径 ----
  beginPath(): void
  closePath(): void
  moveTo(x: number, y: number): void
  lineTo(x: number, y: number): void
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void
  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void
  rect(x: number, y: number, w: number, h: number): void
  roundRect(x: number, y: number, w: number, h: number, radii: number | DOMPointInit | (number | DOMPointInit)[]): void

  // ---- 绘制 ----
  fill(fillRule?: CanvasFillRule): void
  fill(path: Path2D, fillRule?: CanvasFillRule): void
  stroke(): void
  stroke(path: Path2D): void
  clip(fillRule?: CanvasFillRule): void
  clip(path: Path2D, fillRule?: CanvasFillRule): void
  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean
  isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean
  isPointInStroke(x: number, y: number): boolean
  isPointInStroke(path: Path2D, x: number, y: number): boolean

  // ---- 文字 ----
  font: string
  textAlign: CanvasTextAlign
  textBaseline: CanvasTextBaseline
  direction: CanvasDirection
  fillText(text: string, x: number, y: number, maxWidth?: number): void
  strokeText(text: string, x: number, y: number, maxWidth?: number): void
  measureText(text: string): TextMetrics

  // ---- 渐变 / 图案 ----
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient
  createConicGradient(startAngle: number, x: number, y: number): CanvasGradient
  createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null

  // ---- 图片 ----
  drawImage(image: CanvasImageSource, dx: number, dy: number): void
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void

  // ---- 像素 ----
  createImageData(sw: number, sh: number): ImageData
  createImageData(imagedata: ImageData): ImageData
  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData
  putImageData(imagedata: ImageData, dx: number, dy: number): void
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void

  // ---- 图像平滑 ----
  imageSmoothingEnabled: boolean
  imageSmoothingQuality: ImageSmoothingQuality

  // ---- 裁剪（非标准但广泛支持） ---
  getContextAttributes(): any
}
