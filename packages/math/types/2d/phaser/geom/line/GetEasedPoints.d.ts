export default GetEasedPoints;
/**
 * Returns an array of `quantity` Points where each point is taken from the given Line,
 * spaced out according to the ease function specified.
 *
 * ```javascript
 * const line = new Phaser.Geom.Line(100, 300, 700, 300);
 * const points = Phaser.Geom.Line.GetEasedPoints(line, 'sine.out', 32)
 * ```
 *
 * In the above example, the `points` array will contain 32 points spread-out across
 * the length of `line`, where the position of each point is determined by the `Sine.out`
 * ease function.
 *
 * You can optionally provide a collinear threshold. In this case, the resulting points
 * are checked against each other, and if they are `< collinearThreshold` distance apart,
 * they are dropped from the results. This can help avoid lots of clustered points at
 * far ends of the line with tightly-packed eases such as Quartic. Leave the value set
 * to zero to skip this check.
 *
 * Note that if you provide a collinear threshold, the resulting array may not always
 * contain `quantity` points.
 *
 * @function Phaser.Geom.Line.GetEasedPoints
 * @since 3.23.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The Line object.
 * @param {(string|function)} ease - The ease to use. This can be either a string from the EaseMap, or a custom function.
 * @param {number} quantity - The number of points to return. Note that if you provide a `collinearThreshold`, the resulting array may not always contain this number of points.
 * @param {number} [collinearThreshold=0] - An optional threshold. The final array is reduced so that each point is spaced out at least this distance apart. This helps reduce clustering in noisey eases.
 * @param {number[]} [easeParams] - An optional array of ease parameters to go with the ease.
 *
 * @return {Phaser.Geom.Point[]} An array of Geom.Points containing the coordinates of the points on the line.
 */
declare function GetEasedPoints(line: Phaser.Geom.Line, ease: (string | Function), quantity: number, collinearThreshold?: number, easeParams?: number[]): Phaser.Geom.Point[];
