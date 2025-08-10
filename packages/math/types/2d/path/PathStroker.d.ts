import { PathBuilder, PathVerb } from './PathBuilder';
import { Vector2 } from '../math/vec2';
import { Matrix2D } from '../math/mat2d';
export type PathVerbData = {
    type: PathVerb;
    p0?: Vector2;
    p1?: Vector2;
    p2?: Vector2;
    p3?: Vector2;
};
export declare enum LineJoin {
    Miter = "miter",
    Round = "round",
    Bevel = "bevel",
    MiterClip = "miter-clip"
}
export declare enum LineCap {
    Butt = "butt",
    Round = "round",
    Square = "square"
}
export declare enum FillRule {
    NonZero = "nonzero",
    EvenOdd = "evenodd"
}
export declare class PathSegmentsIter {
    isAutoClose: boolean;
    path: PathBuilder;
    verbIndex: number;
    pointsIndex: number;
    lastMoveTo: Vector2;
    lastPoint: Vector2;
    constructor(options: {
        isAutoClose?: boolean;
        path: PathBuilder;
        verbIndex: number;
        pointsIndex: number;
        lastMoveTo?: Vector2;
        lastPoint?: Vector2;
    });
    get curVerb(): PathVerb;
    get nextVerb(): PathVerb;
    copy(source: PathSegmentsIter): this;
    clone(): PathSegmentsIter;
    [Symbol.iterator](): Iterator<PathVerbData>;
    hasValidTangent(): boolean;
    setAutoClose(value: boolean): void;
    autoClose(): PathVerbData;
}
declare class SwappableBuilders {
    inner: PathBuilder;
    outer: PathBuilder;
    constructor(inner: PathBuilder, outer: PathBuilder);
    swap(): void;
}
type CapProc = (pivot: Vector2, // 上一个点
normal: Vector2, stop: Vector2, other_path: PathBuilder | null | undefined, path: PathBuilder) => void;
type JoinProc = (before_unit_normal: Vector2, //l0->l1 线段的，旋转-90度的单位法向量
pivot: Vector2, // 上一个lineTo点
after_unit_normal: Vector2, // l1->l2 线段的，旋转-90度的单位法向量
radius: number, // 线段宽的一半
inv_miter_limit: number, // 1/miter_limit   
prev_is_line: boolean, // 上一个绘制命令是否是lineTo
curr_is_line: boolean, // 当前绘制命令是否是lineTo
builders: SwappableBuilders) => void;
declare class QuadConstruct {
    static default(): QuadConstruct;
    quad: Vector2[];
    tangent_start: Vector2;
    tangent_end: Vector2;
    start_t: number;
    mid_t: number;
    end_t: number;
    start_set: boolean;
    end_set: boolean;
    opposite_tangents: boolean;
    init(start: number, end: number): boolean;
    initWithStart(parent: QuadConstruct): boolean;
    initWithEnd(parent: QuadConstruct): boolean;
}
declare enum StrokeType {
    Outer = 1,// use sign-opposite values later to flip perpendicular axis
    Inner = -1
}
declare enum ResultType {
    Split = 0,// the caller should split the quad stroke in two
    Degenerate = 1,// the caller should add a line
    Quad = 2
}
declare enum IntersectRayType {
    CtrlPt = 0,
    ResultType = 1
}
export declare class PathStroker {
    static computeResolutionScale(ts: Matrix2D): number;
    radius: number;
    inv_miter_limit: number;
    res_scale: number;
    inv_res_scale: number;
    inv_res_scale_squared: number;
    first_normal: Vector2;
    prev_normal: Vector2;
    first_unit_normal: Vector2;
    prev_unit_normal: Vector2;
    first_pt: Vector2;
    prev_pt: Vector2;
    first_outer_pt: Vector2;
    first_outer_pt_index_in_contour: number;
    segment_count: number;
    prev_is_line: boolean;
    capper: CapProc;
    joiner: JoinProc;
    inner: PathBuilder;
    outer: PathBuilder;
    cusper: PathBuilder;
    stroke_type: StrokeType;
    recursion_depth: number;
    found_tangents: boolean;
    join_completed: boolean;
    get moveToPt(): Vector2;
    builders(): SwappableBuilders;
    close(is_line: boolean): void;
    moveTo(p: Vector2): void;
    finishContour(close: boolean, curr_is_line: boolean): void;
    preJoinTo(p: Vector2, curr_is_line: boolean, normal: Vector2, unit_normal: Vector2): boolean;
    postJoinTo(p: Vector2, normal: Vector2, unit_normal: Vector2): void;
    initQuad(stroke_type: StrokeType, start: number, end: number, quad_points: QuadConstruct): void;
    quadStroke(quad: Vector2[], quad_points: QuadConstruct): boolean;
    compareQuadQuad(quad: Vector2[], quad_points: QuadConstruct): ResultType;
    setRayPoints(tp: Vector2, dxy: Vector2, on_p: Vector2, tangent?: Vector2): void;
    quadPerpRay(quad: Vector2[], t: number, tp: Vector2, on_p: Vector2, tangent?: Vector2): void;
    strokeCloseEnough(stroke: Vector2[], ray: Vector2[], quad_points: QuadConstruct): ResultType;
    intersectRay(intersect_ray_type: IntersectRayType, quad_points: QuadConstruct): ResultType;
    addDegenerateLine(quad_points: QuadConstruct): void;
    setCubicEndNormal(cubic: Vector2[], normal_ab: Vector2, unit_normal_ab: Vector2, normal_cd: Vector2, unit_normal_cd: Vector2): boolean | undefined;
    lineTo(p: Vector2, iter?: PathSegmentsIter): void;
    quadraticCurveTo(p1: Vector2, p2: Vector2): void;
    bezierCurveTo(pt1: Vector2, pt2: Vector2, pt3: Vector2): void;
    cubicStroke(cubic: Vector2[], quad_points: QuadConstruct): boolean;
    cubicMidOnLine(cubic: Vector2[], quad_points: QuadConstruct): boolean;
    cubicQuadMid(cubic: Vector2[], quad_points: QuadConstruct, mid: Vector2): void;
    compareQuadCubic(cubic: Vector2[], quad_points: QuadConstruct): ResultType;
    cubicQuadEnds(cubic: Vector2[], quad_points: QuadConstruct): void;
    tangentsMeet(cubic: Vector2[], quad_points: QuadConstruct): ResultType;
    cubicPerpRay(cubic: Vector2[], t: number, t_pt: Vector2, on_pt: Vector2, tangent?: Vector2): void;
    stroke(path: PathBuilder, paint: {
        strokeWidth: number;
        miterLimit: number;
        lineCap: LineCap;
        lineJoin: LineJoin;
    }): PathBuilder;
    strokeInner(path: PathBuilder, width: number, miterLimit: number, lineCap: LineCap, lineJoin: LineJoin, resScale: number): PathBuilder;
    finish(is_line: boolean): PathBuilder;
    hasOnlyMoveTo(): boolean;
    isCurrentContourEmpty(): boolean;
}
export {};
