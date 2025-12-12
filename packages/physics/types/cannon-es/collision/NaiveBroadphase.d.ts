import { Broadphase } from '../collision/Broadphase';
import { AABB } from '../collision/AABB';
import { Body } from '../objects/Body';
import { World } from '../world/World';
/**
 * Naive broadphase implementation, used in lack of better ones.
 *
 * The naive broadphase looks at all possible pairs without restriction, therefore it has complexity N^2 _(which is bad)_
 */
export declare class NaiveBroadphase extends Broadphase {
    /**
     * @todo Remove useless constructor
     */
    constructor();
    /**
     * Get all the collision pairs in the physics world
     */
    collisionPairs(world: World, pairs1: Body[], pairs2: Body[]): void;
    /**
     * Returns all the bodies within an AABB.
     * @param result An array to store resulting bodies in.
     */
    aabbQuery(world: World, aabb: AABB, result?: Body[]): Body[];
}
