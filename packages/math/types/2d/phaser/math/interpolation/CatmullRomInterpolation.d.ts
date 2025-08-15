export default CatmullRomInterpolation;
/**
 * A Catmull-Rom interpolation method.
 *
 * @function Phaser.Math.Interpolation.CatmullRom
 * @since 3.0.0
 *
 * @param {number[]} v - The input array of values to interpolate between.
 * @param {number} k - The percentage of interpolation, between 0 and 1.
 *
 * @return {number} The interpolated value.
 */
declare function CatmullRomInterpolation(v: number[], k: number): number;
