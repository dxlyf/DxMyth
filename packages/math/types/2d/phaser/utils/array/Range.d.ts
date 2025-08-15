export default Range;
/**
 * Creates an array populated with a range of values, based on the given arguments and configuration object.
 *
 * Range ([a,b,c], [1,2,3]) =
 * a1, a2, a3, b1, b2, b3, c1, c2, c3
 *
 * Range ([a,b], [1,2,3], qty = 3) =
 * a1, a1, a1, a2, a2, a2, a3, a3, a3, b1, b1, b1, b2, b2, b2, b3, b3, b3
 *
 * Range ([a,b,c], [1,2,3], repeat x1) =
 * a1, a2, a3, b1, b2, b3, c1, c2, c3, a1, a2, a3, b1, b2, b3, c1, c2, c3
 *
 * Range ([a,b], [1,2], repeat -1 = endless, max = 14) =
 * Maybe if max is set then repeat goes to -1 automatically?
 * a1, a2, b1, b2, a1, a2, b1, b2, a1, a2, b1, b2, a1, a2 (capped at 14 elements)
 *
 * Range ([a], [1,2,3,4,5], random = true) =
 * a4, a1, a5, a2, a3
 *
 * Range ([a, b], [1,2,3], random = true) =
 * b3, a2, a1, b1, a3, b2
 *
 * Range ([a, b, c], [1,2,3], randomB = true) =
 * a3, a1, a2, b2, b3, b1, c1, c3, c2
 *
 * Range ([a], [1,2,3,4,5], yoyo = true) =
 * a1, a2, a3, a4, a5, a5, a4, a3, a2, a1
 *
 * Range ([a, b], [1,2,3], yoyo = true) =
 * a1, a2, a3, b1, b2, b3, b3, b2, b1, a3, a2, a1
 *
 * @function Phaser.Utils.Array.Range
 * @since 3.0.0
 *
 * @param {array} a - The first array of range elements.
 * @param {array} b - The second array of range elements.
 * @param {object} [options] - A range configuration object. Can contain: repeat, random, randomB, yoyo, max, qty.
 *
 * @return {array} An array of arranged elements.
 */
declare function Range(a: array, b: array, options?: object): array;
