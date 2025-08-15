export default Smooth;
/**
 * Takes a Polygon object and applies Chaikin's smoothing algorithm on its points.
 *
 * @function Phaser.Geom.Polygon.Smooth
 * @since 3.13.0
 *
 * @generic {Phaser.Geom.Polygon} O - [polygon,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The polygon to be smoothed. The polygon will be modified in-place and returned.
 *
 * @return {Phaser.Geom.Polygon} The input polygon.
 */
declare function Smooth(polygon: Phaser.Geom.Polygon): Phaser.Geom.Polygon;
