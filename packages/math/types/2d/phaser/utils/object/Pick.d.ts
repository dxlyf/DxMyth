export default Pick;
/**
 * Returns a new object that only contains the `keys` that were found on the object provided.
 * If no `keys` are found, an empty object is returned.
 *
 * @function Phaser.Utils.Objects.Pick
 * @since 3.18.0
 *
 * @param {object} object - The object to pick the provided keys from.
 * @param {array} keys - An array of properties to retrieve from the provided object.
 *
 * @return {object} A new object that only contains the `keys` that were found on the provided object. If no `keys` were found, an empty object will be returned.
 */
declare function Pick(object: object, keys: array): object;
