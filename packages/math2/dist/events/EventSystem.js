import { NodeEvent } from "./EventTarget.js";
class EventSystem {
  options;
  /** 当前输入模式 */
  inputType;
  /** 实际生效的输入类型（auto 解析后） */
  resolvedType;
  /** 是否已经启动监听 */
  _started = false;
  /** DOM 监听目标 */
  _dom = null;
  /** 绑定的 DOM 事件处理函数引用（用于解绑） */
  _handlers = {};
  /** 当前 hover 的元素链（从目标到根） */
  _hoverEl;
  /** 当前按下的元素（用于 click 判定） */
  _pressedTarget = null;
  /** 按下时的坐标（用于 click 移动阈值） */
  _pressedX = 0;
  _pressedY = 0;
  /** 双击间隔阈值（毫秒） */
  dblClickInterval = 300;
  /** click 移动阈值（像素） */
  clickMoveThreshold = 5;
  /** drag 触发阈值（像素，按下后移动超过此距离才触发 dragstart） */
  dragStartThreshold = 4;
  /** 上次 click 时间 */
  _lastClickTime = 0;
  /** 上次 click 目标 */
  _lastClickTarget = null;
  /** 上次 pointermove 的屏幕坐标（用于计算 deltaX/deltaY） */
  _lastMoveX = 0;
  _lastMoveY = 0;
  // ============ Drag 状态 ============
  /** 当前是否处于拖拽中 */
  _dragging = false;
  /** 拖拽源元素 */
  _dragSource = null;
  /** 拖拽按下时的屏幕坐标 */
  _dragStartX = 0;
  _dragStartY = 0;
  /** 拖拽按下时的世界坐标 */
  _dragStartWorldX = 0;
  _dragStartWorldY = 0;
  /** 按下时是否已移动超过阈值（用于决定是否触发 dragstart） */
  _dragThresholdMet = false;
  /** 当前拖拽悬停的元素链（用于 dragenter/leave/over） */
  _dragHoverEl = null;
  constructor(options) {
    this.options = options;
    this.inputType = "auto";
    this.resolvedType = "pointer";
  }
  /** 启动事件监听 */
  start(inputType = "auto") {
    if (this._started) this.stop();
    this.inputType = inputType;
    this.resolvedType = this._resolveType(inputType);
    const dom = this.options.domEventTarget;
    this._dom = dom;
    this._attachListeners();
    this._started = true;
  }
  /** 停止事件监听 */
  stop() {
    if (!this._started || !this._dom) return;
    for (const name in this._handlers) {
      this._dom.removeEventListener(name, this._handlers[name]);
    }
    this._handlers = {};
    this._dom = null;
    this._started = false;
    this._hoverEl = null;
    this._pressedTarget = null;
    this._dragging = false;
    this._dragSource = null;
    this._dragHoverEl = null;
  }
  /** 切换输入模式（运行时） */
  setInputType(inputType) {
    if (this.inputType === inputType) return;
    if (this._started) {
      this.stop();
      this.start(inputType);
    } else {
      this.inputType = inputType;
      this.resolvedType = this._resolveType(inputType);
    }
  }
  /** 自动解析输入类型 */
  _resolveType(type) {
    if (type === "auto") {
      if (typeof window !== "undefined" && window.PointerEvent) {
        return "pointer";
      }
      if (typeof window !== "undefined" && "ontouchstart" in window) {
        return "touch";
      }
      return "mouse";
    }
    return type;
  }
  /** 挂载 DOM 监听 */
  _attachListeners() {
    const dom = this._dom;
    const type = this.resolvedType;
    if (type === "pointer") {
      this._add(dom, "pointerdown", this._onPointerDown);
      this._add(dom, "pointermove", this._onPointerMove);
      this._add(dom, "pointerup", this._onPointerUp);
      this._add(dom, "pointerleave", this._onPointerLeave);
      this._add(dom, "pointercancel", this._onPointerUp);
    } else if (type === "mouse") {
      this._add(dom, "mousedown", this._onMouseDown);
      this._add(dom, "mousemove", this._onMouseMove);
      this._add(dom, "mouseup", this._onMouseUp);
      this._add(dom, "mouseleave", this._onMouseLeave);
    } else {
      this._add(dom, "touchstart", this._onTouchStart);
      this._add(dom, "touchmove", this._onTouchMove);
      this._add(dom, "touchend", this._onTouchEnd);
      this._add(dom, "touchcancel", this._onTouchEnd);
    }
  }
  _add(dom, name, handler) {
    dom.addEventListener(name, handler, { passive: false });
    this._handlers[name] = handler;
  }
  // ============ PointerEvent ============
  _onPointerDown = (e) => {
    this._dispatchPointer(e, "pointerdown", e.button, e.pointerId, false);
  };
  _onPointerMove = (e) => {
    this._dispatchPointer(e, "pointermove", 0, e.pointerId, false);
  };
  _onPointerUp = (e) => {
    this._dispatchPointer(e, "pointerup", e.button, e.pointerId, false);
  };
  _onPointerLeave = (e) => {
    this._clearHover(e);
  };
  // ============ MouseEvent ============
  _onMouseDown = (e) => {
    this._dispatchPointer(e, "pointerdown", e.button, 1, false);
  };
  _onMouseMove = (e) => {
    this._dispatchPointer(e, "pointermove", 0, 1, false);
  };
  _onMouseUp = (e) => {
    this._dispatchPointer(e, "pointerup", e.button, 1, false);
  };
  _onMouseLeave = (e) => {
    this._clearHover(e);
  };
  // ============ TouchEvent ============
  _onTouchStart = (e) => {
    if (e.touches.length === 0) return;
    const t = e.touches[0];
    this._dispatchPointer(e, "pointerdown", 0, t.identifier, true, t.clientX, t.clientY);
  };
  _onTouchMove = (e) => {
    if (e.touches.length === 0) return;
    const t = e.touches[0];
    this._dispatchPointer(e, "pointermove", 0, t.identifier, true, t.clientX, t.clientY);
  };
  _onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    if (!t) return;
    this._dispatchPointer(e, "pointerup", 0, t.identifier, true, t.clientX, t.clientY);
  };
  // ============ 核心派发 ============
  /**
   * 统一事件派发入口
   * @param native 原生事件
   * @param eventName 派发到 EventTarget 的事件名
   * @param button 鼠标按钮
   * @param pointerId 指针/触摸 ID
   * @param isTouch 是否触摸来源
   * @param clientX 屏幕坐标 X（touch 事件需手动传入，因为 e.clientX 是 undefined）
   * @param clientY 屏幕坐标 Y
   */
  _dispatchPointer(native, eventName, button, pointerId, isTouch, clientX, clientY) {
    const dom = this._dom;
    if (!dom) return;
    const cx = clientX !== void 0 ? clientX : native.clientX;
    const cy = clientY !== void 0 ? clientY : native.clientY;
    const rect = dom.getBoundingClientRect();
    const sx = cx - rect.left;
    const sy = cy - rect.top;
    const viewport = this.options.viewport;
    const world = viewport.screenToWorld({ x: sx, y: sy });
    const worldX = world.x;
    const worldY = world.y;
    let deltaX = 0;
    let deltaY = 0;
    if (eventName === "pointermove") {
      deltaX = sx - this._lastMoveX;
      deltaY = sy - this._lastMoveY;
    }
    this._lastMoveX = sx;
    this._lastMoveY = sy;
    const data = {
      screenX: sx,
      screenY: sy,
      worldX,
      worldY,
      button,
      pointerId,
      isTouch,
      ctrlKey: native.ctrlKey || false,
      shiftKey: native.shiftKey || false,
      altKey: native.altKey || false,
      metaKey: native.metaKey || false,
      nativeEvent: native,
      deltaX,
      deltaY
    };
    const target = this.options.pick(worldX, worldY);
    const evt = new NodeEvent(eventName, data);
    evt.nativeEvent = native;
    if (eventName === "pointermove") {
      this._updateHover(target, native, sx, sy, worldX, worldY);
    }
    if (eventName === "pointermove" && this._pressedTarget) {
      if (this._handleDragMove(target, native, data)) {
        return;
      }
    } else if (eventName === "pointerup" && this._dragging) {
      this._handleDragEnd(target, native, sx, sy, worldX, worldY);
      this._pressedTarget = null;
      return;
    }
    target && target.dispatchEvent(evt);
    if (eventName === "pointerdown") {
      this._pressedTarget = target;
      this._pressedX = sx;
      this._pressedY = sy;
      this._dragStartX = sx;
      this._dragStartY = sy;
      this._dragStartWorldX = worldX;
      this._dragStartWorldY = worldY;
      this._dragSource = target;
      this._dragThresholdMet = false;
    } else if (eventName === "pointerup") {
      this._tryClick(target, native, sx, sy, worldX, worldY);
    }
  }
  /**
   * 处理拖拽中的移动
   * @returns true 表示已作为 drag 处理，不再派发 pointermove
   */
  _handleDragMove(target, native, data) {
    const dx = data.screenX - this._dragStartX;
    const dy = data.screenY - this._dragStartY;
    const distSq = dx * dx + dy * dy;
    if (!this._dragThresholdMet) {
      if (distSq < this.dragStartThreshold * this.dragStartThreshold) {
        return false;
      }
      this._dragThresholdMet = true;
      this._dragging = true;
      const source = this._dragSource;
      const startData = {
        ...data,
        screenX: this._dragStartX,
        screenY: this._dragStartY,
        worldX: this._dragStartWorldX,
        worldY: this._dragStartWorldY,
        deltaX: 0,
        deltaY: 0,
        totalDeltaX: 0,
        totalDeltaY: 0
      };
      this._emitNamedEventWithData(source, "dragstart", native, startData);
      this._dragHoverEl = target;
      this._emitNamedEventWithData(target, "dragenter", native, {
        ...data,
        dragSource: this._dragSource || void 0
      });
    }
    const dragData = {
      ...data,
      totalDeltaX: dx,
      totalDeltaY: dy,
      dragSource: this._dragSource || void 0
    };
    this._emitNamedEventWithData(this._dragSource, "drag", native, dragData);
    this._updateDragHover(target, native, data);
    return true;
  }
  /** 更新拖拽悬停元素，派发 dragenter/leave/over */
  _updateDragHover(newHit, native, data) {
    const oldDragHoverEl = this._dragHoverEl;
    if (newHit) {
      this._emitNamedEventWithData(newHit, "dragover", native, {
        ...data,
        dragSource: this._dragSource || void 0
      });
    }
    if (oldDragHoverEl !== newHit) {
      if (oldDragHoverEl) {
        this._emitNamedEventWithData(oldDragHoverEl, "dragleave", native, {
          ...data,
          dragSource: this._dragSource || void 0
        });
      }
      if (newHit) {
        this._emitNamedEventWithData(newHit, "dragenter", native, {
          ...data,
          dragSource: this._dragSource || void 0
        });
      }
      this._dragHoverEl = newHit;
    }
  }
  /** 处理拖拽结束：派发 drop 到目标，dragend 到源 */
  _handleDragEnd(target, native, sx, sy, worldX, worldY) {
    const source = this._dragSource;
    const dx = sx - this._dragStartX;
    const dy = sy - this._dragStartY;
    const dropData = {
      screenX: sx,
      screenY: sy,
      worldX,
      worldY,
      button: 0,
      pointerId: 1,
      isTouch: false,
      ctrlKey: native.ctrlKey || false,
      shiftKey: native.shiftKey || false,
      altKey: native.altKey || false,
      metaKey: native.metaKey || false,
      nativeEvent: native,
      totalDeltaX: dx,
      totalDeltaY: dy,
      dragSource: source || void 0
    };
    if (target) {
      this._emitNamedEventWithData(target, "drop", native, dropData);
    }
    const oldHover = this._dragHoverEl;
    if (oldHover && oldHover !== target) {
      this._emitNamedEventWithData(oldHover, "dragleave", native, dropData);
    }
    if (source) {
      this._emitNamedEventWithData(source, "dragend", native, dropData);
    }
    this._dragging = false;
    this._dragSource = null;
    this._dragThresholdMet = false;
    this._dragHoverEl = null;
  }
  /** 更新 hover 链，派发 enter/leave/over/out */
  _updateHover(newHoverEl, native, sx, sy, worldX, worldY) {
    const oldHoverEl = this._hoverEl;
    if (oldHoverEl !== newHoverEl) {
      if (oldHoverEl) {
        this._emitNamedEvent(oldHoverEl, "pointerleave", native, sx, sy, worldX, worldY);
      }
      if (newHoverEl) {
        this._emitNamedEvent(newHoverEl, "pointerenter", native, sx, sy, worldX, worldY);
      }
      this._hoverEl = newHoverEl;
    }
  }
  /** 清空 hover 链 */
  _clearHover(native) {
    const hoverEl = this._hoverEl;
    hoverEl && this._emitNamedEvent(hoverEl, "pointerleave", native, 0, 0, 0, 0);
    this._hoverEl = null;
  }
  /** 派发事件到指定元素（基础坐标版本，复用减少函数数量） */
  _emitNamedEvent(target, name, native, sx, sy, worldX, worldY) {
    const data = {
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
      nativeEvent: native
    };
    const evt = new NodeEvent(name, data);
    evt.nativeEvent = native;
    target.dispatchEvent(evt);
  }
  /** 派发事件到指定元素（完整 data 版本，用于 drag 系列） */
  _emitNamedEventWithData(target, name, native, data) {
    const evt = new NodeEvent(name, data);
    evt.nativeEvent = native;
    target.dispatchEvent(evt);
  }
  /** click 判定：同一目标 + 移动距离小于阈值 */
  _tryClick(target, native, sx, sy, worldX, worldY) {
    const pressed = this._pressedTarget;
    this._pressedTarget = null;
    if (!pressed) return;
    let isSameTarget = false;
    let cur = target;
    while (cur) {
      if (cur === pressed) {
        isSameTarget = true;
        break;
      }
      cur = cur.parent;
    }
    if (!isSameTarget) return;
    const dx = sx - this._pressedX;
    const dy = sy - this._pressedY;
    if (dx * dx + dy * dy > this.clickMoveThreshold * this.clickMoveThreshold) return;
    this._emitNamedEvent(pressed, "click", native, sx, sy, worldX, worldY);
    const now = performance.now();
    if (this._lastClickTarget === pressed && now - this._lastClickTime <= this.dblClickInterval) {
      this._emitNamedEvent(pressed, "dblclick", native, sx, sy, worldX, worldY);
      this._lastClickTarget = null;
    } else {
      this._lastClickTime = now;
      this._lastClickTarget = pressed;
    }
  }
}
export {
  EventSystem
};
