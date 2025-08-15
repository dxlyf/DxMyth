export default GetCentroid;
/**
 * Get the centroid or geometric center of a plane figure (the arithmetic mean position of all the points in the figure).
 * Informally, it is the point at which a cutout of the shape could be perfectly balanced on the tip of a pin.
 *
 * @function Phaser.Geom.Point.GetCentroid
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Types.Math.Vector2Like[]} points - An array of Vector2Like objects to get the geometric center of.
 * @param {Phaser.Geom.Point} [out] - A Point object to store the output coordinates in. If not given, a new Point instance is created.
 *
 * @return {Phaser.Geom.Point} A Point object representing the geometric center of the given points.
 */
declare function GetCentroid(points: Phaser.Types.Math.Vector2Like[], out?: Phaser.Geom.Point): Phaser.Geom.Point;
