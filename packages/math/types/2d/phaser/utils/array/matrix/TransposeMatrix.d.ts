export default TransposeMatrix;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Transposes the elements of the given matrix (array of arrays).
 *
 * The transpose of a matrix is a new matrix whose rows are the columns of the original.
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
 * @function Phaser.Utils.Array.Matrix.TransposeMatrix
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [array,$return]
 *
 * @param {T[][]} [array] - The array matrix to transpose.
 *
 * @return {T[][]} A new array matrix which is a transposed version of the given array.
 */
declare function TransposeMatrix(array?: T[][]): T[][];
