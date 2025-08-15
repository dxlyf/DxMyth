export default ColorSpectrum;
/**
 * Return an array of Colors in a Color Spectrum.
 *
 * The spectrum colors flow in the order: red, yellow, green, blue.
 *
 * By default this function will return an array with 1024 elements in.
 *
 * However, you can reduce this to a smaller quantity if needed, by specitying the `limit` parameter.
 *
 * @function Phaser.Display.Color.ColorSpectrum
 * @since 3.50.0
 *
 * @param {number} [limit=1024] - How many colors should be returned? The maximum is 1024 but you can set a smaller quantity if required.
 *
 * @return {Phaser.Types.Display.ColorObject[]} An array containing `limit` parameter number of elements, where each contains a Color Object.
 */
declare function ColorSpectrum(limit?: number): Phaser.Types.Display.ColorObject[];
