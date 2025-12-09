import { Vec2, Vec2Value } from '../common/Vec2';
import { Body } from './Body';
import { TimeStep } from './Solver';
import { Style } from '../util/Testbed';
/**
 * A joint edge is used to connect bodies and joints together in a joint graph
 * where each body is a node and each joint is an edge. A joint edge belongs to
 * a doubly linked list maintained in each attached body. Each joint has two
 * joint nodes, one for each attached body.
 */
export declare class JointEdge {
    /**
     * provides quick access to the other body attached.
     */
    other: Body | null;
    /**
     * the joint
     */
    joint: Joint | null;
    /**
     * prev the previous joint edge in the body's joint list
     */
    prev: JointEdge | null;
    /**
     * the next joint edge in the body's joint list
     */
    next: JointEdge | null;
}
/**
 * Joint definitions are used to construct joints.
 */
export interface JointOpt {
    /**
     * Use this to attach application specific data to your joints.
     */
    userData?: any;
    /**
     * Set this flag to true if the attached bodies
     * should collide.
     */
    collideConnected?: boolean;
    /** Styling for dev-tools. */
    style?: Style;
}
/**
 * Joint definitions are used to construct joints.
 */
export interface JointDef extends JointOpt {
    /**
     * The first attached body.
     */
    bodyA: Body;
    /**
     * The second attached body.
     */
    bodyB: Body;
}
/**
 * The base joint class. Joints are used to constraint two bodies together in
 * various fashions. Some joints also feature limits and motors.
 */
export declare abstract class Joint {
    /** @internal */ m_type: string;
    /** @internal */ m_bodyA: Body;
    /** @internal */ m_bodyB: Body;
    /** @internal */ m_collideConnected: boolean;
    /** @internal */ m_prev: Joint | null;
    /** @internal */ m_next: Joint | null;
    /** @internal */ m_edgeA: JointEdge;
    /** @internal */ m_edgeB: JointEdge;
    /** @internal */ m_islandFlag: boolean;
    /** @internal */ m_userData: unknown;
    /** Styling for dev-tools. */
    style: Style;
    /** @hidden @experimental Similar to userData, but used by dev-tools or runtime environment. */
    appData: Record<string, any>;
    constructor(def: JointDef);
    constructor(def: JointOpt, bodyA: Body, bodyB: Body);
    /**
     * Short-cut function to determine if either body is inactive.
     */
    isActive(): boolean;
    /**
     * Get the type of the concrete joint.
     */
    getType(): string;
    /**
     * Get the first body attached to this joint.
     */
    getBodyA(): Body;
    /**
     * Get the second body attached to this joint.
     */
    getBodyB(): Body;
    /**
     * Get the next joint the world joint list.
     */
    getNext(): Joint;
    getUserData(): unknown;
    setUserData(data: unknown): void;
    /**
     * Get collide connected. Note: modifying the collide connect flag won't work
     * correctly because the flag is only checked when fixture AABBs begin to
     * overlap.
     */
    getCollideConnected(): boolean;
    /**
     * Get the anchor point on bodyA in world coordinates.
     */
    abstract getAnchorA(): Vec2;
    /**
     * Get the anchor point on bodyB in world coordinates.
     */
    abstract getAnchorB(): Vec2;
    /**
     * Get the reaction force on bodyB at the joint anchor in Newtons.
     */
    abstract getReactionForce(inv_dt: number): Vec2;
    /**
     * Get the reaction torque on bodyB in N*m.
     */
    abstract getReactionTorque(inv_dt: number): number;
    /**
     * Shift the origin for any points stored in world coordinates.
     */
    shiftOrigin(newOrigin: Vec2Value): void;
    abstract initVelocityConstraints(step: TimeStep): void;
    abstract solveVelocityConstraints(step: TimeStep): void;
    /**
     * This returns true if the position errors are within tolerance.
     */
    abstract solvePositionConstraints(step: TimeStep): boolean;
    /**
     * @hidden @experimental
     * Update joint with new props.
     */
    abstract _reset(def: Partial<JointDef>): void;
    /**
     * @internal @deprecated
     * Temporary for backward compatibility, will be removed.
     */
    _resetAnchors(def: any): void;
}
