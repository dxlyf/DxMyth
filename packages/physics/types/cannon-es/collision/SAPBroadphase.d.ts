import { Broadphase } from '../collision/Broadphase';
import { AABB } from '../collision/AABB';
import { Body } from '../objects/Body';
import { World } from '../world/World';
/**
 * Sweep and prune broadphase along one axis.
 */
export declare class SAPBroadphase extends Broadphase {
    /**
     * List of bodies currently in the broadphase.
     */
    axisList: Body[];
    /**
     * The world to search in.
     */
    world: World | null;
    /**
     * Axis to sort the bodies along.
     * Set to 0 for x axis, and 1 for y axis.
     * For best performance, pick the axis where bodies are most distributed.
     */
    axisIndex: 0 | 1 | 2;
    private _addBodyHandler;
    private _removeBodyHandler;
    /**
     * Check if the bounds of two bodies overlap, along the given SAP axis.
     */
    static checkBounds(bi: Body, bj: Body, axisIndex: 0 | 1 | 2): boolean;
    /**
     * insertionSortX
     */
    static insertionSortX(a: Body[]): Body[];
    /**
     * insertionSortY
     */
    static insertionSortY(a: Body[]): Body[];
    /**
     * insertionSortZ
     */
    static insertionSortZ(a: Body[]): Body[];
    constructor(world: World);
    /**
     * Change the world
     */
    setWorld(world: World): void;
    /**
     * Collect all collision pairs
     */
    collisionPairs(world: World, p1: Body[], p2: Body[]): void;
    sortList(): void;
    /**
     * Computes the variance of the body positions and estimates the best axis to use.
     * Will automatically set property `axisIndex`.
     */
    autoDetectAxis(): void;
    /**
     * Returns all the bodies within an AABB.
     * @param result An array to store resulting bodies in.
     */
    aabbQuery(world: World, aabb: AABB, result?: Body[]): Body[];
}
