import { ShapeType } from '../collision/Shape';
import { TransformValue } from '../common/Transform';
import { Mat22 } from '../common/Mat22';
import { Manifold, ManifoldType, WorldManifold } from '../collision/Manifold';
import { Fixture } from './Fixture';
import { Body } from './Body';
import { ContactImpulse, TimeStep } from './Solver';
/**
 * A contact edge is used to connect bodies and contacts together in a contact
 * graph where each body is a node and each contact is an edge. A contact edge
 * belongs to a doubly linked list maintained in each attached body. Each
 * contact has two contact nodes, one for each attached body.
 */
export declare class ContactEdge {
    contact: Contact;
    prev: ContactEdge | null;
    next: ContactEdge | null;
    other: Body | null;
    constructor(contact: Contact);
    /** @internal */
    recycle(): void;
}
export type EvaluateFunction = (manifold: Manifold, xfA: TransformValue, fixtureA: Fixture, indexA: number, xfB: TransformValue, fixtureB: Fixture, indexB: number) => void;
/**
 * Friction mixing law. The idea is to allow either fixture to drive the
 * friction to zero. For example, anything slides on ice.
 */
export declare function mixFriction(friction1: number, friction2: number): number;
/**
 * Restitution mixing law. The idea is allow for anything to bounce off an
 * inelastic surface. For example, a superball bounces on anything.
 */
export declare function mixRestitution(restitution1: number, restitution2: number): number;
export declare class VelocityConstraintPoint {
    rA: import('..').Vec2Value;
    rB: import('..').Vec2Value;
    normalImpulse: number;
    tangentImpulse: number;
    normalMass: number;
    tangentMass: number;
    velocityBias: number;
    recycle(): void;
}
/**
 * The class manages contact between two shapes. A contact exists for each
 * overlapping AABB in the broad-phase (except if filtered). Therefore a contact
 * object may exist that has no contact points.
 */
