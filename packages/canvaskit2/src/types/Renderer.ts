/**
 * Renderer — 渲染器基类接口
 *
 * 抽象不同后端（Canvas2D / CanvasKit / WebGL / WebGPU）的绘制能力。
 * 引擎通过 Renderer 接口驱动渲染，具体实现由各后端提供。
 */
import type { Paint } from './Paint'
import type { ColorValue } from './Color'
import type { Gradient } from './Gradient'
import type { Pattern } from './Pattern'
import type { Matrix2DLike } from './Matrix2D'
import type { BoundingRectLike } from './BoundingRect'
import type { CanvasKit } from '../ck/lib'

/** 路径对象（canvaskit-wasm 的 Path） */
export type Path = CanvasKit.Path

// ============================================================
// 渲染器选项
// ============================================================

/** 渲染器初始化选项 */
export interface RendererOptions {
  /** 目标画布 */
  canvas: HTMLCanvasElement
  /** 设备像素比（默认 window.devicePixelRatio） */
  dpr?: number
  /** 画布宽度（CSS 像素） */
  width?: number
  /** 画布高度（CSS 像素） */
  height?: number
  /** 是否开启抗锯齿（默认 true） */
  antialias?: boolean
  /** 背景色 */
  backgroundColor?: ColorValue
}

// ============================================================
// 文本度量
// ============================================================

/** 文本度量结果 */
export interface TextMetrics {
  /** 文本宽度 */
  width: number
  /** 实际边界高度 */
  height: number
  /** 基线到顶部距离 */
  ascent: number
  /** 基线到底部距离 */
  descent: number
}

// ============================================================
// Renderer 接口
// ============================================================

export interface Renderer {
  // ---- 标识 ----

  /** 渲染器类型（如 'canvas' / 'canvaskit' / 'webgl'） */
  readonly type: string
  /** 渲染器选项 */
  readonly options: RendererOptions

  // ---- 生命周期 ----

  /** 初始化渲染器（创建上下文、加载资源等） */
  init(): Promise<void> | void
  /** 销毁渲染器，释放资源 */
  destroy(): void
  /** 调整画布尺寸 */
  resize(width: number, height: number): void

  // ---- 画布信息 ----

  /** 画布宽度（CSS 像素） */
  readonly width: number
  /** 画布高度（CSS 像素） */
  readonly height: number
  /** 设备像素比 */
  readonly dpr: number

  // ---- 帧管理 ----

  /** 开始一帧渲染 */
  beginFrame(): void
  /** 结束当前帧 */
  endFrame(): void
  /** 清空画布 */
  clear(): void
  /** 清空并填充背景色 */
  clear(color: ColorValue): void

  // ---- 上下文状态（save/restore 栈） ----

  /** 保存当前绘制状态（变换矩阵、样式、裁剪） */
  save(): void
  /** 恢复上一次保存的绘制状态 */
  restore(): void

  // ---- 变换矩阵 ----

  /** 设置当前变换矩阵 */
  setTransform(matrix: Matrix2DLike): void
  /** 在当前矩阵基础上左乘矩阵 */
  transform(matrix: Matrix2DLike): void
  /** 平移 */
  translate(tx: number, ty: number): void
  /** 缩放 */
  scale(sx: number, sy: number): void
  /** 旋转（弧度） */
  rotate(radians: number): void

  // ---- 样式应用 ----

  /** 应用 Paint 到渲染上下文（填充 / 描边 / 阴影 / 字体 / 透明度 / 合成） */
  applyPaint(paint: Paint): void
  /** 应用填充样式 */
  applyFill(paint: Paint): void
  /** 应用描边样式 */
  applyStroke(paint: Paint): void
  /** 应用阴影样式 */
  applyShadow(paint: Paint): void
  /** 应用字体样式 */
  applyFont(paint: Paint): void

  // ---- 路径绘制 ----

  /** 填充 Path */
  fillPath(path: Path, fillRule?: CanvasFillRule): void
  /** 描边 Path */
  strokePath(path: Path): void
  /** 填充并描边 Path */
  fillAndStrokePath(path: Path, fillRule?: CanvasFillRule): void
  /** 按 PaintStyle 自动选择填充 / 描边 / 两者 */
  drawPath(path: Path, paint: Paint): void

  // ---- 基础图形 ----

  /** 绘制矩形 */
  drawRect(x: number, y: number, w: number, h: number, paint: Paint): void
  /** 绘制圆角矩形 */
  drawRoundRect(x: number, y: number, w: number, h: number, radius: number | number[], paint: Paint): void
  /** 绘制圆形 */
  drawCircle(cx: number, cy: number, r: number, paint: Paint): void
  /** 绘制椭圆 */
  drawEllipse(cx: number, cy: number, rx: number, ry: number, paint: Paint): void
  /** 绘制直线 */
  drawLine(x0: number, y0: number, x1: number, y1: number, paint: Paint): void
  /** 绘制折线 */
  drawPolyline(points: ArrayLike<number>, paint: Paint, close?: boolean): void

  // ---- 文本 ----

  /** 填充文本 */
  fillText(text: string, x: number, y: number, paint: Paint, maxWidth?: number): void
  /** 描边文本 */
  strokeText(text: string, x: number, y: number, paint: Paint, maxWidth?: number): void
  /** 度量文本 */
  measureText(text: string, paint: Paint): TextMetrics

  // ---- 图像 ----

  /** 绘制图像 */
  drawImage(image: CanvasImageSource, dx: number, dy: number): void
  /** 绘制图像并指定目标尺寸 */
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void
  /** 绘制图像的指定区域到目标区域 */
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void

  // ---- 裁剪 ----

  /** 使用路径裁剪 */
  clipPath(path: Path, fillRule?: CanvasFillRule): void
  /** 使用矩形裁剪 */
  clipRect(rect: BoundingRectLike): void

  // ---- 合成 ----

  /** 设置全局透明度 */
  setOpacity(opacity: number): void
  /** 设置合成模式 */
  setCompositeOperation(operation: GlobalCompositeOperation): void

  // ---- 渐变 / 图案工厂 ----

  /** 创建线性渐变 */
  createLinearGradient(gradient: Gradient): CanvasKit.Shader
  /** 创建径向渐变 */
  createRadialGradient(gradient: Gradient): CanvasGradient
  /** 创建锥形渐变 */
  createConicGradient(gradient: Gradient): CanvasGradient
  /** 创建图案 */
  createPattern(pattern: Pattern): CanvasPattern | null
}
