import { IDisplayObject } from '../../../../../../../../src/types/core/DisplayObject';
import { EventHandle, EventHandleOptions } from './EventHandle';
import { InteractivePointerEvent } from '../../../../../../../../src/events/InteractivePointerEvent';
import { ExtensionType } from '../../../../../../../../src/extensions';
import { IApplication } from '../../../../../../../../src/types/core/Application';
declare const PointerEvents: readonly ["click", "dblclick", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerenter", "pointerleave", "contextmenu"];
export type PointerEventNames = typeof PointerEvents[number];
declare enum DragState {
    Idle = 0,
    DragStart = 1,
    Dragging = 2,
    DragEnd = 3
}
/**
 * dom 鼠标指针事件处理
*/
export declare class PointerEventHandle extends EventHandle<PointerEventNames, PointerEvent> {
    static extension: ExtensionType;
    pointerEventHandle: PointerEventHandle;
    currentPointerEvent: InteractivePointerEvent;
    dragState: DragState;
    hoverTarget: IDisplayObject | null;
    dragTarget: IDisplayObject | null;
    constructor(app: IApplication, options?: EventHandleOptions);
    onUpdate: () => void;
    getDomEventNames(): readonly string[];
    findHitTarget(x: number, y: number, types?: string[]): IDisplayObject<import('../../../../../../../../src/types/core/DisplayObject').DisplayObjectProps<{}, import('../../../../../../../../src/types/core/DisplayObject').DisplayObjectStyleProps>>;
    handle: (e: PointerEvent) => void;
}
export {};
