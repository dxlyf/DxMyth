import { Vector2Like } from './Vector2';
export type PointLike = {
    x: number;
    y: number;
};
export declare class Point implements PointLike {
    static default(): Point;
    static fromPoint(point: PointLike): Point;
    static create(x?: number, y?: number): Point;
    private _x;
    private _y;
    private _onChange;
    constructor(x?: number, y?: number);
    get width(): number;
    get height(): number;
    set width(v: number);
    set height(v: number);
    get x(): number;
    set x(v: number);
    get y(): number;
    set y(v: number);
    /** 注册变更回调，x 或 y 变化时触发 */
    onChange(cb: () => void): this;
    set(x: number, y: number): this;
    copy(v: Vector2Like): this;
    zero(): this;
    add(v: Vector2Like): this;
    translate(x: number, y: number): this;
    scale(x: number, y: number): this;
    rotate(angle: number, center?: PointLike): this;
    subtract(v: Vector2Like): this;
    multiply(v: Vector2Like): this;
    multiplyScalar(s: number): this;
    magnitude(): number;
    magnitudeSquared(): number;
    dot(v: Vector2Like): number;
    cross(v: Vector2Like): number;
    normalize(): this;
    perpendicular(): this;
    negate(): this;
    setLengthTo(x: number, y: number, length: number, originLength?: {
        value: number;
    }): boolean;
    isFinite(): boolean;
    clone(): Point;
    equals(b: Vector2Like): boolean;
    equalsEpsilon(b: Vector2Like, epsilon?: number): boolean;
    toString(): string;
}
