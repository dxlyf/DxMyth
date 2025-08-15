export default RGBToHSV;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Converts an RGB color value to HSV (hue, saturation and value).
 * Conversion formula from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes RGB values are contained in the set [0, 255] and returns h, s and v in the set [0, 1].
 * Based on code by Michael Jackson (https://github.com/mjijackson)
 *
 * @function Phaser.Display.Color.RGBToHSV
 * @since 3.0.0
 *
 * @param {number} r - The red color value. A number between 0 and 255.
 * @param {number} g - The green color value. A number between 0 and 255.
 * @param {number} b - The blue color value. A number between 0 and 255.
 * @param {(Phaser.Types.Display.HSVColorObject|Phaser.Display.Color)} [out] - An object to store the color values in. If not given an HSV Color Object will be created.
 *
 * @return {(Phaser.Types.Display.HSVColorObject|Phaser.Display.Color)} An object with the properties `h`, `s` and `v` set.
 */
declare function RGBToHSV(r: number, g: number, b: number, out?: (Phaser.Types.Display.HSVColorObject | Phaser.Display.Color)): (Phaser.Types.Display.HSVColorObject | Phaser.Display.Color);
