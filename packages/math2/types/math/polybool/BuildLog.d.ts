import { SegmentBool } from './Intersecter';
import { Vec2 } from './Geometry';
import { Segment } from './Segment';
interface ISegFill {
    seg: Segment;
    fill: boolean;
}
export default class BuildLog {
    list: Array<{
        type: string;
        data: unknown;
    }>;
    nextSegmentId: number;
    curVert: number;
    push(type: string, data: unknown): void;
    info(msg: string, data?: any): void;
    segmentId(): number;
    checkIntersection(seg1: SegmentBool, seg2: SegmentBool): void;
    segmentDivide(seg: SegmentBool, p: Vec2): void;
    segmentChop(seg: SegmentBool): void;
    statusRemove(seg: SegmentBool): void;
    segmentUpdate(seg: SegmentBool): void;
    segmentNew(seg: SegmentBool, primary: boolean): void;
    tempStatus(seg: SegmentBool, above: SegmentBool | false, below: SegmentBool | false): void;
    rewind(seg: SegmentBool): void;
    status(seg: SegmentBool, above: SegmentBool | false, below: SegmentBool | false): void;
    vert(x: number): void;
    selected(segs: SegmentBool[]): void;
    chainStart(sf: ISegFill, closed: boolean): void;
    chainNew(sf: ISegFill, closed: boolean): void;
    chainMatch(index: number, closed: boolean): void;
    chainClose(index: number, closed: boolean): void;
    chainAddHead(index: number, sf: ISegFill, closed: boolean): void;
    chainAddTail(index: number, sf: ISegFill, closed: boolean): void;
    chainSimplifyHead(index: number, sf: ISegFill, closed: boolean): void;
    chainSimplifyTail(index: number, sf: ISegFill, closed: boolean): void;
    chainSimplifyClose(index: number, sf: ISegFill, closed: boolean): void;
    chainSimplifyJoin(index1: number, index2: number, sf: ISegFill, closed: boolean): void;
    chainConnect(index1: number, index2: number, closed: boolean): void;
    chainReverse(index: number, closed: boolean): void;
    chainJoin(index1: number, index2: number, closed: boolean): void;
    done(): void;
}
export {};
