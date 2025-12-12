import { Vec2, Vec2Value } from '../../common/Vec2';
import { Mat22 } from '../../common/Mat22';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { TimeStep } from '../Solver';
/**
 * Friction joint definition.
 */
export interface FrictionJointOpt extends JointOpt {
    /**
     * The maximum friction force in N.
     */
    maxForce?: number;
    /**
     * The maximum friction torque in N-m.
     */
    maxTorque?: number;
}
/**
 * Friction joint definition.
 */
export interface FrictionJointDef extends JointDef, FrictionJointOpt {
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
declare module "./FrictionJoint" {
    /** @hidden @deprecated Use new keyword. */
    function FrictionJoint(def: FrictionJointDef): FrictionJoint;
    /** @hidden @deprecated Use new keyword. */
    function FrictionJoint(def: FrictionJointOpt, bodyA: Body, bodyB: Body, anchor: Vec2Value): FrictionJoint;
}
/**
 * Friction joint. This is used for top-down friction. It provides 2D
 * translational friction and angular friction.
 */
export declare class FrictionJoint extends Joint {
    static TYPE: "friction-joint";
    /** @internal */ m_type: "friction-joint";
    /** @internal */ m_localAnchorA: Vec2;
    /** @internal */ m_localAnchorB: Vec2;
    /** @internal */ m_linearImpulse: Vec2;
    /** @internal */ m_angularImpulse: number;
    /** @internal */ m_maxForce: number;
    /** @internal */ m_maxTorque: number;
    /** @internal */ m_rA: Vec2;
    /** @internal */ m_rB: Vec2;
    /** @internal */ m_localCenterA: Vec2;
    /** @internal */ m_localCenterB: Vec2;
    /** @internal */ m_invMassA: number;
    /** @internal */ m_invMassB: number;
    /** @internal */ m_invIA: number;
    /** @internal */ m_invIB: number;
    /** @internal */ m_linearMass: Mat22;
    /** @internal */ m_angularMass: number;
    constructor(def: FrictionJointDef);
    /**
     * @param anchor Anchor in global coordination.
     */
    constructor(def: FrictionJointOpt, bodyA: Body, bodyB: Body, anchor?: Vec2Value);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): FrictionJoint;
    /** @hidden */
    _reset(def: Partial<FrictionJointDef>): void;
    /**
     * The local anchor point relative to bodyA's origin.
     */
    getLocalAnchorA(): Vec2;
    /**
     * The local anchor point relative to bodyB's origin.
     */
    getLocalAnchorB(): Vec2;
    /**
     * Set the maximum friction force in N.
     */
    setMaxForce(force: number): void;
    /**
     * Get the maximum friction force in N.
     */
    getMaxForce(): number;
    /**
     * Set the maximum friction torque in N*m.
     */
    setMaxTorque(torque: number): void;
    /**
     * Get the maximum friction torque in N*m.
     */
    getMaxTorque(): number;
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
