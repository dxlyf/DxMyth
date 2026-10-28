import { Box3 } from './Box3';
import { Matrix4 } from './Matrix4';
import { Plane } from './Plane';
import { Vector3 } from './Vector3';
/** Bounding sphere. */
export declare class Sphere {
    readonly center: Vector3;
    radius: number;
    constructor(center?: Vector3, radius?: number);
    set(center: Readonly<Vector3>, radius: number): this;
    copy(sphere: Readonly<Sphere>): this;
    clone(): Sphere;
    makeEmpty(): this;
    isEmpty(): boolean;
    setFromPoints(points: readonly Readonly<Vector3>[]): this;
    applyMatrix4(m: Readonly<Matrix4>): this;
    translate(offset: Readonly<Vector3>): this;
    containsPoint(p: Readonly<Vector3>): boolean;
    distanceToPoint(p: Readonly<Vector3>): number;
    intersectsSphere(other: Readonly<Sphere>): boolean;
    intersectsBox(box: Readonly<Box3>): boolean;
    intersectsPlane(plane: Readonly<Plane>): boolean;
    getBoundingBox(out?: Box3): Box3;
    union(sphere: Readonly<Sphere>): this;
    equals(sphere: Readonly<Sphere>, epsilon?: number): boolean;
}
