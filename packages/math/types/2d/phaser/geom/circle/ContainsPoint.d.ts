export default ContainsPoint;
/**
 * Check to see if the Circle contains the given Point object.
 *
 * @function Phaser.Geom.Circle.ContainsPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to check.
 * @param {(Phaser.Geom.Point|object)} point - The Point object to check if it's within the Circle or not.
 *
 * @return {boolean} True if the Point coordinates are within the circle, otherwise false.
 */
declare function ContainsPoint(circle: Phaser.Geom.Circle, point: (Phaser.Geom.Point | object)): boolean;
