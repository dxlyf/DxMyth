import {NodeEvent} from './EventTarget'
import {EventEmitter} from './EventEmitter'
import {Point} from '../math/Point'
import { CachePool } from '../math/CachePool'

export class PointerEvent<T = string, D = any> extends NodeEvent<T, D> {
    static pool=CachePool.create({
        initSize:20,
        create:()=>new PointerEvent('',{}),
        init(item){
            item.reset()
        }
    })
    downPoint:Point= Point.default() // 按下时的坐标
    point:Point= Point.default() // 当前事件坐标
    offsetPoint:Point= Point.default() // 距离按下时的偏移量
    deltaPoint:Point= Point.default() // 上次事件的偏移量
    constructor(type:T, data:D){
        super(type,data)
    }
    reset(){
        this.downPoint.set(0,0)
        this.point.set(0,0)
        this.offsetPoint.set(0,0)
        this.deltaPoint.set(0,0)
        this.data={} as D
        this.defaultPrevented=false
        this.cancelBubble=false
        this.immediateCancelBubble=false
        this.delegateType=''
        this.target=null
        this.currentTarget=null
        this.nativeEvent=null
    
    }

    copy(target:PointerEvent<any,any>){
        this.type=target.type
        this.data=target.data
        this.nativeEvent=target.nativeEvent
        this.target=target.target
        this.currentTarget=target.currentTarget
        this.delegateType=target.delegateType
        this.cancelBubble=target.cancelBubble
        this.immediateCancelBubble=target.immediateCancelBubble
        this.defaultPrevented=target.defaultPrevented
        this.downPoint.copy(target.downPoint)
        this.point.copy(target.point)
        this.offsetPoint.copy(target.offsetPoint)
        this.deltaPoint.copy(target.deltaPoint)
    }
    copyPointerData(target:PointerEvent<any,any>){
        this.data=target.data
        this.downPoint.copy(target.downPoint)
        this.point.copy(target.point)
        this.offsetPoint.copy(target.offsetPoint)
        this.deltaPoint.copy(target.deltaPoint)
    }
    clone(){
        const e = PointerEvent.pool.get()
        e.copy(this)
        return e
    }
}
export type PointerEventSystemOptions={
    target:HTMLElement
    screenToWorld:(out:Point,x:number,y:number,element:HTMLElement)=>Point
    hitTest:(e:PointerEvent)=>any|null
    /** 拖拽触发阈值（像素），移动超过此距离才触发 dragstart，默认 4 */
    dragThreshold?:number
    /** 双击间隔（毫秒），两次 click 在此间隔内触发 dblclick，默认 300 */
    dblclickInterval?:number
    /** 自定义需要绑定的原生事件映射，key 为内部事件名，value 为原生 DOM 事件类型 */
    pointerEvents?:Record<string,string>
}
const POINTER_EVENTS={
    pointerdown:'pointerdown',
    pointermove:'pointermove',
    pointerup:'pointerup',
    pointerleave:'pointerleave',
    pointerenter:'pointerenter',
    wheel:'wheel',
}
export type PointerEventsMaps={
    pointerdown:[e:PointerEvent]
    pointermove:[e:PointerEvent]
    pointerup:[e:PointerEvent]
    pointerleave:[e:PointerEvent]
    pointerenter:[e:PointerEvent]
    wheel:[e:PointerEvent]
    click:[e:PointerEvent]
    dblclick:[e:PointerEvent]
    dragstart:[e:PointerEvent]
    drag:[e:PointerEvent]
    dragend:[e:PointerEvent]
    dragenter:[e:PointerEvent]
    dragleave:[e:PointerEvent]
    dragover:[e:PointerEvent]
    drop:[e:PointerEvent]
}
export class PointerEventSystem extends EventEmitter<PointerEventsMaps> {
    options: PointerEventSystemOptions
    handlers: Map<string, any> = new Map()

    // 阈值缓存（平方距离）
    private _dragThresholdSq: number
    private _dblclickInterval: number

    // 状态
    public _lastPoint = Point.create()
    public _downPoint = Point.create()
    public _isPointerDown = false
    public _isDragging = false
    private _lastClickTime = 0
    private _lastClickPoint = Point.create()

    // hitTest 追踪
    public _hoverTarget: any = null     // 当前悬停的元素
    public _downTarget: any = null      // pointerdown 时的命中元素
    public _dragHoverTarget: any = null // 拖拽时当前悬停的元素

