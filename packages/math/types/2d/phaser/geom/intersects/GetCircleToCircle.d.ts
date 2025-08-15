export default GetCircleToCircle;
/**
 * Checks if two Circles intersect and returns the intersection points as a Point object array.
 *
 * @function Phaser.Geom.Intersects.GetCircleToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circleA - The first Circle to check for intersection.
 * @param {Phaser.Geom.Circle} circleB - The second Circle to check for intersection.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
declare function GetCircleToCircle(circleA: Phaser.Geom.Circle, circleB: Phaser.Geom.Circle, out?: array): array;
