// ============================================================
// DisplayObject — 可渲染显示对象实现
// ============================================================

import type { DisplayObject as IDisplayObject } from '../types/DisplayObject'
import type { PaintStyle } from '../types/Paint'
import type { BoundingRectLike } from '../types/BoundingRect'
import type { Paint as IPaint } from '../types/Paint'
import { Element } from './Element'

export class DisplayObject<P = any> extends Element<P> implements IDisplayObject<P> {
  type: string = 'displayobject'

  // ---- 绘制属性 ----

  paint: IPaint
  paintStyle: PaintStyle = 'fill'
  alpha: number = 1

  // ---- 裁剪 ----

  clipRect?: BoundingRectLike

  // ---- 缓存 ----

  cached?: boolean

  constructor(props?: P) {
    super(props)
    this.paint = {
      paintStyle: 'fill',
      fill: null,
      stroke: null,
      firstStroke: false,
      shadow: null,
      font: null,
      opacity: 1,
      compositeOperation: 'source-over',
      clipPath: undefined,
      clipRule: 'nonzero',
      clone: () => ({ ...this.paint }),
    }
  }

  /** 获取渲染包围盒（世界坐标，含 stroke 扩展） */
  getRenderBounds(): { minX: number; minY: number; maxX: number; maxY: number } {
    const local = this.getLocalBounds()
    const lt = this.localToWorld({ x: local.minX, y: local.minY })
    const rb = this.localToWorld({ x: local.maxX, y: local.maxY })
    return {
      minX: Math.min(lt.x, rb.x),
      minY: Math.min(lt.y, rb.y),
      maxX: Math.max(lt.x, rb.x),
      maxY: Math.max(lt.y, rb.y),
    }
  }
}
