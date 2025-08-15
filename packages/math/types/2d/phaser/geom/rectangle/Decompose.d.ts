export default Decompose;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Create an array of points for each corner of a Rectangle
 * If an array is specified, each point object will be added to the end of the array, otherwise a new array will be created.
 *
 * @function Phaser.Geom.Rectangle.Decompose
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle object to be decomposed.
 * @param {array} [out] - If provided, each point will be added to this array.
 *
 * @return {array} Will return the array you specified or a new array containing the points of the Rectangle.
 */
declare function Decompose(rect: Phaser.Geom.Rectangle, out?: array): array;
