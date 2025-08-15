export default GetProps;
/**
 * Internal function used by the Tween Builder to return an array of properties
 * that the Tween will be operating on. It takes a tween configuration object
 * and then checks that none of the `props` entries start with an underscore, or that
 * none of the direct properties are on the Reserved list.
 *
 * @function Phaser.Tweens.Builders.GetProps
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tweens.TweenBuilderConfig} config - The configuration object of the Tween to get the properties from.
 *
 * @return {string[]} An array of all the properties the tween will operate on.
 */
declare function GetProps(config: Phaser.Types.Tweens.TweenBuilderConfig): string[];
