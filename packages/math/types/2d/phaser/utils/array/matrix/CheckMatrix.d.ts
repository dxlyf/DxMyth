export default CheckMatrix;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Checks if an array can be used as a matrix.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. This is an example matrix:
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
 * @function Phaser.Utils.Array.Matrix.CheckMatrix
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [matrix]
 *
 * @param {T[][]} [matrix] - The array to check.
 *
 * @return {boolean} `true` if the given `matrix` array is a valid matrix.
 */
declare function CheckMatrix(matrix?: T[][]): boolean;
