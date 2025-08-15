export default Rotate;
/**
 * Rotates a Triangle about its incenter, which is the point at which its three angle bisectors meet.
 *
 * @function Phaser.Geom.Triangle.Rotate
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Triangle} O - [triangle,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to rotate.
 * @param {number} angle - The angle by which to rotate the Triangle, in radians.
 *
 * @return {Phaser.Geom.Triangle} The rotated Triangle.
 */
declare function Rotate(triangle: Phaser.Geom.Triangle, angle: number): Phaser.Geom.Triangle;
