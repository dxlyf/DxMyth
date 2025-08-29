import { EventEmitter } from "src/events";
import { IApplication } from "src/types/core/Application";

export type EventHandleOptions={
    domElement: HTMLElement,
    proxyHandler?: EventEmitter,
    handle?: (e:Event)=>void
}
export abstract class EventHandle<T extends string,E extends Event> extends EventEmitter<T> {
    proxyHandler: EventEmitter
    options:EventHandleOptions
    constructor(public app:IApplication, options:EventHandleOptions) {
        super()
        this.options=Object.assign({
            proxyHandler:this
        },options)
    }
    get domElement(){
        return this.options.domElement
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

}