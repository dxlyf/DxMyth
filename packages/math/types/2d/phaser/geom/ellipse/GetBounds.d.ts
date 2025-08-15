export default GetBounds;
/**
 * Returns the bounds of the Ellipse object.
 *
 * @function Phaser.Geom.Ellipse.GetBounds
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the bounds from.
 * @param {(Phaser.Geom.Rectangle|object)} [out] - A Rectangle, or rectangle-like object, to store the ellipse bounds in. If not given a new Rectangle will be created.
 *
 * @return {(Phaser.Geom.Rectangle|object)} The Rectangle object containing the Ellipse bounds.
 */
declare function GetBounds(ellipse: Phaser.Geom.Ellipse, out?: (Phaser.Geom.Rectangle | object)): (Phaser.Geom.Rectangle | object);
