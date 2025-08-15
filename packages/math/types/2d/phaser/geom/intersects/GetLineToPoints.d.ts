export default GetLineToPoints;
/**
 * Checks for the closest point of intersection between a line segment and an array of points, where each pair
 * of points are converted to line segments for the intersection tests.
 *
 * If no intersection is found, this function returns `null`.
 *
 * If intersection was found, a Vector3 is returned with the following properties:
 *
 * The `x` and `y` components contain the point of the intersection.
 * The `z` component contains the closest distance.
 *
 * @function Phaser.Geom.Intersects.GetLineToPoints
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Line} line - The line segment, or ray, to check. If a ray, set the `isRay` parameter to `true`.
 * @param {Phaser.Math.Vector2[] | Phaser.Geom.Point[]} points - An array of points to check.
 * @param {boolean} [isRay=false] - Is `line` a ray or a line segment?
 * @param {Phaser.Math.Vector3} [out] - A Vector3 to store the intersection results in.
 *
 * @return {Phaser.Math.Vector3} A Vector3 containing the intersection results, or `null`.
 */
declare function GetLineToPoints(line: Phaser.Geom.Line, points: Phaser.Math.Vector2[] | Phaser.Geom.Point[], isRay?: boolean, out?: Phaser.Math.Vector3): Phaser.Math.Vector3;
