export default Rotate;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Rotate a given point by a given angle around the origin (0, 0), in an anti-clockwise direction.
 *
 * @function Phaser.Math.Rotate
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Point|object)} point - The point to be rotated.
 * @param {number} angle - The angle to be rotated by in an anticlockwise direction.
 *
 * @return {Phaser.Geom.Point} The given point, rotated by the given angle in an anticlockwise direction.
 */
declare function Rotate(point: (Phaser.Geom.Point | object), angle: number): Phaser.Geom.Point;
