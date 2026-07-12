type ListenerFn<Args extends any[] = any[]> = (...args: Args) => void;
type ListenerObject<Args extends any[] = any[]> = {
    handleEvent(...args: Args): void;
};
type Listener<Args extends any[] = any[]> = ListenerFn<Args> | ListenerObject<Args>;
/** 事件映射表类型 */
export type EventMap = Record<string, any[]>;
/**
 * 轻量级发布/订阅事件发射器。
 *
 * 特性：
 *   - 无 DOM 事件传播（冒泡/捕获），纯 pub/sub
 *   - 支持 once 自动移除
 *   - 支持 context 绑定
 *   - 单个事件类型多个监听器按注册顺序调用
 */
export declare class EventEmitter<Events extends EventMap = Record<string, any[]>> {
    private _events;
    /**
     * 注册事件监听器。
     *
     * @param event 事件名
     * @param fn 回调函数或 handleEvent 对象
     * @param context 回调执行时的 this 上下文
     */
    on<K extends keyof Events & string>(event: K, fn: Listener<Events[K]>, context?: any): this;
    /**
     * 注册一次性事件监听器（触发后自动移除）。
     */
    once<K extends keyof Events & string>(event: K, fn: Listener<Events[K]>, context?: any): this;
    /**
     * 移除事件监听器。
     *
     * @param event 事件名，不传则移除所有事件
     * @param fn 指定回调，不传则移除该事件下全部监听器
     * @param context 指定上下文（需与注册时一致才匹配）
     * @param once 是否只移除 once 监听器
     */
    off<K extends keyof Events & string>(event?: K, fn?: Listener<Events[K]>, context?: any, once?: boolean): this;
    /**
     * 触发事件。
     *
     * @param event 事件名
     * @param args 传递给监听器的参数
     * @returns 是否有监听器被调用
     */
    emit<K extends keyof Events & string>(event: K, ...args: Events[K]): boolean;
    /**
     * 获取指定事件的所有监听器列表。
     */
    listeners<K extends keyof Events & string>(event: K): ListenerFn<Events[K]>[];
    /**
     * 指定事件是否有监听器。
     * 不传 event 则检查是否有任意监听器。
     */
    hasListeners<K extends keyof Events & string>(event?: K): boolean;
    /**
     * 移除所有监听器。不传 event 则移除所有事件，传 event 则只移除该事件。
     */
    removeAllListeners<K extends keyof Events & string>(event?: K): this;
    /**
     * 获取指定事件的监听器数量。
     */
    listenerCount<K extends keyof Events & string>(event: K): number;
    /**
     * 获取所有已注册的事件名。
     */
    eventNames(): (keyof Events & string)[];
    private _addListener;
    private _invoke;
}
export {};
