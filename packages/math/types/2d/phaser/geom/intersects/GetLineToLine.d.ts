export default GetLineToLine;
/**
 * Checks for intersection between the two line segments, or a ray and a line segment,
 * and returns the intersection point as a Vector3, or `null` if the lines are parallel, or do not intersect.
 *
 * The `z` property of the Vector3 contains the intersection distance, which can be used to find
 * the closest intersecting point from a group of line segments.
 *
 * @function Phaser.Geom.Intersects.GetLineToLine
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Line} line1 - The first line segment, or a ray, to check.
 * @param {Phaser.Geom.Line} line2 - The second line segment to check.
 * @param {boolean} [isRay=false] - Is `line1` a ray or a line segment?
 * @param {Phaser.Math.Vector3} [out] - A Vector3 to store the intersection results in.
 *
 * @return {Phaser.Math.Vector3} A Vector3 containing the intersection results, or `null`.
 */
declare function GetLineToLine(line1: Phaser.Geom.Line, line2: Phaser.Geom.Line, isRay?: boolean, out?: Phaser.Math.Vector3): Phaser.Math.Vector3;
