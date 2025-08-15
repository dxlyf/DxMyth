export default GetMidPoint;
/**
 * Get the midpoint of the given line.
 *
 * @function Phaser.Geom.Line.GetMidPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to get the midpoint of.
 * @param {(Phaser.Geom.Point|object)} [out] - An optional point object to store the midpoint in.
 *
 * @return {(Phaser.Geom.Point|object)} The midpoint of the Line.
 */
declare function GetMidPoint(line: Phaser.Geom.Line, out?: (Phaser.Geom.Point | object)): (Phaser.Geom.Point | object);
