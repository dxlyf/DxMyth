// ============================================================
// Group — 容器元素
// 可包含多个子元素，边界为所有子元素的并集
// ============================================================

import type { BoundingRectLike } from '../types/BoundingRect'
import type { Group as IGroup } from '../types/Group'
import { DisplayObject } from './DisplayObject'

export class Group<P = any> extends DisplayObject<P> implements IGroup<P> {
  type: string = 'group'

  /** 是否裁剪超出子元素边界的内容 */
  clipContent: boolean = false

  getLocalBounds(): BoundingRectLike {
    
  }

  getBounds(): BoundingRectLike {
    if (this.children.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    let hasBounds = false

    for (const child of this.children as unknown as DisplayObject[]) {
      const cb = child.getBounds()
      if (cb.maxX <= cb.minX && cb.maxY <= cb.minY) continue
      if (cb.minX < minX) minX = cb.minX
      if (cb.minY < minY) minY = cb.minY
      if (cb.maxX > maxX) maxX = cb.maxX
      if (cb.maxY > maxY) maxY = cb.maxY
      hasBounds = true
    }

    if (!hasBounds) return { minX: 0, minY: 0, maxX: 0, maxY: 0 }
    return { minX, minY, maxX, maxY }
  }

  hitTest(x: number, y: number): boolean {
    if (!this.visible) return false
    if (this.pointerEvents === 'none') return false

    // Group 命中检测：检查子元素
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i] as unknown as DisplayObject
      if (child.hitTest(x, y)) return true
    }
    return false
  }
}
