export default RemoveBetween;
/**
 * Removes the item within the given range in the array.
 *
 * The array is modified in-place.
 *
 * You can optionally specify a callback to be invoked for the item/s successfully removed from the array.
 *
 * @function Phaser.Utils.Array.RemoveBetween
 * @since 3.4.0
 *
 * @param {array} array - The array to be modified.
 * @param {number} startIndex - The start index to remove from.
 * @param {number} endIndex - The end index to remove to.
 * @param {function} [callback] - A callback to be invoked for the item removed from the array.
 * @param {object} [context] - The context in which the callback is invoked.
 *
 * @return {Array.<*>} An array of items that were removed.
 */
declare function RemoveBetween(array: any, startIndex: number, endIndex: number, callback?: Function, context?: object): Array<any>;
