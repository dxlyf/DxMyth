import { Vec3 } from '../math/Vec3';
import { Ray } from '../collision/Ray';
import { Transform } from '../math/Transform';
import { Quaternion } from '../math/Quaternion';
/**
 * Axis aligned bounding box class.
 */
export declare class AABB {
    /**
     * The lower bound of the bounding box
     */
    lowerBound: Vec3;
    /**
     * The upper bound of the bounding box
     */
    upperBound: Vec3;
    constructor(options?: {
        /**
         * The lower bound of the bounding box
         */
        upperBound?: Vec3;
        /**
         * The upper bound of the bounding box
         */
        lowerBound?: Vec3;
    });
    /**
     * Set the AABB bounds from a set of points.
     * @param points An array of Vec3's.
     * @return The self object
     */
    setFromPoints(points: Vec3[], position?: Vec3, quaternion?: Quaternion, skinSize?: number): AABB;
    /**
     * Copy bounds from an AABB to this AABB
     * @param aabb Source to copy from
     * @return The this object, for chainability
     */
    copy(aabb: AABB): AABB;
    /**
     * Clone an AABB
     */
    clone(): AABB;
    /**
     * Extend this AABB so that it covers the given AABB too.
     */
    extend(aabb: AABB): void;
    /**
     * Returns true if the given AABB overlaps this AABB.
     */
    overlaps(aabb: AABB): boolean;
    volume(): number;
    /**
     * Returns true if the given AABB is fully contained in this AABB.
     */
    contains(aabb: AABB): boolean;
    getCorners(a: Vec3, b: Vec3, c: Vec3, d: Vec3, e: Vec3, f: Vec3, g: Vec3, h: Vec3): void;
    /**
     * Get the representation of an AABB in another frame.
     * @return The "target" AABB object.
     */
    toLocalFrame(frame: Transform, target: AABB): AABB;
    /**
     * Get the representation of an AABB in the global frame.
     * @return The "target" AABB object.
     */
    toWorldFrame(frame: Transform, target: AABB): AABB;
    /**
     * Check if the AABB is hit by a ray.
     */
    overlapsRay(ray: Ray): boolean;
}
