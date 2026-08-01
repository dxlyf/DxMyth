/**
 * Group — 容器元素接口
 *
 * 可包含多个子元素，边界为所有子元素的并集。
 * 支持裁剪子元素内容、嵌套层级管理。
 */
import type { DisplayObject } from './DisplayObject'

export interface Group<P = any> extends DisplayObject<P> {
  /** 是否裁剪超出子元素边界的内容 */
  clipContent: boolean
}
