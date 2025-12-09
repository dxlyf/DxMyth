import { Equation } from '../equations/Equation';
import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
/**
 * Contact/non-penetration constraint equation
 */
export declare class ContactEquation extends Equation {
    /**
     * "bounciness": u1 = -e*u0
     */
    restitution: number;
    /**
     * World-oriented vector that goes from the center of bi to the contact point.
     */
    ri: Vec3;
    /**
     * World-oriented vector that starts in body j position and goes to the contact point.
     */
    rj: Vec3;
    /**
     * Contact normal, pointing out of body i.
     */
    ni: Vec3;
    constructor(bodyA: Body, bodyB: Body, maxForce?: number);
    computeB(h: number): number;
    /**
     * Get the current relative velocity in the contact point.
     */
    getImpactVelocityAlongNormal(): number;
}
