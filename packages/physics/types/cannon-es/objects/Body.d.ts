import { EventTarget } from '../utils/EventTarget';
import { Vec3 } from '../math/Vec3';
import { Mat3 } from '../math/Mat3';
import { Quaternion } from '../math/Quaternion';
import { AABB } from '../collision/AABB';
import { Shape } from '../shapes/Shape';
import { Material } from '../material/Material';
import { World } from '../world/World';
/**
 * BODY_TYPES
 */
export declare const BODY_TYPES: {
    /** DYNAMIC */
    readonly DYNAMIC: 1;
    /** STATIC */
    readonly STATIC: 2;
    /** KINEMATIC */
    readonly KINEMATIC: 4;
};
/**
 * BodyType
 */
export type BodyType = typeof BODY_TYPES[keyof typeof BODY_TYPES];
/**
 * BODY_SLEEP_STATES
 */
export declare const BODY_SLEEP_STATES: {
    /** AWAKE */
    readonly AWAKE: 0;
    /** SLEEPY */
    readonly SLEEPY: 1;
    /** SLEEPING */
    readonly SLEEPING: 2;
};
/**
 * BodySleepState
 */
export type BodySleepState = typeof BODY_SLEEP_STATES[keyof typeof BODY_SLEEP_STATES];
export type BodyOptions = ConstructorParameters<typeof Body>[0];
/**
 * Base class for all body types.
 * @example
 *     const shape = new CANNON.Sphere(1)
 *     const body = new CANNON.Body({
 *       mass: 1,
 *       shape,
 *     })
 *     world.addBody(body)
 */
