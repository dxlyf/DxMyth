import { Body } from '../objects/Body';
/**
 * Records what objects are colliding with each other
 */
export declare class ObjectCollisionMatrix {
    /**
     * The matrix storage.
     */
    matrix: Record<string, boolean>;
    /**
     * @todo Remove useless constructor
     */
    constructor();
    /**
     * get
     */
    get(bi: Body, bj: Body): boolean;
    /**
     * set
     */
    set(bi: Body, bj: Body, value: boolean): void;
    /**
     * Empty the matrix
     */
    reset(): void;
    /**
     * Set max number of objects
     */
    setNumObjects(n: number): void;
}
