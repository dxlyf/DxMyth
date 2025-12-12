import { Vec3 } from '../math/Vec3';
/**
 * A Quaternion describes a rotation in 3D space. The Quaternion is mathematically defined as Q = x*i + y*j + z*k + w, where (i,j,k) are imaginary basis vectors. (x,y,z) can be seen as a vector related to the axis of rotation, while the real multiplier, w, is related to the amount of rotation.
 * @param x Multiplier of the imaginary basis vector i.
 * @param y Multiplier of the imaginary basis vector j.
 * @param z Multiplier of the imaginary basis vector k.
 * @param w Multiplier of the real part.
 * @see http://en.wikipedia.org/wiki/Quaternion
 */
export declare class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * Set the value of the quaternion.
     */
    set(x: number, y: number, z: number, w: number): Quaternion;
    /**
     * Convert to a readable format
     * @return "x,y,z,w"
     */
    toString(): string;
    /**
     * Convert to an Array
     * @return [x, y, z, w]
     */
    toArray(): [number, number, number, number];
    /**
     * Set the quaternion components given an axis and an angle in radians.
     */
    setFromAxisAngle(vector: Vec3, angle: number): Quaternion;
    /**
     * Converts the quaternion to [ axis, angle ] representation.
     * @param targetAxis A vector object to reuse for storing the axis.
     * @return An array, first element is the axis and the second is the angle in radians.
     */
    toAxisAngle(targetAxis?: Vec3): [Vec3, number];
    /**
     * Set the quaternion value given two vectors. The resulting rotation will be the needed rotation to rotate u to v.
     */
    setFromVectors(u: Vec3, v: Vec3): Quaternion;
    /**
     * Multiply the quaternion with an other quaternion.
     */
    mult(quat: Quaternion, target?: Quaternion): Quaternion;
    /**
     * Get the inverse quaternion rotation.
     */
    inverse(target?: Quaternion): Quaternion;
    /**
     * Get the quaternion conjugate
     */
    conjugate(target?: Quaternion): Quaternion;
    /**
     * Normalize the quaternion. Note that this changes the values of the quaternion.
     */
    normalize(): Quaternion;
    /**
     * Approximation of quaternion normalization. Works best when quat is already almost-normalized.
     * @author unphased, https://github.com/unphased
     */
    normalizeFast(): Quaternion;
    /**
     * Multiply the quaternion by a vector
     */
    vmult(v: Vec3, target?: Vec3): Vec3;
    /**
     * Copies value of source to this quaternion.
     * @return this
     */
    copy(quat: Quaternion): Quaternion;
    /**
     * Convert the quaternion to euler angle representation. Order: YZX, as this page describes: https://www.euclideanspace.com/maths/standards/index.htm
     * @param order Three-character string, defaults to "YZX"
     */
    toEuler(target: Vec3, order?: string): void;
    /**
     * Set the quaternion components given Euler angle representation.
     *
     * @param order The order to apply angles: 'XYZ' or 'YXZ' or any other combination.
     *
     * See {@link https://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors MathWorks} reference
     */
    setFromEuler(x: number, y: number, z: number, order?: string): Quaternion;
    clone(): Quaternion;
    /**
     * Performs a spherical linear interpolation between two quat
     *
     * @param toQuat second operand
     * @param t interpolation amount between the self quaternion and toQuat
     * @param target A quaternion to store the result in. If not provided, a new one will be created.
     * @returns {Quaternion} The "target" object
     */
    slerp(toQuat: Quaternion, t: number, target?: Quaternion): Quaternion;
    /**
     * Rotate an absolute orientation quaternion given an angular velocity and a time step.
     */
    integrate(angularVelocity: Vec3, dt: number, angularFactor: Vec3, target?: Quaternion): Quaternion;
}
