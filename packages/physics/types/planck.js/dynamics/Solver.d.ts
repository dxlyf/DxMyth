import { Body } from './Body';
import { Contact } from './Contact';
import { Joint } from './Joint';
import { World } from './World';
export declare class TimeStep {
    /** time step */
    dt: number;
    /** inverse time step (0 if dt == 0) */
    inv_dt: number;
    velocityIterations: number;
    positionIterations: number;
    warmStarting: boolean;
    blockSolve: boolean;
    /** timestep ratio for variable timestep */
    inv_dt0: number;
    /** dt * inv_dt0 */
    dtRatio: number;
    reset(dt: number): void;
}
/**
 * Contact impulses for reporting. Impulses are used instead of forces because
 * sub-step forces may approach infinity for rigid body collisions. These match
 * up one-to-one with the contact points in Manifold.
 */
export declare class ContactImpulse {
    private readonly contact;
    private readonly normals;
    private readonly tangents;
    constructor(contact: Contact);
    recycle(): void;
    get normalImpulses(): number[];
    get tangentImpulses(): number[];
}
/**
 * Finds and solves islands. An island is a connected subset of the world.
 */
export declare class Solver {
    m_world: World;
    m_stack: Body[];
    m_bodies: Body[];
    m_contacts: Contact[];
    m_joints: Joint[];
    constructor(world: World);
    clear(): void;
    addBody(body: Body): void;
    addContact(contact: Contact): void;
    addJoint(joint: Joint): void;
    solveWorld(step: TimeStep): void;
    solveIsland(step: TimeStep): void;
    /**
     * Find TOI contacts and solve them.
     */
    solveWorldTOI(step: TimeStep): void;
    solveIslandTOI(subStep: TimeStep, toiA: Body, toiB: Body): void;
    /** @internal */
    postSolveIsland(): void;
}
