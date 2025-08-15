export default InCenter;
/**
 * Calculates the position of the incenter of a Triangle object. This is the point where its three angle bisectors meet and it's also the center of the incircle, which is the circle inscribed in the triangle.
 *
 * @function Phaser.Geom.Triangle.InCenter
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to find the incenter of.
 * @param {Phaser.Geom.Point} [out] - An optional Point in which to store the coordinates.
 *
 * @return {Phaser.Geom.Point} Point (x, y) of the center pixel of the triangle.
 */
declare function InCenter(triangle: Phaser.Geom.Triangle, out?: Phaser.Geom.Point): Phaser.Geom.Point;
