import { Vec2, Vec2Value } from '../../common/Vec2';
import { Shape } from '../Shape';
import { AABBValue, RayCastInput, RayCastOutput } from '../AABB';
import { Transform, TransformValue } from '../../common/Transform';
import { MassData } from '../../dynamics/Body';
import { DistanceProxy } from '../Distance';
declare module "./CircleShape" {
    /** @hidden @deprecated Use new keyword. */
    function CircleShape(position: Vec2Value, radius?: number): CircleShape;
    /** @hidden @deprecated Use new keyword. */
    function CircleShape(radius?: number): CircleShape;
}
/** Circle shape. */
export declare class CircleShape extends Shape {
    static TYPE: "circle";
    /** @hidden */ m_type: "circle";
    /** @hidden */ m_p: Vec2;
    /** @hidden */ m_radius: number;
    constructor(position: Vec2Value, radius?: number);
    constructor(radius?: number);
    /** @hidden */
    _serialize(): object;
    /** @hidden */
    static _deserialize(data: any): CircleShape;
    /** @hidden */
    _reset(): void;
    getType(): "circle";
    getRadius(): number;
    getCenter(): Vec2;
    /**
     * @internal @deprecated Shapes should be treated as immutable.
     *
     * clone the concrete shape.
     */
    _clone(): CircleShape;
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
    computeDistanceProxy(proxy: DistanceProxy): void;
}
export { CircleShape as Circle };
