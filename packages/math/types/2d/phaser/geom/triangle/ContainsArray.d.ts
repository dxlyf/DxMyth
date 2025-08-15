export default ContainsArray;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Filters an array of point-like objects to only those contained within a triangle.
 * If `returnFirst` is true, will return an array containing only the first point in the provided array that is within the triangle (or an empty array if there are no such points).
 *
 * @function Phaser.Geom.Triangle.ContainsArray
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The triangle that the points are being checked in.
 * @param {Phaser.Geom.Point[]} points - An array of point-like objects (objects that have an `x` and `y` property)
 * @param {boolean} [returnFirst=false] - If `true`, return an array containing only the first point found that is within the triangle.
 * @param {array} [out] - If provided, the points that are within the triangle will be appended to this array instead of being added to a new array. If `returnFirst` is true, only the first point found within the triangle will be appended. This array will also be returned by this function.
 *
 * @return {Phaser.Geom.Point[]} An array containing all the points from `points` that are within the triangle, if an array was provided as `out`, points will be appended to that array and it will also be returned here.
 */
declare function ContainsArray(triangle: Phaser.Geom.Triangle, points: Phaser.Geom.Point[], returnFirst?: boolean, out?: array): Phaser.Geom.Point[];
