export default GetAll;
/**
 * Returns all elements in the array.
 *
 * You can optionally specify a matching criteria using the `property` and `value` arguments.
 *
 * For example: `getAll('visible', true)` would return only elements that have their visible property set.
 *
 * Optionally you can specify a start and end index. For example if the array had 100 elements,
 * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
 * the first 50 elements.
 *
 * @function Phaser.Utils.Array.GetAll
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {string} [property] - The property to test on each array element.
 * @param {*} [value] - The value to test the property against. Must pass a strict (`===`) comparison check.
 * @param {number} [startIndex] - An optional start index to search from.
 * @param {number} [endIndex] - An optional end index to search to.
 *
 * @return {array} All matching elements from the array.
 */
declare function GetAll(array: any, property?: string, value?: any, startIndex?: number, endIndex?: number): any;
