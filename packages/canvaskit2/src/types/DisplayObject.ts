/**
 * DisplayObject — 可渲染显示对象
 *
 * 所有需要渲染到屏幕的元素（Rect、Ellipse、Text、Image、Path、Group 等）
 * 均继承此类。在 Element 的基础上添加绘制样式、合成与裁剪能力。
 */
import type { Element } from './Element'
import type { ElementProps } from './Element'
import type { Paint, PaintStyle } from './Paint'
import type { BoundingRectLike } from './BoundingRect'

export interface DisplayObject<P = any> extends Element<P> {
  // ---- 绘制 ----

  /** 绘制属性（填充 / 描边 / 阴影 / 字体 / 合成等） */
  paint: Paint

  /** 绘制模式快捷方式 */
  paintStyle: PaintStyle

  /** 全局不透明度（0-1，默认 1，快捷方式） */
  alpha: number

  // ---- 裁剪 / 遮罩 ----

  /** 裁剪矩形（世界坐标），超出部分不渲染 */
  clipRect?: BoundingRectLike

  // ---- 渲染控制 ----

  /** 是否缓存为位图（复杂图形可提升性能） */
  cached?: boolean

  /** 获取渲染包围盒（世界坐标，含 stroke 等扩展区域） */
  getRenderBounds(): BoundingRectLike
}

// ============================================================
// DisplayObject 构造参数
// ============================================================

/**
 * DisplayObject 构造参数
 * 继承 ElementProps，增加绘制样式属性
 */
export interface DisplayObjectProps extends ElementProps {
  /** 绘制属性 */
  paint?: Paint
  /** 绘制模式 */
  paintStyle?: PaintStyle
  /** 全局不透明度 */
  alpha?: number
  /** 裁剪矩形 */
  clipRect?: BoundingRectLike
  /** 是否缓存为位图 */
  cached?: boolean
}
