import { Broadphase } from '../collision/Broadphase';
import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
import { World } from '../world/World';
/**
 * Axis aligned uniform grid broadphase.
 * @todo Needs support for more than just planes and spheres.
 */
export declare class GridBroadphase extends Broadphase {
    /**
     * Number of boxes along x
     */
    nx: number;
    /**
     * Number of boxes along y
     */
    ny: number;
    /**
     * Number of boxes along z
     */
    nz: number;
    /**
     * aabbMin
     */
    aabbMin: Vec3;
    /**
     * aabbMax
     */
    aabbMax: Vec3;
    /**
     * bins
     */
    bins: Body[][];
    /**
     * binLengths
     */
    binLengths: number[];
    /**
     * @param nx Number of boxes along x.
     * @param ny Number of boxes along y.
     * @param nz Number of boxes along z.
     */
    constructor(aabbMin?: Vec3, aabbMax?: Vec3, nx?: number, ny?: number, nz?: number);
    /**
     * Get all the collision pairs in the physics world
     */
    collisionPairs(world: World, pairs1: Body[], pairs2: Body[]): void;
}
