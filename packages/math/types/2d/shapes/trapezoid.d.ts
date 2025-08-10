import { Vector2Point } from '../math/vec2';
export declare class RasterizeLine {
    m: number;
    x0: number;
    static from(m: number, p: Vector2Point): RasterizeLine;
    static fromPoint(p0: Vector2Point, p1: Vector2Point): RasterizeLine;
    static fromFloat(x: number): RasterizeLine;
    constructor(m: number, x0: number);
    getX(y: number): number;
}
export declare class Trapezoid {
    static fromLine(y0: number, y1: number, l0: RasterizeLine, l1: RasterizeLine): Trapezoid;
    y0: number;
    y1: number;
    x0: number;
    x1: number;
    x2: number;
    x3: number;
    constructor(y0: number, y1: number, x0: number, x1: number, x2: number, x3: number);
    getArea(): number;
}
