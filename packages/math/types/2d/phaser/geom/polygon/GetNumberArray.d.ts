export default GetNumberArray;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Stores all of the points of a Polygon into a flat array of numbers following the sequence [ x,y, x,y, x,y ],
 * i.e. each point of the Polygon, in the order it's defined, corresponds to two elements of the resultant
 * array for the point's X and Y coordinate.
 *
 * @function Phaser.Geom.Polygon.GetNumberArray
 * @since 3.0.0
 *
 * @generic {number[]} O - [output,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon whose points to export.
 * @param {(array|number[])} [output] - An array to which the points' coordinates should be appended.
 *
 * @return {(array|number[])} The modified `output` array, or a new array if none was given.
 */
declare function GetNumberArray(polygon: Phaser.Geom.Polygon, output?: (array | number[])): (array | number[]);
