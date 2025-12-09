import { Vec2, Vec2Value } from '../../common/Vec2';
import { Mat22 } from '../../common/Mat22';
import { Joint, JointOpt, JointDef } from '../Joint';
import { Body } from '../Body';
import { TimeStep } from '../Solver';
/**
 * Motor joint definition.
 */
export interface MotorJointOpt extends JointOpt {
    /**
     * The bodyB angle minus bodyA angle in radians.
     */
    angularOffset?: number;
    /**
     * The maximum motor force in N.
     */
    maxForce?: number;
    /**
     * The maximum motor torque in N-m.
     */
    maxTorque?: number;
    /**
     * Position correction factor in the range [0,1].
     */
    correctionFactor?: number;
    /**
     * Position of bodyB minus the position of bodyA, in bodyA's frame, in meters.
     */
    linearOffset?: Vec2Value;
}
/**
 * Motor joint definition.
 */
export interface MotorJointDef extends JointDef, MotorJointOpt {
}
declare module "./MotorJoint" {
    /** @hidden @deprecated Use new keyword. */
    function MotorJoint(def: MotorJointDef): MotorJoint;
    /** @hidden @deprecated Use new keyword. */
    function MotorJoint(def: MotorJointOpt, bodyA: Body, bodyB: Body): MotorJoint;
}
/**
 * A motor joint is used to control the relative motion between two bodies. A
 * typical usage is to control the movement of a dynamic body with respect to
 * the ground.
 */
export declare class MotorJoint extends Joint {
    static TYPE: "motor-joint";
    /** @internal */ m_type: "motor-joint";
    /** @internal */ m_linearOffset: Vec2;
    /** @internal */ m_angularOffset: number;
    /** @internal */ m_linearImpulse: Vec2;
    /** @internal */ m_angularImpulse: number;
    /** @internal */ m_maxForce: number;
    /** @internal */ m_maxTorque: number;
    /** @internal */ m_correctionFactor: number;
    /** @internal */ m_rA: Vec2;
    /** @internal */ m_rB: Vec2;
    /** @internal */ m_localCenterA: Vec2;
    /** @internal */ m_localCenterB: Vec2;
    /** @internal */ m_linearError: Vec2;
    /** @internal */ m_angularError: number;
    /** @internal */ m_invMassA: number;
    /** @internal */ m_invMassB: number;
    /** @internal */ m_invIA: number;
    /** @internal */ m_invIB: number;
    /** @internal */ m_linearMass: Mat22;
    /** @internal */ m_angularMass: number;
    constructor(def: MotorJointDef);
    constructor(def: MotorJointOpt, bodyA: Body, bodyB: Body);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): MotorJoint;
    /** @hidden */
    _reset(def: Partial<MotorJointDef>): void;
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
     * Set the position correction factor in the range [0,1].
     */
    setCorrectionFactor(factor: number): void;
    /**
     * Get the position correction factor in the range [0,1].
     */
    getCorrectionFactor(): number;
    /**
     * Set/get the target linear offset, in frame A, in meters.
     */
    setLinearOffset(linearOffset: Vec2Value): void;
    getLinearOffset(): Vec2;
    /**
     * Set/get the target angular offset, in radians.
     */
    setAngularOffset(angularOffset: number): void;
    getAngularOffset(): number;
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
