import { Vector2 } from '../math/vec2';
import { Rect, PointIterator } from './Rect';
export declare class RRectPointIterator extends PointIterator<Vector2> {
    constructor(rrect: RRect, ccw?: boolean, index?: number);
}
type RRectRadii = [Vector2, Vector2, Vector2, Vector2];
declare enum RRectType {
    kEmpty_Type = 0,//!< zero width or height
    kRect_Type = 1,//!< non-zero width and height, and zeroed radii
    kOval_Type = 2,//!< non-zero width and height filled with radii
    kSimple_Type = 3,//!< non-zero width and height with equal radii
    kNinePatch_Type = 4,//!< non-zero width and height with axis-aligned radii
    kComplex_Type = 5,//!< non-zero width and height with arbitrary radii
    kLastType = 5
}
declare enum Corner {
    kUpperLeft_Corner = 0,//!< index of top-left corner radii
    kUpperRight_Corner = 1,//!< index of top-right corner radii
    kLowerRight_Corner = 2,//!< index of bottom-right corner radii
    kLowerLeft_Corner = 3
}
export declare class RRect {
    static default(): RRect;
    static fromRect(r: Rect): RRect;
    static fromOval(oval: Rect): void;
    static kUpperLeft_Corner: Corner;
    static kUpperRight_Corner: Corner;
    static kLowerRight_Corner: Corner;
    static kLowerLeft_Corner: Corner;
    type: RRectType;
    _rect: Rect;
    _radii: RRectRadii;
    radii(index: number): Vector2;
    getType(): RRectType;
    getBounds(): Rect;
    isEmpty(): boolean;
    isOval(): boolean;
    isRect(): boolean;
    resetRadii(): void;
    copyDadii(radii: RRectRadii): void;
    scaleRadii(): boolean;
    initializeRect(rect: Rect): boolean;
    /**
     *
     * @param rect
     * @param radii [topLeft, topRight, bottomRight, bottomLeft]
     */
    setRectRadii(rect: Rect, radii: RRectRadii): void;
    setRect(rect: Rect): this;
    setOval(oval: Rect): void;
    get width(): number;
    get height(): number;
    computeType(): void;
    areRectAndRadiiValid(rect: Rect, radii: RRectRadii): boolean;
    isValid(): boolean;
}
export {};
