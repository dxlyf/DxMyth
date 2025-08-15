export default FitInside;
/**
 * Adjusts the target rectangle, changing its width, height and position,
 * so that it fits inside the area of the source rectangle, while maintaining its original
 * aspect ratio.
 *
 * Unlike the `FitOutside` function, there may be some space inside the source area not covered.
 *
 * @function Phaser.Geom.Rectangle.FitInside
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [target,$return]
 *
 * @param {Phaser.Geom.Rectangle} target - The target rectangle to adjust.
 * @param {Phaser.Geom.Rectangle} source - The source rectangle to envelop the target in.
 *
 * @return {Phaser.Geom.Rectangle} The modified target rectangle instance.
 */
declare function FitInside(target: Phaser.Geom.Rectangle, source: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle;
