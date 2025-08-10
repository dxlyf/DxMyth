import { Matrix2dLike } from '../math/mat2d';
import { default as Point, PointLike } from '../math/point';
import { NullUndefined } from './types';
declare class BoundingRect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    static set<TTarget extends RectLike>(target: TTarget, x: number, y: number, width: number, height: number): TTarget;
    union(other: BoundingRect): void;
    applyTransform(m: Matrix2dLike): void;
    calculateTransform(b: RectLike): Matrix2dLike;
    /**
     * @see `static intersect`
     */
    intersect(b: RectLike, mtv?: PointLike, opt?: BoundingRectIntersectOpt): boolean;
    /**
     * [NOTICE]
     *  Touching the edge is considered an intersection.
     *  zero-width/height can still cause intersection if `touchThreshold` is 0.
     *  See more in `BoundingRectIntersectOpt['touchThreshold']`
     *
     * @param mtv
     *  If it's not overlapped. it means needs to move `b` rect with Maximum Translation Vector to be overlapped.
     *  Else it means needs to move `b` rect with Minimum Translation Vector to be not overlapped.
     */
    static intersect(a: RectLike, b: RectLike, mtv?: PointLike, opt?: BoundingRectIntersectOpt): boolean;
    static contain(rect: RectLike, x: number, y: number): boolean;
    contain(x: number, y: number): boolean;
    clone(): BoundingRect;
    /**
     * Copy from another rect
     */
    copy(other: RectLike): void;
    plain(): RectLike;
    /**
     * If not having NaN or Infinity with attributes
     */
    isFinite(): boolean;
    isZero(): boolean;
    static create(rect: RectLike): BoundingRect;
    static copy<TTarget extends RectLike>(target: TTarget, source: RectLike): TTarget;
    static applyTransform(target: RectLike, source: RectLike, m: Matrix2dLike): void;
}
export type RectLike = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export interface BoundingRectIntersectOpt {
    /**
     * If specified, when overlapping, the output `mtv` is still a minimal vector that can resolve the overlap.
     * However it is not Minimum Translation Vector, but a vector follow the direction.
     * Be a radian, representing a vector direction.
     * `direction=atan2(y, x)`, i.e., `direction=0` is vector(1,0), `direction=PI/4` is vector(1,1).
     */
    direction?: number;
    /**
     * By default `true`. It means whether `BoundingRectIntersectOpt['direction']` is bidirectional. If `true`,
     * the returned mtv is the minimal among both `opt.direction` and `opt.direction + Math.PI`.
     */
    bidirectional?: boolean;
    /**
     * Two rects that touch but are within the threshold do not be considered an intersection.
     * Scenarios:
     *  - Without a `touchThreshold`, zero-width/height can still cause intersection.
     *    In some scenarios, a rect with border styles still needs to display even if width/height is zero;
     *    but in some other scenarios, zero-width/height represents "nothing", such as in HTML
     *    BoundingClientRect, or when zrender.Group has all children `ignored: true`. In this case, we can use
     *    a non-negative `touchThreshold` to form a "minus width/height" and force it to never cause an
     *    intersection. And in this case, mtv will not be calculated.
     *  - Without a `touchThreshold`, touching the edge is considered an intersection.
     *  - Having a `touchThreshold`, elements can use the same rect instance to achieve compact layout while
     *    still passing through the overlap-hiding handler.
     *  - a positive near-zero number is commonly used in `touchThreshold` for aggressive overlap handling,
     *    such as:
     *    - Hide one element if overlapping.
     *    - Two elements are vertically touching at top/bottom edges, but are restricted to move along
     *      the horizontal direction to resolve overlap.
     */
    touchThreshold?: number;
    /**
     * - If an intersection occur, set the intersection rect to it.
     * - Otherwise,
     *   - If `clamp: true`, `outIntersectRect` is set with a clamped rect that is on the edge or corner
     *     of the first rect input to `intersect` method.
     *   - Otherwise, set to all NaN (it will not pass `contain` and `intersect`).
     */
    outIntersectRect?: RectLike;
    clamp?: boolean;
}
/**
 * [CAVEAT] Do not use it other than in `BoundingRect` and `OrientedBoundingRect`.
 */
export declare function createIntersectContext(): {
    minTv: Point;
    maxTv: Point;
    useDir: boolean;
    dirMinTv: Point;
    touchThreshold: BoundingRectIntersectOpt["touchThreshold"];
    bidirectional: BoundingRectIntersectOpt["bidirectional"];
    negativeSize: boolean;
    reset(opt: BoundingRectIntersectOpt | NullUndefined, useMTV: boolean): void;
    calcDirMTV(): void;
};
export default BoundingRect;
