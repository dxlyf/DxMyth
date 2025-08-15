import { default as Class } from '../../utils/Class';
export default TweenChain;
/**
 * @classdesc
 * A TweenChain is a special type of Tween that allows you to create a sequence of Tweens, chained to one-another,
 * and add them to the Tween Manager.
 *
 * The tweens are played in order, from start to finish. You can optionally set the chain
 * to repeat as many times as you like. Once the chain has finished playing, or repeating if set,
 * all tweens in the chain will be destroyed automatically. To override this, set the 'persist'
 * argument to 'true'.
 *
 * Playback will start immediately unless the _first_ Tween has been configured to be paused.
 *
 * Please note that Tweens will not manipulate any target property that begins with an underscore.
 *
 * @class TweenChain
 * @memberof Phaser.Tweens
 * @extends Phaser.Tweens.BaseTween
 * @constructor
 * @since 3.60.0
 *
 * @param {(Phaser.Tweens.TweenManager|Phaser.Tweens.TweenChain)} parent - A reference to the Tween Manager, or TweenChain, that owns this TweenChain.
 */
declare var TweenChain: Class;
