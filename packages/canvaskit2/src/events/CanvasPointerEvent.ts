// ============================================================
// CanvasPointerEvent — 指针事件对象实现
// ============================================================

import type { CanvasPointerEvent as ICanvasPointerEvent } from '../types/CanvasPointerEvent'
import type { PointLike } from '../types/Point'

export class CanvasPointerEvent implements ICanvasPointerEvent {
  type: string
  nativeEvent: PointerEvent
  target: any
  currentTarget: any
  point: PointLike
  downPoint: PointLike | null
  upPoint: PointLike | null
  deltaPoint: PointLike
  offsetPoint: PointLike
  button: number
  buttons: number
  altKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  metaKey: boolean
  timeStamp: number

  /** 是否已阻止传播 */
  private _propagationStopped: boolean = false

  constructor(init: {
    type: string
    nativeEvent: PointerEvent
    target: any
    currentTarget: any
    point: PointLike
    downPoint?: PointLike | null
    upPoint?: PointLike | null
    deltaPoint: PointLike
    offsetPoint: PointLike
    button?: number
    buttons?: number
    altKey?: boolean
    ctrlKey?: boolean
    shiftKey?: boolean
    metaKey?: boolean
    timeStamp?: number
  }) {
    this.type = init.type
    this.nativeEvent = init.nativeEvent
    this.target = init.target
    this.currentTarget = init.currentTarget
    this.point = init.point
    this.downPoint = init.downPoint ?? null
    this.upPoint = init.upPoint ?? null
    this.deltaPoint = init.deltaPoint
    this.offsetPoint = init.offsetPoint
    this.button = init.button ?? 0
    this.buttons = init.buttons ?? 0
    this.altKey = init.altKey ?? false
    this.ctrlKey = init.ctrlKey ?? false
    this.shiftKey = init.shiftKey ?? false
    this.metaKey = init.metaKey ?? false
    this.timeStamp = init.timeStamp ?? performance.now()
  }

  /** 事件传播路径，从 target 沿 parent 向上收集 */
  composedPath(): any[] {
    const path: any[] = []
    let el = this.target
    while (el) {
      path.push(el)
      el = el.parent
    }
    return path
  }

  /** 阻止事件冒泡 */
  stopPropagation(): void {
    this._propagationStopped = true
  }

  /** 查询是否已调用 stopPropagation */
  get propagationStopped(): boolean {
    return this._propagationStopped
  }
}
