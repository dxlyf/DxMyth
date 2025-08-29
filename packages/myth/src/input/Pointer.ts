
import { IDisplayObject } from "src/types/core/DisplayObject";
import { EventHandle } from "./EventHandle";
import {InteractivePointerEvent} from 'src/events/InteractivePointerEvent'
import { Pool } from "src/utils/Pool";
const PointerEvents=["pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
    "pointerenter",
    "pointerleave"] as const;
export type PointerEventNames=typeof PointerEvents[number]



export class PointerEventHandle extends EventHandle<PointerEventNames,PointerEvent>{

    getDomEventNames(): readonly string[] {
         return PointerEvents
    }
    findHitTarget(e:InteractivePointerEvent): IDisplayObject | null {
        let target: IDisplayObject
        let point=e.point
        const objects = this.app.container.getDisplayList()
        for (let i = objects.length - 1; i >= 0; i--) {
            let obj = objects[i]
            if (obj.hasEventListener(type)&&obj.shouldInteractive() && obj.contains(x, y)) {
                target = obj
                break
            }
        }
        return target
    }
    handle=(e: PointerEvent) =>{
        let type=e.type;
        let event=poolEvent.pool(e)
        if(this.options.handle){
            this.options.handle(e)
        }
        this.options.proxyHandler.emit(type,e)
        poolEvent.release()
    }

}
const poolEvent=new Pool<InteractivePointerEvent,[e:PointerEvent]>({
    maxSize:5,
    create:(e:PointerEvent)=>{
        const event=new InteractivePointerEvent(e.type)
        event.nativeEvent=e
        return event
    },
    init(event:InteractivePointerEvent,e:PointerEvent){
        event.type=e.type
        event.nativeEvent=e
    }

})