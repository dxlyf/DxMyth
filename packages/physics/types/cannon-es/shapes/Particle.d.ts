import { Shape } from '../shapes/Shape';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
/**
 * Particle shape.
 * @example
 *     const particleShape = new CANNON.Particle()
 *     const particleBody = new CANNON.Body({ mass: 1, shape: particleShape })
 *     world.addBody(particleBody)
 */
export declare class Particle extends Shape {
    constructor();
    /**
     * calculateLocalInertia
     */
    calculateLocalInertia(mass: number, target?: Vec3): Vec3;
    volume(): number;
    updateBoundingSphereRadius(): void;
    calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
}
