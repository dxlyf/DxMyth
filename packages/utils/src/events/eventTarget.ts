import { EventEmitter } from './eventemitter3'

interface EventOptions{
    once?:boolean
    capture?:boolean
}
type EventCallback<T> = (event: Event<T>) => void


export const EventPhase = {
    NONE: 0,
    CAPTURING_PHASE: 1,
    AT_TARGET: 2,
    BUBBLING_PHASE: 3
} as const;

export type EventPhase = typeof EventPhase[keyof typeof EventPhase];
export const NONE = EventPhase.NONE;
export const CAPTURING_PHASE = EventPhase.CAPTURING_PHASE;
export const AT_TARGET = EventPhase.AT_TARGET;
export const BUBBLING_PHASE = EventPhase.BUBBLING_PHASE;

export class Event<T=any,E extends Extract<keyof Record<string,any>,string>=''> {
    static create<T=any,E extends Extract<keyof Record<string,any>,string>=''>(type:E, bubbles?:boolean, cancelable?:boolean){
        return new this<T,E>(type, bubbles, cancelable)
    }
    type:E = 'none' as E
    parentNode = null
    target:EventTarget|null = null
    currentTarget:EventTarget|null = null
    data:T|null = null
    eventPhase:number = NONE
    bubbles = false // Does it support bubbling
    cancelable=false // Is it possible to block default behavior
    defaultPrevented = false // Whether to block by default
    cancelBubble = false // Whether to stop bubbles
    immediateCancelBubble = false // Stop bubbles immediately

    constructor(type:E, bubbles?:boolean, cancelable?:boolean) {
        this.initEvent(type, bubbles, cancelable)
    }
    setData(data:T|null):this {
        this.data = data
        return this
    }
    initEvent(type:E, bubbles:boolean=true, cancelable:boolean = true) {
        this.type = type
        this.bubbles = bubbles
        this.cancelable = cancelable
    }
    /**
     * 
     * @returns {EventTarget[]}
     */
    composedPath() {
        let current = this.currentTarget;
        let composePath:EventTarget[] = []
        while (current) {
            composePath.push(current)
            current = current.parentNode
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
function getOptions(options?:EventOptions|boolean) {
    if (typeof options === 'boolean' || !options) {
        options = {
            capture: !!options
        }
    }
    options = { capture: false, once: false ,...(options||{})}
    return options
}
/**
 * @this {EventEmitter}
 * @param {EventEmitter} emitter 
 * @param {string} event 
 * @returns {EE[]}
 */
function getEmitterListenerEvents(emitter:any,evt:string) {
    var handlers = emitter._events[evt],ee:any[];
    if (!handlers) return [];
    if (handlers.fn) return [handlers];

    for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i];
    }
    return ee;
}
export interface EventTarget<Events extends Record<string,any>={}>{
    on<K extends keyof Events>(type:K, fn:EventCallback<Events[K]>, options?:EventOptions|boolean):void
    off<K extends keyof Events>(type:K, fn:EventCallback<Events[K]>, options?:EventOptions|boolean):void
    emit<K extends Extract<keyof Events, string>>(e:Event<Events[K],K>):void

}
export class EventTarget<Events extends Record<string,any>={}>  {
    parentNode:EventTarget|null=null
    private _bubble_emitter = new EventEmitter()
    private _capture_emitter = new EventEmitter()

    addEventListener<K extends keyof Events>(type:K, fn:EventCallback<Events[K]>, options?:EventOptions|boolean) {
        options = getOptions(options) as EventOptions
        const emitter = options.capture ? this._capture_emitter : this._bubble_emitter
        if (options && options.once) {
            emitter.once(type as string, fn)
        } else {
            emitter.on(type as string, fn,)
        }
    }
 
    removeEventListener<K extends keyof Events>(type:K, fn:EventCallback<Events[K]>, options?:EventOptions|boolean) {
        options = getOptions(options) as EventOptions
        const emitter = options.capture ? this._capture_emitter : this._bubble_emitter
        emitter.off(type as string, fn)
    }
    /**
     * 
     * @param {Event} e 
     */
    dispatchEvent<K extends Extract<keyof Events, string>>(e:Event<Events[K],K>) {
        e.currentTarget=this
        const type = e.type
        const nodePath = e.composedPath()
        const nodePathLength=nodePath.length
        // 执行capture
        for (let i =nodePathLength - 1; i >= 0; i--) {
            const emitter=nodePath[i]._capture_emitter
            const listenerCount = emitter.listenerCount(type)
            if (listenerCount > 0) {
                e.target=nodePath[i]
                e.eventPhase=e.target!==this?CAPTURING_PHASE:AT_TARGET
                const listeners = getEmitterListenerEvents(emitter,type)
                for(let j=0,len=listeners.length;j<len;j++){
                    const event=listeners[j]
                    if(event.once){
                        emitter.removeListener(type,event.fn,event.context,event.once)
                    }
                    event.fn(e)
                    if(e.immediateCancelBubble){
                        break
                    }
                }
            }
            if(e.cancelBubble){
                break
            }
        }
        // 并且没有停止冒泡就继续
        if(!e.cancelBubble){
            for (let i = 0; i<nodePathLength; i++) {
                const emitter=nodePath[i]._bubble_emitter
                const listenerCount = emitter.listenerCount(type)
                if (listenerCount>0) {
                    e.target=nodePath[i]
                    e.eventPhase=e.target!==this?BUBBLING_PHASE:AT_TARGET
                    const listeners = getEmitterListenerEvents(emitter,type)
                    for(let j=0,len=listeners.length;j<len;j++){
                        const event=listeners[j]
                        if(event.once){
                            emitter.removeListener(type,event.fn,event.context,event.once)
                        }
                        event.fn(e)
                        // 如果用户执行了立即停止冒泡，就直接结束
                        if(e.immediateCancelBubble){
                            break
                        }
                    }
                }
                // 是否取消了冒泡或不支持冒泡
                if(e.cancelBubble||!e.bubbles){
                    break
                }
            }
        }
        e.eventPhase=NONE
        return !e.defaultPrevented
    }
    removeAllListeners(){
        this._bubble_emitter.removeAllListeners()
        this._capture_emitter.removeAllListeners()
    }
}
EventTarget.prototype.on=EventTarget.prototype.addEventListener
EventTarget.prototype.off=EventTarget.prototype.removeEventListener
EventTarget.prototype.emit=EventTarget.prototype.dispatchEvent


export {
    EventTarget as EventPropagation
}