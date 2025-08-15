declare namespace _default {
    export { RGBWithRGB };
    export { ColorWithRGB };
    export { ColorWithColor };
}
export default _default;
/**
 * @namespace Phaser.Display.Color.Interpolate
 * @memberof Phaser.Display.Color
 * @since 3.0.0
 */
/**
 * Interpolates between the two given color ranges over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.RGBWithRGB
 * @memberof Phaser.Display.Color.Interpolate
 * @static
 * @since 3.0.0
 *
 * @param {number} r1 - Red value.
 * @param {number} g1 - Blue value.
 * @param {number} b1 - Green value.
 * @param {number} r2 - Red value.
 * @param {number} g2 - Blue value.
 * @param {number} b2 - Green value.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the interpolated color values.
 */
declare function RGBWithRGB(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, length?: number, index?: number): Phaser.Types.Display.ColorObject;
/**
 * Interpolates between the Color object and color values over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.ColorWithRGB
 * @memberof Phaser.Display.Color.Interpolate
 * @static
 * @since 3.0.0
 *
 * @param {Phaser.Display.Color} color1 - The first Color object.
 * @param {number} r - Red value.
 * @param {number} g - Blue value.
 * @param {number} b - Green value.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the interpolated color values.
 */
declare function ColorWithRGB(color: any, r: number, g: number, b: number, length?: number, index?: number): Phaser.Types.Display.ColorObject;
/**
 * Interpolates between the two given color objects over the length supplied.
 *
 * @function Phaser.Display.Color.Interpolate.ColorWithColor
 * @memberof Phaser.Display.Color.Interpolate
 * @static
 * @since 3.0.0
 *
 * @param {Phaser.Display.Color} color1 - The first Color object.
 * @param {Phaser.Display.Color} color2 - The second Color object.
 * @param {number} [length=100] - Distance to interpolate over.
 * @param {number} [index=0] - Index to start from.
 *
 * @return {Phaser.Types.Display.ColorObject} An object containing the interpolated color values.
 */
declare function ColorWithColor(color1: Phaser.Display.Color, color2: Phaser.Display.Color, length?: number, index?: number): Phaser.Types.Display.ColorObject;