    constructor(options: PointerEventSystemOptions) {
        super()
        this.options = options
        this.onPointerEvent = this.onPointerEvent.bind(this)

        const dragThreshold = options.dragThreshold ?? 4
        this._dragThresholdSq = dragThreshold * dragThreshold
        this._dblclickInterval = options.dblclickInterval ?? 300
    }

    private _getPointerEvents(): Record<string, string> {
        return this.options.pointerEvents ?? POINTER_EVENTS
    }

    attachEvents() {
        const events = this._getPointerEvents()
        for (const [name, type] of Object.entries(events)) {
            const handler = this.onPointerEvent.bind(this, name)
            this.options.target.addEventListener(type as any, handler, false)
            this.handlers.set(name, handler)
        }
    }

    detachEvents() {
        const events = this._getPointerEvents()
        for (const [name, type] of Object.entries(events)) {
            const handler = this.handlers.get(name)
            if (!handler) continue
            this.options.target.removeEventListener(type, handler, false)
        }
        this.handlers.clear()
    }

    createEvent(type: string, nativeEvent: any): PointerEvent {
        const e = PointerEvent.pool.get()
        e.type = type
        e.data = {} as any
        e.nativeEvent = nativeEvent
        return e
    }

    onPointerEvent(eventType: string, e: globalThis.PointerEvent) {
        const spawned: PointerEvent[] = [] // 记录所有 createEvent 创建的事件

        const event = this.createEvent(eventType, e)
        spawned.push(event)

        const x = e.clientX
        const y = e.clientY
        const point = event.point
        this.options.screenToWorld(point, x, y, this.options.target)

        // deltaPoint：本次与上次坐标的差值
        event.deltaPoint.set(point.x - this._lastPoint.x, point.y - this._lastPoint.y)
        this._lastPoint.copy(point)

        // offsetPoint：距离按下时的偏移量
        if (this._isPointerDown) {
            event.offsetPoint.set(point.x - this._downPoint.x, point.y - this._downPoint.y)
        }
        event.downPoint.copy(this._downPoint)

        // hitTest 确定目标元素
        const hitTarget = this.options.hitTest(event)
        event.target = hitTarget

        switch (eventType) {
            case 'pointerdown': {
                this._isPointerDown = true
                this._isDragging = false
                this._downPoint.copy(point)
                this._downTarget = hitTarget
                event.downPoint.copy(point)
                event.offsetPoint.set(0, 0)

                // 捕获指针，确保移出元素后仍能接收 pointermove
                try { this.options.target.setPointerCapture(e.pointerId) } catch {}

                // 首次进入元素
                if (hitTarget && hitTarget !== this._hoverTarget) {
                    if (this._hoverTarget) {
                        const leaveEvt = this.createEvent('pointerleave', e)
                        spawned.push(leaveEvt)
                        leaveEvt.copyPointerData(event)
                        leaveEvt.target = this._hoverTarget
                        this.emit('pointerleave', leaveEvt)
                    }
                    this._hoverTarget = hitTarget
                    event.type = 'pointerenter'
                    this.emit('pointerenter', event)
                }

                event.type = 'pointerdown'
                this.emit('pointerdown', event)
                break
            }
            case 'pointermove': {
                // enter / leave 检测（基于 hitTest）
                if (hitTarget !== this._hoverTarget) {
                    if (this._hoverTarget) {
                        const leaveEvt = this.createEvent('pointerleave', e)
                        spawned.push(leaveEvt)
                        leaveEvt.copyPointerData(event)
                        leaveEvt.target = this._hoverTarget
                        this.emit('pointerleave', leaveEvt)
                    }
                    if (hitTarget) {
                        this._hoverTarget = hitTarget
                        event.type = 'pointerenter'
                        this.emit('pointerenter', event)
                    } else {
                        this._hoverTarget = null
                    }
                }

                event.type = 'pointermove'
                this.emit('pointermove', event)

                // 拖拽模拟
                if (this._isPointerDown) {
                    if (!this._isDragging) {
                        const dx = point.x - this._downPoint.x
                        const dy = point.y - this._downPoint.y
                        if (dx * dx + dy * dy >= this._dragThresholdSq) {
                            this._isDragging = true
                            this._dragHoverTarget = this._downTarget
                            const dsEvt = this.createEvent('dragstart', e)
                            spawned.push(dsEvt)
                            dsEvt.copyPointerData(event)
                            dsEvt.target = this._downTarget
                            this.emit('dragstart', dsEvt)
                        }
                    }
                    if (this._isDragging) {

                        const dragEvt = this.createEvent('drag', e)
                        spawned.push(dragEvt)
                        dragEvt.copyPointerData(event)
                        dragEvt.target = this._downTarget
                        this.emit('drag', dragEvt)

                        // dragenter / dragleave / dragover 检测
                        if (hitTarget !== this._dragHoverTarget) {
                            if (this._dragHoverTarget) {
                                const dlEvt = this.createEvent('dragleave', e)
                                spawned.push(dlEvt)
                                dlEvt.copyPointerData(event)
                                dlEvt.target = this._dragHoverTarget
                                this.emit('dragleave', dlEvt)
                            }
                            if (hitTarget) {
                                const deEvt = this.createEvent('dragenter', e)
                                spawned.push(deEvt)
                                deEvt.copyPointerData(event)
                                deEvt.target = hitTarget
                                this.emit('dragenter', deEvt)

                                const doEvt = this.createEvent('dragover', e)
                                spawned.push(doEvt)
                                doEvt.copyPointerData(event)
                                doEvt.target = hitTarget
                                this.emit('dragover', doEvt)
                            }
                            this._dragHoverTarget = hitTarget
                        }
                    }
                }
                break
            }
            case 'pointerup': {
                event.type = 'pointerup'
                this.emit('pointerup', event)

                if (this._isDragging) {
                    // drop：在拖拽释放时，目标元素触发 drop
                    if (hitTarget && hitTarget !== this._downTarget) {
                        const dropEvt = this.createEvent('drop', e)
                        spawned.push(dropEvt)
                        dropEvt.copyPointerData(event)
                        dropEvt.target = hitTarget
                        this.emit('drop', dropEvt)
                    }
                    if (this._dragHoverTarget) {
                        const dlEvt = this.createEvent('dragleave', e)
                        spawned.push(dlEvt)
                        dlEvt.copyPointerData(event)
                        dlEvt.target = this._dragHoverTarget
                        this.emit('dragleave', dlEvt)
                        this._dragHoverTarget = null
                    }
                    this._isDragging = false
                    const deEvt = this.createEvent('dragend', e)
                    spawned.push(deEvt)
                    deEvt.copyPointerData(event)
                    deEvt.target = this._downTarget
                    this.emit('dragend', deEvt)
                }

                // click / dblclick 模拟
                if (this._isPointerDown) {
                    const dx = point.x - this._downPoint.x
                    const dy = point.y - this._downPoint.y
                    if (dx * dx + dy * dy < this._dragThresholdSq) {
                        event.type = 'click'
                        this.emit('click', event)
                        const now = Date.now()
                        const cdx = point.x - this._lastClickPoint.x
                        const cdy = point.y - this._lastClickPoint.y
                        if (now - this._lastClickTime < this._dblclickInterval &&
                            cdx * cdx + cdy * cdy < this._dragThresholdSq) {
                            event.type = 'dblclick'
                            this.emit('dblclick', event)
                            this._lastClickTime = 0
                        } else {
                            this._lastClickTime = now
                            this._lastClickPoint.copy(point)
                        }
                    }
                }

                this._isPointerDown = false
                this._downTarget = null

                // 释放指针捕获     // 浏览器自动调用 releasePointerCapture
                //try { this.options.target.releasePointerCapture(e.pointerId) } catch {}
                break
            }
            case 'pointerleave': {
                // 离开 canvas 区域，触发悬停元素的 leave
                if (this._hoverTarget) {
                    const leaveEvt = this.createEvent('pointerleave', e)
                    spawned.push(leaveEvt)
                    leaveEvt.copyPointerData(event)
                    leaveEvt.target = this._hoverTarget
                    this.emit('pointerleave', leaveEvt)
                    this._hoverTarget = null
                }
                // 如果正在拖拽，也触发 dragleave
                if (this._isDragging && this._dragHoverTarget) {
                    const dlEvt = this.createEvent('dragleave', e)
                    spawned.push(dlEvt)
                    dlEvt.copyPointerData(event)
                    dlEvt.target = this._dragHoverTarget
                    this.emit('dragleave', dlEvt)
                    this._dragHoverTarget = null
                }
                break
            }
            case 'pointerenter': {
                // 进入 canvas 区域，通过 hitTest 确定 enter 目标
                if (hitTarget && hitTarget !== this._hoverTarget) {
                    this._hoverTarget = hitTarget
                    event.type = 'pointerenter'
                    this.emit('pointerenter', event)
                }
                break
            }
            case 'wheel': {
                event.type = 'wheel'
                this.emit('wheel', event)
                break
            }
        }

        // 释放所有事件回 pool
        for (const ev of spawned) {
            PointerEvent.pool.release(ev)
        }
    }
}