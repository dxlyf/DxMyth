export default Offset;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Moves each point (vertex) of a Triangle by a given offset, thus moving the entire Triangle by that offset.
 *
 * @function Phaser.Geom.Triangle.Offset
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [triangle,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to move.
 * @param {number} x - The horizontal offset (distance) by which to move each point. Can be positive or negative.
 * @param {number} y - The vertical offset (distance) by which to move each point. Can be positive or negative.
 *
 * @return {Phaser.Geom.Triangle} The modified Triangle.
 */
declare function Offset(triangle: Phaser.Geom.Triangle, x: number, y: number): Phaser.Geom.Triangle;
