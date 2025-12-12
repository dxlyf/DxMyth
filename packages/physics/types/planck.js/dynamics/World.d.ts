import { Vec2, Vec2Value } from '../common/Vec2';
import { BroadPhase } from '../collision/BroadPhase';
import { Solver, ContactImpulse, TimeStep } from './Solver';
import { Body, BodyDef } from './Body';
import { Joint } from './Joint';
import { Contact } from './Contact';
import { AABBValue } from '../collision/AABB';
import { Fixture, FixtureProxy } from './Fixture';
import { Manifold } from '../collision/Manifold';
export interface WorldDef {
    /** [default: { x : 0, y : 0}] */
    gravity?: Vec2Value;
    /** [default: true] */
    allowSleep?: boolean;
    /** [default: true] */
    warmStarting?: boolean;
    /** [default: true] */
    continuousPhysics?: boolean;
    /** [default: false] */
    subStepping?: boolean;
    /** [default: true] */
    blockSolve?: boolean;
    /** @internal [8] For the velocity constraint solver. */
    velocityIterations?: number;
    /** @internal [3] For the position constraint solver. */
    positionIterations?: number;
}
/**
 * Callback function for ray casts, see {@link World.rayCast}.
 *
 * Called for each fixture found in the query.
 * The returned value replaces the ray-cast input maxFraction.
 * You control how the ray cast proceeds by returning a numeric/float value.
 *
 * - `0` to terminate the ray cast
 * - `fraction` to clip the ray cast at current point
 * - `1` don't clip the ray and continue
 * - `-1` (or anything else) to continue
 *
 * @param fixture The fixture hit by the ray
 * @param point The point of initial intersection
 * @param normal The normal vector at the point of intersection
 * @param fraction The fraction along the ray at the point of intersection
 *
 * @returns A number to update the maxFraction
 */
export type WorldRayCastCallback = (fixture: Fixture, point: Vec2, normal: Vec2, fraction: number) => number;
/**
 * Called for each fixture found in the query AABB. It may return `false` to terminate the query.
 */
export type WorldAABBQueryCallback = (fixture: Fixture) => boolean;
declare module "./World" {
    /** @hidden @deprecated Use new keyword. */
    function World(deg: WorldDef): World;
    /** @hidden @deprecated Use new keyword. */
    function World(gravity: Vec2): World;
    /** @hidden @deprecated Use new keyword. */
    function World(): World;
}
/**
 * The `World` class contains the bodies and joints. It manages all aspects
 * of the simulation and allows for asynchronous queries (like AABB queries
 * and ray-casts). Much of your interactions with Planck.js will be with a
 * World object.
 */
