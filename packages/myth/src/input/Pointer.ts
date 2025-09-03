
import { IDisplayObject } from "src/types/core/DisplayObject";
import { EventHandle, EventHandleOptions } from "./EventHandle";
import { InteractivePointerEvent } from 'src/events/InteractivePointerEvent'
import { ExtensionType } from "src/extensions";
import { IApplication } from "src/types/core/Application";

const PointerEvents = ["click", "dblclick", "pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
    "pointerenter",
    "pointerleave","contextmenu"] as const;
export type PointerEventNames = typeof PointerEvents[number]

// 拖拽状态
enum DragState {
    Idle = 0,
    DragStart = 1,
    Dragging = 2,
    DragEnd = 3
}
/** 
 * dom 鼠标指针事件处理
*/
export class PointerEventHandle extends EventHandle<PointerEventNames, PointerEvent> {
    static extension = ExtensionType.Interactive
    pointerEventHandle: PointerEventHandle
    currentPointerEvent: InteractivePointerEvent
    dragState: DragState = DragState.Idle
    hoverTarget: IDisplayObject | null = null
    dragTarget: IDisplayObject | null = null
    constructor(app: IApplication, options?: EventHandleOptions) {
        super(app, options)
        this.currentPointerEvent = new InteractivePointerEvent('')

    }
    onUpdate = () => {
        if (this.currentPointerEvent.type!=='pointermove') {
            return
        }
        const e = this.currentPointerEvent
        e.offsetPoint.subVectors(e.point, e.downPoint)
        e.deltaPoint.subVectors(e.point, e.lastPoint)
        e.lastPoint.copy(e.point)
        if(e.deltaPoint.isZero()){
            return
        }
        const target = this.findHitTarget(e.point.x, e.point.y)
        let lastHoverTarget = this.hoverTarget as IDisplayObject
        if (lastHoverTarget !== target) {
            if (lastHoverTarget) {
                e.type='pointerleave'
                lastHoverTarget.emitBubble(e)
            }
            if (target) {
                e.type='pointerenter'
                target.emitBubble(e)
            }
            this.hoverTarget = target
        }
        if(this.dragState===DragState.DragStart){
            this.dragState=DragState.Dragging
            this.dragTarget=target
            e.type='dragstart'
            this.dragTarget&&target.emitBubble(e)
            this.options.proxyHandler.emit('dragstart',e)
        }   
        if(this.dragState===DragState.Dragging){
            e.type='drag'
            this.dragTarget&& this.dragTarget.emitBubble(e)
            this.options.proxyHandler.emit('drag',e)
        }
        e.type='pointermove'
        this.options.proxyHandler.emit('pointermove',e)

        e.target=null
        e.currentTarget=null
    }
    getDomEventNames(): readonly string[] {
        return PointerEvents
    }
    findHitTarget(x: number, y: number, types: string[] = []) {
        let target: IDisplayObject
        const objects = this.app.container.getDisplayList()
        for (let i = objects.length - 1; i >= 0; i--) {
            let obj = objects[i]
            if ((types.length <= 0 || types.some(type => obj.hasEventListener(type as any))) && obj.shouldInteractive() && obj.contains(x, y)) {
                target = obj
                break
            }
        }
        return target
    }
    handle = (e: PointerEvent) => {
        const type = e.type;
        const bounds = this.bounds
        const x = e.clientX - bounds.left
        const y = e.clientY - bounds.top

        const event = this.currentPointerEvent
        event.nativeEvent = e
        event.type = type
        event.point.set(x, y)

        let delegateType: string = ''
        let target: IDisplayObject = null
        switch (type) {
            case 'contextmenu':
                target = this.findHitTarget(x,y,['contextmenu'])
                delegateType = 'pointerdown'
                e.preventDefault()
            break
            case 'pointerdown':
                target = this.findHitTarget(x,y,['pointerdown'])
                event.downPoint.set(x,y)
                event.lastPoint.set(x,y)
                this.dragState=DragState.DragStart
                delegateType = 'pointerdown'
                break;
            case 'click':
                delegateType = 'click'
                break;
            case 'dblclick':
                delegateType = 'dblclick'
                break;
            case 'pointerleave':
            case 'pointercancel':
            case 'pointerup':
                event.upPoint.set(x,y)
                delegateType = 'pointerup'
                if(this.dragState===DragState.Dragging){
                    this.dragTarget&&this.dragTarget.emit('dragend',event)
                    this.options.proxyHandler.emit('dragend',event)
                }
                this.dragTarget=null
                this.dragState=DragState.Idle
                break;
        }
        this.options.handle?.(e)
        if (delegateType !== '') {
            event.type=delegateType
            if(target){
                target.emitBubble(event)
            }
            this.options.proxyHandler.emit(delegateType, event)
            event.nativeEvent = null
        }

    }

}