export default GetBoolean;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Retrieves the value of the given key from an object.
 *
 * @function Phaser.Tweens.Builders.GetBoolean
 * @since 3.0.0
 *
 * @param {object} source - The object to retrieve the value from.
 * @param {string} key - The key to look for in the `source` object.
 * @param {boolean} defaultValue - The default value to return if the `key` doesn't exist or if no `source` object is provided.
 *
 * @return {boolean} The retrieved value.
 */
declare function GetBoolean(source: object, key: string, defaultValue: boolean): boolean;
