// ============================================================
// EventSystem - 统一事件系统
// 支持 pointer / mouse / touch 三种输入模式：
//   - 'auto'（默认）：环境支持 PointerEvent 则用 pointer，否则降级 mouse+touch
//   - 'pointer'：仅 PointerEvent
//   - 'mouse'  ：MouseEvent（移动端不会触发）
//   - 'touch'  ：TouchEvent（桌面端不会触发）
//
// 工作流程：
//   1. 监听 DOM 事件（pointerdown/move/up 或 mousedown/move/up + touchstart/move/end）
//   2. 提取事件坐标（屏幕坐标）
//   3. 通过 Viewport 转换为世界坐标
//   4. 在 scene 上做命中测试，得到命中元素链
//   5. 派发事件到目标元素（含冒泡/捕获，由 EventTarget 实现）
//   6. 维护 hover 状态，自动派发 pointerenter/leave/over/out
// ============================================================

import type { Engine } from 'src/core/Engine'
import type { Element } from 'src/core/Element'
import { NodeEvent } from 'src/core/EventTarget'
import type { Viewport } from 'src/core/Viewport'
import { Container } from 'src/core/Container'

/** 输入模式 */
export type InputType = 'auto' | 'pointer' | 'mouse' | 'touch'

/** 派发到 Element 的事件数据 */
export interface PointerEventData {
    /** 屏幕坐标（CSS 像素，相对 canvas） */
    screenX: number
    screenY: number
    /** 世界坐标 */
    worldX: number
    worldY: number
    /** 按钮信息（pointer/mouse） */
    button: number
    /** 触摸点唯一标识 */
    pointerId: number
    /** 是否触摸设备 */
    isTouch: boolean
    /** 修饰键 */
    ctrlKey: boolean
    shiftKey: boolean
    altKey: boolean
    metaKey: boolean
    /** 原生事件 */
    nativeEvent: Event
    /** 相对上次 move 的位移（仅 move/drag 系列有效） */
    deltaX?: number
    deltaY?: number
    /** 相对 dragstart 的累计位移（仅 drag/dragend 有效） */
    totalDeltaX?: number
    totalDeltaY?: number
    /** 拖拽源目标（仅 drop/dragenter/dragleave/dragover 有效） */
    dragSource?: Element
}

/** 支持的事件类型 */
export type PointerEventName =
    | 'pointerdown'
    | 'pointermove'
    | 'pointerup'
    | 'pointerover'
    | 'pointerout'
    | 'pointerenter'
    | 'pointerleave'
    | 'click'
    | 'dblclick'
    // drag 系列（按下后移动超过阈值触发）
    | 'dragstart'
    | 'drag'
    | 'dragend'
    // drag-drop 系列（在拖拽中对其他元素触发）
    | 'dragenter'
    | 'dragleave'
    | 'dragover'
    | 'drop'

export class EventSystem {
    engine: Engine
    /** 当前输入模式 */
    inputType: InputType
    /** 实际生效的输入类型（auto 解析后） */
    resolvedType: 'pointer' | 'mouse' | 'touch'
    /** 是否已经启动监听 */
    private _started: boolean = false
    /** DOM 监听目标 */
    private _dom: HTMLElement | null = null
    /** 绑定的 DOM 事件处理函数引用（用于解绑） */
    private _handlers: { [name: string]: EventListener } = {}
    /** 当前 hover 的元素链（从目标到根） */
    private _hoverEl: Element
    /** 当前按下的元素（用于 click 判定） */
    private _pressedTarget: Element | null = null
    /** 按下时的坐标（用于 click 移动阈值） */
    private _pressedX: number = 0
    private _pressedY: number = 0
    /** 双击间隔阈值（毫秒） */
    dblClickInterval: number = 300
    /** click 移动阈值（像素） */
    clickMoveThreshold: number = 5
    /** drag 触发阈值（像素，按下后移动超过此距离才触发 dragstart） */
    dragStartThreshold: number = 4
    /** 上次 click 时间 */
    private _lastClickTime: number = 0
    /** 上次 click 目标 */
    private _lastClickTarget: Element | null = null
    /** 上次 pointermove 的屏幕坐标（用于计算 deltaX/deltaY） */
    private _lastMoveX: number = 0
    private _lastMoveY: number = 0
    // ============ Drag 状态 ============
    /** 当前是否处于拖拽中 */
    private _dragging: boolean = false
    /** 拖拽源元素 */
    private _dragSource: Element | null = null
    /** 拖拽按下时的屏幕坐标 */
    private _dragStartX: number = 0
    private _dragStartY: number = 0
    /** 拖拽按下时的世界坐标 */
    private _dragStartWorldX: number = 0
    private _dragStartWorldY: number = 0
    /** 按下时是否已移动超过阈值（用于决定是否触发 dragstart） */
    private _dragThresholdMet: boolean = false
    /** 当前拖拽悬停的元素链（用于 dragenter/leave/over） */
    private _dragHoverEl: Element | null = null

