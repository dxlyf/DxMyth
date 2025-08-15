export default QuickSelect;
/**
 * A [Floyd-Rivest](https://en.wikipedia.org/wiki/Floyd%E2%80%93Rivest_algorithm) quick selection algorithm.
 *
 * Rearranges the array items so that all items in the [left, k] range are smaller than all items in [k, right];
 * The k-th element will have the (k - left + 1)th smallest value in [left, right].
 *
 * The array is modified in-place.
 *
 * Based on code by [Vladimir Agafonkin](https://www.npmjs.com/~mourner)
 *
 * @function Phaser.Utils.Array.QuickSelect
 * @since 3.0.0
 *
 * @param {array} arr - The array to sort.
 * @param {number} k - The k-th element index.
 * @param {number} [left=0] - The index of the left part of the range.
 * @param {number} [right] - The index of the right part of the range.
 * @param {function} [compare] - An optional comparison function. Is passed two elements and should return 0, 1 or -1.
 */
declare function QuickSelect(arr: array, k: number, left?: number, right?: number, compare?: Function): void;
