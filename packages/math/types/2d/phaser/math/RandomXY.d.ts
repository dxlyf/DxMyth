export default RandomXY;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Compute a random unit vector.
 *
 * Computes random values for the given vector between -1 and 1 that can be used to represent a direction.
 *
 * Optionally accepts a scale value to scale the resulting vector by.
 *
 * @function Phaser.Math.RandomXY
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2} vector - The Vector to compute random values for.
 * @param {number} [scale=1] - The scale of the random values.
 *
 * @return {Phaser.Math.Vector2} The given Vector.
 */
declare function RandomXY(vector: Phaser.Math.Vector2, scale?: number): Phaser.Math.Vector2;
