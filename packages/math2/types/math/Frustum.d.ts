import { Box3 } from './Box3';
import { Matrix4 } from './Matrix4';
import { Plane } from './Plane';
import { Sphere } from './Sphere';
import { Vector3 } from './Vector3';
/**
 * View frustum represented by six normalized planes.
 * Plane order: left, right, bottom, top, near, far.
 */
export declare class Frustum {
    readonly planes: readonly Plane[];
    constructor();
    /** Extract planes from a view-projection matrix (Gribb-Hartmann method). */
    setFromProjectionMatrix(m: Readonly<Matrix4>): this;
    containsPoint(p: Readonly<Vector3>): boolean;
    intersectsSphere(sphere: Readonly<Sphere>): boolean;
    /** Conservative axis-aligned box test using the plane's positive vertex. */
    intersectsBox(box: Readonly<Box3>): boolean;
    copy(frustum: Readonly<Frustum>): this;
}
