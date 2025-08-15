export default Centroid;
/**
 * Calculates the position of a Triangle's centroid, which is also its center of mass (center of gravity).
 *
 * The centroid is the point in a Triangle at which its three medians (the lines drawn from the vertices to the bisectors of the opposite sides) meet. It divides each one in a 2:1 ratio.
 *
 * @function Phaser.Geom.Triangle.Centroid
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to use.
 * @param {(Phaser.Geom.Point|object)} [out] - An object to store the coordinates in.
 *
 * @return {(Phaser.Geom.Point|object)} The `out` object with modified `x` and `y` properties, or a new Point if none was provided.
 */
declare function Centroid(triangle: Phaser.Geom.Triangle, out?: (Phaser.Geom.Point | object)): (Phaser.Geom.Point | object);
