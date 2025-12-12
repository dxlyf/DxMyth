import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
/**
 * Spherical shape
 * @example
 *     const radius = 1
 *     const sphereShape = new CANNON.Sphere(radius)
 *     const sphereBody = new CANNON.Body({ mass: 1, shape: sphereShape })
 *     world.addBody(sphereBody)
 */
export declare class Sphere extends Shape {
    /**
     * The radius of the sphere.
     */
    radius: number;
    /**
     *
     * @param radius The radius of the sphere, a non-negative number.
     */
    constructor(radius: number);
    /** calculateLocalInertia */
    calculateLocalInertia(mass: number, target?: Vec3): Vec3;
    /** volume */
    volume(): number;
    updateBoundingSphereRadius(): void;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
}
