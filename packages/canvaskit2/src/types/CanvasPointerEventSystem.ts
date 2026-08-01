/**
 * Canvas 指针事件系统
 * 监听所有 pointer 事件，模拟 dragstart / drag / dragend，支持 wheel
 */
import type { EventEmitter } from './EventEmitter'
import type { CanvasPointerEvent } from './CanvasPointerEvent'

/** CanvasPointerEventSystem 构造选项 */
export interface CanvasPointerEventSystemOptions {
  /** 事件总线 */
  proxyHandle?: EventEmitter<PointerEventSystemEvents>
  /** 绑定的 DOM 元素 */
  domElement?: HTMLElement | null
  /** 命中检测函数，根据坐标返回目标元素 */
  findTarget?: (x: number, y: number) => any
}

/** proxyHandle 派发的事件类型 */
export interface PointerEventSystemEvents {
  [key: string]: any[]
  pointerdown: [CanvasPointerEvent]
  pointermove: [CanvasPointerEvent]
  pointerup: [CanvasPointerEvent]
  pointerenter: [CanvasPointerEvent]
  pointerleave: [CanvasPointerEvent]
  dragstart: [CanvasPointerEvent]
  drag: [CanvasPointerEvent]
  dragend: [CanvasPointerEvent]
  click: [CanvasPointerEvent]
  dblclick: [CanvasPointerEvent]
  wheel: [WheelEvent]
}

export interface CanvasPointerEventSystem {
  /** 外部事件总线，外部通过 proxyHandle.on('drag', handler) 监听模拟事件 */
  proxyHandle: EventEmitter<PointerEventSystemEvents>

  /** 绑定的 DOM 元素，由 attachEvents 时设置 */
  domElement: HTMLElement | null

  /** 命中检测函数，根据坐标返回目标元素 */
  findTarget: ((x: number, y: number) => any) | null

  /** 是否启用 */
  enabled: boolean

  /** 拖拽触发阈值（像素），超过此值才触发 dragstart */
  dragThreshold: number

  /** 从按下到抬起的最长时间（ms），超过不算点击，默认 300 */
  clickTimeThreshold: number

  /** 两次点击的最大间隔（ms），用于双击判定，默认 400 */
  dblClickThreshold: number

  /** 当前是否处于拖拽状态 */
  readonly isDragging: boolean

  /** 附加事件监听（绑定到 domElement） */
  attachEvents(): void

  /** 卸载事件监听（移除所有绑定的原生事件） */
  detachEvents(): void

  /** 销毁，移除所有事件监听 */
  destroy(): void
}
