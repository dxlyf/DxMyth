export default CenterOn;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Moves the top-left corner of a Rectangle so that its center is at the given coordinates.
 *
 * @function Phaser.Geom.Rectangle.CenterOn
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to be centered.
 * @param {number} x - The X coordinate of the Rectangle's center.
 * @param {number} y - The Y coordinate of the Rectangle's center.
 *
 * @return {Phaser.Geom.Rectangle} The centered rectangle.
 */
declare function CenterOn(rect: Phaser.Geom.Rectangle, x: number, y: number): Phaser.Geom.Rectangle;
