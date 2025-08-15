export default ObjectToColor;
/**
 * Converts an object containing `r`, `g`, `b` and `a` properties into a Color class instance.
 *
 * @function Phaser.Display.Color.ObjectToColor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Display.InputColorObject} input - An object containing `r`, `g`, `b` and `a` properties in the range 0 to 255.
 *
 * @return {Phaser.Display.Color} A Color object.
 */
declare function ObjectToColor(input: Phaser.Types.Display.InputColorObject): Phaser.Display.Color;
