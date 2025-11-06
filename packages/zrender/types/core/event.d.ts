import { default as Eventful } from './Eventful';
import { ZRRawEvent } from './types';
type FirefoxMouseEvent = {
    layerX: number;
    layerY: number;
};
/**
 * Get the `zrX` and `zrY`, which are relative to the top-left of
 * the input `el`.
 * CSS transform (2D & 3D) is supported.
 *
 * The strategy to fetch the coords:
 * + If `calculate` is not set as `true`, users of this method should
 * ensure that `el` is the same or the same size & location as `e.target`.
 * Otherwise the result coords are probably not expected. Because we
 * firstly try to get coords from e.offsetX/e.offsetY.
 * + If `calculate` is set as `true`, the input `el` can be any element
 * and we force to calculate the coords based on `el`.
 * + The input `el` should be positionable (not position:static).
 *
 * The force `calculate` can be used in case like:
 * When mousemove event triggered on ec tooltip, `e.target` is not `el`(zr painter.dom).
 *
 * @param  el DOM element.
 * @param  e Mouse event or touch event.
 * @param  out Get `out.zrX` and `out.zrY` as the result.
 * @param  calculate Whether to force calculate
 *        the coordinates but not use ones provided by browser.
 */
export declare function clientToLocal(el: HTMLElement, e: ZRRawEvent | FirefoxMouseEvent | Touch, out: {
    zrX?: number;
    zrY?: number;
}, calculate?: boolean): {
    zrX?: number;
    zrY?: number;
};
/**
 * Find native event compat for legency IE.
 * Should be called at the begining of a native event listener.
 *
 * @param e Mouse event or touch event or pointer event.
 *        For lagency IE, we use `window.event` is used.
 * @return The native event.
 */
export declare function getNativeEvent(e: ZRRawEvent): ZRRawEvent;
/**
 * Normalize the coordinates of the input event.
 *
 * Get the `e.zrX` and `e.zrY`, which are relative to the top-left of
 * the input `el`.
 * Get `e.zrDelta` if using mouse wheel.
 * Get `e.which`, see the comment inside this function.
 *
 * Do not calculate repeatly if `zrX` and `zrY` already exist.
 *
 * Notice: see comments in `clientToLocal`. check the relationship
 * between the result coords and the parameters `el` and `calculate`.
 *
 * @param el DOM element.
 * @param e See `getNativeEvent`.
 * @param calculate Whether to force calculate
 *        the coordinates but not use ones provided by browser.
 * @return The normalized native UIEvent.
 */
export declare function normalizeEvent(el: HTMLElement, e: ZRRawEvent, calculate?: boolean): ZRRawEvent;
type AddEventListenerParams = Parameters<typeof HTMLElement.prototype.addEventListener>;
type RemoveEventListenerParams = Parameters<typeof HTMLElement.prototype.removeEventListener>;
/**
 * @param  el
 * @param  name
 * @param  handler
 * @param  opt If boolean, means `opt.capture`
 * @param  opt.capture
 * @param  opt.passive
 */
export declare function addEventListener(el: HTMLElement | HTMLDocument, name: AddEventListenerParams[0], handler: AddEventListenerParams[1], opt?: AddEventListenerParams[2]): void;
/**
 * Parameter are the same as `addEventListener`.
 *
 * Notice that if a listener is registered twice, one with capture and one without,
 * remove each one separately. Removal of a capturing listener does not affect a
 * non-capturing version of the same listener, and vice versa.
 */
export declare function removeEventListener(el: HTMLElement | HTMLDocument, name: RemoveEventListenerParams[0], handler: RemoveEventListenerParams[1], opt: RemoveEventListenerParams[2]): void;
/**
 * preventDefault and stopPropagation.
 * Notice: do not use this method in zrender. It can only be
 * used by upper applications if necessary.
 *
 * @param {Event} e A mouse or touch event.
 */
export declare const stop: (e: MouseEvent | TouchEvent | PointerEvent) => void;
/**
 * This method only works for mouseup and mousedown. The functionality is restricted
 * for fault tolerance, See the `e.which` compatibility above.
 *
 * params can be MouseEvent or ElementEvent
 */
export declare function isMiddleOrRightButtonOnMouseUpDown(e: {
    which: number;
}): boolean;
export { Eventful as Dispatcher };
