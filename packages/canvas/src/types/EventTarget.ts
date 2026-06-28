
export interface INodeEvent<T=string,D=any>{
    type:T
    delegateType?:string
    data:D
    target:any
    currentTarget:any
    nativeEvent:Event
    defaultPrevented:boolean
    cancelBubble:boolean
    immediateCancelBubble:boolean 
    stopPropagation():void
    stopImmediatePropagation():void
    preventDefault():void
    composedPath():INodeEventTarget<any>[]
}
export type EventListenerOptions={
    capture?:boolean
    once?:boolean
}
export type AddEventListenerOptions=boolean|EventListenerOptions
export interface NodeEventListener<T,D> {
    (evt: INodeEvent<T,D>): void;
}

export interface NodeEventListenerObject<T,D> {
    handleEvent(object: INodeEvent<T,D>): void;
}
export type EventCallbackOrObject<T,D>=NodeEventListener<T,D>|NodeEventListenerObject<T,D>
// type EventrHandle<E>=(e:E)=>void
export interface INodeEventTarget<EventListeners extends Record<string,any>=any>{
     parent?:INodeEventTarget<EventListeners> | null
     listeners:Map<string,EventCallbackOrObject<any,any>[]>
     addEventListener<K extends  Extract<keyof EventListeners,string>>(type:K,handler:EventCallbackOrObject<K,EventListeners[K]>,options?:AddEventListenerOptions):void
     /** addEventListener 的别名 */
     on<K extends  Extract<keyof EventListeners,string>>(type:K,handler:EventCallbackOrObject<K,EventListeners[K]>,options?:AddEventListenerOptions):void
     removeEventListener<K extends  Extract<keyof EventListeners,string>>(type:K,handler?:EventCallbackOrObject<K,EventListeners[K]>,options?:AddEventListenerOptions):void
     off<K extends  Extract<keyof EventListeners,string>>(type:K,handler?:EventCallbackOrObject<K,EventListeners[K]>,options?:AddEventListenerOptions):void
     
     dispatchEvent<K extends  Extract<keyof EventListeners,string>>(e:INodeEvent<K,EventListeners[K]>):void
     emit<K extends  Extract<keyof EventListeners,string>>(type:K,data:EventListeners[K]):void
     removeAllListeners():void
     getEventListeners<K extends  Extract<keyof EventListeners,string>>(type:K):EventCallbackOrObject<K,EventListeners[K]>[]
}
