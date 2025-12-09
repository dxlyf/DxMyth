import { Body } from '../objects/Body';
/**
 * Collision "matrix".
 * It's actually a triangular-shaped array of whether two bodies are touching this step, for reference next step
 */
export declare class ArrayCollisionMatrix {
    /**
     * The matrix storage.
     */
    matrix: number[];
    constructor();
    /**
     * Get an element
     */
    get(bi: Body, bj: Body): number;
    /**
     * Set an element
     */
    set(bi: Body, bj: Body, value: boolean): void;
    /**
     * Sets all elements to zero
     */
    reset(): void;
    /**
     * Sets the max number of objects
     */
    setNumObjects(n: number): void;
}
