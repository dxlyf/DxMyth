import { Shape } from '../Shape';
import { Transform, TransformValue } from '../../common/Transform';
import { Vec2, Vec2Value } from '../../common/Vec2';
import { AABBValue, RayCastInput, RayCastOutput } from '../AABB';
import { MassData } from '../../dynamics/Body';
import { DistanceProxy } from '../Distance';
declare module "./EdgeShape" {
    /** @hidden @deprecated Use new keyword. */
    function EdgeShape(v1?: Vec2Value, v2?: Vec2Value): EdgeShape;
}
/**
 * A line segment (edge) shape. These can be connected in chains or loops to
 * other edge shapes. The connectivity information is used to ensure correct
 * contact normals.
 */
export declare class EdgeShape extends Shape {
    static TYPE: "edge";
    /** @hidden */ m_type: "edge";
    /** @hidden */ m_radius: number;
    /** @hidden */ m_vertex1: Vec2;
    /** @hidden */ m_vertex2: Vec2;
    /** @hidden */ m_vertex0: Vec2;
    /** @hidden */ m_vertex3: Vec2;
    /** @hidden */ m_hasVertex0: boolean;
    /** @hidden */ m_hasVertex3: boolean;
    constructor(v1?: Vec2Value, v2?: Vec2Value);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any): EdgeShape;
    /** @hidden */
    _reset(): void;
    getRadius(): number;
    getType(): "edge";
    /** @internal @deprecated */
    setNext(v?: Vec2Value): EdgeShape;
    /**
     * Optional next vertex, used for smooth collision.
     */
    setNextVertex(v?: Vec2Value): EdgeShape;
    /**
     * Optional next vertex, used for smooth collision.
     */
    getNextVertex(): Vec2;
    /** @internal @deprecated */
    setPrev(v?: Vec2Value): EdgeShape;
    /**
     * Optional prev vertex, used for smooth collision.
     */
    setPrevVertex(v?: Vec2Value): EdgeShape;
    /**
     * Optional prev vertex, used for smooth collision.
     */
    getPrevVertex(): Vec2;
    /**
     * Set this as an isolated edge.
     */
    _set(v1: Vec2Value, v2: Vec2Value): EdgeShape;
    /**
     * @internal @deprecated Shapes should be treated as immutable.
     *
     * clone the concrete shape.
     */
    _clone(): EdgeShape;
    /**
     * Get the number of child primitives.
     */
    getChildCount(): 1;
    /**
     * Test a point for containment in this shape. This only works for convex
     * shapes.
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
     * @param massData Returns the mass data for this shape.
     * @param density The density in kilograms per meter squared.
     */
    computeMass(massData: MassData, density?: number): void;
    computeDistanceProxy(proxy: DistanceProxy): void;
}
export { EdgeShape as Edge };
