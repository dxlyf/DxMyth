import { default as Class } from '../../utils/Class';
export default TweenData;
/**
 * @classdesc
 * The TweenData is a class that contains a single target and property that is being tweened.
 *
 * Tweens create TweenData instances when they are created, with one TweenData instance per
 * target, per property. A Tween can own multiple TweenData instances, but a TweenData only
 * ever belongs to a single Tween.
 *
 * You should not typically create these yourself, but rather use the TweenBuilder,
 * or the `Tween.add` method.
 *
 * Prior to Phaser 3.60 the TweenData was just an object, but was refactored to a class,
 * to make it responsible for its own state and updating.
 *
 * @class TweenData
 * @memberof Phaser.Tweens
 * @extends Phaser.Tweens.BaseTweenData
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Tweens.Tween} tween - The tween this TweenData instance belongs to.
 * @param {number} targetIndex - The target index within the Tween targets array.
 * @param {string} key - The property of the target to tween.
 * @param {Phaser.Types.Tweens.GetEndCallback} getEnd - What the property will be at the END of the Tween.
 * @param {Phaser.Types.Tweens.GetStartCallback} getStart - What the property will be at the START of the Tween.
 * @param {?Phaser.Types.Tweens.GetActiveCallback} getActive - If not null, is invoked _immediately_ as soon as the TweenData is running, and is set on the target property.
 * @param {function} ease - The ease function this tween uses.
 * @param {function} delay - Function that returns the time in milliseconds before tween will start.
 * @param {number} duration - The duration of the tween in milliseconds.
 * @param {boolean} yoyo - Determines whether the tween should return back to its start value after hold has expired.
 * @param {number} hold - Function that returns the time in milliseconds the tween will pause before repeating or returning to its starting value if yoyo is set to true.
 * @param {number} repeat - Function that returns the number of times to repeat the tween. The tween will always run once regardless, so a repeat value of '1' will play the tween twice.
 * @param {number} repeatDelay - Function that returns the time in milliseconds before the repeat will start.
 * @param {boolean} flipX - Should toggleFlipX be called when yoyo or repeat happens?
 * @param {boolean} flipY - Should toggleFlipY be called when yoyo or repeat happens?
 * @param {?function} interpolation - The interpolation function to be used for arrays of data. Defaults to 'null'.
 * @param {?number[]} interpolationData - The array of interpolation data to be set. Defaults to 'null'.
 */
declare var TweenData: Class;