    constructor(engine: Engine) {
        this.engine = engine
        this.inputType = 'auto'
        this.resolvedType = 'pointer'
    }

    /** 启动事件监听 */
    start(inputType: InputType = 'auto'): void {
        if (this._started) this.stop()
        this.inputType = inputType
        this.resolvedType = this._resolveType(inputType)
        const dom = this.engine.containerDom
        this._dom = dom
        this._attachListeners()
        this._started = true
    }

    /** 停止事件监听 */
    stop(): void {
        if (!this._started || !this._dom) return
        for (const name in this._handlers) {
            this._dom.removeEventListener(name, this._handlers[name])
        }
        this._handlers = {}
        this._dom = null
        this._started = false
        this._hoverEl = null
        this._pressedTarget = null
        this._dragging = false
        this._dragSource = null
        this._dragHoverEl = null
    }

    /** 切换输入模式（运行时） */
    setInputType(inputType: InputType): void {
        if (this.inputType === inputType) return
        if (this._started) {
            this.stop()
            this.start(inputType)
        } else {
            this.inputType = inputType
            this.resolvedType = this._resolveType(inputType)
        }
    }

    /** 自动解析输入类型 */
    private _resolveType(type: InputType): 'pointer' | 'mouse' | 'touch' {
        if (type === 'auto') {
            // 优先使用 PointerEvent
            if (typeof window !== 'undefined' && window.PointerEvent) {
                return 'pointer'
            }
            // 触摸设备降级到 touch
            if (typeof window !== 'undefined' && 'ontouchstart' in window) {
                return 'touch'
            }
            return 'mouse'
        }
        return type
    }

    /** 挂载 DOM 监听 */
    private _attachListeners(): void {
        const dom = this._dom!
        const type = this.resolvedType
        if (type === 'pointer') {
            this._add(dom, 'pointerdown', this._onPointerDown as EventListener)
            this._add(dom, 'pointermove', this._onPointerMove as EventListener)
            this._add(dom, 'pointerup', this._onPointerUp as EventListener)
            this._add(dom, 'pointerleave', this._onPointerLeave as EventListener)
            this._add(dom, 'pointercancel', this._onPointerUp as EventListener)
        } else if (type === 'mouse') {
            this._add(dom, 'mousedown', this._onMouseDown as EventListener)
            this._add(dom, 'mousemove', this._onMouseMove as EventListener)
            this._add(dom, 'mouseup', this._onMouseUp as EventListener)
            this._add(dom, 'mouseleave', this._onMouseLeave as EventListener)
        } else {
            // touch
            this._add(dom, 'touchstart', this._onTouchStart as EventListener)
            this._add(dom, 'touchmove', this._onTouchMove as EventListener)
            this._add(dom, 'touchend', this._onTouchEnd as EventListener)
            this._add(dom, 'touchcancel', this._onTouchEnd as EventListener)
        }
    }

    private _add(dom: HTMLElement, name: string, handler: EventListener): void {
        dom.addEventListener(name, handler, { passive: false })
        this._handlers[name] = handler
    }

    // ============ PointerEvent ============

    private _onPointerDown = (e: PointerEvent): void => {
        this._dispatchPointer(e, 'pointerdown', e.button, e.pointerId, false)
    }

    private _onPointerMove = (e: PointerEvent): void => {
        this._dispatchPointer(e, 'pointermove', 0, e.pointerId, false)
    }

    private _onPointerUp = (e: PointerEvent): void => {
        this._dispatchPointer(e, 'pointerup', e.button, e.pointerId, false)
    }

