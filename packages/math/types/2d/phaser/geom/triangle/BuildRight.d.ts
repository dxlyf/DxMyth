export default BuildRight;
/**
 * Builds a right triangle, i.e. one which has a 90-degree angle and two acute angles.
 *
 * @function Phaser.Geom.Triangle.BuildRight
 * @since 3.0.0
 *
 * @param {number} x - The X coordinate of the right angle, which will also be the first X coordinate of the constructed Triangle.
 * @param {number} y - The Y coordinate of the right angle, which will also be the first Y coordinate of the constructed Triangle.
 * @param {number} width - The length of the side which is to the left or to the right of the right angle.
 * @param {number} height - The length of the side which is above or below the right angle.
 *
 * @return {Phaser.Geom.Triangle} The constructed right Triangle.
 */
declare function BuildRight(x: number, y: number, width: number, height: number): Phaser.Geom.Triangle;
