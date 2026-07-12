
/** 节点事件实现，包含事件冒泡/捕获的生命周期控制 */
class NodeEvent<T = string, D = any> {
    /**
     * 创建事件实例的工厂方法
     * @param type 事件类型
     * @param data 事件数据
     */
    static create<T = string, D = any>(type: T, data: D) {
        return new NodeEvent<T, D>(type, data)
    }
    /** 事件类型 */
    type: T;
    /** 委托事件类型（当通过事件委托触发时，记录原始事件类型） */
    delegateType?: string;
    /** 事件携带的自定义数据 */
    data: D;
    /** 事件触发的原始目标节点 */
    target: any;
    /** 当前正在处理事件的节点（事件传播过程中的当前节点） */
    currentTarget: any;
    /** 原生 DOM 事件引用 */
    nativeEvent: Event;
    /** 是否已调用 preventDefault */
    defaultPrevented: boolean = false;
    /** 是否停止冒泡（不影响同级的其他监听器） */
    cancelBubble: boolean = false;
    /** 是否立即停止传播（连当前节点剩余的监听器也不再执行） */
    immediateCancelBubble: boolean = false;

    constructor(type: T, data: D) {
        this.type = type;
        this.data = data;
        this.target = null;
        this.currentTarget = null;
        this.nativeEvent = null as any;
    }

    /** 停止事件传播（后续节点不再收到事件） */
    stopPropagation(): void {
        this.cancelBubble = true;
    }

    /** 立即停止事件传播（当前节点剩余监听器也不再执行） */
    stopImmediatePropagation(): void {
        this.immediateCancelBubble = true;
    }

    /** 阻止默认行为 */
    preventDefault(): void {
        this.defaultPrevented = true;
    }

    /**
     * 获取事件传播路径（从 target 到根节点的节点链）
     * 用于事件捕获和冒泡阶段的遍历
     */
    composedPath(): EventTarget[] {
        let current = this.target as EventTarget
        let path: EventTarget[] = []
        while (current) {
            path.push(current)
            current = current.parent
        }
        return path
    }
}
export interface NodeEventListener<D> {
    (evt: D): void;
}

export interface NodeEventListenerObject<D> {
    handleEvent(evt: D): void;
}
export type EventCallbackOrObject<D> = NodeEventListener<D> | NodeEventListenerObject<D>

interface EventListenerOptions {
    capture?: boolean;
}

interface AddEventListenerOptions extends EventListenerOptions {
    once?: boolean;
    passive?: boolean;
    signal?: AbortSignal;
}
export interface IEventTarget<EventListeners extends Record<string, any> = Record<string, any>> {
    addEventListener<K extends Extract<keyof EventListeners, string>>(
        type: K,
        handler: EventCallbackOrObject<EventListeners[K]>,
        options?: AddEventListenerOptions|boolean
    ): void
    removeEventListener<K extends Extract<keyof EventListeners, string>>(
        type: K,
        handler?: EventCallbackOrObject<EventListeners[K]>,
        options?: AddEventListenerOptions|boolean
    ): void
}
/** 事件目标实现，提供完整的事件系统（捕获 → 冒泡） */
class EventTarget<EventListeners extends Record<string, any> = Record<string, any>> {
    /** NodeEvent 类引用，方便外部创建事件 */
    static readonly NodeEvent = NodeEvent
    /** 事件监听器存储，key 格式为 "type"（冒泡）或 "type_capture"（捕获） */
    listeners: Map<string, EventCallbackOrObject<any>[]> = new Map();
    /** 父级事件目标，用于事件冒泡 */
    declare parent?: EventTarget<EventListeners> | null;

    /**
     * 注册事件监听器
     * @param type 事件类型
     * @param handler 事件处理函数或对象
     * @param options 布尔值表示是否捕获阶段，对象可配置 capture/once
     */
    addEventListener<K extends Extract<keyof EventListeners, string>>(
        type: K,
        handler: EventCallbackOrObject<EventListeners[K]>,
        options?: AddEventListenerOptions|boolean
    ): void {
        const key = this._resolveKey(type, options);
        const list = this.listeners.get(key);
        if (typeof options === 'object' && options.once) {
            let original = handler
            handler = ((e: any) => {
                this._invokeHandler(original, e)
                this.removeEventListener(type as any, handler, options)
            }) as any
        }
        if (list) {
            if (!list.includes(handler)) {
                list.push(handler);
            }
        } else {
            this.listeners.set(key, [handler]);
        }
    }

    /** addEventListener 的别名 */
    on<K extends Extract<keyof EventListeners, string>>(
        type: K,
        handler: EventCallbackOrObject<EventListeners[K]>,
        options?: AddEventListenerOptions|boolean
    ): void {
        this.addEventListener(type, handler, options);
    }

