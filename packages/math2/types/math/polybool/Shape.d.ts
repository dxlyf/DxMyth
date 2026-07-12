import { Geometry, Vec2, Vec6 } from './Geometry';
import { default as BuildLog } from './BuildLog';
import { SegmentBool } from './Intersecter';
import { IPolyBoolReceiver } from './SegmentChainer';
import { Segment } from './Segment';
export declare class Shape {
    private readonly geo;
    private readonly log;
    private pathState;
    private resultState;
    private readonly saveStack;
    private matrix;
    constructor(geo: Geometry, segments?: SegmentBool[] | null, log?: BuildLog | null);
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): this;
    resetTransform(): this;
    getTransform(): {
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
    };
    transform(a: number, b: number, c: number, d: number, e: number, f: number): this;
    rotate(angle: number): this;
    rotateDeg(angle: number): this;
    scale(sx: number, sy: number): this;
    translate(tx: number, ty: number): this;
    save(): this;
    restore(): this;
    transformPoint(x: number, y: number): Vec2;
    beginPath(): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    rect(x: number, y: number, width: number, height: number): this;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this;
    closePath(): this;
    endPath(): this;
    private selfIntersect;
    segments(): Segment[][];
    output<T extends IPolyBoolReceiver>(receiver: T, matrix?: Vec6): T;
    combine(shape: Shape): ShapeCombined;
}
export declare class ShapeCombined {
    private readonly geo;
    private readonly log;
    private readonly segments;
    constructor(segments: SegmentBool[], geo: Geometry, log?: BuildLog | null);
    union(): Shape;
    intersect(): Shape;
    difference(): Shape;
    differenceRev(): Shape;
    xor(): Shape;
}
