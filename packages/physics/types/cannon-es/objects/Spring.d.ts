import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
export type SpringOptions = ConstructorParameters<typeof Spring>[2];
/**
 * A spring, connecting two bodies.
 * @example
 *     const spring = new Spring(boxBody, sphereBody, {
 *       restLength: 0,
 *       stiffness: 50,
 *       damping: 1,
 *     })
 *
 *     // Compute the force after each step
 *     world.addEventListener('postStep', (event) => {
 *       spring.applyForce()
 *     })
 */
export declare class Spring {
    /**
     * Rest length of the spring. A number > 0.
     * @default 1
     */
    restLength: number;
    /**
     * Stiffness of the spring. A number >= 0.
     * @default 100
     */
    stiffness: number;
    /**
     * Damping of the spring. A number >= 0.
     * @default 1
     */
    damping: number;
    /**
     * First connected body.
     */
    bodyA: Body;
    /**
     * Second connected body.
     */
    bodyB: Body;
    /**
     * Anchor for bodyA in local bodyA coordinates.
     * Where to hook the spring to body A, in local body coordinates.
     * @default new Vec3()
     */
    localAnchorA: Vec3;
    /**
     * Anchor for bodyB in local bodyB coordinates.
     * Where to hook the spring to body B, in local body coordinates.
     * @default new Vec3()
     */
    localAnchorB: Vec3;
    constructor(bodyA: Body, bodyB: Body, options?: {
        /**
         * Rest length of the spring. A number > 0.
         * @default 1
         */
        restLength?: number;
        /**
         * Stiffness of the spring. A number >= 0.
         * @default 100
         */
        stiffness?: number;
        /**
         * Damping of the spring. A number >= 0.
         * @default 1
         */
        damping?: number;
        /**
         * Anchor for bodyA in local bodyA coordinates.
         * Where to hook the spring to body A, in local body coordinates.
         * @default new Vec3()
         */
        localAnchorA?: Vec3;
        /**
         * Anchor for bodyB in local bodyB coordinates.
         * Where to hook the spring to body B, in local body coordinates.
         * @default new Vec3()
         */
        localAnchorB?: Vec3;
        /**
         * Where to hook the spring to body A, in world coordinates.
         */
        worldAnchorA?: Vec3;
        /**
         * Where to hook the spring to body B, in world coordinates.
         */
        worldAnchorB?: Vec3;
    });
    /**
     * Set the anchor point on body A, using world coordinates.
     */
    setWorldAnchorA(worldAnchorA: Vec3): void;
    /**
     * Set the anchor point on body B, using world coordinates.
     */
    setWorldAnchorB(worldAnchorB: Vec3): void;
    /**
     * Get the anchor point on body A, in world coordinates.
     * @param result The vector to store the result in.
     */
    getWorldAnchorA(result: Vec3): void;
    /**
     * Get the anchor point on body B, in world coordinates.
     * @param result The vector to store the result in.
     */
    getWorldAnchorB(result: Vec3): void;
    /**
     * Apply the spring force to the connected bodies.
     */
    applyForce(): void;
}
