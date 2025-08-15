export default TweenBuilder;
/**
 * Creates a new Tween.
 *
 * @function Phaser.Tweens.Builders.TweenBuilder
 * @since 3.0.0
 *
 * @param {Phaser.Tweens.TweenManager} parent - The owner of the new Tween.
 * @param {Phaser.Types.Tweens.TweenBuilderConfig|object} config - Configuration for the new Tween.
 * @param {Phaser.Types.Tweens.TweenConfigDefaults} defaults - Tween configuration defaults.
 *
 * @return {Phaser.Tweens.Tween} The new tween.
 */
declare function TweenBuilder(parent: Phaser.Tweens.TweenManager, config: Phaser.Types.Tweens.TweenBuilderConfig | object, defaults: Phaser.Types.Tweens.TweenConfigDefaults): Phaser.Tweens.Tween;
