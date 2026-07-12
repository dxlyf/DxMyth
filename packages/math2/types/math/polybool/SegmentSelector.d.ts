import { SegmentBool } from './Intersecter';
import { default as BuildLog } from './BuildLog';
export declare class SegmentSelector {
    static union(segments: SegmentBool[], log: BuildLog | null): SegmentBool[];
    static intersect(segments: SegmentBool[], log: BuildLog | null): SegmentBool[];
    static difference(segments: SegmentBool[], log: BuildLog | null): SegmentBool[];
    static differenceRev(segments: SegmentBool[], log: BuildLog | null): SegmentBool[];
    static xor(segments: SegmentBool[], log: BuildLog | null): SegmentBool[];
}
