export default HasAny;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Verifies that an object contains at least one of the requested keys
 *
 * @function Phaser.Utils.Objects.HasAny
 * @since 3.0.0
 *
 * @param {object} source - an object on which to check for key existence
 * @param {string[]} keys - an array of keys to search the object for
 *
 * @return {boolean} true if the source object contains at least one of the keys, false otherwise
 */
declare function HasAny(source: object, keys: string[]): boolean;
