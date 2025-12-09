import { Vec2, Vec2Value } from '../../common/Vec2';
import { Mat22 } from '../../common/Mat22';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { TimeStep } from '../Solver';
/**
 * Mouse joint definition. This requires a world target point, tuning
 * parameters, and the time step.
 */
export interface MouseJointOpt extends JointOpt {
    /**
     * [maxForce = 0.0] The maximum constraint force that can be exerted to move
     * the candidate body. Usually you will express as some multiple of the
     * weight (multiplier * mass * gravity).
     */
    maxForce?: number;
    /**
     * [frequencyHz = 5.0] The response speed.
     */
    frequencyHz?: number;
    /**
     * [dampingRatio = 0.7] The damping ratio. 0 = no damping, 1 = critical
     * damping.
     */
    dampingRatio?: number;
}
/**
 * Mouse joint definition. This requires a world target point, tuning
 * parameters, and the time step.
 */
export interface MouseJointDef extends JointDef, MouseJointOpt {
    /**
     * The initial world target point. This is assumed to coincide with the body
     * anchor initially.
     */
    target: Vec2Value;
}
declare module "./MouseJoint" {
    /** @hidden @deprecated Use new keyword. */
    function MouseJoint(def: MouseJointDef): MouseJoint;
    /** @hidden @deprecated Use new keyword. */
    function MouseJoint(def: MouseJointOpt, bodyA: Body, bodyB: Body, target: Vec2Value): MouseJoint;
}
/**
 * A mouse joint is used to make a point on a body track a specified world
 * point. This a soft constraint with a maximum force. This allows the
 * constraint to stretch and without applying huge forces.
 *
 * You need to call setTarget(target) every time that mouse is
 * moved, to track the new location of the mouse.
 *
 * NOTE: this joint is not documented in the manual because it was developed to
 * be used in the testbed. If you want to learn how to use the mouse joint, look
 * at the testbed.
 */
export declare class MouseJoint extends Joint {
    static TYPE: "mouse-joint";
    /** @internal */ m_type: "mouse-joint";
    /** @internal */ m_targetA: Vec2;
    /** @internal */ m_localAnchorB: Vec2;
    /** @internal */ m_maxForce: number;
    /** @internal */ m_impulse: Vec2;
    /** @internal */ m_frequencyHz: number;
    /** @internal */ m_dampingRatio: number;
    /** @internal */ m_beta: number;
    /** @internal */ m_gamma: number;
    /** @internal */ m_rB: Vec2;
    /** @internal */ m_localCenterB: Vec2;
    /** @internal */ m_invMassB: number;
    /** @internal */ m_invIB: number;
    /** @internal */ m_mass: Mat22;
    /** @internal */ m_C: Vec2;
    constructor(def: MouseJointDef);
    constructor(def: MouseJointOpt, bodyA: Body, bodyB: Body, target?: Vec2Value);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): MouseJoint;
    /** @hidden */
    _reset(def: Partial<MouseJointDef>): void;
    /**
     * Use this to update the target point.
     */
    setTarget(target: Vec2Value): void;
    getTarget(): Vec2;
    /**
     * Set the maximum force in Newtons.
     */
    setMaxForce(force: number): void;
    /**
     * Get the maximum force in Newtons.
     */
    getMaxForce(): number;
    /**
     * Set the frequency in Hertz.
     */
    setFrequency(hz: number): void;
    /**
     * Get the frequency in Hertz.
     */
    getFrequency(): number;
    /**
     * Set the damping ratio (dimensionless).
     */
    setDampingRatio(ratio: number): void;
    /**
     * Get the damping ratio (dimensionless).
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
    /**
     * Shift the origin for any points stored in world coordinates.
     */
    shiftOrigin(newOrigin: Vec2Value): void;
    initVelocityConstraints(step: TimeStep): void;
    solveVelocityConstraints(step: TimeStep): void;
    /**
     * This returns true if the position errors are within tolerance.
     */
    solvePositionConstraints(step: TimeStep): boolean;
}
