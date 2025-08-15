export default BresenhamPoints;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Using Bresenham's line algorithm this will return an array of all coordinates on this line.
 *
 * The `start` and `end` points are rounded before this runs as the algorithm works on integers.
 *
 * @function Phaser.Geom.Line.BresenhamPoints
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {number} [stepRate=1] - The optional step rate for the points on the line.
 * @param {Phaser.Types.Math.Vector2Like[]} [results] - An optional array to push the resulting coordinates into.
 *
 * @return {Phaser.Types.Math.Vector2Like[]} The array of coordinates on the line.
 */
declare function BresenhamPoints(line: Phaser.Geom.Line, stepRate?: number, results?: Phaser.Types.Math.Vector2Like[]): Phaser.Types.Math.Vector2Like[];
