import { NodeEvent } from './EventTarget';
import { EventEmitter } from './EventEmitter';
import { Point } from '../math/Point';
import { CachePool } from '../math/CachePool';
export declare class PointerEvent<T = string, D = any> extends NodeEvent<T, D> {
    static pool: CachePool<PointerEvent<string, {}>, []>;
    downPoint: Point;
    point: Point;
    offsetPoint: Point;
    deltaPoint: Point;
    constructor(type: T, data: D);
    reset(): void;
    copy(target: PointerEvent<any, any>): void;
    copyPointerData(target: PointerEvent<any, any>): void;
    clone(): PointerEvent<string, {}>;
}
export type PointerEventSystemOptions = {
    target: HTMLElement;
    screenToWorld: (out: Point, x: number, y: number, element: HTMLElement) => Point;
    hitTest: (x: number, y: number) => any | null;
    /** 拖拽触发阈值（像素），移动超过此距离才触发 dragstart，默认 4 */
    dragThreshold?: number;
    /** 双击间隔（毫秒），两次 click 在此间隔内触发 dblclick，默认 300 */
    dblclickInterval?: number;
    /** 自定义需要绑定的原生事件映射，key 为内部事件名，value 为原生 DOM 事件类型 */
    pointerEvents?: Record<string, string>;
};
export type PointerEventsMaps = {
    pointerdown: [e: PointerEvent];
    pointermove: [e: PointerEvent];
    pointerup: [e: PointerEvent];
    pointerleave: [e: PointerEvent];
    pointerenter: [e: PointerEvent];
    wheel: [e: PointerEvent];
    click: [e: PointerEvent];
    dblclick: [e: PointerEvent];
    dragstart: [e: PointerEvent];
    drag: [e: PointerEvent];
    dragend: [e: PointerEvent];
    dragenter: [e: PointerEvent];
    dragleave: [e: PointerEvent];
    dragover: [e: PointerEvent];
    drop: [e: PointerEvent];
};
export declare class PointerEventSystem extends EventEmitter<PointerEventsMaps> {
    options: PointerEventSystemOptions;
    handlers: Map<string, any>;
    private _dragThresholdSq;
    private _dblclickInterval;
    _lastPoint: Point;
    _downPoint: Point;
    _isPointerDown: boolean;
    _isDragging: boolean;
    private _lastClickTime;
    private _lastClickPoint;
    _hoverTarget: any;
    _downTarget: any;
    _dragHoverTarget: any;
    constructor(options: PointerEventSystemOptions);
    private _getPointerEvents;
    attachEvents(): void;
    detachEvents(): void;
    createEvent(type: string, nativeEvent: any): PointerEvent;
    onPointerEvent(eventType: string, e: globalThis.PointerEvent): void;
}
