export default Remove;
/**
 * Removes the given item, or array of items, from the array.
 *
 * The array is modified in-place.
 *
 * You can optionally specify a callback to be invoked for each item successfully removed from the array.
 *
 * @function Phaser.Utils.Array.Remove
 * @since 3.4.0
 *
 * @param {array} array - The array to be modified.
 * @param {*|Array.<*>} item - The item, or array of items, to be removed from the array.
 * @param {function} [callback] - A callback to be invoked for each item successfully removed from the array.
 * @param {object} [context] - The context in which the callback is invoked.
 *
 * @return {*|Array.<*>} The item, or array of items, that were successfully removed from the array.
 */
declare function Remove(array: any, item: any | Array<any>, callback?: Function, context?: object): any | Array<any>;
