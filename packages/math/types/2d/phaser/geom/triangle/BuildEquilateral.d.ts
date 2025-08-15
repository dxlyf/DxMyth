export default BuildEquilateral;
/**
 * Builds an equilateral triangle. In the equilateral triangle, all the sides are the same length (congruent) and all the angles are the same size (congruent).
 * The x/y specifies the top-middle of the triangle (x1/y1) and length is the length of each side.
 *
 * @function Phaser.Geom.Triangle.BuildEquilateral
 * @since 3.0.0
 *
 * @param {number} x - x coordinate of the top point of the triangle.
 * @param {number} y - y coordinate of the top point of the triangle.
 * @param {number} length - Length of each side of the triangle.
 *
 * @return {Phaser.Geom.Triangle} The Triangle object of the given size.
 */
declare function BuildEquilateral(x: number, y: number, length: number): Phaser.Geom.Triangle;
