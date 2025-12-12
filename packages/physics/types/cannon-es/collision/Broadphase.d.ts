import { Body } from '../objects/Body';
import { AABB } from '../collision/AABB';
import { World } from '../world/World';
/**
 * Base class for broadphase implementations
 * @author schteppe
 */
export declare class Broadphase {
    /**
     * The world to search for collisions in.
     */
    world: World | null;
    /**
     * If set to true, the broadphase uses bounding boxes for intersection tests, else it uses bounding spheres.
     */
    useBoundingBoxes: boolean;
    /**
     * Set to true if the objects in the world moved.
     */
    dirty: boolean;
    constructor();
    /**
     * Get the collision pairs from the world
     * @param world The world to search in
     * @param p1 Empty array to be filled with body objects
     * @param p2 Empty array to be filled with body objects
     */
    collisionPairs(world: World, p1: Body[], p2: Body[]): void;
    /**
     * Check if a body pair needs to be intersection tested at all.
     */
    needBroadphaseCollision(bodyA: Body, bodyB: Body): boolean;
    /**
     * Check if the bounding volumes of two bodies intersect.
     */
    intersectionTest(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
    /**
     * Check if the bounding spheres of two bodies are intersecting.
     * @param pairs1 bodyA is appended to this array if intersection
     * @param pairs2 bodyB is appended to this array if intersection
     */
    doBoundingSphereBroadphase(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
    /**
     * Check if the bounding boxes of two bodies are intersecting.
     */
    doBoundingBoxBroadphase(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
    /**
     * Removes duplicate pairs from the pair arrays.
     */
    makePairsUnique(pairs1: Body[], pairs2: Body[]): void;
    /**
     * To be implemented by subcasses
     */
    setWorld(world: World): void;
    /**
     * Check if the bounding spheres of two bodies overlap.
     */
    static boundingSphereCheck(bodyA: Body, bodyB: Body): boolean;
    /**
     * Returns all the bodies within the AABB.
     */
    aabbQuery(world: World, aabb: AABB, result: Body[]): Body[];
}
