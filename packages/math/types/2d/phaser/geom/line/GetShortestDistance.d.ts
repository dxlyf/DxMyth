export default GetShortestDistance;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Florian Mertens
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Get the shortest distance from a Line to the given Point.
 *
 * @function Phaser.Geom.Line.GetShortestDistance
 * @since 3.16.0
 *
 * @param {Phaser.Geom.Line} line - The line to get the distance from.
 * @param {Phaser.Types.Math.Vector2Like} point - The point to get the shortest distance to.
 *
 * @return {(boolean|number)} The shortest distance from the line to the point, or `false`.
 */
declare function GetShortestDistance(line: Phaser.Geom.Line, point: Phaser.Types.Math.Vector2Like): (boolean | number);
