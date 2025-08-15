export default StaggerBuilder;
/**
 * Creates a Stagger function to be used by a Tween property.
 *
 * The stagger function will allow you to stagger changes to the value of the property across all targets of the tween.
 *
 * This is only worth using if the tween has multiple targets.
 *
 * The following will stagger the delay by 100ms across all targets of the tween, causing them to scale down to 0.2
 * over the duration specified:
 *
 * ```javascript
 * this.tweens.add({
 *     targets: [ ... ],
 *     scale: 0.2,
 *     ease: 'linear',
 *     duration: 1000,
 *     delay: this.tweens.stagger(100)
 * });
 * ```
 *
 * The following will stagger the delay by 500ms across all targets of the tween using a 10 x 6 grid, staggering
 * from the center out, using a cubic ease.
 *
 * ```javascript
 * this.tweens.add({
 *     targets: [ ... ],
 *     scale: 0.2,
 *     ease: 'linear',
 *     duration: 1000,
 *     delay: this.tweens.stagger(500, { grid: [ 10, 6 ], from: 'center', ease: 'cubic.out' })
 * });
 * ```
 *
 * @function Phaser.Tweens.Builders.StaggerBuilder
 * @since 3.19.0
 *
 * @param {(number|number[])} value - The amount to stagger by, or an array containing two elements representing the min and max values to stagger between.
 * @param {Phaser.Types.Tweens.StaggerConfig} [config] - A Stagger Configuration object.
 *
 * @return {function} The stagger function.
 */
declare function StaggerBuilder(value: (number | number[]), options: any): Function;
