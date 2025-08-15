export default MergeRight;
/**
 * Creates a new Object using all values from obj1.
 *
 * Then scans obj2. If a property is found in obj2 that *also* exists in obj1, the value from obj2 is used, otherwise the property is skipped.
 *
 * @function Phaser.Utils.Objects.MergeRight
 * @since 3.0.0
 *
 * @param {object} obj1 - The first object to merge.
 * @param {object} obj2 - The second object to merge. Keys from this object which also exist in `obj1` will be copied to `obj1`.
 *
 * @return {object} The merged object. `obj1` and `obj2` are not modified.
 */
declare function MergeRight(obj1: object, obj2: object): object;
