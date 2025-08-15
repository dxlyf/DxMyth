type Handle = (...args: any[]) => void;
type HandleData<T extends any[]> = (...args: T) => void;
type ListenerItem = {
    handle: Handle;
    once?: boolean;
    namespace?: string;
    stage: number;
};
type ListenrOptions = {
    namespace?: string;
    capture?: boolean;
    once?: boolean;
    stage?: number;
};
type EventListener = Record<string, ListenerItem[]>;
type EventTarget = {
    parent?: EventTarget | null;
};
type EventTargetObj = {
    [Key: string]: EventListener | Map<string, Map<string, number>> | null | undefined;
};
export declare function addEventListener(target: EventTargetObj, listenerName: string, listenerNameNs: string, eventName: string, handle: Handle, options?: ListenrOptions): void;
export declare function removeEventListener(target: EventTargetObj, listenerName: string, listenerNameNs: string, eventName?: string | null, namespace?: string | null, handler?: Function): void;
export declare function dispatchEvent(target: EventTargetObj, listenerName: string, listenerNameNs: string, eventName: string, ...args: any[]): void;
export declare function getListeners(target: EventTargetObj, listenerName: string, eventName: string): ListenerItem[];
export declare function removeAllListeners(target: EventTargetObj, listenerName: string, listenerNameNs: string): void;
export declare function hasEventListener(target: EventTargetObj, listenerName: string, eventName: string): boolean;
export declare function getEventNames(target: EventTargetObj): string[];
export declare function dispatchBubbleEvent(target: EventTargetObj, listenerName: string, captureListenerName: string, listenerNameNs: string, e: IEmitter4Event<any>): boolean;
interface IEmitter4Event<D = any> {
    type: string;
    data?: D | null;
    target: EventTarget | null;
    currentTarget?: EventTarget | null;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    cancelBubble: boolean;
    immediateCancelBubble: boolean;
    eventPhase: number;
    composedPath(target: EventTarget): EventTarget[];
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
}
export declare class Emitter4Event<D> implements IEmitter4Event<D> {
    static create<T extends string, D = any>(type: T, data?: D): Emitter4Event<T>;
    type: string;
    target: EventTarget | null;
    currentTarget?: EventTarget | null;
    data?: D | null;
    eventPhase: number;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    cancelBubble: boolean;
    immediateCancelBubble: boolean;
    constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    setData(data: D | null): this;
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): this;
    /**
     *
     * @returns {EventTarget[]}
     */
    composedPath(target: EventTarget): EventTarget[];
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
}
export declare class EventEmitter4<E extends {
    [K in keyof E]: any[];
}> implements EventTarget {
    parent?: EventTarget | null;
    _listeners?: EventListener;
    _listenersNs?: Map<string, Map<string, number>>;
    on<T extends Extract<keyof E, string>, D extends E[T]>(type: T, handle: HandleData<D>, opts?: ListenrOptions): this;
    emit<T extends Extract<keyof E, string>, D extends E[T]>(type: T, ...args: D): this;
    createEvent<T extends Extract<keyof E, string>, D extends E[T]>(type: T, data: D[0]): Emitter4Event<T>;
    emitBubble(e: IEmitter4Event): boolean;
    off<T extends Extract<keyof E, string>>(type?: T | null, handler?: Function, opts?: ListenrOptions): this;
    eventNames(): string[];
    hasEventListener<T extends Extract<keyof E, string>>(type: T): boolean;
    removeAllListeners(): this;
}
export {};
