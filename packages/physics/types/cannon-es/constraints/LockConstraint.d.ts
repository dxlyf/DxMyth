import { PointToPointConstraint } from '../constraints/PointToPointConstraint';
import { RotationalEquation } from '../equations/RotationalEquation';
import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
import { RotationalMotorEquation } from '../equations/RotationalMotorEquation';
export type LockConstraintOptions = ConstructorParameters<typeof LockConstraint>[2];
/**
 * Lock constraint. Will remove all degrees of freedom between the bodies.
 */
export declare class LockConstraint extends PointToPointConstraint {
    xA: Vec3;
    xB: Vec3;
    yA: Vec3;
    yB: Vec3;
    zA: Vec3;
    zB: Vec3;
    rotationalEquation1: RotationalEquation;
    rotationalEquation2: RotationalEquation;
    rotationalEquation3: RotationalEquation;
    motorEquation?: RotationalMotorEquation;
    constructor(bodyA: Body, bodyB: Body, options?: {
        /**
         * The maximum force that should be applied to constrain the bodies.
         * @default 1e6
         */
        maxForce?: number;
    });
    /**
     * update
     */
    update(): void;
}
