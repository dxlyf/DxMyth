import { Vec3 } from '../math/Vec3';
/**
 * An element containing 6 entries, 3 spatial and 3 rotational degrees of freedom.
 */
export declare class JacobianElement {
    /**
     * spatial
     */
    spatial: Vec3;
    /**
     * rotational
     */
    rotational: Vec3;
    constructor();
    /**
     * Multiply with other JacobianElement
     */
    multiplyElement(element: JacobianElement): number;
    /**
     * Multiply with two vectors
     */
    multiplyVectors(spatial: Vec3, rotational: Vec3): number;
}
