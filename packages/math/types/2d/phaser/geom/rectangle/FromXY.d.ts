export default FromXY;
/**
 * Create the smallest Rectangle containing two coordinate pairs.
 *
 * @function Phaser.Geom.Rectangle.FromXY
 * @since 3.23.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {number} x1 - The X coordinate of the first point.
 * @param {number} y1 - The Y coordinate of the first point.
 * @param {number} x2 - The X coordinate of the second point.
 * @param {number} y2 - The Y coordinate of the second point.
 * @param {Phaser.Geom.Rectangle} [out] - Optional Rectangle to adjust.
 *
 * @return {Phaser.Geom.Rectangle} The adjusted `out` Rectangle, or a new Rectangle if none was provided.
 */
declare function FromXY(x1: number, y1: number, x2: number, y2: number, out?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle;