    /**
     * 移除事件监听器
     * @param type 事件类型
     * @param handler 不传则移除该类型下所有监听器
     * @param options 与注册时一致的配置
     */
    removeEventListener<K extends Extract<keyof EventListeners, string>>(
        type: K,
        handler?: EventCallbackOrObject<EventListeners[K]>,
        options?: AddEventListenerOptions|boolean
    ): void {
        const key = this._resolveKey(type, options);
        if (!handler) {
            this.listeners.delete(key);
            return;
        }
        const list = this.listeners.get(key);
        if (!list) return;
        const newList = list.filter((h) => h !== handler);
        if (newList.length !== list.length) {
            this.listeners.set(key, newList);
        }
        if (newList.length === 0) {
            this.listeners.delete(key);
        }
    }

    /** removeEventListener 的别名 */
    off<K extends Extract<keyof EventListeners, string>>(
        type: K,
        handler?: EventCallbackOrObject<EventListeners[K]>,
        options?: AddEventListenerOptions|boolean
    ): void {
        this.removeEventListener(type, handler, options);
    }

    /**
     * 派发事件，沿节点路径依次触发事件：
     * 1. 捕获阶段：从父节点到目标节点  2. 冒泡阶段：从目标节点到父节点
     * @param e 事件对象
     */
    dispatchEvent<K extends Extract<keyof EventListeners, string>>(e: NodeEvent<K, EventListeners[K]>): void {
        const captureKey = this._makeKey(e.type as string, true);
        const bubbleKey = this._makeKey(e.type as string, false);
        e.target = this
        const nodePath = e.composedPath()
        // 捕获阶段：从根节点向目标节点遍历
        for (let i = nodePath.length - 1; i >= 0; i--) {
            const node = nodePath[i]
            e.currentTarget = node
            const listeners = node.listeners.get(captureKey);
            if (listeners) {
                for (const handler of listeners) {
                    if (e.immediateCancelBubble) break
                    this._invokeHandler(handler, e);
                }
            }
            if (e.cancelBubble) break
        }

        // 冒泡阶段：从目标节点向根节点遍历
        if (!e.cancelBubble) {
            for (let i = 0, len = nodePath.length; i < len; i++) {
                const node = nodePath[i]
                e.currentTarget = node
                const listeners = node.listeners.get(bubbleKey);
                if (listeners) {
                    for (const handler of listeners) {
                        if (e.immediateCancelBubble) break
                        this._invokeHandler(handler, e);
                    }
                }
                if (e.cancelBubble) break
            }
        }
    }

    /**
     * 快捷触发事件（自动创建事件对象）
     * @param type 事件类型
     * @param data 事件数据
     */
    emit<K extends Extract<keyof EventListeners, string>>(type: K, data?: EventListeners[K]): void {
        const event = new NodeEvent<K, EventListeners[K]>(type, data);
        this.dispatchEvent(event);
    }

    /** 移除当前节点上所有事件监听器 */
    removeAllListeners(): void {
        this.listeners.clear();
    }

    /**
     * 获取指定事件类型的所有监听器（包含捕获和冒泡）
     * @param type 事件类型
     */
    getEventListeners<K extends Extract<keyof EventListeners, string>>(type: K): EventCallbackOrObject<EventListeners[K]>[] {
        const captureKey = this._makeKey(type as string, true);
        const bubbleKey = this._makeKey(type as string, false);
        const capture = (this.listeners.get(captureKey) || []) as EventCallbackOrObject<EventListeners[K]>[];
        const bubble = (this.listeners.get(bubbleKey) || []) as EventCallbackOrObject<EventListeners[K]>[];
        return [...capture, ...bubble];
    }

    /** 生成事件存储 key：捕获阶段追加 "_capture" 后缀 */
    private _makeKey(type: string, capture: boolean): string {
        return capture ? `${type}_capture` : type;
    }

    /** 解析 options 参数，确定是捕获还是冒泡 */
    private _resolveKey(type: string, options?: AddEventListenerOptions|boolean): string {
        let capture = false;
        if (typeof options === 'boolean') {
            capture = options;
        } else if (options?.capture) {
            capture = true;
        }
        return this._makeKey(type, capture);
    }

    /** 执行监听器（兼容函数和 handleEvent 对象两种形式） */
    private _invokeHandler(handler: EventCallbackOrObject<any>, event: NodeEvent<any, any>): void {
        if (typeof handler === 'function') {
            handler(event);
        } else {
            handler.handleEvent(event);
        }
    }
}

export { NodeEvent, EventTarget };
