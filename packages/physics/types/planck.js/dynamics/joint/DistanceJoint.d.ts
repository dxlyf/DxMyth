import { Vec2, Vec2Value } from '../../common/Vec2';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { TimeStep } from '../Solver';
/**
 * Distance joint definition. This requires defining an anchor point on both
 * bodies and the non-zero length of the distance joint. The definition uses
 * local anchor points so that the initial configuration can violate the
 * constraint slightly. This helps when saving and loading a game. Warning: Do
 * not use a zero or short length.
 */
export interface DistanceJointOpt extends JointOpt {
    /**
     * The mass-spring-damper frequency in Hertz. A value of 0 disables softness.
     */
    frequencyHz?: number;
    /**
     * The damping ratio. 0 = no damping, 1 = critical damping.
     */
    dampingRatio?: number;
    /**
     * Distance length.
     */
    length?: number;
}
/**
 * Distance joint definition. This requires defining an anchor point on both
 * bodies and the non-zero length of the distance joint. The definition uses
 * local anchor points so that the initial configuration can violate the
 * constraint slightly. This helps when saving and loading a game. Warning: Do
 * not use a zero or short length.
 */
export interface DistanceJointDef extends JointDef, DistanceJointOpt {
    /**
     * The local anchor point relative to bodyA's origin.
     */
    localAnchorA: Vec2Value;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    localAnchorB: Vec2Value;
    /** @internal */ anchorA?: Vec2Value;
    /** @internal */ anchorB?: Vec2Value;
}
declare module "./DistanceJoint" {
    /** @hidden @deprecated Use new keyword. */
    function DistanceJoint(def: DistanceJointDef): DistanceJoint;
    /** @hidden @deprecated Use new keyword. */
    function DistanceJoint(def: DistanceJointOpt, bodyA: Body, bodyB: Body, anchorA: Vec2Value, anchorB: Vec2Value): DistanceJoint;
}
/**
 * A distance joint constrains two points on two bodies to remain at a fixed
 * distance from each other. You can view this as a massless, rigid rod.
 */
export declare class DistanceJoint extends Joint {
    static TYPE: "distance-joint";
    /** @internal */ m_localAnchorA: Vec2;
    /** @internal */ m_localAnchorB: Vec2;
    /** @internal */ m_length: number;
    /** @internal */ m_frequencyHz: number;
    /** @internal */ m_dampingRatio: number;
    /** @internal */ m_impulse: number;
    /** @internal */ m_gamma: number;
    /** @internal */ m_bias: number;
    /** @internal */ m_u: Vec2;
    /** @internal */ m_rA: Vec2;
    /** @internal */ m_rB: Vec2;
    /** @internal */ m_localCenterA: Vec2;
    /** @internal */ m_localCenterB: Vec2;
    /** @internal */ m_invMassA: number;
    /** @internal */ m_invMassB: number;
    /** @internal */ m_invIA: number;
    /** @internal */ m_invIB: number;
    /** @internal */ m_mass: number;
    /**
     * @param def DistanceJoint definition.
     */
    constructor(def: DistanceJointDef);
    /**
     * @param anchorA Anchor A in global coordination.
     * @param anchorB Anchor B in global coordination.
     */
    constructor(def: DistanceJointOpt, bodyA: Body, bodyB: Body, anchorA?: Vec2Value, anchorB?: Vec2Value);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): DistanceJoint;
    /** @hidden */
    _reset(def: Partial<DistanceJointDef>): void;
    /**
     * The local anchor point relative to bodyA's origin.
     */
    getLocalAnchorA(): Vec2;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    getLocalAnchorB(): Vec2;
    /**
     * Set the natural length. Manipulating the length can lead to non-physical
     * behavior when the frequency is zero.
     */
    setLength(length: number): void;
    /**
     * Get the natural length.
     */
    getLength(): number;
    setFrequency(hz: number): void;
    getFrequency(): number;
    setDampingRatio(ratio: number): void;
    getDampingRatio(): number;
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
