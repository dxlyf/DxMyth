/**
 * Checks if the given number is between zero (0) and the ending number. 0 is inclusive.
 *
 * * Numbers can be negative or positive.
 * * Ending number is exclusive.
 *
 * @param {number} number The number to check.
 * @param {number} end The end of the range. Exclusive.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export declare function inRange(number: number, end: number): boolean;
/**
 * Checks if the given number is between two numbers.
 *
 * * Numbers can be negative or positive.
 * * Starting number is inclusive.
 * * Ending number is exclusive.
 * * The start and the end of the range can be ascending OR descending order.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range. Inclusive.
 * @param {number} end The end of the range. Exclusive.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export declare function inRange(number: number, start: number, end: number): boolean;
export declare const toFloat: <T extends number | null = number>(value: any, defaultValue?: T) => number | T;
export declare const toInt: <T extends number | null = number>(value: any, defaultValue?: T) => number | T;
