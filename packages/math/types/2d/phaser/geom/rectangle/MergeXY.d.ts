export default MergeXY;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Merges a Rectangle with a point by repositioning and/or resizing it so that the point is on or within its bounds.
 *
 * @function Phaser.Geom.Rectangle.MergeXY
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [target,$return]
 *
 * @param {Phaser.Geom.Rectangle} target - The Rectangle which should be merged and modified.
 * @param {number} x - The X coordinate of the point which should be merged.
 * @param {number} y - The Y coordinate of the point which should be merged.
 *
 * @return {Phaser.Geom.Rectangle} The modified `target` Rectangle.
 */
declare function MergeXY(target: Phaser.Geom.Rectangle, x: number, y: number): Phaser.Geom.Rectangle;
