/**
 * 轻量事件发射器（参考 eventemitter3 实现）。
 *
 * 与 EventTarget（DOM 风格、支持捕获/冒泡、事件对象）不同，
 * EventEmitter 是纯粹的发布订阅模型：
 * - 链式调用（on/once/off/removeAllListeners 返回 this）
 * - 监听器支持自定义 context（默认为 emitter 自身）
 * - once 监听器触发一次后自动移除
 * - 存储优化：单监听器使用对象直接存储，多监听器自动转为数组
 *
 * 用法示例：
 * ```ts
 * const ee = new EventEmitter<{ click: [x: number, y: number] }>();
 * ee.on('click', (x, y) => console.log(x, y));
 * ee.emit('click', 1, 2); // true
 * ```
 */

/** 通用监听函数类型 */
type AnyFn = (...args: any[]) => void;
/** 提取事件 K 的参数元组类型 */
type EventArgs<E, K extends keyof E> = E[K] extends any[] ? E[K] : any[];
/** 事件 K 的监听函数类型 */
type EventListener<E, K extends keyof E> = (...args: EventArgs<E, K>) => void;

/** 单个监听器记录：函数 + 上下文 + 是否一次性 */
class EE {
    fn: AnyFn;
    context: any;
    once: boolean;

    constructor(fn: AnyFn, context: any, once: boolean) {
        this.fn = fn;
        this.context = context;
        this.once = once;
    }
}

class EventEmitter<
    Events extends Record<string, any[]> = Record<string, any[]>
