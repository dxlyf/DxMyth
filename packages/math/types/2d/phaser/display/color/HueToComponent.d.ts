export default HueToComponent;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Converts a hue to an RGB color.
 * Based on code by Michael Jackson (https://github.com/mjijackson)
 *
 * @function Phaser.Display.Color.HueToComponent
 * @since 3.0.0
 *
 * @param {number} p
 * @param {number} q
 * @param {number} t
 *
 * @return {number} The combined color value.
 */
declare function HueToComponent(p: number, q: number, t: number): number;
