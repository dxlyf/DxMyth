export default Floor;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Rounds down (floors) the top left X and Y coordinates of the given Rectangle to the largest integer less than or equal to them
 *
 * @function Phaser.Geom.Rectangle.Floor
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The rectangle to floor the top left X and Y coordinates of
 *
 * @return {Phaser.Geom.Rectangle} The rectangle that was passed to this function with its coordinates floored.
 */
declare function Floor(rect: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle;
