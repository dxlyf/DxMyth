import { FloatArray } from './common.js';
import { Vec2Like } from './vec2.js';
/**
 * A 2x2 Matrix given as a {@link Mat2}, a 4-element floating point TypedArray,
 * or an array of 4 numbers.
 */
export type Mat2Like = [
    number,
    number,
    number,
    number
] | FloatArray;
/**
 * A 2x2 Matrix
 */
export declare class Mat2 extends Float32Array {
    /**
     * The number of bytes in a {@link Mat2}.
     */
    static readonly BYTE_LENGTH: number;
    /**
     * Create a {@link Mat2}.
     */
    constructor(...values: [Readonly<Mat2Like> | ArrayBufferLike, number?] | number[] | [undefined]);
    /**
     * A string representation of `this`
     * Equivalent to `Mat2.str(this);`
     */
    get str(): string;
    /**
     * Copy the values from another {@link Mat2} into `this`.
     *
     * @param a the source vector
     * @returns `this`
     */
    copy(a: Readonly<Mat2Like>): Mat2;
    /**
     * Set `this` to the identity matrix
     * Equivalent to Mat2.identity(this)
     *
     * @returns `this`
     */
    identity(): Mat2;
    /**
     * Multiplies this {@link Mat2} against another one
     * Equivalent to `Mat2.multiply(this, this, b);`
     *
     * @param out - The receiving Matrix
     * @param a - The first operand
     * @param b - The second operand
     * @returns `this`
     */
    multiply(b: Readonly<Mat2Like>): Mat2;
    /**
     * Alias for {@link Mat2.multiply}
     */
    mul(b: Readonly<Mat2Like>): Mat2;
    /**
     * Transpose this {@link Mat2}
     * Equivalent to `Mat2.transpose(this, this);`
     *
     * @returns `this`
     */
    transpose(): Mat2;
    /**
     * Inverts this {@link Mat2}
     * Equivalent to `Mat2.invert(this, this);`
     *
     * @returns `this`
     */
    invert(): Mat2;
    /**
     * Scales this {@link Mat2} by the dimensions in the given vec3 not using vectorization
     * Equivalent to `Mat2.scale(this, this, v);`
     *
     * @param v - The {@link Vec2} to scale the matrix by
     * @returns `this`
     */
    scale(v: Readonly<Vec2Like>): Mat2;
    /**
     * Rotates this {@link Mat2} by the given angle around the given axis
     * Equivalent to `Mat2.rotate(this, this, rad);`
     *
     * @param rad - the angle to rotate the matrix by
     * @returns `out`
     */
    rotate(rad: number): Mat2;
    /**
     * Creates a new, identity {@link Mat2}
     * @category Static
     *
     * @returns A new {@link Mat2}
     */
    static create(): Mat2;
    /**
     * Creates a new {@link Mat2} initialized with values from an existing matrix
     * @category Static
     *
     * @param a - Matrix to clone
     * @returns A new {@link Mat2}
     */
    static clone(a: Readonly<Mat2Like>): Mat2;
    /**
     * Copy the values from one {@link Mat2} to another
     * @category Static
     *
     * @param out - The receiving Matrix
     * @param a - Matrix to copy
     * @returns `out`
     */
    static copy<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>): T;
    /**
     * Create a new {@link Mat2} with the given values
     * @category Static
     *
     * @param values - Matrix components
     * @returns A new {@link Mat2}
     */
    static fromValues(...values: number[]): Mat2;
    /**
     * Set the components of a {@link Mat2} to the given values
     * @category Static
     *
     * @param out - The receiving matrix
     * @param values - Matrix components
     * @returns `out`
     */
    static set<T extends Mat2Like>(out: T, ...values: number[]): T;
    /**
     * Set a {@link Mat2} to the identity matrix
     * @category Static
     *
     * @param out - The receiving matrix
     * @returns `out`
     */
    static identity<T extends Mat2Like>(out: T): T;
    /**
     * Transpose the values of a {@link Mat2}
     * @category Static
     *
     * @param out - the receiving matrix
     * @param a - the source matrix
     * @returns `out`
     */
    static transpose<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>): T;
    /**
     * Inverts a {@link Mat2}
     * @category Static
     *
     * @param out - the receiving matrix
     * @param a - the source matrix
     * @returns `out` or `null` if the matrix is not invertable
     */
    static invert<T extends Mat2Like>(out: T, a: Mat2Like): T | null;
    /**
     * Calculates the adjugate of a {@link Mat2}
     * @category Static
     *
     * @param out - the receiving matrix
     * @param a - the source matrix
     * @returns `out`
     */
    static adjoint<T extends Mat2Like>(out: T, a: Mat2Like): T;
    /**
     * Calculates the determinant of a {@link Mat2}
     * @category Static
     *
     * @param a - the source matrix
     * @returns determinant of a
     */
    static determinant(a: Readonly<Mat2Like>): number;
    /**
     * Adds two {@link Mat2}'s
     * @category Static
     *
     * @param out - the receiving matrix
     * @param a - the first operand
     * @param b - the second operand
     * @returns `out`
     */
    static add<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>, b: Readonly<Mat2Like>): T;
    /**
     * Subtracts matrix b from matrix a
     * @category Static
     *
     * @param out - the receiving matrix
     * @param a - the first operand
     * @param b - the second operand
     * @returns `out`
     */
    static subtract<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>, b: Readonly<Mat2Like>): T;
    /**
     * Alias for {@link Mat2.subtract}
     * @category Static
     */
    static sub<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>, b: Readonly<Mat2Like>): T;
    /**
     * Multiplies two {@link Mat2}s
     * @category Static
     *
     * @param out - The receiving Matrix
     * @param a - The first operand
     * @param b - The second operand
     * @returns `out`
     */
    static multiply<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>, b: Readonly<Mat2Like>): T;
    /**
     * Alias for {@link Mat2.multiply}
     * @category Static
     */
    static mul<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>, b: Readonly<Mat2Like>): T;
    /**
     * Rotates a {@link Mat2} by the given angle
     * @category Static
     *
     * @param out - the receiving matrix
     * @param a - the matrix to rotate
     * @param rad - the angle to rotate the matrix by
     * @returns `out`
     */
    static rotate<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>, rad: number): T;
    /**
     * Scales the {@link Mat2} by the dimensions in the given {@link Vec2}
     * @category Static
     *
     * @param out - the receiving matrix
     * @param a - the matrix to scale
     * @param v - the {@link Vec2} to scale the matrix by
     * @returns `out`
     **/
    static scale<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>, v: Readonly<Vec2Like>): T;
    /**
     * Creates a {@link Mat2} from a given angle around a given axis
     * This is equivalent to (but much faster than):
     *
     *     mat2.identity(dest);
     *     mat2.rotate(dest, dest, rad);
     * @category Static
     *
     * @param out - {@link Mat2} receiving operation result
     * @param rad - the angle to rotate the matrix by
     * @returns `out`
     */
    static fromRotation<T extends Mat2Like>(out: T, rad: number): T;
    /**
     * Creates a {@link Mat2} from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat2.identity(dest);
     *     mat2.scale(dest, dest, vec);
     * @category Static
     *
     * @param out - {@link Mat2} receiving operation result
     * @param v - Scaling vector
     * @returns `out`
     */
    static fromScaling<T extends Mat2Like>(out: T, v: Readonly<Vec2Like>): T;
    /**
     * Returns Frobenius norm of a {@link Mat2}
     * @category Static
     *
     * @param a - the matrix to calculate Frobenius norm of
     * @returns Frobenius norm
     */
    static frob(a: Readonly<Mat2Like>): number;
    /**
     * Multiply each element of a {@link Mat2} by a scalar.
     * @category Static
     *
     * @param out - the receiving matrix
     * @param a - the matrix to scale
     * @param b - amount to scale the matrix's elements by
     * @returns `out`
     */
    static multiplyScalar<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>, b: number): T;
    /**
     * Adds two {@link Mat2}'s after multiplying each element of the second operand by a scalar value.
     * @category Static
     *
     * @param out - the receiving vector
     * @param a - the first operand
     * @param b - the second operand
     * @param scale - the amount to scale b's elements by before adding
     * @returns `out`
     */
    static multiplyScalarAndAdd<T extends Mat2Like>(out: T, a: Readonly<Mat2Like>, b: Readonly<Mat2Like>, scale: number): T;
    /**
     * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
     * @category Static
     *
     * @param L - the lower triangular matrix
     * @param D - the diagonal matrix
     * @param U - the upper triangular matrix
     * @param a - the input matrix to factorize
     */
    static LDU(L: Mat2Like, D: Readonly<Mat2Like>, U: Mat2Like, a: Readonly<Mat2Like>): (readonly [number, number, number, number] | Readonly<Float32Array<ArrayBufferLike>> | Readonly<Float64Array<ArrayBufferLike>>)[];
    /**
     * Returns whether or not two {@link Mat2}s have exactly the same elements in the same position (when compared with ===)
     * @category Static
     *
     * @param a - The first matrix.
     * @param b - The second matrix.
     * @returns True if the matrices are equal, false otherwise.
     */
    static exactEquals(a: Readonly<Mat2Like>, b: Readonly<Mat2Like>): boolean;
    /**
     * Returns whether or not two {@link Mat2}s have approximately the same elements in the same position.
     * @category Static
     *
     * @param a - The first matrix.
     * @param b - The second matrix.
     * @returns True if the matrices are equal, false otherwise.
     */
    static equals(a: Readonly<Mat2Like>, b: Readonly<Mat2Like>): boolean;
    /**
     * Returns a string representation of a {@link Mat2}
     * @category Static
     *
     * @param a - matrix to represent as a string
     * @returns string representation of the matrix
     */
    static str(a: Readonly<Mat2Like>): string;
}
/**
 * {@link Mat2} alias for backwards compatibility
 */
export declare const mat2: typeof Mat2;
