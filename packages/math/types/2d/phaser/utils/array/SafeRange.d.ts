export default SafeRange;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Tests if the start and end indexes are a safe range for the given array.
 *
 * @function Phaser.Utils.Array.SafeRange
 * @since 3.4.0
 *
 * @param {array} array - The array to check.
 * @param {number} startIndex - The start index.
 * @param {number} endIndex - The end index.
 * @param {boolean} [throwError=false] - Throw an error if the range is out of bounds.
 *
 * @return {boolean} True if the range is safe, otherwise false.
 */
declare function SafeRange(array: any, startIndex: number, endIndex: number, throwError?: boolean): boolean;
