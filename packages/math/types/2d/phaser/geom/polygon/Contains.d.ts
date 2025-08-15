export default Contains;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Checks if a point is within the bounds of a Polygon.
 *
 * @function Phaser.Geom.Polygon.Contains
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to check against.
 * @param {number} x - The X coordinate of the point to check.
 * @param {number} y - The Y coordinate of the point to check.
 *
 * @return {boolean} `true` if the point is within the bounds of the Polygon, otherwise `false`.
 */
declare function Contains(polygon: Phaser.Geom.Polygon, x: number, y: number): boolean;
