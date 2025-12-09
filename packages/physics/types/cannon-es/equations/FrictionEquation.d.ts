import { Equation } from '../equations/Equation';
import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
/**
 * Constrains the slipping in a contact along a tangent
 */
export declare class FrictionEquation extends Equation {
    ri: Vec3;
    rj: Vec3;
    t: Vec3;
    /**
     * @param slipForce should be +-F_friction = +-mu * F_normal = +-mu * m * g
     */
    constructor(bodyA: Body, bodyB: Body, slipForce: number);
    computeB(h: number): number;
}
