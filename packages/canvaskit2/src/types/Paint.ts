/**
 * Paint — 绘制属性
 *
 * 聚合填充、描边、阴影、字体、透明度等所有绘制相关的样式属性，
 * 供 Renderer 在渲染时统一读取。
 */
import type { ColorValue } from './Color'
import type { Gradient } from './Gradient'
import type { Pattern } from './Pattern'
import type { Path } from './Renderer'

// ============================================================
// 类型 / 枚举
// ============================================================

/** 绘制模式 */
export type PaintStyle = 'fill' | 'stroke' | 'fill-and-stroke'

// ============================================================
// 子接口
// ============================================================

/** 填充样式 */
export interface FillStyle {
  /** 填充颜色 / 渐变 / 图案 */
  color?: ColorValue | Gradient | Pattern
  /** 填充规则（默认 'nonzero'）*/
  fillRule?: CanvasFillRule
}

/** 描边样式 */
export interface StrokeStyle {
  /** 描边颜色 */
  color?: ColorValue | Gradient | Pattern
  /** 描边宽度（默认 1） */
  width?: number
  /** 描边对齐方式：内 / 外 / 居中 */
  align?: 'inside' | 'outside' | 'center'
  /** 端点样式 */
  lineCap?: CanvasLineCap
  /** 连接样式 */
  lineJoin?: CanvasLineJoin
  /** 斜接限制（默认 10） */
  miterLimit?: number
  /** 虚线数组 */
  lineDash?: number[]
  /** 虚线偏移 */
  lineDashOffset?: number
}

/** 阴影样式 */
export interface ShadowStyle {
  /** 阴影颜色 */
  color?: ColorValue
  /** 阴影模糊半径（默认 0） */
  blur?: number
  /** 水平偏移 */
  offsetX?: number
  /** 垂直偏移 */
  offsetY?: number
}

/** 字体 / 文本样式 */
export interface FontStyle {
  /** 字体族 */
  fontFamily?: string
  /** 字号（px） */
  fontSize?: number
  /** 字重 */
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number
  /** 字体样式 */
  fontStyle?: 'normal' | 'italic' | 'oblique'
  /** 小型大写 */
  fontVariant?: 'normal' | 'small-caps'
  /** 行高 */
  lineHeight?: number | 'normal'
  /** 文本对齐 */
  textAlign?: CanvasTextAlign
  /** 基线对齐 */
  textBaseline?: CanvasTextBaseline
  /** 文字方向 */
  direction?: CanvasDirection
  /** 字间距 */
  letterSpacing?: number
  /** 是否自动换行 */
  wordWrap?: boolean
  /** 最大行宽（换行时使用） */
  maxWidth?: number
  /** 行溢出处理 */
  overflow?: 'visible' | 'hidden' | 'ellipsis'
}

// ============================================================
// Paint 主接口
// ============================================================

/** 绘制属性：所有可通过 Paint 控制的渲染属性 */
export interface Paint {
  // ---- 绘制模式 ----

  /** 绘制模式：仅填充 / 仅描边 / 两者 */
  paintStyle?: PaintStyle

  // ---- 填充 ----

  /** 填充颜色 / 渐变 / 图案 / 填充样式 */
  fill?: FillStyle | null


  // ---- 描边 ----

  /** 描边样式 */
  stroke?: StrokeStyle |  null

  // ---- 绘制顺序 ----

  /** 是否先绘制描边再绘制填充（默认 false = 先填充后描边） */
  firstStroke?: boolean

  // ---- 阴影 ----

  /** 阴影样式 */
  shadow?: ShadowStyle | null

  // ---- 字体 / 文本 ----

  /** 字体 / 文本样式 */
  font?: FontStyle | null

  // ---- 透明度 / 合成 ----

  /** 全局透明度（0-1，默认 1） */
  opacity?: number
  /** 合成模式 */
  compositeOperation?: GlobalCompositeOperation

  // ---- 裁剪 ----

  /** 裁剪路径（可选） */
  clipPath?: Path
  /** 裁剪规则 */
  clipRule?: CanvasFillRule

  // ---- 工具 ----

  /** 深度克隆 */
  clone(): Paint
}
