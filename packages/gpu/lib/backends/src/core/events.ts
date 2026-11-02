import type { Disposable } from './types';

/** 事件名到参数元组的映射，例如 `{ resize: [width, height] }`。 */
export type EventMap = Record<string, unknown[]>;

/** 给定参数元组对应的监听器签名。 */
export type EventListener<Args extends unknown[]> = (...args: Args) => void;

type StoredListener = (...args: never[]) => void;

/**
 * 极简的类型化事件发射器。
 *
 * 每次 `on` 都返回 {@link Disposable}，调用方无需持有发射器引用即可解绑。
 */
export class EventEmitter<Events extends Record<keyof Events, unknown[]>> {
  readonly #listeners = new Map<keyof Events, Set<StoredListener>>();

  /** 订阅事件。 */
  on<K extends keyof Events>(type: K, listener: EventListener<Events[K]>): Disposable {
    let listeners = this.#listeners.get(type);
    if (listeners === undefined) {
      listeners = new Set();
      this.#listeners.set(type, listeners);
    }
    listeners.add(listener as unknown as StoredListener);
    return {
      dispose: () => {
        this.off(type, listener);
      },
    };
  }

  /** 只订阅下一次事件，触发后自动解绑。 */
  once<K extends keyof Events>(type: K, listener: EventListener<Events[K]>): Disposable {
    const wrapper: EventListener<Events[K]> = (...args) => {
      this.off(type, wrapper);
      listener(...args);
    };
    this.on(type, wrapper);
    return { dispose: () => this.off(type, wrapper) };
  }

  /** 移除之前注册的监听器。 */
  off<K extends keyof Events>(type: K, listener: EventListener<Events[K]>): void {
    const listeners = this.#listeners.get(type);
    if (listeners === undefined) {
      return;
    }
    listeners.delete(listener as unknown as StoredListener);
    if (listeners.size === 0) {
      this.#listeners.delete(type);
    }
  }

  /** 同步派发事件；派发过程中被移除的监听器仍会执行。 */
  emit<K extends keyof Events>(type: K, ...args: Events[K]): void {
    const listeners = this.#listeners.get(type);
    if (listeners === undefined) {
      return;
    }
    for (const listener of [...listeners]) {
      (listener as unknown as EventListener<Events[K]>)(...args);
    }
  }

  /** 某个事件当前注册的监听器数量。 */
  listenerCount(type: keyof Events): number {
    return this.#listeners.get(type)?.size ?? 0;
  }

  /** 清除某个事件的监听器；省略 `type` 时清除全部。 */
  clear(type?: keyof Events): void {
    if (type === undefined) {
      this.#listeners.clear();
    } else {
      this.#listeners.delete(type);
    }
  }
}
