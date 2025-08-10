import { AABB } from './primitives/AABB';
import { Vector } from './primitives/Vector';
type LineSegment = [Vector, Vector];
export declare class QuadTree<T> {
    readonly boundingBox: AABB;
    readonly depth: number;
    readonly innerNodeCapacity: number;
    protected subtrees: [QuadTree<T>, QuadTree<T>, QuadTree<T>, QuadTree<T>] | null;
    protected pairs: [AABB, T][];
    constructor(boundingBox: AABB, depth: number, innerNodeCapacity?: number);
    insert(boundingBox: AABB, value: T): boolean;
    find(boundingBox: AABB, set?: Set<T>): Set<T>;
    findOnLineSegment(seg: LineSegment, set?: Set<T>): Set<T>;
    private ensureSubtrees;
}
export {};