export declare class World {
    /** @internal */ m_solver: Solver;
    /** @internal */ m_broadPhase: BroadPhase;
    /** @internal */ m_contactList: Contact | null;
    /** @internal */ m_contactCount: number;
    /** @internal */ m_bodyList: Body | null;
    /** @internal */ m_bodyCount: number;
    /** @internal */ m_jointList: Joint | null;
    /** @internal */ m_jointCount: number;
    /** @internal */ m_stepComplete: boolean;
    /** @internal */ m_allowSleep: boolean;
    /** @internal */ m_gravity: Vec2;
    /** @internal */ m_clearForces: boolean;
    /** @internal */ m_newFixture: boolean;
    /** @internal */ m_locked: boolean;
    /** @internal */ m_warmStarting: boolean;
    /** @internal */ m_continuousPhysics: boolean;
    /** @internal */ m_subStepping: boolean;
    /** @internal */ m_blockSolve: boolean;
    /** @internal */ m_velocityIterations: number;
    /** @internal */ m_positionIterations: number;
    /** @internal */ m_t: number;
    /** @internal */ m_step_callback: ((world: World) => unknown)[];
    /** @internal */ _listeners: {
        [key: string]: any[];
    };
    /**
     * @param def World definition or gravity vector.
     */
    constructor(def?: WorldDef | Vec2Value);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, context: any, restore: any): World;
    /**
     * Get the world body list. With the returned body, use Body.getNext to get the
     * next body in the world list. A null body indicates the end of the list.
     *
     * @return the head of the world body list.
     */
    getBodyList(): Body | null;
    /**
     * Get the world joint list. With the returned joint, use Joint.getNext to get
     * the next joint in the world list. A null joint indicates the end of the list.
     *
     * @return the head of the world joint list.
     */
    getJointList(): Joint | null;
    /**
     * Get the world contact list. With the returned contact, use Contact.getNext to
     * get the next contact in the world list. A null contact indicates the end of
     * the list.
     *
     * Warning: contacts are created and destroyed in the middle of a time step.
     * Use ContactListener to avoid missing contacts.
     *
     * @return the head of the world contact list.
     */
    getContactList(): Contact | null;
    getBodyCount(): number;
    getJointCount(): number;
    /**
     * Get the number of contacts (each may have 0 or more contact points).
     */
    getContactCount(): number;
    /**
     * Change the global gravity vector.
     */
    setGravity(gravity: Vec2Value): void;
    /**
     * Get the global gravity vector.
     */
    getGravity(): Vec2;
    /**
     * Is the world locked (in the middle of a time step).
     */
    isLocked(): boolean;
    /**
     * Enable/disable sleep.
     */
    setAllowSleeping(flag: boolean): void;
    getAllowSleeping(): boolean;
    /**
     * Enable/disable warm starting. For testing.
     */
    setWarmStarting(flag: boolean): void;
    getWarmStarting(): boolean;
    /**
     * Enable/disable continuous physics. For testing.
     */
    setContinuousPhysics(flag: boolean): void;
    getContinuousPhysics(): boolean;
    /**
     * Enable/disable single stepped continuous physics. For testing.
     */
    setSubStepping(flag: boolean): void;
    getSubStepping(): boolean;
    /**
     * Set flag to control automatic clearing of forces after each time step.
     */
    setAutoClearForces(flag: boolean): void;
    /**
     * Get the flag that controls automatic clearing of forces after each time step.
     */
    getAutoClearForces(): boolean;
    /**
     * Manually clear the force buffer on all bodies. By default, forces are cleared
     * automatically after each call to step. The default behavior is modified by
     * calling setAutoClearForces. The purpose of this function is to support
     * sub-stepping. Sub-stepping is often used to maintain a fixed sized time step
     * under a variable frame-rate. When you perform sub-stepping you will disable
     * auto clearing of forces and instead call clearForces after all sub-steps are
     * complete in one pass of your game loop.
     *
     * See {@link World.setAutoClearForces}
     */
    clearForces(): void;
    /**
     * Query the world for all fixtures that potentially overlap the provided AABB.
     *
     * @param aabb The query box.
     * @param callback Called for each fixture found in the query AABB. It may return `false` to terminate the query.
     */
    queryAABB(aabb: AABBValue, callback: WorldAABBQueryCallback): void;
    /**
     * Ray-cast the world for all fixtures in the path of the ray. Your callback
     * controls whether you get the closest point, any point, or n-points. The
     * ray-cast ignores shapes that contain the starting point.
     *
     * @param point1 The ray starting point
     * @param point2 The ray ending point
     * @param callback A function that is called for each fixture that is hit by the ray. You control how the ray cast proceeds by returning a numeric/float value.
     */
    rayCast(point1: Vec2Value, point2: Vec2Value, callback: WorldRayCastCallback): void;
    /**
     * Get the number of broad-phase proxies.
     */
    getProxyCount(): number;
    /**
     * Get the height of broad-phase dynamic tree.
     */
    getTreeHeight(): number;
    /**
     * Get the balance of broad-phase dynamic tree.
     */
    getTreeBalance(): number;
    /**
     * Get the quality metric of broad-phase dynamic tree. The smaller the better.
     * The minimum is 1.
     */
    getTreeQuality(): number;
    /**
     * Shift the world origin. Useful for large worlds. The body shift formula is:
     * position -= newOrigin
     *
     * @param newOrigin The new origin with respect to the old origin
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     */
    shiftOrigin(newOrigin: Vec2Value): void;
    /** @internal Used for deserialize. */
    _addBody(body: Body): void;
    /**
     * Create a rigid body given a definition. No reference to the definition is
     * retained.
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     */
    createBody(def?: BodyDef): Body;
    createBody(position: Vec2Value, angle?: number): Body;
    createDynamicBody(def?: BodyDef): Body;
    createDynamicBody(position: Vec2Value, angle?: number): Body;
    createKinematicBody(def?: BodyDef): Body;
    createKinematicBody(position: Vec2Value, angle?: number): Body;
    /**
     * Destroy a body from the world.
     *
     * Warning: This automatically deletes all associated shapes and joints.
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     */
    destroyBody(b: Body): boolean;
    /**
     * Create a joint to constrain bodies together. No reference to the definition
     * is retained. This may cause the connected bodies to cease colliding.
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     */
    createJoint<T extends Joint>(joint: T): T | null;
    /**
     * Destroy a joint.
     *
     * Warning: This may cause the connected bodies to begin colliding.
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     */
    destroyJoint(joint: Joint): void;
    /** @internal */
    s_step: TimeStep;
    /**
     * Take a time step. This performs collision detection, integration, and
     * constraint solution.
     *
     * Broad-phase, narrow-phase, solve and solve time of impacts.
     *
     * @param timeStep Time step, this should not vary.
     */
    step(timeStep: number, velocityIterations?: number, positionIterations?: number): void;
    /**
     * Queue a function to be called after ongoing simulation step. If no simulation is in progress call it immediately.
     */
    queueUpdate(callback: (world: World) => unknown): void;
    /**
     * @internal
     * Call this method to find new contacts.
     */
    findNewContacts(): void;
    /**
     * @internal
     * Callback for broad-phase.
     */
    createContact(proxyA: FixtureProxy, proxyB: FixtureProxy): void;
    /**
     * @internal
     * Removes old non-overlapping contacts, applies filters and updates contacts.
     */
    updateContacts(): void;
    /** @internal */
    destroyContact(contact: Contact): void;
    /**
     * Called when two fixtures begin to touch.
     *
     * Implement contact callbacks to get contact information. You can use these
     * results for things like sounds and game logic. You can also get contact
     * results by traversing the contact lists after the time step. However, you
     * might miss some contacts because continuous physics leads to sub-stepping.
     * Additionally you may receive multiple callbacks for the same contact in a
     * single time step. You should strive to make your callbacks efficient because
     * there may be many callbacks per time step.
     *
     * Warning: You cannot create/destroy world entities inside these callbacks.
     */
    on(name: "begin-contact", listener: (contact: Contact) => void): World;
    /**
     * Called when two fixtures cease to touch.
     *
     * Implement contact callbacks to get contact information. You can use these
     * results for things like sounds and game logic. You can also get contact
     * results by traversing the contact lists after the time step. However, you
     * might miss some contacts because continuous physics leads to sub-stepping.
     * Additionally you may receive multiple callbacks for the same contact in a
     * single time step. You should strive to make your callbacks efficient because
     * there may be many callbacks per time step.
     *
     * Warning: You cannot create/destroy world entities inside these callbacks.
     */
    on(name: "end-contact", listener: (contact: Contact) => void): World;
    /**
     * This is called after a contact is updated. This allows you to inspect a
     * contact before it goes to the solver. If you are careful, you can modify the
     * contact manifold (e.g. disable contact). A copy of the old manifold is
     * provided so that you can detect changes. Note: this is called only for awake
     * bodies. Note: this is called even when the number of contact points is zero.
     * Note: this is not called for sensors. Note: if you set the number of contact
     * points to zero, you will not get an end-contact callback. However, you may get
     * a begin-contact callback the next step.
     *
     * Warning: You cannot create/destroy world entities inside these callbacks.
     */
    on(name: "pre-solve", listener: (contact: Contact, oldManifold: Manifold) => void): World;
    /**
     * This lets you inspect a contact after the solver is finished. This is useful
     * for inspecting impulses. Note: the contact manifold does not include time of
     * impact impulses, which can be arbitrarily large if the sub-step is small.
     * Hence the impulse is provided explicitly in a separate data structure. Note:
     * this is only called for contacts that are touching, solid, and awake.
     *
     * Warning: You cannot create/destroy world entities inside these callbacks.
     */
    on(name: "post-solve", listener: (contact: Contact, impulse: ContactImpulse) => void): World;
    /** Listener is called whenever a body is removed. */
    on(name: "remove-body", listener: (body: Body) => void): World;
    /** Listener is called whenever a joint is removed implicitly or explicitly. */
    on(name: "remove-joint", listener: (joint: Joint) => void): World;
    /** Listener is called whenever a fixture is removed implicitly or explicitly. */
    on(name: "remove-fixture", listener: (fixture: Fixture) => void): World;
    off(name: "begin-contact", listener: (contact: Contact) => void): World;
    off(name: "end-contact", listener: (contact: Contact) => void): World;
    off(name: "pre-solve", listener: (contact: Contact, oldManifold: Manifold) => void): World;
    off(name: "post-solve", listener: (contact: Contact, impulse: ContactImpulse) => void): World;
    off(name: "remove-body", listener: (body: Body) => void): World;
    off(name: "remove-joint", listener: (joint: Joint) => void): World;
    off(name: "remove-fixture", listener: (fixture: Fixture) => void): World;
    publish(name: string, arg1?: any, arg2?: any, arg3?: any): number;
    /** @internal */
    beginContact(contact: Contact): void;
    /** @internal */
    endContact(contact: Contact): void;
    /** @internal */
    preSolve(contact: Contact, oldManifold: Manifold): void;
    /** @internal */
    postSolve(contact: Contact, impulse: ContactImpulse): void;
}
