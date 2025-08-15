export default RotateAroundXY;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Rotate a line around the given coordinates by the given angle in radians.
 *
 * @function Phaser.Geom.Line.RotateAroundXY
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to rotate.
 * @param {number} x - The horizontal coordinate to rotate the line around.
 * @param {number} y - The vertical coordinate to rotate the line around.
 * @param {number} angle - The angle of rotation in radians.
 *
 * @return {Phaser.Geom.Line} The rotated line.
 */
declare function RotateAroundXY(line: Phaser.Geom.Line, x: number, y: number, angle: number): Phaser.Geom.Line;
