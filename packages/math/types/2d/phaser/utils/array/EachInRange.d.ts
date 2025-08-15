export default EachInRange;
/**
 * Passes each element in the array, between the start and end indexes, to the given callback.
 *
 * @function Phaser.Utils.Array.EachInRange
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {function} callback - A callback to be invoked for each item in the array.
 * @param {object} context - The context in which the callback is invoked.
 * @param {number} startIndex - The start index to search from.
 * @param {number} endIndex - The end index to search to.
 * @param {...*} [args] - Additional arguments that will be passed to the callback, after the child.
 *
 * @return {array} The input array.
 */
declare function EachInRange(array: any, callback: Function, context: object, startIndex: number, endIndex: number, ...args: any[]): any;
