import { Vec2, Vec2Value } from './Vec2';
/**
 * A 2-by-2 matrix. Stored in column-major order.
 */
export declare class Mat22 {
    ex: Vec2;
    ey: Vec2;
    constructor(a: number, b: number, c: number, d: number);
    constructor(a: {
        x: number;
        y: number;
    }, b: {
        x: number;
        y: number;
    });
    constructor();
    /** @hidden */
    toString(): string;
    static isValid(obj: any): boolean;
    static assert(o: any): void;
    set(a: Mat22): void;
    set(a: Vec2Value, b: Vec2Value): void;
    set(a: number, b: number, c: number, d: number): void;
    setIdentity(): void;
    setZero(): void;
    getInverse(): Mat22;
    /**
     * Solve A * x = b, where b is a column vector. This is more efficient than
     * computing the inverse in one-shot cases.
     */
    solve(v: Vec2Value): Vec2;
    /**
     * Multiply a matrix times a vector. If a rotation matrix is provided, then this
     * transforms the vector from one frame to another.
     */
    static mul(mx: Mat22, my: Mat22): Mat22;
    static mul(mx: Mat22, v: Vec2Value): Vec2;
    static mulVec2(mx: Mat22, v: Vec2Value): Vec2;
    static mulMat22(mx: Mat22, v: Mat22): Mat22;
    /**
     * Multiply a matrix transpose times a vector. If a rotation matrix is provided,
     * then this transforms the vector from one frame to another (inverse
     * transform).
     */
    static mulT(mx: Mat22, my: Mat22): Mat22;
    static mulT(mx: Mat22, v: Vec2Value): Vec2;
    static mulTVec2(mx: Mat22, v: Vec2Value): Vec2;
    static mulTMat22(mx: Mat22, v: Mat22): Mat22;
    static abs(mx: Mat22): Mat22;
    static add(mx1: Mat22, mx2: Mat22): Mat22;
}
