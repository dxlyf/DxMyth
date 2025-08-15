export default RotateAroundXY;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Rotates an entire Triangle at a given angle about a specific point.
 *
 * @function Phaser.Geom.Triangle.RotateAroundXY
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [triangle,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to rotate.
 * @param {number} x - The X coordinate of the point to rotate the Triangle about.
 * @param {number} y - The Y coordinate of the point to rotate the Triangle about.
 * @param {number} angle - The angle by which to rotate the Triangle, in radians.
 *
 * @return {Phaser.Geom.Triangle} The rotated Triangle.
 */
declare function RotateAroundXY(triangle: Phaser.Geom.Triangle, x: number, y: number, angle: number): Phaser.Geom.Triangle;
