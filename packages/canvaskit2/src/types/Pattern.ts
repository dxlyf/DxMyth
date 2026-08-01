/**
 * 图案填充接口
 * 支持图片/Canvas 重复或平铺模式
 */
import type { Matrix2DLike } from './Matrix2D'

/** 重复模式 */
export type PatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'

/** 图案参数 */
export interface Pattern {
  /** 图片源 */
  image: CanvasImageSource

  /** 重复模式 */
  repeat: PatternRepeat

  /** 变换矩阵 */
  matrix?: Matrix2DLike

  /** 克隆 */
  clone(): Pattern
}
