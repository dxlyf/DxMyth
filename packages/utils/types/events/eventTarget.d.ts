interface EventOptions {
    once?: boolean;
    capture?: boolean;
}
type EventCallback<T> = (event: Event<T>) => void;
export declare const EventPhase: {
    readonly NONE: 0;
    readonly CAPTURING_PHASE: 1;
    readonly AT_TARGET: 2;
    readonly BUBBLING_PHASE: 3;
};
export type EventPhase = typeof EventPhase[keyof typeof EventPhase];
export declare const NONE: 0;
export declare const CAPTURING_PHASE: 1;
export declare const AT_TARGET: 2;
export declare const BUBBLING_PHASE: 3;
export declare class Event<T = any, E extends Extract<keyof Record<string, any>, string> = ''> {
    static create<T = any, E extends Extract<keyof Record<string, any>, string> = ''>(type: E, bubbles?: boolean, cancelable?: boolean): Event<T, E>;
    type: E;
    parentNode: null;
    target: EventTarget | null;
    currentTarget: EventTarget | null;
    data: T | null;
    eventPhase: number;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    cancelBubble: boolean;
    immediateCancelBubble: boolean;
    constructor(type: E, bubbles?: boolean, cancelable?: boolean);
    setData(data: T | null): this;
    initEvent(type: E, bubbles?: boolean, cancelable?: boolean): void;
    /**
     *
     * @returns {EventTarget[]}
     */
    composedPath(): EventTarget<{}>[];
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
}
export interface EventTarget<Events extends Record<string, any> = {}> {
    on<K extends keyof Events>(type: K, fn: EventCallback<Events[K]>, options?: EventOptions | boolean): void;
    off<K extends keyof Events>(type: K, fn: EventCallback<Events[K]>, options?: EventOptions | boolean): void;
    emit<K extends Extract<keyof Events, string>>(e: Event<Events[K], K>): void;
}
export declare class EventTarget<Events extends Record<string, any> = {}> {
    parentNode: EventTarget | null;
    private _bubble_emitter;
    private _capture_emitter;
    addEventListener<K extends keyof Events>(type: K, fn: EventCallback<Events[K]>, options?: EventOptions | boolean): void;
    removeEventListener<K extends keyof Events>(type: K, fn: EventCallback<Events[K]>, options?: EventOptions | boolean): void;
    /**
     *
     * @param {Event} e
     */
    dispatchEvent<K extends Extract<keyof Events, string>>(e: Event<Events[K], K>): boolean;
    removeAllListeners(): void;
}
export { EventTarget as EventPropagation };