    private _onPointerLeave = (e: PointerEvent): void => {
        // 整个 dom 离开，清空 hover
        this._clearHover(e)
    }

    // ============ MouseEvent ============

    private _onMouseDown = (e: MouseEvent): void => {
        this._dispatchPointer(e, 'pointerdown', e.button, 1, false)
    }

    private _onMouseMove = (e: MouseEvent): void => {
        this._dispatchPointer(e, 'pointermove', 0, 1, false)
    }

    private _onMouseUp = (e: MouseEvent): void => {
        this._dispatchPointer(e, 'pointerup', e.button, 1, false)
    }

    private _onMouseLeave = (e: MouseEvent): void => {
        this._clearHover(e)
    }

    // ============ TouchEvent ============

    private _onTouchStart = (e: TouchEvent): void => {
        if (e.touches.length === 0) return
        const t = e.touches[0]
        this._dispatchPointer(e, 'pointerdown', 0, t.identifier, true, t.clientX, t.clientY)
    }

    private _onTouchMove = (e: TouchEvent): void => {
        if (e.touches.length === 0) return
        const t = e.touches[0]
        this._dispatchPointer(e, 'pointermove', 0, t.identifier, true, t.clientX, t.clientY)
    }

    private _onTouchEnd = (e: TouchEvent): void => {
        const t = e.changedTouches[0]
        if (!t) return
        this._dispatchPointer(e, 'pointerup', 0, t.identifier, true, t.clientX, t.clientY)
    }

    // ============ 核心派发 ============

    /**
     * 统一事件派发入口
     * @param native 原生事件
     * @param eventName 派发到 Element 的事件名
     * @param button 鼠标按钮
     * @param pointerId 指针/触摸 ID
     * @param isTouch 是否触摸来源
     * @param clientX 屏幕坐标 X（touch 事件需手动传入，因为 e.clientX 是 undefined）
     * @param clientY 屏幕坐标 Y
     */
    private _dispatchPointer(
        native: Event,
        eventName: PointerEventName,
        button: number,
        pointerId: number,
        isTouch: boolean,
        clientX?: number,
        clientY?: number
    ): void {
        const dom = this._dom
        if (!dom) return
        const cx = clientX !== undefined ? clientX : (native as MouseEvent).clientX
        const cy = clientY !== undefined ? clientY : (native as MouseEvent).clientY
        // 相对 canvas 的局部坐标
        const rect = dom.getBoundingClientRect()
        const sx = cx - rect.left
        const sy = cy - rect.top
        // 转换为世界坐标
        const viewport: Viewport = this.engine.renderer.viewport
        const world = viewport.screenToWorld({ x: sx, y: sy })
        const worldX = world.x
        const worldY = world.y

        // 计算 deltaX/Y（move 事件）
        let deltaX = 0
        let deltaY = 0
        if (eventName === 'pointermove') {
            deltaX = sx - this._lastMoveX
            deltaY = sy - this._lastMoveY
        }
        this._lastMoveX = sx
        this._lastMoveY = sy

        const data: PointerEventData = {
            screenX: sx,
            screenY: sy,
            worldX,
            worldY,
            button,
            pointerId,
            isTouch,
            ctrlKey: (native as MouseEvent).ctrlKey || false,
            shiftKey: (native as MouseEvent).shiftKey || false,
            altKey: (native as MouseEvent).altKey || false,
            metaKey: (native as MouseEvent).metaKey || false,
            nativeEvent: native,
            deltaX,
            deltaY,
        }

        // 命中测试
        const scene = this.engine.scene
        const target = scene.pick(worldX, worldY)
        // 创建事件对象
        const evt = new NodeEvent<PointerEventName, PointerEventData>(eventName, data)
        evt.nativeEvent = native

        // 处理 hover 状态（pointermove 时）
        if (eventName === 'pointermove') {
            this._updateHover(target, native, sx, sy, worldX, worldY)
        }

        // 处理 drag 逻辑（在派发主事件之前，因为 drag 可能吞掉 move 事件）
        if (eventName === 'pointermove' && this._pressedTarget) {
            // 按下中移动 - 判断是否触发 drag
            if (this._handleDragMove(target, native, data)) {
                // 已被 drag 处理，不再派发 pointermove
                return
            }
        } else if (eventName === 'pointerup' && this._dragging) {
            // 拖拽中释放 - 触发 drop / dragend
            this._handleDragEnd(target, native, sx, sy, worldX, worldY)
            // 不再派发 pointerup 的常规流程（避免误触 click）
            this._pressedTarget = null
            return
        }

        // 派发主事件
        target && target.dispatchEvent(evt as any)

        // 处理 down/up → click / dblclick
        if (eventName === 'pointerdown') {
            this._pressedTarget = target
            this._pressedX = sx
            this._pressedY = sy
            // 记录 drag 起点（即使最终未触发 drag）
            this._dragStartX = sx
            this._dragStartY = sy
            this._dragStartWorldX = worldX
            this._dragStartWorldY = worldY
            this._dragSource = target
            this._dragThresholdMet = false
        } else if (eventName === 'pointerup') {
            this._tryClick(target, native, sx, sy, worldX, worldY)
        }
    }

