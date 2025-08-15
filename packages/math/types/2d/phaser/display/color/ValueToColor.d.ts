export default ValueToColor;
/**
 * Converts the given source color value into an instance of a Color class.
 * The value can be either a string, prefixed with `rgb` or a hex string, a number or an Object.
 *
 * @function Phaser.Display.Color.ValueToColor
 * @since 3.0.0
 *
 * @param {(string|number|Phaser.Types.Display.InputColorObject)} input - The source color value to convert.
 *
 * @return {Phaser.Display.Color} A Color object.
 */
declare function ValueToColor(input: (string | number | Phaser.Types.Display.InputColorObject)): Phaser.Display.Color;
