


type Handle = (...args: any[]) => void;
type HandleData<T extends any[]> = (...args: T) => void;

type ListenerItem = {
    handle: Handle,
    once?: boolean,
    namespace?: string
    stage: number
}
type ListenrOptions = {
    namespace?: string;
    capture?: boolean;
    once?: boolean;
    stage?: number
}
type EventListener = Record<string, ListenerItem[]>
type EventListenerNs = Map<string, Map<string, number>>
type EventTarget = {
    parent?: EventTarget | null
}
type EventTargetObj = {
    [Key: string]: EventListener | Map<string, Map<string, number>> | null | undefined
}
export function addEventListener(target: EventTargetObj, listenerName: string, listenerNameNs: string, eventName: string, handle: Handle, options?: ListenrOptions) {
    let newOptions = Object.assign({
        once: false,
        stage: Infinity
    }, options) as Required<ListenrOptions>
    if (!target[listenerName]) {
        target[listenerName] = Object.create(null);
    }
    let listeners = target[listenerName]! as EventListener
    let handlers = listeners[eventName];
    if (!handlers) {
        handlers = [];
        listeners[eventName] = handlers;
    }
    if (handlers.some(d => d.handle === handle)) {
        return
    }
    let handler: ListenerItem = {
        handle,
        once: newOptions.once,
        namespace: newOptions.namespace,
        stage: newOptions.stage
    }
    let index = -1
    if (newOptions.stage !== Infinity) {
        index = handlers.findIndex(item => {
            return item.handle < handler.handle
        })
    }
    if (index !== -1) {
        handlers.splice(index, 0, handler)
    } else {
        handlers.push(handler)
    }

    if (newOptions.namespace) {
        let _listenersNs = target[listenerNameNs] as EventListenerNs

        if (!_listenersNs) {
            _listenersNs = target[listenerNameNs] = new Map<string, Map<string, number>>()
        }
        let ns = _listenersNs.get(newOptions.namespace)
        if (!ns) {
            _listenersNs.set(newOptions.namespace, new Map())
        }
        ns = _listenersNs.get(newOptions.namespace)! as Map<string, number>
        if (!ns.has(eventName)) {
            ns.set(eventName, 1)
        } else {
            ns.set(eventName, (ns.get(eventName) as number) + 1)
        }
    }

}

export function removeEventListener(target: EventTargetObj, listenerName: string, listenerNameNs: string, eventName?: string | null, namespace?: string | null, handler?: Function) {
    if (!target[listenerName]) {
        return;
    }
    if (!eventName && !namespace) {
        target[listenerName] = undefined
        delete target[listenerName]
        return;
    } else if (!eventName && namespace) {
        let _listenersNs = target[listenerNameNs] as EventListenerNs
        if (!_listenersNs || !_listenersNs.has(namespace)) {
            return
        }
        const ns = _listenersNs.get(namespace)!
        ns.forEach((value, key) => {
            removeEventListener(target, listenerName, listenerNameNs, key, undefined, handler)
        })
        _listenersNs.delete(namespace)
    } else if (eventName) {
        let listeners = target[listenerName]! as EventListener
        let handlers = listeners[eventName];
        if (handlers) {
            listeners[eventName] = handlers.filter(item => {
                if ((!handler || item.handle === handler) && (!namespace || item.namespace === namespace)) {
                    let _listenersNs = target[listenerNameNs] as EventListenerNs
                    if (item.namespace && _listenersNs && _listenersNs.has(item.namespace)) {
                        let ns = _listenersNs.get(item.namespace)!
                        if (ns.has(eventName)) {
                            ns.set(eventName, (ns.get(eventName) as number) - 1)
                        }
                        if ((ns.get(eventName) as number) <= 0) {
                            ns.delete(eventName)
                        }
                    }
                    return false
                }
                return true
            })


        }
    }


}
export function dispatchEvent(target: EventTargetObj, listenerName: string, listenerNameNs: string, eventName: string, ...args: any[]) {
    if (!target[listenerName]) {
        return;
    }
    let listeners = target[listenerName]! as EventListener
    let handlers = listeners[eventName];
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            const item = handlers[i]
            item.handle(...args)
            if (item.once) {
                removeEventListener(target, listenerName, listenerNameNs, eventName, null, item.handle)
            }
        }
    }
}
export function getListeners(target: EventTargetObj, listenerName: string, eventName: string): ListenerItem[] {
    let listeners = target[listenerName] as EventListener
    if (!listeners) {
        return []
    }
    let handlers = listeners[eventName] || [];
    return handlers
}
export function removeAllListeners(target: EventTargetObj, listenerName: string, listenerNameNs: string) {
    target[listenerName] = undefined
    target[listenerNameNs] = undefined
}
export function hasEventListener(target: EventTargetObj, listenerName: string, eventName: string): boolean {
    let listeners = target[listenerName] as EventListener
    if (!listeners) {
        return false
    }
    let handlers = listeners[eventName]
    return handlers ? handlers.length > 0 : false
}
export function getEventNames(target: EventTargetObj): string[] {
    if (!target._listeners) {
        return []
    }
    let listeners = target._listeners!
    return Object.keys(listeners)
}
export function dispatchBubbleEvent(target: EventTargetObj, listenerName: string, captureListenerName: string, listenerNameNs: string, e: IEmitter4Event<any>) {
    e.currentTarget = target
    const type = e.type
    const nodePath = e.composedPath(target)
    const nodePathLength = nodePath.length
    // 执行capture
    for (let i = nodePathLength - 1; i >= 0; i--) {
        const emitter = nodePath[i]
        e.target = nodePath[i]
        e.eventPhase = e.target !== target ? EventPhase.CAPTURING_PHASE : EventPhase.AT_TARGET
        const listeners = getListeners(emitter as any, captureListenerName, type)
        for (let j = 0, len = listeners.length; j < len; j++) {
            const event = listeners[j]
            if (event.once) {
                removeEventListener(target, captureListenerName, listenerNameNs, type, null, event.handle)
            }
            event.handle(e)
            if (e.immediateCancelBubble) {
                break
            }
        }
        if (e.cancelBubble) {
            break
        }
    }
    // 并且没有停止冒泡就继续
    if (!e.cancelBubble) {
        for (let i = 0; i < nodePathLength; i++) {
            const emitter = nodePath[i]
            e.target = nodePath[i]
            e.eventPhase = e.target !== target ? EventPhase.BUBBLING_PHASE : EventPhase.AT_TARGET
            const listeners = getListeners(emitter as any, listenerName, type)
            for (let j = 0, len = listeners.length; j < len; j++) {
                const event = listeners[j]
                if (event.once) {
                    removeEventListener(target, listenerName, listenerNameNs, type, null, event.handle)
                }
                event.handle(e)
                // 如果用户执行了立即停止冒泡，就直接结束
                if (e.immediateCancelBubble) {
                    break
                }
            }

            // 是否取消了冒泡或不支持冒泡
            if (e.cancelBubble || !e.bubbles) {
                break
            }
        }
    }
    e.eventPhase = EventPhase.NONE
    return !e.defaultPrevented
}
const EventPhase = {
    NONE: 0,
    CAPTURING_PHASE: 1,
    AT_TARGET: 2,
    BUBBLING_PHASE: 3
} as const;
interface IEmitter4Event<D = any> {
    type: string
    data?: D | null
    target: EventTarget | null
    currentTarget?: EventTarget | null
    bubbles: boolean // Does it support bubbling
    cancelable: boolean // Is it possible to block default behavior
    defaultPrevented: boolean // Whether to block by default
    cancelBubble: boolean // Whether to stop bubbles
    immediateCancelBubble: boolean // Stop bubbles immediately
    eventPhase: number
    composedPath(target: EventTarget): EventTarget[]
    preventDefault(): void
    stopPropagation(): void
    stopImmediatePropagation(): void

}

