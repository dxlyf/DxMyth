
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
export const closePointEps = 1e-4;
/** @internal */
export const curveEps = 0.0001;

/**
 * Two Pi.
 * @static
 * @member {number}
 * @memberof PIXI
 */
export const PI_2 = Math.PI * 2;

/**
 * Conversion factor for converting radians to degrees.
 * @static
 * @member {number} RAD_TO_DEG
 * @memberof PIXI
 */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Conversion factor for converting degrees to radians.
 * @static
 * @member {number}
 * @memberof PIXI
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Constants that identify shapes, mainly to prevent `instanceof` calls.
 * @static
 * @memberof PIXI
 * @enum {number}
 */
export enum SHAPES
// eslint-disable-next-line @typescript-eslint/indent
{
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
    RREC = 4,
}
