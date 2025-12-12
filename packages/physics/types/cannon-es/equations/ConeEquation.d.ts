import { Vec3 } from '../math/Vec3';
import { Equation } from '../equations/Equation';
import { Body } from '../objects/Body';
export type ConeEquationOptions = ConstructorParameters<typeof ConeEquation>[2];
/**
 * Cone equation. Works to keep the given body world vectors aligned, or tilted within a given angle from each other.
 */
export declare class ConeEquation extends Equation {
    /**
     * Local axis in A
     */
    axisA: Vec3;
    /**
     * Local axis in B
     */
    axisB: Vec3;
    /**
     * The "cone angle" to keep
     */
    angle: number;
    constructor(bodyA: Body, bodyB: Body, options?: {
        /**
         * @default 1e6
         */
        maxForce?: number;
        axisA?: Vec3;
        axisB?: Vec3;
        angle?: number;
    });
    computeB(h: number): number;
}
