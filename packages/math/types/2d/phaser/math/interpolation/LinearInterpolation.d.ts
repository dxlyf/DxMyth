export default LinearInterpolation;
/**
 * A linear interpolation method.
 *
 * @function Phaser.Math.Interpolation.Linear
 * @since 3.0.0
 * @see {@link https://en.wikipedia.org/wiki/Linear_interpolation}
 *
 * @param {number[]} v - The input array of values to interpolate between.
 * @param {!number} k - The percentage of interpolation, between 0 and 1.
 *
 * @return {!number} The interpolated value.
 */
declare function LinearInterpolation(v: number[], k: number): number;
