export default MoveAbove;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Moves the given array element above another one in the array.
 * If the given element is already above the other, it isn't moved.
 * Above means toward the end of the array.
 * The array is modified in-place.
 *
 * @function Phaser.Utils.Array.MoveAbove
 * @since 3.55.0
 *
 * @param {array} array - The input array.
 * @param {*} item1 - The element to move above base element.
 * @param {*} item2 - The base element.
 *
 *
 * @return {array} The input array.
 */
declare function MoveAbove(array: any, item1: any, item2: any): any;
