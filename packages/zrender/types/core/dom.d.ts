/**
 * Transform "local coord" from `elFrom` to `elTarget`.
 * "local coord": the coord based on the input `el`. The origin point is at
 *     the position of "left: 0; top: 0;" in the `el`.
 *
 * Support when CSS transform is used.
 *
 * Having the `out` (that is, `[outX, outY]`), we can create an DOM element
 * and set the CSS style as "left: outX; top: outY;" and append it to `elTarge`
 * to locate the element.
 *
 * For example, this code below positions a child of `document.body` on the event
 * point, no matter whether `body` has `margin`/`paddin`/`transfrom`/... :
 * ```js
 * transformLocalCoord(out, container, document.body, event.offsetX, event.offsetY);
 * if (!eqNaN(out[0])) {
 *     // Then locate the tip element on the event point.
 *     var tipEl = document.createElement('div');
 *     tipEl.style.cssText = 'position: absolute; left:' + out[0] + ';top:' + out[1] + ';';
 *     document.body.appendChild(tipEl);
 * }
 * ```
 *
 * Notice: In some env this method is not supported. If called, `out` will be `[NaN, NaN]`.
 *
 * @param {Array.<number>} out [inX: number, inY: number] The output..
 *        If can not transform, `out` will not be modified but return `false`.
 * @param {HTMLElement} elFrom The `[inX, inY]` is based on elFrom.
 * @param {HTMLElement} elTarget The `out` is based on elTarget.
 * @param {number} inX
 * @param {number} inY
 * @return {boolean} Whether transform successfully.
 */
export declare function transformLocalCoord(out: number[], elFrom: HTMLElement, elTarget: HTMLElement, inX: number, inY: number): boolean;
export declare function transformLocalCoordClear(elFrom: HTMLElement, elTarget: HTMLElement): void;
/**
 * Transform between a "viewport coord" and a "local coord".
 * "viewport coord": the coord based on the left-top corner of the viewport
 *     of the browser.
 * "local coord": the coord based on the input `el`. The origin point is at
 *     the position of "left: 0; top: 0;" in the `el`.
 *
 * Support the case when CSS transform is used on el.
 *
 * @param out [inX: number, inY: number] The output. If `inverse: false`,
 *        it represents "local coord", otherwise "vireport coord".
 *        If can not transform, `out` will not be modified but return `false`.
 * @param el The "local coord" is based on the `el`, see comment above.
 * @param inX If `inverse: false`,
 *        it represents "vireport coord", otherwise "local coord".
 * @param inY If `inverse: false`,
 *        it represents "vireport coord", otherwise "local coord".
 * @param inverse
 *        `true`: from "viewport coord" to "local coord".
 *        `false`: from "local coord" to "viewport coord".
 * @return {boolean} Whether transform successfully.
 */
export declare function transformCoordWithViewport(out: number[], el: HTMLElement, inX: number, inY: number, inverse?: boolean): boolean;
export declare function isCanvasEl(el: HTMLElement): el is HTMLCanvasElement;
export declare function encodeHTML(source: string): string;
