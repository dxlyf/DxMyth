import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
import { RaycastResult } from '../collision/RaycastResult';
import { Shape } from '../shapes/Shape';
import { AABB } from '../collision/AABB';
import { Body } from '../objects/Body';
import { Sphere } from '../shapes/Sphere';
import { Box } from '../shapes/Box';
import { Plane } from '../shapes/Plane';
import { Heightfield } from '../shapes/Heightfield';
import { ConvexPolyhedron } from '../shapes/ConvexPolyhedron';
import { Trimesh } from '../shapes/Trimesh';
import { World } from '../world/World';
/**
 * RAY_MODES
 */
export declare const RAY_MODES: {
    /** CLOSEST */
    readonly CLOSEST: 1;
    /** ANY */
    readonly ANY: 2;
    /** ALL */
    readonly ALL: 4;
};
/**
 * RayMode
 */
export type RayMode = typeof RAY_MODES[keyof typeof RAY_MODES];
/**
 * RayOptions
 */
export type RayOptions = {
    /**
     * from
     */
    from?: Vec3;
    /**
     * to
     */
    to?: Vec3;
    /**
     * mode
     */
    mode?: RayMode;
    /**
     * result
     */
    result?: RaycastResult;
    /**
     * If set to `true`, the ray skips any hits with normal.dot(rayDirection) < 0.
     * @default false
     */
    skipBackfaces?: boolean;
    /**
     * collisionFilterMask
     * @default -1
     */
    collisionFilterMask?: number;
    /**
     * collisionFilterGroup
     * @default -1
     */
    collisionFilterGroup?: number;
    /**
     * Set to `false` if you don't want the Ray to take `collisionResponse` flags into account on bodies and shapes.
     * @default true
     */
    checkCollisionResponse?: boolean;
    /**
     * callback
     */
    callback?: RaycastCallback;
};
export type RaycastCallback = (result: RaycastResult) => void;
/**
 * A line in 3D space that intersects bodies and return points.
 */
export declare class Ray {
    /**
     * from
     */
    from: Vec3;
    /**
     * to
     */
    to: Vec3;
    /**
     * direction
     */
    direction: Vec3;
    /**
     * The precision of the ray. Used when checking parallelity etc.
     * @default 0.0001
     */
    precision: number;
    /**
     * Set to `false` if you don't want the Ray to take `collisionResponse` flags into account on bodies and shapes.
     * @default true
     */
    checkCollisionResponse: boolean;
    /**
     * If set to `true`, the ray skips any hits with normal.dot(rayDirection) < 0.
     * @default false
     */
    skipBackfaces: boolean;
    /**
     * collisionFilterMask
     * @default -1
     */
    collisionFilterMask: number;
    /**
     * collisionFilterGroup
     * @default -1
     */
    collisionFilterGroup: number;
    /**
     * The intersection mode. Should be Ray.ANY, Ray.ALL or Ray.CLOSEST.
     * @default RAY.ANY
     */
    mode: number;
    /**
     * Current result object.
     */
    result: RaycastResult;
    /**
     * Will be set to `true` during intersectWorld() if the ray hit anything.
     */
    hasHit: boolean;
    /**
     * User-provided result callback. Will be used if mode is Ray.ALL.
     */
    callback: RaycastCallback;
    /**
     * CLOSEST
     */
    static CLOSEST: 1;
    /**
     * ANY
     */
    static ANY: 2;
    /**
     * ALL
     */
    static ALL: 4;
    get [Shape.types.SPHERE](): (sphere: Sphere, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape) => void;
    get [Shape.types.PLANE](): (shape: Plane, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape) => void;
    get [Shape.types.BOX](): (box: Box, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape) => void;
    get [Shape.types.CYLINDER](): (shape: ConvexPolyhedron, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape, options?: {
        faceList: number[];
    }) => void;
    get [Shape.types.CONVEXPOLYHEDRON](): (shape: ConvexPolyhedron, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape, options?: {
        faceList: number[];
    }) => void;
    get [Shape.types.HEIGHTFIELD](): (shape: Heightfield, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape) => void;
    get [Shape.types.TRIMESH](): (mesh: Trimesh, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape, options?: {
        faceList?: any[];
    }) => void;
    constructor(from?: Vec3, to?: Vec3);
    /**
     * Do itersection against all bodies in the given World.
     * @return True if the ray hit anything, otherwise false.
     */
    intersectWorld(world: World, options: RayOptions): boolean;
    /**
     * Shoot a ray at a body, get back information about the hit.
     * @deprecated @param result set the result property of the Ray instead.
     */
    intersectBody(body: Body, result?: RaycastResult): void;
    /**
     * Shoot a ray at an array bodies, get back information about the hit.
     * @param bodies An array of Body objects.
     * @deprecated @param result set the result property of the Ray instead.
     *
     */
    intersectBodies(bodies: Body[], result?: RaycastResult): void;
    /**
     * Updates the direction vector.
     */
    private updateDirection;
    private intersectShape;
    _intersectBox(box: Box, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape): void;
    _intersectPlane(shape: Plane, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape): void;
    /**
     * Get the world AABB of the ray.
     */
    getAABB(aabb: AABB): void;
    _intersectHeightfield(shape: Heightfield, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape): void;
    _intersectSphere(sphere: Sphere, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape): void;
    _intersectConvex(shape: ConvexPolyhedron, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape, options?: {
        faceList: number[];
    }): void;
    /**
     * @todo Optimize by transforming the world to local space first.
     * @todo Use Octree lookup
     */
    _intersectTrimesh(mesh: Trimesh, quat: Quaternion, position: Vec3, body: Body, reportedShape: Shape, options?: {
        faceList?: any[];
    }): void;
    /**
     * @return True if the intersections should continue
     */
    private reportIntersection;
    /**
     * As per "Barycentric Technique" as named
     * {@link https://www.blackpawn.com/texts/pointinpoly/default.html here} but without the division
     */
    static pointInTriangle(p: Vec3, a: Vec3, b: Vec3, c: Vec3): boolean;
}
