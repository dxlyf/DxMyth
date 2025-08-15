export default SetToAngle;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Set a line to a given position, angle and length.
 *
 * @function Phaser.Geom.Line.SetToAngle
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to set.
 * @param {number} x - The horizontal start position of the line.
 * @param {number} y - The vertical start position of the line.
 * @param {number} angle - The angle of the line in radians.
 * @param {number} length - The length of the line.
 *
 * @return {Phaser.Geom.Line} The updated line.
 */
declare function SetToAngle(line: Phaser.Geom.Line, x: number, y: number, angle: number, length: number): Phaser.Geom.Line;
