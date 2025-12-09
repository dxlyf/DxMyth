import { Equation } from '../equations/Equation';
import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
export type RotationalEquationOptions = ConstructorParameters<typeof RotationalEquation>[2];
/**
 * Rotational constraint. Works to keep the local vectors orthogonal to each other in world space.
 */
export declare class RotationalEquation extends Equation {
    /**
     * World oriented rotational axis.
     */
    axisA: Vec3;
    /**
     * World oriented rotational axis.
     */
    axisB: Vec3;
    /**
     * maxAngle
     */
    maxAngle: number;
    constructor(bodyA: Body, bodyB: Body, options?: {
        /**
         * World oriented rotational axis.
         */
        axisA?: Vec3;
        /**
         * World oriented rotational axis.
         */
        axisB?: Vec3;
        /**
         * maxAngle
         */
        maxAngle?: number;
        /**
         * @default 1e6
         */
        maxForce?: number;
    });
    computeB(h: number): number;
}
