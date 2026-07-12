import { Geometry, Vec6 } from './Geometry';
import { SegmentBool } from './Intersecter';
import { default as BuildLog } from './BuildLog';
import { Segment, SegmentLine, SegmentCurve } from './Segment';
export interface IPolyBoolReceiver {
    beginPath: () => void;
    moveTo: (x: number, y: number) => void;
    lineTo: (x: number, y: number) => void;
    bezierCurveTo: (cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) => void;
    closePath: () => void;
}
export declare function joinLines(seg1: SegmentLine, seg2: SegmentLine, geo: Geometry): SegmentLine | false;
export declare function joinCurves(seg1: SegmentCurve, seg2: SegmentCurve, geo: Geometry): SegmentCurve | false;
export declare function joinSegments(seg1: Segment | undefined, seg2: Segment | undefined, geo: Geometry): Segment | false;
export declare function SegmentChainer(segments: SegmentBool[], geo: Geometry, log: BuildLog | null): Segment[][];
export declare function segmentsToReceiver<T extends IPolyBoolReceiver>(segments: Segment[][], geo: Geometry, receiver: T, matrix: Vec6): T;
