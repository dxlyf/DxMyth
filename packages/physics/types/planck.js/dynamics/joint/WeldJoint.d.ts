import { Vec2, Vec2Value } from '../../common/Vec2';
import { Vec3 } from '../../common/Vec3';
import { Mat33 } from '../../common/Mat33';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { TimeStep } from '../Solver';
/**
 * Weld joint definition. You need to specify local anchor points where they are
 * attached and the relative body angle. The position of the anchor points is
 * important for computing the reaction torque.
 */
export interface WeldJointOpt extends JointOpt {
    /**
     * The mass-spring-damper frequency in Hertz. Rotation only. Disable softness
     * with a value of 0.
     */
    frequencyHz?: number;
    /**
     * The damping ratio. 0 = no damping, 1 = critical damping.
     */
    dampingRatio?: number;
    /**
     * The bodyB angle minus bodyA angle in the reference state (radians).
     */
    referenceAngle?: number;
}
/**
 * Weld joint definition. You need to specify local anchor points where they are
 * attached and the relative body angle. The position of the anchor points is
 * important for computing the reaction torque.
 */
export interface WeldJointDef extends JointDef, WeldJointOpt {
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
declare module "./WeldJoint" {
    /** @hidden @deprecated Use new keyword. */
    function WeldJoint(def: WeldJointDef): WeldJoint;
    /** @hidden @deprecated Use new keyword. */
    function WeldJoint(def: WeldJointOpt, bodyA: Body, bodyB: Body, anchor: Vec2Value): WeldJoint;
}
/**
 * A weld joint essentially glues two bodies together. A weld joint may distort
 * somewhat because the island constraint solver is approximate.
 */
export declare class WeldJoint extends Joint {
    static TYPE: "weld-joint";
    /** @internal */ m_type: "weld-joint";
    /** @internal */ m_localAnchorA: Vec2;
    /** @internal */ m_localAnchorB: Vec2;
    /** @internal */ m_referenceAngle: number;
    /** @internal */ m_frequencyHz: number;
    /** @internal */ m_dampingRatio: number;
    /** @internal */ m_impulse: Vec3;
    /** @internal */ m_bias: number;
    /** @internal */ m_gamma: number;
    /** @internal */ m_rA: Vec2;
    /** @internal */ m_rB: Vec2;
    /** @internal */ m_localCenterA: Vec2;
    /** @internal */ m_localCenterB: Vec2;
    /** @internal */ m_invMassA: number;
    /** @internal */ m_invMassB: number;
    /** @internal */ m_invIA: number;
    /** @internal */ m_invIB: number;
    /** @internal */ m_mass: Mat33;
    constructor(def: WeldJointDef);
    constructor(def: WeldJointOpt, bodyA: Body, bodyB: Body, anchor?: Vec2Value);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): WeldJoint;
    /** @hidden */
    _reset(def: Partial<WeldJointDef>): void;
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
     * Set frequency in Hz.
     */
    setFrequency(hz: number): void;
    /**
     * Get frequency in Hz.
     */
    getFrequency(): number;
    /**
     * Set damping ratio.
     */
    setDampingRatio(ratio: number): void;
    /**
     * Get damping ratio.
     */
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
