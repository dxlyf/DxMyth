export default BetweenPointsY;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
 *
 * The difference between this method and {@link Phaser.Math.Angle.BetweenPoints} is that this assumes the y coordinate
 * travels down the screen.
 *
 * @function Phaser.Math.Angle.BetweenPointsY
 * @since 3.0.0
 *
 * @param {Phaser.Types.Math.Vector2Like} point1 - The first point.
 * @param {Phaser.Types.Math.Vector2Like} point2 - The second point.
 *
 * @return {number} The angle in radians.
 */
declare function BetweenPointsY(point1: Phaser.Types.Math.Vector2Like, point2: Phaser.Types.Math.Vector2Like): number;
