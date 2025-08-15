export default RectangleToRectangle;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Checks if two Rectangles intersect.
 *
 * A Rectangle intersects another Rectangle if any part of its bounds is within the other Rectangle's bounds.
 * As such, the two Rectangles are considered "solid".
 * A Rectangle with no width or no height will never intersect another Rectangle.
 *
 * @function Phaser.Geom.Intersects.RectangleToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - The first Rectangle to check for intersection.
 * @param {Phaser.Geom.Rectangle} rectB - The second Rectangle to check for intersection.
 *
 * @return {boolean} `true` if the two Rectangles intersect, otherwise `false`.
 */
declare function RectangleToRectangle(rectA: Phaser.Geom.Rectangle, rectB: Phaser.Geom.Rectangle): boolean;
