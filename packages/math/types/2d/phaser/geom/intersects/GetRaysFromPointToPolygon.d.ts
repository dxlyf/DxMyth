export default GetRaysFromPointToPolygon;
/**
 * Projects rays out from the given point to each line segment of the polygons.
 *
 * If the rays intersect with the polygons, the points of intersection are returned in an array.
 *
 * If no intersections are found, the returned array will be empty.
 *
 * Each Vector4 intersection result has the following properties:
 *
 * The `x` and `y` components contain the point of the intersection.
 * The `z` component contains the angle of intersection.
 * The `w` component contains the index of the polygon, in the given array, that triggered the intersection.
 *
 * @function Phaser.Geom.Intersects.GetRaysFromPointToPolygon
 * @since 3.50.0
 *
 * @param {number} x - The x coordinate to project the rays from.
 * @param {number} y - The y coordinate to project the rays from.
 * @param {Phaser.Geom.Polygon | Phaser.Geom.Polygon[]} polygons - A single polygon, or array of polygons, to check against the rays.
 *
 * @return {Phaser.Math.Vector4[]} An array containing all intersections in Vector4s.
 */
declare function GetRaysFromPointToPolygon(x: number, y: number, polygons: Phaser.Geom.Polygon | Phaser.Geom.Polygon[]): Phaser.Math.Vector4[];
