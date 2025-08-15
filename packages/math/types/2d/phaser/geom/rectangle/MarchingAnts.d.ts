export default MarchingAnts;
/**
 * Returns an array of points from the perimeter of the Rectangle, where each point is spaced out based
 * on either the `step` value, or the `quantity`.
 *
 * @function Phaser.Geom.Rectangle.MarchingAnts
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to get the perimeter points from.
 * @param {number} [step] - The distance between each point of the perimeter. Set to `null` if you wish to use the `quantity` parameter instead.
 * @param {number} [quantity] - The total number of points to return. The step is then calculated based on the length of the Rectangle, divided by this value.
 * @param {(array|Phaser.Geom.Point[])} [out] - An array in which the perimeter points will be stored. If not given, a new array instance is created.
 *
 * @return {(array|Phaser.Geom.Point[])} An array containing the perimeter points from the Rectangle.
 */
declare function MarchingAnts(rect: Phaser.Geom.Rectangle, step?: number, quantity?: number, out?: (array | Phaser.Geom.Point[])): (array | Phaser.Geom.Point[]);
