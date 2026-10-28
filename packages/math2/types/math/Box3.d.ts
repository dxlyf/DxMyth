import { Matrix4 } from './Matrix4';
import { Sphere } from './Sphere';
import { Vector3 } from './Vector3';
/** Axis-aligned bounding box in 3D. */
export declare class Box3 {
    readonly min: Vector3;
    readonly max: Vector3;
    constructor(min?: Vector3, max?: Vector3);
    set(min: Readonly<Vector3>, max: Readonly<Vector3>): this;
    setFromCenterAndSize(center: Readonly<Vector3>, size: Readonly<Vector3>): this;
    makeEmpty(): this;
    isEmpty(): boolean;
    copy(box: Readonly<Box3>): this;
    clone(): Box3;
    setFromPoints(points: readonly Readonly<Vector3>[]): this;
    getCenter(out?: Vector3): Vector3;
    getSize(out?: Vector3): Vector3;
    getBoundingSphere(out?: Sphere): Sphere;
    expandByPoint(p: Readonly<Vector3>): this;
    expandByScalar(s: number): this;
    expandByBox(box: Readonly<Box3>): this;
    containsPoint(p: Readonly<Vector3>): boolean;
    containsBox(box: Readonly<Box3>): boolean;
    intersectsBox(box: Readonly<Box3>): boolean;
    intersectsSphere(sphere: Readonly<Sphere>): boolean;
    distanceToPoint(p: Readonly<Vector3>): number;
    clampPoint(p: Readonly<Vector3>, out?: Vector3): Vector3;
    union(box: Readonly<Box3>): this;
    intersection(box: Readonly<Box3>): this;
    applyMatrix4(m: Readonly<Matrix4>): this;
    translate(offset: Readonly<Vector3>): this;
    equals(box: Readonly<Box3>, epsilon?: number): boolean;
    static readonly EMPTY: Readonly<Box3>;
}
