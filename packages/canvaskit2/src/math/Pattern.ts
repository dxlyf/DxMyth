// ============================================================
// Pattern — 图案填充，实现 types/Pattern 接口
// ============================================================

import type { Pattern as IPattern, PatternRepeat } from '../types/Pattern'
import type { Matrix2DLike } from '../types/Matrix2D'

export class Pattern implements IPattern {
  image: CanvasImageSource
  repeat: PatternRepeat
  matrix?: Matrix2DLike

  constructor(image: CanvasImageSource, repeat: PatternRepeat = 'repeat', matrix?: Matrix2DLike) {
    this.image = image
    this.repeat = repeat
    this.matrix = matrix
  }

  // ==================== 静态工厂 ====================

  /** 从另一个 Pattern 复制 */
  static from(source: IPattern): Pattern {
    return new Pattern(source.image, source.repeat, source.matrix)
  }

  // ==================== 工具 ====================

  clone(): IPattern {
    return new Pattern(this.image, this.repeat, this.matrix)
  }
}
