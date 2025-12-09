import { Shape } from './Shape';
import { Vec2, Vec2Value } from '../common/Vec2';
import { Transform, TransformValue } from '../common/Transform';
/**
 * Input for Distance. You have to option to use the shape radii in the
 * computation. Even
 */
export declare class DistanceInput {
    readonly proxyA: DistanceProxy;
    readonly proxyB: DistanceProxy;
    readonly transformA: Transform;
    readonly transformB: Transform;
    useRadii: boolean;
    recycle(): void;
}
/**
 * Output for Distance.
 */
export declare class DistanceOutput {
    /** closest point on shapeA */
    pointA: Vec2Value;
    /** closest point on shapeB */
    pointB: Vec2Value;
    distance: number;
    /** iterations number of GJK iterations used */
    iterations: number;
    recycle(): void;
}
/**
 * Used to warm start Distance. Set count to zero on first call.
 */
export declare class SimplexCache {
    /** length or area */
    metric: number;
    /** vertices on shape A */
    indexA: number[];
    /** vertices on shape B */
    indexB: number[];
    count: number;
    recycle(): void;
}
/**
 * Compute the closest points between two shapes. Supports any combination of:
 * CircleShape, PolygonShape, EdgeShape. The simplex cache is input/output. On
 * the first call set SimplexCache.count to zero.
 */
export declare const Distance: {
    (output: DistanceOutput, cache: SimplexCache, input: DistanceInput): void;
    testOverlap: (shapeA: Shape, indexA: number, shapeB: Shape, indexB: number, xfA: TransformValue, xfB: TransformValue) => boolean;
    Input: typeof DistanceInput;
    Output: typeof DistanceOutput;
    Proxy: typeof DistanceProxy;
    Cache: typeof SimplexCache;
};
/**
 * A distance proxy is used by the GJK algorithm. It encapsulates any shape.
 */
export declare class DistanceProxy {
    /** @internal */ m_vertices: Vec2Value[];
    /** @internal */ m_count: number;
    /** @internal */ m_radius: number;
    recycle(): void;
    /**
     * Get the vertex count.
     */
    getVertexCount(): number;
    /**
     * Get a vertex by index. Used by Distance.
     */
    getVertex(index: number): Vec2Value;
    /**
     * Get the supporting vertex index in the given direction.
     */
    getSupport(d: Vec2Value): number;
    /**
     * Get the supporting vertex in the given direction.
     */
    getSupportVertex(d: Vec2Value): Vec2Value;
    /**
     * Initialize the proxy using the given shape. The shape must remain in scope
     * while the proxy is in use.
     */
    set(shape: Shape, index: number): void;
    /**
     * Initialize the proxy using a vertex cloud and radius. The vertices
     * must remain in scope while the proxy is in use.
     */
    setVertices(vertices: Vec2Value[], count: number, radius: number): void;
}
/**
 * Determine if two generic shapes overlap.
 */
export declare const testOverlap: (shapeA: Shape, indexA: number, shapeB: Shape, indexB: number, xfA: TransformValue, xfB: TransformValue) => boolean;
/**
 * Input parameters for ShapeCast
 */
export declare class ShapeCastInput {
    readonly proxyA: DistanceProxy;
    readonly proxyB: DistanceProxy;
    readonly transformA: Transform;
    readonly transformB: Transform;
    readonly translationB: Vec2;
    recycle(): void;
}
/**
 * Output results for b2ShapeCast
 */
export declare class ShapeCastOutput {
    point: Vec2;
    normal: Vec2;
    lambda: number;
    iterations: number;
}
/**
 * Perform a linear shape cast of shape B moving and shape A fixed. Determines
 * the hit point, normal, and translation fraction.
 *
 * @returns true if hit, false if there is no hit or an initial overlap
 */
export declare const ShapeCast: (output: ShapeCastOutput, input: ShapeCastInput) => boolean;
