import { Matrix2dLike } from '../math/mat2d';
import { Rect } from './Rect';
import { RRect } from './RRrect';
import { BoundingRect } from '../math/bounding_rect';
type Point = {
    x: number;
    y: number;
};
type PathBuilderVisitor = {
    moveTo: (x: number, y: number) => void;
    lineTo: (lastX: number, lastY: number, x: number, y: number) => void;
    quadraticCurveTo: (lastX: number, lastY: number, cpX: number, cpY: number, x: number, y: number) => void;
    cubicCurveTo: (lastX: number, lastY: number, cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number) => void;
    close: (firstMoveX: number, firstMoveY: number, lastX: number, lastY: number) => void;
};
export declare enum PathDirection {
    CW = 0,
    CCW = 1,
    Unknown = 2147483647
}
export declare enum PathVerb {
    MoveTo = 0,
    LineTo = 1,
    QuadCurveTo = 2,
    CubicCurveTo = 3,
    ConicTo = 4,
    Close = 5
}
export declare enum PathIterVerb {
    MoveTo = 0,
    LineTo = 1,
    QuadCurveTo = 2,
    ConicTo = 4,
    CubicCurveTo = 3,
    Close = 5,
    Done = 6
}
export declare enum SegmentMask {
    Line_SegmentMask = 1,
    Quad_SegmentMask = 2,
    Conic_SegmentMask = 4,
    Cubic_SegmentMask = 8
}
export declare class PathBuilder {
    static default(): PathBuilder;
    static fromVectices(points: number[]): PathBuilder;
    static fromPoints(points: ({
        x: number;
        y: number;
    })[]): PathBuilder;
    points: number[];
    verbs: PathVerb[];
    _segmentMask: SegmentMask;
    _lastMovePointIndex: number;
    _needMoveTo: boolean;
    _bounds: BoundingRect | null;
    reset(): this;
    clear(): this;
    get isEmpty(): boolean;
    get lastVerb(): PathVerb;
    get lastPoint(): Point;
    get length(): number;
    setLastPoint(x: number, y: number): this;
    private addPoint;
    private addVerb;
    private injectMoveToIfNeeded;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    quadraticCurveTo(cpX: number, cpY: number, x: number, y: number): this;
    bezierCurveTo(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number): this;
    cubicCurveTo(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number): this;
    conicTo(cpX: number, cpY: number, x: number, y: number, weight: number): this;
    closePath(): this;
    rect(x: number, y: number, w: number, h: number): this;
    roundRect(x: number, y: number, width: number, height: number, radii?: number | DOMPointInit | Iterable<number | DOMPointInit>): void;
    /**
     *
     * @param x
     * @param y
     * @param width
     * @param height
     * @param radius all-corners
        [all-corners]
        [top-left-and-bottom-right, top-right-and-bottom-left]
        [top-left, top-right-and-bottom-left, bottom-right]
        [top-left, top-right, bottom-right, bottom-left]
     */
    roundRect2(x: number, y: number, width: number, height: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
    ellipse2(cx: number, cy: number, rx: number, ry: number, rotation?: number, startAngle?: number, endAngle?: number, ccw?: boolean): void;
    ellipse(cx: number, cy: number, rx: number, ry: number, rotation?: number, startAngle?: number, endAngle?: number, ccw?: boolean): this;
    ellipseArc(x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, xAxisRotation: number, largeArcFlag: boolean, sweepFlag: boolean): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
    arcTo2(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    arcToOval(x: number, y: number, rx: number, ry: number, rotation: number, startAngle: number, deltaAngle: number, forceMoveTo?: boolean): void;
    addCircle(x: number, y: number, r: number, ccw?: boolean): this;
    addPolygon(points: number[], isClosed?: boolean): this;
    addOval(oval: Rect, ccw?: boolean, index?: number): void;
    addRect(rect: Rect, ccw?: boolean, index?: number): this;
    addRRect(rrect: RRect, ccw?: boolean, index?: number): void;
    copy(source: PathBuilder): this;
    clone(): PathBuilder;
    equals(path: PathBuilder): boolean;
    transform(m: Matrix2dLike): void;
    scaleRound(sx: number, sy: number): void;
    computeTightBounds(): BoundingRect;
    fatten(tessellationTolerance?: number): PathBuilder;
    toPolygons(autoClose?: boolean, tessellationTolerance?: number): number[][];
    getBounds(): BoundingRect;
    visit(visitor: Partial<PathBuilderVisitor>): void;
    invertVisit(visitor: Partial<PathBuilderVisitor>): void;
    addPath(path: PathBuilder, matrix?: Matrix2dLike): this;
    addReversePath(path: PathBuilder): void;
    reversePathTo(other: PathBuilder): void;
    offset(x: number, y: number): void;
    /***
     * 判断从某个点开始，后面的路径是否为零长度
     * 如果与start点形成闭合路径则认为非零长度
    */
    isZeroLengthSincePoint(start_pt_index: number): boolean;
    finish(): this;
    toCanvas(ctx: CanvasRenderingContext2D | Path2D): void;
    toPath2D(): Path2D;
    toSvgPath(): string;
    toPoints(): {
        x: number;
        y: number;
    }[];
}
export {};
