import { EventHandle, EventMap, IEventEmitter } from '../interface/IEventEmitter';
/**
 * 事件发射器类
 * 用于实现事件的发布-订阅模式
 */
export declare class EventEmitter<Events extends EventMap> implements IEventEmitter<Events> {
    private readonly events;
    /**
     * 注册事件监听器
     * @param event 事件名称
     * @param listener 事件监听器函数
     * @returns 当前实例，支持链式调用
     */
    on<EventName extends Extract<keyof Events, string>>(event: EventName, listener: (...args: Events[EventName]) => void): this;
    /**
     * 注册一次性事件监听器
     * @param event 事件名称
     * @param listener 事件监听器函数
     * @returns 当前实例，支持链式调用
     */
    once<EventName extends Extract<keyof Events, string>>(event: EventName, listener: (...args: Events[EventName]) => void): this;
    /**
     * 移除事件监听器
     * @param event 事件名称
     * @param listener 事件监听器函数
     * @returns 当前实例，支持链式调用
     */
    off<EventName extends Extract<keyof Events, string>>(event: EventName, listener?: (...args: Events[EventName]) => void): this;
    /**
     * 移除指定事件的所有监听器
     * @param event 事件名称
     * @returns 当前实例，支持链式调用
     */
    removeAllListeners<EventName extends Extract<keyof Events, string>>(event?: EventName): this;
    /**
     * 获取指定事件的监听器数量
     * @param event 事件名称
     * @returns 监听器数量
     */
    listenerCount<EventName extends Extract<keyof Events, string>>(event: EventName): number;
    /**
     * 获取指定事件的所有监听器
     * @param event 事件名称
     * @returns 监听器数组
     */
    listeners<EventName extends Extract<keyof Events, string>>(event: EventName): EventHandle<Events[EventName]>[];
    /**
     * 触发事件
     * @param event 事件名称
     * @param args 事件参数
     * @returns 当前实例，支持链式调用
     */
    emit<EventName extends Extract<keyof Events, string>>(event: EventName, ...args: Events[EventName]): this;
    /**
     * 获取所有已注册的事件名称
     * @returns 事件名称数组
     */
    eventNames(): string[];
}
