export default RGBToString;
/**
 * Converts the color values into an HTML compatible color string, prefixed with either `#` or `0x`.
 *
 * @function Phaser.Display.Color.RGBToString
 * @since 3.0.0
 *
 * @param {number} r - The red color value. A number between 0 and 255.
 * @param {number} g - The green color value. A number between 0 and 255.
 * @param {number} b - The blue color value. A number between 0 and 255.
 * @param {number} [a=255] - The alpha value. A number between 0 and 255.
 * @param {string} [prefix=#] - The prefix of the string. Either `#` or `0x`.
 *
 * @return {string} A string-based representation of the color values.
 */
declare function RGBToString(r: number, g: number, b: number, a?: number, prefix?: string): string;
