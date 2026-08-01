// ============================================================
// CanvasPointerEventSystem — 指针事件系统实现
// 监听 pointer / wheel 事件，模拟 dragstart / drag / dragend
// ============================================================

import type { CanvasPointerEventSystem as ICanvasPointerEventSystem, PointerEventSystemEvents, CanvasPointerEventSystemOptions } from '../types/CanvasPointerEventSystem'
import type { CanvasPointerEvent } from '../types/CanvasPointerEvent'
import type { EventEmitter as IEventEmitter } from '../types/EventEmitter'
import { EventEmitter } from './EventEmitter'
import type { Point } from '../types/Point'
import { CanvasPointerEvent as PointerEventImpl } from './CanvasPointerEvent'

/** 绑定的事件处理器引用，用于 removeEventListener */
interface Handlers {
  pointerdown: (e: PointerEvent) => void
  pointermove: (e: PointerEvent) => void
  pointerup: (e: PointerEvent) => void
  pointerenter: (e: PointerEvent) => void
  pointerleave: (e: PointerEvent) => void
  wheel: (e: WheelEvent) => void
}

export class CanvasPointerEventSystem implements ICanvasPointerEventSystem {
  proxyHandle: IEventEmitter<PointerEventSystemEvents>
  domElement: HTMLElement | null = null
  findTarget: ((x: number, y: number) => any) | null = null
  enabled: boolean = true
  dragThreshold: number = 4

  // ---- 拖拽状态 ----

  private _isDown: boolean = false
  private _dragStarted: boolean = false
  private _downX: number = 0
  private _downY: number = 0
  private _downTarget: any = null
  private _lastX: number = 0
  private _lastY: number = 0
  /** 当前悬停的目标，用于模拟 pointerenter / pointerleave */
  private _hoveredTarget: any = null

  // ---- 点击状态 ----

  /** 从按下到抬起的最长时间（ms），超过不算点击，默认 300 */
  clickTimeThreshold: number = 300
  /** 两次点击的最大间隔（ms），用于双击判定，默认 400 */
  dblClickThreshold: number = 400
  /** 本次按下的时间戳，用于点击时长检测 */
  private _downTime: number = 0
  /** 上次点击的时间戳，用于双击检测 */
  private _lastClickTime: number = 0
  /** 上次点击的目标，用于双击检测 */
  private _lastClickTarget: any = null

  /** 绑定的原生事件处理器 */
  private _handlers: Handlers
  /** 是否已绑定事件 */
  private _attached: boolean = false

  constructor(options: CanvasPointerEventSystemOptions = {}) {
    this.proxyHandle = options.proxyHandle ?? new EventEmitter<PointerEventSystemEvents>()
    this.domElement = options.domElement ?? null
    this.findTarget = options.findTarget ?? null

    // 用箭头函数绑好 this，方便 add/removeEventListener
    this._handlers = {
      pointerdown: (e: PointerEvent) => this._onPointerEvent('pointerdown', e),
      pointermove: (e: PointerEvent) => this._onPointerEvent('pointermove', e),
      pointerup: (e: PointerEvent) => this._onPointerEvent('pointerup', e),
      pointerenter: (e: PointerEvent) => this._onPointerEvent('pointerenter', e),
      pointerleave: (e: PointerEvent) => this._onPointerEvent('pointerleave', e),
      wheel: (e: WheelEvent) => this._onWheel(e),
    }
  }

  // ---- 只读属性 ----

  get isDragging(): boolean {
    return this._dragStarted
  }

  // ---- 事件绑定 / 卸载 ----

  attachEvents(): void {
    if (this._attached || !this.domElement) return

    const el = this.domElement
    const h = this._handlers
    el.addEventListener('pointerdown', h.pointerdown)
    el.addEventListener('pointermove', h.pointermove)
    el.addEventListener('pointerup', h.pointerup)
    el.addEventListener('pointerenter', h.pointerenter)
    el.addEventListener('pointerleave', h.pointerleave)
    el.addEventListener('wheel', h.wheel, { passive: false })
    this._attached = true
  }

  detachEvents(): void {
    if (!this._attached || !this.domElement) return

    const el = this.domElement
    const h = this._handlers
    el.removeEventListener('pointerdown', h.pointerdown)
    el.removeEventListener('pointermove', h.pointermove)
    el.removeEventListener('pointerup', h.pointerup)
    el.removeEventListener('pointerenter', h.pointerenter)
    el.removeEventListener('pointerleave', h.pointerleave)
    el.removeEventListener('wheel', h.wheel)
    this._attached = false
  }

  destroy(): void {
    this.detachEvents()
    this.domElement = null
    this._isDown = false
    this._dragStarted = false
    this._downTarget = null
    this._hoveredTarget = null
    this._lastClickTime = 0
    this._lastClickTarget = null
  }

