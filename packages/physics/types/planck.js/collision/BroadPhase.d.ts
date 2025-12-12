import { Vec2Value } from '../common/Vec2';
import { AABB, AABBValue, RayCastCallback, RayCastInput } from './AABB';
import { DynamicTree, DynamicTreeQueryCallback } from './DynamicTree';
import { FixtureProxy } from '../dynamics/Fixture';
/**
 * The broad-phase wraps and extends a dynamic-tree to keep track of moved
 * objects and query them on update.
 */
export declare class BroadPhase {
    m_tree: DynamicTree<FixtureProxy>;
    m_moveBuffer: number[];
    m_callback: (userDataA: any, userDataB: any) => void;
    m_queryProxyId: number;
    /**
     * Get user data from a proxy. Returns null if the id is invalid.
     */
    getUserData(proxyId: number): FixtureProxy;
    /**
     * Test overlap of fat AABBs.
     */
    testOverlap(proxyIdA: number, proxyIdB: number): boolean;
    /**
     * Get the fat AABB for a proxy.
     */
    getFatAABB(proxyId: number): AABB;
    /**
     * Get the number of proxies.
     */
    getProxyCount(): number;
    /**
     * Get the height of the embedded tree.
     */
    getTreeHeight(): number;
    /**
     * Get the balance (integer) of the embedded tree.
     */
    getTreeBalance(): number;
    /**
     * Get the quality metric of the embedded tree.
     */
    getTreeQuality(): number;
    /**
     * Query an AABB for overlapping proxies. The callback class is called for each
     * proxy that overlaps the supplied AABB.
     */
    query: (aabb: AABBValue, queryCallback: DynamicTreeQueryCallback) => void;
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
    /**
     * Shift the world origin. Useful for large worlds. The shift formula is:
     * position -= newOrigin
     *
     * @param newOrigin The new origin with respect to the old origin
     */
    shiftOrigin(newOrigin: Vec2Value): void;
    /**
     * Create a proxy with an initial AABB. Pairs are not reported until UpdatePairs
     * is called.
     */
    createProxy(aabb: AABBValue, userData: FixtureProxy): number;
    /**
     * Destroy a proxy. It is up to the client to remove any pairs.
     */
    destroyProxy(proxyId: number): void;
    /**
     * Call moveProxy as many times as you like, then when you are done call
     * UpdatePairs to finalized the proxy pairs (for your time step).
     */
    moveProxy(proxyId: number, aabb: AABB, displacement: Vec2Value): void;
    /**
     * Call to trigger a re-processing of it's pairs on the next call to
     * UpdatePairs.
     */
    touchProxy(proxyId: number): void;
    bufferMove(proxyId: number): void;
    unbufferMove(proxyId: number): void;
    /**
     * Update the pairs. This results in pair callbacks. This can only add pairs.
     */
    updatePairs(addPairCallback: (userDataA: FixtureProxy, userDataB: FixtureProxy) => void): void;
    queryCallback: (proxyId: number) => boolean;
}