    /**
     * 处理拖拽中的移动
     * @returns true 表示已作为 drag 处理，不再派发 pointermove
     */
    private _handleDragMove(
        target: Element,
        native: Event,
        data: PointerEventData
    ): boolean {
        const dx = data.screenX - this._dragStartX
        const dy = data.screenY - this._dragStartY
        const distSq = dx * dx + dy * dy

        // 还未达到 drag 阈值
        if (!this._dragThresholdMet) {
            if (distSq < this.dragStartThreshold * this.dragStartThreshold) {
                return false // 未达阈值，让 pointermove 正常派发
            }
            // 达到阈值，触发 dragstart
            this._dragThresholdMet = true
            this._dragging = true
            const source = this._dragSource!
            const startData: PointerEventData = {
                ...data,
                screenX: this._dragStartX,
                screenY: this._dragStartY,
                worldX: this._dragStartWorldX,
                worldY: this._dragStartWorldY,
                deltaX: 0,
                deltaY: 0,
                totalDeltaX: 0,
                totalDeltaY: 0,
            }
            this._emitNamedEventWithData(source, 'dragstart', native, startData)
            // 初始化 drag hover 元素
            this._dragHoverEl = target
            // dragenter 到首个 hover 元素
            this._emitNamedEventWithData(target, 'dragenter', native, {
                ...data,
                dragSource: this._dragSource || undefined,
            })
        }

        // 已处于拖拽中，派发 drag 事件
        const dragData: PointerEventData = {
            ...data,
            totalDeltaX: dx,
            totalDeltaY: dy,
            dragSource: this._dragSource || undefined,
        }
        this._emitNamedEventWithData(this._dragSource!, 'drag', native, dragData)

        // 派发 dragover / dragenter / dragleave 到当前命中元素
        this._updateDragHover(target, native, data)
        return true
    }

    /** 更新拖拽悬停元素，派发 dragenter/leave/over */
    private _updateDragHover(
        newHit: Element,
        native: Event,
        data: PointerEventData
    ): void {
        const oldDragHoverEl = this._dragHoverEl

        // dragover：当前命中的元素触发
        if (newHit) {
            this._emitNamedEventWithData(newHit, 'dragover', native, {
                ...data,
                dragSource: this._dragSource || undefined,
            })
        }

        // 边界变化：派发 dragleave / dragenter
        if (oldDragHoverEl !== newHit) {
            if (oldDragHoverEl) {
                this._emitNamedEventWithData(oldDragHoverEl, 'dragleave', native, {
                    ...data,
                    dragSource: this._dragSource || undefined,
                })
            }
            if (newHit) {
                this._emitNamedEventWithData(newHit, 'dragenter', native, {
                    ...data,
                    dragSource: this._dragSource || undefined,
                })
            }
            this._dragHoverEl = newHit
        }
    }

