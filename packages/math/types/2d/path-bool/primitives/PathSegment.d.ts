import { AABB } from './AABB';
import { Vector } from './Vector';
export type PathLineSegment = ["L", Vector, Vector];
export type PathCubicSegment = ["C", Vector, Vector, Vector, Vector];
export type PathQuadraticSegment = ["Q", Vector, Vector, Vector];
export type PathArcSegment = [
    "A",
    Vector,
    number,
    number,
    number,
    boolean,
    boolean,
    Vector
];
export type PathSegment = PathLineSegment | PathCubicSegment | PathQuadraticSegment | PathArcSegment;
type PathArcSegmentCenterParametrization = {
    center: Vector;
    theta1: number;
    deltaTheta: number;
    rx: number;
    ry: number;
    phi: number;
};
export declare function getStartPoint(seg: PathSegment): Vector;
export declare function getEndPoint(seg: PathSegment): Vector;
export declare function reversePathSegment(seg: PathSegment): PathSegment;
export declare const arcSegmentToCenter: ([_A, xy1, rx, ry, phi, fA, fS, xy2,]: PathArcSegment) => PathArcSegmentCenterParametrization | null;
export declare const arcSegmentFromCenter: ({ center, theta1, deltaTheta, rx, ry, phi, }: PathArcSegmentCenterParametrization) => PathArcSegment;
export declare const samplePathSegmentAt: (seg: PathSegment, t: number) => Vector;
export declare const arcSegmentToCubics: (arc: PathArcSegment, maxDeltaTheta?: number) => PathCubicSegment[] | [PathLineSegment];
export declare function pathSegmentBoundingBox(seg: PathSegment): AABB;
export declare function splitCubicSegmentAt(seg: PathCubicSegment, t: number): [PathCubicSegment, PathCubicSegment];
export declare function splitSegmentAt(seg: PathSegment, t: number): [PathSegment, PathSegment];
export {};
