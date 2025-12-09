import { MassData } from '../../dynamics/Body';
import { AABBValue, RayCastOutput, RayCastInput } from '../AABB';
import { DistanceProxy } from '../Distance';
import { Transform, TransformValue } from '../../common/Transform';
import { Vec2, Vec2Value } from '../../common/Vec2';
import { Shape } from '../Shape';
import { EdgeShape } from './EdgeShape';
declare module "./ChainShape" {
    /** @hidden @deprecated Use new keyword. */
    function ChainShape(vertices?: Vec2Value[], loop?: boolean): ChainShape;
}
/**
 * A chain shape is a free form sequence of line segments. The chain has
 * two-sided collision, so you can use inside and outside collision. Therefore,
 * you may use any winding order. Connectivity information is used to create
 * smooth collisions.
 *
 * WARNING: The chain will not collide properly if there are self-intersections.
 */
export declare class ChainShape extends Shape {
    static TYPE: "chain";
    /** @hidden */ m_type: "chain";
    /** @hidden */ m_radius: number;
    /** @hidden */ m_vertices: Vec2[];
    /** @hidden */ m_count: number;
    /** @hidden */ m_prevVertex: Vec2 | null;
    /** @hidden */ m_nextVertex: Vec2 | null;
    /** @hidden */ m_hasPrevVertex: boolean;
    /** @hidden */ m_hasNextVertex: boolean;
    /** @hidden */ m_isLoop: boolean;
    constructor(vertices?: Vec2Value[], loop?: boolean);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, fixture: any, restore: any): ChainShape;
    getType(): "chain";
    getRadius(): number;
    /**
     * @internal
     * Create a loop. This automatically adjusts connectivity.
     *
     * @param vertices an array of vertices, these are copied
     */
    _createLoop(vertices: Vec2Value[]): ChainShape;
    /**
     * @internal
     * Create a chain with isolated end vertices.
     *
     * @param vertices an array of vertices, these are copied
     */
    _createChain(vertices: Vec2Value[]): ChainShape;
    /** @hidden */
    _reset(): void;
    /**
     * Establish connectivity to a vertex that precedes the first vertex. Don't call
     * this for loops.
     */
    setPrevVertex(prevVertex: Vec2): void;
    getPrevVertex(): Vec2;
    /**
     * Establish connectivity to a vertex that follows the last vertex. Don't call
     * this for loops.
     */
    setNextVertex(nextVertex: Vec2): void;
    getNextVertex(): Vec2;
    /**
     * @internal @deprecated Shapes should be treated as immutable.
     *
     * clone the concrete shape.
     */
    _clone(): ChainShape;
    /**
     * Get the number of child primitives.
     */
    getChildCount(): number;
    getChildEdge(edge: EdgeShape, childIndex: number): void;
    getVertex(index: number): Vec2;
    isLoop(): boolean;
    /**
     * Test a point for containment in this shape. This only works for convex
     * shapes.
     *
     * This always return false.
     *
     * @param xf The shape world transform.
     * @param p A point in world coordinates.
     */
    testPoint(xf: TransformValue, p: Vec2Value): false;
    /**
     * Cast a ray against a child shape.
     *
     * @param output The ray-cast results.
     * @param input The ray-cast input parameters.
     * @param xf The transform to be applied to the shape.
     * @param childIndex The child shape index
     */
    rayCast(output: RayCastOutput, input: RayCastInput, xf: Transform, childIndex: number): boolean;
    /**
     * Given a transform, compute the associated axis aligned bounding box for a
     * child shape.
     *
     * @param aabb Returns the axis aligned box.
     * @param xf The world transform of the shape.
     * @param childIndex The child shape
     */
    computeAABB(aabb: AABBValue, xf: TransformValue, childIndex: number): void;
    /**
     * Compute the mass properties of this shape using its dimensions and density.
     * The inertia tensor is computed about the local origin.
     *
     * Chains have zero mass.
     *
     * @param massData Returns the mass data for this shape.
     * @param density The density in kilograms per meter squared.
     */
    computeMass(massData: MassData, density?: number): void;
    computeDistanceProxy(proxy: DistanceProxy, childIndex: number): void;
}
export { ChainShape as Chain };
