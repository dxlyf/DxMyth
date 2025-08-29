import { Emitter4Event } from '@dxyl/utils'
import {IInteractivePointerEvent} from 'src/types/events/InteractivePointerEvent'
import {Vector2} from '../math/Vec2'

 export class InteractivePointerEvent<T=any> extends Emitter4Event<T> implements IInteractivePointerEvent<T>{
    static fromPointerEvent(e:PointerEvent): InteractivePointerEvent<any> {
        const event= new InteractivePointerEvent(e.type)
        event.nativeEvent=e
        return event
    }
    static pool(){
        
    }
    nativeEvent: PointerEvent
    point=Vector2.default()
    downPoint=Vector2.default()
    upPoint=Vector2.default()
    offsetPoint: Vector2=Vector2.default()
    deltaPoint: Vector2=Vector2.default()
    constructor(type:string){
        super(type)
    }
}
