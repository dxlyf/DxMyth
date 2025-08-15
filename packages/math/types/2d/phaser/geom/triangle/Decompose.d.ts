export default Decompose;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Decomposes a Triangle into an array of its points.
 *
 * @function Phaser.Geom.Triangle.Decompose
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to decompose.
 * @param {array} [out] - An array to store the points into.
 *
 * @return {array} The provided `out` array, or a new array if none was provided, with three objects with `x` and `y` properties representing each point of the Triangle appended to it.
 */
declare function Decompose(triangle: Phaser.Geom.Triangle, out?: array): array;
