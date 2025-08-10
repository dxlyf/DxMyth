import { PathBuilder } from './PathBuilder';
export declare function normalizeRectRadii(radii?: number | DOMPointInit | Iterable<number | DOMPointInit>): {
    tl: number;
    tr: number;
    br: number;
    bl: number;
};
/**
 * Adds a rounded rectangle to the current path or canvas context.
 *
 * This function implements the roundRect method that can be used on both Path2D objects
 * and CanvasRenderingContext2D contexts. It supports flexible radius specifications
 * including uniform radii, separate horizontal/vertical radii, and individual corner radii.
 *
 * Radius specification:
 * - Single number: Same radius for all corners
 * - Single DOMPointInit: x for horizontal radius, y for vertical radius (all corners)
 * - Array with 1 element: Same as single value
 * - Array with 2 elements: [horizontal, vertical] radii for all corners
 * - Array with 3 elements: [top-left, top-right/bottom-left, bottom-right]
 * - Array with 4 elements: [top-left, top-right, bottom-right, bottom-left]
 *
 * @param this - The Path2D or CanvasRenderingContext2D object to draw on
 * @param x - The x-coordinate of the rectangle's top-left corner
 * @param y - The y-coordinate of the rectangle's top-left corner
 * @param width - The width of the rectangle
 * @param height - The height of the rectangle
 * @param radii - The corner radii specification (default: 0)
 *
 * @throws {RangeError} When an invalid number of radii are provided (must be 1-4)
 * @throws {RangeError} When any radius value is negative
 * @throws {TypeError} When a radius value is not a number or DOMPointInit
 *
 * @example
 * ```typescript
 * // On a canvas context
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 *
 * // Simple rounded rectangle with uniform radius
 * ctx.roundRect(10, 10, 100, 50, 10);
 *
 * // Different horizontal and vertical radii
 * ctx.roundRect(10, 70, 100, 50, { x: 20, y: 10 });
 *
 * // Individual corner radii
 * ctx.roundRect(10, 130, 100, 50, [5, 10, 15, 20]);
 *
 * // On a Path2D object
 * const path = new Path2D();
 * path.roundRect(10, 10, 100, 50, [10, 20]);
 * ctx.fill(path);
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect} MDN roundRect Documentation
 */
export declare function roundRect(this: PathBuilder | Path2D | CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
