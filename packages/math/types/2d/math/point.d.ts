import { Matrix2dLike } from './mat2d';
export interface PointLike {
    x: number;
    y: number;
}
export default class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    /**
     * Copy from another point
     */
    copy(other: PointLike): this;
    /**
     * Clone a point
     */
    clone(): Point;
    /**
     * Set x and y
     */
    set(x: number, y: number): this;
    /**
     * If equal to another point
     */
    equal(other: PointLike): boolean;
    /**
     * Add another point
     */
    add(other: PointLike): this;
    scale(scalar: number): void;
    scaleAndAdd(other: PointLike, scalar: number): void;
    /**
     * Sub another point
     */
    sub(other: PointLike): this;
    /**
     * Dot product with other point
     */
    dot(other: PointLike): number;
    /**
     * Get length of point
     */
    len(): number;
    /**
     * Get squared length
     */
    lenSquare(): number;
    /**
     * Normalize
     */
    normalize(): this;
    /**
     * Distance to another point
     */
    distance(other: PointLike): number;
    /**
     * Square distance to another point
     */
    distanceSquare(other: Point): number;
    /**
     * Negate
     */
    negate(): this;
    /**
     * Apply a transform matrix array.
     */
    transform(m: Matrix2dLike): this | undefined;
    toArray(out: number[]): number[];
    fromArray(input: number[]): void;
    static set(p: PointLike, x: number, y: number): void;
    static copy(p: PointLike, p2: PointLike): void;
    static len(p: PointLike): number;
    static lenSquare(p: PointLike): number;
    static dot(p0: PointLike, p1: PointLike): number;
    static add(out: PointLike, p0: PointLike, p1: PointLike): void;
    static sub(out: PointLike, p0: PointLike, p1: PointLike): void;
    static scale(out: PointLike, p0: PointLike, scalar: number): void;
    static scaleAndAdd(out: PointLike, p0: PointLike, p1: PointLike, scalar: number): void;
    static lerp(out: PointLike, p0: PointLike, p1: PointLike, t: number): void;
}
