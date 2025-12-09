import { Vec2, Vec2Value } from '../common/Vec2';
import { Sweep } from '../common/Sweep';
import { Transform } from '../common/Transform';
import { Velocity } from './Velocity';
import { Position } from './Position';
import { Fixture, FixtureDef, FixtureOpt } from './Fixture';
import { Shape } from '../collision/Shape';
import { JointEdge } from './Joint';
import { World } from './World';
import { ContactEdge } from './Contact';
import { Style } from '../util/Testbed';
/**
 * A static body does not move under simulation and behaves as if it has infinite mass.
 * Internally, zero is stored for the mass and the inverse mass.
 * Static bodies can be moved manually by the user.
 * A static body has zero velocity.
 * Static bodies do not collide with other static or kinematic bodies.
 *
 * A kinematic body moves under simulation according to its velocity.
 * Kinematic bodies do not respond to forces.
 * They can be moved manually by the user, but normally a kinematic body is moved by setting its velocity.
 * A kinematic body behaves as if it has infinite mass, however, zero is stored for the mass and the inverse mass.
 * Kinematic bodies do not collide with other kinematic or static bodies.
 *
 * A dynamic body is fully simulated.
 * They can be moved manually by the user, but normally they move according to forces.
 * A dynamic body can collide with all body types.
 * A dynamic body always has finite, non-zero mass.
 * If you try to set the mass of a dynamic body to zero, it will automatically acquire a mass of one kilogram and it won't rotate.
 */
export type BodyType = "static" | "kinematic" | "dynamic";
export interface BodyDef {
    /**
     * Body types are static, kinematic, or dynamic. Note: if a dynamic
     * body would have zero mass, the mass is set to one.
     */
    type?: BodyType;
    /**
     * The world position of the body. Avoid creating bodies at the
     * origin since this can lead to many overlapping shapes.
     */
    position?: Vec2Value;
    /**
     * The world angle of the body in radians.
     */
    angle?: number;
    /**
     * The linear velocity of the body's origin in world co-ordinates.
     */
    linearVelocity?: Vec2Value;
    angularVelocity?: number;
    /**
     * Linear damping is use to reduce the linear velocity. The
     * damping parameter can be larger than 1.0 but the damping effect becomes
     * sensitive to the time step when the damping parameter is large.
     * Units are 1/time
     */
    linearDamping?: number;
    /**
     * Angular damping is use to reduce the angular velocity.
     * The damping parameter can be larger than 1.0 but the damping effect
     * becomes sensitive to the time step when the damping parameter is large.
     * Units are 1/time
     */
    angularDamping?: number;
    /**
     * Should this body be prevented from rotating? Useful for characters.
     */
    fixedRotation?: boolean;
    /**
     * Is this a fast moving body that should be prevented from
     * tunneling through other moving bodies? Note that all bodies are
     * prevented from tunneling through kinematic and static bodies. This
     * setting is only considered on dynamic bodies. Warning: You should use
     * this flag sparingly since it increases processing time.
     */
    bullet?: boolean;
    gravityScale?: number;
    /**
     * Set this flag to false if this body should never fall asleep. Note that this increases CPU usage.
     */
    allowSleep?: boolean;
    /**
     * Is this body initially awake or sleeping?
     */
    awake?: boolean;
    /**
     * Does this body start out active?
     */
    active?: boolean;
    userData?: any;
    /** Styling for dev-tools. */
    style?: Style;
}
/**
 * MassData This holds the mass data computed for a shape.
 */
export interface MassData {
    /** The mass of the shape, usually in kilograms. */
    mass: number;
    /** The position of the shape's centroid relative to the shape's origin. */
    center: Vec2Value;
    /** The rotational inertia of the shape about the local origin. */
    I: number;
}
/**
 * A rigid body composed of one or more fixtures.
 *
 * To create a new Body use {@link World.createBody}.
 */
