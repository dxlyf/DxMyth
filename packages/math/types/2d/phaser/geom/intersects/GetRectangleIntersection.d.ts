export default GetRectangleIntersection;
/**
 * Checks if two Rectangle shapes intersect and returns the area of this intersection as Rectangle object.
 *
 * If optional `output` parameter is omitted, new Rectangle object is created and returned. If there is intersection, it will contain intersection area. If there is no intersection, it wil be empty Rectangle (all values set to zero).
 *
 * If Rectangle object is passed as `output` and there is intersection, then intersection area data will be loaded into it and it will be returned. If there is no intersection, it will be returned without any change.
 *
 * @function Phaser.Geom.Intersects.GetRectangleIntersection
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [output,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectA - The first Rectangle object.
 * @param {Phaser.Geom.Rectangle} rectB - The second Rectangle object.
 * @param {Phaser.Geom.Rectangle} [output] - Optional Rectangle object. If given, the intersection data will be loaded into it (in case of no intersection, it will be left unchanged). Otherwise, new Rectangle object will be created and returned with either intersection data or empty (all values set to zero), if there is no intersection.
 *
 * @return {Phaser.Geom.Rectangle} A rectangle object with intersection data.
 */
declare function GetRectangleIntersection(rectA: Phaser.Geom.Rectangle, rectB: Phaser.Geom.Rectangle, output?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle;
