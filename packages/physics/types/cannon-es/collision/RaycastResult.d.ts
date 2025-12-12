import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
import { Shape } from '../shapes/Shape';
/**
 * Storage for Ray casting data
 */
export declare class RaycastResult {
    /**
     * rayFromWorld
     */
    rayFromWorld: Vec3;
    /**
     * rayToWorld
     */
    rayToWorld: Vec3;
    /**
     * hitNormalWorld
     */
    hitNormalWorld: Vec3;
    /**
     * hitPointWorld
     */
    hitPointWorld: Vec3;
    /**
     * hasHit
     */
    hasHit: boolean;
    /**
     * shape
     */
    shape: Shape | null;
    /**
     * body
     */
    body: Body | null;
    /**
     * The index of the hit triangle, if the hit shape was a trimesh
     */
    hitFaceIndex: number;
    /**
     * Distance to the hit. Will be set to -1 if there was no hit
     */
    distance: number;
    /**
     * If the ray should stop traversing the bodies
     */
    shouldStop: boolean;
    constructor();
    /**
     * Reset all result data.
     */
    reset(): void;
    /**
     * abort
     */
    abort(): void;
    /**
     * Set result data.
     */
    set(rayFromWorld: Vec3, rayToWorld: Vec3, hitNormalWorld: Vec3, hitPointWorld: Vec3, shape: Shape, body: Body, distance: number): void;
}
