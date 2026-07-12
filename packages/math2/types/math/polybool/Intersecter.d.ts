import { Vec2, Geometry } from './Geometry';
import { default as BuildLog } from './BuildLog';
import { Segment, SegmentLine, SegmentCurve } from './Segment';
export interface SegmentBoolFill {
    above: boolean | null;
    below: boolean | null;
}
export interface ListBoolTransition<T> {
    before: T | null;
    after: T | null;
    insert: (node: T) => T;
}
export declare class SegmentBoolBase<T> {
    id: number;
    data: T;
    myFill: SegmentBoolFill;
    otherFill: SegmentBoolFill | null;
    closed: boolean;
    constructor(data: T, fill?: SegmentBoolFill | null, closed?: boolean, log?: BuildLog | null);
}
export declare class SegmentBoolLine extends SegmentBoolBase<SegmentLine> {
}
export declare class SegmentBoolCurve extends SegmentBoolBase<SegmentCurve> {
}
export type SegmentBool = SegmentBoolLine | SegmentBoolCurve;
export declare function copySegmentBool(seg: SegmentBool, log: BuildLog | null): SegmentBool;
export declare class EventBool {
    isStart: boolean;
    p: Vec2;
    seg: SegmentBool;
    primary: boolean;
    other: EventBool;
    status: EventBool | null;
    constructor(isStart: boolean, p: Vec2, seg: SegmentBool, primary: boolean);
}
export declare class ListBool<T> {
    readonly nodes: T[];
    remove(node: T): void;
    getIndex(node: T): number;
    isEmpty(): boolean;
    getHead(): T;
    removeHead(): void;
    insertBefore(node: T, check: (node: T) => number): void;
    findTransition(node: T, check: (node: T) => number): ListBoolTransition<T>;
}
export declare class Intersecter {
    private readonly selfIntersection;
    private readonly geo;
    private readonly events;
    private readonly status;
    private readonly log;
    private currentPath;
    constructor(selfIntersection: boolean, geo: Geometry, log?: BuildLog | null);
    compareEvents(aStart: boolean, a1: Vec2, a2: Vec2, aSeg: Segment, bStart: boolean, b1: Vec2, b2: Vec2, bSeg: Segment): number;
    addEvent(ev: EventBool): void;
    divideEvent(ev: EventBool, t: number, p: Vec2): EventBool;
    beginPath(): void;
    closePath(): void;
    addSegment(seg: SegmentBool, primary: boolean): EventBool;
    addLine(from: Vec2, to: Vec2, primary?: boolean): void;
    addCurve(from: Vec2, c1: Vec2, c2: Vec2, to: Vec2, primary?: boolean): void;
    compareSegments(seg1: Segment, seg2: Segment): number;
    statusFindSurrounding(ev: EventBool): ListBoolTransition<EventBool>;
    checkIntersection(ev1: EventBool, ev2: EventBool): EventBool | null;
    calculate(): SegmentBool[];
}
