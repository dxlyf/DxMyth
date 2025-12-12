import { Vec2, Vec2Value } from '../../common/Vec2';
import { Vec3 } from '../../common/Vec3';
import { Mat33 } from '../../common/Mat33';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { TimeStep } from '../Solver';
/**
 * Prismatic joint definition. This requires defining a line of motion using an
 * axis and an anchor point. The definition uses local anchor points and a local
 * axis so that the initial configuration can violate the constraint slightly.
 * The joint translation is zero when the local anchor points coincide in world
 * space. Using local anchors and a local axis helps when saving and loading a
 * game.
 */
export interface PrismaticJointOpt extends JointOpt {
    /**
     * Enable/disable the joint limit.
     */
    enableLimit?: boolean;
    /**
     * The lower translation limit, usually in meters.
     */
    lowerTranslation?: number;
    /**
     * The upper translation limit, usually in meters.
     */
    upperTranslation?: number;
    /**
     * Enable/disable the joint motor.
     */
    enableMotor?: boolean;
    /**
     * The maximum motor torque, usually in N-m.
     */
    maxMotorForce?: number;
    /**
     * The desired motor speed in radians per second.
     */
    motorSpeed?: number;
}
/**
 * Prismatic joint definition. This requires defining a line of motion using an
 * axis and an anchor point. The definition uses local anchor points and a local
 * axis so that the initial configuration can violate the constraint slightly.
 * The joint translation is zero when the local anchor points coincide in world
 * space. Using local anchors and a local axis helps when saving and loading a
 * game.
 */
export interface PrismaticJointDef extends JointDef, PrismaticJointOpt {
    /**
     * The local anchor point relative to bodyA's origin.
     */
    localAnchorA: Vec2Value;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    localAnchorB: Vec2Value;
    /**
     * The local translation unit axis in bodyA.
     */
    localAxisA: Vec2Value;
    /**
     * referenceAngle The constrained angle between the bodies:
     * bodyB_angle - bodyA_angle.
     */
    referenceAngle?: number;
    /** @internal */ anchorA?: Vec2Value;
    /** @internal */ anchorB?: Vec2Value;
}
declare module "./PrismaticJoint" {
    /** @hidden @deprecated Use new keyword. */
    function PrismaticJoint(def: PrismaticJointDef): PrismaticJoint;
    /** @hidden @deprecated Use new keyword. */
    function PrismaticJoint(def: PrismaticJointOpt, bodyA: Body, bodyB: Body, anchor: Vec2Value, axis: Vec2Value): PrismaticJoint;
}
/**
 * A prismatic joint. This joint provides one degree of freedom: translation
 * along an axis fixed in bodyA. Relative rotation is prevented. You can use a
 * joint limit to restrict the range of motion and a joint motor to drive the
 * motion or to model joint friction.
 */
export declare class PrismaticJoint extends Joint {
    static TYPE: "prismatic-joint";
    /** @internal */ m_type: "prismatic-joint";
    /** @internal */ m_localAnchorA: Vec2;
    /** @internal */ m_localAnchorB: Vec2;
    /** @internal */ m_localXAxisA: Vec2;
    /** @internal */ m_localYAxisA: Vec2;
    /** @internal */ m_referenceAngle: number;
    /** @internal */ m_impulse: Vec3;
    /** @internal */ m_motorMass: number;
    /** @internal */ m_motorImpulse: number;
    /** @internal */ m_lowerTranslation: number;
    /** @internal */ m_upperTranslation: number;
    /** @internal */ m_maxMotorForce: number;
    /** @internal */ m_motorSpeed: number;
    /** @internal */ m_enableLimit: boolean;
    /** @internal */ m_enableMotor: boolean;
    /** @internal */ m_limitState: number;
    /** @internal */ m_axis: Vec2;
    /** @internal */ m_perp: Vec2;
    /** @internal */ m_localCenterA: Vec2;
    /** @internal */ m_localCenterB: Vec2;
    /** @internal */ m_invMassA: number;
    /** @internal */ m_invMassB: number;
    /** @internal */ m_invIA: number;
    /** @internal */ m_invIB: number;
    /** @internal */ m_s1: number;
    /** @internal */ m_s2: number;
    /** @internal */ m_a1: number;
    /** @internal */ m_a2: number;
    /** @internal */ m_K: Mat33;
    constructor(def: PrismaticJointDef);
    constructor(def: PrismaticJointOpt, bodyA: Body, bodyB: Body, anchor?: Vec2Value, axis?: Vec2Value);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): PrismaticJoint;
    /** @hidden */
    _reset(def: Partial<PrismaticJointDef>): void;
    /**
     * The local anchor point relative to bodyA's origin.
     */
    getLocalAnchorA(): Vec2;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    getLocalAnchorB(): Vec2;
    /**
     * The local joint axis relative to bodyA.
     */
    getLocalAxisA(): Vec2;
    /**
     * Get the reference angle.
     */
    getReferenceAngle(): number;
    /**
     * Get the current joint translation, usually in meters.
     */
    getJointTranslation(): number;
    /**
     * Get the current joint translation speed, usually in meters per second.
     */
    getJointSpeed(): number;
    /**
     * Is the joint limit enabled?
     */
    isLimitEnabled(): boolean;
    /**
     * Enable/disable the joint limit.
     */
    enableLimit(flag: boolean): void;
    /**
     * Get the lower joint limit, usually in meters.
     */
    getLowerLimit(): number;
    /**
     * Get the upper joint limit, usually in meters.
     */
    getUpperLimit(): number;
    /**
     * Set the joint limits, usually in meters.
     */
    setLimits(lower: number, upper: number): void;
    /**
     * Is the joint motor enabled?
     */
    isMotorEnabled(): boolean;
    /**
     * Enable/disable the joint motor.
     */
    enableMotor(flag: boolean): void;
    /**
     * Set the motor speed, usually in meters per second.
     */
    setMotorSpeed(speed: number): void;
    /**
     * Set the maximum motor force, usually in N.
     */
    setMaxMotorForce(force: number): void;
    getMaxMotorForce(): number;
    /**
     * Get the motor speed, usually in meters per second.
     */
    getMotorSpeed(): number;
    /**
     * Get the current motor force given the inverse time step, usually in N.
     */
    getMotorForce(inv_dt: number): number;
    /**
     * Get the anchor point on bodyA in world coordinates.
     */
    getAnchorA(): Vec2;
    /**
     * Get the anchor point on bodyB in world coordinates.
     */
    getAnchorB(): Vec2;
    /**
     * Get the reaction force on bodyB at the joint anchor in Newtons.
     */
    getReactionForce(inv_dt: number): Vec2;
    /**
     * Get the reaction torque on bodyB in N*m.
     */
    getReactionTorque(inv_dt: number): number;
    initVelocityConstraints(step: TimeStep): void;
    solveVelocityConstraints(step: TimeStep): void;
    /**
     * This returns true if the position errors are within tolerance.
     */
    solvePositionConstraints(step: TimeStep): boolean;
}
