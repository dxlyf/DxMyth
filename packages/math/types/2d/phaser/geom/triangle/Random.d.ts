export default Random;
/**
 * Returns a random Point from within the area of the given Triangle.
 *
 * @function Phaser.Geom.Triangle.Random
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to get a random point from.
 * @param {Phaser.Geom.Point} [out] - The Point object to store the position in. If not given, a new Point instance is created.
 *
 * @return {Phaser.Geom.Point} A Point object holding the coordinates of a random position within the Triangle.
 */
declare function Random(triangle: Phaser.Geom.Triangle, out?: Phaser.Geom.Point): Phaser.Geom.Point;
