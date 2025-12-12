import { Vec2, Vec2Value } from './Vec2';
import { Vec3, Vec3Value } from './Vec3';
/**
 * A 3-by-3 matrix. Stored in column-major order.
 */
export declare class Mat33 {
    ex: Vec3;
    ey: Vec3;
    ez: Vec3;
    constructor(a: Vec3Value, b: Vec3Value, c: Vec3Value);
    constructor();
    /** @hidden */
    toString(): string;
    static isValid(obj: any): boolean;
    static assert(o: any): void;
    /**
     * Set this matrix to all zeros.
     */
    setZero(): Mat33;
    /**
     * Solve A * x = b, where b is a column vector. This is more efficient than
     * computing the inverse in one-shot cases.
     */
    solve33(v: Vec3Value): Vec3;
    /**
     * Solve A * x = b, where b is a column vector. This is more efficient than
     * computing the inverse in one-shot cases. Solve only the upper 2-by-2 matrix
     * equation.
     */
    solve22(v: Vec2Value): Vec2;
    /**
     * Get the inverse of this matrix as a 2-by-2. Returns the zero matrix if
     * singular.
     */
    getInverse22(M: Mat33): void;
    /**
     * Get the symmetric inverse of this matrix as a 3-by-3. Returns the zero matrix
     * if singular.
     */
    getSymInverse33(M: Mat33): void;
    /**
     * Multiply a matrix times a vector.
     */
    static mul(a: Mat33, b: Vec2Value): Vec2;
    static mul(a: Mat33, b: Vec3Value): Vec3;
    static mulVec3(a: Mat33, b: Vec3Value): Vec3;
    static mulVec2(a: Mat33, b: Vec2Value): Vec2;
    static add(a: Mat33, b: Mat33): Mat33;
}
