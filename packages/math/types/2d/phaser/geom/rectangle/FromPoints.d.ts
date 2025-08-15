export default FromPoints;
/**
 * Constructs new Rectangle or repositions and resizes an existing Rectangle so that all of the given points are on or within its bounds.
 *
 * The `points` parameter is an array of Point-like objects:
 *
 * ```js
 * const points = [
 *     [100, 200],
 *     [200, 400],
 *     { x: 30, y: 60 }
 * ]
 * ```
 *
 * @function Phaser.Geom.Rectangle.FromPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {array} points - An array of points (either arrays with two elements corresponding to the X and Y coordinate or an object with public `x` and `y` properties) which should be surrounded by the Rectangle.
 * @param {Phaser.Geom.Rectangle} [out] - Optional Rectangle to adjust.
 *
 * @return {Phaser.Geom.Rectangle} The adjusted `out` Rectangle, or a new Rectangle if none was provided.
 */
declare function FromPoints(points: array, out?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle;
