import { Bounds } from './bounds';
import { Line } from './line';
import { Point } from './point';
import { Polygon } from './polygon';
import { GeoShape, SimplePoint, TransformMatrix } from './utilities';
/** A rectangle, defined by its top left vertex, width and height. */
export declare class Rectangle implements GeoShape {
    readonly p: Point;
    readonly w: number;
    readonly h: number;
    readonly type = "rectangle";
    constructor(p: Point, w?: number, h?: number);
    /** Creates the smallest rectangle containing all given points. */
    static aroundPoints(points: Iterable<SimplePoint>): Rectangle;
    get center(): Point;
    get centroid(): Point;
    get circumference(): number;
    get area(): number;
    get signedArea(): number;
    /** @returns {Segment[]} */
    get edges(): import('./line').Segment[];
    /** @returns {Point[]} */
    get points(): Point[];
    /** A polygon class representing this rectangle. */
    get polygon(): Polygon;
    get bounds(): Bounds;
    collision(r: Rectangle): boolean;
    padding(top: number, right: number, bottom: number, left: number): Rectangle;
    get unsigned(): Rectangle;
    contains(p: Point, tolerance?: number): boolean;
    project(p: SimplePoint): Point;
    at(t: number): Point;
    offset(p: Point): number;
    get oriented(): Polygon;
    transform(m: TransformMatrix): Polygon;
    /** Rotates this rectangle by a given angle (in radians), optionally around point `c`. */
    rotate(a: number, c?: Point): Polygon | this;
    reflect(l: Line): Polygon;
    scale(sx: number, sy?: number): Rectangle;
    shift(x: number, y?: number): Rectangle;
    translate(p: SimplePoint): Rectangle;
    equals(other: Polygon): boolean;
    toString(): string;
}
