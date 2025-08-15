export default CatmullRom;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Calculates a Catmull-Rom value from the given points, based on an alpha of 0.5.
 *
 * @function Phaser.Math.CatmullRom
 * @since 3.0.0
 *
 * @param {number} t - The amount to interpolate by.
 * @param {number} p0 - The first control point.
 * @param {number} p1 - The second control point.
 * @param {number} p2 - The third control point.
 * @param {number} p3 - The fourth control point.
 *
 * @return {number} The Catmull-Rom value.
 */
declare function CatmullRom(t: number, p0: number, p1: number, p2: number, p3: number): number;
