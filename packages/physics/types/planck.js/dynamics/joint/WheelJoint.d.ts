import { Vec2, Vec2Value } from '../../common/Vec2';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { TimeStep } from '../Solver';
/**
 * Wheel joint definition. This requires defining a line of motion using an axis
 * and an anchor point. The definition uses local anchor points and a local axis
 * so that the initial configuration can violate the constraint slightly. The
 * joint translation is zero when the local anchor points coincide in world
 * space. Using local anchors and a local axis helps when saving and loading a
 * game.
 */
export interface WheelJointOpt extends JointOpt {
    /**
     * Enable/disable the joint motor.
     */
    enableMotor?: boolean;
    /**
     * The maximum motor torque, usually in N-m.
     */
    maxMotorTorque?: number;
    /**
     * The desired motor speed in radians per second.
     */
    motorSpeed?: number;
    /**
     * Suspension frequency, zero indicates no suspension.
     */
    frequencyHz?: number;
    /**
     * Suspension damping ratio, one indicates critical damping.
     */
    dampingRatio?: number;
}
/**
 * Wheel joint definition. This requires defining a line of motion using an axis
 * and an anchor point. The definition uses local anchor points and a local axis
 * so that the initial configuration can violate the constraint slightly. The
 * joint translation is zero when the local anchor points coincide in world
 * space. Using local anchors and a local axis helps when saving and loading a
 * game.
 */
export interface WheelJointDef extends JointDef, WheelJointOpt {
    /**
     * The local anchor point relative to bodyA's origin.
     */
    localAnchorA: Vec2Value;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    localAnchorB: Vec2Value;
    /**
     * The local translation axis in bodyA.
     */
    localAxisA: Vec2Value;
    /** @internal renamed to localAxisA */
    localAxis?: Vec2Value;
    /** @internal */ anchorA?: Vec2Value;
    /** @internal */ anchorB?: Vec2Value;
}
declare module "./WheelJoint" {
    /** @hidden @deprecated Use new keyword. */
    function WheelJoint(def: WheelJointDef): WheelJoint;
    /** @hidden @deprecated Use new keyword. */
    function WheelJoint(def: WheelJointOpt, bodyA: Body, bodyB: Body, anchor: Vec2Value, axis: Vec2Value): WheelJoint;
}
/**
 * A wheel joint. This joint provides two degrees of freedom: translation along
 * an axis fixed in bodyA and rotation in the plane. In other words, it is a
 * point to line constraint with a rotational motor and a linear spring/damper.
 * This joint is designed for vehicle suspensions.
 */
export declare class WheelJoint extends Joint {
    static TYPE: "wheel-joint";
    /** @internal */ m_type: "wheel-joint";
    /** @internal */ m_localAnchorA: Vec2;
    /** @internal */ m_localAnchorB: Vec2;
    /** @internal */ m_localXAxisA: Vec2;
    /** @internal */ m_localYAxisA: Vec2;
    /** @internal */ m_mass: number;
    /** @internal */ m_impulse: number;
    /** @internal */ m_motorMass: number;
    /** @internal */ m_motorImpulse: number;
    /** @internal */ m_springMass: number;
    /** @internal */ m_springImpulse: number;
    /** @internal */ m_maxMotorTorque: number;
    /** @internal */ m_motorSpeed: number;
    /** @internal */ m_enableMotor: boolean;
    /** @internal */ m_frequencyHz: number;
    /** @internal */ m_dampingRatio: number;
    /** @internal */ m_bias: number;
    /** @internal */ m_gamma: number;
    /** @internal */ m_localCenterA: Vec2;
    /** @internal */ m_localCenterB: Vec2;
    /** @internal */ m_invMassA: number;
    /** @internal */ m_invMassB: number;
    /** @internal */ m_invIA: number;
    /** @internal */ m_invIB: number;
    /** @internal */ m_ax: Vec2;
    /** @internal */ m_ay: Vec2;
    /** @internal */ m_sAx: number;
    /** @internal */ m_sBx: number;
    /** @internal */ m_sAy: number;
    /** @internal */ m_sBy: number;
    constructor(def: WheelJointDef);
    constructor(def: WheelJointOpt, bodyA: Body, bodyB: Body, anchor?: Vec2Value, axis?: Vec2Value);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): WheelJoint;
    /** @hidden */
    _reset(def: Partial<WheelJointDef>): void;
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
     * Get the current joint translation, usually in meters.
     */
    getJointTranslation(): number;
    /**
     * Get the current joint translation speed, usually in meters per second.
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
     * Set the motor speed, usually in radians per second.
     */
    setMotorSpeed(speed: number): void;
    /**
     * Get the motor speed, usually in radians per second.
     */
    getMotorSpeed(): number;
    /**
     * Set/Get the maximum motor force, usually in N-m.
     */
    setMaxMotorTorque(torque: number): void;
    getMaxMotorTorque(): number;
    /**
     * Get the current motor torque given the inverse time step, usually in N-m.
     */
    getMotorTorque(inv_dt: number): number;
    /**
     * Set/Get the spring frequency in hertz. Setting the frequency to zero disables
     * the spring.
     */
    setSpringFrequencyHz(hz: number): void;
    getSpringFrequencyHz(): number;
    /**
     * Set/Get the spring damping ratio
     */
    setSpringDampingRatio(ratio: number): void;
    getSpringDampingRatio(): number;
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
