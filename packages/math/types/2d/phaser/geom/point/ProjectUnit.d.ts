export default ProjectUnit;
/**
 * Calculates the vector projection of `pointA` onto the nonzero `pointB`. This is the
 * orthogonal projection of `pointA` onto a straight line paralle to `pointB`.
 *
 * @function Phaser.Geom.Point.ProjectUnit
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Point} pointA - Point A, to be projected onto Point B. Must be a normalized point with a magnitude of 1.
 * @param {Phaser.Geom.Point} pointB - Point B, to have Point A projected upon it.
 * @param {Phaser.Geom.Point} [out] - The Point object to store the position in. If not given, a new Point instance is created.
 *
 * @return {Phaser.Geom.Point} A unit Point object holding the coordinates of the vector projection of `pointA` onto `pointB`.
 */
declare function ProjectUnit(pointA: Phaser.Geom.Point, pointB: Phaser.Geom.Point, out?: Phaser.Geom.Point): Phaser.Geom.Point;
