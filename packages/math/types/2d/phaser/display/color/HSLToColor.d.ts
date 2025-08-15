export default HSLToColor;
/**
 * Converts HSL (hue, saturation and lightness) values to a Phaser Color object.
 *
 * @function Phaser.Display.Color.HSLToColor
 * @since 3.0.0
 *
 * @param {number} h - The hue value in the range 0 to 1.
 * @param {number} s - The saturation value in the range 0 to 1.
 * @param {number} l - The lightness value in the range 0 to 1.
 *
 * @return {Phaser.Display.Color} A Color object created from the results of the h, s and l values.
 */
declare function HSLToColor(h: number, s: number, l: number): Phaser.Display.Color;
