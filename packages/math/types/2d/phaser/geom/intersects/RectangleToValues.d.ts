export default RectangleToValues;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Check if rectangle intersects with values.
 *
 * @function Phaser.Geom.Intersects.RectangleToValues
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The rectangle object
 * @param {number} left - The x coordinate of the left of the Rectangle.
 * @param {number} right - The x coordinate of the right of the Rectangle.
 * @param {number} top - The y coordinate of the top of the Rectangle.
 * @param {number} bottom - The y coordinate of the bottom of the Rectangle.
 * @param {number} [tolerance=0] - Tolerance allowed in the calculation, expressed in pixels.
 *
 * @return {boolean} Returns true if there is an intersection.
 */
declare function RectangleToValues(rect: Phaser.Geom.Rectangle, left: number, right: number, top: number, bottom: number, tolerance?: number): boolean;