export declare class Body {
    /** @hidden */
    static readonly STATIC: BodyType;
    /** @hidden */
    static readonly KINEMATIC: BodyType;
    /** @hidden */
    static readonly DYNAMIC: BodyType;
    /** @internal */ m_world: World;
    /** @internal */ m_awakeFlag: boolean;
    /** @internal */ m_autoSleepFlag: boolean;
    /** @internal */ m_bulletFlag: boolean;
    /** @internal */ m_fixedRotationFlag: boolean;
    /** @internal */ m_activeFlag: boolean;
    /** @internal */ m_islandFlag: boolean;
    /** @internal */ m_toiFlag: boolean;
    /** @internal */ m_userData: unknown;
    /** @internal */ m_type: BodyType;
    /** @internal */ m_mass: number;
    /** @internal */ m_invMass: number;
    /** @internal Rotational inertia about the center of mass. */
    m_I: number;
    /** @internal */ m_invI: number;
    /** @internal the body origin transform */
    m_xf: Transform;
    /** @internal the swept motion for CCD */
    m_sweep: Sweep;
    /** @internal */ c_velocity: Velocity;
    /** @internal */ c_position: Position;
    /** @internal */ m_force: Vec2;
    /** @internal */ m_torque: number;
    /** @internal */ m_linearVelocity: Vec2;
    /** @internal */ m_angularVelocity: number;
    /** @internal */ m_linearDamping: number;
    /** @internal */ m_angularDamping: number;
    /** @internal */ m_gravityScale: number;
    /** @internal */ m_sleepTime: number;
    /** @internal */ m_jointList: JointEdge | null;
    /** @internal */ m_contactList: ContactEdge | null;
    /** @internal */ m_fixtureList: Fixture | null;
    /** @internal */ m_prev: Body | null;
    /** @internal */ m_next: Body | null;
    /** @internal */ m_destroyed: boolean;
    /** Styling for dev-tools. */
    style: Style;
    /** @hidden @experimental Similar to userData, but used by dev-tools or runtime environment. */
    appData: Record<string, any>;
    /** @internal */
    constructor(world: World, def: BodyDef);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, world: any, restore: any): Body;
    isWorldLocked(): boolean;
    getWorld(): World;
    getNext(): Body | null;
    setUserData(data: any): void;
    getUserData(): unknown;
    getFixtureList(): Fixture | null;
    getJointList(): JointEdge | null;
    /**
     * Warning: this list changes during the time step and you may miss some
     * collisions if you don't use ContactListener.
     */
    getContactList(): ContactEdge | null;
    isStatic(): boolean;
    isDynamic(): boolean;
    isKinematic(): boolean;
    /**
     * This will alter the mass and velocity.
     */
    setStatic(): Body;
    setDynamic(): Body;
    setKinematic(): Body;
    /**
     * Get the type of the body.
     */
    getType(): BodyType;
    /**
     * Set the type of the body to "static", "kinematic" or "dynamic".
     * @param type The type of the body.
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     */
    setType(type: BodyType): void;
    isBullet(): boolean;
    /**
     * Should this body be treated like a bullet for continuous collision detection?
     */
    setBullet(flag: boolean): void;
    isSleepingAllowed(): boolean;
    setSleepingAllowed(flag: boolean): void;
    isAwake(): boolean;
    /**
     * Set the sleep state of the body. A sleeping body has very low CPU cost.
     *
     * @param flag Set to true to wake the body, false to put it to sleep.
     */
    setAwake(flag: boolean): void;
    isActive(): boolean;
    /**
     * Set the active state of the body. An inactive body is not simulated and
     * cannot be collided with or woken up. If you pass a flag of true, all fixtures
     * will be added to the broad-phase. If you pass a flag of false, all fixtures
     * will be removed from the broad-phase and all contacts will be destroyed.
     * Fixtures and joints are otherwise unaffected.
     *
     * You may continue to create/destroy fixtures and joints on inactive bodies.
     * Fixtures on an inactive body are implicitly inactive and will not participate
     * in collisions, ray-casts, or queries. Joints connected to an inactive body
     * are implicitly inactive. An inactive body is still owned by a World object
     * and remains
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     */
    setActive(flag: boolean): void;
    isFixedRotation(): boolean;
    /**
     * Set this body to have fixed rotation. This causes the mass to be reset.
     */
    setFixedRotation(flag: boolean): void;
    /**
     * Get the world transform for the body's origin.
     */
    getTransform(): Transform;
    /**
     * Set the position of the body's origin and rotation. Manipulating a body's
     * transform may cause non-physical behavior. Note: contacts are updated on the
     * next call to World.step.
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     *
     * @param position The world position of the body's local origin.
     * @param angle The world rotation in radians.
     */
    setTransform(position: Vec2Value, angle: number): void;
    /**
     * Set the position of the body's origin and rotation. Manipulating a body's
     * transform may cause non-physical behavior. Note: contacts are updated on the
     * next call to World.step.
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     */
    setTransform(xf: Transform): void;
    synchronizeTransform(): void;
    /**
     * Update fixtures in broad-phase.
     */
    synchronizeFixtures(): void;
    /**
     * Used in TOI.
     */
    advance(alpha: number): void;
    /**
     * Get the world position for the body's origin.
     */
    getPosition(): Vec2;
    setPosition(p: Vec2Value): void;
    /**
     * Get the current world rotation angle in radians.
     */
    getAngle(): number;
    setAngle(angle: number): void;
    /**
     * Get the world position of the center of mass.
     */
    getWorldCenter(): Vec2;
    /**
     * Get the local position of the center of mass.
     */
    getLocalCenter(): Vec2;
    /**
     * Get the linear velocity of the center of mass.
     *
     * @return the linear velocity of the center of mass.
     */
    getLinearVelocity(): Vec2;
    /**
     * Get the world linear velocity of a world point attached to this body.
     *
     * @param worldPoint A point in world coordinates.
     */
    getLinearVelocityFromWorldPoint(worldPoint: Vec2Value): Vec2;
    /**
     * Get the world velocity of a local point.
     *
     * @param localPoint A point in local coordinates.
     */
    getLinearVelocityFromLocalPoint(localPoint: Vec2Value): Vec2;
    /**
     * Set the linear velocity of the center of mass.
     *
     * @param v The new linear velocity of the center of mass.
     */
    setLinearVelocity(v: Vec2Value): void;
    /**
     * Get the angular velocity.
     *
     * @returns the angular velocity in radians/second.
     */
    getAngularVelocity(): number;
    /**
     * Set the angular velocity.
     *
     * @param w The new angular velocity in radians/second.
     */
    setAngularVelocity(w: number): void;
    getLinearDamping(): number;
    setLinearDamping(linearDamping: number): void;
    getAngularDamping(): number;
    setAngularDamping(angularDamping: number): void;
    getGravityScale(): number;
    /**
     * Scale the gravity applied to this body.
     */
    setGravityScale(scale: number): void;
    /**
     * Get the total mass of the body.
     *
     * @returns The mass, usually in kilograms (kg).
     */
    getMass(): number;
    /**
     * Get the rotational inertia of the body about the local origin.
     *
     * @return the rotational inertia, usually in kg-m^2.
     */
    getInertia(): number;
    /**
     * Copy the mass data of the body to data.
     */
    getMassData(data: MassData): void;
    /**
     * This resets the mass properties to the sum of the mass properties of the
     * fixtures. This normally does not need to be called unless you called
     * SetMassData to override the mass and you later want to reset the mass.
     */
    resetMassData(): void;
    /**
     * Set the mass properties to override the mass properties of the fixtures. Note
     * that this changes the center of mass position. Note that creating or
     * destroying fixtures can also alter the mass. This function has no effect if
     * the body isn't dynamic.
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     *
     * @param massData The mass properties.
     */
    setMassData(massData: MassData): void;
    /**
     * Apply a force at a world point. If the force is not applied at the center of
     * mass, it will generate a torque and affect the angular velocity. This wakes
     * up the body.
     *
     * @param force The world force vector, usually in Newtons (N).
     * @param point The world position of the point of application.
     * @param wake Also wake up the body
     */
    applyForce(force: Vec2Value, point: Vec2Value, wake?: boolean): void;
    /**
     * Apply a force to the center of mass. This wakes up the body.
     *
     * @param force The world force vector, usually in Newtons (N).
     * @param wake Also wake up the body
     */
    applyForceToCenter(force: Vec2Value, wake?: boolean): void;
    /**
     * Apply a torque. This affects the angular velocity without affecting the
     * linear velocity of the center of mass. This wakes up the body.
     *
     * @param torque About the z-axis (out of the screen), usually in N-m.
     * @param wake Also wake up the body
     */
    applyTorque(torque: number, wake?: boolean): void;
    /**
     * Apply an impulse at a point. This immediately modifies the velocity. It also
     * modifies the angular velocity if the point of application is not at the
     * center of mass. This wakes up the body.
     *
     * @param impulse The world impulse vector, usually in N-seconds or kg-m/s.
     * @param point The world position of the point of application.
     * @param wake Also wake up the body
     */
    applyLinearImpulse(impulse: Vec2Value, point: Vec2Value, wake?: boolean): void;
    /**
     * Apply an angular impulse.
     *
     * @param impulse The angular impulse in units of kg*m*m/s
     * @param wake Also wake up the body
     */
    applyAngularImpulse(impulse: number, wake?: boolean): void;
    /**
     * This is used to test if two bodies should collide.
     *
     * Bodies do not collide when:
     * - Neither of them is dynamic
     * - They are connected by a joint with collideConnected == false
     */
    shouldCollide(that: Body): boolean;
    /** @internal Used for deserialize. */
    _addFixture(fixture: Fixture): Fixture;
    /**
     * Creates a fixture and attach it to this body.
     *
     * If the density is non-zero, this function automatically updates the mass of
     * the body.
     *
     * Contacts are not created until the next time step.
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     */
    createFixture(def: FixtureDef): Fixture;
    createFixture(shape: Shape, opt?: FixtureOpt): Fixture;
    createFixture(shape: Shape, density?: number): Fixture;
    /**
     * Destroy a fixture. This removes the fixture from the broad-phase and destroys
     * all contacts associated with this fixture. This will automatically adjust the
     * mass of the body if the body is dynamic and the fixture has positive density.
     * All fixtures attached to a body are implicitly destroyed when the body is
     * destroyed.
     *
     * Warning: This function is locked when a world simulation step is in progress. Use queueUpdate to schedule a function to be called after the step.
     *
     * @param fixture The fixture to be removed.
     */
    destroyFixture(fixture: Fixture): void;
    /**
     * Get the corresponding world point of a local point.
     */
    getWorldPoint(localPoint: Vec2Value): Vec2;
    /**
     * Get the corresponding world vector of a local vector.
     */
    getWorldVector(localVector: Vec2Value): Vec2;
    /**
     * Gets the corresponding local point of a world point.
     */
    getLocalPoint(worldPoint: Vec2Value): Vec2;
    /**
     * Gets the corresponding local vector of a world vector.
     */
    getLocalVector(worldVector: Vec2Value): Vec2;
}
