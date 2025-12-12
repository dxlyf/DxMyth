import { Constraint } from '../constraints/Constraint';
import { ContactEquation } from '../equations/ContactEquation';
import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
/**
 * Connects two bodies at given offset points.
 * @example
 *     const bodyA = new Body({ mass: 1 })
 *     const bodyB = new Body({ mass: 1 })
 *     bodyA.position.set(-1, 0, 0)
 *     bodyB.position.set(1, 0, 0)
 *     bodyA.addShape(shapeA)
 *     bodyB.addShape(shapeB)
 *     world.addBody(bodyA)
 *     world.addBody(bodyB)
 *     const localPivotA = new Vec3(1, 0, 0)
 *     const localPivotB = new Vec3(-1, 0, 0)
 *     const constraint = new PointToPointConstraint(bodyA, localPivotA, bodyB, localPivotB)
 *     world.addConstraint(constraint)
 */
export declare class PointToPointConstraint extends Constraint {
    /**
     * Pivot, defined locally in bodyA.
     */
    pivotA: Vec3;
    /**
     * Pivot, defined locally in bodyB.
     */
    pivotB: Vec3;
    equationX: ContactEquation;
    equationY: ContactEquation;
    equationZ: ContactEquation;
    /**
     * @param pivotA The point relative to the center of mass of bodyA which bodyA is constrained to.
     * @param bodyB Body that will be constrained in a similar way to the same point as bodyA. We will therefore get a link between bodyA and bodyB. If not specified, bodyA will be constrained to a static point.
     * @param pivotB The point relative to the center of mass of bodyB which bodyB is constrained to.
     * @param maxForce The maximum force that should be applied to constrain the bodies.
     */
    constructor(bodyA: Body, pivotA: Vec3, bodyB: Body, pivotB?: Vec3, maxForce?: number);
    update(): void;
}
