import { NodeEvent } from "./EventTarget.js";
import { EventEmitter } from "./EventEmitter.js";
import { Point } from "../math/Point.js";
import { CachePool } from "../math/CachePool.js";
class PointerEvent extends NodeEvent {
  static pool = CachePool.create({
    initSize: 20,
    create: () => new PointerEvent("", {}),
    init(item) {
      item.reset();
    }
  });
  downPoint = Point.default();
  // 按下时的坐标
  point = Point.default();
  // 当前事件坐标
  offsetPoint = Point.default();
  // 距离按下时的偏移量
  deltaPoint = Point.default();
  // 上次事件的偏移量
  constructor(type, data) {
    super(type, data);
  }
  reset() {
    this.downPoint.set(0, 0);
    this.point.set(0, 0);
    this.offsetPoint.set(0, 0);
    this.deltaPoint.set(0, 0);
    this.data = {};
    this.defaultPrevented = false;
    this.cancelBubble = false;
    this.immediateCancelBubble = false;
    this.delegateType = "";
    this.target = null;
    this.currentTarget = null;
    this.nativeEvent = null;
  }
  copy(target) {
    this.type = target.type;
    this.data = target.data;
    this.nativeEvent = target.nativeEvent;
    this.target = target.target;
    this.currentTarget = target.currentTarget;
    this.delegateType = target.delegateType;
    this.cancelBubble = target.cancelBubble;
    this.immediateCancelBubble = target.immediateCancelBubble;
    this.defaultPrevented = target.defaultPrevented;
    this.downPoint.copy(target.downPoint);
    this.point.copy(target.point);
    this.offsetPoint.copy(target.offsetPoint);
    this.deltaPoint.copy(target.deltaPoint);
  }
  copyPointerData(target) {
    this.data = target.data;
    this.downPoint.copy(target.downPoint);
    this.point.copy(target.point);
    this.offsetPoint.copy(target.offsetPoint);
    this.deltaPoint.copy(target.deltaPoint);
  }
  clone() {
    const e = PointerEvent.pool.get();
    e.copy(this);
    return e;
  }
}
const POINTER_EVENTS = {
  pointerdown: "pointerdown",
  pointermove: "pointermove",
  pointerup: "pointerup",
  pointerleave: "pointerleave",
  pointerenter: "pointerenter",
  pointercancel: "pointercancel",
  wheel: "wheel"
};
class PointerEventSystem extends EventEmitter {
  options;
  handlers = /* @__PURE__ */ new Map();
  // 阈值缓存（平方距离）
  _dragThresholdSq;
  _dblclickInterval;
  // 状态
  _lastPoint = Point.create();
  _downPoint = Point.create();
  _isPointerDown = false;
  _isDragging = false;
  _lastClickTime = 0;
  _lastClickPoint = Point.create();
  // hitTest 追踪
  _hoverTarget = null;
  // 当前悬停的元素
  _downTarget = null;
  // pointerdown 时的命中元素
  _dragHoverTarget = null;
  // 拖拽时当前悬停的元素
  constructor(options) {
    super();
    this.options = options;
    this.onPointerEvent = this.onPointerEvent.bind(this);
    const dragThreshold = options.dragThreshold ?? 4;
    this._dragThresholdSq = dragThreshold * dragThreshold;
    this._dblclickInterval = options.dblclickInterval ?? 300;
  }
  _getPointerEvents() {
    return this.options.pointerEvents ?? POINTER_EVENTS;
  }
  attachEvents() {
    const events = this._getPointerEvents();
    for (const [name, type] of Object.entries(events)) {
      const handler = this.onPointerEvent.bind(this, name);
      this.options.target.addEventListener(type, handler, false);
      this.handlers.set(name, handler);
    }
  }
  detachEvents() {
    const events = this._getPointerEvents();
    for (const [name, type] of Object.entries(events)) {
      const handler = this.handlers.get(name);
      if (!handler) continue;
      this.options.target.removeEventListener(type, handler, false);
    }
    this.handlers.clear();
  }
  createEvent(type, nativeEvent) {
    const e = PointerEvent.pool.get();
    e.type = type;
    e.data = {};
    e.nativeEvent = nativeEvent;
    return e;
  }
  onPointerEvent(eventType, e) {
    const spawned = [];
    const event = this.createEvent(eventType, e);
    spawned.push(event);
    const x = e.clientX;
    const y = e.clientY;
    const point = event.point;
    this.options.screenToWorld(point, x, y, this.options.target);
    event.deltaPoint.set(point.x - this._lastPoint.x, point.y - this._lastPoint.y);
    this._lastPoint.copy(point);
    if (this._isPointerDown) {
      event.offsetPoint.set(point.x - this._downPoint.x, point.y - this._downPoint.y);
    }
    event.downPoint.copy(this._downPoint);
    const hitTarget = this.options.hitTest(event);
    event.target = hitTarget;
    switch (eventType) {
      case "pointerdown": {
        this._isPointerDown = true;
        this._isDragging = false;
        this._downPoint.copy(point);
        this._downTarget = hitTarget;
        event.downPoint.copy(point);
        event.offsetPoint.set(0, 0);
        try {
          this.options.target.setPointerCapture(e.pointerId);
        } catch {
        }
        if (hitTarget && hitTarget !== this._hoverTarget) {
          if (this._hoverTarget) {
            const leaveEvt = this.createEvent("pointerleave", e);
            spawned.push(leaveEvt);
            leaveEvt.copyPointerData(event);
            leaveEvt.target = this._hoverTarget;
            this.emit("pointerleave", leaveEvt);
          }
          this._hoverTarget = hitTarget;
          event.type = "pointerenter";
          this.emit("pointerenter", event);
        }
        event.type = "pointerdown";
        this.emit("pointerdown", event);
        break;
      }
      case "pointermove": {
        if (hitTarget !== this._hoverTarget) {
          if (this._hoverTarget) {
            const leaveEvt = this.createEvent("pointerleave", e);
            spawned.push(leaveEvt);
            leaveEvt.copyPointerData(event);
            leaveEvt.target = this._hoverTarget;
            this.emit("pointerleave", leaveEvt);
          }
          if (hitTarget) {
            this._hoverTarget = hitTarget;
            event.type = "pointerenter";
            this.emit("pointerenter", event);
          } else {
            this._hoverTarget = null;
          }
        }
        event.type = "pointermove";
        this.emit("pointermove", event);
        if (this._isPointerDown) {
          if (!this._isDragging) {
            const dx = point.x - this._downPoint.x;
            const dy = point.y - this._downPoint.y;
            if (dx * dx + dy * dy >= this._dragThresholdSq) {
              this._isDragging = true;
              this._dragHoverTarget = this._downTarget;
              const dsEvt = this.createEvent("dragstart", e);
              spawned.push(dsEvt);
              dsEvt.copyPointerData(event);
              dsEvt.target = this._downTarget;
              this.emit("dragstart", dsEvt);
            }
          }
          if (this._isDragging) {
            const dragEvt = this.createEvent("drag", e);
            spawned.push(dragEvt);
            dragEvt.copyPointerData(event);
            dragEvt.target = this._downTarget;
            this.emit("drag", dragEvt);
            if (hitTarget !== this._dragHoverTarget) {
              if (this._dragHoverTarget) {
                const dlEvt = this.createEvent("dragleave", e);
                spawned.push(dlEvt);
                dlEvt.copyPointerData(event);
                dlEvt.target = this._dragHoverTarget;
                this.emit("dragleave", dlEvt);
              }
              if (hitTarget) {
                const deEvt = this.createEvent("dragenter", e);
                spawned.push(deEvt);
                deEvt.copyPointerData(event);
                deEvt.target = hitTarget;
                this.emit("dragenter", deEvt);
                const doEvt = this.createEvent("dragover", e);
                spawned.push(doEvt);
                doEvt.copyPointerData(event);
                doEvt.target = hitTarget;
                this.emit("dragover", doEvt);
              }
              this._dragHoverTarget = hitTarget;
            }
          }
        }
        break;
      }
      case "pointercancel":
      case "pointerup": {
        event.type = "pointerup";
        this.emit("pointerup", event);
        if (this._isDragging) {
          if (hitTarget && hitTarget !== this._downTarget) {
            const dropEvt = this.createEvent("drop", e);
            spawned.push(dropEvt);
            dropEvt.copyPointerData(event);
            dropEvt.target = hitTarget;
            this.emit("drop", dropEvt);
          }
          if (this._dragHoverTarget) {
            const dlEvt = this.createEvent("dragleave", e);
            spawned.push(dlEvt);
            dlEvt.copyPointerData(event);
            dlEvt.target = this._dragHoverTarget;
            this.emit("dragleave", dlEvt);
            this._dragHoverTarget = null;
          }
          this._isDragging = false;
          const deEvt = this.createEvent("dragend", e);
          spawned.push(deEvt);
          deEvt.copyPointerData(event);
          deEvt.target = this._downTarget;
          this.emit("dragend", deEvt);
        }
        if (this._isPointerDown) {
          const dx = point.x - this._downPoint.x;
          const dy = point.y - this._downPoint.y;
          if (dx * dx + dy * dy < this._dragThresholdSq) {
            event.type = "click";
            this.emit("click", event);
            const now = Date.now();
            const cdx = point.x - this._lastClickPoint.x;
            const cdy = point.y - this._lastClickPoint.y;
            if (now - this._lastClickTime < this._dblclickInterval && cdx * cdx + cdy * cdy < this._dragThresholdSq) {
              event.type = "dblclick";
              this.emit("dblclick", event);
              this._lastClickTime = 0;
            } else {
              this._lastClickTime = now;
              this._lastClickPoint.copy(point);
            }
          }
        }
        this._isPointerDown = false;
        this._downTarget = null;
        break;
      }
      case "pointercancel_disable": {
        const cancelTarget = hitTarget || this._downTarget;
        event.target = cancelTarget;
        event.type = "pointercancel";
        this.emit("pointercancel", event);
        if (this._isPointerDown) {
          if (this._isDragging) {
            if (this._dragHoverTarget) {
              const dlEvt = this.createEvent("dragleave", e);
              spawned.push(dlEvt);
              dlEvt.copyPointerData(event);
              dlEvt.target = this._dragHoverTarget;
              this.emit("dragleave", dlEvt);
              this._dragHoverTarget = null;
            }
            this._isDragging = false;
            const deEvt = this.createEvent("dragend", e);
            spawned.push(deEvt);
            deEvt.copyPointerData(event);
            deEvt.target = this._downTarget;
            this.emit("dragend", deEvt);
          }
          this._isPointerDown = false;
          this._downTarget = null;
        }
        break;
      }
      case "pointerleave": {
        if (this._hoverTarget) {
          const leaveEvt = this.createEvent("pointerleave", e);
          spawned.push(leaveEvt);
          leaveEvt.copyPointerData(event);
          leaveEvt.target = this._hoverTarget;
          this.emit("pointerleave", leaveEvt);
          this._hoverTarget = null;
        }
        if (this._isDragging && this._dragHoverTarget) {
          const dlEvt = this.createEvent("dragleave", e);
          spawned.push(dlEvt);
          dlEvt.copyPointerData(event);
          dlEvt.target = this._dragHoverTarget;
          this.emit("dragleave", dlEvt);
          this._dragHoverTarget = null;
        }
        break;
      }
      case "pointerenter": {
        if (hitTarget && hitTarget !== this._hoverTarget) {
          this._hoverTarget = hitTarget;
          event.type = "pointerenter";
          this.emit("pointerenter", event);
        }
        break;
      }
      case "wheel": {
        event.type = "wheel";
        this.emit("wheel", event);
        break;
      }
    }
    for (const ev of spawned) {
      PointerEvent.pool.release(ev);
    }
  }
}
export {
  PointerEvent,
  PointerEventSystem
};
