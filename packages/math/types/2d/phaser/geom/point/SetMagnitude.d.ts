export default SetMagnitude;
/**
 * Changes the magnitude (length) of a two-dimensional vector without changing its direction.
 *
 * @function Phaser.Geom.Point.SetMagnitude
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [point,$return]
 *
 * @param {Phaser.Geom.Point} point - The Point to treat as the end point of the vector.
 * @param {number} magnitude - The new magnitude of the vector.
 *
 * @return {Phaser.Geom.Point} The modified Point.
 */
declare function SetMagnitude(point: Phaser.Geom.Point, magnitude: number): Phaser.Geom.Point;
