import { PointLike } from './Point';
import { default as BoundingRect, BoundingRectIntersectOpt } from './BoundingRect';
import { MatrixArray } from './matrix';
declare class OrientedBoundingRect {
    private _corners;
    private _axes;
    private _origin;
    constructor(rect?: BoundingRect, transform?: MatrixArray);
    fromBoundingRect(rect: BoundingRect, transform?: MatrixArray): void;
    /**
     * If intersect with another OBB.
     *
     * [NOTICE]
     *  Touching the edge is considered an intersection.
     *  zero-width/height can still cause intersection if `touchThreshold` is 0.
     *  See more in `BoundingRectIntersectOpt['touchThreshold']`
     *
     * @param other Bounding rect to be intersected with
     * @param mtv
     *  If it's not overlapped. it means needs to move `other` rect with Maximum Translation Vector to be overlapped.
     *      FIXME: Maximum Translation Vector is buggy. Fix it before using it. See case in `test/obb-collide.html`.
     *  Else it means needs to move `other` rect with Minimum Translation Vector to be not overlapped.
     */
    intersect(other: OrientedBoundingRect, mtv?: PointLike, opt?: BoundingRectIntersectOpt): boolean;
    private _intersectCheckOneSide;
    private _getProjMinMaxOnAxis;
}
export default OrientedBoundingRect;
