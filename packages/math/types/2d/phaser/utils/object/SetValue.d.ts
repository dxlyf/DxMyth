export default SetValue;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Sets a value in an object, allowing for dot notation to control the depth of the property.
 *
 * For example:
 *
 * ```javascript
 * var data = {
 *   world: {
 *     position: {
 *       x: 200,
 *       y: 100
 *     }
 *   }
 * };
 *
 * SetValue(data, 'world.position.y', 300);
 *
 * console.log(data.world.position.y); // 300
 * ```
 *
 * @function Phaser.Utils.Objects.SetValue
 * @since 3.17.0
 *
 * @param {object} source - The object to set the value in.
 * @param {string} key - The name of the property in the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`)
 * @param {any} value - The value to set into the property, if found in the source object.
 *
 * @return {boolean} `true` if the property key was valid and the value was set, otherwise `false`.
 */
declare function SetValue(source: object, key: string, value: any): boolean;
