import { MassData } from '../../dynamics/Body';
import { RayCastOutput, RayCastInput, AABBValue } from '../AABB';
import { DistanceProxy } from '../Distance';
import { Transform, TransformValue } from '../../common/Transform';
import { Vec2, Vec2Value } from '../../common/Vec2';
import { Shape } from '../Shape';
declare module "./PolygonShape" {
    /** @hidden @deprecated Use new keyword. */
    function PolygonShape(vertices?: Vec2Value[]): PolygonShape;
}
/**
 * A convex polygon. It is assumed that the interior of the polygon is to the
 * left of each edge. Polygons have a maximum number of vertices equal to
 * Settings.maxPolygonVertices. In most cases you should not need many vertices
 * for a convex polygon. extends Shape
 */
export declare class PolygonShape extends Shape {
    static TYPE: "polygon";
    /** @hidden */ m_type: "polygon";
    /** @hidden */ m_centroid: Vec2;
    /** @hidden */ m_vertices: Vec2[];
    /** @hidden */ m_normals: Vec2[];
    /** @hidden */ m_count: number;
    /** @hidden */ m_radius: number;
    constructor(vertices?: Vec2Value[]);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any, fixture: any, restore: any): PolygonShape;
    getType(): "polygon";
    getRadius(): number;
    /**
     * @internal @deprecated Shapes should be treated as immutable.
     *
     * clone the concrete shape.
     */
    _clone(): PolygonShape;
    /**
     * Get the number of child primitives.
     */
    getChildCount(): 1;
    /** @hidden */
    _reset(): void;
    /**
     * @internal
     *
     * Create a convex hull from the given array of local points. The count must be
     * in the range [3, Settings.maxPolygonVertices].
     *
     * Warning: the points may be re-ordered, even if they form a convex polygon
     * Warning: collinear points are handled but not removed. Collinear points may
     * lead to poor stacking behavior.
     */
    _set(vertices: Vec2Value[]): void;
    /** @internal */ _setAsBox(hx: number, hy: number, center?: Vec2Value, angle?: number): void;
    /**
     * Test a point for containment in this shape. This only works for convex
     * shapes.
     *
     * @param xf The shape world transform.
     * @param p A point in world coordinates.
     */
    testPoint(xf: TransformValue, p: Vec2Value): boolean;
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
    computeMass(massData: MassData, density: number): void;
    /**
     * Validate convexity. This is a very time consuming operation.
     * @returns true if valid
     */
    validate(): boolean;
    computeDistanceProxy(proxy: DistanceProxy): void;
}
export { PolygonShape as Polygon };
