import { Vec2, Vec6, Geometry } from './Geometry';
import { Shape, ShapeCombined } from './Shape';
import { default as BuildLog } from './BuildLog';
export * from './Segment';
export * from './Geometry';
export * from './Intersecter';
export * from './SegmentSelector';
export * from './SegmentChainer';
export * from './Shape';
export * from './BuildLog';
export interface Polygon {
    regions: Array<Array<Vec2 | Vec6>>;
    inverted: boolean;
}
export interface Segments {
    shape: Shape;
    inverted: boolean;
}
export interface CombinedSegments {
    shape: ShapeCombined;
    inverted1: boolean;
    inverted2: boolean;
}
export declare class PolyBool {
    private readonly geo;
    private log;
    constructor(geo?: Geometry, log?: BuildLog | null);
    shape(): Shape;
    buildLog(enable: boolean): {
        type: string;
        data: unknown;
    }[];
    segments(poly: Polygon): Segments;
    combine(segments1: Segments, segments2: Segments): CombinedSegments;
    selectUnion(combined: CombinedSegments): Segments;
    selectIntersect(combined: CombinedSegments): Segments;
    selectDifference(combined: CombinedSegments): Segments;
    selectDifferenceRev(combined: CombinedSegments): Segments;
    selectXor(combined: CombinedSegments): Segments;
    polygon(segments: Segments): Polygon;
    union(poly1: Polygon, poly2: Polygon): Polygon;
    intersect(poly1: Polygon, poly2: Polygon): Polygon;
    difference(poly1: Polygon, poly2: Polygon): Polygon;
    differenceRev(poly1: Polygon, poly2: Polygon): Polygon;
    xor(poly1: Polygon, poly2: Polygon): Polygon;
}
declare const polybool: PolyBool;
export default polybool;