export declare class Body extends EventTarget {
    static idCounter: number;
    /**
     * Dispatched after two bodies collide. This event is dispatched on each
     * of the two bodies involved in the collision.
     * @event collide
     * @param body The body that was involved in the collision.
     * @param contact The details of the collision.
     */
    static COLLIDE_EVENT_NAME: string;
    /**
     * A dynamic body is fully simulated. Can be moved manually by the user, but normally they move according to forces. A dynamic body can collide with all body types. A dynamic body always has finite, non-zero mass.
     */
    static DYNAMIC: 1;
    /**
     * A static body does not move during simulation and behaves as if it has infinite mass. Static bodies can be moved manually by setting the position of the body. The velocity of a static body is always zero. Static bodies do not collide with other static or kinematic bodies.
     */
    static STATIC: 2;
    /**
     * A kinematic body moves under simulation according to its velocity. They do not respond to forces. They can be moved manually, but normally a kinematic body is moved by setting its velocity. A kinematic body behaves as if it has infinite mass. Kinematic bodies do not collide with other static or kinematic bodies.
     */
    static KINEMATIC: 4;
    /**
     * AWAKE
     */
    static AWAKE: 0;
    /**
     * SLEEPY
     */
    static SLEEPY: 1;
    /**
     * SLEEPING
     */
    static SLEEPING: 2;
    /**
     * Dispatched after a sleeping body has woken up.
     * @event wakeup
     */
    static wakeupEvent: {
        type: string;
    };
    /**
     * Dispatched after a body has gone in to the sleepy state.
     * @event sleepy
     */
    static sleepyEvent: {
        type: string;
    };
    /**
     * Dispatched after a body has fallen asleep.
     * @event sleep
     */
    static sleepEvent: {
        type: string;
    };
    /**
     * Identifier of the body.
     */
    id: number;
    /**
     * Position of body in World.bodies. Updated by World and used in ArrayCollisionMatrix.
     */
    index: number;
    /**
     * Reference to the world the body is living in.
     */
    world: World | null;
    vlambda: Vec3;
    /**
     * The collision group the body belongs to.
     * @default 1
     */
    collisionFilterGroup: number;
    /**
     * The collision group the body can collide with.
     * @default -1
     */
    collisionFilterMask: number;
    /**
     * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled - i.e. "collide" events will be raised, but forces will not be altered.
     */
    collisionResponse: boolean;
    /**
     * World space position of the body.
     */
    position: Vec3;
    previousPosition: Vec3;
    /**
     * Interpolated position of the body.
     */
    interpolatedPosition: Vec3;
    /**
     * Initial position of the body.
     */
    initPosition: Vec3;
    /**
     * World space velocity of the body.
     */
    velocity: Vec3;
    /**
     * Initial velocity of the body.
     */
    initVelocity: Vec3;
    /**
     * Linear force on the body in world space.
     */
    force: Vec3;
    /**
     * The mass of the body.
     * @default 0
     */
    mass: number;
    invMass: number;
    /**
     * The physics material of the body. It defines the body interaction with other bodies.
     */
    material: Material | null;
    /**
     * How much to damp the body velocity each step. It can go from 0 to 1.
     * @default 0.01
     */
    linearDamping: number;
    /**
     * One of: `Body.DYNAMIC`, `Body.STATIC` and `Body.KINEMATIC`.
     */
    type: BodyType;
    /**
     * If true, the body will automatically fall to sleep.
     * @default true
     */
    allowSleep: boolean;
    /**
     * Current sleep state.
     */
    sleepState: BodySleepState;
    /**
     * If the speed (the norm of the velocity) is smaller than this value, the body is considered sleepy.
     * @default 0.1
     */
    sleepSpeedLimit: number;
    /**
     * If the body has been sleepy for this sleepTimeLimit seconds, it is considered sleeping.
     * @default 1
     */
    sleepTimeLimit: number;
    timeLastSleepy: number;
    wakeUpAfterNarrowphase: boolean;
    /**
     * World space rotational force on the body, around center of mass.
     */
    torque: Vec3;
    /**
     * World space orientation of the body.
     */
    quaternion: Quaternion;
    /**
     * Initial quaternion of the body.
     */
    initQuaternion: Quaternion;
    previousQuaternion: Quaternion;
    /**
     * Interpolated orientation of the body.
     */
    interpolatedQuaternion: Quaternion;
    /**
     * Angular velocity of the body, in world space. Think of the angular velocity as a vector, which the body rotates around. The length of this vector determines how fast (in radians per second) the body rotates.
     */
    angularVelocity: Vec3;
    /**
     * Initial angular velocity of the body.
     */
    initAngularVelocity: Vec3;
    /**
     * List of Shapes that have been added to the body.
     */
    shapes: Shape[];
    /**
     * Position of each Shape in the body, given in local Body space.
     */
    shapeOffsets: Vec3[];
    /**
     * Orientation of each Shape, given in local Body space.
     */
    shapeOrientations: Quaternion[];
    /**
     * The inertia of the body.
     */
    inertia: Vec3;
    invInertia: Vec3;
    invInertiaWorld: Mat3;
    invMassSolve: number;
    invInertiaSolve: Vec3;
    invInertiaWorldSolve: Mat3;
    /**
     * Set to true if you don't want the body to rotate. Make sure to run .updateMassProperties() if you change this after the body creation.
     * @default false
     */
    fixedRotation: boolean;
    /**
     * How much to damp the body angular velocity each step. It can go from 0 to 1.
     * @default 0.01
     */
    angularDamping: number;
    /**
     * Use this property to limit the motion along any world axis. (1,1,1) will allow motion along all axes while (0,0,0) allows none.
     */
    linearFactor: Vec3;
    /**
     * Use this property to limit the rotational motion along any world axis. (1,1,1) will allow rotation along all axes while (0,0,0) allows none.
     */
    angularFactor: Vec3;
    /**
     * World space bounding box of the body and its shapes.
     */
    aabb: AABB;
    /**
     * Indicates if the AABB needs to be updated before use.
     */
    aabbNeedsUpdate: boolean;
    /**
     * Total bounding radius of the Body including its shapes, relative to body.position.
     */
    boundingRadius: number;
    wlambda: Vec3;
    /**
     * When true the body behaves like a trigger. It does not collide
     * with other bodies but collision events are still triggered.
     * @default false
     */
    isTrigger: boolean;
    constructor(options?: {
        /**
         * The collision group the body belongs to.
         * @default 1
         */
        collisionFilterGroup?: number;
        /**
         * The collision group the body can collide with.
         * @default -1
         */
        collisionFilterMask?: number;
        /**
         * Whether to produce contact forces when in contact with other bodies. Note that contacts will be generated, but they will be disabled - i.e. "collide" events will be raised, but forces will not be altered.
         */
        collisionResponse?: boolean;
        /**
         * World space position of the body.
         */
        position?: Vec3;
        /**
         * World space velocity of the body.
         */
        velocity?: Vec3;
        /**
         * The mass of the body.
         * @default 0
         */
        mass?: number;
        /**
         * The physics material of the body. It defines the body interaction with other bodies.
         */
        material?: Material;
        /**
         * How much to damp the body velocity each step. It can go from 0 to 1.
         * @default 0.01
         */
        linearDamping?: number;
        /**
         * One of: `Body.DYNAMIC`, `Body.STATIC` and `Body.KINEMATIC`.
         */
        type?: BodyType;
        /**
         * If true, the body will automatically fall to sleep.
         * @default true
         */
        allowSleep?: boolean;
        /**
         * If the speed (the norm of the velocity) is smaller than this value, the body is considered sleepy.
         * @default 0.1
         */
        sleepSpeedLimit?: number;
        /**
         * If the body has been sleepy for this sleepTimeLimit seconds, it is considered sleeping.
         * @default 1
         */
        sleepTimeLimit?: number;
        /**
         * World space orientation of the body.
         */
        quaternion?: Quaternion;
        /**
         * Angular velocity of the body, in world space. Think of the angular velocity as a vector, which the body rotates around. The length of this vector determines how fast (in radians per second) the body rotates.
         */
        angularVelocity?: Vec3;
        /**
         * Set to true if you don't want the body to rotate. Make sure to run .updateMassProperties() if you change this after the body creation.
         * @default false
         */
        fixedRotation?: boolean;
        /**
         * How much to damp the body angular velocity each step. It can go from 0 to 1.
         * @default 0.01
         */
        angularDamping?: number;
        /**
         * Use this property to limit the motion along any world axis. (1,1,1) will allow motion along all axes while (0,0,0) allows none.
         */
        linearFactor?: Vec3;
        /**
         * Use this property to limit the rotational motion along any world axis. (1,1,1) will allow rotation along all axes while (0,0,0) allows none.
         */
        angularFactor?: Vec3;
        /**
         * Add a Shape to the body.
         */
        shape?: Shape;
        /**
         * When true the body behaves like a trigger. It does not collide
         * with other bodies but collision events are still triggered.
         * @default false
         */
        isTrigger?: boolean;
    });
    /**
     * Wake the body up.
     */
    wakeUp(): void;
    /**
     * Force body sleep
     */
    sleep(): void;
    /**
     * Called every timestep to update internal sleep timer and change sleep state if needed.
     * @param time The world time in seconds
     */
    sleepTick(time: number): void;
    /**
     * If the body is sleeping, it should be immovable / have infinite mass during solve. We solve it by having a separate "solve mass".
     */
    updateSolveMassProperties(): void;
    /**
     * Convert a world point to local body frame.
     */
    pointToLocalFrame(worldPoint: Vec3, result?: Vec3): Vec3;
    /**
     * Convert a world vector to local body frame.
     */
    vectorToLocalFrame(worldVector: Vec3, result?: Vec3): Vec3;
    /**
     * Convert a local body point to world frame.
     */
    pointToWorldFrame(localPoint: Vec3, result?: Vec3): Vec3;
    /**
     * Convert a local body point to world frame.
     */
    vectorToWorldFrame(localVector: Vec3, result?: Vec3): Vec3;
    /**
     * Add a shape to the body with a local offset and orientation.
     * @return The body object, for chainability.
     */
    addShape(shape: Shape, _offset?: Vec3, _orientation?: Quaternion): Body;
    /**
     * Remove a shape from the body.
     * @return The body object, for chainability.
     */
    removeShape(shape: Shape): Body;
    /**
     * Update the bounding radius of the body. Should be done if any of the shapes are changed.
     */
    updateBoundingRadius(): void;
    /**
     * Updates the .aabb
     */
    updateAABB(): void;
    /**
     * Update `.inertiaWorld` and `.invInertiaWorld`
     */
    updateInertiaWorld(force?: boolean): void;
    /**
     * Apply force to a point of the body. This could for example be a point on the Body surface.
     * Applying force this way will add to Body.force and Body.torque.
     * @param force The amount of force to add.
     * @param relativePoint A point relative to the center of mass to apply the force on.
     */
    applyForce(force: Vec3, relativePoint?: Vec3): void;
    /**
     * Apply force to a local point in the body.
     * @param force The force vector to apply, defined locally in the body frame.
     * @param localPoint A local point in the body to apply the force on.
     */
    applyLocalForce(localForce: Vec3, localPoint?: Vec3): void;
    /**
     * Apply torque to the body.
     * @param torque The amount of torque to add.
     */
    applyTorque(torque: Vec3): void;
    /**
     * Apply impulse to a point of the body. This could for example be a point on the Body surface.
     * An impulse is a force added to a body during a short period of time (impulse = force * time).
     * Impulses will be added to Body.velocity and Body.angularVelocity.
     * @param impulse The amount of impulse to add.
     * @param relativePoint A point relative to the center of mass to apply the force on.
     */
    applyImpulse(impulse: Vec3, relativePoint?: Vec3): void;
    /**
     * Apply locally-defined impulse to a local point in the body.
     * @param force The force vector to apply, defined locally in the body frame.
     * @param localPoint A local point in the body to apply the force on.
     */
    applyLocalImpulse(localImpulse: Vec3, localPoint?: Vec3): void;
    /**
     * Should be called whenever you change the body shape or mass.
     */
    updateMassProperties(): void;
    /**
     * Get world velocity of a point in the body.
     * @param worldPoint
     * @param result
     * @return The result vector.
     */
    getVelocityAtWorldPoint(worldPoint: Vec3, result: Vec3): Vec3;
    /**
     * Move the body forward in time.
     * @param dt Time step
     * @param quatNormalize Set to true to normalize the body quaternion
     * @param quatNormalizeFast If the quaternion should be normalized using "fast" quaternion normalization
     */
    integrate(dt: number, quatNormalize: boolean, quatNormalizeFast: boolean): void;
}
