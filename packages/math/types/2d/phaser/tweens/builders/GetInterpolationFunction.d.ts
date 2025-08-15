export default GetInterpolationFunction;
/**
 * This internal function is used to return the correct interpolation function for a Tween.
 *
 * It can take a variety of input, including a string, or a custom function.
 *
 * @function Phaser.Tweens.Builders.GetInterpolationFunction
 * @since 3.60.0
 *
 * @param {(string|function|null)} interpolation - The interpolation function to find. This can be either a string, or a custom function, or null.
 *
 * @return {?function} The interpolation function to use, or `null`.
 */
declare function GetInterpolationFunction(interpolation: (string | Function | null)): Function | null;
