export default GetTargets;
/**
 * Extracts an array of targets from a Tween configuration object.
 *
 * The targets will be looked for in a `targets` property. If it's a function, its return value will be used as the result.
 *
 * @function Phaser.Tweens.Builders.GetTargets
 * @since 3.0.0
 *
 * @param {object} config - The configuration object to use.
 *
 * @return {array} An array of targets (may contain only one element), or `null` if no targets were specified.
 */
declare function GetTargets(config: object): array;
