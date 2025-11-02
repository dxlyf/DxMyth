import { Emitter4Event } from '../../../../../../../../../src/events';
import { Vector2 } from '../../../../../../../../../src/math/Vec2';
export interface IInteractivePointerEvent<T = any> extends Emitter4Event<T> {
    nativeEvent: PointerEvent;
    point: Vector2;
    downPoint: Vector2;
    upPoint: Vector2;
    offsetPoint: Vector2;
    deltaPoint: Vector2;
}
export type InteractivePointerEvents = {
    click: [IInteractivePointerEvent];
    dblclick: [IInteractivePointerEvent];
    pointerdown: [IInteractivePointerEvent];
    pointermove: [IInteractivePointerEvent];
    pointerenter: [IInteractivePointerEvent];
    pointerleave: [IInteractivePointerEvent];
    dragstart: [IInteractivePointerEvent];
    drag: [IInteractivePointerEvent];
    dragend: [IInteractivePointerEvent];
    pointerup: [IInteractivePointerEvent];
};
