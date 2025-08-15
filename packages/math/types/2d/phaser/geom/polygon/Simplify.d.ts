export default Simplify;
/**
 * Takes a Polygon object and simplifies the points by running them through a combination of
 * Douglas-Peucker and Radial Distance algorithms. Simplification dramatically reduces the number of
 * points in a polygon while retaining its shape, giving a huge performance boost when processing
 * it and also reducing visual noise.
 *
 * @function Phaser.Geom.Polygon.Simplify
 * @since 3.50.0
 *
 * @generic {Phaser.Geom.Polygon} O - [polygon,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The polygon to be simplified. The polygon will be modified in-place and returned.
 * @param {number} [tolerance=1] - Affects the amount of simplification (in the same metric as the point coordinates).
 * @param {boolean} [highestQuality=false] - Excludes distance-based preprocessing step which leads to highest quality simplification but runs ~10-20 times slower.
 *
 * @return {Phaser.Geom.Polygon} The input polygon.
 */
declare function Simplify(polygon: Phaser.Geom.Polygon, tolerance?: number, highestQuality?: boolean): Phaser.Geom.Polygon;
