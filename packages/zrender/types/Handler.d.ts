import { default as Eventful } from './core/Eventful';
import { default as Displayable } from './graphic/Displayable';
import { PainterBase } from './PainterBase';
import { HandlerProxyInterface } from './dom/HandlerProxy';
import { ZRRawEvent, ElementEventName } from './core/types';
import { default as Storage } from './Storage';
import { default as Element } from './Element';
declare class HoveredResult {
    x: number;
    y: number;
    target: Displayable;
    topTarget: Displayable;
    constructor(x?: number, y?: number);
}
type HandlerName = 'click' | 'dblclick' | 'mousewheel' | 'mouseout' | 'mouseup' | 'mousedown' | 'mousemove' | 'contextmenu';
declare class Handler extends Eventful {
    storage: Storage;
    painter: PainterBase;
    painterRoot: HTMLElement;
    proxy: HandlerProxyInterface;
    private _hovered;
    private _gestureMgr;
    private _draggingMgr;
    private _pointerSize;
    _downEl: Element;
    _upEl: Element;
    _downPoint: [number, number];
    constructor(storage: Storage, painter: PainterBase, proxy: HandlerProxyInterface, painterRoot: HTMLElement, pointerSize: number);
    setHandlerProxy(proxy: HandlerProxyInterface): void;
    mousemove(event: ZRRawEvent): void;
    mouseout(event: ZRRawEvent): void;
    /**
     * Resize
     */
    resize(): void;
    /**
     * Dispatch event
     */
    dispatch(eventName: HandlerName, eventArgs?: any): void;
    /**
     * Dispose
     */
    dispose(): void;
    /**
     * 设置默认的cursor style
     * @param cursorStyle 例如 crosshair，默认为 'default'
     */
    setCursorStyle(cursorStyle: string): void;
    /**
     * 事件分发代理
     *
     * @private
     * @param {Object} targetInfo {target, topTarget} 目标图形元素
     * @param {string} eventName 事件名称
     * @param {Object} event 事件对象
     */
    dispatchToElement(targetInfo: {
        target?: Element;
        topTarget?: Element;
    }, eventName: ElementEventName, event: ZRRawEvent): void;
    findHover(x: number, y: number, exclude?: Displayable): HoveredResult;
    processGesture(event: ZRRawEvent, stage?: 'start' | 'end' | 'change'): void;
    click: (event: ZRRawEvent) => void;
    mousedown: (event: ZRRawEvent) => void;
    mouseup: (event: ZRRawEvent) => void;
    mousewheel: (event: ZRRawEvent) => void;
    dblclick: (event: ZRRawEvent) => void;
    contextmenu: (event: ZRRawEvent) => void;
}
export default Handler;