> {
    /** 事件表：key 为事件名，value 为单个 EE 或 EE[]（按监听器数量自动切换） */
    _events: Record<string, EE | EE[]> = Object.create(null) as Record<
        string,
        EE | EE[]
    >;
    /** 已注册事件类型数（用于 eventNames / removeAll 优化） */
    _eventsCount: number = 0;

    /**
     * 注册事件监听器
     * @param event 事件名
     * @param fn 监听函数
     * @param context this 绑定，默认为 emitter 自身
     */
    on<K extends keyof Events>(
        event: K,
        fn: EventListener<Events, K>,
        context?: any
    ): this {
        return this._addListener(event as string, fn as AnyFn, context, false);
    }

    /**
     * 注册一次性监听器，触发一次后自动移除
     */
    once<K extends keyof Events>(
        event: K,
        fn: EventListener<Events, K>,
        context?: any
    ): this {
        return this._addListener(event as string, fn as AnyFn, context, true);
    }

    /**
     * 移除监听器。
     * - 不传 fn：移除该事件的全部监听器
     * - 传 fn：按 fn + context 匹配移除（once 可用于精确定位）
     * @param once 仅匹配 once=true 的监听器
     */
    off<K extends keyof Events>(
        event: K,
        fn?: EventListener<Events, K>,
        context?: any,
        once?: boolean
    ): this {
        return this._removeListener(
            event as string,
            fn as AnyFn | undefined,
            context,
            once
        );
    }

    /**
     * 触发事件，按注册顺序调用监听器。
     * once 监听器触发后会被移除（拷贝快照后调用，避免数组变动问题）。
     * @returns 是否存在监听器
     */
    emit<K extends keyof Events>(event: K, ...args: EventArgs<Events, K>): boolean {
        return this._emit(event as string, args as any[]);
    }

    /**
     * 返回指定事件的监听函数数组（拷贝，修改不影响内部状态）
     */
    listeners<K extends keyof Events>(event: K): EventListener<Events, K>[];
    /**
     * @param exists 传 true 时返回是否存在监听器（boolean）
     */
    listeners<K extends keyof Events>(event: K, exists: true): boolean;
    listeners<K extends keyof Events>(
        event: K,
        exists?: boolean
    ): EventListener<Events, K>[] | boolean {
        return this._listeners(event as string, exists);
    }

    /**
     * 返回监听器数量。
     * - 不传 event：返回所有事件的监听器总数（事件类型数）
     * - 传 event：返回该事件的监听器个数
     */
    listenerCount<K extends keyof Events>(event?: K): number {
        return this._listenerCount(event as string | undefined);
    }

    /** 返回所有已注册监听器的事件名 */
    eventNames(): (keyof Events)[] {
        const names: (keyof Events)[] = [];
        const events = this._events;
        for (const key in events) {
            if (Object.prototype.hasOwnProperty.call(events, key)) {
                names.push(key as keyof Events);
            }
        }
        return names;
    }

    /**
     * 移除监听器。
     * - 不传 event：移除所有事件的全部监听器
     * - 传 event：仅移除该事件的全部监听器
     */
    removeAllListeners<K extends keyof Events>(event?: K): this {
        return this._removeAll(event as string | undefined);
    }

    // ===== API 别名（匹配 eventemitter3 命名） =====

    /** on 别名 */
    addListener<K extends keyof Events>(
        event: K,
        fn: EventListener<Events, K>,
        context?: any
    ): this {
        return this.on(event, fn, context);
    }

    /** once 别名 */
    addOnceListener<K extends keyof Events>(
        event: K,
        fn: EventListener<Events, K>,
        context?: any
    ): this {
        return this.once(event, fn, context);
    }

    /** off 别名 */
    removeListener<K extends keyof Events>(
        event: K,
        fn?: EventListener<Events, K>,
        context?: any,
        once?: boolean
    ): this {
        return this.off(event, fn, context, once);
    }

    // ===== 内部实现 =====

    /** 实际添加监听器：单对象存储 ↔ 数组存储自动切换 */
    private _addListener(
        event: string,
        fn: AnyFn,
        context: any,
        once: boolean
    ): this {
        if (typeof fn !== 'function') {
            throw new TypeError('The listener must be a function');
        }
        const ctx = context ?? this;
        const listener = new EE(fn, ctx, once);
        const events = this._events;
        const existing = events[event];

        if (!existing) {
            // 首次注册：直接存储为单个对象
            events[event] = listener;
            this._eventsCount++;
        } else if (Array.isArray(existing)) {
            // 已是数组：去重后追加（同 fn + 同 context + 同 once 视为重复）
            let exists = false;
            for (let i = 0; i < existing.length; i++) {
                if (
                    existing[i].fn === fn &&
                    existing[i].context === ctx &&
                    existing[i].once === once
                ) {
                    exists = true;
                    break;
                }
            }
            if (!exists) existing.push(listener);
        } else {
            // 当前为单对象：重复则忽略，否则转为数组
            if (
                existing.fn === fn &&
                existing.context === ctx &&
                existing.once === once
            ) {
                return this;
            }
            events[event] = [existing, listener];
        }
        return this;
    }

    /** 实际移除监听器 */
    private _removeListener(
        event: string,
        fn: AnyFn | undefined,
        context: any,
        once?: boolean
    ): this {
        const events = this._events;
        const existing = events[event];
        if (!existing) return this;

        // 未指定 fn：移除整个事件
        if (!fn) {
            this._clearEvent(event);
            return this;
        }

        const ctx = context ?? this;
        let listeners: EE[];
        if (Array.isArray(existing)) {
            listeners = existing;
        } else {
            listeners = [existing];
        }

        // 反向遍历删除匹配项，避免索引错位
        for (let i = listeners.length - 1; i >= 0; i--) {
            const l = listeners[i];
            if (
                l.fn === fn &&
                l.context === ctx &&
                (once === undefined || l.once === once)
            ) {
                listeners.splice(i, 1);
            }
        }

        // 后处理：空 → 删除事件；单元素 → 收缩为单对象存储
        if (listeners.length === 0) {
            this._clearEvent(event);
        } else if (listeners.length === 1 && Array.isArray(existing)) {
            events[event] = listeners[0];
        }
        return this;
    }

    /** 实际派发事件：先快照再调用 */
    private _emit(event: string, args: any[]): boolean {
        const events = this._events;
        const existing = events[event];
        if (!existing) return false;

        // 拷贝一份，防止 once 触发时同步修改原数组导致跳过
        const snapshot: EE[] = Array.isArray(existing)
            ? existing.slice()
            : [existing];

        for (let i = 0; i < snapshot.length; i++) {
            const l = snapshot[i];
            if (l.once) {
                // 触发前移除，避免多次 emit 时重复触发
                this._removeListener(event, l.fn, l.context, true);
            }
            l.fn.apply(l.context, args);
        }
        return true;
    }

    /** 实际获取监听函数列表 / 是否存在 */
    private _listeners(event: string, exists?: boolean): AnyFn[] | boolean {
        const existing = this._events[event];
        if (exists) return !!existing;
        if (!existing) return [];
        if (Array.isArray(existing)) {
            return existing.map((l) => l.fn);
        }
        return [existing.fn];
    }

    /** 实际计算监听器数量 */
    private _listenerCount(event: string | undefined): number {
        if (event === undefined) {
            return this._eventsCount;
        }
        const existing = this._events[event];
        if (!existing) return 0;
        if (Array.isArray(existing)) return existing.length;
        return 1;
    }

    /** 实际批量移除 */
    private _removeAll(event: string | undefined): this {
        if (event === undefined) {
            this._events = Object.create(null) as Record<string, EE | EE[]>;
            this._eventsCount = 0;
        } else if (this._events[event]) {
            this._clearEvent(event);
        }
        return this;
    }

    /** 清空指定事件（_eventsCount 归零时整体重置，回收内存） */
    private _clearEvent(event: string): void {
        if (--this._eventsCount === 0) {
            this._events = Object.create(null) as Record<string, EE | EE[]>;
        } else {
            delete this._events[event];
        }
    }
}

export { EventEmitter };
