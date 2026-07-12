import { Path2D } from './path2d';
import { ICanvasRenderingContext2D, MakeOptional, Prototype } from './types';
/**
 * Enhances CanvasRenderingContext2D with Path2D support for stroke, fill, clip, and isPointInPath methods.
 *
 * This function modifies the prototype of CanvasRenderingContext2D to accept Path2D objects
 * as parameters in addition to the standard path operations. It preserves the original
 * functionality while adding Path2D compatibility.
 *
 * Modified methods:
 * - `fill()`: Can now accept a Path2D object as first parameter
 * - `stroke()`: Can now accept a Path2D object as parameter
 * - `clip()`: Can now accept a Path2D object as first parameter
 * - `isPointInPath()`: Can now accept a Path2D object as first parameter
 *
 * @param CanvasRenderingContext2D - The CanvasRenderingContext2D constructor object to enhance
 *
 * @example
 * ```typescript
 * // Apply Path2D support to canvas context
 * applyPath2DToCanvasRenderingContext(CanvasRenderingContext2D);
 *
 * // Now you can use Path2D objects with canvas methods
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 * const path = new Path2D('M10,10 L50,50 Z');
 *
 * ctx.fill(path); // Fill the Path2D object
 * ctx.stroke(path); // Stroke the Path2D object
 * ctx.clip(path); // Use Path2D object as clipping region
 * const isInside = ctx.isPointInPath(path, 25, 25); // Test point against Path2D
 * ```
 */
export declare function applyPath2DToCanvasRenderingContext(CanvasRenderingContext2D?: Prototype<ICanvasRenderingContext2D>): void;
/**
 * Polyfills the roundRect method on CanvasRenderingContext2D for browsers that don't support it natively.
 *
 * The roundRect method adds a rounded rectangle to the current path. This polyfill ensures
 * compatibility with browsers like Firefox that may not have native roundRect support.
 *
 * @param CanvasRenderingContext2D - The CanvasRenderingContext2D constructor object to polyfill
 *
 * @example
 * ```typescript
 * // Apply roundRect polyfill
 * applyRoundRectToCanvasRenderingContext2D(CanvasRenderingContext2D);
 *
 * // Now roundRect is available even in unsupported browsers
 * const canvas = document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 * ctx.roundRect(10, 10, 100, 50, 10); // Works in all browsers
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect} MDN roundRect Documentation
 */
export declare function applyRoundRectToCanvasRenderingContext2D(CanvasRenderingContext2D?: Prototype<MakeOptional<ICanvasRenderingContext2D, "roundRect">>): void;
/**
 * Polyfills the roundRect method on Path2D for browsers that don't support it natively.
 *
 * The roundRect method adds a rounded rectangle to a Path2D object. This polyfill ensures
 * compatibility with browsers that may not have native roundRect support on Path2D objects.
 *
 * @param P2D - The Path2D constructor object to polyfill
 *
 * @example
 * ```typescript
 * // Apply roundRect polyfill to Path2D
 * applyRoundRectToPath2D(Path2D);
 *
 * // Now roundRect is available on Path2D objects
 * const path = new Path2D();
 * path.roundRect(10, 10, 100, 50, [10, 20]); // Works in all browsers
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Path2D} MDN Path2D Documentation
 */
export declare function applyRoundRectToPath2D(P2D?: Prototype<MakeOptional<Path2D, "roundRect">>): void;
