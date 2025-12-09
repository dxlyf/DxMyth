import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
/**
 * A plane, facing in the Z direction. The plane has its surface at z=0 and everything below z=0 is assumed to be solid plane. To make the plane face in some other direction than z, you must put it inside a Body and rotate that body. See the demos.
 * @example
 *     const planeShape = new CANNON.Plane()
 *     const planeBody = new CANNON.Body({ mass: 0, shape:  planeShape })
 *     planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
 *     world.addBody(planeBody)
 */
export declare class Plane extends Shape {
    /** worldNormal */
    worldNormal: Vec3;
    /** worldNormalNeedsUpdate */
    worldNormalNeedsUpdate: boolean;
    boundingSphereRadius: number;
    constructor();
    /** computeWorldNormal */
    computeWorldNormal(quat: Quaternion): void;
    calculateLocalInertia(mass: number, target?: Vec3): Vec3;
    volume(): number;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
    updateBoundingSphereRadius(): void;
}
