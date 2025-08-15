export default RotateAroundPoint;
/**
 * Rotate a line around a point by the given angle in radians.
 *
 * @function Phaser.Geom.Line.RotateAroundPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Line} O - [line,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to rotate.
 * @param {(Phaser.Geom.Point|object)} point - The point to rotate the line around.
 * @param {number} angle - The angle of rotation in radians.
 *
 * @return {Phaser.Geom.Line} The rotated line.
 */
declare function RotateAroundPoint(line: Phaser.Geom.Line, point: (Phaser.Geom.Point | object), angle: number): Phaser.Geom.Line;
