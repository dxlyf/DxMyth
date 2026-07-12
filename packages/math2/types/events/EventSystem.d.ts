import { EventTarget } from './EventTarget';
import { Viewport } from '../math/Viewport';
/** 输入模式 */
export type InputType = 'auto' | 'pointer' | 'mouse' | 'touch';
/** 派发到 EventTarget 的事件数据 */
export interface PointerEventData {
    /** 屏幕坐标（CSS 像素，相对 canvas） */
    screenX: number;
    screenY: number;
    /** 世界坐标 */
    worldX: number;
    worldY: number;
    /** 按钮信息（pointer/mouse） */
    button: number;
    /** 触摸点唯一标识 */
    pointerId: number;
    /** 是否触摸设备 */
    isTouch: boolean;
    /** 修饰键 */
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    /** 原生事件 */
    nativeEvent: Event;
    /** 相对上次 move 的位移（仅 move/drag 系列有效） */
    deltaX?: number;
    deltaY?: number;
    /** 相对 dragstart 的累计位移（仅 drag/dragend 有效） */
    totalDeltaX?: number;
    totalDeltaY?: number;
    /** 拖拽源目标（仅 drop/dragenter/dragleave/dragover 有效） */
    dragSource?: EventTarget;
}
/** 支持的事件类型 */
export type PointerEventName = 'pointerdown' | 'pointermove' | 'pointerup' | 'pointerover' | 'pointerout' | 'pointerenter' | 'pointerleave' | 'click' | 'dblclick' | 'dragstart' | 'drag' | 'dragend' | 'dragenter' | 'dragleave' | 'dragover' | 'drop';
type Options = {
    pick: (worldX: number, worldY: number) => EventTarget | null;
    viewport: Viewport;
    domEventTarget: HTMLElement;
};
export declare class EventSystem {
    options: Options;
    /** 当前输入模式 */
    inputType: InputType;
    /** 实际生效的输入类型（auto 解析后） */
    resolvedType: 'pointer' | 'mouse' | 'touch';
    /** 是否已经启动监听 */
    private _started;
    /** DOM 监听目标 */
    private _dom;
    /** 绑定的 DOM 事件处理函数引用（用于解绑） */
    private _handlers;
    /** 当前 hover 的元素链（从目标到根） */
    private _hoverEl;
    /** 当前按下的元素（用于 click 判定） */
    private _pressedTarget;
    /** 按下时的坐标（用于 click 移动阈值） */
    private _pressedX;
    private _pressedY;
    /** 双击间隔阈值（毫秒） */
    dblClickInterval: number;
    /** click 移动阈值（像素） */
    clickMoveThreshold: number;
    /** drag 触发阈值（像素，按下后移动超过此距离才触发 dragstart） */
    dragStartThreshold: number;
    /** 上次 click 时间 */
    private _lastClickTime;
    /** 上次 click 目标 */
    private _lastClickTarget;
    /** 上次 pointermove 的屏幕坐标（用于计算 deltaX/deltaY） */
    private _lastMoveX;
    private _lastMoveY;
    /** 当前是否处于拖拽中 */
    private _dragging;
    /** 拖拽源元素 */
    private _dragSource;
    /** 拖拽按下时的屏幕坐标 */
    private _dragStartX;
    private _dragStartY;
    /** 拖拽按下时的世界坐标 */
    private _dragStartWorldX;
    private _dragStartWorldY;
    /** 按下时是否已移动超过阈值（用于决定是否触发 dragstart） */
    private _dragThresholdMet;
    /** 当前拖拽悬停的元素链（用于 dragenter/leave/over） */
    private _dragHoverEl;
    constructor(options: Options);
    /** 启动事件监听 */
    start(inputType?: InputType): void;
    /** 停止事件监听 */
    stop(): void;
    /** 切换输入模式（运行时） */
    setInputType(inputType: InputType): void;
    /** 自动解析输入类型 */
    private _resolveType;
    /** 挂载 DOM 监听 */
    private _attachListeners;
    private _add;
    private _onPointerDown;
    private _onPointerMove;
    private _onPointerUp;
    private _onPointerLeave;
    private _onMouseDown;
    private _onMouseMove;
    private _onMouseUp;
    private _onMouseLeave;
    private _onTouchStart;
    private _onTouchMove;
    private _onTouchEnd;
    /**
     * 统一事件派发入口
     * @param native 原生事件
     * @param eventName 派发到 EventTarget 的事件名
     * @param button 鼠标按钮
     * @param pointerId 指针/触摸 ID
     * @param isTouch 是否触摸来源
     * @param clientX 屏幕坐标 X（touch 事件需手动传入，因为 e.clientX 是 undefined）
     * @param clientY 屏幕坐标 Y
     */
    private _dispatchPointer;
    /**
     * 处理拖拽中的移动
     * @returns true 表示已作为 drag 处理，不再派发 pointermove
     */
    private _handleDragMove;
    /** 更新拖拽悬停元素，派发 dragenter/leave/over */
    private _updateDragHover;
    /** 处理拖拽结束：派发 drop 到目标，dragend 到源 */
    private _handleDragEnd;
    /** 更新 hover 链，派发 enter/leave/over/out */
    private _updateHover;
    /** 清空 hover 链 */
    private _clearHover;
    /** 派发事件到指定元素（基础坐标版本，复用减少函数数量） */
    private _emitNamedEvent;
    /** 派发事件到指定元素（完整 data 版本，用于 drag 系列） */
    private _emitNamedEventWithData;
    /** click 判定：同一目标 + 移动距离小于阈值 */
    private _tryClick;
}
export {};
