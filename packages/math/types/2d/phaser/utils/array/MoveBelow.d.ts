export default MoveBelow;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Moves the given array element below another one in the array.
 * If the given element is already below the other, it isn't moved.
 * Below means toward the start of the array.
 * The array is modified in-place.
 *
 * @function Phaser.Utils.Array.MoveBelow
 * @since 3.55.0
 *
 * @param {array} array - The input array.
 * @param {*} item1 - The element to move below base element.
 * @param {*} item2 - The base element.
 *
 *
 * @return {array} The input array.
 */
declare function MoveBelow(array: any, item1: any, item2: any): any;
