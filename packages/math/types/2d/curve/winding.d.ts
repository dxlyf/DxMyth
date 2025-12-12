import { Vector2 as Point } from '../math/vec2';
export declare class Ref<T = number> {
    static from<T = number>(value: T): Ref<T>;
    value: T;
    constructor(value: T);
    swap(other: Ref<T>): void;
}
export declare class PointerArray<T> {
    static from<T = any>(data: T[]): PointerArray<T>;
    data: T[];
    curIndex: number;
    constructor(data: T[]);
    get length(): number;
    copy(source: PointerArray<T>): this;
    clone(): PointerArray<T>;
    slice(start: number): PointerArray<T>;
    get(index: number): T;
    set(index: number, value: T): this;
    set value(v: T);
    get value(): T;
    move(index: number): this;
    next(index?: number): this;
    prev(index?: number): this;
}
declare function winding_line(pts: Point[], x: number, y: number, onCurveCount: Ref<number>): number;
declare function winding_quad(pts: Point[], x: number, y: number, onCurveCount: Ref<number>): number;
declare function winding_cubic(pts: Point[], x: number, y: number, onCurveCount: Ref<number>): number;
declare function winding_conic(pts: Point[], x: number, y: number, weight: number, onCurveCount: Ref<number>): number;
declare function tangent_line(pts: Point[], x: number, y: number, tangents: Point[]): void;
declare function tangent_quad(pts: Point[], x: number, y: number, tangents: Point[]): void;
declare function tangent_cubic(pts: Point[], x: number, y: number, tangents: Point[]): void;
declare function tangent_conic(pts: Point[], x: number, y: number, w: number, tangents: Point[]): void;
export { winding_line, winding_conic, winding_cubic, winding_quad, tangent_conic, tangent_cubic, tangent_line, tangent_quad };
