import { Emitter4Event } from '@dxyl/utils';
import { IInteractivePointerEvent } from '../../../../../../../../src/types/events/InteractivePointerEvent';
import { Vector2 } from '../math/Vec2';
export declare class InteractivePointerEvent<T = any> extends Emitter4Event<T> implements IInteractivePointerEvent<T> {
    static fromPointerEvent(e: PointerEvent): InteractivePointerEvent<any>;
    nativeEvent: PointerEvent;
    point: import('@dxyl/math/types/2d').Vector2;
    downPoint: import('@dxyl/math/types/2d').Vector2;
    upPoint: import('@dxyl/math/types/2d').Vector2;
    offsetPoint: Vector2;
    deltaPoint: Vector2;
    lastPoint: Vector2;
    constructor(type: string);
}
