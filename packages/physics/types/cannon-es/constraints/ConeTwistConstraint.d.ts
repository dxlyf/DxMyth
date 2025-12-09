import { PointToPointConstraint } from '../constraints/PointToPointConstraint';
import { ConeEquation } from '../equations/ConeEquation';
import { RotationalEquation } from '../equations/RotationalEquation';
import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
export type ConeTwistConstraintOptions = ConstructorParameters<typeof ConeTwistConstraint>[2];
/**
 * A Cone Twist constraint, useful for ragdolls.
 */
export declare class ConeTwistConstraint extends PointToPointConstraint {
    /**
     * The axis direction for the constraint of the body A.
     */
    axisA: Vec3;
    /**
     * The axis direction for the constraint of the body B.
     */
    axisB: Vec3;
    /**
     * The aperture angle of the cone.
     */
    angle: number;
    /**
     * The twist angle of the joint.
     */
    twistAngle: number;
    coneEquation: ConeEquation;
    twistEquation: RotationalEquation;
    constructor(bodyA: Body, bodyB: Body, options?: {
        /**
         * The pivot point for bodyA.
         */
        pivotA?: Vec3;
        /**
         * The pivot point for bodyB.
         */
        pivotB?: Vec3;
        /**
         * The axis direction for the constraint of the body A.
         */
        axisA?: Vec3;
        /**
         * The axis direction for the constraint of the body B.
         */
        axisB?: Vec3;
        /**
         * The aperture angle of the cone.
         * @default 0
         */
        angle?: number;
        /**
         * The twist angle of the joint.
         * @default 0
         */
        twistAngle?: number;
        /**
         * The maximum force that should be applied to constrain the bodies.
         * @default 1e6
         */
        maxForce?: number;
        /**
         * Wether to collide the connected bodies or not.
         * @default false
         */
        collideConnected?: boolean;
    });
    update(): void;
}
