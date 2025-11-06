import { default as Eventful } from '../core/Eventful';
import { VectorArray } from '../core/vector';
import { default as Handler } from '../Handler';
export default class HandlerDomProxy extends Eventful {
    dom: HTMLElement;
    painterRoot: HTMLElement;
    handler: Handler;
    private _localHandlerScope;
    private _globalHandlerScope;
    __lastTouchMoment: Date;
    __pointerCapturing: boolean;
    __mayPointerCapture: VectorArray;
    constructor(dom: HTMLElement, painterRoot: HTMLElement);
    dispose(): void;
    setCursor(cursorStyle: string): void;
    /**
     * See [DRAG_OUTSIDE] in `Handler.js`.
     * @implement
     * @param isPointerCapturing Should never be `null`/`undefined`.
     *        `true`: start to capture pointer if it is not capturing.
     *        `false`: end the capture if it is capturing.
     */
    __togglePointerCapture(isPointerCapturing?: boolean): void;
}
export interface HandlerProxyInterface extends Eventful {
    handler: Handler;
    dispose: () => void;
    setCursor: (cursorStyle?: string) => void;
}
