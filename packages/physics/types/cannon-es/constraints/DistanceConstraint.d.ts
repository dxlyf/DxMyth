import { Constraint } from '../constraints/Constraint';
import { ContactEquation } from '../equations/ContactEquation';
import { Body } from '../objects/Body';
/**
 * Constrains two bodies to be at a constant distance from each others center of mass.
 */
export declare class DistanceConstraint extends Constraint {
    /**
     * The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB
     */
    distance: number;
    distanceEquation: ContactEquation;
    /**
     * @param distance The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB.
     * @param maxForce The maximum force that should be applied to constrain the bodies.
     */
    constructor(bodyA: Body, bodyB: Body, distance?: number, maxForce?: number);
    /**
     * update
     */
    update(): void;
}
