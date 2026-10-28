import { Box3 } from './/Box3';
import { Matrix4 } from './Matrix4';
import { Plane } from './Plane';
import { Sphere } from './Sphere';
import { Vector3 } from './Vector3';
/** Ray with normalized direction. */
export declare class Ray {
    readonly origin: Vector3;
    readonly direction: Vector3;
    constructor(origin?: Vector3, direction?: Vector3);
    set(origin: Readonly<Vector3>, direction: Readonly<Vector3>): this;
    copy(ray: Readonly<Ray>): this;
    clone(): Ray;
    /** Point at distance `t` along the ray. */
    at(t: number, out?: Vector3): Vector3;
    /** Make the ray point from its origin towards `target`. */
    lookAt(target: Readonly<Vector3>): this;
    recast(t: number): this;
    closestPointToPoint(point: Readonly<Vector3>, out?: Vector3): Vector3;
    distanceToPoint(point: Readonly<Vector3>): number;
    distanceSqToPoint(point: Readonly<Vector3>): number;
    intersectsSphere(sphere: Readonly<Sphere>): boolean;
    /** First intersection with a sphere, or null. */
    intersectSphere(sphere: Readonly<Sphere>, out?: Vector3): Vector3 | null;
    intersectPlane(plane: Readonly<Plane>, out?: Vector3): Vector3 | null;
    /** Slab test; returns the entry point or null when the ray misses the box. */
    intersectBox(box: Readonly<Box3>, out?: Vector3): Vector3 | null;
    /** Möller–Trumbore ray/triangle intersection. */
    intersectTriangle(a: Readonly<Vector3>, b: Readonly<Vector3>, c: Readonly<Vector3>, backfaceCulling?: boolean, out?: Vector3): Vector3 | null;
    applyMatrix4(m: Readonly<Matrix4>): this;
    equals(ray: Readonly<Ray>, epsilon?: number): boolean;
}
