import { EventTarget } from '../utils/EventTarget';
import { Narrowphase } from '../world/Narrowphase';
import { Vec3 } from '../math/Vec3';
import { Material } from '../material/Material';
import { ContactMaterial } from '../material/ContactMaterial';
import { ArrayCollisionMatrix } from '../collision/ArrayCollisionMatrix';
import { OverlapKeeper } from '../collision/OverlapKeeper';
import { TupleDictionary } from '../utils/TupleDictionary';
import { RaycastResult } from '../collision/RaycastResult';
import { Body } from '../objects/Body';
import { Broadphase } from '../collision/Broadphase';
import { Solver } from '../solver/Solver';
import { ContactEquation } from '../equations/ContactEquation';
import { FrictionEquation } from '../equations/FrictionEquation';
import { RayOptions, RaycastCallback } from '../collision/Ray';
import { Constraint } from '../constraints/Constraint';
import { Shape } from '../shapes/Shape';
export type WorldOptions = ConstructorParameters<typeof World>[0];
/**
 * The physics world
 */
export declare class World extends EventTarget {
    /**
     * Currently / last used timestep. Is set to -1 if not available. This value is updated before each internal step, which means that it is "fresh" inside event callbacks.
     */
    dt: number;
    /**
     * Makes bodies go to sleep when they've been inactive.
     * @default false
     */
    allowSleep: boolean;
    /**
     * All the current contacts (instances of ContactEquation) in the world.
     */
    contacts: ContactEquation[];
    frictionEquations: FrictionEquation[];
    /**
     * How often to normalize quaternions. Set to 0 for every step, 1 for every second etc.. A larger value increases performance. If bodies tend to explode, set to a smaller value (zero to be sure nothing can go wrong).
     * @default 0
     */
    quatNormalizeSkip: number;
    /**
     * Set to true to use fast quaternion normalization. It is often enough accurate to use.
     * If bodies tend to explode, set to false.
     * @default false
     */
    quatNormalizeFast: boolean;
    /**
     * The wall-clock time since simulation start.
     */
    time: number;
    /**
     * Number of timesteps taken since start.
     */
    stepnumber: number;
    /**
     * Default and last timestep sizes.
     */
    default_dt: number;
    nextId: number;
    /**
     * The gravity of the world.
     */
    gravity: Vec3;
    /**
     * Gravity to use when approximating the friction max force (mu \* mass \* gravity).
     * If undefined, global gravity will be used.
     * Use to enable friction in a World with a null gravity vector (no gravity).
     */
    frictionGravity?: Vec3;
    /**
     * The broadphase algorithm to use.
     * @default NaiveBroadphase
     */
    broadphase: Broadphase;
    /**
     * All bodies in this world
     */
    bodies: Body[];
    /**
     * True if any bodies are not sleeping, false if every body is sleeping.
     */
    hasActiveBodies: boolean;
    /**
     * The solver algorithm to use.
     * @default GSSolver
     */
    solver: Solver;
    constraints: Constraint[];
    narrowphase: Narrowphase;
    /**
     * collisionMatrix
     */
    collisionMatrix: ArrayCollisionMatrix;
    /**
     * CollisionMatrix from the previous step.
     */
    collisionMatrixPrevious: ArrayCollisionMatrix;
    bodyOverlapKeeper: OverlapKeeper;
    shapeOverlapKeeper: OverlapKeeper;
    /**
     * All added contactmaterials.
     */
    contactmaterials: ContactMaterial[];
    /**
     * Used to look up a ContactMaterial given two instances of Material.
     */
    contactMaterialTable: TupleDictionary;
    /**
     * The default material of the bodies.
     */
    defaultMaterial: Material;
    /**
     * This contact material is used if no suitable contactmaterial is found for a contact.
     */
    defaultContactMaterial: ContactMaterial;
    doProfiling: boolean;
    profile: {
        solve: number;
        makeContactConstraints: number;
        broadphase: number;
        integrate: number;
        narrowphase: number;
    };
    /**
     * Time accumulator for interpolation.
     * @see https://gafferongames.com/game-physics/fix-your-timestep/
     */
    accumulator: number;
    subsystems: any[];
    /**
     * Dispatched after a body has been added to the world.
     */
    addBodyEvent: {
        type: 'addBody';
        body: Body | null;
    };
    /**
     * Dispatched after a body has been removed from the world.
     */
    removeBodyEvent: {
        type: 'removeBody';
        body: Body | null;
    };
    idToBodyMap: {
        [id: number]: Body;
    };
    lastCallTime?: number;
    constructor(options?: {
        /**
         * The gravity of the world.
         */
        gravity?: Vec3;
        /**
         * Gravity to use when approximating the friction max force (mu*mass*gravity).
         * If undefined, global gravity will be used.
         */
        frictionGravity?: Vec3;
        /**
         * Makes bodies go to sleep when they've been inactive.
         * @default false
         */
        allowSleep?: boolean;
        /**
         * The broadphase algorithm to use.
         * @default NaiveBroadphase
         */
        broadphase?: Broadphase;
        /**
         * The solver algorithm to use.
         * @default GSSolver
         */
        solver?: Solver;
        /**
         * Set to true to use fast quaternion normalization. It is often enough accurate to use.
         * If bodies tend to explode, set to false.
         * @default false
         */
        quatNormalizeFast?: boolean;
        /**
         * How often to normalize quaternions. Set to 0 for every step, 1 for every second etc.. A larger value increases performance. If bodies tend to explode, set to a smaller value (zero to be sure nothing can go wrong).
         * @default 0
         */
        quatNormalizeSkip?: number;
    });
    /**
     * Get the contact material between materials m1 and m2
     * @return The contact material if it was found.
     */
    getContactMaterial(m1: Material, m2: Material): ContactMaterial;
    /**
     * Store old collision state info
     */
    collisionMatrixTick(): void;
    /**
     * Add a constraint to the simulation.
     */
    addConstraint(c: Constraint): void;
    /**
     * Removes a constraint
     */
    removeConstraint(c: Constraint): void;
    /**
     * Raycast test
     * @deprecated Use .raycastAll, .raycastClosest or .raycastAny instead.
     */
    rayTest(from: Vec3, to: Vec3, result: RaycastResult | RaycastCallback): void;
    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @return True if any body was hit.
     */
    raycastAll(from?: Vec3, to?: Vec3, options?: RayOptions, callback?: RaycastCallback): boolean;
    /**
     * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
     * @return True if any body was hit.
     */
    raycastAny(from?: Vec3, to?: Vec3, options?: RayOptions, result?: RaycastResult): boolean;
    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    raycastClosest(from?: Vec3, to?: Vec3, options?: RayOptions, result?: RaycastResult): boolean;
    /**
     * Add a rigid body to the simulation.
     * @todo If the simulation has not yet started, why recrete and copy arrays for each body? Accumulate in dynamic arrays in this case.
     * @todo Adding an array of bodies should be possible. This would save some loops too
     */
    addBody(body: Body): void;
    /**
     * Remove a rigid body from the simulation.
     */
    removeBody(body: Body): void;
    getBodyById(id: number): Body;
    /**
     * @todo Make a faster map
     */
    getShapeById(id: number): Shape | null;
    /**
     * Adds a contact material to the World
     */
    addContactMaterial(cmat: ContactMaterial): void;
    /**
     * Removes a contact material from the World.
     */
    removeContactMaterial(cmat: ContactMaterial): void;
    /**
     * Step the simulation forward keeping track of last called time
     * to be able to step the world at a fixed rate, independently of framerate.
     *
     * @param dt The fixed time step size to use (default: 1 / 60).
     * @param maxSubSteps Maximum number of fixed steps to take per function call (default: 10).
     * @see https://gafferongames.com/post/fix_your_timestep/
     * @example
     *     // Run the simulation independently of framerate every 1 / 60 ms
     *     world.fixedStep()
     */
    fixedStep(dt?: number, maxSubSteps?: number): void;
    /**
     * Step the physics world forward in time.
     *
     * There are two modes. The simple mode is fixed timestepping without interpolation. In this case you only use the first argument. The second case uses interpolation. In that you also provide the time since the function was last used, as well as the maximum fixed timesteps to take.
     *
     * @param dt The fixed time step size to use.
     * @param timeSinceLastCalled The time elapsed since the function was last called.
     * @param maxSubSteps Maximum number of fixed steps to take per function call (default: 10).
     * @see https://web.archive.org/web/20180426154531/http://bulletphysics.org/mediawiki-1.5.8/index.php/Stepping_The_World#What_do_the_parameters_to_btDynamicsWorld::stepSimulation_mean.3F
     * @example
     *     // fixed timestepping without interpolation
     *     world.step(1 / 60)
     */
    step(dt: number, timeSinceLastCalled?: number, maxSubSteps?: number): void;
    internalStep(dt: number): void;
    emitContactEvents(): void;
    /**
     * Sets all body forces in the world to zero.
     */
    clearForces(): void;
}
