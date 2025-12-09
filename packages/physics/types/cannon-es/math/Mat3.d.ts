import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
/**
 * A 3x3 matrix.
 * Authored by {@link http://github.com/schteppe/ schteppe}
 */
export declare class Mat3 {
    /**
     * A vector of length 9, containing all matrix elements.
     */
    elements: number[];
    /**
     * @param elements A vector of length 9, containing all matrix elements.
     */
    constructor(elements?: number[]);
    /**
     * Sets the matrix to identity
     * @todo Should perhaps be renamed to `setIdentity()` to be more clear.
     * @todo Create another function that immediately creates an identity matrix eg. `eye()`
     */
    identity(): void;
    /**
     * Set all elements to zero
     */
    setZero(): void;
    /**
     * Sets the matrix diagonal elements from a Vec3
     */
    setTrace(vector: Vec3): void;
    /**
     * Gets the matrix diagonal elements
     */
    getTrace(target?: Vec3): Vec3;
    /**
     * Matrix-Vector multiplication
     * @param v The vector to multiply with
     * @param target Optional, target to save the result in.
     */
    vmult(v: Vec3, target?: Vec3): Vec3;
    /**
     * Matrix-scalar multiplication
     */
    smult(s: number): void;
    /**
     * Matrix multiplication
     * @param matrix Matrix to multiply with from left side.
     */
    mmult(matrix: Mat3, target?: Mat3): Mat3;
    /**
     * Scale each column of the matrix
     */
    scale(vector: Vec3, target?: Mat3): Mat3;
    /**
     * Solve Ax=b
     * @param b The right hand side
     * @param target Optional. Target vector to save in.
     * @return The solution x
     * @todo should reuse arrays
     */
    solve(b: Vec3, target?: Vec3): Vec3;
    /**
     * Get an element in the matrix by index. Index starts at 0, not 1!!!
     * @param value If provided, the matrix element will be set to this value.
     */
    e(row: number, column: number): number;
    e(row: number, column: number, value: number): void;
    /**
     * Copy another matrix into this matrix object.
     */
    copy(matrix: Mat3): Mat3;
    /**
     * Returns a string representation of the matrix.
     */
    toString(): string;
    /**
     * reverse the matrix
     * @param target Target matrix to save in.
     * @return The solution x
     */
    reverse(target?: Mat3): Mat3;
    /**
     * Set the matrix from a quaterion
     */
    setRotationFromQuaternion(q: Quaternion): Mat3;
    /**
     * Transpose the matrix
     * @param target Optional. Where to store the result.
     * @return The target Mat3, or a new Mat3 if target was omitted.
     */
    transpose(target?: Mat3): Mat3;
}
