export default FloorTo;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Floors to some place comparative to a `base`, default is 10 for decimal place.
 *
 * The `place` is represented by the power applied to `base` to get that place.
 *
 * @function Phaser.Math.FloorTo
 * @since 3.0.0
 *
 * @param {number} value - The value to round.
 * @param {number} [place=0] - The place to round to.
 * @param {number} [base=10] - The base to round in. Default is 10 for decimal.
 *
 * @return {number} The rounded value.
 */
declare function FloorTo(value: number, place?: number, base?: number): number;
