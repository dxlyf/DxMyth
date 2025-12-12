export declare const EPSILON = 1e-9;
/** @internal @deprecated */
export declare const isFinite: (number: unknown) => boolean;
/**
 * @deprecated
 * Next Largest Power of 2 Given a binary integer value x, the next largest
 * power of 2 can be computed by a SWAR algorithm that recursively "folds" the
 * upper bits into the lower bits. This process yields a bit vector with the
 * same most significant 1 as x, but all 1's below it. Adding 1 to that value
 * yields the next largest power of 2. For a 32-bit value:
 */
export declare function nextPowerOfTwo(x: number): number;
/** @deprecated */
export declare function isPowerOfTwo(x: number): boolean;
/** @deprecated */
export declare function mod(num: number, min?: number, max?: number): number;
/**
 * @deprecated
 * Returns a min if num is less than min, and max if more than max, otherwise returns num.
 */
export declare function clamp(num: number, min: number, max: number): number;
/**
 * @deprecated
 * Returns a random number between min and max when two arguments are provided.
 * If one arg is provided between 0 to max.
 * If one arg is passed between 0 to 1.
 */
export declare function random(min?: number, max?: number): number;
/** @ignore */
export declare const math: any;