  // ---- 原生事件处理 ----

  private _onPointerEvent(delegateType: string, e: PointerEvent): void {
    if (!this.enabled) return

    const [px, py] = this._getElementPos(e)
    const target = this.findTarget ? this.findTarget(px, py):null

    this.domElement.setPointerCapture(e.pointerId)
    switch (delegateType) {
      case 'pointerdown':
        this._isDown = true
        this._dragStarted = false
        this._downX = px
        this._downY = py
        this._downTime = e.timeStamp
        this._lastX = px
        this._lastY = py
        this._downTarget = target
        this.proxyHandle.emit('pointerdown', this._buildEvent('pointerdown', e, px, py, target))
        break

      case 'pointermove':
        // 模拟 pointerenter / pointerleave
        if (target !== this._hoveredTarget) {
          if (this._hoveredTarget) {
            this.proxyHandle.emit('pointerleave', this._buildEvent('pointerleave', e, px, py, this._hoveredTarget))
          }
          if (target) {
            this.proxyHandle.emit('pointerenter', this._buildEvent('pointerenter', e, px, py, target))
          }
          this._hoveredTarget = target
        }

        // 检测拖拽开始
        if (this._isDown && !this._dragStarted) {
          const dist = Math.hypot(px - this._downX, py - this._downY)
          if (dist >= this.dragThreshold) {
            this._dragStarted = true
            this.proxyHandle.emit('dragstart', this._buildEvent('dragstart', e, px, py, this._downTarget))
          }
        }

        this.proxyHandle.emit('pointermove', this._buildEvent('pointermove', e, px, py, target))

        if (this._dragStarted) {
          this.proxyHandle.emit('drag', this._buildEvent('drag', e, px, py, this._downTarget))
        }

        this._lastX = px
        this._lastY = py
        break

      case 'pointerup': {
        this._isDown = false
        this.proxyHandle.emit('pointerup', this._buildEvent('pointerup', e, px, py, target))

        if (this._dragStarted) {
          this._dragStarted = false
          this.proxyHandle.emit('dragend', this._buildEvent('dragend', e, px, py, this._downTarget))
        } else if (target && target === this._downTarget && (e.timeStamp - this._downTime) <= this.clickTimeThreshold) {
          // 未拖拽、目标一致、且在点击时长内 → 点击
          const evt = this._buildEvent('click', e, px, py, target)
          this.proxyHandle.emit('click', evt)

          // 双击检测
          const now = e.timeStamp
          if (
            this._lastClickTarget === target &&
            now - this._lastClickTime <= this.dblClickThreshold
          ) {
            this.proxyHandle.emit('dblclick', this._buildEvent('dblclick', e, px, py, target))
            this._lastClickTime = 0
            this._lastClickTarget = null
          } else {
            this._lastClickTime = now
            this._lastClickTarget = target
          }
        } else {
          // 点击未命中目标，重置双击状态
          this._lastClickTime = 0
          this._lastClickTarget = null
        }

        this._downTarget = null
        break
      }

      case 'pointerenter':
        this._hoveredTarget = target
        this.proxyHandle.emit('pointerenter', this._buildEvent('pointerenter', e, px, py, target))
        break

      case 'pointerleave':
        if (this._dragStarted) {
          this._dragStarted = false
          this.proxyHandle.emit('dragend', this._buildEvent('dragend', e, px, py, this._downTarget))
        }
        this._isDown = false
        this._downTarget = null
        this._hoveredTarget = null
        this.proxyHandle.emit('pointerleave', this._buildEvent('pointerleave', e, px, py, target))
        break
    }
  }

  private _onWheel(e: WheelEvent): void {
    if (!this.enabled) return
    this.proxyHandle.emit('wheel', e)
  }

  // ---- 工具 ----

  /** 获取元素相对坐标 [x, y] */
  private _getElementPos(e: PointerEvent): [number, number] {
    if (!this.domElement) return [e.clientX, e.clientY]

    const rect = this.domElement.getBoundingClientRect()
    return [e.clientX - rect.left, e.clientY - rect.top]
  }

  /** 构建 CanvasPointerEvent */
  private _buildEvent(type: string, e: PointerEvent, px: number, py: number, target: any): CanvasPointerEvent {
    return new PointerEventImpl({
      type,
      nativeEvent: e,
      target,
      currentTarget: null,
      point: { x: px, y: py },
      downPoint: this._isDown ? { x: this._downX, y: this._downY } : null,
      upPoint: { x: px, y: py },
      deltaPoint: { x: px - this._lastX, y: py - this._lastY } ,
      offsetPoint: { x: px - this._downX, y: py - this._downY },
      button: e.button,
      buttons: e.buttons,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      timeStamp: e.timeStamp,
    })
  }
}
