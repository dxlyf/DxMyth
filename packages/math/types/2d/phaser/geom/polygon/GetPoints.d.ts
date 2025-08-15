export default GetPoints;
/**
 * Returns an array of Point objects containing the coordinates of the points around the perimeter of the Polygon,
 * based on the given quantity or stepRate values.
 *
 * @function Phaser.Geom.Polygon.GetPoints
 * @since 3.12.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to get the points from.
 * @param {number} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
 * @param {number} [stepRate] - Sets the quantity by getting the perimeter of the Polygon and dividing it by the stepRate.
 * @param {array} [output] - An array to insert the points in to. If not provided a new array will be created.
 *
 * @return {Phaser.Geom.Point[]} An array of Point objects pertaining to the points around the perimeter of the Polygon.
 */
declare function GetPoints(polygon: Phaser.Geom.Polygon, quantity: number, stepRate?: number, out: any): Phaser.Geom.Point[];
