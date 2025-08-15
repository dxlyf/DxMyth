export default Merge;
/**
 * Creates a new Object using all values from obj1 and obj2.
 * If a value exists in both obj1 and obj2, the value in obj1 is used.
 *
 * This is only a shallow copy. Deeply nested objects are not cloned, so be sure to only use this
 * function on shallow objects.
 *
 * @function Phaser.Utils.Objects.Merge
 * @since 3.0.0
 *
 * @param {object} obj1 - The first object.
 * @param {object} obj2 - The second object.
 *
 * @return {object} A new object containing the union of obj1's and obj2's properties.
 */
declare function Merge(obj1: object, obj2: object): object;
