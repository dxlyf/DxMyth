export interface EventListener<T = any> {
    (evt: Event<T>): void;
}
interface EventListenerObject<T = any> {
    handleEvent(object: Event<T>): void;
}
interface EventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
}
interface EventListenerOptions {
    capture?: boolean;
}
type EventListenerOrEventListenerObject<T = any> = EventListener<T> | EventListenerObject<T>;
interface AddEventListenerOptions extends EventListenerOptions {
    once?: boolean;
    passive?: boolean;
    signal?: AbortSignal;
}
export declare class Event<T = any> {
    readonly NONE = 0;
    readonly CAPTURING_PHASE = 1;
    readonly AT_TARGET = 2;
    readonly BUBBLING_PHASE = 3;
    data: T | null;
    /** 事件类型 */
    type: string;
    /** 事件是否冒泡 */
    bubbles: boolean;
    /** 阻止事件冒泡的标志 */
    cancelBubble: boolean;
    /** 事件是否可以取消 */
    cancelable: boolean;
    /** 事件是否支持跨文档冒泡 */
    composed: boolean;
    /** 事件是否被默认行为阻止 */
    defaultPrevented: boolean;
    /** 事件是否由用户操作生成 */
    isTrusted: boolean;
    /** 事件的目标对象 */
    target: EventTarget | null;
    /** 当前正在处理事件的对象 */
    currentTarget: EventTarget | null;
    /** 事件阶段 */
    eventPhase: number;
    /** 事件的时间戳 */
    timeStamp: number;
    /**
     * 标记事件是否应该立即停止传播
     */
    stopImmediatePropagationInternal: boolean;
    /**
     * 构造函数
     * @param type 事件类型
     * @param eventInitDict 可选的事件初始化字典
     */
    constructor(type: string, eventInitDict?: EventInit);
    setData(data: T): this;
    /**
      * 初始化事件对象的属性
      * @param type 事件类型
      * @param bubbles 是否冒泡
      * @param cancelable 是否可以取消
      */
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
    /**
     * 阻止事件冒泡
     */
    stopPropagation(): void;
    /**
     * 阻止事件的默认行为
     */
    preventDefault(): void;
    /**
     * 阻止事件冒泡并停止调用事件监听器
     */
    stopImmediatePropagation(): void;
    /**
     * 返回事件的目标对象及其祖先对象的路径
     * @returns 事件路径的数组
     */
    composedPath(): EventTarget[];
}
export declare class EventTarget<Events extends Record<string, any> = any> {
    private listeners;
    parentNode: EventTarget | null;
    constructor();
    addEventListener<E extends keyof Events>(type: E, callback: EventListenerOrEventListenerObject<Events[E]>, options?: AddEventListenerOptions | boolean): void;
    dispatchEvent<E extends keyof Events>(event: Event<Events[E]>): boolean;
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
}
export {};
