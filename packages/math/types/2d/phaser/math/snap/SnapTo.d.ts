export default SnapTo;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Snap a value to nearest grid slice, using rounding.
 *
 * Example: if you have an interval gap of `5` and a position of `12`... you will snap to `10` whereas `14` will snap to `15`.
 *
 * @function Phaser.Math.Snap.To
 * @since 3.0.0
 *
 * @param {number} value - The value to snap.
 * @param {number} gap - The interval gap of the grid.
 * @param {number} [start=0] - Optional starting offset for gap.
 * @param {boolean} [divide=false] - If `true` it will divide the snapped value by the gap before returning.
 *
 * @return {number} The snapped value.
 */
declare function SnapTo(value: number, gap: number, start?: number, divide?: boolean): number;
