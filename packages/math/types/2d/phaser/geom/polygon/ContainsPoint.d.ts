export default ContainsPoint;
/**
 * Checks the given Point again the Polygon to see if the Point lays within its vertices.
 *
 * @function Phaser.Geom.Polygon.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to check.
 * @param {Phaser.Geom.Point} point - The Point to check if it's within the Polygon.
 *
 * @return {boolean} `true` if the Point is within the Polygon, otherwise `false`.
 */
declare function ContainsPoint(polygon: Phaser.Geom.Polygon, point: Phaser.Geom.Point): boolean;
