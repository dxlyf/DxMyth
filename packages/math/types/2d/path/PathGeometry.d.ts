import { Vector2 } from '../math/vec2';
import { Matrix2D } from '../math/mat2d';
export declare const SCALAR_MAX = 3.402823466e+38;
export declare const SCALAR_NEARLY_ZERO: number;
export declare const SCALAR_ROOT_2_OVER_2: number;
declare enum PathDirection {
    CW = 0,
    CCW = 1
}
declare class QuadCoeff {
    static from_points(points: Vector2[]): QuadCoeff;
    a: Vector2;
    b: Vector2;
    c: Vector2;
    constructor(options?: {
        a: Vector2;
        b: Vector2;
        c: Vector2;
    });
    eval(t: Vector2): Vector2;
}
declare class CubicCoeff {
    static from_points(points: Vector2[]): CubicCoeff;
    a: Vector2;
    b: Vector2;
    c: Vector2;
    d: Vector2;
    constructor(options?: {
        a: Vector2;
        b: Vector2;
        c: Vector2;
        d: Vector2;
    });
    eval(t: Vector2): Vector2;
}
declare function new_t_values(): any[];
declare function chop_quad_at(src: Vector2[], t: number, dst: Vector2[]): void;
declare function find_unit_quad_roots(a: number, b: number, c: number, roots: number[]): number;
declare function chop_cubic_at2(src: Vector2[], t: number, dst: Vector2[]): void;
type f32 = number;
declare function find_quad_extrema(a: f32, b: f32, c: f32): number | undefined;
declare function find_quad_max_curvature(src: Vector2[]): number;
declare function eval_quad_at(src: Vector2[], t: number): Vector2;
declare function eval_quad_tangent_at(src: Vector2[], tol: number): Vector2;
declare function find_cubic_max_curvature(src: Vector2[], t_values: number[]): number[];
declare function eval_cubic_pos_at(src: Vector2[], t: number): Vector2;
declare function eval_cubic_tangent_at(src: Vector2[], t: number): Vector2;
declare function find_cubic_extrema(a: f32, b: f32, c: f32, d: f32, t_values: number[]): number[];
declare function find_cubic_inflections(src: Vector2[], t_values: number[]): number[];
declare function find_cubic_cusp(src: Vector2[]): number | undefined;
declare class Conic {
    points: Vector2[];
    weight: number;
    static default(): Conic;
    static new(pt0: Vector2, pt1: Vector2, pt2: Vector2, weight: f32): Conic;
    static from_points(points: Vector2[], weight: f32): Conic;
    static build_unit_arc(u_start: Vector2, u_stop: Vector2, dir: PathDirection, user_transform: Matrix2D, dst: Conic[]): Conic[] | undefined;
    constructor(options?: {
        points: Vector2[];
        weight: number;
    });
    compute_quad_pow2(tolerance: f32): number | undefined;
    chop_into_quads_pow2(pow2: number, points: Vector2[]): number;
    chop(): [Conic, Conic];
}
export declare function build_unit_arc(u_start: Vector2, u_stop: Vector2, dir: PathDirection, user_transform: Matrix2D, dst: Conic[]): Conic[] | undefined;
declare class AutoConicToQuads {
    points: Vector2[];
    len: number;
    static compute(pt0: Vector2, pt1: Vector2, pt2: Vector2, weight: f32): AutoConicToQuads | undefined;
    constructor(options?: {});
}
declare function chop_cubic_at(src: Vector2[], t_values: number[], dst: Vector2[]): void;
export { AutoConicToQuads, QuadCoeff, Conic, CubicCoeff, find_cubic_cusp, find_cubic_extrema, find_quad_max_curvature, find_cubic_inflections, find_cubic_max_curvature, find_quad_extrema, find_unit_quad_roots, eval_cubic_pos_at, eval_quad_tangent_at, eval_cubic_tangent_at, eval_quad_at, chop_quad_at, chop_cubic_at, chop_cubic_at2, new_t_values };