export class Emitter4Event<D> implements IEmitter4Event<D> {
    static create<T extends string, D = any>(type: T, data?: D) {
        return new Emitter4Event<T>(type)
    }
    type!: string
    target: EventTarget | null = null
    currentTarget?: EventTarget | null = null
    data?: D | null = null
    eventPhase: number = EventPhase.NONE
    bubbles = false // Does it support bubbling
    cancelable = false // Is it possible to block default behavior
    defaultPrevented = false // Whether to block by default
    cancelBubble = false // Whether to stop bubbles
    immediateCancelBubble = false // Stop bubbles immediately

    constructor(type: string, bubbles?: boolean, cancelable?: boolean) {
        this.initEvent(type, bubbles, cancelable)
    }
    setData(data: D | null): this {
        this.data = data
        return this
    }
    initEvent(type: string, bubbles: boolean = true, cancelable: boolean = true) {
        this.type = type
        this.bubbles = bubbles
        this.cancelable = cancelable
        return this
    }
    /**
     * 
     * @returns {EventTarget[]}
     */
    composedPath(target: EventTarget) {
        let current: EventTarget | null | undefined = target
        let composePath: EventTarget[] = []
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
const _eventName = '_listeners'
const _eventName_capture = '_listeners_capture'
const _eventNs = '_listenersNs'
export class EventEmitter4<E extends { [K in keyof E]: any[] }> implements EventTarget {
    parent?: EventTarget | null;
    _listeners?: EventListener
    _listenersNs?: Map<string, Map<string, number>>
    on<T extends Extract<keyof E, string>, D extends E[T]>(type: T, handle: HandleData<D>, opts?: ListenrOptions) {
        if (opts && opts.capture) {
            addEventListener(this as any, _eventName_capture, _eventNs, type, handle as Handle, opts)
        } else {
            addEventListener(this as any, _eventName, _eventNs, type, handle as Handle, opts)
        }
        return this
    }
    emit<T extends Extract<keyof E, string>, D extends E[T]>(type: T, ...args: D) {
        dispatchEvent(this as any, _eventName, _eventNs, type, ...args)
        return this
    }
    createEvent<T extends Extract<keyof E, string>,D extends E[T]>(type: T,data:D[0]) {
        return Emitter4Event.create(type,data)
    }
    emitBubble(e:IEmitter4Event) {
        return dispatchBubbleEvent(this as any, _eventName, _eventName_capture, _eventNs, e)
    }
    off<T extends Extract<keyof E, string>>(type?: T | null, handler?: Function, opts?: ListenrOptions) {
        removeEventListener(this as any, _eventName, _eventNs, type, opts ? opts.namespace : null, handler)
        return this
    }
    eventNames(): string[] {
        return getEventNames(this as any)
    }
    hasEventListener<T extends Extract<keyof E, string>>(type: T) {
        return hasEventListener(this as any, _eventName, type)
    }
    removeAllListeners() {
        removeAllListeners(this as any, _eventName, _eventNs)
        return this
    }
}

