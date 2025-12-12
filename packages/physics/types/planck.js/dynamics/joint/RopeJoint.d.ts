import { Vec2, Vec2Value } from '../../common/Vec2';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { TimeStep } from '../Solver';
/**
 * Rope joint definition. This requires two body anchor points and a maximum
 * lengths. Note: by default the connected objects will not collide. see
 * collideConnected in JointDef.
 */
export interface RopeJointOpt extends JointOpt {
    /**
     * The maximum length of the rope.
     * Warning: this must be larger than linearSlop or the joint will have no effect.
     */
    maxLength?: number;
}
/**
 * Rope joint definition. This requires two body anchor points and a maximum
 * lengths. Note: by default the connected objects will not collide. see
 * collideConnected in JointDef.
 */
export interface RopeJointDef extends JointDef, RopeJointOpt {
    /**
     * The local anchor point relative to bodyA's origin.
     */
    localAnchorA: Vec2Value;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    localAnchorB: Vec2Value;
}
declare module "./RopeJoint" {
    /** @hidden @deprecated Use new keyword. */
    function RopeJoint(def: RopeJointDef): RopeJoint;
    /** @hidden @deprecated Use new keyword. */
    function RopeJoint(def: RopeJointOpt, bodyA: Body, bodyB: Body, anchor: Vec2Value): RopeJoint;
}
/**
 * A rope joint enforces a maximum distance between two points on two bodies. It
 * has no other effect.
 *
 * Warning: if you attempt to change the maximum length during the simulation
 * you will get some non-physical behavior.
 *
 * A model that would allow you to dynamically modify the length would have some
 * sponginess, so I chose not to implement it that way. See {@link DistanceJoint} if you
 * want to dynamically control length.
 */
export declare class RopeJoint extends Joint {
    static TYPE: "rope-joint";
    /** @internal */ m_type: "rope-joint";
    /** @internal */ m_localAnchorA: Vec2;
    /** @internal */ m_localAnchorB: Vec2;
    /** @internal */ m_maxLength: number;
    /** @internal */ m_mass: number;
    /** @internal */ m_impulse: number;
    /** @internal */ m_length: number;
    /** @internal */ m_state: number;
    /** @internal */ m_u: Vec2;
    /** @internal */ m_rA: Vec2;
    /** @internal */ m_rB: Vec2;
    /** @internal */ m_localCenterA: Vec2;
    /** @internal */ m_localCenterB: Vec2;
    /** @internal */ m_invMassA: number;
    /** @internal */ m_invMassB: number;
    /** @internal */ m_invIA: number;
    /** @internal */ m_invIB: number;
    constructor(def: RopeJointDef);
    constructor(def: RopeJointOpt, bodyA: Body, bodyB: Body, anchor?: Vec2Value);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): RopeJoint;
    /** @hidden */
    _reset(def: Partial<RopeJointDef>): void;
    /**
     * The local anchor point relative to bodyA's origin.
     */
    getLocalAnchorA(): Vec2;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    getLocalAnchorB(): Vec2;
    /**
     * Set the maximum length of the rope.
     */
    setMaxLength(length: number): void;
    /**
     * Get the maximum length of the rope.
     */
    getMaxLength(): number;
    getLimitState(): number;
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