export declare class Contact {
    /** @internal */ m_nodeA: ContactEdge;
    /** @internal */ m_nodeB: ContactEdge;
    /** @internal */ m_fixtureA: Fixture | null;
    /** @internal */ m_fixtureB: Fixture | null;
    /** @internal */ m_indexA: number;
    /** @internal */ m_indexB: number;
    /** @internal */ m_evaluateFcn: EvaluateFunction | null;
    /** @internal */ m_manifold: Manifold;
    /** @internal */ m_prev: Contact | null;
    /** @internal */ m_next: Contact | null;
    /** @internal */ m_toi: number;
    /** @internal */ m_toiCount: number;
    /** @internal */ m_toiFlag: boolean;
    /** @internal */ m_friction: number;
    /** @internal */ m_restitution: number;
    /** @internal */ m_tangentSpeed: number;
    /** @internal This contact can be disabled (by user) */
    m_enabledFlag: boolean;
    /** @internal Used when crawling contact graph when forming islands. */
    m_islandFlag: boolean;
    /** @internal Set when the shapes are touching. */
    m_touchingFlag: boolean;
    /** @internal This contact needs filtering because a fixture filter was changed. */
    m_filterFlag: boolean;
    /** @internal This bullet contact had a TOI event */
    m_bulletHitFlag: boolean;
    /** @internal Contact reporting impulse object cache */
    m_impulse: ContactImpulse;
    /** @internal */ v_points: VelocityConstraintPoint[];
    /** @internal */ v_normal: import('..').Vec2Value;
    /** @internal */ v_normalMass: Mat22;
    /** @internal */ v_K: Mat22;
    /** @internal */ v_pointCount: number;
    /** @internal */ v_tangentSpeed: number;
    /** @internal */ v_friction: number;
    /** @internal */ v_restitution: number;
    /** @internal */ v_invMassA: number;
    /** @internal */ v_invMassB: number;
    /** @internal */ v_invIA: number;
    /** @internal */ v_invIB: number;
    /** @internal */ p_localPoints: import('..').Vec2Value[];
    /** @internal */ p_localNormal: import('..').Vec2Value;
    /** @internal */ p_localPoint: import('..').Vec2Value;
    /** @internal */ p_localCenterA: import('..').Vec2Value;
    /** @internal */ p_localCenterB: import('..').Vec2Value;
    /** @internal */ p_type: ManifoldType;
    /** @internal */ p_radiusA: number;
    /** @internal */ p_radiusB: number;
    /** @internal */ p_pointCount: number;
    /** @internal */ p_invMassA: number;
    /** @internal */ p_invMassB: number;
    /** @internal */ p_invIA: number;
    /** @internal */ p_invIB: number;
    /** @internal */
    initialize(fA: Fixture, indexA: number, fB: Fixture, indexB: number, evaluateFcn: EvaluateFunction): void;
    /** @internal */
    recycle(): void;
    initConstraint(step: TimeStep): void;
    /**
     * Get the contact manifold. Do not modify the manifold unless you understand
     * the internals of the library.
     */
    getManifold(): Manifold;
    /**
     * Get the world manifold.
     */
    getWorldManifold(worldManifold: WorldManifold | null): WorldManifold | undefined;
    /**
     * Enable/disable this contact. This can be used inside the pre-solve contact
     * listener. The contact is only disabled for the current time step (or sub-step
     * in continuous collisions).
     */
    setEnabled(flag: boolean): void;
    /**
     * Has this contact been disabled?
     */
    isEnabled(): boolean;
    /**
     * Is this contact touching?
     */
    isTouching(): boolean;
    /**
     * Get the next contact in the world's contact list.
     */
    getNext(): Contact | null;
    /**
     * Get fixture A in this contact.
     */
    getFixtureA(): Fixture;
    /**
     * Get fixture B in this contact.
     */
    getFixtureB(): Fixture;
    /**
     * Get the child primitive index for fixture A.
     */
    getChildIndexA(): number;
    /**
     * Get the child primitive index for fixture B.
     */
    getChildIndexB(): number;
    /**
     * Flag this contact for filtering. Filtering will occur the next time step.
     */
    flagForFiltering(): void;
    /**
     * Override the default friction mixture. You can call this in
     * "pre-solve" callback. This value persists until set or reset.
     */
    setFriction(friction: number): void;
    /**
     * Get the friction.
     */
    getFriction(): number;
    /**
     * Reset the friction mixture to the default value.
     */
    resetFriction(): void;
    /**
     * Override the default restitution mixture. You can call this in
     * "pre-solve" callback. The value persists until you set or reset.
     */
    setRestitution(restitution: number): void;
    /**
     * Get the restitution.
     */
    getRestitution(): number;
    /**
     * Reset the restitution to the default value.
     */
    resetRestitution(): void;
    /**
     * Set the desired tangent speed for a conveyor belt behavior. In meters per
     * second.
     */
    setTangentSpeed(speed: number): void;
    /**
     * Get the desired tangent speed. In meters per second.
     */
    getTangentSpeed(): number;
    /**
     * Called by Update method, and implemented by subclasses.
     */
    evaluate(manifold: Manifold, xfA: TransformValue, xfB: TransformValue): void;
    /**
     * Updates the contact manifold and touching status.
     *
     * Note: do not assume the fixture AABBs are overlapping or are valid.
     *
     * @param listener.beginContact
     * @param listener.endContact
     * @param listener.preSolve
     */
    update(listener?: {
        beginContact(contact: Contact): void;
        endContact(contact: Contact): void;
        preSolve(contact: Contact, oldManifold: Manifold): void;
    }): void;
    solvePositionConstraint(step: TimeStep): number;
    solvePositionConstraintTOI(step: TimeStep, toiA: Body, toiB: Body): number;
    private _solvePositionConstraint;
    initVelocityConstraint(step: TimeStep): void;
    warmStartConstraint(step: TimeStep): void;
    storeConstraintImpulses(step: TimeStep): void;
    solveVelocityConstraint(step: TimeStep): void;
    /** @internal */
    static addType(type1: ShapeType, type2: ShapeType, callback: EvaluateFunction): void;
    /** @internal */
    static create(fixtureA: Fixture, indexA: number, fixtureB: Fixture, indexB: number): Contact | null;
    /** @internal */
    static destroy(contact: Contact, listener: {
        endContact: (contact: Contact) => void;
    }): void;
}
