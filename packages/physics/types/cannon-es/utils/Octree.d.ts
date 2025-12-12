import { AABB } from '../collision/AABB';
import { Transform } from '../math/Transform';
import { Ray } from '../collision/Ray';
/**
 * OctreeNode
 */
declare class OctreeNode {
    /** The root node */
    root: OctreeNode | null;
    /** Boundary of this node */
    aabb: AABB;
    /** Contained data at the current node level */
    data: number[];
    /** Children to this node */
    children: OctreeNode[];
    constructor(options?: {
        /** The root node */
        root?: Octree | null;
        /** Boundary of this node */
        aabb?: AABB;
    });
    /**
     * reset
     */
    reset(): void;
    /**
     * Insert data into this node
     * @return True if successful, otherwise false
     */
    insert(aabb: AABB, elementData: number, level?: number): boolean;
    /**
     * Create 8 equally sized children nodes and put them in the `children` array.
     */
    subdivide(): void;
    /**
     * Get all data, potentially within an AABB
     * @return The "result" object
     */
    aabbQuery(aabb: AABB, result: number[]): number[];
    /**
     * Get all data, potentially intersected by a ray.
     * @return The "result" object
     */
    rayQuery(ray: Ray, treeTransform: Transform, result: number[]): number[];
    /**
     * removeEmptyNodes
     */
    removeEmptyNodes(): void;
}
/**
 * Octree
 */
export declare class Octree extends OctreeNode {
    /**
     * Maximum subdivision depth
     * @default 8
     */
    maxDepth: number;
    /**
     * @param aabb The total AABB of the tree
     */
    constructor(aabb?: AABB, options?: {
        /**
         * Maximum subdivision depth
         * @default 8
         */
        maxDepth?: number;
    });
}
export {};
