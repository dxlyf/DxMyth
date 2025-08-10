import { Matrix2D } from './mat2d';
import { Vector2, Vector2Like } from './vec2';
/**
 * 2d包围盒
 */
export declare class BoundingRect {
    static empty(): BoundingRect;
    static default(): BoundingRect;
    static fromXYWH(x: number, y: number, w: number, h: number): BoundingRect;
    static fromLTRB(l: number, t: number, r: number, b: number): BoundingRect;
    min: Vector2;
    max: Vector2;
    constructor(min?: Vector2, max?: Vector2);
    get left(): number;
    get top(): number;
    get right(): number;
    get bottom(): number;
    get x(): number;
    get y(): number;
    get width(): number;
    get height(): number;
    get cx(): number;
    get cy(): number;
    get center(): Vector2;
    isEmpty(): boolean;
    clone(): BoundingRect;
    copy(box: BoundingRect): this;
    makeEmpty(): this;
    makeZero(): this;
    setViewport(x: number, y: number, width: number, height: number): this;
    set(min: Vector2, max: Vector2): this;
    fromCircle(cx: number, cy: number, radius: number): this;
    fromLine(x0: number, y0: number, x1: number, y1: number, strokeWidth: number): this | undefined;
    fromRect(x: number, y: number, w: number, h: number): this;
    setFromVertices(points: number[]): this;
    setFromPoints(points: Vector2Like[]): this;
    expandByStrokeWidth(strokeWidth: number): this;
    expandByPoint(point: Vector2Like): this;
    expandByXY(x: number, y: number): this;
    isValid(): boolean;
    isZero(): boolean;
    isFinite(): boolean;
    equals(box: BoundingRect): boolean;
    translate(tx: number, ty: number): void;
    inset(dx: number, dy: number): void;
    outset(dx: number, dy: number): void;
    intersect(box: BoundingRect): this;
    union(box: BoundingRect): this;
    containsXY(x: number, y: number): boolean;
    containsPoint(point: Vector2): boolean;
    containsBox(box: BoundingRect): boolean;
    intersectBox3(b: BoundingRect, mtv: Vector2): boolean;
    intersectionBox(box: BoundingRect): boolean;
    applyMatrix(matrix: Matrix2D): void;
}
