import { EventEmitter } from "src/events";
import { IApplication } from "src/types/core/Application";

export type EventHandleOptions={
    domElement: HTMLElement,
    proxyHandler?: EventEmitter,
    handle?: (e:Event)=>void
}
/**
 * 事件处理基类，用于封装原生DOM事件的监听和分发。
 */
export abstract class EventHandle<T extends string,E extends Event> extends EventEmitter<T> {
    options:EventHandleOptions
    _bounds: DOMRect
    constructor(public app:IApplication, options?:EventHandleOptions) {
        super()
        this.options=Object.assign({
            proxyHandler:this
        },options)
    }
    get domElement(){
        return this.options.domElement
    }
    get proxyHandler(){
        return this.options.proxyHandler
    }
    get bounds() {
        if (!this._bounds) {
            this._bounds = this.domElement.getBoundingClientRect()
        }
        return this._bounds
    }
    abstract getDomEventNames(): readonly string[]
    mapEvent(e:E){
        return e as any
    }
    handle=(e: E)=> {
        e=this.mapEvent(e)
        if(this.options.handle){
            this.options.handle(e)
        }
        this.options.proxyHandler.emit(e.type,e)
    }   
    attachEvents() {
        for (let eventName of this.getDomEventNames()) {
            this.domElement.addEventListener(eventName as any, this.handle, false)
        }
    }
    detachEvents() {
        for (let eventName of this.getDomEventNames()) {
            this.domElement.removeEventListener(eventName  as any, this.handle, false)
        }
    }
    onUpdate(){

    }
    onResize(){
        this._bounds=null
    }
    destroy(){
        this.detachEvents()
    }

}