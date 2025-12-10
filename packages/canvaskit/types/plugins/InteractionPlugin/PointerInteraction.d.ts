import { EventEmitter } from '../../../../../../../../src/events';
import { Vector2 } from '../../../../../../../../src/math';
export type PointerInteractionEvents = {
    pointerdown: PointerInteractionEvent;
    pointermove: PointerInteractionEvent;
    pointerup: PointerInteractionEvent;
    dragStart: PointerInteractionEvent;
    drag: PointerInteractionEvent;
    dragEnd: PointerInteractionEvent;
    click: PointerInteractionEvent;
    pointerenter: PointerInteractionEvent;
    pointerleave: PointerInteractionEvent;
};
export interface PointerInteractionEvent {
}
export declare class PointerInteractionEvent<E extends Event = PointerEvent> {
    type: string;
    pointerId: number;
    isDown: boolean;
    nativeType: string;
    nativeEvent: E;
    downPoint: Vector2;
    upPoint: Vector2;
    point: Vector2;
    deltaPoint: Vector2;
    offsetPoint: Vector2;
    lastPoint: Vector2;
    target?: any;
    currentTarget?: any;
    x: number;
    y: number;
    cancelable: boolean;
    defaultPrevented: boolean;
    cancelBubble: boolean;
    immediateCancelBubble: boolean;
    constructor();
    reset(): void;
    composedPath(): any[];
    preventDefault(): void;
    stopPropagation(): void;
    stopImmediatePropagation(): void;
}
export type PointerInteractionOptions = {
    domElement: HTMLElement;
    debug?: boolean;
    supportTouch?: boolean;
    animationFrameMove?: boolean;
    emit?: (e: PointerInteractionEvent) => void;
};
export declare class PointerInteraction extends EventEmitter<PointerInteractionEvents> {
    domElement: HTMLElement;
    event: PointerInteractionEvent;
    _bounds: DOMRect | null;
    isDown: boolean;
    isDraging: boolean;
    debug: boolean;
    supportTouch: boolean;
    options: Omit<PointerInteractionOptions, 'domElement'>;
    constructor();
    init(options: PointerInteractionOptions): void;
    unObserverSize(): void;
    attachEvents(): void;
    detachEvents(): void;
    resize(): void;
    get bounds(): DOMRect;
    emit<T extends keyof PointerInteractionEvents>(type: T, e: PointerInteractionEvent): boolean;
    resetHandleState(): void;
    handleClick(): void;
    handlwDown(): void;
    handleMove(): void;
    handleUp(): void;
    animationMoveId: number;
    handleAnimationMove(): void;
    handlePointer(e: PointerEvent): void;
    handleTouch(e: TouchEvent): void;
    dispose(): void;
}
