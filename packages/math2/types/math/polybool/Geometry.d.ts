export type Vec2 = [number, number];
export type Vec6 = [number, number, number, number, number, number];
export declare function lerp(a: number, b: number, t: number): number;
export declare function lerpVec2(a: Vec2, b: Vec2, t: number): Vec2;
export declare function boundingBoxesIntersect(bbox1: [Vec2, Vec2], bbox2: [Vec2, Vec2]): boolean;
export declare abstract class Geometry {
    abstract snap0(v: number): number;
    abstract snap01(v: number): number;
    abstract isCollinear(p1: Vec2, p2: Vec2, p3: Vec2): boolean;
    abstract solveCubic(a: number, b: number, c: number, d: number): number[];
    abstract isEqualVec2(a: Vec2, b: Vec2): boolean;
    abstract compareVec2(a: Vec2, b: Vec2): number;
}
export declare class GeometryEpsilon extends Geometry {
    readonly epsilon: number;
    constructor(epsilon?: number);
    snap0(v: number): number;
    snap01(v: number): number;
    isCollinear(p1: Vec2, p2: Vec2, p3: Vec2): boolean;
    private solveCubicNormalized;
    solveCubic(a: number, b: number, c: number, d: number): number[];
    isEqualVec2(a: Vec2, b: Vec2): boolean;
    compareVec2(a: Vec2, b: Vec2): 0 | 1 | -1;
}
