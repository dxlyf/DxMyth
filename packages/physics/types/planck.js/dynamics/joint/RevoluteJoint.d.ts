import { Vec2, Vec2Value } from '../../common/Vec2';
import { Vec3 } from '../../common/Vec3';
import { Mat33 } from '../../common/Mat33';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { TimeStep } from '../Solver';
/**
 * Revolute joint definition. This requires defining an anchor point where the
 * bodies are joined. The definition uses local anchor points so that the
 * initial configuration can violate the constraint slightly. You also need to
 * specify the initial relative angle for joint limits. This helps when saving
 * and loading a game.
 *
 * The local anchor points are measured from the body's origin rather than the
 * center of mass because: 1. you might not know where the center of mass will
 * be. 2. if you add/remove shapes from a body and recompute the mass, the
 * joints will be broken.
 */
export interface RevoluteJointOpt extends JointOpt {
    /**
     * The lower angle for the joint limit (radians).
     */
    lowerAngle?: number;
    /**
     * The upper angle for the joint limit (radians).
     */
    upperAngle?: number;
    /**
     * The maximum motor torque used to achieve the desired motor speed. Usually
     * in N-m.
     */
    maxMotorTorque?: number;
    /**
     * The desired motor speed. Usually in radians per second.
     */
    motorSpeed?: number;
    /**
     * A flag to enable joint limits.
     */
    enableLimit?: boolean;
    /**
     * A flag to enable the joint motor.
     */
    enableMotor?: boolean;
}
/**
 * Revolute joint definition. This requires defining an anchor point where the
 * bodies are joined. The definition uses local anchor points so that the
 * initial configuration can violate the constraint slightly. You also need to
 * specify the initial relative angle for joint limits. This helps when saving
 * and loading a game.
 *
 * The local anchor points are measured from the body's origin rather than the
 * center of mass because: 1. you might not know where the center of mass will
 * be. 2. if you add/remove shapes from a body and recompute the mass, the
 * joints will be broken.
 */
export interface RevoluteJointDef extends JointDef, RevoluteJointOpt {
    /**
     * The local anchor point relative to bodyA's origin.
     */
    localAnchorA: Vec2Value;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    localAnchorB: Vec2Value;
    /**
     * The bodyB angle minus bodyA angle in the reference state (radians).
     */
    referenceAngle?: number;
    /** @internal */ anchorA?: Vec2Value;
    /** @internal */ anchorB?: Vec2Value;
}
declare module "./RevoluteJoint" {
    /** @hidden @deprecated Use new keyword. */
    function RevoluteJoint(def: RevoluteJointDef): RevoluteJoint;
    /** @hidden @deprecated Use new keyword. */
    function RevoluteJoint(def: RevoluteJointOpt, bodyA: Body, bodyB: Body, anchor: Vec2Value): RevoluteJoint;
}
/**
 * A revolute joint constrains two bodies to share a common point while they are
 * free to rotate about the point. The relative rotation about the shared point
 * is the joint angle. You can limit the relative rotation with a joint limit
 * that specifies a lower and upper angle. You can use a motor to drive the
 * relative rotation about the shared point. A maximum motor torque is provided
 * so that infinite forces are not generated.
 */
export declare class RevoluteJoint extends Joint {
    static TYPE: "revolute-joint";
    /** @internal */ m_type: "revolute-joint";
    /** @internal */ m_localAnchorA: Vec2;
    /** @internal */ m_localAnchorB: Vec2;
    /** @internal */ m_referenceAngle: number;
    /** @internal */ m_impulse: Vec3;
    /** @internal */ m_motorImpulse: number;
    /** @internal */ m_lowerAngle: number;
    /** @internal */ m_upperAngle: number;
    /** @internal */ m_maxMotorTorque: number;
    /** @internal */ m_motorSpeed: number;
    /** @internal */ m_enableLimit: boolean;
    /** @internal */ m_enableMotor: boolean;
    /** @internal */ m_rA: Vec2;
    /** @internal */ m_rB: Vec2;
    /** @internal */ m_localCenterA: Vec2;
    /** @internal */ m_localCenterB: Vec2;
    /** @internal */ m_invMassA: number;
    /** @internal */ m_invMassB: number;
    /** @internal */ m_invIA: number;
    /** @internal */ m_invIB: number;
    /** @internal */ m_mass: Mat33;
    /** @internal */ m_motorMass: number;
    /** @internal */ m_limitState: number;
    constructor(def: RevoluteJointDef);
    constructor(def: RevoluteJointOpt, bodyA: Body, bodyB: Body, anchor?: Vec2Value);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): RevoluteJoint;
    /** @hidden */
    _reset(def: Partial<RevoluteJointDef>): void;
    /**
     * The local anchor point relative to bodyA's origin.
     */
    getLocalAnchorA(): Vec2;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    getLocalAnchorB(): Vec2;
    /**
     * Get the reference angle.
     */
    getReferenceAngle(): number;
    /**
     * Get the current joint angle in radians.
     */
    getJointAngle(): number;
    /**
     * Get the current joint angle speed in radians per second.
     */
    getJointSpeed(): number;
    /**
     * Is the joint motor enabled?
     */
    isMotorEnabled(): boolean;
    /**
     * Enable/disable the joint motor.
     */
    enableMotor(flag: boolean): void;
    /**
     * Get the current motor torque given the inverse time step. Unit is N*m.
     */
    getMotorTorque(inv_dt: number): number;
    /**
     * Set the motor speed in radians per second.
     */
    setMotorSpeed(speed: number): void;
    /**
     * Get the motor speed in radians per second.
     */
    getMotorSpeed(): number;
    /**
     * Set the maximum motor torque, usually in N-m.
     */
    setMaxMotorTorque(torque: number): void;
    getMaxMotorTorque(): number;
    /**
     * Is the joint limit enabled?
     */
    isLimitEnabled(): boolean;
    /**
     * Enable/disable the joint limit.
     */
    enableLimit(flag: boolean): void;
    /**
     * Get the lower joint limit in radians.
     */
    getLowerLimit(): number;
    /**
     * Get the upper joint limit in radians.
     */
    getUpperLimit(): number;
    /**
     * Set the joint limits in radians.
     */
    setLimits(lower: number, upper: number): void;
    /**
     * Get the anchor point on bodyA in world coordinates.
     */
    getAnchorA(): Vec2;
    /**
     * Get the anchor point on bodyB in world coordinates.
     */
    getAnchorB(): Vec2;
    /**
     * Get the reaction force given the inverse time step. Unit is N.
     */
    getReactionForce(inv_dt: number): Vec2;
    /**
     * Get the reaction torque due to the joint limit given the inverse time step.
     * Unit is N*m.
     */
    getReactionTorque(inv_dt: number): number;
    initVelocityConstraints(step: TimeStep): void;
    solveVelocityConstraints(step: TimeStep): void;
    /**
     * This returns true if the position errors are within tolerance.
     */
    solvePositionConstraints(step: TimeStep): boolean;
}
