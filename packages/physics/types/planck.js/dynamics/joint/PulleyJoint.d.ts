import { Vec2, Vec2Value } from '../../common/Vec2';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { TimeStep } from '../Solver';
/**
 * Pulley joint definition. This requires two ground anchors, two dynamic body
 * anchor points, and a pulley ratio.
 */
export interface PulleyJointOpt extends JointOpt {
}
/**
 * Pulley joint definition. This requires two ground anchors, two dynamic body
 * anchor points, and a pulley ratio.
 */
export interface PulleyJointDef extends JointDef, PulleyJointOpt {
    /**
     * The first ground anchor in world coordinates. This point never moves.
     */
    groundAnchorA: Vec2Value;
    /**
     * The second ground anchor in world coordinates. This point never moves.
     */
    groundAnchorB: Vec2Value;
    /**
     * The local anchor point relative to bodyA's origin.
     */
    localAnchorA: Vec2Value;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    localAnchorB: Vec2Value;
    /**
     * The reference length for the segment attached to bodyA.
     */
    lengthA: number;
    /**
     * The reference length for the segment attached to bodyB.
     */
    lengthB: number;
    /**
     * The pulley ratio, used to simulate a block-and-tackle.
     */
    ratio: number;
    /** @hidden */ anchorA?: Vec2Value;
    /** @hidden */ anchorB?: Vec2Value;
}
declare module "./PulleyJoint" {
    /** @hidden @deprecated Use new keyword. */
    function PulleyJoint(def: PulleyJointDef): PulleyJoint;
    /** @hidden @deprecated Use new keyword. */
    function PulleyJoint(def: PulleyJointOpt, bodyA: Body, bodyB: Body, groundA: Vec2Value, groundB: Vec2Value, anchorA: Vec2Value, anchorB: Vec2Value, ratio: number): PulleyJoint;
}
/**
 * The pulley joint is connected to two bodies and two fixed ground points. The
 * pulley supports a ratio such that: length1 + ratio * length2 <= constant
 *
 * Yes, the force transmitted is scaled by the ratio.
 *
 * Warning: the pulley joint can get a bit squirrelly by itself. They often work
 * better when combined with prismatic joints. You should also cover the the
 * anchor points with static shapes to prevent one side from going to zero
 * length.
 */
export declare class PulleyJoint extends Joint {
    static TYPE: "pulley-joint";
    /** @internal */ m_type: "pulley-joint";
    /** @internal */ m_groundAnchorA: Vec2;
    /** @internal */ m_groundAnchorB: Vec2;
    /** @internal */ m_localAnchorA: Vec2;
    /** @internal */ m_localAnchorB: Vec2;
    /** @internal */ m_lengthA: number;
    /** @internal */ m_lengthB: number;
    /** @internal */ m_ratio: number;
    /** @internal */ m_constant: number;
    /** @internal */ m_impulse: number;
    /** @internal */ m_uA: Vec2;
    /** @internal */ m_uB: Vec2;
    /** @internal */ m_rA: Vec2;
    /** @internal */ m_rB: Vec2;
    /** @internal */ m_localCenterA: Vec2;
    /** @internal */ m_localCenterB: Vec2;
    /** @internal */ m_invMassA: number;
    /** @internal */ m_invMassB: number;
    /** @internal */ m_invIA: number;
    /** @internal */ m_invIB: number;
    /** @internal */ m_mass: number;
    constructor(def: PulleyJointDef);
    constructor(def: PulleyJointOpt, bodyA: Body, bodyB: Body, groundA?: Vec2Value, groundB?: Vec2Value, anchorA?: Vec2Value, anchorB?: Vec2Value, ratio?: number);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): PulleyJoint;
    /** @hidden */
    _reset(def: Partial<PulleyJointDef>): void;
    /**
     * Get the first ground anchor.
     */
    getGroundAnchorA(): Vec2;
    /**
     * Get the second ground anchor.
     */
    getGroundAnchorB(): Vec2;
    /**
     * Get the current length of the segment attached to bodyA.
     */
    getLengthA(): number;
    /**
     * Get the current length of the segment attached to bodyB.
     */
    getLengthB(): number;
    /**
     * Get the pulley ratio.
     */
    getRatio(): number;
    /**
     * Get the current length of the segment attached to bodyA.
     */
    getCurrentLengthA(): number;
    /**
     * Get the current length of the segment attached to bodyB.
     */
    getCurrentLengthB(): number;
    /**
     * Shift the origin for any points stored in world coordinates.
     *
     * @param newOrigin
     */
    shiftOrigin(newOrigin: Vec2Value): void;
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
