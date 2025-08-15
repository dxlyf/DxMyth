export default StableSort;
/**
 * An in-place stable array sort, because `Array#sort()` is not guaranteed stable.
 *
 * This is an implementation of merge sort, without recursion.
 *
 * Function based on the Two-Screen/stable sort 0.1.8 from https://github.com/Two-Screen/stable
 *
 * @function Phaser.Utils.Array.StableSort
 * @since 3.0.0
 *
 * @param {array} array - The input array to be sorted.
 * @param {function} [compare] - The comparison function.
 *
 * @return {array} The sorted result.
 */
declare function StableSort(array: any, compare?: Function, stableSort?: boolean): any;
