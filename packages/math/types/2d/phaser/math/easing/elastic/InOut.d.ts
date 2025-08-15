export default InOut;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Elastic ease-in/out.
 *
 * @function Phaser.Math.Easing.Elastic.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 * @param {number} [amplitude=0.1] - The amplitude of the elastic ease.
 * @param {number} [period=0.1] - Sets how tight the sine-wave is, where smaller values are tighter waves, which result in more cycles.
 *
 * @return {number} The tweened value.
 */
declare function InOut(v: number, amplitude?: number, period?: number): number;
