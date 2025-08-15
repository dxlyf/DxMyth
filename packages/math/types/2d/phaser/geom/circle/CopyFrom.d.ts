export default CopyFrom;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Copies the `x`, `y` and `radius` properties from the `source` Circle
 * into the given `dest` Circle, then returns the `dest` Circle.
 *
 * @function Phaser.Geom.Circle.CopyFrom
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Circle} O - [dest,$return]
 *
 * @param {Phaser.Geom.Circle} source - The source Circle to copy the values from.
 * @param {Phaser.Geom.Circle} dest - The destination Circle to copy the values to.
 *
 * @return {Phaser.Geom.Circle} The destination Circle.
 */
declare function CopyFrom(source: Phaser.Geom.Circle, dest: Phaser.Geom.Circle): Phaser.Geom.Circle;
