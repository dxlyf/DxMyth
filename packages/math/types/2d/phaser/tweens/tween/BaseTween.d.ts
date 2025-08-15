import { default as Class } from '../../utils/Class';
export default BaseTween;
/**
 * @classdesc
 * As the name implies, this is the base Tween class that both the Tween and TweenChain
 * inherit from. It contains shared properties and methods common to both types of Tween.
 *
 * Typically you would never instantiate this class directly, although you could certainly
 * use it to create your own variation of Tweens from.
 *
 * @class BaseTween
 * @memberof Phaser.Tweens
 * @extends Phaser.Events.EventEmitter
 * @constructor
 * @since 3.60.0
 *
 * @param {(Phaser.Tweens.TweenManager|Phaser.Tweens.TweenChain)} parent - A reference to the Tween Manager, or Tween Chain, that owns this Tween.
 */
declare var BaseTween: Class;
