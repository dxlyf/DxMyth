import { Vec2, Geometry } from './Geometry';
import { IPolyBoolReceiver } from './SegmentChainer';
export interface SegmentTValuePairs {
    kind: "tValuePairs";
    tValuePairs: Vec2[];
}
export interface SegmentTRangePairs {
    kind: "tRangePairs";
    tStart: Vec2;
    tEnd: Vec2;
}
export declare class SegmentTValuesBuilder {
    tValues: number[];
    geo: Geometry;
    constructor(geo: Geometry);
    addArray(ts: number[]): this;
    add(t: number): this;
    list(): number[];
}
export declare class SegmentTValuePairsBuilder {
    tValuePairs: Vec2[];
    allowOutOfRange: boolean;
    geo: Geometry;
    constructor(allowOutOfRange: boolean, geo: Geometry);
    add(t1: number, t2: number): this;
    list(): Vec2[];
    done(): SegmentTValuePairs | null;
}
export declare abstract class SegmentBase<T> {
    abstract copy(): T;
    abstract isEqual(other: T): boolean;
    abstract start(): Vec2;
    abstract start2(): Vec2;
    abstract end2(): Vec2;
    abstract end(): Vec2;
    abstract setStart(p: Vec2): void;
    abstract setEnd(p: Vec2): void;
    abstract point(t: number): Vec2;
    abstract split(t: number[]): T[];
    abstract reverse(): T;
    abstract boundingBox(): [Vec2, Vec2];
    abstract pointOn(p: Vec2): boolean;
    abstract draw<TRecv extends IPolyBoolReceiver>(ctx: TRecv): TRecv;
}
export declare class SegmentLine extends SegmentBase<SegmentLine> {
    p0: Vec2;
    p1: Vec2;
    geo: Geometry;
    constructor(p0: Vec2, p1: Vec2, geo: Geometry);
    copy(): SegmentLine;
    isEqual(other: SegmentLine): boolean;
    start(): Vec2;
    start2(): Vec2;
    end2(): Vec2;
    end(): Vec2;
    setStart(p0: Vec2): void;
    setEnd(p1: Vec2): void;
    point(t: number): Vec2;
    split(ts: number[]): SegmentLine[];
    reverse(): SegmentLine;
    boundingBox(): [Vec2, Vec2];
    pointOn(p: Vec2): boolean;
    draw<TRecv extends IPolyBoolReceiver>(ctx: TRecv): TRecv;
}
export declare class SegmentCurve extends SegmentBase<SegmentCurve> {
    p0: Vec2;
    p1: Vec2;
    p2: Vec2;
    p3: Vec2;
    geo: Geometry;
    constructor(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, geo: Geometry);
    copy(): SegmentCurve;
    isEqual(other: SegmentCurve): boolean;
    start(): Vec2;
    start2(): Vec2;
    end2(): Vec2;
    end(): Vec2;
    setStart(p0: Vec2): void;
    setEnd(p3: Vec2): void;
    point(t: number): Vec2;
    split(ts: number[]): SegmentCurve[];
    reverse(): SegmentCurve;
    getCubicCoefficients(axis: number): [number, number, number, number];
    boundingTValues(): number[];
    inflectionTValues(): number[];
    boundingBox(): [Vec2, Vec2];
    mapXtoT(x: number, force?: boolean): number | false;
    mapXtoY(x: number, force?: boolean): number | false;
    pointOn(p: Vec2): boolean;
    toLine(): SegmentLine | null;
    draw<TRecv extends IPolyBoolReceiver>(ctx: TRecv): TRecv;
}
export type Segment = SegmentLine | SegmentCurve;
export declare function projectPointOntoSegmentLine(p: Vec2, seg: SegmentLine): number;
export declare function segmentLineIntersectSegmentLine(segA: SegmentLine, segB: SegmentLine, allowOutOfRange: boolean): SegmentTValuePairs | SegmentTRangePairs | null;
export declare function segmentLineIntersectSegmentCurve(segA: SegmentLine, segB: SegmentCurve, allowOutOfRange: boolean, invert: boolean): SegmentTValuePairs | null;
export declare function segmentCurveIntersectSegmentCurve(segA: SegmentCurve, segB: SegmentCurve, allowOutOfRange: boolean): SegmentTValuePairs | SegmentTRangePairs | null;
export declare function segmentsIntersect(segA: Segment, segB: Segment, allowOutOfRange: boolean): SegmentTValuePairs | SegmentTRangePairs | null;
