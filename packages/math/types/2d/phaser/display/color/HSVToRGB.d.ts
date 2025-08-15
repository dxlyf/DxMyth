export default HSVToRGB;
/**
 * Converts a HSV (hue, saturation and value) color set to RGB.
 *
 * Conversion formula from https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * Assumes HSV values are contained in the set [0, 1].
 *
 * @function Phaser.Display.Color.HSVToRGB
 * @since 3.0.0
 *
 * @param {number} h - The hue, in the range 0 - 1. This is the base color.
 * @param {number} s - The saturation, in the range 0 - 1. This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
 * @param {number} v - The value, in the range 0 - 1. This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
 * @param {(Phaser.Types.Display.ColorObject|Phaser.Display.Color)} [out] - A Color object to store the results in. If not given a new ColorObject will be created.
 *
 * @return {(Phaser.Types.Display.ColorObject|Phaser.Display.Color)} An object with the red, green and blue values set in the r, g and b properties.
 */
declare function HSVToRGB(h: number, s: number, v: number, out?: (Phaser.Types.Display.ColorObject | Phaser.Display.Color)): (Phaser.Types.Display.ColorObject | Phaser.Display.Color);
