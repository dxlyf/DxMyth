import { extensions, ExtensionType } from 'src/extensions'
import { PointerEventHandle } from './Pointer'
import { IApplication } from 'src/types/core/Application'
import { IDisplayObject } from 'src/types/core/DisplayObject'
import {InteractivePointerEvent} from 'src/events/InteractivePointerEvent'

export class InputManager {
    static extension = ExtensionType.Interactive
    _bounds: DOMRect
    pointerEventHandle: PointerEventHandle
    _currentPointerEvent: PointerEvent
    constructor(public app: IApplication) {
        this.pointerEventHandle = new PointerEventHandle(app,{
            domElement: this.domElement,
            handle: (e)=>this.handlePointer(e as PointerEvent)
        })
        this.init()
        this.app.renderer.on('resize', this.handleResize)
        this.app.on('update',this.handleAnimationMove)
    }
    get domElement() {
        return this.app.domElement
    }
    get bounds() {
        if (!this._bounds) {
            this._bounds = this.domElement.getBoundingClientRect()
        }
        return this._bounds
    }
    init() {
        this.pointerEventHandle.attachEvents()
    }
    handleResize = () => {
        this._bounds = null

    }

    handleAnimationMove=()=>{
        if(this._currentPointerEvent){
            const e=this._currentPointerEvent
        }
        this._currentPointerEvent=null
    }
    handlePointer(e: PointerEvent) {
        const rect = this.bounds
        const type = e.type
        const x = e.clientX - rect.left, y = e.clientY - rect.top

        const evetData={
            e:e,
            x:x,
            y:y,
        }
        if (type === 'pointerdown') {
           
        }else if(type==='pointermove'){
            this._currentPointerEvent=e
        }else if(type==='pointerup'||type==='pointercancel'){

        }
    }
    destroy() {
        this.pointerEventHandle.detachEvents()
        this.app.renderer.off('resize', this.handleResize)
        this.app.off('update',this.handleAnimationMove)
    }
}
extensions.add(InputManager)