    /** 处理拖拽结束：派发 drop 到目标，dragend 到源 */
    private _handleDragEnd(
        target: Element,
        native: Event,
        sx: number, sy: number,
        worldX: number, worldY: number
    ): void {
        const source = this._dragSource
        const dx = sx - this._dragStartX
        const dy = sy - this._dragStartY

        const dropData: PointerEventData = {
            screenX: sx,
            screenY: sy,
            worldX,
            worldY,
            button: 0,
            pointerId: 1,
            isTouch: false,
            ctrlKey: (native as MouseEvent).ctrlKey || false,
            shiftKey: (native as MouseEvent).shiftKey || false,
            altKey: (native as MouseEvent).altKey || false,
            metaKey: (native as MouseEvent).metaKey || false,
            nativeEvent: native,
            totalDeltaX: dx,
            totalDeltaY: dy,
            dragSource: source || undefined,
        }

        // 派发 drop 到当前命中元素
        if (target) {
            this._emitNamedEventWithData(target, 'drop', native, dropData)
        }

        // dragleave 旧 hover 元素
        const oldHover = this._dragHoverEl
        if (oldHover && oldHover !== target) {
            this._emitNamedEventWithData(oldHover, 'dragleave', native, dropData)
        }

        // 派发 dragend 到源
        if (source) {
            this._emitNamedEventWithData(source, 'dragend', native, dropData)
        }

        // 重置 drag 状态
        this._dragging = false
        this._dragSource = null
        this._dragThresholdMet = false
        this._dragHoverEl = null
    }

    /** 更新 hover 链，派发 enter/leave/over/out */
    private _updateHover(
        newHoverEl: Element,
        native: Event,
        sx: number, sy: number,
        worldX: number, worldY: number
    ): void {
        const oldHoverEl = this._hoverEl
        // out / over：边界事件
        if (oldHoverEl !== newHoverEl) {
            if (oldHoverEl) {
                this._emitNamedEvent(oldHoverEl, 'pointerleave', native, sx, sy, worldX, worldY)
            }
            if (newHoverEl) {
                this._emitNamedEvent(newHoverEl, 'pointerenter', native, sx, sy, worldX, worldY)
            }
            this._hoverEl = newHoverEl
        }
    }

    /** 清空 hover 链 */
    private _clearHover(native: Event): void {
        const hoverEl = this._hoverEl
        hoverEl && this._emitNamedEvent(hoverEl, 'pointerleave', native, 0, 0, 0, 0)
        this._hoverEl = null
    }

    /** 派发事件到指定元素（基础坐标版本，复用减少函数数量） */
    private _emitNamedEvent(
        target: Element,
        name: PointerEventName,
        native: Event,
        sx: number, sy: number,
        worldX: number, worldY: number
    ): void {
        const data: PointerEventData = {
            screenX: sx,
            screenY: sy,
            worldX,
            worldY,
            button: 0,
            pointerId: 1,
            isTouch: false,
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            metaKey: false,
            nativeEvent: native,
        }
        const evt = new NodeEvent<PointerEventName, PointerEventData>(name, data)
        evt.nativeEvent = native
        target.dispatchEvent(evt as any)
    }

    /** 派发事件到指定元素（完整 data 版本，用于 drag 系列） */
    private _emitNamedEventWithData(
        target: Element,
        name: PointerEventName,
        native: Event,
        data: PointerEventData
    ): void {
        const evt = new NodeEvent<PointerEventName, PointerEventData>(name, data)
        evt.nativeEvent = native
        target.dispatchEvent(evt as any)
    }

    /** click 判定：同一目标 + 移动距离小于阈值 */
    private _tryClick(
        target: Element,
        native: Event,
        sx: number, sy: number,
        worldX: number, worldY: number
    ): void {
        const pressed = this._pressedTarget
        this._pressedTarget = null
        if (!pressed) return
        // 检查目标是否同一个（或祖先关系）
        let isSameTarget = false
        let cur: Element | null = target
        while (cur) {
            if (cur === pressed) { isSameTarget = true; break }
            cur = cur.parent
        }
        if (!isSameTarget) return
        // 检查移动距离
        const dx = sx - this._pressedX
        const dy = sy - this._pressedY
        if (dx * dx + dy * dy > this.clickMoveThreshold * this.clickMoveThreshold) return

        // 派发 click
        this._emitNamedEvent(pressed, 'click', native, sx, sy, worldX, worldY)

        // 双击判定
        const now = performance.now()
        if (
            this._lastClickTarget === pressed &&
            now - this._lastClickTime <= this.dblClickInterval
        ) {
            this._emitNamedEvent(pressed, 'dblclick', native, sx, sy, worldX, worldY)
            this._lastClickTarget = null
        } else {
            this._lastClickTime = now
            this._lastClickTarget = pressed
        }
    }
}
