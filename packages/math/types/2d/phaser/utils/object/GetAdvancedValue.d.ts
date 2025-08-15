export default GetAdvancedValue;
/**
 * Retrieves a value from an object. Allows for more advanced selection options, including:
 *
 * Allowed types:
 *
 * Explicit:
 * {
 *     x: 4
 * }
 *
 * From function
 * {
 *     x: function ()
 * }
 *
 * Randomly pick one element from the array
 * {
 *     x: [a, b, c, d, e, f]
 * }
 *
 * Random integer between min and max:
 * {
 *     x: { randInt: [min, max] }
 * }
 *
 * Random float between min and max:
 * {
 *     x: { randFloat: [min, max] }
 * }
 *
 *
 * @function Phaser.Utils.Objects.GetAdvancedValue
 * @since 3.0.0
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`) - `banner.hideBanner` would return the value of the `hideBanner` property from the object stored in the `banner` property of the `source` object.
 * @param {*} defaultValue - The value to return if the `key` isn't found in the `source` object.
 *
 * @return {*} The value of the requested key.
 */
declare function GetAdvancedValue(source: object, key: string, defaultValue: any): any;
