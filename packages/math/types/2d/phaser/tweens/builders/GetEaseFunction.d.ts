export default GetEaseFunction;
/**
 * This internal function is used to return the correct ease function for a Tween.
 *
 * It can take a variety of input, including an EaseMap based string, or a custom function.
 *
 * @function Phaser.Tweens.Builders.GetEaseFunction
 * @since 3.0.0
 *
 * @param {(string|function)} ease - The ease to find. This can be either a string from the EaseMap, or a custom function.
 * @param {number[]} [easeParams] - An optional array of ease parameters to go with the ease.
 *
 * @return {function} The ease function.
 */
declare function GetEaseFunction(ease: (string | Function), easeParams?: number[]): Function;
