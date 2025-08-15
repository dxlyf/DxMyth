export default GetRectangleFromPoints;
/**
 * Calculates the Axis Aligned Bounding Box (or aabb) from an array of points.
 *
 * @function Phaser.Geom.Point.GetRectangleFromPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Types.Math.Vector2Like[]} points - An array of Vector2Like objects to get the AABB from.
 * @param {Phaser.Geom.Rectangle} [out] - A Rectangle object to store the results in. If not given, a new Rectangle instance is created.
 *
 * @return {Phaser.Geom.Rectangle} A Rectangle object holding the AABB values for the given points.
 */
declare function GetRectangleFromPoints(points: Phaser.Types.Math.Vector2Like[], out?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle;
