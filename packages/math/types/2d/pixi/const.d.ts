/**
 * The line cap styles for strokes.
 *
 * It can be:
 * - `butt`: The ends of the stroke are squared off at the endpoints.
 * - `round`: The ends of the stroke are rounded.
 * @category scene
 * @standard
 */
export type LineCap = 'butt' | 'round' | 'square';
/**
 * The line join styles for strokes.
 *
 * It can be:
 * - `round`: The corners of the stroke are rounded.
 * - `bevel`: The corners of the stroke are squared off.
 * - `miter`: The corners of the stroke are extended to meet at a point.
 * @category scene
 * @standard
 */
export type LineJoin = 'round' | 'bevel' | 'miter';
/** @internal */
export declare const closePointEps = 0.0001;
/** @internal */
export declare const curveEps = 0.0001;
/**
 * Two Pi.
 * @static
 * @member {number}
 * @memberof PIXI
 */
export declare const PI_2: number;
/**
 * Conversion factor for converting radians to degrees.
 * @static
 * @member {number} RAD_TO_DEG
 * @memberof PIXI
 */
export declare const RAD_TO_DEG: number;
/**
 * Conversion factor for converting degrees to radians.
 * @static
 * @member {number}
 * @memberof PIXI
 */
export declare const DEG_TO_RAD: number;
/**
 * Constants that identify shapes, mainly to prevent `instanceof` calls.
 * @static
 * @memberof PIXI
 * @enum {number}
 */
export declare enum SHAPES {
    /**
     * @property {number} RECT Rectangle
     * @default 0
     */
    POLY = 0,
    /**
     * @property {number} POLY Polygon
     * @default 1
     */
    RECT = 1,
    /**
     * @property {number} CIRC Circle
     * @default 2
     */
    CIRC = 2,
    /**
     * @property {number} ELIP Ellipse
     * @default 3
     */
    ELIP = 3,
    /**
     * @property {number} RREC Rounded Rectangle
     * @default 4
     */
    RREC = 4
}
