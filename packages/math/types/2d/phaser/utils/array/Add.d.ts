export default Add;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Adds the given item, or array of items, to the array.
 *
 * Each item must be unique within the array.
 *
 * The array is modified in-place and returned.
 *
 * You can optionally specify a limit to the maximum size of the array. If the quantity of items being
 * added will take the array length over this limit, it will stop adding once the limit is reached.
 *
 * You can optionally specify a callback to be invoked for each item successfully added to the array.
 *
 * @function Phaser.Utils.Array.Add
 * @since 3.4.0
 *
 * @param {array} array - The array to be added to.
 * @param {any|any[]} item - The item, or array of items, to add to the array. Each item must be unique within the array.
 * @param {number} [limit] - Optional limit which caps the size of the array.
 * @param {function} [callback] - A callback to be invoked for each item successfully added to the array.
 * @param {object} [context] - The context in which the callback is invoked.
 *
 * @return {array} The input array.
 */
declare function Add(array: any, item: any | any[], limit?: number, callback?: Function, context?: object): any;
