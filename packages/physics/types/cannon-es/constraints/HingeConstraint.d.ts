import { PointToPointConstraint } from '../constraints/PointToPointConstraint';
import { RotationalEquation } from '../equations/RotationalEquation';
import { RotationalMotorEquation } from '../equations/RotationalMotorEquation';
import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
export type HingeConstraintOptions = ConstructorParameters<typeof HingeConstraint>[2];
/**
 * Hinge constraint. Think of it as a door hinge. It tries to keep the door in the correct place and with the correct orientation.
 */
export declare class HingeConstraint extends PointToPointConstraint {
    /**
     * Rotation axis, defined locally in bodyA.
     */
    axisA: Vec3;
    /**
     * Rotation axis, defined locally in bodyB.
     */
    axisB: Vec3;
    rotationalEquation1: RotationalEquation;
    rotationalEquation2: RotationalEquation;
    motorEquation: RotationalMotorEquation;
    constructor(bodyA: Body, bodyB: Body, options?: {
        /**
         * A point defined locally in bodyA. This defines the offset of axisA.
         */
        pivotA?: Vec3;
        /**
         * A point defined locally in bodyB. This defines the offset of axisB.
         */
        pivotB?: Vec3;
        /**
         * An axis that bodyA can rotate around, defined locally in bodyA.
         */
        axisA?: Vec3;
        /**
         * An axis that bodyB can rotate around, defined locally in bodyB.
         */
        axisB?: Vec3;
        /**
         * Wheter to collide the connected bodies or not.
         * @default false
         */
        collideConnected?: boolean;
        /**
         * The maximum force that should be applied to constrain the bodies.
         * @default 1e6
         */
        maxForce?: number;
    });
    /**
     * enableMotor
     */
    enableMotor(): void;
    /**
     * disableMotor
     */
    disableMotor(): void;
    /**
     * setMotorSpeed
     */
    setMotorSpeed(speed: number): void;
    /**
     * setMotorMaxForce
     */
    setMotorMaxForce(maxForce: number): void;
    /**
     * update
     */
    update(): void;
}
