/**
 * Canvas 指针事件对象
 * 封装鼠标/触摸/笔在 Canvas 上的事件信息
 */
import type { PointLike } from './Point'

export interface CanvasPointerEvent {
  /** 事件类型（pointerdown / pointermove / pointerup / pointerenter / pointerleave / click） */
  type: string

  /** 原始 PointerEvent */
  nativeEvent: PointerEvent

  /** 事件目标元素（触发事件的元素） */
  target: any
  /** 当前事件处理阶段的元素（冒泡过程中的当前元素） */
  currentTarget: any

  /** 事件传播路径 */
  composedPath(): any[]

  /** 当前指针在 Canvas 中的坐标（相对于 canvas 左上角） */
  point: PointLike

  /** 指针按下时的坐标（无按下状态时为 null） */
  downPoint: PointLike | null

  /** 指针抬起时的坐标（无抬起状态时为 null） */
  upPoint: PointLike | null

  /** 当前事件与上一次事件之间的位移 */
  deltaPoint: PointLike

  /** 指针相对于触发元素的偏移 */
  offsetPoint: PointLike

  /** 鼠标按键（与 PointerEvent.button 一致） */
  button: number

  /** 按下的鼠标按键掩码（与 PointerEvent.buttons 一致） */
  buttons: number

  /** 修饰键 */
  altKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  metaKey: boolean

  /** 时间戳 */
  timeStamp: number

  /** 阻止事件冒泡 */
  stopPropagation(): void
}
