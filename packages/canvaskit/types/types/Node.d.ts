import { TransformOptions } from '../../../../../../../src/math/Transform';
import { PointerInteractionEvent } from '../../../../../../../src/plugins/InteractionPlugin/PointerInteraction';
export interface NodeOptions extends TransformOptions {
    visible?: boolean;
    ingore?: boolean;
    silent?: boolean;
    zIndex?: number;
    cache?: boolean;
}
export interface NodeEvents {
    pointerdown: [PointerInteractionEvent];
    pointermove: [PointerInteractionEvent];
    pointerup: [PointerInteractionEvent];
    dragStart: [PointerInteractionEvent];
    drag: [PointerInteractionEvent];
    dragEnd: [PointerInteractionEvent];
    click: [PointerInteractionEvent];
}
