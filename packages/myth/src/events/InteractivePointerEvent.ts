import { Emitter4Event } from '@dxyl/utils'
import {IInteractivePointerEvent} from 'src/types/events/InteractivePointerEvent'
import {Vector2} from '../math/Vec2'

 export class InteractivePointerEvent<T=any> extends Emitter4Event<T> implements IInteractivePointerEvent<T>{
    static fromPointerEvent(e:PointerEvent): InteractivePointerEvent<any> {
        const event= new InteractivePointerEvent(e.type)
        event.nativeEvent=e
        return event
    }
    nativeEvent: PointerEvent
    point=Vector2.default() // 当前鼠标位置
    downPoint=Vector2.default() // 鼠标按下位置
    upPoint=Vector2.default() // 鼠标抬起位置
    offsetPoint: Vector2=Vector2.default() // 鼠标按下到当前位置的偏移量
    deltaPoint: Vector2=Vector2.default() // 鼠标移动的偏移量
    lastPoint: Vector2=Vector2.default() // 鼠标上一次的位置
    constructor(type:string){
        super(type)
    }
}
