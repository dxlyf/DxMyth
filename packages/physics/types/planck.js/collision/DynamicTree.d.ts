import { Vec2Value } from '../common/Vec2';
import { AABB, AABBValue, RayCastCallback, RayCastInput } from './AABB';
export type DynamicTreeQueryCallback = (nodeId: number) => boolean;
/**
 * A node in the dynamic tree. The client does not interact with this directly.
 */
export declare class TreeNode<T> {
    id: number;
    /** Enlarged AABB */
    aabb: AABB;
    userData: T;
    parent: TreeNode<T>;
    child1: TreeNode<T>;
    child2: TreeNode<T>;
    /** 0: leaf, -1: free node */
    height: number;
    constructor(id?: number);
    /** @internal */
    toString(): string;
    isLeaf(): boolean;
}
/**
 * A dynamic AABB tree broad-phase, inspired by Nathanael Presson's btDbvt. A
 * dynamic tree arranges data in a binary tree to accelerate queries such as
 * volume queries and ray casts. Leafs are proxies with an AABB. In the tree we
 * expand the proxy AABB by `aabbExtension` so that the proxy AABB is bigger
 * than the client object. This allows the client object to move by small
 * amounts without triggering a tree update.
 *
 * Nodes are pooled and relocatable, so we use node indices rather than
 * pointers.
 */
export declare class DynamicTree<T> {
    m_root: TreeNode<T>;
    m_lastProxyId: number;
    m_nodes: {
        [id: number]: TreeNode<T>;
    };
    constructor();
    /**
     * Get proxy user data.
     *
     * @return the proxy user data or 0 if the id is invalid.
     */
    getUserData(id: number): T;
    /**
     * Get the fat AABB for a node id.
     *
     * @return the proxy user data or 0 if the id is invalid.
     */
    getFatAABB(id: number): AABB;
    allocateNode(): TreeNode<T>;
    freeNode(node: TreeNode<T>): void;
    /**
     * Create a proxy in the tree as a leaf node. We return the index of the node
     * instead of a pointer so that we can grow the node pool.
     *
     * Create a proxy. Provide a tight fitting AABB and a userData pointer.
     */
    createProxy(aabb: AABBValue, userData: T): number;
    /**
     * Destroy a proxy. This asserts if the id is invalid.
     */
    destroyProxy(id: number): void;
    /**
     * Move a proxy with a swepted AABB. If the proxy has moved outside of its
     * fattened AABB, then the proxy is removed from the tree and re-inserted.
     * Otherwise the function returns immediately.
     *
     * @param d Displacement
     *
     * @return true if the proxy was re-inserted.
     */
    moveProxy(id: number, aabb: AABBValue, d: Vec2Value): boolean;
    insertLeaf(leaf: TreeNode<T>): void;
    removeLeaf(leaf: TreeNode<T>): void;
    /**
     * Perform a left or right rotation if node A is imbalanced. Returns the new
     * root index.
     */
    balance(iA: TreeNode<T>): TreeNode<T>;
    /**
     * Compute the height of the binary tree in O(N) time. Should not be called
     * often.
     */
    getHeight(): number;
    /**
     * Get the ratio of the sum of the node areas to the root area.
     */
    getAreaRatio(): number;
    /**
     * Compute the height of a sub-tree.
     */
    computeHeight(id?: number): number;
    validateStructure(node: TreeNode<T>): void;
    validateMetrics(node: TreeNode<T>): void;
    /**
     * Validate this tree. For testing.
     */
    validate(): void;
    /**
     * Get the maximum balance of an node in the tree. The balance is the difference
     * in height of the two children of a node.
     */
    getMaxBalance(): number;
    /**
     * Build an optimal tree. Very expensive. For testing.
     */
    rebuildBottomUp(): void;
    /**
     * Shift the world origin. Useful for large worlds. The shift formula is:
     * position -= newOrigin
     *
     * @param newOrigin The new origin with respect to the old origin
     */
    shiftOrigin(newOrigin: Vec2Value): void;
    /**
     * Query an AABB for overlapping proxies. The callback class is called for each
     * proxy that overlaps the supplied AABB.
     */
    query(aabb: AABBValue, queryCallback: DynamicTreeQueryCallback): void;
    /**
     * Ray-cast against the proxies in the tree. This relies on the callback to
     * perform a exact ray-cast in the case were the proxy contains a shape. The
     * callback also performs the any collision filtering. This has performance
     * roughly equal to k * log(n), where k is the number of collisions and n is the
     * number of proxies in the tree.
     *
     * @param input The ray-cast input data. The ray extends from `p1` to `p1 + maxFraction * (p2 - p1)`.
     * @param rayCastCallback A function that is called for each proxy that is hit by the ray. If the return value is a positive number it will update the maxFraction of the ray cast input, and if it is zero it will terminate they ray cast.
     */
    rayCast(input: RayCastInput, rayCastCallback: RayCastCallback): void;
    private inputPool;
    private stackPool;
    private iteratorPool;
}
