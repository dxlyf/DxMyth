export default GetAABB;
/**
 * Calculates the bounding AABB rectangle of a polygon.
 *
 * @function Phaser.Geom.Polygon.GetAABB
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The polygon that should be calculated.
 * @param {(Phaser.Geom.Rectangle|object)} [out] - The rectangle or object that has x, y, width, and height properties to store the result. Optional.
 *
 * @return {(Phaser.Geom.Rectangle|object)} The resulting rectangle or object that is passed in with position and dimensions of the polygon's AABB.
 */
declare function GetAABB(polygon: Phaser.Geom.Polygon, out?: (Phaser.Geom.Rectangle | object)): (Phaser.Geom.Rectangle | object);
