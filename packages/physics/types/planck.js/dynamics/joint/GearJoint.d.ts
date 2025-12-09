import { Vec2 } from '../../common/Vec2';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { RevoluteJoint } from './RevoluteJoint';
import { PrismaticJoint } from './PrismaticJoint';
import { TimeStep } from '../Solver';
/**
 * Gear joint definition.
 */
export interface GearJointOpt extends JointOpt {
    /**
     * The gear ratio. See {@link GearJoint} for explanation.
     */
    ratio?: number;
}
/**
 * Gear joint definition.
 */
export interface GearJointDef extends JointDef, GearJointOpt {
    /**
     * The first revolute/prismatic joint attached to the gear joint.
     */
    joint1: RevoluteJoint | PrismaticJoint;
    /**
     * The second prismatic/revolute joint attached to the gear joint.
     */
    joint2: RevoluteJoint | PrismaticJoint;
}
declare module "./GearJoint" {
    /** @hidden @deprecated Use new keyword. */
    function GearJoint(def: GearJointDef): GearJoint;
    /** @hidden @deprecated Use new keyword. */
    function GearJoint(def: GearJointOpt, bodyA: Body, bodyB: Body, joint1: RevoluteJoint | PrismaticJoint, joint2: RevoluteJoint | PrismaticJoint, ratio?: number): GearJoint;
}
/**
 * A gear joint is used to connect two joints together. Either joint can be a
 * revolute or prismatic joint. You specify a gear ratio to bind the motions
 * together: coordinate1 + ratio * coordinate2 = constant
 *
 * The ratio can be negative or positive. If one joint is a revolute joint and
 * the other joint is a prismatic joint, then the ratio will have units of
 * length or units of 1/length. Warning: You have to manually destroy the gear
 * joint if joint1 or joint2 is destroyed.
 *
 * This definition requires two existing revolute or prismatic joints (any
 * combination will work).
 */
export declare class GearJoint extends Joint {
    static TYPE: "gear-joint";
    /** @internal */ m_type: "gear-joint";
    /** @internal */ m_joint1: RevoluteJoint | PrismaticJoint;
    /** @internal */ m_joint2: RevoluteJoint | PrismaticJoint;
    /** @internal */ m_type1: "revolute-joint" | "prismatic-joint";
    /** @internal */ m_type2: "revolute-joint" | "prismatic-joint";
    /** @internal */ m_bodyC: Body;
    /** @internal */ m_localAnchorC: Vec2;
    /** @internal */ m_localAnchorA: Vec2;
    /** @internal */ m_referenceAngleA: number;
    /** @internal */ m_localAxisC: Vec2;
    /** @internal */ m_bodyD: Body;
    /** @internal */ m_localAnchorD: Vec2;
    /** @internal */ m_localAnchorB: Vec2;
    /** @internal */ m_referenceAngleB: number;
    /** @internal */ m_localAxisD: Vec2;
    /** @internal */ m_ratio: number;
    /** @internal */ m_constant: number;
    /** @internal */ m_impulse: number;
    /** @internal */ m_lcA: Vec2;
    /** @internal */ m_lcB: Vec2;
    /** @internal */ m_lcC: Vec2;
    /** @internal */ m_lcD: Vec2;
    /** @internal */ m_mA: number;
    /** @internal */ m_mB: number;
    /** @internal */ m_mC: number;
    /** @internal */ m_mD: number;
    /** @internal */ m_iA: number;
    /** @internal */ m_iB: number;
    /** @internal */ m_iC: number;
    /** @internal */ m_iD: number;
    /** @internal */ m_JvAC: Vec2;
    /** @internal */ m_JvBD: Vec2;
    /** @internal */ m_JwA: number;
    /** @internal */ m_JwB: number;
    /** @internal */ m_JwC: number;
    /** @internal */ m_JwD: number;
    /** @internal */ m_mass: number;
    constructor(def: GearJointDef);
    constructor(def: GearJointOpt, bodyA: Body, bodyB: Body, joint1: RevoluteJoint | PrismaticJoint, joint2: RevoluteJoint | PrismaticJoint, ratio?: number);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): GearJoint;
    /** @hidden */
    _reset(def: Partial<GearJointDef>): void;
    /**
     * Get the first joint.
     */
    getJoint1(): Joint;
    /**
     * Get the second joint.
     */
    getJoint2(): Joint;
    /**
     * Set the gear ratio.
     */
    setRatio(ratio: number): void;
    /**
     * Get the gear ratio.
     */
    getRatio(): number;
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
