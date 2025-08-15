export default GetPoint;
/**
 * Get a point on a line that's a given percentage along its length.
 *
 * @function Phaser.Geom.Line.GetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {number} position - A value between 0 and 1, where 0 is the start, 0.5 is the middle and 1 is the end of the line.
 * @param {(Phaser.Geom.Point|object)} [out] - An optional point, or point-like object, to store the coordinates of the point on the line.
 *
 * @return {(Phaser.Geom.Point|object)} The point on the line.
 */
declare function GetPoint(line: Phaser.Geom.Line, position: number, out?: (Phaser.Geom.Point | object)): (Phaser.Geom.Point | object);
