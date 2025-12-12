import { Vec2Value } from '../common/Vec2';
import { TransformValue } from '../common/Transform';
export declare enum ManifoldType {
    e_unset = -1,
    e_circles = 0,
    e_faceA = 1,
    e_faceB = 2
}
export declare enum ContactFeatureType {
    e_unset = -1,
    e_vertex = 0,
    e_face = 1
}
/**
 * This is used for determining the state of contact points.
 */
export declare enum PointState {
    /** Point does not exist */
    nullState = 0,
    /** Point was added in the update */
    addState = 1,
    /** Point persisted across the update */
    persistState = 2,
    /** Point was removed in the update */
    removeState = 3
}
/**
 * Used for computing contact manifolds.
 */
export declare class ClipVertex {
    v: Vec2Value;
    id: ContactID;
    set(o: ClipVertex): void;
    recycle(): void;
}
/**
 * A manifold for two touching convex shapes. Manifolds are created in `evaluate`
 * method of Contact subclasses.
 *
 * Supported manifold types are e_faceA or e_faceB for clip point versus plane
 * with radius and e_circles point versus point with radius.
 *
 * We store contacts in this way so that position correction can account for
 * movement, which is critical for continuous physics. All contact scenarios
 * must be expressed in one of these types. This structure is stored across time
 * steps, so we keep it small.
 */
export declare class Manifold {
    type: ManifoldType;
    /**
     * Usage depends on manifold type:
     * - circles: not used
     * - faceA: the normal on polygonA
     * - faceB: the normal on polygonB
     */
    localNormal: Vec2Value;
    /**
     * Usage depends on manifold type:
     * - circles: the local center of circleA
     * - faceA: the center of faceA
     * - faceB: the center of faceB
     */
    localPoint: Vec2Value;
    /** The points of contact */
    points: ManifoldPoint[];
    /** The number of manifold points */
    pointCount: number;
    set(that: Manifold): void;
    recycle(): void;
    /**
     * Evaluate the manifold with supplied transforms. This assumes modest motion
     * from the original state. This does not change the point count, impulses, etc.
     * The radii must come from the shapes that generated the manifold.
     */
    getWorldManifold(wm: WorldManifold | null, xfA: TransformValue, radiusA: number, xfB: TransformValue, radiusB: number): WorldManifold;
    static clipSegmentToLine: typeof clipSegmentToLine;
    static ClipVertex: typeof ClipVertex;
    static getPointStates: typeof getPointStates;
    static PointState: typeof PointState;
}
/**
 * A manifold point is a contact point belonging to a contact manifold. It holds
 * details related to the geometry and dynamics of the contact points.
 *
 * This structure is stored across time steps, so we keep it small.
 *
 * Note: impulses are used for internal caching and may not provide reliable
 * contact forces, especially for high speed collisions.
 */
export declare class ManifoldPoint {
    /**
     * Usage depends on manifold type:
     * - circles: the local center of circleB
     * - faceA: the local center of circleB or the clip point of polygonB
     * - faceB: the clip point of polygonA
     */
    localPoint: Vec2Value;
    /**
     * The non-penetration impulse
     */
    normalImpulse: number;
    /**
     * The friction impulse
     */
    tangentImpulse: number;
    /**
     * Uniquely identifies a contact point between two shapes to facilitate warm starting
     */
    readonly id: ContactID;
    set(that: ManifoldPoint): void;
    recycle(): void;
}
/**
 * Contact ids to facilitate warm starting.
 *
 * ContactFeature: The features that intersect to form the contact point.
 */
export declare class ContactID {
    /**
     * Used to quickly compare contact ids.
     */
    key: number;
    /** ContactFeature index on shapeA */
    indexA: number;
    /** ContactFeature index on shapeB */
    indexB: number;
    /** ContactFeature type on shapeA */
    typeA: ContactFeatureType;
    /** ContactFeature type on shapeB */
    typeB: ContactFeatureType;
    setFeatures(indexA: number, typeA: ContactFeatureType, indexB: number, typeB: ContactFeatureType): void;
    set(that: ContactID): void;
    swapFeatures(): void;
    recycle(): void;
}
/**
 * This is used to compute the current state of a contact manifold.
 */
export declare class WorldManifold {
    /** World vector pointing from A to B */
    normal: Vec2Value;
    /** World contact point (point of intersection) */
    points: Vec2Value[];
    /** A negative value indicates overlap, in meters */
    separations: number[];
    /** The number of manifold points */
    pointCount: number;
    recycle(): void;
}
/**
 * Compute the point states given two manifolds. The states pertain to the
 * transition from manifold1 to manifold2. So state1 is either persist or remove
 * while state2 is either add or persist.
 */
export declare function getPointStates(state1: PointState[], state2: PointState[], manifold1: Manifold, manifold2: Manifold): void;
/**
 * Clipping for contact manifolds. Sutherland-Hodgman clipping.
 */
export declare function clipSegmentToLine(vOut: ClipVertex[], vIn: ClipVertex[], normal: Vec2Value, offset: number, vertexIndexA: number): number;
