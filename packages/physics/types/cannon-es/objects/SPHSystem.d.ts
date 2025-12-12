import { Vec3 } from '../math/Vec3';
import { Body } from '../objects/Body';
/**
 * Smoothed-particle hydrodynamics system
 * @todo Make parameters customizable in the constructor
 */
export declare class SPHSystem {
    /**
     * The particles array.
     */
    particles: Body[];
    /**
     * Density of the system (kg/m3).
     * @default 1
     */
    density: number;
    /**
     * Distance below which two particles are considered to be neighbors.
     * It should be adjusted so there are about 15-20 neighbor particles within this radius.
     * @default 1
     */
    smoothingRadius: number;
    /**
     * @default 1
     */
    speedOfSound: number;
    /**
     * Viscosity of the system.
     * @default 0.01
     */
    viscosity: number;
    /**
     * @default 0.000001
     */
    eps: number;
    pressures: number[];
    densities: number[];
    neighbors: Body[][];
    constructor();
    /**
     * Add a particle to the system.
     */
    add(particle: Body): void;
    /**
     * Remove a particle from the system.
     */
    remove(particle: Body): void;
    /**
     * Get neighbors within smoothing volume, save in the array neighbors
     */
    getNeighbors(particle: Body, neighbors: Body[]): void;
    update(): void;
    w(r: number): number;
    gradw(rVec: Vec3, resultVec: Vec3): void;
    nablaw(r: number): number;
}
