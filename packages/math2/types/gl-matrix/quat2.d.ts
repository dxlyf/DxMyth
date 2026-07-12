import { FloatArray } from './common.js';
import { Mat4Like } from './mat4.js';
import { QuatLike } from './quat.js';
import { Vec3Like } from './vec3.js';
/**
 * A Dual Quaternion given as a {@link Quat2}, an 8-element floating point
 * TypedArray, or an array of 8 numbers.
 */
export type Quat2Like = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
] | FloatArray;
/**
 * Dual Quaternion
 */
export declare class Quat2 extends Float32Array {
    /**
     * The number of bytes in a {@link Quat}.
     */
    static readonly BYTE_LENGTH: number;
    /**
     * Create a {@link Quat2}.
     */
    constructor(...values: [Readonly<Quat2Like> | ArrayBufferLike, number?] | number[] | [undefined]);
    /**
     * A string representation of `this`
     * Equivalent to `Quat2.str(this);`
     */
    get str(): string;
    /**
     * Copy the values from another {@link Quat2} into `this`.
     *
     * @param a the source dual quaternion
     * @returns `this`
     */
    copy(a: Readonly<Quat2Like>): Quat2;
    /**
     * Creates a new identity {@link Quat2}
     * @category Static
     *
     * @returns a new dual quaternion [real -> rotation, dual -> translation]
     */
    static create(): Quat2;
    /**
     * Creates a {@link Quat2} quat initialized with values from an existing quaternion
     * @category Static
     *
     * @param a - dual quaternion to clone
     * @returns a new dual quaternion
     */
    static clone(a: Quat2Like): Quat2;
    /**
     * Creates a new {@link Quat2}  initialized with the given values
     * @category Static
     *
     * @param x1 - 1st X component
     * @param y1 - 1st Y component
     * @param z1 - 1st Z component
     * @param w1 - 1st W component
     * @param x2 - 2nd X component
     * @param y2 - 2nd Y component
     * @param z2 - 2nd Z component
     * @param w2 - 2nd W component
     * @returns a new dual quaternion
     */
    static fromValues(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Quat2;
    /**
     * Creates a new {@link Quat2} from the given values (quat and translation)
     * @category Static
     *
     * @param x1 - X component (rotation)
     * @param y1 - Y component (rotation)
     * @param z1 - Z component (rotation)
     * @param w1 - W component (rotation)
     * @param x2 - X component (translation)
     * @param y2 - Y component (translation)
     * @param z2 - Z component (translation)
     * @returns a new dual quaternion
     */
    static fromRotationTranslationValues(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number): Quat2;
    /**
     * Sets a {@link Quat2} from a quaternion and a translation
     * @category Static
     *
     * @param out - dual quaternion receiving operation result
     * @param q - a normalized quaternion
     * @param t - translation vector
     * @returns `out`
     */
    static fromRotationTranslation<T extends Quat2Like>(out: T, q: Readonly<QuatLike>, t: Readonly<Vec3Like>): T;
    /**
     * Sets a {@link Quat2} from a translation
     * @category Static
     *
     * @param out - dual quaternion receiving operation result
     * @param t - translation vector
     * @returns `out`
     */
    static fromTranslation<T extends Quat2Like>(out: T, t: Readonly<Vec3Like>): T;
    /**
     * Sets a {@link Quat2} from a quaternion
     * @category Static
     *
     * @param out - dual quaternion receiving operation result
     * @param q - a normalized quaternion
     * @returns `out`
     */
    static fromRotation<T extends Quat2Like>(out: T, q: Readonly<QuatLike>): T;
    /**
     * Sets a {@link Quat2} from a quaternion
     * @category Static
     *
     * @param out - dual quaternion receiving operation result
     * @param a - the matrix
     * @returns `out`
     */
    static fromMat4<T extends Quat2Like>(out: T, a: Readonly<Mat4Like>): T;
    /**
     * Copy the values from one {@link Quat2} to another
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - the source dual quaternion
     * @returns `out`
     */
    static copy<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>): T;
    /**
     * Set a {@link Quat2} to the identity dual quaternion
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @returns `out`
     */
    static identity<T extends Quat2Like>(out: T): T;
    /**
     * Set the components of a {@link Quat2} to the given values
     * @category Static
     *
     * @param out - the receiving vector
     * @param x1 - 1st X component
     * @param y1 - 1st Y component
     * @param z1 - 1st Z component
     * @param w1 - 1st W component
     * @param x2 - 2nd X component
     * @param y2 - 2nd Y component
     * @param z2 - 2nd Z component
     * @param w2 - 2nd W component
     * @returns `out`
     */
    static set<T extends Quat2Like>(out: T, x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): T;
    /**
     * Gets the real part of a dual quat
     * @category Static
     *
     * @param out - real part
     * @param a - Dual Quaternion
     * @return `out`
     */
    static getReal<T extends QuatLike>(out: T, a: Readonly<Quat2Like>): T;
    /**
     * Gets the dual part of a dual quat
     * @category Static
     *
     * @param out - dual part
     * @param a - Dual Quaternion
     * @return `out`
     */
    static getDual<T extends QuatLike>(out: T, a: Readonly<Quat2Like>): T;
    /**
     * Set the real component of a {@link Quat2} to the given quaternion
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - a quaternion representing the real part
     * @return `out`
     */
    static setReal<T extends Quat2Like>(out: T, a: Readonly<QuatLike>): T;
    /**
     * Set the dual component of a {@link Quat2} to the given quaternion
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - a quaternion representing the dual part
     * @return `out`
     */
    static setDual<T extends Quat2Like>(out: T, a: Readonly<QuatLike>): T;
    /**
     * Gets the translation of a normalized {@link Quat2}
     * @category Static
     *
     * @param out - the receiving translation vector
     * @param a - Dual Quaternion to be decomposed
     * @return `out`
     */
    static getTranslation<T extends Vec3Like>(out: T, a: Readonly<Quat2Like>): T;
    /**
     * Translates a {@link Quat2} by the given vector
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - the dual quaternion to translate
     * @param v - vector to translate by
     * @returns `out`
     */
    static translate<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, v: Readonly<Vec3Like>): T;
    /**
     * Rotates a {@link Quat2} around the X axis
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - the dual quaternion to rotate
     * @param rad - angle (in radians) to rotate
     * @returns `out`
     */
    static rotateX<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, rad: number): T;
    /**
     * Rotates a {@link Quat2} around the Y axis
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - the dual quaternion to rotate
     * @param rad - angle (in radians) to rotate
     * @returns `out`
     */
    static rotateY<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, rad: number): T;
    /**
     * Rotates a {@link Quat2} around the Z axis
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - the dual quaternion to rotate
     * @param rad - angle (in radians) to rotate
     * @returns `out`
     */
    static rotateZ<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, rad: number): T;
    /**
     * Rotates a {@link Quat2} by a given quaternion (a * q)
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - the dual quaternion to rotate
     * @param q - quaternion to rotate by
     * @returns `out`
     */
    static rotateByQuatAppend<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, q: Readonly<QuatLike>): T;
    /**
     * Rotates a {@link Quat2} by a given quaternion (q * a)
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param q - quaternion to rotate by
     * @param a - the dual quaternion to rotate
     * @returns `out`
     */
    static rotateByQuatPrepend<T extends Quat2Like>(out: T, q: Readonly<QuatLike>, a: Readonly<Quat2Like>): T;
    /**
     * Rotates a {@link Quat2} around a given axis. Does the normalization automatically
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - the dual quaternion to rotate
     * @param axis - the axis to rotate around
     * @param rad - how far the rotation should be
     * @returns `out`
     */
    static rotateAroundAxis<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, axis: Readonly<Vec3Like>, rad: number): T;
    /**
     * Adds two {@link Quat2}s
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - the first operand
     * @param b - the second operand
     * @returns `out`
     */
    static add<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, b: Readonly<Quat2Like>): T;
    /**
     * Multiplies two {@link Quat2}s
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - the first operand
     * @param b - the second operand
     * @returns {quat2} out
     */
    static multiply<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, b: Readonly<Quat2Like>): T;
    /**
     * Alias for {@link Quat2.multiply}
     * @category Static
     */
    static mul<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, b: Readonly<Quat2Like>): T;
    /**
     * Scales a {@link Quat2} by a scalar value
     * @category Static
     *
     * @param out - the receiving dual quaterion
     * @param a - the dual quaternion to scale
     * @param b - scalar value to scale the dual quaterion by
     * @returns `out`
     */
    static scale<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, b: number): T;
    /**
     * Calculates the dot product of two {@link Quat2}s (The dot product of the real parts)
     * @category Static
     *
     * @param a - the first operand
     * @param b - the second operand
     * @returns dot product of a and b
     */
    static dot(a: Readonly<Quat2Like>, b: Readonly<Quat2Like>): number;
    /**
     * Performs a linear interpolation between two {@link Quat2}s
     * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when `t = 0.5`)
     * @category Static
     *
     * @param out - the receiving dual quat
     * @param a - the first operand
     * @param b - the second operand
     * @param t - interpolation amount, in the range [0-1], between the two inputs
     * @returns `out`
     */
    static lerp<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>, b: Readonly<Quat2Like>, t: number): T;
    /**
     * Calculates the inverse of a {@link Quat2}. If they are normalized, conjugate is cheaper
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - dual quat to calculate inverse of
     * @returns `out`
     */
    static invert<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>): T;
    /**
     * Calculates the conjugate of a {@link Quat2}
     * If the dual quaternion is normalized, this function is faster than {@link Quat2.invert} and produces the same result.
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - dual quaternion to calculate conjugate of
     * @returns `out`
     */
    static conjugate<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>): T;
    /**
     * Calculates the magnitude (length) of a {@link Quat2}
     * @category Static
     *
     * @param a - dual quaternion to calculate length of
     * @returns length of `a`
     */
    static magnitude(a: Readonly<Quat2Like>): number;
    /**
     * Alias for {@link Quat2.magnitude}
     * @category Static
     */
    static mag(a: Readonly<Quat2Like>): number;
    /**
     * Alias for {@link Quat2.magnitude}
     * @category Static
     * @deprecated Use {@link Quat2.magnitude} to avoid conflicts with builtin `length` methods/attribs
     */
    static length(a: Readonly<Quat2Like>): number;
    /**
     * Alias for {@link Quat2.magnitude}
     * @category Static
     * @deprecated Use {@link Quat2.mag}
     */
    static len(a: Readonly<Quat2Like>): number;
    /**
     * Calculates the squared length of a {@link Quat2}
     * @category Static
     *
     * @param a - dual quaternion to calculate squared length of
     * @returns squared length of a
     */
    static squaredLength(a: Readonly<Quat2Like>): number;
    /**
     * Alias for {@link Quat2.squaredLength}
     * @category Static
     */
    static sqrLen(a: Readonly<Quat2Like>): number;
    /**
     * Normalize a {@link Quat2}
     * @category Static
     *
     * @param out - the receiving dual quaternion
     * @param a - dual quaternion to normalize
     * @returns `out`
     */
    static normalize<T extends Quat2Like>(out: T, a: Readonly<Quat2Like>): T;
    /**
     * Returns a string representation of a {@link Quat2}
     * @category Static
     *
     * @param a - dual quaternion to represent as a string
     * @returns string representation of the vector
     */
    static str(a: Readonly<Quat2Like>): string;
    /**
     * Returns whether or not the {@link Quat2}s have exactly the same elements in the same position (when compared with ===)
     * @category Static
     *
     * @param a - The first dual quaternion.
     * @param b - The second dual quaternion.
     * @returns True if the dual quaternions are equal, false otherwise.
     */
    static exactEquals(a: Readonly<Quat2Like>, b: Readonly<Quat2Like>): boolean;
    /**
     * Returns whether or not the {@link Quat2}s have approximately the same elements in the same position.
     * @category Static
     *
     * @param a - The first dual quaternion.
     * @param b - The second dual quaternion.
     * @returns True if the dual quaternions are equal, false otherwise.
     */
    static equals(a: Readonly<Quat2Like>, b: Readonly<Quat2Like>): boolean;
}
/**
 * Quat2 alias for backwards compatibility
 */
export declare const quat2: typeof Quat2;
