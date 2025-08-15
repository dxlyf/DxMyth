export default GetValueOp;
/**
 * Returns `getActive`, `getStart` and `getEnd` functions for a TweenData based on a target property and end value.
 *
 * `getActive` if not null, is invoked _immediately_ as soon as the TweenData is running, and is set on the target property.
 * `getEnd` is invoked once any start delays have expired and returns what the value should tween to.
 * `getStart` is invoked when the tween reaches the end and needs to either repeat or yoyo, it returns the value to go back to.
 *
 * If the end value is a number, it will be treated as an absolute value and the property will be tweened to it.
 * A string can be provided to specify a relative end value which consists of an operation
 * (`+=` to add to the current value, `-=` to subtract from the current value, `*=` to multiply the current
 * value, or `/=` to divide the current value) followed by its operand.
 *
 * A function can be provided to allow greater control over the end value; it will receive the target
 * object being tweened, the name of the property being tweened, and the current value of the property
 * as its arguments and must return a value.
 *
 * If both the starting and the ending values need to be controlled, an object with `getStart` and `getEnd`
 * callbacks, which will receive the same arguments, can be provided instead. If an object with a `value`
 * property is provided, the property will be used as the effective value under the same rules described here.
 *
 * @function Phaser.Tweens.Builders.GetValueOp
 * @since 3.0.0
 *
 * @param {string} key - The name of the property to modify.
 * @param {*} propertyValue - The ending value of the property, as described above.
 *
 * @return {function} An array of functions, `getActive`, `getStart` and `getEnd`, which return the starting and the ending value of the property based on the provided value.
 */
declare function GetValueOp(key: string, propertyValue: any): Function;
