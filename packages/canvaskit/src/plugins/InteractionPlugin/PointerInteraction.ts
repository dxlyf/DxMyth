
import { EventEmitter } from 'src/events';
import { Vector2 } from 'src/math';
const PointerEvents = ['pointerdown', 'pointerup', 'pointermove', 'pointercancel', 'pointerenter', 'pointerleave', 'click']
const TouchEvents = ['touchstart', 'touchend', 'touchmove', 'touchcancel']
//const MouseEvents = ['mousedown', 'mouseup', 'mousemove', 'click']

export type PointerInteractionEvents = {
    pointerdown: PointerInteractionEvent
    pointermove: PointerInteractionEvent
    pointerup: PointerInteractionEvent
    dragStart: PointerInteractionEvent
    drag: PointerInteractionEvent
    dragEnd: PointerInteractionEvent
    click: PointerInteractionEvent
    pointerenter: PointerInteractionEvent
    pointerleave: PointerInteractionEvent
}
export interface PointerInteractionEvent {

}
export class PointerInteractionEvent<E extends Event=PointerEvent> {
    type:string
    pointerId:number
    isDown:boolean=false
    nativeType:string
    nativeEvent: E
    downPoint = Vector2.default()
    upPoint = Vector2.default()
    point = Vector2.default()
    deltaPoint = Vector2.default()
    offsetPoint = Vector2.default()
    lastPoint = Vector2.default()
    target?:any
    currentTarget?:any
    x:number
    y:number
    cancelable=true
    defaultPrevented=false
    cancelBubble=false
    immediateCancelBubble=false
    constructor() {

    }
    reset(){
      //  this.target=null
      //  this.currentTarget=null
        this.cancelBubble=true 
        this.defaultPrevented=false
        this.cancelBubble=false
        this.immediateCancelBubble=false
    }
    composedPath() {
        let current = this.target;
        let composePath:any[] = []
        while (current) {
            composePath.push(current)
            current = current.parent
        }
        return composePath
    }
    preventDefault() {
        if (this.cancelable) {
            this.defaultPrevented = true
        }
    }
    stopPropagation() {
        this.cancelBubble = true
    }
    stopImmediatePropagation() {
        this.stopPropagation()
        this.immediateCancelBubble = true
    }
}
export type PointerInteractionOptions={
     domElement: HTMLElement, 
     debug?: boolean,
     supportTouch?:boolean
     animationFrameMove?:boolean // 在动画帖中执行
     emit?:(e:PointerInteractionEvent)=>void
}
export class PointerInteraction extends EventEmitter<PointerInteractionEvents> {
    domElement: HTMLElement
    event: PointerInteractionEvent
    _bounds: DOMRect | null = null
    isDown = false
    isDraging = false
    debug: boolean = false
    supportTouch=false
    options:Omit<PointerInteractionOptions,'domElement'>
    constructor() {
        super()
        this.event = new PointerInteractionEvent()
        this.handlePointer = this.handlePointer.bind(this)
        this.handleTouch = this.handleTouch.bind(this)
    }
    init(options: PointerInteractionOptions) {
        const {domElement,debug=false,supportTouch=false,...restOptions}=options
        this.domElement = domElement
        this.debug = debug
        this.supportTouch=supportTouch
        this.options={animationFrameMove:true,...restOptions}
        this.attachEvents()
        // this.unObserverSize=observerElementSize(this.domElement,()=>{
        //     setTimeout(()=>{
        //         this.resize()
        //     },100)
        // })
    }
    unObserverSize(){}
    attachEvents() {
         if (this.supportTouch) {
            TouchEvents.forEach(event => {
                this.domElement!.addEventListener(event as any, this.handleTouch, false)
            })
        }else  {
            PointerEvents.forEach(event => {
                this.domElement!.addEventListener(event as any, this.handlePointer, false)
            })
        } 
    }
    detachEvents() {
        PointerEvents.forEach(event => {
            this.domElement!.removeEventListener(event as any, this.handlePointer, false)
        })
        TouchEvents.forEach(event => {
            this.domElement!.removeEventListener(event as any, this.handleTouch, false)
        })

    }
    resize() {
        // this.detachEvents()
        // this.attachEvents()
        this._bounds = null
    }
    get bounds() {
        if (!this._bounds) {
            this._bounds = this.domElement!.getBoundingClientRect()
        }
        return this._bounds
    }
    emit<T extends keyof PointerInteractionEvents>(type: T, e: PointerInteractionEvent): boolean {
        e.type=type
        super.emit(type, e)
        if(this.options.emit){
            this.options.emit(e)
        }
        if (this.debug) {
            console.log('InteractionManager-emit:', type)
        }
        return true
    }
    resetHandleState() {
        this.isDown = false
        this.isDraging = false
    }
    handleClick() {
        this.emit('click', this.event)
    }
    handlwDown() {
        this.resetHandleState()
        this.isDown = true
        this.event.isDown=true
        this.event.downPoint.copy(this.event.point)
        this.emit('pointerdown', this.event)
    }
    handleMove() {
        
        const event = this.event
        event.deltaPoint.set(event.point.x - event.lastPoint.x, event.point.y - event.lastPoint.y)
        event.offsetPoint.set(event.point.x - event.downPoint.x, event.point.y - event.downPoint.y)
        event.lastPoint.copy(event.point)

        if (this.isDown && !this.isDraging) {
            this.isDraging = true
            this.emit('dragStart', this.event)
        } else if (this.isDown && this.isDraging) {
            this.emit('drag', this.event)
        }else{
            this.emit('pointermove', this.event)
        }
    }
    handleUp() {
        if (!this.isDown) {
            return
        }
        this.event.isDown=false
        this.event.upPoint.copy(this.event.point)
        if (this.isDraging) {
            this.emit('dragEnd', this.event)
        }
        this.emit('pointerup', this.event)
        this.resetHandleState()
    }
    animationMoveId=0
    handleAnimationMove(){
        if(this.animationMoveId){
            return
        }
        this.animationMoveId=requestAnimationFrame(()=>{
            this.handleMove()
            this.animationMoveId=0
        })
    }
    handlePointer(e: PointerEvent) {
        const type = e.type, event = this.event
        event.reset()
        event.nativeType=type
        event.nativeEvent = e
        const bounds = this.bounds
        const x = e.clientX - bounds.left
        const y = e.clientY - bounds.top
        event.x=x
        event.y=y
        event.point.set(x, y)
        
        switch (type) {
            case 'pointerdown':
                event.pointerId=e.pointerId
                this.domElement.setPointerCapture(e.pointerId) 
                this.handlwDown()
                break
            case 'pointermove':
                if(this.options.animationFrameMove){
                    this.handleAnimationMove()
                }else{
                    this.handleMove()
                }
                break
            case 'pointerenter':
            case 'pointerleave':
                break
            case 'pointercancel':
            case 'pointerup':
                this.domElement.releasePointerCapture(e.pointerId)
                event.pointerId=null
                this.handleUp()
                break
            case 'click':
                this.handleClick()
                break
        }
        event.nativeEvent = null
    }
    handleTouch(e: TouchEvent) {
        const type = e.type, event = this.event
        event.nativeEvent = e as any
        const bounds = this.bounds
        const touches=e.touches
        if(touches.length<=0){
            return
        }
        const touch=touches[0]
        const x = touch.clientX - bounds.left
        const y = touch.clientY - bounds.top
        event.x=x
        event.y=y
        event.point.set(x, y)
        switch (type) {
            case 'touchstart':
                this.handlwDown()
            break
            case 'touchmove':
                this.handleMove()
                break;
            case 'touchcancel':
            case 'touchend':
                this.handleUp();
                break

        }
    }
    dispose() {
        this.unObserverSize()
        this.detachEvents()
    }
}

