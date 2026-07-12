import { DOMPointInit, ICanvasRenderingContext2D, PathCommand } from './types';
/**
 * Implements the browser's Path2D API for creating and manipulating 2D paths.
 * This class provides methods for building complex paths using lines, curves, arcs, and shapes.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Path2D} MDN Path2D Documentation
 *
 * @example
 * ```typescript
 * // Create a new path
 * const path = new Path2D();
 * path.moveTo(10, 10);
 * path.lineTo(100, 100);
 * path.arc(50, 50, 20, 0, Math.PI * 2);
 *
 * // Create from SVG path string
 * const svgPath = new Path2D("M10,10 L100,100 Z");
 *
 * // Copy existing path
 * const copiedPath = new Path2D(path);
 * ```
 */
export declare class Path2D {
    #private;
    /**
     * Creates a new Path2D object.
     *
     * @param path - Optional path to initialize from. Can be another Path2D object or an SVG path string
     *
     * @example
     * ```typescript
     * // Empty path
     * const path1 = new Path2D();
     *
     * // From SVG path string
     * const path2 = new Path2D("M10,10 L100,100 Z");
     *
     * // Copy from another Path2D
     * const path3 = new Path2D(path1);
     * ```
     */
    constructor(path?: Path2D | string);
    /**
     * Adds a custom command to the path's command list.
     * This is primarily used internally for extending functionality.
     *
     * @param command - The path command to add
     */
    addCustomCommand(command: PathCommand): void;
    /**
     * Adds the commands from another Path2D object to this path.
     *
     * @param path - The Path2D object whose commands should be added to this path
     *
     * @example
     * ```typescript
     * const path1 = new Path2D("M10,10 L20,20");
     * const path2 = new Path2D("L30,30 Z");
     * path1.addPath(path2); // path1 now contains both sets of commands
     * ```
     */
    addPath(path: Path2D): void;
    /**
     * Moves the starting point of a new sub-path to the specified coordinates.
     *
     * @param x - The x-coordinate of the new starting point
     * @param y - The y-coordinate of the new starting point
     *
     * @example
     * ```typescript
     * const path = new Path2D();
     * path.moveTo(10, 10);
     * ```
     */
    moveTo(x: number, y: number): void;
    /**
     * Connects the last point in the current sub-path to the specified coordinates with a straight line.
     *
     * @param x - The x-coordinate of the end point
     * @param y - The y-coordinate of the end point
     *
     * @example
     * ```typescript
     * const path = new Path2D();
     * path.moveTo(10, 10);
     * path.lineTo(100, 100);
     * ```
     */
    lineTo(x: number, y: number): void;
    /**
     * Adds a circular arc to the current path.
     *
     * @param x - The x-coordinate of the arc's center
     * @param y - The y-coordinate of the arc's center
     * @param radius - The arc's radius
     * @param startAngle - The starting angle in radians
     * @param endAngle - The ending angle in radians
     * @param counterclockwise - Whether the arc should be drawn counterclockwise (default: false)
     *
     * @example
     * ```typescript
     * const path = new Path2D();
     * path.arc(50, 50, 25, 0, Math.PI * 2); // Full circle
     * path.arc(100, 100, 30, 0, Math.PI, true); // Half circle, counterclockwise
     * ```
     */
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /**
     * Adds an arc to the current path with the given control points and radius.
     *
     * @param x1 - The x-coordinate of the first control point
     * @param y1 - The y-coordinate of the first control point
     * @param x2 - The x-coordinate of the second control point
     * @param y2 - The y-coordinate of the second control point
     * @param r - The arc's radius
     *
     * @example
     * ```typescript
     * const path = new Path2D();
     * path.moveTo(20, 20);
     * path.arcTo(100, 20, 100, 100, 50);
     * ```
     */
    arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void;
    /**
     * Adds an elliptical arc to the current path.
     *
     * @param x - The x-coordinate of the ellipse's center
     * @param y - The y-coordinate of the ellipse's center
     * @param radiusX - The ellipse's major-axis radius
     * @param radiusY - The ellipse's minor-axis radius
     * @param rotation - The rotation angle of the ellipse in radians
     * @param startAngle - The starting angle in radians
     * @param endAngle - The ending angle in radians
     * @param counterclockwise - Whether the arc should be drawn counterclockwise (default: false)
     *
     * @example
     * ```typescript
     * const path = new Path2D();
     * path.ellipse(50, 50, 30, 20, Math.PI / 4, 0, Math.PI * 2);
     * ```
     */
    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    /**
     * Closes the current sub-path by connecting the last point to the first point with a straight line.
     *
     * @example
     * ```typescript
     * const path = new Path2D();
     * path.moveTo(10, 10);
     * path.lineTo(100, 10);
     * path.lineTo(100, 100);
     * path.closePath(); // Creates a triangle
     * ```
     */
    closePath(): void;
    /**
     * Adds a cubic Bézier curve to the current path.
     *
     * @param cp1x - The x-coordinate of the first control point
     * @param cp1y - The y-coordinate of the first control point
     * @param cp2x - The x-coordinate of the second control point
     * @param cp2y - The y-coordinate of the second control point
     * @param x - The x-coordinate of the end point
     * @param y - The y-coordinate of the end point
     *
     * @example
     * ```typescript
     * const path = new Path2D();
     * path.moveTo(20, 20);
     * path.bezierCurveTo(20, 100, 200, 100, 200, 20);
     * ```
     */
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    /**
     * Adds a quadratic Bézier curve to the current path.
     *
     * @param cpx - The x-coordinate of the control point
     * @param cpy - The y-coordinate of the control point
     * @param x - The x-coordinate of the end point
     * @param y - The y-coordinate of the end point
     *
     * @example
     * ```typescript
     * const path = new Path2D();
     * path.moveTo(20, 20);
     * path.quadraticCurveTo(100, 100, 200, 20);
     * ```
     */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    /**
     * Adds a rectangle to the current path.
     *
     * @param x - The x-coordinate of the rectangle's top-left corner
     * @param y - The y-coordinate of the rectangle's top-left corner
     * @param width - The rectangle's width
     * @param height - The rectangle's height
     *
     * @example
     * ```typescript
     * const path = new Path2D();
     * path.rect(10, 10, 100, 50);
     * ```
     */
    rect(x: number, y: number, width: number, height: number): void;
    /**
     * Adds a rounded rectangle to the current path.
     *
     * @param x - The x-coordinate of the rectangle's top-left corner
     * @param y - The y-coordinate of the rectangle's top-left corner
     * @param w - The rectangle's width
     * @param h - The rectangle's height
     * @param radii - The corner radii. Can be a number, DOMPointInit, or array of up to 4 values
     *
     * @example
     * ```typescript
     * const path = new Path2D();
     * path.roundRect(10, 10, 100, 50, 10); // All corners with radius 10
     * path.roundRect(10, 70, 100, 50, [10, 20]); // Different horizontal/vertical radii
     * path.roundRect(10, 130, 100, 50, [5, 10, 15, 20]); // Each corner different
     * ```
     */
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
    /**
     * Builds the path in a canvas rendering context by executing all stored commands.
     * This method translates the internal path commands into actual canvas drawing operations.
     *
     * @param ctx - The canvas rendering context to draw the path in
     *
     * @internal This method is primarily used internally by the polyfill system
     * to render Path2D objects on contexts that don't natively support them.
     */
    buildPathInCanvas(ctx: ICanvasRenderingContext2D): void;
}
