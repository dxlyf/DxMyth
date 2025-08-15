import { default as Class } from '../utils/Class';
export default TweenManager;
/**
 * @classdesc
 * The Tween Manager is a default Scene Plugin which controls and updates Tweens.
 *
 * A tween is a way to alter one or more properties of a target object over a defined period of time.
 *
 * Tweens are created by calling the `add` method and passing in the configuration object.
 *
 * ```js
 * const logo = this.add.image(100, 100, 'logo');
 *
 * this.tweens.add({
 *   targets: logo,
 *   x: 600,
 *   ease: 'Power1',
 *   duration: 2000
 * });
 * ```
 *
 * See the `TweenBuilderConfig` for all of the options you have available.
 *
 * Playback will start immediately unless the tween has been configured to be paused.
 *
 * Please note that a Tween will not manipulate any target property that begins with an underscore.
 *
 * Tweens are designed to be 'fire-and-forget'. They automatically destroy themselves once playback
 * is complete, to free-up memory and resources. If you wish to keep a tween after playback, i.e. to
 * play it again at a later time, then you should set the `persist` property to `true` in the config.
 * However, doing so means it's entirely up to _you_ to destroy the tween when you're finished with it,
 * otherwise it will linger in memory forever.
 *
 * If you wish to chain Tweens together for sequential playback, see the `TweenManager.chain` method.
 *
 * @class TweenManager
 * @memberof Phaser.Tweens
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene which owns this Tween Manager.
 */
declare var TweenManager: Class;
