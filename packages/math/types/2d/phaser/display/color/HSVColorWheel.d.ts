export default HSVColorWheel;
/**
 * Generates an HSV color wheel which is an array of 360 Color objects, for each step of the wheel.
 *
 * @function Phaser.Display.Color.HSVColorWheel
 * @since 3.0.0
 *
 * @param {number} [s=1] - The saturation, in the range 0 - 1.
 * @param {number} [v=1] - The value, in the range 0 - 1.
 *
 * @return {Phaser.Types.Display.ColorObject[]} An array containing 360 ColorObject elements, where each element contains a Color object corresponding to the color at that point in the HSV color wheel.
 */
declare function HSVColorWheel(s?: number, v?: number): Phaser.Types.Display.ColorObject[];
