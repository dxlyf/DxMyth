import type { EventHandle, EventMap, IEventEmitter } from "src/interface/IEventEmitter";


/**
 * 事件发射器类
 * 用于实现事件的发布-订阅模式
 */
export class EventEmitter<Events extends EventMap> implements IEventEmitter<Events> {
  // 存储事件监听器的映射
  private readonly events: Map<string, Set<any>> = new Map();

  /**
   * 注册事件监听器
   * @param event 事件名称
   * @param listener 事件监听器函数
   * @returns 当前实例，支持链式调用
   */
  on<EventName extends Extract<keyof Events,string>>(event: EventName, listener: (...args: Events[EventName]) => void): this {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(listener);
    return this;
  }

  /**
   * 注册一次性事件监听器
   * @param event 事件名称
   * @param listener 事件监听器函数
   * @returns 当前实例，支持链式调用
   */
  once<EventName extends Extract<keyof Events,string>>(event: EventName, listener: (...args: Events[EventName]) => void): this {
    const onceListener = (...args: Events[EventName]) => {
      listener(...args);
      this.off(event, onceListener);
    };
    return this.on(event, onceListener);
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param listener 事件监听器函数
   * @returns 当前实例，支持链式调用
   */
  off<EventName extends Extract<keyof Events,string>>(event: EventName, listener?: (...args: Events[EventName]) => void): this {
    const listeners = this.events.get(event);
    if (listeners) {
      // 移除监听器本身或其原始监听器（对于 once 注册的监听器）
      if(listener){
        listeners.forEach((l) => {
          if (l === listener) {
            listeners.delete(l);
          }
        });
      }
      // 如果事件没有监听器了，删除事件
      if (listeners.size === 0||!listener) {
        this.events.delete(event);
      }
    }
    return this;
  }

  /**
   * 移除指定事件的所有监听器
   * @param event 事件名称
   * @returns 当前实例，支持链式调用
   */
  removeAllListeners<EventName extends Extract<keyof Events,string>>(event?: EventName): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }

  /**
   * 获取指定事件的监听器数量
   * @param event 事件名称
   * @returns 监听器数量
   */
  listenerCount<EventName extends Extract<keyof Events,string>>(event: EventName): number {
    return this.events.get(event)?.size || 0;
  }

  /**
   * 获取指定事件的所有监听器
   * @param event 事件名称
   * @returns 监听器数组
   */
  listeners<EventName extends Extract<keyof Events,string>>(event: EventName): EventHandle<Events[EventName]>[] {
    return Array.from(this.events.get(event) || []);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   * @returns 当前实例，支持链式调用
   */
  emit<EventName extends Extract<keyof Events,string>>(event: EventName, ...args: Events[EventName]): this {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach(listener => {
          listener(...args);
      });
    }
    return this;
  }

  /**
   * 获取所有已注册的事件名称
   * @returns 事件名称数组
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

