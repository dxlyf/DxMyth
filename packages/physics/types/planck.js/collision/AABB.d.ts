import { Vec2, Vec2Value } from '../common/Vec2';
/**
 * Ray-cast input data. The ray extends from `p1` to `p1 + maxFraction * (p2 - p1)`.
 */
export interface RayCastInput {
    p1: Vec2Value;
    p2: Vec2Value;
    maxFraction: number;
}
export type RayCastCallback = (subInput: RayCastInput, id: number) => number;
/**
 * Ray-cast output data. The ray hits at `p1 + fraction * (p2 - p1)`,
 * where `p1` and `p2` come from RayCastInput.
 */
export interface RayCastOutput {
    normal: Vec2;
    fraction: number;
}
/** Axis-aligned bounding box */
export interface AABBValue {
    lowerBound: Vec2Value;
    upperBound: Vec2Value;
}
declare module "./AABB" {
    /** @hidden @deprecated Use new keyword. */
    function AABB(lower?: Vec2Value, upper?: Vec2Value): AABB;
}
/** Axis-aligned bounding box */
export declare class AABB {
    lowerBound: Vec2;
    upperBound: Vec2;
    constructor(lower?: Vec2Value, upper?: Vec2Value);
    /**
     * Verify that the bounds are sorted.
     */
    isValid(): boolean;
    static isValid(obj: any): boolean;
    static assert(o: any): void;
    /**
     * Get the center of the AABB.
     */
    getCenter(): Vec2;
    /**
     * Get the extents of the AABB (half-widths).
     */
    getExtents(): Vec2;
    /**
     * Get the perimeter length.
     */
    getPerimeter(): number;
    /**
     * Combine one or two AABB into this one.
     */
    combine(a: AABBValue, b?: AABBValue): void;
    combinePoints(a: Vec2Value, b: Vec2Value): void;
    set(aabb: AABBValue): void;
    contains(aabb: AABBValue): boolean;
    extend(value: number): AABB;
    static extend(out: AABBValue, value: number): AABBValue;
    static testOverlap(a: AABBValue, b: AABBValue): boolean;
    static areEqual(a: AABBValue, b: AABBValue): boolean;
    static diff(a: AABBValue, b: AABBValue): number;
    rayCast(output: RayCastOutput, input: RayCastInput): boolean;
    /** @hidden */
    toString(): string;
    static combinePoints(out: AABBValue, a: Vec2Value, b: Vec2Value): AABBValue;
    static combinedPerimeter(a: AABBValue, b: AABBValue): number;
}
