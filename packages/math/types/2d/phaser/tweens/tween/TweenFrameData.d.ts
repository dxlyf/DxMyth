import { default as Class } from '../../utils/Class';
export default TweenFrameData;
/**
 * @classdesc
 * The TweenFrameData is a class that contains a single target that will change the texture frame
 * at the conclusion of the Tween.
 *
 * TweenFrameData instances are typically created by the TweenBuilder automatically, when it
 * detects the presence of a 'texture' property as the key being tweened.
 *
 * A Tween can own multiple TweenFrameData instances, but a TweenFrameData only
 * ever belongs to a single Tween.
 *
 * You should not typically create these yourself, but rather use the TweenBuilder,
 * or the `Tween.addFrame` method.
 *
 * @class TweenFrameData
 * @memberof Phaser.Tweens
 * @extends Phaser.Tweens.BaseTweenData
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.Tween} tween - The tween this TweenData instance belongs to.
 * @param {number} targetIndex - The target index within the Tween targets array.
 * @param {string} texture - The texture key to set at the end of this tween.
 * @param {(string|number)} frame - The texture frame to set at the end of this tween.
 * @param {function} delay - Function that returns the time in milliseconds before tween will start.
 * @param {number} duration - The duration of the tween in milliseconds.
 * @param {number} hold - Function that returns the time in milliseconds the tween will pause before repeating or returning to its starting value if yoyo is set to true.
 * @param {number} repeat - Function that returns the number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @param {number} repeatDelay - Function that returns the time in milliseconds before the repeat will start.
 * @param {boolean} flipX - Should toggleFlipX be called when yoyo or repeat happens?
 * @param {boolean} flipY - Should toggleFlipY be called when yoyo or repeat happens?
 */
declare var TweenFrameData: Class;
