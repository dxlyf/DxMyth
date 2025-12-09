import { Equation } from '../equations/Equation';
import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
/**
 * Rotational motor constraint. Tries to keep the relative angular velocity of the bodies to a given value.
 */
export declare class RotationalMotorEquation extends Equation {
    /**
     * World oriented rotational axis.
     */
    axisA: Vec3;
    /**
     * World oriented rotational axis.
     */
    axisB: Vec3;
    /**
     * Motor velocity.
     */
    targetVelocity: number;
    constructor(bodyA: Body, bodyB: Body, maxForce?: number);
    computeB(h: number): number;
}
