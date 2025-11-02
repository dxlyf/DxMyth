import { EventEmitter } from '../../../../../../../../src/events';
import { IApplication } from '../../../../../../../../src/types/core/Application';
export type EventHandleOptions = {
    domElement: HTMLElement;
    proxyHandler?: EventEmitter;
    handle?: (e: Event) => void;
};
/**
 * 事件处理基类，用于封装原生DOM事件的监听和分发。
 */
export declare abstract class EventHandle<T extends string, E extends Event> extends EventEmitter<T> {
    app: IApplication;
    options: EventHandleOptions;
    _bounds: DOMRect;
    constructor(app: IApplication, options?: EventHandleOptions);
    get domElement(): HTMLElement;
    get proxyHandler(): EventEmitter<string | symbol, any>;
    get bounds(): DOMRect;
    abstract getDomEventNames(): readonly string[];
    mapEvent(e: E): any;
    handle: (e: E) => void;
    attachEvents(): void;
    detachEvents(): void;
    onUpdate(): void;
    onResize(): void;
    destroy(): void;
}
