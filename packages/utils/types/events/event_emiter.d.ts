type EventData = {
    [Key: string]: any;
};
type ListenerFunc<D extends EventData> = (e: EmitterEvent<D>) => void;
type ListenerObject<D extends EventData> = {
    handleEvent(e: EmitterEvent<D>): void;
};
type ListenerFuncOrObject<D extends EventData> = ListenerFunc<D> | ListenerObject<D>;
type ListenerData<D extends EventData> = {
    once: boolean;
    listener: ListenerFuncOrObject<D>;
};
export declare class EmitterEvent<Data extends EventData> {
    static NONE: number;
    static AT_TARGET: number;
    static BUBBLING_PHASE: number;
    static new(type: string, data: any): EmitterEvent<any>;
    type: string;
    eventPhase: number;
    data: Data;
    target: EventEmitter<any> | null;
    currentTarget: EventEmitter<any> | null;
    composedPath: EventEmitter<any>[];
    bubbles: boolean;
    propagationStopped: boolean;
    immediatePropagationStopped: boolean;
    constructor(type: string, data: Data);
    reset(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
}
declare const isEventEmitter_Property: unique symbol;
export declare class EventEmitter<EventListeners extends Record<string, EventData> = {}> {
    static createEvent(type: string, data: any): EmitterEvent<any>;
    [isEventEmitter_Property]: boolean;
    parent?: EventEmitter;
    listeners: Map<string, ListenerData<EventData>[]>;
    hasEvent(type: string): boolean;
    on<Type extends Extract<keyof EventListeners, string>>(type: Type, listener: ListenerFuncOrObject<EventListeners[Type]>, once?: boolean): boolean;
    off<Type extends Extract<keyof EventListeners, string>>(type?: Type, listener?: ListenerFuncOrObject<EventListeners[Type]>): boolean;
    emit(event: EmitterEvent<EventListeners[keyof EventListeners]>): void;
}
export {};
