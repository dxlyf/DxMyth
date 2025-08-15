export default RotateAroundDistance;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Rotate a `point` around `x` and `y` by the given `angle` and `distance`.
 *
 * In polar notation, this maps a point from (r, t) to (distance, t + angle), vs. the origin (x, y).
 *
 * @function Phaser.Math.RotateAroundDistance
 * @since 3.0.0
 *
 * @generic {Phaser.Types.Math.Vector2Like} T - [point,$return]
 *
 * @param {(Phaser.Geom.Point|object)} point - The point to be rotated.
 * @param {number} x - The horizontal coordinate to rotate around.
 * @param {number} y - The vertical coordinate to rotate around.
 * @param {number} angle - The angle of rotation in radians.
 * @param {number} distance - The distance from (x, y) to place the point at.
 *
 * @return {Phaser.Types.Math.Vector2Like} The given point.
 */
declare function RotateAroundDistance(point: (Phaser.Geom.Point | object), x: number, y: number, angle: number, distance: number): Phaser.Types.Math.Vector2Like;
