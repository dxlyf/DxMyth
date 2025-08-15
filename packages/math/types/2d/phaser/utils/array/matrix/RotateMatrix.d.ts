export default RotateMatrix;
/**
 * Rotates the array matrix based on the given rotation value.
 *
 * The value can be given in degrees: 90, -90, 270, -270 or 180,
 * or a string command: `rotateLeft`, `rotateRight` or `rotate180`.
 *
 * Based on the routine from {@link http://jsfiddle.net/MrPolywhirl/NH42z/}.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 *
 * @function Phaser.Utils.Array.Matrix.RotateMatrix
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [matrix,$return]
 *
 * @param {T[][]} [matrix] - The array to rotate.
 * @param {(number|string)} [direction=90] - The amount to rotate the matrix by.
 *
 * @return {T[][]} The rotated matrix array. The source matrix should be discard for the returned matrix.
 */
declare function RotateMatrix(matrix?: T[][], direction?: (number | string)): T[][];
