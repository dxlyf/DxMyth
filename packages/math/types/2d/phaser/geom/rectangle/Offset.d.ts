export default Offset;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Nudges (translates) the top left corner of a Rectangle by a given offset.
 *
 * @function Phaser.Geom.Rectangle.Offset
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to adjust.
 * @param {number} x - The distance to move the Rectangle horizontally.
 * @param {number} y - The distance to move the Rectangle vertically.
 *
 * @return {Phaser.Geom.Rectangle} The adjusted Rectangle.
 */
declare function Offset(rect: Phaser.Geom.Rectangle, x: number, y: number): Phaser.Geom.Rectangle;
